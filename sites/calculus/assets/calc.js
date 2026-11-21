/* =====================================================================
 * assets/calc.js · 公式演算台（CSC_CALC）
 * ---------------------------------------------------------------------
 * CONTRACT §3.3 / §4.4：章节 block `{t:'calc', title, desc, mode, expr?, args?}`
 * 由 app.js 的 hydrateCalc() 调 window.CSC_CALC.mount(bodyEl, def)。
 *
 * 六种模式
 *   graph       画 y=f(x)，拖拽 / 滚轮缩放，零点与极值读数
 *   derivative  f 与 f′ 同图，某点数值导数 + 符号求导（LaTeX）
 *   integral    Simpson 数值积分 + 曲线下面积 + 黎曼和步数滑块
 *   limit       x→a± 双侧数值表（h 逐档缩小），判定极限是否存在
 *   taylor      各阶系数 c_k + 展开多项式（LaTeX）+ 近似曲线对比
 *   solve       方程数值求根（多根，指定区间）
 *
 * 表达式解析 / 化简 / 符号求导 / LaTeX 输出改写自旧站 assets/calc-raw.js；
 * 数值方法（中心差分、复化 Simpson、扫描+二分求根）取自 labs-raw.js 的
 * SITE_NUM 内核；绘图为原生 Canvas 2D（深空天文台配色），零依赖。
 *
 * 对外接口
 *   window.CSC_CALC = {
 *     mount(bodyEl, def),
 *     eval(expr, x) -> number,
 *     derivative(expr) -> latex string,
 *     latex(expr) -> latex string,
 *     parse, simpson, roots, deriv, deriv2, version
 *   }
 * ===================================================================== */
(function () {
  'use strict';

  var PI = Math.PI;
  var VERSION = '1.0.0';

  /* ==================================================================
   * 0. 基础小工具
   * ================================================================== */
  function isNum(v) { return typeof v === 'number' && isFinite(v); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function spanEl(cls, text) {
    var n = document.createElement('span');
    if (cls) n.className = cls;
    if (text != null) n.textContent = String(text);
    return n;
  }
  function mkRow() {
    var r = el('div', 'calcRow');
    var head = arguments[0];
    if (head) {
      var lb = document.createElement('label');
      lb.textContent = String(head);
      r.appendChild(lb);
    }
    for (var i = 1; i < arguments.length; i++) {
      if (arguments[i]) r.appendChild(arguments[i]);
    }
    return r;
  }
  function mkInput(value, aria) {
    var i = document.createElement('input');
    i.type = 'text';
    i.value = value == null ? '' : String(value);
    i.spellcheck = false;
    i.autocomplete = 'off';
    i.setAttribute('aria-label', aria || '表达式');
    return i;
  }
  function mkBtn(text, fn) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'calcBtn';
    b.textContent = text;
    if (fn) b.addEventListener('click', fn);
    return b;
  }
  function mkSelect(pairs) {
    var s = document.createElement('select');
    pairs.forEach(function (p) {
      var o = document.createElement('option');
      o.value = p[0];
      o.textContent = p[1];
      s.appendChild(o);
    });
    return s;
  }
  function mkCanvas(label) {
    var cv = document.createElement('canvas');
    cv.className = 'calcCanvas';
    cv.width = 640;
    cv.height = 300;
    cv.setAttribute('role', 'img');
    cv.setAttribute('aria-label', label || '函数图像');
    return cv;
  }
  function hintEl(html) { return el('div', 'calcHint', html); }
  function outEl() { return el('div', 'calcOut'); }
  function errHtml(msg) { return '<span class="coErr">⚠ ' + esc(msg) + '</span>'; }
  function fmt(x, d) {
    if (!isNum(x)) return '—';
    if (x === 0) return '0';
    var a = Math.abs(x);
    var dd = d == null ? 6 : d;
    if (a < 1e-4 || a >= 1e6) return x.toExponential(3);
    var s = x.toFixed(dd);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  }
  function numArg(v, dflt) {
    var t = String(v == null ? '' : v).trim();
    if (!t) return dflt;
    if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(t)) return parseFloat(t);
    try {
      var x = ev(parse(t), {});
      if (isNum(x)) return x;
    } catch (e) { /* 落回默认值 */ }
    return dflt;
  }
  function readDomain(d, a, b) {
    if (Object.prototype.toString.call(d) === '[object Array]' && d.length >= 2) {
      var x = numArg(d[0], NaN), y = numArg(d[1], NaN);
      if (isNum(x) && isNum(y) && y > x) return [x, y];
    }
    return [a, b];
  }

  /* ==================================================================
   * 1. 词法（改写自 calc-raw.js，保持等价）
   * ================================================================== */
  var KNOWN = ['arcsin', 'arccos', 'arctan', 'log10', 'floor', 'sqrt', 'sinh', 'cosh', 'tanh',
    'ceil', 'sign', 'asin', 'acos', 'atan', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'exp',
    'abs', 'max', 'min', 'log', 'ln', 'pi', 'e', 'x', 'y', 'z', 't', 'n'];
  var FUNCS = {
    sin: 1, cos: 1, tan: 1, cot: 1, sec: 1, csc: 1, asin: 1, acos: 1, atan: 1, arcsin: 1,
    arccos: 1, arctan: 1, sinh: 1, cosh: 1, tanh: 1, exp: 1, ln: 1, log: 1, log10: 1,
    sqrt: 1, abs: 1, floor: 1, ceil: 1, sign: 1, max: 2, min: 2
  };

  function lex(src) {
    var s = String(src == null ? '' : src)
      .replace(/π/g, 'pi').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
      .replace(/√/g, 'sqrt').replace(/\s+/g, '');
    var out = [], i = 0, m;
    var NUMRE = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/;
    while (i < s.length) {
      var rest = s.slice(i), c = s.charAt(i);
      m = NUMRE.exec(rest);
      if (m) { out.push({ t: 'num', v: parseFloat(m[0]) }); i += m[0].length; continue; }
      var found = null, k;
      for (k = 0; k < KNOWN.length; k++) {
        if (rest.slice(0, KNOWN[k].length) === KNOWN[k]) { found = KNOWN[k]; break; }
      }
      if (found) { out.push({ t: 'name', v: found }); i += found.length; continue; }
      if ('+-*/^(),'.indexOf(c) >= 0) { out.push({ t: c }); i++; continue; }
      if (c === '=') { out.push({ t: '=' }); i++; continue; }
      throw new Error('无法识别的字符 “' + c + '”');
    }
    return out;
  }

  /* ==================================================================
   * 2. 语法（递归下降 + 隐式乘法）
   * ================================================================== */
  function parse(src) {
    var tk = lex(src), p = 0;
    function peek() { return tk[p]; }
    function next() { return tk[p++]; }
    function expect(t) {
      var x = next();
      if (!x || x.t !== t) throw new Error('缺少 “' + t + '”');
      return x;
    }
    function parseExpr() {
      var n = parseTerm();
      for (;;) {
        var x = peek();
        if (x && (x.t === '+' || x.t === '-')) { next(); n = { t: 'op', op: x.t, a: n, b: parseTerm() }; }
        else return n;
      }
    }
    function parseTerm() {
      var n = parseUnary();
      for (;;) {
        var x = peek();
        if (x && (x.t === '*' || x.t === '/')) { next(); n = { t: 'op', op: x.t, a: n, b: parseUnary() }; continue; }
        if (x && (x.t === 'num' || x.t === 'name' || x.t === '(')) {
          n = { t: 'op', op: '*', a: n, b: parseUnary() };
          continue;
        }
        return n;
      }
    }
    function parseUnary() {
      var x = peek();
      if (x && x.t === '-') { next(); return { t: 'neg', a: parseUnary() }; }
      if (x && x.t === '+') { next(); return parseUnary(); }
      return parsePower();
    }
    function parsePower() {
      var base = parseAtom(), x = peek();
      if (x && x.t === '^') { next(); return { t: 'op', op: '^', a: base, b: parseUnary() }; }
      return base;
    }
    function parseAtom() {
      var x = next();
      if (!x) throw new Error('表达式不完整');
      if (x.t === 'num') return { t: 'num', v: x.v };
      if (x.t === '(') { var e = parseExpr(); expect(')'); return e; }
      if (x.t === 'name') {
        var nm = x.v;
        if (FUNCS[nm]) {
          expect('(');
          var args = [parseExpr()];
          while (peek() && peek().t === ',') { next(); args.push(parseExpr()); }
          expect(')');
          return { t: 'call', name: nm, args: args };
        }
        if (nm === 'pi') return { t: 'num', v: PI };
        if (nm === 'e') return { t: 'num', v: Math.E };
        return { t: 'var', name: nm };
      }
      throw new Error('意外的符号');
    }
    var ast = parseExpr();
    if (p < tk.length) throw new Error('多余的符号（位置 ' + (p + 1) + '）');
    return ast;
  }

  /* ==================================================================
   * 3. 求值
   * ================================================================== */
  var FN = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    cot: function (x) { return 1 / Math.tan(x); },
    sec: function (x) { return 1 / Math.cos(x); },
    csc: function (x) { return 1 / Math.sin(x); },
    asin: Math.asin, acos: Math.acos, atan: Math.atan,
    arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
    sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh, exp: Math.exp,
    ln: Math.log, log: Math.log,
    log10: function (x) { return Math.log(x) / Math.LN10; },
    sqrt: Math.sqrt, abs: Math.abs, floor: Math.floor, ceil: Math.ceil,
    sign: function (x) { return x > 0 ? 1 : x < 0 ? -1 : 0; },
    max: Math.max, min: Math.min
  };
  function ev(n, env) {
    env = env || {};
    if (!n) return NaN;
    switch (n.t) {
      case 'num': return n.v;
      case 'var': return env[n.name] === undefined ? NaN : env[n.name];
      case 'neg': return -ev(n.a, env);
      case 'op': {
        var a = ev(n.a, env), b = ev(n.b, env);
        if (n.op === '+') return a + b;
        if (n.op === '-') return a - b;
        if (n.op === '*') return a * b;
        if (n.op === '/') return a / b;
        return Math.pow(a, b);
      }
      case 'call': {
        var f = FN[n.name];
        if (!f) return NaN;
        var args = n.args.map(function (x) { return ev(x, env); });
        return f.apply(null, args);
      }
    }
    return NaN;
  }
  function compile(ast) {
    return function (x) { return ev(ast, { x: x }); };
  }
  function varsOf(ast) {
    var out = [];
    (function walk(n) {
      if (!n) return;
      if (n.t === 'var') { if (out.indexOf(n.name) < 0) out.push(n.name); return; }
      if (n.t === 'neg') { walk(n.a); return; }
      if (n.t === 'op') { walk(n.a); walk(n.b); return; }
      if (n.t === 'call') { n.args.forEach(walk); }
    })(ast);
    return out;
  }
  function checkVar(ast) {
    var vs = varsOf(ast).filter(function (v) { return v !== 'x'; });
    if (vs.length) {
      throw new Error('只支持单变量 x，请把 ' + vs.join('、') + ' 换成具体数值');
    }
  }
  function hasNaN(ast) {
    if (!ast) return true;
    if (ast.t === 'num') return !isNum(ast.v);
    if (ast.t === 'neg') return hasNaN(ast.a);
    if (ast.t === 'op') return hasNaN(ast.a) || hasNaN(ast.b);
    if (ast.t === 'call') return ast.args.some(hasNaN);
    return false;
  }

  /* ==================================================================
   * 4. 化简（改写自 calc-raw.js，补同类项合并）
   * ================================================================== */
  function N(v) { return { t: 'num', v: v }; }
  function op(o, a, b) { return { t: 'op', op: o, a: a, b: b }; }
  function call(nm, a) { return { t: 'call', name: nm, args: [a] }; }

  function sameAst(a, b) {
    if (!a || !b) return false;
    if (a === b) return true;
    if (a.t !== b.t) return false;
    if (a.t === 'num') return a.v === b.v;
    if (a.t === 'var') return a.name === b.name;
    if (a.t === 'neg') return sameAst(a.a, b.a);
    if (a.t === 'op') return a.op === b.op && sameAst(a.a, b.a) && sameAst(a.b, b.b);
    if (a.t === 'call') {
      return a.name === b.name && a.args.length === b.args.length &&
        a.args.every(function (x, i) { return sameAst(x, b.args[i]); });
    }
    return false;
  }
  function coefOf(n) {
    if (n.t === 'num') return { c: n.v, rest: N(1) };
    if (n.t === 'neg') { var r = coefOf(n.a); return { c: -r.c, rest: r.rest }; }
    if (n.t === 'op' && n.op === '*') {
      if (n.a.t === 'num') return { c: n.a.v, rest: n.b };
      if (n.b.t === 'num') return { c: n.b.v, rest: n.a };
    }
    return { c: 1, rest: n };
  }

  function simp(n) {
    if (!n) return N(NaN);
    if (n.t === 'num' || n.t === 'var') return n;
    if (n.t === 'neg') {
      var a0 = simp(n.a);
      if (a0.t === 'num') return N(-a0.v);
      if (a0.t === 'neg') return a0.a;
      return { t: 'neg', a: a0 };
    }
    if (n.t === 'call') {
      var ca = { t: 'call', name: n.name, args: n.args.map(simp) };
      if (ca.args.every(function (x) { return x.t === 'num'; })) {
        var v0 = ev(ca, {});
        if (isNum(v0)) return N(v0);
      }
      return ca;
    }
    var A = simp(n.a), B = simp(n.b), o = n.op;

    if (A.t === 'num' && B.t === 'num') {
      var v = ev({ t: 'op', op: o, a: A, b: B }, {});
      if (isNum(v) && Math.abs(v) < 1e15) return N(v);
    }
    if (o === '+') {
      if (A.t === 'num' && A.v === 0) return B;
      if (B.t === 'num' && B.v === 0) return A;
      var cA = coefOf(A), cB = coefOf(B);
      if (sameAst(cA.rest, cB.rest)) {
        var k = cA.c + cB.c;
        if (Math.abs(k) < 1e-15) return N(0);
        if (Math.abs(k - 1) < 1e-15) return cA.rest;
        if (Math.abs(k + 1) < 1e-15) return { t: 'neg', a: cA.rest };
        return op('*', N(k), cA.rest);
      }
      return op('+', A, B);
    }
    if (o === '-') {
      if (B.t === 'num' && B.v === 0) return A;
      if (A.t === 'num' && A.v === 0) return { t: 'neg', a: B };
      return simp(op('+', A, { t: 'neg', a: B }));
    }
    if (o === '*') {
      if ((A.t === 'num' && A.v === 0) || (B.t === 'num' && B.v === 0)) return N(0);
      if (A.t === 'num' && A.v === 1) return B;
      if (B.t === 'num' && B.v === 1) return A;
      if (A.t === 'num' && A.v === -1) return { t: 'neg', a: B };
      if (B.t === 'num' && B.v === -1) return { t: 'neg', a: A };
      if (A.t === 'num' && B.t === 'op' && B.op === '*' && B.a.t === 'num') {
        return op('*', N(A.v * B.a.v), B.b);
      }
      if (B.t === 'num' && A.t === 'op' && A.op === '*' && A.a.t === 'num') {
        return op('*', N(A.a.v * B.v), A.b);
      }
      return op('*', A, B);
    }
    if (o === '/') {
      if (B.t === 'num' && B.v === 1) return A;
      if (A.t === 'num' && A.v === 0) return N(0);
      if (A.t === 'num' && B.t === 'num' && B.v !== 0) {
        var q = A.v / B.v;
        if (isNum(q) && Math.abs(q) < 1e15) return N(q);
      }
      return op('/', A, B);
    }
    if (o === '^') {
      if (B.t === 'num' && B.v === 0) return N(1);
      if (B.t === 'num' && B.v === 1) return A;
      if (A.t === 'num' && A.v === 0 && B.t === 'num' && B.v > 0) return N(0);
      if (A.t === 'num' && A.v === 1) return N(1);
      if (A.t === 'op' && A.op === '^' && A.b.t === 'num' && B.t === 'num') {
        return N(Math.pow(A.a.t === 'num' ? A.a.v : NaN, A.b.v * B.v));
      }
      return op('^', A, B);
    }
    return op(o, A, B);
  }

  /* ==================================================================
   * 5. 符号求导（改写自 calc-raw.js）
   * ================================================================== */
  function diff(n, v) {
    if (!n) return N(0);
    switch (n.t) {
      case 'num': return N(0);
      case 'var': return N(n.name === v ? 1 : 0);
      case 'neg': return { t: 'neg', a: diff(n.a, v) };
      case 'call': return diffCall(n, v);
      case 'op': return diffOp(n, v);
    }
    return N(0);
  }
  function diffOp(n, v) {
    var A = n.a, B = n.b, dA = diff(A, v), dB = diff(B, v);
    if (n.op === '+' || n.op === '-') return op(n.op, dA, dB);
    if (n.op === '*') return op('+', op('*', dA, B), op('*', A, dB));
    if (n.op === '/') return op('/', op('-', op('*', dA, B), op('*', A, dB)), op('^', B, N(2)));
    if (n.op === '^') {
      if (B.t === 'num') return op('*', op('*', N(B.v), op('^', A, N(B.v - 1))), dA);
      if (A.t === 'num') return op('*', op('*', n, call('ln', A)), dB);
      return op('*', n, op('+', op('*', dB, call('ln', A)), op('/', op('*', B, dA), A)));
    }
    return N(0);
  }
  function diffCall(n, v) {
    var u = n.args[0], du = diff(u, v);
    switch (n.name) {
      case 'sin': return op('*', call('cos', u), du);
      case 'cos': return { t: 'neg', a: op('*', call('sin', u), du) };
      case 'tan': return op('/', du, op('^', call('cos', u), N(2)));
      case 'cot': return { t: 'neg', a: op('/', du, op('^', call('sin', u), N(2))) };
      case 'sec': return op('*', op('*', call('sec', u), call('tan', u)), du);
      case 'csc': return { t: 'neg', a: op('*', op('*', call('csc', u), call('cot', u)), du) };
      case 'asin': case 'arcsin':
        return op('/', du, call('sqrt', op('-', N(1), op('^', u, N(2)))));
      case 'acos': case 'arccos':
        return { t: 'neg', a: op('/', du, call('sqrt', op('-', N(1), op('^', u, N(2))))) };
      case 'atan': case 'arctan': return op('/', du, op('+', N(1), op('^', u, N(2))));
      case 'sinh': return op('*', call('cosh', u), du);
      case 'cosh': return op('*', call('sinh', u), du);
      case 'tanh': return op('/', du, op('^', call('cosh', u), N(2)));
      case 'exp': return op('*', call('exp', u), du);
      case 'ln': case 'log': return op('/', du, u);
      case 'log10': return op('/', du, op('*', u, call('ln', N(10))));
      case 'sqrt': return op('/', du, op('*', N(2), call('sqrt', u)));
      case 'abs': return op('*', call('sign', u), du);
      case 'floor': case 'ceil': case 'sign': return N(0);
      default: return N(NaN);
    }
  }

  /* ==================================================================
   * 6. LaTeX 输出（改写自 calc-raw.js，数值加分数识别）
   * ================================================================== */
  var SUP = {
    '0': '\u2070', '1': '\u00b9', '2': '\u00b2', '3': '\u00b3', '4': '\u2074',
    '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079',
    '-': '\u207b', '+': ''
  };
  function plainNum(v) {
    if (!isNum(v)) return '—';
    if (v === 0) return '0';
    var a = Math.abs(v);
    if (a >= 1e-4 && a < 1e7) return String(Math.round(v * 1e6) / 1e6);
    var s = v.toExponential(3).split('e');
    return s[0] + '×10' + String(s[1]).split('').map(function (ch) {
      return SUP[ch] === undefined ? ch : SUP[ch];
    }).join('');
  }
  function asFraction(v) {
    if (!isNum(v) || Math.abs(v) > 1e5) return null;
    var r = Math.round(v);
    if (Math.abs(v - r) < 1e-10) return String(r);
    var sign = v < 0 ? '-' : '';
    var a = Math.abs(v);
    for (var q = 2; q <= 32; q++) {
      var p = Math.round(a * q);
      if (p > 0 && Math.abs(a - p / q) <= 1e-10 * Math.max(1, a)) {
        return sign + '\\frac{' + p + '}{' + q + '}';
      }
    }
    return null;
  }
  function numTex(v) {
    if (!isNum(v)) return '\\text{—}';
    if (Math.abs(v - PI) < 1e-12) return '\\pi';
    if (Math.abs(v - Math.E) < 1e-12) return 'e';
    if (Math.abs(v) < 1e-15) return '0';
    var f = asFraction(v);
    if (f) return f;
    if (Math.abs(v) >= 1e6 || Math.abs(v) < 1e-4) {
      return v.toExponential(4).replace('e', '\\times 10^{') + '}';
    }
    return String(Math.round(v * 1e10) / 1e10);
  }
  var TEXF = {
    asin: '\\arcsin', acos: '\\arccos', atan: '\\arctan',
    arcsin: '\\arcsin', arccos: '\\arccos', arctan: '\\arctan',
    ln: '\\ln', log: '\\ln', sign: '\\operatorname{sgn}',
    cot: '\\cot', sec: '\\sec', csc: '\\csc'
  };
  function mulSym(a, b, imp) {
    if (!imp) return '\\cdot ';
    if (a.t === 'num' && b.t === 'num') return '\\cdot ';
    return '';
  }
  function tex(n, imp) {
    if (!n) return '?';
    switch (n.t) {
      case 'num': return numTex(n.v);
      case 'var': return n.name;
      case 'neg': return '-' + wrap(n.a, 2, 'r', imp);
      case 'op': {
        if (n.op === '/') return '\\frac{' + tex(n.a, imp) + '}{' + tex(n.b, imp) + '}';
        if (n.op === '^') return wrap(n.a, 3, 'l', imp) + '^{' + tex(n.b, imp) + '}';
        if (n.op === '+') {
          if (n.b.t === 'neg') return wrap(n.a, 1, 'l', imp) + ' - ' + wrap(n.b.a, 1, 'r', imp);
          if (n.b.t === 'num' && n.b.v < 0) {
            return wrap(n.a, 1, 'l', imp) + ' - ' + numTex(-n.b.v);
          }
          return wrap(n.a, 1, 'l', imp) + ' + ' + wrap(n.b, 1, 'r', imp);
        }
        if (n.op === '-') {
          if (n.b.t === 'neg') return wrap(n.a, 1, 'l', imp) + ' + ' + wrap(n.b.a, 1, 'r', imp);
          if (n.b.t === 'num' && n.b.v < 0) {
            return wrap(n.a, 1, 'l', imp) + ' + ' + numTex(-n.b.v);
          }
          return wrap(n.a, 1, 'l', imp) + ' - ' + wrap(n.b, 1, 'r', imp);
        }
        var p = 2;
        var sym = mulSym(n.a, n.b, imp);
        return wrap(n.a, p, 'l', imp) + sym + wrap(n.b, p, 'r', imp);
      }
      case 'call': {
        var xs = n.args.map(function (a) { return tex(a, imp); });
        if (n.name === 'sqrt') return '\\sqrt{' + xs[0] + '}';
        if (n.name === 'abs') return '\\left|' + xs[0] + '\\right|';
        if (n.name === 'exp') return 'e^{' + xs[0] + '}';
        if (n.name === 'floor') return '\\lfloor ' + xs[0] + ' \\rfloor';
        if (n.name === 'ceil') return '\\lceil ' + xs[0] + ' \\rceil';
        if (n.name === 'log10') return '\\log_{10}\\!\\left(' + xs[0] + '\\right)';
        return (TEXF[n.name] || ('\\' + n.name)) + '\\left(' + xs.join(',\\,') + '\\right)';
      }
    }
    return '?';
  }
  function precOf(n) {
    if (n.t === 'op') return (n.op === '+' || n.op === '-') ? 1 : (n.op === '^' ? 3 : 2);
    if (n.t === 'neg') return 2;
    return 9;
  }
  function wrap(n, p, side, imp) {
    var s = tex(n, imp), np = precOf(n);
    if (np < p || (np === p && side === 'r' &&
      ((n.t === 'op' && (n.op === '-' || n.op === '/')) || n.t === 'neg'))) {
      return '\\left(' + s + '\\right)';
    }
    /* 乘法右侧的负数要括号，否则 “x-3” 会被读成减法 */
    if (n.t === 'num' && n.v < 0 && side === 'r' && p >= 2) {
      return '\\left(' + s + '\\right)';
    }
    return s;
  }

  /* ---------------- 多项式 ---------------- */
  function addP(a, b) {
    var n = Math.max(a.length, b.length), r = [], i;
    for (i = 0; i < n; i++) r.push((a[i] || 0) + (b[i] || 0));
    return r;
  }
  function mulP(a, b) {
    var r = [], i, j;
    for (i = 0; i < a.length + b.length - 1; i++) r.push(0);
    for (i = 0; i < a.length; i++) {
      for (j = 0; j < b.length; j++) r[i + j] += a[i] * b[j];
    }
    return r;
  }
  function powP(a, k) {
    var r = [1];
    for (var i = 0; i < k; i++) r = mulP(r, a);
    return r;
  }
  function polyOf(n, v) {
    if (!n) return null;
    if (n.t === 'num') return [n.v];
    if (n.t === 'var') return n.name === v ? [0, 1] : null;
    if (n.t === 'neg') { var c = polyOf(n.a, v); return c && c.map(function (x) { return -x; }); }
    if (n.t === 'call') {
      var val = ev(n, {});
      return isNum(val) ? [val] : null;
    }
    if (n.t === 'op') {
      var A = polyOf(n.a, v), B = polyOf(n.b, v);
      if (!A || !B) return null;
      if (n.op === '+') return addP(A, B);
      if (n.op === '-') return addP(A, B.map(function (x) { return -x; }));
      if (n.op === '*') return mulP(A, B);
      if (n.op === '/') {
        if (B.length !== 1 || Math.abs(B[0]) < 1e-15) return null;
        return A.map(function (x) { return x / B[0]; });
      }
      if (n.op === '^') {
        if (B.length !== 1) return null;
        var k = B[0];
        if (Math.abs(k - Math.round(k)) > 1e-9 || k < 0 || k > 12) return null;
        return powP(A, Math.round(k));
      }
    }
    return null;
  }
  function polyEval(c, x) {
    var s = 0, p = 1, i;
    for (i = 0; i < c.length; i++) { s += c[i] * p; p *= x; }
    return s;
  }
  function texPoly(c, v) {
    var s = '', first = true, i;
    for (i = c.length - 1; i >= 0; i--) {
      var a = Math.round(c[i] * 1e12) / 1e12;
      if (Math.abs(a) < 1e-12) continue;
      var av = Math.abs(a);
      var coef = (i > 0 && Math.abs(av - 1) < 1e-12) ? '' : numTex(av);
      var vv = i === 0 ? '' : (i === 1 ? v : v + '^{' + i + '}');
      var term = coef + vv;
      if (first) { s += (a < 0 ? '-' : '') + term; first = false; }
      else { s += (a < 0 ? ' - ' : ' + ') + term; }
    }
    return s || '0';
  }

  /* ==================================================================
   * 7. 数值方法（取自 labs-raw.js SITE_NUM 内核）
   * ================================================================== */
  function deriv(f, x) {
    var h = 1e-5 * Math.max(1, Math.abs(x));
    return (f(x + h) - f(x - h)) / (2 * h);
  }
  function deriv2(f, x) {
    var h = 1e-4 * Math.max(1, Math.abs(x));
    return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
  }
  function simpson(f, a, b, n) {
    n = n || 2000;
    if (n % 2) n++;
    var h = (b - a) / n, s = f(a) + f(b), i;
    for (i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
    return s * h / 3;
  }
  function bisect(g, a, b) {
    var fa = g(a), fb = g(b), m, fm;
    if (fa === 0) return a;
    if (fb === 0) return b;
    if (!isNum(fa) || !isNum(fb) || fa * fb > 0) return null;
    for (var i = 0; i < 90; i++) {
      m = (a + b) / 2;
      fm = g(m);
      if (fm === 0 || (b - a) < 1e-13) return m;
      if (!isNum(fm)) return null;
      if (fa * fm < 0) { b = m; fb = fm; } else { a = m; fa = fm; }
    }
    return (a + b) / 2;
  }
  function roots(g, a, b, n) {
    n = n || 600;
    var out = [], h = (b - a) / n, prev = g(a), x, cur;
    for (x = 1; x <= n; x++) {
      cur = g(a + x * h);
      if (isNum(prev) && isNum(cur) && prev * cur <= 0 && (prev !== 0 || cur !== 0)) {
        var r = bisect(g, a + (x - 1) * h, a + x * h);
        if (r !== null && isNum(r)) {
          var tol = Math.max(1e-9, Math.abs(r) * 1e-7);
          if (!out.some(function (q) { return Math.abs(q - r) < tol; })) out.push(r);
        }
      }
      prev = cur;
    }
    return out;
  }
  function niceStep(range, target) {
    var raw = range / Math.max(1, target);
    var mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var n = raw / mag;
    var s = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
    return s * mag;
  }
  /* 极值：先试符号导数 f′ 的零点，再看 f′ 的符号变化（比邻域高低更稳）；
     符号导数不可用时退回数值导数 */
  function extrema(ast, f, a, b) {
    var d = null, g = null;
    try {
      d = simp(simp(diff(ast, 'x')));
      if (!hasNaN(d)) g = compile(d);
    } catch (e) { g = null; }
    if (!g) g = function (x) { return deriv(f, x); };
    var cs = roots(g, a, b, 700);
    var out = [];
    cs.forEach(function (c) {
      var h = Math.max(1e-3, Math.abs(c) * 1e-3);
      var y0 = f(c);
      if (!isNum(y0)) return;
      var gl = g(c - h), gr = g(c + h);
      var kind = '';
      if (isNum(gl) && isNum(gr)) {
        if (gl < 0 && gr > 0) kind = 'min';
        else if (gl > 0 && gr < 0) kind = 'max';
      }
      if (!kind) {
        var yl = f(c - h), yr = f(c + h);
        if (!isNum(yl) || !isNum(yr)) return;
        if (y0 <= yl && y0 <= yr) kind = 'min';
        else if (y0 >= yl && y0 >= yr) kind = 'max';
      }
      if (kind) out.push({ x: c, y: y0, kind: kind });
    });
    return out;
  }
  function autoY(fns, a, b) {
    var ys = [], i, k;
    for (k = 0; k < fns.length; k++) {
      for (i = 0; i <= 300; i++) {
        var y = fns[k](a + (b - a) * i / 300);
        if (isNum(y)) ys.push(y);
      }
    }
    if (!ys.length) return [-5, 5];
    ys.sort(function (p, q) { return p - q; });
    var lo = ys[Math.floor(ys.length * 0.02)];
    var hi = ys[Math.min(ys.length - 1, Math.floor(ys.length * 0.98))];
    if (!(hi > lo)) { lo = ys[0]; hi = ys[ys.length - 1]; }
    if (!(hi > lo)) { lo -= 1; hi += 1; }
    var pad = (hi - lo) * 0.16;
    return [lo - pad, hi + pad];
  }

  /* ==================================================================
   * 8. Canvas 2D 视图
   * ================================================================== */
  var C = {
    grid: '#3b4e6b',
    axis: 'rgba(232,232,232,.45)',
    curve: '#d7ab61',
    curve2: '#9fc0e2',
    fill: 'rgba(215,171,97,.14)',
    fill2: 'rgba(159,192,226,.07)',
    hot: '#e06236',
    dim: '#6d7d8c',
    text: '#e8e8e8'
  };
  var MONO = '10px "Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

  function tickLabel(v, step) {
    var d = Math.max(0, Math.ceil(-Math.log(Math.abs(step)) / Math.LN10));
    var s = v.toFixed(Math.min(8, d));
    return s === '-0' ? '0' : s;
  }

  function View(cv, box) {
    this.cv = cv;
    this.ctx = cv.getContext && cv.getContext('2d');
    if (!this.ctx) throw new Error('当前浏览器不支持 Canvas 2D');
    this.box = { x0: box.x0, x1: box.x1, y0: box.y0, y1: box.y1, h: box.h || 0 };
    this.pad = { l: 40, r: 14, t: 14, b: 24 };
    this.x0 = box.x0; this.x1 = box.x1;
    this.y0 = box.y0; this.y1 = box.y1;
    this.W = 640; this.H = 300;
    this._dragging = false;
    this.fit();
  }
  View.prototype.fit = function () {
    var cv = this.cv;
    var w = Math.round(cv.clientWidth || 0);
    if (!w) w = Math.round(cv.getBoundingClientRect().width || 0);
    if (!w) w = 640;
    var h = this.box.h || (w < 560 ? 240 : 300);
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    cv.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.W = w; this.H = h;
    return this;
  };
  View.prototype.px = function (x) {
    var p = this.pad;
    return p.l + (x - this.x0) / (this.x1 - this.x0) * (this.W - p.l - p.r);
  };
  View.prototype.py = function (y) {
    var p = this.pad;
    return this.H - p.b - (y - this.y0) / (this.y1 - this.y0) * (this.H - p.t - p.b);
  };
  View.prototype.ux = function (sx) {
    var p = this.pad;
    return this.x0 + (sx - p.l) / (this.W - p.l - p.r) * (this.x1 - this.x0);
  };
  View.prototype.uy = function (sy) {
    var p = this.pad;
    return this.y0 + (this.H - p.b - sy) / (this.H - p.t - p.b) * (this.y1 - this.y0);
  };
  View.prototype.pan = function (dxPx, dyPx) {
    var kx = (this.x1 - this.x0) / (this.W - this.pad.l - this.pad.r);
    var ky = (this.y1 - this.y0) / (this.H - this.pad.t - this.pad.b);
    this.x0 -= dxPx * kx; this.x1 -= dxPx * kx;
    this.y0 += dyPx * ky; this.y1 += dyPx * ky;
  };
  View.prototype.zoomAt = function (sx, sy, k) {
    var x = this.ux(sx), y = this.uy(sy);
    var nx0 = x + (this.x0 - x) * k, nx1 = x + (this.x1 - x) * k;
    var ny0 = y + (this.y0 - y) * k, ny1 = y + (this.y1 - y) * k;
    if (!(nx1 - nx0 > 1e-10) || !(ny1 - ny0 > 1e-10)) return;
    if (!(nx1 - nx0 < 1e10) || !(ny1 - ny0 < 1e10)) return;
    this.x0 = nx0; this.x1 = nx1; this.y0 = ny0; this.y1 = ny1;
  };
  View.prototype.axes = function () {
    var c = this.ctx, p = this.pad;
    var L = p.l, R = this.W - p.r, T = p.t, B = this.H - p.b;
    c.clearRect(0, 0, this.W, this.H);
    if (R - L < 20 || B - T < 20) return;
    var v = this;
    var sx = niceStep(this.x1 - this.x0, Math.max(3, Math.round((R - L) / 92)));
    var sy = niceStep(this.y1 - this.y0, Math.max(2, Math.round((B - T) / 58)));
    var xs = [], ys = [], i, q;
    for (i = Math.ceil(this.x0 / sx) * sx; i <= this.x1 + 1e-9; i += sx) xs.push(i);
    for (i = Math.ceil(this.y0 / sy) * sy; i <= this.y1 + 1e-9; i += sy) ys.push(i);
    var ax = Math.min(Math.max(this.py(0), T), B);
    var ay = Math.min(Math.max(this.px(0), L), R);

    c.save();
    c.beginPath();
    c.rect(L, T, R - L, B - T);
    c.clip();
    /* 网格 */
    c.strokeStyle = C.grid;
    c.lineWidth = 1;
    c.beginPath();
    for (i = 0; i < xs.length; i++) {
      q = Math.round(v.px(xs[i])) + 0.5;
      if (q <= L || q >= R || Math.abs(q - ax) < 0.8) continue;
      c.moveTo(q, T); c.lineTo(q, B);
    }
    for (i = 0; i < ys.length; i++) {
      q = Math.round(v.py(ys[i])) + 0.5;
      if (q <= T || q >= B || Math.abs(q - ay) < 0.8) continue;
      c.moveTo(L, q); c.lineTo(R, q);
    }
    c.stroke();
    /* 坐标轴 */
    c.strokeStyle = C.axis;
    c.lineWidth = 1.2;
    c.beginPath();
    c.moveTo(L, Math.round(ax) + 0.5); c.lineTo(R, Math.round(ax) + 0.5);
    c.moveTo(Math.round(ay) + 0.5, T); c.lineTo(Math.round(ay) + 0.5, B);
    c.stroke();
    /* 箭头 */
    c.fillStyle = C.axis;
    c.beginPath(); c.moveTo(R - 1, ax); c.lineTo(R - 8, ax - 3.2); c.lineTo(R - 8, ax + 3.2); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(ay, T + 1); c.lineTo(ay - 3.2, T + 8); c.lineTo(ay + 3.2, T + 8); c.closePath(); c.fill();
    /* 刻度数字 */
    c.font = MONO;
    c.fillStyle = C.dim;
    c.textBaseline = 'top';
    c.textAlign = 'center';
    var labY = ax + 5 <= B - 11 ? ax + 4 : Math.max(T + 1, ax - 15);
    for (i = 0; i < xs.length; i++) {
      if (Math.abs(xs[i]) < 1e-12) continue;
      var px = v.px(xs[i]);
      if (px < L + 10 || px > R - 10) continue;
      c.fillText(tickLabel(xs[i], sx), px, labY);
    }
    c.textBaseline = 'middle';
    c.textAlign = 'right';
    var labX = ay - 5 >= L + 24 ? ay - 5 : Math.min(R - 4, ay + 5);
    for (i = 0; i < ys.length; i++) {
      if (Math.abs(ys[i]) < 1e-12) continue;
      var py = v.py(ys[i]);
      if (py < T + 6 || py > B - 6) continue;
      c.fillText(tickLabel(ys[i], sy), labX, py);
    }
    c.restore();
  };
  /* 采样成连续段：NaN 与竖直跳变处断开 */
  View.prototype.segments = function (f, a, b, step) {
    var L = this.pad.l, R = this.W - this.pad.r, T = this.pad.t, B = this.H - this.pad.b;
    var sx0 = Math.max(L, Math.min(R, this.px(a)));
    var sx1 = Math.max(L, Math.min(R, this.px(b)));
    if (!(sx1 > sx0)) return [];
    var segs = [], cur = null, prevSy = null;
    for (var sx = sx0; sx <= sx1 + 0.001; sx += step) {
      var x = this.ux(sx), y = f(x);
      if (!isNum(y)) { cur = null; prevSy = null; continue; }
      var sy = this.py(y);
      if (!isNum(sy)) { cur = null; prevSy = null; continue; }
      if (cur && prevSy !== null && Math.abs(sy - prevSy) > (B - T) * 1.5) { cur = null; }
      if (!cur) { cur = []; segs.push(cur); }
      cur.push({ sx: sx, sy: sy });
      prevSy = sy;
    }
    return segs;
  };
  View.prototype.curve = function (f, color, w) {
    var c = this.ctx, p = this.pad;
    var segs = this.segments(f, this.x0, this.x1, 0.6);
    c.save();
    c.beginPath();
    c.rect(p.l, p.t, this.W - p.l - p.r, this.H - p.t - p.b);
    c.clip();
    c.strokeStyle = color || C.curve;
    c.lineWidth = w || 2;
    c.lineJoin = 'round';
    c.lineCap = 'round';
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (s.length < 2) continue;
      c.beginPath();
      c.moveTo(s[0].sx, s[0].sy);
      for (var j = 1; j < s.length; j++) c.lineTo(s[j].sx, s[j].sy);
      c.stroke();
    }
    c.restore();
  };
  View.prototype.area = function (f, a, b, fill) {
    var c = this.ctx, p = this.pad;
    var xa = Math.max(a, this.x0), xb = Math.min(b, this.x1);
    if (!(xb > xa)) return;
    var segs = this.segments(f, xa, xb, 0.8);
    if (!segs.length) return;
    var base = Math.min(Math.max(this.py(0), p.t), this.H - p.b);
    c.save();
    c.beginPath();
    c.rect(p.l, p.t, this.W - p.l - p.r, this.H - p.t - p.b);
    c.clip();
    c.fillStyle = fill || C.fill;
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (s.length < 2) continue;
      c.beginPath();
      c.moveTo(s[0].sx, base);
      for (var j = 0; j < s.length; j++) c.lineTo(s[j].sx, s[j].sy);
      c.lineTo(s[s.length - 1].sx, base);
      c.closePath();
      c.fill();
    }
    c.restore();
  };
  View.prototype.rects = function (f, a, b, n) {
    if (n > 64) return;
    var c = this.ctx, p = this.pad;
    var dx = (b - a) / n;
    var base = Math.min(Math.max(this.py(0), p.t), this.H - p.b);
    c.save();
    c.beginPath();
    c.rect(p.l, p.t, this.W - p.l - p.r, this.H - p.t - p.b);
    c.clip();
    c.fillStyle = C.fill2;
    c.strokeStyle = 'rgba(159,192,226,.40)';
    c.lineWidth = 1;
    for (var i = 0; i < n; i++) {
      var x0 = a + dx * i, xm = x0 + dx / 2;
      var y = f(xm);
      if (!isNum(y)) continue;
      var sx = this.px(x0), w = this.px(x0 + dx) - sx;
      var sy = this.py(y);
      var top = Math.min(sy, base), hh = Math.abs(base - sy);
      if (!(w > 0.4) || !(hh > 0.2)) continue;
      c.fillRect(sx, top, w, hh);
      c.strokeRect(Math.round(sx) + 0.5, Math.round(top) + 0.5, Math.max(1, Math.round(w) - 1), Math.max(1, Math.round(hh) - 1));
    }
    c.restore();
  };
  View.prototype.dot = function (x, y, color, r) {
    var c = this.ctx, p = this.pad;
    var sx = this.px(x), sy = this.py(y);
    if (!isNum(sx) || !isNum(sy)) return;
    if (sx < p.l - 2 || sx > this.W - p.r + 2 || sy < p.t - 2 || sy > this.H - p.b + 2) return;
    c.save();
    c.beginPath();
    c.arc(sx, sy, r || 3.2, 0, PI * 2);
    c.fillStyle = color || C.curve;
    c.fill();
    c.lineWidth = 1.2;
    c.strokeStyle = 'rgba(9,13,20,.85)';
    c.stroke();
    c.restore();
  };
  View.prototype.vline = function (x, color, dash) {
    var c = this.ctx, p = this.pad;
    var sx = this.px(x);
    if (!isNum(sx) || sx < p.l || sx > this.W - p.r) return;
    c.save();
    c.beginPath();
    c.rect(p.l, p.t, this.W - p.l - p.r, this.H - p.t - p.b);
    c.clip();
    c.setLineDash(dash || [4, 4]);
    c.strokeStyle = color || 'rgba(232,232,232,.22)';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(sx, p.t);
    c.lineTo(sx, this.H - p.b);
    c.stroke();
    c.restore();
  };
  View.prototype.text = function (s, sx, sy, color, align) {
    var c = this.ctx;
    c.save();
    c.font = MONO;
    c.textAlign = align || 'left';
    c.textBaseline = 'alphabetic';
    c.fillStyle = color || C.dim;
    c.fillText(s, sx, sy);
    c.restore();
  };
  View.prototype.legend = function (items) {
    var c = this.ctx, x = this.pad.l + 10, y = this.pad.t + 14;
    c.save();
    c.font = MONO;
    c.textBaseline = 'middle';
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      c.strokeStyle = it.color;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(x, y - 3);
      c.lineTo(x + 16, y - 3);
      c.stroke();
      c.fillStyle = C.dim;
      c.textAlign = 'left';
      c.fillText(it.label, x + 21, y);
      x += 21 + c.measureText(it.label).width + 18;
    }
    c.restore();
  };
  View.prototype.bindDrag = function (redraw, onDbl, onEnd) {
    var v = this, cv = this.cv;
    cv.style.cursor = 'grab';
    var lx = 0, ly = 0, moved = false, down = false;

    function onMove(e) {
      if (!down) return;
      var dx = e.clientX - lx, dy = e.clientY - ly;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      if (!moved) return;
      v.pan(dx, dy);
      lx = e.clientX; ly = e.clientY;
      if (redraw) redraw();
    }
    function onUp() {
      down = false;
      v._dragging = false;
      cv.style.cursor = 'grab';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (moved && onEnd) onEnd();
      moved = false;
    }
    cv.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      down = true;
      v._dragging = false;
      moved = false;
      lx = e.clientX; ly = e.clientY;
      cv.style.cursor = 'grabbing';
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      e.preventDefault();
    });
    /* 拖拽时把 _dragging 置真，供 hover 逻辑避让 */
    var origPan = v.pan;
    v.pan = function (dx, dy) {
      this._dragging = true;
      origPan.call(this, dx, dy);
    };
    cv.addEventListener('wheel', function (e) {
      e.preventDefault();
      var k = e.deltaY > 0 ? 1.18 : 1 / 1.18;
      v.zoomAt(e.offsetX, e.offsetY, k);
      v._dragging = true;
      if (redraw) redraw();
      if (onEnd) onEnd();
    }, { passive: false });
    cv.addEventListener('dblclick', function () {
      v._dragging = false;
      if (onDbl) onDbl();
    });
  };

  /* ==================================================================
   * 9. MathJax 排版
   * ================================================================== */
  function mathApi() {
    return (window.CSC && window.CSC.math) || window.CSC_MATH || null;
  }
  function mathReady() {
    var m = mathApi();
    if (!m) return Promise.resolve();
    if (typeof m.ready === 'function') {
      try {
        var r = m.ready();
        return (r && typeof r.then === 'function') ? r : Promise.resolve();
      } catch (e) { return Promise.resolve(); }
    }
    if (m.ready && typeof m.ready.then === 'function') return m.ready;
    return Promise.resolve();
  }
  function fitLoose(node) {
    var m = mathApi();
    if (m && typeof m.loose === 'function') {
      try { m.loose(node); } catch (e) { /* 缩放失败不影响阅读 */ }
    }
  }
  function typeset(node) {
    if (!node) return;
    mathReady().then(function () {
      if (!node.isConnected) return null;
      if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        return window.MathJax.typesetPromise([node]);
      }
      return null;
    }).then(function () {
      if (node.isConnected) fitLoose(node);
    }).catch(function (e) {
      if (window.console && console.debug) console.debug('[calc] 公式排版跳过：', e && e.message);
    });
  }

  /* ==================================================================
   * 10. 模式一：graph
   * ================================================================== */
  function modeGraph(body, def) {
    var args = def.args || {};
    var dom = readDomain(args.domain != null ? args.domain : args.range, -5, 5);
    var inF = mkInput(def.expr || 'x^3 - 3x + 1', '函数表达式');
    var inA = mkInput(fmt(dom[0], 3), '视野左界');
    var inB = mkInput(fmt(dom[1], 3), '视野右界');
    var btn = mkBtn('重绘');
    var cv = mkCanvas('函数图像');
    var out = outEl();
    var hint = hintEl('拖动平移 · 滚轮缩放 · 双击重置 · 蓝点为零点 · 橙点为极值');

    body.appendChild(mkRow('函数', inF));
    body.appendChild(mkRow('视野范围', inA, inB, btn));
    body.appendChild(cv);
    body.appendChild(out);
    body.appendChild(hint);

    var view = new View(cv, { x0: dom[0], x1: dom[1], y0: -5, y1: 5 });
    var st = { ast: null, f: null, err: '' };
    var cache = { roots: [], ext: [] };
    var hover = null, raf = 0, timer = 0;

    function analyze() {
      cache.roots = st.f ? roots(st.f, view.x0, view.x1, 600) : [];
      cache.ext = st.f ? extrema(st.ast, st.f, view.x0, view.x1) : [];
    }
    function readRange() {
      var a = numArg(inA.value, NaN), b = numArg(inB.value, NaN);
      if (isNum(a) && isNum(b) && b > a) return [a, b];
      return null;
    }
    function applyRange() {
      var r = readRange();
      if (r) { view.x0 = r[0]; view.x1 = r[1]; }
    }
    function yRange() {
      if (!st.f) return;
      var y = autoY([st.f], view.x0, view.x1);
      view.y0 = y[0]; view.y1 = y[1];
    }
    function compute(useInputRange) {
      st = { ast: null, f: null, err: '' };
      try {
        st.ast = parse(inF.value);
        checkVar(st.ast);
        st.f = compile(st.ast);
        if (!isNum(st.f(view.x0)) && !isNum(st.f((view.x0 + view.x1) / 2)) && !isNum(st.f(view.x1))) {
          /* 视野端点及中点都无定义：仍允许画，用户可拖拽 */
        }
      } catch (e) {
        st.err = e.message || String(e);
      }
      if (useInputRange) applyRange();
      yRange();
      analyze();
      redraw();
      updateOut();
    }
    function redraw() {
      view.axes();
      if (st.f) {
        view.curve(st.f, C.curve, 2);
        cache.roots.slice(0, 18).forEach(function (r) { view.dot(r, 0, C.curve2, 3); });
        cache.ext.slice(0, 10).forEach(function (e) { view.dot(e.x, e.y, C.hot, 3); });
      }
      if (hover && st.f) {
        var sx = hover.sx, sy = hover.sy;
        if (sx >= view.pad.l && sx <= view.W - view.pad.r &&
            sy >= view.pad.t && sy <= view.H - view.pad.b) {
          var x = view.ux(sx), y = st.f(x);
          if (isNum(y)) {
            view.vline(x, 'rgba(232,232,232,.16)', [3, 5]);
            view.dot(x, y, C.curve, 2.6);
            view.text('x = ' + fmt(x, 4) + '   f(x) = ' + fmt(y, 5),
              view.W - view.pad.r - 6, view.pad.t + 14, C.text, 'right');
          }
        }
      }
    }
    function updateOut() {
      if (st.err || !st.f) {
        out.innerHTML = errHtml(st.err || '表达式无法解析');
        typeset(out);
        return;
      }
      var html = '<div>$f(x) = ' + tex(st.ast, true) + '$</div>';
      var rs = cache.roots;
      html += '<div><span class="coK">零点</span> ' + (rs.length
        ? rs.slice(0, 8).map(function (r) { return 'x ≈ ' + fmt(r, 6); }).join('，') +
          (rs.length > 8 ? ' …（共 ' + rs.length + ' 个）' : '')
        : '当前视野内没有零点') + '</div>';
      var ex = cache.ext;
      if (ex.length) {
        html += '<div><span class="coK">极值</span> ' + ex.slice(0, 6).map(function (e) {
          return (e.kind === 'max' ? '极大 ' : '极小 ') +
            '(' + fmt(e.x, 4) + ', ' + fmt(e.y, 4) + ')';
        }).join('，') + (ex.length > 6 ? ' …' : '') + '</div>';
      } else {
        html += '<div><span class="coK">极值</span> 当前视野内没有驻点极值</div>';
      }
      html += '<div><span class="coK">视野</span> x ∈ [' + fmt(view.x0, 3) + ', ' + fmt(view.x1, 3) +
        ']，y ∈ [' + fmt(view.y0, 3) + ', ' + fmt(view.y1, 3) + ']</div>';
      out.innerHTML = html;
      typeset(out);
    }
    function scheduleRedraw() {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; redraw(); });
    }
    function afterViewChange() { analyze(); redraw(); updateOut(); }

    view.bindDrag(function () { analyze(); redraw(); },
      function () { applyRange(); yRange(); analyze(); redraw(); updateOut(); },
      function () { analyze(); redraw(); updateOut(); });

    cv.addEventListener('mousemove', function (e) {
      if (view._dragging) return;
      hover = { sx: e.offsetX, sy: e.offsetY };
      scheduleRedraw();
    });
    cv.addEventListener('mouseleave', function () {
      hover = null;
      view._dragging = false;
      scheduleRedraw();
    });
    inF.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { compute(false); }, 300);
    });
    [inA, inB].forEach(function (inp) {
      inp.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () { compute(true); }, 300);
      });
    });
    btn.addEventListener('click', function () { compute(true); });
    var rz = null;
    function onResize() {
      if (!cv.isConnected) { window.removeEventListener('resize', onResize); return; }
      clearTimeout(rz);
      rz = setTimeout(function () {
        view.fit();
        analyze();
        redraw();
      }, 200);
    }
    window.addEventListener('resize', onResize);

    compute(true);
  }

  /* ==================================================================
   * 11. 模式二：derivative
   * ================================================================== */
  function modeDerivative(body, def) {
    var args = def.args || {};
    /* 求导点：章节作者可能写 args.x0 / args.x / args.a，三种都认 */
    var x0arg = args.x0 != null ? args.x0 : (args.x != null ? args.x : args.a);
    var inF = mkInput(def.expr || 'x^3 - 3x + 1', '函数表达式');
    var inX = mkInput(x0arg != null ? String(x0arg) : '2', '求导点');
    var btn = mkBtn('计算');
    var cv = mkCanvas('函数与导数图像');
    var out = outEl();
    var hint = hintEl('黄线 f(x)，蓝线 f′(x)，竖虚线标出 x₀；拖动平移，滚轮缩放');

    body.appendChild(mkRow('函数', inF));
    body.appendChild(mkRow('求导点', inX, btn));
    body.appendChild(cv);
    body.appendChild(out);
    body.appendChild(hint);

    var view = new View(cv, { x0: -5, x1: 5, y0: -8, y1: 8 });
    var st = { ast: null, f: null, d: null, g: null, x0: NaN, err: '' };
    var timer = 0;

    function compute() {
      st = { ast: null, f: null, d: null, g: null, x0: NaN, err: '' };
      try {
        st.ast = parse(inF.value);
        checkVar(st.ast);
        st.f = compile(st.ast);
        st.d = simp(simp(diff(st.ast, 'x')));
        if (!hasNaN(st.d)) st.g = compile(st.d);
        st.x0 = numArg(inX.value, NaN);
        if (!isNum(st.x0)) throw new Error('求导点 x₀ 必须能解析成常数');
      } catch (e) {
        st.err = e.message || String(e);
      }
      if (st.f) {
        var fns = [st.f];
        if (st.g) fns.push(st.g);
        var y = autoY(fns, view.x0, view.x1);
        view.y0 = y[0]; view.y1 = y[1];
      }
      redraw();
      updateOut();
    }
    function redraw() {
      view.axes();
      if (st.f) view.curve(st.f, C.curve, 2);
      if (st.g) view.curve(st.g, C.curve2, 2);
      if (st.f && isNum(st.x0)) {
        view.vline(st.x0, 'rgba(232,232,232,.24)', [5, 5]);
        var y0 = st.f(st.x0);
        if (isNum(y0)) view.dot(st.x0, y0, C.curve, 3.4);
        if (st.g) {
          var y1 = st.g(st.x0);
          if (isNum(y1)) view.dot(st.x0, y1, C.curve2, 3.4);
        }
        view.text('x₀ = ' + fmt(st.x0, 4), Math.min(view.W - view.pad.r - 6, view.px(st.x0) + 8),
          view.pad.t + 14, C.dim);
      }
      var items = [];
      if (st.f) items.push({ color: C.curve, label: 'f(x)' });
      if (st.g) items.push({ color: C.curve2, label: "f'(x)" });
      if (items.length) view.legend(items);
    }
    function updateOut() {
      if (st.err || !st.f) {
        out.innerHTML = errHtml(st.err || '表达式无法解析');
        typeset(out);
        return;
      }
      var html = '<div>$f(x) = ' + tex(st.ast, true) + '$</div>';
      if (st.g) {
        html += '<div>$f\'(x) = ' + tex(st.d, true) + '$</div>';
      } else {
        html += '<div>' + errHtml('该函数无法完成符号求导（含不可导结构），下面只给数值导数与函数值。') + '</div>';
      }
      var x0 = st.x0, fx = st.f(x0), nd = deriv(st.f, x0);
      var sym = st.g ? st.g(x0) : NaN;
      html += '<div><span class="coK">x₀ = ' + fmt(x0, 6) + '</span>　' +
        'f(x₀) = <span class="coV">' + fmt(fx, 7) + '</span>　' +
        '数值导数（中心差分）≈ <span class="coV">' + fmt(nd, 7) + '</span>' +
        (isNum(sym) ? '　符号式代入 = <span class="coV">' + fmt(sym, 7) + '</span>' : '') + '</div>';
      if (isNum(sym)) {
        html += '<div><span class="coK">两者之差</span> ' + fmt(Math.abs(nd - sym), 3) +
          '（中心差分截断误差 ~h²，h = 1e-5·max(1,|x₀|)）</div>';
      }
      out.innerHTML = html;
      typeset(out);
    }
    view.bindDrag(redraw, null, null);
    var rz = null;
    function onResize() {
      if (!cv.isConnected) { window.removeEventListener('resize', onResize); return; }
      clearTimeout(rz);
      rz = setTimeout(function () { view.fit(); redraw(); }, 200);
    }
    window.addEventListener('resize', onResize);
    inF.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(compute, 300);
    });
    inX.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(compute, 300);
    });
    btn.addEventListener('click', compute);
    compute();
  }

  /* ==================================================================
   * 12. 模式三：integral
   * ================================================================== */
  function modeIntegral(body, def) {
    var args = def.args || {};
    var inF = mkInput(def.expr || 'sin(x)', '被积函数');
    var inA = mkInput(args.a != null ? String(args.a) : (args.domain ? args.domain[0] : '0'), '下限');
    var inB = mkInput(args.b != null ? String(args.b) : (args.domain ? args.domain[1] : 'pi'), '上限');
    var rng = document.createElement('input');
    rng.type = 'range';
    rng.min = '2'; rng.max = '120'; rng.step = '2';
    rng.value = String(args.n != null ? args.n : 8);
    rng.setAttribute('aria-label', '黎曼和步数');
    var nLbl = spanEl('', 'n = ' + rng.value);
    var btn = mkBtn('计算');
    var cv = mkCanvas('定积分面积图');
    var out = outEl();
    var hint = hintEl('滑块改变黎曼和步数：矩形面积和随 n 增大逼近定积分；黄色填充为曲线下面积');

    body.appendChild(mkRow('被积函数', inF));
    body.appendChild(mkRow('积分区间', inA, inB, btn));
    body.appendChild(mkRow('黎曼和步数', rng, nLbl));
    body.appendChild(cv);
    body.appendChild(out);
    body.appendChild(hint);

    var view = new View(cv, { x0: -0.5, x1: PI + 0.5, y0: -1.4, y1: 1.4 });
    var st = { ast: null, f: null, a: NaN, b: NaN, n: 8, err: '', ta: '0', tb: '\\pi' };
    var timer = 0;

    function compute() {
      st = { ast: null, f: null, a: NaN, b: NaN, n: 8, err: '', ta: '0', tb: '\\pi' };
      try {
        st.ast = parse(inF.value);
        checkVar(st.ast);
        st.f = compile(st.ast);
        var pa = parse(inA.value), pb = parse(inB.value);
        if (varsOf(pa).length || varsOf(pb).length) throw new Error('积分上下限必须是常数');
        st.a = ev(pa, {}); st.b = ev(pb, {});
        if (!isNum(st.a) || !isNum(st.b)) throw new Error('积分上下限必须能解析成数值');
        st.ta = tex(pa, true); st.tb = tex(pb, true);
        st.n = Math.max(2, Math.round(parseFloat(rng.value) || 8));
      } catch (e) {
        st.err = e.message || String(e);
      }
      if (st.f && isNum(st.a) && isNum(st.b) && st.b !== st.a) {
        var lo = Math.min(st.a, st.b), hi = Math.max(st.a, st.b);
        var pad = Math.max(0.4, (hi - lo) * 0.3);
        view.x0 = lo - pad; view.x1 = hi + pad;
        var yr = autoY([st.f], st.a, st.b);
        var ylo = Math.min(yr[0], 0), yhi = Math.max(yr[1], 0);
        var pad2 = Math.max(0.2, (yhi - ylo) * 0.12);
        view.y0 = ylo - pad2; view.y1 = yhi + pad2;
      }
      redraw();
      updateOut();
    }
    function redraw() {
      view.axes();
      if (!st.f || !isNum(st.a) || !isNum(st.b)) return;
      view.area(st.f, st.a, st.b, C.fill);
      view.rects(st.f, st.a, st.b, st.n);
      view.curve(st.f, C.curve, 2);
      view.vline(st.a, 'rgba(159,192,226,.55)', [4, 4]);
      view.vline(st.b, 'rgba(159,192,226,.55)', [4, 4]);
      view.text('a', view.px(st.a) + 5, view.H - view.pad.b - 6, C.curve2);
      view.text('b', view.px(st.b) + 5, view.H - view.pad.b - 6, C.curve2);
    }
    function updateOut() {
      if (st.err || !st.f) {
        out.innerHTML = errHtml(st.err || '表达式无法解析');
        typeset(out);
        return;
      }
      var a = st.a, b = st.b;
      var html = '<div>$f(x) = ' + tex(st.ast, true) + '$，区间 $[' + st.ta + ', ' + st.tb + ']$</div>';
      var exact = null;
      try {
        var co = polyOf(st.ast, 'x');
        if (co) {
          var F = co.map(function (c, k) { return c / (k + 1); });
          exact = polyEval(F, b) - polyEval(F, a);
          html += '<div><span class="coK">原函数</span> $F(x) = ' + texPoly(F, 'x') +
            '$　$F(b) - F(a) = ' + numTex(exact) + '$</div>';
        }
      } catch (e) { exact = null; }
      if (b === a) {
        html += '<div><span class="coK">Simpson</span> 上下限相同，积分 = 0</div>';
        out.innerHTML = html;
        typeset(out);
        return;
      }
      var S = simpson(st.f, a, b, 2000);
      var n = st.n;
      var dx = (b - a) / n, rs = 0, k;
      for (k = 0; k < n; k++) {
        var m = a + (k + 0.5) * dx;
        var y = st.f(m);
        if (isNum(y)) rs += y * dx;
      }
      html += '<div><span class="coK">Simpson</span>（n = 2000）：$\\displaystyle\\int_{' + st.ta + '}^{' + st.tb +
        '} f(x)\\,dx \\approx ' + numTex(S) + '$</div>';
      html += '<div><span class="coK">中点黎曼和</span>（n = ' + n + '）≈ <span class="coV">' + fmt(rs, 8) +
        '</span>　与 Simpson 差 <span class="coV">' + fmt(Math.abs(rs - S), 3) + '</span></div>';
      if (isNum(exact)) {
        html += '<div><span class="coK">解析值</span> = <span class="coV">' + fmt(exact, 9) +
          '</span>　Simpson 误差 = <span class="coV">' + fmt(Math.abs(S - exact), 3) + '</span></div>';
      } else {
        html += '<div><span class="coK">解析值</span> 被积函数不是多项式，这里只给数值结果</div>';
      }
      out.innerHTML = html;
      typeset(out);
    }
    rng.addEventListener('input', function () {
      nLbl.textContent = 'n = ' + rng.value;
      st.n = Math.max(2, Math.round(parseFloat(rng.value) || 8));
      redraw();
      updateOut();
    });
    inF.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(compute, 300);
    });
    [inA, inB].forEach(function (inp) {
      inp.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(compute, 300);
      });
    });
    btn.addEventListener('click', compute);
    view.bindDrag(redraw, null, null);
    var rz = null;
    function onResize() {
      if (!cv.isConnected) { window.removeEventListener('resize', onResize); return; }
      clearTimeout(rz);
      rz = setTimeout(function () { view.fit(); redraw(); }, 200);
    }
    window.addEventListener('resize', onResize);
    compute();
  }

  /* ==================================================================
   * 13. 模式四：limit
   * ================================================================== */
  function tailState(seq) {
    if (!seq.length) return { s: 'none', v: NaN };
    var last = seq[seq.length - 1];
    if (!isNum(last)) return { s: 'none', v: NaN };
    if (Math.abs(last) > 1e6) return { s: 'inf', v: last };
    if (seq.length >= 3) {
      var t = seq.slice(-3);
      var mn = Math.min.apply(null, t), mx = Math.max.apply(null, t);
      if (mx - mn <= 2e-3 * (1 + Math.abs(last))) return { s: 'ok', v: last };
    } else if (seq.length === 2) {
      if (Math.abs(seq[0] - seq[1]) <= 2e-3 * (1 + Math.abs(last))) return { s: 'ok', v: last };
    }
    return { s: 'noisy', v: last };
  }
  function modeLimit(body, def) {
    var args = def.args || {};
    var inF = mkInput(def.expr || 'sin(x)/x', '函数表达式');
    var inA = mkInput(args.a != null ? String(args.a) : '0', '趋近点');
    var sel = mkSelect([['both', '双侧'], ['left', '仅左极限'], ['right', '仅右极限']]);
    if (args.side) sel.value = args.side;
    var btn = mkBtn('计算极限');
    var out = outEl();
    var hint = hintEl('h 每次缩小 10 倍，看 f(a−h) 与 f(a+h) 的走向；数值逼近只在该点邻域足够光滑时可信');

    body.appendChild(mkRow('函数', inF));
    body.appendChild(mkRow('趋近点', inA, sel, btn));
    body.appendChild(out);
    body.appendChild(hint);

    var timer = 0;
    function compute() {
      var ast, f, a, texA;
      try {
        ast = parse(inF.value);
        checkVar(ast);
        f = compile(ast);
        var pa = parse(inA.value);
        if (varsOf(pa).length) throw new Error('趋近点 a 必须是常数');
        a = ev(pa, {});
        if (!isNum(a)) throw new Error('趋近点 a 无法解析成数值');
        texA = tex(pa, true);
      } catch (e) {
        out.innerHTML = errHtml(e.message || String(e));
        typeset(out);
        return;
      }
      var base = Math.max(Math.abs(a), 1);
      var rows = [], Lseq = [], Rseq = [], L = NaN, R = NaN, k;
      for (k = 1; k <= 8; k++) {
        var h = base * Math.pow(10, -k);
        var yl = f(a - h), yr = f(a + h);
        if (!isNum(yl)) yl = NaN;
        if (!isNum(yr)) yr = NaN;
        rows.push({ h: h, yl: yl, yr: yr });
        if (isNum(yl)) { L = yl; Lseq.push(yl); }
        if (isNum(yr)) { R = yr; Rseq.push(yr); }
      }
      var side = sel.value;
      var ls = tailState(Lseq), rs = tailState(Rseq);
      var bodyHtml = rows.map(function (r) {
        return '<tr><td data-label="h">' + fmt(r.h, 8) + '</td>' +
          '<td data-label="f(a−h)">' + fmt(r.yl, 9) + '</td>' +
          '<td data-label="f(a+h)">' + fmt(r.yr, 9) + '</td></tr>';
      }).join('');
      var html = '<div>$f(x) = ' + tex(ast, true) + '$，$x \\to ' + texA + '$</div>';
      html += '<div class="tableWrap"><table><thead><tr><th>$h$</th><th>$f(a-h)$</th><th>$f(a+h)$</th></tr></thead>' +
        '<tbody>' + bodyHtml + '</tbody></table></div>';
      var verdict;
      function sideWord(st) {
        if (st.s === 'inf') return '对 $h$ 的最末档已到 $|f| > 10^{6}$（' + fmt(st.v, 3) + '），趋于无穷';
        if (st.s === 'none') return '所有档位都取不到有限值';
        return '稳定于 ' + fmt(st.v, 8) + '（最后一档 ' + fmt(st.v, 9) + '）';
      }
      if (side === 'left') {
        verdict = ls.s === 'ok'
          ? '左极限 $\\lim\\limits_{x\\to ' + texA + '^{-}} f(x) \\approx ' + fmt(ls.v, 8) + '$。'
          : '左极限数值上' + (ls.s === 'inf' ? '发散（$' + fmt(ls.v, 3) + '$）' : '不稳定或不存在') + '。';
      } else if (side === 'right') {
        verdict = rs.s === 'ok'
          ? '右极限 $\\lim\\limits_{x\\to ' + texA + '^{+}} f(x) \\approx ' + fmt(rs.v, 8) + '$。'
          : '右极限数值上' + (rs.s === 'inf' ? '发散（$' + fmt(rs.v, 3) + '$）' : '不稳定或不存在') + '。';
      } else if (ls.s === 'ok' && rs.s === 'ok') {
        if (Math.abs(ls.v - rs.v) <= 1e-3 * (1 + Math.abs(ls.v))) {
          verdict = '左右极限一致，故 $\\lim\\limits_{x\\to ' + texA + '} f(x) = ' +
            fmt((ls.v + rs.v) / 2, 8) + '$。';
        } else {
          verdict = '左右极限不一致（' + fmt(ls.v, 8) + ' 与 ' + fmt(rs.v, 8) +
            '），故 $\\lim\\limits_{x\\to ' + texA + '} f(x)$ <b>不存在</b>（跳跃间断）。';
        }
      } else if (ls.s === 'inf' || rs.s === 'inf') {
        verdict = '至少一侧趋于无穷（' + sideWord(ls) + '；' + sideWord(rs) +
          '），极限<b>不存在</b>（不收敛到有限值）。';
      } else if (ls.s === 'none' && rs.s === 'none') {
        verdict = '两侧都取不到有限逼近值，极限<b>不存在</b>。';
      } else {
        verdict = '数值上不稳定：' + sideWord(ls) + '；' + sideWord(rs) +
          '。可能遇到 $\\frac{0}{0}$、$\\frac{\\infty}{\\infty}$ 型或浮点噪声，可先化简表达式再试。';
      }
      html += '<div><span class="coK">判定</span> ' + verdict + '</div>';
      out.innerHTML = html;
      typeset(out);
    }
    inF.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(compute, 300);
    });
    inA.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(compute, 300);
    });
    sel.addEventListener('change', compute);
    btn.addEventListener('click', compute);
    compute();
  }

  /* ==================================================================
   * 14. 模式五：taylor
   * ================================================================== */
  function modeTaylor(body, def) {
    var args = def.args || {};
    /* 展开点：args.x0 / args.a / args.x 都认；阶数 args.n */
    var x0arg = args.x0 != null ? args.x0 : (args.a != null ? args.a : args.x);
    var inF = mkInput(def.expr || 'sin(x)', '函数表达式');
    var inX = mkInput(x0arg != null ? String(x0arg) : '0', '展开点');
    var inN = mkInput(args.n != null ? String(args.n) : '5', '阶数');
    var btn = mkBtn('展开');
    var cv = mkCanvas('泰勒多项式对比图');
    var out = outEl();
    var hint = hintEl('黄线 f(x)，蓝线 P_n(x)；拖动平移，滚轮缩放，双击重置视野');

    body.appendChild(mkRow('函数', inF));
    body.appendChild(mkRow('展开点', inX));
    body.appendChild(mkRow('阶数', inN, btn));
    body.appendChild(cv);
    body.appendChild(out);
    body.appendChild(hint);

    var view = new View(cv, { x0: -4, x1: 4, y0: -2, y1: 2 });
    var st = { ast: null, f: null, x0: NaN, n: 5, P: null, g: null, rows: null, texP: '', err: '' };
    var timer = 0;

    function buildP(ast, x0, n) {
      var ds = [ast], d = ast, i;
      for (i = 1; i <= n; i++) { d = simp(diff(d, 'x')); ds.push(d); }
      var fact = 1, P = N(0), rows = [];
      for (var k = 0; k <= n; k++) {
        if (k) fact *= k;
        var fk = ev(ds[k], { x: x0 });
        if (!isNum(fk)) fk = 0;
        var ck = fk / fact;
        rows.push({ k: k, fk: fk, ck: ck });
        if (Math.abs(ck) > 1e-14) {
          P = op('+', P, op('*', N(ck), op('^', op('-', { t: 'var', name: 'x' }, N(x0)), N(k))));
        }
      }
      return { P: simp(P), rows: rows };
    }
    function compute() {
      st = { ast: null, f: null, x0: NaN, n: 5, P: null, g: null, rows: null, texP: '', err: '' };
      try {
        st.ast = parse(inF.value);
        checkVar(st.ast);
        st.f = compile(st.ast);
        st.x0 = numArg(inX.value, NaN);
        st.n = Math.round(numArg(inN.value, NaN));
        if (!isNum(st.x0)) throw new Error('展开点 x₀ 必须能解析成常数');
        if (!isNum(st.n) || st.n < 0 || st.n > 10) throw new Error('阶数 n 请取 0 ~ 10 的整数');
        var r = buildP(st.ast, st.x0, st.n);
        st.P = r.P;
        st.rows = r.rows;
        st.g = compile(st.P);
        var co = polyOf(st.P, 'x');
        st.texP = co ? texPoly(co, 'x') : tex(st.P, true);
      } catch (e) {
        st.err = e.message || String(e);
      }
      if (st.f) {
        view.x0 = st.x0 - 4;
        view.x1 = st.x0 + 4;
        var fns = [st.f];
        if (st.g) fns.push(st.g);
        var y = autoY(fns, view.x0, view.x1);
        view.y0 = y[0]; view.y1 = y[1];
      }
      redraw();
      updateOut();
    }
    function redraw() {
      view.axes();
      if (st.f) view.curve(st.f, C.curve, 2);
      if (st.g) view.curve(st.g, C.curve2, 2);
      if (st.f && isNum(st.x0)) {
        view.vline(st.x0, 'rgba(232,232,232,.24)', [5, 5]);
        view.dot(st.x0, st.f(st.x0), C.curve, 3.2);
      }
      var items = [];
      if (st.f) items.push({ color: C.curve, label: 'f(x)' });
      if (st.g) items.push({ color: C.curve2, label: 'P' + st.n + '(x)' });
      if (items.length) view.legend(items);
    }
    function updateOut() {
      if (st.err || !st.f) {
        out.innerHTML = errHtml(st.err || '表达式无法解析');
        typeset(out);
        return;
      }
      var html = '<div>$f(x) = ' + tex(st.ast, true) + '$，在 $x_0 = ' + numTex(st.x0) +
        '$ 处展开到 $n = ' + st.n + '$ 阶</div>';
      var rowsHtml = st.rows.map(function (r) {
        return '<tr><td data-label="k">' + r.k + '</td>' +
          '<td data-label="f^(k)(x0)">' + fmt(r.fk, 8) + '</td>' +
          '<td data-label="c_k">' + fmt(r.ck, 10) + '</td></tr>';
      }).join('');
      html += '<div class="tableWrap"><table><thead><tr><th>$k$</th><th>$f^{(k)}(x_0)$</th>' +
        '<th>$c_k = f^{(k)}(x_0)/k!$</th></tr></thead><tbody>' + rowsHtml + '</tbody></table></div>';
      html += '<div><span class="coK">展开式</span> $P_{' + st.n + '}(x) = ' + st.texP + '$</div>';
      /* 误差检验：在 x0 附近取点比较 */
      if (st.g) {
        var pts = [], maxErr = 0, i;
        for (i = -3; i <= 3; i++) {
          var xx = st.x0 + i * 0.5;
          var fy = st.f(xx), py = st.g(xx);
          if (!isNum(fy) || !isNum(py)) continue;
          var er = Math.abs(fy - py);
          if (er > maxErr) maxErr = er;
          pts.push(xx);
        }
        html += '<div><span class="coK">误差检验</span> 在 $x_0 \\pm 1.5$ 内取 ' + pts.length +
          ' 个点，最大偏差 $|f - P_{' + st.n + '}| \\approx ' + numTex(maxErr) + '$' +
          (maxErr < 1e-3 ? '（逼近良好）' : '（离展开点较远或阶数偏低）') + '</div>';
      }
      out.innerHTML = html;
      typeset(out);
    }
    view.bindDrag(redraw, function () {
      if (!st.f) return;
      view.x0 = st.x0 - 4; view.x1 = st.x0 + 4;
      var fns = [st.f];
      if (st.g) fns.push(st.g);
      var y = autoY(fns, view.x0, view.x1);
      view.y0 = y[0]; view.y1 = y[1];
      redraw();
    }, null);
    inF.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(compute, 300);
    });
    inX.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(compute, 300);
    });
    inN.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(compute, 300);
    });
    btn.addEventListener('click', compute);
    var rz = null;
    function onResize() {
      if (!cv.isConnected) { window.removeEventListener('resize', onResize); return; }
      clearTimeout(rz);
      rz = setTimeout(function () { view.fit(); redraw(); }, 200);
    }
    window.addEventListener('resize', onResize);
    compute();
  }

  /* ==================================================================
   * 15. 模式六：solve
   * ================================================================== */
  function eqAst(src) {
    var parts = String(src == null ? '' : src).split('=');
    if (parts.length > 2) throw new Error('等号最多只能有一个');
    if (parts.length === 2) {
      if (!parts[0].trim() || !parts[1].trim()) throw new Error('等号两侧都要有内容');
      return op('-', parse(parts[0]), parse(parts[1]));
    }
    return parse(parts[0]);
  }
  function modeSolve(body, def) {
    var args = def.args || {};
    var inF = mkInput(def.expr || 'x^3 - 3x + 1 = 0', '方程');
    var inA = mkInput(args.a != null ? String(args.a) : '-3', '区间左端');
    var inB = mkInput(args.b != null ? String(args.b) : '3', '区间右端');
    var btn = mkBtn('求解');
    var cv = mkCanvas('方程求根图');
    var out = outEl();
    var hint = hintEl('方程可写 “表达式 = 0” 或直接写表达式；根由扫描 + 二分求得，蓝点为实根');

    body.appendChild(mkRow('方程', inF));
    body.appendChild(mkRow('搜索区间', inA, inB, btn));
    body.appendChild(cv);
    body.appendChild(out);
    body.appendChild(hint);

    var view = new View(cv, { x0: -3, x1: 3, y0: -5, y1: 5 });
    var st = { ast: null, f: null, a: NaN, b: NaN, rs: [], err: '', ta: '', tb: '' };
    var timer = 0;

    function compute() {
      st = { ast: null, f: null, a: NaN, b: NaN, rs: [], err: '', ta: '', tb: '' };
      try {
        st.ast = eqAst(inF.value);
        checkVar(st.ast);
        st.f = compile(st.ast);
        var pa = parse(inA.value), pb = parse(inB.value);
        if (varsOf(pa).length || varsOf(pb).length) throw new Error('区间端点必须是常数');
        st.a = ev(pa, {}); st.b = ev(pb, {});
        if (!isNum(st.a) || !isNum(st.b)) throw new Error('区间端点必须能解析成数值');
        if (!(st.b > st.a)) throw new Error('区间右端必须大于左端');
        st.ta = tex(pa, true); st.tb = tex(pb, true);
        var rs = roots(st.f, st.a, st.b, 1200);
        /* 补相切根：f′ 的零点处 f≈0（偶重根不变号，扫描法会漏） */
        try {
          var d = simp(simp(diff(st.ast, 'x')));
          if (!hasNaN(d)) {
            var g = compile(d);
            roots(g, st.a, st.b, 1200).forEach(function (c) {
              if (!isNum(c)) return;
              var fv = st.f(c);
              if (isNum(fv) && Math.abs(fv) <= 1e-6 * (1 + Math.abs(c))) {
                if (!rs.some(function (r) { return Math.abs(r - c) < 1e-5; })) rs.push(c);
              }
            });
          }
        } catch (e2) { /* 不可导时忽略 */ }
        rs.sort(function (p, q) { return p - q; });
        st.rs = rs;
      } catch (e) {
        st.err = e.message || String(e);
      }
      if (st.f && isNum(st.a) && isNum(st.b)) {
        view.x0 = st.a; view.x1 = st.b;
        var y = autoY([st.f], st.a, st.b);
        view.y0 = y[0]; view.y1 = y[1];
      }
      redraw();
      updateOut();
    }
    function redraw() {
      view.axes();
      if (!st.f) return;
      view.curve(st.f, C.curve, 2);
      st.rs.forEach(function (r) {
        var y = st.f(r);
        if (isNum(y)) view.dot(r, y, C.curve2, 3.6);
      });
      if (st.rs.length) {
        view.text('roots: ' + st.rs.map(function (r) { return fmt(r, 4); }).join('  '),
          view.W - view.pad.r - 6, view.pad.t + 14, C.dim, 'right');
      }
    }
    function updateOut() {
      if (st.err || !st.f) {
        out.innerHTML = errHtml(st.err || '表达式无法解析');
        typeset(out);
        return;
      }
      var html = '<div>$' + tex(st.ast, true) + ' = 0$，区间 $[' + st.ta + ', ' + st.tb + ']$</div>';
      if (!st.rs.length) {
        html += '<div><span class="coK">实根</span> 该区间内未找到实根</div>';
      } else {
        html += '<div><span class="coK">实根</span> 共 ' + st.rs.length + ' 个：' +
          st.rs.map(function (r, i) {
            return '$x_{' + (i + 1) + '} \\approx ' + numTex(Math.round(r * 1e9) / 1e9) + '$';
          }).join('，') + '</div>';
        html += '<div><span class="coK">数值</span> ' + st.rs.map(function (r) {
          return fmt(r, 9);
        }).join('，') + '</div>';
        html += '<div><span class="coK">验证</span> ' + st.rs.map(function (r, i) {
          return 'f(x' + (i + 1) + ') = ' + fmt(st.f(r), 3);
        }).join('，') + '</div>';
      }
      out.innerHTML = html;
      typeset(out);
    }
    view.bindDrag(redraw, null, null);
    inF.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(compute, 300);
    });
    [inA, inB].forEach(function (inp) {
      inp.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(compute, 300);
      });
    });
    btn.addEventListener('click', compute);
    var rz = null;
    function onResize() {
      if (!cv.isConnected) { window.removeEventListener('resize', onResize); return; }
      clearTimeout(rz);
      rz = setTimeout(function () { view.fit(); redraw(); }, 200);
    }
    window.addEventListener('resize', onResize);
    compute();
  }

  /* ==================================================================
   * 16. 挂载分发 + 对外接口
   * ================================================================== */
  var MODES = {
    graph: modeGraph,
    derivative: modeDerivative,
    integral: modeIntegral,
    limit: modeLimit,
    taylor: modeTaylor,
    solve: modeSolve
  };

  function mount(bodyEl, def) {
    if (!bodyEl) return;
    def = def || {};
    bodyEl.innerHTML = '';
    var fn = MODES[def.mode];
    if (!fn) {
      if (window.console && console.warn) {
        console.warn('[calc] 未知模式 "' + def.mode + '"，已按 graph 渲染');
      }
      fn = MODES.graph;
    }
    try {
      fn(bodyEl, def);
    } catch (e) {
      bodyEl.innerHTML = '<div class="calcOut">' + errHtml('演算台初始化失败：' +
        (e && e.message ? e.message : e)) + '</div>';
    }
  }

  window.CSC_CALC = {
    version: VERSION,
    mount: mount,
    eval: function (expr, x) {
      try {
        var ast = parse(String(expr));
        var xv = typeof x === 'number' ? x : parseFloat(x);
        var v = ev(ast, { x: xv });
        return isNum(v) ? v : NaN;
      } catch (e) {
        return NaN;
      }
    },
    derivative: function (expr) {
      try { return tex(simp(simp(diff(parse(String(expr)), 'x'))), true); }
      catch (e) { return ''; }
    },
    latex: function (expr) {
      try { return tex(parse(String(expr)), true); }
      catch (e) { return ''; }
    },
    parse: parse,
    simpson: simpson,
    roots: roots,
    deriv: deriv,
    deriv2: deriv2
  };
})();
