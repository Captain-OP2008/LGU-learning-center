/* ===========================================================
   公式计算器 —— 自写表达式解析器 + 图像 + 数值微积分 + 符号求导 + 分步求解
   纯离线，无外部依赖；公式回显用本地 MathJax。
   =========================================================== */
(function () {
  'use strict';

  var NUM = window.SITE_NUM || {};
  var CV = window.SITE_CANVAS || {};
  var DEG = false;

  function $(s, r) { return (r || document).querySelector(s); }
  function ƒ(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function fit(el) { if (window.SITE_FIT) window.SITE_FIT.finish(el); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------------- 词法 ---------------- */
  var KNOWN = ['arcsin', 'arccos', 'arctan', 'log10', 'floor', 'sqrt', 'sinh', 'cosh', 'tanh', 'ceil', 'sign',
               'asin', 'acos', 'atan', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'exp', 'abs', 'max', 'min',
               'log', 'ln', 'pi', 'e', 'x', 'y', 'z', 't', 'n'];
  var FUNCS = { sin: 1, cos: 1, tan: 1, cot: 1, sec: 1, csc: 1, asin: 1, acos: 1, atan: 1, arcsin: 1, arccos: 1,
                arctan: 1, sinh: 1, cosh: 1, tanh: 1, exp: 1, ln: 1, log: 1, log10: 1, sqrt: 1, abs: 1,
                floor: 1, ceil: 1, sign: 1, max: 2, min: 2 };
  var TRI = { sin: 1, cos: 1, tan: 1, cot: 1, sec: 1, csc: 1 };
  var ATRI = { asin: 1, acos: 1, atan: 1, arcsin: 1, arccos: 1, arctan: 1 };

  function lex(src) {
    var s = String(src).replace(/π/g, 'pi').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
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

  /* ---------------- 语法（递归下降 + 隐式乘法） ---------------- */
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
        if (x && (x.t === 'num' || x.t === 'name' || x.t === '(')) { n = { t: 'op', op: '*', a: n, b: parseUnary() }; continue; }
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
        if (nm === 'pi') return { t: 'num', v: Math.PI };
        if (nm === 'e') return { t: 'num', v: Math.E };
        return { t: 'var', name: nm };
      }
      throw new Error('意外的符号');
    }
    var ast = parseExpr();
    if (p < tk.length) throw new Error('多余的符号（位置 ' + (p + 1) + '）');
    return ast;
  }

  /* ---------------- 求值 ---------------- */
  var FN = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    cot: function (x) { return 1 / Math.tan(x); }, sec: function (x) { return 1 / Math.cos(x); },
    csc: function (x) { return 1 / Math.sin(x); },
    asin: Math.asin, acos: Math.acos, atan: Math.atan, arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
    sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh, exp: Math.exp,
    ln: Math.log, log: Math.log, log10: function (x) { return Math.log(x) / Math.LN10; },
    sqrt: Math.sqrt, abs: Math.abs, floor: Math.floor, ceil: Math.ceil,
    sign: function (x) { return x > 0 ? 1 : x < 0 ? -1 : 0; },
    max: Math.max, min: Math.min
  };
  function ev(n, env) {
    env = env || {};
    switch (n.t) {
      case 'num': return n.v;
      case 'var': return env[n.name] === undefined ? NaN : env[n.name];
      case 'neg': return -ev(n.a, env);
      case 'op':
        var a = ev(n.a, env), b = ev(n.b, env);
        if (n.op === '+') return a + b;
        if (n.op === '-') return a - b;
        if (n.op === '*') return a * b;
        if (n.op === '/') return a / b;
        return Math.pow(a, b);
      case 'call':
        var f = FN[n.name];
        if (!f) return NaN;
        var args = n.args.map(function (x) { return ev(x, env); });
        if (TRI[n.name] && DEG) args = args.map(function (t) { return t * Math.PI / 180; });
        var r = f.apply(null, args);
        if (ATRI[n.name] && DEG) r = r * 180 / Math.PI;
        return r;
    }
    return NaN;
  }

  /* ---------------- 化简 ---------------- */
  function simp(n) {
    if (!n || n.t === 'num' || n.t === 'var') return n;
    if (n.t === 'neg') { var a0 = simp(n.a); return a0.t === 'num' ? { t: 'num', v: -a0.v } : { t: 'neg', a: a0 }; }
    if (n.t === 'call') return { t: 'call', name: n.name, args: n.args.map(simp) };
    var A = simp(n.a), B = simp(n.b), op = n.op;
    if (A.t === 'num' && B.t === 'num') {
      var v = ev({ t: 'op', op: op, a: A, b: B }, {});
      if (isFinite(v) && Math.abs(v) < 1e15) return { t: 'num', v: v };
    }
    if (op === '+') {
      if (A.t === 'num' && A.v === 0) return B;
      if (B.t === 'num' && B.v === 0) return A;
    }
    if (op === '-') {
      if (B.t === 'num' && B.v === 0) return A;
      if (A.t === 'num' && A.v === 0) return { t: 'neg', a: B };
    }
    if (op === '*') {
      if ((A.t === 'num' && A.v === 0) || (B.t === 'num' && B.v === 0)) return { t: 'num', v: 0 };
      if (A.t === 'num' && A.v === 1) return B;
      if (B.t === 'num' && B.v === 1) return A;
      if (A.t === 'num' && B.t === 'op' && B.op === '*' && B.a.t === 'num') {
        return { t: 'op', op: '*', a: { t: 'num', v: A.v * B.a.v }, b: B.b };
      }
    }
    if (op === '/') {
      if (B.t === 'num' && B.v === 1) return A;
      if (A.t === 'num' && A.v === 0) return { t: 'num', v: 0 };
    }
    if (op === '^') {
      if (B.t === 'num' && B.v === 0) return { t: 'num', v: 1 };
      if (B.t === 'num' && B.v === 1) return A;
    }
    return { t: 'op', op: op, a: A, b: B };
  }

  /* ---------------- 符号求导 ---------------- */
  function N(v) { return { t: 'num', v: v }; }
  function op(o, a, b) { return { t: 'op', op: o, a: a, b: b }; }
  function call(nm, a) { return { t: 'call', name: nm, args: [a] }; }

  function diff(n, v) {
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
    var u = n.args[0], du = diff(u, v), g;
    switch (n.name) {
      case 'sin': return op('*', call('cos', u), du);
      case 'cos': return { t: 'neg', a: op('*', call('sin', u), du) };
      case 'tan': return op('/', du, op('^', call('cos', u), N(2)));
      case 'cot': return { t: 'neg', a: op('/', du, op('^', call('sin', u), N(2))) };
      case 'sec': return op('*', op('*', call('sec', u), call('tan', u)), du);
      case 'csc': return { t: 'neg', a: op('*', op('*', call('csc', u), call('cot', u)), du) };
      case 'asin': case 'arcsin': return op('/', du, call('sqrt', op('-', N(1), op('^', u, N(2)))));
      case 'acos': case 'arccos': return { t: 'neg', a: op('/', du, call('sqrt', op('-', N(1), op('^', u, N(2))))) };
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

  /* ---------------- LaTeX 输出 ---------------- */
  function numTex(v) {
    if (!isFinite(v)) return '\\text{—}';
    if (Math.abs(v - Math.PI) < 1e-12) return '\\pi';
    if (Math.abs(v - Math.E) < 1e-12) return 'e';
    var r = Math.round(v * 1e10) / 1e10;
    if (String(r).indexOf('e') >= 0) return r.toExponential(4).replace('e', '\\times 10^{') + '}';
    return String(r);
  }
  var TEXF = { asin: '\\arcsin', acos: '\\arccos', atan: '\\arctan', arcsin: '\\arcsin', arccos: '\\arccos',
               arctan: '\\arctan', ln: '\\ln', log: '\\ln', sign: '\\operatorname{sgn}' };

  /* 纯文本数值：给读数条与数据表用，避免每格都过一次 MathJax */
  var SUP = { '0': '\u2070', '1': '\u00b9', '2': '\u00b2', '3': '\u00b3', '4': '\u2074', '5': '\u2075',
              '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079', '-': '\u207b', '+': '' };
  function plainNum(v) {
    if (typeof v !== 'number' || !isFinite(v)) return '—';
    if (v === 0) return '0';
    var a = Math.abs(v);
    if (a >= 1e-4 && a < 1e7) return String(Math.round(v * 1e6) / 1e6);
    var s = v.toExponential(3).split('e');
    return s[0] + '×10' + String(s[1]).split('').map(function (ch) { return SUP[ch] === undefined ? ch : SUP[ch]; }).join('');
  }
  function tex(n, imp) {
    switch (n.t) {
      case 'num': return numTex(n.v);
      case 'var': return n.name;
      case 'neg': return '-' + wrap(n.a, 2, 'r', imp);
      case 'op':
        if (n.op === '/') return '\\frac{' + tex(n.a, imp) + '}{' + tex(n.b, imp) + '}';
        if (n.op === '^') return wrap(n.a, 3, 'l', imp) + '^{' + tex(n.b, imp) + '}';
        var p = (n.op === '+' || n.op === '-') ? 1 : 2;
        /* imp 为真时不写乘号：排版里 “3x” 比 “3\cdot x” 更像手写公式 */
        var s = n.op === '*' ? (imp ? '' : '\\cdot ') : n.op;
        return wrap(n.a, p, 'l', imp) + s + wrap(n.b, p, 'r', imp);
      case 'call':
        var x = n.args.map(function (a) { return tex(a, imp); });
        if (n.name === 'sqrt') return '\\sqrt{' + x[0] + '}';
        if (n.name === 'abs') return '\\left|' + x[0] + '\\right|';
        if (n.name === 'exp') return 'e^{' + x[0] + '}';
        if (n.name === 'floor') return '\\lfloor ' + x[0] + ' \\rfloor';
        if (n.name === 'ceil') return '\\lceil ' + x[0] + ' \\rceil';
        if (n.name === 'log10') return '\\log_{10}\\!\\left(' + x[0] + '\\right)';
        return (TEXF[n.name] || ('\\' + n.name)) + '\\!\\left(' + x.join(',\\,') + '\\right)';
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
    if (np < p || (np === p && side === 'r' && n.t === 'op' && (n.op === '-' || n.op === '/'))) {
      return '\\left(' + s + '\\right)';
    }
    return s;
  }

  /* ---------------- 多变量一次式 / 单变量多项式 ---------------- */
  function isConstVec(c) {
    for (var i = 0; i < c.length - 1; i++) if (Math.abs(c[i]) > 1e-12) return false;
    return true;
  }
  function linOf(n, vars) {
    var z = function () { var r = vars.map(function () { return 0; }); r.push(0); return r; };
    if (n.t === 'num') { var r0 = z(); r0[vars.length] = n.v; return r0; }
    if (n.t === 'var') {
      var k = vars.indexOf(n.name);
      if (k < 0) return null;
      var r1 = z(); r1[k] = 1; return r1;
    }
    if (n.t === 'neg') { var c0 = linOf(n.a, vars); return c0 && c0.map(function (x) { return -x; }); }
    if (n.t === 'call') {
      // 允许 sin(常数) 之类的纯常数
      var v = ev(n, {});
      if (isFinite(v)) { var r2 = z(); r2[vars.length] = v; return r2; }
      return null;
    }
    if (n.t === 'op') {
      var A = linOf(n.a, vars), B = linOf(n.b, vars);
      if (!A || !B) return null;
      if (n.op === '+' || n.op === '-') {
        return A.map(function (x, i) { return x + (n.op === '+' ? B[i] : -B[i]); });
      }
      if (n.op === '*') {
        if (isConstVec(A)) return B.map(function (x) { return x * A[vars.length]; });
        if (isConstVec(B)) return A.map(function (x) { return x * B[vars.length]; });
        return null;
      }
      if (n.op === '/') {
        if (!isConstVec(B) || Math.abs(B[vars.length]) < 1e-15) return null;
        return A.map(function (x) { return x / B[vars.length]; });
      }
      if (n.op === '^') {
        if (B.length === 1 && Math.abs(B[0]) >= 1e-15) {
          if (isConstVec(A) || Math.abs(B[0] - 1) < 1e-12) return A;
        }
        if (Math.abs(B[vars.length] - 1) < 1e-12) return A;
        if (Math.abs(B[vars.length]) < 1e-12) { var r3 = z(); r3[vars.length] = 1; return r3; }
        return null;
      }
      return null;
    }
    return null;
  }
  function polyOf(n, v) {
    if (n.t === 'num') return [n.v];
    if (n.t === 'var') return n.name === v ? [0, 1] : null;
    if (n.t === 'neg') { var c = polyOf(n.a, v); return c && c.map(function (x) { return -x; }); }
    if (n.t === 'call') {
      var val = ev(n, {});
      return isFinite(val) ? [val] : null;
    }
    if (n.t === 'op') {
      var A = polyOf(n.a, v), B = polyOf(n.b, v);
      if (!A || !B) return null;
      if (n.op === '+') return addP(A, B);
      if (n.op === '-') return addP(A, B.map(function (x) { return -x; }));
      if (n.op === '*') return mulP(A, B);
      if (n.op === '/') { if (B.length !== 1 || Math.abs(B[0]) < 1e-15) return null; return A.map(function (x) { return x / B[0]; }); }
      if (n.op === '^') {
        if (B.length !== 1) return null;
        var k = B[0];
        if (Math.abs(k - Math.round(k)) > 1e-9 || k < 0 || k > 8) return null;
        return powP(A, Math.round(k));
      }
    }
    return null;
  }
  function addP(a, b) {
    var n = Math.max(a.length, b.length), r = [], i;
    for (i = 0; i < n; i++) r.push((a[i] || 0) + (b[i] || 0));
    return r;
  }
  function mulP(a, b) {
    var r = [], i, j;
    for (i = 0; i < a.length + b.length - 1; i++) r.push(0);
    for (i = 0; i < a.length; i++) for (j = 0; j < b.length; j++) r[i + j] += a[i] * b[j];
    return r;
  }
  function powP(a, k) {
    var r = [1];
    for (var i = 0; i < k; i++) r = mulP(r, a);
    return r;
  }
  function degOf(c) {
    for (var i = c.length - 1; i >= 0; i--) if (Math.abs(c[i]) > 1e-12) return i;
    return -1;
  }
  function texPoly(c, v) {
    var s = '', i, first = true;
    for (i = c.length - 1; i >= 0; i--) {
      var a = Math.round(c[i] * 1e10) / 1e10;
      if (Math.abs(a) < 1e-12) continue;
      var sign = a < 0 ? '-' : (first ? '' : '+');
      var av = Math.abs(a);
      var coefStr = (i > 0 && Math.abs(av - 1) < 1e-12) ? '' : numTex(av);
      var vv = i === 0 ? '' : (i === 1 ? v : v + '^{' + i + '}');
      var joiner = (coefStr && vv) ? '\\cdot ' : '';
      s += (first ? '' : ' ') + (first ? (a < 0 ? '-' : '') : sign + ' ') + coefStr + joiner + vv;
      first = false;
    }
    return s || '0';
  }

  /* ---------------- 求解器 ---------------- */
  function line(h) { return '<div class="cfStep">' + h + '</div>'; }
  function splitEq(src) {
    var parts = String(src).split('=');
    if (parts.length > 2) throw new Error('只能有一个等号');
    return { lhs: parts[0], rhs: parts.length === 2 ? parts[1] : '0' };
  }
  function eqAST(src) {
    var sp = splitEq(src);
    return op('-', parse(sp.lhs), parse(sp.rhs));
  }
  function polyEval(c, x) {
    var s = 0, p = 1, i;
    for (i = 0; i < c.length; i++) { s += c[i] * p; p *= x; }
    return s;
  }
  function matrixHTML(A, b, vars) {
    var h = '<div class="cfMat"><table class="cfTb"><thead><tr><th></th>';
    vars.forEach(function (v) { h += '<th>$' + v + '$</th>'; });
    h += '<th>常数</th></tr></thead><tbody>';
    A.forEach(function (r, i) {
      h += '<tr><th>' + (i + 1) + '</th>';
      r.forEach(function (x) { h += '<td>' + plainNum(x) + '</td>'; });
      h += '<td>' + plainNum(b[i]) + '</td></tr>';
    });
    return h + '</tbody></table></div>';
  }

  function solveEq1(src) {
    var ast = eqAST(src);
    var f = function (x) { return ev(ast, { x: x }); };
    var c = polyOf(ast, 'x'), h = '';
    if (c) {
      var d = degOf(c);
      h += line('① 移项整理，化为 $' + texPoly(c, 'x') + ' = 0$' + (d >= 0 ? '（次数 ' + d + '）' : ''));
      if (d < 0) return { html: h + line('② 各项抵消，这是恒等式：任意 $x$ 都满足。'), roots: [] };
      if (d === 0) return { html: h + line('② 只剩非零常数，方程<b>无解</b>。'), roots: [] };
      if (d === 1) {
        var a1 = c[1], b1 = c[0];
        h += line('② 一次方程：移项得 $' + numTex(a1) + 'x = ' + numTex(-b1) + '$');
        h += line('③ 两边同除以 $' + numTex(a1) + '$：$x = ' + numTex(-b1 / a1) + '$');
        return { html: h, roots: [-b1 / a1] };
      }
      if (d === 2) {
        var A = c[2], B = c[1], C = c[0], D = B * B - 4 * A * C;
        h += line('② 二次方程系数：$a = ' + numTex(A) + ',\\; b = ' + numTex(B) + ',\\; c = ' + numTex(C) + '$');
        h += line('③ 判别式 $\\Delta = b^{2} - 4ac = ' + numTex(D) + '$');
        if (D > 1e-12) {
          h += line('④ $\\Delta > 0$：两个不同实根，代入 $x = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a}$');
          h += line('⑤ $x_{1} = ' + numTex((-B + Math.sqrt(D)) / (2 * A)) + ',\\qquad x_{2} = ' + numTex((-B - Math.sqrt(D)) / (2 * A)) + '$');
          return { html: h, roots: [(-B + Math.sqrt(D)) / (2 * A), (-B - Math.sqrt(D)) / (2 * A)] };
        }
        if (D < -1e-12) {
          h += line('④ $\\Delta < 0$：无实根；复根 $x = ' + numTex(-B / (2 * A)) + ' \\pm ' + numTex(Math.sqrt(-D) / (2 * A)) + '\\,i$');
          return { html: h, roots: [] };
        }
        h += line('④ $\\Delta = 0$：重根 $x = -\\dfrac{b}{2a} = ' + numTex(-B / (2 * A)) + '$');
        return { html: h, roots: [-B / (2 * A)] };
      }
      var rs = NUM.roots ? NUM.roots(f, -30, 30, 6000) : [];
      h += line('② 高于二次，用「扫描 + 二分」求数值根（区间 $[-30, 30]$）');
      h += line('③ 实根：' + (rs.length ? rs.map(function (r) { return '$x \\approx ' + numTex(r) + '$'; }).join('，') : '未找到'));
      return { html: h, roots: rs };
    }
    /* 非多项式 → 牛顿迭代 */
    var x = 1, rows = [], i, fx, dd, nx;
    for (i = 0; i < 14; i++) {
      fx = f(x); dd = NUM.deriv(f, x);
      rows.push({ n: i, x: x, fx: fx, d: dd });
      if (!isFinite(dd) || Math.abs(dd) < 1e-14) break;
      nx = x - fx / dd;
      if (!isFinite(nx)) break;
      if (Math.abs(nx - x) < 1e-13) { x = nx; break; }
      x = nx;
    }
    h += line('① 该方程不是多项式，改用<b>牛顿迭代法</b>：$x_{n+1} = x_n - \\dfrac{f(x_n)}{f\'(x_n)}$，初值 $x_0 = 1$');
    h += '<table class="cfTb"><thead><tr><th>$n$</th><th>$x_n$</th><th>$f(x_n)$</th><th>$f\'(x_n)$</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td>' + r.n + '</td><td>' + plainNum(r.x) + '</td><td>' + plainNum(r.fx) + '</td><td>' + plainNum(r.d) + '</td></tr>';
      }).join('') + '</tbody></table>';
    h += line('② 收敛到 $x \\approx ' + numTex(x) + '$（此时 $f(x) \\approx ' + numTex(f(x)) + '$）');
    return { html: h, roots: [x] };
  }

  function solveLin(eqs, vars) {
    var A = [], b = [], i, j, h = '';
    for (i = 0; i < eqs.length; i++) {
      var ast = eqAST(eqs[i]);
      var c = linOf(ast, vars);
      if (!c) throw new Error('第 ' + (i + 1) + ' 个方程不是 ' + vars.join('、') + ' 的一次式');
      var row = [];
      for (j = 0; j < vars.length; j++) row.push(c[j]);
      A.push(row); b.push(-c[vars.length]);
    }
    h += line('① 化为标准形 $A\\mathbf{x} = \\mathbf{b}$：');
    h += matrixHTML(A, b, vars);
    if (vars.length === 2) {
      var det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      h += line('② 系数行列式 $D = ' + numTex(A[0][0]) + '\\cdot' + numTex(A[1][1]) + ' - ' +
                numTex(A[0][1]) + '\\cdot' + numTex(A[1][0]) + ' = ' + numTex(det) + '$');
      if (Math.abs(det) > 1e-12) {
        var Dx = b[0] * A[1][1] - A[0][1] * b[1], Dy = A[0][0] * b[1] - b[0] * A[1][0];
        h += line('③ 克拉默法则：$D_x = ' + numTex(Dx) + ',\\qquad D_y = ' + numTex(Dy) + '$');
        h += line('④ $x = D_x / D = ' + numTex(Dx / det) + ',\\qquad y = D_y / D = ' + numTex(Dy / det) + '$');
        return { html: h, sol: [Dx / det, Dy / det] };
      }
      var c1 = A[0][0] * b[1] - b[0] * A[1][0];
      h += line('③ $D = 0$：方程组' + (Math.abs(c1) > 1e-12 ? '<b>无解</b>（两直线平行）' : '<b>有无穷多解</b>（两方程等价）'));
      return { html: h, sol: null };
    }
    var M = A.map(function (r, k) { return r.concat([b[k]]); });
    h += line('② 高斯消元（增广矩阵）：');
    for (i = 0; i < vars.length; i++) {
      var piv = i;
      for (j = i + 1; j < vars.length; j++) if (Math.abs(M[j][i]) > Math.abs(M[piv][i])) piv = j;
      if (Math.abs(M[piv][i]) < 1e-12) continue;
      if (piv !== i) { var t = M[i]; M[i] = M[piv]; M[piv] = t; h += line('↔ 交换第 ' + (i + 1) + ' 行与第 ' + (piv + 1) + ' 行（选主元）'); }
      for (j = i + 1; j < vars.length; j++) {
        var k2 = M[j][i] / M[i][i];
        if (Math.abs(k2) < 1e-15) continue;
        for (var q = i; q <= vars.length; q++) M[j][q] -= k2 * M[i][q];
        h += line('第 ' + (j + 1) + ' 行 ← 第 ' + (j + 1) + ' 行 − (' + numTex(k2) + ') × 第 ' + (i + 1) + ' 行');
      }
      h += matrixHTML(M.map(function (r) { return r.slice(0, vars.length); }), M.map(function (r) { return r[vars.length]; }), vars);
    }
    var sol = new Array(vars.length), ok = true;
    for (i = vars.length - 1; i >= 0; i--) {
      var s = M[i][vars.length];
      for (j = i + 1; j < vars.length; j++) s -= M[i][j] * sol[j];
      if (Math.abs(M[i][i]) < 1e-12) { ok = false; break; }
      sol[i] = s / M[i][i];
    }
    h += line('③ 回代求解：' + (ok ? sol.map(function (v, k) { return '$' + vars[k] + ' = ' + numTex(v) + '$'; }).join('，') : '系数矩阵奇异，需进一步判断解的个数'));
    return { html: h, sol: ok ? sol : null };
  }

  function integralSteps(src, a, b, n) {
    var ast = parse(src);
    var f = function (x) { return ev(ast, { x: x }); };
    var c = polyOf(ast, 'x'), h = '';
    if (c) {
      var F = c.map(function (co, k) { return co / (k + 1); });
      var Fb = polyEval(F, b), Fa = polyEval(F, a);
      h += line('① 被积函数是多项式：$f(x) = ' + texPoly(c, 'x') + '$');
      h += line('② 逐项求原函数（幂函数法则 $\\displaystyle\\int x^{k}dx = \\frac{x^{k+1}}{k+1}$，$k \\ne -1$）：$F(x) = ' + texPoly(F, 'x') + '$');
      h += line('③ 牛顿–莱布尼茨公式：$\\displaystyle\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)$');
      h += line('④ $F(' + numTex(b) + ') = ' + numTex(Fb) + ',\\qquad F(' + numTex(a) + ') = ' + numTex(Fa) + '$');
      h += line('⑤ 结果：$\\displaystyle\\int_{' + numTex(a) + '}^{' + numTex(b) + '} f(x)\\,dx = ' + numTex(Fb - Fa) + '$');
      return { html: h, val: Fb - Fa, exact: true };
    }
    var m = Math.max(2, Math.round(n));
    if (m % 2) m++;
    var dx = (b - a) / m, i, sum = 0, rows = '';
    for (i = 0; i <= m; i++) {
      var xi = a + i * dx, yi = f(xi);
      var coef = (i === 0 || i === m) ? 1 : (i % 2 ? 4 : 2);
      if (coef === 1) sum += yi; else sum += coef * yi;
      rows += '<tr><td>' + i + '</td><td>' + plainNum(xi) + '</td><td>' + plainNum(yi) + '</td><td>' + coef + '</td><td>' + plainNum(coef * yi) + '</td></tr>';
    }
    var val = sum * dx / 3;
    h += line('① 该函数不易写出初等原函数，改用<b>复化 Simpson 公式</b>：$n = ' + m + '$，$\\Delta x = ' + numTex(dx) + '$');
    h += line('② 权重按 $1, 4, 2, 4, \\dots, 4, 1$ 取值，代入 $\\dfrac{\\Delta x}{3}\\sum w_i f(x_i)$');
    h += '<table class="cfTb"><thead><tr><th>$i$</th><th>$x_i$</th><th>$f(x_i)$</th><th>$w_i$</th><th>$w_i f(x_i)$</th></tr></thead><tbody>' + rows + '</tbody></table>';
    h += line('③ 结果：$\\displaystyle\\int_{' + numTex(a) + '}^{' + numTex(b) + '} f(x)\\,dx \\approx ' + numTex(val) + '$');
    if (NUM.simpson) {
      var ref = NUM.simpson(f, a, b, 4000);
      h += line('（$n$ 取 ' + m + ' 的误差约 $' + numTex(Math.abs(ref - val)) + '$；更精细的参考值 $' + numTex(ref) + '$）');
    }
    return { html: h, val: val, exact: false };
  }

  /* ---------------- 界面 ---------------- */
  var HTML =
    '<div class="toolWrap cfWrap">' +
    '<h2 class="toolH">公式计算器</h2>' +
    '<p class="toolSub">输入一个表达式，就能同时用上十件工具：求值与画图、<b>符号求导</b>、<b>定积分（含步骤）</b>、' +
    '<b>方程（组）分步求解</b>、<b>极限与单侧极限</b>、<b>泰勒 / 麦克劳林展开</b>、' +
    '<b>单调性 · 极值 · 凹凸 · 拐点</b>、<b>弧长 / 旋转体体积 / 旋转曲面面积</b>、<b>数列与级数部分和</b>。' +
    '支持 <code>+ − × ÷ ^</code>、括号与隐式乘法（<code>2x</code>、<code>3sin(x)</code>）；函数 ' +
    '<code>sin cos tan cot sec csc asin acos atan sinh cosh tanh exp ln log log10 sqrt abs floor ceil sign max min</code>；' +
    '常量 <code>pi</code>、<code>e</code>（<code>log</code> 即自然对数）。</p>' +

    '<div class="cfMain">' +
    '<div class="cfRow"><span class="cfLbl">f(x) =</span>' +
    '<input id="cfF" class="cfIn" spellcheck="false" autocomplete="off" value="x^3 - 3x + 1">' +
    '<select id="cfAng" class="cfSel" title="三角函数的单位"><option value="rad">弧度</option><option value="deg">角度</option></select>' +
    '</div>' +
    '<div class="cfErr" id="cfErr"></div>' +
    '<div class="vizBar" id="cfVizBar"></div>' +
    '<div class="vizOut" id="cfVizOut"></div>' +
    '<div class="cfRow sm">在 $x_0$ = <input id="cfX0" class="cfSm" value="1"> 处：</div>' +
    '<div class="cfQuick" id="cfQuick"></div>' +
    '</div>' +

    '<div class="cfGrid">' +
    '<section class="cfCard"><h3>函数图像</h3><div class="cfCv"><canvas></canvas></div>' +
    '<div class="cfBtns"><button type="button" class="btn ghost" id="cfZoomIn">放大</button>' +
    '<button type="button" class="btn ghost" id="cfZoomOut">缩小</button>' +
    '<button type="button" class="btn ghost" id="cfReset">重置视野</button></div>' +
    '<div class="cfNote">拖动画面可平移；橙色点是图像与 x 轴的交点（零点）。</div></section>' +
    '<section class="cfCard"><h3>求值表</h3>' +
    '<div class="cfRow sm">x 从 <input id="cfTa" class="cfSm" value="0"> 到 <input id="cfTb" class="cfSm" value="3"> 共 <input id="cfTn" class="cfSm" value="7"> 行</div>' +
    '<div class="cfTable" id="cfTable"></div></section>' +

    '<section class="cfCard"><h3>符号求导</h3>' +
    '<div class="cfBtns"><button type="button" class="btn" id="cfD1">求 f′(x)</button>' +
    '<button type="button" class="btn" id="cfD2">求 f″(x)</button>' +
    '<button type="button" class="btn" id="cfD3">求 f‴(x)</button></div>' +
    '<div class="cfOut" id="cfDeriv"></div></section>' +

    '<section class="cfCard"><h3>定积分（含步骤）</h3>' +
    '<div class="cfRow sm">∫ 从 <input id="cfIa" class="cfSm" value="0"> 到 <input id="cfIb" class="cfSm" value="2">，分段数 n = <input id="cfIn" class="cfSm" value="4"></div>' +
    '<div class="cfBtns"><button type="button" class="btn" id="cfInt">计算并展示步骤</button></div>' +
    '<div class="cfOut" id="cfIntOut"></div></section>' +

    '<section class="cfCard"><h3>方程 / 方程组分步求解</h3>' +
    '<div class="cfRow sm"><select id="cfMode" class="cfSel">' +
    '<option value="eq1">一元方程（例：x^2 - 3x + 2 = 0）</option>' +
    '<option value="sys2">线性方程组 2×2（未知数 x, y）</option>' +
    '<option value="sys3">线性方程组 3×3（未知数 x, y, z）</option>' +
    '</select></div>' +
    '<div class="cfEqIn" id="cfEqIn"></div>' +
    '<div class="cfBtns"><button type="button" class="btn" id="cfSolve">求解（含步骤）</button></div>' +
    '<div class="cfOut" id="cfSolveOut"></div></section>' +

    '<section class="cfCard"><h3>极限与单侧极限</h3>' +
    '<div class="cfRow sm">$x \\to$ <input id="cfLimA" class="cfSm" value="0" title="可填数字，也可填 0.5*pi 一类表达式">　' +
    '<select id="cfLimSide" class="cfSel"><option value="both">双侧</option><option value="left">仅左极限</option>' +
    '<option value="right">仅右极限</option></select></div>' +
    '<div class="cfBtns"><button type="button" class="btn" id="cfLim">数值逼近求极限</button></div>' +
    '<div class="cfOut" id="cfLimOut"></div></section>' +

    '<section class="cfCard"><h3>泰勒 / 麦克劳林展开</h3>' +
    '<div class="cfRow sm">在 $x_0$ = <input id="cfTayX0" class="cfSm" value="0"> 处展开到 $n$ = <input id="cfTayN" class="cfSm" value="4"> 阶</div>' +
    '<div class="cfBtns"><button type="button" class="btn" id="cfTay">展开并检验误差</button></div>' +
    '<div class="cfOut" id="cfTayOut"></div></section>' +

    '<section class="cfCard"><h3>单调性 · 极值 · 凹凸 · 拐点</h3>' +
    '<div class="cfRow sm">扫描区间 [<input id="cfAa" class="cfSm" value="-4">, <input id="cfAb" class="cfSm" value="4">]</div>' +
    '<div class="cfBtns"><button type="button" class="btn" id="cfAna">分析临界点与拐点</button></div>' +
    '<div class="cfOut" id="cfAnaOut"></div></section>' +

    '<section class="cfCard"><h3>弧长 · 旋转体体积 · 曲面面积</h3>' +
    '<div class="cfRow sm">区间 [<input id="cfGa" class="cfSm" value="0">, <input id="cfGb" class="cfSm" value="2">]，绕 ' +
    '<select id="cfGaxis" class="cfSel"><option value="x">x 轴</option><option value="y">y 轴</option></select> 旋转</div>' +
    '<div class="cfBtns"><button type="button" class="btn" id="cfGeo">计算三个几何量</button></div>' +
    '<div class="cfOut" id="cfGeoOut"></div></section>' +

    '<section class="cfCard"><h3>数列与级数部分和</h3>' +
    '<div class="cfRow sm">通项 $a_n$ = <input id="cfSerA" class="cfIn" spellcheck="false" autocomplete="off" value="1/n^2"></div>' +
    '<div class="cfRow sm">累加到第 <input id="cfSerN" class="cfSm" value="10"> 项</div>' +
    '<div class="cfBtns"><button type="button" class="btn" id="cfSer">计算部分和并估计级数和</button></div>' +
    '<div class="cfOut" id="cfSerOut"></div></section>' +
    '</div></div>';

  /* ---------------- 可视化输入：边写边看排版结构 ---------------- */
  /* ASCII → LaTeX。eq 为真时允许 “=”，按等号分段各自排版。 */
  function vizTex(src, eq) {
    var s = String(src == null ? '' : src).replace(/\s+/g, '');
    if (!s) return { tex: '' };
    if (eq && s.indexOf('=') >= 0) {
      var parts = s.split('='), box = [];
      for (var i = 0; i < parts.length; i++) {
        if (!parts[i]) return { err: '等号两侧都要有内容' };
        try { box.push(tex(parse(parts[i]), true)); }
        catch (e) { return { err: e.message }; }
      }
      return { tex: box.join(' = ') };
    }
    try { return { tex: tex(parse(s), true) }; }
    catch (e) { return { err: e.message }; }
  }

  /* 结构按钮：tpl 里 %s 是选中的文字，☐ 是插入后光标停留处 */
  var VIZ_BTNS = [
    { t: 'a/b', tip: '分数：填上分子分母，自动排成上下两行', tpl: '(%s)/(\u2610)' },
    { t: 'xⁿ', tip: '指数：插入 ^( )，光标停在指数位置', tpl: '^(\u2610)' },
    { t: 'x²', tip: '平方', tpl: '^2' },
    { t: '√', tip: '根号 sqrt( )', tpl: 'sqrt(%s\u2610)' },
    { t: '|x|', tip: '绝对值 abs( )', tpl: 'abs(%s\u2610)' },
    { t: '( )', tip: '括号', tpl: '(%s\u2610)' },
    { t: 'π', tip: '圆周率 pi', tpl: 'pi' },
    { t: 'eˣ', tip: '指数函数 exp( )', tpl: 'exp(%s\u2610)' },
    { t: 'sin', tip: '正弦 sin( )', tpl: 'sin(%s\u2610)' },
    { t: 'ln', tip: '自然对数 ln( )', tpl: 'ln(%s\u2610)' }
  ];

  var Viz = { host: null, out: null, cur: null, timer: null };

  function vizTarget(inp) { return inp || Viz.cur || $('#cfF', Viz.host); }

  /* 在光标处插入：有选区就把它放进模板的 %s，光标落在 ☐ */
  function vizInsert(tpl) {
    var inp = vizTarget();
    if (!inp) return;
    var a = inp.selectionStart, b = inp.selectionEnd, v = inp.value, sel = v.slice(a, b);
    var mark = tpl.indexOf('\u2610'), body = mark < 0 ? tpl : tpl.slice(0, mark) + tpl.slice(mark + 1);
    var si = body.indexOf('%s'), ins, caret;
    if (si >= 0) {
      ins = body.slice(0, si) + sel + body.slice(si + 2);
      caret = mark < 0 ? ins.length : mark + sel.length - 2;
    } else {
      /* 像 ^() 这种右结合结构没有 %s：把选中内容整体接到前面，别丢字 */
      ins = sel + body;
      caret = sel.length + (mark < 0 ? body.length : mark);
    }
    inp.value = v.slice(0, a) + ins + v.slice(b);
    inp.selectionStart = inp.selectionEnd = a + caret;
    inp.focus();
    vizPaint(true);
  }

  function vizPaintNow() {
    var out = Viz.out;
    if (!out) return;
    var inp = Viz.cur;
    if (!inp) {
      out.className = 'vizOut idle';
      out.innerHTML = '<span class="vizHint">点任意输入框，这里会实时显示它的排版；上面一排按钮可在光标处插入分数、指数等结构。</span>';
      return;
    }
    if (out.offsetParent === null) return;   /* 页面不可见时不排版，避免 MathJax 量到 0 尺寸 */
    var lbl = (inp.getAttribute('data-vizLabel') || '') + ' =';
    var r = vizTex(inp.value, inp.getAttribute('data-vizEq') === '1');
    if (r.err) {
      /* 刚插入的空括号结构还没填，别急着报红 */
      var pending = /\(\s*\)/.test(inp.value);
      out.className = pending ? 'vizOut' : 'vizOut bad';
      out.innerHTML = '<i>' + esc(lbl) + '</i><span class="vizMsg">' +
        (pending ? '括号还空着，填上内容就会显示排版' : '⚠ ' + esc(r.err)) + '</span>';
      return;
    }
    if (!r.tex) {
      out.className = 'vizOut';
      out.innerHTML = '<i>' + esc(lbl) + '</i><span class="vizMsg">（还没输入内容）</span>';
      return;
    }
    out.className = 'vizOut';
    out.innerHTML = '<i>' + esc(lbl) + '</i><span class="vizMath">$' + r.tex + '$</span>';
    fit(out);
  }

  function vizPaint(now) {
    clearTimeout(Viz.timer);
    if (now) { vizPaintNow(); return; }
    Viz.timer = setTimeout(vizPaintNow, 130);
  }

  function vizBind(inp, label, eq) {
    if (!inp) return;
    inp.setAttribute('data-vizLabel', label || '');
    if (eq) inp.setAttribute('data-vizEq', '1');
    if (inp.getAttribute('data-vizBound') === '1') return;
    inp.setAttribute('data-vizBound', '1');
    inp.addEventListener('focus', function () { Viz.cur = inp; vizPaint(true); });
    inp.addEventListener('input', function () { if (Viz.cur === inp) vizPaint(); });
  }

  function vizBar(el) {
    if (!el) return;
    var h = '<span class="vizLbl">插入结构</span>';
    VIZ_BTNS.forEach(function (b, i) {
      h += '<button type="button" class="vizBtn" data-viz="' + i + '" title="' + esc(b.tip) + '">' + b.t + '</button>';
    });
    h += '<span class="vizTip">先选中一部分文字再点按钮，可直接把它包进结构</span>';
    el.innerHTML = h;
    el.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('button[data-viz]') : null;
      if (!b) return;
      var def = VIZ_BTNS[+b.getAttribute('data-viz')];
      if (def) vizInsert(def.tpl);
    });
  }

  var redrawHook = null;

  function mount(host) {
    host.innerHTML = HTML;
    var st = { ast: null, err: '' };
    var cv = $('.cfCv canvas', host);
    var view = CV.View ? new CV.View(cv, { x0: -5, x1: 5, y0: -5, y1: 5, h: 320 }) : null;

    function fnOf() { var ast = st.ast; return function (x) { return ev(ast, { x: x }); }; }
    function autoRange(f, x0, x1) {
      var ys = [], i, N = 320, y;
      for (i = 0; i <= N; i++) { y = f(x0 + (x1 - x0) * i / N); if (isFinite(y)) ys.push(y); }
      if (!ys.length) return [-1, 1];
      ys.sort(function (a, b) { return a - b; });
      var lo = ys[Math.floor(ys.length * 0.02)], hi = ys[Math.min(ys.length - 1, Math.floor(ys.length * 0.98))];
      if (!(hi > lo)) { lo -= 1; hi += 1; }
      var pad = (hi - lo) * 0.18;
      return [lo - pad, hi + pad];
    }
    function paint() {
      if (!view) return;
      var p = CV.pal ? CV.pal() : {};
      view.axes();
      if (!st.ast) return;
      var f = fnOf();
      view.fn(f, { color: p.curve, w: 2.2 });
      var rs = NUM.roots ? NUM.roots(f, view.x0, view.x1, 500) : [];
      rs.slice(0, 14).forEach(function (r) { view.dot(r, 0, { color: p.curve2, r: 3.4 }); });
    }
    function quick() {
      var el = $('#cfQuick', host), f = fnOf(), x0 = parseFloat($('#cfX0', host).value);
      if (!isFinite(x0)) x0 = 0;
      var v = f(x0), d1 = NUM.deriv(f, x0), d2 = NUM.deriv2(f, x0);
      var rs = NUM.roots ? NUM.roots(f, view ? view.x0 : -10, view ? view.x1 : 10, 400) : [];
      var cell = function (k, val) { return '<span class="cfQD"><i>' + k + '</i><b>' + val + '</b></span>'; };
      el.innerHTML = cell('f(x₀)', plainNum(v)) + cell('f′(x₀)', plainNum(d1)) + cell('f″(x₀)', plainNum(d2)) +
        cell('零点（当前视野）', rs.length ? rs.slice(0, 6).map(plainNum).join('、') + (rs.length > 6 ? ' …' : '') : '无');
    }
    function table() {
      var a = parseFloat($('#cfTa', host).value), b = parseFloat($('#cfTb', host).value);
      var n = Math.max(2, Math.min(60, Math.round(parseFloat($('#cfTn', host).value) || 7)));
      if (!isFinite(a) || !isFinite(b)) return;
      var f = fnOf(), rows = '', i;
      for (i = 0; i < n; i++) {
        var x = a + (b - a) * i / (n - 1);
        rows += '<tr><td>' + plainNum(Math.round(x * 1e8) / 1e8) + '</td><td>' + plainNum(f(x)) + '</td></tr>';
      }
      $('#cfTable', host).innerHTML = '<table class="cfTb"><thead><tr><th>$x$</th><th>$f(x)$</th></tr></thead><tbody>' + rows + '</tbody></table>';
      fit($('#cfTable', host));
    }
    var inputTimer = null;
    function rebuild(keepRange) {
      var src = $('#cfF', host).value;
      st.ast = null; st.err = '';
      try { st.ast = parse(src); } catch (e) { st.err = e.message; }
      $('#cfErr', host).innerHTML = st.err ? '⚠ ' + esc(st.err) : '';
      if (!st.ast) {
        $('#cfQuick', host).innerHTML = '';
        $('#cfTable', host).innerHTML = '';
        paint();
        return;
      }
      if (!keepRange && view) {
        var r = autoRange(fnOf(), view.x0, view.x1);
        view.y0 = r[0]; view.y1 = r[1];
      }
      paint(); quick(); table();
    }

    makeDrag(view, function () { paint(); });
    $('#cfF', host).addEventListener('input', function () {
      clearTimeout(inputTimer);
      inputTimer = setTimeout(function () { rebuild(); }, 260);
    });
    $('#cfAng', host).onchange = function () { DEG = this.value === 'deg'; rebuild(true); };
    $('#cfX0', host).addEventListener('input', function () { quick(); });
    ['cfTa', 'cfTb', 'cfTn'].forEach(function (id) {
      $('#' + id, host).addEventListener('input', function () { table(); });
    });

    /* 可视化输入：结构按钮 + 常驻排版预览，焦点落在哪个输入框就预览哪个 */
    Viz.host = host;
    Viz.out = $('#cfVizOut', host);
    vizBar($('#cfVizBar', host));
    vizBind($('#cfF', host), 'f(x)');
    vizBind($('#cfX0', host), 'x₀');
    vizBind($('#cfSerA', host), 'aₙ');
    vizBind($('#cfLimA', host), 'x →');
    vizBind($('#cfTayX0', host), 'x₀');
    vizBind($('#cfTa', host), 'a'); vizBind($('#cfTb', host), 'b');
    vizBind($('#cfIa', host), 'a'); vizBind($('#cfIb', host), 'b');
    vizBind($('#cfAa', host), 'a'); vizBind($('#cfAb', host), 'b');
    vizBind($('#cfGa', host), 'a'); vizBind($('#cfGb', host), 'b');
    vizPaint(true);
    $('#cfZoomIn', host).onclick = function () { zoom(view, 0.8); paint(); quick(); };
    $('#cfZoomOut', host).onclick = function () { zoom(view, 1.25); paint(); quick(); };
    $('#cfReset', host).onclick = function () {
      if (!view) return;
      view.x0 = -5; view.x1 = 5;
      if (st.ast) { var r = autoRange(fnOf(), -5, 5); view.y0 = r[0]; view.y1 = r[1]; }
      else { view.y0 = -5; view.y1 = 5; }
      paint(); quick();
    };

    function deriv(n) {
      if (!st.ast) { $('#cfDeriv', host).innerHTML = '<div class="cfStep">请先输入一个合法的表达式。</div>'; return; }
      var d = st.ast, i, label = ["f'(x)", "f''(x)", "f'''(x)"][n - 1];
      for (i = 0; i < n; i++) d = diff(d, 'x');
      var res = simp(simp(d));
      var html = '<div class="cfStep">对 $f(x) = ' + tex(st.ast) + '$ 逐次求导：</div>' +
        '<div class="cfResult">$' + label + ' = ' + tex(res) + '$</div>';
      var f = fnOf(), dAst = d, g = function (x) { return ev(dAst, { x: x }); }, x12 = 1.3;
      html += '<div class="cfStep">数值校验：用中心差分算 $' + label + '(' + numTex(x12) + ') \\approx ' +
        numTex(NUM.deriv(f, x12)) + '$';
      if (n === 1) html += '，与代入符号结果得到的 $' + numTex(g(x12)) + '$ 一致';
      else if (n === 2) html += '，与二阶差分得到的 $' + numTex(NUM.deriv2(f, x12)) + '$ 一致';
      else html += '，符号式代入得 $' + numTex(g(x12)) + '$';
      html += '。</div>';
      $('#cfDeriv', host).innerHTML = html;
      fit($('#cfDeriv', host));
    }
    $('#cfD1', host).onclick = function () { deriv(1); };
    $('#cfD2', host).onclick = function () { deriv(2); };
    $('#cfD3', host).onclick = function () { deriv(3); };

    $('#cfInt', host).onclick = function () {
      var out = $('#cfIntOut', host);
      try {
        var a = parseFloat($('#cfIa', host).value), b = parseFloat($('#cfIb', host).value);
        var n = parseFloat($('#cfIn', host).value) || 4;
        if (!isFinite(a) || !isFinite(b)) throw new Error('上下限必须是数字');
        var r = integralSteps($('#cfF', host).value, a, b, n);
        out.innerHTML = r.html;
      } catch (e) {
        out.innerHTML = '<div class="cfStep">⚠ ' + esc(e.message) + '</div>';
      }
      fit(out);
    };

    function eqInputs() {
      var mode = $('#cfMode', host).value, h = '';
      if (mode === 'eq1') {
        h = '<div class="cfRow sm">方程：<input id="cfEq0" class="cfIn" value="x^2 - 3x + 2 = 0"></div>';
      } else if (mode === 'sys2') {
        h = '<div class="cfRow sm">① <input id="cfEq0" class="cfIn" value="2x + 3y = 7">　② <input id="cfEq1" class="cfIn" value="x - y = 1"></div>';
      } else {
        h = '<div class="cfRow sm">① <input id="cfEq0" class="cfIn" value="x + y + z = 6">　② <input id="cfEq1" class="cfIn" value="2x - y + z = 3">　③ <input id="cfEq2" class="cfIn" value="x + 2y - z = 2"></div>';
      }
      $('#cfEqIn', host).innerHTML = h;
      vizBind($('#cfEq0', host), '①', true);
      vizBind($('#cfEq1', host), '②', true);
      vizBind($('#cfEq2', host), '③', true);
    }
    $('#cfMode', host).onchange = eqInputs;
    eqInputs();

    $('#cfSolve', host).onclick = function () {
      var out = $('#cfSolveOut', host), mode = $('#cfMode', host).value;
      try {
        var r;
        if (mode === 'eq1') r = solveEq1($('#cfEq0', host).value);
        else if (mode === 'sys2') r = solveLin([$('#cfEq0', host).value, $('#cfEq1', host).value], ['x', 'y']);
        else r = solveLin([$('#cfEq0', host).value, $('#cfEq1', host).value, $('#cfEq2', host).value], ['x', 'y', 'z']);
        out.innerHTML = r.html;
      } catch (e) {
        out.innerHTML = '<div class="cfStep">⚠ ' + esc(e.message) + '</div>';
      }
      fit(out);
    };

    /* ---------------- 新增工具：数值解析 / 表格 ---------------- */
    function numOf(sel, dflt) {
      var s = String($(sel, host).value).trim(), n = parseFloat(s);
      if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s) && isFinite(n)) return n;
      var v = NaN;
      try { v = ev(parse(s), {}); } catch (e2) { v = NaN; }
      if (isFinite(v)) return v;
      if (dflt !== undefined) return dflt;
      throw new Error('无法把「' + s + '」解析成数值');
    }
    function pn(v) { return isFinite(v) ? numTex(v) : '\\text{未定义}'; }
    function tbl(head, rows) {
      return '<table class="cfTb"><thead><tr>' +
        head.map(function (t) { return '<th>$' + t + '$</th>'; }).join('') +
        '</tr></thead><tbody>' + rows + '</tbody></table>';
    }

    /* ---------------- 极限：数值双侧逼近 ---------------- */
    $('#cfLim', host).onclick = function () {
      var out = $('#cfLimOut', host);
      try {
        if (!st.ast) throw new Error('请先输入一个合法的 f(x)');
        var a = numOf('#cfLimA', 0), side = $('#cfLimSide', host).value;
        var f = fnOf(), base = Math.max(Math.abs(a), 1), k, rows = '', L = NaN, R = NaN;
        for (k = 1; k <= 7; k++) {
          var hk = base * Math.pow(10, -k), yl = f(a - hk), yr = f(a + hk);
          if (isFinite(yl)) L = yl;
          if (isFinite(yr)) R = yr;
          rows += '<tr><td>$' + numTex(hk) + '$</td><td>$' + pn(yl) + '$</td><td>$' + pn(yr) + '$</td></tr>';
        }
        var h = line('① 让 $h$ 逐次缩小，观察 $f(a - h)$ 与 $f(a + h)$ 的走向（$a = ' + numTex(a) + '$）：');
        h += tbl(['h', 'f(a - h)', 'f(a + h)'], rows);
        h += line('② 由此得到：左极限 $\\lim\\limits_{x \\to ' + numTex(a) + '^-} f(x) \\approx ' + pn(L) +
          '$，右极限 $\\lim\\limits_{x \\to ' + numTex(a) + '^+} f(x) \\approx ' + pn(R) + '$。');
        var verdict;
        if (side === 'left') verdict = '按你的选择，取左极限 $' + pn(L) + '$。';
        else if (side === 'right') verdict = '按你的选择，取右极限 $' + pn(R) + '$。';
        else if (!isFinite(L) && !isFinite(R)) verdict = '两侧都取不到有限的逼近值，极限<b>不存在</b>。';
        else if (isFinite(L) && isFinite(R) && Math.abs(L - R) < 1e-4 * (1 + Math.abs(L)))
          verdict = '左右极限一致，故 $\\lim\\limits_{x \\to ' + numTex(a) + '} f(x) = ' + numTex((L + R) / 2) + '$。';
        else verdict = '左右极限不一致（$' + pn(L) + '$ 与 $' + pn(R) + '$），故极限<b>不存在</b>。';
        h += '<div class="cfResult">' + verdict + '</div>';
        h += '<div class="cfNote">数值逼近只在该点附近足够光滑、且 $f(a \\pm h)$ 未落入浮点噪声时才可信。遇到 $\\frac{0}{0}$、$\\frac{\\infty}{\\infty}$ 型可先化简表达式，再把 $h$ 调小一档，看趋势是否稳定。</div>';
        out.innerHTML = h;
      } catch (e) {
        out.innerHTML = '<div class="cfStep">⚠ ' + esc(e.message) + '</div>';
      }
      fit(out);
    };

    /* ---------------- 泰勒 / 麦克劳林展开 ---------------- */
    $('#cfTay', host).onclick = function () {
      var out = $('#cfTayOut', host);
      try {
        if (!st.ast) throw new Error('请先输入一个合法的 f(x)');
        var x0 = numOf('#cfTayX0', 0), n = Math.round(numOf('#cfTayN', 4));
        if (!(n >= 1 && n <= 12)) throw new Error('阶数请取 1 ~ 12');
        var ds = [st.ast], d = st.ast, k, fact = 1, P = N(0), rows = '', skipped = 0;
        for (k = 1; k <= n; k++) { d = simp(diff(d, 'x')); ds.push(d); }
        for (k = 0; k <= n; k++) {
          if (k) fact *= k;
          var fk = ev(ds[k], { x: x0 });
          if (!isFinite(fk)) { fk = 0; skipped++; }
          var ck = fk / fact;
          rows += '<tr><td>$' + k + '$</td><td>$' + tex(ds[k]) + '$</td><td>$' + numTex(fk) + '$</td><td>$' + numTex(ck) + '$</td></tr>';
          if (Math.abs(ck) > 1e-14) P = op('+', P, op('*', N(ck), op('^', op('-', { t: 'var', name: 'x' }, N(x0)), N(k))));
        }
        var Ps = simp(simp(P));
        var h = line('① 逐阶求导，并取 $c_k = \\dfrac{f^{(k)}(x_0)}{k!}$（$x_0 = ' + numTex(x0) + '$）：');
        h += tbl(['k', 'f^{(k)}(x)', 'f^{(k)}(x_0)', 'c_k'], rows);
        if (skipped) h += '<div class="cfNote">有 ' + skipped + ' 个阶次的导数在该点取不到有限值，已按 0 处理。</div>';
        h += '<div class="cfResult">$P_{' + n + '}(x) = ' + tex(Ps) + '$</div>';
        var f = fnOf(), g = function (x) { return ev(Ps, { x: x }); }, r2 = '', i;
        for (i = 0; i <= 6; i++) {
          var xx = x0 + (i - 3) * 0.5, fy = f(xx), py = g(xx), er = Math.abs(fy - py);
          r2 += '<tr><td>$' + numTex(xx) + '$</td><td>$' + pn(fy) + '$</td><td>$' + pn(py) + '$</td><td>$' + pn(er) + '$</td></tr>';
        }
        h += line('② 在 $x_0$ 附近取点比较 $f$ 与 $P_{' + n + '}$（这就是' + (Math.abs(x0) < 1e-12 ? '麦克劳林' : '泰勒') + '多项式的效果检验）：');
        h += tbl(['x', 'f(x)', 'P_{' + n + '}(x)', '|f - P_{' + n + '}|'], r2);
        h += '<div class="cfNote">误差由拉格朗日余项 $R_n(x) = \\dfrac{f^{(n+1)}(\\xi)}{(n+1)!}(x - x_0)^{n+1}$ 控制：离 $x_0$ 越远、阶数越低，误差越大；若 $f$ 在 $x_0$ 附近不解析（有奇点、不可导点），阶数再高也追不上。</div>';
        out.innerHTML = h;
      } catch (e) {
        out.innerHTML = '<div class="cfStep">⚠ ' + esc(e.message) + '</div>';
      }
      fit(out);
    };

    /* ---------------- 单调性 / 极值 / 凹凸 / 拐点 ---------------- */
    $('#cfAna', host).onclick = function () {
      var out = $('#cfAnaOut', host);
      try {
        if (!st.ast) throw new Error('请先输入一个合法的 f(x)');
        var a = numOf('#cfAa', -4), b = numOf('#cfAb', 4);
        if (!(b > a)) throw new Error('区间右端必须大于左端');
        var f = fnOf(), d1 = simp(diff(st.ast, 'x')), d2 = simp(diff(d1, 'x'));
        var g1 = function (x) { return ev(d1, { x: x }); }, g2 = function (x) { return ev(d2, { x: x }); };
        var crit = NUM.roots ? NUM.roots(g1, a, b, 800) : [], infl = NUM.roots ? NUM.roots(g2, a, b, 800) : [];
        var eps = function (c) { return Math.max(1e-5, Math.abs(c) * 1e-5); };
        var h = line("① 先求前两阶导数：$f'(x) = " + tex(d1) + "$，$f''(x) = " + tex(d2) + "$。");
        var rows = '', i;
        for (i = 0; i < crit.length; i++) {
          var c = crit[i], s2 = g2(c), kind;
          if (isFinite(s2) && Math.abs(s2) > 1e-9) kind = s2 > 0 ? '<b>极小值</b>' : '<b>极大值</b>';
          else {
            var e1 = eps(c), sl = g1(c - e1), sr = g1(c + e1);
            kind = (sl < 0 && sr > 0) ? '<b>极小值</b>' : (sl > 0 && sr < 0 ? '<b>极大值</b>' : '非极值的驻点');
          }
          rows += '<tr><td>$' + numTex(c) + '$</td><td>$' + pn(f(c)) + '$</td><td>$' + pn(g1(c)) + '$</td><td>$' + pn(s2) + '$</td><td>' + kind + '</td></tr>';
        }
        h += line("② 令 $f'(x) = 0$，在 $[" + numTex(a) + ", " + numTex(b) + "]$ 上共 " + crit.length + " 个临界点：");
        h += crit.length ? tbl(['x', 'f(x)', "f'(x)", "f''(x)", '判定'], rows)
          : '<div class="cfStep">该区间内没有 $f\'(x) = 0$ 的点，函数在整段上单调。</div>';
        var cuts = [a].concat(crit).concat([b]), monoH = '';
        for (i = 0; i < cuts.length - 1; i++) {
          var m = (cuts[i] + cuts[i + 1]) / 2, sg = g1(m);
          monoH += '<span class="cfQD"><i>$(' + numTex(cuts[i]) + ', ' + numTex(cuts[i + 1]) + ')$</i><b>' +
            (sg > 0 ? '递增 ↗' : (sg < 0 ? '递减 ↘' : '水平 →')) + '</b></span>';
        }
        h += line("③ 由 $f'$ 的符号读出单调区间：") + '<div class="cfQuick">' + monoH + '</div>';
        var rows2 = '';
        for (i = 0; i < infl.length; i++) {
          var c2 = infl[i], e2 = eps(c2), sl2 = g2(c2 - e2), sr2 = g2(c2 + e2), k2;
          if (sl2 < 0 && sr2 > 0) k2 = '<b>拐点</b>（凹向下 → 凹向上）';
          else if (sl2 > 0 && sr2 < 0) k2 = '<b>拐点</b>（凹向上 → 凹向下）';
          else k2 = '未变号，不是拐点';
          rows2 += '<tr><td>$' + numTex(c2) + '$</td><td>$' + pn(f(c2)) + '$</td><td>$' + pn(sl2) + '$</td><td>$' + pn(sr2) + '$</td><td>' + k2 + '</td></tr>';
        }
        h += line("④ 令 $f''(x) = 0$，区间内共 " + infl.length + " 个候选点：");
        h += infl.length ? tbl(['x', 'f(x)', "f''(x^-)", "f''(x^+)", '判定'], rows2)
          : '<div class="cfStep">该区间内 $f\'\'(x)$ 不变号，整段凹凸性一致。</div>';
        var cuts2 = [a].concat(infl).concat([b]), concH = '';
        for (i = 0; i < cuts2.length - 1; i++) {
          var m2 = (cuts2[i] + cuts2[i + 1]) / 2, sg2 = g2(m2);
          concH += '<span class="cfQD"><i>$(' + numTex(cuts2[i]) + ', ' + numTex(cuts2[i + 1]) + ')$</i><b>' +
            (sg2 > 0 ? '凹向上 ∪' : '凹向下 ∩') + '</b></span>';
        }
        h += line("⑤ 凹凸区间：") + '<div class="cfQuick">' + concH + '</div>';
        h += '<div class="cfNote">临界点与拐点都由数值求根得到：重根、过分密集的根，或靠近区间端点的特征可能被合并或漏掉，请与上方图像对照确认。</div>';
        out.innerHTML = h;
      } catch (e) {
        out.innerHTML = '<div class="cfStep">⚠ ' + esc(e.message) + '</div>';
      }
      fit(out);
    };

    /* ---------------- 弧长 / 旋转体体积 / 曲面面积 ---------------- */
    $('#cfGeo', host).onclick = function () {
      var out = $('#cfGeoOut', host);
      try {
        if (!st.ast) throw new Error('请先输入一个合法的 f(x)');
        var a = numOf('#cfGa', 0), b = numOf('#cfGb', 2), ax = $('#cfGaxis', host).value;
        if (!(b > a)) throw new Error('区间右端必须大于左端');
        var f = fnOf(), d1 = simp(diff(st.ast, 'x')), N0 = 3000;
        var g = function (x) { return ev(d1, { x: x }); };
        var arc = function (x) { var u = g(x); return Math.sqrt(1 + u * u); };
        var L = NUM.simpson(arc, a, b, N0), V, S;
        if (ax === 'x') {
          V = Math.PI * NUM.simpson(function (x) { return f(x) * f(x); }, a, b, N0);
          S = 2 * Math.PI * NUM.simpson(function (x) { return Math.abs(f(x)) * arc(x); }, a, b, N0);
        } else {
          V = 2 * Math.PI * NUM.simpson(function (x) { return x * f(x); }, a, b, N0);
          S = 2 * Math.PI * NUM.simpson(function (x) { return Math.abs(x) * arc(x); }, a, b, N0);
        }
        var h = line("① 先求导：$f'(x) = " + tex(d1) + "$，弧长微元为 $ds = \\sqrt{1 + [f'(x)]^2}\\,dx$。");
        h += line("② 弧长：$\\displaystyle L = \\int_{" + numTex(a) + "}^{" + numTex(b) + "} \\sqrt{1 + [f'(x)]^2}\\,dx = " + numTex(L) + "$");
        if (ax === 'x') {
          h += line("③ 绕 $x$ 轴旋转，圆盘法：$\\displaystyle V = \\pi\\int_{" + numTex(a) + "}^{" + numTex(b) + "} [f(x)]^2\\,dx = " + numTex(V) + "$");
          h += line("④ 旋转曲面面积：$\\displaystyle S = 2\\pi\\int_{" + numTex(a) + "}^{" + numTex(b) + "} |f(x)|\\,\\sqrt{1 + [f'(x)]^2}\\,dx = " + numTex(S) + "$");
        } else {
          h += line("③ 绕 $y$ 轴旋转，柱壳法：$\\displaystyle V = 2\\pi\\int_{" + numTex(a) + "}^{" + numTex(b) + "} x\\,f(x)\\,dx = " + numTex(V) + "$");
          h += line("④ 旋转曲面面积：$\\displaystyle S = 2\\pi\\int_{" + numTex(a) + "}^{" + numTex(b) + "} |x|\\,\\sqrt{1 + [f'(x)]^2}\\,dx = " + numTex(S) + "$");
        }
        h += '<div class="cfResult">$L = ' + numTex(L) + ',\\qquad V = ' + numTex(V) + ',\\qquad S = ' + numTex(S) + '$</div>';
        var c = polyOf(st.ast, 'x'), ex = '';
        if (c && ax === 'x') {
          var sq = mulP(c, c), FV = sq.map(function (co, k) { return co / (k + 1); });
          var Vex = Math.PI * (polyEval(FV, b) - polyEval(FV, a));
          if (isFinite(Vex)) ex = '本例 $f$ 是多项式，$\\int [f(x)]^2 dx$ 可逐项积分，体积的精确值为 $' + numTex(Vex) + '$（与数值结果相差 $' + numTex(Math.abs(Vex - V)) + '$）。';
        }
        h += '<div class="cfNote">三个量都用复化 Simpson 公式（$n = ' + N0 + '$）数值积分得到。' + ex +
          '注意柱壳法被积的是 $x\\,f(x)$：区间跨过 $x = 0$ 时正负部分会相减，需要分段处理。</div>';
        out.innerHTML = h;
      } catch (e) {
        out.innerHTML = '<div class="cfStep">⚠ ' + esc(e.message) + '</div>';
      }
      fit(out);
    };

    /* ---------------- 数列与级数部分和 ---------------- */
    $('#cfSer', host).onclick = function () {
      var out = $('#cfSerOut', host);
      try {
        var ast = parse($('#cfSerA', host).value);
        var N0 = Math.round(numOf('#cfSerN', 10));
        if (!(N0 >= 2 && N0 <= 200)) throw new Error('项数请取 2 ~ 200');
        var an = function (k) { return ev(ast, { n: k }); };
        var s = 0, rows = '', k, lastA = 0;
        for (k = 1; k <= N0; k++) {
          var ak = an(k);
          if (!isFinite(ak)) ak = 0;
          s += ak; lastA = ak;
          rows += '<tr><td>$' + k + '$</td><td>$' + numTex(ak) + '$</td><td>$' + numTex(s) + '$</td></tr>';
        }
        var h = line('① 通项 $a_n = ' + tex(ast) + '$，逐项累加得部分和 $S_N = \\sum_{n=1}^{N} a_n$：');
        h += tbl(['n', 'a_n', 'S_n'], rows);
        h += line('② 末项 $a_{' + N0 + '} = ' + pn(lastA) + '$' + (Math.abs(lastA) > 1e-3
          ? '。收敛的必要条件是 $a_n \\to 0$：末项还这么大，可先把项数调大，看它是否持续变小。'
          : '，已经相当接近 0（$a_n \\to 0$ 只是收敛的必要条件，不是充分条件）。'));
        var an1 = an(N0 + 1), an2 = an(N0 + 2), dv = an2 - an1, ait = NaN;
        if (isFinite(an1) && isFinite(dv) && Math.abs(dv) > 1e-15) ait = s - an1 * an1 / dv;
        h += line('③ 用 Aitken $\\Delta^2$ 加速（相当于把尾部按几何级数外推）：' + (isFinite(ait)
          ? '$\\displaystyle S \\approx S_{' + N0 + '} - \\frac{\\left(S_{' + (N0 + 1) + '} - S_{' + N0 + '}\\right)^2}{S_{' + (N0 + 2) + '} - 2S_{' + (N0 + 1) + '} + S_{' + N0 + '}} = ' + numTex(ait) + '$'
          : '本例尾部不呈几何形态，加速不适用。'));
        var ratio = (Math.abs(lastA) > 1e-15 && Math.abs(an1) > 1e-15) ? an1 / lastA : NaN;
        if (isFinite(ratio) && Math.abs(ratio) < 1) {
          var sex = s + an1 / (1 - ratio);
          h += line('④ 相邻两项之比稳定在 $r \\approx ' + numTex(ratio) + '$（$|r| < 1$），按几何级数补齐尾部：$\\displaystyle S \\approx S_{' + N0 + '} + \\frac{a_{' + (N0 + 1) + '}}{1 - r} = ' + numTex(sex) + '$');
        }
        h += '<div class="cfNote">这里给的都是数值估计：收敛时 $S_N$ 会稳定下来，发散时持续增大或来回震荡。精确和要用判别法或已知级数（例如 $\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$）。通项里的自变量请写成 <code>n</code>。</div>';
        out.innerHTML = h;
      } catch (e) {
        out.innerHTML = '<div class="cfStep">⚠ ' + esc(e.message) + '</div>';
      }
      fit(out);
    };

    rebuild();
    redrawHook = function () {
      if (view) { view.fit(); }
      rebuild(true);
      vizPaint(true);   /* 从别的页切回来时补画预览（隐藏期间不排版） */
    };
  }

  function zoom(v, k) {
    if (!v) return;
    var cx = (v.x0 + v.x1) / 2, cy = (v.y0 + v.y1) / 2;
    var hx = (v.x1 - v.x0) / 2 * k, hy = (v.y1 - v.y0) / 2 * k;
    v.x0 = cx - hx; v.x1 = cx + hx; v.y0 = cy - hy; v.y1 = cy + hy;
  }
  function makeDrag(v, redraw) {
    if (!v) return;
    var cv = v.cv, on = false, lx = 0, ly = 0;
    cv.style.cursor = 'grab';
    cv.addEventListener('pointerdown', function (e) {
      on = true; lx = e.clientX; ly = e.clientY;
      try { cv.setPointerCapture(e.pointerId); } catch (err) {}
      cv.style.cursor = 'grabbing';
    });
    cv.addEventListener('pointermove', function (e) {
      if (!on) return;
      v.pan(e.clientX - lx, e.clientY - ly);
      lx = e.clientX; ly = e.clientY;
      redraw();
    });
    function up() { on = false; cv.style.cursor = 'grab'; }
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
  }

  window.SITE_CALC = {
    mount: mount,
    redraw: function () { if (redrawHook) redrawHook(); }
  };
})();
