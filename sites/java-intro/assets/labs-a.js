/* =====================================================================
 * 计算机科学与 Java 编程导论 · 学习站 · labs-a.js
 * 职责：继续学习部分（ch14–ch19）的 6 个交互实验台，用 CSC.registerLabs 注册。
 *   surf        随机冲浪者 / PageRank（ch14）
 *   percolation 渗流模拟（ch15）
 *   nbody       N 体模拟（ch16）
 *   stackqueue  栈与队列 + 括号匹配（ch17）
 *   symboltable 符号表：BST 与哈希桶（ch18）
 *   graph       BFS / DFS 与小世界（ch19）
 * 依赖：app.js 的 CSC.el / CSC.icon / CSC.codeLines / CSC.bus；不依赖解释器。
 * 约定：IIFE；只用 var；不写内联 style 属性（画布尺寸用 canvas.style 属性赋值）；
 *   每个 init 返回 { destroy }，定时器与播放器全部走 kit。
 * 作者模块：site-java
 * ===================================================================== */
(function () {
  'use strict';

  var CSC = window.CSC;
  if (!CSC) {
    console.error('[labs-a] 必须先加载 app.js');
    return;
  }

  /* =====================================================================
   * 一、基础工具（与 assets/labs.js 保持同样实现，labs.js 是 IIFE 不对外暴露）
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

  function ctl(parent) {
    var d = E('div', { class: 'labCtl' });
    if (parent) parent.appendChild(d);
    return d;
  }

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

  function makeKit() {
    var timers = [];
    var players = [];
    var cleanups = [];
    var dead = false;
    return {
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
  }

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
        try { more = stepFn() !== false; } catch (e) { console.error('[labs-a] 播放出错', e); more = false; }
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

  function lab(initFn) {
    return function (root, props, ctx) {
      var kit = makeKit();
      var mo = null;
      mountViz(root, function () {
        if (kit.dead() || !root.isConnected) return;
        try {
          initFn(root, props || {}, ctx || {}, kit);
        } catch (e) {
          console.error('[labs-a] 实验台初始化失败', e);
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

  /* =====================================================================
   * 二、通用小工具：画布自适应 / 确定性随机 / 画布文字
   * ===================================================================== */
  function fitCanvas(canvas, aspect) {
    var host = canvas.parentNode;
    var hostW = (host && host.clientWidth) || 520;
    var w = Math.max(260, Math.min(640, hostW - 16));
    var h = Math.round(w * (aspect || 0.92));
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var c2d = canvas.getContext('2d');
    if (!c2d) return null;
    c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: c2d, w: w, h: h };
  }

  /** 线性同余随机数：同一 seed 每次得到同一张图，方便「重置」复现 */
  function lcg(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  function label(c, text, x, y, color, size, align) {
    c.fillStyle = color || 'rgba(200,214,228,0.9)';
    c.font = (size || 10) + 'px ui-monospace, SFMono-Regular, Menlo, monospace';
    c.textAlign = align || 'left';
    c.textBaseline = 'middle';
    c.fillText(text, x, y);
  }

  /* =====================================================================
   * 三、实验台定义
   * ===================================================================== */
  var LABS = {};

  /* ---------------------------------------------------------------------
   * 1. surf —— 随机冲浪者 / PageRank（ch14）
   * ------------------------------------------------------------------- */
  LABS.surf = {
    title: '随机冲浪者实验台',
    desc: '让一个「冲浪者」在网页图上随机跳转，看访问频率怎样一点点逼近 PageRank。',
    tags: ['ch14'],
    icon: 'compass',
    order: 16,
    init: lab(function (root, props, ctx, kit) {
      var state = {
        n: 8,
        d: 0.85,
        speed: 6,
        steps: 0,
        cur: 0,
        counts: [],
        graph: [],
        pr: [],
        maxPr: 1
      };
      var view = { ctx: null, w: 0, h: 0 };

      var intro = E('div', { class: 'labNote' });
      intro.innerHTML = '<span>90–10 规则：85% 的概率点当前页的某个链接，15% 的概率随便跳到任意一页。'
        + '每个点被访问的频率，就是它的 <b>PageRank</b>。先预测哪个点会被访问得最多，再点「播放」。</span>';
      root.appendChild(intro);

      var ctlRow = ctl(root);
      var nSlider = slider(ctlRow, {
        label: '网页数', min: 6, max: 12, value: state.n,
        onInput: function (v) { state.n = v; rebuild(); }
      });
      var dSlider = slider(ctlRow, {
        label: '阻尼系数 d', min: 0.55, max: 0.95, step: 0.05, value: state.d,
        onInput: function (v) { state.d = v; recomputePr(); draw(); updateNote(); }
      });
      var speedSlider = slider(ctlRow, {
        label: '速度', min: 1, max: 10, value: state.speed,
        onInput: function (v) { state.speed = v; }
      });

      var playRow = ctl(root);
      var playBtn = button(playRow, '播放', function () { togglePlay(); }, { icon: 'play' });
      var stepBtn = button(playRow, '单步', function () { player.pause(); setBtnLabel(playBtn, '继续'); step(); }, { icon: 'step' });
      button(playRow, '重置', function () { rebuild(); }, { icon: 'reset' });

      var stage = E('div', { class: 'labStage' });
      var canvas = E('canvas', { class: 'sdCanvas' });
      stage.appendChild(canvas);
      root.appendChild(stage);

      var noteBox = note(root);
      var statBox = stats(root);

      var player = kit.addPlayer(makePlayer(function () { return step(); }, function () {
        return 460 - state.speed * 38;
      }));
      player.onIdle = function () { setBtnLabel(playBtn, '继续'); };

      function buildGraph() {
        var rnd = lcg(20261112 + state.n * 17);
        var adj = [];
        var i, e;
        for (i = 0; i < state.n; i++) adj.push([]);
        for (i = 0; i < state.n; i++) {
          adj[i].push((i + 1) % state.n);
          adj[i].push((i + state.n - 1) % state.n);
        }
        var extra = Math.max(2, Math.round(state.n / 2));
        for (e = 0; e < extra; e++) {
          var a = Math.floor(rnd() * state.n);
          var b = Math.floor(rnd() * state.n);
          if (a !== b && adj[a].indexOf(b) < 0) adj[a].push(b);
        }
        return adj;
      }

      function recomputePr() {
        var adj = state.graph;
        var n = adj.length;
        var pr = [];
        var i, j, it;
        for (i = 0; i < n; i++) pr.push(1 / n);
        for (it = 0; it < 60; it++) {
          var next = [];
          for (j = 0; j < n; j++) next.push((1 - state.d) / n);
          for (i = 0; i < n; i++) {
            var share = state.d * pr[i] / adj[i].length;
            for (j = 0; j < adj[i].length; j++) next[adj[i][j]] += share;
          }
          pr = next;
        }
        state.pr = pr;
        state.maxPr = 0.000001;
        for (i = 0; i < n; i++) state.maxPr = Math.max(state.maxPr, pr[i]);
      }

      function freq(i) { return state.steps ? (state.counts[i] || 0) / state.steps : 0; }

      function maxFreq() {
        var m = 0.000001;
        for (var i = 0; i < state.n; i++) m = Math.max(m, freq(i));
        return m;
      }

      function maxErr() {
        var e = 0;
        for (var i = 0; i < state.n; i++) e = Math.max(e, Math.abs(freq(i) - state.pr[i]));
        return e;
      }

      function step() {
        var follow = Math.random() < state.d;
        var adj = state.graph[state.cur];
        if (follow && adj && adj.length) state.cur = adj[Math.floor(Math.random() * adj.length)];
        else state.cur = Math.floor(Math.random() * state.n);
        state.counts[state.cur] = (state.counts[state.cur] || 0) + 1;
        state.steps++;
        draw();
        updateNote();
        return true;
      }

      function togglePlay() {
        if (player.playing) {
          player.pause();
          setBtnLabel(playBtn, '继续');
        } else {
          player.play();
          setBtnLabel(playBtn, '暂停');
        }
      }

      function draw() {
        if (!view.ctx) return;
        var c = view.ctx;
        var w = view.w;
        var h = view.h;
        var barH = 78;
        var gcy = (h - barH) / 2;
        var gr = Math.min(w, h - barH) * 0.33;
        var i, j;
        c.clearRect(0, 0, w, h);

        var pts = [];
        for (i = 0; i < state.n; i++) {
          var ang = -Math.PI / 2 + i * Math.PI * 2 / state.n;
          pts.push({ x: w / 2 + Math.cos(ang) * gr, y: gcy + Math.sin(ang) * gr });
        }

        c.strokeStyle = 'rgba(140,170,200,0.26)';
        c.lineWidth = 1;
        for (i = 0; i < state.n; i++) {
          for (j = 0; j < state.graph[i].length; j++) {
            var a = pts[i];
            var b = pts[state.graph[i][j]];
            c.beginPath();
            c.moveTo(a.x, a.y);
            c.lineTo(b.x, b.y);
            c.stroke();
          }
        }

        var mf = maxFreq();
        for (i = 0; i < state.n; i++) {
          var p = pts[i];
          var r = 7 + 26 * (freq(i) / mf);
          var isCur = i === state.cur;
          c.beginPath();
          c.arc(p.x, p.y, r, 0, Math.PI * 2);
          c.fillStyle = isCur ? 'rgba(120,220,255,0.95)' : 'rgba(80,140,190,0.42)';
          c.fill();
          c.strokeStyle = isCur ? '#c8f2ff' : 'rgba(150,200,230,0.55)';
          c.lineWidth = isCur ? 2 : 1;
          c.stroke();
          label(c, String(i), p.x, p.y, '#e6eef7', 11, 'center');
        }

        var baseY = h - 18;
        var bw = Math.max(5, (w - 40) / state.n / 2 - 3);
        for (i = 0; i < state.n; i++) {
          var x0 = 20 + i * ((w - 40) / state.n);
          var f1 = freq(i) / mf;
          var f2 = state.pr[i] / state.maxPr;
          c.fillStyle = 'rgba(120,220,255,0.85)';
          c.fillRect(x0, baseY - f1 * 54, bw, f1 * 54);
          c.fillStyle = 'rgba(242,182,76,0.85)';
          c.fillRect(x0 + bw + 2, baseY - f2 * 54, bw, f2 * 54);
        }
        label(c, '访问频率', 20, h - 6, 'rgba(120,220,255,0.9)', 10);
        label(c, 'PageRank', 82, h - 6, 'rgba(242,182,76,0.95)', 10);
        label(c, '当前页：' + state.cur, w - 16, h - 6, 'rgba(200,214,228,0.75)', 10, 'right');
      }

      function updateNote() {
        var top = 0;
        for (var i = 1; i < state.n; i++) if (state.pr[i] > state.pr[top]) top = i;
        noteBox.set(
          '随机游走 <b>' + state.steps + '</b> 步后，访问频率与 PageRank 的最大差距是 <b>' + maxErr().toFixed(4) + '</b>。'
            + '理论上访问最多的网页是 <b>' + top + '</b>（PageRank ' + (state.pr[top] * 100).toFixed(1) + '%）。',
          '阻尼 d=' + state.d.toFixed(2)
        );
        statBox.set([
          { label: '步数', value: state.steps, hot: true },
          { label: '当前页', value: state.cur },
          { label: '最大误差', value: maxErr().toFixed(4) },
          { label: '最高 PR', value: '网页 ' + top }
        ]);
      }

      function rebuild() {
        player.pause();
        setBtnLabel(playBtn, '播放');
        state.graph = buildGraph();
        state.counts = [];
        for (var i = 0; i < state.n; i++) state.counts.push(0);
        state.steps = 0;
        state.cur = 0;
        recomputePr();
        draw();
        updateNote();
      }

      function onResize() {
        var r = fitCanvas(canvas, 1.02);
        if (r) { view = r; draw(); }
      }
      view = fitCanvas(canvas, 1.02) || view;
      window.addEventListener('resize', onResize);
      kit.onDestroy(function () { window.removeEventListener('resize', onResize); });

      codeBlock(root, [
        'for (int iter = 0; iter < 100; iter++) {',
        '    double[] next = new double[n];',
        '    for (int i = 0; i < n; i++) {',
        '        for (int j = 0; j < n; j++) {',
        '            if (adj[j][i]) next[i] += rank[j] / outdeg[j];',
        '        }',
        '        next[i] = (1 - d) / n + d * next[i];',
        '    }',
        '    rank = next;',
        '}'
      ]);

      rebuild();
      return { destroy: function () { kit.destroy(); } };
    })
  };



  /* ---------------------------------------------------------------------
   * 2. percolation —— 渗流模拟（ch15）
   * ------------------------------------------------------------------- */
  LABS.percolation = {
    title: '渗流模拟实验台',
    desc: '按概率 p 开通格子，看上下是否连通：亲手找到渗流阈值。',
    tags: ['ch15'],
    icon: 'grid',
    order: 17,
    init: lab(function (root, props, ctx, kit) {
      var state = { n: 14, p: 0.55, seed: 20261112, open: [], mark: [], percolates: false, conn: 0, mcRate: null };
      var view = { ctx: null, w: 0, h: 0 };
      var speed = 6;

      var intro = E('div', { class: 'labNote' });
      intro.innerHTML = '<span>每个格子以概率 <b>p</b> 开通（浅色），其余是墙。问：从上边能不能走到下边？'
        + 'p 很小时几乎不可能，p 接近 1 时几乎一定可以——中间有一个陡峭的<b>渗流阈值</b>。先猜阈值，再点「播放」扫描 p。</span>';
      root.appendChild(intro);

      var ctlRow = ctl(root);
      var nSlider = slider(ctlRow, {
        label: '网格', min: 8, max: 20, value: state.n,
        onInput: function (v) { state.n = v; apply(); }
      });
      var pSlider = slider(ctlRow, {
        label: '开通概率 p', min: 0.05, max: 0.95, step: 0.05, value: state.p,
        onInput: function (v) { state.p = Math.round(v * 100) / 100; apply(); }
      });
      slider(ctlRow, {
        label: '速度', min: 1, max: 10, value: speed,
        onInput: function (v) { speed = v; }
      });

      var btnRow = ctl(root);
      var playBtn = button(btnRow, '播放', function () { togglePlay(); }, { icon: 'play' });
      button(btnRow, '单步', function () { player.pause(); setBtnLabel(playBtn, '继续'); step(); }, { icon: 'step' });
      button(btnRow, '重抽', function () { state.seed = (state.seed * 1103515245 + 12345) >>> 0; apply(); }, { icon: 'repeat' });
      button(btnRow, '蒙特卡洛 ×20', function () { monteCarlo(); });
      button(btnRow, '重置', function () { reset(); }, { icon: 'reset' });

      var stage = E('div', { class: 'labStage' });
      var canvas = E('canvas', { class: 'sdCanvas' });
      stage.appendChild(canvas);
      root.appendChild(stage);

      var noteBox = note(root);
      var statBox = stats(root);

      var player = kit.addPlayer(makePlayer(function () { return step(); }, function () {
        return 420 - speed * 34;
      }));
      player.onIdle = function () { setBtnLabel(playBtn, '继续'); };

      function simulate(n, p, seed) {
        var rnd = lcg(seed);
        var N = n * n;
        var open = [];
        var mark = [];
        var i, r, c;
        for (i = 0; i < N; i++) {
          open.push(rnd() < p);
          mark.push(0);
        }
        var q = [];
        var head = 0;
        for (c = 0; c < n; c++) {
          if (open[c]) { mark[c] = 1; q.push(c); }
        }
        while (head < q.length) {
          var id = q[head++];
          r = Math.floor(id / n);
          c = id % n;
          var nb = [];
          if (r > 0) nb.push(id - n);
          if (r < n - 1) nb.push(id + n);
          if (c > 0) nb.push(id - 1);
          if (c < n - 1) nb.push(id + 1);
          for (i = 0; i < nb.length; i++) {
            var t = nb[i];
            if (open[t] && !mark[t]) { mark[t] = 1; q.push(t); }
          }
        }
        var per = false;
        for (c = 0; c < n; c++) {
          if (mark[(n - 1) * n + c]) per = true;
        }
        return { open: open, mark: mark, percolates: per, conn: q.length };
      }

      function apply() {
        var s = simulate(state.n, state.p, state.seed);
        state.open = s.open;
        state.mark = s.mark;
        state.percolates = s.percolates;
        state.conn = s.conn;
        draw();
        updateNote();
      }

      function step() {
        state.p = Math.min(0.95, Math.round((state.p + 0.02) * 100) / 100);
        pSlider.set(state.p.toFixed(2));
        apply();
        return state.p < 0.95;
      }

      function togglePlay() {
        if (player.playing) {
          player.pause();
          setBtnLabel(playBtn, '继续');
        } else {
          if (state.p >= 0.95) state.p = 0.05;
          player.play();
          setBtnLabel(playBtn, '暂停');
        }
      }

      function monteCarlo() {
        var trials = 20;
        var hit = 0;
        for (var t = 0; t < trials; t++) {
          if (simulate(state.n, state.p, state.seed + t * 7919 + 1).percolates) hit++;
        }
        state.mcRate = hit / trials;
        updateNote();
      }

      function reset() {
        player.pause();
        setBtnLabel(playBtn, '播放');
        state.p = 0.55;
        state.seed = 20261112;
        state.mcRate = null;
        pSlider.set('0.55');
        apply();
      }

      function draw() {
        if (!view.ctx) return;
        var c = view.ctx;
        var w = view.w;
        var h = view.h;
        var n = state.n;
        var pad = 10;
        var size = Math.min((w - pad * 2) / n, (h - pad * 2) / n);
        var ox = (w - size * n) / 2;
        var oy = (h - size * n) / 2;
        var r, cc;
        c.clearRect(0, 0, w, h);
        for (r = 0; r < n; r++) {
          for (cc = 0; cc < n; cc++) {
            var id = r * n + cc;
            var x = ox + cc * size;
            var y = oy + r * size;
            if (!state.open[id]) c.fillStyle = 'rgba(66,76,92,0.62)';
            else if (state.mark[id]) c.fillStyle = state.percolates ? 'rgba(120,222,160,0.92)' : 'rgba(120,200,235,0.82)';
            else c.fillStyle = 'rgba(158,178,200,0.26)';
            c.fillRect(x + 0.6, y + 0.6, size - 1.2, size - 1.2);
          }
        }
        c.strokeStyle = state.percolates ? 'rgba(120,222,160,0.9)' : 'rgba(200,120,120,0.7)';
        c.lineWidth = 2;
        c.strokeRect(ox, oy, size * n, size * n);
        label(c, 'p = ' + state.p.toFixed(2), ox, oy > 12 ? oy - 4 : 8, 'rgba(200,214,228,0.85)', 10);
        label(c, state.percolates ? '上下连通' : '上下不连通', ox + size * n, oy > 12 ? oy - 4 : 8,
          state.percolates ? 'rgba(120,222,160,0.95)' : 'rgba(220,140,140,0.9)', 10, 'right');
      }

      function updateNote() {
        noteBox.set(
          state.percolates
            ? '当前 p=<b>' + state.p.toFixed(2) + '</b>：上下<b>连通</b>，共 ' + state.conn + ' 个格子连到顶边。'
            : '当前 p=<b>' + state.p.toFixed(2) + '</b>：上下<b>不连通</b>，只有 ' + state.conn + ' 个格子连到顶边。',
          state.mcRate == null ? '' : '蒙特卡洛渗流率 ' + (state.mcRate * 100).toFixed(0) + '%'
        );
        statBox.set([
          { label: '网格', value: state.n + '×' + state.n },
          { label: 'p', value: state.p.toFixed(2), hot: true },
          { label: '连通格子', value: state.conn },
          { label: '渗流率', value: state.mcRate == null ? '—' : (state.mcRate * 100).toFixed(0) + '%' }
        ]);
      }

      function onResize() {
        var r = fitCanvas(canvas, 0.98);
        if (r) { view = r; draw(); }
      }
      view = fitCanvas(canvas, 0.98) || view;
      window.addEventListener('resize', onResize);
      kit.onDestroy(function () { window.removeEventListener('resize', onResize); });

      codeBlock(root, [
        'private void dfs(int i, int j) {',
        '    if (i < 0 || i >= n || j < 0 || j >= n) return;',
        '    if (!open[i][j] || full[i][j]) return;',
        '    full[i][j] = true;',
        '    dfs(i - 1, j); dfs(i + 1, j);',
        '    dfs(i, j - 1); dfs(i, j + 1);',
        '}'
      ]);

      apply();
      return { destroy: function () { kit.destroy(); } };
    })
  };

  /* ---------------------------------------------------------------------
   * 3. nbody —— N 体模拟（ch16）
   * ------------------------------------------------------------------- */
  LABS.nbody = {
    title: 'N 体模拟实验台',
    desc: '2–5 个天体按万有引力互相吸引：看轨迹、看能量守恒。',
    tags: ['ch16'],
    icon: 'target',
    order: 18,
    init: lab(function (root, props, ctx, kit) {
      var G = 1;
      var STAR = 300;
      var SOFT = 0.0025;
      var COLORS = ['#f2b64c', '#78dcff', '#9ee493', '#e6a0ff', '#ff9f80'];
      var state = { n: 4, dt: 0.0003, speed: 6, t: 0, steps: 0, bodies: [], trails: [], e0: 0 };
      var view = { ctx: null, w: 0, h: 0 };

      var intro = E('div', { class: 'labNote' });
      intro.innerHTML = '<span>万有引力让天体互相加速：<b>a = G·M / r²</b>。这里用速度 Verlet 积分：'
        + '每步先更新半个速度、再更新位置、再补半个速度。注意状态条里的<b>总能量</b>几乎不变——'
        + '把 dt 调大，看它开始漂移。</span>';
      root.appendChild(intro);

      var ctlRow = ctl(root);
      slider(ctlRow, {
        label: '天体数', min: 2, max: 5, value: state.n,
        onInput: function (v) { state.n = v; reset(); }
      });
      slider(ctlRow, {
        label: 'dt', min: 0.0001, max: 0.001, step: 0.0001, value: state.dt,
        onInput: function (v) { state.dt = v; }
      });
      slider(ctlRow, {
        label: '速度', min: 1, max: 10, value: state.speed,
        onInput: function (v) { state.speed = v; }
      });

      var btnRow = ctl(root);
      var playBtn = button(btnRow, '播放', function () { togglePlay(); }, { icon: 'play' });
      button(btnRow, '单步', function () { player.pause(); setBtnLabel(playBtn, '继续'); step(); }, { icon: 'step' });
      button(btnRow, '重置', function () { reset(); }, { icon: 'reset' });

      var stage = E('div', { class: 'labStage' });
      var canvas = E('canvas', { class: 'sdCanvas' });
      stage.appendChild(canvas);
      root.appendChild(stage);

      var noteBox = note(root);
      var statBox = stats(root);

      var player = kit.addPlayer(makePlayer(function () { return step(); }, function () {
        return 260 - state.speed * 20;
      }));
      player.onIdle = function () { setBtnLabel(playBtn, '继续'); };

      function makeBodies(n) {
        var arr = [{ m: STAR, x: 0, y: 0, vx: 0, vy: 0 }];
        var radii = [0.32, 0.5, 0.68, 0.86];
        for (var i = 1; i < n; i++) {
          var r = radii[i - 1] || (0.3 + i * 0.16);
          var ang = i * 2.39996;
          var v = Math.sqrt(G * STAR / r);
          arr.push({ m: 1, x: Math.cos(ang) * r, y: Math.sin(ang) * r, vx: -Math.sin(ang) * v, vy: Math.cos(ang) * v });
        }
        return arr;
      }

      function accel(bodies) {
        var a = [];
        var i, j;
        for (i = 0; i < bodies.length; i++) a.push({ x: 0, y: 0 });
        for (i = 0; i < bodies.length; i++) {
          for (j = i + 1; j < bodies.length; j++) {
            var dx = bodies[j].x - bodies[i].x;
            var dy = bodies[j].y - bodies[i].y;
            var d2 = dx * dx + dy * dy + SOFT;
            var inv = 1 / (d2 * Math.sqrt(d2));
            a[i].x += G * bodies[j].m * dx * inv;
            a[i].y += G * bodies[j].m * dy * inv;
            a[j].x -= G * bodies[i].m * dx * inv;
            a[j].y -= G * bodies[i].m * dy * inv;
          }
        }
        return a;
      }

      function integrate(dt) {
        var b = state.bodies;
        var a = accel(b);
        var i;
        for (i = 0; i < b.length; i++) {
          b[i].vx += a[i].x * dt / 2;
          b[i].vy += a[i].y * dt / 2;
          b[i].x += b[i].vx * dt;
          b[i].y += b[i].vy * dt;
        }
        var a2 = accel(b);
        for (i = 0; i < b.length; i++) {
          b[i].vx += a2[i].x * dt / 2;
          b[i].vy += a2[i].y * dt / 2;
        }
        state.t += dt;
        for (i = 0; i < b.length; i++) {
          var tr = state.trails[i];
          tr.push({ x: b[i].x, y: b[i].y });
          if (tr.length > 150) tr.shift();
        }
      }

      function energy() {
        var e = 0;
        var b = state.bodies;
        var i, j;
        for (i = 0; i < b.length; i++) {
          e += 0.5 * b[i].m * (b[i].vx * b[i].vx + b[i].vy * b[i].vy);
          for (j = i + 1; j < b.length; j++) {
            var dx = b[j].x - b[i].x;
            var dy = b[j].y - b[i].y;
            e -= G * b[i].m * b[j].m / Math.sqrt(dx * dx + dy * dy + SOFT);
          }
        }
        return e;
      }

      function step() {
        var k;
        for (k = 0; k < 2; k++) integrate(state.dt);
        state.steps++;
        draw();
        updateNote();
        return true;
      }

      function togglePlay() {
        if (player.playing) {
          player.pause();
          setBtnLabel(playBtn, '继续');
        } else {
          player.play();
          setBtnLabel(playBtn, '暂停');
        }
      }

      function reset() {
        player.pause();
        setBtnLabel(playBtn, '播放');
        state.bodies = makeBodies(state.n);
        state.trails = [];
        for (var i = 0; i < state.bodies.length; i++) state.trails.push([]);
        state.t = 0;
        state.steps = 0;
        state.e0 = energy();
        draw();
        updateNote();
      }

      function draw() {
        if (!view.ctx) return;
        var c = view.ctx;
        var w = view.w;
        var h = view.h;
        var maxR = 1.05;
        var sc = Math.min(w, h) * 0.42 / maxR;
        var cx = w / 2;
        var cy = h / 2;
        var i, k;
        c.clearRect(0, 0, w, h);

        c.strokeStyle = 'rgba(120,150,180,0.15)';
        c.lineWidth = 1;
        c.beginPath();
        c.arc(cx, cy, sc * maxR, 0, Math.PI * 2);
        c.stroke();

        for (i = 0; i < state.bodies.length; i++) {
          var tr = state.trails[i];
          if (tr.length > 1) {
            c.strokeStyle = COLORS[i % COLORS.length];
            c.globalAlpha = 0.45;
            c.lineWidth = 1.4;
            c.beginPath();
            for (k = 0; k < tr.length; k++) {
              var tx = cx + tr[k].x * sc;
              var ty = cy - tr[k].y * sc;
              if (k === 0) c.moveTo(tx, ty);
              else c.lineTo(tx, ty);
            }
            c.stroke();
            c.globalAlpha = 1;
          }
        }

        for (i = 0; i < state.bodies.length; i++) {
          var b = state.bodies[i];
          var x = cx + b.x * sc;
          var y = cy - b.y * sc;
          var r = i === 0 ? 9 : 4.5;
          c.beginPath();
          c.arc(x, y, r, 0, Math.PI * 2);
          c.fillStyle = COLORS[i % COLORS.length];
          c.fill();
        }
        label(c, 'G = 1，中心恒星质量 300', 12, 14, 'rgba(200,214,228,0.75)', 10);
      }

      function updateNote() {
        var e = energy();
        var drift = state.e0 ? (e - state.e0) / Math.abs(state.e0) * 100 : 0;
        noteBox.set(
          't = <b>' + state.t.toFixed(3) + '</b>，总能量 E = <b>' + e.toFixed(5) + '</b>。'
            + 'dt 越小、能量漂移越小；把 dt 调到最大，漂移会肉眼可见地变大。',
          '能量漂移 ' + drift.toFixed(4) + '%'
        );
        statBox.set([
          { label: '天体数', value: state.n },
          { label: '时间 t', value: state.t.toFixed(3) },
          { label: '总能量', value: e.toFixed(4), hot: true },
          { label: '漂移', value: drift.toFixed(3) + '%' }
        ]);
      }

      codeBlock(root, [
        'double[] ax = accelerations(bodies);',
        'for (int i = 0; i < n; i++) {',
        '    vx[i] += 0.5 * ax[i] * dt;',
        '    x[i] += vx[i] * dt;',
        '}',
        'ax = accelerations(bodies);',
        'for (int i = 0; i < n; i++) vx[i] += 0.5 * ax[i] * dt;'
      ]);

      function onResize() {
        var r = fitCanvas(canvas, 1);
        if (r) { view = r; draw(); }
      }
      view = fitCanvas(canvas, 1) || view;
      window.addEventListener('resize', onResize);
      kit.onDestroy(function () { window.removeEventListener('resize', onResize); });

      reset();
      return { destroy: function () { kit.destroy(); } };
    })
  };

  /* ---------------------------------------------------------------------
   * 4. stackqueue —— 栈与队列 + 括号匹配（ch17）
   * ------------------------------------------------------------------- */
  LABS.stackqueue = {
    title: '栈与队列实验台',
    desc: '同一组操作分别用 LIFO 和 FIFO 执行，再看括号匹配怎样一步步用栈完成。',
    tags: ['ch17'],
    icon: 'layers',
    order: 19,
    init: lab(function (root, props, ctx, kit) {
      var OPS = [
        { op: 'push', v: 3 }, { op: 'push', v: 1 }, { op: 'push', v: 4 }, { op: 'pop' },
        { op: 'push', v: 1 }, { op: 'pop' }, { op: 'pop' }, { op: 'push', v: 5 }, { op: 'pop' }, { op: 'pop' }
      ];
      var PAIR = { '(': ')', '[': ']', '{': '}' };
      var state = {
        mode: 'stack', idx: 0, data: [], out: [], last: '—', done: false,
        bracket: '{[()]}', bIdx: 0, bStack: [], bStatus: 'ready', bMsg: '点「单步」逐字符扫描'
      };
      var view = { ctx: null, w: 0, h: 0 };

      var intro = E('div', { class: 'labNote' });
      intro.innerHTML = '<span>同一串 push/pop，换成栈（LIFO）和队列（FIFO）会得到不同的输出序列。'
        + '切到「括号匹配」还能看到：左括号入栈、右括号与栈顶配对，扫完栈空才算合法。</span>';
      root.appendChild(intro);

      var ctlRow = ctl(root);
      selectBox(ctlRow, [
        { value: 'stack', label: '栈 · LIFO' },
        { value: 'queue', label: '队列 · FIFO' },
        { value: 'bracket', label: '括号匹配' }
      ], state.mode, function (v) { state.mode = v; reset(); });
      var bInput = textInput(ctlRow, {
        maxlength: 24, value: state.bracket, placeholder: '括号串，如 {[()]}',
        onInput: function (v) { state.bracket = v; }
      });
      button(ctlRow, '应用括号串', function () {
        state.bracket = bInput.value || '()';
        reset();
      });

      var btnRow = ctl(root);
      var playBtn = button(btnRow, '播放', function () { togglePlay(); }, { icon: 'play' });
      button(btnRow, '单步', function () { player.pause(); setBtnLabel(playBtn, '继续'); step(); }, { icon: 'step' });
      button(btnRow, '重置', function () { reset(); }, { icon: 'reset' });

      var stage = E('div', { class: 'labStage' });
      var canvas = E('canvas', { class: 'sdCanvas' });
      stage.appendChild(canvas);
      root.appendChild(stage);

      var noteBox = note(root);
      var statBox = stats(root);

      var player = kit.addPlayer(makePlayer(function () { return step(); }, function () { return 520; }));
      player.onIdle = function () { setBtnLabel(playBtn, '继续'); };

      function reset() {
        player.pause();
        setBtnLabel(playBtn, '播放');
        state.idx = 0;
        state.data = [];
        state.out = [];
        state.last = '—';
        state.done = false;
        state.bIdx = 0;
        state.bStack = [];
        state.bStatus = 'ready';
        state.bMsg = '点「单步」逐字符扫描';
        draw();
        updateNote();
      }

      function togglePlay() {
        if (player.playing) {
          player.pause();
          setBtnLabel(playBtn, '继续');
        } else {
          player.play();
          setBtnLabel(playBtn, '暂停');
        }
      }

      function step() {
        if (state.mode === 'bracket') return bracketStep();
        if (state.idx >= OPS.length) {
          state.done = true;
          return false;
        }
        var o = OPS[state.idx++];
        if (o.op === 'push') {
          state.data.push(o.v);
          state.last = 'push(' + o.v + ')';
        } else {
          var v = state.mode === 'stack' ? state.data.pop() : state.data.shift();
          state.out.push(v);
          state.last = 'pop() → ' + v;
        }
        draw();
        updateNote();
        return state.idx < OPS.length;
      }

      function bracketStep() {
        var s = state.bracket;
        if (state.bStatus === 'ok' || state.bStatus === 'err') return false;
        if (state.bIdx >= s.length) {
          if (state.bStack.length) {
            state.bStatus = 'err';
            state.bMsg = '扫描结束，栈里还有 ' + state.bStack.length + ' 个左括号没闭合——不合法';
          } else {
            state.bStatus = 'ok';
            state.bMsg = '扫描结束，栈为空——括号序列合法';
          }
          draw();
          updateNote();
          return false;
        }
        var ch = s.charAt(state.bIdx);
        var pos = state.bIdx;
        if (PAIR[ch]) {
          state.bStack.push({ ch: ch, pos: pos });
          state.bMsg = '位置 ' + pos + '：左括号 ' + ch + ' 入栈';
        } else if (ch === ')' || ch === ']' || ch === '}') {
          var top = state.bStack.pop();
          if (!top || PAIR[top.ch] !== ch) {
            state.bStatus = 'err';
            state.bMsg = '位置 ' + pos + '：' + ch + ' 与栈顶不匹配——不合法';
            state.bIdx = s.length;
            draw();
            updateNote();
            return false;
          }
          state.bMsg = '位置 ' + pos + '：' + ch + ' 与位置 ' + top.pos + ' 的 ' + top.ch + ' 配对出栈';
        } else {
          state.bMsg = '位置 ' + pos + '：' + ch + ' 不是括号，跳过';
        }
        state.bIdx++;
        draw();
        updateNote();
        return true;
      }

      function draw() {
        if (!view.ctx) return;
        var c = view.ctx;
        var w = view.w;
        var h = view.h;
        var i;
        c.clearRect(0, 0, w, h);
        if (state.mode === 'bracket') { drawBracket(c, w, h); return; }

        var isStack = state.mode === 'stack';
        label(c, isStack ? '栈 · 后进先出（LIFO）' : '队列 · 先进先出（FIFO）', 12, 16,
          'rgba(200,214,228,0.9)', 11);

        if (isStack) {
          var boxH = 34;
          var boxW = 120;
          var bx = w / 2 - boxW / 2;
          var topY = 42;
          for (i = 0; i < state.data.length; i++) {
            var y = topY + (state.data.length - 1 - i) * (boxH + 6);
            c.fillStyle = 'rgba(90,160,210,0.55)';
            c.fillRect(bx, y, boxW, boxH);
            c.strokeStyle = 'rgba(150,210,245,0.85)';
            c.lineWidth = 1.5;
            c.strokeRect(bx, y, boxW, boxH);
            label(c, String(state.data[i]), w / 2, y + boxH / 2, '#eaf4ff', 15, 'center');
          }
          if (state.data.length) {
            label(c, '← 栈顶（下一 个出）', bx + boxW + 10, topY + 16, 'rgba(120,220,255,0.9)', 10);
          } else {
            label(c, '（空栈）', w / 2, topY + 20, 'rgba(160,180,200,0.7)', 11, 'center');
          }
        } else {
          var qW = 48;
          var qH = 40;
          var qy = 52;
          var qx = 20;
          for (i = 0; i < state.data.length; i++) {
            var qxx = qx + i * (qW + 6);
            c.fillStyle = 'rgba(90,160,210,0.55)';
            c.fillRect(qxx, qy, qW, qH);
            c.strokeStyle = 'rgba(150,210,245,0.85)';
            c.lineWidth = 1.5;
            c.strokeRect(qxx, qy, qW, qH);
            label(c, String(state.data[i]), qxx + qW / 2, qy + qH / 2, '#eaf4ff', 15, 'center');
          }
          if (state.data.length) {
            label(c, '队首', qx + qW / 2, qy - 12, 'rgba(120,220,255,0.9)', 10, 'center');
            label(c, '队尾', qx + (state.data.length - 1) * (qW + 6) + qW / 2, qy - 12,
              'rgba(242,182,76,0.9)', 10, 'center');
          } else {
            label(c, '（空队列）', 20, qy + 20, 'rgba(160,180,200,0.7)', 11);
          }
        }

        label(c, '输出序列：' + (state.out.length ? state.out.join('  ') : '（还没有出队/出栈）'),
          12, h - 62, 'rgba(158,222,160,0.95)', 11);

        var chipW = Math.min(52, (w - 20) / OPS.length - 4);
        var opY = h - 30;
        for (i = 0; i < OPS.length; i++) {
          var ox = 10 + i * ((w - 20) / OPS.length);
          var cur = i === state.idx - 1;
          c.fillStyle = cur ? 'rgba(120,220,255,0.28)' : 'rgba(120,150,180,0.12)';
          c.fillRect(ox, opY, chipW, 22);
          c.strokeStyle = cur ? 'rgba(120,220,255,0.8)' : 'rgba(120,150,180,0.3)';
          c.lineWidth = 1;
          c.strokeRect(ox, opY, chipW, 22);
          var txt = OPS[i].op === 'push' ? 'p' + OPS[i].v : 'pop';
          label(c, txt, ox + chipW / 2, opY + 11, cur ? '#eaf4ff' : 'rgba(190,205,220,0.75)', 10, 'center');
        }
      }

      function drawBracket(c, w, h) {
        var s = state.bracket;
        var n = Math.max(1, s.length);
        var cw = Math.min(34, (w - 24) / n);
        var ox = (w - cw * n) / 2;
        var y = 34;
        var i;
        label(c, '括号串（从左到右扫描）', 12, 16, 'rgba(200,214,228,0.9)', 11);
        for (i = 0; i < s.length; i++) {
          var x = ox + i * cw;
          var ch = s.charAt(i);
          var cur = i === state.bIdx && state.bStatus !== 'ok' && state.bStatus !== 'err';
          var open = !!PAIR[ch];
          c.fillStyle = cur ? 'rgba(120,220,255,0.35)'
            : (open ? 'rgba(90,160,210,0.45)' : 'rgba(180,140,90,0.4)');
          c.fillRect(x + 1, y, cw - 2, 30);
          c.strokeStyle = cur ? 'rgba(120,220,255,0.95)' : 'rgba(150,180,210,0.4)';
          c.lineWidth = cur ? 2 : 1;
          c.strokeRect(x + 1, y, cw - 2, 30);
          label(c, ch, x + cw / 2, y + 15, '#eaf4ff', 14, 'center');
          label(c, String(i), x + cw / 2, y + 40, 'rgba(150,170,190,0.6)', 9, 'center');
        }

        label(c, '栈（左括号）', 14, 100, 'rgba(200,214,228,0.9)', 11);
        var sx = 14;
        var sw = 70;
        for (i = 0; i < state.bStack.length; i++) {
          var sy = 112 + (state.bStack.length - 1 - i) * 30;
          c.fillStyle = 'rgba(90,160,210,0.5)';
          c.fillRect(sx, sy, sw, 24);
          c.strokeStyle = 'rgba(150,210,245,0.8)';
          c.lineWidth = 1;
          c.strokeRect(sx, sy, sw, 24);
          label(c, state.bStack[i].ch + ' @' + state.bStack[i].pos, sx + sw / 2, sy + 12,
            '#eaf4ff', 11, 'center');
        }
        if (!state.bStack.length) label(c, '（空）', sx + sw / 2, 124, 'rgba(160,180,200,0.65)', 10, 'center');

        var color = state.bStatus === 'err' ? 'rgba(235,120,120,0.95)'
          : (state.bStatus === 'ok' ? 'rgba(120,222,160,0.95)' : 'rgba(190,205,220,0.85)');
        label(c, state.bMsg, 12, h - 14, color, 11);
      }

      function updateNote() {
        if (state.mode === 'bracket') {
          var result = state.bStatus === 'ok' ? '合法' : (state.bStatus === 'err' ? '不合法' : '扫描中');
          noteBox.set(state.bMsg, result);
          statBox.set([
            { label: '字符数', value: state.bracket.length },
            { label: '已扫描', value: Math.min(state.bIdx, state.bracket.length) },
            { label: '栈深', value: state.bStack.length, hot: true },
            { label: '结果', value: result }
          ]);
          return;
        }
        var left = Math.max(0, OPS.length - state.idx);
        noteBox.set(
          '当前操作：<b>' + state.last + '</b>；' + (state.done ? '全部操作完成。' : '还剩 ' + left + ' 步。')
            + ' 同一个 push 序列，栈与队列的输出顺序不同——换模式再点一次播放对比。',
          state.out.length ? '输出 ' + state.out.join(' ') : '输出（空）'
        );
        statBox.set([
          { label: '模式', value: state.mode === 'stack' ? 'LIFO' : 'FIFO' },
          { label: '已执行', value: state.idx + '/' + OPS.length },
          { label: '结构大小', value: state.data.length, hot: true },
          { label: '已弹出', value: state.out.length }
        ]);
      }

      function onResize() {
        var r = fitCanvas(canvas, 0.8);
        if (r) { view = r; draw(); }
      }
      view = fitCanvas(canvas, 0.8) || view;
      window.addEventListener('resize', onResize);
      kit.onDestroy(function () { window.removeEventListener('resize', onResize); });

      codeBlock(root, [
        'static boolean isBalanced(String s) {',
        '    Stack<Character> stack = new Stack<Character>();',
        '    for (int i = 0; i < s.length(); i++) {',
        '        char c = s.charAt(i);',
        '        if ("([{".indexOf(c) >= 0) stack.push(c);',
        '        else if (!stack.isEmpty() && match(stack.peek(), c)) stack.pop();',
        '        else return false;',
        '    }',
        '    return stack.isEmpty();',
        '}'
      ]);

      reset();
      return { destroy: function () { kit.destroy(); } };
    })
  };

  /* ---------------------------------------------------------------------
   * 5. symboltable —— 符号表：BST 与哈希桶（ch18）
   * ------------------------------------------------------------------- */
  LABS.symboltable = {
    title: '符号表实验台',
    desc: '插入键、查找键：看 BST 的比较路径，也看哈希桶里的链。',
    tags: ['ch18'],
    icon: 'grid',
    order: 20,
    init: lab(function (root, props, ctx, kit) {
      var SEQ = ['S', 'E', 'A', 'R', 'C', 'H', 'X', 'M', 'P', 'L'];
      var state = {
        mode: 'bst', seq: SEQ.slice(), idx: 0, root: null, count: 0,
        comps: 0, path: [], lastKey: '', found: null,
        buckets: [], bucketN: 7
      };
      var view = { ctx: null, w: 0, h: 0 };

      var intro = E('div', { class: 'labNote' });
      intro.innerHTML = '<span>符号表就是「键 → 值」。这里用 BST 与哈希桶两种实现存同一批键：'
        + 'BST 每次比较往左或往右走一步；哈希表先用 <b>键的字符和 % 7</b> 找桶，再在桶里逐个比较。'
        + '观察两种结构的比较次数。</span>';
      root.appendChild(intro);

      var ctlRow = ctl(root);
      selectBox(ctlRow, [
        { value: 'bst', label: 'BST（二叉查找树）' },
        { value: 'hash', label: '哈希桶（分离链接）' }
      ], state.mode, function (v) { state.mode = v; reset(); });
      var keyInput = textInput(ctlRow, {
        maxlength: 8, value: 'Q', placeholder: '键，如 Q',
        onInput: function () {}
      });
      button(ctlRow, '插入键', function () { applyKey('insert'); });
      button(ctlRow, '查找键', function () { applyKey('search'); });

      var btnRow = ctl(root);
      var playBtn = button(btnRow, '自动插入', function () { togglePlay(); }, { icon: 'play' });
      button(btnRow, '插入下一个', function () { player.pause(); setBtnLabel(playBtn, '继续'); step(); }, { icon: 'step' });
      button(btnRow, '清空', function () { reset(); }, { icon: 'reset' });

      var stage = E('div', { class: 'labStage' });
      var canvas = E('canvas', { class: 'sdCanvas' });
      stage.appendChild(canvas);
      root.appendChild(stage);

      var noteBox = note(root);
      var statBox = stats(root);

      var player = kit.addPlayer(makePlayer(function () { return step(); }, function () { return 620; }));
      player.onIdle = function () { setBtnLabel(playBtn, '继续'); };

      function reset() {
        player.pause();
        setBtnLabel(playBtn, '自动插入');
        state.idx = 0;
        state.root = null;
        state.count = 0;
        state.comps = 0;
        state.path = [];
        state.lastKey = '';
        state.found = null;
        state.buckets = [];
        for (var i = 0; i < state.bucketN; i++) state.buckets.push([]);
        draw();
        updateNote();
      }

      function countNodes(n) { return n ? 1 + countNodes(n.left) + countNodes(n.right) : 0; }

      function treeHeight(n) {
        if (!n) return 0;
        return 1 + Math.max(treeHeight(n.left), treeHeight(n.right));
      }

      function bstInsert(key) {
        state.path = [];
        state.comps = 0;
        state.lastKey = key;
        state.found = null;
        if (!state.root) {
          state.root = { key: key, left: null, right: null };
          state.path = [key];
          state.count = 1;
          return;
        }
        var n = state.root;
        while (true) {
          state.comps++;
          state.path.push(n.key);
          if (key < n.key) {
            if (n.left) n = n.left;
            else { n.left = { key: key, left: null, right: null }; break; }
          } else if (key > n.key) {
            if (n.right) n = n.right;
            else { n.right = { key: key, left: null, right: null }; break; }
          } else {
            break;
          }
        }
        state.path.push(key);
        state.count = countNodes(state.root);
      }

      function bstSearch(key) {
        var n = state.root;
        var path = [];
        var comps = 0;
        var found = false;
        while (n) {
          comps++;
          path.push(n.key);
          if (key === n.key) { found = true; break; }
          n = key < n.key ? n.left : n.right;
        }
        state.path = path;
        state.comps = comps;
        state.lastKey = key;
        state.found = found;
      }

      function hashIdx(key) {
        var s = 0;
        for (var i = 0; i < key.length; i++) s += key.charCodeAt(i);
        return s % state.bucketN;
      }

      function hashInsert(key) {
        var b = hashIdx(key);
        var chain = state.buckets[b];
        state.comps = chain.length;
        state.lastKey = key;
        state.found = null;
        state.path = [key];
        if (chain.indexOf(key) < 0) chain.push(key);
        state.count = 0;
        for (var i = 0; i < state.bucketN; i++) state.count += state.buckets[i].length;
      }

      function hashSearch(key) {
        var b = hashIdx(key);
        var chain = state.buckets[b];
        var found = false;
        var comps = 0;
        for (var i = 0; i < chain.length; i++) {
          comps++;
          if (chain[i] === key) { found = true; break; }
        }
        state.comps = comps;
        state.lastKey = key;
        state.found = found;
        state.path = [key];
      }

      function applyKey(kind) {
        var key = String(keyInput.value || '').trim().toUpperCase().slice(0, 4);
        if (!key) return;
        if (state.mode === 'bst') {
          if (kind === 'insert') bstInsert(key);
          else bstSearch(key);
        } else {
          if (kind === 'insert') hashInsert(key);
          else hashSearch(key);
        }
        draw();
        updateNote();
      }

      function step() {
        if (state.idx >= state.seq.length) return false;
        var key = state.seq[state.idx++];
        if (state.mode === 'bst') bstInsert(key);
        else hashInsert(key);
        draw();
        updateNote();
        return state.idx < state.seq.length;
      }

      function togglePlay() {
        if (player.playing) {
          player.pause();
          setBtnLabel(playBtn, '继续');
        } else {
          if (state.idx >= state.seq.length) reset();
          player.play();
          setBtnLabel(playBtn, '暂停');
        }
      }

      function maxChainLen() {
        var m = 0;
        for (var i = 0; i < state.bucketN; i++) m = Math.max(m, state.buckets[i].length);
        return m;
      }

      function draw() {
        if (!view.ctx) return;
        var c = view.ctx;
        var w = view.w;
        var h = view.h;
        c.clearRect(0, 0, w, h);
        if (state.mode === 'bst') drawBST(c, w, h);
        else drawHash(c, w, h);
      }

      function drawBST(c, w, h) {
        label(c, 'BST · 键沿比较路径落位', 12, 16, 'rgba(200,214,228,0.9)', 11);
        if (!state.root) {
          label(c, '（空树）', w / 2, h / 2, 'rgba(160,180,200,0.7)', 12, 'center');
          return;
        }
        var nodes = [];
        (function walk(n, d) {
          if (!n) return;
          walk(n.left, d + 1);
          nodes.push({ n: n, d: d });
          walk(n.right, d + 1);
        })(state.root, 0);
        var maxD = 0;
        var i;
        for (i = 0; i < nodes.length; i++) maxD = Math.max(maxD, nodes[i].d);
        var padX = 22;
        var padY = 36;
        var step = (w - padX * 2) / nodes.length;
        var levelH = maxD ? Math.min(46, (h - padY - 26) / maxD) : 0;
        var pos = {};
        for (i = 0; i < nodes.length; i++) {
          var it = nodes[i];
          it.x = padX + (i + 0.5) * step;
          it.y = padY + it.d * levelH;
          pos[it.n.key] = it;
        }
        var inPath = {};
        for (i = 0; i < state.path.length; i++) inPath[state.path[i]] = i;

        (function edges(n) {
          if (!n) return;
          var p = pos[n.key];
          var kids = [n.left, n.right];
          for (var k = 0; k < kids.length; k++) {
            var ch = kids[k];
            if (!ch) continue;
            var q = pos[ch.key];
            var hi = inPath[n.key] !== undefined && inPath[ch.key] !== undefined
              && inPath[ch.key] === inPath[n.key] + 1;
            c.strokeStyle = hi ? 'rgba(120,220,255,0.9)' : 'rgba(120,150,180,0.35)';
            c.lineWidth = hi ? 2 : 1;
            c.beginPath();
            c.moveTo(p.x, p.y + 13);
            c.lineTo(q.x, q.y - 13);
            c.stroke();
            edges(ch);
          }
        })(state.root);

        for (i = 0; i < nodes.length; i++) {
          var it2 = nodes[i];
          var n = it2.n;
          var isLast = n.key === state.lastKey;
          var fill = isLast && state.found === true ? 'rgba(90,200,140,0.82)'
            : isLast && state.found === false ? 'rgba(210,110,110,0.78)'
              : isLast ? 'rgba(120,220,255,0.6)' : 'rgba(70,120,170,0.65)';
          c.beginPath();
          c.arc(it2.x, it2.y, 13, 0, Math.PI * 2);
          c.fillStyle = fill;
          c.fill();
          c.strokeStyle = isLast ? 'rgba(160,235,255,0.95)' : 'rgba(150,190,225,0.6)';
          c.lineWidth = isLast ? 2 : 1;
          c.stroke();
          label(c, n.key, it2.x, it2.y, '#eaf4ff', 12, 'center');
        }
        label(c, '比较路径：' + (state.path.length ? state.path.join(' → ') : '（无路径）'),
          12, h - 12, 'rgba(190,205,220,0.85)', 10);
      }

      function drawHash(c, w, h) {
        label(c, '哈希桶 · 键的字符和 % 7 决定桶号', 12, 16, 'rgba(200,214,228,0.9)', 11);
        var pad = 12;
        var colW = (w - pad * 2) / state.bucketN;
        var topY = 44;
        var i;
        var lastBucket = state.lastKey ? hashIdx(state.lastKey) : -1;
        for (i = 0; i < state.bucketN; i++) {
          var x = pad + i * colW;
          var isBucket = i === lastBucket;
          c.fillStyle = isBucket ? 'rgba(120,220,255,0.18)' : 'rgba(120,150,180,0.12)';
          c.fillRect(x + 2, topY, colW - 4, 20);
          c.strokeStyle = isBucket ? 'rgba(120,220,255,0.55)' : 'rgba(120,150,180,0.3)';
          c.lineWidth = 1;
          c.strokeRect(x + 2, topY, colW - 4, 20);
          label(c, String(i), x + colW / 2, topY + 10,
            isBucket ? '#eaf4ff' : 'rgba(180,200,220,0.8)', 10, 'center');
          var chain = state.buckets[i];
          for (var j = 0; j < chain.length; j++) {
            var by = topY + 28 + j * 30;
            var isLast = chain[j] === state.lastKey;
            c.fillStyle = isLast && state.found === true ? 'rgba(90,200,140,0.82)'
              : isLast && state.found === false ? 'rgba(210,110,110,0.78)'
                : isBucket ? 'rgba(90,160,210,0.55)' : 'rgba(70,120,170,0.45)';
            c.fillRect(x + 4, by, colW - 8, 24);
            c.strokeStyle = isLast ? 'rgba(160,235,255,0.9)' : 'rgba(120,150,180,0.35)';
            c.strokeRect(x + 4, by, colW - 8, 24);
            label(c, chain[j], x + colW / 2, by + 12, '#eaf4ff', 11, 'center');
            if (j < chain.length - 1) {
              c.strokeStyle = 'rgba(150,180,210,0.5)';
              c.beginPath();
              c.moveTo(x + colW / 2, by + 24);
              c.lineTo(x + colW / 2, by + 30);
              c.stroke();
            }
          }
        }
        var res = state.found === null ? '' : state.found ? ' · 命中' : ' · 未命中';
        label(c, '最近比较次数：' + state.comps + res, 12, h - 12,
          'rgba(190,205,220,0.85)', 10);
      }

      function updateNote() {
        var mode = state.mode === 'bst' ? 'BST' : '哈希桶';
        var info = state.mode === 'bst'
          ? '树高 ' + treeHeight(state.root) + '，节点 ' + state.count
          : '最长链 ' + maxChainLen() + '，节点 ' + state.count;
        noteBox.set(mode + '：' + info + '，最近一次操作比较 ' + state.comps + ' 次。'
          + ' 同样的键，BST 的比较次数随树的形状变化，哈希桶则接近常数。',
          state.lastKey ? '最近键 ' + state.lastKey + (state.found === null ? '' : state.found ? ' · 找到' : ' · 未找到') : '');
        statBox.set([
          { label: '模式', value: mode },
          { label: '节点数', value: state.count },
          { label: state.mode === 'bst' ? '树高' : '最长链', value: state.mode === 'bst' ? treeHeight(state.root) : maxChainLen() },
          { label: '比较次数', value: state.comps, hot: true }
        ]);
      }

      function onResize() {
        var r = fitCanvas(canvas, 0.78);
        if (r) { view = r; draw(); }
      }
      view = fitCanvas(canvas, 0.78) || view;
      window.addEventListener('resize', onResize);
      kit.onDestroy(function () { window.removeEventListener('resize', onResize); });

      codeBlock(root, [
        'private Node put(Node x, String key, int val) {',
        '    if (x == null) return new Node(key, val);',
        '    int cmp = key.compareTo(x.key);',
        '    if (cmp < 0) x.left = put(x.left, key, val);',
        '    else if (cmp > 0) x.right = put(x.right, key, val);',
        '    else x.val = val;',
        '    return x;',
        '}'
      ]);

      reset();
      return { destroy: function () { kit.destroy(); } };
    })
  };

  /* ---------------------------------------------------------------------
   * 6. graph —— 图与搜索：BFS / DFS（ch19）
   * ------------------------------------------------------------------- */
  LABS.graph = {
    title: '图与搜索实验台',
    desc: 'BFS 与 DFS 访问同一张图：看访问顺序、树边与层数。',
    tags: ['ch19'],
    icon: 'branch',
    order: 21,
    init: lab(function (root, props, ctx, kit) {
      var state = {
        n: 12, algo: 'bfs', source: 0, seed: 20261112,
        adj: [], order: [], parent: [], dist: [], step: 0, speed: 3
      };
      var view = { ctx: null, w: 0, h: 0 };

      var intro = E('div', { class: 'labNote' });
      intro.innerHTML = '<span>同一张无向图（12 个顶点：环形边 + 4 条长边），换 BFS / DFS 看访问顺序怎么变。'
        + '高亮的是搜索树边：BFS 的树边按层展开，DFS 则一路深入再回溯。</span>';
      root.appendChild(intro);

      var ctlRow = ctl(root);
      selectBox(ctlRow, [
        { value: 'bfs', label: 'BFS（队列 · 逐层）' },
        { value: 'dfs', label: 'DFS（栈/递归 · 深入）' }
      ], state.algo, function (v) { state.algo = v; rebuild(); });
      var speed = slider(ctlRow, {
        label: '速度', min: 1, max: 5, step: 1, value: state.speed,
        onInput: function (v) { state.speed = v; }
      });

      var btnRow = ctl(root);
      var playBtn = button(btnRow, '播放', function () { togglePlay(); }, { icon: 'play' });
      button(btnRow, '单步', function () { player.pause(); setBtnLabel(playBtn, '继续'); step(); }, { icon: 'step' });
      button(btnRow, '换源点', function () { player.pause(); setBtnLabel(playBtn, '播放'); state.source = (state.source + 1) % state.n; rebuild(); }, { icon: 'compass' });
      button(btnRow, '重建图', function () { player.pause(); setBtnLabel(playBtn, '播放'); state.seed = (state.seed * 31 + 7) % 99991; buildGraph(); rebuild(); }, { icon: 'reset' });
      button(btnRow, '重置', function () { reset(); }, { icon: 'reset' });

      var stage = E('div', { class: 'labStage' });
      var canvas = E('canvas', { class: 'sdCanvas' });
      stage.appendChild(canvas);
      root.appendChild(stage);

      var noteBox = note(root);
      var statBox = stats(root);

      var player = kit.addPlayer(makePlayer(function () { return step(); }, function () { return Math.round(760 / state.speed); }));
      player.onIdle = function () { setBtnLabel(playBtn, '播放'); };

      function buildGraph() {
        state.adj = [];
        for (var i = 0; i < state.n; i++) state.adj.push([]);
        var rnd = lcg(state.seed);
        function has(a, b) { return state.adj[a].indexOf(b) >= 0; }
        function add(a, b) {
          if (has(a, b)) return;
          state.adj[a].push(b);
          state.adj[b].push(a);
        }
        for (i = 0; i < state.n; i++) {
          add(i, (i + 1) % state.n);
          add(i, (i + 2) % state.n);
        }
        var longEdges = 0;
        var tries = 0;
        while (longEdges < 4 && tries < 120) {
          tries++;
          var a = Math.floor(rnd() * state.n);
          var b = Math.floor(rnd() * state.n);
          if (a === b) continue;
          var d1 = Math.abs(a - b);
          var d2 = state.n - d1;
          if (d1 <= 2 || d2 <= 2) continue;
          if (has(a, b)) continue;
          add(a, b);
          longEdges++;
        }
        for (i = 0; i < state.n; i++) state.adj[i].sort(function (x, y) { return x - y; });
      }

      function runBFS(src) {
        var order = [];
        var parent = [];
        var dist = [];
        var visited = {};
        var i;
        for (i = 0; i < state.n; i++) { parent[i] = -1; dist[i] = -1; }
        var q = [src];
        visited[src] = 1;
        parent[src] = src;
        dist[src] = 0;
        while (q.length) {
          var v = q.shift();
          order.push(v);
          for (i = 0; i < state.adj[v].length; i++) {
            var w = state.adj[v][i];
            if (!visited[w]) {
              visited[w] = 1;
              parent[w] = v;
              dist[w] = dist[v] + 1;
              q.push(w);
            }
          }
        }
        return { order: order, parent: parent, dist: dist };
      }

      function runDFS(src) {
        var order = [];
        var parent = [];
        var dist = [];
        var visited = {};
        var i;
        for (i = 0; i < state.n; i++) { parent[i] = -1; dist[i] = -1; }
        function dfs(v) {
          visited[v] = 1;
          order.push(v);
          for (var k = 0; k < state.adj[v].length; k++) {
            var w = state.adj[v][k];
            if (!visited[w]) {
              parent[w] = v;
              dist[w] = dist[v] + 1;
              dfs(w);
            }
          }
        }
        parent[src] = src;
        dist[src] = 0;
        dfs(src);
        return { order: order, parent: parent, dist: dist };
      }

      function rebuild() {
        var r = state.algo === 'bfs' ? runBFS(state.source) : runDFS(state.source);
        state.order = r.order;
        state.parent = r.parent;
        state.dist = r.dist;
        state.step = 0;
        draw();
        updateNote();
      }

      function reset() {
        player.pause();
        setBtnLabel(playBtn, '播放');
        state.step = 0;
        draw();
        updateNote();
      }

      function step() {
        if (state.step >= state.order.length) return false;
        state.step++;
        draw();
        updateNote();
        return state.step < state.order.length;
      }

      function togglePlay() {
        if (player.playing) {
          player.pause();
          setBtnLabel(playBtn, '继续');
        } else {
          if (state.step >= state.order.length) state.step = 0;
          player.play();
          setBtnLabel(playBtn, '暂停');
        }
      }

      buildGraph();
      rebuild();

      function draw() {
        if (!view.ctx) return;
        var c = view.ctx;
        var w = view.w;
        var h = view.h;
        var i;
        var j;
        c.clearRect(0, 0, w, h);
        var cx = w / 2;
        var cy = h / 2 + 4;
        var R = Math.min(w, h) * 0.36;
        var pos = [];
        for (i = 0; i < state.n; i++) {
          var ang = -Math.PI / 2 + i * 2 * Math.PI / state.n;
          pos.push({ x: cx + Math.cos(ang) * R, y: cy + Math.sin(ang) * R });
        }
        var visited = {};
        for (i = 0; i < state.step; i++) visited[state.order[i]] = 1;
        var cur = state.step > 0 ? state.order[state.step - 1] : -1;
        var treeEdge = {};
        for (i = 0; i < state.n; i++) {
          if (visited[i] && state.parent[i] >= 0 && state.parent[i] !== i) {
            var a = i;
            var b = state.parent[i];
            treeEdge[Math.min(a, b) + '-' + Math.max(a, b)] = 1;
          }
        }
        for (i = 0; i < state.n; i++) {
          for (j = 0; j < state.adj[i].length; j++) {
            var nb = state.adj[i][j];
            if (nb <= i) continue;
            var isTree = treeEdge[i + '-' + nb];
            c.strokeStyle = isTree ? 'rgba(120,220,255,0.95)' : 'rgba(120,150,180,0.28)';
            c.lineWidth = isTree ? 2.4 : 1;
            c.beginPath();
            c.moveTo(pos[i].x, pos[i].y);
            c.lineTo(pos[nb].x, pos[nb].y);
            c.stroke();
          }
        }
        for (i = 0; i < state.n; i++) {
          var r = i === state.source ? 15 : 13;
          var fill = i === cur ? 'rgba(242,182,76,0.88)'
            : visited[i] ? 'rgba(90,160,210,0.78)' : 'rgba(60,90,120,0.5)';
          c.beginPath();
          c.arc(pos[i].x, pos[i].y, r, 0, Math.PI * 2);
          c.fillStyle = fill;
          c.fill();
          c.strokeStyle = i === state.source ? 'rgba(120,220,255,0.95)' : 'rgba(150,190,225,0.5)';
          c.lineWidth = i === state.source ? 2 : 1;
          c.stroke();
          label(c, String(i), pos[i].x, pos[i].y, '#eaf4ff', 11, 'center');
          if (visited[i] && state.algo === 'bfs') {
            label(c, 'd' + state.dist[i], pos[i].x, pos[i].y + 21, 'rgba(160,200,230,0.85)', 9, 'center');
          }
        }
        var seq = state.order.slice(0, state.step).join(' → ');
        label(c, state.algo.toUpperCase() + ' 访问序：' + (seq || '（尚未开始）'),
          10, h - 10, 'rgba(190,205,220,0.9)', 10);
      }

      function updateNote() {
        var vis = state.order.slice(0, state.step);
        var maxD = 0;
        var sumD = 0;
        var cnt = 0;
        var i;
        for (i = 0; i < vis.length; i++) {
          var v = vis[i];
          if (state.dist[v] >= 0) {
            maxD = Math.max(maxD, state.dist[v]);
            sumD += state.dist[v];
            cnt++;
          }
        }
        var cur = state.step > 0 ? state.order[state.step - 1] : null;
        noteBox.set(
          (state.algo === 'bfs'
            ? 'BFS 用队列：先访问的顶点先扩展，所以按层推进，第一次到达就是最短路。'
            : 'DFS 用栈/递归：沿一条路走到底，再回溯换分支，树边不一定是最短路。')
            + (state.step >= state.order.length
              ? ' 全部 ' + state.n + ' 个顶点访问完毕。'
              : ' 当前第 ' + state.step + ' 步。'),
          cur === null ? '尚未开始' : '当前顶点 ' + cur
        );
        statBox.set([
          { label: '算法', value: state.algo.toUpperCase() },
          { label: '已访问', value: vis.length + '/' + state.n, hot: true },
          { label: '当前', value: cur === null ? '—' : String(cur) },
          { label: state.algo === 'bfs' ? '最大层数' : '最大深度', value: maxD },
          { label: '平均距离', value: cnt ? (sumD / cnt).toFixed(2) : '—' }
        ]);
      }

      function onResize() {
        var r = fitCanvas(canvas, 0.82);
        if (r) { view = r; draw(); }
      }
      view = fitCanvas(canvas, 0.82) || view;
      window.addEventListener('resize', onResize);
      kit.onDestroy(function () { window.removeEventListener('resize', onResize); });

      codeBlock(root, [
        'private void bfs(int s) {',
        '    boolean[] marked = new boolean[V];',
        '    int[] dist = new int[V];',
        '    Queue<Integer> q = new LinkedList<Integer>();',
        '    q.add(s); marked[s] = true; dist[s] = 0;',
        '    while (!q.isEmpty()) {',
        '        int v = q.remove();',
        '        for (int w : adj[v]) {',
        '            if (!marked[w]) {',
        '                marked[w] = true; dist[w] = dist[v] + 1; q.add(w);',
        '            }',
        '        }',
        '    }',
        '}'
      ]);

      reset();
      return { destroy: function () { kit.destroy(); } };
    })
  };

  CSC.registerLabs(LABS);
})();
