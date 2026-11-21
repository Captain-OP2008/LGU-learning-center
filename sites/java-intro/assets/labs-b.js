/* =====================================================================
 * 计算机科学与 Java 编程导论 · 学习站 · labs-b.js
 * 职责：用 CSC.registerLabs 注册 6 个「高级主题」交互实验台：
 *   dfa（ch20）turing（ch21）sat（ch22）
 *   binary（ch23）toyvm（ch24）logic（ch25）
 * 每个实验台：标题/说明（由 app.js 卡片渲染）+ 可操作控件 + 可视化 +
 *   状态说明条 + 重置 + 单步/播放；动画基于 requestAnimationFrame。
 * 依赖：CSC.viz（仅用于 mountViz 的就绪等待）；不依赖 CSC.java，
 *   所有规则都在本文件内用普通 JS 实现，解释器缺失也能运行。
 * 约定：不写内联 style；IIFE；中文注释；init 返回 { destroy() }。
 * 作者模块：editor-core-a（实验台 B 组）
 * ===================================================================== */
(function () {
  'use strict';

  var CSC = window.CSC;
  if (!CSC) {
    console.error('[labs-b] 必须先加载 app.js');
    return;
  }

  /* =====================================================================
   * 一、基础工具：DOM 工厂 / 控件 / 播放器 / 生命周期
   * （与 labs.js 同构的一份拷贝，保证本文件可独立运行）
   * ===================================================================== */
  function E(tag, attrs, children) { return CSC.el(tag, attrs, children); }
  function icon(name) { return typeof CSC.icon === 'function' ? CSC.icon(name) : ''; }
  function viz() { return CSC.viz || null; }
  function fmt(v) { return CSC.viz && CSC.viz.fmtNum ? CSC.viz.fmtNum(v) : String(v); }

  function esc(s) {
    if (typeof CSC.escapeHtml === 'function') return CSC.escapeHtml(s);
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /** 读主题 CSS 变量（Canvas 不能直接使用 var()，必须取计算值） */
  function cssv(name, fallback) {
    try {
      var v = window.getComputedStyle(document.documentElement).getPropertyValue(name);
      v = (v || '').trim();
      return v || fallback;
    } catch (e) {
      return fallback;
    }
  }

  /** 从深空观测台主题里取一组 Canvas 配色 */
  function palette() {
    return {
      bg: cssv('--bg2', '#05070a'),
      panel: cssv('--bg-soft', '#111927'),
      text: cssv('--text', '#eef2f8'),
      text2: cssv('--text2', '#93a1b3'),
      text3: cssv('--text3', '#7b8a99'),
      line: cssv('--line', 'rgba(59,78,107,.46)'),
      line2: cssv('--line2', 'rgba(59,78,107,.78)'),
      accent: cssv('--accent', '#ff4d00'),
      accent2: cssv('--accent2', '#4a9eff'),
      accentSoft: cssv('--accentSoft', 'rgba(255,77,0,.14)'),
      ok: cssv('--ok', '#35d07f'),
      warn: cssv('--warn', '#ffc400'),
      err: cssv('--err', '#ff3b30')
    };
  }

  /** 一行控件容器（.labCtl 自动换行） */
  function ctl(parent) {
    var d = E('div', { class: 'labCtl' });
    if (parent) parent.appendChild(d);
    return d;
  }

  /** 实验台按钮；opts.icon 用 CSC.icon 渲染，opts.cls 追加类名 */
  function button(parent, label, onClick, opts) {
    opts = opts || {};
    var b = E('button', { class: 'labBtn' + (opts.cls ? ' ' + opts.cls : ''), type: 'button' });
    if (opts.icon) b.innerHTML = icon(opts.icon);
    var sp = E('span', { text: label });
    b.appendChild(sp);
    b.addEventListener('click', onClick || function () {});
    if (parent) parent.appendChild(b);
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
      }
    };
  }

  /** 统计条：items:[{label, value, hot}] */
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
          s.appendChild(E('b', { class: it.hot ? 'hot' : '', text: String(it.value) }));
          wrap.appendChild(s);
        });
      }
    };
  }

  /** 滑块；返回句柄，set 可外部回写显示值 */
  function slider(parent, opts) {
    var wrap = E('label', { class: 'labSlider' });
    if (opts.label) wrap.appendChild(E('span', { text: opts.label }));
    var inp = E('input', {
      type: 'range',
      min: opts.min != null ? opts.min : 1,
      max: opts.max != null ? opts.max : 5,
      step: opts.step || 1,
      value: opts.value
    });
    var val = E('span', { class: 'mono', text: String(opts.value) });
    wrap.appendChild(inp);
    wrap.appendChild(val);
    inp.addEventListener('input', function () {
      var v = Number(inp.value);
      val.textContent = String(v);
      if (opts.onInput) opts.onInput(v);
    });
    if (parent) parent.appendChild(wrap);
    return {
      el: wrap,
      input: inp,
      set: function (v) { inp.value = String(v); val.textContent = String(v); }
    };
  }

  /** 数字输入框 */
  function numberInput(parent, opts) {
    var inp = E('input', {
      class: 'labNum',
      type: 'number',
      min: opts.min,
      max: opts.max,
      step: opts.step != null ? opts.step : 1,
      value: opts.value
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
    if (parent) parent.appendChild(inp);
    return inp;
  }

  /** 单行文本输入（复用 .qzInput 样式） */
  function textInput(parent, opts) {
    var inp = E('input', {
      class: 'qzInput',
      type: 'text',
      maxlength: opts.maxlength || 16,
      value: opts.value != null ? opts.value : '',
      placeholder: opts.placeholder || ''
    });
    inp.addEventListener('input', function () {
      if (opts.onInput) opts.onInput(inp.value);
    });
    if (parent) parent.appendChild(inp);
    return inp;
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

  function hintLine(parent, text) {
    var d = E('div', { class: 'varEmpty', text: text || '' });
    if (parent) parent.appendChild(d);
    return d;
  }

  /** 代码展示（.codeBox 复用）：有 CSC.codeLines 时用站点统一的 Java 高亮 */
  function codeBlock(parent, lines) {
    var box = E('div', { class: 'codeBox' });
    var pre = E('pre');
    box.appendChild(pre);
    if (parent) parent.appendChild(box);
    var code = (lines || []).join('\n');
    var api = {
      el: box,
      mark: function (lineNo) {
        if (typeof CSC.codeLines === 'function') {
          pre.innerHTML = CSC.codeLines(code, lineNo ? [lineNo] : []);
          return;
        }
        pre.innerHTML = '';
        (lines || []).forEach(function (ln, i) {
          var row = E('span', { class: 'line' + ((i + 1) === lineNo ? ' focus' : '') });
          row.appendChild(E('span', { class: 'ln', text: i + 1 }));
          row.appendChild(document.createTextNode(ln));
          pre.appendChild(row);
        });
      }
    };
    api.mark(0);
    return api;
  }

  /** 生命周期小盒子：定时器、播放器、清理回调 */
  function makeKit() {
    var timers = [];
    var players = [];
    var cleanups = [];
    var dead = false;
    var api = {
      dead: function () { return dead; },
      timeout: function (fn, ms) {
        var id = setTimeout(function () { if (!dead) fn(); }, ms);
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
    return api;
  }

  /** 播放器：requestAnimationFrame 主循环，按 delayFn() 的间隔调用 stepFn */
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
        try { more = stepFn() !== false; } catch (e) { console.error('[labs-b] 播放出错', e); more = false; }
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

  /** 实验台包装器：错误兜底 + 销毁清理（app.js 丢弃 init 返回值，用观察器兜底） */
  function lab(initFn) {
    return function (root, props, ctx) {
      var kit = makeKit();
      var mo = null;
      mountViz(root, function () {
        if (kit.dead() || !root.isConnected) return;
        try {
          initFn(root, props || {}, ctx || {}, kit);
        } catch (e) {
          console.error('[labs-b] 实验台初始化失败', e);
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
      } catch (e) { /* 测试环境无 MutationObserver 时忽略 */ }
      return {
        destroy: function () {
          kit.destroy();
          if (mo) { mo.disconnect(); mo = null; }
        }
      };
    };
  }

  /** Canvas 按容器宽自适应 + DPR 适配；返回 { ctx, w, h }（逻辑像素） */
  function fitCanvas(canvas, ratio, maxW) {
    var hostW = (canvas.parentNode && canvas.parentNode.clientWidth) || 560;
    var w = Math.max(260, Math.min(maxW || 620, hostW - 16));
    var h = Math.round(w * (ratio || 0.6));
    var dpr = (window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  /* ---------- Canvas 小工具 ---------- */
  function norm(x, y) {
    var len = Math.sqrt(x * x + y * y) || 1;
    return { x: x / len, y: y / len };
  }

  function text(ctx, str, x, y, size, color, align, weight) {
    ctx.font = (weight || 600) + ' ' + size + 'px "Segoe UI", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(str, x, y);
  }

  function arrowHead(ctx, x, y, ux, uy, size, color) {
    var a = Math.atan2(uy, ux);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size * Math.cos(a - 0.45), y - size * Math.sin(a - 0.45));
    ctx.lineTo(x - size * Math.cos(a + 0.45), y - size * Math.sin(a + 0.45));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  /* =====================================================================
   * 二、实验台定义
   * ===================================================================== */
  var LABS = {};

  /* =====================================================================
   * 1. dfa —— 有限状态自动机逐字符转移（ch20）
   * 语言：a 的个数为偶数，并且以 b 结尾。
   * 状态按 (a 的奇偶, 末尾是否 b) 分成 q0..q3，q1 是接受态。
   * ===================================================================== */
  var DFA_NODES = [
    { id: 'q0', x: 0.24, y: 0.22, accept: false, desc: 'a 有偶数个，末尾不是 b' },
    { id: 'q1', x: 0.76, y: 0.22, accept: true, desc: 'a 有偶数个，末尾是 b（接受）' },
    { id: 'q2', x: 0.24, y: 0.70, accept: false, desc: 'a 有奇数个，末尾不是 b' },
    { id: 'q3', x: 0.76, y: 0.70, accept: false, desc: 'a 有奇数个，末尾是 b' }
  ];

  var DFA_EDGES = [
    { from: 'q0', to: 'q1', label: 'b', curve: 0 },
    { from: 'q0', to: 'q2', label: 'a', curve: -1 },
    { from: 'q2', to: 'q0', label: 'a', curve: 1 },
    { from: 'q1', to: 'q3', label: 'a', curve: -1 },
    { from: 'q3', to: 'q1', label: 'a', curve: 1 },
    { from: 'q2', to: 'q3', label: 'b', curve: 0 },
    { from: 'q1', to: 'q1', label: 'b', loop: 'up' },
    { from: 'q3', to: 'q3', label: 'b', loop: 'down' }
  ];

  var DFA_TRANS = {
    q0: { a: 'q2', b: 'q1' },
    q1: { a: 'q3', b: 'q1' },
    q2: { a: 'q0', b: 'q3' },
    q3: { a: 'q1', b: 'q3' }
  };

  function dfaNodeById(id) {
    for (var i = 0; i < DFA_NODES.length; i++) {
      if (DFA_NODES[i].id === id) return DFA_NODES[i];
    }
    return DFA_NODES[0];
  }

  function initDfa(root, props, ctx, kit) {
    var state = {
      input: 'aababb',
      pos: 0,
      cur: 'q0',
      last: null,
      done: false,
      accept: false,
      speed: 6
    };
    var view = { ctx: null, w: 0, h: 0 };

    var inputRow = ctl(root);
    inputRow.appendChild(E('span', { class: 'pill', text: '输入串（a / b）' }));
    var input = textInput(inputRow, {
      maxlength: 14,
      value: state.input,
      placeholder: '例如 aababb',
      onInput: function (v) {
        var cleaned = String(v || '').replace(/[^ab]/g, '');
        if (cleaned !== v) input.value = cleaned;
        state.input = cleaned;
        reset();
      }
    });

    var btnRow = ctl(root);
    var playBtn = button(btnRow, '播放', function () { togglePlay(); }, { icon: 'play' });
    button(btnRow, '下一步', function () { player.pause(); stepOnce(); }, { icon: 'step' });
    button(btnRow, '重置', function () { reset(); }, { icon: 'reset' });

    var speedRow = ctl(root);
    slider(speedRow, {
      label: '速度', min: 1, max: 10, value: state.speed,
      onInput: function (v) { state.speed = v; }
    });

    var stage = E('div', { class: 'labStage' });
    var canvas = E('canvas');
    stage.appendChild(canvas);
    root.appendChild(stage);

    var noteBox = note(root);
    var statBox = stats(root);
    hintLine(root, '这个 DFA 接受「a 的个数为偶数、且以 b 结尾」的串。试试 ab、aaab、aababb，再试试空串和 ba。');

    var player = kit.addPlayer(makePlayer(function () { return stepOnce(); }, function () { return 680 - state.speed * 52; }));
    player.onIdle = function () { render(); };

    var resizeTimer = 0;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resizeTimer = 0;
        fit();
        draw();
      }, 120);
    }
    window.addEventListener('resize', onResize);
    kit.onDestroy(function () {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    });

    function fit() {
      var f = fitCanvas(canvas, 0.68, 640);
      if (f) view = f;
    }

    function resizeCanvasIfNeeded() {
      var hostW = (canvas.parentNode && canvas.parentNode.clientWidth) || 0;
      if (!view.ctx || Math.abs(view.w - Math.max(260, Math.min(640, hostW - 16))) > 2) fit();
    }

    function reset() {
      player.pause();
      if (input.value !== state.input) input.value = state.input;
      state.pos = 0;
      state.cur = 'q0';
      state.last = null;
      state.accept = false;
      state.done = state.input.length === 0;
      if (state.done) state.accept = false;
      render();
    }

    function stepOnce() {
      if (state.done) return false;
      var ch = state.input.charAt(state.pos);
      var from = state.cur;
      var to = DFA_TRANS[from][ch];
      state.last = { from: from, to: to };
      state.cur = to;
      state.pos++;
      if (state.pos >= state.input.length) {
        state.done = true;
        state.accept = state.cur === 'q1';
      }
      render();
      return !state.done;
    }

    function togglePlay() {
      if (state.done) reset();
      if (player.playing) {
        player.pause();
        setBtnLabel(playBtn, '播放');
        render();
        return;
      }
      player.play();
      setBtnLabel(playBtn, '暂停');
      render();
    }

    function render() {
      renderNote();
      renderStats();
      draw();
      setBtnLabel(playBtn, player.playing ? '暂停' : '播放');
    }

    function renderNote() {
      var label = state.pos + ' / ' + state.input.length + ' 字符';
      if (state.done) {
        if (state.input.length === 0) {
          noteBox.set('空串：读写头一个字符都没读，停在起始态 <b>q0</b>——不是以 b 结尾，所以<b>拒绝</b>。', label);
        } else if (state.accept) {
          noteBox.set('读完整个串，停在接受态 <b>q1</b>（a 偶数个、末尾是 b）——<b>接受</b>这个串。', label);
        } else {
          noteBox.set('读完整个串，停在 <b>' + state.cur + '</b>，不是接受态——<b>拒绝</b>这个串。', label);
        }
        return;
      }
      if (state.pos === 0) {
        noteBox.set('从起始态 <b>q0</b> 出发。按「下一步」读入第一个字符，或直接播放。', '0 / ' + state.input.length + ' 字符');
        return;
      }
      var last = state.last;
      var ch = state.input.charAt(state.pos - 1);
      var d = dfaNodeById(state.cur).desc;
      noteBox.set('第 ' + state.pos + ' 个字符 <b>' + esc(ch) + '</b>：' + last.from + ' → <b>' + last.to + '</b>。现在处于「' + d + '」。', label);
    }

    function renderStats() {
      var d = dfaNodeById(state.cur).desc;
      statBox.set([
        { label: '当前状态', value: state.cur, hot: true },
        { label: '含义', value: d },
        { label: '已读', value: state.pos + ' / ' + state.input.length },
        { label: '判定', value: state.done ? (state.accept ? '接受' : '拒绝') : '进行中' }
      ]);
    }

    function draw() {
      resizeCanvasIfNeeded();
      if (!view.ctx) return;
      var c = view.ctx;
      var w = view.w;
      var h = view.h;
      var pal = palette();
      c.clearRect(0, 0, w, h);

      var graphH = h * 0.74;
      var r = Math.max(15, Math.min(24, graphH * 0.115));
      var pts = {};
      DFA_NODES.forEach(function (n) {
        pts[n.id] = { x: n.x * w, y: n.y * graphH };
      });

      /* 边 */
      DFA_EDGES.forEach(function (e) {
        var hot = !!(state.last && state.last.from === e.from && state.last.to === e.to);
        if (e.loop) {
          drawLoop(c, pts[e.from], e.loop, e.label, pal, hot, r);
        } else {
          drawEdge(c, pts[e.from], pts[e.to], e.label, e.curve, pal, hot, r);
        }
      });

      /* 起始箭头 */
      var p0 = pts.q0;
      c.strokeStyle = pal.text3;
      c.lineWidth = 1.4;
      c.beginPath();
      c.moveTo(p0.x - r * 2.4, p0.y);
      c.lineTo(p0.x - r - 2, p0.y);
      c.stroke();
      arrowHead(c, p0.x - r - 2, p0.y, 1, 0, 6, pal.text3);

      /* 节点 */
      DFA_NODES.forEach(function (n) {
        drawNode(c, pts[n.id], n, pal, state.cur === n.id, r);
      });

      /* 底部输入串 */
      drawTapeString(c, w, h, state, pal);
    }

    function drawNode(c, p, node, pal, isCur, r) {
      if (node.accept) {
        c.beginPath();
        c.arc(p.x, p.y, r + 4.5, 0, Math.PI * 2);
        c.strokeStyle = isCur ? pal.accent : pal.text3;
        c.lineWidth = 1.5;
        c.stroke();
      }
      c.beginPath();
      c.arc(p.x, p.y, r, 0, Math.PI * 2);
      c.fillStyle = isCur ? pal.accentSoft : pal.bg;
      c.fill();
      c.strokeStyle = isCur ? pal.accent : pal.line2;
      c.lineWidth = isCur ? 2.6 : 1.6;
      c.stroke();
      text(c, node.id, p.x, p.y, Math.round(r * 0.92), isCur ? pal.accent : pal.text, 'center', 700);
    }

    function drawEdge(c, pa, pb, label, curve, pal, hot, r) {
      var color = hot ? pal.accent : pal.line2;
      var lw = hot ? 3 : 1.6;
      var dx = pb.x - pa.x;
      var dy = pb.y - pa.y;
      var u = norm(dx, dy);
      var nx = -u.y;
      var ny = u.x;
      c.strokeStyle = color;
      c.lineWidth = lw;
      var ax, ay, bx, by, cx, cy, mx, my;
      if (!curve) {
        ax = pa.x + u.x * r;
        ay = pa.y + u.y * r;
        bx = pb.x - u.x * r;
        by = pb.y - u.y * r;
        c.beginPath();
        c.moveTo(ax, ay);
        c.lineTo(bx, by);
        c.stroke();
        arrowHead(c, bx, by, u.x, u.y, 7, color);
        mx = (ax + bx) / 2 + nx * 13;
        my = (ay + by) / 2 + ny * 13;
      } else {
        cx = (pa.x + pb.x) / 2 + nx * curve * 26;
        cy = (pa.y + pb.y) / 2 + ny * curve * 26;
        var d1 = norm(cx - pa.x, cy - pa.y);
        ax = pa.x + d1.x * r;
        ay = pa.y + d1.y * r;
        var d2 = norm(pb.x - cx, pb.y - cy);
        bx = pb.x - d2.x * r;
        by = pb.y - d2.y * r;
        c.beginPath();
        c.moveTo(ax, ay);
        c.quadraticCurveTo(cx, cy, bx, by);
        c.stroke();
        var d3 = norm(bx - cx, by - cy);
        arrowHead(c, bx, by, d3.x, d3.y, 7, color);
        mx = 0.25 * ax + 0.5 * cx + 0.25 * bx;
        my = 0.25 * ay + 0.5 * cy + 0.25 * by;
      }
      var labelColor = hot ? pal.accent : pal.text2;
      var fs = Math.max(11, Math.round(r * 0.72));
      text(c, label, mx, my, fs, labelColor, 'center', 700);
    }

    function drawLoop(c, p, side, label, pal, hot, r) {
      var lr = Math.round(r * 0.82);
      var cy = side === 'up' ? p.y - r - lr - 5 : p.y + r + lr + 5;
      var color = hot ? pal.accent : pal.line2;
      c.strokeStyle = color;
      c.lineWidth = hot ? 3 : 1.6;
      c.beginPath();
      c.arc(p.x, cy, lr, 0, Math.PI * 2);
      c.stroke();
      var ex = p.x;
      var ey = side === 'up' ? cy + lr : cy - lr;
      arrowHead(c, ex, ey, side === 'up' ? 0 : 0, side === 'up' ? 1 : -1, 6, color);
      text(c, label, p.x + lr + 10, cy, Math.max(11, Math.round(r * 0.72)), hot ? pal.accent : pal.text2, 'left', 700);
    }

    function drawTapeString(c, w, h, state, pal) {
      var y = h * 0.90;
      var s = state.input;
      var fs = Math.max(13, Math.round(w / 34));
      if (s.length === 0) {
        text(c, '空串 ε', w / 2, y, fs, pal.text2, 'center', 600);
      } else {
        var cw = Math.min(34, (w * 0.78) / s.length);
        var startX = w / 2 - (s.length * cw) / 2;
        for (var i = 0; i < s.length; i++) {
          var ch = s.charAt(i);
          var x = startX + cw * i + cw / 2;
          var read = i < state.pos;
          var cur = i === state.pos && !state.done;
          if (cur) {
            c.fillStyle = pal.accentSoft;
            c.fillRect(x - cw / 2 + 2, y - fs * 0.85, cw - 4, fs * 1.7);
            c.strokeStyle = pal.accent;
            c.lineWidth = 1;
            c.strokeRect(x - cw / 2 + 2, y - fs * 0.85, cw - 4, fs * 1.7);
          }
          text(c, ch, x, y, fs, read ? pal.text3 : (cur ? pal.accent : pal.text2), 'center', 700);
        }
      }
      var verdict = state.done ? (state.accept ? '接受' : '拒绝') : '进行中';
      var vc = state.done ? (state.accept ? pal.ok : pal.err) : pal.text3;
      text(c, verdict, w - 12, h * 0.90, Math.max(12, Math.round(fs * 0.82)), vc, 'right', 700);
    }

    fit();
    reset();
    if (!player.playing) render();
    return { destroy: function () { kit.destroy(); } };
  }

  LABS.dfa = {
    title: 'DFA 逐字符状态转移',
    desc: '输入只含 a/b 的串，逐字符看 4 状态 DFA 怎么走，最后判断接受还是拒绝',
    tags: ['ch20'],
    icon: 'branch',
    order: 22,
    init: lab(initDfa)
  };

  /* =====================================================================
   * 2. turing —— 图灵机纸带单步（ch21）
   * 教学机器：二进制加一。纸带字母表 {0,1,空格}，三个状态：
   *   right（向右扫到串尾）→ carry（向左处理进位）→ halt（停机）。
   * ===================================================================== */
  var TM_STATES = {
    right: { label: '扫描（右移）', desc: '沿纸带向右走，直到遇到空格' },
    carry: { label: '进位（左移）', desc: '把 1 改写成 0 继续进位，遇到 0 改成 1 后停机' },
    halt: { label: '停机', desc: '机器停了，纸带上的 0/1 串就是结果' }
  };

  function tmMakeTape(bits) {
    var cells = ['_', '_'];
    var i;
    for (i = 0; i < bits.length; i++) cells.push(bits.charAt(i));
    cells.push('_', '_', '_');
    return cells;
  }

  function initTuring(root, props, ctx, kit) {
    var state = {
      bits: '1011',
      cells: [],
      head: 2,
      status: 'right',
      steps: 0,
      msg: '',
      done: false,
      result: '',
      speed: 6
    };
    var view = { ctx: null, w: 0, h: 0 };

    var inputRow = ctl(root);
    inputRow.appendChild(E('span', { class: 'pill', text: '二进制输入' }));
    var input = textInput(inputRow, {
      maxlength: 8,
      value: state.bits,
      placeholder: '例如 1011',
      onInput: function (v) {
        var cleaned = String(v || '').replace(/[^01]/g, '');
        if (cleaned !== v) input.value = cleaned;
        state.bits = cleaned;
        reset();
      }
    });

    var btnRow = ctl(root);
    var playBtn = button(btnRow, '播放', function () { togglePlay(); }, { icon: 'play' });
    button(btnRow, '下一步', function () { player.pause(); stepOnce(); }, { icon: 'step' });
    button(btnRow, '重置', function () { reset(); }, { icon: 'reset' });

    var speedRow = ctl(root);
    slider(speedRow, {
      label: '速度', min: 1, max: 10, value: state.speed,
      onInput: function (v) { state.speed = v; }
    });

    var stage = E('div', { class: 'labStage' });
    var canvas = E('canvas');
    stage.appendChild(canvas);
    root.appendChild(stage);

    var noteBox = note(root);
    var statBox = stats(root);
    hintLine(root, '这台机器只做一件事：把纸带上的二进制数加 1。重点是看「读写头」和「状态」怎样一步一步配合——没有任何一行 Java 代码。');

    var player = kit.addPlayer(makePlayer(function () { return stepOnce(); }, function () { return 680 - state.speed * 52; }));
    player.onIdle = function () { render(); };

    var resizeTimer = 0;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resizeTimer = 0; fit(); draw(); }, 120);
    }
    window.addEventListener('resize', onResize);
    kit.onDestroy(function () {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    });

    function fit() {
      var f = fitCanvas(canvas, 0.52, 640);
      if (f) view = f;
    }

    function reset() {
      player.pause();
      state.cells = tmMakeTape(state.bits);
      state.head = 2;
      state.status = 'right';
      state.steps = 0;
      state.done = false;
      state.result = '';
      state.msg = state.bits.length
        ? '输入 <b>' + esc(state.bits) + '</b>。读写头在最左端，先向右扫描到串尾。'
        : '输入是空串（当作 0）。读写头在最左端，向右扫描。';
      render();
    }

    function tapeText() {
      var s = state.cells.join('');
      return s.replace(/^_+/, '').replace(/_+$/, '');
    }

    function stepOnce() {
      if (state.done || state.status === 'halt') return false;
      var cell = state.cells[state.head];
      if (state.status === 'right') {
        if (cell === '0' || cell === '1') {
          state.msg = '状态 <b>扫描</b>：读入 <b>' + cell + '</b>，读写头右移一格。';
          state.head++;
        } else {
          state.msg = '读到空格：串尾到了，读写头左移一格，转入 <b>进位</b> 状态。';
          state.head--;
          state.status = 'carry';
        }
      } else if (state.status === 'carry') {
        if (cell === '1') {
          state.cells[state.head] = '0';
          state.msg = '状态 <b>进位</b>：把 1 改写成 0，进位继续，读写头左移。';
          state.head--;
        } else if (cell === '0') {
          state.cells[state.head] = '1';
          state.status = 'halt';
          state.msg = '状态 <b>进位</b>：遇到 0，改写成 1，进位结束——<b>停机</b>。';
        } else {
          state.cells[state.head] = '1';
          state.status = 'halt';
          state.msg = '一路都是 1：在最左端补一个 1，<b>停机</b>。';
        }
      }
      state.steps++;
      if (state.status === 'halt') {
        state.done = true;
        state.result = tapeText();
        state.msg += ' 结果：<b>' + esc(state.bits || '0') + ' + 1 = ' + esc(state.result) + '</b>。';
      }
      render();
      return state.status !== 'halt';
    }

    function togglePlay() {
      if (state.done) reset();
      if (player.playing) {
        player.pause();
        setBtnLabel(playBtn, '播放');
        render();
        return;
      }
      player.play();
      setBtnLabel(playBtn, '暂停');
      render();
    }

    function render() {
      noteBox.set(state.msg, state.steps + ' 步');
      var st = TM_STATES[state.status];
      statBox.set([
        { label: '状态', value: st.label, hot: true },
        { label: '读写头', value: '第 ' + (state.head + 1) + ' 格' },
        { label: '步数', value: state.steps },
        { label: '纸带', value: tapeText() || '（空）' }
      ]);
      draw();
      setBtnLabel(playBtn, player.playing ? '暂停' : '播放');
    }

    function draw() {
      if (!view.ctx) fit();
      if (!view.ctx) return;
      var c = view.ctx;
      var w = view.w;
      var h = view.h;
      var pal = palette();
      c.clearRect(0, 0, w, h);

      var n = state.cells.length;
      var cw = Math.min(44, (w - 48) / n);
      var ch = Math.min(56, cw * 1.12);
      var startX = w / 2 - (n * cw) / 2;
      var y = h * 0.40;
      var i, x;

      /* 纸带格子 */
      for (i = 0; i < n; i++) {
        x = startX + i * cw;
        var isHead = i === state.head && !state.done;
        c.fillStyle = isHead ? pal.accentSoft : pal.panel;
        c.fillRect(x, y, cw - 2, ch);
        c.strokeStyle = isHead ? pal.accent : pal.line2;
        c.lineWidth = isHead ? 2 : 1.2;
        c.strokeRect(x, y, cw - 2, ch);
        var chStr = state.cells[i] === '_' ? '·' : state.cells[i];
        var color = state.cells[i] === '_'
          ? pal.text3
          : (i === state.head && !state.done ? pal.accent : pal.text);
        text(c, chStr, x + (cw - 2) / 2, y + ch / 2, Math.max(14, Math.round(cw * 0.52)), color, 'center', 700);
      }

      /* 读写头三角 */
      if (!state.done) {
        var hx = startX + state.head * cw + (cw - 2) / 2;
        var hy = y + ch + 6;
        c.fillStyle = pal.accent;
        c.beginPath();
        c.moveTo(hx, hy + 14);
        c.lineTo(hx - 8, hy + 26);
        c.lineTo(hx + 8, hy + 26);
        c.closePath();
        c.fill();
        text(c, '读写头', hx, hy + 38, Math.max(10, Math.round(cw * 0.30)), pal.text2, 'center', 600);
      }

      /* 顶部状态 */
      var st = TM_STATES[state.status];
      text(c, '状态：' + st.label, 12, 16, Math.max(12, Math.round(w / 44)), state.status === 'halt' ? pal.ok : pal.accent, 'left', 700);
      text(c, '第 ' + state.steps + ' 步', w - 12, 16, Math.max(11, Math.round(w / 50)), pal.text3, 'right', 600);

      /* 底部说明 */
      var bottom = y + ch + 68;
      if (bottom > h - 12) bottom = h - 12;
      var msg = state.done
        ? '停机：结果 ' + (state.bits || '0') + ' + 1 = ' + state.result
        : '纸带上的 · 表示空格；空格是「串尾」的标记，也是全 1 时补 1 的位置。';
      text(c, msg, w / 2, bottom, Math.max(11, Math.round(w / 46)), state.done ? pal.ok : pal.text3, 'center', state.done ? 700 : 500);
    }

    fit();
    reset();
    return { destroy: function () { kit.destroy(); } };
  }

  LABS.turing = {
    title: '图灵机纸带单步',
    desc: '给一个二进制串，看「扫描 + 进位」两个状态怎样驱动读写头把它加 1',
    tags: ['ch21'],
    icon: 'memory',
    order: 23,
    init: lab(initTuring)
  };

  /* =====================================================================
   * 3. sat —— 3-SAT 穷举与指数增长（ch22）
   * 小规模随机 3-SAT 实例：n 个变量、m 个子句，穷举全部 2^n 个赋值。
   * 画布上画 2^n 的增长曲线，让「指数爆炸」变成看得见的形状。
   * ===================================================================== */
  var SAT_MIN_N = 3;
  var SAT_MAX_N = 12;

  function satMakeClauses(n, m) {
    var clauses = [];
    var i, j;
    for (i = 0; i < m; i++) {
      var vars = [];
      while (vars.length < 3) {
        var v = Math.floor(Math.random() * n);
        if (vars.indexOf(v) < 0) vars.push(v);
      }
      var lits = [];
      for (j = 0; j < 3; j++) lits.push({ v: vars[j], neg: Math.random() < 0.5 });
      clauses.push(lits);
    }
    return clauses;
  }

  function satClauseHtml(cl) {
    var parts = [];
    for (var i = 0; i < cl.length; i++) parts.push((cl[i].neg ? '¬' : '') + 'x' + cl[i].v);
    return '(' + parts.join(' ∨ ') + ')';
  }

  function satSolve(clauses, n) {
    var total = 1 << n;
    var checked = 0;
    var sols = [];
    var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    for (var mask = 0; mask < total; mask++) {
      checked++;
      var sat = true;
      for (var i = 0; i < clauses.length; i++) {
        var cl = clauses[i];
        var ok = false;
        for (var j = 0; j < cl.length; j++) {
          var lit = cl[j];
          var val = ((mask >> lit.v) & 1) === 1;
          if (lit.neg ? !val : val) { ok = true; break; }
        }
        if (!ok) { sat = false; break; }
      }
      if (sat) sols.push(mask);
    }
    var t1 = (window.performance && performance.now) ? performance.now() : Date.now();
    return { checked: checked, sols: sols, ms: t1 - t0 };
  }

  function satBits(mask, n) {
    var s = '';
    for (var i = n - 1; i >= 0; i--) s += ((mask >> i) & 1);
    return s;
  }

  function initSat(root, props, ctx, kit) {
    var state = {
      n: 5,
      m: 4,
      clauses: [],
      checked: 0,
      sols: [],
      ms: 0,
      solved: false
    };
    var view = { ctx: null, w: 0, h: 0 };

    var row1 = ctl(root);
    var nSlider = slider(row1, {
      label: '变量 n', min: SAT_MIN_N, max: SAT_MAX_N, value: state.n,
      onInput: function (v) { state.n = v; regenerate(); }
    });
    slider(row1, {
      label: '子句 m', min: 2, max: 6, value: state.m,
      onInput: function (v) { state.m = v; regenerate(); }
    });

    var row2 = ctl(root);
    button(row2, '换一批子句', function () { regenerate(); }, { icon: 'reset' });
    var playBtn = button(row2, '穷举求解', function () { solve(); }, { icon: 'play' });

    var stage = E('div', { class: 'labStage' });
    var canvas = E('canvas');
    stage.appendChild(canvas);
    root.appendChild(stage);

    var noteBox = note(root);
    var statBox = stats(root);
    hintLine(root, '拖动「变量 n」看 2ⁿ 怎么涨：n=12 时是 4096，而真实 SAT 求解器要面对的 n 动辄上百——这就是 P vs NP 问题的现实重量。');

    var resizeTimer = 0;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resizeTimer = 0; fit(); draw(); }, 120);
    }
    window.addEventListener('resize', onResize);
    kit.onDestroy(function () {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    });

    function fit() {
      var f = fitCanvas(canvas, 0.5, 640);
      if (f) view = f;
    }

    function regenerate() {
      state.clauses = satMakeClauses(state.n, state.m);
      state.solved = false;
      state.sols = [];
      state.checked = 0;
      state.ms = 0;
      render();
    }

    function solve() {
      var r = satSolve(state.clauses, state.n);
      state.checked = r.checked;
      state.sols = r.sols;
      state.ms = r.ms;
      state.solved = true;
      render();
    }

    function render() {
      var clauseHtml = state.clauses.map(satClauseHtml).join(' ∧ ');
      var head = '实例：' + state.n + ' 个变量、' + state.m + ' 个子句。<b>' + esc(clauseHtml) + '</b>';
      var extra = state.solved ? (state.sols.length ? '有解' : '无解') : '未求解';
      noteBox.set(head, extra);
      var best = state.solved && state.sols.length ? '是 · ' + satBits(state.sols[0], state.n) : (state.solved ? '没有' : '未求解');
      statBox.set([
        { label: '穷举赋值', value: state.checked || 0, hot: true },
        { label: '2ⁿ', value: Math.pow(2, state.n) },
        { label: '满足解', value: state.solved ? state.sols.length : '—' },
        { label: '耗时', value: state.solved ? (state.ms < 1 ? '< 1 ms' : state.ms.toFixed(1) + ' ms') : '—' },
        { label: '一个解', value: best }
      ]);
      draw();
    }

    function draw() {
      if (!view.ctx) fit();
      if (!view.ctx) return;
      var c = view.ctx;
      var w = view.w;
      var h = view.h;
      var pal = palette();
      c.clearRect(0, 0, w, h);

      var padL = Math.round(w * 0.115);
      var padR = 14;
      var padT = 18;
      var padB = 30;
      var plotW = w - padL - padR;
      var plotH = h - padT - padB;
      var minN = SAT_MIN_N;
      var maxN = SAT_MAX_N;
      var maxVal = Math.pow(2, maxN);

      function px(nv) { return padL + (nv - minN) / (maxN - minN) * plotW; }
      function py(val) { return padT + plotH - (val / maxVal) * plotH; }

      /* 网格与刻度 */
      var ticks = [0, 0.25, 0.5, 0.75, 1];
      c.strokeStyle = pal.line;
      c.lineWidth = 1;
      ticks.forEach(function (t) {
        var yy = padT + plotH * (1 - t);
        c.beginPath();
        c.moveTo(padL, yy);
        c.lineTo(padL + plotW, yy);
        c.stroke();
        var label = t === 0 ? '0' : (Math.round(maxVal * t) >= 1000 ? (Math.round(maxVal * t / 100) / 10) + 'K' : String(Math.round(maxVal * t)));
        text(c, label, padL - 8, yy, Math.max(10, Math.round(w / 56)), pal.text3, 'right', 500);
      });

      /* 指数曲线 */
      c.beginPath();
      var first = true;
      for (var nv = minN; nv <= maxN; nv++) {
        var xx = px(nv);
        var yy = py(Math.pow(2, nv));
        if (first) { c.moveTo(xx, yy); first = false; } else { c.lineTo(xx, yy); }
      }
      c.strokeStyle = pal.accent2;
      c.lineWidth = 2.4;
      c.stroke();

      /* 数据点 */
      for (nv = minN; nv <= maxN; nv++) {
        xx = px(nv);
        yy = py(Math.pow(2, nv));
        var isCur = nv === state.n;
        c.beginPath();
        c.arc(xx, yy, isCur ? 6 : 3.2, 0, Math.PI * 2);
        c.fillStyle = isCur ? pal.accent : pal.accent2;
        c.fill();
        if (isCur) {
          c.strokeStyle = pal.accent;
          c.lineWidth = 1.2;
          c.beginPath();
          c.setLineDash([3, 4]);
          c.moveTo(xx, yy);
          c.lineTo(xx, padT + plotH);
          c.stroke();
          c.setLineDash([]);
        }
      }

      /* x 轴标签 */
      for (nv = minN; nv <= maxN; nv += (maxN - minN > 6 ? 2 : 1)) {
        text(c, String(nv), px(nv), padT + plotH + 16, Math.max(10, Math.round(w / 58)), pal.text3, 'center', 500);
      }

      /* 当前值标注 */
      var curVal = Math.pow(2, state.n);
      var cx2 = px(state.n);
      var cy2 = py(curVal);
      var boxW = Math.max(110, Math.round(w * 0.2));
      var boxX = Math.min(padL + plotW - boxW, Math.max(padL, cx2 + 12));
      var boxY = Math.max(padT + 2, cy2 - 44);
      c.fillStyle = pal.bg;
      c.fillRect(boxX, boxY, boxW, 38);
      c.strokeStyle = pal.accent;
      c.lineWidth = 1.2;
      c.strokeRect(boxX, boxY, boxW, 38);
      text(c, '2^' + state.n + ' = ' + curVal, boxX + boxW / 2, boxY + 13, Math.max(12, Math.round(w / 44)), pal.accent, 'center', 700);
      text(c, '个赋值', boxX + boxW / 2, boxY + 29, Math.max(11, Math.round(w / 50)), pal.text2, 'center', 500);

      text(c, 'n（变量个数）', padL + plotW / 2, h - 8, Math.max(10, Math.round(w / 58)), pal.text3, 'center', 500);
      text(c, '赋值数 2ⁿ', padL, padT - 6, Math.max(10, Math.round(w / 58)), pal.text3, 'left', 500);
    }

    fit();
    regenerate();
    return { destroy: function () { kit.destroy(); } };
  }

  LABS.sat = {
    title: '3-SAT 穷举实验室',
    desc: '随机生成小规模 3-SAT，穷举全部赋值并画出 2ⁿ 的爆炸曲线',
    tags: ['ch22'],
    icon: 'grid',
    order: 24,
    init: lab(initSat)
  };

  /* =====================================================================
   * 4. binary —— 补码、浮点与位运算（ch23）
   * 两种视角：8/16 位整数补码；32 位 IEEE 754 单精度浮点。
   * ===================================================================== */
  var BIN_OPS = [
    { value: 'none', label: '不做运算' },
    { value: 'and', label: 'AND 0x0F' },
    { value: 'or', label: 'OR 0x80' },
    { value: 'xor', label: 'XOR 0xFF' },
    { value: 'not', label: '按位取反 ~' },
    { value: 'shl', label: '左移 1 位' },
    { value: 'sar', label: '算术右移 1 位' },
    { value: 'lshr', label: '逻辑右移 1 位' }
  ];

  function binOpLabel(op) {
    for (var i = 0; i < BIN_OPS.length; i++) {
      if (BIN_OPS[i].value === op) return BIN_OPS[i].label;
    }
    return '';
  }

  function initBinary(root, props, ctx, kit) {
    var state = { mode: 'int', width: 8, value: 42, op: 'none' };
    var view = { ctx: null, w: 0, h: 0 };
    var dv = new DataView(new ArrayBuffer(4));

    var modeRow = ctl(root);
    selectBox(modeRow, [
      { value: 'int', label: '整数（补码）' },
      { value: 'float', label: '单精度浮点' }
    ], state.mode, function (v) { state.mode = v; syncUi(); render(); });

    var widthRow = ctl(root);
    var widthSel = selectBox(widthRow, [
      { value: '8', label: '8 位' },
      { value: '16', label: '16 位' }
    ], String(state.width), function (v) { state.width = Number(v); render(); });

    var valRow = ctl(root);
    valRow.appendChild(E('span', { class: 'pill', text: '数值' }));
    var inp = numberInput(valRow, {
      min: -1000000, max: 1000000, step: 1, value: String(state.value),
      onInput: function (v) { state.value = Number(v) || 0; render(); }
    });

    var opRow = ctl(root);
    opRow.appendChild(E('span', { class: 'pill', text: '位运算' }));
    var opSel = selectBox(opRow, BIN_OPS, state.op, function (v) { state.op = v; render(); });

    var stage = E('div', { class: 'labStage' });
    var canvas = E('canvas');
    stage.appendChild(canvas);
    root.appendChild(stage);

    var noteBox = note(root);
    var statBox = stats(root);
    hintLine(root, '数字在机器里只有 0 和 1。整数用补码表示负数，浮点数用「符号 + 指数 + 尾数」表示小数——切换两种视角，看同一串位怎样被解释成不同的数。');

    var resizeTimer = 0;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resizeTimer = 0; fit(); draw(); }, 120);
    }
    window.addEventListener('resize', onResize);
    kit.onDestroy(function () {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    });

    function fit() {
      var f = fitCanvas(canvas, 0.58, 640);
      if (f) view = f;
    }

    function syncUi() {
      var isInt = state.mode === 'int';
      widthSel.disabled = !isInt;
      opSel.disabled = !isInt;
      if (isInt) {
        var lo = -(1 << (state.width - 1));
        var hi = (1 << (state.width - 1)) - 1;
        if (state.value < lo) state.value = lo;
        if (state.value > hi) state.value = hi;
        inp.value = String(Math.round(state.value));
      } else {
        inp.value = String(state.value);
      }
    }

    function intView() {
      var width = state.width;
      var lo = -(1 << (width - 1));
      var hi = (1 << (width - 1)) - 1;
      var v = Math.round(Number(inp.value) || 0);
      if (v < lo) v = lo;
      if (v > hi) v = hi;
      state.value = v;
      var mask = width === 8 ? 0xFF : 0xFFFF;
      var u = v & mask;
      var before = u;
      switch (state.op) {
        case 'and': u = u & 0x0F; break;
        case 'or': u = u | 0x80; break;
        case 'xor': u = u ^ 0xFF; break;
        case 'not': u = (~u) & mask; break;
        case 'shl': u = (u << 1) & mask; break;
        case 'sar':
          u = (width === 8 ? ((u << 24) >> 24) : ((u << 16) >> 16)) >> 1;
          u = u & mask;
          break;
        case 'lshr': u = (u >>> 1) & mask; break;
      }
      var signed = u >= (1 << (width - 1)) ? u - (1 << width) : u;
      var bits = '';
      var i;
      for (i = width - 1; i >= 0; i--) bits += ((u >> i) & 1);
      return {
        kind: 'int',
        width: width,
        u: u,
        signed: signed,
        before: before,
        bits: bits,
        hex: u.toString(16).toUpperCase(),
        bin: bits,
        opText: state.op === 'none' ? '' : binOpLabel(state.op)
      };
    }

    function floatView() {
      var v = Number(inp.value) || 0;
      state.value = v;
      dv.setFloat32(0, v);
      var u32 = dv.getUint32(0);
      var sign = (u32 >>> 31) & 1;
      var exp = (u32 >>> 23) & 0xFF;
      var mant = u32 & 0x7FFFFF;
      var back = dv.getFloat32(0);
      var bits = '';
      var i;
      for (i = 31; i >= 0; i--) bits += ((u32 >>> i) & 1);
      var hex = u32.toString(16).toUpperCase();
      while (hex.length < 8) hex = '0' + hex;
      return {
        kind: 'float',
        u32: u32,
        sign: sign,
        exp: exp,
        mant: mant,
        back: back,
        bits: bits,
        hex: hex
      };
    }

    function render() {
      var isInt = state.mode === 'int';
      var data = isInt ? intView() : floatView();
      if (!isInt) {
        noteBox.set('单精度浮点：1 位符号 + 8 位指数（偏移 127）+ 23 位尾数。十进制小数大多存不成精确值，读回来会有一点点偏差。<b>' + esc(String(data.back)) + '</b> 就是 32 位里真正的值。', 'IEEE 754');
        statBox.set([
          { label: '符号', value: data.sign ? '1（负）' : '0（正）' },
          { label: '指数', value: data.exp + '（真值 ' + (data.exp - 127) + '）' },
          { label: '尾数', value: '0x' + data.mant.toString(16).toUpperCase(), hot: true },
          { label: '存储值', value: String(data.back) },
          { label: '位模式', value: '0x' + data.hex }
        ]);
      } else {
        var text = '补码：' + data.width + ' 位，最高位是符号位。按无符号读是 <b>' + data.u + '</b>，按补码读是 <b>' + data.signed + '</b>。';
        if (data.opText) text += ' 先做运算「' + esc(data.opText) + '」，再用同样方式解读。';
        noteBox.set(text, '补码');
        statBox.set([
          { label: '十进制', value: data.signed, hot: true },
          { label: '十六进制', value: '0x' + data.hex },
          { label: '无符号', value: data.u },
          { label: '二进制', value: data.bits.replace(/(.{4})(?=.)/g, '$1 ') }
        ]);
      }
      draw(data);
    }

    function draw(data) {
      if (!view.ctx) fit();
      if (!view.ctx) return;
      var c = view.ctx;
      var w = view.w;
      var h = view.h;
      var pal = palette();
      c.clearRect(0, 0, w, h);

      var bits = data.bits;
      var n = bits.length;
      var pad = 16;
      var gap = n > 16 ? 2 : 6;
      var cellW = (w - pad * 2 - (n - 1) * gap) / n;
      var cellH = Math.min(46, Math.max(24, cellW * 0.92));
      var y = 58;
      var i, x;

      /* 顶部：一句话说明值 */
      var top = data.kind === 'int'
        ? '补码（' + data.width + ' 位）：' + data.signed
        : 'IEEE 754 单精度：' + data.back;
      text(c, top, pad, 20, Math.max(13, Math.round(w / 42)), pal.text, 'left', 700);
      text(c, '0x' + data.hex, w - pad, 20, Math.max(12, Math.round(w / 46)), pal.text2, 'right', 600);

      /* 段标签 */
      if (data.kind === 'float') {
        text(c, '符号 1', pad + cellW / 2, y - 10, Math.max(10, Math.round(w / 60)), pal.accent, 'left', 600);
        text(c, '指数 8', pad + cellW + gap + cellW * 2, y - 10, Math.max(10, Math.round(w / 60)), pal.accent2, 'left', 600);
        text(c, '尾数 23', pad + (cellW + gap) * 9 + cellW * 2, y - 10, Math.max(10, Math.round(w / 60)), pal.text3, 'left', 600);
      } else {
        text(c, data.width + ' 个二进制位（每 4 位一组）', pad, y - 10, Math.max(10, Math.round(w / 58)), pal.text3, 'left', 500);
      }

      /* 位格 */
      for (i = 0; i < n; i++) {
        x = pad + i * (cellW + gap);
        var bit = bits.charAt(i);
        var color = pal.text3;
        var fill = pal.panel;
        if (data.kind === 'float') {
          if (i < 1) { color = pal.accent; fill = pal.accentSoft; }
          else if (i < 9) { color = pal.accent2; fill = pal.panel; }
        } else {
          if (i === 0) color = pal.accent;
        }
        c.fillStyle = fill;
        c.fillRect(x, y, cellW, cellH);
        c.strokeStyle = (data.kind === 'float' && i < 9) ? (i < 1 ? pal.accent : pal.accent2) : pal.line2;
        c.lineWidth = 1.2;
        c.strokeRect(x, y, cellW, cellH);
        text(c, bit, x + cellW / 2, y + cellH / 2, Math.max(11, Math.min(18, Math.round(cellW * 0.62))), color, 'center', 700);
        if (data.kind === 'int' && n <= 16 && (n - 1 - i) % 4 === 0) {
          text(c, String(n - 1 - i), x + cellW / 2, y + cellH + 12, Math.max(9, Math.round(w / 70)), pal.text3, 'center', 500);
        }
      }

      /* 底部说明 */
      var by = y + cellH + 34;
      if (data.kind === 'float') {
        text(c, '符号 0 = 正数，1 = 负数；指数减 127 才是真正的 2 的幂；尾数省略了开头的 1。', pad, by, Math.max(11, Math.round(w / 48)), pal.text2, 'left', 500);
        text(c, '同一个 0x' + data.hex + '，换个方式解读，数值可能完全不同。', pad, by + 20, Math.max(11, Math.round(w / 48)), pal.text2, 'left', 500);
      } else {
        var opTxt = data.opText ? '先做运算「' + data.opText + '」后：' : '直接读：';
        text(c, opTxt + '十进制 ' + data.signed + '，无符号 ' + data.u + '，十六进制 0x' + data.hex + '。', pad, by, Math.max(11, Math.round(w / 48)), pal.text2, 'left', 500);
        text(c, '最高位为 0 时代码就是它本身；为 1 时按「取反加一」的补码规则读成负数。', pad, by + 20, Math.max(11, Math.round(w / 48)), pal.text2, 'left', 500);
      }
    }

    syncUi();
    fit();
    render();
    return { destroy: function () { kit.destroy(); } };
  }

  LABS.binary = {
    title: '补码、浮点与位运算',
    desc: '在 8/16 位整数与 32 位浮点之间切换，逐位看清符号位、指数、尾数与位运算',
    tags: ['ch23'],
    icon: 'cpu',
    order: 25,
    init: lab(initBinary)
  };

  /* =====================================================================
   * 5. toyvm —— TOY 虚拟机单步（ch24）
   * 16 位字长、16 个寄存器、256 格内存的 TOY 机器（R[0] 恒 0）。
   * 两个程序：8 + 5；1…10 求和（循环）。
   * ===================================================================== */
  var TOY_PROGRAMS = {
    add: {
      name: '8 + 5（加法）',
      start: 0x10,
      code: [
        { addr: 0x10, word: 0x8A15, note: 'R[A] ← M[0x15] = 8' },
        { addr: 0x11, word: 0x8B16, note: 'R[B] ← M[0x16] = 5' },
        { addr: 0x12, word: 0x1CAB, note: 'R[C] ← 8 + 5 = 13' },
        { addr: 0x13, word: 0x9C17, note: 'M[0x17] ← R[C]' },
        { addr: 0x14, word: 0x0000, note: '停机' }
      ],
      data: [{ addr: 0x15, word: 0x0008 }, { addr: 0x16, word: 0x0005 }],
      resultAddr: 0x17
    },
    sum: {
      name: '1…10 求和（循环）',
      start: 0x20,
      code: [
        { addr: 0x20, word: 0x7A00, note: 'R[A] ← 0，累加器清零' },
        { addr: 0x21, word: 0x7B0A, note: 'R[B] ← 10，计数器置初值' },
        { addr: 0x22, word: 0x7E01, note: 'R[E] ← 1，步长' },
        { addr: 0x23, word: 0x1AAB, note: 'R[A] ← R[A] + R[B]' },
        { addr: 0x24, word: 0x2BBE, note: 'R[B] ← R[B] - 1' },
        { addr: 0x25, word: 0xDB23, note: 'R[B] > 0，跳回 0x23 继续循环' },
        { addr: 0x26, word: 0x9A27, note: 'M[0x27] ← R[A]' },
        { addr: 0x27, word: 0x0000, note: '停机' }
      ],
      data: [],
      resultAddr: 0x27
    }
  };

  function toyHex4(v) {
    var s = (v & 0xFFFF).toString(16).toUpperCase();
    while (s.length < 4) s = '0' + s;
    return s;
  }

  function toyHex2(v) {
    var s = (v & 0xFF).toString(16).toUpperCase();
    while (s.length < 2) s = '0' + s;
    return s;
  }

  function toyReg(i) {
    return 'R[' + i.toString(16).toUpperCase() + ']';
  }

  function toyDisasm(word) {
    var op = (word >>> 12) & 0xF;
    var d = (word >>> 8) & 0xF;
    var s = (word >>> 4) & 0xF;
    var t = word & 0xF;
    var addr = word & 0xFF;
    switch (op) {
      case 0x0: return 'halt';
      case 0x1: return 'add   ' + toyReg(d) + ', ' + toyReg(s) + ', ' + toyReg(t);
      case 0x2: return 'sub   ' + toyReg(d) + ', ' + toyReg(s) + ', ' + toyReg(t);
      case 0x3: return 'and   ' + toyReg(d) + ', ' + toyReg(s) + ', ' + toyReg(t);
      case 0x4: return 'xor   ' + toyReg(d) + ', ' + toyReg(s) + ', ' + toyReg(t);
      case 0x5: return 'shl   ' + toyReg(d) + ', ' + toyReg(s) + ', ' + toyReg(t);
      case 0x6: return 'shr   ' + toyReg(d) + ', ' + toyReg(s) + ', ' + toyReg(t);
      case 0x7: return 'load  ' + toyReg(d) + ', addr ' + toyHex2(addr);
      case 0x8: return 'load  ' + toyReg(d) + ', M[' + toyHex2(addr) + ']';
      case 0x9: return 'store ' + toyReg(d) + ', M[' + toyHex2(addr) + ']';
      case 0xA: return 'load  ' + toyReg(d) + ', M[' + toyReg(t) + ']';
      case 0xB: return 'store ' + toyReg(d) + ', M[' + toyReg(t) + ']';
      case 0xC: return 'brz   ' + toyReg(d) + ', ' + toyHex2(addr);
      case 0xD: return 'bpos  ' + toyReg(d) + ', ' + toyHex2(addr);
      case 0xE: return 'jmp   ' + toyReg(d);
      case 0xF: return 'jal   ' + toyReg(d) + ', ' + toyHex2(addr);
      default: return '???';
    }
  }

  function initToyvm(root, props, ctx, kit) {
    var state = {
      progKey: 'add',
      M: [],
      R: [],
      PC: 0,
      halted: false,
      steps: 0,
      msg: '',
      lastReg: -1
    };
    var view = { ctx: null, w: 0, h: 0 };

    var progRow = ctl(root);
    progRow.appendChild(E('span', { class: 'pill', text: '程序' }));
    selectBox(progRow, [
      { value: 'add', label: '8 + 5（加法）' },
      { value: 'sum', label: '1…10 求和（循环）' }
    ], state.progKey, function (v) { state.progKey = v; vmReset(); });

    var btnRow = ctl(root);
    var playBtn = button(btnRow, '播放', function () { togglePlay(); }, { icon: 'play' });
    button(btnRow, '单步', function () { player.pause(); vmStep(); }, { icon: 'step' });
    button(btnRow, '重置', function () { vmReset(); }, { icon: 'reset' });

    var speedRow = ctl(root);
    slider(speedRow, {
      label: '速度', min: 1, max: 10, value: 6,
      onInput: function (v) { state.speed = v; }
    });
    state.speed = 6;

    var stage = E('div', { class: 'labStage' });
    var canvas = E('canvas');
    stage.appendChild(canvas);
    root.appendChild(stage);

    var noteBox = note(root);
    var statBox = stats(root);
    hintLine(root, 'TOY 是最小的「存储程序」机器：程序和数据都放在同一片内存里，CPU 只做「取指 → 译码 → 执行」。单步几遍，你会看到 PC 怎样在地址之间跳来跳去。');

    var player = kit.addPlayer(makePlayer(function () { return vmStep(); }, function () { return 760 - state.speed * 60; }));
    player.onIdle = function () { render(); };

    var resizeTimer = 0;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resizeTimer = 0; fit(); draw(); }, 120);
    }
    window.addEventListener('resize', onResize);
    kit.onDestroy(function () {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    });

    function fit() {
      var f = fitCanvas(canvas, 0.78, 620);
      if (f) view = f;
    }

    function vmReset() {
      player.pause();
      var p = TOY_PROGRAMS[state.progKey];
      var i;
      state.M = [];
      for (i = 0; i < 256; i++) state.M.push(0);
      state.R = [];
      for (i = 0; i < 16; i++) state.R.push(0);
      for (i = 0; i < p.code.length; i++) state.M[p.code[i].addr] = p.code[i].word;
      for (i = 0; i < p.data.length; i++) state.M[p.data[i].addr] = p.data[i].word;
      state.PC = p.start;
      state.halted = false;
      state.steps = 0;
      state.lastReg = -1;
      state.msg = '程序已装入内存：<b>' + esc(p.name) + '</b>。PC 指向 0x' + toyHex2(p.start) + '，按「单步」开始取指。';
      render();
    }

    function vmStep() {
      if (state.halted) return false;
      var p = TOY_PROGRAMS[state.progKey];
      var pc = state.PC;
      var IR = state.M[pc];
      state.PC = (state.PC + 1) & 0xFF;
      var op = (IR >>> 12) & 0xF;
      var d = (IR >>> 8) & 0xF;
      var s = (IR >>> 4) & 0xF;
      var t = IR & 0xF;
      var addr = IR & 0xFF;
      var msg = '取指 M[' + toyHex2(pc) + '] = <b>' + toyHex4(IR) + '</b> → ' + esc(toyDisasm(IR)) + '。';
      state.lastReg = -1;
      var v = 0;
      switch (op) {
        case 0x0:
          state.halted = true;
          msg += ' halt：机器停机。';
          break;
        case 0x1:
          v = state.R[s] + state.R[t];
          state.R[d] = v;
          state.lastReg = d;
          msg += ' ' + toyReg(d) + ' ← ' + state.R[s] + ' + ' + state.R[t] + ' = ' + v + '。';
          break;
        case 0x2:
          v = state.R[s] - state.R[t];
          state.R[d] = v;
          state.lastReg = d;
          msg += ' ' + toyReg(d) + ' ← ' + state.R[s] + ' - ' + state.R[t] + ' = ' + v + '。';
          break;
        case 0x3:
          v = state.R[s] & state.R[t];
          state.R[d] = v;
          state.lastReg = d;
          msg += ' ' + toyReg(d) + ' ← ' + toyReg(s) + ' AND ' + toyReg(t) + '。';
          break;
        case 0x4:
          v = state.R[s] ^ state.R[t];
          state.R[d] = v;
          state.lastReg = d;
          msg += ' ' + toyReg(d) + ' ← ' + toyReg(s) + ' XOR ' + toyReg(t) + '。';
          break;
        case 0x5:
          v = state.R[s] << (state.R[t] & 0xF);
          state.R[d] = v;
          state.lastReg = d;
          msg += ' 左移：' + toyReg(d) + ' ← ' + toyReg(s) + ' << ' + toyReg(t) + '。';
          break;
        case 0x6:
          v = state.R[s] >> (state.R[t] & 0xF);
          state.R[d] = v;
          state.lastReg = d;
          msg += ' 右移：' + toyReg(d) + ' ← ' + toyReg(s) + ' >> ' + toyReg(t) + '。';
          break;
        case 0x7:
          state.R[d] = addr;
          state.lastReg = d;
          msg += ' 把地址 ' + toyHex2(addr) + ' 这个数本身写入 ' + toyReg(d) + '。';
          break;
        case 0x8:
          state.R[d] = state.M[addr];
          state.lastReg = d;
          msg += ' ' + toyReg(d) + ' ← M[' + toyHex2(addr) + '] = ' + toyHex4(state.M[addr]) + '。';
          break;
        case 0x9:
          state.M[addr] = state.R[d] & 0xFFFF;
          msg += ' M[' + toyHex2(addr) + '] ← ' + toyReg(d) + ' = ' + toyHex4(state.R[d]) + '。';
          break;
        case 0xA:
          state.R[d] = state.M[state.R[t] & 0xFF];
          state.lastReg = d;
          msg += ' 间接取数：地址在 ' + toyReg(t) + ' 里。';
          break;
        case 0xB:
          state.M[state.R[t] & 0xFF] = state.R[d] & 0xFFFF;
          msg += ' 间接存数：地址在 ' + toyReg(t) + ' 里。';
          break;
        case 0xC:
          if ((state.R[d] & 0xFFFF) === 0) {
            state.PC = addr;
            msg += ' ' + toyReg(d) + ' = 0，跳转到 0x' + toyHex2(addr) + '。';
          } else {
            msg += ' ' + toyReg(d) + ' ≠ 0，不跳转。';
          }
          break;
        case 0xD:
          if (state.R[d] > 0) {
            state.PC = addr;
            msg += ' ' + toyReg(d) + ' > 0，跳转到 0x' + toyHex2(addr) + '。';
          } else {
            msg += ' ' + toyReg(d) + ' ≤ 0，不跳转。';
          }
          break;
        case 0xE:
          state.PC = state.R[d] & 0xFF;
          msg += ' 无条件跳转到 ' + toyReg(d) + ' 里的地址。';
          break;
        case 0xF:
          state.R[d] = state.PC;
          state.PC = addr;
          msg += ' 把返回地址存进 ' + toyReg(d) + '，跳到 0x' + toyHex2(addr) + '。';
          break;
      }
      var i;
      for (i = 0; i < 16; i++) state.R[i] = state.R[i] & 0xFFFF;
      state.R[0] = 0;
      state.steps++;
      for (i = 0; i < p.code.length; i++) {
        if (p.code[i].addr === pc) msg += ' 注释：' + p.code[i].note + '。';
      }
      state.msg = msg;
      render();
      return !state.halted;
    }

    function togglePlay() {
      if (state.halted) vmReset();
      if (player.playing) {
        player.pause();
        setBtnLabel(playBtn, '播放');
        render();
        return;
      }
      player.play();
      setBtnLabel(playBtn, '暂停');
      render();
    }

    function render() {
      var p = TOY_PROGRAMS[state.progKey];
      var ir = state.M[state.PC];
      var result = state.M[p.resultAddr];
      noteBox.set(state.msg, state.steps + ' 步');
      statBox.set([
        { label: 'PC', value: '0x' + toyHex2(state.PC), hot: true },
        { label: 'IR（下一条）', value: toyHex4(ir) },
        { label: '指令', value: toyDisasm(ir) },
        { label: '结果 M[' + toyHex2(p.resultAddr) + ']', value: state.halted ? toyHex4(result) + '（' + result + '）' : '—' }
      ]);
      draw();
      setBtnLabel(playBtn, player.playing ? '暂停' : '播放');
    }

    function draw() {
      if (!view.ctx) fit();
      if (!view.ctx) return;
      var c = view.ctx;
      var w = view.w;
      var h = view.h;
      var pal = palette();
      var p = TOY_PROGRAMS[state.progKey];
      c.clearRect(0, 0, w, h);

      text(c, '程序：' + p.name, 16, 20, Math.max(13, Math.round(w / 42)), pal.text, 'left', 700);
      text(c, 'PC = 0x' + toyHex2(state.PC) + (state.halted ? '（停机）' : ''), w - 16, 20, Math.max(12, Math.round(w / 46)), state.halted ? pal.ok : pal.accent, 'right', 700);

      /* 寄存器 4×4 */
      var gx = 16;
      var gy = 36;
      var gw = w - 32;
      var gh = h * 0.44;
      var cw = gw / 4;
      var chh = gh / 4;
      var r, x, y;
      for (r = 0; r < 16; r++) {
        x = gx + (r % 4) * cw;
        y = gy + Math.floor(r / 4) * chh;
        c.fillStyle = r === 0 ? pal.bg2 : (r === state.lastReg ? pal.accentSoft : pal.panel);
        c.fillRect(x, y, cw - 3, chh - 3);
        c.strokeStyle = r === state.lastReg ? pal.accent : pal.line;
        c.lineWidth = r === state.lastReg ? 2 : 1;
        c.strokeRect(x, y, cw - 3, chh - 3);
        text(c, toyReg(r), x + 6, y + 13, Math.max(9, Math.round(w / 80)), r === 0 ? pal.text3 : pal.text2, 'left', 600);
        text(c, toyHex4(state.R[r]), x + (cw - 3) / 2, y + chh - 13, Math.max(11, Math.min(16, Math.round(cw * 0.22))), r === 0 ? pal.text3 : (r === state.lastReg ? pal.accent : pal.text), 'center', 700);
      }

      /* 内存窗口 */
      var memStart = p.start & 0xF0;
      var cellW = (w - 32) / 16;
      var memY = gy + gh + 20;
      var cellH = Math.min(34, cellW * 1.5);
      text(c, '内存 0x' + toyHex2(memStart) + '–0x' + toyHex2(memStart + 15) + '（高亮 = 程序或结果）', 16, memY - 8, Math.max(10, Math.round(w / 60)), pal.text3, 'left', 500);
      var addrNow = state.PC;
      var i;
      for (i = 0; i < 16; i++) {
        var addr = memStart + i;
        x = 16 + i * cellW;
        var isProg = false;
        for (r = 0; r < p.code.length; r++) if (p.code[r].addr === addr) isProg = true;
        var isData = false;
        for (r = 0; r < p.data.length; r++) if (p.data[r].addr === addr) isData = true;
        var isResult = addr === p.resultAddr;
        c.fillStyle = isResult ? pal.accentSoft : (isProg || isData ? pal.panel : pal.bg2);
        c.fillRect(x, memY, cellW - 2, cellH);
        c.strokeStyle = isResult ? pal.accent : pal.line;
        c.lineWidth = isResult ? 1.8 : 1;
        c.strokeRect(x, memY, cellW - 2, cellH);
        text(c, toyHex2(addr), x + (cellW - 2) / 2, memY + 11, Math.max(8, Math.round(w / 90)), pal.text3, 'center', 500);
        text(c, toyHex4(state.M[addr]), x + (cellW - 2) / 2, memY + cellH - 11, Math.max(9, Math.round(w / 72)), state.M[addr] ? pal.text : pal.text3, 'center', 700);
      }

      /* 当前指令 */
      var iy = memY + cellH + 30;
      if (iy > h - 8) iy = h - 8;
      var next = state.halted ? '停机' : '下一条：M[' + toyHex2(addrNow) + '] = ' + toyHex4(state.M[addrNow]) + ' → ' + toyDisasm(state.M[addrNow]);
      text(c, next, 16, iy, Math.max(11, Math.round(w / 52)), pal.text2, 'left', 500);
    }

    fit();
    vmReset();
    return { destroy: function () { kit.destroy(); } };
  }

  LABS.toyvm = {
    title: 'TOY 虚拟机单步',
    desc: '16 位小机器上跑两段程序，单步看 PC、寄存器与内存怎样协作',
    tags: ['ch24'],
    icon: 'cpu',
    order: 26,
    init: lab(initToyvm)
  };

  /* =====================================================================
   * 6. logic —— 布尔门与真值表（ch25）
   * ===================================================================== */
  var LOGIC_GATES = ['AND', 'OR', 'XOR', 'NAND', 'NOR', 'NOT'];

  function logicGateName(g) {
    return {
      AND: '与（AND）', OR: '或（OR）', XOR: '异或（XOR）',
      NAND: '与非（NAND）', NOR: '或非（NOR）', NOT: '非（NOT）'
    }[g] || g;
  }

  function logicCalc(g, a, b) {
    switch (g) {
      case 'AND': return a & b;
      case 'OR': return a | b;
      case 'XOR': return a ^ b;
      case 'NAND': return 1 - (a & b);
      case 'NOR': return 1 - (a | b);
      case 'NOT': return 1 - a;
    }
    return 0;
  }

  function drawGateSymbol(c, type, x, y, w, h, pal) {
    c.lineWidth = 2;
    c.strokeStyle = pal.text2;
    c.fillStyle = pal.panel;
    if (type === 'NOT') {
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x, y + h);
      c.lineTo(x + w, y + h / 2);
      c.closePath();
      c.fill();
      c.stroke();
      c.beginPath();
      c.arc(x + w + 5, y + h / 2, 4.5, 0, Math.PI * 2);
      c.fillStyle = pal.bg;
      c.fill();
      c.strokeStyle = pal.text2;
      c.stroke();
      return;
    }
    if (type === 'OR' || type === 'XOR' || type === 'NOR') {
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + w * 0.55, y, x + w, y + h / 2);
      c.quadraticCurveTo(x + w * 0.55, y + h, x, y + h);
      c.quadraticCurveTo(x + w * 0.22, y + h / 2, x, y);
      c.closePath();
      c.fill();
      c.stroke();
      if (type === 'XOR') {
        c.beginPath();
        c.moveTo(x - 7, y);
        c.quadraticCurveTo(x - 7 + w * 0.22, y + h / 2, x - 7, y + h);
        c.stroke();
      }
    } else {
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + w / 2, y);
      c.arc(x + w / 2, y + h / 2, h / 2, -Math.PI / 2, Math.PI / 2);
      c.lineTo(x, y + h);
      c.closePath();
      c.fill();
      c.stroke();
    }
    if (type === 'NAND' || type === 'NOR') {
      c.beginPath();
      c.arc(x + w + 5, y + h / 2, 4.5, 0, Math.PI * 2);
      c.fillStyle = pal.bg;
      c.fill();
      c.strokeStyle = pal.text2;
      c.stroke();
    }
  }

  function drawBulb(c, x, y, on, pal) {
    c.beginPath();
    c.arc(x, y, 18, 0, Math.PI * 2);
    c.fillStyle = on ? pal.accentSoft : pal.panel;
    c.fill();
    c.strokeStyle = on ? pal.accent : pal.line2;
    c.lineWidth = on ? 2.4 : 1.2;
    c.stroke();
    text(c, on ? '1' : '0', x, y, 15, on ? pal.accent : pal.text3, 'center', 700);
    text(c, on ? '亮' : '灭', x, y + 32, Math.max(10, Math.round(x < 40 ? 10 : 11)), pal.text3, 'center', 500);
  }

  function initLogic(root, props, ctx, kit) {
    var state = { mode: 'single', gate: 'AND', a: 0, b: 0 };
    var view = { ctx: null, w: 0, h: 0 };

    var modeRow = ctl(root);
    selectBox(modeRow, [
      { value: 'single', label: '单个逻辑门' },
      { value: 'half', label: '半加器（两门组合）' }
    ], state.mode, function (v) { state.mode = v; syncUi(); render(); });

    var gateRow = ctl(root);
    gateRow.appendChild(E('span', { class: 'pill', text: '门' }));
    var gateSel = selectBox(gateRow, LOGIC_GATES.map(function (g) {
      return { value: g, label: g + '（' + logicGateName(g) + '）' };
    }), state.gate, function (v) { state.gate = v; render(); });

    var inRow = ctl(root);
    var aBtn = button(inRow, 'A = 0', function () { state.a = 1 - state.a; syncUi(); render(); }, { cls: 'toggle' });
    var bBtn = button(inRow, 'B = 0', function () { state.b = 1 - state.b; syncUi(); render(); }, { cls: 'toggle' });

    var stage = E('div', { class: 'labStage' });
    var canvas = E('canvas');
    stage.appendChild(canvas);
    root.appendChild(stage);

    var noteBox = note(root);
    var statBox = stats(root);
    hintLine(root, '把 A、B 拨成 0/1，看门电路怎样输出。真值表只有 4 行——但把它组合起来，就是加法器，就是 CPU。');

    var resizeTimer = 0;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resizeTimer = 0; fit(); draw(); }, 120);
    }
    window.addEventListener('resize', onResize);
    kit.onDestroy(function () {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    });

    function fit() {
      var f = fitCanvas(canvas, 0.62, 640);
      if (f) view = f;
    }

    function syncUi() {
      var isSingle = state.mode === 'single';
      gateSel.disabled = !isSingle;
      setBtnLabel(aBtn, 'A = ' + state.a);
      setBtnLabel(bBtn, 'B = ' + state.b);
    }

    function render() {
      var isSingle = state.mode === 'single';
      var out = isSingle ? logicCalc(state.gate, state.a, state.b) : (state.a ^ state.b);
      var carry = state.a & state.b;
      if (isSingle) {
        noteBox.set('门类型 <b>' + esc(logicGateName(state.gate)) + '</b>：A = ' + state.a + '，B = ' + state.b + '，输出 <b>' + out + '</b>。', '单门');
        statBox.set([
          { label: 'A', value: state.a },
          { label: 'B', value: state.b },
          { label: '输出', value: out, hot: true },
          { label: '门', value: state.gate }
        ]);
      } else {
        noteBox.set('半加器：<b>S = A XOR B</b> 走本位的和，<b>C = A AND B</b> 走向高位的进位。当前 A = ' + state.a + '，B = ' + state.b + ' → S = ' + out + '，C = ' + carry + '。', '半加器');
        statBox.set([
          { label: 'A', value: state.a },
          { label: 'B', value: state.b },
          { label: 'S（和）', value: out, hot: true },
          { label: 'C（进位）', value: carry }
        ]);
      }
      syncUi();
      draw();
    }

    function draw() {
      if (!view.ctx) fit();
      if (!view.ctx) return;
      var c = view.ctx;
      var w = view.w;
      var h = view.h;
      var pal = palette();
      var isSingle = state.mode === 'single';
      var out = isSingle ? logicCalc(state.gate, state.a, state.b) : (state.a ^ state.b);
      var carry = state.a & state.b;
      c.clearRect(0, 0, w, h);

      var gateW = Math.min(96, w * 0.18);
      var gateH = Math.min(58, h * 0.2);
      var inX = 40;
      var outX = w - 74;

      if (isSingle) {
        var cy = h * 0.26;
        var gx = w * 0.42;
        var gy = cy - gateH / 2;
        /* 输入线 */
        c.strokeStyle = state.a ? pal.accent : pal.line2;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(inX, cy - 18);
        c.lineTo(gx - (state.gate === 'XOR' ? 8 : 2), cy - 14);
        c.stroke();
        if (state.gate !== 'NOT') {
          c.strokeStyle = state.b ? pal.accent : pal.line2;
          c.beginPath();
          c.moveTo(inX, cy + 18);
          c.lineTo(gx - (state.gate === 'XOR' ? 8 : 2), cy + 14);
          c.stroke();
        }
        text(c, 'A = ' + state.a, inX - 8, cy - 18, Math.max(11, Math.round(w / 52)), state.a ? pal.accent : pal.text2, 'right', 700);
        if (state.gate !== 'NOT') {
          text(c, 'B = ' + state.b, inX - 8, cy + 18, Math.max(11, Math.round(w / 52)), state.b ? pal.accent : pal.text2, 'right', 700);
        }
        drawGateSymbol(c, state.gate, gx, gy, gateW, gateH, pal);
        text(c, state.gate, gx + gateW / 2, gy + gateH + 18, Math.max(11, Math.round(w / 50)), pal.text2, 'center', 600);
        /* 输出线 */
        c.strokeStyle = out ? pal.accent : pal.line2;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(gx + gateW + (state.gate === 'NAND' || state.gate === 'NOR' || state.gate === 'NOT' ? 10 : 0), cy);
        c.lineTo(outX + 10, cy);
        c.stroke();
        drawBulb(c, outX + 32, cy, out, pal);

        /* 真值表 */
        var rows = state.gate === 'NOT'
          ? [[0], [1]]
          : [[0, 0], [0, 1], [1, 0], [1, 1]];
        var tx = w * 0.16;
        var ty = h * 0.52;
        var tw = Math.min(360, w * 0.62);
        var rh = 28;
        text(c, '真值表', tx, ty - 12, Math.max(12, Math.round(w / 48)), pal.text2, 'left', 600);
        var headers = state.gate === 'NOT' ? ['A', '输出'] : ['A', 'B', '输出'];
        var cols = headers.length;
        var cw2 = tw / cols;
        var k;
        for (k = 0; k < cols; k++) {
          text(c, headers[k], tx + cw2 * k + cw2 / 2, ty + 8, Math.max(11, Math.round(w / 52)), pal.text3, 'center', 600);
        }
        for (k = 0; k < rows.length; k++) {
          var rowOut = state.gate === 'NOT' ? logicCalc('NOT', rows[k][0], 0) : logicCalc(state.gate, rows[k][0], rows[k][1]);
          var isCur = state.gate === 'NOT'
            ? rows[k][0] === state.a
            : (rows[k][0] === state.a && rows[k][1] === state.b);
          var ry = ty + 26 + k * rh;
          if (isCur) {
            c.fillStyle = pal.accentSoft;
            c.fillRect(tx, ry - 18, tw, rh - 4);
          }
          for (var j = 0; j < rows[k].length; j++) {
            text(c, String(rows[k][j]), tx + cw2 * j + cw2 / 2, ry, Math.max(12, Math.round(w / 48)), isCur ? pal.accent : pal.text, 'center', isCur ? 700 : 500);
          }
          text(c, String(rowOut), tx + cw2 * (cols - 1) + cw2 / 2, ry, Math.max(12, Math.round(w / 48)), isCur ? pal.accent : pal.text, 'center', isCur ? 700 : 500);
        }
      } else {
        /* 半加器：两个门并排 */
        var ay = h * 0.16;
        var by2 = h * 0.40;
        var ex = w * 0.34;
        var xorW = Math.min(80, w * 0.15);
        var xorH = 46;
        /* 输入线 A/B 到两个门 */
        c.strokeStyle = state.a ? pal.accent : pal.line2;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(inX, ay + 22);
        c.lineTo(ex - 10, ay + 22);
        c.stroke();
        c.strokeStyle = state.b ? pal.accent : pal.line2;
        c.beginPath();
        c.moveTo(inX, ay + 34);
        c.lineTo(ex - 10, ay + 34);
        c.stroke();
        /* 分叉到 AND 门 */
        c.strokeStyle = pal.line2;
        c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(ex - 40, ay + 22);
        c.lineTo(ex - 40, by2 + 8);
        c.lineTo(ex - 10, by2 + 8);
        c.stroke();
        c.beginPath();
        c.moveTo(ex - 40, ay + 34);
        c.lineTo(ex - 40, by2 + 20);
        c.lineTo(ex - 10, by2 + 20);
        c.stroke();
        text(c, 'A = ' + state.a, inX - 8, ay + 22, Math.max(11, Math.round(w / 52)), state.a ? pal.accent : pal.text2, 'right', 700);
        text(c, 'B = ' + state.b, inX - 8, ay + 34, Math.max(11, Math.round(w / 52)), state.b ? pal.accent : pal.text2, 'right', 700);
        drawGateSymbol(c, 'XOR', ex, ay, xorW, xorH, pal);
        text(c, 'XOR → S', ex + xorW / 2, ay - 8, Math.max(10, Math.round(w / 58)), pal.text2, 'center', 600);
        drawGateSymbol(c, 'AND', ex, by2, xorW, xorH, pal);
        text(c, 'AND → C', ex + xorW / 2, by2 - 8, Math.max(10, Math.round(w / 58)), pal.text2, 'center', 600);
        /* 输出 */
        var sox = w - 96;
        c.strokeStyle = out ? pal.accent : pal.line2;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(ex + xorW + 10, ay + xorH / 2);
        c.lineTo(sox, ay + xorH / 2);
        c.stroke();
        c.strokeStyle = carry ? pal.accent : pal.line2;
        c.beginPath();
        c.moveTo(ex + xorW + 10, by2 + xorH / 2);
        c.lineTo(sox, by2 + xorH / 2);
        c.stroke();
        drawBulb(c, sox + 26, ay + xorH / 2, out, pal);
        drawBulb(c, sox + 26, by2 + xorH / 2, carry, pal);
        text(c, 'S', sox + 26, ay + xorH / 2 + 47, Math.max(10, Math.round(w / 58)), pal.text3, 'center', 500);
        text(c, 'C', sox + 26, by2 + xorH / 2 + 47, Math.max(10, Math.round(w / 58)), pal.text3, 'center', 500);

        /* 真值表 4 行 4 列 */
        var hx = w * 0.14;
        var hy = h * 0.54;
        var hw = Math.min(380, w * 0.66);
        var hrh = 27;
        text(c, '半加器真值表', hx, hy - 12, Math.max(12, Math.round(w / 48)), pal.text2, 'left', 600);
        var hh = ['A', 'B', 'S', 'C'];
        var hcw = hw / 4;
        for (k = 0; k < 4; k++) {
          text(c, hh[k], hx + hcw * k + hcw / 2, hy + 8, Math.max(11, Math.round(w / 52)), pal.text3, 'center', 600);
        }
        var hv = [[0, 0], [0, 1], [1, 0], [1, 1]];
        for (k = 0; k < 4; k++) {
          var hs = hv[k][0] ^ hv[k][1];
          var hc = hv[k][0] & hv[k][1];
          var hcur = hv[k][0] === state.a && hv[k][1] === state.b;
          var hry = hy + 26 + k * hrh;
          if (hcur) {
            c.fillStyle = pal.accentSoft;
            c.fillRect(hx, hry - 18, hw, hrh - 4);
          }
          var vals = [hv[k][0], hv[k][1], hs, hc];
          for (var q = 0; q < 4; q++) {
            text(c, String(vals[q]), hx + hcw * q + hcw / 2, hry, Math.max(12, Math.round(w / 48)), hcur ? pal.accent : pal.text, 'center', hcur ? 700 : 500);
          }
        }
      }
    }

    syncUi();
    fit();
    render();
    return { destroy: function () { kit.destroy(); } };
  }

  LABS.logic = {
    title: '布尔门与真值表',
    desc: '拨动 A/B 看与或非门输出，再把两个门拼成半加器',
    tags: ['ch25'],
    icon: 'zap',
    order: 27,
    init: lab(initLogic)
  };

  CSC.registerLabs(LABS);
})();
