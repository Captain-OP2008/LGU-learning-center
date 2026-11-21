/* =====================================================================
 * assets/math.js · 公式排版内核（MathJax 3 管理 + 自适应排版）
 *
 * 数学站的质量命脉：保证任何宽度下
 *   ① 行内公式过宽 → 自动提升为独立居中「公式纸片」；
 *   ② 独立公式仍放不下 → 按顶层 = / \qquad 拆成 aligned 多行，保持原字号；
 *   ③ 拆不了（矩阵、分段等）→ 等比缩小字号（下限 62%，表格内 85%）；
 *   ④ 表格窄屏 → 一列卡片（data-label 由 decorateTables 补）。
 * 全站保证：横向可拖动公式 0 个、页面横向溢出 0 px。
 *
 * 对外接口（app.js 注入 CSC.math）：
 *   CSC.math.schedule(root)   // 排队排版（MathJax 未就绪时自动等）
 *   CSC.math.finish(root)     // Promise：typeset + 自适应 + 表格卡片化
 *   CSC.math.typeset(root)    // Promise：仅 MathJax 排版
 *   CSC.math.fit(root)        // 仅做尺寸自适应
 *   CSC.math.loose(root)      // 局部组件（题目/解析）内的轻微缩放
 *   CSC.math.ready            // Promise：MathJax 就绪
 * ===================================================================== */
(function () {
  'use strict';

  var MIN_SCALE = 0.62;
  var CELL_MIN_SCALE = 0.85;

  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function qs(sel, root) { return (root || document).querySelector(sel); }

  /* ---------------------------------------------------------------- MathJax 就绪 */
  var mjReady = false;
  var waiters = [];
  var pendingRoots = [];
  var bootAttempts = 0;

  function haveMathJax() {
    return !!(window.MathJax && window.MathJax.typesetPromise && window.MathJax.startup && window.MathJax.startup.promise);
  }

  function boot() {
    if (mjReady) return;
    mjReady = true;
    document.documentElement.classList.add('math-ready');
    var list = waiters.splice(0);
    list.forEach(function (fn) { try { fn(); } catch (e) {} });
    flushPending();
  }

  function whenReady() {
    return new Promise(function (resolve) {
      if (mjReady) { resolve(); return; }
      waiters.push(resolve);
    });
  }

  var watchStarted = false;
  function watchMathJax() {
    if (watchStarted) return;
    watchStarted = true;
    if (haveMathJax()) {
      window.MathJax.startup.promise.then(boot, boot);
      return;
    }
    var timer = setInterval(function () {
      bootAttempts++;
      if (haveMathJax()) {
        clearInterval(timer);
        window.MathJax.startup.promise.then(boot, boot);
      } else if (bootAttempts > 600) {
        clearInterval(timer);
        console.warn('[math] MathJax 未就绪，公式将以源码形式显示');
      }
    }, 50);
  }

  /* ---------------------------------------------------------------- 基础工具 */
  function svgW(m) {
    var svg = m.querySelector('svg');
    if (svg) svg.style.maxWidth = 'none';
    var w = svg ? svg.getBoundingClientRect().width : m.getBoundingClientRect().width;
    if (svg) svg.style.maxWidth = '';
    return w;
  }

  /* MathJax 生成的隐藏辅助 MathML 会撑大 scrollWidth（冒出小滚动条）→ 删掉 */
  function dropAssistiveMML(root) {
    qsa('mjx-assistive-mml', root || document).forEach(function (n) {
      if (n.parentNode) n.parentNode.removeChild(n);
    });
  }

  /* ---------------------------------------------------------------- 懒加载 MathJax */
  var mjLoading = false;
  var MJ_SRC = '../../shared/mathjax/es5/tex-svg.js';

  function mathConfig() {
    return {
      loader: { load: ['[tex]/unicode'] },
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true, tags: 'none',
        packages: { '[+]': ['unicode'] },
        macros: {
          oiint: ['\\mathop{{\\int}\\!\\!\\!\\!\\!\\int}\\mkern-16mu\\bigcirc', 0],
          dfrac: ['\\frac{#1}{#2}', 2],
          T: ['^{\\mathsf{T}}', 0],
          tr: ['\\operatorname{tr}', 0]
        }
      },
      svg: { fontCache: 'local', scale: 0.98 },
      options: { enableMenu: false, enableAssistiveMml: false },
      startup: { typeset: false }
    };
  }

  /** 当前视图里有没有公式源码；首页 / 总览 / 题库列表没有，则永不加载 MathJax */
  function hasMathSource(root) {
    if (!root) return false;
    if (root.querySelector && root.querySelector('.chFormulaCard, .eqPlate, .mathBlock, mjx-container')) return true;
    var txt = root.textContent || '';
    return txt.indexOf('$$') >= 0 || txt.indexOf('\\(') >= 0 || txt.indexOf('\\[') >= 0;
  }

  /** 首次需要排版公式时注入 tex-svg.js（2.1 MB，不在首屏加载） */
  function ensureMathJax() {
    if (haveMathJax()) { watchMathJax(); return whenReady(); }
    if (mjLoading) { watchMathJax(); return whenReady(); }
    mjLoading = true;
    window.MathJax = mathConfig();
    var s = document.createElement('script');
    s.src = MJ_SRC;
    s.async = true;
    s.addEventListener('load', function () { watchMathJax(); });
    s.addEventListener('error', function () { console.warn('[math] MathJax 加载失败，公式将以源码形式显示'); });
    document.head.appendChild(s);
    return whenReady();
  }

  function typeset(root) {
    if (!haveMathJax()) {
      if (!hasMathSource(root)) return Promise.resolve(null);
      ensureMathJax();
    }
    return whenReady().then(function () {
      if (!window.MathJax || !MathJax.typesetPromise) return null;
      return MathJax.typesetPromise(root ? [root] : undefined);
    });
  }

  /* ---------------------------------------------------------------- 尺寸自适应 */
  /* 正文列宽度：优先取内容列的实测宽度 */
  function columnWidth(root) {
    var el = root || document;
    if (el.clientWidth) return el.clientWidth;
    var c = qs('#content');
    return c ? c.clientWidth : document.documentElement.clientWidth;
  }

  function fitMath(root) {
    if (!root || !root.querySelectorAll) return;
    var colW = columnWidth(root);
    if (!colW) return;
    qsa('mjx-container', root).forEach(function (m) {
      if (m.closest('.chWatermark, .heroWm, .noFit')) return;
      m.style.fontSize = '';
      m.classList.remove('mathBlock');
      var natural = svgW(m);
      var disp = m.getAttribute('display') === 'true';
      var cell = m.closest('td, th');
      var avail, floor = MIN_SCALE;
      if (cell) {
        avail = Math.max(cell.clientWidth - 22, 60);
        floor = CELL_MIN_SCALE;
      } else if (disp) {
        avail = colW - 44;
      } else {
        avail = colW - 6;
        if (natural > colW * 0.62) {
          m.classList.add('mathBlock');
          avail = colW - 44;
        }
      }
      if (avail > 40 && natural > avail + 0.5) {
        var k = avail / natural;
        if (k < 0.92 && !cell) m.setAttribute('data-need-break', '1');
        else m.removeAttribute('data-need-break');
        m.style.fontSize = (Math.max(floor, k) * 100).toFixed(1) + '%';
        /* 实测校正：公式可能嵌在引用块/列表里，可用宽度比正文还窄，按实际溢出再缩一档 */
        for (var pass = 0; pass < 2; pass++) {
          if (m.scrollWidth <= m.clientWidth + 2) break;
          var cur = parseFloat(m.style.fontSize) / 100;
          var next = Math.max(floor, cur * ((m.clientWidth - 2) / m.scrollWidth));
          if (!(next < cur - 0.005)) break;
          m.style.fontSize = (next * 100).toFixed(1) + '%';
        }
      } else {
        m.removeAttribute('data-need-break');
      }
    });
    /* 公式纸片内的表格 / 长公式在窄栏里允许横向滚动兜底 */
    qsa('.eqPlate', root).forEach(function (p) {
      var mj = qs('mjx-container', p);
      if (mj) p.classList.toggle('scrollable', mj.scrollWidth > p.clientWidth + 2);
    });
  }

  /* 局部组件（题目选项、解析、实验台读数）里的轻量缩放：不做提升、只等比缩 */
  function fitLoose(root) {
    if (!root || !root.querySelectorAll) return;
    qsa('mjx-container', root).forEach(function (m) {
      if (m.closest('.chWatermark, .heroWm')) return;
      m.style.fontSize = '';
      var natural = svgW(m);
      var host = m.parentNode;
      var avail = (host && host.clientWidth) ? host.clientWidth - 2 : 0;
      if (avail > 40 && natural > avail + 0.5) {
        m.style.fontSize = (Math.max(0.7, avail / natural) * 100).toFixed(1) + '%';
      }
    });
  }

  /* ---------------------------------------------------------------- 超长公式拆行 */
  function alignedTex(tex) {
    if (!tex || tex.indexOf('\\begin{') >= 0) return null;

    function splitTop(src, seps) {
      var out = [], cur = '', depth = 0, i = 0;
      while (i < src.length) {
        var ch = src[i];
        if (ch === '\\') {
          var mm = /^\\[a-zA-Z]+/.exec(src.slice(i));
          var cmd = mm ? mm[0] : '';
          if (cmd && seps.indexOf(cmd) >= 0 && depth === 0) { out.push(cur); cur = ''; i += cmd.length; continue; }
          var take = mm ? mm[0].length : 2;
          cur += src.substr(i, take);
          i += take;
          continue;
        }
        if (ch === '{') depth++;
        else if (ch === '}') depth = Math.max(0, depth - 1);
        else if (ch === '=' && seps.indexOf('=') >= 0 && depth === 0) { out.push(cur); cur = ''; i++; continue; }
        cur += ch;
        i++;
      }
      out.push(cur);
      return out;
    }

    var groups = splitTop(tex, ['\\qquad', '\\quad', '\\hfill']);
    var lineList = [], bad = false;
    groups.forEach(function (g) {
      if (bad) return;
      g = g.replace(/^[\s,;]+/, '').replace(/\s+$/, '');
      if (!g) return;
      var parts = splitTop(g, ['=']);
      if (parts.length < 2) { lineList.push(g); return; }
      for (var j = 1; j < parts.length; j++) { if (!parts[j].trim()) { bad = true; return; } }
      lineList.push(parts[0].replace(/\s+$/, '') + ' &=' + parts[1]);
      for (var q = 2; q < parts.length; q++) lineList.push('&=' + parts[q]);
    });
    if (bad || lineList.length < 2) return null;
    return '\\begin{aligned}' + lineList.join(' \\\\ ') + '\\end{aligned}';
  }

  function texMap() {
    var map = new Map();
    try {
      var L = MathJax.startup.document.math.list;
      var n = L && L.next, guard = 0;
      while (n && guard++ < 60000) {
        var it = n.data;
        if (it && it.typesetRoot && typeof it.math === 'string') map.set(it.typesetRoot, it.math);
        n = n.next;
      }
    } catch (e) {}
    return map;
  }

  function breakLongMath(root) {
    var todo = qsa('mjx-container[data-need-break]', root);
    if (!todo.length) return Promise.resolve(false);
    var map = texMap(), changed = 0;
    todo.forEach(function (m) {
      m.removeAttribute('data-need-break');
      var tex = map.get(m);
      if (!tex) return;
      var nt = alignedTex(tex);
      if (!nt) return;
      var holder = document.createElement('span');
      holder.textContent = '$$' + nt + '$$';
      m.parentNode.replaceChild(holder, m);
      changed++;
    });
    if (!changed) return Promise.resolve(false);
    return MathJax.typesetPromise([root]).then(function () { return true; });
  }

  /* ---------------------------------------------------------------- 表格卡片化 */
  function decorateTables(root) {
    qsa('table', root).forEach(function (t) {
      var head = t.tHead ? t.tHead.rows[0] : null;
      if (!head) return;
      var labels = Array.prototype.map.call(head.cells, function (c) { return (c.textContent || '').trim(); });
      qsa('tr', t).forEach(function (tr) {
        if (tr.parentNode === t.tHead) return;
        Array.prototype.forEach.call(tr.cells, function (td, i) {
          if (labels[i]) td.setAttribute('data-label', labels[i]);
        });
      });
      var n = head.cells.length;
      var p = t.parentNode;
      if (n >= 5 && p && String(p.className).indexOf('tblWrap') < 0) {
        var box = document.createElement('div');
        box.className = 'tblWrap t' + Math.min(n, 7);
        p.insertBefore(box, t);
        box.appendChild(t);
      }
    });
  }

  /* ---------------------------------------------------------------- 招牌公式（章节水印） */
  function fitHero(root) {
    qsa('.chFormulaCard, .chWatermark, .heroWm', root).forEach(function (wm) {
      var mj = qs('mjx-container', wm);
      if (!mj) return;
      mj.style.setProperty('font-size', '150%', 'important');
      var avail = wm.clientWidth - 24;
      var w = mj.getBoundingClientRect().width;
      if (avail > 0 && w > avail) {
        var k = Math.max(0.42, avail / w);
        mj.style.setProperty('font-size', (150 * k).toFixed(1) + '%', 'important');
      }
    });
  }

  /* 溢出可视提示：公式 / 长表格确实横向溢出时才加 class 与提示条 */
  function markXScroll(root) {
    if (!root || !root.querySelectorAll) return;
    qsa('mjx-container[display="true"], .tblWrap, .tableWrap', root).forEach(function (n) {
      var over = n.scrollWidth > n.clientWidth + 2;
      if (!over) {
        n.classList.remove('xscroll');
        var ph = n.previousElementSibling;
        if (ph && ph.classList && ph.classList.contains('xHint') && ph.parentNode) ph.parentNode.removeChild(ph);
        return;
      }
      if (n.parentElement && n.parentElement.closest && n.parentElement.closest('.xscroll')) return;
      n.classList.add('xscroll');
      var prev = n.previousElementSibling;
      if (!prev || !prev.classList || !prev.classList.contains('xHint')) {
        var hint = document.createElement('div');
        hint.className = 'xHint';
        hint.innerHTML = '<span>←</span> 可横向滚动 <span>→</span>';
        n.parentNode.insertBefore(hint, n);
      }
    });
  }

  /* ---------------------------------------------------------------- 总流程 */
  function finish(root) {
    root = root || qs('#content');
    if (!root) return Promise.resolve();
    return typeset(root).then(function () {
      dropAssistiveMML(root);
      decorateTables(root);
      fitMath(root);
      return breakLongMath(root);
    }).then(function (changed) {
      if (changed) fitMath(root);
      fitHero(root);
      markXScroll(root);
      try {
        if (window.CSC && CSC.bus) CSC.bus.emit('math:done', root);
      } catch (e) {}
    }).catch(function (e) {
      console.warn('[math] 排版失败', e && e.message);
    });
  }

  function flushPending() {
    var list = pendingRoots.splice(0);
    list.forEach(function (r) {
      if (r && r.isConnected) finish(r);
    });
  }

  function schedule(root) {
    root = root || qs('#content');
    if (!root) return;
    if (!hasMathSource(root)) return;
    if (mjReady) { finish(root); return; }
    ensureMathJax();
    if (pendingRoots.indexOf(root) < 0) pendingRoots.push(root);
  }

  /* ---------------------------------------------------------------- 窗口变化重排 */
  var rzTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(rzTimer);
    rzTimer = setTimeout(function () {
      if (!mjReady) return;
      var c = qs('#content');
      if (c) { fitMath(c); markXScroll(c); }
      try {
        if (window.CSC && CSC.bus) CSC.bus.emit('math:resize');
      } catch (e) {}
    }, 220);
  });

  /* ---------------------------------------------------------------- 导出 */
  var API = {
    ready: whenReady,
    typeset: typeset,
    finish: finish,
    schedule: schedule,
    fit: fitMath,
    loose: fitLoose,
    hero: fitHero,
    drop: dropAssistiveMML,
    decorateTables: decorateTables,
    isReady: function () { return mjReady; },
    ensure: ensureMathJax,
    hasMathSource: hasMathSource,
    markXScroll: markXScroll
  };
  window.CSC_MATH = API;
  /* app.js 会把它挂到 CSC.math；若 app.js 尚未执行则稍后补挂 */
  var tries = 0;
  (function attach() {
    if (window.CSC) { window.CSC.math = API; return; }
    if (tries++ < 100) setTimeout(attach, 20);
  })();

})();
