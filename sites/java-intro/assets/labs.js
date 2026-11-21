/* =====================================================================
 * 计算机科学与 Java 编程导论 · 学习站 · labs.js
 * 职责：用 CSC.registerLabs 注册全部 15 个交互实验台。
 *   sorting search trace array loops conditionals memory recursion
 *   bigo doubling string collections oop hashmap stddraw
 * 每个实验台：标题/说明（由 app.js 卡片渲染）+ 可操作控件 + 可视化 +
 *   状态说明条 + 重置 + 单步/播放；动画基于 requestAnimationFrame。
 * 依赖：CSC.viz（viz.js）。trace / loops / memory 与解释器联动，
 *   CSC.java 未就绪时自动降级为预设数据演示，绝不抛错。
 * 约定：不写内联 style；IIFE；中文注释；init 返回 { destroy() }。
 * 作者模块：labs-member
 * ===================================================================== */
(function () {
  'use strict';

  var CSC = window.CSC;
  if (!CSC) {
    console.error('[labs] 必须先加载 app.js');
    return;
  }

  /* =====================================================================
   * 一、基础工具：DOM 工厂 / 控件 / 播放器 / 生命周期
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

  /** 速度滑块；返回句柄，set 可外部回写显示值 */
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

  /** 代码展示（.codeBox 复用）：有 CSC.codeLines 时用站点统一的 Java 高亮，否则降级纯文本 */
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

  /**
   * 解释器状态徽标：engine:ready 之前显示「加载中」，之后显示「已就绪」。
   * onReady 在引擎就绪时回调（已就绪则立即回调）。
   */
  function engineStatus(parent, onReady) {
    var alive = true;
    var p = E('span', { class: 'pill info' });
    var readyFired = false;
    if (parent) parent.appendChild(p);
    function refresh() {
      if (!alive) return;
      if (CSC.java) {
        p.className = 'pill ok';
        p.textContent = '解释器已就绪';
      } else {
        p.className = 'pill info';
        p.textContent = '解释器加载中…（预设模式可用）';
      }
    }
    function fire() {
      if (!CSC.java || readyFired || !alive) return;
      readyFired = true;
      if (onReady) onReady();
    }
    refresh();
    if (CSC.java) fire();
    if (CSC.bus && CSC.bus.on) {
      CSC.bus.on('engine:ready', function () { refresh(); fire(); });
    }
    /* 打开用到解释器的实验台时主动按需加载 engine.js（幂等；失败也不影响预设模式） */
    if (!CSC.java && typeof CSC.loadModule === 'function') {
      try {
        CSC.loadModule('engine').then(function () { refresh(); fire(); });
      } catch (e) { /* 忽略：预设模式仍然可用 */ }
    }
    return {
      el: p,
      isReady: function () { return !!CSC.java; },
      setText: function (text, kind) {
        p.className = 'pill ' + (kind || '');
        p.textContent = text;
      },
      destroy: function () { alive = false; }
    };
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
   * app.js 目前丢弃 init 的返回值，因此额外用 MutationObserver 监听 #content，
   * 一旦本实验台的根节点被移出文档就主动清理播放器/定时器。
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
   * 二、实验台定义
   * ===================================================================== */
  var LABS = {};

  /* =====================================================================
   * 1. sorting —— 排序算法可视化
   * ===================================================================== */
  var SORT_INFO = {
    selection: {
      label: '选择排序', en: 'Selection Sort', icon: 'sort',
      note: '每轮在未排序区间里找最小值，换到区间最前面；比较次数约 n²/2，与初始顺序无关。'
    },
    insertion: {
      label: '插入排序', en: 'Insertion Sort', icon: 'sort',
      note: '把当前元素插入左边已有序的部分；数组越接近有序越快，最坏（逆序）仍是 O(n²)。'
    },
    merge: {
      label: '归并排序', en: 'Merge Sort', icon: 'layers',
      note: '先递归对半分，再把两段有序子数组合并；稳定 O(n log n)，代价是需要额外数组空间。'
    },
    quick: {
      label: '快速排序', en: 'Quick Sort', icon: 'zap',
      note: '选 pivot 把数组分成「更小 / 不小于」两段再递归；平均 O(n log n)，最坏（已有序 + 取末尾）O(n²)。'
    }
  };

  /** 生成 10 个互不相同的随机高度，方便看清柱子排序 */
  function makeValues(n) {
    var pool = [];
    var i;
    for (i = 0; i < n; i++) pool.push(6 + i * 5);
    for (i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pool[i];
      pool[i] = pool[j];
      pool[j] = t;
    }
    return pool;
  }

  /**
   * 把一种排序算法编译成「事件流」。
   * 好处：动画播放与算法逻辑解耦——单步/自动/重置都只是在事件流上移动指针。
   * 事件类型：compare / swap / set / range / sorted / key / pivot / done
   */
  function buildSortOps(algo, values) {
    var a = values.slice();
    var n = a.length;
    var ops = [];
    var compares = 0;
    var swaps = 0;

    function base(type, extra) {
      var ev = { type: type, compares: compares, swaps: swaps };
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) ev[k] = extra[k];
      }
      ops.push(ev);
      return ev;
    }
    function cmp(i, j, note) {
      compares++;
      base('compare', { idx: [i, j], note: note });
    }
    function swap(i, j, note) {
      if (i === j) return;
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
      swaps++;
      base('swap', { i: i, j: j, note: note });
    }
    function set(i, value, note) {
      a[i] = value;
      swaps++;
      base('set', { i: i, value: value, note: note });
    }
    function markSorted(i, note) {
      base('sorted', { i: i, note: note });
    }

    if (algo === 'selection') {
      for (var i = 0; i < n - 1; i++) {
        var min = i;
        base('range', {
          lo: i, hi: n - 1,
          note: '第 ' + (i + 1) + ' 轮：在下标 [' + i + '..' + (n - 1) + '] 里找最小值'
        });
        for (var j = i + 1; j < n; j++) {
          cmp(min, j, '比较 a[' + min + ']=' + a[min] + ' 与 a[' + j + ']=' + a[j] + '，更小的成为新的最小值下标');
          if (a[j] < a[min]) min = j;
        }
        if (min !== i) swap(i, min, '最小值 ' + a[min] + ' 换到下标 ' + i);
        markSorted(i, '下标 ' + i + ' 已就位（本轮最小值 ' + a[i] + '）');
      }
      markSorted(n - 1, '最后一个元素自然就位');
    } else if (algo === 'insertion') {
      markSorted(0, '第一个元素自己就是有序区间');
      for (var i2 = 1; i2 < n; i2++) {
        var key = a[i2];
        base('key', {
          i: i2, value: key,
          note: '取出 a[' + i2 + ']=' + key + ' 作为 key，准备插入左边的有序区间 [0..' + (i2 - 1) + ']'
        });
        var j2 = i2 - 1;
        while (j2 >= 0) {
          cmp(j2, j2 + 1, '比较 a[' + j2 + ']=' + a[j2] + ' 与 key=' + key + '：' +
            (a[j2] > key ? 'a[' + j2 + '] 更大，要往右挪' : 'key 应该插在 a[' + j2 + '] 后面'));
          if (a[j2] > key) {
            set(j2 + 1, a[j2], 'a[' + j2 + ']=' + a[j2] + ' 右移到下标 ' + (j2 + 1));
            j2--;
          } else {
            break;
          }
        }
        if (j2 + 1 !== i2) set(j2 + 1, key, '把 key=' + key + ' 放进下标 ' + (j2 + 1));
        markSorted(i2, '下标 0..' + i2 + ' 已经有序');
      }
    } else if (algo === 'merge') {
      var mergeSort = function (lo, hi, depth) {
        if (lo >= hi) return;
        var mid = (lo + hi) >> 1;
        base('range', {
          lo: lo, hi: hi,
          note: '分解 [' + lo + '..' + hi + ']（深度 ' + depth + '）：先处理左半 [' + lo + '..' + mid + ']'
        });
        mergeSort(lo, mid, depth + 1);
        base('range', {
          lo: lo, hi: hi,
          note: '分解 [' + lo + '..' + hi + ']（深度 ' + depth + '）：再处理右半 [' + (mid + 1) + '..' + hi + ']'
        });
        mergeSort(mid + 1, hi, depth + 1);
        base('range', {
          lo: lo, hi: hi,
          note: '合并两个有序段 [' + lo + '..' + mid + '] 与 [' + (mid + 1) + '..' + hi + ']'
        });
        var left = a.slice(lo, mid + 1);
        var right = a.slice(mid + 1, hi + 1);
        var p = 0;
        var q = 0;
        var k = lo;
        while (p < left.length && q < right.length) {
          compares++;
          base('compare', {
            idx: [lo + p, mid + 1 + q],
            note: '比较左段 ' + left[p] + ' 与右段 ' + right[q] + '：较小的先写回'
          });
          if (left[p] <= right[q]) {
            set(k, left[p], '左段 ' + left[p] + ' ≤ 右段 ' + right[q] + '，写到下标 ' + k);
            p++;
          } else {
            set(k, right[q], '右段 ' + right[q] + ' < 左段 ' + left[p] + '，写到下标 ' + k);
            q++;
          }
          k++;
        }
        while (p < left.length) {
          set(k, left[p], '左段剩余 ' + left[p] + ' 写到下标 ' + k);
          p++;
          k++;
        }
        while (q < right.length) {
          set(k, right[q], '右段剩余 ' + right[q] + ' 写到下标 ' + k);
          q++;
          k++;
        }
      };
      mergeSort(0, n - 1, 0);
    } else {
      /* quick：Lomuto 分区，取区间最后一个元素作 pivot */
      var quickSort = function (lo, hi) {
        if (lo > hi) return;
        if (lo === hi) {
          markSorted(lo, '区间只剩一个元素 a[' + lo + ']=' + a[lo] + '，已就位');
          return;
        }
        base('range', {
          lo: lo, hi: hi,
          note: '对区间 [' + lo + '..' + hi + '] 分区，pivot = a[' + hi + '] = ' + a[hi]
        });
        base('pivot', { i: hi, note: '选最后一个元素 a[' + hi + ']=' + a[hi] + ' 作为 pivot' });
        var pivot = a[hi];
        var i3 = lo - 1;
        for (var j3 = lo; j3 < hi; j3++) {
          compares++;
          base('compare', {
            idx: [j3, hi],
            note: '比较 a[' + j3 + ']=' + a[j3] + ' 与 pivot=' + pivot + '：' +
              (a[j3] < pivot ? '更小，应归到左区' : '不小于 pivot，留在右侧')
          });
          if (a[j3] < pivot) {
            i3++;
            if (i3 !== j3) swap(i3, j3, 'a[' + j3 + ']=' + a[j3] + ' 更小，换到左区下标 ' + i3);
          }
        }
        if (i3 + 1 !== hi) swap(i3 + 1, hi, '把 pivot=' + pivot + ' 换到分界点 ' + (i3 + 1));
        var pos = i3 + 1;
        markSorted(pos, 'pivot=' + pivot + ' 归位到下标 ' + pos + '：左边都更小，右边都不更小');
        quickSort(lo, pos - 1);
        quickSort(pos + 1, hi);
      };
      quickSort(0, n - 1);
    }

    base('done', {
      note: '排序完成：共 ' + compares + ' 次比较、' + swaps + ' 次交换/写入。' +
        '同样 10 个数，不同算法的代价差别很大——这正是 Big-O 要衡量的东西。'
    });
    return ops;
  }

  /** 把一条事件应用到当前视图状态 */
  function applySortOp(view, op, n) {
    if (!op) return;
    var k;
    if (op.type === 'compare') {
      view.hi = op.idx ? op.idx.slice() : [op.i, op.j];
      view.compares = op.compares;
      view.swaps = op.swaps;
      view.note = op.note;
    } else if (op.type === 'swap') {
      var t = view.values[op.i];
      view.values[op.i] = view.values[op.j];
      view.values[op.j] = t;
      view.hi = [op.i, op.j];
      view.compares = op.compares;
      view.swaps = op.swaps;
      view.note = op.note;
    } else if (op.type === 'set') {
      view.values[op.i] = op.value;
      view.hi = [op.i];
      view.compares = op.compares;
      view.swaps = op.swaps;
      view.note = op.note;
    } else if (op.type === 'range') {
      view.range = [op.lo, op.hi];
      view.hi = [];
      if (op.compares != null) view.compares = op.compares;
      if (op.swaps != null) view.swaps = op.swaps;
      view.note = op.note;
    } else if (op.type === 'sorted') {
      if (view.done.indexOf(op.i) < 0) view.done.push(op.i);
      view.hi = [];
      if (op.compares != null) view.compares = op.compares;
      if (op.swaps != null) view.swaps = op.swaps;
      view.note = op.note;
    } else if (op.type === 'key') {
      view.hi = [op.i];
      view.key = op.value;
      view.note = op.note;
    } else if (op.type === 'pivot') {
      view.pivot = op.i;
      view.note = op.note;
    } else if (op.type === 'done') {
      view.hi = [];
      view.range = null;
      view.pivot = -1;
      view.done = [];
      for (k = 0; k < n; k++) view.done.push(k);
      view.compares = op.compares;
      view.swaps = op.swaps;
      view.note = op.note;
      view.finished = true;
    }
  }

  function initSorting(root, props, ctx, kit) {
    var N = 10;
    var state = {
      algo: 'selection',
      values: makeValues(N),
      ops: [],
      idx: 0,
      view: null,
      speed: 3
    };
    var algoRow = ctl(root);
    var ctrlRow = ctl(root);
    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var noteBox = note(root);
    var statBox = stats(root);
    var hint = hintLine(root, SORT_INFO.selection.en + '：' + SORT_INFO.selection.note);

    var bars = null;
    function getBars() {
      if (!bars) bars = viz().bars(stage, {});
      return bars;
    }

    var player = makePlayer(function () {
      return stepOnce();
    }, function () {
      return 620 - state.speed * 100;
    });
    kit.addPlayer(player);
    player.onIdle = function () { render(); };

    function render() {
      var v = state.view;
      if (!v) return;
      var dim = [];
      var i;
      if (v.range) {
        for (i = 0; i < v.values.length; i++) {
          if (i < v.range[0] || i > v.range[1]) dim.push(i);
        }
      }
      getBars().update({
        values: v.values,
        highlight: v.hi,
        done: v.done,
        dim: dim,
        range: v.range
      });
      noteBox.set(v.note || '准备就绪…', state.idx + ' / ' + state.ops.length + ' 步');
      statBox.set([
        { label: '比较', value: v.compares },
        { label: '交换/写入', value: v.swaps },
        { label: '已就位', value: v.done.length + '/' + v.values.length },
        { label: '算法', value: SORT_INFO[state.algo].en, hot: true }
      ]);
      setBtnLabel(playBtn, player.playing ? '暂停' : '播放');
    }

    function reset() {
      player.pause();
      state.ops = buildSortOps(state.algo, state.values);
      state.idx = 0;
      state.view = {
        values: state.values.slice(),
        hi: [],
        done: [],
        pivot: -1,
        range: null,
        compares: 0,
        swaps: 0,
        note: '准备就绪。点「播放」看动画，或「下一步」一条指令一条指令地走。'
      };
      hint.textContent = SORT_INFO[state.algo].en + '：' + SORT_INFO[state.algo].note;
      render();
    }

    function stepOnce() {
      if (state.idx >= state.ops.length) return false;
      applySortOp(state.view, state.ops[state.idx], state.values.length);
      state.idx++;
      render();
      return state.idx < state.ops.length;
    }

    var algoBtns = {};
    Object.keys(SORT_INFO).forEach(function (key) {
      var b = button(algoRow, SORT_INFO[key].label, function () { switchAlgo(key); }, { icon: SORT_INFO[key].icon });
      algoBtns[key] = b;
    });

    var playBtn = button(ctrlRow, '播放', function () {
      if (state.idx >= state.ops.length) reset();
      if (player.playing) {
        player.pause();
        render();
        return;
      }
      player.play();
      render();
    }, { icon: 'play' });
    button(ctrlRow, '下一步', function () {
      player.pause();
      if (state.idx >= state.ops.length) {
        noteBox.set('已经排完啦。点「重置」重看一遍，或换个算法对比步骤数。', state.ops.length + ' / ' + state.ops.length + ' 步');
        return;
      }
      stepOnce();
    }, { icon: 'step' });
    button(ctrlRow, '重置', reset, { icon: 'reset' });
    button(ctrlRow, '新数据', function () {
      state.values = makeValues(N);
      reset();
    }, { icon: 'reset' });
    slider(ctrlRow, {
      label: '速度', min: 1, max: 5, value: state.speed,
      onInput: function (v) { state.speed = v; }
    });

    function switchAlgo(key) {
      state.algo = key;
      Object.keys(algoBtns).forEach(function (k) {
        algoBtns[k].classList.toggle('on', k === key);
      });
      reset();
    }

    switchAlgo('selection');
  }

  LABS.sorting = {
    title: '排序算法可视化',
    desc: '四种排序在同一套「事件流」上播放：比较、交换、区间、已就位一眼看清',
    tags: ['ch11'],
    icon: 'sort',
    order: 1,
    init: lab(initSorting)
  };

  /* =====================================================================
   * 2. search —— 线性 vs 二分查找
   * ===================================================================== */
  var SEARCH_SORTED = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47];
  var SEARCH_SHUFFLED = [27, 3, 47, 11, 39, 7, 31, 15, 43, 19, 35, 23];

  /**
   * 查找过程编译成帧序列：每帧 = {pointers, changed, note, detail, compares, found, done}
   * 播放与单步都只是在帧序列上移动指针，因此两种模式行为完全一致。
   */
  function buildSearchFrames(algo, arr, target) {
    var frames = [];
    var compares = 0;
    var found = -1;
    var i;

    if (algo !== 'binary') {
      frames.push({
        pointers: {}, changed: [], compares: 0,
        note: '线性查找：从下标 0 开始，逐个和目标 ' + target + ' 比较。',
        detail: '不需要有序，代价是最坏 O(n)。'
      });
      for (i = 0; i < arr.length; i++) {
        compares++;
        var hit = arr[i] === target;
        frames.push({
          pointers: { cur: i }, changed: [i], compares: compares,
          found: hit ? i : -1,
          note: '比较 a[' + i + '] = ' + arr[i] + ' 与目标 ' + target + '：' + (hit ? '<b>相等，找到！</b>' : '不相等，继续下一个'),
          detail: hit ? '' : '已经排除了 ' + (i + 1) + ' 个元素，还剩 ' + (arr.length - i - 1) + ' 个'
        });
        if (hit) { found = i; break; }
      }
      if (found < 0) {
        frames.push({
          pointers: {}, changed: [], compares: compares, done: true, found: -1,
          note: '看完最后一个元素仍不相等：目标 ' + target + ' 不在数组里。',
          detail: '最坏情况比较 ' + arr.length + ' 次 —— 这就是 O(n)。'
        });
      } else {
        frames.push({
          pointers: { cur: found }, changed: [found], compares: compares, done: true, found: found,
          note: '查找结束：目标在下标 ' + found + '。',
          detail: '每次比较只能排除一个元素。'
        });
      }
      return frames;
    }

    /* 二分查找 */
    var lo = 0;
    var hi = arr.length - 1;
    frames.push({
      pointers: { lo: lo, hi: hi }, changed: [], compares: 0,
      note: '二分查找：初始区间 [0..' + hi + ']，每次比较中点，排除一半。',
      detail: '前提：数组必须<b>有序</b>。'
    });
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      compares++;
      frames.push({
        pointers: { lo: lo, hi: hi, mid: mid }, changed: [mid], compares: compares,
        note: 'mid = (' + lo + ' + ' + hi + ') / 2 = ' + mid + '，比较 a[' + mid + '] = ' + arr[mid] + ' 与目标 ' + target,
        detail: '候选区间长度 ' + (hi - lo + 1)
      });
      if (arr[mid] === target) { found = mid; break; }
      if (arr[mid] < target) {
        lo = mid + 1;
        frames.push({
          pointers: { lo: lo, hi: hi }, changed: [], compares: compares,
          note: 'a[' + mid + '] = ' + arr[mid] + ' &lt; ' + target + ' → 目标只可能在右半段，lo = mid + 1 = ' + lo,
          detail: lo <= hi ? '新候选区间 [' + lo + '..' + hi + ']' : '区间变空：lo &gt; hi，循环结束'
        });
      } else {
        hi = mid - 1;
        frames.push({
          pointers: { lo: lo, hi: hi }, changed: [], compares: compares,
          note: 'a[' + mid + '] = ' + arr[mid] + ' &gt; ' + target + ' → 目标只可能在左半段，hi = mid - 1 = ' + hi,
          detail: lo <= hi ? '新候选区间 [' + lo + '..' + hi + ']' : '区间变空：lo &gt; hi，循环结束'
        });
      }
    }
    if (found < 0) {
      var existsAt = arr.indexOf(target);
      var noteTxt = '区间变空，二分判定：目标 ' + target + ' 不存在。';
      var detailTxt = '二分只用了 ' + compares + ' 次比较，线性查找最坏要 ' + arr.length + ' 次。';
      if (existsAt >= 0) {
        noteTxt += ' 但它其实在下标 ' + existsAt + ' —— 因为数组<b>没排序</b>，二分的前提被破坏了！';
        detailTxt = '二分只适用于有序数组：一旦无序，它“排除一半”的推理就是错的。';
      }
      frames.push({
        pointers: {}, changed: [], compares: compares, done: true, found: -1, broken: existsAt >= 0,
        note: noteTxt, detail: detailTxt
      });
    } else {
      frames.push({
        pointers: { lo: lo, hi: hi, mid: found }, changed: [found], compares: compares, done: true, found: found,
        note: '查找结束：目标在下标 ' + found + '，只比较了 ' + compares + ' 次。',
        detail: '对数级：n 变成 2 倍，比较次数只多 1 次左右。'
      });
    }
    return frames;
  }

  function initSearch(root, props, ctx, kit) {
    var state = {
      algo: 'binary',
      arrMode: 'sorted',
      arr: SEARCH_SORTED.slice(),
      target: 27,
      frames: [],
      idx: 0,
      frame: null
    };

    var algoRow = ctl(root);
    var ctrlRow = ctl(root);
    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var noteBox = note(root);
    var statBox = stats(root);
    var hint = hintLine(root, '点数组里的任意格子 = 把该格的值设为查找目标。');

    var boxes = null;
    function getBoxes() {
      if (!boxes) {
        boxes = viz().arrayBoxes(stage, {
          onCell: function (i) {
            state.target = state.arr[i];
            targetInput.value = String(state.target);
            reset();
          }
        });
      }
      return boxes;
    }

    var targetInput = numberInput(ctrlRow, {
      min: 0, max: 99, value: state.target,
      onInput: function (v) { state.target = v; reset(); }
    });
    targetInput.setAttribute('aria-label', '查找目标');

    var player = makePlayer(function () { return stepOnce(); }, function () { return 560; });
    kit.addPlayer(player);
    player.onIdle = function () { render(); };

    function render() {
      var f = state.frame;
      if (!f) return;
      getBoxes().update({
        values: state.arr,
        pointers: f.pointers || {},
        changed: f.changed || [],
        selected: f.found != null && f.found >= 0 ? f.found : null
      });
      noteBox.set(
        f.note + (f.detail ? ' <span class="dim">' + f.detail + '</span>' : ''),
        (state.idx + 1) + ' / ' + state.frames.length + ' 步'
      );
      var result = '查找中';
      if (f.found != null && f.found >= 0) result = '找到 @' + f.found;
      else if (f.done) result = '未找到';
      statBox.set([
        { label: '比较次数', value: f.compares, hot: true },
        { label: '数组', value: state.arrMode === 'sorted' ? '有序' : '无序' },
        { label: '结果', value: result }
      ]);
      setBtnLabel(playBtn, player.playing ? '暂停' : '播放');
    }

    function reset() {
      player.pause();
      state.frames = buildSearchFrames(state.algo, state.arr, state.target);
      state.idx = 0;
      state.frame = state.frames[0];
      render();
    }

    function stepOnce() {
      if (state.idx >= state.frames.length - 1) return false;
      state.idx++;
      state.frame = state.frames[state.idx];
      render();
      return state.idx < state.frames.length - 1;
    }

    var algoBtns = {};
    var ALGOS = [
      { key: 'linear', label: '线性查找' },
      { key: 'binary', label: '二分查找' }
    ];
    ALGOS.forEach(function (a) {
      algoBtns[a.key] = button(algoRow, a.label, function () {
        state.algo = a.key;
        Object.keys(algoBtns).forEach(function (k) { algoBtns[k].classList.toggle('on', k === a.key); });
        reset();
      });
    });

    var modeBtns = {};
    var MODES = [
      { key: 'sorted', label: '有序数组' },
      { key: 'shuffled', label: '无序数组' }
    ];
    MODES.forEach(function (m) {
      modeBtns[m.key] = button(ctrlRow, m.label, function () {
        state.arrMode = m.key;
        state.arr = (m.key === 'sorted' ? SEARCH_SORTED : SEARCH_SHUFFLED).slice();
        if (state.arr.indexOf(state.target) < 0) {
          state.target = state.arr[(m.key === 'sorted' ? 5 : 0)];
          targetInput.value = String(state.target);
        }
        Object.keys(modeBtns).forEach(function (k) { modeBtns[k].classList.toggle('on', k === m.key); });
        reset();
      });
    });

    var playBtn = button(ctrlRow, '播放', function () {
      if (state.idx >= state.frames.length - 1) reset();
      if (player.playing) {
        player.pause();
        render();
        return;
      }
      player.play();
      render();
    }, { icon: 'play' });
    button(ctrlRow, '下一步', function () {
      player.pause();
      if (state.idx >= state.frames.length - 1) {
        noteBox.set('已经走到最后一帧了。点「重置」重看，或换一种算法/数组对比。', state.frames.length + ' / ' + state.frames.length + ' 步');
        return;
      }
      stepOnce();
    }, { icon: 'step' });
    button(ctrlRow, '重置', reset, { icon: 'reset' });
    button(ctrlRow, '随机目标', function () {
      var cand = state.arr[Math.floor(Math.random() * state.arr.length)];
      state.target = cand;
      targetInput.value = String(cand);
      reset();
    });

    /* 让“目标”输入框前有个文字标签 */
    var targetLbl = E('span', { class: 'dim', text: '目标' });
    targetInput.parentNode.insertBefore(targetLbl, targetInput);

    algoBtns.binary.classList.add('on');
    modeBtns.sorted.classList.add('on');
    reset();
  }

  LABS.search = {
    title: '线性查找 vs 二分查找',
    desc: 'lo / hi / mid 指针怎么移动，比较次数差在哪里，以及无序数组上二分为什么会失败',
    tags: ['ch11'],
    icon: 'search',
    order: 2,
    init: lab(initSearch)
  };

  /* =====================================================================
   * 3. trace —— 逐语句追踪（预设模拟器 + 可选真实解释器）
   * ===================================================================== */
  function fmtArr(arr) {
    return '{ ' + arr.join(', ') + ' }';
  }

  function tracePush(list, line, vars, note, out, stack) {
    list.push({
      line: line,
      vars: vars || {},
      note: note || '',
      out: out == null ? '' : String(out),
      stack: stack || ['main']
    });
  }

  var TRACE_PROGRAMS = {
    sumLoop: {
      label: 'for 循环累加 1..n',
      hasN: true, nMin: 1, nMax: 8,
      lines: function (n) {
        return [
          'public class Demo {',
          '    public static void main(String[] args) {',
          '        int n = ' + n + ';',
          '        int sum = 0;',
          '        for (int i = 1; i <= n; i++) {',
          '            sum += i;',
          '        }',
          '        System.out.println(sum);',
          '    }',
          '}'
        ];
      },
      build: function (n) {
        var steps = [];
        var sum = 0;
        var i;
        tracePush(steps, 3, { n: n }, '执行第 3 行：局部变量 n 初始化为 ' + n);
        tracePush(steps, 4, { n: n, sum: 0 }, '执行第 4 行：sum = 0，累加器就位');
        for (i = 1; i <= n; i++) {
          tracePush(steps, 5, { n: n, sum: sum, i: i },
            '第 5 行：检查 i &lt;= n，即 ' + i + ' &lt;= ' + n + ' → <b>true</b>，进入循环体');
          sum += i;
          tracePush(steps, 6, { n: n, sum: sum, i: i },
            '第 6 行：sum += i，sum 从 ' + (sum - i) + ' 变成 <b>' + sum + '</b>');
          if (i < n) {
            tracePush(steps, 5, { n: n, sum: sum, i: i + 1 },
              '第 5 行：i++ 后 i = ' + (i + 1) + '，再次检查条件');
          }
        }
        tracePush(steps, 5, { n: n, sum: sum, i: n + 1 },
          '第 5 行：i = ' + (n + 1) + ' &gt; ' + n + ' → <b>false</b>，循环结束');
        tracePush(steps, 8, { n: n, sum: sum },
          '第 8 行：System.out.println(sum)', '输出 → ' + sum);
        return steps;
      }
    },

    arrayMax: {
      label: '数组里找最大值',
      hasN: false,
      lines: function () {
        return [
          'public class Demo {',
          '    public static void main(String[] args) {',
          '        int[] a = { 17, 4, 29, 8, 23 };',
          '        int max = a[0];',
          '        for (int i = 1; i < a.length; i++) {',
          '            if (a[i] > max) {',
          '                max = a[i];',
          '            }',
          '        }',
          '        System.out.println(max);',
          '    }',
          '}'
        ];
      },
      build: function () {
        var steps = [];
        var arr = [17, 4, 29, 8, 23];
        var max = arr[0];
        var i;
        tracePush(steps, 3, { a: fmtArr(arr) }, '第 3 行：创建数组 a，length = 5，下标 0..4');
        tracePush(steps, 4, { a: fmtArr(arr), max: max }, '第 4 行：先假定 max = a[0] = 17');
        for (i = 1; i < arr.length; i++) {
          tracePush(steps, 5, { a: fmtArr(arr), max: max, i: i },
            '第 5 行：i = ' + i + ' &lt; a.length(5) → true，看 a[' + i + ']');
          tracePush(steps, 6, { a: fmtArr(arr), max: max, i: i },
            '第 6 行：a[' + i + '] = ' + arr[i] + ' &gt; max = ' + max + ' → <b>' +
            (arr[i] > max ? 'true' : 'false') + '</b>' + (arr[i] > max ? '，更新 max' : '，不动'));
          if (arr[i] > max) {
            max = arr[i];
            tracePush(steps, 7, { a: fmtArr(arr), max: max, i: i },
              '第 7 行：max 更新为 <b>' + max + '</b>');
          }
        }
        tracePush(steps, 5, { a: fmtArr(arr), max: max, i: arr.length },
          '第 5 行：i = 5，不满足 i &lt; 5 → 循环结束');
        tracePush(steps, 10, { a: fmtArr(arr), max: max },
          '第 10 行：System.out.println(max)', '输出 → ' + max);
        return steps;
      }
    },

    factorial: {
      label: 'while 循环算阶乘',
      hasN: true, nMin: 1, nMax: 7,
      lines: function (n) {
        return [
          'public class Demo {',
          '    public static void main(String[] args) {',
          '        int n = ' + n + ';',
          '        int result = 1;',
          '        while (n > 1) {',
          '            result *= n;',
          '            n--;',
          '        }',
          '        System.out.println(result);',
          '    }',
          '}'
        ];
      },
      build: function (n) {
        var steps = [];
        var k = n;
        var result = 1;
        tracePush(steps, 3, { n: k }, '第 3 行：n = ' + k);
        tracePush(steps, 4, { n: k, result: 1 }, '第 4 行：result = 1（乘法单位元）');
        while (k > 1) {
          tracePush(steps, 5, { n: k, result: result },
            '第 5 行：检查 n &gt; 1，即 ' + k + ' &gt; 1 → <b>true</b>');
          var before = result;
          result *= k;
          tracePush(steps, 6, { n: k, result: result },
            '第 6 行：result *= n，result 从 ' + before + ' 变成 <b>' + result + '</b>');
          k--;
          tracePush(steps, 7, { n: k, result: result },
            '第 7 行：n--，n 变成 ' + k);
        }
        tracePush(steps, 5, { n: k, result: result },
          '第 5 行：' + k + ' &gt; 1 → <b>false</b>，退出 while');
        tracePush(steps, 9, { n: k, result: result },
          '第 9 行：System.out.println(result)', '输出 → ' + result);
        return steps;
      }
    },

    swapCall: {
      label: '方法调用与栈帧（swap）',
      hasN: false,
      lines: function () {
        return [
          'public class Demo {',
          '    static void swap(int[] a, int i, int j) {',
          '        int t = a[i];',
          '        a[i] = a[j];',
          '        a[j] = t;',
          '    }',
          '    public static void main(String[] args) {',
          '        int[] a = { 5, 9 };',
          '        swap(a, 0, 1);',
          '        System.out.println(a[0] + " " + a[1]);',
          '    }',
          '}'
        ];
      },
      build: function () {
        var steps = [];
        tracePush(steps, 8, { a: '{ 5, 9 }' }, '第 8 行：main 里创建数组 a = { 5, 9 }', '', ['main']);
        tracePush(steps, 9, { a: '{ 5, 9 }' },
          '第 9 行：调用 swap(a, 0, 1) —— 准备压入新的栈帧', '', ['main']);
        tracePush(steps, 2, { a: '{ 5, 9 }', i: 0, j: 1 },
          'swap 帧：参数 i = 0，j = 1。数组 a 是<b>引用</b>，两个帧指向同一个堆数组', '', ['main', 'swap']);
        tracePush(steps, 3, { a: '{ 5, 9 }', i: 0, j: 1, t: 5 },
          '第 3 行：t = a[i] = a[0] = 5', '', ['main', 'swap']);
        tracePush(steps, 4, { a: '{ 9, 9 }', i: 0, j: 1, t: 5 },
          '第 4 行：a[0] = a[1] → 堆里的数组变成 { 9, 9 }', '', ['main', 'swap']);
        tracePush(steps, 5, { a: '{ 9, 5 }', i: 0, j: 1, t: 5 },
          '第 5 行：a[1] = t = 5 → 数组变成 { 9, 5 }', '', ['main', 'swap']);
        tracePush(steps, 9, { a: '{ 9, 5 }' },
          'swap 返回：弹出栈帧。main 的 a 看到的正是被改过的 { 9, 5 }', '', ['main']);
        tracePush(steps, 10, { a: '{ 9, 5 }' },
          '第 10 行：System.out.println(a[0] + " " + a[1])', '输出 → 9 5', ['main']);
        return steps;
      }
    }
  };

  function initTrace(root, props, ctx, kit) {
    var state = {
      progId: 'sumLoop',
      prog: TRACE_PROGRAMS.sumLoop,
      n: 5,
      frames: [],
      idx: 0,
      frame: null,
      source: 'preset',
      useEngine: false
    };

    var progRow = ctl(root);
    var ctrlRow = ctl(root);
    var grid = E('div', { class: 'gridBlock c2' });
    var leftCell = E('div');
    var rightCell = E('div');
    grid.appendChild(leftCell);
    grid.appendChild(rightCell);
    root.appendChild(grid);
    var statBox = stats(root);
    var noteBox = note(root);
    var engineRow = ctl(root);

    var codeHost = E('div');
    leftCell.appendChild(codeHost);
    var codeView = null;

    var varHost = E('div');
    rightCell.appendChild(varHost);
    var outBox = E('div', { class: 'labNote' });
    rightCell.appendChild(outBox);
    var stackHost = E('div');
    rightCell.appendChild(stackHost);

    var stackView = null;
    function getStack() {
      if (!stackView) stackView = viz().callStack(stackHost, {});
      return stackView;
    }

    var progOptions = Object.keys(TRACE_PROGRAMS).map(function (k) {
      return { value: k, label: TRACE_PROGRAMS[k].label };
    });
    selectBox(progRow, progOptions, state.progId, function (v) {
      state.progId = v;
      state.prog = TRACE_PROGRAMS[v];
      state.useEngine = false;
      onProgChange();
    });

    var nSlider = slider(progRow, {
      label: 'n', min: 1, max: 8, value: state.n,
      onInput: function (v) { state.n = v; onNChange(); }
    });

    var player = makePlayer(function () { return stepOnce(); }, function () { return 520; });
    kit.addPlayer(player);
    player.onIdle = function () { render(); };

    var playBtn = button(ctrlRow, '播放', function () {
      if (state.idx >= state.frames.length - 1) applyMode();
      if (player.playing) {
        player.pause();
        render();
        return;
      }
      player.play();
      render();
    }, { icon: 'play' });
    button(ctrlRow, '下一步', function () {
      player.pause();
      if (state.idx >= state.frames.length - 1) {
        noteBox.set('已经到最后一步。点「重置」从第一行重新开始。', state.frames.length + ' / ' + state.frames.length + ' 步');
        return;
      }
      stepOnce();
    }, { icon: 'step' });
    button(ctrlRow, '重置', function () { applyMode(); }, { icon: 'reset' });

    var engineBtn = button(ctrlRow, '用真实引擎执行', function () { toggleEngine(); }, { icon: 'cpu' });

    var engPill = engineStatus(engineRow, function () {
      refreshEngineBtn();
      if (state.useEngine) applyMode();
    });
    kit.onDestroy(engPill.destroy);
    var engineHint = hintLine(engineRow, '预设模式不依赖解释器，随时可用；解释器就绪后可切换成真实执行，看到同一段代码的真实快照。');

    function refreshEngineBtn() {
      var ready = !!CSC.java;
      engineBtn.disabled = !ready;
      setBtnLabel(engineBtn, !ready
        ? '真实引擎执行（加载中）'
        : (state.useEngine ? '切回预设演示' : '用真实引擎执行'));
      engineBtn.classList.toggle('on', state.useEngine);
      if (engineHint) {
        engineHint.textContent = state.useEngine
          ? '当前：真实解释器逐步执行（CSC.java.session）。若代码超出支持范围会自动回退预设模式。'
          : '当前：预设追踪数据。预设数据能保证每一行都有中文说明，适合先建立直觉。';
      }
    }

    function renderVars(vars) {
      varHost.innerHTML = '';
      var wrap = E('div', { class: 'tableWrap' });
      var table = E('table');
      var thead = E('thead');
      var htr = E('tr');
      htr.appendChild(E('th', { text: '变量' }));
      htr.appendChild(E('th', { text: '当前值' }));
      thead.appendChild(htr);
      var tbody = E('tbody');
      var keys = Object.keys(vars || {});
      if (!keys.length) {
        var tr0 = E('tr');
        var td0 = E('td', { colspan: '2' });
        td0.appendChild(E('span', { class: 'varEmpty', text: '这一行还没有局部变量。' }));
        tr0.appendChild(td0);
        tbody.appendChild(tr0);
      }
      keys.forEach(function (k) {
        var tr = E('tr');
        var td1 = E('td');
        td1.appendChild(E('code', { text: k }));
        tr.appendChild(td1);
        tr.appendChild(E('td', { class: 'mono', text: String(vars[k]) }));
        tbody.appendChild(tr);
      });
      table.appendChild(thead);
      table.appendChild(tbody);
      wrap.appendChild(table);
      varHost.appendChild(wrap);
    }

    function renderCode() {
      codeHost.innerHTML = '';
      codeView = codeBlock(codeHost, state.prog.lines(state.n));
      if (state.frame) codeView.mark(state.frame.line || 0);
    }

    function render() {
      var f = state.frame;
      if (!f) return;
      if (codeView) codeView.mark(f.line || 0);
      renderVars(f.vars);
      outBox.innerHTML = '<b>输出</b> ' + (f.out ? esc(f.out) : '<span class="dim">（还没有输出）</span>');
      var names = f.stack && f.stack.length ? f.stack : ['main'];
      getStack().update({
        frames: names.map(function (nm) { return { name: nm, args: '' }; }),
        topIndex: names.length - 1
      });
      statBox.set([
        { label: '步数', value: (state.idx + 1) + ' / ' + state.frames.length },
        { label: '当前行', value: f.line ? '第 ' + f.line + ' 行' : '—' },
        { label: '模式', value: state.source === 'engine' ? '真实解释器' : '预设演示', hot: state.source === 'engine' },
        { label: '调用栈深度', value: names.length }
      ]);
      noteBox.set(f.note, (state.idx + 1) + ' / ' + state.frames.length + ' 步');
      setBtnLabel(playBtn, player.playing ? '暂停' : '播放');
    }

    function stepOnce() {
      if (state.idx >= state.frames.length - 1) return false;
      state.idx++;
      state.frame = state.frames[state.idx];
      render();
      return state.idx < state.frames.length - 1;
    }

    function buildEngineSteps() {
      if (!CSC.java) return { error: '解释器未就绪' };
      var code = state.prog.lines(state.n).join('\n');
      var frames = [];
      try {
        var session = CSC.java.session(code, { maxSteps: 4000, timeoutMs: 2000 });
        var guard = 0;
        while (guard++ < 4000) {
          var r = session.step();
          if (!r) break;
          if (r.done) {
            frames.push({
              line: 0, vars: {}, stack: [],
              note: '执行结束。' + (r.result && r.result.error ? ('错误：' + r.result.error.message) : '没有更多语句。'),
              out: (r.result && r.result.output) ? r.result.output : (frames.length ? frames[frames.length - 1].out : '')
            });
            break;
          }
          var snap = r.snapshot || {};
          var fl = snap.frames || [];
          var cur = fl.length ? fl[fl.length - 1] : null;
          var vars = {};
          if (cur && cur.locals) {
            Object.keys(cur.locals).forEach(function (k) {
              if (k === 'args') return; /* main 的 String[] args 对教学没有信息量，跳过 */
              var val = cur.locals[k];
              if (val == null) { vars[k] = 'null'; return; }
              if (val.display != null) { vars[k] = val.display; return; }
              if (val.value != null) { vars[k] = val.value; return; }
              vars[k] = String(val);
            });
          }
          frames.push({
            line: snap.line || 0,
            vars: vars,
            stack: fl.map(function (fr) { return fr.name || fr.cls || '?'; }),
            note: '由 CSC.java 执行到第 ' + (snap.line || '?') + ' 行' +
              (fl.length > 1 ? '（当前栈帧：' + (cur && cur.name ? cur.name : '?') + '）' : ''),
            out: snap.output || ''
          });
        }
      } catch (e) {
        return { error: e && e.message ? e.message : String(e) };
      }
      if (!frames.length) return { error: '解释器没有返回任何快照' };
      return { frames: frames };
    }

    function applyMode() {
      player.pause();
      if (state.useEngine) {
        var res = buildEngineSteps();
        if (!res || res.error) {
          state.useEngine = false;
          state.source = 'preset';
          state.frames = state.prog.build(state.n);
          noteBox.set('真实引擎执行失败（' + esc(res && res.error ? res.error : '未知原因') +
            '），已回退到预设追踪。', '');
          refreshEngineBtn();
        } else {
          state.frames = res.frames;
          state.source = 'engine';
        }
      } else {
        state.frames = state.prog.build(state.n);
        state.source = 'preset';
      }
      state.idx = 0;
      state.frame = state.frames[0];
      render();
    }

    function toggleEngine() {
      if (!CSC.java) {
        noteBox.set('解释器还在加载中，先用预设模式：两者的变量变化顺序是一致的。', '');
        refreshEngineBtn();
        return;
      }
      state.useEngine = !state.useEngine;
      if (state.useEngine && state.progId === 'swapCall') {
        noteBox.set('真实引擎会把 swap 的栈帧也画出来，注意左侧代码高亮跟着走。', '');
      }
      applyMode();
      refreshEngineBtn();
    }

    function onProgChange() {
      var p = state.prog;
      nSlider.input.min = String(p.nMin || 1);
      nSlider.input.max = String(p.nMax || 8);
      if (state.n < (p.nMin || 1)) state.n = p.nMin || 1;
      if (state.n > (p.nMax || 8)) state.n = p.nMax || 8;
      nSlider.set(state.n);
      if (p.hasN) {
        if (!nSlider.el.parentNode) progRow.appendChild(nSlider.el);
      } else if (nSlider.el.parentNode) {
        nSlider.el.parentNode.removeChild(nSlider.el);
      }
      renderCode();
      refreshEngineBtn();
      applyMode();
    }

    function onNChange() {
      if (state.useEngine) {
        applyMode();
      } else {
        state.frames = state.prog.build(state.n);
        state.idx = 0;
        state.frame = state.frames[0];
        renderCode();
        render();
      }
      noteBox.set('已把 n 改为 ' + state.n + '，追踪重新开始。', '');
    }

    state.prog = TRACE_PROGRAMS[state.progId];
    refreshEngineBtn();
    onProgChange();
  }

  LABS.trace = {
    title: '逐语句追踪：变量怎么变',
    desc: '左代码右变量，一步步看清每一行执行后 n、sum、i 的变化；解释器就绪后还能切换成真实执行',
    tags: ['ch03'],
    icon: 'step',
    order: 3,
    init: lab(initTrace)
  };

  /* =====================================================================
   * 4. array —— 数组操作沙盒（一维 / 二维 / 越界）
   * ===================================================================== */
  function initArray(root, props, ctx, kit) {
    var state = {
      view: '1d',
      mode: 'read',
      values: [12, 7, 19, 3, 15, 8],
      selected: null,
      errAt: null,
      grid2d: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      selected2: null,
      demoIdx: 0
    };

    var modeRow = ctl(root);
    var opRow = ctl(root);
    var stage1 = E('div', { class: 'labStage' });
    var stage2 = E('div', { class: 'labStage' });
    var noteBox = note(root);
    var statBox = stats(root);
    var hint = hintLine(root, '点格子 = 读取或赋值；点「访问 a[length]」看经典的数组越界异常。');

    var boxes1 = viz().arrayBoxes(stage1, { onCell: onCell1 });
    var grid2 = viz().grid(stage2, { onCell: onCell2 });
    var boxesReady = false;
    var gridReady = false;

    function ensureBoxes() {
      if (boxesReady) return;
      boxesReady = true;
      boxes1.update({ values: state.values, onCell: onCell1 });
    }
    function ensureGrid() {
      if (gridReady) return;
      gridReady = true;
      grid2.update({ rows: 3, cols: 3, cells: state.grid2d, onCell: onCell2, rowLabels: true, colLabels: true });
    }

    function onCell1(i) {
      state.errAt = null;
      state.selected = i;
      if (state.mode === 'read') {
        noteBox.set('读取 <b>a[' + i + ']</b> → <b>' + state.values[i] +
          '</b>。下标从 0 开始，最后一个合法下标是 ' + (state.values.length - 1) + '。', '读取');
      } else {
        var old = state.values[i];
        var v = Number(assignInput.value);
        if (isNaN(v)) v = 0;
        state.values[i] = v;
        noteBox.set('赋值 <b>a[' + i + '] = ' + v + '</b>：原来的 ' + old +
          ' 被覆盖，length 不变（仍然是 ' + state.values.length + '）。', '赋值');
      }
      render();
    }

    function onCell2(r, c) {
      state.selected2 = [r, c];
      noteBox.set('读取 <b>a[' + r + '][' + c + ']</b> → <b>' + state.grid2d[r][c] +
        '</b>。二维数组要<strong>先取行、再取列</strong>：a[r][c] 不是 a[r, c]。', '二维');
      render();
    }

    var assignInput = numberInput(opRow, {
      min: 0, max: 99, value: 42,
      onInput: function () {}
    });
    var assignLbl = E('span', { class: 'dim', text: '赋值' });
    assignInput.parentNode.insertBefore(assignLbl, assignInput);

    var modeBtns = {};
    function setMode(m) {
      state.mode = m;
      Object.keys(modeBtns).forEach(function (k) { modeBtns[k].classList.toggle('on', k === m); });
      hint.textContent = m === 'read'
        ? '读取模式：点格子看 a[i] 的值。'
        : '赋值模式：改左边的数字，再点格子把值写进去（原值会被覆盖，length 不变）。';
    }
    modeBtns.read = button(modeRow, '读取模式', function () { setMode('read'); });
    modeBtns.write = button(modeRow, '赋值模式', function () { setMode('write'); });

    function setView(v) {
      state.view = v;
      if (v === '1d') {
        if (stage2.parentNode) stage2.parentNode.removeChild(stage2);
        if (!stage1.parentNode) root.insertBefore(stage1, noteBox.el);
        ensureBoxes();
      } else {
        if (stage1.parentNode) stage1.parentNode.removeChild(stage1);
        if (!stage2.parentNode) root.insertBefore(stage2, noteBox.el);
        ensureGrid();
      }
      viewBtns['1d'].classList.toggle('on', v === '1d');
      viewBtns['2d'].classList.toggle('on', v === '2d');
      render();
    }

    var viewBtns = {};
    viewBtns['1d'] = button(opRow, '一维数组 int[]', function () { setView('1d'); });
    viewBtns['2d'] = button(opRow, '二维数组 int[][]', function () { setView('2d'); });

    button(opRow, '访问 a[length]', function () {
      if (state.view !== '1d') setView('1d');
      var n = state.values.length;
      state.errAt = n;
      state.selected = null;
      noteBox.set('运行到这里会抛异常：<b>Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index ' +
        n + ' out of bounds for length ' + n + '</b>　合法下标只有 0 到 ' + (n - 1) + '。', '越界演示');
      render();
    });
    button(opRow, '访问 a[3][0]', function () {
      if (state.view !== '2d') setView('2d');
      state.selected2 = null;
      noteBox.set('二维数组行下标也是从 0 开始：3 行的合法行下标是 0/1/2，<b>a[3][0]</b> 会抛 ' +
        '<b>ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3</b>。', '越界演示');
      render();
    });
    button(opRow, '新数组', function () {
      state.values = [randInt(2, 20), randInt(2, 20), randInt(2, 20), randInt(2, 20), randInt(2, 20), randInt(2, 20)];
      state.selected = null;
      state.errAt = null;
      render();
    });
    button(opRow, '重置', function () {
      state.values = [12, 7, 19, 3, 15, 8];
      state.selected = null;
      state.errAt = null;
      state.selected2 = null;
      state.demoIdx = 0;
      noteBox.set('已重置：6 个元素的数组，下标 0 ~ 5。', '');
      render();
    }, { icon: 'reset' });

    /* 单步演示：读取 → 赋值 → 越界，四步循环 */
    var DEMO_STEPS = [
      { action: 'init', note: '演示 1/4：数组已创建，length = 6，合法下标 0..5。' },
      { action: 'read', i: 2, note: '演示 2/4：读取 <b>a[2]</b> → <b>19</b>。下标就是「起始地址 + 偏移」。' },
      { action: 'write', i: 2, v: 99, note: '演示 3/4：赋值 <b>a[2] = 99</b>，原来的 19 被覆盖，length 仍然是 6。' },
      { action: 'oob', note: '演示 4/4：访问 <b>a[6]</b> → 越界，抛 <b>ArrayIndexOutOfBoundsException</b>。' }
    ];
    button(opRow, '下一步', function () {
      if (state.view !== '1d') setView('1d');
      var st = DEMO_STEPS[state.demoIdx % DEMO_STEPS.length];
      state.demoIdx++;
      if (st.action === 'init') {
        state.values = [12, 7, 19, 3, 15, 8];
        state.selected = null;
        state.errAt = null;
      } else if (st.action === 'read') {
        state.selected = st.i;
        state.errAt = null;
      } else if (st.action === 'write') {
        state.values[st.i] = st.v;
        state.selected = st.i;
        state.errAt = null;
      } else {
        state.errAt = state.values.length;
        state.selected = null;
      }
      render();
      noteBox.set(st.note, ((state.demoIdx - 1) % DEMO_STEPS.length + 1) + ' / ' + DEMO_STEPS.length + ' 步');
    }, { icon: 'step' });

    function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    function render() {
      if (state.view === '1d') {
        boxes1.update({
          values: state.values,
          selected: state.selected,
          errAt: state.errAt,
          changed: state.selected == null ? [] : [state.selected]
        });
        statBox.set([
          { label: 'length', value: state.values.length, hot: true },
          { label: '合法下标', value: '0 ~ ' + (state.values.length - 1) },
          { label: '选中', value: state.selected == null ? '—' : ('a[' + state.selected + ']') },
          { label: '值', value: state.selected == null ? '—' : state.values[state.selected] }
        ]);
      } else {
        grid2.update({ rows: 3, cols: 3, cells: state.grid2d, selected: state.selected2, onCell: onCell2, rowLabels: true, colLabels: true });
        statBox.set([
          { label: '行 × 列', value: '3 × 3', hot: true },
          { label: '合法行下标', value: '0 ~ 2' },
          { label: '合法列下标', value: '0 ~ 2' },
          { label: '选中', value: state.selected2 ? ('a[' + state.selected2[0] + '][' + state.selected2[1] + ']') : '—' }
        ]);
      }
    }

    setMode('read');
    setView('1d');
    noteBox.set('数组 = 一串<b>连续</b>的格子，每格有编号（下标）和值；length 是固定属性，创建后不能改。', '');
    render();
  }

  LABS.array = {
    title: '数组操作沙盒',
    desc: '点格子取值/赋值、看下标与 length、亲手触发越界异常，再切到二维数组看行列',
    tags: ['ch04'],
    icon: 'array',
    order: 4,
    init: lab(initArray)
  };

  /* =====================================================================
   * 5. loops —— 循环逐轮可视化（for / while / do-while）
   * ===================================================================== */
  var LOOP_KINDS = [
    { key: 'for', label: 'for 循环' },
    { key: 'while', label: 'while 循环' },
    { key: 'doWhile', label: 'do-while 循环' }
  ];

  function loopLines(kind, n) {
    var head = [
      'public class Demo {',
      '    public static void main(String[] args) {',
      '        int n = ' + n + ';',
      '        int sum = 0;'
    ];
    var tail = [
      '        System.out.println(sum);',
      '    }',
      '}'
    ];
    if (kind === 'for') {
      return head.concat([
        '        for (int i = 1; i <= n; i++) {',
        '            sum += i;',
        '        }'
      ]).concat(tail);
    }
    if (kind === 'while') {
      return head.concat([
        '        int i = 1;',
        '        while (i <= n) {',
        '            sum += i;',
        '            i++;',
        '        }'
      ]).concat(tail);
    }
    return head.concat([
      '        int i = 1;',
      '        do {',
      '            sum += i;',
      '            i++;',
      '        } while (i <= n);'
    ]).concat(tail);
  }

  /** 生成逐轮帧：每帧 = 轮次 / i / 条件 / 循环体 / 累加器 / 代码行 / 中文说明 */
  function buildLoopFrames(kind, n) {
    var frames = [];
    var sum = 0;
    var i;

    if (kind === 'for') {
      frames.push({ round: 0, i: 0, cond: '初始化', body: 'sum = 0', acc: 0, line: 4, note: '第 4 行：累加器 sum = 0，循环还没开始。' });
      for (i = 1; i <= n; i++) {
        frames.push({ round: i, i: i, cond: i + ' <= ' + n + ' → true', body: '进入循环体', acc: sum, line: 5, note: '第 ' + i + ' 轮：检查 i <= n，' + i + ' <= ' + n + ' 成立，进入循环体。' });
        sum += i;
        frames.push({ round: i, i: i, cond: 'true', body: 'sum += ' + i + ' → ' + sum, acc: sum, line: 6, note: '第 ' + i + ' 轮：sum = sum + ' + i + ' = ' + sum + '。' });
      }
      frames.push({ round: n + 1, i: n + 1, cond: (n + 1) + ' <= ' + n + ' → false', body: '循环结束', acc: sum, line: 5, note: 'i 变成 ' + (n + 1) + '，条件不成立 → 跳出循环。' });
      frames.push({ round: 0, i: null, cond: '—', body: '输出 sum = ' + sum, acc: sum, line: 8, note: '第 8 行：System.out.println(sum) 输出 ' + sum + '。' });
      return { frames: frames, total: sum };
    }

    if (kind === 'while') {
      var w = 1;
      frames.push({ round: 0, i: 1, cond: '初始化', body: 'sum = 0; i = 1', acc: 0, line: 5, note: '第 4~5 行：sum = 0，i = 1。while 每轮都先判断条件。' });
      while (w <= n) {
        frames.push({ round: w, i: w, cond: w + ' <= ' + n + ' → true', body: '进入循环体', acc: sum, line: 6, note: '第 ' + w + ' 轮：检查 i <= n 成立，进入循环体。' });
        sum += w;
        frames.push({ round: w, i: w, cond: 'true', body: 'sum += ' + w + ' → ' + sum, acc: sum, line: 7, note: '第 ' + w + ' 轮：sum 变成 ' + sum + '。' });
        w++;
        frames.push({ round: w, i: w, cond: '—', body: 'i++ → ' + w, acc: sum, line: 8, note: '第 8 行：i++ 后 i = ' + w + '，回到 while 继续判断。' });
      }
      frames.push({ round: n + 1, i: w, cond: w + ' <= ' + n + ' → false', body: '循环结束', acc: sum, line: 6, note: '条件不成立，退出循环。' });
      frames.push({ round: 0, i: null, cond: '—', body: '输出 sum = ' + sum, acc: sum, line: 10, note: '第 10 行：输出 ' + sum + '。' });
      return { frames: frames, total: sum };
    }

    /* do-while：先执行一次，再判断条件 */
    var d = 1;
    frames.push({ round: 0, i: 1, cond: '初始化', body: 'sum = 0; i = 1', acc: 0, line: 5, note: '第 4~5 行：sum = 0，i = 1。do-while 先无条件执行一次。' });
    do {
      frames.push({ round: d, i: d, cond: '先执行后判断', body: '进入循环体', acc: sum, line: 7, note: '第 ' + d + ' 轮：do-while 不先判断，直接执行循环体。' });
      sum += d;
      frames.push({ round: d, i: d, cond: '—', body: 'sum += ' + d + ' → ' + sum, acc: sum, line: 7, note: '第 ' + d + ' 轮：sum 变成 ' + sum + '。' });
      d++;
      frames.push({ round: d, i: d, cond: d + ' <= ' + n + ' → ' + (d <= n ? 'true，继续' : 'false，退出'), body: 'i++ → ' + d, acc: sum, line: 9, note: '第 9 行：i++ 后检查 ' + d + ' <= ' + n + ' → ' + (d <= n ? 'true，再来一轮' : 'false，退出循环') + '。' });
    } while (d <= n);
    frames.push({ round: 0, i: null, cond: '—', body: '输出 sum = ' + sum, acc: sum, line: 10, note: '第 10 行：输出 ' + sum + '。' });
    return { frames: frames, total: sum };
  }

  function initLoops(root, props, ctx, kit) {
    var state = {
      kind: 'for',
      n: 5,
      frames: [],
      idx: 0,
      frame: null,
      total: 0
    };

    var kindRow = ctl(root);
    var ctrlRow = ctl(root);
    var grid = E('div', { class: 'gridBlock c2' });
    var codeCell = E('div');
    var rightCell = E('div');
    grid.appendChild(codeCell);
    grid.appendChild(rightCell);
    root.appendChild(grid);
    var statBox = stats(root);
    var noteBox = note(root);
    var verifyBox = E('div', { class: 'labNote' });
    root.appendChild(verifyBox);
    var engineRow = ctl(root);

    var codeHost = E('div');
    codeCell.appendChild(codeHost);
    var codeView = null;

    var tableHost = E('div');
    rightCell.appendChild(tableHost);
    var barsHost = E('div', { class: 'labStage' });
    rightCell.appendChild(barsHost);

    var bars = null;
    function getBars() {
      if (!bars) bars = viz().bars(barsHost, {});
      return bars;
    }

    var kindBtns = {};
    LOOP_KINDS.forEach(function (k) {
      kindBtns[k.key] = button(kindRow, k.label, function () {
        state.kind = k.key;
        Object.keys(kindBtns).forEach(function (key) { kindBtns[key].classList.toggle('on', key === k.key); });
        reset();
      });
    });

    var nSlider = slider(kindRow, {
      label: 'n', min: 1, max: 8, value: state.n,
      onInput: function (v) { state.n = v; reset(); }
    });

    var player = makePlayer(function () { return stepOnce(); }, function () { return 620; });
    kit.addPlayer(player);
    player.onIdle = function () { render(); };

    var playBtn = button(ctrlRow, '播放', function () {
      if (state.idx >= state.frames.length - 1) reset();
      if (player.playing) {
        player.pause();
        render();
        return;
      }
      player.play();
      render();
    }, { icon: 'play' });
    button(ctrlRow, '下一步', function () {
      player.pause();
      if (state.idx >= state.frames.length - 1) {
        noteBox.set('已经走到循环结束。点「重置」从头看，或把 n 改大一点。', state.frames.length + ' / ' + state.frames.length + ' 步');
        return;
      }
      stepOnce();
    }, { icon: 'step' });
    button(ctrlRow, '重置', function () { reset(); }, { icon: 'reset' });

    var verifyBtn = button(ctrlRow, '引擎验证', function () { verify(); }, { icon: 'cpu' });
    var engPill = engineStatus(engineRow, refreshVerifyBtn);
    kit.onDestroy(engPill.destroy);
    hintLine(engineRow, '「引擎验证」会用真实解释器跑一遍左边的代码，核对累加结果与手算是否一致。');

    function refreshVerifyBtn() {
      verifyBtn.disabled = !CSC.java;
      setBtnLabel(verifyBtn, CSC.java ? '引擎验证' : '引擎验证（加载中）');
    }

    function renderCode() {
      codeHost.innerHTML = '';
      codeView = codeBlock(codeHost, loopLines(state.kind, state.n));
      if (state.frame) codeView.mark(state.frame.line || 0);
    }

    function accSeries() {
      var series = [];
      var r;
      for (r = 1; r <= state.n; r++) series.push(0);
      for (var i = 0; i <= state.idx && i < state.frames.length; i++) {
        var f = state.frames[i];
        if (f.round >= 1 && f.round <= state.n && f.acc > 0) series[f.round - 1] = f.acc;
      }
      return series;
    }

    function renderLog() {
      tableHost.innerHTML = '';
      var wrap = E('div', { class: 'tableWrap' });
      var table = E('table');
      var thead = E('thead');
      var htr = E('tr');
      ['轮次', 'i', '条件', '循环体', 'sum'].forEach(function (h) {
        htr.appendChild(E('th', { text: h }));
      });
      thead.appendChild(htr);
      var tbody = E('tbody');
      var rows = 0;
      for (var i = 0; i <= state.idx && i < state.frames.length; i++) {
        var f = state.frames[i];
        if (!f.body) continue;
        if (f.body === '进入循环体') continue;
        var tr = E('tr');
        tr.appendChild(E('td', { class: 'mono', text: f.round ? String(f.round) : '—' }));
        tr.appendChild(E('td', { class: 'mono', text: f.i == null ? '—' : String(f.i) }));
        tr.appendChild(E('td', { text: f.cond || '—' }));
        tr.appendChild(E('td', { text: f.body }));
        tr.appendChild(E('td', { class: 'mono', text: String(f.acc) }));
        tbody.appendChild(tr);
        rows++;
      }
      if (!rows) {
        var tr0 = E('tr');
        var td0 = E('td', { colspan: '5' });
        td0.appendChild(E('span', { class: 'varEmpty', text: '点「播放」或「下一步」开始观察每一轮。' }));
        tr0.appendChild(td0);
        tbody.appendChild(tr0);
      }
      table.appendChild(thead);
      table.appendChild(tbody);
      wrap.appendChild(table);
      tableHost.appendChild(wrap);
    }

    function render() {
      var f = state.frame;
      if (!f) return;
      if (codeView) codeView.mark(f.line || 0);
      renderLog();
      var series = accSeries();
      getBars().update({
        values: series,
        labels: series.map(function (v) { return v ? String(v) : ''; }),
        highlight: f.round >= 1 && f.round <= state.n ? [f.round - 1] : [],
        max: Math.max(1, state.total)
      });
      statBox.set([
        { label: '轮次', value: f.round ? f.round : '—', hot: true },
        { label: 'i', value: f.i == null ? '—' : f.i },
        { label: '条件', value: f.cond || '—' },
        { label: 'sum', value: f.acc },
        { label: '最终输出', value: state.total }
      ]);
      noteBox.set(f.note, (state.idx + 1) + ' / ' + state.frames.length + ' 步');
      setBtnLabel(playBtn, player.playing ? '暂停' : '播放');
    }

    function stepOnce() {
      if (state.idx >= state.frames.length - 1) return false;
      state.idx++;
      state.frame = state.frames[state.idx];
      render();
      return state.idx < state.frames.length - 1;
    }

    function reset() {
      player.pause();
      var built = buildLoopFrames(state.kind, state.n);
      state.frames = built.frames;
      state.total = built.total;
      state.idx = 0;
      state.frame = state.frames[0];
      renderCode();
      verifyBox.innerHTML = '<b>引擎验证</b> 换一段循环或改 n 之后，点「引擎验证」用真实解释器核对输出。';
      refreshVerifyBtn();
      render();
    }

    function verify() {
      if (!CSC.java) {
        verifyBox.innerHTML = '解释器还在加载中，稍后再点一次。';
        return;
      }
      var code = loopLines(state.kind, state.n).join('\n');
      var res;
      try {
        res = CSC.java.run(code, {});
      } catch (e) {
        verifyBox.innerHTML = '解释器执行出错：' + esc(e && e.message ? e.message : e);
        return;
      }
      if (res && res.ok) {
        verifyBox.innerHTML = '<b>真实解释器输出：' + esc(String(res.output || '').trim()) + '</b>（执行 ' + res.steps +
          ' 步）　和上方推演出的 ' + state.total + ' 一致吗？';
      } else if (res && res.error) {
        verifyBox.innerHTML = '真实解释器报错：<b>' + esc(res.error.message || '未知错误') + '</b>' +
          (res.error.hint ? '（' + esc(res.error.hint) + '）' : '');
      } else {
        verifyBox.innerHTML = '解释器没有返回结果。';
      }
    }

    state.kind = 'for';
    kindBtns['for'].classList.add('on');
    refreshVerifyBtn();
    reset();
  }

  LABS.loops = {
    title: '循环逐轮可视化',
    desc: '拖动 n、切换 for / while / do-while，看 i、条件、循环体、累加器每一轮怎么变',
    tags: ['ch03'],
    icon: 'repeat',
    order: 5,
    init: lab(initLoops)
  };

  /* =====================================================================
   * 6. conditionals —— 条件分支流程（输入数值，看走哪条路）
   * ===================================================================== */
  var COND_RULES = {
    grade: {
      label: '成绩等级（if / else if / else）',
      valueLabel: 'score', valueMin: 0, valueMax: 100, value: 72,
      conds: [
        { expr: function (v) { return 'score >= 90（' + v + '）'; }, test: function (v) { return v >= 90; }, out: 'A · 90–100' },
        { expr: function (v) { return 'score >= 80（' + v + '）'; }, test: function (v) { return v >= 80; }, out: 'B · 80–89' },
        { expr: function (v) { return 'score >= 70（' + v + '）'; }, test: function (v) { return v >= 70; }, out: 'C · 70–79' },
        { expr: function (v) { return 'score >= 60（' + v + '）'; }, test: function (v) { return v >= 60; }, out: 'D · 60–69' }
      ],
      elseOut: 'F · 不及格', elseDesc: '低于 60'
    },
    sign: {
      label: '正数 / 负数 / 零',
      valueLabel: 'n', valueMin: -10, valueMax: 10, value: 7,
      conds: [
        { expr: function (v) { return 'n > 0（' + v + '）'; }, test: function (v) { return v > 0; }, out: '正数' },
        { expr: function (v) { return 'n < 0（' + v + '）'; }, test: function (v) { return v < 0; }, out: '负数' }
      ],
      elseOut: '零', elseDesc: 'n 既不大于 0 也不小于 0'
    },
    fizz: {
      label: 'FizzBuzz（多条件顺序判断）',
      valueLabel: 'n', valueMin: 1, valueMax: 30, value: 15,
      conds: [
        { expr: function (v) { return 'n % 15 == 0（' + v + '）'; }, test: function (v) { return v % 15 === 0; }, out: '"FizzBuzz"' },
        { expr: function (v) { return 'n % 3 == 0（' + v + '）'; }, test: function (v) { return v % 3 === 0; }, out: '"Fizz"' },
        { expr: function (v) { return 'n % 5 == 0（' + v + '）'; }, test: function (v) { return v % 5 === 0; }, out: '"Buzz"' }
      ],
      elseOut: '输出数字 n 本身', elseDesc: '不能被 3 或 5 整除'
    }
  };

  function condNodes(rule, value) {
    var nodes = [{ title: '开始', desc: rule.valueLabel + ' = ' + value, kind: 'start' }];
    rule.conds.forEach(function (c) {
      nodes.push({ title: c.expr(value) + ' ?', kind: 'decide', yes: c.out });
    });
    nodes.push({ title: 'else', desc: rule.elseOut, kind: 'end' });
    return nodes;
  }

  /** 把条件判断过程变成帧序列：每帧高亮当前判断节点 / 命中的「是」分支 / 走过的路径 */
  function buildCondSteps(rule, value) {
    var steps = [];
    var path = [0];
    var i;
    steps.push({ node: 0, path: path.slice(), note: '从 start 进入：' + rule.valueLabel + ' = <b>' + value + '</b>，开始按顺序检查条件。', result: null });
    for (i = 0; i < rule.conds.length; i++) {
      var c = rule.conds[i];
      var idx = i + 1;
      path = path.concat([idx]);
      var ok = c.test(value);
      steps.push({
        node: idx, path: path.slice(),
        note: '判断 <b>' + esc(c.expr(value)) + '</b> → <b>' + (ok ? 'true' : 'false') + '</b>' +
          (ok ? '，进入「是」分支' : '，继续检查下一个条件'),
        result: null
      });
      if (ok) {
        steps.push({
          node: idx, yes: idx, path: path.slice(),
          note: '输出 <b>' + esc(c.out) + '</b>：这个分支执行完就结束整个 if/else 链，后面的条件不会再判断。',
          result: c.out
        });
        return steps;
      }
    }
    var elseIdx = rule.conds.length + 1;
    path = path.concat([elseIdx]);
    steps.push({
      node: elseIdx, path: path.slice(),
      note: '所有条件都是 false → 执行 else 分支，输出 <b>' + esc(rule.elseOut) + '</b>。',
      result: rule.elseOut
    });
    return steps;
  }

  function initConditionals(root, props, ctx, kit) {
    var state = {
      ruleKey: 'grade',
      rule: COND_RULES.grade,
      value: COND_RULES.grade.value,
      steps: [],
      idx: 0,
      frame: null
    };

    var ruleRow = ctl(root);
    var flowWrap = E('div', { class: 'flowWrap' });
    root.appendChild(flowWrap);
    var noteBox = note(root);
    var resultBox = E('div', { class: 'labNote' });
    root.appendChild(resultBox);
    var statBox = stats(root);
    var hint = hintLine(root, '拖滑块改数值，然后单步或播放：流程图会高亮当前正在判断的条件和命中的分支。');

    var flow = viz().flow(flowWrap, {});

    var ruleOptions = Object.keys(COND_RULES).map(function (k) {
      return { value: k, label: COND_RULES[k].label };
    });
    selectBox(ruleRow, ruleOptions, state.ruleKey, function (v) { switchRule(v); });

    var valueSlider = slider(ruleRow, {
      label: state.rule.valueLabel, min: state.rule.valueMin, max: state.rule.valueMax, value: state.value,
      onInput: function (v) { state.value = v; reset(); }
    });

    var player = makePlayer(function () { return stepOnce(); }, function () { return 620; });
    kit.addPlayer(player);
    player.onIdle = function () { render(); };

    var playBtn = button(ruleRow, '播放判定', function () {
      if (state.idx >= state.steps.length - 1) reset();
      if (player.playing) {
        player.pause();
        render();
        return;
      }
      player.play();
      render();
    }, { icon: 'play' });
    button(ruleRow, '下一步', function () {
      player.pause();
      if (state.idx >= state.steps.length - 1) {
        noteBox.set('判断已经结束。改一下数值（比如跨过某个阈值）就能看到走另一条分支。', state.steps.length + ' / ' + state.steps.length + ' 步');
        return;
      }
      stepOnce();
    }, { icon: 'step' });
    button(ruleRow, '重置', function () { reset(); }, { icon: 'reset' });

    function switchRule(key) {
      state.ruleKey = key;
      state.rule = COND_RULES[key];
      state.value = state.rule.value;
      valueSlider.input.min = String(state.rule.valueMin);
      valueSlider.input.max = String(state.rule.valueMax);
      valueSlider.set(state.value);
      var lbl = valueSlider.el.querySelector('span');
      if (lbl) lbl.textContent = state.rule.valueLabel;
      reset();
    }

    function render() {
      var f = state.frame;
      if (!f) return;
      flow.update({
        nodes: condNodes(state.rule, state.value),
        dir: 'v',
        active: { node: f.node, yes: f.yes },
        path: f.path
      });
      noteBox.set(f.note, (state.idx + 1) + ' / ' + state.steps.length + ' 步');
      resultBox.innerHTML = f.result
        ? '<b>输出</b> ' + esc(f.result)
        : '<b>输出</b> <span class="dim">还没算出来，继续「下一步」或播放</span>';
      var seen = {};
      for (var i = 0; i < state.idx && i < state.steps.length; i++) {
        var nd = state.steps[i].node;
        if (nd > 0 && nd <= state.rule.conds.length) seen[nd] = 1;
      }
      var decided = Object.keys(seen).length;
      statBox.set([
        { label: '规则', value: state.rule.label, hot: true },
        { label: '输入', value: state.rule.valueLabel + ' = ' + state.value },
        { label: '已判断条件', value: decided + ' / ' + state.rule.conds.length },
        { label: '结果', value: f.result || '进行中' }
      ]);
      setBtnLabel(playBtn, player.playing ? '暂停' : '播放判定');
    }

    function reset() {
      player.pause();
      state.steps = buildCondSteps(state.rule, state.value);
      state.idx = 0;
      state.frame = state.steps[0];
      render();
    }

    function stepOnce() {
      if (state.idx >= state.steps.length - 1) return false;
      state.idx++;
      state.frame = state.steps[state.idx];
      render();
      return state.idx < state.steps.length - 1;
    }

    hint.textContent = '当前规则：' + state.rule.label + '。每个条件节点右侧是它的「是」分支；条件为 false 时沿主链往下走。';
    reset();
  }

  LABS.conditionals = {
    title: '条件分支流程',
    desc: '拖一个数值，看 if / else if / else 到底走了哪条路，以及为什么只执行一个分支',
    tags: ['ch03'],
    icon: 'branch',
    order: 6,
    init: lab(initConditionals)
  };

  /* =====================================================================
   * 7. memory —— 栈 / 堆 / 引用箭头（6 个预置场景逐步演练）
   * ===================================================================== */
  var MEM_SCENARIOS = {
    primitive: {
      label: '① 基本类型赋值：复制值',
      lesson: '基本类型（int 等）的变量格子里直接存值；b = a 只是复制这个值，之后两者互不影响。',
      code: ['int a = 10;', 'int b = a;', 'b = 20;'],
      java: [
        'public class Demo {',
        '    public static void main(String[] args) {',
        '        int a = 10;',
        '        int b = a;',
        '        b = 20;',
        '        System.out.println(a + " " + b);',
        '    }',
        '}'
      ],
      steps: [
        {
          line: 1, note: 'int a = 10：栈帧里给 a 分配一个格子，直接写入 10。',
          stack: [{ name: 'main', vars: [{ name: 'a', type: 'int', value: '10' }] }], heap: []
        },
        {
          line: 2, note: 'int b = a：把 a 的<b>值</b>复制给 b。现在 a、b 是两个独立的格子。',
          stack: [{ name: 'main', vars: [
            { name: 'a', type: 'int', value: '10' },
            { name: 'b', type: 'int', value: '10' }
          ] }], heap: [], changed: ['b']
        },
        {
          line: 3, note: 'b = 20：只改 b 的格子，<b>a 仍然是 10</b>。这就是值复制。',
          stack: [{ name: 'main', vars: [
            { name: 'a', type: 'int', value: '10' },
            { name: 'b', type: 'int', value: '20' }
          ] }], heap: [], changed: ['b']
        }
      ]
    },

    arrayAlias: {
      label: '② 数组别名：两个变量指向同一个数组',
      lesson: '数组变量里存的是<b>引用</b>（地址）。b = a 复制的是地址，所以 a 和 b 指向堆里同一个数组对象。',
      code: ['int[] a = {1, 2, 3};', 'int[] b = a;', 'b[0] = 99;', '// a[0] 现在是多少？'],
      java: [
        'public class Demo {',
        '    public static void main(String[] args) {',
        '        int[] a = {1, 2, 3};',
        '        int[] b = a;',
        '        b[0] = 99;',
        '        System.out.println(a[0]);',
        '    }',
        '}'
      ],
      steps: [
        {
          line: 1, note: '创建数组 a：栈里的 a 存引用 <b>#1</b>，数组 {1,2,3} 本身在堆里。',
          stack: [{ name: 'main', vars: [{ name: 'a', type: 'int[]', ref: '#1' }] }],
          heap: [{ id: '#1', kind: 'array', type: 'int[]', elements: ['1', '2', '3'] }]
        },
        {
          line: 2, note: 'int[] b = a：复制的是<b>引用</b>，不是数组内容。a、b 都指向 #1。',
          stack: [{ name: 'main', vars: [
            { name: 'a', type: 'int[]', ref: '#1' },
            { name: 'b', type: 'int[]', ref: '#1' }
          ] }],
          heap: [{ id: '#1', kind: 'array', type: 'int[]', elements: ['1', '2', '3'] }],
          changed: ['b']
        },
        {
          line: 3, note: 'b[0] = 99：通过 b 改的是堆里的 #1，所以 <b>a[0] 也变成 99</b>。',
          stack: [{ name: 'main', vars: [
            { name: 'a', type: 'int[]', ref: '#1' },
            { name: 'b', type: 'int[]', ref: '#1' }
          ] }],
          heap: [{ id: '#1', kind: 'array', type: 'int[]', elements: ['99', '2', '3'], changed: [0] }]
        },
        {
          line: 4, note: '答案：a[0] = 99。两个变量名指向同一块内存，这叫<b>别名（alias）</b>。',
          stack: [{ name: 'main', vars: [
            { name: 'a', type: 'int[]', ref: '#1' },
            { name: 'b', type: 'int[]', ref: '#1' }
          ] }],
          heap: [{ id: '#1', kind: 'array', type: 'int[]', elements: ['99', '2', '3'], changed: [0] }]
        }
      ]
    },

    objectRef: {
      label: '③ 对象引用：改字段影响所有引用',
      lesson: '对象同样通过引用访问；q = p 之后改 q.x，p.x 也变。',
      code: ['Point p = new Point(3, 4);', 'Point q = p;', 'q.x = 10;', '// p.x = ?'],
      java: [
        'class Point {',
        '    int x, y;',
        '    Point(int x, int y) { this.x = x; this.y = y; }',
        '}',
        'public class Demo {',
        '    public static void main(String[] args) {',
        '        Point p = new Point(3, 4);',
        '        Point q = p;',
        '        q.x = 10;',
        '        System.out.println(p.x);',
        '    }',
        '}'
      ],
      steps: [
        {
          line: 1, note: 'new Point(3, 4)：在堆里创建对象 <b>#1</b>，p 保存它的引用。',
          stack: [{ name: 'main', vars: [{ name: 'p', type: 'Point', ref: '#1' }] }],
          heap: [{ id: '#1', kind: 'object', type: 'Point', fields: { x: '3', y: '4' } }]
        },
        {
          line: 2, note: 'Point q = p：q 也指向 <b>#1</b>。两个引用、一个对象。',
          stack: [{ name: 'main', vars: [
            { name: 'p', type: 'Point', ref: '#1' },
            { name: 'q', type: 'Point', ref: '#1' }
          ] }],
          heap: [{ id: '#1', kind: 'object', type: 'Point', fields: { x: '3', y: '4' } }],
          changed: ['q']
        },
        {
          line: 3, note: 'q.x = 10：改的是 #1 的字段，所以 <b>p.x 也变成 10</b>。',
          stack: [{ name: 'main', vars: [
            { name: 'p', type: 'Point', ref: '#1' },
            { name: 'q', type: 'Point', ref: '#1' }
          ] }],
          heap: [{ id: '#1', kind: 'object', type: 'Point', fields: { x: '10', y: '4' }, changed: ['x'] }]
        }
      ]
    },

    shallowCopy: {
      label: '④ 浅拷贝：真的要复制内容',
      lesson: '想要“互不影响”，必须 <b>new 一个新数组</b> 再把元素逐个复制（或 Arrays.copyOf）。',
      code: ['int[] a = {1, 2, 3};', 'int[] b = new int[a.length];', 'for (int i = 0; i < a.length; i++)', '    b[i] = a[i];', 'b[0] = 99;'],
      java: [
        'public class Demo {',
        '    public static void main(String[] args) {',
        '        int[] a = {1, 2, 3};',
        '        int[] b = new int[a.length];',
        '        for (int i = 0; i < a.length; i++) b[i] = a[i];',
        '        b[0] = 99;',
        '        System.out.println(a[0] + " " + b[0]);',
        '    }',
        '}'
      ],
      steps: [
        {
          line: 1, note: 'a 引用堆里的 <b>#1</b>，内容是 {1,2,3}。',
          stack: [{ name: 'main', vars: [{ name: 'a', type: 'int[]', ref: '#1' }] }],
          heap: [{ id: '#1', kind: 'array', type: 'int[]', elements: ['1', '2', '3'] }]
        },
        {
          line: 2, note: 'new int[a.length]：在堆里新建 <b>#2</b>，元素默认都是 0。这是另一块内存。',
          stack: [{ name: 'main', vars: [
            { name: 'a', type: 'int[]', ref: '#1' },
            { name: 'b', type: 'int[]', ref: '#2' }
          ] }],
          heap: [
            { id: '#1', kind: 'array', type: 'int[]', elements: ['1', '2', '3'] },
            { id: '#2', kind: 'array', type: 'int[]', elements: ['0', '0', '0'] }
          ],
          changed: ['b']
        },
        {
          line: 4, note: '循环把 a 的每个元素<b>逐个复制</b>到 #2。',
          stack: [{ name: 'main', vars: [
            { name: 'a', type: 'int[]', ref: '#1' },
            { name: 'b', type: 'int[]', ref: '#2' }
          ] }],
          heap: [
            { id: '#1', kind: 'array', type: 'int[]', elements: ['1', '2', '3'] },
            { id: '#2', kind: 'array', type: 'int[]', elements: ['1', '2', '3'], changed: [0, 1, 2] }
          ]
        },
        {
          line: 5, note: 'b[0] = 99 只改 #2，<b>a[0] 仍然是 1</b> —— 这才是真正的复制。',
          stack: [{ name: 'main', vars: [
            { name: 'a', type: 'int[]', ref: '#1' },
            { name: 'b', type: 'int[]', ref: '#2' }
          ] }],
          heap: [
            { id: '#1', kind: 'array', type: 'int[]', elements: ['1', '2', '3'] },
            { id: '#2', kind: 'array', type: 'int[]', elements: ['99', '2', '3'], changed: [0] }
          ]
        }
      ]
    },

    stringImmutable: {
      label: '⑤ String 不可变：拼接会产生新对象',
      lesson: 'String 是<b>不可变</b>的：s = s + "!" 不是改原字符串，而是新建一个字符串对象，让 s 指向它。',
      code: ['String s = "hi";', 'String t = s;', 's = s + "!";', '// t 还是 "hi" 吗？'],
      java: [
        'public class Demo {',
        '    public static void main(String[] args) {',
        '        String s = "hi";',
        '        String t = s;',
        '        s = s + "!";',
        '        System.out.println(t);',
        '    }',
        '}'
      ],
      steps: [
        {
          line: 1, note: '字符串 "hi" 是一个对象，s 指向 <b>#1</b>。',
          stack: [{ name: 'main', vars: [{ name: 's', type: 'String', ref: '#1' }] }],
          heap: [{ id: '#1', kind: 'string', type: 'String', value: 'hi' }]
        },
        {
          line: 2, note: 't = s：t 也指向 <b>#1</b>。',
          stack: [{ name: 'main', vars: [
            { name: 's', type: 'String', ref: '#1' },
            { name: 't', type: 'String', ref: '#1' }
          ] }],
          heap: [{ id: '#1', kind: 'string', type: 'String', value: 'hi' }],
          changed: ['t']
        },
        {
          line: 3, note: 's + "!" 创建<b>新字符串 #2</b>（内容 "hi!"），然后 s 改为指向 #2；原来的 #1 没变。',
          stack: [{ name: 'main', vars: [
            { name: 's', type: 'String', ref: '#2' },
            { name: 't', type: 'String', ref: '#1' }
          ] }],
          heap: [
            { id: '#1', kind: 'string', type: 'String', value: 'hi' },
            { id: '#2', kind: 'string', type: 'String', value: 'hi!', changed: true }
          ],
          changed: ['s']
        },
        {
          line: 4, note: '所以 t 仍然是 "hi"。这也解释了为什么循环里用 s = s + x 拼接会很慢——每次都造新对象。',
          stack: [{ name: 'main', vars: [
            { name: 's', type: 'String', ref: '#2' },
            { name: 't', type: 'String', ref: '#1' }
          ] }],
          heap: [
            { id: '#1', kind: 'string', type: 'String', value: 'hi' },
            { id: '#2', kind: 'string', type: 'String', value: 'hi!' }
          ]
        }
      ]
    },

    nullRef: {
      label: '⑥ null 引用：访问会抛异常',
      lesson: 'null 表示“不指向任何对象”。对 null 做成员访问 / 下标访问 → NullPointerException。',
      code: ['int[] a = null;', 'a[0] = 5;', '// NullPointerException'],
      java: [
        'public class Demo {',
        '    public static void main(String[] args) {',
        '        int[] a = null;',
        '        a[0] = 5;',
        '        System.out.println(a[0]);',
        '    }',
        '}'
      ],
      steps: [
        {
          line: 1, note: 'a = null：栈里的 a 不指向任何堆对象。',
          stack: [{ name: 'main', vars: [{ name: 'a', type: 'int[]', value: 'null' }] }], heap: []
        },
        {
          line: 2, note: 'a[0] = 5：a 是 null，找不到数组 → 抛 <b>java.lang.NullPointerException</b>，程序终止。',
          stack: [{ name: 'main', vars: [{ name: 'a', type: 'int[]', value: 'null' }] }], heap: [], err: true
        }
      ]
    }
  };

  function initMemory(root, props, ctx, kit) {
    var state = {
      key: 'arrayAlias',
      scn: MEM_SCENARIOS.arrayAlias,
      idx: 0,
      frame: null
    };

    var ctlRow = ctl(root);
    var mem = E('div', { class: 'mem' });
    var colStack = E('div', { class: 'memCol' });
    var colHeap = E('div', { class: 'memCol' });
    colStack.appendChild(E('div', { class: 'memColT', text: '栈 stack（局部变量）' }));
    colHeap.appendChild(E('div', { class: 'memColT', text: '堆 heap（new 出来的对象）' }));
    var stackHost = E('div');
    var heapHost = E('div');
    colStack.appendChild(stackHost);
    colHeap.appendChild(heapHost);
    mem.appendChild(colStack);
    mem.appendChild(colHeap);
    root.appendChild(mem);

    var codeHost = E('div');
    root.appendChild(codeHost);
    var codeView = null;

    var noteBox = note(root);
    var statBox = stats(root);
    var engineRow = ctl(root);
    var verifyBox = E('div', { class: 'labNote' });
    root.appendChild(verifyBox);
    var hint = hintLine(root, '');

    var scnOptions = Object.keys(MEM_SCENARIOS).map(function (k) {
      return { value: k, label: MEM_SCENARIOS[k].label };
    });
    selectBox(ctlRow, scnOptions, state.key, function (v) {
      state.key = v;
      state.scn = MEM_SCENARIOS[v];
      reset();
    });

    var player = makePlayer(function () { return stepOnce(); }, function () { return 760; });
    kit.addPlayer(player);
    player.onIdle = function () { render(); };

    var playBtn = button(ctlRow, '播放', function () {
      if (state.idx >= state.scn.steps.length - 1) reset();
      if (player.playing) {
        player.pause();
        render();
        return;
      }
      player.play();
      render();
    }, { icon: 'play' });
    button(ctlRow, '下一步', function () {
      player.pause();
      if (state.idx >= state.scn.steps.length - 1) {
        noteBox.set('这个场景演完了。换个场景看另一种引用关系。', state.scn.steps.length + ' / ' + state.scn.steps.length + ' 步');
        return;
      }
      stepOnce();
    }, { icon: 'step' });
    button(ctlRow, '重置', function () { reset(); }, { icon: 'reset' });

    var verifyBtn = button(ctlRow, '引擎验证', function () { verify(); }, { icon: 'cpu' });
    var engPill = engineStatus(engineRow, refreshVerifyBtn);
    kit.onDestroy(engPill.destroy);
    hintLine(engineRow, '引擎验证会运行这个场景的完整 Java 代码，用真实输出核对“内存图推理”的结论。');

    function refreshVerifyBtn() {
      verifyBtn.disabled = !CSC.java;
      setBtnLabel(verifyBtn, CSC.java ? '引擎验证' : '引擎验证（加载中）');
    }

    function renderStack(f) {
      stackHost.innerHTML = '';
      if (!f.stack || !f.stack.length) {
        stackHost.appendChild(E('div', { class: 'memEmpty', text: '栈为空（还没有方法在运行）' }));
        return;
      }
      var wrap = E('div', { class: 'memStack' });
      f.stack.forEach(function (fr, i) {
        var frameEl = E('div', { class: 'memFrame' + (i === f.stack.length - 1 ? ' top' : '') });
        var head = E('div', { class: 'memFrameH' });
        head.appendChild(E('b', { text: fr.name }));
        head.appendChild(E('span', { class: 'ml', text: 'line ' + (f.line || '?') }));
        frameEl.appendChild(head);
        var varsBox = E('div', { class: 'memVars' });
        (fr.vars || []).forEach(function (v) {
          var row = E('div', { class: 'memVar' + (f.changed && f.changed.indexOf(v.name) >= 0 ? ' changed' : '') });
          row.appendChild(E('span', { class: 'mn', text: v.name }));
          row.appendChild(E('span', { class: 'mty', text: v.type }));
          if (v.ref != null) {
            row.appendChild(E('span', { class: 'mv mref', text: '→ ' + v.ref }));
          } else {
            row.appendChild(E('span', { class: 'mv', text: String(v.value) }));
          }
          varsBox.appendChild(row);
        });
        frameEl.appendChild(varsBox);
        wrap.appendChild(frameEl);
      });
      stackHost.appendChild(wrap);
    }

    function renderHeap(f) {
      heapHost.innerHTML = '';
      if (!f.heap || !f.heap.length) {
        heapHost.appendChild(E('div', { class: 'memEmpty', text: '堆：空（没有 new 出来的对象）' }));
        return;
      }
      var wrap = E('div', { class: 'memHeap' });
      f.heap.forEach(function (obj) {
        var box = E('div', { class: 'memObj' });
        var head = E('div', { class: 'memObjH' });
        head.appendChild(E('span', { class: 'oid', text: obj.id }));
        head.appendChild(E('span', { text: ' ' + obj.type }));
        box.appendChild(head);
        if (obj.kind === 'array') {
          var idxRow = E('div', { class: 'memIdx' });
          (obj.elements || []).forEach(function (_, i) {
            idxRow.appendChild(E('span', { text: '[' + i + ']' }));
          });
          box.appendChild(idxRow);
          var row = E('div', { class: 'memArr' });
          (obj.elements || []).forEach(function (el, i) {
            row.appendChild(E('div', {
              class: 'memCell' + (obj.changed && obj.changed.indexOf(i) >= 0 ? ' changed' : ''),
              text: el
            }));
          });
          box.appendChild(row);
        } else if (obj.kind === 'string') {
          var srow = E('div', { class: 'memArr' });
          srow.appendChild(E('div', { class: 'memCell' + (obj.changed ? ' changed' : ''), text: '"' + obj.value + '"' }));
          box.appendChild(srow);
        } else {
          var fields = E('div', { class: 'memFields' });
          Object.keys(obj.fields || {}).forEach(function (k) {
            var frow = E('div', { class: 'memField' });
            frow.appendChild(E('span', { class: 'fn2', text: k }));
            frow.appendChild(E('span', { class: 'fv', text: String(obj.fields[k]) }));
            fields.appendChild(frow);
          });
          box.appendChild(fields);
        }
        wrap.appendChild(box);
      });
      heapHost.appendChild(wrap);
    }

    function renderCode() {
      codeHost.innerHTML = '';
      codeView = codeBlock(codeHost, state.scn.code);
      if (state.frame) codeView.mark(state.frame.line || 0);
    }

    function render() {
      var f = state.frame;
      if (!f) return;
      renderStack(f);
      renderHeap(f);
      if (codeView) codeView.mark(f.line || 0);
      noteBox.set(f.note + (f.err ? ' <b>（异常）</b>' : ''), (state.idx + 1) + ' / ' + state.scn.steps.length + ' 步');
      var heapCount = (f.heap || []).length;
      statBox.set([
        { label: '场景', value: state.scn.label.replace(/^[①②③④⑤⑥]\s*/, ''), hot: true },
        { label: '堆对象', value: heapCount },
        { label: '当前行', value: f.line ? '第 ' + f.line + ' 行' : '—' },
        { label: '异常', value: f.err ? '有（见状态条）' : '无' }
      ]);
      setBtnLabel(playBtn, player.playing ? '暂停' : '播放');
    }

    function reset() {
      player.pause();
      state.idx = 0;
      state.frame = state.scn.steps[0];
      renderCode();
      hint.textContent = state.scn.lesson;
      verifyBox.innerHTML = '<b>引擎验证</b> 点一下就能用真实解释器运行本场景的代码，验证你在内存图上的推理。';
      refreshVerifyBtn();
      render();
    }

    function stepOnce() {
      if (state.idx >= state.scn.steps.length - 1) return false;
      state.idx++;
      state.frame = state.scn.steps[state.idx];
      render();
      return state.idx < state.scn.steps.length - 1;
    }

    function verify() {
      if (!CSC.java) {
        verifyBox.innerHTML = '解释器还在加载中，稍后再点一次。';
        return;
      }
      var code = state.scn.java.join('\n');
      var res;
      try {
        res = CSC.java.run(code, {});
      } catch (e) {
        verifyBox.innerHTML = '解释器执行出错：' + esc(e && e.message ? e.message : e);
        return;
      }
      if (res && res.ok) {
        verifyBox.innerHTML = '<b>真实输出：</b>' + (res.output ? esc(res.output.trim()) : '（无输出）') +
          '　与内存图上推理的结果一致吗？';
      } else if (res && res.error) {
        verifyBox.innerHTML = '<b>真实解释器报错：</b>' + esc(res.error.message || '未知错误') +
          '　—— 这个场景本来就是演示异常，报错是预期结果。';
      } else {
        verifyBox.innerHTML = '解释器没有返回结果。';
      }
    }

    reset();
  }

  LABS.memory = {
    title: '栈、堆与引用',
    desc: '六个预置场景：基本类型、数组别名、对象引用、浅拷贝、不可变 String、null —— 一步步画出引用箭头',
    tags: ['ch09'],
    icon: 'memory',
    order: 7,
    init: lab(initMemory)
  };

  /* =====================================================================
   * 8. recursion —— 递归调用树（阶乘 / 斐波那契 / 汉诺塔）
   * ===================================================================== */
  function buildFactorialTree(n) {
    var nodes = [];
    var edges = [];
    var events = [];
    var seq = 0;
    function rec(k, parentId) {
      var id = 'n' + (seq++);
      nodes.push({ id: id, label: 'f(' + k + ')' });
      if (parentId) edges.push({ from: parentId, to: id });
      events.push({
        type: 'call', id: id, parent: parentId,
        note: '调用 f(' + k + ')' + (k <= 1 ? '：命中基线条件，不用再递归' : '：它依赖 f(' + (k - 1) + ') 的结果')
      });
      if (k <= 1) {
        events.push({ type: 'return', id: id, parent: parentId, value: 1, note: 'f(' + k + ') 返回 <b>1</b>（基线条件），开始向上回溯' });
        return 1;
      }
      var child = rec(k - 1, id);
      var val = k * child;
      events.push({ type: 'return', id: id, parent: parentId, value: val, note: 'f(' + k + ') = ' + k + ' × f(' + (k - 1) + ') = <b>' + val + '</b>，返回给上一层' });
      return val;
    }
    var result = rec(n, null);
    return { nodes: nodes, edges: edges, events: events, result: result, dir: 'h' };
  }

  function buildFibTree(n) {
    var nodes = [];
    var edges = [];
    var events = [];
    var seq = 0;
    function rec(k, parentId) {
      var id = 'n' + (seq++);
      nodes.push({ id: id, label: 'f(' + k + ')' });
      if (parentId) edges.push({ from: parentId, to: id });
      events.push({
        type: 'call', id: id, parent: parentId,
        note: '调用 f(' + k + ')' + (k <= 1 ? '：基线条件，直接返回值' : '：需要 f(' + (k - 1) + ') + f(' + (k - 2) + ')')
      });
      if (k <= 1) {
        events.push({ type: 'return', id: id, parent: parentId, value: k, note: 'f(' + k + ') 返回 <b>' + k + '</b>（基线条件）' });
        return k;
      }
      var a = rec(k - 1, id);
      var b = rec(k - 2, id);
      var val = a + b;
      events.push({ type: 'return', id: id, parent: parentId, value: val, note: 'f(' + k + ') = ' + a + ' + ' + b + ' = <b>' + val + '</b>' });
      return val;
    }
    var result = rec(n, null);
    return { nodes: nodes, edges: edges, events: events, result: result, dir: 'v' };
  }

  function buildHanoiTree(n) {
    var nodes = [];
    var edges = [];
    var events = [];
    var seq = 0;
    function rec(k, parentId) {
      var id = 'n' + (seq++);
      nodes.push({ id: id, label: 'h(' + k + ')' });
      if (parentId) edges.push({ from: parentId, to: id });
      events.push({
        type: 'call', id: id, parent: parentId,
        note: '调用 hanoi(' + k + ')：把 ' + k + ' 个盘子从 A 借助 B 移到 C'
      });
      if (k === 1) {
        events.push({ type: 'return', id: id, parent: parentId, value: 1, note: 'hanoi(1)：直接移动 1 个盘子（基线条件）' });
        return 1;
      }
      var a = rec(k - 1, id);
      events.push({ type: 'move', parent: id, note: '把当前最大的盘子从 A 移到 C（这一步不递归，算 1 次移动）' });
      var b = rec(k - 1, id);
      var val = 1 + a + b;
      events.push({ type: 'return', id: id, parent: parentId, value: val, note: 'hanoi(' + k + ') 完成：共 <b>' + val + '</b> 次移动 = 2^' + k + ' - 1' });
      return val;
    }
    var result = rec(n, null);
    return { nodes: nodes, edges: edges, events: events, result: result, dir: 'v' };
  }

  var REC_INFO = {
    factorial: {
      label: '阶乘 factorial(n)', min: 1, max: 7, def: 5, build: buildFactorialTree,
      code: [
        'static int fact(int n) {',
        '    if (n <= 1) return 1;      // 基线条件',
        '    return n * fact(n - 1);    // 递归步骤',
        '}'
      ],
      lesson: '线性递归：调用链是一条直线，返回时从最深处一层层乘回来。'
    },
    fibonacci: {
      label: '斐波那契 fib(n)', min: 2, max: 7, def: 5, build: buildFibTree,
      code: [
        'static int fib(int n) {',
        '    if (n <= 1) return n;              // 基线条件',
        '    return fib(n - 1) + fib(n - 2);    // 两个递归调用',
        '}'
      ],
      lesson: '二叉递归：树里重复的 f(k) 会被反复计算 —— 这正是朴素 fib 慢到爆炸的原因。'
    },
    hanoi: {
      label: '汉诺塔 hanoi(n)', min: 1, max: 4, def: 3, build: buildHanoiTree,
      code: [
        'static void hanoi(int n, char from, char to, char via) {',
        '    if (n == 1) { move(1, from, to); return; }   // 基线条件',
        '    hanoi(n - 1, from, via, to);                 // 先把上面 n-1 个挪走',
        '    move(n, from, to);                           // 移动最大的盘子',
        '    hanoi(n - 1, via, to, from);                 // 再把 n-1 个挪回来',
        '}'
      ],
      lesson: '树里同一个 h(k) 会以不同参数出现两次，所以移动次数是 2^n - 1（指数级）。'
    }
  };

  function initRecursion(root, props, ctx, kit) {
    var state = {
      kind: 'factorial',
      n: REC_INFO.factorial.def,
      tree: null,
      idx: 0,
      active: [],
      done: [],
      ann: {},
      collapsed: {},
      callCount: 0,
      note: '准备就绪：点「播放」看调用树生长，或「下一步」逐次调用/返回。',
      finished: false
    };

    var typeRow = ctl(root);
    var ctrlRow = ctl(root);
    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var codeHost = E('div');
    root.appendChild(codeHost);
    var noteBox = note(root);
    var statBox = stats(root);
    var hint = hintLine(root, '');

    var treeView = viz().tree(stage, { onNodeClick: onNodeClick });

    var nSlider = slider(typeRow, {
      label: 'n', min: REC_INFO.factorial.min, max: REC_INFO.factorial.max, value: state.n,
      onInput: function (v) { state.n = v; reset(); }
    });

    var typeBtns = {};
    Object.keys(REC_INFO).forEach(function (k) {
      typeBtns[k] = button(typeRow, REC_INFO[k].label, function () {
        state.kind = k;
        Object.keys(typeBtns).forEach(function (key) { typeBtns[key].classList.toggle('on', key === k); });
        var info = REC_INFO[k];
        nSlider.input.min = String(info.min);
        nSlider.input.max = String(info.max);
        state.n = Math.max(info.min, Math.min(info.max, info.def));
        nSlider.set(state.n);
        reset();
      });
    });

    var player = makePlayer(function () { return stepOnce(); }, function () { return 420; });
    kit.addPlayer(player);
    player.onIdle = function () { render(); };

    var playBtn = button(ctrlRow, '播放', function () {
      if (state.idx >= state.tree.events.length) reset();
      if (player.playing) {
        player.pause();
        render();
        return;
      }
      player.play();
      render();
    }, { icon: 'play' });
    button(ctrlRow, '下一步', function () {
      player.pause();
      if (state.idx >= state.tree.events.length) {
        noteBox.set('已经完成整个递归过程。点「重置」重看，或把 n 调大看树怎么长。', state.idx + ' / ' + state.tree.events.length + ' 步');
        return;
      }
      stepOnce();
    }, { icon: 'step' });
    button(ctrlRow, '重置', function () { reset(); }, { icon: 'reset' });
    button(ctrlRow, '全部展开', function () {
      state.collapsed = {};
      render();
    });

    function onNodeClick(id) {
      var c = {};
      Object.keys(state.collapsed).forEach(function (k) { c[k] = state.collapsed[k]; });
      if (c[id]) delete c[id];
      else c[id] = true;
      state.collapsed = c;
      render();
    }

    function render() {
      treeView.update({
        nodes: state.tree.nodes,
        edges: state.tree.edges,
        dir: state.tree.dir,
        collapsed: state.collapsed,
        active: state.active,
        done: state.done,
        annotations: state.ann,
        onNodeClick: onNodeClick
      });
      noteBox.set(state.note, state.idx + ' / ' + state.tree.events.length + ' 步');
      statBox.set([
        { label: '调用次数', value: state.callCount, hot: true },
        { label: '已返回', value: state.done.length + ' / ' + state.tree.nodes.length },
        { label: '结果', value: state.finished ? state.tree.result : '计算中…' },
        { label: '节点数', value: state.tree.nodes.length }
      ]);
      setBtnLabel(playBtn, player.playing ? '暂停' : '播放');
    }

    function stepOnce() {
      if (state.idx >= state.tree.events.length) return false;
      var ev = state.tree.events[state.idx];
      state.idx++;
      if (ev.type === 'call') {
        state.active = [ev.id];
        state.callCount++;
      } else if (ev.type === 'return') {
        if (state.done.indexOf(ev.id) < 0) state.done.push(ev.id);
        state.ann[ev.id] = '=' + ev.value;
        state.active = ev.parent ? [ev.parent] : [];
        if (state.idx >= state.tree.events.length) state.finished = true;
      } else {
        state.active = ev.parent ? [ev.parent] : state.active;
      }
      state.note = ev.note;
      render();
      return state.idx < state.tree.events.length;
    }

    function reset() {
      player.pause();
      var info = REC_INFO[state.kind];
      state.tree = info.build(state.n);
      state.idx = 0;
      state.active = [];
      state.done = [];
      state.ann = {};
      state.collapsed = {};
      state.callCount = 0;
      state.finished = false;
      state.note = '准备就绪：' + info.lesson + ' 点「播放」开始，或点节点折叠子树。';
      codeHost.innerHTML = '';
      codeBlock(codeHost, info.code);
      hint.textContent = info.lesson + ' 调用树里节点左上角的 + / − 表示折叠状态，点节点即可切换。';
      render();
    }

    state.kind = 'factorial';
    typeBtns.factorial.classList.add('on');
    reset();
  }

  LABS.recursion = {
    title: '递归调用树',
    desc: '阶乘 / 斐波那契 / 汉诺塔的调用树：看它怎么长、返回值怎么回溯、为什么 fib 会重复计算',
    tags: ['ch12'],
    icon: 'function',
    order: 8,
    init: lab(initRecursion)
  };

  /* =====================================================================
   * 9. bigo —— 复杂度增长曲线（多选函数 + n 滑块 + 线性/对数坐标）
   * ===================================================================== */
  var BIGO_FUNCS = [
    { key: 'one', label: 'O(1)', fn: function () { return 1; }, dash: null, hi: true },
    { key: 'log', label: 'O(log n)', fn: function (n) { return Math.log2(Math.max(1, n)); }, dash: '5 3', hi: false },
    { key: 'n', label: 'O(n)', fn: function (n) { return n; }, dash: null, hi: false },
    { key: 'nlogn', label: 'O(n log n)', fn: function (n) { return n * Math.log2(Math.max(2, n)); }, dash: '5 3', hi: true },
    { key: 'n2', label: 'O(n²)', fn: function (n) { return n * n; }, dash: '2 3', hi: false },
    { key: 'pow2', label: 'O(2ⁿ)', fn: function (n) { return Math.pow(2, n); }, dash: '2 3', hi: true }
  ];

  /** 按“每秒 10^8 次基本操作”把操作数换算成人类可读的耗时 */
  function opsTimeText(ops) {
    if (!(ops > 0)) return '—';
    var sec = ops / 1e8;
    if (sec < 1e-6) return '不到 1 微秒';
    if (sec < 1e-3) return (sec * 1e6).toFixed(1) + ' 微秒';
    if (sec < 1) return (sec * 1e3).toFixed(1) + ' 毫秒';
    if (sec < 60) return sec.toFixed(1) + ' 秒';
    if (sec < 3600) return (sec / 60).toFixed(1) + ' 分钟';
    if (sec < 86400) return (sec / 3600).toFixed(1) + ' 小时';
    if (sec < 31536000) return (sec / 86400).toFixed(1) + ' 天';
    var years = sec / 31536000;
    if (years < 10000) return Math.round(years) + ' 年';
    return fmt(years) + ' 年';
  }

  function initBigo(root, props, ctx, kit) {
    var state = {
      n: 32,
      selected: { n: true, nlogn: true, n2: true },
      logY: false
    };

    var funcRow = ctl(root);
    var ctrlRow = ctl(root);
    var chartHost = E('div', { class: 'labStage' });
    root.appendChild(chartHost);
    var tableHost = E('div');
    root.appendChild(tableHost);
    var noteBox = note(root);
    var statBox = stats(root);
    var hint = hintLine(root, '曲线挤在底部？切到「对数坐标」：每条线变成直线，斜率就是它的增长速度。');

    var chart = viz().lineChart(chartHost, {});
    var btnMap = {};

    BIGO_FUNCS.forEach(function (f) {
      var b = button(funcRow, f.label, function () {
        state.selected[f.key] = !state.selected[f.key];
        b.classList.toggle('on', !!state.selected[f.key]);
        render();
      });
      btnMap[f.key] = b;
    });

    var nSlider = slider(ctrlRow, {
      label: 'n', min: 1, max: 64, value: state.n,
      onInput: function (v) { state.n = v; render(); }
    });

    var axisBtn = button(ctrlRow, '切换对数坐标', function () {
      state.logY = !state.logY;
      setBtnLabel(axisBtn, state.logY ? '切换线性坐标' : '切换对数坐标');
      render();
    });

    button(ctrlRow, '重置', function () {
      state.n = 32;
      state.selected = { n: true, nlogn: true, n2: true };
      state.logY = false;
      nSlider.set(state.n);
      Object.keys(btnMap).forEach(function (k) { btnMap[k].classList.toggle('on', !!state.selected[k]); });
      setBtnLabel(axisBtn, '切换对数坐标');
      render();
    }, { icon: 'reset' });

    button(ctrlRow, '下一步（n+1）', function () {
      state.n = state.n >= 64 ? 1 : state.n + 1;
      nSlider.set(state.n);
      render();
      noteBox.set('n 增加到 <b>' + state.n + '</b>：横轴上的点右移一格，注意 n² 和 2ⁿ 的操作数涨得有多快。', '');
    }, { icon: 'step' });

    function selectedFuncs() {
      return BIGO_FUNCS.filter(function (f) { return state.selected[f.key]; });
    }

    function renderChart(funcs) {
      var series = funcs.map(function (f) {
        var pts = [];
        for (var x = 1; x <= 64; x++) pts.push([x, f.fn(x)]);
        return { name: f.label, points: pts, hi: f.hi, dash: f.dash };
      });
      var maxY = 1;
      series.forEach(function (s) {
        s.points.forEach(function (p) { if (p[1] > maxY) maxY = p[1]; });
      });
      chart.update({
        series: series,
        logY: state.logY,
        xMin: 1,
        xMax: 64,
        xTicks: 5,
        yTicks: 4,
        xLabel: 'n',
        yLabel: '操作数（近似）'
      });
      return maxY;
    }

    function renderTable(funcs) {
      tableHost.innerHTML = '';
      var wrap = E('div', { class: 'tableWrap' });
      var table = E('table');
      var thead = E('thead');
      var htr = E('tr');
      ['复杂度', 'n = ' + state.n + ' 时操作数', '按每秒 10^8 次估算'].forEach(function (h) {
        htr.appendChild(E('th', { text: h }));
      });
      thead.appendChild(htr);
      var tbody = E('tbody');
      funcs.forEach(function (f) {
        var ops = f.fn(state.n);
        var tr = E('tr');
        tr.appendChild(E('td', { text: f.label }));
        tr.appendChild(E('td', { class: 'mono', text: fmt(ops) }));
        tr.appendChild(E('td', { text: opsTimeText(ops) }));
        tbody.appendChild(tr);
      });
      table.appendChild(thead);
      table.appendChild(tbody);
      wrap.appendChild(table);
      tableHost.appendChild(wrap);
    }

    function render() {
      var funcs = selectedFuncs();
      var maxY = renderChart(funcs);
      renderTable(funcs);
      var parts = funcs.map(function (f) {
        return f.label + ' = <b>' + fmt(f.fn(state.n)) + '</b>';
      });
      if (!funcs.length) {
        noteBox.set('至少勾选一个复杂度函数，才能画出曲线。', '');
      } else {
        noteBox.set('n = ' + state.n + ' 时：' + parts.join('，') +
          '。把 n 拖到 64：O(n²) 变成 4096，而 O(2ⁿ) 已经大到无法直视。', '');
      }
      statBox.set([
        { label: 'n', value: state.n, hot: true },
        { label: '选中函数', value: funcs.length },
        { label: '最大操作数', value: fmt(maxY) },
        { label: '坐标', value: state.logY ? '对数' : '线性' }
      ]);
    }

    Object.keys(btnMap).forEach(function (k) { btnMap[k].classList.toggle('on', !!state.selected[k]); });
    render();
  }

  LABS.bigo = {
    title: '复杂度增长曲线',
    desc: '勾选 O(1)/log n/n/n log n/n²/2ⁿ，拖动 n 看操作数与「要算多久」，切对数坐标看斜率',
    tags: ['ch13'],
    icon: 'chart',
    order: 9,
    init: lab(initBigo)
  };

  /* =====================================================================
   * 10. doubling —— 倍增法：输入实测数据，自动拟合复杂度
   * ===================================================================== */
  var DOUBLING_SETS = {
    quad: {
      label: '平方级 ×4',
      points: [[1000, 1.2], [2000, 4.9], [4000, 19.5], [8000, 78.1]]
    },
    linear: {
      label: '线性级 ×2',
      points: [[1000, 1.1], [2000, 2.3], [4000, 4.5], [8000, 9.2]]
    },
    nlogn: {
      label: 'n log n 级',
      points: [[1000, 1.0], [2000, 2.2], [4000, 4.6], [8000, 9.7]]
    },
    exp: {
      label: '指数级',
      points: [[10, 0.001], [20, 1.05], [30, 1074], [40, 1099512]]
    }
  };

  /** 倍增法分析：把每组相邻数据折算成「n 翻倍时的时间倍数」，再归类 */
  function analyzeDoubling(points) {
    var valid = points.filter(function (p) {
      return p && p[0] > 0 && p[1] > 0;
    }).sort(function (a, b) { return a[0] - b[0]; });
    if (valid.length < 2) return null;
    var pairs = [];
    for (var i = 1; i < valid.length; i++) {
      var n1 = valid[i - 1][0];
      var t1 = valid[i - 1][1];
      var n2 = valid[i][0];
      var t2 = valid[i][1];
      if (n2 <= n1) continue;
      var ratio = t2 / t1;
      var step = Math.log(n2 / n1) / Math.log(2);
      var perDouble = Math.pow(ratio, 1 / (step || 1));
      pairs.push({
        n1: n1, n2: n2, t1: t1, t2: t2,
        ratio: ratio, step: step, perDouble: perDouble,
        k: Math.log(ratio) / Math.log(n2 / n1)
      });
    }
    if (!pairs.length) return null;

    var last = pairs[pairs.length - 1];
    var pd = last.perDouble;
    var guess;
    var why;
    if (pd <= 1.3) {
      guess = 'O(1) 或 O(log n)';
      why = 'n 翻倍后耗时几乎没变，说明规模对操作数影响很小。';
    } else if (pd <= 1.75) {
      guess = '比 log n 快、比 n 慢（可能是噪声）';
      why = '耗时增长明显慢于 n，但数据不够干净——多测几组会更准。';
    } else if (pd <= 2.12) {
      guess = 'O(n)';
      why = 'n 翻倍、耗时也翻倍（约 ×2），操作数与 n 成正比。';
    } else if (pd <= 2.6) {
      guess = 'O(n log n)';
      why = 'n 翻倍、耗时 ×2.1~2.2 —— 多出来的一点点就是 log n 的贡献。';
    } else if (pd <= 3.3) {
      guess = 'O(n log n) 与 O(n²) 之间';
      why = '增长比 n log n 快、比 n² 慢，可能是数据波动或常数项影响。';
    } else if (pd <= 5.2) {
      guess = 'O(n²)';
      why = 'n 翻倍、耗时约 ×4 —— 操作数按 n 的平方增长。';
    } else if (pd <= 11) {
      guess = 'O(n³) 或更高';
      why = 'n 翻倍、耗时 ×8 左右，接近立方级。';
    } else {
      guess = 'O(2ⁿ) 或更高（指数级）';
      why = 'n 只翻一倍，耗时却涨了几个数量级 —— 典型的指数爆炸，n 稍大就跑不动。';
    }
    return { pairs: pairs, last: last, k: last.k, guess: guess, why: why, points: valid };
  }

  function initDoubling(root, props, ctx, kit) {
    var state = { setKey: 'quad', hiPair: -1 };

    var presetRow = ctl(root);
    var inputHost = E('div');
    root.appendChild(inputHost);
    var chartHost = E('div', { class: 'labStage' });
    root.appendChild(chartHost);
    var resultBox = E('div', { class: 'labNote' });
    root.appendChild(resultBox);
    var tableHost = E('div');
    root.appendChild(tableHost);
    var noteBox = note(root);
    var statBox = stats(root);
    hintLine(root, '倍增法：让 n 翻倍，看耗时变成几倍。×1 → 常数/对数，×2 → 线性，×2.2 → n log n，×4 → 平方，×8 → 立方，暴涨 → 指数。');

    var chart = viz().lineChart(chartHost, {});
    var inputRows = [];

    function buildInputs() {
      inputHost.innerHTML = '';
      var wrap = E('div', { class: 'tableWrap' });
      var table = E('table');
      var thead = E('thead');
      var htr = E('tr');
      htr.appendChild(E('th', { text: '数据' }));
      for (var c = 0; c < 4; c++) htr.appendChild(E('th', { text: '第 ' + (c + 1) + ' 组' }));
      thead.appendChild(htr);
      var tbody = E('tbody');
      var trN = E('tr');
      trN.appendChild(E('th', { text: 'n' }));
      var trT = E('tr');
      trT.appendChild(E('th', { text: '耗时（秒）' }));
      for (var i = 0; i < 4; i++) {
        var tdN = E('td');
        var nIn = E('input', { class: 'labNum', type: 'number', min: 1, step: 1, value: '' });
        var tdT = E('td');
        var tIn = E('input', { class: 'labNum', type: 'number', min: 0, step: 0.1, value: '' });
        nIn.setAttribute('aria-label', 'n');
        tIn.setAttribute('aria-label', '耗时');
        tdN.appendChild(nIn);
        tdT.appendChild(tIn);
        trN.appendChild(tdN);
        trT.appendChild(tdT);
        inputRows.push({ n: nIn, t: tIn });
        nIn.addEventListener('input', recompute);
        tIn.addEventListener('input', recompute);
      }
      tbody.appendChild(trN);
      tbody.appendChild(trT);
      table.appendChild(thead);
      table.appendChild(tbody);
      wrap.appendChild(table);
      inputHost.appendChild(wrap);
    }

    function setPoints(points) {
      for (var i = 0; i < inputRows.length; i++) {
        var p = points[i];
        inputRows[i].n.value = p ? String(p[0]) : '';
        inputRows[i].t.value = p ? String(p[1]) : '';
      }
    }

    function readPoints() {
      return inputRows.map(function (row) {
        return [Number(row.n.value), Number(row.t.value)];
      }).filter(function (p) {
        return p[0] > 0 && p[1] > 0 && !isNaN(p[0]) && !isNaN(p[1]);
      });
    }

    function renderTable(res) {
      tableHost.innerHTML = '';
      var wrap = E('div', { class: 'tableWrap' });
      var table = E('table');
      var thead = E('thead');
      var htr = E('tr');
      ['n 变化', '耗时倍数', '折算成 n 翻倍', '估计指数 k'].forEach(function (h) {
        htr.appendChild(E('th', { text: h }));
      });
      thead.appendChild(htr);
      var tbody = E('tbody');
      if (!res) {
        var tr0 = E('tr');
        var td0 = E('td', { colspan: '4' });
        td0.appendChild(E('span', { class: 'varEmpty', text: '至少填写两组有效数据（n 和耗时都大于 0）。' }));
        tr0.appendChild(td0);
        tbody.appendChild(tr0);
      } else {
        res.pairs.forEach(function (p, idx) {
          var tr = E('tr');
          tr.appendChild(E('td', { class: 'mono', text: p.n1 + ' → ' + p.n2 }));
          tr.appendChild(E('td', { class: 'mono', text: '×' + p.ratio.toFixed(2) }));
          tr.appendChild(E('td', { class: 'mono', text: '×' + p.perDouble.toFixed(2) }));
          tr.appendChild(E('td', { class: 'mono', text: 'k ≈ ' + p.k.toFixed(2) }));
          if (idx === state.hiPair) {
            Array.prototype.forEach.call(tr.childNodes, function (td) {
              td.innerHTML = '<b>' + esc(td.textContent) + '</b>';
            });
          }
          tbody.appendChild(tr);
        });
      }
      table.appendChild(thead);
      table.appendChild(tbody);
      wrap.appendChild(table);
      tableHost.appendChild(wrap);
    }

    function recompute() {
      var pts = readPoints();
      var res = analyzeDoubling(pts);

      var sorted = pts.slice().sort(function (a, b) { return a[0] - b[0]; });
      chart.update({
        series: [{ points: sorted, hi: true, dots: true }],
        xLabel: 'n',
        yLabel: '耗时（秒）',
        yMin: 0
      });

      if (!res) {
        resultBox.innerHTML = '<b>推断</b> <span class="dim">至少填写两组有效数据（n 和耗时都大于 0）</span>';
        state.hiPair = -1;
      } else {
        if (state.hiPair >= res.pairs.length) state.hiPair = -1;
        resultBox.innerHTML = '<b>推断：' + esc(res.guess) + '</b>　' + esc(res.why) +
          '　（最后一组：n ' + res.last.n1 + ' → ' + res.last.n2 + '，耗时 ×' + res.last.ratio.toFixed(2) +
          '，log-log 斜率 k ≈ ' + res.k.toFixed(2) + '）';
      }
      renderTable(res);
      statBox.set([
        { label: '有效数据', value: pts.length + ' 组' },
        { label: '最后一组倍数', value: res ? '×' + res.last.ratio.toFixed(2) : '—' },
        { label: '估计指数 k', value: res ? res.k.toFixed(2) : '—', hot: true },
        { label: '推断', value: res ? res.guess : '数据不足' }
      ]);
      noteBox.set(res
        ? '倍增法只看一组数据容易误判，看“折算成 n 翻倍”这一列是否稳定：稳定说明复杂度确实是幂函数；突然变大通常意味着碰到了指数级。'
        : '把 n 翻倍后的耗时填进去，就能反推复杂度。', '');
    }

    function applyPreset(key) {
      state.setKey = key;
      setPoints(DOUBLING_SETS[key].points);
      Object.keys(presetBtns).forEach(function (k) {
        presetBtns[k].classList.toggle('on', k === key);
      });
      recompute();
    }

    var presetBtns = {};
    Object.keys(DOUBLING_SETS).forEach(function (k) {
      presetBtns[k] = button(presetRow, DOUBLING_SETS[k].label, function () { applyPreset(k); });
    });
    button(presetRow, '重置', function () { applyPreset('quad'); }, { icon: 'reset' });

    button(presetRow, '下一步', function () {
      var res = analyzeDoubling(readPoints());
      if (!res) {
        noteBox.set('至少需要两组有效数据才能分析。', '');
        return;
      }
      state.hiPair = (state.hiPair + 1) % res.pairs.length;
      var p = res.pairs[state.hiPair];
      renderTable(res);
      noteBox.set('第 ' + (state.hiPair + 1) + ' 对相邻数据：n 从 ' + p.n1 + ' 到 ' + p.n2 + '（翻了 ' +
        p.step.toFixed(1) + ' 倍），耗时变成 ×' + p.ratio.toFixed(2) + '，折算成 n 翻倍是 ×' +
        p.perDouble.toFixed(2) + '，log-log 斜率 k ≈ ' + p.k.toFixed(2) + '。', '');
    }, { icon: 'step' });

    buildInputs();
    applyPreset('quad');
  }

  LABS.doubling = {
    title: '倍增法推断复杂度',
    desc: '把实测的 n 与耗时填进去，自动算「n 翻倍 → 时间几倍」，反推是 O(n)、O(n log n) 还是 O(n²)',
    tags: ['ch13'],
    icon: 'chart',
    order: 10,
    init: lab(initDoubling)
  };

  /* =====================================================================
   * 11. string —— 字符串可视化（索引 / 拼接 / substring / equals vs ==）
   * ===================================================================== */
  function initString(root, props, ctx, kit) {
    var state = {
      str: 'hello',
      start: 0,
      end: 5,
      selected: null,
      walk: -1
    };

    var inputRow = ctl(root);
    var strInput = textInput(inputRow, {
      value: state.str, maxlength: 12, placeholder: '输入英文短字符串',
      onInput: function (v) {
        state.str = v;
        state.walk = -1;
        state.selected = null;
        clampRange();
        render();
      }
    });
    button(inputRow, '重置为 "hello"', function () {
      state.str = 'hello';
      strInput.value = state.str;
      state.walk = -1;
      state.selected = null;
      clampRange();
      render();
    }, { icon: 'reset' });

    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var boxes = viz().arrayBoxes(stage, { onCell: onCell });

    var opRow = ctl(root);
    var startSlider = slider(opRow, {
      label: 'start', min: 0, max: 5, value: state.start,
      onInput: function (v) { state.start = v; clampRange(); render(); }
    });
    var endSlider = slider(opRow, {
      label: 'end', min: 0, max: 5, value: state.end,
      onInput: function (v) { state.end = v; clampRange(); render(); }
    });
    button(opRow, 'charAt(length) 越界', function () {
      var len = state.str.length;
      noteBox.set('s.charAt(' + len + ') 会抛 <b>StringIndexOutOfBoundsException</b>：length 是 ' + len +
        '，但最大合法下标只有 ' + (len - 1) + '。', '越界演示');
    });
    button(opRow, 's + "!" 拼接', function () {
      var old = state.str;
      state.str = old + '!';
      strInput.value = state.str;
      state.walk = -1;
      clampRange();
      render();
      noteBox.set('s + "!" 创建了<b>新字符串</b> "' + esc(state.str) + '"（String 不可变），原来 "' +
        esc(old) + '" 那个对象并没有被修改。', '拼接');
    });

    /* 单步：逐个字符演示索引 */
    button(opRow, '下一步', function () {
      var len = state.str.length;
      if (!len) {
        noteBox.set('先输入一串字符。', '');
        return;
      }
      state.walk = ((state.walk == null ? -1 : state.walk) + 1) % len;
      state.selected = state.walk;
      render();
      noteBox.set('单步索引：<b>s.charAt(' + state.walk + ') = \'' + esc(state.str.charAt(state.walk)) + '\'</b>　' +
        '这是第 ' + (state.walk + 1) + ' 个字符，下标 ' + state.walk + '。length = ' + len + '，最后一个合法下标是 ' + (len - 1) + '。',
        (state.walk + 1) + ' / ' + len);
    }, { icon: 'step' });

    var eqRow = ctl(root);
    var eqA = textInput(eqRow, { value: 'hi', maxlength: 8, placeholder: 'a =' });
    var eqMode = selectBox(eqRow, [
      { value: 'literal', label: 'a、b 都是字面量' },
      { value: 'newString', label: 'b = new String(a)' }
    ], 'literal', function () { compareEq(); });
    var eqB = textInput(eqRow, { value: 'hi', maxlength: 8, placeholder: 'b =' });
    button(eqRow, '比较 a 与 b', function () { compareEq(); });

    var noteBox = note(root);
    var statBox = stats(root);
    var hint = hintLine(root, '');

    function onCell(i) {
      state.selected = i;
      render();
      noteBox.set('s.charAt(' + i + ') → <b>\'' + esc(state.str.charAt(i)) + '\'</b>　字符用 <code>char</code>，' +
        '字面量用单引号；字符串用 <code>String</code>，字面量用双引号。', '');
    }

    function clampRange() {
      var len = state.str.length;
      state.start = Math.max(0, Math.min(state.start, len));
      state.end = Math.max(0, Math.min(state.end, len));
      if (state.start > state.end) state.start = state.end;
      startSlider.input.max = String(len);
      endSlider.input.max = String(len);
      startSlider.set(state.start);
      endSlider.set(state.end);
    }

    function compareEq() {
      var a = eqA.value;
      var b = eqB.value;
      var mode = eqMode.value;
      var sameContent = a === b;
      var sameRef = mode === 'literal' ? sameContent : false;
      noteBox.set(
        '<b>a.equals(b)</b> → ' + (sameContent ? 'true' : 'false') +
        '　<b>a == b</b> → ' + (sameRef ? 'true' : 'false') + '　' +
        (sameRef
          ? '两个变量指向字符串常量池里的同一个对象。'
          : (sameContent
            ? '内容相同，但 b 是 new 出来的<b>另一个对象</b>，所以 == 是 false —— 字符串比较必须用 equals。'
            : '内容不同：equals 和 == 都是 false。')), 'equals vs ==');
    }

    function render() {
      var chars = state.str.split('');
      var changed = [];
      var i;
      for (i = state.start; i < state.end; i++) {
        if (i >= 0 && i < chars.length) changed.push(i);
      }
      boxes.update({
        values: chars,
        changed: changed,
        selected: state.selected,
        onCell: onCell
      });
      var sub = state.str.slice(state.start, state.end);
      hint.textContent = 's.substring(' + state.start + ', ' + state.end + ') = "' + sub + '"（含 start、不含 end）　length = ' + chars.length;
      statBox.set([
        { label: 'length', value: chars.length, hot: true },
        { label: '合法下标', value: chars.length ? '0 ~ ' + (chars.length - 1) : '（空字符串）' },
        { label: 'substring', value: '"' + sub + '"' },
        { label: 'start / end', value: state.start + ' / ' + state.end }
      ]);
    }

    clampRange();
    render();
    noteBox.set('字符串 = 一串字符 + 一个 length；下标从 0 开始。<b>length()</b> 是方法调用，数组的 length 是属性。', '');
    compareEq();
  }

  LABS.string = {
    title: '字符串可视化',
    desc: '把字符串拆成字符格子：索引、substring、拼接产生新对象，以及 equals 与 == 的本质区别',
    tags: ['ch02'],
    icon: 'code',
    order: 11,
    init: lab(initString)
  };

  /* =====================================================================
   * 12. collections —— ArrayList vs LinkedList vs HashMap 的操作成本
   * ===================================================================== */
  var COLL_BASE = ['A', 'B', 'C', 'D', 'E'];
  var COLL_OPS = [
    { key: 'append', label: '添加到末尾' },
    { key: 'insertHead', label: '插入到头部' },
    { key: 'get', label: '按下标访问 i = 2' },
    { key: 'search', label: '按值查找 "D"' },
    { key: 'removeHead', label: '删除第一个元素' }
  ];
  var COLL_COSTS = {
    append: { array: 'O(1) 摊销', linked: 'O(1)（有 tail）', hash: 'put 平均 O(1)' },
    insertHead: { array: 'O(n)（全体右移）', linked: 'O(1)（改指针）', hash: '没有“头部”概念' },
    get: { array: 'O(1)（算地址）', linked: 'O(n)（走链表）', hash: '要用 key，不能按索引' },
    search: { array: 'O(n)', linked: 'O(n)', hash: '按键 get 平均 O(1)' },
    removeHead: { array: 'O(n)（全体左移）', linked: 'O(1)（改 head）', hash: 'remove 平均 O(1)' }
  };
  var COLL_STRUCTS = [
    { key: 'array', label: 'ArrayList' },
    { key: 'linked', label: 'LinkedList' },
    { key: 'hash', label: 'HashMap' }
  ];

  function collHashBucket(key) {
    var h = 0;
    for (var i = 0; i < key.length; i++) {
      h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
    }
    return ((h % 8) + 8) % 8;
  }

  /** 生成操作演示步骤：changed = 被访问/移动的下标；applyData = 该步之后的数据 */
  function buildCollSteps(structure, opKey, data) {
    var steps = [];
    var n = data.length;
    var i;

    if (opKey === 'append') {
      if (structure === 'array') {
        steps.push({ note: 'ArrayList.add("F")：直接在 size 位置写入，一次赋值。', changed: [n - 1] });
        steps.push({ note: '尾部满了才会扩容：申请新数组、拷贝全部元素 —— 摊销到每次是 O(1)，但偶尔一次是 O(n)。', changed: [n - 1] });
      } else if (structure === 'linked') {
        steps.push({ note: 'LinkedList.add("F")：有 tail 指针，新建节点挂在末尾，改两个指针就行。', changed: [n - 1] });
      } else {
        steps.push({ note: 'HashMap.put("keyF", 6)：算 hash → 定位桶 → 放入键值对，平均 O(1)。', changed: [n - 1] });
      }
      steps[steps.length - 1].applyData = data.concat(['F']);
    } else if (opKey === 'insertHead') {
      if (structure === 'array') {
        for (i = n - 1; i >= 0; i--) {
          steps.push({ note: '下标 ' + i + ' 的 "' + data[i] + '" 右移到 ' + (i + 1) + '，给新元素腾位置。', changed: [i] });
        }
        steps.push({ note: '所有 ' + n + ' 个元素都要移动 → O(n)。', changed: [0] });
      } else if (structure === 'linked') {
        steps.push({ note: 'LinkedList 头插：新建节点 → 它的 next 指向原 head → head 改指向它。只动指针，O(1)。', changed: [0] });
      } else {
        steps.push({ note: 'HashMap 里没有“头部插入”：键值对按 hash 存放，顺序没有意义。', changed: [] });
      }
      steps[steps.length - 1].applyData = ['F'].concat(data);
    } else if (opKey === 'get') {
      if (structure === 'array') {
        steps.push({ note: 'ArrayList.get(2)：地址 = 起始地址 + 2 × 元素大小，一步算出 → O(1)。', changed: [2] });
      } else if (structure === 'linked') {
        for (i = 0; i <= 2; i++) {
          steps.push({ note: 'LinkedList.get(2)：从 head 出发，沿着 next 走到第 ' + (i + 1) + ' 个节点（下标 ' + i + '）。', changed: [i] });
        }
        steps.push({ note: '必须一个个节点走 → O(n)。这就是 LinkedList 随机访问慢的原因。', changed: [2] });
      } else {
        steps.push({ note: 'HashMap 不支持按下标取值：要用 key 查，get(key) 平均 O(1)。', changed: [] });
      }
    } else if (opKey === 'search') {
      var target = 'D';
      var found = data.indexOf(target);
      if (found < 0) found = 0;
      if (structure === 'array' || structure === 'linked') {
        for (i = 0; i <= found; i++) {
          steps.push({
            note: '访问下标 ' + i + ' 的 "' + data[i] + '" 与 "' + target + '" 比较：' +
              (data[i] === target ? '相等，找到了' : '不等，继续'),
            changed: [i]
          });
        }
        steps.push({ note: '按值查找只能逐个比较 → O(n)，ArrayList 和 LinkedList 都一样。', changed: [found] });
      } else {
        steps.push({ note: 'HashMap 按 key 查找：算 "keyD" 的 hash → 定位桶 → 桶里比较 key.equals，平均 O(1)。', changed: [] });
      }
    } else {
      if (structure === 'array') {
        for (i = 1; i < n; i++) {
          steps.push({ note: '下标 ' + i + ' 的 "' + data[i] + '" 左移到 ' + (i - 1) + '，补上空位。', changed: [i] });
        }
        steps.push({ note: '删除头部要移动 ' + (n - 1) + ' 个元素 → O(n)。', changed: [0] });
      } else if (structure === 'linked') {
        steps.push({ note: 'LinkedList 删头：head = head.next，一次指针操作 → O(1)。', changed: [0] });
      } else {
        steps.push({ note: 'HashMap.remove(key)：定位桶后删除条目，平均 O(1)。', changed: [] });
      }
      steps[steps.length - 1].applyData = data.slice(1);
    }
    return steps;
  }

  function initCollections(root, props, ctx, kit) {
    var state = {
      structure: 'array',
      op: 'append',
      data: COLL_BASE.slice(),
      baseData: COLL_BASE.slice(),
      steps: [],
      idx: 0,
      changed: [],
      note: '选一个结构和操作，点「演示」看它实际做了多少步。'
    };

    var structRow = ctl(root);
    var opRow = ctl(root);
    var stage = E('div', { class: 'labStage' });
    root.appendChild(stage);
    var costHost = E('div');
    root.appendChild(costHost);
    var noteBox = note(root);
    var statBox = stats(root);
    var hint = hintLine(root, '');

    var boxes = null;
    var structBtns = {};
    var structLabel = { array: 'ArrayList', linked: 'LinkedList', hash: 'HashMap' };

    COLL_STRUCTS.forEach(function (s) {
      structBtns[s.key] = button(structRow, s.label, function () {
        state.structure = s.key;
        Object.keys(structBtns).forEach(function (k) { structBtns[k].classList.toggle('on', k === s.key); });
        resetToStart();
      });
    });

    var opSelect = selectBox(opRow, COLL_OPS.map(function (o) {
      return { value: o.key, label: o.label };
    }), state.op, function (v) {
      state.op = v;
      resetToStart();
    });

    var player = makePlayer(function () { return stepOnce(); }, function () { return 680; });
    kit.addPlayer(player);
    player.onIdle = function () { render(); };

    var playBtn = button(opRow, '演示', function () {
      player.pause();
      state.steps = [];
      prepare();
      player.play();
      render();
    }, { icon: 'play' });
    button(opRow, '下一步', function () {
      player.pause();
      if (state.idx >= state.steps.length) state.steps = [];
      prepare();
      stepOnce();
    }, { icon: 'step' });
    button(opRow, '重置', function () { resetToStart(); }, { icon: 'reset' });

    function resetToStart() {
      player.pause();
      state.steps = [];
      state.data = state.baseData.slice();
      state.idx = 0;
      state.changed = [];
      state.note = '已重置。点「演示」或「下一步」开始：' + opLabel() + ' · ' + structLabel[state.structure];
      renderVisual();
      renderCosts();
      render();
    }

    function opLabel() {
      var found = null;
      COLL_OPS.forEach(function (o) { if (o.key === state.op) found = o.label; });
      return found || '';
    }

    function prepare() {
      if (!state.steps.length) {
        state.data = state.baseData.slice();
        state.steps = buildCollSteps(state.structure, state.op, state.data);
        state.idx = 0;
        state.changed = [];
      }
    }

    function stepOnce() {
      if (!state.steps.length) prepare();
      if (state.idx >= state.steps.length) return false;
      var st = state.steps[state.idx];
      state.idx++;
      state.changed = st.changed || [];
      state.note = st.note;
      if (st.applyData) state.data = st.applyData.slice();
      renderVisual();
      render();
      return state.idx < state.steps.length;
    }

    function renderVisual() {
      if (state.structure === 'array') {
        if (!boxes) boxes = viz().arrayBoxes(stage, {});
        boxes.update({ values: state.data, changed: state.changed });
      } else if (state.structure === 'linked') {
        /* 切到非 SVG 视图前销毁 viz 组件，否则切回来时 stage 已清空、组件不会自动重建 */
        if (boxes) { boxes.destroy(); boxes = null; }
        stage.innerHTML = '';
        var wrap = E('div', { class: 'labCtl' });
        state.data.forEach(function (v, i) {
          if (i > 0) wrap.appendChild(E('span', { class: 'dim', text: '→' }));
          wrap.appendChild(E('span', {
            class: 'pill' + (state.changed.indexOf(i) >= 0 ? ' ok' : (i === 0 ? ' info' : '')),
            text: v
          }));
        });
        wrap.appendChild(E('span', { class: 'dim', text: '→ null' }));
        stage.appendChild(wrap);
      } else {
        if (boxes) { boxes.destroy(); boxes = null; }
        stage.innerHTML = '';
        var wrap2 = E('div', { class: 'labCtl' });
        state.data.forEach(function (v, i) {
          var key = 'key' + String.fromCharCode(65 + i);
          wrap2.appendChild(E('span', {
            class: 'pill' + (state.changed.indexOf(i) >= 0 ? ' ok' : ''),
            text: key + ' → 桶 ' + collHashBucket(key)
          }));
        });
        stage.appendChild(wrap2);
      }
    }

    function renderCosts() {
      costHost.innerHTML = '';
      var wrap = E('div', { class: 'tableWrap' });
      var table = E('table');
      var thead = E('thead');
      var htr = E('tr');
      ['操作', 'ArrayList', 'LinkedList', 'HashMap'].forEach(function (h) {
        htr.appendChild(E('th', { text: h }));
      });
      thead.appendChild(htr);
      var tbody = E('tbody');
      COLL_OPS.forEach(function (op) {
        var active = op.key === state.op;
        var tr = E('tr');
        var cells = [op.label, COLL_COSTS[op.key].array, COLL_COSTS[op.key].linked, COLL_COSTS[op.key].hash];
        cells.forEach(function (text) {
          tr.appendChild(E('td', { html: active ? '<b>' + esc(text) + '</b>' : esc(text) }));
        });
        tbody.appendChild(tr);
      });
      table.appendChild(thead);
      table.appendChild(tbody);
      wrap.appendChild(table);
      costHost.appendChild(wrap);
    }

    function render() {
      var cost = COLL_COSTS[state.op][state.structure];
      hint.textContent = '当前：' + opLabel() + ' · ' + structLabel[state.structure] + ' → ' + cost +
        '。对比表格里加粗的那一行，就是你现在正在演示的操作。';
      noteBox.set(state.note, state.idx + ' / ' + (state.steps.length || '—') + ' 步');
      statBox.set([
        { label: '结构', value: structLabel[state.structure], hot: true },
        { label: '操作', value: opLabel() },
        { label: '已执行步骤', value: state.idx },
        { label: '元素数', value: state.data.length }
      ]);
      setBtnLabel(playBtn, player.playing ? '暂停' : '演示');
      renderCosts();
    }

    structBtns.array.classList.add('on');
    resetToStart();
  }

  LABS.collections = {
    title: 'ArrayList vs LinkedList vs HashMap',
    desc: '同一个操作在三种结构里各要走几步：插入、下标访问、按值查找、删除，成本一眼对比',
    tags: ['ch10'],
    icon: 'layers',
    order: 12,
    init: lab(initCollections)
  };

  /* =====================================================================
   * 13. oop —— 构造器 → 字段 → 对象卡；继承链与方法派发
   * ===================================================================== */
  var OOP_CLASSES = {
    Point: {
      label: 'Point', chain: [], fields: ['x', 'y'], superFields: [],
      defaults: { x: 3, y: 4 },
      summary: '没有继承的简单类：构造器把参数写进字段，new 出来就是一个独立对象。'
    },
    Person: {
      label: 'Person', chain: [], fields: ['name', 'age'], superFields: [],
      defaults: { name: 'Ann', age: 20 },
      summary: '基类：字段 name / age。Student 可以 extends 它并复用这些字段。'
    },
    Student: {
      label: 'Student', chain: ['Person'], fields: ['name', 'age', 'id'], superFields: ['name', 'age'],
      defaults: { name: 'Ann', age: 20, id: 1001 },
      summary: '继承 Person：构造器先 super(name, age) 构造父类那部分，再给 id 赋值。'
    },
    GradStudent: {
      label: 'GradStudent', chain: ['Student', 'Person'], fields: ['name', 'age', 'id', 'major'],
      superFields: ['name', 'age', 'id'],
      defaults: { name: 'Ann', age: 20, id: 1001, major: 'CS' },
      summary: '再继承 Student：super(...) 沿继承链一路构造下来，最终对象包含所有祖先的字段。'
    }
  };

  var OOP_PHASES = {
    new: '分配对象',
    super: 'super(...) 构造父类',
    field: '字段赋值',
    var: '返回引用'
  };

  function isNum(v) { return typeof v === 'number' && !isNaN(v); }

  function buildOopSteps(clsKey, params) {
    var cls = OOP_CLASSES[clsKey];
    var ctorName = cls.label + ' 构造器';
    var args = cls.fields.map(function (f) { return params[f]; });
    var paramVars = cls.fields.map(function (f) {
      return { name: f, type: isNum(params[f]) ? 'int' : 'String', value: params[f] };
    });
    var steps = [];

    steps.push({
      phase: 'new',
      note: 'new ' + cls.label + '(' + args.join(', ') + ')：先在堆里创建对象 <b>#1</b>，字段取默认值（int → 0，String → null）。',
      frames: [
        { name: 'main', vars: [] },
        { name: ctorName, vars: paramVars, top: true }
      ],
      fields: {},
      highlight: null
    });

    if (cls.chain.length) {
      var superFields = cls.superFields || [];
      var superParams = superFields.map(function (f) {
        return { name: f, type: isNum(params[f]) ? 'int' : 'String', value: params[f] };
      });
      var superFieldVals = {};
      superFields.forEach(function (f) { superFieldVals[f] = params[f]; });
      steps.push({
        phase: 'super',
        note: '构造器第一条语句 <b>super(' + superFields.map(function (f) { return params[f]; }).join(', ') + ')</b>：先构造父类 ' +
          cls.chain[0] + ' 的部分，父类字段先就位。',
        frames: [
          { name: 'main', vars: [] },
          { name: cls.chain[0] + ' 构造器', vars: superParams, top: true }
        ],
        fields: superFieldVals,
        highlight: superFields[superFields.length - 1]
      });
    }

    var allFields = {};
    cls.fields.forEach(function (f) { allFields[f] = params[f]; });
    steps.push({
      phase: 'field',
      note: (cls.chain.length ? '回到 ' + cls.label + ' 构造器：' : '') +
        '执行 this.字段 = 参数，把参数写进对象：' +
        cls.fields.map(function (f) { return f + ' = ' + params[f]; }).join('，') + '。',
      frames: [
        { name: 'main', vars: [] },
        { name: ctorName, vars: paramVars, top: true }
      ],
      fields: allFields,
      highlight: cls.fields[cls.fields.length - 1]
    });

    steps.push({
      phase: 'var',
      note: '构造器结束、对象返回，main 里的变量 <b>s</b> 保存对象 #1 的引用。之后 s.字段 就是通过这个引用访问堆里的对象。',
      frames: [{ name: 'main', vars: [{ name: 's', type: cls.label, ref: '#1' }], top: true }],
      fields: allFields,
      highlight: null
    });
    return steps;
  }

  function initOop(root, props, ctx, kit) {
    var state = {
      clsKey: 'Student',
      params: {},
      steps: [],
      idx: 0,
      step: null
    };

    var classRow = ctl(root);
    var chainHost = E('div', { class: 'labCtl' });
    root.appendChild(chainHost);
    var paramRow = ctl(root);
    var ctlRow = ctl(root);
    var mem = E('div', { class: 'mem' });
    var colStack = E('div', { class: 'memCol' });
    var colHeap = E('div', { class: 'memCol' });
    colStack.appendChild(E('div', { class: 'memColT', text: '栈 stack（调用栈）' }));
    colHeap.appendChild(E('div', { class: 'memColT', text: '堆 heap（new 出来的对象）' }));
    var stackHost = E('div');
    var heapHost = E('div');
    colStack.appendChild(stackHost);
    colHeap.appendChild(heapHost);
    mem.appendChild(colStack);
    mem.appendChild(colHeap);
    root.appendChild(mem);
    var dispatchBox = E('div', { class: 'labNote' });
    root.appendChild(dispatchBox);
    var noteBox = note(root);
    var statBox = stats(root);
    var hint = hintLine(root, '');

    var classBtns = {};
    Object.keys(OOP_CLASSES).forEach(function (k) {
      classBtns[k] = button(classRow, OOP_CLASSES[k].label, function () {
        state.clsKey = k;
        Object.keys(classBtns).forEach(function (key) { classBtns[key].classList.toggle('on', key === k); });
        buildParams();
        reset();
      });
    });

    function buildParams() {
      paramRow.innerHTML = '';
      state.params = {};
      var cls = OOP_CLASSES[state.clsKey];
      cls.fields.forEach(function (f) {
        var val = cls.defaults[f];
        state.params[f] = val;
        var lbl = E('span', { class: 'dim', text: f });
        paramRow.appendChild(lbl);
        if (isNum(val)) {
          numberInput(paramRow, {
            min: 0, max: 9999, value: val,
            onInput: function (v) { state.params[f] = v; rebuildSteps(); }
          });
        } else {
          textInput(paramRow, {
            value: val, maxlength: 12,
            onInput: function (v) { state.params[f] = v; rebuildSteps(); }
          });
        }
      });
      hint.textContent = cls.summary;
    }

    var player = makePlayer(function () { return stepOnce(); }, function () { return 780; });
    kit.addPlayer(player);
    player.onIdle = function () { render(); };

    var playBtn = button(ctlRow, '播放构造过程', function () {
      if (state.idx >= state.steps.length) reset();
      if (player.playing) {
        player.pause();
        render();
        return;
      }
      player.play();
      render();
    }, { icon: 'play' });
    button(ctlRow, '下一步', function () {
      player.pause();
      if (state.idx >= state.steps.length - 1) {
        noteBox.set('构造过程已经走完。点「调用 s.describe()」看方法派发，或换一个类对比。', state.steps.length + ' / ' + state.steps.length + ' 步');
        return;
      }
      stepOnce();
    }, { icon: 'step' });
    button(ctlRow, '重置', function () { reset(); }, { icon: 'reset' });
    button(ctlRow, '调用 s.describe()', function () { callDescribe(); }, { icon: 'function' });

    function rebuildSteps() {
      state.steps = buildOopSteps(state.clsKey, state.params);
      state.idx = 0;
      state.step = state.steps[0];
      render();
    }

    function renderChain() {
      chainHost.innerHTML = '';
      var cls = OOP_CLASSES[state.clsKey];
      var full = ['Object'].concat(cls.chain.slice().reverse()).concat([state.clsKey]);
      full.forEach(function (name, i) {
        if (i > 0) chainHost.appendChild(E('span', { class: 'dim', text: '→' }));
        var isActual = name === state.clsKey;
        chainHost.appendChild(E('span', {
          class: 'pill' + (isActual ? ' ok' : (i === 0 ? '' : ' info')),
          text: name
        }));
      });
    }

    function renderMem(f) {
      stackHost.innerHTML = '';
      var frames = f.frames || [];
      if (!frames.length) {
        stackHost.appendChild(E('div', { class: 'memEmpty', text: '栈为空' }));
      } else {
        var wrap = E('div', { class: 'memStack' });
        frames.forEach(function (fr, i) {
          var frameEl = E('div', { class: 'memFrame' + (fr.top ? ' top' : '') });
          var head = E('div', { class: 'memFrameH' });
          head.appendChild(E('b', { text: fr.name }));
          head.appendChild(E('span', { class: 'ml', text: i === frames.length - 1 ? '当前帧' : '' }));
          frameEl.appendChild(head);
          var varsBox = E('div', { class: 'memVars' });
          (fr.vars || []).forEach(function (v) {
            var row = E('div', { class: 'memVar' });
            row.appendChild(E('span', { class: 'mn', text: v.name }));
            row.appendChild(E('span', { class: 'mty', text: v.type }));
            if (v.ref != null) row.appendChild(E('span', { class: 'mv mref', text: '→ ' + v.ref }));
            else row.appendChild(E('span', { class: 'mv', text: String(v.value) }));
            varsBox.appendChild(row);
          });
          frameEl.appendChild(varsBox);
          wrap.appendChild(frameEl);
        });
        stackHost.appendChild(wrap);
      }

      heapHost.innerHTML = '';
      var obj = E('div', { class: 'memObj' });
      var head = E('div', { class: 'memObjH' });
      head.appendChild(E('span', { class: 'oid', text: '#1' }));
      head.appendChild(E('span', { text: ' ' + OOP_CLASSES[state.clsKey].label }));
      obj.appendChild(head);
      var fieldsBox = E('div', { class: 'memFields' });
      var fieldNames = OOP_CLASSES[state.clsKey].fields;
      fieldNames.forEach(function (name) {
        var row = E('div', { class: 'memField' });
        row.appendChild(E('span', { class: 'fn2', text: name }));
        var has = Object.prototype.hasOwnProperty.call(f.fields || {}, name);
        var text = has ? String(f.fields[name]) : '（默认 0 / null）';
        row.appendChild(E('span', {
          class: 'fv',
          html: has ? (f.highlight === name ? '<b>' + esc(text) + '</b>' : esc(text)) : '<span class="dim">' + esc(text) + '</span>'
        }));
        fieldsBox.appendChild(row);
      });
      obj.appendChild(fieldsBox);
      heapHost.appendChild(obj);
    }

    function phaseLabel(p) {
      return OOP_PHASES[p] || p;
    }

    function render() {
      var f = state.step;
      if (!f) return;
      renderChain();
      renderMem(f);
      noteBox.set(f.note, (state.idx + 1) + ' / ' + state.steps.length + ' 步');
      statBox.set([
        { label: '类', value: OOP_CLASSES[state.clsKey].label, hot: true },
        { label: '阶段', value: phaseLabel(f.phase) },
        { label: '对象', value: '#1' },
        { label: '字段数', value: OOP_CLASSES[state.clsKey].fields.length }
      ]);
      setBtnLabel(playBtn, player.playing ? '暂停' : '播放构造过程');
    }

    function stepOnce() {
      if (state.idx >= state.steps.length - 1) return false;
      state.idx++;
      state.step = state.steps[state.idx];
      render();
      return state.idx < state.steps.length - 1;
    }

    function callDescribe() {
      var cls = OOP_CLASSES[state.clsKey];
      var declared = cls.chain[0] || cls.label;
      var name = state.params.name != null ? state.params.name : (state.params.x != null ? ('(' + state.params.x + ', ' + state.params.y + ')') : '对象');
      var result;
      if (state.clsKey === 'Point') result = 'Point' + name;
      else if (state.clsKey === 'Person') result = 'I am ' + name;
      else if (state.clsKey === 'Student') result = 'I am ' + name + ', a student';
      else result = 'I am ' + name + ', a grad student (' + (state.params.major || 'CS') + ')';
      dispatchBox.innerHTML = '<b>s.describe()</b>：编译时看声明类型 <b>' + esc(declared) + '</b>，运行时看实际类型 <b>' +
        esc(cls.label) + '</b>。JVM 从实际类型开始沿继承链找重写的方法，找到 <b>' + esc(cls.label) +
        '.describe()</b>。输出：' + esc(result);
    }

    function reset() {
      player.pause();
      state.steps = buildOopSteps(state.clsKey, state.params);
      state.idx = 0;
      state.step = state.steps[0];
      dispatchBox.innerHTML = '<b>方法派发</b> 点「调用 s.describe()」：看看声明类型和实际类型不一致时，到底执行哪个类的方法。';
      render();
    }

    buildParams();
    classBtns.Student.classList.add('on');
    reset();
  }

  LABS.oop = {
    title: '类与对象构造',
    desc: '构造器参数 → 字段 → new 出来的对象卡，外加继承链与方法派发：声明类型和实际类型不一致时调用谁',
    tags: ['ch07'],
    icon: 'box',
    order: 13,
    init: lab(initOop)
  };

  /* =====================================================================
   * 14. hashmap —— 键 → hash → 桶 → 值的示意图（含冲突与查找）
   * ===================================================================== */
  var HM_BUCKETS = 8;

  /** 与 Java String.hashCode() 一致的 32 位哈希 */
  function javaStringHash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return h;
  }

  function hmBucketOf(key) {
    var h = javaStringHash(key);
    return ((h % HM_BUCKETS) + HM_BUCKETS) % HM_BUCKETS;
  }

  function initHashmap(root, props, ctx, kit) {
    var state = {
      key: 'apple',
      value: 3,
      buckets: [],
      hashVal: null,
      bucketVal: null,
      highlight: null,
      steps: [],
      idx: 0,
      note: ''
    };

    function emptyBuckets() {
      var arr = [];
      for (var i = 0; i < HM_BUCKETS; i++) arr.push([]);
      return arr;
    }

    function putQuiet(key, value) {
      var b = hmBucketOf(key);
      var list = state.buckets[b];
      for (var i = 0; i < list.length; i++) {
        if (list[i].key === key) { list[i].value = value; return; }
      }
      list.push({ key: key, value: value });
    }

    var ctlRow = ctl(root);
    var keyInput = textInput(ctlRow, {
      value: state.key, maxlength: 8, placeholder: 'key（英文）',
      onInput: function (v) { state.key = v; }
    });
    keyInput.setAttribute('aria-label', 'key');
    var valInput = numberInput(ctlRow, {
      min: 0, max: 99, value: state.value,
      onInput: function (v) { state.value = v; }
    });
    valInput.setAttribute('aria-label', 'value');

    var traceHost = E('div', { class: 'labCtl' });
    root.appendChild(traceHost);
    var bucketHost = E('div');
    root.appendChild(bucketHost);
    var noteBox = note(root);
    var statBox = stats(root);
    var hint = hintLine(root, 'hashCode 相同的 key 会落进同一个桶（冲突），HashMap 用链表/红黑树把它们串起来。桶越满，查找越慢。');

    var player = makePlayer(function () { return stepOnce(); }, function () { return 640; });
    kit.addPlayer(player);
    player.onIdle = function () { render(); };

    var putBtn = button(ctlRow, '放入 put', function () { runPut(false); }, { icon: 'play' });
    button(ctlRow, '查找 get', function () { runGet(); }, { icon: 'search' });
    button(ctlRow, '制造冲突', function () { runPut(true); }, { icon: 'zap' });
    button(ctlRow, '下一步', function () {
      player.pause();
      if (!state.steps.length) {
        var k = String(state.key || '').trim() || 'apple';
        state.steps = buildPutSteps(k, state.value);
        state.idx = 0;
        state.hashVal = null;
        state.bucketVal = null;
        state.highlight = null;
        state.note = '逐步演示放入 "' + k + '"：先算 hash，再取模，最后落桶。';
        render();
      }
      if (state.idx >= state.steps.length) {
        state.steps = [];
        return;
      }
      stepOnce();
    }, { icon: 'step' });
    button(ctlRow, '清空', function () {
      player.pause();
      state.buckets = emptyBuckets();
      state.steps = [];
      state.idx = 0;
      state.hashVal = null;
      state.bucketVal = null;
      state.highlight = null;
      state.note = '已清空：8 个桶都是空的。';
      render();
    }, { icon: 'trash' });
    button(ctlRow, '重置', function () { seed(); }, { icon: 'reset' });

    function seed() {
      player.pause();
      state.buckets = emptyBuckets();
      state.steps = [];
      state.idx = 0;
      state.hashVal = null;
      state.bucketVal = null;
      state.highlight = null;
      state.note = '已重置为示例数据：注意有的桶里有 2 个条目 —— 那就是哈希冲突。';
      var cands = ['apple', 'banana', 'cat', 'dog', 'elephant', 'fig', 'grape', 'kiwi'];
      var pair = null;
      var i;
      var j;
      for (i = 0; i < cands.length && !pair; i++) {
        for (j = i + 1; j < cands.length; j++) {
          if (hmBucketOf(cands[i]) === hmBucketOf(cands[j])) {
            pair = [cands[i], cands[j]];
            break;
          }
        }
      }
      if (!pair) pair = ['apple', 'banana'];
      putQuiet(pair[0], 3);
      putQuiet(pair[1], 5);
      for (i = 0; i < cands.length; i++) {
        if (cands[i] !== pair[0] && cands[i] !== pair[1]) {
          putQuiet(cands[i], 7);
          break;
        }
      }
      render();
    }

    function buildPutSteps(key, value) {
      var hash = javaStringHash(key);
      var bucket = hmBucketOf(key);
      var list = state.buckets[bucket];
      var exists = -1;
      var i;
      for (i = 0; i < list.length; i++) {
        if (list[i].key === key) exists = i;
      }
      var steps = [];
      steps.push({
        hash: hash,
        bucket: null,
        highlight: null,
        note: '第 1 步：计算 <b>"' + esc(key) + '".hashCode() = ' + hash + '</b>（String 的 hash 由每个字符参与计算，长度固定时结果是确定的）。'
      });
      steps.push({
        hash: hash,
        bucket: bucket,
        highlight: null,
        note: '第 2 步：<b>' + hash + ' % ' + HM_BUCKETS + ' = ' + bucket + '</b> → 目标桶是桶 ' + bucket + '（取模保证落在 0~' + (HM_BUCKETS - 1) + '）。'
      });
      if (exists >= 0) {
        steps.push({
          hash: hash,
          bucket: bucket,
          highlight: bucket,
          apply: function () {
            var b = hmBucketOf(key);
            for (var k = 0; k < state.buckets[b].length; k++) {
              if (state.buckets[b][k].key === key) state.buckets[b][k].value = value;
            }
          },
          note: '第 3 步：桶 ' + bucket + ' 里已经有 key "' + esc(key) + '" → 用新值 <b>' + value +
            '</b> 覆盖旧值（HashMap 不允许重复 key）。'
        });
      } else if (list.length > 0) {
        steps.push({
          hash: hash,
          bucket: bucket,
          highlight: bucket,
          apply: function () { putQuiet(key, value); },
          note: '第 3 步：桶 ' + bucket + ' 已经有 ' + list.length + ' 个条目 → <b>哈希冲突</b>！新条目挂到这条链上（Java 8 在链太长时会转成红黑树）。'
        });
      } else {
        steps.push({
          hash: hash,
          bucket: bucket,
          highlight: bucket,
          apply: function () { putQuiet(key, value); },
          note: '第 3 步：桶 ' + bucket + ' 是空的 → 直接放入 <b>"' + esc(key) + ' : ' + value + '"</b>。'
        });
      }
      return steps;
    }

    function findConflictKey() {
      var used = {};
      state.buckets.forEach(function (items) {
        items.forEach(function (e) { used[e.key] = 1; });
      });
      var cands = ['apple', 'banana', 'cat', 'dog', 'elephant', 'fig', 'grape', 'kiwi', 'lime', 'mango', 'nut', 'orange', 'pear'];
      var i;
      var occupied = {};
      state.buckets.forEach(function (items, b) {
        if (items.length) occupied[b] = items[0].key;
      });
      for (i = 0; i < cands.length; i++) {
        var k = cands[i];
        if (used[k]) continue;
        var b = hmBucketOf(k);
        if (occupied[b]) return { key: k, bucket: b, withKey: occupied[b] };
      }
      return null;
    }

    function runPut(forceConflict) {
      player.pause();
      var key = String(state.key || '').trim();
      if (!key) {
        noteBox.set('先输入一个 key（英文单词即可），再点「放入」。', '');
        return;
      }
      var extraNote = '';
      if (forceConflict) {
        var pair = findConflictKey();
        if (!pair) {
          noteBox.set('当前找不到可以制造冲突的 key：先随便放几个键值对，再试一次。', '');
          return;
        }
        key = pair.key;
        state.key = pair.key;
        keyInput.value = pair.key;
        extraNote = '为了演示冲突，自动选了一个和 "' + esc(pair.withKey) + '" 撞在桶 ' + pair.bucket +
          ' 的 key："<b>' + esc(pair.key) + '</b>"。<br>';
      }
      state.steps = buildPutSteps(key, state.value);
      if (extraNote) state.steps[0].note = extraNote + state.steps[0].note;
      state.idx = 0;
      state.hashVal = null;
      state.bucketVal = null;
      state.highlight = null;
      state.note = state.steps[0].note;
      render();
      player.play();
    }

    function runGet() {
      player.pause();
      var key = String(state.key || '').trim();
      if (!key) {
        noteBox.set('先输入要查找的 key。', '');
        return;
      }
      var hash = javaStringHash(key);
      var bucket = hmBucketOf(key);
      var list = state.buckets[bucket];
      var compares = 0;
      var found = null;
      for (var i = 0; i < list.length; i++) {
        compares++;
        if (list[i].key === key) { found = list[i]; break; }
      }
      state.steps = [
        {
          hash: hash, bucket: null, highlight: null,
          note: '查找第 1 步：<b>"' + esc(key) + '".hashCode() = ' + hash + '</b>。'
        },
        {
          hash: hash, bucket: bucket, highlight: null,
          note: '查找第 2 步：' + hash + ' % ' + HM_BUCKETS + ' = <b>' + bucket + '</b>，直接跳到桶 ' + bucket + '。'
        },
        {
          hash: hash, bucket: bucket, highlight: bucket,
          note: list.length
            ? '查找第 3 步：桶 ' + bucket + ' 里有 ' + list.length + ' 个条目，逐个比较 key.equals(...)，共比较 ' + compares +
              ' 次 → ' + (found ? '<b>找到 "' + esc(found.key) + ' : ' + found.value + '"</b>' : '<b>未找到</b>（key 不存在）') + '。'
            : '查找第 3 步：桶 ' + bucket + ' 是空的 → <b>未找到</b>，一次比较都不用做。'
        }
      ];
      state.idx = 0;
      state.hashVal = null;
      state.bucketVal = null;
      state.highlight = null;
      state.note = state.steps[0].note;
      render();
      player.play();
    }

    function stepOnce() {
      if (state.idx >= state.steps.length) return false;
      var st = state.steps[state.idx];
      state.idx++;
      if (st.hash !== undefined) state.hashVal = st.hash;
      if (st.bucket !== undefined) state.bucketVal = st.bucket;
      if (st.highlight !== undefined) state.highlight = st.highlight;
      if (typeof st.apply === 'function') st.apply();
      state.note = st.note;
      render();
      return state.idx < state.steps.length;
    }

    function renderTrace() {
      traceHost.innerHTML = '';
      var items = [
        { cls: 'pill' + (state.idx >= 1 ? ' info' : ''), text: '键 "' + (state.key || '?') + '"' },
        { cls: 'pill' + (state.hashVal != null ? ' info' : ''), text: 'hashCode = ' + (state.hashVal == null ? '?' : state.hashVal) },
        { cls: 'pill' + (state.bucketVal != null ? ' info' : ''), text: '% ' + HM_BUCKETS + ' = ' + (state.bucketVal == null ? '?' : state.bucketVal) },
        { cls: 'pill' + (state.bucketVal != null ? ' ok' : ''), text: '桶 ' + (state.bucketVal == null ? '?' : state.bucketVal) }
      ];
      items.forEach(function (it, i) {
        if (i > 0) traceHost.appendChild(E('span', { class: 'dim', text: '→' }));
        traceHost.appendChild(E('span', { class: it.cls, text: it.text }));
      });
    }

    function renderBuckets() {
      bucketHost.innerHTML = '';
      var wrap = E('div', { class: 'memHeap' });
      state.buckets.forEach(function (items, b) {
        var box = E('div', { class: 'memObj' });
        var head = E('div', { class: 'memObjH' });
        head.appendChild(E('span', { class: 'oid', text: '桶 ' + b }));
        head.appendChild(E('span', {
          text: ' ' + (items.length
            ? '（' + items.length + ' 个条目' + (items.length > 1 ? ' · 冲突链' : '') + '）'
            : '空')
        }));
        if (state.highlight === b) head.appendChild(E('span', { class: 'pill ok', text: ' ← 当前桶' }));
        box.appendChild(head);
        if (items.length) {
          var row = E('div', { class: 'memArr' });
          items.forEach(function (e) {
            row.appendChild(E('div', {
              class: 'memCell' + (state.highlight === b ? ' changed' : ''),
              text: e.key + ' : ' + e.value
            }));
          });
          box.appendChild(row);
        }
        wrap.appendChild(box);
      });
      bucketHost.appendChild(wrap);
    }

    function render() {
      renderTrace();
      renderBuckets();
      noteBox.set(state.note || '输入 key 和 value，点「放入」：先算 hashCode，再对 8 取模，落到对应的桶。', state.idx + ' / ' + (state.steps.length || 0) + ' 步');
      var total = 0;
      var maxChain = 0;
      state.buckets.forEach(function (items) {
        total += items.length;
        if (items.length > maxChain) maxChain = items.length;
      });
      statBox.set([
        { label: '桶数', value: HM_BUCKETS },
        { label: '条目数', value: total },
        { label: '负载因子', value: (total / HM_BUCKETS).toFixed(2) },
        { label: '最长链', value: maxChain, hot: maxChain > 1 }
      ]);
    }

    seed();
  }

  LABS.hashmap = {
    title: 'HashMap 键值对与哈希桶',
    desc: '键 → hashCode → 取模 → 桶：亲眼看一次放入/查找，以及冲突是怎么形成的',
    tags: ['ch10'],
    icon: 'grid',
    order: 14,
    init: lab(initHashmap)
  };

  /* =====================================================================
   * 15. stddraw —— StdDraw 可视化实验台
   *
   * 真实 Java 程序需要 edu.princeton.cs.algs4.StdDraw（algs4.jar）；
   * 这里用 Canvas 重绘同一套图元（line / rect / circle / point /
   * setPenColor / setCanvasSize），并把 3 个经典程序「逐帧播放 + 单步」：
   *   递归树（二分树）、科赫雪花、随机漫步。
   * 所有图形都由「指令序列」预生成（不依赖引擎），参数改了就重新生成。
   * ===================================================================== */

  /* StdDraw 颜色名 → 本站观测站调色板（CSS 变量值，canvas 不解析 var()） */
  var SD_COLORS = {
    BLACK: '#0a0f17', RED: '#c82337', ORANGE: '#e06236', YELLOW: '#d7ab61',
    BLUE: '#2f4c79', GREEN: '#9dbd8a', CYAN: '#9fc0e2', MAGENTA: '#c82337',
    WHITE: '#e8e8e8', GRAY: '#6d7d8c', PINK: '#d7ab61', DARK_GRAY: '#6d7d8c'
  };
  function sdColor(name) {
    var k = String(name || 'WHITE').toUpperCase();
    return SD_COLORS[k] || SD_COLORS.WHITE;
  }

  var SD_PROGRAMS = [
    {
      id: 'tree',
      label: '递归树（二分树）',
      en: 'RECURSIVE TREE',
      desc: '画一根树枝，在末端分出两根更短、各偏 30° 的树枝，递归到指定层数',
      param: { key: 'depth', label: '层数', min: 1, max: 7, value: 5 },
      java: [
        'import edu.princeton.cs.algs4.StdDraw;',
        '',
        'public class Tree {',
        '    public static void tree(double x, double y, double len,',
        '                            double angle, int depth) {',
        '        double x2 = x + len * Math.cos(angle);',
        '        double y2 = y + len * Math.sin(angle);',
        '        StdDraw.line(x, y, x2, y2);',
        '        if (depth == 0) return;',
        '        tree(x2, y2, len * 0.7, angle + Math.PI / 6, depth - 1);',
        '        tree(x2, y2, len * 0.7, angle - Math.PI / 6, depth - 1);',
        '    }',
        '',
        '    public static void main(String[] args) {',
        '        StdDraw.setCanvasSize(800, 800);',
        '        StdDraw.setPenColor(StdDraw.ORANGE);',
        '        tree(0.5, 0.04, 0.20, Math.PI / 2, 5);',
        '    }',
        '}'
      ],
      build: function (depth) {
        var frames = [];
        function tree(x, y, len, ang, d) {
          var x2 = x + len * Math.cos(ang);
          var y2 = y + len * Math.sin(ang);
          frames.push([{ op: 'line', x1: x, y1: y, x2: x2, y2: y2, color: 'ORANGE', width: 1.4 }]);
          if (d === 0) return;
          tree(x2, y2, len * 0.7, ang + Math.PI / 6, d - 1);
          tree(x2, y2, len * 0.7, ang - Math.PI / 6, d - 1);
        }
        tree(0.5, 0.04, 0.20, Math.PI / 2, depth);
        return {
          frames: frames,
          drawables: frames.length,
          note: '共 ' + frames.length + ' 段树枝；层数 ' + depth + ' 时叶子数 ' + Math.pow(2, depth) + '。'
        };
      }
    },
    {
      id: 'koch',
      label: '科赫雪花',
      en: 'KOCH SNOWFLAKE',
      desc: '把每条线段中间 1/3 折成一个等边三角形的尖，递归 3 条边得到雪花曲线',
      param: { key: 'level', label: '递归层数', min: 1, max: 4, value: 3 },
      java: [
        'import edu.princeton.cs.algs4.StdDraw;',
        '',
        'public class Koch {',
        '    public static void koch(double x1, double y1,',
        '                            double x2, double y2, int level) {',
        '        if (level == 0) {',
        '            StdDraw.line(x1, y1, x2, y2);',
        '            return;',
        '        }',
        '        double ax = x1 + (x2 - x1) / 3, ay = y1 + (y2 - y1) / 3;',
        '        double bx = x1 + 2 * (x2 - x1) / 3, by = y1 + 2 * (y2 - y1) / 3;',
        '        double px = (ax + bx) / 2 + (ay - by) * Math.sqrt(3) / 2;',
        '        double py = (ay + by) / 2 + (bx - ax) * Math.sqrt(3) / 2;',
        '        koch(x1, y1, ax, ay, level - 1);',
        '        koch(ax, ay, px, py, level - 1);',
        '        koch(px, py, bx, by, level - 1);',
        '        koch(bx, by, x2, y2, level - 1);',
        '    }',
        '',
        '    public static void main(String[] args) {',
        '        StdDraw.setPenColor(StdDraw.CYAN);',
        '        koch(0.50, 0.12, 0.115, 0.77, 3);',
        '        koch(0.115, 0.77, 0.885, 0.77, 3);',
        '        koch(0.885, 0.77, 0.50, 0.12, 3);',
        '    }',
        '}'
      ],
      build: function (level) {
        var segs = [];
        function koch(x1, y1, x2, y2, d) {
          if (d === 0) {
            segs.push({ op: 'line', x1: x1, y1: y1, x2: x2, y2: y2, color: 'CYAN', width: 1.2 });
            return;
          }
          var ax = x1 + (x2 - x1) / 3, ay = y1 + (y2 - y1) / 3;
          var bx = x1 + 2 * (x2 - x1) / 3, by = y1 + 2 * (y2 - y1) / 3;
          var px = (ax + bx) / 2 + (ay - by) * Math.sqrt(3) / 2;
          var py = (ay + by) / 2 + (bx - ax) * Math.sqrt(3) / 2;
          koch(x1, y1, ax, ay, d - 1);
          koch(ax, ay, px, py, d - 1);
          koch(px, py, bx, by, d - 1);
          koch(bx, by, x2, y2, d - 1);
        }
        koch(0.50, 0.12, 0.115, 0.77, level);
        koch(0.115, 0.77, 0.885, 0.77, level);
        koch(0.885, 0.77, 0.50, 0.12, level);
        /* 层级高时一段一段播太慢：按层级合并成若干段/帧 */
        var per = level >= 4 ? 6 : (level >= 3 ? 3 : 1);
        var frames = [];
        for (var i = 0; i < segs.length; i += per) {
          frames.push(segs.slice(i, i + per));
        }
        return {
          frames: frames,
          drawables: segs.length,
          note: '3 条边 × 4^' + level + ' = ' + segs.length + ' 段折线，每帧画 ' + per + ' 段。'
        };
      }
    },
    {
      id: 'walk',
      label: '随机漫步',
      en: 'RANDOM WALK',
      desc: '固定随机种子，每一步随机朝上下左右走一小格，撞到边界就反弹',
      param: { key: 'steps', label: '步数', min: 200, max: 2000, value: 800, step: 100 },
      java: [
        'import edu.princeton.cs.algs4.StdDraw;',
        '',
        'public class Walk {',
        '    public static void main(String[] args) {',
        '        StdDraw.setCanvasSize(800, 800);',
        '        double x = 0.5, y = 0.5;',
        '        for (int i = 0; i < 800; i++) {',
        '            int dir = (int) (Math.random() * 4);',
        '            double nx = x, ny = y;',
        '            if (dir == 0) nx += 0.008;',
        '            else if (dir == 1) nx -= 0.008;',
        '            else if (dir == 2) ny += 0.008;',
        '            else ny -= 0.008;',
        '            if (nx < 0 || nx > 1) nx = x;',
        '            if (ny < 0 || ny > 1) ny = y;',
        '            StdDraw.setPenColor(StdDraw.ORANGE);',
        '            StdDraw.line(x, y, nx, ny);',
        '            x = nx;',
        '            y = ny;',
        '        }',
        '    }',
        '}'
      ],
      build: function (steps) {
        /* 固定种子的 xorshift：同一参数得到同一条路径（可复现） */
        var seed = 20261028 >>> 0;
        function rnd() {
          seed ^= seed << 13; seed >>>= 0;
          seed ^= seed >>> 17;
          seed ^= seed << 5; seed >>>= 0;
          return seed / 4294967296;
        }
        var palette = ['ORANGE', 'YELLOW', 'CYAN', 'GREEN', 'RED', 'BLUE'];
        var x = 0.5, y = 0.5, segs = [];
        for (var i = 0; i < steps; i++) {
          var dir = Math.floor(rnd() * 4);
          var nx = x, ny = y, st = 0.012;
          if (dir === 0) nx += st;
          else if (dir === 1) nx -= st;
          else if (dir === 2) ny += st;
          else ny -= st;
          if (nx < 0 || nx > 1) nx = x;
          if (ny < 0 || ny > 1) ny = y;
          segs.push({
            op: 'line', x1: x, y1: y, x2: nx, y2: ny,
            color: palette[Math.floor(i / 140) % palette.length], width: 1
          });
          x = nx; y = ny;
        }
        var per = 4;
        var frames = [];
        for (var k = 0; k < segs.length; k += per) frames.push(segs.slice(k, k + per));
        return {
          frames: frames,
          drawables: segs.length,
          note: '共 ' + steps + ' 步（每帧 ' + per + ' 步），颜色每 140 步换一种，终点在随机位置。'
        };
      }
    }
  ];

  function sdProgramById(id) {
    for (var i = 0; i < SD_PROGRAMS.length; i++) if (SD_PROGRAMS[i].id === id) return SD_PROGRAMS[i];
    return SD_PROGRAMS[0];
  }

  /** 把 canvas 逻辑像素尺寸按容器宽度自适应（保持接近正方形的 StdDraw 画布） */
  function sdFitCanvas(canvas) {
    var hostW = (canvas.parentNode && canvas.parentNode.clientWidth) || 480;
    var w = Math.max(240, Math.min(560, hostW - 16));
    var h = Math.round(w * 0.92);
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

  function initStdDraw(root, props, ctx, kit) {
    var state = {
      progId: 'tree',
      param: 5,
      speed: 6,
      frames: [],
      drawn: 0,
      meta: null
    };
    var view = { canvas: null, ctx: null, w: 0, h: 0, pad: 14 };

    /* ---------- 标题说明：真实 StdDraw 与本站 Canvas 重绘的关系 ---------- */
    var intro = E('div', { class: 'labNote sdIntro' });
    intro.innerHTML = '<span>真实 Java 程序需要 <b>edu.princeton.cs.algs4.StdDraw</b>（algs4.jar）；'
      + '这里用 Canvas 重绘同一套图元：<b>line / rect / circle / point / setPenColor / setCanvasSize</b>。'
      + '下面每个程序都给出真实 Java 源码，可逐帧对照。</span>';
    root.appendChild(intro);

    /* ---------- 程序选择 ---------- */
    var progRow = ctl(root);
    var progBtns = {};
    SD_PROGRAMS.forEach(function (p) {
      progBtns[p.id] = button(progRow, p.label, function () { selectProg(p.id); });
    });

    /* ---------- 参数 / 速度 ---------- */
    var ctlRow = ctl(root);
    var paramSlider = slider(ctlRow, {
      label: SD_PROGRAMS[0].param.label,
      min: SD_PROGRAMS[0].param.min,
      max: SD_PROGRAMS[0].param.max,
      step: SD_PROGRAMS[0].param.step || 1,
      value: SD_PROGRAMS[0].param.value,
      onInput: function (v) { state.param = v; rebuild(); }
    });
    var speedSlider = slider(ctlRow, {
      label: '速度',
      min: 1,
      max: 10,
      value: state.speed,
      onInput: function (v) { state.speed = v; }
    });

    /* ---------- 播放控制 ---------- */
    var playRow = ctl(root);
    var playBtn = button(playRow, '播放', function () { togglePlay(); }, { icon: 'play' });
    var stepBtn = button(playRow, '单步', function () { setPlaying(false); stepDraw(); }, { icon: 'step' });
    var resetBtn = button(playRow, '重置', function () { rebuild(); }, { icon: 'reset' });

    /* ---------- 画布 ---------- */
    var stage = E('div', { class: 'labStage sdStage' });
    var canvas = E('canvas', { class: 'sdCanvas' });
    stage.appendChild(canvas);
    root.appendChild(stage);
    view.canvas = canvas;

    /* ---------- 状态 / 统计 / 源码 ---------- */
    var noteBox = note(root);
    var statBox = stats(root);
    var codeHost = E('div', { class: 'sdCodeHost' });
    root.appendChild(codeHost);

    /* ---------- 播放器：每 tick 画一帧 ---------- */
    var player = kit.addPlayer(makePlayer(stepDraw, function () { return 300 - state.speed * 26; }));
    player.onIdle = function () {
      setPlaying(false);
      updateUI();
    };

    function mx(x) { return view.pad + x * (view.w - view.pad * 2); }
    function my(y) { return view.h - view.pad - y * (view.h - view.pad * 2); }

    function paintBg() {
      var c = view.ctx;
      if (!c) return;
      c.fillStyle = sdColor('BLACK');
      c.fillRect(0, 0, view.w, view.h);
      /* 细网格：呼应观测站「仪表盘」质感（StdDraw 本身没有网格，纯视觉辅助） */
      c.strokeStyle = 'rgba(59,78,107,.16)';
      c.lineWidth = 1;
      for (var g = 1; g < 10; g++) {
        var gx = mx(g / 10), gy = my(g / 10);
        c.beginPath(); c.moveTo(gx, my(0)); c.lineTo(gx, my(1)); c.stroke();
        c.beginPath(); c.moveTo(mx(0), gy); c.lineTo(mx(1), gy); c.stroke();
      }
      c.strokeStyle = 'rgba(59,78,107,.62)';
      c.strokeRect(0.5, 0.5, view.w - 1, view.h - 1);
    }

    function drawCmd(c, cmd) {
      if (!cmd) return;
      if (cmd.op === 'clear') { paintBg(); return; }
      var col = sdColor(cmd.color);
      c.strokeStyle = col;
      c.fillStyle = col;
      c.lineWidth = cmd.width || 1;
      if (cmd.op === 'line') {
        c.beginPath();
        c.moveTo(mx(cmd.x1), my(cmd.y1));
        c.lineTo(mx(cmd.x2), my(cmd.y2));
        c.stroke();
      } else if (cmd.op === 'circle') {
        c.beginPath();
        c.arc(mx(cmd.x), my(cmd.y), Math.max(0.5, cmd.r * (view.w - view.pad * 2)), 0, Math.PI * 2);
        if (cmd.filled) c.fill(); else c.stroke();
      } else if (cmd.op === 'rect') {
        var rx = mx(cmd.x), ry = my(cmd.y + cmd.h);
        var rw = cmd.w * (view.w - view.pad * 2), rh = cmd.h * (view.h - view.pad * 2);
        if (cmd.filled) c.fillRect(rx, ry, rw, rh); else c.strokeRect(rx, ry, rw, rh);
      } else if (cmd.op === 'point') {
        c.fillRect(mx(cmd.x) - 1.5, my(cmd.y) - 1.5, 3, 3);
      }
    }

    function drawFrame(idx) {
      var frame = state.frames[idx];
      if (!frame) return;
      for (var i = 0; i < frame.length; i++) drawCmd(view.ctx, frame[i]);
    }

    function redrawAll() {
      paintBg();
      for (var i = 0; i < state.drawn; i++) drawFrame(i);
    }

    function stepDraw() {
      if (!state.frames.length) return false;
      if (state.drawn >= state.frames.length) { updateUI(); return false; }
      drawFrame(state.drawn);
      state.drawn++;
      updateUI();
      return state.drawn < state.frames.length;
    }

    function setPlaying(on) {
      if (on) {
        if (state.drawn >= state.frames.length) rebuild();
        playBtn.classList.add('on');
        setBtnLabel(playBtn, '暂停');
        player.play();
      } else {
        player.pause();
        playBtn.classList.remove('on');
        setBtnLabel(playBtn, '播放');
      }
    }

    function togglePlay() {
      if (playBtn.classList.contains('on')) setPlaying(false);
      else setPlaying(true);
    }

    function rebuild() {
      var prog = sdProgramById(state.progId);
      var built = prog.build(state.param);
      state.frames = built.frames || [];
      state.meta = built;
      state.drawn = 0;
      player.pause();
      playBtn.classList.remove('on');
      setBtnLabel(playBtn, '播放');
      paintBg();
      updateUI();
    }

    function updateUI() {
      var prog = sdProgramById(state.progId);
      var total = state.frames.length;
      noteBox.set(
        '当前：<b>' + prog.label + '</b> · ' + prog.desc + ' ' + (state.meta ? state.meta.note : ''),
        state.drawn + ' / ' + total + ' 帧'
      );
      statBox.set([
        { label: '程序', value: prog.en },
        { label: '帧进度', value: state.drawn + ' / ' + total },
        { label: '图元', value: state.meta ? state.meta.drawables : 0 },
        { label: '速度', value: state.speed + ' / 10' }
      ]);
    }

    function renderCode() {
      var prog = sdProgramById(state.progId);
      codeHost.innerHTML = '';
      var cap = E('div', { class: 'sdCodeCap' }, [
        E('span', { class: 'sdCodeK', text: 'REAL_JAVA // ' + prog.en }),
        E('span', { class: 'sdCodeHint', text: '需 algs4.jar（edu.princeton.cs.algs4.StdDraw）' })
      ]);
      codeHost.appendChild(cap);
      codeBlock(codeHost, prog.java);
    }

    function selectProg(id) {
      var prog = sdProgramById(id);
      state.progId = id;
      state.param = prog.param.value;
      paramSlider.input.min = String(prog.param.min);
      paramSlider.input.max = String(prog.param.max);
      paramSlider.input.step = String(prog.param.step || 1);
      paramSlider.set(state.param);
      var lab = paramSlider.el.children[0];
      if (lab) lab.textContent = prog.param.label;
      Object.keys(progBtns).forEach(function (k) {
        progBtns[k].classList.toggle('on', k === id);
      });
      rebuild();
      renderCode();
    }

    /* ---------- 尺寸自适应 ---------- */
    function onResize() {
      var fit = sdFitCanvas(view.canvas);
      if (!fit) return;
      view.ctx = fit.ctx;
      view.w = fit.w;
      view.h = fit.h;
      redrawAll();
    }
    kit.onDestroy(function () {
      window.removeEventListener('resize', onResize);
    });
    window.addEventListener('resize', onResize);

    /* ---------- 启动 ---------- */
    var fit = sdFitCanvas(view.canvas);
    if (!fit) {
      root.appendChild(E('div', { class: 'varEmpty', text: '当前浏览器不支持 Canvas 2D，无法绘制 StdDraw 图形。' }));
      return;
    }
    view.ctx = fit.ctx;
    view.w = fit.w;
    view.h = fit.h;
    selectProg('tree');
  }

  LABS.stddraw = {
    title: 'StdDraw 可视化实验台',
    desc: '用 Canvas 重绘 edu.princeton.cs.algs4.StdDraw 的图元：递归树 / 科赫雪花 / 随机漫步，逐帧播放 + 单步',
    tags: ['ch05'],
    icon: 'chart',
    order: 15,
    init: lab(initStdDraw)
  };

  /* =====================================================================
   * 注册（viz 就绪后立即注册；失败时兜底注册，实验台内部有降级提示）
   * ===================================================================== */
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
