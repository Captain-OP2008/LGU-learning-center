/* =====================================================================
   线性代数学习站 · assets/labs.js · 交互实验台（20 台）
   ---------------------------------------------------------------------
   教材：Gilbert Strang《Introduction to Linear Algebra》5th Edition
   框架：与 sites/calculus/ 同一套（assets/app.js 的 hydrateLabs →
         def.init(root) → 本文件的 initLab → 画布 / 控件 / 读数）。
   ---------------------------------------------------------------------
   · 唯一依赖：window.CSC（registerLabs + math）。零外部库、无构建、
     纯原生 JS（ES5 语法为主），全部图形走 Canvas 2D。
   · 绘图内核（从 calculus 站 labs.js 内核段原样复用，未改写）：
       View  —— 坐标变换 px/py←→ux/uy、网格与刻度、曲线 fn/param、
                面积填充 fillBetween / regionArea、线段/箭头/点/多边形、
                热力图 heat、极坐标网格、节点图 nodeGraph、拖拽平移；
       View3 —— 三维线框视图（本批 20 台都是二维，保留供后续扩展）；
       挂载层 —— injectLabStyle / ctrlHTML / labBodyHTML / mountOne /
                initLab（样式内联注入，不改任何 CSS 文件）。
   · 线代自有部分（本文件新写）：
       10-utils    —— 2×2/3×3 行列式、逆、2×2 特征值与 SVD（全解析解）、
                      直线裁剪、矩阵面板、直角标记、等比例视图；
       20–23-labs  —— 20 台实验台定义（id/ch 与 OUTLINE §三 完全一致）。
   ---------------------------------------------------------------------
   20 台（按章）：00 depmap | 01 vecsum dotprod matvec |
   02 elimination inverse | 03 columnspace fourspaces |
   04 projection leastsquares gramschmidt | 05 determinant |
   06 eigen diagonalize | 07 svd | 08 transform basismatrix |
   10 markov | 11 condition | 12 gaussian
   ---------------------------------------------------------------------
   数学约定：det 的符号与平行四边形"有向面积"一致；特征向量画在 A 的
   不动方向上（Aa = λa）；投影读数满足 e = b − p ⊥ a；SVD 从 AᵀA 解析
   求 σ1 ≥ σ2 与 V，U 由 U = AV/Σ 定符号，保证 A = UΣVᵀ 逐项成立；
   Gram–Schmidt 的读数 q1·q2 = 0；Markov 迭代收敛到特征值 1 的稳态。
   ===================================================================== */

(function () {
  'use strict';

  var CSC = window.CSC;
  if (!CSC || typeof CSC.registerLabs !== 'function') {
    console.warn('[labs] CSC.registerLabs 不可用，交互实验台未注册');
    return;
  }


  /* ---------------- 调色板（新站唯一深色主题：对齐 observatory 令牌） ---------------- */
  function pal() {
    return {
      curve: '#a7b4c3',     /* 主曲线 · text2 */
      curve2: '#e06236',    /* 对比线（割线 / 第二函数 / 目标）· const-orange */
      curve3: '#d7ab61',    /* 辅助线（切线 / 高亮路径）· const-yellow */
      curve4: '#c82337',    /* 误差 / 警示 · const-red */
      fill: 'rgba(167,180,195,.13)',
      fill2: 'rgba(224,98,54,.16)',
      fill3: 'rgba(215,171,97,.16)',
      grid: 'rgba(59,78,107,.46)',          /* line */
      axis: 'rgba(167,180,195,.62)',        /* text2 */
      text: '#e8e8e8',                      /* text */
      muted: '#a7b4c3',
      dot: '#d7ab61',
      band: 'rgba(47,76,121,.30)',          /* const-blue */
      gridMajor: 'rgba(59,78,107,.78)',
      tick: 'rgba(109,125,140,.55)',        /* text3 */
      glow: 'rgba(167,180,195,.16)',
      plate0: 'rgba(47,76,121,.30)',
      plate1: 'rgba(14,20,31,.12)',
      edge: 'rgba(59,78,107,.62)',
      dotIn: '#0e141f',
      fillHi: 'rgba(167,180,195,.26)',
      fillLo: 'rgba(167,180,195,.09)',
      halo: 'rgba(14,20,31,.92)'
    };
  }
  /* 底衬颜色的不透明度：alpha 太低的「淡色衬底」其实看不清，等同于没有。
     这类调用一律改走光晕描边，既保住可读性，又不在图上留下色块。 */
  function bgAlpha(b) {
    if (typeof b !== 'string') return 0;
    var m = b.match(/rgba?\(([^)]+)\)/);
    if (!m) return 1;
    var p = m[1].split(',');
    return p.length > 3 ? parseFloat(p[3]) : 1;
  }
  function solidBg(b) { return !!(typeof b === 'string' && b && bgAlpha(b) >= 0.4); }

  /* 带光晕的裸文字：刻度数字、轴名、节点标签这类不走 View.text 的标注也要能压在任何底上读清。
     只碰描边/填充样式，字号与对齐沿用调用方设置。 */
  function haloText(c, s, x, y, color, size) {
    var P = pal(), sz = size || 11;
    c.save();
    c.lineJoin = 'round'; c.lineCap = 'round';
    c.lineWidth = Math.max(2.4, sz * 0.28);
    c.strokeStyle = P.halo;
    c.strokeText(s, x, y);
    c.fillStyle = color || P.text;
    c.fillText(s, x, y);
    c.restore();
  }

  /* ---------------- 数值工具 ---------------- */
  function deriv(f, x) {                       // 中心差分
    var h = 1e-5 * Math.max(1, Math.abs(x));
    return (f(x + h) - f(x - h)) / (2 * h);
  }
  function deriv2(f, x) {
    var h = 1e-4 * Math.max(1, Math.abs(x));
    return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
  }
  function simpson(f, a, b, n) {               // 复化 Simpson
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
    if (fa * fb > 0) return null;
    for (var i = 0; i < 80; i++) {
      m = (a + b) / 2; fm = g(m);
      if (fm === 0 || (b - a) < 1e-12) return m;
      if (fa * fm < 0) { b = m; fb = fm; } else { a = m; fa = fm; }
    }
    return (a + b) / 2;
  }
  function roots(g, a, b, n) {                 // 扫描 + 二分：区间内所有根
    n = n || 400;
    var out = [], h = (b - a) / n, prev = g(a), x, cur;
    for (x = 1; x <= n; x++) {
      cur = g(a + x * h);
      if (isFinite(prev) && isFinite(cur) && prev * cur <= 0 && (prev !== 0 || cur !== 0)) {
        var r = bisect(g, a + (x - 1) * h, a + x * h);
        /* 采样点正好落在根上时（g(x_k) = 0），左、右两个相邻小区间都满足变号条件，
           同一个根会被报两次；按极小容差去重，不影响真正分离的两个根。 */
        if (r !== null && isFinite(r)) {
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
  function fmt(x, d) {
    if (!isFinite(x)) return '—';
    d = d === undefined ? 4 : d;
    var a = Math.abs(x);
    if (a !== 0 && (a < 1e-4 || a >= 1e6)) return x.toExponential(2);
    return (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toString();
  }

  /* ---------------- 绘图内核 ---------------- */

  /* 圆角矩形路径（自带实现，不依赖 Canvas roundRect 的浏览器支持） */
  function roundRect(c, x, y, w, h, r) {
    r = Math.max(0, Math.min(r || 0, w / 2, h / 2));
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
    return c;
  }

  function View(cv, box) {
    this.cv = cv; this.ctx = cv.getContext('2d');
    this.box = box;
    this.x0 = box.x0; this.x1 = box.x1; this.y0 = box.y0; this.y1 = box.y1;
    this.pad = box.pad || { l: 36, r: 12, t: 12, b: 22 };
    this.fit();
  }
  /* 可用宽度：必须从父容器的盒模型算，不能靠"清掉行内宽度再量"。
     踩过的两个坑（2026-10-08 实测）：
     ① 首次 fit() 把 cv.style.width 写成像素值后，getBoundingClientRect() 只会量到那个钉死值；
     ② 就算清掉行内宽度也没用——.labCv.two 的 1fr 轨道自动最小值取 canvas 的 min-content
        （= width 属性的固有尺寸），窄视口下会卡在宽屏时的旧值（实测 360px 仍量回 428px）。
     所以改为：父容器 clientWidth − 左右 padding；若计算样式里有多条 grid 轨道再按列数与 gap 均分。
     父节点缺失/宽度为 0 时才退回"清宽度再量"的兜底。 */
  function measureWidth(cv) {
    var prev = cv.style.width, p = cv.parentNode, w = 0;
    if (p && p.clientWidth) {
      var cs = getComputedStyle(p);
      var inner = p.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
      var tracks = (cs.gridTemplateColumns || '').split(/\s+/).filter(function (s) { return s && s !== 'none'; });
      var cols = tracks.length || 1;
      if (cols > 1) {
        var gap = parseFloat(cs.columnGap || cs.gap) || 0;
        inner = (inner - gap * (cols - 1)) / cols;
      }
      w = inner;
    }
    if (!w || w < 1) {
      cv.style.width = '';
      w = cv.getBoundingClientRect().width;
      if (!w || w < 1) w = prev ? parseFloat(prev) : 0;
    }
    return { w: Math.max(200, Math.round(w) || 640), prev: prev };
  }
  View.prototype.fit = function () {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = measureWidth(this.cv).w;
    var h = this.box.h || (w < 560 ? 236 : 320);
    this.cv.style.width = w + 'px'; this.cv.style.height = h + 'px';
    this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.W = w; this.H = h;
    return this;
  };
  View.prototype.px = function (x) { var p = this.pad; return p.l + (x - this.x0) / (this.x1 - this.x0) * (this.W - p.l - p.r); };
  View.prototype.py = function (y) { var p = this.pad; return this.H - p.b - (y - this.y0) / (this.y1 - this.y0) * (this.H - p.t - p.b); };
  View.prototype.ux = function (sx) { var p = this.pad; return this.x0 + (sx - p.l) / (this.W - p.l - p.r) * (this.x1 - this.x0); };
  View.prototype.uy = function (sy) { var p = this.pad; return this.y0 + (this.H - p.b - sy) / (this.H - p.t - p.b) * (this.y1 - this.y0); };
  View.prototype.reset = function () { var b = this.box; this.x0 = b.x0; this.x1 = b.x1; this.y0 = b.y0; this.y1 = b.y1; };
  View.prototype.pan = function (dxPx, dyPx) {
    var kx = (this.x1 - this.x0) / (this.W - this.pad.l - this.pad.r);
    var ky = (this.y1 - this.y0) / (this.H - this.pad.t - this.pad.b);
    this.x0 -= dxPx * kx; this.x1 -= dxPx * kx;
    this.y0 += dyPx * ky; this.y1 += dyPx * ky;
  };

  View.prototype.clear = function () {
    var c = this.ctx, P = pal(), p = this.pad;
    var x = p.l, y = p.t, w = this.W - p.l - p.r, h = this.H - p.t - p.b;
    c.clearRect(0, 0, this.W, this.H);
    c.save();
    /* 画布底：自上而下的极淡渐变 + 圆角描边（alpha 均低于 inkRatio 的墨迹阈值） */
    var g = c.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, P.plate0); g.addColorStop(1, P.plate1);
    roundRect(c, x, y, w, h, 9);
    c.fillStyle = g; c.fill();
    roundRect(c, x + .5, y + .5, w - 1, h - 1, 8.5);
    c.strokeStyle = P.edge; c.lineWidth = 1; c.stroke();
    c.restore();
  };

  View.prototype.axes = function (o) {
    o = o || {};
    this.clear();
    var P = pal(), c = this.ctx, p = this.pad, v = this;
    var sx = niceStep(this.x1 - this.x0, Math.max(3, Math.round((this.W - p.l - p.r) / 88)));
    var sy = niceStep(this.y1 - this.y0, Math.max(2, Math.round((this.H - p.t - p.b) / 58)));
    var i, xs = [], ys = [];
    for (i = Math.ceil(this.x0 / sx) * sx; i <= this.x1 + 1e-9; i += sx) xs.push(i);
    for (i = Math.ceil(this.y0 / sy) * sy; i <= this.y1 + 1e-9; i += sy) ys.push(i);
    var L = p.l, R = this.W - p.r, T = p.t, B = this.H - p.b;
    var ax = Math.min(Math.max(this.py(0), T), B);      // x 轴所在像素行
    var ay = Math.min(Math.max(this.px(0), L), R);      // y 轴所在像素列
    c.save();
    /* ① 网格 */
    if (!o.noGrid) {
      c.strokeStyle = P.grid; c.lineWidth = 1; c.beginPath();
      xs.forEach(function (x) { var q = Math.round(v.px(x)) + .5; if (q > L && q < R) { c.moveTo(q, T); c.lineTo(q, B); } });
      ys.forEach(function (y) { var q = Math.round(v.py(y)) + .5; if (q > T && q < B) { c.moveTo(L, q); c.lineTo(R, q); } });
      c.stroke();
    }
    /* ② 坐标轴 */
    c.strokeStyle = P.axis; c.lineWidth = 1.3; c.lineCap = 'round'; c.beginPath();
    c.moveTo(L, Math.round(ax) + .5); c.lineTo(R, Math.round(ax) + .5);
    c.moveTo(Math.round(ay) + .5, T); c.lineTo(Math.round(ay) + .5, B);
    c.stroke();
    /* ③ 轴端箭头 */
    var cap = 6.5;
    c.fillStyle = P.axis;
    c.beginPath(); c.moveTo(R + 1.5, ax); c.lineTo(R - cap, ax - 3.2); c.lineTo(R - cap, ax + 3.2); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(ay, T - 1.5); c.lineTo(ay - 3.2, T + cap); c.lineTo(ay + 3.2, T + cap); c.closePath(); c.fill();
    /* ④ 刻度短线（朝向画面内侧） */
    c.strokeStyle = P.tick; c.lineWidth = 1; c.beginPath();
    xs.forEach(function (x) {
      if (Math.abs(x) < 1e-9) return;
      var q = Math.round(v.px(x)) + .5; if (q < L + 1 || q > R - 1) return;
      c.moveTo(q, ax); c.lineTo(q, ax + (ax < B - 9 ? 5 : -5));
    });
    ys.forEach(function (y) {
      if (Math.abs(y) < 1e-9) return;
      var q = Math.round(v.py(y)) + .5; if (q < T + 1 || q > B - 1) return;
      c.moveTo(ay, q); c.lineTo(ay + (ay < R - 9 ? 5 : -5), q);
    });
    c.stroke();
    /* ⑤ 刻度数字：轴贴边时自动落到画面侧，两侧边缘留白避免裁切 */
    var fs = this.W < 560 ? 10.5 : 11.5;
    c.fillStyle = P.muted; c.font = fs + 'px "Segoe UI", "Microsoft YaHei", sans-serif';
    var below = ax < B - 24;
    c.textAlign = 'center'; c.textBaseline = 'top';
    xs.forEach(function (x) {
      if (Math.abs(x) < 1e-9) return;
      var q = v.px(x); if (q < L + 7 || q > R - 7) return;
      haloText(c, fmt(x, 2), q, below ? ax + 7 : ax - fs - 8, P.muted, fs);
    });    c.textAlign = 'right'; c.textBaseline = 'middle';
    var rightSide = ay < L + 28;
    ys.forEach(function (y) {
      if (Math.abs(y) < 1e-9) return;
      var q = v.py(y); if (q < T + 5 || q > B - 5) return;
      haloText(c, fmt(y, 2), rightSide ? ay + 6 : ay - 7, q, P.muted, fs);
    });
    /* ⑥ 轴名 x / y */
    c.fillStyle = P.muted; c.font = 'italic 12.5px "Segoe UI", "Microsoft YaHei", sans-serif';
    c.textAlign = 'right'; c.textBaseline = 'bottom';
    haloText(c, 'x', R - 2, ax - 5, P.muted, 12.5);
    c.textAlign = 'left'; c.textBaseline = 'top';
    haloText(c, 'y', ay + 7, T + 1, P.muted, 12.5);
    /* ⑦ 原点 O */
    if (ay > L + 7 && ay < R - 7 && ax > T + 7 && ax < B - 7) {
      c.fillStyle = P.muted; c.font = fs + 'px "Segoe UI", "Microsoft YaHei", sans-serif';
      c.textAlign = 'right'; c.textBaseline = 'top';
      haloText(c, 'O', ay - 4, ax + 3, P.muted, fs);
    }
    c.restore();
  };

  View.prototype.fn = function (f, o) {
    o = o || {};
    var P = pal(), c = this.ctx, v = this;
    c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
    if (o.dash) c.setLineDash(o.dash);
    /* 采样一次建路径，之后可按需描两遍（柔和光晕 + 实线），曲线因此有立体感 */
    var build = function () {
      c.beginPath();
      var on = false, pyPrev = null;
      for (var sx = v.pad.l; sx <= v.W - v.pad.r; sx += 1) {
        var x = v.ux(sx), y = f(x);
        if (!isFinite(y)) { on = false; continue; }
        var py = v.py(y);
        if (py < -4000 || py > 4000) { on = false; continue; }
        if (on && pyPrev !== null && Math.abs(py - pyPrev) > (v.H * 1.6)) on = false;   // 垂直渐近线断开
        if (!on) { c.moveTo(sx, py); on = true; } else c.lineTo(sx, py);
        pyPrev = py;
      }
    };
    var w0 = o.w || 2.1;
    if (o.glow !== false && !o.dash) { build(); c.strokeStyle = o.glowColor || P.glow; c.lineWidth = w0 * 3.4; c.stroke(); }
    build(); c.strokeStyle = o.color || P.curve; c.lineWidth = w0; c.stroke();
    c.restore();
  };

  View.prototype.param = function (fx, fy, t0, t1, o) {
    o = o || {};
    var P = pal(), c = this.ctx, n = o.n || 900;
    c.save(); c.strokeStyle = o.color || P.curve; c.lineWidth = o.w || 2.1;
    if (o.dash) c.setLineDash(o.dash);
    if (o.fill) c.fillStyle = o.fill;
    c.beginPath();
    for (var i = 0; i <= n; i++) {
      var t = t0 + (t1 - t0) * i / n;
      var px = this.px(fx(t)), py = this.py(fy(t));
      if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    if (o.fill) { c.closePath(); c.fill(); }
    c.stroke(); c.restore();
  };

  View.prototype.line = function (x1, y1, x2, y2, o) {
    o = o || {}; var c = this.ctx, P = pal();
    c.save(); c.strokeStyle = o.color || P.curve2; c.lineWidth = o.w || 1.6;
    if (o.dash) c.setLineDash(o.dash);
    c.beginPath(); c.moveTo(this.px(x1), this.py(y1)); c.lineTo(this.px(x2), this.py(y2));
    c.stroke(); c.restore();
  };

  View.prototype.rect = function (x1, y1, x2, y2, o) {
    o = o || {}; var c = this.ctx, P = pal();
    var a = this.px(x1), b = this.py(y1), w = this.px(x2) - a, h = this.py(y2) - b;
    c.save();
    if (o.fill) { c.fillStyle = o.fill; c.fillRect(a, b, w, h); }
    if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = o.w || 1; c.strokeRect(a + .5, b + .5, w - 1, h - 1); }
    c.restore();
  };

  View.prototype.dot = function (x, y, o) {
    o = o || {}; var c = this.ctx, P = pal();
    var X = this.px(x), Y = this.py(y), r = o.r || 4.5;
    c.save();
    c.fillStyle = o.color || P.dot;
    c.beginPath(); c.arc(X, Y, r, 0, Math.PI * 2); c.fill();
    /* 亮芯：标记呈现"靶心"质感，比纯色实心圆更清楚（默认开，solid:true 可关） */
    if (o.solid !== true) {
      c.fillStyle = o.inner || P.dotIn;
      c.beginPath(); c.arc(X, Y, Math.max(1, r * .42), 0, Math.PI * 2); c.fill();
    }
    if (o.ring) {
      c.strokeStyle = o.ringColor || P.text; c.lineWidth = 1.2;
      c.beginPath(); c.arc(X, Y, r + 1.3, 0, Math.PI * 2); c.stroke();
    }
    c.restore();
  };

  View.prototype.arrow = function (x1, y1, x2, y2, o) {
    o = o || {}; var c = this.ctx, P = pal();
    var ax = this.px(x1), ay = this.py(y1), bx = this.px(x2), by = this.py(y2);
    var dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
    if (len < 1) return;
    var hd = Math.min(9, len * 0.4), ux = dx / len, uy = dy / len;
    c.save(); c.strokeStyle = o.color || P.curve3; c.fillStyle = c.strokeStyle;
    c.lineWidth = o.w || 1.6;
    c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx - ux * hd * .6, by - uy * hd * .6); c.stroke();
    c.beginPath();
    c.moveTo(bx, by);
    c.lineTo(bx - ux * hd - uy * hd * .38, by - uy * hd + ux * hd * .38);
    c.lineTo(bx - ux * hd + uy * hd * .38, by - uy * hd - ux * hd * .38);
    c.closePath(); c.fill(); c.restore();
  };

  View.prototype.poly = function (pts, o) {
    o = o || {}; var c = this.ctx, P = pal(), v = this;
    c.save();
    c.beginPath();
    pts.forEach(function (p, i) { var X = v.px(p[0]), Y = v.py(p[1]); if (i) c.lineTo(X, Y); else c.moveTo(X, Y); });
    if (o.close) c.closePath();
    if (o.fill) { c.fillStyle = o.fill; c.fill(); }
    if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = o.w || 1.6; c.stroke(); }
    c.restore();
  };

  View.prototype.text = function (x, y, s, o) {
    o = o || {}; var c = this.ctx, P = pal();
    c.save();
    var size = o.size || 12.5;
    c.font = size + 'px "Segoe UI", "Microsoft YaHei", sans-serif';
    var al = o.align || 'left', bs = o.base || 'middle';
    c.textAlign = al; c.textBaseline = bs;
    var fg = o.color || P.text, X = this.px(x), Y = this.py(y), dx = 0, dy = 0;
    /* 按实际文本宽度与 em 高算出文字盒，把整块文字钳进画布内 —— 标注再靠边也不会被裁掉 */
    var w = c.measureText(s).width, hgt = size * 1.18;
    var bx = X, by = Y;
    if (al === 'center') bx -= w / 2; else if (al === 'right') bx -= w;
    if (bs === 'middle') by -= hgt / 2; else if (bs === 'top') by -= 2;
    /* 留出描边/底衬的外扩量，连轮廓一起也不会碰到画布边缘 */
    var pad = Math.max(7, Math.ceil(size * 0.3 / 2) + 2);
    var cx = Math.min(Math.max(bx, pad), Math.max(pad, this.W - w - pad));
    var cy = Math.min(Math.max(by, pad), Math.max(pad, this.H - hgt - pad));
    dx = cx - bx; dy = cy - by;
    var hasBg = solidBg(o.bg);
    /* 光晕描边代替方块底衬：字形自带一圈反差色轮廓，压在任何曲线/网格上都读得清，又不糊成黑块。
       传 o.halo === false 关闭；传颜色字符串自定义；有自定义底衬时自动让位给底衬。 */
    if (o.halo !== false && !hasBg) {
      c.lineJoin = 'round'; c.lineCap = 'round';
      c.lineWidth = Math.max(2.6, size * 0.3);
      c.strokeStyle = (o.halo && o.halo !== true) ? o.halo : P.halo;
      c.strokeText(s, X + dx, Y + dy);
    }
    if (hasBg) {
      var bwd = w + 8, bht = size + 7;
      roundRect(c, cx - 4, cy - (bht - hgt) / 2, bwd, bht, 4);
      c.fillStyle = o.bg; c.fill();
      if (o.bgEdge) { c.strokeStyle = o.bgEdge; c.lineWidth = 1; c.stroke(); }
    }
    c.fillStyle = fg;
    c.fillText(s, X + dx, Y + dy);
    c.restore();
  };

  /* 拖拽平移（实验台通用） */
  function makePannable(v, redraw) {
    var dragging = false, lx = 0, ly = 0, moved = false;
    var cv = v.cv;
    cv.style.cursor = 'grab';
    cv.addEventListener('pointerdown', function (e) {
      dragging = true; moved = false; lx = e.clientX; ly = e.clientY;
      cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing';
    });
    cv.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lx, dy = e.clientY - ly;
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      lx = e.clientX; ly = e.clientY;
      v.pan(dx, dy); redraw();
    });
    function up(e) {
      if (!dragging) return;
      dragging = false; cv.style.cursor = 'grab';
      try { cv.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    return { moved: function () { return moved; } };
  }

  /* 热力图 + 等高线（用于二元函数可视化） */
  View.prototype.heat = function (f, o) {
    o = o || {};
    var p = this.pad, step = o.step || 3, P = pal();
    var cw = Math.max(2, Math.round((this.W - p.l - p.r) / step));
    var chh = Math.max(2, Math.round((this.H - p.t - p.b) / step));
    var off = document.createElement('canvas'); off.width = cw; off.height = chh;
    var octx = off.getContext('2d'), img = octx.createImageData(cw, chh);
    var vals = new Float64Array(cw * chh), mn = Infinity, mx = -Infinity, i, j, k, val, x, y;
    for (j = 0; j < chh; j++) {
      y = this.y1 - (j + .5) / chh * (this.y1 - this.y0);
      for (i = 0; i < cw; i++) {
        x = this.x0 + (i + .5) / cw * (this.x1 - this.x0);
        val = f(x, y); vals[j * cw + i] = val;
        if (isFinite(val)) { if (val < mn) mn = val; if (val > mx) mx = val; }
      }
    }
    if (!isFinite(mn)) { mn = 0; mx = 1; }
    var rgb = o.rgb || [215, 171, 97];   /* 新站固定深色：热力色对齐 const-yellow */
    for (k = 0; k < cw * chh; k++) {
      val = vals[k];
      var t = isFinite(val) && mx > mn ? (val - mn) / (mx - mn) : 0;
      img.data[k * 4] = rgb[0]; img.data[k * 4 + 1] = rgb[1]; img.data[k * 4 + 2] = rgb[2];
      img.data[k * 4 + 3] = Math.round(10 + 52 * (o.invert ? 1 - t : t));
    }
    // 等高线：相邻格跨过等值面则描点
    var lv = o.levels, levels = [];
    if (lv === undefined) {
      var st = niceStep(mx - mn || 1, 7);
      for (var L = Math.ceil(mn / st) * st; L <= mx + 1e-9; L += st) levels.push(L);
    } else if (lv) levels = lv;
    levels.forEach(function (L) {
      for (var jj = 0; jj < chh - 1; jj++) {
        for (var ii = 0; ii < cw - 1; ii++) {
          var a = vals[jj * cw + ii], b = vals[jj * cw + ii + 1], c2 = vals[(jj + 1) * cw + ii];
          if (isFinite(a) && ((a - L) * (b - L) <= 0 || (a - L) * (c2 - L) <= 0)) {
            var kk = (jj * cw + ii) * 4;
            img.data[kk] = rgb[0]; img.data[kk + 1] = rgb[1]; img.data[kk + 2] = rgb[2];
            img.data[kk + 3] = 132;
          }
        }
      }
    });
    octx.putImageData(img, 0, 0);
    var c = this.ctx;
    c.save();
    c.imageSmoothingEnabled = true;
    c.drawImage(off, p.l, p.t, this.W - p.l - p.r, this.H - p.t - p.b);
    c.restore();
  };

  /* ---------------- 实验台注册 ---------------- */
  var LABS = [];
  function lab(o) { LABS.push(o); }

  /* 卡片文本一律转义后再拼进 innerHTML：tex 里的 "<"（如 mvt 的 a<c<b）会被 HTML 解析器
     当成标签起始，公式连同后面的结构一起被吃掉（实测该台整条公式消失）。 */
  function labEsc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  /* 说明文字允许少量行内标签（<b> 等），但只有"确实是标签"的 "<" 才放行：
     "<b>"、</b> 保留，而 ζ<1、0<b<1、< 0 这类比较符号转义，避免再次撑坏卡片结构。 */
  function labNoteHTML(s) {
    return String(s == null ? '' : s).replace(/<(?!\/?(?:b|i|em|strong|code|br|sub|sup)(?=[\s>\/]))/gi, '&lt;');
  }

  /* 统一展示顺序：按章号升序，同章保持注册顺序；索引与卡片共用，编号才对得上 */
  var LAB_ORDER = null;
  function labOrder() {
    if (!LAB_ORDER) {
      LAB_ORDER = LABS.slice().sort(function (a, b) {
        if (a.ch !== b.ch) return a.ch < b.ch ? -1 : 1;
        return LABS.indexOf(a) - LABS.indexOf(b);
      });
    }
    return LAB_ORDER;
  }
  function labNo(L) { return labOrder().indexOf(L) + 1; }

  /* =====================================================================
     线代数值工具（全部解析解，不引外部库）
     ---------------------------------------------------------------------
     约定：向量 = [x, y]；2×2 矩阵 = [[a, b], [c, d]]（行优先）。
     所有会除零的地方都先做奇异判定，滑块拉到端点也不会冒出 NaN/Infinity。
     ===================================================================== */

  function det2(a, b, c, d) { return a * d - b * c; }

  function det3(m) {
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
         - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
         + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  }

  /* 2×2 逆矩阵；奇异返回 null（调用方负责显示"奇异"） */
  function inv2(a, b, c, d) {
    var D = det2(a, b, c, d);
    if (Math.abs(D) < 1e-10) return null;
    return [[d / D, -b / D], [-c / D, a / D]];
  }

  function mul2(A, B) {
    return [
      [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
      [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
    ];
  }

  function app2(A, x, y) {
    return [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y];
  }

  function dot2(ax, ay, bx, by) { return ax * bx + ay * by; }
  function len2(x, y) { return Math.sqrt(x * x + y * y); }
  function unit2(x, y) {
    var L = len2(x, y);
    return L > 1e-12 ? [x / L, y / L] : [0, 0];
  }
  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
  function angDeg(x, y) { return Math.atan2(y, x) * 180 / Math.PI; }

  /* 2×2 方程组（Cramer）：[[a,b],[c,d]] x = [p,q]；det=0 返回 null */
  function solve2(a, b, c, d, p, q) {
    var D = det2(a, b, c, d);
    if (Math.abs(D) < 1e-10) return null;
    return [(p * d - b * q) / D, (a * q - p * c) / D];
  }

  /* 特征向量：解 (A − λI)x = 0，两行中挑非零的一行 */
  function evec2(a, b, c, d, lam) {
    var cand = null;
    if (len2(b, lam - a) > 1e-11) cand = [b, lam - a];
    else if (len2(lam - d, c) > 1e-11) cand = [lam - d, c];
    else cand = [1, 0];
    return unit2(cand[0], cand[1]);
  }

  /* 2×2 特征值：判别式 ≥ 0 实特征对，否则一对共轭复根（旋转型） */
  function eig2(A) {
    var a = A[0][0], b = A[0][1], c = A[1][0], d = A[1][1];
    var tr = a + d, D = a * d - b * c, disc = tr * tr - 4 * D;
    if (disc >= -1e-12) {
      var s = Math.sqrt(Math.max(0, disc)), l1 = (tr + s) / 2, l2 = (tr - s) / 2;
      return {
        real: true, l1: l1, l2: l2, tr: tr, det: D,
        v1: evec2(a, b, c, d, l1), v2: evec2(a, b, c, d, l2)
      };
    }
    return {
      real: false, re: tr / 2, im: Math.sqrt(-disc) / 2,
      tr: tr, det: D, v1: [0, 0], v2: [0, 0]
    };
  }

  /* 2×2 SVD（解析）：σ 从 AᵀA 的特征值开方；U 由 U = AV/Σ 定符号，
     因此 A = UΣVᵀ 在数值上逐项成立，且恒有 σ1 ≥ σ2 ≥ 0。 */
  function svd2(A) {
    var a = A[0][0], b = A[0][1], c = A[1][0], d = A[1][1];
    var p = a * a + c * c, q = a * b + c * d, r = b * b + d * d;   /* AᵀA = [[p,q],[q,r]] */
    var mid = (p + r) / 2, dif = (p - r) / 2;
    var rad = Math.sqrt(dif * dif + q * q);
    var lam1 = Math.max(0, mid + rad), lam2 = Math.max(0, mid - rad);
    var s1 = Math.sqrt(lam1), s2 = Math.sqrt(lam2);
    var v1 = (Math.abs(q) > 1e-12) ? unit2(q, lam1 - p) : (p >= r ? [1, 0] : [0, 1]);
    if (!isFinite(v1[0]) || (v1[0] === 0 && v1[1] === 0)) v1 = [1, 0];
    var v2 = [-v1[1], v1[0]];
    var av1 = app2(A, v1[0], v1[1]), av2 = app2(A, v2[0], v2[1]);
    var u1 = s1 > 1e-12 ? unit2(av1[0], av1[1]) : [1, 0];
    if (u1[0] === 0 && u1[1] === 0) u1 = [1, 0];
    var u2 = s2 > 1e-12 ? unit2(av2[0], av2[1]) : [-u1[1], u1[0]];
    if (u2[0] === 0 && u2[1] === 0) u2 = [-u1[1], u1[0]];
    return { s1: s1, s2: s2, v1: v1, v2: v2, u1: u1, u2: u2, det: det2(a, b, c, d) };
  }

  /* 固定种子的标准正态点云（二维高斯实验台用；一次生成，所有帧复用） */
  var GAUSS_PTS = null;
  function gaussCloud() {
    if (GAUSS_PTS) return GAUSS_PTS;
    var seed = 20261105, out = [], i, u1, u2, rr, th;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (i = 0; i < 320; i++) {
      u1 = Math.max(1e-9, rnd()); u2 = rnd();
      rr = Math.sqrt(-2 * Math.log(u1)); th = 2 * Math.PI * u2;
      out.push([rr * Math.cos(th), rr * Math.sin(th)]);
    }
    GAUSS_PTS = out;
    return out;
  }

  /* ---------------- 画布辅助 ---------------- */

  /* 等比例视图：让"数据里垂直"在屏幕上也垂直。
     只在宽高比偏离时按中心修正一次（保留拖拽平移效果），1:1 aspect 是
     特征向量、投影、直角标记这些图能不能看懂的前提。 */
  function ensureAspect(v) {
    var availW = v.W - v.pad.l - v.pad.r, availH = v.H - v.pad.t - v.pad.b;
    if (!(availW > 0 && availH > 0)) return;
    var target = availW / availH;
    var cur = (v.x1 - v.x0) / (v.y1 - v.y0);
    if (!isFinite(cur) || cur <= 0 || Math.abs(cur - target) < 1e-3) return;
    var cx = (v.x0 + v.x1) / 2, cy = (v.y0 + v.y1) / 2;
    var hw = (v.x1 - v.x0) / 2, hh = (v.y1 - v.y0) / 2;
    if (cur > target) hh = hw / target; else hw = hh * target;
    v.x0 = cx - hw; v.x1 = cx + hw; v.y0 = cy - hh; v.y1 = cy + hh;
  }

  /* ---- 绘图裁剪：图元只落在绘图区（圆角坐标框）内 ----
     滑块拉到头时向量/多边形会超出坐标框（例如行列式拉满时平行四边形跑到
     卡片外、盖住标题），所以给会溢出的图元统一套一层裁剪。写法是包装内核
     方法而不是改内核本身：text 不裁剪（标注要能贴边），其它照旧。 */
  (function () {
    var clipRect = function (v) {
      var c = v.ctx;
      c.beginPath();
      c.rect(v.pad.l, v.pad.t, v.W - v.pad.l - v.pad.r, v.H - v.pad.t - v.pad.b);
      c.clip();
    };
    ['line', 'poly', 'arrow', 'param', 'rect', 'fillBetween', 'dropLine'].forEach(function (m) {
      var orig = View.prototype[m];
      if (typeof orig !== 'function') return;
      View.prototype[m] = function () {
        var c = this.ctx;
        c.save();
        clipRect(this);
        try { return orig.apply(this, arguments); } finally { c.restore(); }
      };
    });
  })();

  /* 直线 A·x + B·y = C 被视图矩形裁剪后的两个端点；不相交返回 null */
  function segLine(v, A, B, C) {
    var pts = [], eps = 1e-9, t, y, x;
    if (Math.abs(B) > eps) {
      y = (C - A * v.x0) / B; if (y >= v.y0 - eps && y <= v.y1 + eps) pts.push([v.x0, y]);
      y = (C - A * v.x1) / B; if (y >= v.y0 - eps && y <= v.y1 + eps) pts.push([v.x1, y]);
    }
    if (Math.abs(A) > eps) {
      x = (C - B * v.y0) / A; if (x >= v.x0 - eps && x <= v.x1 + eps) pts.push([x, v.y0]);
      x = (C - B * v.y1) / A; if (x >= v.x0 - eps && x <= v.x1 + eps) pts.push([x, v.y1]);
    }
    if (pts.length < 2) return null;
    var bi = 0, bj = 1, bd = -1, i, j, dd;
    for (i = 0; i < pts.length; i++) {
      for (j = i + 1; j < pts.length; j++) {
        dd = Math.pow(pts[i][0] - pts[j][0], 2) + Math.pow(pts[i][1] - pts[j][1], 2);
        if (dd > bd) { bd = dd; bi = i; bj = j; }
      }
    }
    return [pts[bi], pts[bj]];
  }

  /* 过原点的直线（方向 u）：返回靠近绘图区边缘、仍在框内的一个点，给直线贴标签用 */
  function edgePoint(v, u, inset) {
    var seg = segLine(v, -u[1], u[0], 0);
    if (!seg) return [u[0] * 2, u[1] * 2];
    var p = seg[0][1] >= seg[1][1] ? seg[0] : seg[1];
    var k = inset === undefined ? 0.93 : inset;
    return [p[0] * k, p[1] * k];
  }

  /* 直角小方块：p = 直角顶点，dir = 其中一条边的方向 */
  function rightAngle(v, p, dir, size, color) {
    var c = v.ctx, P = pal(), s = size || 9;
    var px = v.px(p[0]), py = v.py(p[1]);
    var ux = v.px(p[0] + dir[0]) - px, uy = v.py(p[1] + dir[1]) - py;
    var nx = v.px(p[0] - dir[1]) - px, ny = v.py(p[1] + dir[0]) - py;
    var L1 = Math.hypot(ux, uy), L2 = Math.hypot(nx, ny);
    if (L1 < 1e-9 || L2 < 1e-9) return;
    ux /= L1; uy /= L1; nx /= L2; ny /= L2;
    c.save();
    c.strokeStyle = color || P.muted; c.lineWidth = 1.15;
    c.beginPath();
    c.moveTo(px + ux * s, py + uy * s);
    c.lineTo(px + ux * s + nx * s, py + uy * s + ny * s);
    c.lineTo(px + nx * s, py + ny * s);
    c.stroke();
    c.restore();
  }

  /* 角度弧（数据坐标里逐点连线，因此宽高比不影响形状） */
  function angleArc(v, cx, cy, r, a0, a1, o) {
    o = o || {};
    var n = Math.max(8, o.n || 48), pts = [], i, t;
    for (i = 0; i <= n; i++) {
      t = a0 + (a1 - a0) * i / n;
      pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
    }
    v.poly(pts, { stroke: o.color || pal().curve3, w: o.w || 1.4, fill: o.fill || null, close: !!o.fill });
    return pts;
  }

  /* 矩阵面板：屏幕坐标的 [ ] 矩阵 + 光晕数字，2×2/3×3 与增广矩阵都能用。
     o = { x, y, size, label, sep: 在第 k 列前画竖线（增广矩阵）, hot: [[r,c],…] 高亮（主元）,
           color, textColor, labelColor } */
  function matPanel(v, rows, o) {
    o = o || {};
    var c = v.ctx, P = pal(), fs = o.size || 12.5;
    var strs = rows.map(function (row) {
      return row.map(function (q) { return String(q); });
    });
    var x = o.x === undefined ? v.pad.l + 12 : o.x;
    var y = o.y === undefined ? v.pad.t + 10 : o.y;
    var cols = strs[0].length, maxw = [], j;
    c.save();
    c.font = fs + 'px Consolas, "Courier New", monospace';
    c.textAlign = 'left'; c.textBaseline = 'top';
    for (j = 0; j < cols; j++) maxw[j] = 0;
    strs.forEach(function (row) {
      row.forEach(function (s, k) {
        maxw[k] = Math.max(maxw[k] || 0, c.measureText(s).width);
      });
    });
    var gap = fs * 1.4, w = 0, cellX = [];
    for (j = 0; j < cols; j++) { cellX.push(w); w += maxw[j] + gap; }
    w -= gap;
    var lh = fs * 1.55, h = strs.length * lh;
    if (o.align === 'right') x = v.W - v.pad.r - (w + 12 + (o.label ? 32 : 0)) - 8;
    /* 背衬：矩阵压在网格/箭头之上也要读得清 */
    if (o.bg !== false) {
      c.fillStyle = o.bg || 'rgba(9,13,20,.86)';
      roundRect(c, x - (o.label ? 34 : 8), y - 5, w + 12 + (o.label ? 34 : 8) + 12, h + 10, 4);
      c.fill();
      if (o.bgEdge !== false) { c.strokeStyle = 'rgba(59,78,107,.5)'; c.lineWidth = 1; c.stroke(); }
    }
    c.strokeStyle = o.color || P.curve3; c.lineWidth = 1.3;
    c.beginPath();
    c.moveTo(x + 4, y - 1); c.lineTo(x, y - 1); c.lineTo(x, y + h + 1); c.lineTo(x + 4, y + h + 1);
    c.moveTo(x + 8 + w, y - 1); c.lineTo(x + 12 + w, y - 1); c.lineTo(x + 12 + w, y + h + 1); c.lineTo(x + 8 + w, y + h + 1);
    c.stroke();
    if (o.sep && o.sep < cols) {
      var sx = x + 7 + cellX[o.sep] - gap / 2;
      c.save();
      c.strokeStyle = P.muted; c.lineWidth = 1; c.setLineDash([2, 3]);
      c.beginPath(); c.moveTo(sx, y - 1); c.lineTo(sx, y + h + 1); c.stroke();
      c.restore();
    }
    var hot = {};
    (o.hot || []).forEach(function (hq) { hot[hq[0] + ',' + hq[1]] = 1; });
    strs.forEach(function (row, r2) {
      row.forEach(function (s, k) {
        c.textAlign = 'center'; c.textBaseline = 'top';
        var col = hot[r2 + ',' + k] ? (o.hotColor || P.curve3) : (o.textColor || P.text);
        haloText(c, s, x + 7 + cellX[k] + maxw[k] / 2, y + r2 * lh + fs * 0.16, col, fs);
      });
    });
    if (o.label) {
      c.textAlign = 'right'; c.textBaseline = 'middle';
      haloText(c, o.label, x - 2, y + h / 2, o.labelColor || P.muted, fs);
    }
    c.restore();
    return { w: w + 16, h: h };
  }

  /* 画布上的小注释条：深色背衬 + 光晕文字（像素坐标），避免注释被曲线/网格盖住 */
  function noteBar(v, x, y, text, o) {
    o = o || {};
    var c = v.ctx, P = pal(), fsn = o.size || 10.5;
    c.save();
    c.font = fsn + 'px "Segoe UI", "Microsoft YaHei", sans-serif';
    var w = c.measureText(text).width;
    c.fillStyle = o.bg || 'rgba(9,13,20,.8)';
    roundRect(c, x - 5, y - 3, w + 10, fsn + 9, 3); c.fill();
    if (o.edge) { c.strokeStyle = 'rgba(59,78,107,.5)'; c.lineWidth = 1; c.stroke(); }
    c.textAlign = 'left'; c.textBaseline = 'top';
    haloText(c, text, x, y, o.color || P.muted, fsn);
    c.restore();
    return w;
  }

  function vecStr(x, y, d) { return '(' + fmt(x, d === undefined ? 2 : d) + ', ' + fmt(y, d === undefined ? 2 : d) + ')'; }

  /* 读数取整辅助：把浮点噪声（如投影后 a·e = 1.4e−17、投影 det = −2.8e−17）
     显示成干净的 0，否则学生会以为"垂直"没对齐、或"投影"的行列式不为零。 */
  function num(x, d, tol) {
    if (!isFinite(x)) return '—';
    var t = tol === undefined ? 1e-9 : tol;
    if (Math.abs(x) < t) return '0';
    return fmt(x, d);
  }

  /* 章号徽章：00 总览、01–12 第 N 章、13 附录 A、14 速查表 */
  function chLabel(ch) {
    var c2 = String(ch == null ? '' : ch);
    if (c2 === '00') return '总览';
    if (c2 === '13') return '附录 A';
    if (c2 === '14') return '速查表';
    var n = c2.replace(/^0+/, '');
    return n ? '第 ' + n + ' 章' : '总览';
  }

  /* ============================================================
     内核扩展（2026-10-08）——为逐章实验台补齐图元
     约定：① 一律走 pal() 调色板，随深浅色主题；② 一律 fit() 自适应宽度；
           ③ 每个图元都返回几何/数值结果，"画出来的东西"与"算出来的数"必须对得上；
           ④ 全部纳入 SITE_CANVAS.selfTest()，可在控制台一键自证。
     ============================================================ */

  /* ---- ① 数值步进：过程表与迭代（同时供公式计算器的"步骤详解"复用）---- */

  /* 复化 Simpson 分段过程表
     最小调用示例：SITE_NUM.simpsonTable(function(x){return x*x;},0,1,4).sum  →  0.3333333333333333 */
  function simpsonTable(f, a, b, n) {
    n = Math.max(2, Math.round(n || 4)); if (n % 2) n++;
    var h = (b - a) / n, rows = [], acc = f(a), i, x, fx, coef;
    rows.push({ i: 0, x: a, fx: acc, coef: 1, partial: acc * h / 3 });
    for (i = 1; i <= n; i++) {
      x = a + i * h; fx = f(x); coef = (i === n) ? 1 : (i % 2 ? 4 : 2);
      acc += fx * coef; rows.push({ i: i, x: x, fx: fx, coef: coef, partial: acc * h / 3 });
    }
    return { h: h, n: n, rows: rows, sum: acc * h / 3 };
  }

  /* 二分法迭代表
     最小调用示例：SITE_NUM.bisectTable(function(x){return x*x-2;},0,2,40).root  →  1.4142135623730951 */
  function bisectTable(g, a, b, iters) {
    iters = Math.min(200, Math.max(1, Math.round(iters || 40)));
    var fa = g(a), fb = g(b), rows = [], m, fm, i;
    if (fa * fb > 0) return { rows: [], root: null, reason: '端点同号，区间内不保证有根' };
    for (i = 0; i < iters; i++) {
      m = (a + b) / 2; fm = g(m);
      rows.push({ i: i + 1, a: a, b: b, m: m, fa: fa, fb: fb, fm: fm, err: (b - a) / 2 });
      if (fm === 0) { a = b = m; break; }
      if (fa * fm < 0) { b = m; fb = fm; } else { a = m; fa = fm; }
      if (b - a < 1e-16) break;
    }
    return { rows: rows, root: (a + b) / 2 };
  }

  /* 牛顿法迭代表（dg 为导函数）
     最小调用示例：SITE_NUM.newtonTable(function(x){return Math.cos(x)-x;},function(x){return -Math.sin(x)-1;},1,20).root */
  function newtonTable(g, dg, x0, iters) {
    iters = Math.min(100, Math.max(1, Math.round(iters || 20)));
    var rows = [], x = x0, i, fx, dfx, nx;
    for (i = 0; i < iters; i++) {
      fx = g(x); dfx = dg(x);
      if (!isFinite(fx) || !isFinite(dfx) || dfx === 0) { rows.push({ i: i + 1, x: x, fx: fx, dfx: dfx, next: null }); break; }
      nx = x - fx / dfx;
      rows.push({ i: i + 1, x: x, fx: fx, dfx: dfx, next: nx, err: Math.abs(nx - x) });
      x = nx;
      if (Math.abs(fx) < 1e-15) break;
    }
    return { rows: rows, root: x };
  }

  /* 四阶 Runge–Kutta / 欧拉（一阶初值问题的数值解）
     最小调用示例：SITE_NUM.rk4(function(x,y){return y;},0,1,0.01,100).y  →  2.71828… */
  function rk4(f, x0, y0, h, n) {
    var pts = [[x0, y0]], x = x0, y = y0, i, k1, k2, k3, k4;
    for (i = 0; i < n; i++) {
      k1 = f(x, y); k2 = f(x + h / 2, y + h * k1 / 2); k3 = f(x + h / 2, y + h * k2 / 2); k4 = f(x + h, y + h * k3);
      y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6; x += h;
      pts.push([x, y]);
    }
    return { pts: pts, y: y };
  }
  function euler(f, x0, y0, h, n) {
    var pts = [[x0, y0]], x = x0, y = y0, i;
    for (i = 0; i < n; i++) { y += h * f(x, y); x += h; pts.push([x, y]); }
    return { pts: pts, y: y };
  }

  /* 画布"墨迹比"——非背景像素占比（alpha>80），供自测与回归使用 */
  function inkRatio(cv, step) {
    step = Math.max(1, Math.round(step || 2));
    var c = cv.getContext('2d'), w = cv.width, h = cv.height, img = c.getImageData(0, 0, w, h).data, sig = 0, tot = 0, x, y;
    for (y = 0; y < h; y += step) for (x = 0; x < w; x += step) { tot++; if (img[(y * w + x) * 4 + 3] > 80) sig++; }
    return tot ? sig / tot : 0;
  }

  /* ---- ② 平面图元：带标签的向量箭头、投影虚线、区域填充、极坐标网格 ---- */

  /* 向量箭头：从 (x,y) 出发的 (dx,dy)，返回解析几何量
     最小调用示例：v.vecArrow(0,0,3,4)  →  {len:5, ang:0.9272952180016122, tip:[3,4]} */
  View.prototype.vecArrow = function (x, y, dx, dy, o) {
    o = o || {};
    var x2 = x + dx, y2 = y + dy;
    this.arrow(x, y, x2, y2, o);
    if (o.label) {
      this.text(x2, y2, o.label, { color: o.color || pal().curve3, align: o.align || 'left', bg: o.bg || pal().band, size: o.size || 12 });
    }
    return { len: Math.hypot(dx, dy), ang: Math.atan2(dy, dx), tip: [x2, y2], tipPx: [this.px(x2), this.py(y2)], basePx: [this.px(x), this.py(y)] };
  };

  /* 投影虚线（如：点到坐标轴、向量端点到分量轴）
     最小调用示例：v.dropLine(1,2,1,0)  →  返回两端点 [[1,2],[1,0]] */
  View.prototype.dropLine = function (x1, y1, x2, y2, o) {
    o = o || {}; var c = this.ctx, P = pal();
    c.save(); c.strokeStyle = o.color || P.muted; c.lineWidth = o.w || 1;
    c.setLineDash(o.dash || [4, 3]);
    c.beginPath(); c.moveTo(this.px(x1), this.py(y1)); c.lineTo(this.px(x2), this.py(y2)); c.stroke();
    c.restore();
    return [[x1, y1], [x2, y2]];
  };

  /* 两曲线之间的区域填充（g 省略则填到 y=0）
     最小调用示例：v.fillBetween(Math.sin, null, 0, Math.PI)  →  返回多边形顶点数 */
  View.prototype.fillBetween = function (f, g, a, b, o) {
    o = o || {}; var c = this.ctx, P = pal(), v = this, n = o.n || 240, i, x, pts = [];
    for (i = 0; i <= n; i++) { x = a + (b - a) * i / n; pts.push([x, f(x)]); }
    if (g) { for (i = n; i >= 0; i--) { x = a + (b - a) * i / n; pts.push([x, g(x)]); } }
    else { pts.push([b, 0], [a, 0]); }
    c.save(); c.beginPath();
    pts.forEach(function (p, k) { var X = v.px(p[0]), Y = v.py(p[1]); if (k) c.lineTo(X, Y); else c.moveTo(X, Y); });
    c.closePath();
    var fill = o.fill || P.fill;
    /* 纵向渐变：区域上沿略深、下沿渐隐，比纯色块更有层次（alpha 仍低于墨迹阈值） */
    if (o.grad !== false) {
      var ys = pts.map(function (p) { return v.py(p[1]); });
      var top = Math.min.apply(null, ys), bot = Math.max.apply(null, ys);
      if (isFinite(top) && isFinite(bot) && bot - top > 8) {
        var gr = c.createLinearGradient(0, top, 0, bot);
        gr.addColorStop(0, o.fillHi || P.fillHi || fill);
        gr.addColorStop(1, o.fillLo || P.fillLo || fill);
        fill = gr;
      }
    }
    c.fillStyle = fill; c.fill();
    if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = o.w || 1.4; c.stroke(); }
    c.restore();
    return pts.length;
  };

  /* 区域面积（f−g 在 [a,b] 上的积分，高精度 Simpson，带符号）
     最小调用示例：v.regionArea(Math.sin, null, 0, Math.PI)  →  2 */
  View.prototype.regionArea = function (f, g, a, b) {
    g = g || function () { return 0; };
    return simpson(function (x) { return f(x) - g(x); }, a, b, 4000);
  };

  /* 极坐标网格：同心环 + 放射线 + 角度标注
     最小调用示例：v.polarGrid({rmax:2, rings:4, spokes:12})  →  {rings:4, spokes:12} */
  View.prototype.polarGrid = function (o) {
    o = o || {};
    var c = this.ctx, P = pal(), v = this, rmax = o.rmax || 2, rings = o.rings || 4, spokes = o.spokes || 12, i;
    var cx = this.px(0), cy = this.py(0);
    c.save(); c.strokeStyle = P.grid; c.lineWidth = 1;
    for (i = 1; i <= rings; i++) {
      var r = rmax * i / rings;
      c.beginPath();
      c.ellipse(cx, cy, Math.abs(this.px(r) - cx), Math.abs(this.py(r) - cy), 0, 0, Math.PI * 2);
      c.stroke();
    }
    for (i = 0; i < spokes; i++) {
      var t = i * 2 * Math.PI / spokes;
      c.beginPath(); c.moveTo(cx, cy);
      c.lineTo(this.px(rmax * Math.cos(t)), this.py(rmax * Math.sin(t)));
      c.stroke();
    }
    if (o.labels !== false) {
      c.fillStyle = P.muted; c.font = '10.5px "Segoe UI", "Microsoft YaHei", sans-serif';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      for (i = 0; i < spokes; i++) {
        var a = i * 360 / spokes;
        if (a % 90 === 0) continue;
        var tt = i * 2 * Math.PI / spokes;
        haloText(c, a + '°', this.px(rmax * 1.08 * Math.cos(tt)), this.py(rmax * 1.08 * Math.sin(tt)), P.muted, 10.5);
      }
    }
    c.restore();
    return { rings: rings, spokes: spokes };
  };

  /* 极坐标扇形面积元：画 n 个扇形（以中点半径近似）并返回面积和
     最小调用示例：v.polarFan(function(t){return 2;}, 0, Math.PI/2, 200).sum  →  π/2 */
  View.prototype.polarFan = function (R, th0, th1, n, o) {
    o = o || {}; n = Math.max(1, Math.round(n || 12));
    var c = this.ctx, P = pal(), v = this, sum = 0, cx = this.px(0), cy = this.py(0), i;
    c.save();
    c.fillStyle = o.fill || P.fill2; c.strokeStyle = o.color || P.curve2; c.lineWidth = o.w || 1;
    for (i = 0; i < n; i++) {
      var t0 = th0 + (th1 - th0) * i / n, t1 = th0 + (th1 - th0) * (i + 1) / n, tm = (t0 + t1) / 2;
      var rm = R(tm), rm2 = rm * rm;
      sum += 0.5 * rm2 * (t1 - t0);
      var steps = Math.max(2, Math.ceil((t1 - t0) / 0.05));
      c.beginPath(); c.moveTo(cx, cy);
      for (var k = 0; k <= steps; k++) {
        var t = t0 + (t1 - t0) * k / steps, rr = o.exact ? R(t) : rm;
        c.lineTo(v.px(rr * Math.cos(t)), v.py(rr * Math.sin(t)));
      }
      c.closePath();
      if (o.fill !== false) c.fill();
      if (o.stroke !== false) c.stroke();
    }
    c.restore();
    return { sum: sum, n: n };
  };

  /* 参数曲线弧长（折线逼近；n 越大越准）
     最小调用示例：v.paramLen(Math.cos, Math.sin, 0, 2*Math.PI, 20000)  →  2π */
  View.prototype.paramLen = function (fx, fy, t0, t1, n) {
    n = Math.max(2, Math.round(n || 4000));
    var L = 0, xa = fx(t0), ya = fy(t0), i, t, x, y;
    for (i = 1; i <= n; i++) {
      t = t0 + (t1 - t0) * i / n; x = fx(t); y = fy(t);
      L += Math.hypot(x - xa, y - ya); xa = x; ya = y;
    }
    return L;
  };

  /* ---- ③ 可点击节点图（全书知识依赖地图用）---- */

  /* 画节点图；nodes=[{id,x,y,r,label}]，edges=[[idA,idB]]，o.highlight={id:true}
     最小调用示例：v.nodeGraph([{id:'a',x:0,y:0,label:'A'}],[],{})  →  1 */
  View.prototype.nodeGraph = function (nodes, edges, o) {
    o = o || {};
    var c = this.ctx, P = pal(), v = this, byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });
    c.save();
    (edges || []).forEach(function (e) {
      var A = byId[e[0]], B = byId[e[1]]; if (!A || !B) return;
      var hl = o.highlight && (o.highlight[e[0]] || o.highlight[e[1]]);
      c.strokeStyle = hl ? (o.hlColor || P.curve3) : P.grid;
      c.lineWidth = hl ? 2.2 : 1.2;
      c.beginPath(); c.moveTo(v.px(A.x), v.py(A.y)); c.lineTo(v.px(B.x), v.py(B.y)); c.stroke();
    });
    nodes.forEach(function (n) {
      var on = o.highlight && o.highlight[n.id], R = n.r || 14;
      c.beginPath(); c.arc(v.px(n.x), v.py(n.y), R, 0, Math.PI * 2);
      c.fillStyle = on ? (o.onFill || P.fill3) : (o.fill || P.band); c.fill();
      c.strokeStyle = on ? (o.onColor || P.curve3) : (o.color || P.curve); c.lineWidth = on ? 2 : 1.2; c.stroke();
      c.fillStyle = P.text; c.font = '11px "Segoe UI", "Microsoft YaHei", sans-serif';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      haloText(c, String(n.label === undefined ? n.id : n.label), v.px(n.x), v.py(n.y), on ? (o.onColor || P.curve3) : P.text, 11);
    });
    c.restore();
    return nodes.length;
  };

  /* 命中判定（屏幕坐标，命中半径 ≥22px → 直径 ≥44px，满足触屏最小点击区）
     最小调用示例：v.hitNode([{id:'a',x:0,y:0}], v.px(0)+5, v.py(0))  →  'a' */
  View.prototype.hitNode = function (nodes, sx, sy) {
    var best = null, bd = Infinity;
    nodes.forEach(function (n) {
      var d = Math.hypot(sx - this.px(n.x), sy - this.py(n.y));
      var R = Math.max(22, n.r || 14);
      if (d <= R && d < bd) { bd = d; best = n.id; }
    }, this);
    return best;
  };

  /* 点击回调：回调收到 (id|null, 事件) */
  function makeClickable(v, getNodes, onPick) {
    var cv = v.cv;
    cv.style.cursor = 'pointer';
    cv.addEventListener('click', function (e) {
      var r = cv.getBoundingClientRect();
      var id = v.hitNode(getNodes(), e.clientX - r.left, e.clientY - r.top);
      onPick(id, e);
    });
  }

  /* ---- ④ 三维正交投影视图 View3 ----
     坐标约定：世界 z 轴向上；相机绕 z 轴转 yaw、抬高 pitch；正交投影（无透视）。
     projMath 是纯数学（归一化 u/v/深度 d），project 再做屏幕映射，两者分开便于自证。 */

  function View3(cv, box) {
    this.cv = cv; this.ctx = cv.getContext('2d'); this.box = box;
    this.labels = [];   /* text3 每画一个标签就登记一次包围盒 */
    /* labelAuto=true：text3 只登记，等 flushLabels() 按当前画布几何统一避让排布。
       理由：渲染宽高比各不相同（652×320 / 710×320 / 866×320 / 302×236），静态偏移会在某些档位压字。 */
    this.deferLabels = !!box.labelAuto;
    this._pend = [];
    this.x0 = box.x0; this.x1 = box.x1; this.y0 = box.y0; this.y1 = box.y1;
    this.z0 = box.z0 === undefined ? 0 : box.z0; this.z1 = box.z1 === undefined ? 1 : box.z1;
    this.yaw = box.yaw === undefined ? 0.7 : box.yaw;
    this.pitch = box.pitch === undefined ? 0.42 : box.pitch;
    this.zoomK = box.zoomK || 0.94;
    this.pad = box.pad || { l: 42, r: 16, t: 16, b: 26 };
    this.fit();
  }
  View3.prototype.fit = function () {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = measureWidth(this.cv).w;
    var h = this.box.h || (w < 560 ? 236 : 320);
    this.cv.style.width = w + 'px'; this.cv.style.height = h + 'px';
    this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.W = w; this.H = h;
    this.fitScale();
    return this;
  };
  View3.prototype.resetAngles = function () {
    this.yaw = this.box.yaw === undefined ? 0.7 : this.box.yaw;
    this.pitch = this.box.pitch === undefined ? 0.42 : this.box.pitch;
    this.zoomK = this.box.zoomK || 0.94;
    this.fitScale(); return this;
  };
  /* 纯旋转：世界点 → 归一化 (u 向右, v 向上, d 深度：越大越远) */
  View3.prototype.projMath = function (p) {
    var cy = Math.cos(this.yaw), sy = Math.sin(this.yaw);
    var cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    var x = p[0], y = p[1], z = p[2];
    var u = x * cy - y * sy;
    var t = x * sy + y * cy;
    return { u: u, v: t * sp + z * cp, d: t * cp - z * sp };
  };
  View3.prototype.corners = function () {
    var o = [], i, j, k, xs = [this.x0, this.x1], ys = [this.y0, this.y1], zs = [this.z0, this.z1];
    for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) for (k = 0; k < 2; k++) o.push([xs[i], ys[j], zs[k]]);
    return o;
  };
  /* 按当前 yaw/pitch 把整个 box 自适应铺满可用区 */
  View3.prototype.fitScale = function () {
    var c = this.corners(), us = [], vs = [], i;
    for (i = 0; i < c.length; i++) { var q = this.projMath(c[i]); us.push(q.u); vs.push(q.v); }
    var u0 = Math.min.apply(null, us), u1 = Math.max.apply(null, us);
    var v0 = Math.min.apply(null, vs), v1 = Math.max.apply(null, vs);
    var availW = this.W - this.pad.l - this.pad.r, availH = this.H - this.pad.t - this.pad.b;
    this.du = (u1 - u0) || 1; this.dv = (v1 - v0) || 1;
    this.scale = Math.min(availW / this.du, availH / this.dv) * this.zoomK;
    this.cx = this.pad.l + availW / 2 - (u0 + u1) / 2 * this.scale;
    this.cy = this.pad.t + availH / 2 + (v0 + v1) / 2 * this.scale;
    return this;
  };
  /* 屏幕映射：返回 [px, py, 深度] */
  View3.prototype.project = function (x, y, z) {
    var p = this.projMath([x, y, z]);
    return [this.cx + p.u * this.scale, this.cy - p.v * this.scale, p.d];
  };
  View3.prototype.setAngles = function (yaw, pitch) {
    this.yaw = yaw; if (pitch !== undefined) this.pitch = pitch;
    this.fitScale(); return this;
  };
  View3.prototype.spin = function (dYaw, dPitch) {
    this.yaw += dYaw || 0;
    if (dPitch) this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch + dPitch));
    this.fitScale(); return this;
  };
  View3.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.W, this.H);
    this.labels = [];   /* 每帧重置标签包围盒（供「标签两两不相交」程序化检测） */
    this._pend = [];    /* 同时丢弃上一帧没来得及 flush 的待放标签，避免跨帧累积 */
    var P = pal(), c = this.ctx, p = this.pad;
    var x = p.l, y = p.t, w = this.W - p.l - p.r, h = this.H - p.t - p.b;
    c.save();
    /* 与二维视图统一的圆角渐变底 */
    var g = c.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, P.plate0); g.addColorStop(1, P.plate1);
    roundRect(c, x, y, w, h, 9); c.fillStyle = g; c.fill();
    roundRect(c, x + .5, y + .5, w - 1, h - 1, 8.5);
    c.strokeStyle = P.edge; c.lineWidth = 1; c.stroke();
    c.restore();
  };
  View3.prototype.line3 = function (p1, p2, o) {
    o = o || {};
    var c = this.ctx, A = this.project(p1[0], p1[1], p1[2]), B = this.project(p2[0], p2[1], p2[2]);
    c.save(); c.strokeStyle = o.color || pal().curve; c.lineWidth = o.w || 1.6;
    if (o.dash) c.setLineDash(o.dash);
    c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke(); c.restore();
    return [A, B];
  };
  View3.prototype.axes3 = function (o) {
    o = o || {};
    this.clear();
    var P = pal(), c = this.ctx, v = this, zG = this.z0;
    if (o.grid !== false) {
      var nx = o.nx || 6, ny = o.ny || 6, i, t;
      c.save(); c.strokeStyle = P.grid; c.lineWidth = 1;
      for (i = 0; i <= nx; i++) {
        t = this.x0 + (this.x1 - this.x0) * i / nx;
        c.beginPath();
        var A = v.project(t, this.y0, zG), B = v.project(t, this.y1, zG);
        c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke();
      }
      for (i = 0; i <= ny; i++) {
        t = this.y0 + (this.y1 - this.y0) * i / ny;
        c.beginPath();
        var C = v.project(this.x0, t, zG), D = v.project(this.x1, t, zG);
        c.moveTo(C[0], C[1]); c.lineTo(D[0], D[1]); c.stroke();
      }
      c.restore();
    }
    this.line3([this.x0, 0, 0], [this.x1, 0, 0], { color: P.axis, w: 1.3 });
    this.line3([0, this.y0, 0], [0, this.y1, 0], { color: P.axis, w: 1.3 });
    this.line3([0, 0, this.z0], [0, 0, this.z1], { color: P.axis, w: 1.3 });
    var L = o.label || ['x', 'y', 'z'], k, d, ends = [[this.x1, 0, 0], [0, this.y1, 0], [0, 0, this.z1]];
    for (k = 0; k < 3; k++) {
      d = this.tipDir([0, 0, 0], ends[k], 20);   /* 轴标签沿轴向外推，避免压住场内图元 */
      this.text3(ends[k][0], ends[k][1], ends[k][2], L[k], { color: P.muted, dx: d.dx, dy: d.dy, align: d.align });
    }
    return this;
  };
  /* 屏幕方向外推：从 from 指向 to 的单位方向 × len 像素（标签避让用），返回 {dx,dy,align} */
  View3.prototype.tipDir = function (from, to, len) {
    var a = this.project(from[0], from[1], from[2]), b = this.project(to[0], to[1], to[2]);
    var dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy), L = len || 15;
    if (d < 1e-6) return { dx: 0, dy: -L, align: 'left' };
    var ux = dx / d * L, uy = dy / d * L;
    return { dx: ux, dy: uy, align: ux < -4 ? 'right' : 'left' };
  };
  /* 线框曲面（f(x,y) → z），按深度排序绘制，可带高度着色
     最小调用示例：v3.surface3(function(x,y){return Math.sin(x*x+y*y)/2;},{nu:18,nv:18}) */
  View3.prototype.surface3 = function (f, o) {
    o = o || {};
    var c = this.ctx, P = pal(), v = this, nu = o.nu || 16, nv = o.nv || 16, i, j, cells = [];
    var zmin = Infinity, zmax = -Infinity;
    for (i = 0; i <= nu; i++) for (j = 0; j <= nv; j++) {
      var zz = f(this.x0 + (this.x1 - this.x0) * i / nu, this.y0 + (this.y1 - this.y0) * j / nv);
      if (isFinite(zz)) { if (zz < zmin) zmin = zz; if (zz > zmax) zmax = zz; }
    }
    for (i = 0; i < nu; i++) for (j = 0; j < nv; j++) {
      var xa = this.x0 + (this.x1 - this.x0) * i / nu, xb = this.x0 + (this.x1 - this.x0) * (i + 1) / nu;
      var ya = this.y0 + (this.y1 - this.y0) * j / nv, yb = this.y0 + (this.y1 - this.y0) * (j + 1) / nv;
      var za = f(xa, ya), zb = f(xb, ya), zc = f(xb, yb), zd = f(xa, yb);
      if (!isFinite(za) || !isFinite(zb) || !isFinite(zc) || !isFinite(zd)) continue;
      cells.push({ pts: [v.project(xa, ya, za), v.project(xb, ya, zb), v.project(xb, yb, zc), v.project(xa, yb, zd)],
        z: (za + zb + zc + zd) / 4 });
    }
    cells.sort(function (A, B) { return B.pts[0][2] - A.pts[0][2]; });   // 远的先画
    var span = (zmax - zmin) || 1;
    c.save();
    cells.forEach(function (cell) {
      c.beginPath();
      cell.pts.forEach(function (p, k) { if (k) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); });
      c.closePath();
      if (o.fill !== false) {
        var t = (cell.z - zmin) / span;
        c.fillStyle = o.fill || (t > 0.5 ? P.fill : P.fill2);
        c.fill();
      }
      c.strokeStyle = o.color || P.curve;
      c.lineWidth = o.w || 0.9;
      c.stroke();
    });
    c.restore();
    return cells.length;
  };
  View3.prototype.curve3 = function (fx, fy, fz, t0, t1, o) {
    o = o || {};
    var c = this.ctx, P = pal(), n = o.n || 300, i, first = true;
    c.save(); c.strokeStyle = o.color || P.curve3; c.lineWidth = o.w || 2.2; c.lineJoin = 'round';
    if (o.dash) c.setLineDash(o.dash);
    c.beginPath();
    for (i = 0; i <= n; i++) {
      var t = t0 + (t1 - t0) * i / n, p = this.project(fx(t), fy(t), fz(t));
      if (first) { c.moveTo(p[0], p[1]); first = false; } else c.lineTo(p[0], p[1]);
    }
    c.stroke(); c.restore();
    return n + 1;
  };
  View3.prototype.arrow3 = function (x1, y1, z1, x2, y2, z2, o) {
    o = o || {};
    var c = this.ctx, P = pal(), A = this.project(x1, y1, z1), B = this.project(x2, y2, z2);
    var dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy);
    c.save();
    c.strokeStyle = o.color || P.curve4; c.fillStyle = c.strokeStyle; c.lineWidth = o.w || 2;
    c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke();
    if (len > 1) {
      var ux = dx / len, uy = dy / len, hd = Math.min(11, len * 0.35);
      c.beginPath();
      c.moveTo(B[0], B[1]);
      c.lineTo(B[0] - ux * hd - uy * hd * .38, B[1] - uy * hd + ux * hd * .38);
      c.lineTo(B[0] - ux * hd + uy * hd * .38, B[1] - uy * hd - ux * hd * .38);
      c.closePath(); c.fill();
    }
    c.restore();
    if (o.drop) { this.drop3(x2, y2, z2, o); this.drop3(x1, y1, z1, o); }
    if (o.label) {
      var ld = { dx: o.labelDx, dy: o.labelDy, align: o.labelAlign };
      if (o.labelOut) {   /* true 或数字：沿箭头方向把标签推到尖端之外，避免多条箭头标签叠字 */
        var tt = this.tipDir([x1, y1, z1], [x2, y2, z2], o.labelOut === true ? 16 : o.labelOut);
        ld = { dx: tt.dx, dy: tt.dy, align: o.labelAlign || tt.align };
      }
      this.text3(x2, y2, z2, o.label, { color: o.color || P.curve4, bg: P.band,
        dx: ld.dx, dy: ld.dy, align: ld.align, size: o.labelSize });
    }
    return { from: A, to: B, len2d: len };
  };
  View3.prototype.drop3 = function (x, y, z, o) {
    o = o || {};
    var P = pal(), F = this.project(x, y, this.z0);
    var c = this.ctx;
    c.save(); c.strokeStyle = o.dropColor || P.muted; c.lineWidth = 1; c.setLineDash([3, 3]);
    var A = this.project(x, y, z);
    c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(F[0], F[1]); c.stroke(); c.restore();
    c.save(); c.fillStyle = o.dropColor || P.muted;
    c.beginPath(); c.arc(F[0], F[1], 2.6, 0, Math.PI * 2); c.fill(); c.restore();
    return F;
  };
  View3.prototype.dot3 = function (x, y, z, o) {
    o = o || {}; var c = this.ctx, P = pal(), p = this.project(x, y, z);
    c.save(); c.fillStyle = o.color || P.dot;
    c.beginPath(); c.arc(p[0], p[1], o.r || 4.5, 0, Math.PI * 2); c.fill(); c.restore();
    return p;
  };
  View3.prototype.text3 = function (x, y, z, s, o) {
    o = o || {}; var c = this.ctx, P = pal(), p = this.project(x, y, z);
    if (this.deferLabels && o.track !== false) {
      /* 只登记：等 flushLabels() 统一避让（本视图声明了 labelAuto） */
      this._pend.push({ x: x, y: y, z: z, s: s, o: o, cand: { dx: o.dx || 0, dy: o.dy || 0 } });
      return p;
    }
    var size = o.size || 12, tx = p[0] + (o.dx || 0), ty = p[1] + (o.dy || 0);
    c.save();
    c.font = size + 'px "Segoe UI", "Microsoft YaHei", sans-serif';
    var al3 = o.align || 'left', bs3 = o.middle || 'middle';
    c.textAlign = al3; c.textBaseline = bs3;
    var fg3 = o.color || P.text, tw = c.measureText(s).width, th3 = size * 1.18;
    /* 与 2D 一致：先把文字盒整体钳进画布，再决定描边或底衬 */
    var ax3 = al3 === 'center' ? tx - tw / 2 : (al3 === 'right' ? tx - tw : tx);
    var ay3 = bs3 === 'middle' ? ty - th3 / 2 : (bs3 === 'top' ? ty - 2 : ty - th3);
    var pad3 = Math.max(7, Math.ceil(size * 0.3 / 2) + 2);
    var nx3 = Math.min(Math.max(ax3, pad3), Math.max(pad3, this.W - tw - pad3));
    var ny3 = Math.min(Math.max(ay3, pad3), Math.max(pad3, this.H - th3 - pad3));
    tx += nx3 - ax3; ty += ny3 - ay3;
    var hasBg3 = solidBg(o.bg);
    if (o.halo !== false && !hasBg3) {
      /* 光晕描边代替黑底：3D 标签常压在半透明曲面与网格线上 */
      c.lineJoin = 'round'; c.lineCap = 'round';
      c.lineWidth = Math.max(2.6, size * 0.3);
      c.strokeStyle = (o.halo && o.halo !== true) ? o.halo : P.halo;
      c.strokeText(s, tx, ty);
    }
    if (hasBg3) {
      var bw3 = tw + 8, bh3 = size + 7;
      roundRect(c, nx3 - 4, ny3 - (bh3 - th3) / 2, bw3, bh3, 4);
      c.fillStyle = o.bg; c.fill();
    }
    c.fillStyle = fg3;
    c.fillText(s, tx, ty);
    c.restore();
    if (this.labels && o.track !== false) {
      var x0 = tx, x1 = tx + tw;
      if (o.align === 'center') { x0 = tx - tw / 2; x1 = tx + tw / 2; }
      else if (o.align === 'right') { x0 = tx - tw; x1 = tx; }
      this.labels.push({ s: s, x0: x0, y0: ty - (size + 2) / 2, x1: x1, y1: ty + (size + 2) / 2 });
    }
    return p;
  };
  /* 标签自动避让：按登记顺序，在「声明偏移 + 8 方向 × 递增半径」里挑第一个既不压已放标签、
     又不跑出画布的落点；实在放不下（极端退化视角）才退回声明偏移。 */
  View3.prototype.fontOf = function (size) { return size + 'px "Segoe UI", "Microsoft YaHei", sans-serif'; };
  View3.prototype.placeOf = function (it, o, size, cand) {
    var p = this.project(it.x, it.y, it.z);
    var tx = p[0] + (cand.dx || 0), ty = p[1] + (cand.dy || 0);
    var c = this.ctx; c.save(); c.font = this.fontOf(size);
    var w = c.measureText(it.s).width; c.restore();
    var al = o.align || 'left', x0 = tx, x1 = tx + w;
    if (al === 'center') { x0 = tx - w / 2; x1 = tx + w / 2; }
    else if (al === 'right') { x0 = tx - w; x1 = tx; }
    return { s: it.s, tx: tx, ty: ty, size: size, o: o,
      box: { s: it.s, x0: x0, y0: ty - (size + 2) / 2, x1: x1, y1: ty + (size + 2) / 2 } };
  };
  View3.prototype.hitsAny = function (b, placed, pad) {
    for (var i = 0; i < placed.length; i++) {
      var a = placed[i];
      if (b.x0 - pad < a.x1 && a.x0 - pad < b.x1 && b.y0 - pad < a.y1 && a.y0 - pad < b.y1) return true;
    }
    return false;
  };
  View3.prototype.paintLabel = function (pl) {
    var c = this.ctx, o = pl.o, P = pal();
    c.save();
    var fg = o.color || P.text, hasBg = solidBg(o.bg);
    c.font = this.fontOf(pl.size);
    c.textAlign = o.align || 'left'; c.textBaseline = o.middle || 'middle';
    if (hasBg) {
      /* 仅当调用方显式给了底色才画底衬（默认不画，画面更干净） */
      roundRect(c, pl.box.x0 - 3, pl.box.y0, (pl.box.x1 - pl.box.x0) + 6, pl.box.y1 - pl.box.y0, 4);
      c.fillStyle = o.bg; c.fill();
    } else if (o.halo !== false) {
      /* 光晕描边代替黑底，保证压在任何背景上可读 */
      c.lineJoin = 'round'; c.lineCap = 'round';
      c.lineWidth = Math.max(2.6, pl.size * 0.3);
      c.strokeStyle = (o.halo && o.halo !== true) ? o.halo : P.halo;
      c.strokeText(pl.s, pl.tx, pl.ty);
    }
    c.fillStyle = fg;
    c.fillText(pl.s, pl.tx, pl.ty);
    c.restore();
    if (this.labels && o.track !== false) this.labels.push(pl.box);
  };
  View3.prototype.flushLabels = function () {
    var pend = this._pend || []; this._pend = [];
    var placed = [], radii = [0, 9, 15, 22, 30, 40, 52], dirs = [[1, 0], [-1, 0], [0, -1], [0, 1], [1, -1], [-1, -1], [1, 1], [-1, 1]];
    for (var i = 0; i < pend.length; i++) {
      var it = pend[i], o = it.o, size = o.size || 12, best = null;
      for (var k = 0; k < radii.length && !best; k++) {
        for (var d = 0; d < dirs.length; d++) {
          var pl = this.placeOf(it, o, size, { dx: it.cand.dx + dirs[d][0] * radii[k], dy: it.cand.dy + dirs[d][1] * radii[k] });
          if (this.hitsAny(pl.box, placed, 1.5)) continue;
          if (pl.box.x0 < 5 || pl.box.x1 > this.W - 5 || pl.box.y0 < 5 || pl.box.y1 > this.H - 5) continue;
          best = pl; break;
        }
      }
      if (!best) best = this.placeOf(it, o, size, it.cand);   /* 退化到放不下：退回声明偏移 */
      placed.push(best.box);
      this.paintLabel(best);
    }
    return placed.length;
  };
  /* 标签包围盒清单与两两相交检测（pad>0 时每盒向外扩 pad 像素，模拟视觉拥挤） */
  View3.prototype.labelBoxes = function () {
    if (this._pend && this._pend.length) this.flushLabels();   /* 惰性排布：谁读谁负责触发 */
    return (this.labels || []).slice();
  };
  View3.prototype.labelOverlaps = function (pad) {
    pad = pad || 0;
    var A = this.labelBoxes(), out = [], i, j;
    for (i = 0; i < A.length; i++) for (j = i + 1; j < A.length; j++) {
      var a = A[i], b = A[j];
      if (a.x0 - pad < b.x1 && b.x0 - pad < a.x1 && a.y0 - pad < b.y1 && b.y0 - pad < a.y1) {
        out.push({ a: a.s, b: b.s, box: [a.x0, a.y0, a.x1, a.y1] });
      }
    }
    return out;
  };
  /* 三维投影面片（平行四边形、三角形等）：pts = [[x,y,z], …] */
  View3.prototype.poly3 = function (pts, o) {
    o = o || {}; var c = this.ctx, v = this;
    c.save();
    c.beginPath();
    pts.forEach(function (q, i) { var P2 = v.project(q[0], q[1], q[2]); if (i) c.lineTo(P2[0], P2[1]); else c.moveTo(P2[0], P2[1]); });
    if (o.close !== false) c.closePath();
    if (o.fill) { c.fillStyle = o.fill; c.fill(); }
    if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = o.w || 1.4; c.stroke(); }
    c.restore();
    return pts.length;
  };

  /* 拖拽旋转 + 滚轮缩放；返回 reset() */
  function makeRotatable(v3, redraw) {
    var cv = v3.cv, on = false, lx = 0, ly = 0;
    cv.style.cursor = 'grab';
    cv.addEventListener('pointerdown', function (e) {
      on = true; lx = e.clientX; ly = e.clientY;
      cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing';
    });
    cv.addEventListener('pointermove', function (e) {
      if (!on) return;
      v3.spin((e.clientX - lx) * 0.01, (e.clientY - ly) * 0.008);
      lx = e.clientX; ly = e.clientY; redraw();
    });
    function up(e) {
      if (!on) return; on = false; cv.style.cursor = 'grab';
      try { cv.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', function (e) {
      e.preventDefault();
      v3.zoomK = Math.max(0.45, Math.min(1.6, v3.zoomK * (e.deltaY < 0 ? 1.06 : 0.94)));
      v3.fitScale(); redraw();
    }, { passive: false });
    return function () { v3.resetAngles(); redraw(); };
  }

  /* =====================================================================
     ① ch00 全书知识地图
     ===================================================================== */
  lab({
    id: 'depmap', ch: '00', title: '全书知识地图',
    sub: '15 个模块的依赖关系：选一个模块看它的前置与后继，滑块调「几跳之内」的范围。',
    tex: "\\text{ch01}\\to\\text{ch02}\\to\\text{ch03}\\to\\text{ch04}\\cdots",
    note: '每章都不是孤岛：<b>先修边</b>指向它依赖的章节，斜着走捷径（如 ch01 → ch03）说明这章可以提前读。灰色细线是全书的所有依赖，高亮线只连当前模块。',
    view: { x0: 0, x1: 100, y0: 0, y1: 36 },
    mods: [
      { id: 'ch00', n: '00', t: '总览与学习路线', part: 'Part I' },
      { id: 'ch01', n: '01', t: '向量导论', part: 'Part I' },
      { id: 'ch02', n: '02', t: '解线性方程组', part: 'Part I' },
      { id: 'ch03', n: '03', t: '向量空间与子空间', part: 'Part II' },
      { id: 'ch04', n: '04', t: '正交性', part: 'Part II' },
      { id: 'ch05', n: '05', t: '行列式', part: 'Part II' },
      { id: 'ch06', n: '06', t: '特征值与特征向量', part: 'Part III' },
      { id: 'ch07', n: '07', t: '奇异值分解', part: 'Part III' },
      { id: 'ch08', n: '08', t: '线性变换', part: 'Part III' },
      { id: 'ch09', n: '09', t: '复向量与复矩阵', part: 'Part IV' },
      { id: 'ch10', n: '10', t: '应用', part: 'Part IV' },
      { id: 'ch11', n: '11', t: '数值线性代数', part: 'Part IV' },
      { id: 'ch12', n: '12', t: '概率统计中的线代', part: 'Part IV' },
      { id: 'ch13', n: 'A', t: '矩阵分解与六大定理', part: 'Part IV' },
      { id: 'ch14', n: 'F', t: '全书公式速查表', part: 'Part IV' }
    ],
    edges: [
      ['ch00', 'ch01'], ['ch01', 'ch02'], ['ch01', 'ch03'], ['ch02', 'ch03'],
      ['ch03', 'ch04'], ['ch02', 'ch05'], ['ch03', 'ch05'],
      ['ch04', 'ch06'], ['ch05', 'ch06'], ['ch04', 'ch07'], ['ch06', 'ch07'],
      ['ch03', 'ch08'], ['ch06', 'ch08'],
      ['ch04', 'ch09'], ['ch06', 'ch09'], ['ch07', 'ch09'],
      ['ch06', 'ch10'], ['ch07', 'ch10'],
      ['ch02', 'ch11'], ['ch04', 'ch11'], ['ch05', 'ch11'],
      ['ch04', 'ch12'], ['ch06', 'ch12'], ['ch07', 'ch12'],
      ['ch05', 'ch13'], ['ch06', 'ch13'], ['ch07', 'ch13'], ['ch08', 'ch13'],
      ['ch00', 'ch14']
    ],
    ctrls: [
      { k: 'focus', label: '当前模块', type: 'sel', val: 'ch03', opts: [
        ['ch00', '00 总览与学习路线'], ['ch01', '01 向量导论'], ['ch02', '02 解线性方程组'],
        ['ch03', '03 向量空间与子空间'], ['ch04', '04 正交性'], ['ch05', '05 行列式'],
        ['ch06', '06 特征值与特征向量'], ['ch07', '07 奇异值分解'], ['ch08', '08 线性变换'],
        ['ch09', '09 复向量与复矩阵'], ['ch10', '10 应用'], ['ch11', '11 数值线性代数'],
        ['ch12', '12 概率统计中的线代'], ['ch13', 'A 矩阵分解与六大定理'], ['ch14', 'F 公式速查表']
      ] },
      { k: 'hops', label: '视距 k（跳）', min: 1, max: 4, step: 1, val: 1 },
      { k: 'spread', label: '布局展开', min: 0.8, max: 1.15, step: 0.01, val: 1 }
    ],
    layout: function (v, s, mods) {
      var p = v.pad, W = v.W - p.l - p.r, H = v.H - p.t - p.b;
      var rows = [
        [['ch00', 0.30], ['ch14', 0.86]],
        [['ch01', 0.18], ['ch02', 0.52]],
        [['ch03', 0.12], ['ch04', 0.42], ['ch05', 0.70]],
        [['ch06', 0.12], ['ch07', 0.42], ['ch08', 0.70]],
        [['ch09', 0.05], ['ch10', 0.24], ['ch11', 0.42], ['ch12', 0.58], ['ch13', 0.76]]
      ];
      var pos = {}, k = (s.spread - 1) * 0.7, i, j;
      for (i = 0; i < rows.length; i++) {
        var yPx = p.t + 18 + (H - 36) * (i / (rows.length - 1));
        for (j = 0; j < rows[i].length; j++) {
          var fx = rows[i][j][1];
          fx = fx + (fx - 0.42) * k;
          pos[rows[i][j][0]] = { x: v.ux(p.l + W * fx), y: v.uy(yPx) };
        }
      }
      mods.forEach(function (m) { if (!pos[m.id]) pos[m.id] = { x: v.ux(v.W / 2), y: v.uy(v.H / 2) }; });
      return pos;
    },
    draw: function (v, s) {
      var P = pal(), L = this, mods = L.mods, pos = L.layout(v, s, mods);
      var nodes = mods.map(function (m) {
        var q = pos[m.id];
        return { id: m.id, x: q.x, y: q.y, r: 14, label: m.n };
      });
      var hl = {}; hl[s.focus] = true;
      v.clear();
      v.nodeGraph(nodes, L.edges, { highlight: hl });
      /* k 跳邻域：范围内的节点加一圈虚线环 */
      var adj = {}, i;
      for (i = 0; i < mods.length; i++) adj[mods[i].id] = [];
      L.edges.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
      var seen = {}, frontier = [s.focus], k, hops = Math.round(s.hops);
      seen[s.focus] = 0;
      for (k = 0; k < hops; k++) {
        var next = [];
        frontier.forEach(function (u) {
          (adj[u] || []).forEach(function (w) {
            if (seen[w] === undefined) { seen[w] = k + 1; next.push(w); }
          });
        });
        frontier = next;
      }
      var c = v.ctx;
      c.save();
      c.setLineDash([3, 3]); c.strokeStyle = P.curve3; c.lineWidth = 1.1;
      Object.keys(seen).forEach(function (id) {
        if (id === s.focus) return;
        var q = pos[id];
        c.beginPath(); c.arc(v.px(q.x), v.py(q.y), 19, 0, Math.PI * 2); c.stroke();
      });
      c.restore();
      /* 左上角说明块（该区域没有节点，不会挡图） */
      var fm = null;
      mods.forEach(function (m) { if (m.id === s.focus) fm = m; });
      if (!fm) return;
      c.save();
      c.fillStyle = 'rgba(9,13,20,.85)';
      c.strokeStyle = 'rgba(59,78,107,.55)'; c.lineWidth = 1;
      roundRect(c, v.pad.l + 6, v.pad.t + 4, 258, 44, 4); c.fill(); c.stroke();
      c.restore();
      v.text(v.x0 + 1.3, v.y1 - 0.9, s.focus.toUpperCase() + ' · ' + fm.t, { color: P.curve3, size: 12.5 });
      v.text(v.x0 + 1.3, v.y1 - 2.6, '细线 = 依赖边 · 高亮 = 当前模块 · 虚线圈 = ' + hops + ' 跳以内', { color: P.muted, size: 10.5 });
    },
    read: function (s) {
      var L = this, mods = L.mods, byId = {};
      mods.forEach(function (m) { byId[m.id] = m; });
      var pre = [], post = [], adj = {}, i;
      for (i = 0; i < mods.length; i++) adj[mods[i].id] = [];
      L.edges.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
      pre = L.edges.filter(function (e) { return e[1] === s.focus; }).map(function (e) { return e[0].replace('ch', ''); });
      post = L.edges.filter(function (e) { return e[0] === s.focus; }).map(function (e) { return e[1].replace('ch', ''); });
      var seen = {}, frontier = [s.focus], k, hops = Math.round(s.hops);
      seen[s.focus] = 0;
      for (k = 0; k < hops; k++) {
        var next = [];
        frontier.forEach(function (u) {
          (adj[u] || []).forEach(function (w) { if (seen[w] === undefined) { seen[w] = k + 1; next.push(w); } });
        });
        frontier = next;
      }
      var fm = byId[s.focus] || { t: '—', part: '—' };
      return [
        ['当前模块', s.focus.toUpperCase() + ' · ' + fm.t],
        ['前置（先读）', pre.length ? pre.join(' · ') : '无（起点）'],
        ['后继（再读）', post.length ? post.join(' · ') : '无（终点）'],
        [hops + ' 跳邻域', (Object.keys(seen).length - 1) + ' / ' + (mods.length - 1) + ' 个模块']
      ];
    }
  });

  /* =====================================================================
     ② ch01 向量加法与线性组合
     ===================================================================== */
  lab({
    id: 'vecsum', ch: '01', title: '向量加法与线性组合',
    sub: '改 u、v 与系数 c₁、c₂：红色箭头是 c₁u + c₂v，沿「先走 c₁u、再走 c₂v」的折线到达。',
    tex: "c_1\\mathbf{u}+c_2\\mathbf{v}=\\begin{bmatrix}c_1u_1+c_2v_1\\\\c_1u_2+c_2v_2\\end{bmatrix}",
    note: '<b>线性组合</b>就是把两个向量按系数缩放再相加。u、v 不共线时，$(c_1,c_2)$ 取遍所有实数就能铺满整个平面（张成 $\\mathbb{R}^2$）；共线时只能落到一条直线上。',
    view: { x0: -5.4, x1: 5.4, y0: -1.75, y1: 1.75 },
    ctrls: [
      { k: 'ux', label: 'u₁', min: -2, max: 2, step: 0.1, val: 1.4 },
      { k: 'uy', label: 'u₂', min: -2, max: 2, step: 0.1, val: 0.5 },
      { k: 'vx', label: 'v₁', min: -2, max: 2, step: 0.1, val: -0.5 },
      { k: 'vy', label: 'v₂', min: -2, max: 2, step: 0.1, val: 1.2 },
      { k: 'c1', label: '系数 c₁', min: -2, max: 2, step: 0.1, val: 1 },
      { k: 'c2', label: '系数 c₂', min: -2, max: 2, step: 0.1, val: 0.8 }
    ],
    draw: function (v, s) {
      var P = pal();
      ensureAspect(v);
      var wx = s.c1 * s.ux + s.c2 * s.vx, wy = s.c1 * s.uy + s.c2 * s.vy;
      var det = det2(s.ux, s.uy, s.vx, s.vy);
      v.axes();
      /* 张成：共线时把整条直线画出来 */
      if (Math.abs(s.ux) + Math.abs(s.uy) > 1e-6)
        v.line(-s.ux * 9, -s.uy * 9, s.ux * 9, s.uy * 9, { color: 'rgba(167,180,195,.16)', w: 1.2, dash: [3, 4] });
      /* 原始向量（淡） */
      v.arrow(0, 0, s.ux, s.uy, { color: P.curve, w: 1.5 });
      v.arrow(0, 0, s.vx, s.vy, { color: P.curve2, w: 1.5 });
      v.text(s.ux, s.uy, ' u', { color: P.curve, size: 13 });
      v.text(s.vx, s.vy, ' v', { color: P.curve2, size: 13 });
      /* 缩放后的分向量：首尾相接 */
      v.arrow(0, 0, s.c1 * s.ux, s.c1 * s.uy, { color: P.curve, w: 1.1 });
      v.arrow(s.c1 * s.ux, s.c1 * s.uy, wx, wy, { color: P.curve2, w: 1.1 });
      v.text(s.c1 * s.ux * 0.5, s.c1 * s.uy * 0.5, 'c₁u', { color: P.curve, size: 11.5, align: 'center' });
      v.text((s.c1 * s.ux + wx) / 2, (s.c1 * s.uy + wy) / 2, 'c₂v', { color: P.curve2, size: 11.5, align: 'center' });
      /* 合成向量 */
      v.arrow(0, 0, wx, wy, { color: P.curve3, w: 2.6 });
      v.dot(wx, wy, { color: P.curve3, r: 4.5 });
      v.text(wx, wy, ' w', { color: P.curve3, size: 13.5 });
      v.text(v.x0 + .15, v.y0 + .28, 'det(u, v) = ' + fmt(det, 3) + (Math.abs(det) < 1e-6 ? '  → 共线，只能张成一条直线' : '  → 线性无关，张成整个 R²'),
        { color: Math.abs(det) < 1e-6 ? P.curve4 : P.muted, size: 11.5 });
    },
    read: function (s) {
      var wx = s.c1 * s.ux + s.c2 * s.vx, wy = s.c1 * s.uy + s.c2 * s.vy;
      var det = det2(s.ux, s.uy, s.vx, s.vy);
      var zero = (Math.abs(s.ux) + Math.abs(s.uy) < 1e-9) && (Math.abs(s.vx) + Math.abs(s.vy) < 1e-9);
      return [
        ['c₁u + c₂v', vecStr(wx, wy)],
        ['|w|', fmt(len2(wx, wy), 3)],
        ['det(u, v)', fmt(det, 3)],
        ['u, v 的关系', zero ? '都是零向量，张成 {0}' : (Math.abs(det) < 1e-6 ? '共线 → 张成一条直线' : '线性无关 → 张成 R²')]
      ];
    }
  });

  /* =====================================================================
     ③ ch01 点积、长度与夹角
     ===================================================================== */
  lab({
    id: 'dotprod', ch: '01', title: '点积、长度与夹角',
    sub: '改 u、v 的四个分量：点积的正负、夹角大小、u 在 v 上的投影长度实时联动。',
    tex: "\\mathbf{u}\\cdot\\mathbf{v}=\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert\\cos\\theta=u_1v_1+u_2v_2",
    note: '点积为 0 ⟺ 两向量正交（夹角 $90^\\circ$）；为正 ⟺ 夹角小于 $90^\\circ$；为负 ⟺ 夹角大于 $90^\\circ$。投影长度 $=\\lVert\\mathbf{u}\\rVert\\cos\\theta=(\\mathbf{u}\\cdot\\mathbf{v})/\\lVert\\mathbf{v}\\rVert$ 是有符号的。',
    view: { x0: -3.6, x1: 3.6, y0: -1.4, y1: 1.4 },
    ctrls: [
      { k: 'ux', label: 'u₁', min: -2, max: 2, step: 0.1, val: 1.6 },
      { k: 'uy', label: 'u₂', min: -2, max: 2, step: 0.1, val: 1.1 },
      { k: 'vx', label: 'v₁', min: -2, max: 2, step: 0.1, val: 2 },
      { k: 'vy', label: 'v₂', min: -2, max: 2, step: 0.1, val: -0.4 }
    ],
    draw: function (v, s) {
      var P = pal();
      ensureAspect(v);
      var lu = len2(s.ux, s.uy), lv = len2(s.vx, s.vy), d = dot2(s.ux, s.uy, s.vx, s.vy);
      v.axes();
      /* v 所在整条直线 */
      if (lv > 1e-9) v.line(-s.vx * 4, -s.vy * 4, s.vx * 4, s.vy * 4, { color: 'rgba(224,98,54,.26)', w: 1.1, dash: [4, 4] });
      /* 投影 */
      if (lv > 1e-9 && lu > 1e-9) {
        var t = d / (lv * lv), px = s.vx * t, py = s.vy * t;
        v.arrow(0, 0, px, py, { color: P.curve3, w: 2.2 });
        v.dropLine(s.ux, s.uy, px, py, { color: P.curve3, w: 1.1 });
        rightAngle(v, [px, py], [-s.vy / lv, s.vx / lv], 9, P.curve3);
        v.text(px, py, ' p', { color: P.curve3, size: 12 });
        /* 夹角弧 */
        var a1 = Math.atan2(s.uy, s.ux), a2 = Math.atan2(s.vy, s.vx);
        var rr = Math.min(0.62, 0.42 * Math.min(lu, lv) + 0.16);
        if (Math.abs(a2 - a1) > Math.PI) { if (a1 < a2) a1 += 2 * Math.PI; else a2 += 2 * Math.PI; }
        angleArc(v, 0, 0, rr, a1, a2, { color: P.tick });
        var am = (a1 + a2) / 2;
        v.text(rr * 1.28 * Math.cos(am), rr * 1.28 * Math.sin(am), 'θ', { color: P.muted, size: 12.5, align: 'center' });
      }
      v.arrow(0, 0, s.ux, s.uy, { color: P.curve, w: 2.1 });
      v.arrow(0, 0, s.vx, s.vy, { color: P.curve2, w: 2.1 });
      v.text(s.ux, s.uy, ' u', { color: P.curve, size: 13.5 });
      v.text(s.vx, s.vy, ' v', { color: P.curve2, size: 13.5 });
      var lab = Math.abs(d) < 1e-6 ? 'u·v = 0 → 正交' : (d > 0 ? 'u·v > 0 → 锐角' : 'u·v < 0 → 钝角');
      v.text(v.x0 + .15, v.y0 + .26, lab, { color: Math.abs(d) < 1e-6 ? P.curve3 : P.muted, size: 11.5 });
    },
    read: function (s) {
      var lu = len2(s.ux, s.uy), lv = len2(s.vx, s.vy), d = dot2(s.ux, s.uy, s.vx, s.vy);
      var cos = (lu > 1e-9 && lv > 1e-9) ? clamp(d / (lu * lv), -1, 1) : NaN;
      var th = isFinite(cos) ? Math.acos(cos) * 180 / Math.PI : NaN;
      var proj = lv > 1e-9 ? d / lv : NaN;
      return [
        ['u · v', num(d, 3)],
        ['|u| · |v|', fmt(lu, 3) + ' · ' + fmt(lv, 3)],
        ['cos θ', isFinite(cos) ? num(cos, 4, 1e-12) : '—'],
        ['夹角 θ', isFinite(th) ? fmt(th, 2) + '°' : '—'],
        ['u 在 v 上的投影长度', isFinite(proj) ? fmt(proj, 3) : '—']
      ];
    }
  });

  /* =====================================================================
     ④ ch01 矩阵乘向量：列的线性组合
     ===================================================================== */
  lab({
    id: 'matvec', ch: '01', title: '矩阵乘向量：列的线性组合',
    sub: '改 2×2 矩阵四个元素与输入向量 x：网格被 A 拉伸/剪切，Ax 是 A 两列按 x 的分量加权相加。',
    tex: "A\\mathbf{x}=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\begin{bmatrix}x_1\\\\x_2\\end{bmatrix}=x_1\\begin{bmatrix}a\\\\c\\end{bmatrix}+x_2\\begin{bmatrix}b\\\\d\\end{bmatrix}",
    note: '矩阵乘向量有两种看法：<b>逐行</b>做点积，或<b>按列</b>做线性组合。后者才是几何：$A\\mathbf{x}$ 就是「把 $\\mathbf{x}$ 的分量当作 A 两列的配方」。画布上的网格是 A 作用在标准网格上的像。',
    view: { x0: -4.6, x1: 4.6, y0: -1.75, y1: 1.75 },
    ctrls: [
      { k: 'a11', label: 'a₁₁', min: -2, max: 2, step: 0.1, val: 1.2 },
      { k: 'a12', label: 'a₁₂', min: -2, max: 2, step: 0.1, val: 0.6 },
      { k: 'a21', label: 'a₂₁', min: -2, max: 2, step: 0.1, val: -0.4 },
      { k: 'a22', label: 'a₂₂', min: -2, max: 2, step: 0.1, val: 1.1 },
      { k: 'x1', label: 'x₁', min: -2, max: 2, step: 0.1, val: 1.5 },
      { k: 'x2', label: 'x₂', min: -2, max: 2, step: 0.1, val: 0.8 }
    ],
    draw: function (v, s) {
      var P = pal(), A = [[s.a11, s.a12], [s.a21, s.a22]];
      ensureAspect(v);
      var ax = app2(A, s.x1, s.x2);
      v.axes();
      /* A 作用后的网格（像） */
      var i, qa, qb;
      for (i = -4; i <= 4; i++) {
        qa = app2(A, i, -4); qb = app2(A, i, 4);
        v.line(qa[0], qa[1], qb[0], qb[1], { color: 'rgba(167,180,195,.20)', w: 1 });
        qa = app2(A, -4, i); qb = app2(A, 4, i);
        v.line(qa[0], qa[1], qb[0], qb[1], { color: 'rgba(167,180,195,.20)', w: 1 });
      }
      /* 单位正方形（原像，虚线）→ 平行四边形（像） */
      v.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { stroke: 'rgba(167,180,195,.7)', w: 1.1, dash: [4, 4] });
      var o0 = [0, 0], p1 = app2(A, 1, 0), p2 = app2(A, 0, 1), p3 = app2(A, 1, 1);
      v.poly([o0, p1, p3, p2], { fill: P.fill3, stroke: P.curve3, w: 1.5, close: true });
      /* 两列（e₁、e₂ 的像） */
      v.arrow(0, 0, s.a11, s.a21, { color: P.curve2, w: 2 });
      v.arrow(0, 0, s.a12, s.a22, { color: P.curve, w: 2 });
      v.text(s.a11, s.a21, ' 列 1', { color: P.curve2, size: 11.5 });
      v.text(s.a12, s.a22, ' 列 2', { color: P.curve, size: 11.5 });
      /* 输入 x 与输出 Ax */
      v.arrow(0, 0, s.x1, s.x2, { color: P.muted, w: 1.3, dash: [5, 4] });
      v.text(s.x1, s.x2, ' x', { color: P.muted, size: 12 });
      v.arrow(0, 0, ax[0], ax[1], { color: P.curve4, w: 2.6 });
      v.dot(ax[0], ax[1], { color: P.curve4, r: 4.5 });
      v.text(ax[0], ax[1], ' Ax', { color: P.curve4, size: 13 });
      v.text(v.x0 + .15, v.y0 + .28, 'A = [' + fmt(s.a11, 2) + ' ' + fmt(s.a12, 2) + '; ' + fmt(s.a21, 2) + ' ' + fmt(s.a22, 2) + ']   det = ' + num(det2(s.a11, s.a12, s.a21, s.a22), 3),
        { color: P.muted, size: 11.5 });
    },
    read: function (s) {
      var A = [[s.a11, s.a12], [s.a21, s.a22]], ax = app2(A, s.x1, s.x2);
      var D = det2(s.a11, s.a12, s.a21, s.a22), lx = len2(s.x1, s.x2), la = len2(ax[0], ax[1]);
      return [
        ['A x', vecStr(ax[0], ax[1])],
        ['x₁·列1 + x₂·列2', fmt(s.x1, 2) + '·(' + fmt(s.a11, 2) + ',' + fmt(s.a21, 2) + ') + ' + fmt(s.x2, 2) + '·(' + fmt(s.a12, 2) + ',' + fmt(s.a22, 2) + ')'],
        ['det A', num(D, 3)],
        ['|Ax| / |x|', lx > 1e-9 ? fmt(la / lx, 3) : '—'],
        ['A 的作用', Math.abs(D) < 1e-9 ? '奇异：整个平面被压成一条线' : '可逆：网格被拉成平行四边形网格']
      ];
    }
  });

  /* =====================================================================
     ⑤ ch02 消元过程（行图像 + 增广矩阵 + 逐步）
     ===================================================================== */
  lab({
    id: 'elimination', ch: '02', title: '消元过程：从方程组到上三角',
    sub: '改 2×2 方程组的六个系数，拖动「步骤」：先看两直线交点，再看消元怎么把 A 变成上三角、最后回代。',
    tex: "\\begin{cases}a_{11}x_1+a_{12}x_2=b_1\\\\a_{21}x_1+a_{22}x_2=b_2\\end{cases}\\;\\longrightarrow\\;U\\mathbf{x}=\\mathbf{c}",
    note: '<b>消元 = 用行变换把主元下方清零</b>：第 2 行减去第 1 行的 $m=a_{21}/a_{11}$ 倍，第二个方程里 $x_1$ 就消失了。行变换不改变解（两直线的交点不动），只改变方程的写法。主元为 0 时必须换行——这就是部分主元法的由来。',
    view: { x0: -5, x1: 5, y0: -2, y1: 2 },
    ctrls: [
      { k: 'a', label: 'a₁₁', min: -3, max: 3, step: 0.1, val: 2 },
      { k: 'b', label: 'a₁₂', min: -3, max: 3, step: 0.1, val: 1 },
      { k: 'c', label: 'a₂₁', min: -3, max: 3, step: 0.1, val: 1 },
      { k: 'd', label: 'a₂₂', min: -3, max: 3, step: 0.1, val: 3 },
      { k: 'p', label: 'b₁', min: -4, max: 4, step: 0.1, val: 3 },
      { k: 'q', label: 'b₂', min: -4, max: 4, step: 0.1, val: 4 },
      { k: 'step', label: '步骤', min: 0, max: 2, step: 1, val: 0 }
    ],
    reduce: function (s) {
      var a = s.a, b = s.b, c = s.c, d = s.d, p = s.p, q = s.q, t;
      var swapped = false, mult = null, d2 = d, q2 = q;
      if (Math.abs(a) < 1e-9 && Math.abs(c) > 1e-9) {
        t = a; a = c; c = t; t = b; b = d; d = t; t = p; p = q; q = t;
        swapped = true;
      }
      if (Math.abs(a) > 1e-9) {
        mult = c / a; d2 = d - mult * b; q2 = q - mult * p;
      } else { d2 = d; q2 = q; }
      return { a: a, b: b, c: 0, d: d2, p: p, q: q2, mult: mult, swapped: swapped };
    },
    draw: function (v, s) {
      var P = pal(), L = this;
      var step = Math.round(s.step);
      var R = L.reduce(s);
      var sol = solve2(s.a, s.b, s.c, s.d, s.p, s.q);
      v.axes();
      /* 两条直线（几何不随行变换改变） */
      var L1 = segLine(v, s.a, s.b, s.p), L2 = segLine(v, s.c, s.d, s.q);
      if (L1) v.poly(L1, { stroke: P.curve, w: 2 });
      if (L2) v.poly(L2, { stroke: P.curve2, w: 2 });
      v.text(v.x0 + .2, v.y1 - .35, 'L₁: ' + fmt(s.a, 2) + 'x₁ + ' + fmt(s.b, 2) + 'x₂ = ' + fmt(s.p, 2), { color: P.curve, size: 11.5 });
      v.text(v.x0 + .2, v.y1 - .75, 'L₂: ' + fmt(s.c, 2) + 'x₁ + ' + fmt(s.d, 2) + 'x₂ = ' + fmt(s.q, 2), { color: P.curve2, size: 11.5 });
      if (sol) {
        v.dot(sol[0], sol[1], { color: P.curve3, r: 5.5, ring: true });
        v.text(v.x0 + .2, v.y1 - 1.2, '交点 = 解 ' + vecStr(sol[0], sol[1]), { color: P.curve3, size: 12 });
      }
      /* 增广矩阵面板：按步骤切换 */
      var rows, hot, label;
      if (step === 0) {
        rows = [[fmt(s.a, 2), fmt(s.b, 2), fmt(s.p, 2)], [fmt(s.c, 2), fmt(s.d, 2), fmt(s.q, 2)]];
        hot = null; label = '(A | b)';
      } else if (step === 1) {
        rows = [[fmt(R.a, 2), fmt(R.b, 2), fmt(R.p, 2)], ['0', fmt(R.d, 2), fmt(R.q, 2)]];
        hot = Math.abs(R.a) > 1e-9 ? [[0, 0]] : [];
        if (Math.abs(R.d) > 1e-9) hot.push([1, 1]);
        label = 'U | c';
      } else {
        var r1b = Math.abs(R.a) > 1e-12 ? R.b / R.a : 0, r1p = Math.abs(R.a) > 1e-12 ? R.p / R.a : 0;
        var r2b = Math.abs(R.d) > 1e-12 ? 1 : 0, r2p = Math.abs(R.d) > 1e-12 ? R.q / R.d : 0;
        rows = [['1', fmt(r1b, 2), fmt(r1p, 2)], ['0', fmt(r2b, 2), fmt(r2p, 2)]];
        hot = [[0, 0], [1, 1]];
        label = 'RREF';
      }
      matPanel(v, rows, { align: 'right', y: v.pad.t + 14, sep: 2, hot: hot || [], label: label, size: 12.5 });
      var c = v.ctx;
      c.save();
      c.textAlign = 'left'; c.textBaseline = 'top';
      var msg;
      if (step === 0) msg = '步骤 0 · 原方程组：两直线的交点就是解';
      else if (step === 1) {
        msg = R.mult === null ? '步骤 1 · 主元为 0 且无法换行 → 矩阵奇异' : '步骤 1 · R₂ ← R₂ − (' + fmt(R.mult, 2) + ')·R₁，第 2 行 x₁ 项清零';
        if (R.swapped) msg += '（先交换两行，因为 a₁₁ = 0）';
      } else msg = '步骤 2 · 归一化 / 回代：把主元化为 1，直接读出解';
      haloText(c, msg, v.pad.l + 12, v.H - v.pad.b - 34, P.curve3, 11.5);
      if (step >= 1 && Math.abs(R.d) < 1e-9) haloText(c, '第二主元为 0 → 奇异：两直线平行或重合', v.pad.l + 12, v.H - v.pad.b - 15, P.curve4, 11.5);
      c.restore();
    },
    read: function (s) {
      var L = this, R = L.reduce(s), step = Math.round(s.step);
      var det = det2(s.a, s.b, s.c, s.d);
      var sol = solve2(s.a, s.b, s.c, s.d, s.p, s.q);
      var names = ['原方程组 (A|b)', '消元后 (U|c)', 'RREF'];
      var piv = [];
      if (Math.abs(R.a) > 1e-9) piv.push('p₁ = ' + fmt(R.a, 2));
      if (Math.abs(R.d) > 1e-9) piv.push('p₂ = ' + fmt(R.d, 2));
      return [
        ['步骤', step + ' / 2 · ' + names[step]],
        ['主元', piv.length ? piv.join('，') : '没有主元（矩阵奇异）'],
        ['det A', num(det, 3)],
        ['解', sol ? vecStr(sol[0], sol[1]) : '无唯一解（det = 0）'],
        ['行变换', step === 0 ? '无' : (R.mult === null ? '主元为 0，无法消元' : 'R₂ ← R₂ − (' + fmt(R.mult, 3) + ')·R₁')]
      ];
    }
  });

  /* =====================================================================
     ⑥ ch02 逆矩阵与奇异
     ===================================================================== */
  lab({
    id: 'inverse', ch: '02', title: '逆矩阵与奇异',
    sub: '改 2×2 矩阵四个元素：看单位正方形被拉成什么，det 一旦为 0，逆矩阵就不存在，正方形也被压扁。',
    tex: "A^{-1}=\\frac{1}{\\det A}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix},\\qquad \\det A=ad-bc",
    note: '<b>可逆 ⟺ det A ≠ 0 ⟺ 两列线性无关 ⟺ 单位正方形不被压扁</b>。逆矩阵就是"把动作倒放"：先用 A 再用 $A^{-1}$，一切回到原样（$A^{-1}A=I$）。',
    view: { x0: -4.6, x1: 4.6, y0: -1.75, y1: 1.75 },
    ctrls: [
      { k: 'a', label: 'a', min: -2, max: 2, step: 0.1, val: 1.4 },
      { k: 'b', label: 'b', min: -2, max: 2, step: 0.1, val: 0.6 },
      { k: 'c', label: 'c', min: -2, max: 2, step: 0.1, val: 0.4 },
      { k: 'd', label: 'd', min: -2, max: 2, step: 0.1, val: 1.2 },
      { k: 'mode', label: '显示', type: 'sel', val: 'A', opts: [['A', 'A 的作用'], ['inv', 'A⁻¹ 的作用'], ['both', '两者对照']] }
    ],
    draw: function (v, s) {
      var P = pal(), A = [[s.a, s.b], [s.c, s.d]], Ai = inv2(s.a, s.b, s.c, s.d);
      ensureAspect(v);
      v.axes();
      var c = v.ctx, i;
      /* 标准网格在 A 下的像（淡） */
      for (i = -4; i <= 4; i++) {
        var q1 = app2(A, i, -4), q2 = app2(A, i, 4);
        v.line(q1[0], q1[1], q2[0], q2[1], { color: 'rgba(215,171,97,.18)', w: 1 });
        q1 = app2(A, -4, i); q2 = app2(A, 4, i);
        v.line(q1[0], q1[1], q2[0], q2[1], { color: 'rgba(215,171,97,.18)', w: 1 });
      }
      /* 单位正方形（原像） */
      v.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { stroke: P.muted, w: 1.2, dash: [4, 4] });
      /* A 的像 */
      if (s.mode !== 'inv') {
        var im = [app2(A, 0, 0), app2(A, 1, 0), app2(A, 1, 1), app2(A, 0, 1)];
        v.poly(im, { fill: P.fill3, stroke: P.curve3, w: 1.8, close: true });
        v.arrow(0, 0, s.a, s.c, { color: P.curve2, w: 2 });
        v.arrow(0, 0, s.b, s.d, { color: P.curve, w: 2 });
        v.text(s.a, s.c, ' 列 1', { color: P.curve2, size: 11.5 });
        v.text(s.b, s.d, ' 列 2', { color: P.curve, size: 11.5 });
      }
      /* A⁻¹ 的像 */
      if (s.mode !== 'A') {
        if (Ai) {
          var im2 = [app2(Ai, 0, 0), app2(Ai, 1, 0), app2(Ai, 1, 1), app2(Ai, 0, 1)];
          v.poly(im2, { fill: 'rgba(224,98,54,.12)', stroke: P.curve2, w: 1.8, close: true });
          v.text(im2[2][0], im2[2][1], ' A⁻¹(单位正方形)', { color: P.curve2, size: 11.5 });
        } else {
          v.text(v.x0 + .2, v.y0 + .3, 'A 奇异：A⁻¹ 不存在，单位正方形被压成一条线段', { color: P.curve4, size: 12 });
        }
      }
      matPanel(v, [[fmt(s.a, 2), fmt(s.b, 2)], [fmt(s.c, 2), fmt(s.d, 2)]], { x: v.pad.l + 14, y: v.pad.t + 12, label: 'A', size: 12 });
      matPanel(v, Ai
        ? [[fmt(Ai[0][0], 2), fmt(Ai[0][1], 2)], [fmt(Ai[1][0], 2), fmt(Ai[1][1], 2)]]
        : [['—', '—'], ['—', '—']],
        { x: v.pad.l + 14, y: v.pad.t + 54, label: 'A⁻¹', size: 12, color: Ai ? P.curve3 : P.curve4 });
      v.text(v.x1 - .2, v.y0 + .3, 'det A = ' + num(det2(s.a, s.b, s.c, s.d), 3) + (Ai ? '（可逆）' : '（奇异）'),
        { color: Ai ? P.muted : P.curve4, size: 12, align: 'right' });
    },
    read: function (s) {
      var D = det2(s.a, s.b, s.c, s.d), Ai = inv2(s.a, s.b, s.c, s.d);
      var IA = Ai ? mul2(Ai, [[s.a, s.b], [s.c, s.d]]) : null;
      var dev = 0;
      if (IA) {
        dev = Math.max(Math.abs(IA[0][0] - 1), Math.abs(IA[0][1]), Math.abs(IA[1][0]), Math.abs(IA[1][1] - 1));
      }
      return [
        ['det A', num(D, 3)],
        ['可逆？', Ai ? '是（det ≠ 0）' : '否：det = 0，A 奇异'],
        ['A⁻¹', Ai ? '[' + fmt(Ai[0][0], 2) + ' ' + fmt(Ai[0][1], 2) + '; ' + fmt(Ai[1][0], 2) + ' ' + fmt(Ai[1][1], 2) + ']' : '不存在'],
        ['面积放大倍数', num(Math.abs(D), 3)],
        ['A⁻¹A − I', IA ? (dev < 1e-12 ? '0（误差 < 1e-12）' : fmt(dev, 6)) : '—']
      ];
    }
  });

  /* =====================================================================
     ⑦ ch03 列空间与零空间
     ===================================================================== */
  lab({
    id: 'columnspace', ch: '03', title: '列空间与零空间',
    sub: '改 A 的两列与目标向量 b：列空间决定 Ax=b 有没有解，零空间决定解是否唯一。',
    tex: "C(A)=\\{A\\mathbf{x}:\\mathbf{x}\\in\\mathbb{R}^2\\},\\qquad N(A)=\\{\\mathbf{x}:A\\mathbf{x}=\\mathbf{0}\\}",
    note: '列空间是「A 能造出的一切向量」：两列不共线就是整个 $\\mathbb{R}^2$（任何 b 都有解）；共线就退化成一条直线（b 不在线上就无解）。零空间是「被 A 压成零的向量」：可逆时只有零向量，奇异时是一整条直线。',
    view: { x0: -4.2, x1: 4.2, y0: -1.6, y1: 1.6 },
    ctrls: [
      { k: 'a', label: 'a₁₁', min: -2, max: 2, step: 0.1, val: 1.2 },
      { k: 'b', label: 'a₁₂', min: -2, max: 2, step: 0.1, val: -0.8 },
      { k: 'c', label: 'a₂₁', min: -2, max: 2, step: 0.1, val: 0.6 },
      { k: 'd', label: 'a₂₂', min: -2, max: 2, step: 0.1, val: -0.4 },
      { k: 'bx', label: 'b₁', min: -3, max: 3, step: 0.1, val: 1.4 },
      { k: 'by', label: 'b₂', min: -3, max: 3, step: 0.1, val: 1.2 }
    ],
    rankOf: function (a, b, c, d) {
      if (Math.abs(det2(a, b, c, d)) > 1e-9) return 2;
      return (Math.abs(a) + Math.abs(b) + Math.abs(c) + Math.abs(d) > 1e-9) ? 1 : 0;
    },
    draw: function (v, s) {
      var P = pal(), L = this;
      ensureAspect(v);
      var rk = L.rankOf(s.a, s.b, s.c, s.d);
      v.axes();
      /* 列空间的"着色" */
      if (rk === 2) {
        v.rect(v.x0, v.y0, v.x1, v.y1, { fill: 'rgba(215,171,97,.055)' });
        v.text(v.x1 - .12, v.y1 - .3, 'C(A) = R²：任何 b 都有解', { color: P.curve3, size: 11.5, align: 'right' });
      } else if (rk === 1) {
        var u = unit2(Math.abs(s.a) + Math.abs(s.c) > 1e-9 ? s.a : s.b, Math.abs(s.a) + Math.abs(s.c) > 1e-9 ? s.c : s.d);
        v.line(-u[0] * 9, -u[1] * 9, u[0] * 9, u[1] * 9, { color: 'rgba(215,171,97,.5)', w: 2.4 });
        var lp = edgePoint(v, u);
        v.text(lp[0], lp[1], ' C(A)', { color: P.curve3, size: 13 });
        /* 零空间方向 */
        var nv = unit2(Math.abs(s.a) + Math.abs(s.b) > 1e-9 ? s.b : s.d, Math.abs(s.a) + Math.abs(s.b) > 1e-9 ? -s.a : -s.c);
        v.line(-nv[0] * 9, -nv[1] * 9, nv[0] * 9, nv[1] * 9, { color: 'rgba(200,35,55,.55)', w: 2, dash: [6, 4] });
        var ln = edgePoint(v, nv);
        v.text(ln[0], ln[1], ' N(A)', { color: P.curve4, size: 13 });
        /* b 到列空间的投影 */
        var t = dot2(s.bx, s.by, u[0], u[1]);
        var pj = [u[0] * t, u[1] * t];
        v.dropLine(s.bx, s.by, pj[0], pj[1], { color: P.muted, w: 1.2 });
        v.dot(pj[0], pj[1], { color: P.curve3, r: 4 });
        rightAngle(v, pj, [-u[1], u[0]], 9, P.muted);
      }
      /* 两列 */
      v.arrow(0, 0, s.a, s.c, { color: P.curve, w: 2 });
      v.arrow(0, 0, s.b, s.d, { color: P.curve2, w: 2 });
      v.text(s.a, s.c, ' 列 1', { color: P.curve, size: 11.5 });
      v.text(s.b, s.d, ' 列 2', { color: P.curve2, size: 11.5 });
      /* b */
      v.arrow(0, 0, s.bx, s.by, { color: P.curve4, w: 2.3 });
      v.text(s.bx, s.by, ' b', { color: P.curve4, size: 13 });
    },
    read: function (s) {
      var L = this, rk = L.rankOf(s.a, s.b, s.c, s.d);
      var dist = 0, inside = '在（dist = 0）';
      if (rk === 1) {
        var u = unit2(Math.abs(s.a) + Math.abs(s.c) > 1e-9 ? s.a : s.b, Math.abs(s.a) + Math.abs(s.c) > 1e-9 ? s.c : s.d);
        dist = Math.abs(dot2(s.bx, s.by, -u[1], u[0]));
        inside = (dist < 1e-9 ? '在（dist = 0）' : '不在（dist = ' + fmt(dist, 2) + '）');
      }
      var nv = rk === 1
        ? (Math.abs(s.a) + Math.abs(s.b) > 1e-9 ? vecStr(s.b, -s.a) : vecStr(s.d, -s.c))
        : '只有零向量';
      return [
        ['det A', num(det2(s.a, s.b, s.c, s.d), 3)],
        ['rank', String(rk) + ' / 2'],
        ['C(A)', rk === 2 ? '整个 R²' : (rk === 1 ? '过原点的直线（方向 = 列向量）' : '只有零向量')],
        ['b 在 C(A) 里吗', rk === 2 ? '在（任何 b 都在）' : inside],
        ['N(A)', rk === 2 ? '只有零向量' : ('方向 ' + nv + ' 的整条直线')]
      ];
    }
  });

  /* =====================================================================
     ⑧ ch03 四个基本子空间
     ===================================================================== */
  lab({
    id: 'fourspaces', ch: '03', title: '四个基本子空间',
    sub: '调 m、n、r：左右两根数轴分别是 Rᵐ 与 Rⁿ，被 C(A)、N(Aᵀ)、C(Aᵀ)、N(A) 按维数切开。',
    tex: "\\dim C(A)=\\dim C(A^{\\mathsf T})=r,\\quad \\dim N(A)=n-r,\\quad \\dim N(A^{\\mathsf T})=m-r",
    note: '<b>秩-零化度定理的图形版</b>：$r+(n-r)=n$ 与 $r+(m-r)=m$ 各自成立——同一根轴上两段长度相加正好等于空间维数。而且 $C(A)\\perp N(A^{\\mathsf T})$、$C(A^{\\mathsf T})\\perp N(A)$：这是正交补，不是普通的"分成两半"。',
    view: { x0: 0, x1: 10, y0: 0, y1: 3.6 },
    ctrls: [
      { k: 'm', label: '行数 m', min: 2, max: 5, step: 1, val: 3 },
      { k: 'n', label: '列数 n', min: 2, max: 5, step: 1, val: 4 },
      { k: 'r', label: '秩 r', min: 0, max: 5, step: 1, val: 2 },
      { k: 'focus', label: '突出', type: 'sel', val: 'C(A)', opts: [
        ['C(A)', 'C(A) 列空间'], ['N(A)', 'N(A) 零空间'],
        ['C(A^T)', 'C(Aᵀ) 行空间'], ['N(A^T)', 'N(Aᵀ) 左零空间']
      ] }
    ],
    draw: function (v, s) {
      var P = pal(), L = this;
      var m = Math.round(s.m), n = Math.round(s.n);
      var rMax = Math.min(m, n), r = clamp(Math.round(s.r), 0, rMax);
      var totalH = 2.5, yb = 0.62, top = yb + totalH;
      var xL = 1.7, xR = 6.3, bw = 2.0;
      function seg(x, y1, y2, dim, name, color, on, tag) {
        if (y2 - y1 < 0.02) return;
        v.rect(x, y1, x + bw, y2, {
          fill: on ? 'rgba(215,171,97,.24)' : 'rgba(167,180,195,.10)',
          stroke: color, w: on ? 2 : 1.2
        });
        if (y2 - y1 > 0.34) {
          v.text(x + bw / 2, (y1 + y2) / 2 + .12, name, { align: 'center', color: on ? P.curve3 : color, size: 12 });
          v.text(x + bw / 2, (y1 + y2) / 2 - .24, 'dim ' + dim, { align: 'center', color: P.muted, size: 11 });
        } else {
          v.text(x + bw + .12, (y1 + y2) / 2, name + ' dim ' + dim, { color: color, size: 10.5 });
        }
      }
      v.clear();
      v.text(v.x1 / 2, 3.32, '四个基本子空间的维数（m = ' + m + '，n = ' + n + '，r = ' + r + '）', { align: 'center', color: P.muted, size: 12 });
      /* 左柱：R^m = C(A) ⊕ N(Aᵀ) */
      var hC = totalH * (r / m);
      seg(xL, top - hC, top, r, 'C(A)', P.curve3, s.focus === 'C(A)');
      seg(xL, yb, top - hC, m - r, 'N(Aᵀ)', P.curve4, s.focus === 'N(A^T)');
      v.text(xL + bw / 2, yb - .3, 'Rᵐ  (m = ' + m + ')', { align: 'center', color: P.muted, size: 11.5 });
      /* 右柱：R^n = C(Aᵀ) ⊕ N(A) */
      var hC2 = totalH * (r / n);
      seg(xR, top - hC2, top, r, 'C(Aᵀ)', P.curve, s.focus === 'C(A^T)');
      seg(xR, yb, top - hC2, n - r, 'N(A)', P.curve2, s.focus === 'N(A)');
      v.text(xR + bw / 2, yb - .3, 'Rⁿ  (n = ' + n + ')', { align: 'center', color: P.muted, size: 11.5 });
      /* 正交符号：每根轴的分界处就是两个正交补的分割线 */
      v.text(xL + bw + .14, top - hC - .12, '⊥', { color: P.curve3, size: 13 });
      v.text(xR + bw + .14, top - hC2 - .12, '⊥', { color: P.curve3, size: 13 });
      v.text(xL + bw + .14, top - hC + .22, 'C(A) ⊥ N(Aᵀ)', { color: P.tick, size: 9.5 });
      v.text(xR + bw + .14, top - hC2 + .22, 'C(Aᵀ) ⊥ N(A)', { color: P.tick, size: 9.5 });
      /* 底部公式 */
      v.text(v.x1 / 2, 0.26, 'r + (n − r) = n  ✓     r + (m − r) = m  ✓     两个 r 是同一个秩', { align: 'center', color: P.curve3, size: 11.5 });
      if (r < Math.round(s.r)) v.text(xL - .1, yb - .62, 'r 已钳制到 min(m, n) = ' + rMax, { color: P.curve4, size: 10.5 });
    },
    read: function (s) {
      var m = Math.round(s.m), n = Math.round(s.n), rMax = Math.min(m, n);
      var r = clamp(Math.round(s.r), 0, rMax);
      return [
        ['矩阵规模', m + ' × ' + n],
        ['秩 r', String(r) + (r < Math.round(s.r) ? '（滑块值 ' + Math.round(s.r) + ' 已被钳制）' : '')],
        ['Rᵐ 分解', 'C(A) ' + r + ' + N(Aᵀ) ' + (m - r) + ' = ' + m + ' ✓'],
        ['Rⁿ 分解', 'C(Aᵀ) ' + r + ' + N(A) ' + (n - r) + ' = ' + n + ' ✓'],
        ['四个维数', 'C(A) ' + r + ' · N(A) ' + (n - r) + ' · C(Aᵀ) ' + r + ' · N(Aᵀ) ' + (m - r)]
      ];
    }
  });

  /* =====================================================================
     ⑨ ch04 投影到一条直线
     ===================================================================== */
  lab({
    id: 'projection', ch: '04', title: '投影：b 在 a 上的影子',
    sub: '改方向 a 与被投影的 b：黄色箭头是投影 p，红色虚线 e = b − p 永远垂直于 a。',
    tex: "\\mathbf{p}=\\frac{\\mathbf{a}\\cdot\\mathbf{b}}{\\mathbf{a}\\cdot\\mathbf{a}}\\,\\mathbf{a},\\qquad \\mathbf{e}=\\mathbf{b}-\\mathbf{p}\\perp\\mathbf{a}",
    note: '投影矩阵 $P=\\mathbf{a}\\mathbf{a}^{\\mathsf T}/\\mathbf{a}^{\\mathsf T}\\mathbf{a}$ 把任何向量压到 a 的方向上，$P^2=P$、$P^{\\mathsf T}=P$。误差 $\\mathbf{e}=\\mathbf{b}-\\mathbf{p}$ 垂直于 a，所以 $\\lVert\\mathbf{e}\\rVert$ 就是 b 到直线的最短距离。',
    view: { x0: -4.2, x1: 4.2, y0: -1.6, y1: 1.6 },
    ctrls: [
      { k: 'ax', label: 'a₁', min: -2.5, max: 2.5, step: 0.1, val: 1.6 },
      { k: 'ay', label: 'a₂', min: -2.5, max: 2.5, step: 0.1, val: 0.5 },
      { k: 'bx', label: 'b₁', min: -2.5, max: 2.5, step: 0.1, val: 1.2 },
      { k: 'by', label: 'b₂', min: -2.5, max: 2.5, step: 0.1, val: 1.5 }
    ],
    draw: function (v, s) {
      var P = pal();
      ensureAspect(v);
      var aa = dot2(s.ax, s.ay, s.ax, s.ay);
      v.axes();
      /* a 所在直线 */
      if (aa > 1e-12) v.line(-s.ax * 9, -s.ay * 9, s.ax * 9, s.ay * 9, { color: 'rgba(167,180,195,.20)', w: 1.2, dash: [4, 4] });
      var ok = aa > 1e-9;
      var t = ok ? dot2(s.ax, s.ay, s.bx, s.by) / aa : 0;
      var px = s.ax * t, py = s.ay * t;
      if (ok) {
        /* 误差 e = b − p */
        v.arrow(px, py, s.bx, s.by, { color: P.curve4, w: 1.8, dash: [6, 4] });
        v.text((px + s.bx) / 2, (py + s.by) / 2, ' e = b − p', { color: P.curve4, size: 12 });
        v.arrow(0, 0, px, py, { color: P.curve3, w: 2.4 });
        v.dot(px, py, { color: P.curve3, r: 4 });
        v.text(px, py, ' p', { color: P.curve3, size: 13 });
        rightAngle(v, [px, py], unit2(s.bx - px, s.by - py), 9, P.curve3);
      } else {
        v.text(v.x0 + .2, v.y0 + .3, 'a 是零向量：没有方向可投影', { color: P.curve4, size: 12 });
      }
      v.arrow(0, 0, s.ax, s.ay, { color: P.curve, w: 2.2 });
      v.arrow(0, 0, s.bx, s.by, { color: P.curve2, w: 2.2 });
      v.text(s.ax, s.ay, ' a', { color: P.curve, size: 13.5 });
      v.text(s.bx, s.by, ' b', { color: P.curve2, size: 13.5 });
      v.text(v.x0 + .2, v.y0 + .26, '|e| = ' + (ok ? fmt(len2(s.bx - px, s.by - py), 3) : '—') + '  （b 到直线的距离）', { color: P.muted, size: 11.5 });
    },
    read: function (s) {
      var aa = dot2(s.ax, s.ay, s.ax, s.ay), ab = dot2(s.ax, s.ay, s.bx, s.by);
      if (aa < 1e-9) {
        return [['a', '(0, 0) 零向量'], ['a·b', fmt(ab, 3)], ['投影 p', '—（a 没有方向）'], ['误差 |e|', '—'], ['a·e', '—']];
      }
      var t = ab / aa, px = s.ax * t, py = s.ay * t;
      var ex = s.bx - px, ey = s.by - py;
      return [
        ['a · b', fmt(ab, 3)],
        ['投影系数 t', fmt(t, 3)],
        ['p = t·a', vecStr(px, py)],
        ['e = b − p', vecStr(ex, ey)],
        ['a · e（应为 0）', num(dot2(s.ax, s.ay, ex, ey), 6, 1e-9) + ' · |e| = ' + fmt(len2(ex, ey), 3)]
      ];
    }
  });

  /* =====================================================================
     ⑩ ch04 最小二乘拟合
     ===================================================================== */
  lab({
    id: 'leastsquares', ch: '04', title: '最小二乘：拟合一条直线',
    sub: '四个散点的纵坐标可调：黄色竖线是残差，正规方程给出的直线让残差平方和最小。',
    tex: "\\hat{\\mathbf{x}}=(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\mathbf{b},\\qquad A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}",
    note: '方程多于未知数时通常无解（四点一般不在一条直线上）。最小二乘退一步问：<b>哪条直线使残差平方和最小</b>？把每个残差竖起来平方再相加，求导得零正是正规方程 $A^{\\mathsf T}A\\hat{\\mathbf{x}}=A^{\\mathsf T}\\mathbf{b}$——也就是"误差向量垂直于 A 的列空间"。',
    view: { x0: -3.6, x1: 3.6, y0: -1.35, y1: 1.35 },
    xs: [-2, -1, 1, 2],
    ctrls: [
      { k: 'y1', label: 'y₁ (x=−2)', min: -1.2, max: 1.2, step: 0.1, val: 0.6 },
      { k: 'y2', label: 'y₂ (x=−1)', min: -1.2, max: 1.2, step: 0.1, val: -0.4 },
      { k: 'y3', label: 'y₃ (x=1)', min: -1.2, max: 1.2, step: 0.1, val: 0.2 },
      { k: 'y4', label: 'y₄ (x=2)', min: -1.2, max: 1.2, step: 0.1, val: 1 },
      { k: 'model', label: '模型', type: 'sel', val: 'line', opts: [['line', 'y = c + d x'], ['origin', 'y = d x（过原点）']] }
    ],
    fit: function (s) {
      var L = this, xs = L.xs, ys = [s.y1, s.y2, s.y3, s.y4];
      var sx = 0, sxx = 0, sy = 0, sxy = 0, i;
      for (i = 0; i < 4; i++) { sx += xs[i]; sxx += xs[i] * xs[i]; sy += ys[i]; sxy += xs[i] * ys[i]; }
      var c, d;
      if (s.model === 'origin') { c = 0; d = sxy / sxx; }
      else { c = (sy * sxx - sx * sxy) / (4 * sxx - sx * sx); d = (4 * sxy - sx * sy) / (4 * sxx - sx * sx); }
      var rss = 0, res = [];
      for (i = 0; i < 4; i++) { var r = ys[i] - (c + d * xs[i]); res.push(r); rss += r * r; }
      return { c: c, d: d, rss: rss, res: res, ys: ys, sx: sx, sxx: sxx, sy: sy, sxy: sxy };
    },
    draw: function (v, s) {
      var P = pal(), L = this, F = L.fit(s), xs = L.xs, i;
      v.axes();
      /* 拟合直线 */
      v.line(v.x0, F.c + F.d * v.x0, v.x1, F.c + F.d * v.x1, { color: P.curve3, w: 2.4 });
      /* 残差竖线 + 散点 */
      for (i = 0; i < 4; i++) {
        var yh = F.c + F.d * xs[i];
        v.line(xs[i], F.ys[i], xs[i], yh, { color: 'rgba(200,35,55,.85)', w: 1.6 });
        v.dot(xs[i], yh, { color: P.curve3, r: 2.6, solid: true });
        v.dot(xs[i], F.ys[i], { color: P.curve2, r: 5 });
        if (Math.abs(F.res[i]) > 0.12) v.text(xs[i], (F.ys[i] + yh) / 2, fmt(F.res[i], 2), { color: P.curve4, size: 10.5, align: 'center' });
      }
      v.text(v.x0 + .12, v.y0 + .2, 'y = ' + num(F.c, 3) + (F.d >= 0 ? ' + ' : ' − ') + num(Math.abs(F.d), 3) + 'x', { color: P.curve3, size: 12.5 });
      v.text(v.x1 - .12, v.y0 + .2, 'RSS = ' + num(F.rss, 4, 1e-12), { color: P.muted, size: 11.5, align: 'right' });
    },
    read: function (s) {
      var F = this.fit(s);
      return [
        ['模型', s.model === 'origin' ? 'y = d x（过原点，1 个参数）' : 'y = c + d x（2 个参数）'],
        ['截距 c', num(F.c, 3)],
        ['斜率 d', num(F.d, 3)],
        ['残差平方和 RSS', num(F.rss, 4, 1e-12)],
        ['正规方程左侧', 'Σx = ' + fmt(F.sx, 2) + ' · Σx² = ' + fmt(F.sxx, 2) + ' · Σxy = ' + fmt(F.sxy, 2)]
      ];
    }
  });

  /* =====================================================================
     ⑪ ch04 Gram–Schmidt 正交化
     ===================================================================== */
  lab({
    id: 'gramschmidt', ch: '04', title: 'Gram–Schmidt 正交化',
    sub: '拖步骤：先把 a 归一化成 q₁，再从 b 里扣掉在 q₁ 上的投影，剩下的 w 归一化就是 q₂。',
    tex: "\\mathbf{q}_1=\\frac{\\mathbf{a}}{\\lVert\\mathbf{a}\\rVert},\\qquad \\mathbf{w}=\\mathbf{b}-(\\mathbf{q}_1^{\\mathsf T}\\mathbf{b})\\,\\mathbf{q}_1,\\qquad \\mathbf{q}_2=\\frac{\\mathbf{w}}{\\lVert\\mathbf{w}\\rVert}",
    note: '正交化的核心只有一句：<b>把 b 在 a 方向上的分量减掉</b>。剩下的 $\\mathbf{w}$ 与 a 垂直，归一化就得到标准正交基 $\\mathbf{q}_1,\\mathbf{q}_2$——$Q^{\\mathsf T}Q=I$，$A=QR$ 里的 R 就是这三步的系数。',
    view: { x0: -4.2, x1: 4.2, y0: -1.6, y1: 1.6 },
    ctrls: [
      { k: 'a1', label: 'a₁', min: -2, max: 2, step: 0.1, val: 1.8 },
      { k: 'a2', label: 'a₂', min: -2, max: 2, step: 0.1, val: 0.6 },
      { k: 'b1', label: 'b₁', min: -2, max: 2, step: 0.1, val: 0.4 },
      { k: 'b2', label: 'b₂', min: -2, max: 2, step: 0.1, val: 1.6 },
      { k: 'step', label: '步骤', min: 0, max: 3, step: 1, val: 3 }
    ],
    draw: function (v, s) {
      var P = pal(), step = Math.round(s.step);
      ensureAspect(v);
      var la = len2(s.a1, s.a2), lb = len2(s.b1, s.b2);
      var q1 = la > 1e-9 ? [s.a1 / la, s.a2 / la] : null;
      var dotq = q1 ? dot2(q1[0], q1[1], s.b1, s.b2) : 0;
      var wx = q1 ? s.b1 - dotq * q1[0] : NaN, wy = q1 ? s.b2 - dotq * q1[1] : NaN;
      var lw = q1 ? len2(wx, wy) : 0;
      var q2 = lw > 1e-9 ? [wx / lw, wy / lw] : null;
      v.axes();
      if (q1) v.line(-q1[0] * 9, -q1[1] * 9, q1[0] * 9, q1[1] * 9, { color: 'rgba(167,180,195,.18)', w: 1.1, dash: [4, 4] });
      /* 原向量 */
      v.arrow(0, 0, s.a1, s.a2, { color: P.curve, w: 1.6 });
      v.text(s.a1, s.a2, ' a', { color: P.curve, size: 13 });
      v.arrow(0, 0, s.b1, s.b2, { color: P.curve2, w: 1.6 });
      v.text(s.b1, s.b2, ' b', { color: P.curve2, size: 13 });
      /* 第 1 步：q₁ */
      if (step >= 1 && q1) {
        v.arrow(0, 0, q1[0] * 1.9, q1[1] * 1.9, { color: P.curve3, w: 2.2 });
        v.text(q1[0] * 1.9, q1[1] * 1.9, ' q₁', { color: P.curve3, size: 13 });
      }
      /* 第 2 步：投影与 w */
      if (step >= 2 && q1) {
        var pp = [q1[0] * dotq, q1[1] * dotq];
        v.arrow(0, 0, pp[0], pp[1], { color: 'rgba(215,171,97,.55)', w: 1.6, dash: [5, 4] });
        v.dropLine(pp[0], pp[1], s.b1, s.b2, { color: P.curve4, w: 1.6 });
        v.text(pp[0], pp[1], ' 投影', { color: P.curve4, size: 11 });
        rightAngle(v, [pp[0], pp[1]], unit2(s.b1 - pp[0], s.b2 - pp[1]), 9, P.curve4);
        v.arrow(0, 0, wx, wy, { color: P.curve4, w: 2 });
        v.text(wx, wy, ' w', { color: P.curve4, size: 12.5 });
      }
      /* 第 3 步：q₂ 与直角 */
      if (step >= 3 && q2) {
        v.arrow(0, 0, q2[0] * 1.6, q2[1] * 1.6, { color: P.curve4, w: 2.6 });
        v.text(q2[0] * 1.6, q2[1] * 1.6, ' q₂', { color: P.curve4, size: 13 });
        rightAngle(v, [0, 0], q1, 12, P.muted);
      }
      v.text(v.x0 + .14, v.y0 + .24, '步骤 ' + step + ' / 3 · ' + ['原向量 a、b', '归一化：q₁ = a / |a|', '扣掉投影：w = b − (q₁ᵀb) q₁', '归一化：q₂ = w / |w|'][step],
        { color: P.curve3, size: 11.5 });
      if (!q2 && step >= 2) v.text(v.x0 + .14, v.y0 + .64, 'b 与 a 共线，正交化后 w = 0：没有第二个正交方向', { color: P.curve4, size: 11.5 });
    },
    read: function (s) {
      var step = Math.round(s.step);
      var la = len2(s.a1, s.a2);
      var q1 = la > 1e-9 ? [s.a1 / la, s.a2 / la] : null;
      var dotq = q1 ? dot2(q1[0], q1[1], s.b1, s.b2) : 0;
      var wx = q1 ? s.b1 - dotq * q1[0] : 0, wy = q1 ? s.b2 - dotq * q1[1] : 0;
      var lw = len2(wx, wy);
      var q2 = lw > 1e-9 ? [wx / lw, wy / lw] : null;
      return [
        ['步骤', step + ' / 3'],
        ['q₁ = a / |a|', q1 ? vecStr(q1[0], q1[1], 3) : '—（a 是零向量）'],
        ['投影系数 q₁ᵀb', q1 ? fmt(dotq, 3) : '—'],
        ['w = b − 投影', q1 ? vecStr(wx, wy, 3) + '（|w| = ' + fmt(lw, 3) + '）' : '—'],
        ['q₁·q₂（应为 0）', q2 ? num(dot2(q1[0], q1[1], q2[0], q2[1]), 6, 1e-9) + ' · q₂ = ' + vecStr(q2[0], q2[1], 2) : '—（b 与 a 共线）']
      ];
    }
  });

  /* =====================================================================
     ⑫ ch05 行列式与面积
     ===================================================================== */
  lab({
    id: 'determinant', ch: '05', title: '行列式与面积',
    sub: '拖两列向量：平行四边形的有向面积就是 det A；正方形被翻转时 det 变号，被压扁时 det → 0。',
    tex: "\\det A=\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}=ad-bc=\\text{有向面积}",
    note: '把两列看成平行四边形的两条边：<b>|det| 是面积，符号是方向</b>。det > 0 表示从第 1 列转到第 2 列是逆时针，det < 0 是顺时针，det = 0 表示两列共线、平行四边形被压成线段——此时 A 不可逆。',
    view: { x0: -3.9, x1: 3.9, y0: -1.5, y1: 1.5 },
    ctrls: [
      { k: 'ax', label: '列1 的 x', min: -2, max: 2, step: 0.1, val: 1.6 },
      { k: 'ay', label: '列1 的 y', min: -2, max: 2, step: 0.1, val: 0.4 },
      { k: 'bx', label: '列2 的 x', min: -2, max: 2, step: 0.1, val: -0.6 },
      { k: 'by', label: '列2 的 y', min: -2, max: 2, step: 0.1, val: 1 }
    ],
    draw: function (v, s) {
      var P = pal(), D = det2(s.ax, s.ay, s.bx, s.by);
      ensureAspect(v);
      v.axes();
      /* 单位正方形（淡） */
      v.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { stroke: P.muted, w: 1.1, dash: [4, 4] });
      /* 平行四边形 */
      var fill = D >= 0 ? 'rgba(215,171,97,.16)' : 'rgba(200,35,55,.18)';
      v.poly([[0, 0], [s.ax, s.ay], [s.ax + s.bx, s.ay + s.by], [s.bx, s.by]], { fill: fill, stroke: D >= 0 ? P.curve3 : P.curve4, w: 2, close: true });
      /* 两列 */
      v.arrow(0, 0, s.ax, s.ay, { color: P.curve, w: 2.2 });
      v.arrow(0, 0, s.bx, s.by, { color: P.curve2, w: 2.2 });
      v.text(s.ax, s.ay, ' 列 1', { color: P.curve, size: 12 });
      v.text(s.bx, s.by, ' 列 2', { color: P.curve2, size: 12 });
      /* 旋转方向弧 */
      var a1 = Math.atan2(s.ay, s.ax), a2 = Math.atan2(s.by, s.bx);
      var dd = a2 - a1;
      while (dd > Math.PI) dd -= 2 * Math.PI;
      while (dd < -Math.PI) dd += 2 * Math.PI;
      if (Math.abs(D) > 1e-6) angleArc(v, 0, 0, 0.72, a1, a1 + dd, { color: D > 0 ? P.curve3 : P.curve4, w: 1.6 });
      var msg = Math.abs(D) < 1e-6 ? 'det = 0：两列共线，面积 0，A 不可逆'
        : (D > 0 ? 'det > 0：逆时针，面积 = ' + num(Math.abs(D), 3) : 'det < 0：顺时针（翻转），面积 = ' + num(Math.abs(D), 3));
      v.text(v.x0 + .14, v.y0 + .26, msg, { color: Math.abs(D) < 1e-6 ? P.curve4 : (D > 0 ? P.curve3 : P.curve4), size: 12 });
    },
    read: function (s) {
      var D = det2(s.ax, s.ay, s.bx, s.by);
      return [
        ['det A = ad − bc', num(D, 3)],
        ['|det|（面积）', num(Math.abs(D), 3)],
        ['方向', Math.abs(D) < 1e-6 ? '退化（无方向）' : (D > 0 ? '逆时针（正）' : '顺时针（负，含翻转）')],
        ['面积变化', '单位正方形 1 → 平行四边形 ' + num(Math.abs(D), 3)],
        ['是否可逆', Math.abs(D) < 1e-6 ? '奇异：det = 0' : '可逆：det ≠ 0']
      ];
    }
  });

  /* =====================================================================
     ⑬ ch06 特征向量：不动方向
     ===================================================================== */
  lab({
    id: 'eigen', ch: '06', title: '特征向量：不动方向',
    sub: '改 2×2 矩阵：单位圆被拉成椭圆；黄色与红色的特征方向是 A 作用下"只改长度不改方向"的两条线。',
    tex: "A\\mathbf{x}=\\lambda\\mathbf{x},\\qquad \\det(A-\\lambda I)=\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A=0",
    note: '<b>特征向量是矩阵的骨骼</b>：大多数向量被 A 转过一个角度，只有特征向量原地不动、只被拉伸 λ 倍。判别式 $\\operatorname{disc}=(\\operatorname{tr}A)^2-4\\det A$ 决定特征值是实是复：disc < 0 时矩阵含旋转成分，图上圆变成"转过一点的椭圆"，没有实特征方向。',
    view: { x0: -5.6, x1: 5.6, y0: -2, y1: 2 },
    ctrls: [
      { k: 'a', label: 'a', min: -1.6, max: 1.6, step: 0.1, val: 1.2 },
      { k: 'b', label: 'b', min: -1.6, max: 1.6, step: 0.1, val: 0.6 },
      { k: 'c', label: 'c', min: -1.6, max: 1.6, step: 0.1, val: 0.4 },
      { k: 'd', label: 'd', min: -1.6, max: 1.6, step: 0.1, val: 0.8 }
    ],
    draw: function (v, s) {
      var P = pal(), A = [[s.a, s.b], [s.c, s.d]], E = eig2(A);
      ensureAspect(v);
      v.axes();
      /* 单位圆 → 椭圆 */
      v.param(function (t) { return Math.cos(t); }, function (t) { return Math.sin(t); }, 0, Math.PI * 2, { color: 'rgba(167,180,195,.35)', w: 1.2, dash: [3, 3], n: 260 });
      v.param(function (t) { return A[0][0] * Math.cos(t) + A[0][1] * Math.sin(t); },
              function (t) { return A[1][0] * Math.cos(t) + A[1][1] * Math.sin(t); },
              0, Math.PI * 2, { color: P.curve2, w: 2.2, n: 300 });
      if (E.real) {
        [[E.v1, E.l1, P.curve3, 'v₁'], [E.v2, E.l2, P.curve4, 'v₂']].forEach(function (it) {
          var u = it[0], lam = it[1];
          if (Math.abs(u[0]) + Math.abs(u[1]) < 1e-9) return;
          v.line(-u[0] * 12, -u[1] * 12, u[0] * 12, u[1] * 12, { color: it[2] === P.curve3 ? 'rgba(215,171,97,.40)' : 'rgba(200,35,55,.40)', w: 1.4, dash: [6, 4] });
          var L0 = 2.1;
          v.arrow(0, 0, u[0] * L0, u[1] * L0, { color: it[2], w: 2.4 });
          v.text(u[0] * L0, u[1] * L0, ' ' + it[3] + '（λ = ' + fmt(lam, 2) + '）', { color: it[2], size: 11.5 });
        });
      } else {
        v.text(v.x0 + .2, v.y0 + .3, '复特征值 ' + fmt(E.re, 2) + ' ± ' + fmt(E.im, 2) + 'i：旋转型，没有实特征方向', { color: P.curve4, size: 12 });
      }
      v.text(v.x1 - .14, v.y0 + .28, '迹 = ' + fmt(E.tr, 2) + ' · det = ' + fmt(E.det, 2), { color: P.muted, size: 11.5, align: 'right' });
    },
    read: function (s) {
      var A = [[s.a, s.b], [s.c, s.d]], E = eig2(A);
      var lamStr = E.real ? ('λ₁ = ' + fmt(E.l1, 3)) : ('λ = ' + fmt(E.re, 2) + ' ± ' + fmt(E.im, 2) + 'i');
      return [
        [E.real ? 'λ₁' : '复 λ', E.real ? fmt(E.l1, 3) : fmt(E.re, 2) + ' ± ' + fmt(E.im, 2) + 'i'],
        [E.real ? 'λ₂' : '判别式', E.real ? fmt(E.l2, 3) : fmt(E.tr * E.tr - 4 * E.det, 3)],
        ['迹 = λ₁ + λ₂', num(E.tr, 3)],
        ['det = λ₁λ₂', num(E.det, 3)],
        ['特征方向', E.real
          ? (Math.abs(E.l1 - E.l2) < 1e-9 ? '重根：只有一个方向（可能不足）' : vecStr(E.v1[0], E.v1[1], 2) + ' 与 ' + vecStr(E.v2[0], E.v2[1], 2))
          : '无实特征方向（旋转 + 缩放）']
      ];
    }
  });

  /* =====================================================================
     ⑭ ch06 对角化与矩阵幂
     ===================================================================== */
  lab({
    id: 'diagonalize', ch: '06', title: '对角化与矩阵幂',
    sub: '上三角矩阵 A 的两个对角元就是特征值：反复乘 A，向量方向会转到 λ 较大的那个特征方向上。',
    tex: "A=S\\Lambda S^{-1}\\;\\Longrightarrow\\;A^{n}\\mathbf{v}=S\\Lambda^{n}S^{-1}\\mathbf{v}=\\sum_i c_i\\lambda_i^{n}\\mathbf{v}_i",
    note: '<b>把向量拆到特征基上</b>，乘 A 就变成每个分量各自乘 λ 再乘 n 次：$\\lambda_i^n$。谁的 |λ| 大谁就主导，方向收敛到那个特征向量（|λ₁|>|λ₂| 时）。若某个 |λ|>1，长度指数爆炸；全 |λ|<1 则衰减到零——这就是差分方程稳定性的判据。',
    view: { x0: -4.6, x1: 4.6, y0: -1.75, y1: 1.75 },
    ctrls: [
      { k: 'a', label: 'λ₁ = a', min: 0.4, max: 1.6, step: 0.05, val: 1.3 },
      { k: 'd', label: 'λ₂ = d', min: 0.1, max: 1.5, step: 0.05, val: 0.6 },
      { k: 'b', label: '右上 b', min: -1.2, max: 1.2, step: 0.1, val: 0.8 },
      { k: 'n', label: '幂次 n', min: 0, max: 20, step: 1, val: 6 },
      { k: 'v1', label: 'v₁', min: -1.5, max: 1.5, step: 0.1, val: 0.4 },
      { k: 'v2', label: 'v₂', min: -1.5, max: 1.5, step: 0.1, val: 1.2 }
    ],
    steps: function (s) {
      var A = [[s.a, s.b], [0, s.d]], n = Math.round(s.n), pts = [[s.v1, s.v2]], w = [s.v1, s.v2], i;
      for (i = 0; i < n; i++) { w = app2(A, w[0], w[1]); pts.push([w[0], w[1]]); }
      return { pts: pts, w: w, A: A, n: n };
    },
    draw: function (v, s) {
      var P = pal(), L = this, R = L.steps(s);
      ensureAspect(v);
      v.axes();
      /* 特征方向：x 轴（λ₁ = a）与 (b, d−a)（λ₂ = d） */
      v.line(v.x0, 0, v.x1, 0, { color: 'rgba(215,171,97,.45)', w: 1.6, dash: [7, 4] });
      var ev2 = [s.b, s.d - s.a];
      if (len2(ev2[0], ev2[1]) > 1e-9) {
        var u2 = unit2(ev2[0], ev2[1]);
        v.line(-u2[0] * 12, -u2[1] * 12, u2[0] * 12, u2[1] * 12, { color: 'rgba(200,35,55,.38)', w: 1.4, dash: [5, 4] });
        v.text(u2[0] * 2.3, u2[1] * 2.3, 'λ₂ 方向', { color: P.curve4, size: 11 });
      }
      v.text(v.x0 + .14, 0.22, ' λ₁ 方向（x 轴）', { color: P.curve3, size: 11 });
      /* 轨迹折线 + 点 */
      v.poly(R.pts, { stroke: 'rgba(224,98,54,.32)', w: 1.2 });
      var c = v.ctx, i, inView = 0;
      c.save(); c.fillStyle = 'rgba(167,180,195,.55)';
      for (i = 0; i < R.pts.length; i++) {
        var q = R.pts[i];
        if (q[0] < v.x0 || q[0] > v.x1 || q[1] < v.y0 || q[1] > v.y1) continue;
        c.beginPath(); c.arc(v.px(q[0]), v.py(q[1]), 2.2, 0, Math.PI * 2); c.fill(); inView++;
      }
      c.restore();
      /* v 与 A^n v */
      v.arrow(0, 0, s.v1, s.v2, { color: P.muted, w: 1.5 });
      v.text(s.v1, s.v2, ' v', { color: P.muted, size: 12.5 });
      var lw = len2(R.w[0], R.w[1]);
      if (lw > 1e-9) {
        var u = [R.w[0] / lw, R.w[1] / lw], cut = lw > 2.9, L0 = cut ? 2.9 : lw;
        v.arrow(0, 0, u[0] * L0, u[1] * L0, { color: P.curve2, w: 2.6 });
        v.text(u[0] * L0, u[1] * L0, cut ? (' Aⁿv 方向（|Aⁿv| = ' + fmt(lw, 2) + '，已超出画面）') : ' Aⁿv', { color: P.curve2, size: 12 });
      }
      v.text(v.x1 - .14, v.y0 + .28, '|Aⁿv| = ' + fmt(lw, 3), { color: P.muted, size: 11.5, align: 'right' });
    },
    read: function (s) {
      var L = this, R = L.steps(s);
      var lw = len2(R.w[0], R.w[1]);
      var lead = Math.abs(s.a) >= Math.abs(s.d) ? 'x 轴（λ₁ = ' + fmt(s.a, 2) + '）' : 'λ₂ 方向（λ₂ = ' + fmt(s.d, 2) + '）';
      var u = lw > 1e-9 ? vecStr(R.w[0] / lw, R.w[1] / lw, 3) : '零向量';
      return [
        ['λ₁, λ₂', fmt(s.a, 2) + ' · ' + fmt(s.d, 2)],
        ['n', String(R.n) + ' 次幂'],
        ['Aⁿv', vecStr(R.w[0], R.w[1], 2) + '（|·| = ' + fmt(lw, 3) + '）'],
        ['Aⁿv 方向', u],
        ['主导方向', Math.abs(s.a) === Math.abs(s.d) ? '两特征值等大：方向不收敛' : lead]
      ];
    }
  });

  /* =====================================================================
     ⑮ ch07 SVD 几何：圆 → 椭圆
     ===================================================================== */
  lab({
    id: 'svd', ch: '07', title: 'SVD 几何：圆变椭圆',
    sub: '任何 2×2 矩阵都把单位圆变成椭圆：两个半轴长就是 σ₁、σ₂，方向是 U 的两列；秩 1 近似把椭圆压成一条线段。',
    tex: "A=U\\Sigma V^{\\mathsf T}=\\sigma_1\\mathbf{u}_1\\mathbf{v}_1^{\\mathsf T}+\\sigma_2\\mathbf{u}_2\\mathbf{v}_2^{\\mathsf T},\\qquad \\sigma_1\\ge\\sigma_2\\ge0",
    note: 'SVD 说：先旋转（$V^{\\mathsf T}$）、再沿坐标轴拉伸 $\\sigma_1,\\sigma_2$、再旋转（U）。所以单位圆一定变成椭圆，$\\sigma_1\\sigma_2=|\\det A|$ 是面积缩放，$\\sigma_1/\\sigma_2=\\kappa$ 是条件数。丢掉小的那一项只剩秩 1 近似：椭圆塌成一条线段。',
    view: { x0: -4.2, x1: 4.2, y0: -1.6, y1: 1.6 },
    ctrls: [
      { k: 'a', label: 'a', min: -1.6, max: 1.6, step: 0.1, val: 1.4 },
      { k: 'b', label: 'b', min: -1.6, max: 1.6, step: 0.1, val: 0.9 },
      { k: 'c', label: 'c', min: -1.6, max: 1.6, step: 0.1, val: 0.2 },
      { k: 'd', label: 'd', min: -1.6, max: 1.6, step: 0.1, val: 0.6 }
    ],
    draw: function (v, s) {
      var P = pal();
      ensureAspect(v);
      var A = [[s.a, s.b], [s.c, s.d]], S = svd2(A);
      v.axes();
      /* 单位圆 */
      v.param(function (t) { return Math.cos(t); }, function (t) { return Math.sin(t); }, 0, Math.PI * 2,
        { color: 'rgba(167,180,195,.32)', w: 1.2, dash: [3, 3], n: 240 });
      /* A 把圆变成的椭圆 */
      v.param(function (t) { return A[0][0] * Math.cos(t) + A[0][1] * Math.sin(t); },
              function (t) { return A[1][0] * Math.cos(t) + A[1][1] * Math.sin(t); },
              0, Math.PI * 2, { color: P.curve2, w: 2.2, n: 300 });
      /* 秩 1 近似：沿 u1 的线段 ±σ1 u1 */
      v.line(-S.u1[0] * S.s1, -S.u1[1] * S.s1, S.u1[0] * S.s1, S.u1[1] * S.s1,
        { color: 'rgba(215,171,97,.55)', w: 3.4, dash: [2, 5] });
      /* 两个半轴 */
      v.arrow(0, 0, S.u1[0] * S.s1, S.u1[1] * S.s1, { color: P.curve3, w: 2.4 });
      v.text(S.u1[0] * (S.s1 + 0.28), S.u1[1] * (S.s1 + 0.28), 'σ₁u₁ = ' + fmt(S.s1, 2), { color: P.curve3, size: 11.5 });
      if (S.s2 > 1e-6) {
        v.arrow(0, 0, S.u2[0] * S.s2, S.u2[1] * S.s2, { color: P.curve4, w: 2.2 });
        v.text(S.u2[0] * (S.s2 + 0.5), S.u2[1] * (S.s2 + 0.5), 'σ₂u₂ = ' + fmt(S.s2, 2), { color: P.curve4, size: 11, align: 'center' });
        rightAngle(v, [0, 0], S.u1, 13, P.muted);
      }
      /* v1、v2 方向（圆上的原像） */
      v.arrow(0, 0, S.v1[0], S.v1[1], { color: 'rgba(167,180,195,.75)', w: 1.4, dash: [4, 3] });
      v.text(S.v1[0], S.v1[1], ' v₁', { color: P.muted, size: 11.5 });
      v.text(v.x0 + .14, v.y0 + .28, 'σ₁ = ' + fmt(S.s1, 3) + ' · σ₂ = ' + fmt(S.s2, 3) + ' · κ = ' + (S.s2 > 1e-6 ? fmt(S.s1 / S.s2, 2) : '∞'),
        { color: P.muted, size: 11.5 });
    },
    read: function (s) {
      var A = [[s.a, s.b], [s.c, s.d]], S = svd2(A);
      var kappa = S.s2 > 1e-6 ? fmt(S.s1 / S.s2, 2) : '∞（σ₂ = 0，秩 1）';
      return [
        ['σ₁', fmt(S.s1, 4)],
        ['σ₂', fmt(S.s2, 4)],
        ['σ₁ / σ₂ = κ', kappa],
        ['σ₁σ₂ = |det A|', num(S.s1 * S.s2, 4)],
        ['V 的主方向 v₁', vecStr(S.v1[0], S.v1[1], 3) + ' → u₁ = ' + vecStr(S.u1[0], S.u1[1], 2)]
      ];
    }
  });

  /* =====================================================================
     ⑯ ch08 线性变换画廊
     ===================================================================== */
  lab({
    id: 'transform', ch: '08', title: '线性变换画廊',
    sub: '旋转、剪切、投影、缩放、镜像——同一张网格被五种动作改变；换类型、拖参数看矩阵怎么变。',
    tex: "T(\\mathbf{v})=A\\mathbf{v},\\qquad T(\\alpha\\mathbf{u}+\\beta\\mathbf{v})=\\alpha T(\\mathbf{u})+\\beta T(\\mathbf{v})",
    note: '<b>矩阵就是动作</b>：A 的两列告诉我们 $T(\\mathbf{e}_1)$、$T(\\mathbf{e}_2)$ 落在哪，整个变换就被钉死了（线性性）。行列式告诉你面积怎么变，det = 0 的动作把平面压扁（投影），det < 0 的动作翻转了方向（镜像）。',
    view: { x0: -4.2, x1: 4.2, y0: -1.6, y1: 1.6 },
    ctrls: [
      { k: 'type', label: '变换', type: 'sel', val: 'rotate', opts: [
        ['rotate', '旋转'], ['shear', '剪切'], ['project', '投影（到直线）'],
        ['scale', '缩放'], ['mirror', '镜像（反射）']
      ] },
      { k: 't', label: '参数 t', min: -1, max: 1, step: 0.02, val: 0.25 },
      { k: 's', label: '整体缩放', min: 0.4, max: 1.6, step: 0.05, val: 1 }
    ],
    mat: function (s) {
      var th, k, A;
      if (s.type === 'rotate') {
        th = s.t * Math.PI;
        A = [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];
      } else if (s.type === 'shear') {
        A = [[1, s.t * 1.6], [0, 1]];
      } else if (s.type === 'project') {
        th = s.t * Math.PI;
        var u = [Math.cos(th), Math.sin(th)];
        A = [[u[0] * u[0], u[0] * u[1]], [u[0] * u[1], u[1] * u[1]]];
      } else if (s.type === 'scale') {
        A = [[1 + s.t, 0], [0, 1 - s.t * 0.6]];
      } else {
        th = s.t * Math.PI / 2;
        A = [[Math.cos(2 * th), Math.sin(2 * th)], [Math.sin(2 * th), -Math.cos(2 * th)]];
      }
      return [[A[0][0] * s.s, A[0][1] * s.s], [A[1][0] * s.s, A[1][1] * s.s]];
    },
    draw: function (v, s) {
      var P = pal(), L = this, A = L.mat(s);
      ensureAspect(v);
      v.axes();
      var i;
      /* 变形后的网格 */
      for (i = -4; i <= 4; i++) {
        var q1 = app2(A, i, -4), q2 = app2(A, i, 4);
        v.line(q1[0], q1[1], q2[0], q2[1], { color: 'rgba(215,171,97,.30)', w: 1 });
        q1 = app2(A, -4, i); q2 = app2(A, 4, i);
        v.line(q1[0], q1[1], q2[0], q2[1], { color: 'rgba(215,171,97,.30)', w: 1 });
      }
      /* 单位正方形（原像）与像 */
      v.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { stroke: P.muted, w: 1.1, dash: [4, 4] });
      v.poly([[0, 0], app2(A, 1, 0), app2(A, 1, 1), app2(A, 0, 1)], { fill: P.fill3, stroke: P.curve3, w: 1.9, close: true });
      /* 两列 = 基向量的像 */
      v.arrow(0, 0, A[0][0], A[1][0], { color: P.curve2, w: 2 });
      v.arrow(0, 0, A[0][1], A[1][1], { color: P.curve, w: 2 });
      v.text(A[0][0], A[1][0], ' T(e₁)', { color: P.curve2, size: 11.5 });
      v.text(A[0][1], A[1][1], ' T(e₂)', { color: P.curve, size: 11.5 });
      var names = { rotate: '旋转', shear: '剪切', project: '投影', scale: '缩放', mirror: '镜像' };
      v.text(v.x0 + .14, v.y0 + .3, names[s.type] + ' · A = [' + fmt(A[0][0], 2) + ' ' + fmt(A[0][1], 2) + '; ' + fmt(A[1][0], 2) + ' ' + fmt(A[1][1], 2) + '] · det = ' + num(det2(A[0][0], A[0][1], A[1][0], A[1][1]), 3),
        { color: P.muted, size: 11 });
    },
    read: function (s) {
      var L = this, A = L.mat(s), D = det2(A[0][0], A[0][1], A[1][0], A[1][1]);
      var names = { rotate: '旋转', shear: '剪切', project: '投影', scale: '缩放', mirror: '镜像' };
      var kind = D > 1e-9 ? '保持定向（det > 0）' : (D < -1e-9 ? '翻转定向（det < 0）' : '压扁成一条线（det = 0，奇异）');
      return [
        ['变换', names[s.type] + ' · t = ' + fmt(s.t, 2) + ' · 缩放 ' + fmt(s.s, 2)],
        ['A', '[' + fmt(A[0][0], 2) + ' ' + fmt(A[0][1], 2) + '; ' + fmt(A[1][0], 2) + ' ' + fmt(A[1][1], 2) + ']'],
        ['det A', num(D, 3) + '（面积 ×' + num(Math.abs(D), 2) + '）'],
        ['定向', kind],
        ['是否可逆', Math.abs(D) < 1e-9 ? '否：奇异' : '是']
      ];
    }
  });

  /* =====================================================================
     ⑰ ch08 基变换与相似矩阵
     ===================================================================== */
  lab({
    id: 'basismatrix', ch: '08', title: '基变换与相似矩阵',
    sub: '左边用标准基看动作 A，右边用旋转 θ 的新基看同一个动作：矩阵变成 B = M⁻¹AM，但迹、det、特征值都不变。',
    tex: "B=M^{-1}AM,\\qquad \\operatorname{tr}B=\\operatorname{tr}A,\\quad \\det B=\\det A",
    note: '<b>换基只是换描述方式，不改变动作本身</b>。相似矩阵共享迹、行列式、特征值（这些都是"不变量"）。正交基（如把标准基旋转 θ）下 $M^{-1}=M^{\\mathsf T}$，所以 $B=M^{\\mathsf T}AM$ 算起来最方便。',
    view: { x0: -2.5, x1: 2.5, y0: -1.2, y1: 1.2 },
    view2: { x0: -2.5, x1: 2.5, y0: -1.2, y1: 1.2 },
    panes: 2,
    ctrls: [
      { k: 'theta', label: '基转角 θ（°）', min: 0, max: 180, step: 5, val: 35 },
      { k: 'k', label: '剪切强度 k', min: -1.2, max: 1.2, step: 0.1, val: 0.8 },
      { k: 'mode', label: '基', type: 'sel', val: 'orth', opts: [['orth', '正交基（旋转 θ）'], ['skew', '斜基（变形后再转）']] }
    ],
    mats: function (s) {
      var A = [[1, s.k], [0, 1]];
      var th = s.theta * Math.PI / 180, c = Math.cos(th), sn = Math.sin(th);
      /* 正交基：M = 旋转矩阵；斜基：再把 y 方向拉长 1.6 倍，M 不是正交阵 */
      var M = s.mode === 'orth'
        ? [[c, -sn], [sn, c]]
        : [[1.6 * c, -0.8 * sn], [1.6 * sn, 0.8 * c]];
      var Minv = inv2(M[0][0], M[0][1], M[1][0], M[1][1]);
      var B = Minv ? mul2(mul2(Minv, A), M) : [[NaN, NaN], [NaN, NaN]];
      return { A: A, M: M, Minv: Minv, B: B, th: s.theta };
    },
    draw: function (v, s) {
      var P = pal(), L = this, R = L.mats(s), A = R.A, B = R.B;
      var v1 = v[0], v2 = v[1], i;
      /* 左：标准基下的 A */
      ensureAspect(v1); ensureAspect(v2);
      v1.axes();
      for (i = -3; i <= 3; i++) {
        var q1 = app2(A, i, -3), q2 = app2(A, i, 3);
        v1.line(q1[0], q1[1], q2[0], q2[1], { color: 'rgba(215,171,97,.28)', w: 1 });
        q1 = app2(A, -3, i); q2 = app2(A, 3, i);
        v1.line(q1[0], q1[1], q2[0], q2[1], { color: 'rgba(215,171,97,.28)', w: 1 });
      }
      v1.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { stroke: P.muted, w: 1.1, dash: [4, 4] });
      v1.poly([[0, 0], app2(A, 1, 0), app2(A, 1, 1), app2(A, 0, 1)], { fill: P.fill3, stroke: P.curve3, w: 1.8, close: true });
      v1.arrow(0, 0, A[0][0], A[1][0], { color: P.curve2, w: 2 });
      v1.arrow(0, 0, A[0][1], A[1][1], { color: P.curve, w: 2 });
      /* 新基向量：M 的两列（叠在左图上，说明"我们换到了这组基"） */
      v1.arrow(0, 0, R.M[0][0], R.M[1][0], { color: 'rgba(167,180,195,.9)', w: 1.8, dash: [5, 3] });
      v1.arrow(0, 0, R.M[0][1], R.M[1][1], { color: 'rgba(167,180,195,.9)', w: 1.8, dash: [5, 3] });
      noteBar(v1, v1.pad.l + 6, v1.pad.t + 6, '标准基 · A = [1 ' + fmt(s.k, 2) + '; 0 1]', { size: 10 });
      noteBar(v1, v1.pad.l + 8, v1.H - v1.pad.b - 20, '虚线 = 新基向量 b₁, b₂', { size: 10 });
      /* 右：新基下的 B */
      v2.axes();
      for (i = -3; i <= 3; i++) {
        var p1 = app2(B, i, -3), p2 = app2(B, i, 3);
        v2.line(p1[0], p1[1], p2[0], p2[1], { color: 'rgba(224,98,54,.30)', w: 1 });
        p1 = app2(B, -3, i); p2 = app2(B, 3, i);
        v2.line(p1[0], p1[1], p2[0], p2[1], { color: 'rgba(224,98,54,.30)', w: 1 });
      }
      v2.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { stroke: P.muted, w: 1.1, dash: [4, 4] });
      v2.poly([[0, 0], app2(B, 1, 0), app2(B, 1, 1), app2(B, 0, 1)], { fill: 'rgba(224,98,54,.14)', stroke: P.curve2, w: 1.8, close: true });
      v2.arrow(0, 0, B[0][0], B[1][0], { color: P.curve2, w: 2 });
      v2.arrow(0, 0, B[0][1], B[1][1], { color: P.curve, w: 2 });
      noteBar(v2, v2.pad.l + 6, v2.pad.t + 6, '新基 · B = M⁻¹AM', { size: 10 });
      noteBar(v2, v2.pad.l + 6, v2.H - v2.pad.b - 20, 'θ = ' + fmt(s.theta, 0) + '° · 同一个动作', { size: 10 });
    },
    read: function (s) {
      var R = this.mats(s), A = R.A, B = R.B;
      var b = isFinite(B[0][0]) ? '[' + fmt(B[0][0], 2) + ' ' + fmt(B[0][1], 2) + '; ' + fmt(B[1][0], 2) + ' ' + fmt(B[1][1], 2) + ']' : '—';
      return [
        ['基转角 θ', fmt(s.theta, 0) + '° · ' + (s.mode === 'orth' ? '正交基（M⁻¹ = Mᵀ）' : '斜基（M⁻¹ ≠ Mᵀ）')],
        ['A（标准基）', '[1 ' + fmt(s.k, 2) + '; 0 1]'],
        ['B = M⁻¹AM', b],
        ['不变量：tr', num(A[0][0] + A[1][1], 3) + ' = ' + num(B[0][0] + B[1][1], 3)],
        ['不变量：det', num(det2(A[0][0], A[0][1], A[1][0], A[1][1]), 3) + ' = ' + num(det2(B[0][0], B[0][1], B[1][0], B[1][1]), 3)]
      ];
    }
  });

  /* =====================================================================
     ⑱ ch10 Markov 链迭代
     ===================================================================== */
  lab({
    id: 'markov', ch: '10', title: 'Markov 链迭代',
    sub: '调转移概率 p、q 与初始份额：柱状图每乘一次 P 就靠近稳态——特征值 1 对应的特征向量。',
    tex: "\\mathbf{x}_{k+1}=P\\mathbf{x}_k,\\qquad P=\\begin{bmatrix}1-p&q\\\\p&1-q\\end{bmatrix},\\qquad \\pi=\\frac{1}{p+q}\\begin{bmatrix}q\\\\p\\end{bmatrix}",
    note: 'Markov 矩阵每列和为 1、元素非负，所以概率总和永远是 1（列随机矩阵保持"总概率"）。稳态 $\\pi$ 就是 $P\\pi=\\pi$：特征值恒为 1 的那个特征向量。另一个特征值是 $1-p-q$，它的绝对值 < 1 时链才收敛到唯一的稳态。',
    view: { x0: 0, x1: 10, y0: -0.06, y1: 1.12 },
    view2: { x0: -1, x1: 31, y0: -0.06, y1: 1.12 },
    panes: 2,
    ctrls: [
      { k: 'p', label: 'p：1 → 2', min: 0, max: 1, step: 0.05, val: 0.3 },
      { k: 'q', label: 'q：2 → 1', min: 0, max: 1, step: 0.05, val: 0.5 },
      { k: 'x0', label: '初始 x₁(0)', min: 0, max: 1, step: 0.05, val: 0.9 },
      { k: 'n', label: '步数 n', min: 0, max: 30, step: 1, val: 6 }
    ],
    chain: function (s) {
      var p = s.p, q = s.q, n = Math.round(s.n), i;
      var P = [[1 - p, q], [p, 1 - q]];
      var x = [s.x0, 1 - s.x0], hist = [[x[0], x[1]]];
      for (i = 0; i < n; i++) { x = [P[0][0] * x[0] + P[0][1] * x[1], P[1][0] * x[0] + P[1][1] * x[1]]; hist.push([x[0], x[1]]); }
      var sum = p + q;
      var pi = sum > 1e-12 ? [q / sum, p / sum] : [s.x0, 1 - s.x0];
      var lam2 = 1 - p - q;
      var err = sum > 1e-12 ? Math.abs(x[0] - pi[0]) : 0;
      return { P: P, x: x, hist: hist, pi: pi, lam2: lam2, err: err, sum: sum };
    },
    draw: function (v, s) {
      var P = pal(), L = this, R = L.chain(s), v1 = v[0], v2 = v[1];
      /* 左：概率柱状图 */
      v1.clear();
      var bw = 1.7;
      v1.line(0.6, 0, 9.4, 0, { color: P.axis, w: 1.3 });
      [['状态 1', 1.6, R.x[0], R.pi[0], P.curve3], ['状态 2', 5.8, R.x[1], R.pi[1], P.curve2]].forEach(function (it) {
        var x = it[1], h = Math.max(0, it[2]);
        v1.rect(x, 0, x + bw, 1, { fill: 'rgba(167,180,195,.07)' });
        v1.rect(x, 0, x + bw, h, { fill: it[4], stroke: it[4], w: 1.4 });
        v1.text(x + bw / 2, h + .05, fmt(it[2], 3), { color: it[4], size: 12, align: 'center' });
        v1.line(x, it[3], x + bw, it[3], { color: P.curve4, w: 1.6, dash: [5, 3] });
        v1.text(x + bw / 2, -0.035, it[0], { color: P.muted, size: 11, align: 'center' });
      });
      v1.rect(0.6, 0, 9.4, 1, { stroke: 'rgba(59,78,107,.5)', w: 1 });
      v1.text(0.6, 1.06, '第 ' + Math.round(s.n) + ' 步分布 · 虚线 = 稳态', { color: P.muted, size: 10.5 });
      /* 右：x₁(k) 收敛曲线 */
      v2.axes();
      v2.line(-1, R.pi[0], 31, R.pi[0], { color: 'rgba(200,35,55,.65)', w: 1.5, dash: [5, 3] });
      var pts = R.hist.map(function (q, i) { return [i, q[0]]; });
      if (pts.length > 1) v2.poly(pts, { stroke: P.curve3, w: 2.2 });
      pts.forEach(function (q, i) {
        if (i === pts.length - 1 || i % Math.max(1, Math.round(pts.length / 12)) === 0) v2.dot(q[0], q[1], { color: P.curve3, r: 3 });
      });
      noteBar(v2, v2.pad.l + 6, v2.pad.t + 6, 'x₁(k) · 红线 = 稳态 π₁', { size: 10 });
    },
    read: function (s) {
      var R = this.chain(s);
      return [
        ['当前分布 x_n', '(' + fmt(R.x[0], 3) + ', ' + fmt(R.x[1], 3) + ')'],
        ['稳态 π', R.sum > 1e-9 ? '(' + fmt(R.pi[0], 3) + ', ' + fmt(R.pi[1], 3) + ')' : 'P = I：任何分布都是稳态'],
        ['|x_n − π|', R.sum > 1e-9 ? num(R.err, 4, 1e-9) : '0（不移动）'],
        ['P 的特征值', '1, ' + fmt(R.lam2, 3) + (Math.abs(R.lam2) < 1 - 1e-9 ? '（|λ₂| < 1，收敛）' : '（不收敛）')],
        ['Σx_n（概率和）', fmt(R.x[0] + R.x[1], 3) + '（每列和为 1，总概率守恒）']
      ];
    }
  });

  /* =====================================================================
     ⑲ ch11 条件数与病态
     ===================================================================== */
  lab({
    id: 'condition', ch: '11', title: '条件数与病态',
    sub: 'A = [1 1; 1 1+δ]：δ 越小椭圆越扁，κ 越大；右图是"放大倍数随 b 方向变化"的曲线，峰值就是 κ。',
    tex: "\\kappa(A)=\\frac{\\sigma_1}{\\sigma_2}=\\lVert A\\rVert\\,\\lVert A^{-1}\\rVert,\\qquad \\frac{\\lVert\\Delta\\mathbf{x}\\rVert}{\\lVert\\mathbf{x}\\rVert}\\le\\kappa(A)\\frac{\\lVert\\Delta\\mathbf{b}\\rVert}{\\lVert\\mathbf{b}\\rVert}",
    note: '<b>条件数是"误差放大器的最大增益"</b>：右边的不等式说明输入 b 的相对误差最多被放大 κ 倍传到解上。椭圆越扁（σ₂ 越小）越病态；δ → 0 时矩阵奇异、κ → ∞。右图画出所有 b 方向上的实际放大倍数：峰值正好是 κ，说明这个上界能被取到。',
    view: { x0: -3.6, x1: 3.6, y0: -1.4, y1: 1.4 },
    view2: { x0: 0, x1: 360, y0: 0, y1: 1.12 },
    panes: 2,
    ctrls: [
      { k: 'delta', label: 'δ', min: 0.01, max: 1, step: 0.01, val: 0.2 },
      { k: 'theta', label: 'b 的方向 θ（°）', min: 0, max: 355, step: 5, val: 45 },
      { k: 'eps', label: '误差 |Δb|', min: 0.01, max: 0.4, step: 0.01, val: 0.1 }
    ],
    ampOf: function (delta, thDeg) {
      /* 单位 b、单位 Δb（与 b 垂直）下的放大倍数 |Δx| / |x| */
      var A = [[1, 1], [1, 1 + delta]], Ai = inv2(A[0][0], A[0][1], A[1][0], A[1][1]);
      if (!Ai) return 0;
      var th = thDeg * Math.PI / 180;
      var b = [Math.cos(th), Math.sin(th)], db = [-Math.sin(th), Math.cos(th)];
      var x = [Ai[0][0] * b[0] + Ai[0][1] * b[1], Ai[1][0] * b[0] + Ai[1][1] * b[1]];
      var dx = [Ai[0][0] * db[0] + Ai[0][1] * db[1], Ai[1][0] * db[0] + Ai[1][1] * db[1]];
      var nx = len2(x[0], x[1]);
      return nx > 1e-12 ? len2(dx[0], dx[1]) / nx : 0;
    },
    calc: function (s) {
      var A = [[1, 1], [1, 1 + s.delta]];
      var Ai = inv2(A[0][0], A[0][1], A[1][0], A[1][1]);
      var S = svd2(A);
      var th = s.theta * Math.PI / 180;
      var b = [Math.cos(th), Math.sin(th)];
      var db = [-Math.sin(th) * s.eps, Math.cos(th) * s.eps];
      var x = Ai ? [Ai[0][0] * b[0] + Ai[0][1] * b[1], Ai[1][0] * b[0] + Ai[1][1] * b[1]] : [NaN, NaN];
      var dx = Ai ? [Ai[0][0] * db[0] + Ai[0][1] * db[1], Ai[1][0] * db[0] + Ai[1][1] * db[1]] : [NaN, NaN];
      var nx = len2(x[0], x[1]), ndx = len2(dx[0], dx[1]);
      return {
        A: A, Ai: Ai, S: S, b: b, db: db, x: x, dx: dx,
        kappa: S.s2 > 1e-12 ? S.s1 / S.s2 : Infinity,
        relb: len2(db[0], db[1]), relx: nx > 1e-12 ? ndx / nx : Infinity
      };
    },
    draw: function (v, s) {
      var P = pal(), L = this, R = L.calc(s), v1 = v[0], v2 = v[1];
      var A = R.A, S = R.S;
      /* 左：b 空间（单位圆被 A 拉成细长椭圆） */
      ensureAspect(v1);
      v1.axes();
      v1.param(function (t) { return Math.cos(t); }, function (t) { return Math.sin(t); }, 0, Math.PI * 2,
        { color: 'rgba(167,180,195,.30)', w: 1, dash: [3, 3], n: 200 });
      v1.param(function (t) { return A[0][0] * Math.cos(t) + A[0][1] * Math.sin(t); },
               function (t) { return A[1][0] * Math.cos(t) + A[1][1] * Math.sin(t); },
               0, Math.PI * 2, { color: P.curve2, w: 2, n: 260 });
      v1.arrow(0, 0, S.u1[0] * S.s1, S.u1[1] * S.s1, { color: P.curve3, w: 2 });
      v1.arrow(0, 0, S.u2[0] * S.s2, S.u2[1] * S.s2, { color: P.curve4, w: 1.8 });
      v1.arrow(0, 0, R.b[0], R.b[1], { color: P.curve, w: 1.6 });
      v1.arrow(R.b[0], R.b[1], R.b[0] + R.db[0], R.b[1] + R.db[1], { color: P.curve4, w: 2.2 });
      noteBar(v1, v1.pad.l + 6, v1.H - v1.pad.b - 20, 'b 空间 · κ = ' + (isFinite(R.kappa) ? fmt(R.kappa, 1) : '∞'), { size: 10 });
      /* 右：放大倍数随 b 方向的变化 */
      v2.axes();
      var kap = isFinite(R.kappa) && R.kappa > 1e-9 ? R.kappa : 1;
      var pts = [], k, th, amp;
      for (k = 0; k <= 180; k++) {
        th = k * 2;
        amp = L.ampOf(s.delta, th) / kap;
        pts.push([th, Math.min(1.1, Math.max(0, amp))]);
      }
      v2.line(0, 1, 360, 1, { color: 'rgba(200,35,55,.75)', w: 1.5, dash: [6, 4] });
      v2.poly(pts, { stroke: P.curve3, w: 2.2 });
      var cur = L.ampOf(s.delta, s.theta) / kap;
      v2.dot(s.theta, Math.min(1.1, Math.max(0, cur)), { color: P.curve, r: 4.5, ring: true });
      noteBar(v2, v2.pad.l + 6, v2.pad.t + 6, '纵轴 = 放大 ÷ κ；红色虚线 = 上界 1 = κ', { size: 10 });
      v2.text(s.theta, Math.min(1.1, Math.max(0, cur)), ' θ=' + fmt(s.theta, 0) + '°', { color: P.text, size: 10.5 });
    },
    read: function (s) {
      var R = this.calc(s), S = R.S;
      return [
        ['δ（A₂₂ − 1）', fmt(s.delta, 3) + ' · det A = ' + num(det2(R.A[0][0], R.A[0][1], R.A[1][0], R.A[1][1]), 3)],
        ['σ₁ · σ₂', fmt(S.s1, 3) + ' · ' + fmt(S.s2, 3)],
        ['κ = σ₁/σ₂', isFinite(R.kappa) ? fmt(R.kappa, 1) : '∞'],
        ['|Δb| / |b|', fmt(R.relb, 4)],
        ['|Δx| / |x|', isFinite(R.relx) ? fmt(R.relx, 4) + '（≤ κ·|Δb|/|b|，最坏可放大 ' + (isFinite(R.kappa) ? fmt(R.kappa * R.relb, 2) : '∞') + ' 倍）' : '∞']
      ];
    }
  });

  /* =====================================================================
     ⑳ ch12 协方差与主方向
     ===================================================================== */
  lab({
    id: 'gaussian', ch: '12', title: '协方差与主方向',
    sub: '二维高斯点云：改变两个方向的标准差与相关系数，点云的形状由协方差矩阵的特征值/特征向量决定。',
    tex: "\\Sigma=\\begin{bmatrix}\\sigma_x^2&\\rho\\sigma_x\\sigma_y\\\\\\rho\\sigma_x\\sigma_y&\\sigma_y^2\\end{bmatrix},\\qquad \\lambda_1\\ge\\lambda_2\\ge0",
    note: '<b>协方差矩阵是"点云的形状"</b>：特征向量的方向是点云的主轴，特征值的平方根是半轴长。这就是 PCA：把数据投影到 $\\lambda_1$ 对应的方向上，保留的信息最多。相关系数 $\\rho$ 让轴倾斜，但不改变"对称半正定"这件事——它的特征值永远 ≥ 0。',
    view: { x0: -3.2, x1: 3.2, y0: -1, y1: 1 },
    ctrls: [
      { k: 'sx', label: 'σx', min: 0.25, max: 1.5, step: 0.05, val: 1.1 },
      { k: 'sy', label: 'σy', min: 0.25, max: 1.5, step: 0.05, val: 0.5 },
      { k: 'rho', label: '相关系数 ρ', min: -0.95, max: 0.95, step: 0.05, val: 0.6 },
      { k: 'theta', label: '主轴转角 θ（°）', min: 0, max: 180, step: 5, val: 0 }
    ],
    cloud: function (s) {
      /* L 使 Σ = L Lᵀ：先按标准差缩放，再用 ρ 拉斜，最后整体旋转 θ */
      var th = s.theta * Math.PI / 180, c = Math.cos(th), sn = Math.sin(th);
      var L = [[s.sx, 0], [s.rho * s.sy, s.sy * Math.sqrt(Math.max(0, 1 - s.rho * s.rho))]];
      var Rm = [[c, -sn], [sn, c]];
      var LL = mul2(Rm, L);              /* 点 = LL·z */
      var S = svd2(LL);                  /* LL 的奇异值 = sqrt(Σ 的特征值) */
      return { L: L, LL: LL, S: S };
    },
    draw: function (v, s) {
      var P = pal(), L = this, R = L.cloud(s), S = R.S;
      ensureAspect(v);
      v.axes();
      var pts = gaussCloud(), c = v.ctx, i;
      /* 点云 */
      c.save();
      for (i = 0; i < pts.length; i++) {
        var q = [R.LL[0][0] * pts[i][0] + R.LL[0][1] * pts[i][1], R.LL[1][0] * pts[i][0] + R.LL[1][1] * pts[i][1]];
        if (q[0] < v.x0 || q[0] > v.x1 || q[1] < v.y0 || q[1] > v.y1) continue;
        c.fillStyle = 'rgba(167,180,195,.42)';
        c.beginPath(); c.arc(v.px(q[0]), v.py(q[1]), 1.7, 0, Math.PI * 2); c.fill();
      }
      c.restore();
      /* 1σ 椭圆 */
      v.param(function (t) { return R.LL[0][0] * Math.cos(t) + R.LL[0][1] * Math.sin(t); },
              function (t) { return R.LL[1][0] * Math.cos(t) + R.LL[1][1] * Math.sin(t); },
              0, Math.PI * 2, { color: 'rgba(224,98,54,.8)', w: 1.5, dash: [5, 4], n: 240 });
      /* 主方向箭头（长度 = sqrt λ） */
      v.arrow(0, 0, S.u1[0] * S.s1, S.u1[1] * S.s1, { color: P.curve3, w: 2.6 });
      v.text(S.u1[0] * S.s1, S.u1[1] * S.s1, ' 主方向 (√λ₁ = ' + fmt(S.s1, 2) + ')', { color: P.curve3, size: 11 });
      if (S.s2 > 1e-6) {
        v.arrow(0, 0, S.u2[0] * S.s2, S.u2[1] * S.s2, { color: P.curve, w: 2 });
        v.text(S.u2[0] * S.s2, S.u2[1] * S.s2, ' √λ₂ = ' + fmt(S.s2, 2), { color: P.muted, size: 10.5 });
      }
      noteBar(v, v.pad.l + 8, v.pad.t + 8, '点 = L·z（z 为标准正态）；虚线椭圆 = 1σ 等概率线', { size: 10.5 });
    },
    read: function (s) {
      var R = this.cloud(s), S = R.S;
      var lam1 = S.s1 * S.s1, lam2 = S.s2 * S.s2;
      var ang = angDeg(S.u1[0], S.u1[1]);
      return [
        ['σx · σy · ρ', fmt(s.sx, 2) + ' · ' + fmt(s.sy, 2) + ' · ' + fmt(s.rho, 2)],
        ['协方差 λ₁ · λ₂', fmt(lam1, 3) + ' · ' + fmt(lam2, 3) + '（都 ≥ 0）'],
        ['主方向角', fmt(ang, 1) + '°（' + vecStr(S.u1[0], S.u1[1], 2) + '）'],
        ['半轴长 √λ₁ · √λ₂', fmt(S.s1, 3) + ' · ' + fmt(S.s2, 3)],
        ['主方向占比', lam1 + lam2 > 1e-12 ? fmt(lam1 / (lam1 + lam2) * 100, 1) + '%' : '—']
      ];
    }
  });

  /* =====================================================================
     新站挂载层：实验台对象 → .labBody 内容
     · 每台 = 公式条 + 画布 + 控件 + 实时读数 + 说明 + 重置
     · 旧站的 labCard / labCv / labCtrls / labRead 结构不再使用：
       外层 .lab / .labHead 由 app.js 的 hydrateLabs 提供，这里只渲染 body
     · 布局样式在本文件内注入（不改任何 CSS 文件），颜色一律走 CSS 变量
     ===================================================================== */

  var STYLE_ID = 'cscLabStyle';

  function injectLabStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var css = [
      '.cscLabFormula{margin:0 0 12px;padding:7px 12px;border:1px solid var(--line);background:rgba(9,13,20,.34);overflow-x:auto;overflow-y:hidden;color:var(--text);text-align:center}',
      '.cscLabFormula mjx-container{margin:0!important}',
      '.cscLabCv{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;padding:10px;border:1px solid rgba(59,78,107,.32);background:rgba(8,12,18,.42)}',
      '.cscLabCv.two{grid-template-columns:repeat(2,minmax(0,1fr))}',
      '@media (max-width:760px){.cscLabCv.two{grid-template-columns:minmax(0,1fr)}}',
      '.cscLabCv canvas{display:block;touch-action:none;max-width:100%}',
      '.cscLabCtl,.labCtl.cscLabCtl{margin:12px 0 0;display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px}',
      '.cscLabC{display:inline-flex;align-items:center;gap:7px;height:26px;font-family:var(--mono);font-size:8.5px;letter-spacing:.08em;color:var(--text3);cursor:pointer;white-space:nowrap}',
      '.cscLabC input[type="range"]{width:116px;height:14px;margin:0;cursor:pointer}',
      '.cscLabC .v{min-width:30px;font-family:var(--mono);font-size:9.5px;letter-spacing:0;color:var(--const-yellow);font-weight:400}',
      '.cscLabRead,.labStat.cscLabRead{display:flex;flex-wrap:wrap;gap:7px 20px;margin-top:12px;padding-top:10px;border-top:1px solid var(--line)}',
      '.cscLabRead .labRD{display:inline-flex;flex-direction:column;gap:2px;min-width:0;max-width:100%}',
      '.cscLabRead .labRD i{font-style:normal;font-family:var(--mono);font-size:8px;letter-spacing:.1em;color:var(--text3)}',
      '.cscLabRead .labRD b{font-family:var(--mono);font-weight:400;font-size:11.5px;letter-spacing:0;color:var(--text);word-break:break-word}',
      '.labNote.cscLabNote{font-family:var(--cjk,var(--font));font-size:11.5px;line-height:1.9;letter-spacing:.02em;color:var(--text2);padding:9px 12px;border-left:2px solid var(--line2);background:rgba(9,13,20,.26);margin-top:12px}',
      '.labNote.cscLabNote b{color:var(--const-yellow);font-weight:400}'
    ].join('\n');
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = css;
    document.head.appendChild(st);
  }

  function ctrlHTML(c) {
    var h = '<label class="cscLabC"><span class="lb">' + labEsc(c.label) + '</span>';
    if (c.type === 'sel') {
      h += '<select class="labSelect" data-k="' + c.k + '">';
      (c.opts || []).forEach(function (o) {
        h += '<option value="' + labEsc(o[0]) + '"' + (o[0] === c.val ? ' selected' : '') + '>' + labEsc(o[1]) + '</option>';
      });
      return h + '</select></label>';
    }
    return h + '<input type="range" class="labSlider" data-k="' + c.k + '" min="' + c.min + '" max="' + c.max +
      '" step="' + c.step + '" value="' + c.val + '"><b class="v" data-v="' + c.k + '">' + c.val + '</b></label>';
  }

  /* 实验台 body：公式条 → 画布（单/双）→ 控件 → 读数 → 说明 */
  function labBodyHTML(L) {
    var panes = L.panes || 1, cvs = '', p;
    for (p = 0; p < panes; p++) cvs += '<canvas></canvas>';
    var note = L.note ? '<div class="labNote cscLabNote">' + labNoteHTML(L.note) + '</div>' : '';
    return '<div class="cscLab">'
      + '<div class="cscLabFormula">$' + labEsc(L.tex) + '$</div>'
      + '<div class="cscLabCv' + (panes > 1 ? ' two' : '') + '">' + cvs + '</div>'
      + '<div class="labCtl cscLabCtl">' + (L.ctrls || []).map(ctrlHTML).join('')
      + '<button class="labBtn labReset" type="button">RESET · 重置视野</button></div>'
      + '<div class="labStat labRead cscLabRead"></div>'
      + note
      + '</div>';
  }

  /* 窗口尺寸变化：只重排仍在文档里的实验台画布 */
  var RESIZE_WATCH = [];
  var resizeTimer = null;
  function fitAllWatched() {
    RESIZE_WATCH = RESIZE_WATCH.filter(function (w) { return w.root.isConnected; });
    RESIZE_WATCH.forEach(function (w) {
      w.views.forEach(function (vv) { try { vv.fit(); } catch (err) {} });
      try { w.render(true); } catch (err) {}
    });
  }
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitAllWatched, 140);
  });

  function mountOne(sec, L) {
    var cvs = Array.prototype.slice.call(sec.querySelectorAll('canvas'));
    /* dim3: true 表示所有画布都是三维视图；也可传数组（如 [true,false]）逐块指定 */
    function is3(k) { return L.dim3 === true || !!(L.dim3 && L.dim3.length && L.dim3[k]); }
    var views = cvs.map(function (cv, k) {
      var box = k === 0 ? L.view : (L.view2 || L.view);
      return is3(k) ? new View3(cv, box) : new View(cv, box);
    });
    var v = views.length === 1 ? views[0] : views;
    var s = {};
    (L.ctrls || []).forEach(function (c) { s[c.k] = c.val; });
    var readEl = sec.querySelector('.labRead');
    views.forEach(function (vv, k) {
      if (is3(k)) makeRotatable(vv, function () { render(); });   /* 三维：拖拽旋转 + 滚轮缩放 */
      else makePannable(vv, function () { render(); });           /* 二维：拖拽平移视野 */
    });
    var pending = false;
    function render(now) {
      if (now === true) { pending = false; paint(); return; }
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; paint(); });
    }
    function paint() {
      L.draw.call(L, v, s);
      /* 三维视图若声明 labelAuto，标签是"先登记后避让排布"，这里统一落笔 */
      (v && v.length ? v : [v]).forEach(function (vv) { if (vv && vv.flushLabels && vv._pend && vv._pend.length) vv.flushLabels(); });
      var rows = L.read.call(L, s) || [];
      readEl.innerHTML = rows.map(function (r) {
        return '<span class="labRD"><i>' + r[0] + '</i><b>' + r[1] + '</b></span>';
      }).join('');
      if (typeof L.sync === 'function') L.sync.call(L, sec, s);   // 可选钩子：按当前状态回写控件
    }
    (L.ctrls || []).forEach(function (c) {
      var el = sec.querySelector('[data-k="' + c.k + '"]');
      var out = sec.querySelector('[data-v="' + c.k + '"]');
      if (!el) return;
      el.addEventListener('input', function () {
        s[c.k] = c.type === 'sel' ? el.value : parseFloat(el.value);
        if (out) out.textContent = el.value;
        render();
      });
    });
    var resetBtn = sec.querySelector('.labReset');
    if (resetBtn) {
      resetBtn.onclick = function () {
        /* 三维的 resetAngles() 已内含 yaw/pitch/zoomK 复位 */
        views.forEach(function (vv) { if (vv.resetAngles) vv.resetAngles(); else vv.reset(); });
        render();
      };
    }
    L._views = views;
    L._render = render;
    render();
    /* 首帧后再 fit 一次：body 刚插入 DOM 时容器宽度可能还没定下来 */
    requestAnimationFrame(function () {
      if (!sec.isConnected) return;
      views.forEach(function (vv) { try { vv.fit(); } catch (err) {} });
      render(true);
      if (window.CSC && CSC.math) CSC.math.loose(sec);
    });
    RESIZE_WATCH.push({ root: sec, views: views, render: render });
    return L;
  }

  /* 重绘所有已挂载实验台（窗口/主题变化后的兜底入口） */
  function redraw() {
    RESIZE_WATCH.forEach(function (w) {
      if (!w.root.isConnected) return;
      w.views.forEach(function (vv) { try { vv.fit(); } catch (err) {} });
      try { w.render(true); } catch (err) {}
    });
  }

  function initLab(root, L) {
    injectLabStyle();
    root.innerHTML = labBodyHTML(L);
    try {
      mountOne(root, L);
    } catch (e) {
      console.error('[labs] ' + L.id + ' 渲染失败', e);
      var msg = document.createElement('div');
      msg.className = 'varEmpty';
      msg.textContent = '该实验台渲染失败：' + (e && e.message);
      root.appendChild(msg);
      return;
    }
    /* 公式排版（MathJax 就绪前进队列）+ 实验台窄容器内的轻度缩放 */
    if (window.CSC && CSC.math) {
      CSC.math.schedule(root);
      CSC.math.loose(root);
    }
  }

  /* =====================================================================
     说明条的排版修正
     ---------------------------------------------------------------------
     基础样式 .labNote 是 display:flex + gap（老站按「一句说明 + 右侧数值」
     两栏设计）。线代实验台的 note 是整段 HTML，<b> 与文本会被拆成并排的 flex
     子项，同一段话被排成几列。这里只覆盖显示方式为块级（选择器比 .labNote
     更具体，且在本文件注入、晚于 app.css），HTML 结构不动。
     ===================================================================== */
  (function () {
    if (document.getElementById('cscLabNoteFix')) return;
    var st = document.createElement('style');
    st.id = 'cscLabNoteFix';
    st.textContent = '.labNote.cscLabNote{display:block;line-height:1.95}'
      + '.labNote.cscLabNote mjx-container{font-size:.92em!important;margin:0 2px!important;vertical-align:middle}';
    document.head.appendChild(st);
  })();

  /* =====================================================================
     注册到新框架
     CSC.registerLabs({ id: { title, desc, ch, icon, tags, order, init } })
     · order 按章序（labOrder 的稳定排序）→ #/labs 索引页的自然顺序
     · ch 为 '00'…'12'，映射为 'ch00'…'ch12'（icon 见 CONTRACT §7.4）
     ===================================================================== */
  var LAB_ICON = {
    ch00: 'target', ch01: 'vector', ch02: 'grid', ch03: 'layers', ch04: 'target',
    ch05: 'chart', ch06: 'star', ch07: 'sparkle', ch08: 'branch', ch09: 'moon',
    ch10: 'field', ch11: 'cpu', ch12: 'chart', ch13: 'book', ch14: 'formula'
  };

  var LAB_DEFS = {};
  labOrder().forEach(function (L, i) {
    var ch = 'ch' + String(L.ch);
    LAB_DEFS[L.id] = {
      title: L.title,
      desc: L.sub,
      ch: ch,
      icon: LAB_ICON[ch] || 'flask',
      tags: ['CH' + String(L.ch)],
      order: i + 1,
      init: function (root) { initLab(root, L); }
    };
  });
  CSC.registerLabs(LAB_DEFS);
})();
