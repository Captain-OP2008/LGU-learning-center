/* =====================================================================
 * CSC1004 学习站 · labs2.js（实验台注册表 B）
 * 职责：用 CSC.registerLabs 注册 Part VI–VII 的 6 个交互实验台（ch15–ch20）：
 *   pyjava（Java↔Python 语法逐行对照 + 输出测验）、pyclass（Python 类对象卡）、
 *   tkinter（pack / grid / place 三种几何管理对照）、snake（可玩贪吃蛇 + 慢动作演示）、
 *   mlnet（PyTorch 训练循环示意）、examclock（期末 100 分钟分配器）。
 * 对外 API：每个实验台 { title, desc, icon, order, tags, init(root, props, ctx) }；
 *   init 只渲染、不发请求；返回 { destroy() } 清理定时器 / rAF / 事件监听。
 * 依赖：CSC（app.js 提供 el/icon/escapeHtml/bus）。mlnet 的 loss 曲线优先用
 *   CSC.viz.lineChart，viz 未就绪时降级为纯文本提示，其余功能不受影响。
 * 约定：IIFE + 'use strict'；不写内联样式（动态坐标 / 尺寸除外）；颜色只用 CSS 变量。
 * 作者模块：labs-py
 * ===================================================================== */
(function () {
  'use strict';

  var CSC = window.CSC;
  if (!CSC) {
    console.error('[labs2] 必须先加载 app.js');
    return;
  }

  /* =====================================================================
   * 一、通用工具：DOM 工厂 / 控件 / 代码高亮 / 生命周期
   * ===================================================================== */
  function E(tag, attrs, children) { return CSC.el(tag, attrs, children); }

  function esc(s) {
    if (typeof CSC.escapeHtml === 'function') return CSC.escapeHtml(String(s == null ? '' : s));
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function icon(name) { return typeof CSC.icon === 'function' ? CSC.icon(name) : ''; }

  /** 一行控件容器（.labCtl 自动换行） */
  function ctl(parent) {
    var d = E('div', { class: 'labCtl' });
    if (parent) parent.appendChild(d);
    return d;
  }

  /** 实验台按钮；opts: { icon, cls, title } */
  function button(parent, label, onClick, opts) {
    opts = opts || {};
    var b = E('button', { class: 'labBtn' + (opts.cls ? ' ' + opts.cls : ''), type: 'button' });
    if (opts.title) b.title = opts.title;
    if (opts.icon) b.innerHTML = icon(opts.icon);
    b.appendChild(E('span', { text: label }));
    b.addEventListener('click', function () { if (typeof onClick === 'function') onClick(); });
    if (parent) parent.appendChild(b);
    return b;
  }

  /** 分段按钮组（直接放进一个 .labCtl 行）：items [{value,label}]，返回 { set(v), btns } */
  function segButtons(parent, items, value, onPick) {
    var btns = {};
    (items || []).forEach(function (it) {
      btns[it.value] = button(parent, it.label, function () { onPick(it.value); });
    });
    function set(v) {
      Object.keys(btns).forEach(function (k) { btns[k].classList.toggle('on', String(k) === String(v)); });
    }
    set(value);
    return { set: set, btns: btns };
  }

  /** 下拉框；返回 { el, set(v) } */
  function selectBox(parent, options, value, onChange) {
    var s = E('select', { class: 'labSelect' });
    (options || []).forEach(function (o) {
      var op = E('option', { value: o.value, text: o.label });
      if (String(o.value) === String(value)) op.selected = true;
      s.appendChild(op);
    });
    s.addEventListener('change', function () { if (onChange) onChange(String(s.value)); });
    if (parent) parent.appendChild(s);
    return { el: s, set: function (v) { s.value = String(v); } };
  }

  /** 滑块；opts: { label, min, max, step, value, fmt(v), onInput(v) } */
  function slider(parent, opts) {
    var wrap = E('label', { class: 'labSlider' });
    var lab = E('span', { text: opts.label || '' });
    var inp = E('input', {
      type: 'range',
      min: opts.min != null ? opts.min : 0,
      max: opts.max != null ? opts.max : 10,
      step: opts.step || 1,
      value: opts.value != null ? opts.value : 0
    });
    var val = E('span', { class: 'mono', text: '' });
    function show() {
      var v = Number(inp.value);
      val.textContent = opts.fmt ? opts.fmt(v) : String(v);
    }
    inp.addEventListener('input', function () {
      show();
      if (opts.onInput) opts.onInput(Number(inp.value));
    });
    wrap.appendChild(lab);
    wrap.appendChild(inp);
    wrap.appendChild(val);
    show();
    if (parent) parent.appendChild(wrap);
    return {
      el: wrap,
      input: inp,
      setLabel: function (t) { lab.textContent = t; },
      set: function (v) { inp.value = String(v); show(); },
      get: function () { return Number(inp.value); }
    };
  }

  /** 状态说明条：主文本允许少量 HTML（<b>），右侧显示附加读数 */
  function note(parent) {
    var wrap = E('div', { class: 'labNote' });
    var msg = E('span');
    var right = E('span', { class: 'ln2' });
    wrap.appendChild(msg);
    wrap.appendChild(right);
    if (parent) parent.appendChild(wrap);
    return {
      el: wrap,
      set: function (html, extra) {
        msg.innerHTML = html == null ? '' : String(html);
        right.textContent = extra == null ? '' : String(extra);
      }
    };
  }

  /** 统计读数条：set([{label, value, hot}]) */
  function stats(parent) {
    var wrap = E('div', { class: 'labStat' });
    if (parent) parent.appendChild(wrap);
    return {
      el: wrap,
      set: function (items) {
        wrap.innerHTML = '';
        (items || []).forEach(function (it) {
          if (!it) return;
          var s = E('span');
          if (it.label) s.appendChild(document.createTextNode(it.label + ' '));
          s.appendChild(E('b', { class: it.hot ? 'hot' : '', html: esc(it.value) }));
          wrap.appendChild(s);
        });
      }
    };
  }

  /** 小标题 */
  function sec(parent, text) {
    var h = E('h4', { class: 'blockH', text: text });
    if (parent) parent.appendChild(h);
    return h;
  }

  /** 灰色提示文本 */
  function hint(parent, text) {
    var d = E('div', { class: 'varEmpty', text: text || '' });
    if (parent) parent.appendChild(d);
    return d;
  }

  /** 大数字读数卡 */
  function statCard(parent, value, label) {
    var d = E('div', { class: 'statCard' }, [
      E('div', { class: 'sv', text: String(value) }),
      E('div', { class: 'sl', text: String(label) })
    ]);
    if (parent) parent.appendChild(d);
    return {
      el: d,
      set: function (v, l, kind) {
        d.className = 'statCard' + (kind ? ' ' + kind : '');
        var sv = d.children[0];
        var sl = d.children[1];
        if (sv) sv.textContent = String(v);
        if (sl && l != null) sl.textContent = String(l);
      }
    };
  }

  /** 表格：head 为字符串数组，rows 为数组的数组（单元格允许 HTML） */
  function table(parent, head, rows, caption) {
    var wrap = E('div', { class: 'tableWrap' });
    var t = E('table');
    if (head && head.length) {
      var thead = E('thead');
      var tr = E('tr');
      head.forEach(function (h) { tr.appendChild(E('th', { html: h })); });
      thead.appendChild(tr);
      t.appendChild(thead);
    }
    var tbody = E('tbody');
    (rows || []).forEach(function (row) {
      var tr2 = E('tr');
      (row || []).forEach(function (c) { tr2.appendChild(E('td', { html: c == null ? '' : String(c) })); });
      tbody.appendChild(tr2);
    });
    t.appendChild(tbody);
    wrap.appendChild(t);
    if (caption) wrap.appendChild(E('div', { class: 'cap', html: caption }));
    if (parent) parent.appendChild(wrap);
    return wrap;
  }

  /* ----------------------------------------------------------- 代码高亮 */
  var JAVA_KW = ('abstract assert boolean break byte case catch char class const continue default do double else enum '
    + 'extends final finally float for goto if implements import instanceof int interface long native new package '
    + 'private protected public return short static super switch synchronized this throw throws transient try void '
    + 'volatile while true false null').split(' ');
  var PY_KW = ('and as assert break class continue def del elif else except False finally for from global if import in '
    + 'is lambda None nonlocal not or pass raise return True try while with yield').split(' ');
  var JAVA_TY = ('String Integer Double Character Boolean Math System Object Scanner ArrayList Arrays List Map Set '
    + 'HashMap StringBuilder Collections Exception RuntimeException').split(' ');
  var PY_TY = ('int float str bool list dict tuple set len range print type super self open input isinstance random Tk '
    + 'Canvas Frame Button Label Entry mainloop').split(' ');

  function toSet(list) {
    var o = {};
    (list || []).forEach(function (k) { o[k] = 1; });
    return o;
  }
  var JAVA_KW_SET = toSet(JAVA_KW);
  var JAVA_TY_SET = toSet(JAVA_TY);
  var PY_KW_SET = toSet(PY_KW);
  var PY_TY_SET = toSet(PY_TY);

  /**
   * 极简高亮：注释 / 字符串 / 数字 / 关键字 / 已知类型 / 调用名 / 运算符。
   * 只依赖 .tk-* 类（app.css 已定义），不产生内联样式。
   */
  function highlight(src, lang) {
    var code = String(src == null ? '' : src);
    var isPy = lang === 'py';
    var KW = isPy ? PY_KW_SET : JAVA_KW_SET;
    var TY = isPy ? PY_TY_SET : JAVA_TY_SET;
    var out = '';
    var i = 0;
    var n = code.length;
    function isIdStart(c) { return /[A-Za-z_$]/.test(c); }
    function isId(c) { return /[A-Za-z0-9_$]/.test(c); }
    while (i < n) {
      var c = code[i];
      var c2 = code[i + 1];
      /* 行注释 */
      if ((isPy && c === '#') || (!isPy && c === '/' && c2 === '/')) {
        var j = code.indexOf('\n', i);
        if (j < 0) j = n;
        out += '<span class="tk-cmt">' + esc(code.slice(i, j)) + '</span>';
        i = j;
        continue;
      }
      /* 块注释（Java） */
      if (!isPy && c === '/' && c2 === '*') {
        var jj = code.indexOf('*/', i + 2);
        jj = jj < 0 ? n : jj + 2;
        out += '<span class="tk-cmt">' + esc(code.slice(i, jj)) + '</span>';
        i = jj;
        continue;
      }
      /* 字符串（含 Python 的 f"" 前缀由标识符分支自然处理） */
      if (c === '"' || c === "'") {
        var q = c;
        var j2 = i + 1;
        while (j2 < n) {
          if (code[j2] === '\\') { j2 += 2; continue; }
          if (code[j2] === q) { j2++; break; }
          if (code[j2] === '\n') break;
          j2++;
        }
        out += '<span class="tk-str">' + esc(code.slice(i, j2)) + '</span>';
        i = j2;
        continue;
      }
      /* 数字 */
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(c2 || ''))) {
        var j3 = i;
        while (j3 < n && /[0-9a-fA-FxX._eE]/.test(code[j3])) j3++;
        out += '<span class="tk-num">' + esc(code.slice(i, j3)) + '</span>';
        i = j3;
        continue;
      }
      /* 标识符 */
      if (isIdStart(c)) {
        var j4 = i + 1;
        while (j4 < n && isId(code[j4])) j4++;
        var w = code.slice(i, j4);
        var after = code.slice(j4, j4 + 40);
        if (KW[w]) out += '<span class="tk-kw">' + w + '</span>';
        else if (TY[w]) out += '<span class="tk-type">' + w + '</span>';
        else if (/^\s*\(/.test(after)) out += '<span class="tk-meth">' + esc(w) + '</span>';
        else out += esc(w);
        i = j4;
        continue;
      }
      /* 运算符 */
      if (/[+\-*/%=<>!&|^~?:]/.test(c)) out += '<span class="tk-op">' + esc(c) + '</span>';
      else out += esc(c);
      i++;
    }
    return out;
  }

  /** 按行渲染代码（带行号与聚焦行），返回 HTML 字符串 */
  function codeHtml(lines, lang, focus) {
    var html = '';
    for (var i = 0; i < (lines || []).length; i++) {
      var no = i + 1;
      var on = focus && focus.indexOf(no) >= 0;
      html += '<span class="line' + (on ? ' focus' : '') + '" data-line="' + no + '">'
        + '<span class="ln' + (on ? ' focus' : '') + '">' + no + '</span>'
        + highlight(lines[i], lang) + '</span>';
    }
    return html || '<span class="line" data-line="1"><span class="ln">1</span></span>';
  }

  /**
   * 代码面板：带标题条 / 行号 / 聚焦行 / 行点击。
   * opts: { title, lang, lines, focus, onLine(no) }
   */
  function codePanel(parent, opts) {
    opts = opts || {};
    var box = E('div', { class: 'codeBox' });
    var head = E('div', { class: 'codeBoxHead' }, [
      E('div', { class: 'codeDots' }, [E('i'), E('i'), E('i')]),
      E('div', { class: 'cbT', html: '<b>' + esc(opts.title || 'code') + '</b>' }),
      opts.lang ? E('span', { class: 'pill info', text: opts.lang === 'py' ? 'PYTHON' : 'JAVA' }) : null
    ]);
    var pre = E('pre');
    box.appendChild(head);
    box.appendChild(pre);
    var lines = (opts.lines || []).slice();
    function paint(focus) { pre.innerHTML = codeHtml(lines, opts.lang, focus); }
    paint(opts.focus);
    if (typeof opts.onLine === 'function') {
      pre.addEventListener('click', function (ev) {
        var node = ev.target;
        while (node && node !== pre && !(node.classList && node.classList.contains('line'))) node = node.parentNode;
        if (node && node !== pre && node.classList && node.classList.contains('line')) {
          opts.onLine(Number(node.getAttribute('data-line')));
        }
      });
    }
    if (parent) parent.appendChild(box);
    return {
      el: box,
      pre: pre,
      setLines: function (next, focus) { lines = (next || []).slice(); paint(focus); },
      setFocus: paint,
      lines: function () { return lines; }
    };
  }

  /** 只切换聚焦行，不重建代码 HTML（pyjava 逐行对照用，性能更好） */
  function markCodeLines(pre, numbers) {
    if (!pre) return;
    var set = {};
    (numbers || []).forEach(function (n) { set[n] = 1; });
    var list = pre.querySelectorAll('.line');
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      var no = Number(el.getAttribute('data-line'));
      var on = !!set[no];
      el.classList.toggle('focus', on);
      var ln = el.firstChild;
      if (ln && ln.classList) ln.classList.toggle('focus', on);
    }
  }

  /* ----------------------------------------------------------- SVG 工具 */
  var SVG_NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, children) {
    var node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        node.setAttribute(k, v === true ? '' : String(v));
      });
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }
  function svgTxt(x, y, str, cls, anchor) {
    var t = svgEl('text', { x: x, y: y, class: cls || 'vizLabel' });
    if (anchor) t.setAttribute('text-anchor', anchor);
    t.textContent = str == null ? '' : String(str);
    return t;
  }

  /** 读 CSS 变量（画布需要具体色值；变量本身只在 CSS 里定义） */
  function cssVar(name) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name);
      return v ? v.trim() : '';
    } catch (e) { return ''; }
  }

  /* ----------------------------------------------------------- 生命周期 */
  function makeKit() {
    var timers = [];
    var rafs = [];
    var cleanups = [];
    var dead = false;
    return {
      dead: function () { return dead; },
      timeout: function (fn, ms) {
        var id = setTimeout(function () { if (!dead) fn(); }, ms);
        timers.push(id);
        return id;
      },
      interval: function (fn, ms) {
        var id = setInterval(function () { if (!dead) fn(); }, ms);
        timers.push(id);
        return id;
      },
      raf: function (fn) {
        function loop(ts) {
          if (dead) return;
          fn(ts);
          rafs.push(requestAnimationFrame(loop));
        }
        rafs.push(requestAnimationFrame(loop));
      },
      on: function (target, type, fn, opts) {
        if (!target || !target.addEventListener) return;
        target.addEventListener(type, fn, opts);
        cleanups.push(function () { target.removeEventListener(type, fn, opts); });
      },
      onDestroy: function (fn) { cleanups.push(fn); },
      destroy: function () {
        if (dead) return;
        dead = true;
        timers.forEach(function (id) { clearTimeout(id); });
        timers.length = 0;
        rafs.forEach(function (id) { cancelAnimationFrame(id); });
        rafs.length = 0;
        cleanups.forEach(function (fn) {
          try { fn(); } catch (e) { console.error('[labs2] 清理失败', e); }
        });
        cleanups.length = 0;
      }
    };
  }

  /** viz 就绪后执行；超时兜底（viz 永远不出现也不会卡死实验台） */
  function whenViz(cb) {
    if (CSC.viz) { cb(); return; }
    var done = false;
    function go() {
      if (done) return;
      done = true;
      cb();
    }
    if (CSC.bus && typeof CSC.bus.on === 'function') CSC.bus.on('viz:ready', go);
    setTimeout(go, 3000);
  }

  /**
   * 实验台包装器：统一错误兜底 + 自动销毁。
   * app.js 目前不保存 init 的返回值，因此额外用 MutationObserver 监听 #content：
   * 一旦本实验台根节点被移出文档（切换路由/章节重渲染），立刻清理定时器与监听。
   */
  function lab(initFn) {
    return function (root, props, ctx) {
      var kit = makeKit();
      var mo = null;
      try {
        initFn(root, props || {}, ctx || {}, kit);
      } catch (e) {
        console.error('[labs2] 实验台初始化失败', e);
        if (root) root.appendChild(E('div', { class: 'varEmpty', text: '实验台初始化失败：' + (e && e.message ? e.message : e) }));
      }
      var api = {
        destroy: function () {
          if (mo) { mo.disconnect(); mo = null; }
          kit.destroy();
        }
      };
      try {
        var host = document.getElementById('content') || document.body;
        if (window.MutationObserver && host && root.isConnected) {
          mo = new MutationObserver(function () {
            if (!root.isConnected) api.destroy();
          });
          mo.observe(host, { childList: true, subtree: true });
        }
      } catch (e) { /* 观察失败不影响实验台本身 */ }
      return api;
    };
  }

  /* =====================================================================
   * 二、Part VI–VII 实验台
   * ===================================================================== */
  var LABS = {};

  /* =====================================================================
   * 1. pyjava · Java ↔ Python 语法逐行对照（ch15）
   * 数据：rows 为「同一行」的 [Java, Python, 说明]，左右行号一一对应，
   * 点任意一行即可同时高亮两侧，差异一眼可见。
   * ===================================================================== */
  var PYJAVA_TOPICS = [
    {
      label: '变量 / 类型',
      intro: 'Java 是强类型（strongly typed）语言：声明变量时必须写类型，之后不能随便换。'
        + 'Python 的变量只是一个名字（name），绑定到对象上，类型由对象决定——同一个名字可以先后指向 int、str、list。',
      rows: [
        ['int age = 20;', 'age = 20', 'Java 先写类型 int 再写名字；Python 直接赋值，类型由 20 推断。'],
        ['double pi = 3.14;', 'pi = 3.14', 'double ↔ Python 的 float（都是双精度浮点）。'],
        ['boolean ok = true;', 'ok = True', '布尔值：Java 小写 true / false，Python 首字母大写 True / False。'],
        ['String name = "Alice";', 'name = "Alice"', 'String ↔ str；字符串两边都用双引号（Python 也接受单引号）。'],
        ['int x = (int) 3.9;', 'x = int(3.9)', 'Casting 强转：Java 用 (类型)，Python 用 int() / float() / str()。int() 直接截断小数。'],
        ['System.out.println(x);', 'print(x)', '输出：System.out.println ↔ print()，Python 不用分号。'],
        ['// Java 用 instanceof 判断对象类型', 'print(type(x))', 'Python 有 type() 查类型；Java 用 instanceof 判断引用的真实类型。']
      ],
      quiz: {
        stem: '下面这段 Python 输出什么？',
        code: 'x = 3.9\ny = int(x)\nprint(y)',
        options: ['3', '3.9', '4', '报错：int() 不能把 float 转成 int'],
        answer: 0,
        explain: 'int(3.9) 直接截断小数部分得到 3，<b>不是四舍五入</b>。Java 的 <code>(int) 3.9</code> 同样是截断，二者行为一致。'
      }
    },
    {
      label: '字符串',
      intro: '两边都能用 + 拼接字符串。区别在方法名：Java 用驼峰命名（length / toUpperCase），'
        + 'Python 用下划线命名（len / upper）；Java 取字符用 charAt(i)，Python 用下标 s[i]，切片 s[a:b] 都不含结束位置。',
      rows: [
        ['String s = "Hello";', 's = "Hello"', '创建字符串的写法几乎一样。'],
        ['int n = s.length();', 'n = len(s)', '取长度：Java 是方法 length()；Python 是内置函数 len()。'],
        ['String u = s.toUpperCase();', 'u = s.upper()', 'Java 驼峰，Python 小写下划线；返回新字符串，原串不变。'],
        ['char c = s.charAt(0);', 'c = s[0]', '取单个字符：charAt(0) ↔ s[0]。Python 没有单独的 char 类型，就是长度为 1 的 str。'],
        ['String sub = s.substring(1, 3);', 'sub = s[1:3]', '两者都不含结束位置：都得到 "el"。'],
        ['String t = s + " Python";', 't = s + " Python"', '字符串拼接两边写法一致。']
      ],
      quiz: {
        stem: '下面这段 Python 输出什么？',
        code: 's = "Hello"\nprint(s[1:3])',
        options: ['el', 'ell', 'He', 'llo'],
        answer: 0,
        explain: 'Python 切片 <code>s[1:3]</code> 从下标 1 开始、到下标 3 之前结束，即 s[1] 与 s[2]，结果是 "el"。'
          + '这与 Java 的 <code>substring(1, 3)</code> 完全一致。'
      }
    },
    {
      label: 'list vs 数组',
      intro: 'Java 的数组长度固定，ArrayList 才能动态增删；Python 的 list 天生可变，而且一个 list 里可以放不同类型。'
        + '考试里最容易混的是「怎么取长度」和「怎么增删」。',
      rows: [
        ['int[] nums = {1, 2, 3};', 'nums = [1, 2, 3]', 'Java 数组用 {}；Python list 用 []，长度可变。'],
        ['int first = nums[0];', 'first = nums[0]', '下标都从 0 开始，写法一样。'],
        ['int len = nums.length;', 'length = len(nums)', '数组用 .length 字段，list 用 len() 函数——Java 里是字段不是方法。'],
        ['ArrayList<Integer> list = new ArrayList<>();', 'mixed = ["abc", 34, True]', 'Java 泛型 list 只能放一种类型；Python list 可以混放不同类型。'],
        ['list.add(4);', 'mixed.append(4)', '尾部追加：add ↔ append。'],
        ['list.set(0, 9);', 'mixed[0] = 9', '修改元素：set(i, v) ↔ 下标赋值。'],
        ['list.remove(0);', 'mixed.pop(0)', '按下标删除：remove(i) ↔ pop(i)。Python 的 remove(值) 是按值删。'],
        ['for (int v : nums) { ... }', 'for v in nums:', '增强 for 循环 ↔ for-in 循环。']
      ],
      quiz: {
        stem: '下面这段 Python 输出什么？',
        code: 'nums = [1, 2, 3]\nnums.append(4)\nprint(len(nums))',
        options: ['3', '4', '5', '报错：append 只能用于字符串'],
        answer: 1,
        explain: '<code>append()</code> 在列表尾部追加一个元素，长度从 3 变成 4，所以 <code>len(nums)</code> 是 4。'
      }
    },
    {
      label: 'if / for',
      intro: 'Java 用 (条件) { } 划分代码块；Python 用冒号 : 加缩进划分。'
        + '考试写 Python 时最常见的扣分点是缩进混乱（混用 Tab 与空格）和把 else if 写成 Python 里不存在的关键字。',
      rows: [
        ['if (x > 0) {', 'if x > 0:', 'Java 要括号 + 花括号；Python 是冒号 + 缩进。'],
        ['    System.out.println("正数");', '    print("正数")', 'Python 靠 4 个空格缩进表示「属于 if」，不要混用 Tab。'],
        ['} else if (x == 0) {', 'elif x == 0:', 'else if ↔ elif（Python 没有 else if 这种写法）。'],
        ['    System.out.println("零");', '    print("零")', ''],
        ['} else {', 'else:', ''],
        ['    System.out.println("负数");', '    print("负数")', ''],
        ['}', '', 'Java 的 } 在 Python 里没有对应行——缩进退回来就是块结束。'],
        ['for (int i = 0; i < 5; i++) {', 'for i in range(5):', '经典 for 循环 ↔ range(5)，生成 0,1,2,3,4（不含 5）。'],
        ['    System.out.println(i);', '    print(i)', ''],
        ['}', '', '']
      ],
      quiz: {
        stem: '下面这段 Python 输出什么？',
        code: 'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',
        options: ['6', '10', '3', '报错：range 只能写一个参数'],
        answer: 0,
        explain: '<code>range(1, 4)</code> 生成 1, 2, 3（不含 4），累加得 6。Java 对应写法是 <code>for (int i = 1; i &lt; 4; i++)</code>。'
      }
    },
    {
      label: 'f-string / printf',
      intro: '把变量塞进字符串：Java 用 String.format / System.out.printf 的 %s %d %f 占位符；'
        + 'Python 的 f-string 直接把变量写在 {} 里，还能在 {} 内求值、指定格式。',
      rows: [
        ['String name = "Alice";', 'name = "Alice"', ''],
        ['int age = 20;', 'age = 20', ''],
        ['String msg = String.format("%s is %d", name, age);', 'msg = f"{name} is {age}"', 'Java 用 %s / %d 占位；f-string 直接把变量写进 {}。'],
        ['System.out.printf("%s is %d%n", name, age);', 'print(f"{name} is {age}")', 'printf 不自动换行（%n 才是换行）；print() 自动换行。'],
        ['double pi = 3.14159;', 'pi = 3.14159', ''],
        ['System.out.printf("%.2f%n", pi);', 'print(f"{pi:.2f}")', '保留两位小数：%.2f ↔ {pi:.2f}。'],
        ['int a = 78, b = 56;', 'a, b = 78, 56', 'Python 可以一行给多个变量赋值（tuple unpacking）。'],
        ['System.out.println(a + b);', 'print(a + b)', 'f-string 里也能直接算：f"{a + b}"。']
      ],
      quiz: {
        stem: '下面这段 Python 输出什么？',
        code: 'name = "Alice"\nage = 20\nprint(f"{name} is {age}")',
        options: ['{name} is {age}', 'Alice is 20', 'Alice is {age}', '报错：f-string 不能引用变量'],
        answer: 1,
        explain: 'f-string 会把 <code>{name}</code>、<code>{age}</code> 替换成变量的值，输出 <code>Alice is 20</code>。'
          + '忘记写 f 前缀时才会原样输出 {name}。'
      }
    },
    {
      label: '类',
      intro: 'Java 的类要在类体里声明字段、写与类同名的构造器；Python 用 __init__ 初始化，'
        + '字段在 __init__ 里用 self.xxx 动态创建，每个方法第一个参数都必须写 self（相当于 Java 的 this）。',
      rows: [
        ['public class Person {', 'class Person:', '定义类：class + 类名；Python 类名习惯用大驼峰。'],
        ['    private String name;', '    def __init__(self, name, age):', 'Java 先声明字段；Python 在 __init__ 里才创建属性。'],
        ['    private int age;', '        self.name = name', 'self.name 相当于 Java 的 this.name。'],
        ['', '        self.age = age', ''],
        ['    public Person(String name, int age) {', '', 'Java 构造器名 = 类名；Python 是固定的 __init__。'],
        ['        this.name = name;', '', 'this ↔ self。'],
        ['        this.age = age;', '', ''],
        ['    }', '', ''],
        ['    public void greet() {', '    def greet(self):', '普通方法：Python 也要把 self 写在参数表第一位。'],
        ['        System.out.println("Hi, " + name);', '        print("Hi, " + self.name)', 'Java 方法里可直接用字段名；Python 必须写 self.name。'],
        ['    }', '', ''],
        ['}', '', 'Python 没有类的右花括号，缩进退回行首即类结束。']
      ],
      quiz: {
        stem: '下面这段 Python 输出什么？',
        code: 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\np1 = Person("John", 36)\nprint(p1.age)',
        options: ['36', 'John', 'name', '报错：p1.age 不存在'],
        answer: 0,
        explain: '<code>Person("John", 36)</code> 调用 __init__：self.name = "John"、self.age = 36。'
          + '所以 <code>p1.age</code> 是 36；实例属性在 __init__ 里创建，类外面可以直接读。'
      }
    }
  ];

  function initPyJava(root, props, ctx, kit) {
    var state = { topic: 0, row: 1, asked: 0, right: 0, answered: false };

    var introEl = E('div', { class: 'blockP', html: PYJAVA_TOPICS[0].intro });
    root.appendChild(introEl);

    var ctlTopic = ctl(root);
    ctlTopic.appendChild(E('span', { class: 'pill info', text: '主题' }));
    var topicBtns = segButtons(ctlTopic, PYJAVA_TOPICS.map(function (t, i) {
      return { value: i, label: (i + 1) + ' · ' + t.label };
    }), 0, function (v) { buildTopic(Number(v)); });

    var compare = E('div', { class: 'compare' });
    root.appendChild(compare);
    var javaView = codePanel(compare, {
      title: 'Main.java', lang: 'java',
      onLine: function (no) { pickRow(no); }
    });
    var pyView = codePanel(compare, {
      title: 'main.py', lang: 'py',
      onLine: function (no) { pickRow(no); }
    });

    var ctlRow = ctl(root);
    button(ctlRow, '上一行', function () { pickRow(state.row - 1); }, { icon: 'arrow-left' });
    button(ctlRow, '下一行', function () { pickRow(state.row + 1); }, { icon: 'arrow-right' });
    var rowPill = E('span', { class: 'pill info', text: '' });
    ctlRow.appendChild(rowPill);
    button(ctlRow, '重置', function () {
      state.asked = 0;
      state.right = 0;
      buildTopic(0);
    }, { icon: 'reset' });

    var noteBar = note(root);
    var statBar = stats(root);

    sec(root, '测一测 · 猜输出（本地判分）');
    var quizHost = E('div');
    root.appendChild(quizHost);

    /** 高亮同号的 Java / Python 行，并解释这一行的差异 */
    function pickRow(no) {
      var topic = PYJAVA_TOPICS[state.topic];
      var total = topic.rows.length;
      if (!no || no < 1) no = 1;
      if (no > total) no = total;
      state.row = no;
      markCodeLines(javaView.pre, [no]);
      markCodeLines(pyView.pre, [no]);
      var row = topic.rows[no - 1] || [];
      var jText = row[0] == null ? '' : String(row[0]);
      var pText = row[1] == null ? '' : String(row[1]);
      var un = row[2] || '左右两侧这一行做同一件事：注意类型、括号、缩进与方法名的差别。';
      rowPill.textContent = '第 ' + no + ' / ' + total + ' 行';
      var sideNote;
      if (!jText.trim() && pText.trim()) sideNote = 'JAVA 侧没有对应语句（花括号结构）';
      else if (jText.trim() && !pText.trim()) sideNote = 'PYTHON 侧没有对应语句（缩进结构）';
      else sideNote = 'JAVA ' + no + ' ↔ PYTHON ' + no;
      noteBar.set('<b>对照：</b>' + esc(un), sideNote);
      updateStats();
    }

    function updateStats() {
      var topic = PYJAVA_TOPICS[state.topic];
      statBar.set([
        { label: '主题', value: topic.label },
        { label: '对照行', value: topic.rows.length },
        { label: '当前行', value: state.row, hot: true },
        { label: '测验得分', value: state.right + ' / ' + state.asked }
      ]);
    }

    function buildTopic(i) {
      state.topic = i;
      var topic = PYJAVA_TOPICS[i];
      topicBtns.set(i);
      introEl.innerHTML = topic.intro;
      javaView.setLines(topic.rows.map(function (r) { return r[0] || ''; }));
      pyView.setLines(topic.rows.map(function (r) { return r[1] || ''; }));
      pickRow(1);
      buildQuiz();
    }

    /* ---------- 测一测：单选题，本地判分 ---------- */
    function buildQuiz() {
      state.answered = false;
      var topic = PYJAVA_TOPICS[state.topic];
      var q = topic.quiz;
      quizHost.innerHTML = '';
      if (!q) {
        hint(quizHost, '本主题暂时没有测验题。');
        return;
      }
      var body = E('div', { class: 'qzBody' });
      var card = E('div', { class: 'qzCard' }, [
        E('div', { class: 'qzHead' }, [
          E('span', { class: 'qt', text: 'PROBE · 输出预测' }),
          E('span', { class: 'qch', text: 'CH15 / ' + topic.label })
        ]),
        body
      ]);
      body.appendChild(E('div', { class: 'qzStem', html: q.stem }));
      if (q.code) {
        var pre = E('div', { class: 'qzCode' });
        pre.textContent = q.code;
        body.appendChild(pre);
      }
      var optsWrap = E('div', { class: 'qzOpts' });
      var optEls = [];
      q.options.forEach(function (text, idx) {
        var b = E('button', { class: 'qzOpt', type: 'button' }, [
          E('span', { class: 'qn', text: String.fromCharCode(65 + idx) }),
          E('span', { class: 'qo', text: String(text) })
        ]);
        b.addEventListener('click', function () { answer(idx); });
        optsWrap.appendChild(b);
        optEls.push(b);
      });
      body.appendChild(optsWrap);
      var foot = E('div', { class: 'qzActions' });
      var again = E('button', { class: 'qzBtn ghost', type: 'button', text: '重做本题' });
      again.addEventListener('click', function () { buildQuiz(); });
      var streak = E('span', { class: 'qzStreak', text: '得分 ' + state.right + ' / ' + state.asked });
      foot.appendChild(again);
      foot.appendChild(streak);
      body.appendChild(foot);
      var fbHost = E('div');
      body.appendChild(fbHost);
      quizHost.appendChild(card);

      function answer(idx) {
        if (state.answered) return;
        state.answered = true;
        state.asked += 1;
        var ok = idx === q.answer;
        if (ok) state.right += 1;
        optEls.forEach(function (el, i) {
          el.disabled = true;
          if (i === q.answer) el.classList.add('ok');
          else if (i === idx) el.classList.add('bad');
        });
        var fb = E('div', { class: 'qzFb ' + (ok ? 'correct' : 'wrong') }, [
          E('div', {
            class: 'qzFbHead',
            html: (ok ? icon('check') : icon('x')) + (ok ? '正确' : '不对，正确答案是 ' + String.fromCharCode(65 + q.answer))
          }),
          E('div', {
            class: 'qzFbBody',
            html: '<div class="ansLine">' + esc(String.fromCharCode(65 + q.answer)) + ' · ' + esc(String(q.options[q.answer])) + '</div>'
              + (q.explain || '')
          })
        ]);
        fbHost.innerHTML = '';
        fbHost.appendChild(fb);
        streak.textContent = '得分 ' + state.right + ' / ' + state.asked;
        updateStats();
      }
    }

    buildTopic(0);
  }

  LABS.pyjava = {
    title: 'Java ↔ Python 语法对照',
    desc: '同一件事两种写法：变量/类型、字符串、list vs 数组、if/for、f-string vs printf、类——点一行同时高亮两侧，再做几道输出预测题',
    tags: ['ch15'],
    icon: 'code',
    order: 150,
    init: lab(initPyJava)
  };

  /* =====================================================================
   * 2. pyclass · Python 类可视化（ch16）
   * 用简易解析器（不执行 Python）把类定义变成对象卡：
   *   self / __init__ → 实例化后逐个属性填充；私有 __id → 类外访问报错、类内可见；
   *   super().__init__() → 先执行父类部分，再回到子类。
   * ===================================================================== */
  var PYCLASS_DEFAULT = [
    'class Person:',
    '    def __init__(self, fname, lname):',
    '        self.firstname = fname',
    '        self.lastname = lname',
    '        self.__id = 1001',
    '',
    '    def printname(self):',
    '        print("printname:", self.firstname, self.lastname)',
    '',
    '    def show_id(self):',
    '        print("id =", self.__id)',
    '',
    '',
    'class Student(Person):',
    '    def __init__(self, fname, lname, year):',
    '        super().__init__(fname, lname)',
    '        self.graduationyear = year',
    '',
    '    def welcome(self):',
    '        print("Welcome", self.firstname, self.lastname, self.graduationyear)',
    '',
    '    def __str__(self):',
    '        return f"{self.firstname} {self.lastname} ({self.graduationyear})"',
    ''
  ].join('\n');

  /** 去掉 Python 行内注释（跳过字符串里的 #） */
  function pyStripComment(s) {
    var quote = null;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (quote) {
        if (c === '\\') { i++; continue; }
        if (c === quote) quote = null;
        continue;
      }
      if (c === '"' || c === "'") { quote = c; continue; }
      if (c === '#') return s.slice(0, i);
    }
    return s;
  }

  /** 按顶层逗号切分参数（忽略字符串与括号内的逗号） */
  function splitPyArgs(s) {
    var out = [];
    var cur = '';
    var depth = 0;
    var quote = null;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (quote) {
        cur += c;
        if (c === '\\') { cur += (s[i + 1] || ''); i++; continue; }
        if (c === quote) quote = null;
        continue;
      }
      if (c === '"' || c === "'") { quote = c; cur += c; continue; }
      if (c === '(' || c === '[' || c === '{') { depth++; cur += c; continue; }
      if (c === ')' || c === ']' || c === '}') { depth--; cur += c; continue; }
      if (c === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
      cur += c;
    }
    if (cur.trim()) out.push(cur.trim());
    return out.filter(function (x) { return x.length > 0; });
  }

  function pyParseStmt(text, lineNo) {
    var m;
    if ((m = text.match(/^super\(\)\.__init__\((.*)\)$/))) {
      return { kind: 'super', args: splitPyArgs(m[1]), lineNo: lineNo, text: text };
    }
    if ((m = text.match(/^self\.([A-Za-z_]\w*)\s*=\s*(.+)$/))) {
      var name = m[1];
      var isPrivate = name.indexOf('__') === 0 && !/__$/.test(name);
      return { kind: 'assign', attr: name, private: isPrivate, value: m[2].trim(), lineNo: lineNo, text: text };
    }
    if ((m = text.match(/^print\((.*)\)$/))) {
      return { kind: 'print', args: splitPyArgs(m[1]), lineNo: lineNo, text: text };
    }
    if ((m = text.match(/^return\s+(.+)$/))) {
      return { kind: 'return', value: m[1].trim(), lineNo: lineNo, text: text };
    }
    return { kind: 'other', text: text, lineNo: lineNo };
  }

  /**
   * 解析 class 定义：返回 [{name, base, lineNo, methods:[{name, params, indent, lineNo, stmts}]}]。
   * 只支持课程用到的写法（class / def / self.x = / super().__init__ / print / return），
   * 不追求完整 Python 语法。
   */
  function pyParseClasses(src) {
    var lines = String(src || '').split('\n');
    var classes = [];
    var cur = null;
    var method = null;
    for (var i = 0; i < lines.length; i++) {
      var line = pyStripComment(lines[i]).replace(/\s+$/, '');
      if (!line.trim()) continue;
      var indent = (line.match(/^\s*/) || [''])[0].length;
      var t = line.trim();
      var cm = t.match(/^class\s+([A-Za-z_]\w*)\s*(?:\(\s*([A-Za-z_]\w*)\s*\))?\s*:$/);
      if (cm && indent === 0) {
        cur = { name: cm[1], base: cm[2] || null, lineNo: i + 1, methods: [] };
        classes.push(cur);
        method = null;
        continue;
      }
      if (!cur) continue;
      var dm = t.match(/^def\s+([A-Za-z_]\w*)\s*\((.*)\)\s*:$/);
      if (dm) {
        var params = splitPyArgs(dm[2]);
        method = { name: dm[1], params: params, indent: indent, lineNo: i + 1, stmts: [] };
        cur.methods.push(method);
        continue;
      }
      if (method && indent > method.indent) {
        method.stmts.push(pyParseStmt(t, i + 1));
      }
    }
    return classes;
  }

  function pyFindMethod(cls, name) {
    if (!cls || !cls.methods) return null;
    for (var i = 0; i < cls.methods.length; i++) {
      if (cls.methods[i].name === name) return cls.methods[i];
    }
    return null;
  }

  function pyMethodLines(m) {
    var out = ['def ' + m.name + '(' + m.params.join(', ') + '):'];
    if (!m.stmts.length) out.push('    pass');
    m.stmts.forEach(function (s) { out.push('    ' + s.text); });
    return out;
  }

  /** 解析表达式：字符串字面量 / 数字 / 参数名 / self.属性 */
  function pyResolve(expr, env) {
    var e = String(expr == null ? '' : expr).trim();
    if (/^(["']).*\1$/.test(e)) return { value: e.slice(1, -1), isStr: true };
    if (/^-?\d+(\.\d+)?$/.test(e)) return { value: e, isStr: false };
    if (Object.prototype.hasOwnProperty.call(env, e)) return { value: env[e], isStr: true };
    var m = e.match(/^self\.([A-Za-z_]\w*)$/);
    if (m && env.__attrs && Object.prototype.hasOwnProperty.call(env.__attrs, m[1])) {
      return { value: env.__attrs[m[1]], isStr: true };
    }
    return { value: e, isStr: false };
  }

  function pyDisplay(value, isStr) {
    return isStr ? '"' + String(value) + '"' : String(value);
  }

  /** 找 self.xxx 引用（用于「这个访问了哪些属性」） */
  function pySelfAttrs(src) {
    var out = [];
    var re = /self\.([A-Za-z_]\w*)/g;
    var m;
    while ((m = re.exec(String(src || '')))) {
      if (out.indexOf(m[1]) < 0) out.push(m[1]);
    }
    return out;
  }

  function defaultPyArg(name, idx) {
    var n = String(name).toLowerCase();
    if (/year/.test(n)) return '2019';
    if (/age/.test(n)) return '20';
    if (/(fname|first)/.test(n)) return 'Mike';
    if (/(lname|last)/.test(n)) return 'Olsen';
    if (/(grade|score|num|id|count)/.test(n)) return '3';
    if (idx === 1) return 'Olsen';
    if (idx === 0) return 'Mike';
    return '2019';
  }

  function initPyClass(root, props, ctx, kit) {
    var state = {
      model: null,
      objects: [],
      selected: -1,
      highlightAttrs: [],
      internalReveal: false,
      objSeq: 0
    };
    var timers = [];
    function clearTimers() {
      timers.forEach(function (id) { clearTimeout(id); });
      timers = [];
    }
    function later(fn, ms) {
      var id = kit.timeout(function () {
        timers = timers.filter(function (x) { return x !== id; });
        fn();
      }, ms);
      timers.push(id);
      return id;
    }
    kit.onDestroy(clearTimers);

    var intro = E('div', {
      class: 'blockP',
      html: '改一改下面的类定义，点「解析」；再点「实例化」，右侧会一步步长出对象卡。'
        + '点方法按钮看 <code>self</code> 指向谁、私有属性 <code>__id</code> 为什么类外访问不到、'
        + '<code>super().__init__()</code> 为什么先初始化父类部分。'
    });
    root.appendChild(intro);

    /* ---------- ① 类定义编辑 ---------- */
    sec(root, '① 类定义（可编辑，简易解析不执行 Python）');
    var editor = E('textarea', { class: 'qzTextarea', spellcheck: 'false', rows: '16' });
    editor.value = PYCLASS_DEFAULT;
    root.appendChild(editor);
    var ctlEdit = ctl(root);
    button(ctlEdit, '解析并生成控件', function () { parseAndBuild(); }, { icon: 'code' });
    button(ctlEdit, '恢复默认代码', function () {
      editor.value = PYCLASS_DEFAULT;
      parseAndBuild();
    }, { icon: 'reset' });
    button(ctlEdit, '重置', function () {
      editor.value = PYCLASS_DEFAULT;
      parseAndBuild();
    }, { icon: 'reset' });
    button(ctlEdit, '清空对象', function () {
      clearTimers();
      state.objects = [];
      state.selected = -1;
      state.objSeq = 0;
      state.highlightAttrs = [];
      state.internalReveal = false;
      stepsHost.innerHTML = '';
      methodView.setLines(state.model ? pyMethodLines(state.model.init) : [], []);
      renderCards();
      renderAttrTable();
      updateStats();
      noteBar.set('已清空对象卡与执行记录（类定义保留）。');
    });

    /* ---------- ② 实例化 ---------- */
    sec(root, '② 实例化 → 对象卡');
    var ctlArgs = ctl(root);
    var argsPill = E('span', { class: 'pill info', text: '构造参数' });
    ctlArgs.appendChild(argsPill);
    var argsHost = E('span');
    ctlArgs.appendChild(argsHost);
    button(ctlArgs, '实例化', function () { instantiate(); }, { icon: 'play' });
    button(ctlArgs, '模拟类外访问 p1.__id', function () { externalAccess(); }, { icon: 'bug' });

    var grid = E('div', { class: 'gridBlock c2' });
    root.appendChild(grid);
    var leftCol = E('div');
    var rightCol = E('div');
    /* 与 mlnet 同理：右列有代码面板（pre 的 min-content 很大），两列都加 min-width:0。 */
    leftCol.style.minWidth = '0';
    rightCol.style.minWidth = '0';
    /* 顺序：左列=方法/执行记录，右列=对象卡与属性表（实例化后对象卡出现在右侧） */
    grid.appendChild(rightCol);
    grid.appendChild(leftCol);

    leftCol.appendChild(E('div', { class: 'partT', text: '对象卡（堆上的实例）' }));
    var objHost = E('div', { class: 'memHeap' });
    leftCol.appendChild(objHost);
    leftCol.appendChild(E('div', { class: 'partT', text: '属性表（self.xxx）' }));
    var attrHost = E('div');
    leftCol.appendChild(attrHost);

    rightCol.appendChild(E('div', { class: 'partT', text: '方法：点一个，看 self 指向谁' }));
    var ctlMeth = ctl(rightCol);
    var methodView = codePanel(rightCol, { title: '当前方法体', lang: 'py' });
    rightCol.appendChild(E('div', { class: 'partT', text: '执行记录（super() 的顺序）' }));
    var stepsHost = E('div', { class: 'steps' });
    rightCol.appendChild(stepsHost);

    var noteBar = note(root);
    var statBar = stats(root);

    /* ---------- 渲染 ---------- */
    function selectedObj() {
      return state.selected >= 0 ? state.objects[state.selected] : null;
    }

    function renderCards() {
      objHost.innerHTML = '';
      if (!state.objects.length) {
        hint(objHost, '还没有对象。点「实例化」生成对象卡。');
        return;
      }
      state.objects.forEach(function (obj, idx) {
        var card = E('div', { class: 'memObj' });
        var head = E('div', { class: 'memObjH' }, [
          E('span', { class: 'oid', text: '#' + obj.id }),
          E('span', { text: obj.typeName }),
          E('span', { class: 'pill info', text: obj.idName })
        ]);
        if (idx === state.selected) head.appendChild(E('span', { class: 'pill warn', text: '当前' }));
        card.appendChild(head);
        var fields = E('div', { class: 'memFields' });
        if (!obj.attrs.length) {
          fields.appendChild(E('div', { class: 'memEmpty', text: '（空对象 / 初始化进行中…）' }));
        } else {
          var owners = [];
          obj.attrs.forEach(function (a) {
            if (owners.indexOf(a.owner) < 0) owners.push(a.owner);
          });
          owners.forEach(function (ownerName) {
            fields.appendChild(E('div', { class: 'pill', text: ownerName + ' 部分' }));
            obj.attrs.forEach(function (a) {
              if (a.owner !== ownerName) return;
              var revealed = !a.private || state.internalReveal;
              fields.appendChild(E('div', { class: 'memField' }, [
                E('span', { class: 'fn2', text: a.name }),
                E('span', { class: 'fv', text: revealed ? a.display : '●●●●（私有）' })
              ]));
            });
          });
        }
        card.appendChild(fields);
        card.addEventListener('click', function () {
          state.selected = idx;
          renderCards();
          renderAttrTable();
          updateStats();
        });
        objHost.appendChild(card);
      });
    }

    function renderAttrTable() {
      attrHost.innerHTML = '';
      var obj = selectedObj();
      if (!obj) {
        hint(attrHost, '属性表：生成对象后显示。');
        return;
      }
      /* 直接用 .varTable（不再套 .tableWrap：后者会强制 14px 字号 + 大 padding，
         在窄列里把表格撑出容器；.varTable 自带 10.5px mono 与虚线分隔） */
      var tbl = E('table', { class: 'varTable' });
      var tbody = E('tbody');
      obj.attrs.forEach(function (a) {
        var revealed = !a.private || state.internalReveal;
        var tr = E('tr');
        var nameTd = E('td', { class: 'vn' });
        nameTd.appendChild(document.createTextNode(a.name));
        nameTd.appendChild(E('span', { class: 'vt', text: ' · ' + a.owner }));
        tr.appendChild(nameTd);
        var vv = E('td', { class: 'vv nowrap', text: revealed ? a.display : '●●●●' });
        if (state.highlightAttrs.indexOf(a.name) >= 0) vv.classList.add('changed');
        tr.appendChild(vv);
        tbody.appendChild(tr);
      });
      tbl.appendChild(tbody);
      attrHost.appendChild(tbl);
      if (!obj.attrs.length) hint(attrHost, '（初始化进行中…）');
      var priv = obj.attrs.filter(function (a) { return a.private; });
      if (priv.length) {
        hint(attrHost, '私有属性 ' + priv.map(function (a) { return '__' + a.name.replace(/^__/, ''); }).join('、')
          + ' 在类外不可直接访问（Python 会改写为 _' + priv[0].owner + '__' + priv[0].name.replace(/^__/, '')
          + '）；只有类内部的方法能读写它。');
      }
    }

    function appendStep(n, title, desc) {
      var d = E('div', { class: 'step doneStep', 'data-n': String(n) });
      d.appendChild(E('div', { class: 'st', text: title }));
      d.appendChild(E('div', { class: 'sd', html: desc }));
      stepsHost.appendChild(d);
    }

    function updateStats() {
      var obj = selectedObj();
      var priv = 0;
      if (obj) priv = obj.attrs.filter(function (a) { return a.private; }).length;
      statBar.set([
        { label: '父类', value: state.model && state.model.parent ? state.model.parent.name : '（无）' },
        { label: '类', value: state.model ? state.model.target.name : '—' },
        { label: '对象', value: state.objects.length, hot: true },
        { label: '属性', value: obj ? obj.attrs.length : 0 },
        { label: '私有', value: priv }
      ]);
    }

    /* ---------- 构造参数输入 ---------- */
    function buildArgInputs() {
      argsHost.innerHTML = '';
      state.argInputs = {};
      state.paramNames = [];
      if (!state.model) return;
      var params = state.model.init.params.filter(function (p) { return p !== 'self'; });
      state.paramNames = params;
      params.forEach(function (p, i) {
        var lab = E('span', { class: 'mono', text: p + '=' });
        var inp = E('input', { class: 'labNum', type: 'text', value: defaultPyArg(p, i) });
        argsHost.appendChild(lab);
        argsHost.appendChild(inp);
        state.argInputs[p] = inp;
      });
      argsPill.textContent = state.model.target.name + '(...)';
    }

    /* ---------- 方法按钮 ---------- */
    function buildMethodButtons() {
      ctlMeth.innerHTML = '';
      if (!state.model) return;
      var target = state.model.target;
      var parent = state.model.parent;
      target.methods.forEach(function (m) {
        if (m.name === '__init__' || m.name === '__str__') return;
        button(ctlMeth, m.name + '()', function () { callMethod(m.name); });
      });
      if (parent) {
        parent.methods.forEach(function (m) {
          if (m.name === '__init__' || pyFindMethod(target, m.name)) return;
          button(ctlMeth, '（继承）' + m.name + '()', function () { callMethod(m.name); }, { title: 'Student 没有这个方法，沿继承链找到 Person.' + m.name });
        });
      }
      if (pyFindMethod(target, '__str__')) {
        button(ctlMeth, 'print(p1) · __str__', function () { callStr(); });
      }
      if (!ctlMeth.children.length) hint(ctlMeth, '（类里还没有可调用的方法）');
    }

    function findInChain(name) {
      if (!state.model) return null;
      var target = state.model.target;
      var m = pyFindMethod(target, name);
      if (m) return { method: m, owner: target.name, inherited: false };
      var parent = state.model.parent;
      if (parent) {
        var pm = pyFindMethod(parent, name);
        if (pm) return { method: pm, owner: parent.name, inherited: true };
      }
      return null;
    }

    /** 替换 f-string / 参数里的 self.xxx 与字面量，得到「打印出来长什么样」 */
    function formatExpr(expr, obj) {
      var e = String(expr == null ? '' : expr).trim();
      var fm = e.match(/^f(["'])([\s\S]*)\1$/);
      if (fm) {
        return fm[2].replace(/\{([^{}]+)\}/g, function (all, inner) {
          return formatExpr(inner, obj);
        });
      }
      var qm = e.match(/^(["'])([\s\S]*)\1$/);
      if (qm) return qm[2];
      var sm = e.match(/^self\.([A-Za-z_]\w*)$/);
      if (sm && obj) {
        var v = null;
        obj.attrs.forEach(function (a) { if (a.name === sm[1]) v = a.value; });
        return v == null ? e : String(v);
      }
      return e;
    }

    /* ---------- 调方法 ---------- */
    function callMethod(name) {
      var obj = selectedObj();
      if (!obj) {
        noteBar.set('先在 ② 里点「实例化」生成一个对象，再调方法。');
        return;
      }
      var hit = findInChain(name);
      if (!hit) return;
      var m = hit.method;
      var lines = pyMethodLines(m);
      methodView.setLines(lines, lines.map(function (_, i) { return i + 1; }));
      var src = m.stmts.map(function (s) { return s.text; }).join('\n');
      var accessed = pySelfAttrs(src);
      state.highlightAttrs = accessed;
      state.internalReveal = accessed.some(function (a) { return a.indexOf('__') === 0; });
      renderCards();
      renderAttrTable();

      var outs = [];
      m.stmts.forEach(function (st) {
        if (st.kind === 'print') {
          outs.push('print 输出：' + st.args.map(function (a) { return formatExpr(a, obj); }).join(' '));
        } else if (st.kind === 'return') {
          outs.push('return：' + formatExpr(st.value, obj));
        }
      });
      var chain = state.model.target.name + (state.model.parent ? ' → ' + state.model.parent.name : '');
      var main = '<b>self → ' + obj.idName + '</b>（' + obj.typeName + ' 实例）；正在执行 <b>'
        + hit.owner + '.' + m.name + '()</b>'
        + (hit.inherited ? '（' + state.model.target.name + ' 自己没有，沿继承链找到父类）' : '')
        + '；访问属性：<b>' + (accessed.length ? accessed.map(function (a) { return 'self.' + a; }).join('、') : '（无）') + '</b>'
        + (outs.length ? '<br>' + outs.map(function (o) { return esc(o); }).join('<br>') : '');
      noteBar.set(main, '查找顺序 ' + chain);
    }

    function callStr() {
      var obj = selectedObj();
      if (!obj) { noteBar.set('先实例化一个对象，再 print(p1)。'); return; }
      var m = pyFindMethod(state.model.target, '__str__');
      if (!m) return;
      var ret = null;
      m.stmts.forEach(function (st) { if (st.kind === 'return') ret = st; });
      methodView.setLines(pyMethodLines(m), pyMethodLines(m).map(function (_, i) { return i + 1; }));
      var accessed = pySelfAttrs(ret ? ret.text : '');
      state.highlightAttrs = accessed;
      renderAttrTable();
      var text = ret ? formatExpr(ret.value, obj) : '';
      noteBar.set('<b>print(' + obj.idName + ') 会调用 __str__()</b>：返回 <b>"' + esc(text) + '"</b>，所以终端里打印的是这一行文本。', '__str__');
    }

    /* ---------- 实例化（逐步填充） ---------- */
    function instantiate() {
      clearTimers();
      if (!state.model) { noteBar.set('先点「解析并生成控件」。'); return; }
      var values = (state.paramNames || []).map(function (p) {
        var inp = state.argInputs[p];
        var v = inp && inp.value != null ? inp.value.trim() : '';
        return v || defaultPyArg(p, 0);
      });
      var built = buildObjectEvents(values);
      state.objSeq += 1;
      var obj = { id: state.objSeq, idName: 'p' + state.objSeq, typeName: state.model.target.name, attrs: [] };
      state.objects.push(obj);
      state.selected = state.objects.length - 1;
      state.highlightAttrs = [];
      state.internalReveal = false;
      stepsHost.innerHTML = '';
      renderCards();
      renderAttrTable();
      updateStats();
      noteBar.set('正在实例化 <b>' + obj.idName + ' = ' + obj.typeName + '(' + values.join(', ') + ')</b>：先创建空对象，再执行 __init__。', '对象 #' + obj.id);
      built.forEach(function (ev, i) {
        later(function () {
          if (ev.attr) obj.attrs.push(ev.attr);
          appendStep(i + 1, ev.title, ev.desc);
          renderCards();
          renderAttrTable();
          updateStats();
          if (i === built.length - 1) {
            var parentCount = obj.attrs.filter(function (a) { return a.owner !== obj.typeName; }).length;
            noteBar.set('<b>' + obj.idName + '</b> 实例化完成：共 <b>' + obj.attrs.length + '</b> 个属性（父类部分 '
              + parentCount + ' 个，子类部分 ' + (obj.attrs.length - parentCount) + ' 个）。点右侧方法按钮看 self。', '对象 #' + obj.id);
          }
        }, 220 + i * 430);
      });
    }

    /**
     * 生成实例化事件序列：每个事件可携带一个属性（attr），按执行顺序推进。
     * 顺序严格按 Python 语义：创建对象 → 子类 __init__ → super().__init__() → 父类 __init__ → 回到子类。
     */
    function buildObjectEvents(values) {
      var model = state.model;
      var target = model.target;
      var parent = model.parent;
      var env = {};
      var paramNames = model.init.params.filter(function (p) { return p !== 'self'; });
      paramNames.forEach(function (p, i) { env[p] = values[i] != null ? values[i] : ''; });
      var events = [];
      events.push({
        title: 'p' + (state.objSeq + 1) + ' = ' + target.name + '(' + values.join(', ') + ')',
        desc: '先创建一个空对象 p' + (state.objSeq + 1) + '，此时还没有任何属性。Python 随后自动调用 __init__。'
      });
      events.push({
        title: '执行 ' + target.name + '.__init__()',
        desc: '参数：' + paramNames.join(', ') + '；<code>self</code> 指向新对象 p' + (state.objSeq + 1) + '。'
      });
      function doAssign(st, e, ownerName, intoEvents) {
        var rv = pyResolve(st.value, e);
        var attr = {
          name: st.attr,
          value: rv.value,
          isStr: rv.isStr,
          display: pyDisplay(rv.value, rv.isStr),
          owner: ownerName,
          private: st.private,
          line: st.lineNo
        };
        e.__attrs = e.__attrs || {};
        e.__attrs[st.attr] = rv.value;
        intoEvents.push({
          attr: attr,
          title: 'self.' + st.attr + ' = ' + st.value,
          desc: '在 ' + ownerName + '.__init__ 里创建属性 <code>self.' + st.attr + '</code> → ' + esc(attr.display)
            + (st.private ? '（私有：类外不能直接访问）' : '')
        });
      }
      var superDone = false;
      model.init.stmts.forEach(function (st) {
        if (st.kind === 'super') {
          var argsText = st.args.join(', ');
          events.push({
            title: 'super().__init__(' + argsText + ')',
            desc: '子类先调用父类的构造器：<b>父类部分先初始化</b>，再回到子类。'
          });
          var pInit = parent ? pyFindMethod(parent, '__init__') : null;
          if (pInit) {
            var pParams = pInit.params.filter(function (p) { return p !== 'self'; });
            var pEnv = {};
            st.args.forEach(function (arg, i) {
              var rv = pyResolve(arg, env);
              if (pParams[i]) pEnv[pParams[i]] = rv.value;
            });
            pInit.stmts.forEach(function (pst) {
              if (pst.kind === 'assign') doAssign(pst, pEnv, parent.name, events);
            });
          } else {
            events.push({ title: '（没有找到父类 __init__）', desc: '父类缺失或没有 __init__，这一步什么也不做。' });
          }
          superDone = true;
          events.push({
            title: '回到 ' + target.name + '.__init__()',
            desc: '父类部分已完成，继续执行子类自己的赋值。'
          });
        } else if (st.kind === 'assign') {
          doAssign(st, env, target.name, events);
        } else if (st.kind === 'print') {
          events.push({ title: st.text, desc: 'print() 只输出、不改变对象属性。' });
        } else {
          events.push({ title: st.text, desc: '其他语句（示意，未执行）。' });
        }
      });
      if (!superDone && parent) {
        events.push({ title: '提示', desc: '子类没有调用 <code>super().__init__()</code>：父类属性不会被初始化。' });
      }
      return events;
    }

    /* ---------- 类外访问私有属性 ---------- */
    function externalAccess() {
      var obj = selectedObj();
      if (!obj) { noteBar.set('先生成对象，再演示类外访问。'); return; }
      var priv = obj.attrs.filter(function (a) { return a.private; });
      if (!priv.length) {
        noteBar.set('当前类没有私有属性（形如 <code>self.__id</code>）。');
        return;
      }
      var a = priv[0];
      state.internalReveal = false;
      state.highlightAttrs = [];
      renderCards();
      renderAttrTable();
      noteBar.set('<b>' + obj.idName + '.__' + a.name.replace(/^__/, '') + ' → AttributeError</b>：'
        + 'Python 把 <code>' + a.owner + '.__' + a.name.replace(/^__/, '') + '</code> 名称改写成 <code>_' + a.owner + '__'
        + a.name.replace(/^__/, '') + '</code>，所以类外直接写 <code>' + obj.idName + '.__' + a.name.replace(/^__/, '')
        + '</code> 找不到。只有类内部的方法（如 show_id）能读到它。', '类外访问');
    }

    /* ---------- 解析入口 ---------- */
    function parseAndBuild() {
      clearTimers();
      var classes = pyParseClasses(editor.value);
      if (!classes.length) {
        state.model = null;
        buildMethodButtons();
        buildArgInputs();
        renderCards();
        renderAttrTable();
        updateStats();
        noteBar.set('<b>解析失败：</b>没有找到 <code>class 类名:</code> 定义。检查缩进与冒号。');
        return;
      }
      var target = classes[classes.length - 1];
      var parent = null;
      if (target.base) {
        for (var i = 0; i < classes.length; i++) {
          if (classes[i].name === target.base) { parent = classes[i]; break; }
        }
      }
      var initM = pyFindMethod(target, '__init__');
      if (!initM) {
        state.model = null;
        buildMethodButtons();
        buildArgInputs();
        noteBar.set('<b>解析失败：</b>' + target.name + ' 没有 <code>__init__</code> 方法，无法演示实例化。');
        updateStats();
        return;
      }
      state.model = {
        classes: classes,
        target: target,
        parent: parent,
        init: initM
      };
      state.objects = [];
      state.selected = -1;
      state.objSeq = 0;
      state.highlightAttrs = [];
      state.internalReveal = false;
      stepsHost.innerHTML = '';
      methodView.setLines(pyMethodLines(initM), []);
      buildArgInputs();
      buildMethodButtons();
      renderCards();
      renderAttrTable();
      updateStats();
      noteBar.set('解析成功：父类 <b>' + (parent ? parent.name : '（无）') + '</b>，子类 <b>' + target.name + '</b>，'
        + '方法 ' + target.methods.length + ' 个。点「实例化」生成对象卡。', 'PY CLASS');
    }

    /* ---------- 启动 ---------- */
    parseAndBuild();
  }

  LABS.pyclass = {
    title: 'Python 类：self / 私有 / super()',
    desc: '可编辑的类定义（简易解析，不执行 Python）：实例化后逐属性生成对象卡，点方法看 self 指向谁、__私有属性为何被隐藏、super().__init__() 如何先初始化父类',
    tags: ['ch16'],
    icon: 'box',
    order: 151,
    init: lab(initPyClass)
  };

  /* =====================================================================
   * 3. tkinter · 三种几何管理对照（ch17）
   * 同一组控件（3 Label + 2 Button + 1 Entry）在 pack / grid / place 下
   * 的不同排列，用 DOM 模拟；参数可调、代码同步生成。
   * ===================================================================== */
  var TK_WIDGETS = [
    { id: 'title', kind: 'label', text: 'Snake Game' },
    { id: 'score', kind: 'label', text: 'Score: 0' },
    { id: 'hint', kind: 'label', text: 'Press arrow keys' },
    { id: 'start', kind: 'button', text: 'Start' },
    { id: 'quit', kind: 'button', text: 'Quit' },
    { id: 'name', kind: 'entry', text: 'type your name…' }
  ];
  var TK_GRID_POS = { title: [0, 0], score: [0, 1], hint: [0, 2], start: [1, 0], quit: [1, 1], name: [1, 2] };
  var TK_PLACE_POS = { title: [20, 20], score: [20, 60], hint: [20, 100], start: [250, 20], quit: [250, 60], name: [20, 160] };
  var TK_SIDES = [
    { value: 'top', label: 'top · 从上到下' },
    { value: 'bottom', label: 'bottom · 从下到上' },
    { value: 'left', label: 'left · 从左到右' },
    { value: 'right', label: 'right · 从右到左' }
  ];

  function initTkinter(root, props, ctx, kit) {
    var state = {
      mode: 'pack',
      side: 'top',
      pady: 4,
      sel: 0,
      grid: {},
      place: {},
      focusNext: false
    };
    TK_WIDGETS.forEach(function (w) {
      state.grid[w.id] = TK_GRID_POS[w.id].slice();
      state.place[w.id] = TK_PLACE_POS[w.id].slice();
    });

    var intro = E('div', {
      class: 'blockP',
      html: 'Tkinter 里「创建控件」不等于「显示控件」——必须调用几何管理器。'
        + 'pack 按边堆叠、grid 放进二维表格、place 用绝对坐标。切换三种方式并拖参数，观察同一组控件的排列如何变化。'
    });
    root.appendChild(intro);

    var ctlMode = ctl(root);
    ctlMode.appendChild(E('span', { class: 'pill info', text: 'geometry' }));
    var modeBtns = segButtons(ctlMode, [
      { value: 'pack', label: 'pack()' },
      { value: 'grid', label: 'grid()' },
      { value: 'place', label: 'place()' }
    ], 'pack', function (v) { setMode(v); });

    /* pack 参数 */
    var rowPack = ctl(root);
    rowPack.appendChild(E('span', { class: 'pill info', text: 'pack 参数' }));
    rowPack.appendChild(E('span', { class: 'mono', text: 'side' }));
    var sideSel = selectBox(rowPack, TK_SIDES, 'top', function (v) {
      state.side = v;
      renderAll();
    });
    var padySlider = slider(rowPack, {
      label: 'pady',
      min: 0,
      max: 20,
      step: 1,
      value: 4,
      fmt: function (v) { return v + 'px'; },
      onInput: function (v) { state.pady = v; renderAll(); }
    });

    /* grid / place 参数 */
    var rowGrid = ctl(root);
    rowGrid.classList.add('hidden');
    rowGrid.appendChild(E('span', { class: 'pill info', text: 'grid 参数' }));
    var gridSel = selectBox(rowGrid, TK_WIDGETS.map(function (w, i) {
      return { value: i, label: '控件 ' + (i + 1) + ' · ' + w.text };
    }), 0, function (v) {
      state.sel = Number(v);
      state.focusNext = true;
      syncGridSliders();
      renderAll();
    });
    var rowSlider = slider(rowGrid, {
      label: 'row',
      min: 0,
      max: 3,
      step: 1,
      value: 0,
      onInput: function (v) { state.grid[TK_WIDGETS[state.sel].id][0] = v; renderAll(); }
    });
    var colSlider = slider(rowGrid, {
      label: 'column',
      min: 0,
      max: 3,
      step: 1,
      value: 0,
      onInput: function (v) { state.grid[TK_WIDGETS[state.sel].id][1] = v; renderAll(); }
    });

    var rowPlace = ctl(root);
    rowPlace.classList.add('hidden');
    rowPlace.appendChild(E('span', { class: 'pill info', text: 'place 参数' }));
    var placeSel = selectBox(rowPlace, TK_WIDGETS.map(function (w, i) {
      return { value: i, label: '控件 ' + (i + 1) + ' · ' + w.text };
    }), 0, function (v) {
      state.sel = Number(v);
      state.focusNext = true;
      syncPlaceSliders();
      renderAll();
    });
    var xSlider = slider(rowPlace, {
      label: 'x',
      min: 0,
      max: 360,
      step: 5,
      value: 20,
      fmt: function (v) { return v + 'px'; },
      onInput: function (v) { state.place[TK_WIDGETS[state.sel].id][0] = v; renderAll(); }
    });
    var ySlider = slider(rowPlace, {
      label: 'y',
      min: 0,
      max: 200,
      step: 5,
      value: 20,
      fmt: function (v) { return v + 'px'; },
      onInput: function (v) { state.place[TK_WIDGETS[state.sel].id][1] = v; renderAll(); }
    });

    var ctlReset = ctl(root);
    button(ctlReset, '重置参数', function () { reset(); }, { icon: 'reset' });

    /* ---------- 模拟窗口 ---------- */
    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    /* sdCanvas 负责深色窗口底与边框，codeBox 复用其 overflow:hidden（模拟 Tk 窗口裁剪超出的控件） */
    var winHost = E('div', { class: 'sdCanvas codeBox' });
    winHost.style.width = '100%';
    winHost.style.maxWidth = '420px';
    winHost.style.height = '272px';
    stage.appendChild(winHost);
    var sim = E('div');
    sim.style.width = '100%';
    sim.style.height = '100%';
    winHost.appendChild(sim);

    var codeView = codePanel(root, { title: '对应 Tkinter 代码（随参数实时更新）', lang: 'py' });

    sec(root, '参数说明');
    var helpHost = E('div');
    root.appendChild(helpHost);

    var noteBar = note(root);
    var statBar = stats(root);

    /* ---------- 渲染 ---------- */
    function setMode(mode) {
      state.mode = mode;
      state.focusNext = false;
      modeBtns.set(mode);
      rowPack.classList.toggle('hidden', mode !== 'pack');
      rowGrid.classList.toggle('hidden', mode !== 'grid');
      rowPlace.classList.toggle('hidden', mode !== 'place');
      if (mode === 'grid' || mode === 'place') {
        state.sel = 0;
        gridSel.set(0);
        placeSel.set(0);
        syncGridSliders();
        syncPlaceSliders();
      }
      renderAll();
    }

    function syncGridSliders() {
      var p = state.grid[TK_WIDGETS[state.sel].id];
      rowSlider.set(p[0]);
      colSlider.set(p[1]);
    }
    function syncPlaceSliders() {
      var p = state.place[TK_WIDGETS[state.sel].id];
      xSlider.set(p[0]);
      ySlider.set(p[1]);
    }

    function makeWidget(w, idx) {
      var el;
      if (w.kind === 'label') {
        el = E('span', { class: 'pill nowrap ' + (idx === state.sel && state.mode !== 'pack' ? 'warn' : 'info'), text: w.text });
      } else if (w.kind === 'button') {
        el = E('button', { class: 'labBtn' + (idx === state.sel && state.mode !== 'pack' ? ' on' : ''), type: 'button' }, [
          E('span', { text: w.text })
        ]);
        el.addEventListener('click', function () {
          noteBar.set('<b>Button "' + esc(w.text) + '"</b> 被点击：真实 Tkinter 里会调用 <code>command=函数</code> 注册的回调。', 'EVENT');
        });
      } else {
        el = E('input', { class: 'labNum', type: 'text', size: '12', placeholder: w.text });
        el.addEventListener('input', function () {
          noteBar.set('Entry.get() → <b>' + esc(el.value) + '</b>（Entry 的输入内容可以用 get() 读出）', 'ENTRY');
        });
      }
      el.setAttribute('data-tk', w.id);
      return el;
    }

    function renderWindow() {
      sim.innerHTML = '';
      sim.className = '';
      sim.removeAttribute('style');
      sim.style.width = '100%';
      sim.style.height = '100%';
      if (state.mode === 'pack') {
        var dir = state.side === 'top' ? 'column'
          : state.side === 'bottom' ? 'column-reverse'
            : state.side === 'left' ? 'row' : 'row-reverse';
        sim.style.display = 'flex';
        sim.style.flexDirection = dir;
        sim.style.alignItems = 'center';
        sim.style.justifyContent = 'center';
        sim.style.gap = state.pady + 'px';
        sim.style.padding = state.pady + 'px';
        TK_WIDGETS.forEach(function (w, i) { sim.appendChild(makeWidget(w, i)); });
      } else if (state.mode === 'grid') {
        sim.style.display = 'grid';
        sim.style.gridTemplateColumns = 'repeat(4, 1fr)';
        sim.style.gridTemplateRows = 'repeat(3, 1fr)';
        sim.style.alignItems = 'center';
        sim.style.justifyItems = 'center';
        TK_WIDGETS.forEach(function (w, i) {
          var el = makeWidget(w, i);
          var p = state.grid[w.id];
          el.style.gridRow = String(p[0] + 1);
          el.style.gridColumn = String(p[1] + 1);
          sim.appendChild(el);
        });
      } else {
        sim.style.position = 'relative';
        TK_WIDGETS.forEach(function (w, i) {
          var el = makeWidget(w, i);
          var p = state.place[w.id];
          el.style.position = 'absolute';
          el.style.left = p[0] + 'px';
          el.style.top = p[1] + 'px';
          sim.appendChild(el);
        });
      }
      if (state.focusNext) {
        var sel = sim.querySelector('[data-tk="' + TK_WIDGETS[state.sel].id + '"]');
        if (sel && sel.tagName === 'INPUT' && sel.focus) sel.focus();
        state.focusNext = false;
      }
    }

    function genCode() {
      var lines = ['from tkinter import *', 'root = Tk()', "root.geometry('420x250')", ''];
      TK_WIDGETS.forEach(function (w) {
        var ctor = w.kind === 'label' ? 'Label' : w.kind === 'button' ? 'Button' : 'Entry';
        var create = ctor + '(root' + (w.kind === 'entry' ? '' : ", text='" + w.text + "'") + ')';
        var call;
        if (state.mode === 'pack') {
          call = 'pack(side=\'' + state.side + '\', pady=' + state.pady + ')';
        } else if (state.mode === 'grid') {
          var p = state.grid[w.id];
          call = 'grid(row=' + p[0] + ', column=' + p[1] + ', padx=6, pady=6)';
        } else {
          var q = state.place[w.id];
          call = 'place(x=' + q[0] + ', y=' + q[1] + ')';
        }
        lines.push(create + '.' + call);
      });
      lines.push('');
      lines.push('root.mainloop()');
      return lines;
    }

    function renderHelp() {
      helpHost.innerHTML = '';
      if (state.mode === 'pack') {
        table(helpHost, ['参数', '取值', '作用'], [
          ['side', "'top' / 'bottom' / 'left' / 'right'", '控件贴着哪条边堆叠：top/bottom 竖排，left/right 横排'],
          ['pady', '数字（像素）', '控件上下留白；本模拟用它作为控件间距'],
          ['fill', "'x' / 'y' / 'both'", '是否在某个方向填满父容器（默认不填，所以控件保持自身大小）']
        ]);
      } else if (state.mode === 'grid') {
        table(helpHost, ['参数', '取值', '作用'], [
          ['row', '0, 1, 2, …', '放在第几行（从 0 开始计数）'],
          ['column', '0, 1, 2, …', '放在第几列（从 0 开始计数）'],
          ['padx / pady', '像素', '格子内的水平 / 垂直留白'],
          ['sticky', "'n' / 's' / 'e' / 'w'", '在格子里贴边（默认居中）']
        ]);
      } else {
        table(helpHost, ['参数', '取值', '作用'], [
          ['x', '像素', '控件左上角的横坐标（绝对定位）'],
          ['y', '像素', '控件左上角的纵坐标'],
          ['relx / rely', '0 – 1', '相对父容器的比例位置（本模拟未启用）'],
          ['anchor', "'nw' / 'center' 等", '以哪个点为定位基准（默认左上角 nw）']
        ]);
      }
    }

    function renderNote() {
      if (state.mode === 'pack') {
        noteBar.set('<b>pack()</b>：6 个控件沿 <b>' + esc(state.side) + '</b> 方向依次排列，pady=' + state.pady
          + ' 控制上下留白。pack 不指定行列，简单但难以精确控制位置。', 'PACK');
        statBar.set([
          { label: '模式', value: 'pack' },
          { label: 'side', value: state.side, hot: true },
          { label: 'pady', value: state.pady },
          { label: '控件', value: TK_WIDGETS.length }
        ]);
      } else if (state.mode === 'grid') {
        var w = TK_WIDGETS[state.sel];
        var p = state.grid[w.id];
        noteBar.set('<b>grid(row=' + p[0] + ', column=' + p[1] + ')</b>：控件 ' + (state.sel + 1) + '（' + esc(w.text)
          + '）放进第 ' + p[0] + ' 行第 ' + p[1] + ' 列。grid 像二维表格，适合表单；同一格被两个控件占用时会重叠。', 'GRID');
        statBar.set([
          { label: '模式', value: 'grid' },
          { label: '选中', value: w.text, hot: true },
          { label: 'row', value: p[0] },
          { label: 'column', value: p[1] }
        ]);
      } else {
        var w2 = TK_WIDGETS[state.sel];
        var q = state.place[w2.id];
        noteBar.set('<b>place(x=' + q[0] + ', y=' + q[1] + ')</b>：控件 ' + (state.sel + 1) + '（' + esc(w2.text)
          + '）的左上角被固定在窗口内的 (' + q[0] + ', ' + q[1] + ')。place 精确但不会随窗口大小自适应。', 'PLACE');
        statBar.set([
          { label: '模式', value: 'place' },
          { label: '选中', value: w2.text, hot: true },
          { label: 'x', value: q[0] },
          { label: 'y', value: q[1] }
        ]);
      }
    }

    function renderCode() {
      var lines = genCode();
      var focus = [];
      if (state.mode !== 'pack') focus = [5 + state.sel];
      codeView.setLines(lines, focus);
    }

    function renderAll() {
      renderWindow();
      renderCode();
      renderHelp();
      renderNote();
    }

    function reset() {
      state.mode = 'pack';
      state.side = 'top';
      state.pady = 4;
      state.sel = 0;
      TK_WIDGETS.forEach(function (w) {
        state.grid[w.id] = TK_GRID_POS[w.id].slice();
        state.place[w.id] = TK_PLACE_POS[w.id].slice();
      });
      modeBtns.set('pack');
      rowPack.classList.remove('hidden');
      rowGrid.classList.add('hidden');
      rowPlace.classList.add('hidden');
      sideSel.set('top');
      padySlider.set(4);
      gridSel.set(0);
      placeSel.set(0);
      syncGridSliders();
      syncPlaceSliders();
      renderAll();
    }

    setMode('pack');
  }

  LABS.tkinter = {
    title: 'Tkinter 三种几何管理',
    desc: '同一组控件（3 Label + 2 Button + 1 Entry）切换 pack / grid / place：调 side/pady、row/column、x/y 实时看排列，代码同步更新',
    tags: ['ch17'],
    icon: 'grid',
    order: 152,
    init: lab(initTkinter)
  };

  /* =====================================================================
   * 4. snake · 贪吃蛇（ch18）
   * <canvas> 可玩版：方向键 / 屏幕按钮控制；两种食物（+1 / +2）；
   * 撞墙、撞自己、达到最大长度 8 结束；含「慢动作演示」自动跑预设路径，
   * 演示 run_game → move_snake → update_ui → after 的循环链。
   * ===================================================================== */
  var SNAKE_CELL = 20;
  var SNAKE_COLS = 20;
  var SNAKE_ROWS = 20;
  var SNAKE_MAX_LEN = 8;

  /** '#rrggbb' + alpha → rgba()，用于画布半透明遮罩（色值仍来自 CSS 变量） */
  function withAlpha(color, alpha) {
    var c = String(color || '').trim();
    var m = c.match(/^#([0-9a-fA-F]{6})$/);
    if (m) {
      var n = parseInt(m[1], 16);
      return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + alpha + ')';
    }
    return c;
  }

  var SNAKE_CODE = [
    'class SnakeGame(tk.Tk):',
    '    def start_game(self):',
    '        self.setup_ui()',
    '        self.run_game()',
    '',
    '    def setup_ui(self):',
    '        self.update_ui()',
    '        self.bind("<KeyPress>", self.change_direction)',
    '',
    '    def run_game(self):                 # 入口：每 100ms 调度一次',
    '        self.move_snake()',
    '        self.after(100, self.run_game)',
    '',
    '    def move_snake(self):               # 算新头 + 吃食物 / 撞墙 / 撞自己',
    '        head_x, head_y = self.snake[0]',
    '        if self.snake_direction == "Right":',
    '            head_x += self.cell_size',
    '        new_head = (head_x, head_y)',
    '        self.snake = [new_head] + self.snake[:-1]',
    '        self.update_ui()',
    '',
    '    def update_ui(self):                # 先 delete 再重画',
    '        self.canvas.delete("all")',
    '        for x, y in self.snake:',
    '            self.canvas.create_rectangle(x, y, x + self.cell_size,',
    '                                         y + self.cell_size, fill="green")'
  ];
  var SNAKE_FOCUS = {
    run: [10, 11, 12],
    move: [14, 15, 16, 17, 18, 19, 20],
    ui: [22, 23, 24, 25, 26],
    after: [12],
    setup: [6, 7, 8]
  };
  /* 慢动作演示脚本：三步向右吃到 +1 食物，向下吃到 +2 食物，再绕回吃 +1，最后停下 */
  var SNAKE_DEMO = [
    { dir: 'Right' }, { dir: 'Right' }, { dir: 'Right' },
    { dir: 'Down' }, { dir: 'Down' }, { dir: 'Down' },
    { dir: 'Down' }, { dir: 'Left' }, { dir: 'Left' }, { dir: 'Left' },
    { dir: 'Up' }, { dir: 'Up' }
  ];

  function initSnake(root, props, ctx, kit) {
    var state = {
      snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }],
      dir: 'Right',
      pendingDir: null,
      food: null,
      score: 0,
      status: 'ready',      /* ready | playing | paused | over | win */
      reason: '',
      speed: 140,
      demo: null,
      demoFoods: []
    };
    var timeouts = [];
    var palette = null;
    var canvas = null;
    var ctx2d = null;

    function later(fn, ms) {
      var id = kit.timeout(function () {
        timeouts = timeouts.filter(function (x) { return x !== id; });
        fn();
      }, ms);
      timeouts.push(id);
      return id;
    }
    function stopTimers() {
      timeouts.forEach(function (id) { clearTimeout(id); });
      timeouts = [];
    }
    kit.onDestroy(stopTimers);

    /* ---------- 标题与控件 ---------- */
    var intro = E('div', {
      class: 'blockP',
      html: '玩法与课程要求一致：方向键控制，吃食物变长（<b>黄色 +1 节</b> / <b>红色 +2 节</b>），'
        + '撞墙、撞到自己或长到 <b>8 节</b>就结束。点「慢动作演示」会自动跑一条预设路线，'
        + '同时高亮 <code>run_game → move_snake → update_ui → after</code> 的循环链。'
    });
    root.appendChild(intro);

    var ctlMain = ctl(root);
    var btnStart = button(ctlMain, '开始', function () { togglePlay(); }, { icon: 'play' });
    button(ctlMain, '重新开始', function () { resetGame(); }, { icon: 'reset' });
    button(ctlMain, '慢动作演示', function () { runDemo(); }, { icon: 'step' });
    var speedSlider = slider(ctlMain, {
      label: '速度',
      min: 80,
      max: 260,
      step: 20,
      value: 140,
      fmt: function (v) { return v + 'ms'; },
      onInput: function (v) { state.speed = v; updateStats(); }
    });

    var ctlDir = ctl(root);
    ctlDir.appendChild(E('span', { class: 'pill info', text: '方向' }));
    button(ctlDir, '↑', function () { setDir('Up'); });
    button(ctlDir, '←', function () { setDir('Left'); });
    button(ctlDir, '↓', function () { setDir('Down'); });
    button(ctlDir, '→', function () { setDir('Right'); });
    ctlDir.appendChild(E('span', { class: 'mono', text: 'p1 = (x, y) 格点；本模拟 20×20 格' }));

    /* ---------- 画布 ---------- */
    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    canvas = E('canvas', { class: 'sdCanvas', width: '400', height: '400', tabindex: '0' });
    canvas.setAttribute('aria-label', '贪吃蛇游戏画布');
    canvas.style.width = '100%';
    canvas.style.maxWidth = '400px';
    canvas.style.height = 'auto';
    stage.appendChild(canvas);
    try { ctx2d = canvas.getContext('2d'); } catch (e) { ctx2d = null; }
    if (!ctx2d) {
      hint(stage, '当前浏览器不支持 Canvas 2D，无法运行贪吃蛇。');
    }

    /* ---------- 循环链 ---------- */
    var chainWrap = E('div', { class: 'labCtl' });
    chainWrap.appendChild(E('span', { class: 'pill info', text: '调用链' }));
    var chainEls = [];
    ['run_game()', 'move_snake()', 'update_ui()', 'after(100, run_game)'].forEach(function (name, i) {
      if (i) chainWrap.appendChild(E('span', { class: 'mono', text: '→' }));
      var pill = E('span', { class: 'pill', text: name });
      chainWrap.appendChild(pill);
      chainEls.push(pill);
    });
    root.appendChild(chainWrap);
    function chainMark(index) {
      chainEls.forEach(function (el, i) {
        el.className = 'pill' + (index >= 0 && i < index ? ' ok' : (i === index ? ' info' : ''));
      });
    }

    var codeView = codePanel(root, { title: '课程版 SnakeGame（Tkinter Canvas）', lang: 'py' });
    codeView.setLines(SNAKE_CODE, SNAKE_FOCUS.move);

    var noteBar = note(root);
    var statBar = stats(root);

    /* ---------- 绘制 ---------- */
    function readPalette() {
      return {
        bg: cssVar('--codeBg') || 'transparent',
        grid: cssVar('--line') || 'transparent',
        head: cssVar('--const-orange') || 'transparent',
        body: cssVar('--ok') || 'transparent',
        food1: cssVar('--const-yellow') || 'transparent',
        food2: cssVar('--const-red') || 'transparent',
        text: cssVar('--text-white') || 'transparent',
        dim: cssVar('--text-dim') || 'transparent'
      };
    }

    function overlay(title, sub) {
      var p = palette;
      ctx2d.fillStyle = withAlpha(p.bg, 0.82);
      ctx2d.fillRect(0, 0, 400, 400);
      ctx2d.textAlign = 'center';
      ctx2d.textBaseline = 'middle';
      ctx2d.fillStyle = p.text;
      ctx2d.font = '600 20px "Roboto Mono", monospace';
      ctx2d.fillText(title, 200, 186);
      ctx2d.fillStyle = p.dim;
      ctx2d.font = '11px "Roboto Mono", monospace';
      var parts = String(sub || '').split('\n');
      parts.forEach(function (line, i) {
        ctx2d.fillText(line, 200, 218 + i * 18);
      });
    }

    function draw() {
      if (!ctx2d) return;
      if (!palette) palette = readPalette();
      var p = palette;
      ctx2d.fillStyle = p.bg;
      ctx2d.fillRect(0, 0, 400, 400);
      /* 网格 */
      ctx2d.strokeStyle = p.grid;
      ctx2d.lineWidth = 1;
      for (var gx = 1; gx < SNAKE_COLS; gx++) {
        ctx2d.beginPath();
        ctx2d.moveTo(gx * SNAKE_CELL + 0.5, 0);
        ctx2d.lineTo(gx * SNAKE_CELL + 0.5, 400);
        ctx2d.stroke();
      }
      for (var gy = 1; gy < SNAKE_ROWS; gy++) {
        ctx2d.beginPath();
        ctx2d.moveTo(0, gy * SNAKE_CELL + 0.5);
        ctx2d.lineTo(400, gy * SNAKE_CELL + 0.5);
        ctx2d.stroke();
      }
      /* 食物 */
      if (state.food) {
        var f = state.food;
        var size = f.type === 2 ? SNAKE_CELL - 3 : SNAKE_CELL - 7;
        var off = (SNAKE_CELL - size) / 2;
        ctx2d.fillStyle = f.type === 2 ? p.food2 : p.food1;
        ctx2d.fillRect(f.x * SNAKE_CELL + off, f.y * SNAKE_CELL + off, size, size);
        ctx2d.fillStyle = p.bg;
        ctx2d.textAlign = 'center';
        ctx2d.textBaseline = 'middle';
        ctx2d.font = 'bold 10px "Roboto Mono", monospace';
        ctx2d.fillText('+' + f.type, f.x * SNAKE_CELL + SNAKE_CELL / 2, f.y * SNAKE_CELL + SNAKE_CELL / 2 + 0.5);
      }
      /* 蛇身（先画身体再画头，头压在最上面） */
      state.snake.forEach(function (seg, i) {
        ctx2d.fillStyle = i === 0 ? p.head : p.body;
        ctx2d.fillRect(seg.x * SNAKE_CELL + 1, seg.y * SNAKE_CELL + 1, SNAKE_CELL - 2, SNAKE_CELL - 2);
      });
      if (state.snake.length) {
        var head = state.snake[0];
        ctx2d.fillStyle = p.bg;
        ctx2d.fillRect(head.x * SNAKE_CELL + 5, head.y * SNAKE_CELL + 6, 3, 3);
        ctx2d.fillRect(head.x * SNAKE_CELL + 12, head.y * SNAKE_CELL + 6, 3, 3);
      }
      /* 状态遮罩：半透明，结束时仍能看到蛇最后停在哪里；演示时只标 DEMO */
      if (state.demo) {
        ctx2d.fillStyle = p.dim;
        ctx2d.textAlign = 'left';
        ctx2d.textBaseline = 'top';
        ctx2d.font = '10px "Roboto Mono", monospace';
        ctx2d.fillText('DEMO · 第 ' + (state.demo.idx || 0) + ' / ' + SNAKE_DEMO.length + ' 拍', 8, 8);
      } else if (state.status === 'ready') {
        overlay('READY?', '按方向键 / 点「开始」\n黄 +1 · 红 +2 · 长到 8 节结束');
      } else if (state.status === 'paused') {
        overlay('PAUSED', '点「开始/继续」或按方向键恢复');
      } else if (state.status === 'over') {
        overlay('GAME OVER', state.reason + '\n得分 ' + state.score + ' · 点「重新开始」');
      } else if (state.status === 'win') {
        overlay('GAME OVER · 8/8', state.reason + '\n得分 ' + state.score + ' · 点「重新开始」');
      }
    }

    /* ---------- 状态读数 ---------- */
    function statusText() {
      if (state.demo) return { text: '演示中', hot: true };
      if (state.status === 'playing') return { text: '进行中', hot: true };
      if (state.status === 'paused') return { text: '暂停' };
      if (state.status === 'over') return { text: '撞车结束', hot: true };
      if (state.status === 'win') return { text: '达成 8 节', hot: true };
      return { text: '未开始' };
    }

    function updateStats() {
      var st = statusText();
      statBar.set([
        { label: '得分', value: state.score, hot: true },
        { label: '长度', value: state.snake.length + ' / ' + SNAKE_MAX_LEN },
        { label: '状态', value: st.text, hot: st.hot },
        { label: '节拍', value: state.speed + 'ms' }
      ]);
    }

    function updateNote() {
      if (state.demo) return;
      if (state.status === 'ready') {
        noteBar.set('按方向键或点「开始」。结束条件：<b>撞墙</b>、<b>撞到自己</b>、<b>长度达到 8 节</b>。', 'SNAKE');
      } else if (state.status === 'playing') {
        noteBar.set('正在移动：<b>' + state.dir + '</b>。下一步按方向键改变方向（不能直接掉头）；吃黄色食物 +1 节 / +10 分，红色食物 +2 节 / +25 分。', 'RUNNING');
      } else if (state.status === 'paused') {
        noteBar.set('已暂停。点「开始/继续」或按方向键继续。', 'PAUSED');
      } else {
        noteBar.set('<b>' + esc(state.reason) + '</b> · 最终得分 <b>' + state.score + '</b>、长度 ' + state.snake.length
          + ' 节。点「重新开始」再开一局。', 'FINISH');
      }
    }

    function renderAll() {
      draw();
      updateNote();
      updateStats();
    }

    /* ---------- 游戏逻辑 ---------- */
    function isOnSnake(x, y) {
      return state.snake.some(function (s) { return s.x === x && s.y === y; });
    }

    function newFood() {
      var tries = 0;
      while (tries++ < 600) {
        var x = Math.floor(Math.random() * SNAKE_COLS);
        var y = Math.floor(Math.random() * SNAKE_ROWS);
        if (!isOnSnake(x, y)) return { x: x, y: y, type: Math.random() < 0.5 ? 1 : 2 };
      }
      return { x: 0, y: 0, type: 1 };
    }

    function resetGame() {
      stopTimers();
      state.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
      state.dir = 'Right';
      state.pendingDir = null;
      state.score = 0;
      state.status = 'ready';
      state.reason = '';
      state.demo = null;
      state.demoFoods = [];
      state.food = newFood();
      chainMark(-1);
      codeView.setFocus(SNAKE_FOCUS.move);
      setBtnLabel(btnStart, '开始');
      renderAll();
    }

    function setBtnLabel(btn, text) {
      var sp = btn.querySelector('span');
      if (sp) sp.textContent = text;
    }

    function scheduleTick() {
      later(function () {
        if (state.status !== 'playing' || state.demo) return;
        tick();
        if (state.status === 'playing') scheduleTick();
      }, state.speed);
    }

    function togglePlay() {
      if (state.demo) { stopDemo(); return; }
      if (state.status === 'playing') {
        state.status = 'paused';
        stopTimers();
        setBtnLabel(btnStart, '继续');
        renderAll();
        return;
      }
      if (state.status === 'over' || state.status === 'win') resetGame();
      state.status = 'playing';
      setBtnLabel(btnStart, '暂停');
      chainMark(-1);
      codeView.setFocus(SNAKE_FOCUS.run);
      renderAll();
      scheduleTick();
    }

    function setDir(d) {
      if (state.demo) return;
      var opposite = { Left: 'Right', Right: 'Left', Up: 'Down', Down: 'Up' };
      if (state.status === 'over' || state.status === 'win') return;
      if (state.status === 'ready' || state.status === 'paused') {
        state.status = 'playing';
        setBtnLabel(btnStart, '暂停');
        scheduleTick();
      }
      if (state.status !== 'playing') return;
      var base = state.pendingDir || state.dir;
      if (d === opposite[base]) return;   /* 不允许直接掉头 */
      state.pendingDir = d;
      renderAll();
    }

    function tick() {
      if (state.status !== 'playing' && !state.demo) return;
      if (state.pendingDir) {
        state.dir = state.pendingDir;
        state.pendingDir = null;
      }
      var head = state.snake[0];
      var nx = head.x;
      var ny = head.y;
      if (state.dir === 'Left') nx -= 1;
      else if (state.dir === 'Right') nx += 1;
      else if (state.dir === 'Up') ny -= 1;
      else ny += 1;
      if (nx < 0 || nx >= SNAKE_COLS || ny < 0 || ny >= SNAKE_ROWS) {
        endGame('撞到边界（wall）');
        return;
      }
      var eating = state.food && state.food.x === nx && state.food.y === ny;
      var checkBody = eating ? state.snake : state.snake.slice(0, -1);
      for (var i = 0; i < checkBody.length; i++) {
        if (checkBody[i].x === nx && checkBody[i].y === ny) {
          endGame('撞到自己的身体（self-collision）');
          return;
        }
      }
      var newHead = { x: nx, y: ny };
      var next;
      if (!eating) {
        next = [newHead].concat(state.snake.slice(0, -1));
      } else {
        next = [newHead].concat(state.snake);
        if (state.food.type === 2) {
          next.push({ x: next[next.length - 1].x, y: next[next.length - 1].y });
        }
      }
      state.snake = next;
      if (eating) {
        state.score += state.food.type === 2 ? 25 : 10;
        if (state.demo && state.demoFoods.length) {
          state.food = state.demoFoods.shift();
        } else {
          state.food = newFood();
        }
        if (state.snake.length >= SNAKE_MAX_LEN) {
          endGame('长度达到最大限制 8 节（达成目标）', true);
          return;
        }
      }
      draw();
      updateStats();
    }

    function endGame(reason, win) {
      state.status = win ? 'win' : 'over';
      state.reason = reason;
      state.demo = null;
      stopTimers();
      setBtnLabel(btnStart, '开始');
      chainMark(-1);
      draw();
      updateNote();
      updateStats();
    }

    /* ---------- 慢动作演示 ---------- */
    function chainFocus(key) {
      codeView.setFocus(key ? SNAKE_FOCUS[key] : []);
    }

    function runDemo() {
      stopTimers();
      state.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
      state.dir = 'Right';
      state.pendingDir = null;
      state.score = 0;
      state.status = 'paused';
      state.reason = '';
      state.demoFoods = [
        { x: 8, y: 5, type: 1 },
        { x: 8, y: 8, type: 2 },
        { x: 5, y: 8, type: 1 }
      ];
      state.food = state.demoFoods.shift();
      state.demo = { idx: 0 };
      setBtnLabel(btnStart, '继续');
      chainMark(-1);
      chainFocus('run');
      draw();
      updateStats();
      noteBar.set('慢动作演示开始：<b>start_game()</b> 调用 <b>run_game()</b>；run_game 调 <b>move_snake()</b> 移动，'
        + '再由 <b>update_ui()</b> 重画，最后 <b>after(100, run_game)</b> 预约下一次。注意：不需要 while 循环。', 'DEMO');
      later(demoTick, 800);
    }

    function demoTick() {
      if (!state.demo) return;
      var item = SNAKE_DEMO[state.demo.idx];
      if (!item) { finishDemo(); return; }
      state.demo.idx += 1;
      chainMark(0);
      chainFocus('run');
      later(function () {
        chainMark(1);
        chainFocus('move');
        noteBar.set('第 <b>' + state.demo.idx + '</b> 拍：<b>run_game()</b> 调用 <b>move_snake()</b>，'
          + '把蛇头向 <b>' + item.dir + '</b> 移动一格，再整体平移身体。', 'DEMO');
      }, 220);
      later(function () {
        state.dir = item.dir;
        state.pendingDir = null;
        tick();
        if (!state.demo) return;   /* tick 中途结束（撞墙/达成）就不再演示 */
        chainMark(2);
        chainFocus('ui');
      }, 480);
      later(function () {
        if (!state.demo) return;
        chainMark(3);
        chainFocus('after');
      }, 700);
      later(function () {
        if (!state.demo) return;
        chainMark(-1);
        chainFocus('run');
        demoTick();
      }, 1150);
    }

    function finishDemo() {
      state.demo = null;
      state.status = 'paused';
      state.food = newFood();
      chainMark(-1);
      chainFocus('move');
      draw();
      updateStats();
      noteBar.set('演示结束：现在长度 <b>' + state.snake.length + ' / 8</b>。点「继续」或按方向键接着玩，'
        + '再吃一节就达成 8 节目标；也可以点「重新开始」自己开一局。', 'DEMO DONE');
    }

    function stopDemo() {
      state.demo = null;
      stopTimers();
      state.status = 'paused';
      chainMark(-1);
      renderAll();
      noteBar.set('已退出演示。点「继续」或按方向键接着玩。', 'PAUSED');
    }

    /* ---------- 键盘 ---------- */
    function onKey(ev) {
      var map = { ArrowLeft: 'Left', ArrowRight: 'Right', ArrowUp: 'Up', ArrowDown: 'Down' };
      var d = map[ev.key];
      if (!d) return;
      var tag = (ev.target && ev.target.tagName ? ev.target.tagName : '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select'
        || (ev.target && ev.target.isContentEditable)) return;
      if (!root.isConnected || !canvas) return;
      var rect = canvas.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.bottom < 0 || rect.top > vh) return;   /* 画布不在视口内时不抢键盘 */
      ev.preventDefault();
      setDir(d);
    }
    kit.on(window, 'keydown', onKey);

    /* ---------- 启动 ---------- */
    state.food = newFood();
    renderAll();
  }

  LABS.snake = {
    title: '贪吃蛇（可玩版 + 慢动作演示）',
    desc: 'Canvas 贪吃蛇：方向键控制，两种食物 +1/+2，撞墙、撞自己、长到 8 节结束；慢动作演示 run_game → move_snake → update_ui → after 循环链',
    tags: ['ch18'],
    icon: 'target',
    order: 153,
    init: lab(initSnake)
  };

  /* =====================================================================
   * 5. mlnet · PyTorch 训练循环示意（ch19）
   * 左：main.py / model.py 的五个步骤；右：数据 → 网络 → loss → backward →
   * optimizer.step 的动画。loss 曲线与学习率都是「示意，非真实训练」。
   * ===================================================================== */
  var ML_STEPS = [
    {
      id: 'config', label: 'I · 读配置', file: 'main.py',
      code: [
        'import sys',
        'from config import read_args, load_config',
        'from train import run',
        '',
        'def main():',
        '    arg = read_args()            # 命令行参数：配置文件的路径',
        '    config = load_config(arg)    # 读取 minist.yaml',
        '    run(config)                  # 进入训练流程',
        '',
        'if __name__ == "__main__":',
        '    main()'
      ],
      focus: [6, 7, 8],
      action: '<b>Step I · 读配置</b>：<code>main.py</code> 是入口。它先读命令行参数，再把 <code>minist.yaml</code> 解析成 dict，'
        + '然后把 config 交给 <code>run()</code>。配置里通常有 batch_size / epochs / lr。'
    },
    {
      id: 'net', label: 'II · 定义网络', file: 'model.py',
      code: [
        'import torch.nn as nn',
        'import torch.nn.functional as F',
        '',
        'class Net(nn.Module):',
        '    def __init__(self):',
        '        super().__init__()',
        '        self.fc1 = nn.Linear(28 * 28, 128)  # 784 维输入',
        '        self.fc2 = nn.Linear(128, 10)       # 10 个类别',
        '',
        '    def forward(self, x):',
        '        x = x.view(-1, 28 * 28)             # 图片展平成向量',
        '        x = F.relu(self.fc1(x))',
        '        x = self.fc2(x)',
        '        return F.log_softmax(x, dim=1)'
      ],
      focus: [7, 8, 12, 13, 14],
      action: '<b>Step II · 定义网络</b>：<code>__init__</code> 里定义层（这里用简化版两层全连接），'
        + '<code>forward</code> 规定数据怎么一层层流到输出。PyTorch 的模型必须继承 <code>nn.Module</code>。'
    },
    {
      id: 'run', label: 'III · run()', file: 'main.py',
      code: [
        'def run(config):',
        '    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")',
        '    train_loader, test_loader = get_data_loader(config)',
        '    model = Net().to(device)',
        '    optimizer = optim.Adadelta(model.parameters(), lr=config["lr"])',
        '',
        '    for epoch in range(1, config["epochs"] + 1):',
        '        train(config, model, device, train_loader, optimizer, epoch)',
        '        test(config, model, device, test_loader)',
        '        torch.save(model.state_dict(), "model.pt")'
      ],
      focus: [3, 4, 5, 7, 8, 9],
      action: '<b>Step III · run()</b>：准备设备（CPU / CUDA）、DataLoader、模型与优化器；'
        + '再按 <code>epochs</code> 轮循环，每一轮先 train 再 test，并保存模型参数。'
    },
    {
      id: 'train', label: 'IV · train()', file: 'main.py',
      code: [
        'def train(config, model, device, train_loader, optimizer, epoch):',
        '    model.train()                       # 训练模式',
        '    for batch_idx, (data, target) in enumerate(train_loader):',
        '        data, target = data.to(device), target.to(device)',
        '        optimizer.zero_grad()           # 清空上一轮梯度',
        '        output = model(data)            # 前向传播',
        '        loss = F.nll_loss(output, target)  # 计算损失',
        '        loss.backward()                 # 反向传播：求梯度',
        '        optimizer.step()                # 用梯度更新参数'
      ],
      focus: [5, 6, 7, 8, 9],
      action: '<b>Step IV · train()</b>：这是训练循环的心脏——前向传播得到 output，算 loss，'
        + '<code>loss.backward()</code> 反向求梯度，<code>optimizer.step()</code> 按学习率更新参数。'
    },
    {
      id: 'test', label: 'V · test()', file: 'main.py',
      code: [
        'def test(config, model, device, test_loader):',
        '    model.eval()                        # 测试 / 推理模式',
        '    test_loss = 0',
        '    correct = 0',
        '    with torch.no_grad():               # 不需要梯度，省显存',
        '        for data, target in test_loader:',
        '            data, target = data.to(device), target.to(device)',
        '            output = model(data)',
        '            test_loss += F.nll_loss(output, target, reduction="sum").item()',
        '            pred = output.argmax(dim=1) # 取概率最大的类',
        '            correct += pred.eq(target).sum().item()',
        '    print("Test loss:", test_loss, "Accuracy:", correct)'
      ],
      focus: [2, 5, 6, 8, 9],
      action: '<b>Step V · test()</b>：<code>model.eval()</code> 切换到测试模式，'
        + '<code>with torch.no_grad()</code> 关闭梯度计算；取 <code>argmax</code> 得到预测类别，累计正确数。'
    }
  ];

  function initMlnet(root, props, ctx, kit) {
    var state = { step: 'config', lr: 0.01, epoch: 0 };
    var animTimers = [];
    var allTimers = [];
    var netRefs = {};
    var chips = {};
    var chart = null;
    var chartReady = false;
    var chartHost = null;

    function clearAnim() {
      animTimers.forEach(function (id) { clearTimeout(id); });
      animTimers = [];
    }
    function clearAll() {
      clearAnim();
      allTimers.forEach(function (id) { clearTimeout(id); });
      allTimers = [];
    }
    function at(ms, fn) {
      animTimers.push(kit.timeout(fn, ms));
    }
    kit.onDestroy(clearAll);

    var intro = E('div', {
      class: 'blockP',
      html: '左边是 PyTorch 项目 <code>main.py</code> / <code>model.py</code> 的五个步骤，点任一步，右边演示它正在做什么：'
        + '<b>数据 → 网络层 → loss → backward → optimizer.step()</b>。拖动学习率看 loss 曲线的变化——'
        + '曲线是模拟数据，<b>仅作示意，不是真实训练</b>。'
    });
    root.appendChild(intro);

    var ctlSteps = ctl(root);
    ctlSteps.appendChild(E('span', { class: 'pill info', text: '步骤' }));
    var stepBtns = {};
    ML_STEPS.forEach(function (st) {
      stepBtns[st.id] = button(ctlSteps, st.label, function () { selectStep(st.id); });
    });
    button(ctlSteps, '播放全部', function () { playAll(); }, { icon: 'play' });
    button(ctlSteps, '重置', function () { resetAll(); }, { icon: 'reset' });

    var grid = E('div', { class: 'gridBlock c2' });
    root.appendChild(grid);
    var leftCol = E('div');
    var rightCol = E('div');
    /* 代码面板里的 pre 有很长的 min-content；网格项默认 min-width:auto 会把右列挤到最窄，
       这里给两列加 min-width:0（纯布局约束），右列的动画区才能拿到公平宽度。 */
    leftCol.style.minWidth = '0';
    rightCol.style.minWidth = '0';
    grid.appendChild(leftCol);
    grid.appendChild(rightCol);

    var codeView = codePanel(leftCol, { title: 'main.py', lang: 'py' });

    leftCol.appendChild(E('div', { class: 'partT', text: '配置（minist.yaml 简化示意）' }));
    var cfgHost = E('div');
    leftCol.appendChild(cfgHost);
    table(cfgHost, ['key', 'value'], [
      ['batch_size', '64'],
      ['epochs', '5'],
      ['lr', '由右侧滑块决定（示意）'],
      ['data_dir', './data']
    ]);

    rightCol.appendChild(E('div', { class: 'partT', text: '一张图看懂数据流向' }));
    var netStage = E('div', { class: 'labStage' });
    rightCol.appendChild(netStage);
    var netSvg = svgEl('svg', {
      class: 'vizSvg', viewBox: '0 0 280 168', width: '100%',
      role: 'img', 'aria-label': '简化神经网络：28x28 输入 → 128 隐藏 → 10 类输出 → loss'
    });
    netStage.appendChild(netSvg);
    buildNet();

    var ctlPipe = ctl(rightCol);
    ctlPipe.appendChild(E('span', { class: 'pill info', text: '训练链' }));
    var pipeDefs = [
      { id: 'dataset', label: 'DataLoader' },
      { id: 'forward', label: 'output = model(data)' },
      { id: 'loss', label: 'F.nll_loss' },
      { id: 'backward', label: 'loss.backward()' },
      { id: 'step', label: 'optimizer.step()' }
    ];
    pipeDefs.forEach(function (p, i) {
      if (i) ctlPipe.appendChild(E('span', { class: 'mono', text: '→' }));
      chips[p.id] = E('span', { class: 'pill', text: p.label });
      ctlPipe.appendChild(chips[p.id]);
    });
    pipeDefs.forEach(function (p) { chips[p.id].className = 'pill'; });
    chips.dataset.className = 'pill';
    chips.forward.className = 'pill';
    chips.loss.className = 'pill';
    chips.backward.className = 'pill';
    chips.step.className = 'pill';

    var ctlLr = ctl(root);
    ctlLr.appendChild(E('span', { class: 'pill warn', text: '示意 · 非真实训练' }));
    ctlLr.appendChild(E('span', { class: 'mono', text: '学习率 lr' }));
    var lrSlider = slider(ctlLr, {
      label: 'lr',
      min: 1,
      max: 100,
      step: 1,
      value: 25,
      fmt: function (v) { return lrFromSlider(v); },
      onInput: function (v) {
        state.lr = Number(lrFromSlider(v));
        refreshChart();
        updateNote();
        updateStats();
      }
    });

    sec(root, 'loss 曲线（模拟数据，标注「示意」）');
    chartHost = E('div');
    root.appendChild(chartHost);
    whenViz(function () {
      if (!CSC.viz || typeof CSC.viz.lineChart !== 'function') {
        hint(chartHost, '可视化组件 CSC.viz 未加载，loss 曲线不可用（其余功能正常）。');
        return;
      }
      chart = CSC.viz.lineChart(chartHost, chartOptions());
      chartReady = true;
      refreshChart();
    });

    var noteBar = note(root);
    var statBar = stats(root);

    /* ---------- 网络示意图 ---------- */
    function buildNet() {
      function layer(key, x, y, w, h, label, sub) {
        var rect = svgEl('rect', { class: 'vizNode', x: x, y: y, width: w, height: h, rx: 4 });
        netSvg.appendChild(rect);
        netSvg.appendChild(svgTxt(x + w / 2, y + h / 2 - (sub ? 5 : 0), label, 'vizVal', 'middle'));
        if (sub) netSvg.appendChild(svgTxt(x + w / 2, y + h / 2 + 12, sub, 'vizLabel', 'middle'));
        netRefs[key] = rect;
      }
      function edge(key, x1, y1, x2, y2) {
        var line = svgEl('line', { class: 'vizEdge', x1: x1, y1: y1, x2: x2, y2: y2 });
        netSvg.appendChild(line);
        netRefs[key] = line;
      }
      edge('e1', 52, 76, 70, 76);
      edge('e2', 146, 76, 158, 76);
      edge('e3', 224, 76, 234, 76);
      edge('e4', 254, 102, 254, 110);
      layer('data', 6, 50, 46, 52, 'data', '28×28');
      layer('l1', 72, 28, 74, 96, 'Linear', '784→128');
      layer('l2', 160, 42, 64, 68, 'Linear', '128→10');
      layer('out', 234, 52, 40, 48, '10 类', '输出');
      var lossRect = svgEl('rect', { class: 'vizNode', x: 222, y: 112, width: 64, height: 30, rx: 4 });
      netSvg.appendChild(lossRect);
      netSvg.appendChild(svgTxt(254, 127, 'loss (nll)', 'vizVal', 'middle'));
      netRefs.loss = lossRect;
      netSvg.appendChild(svgTxt(140, 14, 'forward →', 'vizLabel', 'middle'));
      netSvg.appendChild(svgTxt(140, 158, '← backward', 'vizLabel', 'middle'));
    }

    function highlightNet(keys) {
      Object.keys(netRefs).forEach(function (k) {
        var el = netRefs[k];
        if (!el) return;
        var base = k.indexOf('e') === 0 ? 'vizEdge' : 'vizNode';
        el.setAttribute('class', base + (keys && keys.indexOf(k) >= 0 ? ' hi' : ''));
      });
    }

    function setChips(active) {
      Object.keys(chips).forEach(function (k) {
        chips[k].className = 'pill' + (active && active.indexOf(k) >= 0 ? ' info' : '');
      });
    }
    function doneChips(keys) {
      keys.forEach(function (k) { if (chips[k]) chips[k].className = 'pill ok'; });
    }

    /* ---------- loss 曲线数据（模拟） ---------- */
    function lrFromSlider(v) {
      var lr = 0.001 * Math.pow(10, (Number(v) / 100) * 4);
      if (lr < 0.01) return lr.toFixed(4);
      return lr.toFixed(3);
    }

    /** 学习率 → 模拟 loss；只是教学示意：太小下降慢，太大震荡 / 发散 */
    function simLoss(lr, epoch) {
      var e = Number(epoch);
      if (lr <= 0.003) return 2.3 * Math.exp(-e * 0.10) + 0.55;
      if (lr <= 0.12) return 2.3 * Math.exp(-e * 0.45) + 0.04;
      if (lr <= 0.45) return 2.3 * Math.exp(-e * 0.62) + 0.03 + (e % 2 ? 0.05 : 0);
      return 1.15 + Math.pow(e, 1.35) * 0.07 + (e % 2 ? 0.28 : -0.18);
    }

    function chartOptions() {
      var cur = [];
      var base = [];
      var i;
      for (i = 0; i <= 12; i++) {
        cur.push([i, simLoss(state.lr, i)]);
        base.push([i, simLoss(0.01, i)]);
      }
      var series = [
        { name: '基准 lr=0.01', points: base, dash: '4 3', opacity: 0.5 },
        { name: '当前 lr', points: cur, hi: true, dots: true }
      ];
      if (state.epoch <= 12) {
        series.push({
          name: '当前 epoch',
          points: [[state.epoch, simLoss(state.lr, state.epoch)]],
          dots: true
        });
      }
      var yMax = state.lr > 0.45 ? 4.4 : 2.7;
      return {
        series: series,
        width: 460,
        height: 230,
        xLabel: 'epoch（示意）',
        yLabel: 'loss',
        xTicks: 6,
        yTicks: 4,
        xMin: 0,
        xMax: 12,
        yMin: 0,
        yMax: yMax
      };
    }

    function refreshChart() {
      if (!chart || !chartReady) return;
      chart.update(chartOptions());
    }

    function lrHint() {
      if (state.lr <= 0.003) return '学习率偏小：loss 下降很慢，训练轮数会不够。';
      if (state.lr <= 0.12) return '学习率合适：loss 平稳下降。';
      if (state.lr <= 0.45) return '学习率偏大：loss 下降快但会抖动。';
      return '学习率过大：loss 震荡上升、训练发散（示意）。';
    }

    /* ---------- 步骤动画 ---------- */
    function selectStep(id, silent) {
      clearAnim();
      state.step = id;
      var st = null;
      ML_STEPS.forEach(function (s) { if (s.id === id) st = s; });
      if (!st) return;
      Object.keys(stepBtns).forEach(function (k) { stepBtns[k].classList.toggle('on', k === id); });
      codeView.setLines(st.code, st.focus);
      codeView.el.querySelector('.cbT').innerHTML = '<b>' + esc(st.file) + '</b>';
      highlightNet([]);
      setChips([]);
      state.epoch = 0;

      if (id === 'config') {
        highlightNet(['data']);
        setChips(['dataset']);
        noteBar.set(st.action, 'STEP I');
      } else if (id === 'net') {
        highlightNet(['l1', 'l2', 'out']);
        noteBar.set(st.action, 'STEP II');
      } else if (id === 'run') {
        highlightNet(['data', 'l1', 'l2', 'out', 'e1', 'e2', 'e3']);
        setChips(['dataset', 'forward']);
        noteBar.set(st.action, 'STEP III');
      } else if (id === 'train') {
        noteBar.set(st.action, 'STEP IV');
        animateTrain();
      } else if (id === 'test') {
        highlightNet(['out', 'loss']);
        setChips(['forward']);
        noteBar.set(st.action, 'STEP V');
      }
      updateStats();
      if (!silent) refreshChart();
    }

    function animateTrain() {
      state.epoch = 0;
      highlightNet([]);
      setChips(['dataset']);
      noteBar.set('<b>④ train() 开始</b>：从 DataLoader 取一个 batch：<code>for batch_idx, (data, target)</code>。', 'FWD 0/4');
      at(450, function () {
        setChips(['forward']);
        doneChips(['dataset']);
        highlightNet(['data', 'e1', 'l1', 'e2', 'l2', 'e3', 'out']);
        noteBar.set('前向传播：<b>output = model(data)</b>，数据依次流过 784 → 128 → 10 三层。', 'FWD 1/4');
      });
      at(1100, function () {
        setChips(['loss']);
        doneChips(['dataset', 'forward']);
        highlightNet(['out', 'loss', 'e4']);
        noteBar.set('计算损失：<b>loss = F.nll_loss(output, target)</b>，衡量预测与真实标签差多少。', 'FWD 2/4');
      });
      at(1750, function () {
        setChips(['backward']);
        doneChips(['loss', 'forward']);
        highlightNet(['l1', 'l2', 'out', 'e1', 'e2', 'e3']);
        noteBar.set('反向传播：<b>loss.backward()</b> 自动求出每个参数的梯度（箭头反向）。', 'BWD 3/4');
      });
      at(2400, function () {
        setChips(['step']);
        doneChips(['backward', 'loss']);
        highlightNet(['l1', 'l2', 'out']);
        noteBar.set('更新参数：<b>optimizer.step()</b> 按学习率沿梯度反方向走一步，loss 应当下降。', 'UPDATE 4/4');
      });
      at(3050, function () {
        doneChips(['dataset', 'forward', 'loss', 'backward', 'step']);
        highlightNet(['l1', 'l2', 'out']);
        state.epoch = 1;
        refreshChart();
        updateStats();
        noteBar.set('<b>一个 iteration 完成</b>：前向 → loss → 反向 → 更新。下一轮重新 <code>zero_grad()</code>，'
          + '这样反复 <code>epochs</code> 轮。', 'ITER DONE');
      });
    }

    function playAll() {
      clearAll();
      var order = ML_STEPS.map(function (s) { return s.id; });
      order.forEach(function (id, i) {
        allTimers.push(kit.timeout(function () {
          selectStep(id, true);
          if (i === order.length - 1) {
            noteBar.set('播放完毕：<b>读配置 → 定义网络 → run() → train() → test()</b>。'
              + '真实项目里这是一轮 epoch 的完整生命周期。', 'ALL DONE');
          }
        }, i * 3400));
      });
      refreshChart();
    }

    function resetAll() {
      clearAll();
      state.lr = 0.01;
      state.epoch = 0;
      lrSlider.set(25);
      selectStep('config');
      refreshChart();
      updateStats();
      noteBar.set('已重置：回到 Step I · 读配置。', 'READY');
    }

    function updateStats() {
      var loss = simLoss(state.lr, state.epoch);
      statBar.set([
        { label: '学习率', value: state.lr, hot: true },
        { label: 'epoch', value: state.epoch + ' / 12' },
        { label: '模拟 loss', value: loss.toFixed(3) },
        { label: '曲线', value: '示意，非真实训练' }
      ]);
    }

    function updateNote() {
      var st = null;
      ML_STEPS.forEach(function (s) { if (s.id === state.step) st = s; });
      if (!st) return;
      noteBar.set(st.action + '<br><b>学习率提示：</b>' + esc(lrHint()), st.label);
    }

    /* ---------- 启动 ---------- */
    selectStep('config');
    updateStats();
  }

  LABS.mlnet = {
    title: 'PyTorch 训练循环示意',
    desc: '读 config → 定义网络 → run → train → test 五步动画：数据流过网络层、算 loss、backward 求梯度、optimizer.step 更新；拖学习率看模拟 loss 曲线（示意，非真实训练）',
    tags: ['ch19'],
    icon: 'cpu',
    order: 154,
    init: lab(initMlnet)
  };

  /* =====================================================================
   * 6. examclock · 期末时间分配器（ch20）
   * 四部分用时滑块 → 实时检查 100 分钟上限；同时展示官方分值占比、建议用时
   * 与「题型速查」卡片（依据 Final Examination Guideline）。
   * ===================================================================== */
  var EXAM_PARTS = [
    { id: 'mcq', name: 'Part I · 选择题', short: 'MCQ', marks: 30, count: 10, suggest: 20, cls: 'vizBar' },
    { id: 'tf', name: 'Part II · 判断题', short: 'T/F', marks: 20, count: 5, suggest: 15, cls: 'vizBar hi' },
    { id: 'fill', name: 'Part III · 填空题', short: 'FILL', marks: 25, count: 5, suggest: 25, cls: 'vizBar done' },
    { id: 'code', name: 'Part IV · 简答与编程', short: 'CODE', marks: 25, count: 2, suggest: 30, cls: 'vizNode hi' }
  ];
  var EXAM_TOTAL = 100;
  var EXAM_READING = 10;

  function initExamclock(root, props, ctx, kit) {
    var state = {};
    EXAM_PARTS.forEach(function (p) { state[p.id] = p.suggest; });

    var intro = E('div', {
      class: 'blockP',
      html: '期末考试 <b>100 分钟 + 10 分钟读卷</b>，四部分权重 30 / 20 / 25 / 25。'
        + '拖动下面的滑块安排你的答题时间，看是否超过 100 分钟；再对照官方建议（Part I+II 共 35′、Part III 25′、Part IV 30′）做取舍。'
    });
    root.appendChild(intro);

    var ctlTop = ctl(root);
    button(ctlTop, '重置为官方建议', function () {
      EXAM_PARTS.forEach(function (p) { state[p.id] = p.suggest; });
      EXAM_PARTS.forEach(function (p) { sliders[p.id].set(p.suggest); });
      recalc();
    }, { icon: 'reset' });
    button(ctlTop, '全部清零', function () {
      EXAM_PARTS.forEach(function (p) { state[p.id] = 0; });
      EXAM_PARTS.forEach(function (p) { sliders[p.id].set(0); });
      recalc();
    }, { icon: 'trash' });

    /* ---------- 四部分滑块 ---------- */
    var sliders = {};
    EXAM_PARTS.forEach(function (p) {
      var row = ctl(root);
      row.appendChild(E('span', {
        class: 'pill info',
        text: p.name + ' · ' + p.marks + '%'
      }));
      row.appendChild(E('span', { class: 'mono', text: p.count + ' 题' }));
      sliders[p.id] = slider(row, {
        label: p.short,
        min: 0,
        max: 60,
        step: 1,
        value: p.suggest,
        fmt: function (v) { return v + '′'; },
        onInput: function (v) { state[p.id] = v; recalc(); }
      });
      row.appendChild(E('span', { class: 'mono', text: '建议 ' + p.suggest + '′' }));
    });

    /* ---------- 时间条 ---------- */
    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var timeSvg = svgEl('svg', { class: 'vizSvg', role: 'img', width: '100%' });
    timeSvg.setAttribute('viewBox', '0 0 460 92');
    timeSvg.setAttribute('aria-label', '100 分钟时间分配条');
    stage.appendChild(timeSvg);
    var legendHost = E('div', { class: 'labCtl' });
    root.appendChild(legendHost);
    buildLegend();

    /* ---------- 读数卡 ---------- */
    var cardsGrid = E('div', { class: 'gridBlock c2' });
    root.appendChild(cardsGrid);
    var cardRead = statCard(cardsGrid, '10′', '读卷（固定，官方建议用满 10 分钟通读）');
    var cardDo = statCard(cardsGrid, '90′', '四部分答题合计');
    var cardTotal = statCard(cardsGrid, '100′', '总计 = 读卷 + 答题');
    var cardLeft = statCard(cardsGrid, '0′', '剩余时间');

    var noteBar = note(root);

    /* ---------- 官方结构表 ---------- */
    sec(root, '官方结构 & 建议用时（Final Examination Guideline）');
    var tableHost = E('div');
    root.appendChild(tableHost);
    var tableCaption = '官方建议：Part I + II 共 35 分钟、Part III 25 分钟、Part IV 30 分钟，共 90 分钟答题；'
      + '另有 10 分钟读卷。合计 100 分钟。';

    /* ---------- 题型速查 ---------- */
    sec(root, '题型速查：每一部分考什么、怎么答');
    var howGrid = E('div', { class: 'howGrid' });
    root.appendChild(howGrid);
    [
      {
        icon: 'check', title: 'Part I · 选择题（30%，10 题 × 3 分）',
        text: '概念辨析 + 代码阅读。覆盖 Java 继承/多态、Socket/线程、JavaFX 布局与事件、Python 语法与类。'
          + '先做有把握的，单题超过 2 分钟就先标记跳过。'
      },
      {
        icon: 'help', title: 'Part II · 判断题（20%，5 题 × 4 分）',
        text: '一句话描述或一小段代码，判断 True / False。看到 always / only / never 这类绝对化词先怀疑；'
          + '涉及「多继承」「finally 一定执行」等课程强调的例外，按讲义结论判断。'
      },
      {
        icon: 'code', title: 'Part III · 填空题（25%，5 题 × 5 分）',
        text: '补全代码片段或逻辑结构。注意拼写与大小写（System.out.println、root.after、grid(row=0, column=0)）、'
          + '冒号与缩进（Python）、分号与花括号（Java）；一个空可能要求多个关键词。'
      },
      {
        icon: 'target', title: 'Part IV · 简答与编程（25%，2 题）',
        text: '按「思路 + 代码 + 关键 API」给分：先写类/函数框架，再补逻辑；注释、缩进、命名规范也是分。'
          + '时间不够时写伪代码 + 关键方法名，部分分会给表达清楚的想法。'
      }
    ].forEach(function (c) {
      howGrid.appendChild(E('div', { class: 'howCard' }, [
        E('div', { class: 'hi', html: icon(c.icon) }),
        E('b', { text: c.title }),
        E('span', { text: c.text })
      ]));
    });

    /* ---------- 渲染 ---------- */
    function buildLegend() {
      legendHost.innerHTML = '';
      legendHost.appendChild(E('span', { class: 'pill info', text: '图例' }));
      function item(cls, label) {
        var box = E('span');
        var s = svgEl('svg', { class: 'vizSvg', width: '12', height: '12' });
        s.setAttribute('viewBox', '0 0 12 12');
        s.appendChild(svgEl('rect', { class: cls, x: 0, y: 0, width: 12, height: 12 }));
        box.appendChild(s);
        box.appendChild(E('span', { class: 'mono', text: label }));
        legendHost.appendChild(box);
      }
      item('vizCell', '读卷 10′');
      EXAM_PARTS.forEach(function (p) { item(p.cls, p.short); });
      legendHost.appendChild(E('span', { class: 'mono', text: '标记线 = 100′ 交卷' }));
    }

    function drawBar(sum, total) {
      while (timeSvg.firstChild) timeSvg.removeChild(timeSvg.firstChild);
      var x0 = 16;
      var W = 424;
      var barY = 26;
      var barH = 30;
      var denom = Math.max(EXAM_TOTAL, total, 1);
      var unit = W / denom;
      function xOf(min) { return x0 + min * unit; }
      /* 轨道 */
      timeSvg.appendChild(svgEl('rect', {
        class: 'vizCell', x: x0, y: barY, width: W, height: barH, rx: 0
      }));
      /* 读卷段 + 四部分段 */
      var cursor = 0;
      timeSvg.appendChild(svgEl('rect', {
        class: 'vizCell', x: xOf(cursor), y: barY + 2, width: Math.max(0.5, EXAM_READING * unit), height: barH - 4
      }));
      timeSvg.appendChild(svgTxt(xOf(EXAM_READING / 2), barY + barH / 2 + 4, '读卷', 'vizCellText', 'middle'));
      cursor = EXAM_READING;
      EXAM_PARTS.forEach(function (p) {
        var mins = state[p.id] || 0;
        if (mins > 0) {
          timeSvg.appendChild(svgEl('rect', {
            class: p.cls.replace(/ hi$/, '') + (p.cls.indexOf(' hi') >= 0 ? ' hi' : ''),
            x: xOf(cursor), y: barY + 2, width: Math.max(0.5, mins * unit), height: barH - 4
          }));
          if (mins * unit > 34) {
            timeSvg.appendChild(svgTxt(xOf(cursor + mins / 2), barY + barH / 2 + 4, p.short, 'vizCellText', 'middle'));
          }
          cursor += mins;
        }
      });
      /* 刻度 */
      for (var t = 0; t <= EXAM_TOTAL; t += 10) {
        var tx = xOf(t);
        timeSvg.appendChild(svgEl('line', { class: 'vizGrid', x1: tx, y1: barY + barH, x2: tx, y2: barY + barH + 5 }));
        timeSvg.appendChild(svgTxt(tx, barY + barH + 18, String(t), 'vizLabel', 'middle'));
      }
      timeSvg.appendChild(svgTxt(x0 + W, barY + barH + 34, '分钟', 'vizLabel', 'end'));
      /* 100 分钟交卷线 */
      var markX = xOf(EXAM_TOTAL);
      timeSvg.appendChild(svgEl('line', { class: 'vizEdge hi', x1: markX, y1: barY - 8, x2: markX, y2: barY + barH + 4 }));
      timeSvg.appendChild(svgTxt(markX, barY - 12, total > EXAM_TOTAL ? '100′ 上限 / 已超 ' + (total - EXAM_TOTAL) + '′' : '100′ 交卷',
        'vizPtrText', total > EXAM_TOTAL ? 'middle' : 'end'));
      /* 超时区底色（100 到实际总长的部分） */
      if (total > EXAM_TOTAL) {
        timeSvg.appendChild(svgEl('rect', {
          class: 'vizBar hi', x: markX, y: barY, width: (total - EXAM_TOTAL) * unit, height: barH, opacity: '0.22'
        }));
      }
    }

    function renderTable() {
      tableHost.innerHTML = '';
      var rows = EXAM_PARTS.map(function (p) {
        var mins = state[p.id] || 0;
        var per = mins > 0 ? (mins / p.count) : 0;
        return [
          p.name,
          String(p.count),
          p.marks + '%',
          p.suggest + '′',
          mins + '′',
          mins > 0 ? (Math.round(per * 10) / 10) + '′/题' : '—'
        ];
      });
      table(tableHost, ['部分', '题数', '分值占比', '官方建议', '你的用时', '每题均速'], rows, tableCaption);
    }

    function recalc() {
      var sum = 0;
      EXAM_PARTS.forEach(function (p) { sum += Number(state[p.id]) || 0; });
      var total = sum + EXAM_READING;
      var remain = EXAM_TOTAL - total;

      drawBar(sum, total);
      renderTable();

      cardRead.set('10′', '读卷（固定，官方建议用满 10 分钟通读）', '');
      cardDo.set(sum + '′', '四部分答题合计（官方建议 90′）', sum > 90 ? 'warn' : '');
      cardTotal.set(total + '′', '总计 = 读卷 10′ + 答题 ' + sum + '′', total > EXAM_TOTAL ? 'warn' : 'ok');
      if (remain >= 0) {
        cardLeft.set(remain + '′', '可用来检查 / 回看', remain >= 10 ? 'ok' : 'warn');
      } else {
        cardLeft.set('超 ' + (-remain) + '′', '已超过 100 分钟上限', 'warn');
      }

      if (remain < 0) {
        noteBar.set('<b>超时 ' + (-remain) + ' 分钟！</b> 读卷 10′ + 四部分 ' + sum + '′ = ' + total
          + '′，超过 100′ 上限。先压缩每题耗时，或按官方建议重新分配（35 / 25 / 30）。', 'OVER');
      } else if (remain === 0) {
        noteBar.set('<b>刚好用完 100 分钟</b>：读卷 10′ + 答题 90′。建议至少留 5–10 分钟检查，别把时间排满。', 'FULL');
      } else if (remain <= 5) {
        noteBar.set('剩余 <b>' + remain + ' 分钟</b>：很紧。至少留 10 分钟检查卷面与拼写（尤其填空题的 API 名称）。', 'TIGHT');
      } else {
        noteBar.set('剩余 <b>' + remain + ' 分钟</b>：可用来检查与回看。'
          + (sum === 90 ? '正好是官方建议的 90 分钟答题量。' : (sum > 90 ? '答题时间比官方建议多 ' + (sum - 90) + '′。' : '答题时间比官方建议少 ' + (90 - sum) + '′，注意别压缩到写不完。')),
          'OK');
      }
    }

    recalc();
    kit.onDestroy(function () { /* 无定时器，DOM 随实验台移除 */ });
  }

  LABS.examclock = {
    title: '期末时间分配器',
    desc: '拖动四个部分的预计用时，实时检查 100 分钟上限（含 10 分钟读卷）；对照官方分值占比 30/20/25/25、建议用时与题型速查卡',
    tags: ['ch20'],
    icon: 'clock',
    order: 155,
    init: lab(initExamclock)
  };

  /* =====================================================================
   * 三、注册
   * ===================================================================== */
  function registerAll() {
    if (!CSC || typeof CSC.registerLabs !== 'function') {
      console.error('[labs2] CSC.registerLabs 不可用：请确认 app.js 已在本文件之前加载');
      return;
    }
    CSC.registerLabs(LABS);
  }
  if (typeof CSC.registerLabs === 'function') registerAll();
  else if (window.addEventListener) window.addEventListener('load', registerAll);
})();
