/* =====================================================================
 * CSC1004 · Java 程序设计实验 · 学习站 · labs.js
 * 职责：用 CSC.registerLabs 注册 ch01–ch14 的 15 个交互实验台：
 *   ide vibe classdesign inherit polymorph lambda streams socket threads
 *   fxstage fxlayout fxcanvas fxevents chat gomoku
 * 对外：每个实验台 { title, desc, icon, order, tags, init(root, props, ctx) }；
 *   init 只做渲染、不发请求，返回 { destroy() }；动画由 kit 统一清理。
 * 依赖：CSC.el / CSC.icon / CSC.copy / CSC.codeLines，可选 CSC.viz。
 * 约定：IIFE + 'use strict'；不写内联 style（动态坐标/尺寸除外）；
 *   颜色一律取 CSS 变量；不硬编码色值。
 * 作者模块：labs-java
 * ===================================================================== */
(function () {
  'use strict';

  var CSC = window.CSC;
  if (!CSC) {
    console.error('[labs] 必须先加载 app.js');
    return;
  }

  var NS = 'http://www.w3.org/2000/svg';

  /* =====================================================================
   * 一、基础工具：DOM 工厂 / 控件 / 生命周期
   * ===================================================================== */
  function E(tag, attrs, children) { return CSC.el(tag, attrs, children); }
  function icon(name) { return typeof CSC.icon === 'function' ? CSC.icon(name) : ''; }
  function viz() { return CSC.viz || null; }
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  function esc(s) {
    if (typeof CSC.escapeHtml === 'function') return CSC.escapeHtml(s);
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function copyText(text) {
    if (typeof CSC.copy === 'function') CSC.copy(text);
    else if (navigator.clipboard) navigator.clipboard.writeText(text);
  }

  /** 一行控件容器（.labCtl 自动换行） */
  function ctl(parent) {
    var d = E('div', { class: 'labCtl' });
    if (parent) parent.appendChild(d);
    return d;
  }

  /** 实验台按钮；opts.icon 用 CSC.icon 渲染，opts.primary 用主色描边 */
  function button(parent, label, onClick, opts) {
    opts = opts || {};
    var b = E('button', {
      class: 'labBtn' + (opts.primary ? ' primary' : '') + (opts.cls ? ' ' + opts.cls : ''),
      type: 'button'
    });
    if (opts.icon) b.innerHTML = icon(opts.icon);
    b.appendChild(E('span', { text: label }));
    b.addEventListener('click', onClick || function () {});
    if (parent) parent.appendChild(b);
    return b;
  }

  /** 可切换按钮（用 .on 表示选中） */
  function toggleBtn(parent, label, on, onToggle, opts) {
    var b = button(parent, label, function () {
      var next = !b.classList.contains('on');
      b.classList.toggle('on', next);
      if (onToggle) onToggle(next, b);
    }, opts);
    if (on) b.classList.add('on');
    return b;
  }

  function setBtnLabel(btn, text) {
    var sp = btn && btn.querySelector('span');
    if (sp) sp.textContent = text;
  }

  /** 状态说明条：主文本可用少量 HTML（<b>），右侧显示步数等附加信息 */
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
        return this;
      }
    };
  }

  /** 统计条：items:[{label, value, hot}] */
  function stats(parent) {
    var wrap = E('div', { class: 'labStat' });
    if (parent) parent.appendChild(wrap);
    var api = {
      el: wrap,
      set: function (items) {
        wrap.innerHTML = '';
        (items || []).forEach(function (it) {
          if (!it) return;
          var s = E('span');
          if (it.label) s.appendChild(document.createTextNode(it.label + ' '));
          s.appendChild(E('b', { class: it.hot ? 'hot' : '', text: String(it.value) }));
          wrap.appendChild(s);
        });
        return api;
      }
    };
    return api;
  }

  /** 速度/参数滑块；返回句柄，set 可外部回写显示值 */
  function slider(parent, opts) {
    opts = opts || {};
    var wrap = E('label', { class: 'labSlider' });
    if (opts.label) wrap.appendChild(E('span', { text: opts.label }));
    var inp = E('input', {
      type: 'range',
      min: opts.min != null ? opts.min : 1,
      max: opts.max != null ? opts.max : 5,
      step: opts.step != null ? opts.step : 1,
      value: opts.value != null ? opts.value : 1
    });
    var val = E('span', { class: 'mono', text: String(inp.value) });
    wrap.appendChild(inp);
    wrap.appendChild(val);
    inp.addEventListener('input', function () {
      val.textContent = String(inp.value);
      if (opts.onInput) opts.onInput(Number(inp.value));
    });
    if (parent) parent.appendChild(wrap);
    return {
      el: wrap,
      input: inp,
      get: function () { return Number(inp.value); },
      set: function (v) { inp.value = String(v); val.textContent = String(v); }
    };
  }

  /** 数字输入框 */
  function numberInput(parent, opts) {
    opts = opts || {};
    var inp = E('input', {
      class: 'labNum',
      type: 'number',
      min: opts.min,
      max: opts.max,
      step: opts.step != null ? opts.step : 1,
      value: opts.value != null ? opts.value : 0
    });
    function read() {
      var v = Number(inp.value);
      if (isNaN(v)) return;
      if (opts.min != null) v = Math.max(opts.min, v);
      if (opts.max != null) v = Math.min(opts.max, v);
      inp.value = String(v);
      if (opts.onInput) opts.onInput(v, inp);
    }
    inp.addEventListener('input', read);
    if (opts.onChange) inp.addEventListener('change', read);
    if (parent) parent.appendChild(inp);
    return inp;
  }

  /** 单行文本输入（复用 .qzInput 样式） */
  function textInput(parent, opts) {
    opts = opts || {};
    var inp = E('input', {
      class: 'qzInput',
      type: 'text',
      maxlength: opts.maxlength || 24,
      value: opts.value != null ? opts.value : '',
      placeholder: opts.placeholder || ''
    });
    inp.addEventListener('input', function () { if (opts.onInput) opts.onInput(inp.value); });
    if (parent) parent.appendChild(inp);
    return inp;
  }

  /** 多行文本域 */
  function textArea(parent, opts) {
    opts = opts || {};
    var ta = E('textarea', {
      class: 'qzTextarea',
      rows: opts.rows || 3,
      placeholder: opts.placeholder || ''
    });
    ta.value = opts.value || '';
    ta.addEventListener('input', function () { if (opts.onInput) opts.onInput(ta.value); });
    if (parent) parent.appendChild(ta);
    return ta;
  }

  /** 下拉框 */
  function selectBox(parent, options, value, onChange) {
    var s = E('select', { class: 'labSelect' });
    (options || []).forEach(function (o) {
      var op = E('option', { value: o.value, text: o.label });
      if (String(o.value) === String(value)) op.selected = true;
      s.appendChild(op);
    });
    s.addEventListener('change', function () { if (onChange) onChange(String(s.value)); });
    if (parent) parent.appendChild(s);
    return s;
  }

  function pill(parent, text, kind) {
    var p = E('span', { class: 'pill' + (kind ? ' ' + kind : ''), text: text });
    if (parent) parent.appendChild(p);
    return p;
  }

  /** 面板小标题（复用内存图的列标题样式） */
  function panelTitle(parent, text) {
    var d = E('div', { class: 'memColT', text: text });
    if (parent) parent.appendChild(d);
    return d;
  }

  function hintLine(parent, text) {
    var d = E('div', { class: 'varEmpty', text: text || '' });
    if (parent) parent.appendChild(d);
    return d;
  }

  /**
   * 代码面板：.codeBox + 行号 + 行高亮。
   * 返回 { el, pre, rows, mark(focusLines, activeLine), setLines(lines) }。
   * 行号 span 可直接点击（调用方自行委托事件）。
   */
  function codePanel(parent, lines, headText) {
    var box = E('div', { class: 'codeBox' });
    if (headText) {
      box.appendChild(E('div', { class: 'codeBoxHead' }, [
        E('div', { class: 'codeDots' }, [E('i'), E('i'), E('i')]),
        E('span', { class: 'cbT', html: headText })
      ]));
    }
    var pre = E('pre');
    box.appendChild(pre);
    if (parent) parent.appendChild(box);
    var api = { el: box, pre: pre, rows: [], lines: [] };
    api.setLines = function (next) {
      api.lines = (next || []).slice();
      var src = api.lines.join('\n');
      if (typeof CSC.codeLines === 'function') pre.innerHTML = CSC.codeLines(src);
      else pre.innerHTML = api.lines.map(function (ln, i) {
        return '<span class="line"><span class="ln">' + (i + 1) + '</span>' + esc(ln) + '</span>';
      }).join('');
      api.rows = Array.prototype.slice.call(pre.querySelectorAll('.line'));
      return api;
    };
    api.mark = function (focus, active) {
      var f = focus || [];
      api.rows.forEach(function (row, i) {
        var ln = i + 1;
        var cls = 'line';
        if (f.indexOf(ln) >= 0) cls += ' focus';
        if (active === ln) cls += ' active';
        row.className = cls;
        var no = row.querySelector('.ln');
        if (no) no.className = 'ln' + (f.indexOf(ln) >= 0 ? ' focus' : '');
      });
      return api;
    };
    api.setLines(lines);
    return api;
  }

  /** 控制台输出框（.codeBox 外壳） */
  function consoleBox(parent, headText) {
    var box = E('div', { class: 'codeBox' });
    if (headText) {
      box.appendChild(E('div', { class: 'codeBoxHead' }, [
        E('div', { class: 'codeDots' }, [E('i'), E('i'), E('i')]),
        E('span', { class: 'cbT', html: headText })
      ]));
    }
    var pre = E('pre');
    box.appendChild(pre);
    if (parent) parent.appendChild(box);
    var lines = [];
    var api = {
      el: box,
      lines: lines,
      log: function (text) {
        lines.push(String(text));
        if (lines.length > 40) lines.shift();
        api.render();
        return api;
      },
      clear: function () { lines.length = 0; api.render(); return api; },
      render: function () {
        pre.textContent = lines.length ? lines.join('\n') : '（还没有输出）';
        return api;
      }
    };
    api.render();
    return api;
  }

  /** 生命周期小盒子：定时器、播放器、清理回调 */
  function makeKit() {
    var timers = [];
    var players = [];
    var cleanups = [];
    var dead = false;
    return {
      dead: function () { return dead; },
      timeout: function (fn, ms) {
        var id = setTimeout(function () {
          var at = timers.indexOf(id);
          if (at >= 0) timers.splice(at, 1);
          if (!dead) fn();
        }, ms);
        timers.push(id);
        return id;
      },
      addPlayer: function (p) { players.push(p); return p; },
      onDestroy: function (fn) { cleanups.push(fn); },
      destroy: function () {
        if (dead) return;
        dead = true;
        timers.forEach(function (id) { clearTimeout(id); });
        timers = [];
        players.forEach(function (p) { try { p.destroy(); } catch (e) { /* 忽略 */ } });
        players = [];
        cleanups.forEach(function (fn) { try { fn(); } catch (e) { /* 忽略 */ } });
        cleanups = [];
      }
    };
  }

  /**
   * 播放器：用 requestAnimationFrame 主循环，按 delayFn() 的间隔调用 stepFn。
   * stepFn 返回 false 表示结束（播放器自动停止并触发 onIdle）。
   */
  function makePlayer(stepFn, delayFn) {
    var api = { playing: false, onIdle: null };
    var lastTs = 0;
    var rafId = 0;
    var dead = false;

    function loop(ts) {
      if (!api.playing || dead) return;
      if (!lastTs) lastTs = ts;
      var delay = Math.max(20, Number(delayFn()) || 300);
      if (ts - lastTs >= delay) {
        lastTs = ts;
        var more = false;
        try { more = stepFn() !== false; } catch (e) { console.error('[labs] 播放出错', e); more = false; }
        if (!more) {
          api.playing = false;
          rafId = 0;
          if (api.onIdle) api.onIdle();
          return;
        }
      }
      rafId = requestAnimationFrame(loop);
    }

    api.play = function () {
      if (dead || api.playing) return;
      api.playing = true;
      lastTs = 0;
      rafId = requestAnimationFrame(loop);
    };
    api.pause = function () {
      api.playing = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };
    api.destroy = function () {
      dead = true;
      api.pause();
    };
    return api;
  }

  /** 定时内插（用 setTimeout，随 kit 一起清理）：onStep(t∈[0,1]) */
  function tween(kit, ms, onStep, onDone) {
    var steps = Math.max(1, Math.round(ms / 24));
    var i = 0;
    function tick() {
      i++;
      var t = Math.min(1, i / steps);
      try { onStep(t); } catch (e) { /* 忽略绘制异常 */ }
      if (t < 1) kit.timeout(tick, 24);
      else if (onDone) onDone();
    }
    kit.timeout(tick, 24);
  }

  /** viz 未就绪时先占位，就绪后再 build（最多等 3 秒） */
  function mountViz(root, build) {
    if (viz()) { build(); return; }
    var wait = E('div', { class: 'labNote' }, [E('span', { text: '可视化组件加载中…' })]);
    root.appendChild(wait);
    var done = false;
    function go() {
      if (done) return;
      done = true;
      if (wait.parentNode) wait.parentNode.removeChild(wait);
      if (!viz()) {
        root.appendChild(E('div', { class: 'varEmpty', text: '可视化组件加载失败：请刷新页面重试。' }));
        return;
      }
      build();
    }
    if (CSC.bus && CSC.bus.on) CSC.bus.on('viz:ready', go);
    setTimeout(go, 3000);
  }

  /**
   * 实验台包装器：统一错误兜底 + 销毁清理。
   * app.js 丢弃 init 返回值，因此额外用 MutationObserver 监听 #content，
   * 一旦本实验台根节点被移出文档就主动清理播放器/定时器。
   */
  function lab(initFn) {
    return function (root, props, ctx) {
      var kit = makeKit();
      var mo = null;
      mountViz(root, function () {
        if (kit.dead() || !root.isConnected) return;
        try {
          initFn(root, props || {}, ctx || {}, kit);
        } catch (e) {
          console.error('[labs] 实验台初始化失败', e);
          if (root) root.appendChild(E('div', { class: 'varEmpty', text: '实验台初始化失败：' + (e && e.message ? e.message : e) }));
        }
      });
      try {
        var host = document.getElementById('content') || document.body;
        if (window.MutationObserver && host) {
          mo = new MutationObserver(function () {
            if (!root.isConnected) {
              kit.destroy();
              mo.disconnect();
              mo = null;
            }
          });
          mo.observe(host, { childList: true });
        }
      } catch (e) { /* 无 MutationObserver 时忽略 */ }
      return {
        destroy: function () {
          kit.destroy();
          if (mo) { mo.disconnect(); mo = null; }
        }
      };
    };
  }

  /* =====================================================================
   * 二、SVG 工具：自建图形（坐标都是动态计算的，颜色取 CSS 变量）
   * ===================================================================== */
  function S(tag, attrs, kids) {
    var n = document.createElementNS(NS, tag);
    if (attrs) {
      for (var k in attrs) {
        if (!own(attrs, k)) continue;
        var v = attrs[k];
        if (v == null || v === false) continue;
        n.setAttribute(k, v === true ? '' : String(v));
      }
    }
    if (kids) kids.forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function T(x, y, str, cls, anchor) {
    var t = S('text', { x: x, y: y, class: cls || 'vizLabel' });
    if (anchor) t.setAttribute('text-anchor', anchor);
    t.textContent = str == null ? '' : String(str);
    return t;
  }

  function R(x, y, w, h, cls, rx) {
    return S('rect', { x: x, y: y, width: w, height: h, class: cls || 'vizNode', rx: rx != null ? rx : 6 });
  }

  function L(x1, y1, x2, y2, cls) {
    return S('line', { x1: x1, y1: y1, x2: x2, y2: y2, class: cls || 'vizEdge' });
  }

  function C(cx, cy, r, cls) {
    return S('circle', { cx: cx, cy: cy, r: r, class: cls || 'vizNode' });
  }

  /** 带箭头的折线（path），end 端画一个实心三角 */
  function arrow(x1, y1, x2, y2, cls, colorVar) {
    var g = S('g');
    var ln = S('line', { x1: x1, y1: y1, x2: x2, y2: y2, class: cls || 'vizEdge' });
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / len, uy = dy / len;
    var bx = x2 - ux * 8, by = y2 - uy * 8;
    var px = -uy * 4, py = ux * 4;
    var head = S('path', {
      d: 'M' + x2 + ' ' + y2 + ' L' + (bx + px) + ' ' + (by + py) + ' L' + (bx - px) + ' ' + (by - py) + ' z',
      class: 'vizPtr'
    });
    if (colorVar) {
      ln.setAttribute('stroke', cssVar(colorVar));
      head.setAttribute('fill', cssVar(colorVar));
    }
    g.appendChild(ln);
    g.appendChild(head);
    return g;
  }

  /** 创建一个自适应宽度的 SVG 画布 */
  function svgBox(host, w, h) {
    var el = S('svg', { class: 'vizSvg', viewBox: '0 0 ' + w + ' ' + h, width: '100%', role: 'img' });
    host.appendChild(el);
    var api = {
      el: el, w: w, h: h,
      add: function (n) { el.appendChild(n); return n; },
      clear: function () { while (el.firstChild) el.removeChild(el.firstChild); return api; },
      resize: function (nw, nh) {
        api.w = nw; api.h = nh;
        el.setAttribute('viewBox', '0 0 ' + nw + ' ' + nh);
        return api;
      },
      txt: function (x, y, str, cls, anchor) { return api.add(T(x, y, str, cls, anchor)); }
    };
    return api;
  }

  /* 颜色缓存：CSS 变量在 canvas / SVG 属性里不被解析，只能取计算值 */
  var COLOR_CACHE = {};
  function cssVar(name, fallback) {
    if (own(COLOR_CACHE, name)) return COLOR_CACHE[name];
    var v = '';
    try {
      v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    } catch (e) { v = ''; }
    if (!v) v = fallback || '#8b7cff';
    COLOR_CACHE[name] = v;
    return v;
  }

  /** 给 SVG 元素设置 CSS 变量颜色（fill / stroke） */
  function paintVar(node, prop, name) {
    node.setAttribute(prop, cssVar(name));
    return node;
  }

  /* =====================================================================
   * 三、实验台 1 · ide —— IntelliJ 调试器导览
   * ===================================================================== */
  var IDE_CODE = [
    'public class DebugDemo {',
    '    public static void main(String[] args) {',
    '        int[] data = {3, 7, 12, 5};',
    '        int sum = 0;',
    '        for (int i = 0; i < data.length; i++) {',
    '            sum = add(sum, data[i]);',
    '        }',
    '        double avg = sum / data.length;',
    '        System.out.println("average = " + avg);',
    '    }',
    '',
    '    static int add(int a, int b) {',
    '        int result = a + b;',
    '        return result;',
    '    }',
    '}'
  ];

  function initIde(root, props, ctx, kit) {
    var state = {
      frames: [],            // [{ fn:'main'|'add', pc: 下一条要执行的行, locals:{} }]
      bp: {},                // 断点行集合
      finished: false,
      pausedAtBp: false,
      console: [],
      steps: 0
    };

    var btnRow = ctl(root);
    var codeHost = E('div');
    var layout = E('div', { class: 'gridBlock c2' });
    var left = E('div');
    var right = E('div');
    layout.appendChild(left);
    layout.appendChild(right);
    root.appendChild(layout);
    left.appendChild(codeHost);

    var code = codePanel(codeHost, IDE_CODE, 'DebugDemo.java');

    /* ---------- 右侧：变量 / 调用栈 / 控制台 ---------- */
    panelTitle(right, '变量 Variables');
    var varBox = E('div');
    right.appendChild(varBox);
    panelTitle(right, '调用栈 Call Stack');
    var stackBox = E('div', { class: 'stackList' });
    right.appendChild(stackBox);
    panelTitle(right, '控制台 Console');
    var cons = consoleBox(right, 'Console · System.out');

    var noteBox = note(root);
    var statBox = stats(root);

    /* ---------- 代码行号点击 = 设置 / 取消断点 ---------- */
    code.pre.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.classList || !t.classList.contains('ln')) return;
      var row = t.parentNode;
      var idx = code.rows.indexOf(row);
      if (idx < 0) return;
      var ln = idx + 1;
      if (state.bp[ln]) delete state.bp[ln];
      else state.bp[ln] = 1;
      paint();
      noteBox.set(
        state.bp[ln]
          ? '在第 <b>' + ln + '</b> 行设置了断点。调试时执行到这一行<i>之前</i>会停下来，等你按 Continue / Step。'
          : '已取消第 <b>' + ln + '</b> 行的断点。',
        'BREAKPOINT ' + Object.keys(state.bp).sort(function (a, b) { return a - b; }).join(', ')
      );
    });

    /* ---------- 执行模型（按行手写的迷你解释器） ---------- */
    function top() { return state.frames.length ? state.frames[state.frames.length - 1] : null; }

    function execLine() {
      var f = top();
      if (!f) return false;
      var L = f.pc;
      var loc = f.locals;
      if (f.fn === 'main') {
        if (L === 3) { loc.data = [3, 7, 12, 5]; f.pc = 4; }
        else if (L === 4) { loc.sum = 0; f.pc = 5; }
        else if (L === 5) {
          if (loc.i == null) loc.i = 0; else loc.i += 1;
          f.pc = (loc.i < loc.data.length) ? 6 : 8;
        } else if (L === 6) {
          /* Step over：整段 add(...) 调用在这里一次完成 */
          loc.sum = loc.sum + loc.data[loc.i];
          f.pc = 7;
        } else if (L === 7) { f.pc = 5; }
        else if (L === 8) {
          /* Java 的 int / int 是整除：27 / 4 = 6，再赋给 double 得 6.0 */
          loc.avg = Math.floor(loc.sum / loc.data.length);
          f.pc = 9;
        } else if (L === 9) {
          state.console.push('average = ' + loc.avg.toFixed(1));
          f.pc = 10;
        } else if (L === 10) {
          state.frames.pop();
          if (!state.frames.length) { state.finished = true; return false; }
        } else return false;
      } else {
        if (L === 13) { loc.result = loc.a + loc.b; f.pc = 14; }
        else if (L === 14) {
          var caller = state.frames[state.frames.length - 2];
          if (caller) { caller.locals.sum = caller.locals.sum + loc.result; caller.pc = 7; }
          state.frames.pop();
        } else return false;
      }
      state.steps += 1;
      return true;
    }

    function ensureStarted() {
      if (state.frames.length || state.finished) return;
      state.frames = [{ fn: 'main', pc: 3, locals: {} }];
    }

    function stepOnce(mode) {
      if (state.finished) { paint(); return; }
      ensureStarted();
      var f = top();
      if (!f) return;
      if (mode === 'out') {
        if (f.fn !== 'main') {
          /* 从 add 返回：执行完方法体，回到调用点的下一行 */
          while (top() === f && !state.finished) execLine();
        } else {
          while (!state.finished) { if (!execLine()) break; }
        }
      } else if (mode === 'into' && f.fn === 'main' && f.pc === 6) {
        /* 进入 add 方法：压入新帧，停在方法体第一行 */
        var loc = f.locals;
        state.frames.push({ fn: 'add', pc: 13, locals: { a: loc.sum, b: loc.data[loc.i] } });
      } else {
        execLine();
      }
      state.pausedAtBp = !!(top() && state.bp[top().pc]);
      paint();
      if (state.finished) {
        noteBox.set('程序执行完毕。注意 <b>average = 6.0</b>：27 / 4 是整数除法，小数部分被丢掉了 —— 这就是这段代码的 bug。', 'TERMINATED');
      } else {
        noteBox.set(describe(), 'STEP ' + state.steps);
      }
    }

    function continueRun() {
      if (state.finished) { paint(); noteBox.set('程序已经结束，点「重置」可以重来。', 'TERMINATED'); return; }
      ensureStarted();
      var skipCurrent = state.pausedAtBp;
      state.pausedAtBp = false;
      var guard = 0;
      var alive = true;
      function tick() {
        if (!alive || kit.dead()) return;
        var f = top();
        if (!f) { finish(); return; }
        if (!skipCurrent && state.bp[f.pc]) {
          state.pausedAtBp = true;
          paint();
          noteBox.set('命中断点：停在第 <b>' + f.pc + '</b> 行（这一行还没执行）。按 Step over 走一句，或 Continue 跳过断点。', 'BREAKPOINT');
          return;
        }
        skipCurrent = false;
        var more = execLine();
        paint();
        guard += 1;
        if (!more || state.finished) { finish(); return; }
        if (guard > 120) return;
        kit.timeout(tick, 80);
      }
      tick();
    }

    function finish() {
      paint();
      noteBox.set('程序执行完毕。注意 <b>average = 6.0</b>：27 / 4 是整数除法，小数部分被丢掉了 —— 这就是这段代码的 bug。', 'TERMINATED');
    }

    function describe() {
      var f = top();
      if (!f) return '程序还没有开始。';
      if (f.fn === 'add') return '现在停在 <b>add()</b> 的方法体内（第 ' + f.pc + ' 行）：Step out 可以回到 main 的调用处。';
      var tips = {
        3: '即将执行：创建数组 data。',
        4: '即将执行：sum = 0。',
        5: 'for 循环的头部：先判断再决定进不进循环体。',
        6: '这一行是<b>方法调用</b>：Step over 会跳过 add，Step into 会进到 add 里面。',
        7: '循环体结束，回到 for 头部。',
        8: '即将执行：double avg = sum / data.length —— 注意右边是 int / int。',
        9: '即将把结果打印到 Console。',
        10: 'main 结束。'
      };
      return tips[f.pc] || ('即将执行第 ' + f.pc + ' 行。');
    }

    /* ---------- 渲染 ---------- */
    function renderVars() {
      varBox.innerHTML = '';
      var f = top();
      if (!f) {
        varBox.appendChild(E('div', {
          class: 'memEmpty',
          text: state.finished ? '程序已结束，main 的局部变量随栈帧一起销毁了。' : '程序还没有开始，变量窗是空的。'
        }));
        return;
      }
      var loc = f.locals;
      var rows = [];
      if (f.fn === 'main') {
        if (loc.data) rows.push(['data', 'int[]', '[' + loc.data.join(', ') + ']']);
        if (loc.sum != null) rows.push(['sum', 'int', loc.sum]);
        if (loc.i != null) rows.push(['i', 'int', loc.i]);
        if (loc.avg != null) rows.push(['avg', 'double', loc.avg.toFixed(1)]);
      } else {
        rows.push(['a', 'int', loc.a]);
        rows.push(['b', 'int', loc.b]);
        if (loc.result != null) rows.push(['result', 'int', loc.result]);
      }
      if (!rows.length) { varBox.appendChild(E('div', { class: 'memEmpty', text: '当前作用域还没有变量。' })); return; }
      var table = E('table', { class: 'varTable' });
      rows.forEach(function (r) {
        var tr = E('tr');
        tr.appendChild(E('td', { class: 'vn', text: r[0] }));
        tr.appendChild(E('td', { class: 'vt', text: r[1] }));
        tr.appendChild(E('td', { class: 'vv', text: String(r[2]) }));
        table.appendChild(tr);
      });
      varBox.appendChild(table);
    }

    function renderStack() {
      stackBox.innerHTML = '';
      if (!state.frames.length) {
        stackBox.appendChild(E('div', {
          class: 'memEmpty',
          text: state.finished ? '程序已结束，栈帧全部弹出。' : '调用栈为空（程序还没开始）'
        }));
        return;
      }
      for (var i = state.frames.length - 1; i >= 0; i--) {
        var f = state.frames[i];
        var fr = E('div', { class: 'stackFrame' + (i === state.frames.length - 1 ? ' top' : '') });
        fr.appendChild(E('div', { class: 'sfn', text: f.fn + '()' }));
        fr.appendChild(E('div', { class: 'sfl', text: '下一条：第 ' + f.pc + ' 行' }));
        stackBox.appendChild(fr);
      }
    }

    function paint() {
      var f = top();
      var cur = f ? f.pc : 0;
      var focus = Object.keys(state.bp).map(Number);
      code.mark(focus, state.finished ? 0 : cur);
      renderVars();
      renderStack();
      cons.lines = state.console;
      cons.render();
      statBox.set([
        { label: '断点', value: focus.length ? focus.sort(function (a, b) { return a - b; }).join(' / ') : '无' },
        { label: '当前行', value: state.finished ? '—' : (cur || '未开始'), hot: true },
        { label: '已执行语句', value: state.steps },
        { label: '状态', value: state.finished ? 'Terminated' : (cur ? (state.bp[cur] ? 'Paused at breakpoint' : 'Paused') : 'New') }
      ]);
    }

    function reset() {
      state.frames = [];
      state.finished = false;
      state.pausedAtBp = false;
      state.console = [];
      state.steps = 0;
      paint();
      noteBox.set('已重置。点击行号设断点，然后点「开始 / Continue」或直接 Step。', 'READY');
    }

    button(btnRow, '开始 / Continue', continueRun, { icon: 'play', primary: true });
    button(btnRow, 'Step over', function () { stepOnce('over'); }, { icon: 'step' });
    button(btnRow, 'Step into', function () { stepOnce('into'); }, { icon: 'arrow-right' });
    button(btnRow, 'Step out', function () { stepOnce('out'); }, { icon: 'arrow-left' });
    button(btnRow, '重置', reset, { icon: 'reset' });

    noteBox.set('点击左侧<b>行号</b>设断点。断点会停在「还没执行」的那一行 —— 和 IntelliJ 一样。先在第 6 行设断点试试。', 'READY');
    paint();
  }

  /* =====================================================================
   * 四、实验台 2 · vibe —— AI 提示词构造器 + 代码审查台
   * ===================================================================== */
  var VIBE_TASKS = {
    write: {
      label: '写一个方法',
      role: '熟悉 CSC1004 课程要求的 Java 助教',
      text: '请用 Java 写一个方法 average(int[] scores)，返回数组元素的平均值（double）。',
      ctx: '这是 CSC1004 课程项目 Gomoku 的一部分；项目用 Java 17，4 空格缩进，类名 CamelCase。',
      cons: '不要引入第三方库；不要打印调试信息；输入为空数组时返回 0.0；方法要能通过 javac 编译。',
      acc: '1) average(new int[]{90, 80, 70}) 返回 80.0；\n2) average(new int[]{}) 返回 0.0；\n3) 整数除法的坑要处理；\n4) 有一行注释解释你的选择。'
    },
    fix: {
      label: '修一个 bug',
      role: '熟悉 CSC1004 课程要求的 Java 助教',
      text: '下面这段循环在运行时抛出 ArrayIndexOutOfBoundsException，请定位并修复。',
      ctx: 'for (int i = 0; i <= data.length; i++) { sum += data[i]; }\n数据来自 `int[] data = {3, 7, 12, 5};`。',
      cons: '只改必要的行；不要重写整个方法；修好后说明为什么原来的边界会越界。',
      acc: '1) 不再抛异常；\n2) 4 个元素都被累加；\n3) 解释 i <= length 与 i < length 的区别；\n4) 给出等价的增强 for 写法。'
    },
    explain: {
      label: '解释一段代码',
      role: '熟悉 CSC1004 课程要求的 Java 助教',
      text: '请逐行解释下面这段 Socket 代码在做什么，重点讲清楚缓冲流为什么要一层层包装。',
      ctx: 'BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));\nBufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));',
      cons: '面向刚学 Java 的同学；不要用"底层实现"一带而过；每个类的作用都要说清楚。',
      acc: '1) 说明 socket 的流是字节流；\n2) 说明 OutputStreamWriter 做字节→字符；\n3) 说明 BufferedWriter 的作用与 flush；\n4) 给出一行可以发送并真正送达的完整示例。'
    }
  };

  var VIBE_REVIEW = {
    lines: [
      'public class ClientHandler implements Runnable {',
      '    private static ArrayList<ClientHandler> handlers = new ArrayList<>();',
      '    private Socket socket;',
      '    private BufferedReader reader;',
      '',
      '    public ClientHandler(Socket socket) throws IOException {',
      '        this.socket = socket;',
      '        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));',
      '        handlers.add(this);',
      '    }',
      '',
      '    public void run() {',
      '        String line = reader.readLine();',
      '        while (line.length() > 0) {',
      '            broadcast(line);',
      '            line = reader.readLine();',
      '        }',
      '    }',
      '',
      '    private void broadcast(String msg) {',
      '        for (ClientHandler h : handlers) {',
      '            h.send(msg);',
      '        }',
      '    }',
      '',
      '    private void send(String msg) throws IOException {',
      '        socket.getOutputStream().write((msg + "\\n").getBytes());',
      '    }',
      '}'
    ],
    defects: [
      {
        line: 9,
        kind: '并发不安全',
        title: 'handlers.add(this) 没有同步',
        detail: '<code>ArrayList</code> 不是线程安全的。每个客户端都会在<b>自己的 ClientHandler 子线程</b>里执行 <code>handlers.add(this)</code>，多个线程同时 add 可能丢元素，甚至破坏内部数组。',
        fix: '改成 <code>new CopyOnWriteArrayList&lt;&gt;()</code>，或用 <code>Collections.synchronizedList(...)</code>，并在广播时对列表加锁。'
      },
      {
        line: 13,
        kind: '边界',
        title: 'readLine() 可能返回 null',
        detail: '对端关闭连接时 <code>readLine()</code> 返回 <code>null</code>；第 14 行直接 <code>line.length()</code> 就会抛 <code>NullPointerException</code>。这是典型的"正常断开被当成异常"。',
        fix: '把循环写成 <code>while ((line = reader.readLine()) != null)</code>，再单独判断空行，不要在 null 上调用方法。'
      },
      {
        line: 27,
        kind: '资源与缓冲',
        title: '没有 flush，流也没有关闭',
        detail: '<code>getOutputStream().write(...)</code> 每次新建一个字节流对象，写完<b>没有 flush</b>，数据可能留在缓冲里；而且整个类没有任何 <code>close()</code>，socket 与 reader 会泄漏。',
        fix: '在构造器里缓存一个 <code>BufferedWriter</code>，<code>send()</code> 后调用 <code>flush()</code>；并在 finally / try-with-resources 里关闭 socket、reader、writer。'
      }
    ]
  };

  function initVibe(root, props, ctx, kit) {
    var state = {
      taskId: 'write',
      texts: { task: '', ctx: '', cons: '', acc: '' },
      marked: {},
      revealed: false
    };

    /* ---------- 上部：提示词构造器 ---------- */
    var headRow = ctl(root);
    headRow.appendChild(E('span', { class: 'mono dim', text: '任务类型' }));
    var taskSel = selectBox(headRow, Object.keys(VIBE_TASKS).map(function (k) {
      return { value: k, label: VIBE_TASKS[k].label };
    }), state.taskId, function (v) { loadTask(v); });
    var copyBtn = button(headRow, '复制 prompt', function () {
      copyText(promptPre.textContent || '');
    }, { icon: 'copy' });
    var refillBtn = button(headRow, '恢复示例', function () { loadTask(state.taskId); }, { icon: 'reset' });

    var grid = E('div', { class: 'gridBlock c2' });
    var formCol = E('div');
    var promptCol = E('div');
    grid.appendChild(formCol);
    grid.appendChild(promptCol);
    root.appendChild(grid);

    panelTitle(formCol, '任务描述');
    var taskTa = textArea(formCol, { rows: 2, onInput: function (v) { state.texts.task = v; buildPrompt(); } });
    panelTitle(formCol, '上下文（代码 / 项目 / 环境）');
    var ctxTa = textArea(formCol, { rows: 2, onInput: function (v) { state.texts.ctx = v; buildPrompt(); } });
    panelTitle(formCol, '约束（不能做什么）');
    var consTa = textArea(formCol, { rows: 2, onInput: function (v) { state.texts.cons = v; buildPrompt(); } });
    panelTitle(formCol, '验收标准（怎么算完成）');
    var accTa = textArea(formCol, { rows: 2, onInput: function (v) { state.texts.acc = v; buildPrompt(); } });

    panelTitle(promptCol, '拼出来的完整 prompt');
    var promptPre = E('pre');
    var promptBox = E('div', { class: 'codeBox' });
    promptBox.appendChild(E('div', { class: 'codeBoxHead' }, [
      E('div', { class: 'codeDots' }, [E('i'), E('i'), E('i')]),
      E('span', { class: 'cbT', html: 'PROMPT · 实时预览' })
    ]));
    promptBox.appendChild(promptPre);
    promptCol.appendChild(promptBox);

    function buildPrompt() {
      var t = VIBE_TASKS[state.taskId];
      var s = state.texts;
      promptPre.textContent = [
        '你是' + t.role + '。',
        '',
        '【任务】',
        s.task || '（未填写）',
        '',
        '【上下文】',
        s.ctx || '（未填写）',
        '',
        '【约束】',
        s.cons || '（未填写）',
        '',
        '【验收标准】',
        s.acc || '（未填写）',
        '',
        '【输出要求】',
        '1. 先给完整、可直接编译的代码；',
        '2. 再逐条对照验收标准说明你怎么满足的；',
        '3. 指出你不确定的地方，不要假装确定。'
      ].join('\n');
    }

    function loadTask(id) {
      state.taskId = id;
      var t = VIBE_TASKS[id];
      state.texts = { task: t.text, ctx: t.ctx, cons: t.cons, acc: t.acc };
      taskTa.value = t.text;
      ctxTa.value = t.ctx;
      consTa.value = t.cons;
      accTa.value = t.acc;
      buildPrompt();
    }

    /* ---------- 下部：代码审查台 ---------- */
    var codeTitle = panelTitle(root, 'AI 生成的代码（点击可疑行标记，再点「揭示答案」）');
    codeTitle.className = 'memColT';
    var reviewCode = codePanel(root, VIBE_REVIEW.lines, 'ClientHandler.java · AI-generated');

    var reviewRow = ctl(root);
    var revealBtn = button(reviewRow, '揭示答案', function () {
      state.revealed = !state.revealed;
      setBtnLabel(revealBtn, state.revealed ? '收起答案' : '揭示答案');
      renderReview();
      renderDefects();
    }, { icon: 'lightbulb', primary: true });
    var clearBtn = button(reviewRow, '重置标记', function () {
      state.marked = {};
      state.revealed = false;
      setBtnLabel(revealBtn, '揭示答案');
      renderReview();
      renderDefects();
    }, { icon: 'reset' });
    var reviewNote = note(root);

    var defectsBox = E('div');
    root.appendChild(defectsBox);

    function renderReview() {
      reviewCode.mark(Object.keys(state.marked).map(Number), 0);
      if (state.revealed) {
        VIBE_REVIEW.defects.forEach(function (d) {
          var row = reviewCode.rows[d.line - 1];
          if (row) row.classList.add('active');
        });
      }
    }

    function renderDefects() {
      defectsBox.innerHTML = '';
      var markedList = Object.keys(state.marked).map(Number);
      var hits = VIBE_REVIEW.defects.filter(function (d) { return markedList.indexOf(d.line) >= 0; });
      var falsePos = markedList.filter(function (ln) {
        return !VIBE_REVIEW.defects.some(function (d) { return d.line === ln; });
      });
      reviewNote.set(
        markedList.length
          ? '你标记了 <b>' + markedList.length + '</b> 行：命中 ' + (state.revealed ? hits.length + ' / ' + VIBE_REVIEW.defects.length : '?') + ' 条缺陷' +
            (state.revealed && falsePos.length ? '，另有 ' + falsePos.length + ' 行其实没问题' : '') + '。'
          : '点代码行标记你觉得有问题的地方（可以标 3 行以内），然后点「揭示答案」。',
        'MARKED ' + markedList.sort(function (a, b) { return a - b; }).join(', ')
      );
      if (!state.revealed) {
        defectsBox.appendChild(E('div', { class: 'varEmpty', text: '答案还藏着。先自己判断：这段代码在聊天室里真的能安全跑起来吗？' }));
        return;
      }
      VIBE_REVIEW.defects.forEach(function (d, i) {
        var box = E('div', { class: 'labNote' });
        box.innerHTML = '<span><b>缺陷 ' + (i + 1) + '（第 ' + d.line + ' 行 · ' + esc(d.kind) + '）：' + esc(d.title) + '</b><br>'
          + d.detail + '<br><span class="dim">修复：' + esc(d.fix) + '</span></span>';
        defectsBox.appendChild(box);
      });
    }

    reviewCode.pre.addEventListener('click', function (e) {
      var n = e.target;
      while (n && n !== reviewCode.pre && !(n.classList && n.classList.contains('line'))) n = n.parentNode;
      if (!n || n === reviewCode.pre) return;
      var idx = reviewCode.rows.indexOf(n);
      if (idx < 0) return;
      var ln = idx + 1;
      if (state.marked[ln]) delete state.marked[ln];
      else state.marked[ln] = 1;
      renderReview();
      renderDefects();
    });

    /** 已标记 + 未揭示时，把标记行加一个说明 */
    loadTask('write');
    renderReview();
    renderDefects();
  }

  /* =====================================================================
   * 五、实验台 3 · classdesign —— 类设计器 + 对象内存卡
   * ===================================================================== */
  var CD_FIELDS = [
    { id: 'name', label: 'name', type: 'String', mod: 'private', st: false, on: true },
    { id: 'age', label: 'age', type: 'int', mod: 'private', st: false, on: true },
    { id: 'score', label: 'score', type: 'double', mod: 'private', st: false, on: true },
    { id: 'count', label: 'count', type: 'int', mod: 'private', st: true, on: true }
  ];
  var CD_METHODS = [
    { id: 'getName', label: 'getName()', ret: 'String', mod: 'public', on: true, body: 'return name;' },
    { id: 'getAge', label: 'getAge()', ret: 'int', mod: 'public', on: true, body: 'return age;' },
    { id: 'setScore', label: 'setScore(double score)', ret: 'void', mod: 'public', on: true, body: 'this.score = score;' },
    { id: 'getCount', label: 'getCount()', ret: 'int', mod: 'public', st: true, on: true, body: 'return count;' }
  ];

  function initClassDesign(root, props, ctx, kit) {
    var state = {
      fields: CD_FIELDS.map(function (f) { return { id: f.id, label: f.label, type: f.type, mod: f.mod, st: f.st, on: f.on }; }),
      methods: CD_METHODS.map(function (m) { return { id: m.id, label: m.label, ret: m.ret, mod: m.mod, st: !!m.st, on: m.on, body: m.body }; }),
      objects: [],
      counter: 0
    };

    var layout = E('div', { class: 'gridBlock c2' });
    var designCol = E('div');
    var memCol = E('div');
    layout.appendChild(designCol);
    layout.appendChild(memCol);
    root.appendChild(layout);

    panelTitle(designCol, '字段 fields（点字段名加入 / 移出）');
    var fieldRows = E('div');
    designCol.appendChild(fieldRows);
    panelTitle(designCol, '方法 methods');
    var methodRows = E('div');
    designCol.appendChild(methodRows);

    panelTitle(memCol, '内存卡（new 出来的对象在堆上）');
    var memBox = E('div', { class: 'mem' });
    memCol.appendChild(memBox);

    var ctlRow = ctl(root);
    var newBtn, resetBtn;
    var codeTitle = panelTitle(root, '生成的 Java 类骨架');
    codeTitle.className = 'memColT';
    var code = codePanel(root, [], 'Student.java');

    var noteBox = note(root);
    var statBox = stats(root);

    function fieldA11yLabel(f) { return f.label + ' : ' + f.type; }

    function renderDesigner() {
      fieldRows.innerHTML = '';
      state.fields.forEach(function (f) {
        var row = E('div', { class: 'labCtl' });
        toggleBtn(row, f.label, f.on, function (on2) {
          f.on = on2;
          regenerate();
        }, { cls: 'fieldToggle' });
        var typeSel = selectBox(row, [
          { value: 'String', label: 'String' },
          { value: 'int', label: 'int' },
          { value: 'double', label: 'double' },
          { value: 'boolean', label: 'boolean' }
        ], f.type, function (v) { f.type = v; regenerate(); });
        void typeSel;
        selectBox(row, [
          { value: 'private', label: 'private' },
          { value: 'public', label: 'public' },
          { value: 'protected', label: 'protected' }
        ], f.mod, function (v) { f.mod = v; regenerate(); });
        if (f.id === 'count') {
          toggleBtn(row, f.st ? 'static（类共享）' : 'instance（每对象一份）', f.st, function (st2) {
            f.st = st2;
            regenerate();
            noteBox.set(st2
              ? 'count 现在是 <b>static</b> 字段：它属于 <b>Student 类</b>，所有对象共享同一份；new 时在方法区里 +1。'
              : 'count 现在是 <b>instance</b> 字段：每个对象各有一份 count，互相看不见对方的值。', 'STATIC?');
          });
        }
        row.appendChild(E('span', { class: 'mono dim', text: fieldA11yLabel(f) }));
        fieldRows.appendChild(row);
      });

      methodRows.innerHTML = '';
      state.methods.forEach(function (m) {
        var row = E('div', { class: 'labCtl' });
        toggleBtn(row, m.label, m.on, function (on2) { m.on = on2; regenerate(); });
        selectBox(row, [
          { value: 'public', label: 'public' },
          { value: 'private', label: 'private' },
          { value: 'protected', label: 'protected' }
        ], m.mod, function (v) { m.mod = v; regenerate(); });
        if (m.st) {
          row.appendChild(E('span', { class: 'pill info', text: 'static' }));
        }
        methodRows.appendChild(row);
      });
    }

    function buildCode() {
      var lines = ['public class Student {'];
      var fields = state.fields.filter(function (f) { return f.on; });
      fields.forEach(function (f) {
        lines.push('    ' + f.mod + ' ' + (f.st ? 'static ' : '') + f.type + ' ' + f.label + ';');
      });
      if (fields.length) lines.push('');
      var instFields = fields.filter(function (f) { return !f.st; });
      lines.push('    public Student() {');
      if (fields.some(function (f) { return f.id === 'count' && f.on && f.st; })) {
        lines.push('        count++;          // static 字段：在类上 +1');
      }
      lines.push('    }');
      state.methods.filter(function (m) { return m.on; }).forEach(function (m) {
        lines.push('');
        lines.push('    ' + m.mod + (m.st ? ' static' : '') + ' ' + m.ret + ' ' + m.label + ' {');
        lines.push('        ' + m.body);
        lines.push('    }');
      });
      void instFields;
      lines.push('}');
      return lines;
    }

    function regenerate() {
      code.setLines(buildCode());
      renderMem();
      statBox.set([
        { label: '字段', value: state.fields.filter(function (f) { return f.on; }).length + ' / ' + state.fields.length },
        { label: '方法', value: state.methods.filter(function (m) { return m.on; }).length },
        { label: '对象', value: state.objects.length, hot: true },
        { label: 'static 字段', value: state.fields.filter(function (f) { return f.on && f.st; }).length || '0' }
      ]);
    }

    function renderMem() {
      memBox.innerHTML = '';
      var fields = state.fields.filter(function (f) { return f.on; });
      var staticFields = fields.filter(function (f) { return f.st; });
      var instFields = fields.filter(function (f) { return !f.st; });

      var colStack = E('div', { class: 'memCol' });
      var colHeap = E('div', { class: 'memCol' });
      memBox.appendChild(colStack);
      memBox.appendChild(colHeap);
      colStack.appendChild(E('div', { class: 'memColT', text: '栈 stack（局部变量）' }));
      colHeap.appendChild(E('div', { class: 'memColT', text: '堆 heap / 方法区' }));

      var frame = E('div', { class: 'memFrame top' });
      frame.appendChild(E('div', { class: 'memFrameH' }, [
        E('b', { text: 'main' }),
        E('span', { class: 'ml', text: 'frame 0' })
      ]));
      var vars = E('div', { class: 'memVars' });
      if (!state.objects.length) {
        vars.appendChild(E('div', { class: 'memEmpty', text: '还没有对象。点下方「new Student()」。' }));
      } else {
        state.objects.forEach(function (o) {
          var row = E('div', { class: 'memVar' });
          row.appendChild(E('span', { class: 'mn', text: 's' + o.id }));
          row.appendChild(E('span', { class: 'mty', text: 'Student' }));
          row.appendChild(E('span', { class: 'mref', text: 'Student@' + o.id }));
          vars.appendChild(row);
        });
      }
      frame.appendChild(vars);
      colStack.appendChild(frame);

      if (!staticFields.length) {
        colHeap.appendChild(E('div', { class: 'varEmpty', text: '没有 static 字段。' }));
      } else {
        var cls = E('div', { class: 'memObj' });
        cls.appendChild(E('div', { class: 'memObjH' }, [
          E('span', { class: 'oid', text: 'Student（类）' }),
          E('span', { text: '方法区 · static 字段在这里' })
        ]));
        var clsFields = E('div', { class: 'memFields' });
        staticFields.forEach(function (f) {
          var frow = E('div', { class: 'memField' });
          frow.appendChild(E('span', { class: 'fn2', text: 'static ' + f.label }));
          frow.appendChild(E('span', { class: 'fv', text: String(state.countValue != null ? state.countValue : 0) }));
          clsFields.appendChild(frow);
        });
        cls.appendChild(clsFields);
        colHeap.appendChild(cls);
      }

      if (!state.objects.length) {
        colHeap.appendChild(E('div', { class: 'memEmpty', text: 'new 出来的对象会出现在这里。' }));
      }
      state.objects.forEach(function (o) {
        var obj = E('div', { class: 'memObj' });
        obj.appendChild(E('div', { class: 'memObjH' }, [
          E('span', { class: 'oid', text: 'Student@' + o.id }),
          E('span', { text: '堆 · 实例字段' })
        ]));
        var box = E('div', { class: 'memFields' });
        if (!instFields.length) {
          box.appendChild(E('div', { class: 'memEmpty', text: '（没有实例字段）' }));
        }
        instFields.forEach(function (f) {
          var row = E('div', { class: 'memField' });
          row.appendChild(E('span', { class: 'fn2', text: f.label }));
          row.appendChild(E('span', { class: 'fv', text: String(o.values[f.id]) }));
          box.appendChild(row);
        });
        obj.appendChild(box);
        colHeap.appendChild(obj);
      });
    }

    function newObject() {
      state.counter += 1;
      var id = state.counter;
      var values = {};
      state.fields.filter(function (f) { return f.on && !f.st; }).forEach(function (f) {
        if (f.type === 'String') values[f.id] = '"Ann' + id + '"';
        else if (f.type === 'boolean') values[f.id] = 'false';
        else if (f.type === 'double') values[f.id] = '0.0';
        else values[f.id] = '0';
      });
      state.objects.push({ id: id, values: values });
      if (state.fields.some(function (f) { return f.on && f.st && f.id === 'count'; })) {
        state.countValue = (state.countValue || 0) + 1;
      }
      renderMem();
      regenerate();
      noteBox.set('new 了第 <b>' + id + '</b> 个 Student 对象：栈上的 s' + id + ' 指向堆里的 Student@' + id + '。'
        + (state.countValue ? '注意 static 的 count 现在是 <b>' + state.countValue + '</b>：两个对象引用同一个类字段。' : ''), 'NEW OBJECT');
    }

    function reset() {
      state.objects = [];
      state.countValue = 0;
      state.counter = 0;
      renderMem();
      regenerate();
      noteBox.set('已清空所有对象。字段和方法的选择保留。', 'RESET');
    }

    newBtn = button(ctlRow, 'new Student()', newObject, { icon: 'box', primary: true });
    resetBtn = button(ctlRow, '清空对象', reset, { icon: 'trash' });
    void newBtn; void resetBtn;
    button(ctlRow, '重置设计', function () {
      state.fields = CD_FIELDS.map(function (f) { return { id: f.id, label: f.label, type: f.type, mod: f.mod, st: f.st, on: f.on }; });
      state.methods = CD_METHODS.map(function (m) { return { id: m.id, label: m.label, ret: m.ret, mod: m.mod, st: !!m.st, on: m.on, body: m.body }; });
      reset();
      renderDesigner();
      regenerate();
      noteBox.set('已恢复默认设计。', 'RESET');
    }, { icon: 'reset' });

    renderDesigner();
    state.countValue = 0;
    renderMem();
    regenerate();
    noteBox.set('勾选字段和方法，右侧会实时生成 Java 类骨架；点 <b>new Student()</b> 看对象出现在堆上。试试把 <b>count</b> 从 static 切到 instance。', 'DESIGN');
  }

  /* =====================================================================
   * 六、实验台 4 · inherit —— 继承链与方法查找顺序
   * ===================================================================== */
  var INHERIT_TREES = {
    animal: {
      label: 'Animal → Dog → BabyDog',
      desc: '多级继承：方法在父类里声明一次，子孙都能用；子类可以覆盖（override）。',
      nodes: [
        {
          id: 'Animal', x: 210, y: 20, decl: ['String name;'],
          methods: [{ name: 'eat', out: 'Animal eats' }, { name: 'sleep', out: 'Animal sleeps' }]
        },
        {
          id: 'Dog', parent: 'Animal', x: 210, y: 150, decl: ['String breed;'],
          methods: [{ name: 'speak', out: 'Woof!' }, { name: 'fetch', out: 'Dog fetches' }]
        },
        {
          id: 'BabyDog', parent: 'Dog', x: 210, y: 290, decl: [],
          methods: [{ name: 'sleep', out: 'BabyDog sleeps a lot' }]
        }
      ],
      calls: [
        { label: 'BabyDog.speak()', from: 'BabyDog', method: 'speak' },
        { label: 'BabyDog.sleep()', from: 'BabyDog', method: 'sleep' },
        { label: 'BabyDog.eat()', from: 'BabyDog', method: 'eat' },
        { label: 'Dog.fetch()', from: 'Dog', method: 'fetch' },
        { label: 'Dog.jump()', from: 'Dog', method: 'jump' }
      ],
      code: [
        'class Animal {',
        '    String name;',
        '    void eat()   { System.out.println("Animal eats"); }',
        '    void sleep() { System.out.println("Animal sleeps"); }',
        '}',
        '',
        'class Dog extends Animal {',
        '    String breed;',
        '    void speak() { System.out.println("Woof!"); }',
        '    void fetch() { System.out.println("Dog fetches"); }',
        '}',
        '',
        'class BabyDog extends Dog {',
        '    @Override',
        '    void sleep() { System.out.println("BabyDog sleeps a lot"); }',
        '}'
      ]
    },
    employee: {
      label: 'Employee → Programmer',
      desc: '单继承：子类直接复用父类的字段与方法，再新增自己的能力。',
      nodes: [
        {
          id: 'Employee', x: 210, y: 20, decl: ['String name;', 'double salary;'],
          methods: [{ name: 'work', out: 'Employee works' }, { name: 'getSalary', out: 'return salary' }]
        },
        {
          id: 'Programmer', parent: 'Employee', x: 210, y: 190, decl: ['String language;'],
          methods: [{ name: 'writeCode', out: 'Programmer writes code' }, { name: 'work', out: 'Programmer works with code' }]
        }
      ],
      calls: [
        { label: 'Programmer.work()', from: 'Programmer', method: 'work' },
        { label: 'Programmer.getSalary()', from: 'Programmer', method: 'getSalary' },
        { label: 'Programmer.writeCode()', from: 'Programmer', method: 'writeCode' },
        { label: 'Programmer.toString()', from: 'Programmer', method: 'toString' }
      ],
      code: [
        'class Employee {',
        '    String name;',
        '    double salary;',
        '    void work() { System.out.println("Employee works"); }',
        '    double getSalary() { return salary; }',
        '}',
        '',
        'class Programmer extends Employee {',
        '    String language;',
        '    void writeCode() { System.out.println("Programmer writes code"); }',
        '    @Override',
        '    void work() { System.out.println("Programmer works with code"); }',
        '}'
      ]
    },
    diamond: {
      label: 'A / B / C（菱形继承）',
      desc: 'B、C 都继承 A；D 想同时继承 B 和 C —— Java 不支持类的多继承，javac 直接报错。',
      isDiamond: true,
      nodes: [
        { id: 'A', x: 210, y: 20, methods: [{ name: 'hello', out: 'A.hello' }] },
        { id: 'B', parent: 'A', x: 105, y: 140, methods: [{ name: 'helloB', out: 'B.helloB' }] },
        { id: 'C', parent: 'A', x: 315, y: 140, methods: [{ name: 'helloC', out: 'C.helloC' }] },
        { id: 'D', parent: 'B', also: 'C', x: 210, y: 270, danger: true, methods: [] }
      ],
      calls: [],
      code: [
        'class A { void hello() { System.out.println("A"); } }',
        'class B extends A { void helloB() { } }',
        'class C extends A { void helloC() { } }',
        '',
        '// 想让 D 同时拥有 B 和 C 的能力？',
        'class D extends B, C { }   // ← 编译错误：java 不支持多继承',
        '',
        '// 正确姿势：用接口 + implements',
        'interface IB { void helloB(); }',
        'interface IC { void helloC(); }',
        'class D extends A implements IB, IC {',
        '    public void helloB() { }',
        '    public void helloC() { }',
        '}'
      ]
    }
  };

  var INHERIT_CARD_W = 200;

  function initInherit(root, props, ctx, kit) {
    var state = {
      treeId: 'animal',
      active: null,
      passed: [],
      hit: null,
      runId: 0,
      compileError: false
    };

    var treeRow = ctl(root);
    var treeBtns = {};
    Object.keys(INHERIT_TREES).forEach(function (k) {
      treeBtns[k] = button(treeRow, INHERIT_TREES[k].label, function () { selectTree(k); });
    });

    var callRow = ctl(root);

    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var box = svgBox(stage, 430, 420);

    var noteBox = note(root);
    var statBox = stats(root);
    var code = codePanel(root, INHERIT_TREES.animal.code, 'InheritanceDemo.java');

    function tree() { return INHERIT_TREES[state.treeId]; }
    function byId() {
      var map = {};
      tree().nodes.forEach(function (n) { map[n.id] = n; });
      return map;
    }
    function hasOwnMethod(node, method) {
      return (node.methods || []).some(function (m) { return m.name === method; });
    }
    function inheritedOf(node, map) {
      var out = [];
      var seen = {};
      (node.methods || []).forEach(function (m) { seen[m.name] = 1; });
      var cur = node.parent ? map[node.parent] : null;
      while (cur) {
        (cur.methods || []).forEach(function (m) {
          if (seen[m.name]) return;
          seen[m.name] = 1;
          out.push({ name: m.name, from: cur.id, out: m.out });
        });
        cur = cur.parent ? map[cur.parent] : null;
      }
      return out;
    }
    function cardHeight(node, map) {
      var own = (node.methods || []).length;
      var inh = inheritedOf(node, map).length;
      return 30 + (own + inh) * 16 + 6 + (node.decl && node.decl.length ? node.decl.length * 14 : 0);
    }

    function renderTree() {
      var t = tree();
      var map = byId();
      box.clear();
      var geo = {};
      t.nodes.forEach(function (n) {
        geo[n.id] = { x: n.x - INHERIT_CARD_W / 2, y: n.y, w: INHERIT_CARD_W, h: cardHeight(n, map) };
      });

      /* ---- 先画继承箭头（子 → 父，三角指向父） ---- */
      t.nodes.forEach(function (n) {
        if (!n.parent) return;
        var p = map[n.parent];
        if (!p) return;
        var cg = geo[n.id], pg = geo[p.id];
        var x1 = cg.x + cg.w / 2, y1 = cg.y;
        var x2 = pg.x + pg.w / 2, y2 = pg.y + pg.h;
        var isHi = state.hit && (state.passed.indexOf(n.id) >= 0 || state.passed.indexOf(p.id) >= 0);
        var g = arrow(x1, y1, x2, y2, 'vizEdge' + (isHi ? ' hi' : ''), isHi ? null : null);
        box.add(g);
        if (n.also) {
          var c2 = map[n.also];
          if (c2) {
            var c2g = geo[c2.id];
            var dx = x1 - cg.x - cg.w / 2, dy = y1 - cg.y;
            void dx; void dy;
            box.add(S('line', {
              x1: cg.x + cg.w / 2, y1: cg.y, x2: c2g.x + c2g.w / 2, y2: c2g.y + c2g.h,
              class: 'vizGrid', 'stroke-dasharray': '5 4'
            }));
          }
        }
      });

      /* ---- 再画类卡 ---- */
      t.nodes.forEach(function (n) {
        var g = geo[n.id];
        var isActive = state.active === n.id;
        var isHit = state.hit === n.id;
        var isPassed = state.passed.indexOf(n.id) >= 0;
        var cls = 'vizNode' + (isActive || isHit ? ' hi' : '');
        var rect = R(g.x, g.y, g.w, g.h, cls, 8);
        if (n.danger && state.compileError) {
          rect.setAttribute('stroke', cssVar('--const-red'));
          rect.setAttribute('stroke-width', '2');
        }
        box.add(rect);
        var title = n.id + (n.parent ? ' extends ' + n.parent + (n.also ? ', ' + n.also : '') : '');
        box.add(T(g.x + 10, g.y + 18, title, 'vizVal', 'start'));
        box.add(L(g.x + 6, g.y + 25, g.x + g.w - 6, g.y + 25, 'vizAxis'));

        var yy = g.y + 40;
        (n.decl || []).forEach(function (d) {
          box.add(T(g.x + 10, yy, d, 'vizLabel', 'start'));
          yy += 14;
        });
        (n.methods || []).forEach(function (m) {
          var hitRow = isHit && !!(m && m.name === state.hitMethod);
          box.add(T(g.x + 10, yy, m.name + '()  → "' + m.out + '"', hitRow ? 'vizPtrText' : 'vizText', 'start'));
          yy += 16;
        });
        inheritedOf(n, map).forEach(function (m) {
          var txt = T(g.x + 10, yy, m.name + '()  ← 继承自 ' + m.from, 'vizLabel', 'start');
          txt.setAttribute('opacity', '0.62');
          box.add(txt);
          yy += 16;
        });

        if (isPassed) {
          box.add(T(g.x + g.w - 8, g.y + 18, '✗ 没有', 'vizLabel', 'end'));
        }
        if (isHit) {
          box.add(T(g.x + g.w - 8, g.y + 18, '✓ 命中', 'vizPtrText', 'end'));
        }
        if (n.danger && state.compileError) {
          box.add(T(g.x + g.w - 8, g.y + 18, '✗ 编译错误', 'vizPtrText', 'end'));
        }
      });

      if (state.compileError) {
        var dg = geo.D;
        box.add(T(dg.x + dg.w + 6, dg.y + dg.h / 2 + 4, '✗', 'vizVal', 'start'));
      }
    }

    function renderCalls() {
      callRow.innerHTML = '';
      var t = tree();
      if (t.isDiamond) {
        button(callRow, '尝试编译 class D', function () {
          state.compileError = true;
          state.active = null;
          state.hit = null;
          state.passed = [];
          renderTree();
          statBox.set([{ label: '结果', value: '编译失败', hot: true }, { label: '错误', value: '多继承' }]);
          noteBox.set('javac 报错：<b>class D cannot extend both B and C</b>（Java 不支持类的多继承）。'
            + '如果只是想要"具备两种能力"，用 <b>接口 + implements</b>，不要用类去继承两个类。', 'COMPILE ERROR');
        }, { icon: 'warning' });
        return;
      }
      (t.calls || []).forEach(function (call) {
        button(callRow, call.label, function () { startCall(call); });
      });
      button(callRow, '重置', function () { resetTree(); }, { icon: 'reset' });
    }

    function startCall(call) {
      var map = byId();
      var path = [];
      var cur = map[call.from];
      var hit = null;
      while (cur) {
        path.push(cur.id);
        if (hasOwnMethod(cur, call.method)) { hit = cur.id; break; }
        cur = cur.parent ? map[cur.parent] : null;
      }
      state.runId += 1;
      var rid = state.runId;
      state.active = null;
      state.passed = [];
      state.hit = null;
      state.hitMethod = null;
      state.compileError = false;
      var i = 0;

      function tick() {
        if (kit.dead() || rid !== state.runId) return;
        if (i >= path.length) {
          state.active = null;
          state.hit = null;
          renderTree();
          statBox.set([
            { label: '查找路径', value: path.join(' → ') },
            { label: '结果', value: '编译错误', hot: true },
            { label: '步数', value: path.length }
          ]);
          noteBox.set('查找失败：<b>' + esc(call.from + '.' + call.method + '()') + '</b> 在整条父类链上都找不到 —— 编译器直接报错 <i>cannot find symbol</i>，根本不会运行。', 'COMPILE ERROR');
          return;
        }
        var id = path[i];
        var node = map[id];
        state.active = id;
        renderTree();
        if (hasOwnMethod(node, call.method)) {
          var m = null;
          (node.methods || []).forEach(function (x) { if (x.name === call.method) m = x; });
          state.hit = id;
          state.hitMethod = call.method;
          state.active = null;
          state.passed = path.slice(0, i);
          renderTree();
          statBox.set([
            { label: '查找路径', value: path.join(' → ') },
            { label: '执行的是', value: id + '.' + call.method + '()', hot: true },
            { label: '步数', value: i + 1 }
          ]);
          noteBox.set((i === 0
            ? '第 1 步：' + id + ' 自己就声明了 <b>' + call.method + '()</b>，直接执行它。'
            : '第 ' + (i + 1) + ' 步：' + path.slice(0, i).join(' 里没有 → ') + ' 里没有 ' + call.method + '()，沿 extends 往上找到 <b>' + id + '</b>，命中！')
            + ' 实际执行的是 <b>' + id + '.' + call.method + '()</b> → 输出 <b>' + esc(m ? m.out : '') + '</b>', 'HIT');
          return;
        }
        noteBox.set('第 ' + (i + 1) + ' 步：<b>' + id + '</b> 自己没声明 ' + call.method + '()'
          + (node.parent ? '，继续往上找 → ' + node.parent : '，也没有父类了'), 'SEARCHING');
        state.passed.push(id);
        i += 1;
        kit.timeout(tick, 780);
      }
      tick();
    }

    function resetTree() {
      state.runId += 1;
      state.active = null;
      state.passed = [];
      state.hit = null;
      state.hitMethod = null;
      state.compileError = false;
      renderTree();
      noteBox.set('已重置。点一个方法调用，看它<b>从实际类型开始、一层层向上</b>找到第一个同名方法。', 'READY');
      statBox.set([{ label: '继承组', value: tree().label }, { label: '状态', value: 'READY' }]);
    }

    function selectTree(id) {
      state.treeId = id;
      Object.keys(treeBtns).forEach(function (k) { treeBtns[k].classList.toggle('on', k === id); });
      code.setLines(tree().code);
      renderCalls();
      resetTree();
    }

    selectTree('animal');
  }

  /* =====================================================================
   * 七、实验台 5 · polymorph —— 多态派发（编译期类型 vs 运行期类型）
   * ===================================================================== */
  var POLY_CLASSES = {
    Animal: { parent: null, methods: { speak: '...（没有声音）', eat: 'Animal eats' } },
    Dog: { parent: 'Animal', methods: { speak: 'Woof!', fetch: 'Dog fetches the ball' } },
    BabyDog: { parent: 'Dog', methods: { speak: 'Yip!' } }
  };
  var POLY_METHODS = ['speak', 'eat', 'fetch'];

  function initPolymorph(root, props, ctx, kit) {
    var state = {
      ref: 'Animal',
      act: 'Dog',
      phase: 'idle',       // idle | compile | runtime | dispatch | error
      method: null,
      hitClass: null,
      runId: 0
    };

    var row1 = ctl(root);
    row1.appendChild(E('span', { class: 'mono dim', text: '引用类型' }));
    selectBox(row1, Object.keys(POLY_CLASSES).map(function (k) { return { value: k, label: k }; }), state.ref, function (v) {
      state.ref = v;
      resetAnim();
    });
    row1.appendChild(E('span', { class: 'mono dim', text: '实际类型' }));
    selectBox(row1, Object.keys(POLY_CLASSES).map(function (k) { return { value: k, label: k }; }), state.act, function (v) {
      state.act = v;
      resetAnim();
    });
    button(row1, '重置', resetAnim, { icon: 'reset' });

    var row2 = ctl(root);
    button(row2, 'Animal a = new Dog();', function () {
      state.ref = 'Animal'; state.act = 'Dog'; resetAnim();
    });
    button(row2, 'Animal a = new BabyDog();', function () {
      state.ref = 'Animal'; state.act = 'BabyDog'; resetAnim();
    });
    button(row2, 'Dog d = new BabyDog();', function () {
      state.ref = 'Dog'; state.act = 'BabyDog'; resetAnim();
    });

    var callRow = ctl(root);
    var callBtns = POLY_METHODS.map(function (m) {
      return button(callRow, 'a.' + m + '()', function () { runCall(m); }, { primary: m === 'speak' });
    });

    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var box = svgBox(stage, 520, 310);

    var cons = consoleBox(root, 'Console · 调用结果');
    var noteBox = note(root);
    var statBox = stats(root);

    function classChain(name) {
      var out = [];
      var c = name;
      while (c) { out.push(c); c = POLY_CLASSES[c].parent; }
      return out;
    }
    function resolveMethod(type, method) {
      var chain = classChain(type);
      for (var i = 0; i < chain.length; i++) {
        if (POLY_CLASSES[chain[i]].methods[method] != null) return chain[i];
      }
      return null;
    }
    function isCompatible(ref, act) { return classChain(act).indexOf(ref) >= 0; }

    function render() {
      box.clear();
      var ref = state.ref;
      var act = state.act;
      var phase = state.phase;
      var compat = isCompatible(ref, act);

      /* ---- 栈上的引用 ---- */
      var stackHi = phase === 'compile' || (phase === 'error' && !compat);
      box.add(R(14, 24, 168, 100, 'vizNode' + (stackHi ? ' hi' : ''), 8));
      box.add(T(24, 44, '栈 · main 帧', 'vizVal', 'start'));
      box.add(T(24, 68, ref + ' a', 'vizText', 'start'));
      box.add(T(24, 88, '编译期只有这个类型', 'vizLabel', 'start'));
      box.add(T(24, 108, 'a = ' + (compat ? 'Dog@1' : '？'), 'vizLabel', 'start'));

      /* ---- 箭头：运行时顺着引用找到对象 ---- */
      var arrowHi = phase === 'runtime' || phase === 'dispatch';
      box.add(arrow(184, 74, 228, 74, 'vizEdge' + (arrowHi ? ' hi' : '')));

      /* ---- 堆上的对象 ---- */
      var objHi = phase === 'runtime' || phase === 'dispatch';
      box.add(R(232, 24, 174, 100, 'vizNode' + (objHi ? ' hi' : ''), 8));
      box.add(T(242, 44, '堆 · new ' + act + '()', 'vizVal', 'start'));
      box.add(T(242, 66, '实际类型：' + act, 'vizText', 'start'));
      box.add(T(242, 86, '对象的方法表指针 → ' + act + ' 类', 'vizLabel', 'start'));
      box.add(T(242, 106, '这一行决定真正执行哪个方法', 'vizLabel', 'start'));

      /* ---- 右侧：当前阶段 ---- */
      var phaseText = phase === 'idle' ? '等待调用'
        : phase === 'compile' ? '① 编译期检查'
          : phase === 'runtime' ? '② 找到实际对象'
            : phase === 'dispatch' ? '③ 方法表派发' : '✗ 编译失败';
      box.add(R(418, 24, 88, 100, 'vizNode', 8));
      box.add(T(428, 46, '阶段', 'vizLabel', 'start'));
      box.add(T(428, 68, phaseText, 'vizVal', 'start'));

      /* ---- 方法表三列 ---- */
      ['Animal', 'Dog', 'BabyDog'].forEach(function (cn, i) {
        var x = 14 + i * 170;
        var w = 160;
        var y = 158;
        var hiCol = phase === 'dispatch' && state.hitClass === cn;
        box.add(R(x, y, w, 110, 'vizNode' + (hiCol ? ' hi' : ''), 8));
        box.add(T(x + 10, y + 18, cn + (POLY_CLASSES[cn].parent ? ' extends ' + POLY_CLASSES[cn].parent : ''), 'vizVal', 'start'));
        box.add(L(x + 6, y + 24, x + w - 6, y + 24, 'vizAxis'));
        var yy = y + 42;
        Object.keys(POLY_CLASSES[cn].methods).forEach(function (mn) {
          var hit = phase === 'dispatch' && state.hitClass === cn && state.method === mn;
          box.add(T(x + 10, yy, mn + '() → ' + POLY_CLASSES[cn].methods[mn], hit ? 'vizPtrText' : 'vizText', 'start'));
          yy += 20;
        });
      });

      /* ---- 底部说明 ---- */
      var msg = '';
      var color = null;
      if (!compat) {
        msg = '✗ 编译错误：不兼容的类型 ' + act + ' 不能赋给 ' + ref + ' 引用';
        color = '--const-red';
      } else if (phase === 'idle') {
        msg = '点上面的 a.speak() / a.eat() / a.fetch() 看派发过程。';
      } else if (phase === 'compile') {
        msg = '① 编译期：只看引用类型 ' + ref + '，里面有没有 ' + state.method + '() ？→ 有，编译通过。';
      } else if (phase === 'runtime') {
        msg = '② 运行期：a 指向的对象的实际类型是 ' + act + '。';
      } else if (phase === 'dispatch') {
        msg = '③ 从 ' + act + ' 的方法表里找到 ' + state.method + '()，实际执行的是 ' + state.hitClass + '.' + state.method + '()。';
      }
      var mt = T(14, 292, msg, 'vizText', 'start');
      if (color) mt.setAttribute('fill', cssVar(color));
      box.add(mt);
    }

    function resetAnim() {
      state.runId += 1;
      state.phase = 'idle';
      state.method = null;
      state.hitClass = null;
      render();
      updateCalls();
      if (!isCompatible(state.ref, state.act)) {
        noteBox.set('类型不兼容：<b>' + esc(state.act) + '</b> 不是 <b>' + esc(state.ref) + '</b> 的子类型，'
          + 'javac 会直接报错（incompatible types）。先把两个类型改成兼容的组合。', 'COMPILE ERROR');
      } else {
        noteBox.set('组合"引用类型 + 实际类型"，再点方法调用。重点看：<b>编译期只认引用类型，运行期只认实际类型</b>。', 'READY');
      }
      statBox.set([
        { label: '编译期类型', value: state.ref },
        { label: '运行期类型', value: state.act, hot: true },
        { label: '状态', value: isCompatible(state.ref, state.act) ? 'READY' : '编译错误' }
      ]);
    }

    function updateCalls() {
      callBtns.forEach(function (b, i) {
        var m = POLY_METHODS[i];
        b.disabled = false;
        var has = classChain(state.ref).some(function (c) { return POLY_CLASSES[c].methods[m] != null; });
        b.classList.toggle('on', false);
        if (!has) b.classList.add('warn');
        else b.classList.remove('warn');
      });
    }

    function runCall(method) {
      var ref = state.ref;
      var act = state.act;
      var rid = (state.runId += 1);
      state.method = method;
      state.hitClass = null;
      state.phase = 'compile';

      if (!isCompatible(ref, act)) {
        state.phase = 'error';
        render();
        noteBox.set('编译都过不了：<b>' + act + '</b> 不是 <b>' + ref + '</b> 的子类型，先把两个类型改成兼容的组合。', 'COMPILE ERROR');
        return;
      }
      var compileOk = classChain(ref).some(function (c) { return POLY_CLASSES[c].methods[method] != null; });
      render();
      updateCalls();
      noteBox.set('① <b>编译期</b>：编译器只检查引用类型 <b>' + ref + '</b> —— 它在自己的父类链上找 ' + method + '()。', 'COMPILE');
      if (!compileOk) {
        state.phase = 'error';
        render();
        statBox.set([
          { label: '编译期类型', value: ref },
          { label: '运行期类型', value: act },
          { label: '结果', value: 'cannot find symbol', hot: true }
        ]);
        noteBox.set('编译错误：<b>' + ref + '</b> 的父类链上没有 <b>' + method + '()</b>，所以 a.' + method + '() 这一行<b>编译不过</b>。'
          + '要调用子类独有的方法，必须先把引用类型改成 ' + act + '。', 'COMPILE ERROR');
        return;
      }
      kit.timeout(function () {
        if (kit.dead() || rid !== state.runId) return;
        state.phase = 'runtime';
        render();
        noteBox.set('② <b>运行期</b>：顺着 a 找到堆上的对象，它的真实类型是 <b>' + act + '</b>。', 'RUNTIME');
        kit.timeout(function () {
          if (kit.dead() || rid !== state.runId) return;
          var hit = resolveMethod(act, method);
          state.phase = 'dispatch';
          state.hitClass = hit;
          render();
          var out = hit ? POLY_CLASSES[hit].methods[method] : '(无)';
          cons.log('a.' + method + '()   →   "' + out + '"   （实际执行 ' + (hit || '?') + '.' + method + '()）');
          statBox.set([
            { label: '编译期类型', value: ref },
            { label: '运行期类型', value: act, hot: true },
            { label: '实际执行', value: (hit || '?') + '.' + method + '()' },
            { label: '输出', value: '"' + out + '"' }
          ]);
          noteBox.set('③ <b>方法表派发</b>：从实际类型 <b>' + act + '</b> 开始找，命中 <b>' + (hit || '?') + '.' + method + '()</b>。'
            + ' 就算引用类型是 ' + ref + '，真正执行的也是子类覆盖后的版本。', 'DISPATCH');
        }, 760);
      }, 760);
    }

    render();
    resetAnim();
  }

  /* =====================================================================
   * 八、实验台 6 · lambda —— 匿名内部类 ↔ Lambda ↔ 方法引用
   * ===================================================================== */
  var LAMBDA_IFACES = {
    runnable: {
      label: 'Runnable（无参、无返回）',
      iface: 'interface Runnable { void run(); }   // 只有一个抽象方法 → 函数式接口',
      anon: [
        'Runnable task = new Runnable() {',
        '    @Override',
        '    public void run() {',
        '        System.out.println("Hello from a thread!");',
        '    }',
        '};',
        'new Thread(task).start();'
      ],
      lambda: [
        'Runnable task = () -> {',
        '    System.out.println("Hello from a thread!");',
        '};',
        'new Thread(task).start();'
      ],
      ref: [
        '// 方法引用：直接指向一个"形状匹配"的已有方法',
        'Runnable task = Main::sayHello;',
        'new Thread(task).start();',
        '',
        'static void sayHello() {',
        '    System.out.println("Hello from a thread!");',
        '}'
      ],
      output: 'Hello from a thread!',
      why: 'Runnable 的抽象方法 run() 没有参数、没有返回值，所以 lambda 写成 () -> { ... }；Main::sayHello 指向一个无参 static void 方法，形状完全一致。'
    },
    handler: {
      label: 'EventHandler<ActionEvent>（一个参数）',
      iface: 'interface EventHandler<T> { void handle(T event); }   // JavaFX 里按钮点击用这个',
      anon: [
        'button.setOnAction(new EventHandler<ActionEvent>() {',
        '    @Override',
        '    public void handle(ActionEvent e) {',
        '        System.out.println("Button clicked!");',
        '    }',
        '});'
      ],
      lambda: [
        'button.setOnAction(e -> System.out.println("Button clicked!"));',
        '',
        '// 需要多行也可以：',
        '// button.setOnAction(e -> {',
        '//     System.out.println("Button clicked!");',
        '// });'
      ],
      ref: [
        '// 方法引用：this::handleClick',
        'button.setOnAction(this::handleClick);',
        '',
        'private void handleClick(ActionEvent e) {',
        '    System.out.println("Button clicked!");',
        '}'
      ],
      output: 'Button clicked!',
      why: 'handle(T event) 有一个参数，lambda 就写 e -> ...；参数类型可以省略，编译器从目标类型 EventHandler<ActionEvent> 推出来。'
    },
    comparator: {
      label: 'Comparator<Student>（两个参数、有返回值）',
      iface: 'interface Comparator<T> { int compare(T o1, T o2); }',
      anon: [
        'students.sort(new Comparator<Student>() {',
        '    @Override',
        '    public int compare(Student a, Student b) {',
        '        return a.getScore() - b.getScore();',
        '    }',
        '});'
      ],
      lambda: [
        'students.sort((a, b) -> a.getScore() - b.getScore());',
        '',
        '// 表达式 lambda：单个表达式，自动作为返回值，不写 return 和 ;'
      ],
      ref: [
        '// 方法引用：Student::compareByScore',
        'students.sort(Student::compareByScore);',
        '',
        'static int compareByScore(Student a, Student b) {',
        '    return a.getScore() - b.getScore();',
        '}'
      ],
      output: '排序完成：[72, 85, 90]',
      why: 'compare(T, T) 有两个参数、返回 int，所以 lambda 写成 (a, b) -> a.getScore() - b.getScore()；方法引用的形状是 (Student, Student) -> int。'
    }
  };

  function initLambda(root, props, ctx, kit) {
    var state = { iface: 'runnable', runId: 0 };

    var ifaceRow = ctl(root);
    var ifaceBtns = {};
    Object.keys(LAMBDA_IFACES).forEach(function (k) {
      ifaceBtns[k] = button(ifaceRow, LAMBDA_IFACES[k].label, function () { selectIface(k); });
    });

    var ifaceNote = E('div', { class: 'labNote' });
    root.appendChild(ifaceNote);

    var grid = E('div', { class: 'gridBlock c3' });
    var cols = [
      { key: 'anon', title: '① 匿名内部类' },
      { key: 'lambda', title: '② Lambda 表达式' },
      { key: 'ref', title: '③ 方法引用' }
    ].map(function (meta) {
      var host = E('div');
      grid.appendChild(host);
      panelTitle(host, meta.title);
      var code = codePanel(host, [], meta.title.replace(/^[①②③]\s*/, ''));
      return { meta: meta, code: code };
    });
    root.appendChild(grid);

    var actRow = ctl(root);
    var runBtn = button(actRow, '运行心智模型', function () { runAll(); }, { icon: 'play', primary: true });
    var resetBtn = button(actRow, '重置', function () { resetAll(); }, { icon: 'reset' });

    var cons = consoleBox(root, 'Console · 三种写法输出对比');
    var noteBox = note(root);
    var statBox = stats(root);

    function iface() { return LAMBDA_IFACES[state.iface]; }

    function selectIface(id) {
      state.iface = id;
      Object.keys(ifaceBtns).forEach(function (k) { ifaceBtns[k].classList.toggle('on', k === id); });
      var it = iface();
      ifaceNote.innerHTML = '<span>目标类型：<b>' + esc(it.iface) + '</b><br>'
        + '函数式接口 = <b>只有一个抽象方法</b>的接口。三栏是同一个接口实现的三种写法，形状必须和抽象方法对得上。</span>';
      cols[0].code.setLines(it.anon);
      cols[1].code.setLines(it.lambda);
      cols[2].code.setLines(it.ref);
      resetAll();
    }

    function runAll() {
      var rid = (state.runId += 1);
      var it = iface();
      var steps = [
        { label: '① 匿名内部类', note: '匿名类 new Runnable(){...}：编译后生成一个独立类，代码最多。' },
        { label: '② Lambda 表达式', note: 'lambda 是"语法糖"：编译器帮你生成同样的接口实现，少写样板代码。' },
        { label: '③ 方法引用', note: '方法引用不是新能力：只是把已有方法的引用当成接口实现。' }
      ];
      cons.clear();
      runBtn.disabled = true;
      var i = 0;
      function tick() {
        if (kit.dead() || rid !== state.runId) { runBtn.disabled = false; return; }
        if (i >= steps.length) {
          runBtn.disabled = false;
          noteBox.set('<b>三者语义完全等价</b>，输出一模一样：都是给 ' + esc(it.iface.split('//')[0].trim())
            + ' 的唯一抽象方法提供实现。' + it.why, 'EQUIVALENT');
          statBox.set([
            { label: '接口', value: it.label },
            { label: '抽象方法数', value: '1' },
            { label: '输出', value: '"' + it.output + '"', hot: true }
          ]);
          return;
        }
        cons.log(steps[i].label + '  →  ' + it.output);
        noteBox.set(steps[i].note, 'STEP ' + (i + 1) + ' / 3');
        i += 1;
        kit.timeout(tick, 680);
      }
      tick();
    }

    function resetAll() {
      state.runId += 1;
      cons.clear();
      runBtn.disabled = false;
      noteBox.set('选一个函数式接口，然后点「运行心智模型」：三栏会依次执行，输出完全一样。注意 <b>lambda 的参数个数必须匹配抽象方法</b>。', 'READY');
      statBox.set([
        { label: '接口', value: iface().label },
        { label: '状态', value: 'READY' }
      ]);
    }

    selectIface('runnable');
  }

  /* =====================================================================
   * 九、实验台 7 · streams —— I/O 流包装链（字节 → 字符 → 行缓冲）
   * ===================================================================== */
  var STREAM_OUT_CODE = [
    '// 客户端：把一行文字发给服务器',
    'OutputStream os = socket.getOutputStream();              // ① 字节流',
    'OutputStreamWriter writer = new OutputStreamWriter(os);  // ② 字节 → 字符',
    'BufferedWriter bw = new BufferedWriter(writer);          // ③ 加行缓冲',
    '',
    'bw.write("Hello");          // 只写进缓冲区，还没出门',
    'bw.newLine();               // 行结束符 \\n',
    'bw.flush();                 // 真正推出去：字符 → 字节 → socket'
  ];
  var STREAM_IN_CODE = [
    '// 服务器：从 socket 读一行',
    'InputStream is = socket.getInputStream();                // ① 字节流',
    'InputStreamReader reader = new InputStreamReader(is);    // ② 字节 → 字符',
    'BufferedReader br = new BufferedReader(reader);          // ③ 加行缓冲',
    '',
    'String line = br.readLine();  // 攒到 \\n 才返回一行（不含 \\n）',
    'System.out.println("收到: " + line);'
  ];

  function utf8Bytes(str) {
    var out = [];
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }

  function initStreams(root, props, ctx, kit) {
    var state = {
      dir: 'out',        // out | in
      text: 'Hello',
      buf: [],           // 缓冲区里的字符
      pushed: [],        // 已写出 / 已收到的字节
      line: null,        // 读出来的一行
      phase: 'idle',
      anim: 0
    };

    var dirRow = ctl(root);
    var dirBtns = {};
    dirBtns.out = button(dirRow, '输出方向（写）', function () { setDir('out'); });
    dirBtns.in = button(dirRow, '输入方向（读）', function () { setDir('in'); });

    var text = textInput(dirRow, {
      value: state.text, maxlength: 18,
      onInput: function (v) { state.text = v; }
    });
    void text;

    var actRow = ctl(root);
    var writeBtn = button(actRow, 'write("Hello")', function () { doWrite(); }, { icon: 'code', primary: true });
    var flushBtn = button(actRow, 'flush()', function () { doFlush(); }, { icon: 'zap' });
    var readBtn = button(actRow, 'readLine()', function () { doRead(); }, { icon: 'list' });
    var resetBtn = button(actRow, '重置', function () { resetAll(); }, { icon: 'reset' });

    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var box = svgBox(stage, 540, 160);

    var packetLayer = null;  // 数据包所在层（0..4），用于动画

    var dataBox = E('div', { class: 'memHeap' });
    root.appendChild(dataBox);

    var codeTitle = panelTitle(root, '对应的 Java 代码');
    codeTitle.className = 'memColT';
    var code = codePanel(root, STREAM_OUT_CODE, 'Client.java');

    var noteBox = note(root);
    var statBox = stats(root);

    function layers() {
      return state.dir === 'out'
        ? [
          { name: 'String', sub: '你的字符串' },
          { name: 'BufferedWriter', sub: '缓冲区（攒行）' },
          { name: 'OutputStreamWriter', sub: '字符 → 字节' },
          { name: 'OutputStream', sub: 'socket 字节流' },
          { name: 'socket', sub: '网络' }
        ]
        : [
          { name: 'socket', sub: '网络' },
          { name: 'InputStream', sub: 'socket 字节流' },
          { name: 'InputStreamReader', sub: '字节 → 字符' },
          { name: 'BufferedReader', sub: '行缓冲' },
          { name: 'String', sub: 'readLine() 的返回值' }
        ];
    }

    function layerData(i) {
      if (state.dir === 'out') {
        if (i === 0) return state.phase === 'idle' ? '""' : '"' + state.buf.join('') + '"';
        if (i === 1) return state.buf.length ? state.buf.length + ' 个字符待 flush' : '（空）';
        if (i === 2) return state.pushed.length ? state.pushed.length + ' 个字符 → 字节' : '（空）';
        if (i === 3) return state.pushed.length ? state.pushed.join(' ') : '（空）';
        return state.pushed.length ? '已收到 ' + state.pushed.length + ' 字节' : '（空）';
      }
      if (i === 0) return state.pushed.length ? state.pushed.length + ' 字节到达' : '（空）';
      if (i === 1) return state.pushed.length ? state.pushed.join(' ') : '（空）';
      if (i === 2) return state.pushed.length ? '解码为 ' + state.pushed.length + ' 个字符' : '（空）';
      if (i === 3) return state.line != null ? '"' + state.line + '"（已凑够一行）' : (state.pushed.length ? '还没遇到 \\n' : '（空）');
      return state.line != null ? '"' + state.line + '"' : '（null）';
    }

    function render() {
      box.clear();
      var ls = layers();
      var w = 96, gap = 12, x0 = 10;
      var y = 20;
      ls.forEach(function (l, i) {
        var x = x0 + i * (w + gap);
        var hi = packetLayer === i || (packetLayer == null && i === activeLayer());
        box.add(R(x, y, w, 52, 'vizNode' + (hi ? ' hi' : ''), 8));
        box.add(T(x + w / 2, y + 22, l.name.length > 14 ? l.name.slice(0, 13) + '…' : l.name, 'vizVal', 'middle'));
        box.add(T(x + w / 2, y + 40, l.sub, 'vizLabel', 'middle'));
        box.add(T(x + w / 2, y + 70, layerData(i), 'vizText', 'middle'));
        if (i < ls.length - 1) {
          box.add(arrow(x + w + 1, y + 26, x + w + gap - 1, y + 26, 'vizEdge'));
        }
      });
      /* 包装关系：外层的流包着内层 */
      if (state.dir === 'out') {
        box.add(T(10, 140, '包装关系：BufferedWriter( OutputStreamWriter( socket.getOutputStream() ) )', 'vizLabel', 'start'));
      } else {
        box.add(T(10, 140, '包装关系：BufferedReader( InputStreamReader( socket.getInputStream() ) )', 'vizLabel', 'start'));
      }
      renderData();
      renderNote();
      statBox.set([
        { label: '方向', value: state.dir === 'out' ? 'OUT 写' : 'IN 读' },
        { label: '缓冲区', value: state.buf.length + ' 字符' },
        { label: 'socket 字节', value: state.pushed.length },
        { label: '状态', value: state.phase.toUpperCase(), hot: true }
      ]);
    }

    function activeLayer() {
      if (state.dir === 'out') {
        if (state.phase === 'idle') return 0;
        if (state.phase === 'buffered') return 1;
        if (state.phase === 'flushed') return 4;
        return 1;
      }
      if (state.phase === 'received') return 0;
      if (state.phase === 'decoded') return 2;
      if (state.phase === 'read') return 4;
      return 0;
    }

    function renderData() {
      dataBox.innerHTML = '';
      if (state.dir === 'out') {
        dataBox.appendChild(dataCard('① BufferedWriter 的缓冲区（字符）', state.buf.length
          ? state.buf.map(function (ch) { return ch === '\n' ? '\\n' : ch; }).join(' · ')
          : '（空）'));
        dataBox.appendChild(dataCard('② OutputStreamWriter 编码结果（UTF-8 字节）', state.pushed.length ? state.pushed.join(' ') : '（空）'));
        dataBox.appendChild(dataCard('③ socket 实际写出的内容', state.pushed.length ? '"' + state.text + '\\n" 共 ' + state.pushed.length + ' 字节' : '（还没 flush，socket 什么都没收到）'));
      } else {
        dataBox.appendChild(dataCard('① socket 收到的字节（UTF-8）', state.pushed.length ? state.pushed.join(' ') : '（空）'));
        dataBox.appendChild(dataCard('② InputStreamReader 解码出的字符', state.pushed.length ? state.pushed.map(function (b) { return b >= 32 && b < 127 ? String.fromCharCode(b) : (b === 10 ? '\\n' : '?'); }).join(' ') : '（空）'));
        dataBox.appendChild(dataCard('③ BufferedReader.readLine() 返回值', state.line != null ? '"' + state.line + '"' : 'null'));
      }
    }

    function dataCard(title, value) {
      var obj = E('div', { class: 'memObj' });
      obj.appendChild(E('div', { class: 'memObjH', text: title }));
      var body = E('div', { class: 'memFields' });
      var row = E('div', { class: 'memField' });
      row.appendChild(E('span', { class: 'fn2', text: value }));
      body.appendChild(row);
      obj.appendChild(body);
      return obj;
    }

    function renderNote() {
      var msgs = {
        out: {
          idle: '输入一行文字，点 <b>write()</b>：字符先进入 BufferedWriter 缓冲区，还<b>没有</b>真正发出去。',
          buffered: '数据已经在缓冲区里（<b>' + state.buf.length + '</b> 个字符），socket 还什么都没收到 —— 这就是不 flush 的后果。',
          flushed: '<b>flush()</b> 之后：字符被 OutputStreamWriter 编码成字节，OutputStream 写进 socket，缓冲区清空。'
        },
        in: {
          idle: '点 <b>readLine()</b>：从 socket 读字节 → InputStreamReader 解码成字符 → BufferedReader 攒到换行符才返回一行。',
          received: 'socket 收到 <b>' + state.pushed.length + '</b> 个字节（UTF-8 编码）。',
          decoded: 'InputStreamReader 已经把字节解码成字符，BufferedReader 正在找 <b>\\n</b>。',
          read: '读到换行符：readLine() 返回 <b>"' + (state.line || '') + '"</b>（不含 \\n）。'
        }
      };
      var group = msgs[state.dir] || msgs.out;
      noteBox.set(group[state.phase] || group.idle, state.phase.toUpperCase());
    }

    function animatePacket(ms, fromLayer, toLayer, done) {
      var rid = (state.anim += 1);
      var w = 96, gap = 12, x0 = 10;
      tween(kit, ms, function (t) {
        if (rid !== state.anim) return;
        var p = fromLayer + (toLayer - fromLayer) * t;
        packetLayer = Math.max(0, Math.round(p));
        render();
        var lo = Math.min(4, Math.floor(p));
        var hi = Math.min(4, lo + 1);
        var f = p - Math.floor(p);
        var ax = x0 + lo * (w + gap) + w / 2;
        var bx = x0 + hi * (w + gap) + w / 2;
        box.add(C(ax + (bx - ax) * (lo === hi ? 0 : f), 100, 5, 'vizBar hi'));
      }, function () {
        if (rid !== state.anim) return;
        packetLayer = toLayer;
        render();
        kit.timeout(function () {
          if (rid !== state.anim) return;
          packetLayer = null;
          render();
          if (done) done();
        }, 260);
      });
    }

    function doWrite() {
      if (state.dir !== 'out') { noteBox.set('先切到「输出方向（写）」。', 'DIR'); return; }
      var t = state.text || 'Hello';
      state.buf = (t + '\n').split('');
      state.pushed = [];
      state.line = null;
      state.phase = 'buffered';
      render();
      animatePacket(520, 0, 1);
      noteBox.set('write() 只是把"' + esc(t) + '\\n"放进 BufferedWriter 的缓冲区。缓冲区默认 8192 字符，没满就不会自己发出去。', 'BUFFERED');
    }

    function doFlush() {
      if (state.dir !== 'out') { noteBox.set('先切到「输出方向（写）」。', 'DIR'); return; }
      if (!state.buf.length && !state.pushed.length) { doWrite(); return; }
      var text = state.buf.join('');
      var bytes = utf8Bytes(text);
      state.buf = [];
      state.pushed = bytes;
      state.phase = 'flushed';
      render();
      animatePacket(720, 1, 4);
      noteBox.set('<b>flush()</b>：' + esc(text.replace('\n', '\\n')) + ' 被编码成 <b>' + bytes.length + '</b> 个 UTF-8 字节，真正写进 socket，缓冲区清空。', 'FLUSHED');
    }

    function doRead() {
      if (state.dir !== 'in') { noteBox.set('先切到「输入方向（读）」。', 'DIR'); return; }
      if (state.line != null) { noteBox.set('已经读到一行了。点「重置」可以再来一次。', 'READ'); return; }
      if (!state.pushed.length) {
        var t = state.text || 'Hello';
        state.pushed = utf8Bytes(t + '\n');
        state.phase = 'received';
        render();
        noteBox.set('假设 socket 已收到 <b>' + state.pushed.length + '</b> 个字节（' + esc(t) + ' + \\n 的 UTF-8 编码）。再点一次 readLine() 进行解码。', 'RECEIVED');
        return;
      }
      state.phase = 'decoded';
      render();
      kit.timeout(function () {
        if (kit.dead()) return;
        var chars = [];
        state.pushed.forEach(function (b) { chars.push(b >= 32 && b < 127 ? String.fromCharCode(b) : (b === 10 ? '\n' : '')); });
        var joined = chars.join('');
        var idx = joined.indexOf('\n');
        state.line = idx >= 0 ? joined.slice(0, idx) : joined;
        state.phase = 'read';
        render();
        noteBox.set('readLine() 在缓冲区里遇到 <b>\\n</b> 才返回：拿到 <b>"' + esc(state.line) + '"</b>，\\n 被丢弃。', 'READLINE');
      }, 620);
    }

    function resetAll() {
      state.anim += 1;
      state.buf = [];
      state.pushed = [];
      state.line = null;
      state.phase = 'idle';
      packetLayer = null;
      render();
      noteBox.set(state.dir === 'out'
        ? '点 <b>write()</b> 写一行，再点 <b>flush()</b> 把它真正发出去。'
        : '点 <b>readLine()</b>：先模拟收到字节，再解码、凑行。', 'READY');
    }

    function setDir(dir) {
      state.dir = dir;
      dirBtns.out.classList.toggle('on', dir === 'out');
      dirBtns.in.classList.toggle('on', dir === 'in');
      writeBtn.disabled = dir !== 'out';
      flushBtn.disabled = dir !== 'out';
      readBtn.disabled = dir !== 'in';
      code.setLines(dir === 'out' ? STREAM_OUT_CODE : STREAM_IN_CODE);
      resetAll();
    }

    setDir('out');
  }

  /* =====================================================================
   * 十、实验台 8 · socket —— 连接时序与消息往返
   * ===================================================================== */
  var SOCK_SERVER_CODE = [
    'public class Server {',
    '    public static void main(String[] args) throws IOException {',
    '        ServerSocket serverSocket = new ServerSocket(1004);',
    '        while (!serverSocket.isClosed()) {',
    '            Socket socket = serverSocket.accept();   // 阻塞，直到有客户端连上',
    '            ClientHandler handler = new ClientHandler(socket);',
    '            new Thread(handler).start();             // 每个客户端一条子线程',
    '        }',
    '    }',
    '}'
  ];
  var SOCK_CLIENT_CODE = [
    'public class Client {',
    '    public static void main(String[] args) throws IOException {',
    '        Socket socket = new Socket("127.0.0.1", 1004);   // 连服务器',
    '        BufferedWriter out = new BufferedWriter(',
    '                new OutputStreamWriter(socket.getOutputStream()));',
    '        out.write("Hello");',
    '        out.newLine();',
    '        out.flush();      // 不 flush 数据可能走不出去',
    '    }',
    '}'
  ];

  function initSocket(root, props, ctx, kit) {
    var state = {
      serverStarted: false,
      accepted: false,
      conn2: false,
      closed: false,
      queue: 0,
      packet: null,
      anim: 0,
      msgCount: 0
    };

    var row1 = ctl(root);
    var startBtn = button(row1, '启动服务端', function () { startServer(); }, { icon: 'cpu', primary: true });
    var connectBtn = button(row1, '客户端 connect()', function () { connectClient(); }, { icon: 'arrow-right' });
    var acceptBtn = button(row1, '服务端 accept() 取下一个', function () { acceptNext(); });
    var closeBtn = button(row1, 'close() 断开', function () { closeAll(); }, { icon: 'x' });
    var resetBtn = button(row1, '重置', function () { resetAll(); }, { icon: 'reset' });

    var row2 = ctl(root);
    var msgInput = textInput(row2, { value: 'Hello', maxlength: 30, placeholder: '要发送的一行文本' });
    var sendBtn = button(row2, '客户端发送', function () { sendClient(); }, { icon: 'arrow-right' });
    var replyBtn = button(row2, '服务端回复', function () { sendServer(); }, { icon: 'arrow-left' });
    var extraBtn = button(row2, '再连一个客户端（排队演示）', function () { connectSecond(); });

    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var box = svgBox(stage, 580, 300);

    var cons = consoleBox(root, 'Console · 两个 JVM 的日志');

    var codeGrid = E('div', { class: 'gridBlock c2' });
    root.appendChild(codeGrid);
    var serverCodeHost = E('div');
    var clientCodeHost = E('div');
    codeGrid.appendChild(serverCodeHost);
    codeGrid.appendChild(clientCodeHost);
    panelTitle(serverCodeHost, 'Server.java（先启动）');
    var serverCode = codePanel(serverCodeHost, SOCK_SERVER_CODE, 'Server.java');
    panelTitle(clientCodeHost, 'Client.java（后连接）');
    var clientCode = codePanel(clientCodeHost, SOCK_CLIENT_CODE, 'Client.java');

    var noteBox = note(root);
    var statBox = stats(root);

    function log(text) { cons.log(text); }

    function drawBox(x, y, w, title, lines, hi) {
      box.add(R(x, y, w, 210, 'vizNode' + (hi ? ' hi' : ''), 8));
      box.add(T(x + 10, y + 20, title, 'vizVal', 'start'));
      box.add(L(x + 6, y + 26, x + w - 6, y + 26, 'vizAxis'));
      var yy = y + 44;
      lines.forEach(function (ln) {
        if (ln.strong) {
          var tt = T(x + 10, yy, ln.text, 'vizText', 'start');
          if (ln.color) tt.setAttribute('fill', cssVar(ln.color));
          box.add(tt);
        } else if (ln.mono) {
          box.add(T(x + 10, yy, ln.text, 'vizLabel', 'start'));
        } else {
          box.add(T(x + 10, yy, ln.text, 'vizLabel', 'start'));
        }
        yy += 18;
      });
    }

    function render() {
      box.clear();
      /* ---- Client 盒 ---- */
      var clientLines = [
        { text: state.clientSocket ? 'Socket@client 已创建' : '未创建 Socket', strong: true, color: state.clientSocket ? '--ok' : '--text3' },
        { text: state.clientSocket ? 'new Socket("127.0.0.1", 1004)' : 'new Socket("127.0.0.1", 1004)' },
        { text: '本端端口：' + (state.clientSocket ? '54321' : '—') },
        { text: '对端：127.0.0.1:1004' },
        { text: '' },
        { text: 'isConnected() = ' + (state.clientSocket && !state.closed ? 'true' : 'false'), strong: true, color: state.clientSocket && !state.closed ? '--ok' : '--const-red' }
      ];
      drawBox(16, 26, 176, 'Client（你的 JVM）', clientLines, !!state.clientSocket && !state.closed);

      /* ---- Server 盒 ---- */
      var serverLines = [
        { text: state.serverStarted ? 'ServerSocket(1004) 已绑定' : '还没启动', strong: true, color: state.serverStarted ? '--ok' : '--text3' },
        { text: 'accept() → ' + (!state.serverStarted ? '（服务端未启动）' : (state.accepted || state.conn2 ? '返回了 Socket' : '阻塞中…')), strong: true, color: state.serverStarted && !(state.accepted || state.conn2) ? '--const-orange' : '--ok' },
        { text: '已服务客户端：' + (state.conn2 ? '2' : state.accepted ? '1' : '0') },
        { text: 'backlog 队列：' + state.queue + ' 个连接等待' },
        { text: '' },
        { text: 'isClosed() = ' + (!state.serverStarted || state.closed ? 'true' : 'false'), strong: true, color: !state.serverStarted || state.closed ? '--const-red' : '--ok' }
      ];
      drawBox(388, 26, 176, 'Server（另一个 JVM）', serverLines, !!state.accepted && !state.closed);

      /* ---- 网络通道 ---- */
      box.add(L(196, 100, 388, 100, 'vizGrid'));
      box.add(L(388, 140, 196, 140, 'vizGrid'));
      box.add(T(292, 92, '→ 客户端到服务端（字节流）', 'vizLabel', 'middle'));
      box.add(T(292, 156, '← 服务端到客户端', 'vizLabel', 'middle'));
      if (state.closed) {
        box.add(T(292, 122, '✕ 连接已关闭', 'vizPtrText', 'middle'));
      } else if (state.packet) {
        box.add(C(state.packet.x, state.packet.y, 6, 'vizBar hi'));
      } else if (state.accepted) {
        box.add(T(292, 122, '连接已建立（TCP）', 'vizLabel', 'middle'));
      } else if (state.serverStarted) {
        box.add(T(292, 122, '等待连接…', 'vizLabel', 'middle'));
      }

      /* ---- 排队示意 ---- */
      if (state.queue > 0) {
        box.add(R(430, 246, 130, 22, 'vizNode', 4));
        box.add(T(440, 261, 'backlog：' + state.queue + ' 个 SYN 在排队', 'vizPtrText', 'start'));
      }

      statBox.set([
        { label: '端口', value: '1004' },
        { label: 'ServerSocket', value: state.serverStarted ? (state.closed ? 'closed' : 'bound') : '—', hot: true },
        { label: '已建立连接', value: (state.accepted ? 1 : 0) + (state.conn2 ? 1 : 0) },
        { label: '消息数', value: state.msgCount }
      ]);
    }

    function fly(from, to, ms, done) {
      var rid = (state.anim += 1);
      tween(kit, ms, function (t) {
        if (rid !== state.anim) return;
        state.packet = { x: from[0] + (to[0] - from[0]) * t, y: from[1] + (to[1] - from[1]) * t };
        render();
      }, function () {
        if (rid !== state.anim) return;
        state.packet = null;
        render();
        if (done) done();
      });
    }

    function startServer() {
      if (state.serverStarted) { noteBox.set('服务端已经在跑了：ServerSocket 绑定 1004，accept() 正在阻塞。', 'SERVER'); return; }
      state.serverStarted = true;
      state.closed = false;
      log('[Server] new ServerSocket(1004) —— 绑定端口 1004 成功');
      log('[Server] 进入 while 循环，调用 accept() … 主线程在这里阻塞');
      serverCode.mark([], 5);
      render();
      noteBox.set('服务端主线程停在 <b>accept()</b>：它不占 CPU，只是等。这时客户端去 connect，accept() 才会返回。', 'LISTENING');
    }

    function connectClient() {
      if (!state.serverStarted || state.closed) {
        log('[Client] 连接失败：Connection refused。端口 1004 没有程序在监听。');
        noteBox.set('连接失败：<b>ConnectException: Connection refused</b>。客户端要知道服务器的 IP 和端口，而服务器必须<b>先</b>启动并监听。', 'ERROR');
        return;
      }
      if (state.accepted) { noteBox.set('第一个客户端已经连上了。想演示排队，用「再连一个客户端」。', 'CONNECTED'); return; }
      clientCode.mark([], 3);
      var seq = [
        { from: [196, 100], to: [388, 100], log: '[Client] 发出 SYN（我想连你的 1004 端口）' },
        { from: [388, 140], to: [196, 140], log: '[Server] 回复 SYN + ACK（端口在，来吧）' },
        { from: [196, 100], to: [388, 100], log: '[Client] 回复 ACK —— 三次握手完成' }
      ];
      var i = 0;
      function next() {
        if (i >= seq.length) {
          state.accepted = true;
          log('[Server] accept() 返回一个 Socket 对象，代表这条新连接');
          log('[Server] 对应关系：client 54321 ↔ server 1004（同一个连接的两端）');
          log('[Client] new Socket(...) 返回，连接可用');
          serverCode.mark([], 5);
          render();
          noteBox.set('连接建立：双方各有一个 Socket 对象。<b>accept() 返回的那一刻</b>，服务器才知道"有人连进来了"。', 'ACCEPTED');
          return;
        }
        log(seq[i].log);
        fly(seq[i].from, seq[i].to, 440, function () {
          i += 1;
          kit.timeout(next, 120);
        });
      }
      noteBox.set('三次握手正在进行：SYN → SYN+ACK → ACK。握手由操作系统内核完成，accept() 只是把完成的连接交给你。', 'HANDSHAKE');
      next();
    }

    function sendClient() {
      if (!state.accepted || state.closed) { noteBox.set('还没建立连接，发送不了。先启动服务端，再点 connect()。', 'NOT CONNECTED'); return; }
      var msg = (msgInput.value || 'Hello');
      log('[Client] out.write("' + msg + '") + flush() → 数据进入网络');
      fly([196, 100], [388, 100], 420, function () {
        state.msgCount += 1;
        log('[Server] ClientHandler 子线程 readLine() 收到："' + msg + '"');
        render();
        noteBox.set('消息到达服务端：它的 ClientHandler 子线程在 <b>readLine()</b> 上被唤醒。服务器可以继续用同一个 Socket 回复。', 'MESSAGE');
      });
    }

    function sendServer() {
      if (!state.accepted || state.closed) { noteBox.set('还没建立连接，没法回复。', 'NOT CONNECTED'); return; }
      log('[Server] 向这个 Socket 写回一行');
      fly([388, 140], [196, 140], 420, function () {
        state.msgCount += 1;
        log('[Client] 客户端读线程收到服务器回复');
        render();
        noteBox.set('同一条 TCP 连接是<b>双向</b>的：两个方向各有一个流（输入 / 输出），可以同时收发。', 'REPLY');
      });
    }

    function connectSecond() {
      if (!state.accepted || state.closed) { noteBox.set('先让第一个客户端连上，再演示第二个。', 'NOT CONNECTED'); return; }
      if (state.conn2) { noteBox.set('第二个客户端已经接上来了。', 'CONNECTED'); return; }
      state.queue += 1;
      log('[Server] 第二个客户端的 SYN 到了，内核放进 backlog 队列');
      log('[Server] 但主线程刚才 accept() 已经返回、正在处理第一个连接，还没回到 accept()');
      render();
      noteBox.set('第二个连接在 <b>backlog 队列</b>里排队。真实聊天室的写法是 <b>while 循环里反复 accept()</b>，并且每个连接开一条子线程 —— 这样才不会卡住。', 'BACKLOG');
    }

    function acceptNext() {
      if (state.queue <= 0) { noteBox.set('队列里没有排队的连接。先点「再连一个客户端」。', 'QUEUE EMPTY'); return; }
      state.queue -= 1;
      state.conn2 = true;
      log('[Server] 主循环再次 accept() → 返回第二个 Socket');
      log('[Server] new Thread(new ClientHandler(socket)).start() —— 两条子线程各自服务一个客户端');
      render();
      noteBox.set('第二个连接被接受了。<b>accept() 一次只返回一个连接</b>，所以要循环调用，每个客户端配一条 ClientHandler 线程。', 'ACCEPTED 2');
    }

    function closeAll() {
      if (!state.serverStarted) { noteBox.set('服务端还没启动。', 'NOT STARTED'); return; }
      state.closed = true;
      state.accepted = false;
      state.conn2 = false;
      state.queue = 0;
      log('[Client] socket.close()');
      log('[Server] socket.isConnected() → false，ClientHandler 循环退出');
      render();
      noteBox.set('连接关闭：客户端和服务端各自的 Socket 都要 close。服务器 <b>accept() 循环</b>会继续等下一个客户端。', 'CLOSED');
    }

    function resetAll() {
      state.anim += 1;
      state.serverStarted = false;
      state.accepted = false;
      state.conn2 = false;
      state.closed = false;
      state.queue = 0;
      state.packet = null;
      state.msgCount = 0;
      cons.clear();
      serverCode.mark([], 0);
      clientCode.mark([], 0);
      render();
      noteBox.set('先点「启动服务端」，再点「客户端 connect()」。<b>顺序不能反</b> —— 客户端连不上没启动的服务器。', 'READY');
    }

    resetAll();
  }

  /* =====================================================================
   * 十一、实验台 9 · threads —— 线程调度时间线 + 五态状态机
   * ===================================================================== */
  var THREAD_STATES = ['New', 'Runnable', 'Running', 'Blocked', 'Timed Waiting', 'Terminated'];

  function threadStateDesc(st) {
    switch (st) {
      case 'New': return '刚 new 出来，还没 start()，run() 一行都没执行。';
      case 'Runnable': return '已 start()，在就绪队列里等 CPU，随时可能被调度。';
      case 'Running': return '拿到 CPU，正在执行 run() 里的代码。';
      case 'Timed Waiting': return '调用了 sleep(ms)，在等时间过去；到点自动回到 Runnable。';
      case 'Blocked': return 'main 调用了 join()：等目标线程结束（等锁 / wait() 也属于这一类）。';
      case 'Terminated': return 'run() 执行完，线程结束；不能再次 start()。';
      default: return '';
    }
  }

  /**
   * 迷你调度器：round-robin + 时间片。
   * 每个线程要打印 iters 次；每次打印占用 1 个 tick，之后 sleep 若干个 tick。
   * main 在 start 之后立刻 join，所以整段时间都处于 Blocked，直到所有线程结束。
   */
  function simulateThreads(n, slice, sleepTicks, iters) {
    var threads = [];
    var i;
    for (i = 0; i < n; i++) {
      threads.push({ id: i + 1, state: 'New', prints: 0, sleepLeft: 0, slice: 0, inSleep: false });
    }
    var mainState = 'Running';
    var tick = 0;
    var frames = [];
    var running = -1;
    var lastRun = -1;

    function snap() {
      var runId = mainState === 'Running' ? 0 : -1;
      for (var j = 0; j < threads.length; j++) if (threads[j].state === 'Running') runId = j + 1;
      return {
        tick: tick,
        states: [mainState].concat(threads.map(function (t) { return t.state; })),
        prints: [0].concat(threads.map(function (t) { return t.prints; })),
        running: runId
      };
    }

    frames.push(snap());          /* tick 0：线程是 New，main 在跑 */
    tick = 1;
    threads.forEach(function (t) { t.state = 'Runnable'; });
    mainState = 'Blocked';        /* start() + join() */
    frames.push(snap());

    var guard = 0;
    var done = false;
    while (!done && guard < 240) {
      guard += 1;
      done = threads.every(function (t) { return t.state === 'Terminated'; });
      if (done) { mainState = 'Terminated'; frames.push(snap()); break; }

      tick += 1;
      /* 1) 唤醒到点的 sleep */
      threads.forEach(function (t) {
        if (t.inSleep) {
          t.sleepLeft -= 1;
          if (t.sleepLeft <= 0) { t.inSleep = false; t.state = 'Runnable'; }
        }
      });
      /* 2) 时间片用完就交出 CPU */
      if (running >= 0) {
        var r = threads[running];
        if (r.state !== 'Running') running = -1;
        else if (r.slice >= slice) { r.state = 'Runnable'; r.slice = 0; running = -1; }
      }
      /* 3) round-robin 选下一个 Runnable */
      if (running < 0) {
        for (var k = 1; k <= n; k++) {
          var idx = ((lastRun + k) % n + n) % n;
          if (threads[idx].state === 'Runnable') {
            running = idx;
            lastRun = idx;
            threads[idx].state = 'Running';
            threads[idx].slice = 0;
            break;
          }
        }
      }
      /* 4) 运行一个时间单位 */
      if (running >= 0) {
        var t = threads[running];
        t.slice += 1;
        t.prints += 1;
        if (t.prints >= iters) { t.state = 'Terminated'; running = -1; }
        else if (sleepTicks > 0) {
          t.state = 'Timed Waiting';
          t.inSleep = true;
          t.sleepLeft = sleepTicks;
          running = -1;
        }
      }
      frames.push(snap());
    }
    return frames;
  }

  function initThreads(root, props, ctx, kit) {
    var state = {
      n: 3, slice: 2, sleep: 2, iters: 3,
      frames: [],
      tick: 0,
      sel: 1,
      baseLen: 1
    };

    var optRow = ctl(root);
    optRow.appendChild(E('span', { class: 'mono dim', text: '线程数' }));
    selectBox(optRow, [1, 2, 3, 4].map(function (v) { return { value: v, label: String(v) }; }), state.n, function (v) {
      state.n = Number(v);
      rebuild();
    });
    slider(optRow, {
      label: '时间片', min: 1, max: 4, value: state.slice,
      onInput: function (v) { state.slice = v; rebuild(); }
    });
    slider(optRow, {
      label: 'sleep 时长', min: 0, max: 5, value: state.sleep,
      onInput: function (v) { state.sleep = v; rebuild(); }
    });
    slider(optRow, {
      label: '迭代次数', min: 2, max: 6, value: state.iters,
      onInput: function (v) { state.iters = v; rebuild(); }
    });

    var btnRow = ctl(root);
    var playBtn = button(btnRow, '播放', function () { togglePlay(); }, { icon: 'play', primary: true });
    var stepBtn = button(btnRow, '单步', function () { player.pause(); syncPlayBtn(); step(); }, { icon: 'step' });
    var resetBtn = button(btnRow, '重置', function () { rebuild(); }, { icon: 'reset' });

    var selRow = ctl(root);
    selRow.appendChild(E('span', { class: 'mono dim', text: '查看状态' }));
    var selBtns = [];

    var ganttStage = E('div', { class: 'labStage' });
    root.appendChild(ganttStage);
    var ganttBox = svgBox(ganttStage, 620, 140);

    var smStage = E('div', { class: 'labStage' });
    root.appendChild(smStage);
    var smBox = svgBox(smStage, 500, 240);

    var stateLine = E('div', { class: 'labNote' });
    root.appendChild(stateLine);

    var noteBox = note(root);
    var statBox = stats(root);

    var player = makePlayer(function () {
      if (state.tick >= state.frames.length - 1) { syncPlayBtn(); return false; }
      state.tick += 1;
      render();
      return true;
    }, function () { return 420; });
    kit.addPlayer(player);
    player.onIdle = function () { syncPlayBtn(); };

    function syncPlayBtn() {
      setBtnLabel(playBtn, player.playing ? '暂停' : '播放');
      playBtn.classList.toggle('on', player.playing);
    }

    function togglePlay() {
      if (player.playing) { player.pause(); syncPlayBtn(); render(); return; }
      if (state.tick >= state.frames.length - 1) { state.tick = 0; }
      player.play();
      syncPlayBtn();
    }

    function step() {
      if (state.tick < state.frames.length - 1) {
        state.tick += 1;
        render();
      }
    }

    function rebuild() {
      player.pause();
      state.frames = simulateThreads(state.n, state.slice, state.sleep, state.iters);
      state.tick = 0;
      if (state.sel > state.n) state.sel = state.n;
      syncPlayBtn();
      render();
      noteBox.set('参数变了就重新模拟。点 <b>播放</b> 看线程怎么交替，或点某一行的线程名字看它的状态。', 'TICKS ' + state.frames.length);
    }

    function frame() { return state.frames[state.tick] || state.frames[0]; }

    function stateOf(threadIndex) {
      var fr = frame();
      return fr.states[threadIndex] || 'New';
    }

    function classOfState(st) {
      if (st === 'Running') return 'vizBar';
      if (st === 'Timed Waiting') return 'vizBar hi';
      if (st === 'Runnable') return 'vizBar dim';
      if (st === 'Terminated') return 'vizBar done';
      return 'vizBar';
    }

    function renderGantt() {
      var frames = state.frames;
      if (!frames.length) return;
      var rows = 1 + state.n;
      var colW = Math.max(5, Math.min(14, Math.floor(600 / frames.length)));
      var leftW = 58;
      /* 宽度至少留够图例：否则图例会被 viewBox 裁掉 */
      var W = Math.max(leftW + frames.length * colW + 10, 520);
      var H = 16 + rows * 20 + 30;
      ganttBox.resize(W, H);
      ganttBox.clear();

      /* 当前 tick 的列 */
      var curX = leftW + state.tick * colW;
      ganttBox.add(S('line', { x1: curX, y1: 12, x2: curX, y2: 14 + rows * 20, class: 'vizEdge hi' }));

      for (var ri = 0; ri < rows; ri++) {
        var y = 14 + ri * 20;
        /* 行标题（可点击选中） */
        var hit = R(2, y - 2, leftW - 4, 19, 'vizCell', 3);
        hit.setAttribute('fill', 'transparent');
        hit.setAttribute('pointer-events', 'all');
        hit.addEventListener('click', (function (gi) {
          return function () { state.sel = gi; render(); };
        })(ri));
        ganttBox.add(hit);
        var label = T(4, y + 11, ri === 0 ? 'main' : 'Thread-' + ri, 'vizLabel', 'start');
        if (state.sel === ri) label.setAttribute('fill', cssVar('--const-yellow'));
        ganttBox.add(label);

        for (var ti = 0; ti < frames.length; ti++) {
          var st = frames[ti].states[ri];
          var cls = classOfState(st);
          var rect = R(leftW + ti * colW, y, Math.max(3, colW - 1), 17, cls, 2);
          if (st === 'Blocked') rect.setAttribute('fill', cssVar('--const-orange'));
          ganttBox.add(rect);
        }
      }

      /* 图例 */
      var legend = [
        { label: 'Running', c: 'vizBar' },
        { label: 'Timed Waiting', c: 'vizBar hi' },
        { label: 'Runnable', c: 'vizBar dim' },
        { label: 'Blocked', c: 'blocked' },
        { label: 'Terminated', c: 'vizBar done' }
      ];
      var lx = leftW;
      var ly = 14 + rows * 20 + 8;
      legend.forEach(function (lg) {
        var rr = R(lx, ly, 10, 10, 'vizBar', 2);
        if (lg.c === 'blocked') rr.setAttribute('fill', cssVar('--const-orange'));
        else if (lg.c === 'vizBar hi') rr.setAttribute('class', 'vizBar hi');
        else if (lg.c === 'vizBar dim') rr.setAttribute('class', 'vizBar dim');
        else if (lg.c === 'vizBar done') rr.setAttribute('class', 'vizBar done');
        ganttBox.add(rr);
        ganttBox.add(T(lx + 14, ly + 9, lg.label, 'vizLabel', 'start'));
        lx += 14 + lg.label.length * 6 + 18;
      });
    }

    function renderStateMachine() {
      smBox.clear();
      var selState = stateOf(state.sel);
      var nodes = [
        { id: 'New', x: 56, y: 38 },
        { id: 'Runnable', x: 172, y: 38 },
        { id: 'Running', x: 294, y: 38 },
        { id: 'Terminated', x: 424, y: 38 },
        { id: 'Blocked', x: 172, y: 142 },
        { id: 'Timed Waiting', x: 294, y: 142 }
      ];
      var byId = {};
      nodes.forEach(function (nd) { byId[nd.id] = nd; });
      var w = 96, h = 30;
      function edgePoint(from, to) {
        var dx = to.x - from.x, dy = to.y - from.y;
        var sx = dx === 0 ? Infinity : (w / 2) / Math.abs(dx);
        var sy = dy === 0 ? Infinity : (h / 2) / Math.abs(dy);
        var s = Math.min(sx, sy);
        return { x: from.x + dx * s, y: from.y + dy * s };
      }
      var edges = [
        { a: 'New', b: 'Runnable', label: 'start()', lp: 'above' },
        { a: 'Runnable', b: 'Running', label: '获得 CPU', lp: 'above' },
        { a: 'Running', b: 'Runnable', label: '时间片用完', lp: 'below' },
        { a: 'Running', b: 'Terminated', label: 'run() 结束', lp: 'above' },
        { a: 'Running', b: 'Timed Waiting', label: 'sleep()', lp: 'right' },
        { a: 'Runnable', b: 'Blocked', label: 'join()/wait()', lp: 'left' },
        { a: 'Blocked', b: 'Runnable', label: '', lp: 'right' }
      ];
      edges.forEach(function (e) {
        var A = byId[e.a], B = byId[e.b];
        var p1 = edgePoint(A, B), p2 = edgePoint(B, A);
        var hi = (selState === e.a || selState === e.b);
        smBox.add(arrow(p1.x, p1.y, p2.x, p2.y, 'vizEdge' + (hi ? ' hi' : '')));
        if (e.label) {
          var mx = (p1.x + p2.x) / 2;
          var my = (p1.y + p2.y) / 2;
          if (e.lp === 'above') smBox.add(T(mx, my - 6, e.label, 'vizLabel', 'middle'));
          else if (e.lp === 'below') smBox.add(T(mx, my + 36, e.label, 'vizLabel', 'middle'));
          else if (e.lp === 'right') smBox.add(T(mx + 8, my + 4, e.label, 'vizLabel', 'start'));
          else smBox.add(T(mx - 8, my + 4, e.label, 'vizLabel', 'end'));
        }
      });
      nodes.forEach(function (nd) {
        var hi = selState === nd.id;
        smBox.add(R(nd.x - w / 2, nd.y - h / 2, w, h, 'vizNode' + (hi ? ' hi' : ''), 6));
        smBox.add(T(nd.x, nd.y + 4, nd.id, hi ? 'vizPtrText' : 'vizText', 'middle'));
      });
      smBox.add(T(294, 186, 'sleep 结束 → 回到 Runnable', 'vizLabel', 'middle'));
      smBox.add(T(172, 204, '被唤醒 / join 返回 → Runnable', 'vizLabel', 'middle'));
      smBox.add(T(10, 228, '当前选中：' + (state.sel === 0 ? 'main' : 'Thread-' + state.sel) + ' 处于 ' + selState, 'vizLabel', 'start'));
    }

    function stateLineHtml() {
      var fr = frame();
      var st = stateOf(state.sel);
      var who = state.sel === 0 ? 'main' : 'Thread-' + state.sel;
      var running = fr.running;
      var whoRun = running === 0 ? 'main' : (running > 0 ? 'Thread-' + running : '没有线程在跑');
      return '<span><b>' + esc(who) + '</b> 在第 ' + fr.tick + ' tick 处于 <b>' + esc(st) + '</b>：' + esc(threadStateDesc(st))
        + ' <span class="dim">（此刻拿到 CPU 的是 ' + esc(whoRun) + '）</span></span>';
    }

    function renderSelection() {
      selRow.innerHTML = '';
      selRow.appendChild(E('span', { class: 'mono dim', text: '查看状态' }));
      selBtns = [];
      var names = ['main'].concat(Array.apply(null, { length: state.n }).map(function (_, i) { return 'Thread-' + (i + 1); }));
      names.forEach(function (nm, i) {
        var b = button(selRow, nm, function () { state.sel = i; render(); });
        if (state.sel === i) b.classList.add('on');
        selBtns.push(b);
      });
    }

    function render() {
      renderSelection();
      renderGantt();
      renderStateMachine();
      var fr = frame();
      var st = stateOf(state.sel);
      stateLine.innerHTML = stateLineHtml();
      var running = fr.running;
      statBox.set([
        { label: 'tick', value: fr.tick + ' / ' + (state.frames.length - 1) },
        { label: 'CPU 上', value: running === 0 ? 'main' : (running > 0 ? 'Thread-' + running : '—'), hot: true },
        { label: '选中线程', value: (state.sel === 0 ? 'main' : 'Thread-' + state.sel) },
        { label: '状态', value: st },
        { label: '打印次数', value: fr.prints[state.sel] }
      ]);
    }

    rebuild();
    noteBox.set('3 条线程 + main：<b>时间片</b>决定一个线程连续跑多久，<b>sleep</b> 决定它睡几个 tick。点甘特图左侧线程名看状态机。', 'READY');
  }

  /* =====================================================================
   * 十二、实验台 10 · fxstage —— Stage / Scene / Node 三层结构
   * ===================================================================== */
  var FXSTAGE_CODE = [
    'public class HelloApp extends Application {',
    '    @Override',
    '    public void start(Stage stage) {                // Step 1：入口',
    '        Button btn = new Button("Say Hello");       // Step 2：创建按钮',
    '        StackPane root = new StackPane();           // Step 3：创建布局',
    '        root.getChildren().add(btn);                //          把按钮放进去',
    '        Scene scene = new Scene(root, 300, 200);    // Step 4：创建 Scene',
    '        stage.setTitle("Hello JavaFX");             // Step 5：准备 Stage',
    '        stage.setScene(scene);',
    '        stage.show();                               //          显示窗口',
    '        btn.setOnAction(e -> System.out.println("hello"));  // Step 6：事件',
    '    }',
    '}'
  ];
  var FXSTAGE_STEPS = [
    { n: 1, title: '继承 Application', lines: [1, 2, 3], desc: 'JVM 启动 JavaFX 后调用 start(Stage)，把主舞台交给你。' },
    { n: 2, title: '创建 Button', lines: [4], desc: 'new Button 只是造了一个节点（Node），还没有父容器。' },
    { n: 3, title: '创建布局并 add', lines: [5, 6], desc: 'StackPane 是父节点；getChildren().add() 建立父子关系。' },
    { n: 4, title: '创建 Scene', lines: [7], desc: 'Scene 是场景图的根；new Scene(root, 300, 200) 把根节点挂到场景上。' },
    { n: 5, title: '准备 Stage 并 show()', lines: [8, 9, 10], desc: 'setTitle / setScene / show —— 到这一步窗口才真的出现。' },
    { n: 6, title: '注册事件', lines: [11], desc: 'setOnAction 注册处理器；点击按钮时在事件线程里执行。' }
  ];

  function initFxStage(root, props, ctx, kit) {
    var state = { step: 1 };

    var stepRow = ctl(root);
    var stepBtns = FXSTAGE_STEPS.map(function (s) {
      return button(stepRow, s.n + ' · ' + s.title, function () { gotoStep(s.n); });
    });

    var navRow = ctl(root);
    var prevBtn = button(navRow, '上一步', function () { gotoStep(state.step - 1); }, { icon: 'arrow-left' });
    var nextBtn = button(navRow, '下一步', function () { gotoStep(state.step + 1); }, { icon: 'arrow-right', primary: true });
    var resetBtn = button(navRow, '重置', function () { gotoStep(1); }, { icon: 'reset' });

    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var box = svgBox(stage, 430, 340);

    var codeTitle = panelTitle(root, '六步代码（当前行高亮）');
    codeTitle.className = 'memColT';
    var code = codePanel(root, FXSTAGE_CODE, 'HelloApp.java');

    var cons = consoleBox(root, 'Console · 点击按钮的输出');
    var noteBox = note(root);
    var statBox = stats(root);

    function drawWindow() {
      var step = state.step;
      var shown = step >= 5;
      /* Stage 外框 */
      var frame = R(40, 20, 350, 250, 'vizNode' + (shown ? ' hi' : ''), 6);
      box.add(frame);
      box.add(L(40, 52, 390, 52, 'vizAxis'));
      box.add(T(52, 43, shown ? 'Hello JavaFX' : '（Stage 还没有 show，看不到窗口）', shown ? 'vizVal' : 'vizLabel', 'start'));

      /* Scene */
      if (step >= 4) {
        var s = R(60, 74, 310, 180, 'vizNode', 4);
        s.setAttribute('fill', 'none');
        s.setAttribute('stroke-dasharray', '4 4');
        box.add(s);
        box.add(T(68, 90, 'Scene（300 × 200）', 'vizLabel', 'start'));
      }
      /* StackPane */
      if (step >= 3) {
        var p = R(100, 104, 230, 124, 'vizNode', 4);
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke-dasharray', '3 3');
        box.add(p);
        box.add(T(108, 120, 'StackPane root（布局 / 父节点）', 'vizLabel', 'start'));
      }
      /* Button */
      if (step >= 2) {
        var bx = step >= 3 ? 155 : 280;
        var by = step >= 3 ? 150 : 292;
        var btn = R(bx, by, 120, 34, 'vizNode' + (step >= 2 ? ' hi' : ''), 6);
        if (step >= 6) btn.addEventListener('click', function () {
          cons.log('hello');
          noteBox.set('按钮被点击：<b>setOnAction</b> 注册的 lambda 在 JavaFX 事件线程里执行，打印 "hello"。', 'EVENT');
        });
        box.add(btn);
        box.add(T(bx + 60, by + 22, 'Say Hello', 'vizText', 'middle'));
        if (step === 2) {
          box.add(T(bx + 60, by + 52, 'btn：还没有父容器，不显示', 'vizLabel', 'middle'));
        }
      }
      /* 层级提示 */
      var label = '';
      if (step === 1) label = '现在只有 Application 和 Stage，场景图还是空的。';
      else if (step === 2) label = 'Node 已经创建，但没 add 到任何父节点 —— 场景图里看不到它。';
      else if (step === 3) label = 'Node → StackPane：父节点建立了，但它还不在 Scene 里。';
      else if (step === 4) label = 'Scene 包住了根节点；但 Stage 还没 setScene，窗口还没出现。';
      else if (step === 5) label = 'show() 之后窗口出现：Stage → Scene → StackPane → Button 四层齐了。';
      else label = '再给按钮注册 setOnAction：现在点它会有反应。';
      box.add(T(40, 296, label, 'vizText', 'start'));
      box.add(T(40, 318, 'Stage（窗口）  ⊃  Scene（场景图）  ⊃  Node（控件 / 布局）', 'vizLabel', 'start'));
    }

    function gotoStep(n) {
      if (n < 1) n = 1;
      if (n > FXSTAGE_STEPS.length) n = FXSTAGE_STEPS.length;
      state.step = n;
      stepBtns.forEach(function (b, i) { b.classList.toggle('on', i + 1 === n); });
      prevBtn.disabled = n <= 1;
      nextBtn.disabled = n >= FXSTAGE_STEPS.length;
      var meta = FXSTAGE_STEPS[n - 1];
      box.clear();
      drawWindow();
      code.mark(meta.lines, 0);
      noteBox.set('第 ' + n + ' 步 · <b>' + esc(meta.title) + '</b>：' + esc(meta.desc), 'STEP ' + n + ' / 6');
      statBox.set([
        { label: '当前步骤', value: n + ' / 6', hot: true },
        { label: '场景图层级', value: n <= 1 ? 'Stage' : n === 2 ? 'Stage + Node（游离）' : n === 3 ? 'Stage + 布局树' : n === 4 ? 'Stage + Scene + 树' : n === 5 ? '全部（已显示）' : '全部 + 事件' },
        { label: '窗口可见', value: n >= 5 ? '是' : '否' }
      ]);
      void meta;
    }

    gotoStep(1);
  }

  /* =====================================================================
   * 十三、实验台 11 · fxlayout —— 五种布局实时预览
   * ===================================================================== */
  var FXLAYOUT_CTRLS = [
    { label: 'Play', w: 84, h: 30, kind: 'btn' },
    { label: 'Pause', w: 84, h: 30, kind: 'btn' },
    { label: 'Stop', w: 84, h: 30, kind: 'btn' },
    { label: 'Reset', w: 84, h: 30, kind: 'btn' },
    { label: 'Score: 0', w: 104, h: 24, kind: 'label' }
  ];
  var FXLAYOUT_KINDS = [
    { id: 'hbox', label: 'HBox', desc: '一行水平排列；放不下也不会换行，会被裁掉。' },
    { id: 'vbox', label: 'VBox', desc: '一列垂直排列。' },
    { id: 'flowpane', label: 'FlowPane', desc: '按顺序排列，碰到边界就自动换行。' },
    { id: 'gridpane', label: 'GridPane', desc: '按行列放入网格单元，可以跨行列、对齐。' },
    { id: 'stackpane', label: 'StackPane', desc: '所有子节点叠在一起，默认居中，后加的盖在上面。' }
  ];
  var FXLAYOUT_W = 520;
  var FXLAYOUT_H = 300;

  function fxLayoutPositions(kind, spacing, padding, align) {
    var area = { x: padding, y: padding, w: FXLAYOUT_W - padding * 2, h: FXLAYOUT_H - padding * 2 };
    var alignH = align === 'TOP_LEFT' ? 0 : align === 'BOTTOM_RIGHT' ? 1 : 0.5;
    var alignV = align === 'TOP_LEFT' ? 0 : align === 'BOTTOM_RIGHT' ? 1 : 0.5;
    var pos = [];
    var i;
    if (kind === 'hbox') {
      var totalW = 0;
      FXLAYOUT_CTRLS.forEach(function (c, idx) { totalW += c.w + (idx ? spacing : 0); });
      var maxH = 0;
      FXLAYOUT_CTRLS.forEach(function (c) { maxH = Math.max(maxH, c.h); });
      var x0 = area.x + (area.w - totalW) * alignH;
      var y0 = area.y + (area.h - maxH) * alignV;
      FXLAYOUT_CTRLS.forEach(function (c) {
        pos.push({ x: x0, y: y0 + (maxH - c.h) / 2 });
        x0 += c.w + spacing;
      });
      return pos;
    }
    if (kind === 'vbox') {
      var totalH = 0;
      FXLAYOUT_CTRLS.forEach(function (c, idx) { totalH += c.h + (idx ? spacing : 0); });
      var maxW = 0;
      FXLAYOUT_CTRLS.forEach(function (c) { maxW = Math.max(maxW, c.w); });
      var yy = area.y + (area.h - totalH) * alignV;
      FXLAYOUT_CTRLS.forEach(function (c) {
        pos.push({ x: area.x + (area.w - maxW) * alignH + (maxW - c.w) / 2, y: yy });
        yy += c.h + spacing;
      });
      return pos;
    }
    if (kind === 'flowpane') {
      var cx = area.x;
      var cy = area.y;
      var rowH = 0;
      FXLAYOUT_CTRLS.forEach(function (c) {
        if (cx + c.w > area.x + area.w && cx > area.x) {
          cx = area.x;
          cy += rowH + spacing;
          rowH = 0;
        }
        pos.push({ x: cx, y: cy });
        cx += c.w + spacing;
        rowH = Math.max(rowH, c.h);
      });
      return pos;
    }
    if (kind === 'gridpane') {
      var cellW = 104, cellH = 40;
      var cols = 2;
      var rows = Math.ceil(FXLAYOUT_CTRLS.length / cols);
      var gw = cols * cellW + (cols - 1) * spacing;
      var gh = rows * cellH + (rows - 1) * spacing;
      var gx = area.x + (area.w - gw) * alignH;
      var gy = area.y + (area.h - gh) * alignV;
      FXLAYOUT_CTRLS.forEach(function (c, idx) {
        var col = idx % cols;
        var row = Math.floor(idx / cols);
        pos.push({
          x: gx + col * (cellW + spacing) + (cellW - c.w) / 2,
          y: gy + row * (cellH + spacing) + (cellH - c.h) / 2
        });
      });
      return pos;
    }
    /* StackPane：全部居中叠放 */
    FXLAYOUT_CTRLS.forEach(function (c) {
      pos.push({ x: area.x + (area.w - c.w) / 2, y: area.y + (area.h - c.h) / 2 });
    });
    return pos;
  }

  function fxLayoutCode(kind, spacing, padding, align) {
    if (kind === 'hbox' || kind === 'vbox') {
      var pane = kind === 'hbox' ? 'HBox' : 'VBox';
      return [
        pane + ' root = new ' + pane + '(' + spacing + ');',
        'root.setPadding(new Insets(' + padding + '));',
        'root.setAlignment(Pos.' + align + ');',
        'root.getChildren().addAll(btn1, btn2, btn3, btn4, scoreLabel);',
        '',
        'Scene scene = new Scene(root, ' + FXLAYOUT_W + ', ' + FXLAYOUT_H + ');',
        'stage.setScene(scene);',
        'stage.show();'
      ];
    }
    if (kind === 'flowpane') {
      return [
        'FlowPane root = new FlowPane(' + spacing + ', ' + spacing + ');',
        'root.setPadding(new Insets(' + padding + '));',
        'root.setAlignment(Pos.' + align + ');',
        'root.getChildren().addAll(btn1, btn2, btn3, btn4, scoreLabel);',
        '',
        'Scene scene = new Scene(root, ' + FXLAYOUT_W + ', ' + FXLAYOUT_H + ');',
        'stage.setScene(scene);',
        'stage.show();'
      ];
    }
    if (kind === 'gridpane') {
      return [
        'GridPane root = new GridPane();',
        'root.setHgap(' + spacing + ');',
        'root.setVgap(' + spacing + ');',
        'root.setPadding(new Insets(' + padding + '));',
        'root.add(btn1, 0, 0);  root.add(btn2, 1, 0);',
        'root.add(btn3, 0, 1);  root.add(btn4, 1, 1);',
        'root.add(scoreLabel, 0, 2);',
        '',
        'Scene scene = new Scene(root, ' + FXLAYOUT_W + ', ' + FXLAYOUT_H + ');',
        'stage.setScene(scene);',
        'stage.show();'
      ];
    }
    return [
      'StackPane root = new StackPane();',
      'root.setPadding(new Insets(' + padding + '));',
      'root.setAlignment(Pos.' + align + ');',
      'root.getChildren().addAll(btn1, btn2, btn3, btn4, scoreLabel);',
      '',
      'Scene scene = new Scene(root, ' + FXLAYOUT_W + ', ' + FXLAYOUT_H + ');',
      'stage.setScene(scene);',
      'stage.show();'
    ];
  }

  function initFxLayout(root, props, ctx, kit) {
    var state = { kind: 'hbox', spacing: 12, padding: 16, align: 'CENTER' };

    var kindRow = ctl(root);
    var kindBtns = {};
    FXLAYOUT_KINDS.forEach(function (k) {
      kindBtns[k.id] = button(kindRow, k.label, function () { selectKind(k.id); });
    });

    var paramRow = ctl(root);
    var sliderSpacing = slider(paramRow, {
      label: 'spacing', min: 0, max: 32, value: state.spacing,
      onInput: function (v) { state.spacing = v; render(); }
    });
    var sliderPadding = slider(paramRow, {
      label: 'padding', min: 0, max: 32, value: state.padding,
      onInput: function (v) { state.padding = v; render(); }
    });
    paramRow.appendChild(E('span', { class: 'mono dim', text: 'alignment' }));
    var alignSel = selectBox(paramRow, [
      { value: 'TOP_LEFT', label: 'Pos.TOP_LEFT' },
      { value: 'CENTER', label: 'Pos.CENTER' },
      { value: 'BOTTOM_RIGHT', label: 'Pos.BOTTOM_RIGHT' }
    ], state.align, function (v) { state.align = v; render(); });
    button(paramRow, '重置', function () {
      state.spacing = 12;
      state.padding = 16;
      state.align = 'CENTER';
      sliderSpacing.set(12);
      sliderPadding.set(16);
      alignSel.value = 'CENTER';
      selectKind('hbox');
    }, { icon: 'reset' });

    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var box = svgBox(stage, FXLAYOUT_W, FXLAYOUT_H);

    var codeTitle = panelTitle(root, '对应的 JavaFX 代码');
    codeTitle.className = 'memColT';
    var code = codePanel(root, fxLayoutCode('hbox', 12, 16, 'CENTER'), 'LayoutDemo.java');

    var noteBox = note(root);
    var statBox = stats(root);

    function render() {
      var kindInfo = null;
      FXLAYOUT_KINDS.forEach(function (k) { if (k.id === state.kind) kindInfo = k; });
      box.clear();
      /* Scene 边框 */
      box.add(R(0, 0, FXLAYOUT_W, FXLAYOUT_H, 'vizNode', 4));
      box.add(T(8, 16, 'Scene ' + FXLAYOUT_W + ' × ' + FXLAYOUT_H, 'vizLabel', 'start'));

      /* padding 内边距虚线 */
      if (state.padding > 0) {
        var pad = R(state.padding, state.padding, FXLAYOUT_W - state.padding * 2, FXLAYOUT_H - state.padding * 2, 'vizGrid', 0);
        pad.setAttribute('fill', 'none');
        pad.setAttribute('stroke-dasharray', '4 4');
        box.add(pad);
        box.add(T(state.padding + 6, state.padding + 14, 'padding(' + state.padding + ')', 'vizLabel', 'start'));
      }

      var pos = fxLayoutPositions(state.kind, state.spacing, state.padding, state.align);
      FXLAYOUT_CTRLS.forEach(function (c, i) {
        var p = pos[i] || { x: 0, y: 0 };
        var cls = c.kind === 'label' ? 'vizCell' : 'vizNode';
        box.add(R(p.x, p.y, c.w, c.h, cls, 5));
        box.add(T(p.x + c.w / 2, p.y + c.h / 2 + 4, c.label, c.kind === 'label' ? 'vizCellText' : 'vizText', 'middle'));
      });

      box.add(T(8, FXLAYOUT_H - 8, state.kind.toUpperCase() + ' · spacing=' + state.spacing + ' · padding=' + state.padding + ' · ' + state.align, 'vizLabel', 'start'));

      code.setLines(fxLayoutCode(state.kind, state.spacing, state.padding, state.align));
      noteBox.set('<b>' + kindInfo.label + '</b>：' + esc(kindInfo.desc)
        + (state.kind === 'gridpane' ? ' 注意 5 个控件里有一个跨了第三行第一列。' : ''), 'LAYOUT');
      statBox.set([
        { label: '布局', value: kindInfo.label, hot: true },
        { label: 'spacing', value: state.spacing },
        { label: 'padding', value: state.padding },
        { label: 'alignment', value: state.align }
      ]);
    }

    function selectKind(id) {
      state.kind = id;
      Object.keys(kindBtns).forEach(function (k) { kindBtns[k].classList.toggle('on', k === id); });
      render();
    }

    selectKind('hbox');
  }

  /* =====================================================================
   * 十四、实验台 12 · fxcanvas —— JavaFX Canvas 绘图台
   * ===================================================================== */
  var FXCOLORS = {
    FORESTGREEN: '--ok',
    BLUE: '--const-blue',
    RED: '--const-red',
    ORANGE: '--const-orange',
    YELLOW: '--const-yellow',
    WHITE: '--text-white',
    BLACK: '--bg-deep'
  };
  var FXCANVAS_W = 560;
  var FXCANVAS_H = 340;

  function initFxCanvas(root, props, ctx, kit) {
    var state = {
      calls: [],
      stroke: 'FORESTGREEN',
      fill: 'FORESTGREEN',
      lineWidth: 2,
      path: [],
      cursor: null
    };
    var view = { canvas: null, ctx: null, k: 1 };

    var colorRow = ctl(root);
    colorRow.appendChild(E('span', { class: 'mono dim', text: 'setStroke 颜色' }));
    selectBox(colorRow, Object.keys(FXCOLORS).map(function (k) { return { value: k, label: 'Color.' + k }; }), state.stroke, function (v) {
      state.stroke = v;
      exec('setStroke', [v]);
    });
    colorRow.appendChild(E('span', { class: 'mono dim', text: '线宽' }));
    numberInput(colorRow, {
      min: 1, max: 12, value: state.lineWidth,
      onInput: function (v) { state.lineWidth = v; exec('setLineWidth', [v]); }
    });
    colorRow.appendChild(E('span', { class: 'mono dim', text: 'x' }));
    var inX = numberInput(colorRow, { min: 0, max: FXCANVAS_W, value: 80 });
    colorRow.appendChild(E('span', { class: 'mono dim', text: 'y' }));
    var inY = numberInput(colorRow, { min: 0, max: FXCANVAS_H, value: 80 });
    colorRow.appendChild(E('span', { class: 'mono dim', text: 'w' }));
    var inW = numberInput(colorRow, { min: 0, max: FXCANVAS_W, value: 100 });
    colorRow.appendChild(E('span', { class: 'mono dim', text: 'h' }));
    var inH = numberInput(colorRow, { min: 0, max: FXCANVAS_H, value: 60 });
    var inText = textInput(colorRow, { value: 'Hi!', maxlength: 16, placeholder: 'fillText 内容' });

    function num(input, fallback) {
      var v = Number(input.value);
      return isNaN(v) ? fallback : v;
    }

    var apiRow1 = ctl(root);
    button(apiRow1, 'beginPath()', function () { exec('beginPath', []); }, { icon: 'code' });
    button(apiRow1, 'moveTo(x, y)', function () { exec('moveTo', [num(inX, 80), num(inY, 80)]); });
    button(apiRow1, 'lineTo(x, y)', function () { exec('lineTo', [num(inX, 80), num(inY, 80)]); });
    button(apiRow1, 'stroke()', function () { exec('stroke', []); }, { icon: 'zap', primary: true });
    button(apiRow1, 'strokeOval(x,y,w,h)', function () {
      exec('strokeOval', [num(inX, 80), num(inY, 80), num(inW, 100), num(inH, 60)]);
    });
    button(apiRow1, 'fillOval(x,y,w,h)', function () {
      exec('fillOval', [num(inX, 80), num(inY, 80), num(inW, 100), num(inH, 60)]);
    });

    var apiRow2 = ctl(root);
    button(apiRow2, 'fillRect(x,y,w,h)', function () {
      exec('fillRect', [num(inX, 80), num(inY, 80), num(inW, 100), num(inH, 60)]);
    });
    button(apiRow2, 'strokeRect(x,y,w,h)', function () {
      exec('strokeRect', [num(inX, 80), num(inY, 80), num(inW, 100), num(inH, 60)]);
    });
    button(apiRow2, 'fillText(text,x,y)', function () {
      exec('fillText', [inText.value || 'Hi!', num(inX, 80), num(inY, 80)]);
    });
    button(apiRow2, 'clearRect(x,y,w,h)', function () {
      exec('clearRect', [num(inX, 80), num(inY, 80), num(inW, 100), num(inH, 60)]);
    });
    button(apiRow2, '清空画布', function () { reset(); }, { icon: 'trash' });

    var demoRow = ctl(root);
    button(demoRow, '一键画五子棋棋盘', function () { drawBoard(); }, { icon: 'grid', primary: true });
    button(demoRow, '复制 Java 代码', function () {
      copyText(toJava(state.calls).join('\n'));
    }, { icon: 'copy' });
    button(demoRow, '重置', function () { reset(); }, { icon: 'reset' });

    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var canvas = E('canvas', { class: 'sdCanvas' });
    stage.appendChild(canvas);
    view.canvas = canvas;

    var codeTitle = panelTitle(root, 'API 调用序列（就是这段 Java 代码）');
    codeTitle.className = 'memColT';
    var code = codePanel(root, ['GraphicsContext gc = canvas.getGraphicsContext2D(); // 还没有调用'], 'CanvasDemo.java');

    var noteBox = note(root);
    var statBox = stats(root);

    function fit() {
      var hostW = (stage.clientWidth || 560) - 8;
      var w = Math.max(280, Math.min(640, hostW));
      var h = Math.round(w * FXCANVAS_H / FXCANVAS_W);
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      var c = canvas.getContext('2d');
      if (!c) return;
      view.ctx = c;
      view.k = canvas.width / FXCANVAS_W;
      c.setTransform(view.k, 0, 0, view.k, 0, 0);
      replayAll();
    }

    function javaColor(name) {
      if (name === 'FORESTGREEN') return 'FORESTGREEN';
      return name;
    }

    /** 把一条调用记录应用到 canvas 上 */
    function applyCall(st, rec) {
      var c = view.ctx;
      if (!c) return;
      if (rec.api === 'setStroke') { st.stroke = rec.args[0]; return; }
      if (rec.api === 'setFill') { st.fill = rec.args[0]; return; }
      if (rec.api === 'setLineWidth') { st.lineWidth = Number(rec.args[0]) || 1; return; }
      if (rec.api === 'beginPath') { st.path = []; return; }
      if (rec.api === 'moveTo') { st.path.push(['M', Number(rec.args[0]), Number(rec.args[1])]); return; }
      if (rec.api === 'lineTo') { st.path.push(['L', Number(rec.args[0]), Number(rec.args[1])]); return; }
      if (rec.api === 'stroke') {
        c.beginPath();
        st.path.forEach(function (p) {
          if (p[0] === 'M') c.moveTo(p[1], p[2]);
          else c.lineTo(p[1], p[2]);
        });
        c.strokeStyle = cssVar(FXCOLORS[st.stroke] || '--text2');
        c.lineWidth = st.lineWidth;
        c.stroke();
        return;
      }
      if (rec.api === 'strokeOval' || rec.api === 'fillOval' || rec.api === 'strokeRect' || rec.api === 'fillRect') {
        c.lineWidth = st.lineWidth;
        c.strokeStyle = cssVar(FXCOLORS[st.stroke] || '--text2');
        c.fillStyle = cssVar(FXCOLORS[st.fill] || '--text2');
        var x = Number(rec.args[0]), y = Number(rec.args[1]), w = Number(rec.args[2]), h = Number(rec.args[3]);
        if (rec.api === 'strokeOval') { c.beginPath(); c.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2); c.stroke(); }
        else if (rec.api === 'fillOval') { c.beginPath(); c.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2); c.fill(); }
        else if (rec.api === 'strokeRect') c.strokeRect(x, y, w, h);
        else c.fillRect(x, y, w, h);
        return;
      }
      if (rec.api === 'fillText') {
        c.fillStyle = cssVar(FXCOLORS[st.fill] || '--text2');
        c.font = '15px "Roboto Mono", monospace';
        c.fillText(String(rec.args[0]), Number(rec.args[1]), Number(rec.args[2]));
        return;
      }
      if (rec.api === 'clearRect') {
        c.fillStyle = cssVar('--codeBg');
        c.fillRect(Number(rec.args[0]), Number(rec.args[1]), Number(rec.args[2]), Number(rec.args[3]));
        return;
      }
    }

    function replayAll() {
      var c = view.ctx;
      if (!c) return;
      c.save();
      c.setTransform(view.k, 0, 0, view.k, 0, 0);
      c.fillStyle = cssVar('--codeBg');
      c.fillRect(0, 0, FXCANVAS_W, FXCANVAS_H);
      var st = { stroke: 'FORESTGREEN', fill: 'FORESTGREEN', lineWidth: 1, path: [] };
      state.calls.forEach(function (rec) { applyCall(st, rec); });
      c.restore();
    }

    function exec(api, args) {
      state.calls.push({ api: api, args: args });
      /* 实时绘制：把这一条应用在 state 上（state 同时保存当前 stroke/线宽/路径） */
      applyCall(state, state.calls[state.calls.length - 1]);
      renderCode();
      renderNote(api);
      renderStats();
    }

    function toJava(calls) {
      var lines = ['GraphicsContext gc = canvas.getGraphicsContext2D();'];
      var shown = calls;
      var truncated = false;
      if (calls.length > 44) {
        shown = calls.slice(0, 40);
        truncated = true;
      }
      shown.forEach(function (c) {
        var args = c.args.map(function (a) {
          return typeof a === 'number' ? String(a) : '"' + a + '"';
        });
        if (c.api === 'setStroke' || c.api === 'setFill') {
          lines.push('gc.' + c.api + '(Color.' + args[0].replace(/"/g, '') + ');');
        } else if (c.api === 'setLineWidth') {
          lines.push('gc.setLineWidth(' + args[0] + ');');
        } else {
          lines.push('gc.' + c.api + '(' + args.join(', ') + ');');
        }
      });
      if (truncated) lines.push('// … 其余 ' + (calls.length - shown.length) + ' 次调用（用循环批量画）');
      return lines;
    }

    function renderCode() {
      code.setLines(toJava(state.calls));
    }

    function renderNote(lastApi) {
      var msg = !state.calls.length
        ? '先用 <b>beginPath → moveTo → lineTo → stroke</b> 画一条线，或者直接点「一键画五子棋棋盘」。'
        : (lastApi === 'stroke' ? '<b>stroke()</b> 用当前的 stroke 颜色和线宽，把当前路径描出来。'
          : lastApi === 'setStroke' ? '当前描边颜色改成了 <b>Color.' + esc(state.stroke) + '</b>。'
            : lastApi === 'setLineWidth' ? '线宽改成了 <b>' + state.lineWidth + '</b>。'
              : lastApi === 'clearRect' ? '<b>clearRect</b> 清空一块矩形区域（画布其他地方不动）。'
                : '执行了 <b>' + esc(lastApi) + '()</b>。');
      noteBox.set(msg, 'CALLS ' + state.calls.length);
    }

    function renderStats() {
      statBox.set([
        { label: '调用数', value: state.calls.length },
        { label: 'stroke', value: state.stroke, hot: true },
        { label: '线宽', value: state.lineWidth },
        { label: '当前路径点', value: state.path.length }
      ]);
    }

    function drawBoard() {
      reset(true);
      var pad = 40, cells = 14, gap = (FXCANVAS_W - pad * 2) / cells;
      exec('setStroke', ['WHITE']);
      exec('setLineWidth', [1]);
      exec('beginPath', []);
      for (var i = 0; i <= cells; i++) {
        exec('moveTo', [pad, pad + i * gap]);
        exec('lineTo', [FXCANVAS_W - pad, pad + i * gap]);
      }
      for (var j = 0; j <= cells; j++) {
        exec('moveTo', [pad + j * gap, pad]);
        exec('lineTo', [pad + j * gap, FXCANVAS_H - pad]);
      }
      exec('stroke', []);
      noteBox.set('画好了 15 × 15 的棋盘：<b>15 条横线 + 15 条竖线</b>，全部用 beginPath / moveTo / lineTo / stroke 完成。'
        + ' 真实 JavaFX 里就是同一个 GraphicsContext 在循环里画。', 'BOARD');
      renderStats();
    }

    function reset(keepQuiet) {
      state.calls = [];
      state.path = [];
      state.cursor = null;
      replayAll();
      renderCode();
      renderStats();
      if (!keepQuiet) {
        noteBox.set('画布已清空，API 记录也清空了。', 'RESET');
      }
    }

    fit();
    var onResize = CSC.debounce ? CSC.debounce(fit, 160) : null;
    if (onResize) {
      window.addEventListener('resize', onResize);
      kit.onDestroy(function () { window.removeEventListener('resize', onResize); });
    }
    noteBox.set('这是一块模拟 JavaFX Canvas 的画布：每个按钮调用一次 <b>GraphicsContext</b> 的 API，右侧自动生成等价 Java 代码。', 'READY');
    renderStats();
  }

  /* =====================================================================
   * 十五、实验台 13 · fxevents —— 事件捕获 / 冒泡 + Handler vs Filter
   * ===================================================================== */
  var FXE_NODES = [
    { id: 'Pane', label: 'Pane（根节点 · 场景图顶端）', y: 24 },
    { id: 'HBox', label: 'HBox（中间布局）', y: 116 },
    { id: 'Button', label: 'Button（事件目标 target）', y: 208 }
  ];

  function initFxEvents(root, props, ctx, kit) {
    var state = {
      mode: 'both', stopAtTarget: false,
      runId: 0, active: null, phase: '', done: {}, playing: false
    };

    var modeRow = ctl(root);
    var modeBtns = {};
    [['handler', '只注册 handler'], ['filter', '只注册 filter'], ['both', '都注册']].forEach(function (p) {
      modeBtns[p[0]] = button(modeRow, p[1], function () { setMode(p[0]); });
    });

    var actRow = ctl(root);
    var playBtn = button(actRow, '点一下 Button', function () { play(); }, { icon: 'zap', primary: true });
    var stopBtn = toggleBtn(actRow, 'handler 里 stopPropagation()', false, function (on) {
      state.stopAtTarget = on;
      code.setLines(regCode());
      render();
    });
    void stopBtn;
    button(actRow, '重置', function () { resetAll(); }, { icon: 'reset' });

    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var box = svgBox(stage, 470, 300);

    var cons = consoleBox(root, 'Console · 监听器执行顺序');
    var codeTitle = panelTitle(root, '注册代码（随模式变化）');
    codeTitle.className = 'memColT';
    var code = codePanel(root, [], 'EventDemo.java');
    var noteBox = note(root);
    var statBox = stats(root);

    function regCode() {
      var lines = [];
      if (state.mode !== 'handler') {
        lines.push('// EventFilter：在捕获阶段（从根往目标）被调用');
        lines.push('pane.addEventFilter(MouseEvent.MOUSE_CLICKED,');
        lines.push('        e -> System.out.println("Pane filter"));');
        lines.push('hbox.addEventFilter(MouseEvent.MOUSE_CLICKED,');
        lines.push('        e -> System.out.println("HBox filter"));');
        lines.push('button.addEventFilter(MouseEvent.MOUSE_CLICKED,');
        lines.push('        e -> System.out.println("Button filter"));');
      }
      if (state.mode !== 'filter') {
        if (lines.length) lines.push('');
        lines.push('// EventHandler：在冒泡阶段（从目标往根）被调用');
        lines.push('button.addEventHandler(MouseEvent.MOUSE_CLICKED,');
        lines.push('        e -> System.out.println("Button handler"));');
        if (state.stopAtTarget) {
          lines.push('// Button 的 handler 里提前截断冒泡：');
          lines.push('//   e.stopPropagation();  →  HBox / Pane 的 handler 收不到');
        }
        lines.push('hbox.addEventHandler(MouseEvent.MOUSE_CLICKED,');
        lines.push('        e -> System.out.println("HBox handler"));');
        lines.push('pane.addEventHandler(MouseEvent.MOUSE_CLICKED,');
        lines.push('        e -> System.out.println("Pane handler"));');
      }
      return lines;
    }

    function buildSequence() {
      var useFilter = state.mode !== 'handler';
      var useHandler = state.mode !== 'filter';
      var seq = [];
      if (useFilter) {
        FXE_NODES.forEach(function (n) { seq.push({ node: n.id, kind: 'filter', phase: '捕获' }); });
      }
      if (useHandler) {
        var rev = FXE_NODES.slice().reverse();
        rev.forEach(function (n, i) {
          seq.push({ node: n.id, kind: 'handler', phase: i === 0 ? '目标/冒泡' : '冒泡' });
          if (i === 0 && state.stopAtTarget) seq.push({ node: n.id, kind: 'stop', phase: '截断' });
        });
      }
      return seq;
    }

    function render() {
      box.clear();
      var nodeW = 210, nodeH = 46, cx = 235;
      FXE_NODES.forEach(function (n, i) {
        var x = cx - nodeW / 2;
        var isActive = state.active === n.id;
        var cls = 'vizNode' + (isActive ? ' hi' : '');
        box.add(R(x, n.y, nodeW, nodeH, cls, 7));
        box.add(T(x + 12, n.y + 20, n.label, isActive ? 'vizPtrText' : 'vizText', 'start'));
        /* 两个状态灯：F / H */
        [['F', 'filter'], ['H', 'handler']].forEach(function (k, ki) {
          var on = !!state.done[n.id + '.' + k[1]];
          var lx = x + nodeW - 52 + ki * 24;
          var ly = n.y + 32;
          var c = S('circle', { cx: lx + 6, cy: ly, r: 7, class: 'vizNode' });
          if (on) c.setAttribute('fill', cssVar('--ok'));
          box.add(c);
          box.add(T(lx + 6, ly + 4, k[0], on ? 'vizVal' : 'vizLabel', 'middle'));
        });
        if (i < FXE_NODES.length - 1) {
          var next = FXE_NODES[i + 1];
          box.add(arrow(cx, n.y + nodeH + 2, cx, next.y - 2, 'vizEdge'));
        }
      });

      var phaseText = state.phase
        ? state.phase + '阶段' + (state.active ? '：' + state.active : '')
        : '点「点一下 Button」开始';
      box.add(T(8, 284, phaseText, 'vizLabel', 'start'));
      box.add(T(300, 284, '↕ 捕获：Node → Target   冒泡：Target → Node', 'vizLabel', 'start'));

      statBox.set([
        { label: '模式', value: state.mode === 'both' ? 'handler + filter' : state.mode },
        { label: '已触发', value: Object.keys(state.done).length },
        { label: '阶段', value: state.phase || '—', hot: true }
      ]);
    }

    function setMode(mode) {
      state.mode = mode;
      Object.keys(modeBtns).forEach(function (k) { modeBtns[k].classList.toggle('on', k === mode); });
      code.setLines(regCode());
      resetAll();
    }

    function resetAll() {
      state.runId += 1;
      state.active = null;
      state.phase = '';
      state.done = {};
      state.playing = false;
      cons.clear();
      render();
      noteBox.set('当前模式：<b>' + (state.mode === 'both' ? 'filter + handler 都注册' : state.mode === 'handler' ? '只注册 handler' : '只注册 filter') + '</b>。'
        + ' 点「点一下 Button」，看事件到底按什么顺序经过每一层。', 'READY');
    }

    function play() {
      if (state.playing) return;
      state.runId += 1;
      var rid = state.runId;
      state.done = {};
      state.active = null;
      state.phase = '';
      cons.clear();
      var seq = buildSequence();
      if (!seq.length) {
        noteBox.set('这个模式下一个监听器都没有，事件没人处理。', 'EMPTY');
        return;
      }
      render();
      state.playing = true;
      var i = 0;
      function tick() {
        if (kit.dead() || rid !== state.runId) { state.playing = false; render(); return; }
        if (i >= seq.length) {
          state.playing = false;
          state.active = null;
          state.phase = '';
          render();
          var handlerCount = seq.filter(function (s) { return s.kind === 'handler'; }).length;
          noteBox.set(state.mode === 'both'
            ? '完成：<b>filter 先（捕获，根 → 目标）</b>，<b>handler 后（冒泡，目标 → 根）</b>。同一个节点上两种都注册时，filter 一定先执行。'
            : state.mode === 'handler'
              ? '只注册 handler：事件只在<b>冒泡阶段</b>从目标往根走，根上的 handler 最晚执行。'
              : '只注册 filter：事件只在<b>捕获阶段</b>从根往目标走，目标节点的 filter 最后执行。'
            , 'DONE · ' + handlerCount + ' handler');
          return;
        }
        var step = seq[i];
        if (step.kind === 'stop') {
          state.playing = false;
          state.phase = '截断';
          cons.log('  ↳ e.stopPropagation()：冒泡被截断，后面的 handler 不执行');
          render();
          noteBox.set('Button 的 handler 里调用了 <b>e.stopPropagation()</b>：事件走到这里就停了，HBox 和 Pane 的 handler 收不到通知。', 'STOPPED');
          return;
        }
        state.active = step.node;
        state.phase = step.phase;
        state.done[step.node + '.' + step.kind] = true;
        cons.log(step.phase + '：' + step.node + '.' + (step.kind === 'filter' ? 'filter' : 'handler') + ' 执行');
        render();
        i += 1;
        kit.timeout(tick, 720);
      }
      tick();
    }

    setMode('both');
  }

  /* =====================================================================
   * 十六、实验台 14 · chat —— 聊天室架构：Server / ClientHandler / 广播
   * ===================================================================== */
  var CHAT_NAMES = ['Alice', 'Bob', 'Carol', 'Dave'];
  var CHAT_CODE = [
    'public class ClientHandler implements Runnable {',
    '    private Socket socket;',
    '    private BufferedReader reader;',
    '    private String username;',
    '',
    '    @Override',
    '    public void run() {              // 每条连接一条子线程',
    '        String msg;',
    '        while ((msg = reader.readLine()) != null) {',
    '            broadcastMessage(msg);   // 收到就转发给所有人',
    '        }',
    '    }',
    '',
    '    public void broadcastMessage(String msg) {',
    '        for (ClientHandler h : clientHandlers) {',
    '            if (h != this) {             // 不要发回给发送者',
    '                h.send(msg);',
    '            }',
    '        }',
    '    }',
    '}'
  ];

  function initChat(root, props, ctx, kit) {
    var state = {
      clients: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Carol' }
      ],
      sender: 1,
      packet: null,
      activeClient: null,
      activeHandler: null,
      busActive: false,
      sending: false,
      anim: 0,
      seq: 0
    };

    var sendRow = ctl(root);
    sendRow.appendChild(E('span', { class: 'mono dim', text: '发送者' }));
    var senderSelHost = E('span');
    sendRow.appendChild(senderSelHost);
    var msgInput = textInput(sendRow, { value: 'Hello everyone!', maxlength: 30 });
    var sendBtn = button(sendRow, '发送', function () { sendMessage(); }, { icon: 'arrow-right', primary: true });
    var addBtn = button(sendRow, '加一个客户端', function () { addClient(); }, { icon: 'rocket' });
    var resetBtn = button(sendRow, '重置', function () { resetChat(); }, { icon: 'reset' });

    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var box = svgBox(stage, 580, 350);

    var cons = consoleBox(root, 'Console · 消息流水（注意每行的线程名）');
    var codeTitle = panelTitle(root, 'ClientHandler 的关键代码');
    codeTitle.className = 'memColT';
    var code = codePanel(root, CHAT_CODE, 'ClientHandler.java');
    var noteBox = note(root);
    var statBox = stats(root);

    function senderSel() {
      senderSelHost.innerHTML = '';
      selectBox(senderSelHost, state.clients.map(function (c) { return { value: c.id, label: c.name }; }), state.sender, function (v) {
        state.sender = Number(v);
      });
    }

    function clientY(i) { return 30 + i * 78; }

    function render() {
      var n = state.clients.length;
      var H = Math.max(340, 40 + n * 78);
      box.resize(580, H);
      box.clear();

      /* ---- Server ---- */
      box.add(R(14, 24, 140, 236, 'vizNode', 8));
      box.add(T(24, 44, 'Server（main 线程）', 'vizVal', 'start'));
      box.add(L(20, 52, 148, 52, 'vizAxis'));
      box.add(T(24, 72, 'ServerSocket(1004)', 'vizLabel', 'start'));
      box.add(T(24, 90, 'while(true) accept()', 'vizLabel', 'start'));
      box.add(T(24, 108, 'clientHandlers:', 'vizLabel', 'start'));
      state.clients.forEach(function (c, i) {
        var hy = 126 + i * 26;
        var hi = state.activeHandler === c.id;
        box.add(R(24, hy, 120, 20, 'vizNode' + (hi ? ' hi' : ''), 4));
        box.add(T(32, hy + 14, 'ClientHandler-' + c.id + '（子线程）', hi ? 'vizPtrText' : 'vizLabel', 'start'));
      });
      box.add(T(24, 250, '线程：main + ' + n + ' 条 handler', 'vizLabel', 'start'));

      /* ---- 广播总线 ---- */
      var busCls = 'vizNode' + (state.busActive ? ' hi' : '');
      box.add(R(196, 150, 128, 76, busCls, 8));
      box.add(T(260, 172, 'broadcastMessage(msg)', 'vizVal', 'middle'));
      box.add(T(260, 192, '遍历 clientHandlers', 'vizLabel', 'middle'));
      box.add(T(260, 208, '跳过发送者自己', 'vizLabel', 'middle'));

      /* ---- Client 卡 ---- */
      state.clients.forEach(function (c, i) {
        var y = clientY(i);
        var hi = state.activeClient === c.id;
        box.add(R(364, y, 200, 64, 'vizNode' + (hi ? ' hi' : ''), 8));
        box.add(T(374, y + 18, c.name + '（Client 对象）', hi ? 'vizPtrText' : 'vizVal', 'start'));
        box.add(T(374, y + 34, 'Socket 端口 ' + (50000 + c.id), 'vizLabel', 'start'));
        box.add(T(374, y + 48, 'listenForMessage() 子线程', 'vizLabel', 'start'));
        box.add(T(374, y + 60, 'ClientHandler-' + c.id + ' 在服务器端', 'vizLabel', 'start'));
      });

      /* ---- 连线 ---- */
      state.clients.forEach(function (c, i) {
        var y = clientY(i) + 32;
        box.add(S('path', {
          d: 'M364 ' + y + ' L328 ' + y + ' L328 188 L324 188',
          class: 'vizGrid', fill: 'none'
        }));
      });
      box.add(L(196, 188, 154, 188, 'vizGrid'));

      /* ---- 消息包 ---- */
      if (state.packet) box.add(C(state.packet.x, state.packet.y, 7, 'vizBar hi'));

      statBox.set([
        { label: '客户端', value: state.clients.length },
        { label: '服务器线程', value: '1 main + ' + state.clients.length + ' handler' },
        { label: '客户端线程', value: state.clients.length + ' 个 listen', hot: true }
      ]);
    }

    function flyPath(points, ms, done) {
      var rid = (state.anim += 1);
      tween(kit, ms, function (t) {
        if (rid !== state.anim) return;
        var segs = points.length - 1;
        var f = t * segs;
        var i = Math.min(segs - 1, Math.floor(f));
        var p = f - i;
        var a = points[i], b = points[i + 1];
        state.packet = { x: a[0] + (b[0] - a[0]) * p, y: a[1] + (b[1] - a[1]) * p };
        render();
      }, function () {
        if (rid !== state.anim) return;
        state.packet = null;
        render();
        if (done) done();
      });
    }

    function sendMessage() {
      if (state.sending) return;
      var from = null;
      state.clients.forEach(function (c) { if (c.id === state.sender) from = c; });
      if (!from) { from = state.clients[0]; state.sender = from.id; }
      var msg = msgInput.value || 'Hello';
      var si = state.clients.indexOf(from);
      state.sending = true;
      state.activeClient = from.id;
      state.activeHandler = from.id;
      render();
      cons.log('[' + from.name + ' · main] 我把输入框里的一行写进 writer，flush');
      cons.log('[' + from.name + ' · listen 子线程] 同时在等服务器转发来的消息');
      var startY = clientY(si) + 32;
      flyPath([[364, startY], [328, startY], [328, 188], [324, 188]], 520, function () {
        cons.log('[Server · ClientHandler-' + from.id + ' 子线程] readLine() 收到："' + msg + '"');
        cons.log('[Server · ClientHandler-' + from.id + ' 子线程] broadcastMessage("' + msg + '")：遍历所有 handler，跳过自己');
        state.busActive = true;
        render();
        flyPath([[324, 188], [196, 188]], 360, function () {
          var others = state.clients.filter(function (c) { return c.id !== from.id; });
          var i = 0;
          function nextOne() {
            if (i >= others.length) {
              state.busActive = false;
              state.activeClient = null;
              state.activeHandler = null;
              render();
              cons.log('[Clients] ' + others.map(function (c) { return c.name; }).join('、') + ' 的 listen 子线程收到并打印');
              state.sending = false;
              noteBox.set('消息走了三跳：<b>发送者 → Server 的 ClientHandler 子线程 → broadcastMessage → 其他每个 Client</b>。'
                + ' 发送者自己不会再收到一遍。', 'DELIVERED');
              return;
            }
            var to = others[i];
            var ti = state.clients.indexOf(to);
            state.activeClient = to.id;
            render();
            flyPath([[196, 188], [328, 188], [328, clientY(ti) + 32], [364, clientY(ti) + 32]], 520, function () {
              i += 1;
              kit.timeout(nextOne, 80);
            });
          }
          nextOne();
        });
      });
      noteBox.set('消息正在从 <b>' + esc(from.name) + '</b> 发往服务器；注意服务器是用 <b>ClientHandler 子线程</b>收的，不是主线程。', 'SENDING');
    }

    function addClient() {
      if (state.clients.length >= CHAT_NAMES.length) {
        noteBox.set('最多演示 ' + CHAT_NAMES.length + ' 个客户端（再多就看不清了）。', 'MAX');
        return;
      }
      var id = state.clients.length + 1;
      var c = { id: id, name: CHAT_NAMES[state.clients.length] };
      state.clients.push(c);
      state.seq += 1;
      senderSel();
      render();
      cons.log('[Server · main 线程] accept() 返回新的 Socket');
      cons.log('[Server · main 线程] new ClientHandler' + id + ' + new Thread(handler).start()');
      cons.log('[' + c.name + ' · main] 新客户端启动，listenForMessage() 子线程已就绪');
      noteBox.set('<b>' + esc(c.name) + '</b> 连上来了：Server 主线程 accept() 一次，就新建一个 <b>ClientHandler</b> 并 <b>new Thread(...).start()</b>。'
        + ' 之后每个客户端的消息都由各自的子线程处理。', 'NEW CLIENT');
    }

    function resetChat() {
      state.anim += 1;
      state.clients = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Carol' }
      ];
      state.sender = 1;
      state.packet = null;
      state.activeClient = null;
      state.activeHandler = null;
      state.busActive = false;
      state.sending = false;
      senderSel();
      cons.clear();
      render();
      noteBox.set('3 个客户端已连接。选一个发送者，输入一句话，看它怎么经由服务器广播给其他人。', 'READY');
    }

    senderSel();
    resetChat();
  }

  /* =====================================================================
   * 十七、实验台 15 · gomoku —— 五子棋：落子 / 四方向计数 / 平局
   * ===================================================================== */
  var GOMOKU_N = 15;
  var GOMOKU_CELL = 30;
  var GOMOKU_PAD = 30;
  var GOMOKU_W = GOMOKU_PAD * 2 + (GOMOKU_N - 1) * GOMOKU_CELL;
  var GOMOKU_DIRS = [
    { key: 'h', dr: 0, dc: 1, label: '横 —' },
    { key: 'v', dr: 1, dc: 0, label: '竖 |' },
    { key: 'd1', dr: 1, dc: 1, label: '斜 ↘' },
    { key: 'd2', dr: 1, dc: -1, label: '斜 ↗' }
  ];

  function gomokuEmptyBoard() {
    var b = [];
    for (var r = 0; r < GOMOKU_N; r++) {
      b.push([]);
      for (var c = 0; c < GOMOKU_N; c++) b[r].push(0);
    }
    return b;
  }

  function initGomoku(root, props, ctx, kit) {
    var state = {
      board: gomokuEmptyBoard(),
      player: 1,
      last: null,
      history: [],
      over: null,        // null | 'win' | 'draw'
      winner: 0,
      winLine: null,
      counts: null,
      mode: 'play',      // play | analyze
      analyze: null,
      moves: 0
    };

    var row1 = ctl(root);
    var undoBtn = button(row1, '悔棋', function () { undo(); }, { icon: 'arrow-left' });
    var resetBtn = button(row1, '重开', function () { resetBoard(); }, { icon: 'reset' });
    var analyzeBtn = toggleBtn(row1, '演示胜负判定', false, function (on) {
      state.mode = on ? 'analyze' : 'play';
      state.analyze = null;
      render();
      noteBox.set(on
        ? '分析模式：点棋盘上任意一个交叉点，看它如果落子（或已落子）时，<b>四个方向各自的连子数</b>。≥ 5 就是五连。'
        : '回到对局模式：黑白交替落子。', on ? 'ANALYZE' : 'PLAY');
    });
    var fourBtn = button(row1, '摆一个四连局面', function () { setupFour(); }, { icon: 'grid' });
    var drawBtn = button(row1, '平局演示', function () { fillDraw(); });

    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var box = svgBox(stage, GOMOKU_W, GOMOKU_W);

    var noteBox = note(root);
    var statBox = stats(root);

    function inBoard(r, c) { return r >= 0 && r < GOMOKU_N && c >= 0 && c < GOMOKU_N; }
    function colorName(p) { return p === 1 ? '黑棋（Player 1）' : '白棋（Player 2）'; }

    function countAlong(r, c, dr, dc, who) {
      var n = 0;
      var rr = r + dr, cc = c + dc;
      while (inBoard(rr, cc) && state.board[rr][cc] === who) { n += 1; rr += dr; cc += dc; }
      return n;
    }

    function countAll(r, c, who) {
      var out = {};
      GOMOKU_DIRS.forEach(function (d) {
        out[d.key] = 1 + countAlong(r, c, d.dr, d.dc, who) + countAlong(r, c, -d.dr, -d.dc, who);
      });
      return out;
    }

    function anyWin(counts) {
      return GOMOKU_DIRS.some(function (d) { return counts[d.key] >= 5; });
    }

    function winLineOf(r, c, counts) {
      for (var i = 0; i < GOMOKU_DIRS.length; i++) {
        var d = GOMOKU_DIRS[i];
        if (counts[d.key] < 5) continue;
        var who = state.board[r][c];
        var a = countAlong(r, c, -d.dr, -d.dc, who);
        var b = countAlong(r, c, d.dr, d.dc, who);
        return {
          r1: r - d.dr * a, c1: c - d.dc * a,
          r2: r + d.dr * b, c2: c + d.dc * b,
          dir: d.key
        };
      }
      return null;
    }

    function cellX(c) { return GOMOKU_PAD + c * GOMOKU_CELL; }
    function cellY(r) { return GOMOKU_PAD + r * GOMOKU_CELL; }

    function analyzeLines() {
      /* 返回要画的四条方向线（分析模式） */
      var out = [];
      var a = state.analyze;
      if (!a) return out;
      GOMOKU_DIRS.forEach(function (d) {
        var who = a.who;
        var cnt = a.counts[d.key];
        var ax = countAlong(a.r, a.c, -d.dr, -d.dc, who);
        var bx = countAlong(a.r, a.c, d.dr, d.dc, who);
        out.push({
          x1: cellX(a.c) - d.dc * ax * GOMOKU_CELL,
          y1: cellY(a.r) - d.dr * ax * GOMOKU_CELL,
          x2: cellX(a.c) + d.dc * bx * GOMOKU_CELL,
          y2: cellY(a.r) + d.dr * bx * GOMOKU_CELL,
          win: cnt >= 5
        });
      });
      return out;
    }

    function starPoints() {
      return [[3, 3], [3, 11], [11, 3], [11, 11], [7, 7]];
    }

    function render() {
      box.clear();
      /* 棋盘底 */
      var bg = R(6, 6, GOMOKU_W - 12, GOMOKU_W - 12, 'vizCell', 4);
      bg.setAttribute('fill', cssVar('--surface2'));
      bg.setAttribute('stroke', cssVar('--line2'));
      box.add(bg);

      /* 网格 */
      for (var i = 0; i < GOMOKU_N; i++) {
        box.add(L(cellX(0), cellY(i), cellX(GOMOKU_N - 1), cellY(i), 'vizAxis'));
        box.add(L(cellX(i), cellY(0), cellX(i), cellY(GOMOKU_N - 1), 'vizAxis'));
      }
      /* 坐标标注 */
      for (var k = 0; k < GOMOKU_N; k++) {
        box.add(T(cellX(k), 20, String.fromCharCode(65 + k), 'vizLabel', 'middle'));
        box.add(T(14, cellY(k) + 4, String(k + 1), 'vizLabel', 'middle'));
      }
      /* 星位 */
      starPoints().forEach(function (pt) {
        box.add(C(cellX(pt[1]), cellY(pt[0]), 2.6, 'vizPtr'));
      });

      /* 分析线（画在棋子下面） */
      analyzeLines().forEach(function (ln) {
        var l = S('line', {
          x1: ln.x1, y1: ln.y1, x2: ln.x2, y2: ln.y2,
          stroke: ln.win ? cssVar('--ok') : cssVar('--const-yellow'),
          'stroke-width': ln.win ? '4' : '2',
          'stroke-opacity': ln.win ? '0.85' : '0.5'
        });
        box.add(l);
      });

      /* 胜利线 */
      if (state.winLine) {
        var wl = state.winLine;
        box.add(S('line', {
          x1: cellX(wl.c1), y1: cellY(wl.r1), x2: cellX(wl.c2), y2: cellY(wl.r2),
          stroke: cssVar('--ok'), 'stroke-width': '4', 'stroke-opacity': '0.9'
        }));
      }

      /* 棋子 */
      for (var r = 0; r < GOMOKU_N; r++) {
        for (var c = 0; c < GOMOKU_N; c++) {
          var p = state.board[r][c];
          if (!p) continue;
          var isLast = state.last && state.last.r === r && state.last.c === c;
          var stone = C(cellX(c), cellY(r), 12, 'vizNode');
          stone.setAttribute('fill', p === 1 ? cssVar('--bg-deep') : cssVar('--text2'));
          stone.setAttribute('stroke', p === 1 ? cssVar('--text2') : cssVar('--bg-deep'));
          stone.setAttribute('stroke-width', '1.4');
          box.add(stone);
          if (isLast) {
            var ring = C(cellX(c), cellY(r), 4, 'vizNode');
            ring.setAttribute('fill', 'none');
            ring.setAttribute('stroke', cssVar('--const-yellow'));
            ring.setAttribute('stroke-width', '2');
            box.add(ring);
          }
        }
      }

      /* 分析十字标记 */
      if (state.analyze) {
        var ax = cellX(state.analyze.c), ay = cellY(state.analyze.r);
        box.add(S('circle', {
          cx: ax, cy: ay, r: 15, fill: 'none',
          stroke: cssVar('--const-yellow'), 'stroke-width': '2', 'stroke-dasharray': '3 3'
        }));
      }

      /* 点击区（透明方块盖住整个棋盘） */
      for (var rr = 0; rr < GOMOKU_N; rr++) {
        for (var cc = 0; cc < GOMOKU_N; cc++) {
          var hit = R(cellX(cc) - GOMOKU_CELL / 2, cellY(rr) - GOMOKU_CELL / 2, GOMOKU_CELL, GOMOKU_CELL, 'vizCell', 0);
          hit.setAttribute('fill', 'transparent');
          hit.setAttribute('pointer-events', 'all');
          hit.addEventListener('click', (function (r2, c2) {
            return function () { onCell(r2, c2); };
          })(rr, cc));
          box.add(hit);
        }
      }

      /* 状态文字 */
      var counts = state.counts;
      statBox.set([
        { label: '轮到', value: state.over ? (state.over === 'draw' ? '平局' : colorName(state.winner) + ' 胜') : colorName(state.player), hot: !state.over },
        { label: '手数', value: state.moves },
        { label: '最后一步', value: state.last ? String.fromCharCode(65 + state.last.c) + (state.last.r + 1) : '—' },
        { label: '横', value: counts ? counts.h : '—' },
        { label: '竖', value: counts ? counts.v : '—' },
        { label: '↘', value: counts ? counts.d1 : '—' },
        { label: '↗', value: counts ? counts.d2 : '—' }
      ]);
    }

    function place(r, c) {
      if (state.over) {
        noteBox.set('对局已经结束了，点「悔棋」或「重开」继续下。', 'GAME OVER');
        return;
      }
      if (state.board[r][c]) {
        noteBox.set('(' + String.fromCharCode(65 + c) + (r + 1) + ') 已经有棋子了 —— 不能重复落子。', 'OCCUPIED');
        return;
      }
      state.board[r][c] = state.player;
      state.last = { r: r, c: c };
      state.history.push({ r: r, c: c, player: state.player });
      state.moves = state.history.length;
      var who = state.player;
      var counts = countAll(r, c, who);
      state.counts = counts;
      state.winLine = null;
      if (anyWin(counts)) {
        state.over = 'win';
        state.winner = who;
        state.winLine = winLineOf(r, c, counts);
      } else if (state.moves >= GOMOKU_N * GOMOKU_N) {
        state.over = 'draw';
      } else {
        state.player = 3 - who;
      }
      render();
      if (state.over === 'win') {
        noteBox.set('<b>' + colorName(who) + '</b> 在 (' + String.fromCharCode(65 + c) + (r + 1) + ') 落子后形成五连 → <b>游戏结束</b>。'
          + ' 判定只检查这一颗棋子的四个方向（每个方向含相反两个朝向），不用扫全盘。', 'WIN');
      } else if (state.over === 'draw') {
        noteBox.set('棋盘下满了还没有五连 → <b>平局</b>。真实实现里用一个 moveCount 计数就够了，不必遍历全盘。', 'DRAW');
      } else {
        noteBox.set(colorName(who) + ' 下在 (' + String.fromCharCode(65 + c) + (r + 1) + ')。四方向连子数：横 ' + counts.h + ' · 竖 ' + counts.v + ' · 斜 ↘ ' + counts.d1 + ' · 斜 ↗ ' + counts.d2 + '。轮到 ' + colorName(state.player) + '。', 'MOVE ' + state.moves);
      }
    }

    function onCell(r, c) {
      if (state.mode === 'analyze') {
        var who = state.board[r][c] || state.player;
        var counts = countAll(r, c, who);
        state.analyze = { r: r, c: c, who: who, counts: counts };
        render();
        var best = Math.max(counts.h, counts.v, counts.d1, counts.d2);
        noteBox.set('假设 (' + String.fromCharCode(65 + c) + (r + 1) + ') 放 <b>' + colorName(who) + '</b>：'
          + '横 <b>' + counts.h + '</b> · 竖 <b>' + counts.v + '</b> · 斜 ↘ <b>' + counts.d1 + '</b> · 斜 ↗ <b>' + counts.d2 + '</b>'
          + (best >= 5 ? ' → <b>有方向 ≥5，判胜</b>。' : ' → 都不到 5，不判胜。'), 'ANALYZE');
        return;
      }
      place(r, c);
    }

    function undo() {
      if (!state.history.length) {
        noteBox.set('还没有落子，没得悔。', 'UNDO');
        return;
      }
      state.over = null;
      state.winner = 0;
      state.winLine = null;
      state.analyze = null;
      var last = state.history.pop();
      state.board[last.r][last.c] = 0;
      state.player = last.player;
      state.moves = state.history.length;
      state.last = state.history.length ? state.history[state.history.length - 1] : null;
      state.counts = state.last ? countAll(state.last.r, state.last.c, state.board[state.last.r][state.last.c]) : null;
      render();
      noteBox.set('悔棋：撤掉了 (' + String.fromCharCode(65 + last.c) + (last.r + 1) + ')，现在轮到 ' + colorName(state.player) + '。', 'UNDO');
    }

    function resetBoard() {
      state.board = gomokuEmptyBoard();
      state.player = 1;
      state.last = null;
      state.history = [];
      state.over = null;
      state.winner = 0;
      state.winLine = null;
      state.counts = null;
      state.analyze = null;
      state.moves = 0;
      state.mode = 'play';
      analyzeBtn.classList.remove('on');
      render();
      noteBox.set('新棋局。黑棋先手：点棋盘交叉点落子，落子后会自动统计四个方向的连子数。', 'NEW GAME');
    }

    function setupFour() {
      resetBoard();
      var blacks = [[7, 3], [7, 4], [7, 5], [7, 6]];
      var whites = [[6, 4], [6, 6], [8, 3], [9, 5]];
      blacks.forEach(function (pt) { state.board[pt[0]][pt[1]] = 1; });
      whites.forEach(function (pt) { state.board[pt[0]][pt[1]] = 2; });
      state.history = blacks.map(function (pt) { return { r: pt[0], c: pt[1], player: 1 }; })
        .concat(whites.map(function (pt) { return { r: pt[0], c: pt[1], player: 2 }; }));
      state.moves = state.history.length;
      state.player = 1;
      state.last = { r: 7, c: 6 };
      state.counts = countAll(7, 6, 1);
      render();
      noteBox.set('局面摆好了：黑棋在第 8 行（H）的 D–G 四连。切到「演示胜负判定」后点 <b>H 列</b>的位置，看四个方向的计数怎么算。'
        + ' 也可以直接在 (7,7) 落子（H8）赢下这局。', 'PRESET');
    }

    function fillDraw() {
      resetBoard();
      for (var r = 0; r < GOMOKU_N; r++) {
        for (var c = 0; c < GOMOKU_N; c++) {
          state.board[r][c] = ((2 * c + r) % 4 < 2) ? 1 : 2;
        }
      }
      state.history = [];
      for (var r2 = 0; r2 < GOMOKU_N; r2++) {
        for (var c2 = 0; c2 < GOMOKU_N; c2++) {
          state.history.push({ r: r2, c: c2, player: state.board[r2][c2] });
        }
      }
      state.moves = GOMOKU_N * GOMOKU_N;
      state.over = 'draw';
      state.winner = 0;
      state.last = null;
      state.counts = null;
      state.winLine = null;
      render();
      noteBox.set('225 个交叉点全部占满，<b>没有任何一方形成五连 → 平局</b>。'
        + ' 真实实现里平局判定只看 <b>moveCount 是否到上限</b>，不用每次扫全盘。', 'DRAW');
    }

    resetBoard();
  }

  /* =====================================================================
   * 注册（viz 就绪后立即注册；失败时兜底注册，实验台内部有降级提示）
   * ===================================================================== */
  var LABS = {
    'ide': {
      title: 'IntelliJ 调试器导览',
      desc: '断点、Step over / into / out、变量窗：看清「下一步到底走哪」',
      icon: 'bug', order: 10, tags: ['ch01'], init: lab(initIde)
    },
    'vibe': {
      title: 'AI 提示词构造器 + 代码审查',
      desc: '把需求拆成任务 / 上下文 / 约束 / 验收标准，再揪出 AI 代码里的三个坑',
      icon: 'sparkle', order: 20, tags: ['ch02'], init: lab(initVibe)
    },
    'classdesign': {
      title: '类设计器：字段 / 方法 / 静态成员',
      desc: '勾选成员，实时生成 Java 类骨架，再看 new 出来的对象落在堆上的样子',
      icon: 'box', order: 30, tags: ['ch03'], init: lab(initClassDesign)
    },
    'inherit': {
      title: '继承链与方法查找顺序',
      desc: '点一个方法调用，看它从子类一层层往上找、先命中的赢',
      icon: 'branch', order: 40, tags: ['ch04'], init: lab(initInherit)
    },
    'polymorph': {
      title: '多态派发：编译期 vs 运行期',
      desc: 'Animal a = new Dog()，喊一声，看真正执行的是谁的方法',
      icon: 'layers', order: 50, tags: ['ch04'], init: lab(initPolymorph)
    },
    'lambda': {
      title: '匿名内部类 ↔ Lambda ↔ 方法引用',
      desc: '同一个函数式接口三种写法并排，点一下看它们输出是否一样',
      icon: 'function', order: 60, tags: ['ch05'], init: lab(initLambda)
    },
    'streams': {
      title: 'I/O 流包装链',
      desc: '字节流 → 字符流 → 缓冲流：写一行、flush，看数据每层的形态',
      icon: 'repeat', order: 70, tags: ['ch06'], init: lab(initStreams)
    },
    'socket': {
      title: 'Socket 连接时序',
      desc: 'connect → accept 返回 → 双向发消息 → close，还有第二个连接的排队',
      icon: 'cpu', order: 80, tags: ['ch07'], init: lab(initSocket)
    },
    'threads': {
      title: '线程调度时间线 + 五态状态机',
      desc: '调时间片和 sleep，看线程怎么交替，以及每个线程此刻是什么状态',
      icon: 'clock', order: 90, tags: ['ch08'], init: lab(initThreads)
    },
    'fxstage': {
      title: 'Stage / Scene / Node 三层结构',
      desc: '六步代码一步步搭出窗口：按钮 → 布局 → 场景 → show',
      icon: 'grid', order: 100, tags: ['ch09'], init: lab(initFxStage)
    },
    'fxlayout': {
      title: '五种布局实时预览',
      desc: 'HBox / VBox / FlowPane / GridPane / StackPane，调 spacing 和 padding 立刻看效果',
      icon: 'array', order: 110, tags: ['ch10'], init: lab(initFxLayout)
    },
    'fxcanvas': {
      title: 'JavaFX Canvas 绘图台',
      desc: '点 API 画画：moveTo / lineTo / stroke / fillOval，右侧自动生成 Java 代码',
      icon: 'target', order: 120, tags: ['ch11'], init: lab(initFxCanvas)
    },
    'fxevents': {
      title: '事件传播：捕获与冒泡',
      desc: '点按钮，看事件从根到目标再回来；filter 和 handler 的顺序一目了然',
      icon: 'zap', order: 130, tags: ['ch12'], init: lab(initFxEvents)
    },
    'chat': {
      title: '聊天室消息流',
      desc: '一条消息如何经过 ClientHandler 子线程，再广播给其他所有人',
      icon: 'list', order: 140, tags: ['ch13'], init: lab(initChat)
    },
    'gomoku': {
      title: '五子棋：落子与胜负判定',
      desc: '15×15 可落子对局，落子即算四个方向的连子数，还有平局演示',
      icon: 'star', order: 145, tags: ['ch14'], init: lab(initGomoku)
    }
  };

  var registered = false;
  function registerAll() {
    if (registered) return;
    registered = true;
    CSC.registerLabs(LABS);
  }
  if (viz()) {
    registerAll();
  } else if (CSC.bus && CSC.bus.on) {
    CSC.bus.on('viz:ready', registerAll);
    setTimeout(registerAll, 2600);
  } else {
    registerAll();
  }
})();
