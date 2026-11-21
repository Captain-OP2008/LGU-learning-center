/* =====================================================================
   微积分学习站 · assets/labs.js · 交互实验台（44 台）
   ---------------------------------------------------------------------
   来源：旧站 assets/labs-raw.js 的 44 台实验台（Canvas 2D 绘图内核 +
   数值工具 + 每台的 initCanvas / 控件 / 读数 / 断言），按新框架
   CONTRACT §4.3 的 labs API 重新挂载。
   ---------------------------------------------------------------------
   · 唯一依赖：window.CSC（assets/app.js 提供 registerLabs / math），
     零外部库、无构建、纯原生 JS（ES5 语法为主 + 少量 ES2019）。
   · 绘图内核（内联，Canvas 2D）：
       View  —— 坐标变换 px/py←→ux/uy、网格与刻度、曲线 fn/param、
                面积填充 fillBetween / regionArea、线段/箭头/点/多边形、
                热力图 heat、极坐标网格与扇形、节点图 nodeGraph；
       View3 —— 三维线框曲面 / 空间曲线 / 向量 / 标签避让（拖拽旋转）。
   · 控件：滑块、下拉、重置按钮；读数条随每一帧实时刷新。
   · 每台保留旧站 draw / read / assert 全量实现：draw 负责画布，read 供
     读数条，assert 是数值自检（不进入 UI，随迁移保留以备复核）。
   · 视觉：新站只有深色主题，pal() 固定深色分支，关键色对齐
     observatory.css 令牌：
       正文 #e8e8e8 · 次要 #a7b4c3 · 弱化 #6d7d8c · 线 #3b4e6b
       黄 #d7ab61 · 橙 #e06236 · 红 #c82337 · 蓝 #2f4c79 · 背景 #0e141f
   · 公式：说明条与画布内标注为行内 $...$，挂载后调用 CSC.math.loose()。
   · 注册：CSC.registerLabs({ id: { title, desc, ch, icon, tags, order, init } })
   ---------------------------------------------------------------------
   规模统计（共 44 台，按章）：
     ch00 ×1（依赖地图）           ch01 ×1   ch02 ×3   ch03 ×3
     ch04 ×2   ch05 ×3             ch06 ×3   ch07 ×2
     ch08 ×2   ch09 ×3             ch10 ×2   ch11 ×2
     ch12 ×2   ch13 ×3             ch14 ×3   ch15 ×3
     ch16 ×2   ch17 ×2             ch18 ×1   ch19 ×1
   id 一览（按章序）：
     00 depmap | 01 transform | 02 epsdelta squeeze discont |
     03 tangent fprime nondiff | 04 mvt analyze | 05 riemann ftc meanval |
     06 solid intprops arclen | 07 explog invtri | 08 parts trigsub |
     09 taylor series radius | 10 polar paramcurve | 11 dotcross planedist |
     12 tnb accel | 13 gradient tangentplane lagrange |
     14 doublepolar dblorder volumeel | 15 green fluxdiv conservpot |
     16 slopefield sepvar | 17 damped charroots | 18 cobweb |
     19 inttable
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
  /* 章号徽章：00 总览、01–17 第 N 章、18 附录 A、19 速查表 */
  function chLabel(ch) {
    var c = String(ch == null ? '' : ch);
    if (c === '00') return '总览';
    if (c === '18') return '附录 A';
    if (c === '19') return '速查表';
    var n = c.replace(/^0+/, '');
    return n ? '第 ' + n + ' 章' : '总览';
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

  /* ① 切线与导数（第 3 章） */
  lab({
    id: 'tangent', ch: '03', title: '切线与导数：割线的极限',
    sub: '拖动切点 x₀、调节增量 h：Q 点沿曲线滑向 P，割线 PQ 的斜率就是差商。',
    tex: "f'(x_0)=\\lim_{h\\to 0}\\frac{f(x_0+h)-f(x_0)}{h}",
    note: 'h 越小，割线越贴近切线；差商 → 导数。这正是"导数是瞬时变化率"的图像含义。',
    view: { x0: -0.35, x1: 3.3, y0: -0.6, y1: 5.2 },
    ctrls: [
      { k: 'x0', label: '切点 x₀', min: 0, max: 3, step: 0.01, val: 1 },
      { k: 'h', label: '增量 h', min: 0.01, max: 1.4, step: 0.01, val: 1 },
      { k: 'f', label: '函数', type: 'sel', val: 'sq', opts: [['sq', 'f(x) = x²/2'], ['cube', 'f(x) = x³/6'], ['sin', 'f(x) = sin x'], ['sqrt', 'f(x) = √x']] }
    ],
    funcs: {
      sq: function (x) { return x * x / 2; },
      cube: function (x) { return x * x * x / 6; },
      sin: function (x) { return Math.sin(x); },
      sqrt: function (x) { return x < 0 ? NaN : Math.sqrt(x); }
    },
    draw: function (v, s) {
      var P = pal(), F = this.funcs[s.f], x0 = s.x0, h = s.h;
      var y0 = F(x0), x1 = Math.min(3.3, x0 + h), y1 = F(x1);
      var k = (y1 - y0) / (x1 - x0), d = deriv(F, x0);
      v.axes();
      // 切线
      v.line(x0 - 1.2, y0 - 1.2 * d, x0 + 1.4, y0 + 1.4 * d, { color: P.curve3, w: 1.7 });
      v.fn(F, {});
      v.line(x0, y0, x1, y1, { color: P.curve2, w: 1.8, dash: [7, 4] });
      v.dot(x0, y0, { color: P.curve, r: 5, ring: true });
      v.dot(x1, y1, { color: P.curve2, r: 5 });
      v.text(x0, y0, ' P', { color: P.curve, size: 13 });
      v.text(x1, y1, ' Q', { color: P.curve2, size: 13 });
      v.text(v.x0 + .12, v.y1 - .35, '割线 PQ 斜率 = ' + fmt(k, 3), { color: P.curve2, size: 12.5 });
      v.text(v.x0 + .12, v.y1 - .85, "切线斜率 f′(x₀) = " + fmt(d, 3), { color: P.curve3, size: 12.5 });
    },
    read: function (s) {
      var F = this.funcs[s.f], x0 = s.x0, h = s.h;
      var k = (F(Math.min(3.3, x0 + h)) - F(x0)) / (Math.min(3.3, x0 + h) - x0);
      var d = deriv(F, x0);
      return [['h', fmt(h, 2)], ['差商 (割线斜率)', fmt(k, 4)], ["f′(x₀)（切线斜率）", fmt(d, 4)], ['差商 − 导数', fmt(k - d, 4)]];
    },
    assert: function () {
      var L = this, out = [], i, k, xs = [0.5, 1, 2];
      var drv = { sq: function (x) { return x; }, cube: function (x) { return x * x / 2; }, sin: Math.cos, sqrt: function (x) { return 1 / (2 * Math.sqrt(x)); } };
      var mx = 0;
      for (k in L.funcs) { for (i = 0; i < xs.length; i++) mx = Math.max(mx, Math.abs(deriv(L.funcs[k], xs[i]) - drv[k](xs[i]))); }
      out.push({ name: '解析导数与中心差分一致（4 函数 × 3 点，阈值 1e-6）', ok: mx < 1e-6, detail: 'max=' + mx.toExponential(2) });
      var errs = [1, 0.1, 0.01, 0.001].map(function (h) { var F = L.funcs.sq; return Math.abs((F(1 + h) - F(1)) / h - 1); });
      var mono = errs.every(function (e, n) { return n === 0 || e < errs[n - 1]; });
      out.push({ name: '差商随 h→0 收敛到 f′(1)=1（单调下降，h=1e-3 时误差 <1e-3）', ok: mono && errs[3] < 1e-3, detail: 'errs=' + errs.map(function (e) { return e.toExponential(1); }).join(',') });
      var d1 = (L.funcs.sq(1.5) - L.funcs.sq(1)) / 0.5 - deriv(L.funcs.sq, 1);
      var d2 = (L.funcs.sin(1.0) - L.funcs.sin(0.5)) / 0.5 - deriv(L.funcs.sin, 0.5);
      out.push({ name: '差商−导数的符号与 f″ 一致（x²/2 凸→正、sin 在 0.5 处凹→负）', ok: d1 > 0 && d2 < 0 && Math.sin(0.5) > 0, detail: 'conv=' + d1.toFixed(5) + ' conc=' + d2.toFixed(5) });
      var st = {}; L.ctrls.forEach(function (c) { st[c.k] = c.val; });
      var rd = L.read(st);
      var e = Math.max(Math.abs(pick(rd, '差商') - 1.5), Math.abs(pick(rd, 'f′(x') - 1), Math.abs(pick(rd, '差商 − 导数') - 0.5));
      out.push({ name: 'read() 默认读数（x²/2 @ x₀=1,h=1：差商 1.5、f′ 1、差 0.5）一致（阈值 1e-4）', ok: e < 1e-4, detail: 'Δ=' + e.toExponential(2) });
      return out;
    }
  });

  /* ② 中值定理（第 4 章） */
  lab({
    id: 'mvt', ch: '04', title: '中值定理：平行的切线与割线',
    sub: '拖动区间端点 a、b：只要函数光滑，区间内必有一点 c，其切线平行于割线 AB。',
    tex: "f'(c)=\\frac{f(b)-f(a)}{b-a},\\quad a<c<b",
    note: '中值定理是"用导数信息推断函数整体行为"的桥梁：拉格朗日余项、单调性判定、洛必达法则都由它导出。',
    view: { x0: -0.6, x1: 4.6, y0: -2.6, y1: 4.2 },
    ctrls: [
      { k: 'a', label: '左端 a', min: -0.4, max: 3.6, step: 0.01, val: 0 },
      { k: 'b', label: '右端 b', min: 0.6, max: 4.4, step: 0.01, val: 4 },
      { k: 'f', label: '函数', type: 'sel', val: 'cubic', opts: [['cubic', 'f(x) = x³/6 − x²/2 + 1'], ['wave', 'f(x) = 2sin x + 1'], ['para', 'f(x) = x²/4 − x']] }
    ],
    funcs: {
      cubic: function (x) { return x * x * x / 6 - x * x / 2 + 1; },
      wave: function (x) { return 2 * Math.sin(x) + 1; },
      para: function (x) { return x * x / 4 - x; }
    },
    draw: function (v, s) {
      var P = pal(), F = this.funcs[s.f];
      var a = Math.min(s.a, s.b - 0.2), b = Math.max(s.b, a + 0.2);
      var slope = (F(b) - F(a)) / (b - a);
      var cs = roots(function (x) { return deriv(F, x) - slope; }, a + 1e-4, b - 1e-4, 600);
      v.axes();
      v.fn(F, {});
      v.line(a, F(a), b, F(b), { color: P.curve2, w: 1.7, dash: [7, 4] });
      v.dot(a, F(a), { color: P.curve2, r: 4.5 }); v.dot(b, F(b), { color: P.curve2, r: 4.5 });
      v.text(a, F(a), ' A', { color: P.curve2, size: 13 });
      v.text(b, F(b), ' B', { color: P.curve2, size: 13 });
      cs.forEach(function (c, i) {
        var y = F(c), d = deriv(F, c);
        v.line(c - 0.9, y - 0.9 * d, c + 0.9, y + 0.9 * d, { color: P.curve3, w: 1.7 });
        v.dot(c, y, { color: P.curve3, r: 4.5 });
        v.text(c, y, ' c' + (cs.length > 1 ? (i + 1) : ''), { color: P.curve3, size: 13 });
      });
      v.text(v.x0 + .1, v.y0 + .35, '割线斜率 = ' + fmt(slope, 3), { color: P.curve2, size: 12.5 });
      v.text(v.x0 + .1, v.y0 + .85, cs.length ? ('f′(c) = ' + fmt(deriv(F, cs[0]), 3) + '（共 ' + cs.length + ' 个 c）') : '该区间内找不到满足条件的 c', { color: P.curve3, size: 12.5 });
    },
    read: function (s) {
      var F = this.funcs[s.f], a = Math.min(s.a, s.b - 0.2), b = Math.max(s.b, a + 0.2);
      var slope = (F(b) - F(a)) / (b - a);
      var cs = roots(function (x) { return deriv(F, x) - slope; }, a + 1e-4, b - 1e-4, 600);
      return [['区间 [a, b]', '[' + fmt(a, 2) + ', ' + fmt(b, 2) + ']'], ['割线斜率', fmt(slope, 4)],
              ['满足 f′(c)=割线斜率的 c', cs.length ? cs.map(function (c) { return fmt(c, 3); }).join(', ') : '无'], ['f′(c)', cs.length ? fmt(deriv(F, cs[0]), 4) : '—']];
    },
    assert: function () {
      var L = this, out = [], mx = 0, miss = [];
      [['cubic', 0, 4], ['wave', 0, 4], ['para', 0, 3]].forEach(function (cs) {
        var F = L.funcs[cs[0]], a = cs[1], b = cs[2], slope = (F(b) - F(a)) / (b - a);
        var c = roots(function (x) { return deriv(F, x) - slope; }, a + 1e-4, b - 1e-4, 600);
        if (!c.length) { miss.push(cs[0]); return; }
        mx = Math.max(mx, Math.abs(deriv(F, c[0]) - slope));
      });
      out.push({ name: '中值点存在且 f′(c)=割线斜率（3 函数 × 各自区间，阈值 1e-6）', ok: !miss.length && mx < 1e-6, detail: 'max=' + mx.toExponential(2) + (miss.length ? ' 缺=' + miss.join(',') : '') });
      var st = {}; L.ctrls.forEach(function (c2) { st[c2.k] = c2.val; });
      var F0 = L.funcs[st.f], a0 = Math.min(st.a, st.b - 0.2), b0 = Math.max(st.b, a0 + 0.2), sl = (F0(b0) - F0(a0)) / (b0 - a0);
      var rd = L.read(st);
      var e1 = Math.max(Math.abs(pick(rd, '割线斜率') - sl), Math.abs(pickEx(rd, 'f′(c)') - sl));
      out.push({ name: 'read() 默认读数（割线斜率、f′(c)）与解析一致（阈值 1e-4）', ok: e1 < 1e-4, detail: 'Δ=' + e1.toExponential(2) });
      var s1 = deriv(F0, a0 + 1e-4) - sl, s2 = deriv(F0, b0 - 1e-4) - sl;
      out.push({ name: '区间两端 f′−割线斜率 异号（保证中间有满足条件的 c）', ok: s1 * s2 < 0, detail: s1.toFixed(4) + ' / ' + s2.toFixed(4) });
      var g = function (x) { return F0(x) + 7; };
      var cA = roots(function (x) { return deriv(F0, x) - sl; }, a0 + 1e-4, b0 - 1e-4, 600).length;
      var cB = roots(function (x) { return deriv(g, x) - sl; }, a0 + 1e-4, b0 - 1e-4, 600).length;
      out.push({ name: '加常数不改变割线斜率与中值点个数（结构恒等，阈值 1e-12）', ok: Math.abs((g(b0) - g(a0)) / (b0 - a0) - sl) < 1e-12 && cA === cB, detail: 'cA=' + cA + ' cB=' + cB });
      return out;
    }
  });

  /* ③ 黎曼和 → 定积分（第 5 章） */
  lab({
    id: 'riemann', ch: '05', title: '黎曼和：矩形逼近曲边梯形',
    sub: '增加分割数 n、切换取样点位置，看矩形面积和如何逼近定积分。',
    tex: "\\int_a^b f(x)\\,dx=\\lim_{n\\to\\infty}\\sum_{i=1}^{n}f(c_i)\\,\\Delta x",
    note: '取左端点得到"不足近似"（对递增函数），取右端点得到"过剩近似"，中点法收敛最快——误差曲线在图中一眼可见。',
    view: { x0: -0.35, x1: 3.4, y0: -0.5, y1: 4.4 },
    ctrls: [
      { k: 'n', label: '分割数 n', min: 1, max: 80, step: 1, val: 6 },
      { k: 'mode', label: '取样点', type: 'sel', val: 'mid', opts: [['left', '左端点'], ['right', '右端点'], ['mid', '中点'], ['trap', '梯形法']] },
      { k: 'f', label: '函数', type: 'sel', val: 'sq', opts: [['sq', 'f(x) = x²'], ['sqrt', 'f(x) = √x'], ['sin', 'f(x) = sin x + 0.2'], ['gauss', 'f(x) = e^(−x²/2)']] }
    ],
    funcs: {
      sq: function (x) { return x * x; },
      sqrt: function (x) { return Math.sqrt(Math.max(0, x)); },
      sin: function (x) { return Math.sin(x) + 0.2; },
      gauss: function (x) { return Math.exp(-x * x / 2); }
    },
    range: [0, 3],
    draw: function (v, s) {
      var P = pal(), F = this.funcs[s.f], a = this.range[0], b = this.range[1];
      var n = Math.round(s.n), dx = (b - a) / n, i;
      v.axes();
      for (i = 0; i < n; i++) {
        var xl = a + i * dx, xr = xl + dx;
        var c = s.mode === 'left' ? xl : s.mode === 'right' ? xr : (xl + xr) / 2;
        if (s.mode === 'trap') {
          var yl = F(xl), yr = F(xr);
          v.poly([[xl, 0], [xl, yl], [xr, yr], [xr, 0]], { close: true, fill: P.fill, stroke: P.curve2, w: 1 });
        } else {
          var y = F(c);
          v.rect(xl, 0, xr, y, { fill: P.fill, stroke: 'rgba(120,140,170,.55)' });
          v.line(c, 0, c, y, { color: P.curve2, w: 1.2, dash: [3, 3] });
        }
      }
      v.line(a, 0, b, 0, { color: P.axis, w: 1.2 });
      v.fn(F, { color: P.curve, w: 2.3 });
    },
    read: function (s) {
      var F = this.funcs[s.f], a = this.range[0], b = this.range[1];
      var n = Math.round(s.n), dx = (b - a) / n, sum = 0, i;
      for (i = 0; i < n; i++) {
        var xl = a + i * dx, xr = xl + dx;
        if (s.mode === 'trap') sum += (F(xl) + F(xr)) / 2 * dx;
        else sum += F(s.mode === 'left' ? xl : s.mode === 'right' ? xr : (xl + xr) / 2) * dx;
      }
      var exact = simpson(F, a, b, 4000);
      return [['n / Δx', n + ' / ' + fmt(dx, 3)], ['黎曼和 Sₙ', fmt(sum, 6)], ['定积分（高精度）', fmt(exact, 6)], ['误差 |Sₙ − ∫|', fmt(Math.abs(sum - exact), 6)]];
    },
    assert: function () {
      var L = this, out = [], a = L.range[0], b = L.range[1], mx = 0;
      ['sq', 'sqrt', 'sin', 'gauss'].forEach(function (k) {
        var F = L.funcs[k];
        mx = Math.max(mx, Math.abs(simpson(F, a, b, 4000) - simpson(F, a, b, 200000)));
      });
      out.push({ name: '高精度定积分与 20 万段 Simpson 一致（4 函数，阈值 1e-5）', ok: mx < 1e-5, detail: 'max=' + mx.toExponential(2) });
      var F0 = L.funcs.sq, ex = 9, n = 6, dx = (b - a) / n, sum = { left: 0, right: 0, mid: 0 }, i;
      for (i = 0; i < n; i++) { var xl = a + i * dx; sum.left += F0(xl) * dx; sum.right += F0(xl + dx) * dx; sum.mid += F0(xl + dx / 2) * dx; }
      var em = Math.abs(sum.mid - ex), el = Math.abs(sum.left - ex), er = Math.abs(sum.right - ex);
      out.push({ name: 'x² 在 [0,3] 上：中点法误差 = Δx²(b−a)/12 = 0.0625 且小于左右端点法（阈值 1e-9）', ok: Math.abs(em - dx * dx * (b - a) / 12) < 1e-9 && em < el && em < er, detail: 'mid=' + em + ' left=' + el + ' right=' + er });
      out.push({ name: '梯形法误差 = (left+right)/2 − ∫ = 2×中点法误差（阈值 1e-9）', ok: Math.abs((sum.left + sum.right) / 2 - ex - 2 * em) < 1e-9, detail: 'trap=' + ((sum.left + sum.right) / 2 - ex).toFixed(6) });
      var st = {}; L.ctrls.forEach(function (c) { st[c.k] = c.val; });
      var rd = L.read(st);
      var e = Math.max(Math.abs(pick(rd, '黎曼和 Sₙ') - sum.mid), Math.abs(pick(rd, '定积分（高精度）') - ex), Math.abs(pick(rd, '误差 |Sₙ') - em));
      out.push({ name: 'read() 默认（n=6 中点法 x²）读数与解析一致（阈值 1e-5）', ok: e < 1e-5, detail: 'Δ=' + e.toExponential(2) });
      return out;
    }
  });

  /* ④ 旋转体体积：圆盘法（第 6 章） */
  lab({
    id: 'solid', ch: '06', title: '旋转体体积：圆盘法',
    sub: '曲线 y = f(x) 绕 x 轴旋转：增加圆盘数 n，看近似体积如何逼近 π∫f²dx。',
    tex: "V=\\pi\\int_a^b\\!\\big[f(x)\\big]^2dx\\;\\approx\\;\\sum_{i=1}^{n}\\pi\\big[f(x_i)\\big]^2\\Delta x",
    note: '每个薄片是一个半径 f(xᵢ)、厚度 Δx 的圆盘。侧视图看到的是矩形，倾斜的椭圆弧提示它是立体。',
    view: { x0: -0.4, x1: 4.5, y0: -2.4, y1: 2.6 },
    ctrls: [
      { k: 'n', label: '圆盘数 n', min: 1, max: 40, step: 1, val: 6 },
      { k: 'f', label: '母线', type: 'sel', val: 'sqrt', opts: [['sqrt', 'y = √x'], ['line', 'y = x/2'], ['sin', 'y = 1 + sin x'], ['cup', 'y = x²/4']] }
    ],
    funcs: {
      sqrt: function (x) { return Math.sqrt(Math.max(0, x)); },
      line: function (x) { return x / 2; },
      sin: function (x) { return 1 + Math.sin(x); },
      cup: function (x) { return x * x / 4; }
    },
    range: [0, 4],
    draw: function (v, s) {
      var P = pal(), F = this.funcs[s.f], a = this.range[0], b = this.range[1];
      var n = Math.round(s.n), dx = (b - a) / n, i;
      v.axes();
      // 上下对称的母线（旋转体轮廓）
      v.fn(function (x) { return F(x); }, { color: P.curve, w: 2.3 });
      v.fn(function (x) { return -F(x); }, { color: P.curve, w: 2.3, dash: [5, 4] });
      for (i = 0; i < n; i++) {
        var xl = a + i * dx, xr = xl + dx, r = F((xl + xr) / 2);
        v.rect(xl, -r, xr, r, { fill: 'rgba(194,65,12,.10)', stroke: 'rgba(194,65,12,.5)' });
        // 前端椭圆（立体感）
        var cx = v.px(xr), cy = v.py(0), rx = Math.max(2, (v.px(xr) - v.px(xl)) * 0.5), ry = Math.abs(v.py(r) - v.py(0));
        var c = v.ctx;
        c.save(); c.strokeStyle = 'rgba(194,65,12,.55)'; c.lineWidth = 1;
        c.beginPath(); c.ellipse(cx - rx, cy, rx, ry, 0, 0, Math.PI * 2); c.stroke(); c.restore();
      }
      v.line(a, 0, b, 0, { color: P.axis, w: 1.2 });
    },
    read: function (s) {
      var F = this.funcs[s.f], a = this.range[0], b = this.range[1];
      var n = Math.round(s.n), dx = (b - a) / n, sum = 0, i;
      for (i = 0; i < n; i++) {
        var r = F(a + (i + 0.5) * dx);
        sum += Math.PI * r * r * dx;
      }
      var exact = Math.PI * simpson(function (x) { var y = F(x); return y * y; }, a, b, 4000);
      return [['圆盘数 n', n], ['近似体积 Σπf²Δx', fmt(sum, 6)], ['精确体积 π∫f²dx', fmt(exact, 6)], ['相对误差', fmt(Math.abs(sum - exact) / (exact || 1) * 100, 3) + ' %']];
    },
    assert: function () {
      var L = this, out = [], a = L.range[0], b = L.range[1], mx = 0, mg = 0;
      var closed = { sqrt: Math.PI * 8, line: Math.PI * 16 / 3 };
      ['sqrt', 'line', 'sin', 'cup'].forEach(function (k) {
        var F = L.funcs[k], g = function (x) { var y = F(x); return y * y; };
        var ex = Math.PI * simpson(g, a, b, 200000);
        mx = Math.max(mx, Math.abs(Math.PI * simpson(g, a, b, 4000) - ex));
        if (closed[k] !== undefined) mg = Math.max(mg, Math.abs(ex - closed[k]));
      });
      out.push({ name: '精确体积 π∫f²dx 与高精度积分一致（4 母线，阈值 1e-6）', ok: mx < 1e-6, detail: 'max=' + mx.toExponential(2) });
      out.push({ name: '闭式核对：√x 绕轴 → 8π、x/2 → 16π/3（阈值 1e-6）', ok: mg < 1e-6, detail: 'max=' + mg.toExponential(2) });
      var ex0 = Math.PI * 8, F1 = L.funcs.line, ex1 = Math.PI * 16 / 3, prev = Infinity, mono = true;
      /* 收敛性用车母线 x/2（被积函数 f²=x²/4，中点法误差 O(Δx²)）；√x 的 f²=x 是中点法精确的特例，误差 ~1e-15 无法体现收敛 */
      [3, 6, 12, 24, 40].forEach(function (n) {
        var dx = (b - a) / n, s = 0, i;
        for (i = 0; i < n; i++) { var r = F1(a + (i + 0.5) * dx); s += Math.PI * r * r * dx; }
        var e2 = Math.abs(s - ex1);
        if (!(e2 < prev)) mono = false;
        prev = e2;
      });
      out.push({ name: '圆盘和误差随 n∈{3,6,12,24,40} 严格下降（母线 x/2，n=40 时 <5e-3）', ok: mono && prev < 5e-3, detail: 'err(40)=' + prev.toExponential(2) });
      var st = {}; L.ctrls.forEach(function (c) { st[c.k] = c.val; });
      var rd = L.read(st), n2 = Math.round(st.n), dx2 = (b - a) / n2, s2 = 0, j;
      for (j = 0; j < n2; j++) { var r2 = L.funcs[st.f](a + (j + 0.5) * dx2); s2 += Math.PI * r2 * r2 * dx2; }
      var e3 = Math.max(Math.abs(pick(rd, '近似体积') - s2), Math.abs(pick(rd, '精确体积') - ex0), Math.abs(pick(rd, '相对误差') - Math.abs(s2 - ex0) / ex0 * 100));
      out.push({ name: 'read() 默认（n=6 √x）读数与解析一致（阈值 1e-3）', ok: e3 < 1e-3, detail: 'Δ=' + e3.toExponential(2) });
      return out;
    }
  });

  /* ⑤ 泰勒多项式逼近（第 9 章） */
  lab({
    id: 'taylor', ch: '09', title: '泰勒多项式：用多项式逼近函数',
    sub: '提高阶数 n：Pₙ 在展开点附近与原函数越来越贴合，但离得越远越容易"跑飞"。',
    tex: "P_n(x)=\\sum_{k=0}^{n}\\frac{f^{(k)}(a)}{k!}(x-a)^k",
    note: '余项 Rₙ = f − Pₙ 决定逼近区间；n 增大时贴合区间变宽，但收敛半径之外仍然发散（如 ln(1+x) 在 x>1）。',
    view: { x0: -3.4, x1: 3.4, y0: -3.2, y1: 3.2 },
    ctrls: [
      { k: 'n', label: '阶数 n', min: 0, max: 14, step: 1, val: 3 },
      { k: 'a', label: '展开点 a', min: -1.5, max: 1.5, step: 0.1, val: 0 },
      { k: 'f', label: '函数', type: 'sel', val: 'sin', opts: [['sin', 'f(x) = sin x'], ['cos', 'f(x) = cos x'], ['exp', 'f(x) = eˣ'], ['ln', 'f(x) = ln(1+x)']] }
    ],
    funcs: {
      sin: { f: Math.sin, d: function (k, a) { return [Math.sin(a), Math.cos(a), -Math.sin(a), -Math.cos(a)][k % 4]; } },
      cos: { f: Math.cos, d: function (k, a) { return [Math.cos(a), -Math.sin(a), -Math.cos(a), Math.sin(a)][k % 4]; } },
      exp: { f: Math.exp, d: function (k, a) { return Math.exp(a); } },
      ln: {
        f: function (x) { return x > -1 ? Math.log(1 + x) : NaN; },
        d: function (k, a) {
          if (k === 0) return Math.log(1 + a);
          if (k === 1) return 1 / (1 + a);
          var fact = 1, i;
          for (i = 2; i < k; i++) fact *= i;
          return (k % 2 ? fact : -fact) / Math.pow(1 + a, k);
        }
      }
    },
    poly: function (key, n, a) {                          // 逐项累加泰勒多项式
      var F = this.funcs[key], coef = [], k, fact = 1;
      for (k = 0; k <= n; k++) {
        if (k > 0) fact *= k;
        coef.push(F.d(k, a) / fact);
      }
      return function (x) {
        var s = 0, p = 1, i;
        for (i = 0; i < coef.length; i++) { s += coef[i] * p; p *= (x - a); }
        return s;
      };
    },
    draw: function (v, s) {
      var P = pal(), F = this.funcs[s.f].f, a = s.a, n = Math.round(s.n);
      var Pn = this.poly(s.f, n, a);
      v.axes();
      v.fn(F, { color: P.curve, w: 2.3 });
      v.fn(Pn, { color: P.curve2, w: 2.1, dash: [7, 4] });
      v.dot(a, F(a), { color: P.curve3, r: 5 });
      v.line(a, v.y0, a, v.y1, { color: P.grid, w: 1 });
      v.text(a, F(a), ' a', { color: P.curve3, size: 13 });
      v.text(v.x0 + .15, v.y1 - .4, '实线：f(x)　虚线：P' + n + '(x)', { color: P.muted, size: 12.5 });
    },
    read: function (s) {
      var F = this.funcs[s.f].f, a = s.a, n = Math.round(s.n);
      var Pn = this.poly(s.f, n, a), m = 0, x;
      for (x = a - 1.5; x <= a + 1.5; x += 0.01) {
        var d = Math.abs(F(x) - Pn(x));
        if (isFinite(d) && d > m) m = d;
      }
      return [['阶数 n / 展开点 a', n + ' / ' + fmt(a, 2)], ['P' + n + '(a)', fmt(Pn(a), 6)], ['f(a)', fmt(F(a), 6)], ['|x−a| ≤ 1.5 内最大误差', fmt(m, 5)]];
    },
    assert: function () {
      var L = this, out = [], mx = 0;
      ['sin', 'cos', 'exp', 'ln'].forEach(function (k) {
        [0, 0.7, -0.6].forEach(function (a) {
          var Pn = L.poly(k, 4, a);
          mx = Math.max(mx, Math.abs(Pn(a) - L.funcs[k].f(a)));
        });
      });
      out.push({ name: 'Pₙ(a) = f(a)（4 函数 × 3 展开点，阈值 1e-12）', ok: mx < 1e-12, detail: 'max=' + mx.toExponential(2) });
      var P3 = L.poly('sin', 3, 0), x = 0.3, an = x - x * x * x / 6;
      out.push({ name: 'sin 的 P₃(x) = x − x³/6 与解析一致（阈值 1e-12）', ok: Math.abs(P3(x) - an) < 1e-12, detail: 'Δ=' + Math.abs(P3(x) - an).toExponential(2) });
      var prev = Infinity, mono = true;
      [1, 3, 5, 7, 9].forEach(function (n) {
        var P = L.poly('sin', n, 0), m = 0, t;
        for (t = -1.5; t <= 1.5; t += 0.01) m = Math.max(m, Math.abs(Math.sin(t) - P(t)));
        if (!(m < prev)) mono = false;
        prev = m;
      });
      out.push({ name: '阶数 n∈{1,3,5,7,9} 时 [−1.5,1.5] 内最大误差单调下降（n=9 时 <1e-3）', ok: mono && prev < 1e-3, detail: 'err(9)=' + prev.toExponential(2) });
      var st = {}; L.ctrls.forEach(function (c) { st[c.k] = c.val; });
      var rd = L.read(st), nn = Math.round(st.n), Pn0 = L.poly(st.f, nn, st.a), m0 = 0, t2;
      for (t2 = st.a - 1.5; t2 <= st.a + 1.5; t2 += 0.01) { var d = Math.abs(L.funcs[st.f].f(t2) - Pn0(t2)); if (isFinite(d)) m0 = Math.max(m0, d); }
      var e = Math.max(Math.abs(pick(rd, 'P' + nn + '(a)') - Pn0(st.a)), Math.abs(pick(rd, 'f(a)') - L.funcs[st.f].f(st.a)), Math.abs(pick(rd, '最大误差') - m0));
      out.push({ name: 'read() 默认（sin,n=3,a=0）读数与解析一致（阈值 1e-5）', ok: e < 1e-5, detail: 'Δ=' + e.toExponential(2) });
      return out;
    }
  });

  /* ⑥ 级数部分和（第 9 章） */
  lab({
    id: 'series', ch: '09', title: '级数部分和：收敛还是发散',
    sub: '提高项数 n：部分和折线趋于水平 → 收敛；一路爬升不封顶 → 发散。',
    tex: "S_n=\\sum_{k=1}^{n}a_k,\\qquad \\sum_{k=1}^{\\infty}a_k=\\lim_{n\\to\\infty}S_n",
    note: '调和级数 Σ1/n 虽通项趋 0，却发散——只看通项无法判断收敛性，必须用比较、比值、积分等判别法。',
    view: { x0: 0, x1: 40, y0: -0.2, y1: 2.4 },
    ctrls: [
      { k: 'n', label: '项数 n', min: 1, max: 120, step: 1, val: 30 },
      { k: 's', label: '级数', type: 'sel', val: 'inv2', opts: [['inv2', 'Σ 1/k²   (→ π²/6)'], ['harm', 'Σ 1/k   (发散)'], ['alt', 'Σ (−1)^(k+1)/k  (→ ln2)'], ['geo', 'Σ (1/2)^k   (→ 1)'], ['p3', 'Σ 1/k³  (→ ζ(3))']] }
    ],
    terms: {
      inv2: function (k) { return 1 / (k * k); },
      harm: function (k) { return 1 / k; },
      alt: function (k) { return (k % 2 ? 1 : -1) / k; },
      geo: function (k) { return Math.pow(0.5, k); },
      p3: function (k) { return 1 / (k * k * k); }
    },
    limit: { inv2: Math.PI * Math.PI / 6, harm: NaN, alt: Math.LN2, geo: 1, p3: 1.2020569031595942 },
    draw: function (v, s) {
      var P = pal(), t = this.terms[s.s], n = Math.round(s.n), i, S = 0;
      var lim = this.limit[s.s];
      v.axes();
      if (isFinite(lim)) v.line(v.x0, lim, v.x1, lim, { color: P.curve3, w: 1.4, dash: [6, 4] });
      var pts = [[0, 0]];
      for (i = 1; i <= n; i++) { S += t(i); pts.push([i, S]); }
      v.poly(pts, { stroke: P.curve2, w: 1.8 });
      for (i = 1; i <= n; i++) v.dot(pts[i][0], pts[i][1], { color: P.curve2, r: 2.2 });
      v.text(v.x0 + (v.x1 - v.x0) * .55, isFinite(lim) ? lim + (v.y1 - v.y0) * .09 : v.y1 - .25,
             isFinite(lim) ? ('极限 ≈ ' + fmt(lim, 5)) : '部分和持续增大：发散', { color: P.curve3, size: 12.5 });
    },
    read: function (s) {
      var t = this.terms[s.s], n = Math.round(s.n), S = 0, i;
      for (i = 1; i <= n; i++) S += t(i);
      var lim = this.limit[s.s];
      return [['n', n], ['部分和 Sₙ', fmt(S, 6)], ['级数和（已知）', isFinite(lim) ? fmt(lim, 6) : '发散'], ['Sₙ − 和', isFinite(lim) ? fmt(S - lim, 6) : '—']];
    },
    assert: function () {
      var L = this, out = [], i, s;
      var sum = function (k, n) { var t = 0, j; for (j = 1; j <= n; j++) t += L.terms[k](j); return t; };
      var e1 = Math.abs(sum('inv2', 200000) - Math.PI * Math.PI / 6), e2 = Math.abs(sum('alt', 200000) - Math.LN2), e3 = Math.abs(sum('geo', 200) - 1);
      out.push({ name: 'Σ1/k²→π²/6（<1e-5）、Σ(−1)^(k+1)/k→ln2（<5e-6，交错余项 ~1/(2N)）、Σ(1/2)^k→1（<1e-6）', ok: e1 < 1e-5 && e2 < 5e-6 && e3 < 1e-6, detail: 'e=' + e1.toExponential(1) + '/' + e2.toExponential(1) + '/' + e3.toExponential(1) });
      var prev = -Infinity, mono = true; s = 0;
      for (i = 1; i <= 2000; i++) { s += L.terms.inv2(i); if (!(s > prev)) mono = false; prev = s; }
      out.push({ name: 'Σ1/k² 部分和严格递增且不越过 π²/6（阈值 1e-12）', ok: mono && s <= Math.PI * Math.PI / 6 + 1e-12, detail: 'S₂₀₀₀=' + s.toFixed(8) });
      var h = sum('harm', 10000), ref = Math.log(10000) + 0.5772;
      out.push({ name: '调和级数发散：S₁₀₀₀₀ > ln(10⁴)+γ−0.01 且 > 9', ok: h > ref - 0.01 && h > 9, detail: 'S=' + h.toFixed(5) + ' ln+γ=' + ref.toFixed(5) });
      var st = {}; L.ctrls.forEach(function (c) { st[c.k] = c.val; });
      var rd = L.read(st), S = sum(st.s, Math.round(st.n)), lim = Math.PI * Math.PI / 6;
      var e = Math.max(Math.abs(pick(rd, '部分和') - S), Math.abs(pick(rd, '级数和') - lim), Math.abs(pick(rd, 'Sₙ − 和') - (S - lim)));
      out.push({ name: 'read() 默认（n=30 Σ1/k²）读数与解析一致（阈值 1e-6）', ok: e < 1e-6, detail: 'Δ=' + e.toExponential(2) });
      return out;
    }
  });

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

  /* ⑦ 极坐标曲线与面积（第 10 章） */
  lab({
    id: 'polar', ch: '10', title: '极坐标曲线与扫过面积',
    sub: '拖动 θ 的上限：阴影是半径向量扫过的区域，其面积由 ½∫r²dθ 给出。',
    tex: "A=\\frac{1}{2}\\int_{\\alpha}^{\\beta} r(\\theta)^2\\,d\\theta",
    note: '极坐标下面积元不是 Δθ 而是 ½r²Δθ——因为同样的角度在远处扫出更大的扇形。求两曲线之间的面积就是两块的差。',
    view: { x0: -3.2, x1: 3.2, y0: -3.2, y1: 3.2 },
    ctrls: [
      { k: 'th', label: 'θ 上限（× π）', min: 0.2, max: 4, step: 0.05, val: 2 },
      { k: 'r', label: '曲线', type: 'sel', val: 'card', opts: [['card', 'r = 1 + cos θ（心形线）'], ['rose', 'r = cos 2θ（四叶玫瑰）'], ['spiral', 'r = θ/2（阿基米德螺线）'], ['lim', 'r = 1 + 2cos θ（内环）']] }
    ],
    rf: {
      card: function (t) { return 1 + Math.cos(t); },
      rose: function (t) { return Math.cos(2 * t); },
      spiral: function (t) { return t / 2; },
      lim: function (t) { return 1 + 2 * Math.cos(t); }
    },
    draw: function (v, s) {
      var P = pal(), R = this.rf[s.r], th = s.th * Math.PI, i, t;
      v.axes({ noGrid: true });
      var c = v.ctx, cx = v.px(0), cy = v.py(0), kx = (v.px(1) - v.px(0)), ky = (v.py(0) - v.py(1));
      c.save(); c.strokeStyle = P.grid; c.lineWidth = 1;
      for (i = 1; i <= 3; i++) { c.beginPath(); c.ellipse(cx, cy, kx * i, ky * i, 0, 0, Math.PI * 2); c.stroke(); }
      for (i = 0; i < 12; i++) {
        var a = i * Math.PI / 6;
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * kx * 3.2, cy - Math.sin(a) * ky * 3.2); c.stroke();
      }
      c.restore();
      // 扫过的区域
      var pts = [[0, 0]];
      for (i = 0; i <= 720; i++) { t = th * i / 720; var rr = R(t); pts.push([rr * Math.cos(t), rr * Math.sin(t)]); }
      v.poly(pts, { close: true, fill: P.fill, stroke: 'none' });
      // 完整曲线（浅色）
      v.param(function (t) { return R(t) * Math.cos(t); }, function (t) { return R(t) * Math.sin(t); }, 0, 4 * Math.PI, { color: P.grid, w: 1.4 });
      v.param(function (t) { return R(t) * Math.cos(t); }, function (t) { return R(t) * Math.sin(t); }, 0, th, { color: P.curve, w: 2.3 });
      v.line(0, 0, R(th) * Math.cos(th), R(th) * Math.sin(th), { color: P.curve2, w: 1.6, dash: [6, 4] });
      v.dot(0, 0, { color: P.muted, r: 3 });
      v.text(v.x0 + .15, v.y1 - .3, 'θ ∈ [0, ' + fmt(s.th, 2) + 'π]', { color: P.text, size: 12.5 });
    },
    read: function (s) {
      var R = this.rf[s.r], th = s.th * Math.PI;
      var A = 0.5 * simpson(function (t) { var r = R(t); return r * r; }, 0, th, 2000);
      var A2 = 0.5 * simpson(function (t) { var r = R(t); return r * r; }, 0, 2 * Math.PI, 4000);
      return [['θ 上限', fmt(s.th, 2) + 'π ≈ ' + fmt(th, 3) + ' rad'], ['扫过面积 ½∫r²dθ', fmt(A, 5)],
              ['整条封闭曲线面积', s.r === 'spiral' ? '不封闭' : fmt(A2, 5)], ['r(θ上限)', fmt(R(th), 4)]];
    },
    assert: function () {
      var L = this, out = [], half = function (f, t0, t1) { return 0.5 * simpson(function (t) { var r = f(t); return r * r; }, t0, t1, 20000); };
      var a1 = half(L.rf.card, 0, 2 * Math.PI);
      out.push({ name: '心形线 ½∫₀^{2π}(1+cosθ)²dθ = 3π/2（阈值 1e-6）', ok: Math.abs(a1 - 3 * Math.PI / 2) < 1e-6, detail: 'A=' + a1.toFixed(9) + ' 3π/2=' + (3 * Math.PI / 2).toFixed(9) });
      var a2 = half(L.rf.rose, -Math.PI / 4, Math.PI / 4);
      out.push({ name: '玫瑰 r=cos2θ 单片 = π/8、四片合计 = π/2（阈值 1e-6）', ok: Math.abs(a2 - Math.PI / 8) < 1e-6 && Math.abs(4 * a2 - Math.PI / 2) < 4e-6, detail: 'A₁=' + a2.toFixed(9) });
      var a3 = half(L.rf.spiral, 0, 2 * Math.PI);
      out.push({ name: '螺线 r=θ/2 在 [0,2π] 扫过面积 = π³/3（阈值 1e-5）', ok: Math.abs(a3 - Math.PI * Math.PI * Math.PI / 3) < 1e-5, detail: 'A=' + a3.toFixed(9) });
      var a4 = half(L.rf.lim, 2 * Math.PI / 3, 4 * Math.PI / 3);
      out.push({ name: '内环 r=1+2cosθ 面积 = π − 3√3/2 ≈ 0.5435（阈值 1e-6）', ok: Math.abs(a4 - (Math.PI - 3 * Math.sqrt(3) / 2)) < 1e-6, detail: 'A=' + a4.toFixed(9) });
      var st = {}; L.ctrls.forEach(function (c) { st[c.k] = c.val; });
      var A = half(L.rf[st.r], 0, st.th * Math.PI);
      out.push({ name: 'read() 默认状态（θ 上限 2π、心形线）对应面积 = 3π/2（阈值 1e-9）', ok: Math.abs(A - 3 * Math.PI / 2) < 1e-9, detail: 'A=' + A.toFixed(9) });
      return out;
    }
  });

  /* ⑧ 梯度与方向导数（第 13 章） */
  lab({
    id: 'gradient', ch: '13', title: '梯度与方向导数：最陡上升方向',
    sub: '背景是等高线图；拖动点 P，绿色箭头是 ∇f(P)，右上角玫瑰图给出各方向的导数。',
    tex: "D_{\\mathbf{u}}f=\\nabla f\\cdot\\mathbf{u}=|\\nabla f|\\cos\\varphi,\\qquad \\max D_{\\mathbf{u}}f=|\\nabla f|",
    note: '梯度垂直于等高线、指向函数增长最快的方向，其长度就是最大方向导数；沿等高线方向导数为 0。',
    view: { x0: -2.6, x1: 2.6, y0: -2.1, y1: 2.1, h: 300 },
    ctrls: [
      { k: 'x0', label: 'P 的 x', min: -2.2, max: 2.2, step: 0.02, val: 1 },
      { k: 'y0', label: 'P 的 y', min: -1.8, max: 1.8, step: 0.02, val: 0.6 },
      { k: 'f', label: '函数', type: 'sel', val: 'bowl', opts: [['bowl', 'f = x² + y²'], ['saddle', 'f = x² − y²'], ['wave', 'f = sin x · cos y'], ['prod', 'f = x·y']] }
    ],
    funcs: {
      bowl: function (x, y) { return x * x + y * y; },
      saddle: function (x, y) { return x * x - y * y; },
      wave: function (x, y) { return Math.sin(x) * Math.cos(y); },
      prod: function (x, y) { return x * y; }
    },
    draw: function (v, s) {
      var P = pal(), f = this.funcs[s.f], x0 = s.x0, y0 = s.y0;
      var pdx = function (x, y) { var h = 1e-4; return (f(x + h, y) - f(x - h, y)) / (2 * h); };
      var pdy = function (x, y) { var h = 1e-4; return (f(x, y + h) - f(x, y - h)) / (2 * h); };
      v.clear();
      v.heat(f, { step: 3 });
      v.axes({ noGrid: true });
      var gx = pdx(x0, y0), gy = pdy(x0, y0), g = Math.hypot(gx, gy);
      // 梯度箭头（缩放便于观察）
      var k = 1.6 / Math.max(0.4, Math.max(Math.abs(gx), Math.abs(gy)) * 1.1);
      if (g > 1e-9) v.arrow(x0, y0, x0 + gx * k, y0 + gy * k, { color: P.curve3, w: 2.4 });
      // 等值切线（垂直于梯度）
      if (g > 1e-9) {
        var ux = -gy / g, uy = gx / g, L = 1.1;
        v.line(x0 - ux * L, y0 - uy * L, x0 + ux * L, y0 + uy * L, { color: P.curve3, w: 1.2, dash: [5, 4] });
      }
      // 方向导数玫瑰图（右上角）
      var c = v.ctx, cx = v.px(v.x1) - 74, cy = v.py(v.y1) + 74, R = 52;
      c.save();
      c.strokeStyle = P.grid; c.lineWidth = 1;
      c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.arc(cx, cy, R / 2, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.moveTo(cx - R, cy); c.lineTo(cx + R, cy); c.moveTo(cx, cy - R); c.lineTo(cx, cy + R); c.stroke();
      var mx = Math.max(1e-9, g), n = 180;
      c.beginPath();
      for (var i = 0; i <= n; i++) {
        var th = i / n * Math.PI * 2, du = gx * Math.cos(th) + gy * Math.sin(th);
        var rr = du / mx * R * 0.92;
        var X = cx + Math.cos(th) * rr, Y = cy - Math.sin(th) * rr;
        if (i === 0) c.moveTo(X, Y); else c.lineTo(X, Y);
      }
      c.closePath(); c.fillStyle = P.fill2; c.fill();
      c.strokeStyle = P.curve2; c.lineWidth = 1.6; c.stroke();
      c.restore();
      v.dot(x0, y0, { color: P.curve, r: 5, ring: true });
      v.text(x0, y0, ' P', { color: P.curve, size: 13 });
      v.text(v.x0 + .12, v.y0 + .28, 'f(P) = ' + fmt(f(x0, y0), 4) + '　|∇f| = ' + fmt(g, 4) +
             '　∂f/∂x = ' + fmt(gx, 3) + '　∂f/∂y = ' + fmt(gy, 3), { color: P.text, size: 12 });
    },
    read: function (s) {
      var f = this.funcs[s.f], x0 = s.x0, y0 = s.y0, h = 1e-4;
      var gx = (f(x0 + h, y0) - f(x0 - h, y0)) / (2 * h), gy = (f(x0, y0 + h) - f(x0, y0 - h)) / (2 * h);
      var g = Math.hypot(gx, gy);
      var ux = gx / (g || 1), uy = gy / (g || 1);
      var du = gx * ux + gy * uy;
      return [['P', '(' + fmt(x0, 2) + ', ' + fmt(y0, 2) + ')'], ['f(P)', fmt(f(x0, y0), 5)],
              ['∇f(P)', '(' + fmt(gx, 3) + ', ' + fmt(gy, 3) + ')'], ['|∇f| = 最大方向导数', fmt(g, 5)],
              ['沿 ∇f 方向的方向导数', fmt(du, 5)], ['沿等高线方向的方向导数', fmt(gx * (-uy) + gy * ux, 5)]];
    },
    assert: function () {
      var L = this, out = [], h = 1e-5;
      var g = { bowl: function (x, y) { return [2 * x, 2 * y]; }, saddle: function (x, y) { return [2 * x, -2 * y]; },
                wave: function (x, y) { return [Math.cos(x) * Math.cos(y), -Math.sin(x) * Math.sin(y)]; },
                prod: function (x, y) { return [y, x]; } };
      var mx = 0;
      Object.keys(g).forEach(function (k) {
        [[1, 0.6], [-0.7, 1.1], [0.3, -0.9]].forEach(function (p) {
          var f = L.funcs[k];
          var gx = (f(p[0] + h, p[1]) - f(p[0] - h, p[1])) / (2 * h), gy = (f(p[0], p[1] + h) - f(p[0], p[1] - h)) / (2 * h), A = g[k](p[0], p[1]);
          mx = Math.max(mx, Math.abs(gx - A[0]), Math.abs(gy - A[1]));
        });
      });
      out.push({ name: '数值梯度与解析 ∇f 一致（4 函数 × 3 点，阈值 1e-6）', ok: mx < 1e-6, detail: 'max=' + mx.toExponential(2) });
      var f0 = L.funcs.bowl, gx0 = 2, gy0 = 1.2, G = Math.hypot(gx0, gy0), maxDu = -Infinity;
      for (var i = 0; i < 360; i++) { var t = i * Math.PI / 180; maxDu = Math.max(maxDu, gx0 * Math.cos(t) + gy0 * Math.sin(t)); }
      var contour = Math.abs(gx0 * (-gy0 / G) + gy0 * (gx0 / G));
      out.push({ name: '|∇f| = 最大方向导数（361 方向扫描，阈值 1e-5 = 1° 网格分辨率下限，且不超过 |∇f|）；沿等高线方向导数为 0', ok: maxDu <= G + 1e-12 && Math.abs(maxDu - G) < 1e-5 && contour < 1e-9, detail: 'G=' + G.toFixed(6) + ' max=' + maxDu.toFixed(6) });
      var st = {}; L.ctrls.forEach(function (c) { st[c.k] = c.val; });
      var rd = L.read(st), fb = L.funcs[st.f], x0 = st.x0, y0 = st.y0;
      var g1 = (fb(x0 + 1e-4, y0) - fb(x0 - 1e-4, y0)) / 2e-4, g2 = (fb(x0, y0 + 1e-4) - fb(x0, y0 - 1e-4)) / 2e-4, G1 = Math.hypot(g1, g2);
      var e = Math.max(Math.abs(pick(rd, 'f(P)') - fb(x0, y0)), Math.abs(pick(rd, '最大方向导数') - G1), Math.abs(pick(rd, '沿 ∇f 方向的方向导数') - G1), Math.abs(pick(rd, '沿等高线方向的方向导数')));
      out.push({ name: 'read() 默认（bowl,P=(1,0.6)）读数与解析一致（阈值 1e-4）', ok: e < 1e-4, detail: 'Δ=' + e.toExponential(2) });
      out.push({ name: 'P 处 ∇f = (2x, 2y)（bowl）且方向导数最大值 = |∇f|（阈值 1e-6）', ok: st.f !== 'bowl' || (Math.abs(g1 - 2 * x0) < 1e-6 && Math.abs(g2 - 2 * y0) < 1e-6 && Math.abs(G1 - Math.hypot(2 * x0, 2 * y0)) < 1e-6), detail: '∇f=(' + g1.toFixed(4) + ',' + g2.toFixed(4) + ') |∇f|=' + G1.toFixed(6) });
      return out;
    }
  });

  /* ⑨ 二重积分：极坐标分割（第 14 章） */
  lab({
    id: 'doublepolar', ch: '14', title: '二重积分：极坐标下的面积元',
    sub: '调整径向与角向的分割数：每个小扇块的面积 ≈ r·Δr·Δθ，加总即为极坐标下的二重积分。',
    tex: "\\iint_D f\\,dA=\\int_{\\alpha}^{\\beta}\\!\\!\\int_{a}^{b} f(r\\cos\\theta,\\,r\\sin\\theta)\\,r\\,dr\\,d\\theta",
    note: '雅可比因子 r 来自"外圈弧比内圈弧长"：离原点越远，同样的 Δθ 对应越大的弧长，面积元因此正比于 r。',
    view: { x0: -2.5, x1: 2.5, y0: -2.1, y1: 2.1, h: 300 },
    ctrls: [
      { k: 'nr', label: '径向分割 nᵣ', min: 1, max: 20, step: 1, val: 4 },
      { k: 'nt', label: '角向分割 nθ', min: 3, max: 36, step: 1, val: 12 },
      { k: 'R', label: '半径 R', min: 0.4, max: 2.2, step: 0.05, val: 1.5 },
      { k: 'f', label: '被积函数', type: 'sel', val: 'one', opts: [['one', 'f = 1（就是面积）'], ['sq', 'f = x² + y²'], ['lin', 'f = x + y']] }
    ],
    funcs: {
      one: function () { return 1; },
      sq: function (x, y) { return x * x + y * y; },
      lin: function (x, y) { return x + y; }
    },
    exact: function (key, R) {
      if (key === 'one') return Math.PI * R * R;
      if (key === 'sq') return Math.PI * Math.pow(R, 4) / 2;
      return 0;                                       // f = x + y 在圆盘上积分为 0（奇对称）
    },
    draw: function (v, s) {
      var P = pal(), f = this.funcs[s.f], R = s.R, nr = Math.round(s.nr), nt = Math.round(s.nt);
      v.axes();
      v.param(function (t) { return R * Math.cos(t); }, function (t) { return R * Math.sin(t); }, 0, 2 * Math.PI, { color: P.curve, w: 2.2 });
      var i, j;
      for (i = 0; i < nr; i++) {
        for (j = 0; j < nt; j++) {
          var r1 = R * i / nr, r2 = R * (i + 1) / nr;
          var t1 = 2 * Math.PI * j / nt, t2 = 2 * Math.PI * (j + 1) / nt;
          var rc = (r1 + r2) / 2, tc = (t1 + t2) / 2;
          var val = f(rc * Math.cos(tc), rc * Math.sin(tc));
          var shade = Math.max(0, Math.min(1, Math.abs(val) / (Math.abs(val) + 2.5)));
          v.poly([[r1 * Math.cos(t1), r1 * Math.sin(t1)], [r2 * Math.cos(t1), r2 * Math.sin(t1)],
                  [r2 * Math.cos(t2), r2 * Math.sin(t2)], [r1 * Math.cos(t2), r1 * Math.sin(t2)]],
                 { close: true, fill: val >= 0 ? P.fill : P.fill2, stroke: 'rgba(120,140,170,.5)', w: 0.8 });
          if (nr * nt <= 60) v.dot(rc * Math.cos(tc), rc * Math.sin(tc), { color: P.curve2, r: 2.4 });
        }
      }
      v.dot(0, 0, { color: P.muted, r: 3 });
      v.text(v.x0 + .12, v.y1 - .3, 'ΔA ≈ r·Δr·Δθ', { color: P.text, size: 12.5 });
    },
    read: function (s) {
      var f = this.funcs[s.f], R = s.R, nr = Math.round(s.nr), nt = Math.round(s.nt), sum = 0, i, j;
      for (i = 0; i < nr; i++) {
        var r1 = R * i / nr, r2 = R * (i + 1) / nr, dr = r2 - r1, rc = (r1 + r2) / 2;
        for (j = 0; j < nt; j++) {
          var t1 = 2 * Math.PI * j / nt, t2 = 2 * Math.PI * (j + 1) / nt, tc = (t1 + t2) / 2;
          sum += f(rc * Math.cos(tc), rc * Math.sin(tc)) * rc * dr * (t2 - t1);
        }
      }
      var ex = this.exact(s.f, R);
      return [['分割 nᵣ × nθ', nr + ' × ' + nt + ' = ' + (nr * nt) + ' 块'], ['Δr × Δθ', fmt(R / nr, 3) + ' × ' + fmt(2 * Math.PI / nt, 3)],
              ['黎曼和', fmt(sum, 6)], ['精确值', fmt(ex, 6)], ['误差', fmt(Math.abs(sum - ex), 6)]];
    },
    assert: function () {
      var L = this, out = [], R = 1.5;
      var e1 = Math.max(Math.abs(L.exact('one', R) - Math.PI * R * R), Math.abs(L.exact('sq', R) - Math.PI * Math.pow(R, 4) / 2), Math.abs(L.exact('lin', R)));
      out.push({ name: '闭式：∬1 dA = πR²、∬(x²+y²) dA = πR⁴/2、∬(x+y) dA = 0（阈值 1e-12）', ok: e1 < 1e-12, detail: 'Δ=' + e1.toExponential(2) });
      var num = function (key, nr, nt, RR) {
        var f = L.funcs[key], s = 0, i, j;
        for (i = 0; i < nr; i++) {
          var r1 = RR * i / nr, r2 = RR * (i + 1) / nr, dr = r2 - r1, rc = (r1 + r2) / 2;
          for (j = 0; j < nt; j++) {
            var t1 = 2 * Math.PI * j / nt, t2 = 2 * Math.PI * (j + 1) / nt, tc = (t1 + t2) / 2;
            s += f(rc * Math.cos(tc), rc * Math.sin(tc)) * rc * dr * (t2 - t1);
          }
        }
        return s;
      };
      var ex = L.exact('one', R), a1 = num('one', 4, 12, R), a2 = num('one', 20, 36, R);
      out.push({ name: 'f=1 时黎曼和恰为 πR²（4×12 与 20×36 误差均 <1e-9；f=1 对 r 被中点法精确）', ok: Math.abs(a1 - ex) < 1e-9 && Math.abs(a2 - ex) < 1e-9, detail: 'err(4×12)=' + Math.abs(a1 - ex).toExponential(2) + ' err(20×36)=' + Math.abs(a2 - ex).toExponential(2) });
      var exs = L.exact('sq', R), b1 = num('sq', 4, 12, R), b2 = num('sq', 10, 24, R), b3 = num('sq', 20, 36, R);
      out.push({ name: '黎曼和随分割细化收敛（f=x²+y²：4×12 → 10×24 → 20×36 误差严格下降）', ok: Math.abs(b2 - exs) < Math.abs(b1 - exs) && Math.abs(b3 - exs) < Math.abs(b2 - exs) && Math.abs(b3 - exs) < 1e-2, detail: 'errs=' + [b1, b2, b3].map(function (v) { return Math.abs(v - exs).toExponential(2); }).join(' → ') });
      out.push({ name: 'f=1 时中点法对 r 精确：4×12 的和 = πR²（阈值 1e-9）', ok: Math.abs(a1 - ex) < 1e-9, detail: 'Δ=' + Math.abs(a1 - ex).toExponential(2) });
      out.push({ name: 'f=x+y 的黎曼和因对称恒为 0（阈值 1e-9）', ok: Math.abs(num('lin', 4, 12, R)) < 1e-9, detail: 'sum=' + num('lin', 4, 12, R).toExponential(2) });
      var st = {}; L.ctrls.forEach(function (c) { st[c.k] = c.val; });
      var rd = L.read(st), S = num(st.f, Math.round(st.nr), Math.round(st.nt), st.R), EX = L.exact(st.f, st.R);
      var e = Math.max(Math.abs(pick(rd, '黎曼和') - S), Math.abs(pick(rd, '精确值') - EX), Math.abs(pick(rd, '误差') - Math.abs(S - EX)));
      out.push({ name: 'read() 默认（4×12,R=1.5,f=1）读数与解析一致（阈值 1e-6）', ok: e < 1e-6, detail: 'Δ=' + e.toExponential(2) });
      return out;
    }
  });

  /* ⑩ 向量场与环量（Green 定理）（第 15 章） */
  lab({
    id: 'green', ch: '15', title: 'Green 定理：环量 = 旋度的二重积分',
    sub: '沿圆周边界逆时针积分的环量（左值）等于内部旋度 ∂Q/∂x − ∂P/∂y 的面积分（右值）。',
    tex: "\\oint_C P\\,dx+Q\\,dy=\\iint_R\\Big(\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}\\Big)dA",
    note: '流速场转得越"急"（旋度越大），沿闭合路径的环量越大；Green 定理把边界上的功与内部的旋转总量划等号。',
    view: { x0: -3, x1: 3, y0: -2.2, y1: 2.2, h: 300 },
    ctrls: [
      { k: 'R', label: '圆的半径 R', min: 0.4, max: 2.2, step: 0.05, val: 1.4 },
      { k: 'F', label: '向量场', type: 'sel', val: 'rot', opts: [['rot', 'F = ⟨−y, x⟩　旋度 = 2'], ['rad', 'F = ⟨x, y⟩　旋度 = 0'], ['shear', 'F = ⟨y², x⟩　旋度 = 1−2y'], ['hyp', 'F = ⟨x²−y², 2xy⟩　旋度 = 4y（圆盘上积分为 0）']] }
    ],
    fld: {
      rot: { P: function (x, y) { return -y; }, Q: function (x, y) { return x; } },
      rad: { P: function (x, y) { return x; }, Q: function (x, y) { return y; } },
      shear: { P: function (x, y) { return y * y; }, Q: function (x, y) { return x; } },
      hyp: { P: function (x, y) { return x * x - y * y; }, Q: function (x, y) { return 2 * x * y; } }
    },
    curl: function (key, x, y) {
      var h = 1e-4, F = this.fld[key];
      var Qx = (F.Q(x + h, y) - F.Q(x - h, y)) / (2 * h);
      var Py = (F.P(x, y + h) - F.P(x, y - h)) / (2 * h);
      return Qx - Py;
    },
    draw: function (v, s) {
      var P = pal(), F = this.fld[s.F], R = s.R, i, j;
      v.clear(); v.axes({ noGrid: true });
      // 向量场
      var nx = 21, ny = 15;
      for (i = 1; i < nx; i++) {
        for (j = 1; j < ny; j++) {
          var x = v.x0 + (v.x1 - v.x0) * i / nx, y = v.y0 + (v.y1 - v.y0) * j / ny;
          var u = F.P(x, y), w = F.Q(x, y), m = Math.hypot(u, w);
          if (m < 1e-9) continue;
          var k = Math.min(0.24, 0.24 / Math.max(1, m)) * Math.max(v.x1 - v.x0, v.y1 - v.y0) * 0.55;
          var c = v.ctx, ax = v.px(x), ay = v.py(y);
          var bx = v.px(x + u / m * k), by = v.py(y + w / m * k);
          c.save(); c.strokeStyle = P.grid; c.lineWidth = 1.4;
          c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); c.restore();
        }
      }
      // 路径与切向
      v.param(function (t) { return R * Math.cos(t); }, function (t) { return R * Math.sin(t); }, 0, 2 * Math.PI, { color: P.curve, w: 2.4 });
      for (i = 0; i < 12; i++) {
        var t = i / 12 * Math.PI * 2;
        var x = R * Math.cos(t), y = R * Math.sin(t);
        var u = F.P(x, y), w = F.Q(x, y);
        var dotp = u * (-Math.sin(t)) + w * Math.cos(t);          // 沿切向的功
        var tx = -Math.sin(t) * Math.sign(dotp || 1), ty = Math.cos(t) * Math.sign(dotp || 1);
        var kk = Math.min(0.5, Math.abs(dotp) * 0.35 + 0.12);
        v.arrow(x, y, x + tx * kk, y + ty * kk, { color: dotp >= 0 ? P.curve3 : P.curve2, w: 1.8 });
      }
      v.text(v.x0 + .12, v.y0 + .3, '环量 ∮P dx+Q dy = ' + fmt(this.circulation(s.F, R), 5), { color: P.text, size: 12.5 });
      v.text(v.x0 + .12, v.y0 + .78, '旋度面积分 ∬(Qx − Py)dA = ' + fmt(this.flux(s.F, R), 5), { color: P.muted, size: 12.5 });
    },
    circulation: function (key, R) {
      var F = this.fld[key];
      return simpson(function (t) {
        var x = R * Math.cos(t), y = R * Math.sin(t);
        return F.P(x, y) * (-R * Math.sin(t)) + F.Q(x, y) * (R * Math.cos(t));
      }, 0, 2 * Math.PI, 2000);
    },
    flux: function (key, R) {
      var nr = 80, nt = 240, sum = 0, i, j;
      for (i = 0; i < nr; i++) {
        var r1 = R * i / nr, r2 = R * (i + 1) / nr, rc = (r1 + r2) / 2, dr = r2 - r1;
        for (j = 0; j < nt; j++) {
          var t1 = 2 * Math.PI * j / nt, t2 = 2 * Math.PI * (j + 1) / nt, tc = (t1 + t2) / 2;
          sum += this.curl(key, rc * Math.cos(tc), rc * Math.sin(tc)) * rc * dr * (t2 - t1);
        }
      }
      return sum;
    },
    read: function (s) {
      var R = s.R;
      var circ = this.circulation(s.F, R), fl = this.flux(s.F, R);
      return [['半径 R', fmt(R, 2)], ['环量 ∮ P dx + Q dy', fmt(circ, 6)],
              ['旋度积分 ∬(∂Q/∂x − ∂P/∂y)dA', fmt(fl, 6)], ['两者之差', fmt(circ - fl, 8)],
              ['圆心处旋度', fmt(this.curl(s.F, 0, 0), 4)]];
    },
    assert: function () {
      var L = this, out = [], R = 1.4, mx = 0;
      Object.keys(L.fld).forEach(function (k) { mx = Math.max(mx, Math.abs(L.circulation(k, R) - L.flux(k, R))); });
      out.push({ name: 'Green 定理：环量 = ∬ 旋度 dA（4 个场 × 半径 1.4，阈值 1e-4）', ok: mx < 1e-4, detail: 'max=' + mx.toExponential(2) });
      var ex = { rot: 2 * Math.PI * R * R, rad: 0, shear: Math.PI * R * R, hyp: 0 }, e2 = 0;
      Object.keys(ex).forEach(function (k) { e2 = Math.max(e2, Math.abs(L.circulation(k, R) - ex[k])); });
      out.push({ name: '环量闭式：⟨−y,x⟩→2πR²、⟨y²,x⟩→πR²、⟨x,y⟩ 与 ⟨x²−y²,2xy⟩→0（阈值 1e-4）', ok: e2 < 1e-4, detail: 'max=' + e2.toExponential(2) });
      var e3 = Math.max(Math.abs(L.curl('rot', 0.3, -0.2) - 2), Math.abs(L.curl('rad', 1, 1)), Math.abs(L.curl('hyp', 0.4, 0.7) - 4 * 0.7), Math.abs(L.curl('shear', 0.5, 0.9) - (1 - 2 * 0.9)));
      out.push({ name: '数值旋度（中心差分）与解析一致：rot=2、rad=0、⟨x²−y²,2xy⟩=4y、shear=1−2y（阈值 1e-6）', ok: e3 < 1e-6, detail: 'max=' + e3.toExponential(2) });
      var st = {}; L.ctrls.forEach(function (c) { st[c.k] = c.val; });
      var rd = L.read(st);
      var e4 = Math.max(Math.abs(pick(rd, '环量') - L.circulation(st.F, st.R)), Math.abs(pick(rd, '旋度积分') - L.flux(st.F, st.R)), Math.abs(pick(rd, '圆心处旋度') - L.curl(st.F, 0, 0)));
      out.push({ name: 'read() 默认（R=1.4,⟨−y,x⟩）读数与解析一致（阈值 1e-4）', ok: e4 < 1e-4 && Math.abs(L.circulation('rot', 1.4) - 2 * Math.PI * 1.96) < 1e-6, detail: 'Δ=' + e4.toExponential(2) + ' ∮=' + L.circulation('rot', 1.4).toFixed(6) });
      return out;
    }
  });

  /* ⑪ 斜率场与欧拉法（第 16 章） */
  lab({
    id: 'slopefield', ch: '16', title: '斜率场与欧拉法：一步步走出解曲线',
    sub: '背景是微分方程的斜率场；折线是从初值点出发、用步长 h 做欧拉法得到的近似解。',
    tex: "y_{n+1}=y_n+h\\,f(x_n,y_n),\\qquad \\frac{dy}{dx}=f(x,y)",
    note: '步长减半，误差大致减半（一阶方法）。折线越贴近真实解曲线，说明步长选得越合适。',
    view: { x0: -0.4, x1: 3.2, y0: -2.2, y1: 2.6, h: 300 },
    ctrls: [
      { k: 'h', label: '步长 h', min: 0.05, max: 0.5, step: 0.01, val: 0.25 },
      { k: 'x0', label: '初值 x₀', min: 0, max: 1.2, step: 0.02, val: 0 },
      { k: 'y0', label: '初值 y₀', min: -1.6, max: 1.6, step: 0.02, val: 1 },
      { k: 'f', label: '方程', type: 'sel', val: 'xy', opts: [['xy', "y′ = x + y"], ['yx', "y′ = y − x"], ['logi', "y′ = y(1 − y)"], ['circ', "y′ = −x / y"]] }
    ],
    F: {
      xy: function (x, y) { return x + y; },
      yx: function (x, y) { return y - x; },
      logi: function (x, y) { return y * (1 - y); },
      circ: function (x, y) { return Math.abs(y) < 1e-6 ? 0 : -x / y; }
    },
    exact: function (key, x0, y0) {
      if (key === 'xy') { var C = (y0 + x0 + 1) * Math.exp(-x0); return function (x) { return C * Math.exp(x) - x - 1; }; }
      if (key === 'yx') { var C2 = (y0 - x0 - 1) * Math.exp(-x0); return function (x) { return C2 * Math.exp(x) + x + 1; }; }
      if (key === 'logi') { var C3 = y0 / (1 - y0); return function (x) { var e = C3 * Math.exp(x); return e / (1 + e); }; }
      return function (x) { return Math.sqrt(Math.max(0, y0 * y0 + x0 * x0 - x * x)); };
    },
    draw: function (v, s) {
      var P = pal(), f = this.F[s.f], i;
      v.clear(); v.axes({ noGrid: true });
      var nx = 25, ny = 17;
      for (i = 0; i <= nx; i++) {
        for (var j = 0; j <= ny; j++) {
          var x = v.x0 + (v.x1 - v.x0) * i / nx, y = v.y0 + (v.y1 - v.y0) * j / ny;
          var m = f(x, y);
          if (!isFinite(m)) continue;
          var len = Math.min(v.x1 - v.x0, v.y1 - v.y0) * 0.055;
          var dx = len / Math.sqrt(1 + m * m), dy = m * dx;
          v.line(x - dx, y - dy, x + dx, y + dy, { color: P.grid, w: 1.3 });
        }
      }
      // 真实解（若已知）
      var ex = this.exact(s.f, s.x0, s.y0);
      v.fn(ex, { color: P.curve3, w: 1.8, dash: [7, 4] });
      // 欧拉折线
      var h = s.h, x = s.x0, y = s.y0, pts = [[x, y]];
      while (x < v.x1 - 1e-9 && pts.length < 400) {
        y = y + h * f(x, y); x += h;
        pts.push([x, y]);
      }
      v.poly(pts, { stroke: P.curve2, w: 2.2 });
      pts.forEach(function (p, k) { if (k % 1 === 0) v.dot(p[0], p[1], { color: P.curve2, r: 2.3 }); });
      v.dot(s.x0, s.y0, { color: P.curve, r: 5, ring: true });
      v.text(v.x0 + .12, v.y1 - .3, '欧拉折线（橙）与精确解（绿虚线）', { color: P.muted, size: 12 });
    },
    read: function (s) {
      var f = this.F[s.f], h = s.h, x = s.x0, y = s.y0, steps = 0;
      while (x < 3.2 - 1e-9 && steps < 400) { y = y + h * f(x, y); x += h; steps++; }
      var ex = this.exact(s.f, s.x0, s.y0);
      var ev = ex(3.2);
      return [['步长 h / 步数', fmt(h, 2) + ' / ' + steps], ['欧拉法 y(≈3.2)', fmt(y, 6)],
              ['精确解 y(3.2)', isFinite(ev) ? fmt(ev, 6) : '无闭式解'], ['误差', isFinite(ev) ? fmt(Math.abs(y - ev), 6) : '—']];
    },
    assert: function () {
      var L = this, out = [];
      var eul = function (key, x0, y0, h, xEnd) { var f = L.F[key], x = x0, y = y0, n = 0; while (x < xEnd - 1e-9 && n < 20000) { y += h * f(x, y); x += h; n++; } return y; };
      var e0 = 0;
      /* 初值取 y₀=0.5：logistic 精确解 C = y₀/(1−y₀) 在 y₀=1 时发散（NaN），不能拿它验初值 */
      ['xy', 'yx', 'logi', 'circ'].forEach(function (k) { e0 = Math.max(e0, Math.abs(L.exact(k, 0, 0.5)(0) - 0.5)); });
      out.push({ name: '精确解满足初值 y(x₀)=y₀（4 个方程，y₀=0.5，阈值 1e-9）', ok: e0 < 1e-9, detail: 'max=' + e0.toExponential(2) });
      var errs = [0.5, 0.25, 0.125, 0.0625].map(function (h) { return Math.abs(eul('logi', 0, 0.5, h, 3.2) - L.exact('logi', 0, 0.5)(3.2)); });
      var mono = errs.every(function (e, i) { return i === 0 || e < errs[i - 1]; });
      out.push({ name: '欧拉法误差随 h 减半而下降（logistic，h=0.5→0.0625）', ok: mono, detail: 'errs=' + errs.map(function (e) { return e.toExponential(1); }).join(',') });
      var r1 = errs[1] / errs[0], r2 = errs[3] / errs[2];
      out.push({ name: '一阶方法：err(h/2)/err(h) ∈ (0.3, 0.8)（logistic 两处步长比）', ok: r1 > 0.3 && r1 < 0.8 && r2 > 0.3 && r2 < 0.8, detail: '比值=' + r1.toFixed(3) + ', ' + r2.toFixed(3) });
      var st = {}; L.ctrls.forEach(function (c) { st[c.k] = c.val; });
      var rd = L.read(st), y3 = eul(st.f, st.x0, st.y0, st.h, 3.2), ev = L.exact(st.f, st.x0, st.y0)(3.2);
      var e2 = Math.max(Math.abs(pick(rd, '欧拉法') - y3), Math.abs(pick(rd, '精确解') - ev), Math.abs(pick(rd, '误差') - Math.abs(y3 - ev)));
      out.push({ name: 'read() 默认（h=0.25,x₀=0,y₀=1,y′=x+y）读数与解析一致（阈值 1e-5）', ok: e2 < 1e-5, detail: 'Δ=' + e2.toExponential(2) });
      return out;
    }
  });

  /* ⑫ 阻尼振动：时程与相图（第 17 章） */
  lab({
    id: 'damped', ch: '17', title: '阻尼振动：时程曲线与相图',
    sub: '左图是位移随时间的变化，右图是相平面 (y, y′)。改变阻尼比 ζ 观察三种情形的分界。',
    tex: "y''+2\\zeta\\omega\\,y'+\\omega^{2}y=0,\\qquad y(0)=1,\\;y'(0)=0",
    note: 'ζ<1 欠阻尼（衰减振荡）· ζ=1 临界阻尼（最快回到平衡而不振荡）· ζ>1 过阻尼（缓慢回落）。相图上的螺旋/结点正对应这三种命运。',
    panes: 2,
    view: { x0: 0, x1: 14, y0: -1.05, y1: 1.05, h: 280 },
    view2: { x0: -1.1, x1: 1.1, y0: -1.6, y1: 1.6, h: 280 },
    ctrls: [
      { k: 'z', label: '阻尼比 ζ', min: 0, max: 2, step: 0.01, val: 0.15 },
      { k: 'w', label: '固有频率 ω', min: 0.5, max: 3, step: 0.05, val: 1.5 }
    ],
    sol: function (z, w) {
      var disc = z * z - 1, y, yp;
      if (disc < -1e-9) {
        var wd = w * Math.sqrt(1 - z * z), B = z * w / wd;
        y = function (t) { return Math.exp(-z * w * t) * (Math.cos(wd * t) + B * Math.sin(wd * t)); };
        yp = function (t) {
          var e = Math.exp(-z * w * t), c = Math.cos(wd * t), s2 = Math.sin(wd * t);
          return e * (-z * w * (c + B * s2) + (-wd * s2 + B * wd * c));
        };
        return { y: y, yp: yp, type: '欠阻尼 ζ<1（衰减振荡）', wd: wd };
      }
      if (Math.abs(disc) <= 1e-9) {
        y = function (t) { return Math.exp(-w * t) * (1 + w * t); };
        yp = function (t) { return Math.exp(-w * t) * (-w * (1 + w * t) + w); };
        return { y: y, yp: yp, type: '临界阻尼 ζ=1（最快不振荡地归零）', wd: 0 };
      }
      var s = Math.sqrt(disc), r1 = w * (-z + s), r2 = w * (-z - s);
      var c1 = -r2 / (r1 - r2), c2 = r1 / (r1 - r2);
      y = function (t) { return c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t); };
      yp = function (t) { return c1 * r1 * Math.exp(r1 * t) + c2 * r2 * Math.exp(r2 * t); };
      return { y: y, yp: yp, type: '过阻尼 ζ>1（缓慢回落）', wd: 0 };
    },
    draw: function (v, s) {
      var P = pal(), sol = this.sol(s.z, s.w);
      var vv = Array.isArray(v) ? v[0] : v, v2 = Array.isArray(v) ? v[1] : null;
      vv.axes();
      vv.line(vv.x0, 0, vv.x1, 0, { color: P.axis, w: 1.2 });
      if (sol.wd) {
        var env = 1 / Math.max(1e-6, Math.sqrt(1 - s.z * s.z));
        vv.fn(function (t) { return env * Math.exp(-s.z * s.w * t); }, { color: P.grid, w: 1.2, dash: [4, 4] });
        vv.fn(function (t) { return -env * Math.exp(-s.z * s.w * t); }, { color: P.grid, w: 1.2, dash: [4, 4] });
      }
      vv.fn(sol.y, { color: P.curve, w: 2.2 });
      vv.text(vv.x0 + .2, vv.y1 - .12, 'y(t)', { color: P.text, size: 12.5 });
      if (v2) {
        v2.axes();
        v2.line(v2.x0, 0, v2.x1, 0, { color: P.axis, w: 1 });
        v2.line(0, v2.y0, 0, v2.y1, { color: P.axis, w: 1 });
        v2.param(function (t) { return sol.y(t); }, function (t) { return sol.yp(t); }, 0, 14,
                { color: P.curve2, w: 2, n: 1200 });
        v2.dot(sol.y(0), sol.yp(0), { color: P.curve3, r: 5 });
        v2.text(v2.x0 + .1, v2.y1 - .12, '相图 (y, y′)', { color: P.text, size: 12.5 });
      }
    },
    read: function (s) {
      var sol = this.sol(s.z, s.w);
      var out = [['阻尼比 ζ / 频率 ω', fmt(s.z, 2) + ' / ' + fmt(s.w, 2)], ['判别式 ζ²−1', fmt(s.z * s.z - 1, 3)],
                 ['类型', sol.type], ['阻尼频率 ω_d', sol.wd ? fmt(sol.wd, 4) : '—'],
                 ['y(5)', fmt(sol.y(5), 5)], ['y(10)', fmt(sol.y(10), 5)]];
      return out;
    },
    assert: function () {
      var L = this, out = [], mx0 = 0, mxo = 0;
      [0.15, 1, 1.8].forEach(function (z) {
        [0.5, 1.5, 3].forEach(function (w) {
          var s = L.sol(z, w);
          mx0 = Math.max(mx0, Math.abs(s.y(0) - 1), Math.abs(s.yp(0)));
          [0.3, 1.7, 4.4].forEach(function (t) {
            var h = 1e-4, d2 = (s.y(t + h) - 2 * s.y(t) + s.y(t - h)) / (h * h);
            mxo = Math.max(mxo, Math.abs(d2 + 2 * z * w * s.yp(t) + w * w * s.y(t)));
          });
        });
      });
      out.push({ name: '初值 y(0)=1、y′(0)=0（3 阻尼比 × 3 频率，阈值 1e-12）', ok: mx0 < 1e-12, detail: 'max=' + mx0.toExponential(2) });
      out.push({ name: '满足方程 y″ + 2ζωy′ + ω²y = 0（数值二阶导，9 组 × 3 点，阈值 1e-4）', ok: mxo < 1e-4, detail: 'max=' + mxo.toExponential(2) });
      var cross = function (z, w) { var s = L.sol(z, w), c = 0, t, prev = s.y(1e-6); for (t = 0.05; t <= 14; t += 0.05) { var y = s.y(t); if (y * prev < 0) c++; prev = y; } return c; };
      out.push({ name: 'ζ=0.15 多次过零（衰减振荡）而 ζ=1 不过零（最快归零）', ok: cross(0.15, 1.5) >= 3 && cross(1, 1.5) === 0 && Math.abs(L.sol(0.15, 1.5).y(14)) < 0.1, detail: 'cross(0.15)=' + cross(0.15, 1.5) + ' cross(1)=' + cross(1, 1.5) });
      var st = {}; L.ctrls.forEach(function (c) { st[c.k] = c.val; });
      var rd = L.read(st), s0 = L.sol(st.z, st.w), d = Math.abs(pick(rd, '判别式') - (st.z * st.z - 1));
      out.push({ name: 'read() 默认（ζ=0.15,ω=1.5）判别式 = ζ²−1 = −0.9775 且判定为欠阻尼（阈值 1e-3）', ok: d < 1e-3 && /欠阻尼/.test(s0.type) && Math.abs(s0.y(0) - 1) < 1e-12, detail: 'Δ=' + d.toExponential(2) + ' type=' + s0.type });
      return out;
    }
  });


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
     第 01–06 章实验台（小类②新增，2026-10-08）
     每台自带 assert()：返回 [{name, ok, detail}]，由 SITE_LABS.assertAll() 统一跑。
     阈值一律写在对应断言的注释里，改动断言必须同时改注释。
     ===================================================================== */
  function side(f, a, h) {              // 与 a 的距离 h 处的函数值（不依赖 f(a)）
    var y = f(a + h);
    return isFinite(y) ? y : NaN;
  }
  function qside(f, a, h, sgn) {        // 单侧差商：从 a+sgn·h/2 走到 a+sgn·h（Δx = sgn·h/2，左侧为负），避开 f(a) 无定义
    var y1 = f(a + sgn * h), y2 = f(a + sgn * h / 2);
    return (y1 - y2) / (sgn * h / 2);
  }
  function polyLenF(f, a, b, n) {       // y=f(x) 的 n 段折线长度
    var L = 0, px = a, py = f(a), i;
    for (i = 1; i <= n; i++) { var x = a + (b - a) * i / n, y = f(x); L += Math.hypot(x - px, y - py); px = x; py = y; }
    return L;
  }
  function polyLenP(fx, fy, t0, t1, n) { // 参数曲线的 n 段折线长度
    var L = 0, px = fx(t0), py = fy(t0), i;
    for (i = 1; i <= n; i++) { var t = t0 + (t1 - t0) * i / n, x = fx(t), y = fy(t); L += Math.hypot(x - px, y - py); px = x; py = y; }
    return L;
  }
  function sgnOf(x, e) { return Math.abs(x) < (e || 1e-9) ? 0 : (x > 0 ? 1 : -1); }
  function shadeArea(v, f, a, b, fill, n) {   // 曲线与 x 轴之间填充（自建多边形，不依赖内核额外 API）
    n = n || 240; var pts = [[a, 0]], i;
    for (i = 0; i <= n; i++) { var x = a + (b - a) * i / n; pts.push([x, f(x)]); }
    pts.push([b, 0]);
    v.poly(pts, { close: true, fill: fill });
  }

  /* ① 函数变换（第 1 章） */
  lab({
    id: 'transform', ch: '01', title: '函数变换：平移·伸缩·翻转',
    sub: '拖 a、b、h、k，看 g(x)=a·f(b(x−h))+k 怎么由基准函数 f 变出来；把 h、k 归零还能读出奇偶性。',
    tex: "g(x)=a\\,f\\big(b(x-h)\\big)+k",
    note: 'b>1 横向压缩、0<b<1 横向拉伸、b<0 关于 y 轴翻转；a<0 关于 x 轴翻转。顺序是"先按 b 缩、再按 h 移"，直接写 b(x−h) 就是"移了再缩"，最易错。b=0 退化为常函数，已钳到 ±0.1。',
    view: { x0: -6, x1: 6, y0: -4, y1: 4, h: 320 },
    ctrls: [
      { k: 'f', label: '基准函数 f', type: 'sel', val: 'sq', opts: [['sq', 'x²'], ['cube', 'x³'], ['abs', '|x|'], ['sin', 'sin x'], ['inv', '1/x'], ['sqrt', '√x']] },
      { k: 'a', label: '纵向伸缩 a', min: -3, max: 3, step: 0.1, val: 1 },
      { k: 'b', label: '横向伸缩 b', min: -3, max: 3, step: 0.1, val: 1 },
      { k: 'h', label: '左右平移 h', min: -3, max: 3, step: 0.1, val: 0 },
      { k: 'k', label: '上下平移 k', min: -3, max: 3, step: 0.1, val: 0 }
    ],
    base: function (key) {
      if (key === 'cube') return function (x) { return x * x * x; };
      if (key === 'abs') return function (x) { return Math.abs(x); };
      if (key === 'sin') return Math.sin;
      if (key === 'inv') return function (x) { return x === 0 ? NaN : 1 / x; };
      if (key === 'sqrt') return function (x) { return x < 0 ? NaN : Math.sqrt(x); };
      return function (x) { return x * x; };
    },
    bk: function (s) { var b = s.b; return Math.abs(b) < 0.1 ? (b < 0 ? -0.1 : 0.1) : b; },
    g: function (s) { var F = this.base(s.f), b = this.bk(s); return function (x) { return s.a * F(b * (x - s.h)) + s.k; }; },
    parity: function (s) {
      var g = this.g(s), ev = true, od = true, seen = 0, i;
      for (i = 1; i <= 40; i++) {
        var x = i * 0.15, y1 = g(x), y2 = g(-x);
        if (!isFinite(y1) || !isFinite(y2)) continue;
        seen++;
        if (Math.abs(y1 - y2) > 1e-9) ev = false;      // 阈值 1e-9：40 个采样点上的对称性
        if (Math.abs(y1 + y2) > 1e-9) od = false;
      }
      if (seen < 5) return '定义域不对称（不谈奇偶）';
      return ev && od ? '既奇又偶（零函数）' : ev ? '偶函数（关于 y 轴对称）' : od ? '奇函数（关于原点对称）' : '非奇非偶';
    },
    draw: function (v, s) {
      var P = pal(), F = this.base(s.f), g = this.g(s);
      v.axes();
      v.fn(F, { color: P.muted, w: 1.5, dash: [5, 4] });
      v.fn(g, { color: P.curve, w: 2.3 });
      v.line(s.h, v.y0, s.h, v.y1, { color: P.grid, w: 1, dash: [3, 4] });
      v.text(v.x1 - 0.5, v.y1 - 0.35, '虚线 = f，实线 = g(x)', { color: P.muted, size: 11.5, align: 'right' });
      v.dot(s.h, g(s.h), { color: P.dot, r: 4.5 });
    },
    read: function (s) {
      var g = this.g(s), b = this.bk(s), F = this.base(s.f);
      return [
        ['a / b / h / k', s.a + ' / ' + b + ' / ' + s.h + ' / ' + s.k],
        ['g(0.7)', fmt(g(0.7))],
        ['a·f(b(0.7−h))+k（按顺序合成）', fmt(s.a * F(b * (0.7 - s.h)) + s.k)],
        ['内层归零处 x=h，g(h)=a·f(0)+k', fmt(g(s.h)) + ' / ' + fmt(s.a * F(0) + s.k)],
        ['奇偶性（h=k=0 时才有意义）', this.parity(s)]
      ];
    },
    assert: function () {
      var L = this, out = [], i, maxd = 0;
      /* 断言 1：直接代入 ≡ 按变换顺序合成，阈值 <1e-12 */
      [['sq', 2, -1.5, 0.7, -1.2], ['sin', -2, 2.5, 1.1, 0.4], ['cube', 0.7, -0.5, -2, 1.3], ['inv', 1.4, 1.7, -0.6, 0.9]].forEach(function (c) {
        var s = { f: c[0], a: c[1], b: c[2], h: c[3], k: c[4] }, g = L.g(s), F = L.base(s.f), b = L.bk(s);
        for (i = -19; i <= 19; i++) { var x = i * 0.27 + 0.03, d = Math.abs(g(x) - (s.a * F(b * (x - s.h)) + s.k)); if (isFinite(d) && d > maxd) maxd = d; }
      });
      out.push({ name: 'transform: g(x) ≡ a·f(b(x−h))+k（阈值 1e-12）', ok: maxd < 1e-12, detail: 'maxdiff=' + maxd });
      /* 断言 2：镜像恒等式 g_{a,b,h,k}(x) = g_{a,−b,−h,k}(−x)，阈值 <1e-12 */
      var maxm = 0;
      [['cube', 1.3, 2, 0.4, -0.7], ['sin', -0.8, -1.4, -1.1, 0.3]].forEach(function (c) {
        var s1 = { f: c[0], a: c[1], b: c[2], h: c[3], k: c[4] };
        var s2 = { f: c[0], a: c[1], b: -c[2], h: -c[3], k: c[4] };
        var g1 = L.g(s1), g2 = L.g(s2);
        for (i = -15; i <= 15; i++) { var x = i * 0.31, d = Math.abs(g1(x) - g2(-x)); if (isFinite(d) && d > maxm) maxm = d; }
      });
      out.push({ name: 'transform: b→−b 且 h→−h 等价于 x→−x（阈值 1e-12）', ok: maxm < 1e-12, detail: 'maxdiff=' + maxm });
      /* 断言 3：h=k=0 时奇偶性与解析一致（x²/|x| 偶、x³/sin x/1/x 奇、√x 定义域不对称） */
      var want = { sq: '偶函数（关于 y 轴对称）', abs: '偶函数（关于 y 轴对称）', cube: '奇函数（关于原点对称）', sin: '奇函数（关于原点对称）', inv: '奇函数（关于原点对称）', sqrt: '定义域不对称（不谈奇偶）' };
      var bad = [];
      Object.keys(want).forEach(function (k) { var got = L.parity({ f: k, a: 1, b: 1, h: 0, k: 0 }); if (got !== want[k]) bad.push(k + '→' + got); });
      out.push({ name: 'transform: 奇偶性判据与解析一致（6 个基准函数）', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
      return out;
    }
  });

  /* ② ε-δ 极限（第 2 章） */
  lab({
    id: 'epsdelta', ch: '02', title: 'ε-δ 极限：把"任意小"量化',
    sub: '选一条曲线：拖 ε 画出水平带、拖 δ 画出竖直带。竖直带内的曲线是否全部落在水平带内，就是极限定义本身。',
    tex: "0<|x-a|<\\delta\\;\\Longrightarrow\\;|f(x)-L|<\\varepsilon",
    note: '极限不要求 f 在 x=a 有定义（例 1 就是个洞）。ε 变小 δ 就得变小——"对每个 ε 都存在 δ"说的就是 δ*(ε) 这条曲线。',
    view: { x0: -0.5, x1: 2.5, y0: -0.5, y1: 4.5, h: 320 },
    ctrls: [
      { k: 'f', label: '函数（a 与 L）', type: 'sel', val: 'hole', opts: [['hole', '(x²−1)/(x−1)，a=1，L=2'], ['sq', 'x²，a=2，L=4'], ['sinc', 'sin x / x，a=0，L=1'], ['abs', '|x|，a=0，L=0']] },
      { k: 'eps', label: 'ε（纵带半宽）', min: 0.05, max: 1.2, step: 0.05, val: 0.5 },
      { k: 'delta', label: 'δ（横带半宽）', min: 0.01, max: 0.8, step: 0.01, val: 0.3 }
    ],
    spec: function (k) {
      if (k === 'sq') return { f: function (x) { return x * x; }, a: 2, L: 4, box: { x0: 0.5, x1: 3.5, y0: -0.5, y1: 9.5 } };
      if (k === 'sinc') return { f: function (x) { return x === 0 ? 1 : Math.sin(x) / x; }, a: 0, L: 1, box: { x0: -3, x1: 3, y0: -0.4, y1: 1.4 } };
      if (k === 'abs') return { f: Math.abs, a: 0, L: 0, box: { x0: -1.5, x1: 1.5, y0: -0.4, y1: 1.9 } };
      return { f: function (x) { return Math.abs(x - 1) < 1e-12 ? NaN : (x * x - 1) / (x - 1); }, a: 1, L: 2, box: { x0: -0.5, x1: 2.5, y0: -0.5, y1: 4.5 } };
    },
    witness: function (k, d) {                 // 窗口 0<|x−a|<δ 内 |f−L| 的上确界及其位置（4001 点密扫）
      var S = this.spec(k), n = 4000, bx = S.a, bm = -1, i;
      for (i = 0; i <= n; i++) {
        var x = S.a - d + 2 * d * i / n;
        if (Math.abs(x - S.a) < 1e-12) continue;
        var y = S.f(x); if (!isFinite(y)) continue;
        var e = Math.abs(y - S.L);
        if (e > bm) { bm = e; bx = x; }
      }
      return { x: bx, err: bm };
    },
    worst: function (k, d) { return this.witness(k, d).err; },
    deltaStar: function (k, eps) {             // 使 max|f−L| ≤ ε 成立的最大 δ（worst 关于 δ 单调，故可二分）
      var lo = 0, hi = 1.2, i;
      if (this.worst(k, hi) <= eps) return hi;
      for (i = 0; i < 60; i++) { var mid = (lo + hi) / 2; if (this.worst(k, mid) <= eps) lo = mid; else hi = mid; }
      return lo;
    },
    draw: function (v, s) {
      var P = pal(), S = this.spec(s.f), w = this.witness(s.f, s.delta);
      var bx = S.box; v.x0 = bx.x0; v.x1 = bx.x1; v.y0 = bx.y0; v.y1 = bx.y1;
      v.axes();
      v.rect(v.x0, S.L - s.eps, v.x1, S.L + s.eps, { fill: P.fill2 });                    // ε-带
      v.rect(S.a - s.delta, v.y0, S.a + s.delta, v.y1, { fill: P.fill3 });                // δ-邻域
      v.line(v.x0, S.L - s.eps, v.x1, S.L - s.eps, { color: P.curve3, w: 1.2, dash: [5, 3] });
      v.line(v.x0, S.L + s.eps, v.x1, S.L + s.eps, { color: P.curve3, w: 1.2, dash: [5, 3] });
      v.line(S.a - s.delta, v.y0, S.a - s.delta, v.y1, { color: P.curve4, w: 1.2, dash: [5, 3] });
      v.line(S.a + s.delta, v.y0, S.a + s.delta, v.y1, { color: P.curve4, w: 1.2, dash: [5, 3] });
      v.fn(S.f, { color: P.curve, w: 2.3 });
      v.dot(S.a, S.L, { color: P.dot, r: 4.5, ring: true });                              // (a, L)：可能不在曲线上
      v.text(S.a, S.L, ' (a, L)', { color: P.text, size: 11.5 });
      if (isFinite(w.err)) v.dot(w.x, S.f(w.x), { color: P.curve3, r: 3.4 });   // 窗口内的最坏点（反例见证）
    },
    read: function (s) {
      var S = this.spec(s.f), w = this.witness(s.f, s.delta), ds = this.deltaStar(s.f, s.eps);
      return [
        ['a / L', fmt(S.a) + ' / ' + fmt(S.L)],
        ['ε（纵带半宽） / δ（横带半宽）', fmt(s.eps) + ' / ' + fmt(s.delta)],
        ['窗口内最坏误差 max|f−L|', fmt(w.err)],
        ['ε 条件是否成立', w.err <= s.eps ? '成立（δ 够小）' : '不成立：x=' + fmt(w.x) + ' 是反例'],
        ['该 ε 允许的最大 δ*(ε)', fmt(ds)],
        ['当前 δ 与 δ*(ε) 之比', fmt(ds > 0 ? s.delta / ds : Infinity)]
      ];
    },
    assert: function () {
      var L = this, out = [], keys = ['hole', 'sq', 'sinc', 'abs'], epsl = [0.1, 0.3, 0.7];
      /* 断言 1：δ = 0.98·δ*(ε) 必须成立（阈值 1e-12 容差） */
      var b1 = [];
      keys.forEach(function (k) { epsl.forEach(function (e) { var d = L.deltaStar(k, e); if (!(L.worst(k, d * 0.98) <= e + 1e-12)) b1.push(k + '/ε=' + e); }); });
      out.push({ name: 'epsdelta: δ=0.98·δ*(ε) 时窗口内误差 ≤ ε', ok: b1.length === 0, detail: b1.join(',') || 'ok' });
      /* 断言 2：δ = 1.05·δ*(ε) 必须找得到反例 x（0<|x−a|<δ 且 |f−L|>ε） */
      var b2 = [];
      keys.forEach(function (k) {
        var S = L.spec(k);
        epsl.forEach(function (e) {
          var d = L.deltaStar(k, e);
          if (d >= 1.19) return;                        // δ* 已顶到扫描上限（该 ε 下窗口内误差压不到 ε 之外），无 “δ* 之外” 可言，跳过
          var w = L.witness(k, d * 1.05), dist = Math.abs(w.x - S.a);
          if (!(w.err > e && dist > 0 && dist <= d * 1.05 + 1e-12)) b2.push(k + '/ε=' + e + ' err=' + w.err.toFixed(6));
        });
      });
      out.push({ name: 'epsdelta: δ=1.05·δ*(ε) 时存在反例（|f−L|>ε）', ok: b2.length === 0, detail: b2.join(',') || 'ok' });
      /* 断言 3：δ*(ε) 随 ε 单调不减（阈值 1e-9） */
      var mono = true, prev = -1;
      [0.05, 0.1, 0.2, 0.4, 0.8].forEach(function (e) { var d = L.deltaStar('hole', e); if (d < prev - 1e-9) mono = false; prev = d; });
      out.push({ name: 'epsdelta: δ*(ε) 随 ε 单调不减（阈值 1e-9）', ok: mono, detail: 'δ*(0.05)=' + fmt(L.deltaStar('hole', 0.05)) + ' δ*(0.8)=' + fmt(L.deltaStar('hole', 0.8)) });
      /* 断言 4：洞函数在 a 处无定义却仍可被压到 1e-6 以内（阈值 1e-6） */
      var S1 = L.spec('hole');
      out.push({ name: 'epsdelta: 洞函数 a 处无定义但误差可压到 <1e-6', ok: !isFinite(S1.f(1)) && L.worst('hole', L.deltaStar('hole', 1e-6)) <= 1e-6, detail: 'f(1)=' + S1.f(1) });
      return out;
    }
  });

  /* ③ 夹逼定理（第 2 章） */
  lab({
    id: 'squeeze', ch: '02', title: '夹逼定理：三明治怎么合拢',
    sub: '左图 sin x / x 被 cos x 与 1 上下夹住；右图是上界误差 1 − sin x/x，它会随 x 减小而单调下降。',
    tex: "\\cos x\\le\\frac{\\sin x}{x}\\le 1\\;(0<|x|<\\tfrac{\\pi}{2}),\\qquad \\lim_{x\\to0}\\frac{\\sin x}{x}=1",
    note: '上界误差 ≈ x²/6：x 减半，误差掉到约 1/4（右图纵轴就是它）。两侧同时夹住，才是极限存在的理由。',
    panes: 2,
    view: { x0: -1.6, x1: 1.6, y0: 0.75, y1: 1.05, h: 300 },
    view2: { x0: 0.02, x1: 1.6, y0: 0, y1: 0.36, h: 300 },
    ctrls: [{ k: 'x', label: 'x₀', min: 0.05, max: 1.5, step: 0.01, val: 0.6 }],
    sinc: function (x) { return x === 0 ? 1 : Math.sin(x) / x; },
    err: function (x) { return 1 - (x === 0 ? 1 : Math.sin(x) / x); },   // 不依赖 this：可当回调直接传给 fn()
    draw: function (v, s) {
      var P = pal(), A = v[0], B = v[1], x = s.x, i, upper = [], lower = [];
      for (i = 0; i <= 200; i++) { var t = A.x0 + (A.x1 - A.x0) * i / 200; upper.push([t, 1]); lower.push([t, Math.cos(t)]); }
      A.axes();
      A.poly(upper.concat(lower.slice().reverse()), { close: true, fill: P.fill2 });      // 三明治的夹层
      A.fn(Math.cos, { color: P.curve3, w: 1.9 });
      A.fn(function () { return 1; }, { color: P.curve4, w: 1.7, dash: [6, 4] });
      A.fn(this.sinc, { color: P.curve, w: 2.4 });
      A.line(x, A.y0, x, A.y1, { color: P.grid, w: 1, dash: [3, 4] });
      A.dot(x, Math.cos(x), { color: P.curve3, r: 3.6 });
      A.dot(x, this.sinc(x), { color: P.curve, r: 4.4 });
      A.dot(x, 1, { color: P.curve4, r: 3.6 });
      A.text(A.x0 + 0.05, A.y1 - 0.03, 'cos x ≤ sin x/x ≤ 1', { color: P.text, size: 11.5, base: 'top' });
      B.axes();
      B.fn(this.err, { color: P.curve2, w: 2.3 });
      B.line(x, B.y0, x, B.y1, { color: P.grid, w: 1, dash: [3, 4] });
      B.dot(x, this.err(x), { color: P.curve2, r: 4.4 });
      B.text(x, this.err(x), '  e=' + fmt(this.err(x)), { color: P.text, size: 11.5 });
      B.text(B.x0 + 0.03, B.y1 - 0.02, '上界误差 1 − sin x/x', { color: P.muted, size: 11.5, base: 'top' });
    },
    read: function (s) {
      var x = s.x, y = this.sinc(x), e = this.err(x);
      return [
        ['x₀', fmt(x)],
        ['下界 cos x₀', fmt(Math.cos(x))],
        ['sin x₀ / x₀', fmt(y)],
        ['上界 1', '1'],
        ['夹逼是否成立（容差 1e-15）', (y <= 1 + 1e-15 && y >= Math.cos(x) - 1e-15) ? '成立' : '不成立'],
        ['上界误差 1 − sin x/x', fmt(e)],
        ['误差 ÷（x²/6）', fmt(e / (x * x / 6))],
        ['x 减半后的误差（应≈1/4）', fmt(this.err(x / 2))]
      ];
    },
    assert: function () {
      var L = this, out = [], i, bad = [];
      /* 断言 1：夹逼不等式在 400 个采样点上成立（容差 1e-15） */
      for (i = 1; i <= 400; i++) { var x = i * (Math.PI / 2) / 400, y = L.sinc(x); if (!(y <= 1 + 1e-15 && y >= Math.cos(x) - 1e-15)) bad.push(x); }
      out.push({ name: 'squeeze: cos x ≤ sin x/x ≤ 1（400 点，容差 1e-15）', ok: bad.length === 0, detail: bad.length ? 'x=' + bad[0] : 'ok' });
      /* 断言 2：上界误差随 x 减小严格单调下降（30 个等距点） */
      var mono = true, prev = Infinity;
      for (i = 30; i >= 1; i--) { var x2 = i * 1.5 / 30, e = L.err(x2); if (!(e < prev)) mono = false; prev = e; }
      out.push({ name: 'squeeze: 上界误差随 x 减小严格单调下降', ok: mono, detail: 'e(1.5)=' + fmt(L.err(1.5)) + ' → e(0.05)=' + fmt(L.err(0.05)) });
      /* 断言 3：误差 ~ x²/6（x=1e-3 时 e<1e-6 且比值偏差 <2%） */
      var e3 = L.err(1e-3), r = e3 / (1e-6 / 6);
      out.push({ name: 'squeeze: 误差 ~ x²/6（x=1e-3，e<1e-6 且比值偏差 <2%）', ok: e3 < 1e-6 && Math.abs(r - 1) < 0.02, detail: 'e=' + e3.toExponential(3) + ' ratio=' + r.toFixed(4) });
      /* 断言 4：下界间隙 sin x/x − cos x ≥ 0 且 → 0（x=1e-4 时 <1e-8） */
      var gap4 = L.sinc(1e-4) - Math.cos(1e-4);
      out.push({ name: 'squeeze: 下界间隙 sin x/x − cos x ≥0 且 →0（x=1e-4 时 <1e-8）', ok: gap4 >= 0 && gap4 < 1e-8 && (L.sinc(1) - Math.cos(1)) > 0, detail: fmt(gap4) });
      return out;
    }
  });

  /* ④ 不连续点分类（第 2 章） */
  lab({
    id: 'discont', ch: '02', title: '不连续点分类：四种坏法',
    sub: '拖 x 逼近间断点：左右极限相等而函数没定义=可去；两者不等=跳跃；一侧发散=无穷；来回撞=振荡。',
    tex: "\\lim_{x\\to a^-}f(x)\\;\\stackrel{?}{=}\\;\\lim_{x\\to a^+}f(x)\\;\\stackrel{?}{=}\\;f(a)",
    note: '判据是"左右极限 + 函数值"三者是否一致。振荡型的要害不是"值很大"，而是左右极限都不存在。',
    view: { x0: -1.5, x1: 1.5, y0: -1.6, y1: 1.6, h: 300 },
    ctrls: [
      { k: 't', label: '类型', type: 'sel', val: 'rem', opts: [['rem', '可去：(x²−1)/(x−1)，a=1'], ['jump', '跳跃：sign(x)，a=0'], ['inf', '无穷：1/x，a=0'], ['osc', '振荡：sin(1/x)，a=0']] },
      { k: 'x', label: '步长 h', min: 0.001, max: 1.2, step: 0.001, val: 0.3 }
    ],
    spec: function (t) {
      if (t === 'jump') return { f: function (x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }, a: 0, box: { x0: -1.5, x1: 1.5, y0: -1.6, y1: 1.6 }, expect: '跳跃间断（左右极限不等）' };
      if (t === 'inf') return { f: function (x) { return x === 0 ? NaN : 1 / x; }, a: 0, box: { x0: -1.5, x1: 1.5, y0: -6, y1: 6 }, expect: '无穷间断（一侧或两侧发散）' };
      if (t === 'osc') return { f: function (x) { return x === 0 ? 0 : Math.sin(1 / x); }, a: 0, box: { x0: -0.6, x1: 0.6, y0: -1.4, y1: 1.4 }, expect: '振荡间断（极限不存在）' };
      return { f: function (x) { return Math.abs(x - 1) < 1e-12 ? NaN : (x * x - 1) / (x - 1); }, a: 1, box: { x0: -0.5, x1: 2.5, y0: -0.5, y1: 4 }, expect: '可去间断（左右极限相等）' };
    },
    limAt: function (t, h, sg) {               // 单侧极限估计：h、h/2、h/4 三点两步外推（对线性解析精确，步长无关）
      var S = this.spec(t), y1 = S.f(S.a + sg * h), y2 = S.f(S.a + sg * h / 2), y3 = S.f(S.a + sg * h / 4);
      if (!isFinite(y1) || !isFinite(y2) || !isFinite(y3)) return null;
      var E1 = y2 + (y2 - y1), E2 = y3 + (y3 - y2);
      return { v: E2, stable: Math.abs(E2 - E1) < 1e-6, spread: Math.max(y1, y2, y3) - Math.min(y1, y2, y3) };
    },
    classify: function (t, h) {                // 只看数值行为，不看 expect
      var S = this.spec(t), d = S.f(S.a);
      var mA = Math.abs(S.f(S.a - 1e-6)), mB = Math.abs(S.f(S.a + 1e-6));   // 无穷判据：1e-6 处 >1e4
      if (!isFinite(mA) || !isFinite(mB) || mA > 1e4 || mB > 1e4) return '无穷间断（一侧或两侧发散）';
      var A = this.limAt(t, h, -1), B = this.limAt(t, h, 1);
      if (!A || !B) return '无穷间断（一侧或两侧发散）';
      if (!A.stable || !B.stable || A.spread > 0.5 || B.spread > 0.5) return '振荡间断（极限不存在）';   // 阈值 0.5：外推不稳或窗口内极差过大
      if (Math.abs(A.v - B.v) < 1e-6) return (isFinite(d) && Math.abs(d - A.v) < 1e-9) ? '连续' : '可去间断（左右极限相等）';
      return '跳跃间断（左右极限不等）';
    },
    draw: function (v, s) {
      var P = pal(), S = this.spec(s.t), h = s.x, bx = S.box;
      v.x0 = bx.x0; v.x1 = bx.x1; v.y0 = bx.y0; v.y1 = bx.y1;
      v.axes();
      v.line(S.a, v.y0, S.a, v.y1, { color: P.grid, w: 1.2, dash: [4, 4] });
      v.fn(S.f, { color: P.curve, w: 2.3 });
      var yl = S.f(S.a - h), yr = S.f(S.a + h);
      if (isFinite(yl)) { v.dot(S.a - h, yl, { color: P.curve3, r: 4 }); v.text(S.a - h, yl, ' f(a−h)', { color: P.curve3, size: 11 }); }
      if (isFinite(yr)) { v.dot(S.a + h, yr, { color: P.curve4, r: 4 }); v.text(S.a + h, yr, ' f(a+h)', { color: P.curve4, size: 11 }); }
      if (isFinite(S.f(S.a))) v.dot(S.a, S.f(S.a), { color: P.dot, r: 4.5, ring: true });
      v.text(v.x0 + 0.06, v.y1 - 0.12, S.expect, { color: P.text, size: 11.5 });
    },
    read: function (s) {
      var S = this.spec(s.t), h = s.x, l = S.f(S.a - h), r = S.f(S.a + h), d = S.f(S.a);
      return [
        ['逼近步长 h', fmt(h)],
        ['f(a−h)（左侧）', isFinite(l) ? fmt(l) : '发散'],
        ['f(a+h)（右侧）', isFinite(r) ? fmt(r) : '发散'],
        ['两侧差 |f(a−h) − f(a+h)|', isFinite(l) && isFinite(r) ? fmt(Math.abs(l - r)) : '—'],
        ['左 / 右极限估计（外推）', (function (A, B) { return (A ? fmt(A.v) : '发散') + ' / ' + (B ? fmt(B.v) : '发散'); })(this.limAt(s.t, h, -1), this.limAt(s.t, h, 1))],
        ['f(a) 是否有定义', isFinite(d) ? fmt(d) : '无定义'],
        ['按数值行为分类', this.classify(s.t, h)],
        ['该类型的标准结论', S.expect]
      ];
    },
    assert: function () {
      var L = this, out = [], exp = {}, bad = [], bad2 = [];
      ['rem', 'jump', 'inf', 'osc'].forEach(function (t) { exp[t] = L.spec(t).expect; });
      /* 断言 1：四类判据与解析分类一致（h=0.3） */
      Object.keys(exp).forEach(function (t) { var c = L.classify(t, 0.3); if (c !== exp[t]) bad.push(t + '→' + c); });
      out.push({ name: 'discont: 四类数值判据 = 解析分类（h=0.3）', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
      /* 断言 2：分类对步长不敏感（0.5 / 0.05 / 0.005） */
      Object.keys(exp).forEach(function (t) { [0.5, 0.05, 0.005].forEach(function (h) { if (L.classify(t, h) !== exp[t]) bad2.push(t + '@h=' + h); }); });
      out.push({ name: 'discont: 分类对步长不敏感（0.5/0.05/0.005）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：可去型 —— a 处无定义、左右极限估计之差 <1e-9（阈值 1e-9） */
      var S1 = L.spec('rem'), LA = L.limAt('rem', 0.3, -1), LB = L.limAt('rem', 0.3, 1), dl = Math.abs(LA.v - LB.v);
      out.push({ name: 'discont: 可去型 f(1) 无定义且左右极限估计之差 <1e-9', ok: !isFinite(S1.f(1)) && dl < 1e-9, detail: 'f(1)=' + S1.f(1) + ' |L−−L+|=' + dl.toExponential(2) + ' L=' + fmt(LA.v) });
      /* 断言 4：跳跃型两侧差恒为 2（阈值 1e-12） */
      var S2 = L.spec('jump'), dj = Math.abs(S2.f(-1e-9) - S2.f(1e-9));
      out.push({ name: 'discont: 跳跃型两侧差恒为 2（阈值 1e-12）', ok: Math.abs(dj - 2) < 1e-12, detail: 'diff=' + dj });
      /* 断言 5：振荡型在 (0,1e-4) 内极差 >1.9 且 |f| ≤ 1（极限不存在但有界） */
      var S3 = L.spec('osc'), mx = -2, mn = 2, i;
      for (i = 0; i < 5000; i++) { var x = 1e-4 * (i + 0.5) / 5000, y = S3.f(x); if (y > mx) mx = y; if (y < mn) mn = y; }
      out.push({ name: 'discont: 振荡型 (0,1e-4) 极差 >1.9 且 |f|≤1', ok: (mx - mn) > 1.9 && mx <= 1 && mn >= -1, detail: 'range=[' + mn.toFixed(3) + ',' + mx.toFixed(3) + ']' });
      /* 断言 6：无穷型 |f(±1e-5)| >1e4（阈值 1e4） */
      var S4 = L.spec('inf');
      out.push({ name: 'discont: 无穷型 |f(±1e-5)| >1e4（阈值 1e4）', ok: Math.abs(S4.f(1e-5)) > 1e4 && Math.abs(S4.f(-1e-5)) > 1e4, detail: 'f(1e-5)=' + S4.f(1e-5) });
      return out;
    }
  });

  /* ⑤ f 与 f′ 同步（第 3 章） */
  lab({
    id: 'fprime', ch: '03', title: 'f 与 f′ 同步：斜率就是高度',
    sub: '拖 x₀：左图在 f 上画出切线，右图在 f′ 上点亮同一横坐标处的高度——它们是同一个数。',
    tex: "f'(x_0)=\\lim_{h\\to0}\\frac{f(x_0+h)-f(x_0-h)}{2h}",
    note: 'f′ 图的高度 = f 图的切线斜率。f′ 穿零变号处是极值；f′ 的正负就是 f 的升降。1/x 在整个定义域上无驻点。',
    panes: 2,
    view: { x0: -3, x1: 3, y0: -6, y1: 6, h: 300 },
    view2: { x0: -3, x1: 3, y0: -6, y1: 6, h: 300 },
    ctrls: [
      { k: 'f', label: '函数 f', type: 'sel', val: 'cubic', opts: [['cubic', 'x³ − 3x'], ['sin', 'sin x'], ['quart', 'x⁴/4 − x²'], ['recip', '1/x']] },
      { k: 'x0', label: '考察点 x₀', min: -2.5, max: 2.5, step: 0.01, val: 0.8 }
    ],
    f: function (s) {
      if (s.f === 'sin') return Math.sin;
      if (s.f === 'quart') return function (x) { return x * x * x * x / 4 - x * x; };
      if (s.f === 'recip') return function (x) { return x === 0 ? NaN : 1 / x; };
      return function (x) { return x * x * x - 3 * x; };
    },
    d: function (s) {
      if (s.f === 'sin') return Math.cos;
      if (s.f === 'quart') return function (x) { return x * x * x - 2 * x; };
      if (s.f === 'recip') return function (x) { return x === 0 ? NaN : -1 / (x * x); };
      return function (x) { return 3 * x * x - 3; };
    },
    draw: function (v, s) {
      var P = pal(), A = v[0], B = v[1], f = this.f(s), d = this.d(s), x0 = s.x0;
      A.x0 = B.x0 = -3; A.x1 = B.x1 = 3;
      if (s.f === 'recip') { A.y0 = B.y0 = -6; A.y1 = B.y1 = 6; }
      A.axes(); B.axes();
      A.fn(f, { color: P.curve, w: 2.3 });
      var k = d(x0);
      if (isFinite(k)) {
        A.line(A.x0, f(x0) - k * (x0 - A.x0), A.x1, f(x0) + k * (A.x1 - x0), { color: P.curve3, w: 1.8 });
        A.dot(x0, f(x0), { color: P.dot, r: 4.6 });
        A.line(x0, A.y0, x0, A.y1, { color: P.grid, w: 1, dash: [3, 4] });
      }
      A.text(A.x0 + 0.1, A.y1 - 0.5, '切线斜率 = ' + fmt(k), { color: P.curve3, size: 11.5 });
      B.fn(d, { color: P.curve2, w: 2.3 });
      var q = (f(x0 + 1e-4) - f(x0 - 1e-4)) / 2e-4;
      if (isFinite(q)) B.line(B.x0, q, B.x1, q, { color: P.curve4, w: 1.4, dash: [5, 4] });
      if (isFinite(k)) { B.dot(x0, k, { color: P.dot, r: 4.6 }); B.line(x0, B.y0, x0, B.y1, { color: P.grid, w: 1, dash: [3, 4] }); }
      B.text(B.x0 + 0.1, B.y1 - 0.5, 'f′ 高度 = ' + fmt(k) + '，差商 = ' + fmt(q), { color: P.curve2, size: 11.5 });
    },
    read: function (s) {
      var f = this.f(s), d = this.d(s), x0 = s.x0, q = (f(x0 + 1e-4) - f(x0 - 1e-4)) / 2e-4, k = d(x0);
      return [
        ['x₀', fmt(x0)],
        ['f(x₀)', fmt(f(x0))],
        ['切线斜率（解析 f′）', fmt(k)],
        ['中心差商 h=1e-4', fmt(q)],
        ['两者之差', fmt(Math.abs(k - q))],
        ['该点 f′ 符号 → f 的走向', sgnOf(k) > 0 ? '递增 ↗' : sgnOf(k) < 0 ? '递减 ↘' : '驻点（斜率 0）']
      ];
    },
    assert: function () {
      var L = this, out = [], i, maxd = 0, bad = [], bad2 = [], keys = ['cubic', 'sin', 'quart'];
      /* 断言 1：解析 f′ 与中心差商一致（20 点，阈值 1e-6） */
      ['cubic', 'sin', 'quart', 'recip'].forEach(function (k) {
        var s = { f: k, x0: 0 }, f = L.f(s), d = L.d(s);
        for (i = -9; i <= 10; i++) { var x = i * 0.25 + 0.13; if (Math.abs(x) < 0.3) continue; var dd = Math.abs(d(x) - (f(x + 1e-4) - f(x - 1e-4)) / 2e-4); if (dd > maxd) maxd = dd; }
      });
      out.push({ name: 'fprime: 解析 f′ ≡ 中心差商（阈值 1e-6）', ok: maxd < 1e-6, detail: 'maxdiff=' + maxd.toExponential(2) });
      /* 断言 2：驻点处 f′≈0 且 f 取极值，类型由 f″ 决定（阈值 1e-9 / 1e-6） */
      keys.forEach(function (k) {
        var s = { f: k, x0: 0 }, f = L.f(s), d = L.d(s);
        roots(d, -2.5, 2.5, 400).forEach(function (r) {
          if (!(Math.abs(d(r)) < 1e-9)) { bad.push(k + '@' + r.toFixed(4) + ' f′=' + d(r)); return; }
          var d2 = (d(r + 1e-5) - d(r - 1e-5)) / 2e-5, lo = f(r - 0.05), hi = f(r + 0.05), mid = f(r);
          if (d2 > 1e-9 && !(mid < lo && mid < hi)) bad.push(k + '@' + r.toFixed(4) + ' f″>0 但不是极小');
          if (d2 < -1e-9 && !(mid > lo && mid > hi)) bad.push(k + '@' + r.toFixed(4) + ' f″<0 但不是极大');
        });
      });
      out.push({ name: 'fprime: 驻点 f′≈0 且 f″ 判定与数值极值一致（阈值 1e-9）', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
      /* 断言 3：f′ 的符号 = f 的升降方向（30 点，阈值 1e-9） */
      keys.forEach(function (k) {
        var s = { f: k, x0: 0 }, f = L.f(s), d = L.d(s);
        for (i = -14; i <= 15; i++) {
          var x = i * 0.18; if (Math.abs(x) < 0.25) continue;
          var sg1 = sgnOf(d(x), 1e-6), sg2 = sgnOf(f(x + 1e-3) - f(x - 1e-3), 1e-9);
          if (sg1 !== 0 && sg2 !== 0 && sg1 !== sg2) bad2.push(k + '@' + x.toFixed(2));
        }
      });
      out.push({ name: 'fprime: f′ 符号与 f 升降方向一致（30 点）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 4：1/x 无驻点（解析：f′=−1/x² 恒负） */
      var sd = L.d({ f: 'recip', x0: 1 });
      out.push({ name: 'fprime: 1/x 无驻点（f′ 恒负，阈值 1e-9）', ok: roots(sd, -2.5, 2.5, 400).length === 0 && sd(1) < 0, detail: 'roots=' + roots(sd, -2.5, 2.5, 400).length });
      return out;
    }
  });

  /* ⑥ 不可导点放大镜（第 3 章） */
  lab({
    id: 'nondiff', ch: '03', title: '不可导点放大镜：差商去哪儿了',
    sub: '拖放大倍数 1/h：左右差商是收敛到同一个数、还是分裂成两个、还是一去不返？',
    tex: "\\lim_{h\\to0^+}\\frac{f(a+h)-f(a)}{h}\\quad\\text{与}\\quad\\lim_{h\\to0^-}\\frac{f(a+h)-f(a)}{h}",
    note: '尖点：左右差商分别趋于 ±1；垂直切线：差商发散（没有有限斜率）；可去间断：差商其实收敛，但函数在该点不连续；振荡：差商连极限都没有。可导 ⇒ 连续，反之不成立。',
    view: { x0: -1.6, x1: 1.6, y0: -1.6, y1: 1.6, h: 300 },
    ctrls: [
      { k: 't', label: '类型', type: 'sel', val: 'cusp', opts: [['cusp', '尖点：|x|，a=0'], ['vtan', '垂直切线：∛x，a=0'], ['rem', '间断：(x²−1)/(x−1)，a=1'], ['osc', '振荡：x·sin(1/x)，a=0']] },
      { k: 'z', label: '放大倍数', min: 0, max: 8, step: 0.05, val: 2 }
    ],
    spec: function (t) {
      if (t === 'vtan') return { f: function (x) { return Math.cbrt(x); }, a: 0, box: { x0: -1.2, x1: 1.2, y0: -1.4, y1: 1.4 }, expect: '垂直切线：差商发散（不可导）' };
      if (t === 'rem') return { f: function (x) { return Math.abs(x - 1) < 1e-12 ? NaN : x + 1; }, a: 1, box: { x0: -0.4, x1: 2.4, y0: -0.3, y1: 3 }, expect: '可去间断：差商收敛但函数不连续（不可导）' };
      if (t === 'osc') return { f: function (x) { return x === 0 ? 0 : x * Math.sin(1 / x); }, a: 0, box: { x0: -0.5, x1: 0.5, y0: -0.5, y1: 0.5 }, expect: '振荡：差商无极限（不可导）' };
      return { f: Math.abs, a: 0, box: { x0: -1.4, x1: 1.4, y0: -0.4, y1: 1.4 }, expect: '尖点：左右差商分别为 −1 与 +1（不可导）' };
    },
    h: function (s) { return Math.pow(10, -s.z); },
    verdict: function (t, h) {                 // 只看数值行为：先判发散（差商随 h 缩小按幂律放大），再判稳定
      var S = this.spec(t), ql = qside(S.f, S.a, h, -1), qr = qside(S.f, S.a, h, 1);
      var ql2 = qside(S.f, S.a, h / 10, -1), qr2 = qside(S.f, S.a, h / 10, 1);
      var ql3 = qside(S.f, S.a, h / 100, -1), qr3 = qside(S.f, S.a, h / 100, 1);
      var grow = Math.abs(ql2) > 3 * Math.abs(ql) && Math.abs(ql3) > 3 * Math.abs(ql2) &&
                 Math.abs(qr2) > 3 * Math.abs(qr) && Math.abs(qr3) > 3 * Math.abs(qr2);
      var stable = Math.abs(ql2 - ql) < 0.05 && Math.abs(qr2 - qr) < 0.05;
      if (grow) return '垂直切线（差商发散：|q| 每缩 10 倍放大约 ' + fmt(Math.abs(ql2 / ql)) + ' 倍）';
      if (!stable) return '振荡（h 再缩 10 倍差商就变了，无极限）';
      if (Math.abs(ql2 - qr2) > 0.5) return '尖点（左右差商不等，阈值 0.5）';
      if (!isFinite(S.f(S.a))) return '可去间断（差商收敛但函数值不存在）';
      return '可导（左右差商相等且稳定）';
    },
    draw: function (v, s) {
      var P = pal(), S = this.spec(s.t), h = this.h(s), bx = S.box;
      v.x0 = bx.x0; v.x1 = bx.x1; v.y0 = bx.y0; v.y1 = bx.y1;
      v.axes();
      v.fn(S.f, { color: P.curve, w: 2.3 });
      var xl = S.a - h, xr = S.a + h, yl = S.f(xl), yr = S.f(xr);
      if (isFinite(yl) && isFinite(yr)) v.line(xl, yl, xr, yr, { color: P.curve3, w: 1.9 });   // 割线
      if (isFinite(yl)) v.dot(xl, yl, { color: P.curve3, r: 4 });
      if (isFinite(yr)) v.dot(xr, yr, { color: P.curve3, r: 4 });
      v.line(S.a, v.y0, S.a, v.y1, { color: P.grid, w: 1, dash: [3, 4] });
      v.text(v.x0 + 0.05, v.y1 - 0.15, S.expect, { color: P.text, size: 11.5 });
    },
    read: function (s) {
      var S = this.spec(s.t), h = this.h(s);
      var ql = qside(S.f, S.a, h, -1), qr = qside(S.f, S.a, h, 1);
      var ql2 = qside(S.f, S.a, h / 10, -1), qr2 = qside(S.f, S.a, h / 10, 1);
      return [
        ['放大倍数 1/h = 10^z', fmt(1 / h)],
        ['左差商（单侧）', fmt(ql)],
        ['右差商（单侧）', fmt(qr)],
        ['两侧差 |左−右|', fmt(Math.abs(ql - qr))],
        ['h 缩 10 倍后：左 / 右', fmt(ql2) + ' / ' + fmt(qr2)],
        ['数值判定', this.verdict(s.t, h)],
        ['该类型的标准结论', S.expect]
      ];
    },
    assert: function () {
      var L = this, out = [], h = 1e-6;
      /* 断言 1：尖点左右差商 = ∓1（阈值 1e-6） */
      var Sc = L.spec('cusp'), ql = qside(Sc.f, 0, h, -1), qr = qside(Sc.f, 0, h, 1);
      out.push({ name: 'nondiff: 尖点左右差商 = −1 / +1（阈值 1e-6）', ok: Math.abs(ql + 1) < 1e-6 && Math.abs(qr - 1) < 1e-6, detail: 'ql=' + ql + ' qr=' + qr });
      /* 断言 2：垂直切线差商发散（h=1e-8 时 >1e3） */
      var Sv = L.spec('vtan'), qv = Math.abs(qside(Sv.f, 0, 1e-8, 1));
      out.push({ name: 'nondiff: 垂直切线差商发散（h=1e-8 时 >1e3）', ok: qv > 1e3, detail: 'q=' + qv.toExponential(3) });
      /* 断言 3：可去间断的差商收敛到 1（阈值 1e-4）但 f(a) 无定义 */
      var Sr = L.spec('rem'), qa = qside(Sr.f, 1, 1e-6, -1), qb = qside(Sr.f, 1, 1e-6, 1);
      out.push({ name: 'nondiff: 可去间断差商 →1（阈值 1e-4）且 f(a) 无定义', ok: Math.abs(qa - 1) < 1e-4 && Math.abs(qb - 1) < 1e-4 && !isFinite(Sr.f(1)), detail: 'ql=' + qa + ' qr=' + qb + ' f(1)=' + Sr.f(1) });
      /* 断言 4：振荡型差商不稳定（h 从 1e-3 缩到 1e-6，左右差商极差 >0.1） */
      var So = L.spec('osc'), qs = [];
      [1e-3, 1e-4, 1e-5, 1e-6].forEach(function (h) { qs.push(qside(So.f, 0, h, -1), qside(So.f, 0, h, 1)); });
      var spread = Math.max.apply(null, qs) - Math.min.apply(null, qs);
      out.push({ name: 'nondiff: 振荡型差商不稳定（h 从 1e-3 缩到 1e-6，差商极差 >0.1）', ok: spread > 0.1, detail: 'spread=' + fmt(spread) + ' q(1e-3)=' + fmt(qs[0]) + ' q(1e-6)=' + fmt(qs[7]) });
      /* 断言 5：四类数值判定与标准结论一一对应 */
      var bad = [];
      ['cusp', 'vtan', 'rem', 'osc'].forEach(function (t) {
        var S = L.spec(t);
        var got = L.verdict(t, 1e-3);
        var head = S.expect.split('：')[0];
        if (got.indexOf(head) !== 0 && !(head === '可去间断' && got.indexOf('可去间断') === 0)) bad.push(t + '→' + got);
      });
      out.push({ name: 'nondiff: 四类数值判定与标准结论一致（h=1e-3）', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
      return out;
    }
  });

  /* ⑦ 图像分析器（第 4 章） */
  lab({
    id: 'analyze', ch: '04', title: '图像分析器：f′ 与 f″ 的符号带',
    sub: '顶部两条色带分别是 f′ 与 f″ 的符号：f′ > 0 的区间 f 递增，f″ > 0 的区间 f 向上弯（凹）。极值点与拐点在图上打点。',
    tex: "f'>0\\Rightarrow\\text{递增},\\qquad f''>0\\Rightarrow\\text{凹（上弯）}",
    note: '极值点看 f′ 穿零变号（f″ 定类型），拐点看 f″ 穿零变号。色带与曲线共用同一横坐标，所以"为什么这里变平/变弯"一眼可见。',
    view: { x0: -3, x1: 3, y0: -6, y1: 6, h: 320 },
    ctrls: [
      { k: 'f', label: '函数', type: 'sel', val: 'cubic', opts: [['cubic', 'x³ − 3x'], ['quart', 'x⁴/4 − x²'], ['quint', 'x⁵/5 − x³ + x']] },
      { k: 'x', label: '考察点 x₀', min: -3, max: 3, step: 0.01, val: 0.5 }
    ],
    f: function (s) {
      if (s.f === 'quart') return function (x) { return x * x * x * x / 4 - x * x; };
      if (s.f === 'quint') return function (x) { return x * x * x * x * x / 5 - x * x * x + x; };
      return function (x) { return x * x * x - 3 * x; };
    },
    d1: function (s) {
      if (s.f === 'quart') return function (x) { return x * x * x - 2 * x; };
      if (s.f === 'quint') return function (x) { return x * x * x * x - 3 * x * x + 1; };
      return function (x) { return 3 * x * x - 3; };
    },
    d2: function (s) {
      if (s.f === 'quart') return function (x) { return 3 * x * x - 2; };
      if (s.f === 'quint') return function (x) { return 4 * x * x * x - 6 * x; };
      return function (x) { return 6 * x; };
    },
    uniq: function (a) {                       // 去重：roots 在“采样点正好落在零点”时会给出重复根（阈值 1e-6）
      var o = [], i, j;
      for (i = 0; i < a.length; i++) { var dup = false; for (j = 0; j < o.length; j++) if (Math.abs(a[i] - o[j]) < 1e-6) dup = true; if (!dup) o.push(a[i]); }
      return o;
    },
    extrema: function (s) { return this.uniq(roots(this.d1(s), -3, 3, 600)); },
    inflect: function (s) { return this.uniq(roots(this.d2(s), -3, 3, 600)); },
    monoStr: function (s) {
      var d1 = this.d1(s), xs = [-3].concat(this.extrema(s)).concat([3]), o = [], i;
      for (i = 0; i < xs.length - 1; i++) {
        if (xs[i + 1] - xs[i] < 1e-6) continue;
        o.push('[' + fmt(xs[i]) + ', ' + fmt(xs[i + 1]) + '] ' + (sgnOf(d1((xs[i] + xs[i + 1]) / 2)) > 0 ? '递增' : '递减'));
      }
      return o.join('；');
    },
    concStr: function (s) {
      var d2 = this.d2(s), xs = [-3].concat(this.inflect(s)).concat([3]), o = [], i;
      for (i = 0; i < xs.length - 1; i++) {
        if (xs[i + 1] - xs[i] < 1e-6) continue;
        o.push('[' + fmt(xs[i]) + ', ' + fmt(xs[i + 1]) + '] ' + (sgnOf(d2((xs[i] + xs[i + 1]) / 2)) > 0 ? '凹（上弯）' : '凸（下弯）'));
      }
      return o.join('；');
    },
    kind: function (s) {
      var d1 = this.d1(s), d2 = this.d2(s), x = s.x, a = d1(x), b = d2(x);
      if (sgnOf(a) === 0) return sgnOf(b) > 0 ? '极小值点（f′=0, f″>0）' : sgnOf(b) < 0 ? '极大值点（f′=0, f″<0）' : '驻点且 f″=0（需更高阶判断）';
      if (sgnOf(b) === 0) return '拐点候选（f″=0，且 f″ 变号才是拐点）';
      return sgnOf(a) > 0 ? '递增' + (sgnOf(b) > 0 ? '且凹' : '且凸') : '递减' + (sgnOf(b) > 0 ? '且凹' : '且凸');
    },
    draw: function (v, s) {
      var P = pal(), f = this.f(s), d1 = this.d1(s), d2 = this.d2(s), i, ext = this.extrema(s), inf = this.inflect(s);
      v.axes();
      var top1 = v.y1 - 0.42, top2 = v.y1 - 1.05, th = 0.4;
      for (i = 0; i < 180; i++) {
        var xa = v.x0 + (v.x1 - v.x0) * i / 180, xb = v.x0 + (v.x1 - v.x0) * (i + 1) / 180, xm = (xa + xb) / 2;
        v.rect(xa, top1 - th, xb, top1, { fill: sgnOf(d1(xm)) > 0 ? P.fill : P.fill2 });
        v.rect(xa, top2 - th, xb, top2, { fill: sgnOf(d2(xm)) > 0 ? P.fill3 : P.fill2 });
      }
      v.text(v.x0 + 0.08, top1 + 0.18, 'f′ 符号带（+ 递增 / − 递减）', { color: P.muted, size: 11 });
      v.text(v.x0 + 0.08, top2 + 0.18, 'f″ 符号带（+ 凹 / − 凸）', { color: P.muted, size: 11 });
      v.fn(f, { color: P.curve, w: 2.3 });
      ext.forEach(function (r) { v.dot(r, f(r), { color: P.curve3, r: 4.4 }); });
      inf.forEach(function (r) { v.dot(r, f(r), { color: P.curve4, r: 4.4, ring: true }); });
      v.line(s.x, v.y0, s.x, v.y1, { color: P.grid, w: 1, dash: [3, 4] });
      v.dot(s.x, f(s.x), { color: P.dot, r: 4.6 });
    },
    read: function (s) {
      var d1 = this.d1(s), d2 = this.d2(s), a = d1(s.x), b = d2(s.x);
      return [
        ['x₀ / f(x₀)', fmt(s.x) + ' / ' + fmt(this.f(s)(s.x))],
        ['f′(x₀) 及符号', fmt(a) + (sgnOf(a) > 0 ? '（+）递增' : sgnOf(a) < 0 ? '（−）递减' : '（0）驻点')],
        ['f″(x₀) 及符号', fmt(b) + (sgnOf(b) > 0 ? '（+）凹' : sgnOf(b) < 0 ? '（−）凸' : '（0）拐点候选')],
        ['该点性质', this.kind(s)],
        ['单调区间', this.monoStr(s)],
        ['凹凸区间', this.concStr(s)],
        ['极值点 x', this.extrema(s).map(function (r) { return fmt(r); }).join(', ') || '无'],
        ['拐点 x', this.inflect(s).map(function (r) { return fmt(r); }).join(', ') || '无']
      ];
    },
    assert: function () {
      var L = this, out = [], keys = ['cubic', 'quart', 'quint'], bad = [], bad2 = [], bad3 = [];
      /* 断言 1：驻点处 f′=0（阈值 1e-9）且 f″ 的符号与数值极值类型一致（阈值 1e-9） */
      keys.forEach(function (k) {
        var s = { f: k, x: 0 }, f = L.f(s), d1 = L.d1(s), d2 = L.d2(s), got = L.extrema(s);
        if (k === 'cubic' && got.length !== 2) bad.push('cubic 应有 2 个驻点，实得 ' + got.length);
        got.forEach(function (r) {
          if (Math.abs(d1(r)) > 1e-9) { bad.push(k + '@' + r.toFixed(4) + ' f′=' + d1(r)); return; }
          var lo = f(r - 0.03), hi = f(r + 0.03), mid = f(r), t = d2(r);
          if (t > 1e-9 && !(mid < lo && mid < hi)) bad.push(k + '@' + r.toFixed(4) + ' f″>0 但非极小');
          if (t < -1e-9 && !(mid > lo && mid > hi)) bad.push(k + '@' + r.toFixed(4) + ' f″<0 但非极大');
        });
      });
      out.push({ name: 'analyze: 极值点 f′≈0（1e-9）且 f″ 判定与数值一致', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
      /* 断言 2：拐点处 f″=0（阈值 1e-9）且 f″ 在其两侧异号 */
      keys.forEach(function (k) {
        var s = { f: k, x: 0 }, d2 = L.d2(s);
        L.inflect(s).forEach(function (r) {
          var a = d2(r - 1e-3), b = d2(r + 1e-3);
          if (Math.abs(d2(r)) > 1e-9) bad2.push(k + '@' + r.toFixed(4) + ' f″=' + d2(r));
          if (!(a < 0 && b > 0) && !(a > 0 && b < 0)) bad2.push(k + '@' + r.toFixed(4) + ' f″ 未变号');
        });
      });
      out.push({ name: 'analyze: 拐点 f″≈0（1e-9）且 f″ 两侧异号', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：每个单调区间内 f′ 符号恒定（每区间 20 点，阈值 1e-9） */
      keys.forEach(function (k) {
        var s = { f: k, x: 0 }, d1 = L.d1(s), xs = [-3].concat(L.extrema(s)).concat([3]), i, j;
        for (i = 0; i < xs.length - 1; i++) {
          if (xs[i + 1] - xs[i] < 1e-3) continue;
          var sgn0 = null;
          for (j = 0; j <= 20; j++) {
            var x = xs[i] + (xs[i + 1] - xs[i]) * j / 20, sg = sgnOf(d1(x), 1e-9);
            if (sg === 0) continue;
            if (sgn0 === null) sgn0 = sg; else if (sg !== sgn0) bad3.push(k + ' [' + xs[i].toFixed(2) + ',' + xs[i + 1].toFixed(2) + '] 符号翻转');
          }
        }
      });
      out.push({ name: 'analyze: 各单调区间内 f′ 符号恒定（阈值 1e-9）', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4：x⁵/5 − x³ + x 的驻点应为 4 个（解析：x⁴−3x²+1=0） */
      var s5 = { f: 'quint', x: 0 };
      out.push({ name: 'analyze: quint 驻点 4 个（x⁴−3x²+1=0 的四个根）', ok: L.extrema(s5).length === 4, detail: 'n=' + L.extrema(s5).length });
      return out;
    }
  });

  /* ⑧ 微积分基本定理（第 5 章） */
  lab({
    id: 'ftc', ch: '05', title: '微积分基本定理：面积函数的斜率',
    sub: '左图阴影是 ∫ₐˣ f(t)dt；右图把这块面积当作 x 的函数画出来——它在每一点的斜率正好等于 f(x)。',
    tex: "F(x)=\\int_a^x f(t)\\,dt\\;\\Longrightarrow\\;F'(x)=f(x)",
    note: '下限 a 可拖动。面积"累积得多快"就是 f 的高度，所以 F′ = f：求导与求面积互为逆运算。',
    panes: 2,
    view: { x0: -2, x1: 3, y0: -0.6, y1: 4.2, h: 300 },
    view2: { x0: -2, x1: 3, y0: -2.5, y1: 4.5, h: 300 },
    ctrls: [
      { k: 'f', label: '被积函数 f', type: 'sel', val: 'sq', opts: [['sq', 't²'], ['sin', 'sin t'], ['gauss', 'e^(−t²)'], ['ratio', '1/(1+t²)']] },
      { k: 'a', label: '下限 a', min: -2, max: 1, step: 0.05, val: 0 },
      { k: 'x', label: '上限 x', min: -1.5, max: 3, step: 0.01, val: 1.5 }
    ],
    f: function (s) {
      if (s.f === 'sin') return Math.sin;
      if (s.f === 'gauss') return function (t) { return Math.exp(-t * t); };
      if (s.f === 'ratio') return function (t) { return 1 / (1 + t * t); };
      return function (t) { return t * t; };
    },
    anti: function (s) {                        // 初等原函数（没有则返回 null）
      if (s.f === 'sin') return function (t) { return -Math.cos(t); };
      if (s.f === 'ratio') return Math.atan;
      if (s.f === 'sq') return function (t) { return t * t * t / 3; };
      return null;
    },
    I: function (s, a, x, n) {                  // ∫ₐˣ f：Simpson，自动处理 a>x 的符号
      var lo = Math.min(a, x), hi = Math.max(a, x), v = simpson(this.f(s), lo, hi, n || 2000);
      return a <= x ? v : -v;
    },
    ref: function (s, a, x) {                   // 参考值：闭式原函数差，否则 n=200000 的 Simpson
      var A = this.anti(s);
      if (A) return A(x) - A(a);
      return this.I(s, a, x, 200000);
    },
    draw: function (v, s) {
      var P = pal(), A = v[0], B = v[1], f = this.f(s), a = s.a, x = s.x, i;
      A.axes();
      shadeArea(A, f, Math.min(a, x), Math.max(a, x), P.fill2, 200);
      A.fn(f, { color: P.curve, w: 2.3 });
      A.line(a, A.y0, a, A.y1, { color: P.curve3, w: 1.4, dash: [5, 3] });
      A.line(x, A.y0, x, A.y1, { color: P.curve4, w: 1.4, dash: [5, 3] });
      A.text(a, A.y0 + 0.25, ' a', { color: P.curve3, size: 11.5 });
      A.text(x, A.y0 + 0.25, ' x', { color: P.curve4, size: 11.5 });
      A.text(A.x0 + 0.08, A.y1 - 0.3, '阴影面积 = F(x) = ' + fmt(this.I(s, a, x, 400)), { color: P.text, size: 11.5 });
      B.axes();
      var pts = [], n = 160;
      for (i = 0; i <= n; i++) { var t = B.x0 + (B.x1 - B.x0) * i / n; pts.push([t, this.I(s, a, t, 200)]); }
      B.poly(pts, { stroke: P.curve2, w: 2.3 });
      var Fx = this.I(s, a, x, 2000), k = f(x);
      if (isFinite(k)) B.line(B.x0, Fx - k * (x - B.x0), B.x1, Fx + k * (B.x1 - x), { color: P.curve3, w: 1.6, dash: [6, 4] });
      B.dot(x, Fx, { color: P.dot, r: 4.6 });
      B.line(x, B.y0, x, B.y1, { color: P.grid, w: 1, dash: [3, 4] });
      B.text(B.x0 + 0.08, B.y1 - 0.32, 'F(x) 与它在 x 处的切线（斜率 = f(x) = ' + fmt(k) + '）', { color: P.muted, size: 11.5 });
    },
    read: function (s) {
      var a = s.a, x = s.x, Fx = this.I(s, a, x, 2000), R = this.ref(s, a, x);
      var h = 1e-4, dF = (this.I(s, a, x + h, 2000) - this.I(s, a, x - h, 2000)) / (2 * h);
      var da = (this.I(s, a + h, x, 2000) - this.I(s, a - h, x, 2000)) / (2 * h);
      return [
        ['a / x', fmt(a) + ' / ' + fmt(x)],
        ['F(x) = ∫ₐˣ f（Simpson n=2000）', fmt(Fx)],
        ['参考值（闭式原函数，或无初等原函数时 n=200000）', fmt(R)],
        ['两者之差', fmt(Math.abs(Fx - R))],
        ['F′(x)（对积分做中心差分 h=1e-4）', fmt(dF)],
        ['f(x)', fmt(this.f(s)(x))],
        ['F′(x) − f(x)', fmt(Math.abs(dF - this.f(s)(x)))],
        ['∂F/∂a（应为 −f(a)）', fmt(da) + ' 与 ' + fmt(-this.f(s)(a))]
      ];
    },
    assert: function () {
      var L = this, out = [], keys = ['sq', 'sin', 'gauss', 'ratio'], bad = [], bad2 = [], bad3 = [], bad4 = [];
      /* 断言 1：Simpson(n=2000) 与参考值之差 <1e-6（验收条款；gauss 的参考值是 n=200000 的 Simpson） */
      keys.forEach(function (k) {
        var s = { f: k }; [[0, 1.5], [-1, 2.2], [0.5, 3]].forEach(function (p) {
          var d = Math.abs(L.I(s, p[0], p[1], 2000) - L.ref(s, p[0], p[1]));
          if (!(d < 1e-6)) bad.push(k + ' [' + p + '] 差=' + d.toExponential(2));
        });
      });
      out.push({ name: 'ftc: F(x) 与参考值误差 <1e-6（4 函数 × 3 区间）', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
      /* 断言 2：F′(x) = f(x)（中心差分 h=1e-4，阈值 1e-6） */
      keys.forEach(function (k) {
        var s = { f: k }, f = L.f(s);
        [-1, 0.3, 1.2, 2.4].forEach(function (x) {
          var h = 1e-4, d = Math.abs((L.I(s, 0, x + h, 2000) - L.I(s, 0, x - h, 2000)) / (2 * h) - f(x));
          if (!(d < 1e-6)) bad2.push(k + '@x=' + x + ' 差=' + d.toExponential(2));
        });
      });
      out.push({ name: 'ftc: F′(x) − f(x) < 1e-6（4 函数 × 4 点）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：区间可加性 ∫ₐˣ = ∫ₐᵇ + ∫ᵇˣ（阈值 1e-9） */
      keys.forEach(function (k) {
        var s = { f: k }, d = Math.abs(L.I(s, -1, 2.4, 2000) - (L.I(s, -1, 0.7, 2000) + L.I(s, 0.7, 2.4, 2000)));
        if (!(d < 1e-9)) bad3.push(k + ' 差=' + d.toExponential(2));
      });
      out.push({ name: 'ftc: 区间可加性误差 <1e-9', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4：对下限求导 = −f(a)（阈值 1e-6） */
      keys.forEach(function (k) {
        var s = { f: k }, f = L.f(s), a = 0.4, h = 1e-4;
        var d = Math.abs((L.I(s, a + h, 2, 2000) - L.I(s, a - h, 2, 2000)) / (2 * h) + f(a));
        if (!(d < 1e-6)) bad4.push(k + ' 差=' + d.toExponential(2));
      });
      out.push({ name: 'ftc: ∂/∂a ∫ₐˣ f = −f(a)（阈值 1e-6）', ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
      return out;
    }
  });

  /* ⑨ 定积分的性质（第 6 章） */
  lab({
    id: 'intprops', ch: '06', title: '定积分的性质：对称·可加·保号',
    sub: '选一条性质看面积怎么拼：偶函数左右两块相等、奇函数左右相消、区间拼接不重不漏、f 不变号则积分不变号。',
    tex: "\\int_{-a}^{a}f=2\\int_{0}^{a}f\\;(f\\text{ 偶}),\\qquad \\int_a^c=\\int_a^b+\\int_b^c",
    note: 'a 是半宽/上限，b 是分点。保号性说的是"f 在区间上不变号 ⇒ 积分同号"，一旦变号就什么都不能断言。',
    view: { x0: -2.2, x1: 2.2, y0: -2.4, y1: 2.4, h: 320 },
    ctrls: [
      { k: 'p', label: '性质', type: 'sel', val: 'even', opts: [['even', '偶函数对称：∫₋ₐᵃ = 2∫₀ᵃ'], ['odd', '奇函数抵消：∫₋ₐᵃ = 0'], ['add', '区间可加：∫₋ₐᵃ = ∫₋ₐ^b + ∫_b^a'], ['sign', '保号性：f 不变号 ⇒ 积分同号']] },
      { k: 'a', label: 'a（半宽 / 上限）', min: 0.2, max: 2, step: 0.05, val: 1.4 },
      { k: 'b', label: '分点 b', min: -1.8, max: 1.8, step: 0.05, val: 0.6 }
    ],
    deal: function (s) {
      if (s.p === 'even') return { f: function (x) { return x * x; }, lo: -s.a, hi: s.a, label: '偶函数 x² 在 [−a, a]' };
      if (s.p === 'odd') return { f: function (x) { return x * x * x; }, lo: -s.a, hi: s.a, label: '奇函数 x³ 在 [−a, a]' };
      if (s.p === 'add') return { f: function (x) { return x * x + 1; }, lo: -s.a, hi: s.a, label: 'x² + 1 在 [−a, a]，在 b 处拆分' };
      return { f: function (x) { return x - s.b; }, lo: 0, hi: s.a, label: '(t − b) 在 [0, a]' };
    },
    signChange: function (D) {
      var mn = Math.min(D.f(D.lo), D.f(D.hi)), i;
      for (i = 0; i <= 40; i++) { var y = D.f(D.lo + (D.hi - D.lo) * i / 40); if (y < mn) mn = y; }
      return mn < 0 && Math.max(D.f(D.lo), D.f(D.hi)) > 0;
    },
    draw: function (v, s) {
      var P = pal(), D = this.deal(s);
      v.x0 = Math.min(-2.2, D.lo - 0.2); v.x1 = Math.max(2.2, D.hi + 0.2);
      v.axes();
      if (s.p === 'even') {
        shadeArea(v, D.f, -s.a, 0, P.fill2, 160);
        shadeArea(v, D.f, 0, s.a, P.fill3, 160);
      } else if (s.p === 'odd') {
        shadeArea(v, D.f, -s.a, 0, P.fill3, 160);
        shadeArea(v, D.f, 0, s.a, P.fill2, 160);
      } else if (s.p === 'add') {
        var c = Math.max(D.lo + 0.05, Math.min(D.hi - 0.05, s.b));
        shadeArea(v, D.f, D.lo, c, P.fill2, 140);
        shadeArea(v, D.f, c, D.hi, P.fill3, 140);
        v.line(c, v.y0, c, v.y1, { color: P.curve3, w: 1.6, dash: [5, 3] });
        v.text(c, v.y1 - 0.25, ' b', { color: P.curve3, size: 11.5 });
      } else {
        shadeArea(v, D.f, D.lo, D.hi, P.fill2, 160);
      }
      v.fn(D.f, { color: P.curve, w: 2.3 });
      v.line(v.x0, 0, v.x1, 0, { color: P.axis, w: 1.2 });
      v.text(v.x0 + 0.1, v.y1 - 0.25, D.label, { color: P.text, size: 11.5 });
    },
    read: function (s) {
      var D = this.deal(s), c = s.b, I = simpson(D.f, D.lo, D.hi, 4000), out;
      out = [['性质', D.label], ['区间', '[' + fmt(D.lo) + ', ' + fmt(D.hi) + ']'], ['∫（Simpson n=4000）', fmt(I)]];
      if (s.p === 'even') out.push(['∫₋ₐᵃ 与 2∫₀ᵃ 之差', fmt(Math.abs(I - 2 * simpson(D.f, 0, s.a, 4000)))]);
      else if (s.p === 'odd') out.push(['∫₋ₐᵃ（奇函数应为 0）', fmt(I)]);
      else if (s.p === 'add') out.push(['∫ₐ^b + ∫_b^a 与整体之差', fmt(Math.abs(I - (simpson(D.f, D.lo, c, 4000) + simpson(D.f, c, D.hi, 4000))))]);
      else out.push(['f 在区间上的最小 / 最大值', fmt(Math.min(D.f(D.lo), D.f(D.hi))) + ' / ' + fmt(Math.max(D.f(D.lo), D.f(D.hi)))]);
      out.push(['f 在区间上是否变号', this.signChange(D) ? '变号（保号性不适用）' : '不变号 → 积分与 f 同号']);
      if (s.p === 'even' || s.p === 'odd') out.push(['b 的作用', '当前性质不使用 b（切到“区间可加”或“保号性”才生效）']);
      out.push(['区间长度', fmt(D.hi - D.lo)]);
      return out;
    },
    sync: function (sec, s) {                  // 当前性质不用 b 时把 b 滑块灰掉（避免“拖了没反应”）
      var bEl = sec.querySelector('input[data-k="b"]'), box = bEl ? bEl.parentNode : null;
      var off = s.p !== 'add' && s.p !== 'sign';
      if (bEl) bEl.disabled = off;
      if (box) box.style.opacity = off ? '0.42' : '';
    },
    assert: function () {
      var L = this, out = [], bad = [], l2 = [], l3 = [];
      /* 断言 1：偶函数 ∫₋ₐᵃ = 2∫₀ᵃ（阈值 1e-9） */
      [0.4, 1.1, 2].forEach(function (a) {
        var s = { p: 'even', a: a, b: 0 }, D = L.deal(s), I = simpson(D.f, -a, a, 4000);
        if (Math.abs(I - 2 * simpson(D.f, 0, a, 4000)) > 1e-9) bad.push('a=' + a);
      });
      out.push({ name: 'intprops: 偶函数 ∫₋ₐᵃ = 2∫₀ᵃ（阈值 1e-9）', ok: bad.length === 0, detail: bad.join(',') || 'ok' });
      /* 断言 2：奇函数 ∫₋ₐᵃ = 0（阈值 1e-9） */
      [0.4, 1.1, 2].forEach(function (a) {
        var s = { p: 'odd', a: a, b: 0 }, D = L.deal(s);
        if (Math.abs(simpson(D.f, -a, a, 4000)) > 1e-9) l2.push('a=' + a + ' I=' + simpson(D.f, -a, a, 4000).toExponential(2));
      });
      out.push({ name: 'intprops: 奇函数 ∫₋ₐᵃ = 0（阈值 1e-9）', ok: l2.length === 0, detail: l2.join(',') || 'ok' });
      /* 断言 3：区间可加性（阈值 1e-9），三种拆分 */
      [[1.5, 0.3], [2, -1.2], [1.2, 0.9]].forEach(function (p) {
        var s = { p: 'add', a: p[0], b: p[1] }, D = L.deal(s), c = Math.max(D.lo + 0.05, Math.min(D.hi - 0.05, s.b));
        var d = Math.abs(simpson(D.f, D.lo, D.hi, 4000) - (simpson(D.f, D.lo, c, 4000) + simpson(D.f, c, D.hi, 4000)));
        if (d > 1e-9) l3.push('a=' + p[0] + ' b=' + p[1] + ' 差=' + d.toExponential(2));
      });
      out.push({ name: 'intprops: 区间可加性 ∫ₐᶜ = ∫ₐ^b + ∫_b^c（阈值 1e-9）', ok: l3.length === 0, detail: l3.join(',') || 'ok' });
      /* 断言 4：保号性 —— f=t−b 在 [0,a] 上 b≥a 时不变号（≤0）⇒ 积分 ≤0；f=t+2 恒正 ⇒ 积分 >0 */
      var s4 = { p: 'sign', a: 1, b: 1.6 }, D4 = L.deal(s4), I4 = simpson(D4.f, D4.lo, D4.hi, 4000);
      var D5 = { f: function (t) { return t + 2; }, lo: 0, hi: 1 }, I5 = simpson(D5.f, 0, 1, 4000);
      out.push({ name: 'intprops: 保号性（不变号 ⇒ 积分同号，阈值 1e-9）', ok: I4 <= 0 && !L.signChange(D4) && I5 > 0, detail: 'I(t−1.6)=' + fmt(I4) + ' I(t+2)=' + fmt(I5) });
      return out;
    }
  });

  /* ⑩ 弧长折线逼近（第 6 章） */
  lab({
    id: 'arclen', ch: '06', title: '弧长：折线逼近曲线',
    sub: '拖 n：折线顶点越密，总长越接近曲线弧长，误差按 ~1/n² 下降（n 翻倍，误差掉到约 1/4）。',
    tex: "L=\\int_a^b\\sqrt{1+\\big(f'(x)\\big)^2}\\,dx\\;\\approx\\;\\sum_{i=1}^{n}\\sqrt{\\Delta x_i^2+\\Delta y_i^2}",
    note: '折线永远比曲线短（弦 ≤ 弧），所以 Lₙ 单调上升趋近 L。圆周那台是参数曲线，x² 那台有闭式弧长可以对照。',
    view: { x0: -0.15, x1: 1.15, y0: -0.15, y1: 1.15, h: 320 },
    ctrls: [
      { k: 'c', label: '曲线', type: 'sel', val: 'parab', opts: [['parab', 'y = x²，[0, 1]'], ['sin', 'y = sin x，[0, π]'], ['circle', '上半圆 (cos t, sin t)'], ['astroid', '星形线四分之一']] },
      { k: 'n', label: '折线段数 n', min: 2, max: 400, step: 1, val: 8 }
    ],
    curve: function (k) {
      if (k === 'sin') return { kind: 'y', f: Math.sin, a: 0, b: Math.PI, ref: null, box: { x0: -0.3, x1: 3.5, y0: -0.3, y1: 1.3 }, label: 'y = sin x，[0, π]（参考值 = n=200000 的 Simpson）' };
      if (k === 'circle') return { kind: 'p', fx: Math.cos, fy: Math.sin, t0: 0, t1: Math.PI, ref: Math.PI, box: { x0: -1.25, x1: 1.25, y0: -0.2, y1: 1.25 }, label: '上半圆 (cos t, sin t)，t∈[0, π]（闭式 = π）' };
      if (k === 'astroid') return { kind: 'p', fx: function (t) { return Math.pow(Math.cos(t), 3); }, fy: function (t) { return Math.pow(Math.sin(t), 3); }, t0: 0, t1: Math.PI / 2, ref: 1.5, box: { x0: -0.12, x1: 1.12, y0: -0.12, y1: 1.12 }, label: '星形线 (cos³t, sin³t)，t∈[0, π/2]（闭式 = 3/2）' };
      return { kind: 'y', f: function (x) { return x * x; }, a: 0, b: 1, ref: (2 * Math.sqrt(5) + Math.asinh(2)) / 4, box: { x0: -0.15, x1: 1.15, y0: -0.15, y1: 1.15 }, label: 'y = x²，[0, 1]（闭式 = (2√5 + asinh 2)/4）' };
    },
    Lref: function (k) { var C = this.curve(k); return C.ref === null ? polyLenF(C.f, C.a, C.b, 200000) : C.ref; },
    Lpoly: function (k, n) { var C = this.curve(k); return C.kind === 'y' ? polyLenF(C.f, C.a, C.b, n) : polyLenP(C.fx, C.fy, C.t0, C.t1, n); },
    draw: function (v, s) {
      var P = pal(), C = this.curve(s.c), n = Math.round(s.n), i, pts = [];
      v.x0 = C.box.x0; v.x1 = C.box.x1; v.y0 = C.box.y0; v.y1 = C.box.y1;
      v.axes();
      if (C.kind === 'y') {
        v.fn(C.f, { color: P.curve2, w: 2.4 });
        for (i = 0; i <= n; i++) { var x = C.a + (C.b - C.a) * i / n; pts.push([x, C.f(x)]); }
      } else {
        v.param(C.fx, C.fy, C.t0, C.t1, { color: P.curve2, w: 2.4 });
        for (i = 0; i <= n; i++) { var t = C.t0 + (C.t1 - C.t0) * i / n; pts.push([C.fx(t), C.fy(t)]); }
      }
      v.poly(pts, { stroke: P.curve, w: 1.8 });
      if (n <= 40) pts.forEach(function (p) { v.dot(p[0], p[1], { color: P.dot, r: 2.6 }); });
      v.text(v.x0 + 0.05, v.y1 - 0.06, '折线 n=' + n + '，Lₙ=' + fmt(this.Lpoly(s.c, n)), { color: P.text, size: 11.5, base: 'top' });
    },
    read: function (s) {
      var n = Math.round(s.n), Ln = this.Lpoly(s.c, n), L = this.Lref(s.c), e = L - Ln;
      var e2 = L - this.Lpoly(s.c, n * 2);
      return [
        ['曲线', this.curve(s.c).label],
        ['折线段数 n', String(n)],
        ['折线总长 Lₙ', fmt(Ln)],
        ['弧长参考值 L', fmt(L)],
        ['误差 L − Lₙ', fmt(e)],
        ['n 翻倍后的误差', fmt(e2)],
        ['误差比 err(2n)/err(n)（≈1/4）', fmt(e > 0 ? e2 / e : 0)]
      ];
    },
    assert: function () {
      var L = this, out = [], keys = ['parab', 'sin', 'circle', 'astroid'], bad = [], bad2 = [], bad3 = [];
      /* 断言 1（验收条款）：折线 n=200 与解析值误差 <1e-3 */
      keys.forEach(function (k) {
        var d = Math.abs(L.Lpoly(k, 200) - L.Lref(k));
        if (!(d < 1e-3)) bad.push(k + ' err=' + d.toExponential(2));
      });
      out.push({ name: 'arclen: n=200 折线长与解析值误差 <1e-3（4 条曲线）', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
      /* 断言 2：折线单调递增且不超过弧长（阈值 1e-12） */
      keys.forEach(function (k) {
        var prev = -1, seq = [25, 50, 100, 200, 400], i;
        for (i = 0; i < seq.length; i++) { var v = L.Lpoly(k, seq[i]); if (!(v > prev)) bad2.push(k + ' n=' + seq[i] + ' 非递增'); prev = v; }
        if (!(prev <= L.Lref(k) + 1e-12)) bad2.push(k + ' n=400 超过弧长');
      });
      out.push({ name: 'arclen: Lₙ 单调递增且 ≤ L（阈值 1e-12）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：误差按 ~1/n² 收敛：err(400)/err(200) ∈ (0.2, 0.3) */
      keys.forEach(function (k) {
        var Lr = L.Lref(k), r = (Lr - L.Lpoly(k, 400)) / (Lr - L.Lpoly(k, 200));
        if (!(r > 0.2 && r < 0.3)) bad3.push(k + ' ratio=' + r.toFixed(4));
      });
      out.push({ name: 'arclen: 误差比 err(400)/err(200) ∈ (0.2, 0.3)（1/n² 收敛）', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4：闭式值自检 —— 上半圆折线 n=400 与 π 之差 <1e-4 */
      out.push({ name: 'arclen: 上半圆 n=400 与 π 之差 <1e-4', ok: Math.abs(L.Lpoly('circle', 400) - Math.PI) < 1e-4, detail: 'err=' + Math.abs(L.Lpoly('circle', 400) - Math.PI).toExponential(2) });
      return out;
    }
  });

  /* ---------------- 三维向量工具（第 11–12 章实验台共用） ---------------- */
  function vadd(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function vsub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function vscale(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function vdot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function vcross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function vlen(a) { return Math.sqrt(vdot(a, a)); }
  function vunit(a) { var L2 = vlen(a); return L2 > 1e-15 ? vscale(a, 1 / L2) : [0, 0, 0]; }

  /* 离屏三维视图（给 assert 用）：画完必须 kill()，否则隐藏 DOM 节点会累积
     第二参数可以是高度数字（旧调用），也可以是 {w,h}——用交付画布的真实尺寸复现标签布局 */
  function probe3(box, h) {
    var b = box, k, w = 760, hh = 0;
    if (h && typeof h === 'object') { w = h.w || 760; hh = h.h || 0; }
    else if (h) { hh = h; }
    if (hh) { b = {}; for (k in box) if (Object.prototype.hasOwnProperty.call(box, k)) b[k] = box[k]; b.h = hh; }
    var host = document.createElement('div');
    host.className = 'labCv';
    host.setAttribute('style', 'position:absolute;left:-10000px;top:0;width:' + w + 'px;');
    var cv = document.createElement('canvas'); host.appendChild(cv); document.body.appendChild(host);
    var v3 = new View3(cv, b); v3.fit();
    return { v3: v3, kill: function () { document.body.removeChild(host); } };
  }

  /* 凸多边形按一根轴的平板 [lo,hi] 裁剪（Sutherland–Hodgman 单轴版） */
  function clipAxis(pts, k, lo, hi) {
    var out = [], i;
    for (i = 0; i < pts.length; i++) {
      var A = pts[i], B = pts[(i + 1) % pts.length];
      var ain = A[k] >= lo && A[k] <= hi, bin = B[k] >= lo && B[k] <= hi;
      if (ain) out.push(A);
      if (ain !== bin) {
        var dA = A[k] < lo ? lo - A[k] : (A[k] > hi ? hi - A[k] : 0);
        var dB = B[k] < lo ? lo - B[k] : (B[k] > hi ? hi - B[k] : 0);
        var t = dA / (dA - dB);
        out.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
      }
    }
    return out;
  }

  /* 平面 n·X = d 被盒子 box 裁出的凸多边形（空数组表示平面不与盒子相交） */
  function planePoly3(n, d, box, rho) {
    var nn = vunit(n);
    if (vlen(nn) < 0.5) return [];
    var base = vscale(n, d / Math.max(vdot(n, n), 1e-15));
    var ref = Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    var e1 = vunit(vcross(nn, ref)), e2 = vcross(nn, e1), R = rho || 2.4, pts = [];
    [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(function (q) {
      pts.push(vadd(base, vadd(vscale(e1, R * q[0]), vscale(e2, R * q[1]))));
    });
    pts = clipAxis(pts, 0, box.x0, box.x1); if (pts.length < 3) return [];
    pts = clipAxis(pts, 1, box.y0, box.y1); if (pts.length < 3) return [];
    pts = clipAxis(pts, 2, box.z0, box.z1);
    return pts.length >= 3 ? pts : [];
  }

  /* 取某实验台的控件默认值（assert 里复现「打开时看到的那一屏」） */
  function stateOf(L) { var s = {}; L.ctrls.forEach(function (c) { s[c.k] = c.val; }); return s; }

  /* 标签不相交检测（验收条款）：把实验台按默认状态画到离屏三维视图上，在「若干旋转角 × 若干画布几何」下收集相交对。
     **必须用交付画布的真实几何**：标签的屏幕偏移随宽高比变化，只按某个固定探针尺寸检测会与页面脱钩（实测 736×420 全 0 重叠，
     而交付画布 652×320 / 866×320 / 302×236 上仍有重叠）。故这里优先取页面已挂载画布的真实 client 尺寸，
     再补五档代表性几何（360/768/1512 视口下的单栏画布 + accel 双面板在宽视口下的 428×236 三维面板）。
     角度 = 默认角 + 4 个常用中低俯仰角；不含 |pitch|→90° 的近似俯视——那时 z 轴投影退化、任何摆法都会压到中部图元，属几何退化而非布局缺陷。 */
  var LABEL_FALLBACK_SIZES = [{ w: 302, h: 236 }, { w: 652, h: 320 }, { w: 710, h: 320 }, { w: 866, h: 320 }, { w: 428, h: 236 }];
  function labelSizes(L, h) {
    var out = [], seen = {}, push = function (w, hh) {
      w = Math.round(w); if (!(w > 60)) return;
      hh = Math.round(hh || (w < 560 ? 236 : 320));
      var key = w + 'x' + hh; if (seen[key]) return; seen[key] = 1; out.push({ w: w, h: hh });
    };
    var cvs = document.querySelectorAll('.labCard[data-lab="' + L.id + '"] canvas'), i;
    for (i = 0; i < cvs.length; i++) push(cvs[i].clientWidth, cvs[i].clientHeight);
    if (h) push(760, h);                                    /* 旧调用：保留固定探针口径 */
    LABEL_FALLBACK_SIZES.forEach(function (z) { push(z.w, z.h); });
    return out;
  }
  function labelCheck(L, angles, h) {
    var bad = [], list = angles || [[0.7, 0.42]];
    labelSizes(L, h).forEach(function (sz) {
      list.forEach(function (ang) {
        var pb = probe3(L.view, sz);
        try {
          if (ang) pb.v3.setAngles(ang[0], ang[1]);
          var arg = (L.panes || 1) > 1 ? [pb.v3] : pb.v3;   /* 多画布实验台的 draw 收到的是视图数组 */
          L.draw.call(L, arg, stateOf(L));
          pb.v3.flushLabels();                              /* labelAuto 视图：落笔后才有包围盒 */
          pb.v3.labelOverlaps(0).forEach(function (o) {
            bad.push(sz.w + '×' + sz.h + ' yaw=' + ang[0].toFixed(2) + ' 处「' + o.a + '」×「' + o.b + '」');
          });
        } catch (e) { bad.push(sz.w + '×' + sz.h + ' draw 抛错：' + (e && e.message)); }
        finally { pb.kill(); }
      });
    });
    return bad;
  }

  /* 实验台数值断言总跑器：返回 [{id, name, ok, detail}]（供回归与验收逐台核对） */
  /* 读数取值：按标签子串取 .labRD 的值（assert 用它核对 read() 与解析值） */
  function pick(rows, key) {
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][0]).indexOf(key) >= 0) return parseFloat(rows[i][1]);
    }
    return NaN;
  }

  /* 读数取值（精确标签）：标签完全相同才取，避免"f′(c)"被"满足 f′(c)=割线斜率的 c"抢先命中 */
  function pickEx(rows, key) {
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][0]) === key) return parseFloat(rows[i][1]);
    }
    return NaN;
  }

  function assertAll() {
    var rows = [];
    LABS.forEach(function (L) {
      if (typeof L.assert !== 'function') return;
      var rs;
      try { rs = L.assert.call(L); }
      catch (e) { rs = [{ name: L.id + ': 断言执行', ok: false, detail: '异常：' + (e && e.message) }]; }
      (rs || []).forEach(function (r) { rows.push({ id: L.id, name: r.name, ok: !!r.ok, detail: r.detail }); });
    });
    return rows;
  }

  /* ================= 第 07 章：指数与对数的反函数反射 ================= */
  lab({
    id: 'explog',
    ch: '07',
    title: '指数与对数的反函数反射',
    sub: '拖动底数 a 与自变量 x：y=aˣ 上的点与 y=log_a x 上的点始终关于 y=x 互为镜像。',
    tex: 'a^{\\log_a x}=x,\\qquad \\log_a\\!\\left(a^{x}\\right)=x',
    note: '反函数 = 把每个点的坐标交换（关于 y=x 镜像）。两条恒等式说的就是「先取幂再取对数」与「先取对数再取幂」' +
      '都回到原数；本轮验收要求其数值误差 <1e-9。注意 y=log_a x 只在 x>0 有定义——这正是 y=aˣ 的值域永远为正的镜像后果。',
    view: { x0: -3.2, x1: 4.4, y0: -3.2, y1: 4.4 },
    ctrls: [
      { k: 'a', label: '底数 a', min: 1.05, max: 5, step: 0.05, val: 2 },
      { k: 'x', label: '自变量 x', min: -2.5, max: 3, step: 0.05, val: 1.2 }
    ],
    loga: function (a, x) { return Math.log(x) / Math.log(a); },     // 参数齐全，可直接当回调（不依赖 this）
    draw: function (v, s) {
      var P = pal(), a = s.a, x = s.x, y = Math.pow(a, x);
      v.axes();
      v.line(v.x0, v.x0, v.x1, v.x1, { color: P.muted, w: 1.6, dash: [6, 5] });          // 镜像轴 y=x
      v.fn(function (t) { return Math.pow(a, t); }, { color: P.curve, w: 2.4 });          // y=aˣ
      v.fn(function (t) { return t > 0 ? Math.log(t) / Math.log(a) : NaN; }, { color: P.curve2, w: 2.4 });
      v.line(x, y, y, x, { color: P.curve4, w: 1.4, dash: [4, 4] });                      // 一对镜像点的连线
      v.dropLine(x, y, x, 0, { color: P.grid, w: 1.2 });
      v.dropLine(y, x, 0, x, { color: P.grid, w: 1.2 });
      v.dot(x, y, { color: P.curve, r: 5, ring: true });
      v.dot(y, x, { color: P.curve2, r: 5, ring: true });
      v.text(x, y, ' (x, aˣ)', { color: P.curve, size: 12, bg: P.band });
      v.text(y, x, ' (aˣ, x)', { color: P.curve2, size: 12, bg: P.band });
      v.text(4.2, 4.1, 'y = aˣ', { color: P.curve, size: 12.5, align: 'right', bg: P.band });
      v.text(4.2, 2.35, 'y = log_a x', { color: P.curve2, size: 12.5, align: 'right', bg: P.band });
      v.text(-2.95, -2.6, 'y = x（镜像轴）', { color: P.muted, size: 12, bg: P.band });
    },
    read: function (s) {
      var a = s.a, x = s.x, y = Math.pow(a, x), back = this.loga(a, y), e1 = back - x;
      var fwd = x > 0 ? Math.pow(a, this.loga(a, x)) - x : NaN;
      var mx = (x + y) / 2, my = (x + y) / 2;                          // 镜像点中点的两个坐标
      return [
        ['底数 a', fmt(a, 2)],
        ['自变量 x', fmt(x, 2)],
        ['aˣ', fmt(y)],
        ['log_a(aˣ)（回到 x）', fmt(back)],
        ['恒等式误差 |log_a(aˣ) − x|', fmt(Math.abs(e1)) === '0' ? '0' : Math.abs(e1).toExponential(2)],
        ['a^(log_a x) − x（x>0 时）', isFinite(fwd) ? (fwd === 0 ? '0' : Math.abs(fwd).toExponential(2)) : '—（x≤0 不在定义域）'],
        ['换底 |log_a x − ln x / ln a|', x > 0 ? Math.abs(this.loga(a, x) - Math.log(x) / Math.log(a)).toExponential(2) : '—'],
        ['镜像中点偏离 y=x', (mx - my === 0 ? '0（结构恒等）' : fmt(mx - my))],
        ['a>1 → aˣ', a > 1 ? '严格递增' : '严格递减']
      ];
    },
    assert: function () {
      var L = this, out = [], bad1 = [], bad2 = [], bad3 = [], bad4 = [];
      /* 断言 1（验收条款）：log_a(aˣ)=x 误差 <1e-9 */
      [1.2, 1.5, 2, Math.E, 3.7, 10, 0.5, 0.8].forEach(function (a) {
        [-3, -1.5, 0, 0.35, 1, 2.4].forEach(function (x) {
          var d = Math.abs(L.loga(a, Math.pow(a, x)) - x);
          if (!(d < 1e-9)) bad1.push('a=' + a + ' x=' + x + ' err=' + d.toExponential(2));
        });
      });
      out.push({ name: 'explog: 恒等式 log_a(aˣ)=x 误差 <1e-9（8 底数 × 6 点）', ok: bad1.length === 0, detail: bad1.join(';') || 'ok' });
      /* 断言 2：反方向 a^(log_a x)=x 相对误差 <1e-9 */
      [1.3, 2, Math.E, 8, 0.6].forEach(function (a) {
        [0.05, 0.5, 1, 7.5, 40].forEach(function (x) {
          var d = Math.abs(Math.pow(a, L.loga(a, x)) - x) / x;
          if (!(d < 1e-9)) bad2.push('a=' + a + ' x=' + x + ' rel=' + d.toExponential(2));
        });
      });
      out.push({ name: 'explog: 恒等式 a^(log_a x)=x 相对误差 <1e-9（5 底数 × 5 点）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：镜像结构——(u,aᵘ) 与 (aᵘ,u) 的中点恒在 y=x 上，且两点到 y=x 等距 */
      [1.4, 2.5, 6].forEach(function (a) {
        [-2, 0.4, 2.2].forEach(function (u) {
          var y = Math.pow(a, u);
          if ((u + y) / 2 - (u + y) / 2 !== 0) bad3.push('a=' + a + ' u=' + u);
          var d1 = Math.abs(u - y) / Math.SQRT2, d2 = Math.abs(y - u) / Math.SQRT2;
          if (!(Math.abs(d1 - d2) < 1e-15)) bad3.push('a=' + a + ' u=' + u + ' 到轴不等距');
        });
      });
      out.push({ name: 'explog: 镜像点对中点落在 y=x 上且到轴等距（9 组）', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4：换底公式一致 <1e-12；e 特例 exp(1)=e、ln e=1；log_a 只在 x>0 有定义 */
      [1.7, 2, 9].forEach(function (a) {
        [0.2, 1, 3.5, 12].forEach(function (x) {
          if (!(Math.abs(L.loga(a, x) - Math.log(x) / Math.log(a)) < 1e-12)) bad4.push('a=' + a + ' x=' + x);
        });
      });
      if (!(Math.abs(Math.exp(1) - Math.E) < 1e-15 && Math.abs(Math.log(Math.E) - 1) < 1e-15)) bad4.push('e 特例');
      if (!(Math.abs(L.loga(2, 2) - 1) < 1e-15)) bad4.push('log_a a ≠ 1');
      if (isFinite(L.loga(2, -1)) || isFinite(L.loga(2, 0))) bad4.push('log_a 在 x≤0 应有定义域限制');
      if (!(Math.pow(2, -30) > 0 && Math.pow(0.5, 30) > 0)) bad4.push('aˣ 值域应为正');
      out.push({ name: 'explog: 换底公式 <1e-12 且 e 特例/定义域（log_a 仅 x>0）正确', ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
      return out;
    }
  });

  /* ================= 第 07 章：反三角主值区间 ================= */
  lab({
    id: 'invtri',
    ch: '07',
    title: '反三角主值区间',
    sub: '左图单位圆给出主值角 θ，右图是反函数曲线；灰色带就是主值范围——出了带就不是反函数。',
    tex: '\\arcsin x+\\arccos x=\\frac{\\pi}{2},\\qquad -\\frac{\\pi}{2}\\le\\arcsin x\\le\\frac{\\pi}{2}',
    note: 'sin 在整个圆上都取值，同一个比值对应无穷多个角；把角限制在主值区间（arcsin 取 [−π/2,π/2]、' +
      'arccos 取 [0,π]、arctan 取 (−π/2,π/2)）才能把反函数定成单值函数。左图里那个「非主值」虚点与主值点有相同的正弦值，' +
      '它就是必须砍掉的那一半。',
    panes: 2,
    view: { x0: -1.35, x1: 1.35, y0: -1.35, y1: 1.35 },
    view2: { x0: -3.3, x1: 3.3, y0: -2.1, y1: 3.4 },
    ctrls: [
      { k: 'fn', label: '反三角函数', type: 'sel', val: 'asin', opts: [['asin', 'arcsin x'], ['acos', 'arccos x'], ['atan', 'arctan x']] },
      { k: 'x', label: '自变量 x', min: -3, max: 3, step: 0.05, val: 0.6 }
    ],
    name: function (k) { return k === 'asin' ? 'arcsin' : k === 'acos' ? 'arccos' : 'arctan'; },
    domain: function (k) { return k === 'atan' ? '(−∞, ∞)' : '[−1, 1]'; },
    range: function (k) { return k === 'asin' ? '[−π/2, π/2]' : k === 'acos' ? '[0, π]' : '(−π/2, π/2)'; },
    clampX: function (k, x) { return k === 'atan' ? x : Math.max(-1, Math.min(1, x)); },   // 参数齐全，可直接当回调
    theta: function (k, x) { var t = this.clampX(k, x); return k === 'asin' ? Math.asin(t) : k === 'acos' ? Math.acos(t) : Math.atan(t); },
    val: function (k, x) { return this.theta(k, x); },
    lims: function (k) {
      if (k === 'asin') return [-Math.PI / 2, Math.PI / 2];
      if (k === 'acos') return [0, Math.PI];
      return [-Math.PI / 2, Math.PI / 2];
    },
    draw: function (v, s) {
      var P = pal(), L = this, A = v[0], B = v[1], k = s.fn, t = this.theta(k, s.x);
      var c = Math.cos(t), sn = Math.sin(t), lim = this.lims(k);
      /* 左：单位圆 + 主值角 + 直角三角形 */
      A.axes();
      A.param(Math.cos, Math.sin, 0, Math.PI * 2, { color: P.grid, w: 1.5 });
      A.param(Math.cos, Math.sin, 0, t, { color: P.curve3, w: 3 });
      A.line(0, 0, -1.3, 0, { color: P.muted, w: 1.2 });
      A.line(0, 0, c, sn, { color: P.curve, w: 2.4 });
      A.line(c, 0, c, sn, { color: P.curve2, w: 2 });
      A.line(0, 0, c, 0, { color: P.curve4, w: 2 });
      A.dot(c, sn, { color: P.curve, r: 5, ring: true });
      A.dot(c, 0, { color: P.curve4, r: 3.4 });
      A.arc && A.arc(0, 0, 0.34, 0, t, { color: P.curve3, w: 1.6 });
      A.text(0.42, Math.sin(t / 2) * 0.42 + 0.16, 'θ', { color: P.curve3, size: 13, align: 'center' });
      A.text(c / 2, -0.16, 'cos θ', { color: P.curve4, size: 11.5, align: 'center' });
      A.text(c + 0.06, sn / 2, 'sin θ', { color: P.curve2, size: 11.5 });
      A.text(c / 2 - 0.2, sn / 2 + 0.07, '1', { color: P.curve, size: 11.5 });
      A.text(-1.28, 1.18, '单位圆：半径 1，角 θ 从 x 轴量起', { color: P.muted, size: 11.5 });
      if (k === 'asin' && Math.abs(Math.cos(t) + 1) > 1e-9) {          // 同正弦的另一个角：π−θ
        var t2 = Math.PI - t;
        A.dot(Math.cos(t2), Math.sin(t2), { color: P.curve4, r: 4 });
        A.line(0, 0, Math.cos(t2), Math.sin(t2), { color: P.curve4, w: 1.2, dash: [4, 3] });
        A.text(Math.cos(t2), Math.sin(t2), ' π−θ（同 sin，非主值）', { color: P.curve4, size: 11, bg: P.band });
      }
      /* 右：反函数曲线 + 主值带 */
      B.axes();
      B.rect(B.x0, lim[0], B.x1, lim[1], { fill: P.fill3 });
      B.line(B.x0, lim[0], B.x1, lim[0], { color: P.curve3, w: 1.4, dash: [5, 4] });
      B.line(B.x0, lim[1], B.x1, lim[1], { color: P.curve3, w: 1.4, dash: [5, 4] });
      B.fn(function (z) { var q = L.clampX(k, z); return (k !== 'atan' && Math.abs(z) > 1) ? NaN : L.val(k, q); }, { color: P.curve, w: 2.4 });
      B.dot(L.clampX(k, s.x), t, { color: P.curve, r: 5, ring: true });
      B.line(L.clampX(k, s.x), B.y0, L.clampX(k, s.x), B.y1, { color: P.curve4, w: 1, dash: [4, 4] });
      B.text(B.x1 - 0.08, lim[0] - 0.22, '主值范围 ' + this.range(k), { color: P.curve3, size: 11.5, align: 'right', bg: P.band });
      B.text(3.2, 3.1, 'y = ' + this.name(k) + ' x', { color: P.curve, size: 12.5, align: 'right', bg: P.band });
    },
    read: function (s) {
      var k = s.fn, xi = this.clampX(k, s.x), t = this.theta(k, s.x);
      var back = k === 'asin' ? Math.sin(t) - xi : k === 'acos' ? Math.cos(t) - xi : Math.tan(t) - xi;
      var rows = [
        ['函数 / 定义域', this.name(k) + ' x，x ∈ ' + this.domain(k)],
        ['取用 x（控件 ' + fmt(s.x, 2) + ' 夹到定义域）', fmt(xi, 3)],
        ['主值角 θ（弧度）', fmt(t)],
        ['θ（度）', fmt(t * 180 / Math.PI, 2)],
        ['sin θ / cos θ / tan θ', fmt(Math.sin(t)) + ' / ' + fmt(Math.cos(t)) + ' / ' + (isFinite(Math.tan(t)) ? fmt(Math.tan(t)) : '—')],
        ['回代误差（' + (k === 'asin' ? 'sin' : k === 'acos' ? 'cos' : 'tan') + ' θ − x）', back === 0 ? '0' : Math.abs(back).toExponential(2)],
        ['主值范围', this.range(k)],
        ['cos(arcsin x) − √(1−x²)', k === 'asin' ? Math.abs(Math.cos(t) - Math.sqrt(1 - xi * xi)).toExponential(2) : '—（切到 arcsin 看）']
      ];
      if (k !== 'atan') rows.push(['arcsin x + arccos x − π/2', Math.abs(Math.asin(xi) + Math.acos(xi) - Math.PI / 2).toExponential(2)]);
      else rows.push(['arcsin x + arccos x − π/2', '—（切到 arcsin/arccos 看）']);
      rows.push(['拿掉主值限制的后果', k === 'asin' ? 'asin(sin 2.5) = ' + fmt(Math.asin(Math.sin(2.5))) + ' ≠ 2.5' : '主值区间保证单值，见右图灰带']);
      return rows;
    },
    assert: function () {
      var L = this, out = [], bad1 = [], bad2 = [], bad3 = [], bad4 = [];
      /* 断言 1（验收条款相关）：回代恒等式误差 <1e-12 */
      [-1, -0.7, -0.25, 0, 0.3, 0.85, 1].forEach(function (x) {
        if (!(Math.abs(Math.sin(Math.asin(x)) - x) < 1e-12)) bad1.push('sin∘asin x=' + x);
        if (!(Math.abs(Math.cos(Math.acos(x)) - x) < 1e-12)) bad1.push('cos∘acos x=' + x);
      });
      [-5, -1, -0.2, 0, 0.5, 3, 12].forEach(function (x) {
        if (!(Math.abs(Math.tan(Math.atan(x)) - x) < 1e-12)) bad1.push('tan∘atan x=' + x);
      });
      out.push({ name: 'invtri: 回代恒等式 sin∘arcsin / cos∘arccos / tan∘arctan 误差 <1e-12（17 点）', ok: bad1.length === 0, detail: bad1.join(';') || 'ok' });
      /* 断言 2：主值范围与有界性 */
      [-1, -0.4, 0, 0.6, 1].forEach(function (x) {
        var a = Math.asin(x), c = Math.acos(x);
        if (!(a >= -Math.PI / 2 - 1e-15 && a <= Math.PI / 2 + 1e-15)) bad2.push('asin ' + x + ' 越界');
        if (!(c >= -1e-15 && c <= Math.PI + 1e-15)) bad2.push('acos ' + x + ' 越界');
      });
      var prev = -Infinity;
      [-1e6, -10, -1, 0, 1, 10, 1e6].forEach(function (x) {
        var t = Math.atan(x);
        if (!(Math.abs(t) < Math.PI / 2)) bad2.push('atan ' + x + ' 越界');
        if (!(t > prev)) bad2.push('atan 非严格递增于 x=' + x);
        prev = t;
      });
      out.push({ name: 'invtri: 主值范围 arcsin⊂[−π/2,π/2]、arccos⊂[0,π]、arctan 严格递增且有界（12 点）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：arcsin x + arccos x = π/2；cos(arcsin x) = √(1−x²)；tan(arcsin x) = x/√(1−x²) */
      [-1, -0.6, 0, 0.4, 1].forEach(function (x) {
        if (!(Math.abs(Math.asin(x) + Math.acos(x) - Math.PI / 2) < 1e-12)) bad3.push('互补 x=' + x);
        if (!(Math.abs(Math.cos(Math.asin(x)) - Math.sqrt(1 - x * x)) < 1e-12)) bad3.push('cos∘asin x=' + x);
      });
      [-0.9, -0.3, 0.2, 0.75].forEach(function (x) {
        var d = Math.abs(Math.tan(Math.asin(x)) - x / Math.sqrt(1 - x * x)) / Math.abs(x / Math.sqrt(1 - x * x));
        if (!(d < 1e-9)) bad3.push('tan∘asin x=' + x + ' rel=' + d.toExponential(2));
      });
      out.push({ name: 'invtri: asin x+acos x=π/2、cos(asin x)=√(1−x²)、tan(asin x)=x/√(1−x²)（13 点）', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4（主值区间必要性）：asin(sin θ)=θ 只在 θ∈[−π/2,π/2] 成立；θ=2.5 时明显不等 */
      var inRange = [-1.5, -0.8, 0, 0.9, Math.PI / 2], okIn = true;
      inRange.forEach(function (th) { if (!(Math.abs(Math.asin(Math.sin(th)) - th) < 1e-12)) okIn = false; });
      var outRange = Math.abs(Math.asin(Math.sin(2.5)) - 2.5);
      if (!(okIn && outRange > 0.5)) bad4.push('主值区间判据 inRange=' + okIn + ' outRange=' + outRange.toFixed(4));
      var deg = Math.asin(0.5) * 180 / Math.PI;
      if (!(Math.abs(deg - 30) < 1e-12)) bad4.push('角度换算 deg=' + deg);
      out.push({ name: 'invtri: asin(sin θ)=θ 仅当 θ 在主值区间（θ=2.5 时差 ' + outRange.toFixed(4) + ' > 0.5）；弧度↔度换算正确', ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
      return out;
    }
  });

  /* ================= 第 08 章：分部积分几何化 ================= */
  lab({
    id: 'parts',
    ch: '08',
    title: '分部积分：两块面积的账',
    sub: '青色面积 ∫u dv 与橙色面积 ∫v du 之和，恰好等于两个矩形 uv 的差 [uv]ₐᵇ——这就是分部积分。',
    tex: '\\int_a^b u\\,dv=\\Big[u v\\Big]_a^b-\\int_a^b v\\,du',
    note: '把乘积求导法则 (uv)′ = u′v + uv′ 在 [a,b] 上积分就得到分部积分：青色面积 + 橙色面积 = 矩形差。' +
      '于是「算不出的积分」可以换成「另一个积分」——换出来的那块更好算时，公式就有用。本轮验收要求两面积之和与 [uv]ₐᵇ 的误差 <1e-6。',
    view: { x0: -1.0, x1: 2.0, y0: -4.0, y1: 7.0 },
    ctrls: [
      { k: 'ex', label: '例子', type: 'sel', val: 'lnx', opts: [['lnx', '∫ ln x dx'], ['xexp', '∫ x eˣ dx'], ['xsqsin', '∫ x² sin x dx']] },
      { k: 'a', label: '下限 a', min: -0.8, max: 1, step: 0.05, val: 0.2 },
      { k: 'b', label: '上限 b', min: 0.5, max: 1.5, step: 0.05, val: 1.4 }
    ],
    pick: function (ex) {
      if (ex === 'xexp') {
        return { label: 'u = x, v = eˣ', u: function (x) { return x; }, v: Math.exp, du: function () { return 1; }, dv: Math.exp,
          A: function (x) { return x * Math.exp(x); }, B: Math.exp, anti: function (x) { return (x - 1) * Math.exp(x); }, antiTxt: '(x−1)eˣ' };
      }
      if (ex === 'xsqsin') {
        return { label: 'u = x², v = −cos x', u: function (x) { return x * x; }, v: function (x) { return -Math.cos(x); },
          du: function (x) { return 2 * x; }, dv: Math.sin,
          A: function (x) { return x * x * Math.sin(x); }, B: function (x) { return -2 * x * Math.cos(x); },
          anti: function (x) { return -x * x * Math.cos(x) + 2 * x * Math.sin(x) + 2 * Math.cos(x); }, antiTxt: '−x²cos x + 2x sin x + 2cos x' };
      }
      return { label: 'u = ln x, v = x', u: Math.log, v: function (x) { return x; }, du: function (x) { return 1 / x; }, dv: function () { return 1; },
        A: Math.log, B: function () { return 1; }, anti: function (x) { return x * Math.log(x) - x; }, antiTxt: 'x ln x − x' };
    },
    ab: function (s) {                                  // 保证 a<b，且 ln x 的 a>0
      var a = s.ex === 'lnx' ? Math.max(s.a, 0.05) : s.a, b = Math.max(s.b, a + 0.3);
      return { a: a, b: b, clamp: (a !== s.a) || (b !== s.b) };
    },
    draw: function (v, s) {
      var P = pal(), D = this.pick(s.ex), R = this.ab(s), a = R.a, b = R.b;
      v.axes();
      v.fillBetween(D.A, null, a, b, { fill: P.fill, n: 300 });
      v.fillBetween(D.B, null, a, b, { fill: P.fill2, n: 300 });
      v.fn(D.A, { color: P.curve, w: 2.2 });
      v.fn(D.B, { color: P.curve2, w: 2.2, dash: [5, 4] });
      v.rect(0, 0, a, D.u(a) * D.v(a), { stroke: P.curve4, w: 1.3 });          // 矩形 u(a)v(a)
      v.rect(0, 0, b, D.u(b) * D.v(b), { stroke: P.curve3, w: 1.3 });          // 矩形 u(b)v(b)
      v.dot(a, D.u(a) * D.v(a), { color: P.curve4, r: 4, ring: true });
      v.dot(b, D.u(b) * D.v(b), { color: P.curve3, r: 4, ring: true });
      v.line(a, v.y0, a, v.y1, { color: P.muted, w: 1, dash: [4, 4] });
      v.line(b, v.y0, b, v.y1, { color: P.muted, w: 1, dash: [4, 4] });
      v.text(1.95, 6.6, D.label, { color: P.text, size: 12, align: 'right', bg: P.band });
      v.text(-0.15, 5.0, '青 ∫u dv', { color: P.curve, size: 11.5, align: 'right', bg: P.band });
      v.text(-0.15, 3.6, '橙 ∫v du', { color: P.curve2, size: 11.5, align: 'right', bg: P.band });
      v.text(b, D.u(b) * D.v(b), ' u(b)v(b)', { color: P.curve3, size: 11, bg: P.band });
      v.text(a, D.u(a) * D.v(a), ' u(a)v(a)', { color: P.curve4, size: 11, bg: P.band });
    },
    read: function (s) {
      var D = this.pick(s.ex), R = this.ab(s), a = R.a, b = R.b;
      var A = simpson(D.A, a, b, 4000), B = simpson(D.B, a, b, 4000);
      var uv = D.u(b) * D.v(b) - D.u(a) * D.v(a), err = A + B - uv;
      var anti = D.anti(b) - D.anti(a);
      return [
        ['例子', D.label],
        ['区间 [a, b]', '[' + fmt(a, 2) + ', ' + fmt(b, 2) + ']' + (R.clamp ? '（已夹到可用范围）' : '')],
        ['u(a), u(b)', fmt(D.u(a)) + ' , ' + fmt(D.u(b))],
        ['v(a), v(b)', fmt(D.v(a)) + ' , ' + fmt(D.v(b))],
        ['青色面积 A = ∫u dv', fmt(A)],
        ['橙色面积 B = ∫v du', fmt(B)],
        ['A + B', fmt(A + B)],
        ['矩形差 [uv]ₐᵇ = u(b)v(b) − u(a)v(a)', fmt(uv)],
        ['误差 |A + B − [uv]ₐᵇ|（验收 <1e-6）', Math.abs(err) < 1e-12 ? '0' : Math.abs(err).toExponential(2)],
        ['闭式核对 ' + D.antiTxt + ' 的增量', fmt(anti)],
        ['与闭式的差', Math.abs(A - anti) < 1e-12 ? '0' : Math.abs(A - anti).toExponential(2)]
      ];
    },
    assert: function () {
      var L = this, out = [], bad1 = [], bad2 = [], bad3 = [], bad4 = [];
      var cases = [['lnx', 0.2, 1.4], ['lnx', 0.6, 0.9], ['xexp', -0.5, 1.2], ['xexp', 0.1, 1.5], ['xsqsin', 0.4, 1.3], ['xsqsin', -0.2, 0.8]];
      /* 断言 1（验收条款）：两块面积之和与 [uv]ₐᵇ 误差 <1e-6 */
      cases.forEach(function (c) {
        var D = L.pick(c[0]);
        var d = simpson(D.A, c[1], c[2], 4000) + simpson(D.B, c[1], c[2], 4000) - (D.u(c[2]) * D.v(c[2]) - D.u(c[1]) * D.v(c[1]));
        if (!(Math.abs(d) < 1e-6)) bad1.push(c[0] + ' [' + c[1] + ',' + c[2] + '] err=' + d.toExponential(2));
      });
      out.push({ name: 'parts: ∫u dv + ∫v du = [uv]ₐᵇ 误差 <1e-6（3 例 × 2 区间，验收条款）', ok: bad1.length === 0, detail: bad1.join(';') || 'ok' });
      /* 断言 2：∫u dv 与闭式原函数增量一致 <1e-6 */
      cases.forEach(function (c) {
        var D = L.pick(c[0]);
        var d = simpson(D.A, c[1], c[2], 4000) - (D.anti(c[2]) - D.anti(c[1]));
        if (!(Math.abs(d) < 1e-6)) bad2.push(c[0] + ' err=' + d.toExponential(2));
      });
      out.push({ name: 'parts: 青色面积与闭式原函数（x ln x−x / (x−1)eˣ / −x²cos x+2x sin x+2cos x）误差 <1e-6', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：Simpson 步数收敛——n=200 误差 <1e-4，n=4000 误差 <1e-6 */
      cases.forEach(function (c) {
        var D = L.pick(c[0]), ref = D.anti(c[2]) - D.anti(c[1]);
        var e1 = Math.abs(simpson(D.A, c[1], c[2], 200) - ref), e2 = Math.abs(simpson(D.A, c[1], c[2], 4000) - ref);
        if (!(e1 < 1e-4 && e2 < 1e-6)) bad3.push(c[0] + ' n200=' + e1.toExponential(2) + ' n4000=' + e2.toExponential(2));
      });
      out.push({ name: 'parts: Simpson 收敛 err(n=200)<1e-4 且 err(n=4000)<1e-6（6 组）', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4：交换 u,v 后两块面积之和不变（<1e-9）；经典值 ∫₁²ln x=2ln2−1、∫₀²x eˣ=e²+1 */
      cases.forEach(function (c) {
        var D = L.pick(c[0]), s1 = 0, s2 = 0, i, n = 4000, h = (c[2] - c[1]) / n;
        for (i = 0; i <= n; i++) { var x = c[1] + i * h, w = (i === 0 || i === n) ? 1 : (i % 2 ? 4 : 2); s1 += w * D.A(x); s2 += w * D.B(x); }
        if (!(Math.abs((s1 + s2) - (s2 + s1)) < 1e-9)) bad4.push(c[0] + ' 交换不等');
      });
      var g = Math.log, ref = (2 * Math.log(2) - 2) - (1 * Math.log(1) - 1);
      if (!(Math.abs(simpson(g, 1, 2, 4000) - ref) < 1e-6)) bad4.push('∫₁² ln x err=' + Math.abs(simpson(g, 1, 2, 4000) - ref).toExponential(2));
      var h2 = function (x) { return x * Math.exp(x); }, ref2 = (2 - 1) * Math.exp(2) - (0 - 1) * Math.exp(0);
      if (!(Math.abs(simpson(h2, 0, 2, 4000) - ref2) < 1e-6)) bad4.push('∫₀² x eˣ err=' + Math.abs(simpson(h2, 0, 2, 4000) - ref2).toExponential(2));
      out.push({ name: 'parts: 交换 u,v 之和不变 <1e-9；经典值 ∫₁²ln x=2ln2−1、∫₀²x eˣ=e²+1 误差 <1e-6', ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
      return out;
    }
  });

  /* ================= 第 08 章：三角代换 ================= */
  lab({
    id: 'trigsub',
    ch: '08',
    title: '三角代换：直角三角形与面积元',
    sub: 'x = a sin θ 把 √(a²−x²) 变成 a cos θ；右图的窄条说明 dx 也被换成了 a cos θ dθ。',
    tex: 'x=a\\sin\\theta,\\qquad \\sqrt{a^{2}-x^{2}}=a\\cos\\theta,\\qquad dx=a\\cos\\theta\\,d\\theta',
    note: '根号 a²−x² 难缠，是因为它正是直角三角形的另一条直角边：斜边 a、对边 x、邻边 √(a²−x²)，夹角 θ。' +
      '于是 x = a sin θ 把根号整块换成 a cos θ，dx 也随之换成 a cos θ dθ——这就是三角代换。' +
      '本轮验收要求「换元前后算同一个面积」的数值反演误差 <1e-6。',
    panes: 2,
    view: { x0: -0.75, x1: 2.35, y0: -0.75, y1: 2.35 },
    view2: { x0: -2.35, x1: 2.35, y0: -0.35, y1: 2.35 },
    ctrls: [
      { k: 'a', label: '斜边 a', min: 0.6, max: 2, step: 0.05, val: 1.2 },
      { k: 'th', label: '角 θ（弧度）', min: 0, max: 1.5, step: 0.01, val: 0.9 }
    ],
    X: function (a, th) { return a * Math.sin(th); },                  // 参数齐全，可直接当回调
    C: function (a, th) { return a * Math.cos(th); },
    sq: function (a, x) { return Math.sqrt(Math.max(0, a * a - x * x)); },
    areaX: function (a, x) { return simpson(function (t) { return Math.sqrt(Math.max(0, a * a - t * t)); }, 0, x, 4000); },
    areaT: function (a, th) { return a * a * simpson(function (p) { return Math.cos(p) * Math.cos(p); }, 0, th, 4000); },
    closed: function (a, th) { return a * a / 2 * (th + Math.sin(th) * Math.cos(th)); },
    draw: function (v, s) {
      var P = pal(), A = v[0], B = v[1], a = s.a, th = s.th, x = this.X(a, th), c = this.C(a, th);
      var dx = Math.max(0.02, a * Math.cos(th) * 0.09);                 // 面积元示意宽度 ∝ a cos θ dθ
      /* 左：直角三角形（斜边 a、对边 x、邻边 √(a²−x²)） */
      A.axes();
      A.param(function (t) { return 0.3 * a * Math.cos(t); }, function (t) { return 0.3 * a * Math.sin(t); }, 0, Math.PI / 2, { color: P.grid, w: 1.4 });
      A.poly([[0, 0], [c, 0], [c, x]], { close: true, fill: P.fill, stroke: P.curve4, w: 1.4 });
      A.line(0, 0, c, x, { color: P.curve, w: 2.4 });
      A.line(c, 0, c, x, { color: P.curve2, w: 2.2 });
      A.line(0, 0, c, 0, { color: P.curve4, w: 2.2 });
      A.rect(c - 0.09 * a, 0, c, 0.09 * a, { stroke: P.muted, w: 1 });   // 直角标记
      A.dot(0, 0, { color: P.muted, r: 3 }); A.dot(c, x, { color: P.curve, r: 4, ring: true });
      A.text(c / 2, -0.12 * a, '√(a²−x²)', { color: P.curve4, size: 11.5, align: 'center', base: 'top' });
      A.text(c + 0.05, x / 2, 'x', { color: P.curve2, size: 12.5 });
      A.text(c / 2 - 0.05, x / 2 + 0.07, 'a', { color: P.curve, size: 12.5, align: 'right' });
      A.text(0.19 * a, 0.13 * a, 'θ', { color: P.text, size: 13 });
      A.text(2.3, 2.25, 'x = a sin θ = ' + fmt(x, 3), { color: P.text, size: 12, align: 'right', bg: P.band });
      /* 右：半圆面积与面积元 */
      B.axes();
      B.fn(function (t) { return Math.sqrt(Math.max(0, a * a - t * t)); }, { color: P.curve, w: 2.2 });
      B.fillBetween(function (t) { return Math.sqrt(Math.max(0, a * a - t * t)); }, null, 0, x, { fill: P.fill3, n: 260 });
      B.rect(x, 0, Math.min(x + dx, a), this.sq(a, x), { fill: P.fill2, stroke: P.curve2, w: 1.2 });
      B.dot(x, this.sq(a, x), { color: P.curve2, r: 4.5, ring: true });
      B.line(x, 0, x, this.sq(a, x), { color: P.curve2, w: 1.2, dash: [4, 3] });
      B.line(-a, 0, a, 0, { color: P.axis, w: 1.2 });
      B.text(-a + 0.06, 0.16, '−a', { color: P.muted, size: 11 });
      B.text(a - 0.06, 0.16, 'a', { color: P.muted, size: 11 });
      B.text(x, this.sq(a, x), ' 面积元 dx = a cos θ dθ', { color: P.curve2, size: 11, bg: P.band });
      B.text(2.3, 2.2, '绿色面积 = ∫₀ˣ√(a²−t²)dt', { color: P.curve3, size: 11.5, align: 'right', bg: P.band });
    },
    read: function (s) {
      var a = s.a, th = s.th, x = this.X(a, th), c = this.C(a, th), sq = this.sq(a, x);
      var S1 = this.areaX(a, x), S2 = this.areaT(a, th), cl = this.closed(a, th);
      var dq = (this.X(a, th + 1e-6) - this.X(a, th - 1e-6)) / 2e-6;
      return [
        ['斜边 a / 角 θ', fmt(a, 2) + ' , ' + fmt(th, 3) + ' rad = ' + fmt(th * 180 / Math.PI, 1) + '°'],
        ['x = a sin θ', fmt(x)],
        ['√(a²−x²)', fmt(sq)],
        ['a cos θ', fmt(c)],
        ['误差 |√(a²−x²) − a cos θ|（验收 <1e-6）', Math.abs(sq - c) < 1e-15 ? '0' : Math.abs(sq - c).toExponential(2)],
        ['dx/dθ = a cos θ', fmt(c) + '（数值差商 ' + fmt(dq) + '）'],
        ['∫₀ˣ√(a²−t²) dt（原变量）', fmt(S1)],
        ['a²∫₀^θ cos²φ dφ（换元后）', fmt(S2)],
        ['两者之差（验收 <1e-6）', Math.abs(S1 - S2) < 1e-12 ? '0' : Math.abs(S1 - S2).toExponential(2)],
        ['闭式 a²/2·(θ + sin θ cos θ)', fmt(cl)],
        ['与闭式之差', Math.abs(S1 - cl) < 1e-12 ? '0' : Math.abs(S1 - cl).toExponential(2)],
        ['勾股 x² + (a cos θ)² − a²', Math.abs(x * x + c * c - a * a) < 1e-15 ? '0' : (x * x + c * c - a * a).toExponential(2)]
      ];
    },
    assert: function () {
      var L = this, out = [], bad1 = [], bad2 = [], bad3 = [], bad4 = [];
      var cases = [[1.2, 0.9], [1.2, 0.3], [0.7, 1.2], [2, 0.6], [2, 1.45], [0.9, 0.05]];
      /* 断言 1（验收条款）：换元反演 x = a sin(asin(x/a)) 相对误差 <1e-6 */
      cases.forEach(function (c) {
        var x = L.X(c[0], c[1]), back = c[0] * Math.sin(Math.asin(x / c[0])), rel = Math.abs(back - x) / Math.max(1e-12, Math.abs(x));
        if (!(rel < 1e-6)) bad1.push('a=' + c[0] + ' θ=' + c[1] + ' rel=' + rel.toExponential(2));
      });
      out.push({ name: 'trigsub: 换元反演 a·sin(asin(x/a)) = x 相对误差 <1e-6（6 组，验收条款）', ok: bad1.length === 0, detail: bad1.join(';') || 'ok' });
      /* 断言 2：√(a²−x²) = a cos θ 误差 <1e-6 */
      cases.forEach(function (c) {
        var x = L.X(c[0], c[1]), d = Math.abs(L.sq(c[0], x) - L.C(c[0], c[1]));
        if (!(d < 1e-6)) bad2.push('a=' + c[0] + ' θ=' + c[1] + ' err=' + d.toExponential(2));
      });
      out.push({ name: 'trigsub: √(a²−x²) = a cos θ 误差 <1e-6（6 组）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3（验收条款）：面积反演 ∫₀ˣ√(a²−t²)dt = a²∫₀^θ cos²φ dφ 误差 <1e-6 */
      cases.forEach(function (c) {
        var x = L.X(c[0], c[1]), d = Math.abs(L.areaX(c[0], x) - L.areaT(c[0], c[1]));
        if (!(d < 1e-6)) bad3.push('a=' + c[0] + ' θ=' + c[1] + ' err=' + d.toExponential(2));
      });
      out.push({ name: 'trigsub: 换元前后面积 ∫₀ˣ√(a²−t²)dt = a²∫₀^θ cos²φ dφ 误差 <1e-6（6 组，验收条款）', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4：闭式 a²/2(θ+sin θ cos θ) <1e-6；勾股恒等式 <1e-12；dx/dθ 数值差商 = a cos θ <1e-6 */
      cases.forEach(function (c) {
        var a = c[0], th = c[1], x = L.X(a, th);
        if (!(Math.abs(L.areaX(a, x) - L.closed(a, th)) < 1e-6)) bad4.push('闭式 a=' + a + ' θ=' + th);
        if (!(Math.abs(x * x + L.C(a, th) * L.C(a, th) - a * a) < 1e-12)) bad4.push('勾股 a=' + a + ' θ=' + th);
        var h = 1e-6, dq = (L.X(a, th + h) - L.X(a, th - h)) / (2 * h);
        if (!(Math.abs(dq - L.C(a, th)) < 1e-6)) bad4.push('dx/dθ a=' + a + ' θ=' + th + ' err=' + Math.abs(dq - L.C(a, th)).toExponential(2));
      });
      out.push({ name: 'trigsub: 闭式 a²/2(θ+sin θcos θ) 误差 <1e-6、勾股恒等式 <1e-12、dx/dθ=a cos θ 差商一致 <1e-6', ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
      /* 断言 5：两种反演角一致 asin(x/a) = atan(x/√(a²−x²))；且 θ=π/2 时面积 = 四分之一圆 */
      cases.forEach(function (c) {
        var a = c[0], th = c[1], x = L.X(a, th);
        var d = Math.abs(Math.asin(x / a) - Math.atan(x / L.sq(a, x)));
        if (!(d < 1e-12)) bad4.push('两种反演 a=' + a + ' θ=' + th + ' err=' + d.toExponential(2));
      });
      var quarter = Math.PI * 1.44 / 4, got = L.areaX(1.2, 1.2);
      out.push({ name: 'trigsub: asin(x/a)=atan(x/√(a²−x²)) <1e-12；半径 1.2 的四分之一圆面积 πa²/4 误差 <1e-6（实测 ' + got.toFixed(6) + ' vs ' + quarter.toFixed(6) + '）', ok: Math.abs(got - quarter) < 1e-6, detail: 'err=' + Math.abs(got - quarter).toExponential(2) });
      return out;
    }
  });

  /* ================= 第 09 章：收敛半径与比值判定 ================= */
  lab({
    id: 'radius',
    ch: '09',
    title: '收敛半径与比值判定',
    sub: '拖动 x 与项数 N：左图看 |aₙxⁿ| 是否在衰减，右图看部分和 S_N 是否停在一个数上。',
    tex: '\\lim_{n\\to\\infty}\\left|\\frac{a_{n+1}x^{n+1}}{a_{n}x^{n}}\\right|<1,\\qquad \\sum_{n=0}^{\\infty}x^{n}=\\frac{1}{1-x}\\quad(|x|<1)',
    note: '比值判据只看相邻两项之比的极限：小于 1 必收敛，大于 1 必发散，等于 1 才要另想办法（这就是端点要单独讨论的原因）。' +
      '左图是「项在不在变小」，右图是「部分和有没有停下来」——两者由同一个 |x|/R 决定。' +
      '本轮验收要求几何级数部分和与解析值的误差随 N 下降（降到 1e-16 量级就撞上双精度舍入下限，不再变化），并在 N=60 时 <1e-9。',
    panes: 2,
    view: { x0: -1, x1: 62, y0: -20, y1: 2 },
    view2: { x0: -1, x1: 62, y0: -4, y1: 4 },
    ctrls: [
      { k: 'k', label: '级数', type: 'sel', val: 'geom', opts: [['geom', 'Σ xⁿ（R = 1）'], ['exp', 'Σ xⁿ/n!（R = ∞）'], ['ln', 'Σ xⁿ/n（R = 1）'], ['n2', 'Σ xⁿ/n²（R = 1）']] },
      { k: 'x', label: 'x', min: -1.5, max: 1.5, step: 0.01, val: 0.5 },
      { k: 'N', label: '项数 N', min: 1, max: 60, step: 1, val: 20 }
    ],
    spec: function (k) {
      var fact = function (n) { var s = 1, i; for (i = 2; i <= n; i++) s *= i; return s; };
      if (k === 'exp') return { label: 'Σ xⁿ/n!', R: Infinity, a: function (n) { return 1 / fact(n); }, ratio: function (n) { return 1 / (n + 1); },
        S: Math.exp, Sname: 'eˣ', end: '没有端点：处处收敛（R = ∞）' };
      if (k === 'ln') return { label: 'Σ xⁿ/n（n≥1）', R: 1, a: function (n) { return n === 0 ? 0 : 1 / n; }, ratio: function (n) { return n === 0 ? 1 : n / (n + 1); },
        S: function (x) { return -Math.log(1 - x); }, Sname: '−ln(1−x)', end: 'x=1 发散（调和级数）；x=−1 收敛（交错调和 → −ln 2）' };
      if (k === 'n2') return { label: 'Σ xⁿ/n²（n≥1）', R: 1, a: function (n) { return n === 0 ? 0 : 1 / (n * n); }, ratio: function (n) { return n === 0 ? 1 : (n * n) / ((n + 1) * (n + 1)); },
        S: null, Sname: '无初等闭式（用 200000 项数值参考）', end: 'x=1 与 x=−1 都收敛（p=2：π²/6 与 −π²/12）' };
      return { label: 'Σ xⁿ', R: 1, a: function () { return 1; }, ratio: function () { return 1; },
        S: function (x) { return 1 / (1 - x); }, Sname: '1/(1−x)', end: 'x=1 与 x=−1 都发散（项不趋于 0）' };
    },
    /* 逐项直接求值 t_n = a_n·xⁿ。
       注意别写成递推 t_n = t_{n-1}·x·ratio(n−1)：Σxⁿ/n 与 Σxⁿ/n² 的 a_0 = 0，
       递推会把后面所有项都乘成 0（本轮踩过的坑）。 */
    seq: function (k, x, N) {
      var sp = this.spec(k), ts = [], S = [], acc = 0, n, t;
      for (n = 0; n <= N; n++) { t = sp.a(n) * Math.pow(x, n); ts.push(t); acc += t; S.push(acc); }
      return { terms: ts, sums: S, sp: sp };
    },
    refSum: function (k, x) {                                  // 解析和优先；无闭式时用 200000 项数值参考
      var sp = this.spec(k), acc = 0, n;
      if (sp.S && (sp.R === Infinity || Math.abs(x) < sp.R)) return sp.S(x);
      for (n = 0; n <= 200000; n++) acc += sp.a(n) * Math.pow(x, n);
      return acc;
    },
    draw: function (v, s) {
      var P = pal(), A = v[0], B = v[1], N = Math.round(s.N), D = this.seq(s.k, s.x, N), sp = D.sp;
      var conv = sp.R === Infinity || Math.abs(s.x) < sp.R, i, ys = [], t;
      /* 左：log₁₀|aₙxⁿ| 的逐项衰减 */
      for (i = 0; i <= N; i++) { t = Math.abs(D.terms[i]); ys.push(t > 0 ? Math.log(t) / Math.LN10 : -20); }
      var lo = Math.min.apply(null, ys) - 1, hi = Math.max.apply(null, ys) + 1;
      A.y0 = lo; A.y1 = hi;
      A.axes();
      A.line(A.x0, 0, A.x1, 0, { color: P.muted, w: 1.2, dash: [5, 4] });          // |项| = 1
      for (i = 0; i <= N; i++) A.line(i, 0, i, ys[i], { color: conv ? P.curve : P.curve2, w: 1.4 });
      for (i = 0; i <= N; i++) A.dot(i, ys[i], { color: conv ? P.curve : P.curve2, r: 2.2 });
      A.text(A.x1 - 0.5, hi - (hi - lo) * 0.06, (conv ? '项在衰减 → 收敛' : '项在增大 → 发散'), { color: conv ? P.curve : P.curve2, size: 12, align: 'right', bg: P.band });
      A.text(A.x1 - 0.5, lo + (hi - lo) * 0.06, '横轴 n，纵轴 log₁₀|aₙxⁿ|', { color: P.muted, size: 11, align: 'right', bg: P.band });
      /* 右：部分和 S_N */
      var S = D.sums, sLo = Math.min.apply(null, S), sHi = Math.max.apply(null, S), ref = null;
      if (conv && isFinite(sHi)) ref = this.refSum(s.k, s.x);
      if (ref !== null && isFinite(ref)) { sLo = Math.min(sLo, ref); sHi = Math.max(sHi, ref); }
      var pad = Math.max(0.5, (sHi - sLo) * 0.18);
      B.y0 = sLo - pad; B.y1 = sHi + pad;
      B.axes();
      if (ref !== null && isFinite(ref)) {
        B.line(B.x0, ref, B.x1, ref, { color: P.curve3, w: 1.6, dash: [6, 4] });
        B.text(B.x1 - 0.5, ref, ' 收敛到 ' + fmt(ref, 4), { color: P.curve3, size: 11.5, align: 'right', bg: P.band });
      }
      B.poly(S.map(function (y, n) { return [n, y]; }), { stroke: conv ? P.curve : P.curve2, w: 2.2 });
      B.dot(N, S[N], { color: conv ? P.curve : P.curve2, r: 4.5, ring: true });
      B.text(B.x1 - 0.5, B.y1 - (B.y1 - B.y0) * 0.08, '部分和 S_N（N = ' + N + '）', { color: P.text, size: 12, align: 'right', bg: P.band });
      B.text(B.x1 - 0.5, B.y0 + (B.y1 - B.y0) * 0.08, sp.end, { color: P.muted, size: 10.5, align: 'right', bg: P.band });
    },
    read: function (s) {
      var N = Math.round(s.N), D = this.seq(s.k, s.x, N), sp = D.sp;
      var conv = sp.R === Infinity || Math.abs(s.x) < sp.R, tN = D.terms[N], SN = D.sums[N];
      var rho = Math.abs(s.x) * sp.ratio(N), ref = null;
      if (conv) { try { ref = this.refSum(s.k, s.x); } catch (e) { ref = null; } }
      var rows = [
        ['级数 / 收敛半径 R', sp.label + '，R = ' + (sp.R === Infinity ? '∞' : sp.R)],
        ['x / |x| 与 R 的关系', fmt(s.x, 2) + '，|x| = ' + fmt(Math.abs(s.x), 2) + (sp.R === Infinity ? '（R=∞，恒收敛）' : Math.abs(s.x) < sp.R ? ' < R → 收敛' : Math.abs(s.x) > sp.R ? ' > R → 发散' : ' = R → 端点，需单独判定')],
        ['比值 |t_{n+1}/t_n| = |x|·|a_{n+1}/a_n|（n=N）', fmt(rho)],
        ['末项 |a_N x^N|', fmt(Math.abs(tN)) === '0' ? '0' : fmt(tN)],
        ['末项 log₁₀|a_N x^N|', isFinite(tN) && tN !== 0 ? fmt(Math.log(Math.abs(tN)) / Math.LN10, 3) : '—'],
        ['部分和 S_N', fmt(SN)],
        ['解析和 / 参考值', ref === null ? '—（发散或端点，无有限和）' : fmt(ref) + (sp.S ? '（' + sp.Sname + '）' : '（数值参考）')],
        ['误差 |S_N − 和|', ref === null ? '—' : (Math.abs(SN - ref) < 1e-15 ? '0' : Math.abs(SN - ref).toExponential(2))],
        ['端点行为', sp.end]
      ];
      return rows;
    },
    assert: function () {
      var L = this, out = [], bad1 = [], bad2 = [], bad3 = [], bad4 = [];
      /* 断言 1（验收条款）：几何级数部分和与解析值的误差随 N 下降，N=60 时 <1e-9。
         注意误差 = |x|^(N+1)/|1−x| 到 1e-16 量级就撞上双精度舍入下限（不再严格下降），
         故「严格单调」只在误差 > 1e-13 的区间上要求，解析预测也取 pred > 1e-12 的最大 N 比对。 */
      [0.5, -0.5, 0.35, -0.35, 0.2, -0.2].forEach(function (x) {
        var prev = Infinity, n, errs = [], preds = [];
        for (n = 1; n <= 60; n++) {
          var e = Math.abs(L.seq('geom', x, n).sums[n] - 1 / (1 - x));
          errs.push(e); preds.push(Math.pow(Math.abs(x), n + 1) / Math.abs(1 - x));
          if (prev > 1e-13 && !(e <= prev * (1 + 1e-9))) bad1.push('x=' + x + ' N=' + n + ' 误差未下降');
          prev = e;
        }
        if (!(errs[59] < 1e-9)) bad1.push('x=' + x + ' err(60)=' + errs[59].toExponential(2));
        var m = 0; for (n = 0; n < 60; n++) if (preds[n] > 1e-12) m = n;
        if (!(Math.abs(errs[m] - preds[m]) <= 1e-13 + 0.02 * preds[m])) bad1.push('x=' + x + ' 与解析误差预测不符（N=' + (m + 1) + ' err=' + errs[m].toExponential(2) + ' pred=' + preds[m].toExponential(2) + '）');
      });
      out.push({ name: 'radius: 几何级数误差随 N 下降（误差 >1e-13 段严格单调）直至双精度舍入下限，N=60 时 <1e-9，并与解析预测 |x|⁽ᴺ⁺¹⁾/|1−x| 相符（6 个 x）', ok: bad1.length === 0, detail: bad1.join(';') || 'ok' });
      /* 断言 2：|x| 越靠近 R=1，同一 N 的误差越大（收敛越慢）；|x|>R 时部分和无界增长 */
      ['geom', 'ln', 'n2'].forEach(function (k) {
        var e05 = Math.abs(L.seq(k, 0.5, 60).sums[60] - L.refSum(k, 0.5));
        var e09 = Math.abs(L.seq(k, 0.9, 60).sums[60] - L.refSum(k, 0.9));
        var e095 = Math.abs(L.seq(k, 0.95, 60).sums[60] - L.refSum(k, 0.95));
        if (!(e05 < e09 && e09 < e095)) bad2.push(k + ' 误差未随 |x|→R 变大（0.5/0.9/0.95 → ' + e05.toExponential(2) + '/' + e09.toExponential(2) + '/' + e095.toExponential(2) + '）');
        /* 发散判据用 S₁₀₀ → S₂₀₀（同一 N 跨度下 Σxⁿ/n、Σxⁿ/n² 的增长远小于几何级数，10× 会误判） */
        var s0 = Math.abs(L.seq(k, 1.1, 100).sums[100]), s1 = Math.abs(L.seq(k, 1.1, 200).sums[200]);
        if (!(s1 > s0 * 5)) bad2.push(k + ' x=1.1 部分和未无界增长（S₁₀₀=' + s0.toFixed(2) + ' → S₂₀₀=' + s1.toFixed(2) + '）');
      });
      var eExp = Math.abs(L.seq('exp', 5, 60).sums[60] - Math.exp(5));
      if (!(eExp < 1e-9)) bad2.push('exp x=5 err=' + eExp.toExponential(2));
      out.push({ name: 'radius: |x| 越靠近 R 同一 N 的误差越大（0.5<0.9<0.95，R=1 三条系列）、|x|=1.1 部分和无界增长，R=∞ 的 Σxⁿ/n! 在 x=5 处 err<1e-9', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：端点行为——Σ1/n 发散、Σ(−1)ⁿ/n → −ln2、Σ1/n² → π²/6、Σ(−1)ⁿ/n² → −π²/12 */
      var h2000 = L.seq('ln', 1, 2000).sums[2000];
      if (!(h2000 > 7.5)) bad3.push('调和级数 S₂₀₀₀=' + h2000.toFixed(4));
      var alt2000 = L.seq('ln', -1, 2000).sums[2000];
      if (!(Math.abs(alt2000 + Math.log(2)) < 1e-3)) bad3.push('交错调和 err=' + Math.abs(alt2000 + Math.log(2)).toExponential(2));
      var z2 = L.seq('n2', 1, 2000).sums[2000];
      if (!(Math.abs(z2 - Math.PI * Math.PI / 6) < 1e-3)) bad3.push('Σ1/n² err=' + Math.abs(z2 - Math.PI * Math.PI / 6).toExponential(2));
      var z2m = L.seq('n2', -1, 2000).sums[2000];
      if (!(Math.abs(z2m + Math.PI * Math.PI / 12) < 1e-3)) bad3.push('Σ(−1)ⁿ/n² err=' + Math.abs(z2m + Math.PI * Math.PI / 12).toExponential(2));
      out.push({ name: 'radius: 端点行为 S₂₀₀₀(1/n)>7.5；交错调和→−ln2、Σ1/n²→π²/6、Σ(−1)ⁿ/n²→−π²/12 误差 <1e-3', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4：比值判据自洽——|x|<R 时末项比值 <1 且项单调衰减；|x|>R 时（n 足够大后）项在增长 */
      ['geom', 'ln', 'n2'].forEach(function (k) {
        var D = L.seq(k, 0.9, 60), i, dec = true, start = 1;
        while (start <= 60 && D.terms[start - 1] === 0) start++;      // Σxⁿ/n、Σxⁿ/n² 的 a₀=0，跳过起始零项
        for (i = start; i <= 60; i++) if (!(Math.abs(D.terms[i]) < Math.abs(D.terms[i - 1]) + 1e-15)) dec = false;
        if (!dec) bad4.push(k + ' x=0.9 项未单调衰减');
        if (!(0.9 * L.spec(k).ratio(60) < 1)) bad4.push(k + ' 比值 ≥1');
        var G = L.seq(k, 1.1, 60);
        if (!(Math.abs(G.terms[60]) > Math.abs(G.terms[30]))) bad4.push(k + ' x=1.1 项未增长');
      });
      var rExp60 = 5 * L.spec('exp').ratio(60);
      if (!(rExp60 < 1)) bad4.push('exp 比值 ≥1');
      if (!(L.refSum('geom', 0.4) - 1 / (1 - 0.4) === 0 && Math.abs(L.refSum('exp', 2) - Math.exp(2)) < 1e-12)) bad4.push('解析和自洽检查失败');
      out.push({ name: 'radius: 比值判据自洽（|x|=0.9 项单调衰减且比值<1；|x|=1.1 末项增长）与解析和自洽 <1e-12', ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
      return out;
    }
  });

  /* ================= 第 10 章：参数曲线速度与弧长 ================= */
  lab({
    id: 'paramcurve',
    ch: '10',
    title: '参数曲线的速度矢量与弧长',
    sub: '拖动 t：左图给出位置矢量 r(t)、速度矢量 v(t) 与走过的弧，右图给出速率 |v(t)| 与累计弧长 s(t)。',
    tex: '\\mathbf{v}(t)=\\langle x\'(t),\\,y\'(t)\\rangle,\\qquad s(t)=\\int_{t_0}^{t}\\sqrt{x\'(u)^{2}+y\'(u)^{2}}\\;du',
    note: '参数曲线上的「速度」是矢量：它同时告诉你走多快（速率 |v|）和往哪儿走（方向）；弧长就是把速率沿时间累加。' +
      '左图的弦（虚线）与弧长一比，就能看出「路径长度 ≥ 直线距离」。本轮验收要求折线弧长与显式弧长（2π、8、6 等）的误差 <1e-6。',
    panes: 2,
    view: { x0: -1.3, x1: 1.3, y0: -1.3, y1: 1.3 },
    view2: { x0: -0.3, x1: 6.6, y0: -1, y1: 7 },
    ctrls: [
      { k: 'k', label: '参数化', type: 'sel', val: 'circle', opts: [['circle', '圆 (cos t, sin t)'], ['ellipse', '椭圆 (2cos t, sin t)'], ['cycloid', '摆线 (t−sin t, 1−cos t)'], ['astroid', '星形线 (cos³t, sin³t)']] },
      { k: 't', label: '参数 t', min: 0, max: 6.25, step: 0.01, val: 1.2 },
      { k: 'n', label: '折线段数 n', min: 20, max: 2000, step: 20, val: 200 }
    ],
    curve: function (k) {
      if (k === 'ellipse') return { label: '椭圆 (2cos t, sin t)', fx: function (t) { return 2 * Math.cos(t); }, fy: Math.sin,
        dfx: function (t) { return -2 * Math.sin(t); }, dfy: Math.cos, t0: 0, t1: 2 * Math.PI,
        box: [-2.5, 2.5, -1.5, 1.5], L: 9.688448220547675, Ltxt: '8·E(√3/2) ≈ 9.688448' };
      if (k === 'cycloid') return { label: '摆线 (t−sin t, 1−cos t)', fx: function (t) { return t - Math.sin(t); }, fy: function (t) { return 1 - Math.cos(t); },
        dfx: function (t) { return 1 - Math.cos(t); }, dfy: Math.sin, t0: 0, t1: 2 * Math.PI,
        box: [-0.5, 6.8, -0.5, 2.5], L: 8, Ltxt: '8（一个拱）' };
      if (k === 'astroid') return { label: '星形线 (cos³t, sin³t)', fx: function (t) { var c = Math.cos(t); return c * c * c; }, fy: function (t) { var s = Math.sin(t); return s * s * s; },
        dfx: function (t) { var c = Math.cos(t), s = Math.sin(t); return -3 * c * c * s; }, dfy: function (t) { var c = Math.cos(t), s = Math.sin(t); return 3 * s * s * c; },
        t0: 0, t1: 2 * Math.PI, box: [-1.35, 1.35, -1.35, 1.35], L: 6, Ltxt: '6（四段各 1.5）' };
      return { label: '圆 (cos t, sin t)', fx: Math.cos, fy: Math.sin, dfx: function (t) { return -Math.sin(t); }, dfy: Math.cos,
        t0: 0, t1: 2 * Math.PI, box: [-1.35, 1.35, -1.35, 1.35], L: 2 * Math.PI, Ltxt: '2π' };
    },
    plen: function (k, t0, t1, n) {                             // 折线弧长（不依赖绘图内核，断言可直接用）
      var C = this.curve(k), h = (t1 - t0) / n, s = 0, i, x0 = C.fx(t0), y0 = C.fy(t0), x, y;
      for (i = 1; i <= n; i++) { x = C.fx(t0 + i * h); y = C.fy(t0 + i * h); s += Math.hypot(x - x0, y - y0); x0 = x; y0 = y; }
      return s;
    },
    speed: function (k, t) { var C = this.curve(k); return Math.hypot(C.dfx(t), C.dfy(t)); },
    arcSimpson: function (k, t) { var L = this, C = this.curve(k); return simpson(function (u) { return L.speed(k, u); }, C.t0, t, 20000); },
    total: function (k, n) { var C = this.curve(k); return this.plen(k, C.t0, C.t1, n); },
    draw: function (v, s) {
      var P = pal(), A = v[0], B = v[1], C = this.curve(s.k), t = s.t, n = Math.round(s.n), i;
      var bx = C.box; A.x0 = bx[0]; A.x1 = bx[1]; A.y0 = bx[2]; A.y1 = bx[3];
      A.axes();
      A.param(C.fx, C.fy, C.t0, C.t1, { color: P.grid, w: 1.8 });                      // 整条曲线（灰）
      A.param(C.fx, C.fy, C.t0, t, { color: P.curve3, w: 3 });                         // 已走过的弧
      var x = C.fx(t), y = C.fy(t), vx = C.dfx(t), vy = C.dfy(t), sp = Math.hypot(vx, vy);
      var sc = 0.34 * (bx[1] - bx[0]) / Math.max(1e-6, sp);                            // 速度矢量按比例放大以便观察
      A.line(0, 0, x, y, { color: P.curve4, w: 1.6 });                                 // 位置矢量
      A.text(x / 2, y / 2, ' r(t)', { color: P.curve4, size: 11.5, bg: P.band });
      A.vecArrow(x, y, vx * sc, vy * sc, { color: P.curve2, w: 2, label: ' v(t)', size: 11.5 });
      A.line(C.fx(C.t0), C.fy(C.t0), x, y, { color: P.muted, w: 1.3, dash: [5, 4] });  // 位移弦
      A.text((C.fx(C.t0) + x) / 2, (C.fy(C.t0) + y) / 2, ' 位移', { color: P.muted, size: 11, bg: P.band });
      A.dot(x, y, { color: P.curve, r: 5, ring: true });
      A.dot(C.fx(C.t0), C.fy(C.t0), { color: P.muted, r: 4 });
      A.text(bx[1] - 0.06 * (bx[1] - bx[0]), bx[3] - 0.06 * (bx[3] - bx[2]), C.label, { color: P.text, size: 12, align: 'right', bg: P.band });
      /* 右：速率 |v(t)| 与累计弧长 s(t) */
      var spd = [], arc = [], u, acc = 0, h = (C.t1 - C.t0) / 240, x0 = C.fx(C.t0), y0 = C.fy(C.t0);
      for (i = 0; i <= 240; i++) {
        u = C.t0 + i * h;
        spd.push([u, this.speed(s.k, u)]);
        if (i > 0) { var xx = C.fx(u), yy = C.fy(u); acc += Math.hypot(xx - x0, yy - y0); x0 = xx; y0 = yy; }
        arc.push([u, acc]);
      }
      var hi = Math.max(1e-6, Math.max.apply(null, spd.map(function (p) { return p[1]; })), Math.max.apply(null, arc.map(function (p) { return p[1]; })));
      B.x0 = C.t0; B.x1 = C.t1; B.y0 = -0.06 * hi; B.y1 = hi * 1.12;
      B.axes();
      B.poly(spd, { stroke: P.curve2, w: 2.2 });
      B.poly(arc, { stroke: P.curve3, w: 2.2 });
      B.line(t, B.y0, t, B.y1, { color: P.curve4, w: 1.3, dash: [5, 4] });
      B.dot(t, this.speed(s.k, t), { color: P.curve2, r: 4.5, ring: true });
      B.dot(t, this.plen(s.k, C.t0, t, Math.max(20, n)), { color: P.curve3, r: 4.5, ring: true });
      B.text(B.x1 - 0.06 * (B.x1 - B.x0), hi * 0.96, '橙：速率 |v(t)|', { color: P.curve2, size: 11.5, align: 'right', bg: P.band });
      B.text(B.x1 - 0.06 * (B.x1 - B.x0), hi * 0.6, '绿：累计弧长 s(t)', { color: P.curve3, size: 11.5, align: 'right', bg: P.band });
    },
    read: function (s) {
      var C = this.curve(s.k), t = s.t, n = Math.round(s.n);
      var x = C.fx(t), y = C.fy(t), vx = C.dfx(t), vy = C.dfy(t), sp = Math.hypot(vx, vy);
      var aPoly = this.plen(s.k, C.t0, t, n), aSimp = this.arcSimpson(s.k, t), chord = Math.hypot(x - C.fx(C.t0), y - C.fy(C.t0));
      var tot = this.total(s.k, n);
      return [
        ['参数化', C.label],
        ['参数 t', fmt(t, 3)],
        ['位置 r(t)', '(' + fmt(x) + ', ' + fmt(y) + ')'],
        ['速度 v(t) = (x′, y′)', '(' + fmt(vx) + ', ' + fmt(vy) + ')'],
        ['速率 |v(t)|', fmt(sp)],
        ['累计弧长 s(t)（折线 n=' + n + '）', fmt(aPoly)],
        ['s(t)（∫|v|du，Simpson）', fmt(aSimp)],
        ['两者差（验收 <1e-6）', Math.abs(aPoly - aSimp) < 1e-12 ? '0' : Math.abs(aPoly - aSimp).toExponential(2)],
        ['直线位移 |r(t) − r(t₀)|', fmt(chord)],
        ['弧长 / 位移（≥1，等号仅当走直线）', chord > 1e-12 ? fmt(aPoly / chord) : '—'],
        ['整条曲线弧长（n=' + n + '）', fmt(tot)],
        ['显式弧长', C.Ltxt + (C.L ? '，误差 ' + (Math.abs(tot - C.L) < 1e-15 ? '0' : Math.abs(tot - C.L).toExponential(2)) : '')]
      ];
    },
    assert: function () {
      var L = this, out = [], bad1 = [], bad2 = [], bad3 = [], bad4 = [];
      /* 断言 1（验收条款）：折线弧长（n=200000）与显式弧长误差 <1e-6（圆 2π、摆线 8、星形线 6、椭圆 8E(√3/2)） */
      ['circle', 'cycloid', 'astroid', 'ellipse'].forEach(function (k) {
        var C = L.curve(k), d = Math.abs(L.total(k, 200000) - C.L);
        if (!(d < 1e-6)) bad1.push(k + ' err=' + d.toExponential(2));
      });
      out.push({ name: 'paramcurve: 折线弧长 n=200000 与显式弧长 2π / 8 / 6 / 8E(√3/2) 误差 <1e-6（4 条曲线，验收条款）', ok: bad1.length === 0, detail: bad1.join(';') || 'ok' });
      /* 断言 2：∫|v|du（Simpson）与折线弧长一致 <1e-6；且折线弧长随 n 增大单调递增、不超过弧长 */
      ['circle', 'cycloid', 'astroid', 'ellipse'].forEach(function (k) {
        var C = L.curve(k), d = Math.abs(L.arcSimpson(k, C.t1) - L.total(k, 20000));
        if (!(d < 1e-6)) bad2.push(k + ' Simpson 差=' + d.toExponential(2));
        var prev = -1, seq = [20, 100, 500, 2000, 20000], i;
        for (i = 0; i < seq.length; i++) { var q = L.total(k, seq[i]); if (!(q > prev)) bad2.push(k + ' n=' + seq[i] + ' 非递增'); prev = q; }
        if (!(prev <= C.L + 1e-12)) bad2.push(k + ' n=20000 超过显式弧长');
      });
      out.push({ name: 'paramcurve: Simpson ∫|v|du 与折线弧长一致 <1e-6；折线弧长随 n 单调递增且 ≤ 显式弧长（4 条曲线）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：解析导数与数值差商一致 <1e-6（4 条曲线 × 3 点，双向分量） */
      var h = 1e-6;
      ['circle', 'ellipse', 'cycloid', 'astroid'].forEach(function (k) {
        var C = L.curve(k);
        [0.4, 1.7, 4.4].forEach(function (t) {
          var nx = (C.fx(t + h) - C.fx(t - h)) / (2 * h), ny = (C.fy(t + h) - C.fy(t - h)) / (2 * h);
          var e = Math.max(Math.abs(nx - C.dfx(t)), Math.abs(ny - C.dfy(t)));
          if (!(e < 1e-6)) bad3.push(k + ' t=' + t + ' err=' + e.toExponential(2));
        });
      });
      out.push({ name: 'paramcurve: 解析导数 (x′,y′) 与中心差商一致 <1e-6（4 条曲线 × 3 个 t）', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4：圆上速率恒为 1 且 s(t)=t；折线弧长是内接折线（低估、按 O(h²) 收敛）；弧长 ≥ 弦长 */
      [0.2, 1.5, 3.1, 5.8].forEach(function (t) {
        if (!(Math.abs(L.speed('circle', t) - 1) < 1e-12)) bad4.push('圆的速率 ≠1（t=' + t + '）');
        if (!(Math.abs(L.arcSimpson('circle', t) - t) < 1e-9)) bad4.push('圆上 s(t) ≠ t（Simpson，t=' + t + '）');
        var p = L.plen('circle', 0, t, 20000);            // 内接折线：必然 ≤ t，误差 ≈ t³/(24n²)
        if (!(p <= t + 1e-12)) bad4.push('圆上折线弧长超过 t（t=' + t + '）');
        if (!(t - p < t * t * t / (24 * 20000 * 20000) * 1.5 + 1e-12)) bad4.push('圆上折线弧长误差超 O(h²)（t=' + t + '，差=' + (t - p).toExponential(2) + '）');
      });
      ['circle', 'ellipse', 'cycloid', 'astroid'].forEach(function (k) {
        var C = L.curve(k);
        [0.5, 1.9, 3.3].forEach(function (t) {
          var a = L.plen(k, C.t0, t, 4000), ch = Math.hypot(C.fx(t) - C.fx(C.t0), C.fy(t) - C.fy(C.t0));
          if (!(a >= ch - 1e-9)) bad4.push(k + ' t=' + t + ' 弧长 < 弦长');
        });
      });
      out.push({ name: 'paramcurve: 圆上速率恒 1 且 s(t)=t（Simpson 积分 <1e-9，内接折线按 O(h²) 低估）；4 条曲线的弧长 ≥ 直线位移（12 组）', ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
      /* 断言 5：弧长可加性 s(0→t1)+s(t1→t2)=s(0→t2)（<1e-9）与半圆/半拱自检 */
      var bad5 = [];
      ['circle', 'cycloid', 'astroid'].forEach(function (k) {
        var C = L.curve(k), mid = C.t0 + (C.t1 - C.t0) / 2;
        var d = L.plen(k, C.t0, mid, 2000) + L.plen(k, mid, C.t1, 2000) - L.plen(k, C.t0, C.t1, 4000);
        if (!(Math.abs(d) < 1e-9)) bad5.push(k + ' 可加性差=' + d.toExponential(2));
      });
      if (!(Math.abs(L.plen('circle', 0, Math.PI, 200000) - Math.PI) < 1e-6)) bad5.push('上半圆弧长 ≠ π');
      if (!(Math.abs(L.plen('astroid', 0, Math.PI / 2, 200000) - 1.5) < 1e-6)) bad5.push('星形线一段 ≠ 1.5');
      out.push({ name: 'paramcurve: 弧长可加性 <1e-9；上半圆 = π、星形线一段 = 1.5（误差 <1e-6）', ok: bad5.length === 0, detail: bad5.join(';') || 'ok' });
      return out;
    }
  });

  /* ================= 第 11 章：点积·投影·叉积面积（3D 可旋转） ================= */
  lab({
    id: 'dotcross', ch: '11',
    title: '点积、投影与叉积面积',
    sub: '拖 u、v 的各分量：看夹角与 u 在 v 上的投影，平行四边形面积正好等于 |u×v|',
    tex: '\\mathbf{u}\\cdot\\mathbf{v}=|\\mathbf{u}||\\mathbf{v}|\\cos\\theta,\\qquad |\\mathbf{u}\\times\\mathbf{v}|=|\\mathbf{u}||\\mathbf{v}|\\sin\\theta',
    note: '点积度量「同向程度」（即投影），叉积度量「张开的面积」；两者拼成拉格朗日恒等式 ' +
      '(u·v)²+|u×v|²=|u|²|v|²——边长固定时面积与夹角一一对应。u×v 的箭头按面积缩放显示，只表示方向。',
    dim3: true,
    view: { x0: -2.4, x1: 2.4, y0: -2.4, y1: 2.4, z0: -1, z1: 2.6, yaw: 0.7, pitch: 0.42, labelAuto: true },
    ctrls: [
      { k: 'ux', label: 'u 的 x', min: -2, max: 2, step: 0.1, val: 1.6 },
      { k: 'uy', label: 'u 的 y', min: -2, max: 2, step: 0.1, val: 0.4 },
      { k: 'uz', label: 'u 的 z', min: -2, max: 2, step: 0.1, val: 0.9 },
      { k: 'vx', label: 'v 的 x', min: -2, max: 2, step: 0.1, val: 0.3 },
      { k: 'vy', label: 'v 的 y', min: -2, max: 2, step: 0.1, val: 1.5 },
      { k: 'vz', label: 'v 的 z', min: -2, max: 2, step: 0.1, val: 0.7 }
    ],
    U: function (s) { return [s.ux, s.uy, s.uz]; },
    V: function (s) { return [s.vx, s.vy, s.vz]; },
    ang: function (s) {
      var U = this.U(s), V = this.V(s), su = vlen(U), sv = vlen(V), d = vdot(U, V), c = vcross(U, V);
      return { su: su, sv: sv, dot: d, cr: c, sin: su * sv > 1e-15 ? vlen(c) / (su * sv) : 0, cos: su * sv > 1e-15 ? d / (su * sv) : 0 };
    },
    draw: function (v, s) {
      var P = pal(), U = this.U(s), V = this.V(s), A = this.ang(s);
      v.axes3({ nx: 4, ny: 4 });
      if (A.sin > 1e-6) v.poly3([[0, 0, 0], U, vadd(U, V), V], { fill: P.fill2, stroke: P.curve2, w: 1 });
      var F = vscale(V, vdot(U, V) / Math.max(vdot(V, V), 1e-12));
      v.line3(U, F, { color: P.muted, w: 1, dash: [4, 3] });
      v.arrow3(0, 0, 0, F[0], F[1], F[2], { color: P.curve3, w: 2, label: 'proj', labelDx: 9, labelDy: 15 });
      v.arrow3(0, 0, 0, U[0], U[1], U[2], { color: P.curve, label: 'u', labelOut: true });
      v.arrow3(0, 0, 0, V[0], V[1], V[2], { color: P.curve2, label: 'v', labelOut: true });
      var C = vcross(U, V), sc = vlen(C);
      if (sc > 1e-6) v.arrow3(0, 0, 0, C[0] * 1.3 / sc, C[1] * 1.3 / sc, C[2] * 1.3 / sc, { color: P.curve4, label: 'u×v', labelOut: true });
      v.text3(0, 0, 0, 'O', { color: P.muted, dx: -13, dy: 11, size: 11 });
    },
    read: function (s) {
      var U = this.U(s), V = this.V(s), A = this.ang(s), C = vcross(U, V);
      var th = Math.atan2(A.sin, A.cos) * 180 / Math.PI;
      var F = vscale(V, A.dot / Math.max(vdot(V, V), 1e-12));
      return [
        ['u', '(' + fmt(U[0], 2) + ', ' + fmt(U[1], 2) + ', ' + fmt(U[2], 2) + ')'],
        ['v', '(' + fmt(V[0], 2) + ', ' + fmt(V[1], 2) + ', ' + fmt(V[2], 2) + ')'],
        ['|u| / |v|', fmt(A.su, 3) + ' / ' + fmt(A.sv, 3)],
        ['u·v（实算 / |u||v|cosθ）', fmt(A.dot, 3) + ' / ' + fmt(A.su * A.sv * A.cos, 3)],
        ['夹角 θ', fmt(th, 2) + '°'],
        ['投影分量 u·v/|v|', fmt(A.dot / Math.max(A.sv, 1e-12), 3)],
        ['投影向量 proj_v u', '(' + fmt(F[0], 2) + ', ' + fmt(F[1], 2) + ', ' + fmt(F[2], 2) + ')'],
        ['|u×v|（实算 / |u||v|sinθ）', fmt(vlen(C), 3) + ' / ' + fmt(A.su * A.sv * A.sin, 3)],
        ['误差 |u×v| − |u||v|sinθ（验收 <1e-9）', fmt(Math.abs(vlen(C) - A.su * A.sv * A.sin), 10)],
        ['平行四边形面积 = 底 |v| × 高', fmt(A.sv * (A.su * A.sin), 3)],
        ['拉格朗日残差（(u·v)²+|u×v|²−|u|²|v|²）', fmt((A.dot * A.dot + vlen(C) * vlen(C)) - A.su * A.su * A.sv * A.sv, 10)]
      ];
    },
    assert: function () {
      var L = this, out = [], bad = [];
      /* 断言 1（验收条款）：|u×v| 与 |u||v|sinθ 误差 <1e-9，附点积、垂直性、投影、拉格朗日 */
      var pairs = [
        [[1.6, 0.4, 0.9], [0.3, 1.5, 0.7]],
        [[2, 0, 0], [0, 2, 0]],
        [[1, 1, 1], [-1, 1, 0.5]],
        [[0.6, -1.2, 0.35], [1.1, 0.7, -0.9]],
        [[1, 2, -0.5], [2, 4, -1]]
      ];
      pairs.forEach(function (pr, i) {
        var u = pr[0], v = pr[1], su = vlen(u), sv = vlen(v), c = vcross(u, v), d = vdot(u, v);
        var sin = su * sv > 1e-15 ? vlen(c) / (su * sv) : 0, cos = su * sv > 1e-15 ? d / (su * sv) : 0;
        if (!(Math.abs(vlen(c) - su * sv * sin) < 1e-9)) bad.push('#' + i + ' 面积 ' + Math.abs(vlen(c) - su * sv * sin).toExponential(2));
        if (!(Math.abs(d - su * sv * cos) < 1e-9)) bad.push('#' + i + ' 点积 ' + Math.abs(d - su * sv * cos).toExponential(2));
        var resid = Math.abs((d * d + vlen(c) * vlen(c)) - su * su * sv * sv);
        if (!(resid < 1e-9 * Math.max(1, su * su * sv * sv))) bad.push('#' + i + ' 拉格朗日残差 ' + resid.toExponential(2));
        if (vlen(c) > 1e-12) {
          if (!(Math.abs(vdot(c, u)) / (vlen(c) * su) < 1e-12)) bad.push('#' + i + ' (u×v)·u ≠ 0');
          if (!(Math.abs(vdot(c, v)) / (vlen(c) * sv) < 1e-12)) bad.push('#' + i + ' (u×v)·v ≠ 0');
        }
        if (sv > 1e-12) {
          var F = vscale(v, d / vdot(v, v));
          if (!(Math.abs(vdot(vsub(u, F), v)) < 1e-9)) bad.push('#' + i + ' 投影残差未垂直于 v');
          if (!(vlen(F) <= su + 1e-12)) bad.push('#' + i + ' |proj| > |u|');
        }
      });
      out.push({ name: 'dotcross: |u×v| 与 |u||v|sinθ 误差 <1e-9（5 组含平行退化）+ 垂直性/投影/拉格朗日', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
      /* 断言 2：默认状态自洽（画布上那一屏的读数与解析式一致） */
      var s0 = stateOf(L), A0 = L.ang(s0), bad2 = [];
      if (!(Math.abs(vlen(A0.cr) - A0.su * A0.sv * A0.sin) < 1e-9)) bad2.push('默认状态面积不符');
      if (!(Math.abs(A0.cos * A0.cos + A0.sin * A0.sin - 1) < 1e-12)) bad2.push('sin²+cos²≠1');
      if (!(A0.sin >= 0 && A0.sin <= 1 + 1e-12 && A0.cos >= -1 - 1e-12 && A0.cos <= 1 + 1e-12)) bad2.push('sin/cos 越界');
      out.push({ name: 'dotcross: 默认状态 |u×v|、sin²θ+cos²θ=1、sin/cos 取值范围', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3（验收条款）：3D 视图内标签包围盒两两不相交（默认 + 4 个旋转角） */
      var ov = labelCheck(L, [[0.7, 0.42], [1.6, 0.2], [-0.9, 0.9], [2.4, 0.05], [0.2, 0.75]]);
      out.push({ name: 'dotcross: 3D 视图标签包围盒两两不相交（5 个旋转角 × 页面各档画布几何）', ok: ov.length === 0, detail: ov.join(';') || 'ok' });
      return out;
    }
  });

  /* ================= 第 11 章：平面·法向量·点到平面距离（3D 可旋转） ================= */
  lab({
    id: 'planedist', ch: '11',
    title: '平面、法向量与点到平面距离',
    sub: '拖法向量 n、常数 d 与点 Q：看垂足 H 与距离 |n·Q−d|/|n|，以及过 Q 的直线与平面的交点',
    tex: 'D=\\frac{|\\mathbf{n}\\cdot\\mathbf{Q}-d|}{|\\mathbf{n}|},\\qquad \\mathbf{H}=\\mathbf{Q}-\\frac{\\mathbf{n}\\cdot\\mathbf{Q}-d}{|\\mathbf{n}|^{2}}\\,\\mathbf{n}',
    note: '平面方程 n·X = d 里，n 是法向量、d 决定它离原点多远。把 Q 沿法向量投影到平面上就得到垂足 H；' +
      'Q−H 与 n 平行，其长度就是距离。过 Q 沿方向 w 的直线与平面交于一点当且仅当 n·w ≠ 0。',
    dim3: true,
    view: { x0: -2.4, x1: 2.4, y0: -2.4, y1: 2.4, z0: -2.4, z1: 2.4, yaw: 0.7, pitch: 0.42, labelAuto: true },
    ctrls: [
      { k: 'a', label: 'n 的 x（a）', min: -2, max: 2, step: 0.1, val: 1.2 },
      { k: 'b', label: 'n 的 y（b）', min: -2, max: 2, step: 0.1, val: 0.9 },
      { k: 'c', label: 'n 的 z（c）', min: -2, max: 2, step: 0.1, val: 0.8 },
      { k: 'd', label: '平面常数 d', min: -2, max: 2, step: 0.1, val: 1.1 },
      { k: 'qx', label: 'Q 的 x', min: -2, max: 2, step: 0.1, val: -1.4 },
      { k: 'qy', label: 'Q 的 y', min: -2, max: 2, step: 0.1, val: -0.3 },
      { k: 'qz', label: 'Q 的 z', min: -2, max: 2, step: 0.1, val: 1.2 },
      { k: 'w', label: '直线方向 w', type: 'sel', val: 'slant', opts: [['n', '沿法向 n'], ['slant', '斜向 (1,1,0)'], ['z', '沿 z 轴'], ['x', '沿 x 轴']] }
    ],
    N: function (s) { return [s.a, s.b, s.c]; },
    Q: function (s) { return [s.qx, s.qy, s.qz]; },
    W: function (s) {
      return s.w === 'n' ? this.N(s) : (s.w === 'z' ? [0, 0, 1] : (s.w === 'x' ? [1, 0, 0] : [1, 1, 0]));
    },
    foot: function (s) { var n = this.N(s), Q = this.Q(s); return vsub(Q, vscale(n, (vdot(n, Q) - s.d) / Math.max(vdot(n, n), 1e-15))); },
    dist: function (s) { var n = this.N(s), Q = this.Q(s); return Math.abs(vdot(n, Q) - s.d) / Math.max(vlen(n), 1e-15); },
    /* 过 Q 沿 w 与平面 n·X=d 的交点；平行/无交点返回 null */
    hit: function (s) {
      var n = this.N(s), Q = this.Q(s), w = this.W(s), nw = vdot(n, w);
      if (Math.abs(nw) < 1e-9) return null;
      return vadd(Q, vscale(w, (s.d - vdot(n, Q)) / nw));
    },
    draw: function (v, s) {
      var P = pal(), n = this.N(s), Q = this.Q(s), W = this.W(s), H = this.foot(s), I = this.hit(s);
      v.axes3({ nx: 4, ny: 4 });
      var poly = planePoly3(n, s.d, this.view, 3.2);
      if (poly.length >= 3) v.poly3(poly, { fill: P.fill, stroke: P.curve, w: 1.2 });
      v.line3(vadd(Q, vscale(W, -5)), vadd(Q, vscale(W, 5)), { color: P.curve3, w: 1.5, dash: [6, 4] });
      v.arrow3(H[0], H[1], H[2], H[0] + n[0], H[1] + n[1], H[2] + n[2], { color: P.curve4, label: 'n', labelOut: true });
      v.line3(Q, H, { color: P.curve2, w: 2.2 });
      if (I && vlen(vsub(I, H)) > 1e-6) v.dot3(I[0], I[1], I[2], { color: P.curve3, r: 4 });
      v.dot3(H[0], H[1], H[2], { color: P.curve2, r: 4 });
      v.dot3(Q[0], Q[1], Q[2], { color: P.dot, r: 4.5 });
      v.text3(Q[0], Q[1], Q[2], 'Q', { color: P.text, dx: 8, dy: -9, size: 12 });
      /* H 与 P 常常靠得很近：远则各自沿原点方向外推，近则按投影上下关系推到两侧，避免叠字 */
      var pH = v.project(H[0], H[1], H[2]), pI = I ? v.project(I[0], I[1], I[2]) : null;
      var near = pI && Math.hypot(pI[0] - pH[0], pI[1] - pH[1]) < 30;
      var dH = v.tipDir([0, 0, 0], H, 16), dP = I ? v.tipDir([0, 0, 0], I, 16) : null;
      if (near) { dH = { dx: 12, dy: pH[1] <= pI[1] ? -13 : 15, align: 'left' }; dP = { dx: 12, dy: pH[1] <= pI[1] ? 15 : -13, align: 'left' }; }
      v.text3(H[0], H[1], H[2], 'H', { color: P.curve2, dx: dH.dx, dy: dH.dy, align: dH.align, size: 12 });
      if (I && vlen(vsub(I, H)) > 1e-6) v.text3(I[0], I[1], I[2], 'P', { color: P.curve3, dx: dP.dx, dy: dP.dy, align: dP.align, size: 12 });
    },
    read: function (s) {
      var n = this.N(s), Q = this.Q(s), W = this.W(s), H = this.foot(s), I = this.hit(s), nw = vdot(n, W);
      var rows = [
        ['n', '(' + fmt(n[0], 2) + ', ' + fmt(n[1], 2) + ', ' + fmt(n[2], 2) + ')   |n| = ' + fmt(vlen(n), 3)],
        ['平面方程', fmt(s.a, 2) + 'x + ' + fmt(s.b, 2) + 'y + ' + fmt(s.c, 2) + 'z = ' + fmt(s.d, 2)],
        ['Q', '(' + fmt(Q[0], 2) + ', ' + fmt(Q[1], 2) + ', ' + fmt(Q[2], 2) + ')'],
        ['n·Q − d（有符号偏移）', fmt(vdot(n, Q) - s.d, 3)],
        ['距离 |Q−H|（实算）', fmt(vlen(vsub(Q, H)), 6)],
        ['距离 |n·Q−d|/|n|（公式）', fmt(this.dist(s), 6)],
        ['误差（验收 <1e-9）', fmt(Math.abs(vlen(vsub(Q, H)) - this.dist(s)), 10)],
        ['垂足 H', '(' + fmt(H[0], 2) + ', ' + fmt(H[1], 2) + ', ' + fmt(H[2], 2) + ')'],
        ['校验 n·H − d（应为 0）', fmt(vdot(n, H) - s.d, 10)],
        ['n·w（≠0 才有交点）', fmt(nw, 3)]
      ];
      rows.push(I
        ? ['交点 P', '(' + fmt(I[0], 2) + ', ' + fmt(I[1], 2) + ', ' + fmt(I[2], 2) + ')   n·P−d = ' + fmt(vdot(n, I) - s.d, 10)]
        : ['交点 P', Math.abs(vdot(n, Q) - s.d) < 1e-9 ? '直线在平面上（无穷多交点）' : 'n·w = 0：直线平行于平面，无交点']);
      return rows;
    },
    assert: function () {
      var L = this, out = [], bad = [];
      /* 断言 1（验收条款）：距离的几何实算 |Q−H| 与公式 |n·Q−d|/|n| 误差 <1e-9 */
      var cases = [
        { a: 1.2, b: 0.9, c: 0.8, d: 1.1, qx: -1.4, qy: -0.3, qz: 1.2 },
        { a: 2, b: 0, c: 0, d: 1, qx: -0.7, qy: 1.3, qz: -1.9 },
        { a: -0.6, b: 1.4, c: -1.1, d: -1.3, qx: 1.5, qy: -1.8, qz: 0.4 },
        { a: 0.3, b: 0.25, c: 0.2, d: 0.5, qx: -2, qy: 2, qz: -2 },
        { a: 1, b: -1, c: 0.5, d: 0.4, qx: 0.8, qy: 0.6, qz: -0.5 }
      ];
      cases.forEach(function (c, i) {
        var H = L.foot(c), d1 = vlen(vsub(L.Q(c), H)), d2 = L.dist(c);
        if (!(Math.abs(d1 - d2) < 1e-9)) bad.push('#' + i + ' |Q−H|=' + d1.toFixed(12) + ' vs 公式=' + d2.toFixed(12));
        if (!(Math.abs(vdot(L.N(c), H) - c.d) < 1e-9)) bad.push('#' + i + ' 垂足不在平面上');
        if (vlen(L.N(c)) > 1e-9 && d1 > 1e-9) {
          var cr = vcross(vsub(L.Q(c), H), L.N(c));
          if (!(vlen(cr) / (d1 * vlen(L.N(c))) < 1e-12)) bad.push('#' + i + ' Q−H 不平行于 n');
        }
      });
      out.push({ name: 'planedist: 距离 |Q−H| 与 |n·Q−d|/|n| 误差 <1e-9（5 组，含 Q 在平面上）；垂足在平面上且 Q−H ∥ n', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
      /* 断言 2：距离是最小值 —— 平面上采样点的距离都不小于它 */
      var bad2 = [], c0 = cases[0], n0 = L.N(c0), H0 = L.foot(c0);
      var nn = vunit(n0), e1 = vunit(vcross(nn, Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), e2 = vcross(nn, e1), D = L.dist(c0), cnt = 0;
      for (var i = -8; i <= 8; i++) for (var j = -8; j <= 8; j++) {
        var X = vadd(H0, vadd(vscale(e1, i * 0.25), vscale(e2, j * 0.25)));
        cnt++;
        if (vlen(vsub(L.Q(c0), X)) < D - 1e-9) bad2.push('采样点 ' + i + ',' + j + ' 比垂足更近');
      }
      out.push({ name: 'planedist: 垂足是最近点（平面内 ' + cnt + ' 个采样点都不比它近，容差 1e-9）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：过 Q 沿 w 的直线与平面的交点（n·w≠0）在平面上且在直线上；n·w=0 时判为平行 */
      var bad3 = [], keys = ['n', 'slant', 'z', 'x'];
      keys.forEach(function (k) {
        var s = { a: 1.2, b: 0.9, c: 0.8, d: 1.1, qx: -1.4, qy: -0.3, qz: 1.2, w: k };
        var I = L.hit(s), w = L.W(s), nw = vdot(L.N(s), w);
        if (Math.abs(nw) < 1e-9) { if (I !== null) bad3.push(k + ' 平行却给出了交点'); return; }
        if (!I) { bad3.push(k + ' 应有交点却为 null'); return; }
        if (!(Math.abs(vdot(L.N(s), I) - s.d) < 1e-9)) bad3.push(k + ' 交点不在平面上');
        var cr = vcross(vsub(I, L.Q(s)), w);
        if (!(vlen(cr) / (vlen(w) * vlen(vsub(I, L.Q(s))) + 1e-12) < 1e-12)) bad3.push(k + ' 交点不在直线上（叉积残差）');
      });
      /* 两种退化：方向 ⟂ n 且 Q 不在平面上（平行，无交点）；Q 落在平面上（交点即 Q） */
      var par = { a: 1, b: 0, c: 0, d: 0.7, qx: 1.3, qy: 1.1, qz: -0.4, w: 'z' };
      var inpl = { a: 1, b: 0, c: 0, d: 0.7, qx: 0.7, qy: 1.1, qz: -0.4, w: 'slant' };
      if (L.hit(par) !== null) bad3.push('n·w=0 且 Q 不在平面上，未判为无交点');
      var ip = L.hit(inpl);
      if (!(ip && vlen(vsub(ip, L.Q(inpl))) < 1e-12 && Math.abs(vdot(L.N(inpl), ip) - inpl.d) < 1e-9)) bad3.push('Q 在平面上时交点应为 Q 本身');
      out.push({ name: 'planedist: 直线与平面交点（沿法向/斜向/z/x 四方向）在平面上且在直线上；n·w=0 判为平行', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4（验收条款）：3D 视图标签包围盒两两不相交 */
      var ov = labelCheck(L, [[0.7, 0.42], [1.6, 0.2], [-0.9, 0.9], [2.4, 0.05], [0.2, 0.75]]);
      out.push({ name: 'planedist: 3D 视图标签包围盒两两不相交（5 个旋转角 × 页面各档画布几何）', ok: ov.length === 0, detail: ov.join(';') || 'ok' });
      return out;
    }
  });

  /* ================= 第 12 章：空间曲线 TNB 框架与曲率圆（3D 可旋转） ================= */
  lab({
    id: 'tnb', ch: '12',
    title: '空间曲线的 TNB 框架与曲率圆',
    sub: '螺旋线上拖 t₀：单位切向量 T、主法向量 N、副法向量 B 两两垂直，曲率圆半径就是 1/κ',
    tex: '\\mathbf{T}=\\frac{\\mathbf{r}\'}{|\\mathbf{r}\'|},\\quad \\mathbf{N}=\\frac{\\mathbf{T}\'}{|\\mathbf{T}\'|},\\quad \\mathbf{B}=\\mathbf{T}\\times\\mathbf{N},\\quad \\kappa=\\frac{|\\mathbf{r}\'\\times\\mathbf{r}\'\'|}{|\\mathbf{r}\'|^{3}}',
    note: 'T 指向运动方向，N 指向曲线拐弯的一侧，B = T×N 补成右手系；三者都是单位向量且两两垂直。' +
      '螺旋线 r=(a cos t, a sin t, b t) 的曲率与挠率都是常数：κ=a/(a²+b²)、τ=b/(a²+b²)。' +
      '曲率圆与该点处曲线同切、同曲率：半径 1/κ，圆心 C = r + N/κ。',
    dim3: true,
    view: { x0: -2.2, x1: 2.2, y0: -2.2, y1: 2.2, z0: -3.6, z1: 3.6, yaw: 0.7, pitch: 0.42, labelAuto: true },
    ctrls: [
      { k: 'a', label: '半径 a', min: 0.6, max: 2, step: 0.05, val: 1.4 },
      { k: 'b', label: '螺距参数 b', min: 0.05, max: 0.8, step: 0.05, val: 0.35 },
      { k: 't0', label: '参数 t₀', min: -9, max: 9, step: 0.1, val: 1.4 }
    ],
    R: function (a, b, t) { return [a * Math.cos(t), a * Math.sin(t), b * t]; },
    dR: function (a, b, t) { return [-a * Math.sin(t), a * Math.cos(t), b]; },
    ddR: function (a, b, t) { return [-a * Math.cos(t), -a * Math.sin(t), 0]; },
    dddR: function (a, b, t) { return [a * Math.sin(t), -a * Math.cos(t), 0]; },
    /* 解析 TNB 与 κ、τ（螺旋线可闭式求出，便于和数值式对照） */
    frame: function (a, b, t) {
      var r = this.R(a, b, t), v = this.dR(a, b, t), ac = this.ddR(a, b, t), jk = this.dddR(a, b, t);
      var T = vunit(v), N = vunit(ac), B = vcross(T, N), cr = vcross(v, ac);
      return { r: r, v: v, ac: ac, T: T, N: N, B: B, sp: vlen(v),
        kap: vlen(cr) / Math.pow(vlen(v), 3),
        tau: vdot(cr, jk) / Math.max(vdot(cr, cr), 1e-15) };
    },
    /* 曲率圆心与半径 */
    circle: function (a, b, t) {
      var f = this.frame(a, b, t), R = 1 / Math.max(f.kap, 1e-12);
      return { f: f, R: R, C: vadd(f.r, vscale(f.N, R)) };
    },
    draw: function (v, s) {
      var P = pal(), cc = this.circle(s.a, s.b, s.t0), f = cc.f, C = cc.C, R1 = cc.R;
      v.axes3({ nx: 4, ny: 4 });
      v.curve3(function (t) { return s.a * Math.cos(t); }, function (t) { return s.a * Math.sin(t); },
        function (t) { return s.b * t; }, -3 * Math.PI, 3 * Math.PI, { color: P.curve3, w: 2, n: 420 });
      v.curve3(function (ph) { return C[0] + R1 * (-Math.cos(ph) * f.N[0] + Math.sin(ph) * f.T[0]); },
        function (ph) { return C[1] + R1 * (-Math.cos(ph) * f.N[1] + Math.sin(ph) * f.T[1]); },
        function (ph) { return C[2] + R1 * (-Math.cos(ph) * f.N[2] + Math.sin(ph) * f.T[2]); },
        0, 2 * Math.PI, { color: P.curve2, w: 1.3, dash: [5, 4], n: 140 });
      v.line3(f.r, C, { color: P.curve2, w: 1.2, dash: [3, 3] });
      v.arrow3(f.r[0], f.r[1], f.r[2], f.r[0] + f.T[0], f.r[1] + f.T[1], f.r[2] + f.T[2], { color: P.curve, label: 'T', labelOut: 20 });
      v.arrow3(f.r[0], f.r[1], f.r[2], f.r[0] + f.N[0], f.r[1] + f.N[1], f.r[2] + f.N[2], { color: P.curve2, label: 'N', labelOut: 20 });
      v.arrow3(f.r[0], f.r[1], f.r[2], f.r[0] + f.B[0], f.r[1] + f.B[1], f.r[2] + f.B[2], { color: P.curve4, label: 'B', labelOut: 20 });
      v.dot3(f.r[0], f.r[1], f.r[2], { color: P.dot, r: 4.5 });
      /* r(t₀) 放在点的左侧（右对齐），与 T / N 的尖端标签岔开 */
      v.text3(f.r[0], f.r[1], f.r[2], 'r(t₀)', { color: P.text, dx: -9, dy: 14, size: 11, align: 'right' });
    },
    read: function (s) {
      var f = this.frame(s.a, s.b, s.t0), cc = this.circle(s.a, s.b, s.t0);
      var d3 = function (x) { return '(' + fmt(x[0], 3) + ', ' + fmt(x[1], 3) + ', ' + fmt(x[2], 3) + ')'; };
      var maxdot = Math.max(Math.abs(vdot(f.T, f.N)), Math.abs(vdot(f.T, f.B)), Math.abs(vdot(f.N, f.B)));
      return [
        ['r(t₀)', d3(f.r)],
        ['T（单位切向量）', d3(f.T)],
        ['N（主法向量）', d3(f.N)],
        ['B = T×N', d3(f.B)],
        ['|T| / |N| / |B|', fmt(vlen(f.T), 6) + ' / ' + fmt(vlen(f.N), 6) + ' / ' + fmt(vlen(f.B), 6)],
        ['max |T·N|,|T·B|,|N·B|（验收 <1e-9）', fmt(maxdot, 10)],
        ['κ 数值 |r′×r″|/|r′|³', fmt(f.kap, 8)],
        ['κ 解析 a/(a²+b²)', fmt(s.a / (s.a * s.a + s.b * s.b), 8)],
        ['τ 数值 (r′×r″)·r‴/|r′×r″|²', fmt(f.tau, 8)],
        ['曲率半径 1/κ', fmt(cc.R, 5)],
        ['曲率圆心 C', d3(cc.C)],
        ['校验 |r−C| 与 1/κ 之差', fmt(Math.abs(vlen(vsub(f.r, cc.C)) - cc.R), 12)],
        ['速率 |r′|', fmt(f.sp, 5)]
      ];
    },
    assert: function () {
      var L = this, out = [], bad = [], bad2 = [], bad3 = [], bad4 = [];
      var cases = [[1.4, 0.35, 1.4], [0.8, 0.7, -2.6], [2, 0.05, 4.9], [1.1, 0.45, -7.3]];
      /* 断言 1（验收条款）：T、N、B 两两点积绝对值 <1e-9 */
      cases.forEach(function (c, i) {
        var f = L.frame(c[0], c[1], c[2]);
        var m = Math.max(Math.abs(vdot(f.T, f.N)), Math.abs(vdot(f.T, f.B)), Math.abs(vdot(f.N, f.B)));
        if (!(m < 1e-9)) bad.push('#' + i + ' 最大点积 ' + m.toExponential(2));
        if (!(Math.abs(vlen(f.T) - 1) < 1e-12 && Math.abs(vlen(f.N) - 1) < 1e-12 && Math.abs(vlen(f.B) - 1) < 1e-12)) bad.push('#' + i + ' 非单位向量');
      });
      out.push({ name: 'tnb: T、N、B 两两点积绝对值 <1e-9 且都是单位向量（4 组参数）', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
      /* 断言 2：定义自洽 —— T=r′/|r′|、N⟂r″(平行)、B=T×N，且 T′∥N */
      cases.forEach(function (c, i) {
        var a = c[0], b = c[1], t = c[2], f = L.frame(a, b, t), h = 1e-6;
        if (!(vlen(vsub(f.T, vunit(L.dR(a, b, t)))) < 1e-12)) bad2.push('#' + i + ' T ≠ r′/|r′|');
        if (!(vlen(vcross(f.B, vcross(f.T, f.N))) < 1e-12)) bad2.push('#' + i + ' B ≠ T×N');
        if (!(vlen(vcross(f.N, f.ac)) / (vlen(f.ac) + 1e-12) < 1e-12)) bad2.push('#' + i + ' N 不平行于 r″');
        var Tn = vunit(vsub(L.dR(a, b, t + h), L.dR(a, b, t - h)));   /* T′ 方向 = N */
        if (!(vlen(vcross(Tn, f.N)) < 1e-6)) bad2.push('#' + i + ' T′ 方向与 N 不符（差商）');
      });
      out.push({ name: 'tnb: 定义自洽 T=r′/|r′|、B=T×N、N∥r″、T′∥N（差商复核）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：κ、τ 数值式与闭式 a/(a²+b²)、b/(a²+b²) 误差 <1e-9 */
      cases.forEach(function (c, i) {
        var a = c[0], b = c[1], t = c[2], f = L.frame(a, b, t);
        if (!(Math.abs(f.kap - a / (a * a + b * b)) < 1e-9)) bad3.push('#' + i + ' κ 差 ' + Math.abs(f.kap - a / (a * a + b * b)).toExponential(2));
        if (!(Math.abs(f.tau - b / (a * a + b * b)) < 1e-9)) bad3.push('#' + i + ' τ 差 ' + Math.abs(f.tau - b / (a * a + b * b)).toExponential(2));
      });
      out.push({ name: 'tnb: κ、τ 的数值式与闭式 a/(a²+b²)、b/(a²+b²) 误差 <1e-9', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4：曲率圆 —— 圆心 C=r+N/κ，圆上点到 C 的距离恒为 1/κ，且在 r 处与曲线同切 */
      cases.forEach(function (c, i) {
        var cc = L.circle(c[0], c[1], c[2]), f = cc.f, k, ph, X;
        if (!(Math.abs(vlen(vsub(f.r, cc.C)) - cc.R) < 1e-12)) bad4.push('#' + i + ' |r−C| ≠ 1/κ');
        for (k = 0; k <= 12; k++) {
          ph = k * Math.PI / 6;
          X = vadd(cc.C, vadd(vscale(f.N, -cc.R * Math.cos(ph)), vscale(f.T, cc.R * Math.sin(ph))));
          if (!(Math.abs(vlen(vsub(X, cc.C)) - cc.R) < 1e-12)) bad4.push('#' + i + ' 圆上点半径偏差');
        }
        var dX = vadd(vscale(f.N, cc.R * Math.sin(0)), vscale(f.T, cc.R * Math.cos(0)));   /* dP/dφ 在 φ=0 */
        if (!(vlen(vcross(vunit(dX), f.T)) < 1e-12)) bad4.push('#' + i + ' 曲率圆切向与 T 不平行');
        if (!(Math.abs(vdot(vsub(f.r, cc.C), f.T)) < 1e-12)) bad4.push('#' + i + ' 半径方向不垂直于 T');
      });
      out.push({ name: 'tnb: 曲率圆过 r(t₀)、半径恒为 1/κ、在该点与曲线同切（4 组）', ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
      /* 断言 5（验收条款）：3D 视图标签包围盒两两不相交 */
      var ov = labelCheck(L, [[0.7, 0.42], [1.6, 0.2], [-0.9, 0.9], [2.4, 0.05], [0.2, 0.75]]);
      out.push({ name: 'tnb: 3D 视图标签包围盒两两不相交（5 个旋转角 × 页面各档画布几何）', ok: ov.length === 0, detail: ov.join(';') || 'ok' });
      return out;
    }
  });

  /* ================= 第 12 章：速度与加速度的切向/法向分解（3D + 2D 双画布） ================= */
  lab({
    id: 'accel', ch: '12',
    title: '速度与加速度分解 a = a_T T + a_N N',
    sub: '左：三维轨迹上的 v、a 与 a_T T、a_N N；右：a_T(t) 与 a_N(t) 的曲线（a_N = κ|v|² 管拐弯）',
    tex: 'a_T=\\frac{\\mathbf{r}\'\\cdot\\mathbf{r}\'\'}{|\\mathbf{r}\'|},\\qquad a_N=\\frac{|\\mathbf{r}\'\\times\\mathbf{r}\'\'|}{|\\mathbf{r}\'|}=\\kappa|\\mathbf{v}|^{2}',
    note: '加速度拆成两块：a_T 只改变速率（沿 T），a_N 只改变方向（沿 N，且 a_N = κ|v|²）。' +
      '直线运动 κ=0，所以 a_N=0；拐得越急（κ 大）或跑得越快，法向加速度越大。',
    dim3: [true, false],
    panes: 2,   /* 左三维 + 右 2D：a_T(t)/a_N(t) 曲线（原先漏写，右侧面板从不渲染） */
    view: { x0: -3, x1: 3, y0: -3, y1: 3, z0: -2.6, z1: 2.6, yaw: 0.7, pitch: 0.42, labelAuto: true },
    view2: { x0: -6, x1: 6, y0: -2, y1: 2 },
    ctrls: [
      { k: 'k', label: '轨迹', type: 'sel', val: 'helix', opts: [['helix', '螺旋线 (a cos t, a sin t, b t)'], ['spiral', '螺线 (a t cos t, a t sin t, b t)'], ['line', '直线 (0.9t, −0.5t, 1.2t)']] },
      { k: 'a', label: '半径 a', min: 0.6, max: 2, step: 0.05, val: 1.4 },
      { k: 'b', label: '参数 b', min: 0.05, max: 0.8, step: 0.05, val: 0.35 },
      { k: 't0', label: '参数 t₀', min: -6, max: 6, step: 0.05, val: 1.2 }
    ],
    T1: 6,   /* 参数区间 [−T1, T1] */
    R: function (k, a, b, t) {
      if (k === 'spiral') return [a * t * Math.cos(t), a * t * Math.sin(t), b * t];
      if (k === 'line') return [0.9 * t, -0.5 * t, 1.2 * t];
      return [a * Math.cos(t), a * Math.sin(t), b * t];
    },
    dR: function (k, a, b, t) {
      if (k === 'spiral') return [a * Math.cos(t) - a * t * Math.sin(t), a * Math.sin(t) + a * t * Math.cos(t), b];
      if (k === 'line') return [0.9, -0.5, 1.2];
      return [-a * Math.sin(t), a * Math.cos(t), b];
    },
    ddR: function (k, a, b, t) {
      if (k === 'spiral') return [-2 * a * Math.sin(t) - a * t * Math.cos(t), 2 * a * Math.cos(t) - a * t * Math.sin(t), 0];
      if (k === 'line') return [0, 0, 0];
      return [-a * Math.cos(t), -a * Math.sin(t), 0];
    },
    /* 分解：a = a_T T + a_N N */
    split: function (k, a, b, t) {
      var v = this.dR(k, a, b, t), ac = this.ddR(k, a, b, t), sp = vlen(v);
      var T = vunit(v);
      var aT = sp > 1e-12 ? vdot(v, ac) / sp : 0;
      var cr = vcross(v, ac), aN = sp > 1e-12 ? vlen(cr) / sp : 0;
      var N = vlen(vsub(ac, vscale(T, aT))) > 1e-12 ? vunit(vsub(ac, vscale(T, aT))) : [0, 0, 0];
      return { r: this.R(k, a, b, t), v: v, ac: ac, sp: sp, T: T, N: N, aT: aT, aN: aN,
        kap: sp > 1e-12 ? vlen(cr) / Math.pow(sp, 3) : 0 };
    },
    draw: function (v, s) {
      /* v 可能是单个视图（labelCheck 只探第一块三维画布）或多画布数组 [三维, 二维] */
      var P = pal(), L = this, arr = v && v.length ? v : null, v2 = arr ? arr[1] : null;
      var v3 = arr ? arr[0] : v, S = L.split(s.k, s.a, s.b, s.t0), T1 = L.T1;
      /* 左：三维轨迹 + v、a 与两个分量 */
      v3.axes3({ nx: 4, ny: 4 });
      v3.curve3(function (t) { return L.R(s.k, s.a, s.b, t)[0]; }, function (t) { return L.R(s.k, s.a, s.b, t)[1]; },
        function (t) { return L.R(s.k, s.a, s.b, t)[2]; }, -T1, T1, { color: P.curve3, w: 1.8, n: 320 });
      var r = S.r, o = 1.6;   /* 箭头统一放大显示 */
      var tipV = vadd(r, vscale(S.T, Math.min(2.2, S.sp * 0.5)));
      v3.arrow3(r[0], r[1], r[2], tipV[0], tipV[1], tipV[2], { color: P.curve2, label: 'v', labelOut: 16 });
      var aS = vlen(S.ac) > 1e-12 ? 1.8 / vlen(S.ac) : 0;
      v3.arrow3(r[0], r[1], r[2], r[0] + S.ac[0] * aS, r[1] + S.ac[1] * aS, r[2] + S.ac[2] * aS, { color: P.curve4, label: 'a', labelOut: 16 });
      var tTip = vadd(r, vscale(S.T, S.aT * aS)), nTip = vadd(r, vscale(S.N, S.aN * aS));
      v3.arrow3(r[0], r[1], r[2], tTip[0], tTip[1], tTip[2], { color: P.curve, label: 'a_T T', labelOut: 16 });
      if (S.aN > 1e-9) {
        /* a 与 a_N N 在 a_T≈0 时几乎重合：把 a_N N 的标签再往外推，避免叠字 */
        v3.arrow3(r[0], r[1], r[2], nTip[0], nTip[1], nTip[2], { color: P.dot, label: 'a_N N', labelOut: 44 });
        v3.line3(tTip, vadd(r, vscale(S.ac, aS)), { color: P.muted, w: 1, dash: [4, 3] });
        v3.line3(nTip, vadd(r, vscale(S.ac, aS)), { color: P.muted, w: 1, dash: [4, 3] });
      }
      v3.dot3(r[0], r[1], r[2], { color: P.dot, r: 4.5 });
      if (!v2) return;   /* 只探三维画布时跳过右侧二维面板 */
      /* 右：a_T(t) 与 a_N(t)（y 轴按数据自适应） */
      var lo = -Infinity, hi = Infinity, mm = 1e-9, i;
      for (i = 0; i <= 240; i++) {
        var t = -T1 + 2 * T1 * i / 240, sp = L.split(s.k, s.a, s.b, t);
        mm = Math.max(mm, Math.abs(sp.aT), Math.abs(sp.aN));
      }
      v2.y0 = -mm * 1.15; v2.y1 = mm * 1.15;
      v2.clear(); v2.axes();
      v2.fn(function (t) { return L.split(s.k, s.a, s.b, t).aT; }, { color: P.curve, w: 2 });
      v2.fn(function (t) { return L.split(s.k, s.a, s.b, t).aN; }, { color: P.curve2, w: 2, dash: [6, 4] });
      v2.line(s.t0, v2.y0, s.t0, v2.y1, { color: P.muted, w: 1.2, dash: [4, 3] });
      v2.dot(s.t0, S.aT, { color: P.curve, r: 4 });
      v2.dot(s.t0, S.aN, { color: P.curve2, r: 4 });
      v2.text(-T1 + 0.25, v2.y1 * 0.86, '实线 a_T   虚线 a_N', { color: P.text, size: 11.5 });
    },
    read: function (s) {
      var L = this, S = L.split(s.k, s.a, s.b, s.t0), h = 1e-5;
      var sp2 = vlen(L.dR(s.k, s.a, s.b, s.t0 + h)), sp1 = vlen(L.dR(s.k, s.a, s.b, s.t0 - h));
      var dsp = (sp2 - sp1) / (2 * h);
      var recon = vadd(vscale(S.T, S.aT), vscale(S.N, S.aN));
      var d3 = function (x) { return '(' + fmt(x[0], 3) + ', ' + fmt(x[1], 3) + ', ' + fmt(x[2], 3) + ')'; };
      return [
        ['t₀', fmt(s.t0, 2)],
        ['r(t₀)', d3(S.r)],
        ['v = r′', d3(S.v)],
        ['速率 |v|', fmt(S.sp, 5)],
        ['a = r″', d3(S.ac)],
        ['a_T = (r′·r″)/|r′|', fmt(S.aT, 5)],
        ['a_T 差商 d|v|/dt', fmt(dsp, 5)],
        ['a_N = |r′×r″|/|r′|', fmt(S.aN, 5)],
        ['a_N = κ|v|²', fmt(S.kap * S.sp * S.sp, 5)],
        ['κ', fmt(S.kap, 5)],
        ['|a_T T + a_N N − a|（验收 <1e-9）', fmt(vlen(vsub(recon, S.ac)), 12)],
        ['|a|² 与 a_T²+a_N² 之差', fmt(Math.abs(vdot(S.ac, S.ac) - (S.aT * S.aT + S.aN * S.aN)), 10)]
      ];
    },
    assert: function () {
      var L = this, out = [], bad = [], bad2 = [], bad3 = [], bad4 = [];
      var cases = [['helix', 1.4, 0.35, 1.2], ['helix', 0.8, 0.7, -3.4], ['spiral', 1.1, 0.45, 2.2], ['line', 1.4, 0.35, 1.0]];
      /* 断言 1（验收条款）：a_T T + a_N N 重构 a 误差 <1e-9 */
      cases.forEach(function (c, i) {
        var S = L.split(c[0], c[1], c[2], c[3]);
        var recon = vadd(vscale(S.T, S.aT), vscale(S.N, S.aN));
        var e = vlen(vsub(recon, S.ac));
        if (!(e < 1e-9)) bad.push('#' + i + ' 重构误差 ' + e.toExponential(2));
        if (!(S.aN >= -1e-15)) bad.push('#' + i + ' a_N < 0');
        if (!(Math.abs(vdot(S.ac, S.ac) - (S.aT * S.aT + S.aN * S.aN)) < 1e-9)) bad.push('#' + i + ' |a|² ≠ a_T²+a_N²');
      });
      out.push({ name: 'accel: a_T T + a_N N 重构 a 误差 <1e-9（3 类轨迹 4 组）+ a_N ≥ 0 + 勾股关系', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
      /* 断言 2：a_T 就是速率的变化率（差商复核）；a_N = κ|v|² */
      cases.forEach(function (c, i) {
        var h = 1e-5, t = c[3], S = L.split(c[0], c[1], c[2], t);
        var dsp = (vlen(L.dR(c[0], c[1], c[2], t + h)) - vlen(L.dR(c[0], c[1], c[2], t - h))) / (2 * h);
        if (!(Math.abs(S.aT - dsp) < 1e-4)) bad2.push('#' + i + ' a_T 与 d|v|/dt 差 ' + Math.abs(S.aT - dsp).toExponential(2));
        if (!(Math.abs(S.aN - S.kap * S.sp * S.sp) < 1e-9)) bad2.push('#' + i + ' a_N ≠ κ|v|²');
      });
      out.push({ name: 'accel: a_T = d|v|/dt（中心差商，容差 1e-4）且 a_N = κ|v|² 误差 <1e-9', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：直线运动 κ=0、a_N=0；且 T ⟂ N、T 与 v 同向 */
      var sl = L.split('line', 1.4, 0.35, 1.0);
      if (!(sl.kap < 1e-12 && sl.aN < 1e-12)) bad3.push('直线 κ=' + sl.kap.toExponential(2) + ' a_N=' + sl.aN.toExponential(2));
      cases.forEach(function (c, i) {
        var S = L.split(c[0], c[1], c[2], c[3]);
        if (!(Math.abs(vdot(S.T, S.N)) < 1e-9)) bad3.push('#' + i + ' T·N ≠ 0');
        if (!(vlen(vcross(S.T, vunit(S.v))) < 1e-12)) bad3.push('#' + i + ' T 与 v 不同向');
      });
      out.push({ name: 'accel: 直线 κ=a_N=0；T ⟂ N 且 T 与 v 同向', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4（验收条款）：3D 视图标签包围盒两两不相交 */
      var ov = labelCheck(L, [[0.7, 0.42], [1.6, 0.2], [-0.9, 0.9], [2.4, 0.05], [0.2, 0.75]]);
      out.push({ name: 'accel: 3D 视图标签包围盒两两不相交（5 个旋转角 × 页面各档画布几何）', ok: ov.length === 0, detail: ov.join(';') || 'ok' });
      return out;
    }
  });

/* ==== 草稿合并：A.js ==== */
/* 来源：.tmp/labs16/A.js */
/* =====================================================================
   第 13 章补充实验台（由队长原样插入 labs.js 的「页面渲染」段之前）
   ① tangentplane  切平面与法向量（3D 可旋转）
   ② lagrange      拉格朗日乘子（2D：等高线 + 约束曲线 + ∇f / ∇g）
   本文件只注册 lab({...})，并定义 tp_ / lg_ 前缀的私有辅助函数；
   不改动任何既有内核与实验台。ES5 风格，无外部依赖。
   ===================================================================== */

/* ---------------- ① 切平面台私有工具（tp_ 前缀） ---------------- */

/* 曲面族：f 与其解析偏导、二阶偏导（Hessian 用于「一阶一致」的理论值） */
var tp_FAM = {
  bowl: {
    tex: 'f = x² + y²',
    f: function (x, y) { return x * x + y * y; },
    fx: function (x, y) { return 2 * x; },
    fy: function (x, y) { return 2 * y; },
    hxx: function () { return 2; },
    hxy: function () { return 0; },
    hyy: function () { return 2; }
  },
  saddle: {
    tex: 'f = x² − y²',
    f: function (x, y) { return x * x - y * y; },
    fx: function (x, y) { return 2 * x; },
    fy: function (x, y) { return -2 * y; },
    hxx: function () { return 2; },
    hxy: function () { return 0; },
    hyy: function () { return -2; }
  },
  wave: {
    tex: 'f = sin x · cos y',
    f: function (x, y) { return Math.sin(x) * Math.cos(y); },
    fx: function (x, y) { return Math.cos(x) * Math.cos(y); },
    fy: function (x, y) { return -Math.sin(x) * Math.sin(y); },
    hxx: function (x, y) { return -Math.sin(x) * Math.cos(y); },
    hxy: function (x, y) { return -Math.cos(x) * Math.sin(y); },
    hyy: function (x, y) { return -Math.sin(x) * Math.cos(y); }
  },
  prod: {
    tex: 'f = x · y',
    f: function (x, y) { return x * y; },
    fx: function (x, y) { return y; },
    fy: function (x, y) { return x; },
    hxx: function () { return 0; },
    hxy: function () { return 1; },
    hyy: function () { return 0; }
  },
  gauss: {
    tex: 'f = e^(−(x²+y²))',
    f: function (x, y) { return Math.exp(-(x * x + y * y)); },
    fx: function (x, y) { return -2 * x * Math.exp(-(x * x + y * y)); },
    fy: function (x, y) { return -2 * y * Math.exp(-(x * x + y * y)); },
    hxx: function (x, y) { return (4 * x * x - 2) * Math.exp(-(x * x + y * y)); },
    hxy: function (x, y) { return 4 * x * y * Math.exp(-(x * x + y * y)); },
    hyy: function (x, y) { return (4 * y * y - 2) * Math.exp(-(x * x + y * y)); }
  }
};

/* 偏导的中心差分（给 read 与 assert 复核解析式） */
function tp_d1(fc, x, y, dir) {
  var h = 1e-5;
  return dir === 'x' ? (fc.f(x + h, y) - fc.f(x - h, y)) / (2 * h)
                     : (fc.f(x, y + h) - fc.f(x, y - h)) / (2 * h);
}

/* 切平面 z = a + b·x + c·y（把 z = f₀ + f_x(x−x₀) + f_y(y−y₀) 展开整理） */
function tp_planeCoef(fc, x0, y0) {
  var f0 = fc.f(x0, y0), fx = fc.fx(x0, y0), fy = fc.fy(x0, y0);
  return { f0: f0, fx: fx, fy: fy, a: f0 - fx * x0 - fy * y0, b: fx, c: fy };
}
function tp_planeZ(k, x, y) { return k.a + k.b * x + k.c * y; }

/* 曲面与切平面的差 D(h) = f(P₀+h·u) − L(P₀+h·u)（一阶一致断言的被测量） */
function tp_gap(fc, k, x0, y0, u, h) {
  var x = x0 + h * u[0], y = y0 + h * u[1];
  return fc.f(x, y) - tp_planeZ(k, x, y);
}

/* 线框曲面，按视图盒子（含 z 方向）做凸多边形裁剪后按深度绘制。
   与内核 surface3 的区别：四角超出 z∈[z0,z1] 的单元被水平切平（复用内核 clipAxis），
   于是「碗面」这类高曲面不会冲出画布，标签避让也有稳定的场内容。 */
function tp_surfClip(v, fc, o) {
  o = o || {};
  var nu = o.nu || 20, nv = o.nv || 20, P = pal(), c = v.ctx, i, j, k;
  var cells = [], f = fc.f, xa, xb, ya, yb, q, poly, zs, ds, dsum, ok;
  for (i = 0; i < nu; i++) {
    xa = v.x0 + (v.x1 - v.x0) * i / nu;
    xb = v.x0 + (v.x1 - v.x0) * (i + 1) / nu;
    for (j = 0; j < nv; j++) {
      ya = v.y0 + (v.y1 - v.y0) * j / nv;
      yb = v.y0 + (v.y1 - v.y0) * (j + 1) / nv;
      q = [[xa, ya, f(xa, ya)], [xb, ya, f(xb, ya)], [xb, yb, f(xb, yb)], [xa, yb, f(xa, yb)]];
      ok = true;
      for (k = 0; k < 4; k++) { if (!isFinite(q[k][2])) { ok = false; break; } }
      if (!ok) continue;
      poly = clipAxis(q, 2, v.z0, v.z1); if (poly.length < 3) continue;
      poly = clipAxis(poly, 0, v.x0, v.x1); if (poly.length < 3) continue;
      poly = clipAxis(poly, 1, v.y0, v.y1); if (poly.length < 3) continue;
      zs = 0; dsum = 0;
      for (k = 0; k < poly.length; k++) { zs += poly[k][2]; dsum += v.projMath(poly[k]).d; }
      cells.push({ pts: poly, z: zs / poly.length, d: dsum / poly.length });
    }
  }
  cells.sort(function (A, B) { return B.d - A.d; });   /* 远的先画 */
  var span = (v.z1 - v.z0) || 1;
  c.save();
  cells.forEach(function (cell) {
    c.beginPath();
    cell.pts.forEach(function (p3, k2) {
      var s2 = v.project(p3[0], p3[1], p3[2]);
      if (k2) c.lineTo(s2[0], s2[1]); else c.moveTo(s2[0], s2[1]);
    });
    c.closePath();
    if (o.fill !== false) {
      var t = (cell.z - v.z0) / span;
      c.fillStyle = t > 0.5 ? P.fill : P.fill2;
      c.fill();
    }
    c.strokeStyle = o.color || P.curve;
    c.lineWidth = o.w || 0.8;
    c.stroke();
  });
  c.restore();
  return cells.length;
}

/* =====================================================================
   实验台 ①：切平面与法向量（第 13 章，三维可旋转）
   ===================================================================== */
lab({
  id: 'tangentplane', ch: '13',
  title: '切平面与法向量：曲面的最佳线性近似',
  sub: '换曲面、拖切点 P₀：绿色平面是 z = f(P₀)+f_x·Δx+f_y·Δy，两条橙色线是两条坐标截线在 P₀ 的切线，紫色箭头是法向量 n = (−f_x, −f_y, 1)。',
  tex: 'z=f(x_0,y_0)+f_x(x_0,y_0)(x-x_0)+f_y(x_0,y_0)(y-y_0),\\qquad \\mathbf{n}=(-f_x,\\,-f_y,\\,1)',
  note: '切平面就是曲面在切点处的「最佳线性近似」：它与曲面在 P₀ 同值，沿 x、y 两个方向与曲面的斜率分别等于 f_x、f_y，' +
    '而沿任意方向 (Δx,Δy) 走一小步 h，两者的差是二阶小量 ≈ ½h²·uᵀHu（u 是单位方向、H 是 Hessian）——' +
    '所以步长减半，差值降到约四分之一。法向量 n = (−f_x, −f_y, 1) 同时垂直于两条切线，因而垂直于整个切平面；' +
    '反过来，n 的分量直接读出两个偏导，这就是「法向量 → 切平面 → 可微性」的一条链。',
  dim3: true,
  view: { x0: -1.6, x1: 1.6, y0: -1.6, y1: 1.6, z0: -2.6, z1: 2.6, yaw: 0.7, pitch: 0.42, labelAuto: true },
  ctrls: [
    { k: 'f', label: '曲面 f(x, y)', type: 'sel', val: 'bowl', opts: [
      ['bowl', 'f = x² + y²'], ['saddle', 'f = x² − y²'], ['wave', 'f = sin x · cos y'],
      ['prod', 'f = x · y'], ['gauss', 'f = e^−(x²+y²)']] },
    { k: 'x0', label: '切点 x₀', min: -1.1, max: 1.1, step: 0.02, val: 0.7 },
    { k: 'y0', label: '切点 y₀', min: -1.1, max: 1.1, step: 0.02, val: 0.5 }
  ],
  draw: function (v, s) {
    var P = pal(), fc = tp_FAM[s.f], x0 = s.x0, y0 = s.y0, K = tp_planeCoef(fc, x0, y0);
    var fx = K.fx, fy = K.fy, z0 = K.f0, u = 0.9, nrm, un, pp;
    v.axes3({ nx: 4, ny: 4 });
    /* 曲面（按视图盒子裁剪，四角溢出部分被水平切平） */
    tp_surfClip(v, fc, { nu: 20, nv: 20, color: P.curve, w: 0.8 });
    /* 切平面：n·X = d，取足够大的 rho 让平面铺满视图盒子 */
    nrm = [-fx, -fy, 1];
    pp = planePoly3(nrm, -fx * x0 - fy * y0 + z0, this.view, 9);
    if (pp.length >= 3) v.poly3(pp, { fill: P.fill3, stroke: P.curve3, w: 1.5 });
    /* 两条坐标截线（细）与它们在 P₀ 的切线（粗） */
    v.curve3(function (t) { return t; }, function () { return y0; }, function (t) { return fc.f(t, y0); },
      x0 - 1.15, x0 + 1.15, { color: P.muted, w: 1.1, n: 60 });
    v.curve3(function () { return x0; }, function (t) { return t; }, function (t) { return fc.f(x0, t); },
      y0 - 1.15, y0 + 1.15, { color: P.muted, w: 1.1, dash: [3, 3], n: 60 });
    v.line3([x0 - u, y0, z0 - fx * u], [x0 + u, y0, z0 + fx * u], { color: P.curve2, w: 2.2 });
    v.line3([x0, y0 - u, z0 - fy * u], [x0, y0 + u, z0 + fy * u], { color: P.curve2, w: 2.2, dash: [7, 4] });
    /* 法向量 n = (−f_x, −f_y, 1)（统一长度显示，只表方向） */
    un = vunit(nrm);
    v.arrow3(x0, y0, z0, x0 + un[0] * 1.05, y0 + un[1] * 1.05, z0 + un[2] * 1.05,
      { color: P.curve4, w: 2.2, label: 'n', labelOut: 18 });
    v.dot3(x0, y0, z0, { color: P.dot, r: 4.5 });
    v.text3(x0, y0, z0, 'P₀', { color: P.text, dx: -8, dy: 15, align: 'right', size: 11.5 });
    v.drop3(x0, y0, z0, {});
  },
  read: function (s) {
    var fc = tp_FAM[s.f], x0 = s.x0, y0 = s.y0, K = tp_planeCoef(fc, x0, y0);
    var dx = tp_d1(fc, x0, y0, 'x'), dy = tp_d1(fc, x0, y0, 'y');
    var hp = 1e-4;
    var sx = (tp_planeZ(K, x0 + hp, y0) - tp_planeZ(K, x0 - hp, y0)) / (2 * hp);
    var sy = (tp_planeZ(K, x0, y0 + hp) - tp_planeZ(K, x0, y0 - hp)) / (2 * hp);
    var nrm = [-K.fx, -K.fy, 1], un = vunit(nrm);
    var u = [Math.SQRT1_2, Math.SQRT1_2];
    var Kq = u[0] * u[0] * fc.hxx(x0, y0) + 2 * u[0] * u[1] * fc.hxy(x0, y0) + u[1] * u[1] * fc.hyy(x0, y0);
    var h = 1e-3, dq = tp_gap(fc, K, x0, y0, u, h) / (h * h / 2);
    return [
      ['曲面 / 切点 P₀', fc.tex + '　(' + fmt(x0, 3) + ', ' + fmt(y0, 3) + ')'],
      ['f(P₀)', fmt(K.f0, 6)],
      ['切平面 z = a + b·x + c·y', 'a = ' + fmt(K.a, 5) + '　b = ' + fmt(K.b, 5) + '　c = ' + fmt(K.c, 5)],
      ['f_x（解析 / 中心差分）', fmt(K.fx, 8) + ' / ' + fmt(dx, 8)],
      ['f_y（解析 / 中心差分）', fmt(K.fy, 8) + ' / ' + fmt(dy, 8)],
      ['切平面 − 曲面（在 P₀，验收 <1e-12）', fmt(tp_planeZ(K, x0, y0) - K.f0, 12)],
      ['x / y 向斜率 − f_x / f_y（平面差商，验收 <1e-9）', fmt(Math.abs(sx - K.fx), 12) + ' / ' + fmt(Math.abs(sy - K.fy), 12)],
      ['|n| = √(f_x² + f_y² + 1)　n 的单位向量', fmt(Math.sqrt(nrm[0] * nrm[0] + nrm[1] * nrm[1] + 1), 6) + '　(' + fmt(un[0], 4) + ', ' + fmt(un[1], 4) + ', ' + fmt(un[2], 4) + ')'],
      ['n·T₁ / n·T₂（T₁=(1,0,f_x)，T₂=(0,1,f_y)，验收 <1e-12）', fmt(nrm[0] * 1 + nrm[2] * K.fx, 12) + ' / ' + fmt(nrm[1] * 1 + nrm[2] * K.fy, 12)],
      ['一阶一致 D(h)/(h²/2)（h=1e-3，45° 方向）与理论 uᵀHu', fmt(dq, 6) + ' / ' + fmt(Kq, 6)]
    ];
  },
  assert: function () {
    var L = this, out = [], bad = [], bad2 = [], bad3 = [], bad4 = [];
    var cases = [
      ['bowl', 0.7, 0.5], ['bowl', -1.05, 0.9], ['saddle', 0.8, -0.6], ['saddle', -1.1, 1.1],
      ['wave', 0.9, 0.4], ['wave', -0.7, -1.0], ['prod', 0.95, -0.85], ['gauss', 0.65, 0.45], ['gauss', -1.0, 0.3]
    ];
    var dirs = [[1, 0], [0, 1], [Math.SQRT1_2, Math.SQRT1_2], [0.6, -0.8]];
    var i, j, c, fc, x0, y0, K;
    /* 断言 1（验收条款）：切平面过切点（<1e-12），沿 x/y 方向斜率 = f_x/f_y（平面差商 <1e-9） */
    for (i = 0; i < cases.length; i++) {
      c = cases[i]; fc = tp_FAM[c[0]]; x0 = c[1]; y0 = c[2]; K = tp_planeCoef(fc, x0, y0);
      var e0 = Math.abs(tp_planeZ(K, x0, y0) - K.f0);
      if (!(e0 < 1e-12)) bad.push('#' + i + ' 切点同值差 ' + e0.toExponential(2));
      var hp = 1e-4;
      var sx = (tp_planeZ(K, x0 + hp, y0) - tp_planeZ(K, x0 - hp, y0)) / (2 * hp);
      var sy = (tp_planeZ(K, x0, y0 + hp) - tp_planeZ(K, x0, y0 - hp)) / (2 * hp);
      if (!(Math.abs(sx - K.fx) < 1e-9)) bad.push('#' + i + ' x 向斜率差 ' + Math.abs(sx - K.fx).toExponential(2));
      if (!(Math.abs(sy - K.fy) < 1e-9)) bad.push('#' + i + ' y 向斜率差 ' + Math.abs(sy - K.fy).toExponential(2));
    }
    out.push({ name: 'tangentplane: 切平面过切点（|L(P₀)−f(P₀)| <1e-12）且沿 x/y 斜率 = f_x/f_y（平面中心差商 <1e-9，5 族曲面 9 组数据）', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
    /* 断言 2：f_x/f_y 的中心差分复核解析式（<1e-9）；n 正交于两条切向量（解析残差 <1e-12、差分切向量 <1e-9） */
    for (i = 0; i < cases.length; i++) {
      c = cases[i]; fc = tp_FAM[c[0]]; x0 = c[1]; y0 = c[2]; K = tp_planeCoef(fc, x0, y0);
      var dx = tp_d1(fc, x0, y0, 'x'), dy = tp_d1(fc, x0, y0, 'y');
      if (!(Math.abs(dx - K.fx) < 1e-9)) bad2.push('#' + i + ' f_x 差商差 ' + Math.abs(dx - K.fx).toExponential(2));
      if (!(Math.abs(dy - K.fy) < 1e-9)) bad2.push('#' + i + ' f_y 差商差 ' + Math.abs(dy - K.fy).toExponential(2));
      var nrm = [-K.fx, -K.fy, 1];
      var T1 = [1, 0, K.fx], T2 = [0, 1, K.fy];
      var d1 = Math.abs(vdot(nrm, T1)), d2 = Math.abs(vdot(nrm, T2));
      if (!(d1 < 1e-12)) bad2.push('#' + i + ' |n·T₁| = ' + d1.toExponential(2));
      if (!(d2 < 1e-12)) bad2.push('#' + i + ' |n·T₂| = ' + d2.toExponential(2));
      /* 用曲面上的割线逼近切向量，再做同样正交检查（非平凡口径） */
      var hh = 1e-5;
      var S1 = [(2 * hh) / (2 * hh), 0, (fc.f(x0 + hh, y0) - fc.f(x0 - hh, y0)) / (2 * hh)];
      var S2 = [0, 1, (fc.f(x0, y0 + hh) - fc.f(x0, y0 - hh)) / (2 * hh)];
      var e1 = Math.abs(vdot(nrm, S1)) / vlen(nrm), e2 = Math.abs(vdot(nrm, S2)) / vlen(nrm);
      if (!(e1 < 1e-9)) bad2.push('#' + i + ' 割线切向量 T₁ 的正交残差 ' + e1.toExponential(2));
      if (!(e2 < 1e-9)) bad2.push('#' + i + ' 割线切向量 T₂ 的正交残差 ' + e2.toExponential(2));
    }
    out.push({ name: 'tangentplane: f_x/f_y 中心差分复核解析式（<1e-9）；法向量正交于两条切向量（解析 <1e-12，割线口径 <1e-9）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
    /* 断言 3（验收条款）：沿 (Δx,Δy) 的一阶一致 —— 差值随步长二次衰减（D(h)/(h²/2) → uᵀHu，D(2h)/D(h) → 4） */
    var cnt = 0, worstQ = 0, worstR = 0, worstR2 = 0;
    for (i = 0; i < cases.length; i++) {
      c = cases[i]; fc = tp_FAM[c[0]]; x0 = c[1]; y0 = c[2]; K = tp_planeCoef(fc, x0, y0);
      for (j = 0; j < dirs.length; j++) {
        var u = dirs[j];
        var Kq = u[0] * u[0] * fc.hxx(x0, y0) + 2 * u[0] * u[1] * fc.hxy(x0, y0) + u[1] * u[1] * fc.hyy(x0, y0);
        if (Math.abs(Kq) < 1e-6) continue;      /* 该方向二阶项退化（如鞍面沿 (1,1)/√2 的对角线），跳过 */
        cnt++;
        var h = 1e-4;
        var D1 = tp_gap(fc, K, x0, y0, u, h), D2 = tp_gap(fc, K, x0, y0, u, 2 * h), D3 = tp_gap(fc, K, x0, y0, u, h / 2);
        var q = D1 / (h * h / 2);
        worstQ = Math.max(worstQ, Math.abs(q - Kq));
        var r = D2 / D1, r2 = D3 / D1;
        worstR = Math.max(worstR, Math.abs(r - 4));
        worstR2 = Math.max(worstR2, Math.abs(r2 - 0.25));
        if (!(Math.abs(q - Kq) < 1e-3 * Math.max(1, Math.abs(Kq)))) bad3.push('#' + i + '.' + j + ' D(h)/(h²/2)=' + q.toFixed(7) + ' vs uᵀHu=' + Kq.toFixed(7));
        if (!(Math.abs(r - 4) < 0.05)) bad3.push('#' + i + '.' + j + ' D(2h)/D(h)=' + r.toFixed(5));
        if (!(Math.abs(r2 - 0.25) < 0.02)) bad3.push('#' + i + '.' + j + ' D(h/2)/D(h)=' + r2.toFixed(5));
        if (!(Math.abs(D1) < 1e-6)) bad3.push('#' + i + '.' + j + ' 差值过大 ' + D1.toExponential(2));
      }
    }
    out.push({ name: 'tangentplane: 沿 (Δx,Δy) 一阶一致（' + cnt + ' 组方向）：D(h)/(h²/2) → uᵀHu 误差 <1e-3、D(2h)/D(h) → 4（±0.05）、D(h/2)/D(h) → 0.25（±0.02）', ok: bad3.length === 0, detail: bad3.join(';') || ('ok（实测 max|q−uᵀHu|=' + worstQ.toExponential(2) + '，max|D(2h)/D(h)−4|=' + worstR.toExponential(2) + '，max|D(h/2)/D(h)−0.25|=' + worstR2.toExponential(2) + '）') });
    /* 断言 4（验收条款）：3D 视图标签包围盒两两不相交（5 个旋转角 × 页面各档画布几何） */
    var ov = labelCheck(L, [[0.7, 0.42], [1.6, 0.2], [-0.9, 0.9], [2.4, 0.05], [0.2, 0.75]]);
    out.push({ name: 'tangentplane: 3D 视图标签包围盒两两不相交（5 个旋转角 × 页面各档画布几何）', ok: ov.length === 0, detail: ov.join(';') || 'ok' });
    return out;
  }
});

/* ---------------- ② 拉格朗日台私有工具（lg_ 前缀） ---------------- */

/* 目标 f 与约束 g(x,y)=c 的配置表。
   每个配置自带：路径参数化 path(t)（圆用 t=极角、直线用 t=x）、参数区间、解析驻点 stat()。 */
var lg_CFG = {
  sumcir: {
    label: 'f = x + y　在　g = x² + y² = 1 上',
    f: function (x, y) { return x + y; },
    fx: function () { return 1; },
    fy: function () { return 1; },
    g: function (x, y) { return x * x + y * y; },
    gx: function (x) { return 2 * x; },
    gy: function (x, y) { return 2 * y; },   /* 必须写两参：调用方按 (x,y) 传，单参会把 x 当 y */
    c: 1,
    t0: 0, t1: 2 * Math.PI,
    path: function (t) { return [Math.cos(t), Math.sin(t)]; },
    stat: function () { return [[Math.SQRT1_2, Math.SQRT1_2], [-Math.SQRT1_2, -Math.SQRT1_2]]; }
  },
  prodcir: {
    label: 'f = x·y　在　g = x² + y² = 1 上',
    f: function (x, y) { return x * y; },
    fx: function (x, y) { return y; },
    fy: function (x, y) { return x; },
    g: function (x, y) { return x * x + y * y; },
    gx: function (x) { return 2 * x; },
    gy: function (x, y) { return 2 * y; },   /* 必须写两参：调用方按 (x,y) 传，单参会把 x 当 y */
    c: 1,
    t0: 0, t1: 2 * Math.PI,
    path: function (t) { return [Math.cos(t), Math.sin(t)]; },
    stat: function () {
      return [[Math.SQRT1_2, Math.SQRT1_2], [Math.SQRT1_2, -Math.SQRT1_2],
              [-Math.SQRT1_2, Math.SQRT1_2], [-Math.SQRT1_2, -Math.SQRT1_2]];
    }
  },
  prodline: {
    label: 'f = x·y　在　g = x + y = 1 上',
    f: function (x, y) { return x * y; },
    fx: function (x, y) { return y; },
    fy: function (x, y) { return x; },
    g: function (x, y) { return x + y; },
    gx: function () { return 1; },
    gy: function () { return 1; },
    c: 1,
    t0: -2.4, t1: 2.4,
    path: function (t) { return [t, 1 - t]; },
    stat: function () { return [[0.5, 0.5]]; }
  },
  ellipse: {
    label: 'f = x² + 4y²　在　g = x + y = 1 上',
    f: function (x, y) { return x * x + 4 * y * y; },
    fx: function (x) { return 2 * x; },
    fy: function (x, y) { return 8 * y; },
    g: function (x, y) { return x + y; },
    gx: function () { return 1; },
    gy: function () { return 1; },
    c: 1,
    t0: -2.4, t1: 2.4,
    path: function (t) { return [t, 1 - t]; },
    stat: function () { return [[0.8, 0.2]]; }
  },
  minuscir: {
    label: 'f = x − y²　在　g = x² + y² = 2 上',
    f: function (x, y) { return x - y * y; },
    fx: function () { return 1; },
    fy: function (x, y) { return -2 * y; },
    g: function (x, y) { return x * x + y * y; },
    gx: function (x) { return 2 * x; },
    gy: function (x, y) { return 2 * y; },   /* 必须写两参：调用方按 (x,y) 传，单参会把 x 当 y */
    c: 2,
    t0: 0, t1: 2 * Math.PI,
    path: function (t) { return [Math.SQRT2 * Math.cos(t), Math.SQRT2 * Math.sin(t)]; },
    stat: function () {
      return [[-0.5, Math.sqrt(7) / 2], [-0.5, -Math.sqrt(7) / 2], [Math.SQRT2, 0], [-Math.SQRT2, 0]];
    }
  }
};

/* λ = (∇f·∇g)/|∇g|²（乘子） */
function lg_lambda(cfg, x, y) {
  var gx = cfg.gx(x, y), gy = cfg.gy(x, y), d = gx * gx + gy * gy;
  return d > 1e-15 ? (cfg.fx(x, y) * gx + cfg.fy(x, y) * gy) / d : 0;
}
/* ∇f × ∇g 的（唯一）z 分量：平行 ⇔ 它为 0 */
function lg_cross(cfg, x, y) {
  return cfg.fx(x, y) * cfg.gy(x, y) - cfg.fy(x, y) * cfg.gx(x, y);
}
/* 归一化平行性残差 |∇f×∇g| / (|∇f||∇g|) ∈ [0,1]：0 平行、1 正交 */
function lg_relCross(cfg, x, y) {
  var nf = Math.hypot(cfg.fx(x, y), cfg.fy(x, y)), ng = Math.hypot(cfg.gx(x, y), cfg.gy(x, y));
  return nf * ng > 1e-15 ? Math.abs(lg_cross(cfg, x, y)) / (nf * ng) : 0;
}
/* 约束路径上的点与该点的 f 值 */
function lg_pt(cfg, t) { return cfg.path(t); }
function lg_alongF(cfg, t) { var q = cfg.path(t); return cfg.f(q[0], q[1]); }
/* 沿约束参数化的二阶导（判定极值类型：≠0 即严格局部极值） */
function lg_along2(cfg, t) {
  var h = 1e-4;
  return (lg_alongF(cfg, t + h) - 2 * lg_alongF(cfg, t) + lg_alongF(cfg, t - h)) / (h * h);
}
/* 求点 P 在路径上的参数：粗扫 + 黄金分割细化 */
function lg_findT(cfg, P) {
  var dist = function (t) { var q = cfg.path(t); return (q[0] - P[0]) * (q[0] - P[0]) + (q[1] - P[1]) * (q[1] - P[1]); };
  var N = 1200, span = cfg.t1 - cfg.t0, i, t, d, bt = cfg.t0, bd = Infinity;
  for (i = 0; i <= N; i++) { t = cfg.t0 + span * i / N; d = dist(t); if (d < bd) { bd = d; bt = t; } }
  var a = Math.max(cfg.t0, bt - span / N), b = Math.min(cfg.t1, bt + span / N), m1, m2;
  for (i = 0; i < 70; i++) {
    m1 = a + (b - a) * 0.382; m2 = a + (b - a) * 0.618;
    if (dist(m1) < dist(m2)) b = m2; else a = m1;
  }
  t = (a + b) / 2;
  return { t: t, d: Math.sqrt(dist(t)) };
}
/* 驻点序号（range 控件的值可能是小数，且换约束后序号可能越界 → 夹紧） */
function lg_pick(s, n) { return Math.min(Math.max(0, Math.round(s.k)), n - 1); }

/* =====================================================================
   实验台 ②：拉格朗日乘子（第 13 章，二维）
   ===================================================================== */
lab({
  id: 'lagrange', ch: '13',
  title: '拉格朗日乘子：约束极值处 ∇f ∥ ∇g',
  sub: '背景是 f 的等高线与约束曲线 g = c：拖驻点序号看不同驻点，实线是 ∇f、虚线是 ∇g——驻点处它们平行（相差 λ 倍），对照点上不平行。',
  tex: '\\nabla f(x_0,y_0)=\\lambda\\,\\nabla g(x_0,y_0),\\qquad \\lambda=\\frac{\\nabla f\\cdot\\nabla g}{|\\nabla g|^{2}}',
  note: '约束 g = c 上求 f 的极值：若曲线在该点光滑且 ∇g ≠ 0，则 f 沿曲线的方向导数为 0，' +
    '而曲线切向 ⟂ ∇g，于是 ∇f 只能与 ∇g 平行——比例 λ 就是乘子。反之，约束上 ∇f 与 ∇g 不平行的点（图里的对照点）' +
    '一定还能沿曲线继续爬升或下降，所以不是极值。这把「带约束的极值」化成了「解 ∇f = λ∇g 与 g = c 的方程组」。',
  view: { x0: -2.3, x1: 2.3, y0: -2.1, y1: 2.1, h: 300 },
  ctrls: [
    { k: 'cfg', label: '目标 / 约束', type: 'sel', val: 'sumcir', opts: [
      ['sumcir', 'f = x + y　与　x² + y² = 1'],
      ['prodcir', 'f = x·y　与　x² + y² = 1'],
      ['prodline', 'f = x·y　与　x + y = 1'],
      ['ellipse', 'f = x² + 4y²　与　x + y = 1'],
      ['minuscir', 'f = x − y²　与　x² + y² = 2']] },
    { k: 'k', label: '驻点序号', min: 0, max: 3, step: 1, val: 0 }
  ],
  draw: function (v, s) {
    var P = pal(), cfg = lg_CFG[s.cfg], st = cfg.stat(), pk = st[lg_pick(s, st.length)];
    var x0 = pk[0], y0 = pk[1];
    var lam = lg_lambda(cfg, x0, y0);
    var fx = cfg.fx(x0, y0), fy = cfg.fy(x0, y0), gx = cfg.gx(x0, y0), gy = cfg.gy(x0, y0);
    var cr = lg_cross(cfg, x0, y0), ka, mx, fnd, tc, qc, cqx, cqy, cgx, cgy, mx2, ka2;
    v.axes({ noGrid: true });
    v.heat(cfg.f, { step: 3 });                       /* 先轴后热力图：等高线不会被 axes() 的 clear 擦掉 */
    v.line(v.x0, 0, v.x1, 0, { color: P.axis, w: 1.2 });
    v.line(0, v.y0, 0, v.y1, { color: P.axis, w: 1.2 });
    /* 约束曲线 g = c */
    v.param(function (t) { return cfg.path(t)[0]; }, function (t) { return cfg.path(t)[1]; },
      cfg.t0, cfg.t1, { color: P.curve, w: 2.6, n: 520 });
    /* 驻点处的 ∇f 与 ∇g：平行但长度比 = |λ|（λ<0 时反向） */
    mx = Math.max(Math.hypot(fx, fy), Math.hypot(gx, gy), 1e-9);
    ka = 0.85 / mx;
    v.arrow(x0, y0, x0 + gx * ka, y0 + gy * ka, { color: P.curve2, w: 1.8, dash: [6, 4] });
    v.text(x0 + gx * ka, y0 + gy * ka, ' ∇g', { color: P.curve2, size: 12 });
    v.arrow(x0, y0, x0 + fx * ka, y0 + fy * ka, { color: P.curve3, w: 2.6 });
    v.text(x0 + fx * ka, y0 + fy * ka, ' ∇f', { color: P.curve3, size: 12.5 });
    v.dot(x0, y0, { color: P.dot, r: 5, ring: true });
    v.text(x0, y0, 'P*', { color: P.text, dx: -9, dy: -11, align: 'right', size: 12 });
    /* 对照点：约束上的非驻点，两个梯度明显不平行 */
    fnd = lg_findT(cfg, pk);
    tc = fnd.t + 1.3;
    qc = lg_pt(cfg, tc);
    cqx = cfg.fx(qc[0], qc[1]); cqy = cfg.fy(qc[0], qc[1]);
    cgx = cfg.gx(qc[0], qc[1]); cgy = cfg.gy(qc[0], qc[1]);
    mx2 = Math.max(Math.hypot(cqx, cqy), Math.hypot(cgx, cgy), 1e-9);
    ka2 = 0.85 / mx2;
    v.dot(qc[0], qc[1], { color: P.muted, r: 3.5 });
    v.arrow(qc[0], qc[1], qc[0] + cqx * ka2, qc[1] + cqy * ka2, { color: P.curve3, w: 1.3, dash: [4, 3] });
    v.arrow(qc[0], qc[1], qc[0] + cgx * ka2, qc[1] + cgy * ka2, { color: P.curve2, w: 1.3, dash: [4, 3] });
    v.text(qc[0], qc[1], ' 对照点（不平行）', { color: P.muted, size: 11.5 });
    v.text(v.x0 + .12, v.y1 - .3, 'λ = ' + fmt(lam, 5) + '　|∇f×∇g| = ' + fmt(Math.abs(cr), 10) +
      '　f(P*) = ' + fmt(cfg.f(x0, y0), 5), { color: P.text, size: 12 });
    v.text(v.x0 + .12, v.y0 + .28, '实线 ∇f　虚线 ∇g　背景为 f 的等高线', { color: P.muted, size: 11.5 });
  },
  read: function (s) {
    var cfg = lg_CFG[s.cfg], st = cfg.stat(), pk = st[lg_pick(s, st.length)];
    var x0 = pk[0], y0 = pk[1];
    var lam = lg_lambda(cfg, x0, y0);
    var fx = cfg.fx(x0, y0), fy = cfg.fy(x0, y0), gx = cfg.gx(x0, y0), gy = cfg.gy(x0, y0);
    var cr = Math.abs(lg_cross(cfg, x0, y0));
    var vd = Math.hypot(fx - lam * gx, fy - lam * gy);
    var nf = Math.hypot(fx, fy), ng = Math.hypot(gx, gy);
    var fP = cfg.f(x0, y0);
    var mn = Infinity, mx = -Infinity, i, t, Fv;
    for (i = 0; i <= 1600; i++) {
      t = cfg.t0 + (cfg.t1 - cfg.t0) * i / 1600; Fv = lg_alongF(cfg, t);
      if (Fv < mn) mn = Fv; if (Fv > mx) mx = Fv;
    }
    var kind = Math.abs(fP - mx) < 1e-6 ? '约束上的最大值' : (Math.abs(fP - mn) < 1e-6 ? '约束上的最小值' : '约束上的局部极值');
    var fnd = lg_findT(cfg, pk), qc = lg_pt(cfg, fnd.t + 1.3);
    return [
      ['目标 / 约束', cfg.label],
      ['驻点 P*（第 ' + (lg_pick(s, st.length) + 1) + ' / ' + st.length + ' 个）', '(' + fmt(x0, 5) + ', ' + fmt(y0, 5) + ')'],
      ['λ = (∇f·∇g)/|∇g|²', fmt(lam, 6)],
      ['∇f(P*) / ∇g(P*)', '(' + fmt(fx, 4) + ', ' + fmt(fy, 4) + ') / (' + fmt(gx, 4) + ', ' + fmt(gy, 4) + ')'],
      ['|∇f × ∇g|（平行性残差，验收 <1e-9）', fmt(cr, 14)],
      ['|∇f − λ∇g|（验收 <1e-9）', fmt(vd, 14)],
      ['g(P*) − c（约束残差，验收 <1e-12）', fmt(cfg.g(x0, y0) - cfg.c, 14)],
      ['|∇f| 与 |λ|·|∇g|', fmt(nf, 5) + ' / ' + fmt(Math.abs(lam) * ng, 5)],
      ['f(P*) = ' + fmt(fP, 5), kind + '（沿约束 1600 点采样：max ' + fmt(mx, 4) + '，min ' + fmt(mn, 4) + '）'],
      ['对照点（路径 t* + 1.3）的归一化残差', fmt(lg_relCross(cfg, qc[0], qc[1]), 5) + '（> 0 说明该点不满足平行条件）']
    ];
  },
  assert: function () {
    var L = this, out = [], bad = [], bad2 = [], bad3 = [], bad4 = [];
    var keys = ['sumcir', 'prodcir', 'prodline', 'ellipse', 'minuscir'];
    var nstat = 0, i, j, key, cfg, st, P;
    /* 断言 1（验收条款）：驻点处 ∇f ∥ ∇g（叉积 <1e-9）、∇f = λ∇g（<1e-9）、约束残差 g−c <1e-12 */
    for (i = 0; i < keys.length; i++) {
      key = keys[i]; cfg = lg_CFG[key]; st = cfg.stat();
      for (j = 0; j < st.length; j++) {
        P = st[j]; nstat++;
        var cr = Math.abs(lg_cross(cfg, P[0], P[1]));
        var lam = lg_lambda(cfg, P[0], P[1]);
        var dx = cfg.fx(P[0], P[1]) - lam * cfg.gx(P[0], P[1]);
        var dy = cfg.fy(P[0], P[1]) - lam * cfg.gy(P[0], P[1]);
        var gr = Math.abs(cfg.g(P[0], P[1]) - cfg.c);
        if (!(cr < 1e-9)) bad.push(key + '#' + j + ' |∇f×∇g| = ' + cr.toExponential(2));
        if (!(Math.hypot(dx, dy) < 1e-9)) bad.push(key + '#' + j + ' |∇f−λ∇g| = ' + Math.hypot(dx, dy).toExponential(2));
        if (!(gr < 1e-12)) bad.push(key + '#' + j + ' |g−c| = ' + gr.toExponential(2));
      }
    }
    out.push({ name: 'lagrange: ' + nstat + ' 个驻点处 ∇f ∥ ∇g（|∇f×∇g| <1e-9）、∇f = λ∇g 且 λ=(∇f·∇g)/|∇g|²（<1e-9）、约束残差 |g−c| <1e-12（5 组约束）', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
    /* 断言 2（验收条款）：驻点确为约束上的极值（2 阶判定 ≠ 0 + 两侧邻域采样不劣于） */
    for (i = 0; i < keys.length; i++) {
      key = keys[i]; cfg = lg_CFG[key]; st = cfg.stat();
      for (j = 0; j < st.length; j++) {
        P = st[j];
        var fnd = lg_findT(cfg, P);
        if (!(fnd.d < 1e-6)) bad2.push(key + '#' + j + ' 解析驻点不在约束曲线上（最近距离 ' + fnd.d.toExponential(2) + '）');
        var f2 = lg_along2(cfg, fnd.t);
        if (!(Math.abs(f2) > 1e-6)) bad2.push(key + '#' + j + ' 沿约束二阶导 ≈ 0，无法判定：' + f2.toExponential(2));
        var dl = 1e-3, f0 = lg_alongF(cfg, fnd.t);
        var dp = lg_alongF(cfg, fnd.t + dl) - f0, dm = lg_alongF(cfg, fnd.t - dl) - f0;
        if (f2 < 0) { if (!(dp < 0 && dm < 0)) bad2.push(key + '#' + j + ' 二阶导 < 0 却非局部极大（Δ+=' + dp.toExponential(2) + ', Δ−=' + dm.toExponential(2) + '）'); }
        else { if (!(dp > 0 && dm > 0)) bad2.push(key + '#' + j + ' 二阶导 > 0 却非局部极小（Δ+=' + dp.toExponential(2) + ', Δ−=' + dm.toExponential(2) + '）'); }
      }
    }
    out.push({ name: 'lagrange: ' + nstat + ' 个驻点都是约束曲线上的严格局部极值（沿约束参数化的二阶导 |f″| > 1e-6，且两侧邻域采样 f 值不劣于该点，步长 1e-3、判据 ±0）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
    /* 断言 3（验收条款）：数值扫描复核解析驻点，并给出对照——非驻点不满足平行条件 */
    for (i = 0; i < keys.length; i++) {
      key = keys[i]; cfg = lg_CFG[key]; st = cfg.stat();
      var zs = roots(function (t) { var q = cfg.path(t); return lg_cross(cfg, q[0], q[1]); }, cfg.t0, cfg.t1, 900);
      var uniq = [];
      for (j = 0; j < zs.length; j++) {
        var qz = cfg.path(zs[j]), dup = false, k2;
        for (k2 = 0; k2 < uniq.length; k2++) {
          if (Math.hypot(uniq[k2][0] - qz[0], uniq[k2][1] - qz[1]) < 1e-6) dup = true;
        }
        if (!dup) uniq.push(qz);
      }
      if (uniq.length !== st.length) bad3.push(key + ' 数值零点去重后 ' + uniq.length + ' 个 vs 解析驻点 ' + st.length + ' 个');
      for (j = 0; j < st.length; j++) {
        P = st[j];
        var near = Infinity;
        for (var m = 0; m < uniq.length; m++) near = Math.min(near, Math.hypot(uniq[m][0] - P[0], uniq[m][1] - P[1]));
        if (!(near < 1e-6)) bad3.push(key + '#' + j + ' 解析驻点在数值零点中找不到（最近 ' + near.toExponential(2) + '）');
        var qc = cfg.path(lg_findT(cfg, P).t + 1.3);
        var rel = lg_relCross(cfg, qc[0], qc[1]);
        if (!(rel > 1e-3)) bad3.push(key + '#' + j + ' 对照点平行性残差过小 ' + rel.toExponential(2));
      }
    }
    out.push({ name: 'lagrange: 沿约束数值扫描（符号变化 + 二分，900 段）的零点去重后与 ' + nstat + ' 个解析驻点一一对应（<1e-6）；对照点（非驻点）归一化残差 |∇f×∇g|/(|∇f||∇g|) > 1e-3', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
    /* 断言 4：驻点处沿约束切向的方向导数 ∇f·T = 0 且 ∇g·T = 0；对照点处 |∇f·T| 明显非零 */
    for (i = 0; i < keys.length; i++) {
      key = keys[i]; cfg = lg_CFG[key]; st = cfg.stat();
      for (j = 0; j < st.length; j++) {
        P = st[j];
        var t0p = lg_findT(cfg, P).t, hh = 1e-6;
        var A = lg_pt(cfg, t0p - hh), B = lg_pt(cfg, t0p + hh);
        var tx = (B[0] - A[0]) / (2 * hh), ty = (B[1] - A[1]) / (2 * hh);
        var tl = Math.hypot(tx, ty);
        tx /= tl; ty /= tl;
        var df = cfg.fx(P[0], P[1]) * tx + cfg.fy(P[0], P[1]) * ty;
        var dg = cfg.gx(P[0], P[1]) * tx + cfg.gy(P[0], P[1]) * ty;
        if (!(Math.abs(df) < 1e-9)) bad4.push(key + '#' + j + ' ∇f·T = ' + df.toExponential(2));
        if (!(Math.abs(dg) < 1e-9)) bad4.push(key + '#' + j + ' ∇g·T = ' + dg.toExponential(2));
        var tc2 = t0p + 1.3, C = lg_pt(cfg, tc2 - hh), D2 = lg_pt(cfg, tc2 + hh);
        var ux = (D2[0] - C[0]) / (2 * hh), uy = (D2[1] - C[1]) / (2 * hh), ul = Math.hypot(ux, uy);
        ux /= ul; uy /= ul;
        var dfc = cfg.fx(C[0], C[1]) * ux + cfg.fy(C[0], C[1]) * uy;
        if (!(Math.abs(dfc) > 1e-3)) bad4.push(key + '#' + j + ' 对照点沿切向方向导数过小 ' + dfc.toExponential(2));
      }
    }
    out.push({ name: 'lagrange: 驻点处沿约束切向的方向导数 ∇f·T = 0（<1e-9），且 ∇g·T = 0（<1e-9，说明切向 ⟂ ∇g）；对照点处 |∇f·T| > 1e-3', ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
    return out;
  }
});
/* ==== /草稿合并：A.js ==== */

/* ==== 草稿合并：B.js ==== */
/* 来源：.tmp/labs16/B.js */
/* ===========================================================
   第 14 章新增实验台：二重积分换序（dblorder）＋ 柱/球坐标体积元（volumeel）
   本文件被原样插入 labs.js 的「页面渲染」标记之前（同一 IIFE 作用域）：
   顶层只允许 lab({...}) 注册调用 + 以 do_ / ve_ 开头的辅助函数与常量。
   约束：ES5（var + function）、无外部依赖、两台实验台都要 panes: 2。
   =========================================================== */

/* ============================================================
   ① dblorder 数值内核（名字一律 do_ 前缀）
   ------------------------------------------------------------
   设计：外层用 n 条带的中点采样，内层积分用 5 点 Gauss–Legendre 精确算出。
   被积函数（1、x+y、x²+y²）对 y（或对 x）都是 ≤2 次多项式，而 5 点 GL 对
   ≤9 次多项式精确 ⇒ 内层不引入任何离散误差。于是"条带近似"的误差**只**来自
   外层中点法，约 O(1/n²)（D2 的 √ 端点附近为 O(n^-1.5)），两种次序各自
   收敛到同一个值——这正是 Fubini 定理的数值体现。
   ============================================================ */

var do_GLX = [0, 0.5384693101056831, -0.5384693101056831, 0.906179845938664, -0.906179845938664];
var do_GLW = [0.5688888888888889, 0.4786286704993665, 0.4786286704993665, 0.2369268850561891, 0.2369268850561891];

/* ∫_a^b g(y) dy：5 点 Gauss–Legendre（对 ≤9 次多项式精确） */
function do_gl5(g, a, b) {
  var h = (b - a) / 2;
  if (!(h > 0)) return 0;
  var c = (a + b) / 2, s = 0, i;
  for (i = 0; i < 5; i++) s += do_GLW[i] * g(c + h * do_GLX[i]);
  return s * h;
}

/* 自适应 Simpson（两端点 √ 型奇性也能压到 ~1e-11） */
function do_adap(g, a, b, tol, depth) {
  function sim(lo, hi, flo, fmi, fhi) { return (hi - lo) / 6 * (flo + 4 * fmi + fhi); }
  function rec(lo, hi, flo, fmi, fhi, whole, t, d) {
    var m = (lo + hi) / 2, lm = (lo + m) / 2, rm = (m + hi) / 2;
    var flm = g(lm), frm = g(rm);
    var L2 = sim(lo, m, flo, flm, fmi), R2 = sim(m, hi, fmi, frm, fhi);
    var dd = L2 + R2 - whole;
    if (d <= 0 || Math.abs(dd) <= 15 * t) return L2 + R2 + dd / 15;
    return rec(lo, m, flo, flm, fmi, L2, t / 2, d - 1) + rec(m, hi, fmi, frm, fhi, R2, t / 2, d - 1);
  }
  var m = (a + b) / 2, fa = g(a), fb = g(b), fm = g(m);
  if (!(isFinite(fa) && isFinite(fb) && isFinite(fm))) return NaN;
  return rec(a, b, fa, fm, fb, sim(a, b, fa, fm, fb), tol, depth);
}

/* 先 y 后 x：∫_{xa}^{xb} dx ∫_{ylo(x)}^{yhi(x)} f dy（高精度累次积分） */
function do_iterOuterX(R, f, tol) {
  return do_adap(function (x) {
    return do_gl5(function (y) { return f(x, y); }, R.ylo(x), R.yhi(x));
  }, R.xa, R.xb, tol || 1e-11, 26);
}
/* 先 x 后 y：∫_{ya}^{yb} dy ∫_{xl(y)}^{xr(y)} f dx（高精度累次积分） */
function do_iterOuterY(R, f, tol) {
  return do_adap(function (y) {
    return do_gl5(function (x) { return f(x, y); }, R.xl(y), R.xr(y));
  }, R.ya, R.yb, tol || 1e-11, 26);
}
/* 显示用条带和：n 条竖带（先 y 后 x），每带在带中点取内层精确积分 */
function do_stripOuterX(R, f, n) {
  var d = (R.xb - R.xa) / n, s = 0, i, xc;
  for (i = 0; i < n; i++) {
    xc = R.xa + (i + 0.5) * d;
    s += do_gl5(function (y) { return f(xc, y); }, R.ylo(xc), R.yhi(xc)) * d;
  }
  return s;
}
/* 显示用条带和：n 条横带（先 x 后 y） */
function do_stripOuterY(R, f, n) {
  var d = (R.yb - R.ya) / n, s = 0, i, yc;
  for (i = 0; i < n; i++) {
    yc = R.ya + (i + 0.5) * d;
    s += do_gl5(function (x) { return f(x, yc); }, R.xl(yc), R.xr(yc)) * d;
  }
  return s;
}
/* 区域边界折线的鞋带公式面积（独立于累次积分的几何复算） */
function do_shoelace(R, n) {
  var a = R.bnd(0), px = a[0], py = a[1], x0 = px, y0 = py, s = 0, i, b;
  for (i = 1; i <= n; i++) {
    b = R.bnd(i / n);
    s += px * b[1] - b[0] * py;
    px = b[0]; py = b[1];
  }
  s += px * y0 - x0 * py;
  return s / 2;
}
/* 边界点列（画区域轮廓用） */
function do_bndPts(R, n) {
  var pts = [], i;
  for (i = 0; i <= n; i++) pts.push(R.bnd(i / n));
  return pts;
}
/* 一块画布：条带 + 区域轮廓 + 算式文字；outerX=true 画竖条带（先 y 后 x） */
function do_paintPane(v, R, P, outerX, n, f, fname) {
  var pts = do_bndPts(R, 320), i, c1, c2, cc, lo, hi, d;
  var S = outerX ? do_stripOuterX(R, f, n) : do_stripOuterY(R, f, n);
  v.axes();
  d = (outerX ? (R.xb - R.xa) : (R.yb - R.ya)) / n;
  for (i = 0; i < n; i++) {
    c1 = (outerX ? R.xa : R.ya) + i * d;
    c2 = c1 + d; cc = (c1 + c2) / 2;
    lo = outerX ? R.ylo(cc) : R.xl(cc);
    hi = outerX ? R.yhi(cc) : R.xr(cc);
    if (hi > lo) {
      if (outerX) {
        v.poly([[c1, lo], [c2, lo], [c2, hi], [c1, hi]],
          { close: true, fill: P.fill, stroke: 'rgba(120,140,170,.45)', w: 0.8 });
        v.line(cc, lo, cc, hi, { color: P.curve2, w: 1.1 });
      } else {
        v.poly([[lo, c1], [lo, c2], [hi, c2], [hi, c1]],
          { close: true, fill: P.fill, stroke: 'rgba(120,140,170,.45)', w: 0.8 });
        v.line(lo, cc, hi, cc, { color: P.curve2, w: 1.1 });
      }
    }
  }
  v.poly(pts, { close: true, fill: null, stroke: P.curve, w: 2.4 });
  /* 算式 + 数值：像素→世界单位换算，免得字号随画布几何漂移 */
  var fs = v.W < 440 ? 10.4 : 12.1;
  var ySpan = v.y1 - v.y0, hPx = Math.max(40, v.H - v.pad.t - v.pad.b);
  var dyW = 15 * ySpan / hPx;
  var tx = v.x0 + 0.055 * (v.x1 - v.x0), ty = v.y1 - 0.05 * ySpan;
  var lines = [outerX ? '先 y 后 x（外 x 内 y）' : '先 x 后 y（外 y 内 x）',
    outerX ? R.tx : R.ty,
    fname + '：S = ' + fmt(S, 7) + '（n = ' + n + ' 条带）'];
  for (i = 0; i < 3; i++) {
    v.text(tx, ty - i * dyW, lines[i], { color: i === 2 ? P.curve2 : P.text, size: fs, base: 'top' });
  }
}

/* ================= 第 14 章：二重积分换序（双面板 · 两块二维画布） ================= */
lab({
  id: 'dblorder', ch: '14',
  title: '二重积分换序：同一块区域，两种累次积分',
  sub: '左：先 y 后 x 的竖条采样带；右：先 x 后 y 的横条采样带。同一区域、同一被积函数，换序不换值。',
  tex: '\\iint_D f\\,dA=\\int_a^b\\!\\!\\int_{y_1(x)}^{y_2(x)}\\! f\\,dy\\,dx=\\int_c^d\\!\\!\\int_{x_1(y)}^{x_2(y)}\\! f\\,dx\\,dy',
  note: 'Fubini 定理：区域既能竖着切、又能横着切时，两种累次积分相等——换序只是为了把内层积分变简单。' +
    '两台各自把区域切成 n 条带，条带在带中点取样，带内的内层积分用精确公式（5 点 Gauss–Legendre，' +
    '对本页的 1、x+y、x²+y² 完全精确）算出；所以误差只来自外层中点法，约按 1/n² 下降，' +
    '两种次序都收敛到同一个数，也就是解析值。',
  panes: 2,
  view: { x0: -0.16, x1: 1.26, y0: -0.16, y1: 1.26 },
  view2: { x0: -0.16, x1: 1.26, y0: -0.16, y1: 1.26 },
  ctrls: [
    { k: 'reg', label: '区域 D', type: 'sel', val: 'd1', opts: [
      ['d1', 'D1：0 ≤ x ≤ 1，x² ≤ y ≤ x'],
      ['d2', 'D2：单位圆第一象限'],
      ['d3', 'D3：0 ≤ y ≤ 1，y ≤ x ≤ 1'],
      ['d4', 'D4：0 ≤ x ≤ 1，0 ≤ y ≤ 1 − x']] },
    { k: 'f', label: '被积函数 f', type: 'sel', val: 'one', opts: [
      ['one', 'f = 1（就是面积）'],
      ['xy', 'f = x + y'],
      ['sq', 'f = x² + y²']] },
    { k: 'n', label: '条带数 n', min: 1, max: 40, step: 1, val: 10 }
  ],
  regs: {
    d1: {
      key: 'd1', fname: '', label: 'D1：0 ≤ x ≤ 1，x² ≤ y ≤ x',
      xa: 0, xb: 1, ya: 0, yb: 1,
      ylo: function (x) { return x * x; }, yhi: function (x) { return x; },
      xl: function (y) { return y; }, xr: function (y) { return Math.sqrt(y); },
      tx: '∫₀¹ dx ∫[x² → x] f dy', ty: '∫₀¹ dy ∫[y → √y] f dx',
      exact: { one: 1 / 6, xy: 3 / 20, sq: 3 / 35 },
      exactTxt: { one: '1/6', xy: '3/20', sq: '3/35' },
      bnd: function (t) {
        if (t <= 0.5) { var x = 2 * t; return [x, x * x]; }
        var u = 2 * (1 - t); return [u, u];
      }
    },
    d2: {
      key: 'd2', fname: '', label: 'D2：单位圆第一象限 x² + y² ≤ 1',
      xa: 0, xb: 1, ya: 0, yb: 1,
      ylo: function () { return 0; }, yhi: function (x) { return Math.sqrt(Math.max(0, 1 - x * x)); },
      xl: function () { return 0; }, xr: function (y) { return Math.sqrt(Math.max(0, 1 - y * y)); },
      tx: '∫₀¹ dx ∫[0 → √(1−x²)] f dy', ty: '∫₀¹ dy ∫[0 → √(1−y²)] f dx',
      exact: { one: Math.PI / 4, xy: 2 / 3, sq: Math.PI / 8 },
      exactTxt: { one: 'π/4', xy: '2/3', sq: 'π/8' },
      bnd: function (t) {
        if (t <= 1 / 3) return [3 * t, 0];
        if (t <= 2 / 3) { var th = (t - 1 / 3) * 3 * Math.PI / 2; return [Math.cos(th), Math.sin(th)]; }
        return [0, 3 * (1 - t)];
      }
    },
    d3: {
      key: 'd3', fname: '', label: 'D3：0 ≤ y ≤ 1，y ≤ x ≤ 1',
      xa: 0, xb: 1, ya: 0, yb: 1,
      ylo: function () { return 0; }, yhi: function (x) { return x; },
      xl: function (y) { return y; }, xr: function () { return 1; },
      tx: '∫₀¹ dx ∫[0 → x] f dy', ty: '∫₀¹ dy ∫[y → 1] f dx',
      exact: { one: 1 / 2, xy: 1 / 2, sq: 1 / 3 },
      exactTxt: { one: '1/2', xy: '1/2', sq: '1/3' },
      bnd: function (t) {
        if (t <= 1 / 3) return [3 * t, 0];
        if (t <= 2 / 3) return [1, 3 * (t - 1 / 3)];
        var u = 3 * (1 - t); return [u, u];
      }
    },
    d4: {
      key: 'd4', fname: '', label: 'D4：0 ≤ x ≤ 1，0 ≤ y ≤ 1 − x',
      xa: 0, xb: 1, ya: 0, yb: 1,
      ylo: function () { return 0; }, yhi: function (x) { return 1 - x; },
      xl: function () { return 0; }, xr: function (y) { return 1 - y; },
      tx: '∫₀¹ dx ∫[0 → 1−x] f dy', ty: '∫₀¹ dy ∫[0 → 1−y] f dx',
      exact: { one: 1 / 2, xy: 1 / 3, sq: 1 / 6 },
      exactTxt: { one: '1/2', xy: '1/3', sq: '1/6' },
      bnd: function (t) {
        if (t <= 1 / 3) return [3 * t, 0];
        if (t <= 2 / 3) { var u = 3 * (t - 1 / 3); return [1 - u, u]; }
        return [0, 3 * (1 - t)];
      }
    }
  },
  fn: {
    one: function () { return 1; },
    xy: function (x, y) { return x + y; },
    sq: function (x, y) { return x * x + y * y; }
  },
  names: { one: 'f = 1', xy: 'f = x + y', sq: 'f = x² + y²' },
  draw: function (v, s) {
    var P = pal(), L = this, arr = (v && v.length) ? v : [v];
    var R = L.regs[s.reg] || L.regs.d1, f = L.fn[s.f] || L.fn.one, n = Math.max(1, Math.round(s.n));
    var fname = L.names[s.f] || L.names.one;
    if (!arr[0]) return;
    do_paintPane(arr[0], R, P, true, n, f, fname);
    if (arr.length < 2 || !arr[1]) return;
    do_paintPane(arr[1], R, P, false, n, f, fname);
  },
  read: function (s) {
    var L = this, R = L.regs[s.reg] || L.regs.d1, f = L.fn[s.f] || L.fn.one, n = Math.max(1, Math.round(s.n));
    var k = L.fn[s.f] ? s.f : 'one';
    var S1 = do_stripOuterX(R, f, n), S2 = do_stripOuterY(R, f, n);
    var I1 = do_iterOuterX(R, f), I2 = do_iterOuterY(R, f);
    var ex = R.exact[k];
    var ar = do_iterOuterX(R, function () { return 1; });
    var sa = do_shoelace(R, 20000);
    return [
      ['区域 D', R.label],
      ['被积函数', L.names[k]],
      ['先 y 后 x 条带和 S₁（n = ' + n + ' 条竖带）', fmt(S1, 8)],
      ['先 x 后 y 条带和 S₂（n = ' + n + ' 条横带）', fmt(S2, 8)],
      ['两者之差 |S₁ − S₂|（两套外层求积，差 ~O(1/n²)）', fmt(Math.abs(S1 - S2), 8)],
      ['高精度累次积分（自适应 Simpson，两次序均值）', fmt((I1 + I2) / 2, 10)],
      ['两者之差 |I₁ − I₂|（Fubini，验收 <1e-6）', fmt(Math.abs(I1 - I2), 12)],
      ['解析闭式值', fmt(ex, 10) + '（' + R.exactTxt[k] + '）'],
      ['误差 |累次积分 − 解析值|', fmt(Math.abs((I1 + I2) / 2 - ex), 12)],
      ['区域面积 ∬1 dA（累次积分）', fmt(ar, 10)],
      ['区域面积（边界折线鞋带公式，独立复算）', fmt(sa, 10)],
      ['条带和误差 |S₁ − 解析值|（n = ' + n + '）', fmt(Math.abs(S1 - ex), 8)]
    ];
  },
  assert: function () {
    var L = this, out = [], bad = [], bad2 = [], bad3 = [], bad4 = [], bad5 = [];
    var ks = ['d1', 'd2', 'd3', 'd4'], fs = ['one', 'xy', 'sq'], i, j, R, f, I1, I2, ex, e1, e2, e3, k, o1, o2;
    /* 断言 1：两种次序的高精度累次积分相等 <1e-6（4 区域 × 3 被积函数 = 12 组） */
    for (i = 0; i < ks.length; i++) {
      R = L.regs[ks[i]];
      for (j = 0; j < fs.length; j++) {
        f = L.fn[fs[j]];
        I1 = do_iterOuterX(R, f); I2 = do_iterOuterY(R, f);
        if (!(Math.abs(I1 - I2) < 1e-6)) bad.push(ks[i] + '/' + fs[j] + ' 差=' + Math.abs(I1 - I2).toExponential(2));
      }
    }
    out.push({ name: 'dblorder: 先 y 后 x 与先 x 后 y 的累次积分相等 <1e-6（4 区域 × 3 被积函数）',
      ok: bad.length === 0, detail: bad.join('; ') || 'ok' });
    /* 断言 2：两种次序都与解析闭式值一致 <1e-6（D2 用 π/4、π/8，D4 用 1/2、1/3、1/6，D1 用 1/6、3/20、3/35） */
    for (i = 0; i < ks.length; i++) {
      R = L.regs[ks[i]];
      for (j = 0; j < fs.length; j++) {
        f = L.fn[fs[j]]; ex = R.exact[fs[j]];
        I1 = do_iterOuterX(R, f); I2 = do_iterOuterY(R, f);
        if (!(Math.abs(I1 - ex) < 1e-6)) bad2.push(ks[i] + '/' + fs[j] + ' 先y后x 差=' + Math.abs(I1 - ex).toExponential(2));
        if (!(Math.abs(I2 - ex) < 1e-6)) bad2.push(ks[i] + '/' + fs[j] + ' 先x后y 差=' + Math.abs(I2 - ex).toExponential(2));
      }
    }
    out.push({ name: 'dblorder: 两种次序的累次积分与解析闭式值一致 <1e-6（12 组 × 2 次序）',
      ok: bad2.length === 0, detail: bad2.join('; ') || 'ok' });
    /* 断言 3：条带近似随 n 收敛（err(400) ≤ err(100) 且 err(1600) ≤ err(400)），4 区域 × 3 函数 × 2 次序 */
    for (i = 0; i < ks.length; i++) {
      R = L.regs[ks[i]];
      for (j = 0; j < fs.length; j++) {
        f = L.fn[fs[j]]; ex = R.exact[fs[j]];
        for (k = 0; k < 2; k++) {
          o1 = k ? do_stripOuterY(R, f, 100) : do_stripOuterX(R, f, 100);
          o2 = k ? do_stripOuterY(R, f, 400) : do_stripOuterX(R, f, 400);
          e1 = Math.abs(o1 - ex); e2 = Math.abs(o2 - ex);
          e3 = Math.abs((k ? do_stripOuterY(R, f, 1600) : do_stripOuterX(R, f, 1600)) - ex);
          if (!(e2 <= e1 + 1e-15)) bad3.push(ks[i] + '/' + fs[j] + (k ? ' 先x后y' : ' 先y后x') + ' err400>err100 ' + e1.toExponential(2) + '→' + e2.toExponential(2));
          if (!(e3 <= e2 + 1e-15)) bad3.push(ks[i] + '/' + fs[j] + (k ? ' 先x后y' : ' 先y后x') + ' err1600>err400 ' + e2.toExponential(2) + '→' + e3.toExponential(2));
        }
      }
    }
    out.push({ name: 'dblorder: 条带近似随 n 收敛（err(400) ≤ err(100)、err(1600) ≤ err(400)，12 组 × 2 次序）',
      ok: bad3.length === 0, detail: bad3.join('; ') || 'ok' });
    /* 断言 4：∬_D 1 dA = 区域几何面积 <1e-6（累次积分 ↔ 边界折线鞋带公式 ↔ 闭式） */
    for (i = 0; i < ks.length; i++) {
      R = L.regs[ks[i]];
      I1 = do_iterOuterX(R, function () { return 1; });
      I2 = do_iterOuterY(R, function () { return 1; });
      var sa = do_shoelace(R, 20000);
      if (!(Math.abs(I1 - sa) < 1e-6)) bad4.push(ks[i] + ' 累次−鞋带=' + Math.abs(I1 - sa).toExponential(2));
      if (!(Math.abs(I2 - sa) < 1e-6)) bad4.push(ks[i] + ' 换序−鞋带=' + Math.abs(I2 - sa).toExponential(2));
      if (!(Math.abs(sa - R.exact.one) < 1e-6)) bad4.push(ks[i] + ' 鞋带−闭式=' + Math.abs(sa - R.exact.one).toExponential(2));
    }
    out.push({ name: 'dblorder: ∬1 dA 等于几何面积 <1e-6（累次积分 / 边界鞋带公式 / 闭式 三方交叉）',
      ok: bad4.length === 0, detail: bad4.join('; ') || 'ok' });
    /* 断言 5：内层 5 点 Gauss–Legendre 对 ≤9 次多项式精确（∫y³、∫y⁵ 复核 <1e-12） */
    var a1 = 0.2, b1 = 1.1;
    var i3 = do_gl5(function (y) { return y * y * y; }, a1, b1);
    var i5 = do_gl5(function (y) { return y * y * y * y * y; }, a1, b1);
    if (!(Math.abs(i3 - (Math.pow(b1, 4) - Math.pow(a1, 4)) / 4) < 1e-12)) bad5.push('∫y³ 差=' + Math.abs(i3 - (Math.pow(b1, 4) - Math.pow(a1, 4)) / 4).toExponential(2));
    if (!(Math.abs(i5 - (Math.pow(b1, 6) - Math.pow(a1, 6)) / 6) < 1e-12)) bad5.push('∫y⁵ 差=' + Math.abs(i5 - (Math.pow(b1, 6) - Math.pow(a1, 6)) / 6).toExponential(2));
    out.push({ name: 'dblorder: 内层 5 点 Gauss–Legendre 对 ≤9 次多项式精确（∫y³、∫y⁵ 误差 <1e-12）',
      ok: bad5.length === 0, detail: bad5.join('; ') || 'ok' });
    return out;
  }
});

/* ============================================================
   ② volumeel 数值内核（名字一律 ve_ 前缀）
   ------------------------------------------------------------
   · 单元体积 = 坐标变换的体积元因子 × 三个步长之积（在单元中心取值）。
   · 坐标变换 (r,θ,z) → (x,y,z) 与 (ρ,φ,θ) → (x,y,z) 的雅可比行列式用
     Richardson 外推的中心差分**数值**复算（误差 ~1e-13），与解析因子比对。
   · ΣdV 用因子化求和：被加项 r·Δr Δθ Δz 对三个下标可分离，分配律下与
     显式三重循环逐项恒等（粗网格交叉验证），因此细网格也能瞬间算完。
   ============================================================ */

function ve_cylMap(q) { return [q[0] * Math.cos(q[1]), q[0] * Math.sin(q[1]), q[2]]; }
function ve_ballMap(q) {
  var s = Math.sin(q[1]);
  return [q[0] * s * Math.cos(q[2]), q[0] * s * Math.sin(q[2]), q[0] * Math.cos(q[1])];
}
/* ∂(map(p)[i]) / ∂p[k]：Richardson 外推的中心差分（误差 O(h⁴)+舍入 ~1e-13） */
function ve_part(map, p, i, k) {
  var h = 1e-3, x = p[k];
  var g = function (t) { var q = [p[0], p[1], p[2]]; q[k] = t; return map(q)[i]; };
  var d1 = (g(x + h) - g(x - h)) / (2 * h), d2 = (g(x + 2 * h) - g(x - 2 * h)) / (4 * h);
  return (4 * d1 - d2) / 3;
}
function ve_det3(M) {
  return M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1])
    - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0])
    + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
}
/* 数值雅可比行列式 */
function ve_jac3(map, p) {
  var M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], i, k;
  for (i = 0; i < 3; i++) for (k = 0; k < 3; k++) M[i][k] = ve_part(map, p, i, k);
  return ve_det3(M);
}
/* 柱坐标：显式三重循环 Σ r_c Δr Δθ Δz */
function ve_cylSum(R, H, nr, nt, nz) {
  var dr = R / nr, dt = 2 * Math.PI / nt, dz = H / nz, s = 0, i, j, k;
  for (i = 0; i < nr; i++) for (j = 0; j < nt; j++) for (k = 0; k < nz; k++) s += (i + 0.5) * dr * dr * dt * dz;
  return s;
}
/* 柱坐标：因子化求和（分配律下与显式三重循环逐项恒等） */
function ve_cylSumFast(R, H, nr) {
  var dr = R / nr, sr = 0, i;
  for (i = 0; i < nr; i++) sr += (i + 0.5) * dr * dr;
  return sr * (2 * Math.PI) * H;
}
/* 球坐标：显式三重循环 Σ ρ_c² sinφ_c Δρ Δφ Δθ */
function ve_ballSum(R, np, nf, nb) {
  var dp = R / np, df = Math.PI / nf, dt = 2 * Math.PI / nb, s = 0, i, j, k;
  for (i = 0; i < np; i++) for (j = 0; j < nf; j++) for (k = 0; k < nb; k++) {
    var pc = (i + 0.5) * dp;
    s += pc * pc * Math.sin((j + 0.5) * df) * dp * df * dt;
  }
  return s;
}
/* 球坐标：因子化求和 */
function ve_ballSumFast(R, np, nf, nb) {
  var dp = R / np, df = Math.PI / nf, dt = 2 * Math.PI / nb, sp = 0, sf = 0, i, j;
  for (i = 0; i < np; i++) { var pc = (i + 0.5) * dp; sp += pc * pc * dp; }
  for (j = 0; j < nf; j++) sf += Math.sin((j + 0.5) * df) * df;
  return sp * sf * (nb * dt);   /* Σ_k Δθ = nθ·Δθ = 2π，求和与显式三重循环逐项恒等 */
}
/* 单元体积 = 因子(中心) × 步长乘积 */
function ve_cellCyl(rc, dr, dt, dz) { return rc * dr * dt * dz; }
function ve_cellBall(pc, fc, dp, df, dt) { return pc * pc * Math.sin(fc) * dp * df * dt; }

/* ================= 第 14 章：柱/球坐标体积元（双面板 · 两块三维画布） =================
   方案说明（note 里也写明）：左三维画布画柱坐标的扇柱单元堆叠，右三维画布画球坐标的
   楔块单元堆叠。两块都用三维是因为"体积元"本身就是空间里的小块，二维切面反而要额外
   解释投影关系；三维还能拖拽旋转，看清 Δr/Δθ/Δz 与 Δρ/Δφ/Δθ 各自的方向。 */
lab({
  id: 'volumeel', ch: '14',
  title: '柱坐标与球坐标的体积元：把区域切成小块再相加',
  sub: '左：柱坐标扇柱块 dV = r dr dθ dz（拖拽可旋转）；右：球坐标楔块 dV = ρ²sinφ dρ dφ dθ',
  tex: 'dV=r\\,dr\\,d\\theta\\,dz,\\qquad dV=\\rho^{2}\\sin\\varphi\\;d\\rho\\,d\\varphi\\,d\\theta',
  note: '体积元就是坐标变换的雅可比因子乘三个步长：柱坐标的因子是 r（离轴越远，同样 Δθ 扫过的弧越长），' +
    '球坐标的因子是 ρ²sinφ（既有 ρ² 的伸缩，又有 sinφ 把极角步长折算成弧长）。' +
    '把区域切成单元、逐个算"因子(中心) × 步长乘积"再求和，就是三重积分的黎曼和，' +
    '细分后 → ∫∫∫ 的值。本页两块画布都是三维：扇柱块与球楔块的堆叠关系在三维里才看得清。',
  dim3: true,
  panes: 2,
  view: { x0: -1.5, x1: 1.5, y0: -1.5, y1: 1.5, z0: 0, z1: 1.8, yaw: 0.7, pitch: 0.42, labelAuto: true },
  view2: { x0: -1.4, x1: 1.4, y0: -1.4, y1: 1.4, z0: -1.4, z1: 1.4, yaw: 0.7, pitch: 0.42, labelAuto: true },
  CR: 1.2,     /* 圆柱半径 R */
  CH: 1.6,     /* 圆柱高 H（数值上 H 就是"柱高"，图形上 = 1.6） */
  CB: 1.0,     /* 球半径 R */
  ctrls: [
    { k: 'nr', label: '柱：径向 nᵣ', min: 1, max: 6, step: 1, val: 4 },
    { k: 'nt', label: '柱：角向 nθ', min: 3, max: 14, step: 1, val: 10 },
    { k: 'nz', label: '柱：轴向 n_z', min: 1, max: 4, step: 1, val: 2 },
    { k: 'np', label: '球：径向 nρ', min: 1, max: 6, step: 1, val: 4 },
    { k: 'nf', label: '球：极角 nφ', min: 2, max: 10, step: 1, val: 6 },
    { k: 'nb', label: '球：方位 nθ', min: 3, max: 10, step: 1, val: 10 }
  ],
  draw: function (v, s) {
    var P = pal(), L = this, arr = (v && v.length) ? v : [v];
    var v3 = arr[0], v4 = arr.length > 1 ? arr[1] : null;
    var R = L.CR, H = L.CH, i, j, k, cb;

    /* ---------- 左：柱坐标 dV = r dr dθ dz ---------- */
    var nr = Math.max(1, Math.round(s.nr)), nt = Math.max(3, Math.round(s.nt)), nz = Math.max(1, Math.round(s.nz));
    var dr = R / nr, dt = 2 * Math.PI / nt, dz = H / nz;
    var cells = [];
    for (i = 0; i < nr; i++) for (j = 0; j < nt; j++) for (k = 0; k < nz; k++) {
      var r1 = i * dr, r2 = r1 + dr, t1 = j * dt, t2 = t1 + dt, z1 = k * dz, z2 = z1 + dz;
      var ca = Math.cos(t1), sa = Math.sin(t1), cbb = Math.cos(t2), sbb = Math.sin(t2);
      var pts = [
        [r1 * ca, r1 * sa, z1], [r2 * ca, r2 * sa, z1], [r2 * cbb, r2 * sbb, z1], [r1 * cbb, r1 * sbb, z1],
        [r1 * ca, r1 * sa, z2], [r2 * ca, r2 * sa, z2], [r2 * cbb, r2 * sbb, z2], [r1 * cbb, r1 * sbb, z2]];
      var rm = (r1 + r2) / 2, tm = (t1 + t2) / 2, zm = (z1 + z2) / 2;
      cells.push({ pts: pts, d: v3.projMath([rm * Math.cos(tm), rm * Math.sin(tm), zm]).d,
        first: (i === 0 && j === 0 && k === 0), ctr: [rm * Math.cos(tm), rm * Math.sin(tm), zm], vol: ve_cellCyl(rm, dr, dt, dz) });
    }
    cells.sort(function (a, b) { return b.d - a.d; });
    v3.axes3({ nx: 4, ny: 4 });
    var one = null;
    for (i = 0; i < cells.length; i++) {
      if (cells[i].first) one = cells[i];
      v3.poly3(cells[i].pts, { fill: cells[i].first ? P.fill2 : (i % 2 ? P.fill : P.fill3), stroke: 'rgba(120,140,170,.42)', w: 0.7 });
    }
    v3.line3([0, 0, 0], [R, 0, 0], { color: P.curve2, w: 1.8, dash: [5, 3] });
    v3.line3([0, -R, 0], [0, -R, H], { color: P.curve4, w: 1.8, dash: [5, 3] });
    var c0 = one ? one.ctr : [dr / 2, 0, dz / 2];
    v3.text3(c0[0], c0[1], c0[2], 'dV = r dr dθ dz', { color: P.text, size: 11.5 });
    v3.text3(0, -R, H * 0.5, 'H = ' + H, { color: P.curve4, size: 11.5 });
    v3.dot3(c0[0], c0[1], c0[2], { color: P.dot, r: 3.6 });

    if (!v4) return;
    /* ---------- 右：球坐标 dV = ρ²sinφ dρ dφ dθ ---------- */
    var RB = L.CB, np = Math.max(1, Math.round(s.np)), nf = Math.max(2, Math.round(s.nf)), nb = Math.max(3, Math.round(s.nb));
    var dp = RB / np, df = Math.PI / nf, db = 2 * Math.PI / nb;
    var bcells = [];
    for (i = 0; i < np; i++) for (j = 0; j < nf; j++) for (k = 0; k < nb; k++) {
      var p1 = i * dp, p2 = p1 + dp, f1 = j * df, f2 = f1 + df, b1 = k * db, b2 = b1 + db;
      var sp1 = Math.sin(f1), sp2 = Math.sin(f2), cp1 = Math.cos(f1), cp2 = Math.cos(f2);
      var e1 = Math.cos(b1), g1 = Math.sin(b1), e2 = Math.cos(b2), g2 = Math.sin(b2);
      var bpts = [
        [p1 * sp1 * e1, p1 * sp1 * g1, p1 * cp1], [p2 * sp1 * e1, p2 * sp1 * g1, p2 * cp1],
        [p2 * sp1 * e2, p2 * sp1 * g2, p2 * cp1], [p1 * sp1 * e2, p1 * sp1 * g2, p1 * cp1],
        [p1 * sp2 * e1, p1 * sp2 * g1, p1 * cp2], [p2 * sp2 * e1, p2 * sp2 * g1, p2 * cp2],
        [p2 * sp2 * e2, p2 * sp2 * g2, p2 * cp2], [p1 * sp2 * e2, p1 * sp2 * g2, p1 * cp2]];
      var pc = (p1 + p2) / 2, fc = (f1 + f2) / 2, bcm = (b1 + b2) / 2;
      var spc = Math.sin(fc);
      bcells.push({ pts: bpts,
        d: v4.projMath([pc * spc * Math.cos(bcm), pc * spc * Math.sin(bcm), pc * Math.cos(fc)]).d,
        first: (i === 0 && j === 0 && k === 0),
        ctr: [pc * spc * Math.cos(bcm), pc * spc * Math.sin(bcm), pc * Math.cos(fc)],
        vol: ve_cellBall(pc, fc, dp, df, db) });
    }
    bcells.sort(function (a, b) { return b.d - a.d; });
    v4.axes3({ nx: 4, ny: 4 });
    var oneB = null;
    for (i = 0; i < bcells.length; i++) {
      if (bcells[i].first) oneB = bcells[i];
      v4.poly3(bcells[i].pts, { fill: bcells[i].first ? P.fill2 : (i % 2 ? P.fill : P.fill3), stroke: 'rgba(120,140,170,.42)', w: 0.7 });
    }
    v4.line3([0, 0, -RB], [0, 0, RB], { color: P.curve4, w: 1.4, dash: [5, 3] });
    cb = oneB ? oneB.ctr : [0, 0, RB];
    v4.text3(cb[0], cb[1], cb[2], 'dV = ρ²sinφ dρ dφ dθ', { color: P.text, size: 11.5 });
    v4.dot3(cb[0], cb[1], cb[2], { color: P.dot, r: 3.6 });
  },
  read: function (s) {
    var L = this, R = L.CR, H = L.CH, RB = L.CB;
    var nr = Math.max(1, Math.round(s.nr)), nt = Math.max(3, Math.round(s.nt)), nz = Math.max(1, Math.round(s.nz));
    var np = Math.max(1, Math.round(s.np)), nf = Math.max(2, Math.round(s.nf)), nb = Math.max(3, Math.round(s.nb));
    var dr = R / nr, dt = 2 * Math.PI / nt, dz = H / nz;
    var dp = RB / np, df = Math.PI / nf, db = 2 * Math.PI / nb;
    var vc = ve_cellCyl(0.5 * dr, dr, dt, dz);
    var vb = ve_cellBall(0.5 * dp, 0.5 * df, dp, df, db);
    var sc = ve_cylSumFast(R, H, nr), vcyl = Math.PI * R * R * H;
    var sb = ve_ballSumFast(RB, np, nf, nb), vball = 4 * Math.PI * RB * RB * RB / 3;
    var sf = ve_ballSumFast(RB, 4000, 4000, 4000);
    var jc = ve_jac3(ve_cylMap, [0.8, 1.1, 0.6]);
    var jb = ve_jac3(ve_ballMap, [0.9, 1.0, 0.7]);
    return [
      ['柱坐标步长 Δr / Δθ / Δz', fmt(dr, 4) + ' / ' + fmt(dt, 4) + ' / ' + fmt(dz, 4)],
      ['柱坐标单元数 nᵣ × nθ × n_z', nr + ' × ' + nt + ' × ' + nz + ' = ' + (nr * nt * nz)],
      ['柱：首个单元体积 = 因子(中心 r) × 步长乘积', fmt(vc, 8) + '（r = ' + fmt(0.5 * dr, 4) + '）'],
      ['柱：ΣdV（当前细分，因子化 = 三重循环）', fmt(sc, 8)],
      ['柱：圆柱体积 πR²H', fmt(vcyl, 8) + '（R = ' + R + '，H = ' + H + '）'],
      ['柱：相对误差（中点法对 ∫r dr 精确，故≈机器零）', fmt(Math.abs(sc - vcyl) / vcyl, 12)],
      ['球坐标步长 Δρ / Δφ / Δθ', fmt(dp, 4) + ' / ' + fmt(df, 4) + ' / ' + fmt(db, 4)],
      ['球坐标单元数 nρ × nφ × nθ', np + ' × ' + nf + ' × ' + nb + ' = ' + (np * nf * nb)],
      ['球：首个单元体积 = 因子(中心 ρ,φ) × 步长乘积', fmt(vb, 8)],
      ['球：ΣdV（当前细分）', fmt(sb, 8)],
      ['球：4πR³/3', fmt(vball, 8) + '（R = ' + RB + '）'],
      ['球：相对误差（当前细分）', fmt(Math.abs(sb - vball) / vball, 8)],
      ['球：ΣdV（nρ = nφ = nθ = 4000）与 4πR³/3 之差', fmt(Math.abs(sf - vball), 12)],
      ['数值雅可比 |∂(x,y,z)/∂(r,θ,z)|（r = 0.8 处）与因子 r 之差', fmt(Math.abs(jc - 0.8), 14)],
      ['数值雅可比 |∂(x,y,z)/∂(ρ,φ,θ)|（ρ = 0.9, φ = 1.0 处）与 ρ²sinφ 之差', fmt(Math.abs(jb - 0.81 * Math.sin(1.0)), 14)]
    ];
  },
  assert: function () {
    var L = this, out = [], bad = [], bad2 = [], bad3 = [], bad4 = [], bad5 = [];
    var R = L.CR, H = L.CH, RB = L.CB, i, k, d;
    /* 断言 1：ΣdV（柱）= πR²H <1e-6 —— 粗细分（显式三重循环）与细网格（因子化）都查 */
    var cyc = [[1, 3, 1], [3, 8, 2], [4, 10, 2], [6, 14, 4]], n1, j1, k1;
    for (i = 0; i < cyc.length; i++) {
      n1 = cyc[i][0]; j1 = cyc[i][1]; k1 = cyc[i][2];
      d = Math.abs(ve_cylSum(R, H, n1, j1, k1) - Math.PI * R * R * H);
      if (!(d < 1e-6)) bad.push(n1 + '×' + j1 + '×' + k1 + ' 差=' + d.toExponential(2));
    }
    d = Math.abs(ve_cylSumFast(R, H, 4000) - Math.PI * R * R * H);
    if (!(d < 1e-6)) bad.push('细网格差=' + d.toExponential(2));
    out.push({ name: 'volumeel: ΣdV（柱坐标扇柱块）= 圆柱体积 πR²H <1e-6（4 组粗细分显式三重循环 + nᵣ=4000 因子化）',
      ok: bad.length === 0, detail: bad.join('; ') || 'ok' });

    /* 断言 2：ΣdV（球坐标楔块）= 4πR³/3 <1e-6（nρ = nφ = nθ = 4000 细网格）
       并查收敛：误差随 n 单调下降（O(1/n²)，系数 = π²/24 − 1/4 ≈ 0.1612） */
    var nb0 = [50, 100, 200, 500, 1000, 2000, 4000], e0 = [], ev;
    for (i = 0; i < nb0.length; i++) {
      ev = Math.abs(ve_ballSumFast(RB, nb0[i], nb0[i], nb0[i]) - 4 * Math.PI * RB * RB * RB / 3);
      e0.push(ev);
      if (i && !(ev < e0[i - 1])) bad2.push('n=' + nb0[i] + ' 误差未下降');
    }
    if (!(e0[e0.length - 1] < 1e-6)) bad2.push('n=4000 差=' + e0[e0.length - 1].toExponential(2));
    if (!(e0[0] > 1e-4)) bad2.push('n=50 误差过小，无法体现收敛');
    /* 粗网格上因子化求和与显式三重循环逐项一致 */
    var cs = [[1, 2, 3], [2, 3, 4], [3, 5, 6], [4, 6, 10]];
    for (i = 0; i < cs.length; i++) {
      var a = ve_ballSum(RB, cs[i][0], cs[i][1], cs[i][2]), b = ve_ballSumFast(RB, cs[i][0], cs[i][1], cs[i][2]);
      if (!(Math.abs(a - b) < 1e-12)) bad2.push('因子化≠三重循环 ' + Math.abs(a - b).toExponential(2));
    }
    out.push({ name: 'volumeel: ΣdV（球坐标楔块）= 4πR³/3 <1e-6（n=4000 细网格），误差随 n 单调下降，因子化 ≡ 显式三重循环 <1e-12',
      ok: bad2.length === 0, detail: bad2.join('; ') || ('n=4000 差=' + e0[e0.length - 1].toExponential(2) + '；n=50 差=' + e0[0].toExponential(2)) });

    /* 断言 3：坐标变换的体积元因子（雅可比行列式）数值复核 = r 与 ρ²sinφ，误差 <1e-12 */
    var ptsC = [[0.3, 0.4, 0.5], [0.7, 2.1, 1.3], [1.2, 4.8, 0.2], [1.9, -1.1, 0.9]];
    var ptsB = [[0.4, 0.35, 0.3], [0.9, 1.0, 2.5], [1.5, 2.0, 5.0], [0.7, 2.7, 1.2], [1.2, 0.8, 4.1]];
    for (i = 0; i < ptsC.length; i++) {
      d = Math.abs(ve_jac3(ve_cylMap, ptsC[i]) - ptsC[i][0]);
      if (!(d < 1e-12)) bad3.push('柱 r=' + ptsC[i][0] + ' 差=' + d.toExponential(2));
    }
    for (i = 0; i < ptsB.length; i++) {
      d = Math.abs(ve_jac3(ve_ballMap, ptsB[i]) - Math.pow(ptsB[i][0], 2) * Math.sin(ptsB[i][1]));
      if (!(d < 1e-12)) bad3.push('球 ρ=' + ptsB[i][0] + ',φ=' + ptsB[i][1] + ' 差=' + d.toExponential(2));
    }
    out.push({ name: 'volumeel: 数值雅可比行列式 = r（柱，4 点）与 ρ²sinφ（球，5 点），误差 <1e-12',
      ok: bad3.length === 0, detail: bad3.join('; ') || 'ok' });

    /* 断言 4：单元体积 = 因子 × 步长乘积 <1e-12（单元体积与「数值雅可比(中心) × 步长乘积」对拍） */
    var grids = [[2, 3, 2], [3, 8, 4], [6, 14, 1]], gv, n2, j2, k2;
    for (i = 0; i < grids.length; i++) {
      n2 = grids[i][0]; j2 = grids[i][1]; k2 = grids[i][2];
      var dr2 = R / n2, dt2 = 2 * Math.PI / j2, dz2 = H / k2;
      for (var a2 = 0; a2 < n2; a2++) for (var b2 = 0; b2 < j2; b2++) for (var c2 = 0; c2 < k2; c2++) {
        var rcm = (a2 + 0.5) * dr2, tcm = (b2 + 0.5) * dt2, zcm = (c2 + 0.5) * dz2;
        gv = ve_cellCyl(rcm, dr2, dt2, dz2);
        d = Math.abs(gv - Math.abs(ve_jac3(ve_cylMap, [rcm, tcm, zcm])) * dr2 * dt2 * dz2);
        if (!(d < 1e-12)) { bad4.push('柱单元 差=' + d.toExponential(2)); a2 = n2; b2 = j2; c2 = k2; }
      }
    }
    var bgrids = [[2, 2, 3], [3, 4, 5], [4, 6, 8]];
    for (i = 0; i < bgrids.length; i++) {
      var dp2 = RB / bgrids[i][0], df2 = Math.PI / bgrids[i][1], db2 = 2 * Math.PI / bgrids[i][2];
      for (var a3 = 0; a3 < bgrids[i][0]; a3++) for (var b3 = 0; b3 < bgrids[i][1]; b3++) for (var c3 = 0; c3 < bgrids[i][2]; c3++) {
        var pcm = (a3 + 0.5) * dp2, fcm = (b3 + 0.5) * df2, tcm2 = (c3 + 0.5) * db2;
        gv = ve_cellBall(pcm, fcm, dp2, df2, db2);
        d = Math.abs(gv - Math.abs(ve_jac3(ve_ballMap, [pcm, fcm, tcm2])) * dp2 * df2 * db2);
        if (!(d < 1e-12)) { bad4.push('球单元 差=' + d.toExponential(2)); a3 = bgrids[i][0]; b3 = bgrids[i][1]; c3 = bgrids[i][2]; }
      }
    }
    out.push({ name: 'volumeel: 单元体积 = 因子(中心) × 步长乘积 <1e-12（与数值雅可比 × 步长乘积对拍，柱 3 网格 + 球 3 网格）',
      ok: bad4.length === 0, detail: bad4.join('; ') || 'ok' });

    /* 断言 5：坐标变换本身自洽 —— 柱/球映射回代半径一致（球面 ρ = R 的点 |(x,y,z)| = ρ） */
    var mapPts = [[1.1, 0.7, 2.2], [0.6, 2.4, 0.9], [1.3, -1.4, 3.0]];
    for (i = 0; i < mapPts.length; i++) {
      var q = ve_ballMap(mapPts[i]);
      var rr = Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2]);
      if (!(Math.abs(rr - mapPts[i][0]) < 1e-12)) bad5.push('球映射 ρ 回代 差=' + Math.abs(rr - mapPts[i][0]).toExponential(2));
      var zq = ve_ballMap([mapPts[i][0], mapPts[i][1], mapPts[i][2]])[2] / mapPts[i][0];
      if (!(Math.abs(zq - Math.cos(mapPts[i][1])) < 1e-12)) bad5.push('球映射 φ 回代 差=' + Math.abs(zq - Math.cos(mapPts[i][1])).toExponential(2));
      var w = ve_cylMap(mapPts[i]);
      if (!(Math.abs(Math.sqrt(w[0] * w[0] + w[1] * w[1]) - mapPts[i][0]) < 1e-12)) bad5.push('柱映射 r 回代 差=' + Math.abs(Math.sqrt(w[0] * w[0] + w[1] * w[1]) - mapPts[i][0]).toExponential(2));
      if (!(Math.abs(w[2] - mapPts[i][2]) < 1e-15)) bad5.push('柱映射 z 回代 差=' + Math.abs(w[2] - mapPts[i][2]).toExponential(2));
    }
    out.push({ name: 'volumeel: 柱/球坐标映射回代半径与 z 一致 <1e-12（3 个测试点 × 4 项）',
      ok: bad5.length === 0, detail: bad5.join('; ') || 'ok' });

    /* 断言 6：三维视图标签包围盒两两不相交（5 个旋转角 × 页面各档画布几何） */
    var ov = labelCheck(L, [[0.7, 0.42], [1.6, 0.2], [-0.9, 0.9], [2.4, 0.05], [0.2, 0.75]]);
    out.push({ name: 'volumeel: 3D 视图标签包围盒两两不相交（5 个旋转角 × 页面各档画布几何）',
      ok: ov.length === 0, detail: ov.join('; ') || 'ok' });
    return out;
  }
});
/* ==== /草稿合并：B.js ==== */

/* ==== 草稿合并：C.js ==== */
/* 来源：.tmp/labs16/C.js */
/* ===========================================================================
   第 15 章加装实验台（多元微积分互动实验台，2 台）
     ① fluxdiv    通量与散度：区域收缩时「净通量/面积」如何趋于 ∇·F
     ② conservpot 保守场与势函数：路径无关 ⇔ 旋度为零 ⇔ 闭合环量为零
   —— 本文件整体插入 labs.js 的「页面渲染」分段标记之前（同一 IIFE 作用域），
      只包含 lab({...}) 注册调用与本文件私有的辅助函数；辅助函数名一律以
      fd_（通量散度台）或 cp_（保守场台）开头，不与既有名字冲突；
      ES5 写法（var + function），不引入任何外部库。
   =========================================================================== */

/* =======================================================================
   ① 通量与散度 —— 场表与数值工具（fd_*）
   ======================================================================= */

/* 向量场表：P、Q 是分量函数，div 是解析散度（∂P/∂x + ∂Q/∂y）。
   vor（涡旋场）在原点无定义：P、Q 在原点取 0 只是数值保护（避免 NaN 污染
   边界积分），其解析散度在原点之外处处为 0。 */
var fd_FIELDS = {
  rad: {
    name: 'F = ⟨x, y⟩',
    divTxt: '∂P/∂x + ∂Q/∂y = 1 + 1 = 2',
    P: function (x, y) { return x; },
    Q: function (x, y) { return y; },
    div: function (x, y) { return 2; },
    sing: false
  },
  rot: {
    name: 'F = ⟨−y, x⟩',
    divTxt: '∂P/∂x + ∂Q/∂y = 0 + 0 = 0',
    P: function (x, y) { return -y; },
    Q: function (x, y) { return x; },
    div: function (x, y) { return 0; },
    sing: false
  },
  xsq: {
    name: 'F = ⟨x², 0⟩',
    divTxt: '∂P/∂x + ∂Q/∂y = 2x + 0 = 2x',
    P: function (x, y) { return x * x; },
    Q: function (x, y) { return 0; },
    div: function (x, y) { return 2 * x; },
    sing: false
  },
  ysq: {
    name: 'F = ⟨x, y²⟩',
    divTxt: '∂P/∂x + ∂Q/∂y = 1 + 2y',
    P: function (x, y) { return x; },
    Q: function (x, y) { return y * y; },
    div: function (x, y) { return 1 + 2 * y; },
    sing: false
  },
  vor: {
    name: 'F = ⟨−y, x⟩/(x²+y²)',
    divTxt: '∂P/∂x + ∂Q/∂y = 0（原点除外：原点是涡旋，绕它的环量 2π，但净通量为 0）',
    P: function (x, y) { var s = x * x + y * y; return s === 0 ? 0 : -y / s; },
    Q: function (x, y) { var s = x * x + y * y; return s === 0 ? 0 : x / s; },
    div: function (x, y) { return 0; },
    sing: true
  },
  /* 点源：F = ⟨x, y⟩/(x²+y²) = r̂/ρ。除原点外散度处处为 0，
     但任何绕原点的闭曲线净通量恒为 2π（散度全部集中在奇点）。 */
  src: {
    name: 'F = ⟨x, y⟩/(x²+y²)（点源）',
    divTxt: '∂P/∂x + ∂Q/∂y = 0（原点除外：原点是点源，通量 2π 全部集中在奇点）',
    P: function (x, y) { var s = x * x + y * y; return s === 0 ? 0 : x / s; },
    Q: function (x, y) { var s = x * x + y * y; return s === 0 ? 0 : y / s; },
    div: function (x, y) { return 0; },
    sing: true
  },
  exp: {
    name: 'F = ⟨e^x, sin y⟩',
    divTxt: '∂P/∂x + ∂Q/∂y = e^x + cos y',
    P: function (x, y) { return Math.exp(x); },
    Q: function (x, y) { return Math.sin(y); },
    div: function (x, y) { return Math.exp(x) + Math.cos(y); },
    sing: false
  }
};

/* 数值散度：中心差分（h = 1e-5），与内核 deriv 同阶 */
function fd_divNum(key, x, y) {
  var F = fd_FIELDS[key], h = 1e-5;
  return (F.P(x + h, y) - F.P(x - h, y)) / (2 * h) +
         (F.Q(x, y + h) - F.Q(x, y - h)) / (2 * h);
}

/* 区域几何：shape = 'disk'（圆盘，半径 r）| 'sq'（正方形，半边长 r，边长 2r） */
function fd_area(shape, r) { return shape === 'disk' ? Math.PI * r * r : 4 * r * r; }
function fd_perim(shape, r) { return shape === 'disk' ? 2 * Math.PI * r : 8 * r; }
function fd_hasOrigin(x0, y0, r, shape) {
  if (shape === 'disk') return Math.hypot(x0, y0) < r;
  return Math.abs(x0) < r && Math.abs(y0) < r;
}

/* 净通量 ∮F·n ds：圆盘用参数化（ds = r dθ，n = ⟨cosθ, sinθ⟩） */
function fd_fluxDisk(key, x0, y0, r) {
  var F = fd_FIELDS[key];
  return r * simpson(function (t) {
    var x = x0 + r * Math.cos(t), y = y0 + r * Math.sin(t);
    return F.P(x, y) * Math.cos(t) + F.Q(x, y) * Math.sin(t);
  }, 0, 2 * Math.PI, 2000);
}

/* 净通量 ∮F·n ds：正方形四条边，n 指向外侧 */
function fd_fluxSquare(key, x0, y0, r) {
  var F = fd_FIELDS[key];
  var right = simpson(function (y) { return F.P(x0 + r, y); }, y0 - r, y0 + r, 1000);
  var left = -simpson(function (y) { return F.P(x0 - r, y); }, y0 - r, y0 + r, 1000);
  var top = simpson(function (x) { return F.Q(x, y0 + r); }, x0 - r, x0 + r, 1000);
  var bot = -simpson(function (x) { return F.Q(x, y0 - r); }, x0 - r, x0 + r, 1000);
  return right + left + top + bot;
}
function fd_flux(key, x0, y0, r, shape) {
  return shape === 'disk' ? fd_fluxDisk(key, x0, y0, r) : fd_fluxSquare(key, x0, y0, r);
}

/* 二维嵌套 Simpson：∬ f dA（矩形域） */
function fd_simpson2(f, ax, bx, ay, by, nx, ny) {
  return simpson(function (x) {
    return simpson(function (y) { return f(x, y); }, ay, by, ny);
  }, ax, bx, nx);
}

/* 散度的二重积分 ∬(∇·F)dA：圆盘用极坐标 Simpson，正方形用嵌套 Simpson */
function fd_divIntegral(key, x0, y0, r, shape) {
  var F = fd_FIELDS[key], rc = 0;
  if (shape === 'disk') {
    return simpson(function (rr) {
      rc = rr;
      return simpson(function (t) {
        return F.div(x0 + rc * Math.cos(t), y0 + rc * Math.sin(t)) * rc;
      }, 0, 2 * Math.PI, 160);
    }, 0, r, 60);
  }
  return fd_simpson2(function (x, y) { return F.div(x, y); },
                     x0 - r, x0 + r, y0 - r, y0 + r, 80, 80);
}

/* 向量场箭头（长度按 |F| 分级，参考值取 75% 分位数以免奇点附近的巨值压扁全场） */
function fd_arrowGrid(v, key, P) {
  var F = fd_FIELDS[key], nx = 19, ny = 12, i, j, pts = [], mags = [];
  for (i = 0; i <= nx; i++) {
    for (j = 0; j <= ny; j++) {
      var x = v.x0 + (v.x1 - v.x0) * i / nx, y = v.y0 + (v.y1 - v.y0) * j / ny;
      var u = F.P(x, y), w = F.Q(x, y), m = Math.hypot(u, w);
      pts.push([x, y, u, w, m]);
      if (isFinite(m)) mags.push(m);
    }
  }
  mags.sort(function (a, b) { return a - b; });
  var ref = mags.length ? mags[Math.floor(mags.length * 0.75)] : 1;
  if (!(ref > 1e-9)) ref = 1;
  var cell = Math.min((v.x1 - v.x0) / nx, (v.y1 - v.y0) / ny) * 0.8;
  for (i = 0; i < pts.length; i++) {
    var p = pts[i];
    if (!isFinite(p[4]) || p[4] < 1e-12) continue;
    var len = Math.min(1.6, p[4] / ref) * cell * 0.62;
    v.arrow(p[0], p[1], p[0] + p[2] / p[4] * len, p[1] + p[3] / p[4] * len, { color: P.grid, w: 1.15 });
  }
  return ref;
}

/* 边界上的外法向通量箭头：长度 ∝ |F·n|，绿色流出（F·n>0）、橙色流入（<0） */
function fd_normalArrows(v, key, x0, y0, r, shape, P) {
  var F = fd_FIELDS[key], pts = [], i, k, e;
  if (shape === 'disk') {
    for (i = 0; i < 16; i++) {
      var t = 2 * Math.PI * i / 16;
      pts.push([x0 + r * Math.cos(t), y0 + r * Math.sin(t), Math.cos(t), Math.sin(t)]);
    }
  } else {
    for (e = 0; e < 4; e++) {
      for (k = 0; k < 5; k++) {
        var u = -1 + 2 * k / 4;
        if (e === 0) pts.push([x0 + r, y0 + u * r, 1, 0]);
        else if (e === 1) pts.push([x0 + u * r, y0 + r, 0, 1]);
        else if (e === 2) pts.push([x0 - r, y0 - u * r, -1, 0]);
        else pts.push([x0 - u * r, y0 - r, 0, -1]);
      }
    }
  }
  var dots = [], m = 1e-12;
  for (i = 0; i < pts.length; i++) {
    var q = pts[i];
    var d = F.P(q[0], q[1]) * q[2] + F.Q(q[0], q[1]) * q[3];
    dots.push(d);
    if (isFinite(d) && Math.abs(d) > m) m = Math.abs(d);
  }
  var maxLen = r * 0.72;
  for (i = 0; i < pts.length; i++) {
    var p = pts[i], dd = dots[i];
    if (!isFinite(dd) || Math.abs(dd) < m * 1e-6) continue;
    var len = Math.max(0.14, Math.min(1, Math.abs(dd) / m)) * maxLen;
    v.arrow(p[0], p[1], p[0] + p[2] * len, p[1] + p[3] * len,
            { color: dd >= 0 ? P.curve3 : P.curve2, w: 1.5 });
  }
  return dots;
}

/* 右面板：区域逐次减半时「净通量/面积」的收敛柱状图（柱 = 数值比值，绿虚线 = 解析散度） */
function fd_bars(v2, s, P) {
  var key = s.F, F = fd_FIELDS[key], x0 = s.cx, y0 = s.cy, r = s.r, shape = s.shape;
  var div = F.div(x0, y0), i, vals = [], labs = ['r', 'r/2', 'r/4', 'r/8', 'r/16'];
  for (i = 0; i < 5; i++) {
    var rr = r / Math.pow(2, i);
    vals.push(fd_flux(key, x0, y0, rr, shape) / fd_area(shape, rr));
  }
  var m = Math.max(Math.abs(div), 1e-9);
  vals.forEach(function (t) { if (isFinite(t)) m = Math.max(m, Math.abs(t)); });
  var sc = 1.1 / m;
  v2.clear();
  v2.line(0.08, 0, 4.92, 0, { color: P.axis, w: 1.3 });
  v2.line(0.08, div * sc, 4.92, div * sc, { color: P.curve3, w: 1.7, dash: [7, 4] });
  v2.text(0.14, div * sc, ' ∇·F 解析 = ' + fmt(div, 4), { color: P.curve3, size: 11.5, base: 'bottom' });
  for (i = 0; i < 5; i++) {
    var yv = (isFinite(vals[i]) ? vals[i] : 0) * sc, xc = i + 0.5;
    v2.rect(xc - 0.3, 0, xc + 0.3, yv, { fill: yv >= 0 ? P.fill : P.fill2, stroke: yv >= 0 ? P.curve : P.curve2, w: 1.4 });
    v2.text(xc, yv, fmt(vals[i], 4), { align: 'center', base: yv >= 0 ? 'bottom' : 'top', color: P.text, size: 11 });
    v2.text(xc, -1.34, labs[i], { align: 'center', base: 'middle', color: P.muted, size: 11.5 });
  }
  v2.text(2.5, 1.36, '净通量/面积（柱）随 r→0 收敛到 ∇·F（绿虚线）', { align: 'center', base: 'top', color: P.text, size: 11.5 });
  return vals;
}

/* ============================ 实验台 ①：通量与散度 ============================ */
lab({
  id: 'fluxdiv', ch: '15', title: '通量与散度：净通量 / 面积 → ∇·F',
  sub: '左：向量场与以 (x₀, y₀) 为中心、半径 r 的区域（边界箭头是 F·n，绿=流出、橙=流入）。右：区域逐次减半，净通量/面积怎样收敛到 ∇·F。',
  tex: "\\operatorname{div}\\mathbf{F}=\\frac{\\partial P}{\\partial x}+\\frac{\\partial Q}{\\partial y},\\qquad \\oint_{\\partial R}\\mathbf{F}\\cdot\\mathbf{n}\\,ds=\\iint_R \\operatorname{div}\\mathbf{F}\\,dA",
  note: '散度是「点态的通量产出率」：把区域缩到一点，净通量/面积就趋于 ∇·F。∇·F > 0 是源、< 0 是汇、= 0 无源无汇。反例 F = ⟨x, y⟩/(x²+y²)（点源）：除原点外散度处处为 0，可绕原点一圈的净通量恒为 2π——散度只刻画「点态」，奇点必须单独处理。（对照：涡旋场 F = ⟨−y, x⟩/(x²+y²) 散度为 0、净通量也为 0，但绕原点的环量恒为 2π——那是「旋度」的奇点，不是散度的。）',
  panes: 2,
  view: { x0: -3, x1: 3, y0: -1.85, y1: 1.85, h: 300 },
  view2: { x0: 0, x1: 5, y0: -1.5, y1: 1.5, h: 300 },
  ctrls: [
    { k: 'F', label: '向量场', type: 'sel', val: 'rad', opts: [['rad', 'F = ⟨x, y⟩　∇·F = 2'], ['rot', 'F = ⟨−y, x⟩　∇·F = 0'], ['xsq', 'F = ⟨x², 0⟩　∇·F = 2x'], ['ysq', 'F = ⟨x, y²⟩　∇·F = 1+2y'], ['vor', 'F = ⟨−y, x⟩/(x²+y²)　∇·F = 0（涡旋）'], ['src', 'F = ⟨x, y⟩/(x²+y²)　∇·F = 0（点源，通量 2π）'], ['exp', 'F = ⟨e^x, sin y⟩　∇·F = e^x+cos y']] },
    { k: 'shape', label: '区域形状', type: 'sel', val: 'disk', opts: [['disk', '圆盘（面积 πr²）'], ['sq', '正方形（面积 4r²）']] },
    { k: 'cx', label: '中心 x₀', min: -2, max: 2, step: 0.05, val: 0.9 },
    { k: 'cy', label: '中心 y₀', min: -1.2, max: 1.2, step: 0.05, val: 0.45 },
    { k: 'r', label: '半径 r', min: 0.2, max: 1, step: 0.05, val: 0.7 }
  ],
  draw: function (v, s) {
    var P = pal(), F = fd_FIELDS[s.F];
    var vv = Array.isArray(v) ? v[0] : v, v2 = Array.isArray(v) ? v[1] : null;
    var x0 = s.cx, y0 = s.cy, r = s.r, shape = s.shape;
    vv.clear();
    vv.axes({});
    fd_arrowGrid(vv, s.F, P);
    /* 区域边界 */
    if (shape === 'disk') {
      vv.param(function (t) { return x0 + r * Math.cos(t); }, function (t) { return y0 + r * Math.sin(t); },
               0, 2 * Math.PI, { color: P.curve, w: 2.4, fill: P.fill, n: 240 });
    } else {
      vv.poly([[x0 - r, y0 - r], [x0 + r, y0 - r], [x0 + r, y0 + r], [x0 - r, y0 + r]],
              { close: true, fill: P.fill, stroke: P.curve, w: 2.4 });
    }
    fd_normalArrows(vv, s.F, x0, y0, r, shape, P);
    vv.dot(x0, y0, { color: P.dot, r: 4.6, ring: true });
    vv.text(x0, y0, ' (x₀, y₀)', { color: P.dot, size: 12.5, bg: P.band });
    if (F.sing) {
      vv.dot(0, 0, { color: P.curve2, r: 4 });
      vv.text(0, 0, ' 奇点 O', { color: P.curve2, size: 12, bg: P.band });
    }
    var fl = fd_flux(s.F, x0, y0, r, shape), dn = fd_divNum(s.F, x0, y0);
    vv.text(vv.x0 + .12, vv.y1 - .22, '净通量 ∮F·n ds = ' + fmt(fl, 5), { color: P.text, size: 12 });
    vv.text(vv.x0 + .12, vv.y1 - .62, '∇·F(中心)：数值 ' + (isFinite(dn) ? fmt(dn, 4) : '—') + '　解析 ' + fmt(F.div(x0, y0), 4),
            { color: P.muted, size: 12 });
    vv.text(vv.x0 + .12, vv.y0 + .25, '边界箭头：绿 = F·n > 0（流出）· 橙 = F·n < 0（流入）', { color: P.muted, size: 11.5, bg: P.band });
    if (F.sing && fd_hasOrigin(x0, y0, r, shape)) {
      vv.text(vv.x0 + .12, vv.y0 + .62, '⚠ 区域含奇点：∇·F ≡ 0 而通量 = 2π（点源）', { color: P.curve2, size: 12, bg: P.band });
    }
    if (v2) fd_bars(v2, s, P);
  },
  read: function (s) {
    var key = s.F, F = fd_FIELDS[key], x0 = s.cx, y0 = s.cy, r = s.r, shape = s.shape;
    var fl = fd_flux(key, x0, y0, r, shape), ar = fd_area(shape, r), pe = fd_perim(shape, r);
    var dn = fd_divNum(key, x0, y0), da = F.div(x0, y0);
    var dint = fd_divIntegral(key, x0, y0, r, shape);
    var r2 = r / 4, fl2 = fd_flux(key, x0, y0, r2, shape), ar2 = fd_area(shape, r2);
    var ratio = isFinite(fl) ? fl / ar : NaN, ratio2 = isFinite(fl2) ? fl2 / ar2 : NaN;
    var out = [
      ['向量场 / 区域', F.name + '　' + (shape === 'disk' ? '圆盘' : '正方形') + ' r = ' + fmt(r, 2)],
      ['中心 (x₀, y₀)', '(' + fmt(x0, 2) + ', ' + fmt(y0, 2) + ')'],
      ['净通量 ∮F·n ds', fmt(fl, 6)],
      ['周长 ∮ ds', fmt(pe, 5)],
      ['面积 ∬ dA', fmt(ar, 5)],
      ['通量 / 面积', fmt(ratio, 6)],
      ['∇·F（数值，中心差分 h=1e-5）', isFinite(dn) ? fmt(dn, 6) : '—（奇点处无定义）'],
      ['∇·F（解析）', fmt(da, 6)],
      ['数值 − 解析', isFinite(dn) ? fmt(Math.abs(dn - da), 9) : '—'],
      ['∬(∇·F)dA（数值二重积分）与通量之差', fmt(Math.abs(dint - fl), 9)],
      ['收敛对照：r/4 处通量/面积（与解析散度之差）', fmt(ratio2, 6) + '（差 ' + fmt(Math.abs(ratio2 - da), 3) + '）'],
      ['解析散度式', F.divTxt]
    ];
    if (F.sing && fd_hasOrigin(x0, y0, r, shape)) {
      out.push(['⚠ 区域含奇点', '该场在原点无定义：∇·F ≡ 0，但绕原点的净通量 = 2π（散度是 δ 函数）']);
    } else if (!isFinite(fl)) {
      out.push(['⚠ 边界经过奇点', 'F 在原点无定义且边界穿过原点，通量不可数值计算']);
    }
    return out;
  },
  assert: function () {
    var out = [], bad = [], bad2 = [], bad3 = [], bad4 = [], bad5 = [];
    var keys = ['rad', 'rot', 'xsq', 'ysq', 'vor', 'exp'];
    var safe = { rad: [0.9, 0.4], rot: [0.9, 0.4], xsq: [0.9, 0.4], ysq: [0.9, 0.4], vor: [1.3, 0.9], exp: [0.9, 0.4] };
    var shapes = ['disk', 'sq'];
    /* 断言 1：净通量/面积 → ∇·F（r = 0.12 与 0.03 两组数据，误差 <1e-2，且随 r 减小不增） */
    keys.forEach(function (k) {
      var c = safe[k], dv = fd_FIELDS[k].div(c[0], c[1]);
      shapes.forEach(function (sh) {
        var e1 = Math.abs(fd_flux(k, c[0], c[1], 0.12, sh) / fd_area(sh, 0.12) - dv);
        var e2 = Math.abs(fd_flux(k, c[0], c[1], 0.03, sh) / fd_area(sh, 0.03) - dv);
        if (!(e1 < 1e-2)) bad.push(k + '/' + sh + ' r=0.12 误差 ' + e1.toExponential(2));
        if (!(e2 < 1e-2)) bad.push(k + '/' + sh + ' r=0.03 误差 ' + e2.toExponential(2));
        if (!(e2 <= e1 + 1e-12)) bad.push(k + '/' + sh + ' 未收敛：e(0.03)=' + e2.toExponential(2) + ' > e(0.12)=' + e1.toExponential(2));
      });
    });
    out.push({ name: 'fluxdiv: 净通量/面积 → ∇·F（6 场 × 2 种区域 × r=0.12/0.03 两组，误差 <1e-2 且随 r 减小单调）', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
    /* 断言 2：散度中心差分与解析式之差 <1e-9 */
    var pts = [[1.0, 0.5], [-1.1, 0.9], [0.8, -1.3], [1.6, 1.2], [-1.5, -0.7], [2.0, -0.4], [-0.6, -1.6], [0.3, 1.7]];
    keys.forEach(function (k) {
      pts.forEach(function (p) {
        var d = Math.abs(fd_divNum(k, p[0], p[1]) - fd_FIELDS[k].div(p[0], p[1]));
        if (!(d < 1e-9)) bad2.push(k + '@(' + p[0] + ',' + p[1] + ') 差 ' + d.toExponential(2));
      });
    });
    out.push({ name: 'fluxdiv: ∇·F 中心差分 − 解析式 <1e-9（6 场 × 8 点，含奇点场远离原点的取样）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
    /* 断言 3：边界通量（参数化线积分）= ∬(∇·F)dA（区域上的二重积分），误差 <1e-4 */
    var regs = [['disk', 0.4, -0.3, 0.9], ['sq', -1.2, 1.0, 0.5], ['disk', 1.4, 0.8, 0.6]];
    keys.forEach(function (k) {
      regs.forEach(function (g) {
        var sh = g[0], cx = g[1], cy = g[2], r = g[3];
        if (fd_FIELDS[k].sing && fd_hasOrigin(cx, cy, r, sh)) return;   /* 含奇点时定理前提不成立 */
        var d = Math.abs(fd_flux(k, cx, cy, r, sh) - fd_divIntegral(k, cx, cy, r, sh));
        if (!(d < 1e-4)) bad3.push(k + '/' + sh + '@(' + cx + ',' + cy + ') r=' + r + ' 差 ' + d.toExponential(2));
      });
    });
    out.push({ name: 'fluxdiv: ∮F·n ds = ∬(∇·F)dA 误差 <1e-4（6 场 × 3 个区域，奇点区域按前提剔除）', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
    /* 断言 4：无散度场净通量为 0；常散度场净通量 = 散度 × 面积 */
    var rotCases = [['rot', 0.9, 0.4, 0.7, 'disk'], ['rot', -0.8, -0.6, 0.5, 'sq'],
                    ['vor', 1.3, 0.9, 0.6, 'disk'], ['vor', -1.2, 1.0, 0.5, 'sq']];
    rotCases.forEach(function (g) {
      var k = g[0], cx = g[1], cy = g[2], r = g[3], sh = g[4];
      var fl = fd_flux(k, cx, cy, r, sh), dn = fd_divNum(k, cx, cy);
      if (!(Math.abs(dn) < 1e-9)) bad4.push(k + ' 散度 ' + dn.toExponential(2));
      if (!(Math.abs(fl) < 1e-9)) bad4.push(k + '/' + sh + ' 净通量 ' + fl.toExponential(2) + '（应为 0）');
    });
    [['disk', 0.9, 0.4, 0.7], ['sq', -0.8, 0.6, 0.5]].forEach(function (g) {
      var fl = fd_flux('rad', g[1], g[2], g[3], g[0]), d = Math.abs(fl - 2 * fd_area(g[0], g[3]));
      if (!(d < 1e-9)) bad4.push('rad/' + g[0] + ' 通量−2×面积 = ' + d.toExponential(2));
    });
    out.push({ name: 'fluxdiv: 旋转/涡旋场净通量 = 0（<1e-9，4 个区域）且常散度场 净通量 = 2×面积（<1e-9）', ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
    /* 断言 5：点源反例——区域含奇点时通量恒为 2π（散度处处为 0 却拦不住通量）
       用点源 F = ⟨x, y⟩/(x²+y²)；涡旋 F = ⟨−y, x⟩/(x²+y²) 绕原点通量恰好为 0（见断言 4），
       两者不可混用：2π 的净通量属于点源，2π 的环量才属于涡旋。 */
    var cx = 0.35, cy = 0.2, r = 0.7;
    [[r, 'disk'], [r, 'sq']].forEach(function (g) {
      var fl = fd_flux('src', cx, cy, g[0], g[1]);
      if (!(Math.abs(Math.abs(fl) - 2 * Math.PI) < 1e-4)) bad5.push(g[1] + ' 通量 ' + fl.toFixed(6) + '（应为 ±2π = ±6.283185）');
    });
    out.push({ name: 'fluxdiv: 绕奇点的净通量 = 2π（<1e-4）——∇·F ≡ 0 却通量非零的点源反例', ok: bad5.length === 0, detail: bad5.join(';') || 'ok' });
    return out;
  }
});

/* =======================================================================
   ② 保守场与势函数 —— 场表、路径与数值工具（cp_*）
   ======================================================================= */

/* 场表：cons = 是否梯度场；pot = 势函数（非保守场为 null）；sing = 是否有奇点 */
var cp_FIELDS = {
  x2y: {
    name: 'F = ∇(x²y)', potTxt: 'φ = x²y', cons: true, sing: false,
    P: function (x, y) { return 2 * x * y; },
    Q: function (x, y) { return x * x; },
    pot: function (x, y) { return x * x * y; }
  },
  bowl: {
    name: 'F = ∇(x²+y²)', potTxt: 'φ = x² + y²', cons: true, sing: false,
    P: function (x, y) { return 2 * x; },
    Q: function (x, y) { return 2 * y; },
    pot: function (x, y) { return x * x + y * y; }
  },
  sch: {
    name: 'F = ∇(sin x·cosh y)', potTxt: 'φ = sin x·cosh y', cons: true, sing: false,
    P: function (x, y) { return Math.cos(x) * Math.cosh(y); },
    Q: function (x, y) { return Math.sin(x) * Math.sinh(y); },
    pot: function (x, y) { return Math.sin(x) * Math.cosh(y); }
  },
  lnr: {
    name: 'F = ∇ln r = ⟨x, y⟩/r²', potTxt: 'φ = ln r = ½ln(x²+y²)', cons: true, sing: true,
    P: function (x, y) { var s = x * x + y * y; return s === 0 ? 0 : x / s; },
    Q: function (x, y) { var s = x * x + y * y; return s === 0 ? 0 : y / s; },
    pot: function (x, y) { var s = x * x + y * y; return s === 0 ? 0 : 0.5 * Math.log(s); }
  },
  rot: {
    name: 'F = ⟨−y, x⟩（非保守对照）', potTxt: '不存在（旋度 ≡ 2 ≠ 0）', cons: false, sing: false,
    P: function (x, y) { return -y; },
    Q: function (x, y) { return x; },
    pot: null
  }
};

/* 二维标量旋度 ∂Q/∂x − ∂P/∂y（中心差分 h = 1e-5） */
function cp_curlNum(key, x, y) {
  var F = cp_FIELDS[key], h = 1e-5;
  return (F.Q(x + h, y) - F.Q(x - h, y)) / (2 * h) - (F.P(x, y + h) - F.P(x, y - h)) / (2 * h);
}

/* 三条从 A 到 B 的路径（which = 1 直线 / 2 折线 / 3 抛物线弧），t ∈ [0,1]；
   弧沿弦的左法向鼓起，鼓量 = k·L·t(1−t)（k=0 时退化为直线）。 */
function cp_path(ax, ay, bx, by, k, which, t) {
  var dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1e-12;
  if (which === 1) return [ax + dx * t, ay + dy * t];
  if (which === 2) {
    if (t <= 0.5) { var u = t * 2; return [ax + dx * u, ay]; }
    var w = (t - 0.5) * 2; return [bx, ay + dy * w];
  }
  var nx = -dy / L, ny = dx / L, b = k * L * t * (1 - t);
  return [ax + dx * t + nx * b, ay + dy * t + ny * b];
}
/* 路径的速度向量 dP/dt */
function cp_dpath(ax, ay, bx, by, k, which, t) {
  var dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1e-12;
  if (which === 1) return [dx, dy];
  if (which === 2) return t <= 0.5 ? [2 * dx, 0] : [0, 2 * dy];
  var nx = -dy / L, ny = dx / L, db = k * L * (1 - 2 * t);
  return [dx + nx * db, dy + ny * db];
}

/* 沿路径的线积分 ∫F·dr（Simpson；折线在拐角处分成两段，避免跨折点求积） */
function cp_lineInt(key, ax, ay, bx, by, k, which, n) {
  var F = cp_FIELDS[key], nn = n || 4000;
  if (which === 2) {
    var s1 = simpson(function (t) { return F.P(ax + (bx - ax) * t, ay) * (bx - ax); }, 0, 1, nn);
    var s2 = simpson(function (t) { return F.Q(bx, ay + (by - ay) * t) * (by - ay); }, 0, 1, nn);
    return s1 + s2;
  }
  return simpson(function (t) {
    var p = cp_path(ax, ay, bx, by, k, which, t), d = cp_dpath(ax, ay, bx, by, k, which, t);
    return F.P(p[0], p[1]) * d[0] + F.Q(p[0], p[1]) * d[1];
  }, 0, 1, nn);
}

/* 闭合曲线（路径 1 正向 + 路径 3 折返）围成的带符号面积：+k·L²/6
   （弦与弧之间那块"弓形"；弧朝弦的左法向鼓起，故 k>0 时回路为逆时针，面积为正。
    Green 定理里环量 = 旋度 × 该带符号面积——用绝对值会差 2 倍。）
   推导：½∮(x dy − y dx)，弦段贡献 ½(ax·dy − ay·dx)，弧段折返后与之抵消，余 ½·kL²/3。 */
function cp_loopArea(ax, ay, bx, by, k) {
  var L = Math.hypot(bx - ax, by - ay);
  return k * L * L / 6;
}

/* 向量场箭头（同 fd：按 |F| 分级，参考值取 78% 分位数） */
function cp_arrowGrid(v, key, P) {
  var F = cp_FIELDS[key], nx = 20, ny = 13, i, j, pts = [], mags = [];
  for (i = 0; i <= nx; i++) {
    for (j = 0; j <= ny; j++) {
      var x = v.x0 + (v.x1 - v.x0) * i / nx, y = v.y0 + (v.y1 - v.y0) * j / ny;
      var u = F.P(x, y), w = F.Q(x, y), m = Math.hypot(u, w);
      pts.push([x, y, u, w, m]);
      if (isFinite(m)) mags.push(m);
    }
  }
  mags.sort(function (a, b) { return a - b; });
  var ref = mags.length ? mags[Math.floor(mags.length * 0.78)] : 1;
  if (!(ref > 1e-9)) ref = 1;
  var cell = Math.min((v.x1 - v.x0) / nx, (v.y1 - v.y0) / ny) * 0.8;
  for (i = 0; i < pts.length; i++) {
    var p = pts[i];
    if (!isFinite(p[4]) || p[4] < 1e-12) continue;
    var len = Math.min(1.5, p[4] / ref) * cell * 0.6;
    v.arrow(p[0], p[1], p[0] + p[2] / p[4] * len, p[1] + p[3] / p[4] * len, { color: P.muted, w: 1.1 });
  }
  return ref;
}

/* 画第 which 条路径（v.param 支持虚线，v.poly 不支持） */
function cp_paintPath(v, s, which, o) {
  v.param(function (t) { return cp_path(s.ax, s.ay, s.bx, s.by, s.k, which, t)[0]; },
          function (t) { return cp_path(s.ax, s.ay, s.bx, s.by, s.k, which, t)[1]; },
          0, 1, o);
}

/* ========================= 实验台 ②：保守场与势函数 ========================= */
lab({
  id: 'conservpot', ch: '15', title: '保守场与势函数：路径无关性',
  sub: '背景是势函数 φ 的等值线；三条形状完全不同的路径从 A 走到 B——只要是梯度场，三条的线积分读数就完全一致，且等于 φ(B) − φ(A)。',
  tex: "\\mathbf{F}=\\nabla\\varphi\\;\\Longleftrightarrow\\;\\oint_C \\mathbf{F}\\cdot d\\mathbf{r}=0,\\qquad \\int_A^B \\mathbf{F}\\cdot d\\mathbf{r}=\\varphi(B)-\\varphi(A)",
  note: '梯度场的线积分只认起点与终点：∫ₐᴮF·dr = φ(B) − φ(A)，于是任意闭合路径的环量为 0；在单连通区域上旋度为零又保证了势函数存在。对照场 F = ⟨−y, x⟩ 旋度恒为 2，绕一圈做功 = 旋度 × 围成面积 ≠ 0，因此它没有势函数——路径形状在保守场里无关紧要，在非保守场里却是决定性的。',
  view: { x0: -2.4, x1: 2.4, y0: -1.8, y1: 1.8, h: 320 },
  ctrls: [
    { k: 'ft', label: '向量场', type: 'sel', val: 'x2y', opts: [['x2y', 'F = ∇(x²y)　保守'], ['bowl', 'F = ∇(x²+y²)　保守'], ['sch', 'F = ∇(sin x·cosh y)　保守'], ['lnr', 'F = ∇ln r　保守（原点除外）'], ['rot', 'F = ⟨−y, x⟩　非保守对照']] },
    { k: 'ax', label: '起点 A 的 x', min: -2, max: 2, step: 0.05, val: -0.4 },
    { k: 'ay', label: '起点 A 的 y', min: -1.6, max: 1.6, step: 0.05, val: 1.4 },
    { k: 'bx', label: '终点 B 的 x', min: -2, max: 2, step: 0.05, val: 1.6 },
    { k: 'by', label: '终点 B 的 y', min: -1.6, max: 1.6, step: 0.05, val: -0.4 },
    { k: 'k', label: '弧的鼓起系数 k', min: 0, max: 1.6, step: 0.05, val: 0.7 }
  ],
  draw: function (v, s) {
    var P = pal(), F = cp_FIELDS[s.ft], k = s.k, i;
    v.clear();
    /* 注意顺序：axes() 内部会 clear()，热力图必须画在 axes() 之后才不会被擦掉 */
    if (F.pot) { v.axes({ noGrid: true }); v.heat(F.pot, { step: 4 }); }
    else { v.axes({}); }
    cp_arrowGrid(v, s.ft, P);
    /* 闭环（路径 1 正向 + 路径 3 折返）围成的区域 */
    var poly = [];
    for (i = 0; i <= 120; i++) poly.push(cp_path(s.ax, s.ay, s.bx, s.by, k, 1, i / 120));
    for (i = 120; i >= 0; i--) poly.push(cp_path(s.ax, s.ay, s.bx, s.by, k, 3, i / 120));
    v.poly(poly, { close: true, fill: F.cons ? P.fill3 : P.fill2 });
    cp_paintPath(v, s, 1, { color: P.curve, w: 2.4, n: 400 });
    cp_paintPath(v, s, 2, { color: P.curve2, w: 2.2, dash: [8, 5], n: 400 });
    cp_paintPath(v, s, 3, { color: P.curve4, w: 2.4, n: 400 });
    v.dot(s.ax, s.ay, { color: P.curve, r: 5, ring: true });
    v.dot(s.bx, s.by, { color: P.curve2, r: 5, ring: true });
    v.text(s.ax, s.ay, ' A', { color: P.curve, size: 13, bg: P.band });
    v.text(s.bx, s.by, ' B', { color: P.curve2, size: 13, bg: P.band });
    var i1 = cp_lineInt(s.ft, s.ax, s.ay, s.bx, s.by, k, 1);
    var i2 = cp_lineInt(s.ft, s.ax, s.ay, s.bx, s.by, k, 2);
    var i3 = cp_lineInt(s.ft, s.ax, s.ay, s.bx, s.by, k, 3);
    v.text(v.x0 + .12, v.y1 - .22, '路径1（直线）∫ = ' + fmt(i1, 5) + '　路径2（折线）= ' + fmt(i2, 5) +
           '　路径3（抛物线弧）= ' + fmt(i3, 5), { color: P.text, size: 11.5, bg: P.band });
    var cmx = (s.ax + s.bx) / 2, cmy = (s.ay + s.by) / 2, cu = cp_curlNum(s.ft, cmx, cmy);
    v.text(v.x0 + .12, v.y0 + .25, F.cons
             ? '旋度 ∇×F（中心差分，AB 中点）= ' + fmt(cu, 3) + ' ≈ 0：路径无关，势函数存在'
             : '旋度 ∇×F = ' + fmt(cu, 3) + ' ≠ 0：没有势函数，闭合环量 ≠ 0',
           { color: F.cons ? P.muted : P.curve2, size: 12, bg: P.band });
    if (F.pot) {
      v.text(v.x0 + .12, v.y0 + .62, '背景 = 势函数 ' + F.potTxt + ' 的等值线（场 ⟂ 等值线，箭头指向 φ 增大）',
             { color: P.muted, size: 11.5, bg: P.band });
    }
  },
  read: function (s) {
    var F = cp_FIELDS[s.ft], k = s.k;
    var i1 = cp_lineInt(s.ft, s.ax, s.ay, s.bx, s.by, k, 1);
    var i2 = cp_lineInt(s.ft, s.ax, s.ay, s.bx, s.by, k, 2);
    var i3 = cp_lineInt(s.ft, s.ax, s.ay, s.bx, s.by, k, 3);
    var spread = Math.max(i1, i2, i3) - Math.min(i1, i2, i3);
    var dphi = F.pot ? F.pot(s.bx, s.by) - F.pot(s.ax, s.ay) : NaN;
    var cmx = (s.ax + s.bx) / 2, cmy = (s.ay + s.by) / 2;
    var loop = i1 - i3;
    return [
      ['向量场 / 势函数', F.name + '　' + F.potTxt],
      ['起点 A', '(' + fmt(s.ax, 2) + ', ' + fmt(s.ay, 2) + ')'],
      ['终点 B', '(' + fmt(s.bx, 2) + ', ' + fmt(s.by, 2) + ')'],
      ['路径 1（直线）∫F·dr', fmt(i1, 6)],
      ['路径 2（折线）∫F·dr', fmt(i2, 6)],
      ['路径 3（抛物线弧，k = ' + fmt(k, 2) + '）∫F·dr', fmt(i3, 6)],
      ['三条路径极差 max − min', fmt(spread, 9)],
      ['势差 φ(B) − φ(A)', isFinite(dphi) ? fmt(dphi, 6) : '不存在（非保守场）'],
      ['旋度 ∂Q/∂x − ∂P/∂y（中心差分，A / 中点 / B）',
       fmt(cp_curlNum(s.ft, s.ax, s.ay), 4) + ' / ' + fmt(cp_curlNum(s.ft, cmx, cmy), 4) + ' / ' + fmt(cp_curlNum(s.ft, s.bx, s.by), 4)],
      ['闭合环量 ∮F·dr（路径 1 正向 + 路径 3 折返）', fmt(loop, 6)],
      ['闭合曲线围成的面积（弓形）', fmt(Math.abs(cp_loopArea(s.ax, s.ay, s.bx, s.by, k)), 5)]
    ];
  },
  assert: function () {
    var out = [], bad = [], bad2 = [], bad3 = [], bad4 = [], bad5 = [], bad6 = [];
    var cons = ['x2y', 'bowl', 'sch', 'lnr'];
    var cases = [
      { ax: -0.4, ay: 1.4, bx: 1.6, by: -0.4, k: 0.7 },
      { ax: -1.5, ay: 1.7, bx: 1.6, by: 1.1, k: 0.7 },
      { ax: -1.8, ay: 1.5, bx: 1.4, by: 1.9, k: 0.7 }
    ];
    var pts = [[1.3, 0.9], [-1.5, 0.7], [0.9, -1.6], [1.8, 1.4], [-0.7, 1.9], [2.0, -1.1]];
    /* 断言 1：保守场旋度（中心差分）≈ 0（<1e-9） */
    cons.forEach(function (k) {
      pts.forEach(function (p) {
        var c = Math.abs(cp_curlNum(k, p[0], p[1]));
        if (!(c < 1e-9)) bad.push(k + '@(' + p[0] + ',' + p[1] + ') 旋度 ' + c.toExponential(2));
      });
    });
    out.push({ name: 'conservpot: 保守场旋度 ∂Q/∂x − ∂P/∂y ≈ 0（中心差分，4 场 × 6 点，<1e-9）', ok: bad.length === 0, detail: bad.join(';') || 'ok' });
    /* 断言 2：三条路径线积分相等（<1e-6），三组几何 */
    cons.forEach(function (key) {
      cases.forEach(function (c, ci) {
        var i1 = cp_lineInt(key, c.ax, c.ay, c.bx, c.by, c.k, 1);
        var i2 = cp_lineInt(key, c.ax, c.ay, c.bx, c.by, c.k, 2);
        var i3 = cp_lineInt(key, c.ax, c.ay, c.bx, c.by, c.k, 3);
        var sp = Math.max(Math.abs(i1 - i2), Math.abs(i2 - i3));
        if (!(sp < 1e-6)) bad2.push(key + ' 几何#' + ci + ' 极差 ' + sp.toExponential(2));
      });
    });
    out.push({ name: 'conservpot: 直线 / 折线 / 抛物线弧 三条路径线积分相等（4 场 × 3 组几何，<1e-6）', ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
    /* 断言 3：线积分 = 势差 φ(B) − φ(A)（<1e-6） */
    cons.forEach(function (key) {
      var pot = cp_FIELDS[key].pot;
      cases.forEach(function (c, ci) {
        var d = pot(c.bx, c.by) - pot(c.ax, c.ay);
        [1, 2, 3].forEach(function (which) {
          var e = Math.abs(cp_lineInt(key, c.ax, c.ay, c.bx, c.by, c.k, which) - d);
          if (!(e < 1e-6)) bad3.push(key + ' 几何#' + ci + ' 路径' + which + ' 差 ' + e.toExponential(2));
        });
      });
    });
    out.push({ name: 'conservpot: 沿任意路径 ∫F·dr = φ(B) − φ(A)（4 场 × 3 组几何 × 3 条路径，<1e-6）', ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
    /* 断言 4：闭合路径环量 ≈ 0（<1e-9）；k=0 弧退化为直线时也严格为 0 */
    cons.forEach(function (key) {
      cases.forEach(function (c, ci) {
        var loop = cp_lineInt(key, c.ax, c.ay, c.bx, c.by, c.k, 1) - cp_lineInt(key, c.ax, c.ay, c.bx, c.by, c.k, 3);
        if (!(Math.abs(loop) < 1e-9)) bad4.push(key + ' 几何#' + ci + ' 环量 ' + loop.toExponential(2));
      });
      var deg = cp_lineInt(key, cases[0].ax, cases[0].ay, cases[0].bx, cases[0].by, 0, 1) -
                cp_lineInt(key, cases[0].ax, cases[0].ay, cases[0].bx, cases[0].by, 0, 3);
      if (!(deg === 0 || Math.abs(deg) < 1e-12)) bad4.push(key + ' k=0 退化环量 ' + deg.toExponential(2));
    });
    out.push({ name: 'conservpot: 保守场闭合环量 ∮F·dr ≈ 0（4 场 × 3 组几何，<1e-9；k=0 退化时 = 0）', ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
    /* 断言 5：非保守对照场——旋度 = 2（<1e-9）且环量 ≠ 0（>0.1），并满足 Green：环量 = 旋度 × 面积 */
    var rc = cases[0], rotLoop = cp_lineInt('rot', rc.ax, rc.ay, rc.bx, rc.by, rc.k, 1) - cp_lineInt('rot', rc.ax, rc.ay, rc.bx, rc.by, rc.k, 3);
    [rc, cases[1], cases[2]].forEach(function (c, ci) {
      var cu = cp_curlNum('rot', (c.ax + c.bx) / 2, (c.ay + c.by) / 2);
      if (!(Math.abs(cu - 2) < 1e-9)) bad5.push('几何#' + ci + ' 旋度 ' + cu.toFixed(9));
      var lp = cp_lineInt('rot', c.ax, c.ay, c.bx, c.by, c.k, 1) - cp_lineInt('rot', c.ax, c.ay, c.bx, c.by, c.k, 3);
      if (!(Math.abs(lp) > 0.1)) bad5.push('几何#' + ci + ' 环量 ' + lp.toFixed(6) + ' 太小（反例失效）');
      var gn = Math.abs(lp - 2 * cp_loopArea(c.ax, c.ay, c.bx, c.by, c.k));
      if (!(gn < 1e-6)) bad5.push('几何#' + ci + ' Green 校验差 ' + gn.toExponential(2));
    });
    out.push({ name: 'conservpot: 非保守对照 F=⟨−y,x⟩ 旋度 = 2（<1e-9）、环量 ≠ 0（>0.1）、且环量 = 旋度 × 面积（<1e-6）', ok: bad5.length === 0, detail: bad5.join(';') || 'ok' });
    /* 断言 6：∇φ = F（中心差分），即势函数与场确实配对 */
    cons.forEach(function (key) {
      var F = cp_FIELDS[key], h = 1e-5;
      pts.forEach(function (p) {
        var dx = (F.pot(p[0] + h, p[1]) - F.pot(p[0] - h, p[1])) / (2 * h);
        var dy = (F.pot(p[0], p[1] + h) - F.pot(p[0], p[1] - h)) / (2 * h);
        var e = Math.max(Math.abs(dx - F.P(p[0], p[1])), Math.abs(dy - F.Q(p[0], p[1])));
        if (!(e < 1e-9)) bad6.push(key + '@(' + p[0] + ',' + p[1] + ') ∇φ−F = ' + e.toExponential(2));
      });
    });
    out.push({ name: 'conservpot: ∇φ = F（中心差分，4 个势函数 × 6 点，误差 <1e-9）', ok: bad6.length === 0, detail: bad6.join(';') || 'ok' });
    return out;
  }
});
/* ==== /草稿合并：C.js ==== */

/* ==== 草稿合并：D.js ==== */
/* 来源：.tmp/labs17/D.js */
/* ===========================================================================
   D 台（新增）：第 16 章「可分离变量与逻辑斯蒂方程」· 第 17 章「二阶特征根三情形」
   插入位置：site_src/labs.js 中「页面渲染」标记之前（同一 IIFE 作用域内）。
   与既有台互补：
     · slopefield(16) 讲斜率场 + 欧拉法（一阶方法：步长减半，误差减半）；
     · damped(17)     讲阻尼振动的时程与相图（ζ 三情形，固定 ω）；
     · sepvar(16)     讲可分离变量的闭式解 ↔ 四阶 RK4（步长减半，误差 /16）+ 平衡解稳定性；
     · charroots(17)  讲特征根在参数平面 (b,c) 上的 Δ 三分区 + 解析解的方程残差复核。
   命名纪律：本文件定义的辅助函数一律 sv_ / cr_ 前缀，不与既有名冲突。
   =========================================================================== */

/* ======================= 公共数值工具（sv_ 前缀） ======================= */

/* 五点四阶数值微分（比二阶中心差分多两阶精度）：
     y′ ≈ ( f(t−2h) − 8f(t−h) + 8f(t+h) − f(t+2h) ) / (12h)
     y″ ≈ ( −f(t+2h) + 16f(t+h) − 30f(t) + 16f(t−h) − f(t−2h) ) / (12h²)
   取 h = 3e-3，是「截断 O(h⁴) ↔ 舍入 O(ε/h²)」的折中。
   为什么不用二阶中心差分：y″ 的舍入误差 ~ 4ε|y|/h²，h=1e-4 时约 1e-7 ——
   这是双精度下二阶差分的物理下限，根本压不到 1e-9 的残差阈值。 */
function sv_D1(f, t, h) {
  h = h || 0.003;
  return (f(t - 2 * h) - 8 * f(t - h) + 8 * f(t + h) - f(t + 2 * h)) / (12 * h);
}
function sv_D2(f, t, h) {
  h = h || 0.003;
  return (-f(t + 2 * h) + 16 * f(t + h) - 30 * f(t) + 16 * f(t - h) - f(t - 2 * h)) / (12 * h * h);
}

/* 四阶 Runge–Kutta：一阶初值问题 y′ = f(t,y)，从 t=0 积到 T，等步长 h。
   带发散保护：|y| > 1e8 记为爆破并截断折线（有限时间爆破的解画不出后半段）。 */
function sv_rk4(f, y0, T, h) {
  var n = Math.max(1, Math.round(Math.abs(T) / h));
  var pts = [[0, y0]], y = y0, t = 0, i, k1, k2, k3, k4, blow = false;
  for (i = 0; i < n; i++) {
    k1 = f(t, y);
    k2 = f(t + h / 2, y + h * k1 / 2);
    k3 = f(t + h / 2, y + h * k2 / 2);
    k4 = f(t + h, y + h * k3);
    y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
    t += h;
    if (!isFinite(y) || Math.abs(y) > 1e8) { blow = true; break; }
    pts.push([t, y]);
  }
  return { pts: pts, y: y, t: t, n: i, blow: blow };
}

/* ============ ① 可分离变量与逻辑斯蒂方程（第 16 章 · sepvar） ============ */

/* 五条方程（都是可分离变量的样板） */
function sv_field(key, k, M) {
  if (key === 'exp') return function (t, y) { return k * y; };
  if (key === 'logi') return function (t, y) { return k * y * (1 - y / M); };
  if (key === 'decay') return function (t, y) { return -k * y * (M - y); };
  if (key === 'tlin') return function (t, y) { return t * y; };
  return function (t, y) { return y * y - 1; };                     /* sq */
}
function sv_label(key) {
  if (key === 'exp') return 'y′ = k·y（指数增长/衰减）';
  if (key === 'logi') return 'y′ = k·y(1 − y/M)（逻辑斯蒂）';
  if (key === 'decay') return 'y′ = −k·y(M − y)';
  if (key === 'tlin') return 'y′ = t·y（不含 k）';
  return 'y′ = y² − 1（不含 k、M）';
}

/* 分离变量积出来的闭式解；有限时间爆破处返回 NaN */
function sv_exact(key, k, M, y0) {
  if (key === 'exp') return function (t) { return y0 * Math.exp(k * t); };
  if (key === 'tlin') return function (t) { return y0 * Math.exp(t * t / 2); };
  if (key === 'logi') {
    if (Math.abs(y0) < 1e-12) return function () { return 0; };
    if (Math.abs(y0 - M) < 1e-12) return function () { return M; };
    var u = (M - y0) / y0;
    return function (t) { return M / (1 + u * Math.exp(-k * t)); };
  }
  if (key === 'decay') {
    if (Math.abs(y0) < 1e-12) return function () { return 0; };
    if (Math.abs(y0 - M) < 1e-12) return function () { return M; };
    var u2 = (M - y0) / y0;
    return function (t) { return M / (1 + u2 * Math.exp(M * k * t)); };
  }
  /* sq：y′ = y²−1，分离变量得 (y−1)/(y+1) = C·e^{2t} ⇒ y = (1+C e^{2t})/(1−C e^{2t}) */
  if (Math.abs(y0 - 1) < 1e-12) return function () { return 1; };
  if (Math.abs(y0 + 1) < 1e-12) return function () { return -1; };
  var C = (y0 - 1) / (y0 + 1);
  return function (t) {
    var e = C * Math.exp(2 * t), den = 1 - e;
    if (Math.abs(den) < 1e-9) return NaN;                            /* 有限时间爆破 */
    return (1 + e) / den;
  };
}

/* 平衡解与解析稳定性判据（自治方程：f′(y*) < 0 稳定，> 0 不稳定；null = 非自治） */
function sv_eqs(key, k, M) {
  var out = [];
  function add(y, jac, note) {
    out.push({ y: y, jac: jac, stable: jac === null ? null : jac < 0, note: note || '' });
  }
  if (key === 'exp') add(0, k);
  else if (key === 'logi') { add(0, k); add(M, -k); }
  else if (key === 'decay') { add(0, -k * M); add(M, k * M); }
  else if (key === 'tlin') add(0, null, '非自治：f′_y = t 随 t 变号，t>0 时扰动按 e^{t²/2} 增长');
  else { add(1, 2); add(-1, -2); }
  return out;
}

/* 方向场里那一族解曲线的初值 */
function sv_family(key, k, M) {
  if (key === 'logi' || key === 'decay') return [0.15 * M, 0.4 * M, 0.7 * M, 1.3 * M, 2 * M];
  if (key === 'sq') return [0.2, 0.5, 0.9, 1.4, 2.2];
  return [0.2, 0.6, 1.2, 2, 3];
}

/* 数值稳定性判定：从 y* + δ 出发积到 T，看扰动量衰减还是增长 */
function sv_stabRatio(f, ystar, T, delta, h) {
  var r = sv_rk4(f, ystar + delta, T, h);
  return Math.abs(r.y - ystar) / delta;
}

/* ⑬ 可分离变量与逻辑斯蒂方程 */
lab({
  id: 'sepvar', ch: '16',
  title: '可分离变量与逻辑斯蒂方程：解析解 vs 四阶 RK4',
  sub: '左图是方向场与一族解曲线（高亮当前初值那条）；右图把当前初值的 RK4 数值解叠在解析解上，改步长看误差怎么变。',
  tex: "\\frac{dy}{dt}=k\\,y\\Bigl(1-\\frac{y}{M}\\Bigr),\\qquad y(t)=\\frac{M}{1+\\frac{M-y_{0}}{y_{0}}\\,e^{-kt}}",
  note: '逻辑斯蒂方程有两个平衡解：y≡0（不稳定）与 y≡M（稳定）——初值落在 (0, M) 内时解单调爬向 M，就是那条 S 形曲线。' +
        '分离变量把方程拆成两边各自积分，给出闭式解；右图的 RK4 是四阶方法，步长减半误差约降为 1/16' +
        '（对比第 16 章斜率场里的欧拉法：一阶方法，步长减半误差只减半）。',
  panes: 2,
  T: 5,
  view: { x0: -0.3, x1: 5.3, y0: -0.8, y1: 6.6, h: 300 },
  view2: { x0: -0.3, x1: 5.3, y0: -0.8, y1: 6.6, h: 300 },
  ctrls: [
    { k: 'eq', label: '方程', type: 'sel', val: 'logi', opts: [
      ['exp', 'y′ = k·y（指数增长/衰减）'],
      ['logi', 'y′ = k·y(1 − y/M)（逻辑斯蒂）'],
      ['decay', 'y′ = −k·y(M − y)'],
      ['tlin', 'y′ = t·y'],
      ['sq', 'y′ = y² − 1']] },
    { k: 'k', label: '速率 k', min: 0.05, max: 2, step: 0.05, val: 0.6 },
    { k: 'M', label: '容量 M', min: 0.5, max: 4, step: 0.1, val: 2 },
    { k: 'y0', label: '初值 y₀', min: 0, max: 3, step: 0.05, val: 0.6 },
    { k: 'h', label: 'RK4 步长 h', min: 0.01, max: 0.4, step: 0.01, val: 0.2 }
  ],
  draw: function (v, s) {
    var P = pal(), va = v[0], vb = v[1], T = this.T;
    var f = sv_field(s.eq, s.k, s.M), eqs = sv_eqs(s.eq, s.k, s.M);
    var i, j, t, y, m, len, dx, dy;
    /* ---- 左：方向场 + 解曲线族 ---- */
    va.axes({ noGrid: true });
    var nx = 26, ny = 18;
    for (i = 0; i <= nx; i++) {
      for (j = 0; j <= ny; j++) {
        t = va.x0 + (va.x1 - va.x0) * i / nx;
        y = va.y0 + (va.y1 - va.y0) * j / ny;
        m = f(t, y);
        if (!isFinite(m)) continue;
        len = Math.min(va.x1 - va.x0, va.y1 - va.y0) * 0.052;
        dx = len / Math.sqrt(1 + m * m); dy = m * dx;
        va.line(t - dx, y - dy, t + dx, y + dy, { color: P.grid, w: 1.2 });
      }
    }
    sv_family(s.eq, s.k, s.M).forEach(function (y0) {                 /* 一族解曲线（灰） */
      var r = sv_rk4(f, y0, T + 0.3, 0.01);
      va.poly(r.pts, { stroke: P.muted, w: 1.4 });
    });
    eqs.forEach(function (e) {                                        /* 平衡解 */
      va.line(va.x0, e.y, va.x1, e.y, { color: e.stable ? P.curve3 : P.curve2, w: 1.5, dash: [6, 4] });
    });
    var cur = sv_rk4(f, s.y0, T + 0.3, 0.01);                         /* 当前初值那条：加粗 */
    va.poly(cur.pts, { stroke: P.curve, w: 2.6 });
    va.dot(0, s.y0, { color: P.dot, r: 5, ring: true });
    va.text(va.x0 + 0.12, va.y1 - 0.42, '方向场 + 解曲线族（灰）· 当前初值（蓝）', { color: P.muted, size: 11.5 });
    va.text(va.x0 + 0.12, va.y1 - 0.95, '平衡解：绿=稳定，橙=不稳定', { color: P.muted, size: 11.5 });
    /* ---- 右：RK4 数值解 vs 解析解 ---- */
    vb.axes();
    eqs.forEach(function (e) {
      vb.line(vb.x0, e.y, vb.x1, e.y, { color: e.stable ? P.curve3 : P.curve2, w: 1.3, dash: [6, 4] });
    });
    var ex = sv_exact(s.eq, s.k, s.M, s.y0);
    if (ex) vb.fn(ex, { color: P.curve3, w: 1.8, dash: [7, 4] });
    var rk = sv_rk4(f, s.y0, T, s.h);
    vb.poly(rk.pts, { stroke: P.curve, w: 2.6 });
    vb.dot(0, s.y0, { color: P.dot, r: 5, ring: true });
    var ev = ex ? ex(T) : NaN;
    vb.text(vb.x0 + 0.12, vb.y1 - 0.45, 'RK4 数值解（蓝粗，h=' + fmt(s.h, 2) + '，' + rk.n + ' 步）', { color: P.muted, size: 11.5 });
    vb.text(vb.x0 + 0.12, vb.y1 - 0.98, '解析解（绿虚线）· 误差 ' + (isFinite(ev) ? fmt(Math.abs(rk.y - ev), 8) : '—'),
            { color: P.muted, size: 11.5 });
  },
  read: function (s) {
    var T = this.T;
    var f = sv_field(s.eq, s.k, s.M);
    var ex = sv_exact(s.eq, s.k, s.M, s.y0);
    var rk = sv_rk4(f, s.y0, T, s.h);
    var rk2 = sv_rk4(f, s.y0, T, s.h / 2);
    var ev = ex ? ex(T) : NaN;
    var e1 = isFinite(ev) ? Math.abs(rk.y - ev) : NaN;
    var e2 = isFinite(ev) ? Math.abs(rk2.y - ev) : NaN;
    var ratio = (isFinite(e1) && isFinite(e2) && e2 > 1e-14) ? e1 / e2 : NaN;
    var eqs = sv_eqs(s.eq, s.k, s.M);
    var eqTxt = eqs.map(function (e) {
      var st = e.stable === null ? (e.note ? '非自治' : '—') : (e.stable ? '稳定' : '不稳定');
      return 'y*=' + fmt(e.y, 2) + '(' + st + ')';
    }).join('、');
    var jacTxt = eqs.map(function (e) {
      return 'y*=' + fmt(e.y, 2) + ': f′=' + (e.jac === null ? 't（非自治）' : fmt(e.jac, 3));
    }).join('；');
    return [
      ['方程', sv_label(s.eq)],
      ['k / M / 初值 y₀', fmt(s.k, 2) + ' / ' + fmt(s.M, 2) + ' / ' + fmt(s.y0, 2)],
      ['平衡解（稳定性）', eqTxt],
      ['RK4 数值解 y(' + T + ')（h=' + fmt(s.h, 2) + '，' + rk.n + ' 步）', fmt(rk.y, 6)],
      ['解析解 y(' + T + ')', isFinite(ev) ? fmt(ev, 6) : (rk.blow ? '有限时间爆破（无界）' : '—')],
      ['两者误差', isFinite(e1) ? fmt(e1, 9) : '—'],
      ['步长减半后的误差比（4 阶应 ≈16）', isFinite(ratio) ? fmt(ratio, 3) : '—'],
      ['稳定性判据 f′(y*)（＜0 稳定）', jacTxt]
    ];
  },
  assert: function () {
    var out = [], bad = [];
    /* 断 1：逻辑斯蒂（24 组 k/M/y₀）RK4(h=1e-3,T=6) 与闭式解误差 <1e-6；
       解析式在断言内独立重写（不复用 sv_exact），避免同源错误。 */
    var bad1 = [], worst1 = 0, tag1 = '';
    [0.3, 0.9, 1.6].forEach(function (k) {
      [1.5, 3].forEach(function (M) {
        [0.15, 0.5, 1.2, 2.7].forEach(function (y0) {
          var f = sv_field('logi', k, M);
          var r = sv_rk4(f, y0, 6, 1e-3).y;
          var ana = M / (1 + ((M - y0) / y0) * Math.exp(-k * 6));
          var d = Math.abs(r - ana);
          if (d > worst1) { worst1 = d; tag1 = 'k=' + k + ',M=' + M + ',y₀=' + y0; }
          if (!(d < 1e-6)) bad1.push('k=' + k + ' M=' + M + ' y₀=' + y0 + ' 差=' + d.toExponential(2));
        });
      });
    });
    out.push({ name: 'sepvar: 逻辑斯蒂 RK4 与解析解 y=M/[1+((M−y₀)/y₀)e^(−kt)] 误差 <1e-6（24 组参数）',
               ok: bad1.length === 0,
               detail: bad1.join('; ') || ('ok（最大 ' + worst1.toExponential(2) + ' @ ' + tag1 + '）') });
    /* 断 2：平衡解两边相等 <1e-12（5 个方程的全部平衡解 × 4 个 t），
       且 RK4 从平衡解出发不漂移 <1e-12。 */
    var bad2 = [], worst2 = 0;
    [['exp', 0.8, 2], ['logi', 0.6, 2], ['decay', 0.6, 2], ['tlin', 1, 2], ['sq', 1, 2]].forEach(function (p) {
      var key = p[0], k = p[1], M = p[2], f = sv_field(key, k, M);
      sv_eqs(key, k, M).forEach(function (e) {
        [0.4, 1.3, 2.7, 4.6].forEach(function (t) {
          var lhs = sv_D1(function () { return e.y; }, t, 0.003);      /* y≡y* ⇒ y′≡0 */
          var d = Math.abs(lhs - f(t, e.y));
          if (d > worst2) worst2 = d;
          if (!(d < 1e-12)) bad2.push(key + ' y*=' + e.y + '@t=' + t + ' 差=' + d.toExponential(2));
        });
        var d2 = Math.abs(sv_rk4(f, e.y, 5, 0.01).y - e.y);
        if (d2 > worst2) worst2 = d2;
        if (!(d2 < 1e-12)) bad2.push(key + ' 从 y*=' + e.y + ' 起步漂移 ' + d2.toExponential(2));
      });
    });
    out.push({ name: 'sepvar: 平衡解 y≡0 / y≡M / y≡±1 代入方程两端相等、RK4 不漂移 <1e-12',
               ok: bad2.length === 0,
               detail: bad2.join('; ') || ('ok（最大 ' + worst2.toExponential(2) + '）') });
    /* 断 3：稳定性数值判定（微扰 1e-4 积到 T=2）与解析判据 f′(y*)<0 一致，7 组 */
    var bad3 = [], rows3 = [];
    [['exp', 0.7, 2, 0], ['logi', 0.6, 2, 0], ['logi', 0.6, 2, 2], ['decay', 0.6, 2, 0],
     ['decay', 0.6, 2, 2], ['sq', 1, 2, 1], ['sq', 1, 2, -1]].forEach(function (p) {
      var key = p[0], k = p[1], M = p[2], ys = p[3], f = sv_field(key, k, M);
      var ratio = sv_stabRatio(f, ys, 2, 1e-4, 1e-3);
      var jac = (key === 'exp') ? k : (key === 'logi') ? k * (1 - 2 * ys / M) : (key === 'sq') ? 2 * ys : -k * M + 2 * k * ys;
      var numStable = ratio < 1, anaStable = jac < 0;
      rows3.push(key + ' y*=' + ys + ' 扰动量比 ' + ratio.toFixed(4) + '（' + (numStable ? '衰减' : '增长') + '）');
      if (numStable !== anaStable) {
        bad3.push(key + ' y*=' + ys + ' 数值判' + (numStable ? '稳定' : '不稳定') + ' vs 解析判' + (anaStable ? '稳定' : '不稳定'));
      }
    });
    out.push({ name: 'sepvar: 稳定性数值判定（微扰 1e-4 积到 T=2：衰减=稳定、增长=不稳定）与解析判据 f′(y*)<0 一致（7 组）',
               ok: bad3.length === 0,
               detail: bad3.join('; ') || ('ok：' + rows3.join('；')) });
    /* 断 4：RK4 步长减半、误差按 4 阶下降（比值 ≈16），两组数据 */
    var bad4 = [], rows4 = [];
    [[{ eq: 'exp', k: 0.9, M: 2, y0: 1 }, 2], [{ eq: 'logi', k: 0.9, M: 2, y0: 0.5 }, 2]].forEach(function (item) {
      var cfg = item[0], T = item[1], f = sv_field(cfg.eq, cfg.k, cfg.M);
      var ev = sv_exact(cfg.eq, cfg.k, cfg.M, cfg.y0)(T);
      var e1 = Math.abs(sv_rk4(f, cfg.y0, T, 0.25).y - ev);
      var e2 = Math.abs(sv_rk4(f, cfg.y0, T, 0.125).y - ev);
      var ratio = e1 / e2;
      rows4.push(cfg.eq + '：h=0.25 误差 ' + e1.toExponential(2) + '，h=0.125 误差 ' + e2.toExponential(2) + '，比 ' + ratio.toFixed(2));
      if (!(ratio > 12 && ratio < 21)) bad4.push(cfg.eq + ' 比值=' + ratio.toFixed(2));
    });
    out.push({ name: 'sepvar: RK4 步长减半误差按 4 阶下降（误差比 ∈ (12, 21)，两组数据）',
               ok: bad4.length === 0, detail: bad4.join('; ') || ('ok：' + rows4.join('；')) });
    /* 断 5：其余四类方程的闭式解与 RK4(h=1e-3) 误差 <1e-6（5 组） */
    var bad5 = [], worst5 = 0, tag5 = '';
    [{ eq: 'exp', k: 1.1, M: 2, y0: 0.4, T: 2 },
     { eq: 'decay', k: 0.5, M: 2, y0: 0.3, T: 2 },
     { eq: 'tlin', k: 1, M: 2, y0: 0.5, T: 2 },
     { eq: 'sq', k: 1, M: 2, y0: 0, T: 2 },
     { eq: 'sq', k: 1, M: 2, y0: 1.5, T: 0.5 }].forEach(function (cfg) {
      var f = sv_field(cfg.eq, cfg.k, cfg.M), ex = sv_exact(cfg.eq, cfg.k, cfg.M, cfg.y0);
      var d = Math.abs(sv_rk4(f, cfg.y0, cfg.T, 1e-3).y - ex(cfg.T));
      if (d > worst5) { worst5 = d; tag5 = cfg.eq + ' y₀=' + cfg.y0 + ' T=' + cfg.T; }
      if (!(d < 1e-6)) bad5.push(cfg.eq + ' y₀=' + cfg.y0 + ' 差=' + d.toExponential(2));
    });
    out.push({ name: 'sepvar: 指数 / 反向逻辑斯蒂 / t·y / y²−1 的闭式解与 RK4 误差 <1e-6（5 组）',
               ok: bad5.length === 0,
               detail: bad5.join('; ') || ('ok（最大 ' + worst5.toExponential(2) + ' @ ' + tag5 + '）') });
    return out;
  }
});

/* ========= ② 二阶线性齐次方程的特征根三情形（第 17 章 · charroots） ========= */

/* 判别情形：(b,c) → 情形与特征根 */
function cr_case(b, c) {
  var D = b * b - 4 * c;
  if (D > 1e-12) {
    return { key: 'real', D: D, name: '相异实根（过阻尼）',
             r1: (-b + Math.sqrt(D)) / 2, r2: (-b - Math.sqrt(D)) / 2 };
  }
  if (D < -1e-12) {
    return { key: 'cplx', D: D, name: '共轭复根（欠阻尼·振荡）',
             al: -b / 2, be: Math.sqrt(-D) / 2 };
  }
  return { key: 'double', D: D, name: '重根（临界阻尼）', r: -b / 2 };
}

/* 解析解（由 y(0)=y₀、y′(0)=v₀ 定出常数） */
function cr_sol(b, c, y0, v0) {
  var K = cr_case(b, c), A, B, r, r1, r2, C1, C2, al, be;
  if (K.key === 'real') {
    r1 = K.r1; r2 = K.r2;
    C1 = (v0 - r2 * y0) / (r1 - r2);
    C2 = (r1 * y0 - v0) / (r1 - r2);
    return { K: K, C1: C1, C2: C2,
      y: function (t) { return C1 * Math.exp(r1 * t) + C2 * Math.exp(r2 * t); },
      yp: function (t) { return C1 * r1 * Math.exp(r1 * t) + C2 * r2 * Math.exp(r2 * t); } };
  }
  if (K.key === 'double') {
    r = K.r; A = y0; B = v0 - r * y0;
    return { K: K, A: A, B: B,
      y: function (t) { return (A + B * t) * Math.exp(r * t); },
      yp: function (t) { return (B + r * (A + B * t)) * Math.exp(r * t); } };
  }
  al = K.al; be = K.be; A = y0; B = (v0 - al * y0) / be;
  return { K: K, A: A, B: B,
    y: function (t) { return Math.exp(al * t) * (A * Math.cos(be * t) + B * Math.sin(be * t)); },
    yp: function (t) {
      var e = Math.exp(al * t);
      return e * ((A * al + B * be) * Math.cos(be * t) + (B * al - A * be) * Math.sin(be * t));
    } };
}

/* y″+b y′+c y=0 的 RK4（化成一阶系统 u=y, w=y′） */
function cr_rk4sys(b, c, y0, v0, h, n) {
  var pts = [[0, y0]], y = y0, w = v0, t = 0, i;
  function acc(u, z) { return -b * z - c * u; }
  var k1u, k1w, k2u, k2w, k3u, k3w, k4u, k4w;
  for (i = 0; i < n; i++) {
    k1u = w; k1w = acc(y, w);
    k2u = w + h * k1w / 2; k2w = acc(y + h * k1u / 2, w + h * k1w / 2);
    k3u = w + h * k2w / 2; k3w = acc(y + h * k2u / 2, w + h * k2w / 2);
    k4u = w + h * k3w; k4w = acc(y + h * k3u, w + h * k3w);
    y += h * (k1u + 2 * k2u + 2 * k3u + k4u) / 6;
    w += h * (k1w + 2 * k2w + 2 * k3w + k4w) / 6;
    t += h;
    if (!isFinite(y) || Math.abs(y) > 1e8) break;
    pts.push([t, y]);
  }
  return { pts: pts, y: y, yp: w, n: i };
}

/* 数值提取 |y| 的包络衰减率：粗扫找 |y| 的局部极大 → 抛物线插值细化 →
   对 (t, ln|y|) 做最小二乘；复根情形斜率应等于 α = −b/2。 */
function cr_envSlope(sol, t0, t1, step) {
  step = step || 1e-3;
  var rows = [], t, ym, y1v, y2v, d2, off, tp, slope, n, sx = 0, sy = 0, sxx = 0, sxy = 0, V;
  ym = Math.abs(sol.y(t0)); y1v = Math.abs(sol.y(t0 + step));
  for (t = t0 + step; t < t1; t += step) {
    y2v = Math.abs(sol.y(t + step));
    if (y1v > ym && y1v >= y2v && y1v > 1e-9) {
      d2 = ym - 2 * y1v + y2v;                                        /* 三点二次拟合的二次项 */
      off = d2 !== 0 ? 0.5 * (ym - y2v) / d2 : 0;                      /* 顶点相对 t 的偏移（单位 step） */
      tp = t + off * step;
      rows.push([tp, Math.abs(sol.y(tp))]);
    }
    ym = y1v; y1v = y2v;
  }
  n = rows.length;
  if (n < 3) return { slope: NaN, n: n };
  rows.forEach(function (p) {
    V = Math.log(p[1]); sx += p[0]; sy += V; sxx += p[0] * p[0]; sxy += p[0] * V;
  });
  slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { slope: slope, n: n };
}

/* ⑭ 特征根三情形 */
lab({
  id: 'charroots', ch: '17',
  title: '二阶线性齐次方程：特征根三情形与参数平面',
  sub: '左图是 (b, c) 平面上的判别式分区 Δ = b² − 4c（b² = 4c 是那条抛物线）；右图是同一组 (b, c) 的时程曲线：橙粗 = RK4 数值解，蓝 = 解析解。',
  tex: "y''+b\\,y'+c\\,y=0,\\qquad \\Delta=b^{2}-4c,\\qquad r=\\frac{-b\\pm\\sqrt{\\Delta}}{2},\\qquad \\alpha\\pm i\\beta=-\\frac{b}{2}\\pm i\\frac{\\sqrt{-\\Delta}}{2}",
  note: 'Δ>0：两个相异实根，解是两条指数曲线的组合（过阻尼，最多穿过平衡一次）；' +
        'Δ=0：重根 r = −b/2，两个线性无关解是 e^(rt) 与 t·e^(rt)（临界阻尼，最快不振荡地归零）；' +
        'Δ<0：共轭复根 α ± iβ，解是频率 β 的振荡乘上包络 e^(αt) = e^(−bt/2)（欠阻尼）。' +
        'b 的符号决定能量的进出：b>0 衰减、b=0 等幅（简谐）、b<0 增幅。Δ=0 要正好落在抛物线上（例如 b=2, c=1）才看得到重根。',
  panes: 2,
  T: 6,
  view: { x0: -3.2, x1: 5.2, y0: -5, y1: 9, h: 300 },
  view2: { x0: -0.2, x1: 6.2, y0: -3, y1: 3, h: 300 },
  ctrls: [
    { k: 'b', label: '阻尼系数 b', min: -3, max: 5, step: 0.05, val: 0.4 },
    { k: 'c', label: '刚度系数 c', min: -4, max: 8, step: 0.05, val: 3 },
    { k: 'y0', label: '初值 y(0)', min: -1.5, max: 1.5, step: 0.05, val: 1 },
    { k: 'v0', label: '初值 y′(0)', min: -2, max: 2, step: 0.05, val: 0 }
  ],
  draw: function (v, s) {
    var P = pal(), va = v[0], vb = v[1], T = this.T;
    var K = cr_case(s.b, s.c), sol = cr_sol(s.b, s.c, s.y0, s.v0);
    var i, N = 120, b, cc;
    /* ---- 左：参数平面 (b,c) 的三分区 ---- */
    va.axes();
    var up = [], dn = [];
    for (i = 0; i <= N; i++) {
      b = va.x0 + (va.x1 - va.x0) * i / N;
      cc = b * b / 4;
      if (cc > va.y1) cc = va.y1;                                     /* 视野外截断，避免多边形飞出画布 */
      if (cc < va.y0) cc = va.y0;
      up.push([b, cc]); dn.push([b, cc]);
    }
    up.push([va.x1, va.y1]); up.push([va.x0, va.y1]);                 /* Δ<0 在抛物线上方 */
    dn.push([va.x1, va.y0]); dn.push([va.x0, va.y0]);                 /* Δ>0 在抛物线下方 */
    va.poly(up, { close: true, fill: P.fill });
    va.poly(dn, { close: true, fill: P.fill3 });
    va.fn(function (x) { return x * x / 4; }, { color: P.curve, w: 2 });
    va.dropLine(s.b, s.c, s.b, va.y0, { color: P.muted });
    va.dropLine(s.b, s.c, va.x0, s.c, { color: P.muted });
    va.dot(s.b, s.c, { color: P.dot, r: 5, ring: true });
    va.text(-2.9, 8.3, 'Δ<0：共轭复根 · 阻尼振荡', { color: P.text, size: 11.5 });
    va.text(-2.9, -4.2, 'Δ>0：相异实根 · 过阻尼', { color: P.text, size: 11.5 });
    va.text(3.4, 5.0, 'c = b²/4（Δ=0 重根）', { color: P.curve, size: 11 });
    va.text(-2.9, 3.4, '当前 (b, c) = (' + fmt(s.b, 2) + ', ' + fmt(s.c, 2) + ')', { color: P.dot, size: 11.5 });
    /* ---- 右：时程曲线 ---- */
    vb.axes();
    var num = cr_rk4sys(s.b, s.c, s.y0, s.v0, 0.002, Math.round(T / 0.002));
    vb.poly(num.pts, { stroke: P.curve2, w: 3.2 });
    if (K.key === 'cplx') {                                           /* 包络 e^(−bt/2) */
      var R = Math.sqrt(sol.A * sol.A + sol.B * sol.B);
      vb.fn(function (t) { return R * Math.exp(-s.b / 2 * t); }, { color: P.curve4, w: 1.4, dash: [6, 4] });
      vb.fn(function (t) { return -R * Math.exp(-s.b / 2 * t); }, { color: P.curve4, w: 1.4, dash: [6, 4] });
    }
    vb.fn(sol.y, { color: P.curve, w: 2.2 });
    vb.dot(0, s.y0, { color: P.curve3, r: 5, ring: true });
    vb.line(vb.x0, 0, vb.x1, 0, { color: P.axis, w: 1 });
    vb.text(vb.x0 + 0.1, vb.y1 - 0.32, 'RK4 数值解（橙粗）叠解析解（蓝）', { color: P.muted, size: 11.5 });
    var sub = (K.key === 'cplx')
      ? '阻尼频率 β=' + fmt(K.be, 3) + '，包络 e^(−bt/2)（紫虚线）'
      : (K.key === 'double'
        ? '重根 r=' + fmt(K.r, 3) + '，解含 t·e^(rt) 项'
        : '实根 r₁=' + fmt(K.r1, 3) + '，r₂=' + fmt(K.r2, 3));
    vb.text(vb.x0 + 0.1, vb.y1 - 0.78, sub, { color: P.muted, size: 11.5 });
  },
  read: function (s) {
    var T = this.T, K = cr_case(s.b, s.c), sol = cr_sol(s.b, s.c, s.y0, s.v0);
    var num = cr_rk4sys(s.b, s.c, s.y0, s.v0, 1e-3, Math.round(T / 1e-3));
    var ev = sol.y(T), err = Math.abs(num.y - ev);
    var rootTxt, zetaTxt, longTxt, dTxt = Math.abs(K.D) < 1e-12 ? '0' : fmt(K.D, 4);
    if (K.key === 'real') {
      rootTxt = 'r₁=' + fmt(K.r1, 4) + '，r₂=' + fmt(K.r2, 4);
      zetaTxt = s.c > 0
        ? 'ζ=' + fmt(s.b / (2 * Math.sqrt(s.c)), 4) + '，ωₙ=' + fmt(Math.sqrt(s.c), 4)
        : 'c≤0（无振荡，ζ 无意义）';
      var rmax = Math.max(K.r1, K.r2);
      longTxt = rmax < -1e-9 ? 't→∞ 按 e^(' + fmt(rmax, 3) + 't) 衰减到 0'
        : (rmax > 1e-9 ? 't→∞ 按 e^(' + fmt(rmax, 3) + 't) 发散' : 't→∞ 趋于常数（r=0 模态）');
    } else if (K.key === 'double') {
      rootTxt = 'r=' + fmt(K.r, 4) + '（二重根）';
      zetaTxt = 'ζ=1（临界），ωₙ=' + fmt(Math.sqrt(Math.abs(s.c)), 4);
      longTxt = K.r < -1e-9 ? 't→∞ 按 t·e^(' + fmt(K.r, 3) + 't) 归零（临界阻尼）'
        : (K.r > 1e-9 ? 't→∞ 按 t·e^(' + fmt(K.r, 3) + 't) 发散' : 't→∞ 线性增长（r=0 二重根）');
    } else {
      rootTxt = 'α ± βi = ' + fmt(K.al, 4) + ' ± ' + fmt(K.be, 4) + 'i';
      zetaTxt = s.c > 0
        ? 'ζ=' + fmt(s.b / (2 * Math.sqrt(s.c)), 4) + '，ωₙ=' + fmt(Math.sqrt(s.c), 4) + '，ω_d=β=' + fmt(K.be, 4)
        : 'ω_d=β=' + fmt(K.be, 4);
      longTxt = K.al < -1e-9 ? '衰减振荡，包络 e^(' + fmt(K.al, 3) + 't) = e^(−bt/2)'
        : (K.al > 1e-9 ? '增幅振荡（b<0，能量注入）' : '等幅振荡（b=0，简谐运动）');
    }
    return [
      ['b / c', fmt(s.b, 3) + ' / ' + fmt(s.c, 3)],
      ['Δ = b² − 4c', dTxt],
      ['特征根', rootTxt],
      ['判别情形', K.name],
      ['阻尼比 / 频率', zetaTxt],
      ['RK4 数值解 y(' + T + ')', fmt(num.y, 6)],
      ['解析解 y(' + T + ')', fmt(ev, 6)],
      ['两者误差', fmt(err, 9)],
      ['长期行为', longTxt]
    ];
  },
  assert: function () {
    var out = [];
    /* 断 1：三种情形的解析解代入 y″+b y′+c y = 0 的残差 <1e-9（五点四阶差分复核，12 个采样点） */
    var bad1 = [], worst1 = 0, tag1 = '';
    [[3, 2, 1, 0], [2, 1, 1, 1], [1, 1, 1, 0]].forEach(function (p) {
      var b = p[0], c = p[1], sol = cr_sol(b, c, p[2], p[3]);
      [0.2, 0.7, 1.3, 2.1].forEach(function (t) {
        var r = Math.abs(sv_D2(sol.y, t, 0.003) + b * sv_D1(sol.y, t, 0.003) + c * sol.y(t));
        if (r > worst1) { worst1 = r; tag1 = 'b=' + b + ',c=' + c + ',t=' + t; }
        if (!(r < 1e-9)) bad1.push('b=' + b + ' c=' + c + ' t=' + t + ' 残差=' + r.toExponential(2));
      });
    });
    out.push({ name: 'charroots: 三情形解析解代入 y″+b y′+c y=0 的残差 <1e-9（五点四阶差分复核，12 点）',
               ok: bad1.length === 0,
               detail: bad1.join('; ') || ('ok（最大 ' + worst1.toExponential(2) + ' @ ' + tag1 + '）') });
    /* 断 2：Δ 的符号 ↔ 判别情形分区一致（3 组指定 + 11×11 网格点的方程残差复核 <1e-8） */
    var bad2 = [], rows2 = [];
    [[3, 2, 'real'], [2, 1, 'double'], [1, 1, 'cplx']].forEach(function (p) {
      var K = cr_case(p[0], p[1]);
      rows2.push('(' + p[0] + ',' + p[1] + '): Δ=' + fmt(K.D, 3) + ' → ' + K.key);
      if (K.key !== p[2]) bad2.push('(' + p[0] + ',' + p[1] + ') 判为 ' + K.key + '，应为 ' + p[2]);
      if (K.key === 'real') {
        [K.r1, K.r2].forEach(function (r) {
          var d = Math.abs(r * r + p[0] * r + p[1]);
          if (!(d < 1e-12)) bad2.push('r=' + r + ' 代入特征方程残差=' + d.toExponential(2));
        });
      } else if (K.key === 'double') {
        var d2 = Math.abs(K.r * K.r + p[0] * K.r + p[1]), d3 = Math.abs(K.r + p[0] / 2);
        if (!(d2 < 1e-12)) bad2.push('重根代入残差=' + d2.toExponential(2));
        if (!(d3 < 1e-12)) bad2.push('重根 ≠ −b/2，差=' + d3.toExponential(2));
      } else {
        var re = K.al * K.al - K.be * K.be + p[0] * K.al + p[1], im = 2 * K.al * K.be + p[0] * K.be;
        if (!(Math.abs(re) < 1e-12)) bad2.push('复根代入实部残差=' + re.toExponential(2));
        if (!(Math.abs(im) < 1e-12)) bad2.push('复根代入虚部残差=' + im.toExponential(2));
      }
    });
    var nb = 0, worst2 = 0, worst2abs = 0;
    for (var ii = 0; ii <= 10; ii++) {
      for (var jj = 0; jj <= 10; jj++) {
        var bb = -3 + 0.8 * ii, ccc = -4 + 1.2 * jj;
        var K2 = cr_case(bb, ccc), D2 = bb * bb - 4 * ccc;
        var want = D2 > 1e-12 ? 'real' : (D2 < -1e-12 ? 'cplx' : 'double');
        nb++;
        if (K2.key !== want) bad2.push('网格(' + bb.toFixed(1) + ',' + ccc.toFixed(1) + ') 情形与 Δ 符号不符');
        var sl = cr_sol(bb, ccc, 1, 0.5);                             /* 该分区的解析式必须真满足方程 */
        [0.2, 0.6].forEach(function (t) {
          var d2v = sv_D2(sl.y, t, 0.003), d1v = sv_D1(sl.y, t, 0.003), yv = sl.y(t);
          var res = Math.abs(d2v + bb * d1v + ccc * yv);
          /* 用方程三项的量级归一：解振幅越大（如 b=−3,c=−4 时 y~e^{4t}），
             五点差分的舍入下限 ~64ε|y|/(12h²) 就越大，绝对残差会被振幅放大；
             相对残差才是「解析式真的满足方程」的正确度量。 */
          var scale = Math.abs(d2v) + Math.abs(bb * d1v) + Math.abs(ccc * yv) + 1;
          var r2 = res / scale;
          if (r2 > worst2) worst2 = r2;
          if (res > worst2abs) worst2abs = res;
          if (!(r2 < 1e-8)) bad2.push('网格(' + bb.toFixed(1) + ',' + ccc.toFixed(1) + ') t=' + t + ' 相对残差=' + r2.toExponential(2));
        });
      }
    }
    out.push({ name: 'charroots: Δ 符号与判别情形分区一致（3 组指定 + ' + nb + ' 个网格点，分区内解析式的相对残差 <1e-8，按 |y″|+|by′|+|cy| 归一）',
               ok: bad2.length === 0,
               detail: bad2.join('; ') || ('ok：' + rows2.join('；') + '；网格最大相对残差 ' + worst2.toExponential(2) + '（绝对残差 ' + worst2abs.toExponential(2) + '，受五点差分舍入下限约束）') });
    /* 断 3：重根（Δ=0）情形的解含 t·e^(−bt/2) 项，且与 RK4 数值解偏差 <1e-6（3 组） */
    var bad3 = [], info3 = '';
    [[2, 1, 1, 1], [0, 0, 1, 0.5], [-2, 1, 0.5, 1]].forEach(function (p) {
      var b = p[0], c = p[1], y0 = p[2], v0 = p[3];
      var K = cr_case(b, c), sol = cr_sol(b, c, y0, v0);
      if (K.key !== 'double') { bad3.push('(' + b + ',' + c + ') 不是重根'); return; }
      var r = K.r;
      /* 形式检查：y(t)·e^(−rt) 关于 t 必须是仿射的（等距三点二阶差分 ≈ 0） */
      var dt = 0.37;
      var g0 = sol.y(1) * Math.exp(-r), g1 = sol.y(1 + dt) * Math.exp(-r * (1 + dt)), g2 = sol.y(1 + 2 * dt) * Math.exp(-r * (1 + 2 * dt));
      var aff = Math.abs(g0 - 2 * g1 + g2);
      if (!(aff < 1e-12)) bad3.push('(' + b + ',' + c + ') e^(−rt)y 非仿射，差=' + aff.toExponential(2));
      var B = v0 - r * y0;                                            /* t·e^(rt) 项的系数 */
      if (Math.abs(B) < 1e-12) bad3.push('(' + b + ',' + c + ') C₂=0，t·e^(rt) 项没出现');
      var dform = Math.abs(sol.y(0.9) - (y0 + B * 0.9) * Math.exp(r * 0.9));
      if (!(dform < 1e-12)) bad3.push('(' + b + ',' + c + ') 形式复核差=' + dform.toExponential(2));
      var num = cr_rk4sys(b, c, y0, v0, 1e-3, 6000), worst = 0;
      for (var q = 0; q < num.pts.length; q += 50) {
        var dd = Math.abs(num.pts[q][1] - sol.y(num.pts[q][0]));
        if (dd > worst) worst = dd;
      }
      if (!(worst < 1e-6)) bad3.push('(' + b + ',' + c + ') 与 RK4 偏差=' + worst.toExponential(2));
      info3 += '(' + b + ',' + c + '): r=' + r + ', C₂=' + B.toFixed(3) + ', RK4 偏差=' + worst.toExponential(2) + '；';
    });
    out.push({ name: 'charroots: 重根（Δ=0）解含 t·e^(−bt/2) 项（e^(−rt)·y 仿射且 C₂≠0）并与 RK4 一致 <1e-6（3 组）',
               ok: bad3.length === 0, detail: bad3.join('; ') || ('ok：' + info3) });
    /* 断 4：复根情形 |y| 包络的对数斜率 = α = −b/2（局部极大点最小二乘，误差 <1e-6，3 组） */
    var bad4 = [], info4 = '';
    [[0, 1, 1, 0], [0.4, 3, 1, 0], [2, 5, 1, 0.5]].forEach(function (p) {
      var b = p[0], K = cr_case(b, p[1]), sol = cr_sol(b, p[1], p[2], p[3]);
      if (K.key !== 'cplx') { bad4.push('(' + b + ',' + p[1] + ') 不是复根'); return; }
      var env = cr_envSlope(sol, 0, 12, 1e-3);
      var d = Math.abs(env.slope - (-b / 2));
      info4 += '(' + b + ',' + p[1] + '): 极值点 ' + env.n + ' 个，斜率=' + env.slope.toFixed(6) + ' vs −b/2=' + (-b / 2).toFixed(6) + '；';
      if (!(env.n >= 3)) bad4.push('(' + b + ',' + p[1] + ') 极值点不足（' + env.n + '）');
      if (!(d < 1e-6)) bad4.push('(' + b + ',' + p[1] + ') 斜率差=' + d.toExponential(2));
    });
    out.push({ name: 'charroots: 复根情形 |y| 包络的对数斜率 = −b/2（极值点最小二乘，误差 <1e-6，3 组）',
               ok: bad4.length === 0, detail: bad4.join('; ') || ('ok：' + info4) });
    /* 断 5：三情形 RK4 数值解与解析解最大偏差 <1e-6（h=1e-3，T=6） */
    var bad5 = [], info5 = '';
    [[3, 2, 1, 0], [2, 1, 1, 1], [1, 1, 1, 0]].forEach(function (p) {
      var sol = cr_sol(p[0], p[1], p[2], p[3]);
      var num = cr_rk4sys(p[0], p[1], p[2], p[3], 1e-3, 6000);
      var worst = 0, at = 0;
      num.pts.forEach(function (q) {
        var d = Math.abs(q[1] - sol.y(q[0]));
        if (d > worst) { worst = d; at = q[0]; }
      });
      info5 += '(' + p[0] + ',' + p[1] + '): 最大偏差 ' + worst.toExponential(2) + ' @t=' + at.toFixed(1) + '；';
      if (!(worst < 1e-6)) bad5.push('(' + p[0] + ',' + p[1] + ') 偏差=' + worst.toExponential(2));
    });
    out.push({ name: 'charroots: 三情形 RK4 数值解与解析解最大偏差 <1e-6（h=1e-3，T=6）',
               ok: bad5.length === 0, detail: bad5.join('; ') || ('ok：' + info5) });
    return out;
  }
});
/* ==== /草稿合并：D.js ==== */

/* ==== 草稿合并：E.js ==== */
/* 来源：.tmp/labs17/E.js */
  /* ===========================================================
     第 18–19 章新增实验台
       ① cobweb   数列单调有界与蛛网图（双面板 panes: 2）
       ② inttable 积分表匹配器（单面板）
     本文件按约定原样插到「页面渲染」标记行之前，
     与其余实验台同处一个 IIFE：只用 lab({...}) 注册，辅助函数一律以
     cw_（cobweb）/ it_（integral table）开头，不覆盖内核与既有实验台的任何名字。
     =========================================================== */

  /* ================= ① 数列单调有界与蛛网图（第 18 章） ================= */

  /* 迭代函数表。df 是解析导数，专门用来独立核对「尾段收敛速率 → |f′(s*)|」。
     scan = roots(f(x)−x) 的扫描区间；win/yc = 蛛网画面窗口（yc 为纵向中心，
     纵向半宽在 draw 里按画布像素比推算，好让 y=x 真的画成 45°）。 */
  function cw_specs() {
    return {
      sqrt: {
        name: 'f(s) = √(2+s)',
        f: function (s) { return s + 2 >= 0 ? Math.sqrt(s + 2) : NaN; },
        df: function (s) { return s + 2 > 0 ? 1 / (2 * Math.sqrt(s + 2)) : NaN; },
        scan: [-1.95, 8], win: [-2.3, 3.5], yc: 1.0,
        dom: '定义域 s ≥ −2（s < −2 时 f 无定义）；不动点 s* = 2，f′(2) = 1/4，单调递增逼近',
        seeds: [0.5, 1.9]
      },
      cos: {
        name: 'f(s) = cos s',
        f: Math.cos,
        df: function (s) { return -Math.sin(s); },
        scan: [-4, 4], win: [-0.9, 1.5], yc: 0.35,
        dom: '全域有定义；不动点 s* = 0.739085…（cos s* = s*），f′(s*) = −sin s* ≈ −0.6736，交替振荡逼近',
        seeds: [0.5, -0.5]
      },
      recip: {
        name: 'f(s) = 1 + 1/s',
        f: function (s) { return s === 0 ? NaN : 1 + 1 / s; },
        df: function (s) { return s === 0 ? NaN : -1 / (s * s); },
        scan: [-3, 4], win: [0.15, 3.2], yc: 1.5,
        dom: '定义域 s ≠ 0（s = 0 处返回 NaN）；正初值收敛到 s* = φ ≈ 1.618034，f′(s*) = −1/φ² ≈ −0.381966，交替振荡',
        seeds: [0.5, 2.5]
      },
      quad: {
        name: 'f(s) = s² − 0.2',
        f: function (s) { return s * s - 0.2; },
        df: function (s) { return 2 * s; },
        scan: [-2, 2], win: [-1.1, 1.7], yc: 0.5,
        dom: '不动点 s* = −0.170820…（|f′| = 0.341641 < 1，稳定）与 1.170820…（|f′| = 2.341641 > 1，不稳定）',
        seeds: [0.5, -0.15]
      },
      logi: {
        name: 'f(s) = 2s(1 − s)',
        f: function (s) { return 2 * s * (1 - s); },
        df: function (s) { return 2 - 4 * s; },
        scan: [-2, 2], win: [-0.9, 1.5], yc: 0.35,
        dom: '不动点 s* = 0（f′ = 2 > 1，不稳定）与 s* = 0.5（f′ = 0，超稳定）；' +
          's₁ ∈ (0,1) 时超指数收敛到 0.5（|sₙ₊₁−0.5| = 2|sₙ−0.5|²），s₁ ∉ [0,1] 时轨道双指数发散',
        seeds: [0.3, 0.8]
      }
    };
  }

  /* 不动点：先用内核 roots(f(x)−x, a, b) 扫描求根，再牛顿打磨到机器精度。
     为什么要打磨：roots 内部二分的停止条件是区间宽 < 1e-12，直接拿它去测
     |f(s*) − s*| < 1e-12 会踩在边界上（|g′| 可能 > 1）。
     为什么用解析导数 sp.df：差商 gp 的舍入误差 ~ε|x|/h 在 h=1e-7 时约 3.5e-9，
     牛顿迭代会停在一个「残差 ~|g′|·3.5e-9/…」的假根上（实测 |f(s*)−s*| = 9.2e-11），
     解析导数的舍入只有 ε 量级，迭代 5 次即到机器精度。 */
  function cw_polish(sp, r) {
    var x = r, i, h, gp, step;
    for (i = 0; i < 40; i++) {
      if (typeof sp.df === 'function') {
        gp = sp.df(x) - 1;
      } else {
        h = 1e-5 * Math.max(1, Math.abs(x));
        gp = ((sp.f(x + h) - (x + h)) - (sp.f(x - h) - (x - h))) / (2 * h);
      }
      if (!isFinite(gp) || gp === 0) break;
      step = (sp.f(x) - x) / gp;
      x = x - step;
      if (!isFinite(x)) return r;
      if (Math.abs(step) < 1e-17 * Math.max(1, Math.abs(x))) break;   /* 已到机器精度 */
    }
    return x;
  }
  function cw_roots(sp) {
    var raw = roots(function (x) { return sp.f(x) - x; }, sp.scan[0], sp.scan[1], 800);
    var out = [], i, j, r, dup, res;
    for (i = 0; i < raw.length; i++) {
      if (!isFinite(raw[i])) continue;
      r = cw_polish(sp, raw[i]);
      if (!isFinite(r)) continue;
      res = Math.abs(sp.f(r) - r);
      /* 收敛校验：roots 以「变号」判根，而函数在极点两侧也变号（如 f(s)=1+1/s 在 s=0，
         扫描区间 [−3,4] 跨过极点）会给出假根，牛顿打磨在极点附近也不收敛
         （实测打磨后被放大成 s*=−0.1124、残差 7.79）。真不动点必须让 |f(s*)−s*|
         落到舍入量级；假根在这里被剔除。 */
      if (!(res <= 5e-13 * Math.max(1, Math.abs(r)))) continue;
      dup = false;
      for (j = 0; j < out.length; j++) if (Math.abs(out[j] - r) < 1e-9) dup = true;
      if (!dup) out.push(r);
    }
    return out;
  }
  /* 离 near 最近的那个不动点（发散时 near 很大，选出来的 s* 只会让 |sₙ−s*| 更显著） */
  function cw_fix(sp, near) {
    var rs = cw_roots(sp), best = null, bd = Infinity, i, d;
    for (i = 0; i < rs.length; i++) {
      d = isFinite(near) ? Math.abs(rs[i] - near) : 0;
      if (d < bd) { bd = d; best = rs[i]; }
    }
    return best;
  }
  /* 迭代序列 s₁…sₙ（长度 n，含初值） */
  function cw_iter(sp, s1, n) {
    n = Math.max(1, Math.round(n));
    var vals = [s1], k, v = s1;
    for (k = 1; k < n; k++) { v = sp.f(v); vals.push(v); }
    return vals;
  }
  function cw_mono(vals) {
    var i, inc = true, dec = true, tol = 1e-12, a, b;
    for (i = 1; i < vals.length; i++) {
      a = vals[i - 1]; b = vals[i];
      if (!isFinite(a) || !isFinite(b)) return '非有限项，无法判定';
      if (!(b >= a - tol)) inc = false;
      if (!(b <= a + tol)) dec = false;
    }
    if (inc && dec) return '常数列（s₁ 已是不动点）';
    if (inc) return '单调递增';
    if (dec) return '单调递减';
    return '非单调（围绕不动点交替振荡）';
  }
  function cw_bound(vals) {
    var i, m = 0, bad = -1;
    for (i = 0; i < vals.length; i++) {
      if (!isFinite(vals[i])) { if (bad < 0) bad = i; continue; }
      if (Math.abs(vals[i]) > m) m = Math.abs(vals[i]);
    }
    if (bad >= 0) return { ok: false, m: m, txt: '无界：第 ' + (bad + 1) + ' 项起出现非有限值（溢出/无定义）' };
    if (m > 1e6) return { ok: false, m: m, txt: '无界：|sₙ| 已达 ' + fmt(m, 3) };
    return { ok: true, m: m, txt: '有界：|sₙ| ≤ ' + fmt(m, 6) };
  }
  /* 尾段收敛速率：取最后一个满足 1e-8 ≤ |s_k − s*| ≤ 1e-5 的 k，返回 |s_{k+1}−s*|/|s_k−s*|。
     窗口上界 1e-5：二阶项 O(|s_k−s*|) 的污染 < ~1e-5（远低于 1e-3 判据）；
     窗口下界 1e-8：不动点 s* 自身的误差 δ（打磨后 ~1e-15）会让 d=|s_k−s*| 带 δ 的
     绝对污染，取 1e-9 时相对污染高达 7%，比值会被抬偏（实测 0.4497 vs 理论 0.3820）；
     抬到 1e-8 后污染 < 0.1%，比值回到 0.382。 */
  function cw_tail(sp, s1, star, n) {
    if (star === null || !isFinite(star)) return { r: NaN, k: -1, d: NaN };
    var v = cw_iter(sp, s1, n), r = NaN, k = -1, d = NaN, i, d0, d1;
    for (i = 1; i < v.length; i++) {
      d0 = Math.abs(v[i - 1] - star); d1 = Math.abs(v[i] - star);
      if (!isFinite(d0) || !isFinite(d1)) break;
      if (d0 >= 1e-8 && d0 <= 1e-5 && d1 > 0) { r = d1 / d0; k = i; d = d1; }
    }
    return { r: r, k: k, d: d };
  }
  function cw_run(sp, s1, n) {
    n = Math.max(1, Math.round(n));
    var vals = cw_iter(sp, s1, n), last = vals[vals.length - 1];
    var star = cw_fix(sp, last);
    var err = (star === null || !isFinite(last)) ? NaN : Math.abs(last - star);
    var bd = cw_bound(vals);
    var deep = cw_iter(sp, s1, 400);
    var err400 = (star === null || !isFinite(deep[399])) ? NaN : Math.abs(deep[399] - star);
    var conv = isFinite(err) && err < 1e-9;
    var status;
    if (!isFinite(last)) status = '轨道出现非有限值（无定义/溢出）';
    else if (conv) status = '已收敛：|sₙ − s*| = ' + fmt(err, 3);
    else if (isFinite(err400) && err400 < 1e-9) status = '收敛中：n 再大误差更小（|sₙ − s*| = ' + fmt(err, 3) + '）';
    else status = '不收敛：|sₙ| 已增大到 ' + fmt(bd.m, 4);
    return { vals: vals, star: star, err: err, err400: err400, conv: conv, mono: cw_mono(vals), bound: bd, status: status, n: n };
  }
  /* 把绘制裁到坐标框内：发散轨道的阶梯会跑到画布外去糊在刻度标签上 */
  function cw_clip(v, body) {
    var c = v.ctx, p = v.pad;
    c.save();
    c.beginPath();
    c.rect(p.l, p.t, v.W - p.l - p.r, v.H - p.t - p.b);
    c.clip();
    body();
    c.restore();
  }

  /* ⑬ 数列单调有界与蛛网图（第 18 章） */
  lab({
    id: 'cobweb', ch: '18', title: '数列单调有界与蛛网图',
    sub: '左图是递推 sₙ₊₁ = f(sₙ) 的蛛网图：竖线走到曲线，横线回到对角线；右图把同一列 {sₙ} 按 n 画出来，虚线是不动点。',
    tex: "s_{n+1}=f(s_n),\\qquad s_n\\to s^{*}\\iff f(s^{*})=s^{*},\\qquad |f'(s^{*})|<1",
    note: '单调有界定理：单调且有界的数列必收敛，而收敛到哪儿由 f(s*)=s* 决定——蛛网图的阶梯最终落在 y=x 与 y=f(x) 的交点上。' +
      '收敛快慢由 |f′(s*)| 决定：<1 收敛（越小越快），>1 发散。' +
      'f(s)=2s(1−s) 是个反例教材：s₁ ∈ (0,1) 时超指数收敛到 0.5，s₁ 落在 [0,1] 之外时轨道双指数发散。',
    panes: 2,
    view: { x0: -2.3, x1: 3.5, y0: -1.3, y1: 3.3, h: 300 },
    view2: { x0: 0, x1: 13, y0: -1, y1: 2, h: 300 },
    ctrls: [
      { k: 'f', label: '迭代函数 f', type: 'sel', val: 'sqrt',
        opts: [['sqrt', 'f(s) = √(2+s)'], ['cos', 'f(s) = cos s'], ['recip', 'f(s) = 1 + 1/s'],
               ['quad', 'f(s) = s² − 0.2'], ['logi', 'f(s) = 2s(1 − s)']] },
      { k: 's1', label: '初值 s₁', min: -2.4, max: 2.4, step: 0.01, val: 0.5 },
      { k: 'n', label: '迭代步数 n', min: 1, max: 60, step: 1, val: 12 }
    ],
    spec: function (s) { return cw_specs()[s.f]; },
    draw: function (v, s) {
      var P = pal(), A = v[0], B = v[1], sp = this.spec(s), n = Math.round(s.n);
      var R = cw_run(sp, s.s1, n), vals = R.vals, i;

      /* ---------- 左：蛛网图（纵轴半宽按像素比推算，y=x 才是真 45°） ---------- */
      var half = (sp.win[1] - sp.win[0]) * (A.H - A.pad.t - A.pad.b) / (A.W - A.pad.l - A.pad.r) / 2;
      A.x0 = sp.win[0]; A.x1 = sp.win[1]; A.y0 = sp.yc - half; A.y1 = sp.yc + half;
      A.axes();
      cw_clip(A, function () {
        A.line(A.x0, A.x0, A.x1, A.x1, { color: P.muted, w: 1.4, dash: [6, 4] });
        A.fn(sp.f, { color: P.curve, w: 2.3 });
        var pts = [], k, x, y;
        for (k = 0; k < vals.length; k++) {
          x = vals[k];
          if (!isFinite(x)) break;
          y = (k + 1 < vals.length) ? vals[k + 1] : vals[k];
          pts.push([x, x]);
          if (!isFinite(y)) break;
          pts.push([x, y]); pts.push([y, y]);
        }
        if (pts.length > 1) A.poly(pts, { stroke: P.curve2, w: 1.9 });
        for (k = 0; k < pts.length; k += 3) A.dot(pts[k][0], pts[k][1], { color: P.curve2, r: 2.5 });
      });
      if (isFinite(s.s1)) A.dot(s.s1, s.s1, { color: P.dot, r: 5, ring: true });
      if (R.star !== null && isFinite(R.star) &&
          R.star >= A.x0 && R.star <= A.x1 && R.star >= A.y0 && R.star <= A.y1) {
        A.dot(R.star, R.star, { color: P.curve3, r: 5.5, ring: true });
        A.text(R.star, R.star, '  s* = ' + fmt(R.star, 6), { color: P.curve3, size: 11.5, bg: P.band });
      }
      A.text(A.x0 + (A.x1 - A.x0) * 0.03, A.y1 - (A.y1 - A.y0) * 0.07, 'y = f(x)', { color: P.curve, size: 12, bg: P.band });
      A.text(A.x0 + (A.x1 - A.x0) * 0.03, A.y1 - (A.y1 - A.y0) * 0.17, 'y = x', { color: P.muted, size: 12, bg: P.band });
      A.text(A.x0 + (A.x1 - A.x0) * 0.03, A.y0 + (A.y1 - A.y0) * 0.08, R.status, { color: R.conv ? P.curve3 : P.curve2, size: 11.5, bg: P.band });

      /* ---------- 右：数列 {sₙ} ---------- */
      var lo = Infinity, hi = -Infinity, clipN = 0;
      for (i = 0; i < vals.length; i++) {
        if (isFinite(vals[i]) && Math.abs(vals[i]) <= 1e3) { if (vals[i] < lo) lo = vals[i]; if (vals[i] > hi) hi = vals[i]; }
      }
      if (R.star !== null && isFinite(R.star) && Math.abs(R.star) <= 1e3) { if (R.star < lo) lo = R.star; if (R.star > hi) hi = R.star; }
      if (Math.abs(lo) === Infinity || Math.abs(hi) === Infinity) { lo = -1; hi = 1; }
      if (!(hi - lo > 1e-9)) { lo -= 0.5; hi += 0.5; }
      var pd = (hi - lo) * 0.14; lo -= pd; hi += pd;
      B.x0 = 0; B.x1 = Math.max(6, vals.length + 1); B.y0 = lo; B.y1 = hi;
      B.axes();
      if (R.star !== null && isFinite(R.star) && R.star >= B.y0 && R.star <= B.y1) {
        B.line(B.x0, R.star, B.x1, R.star, { color: P.curve3, w: 1.6, dash: [6, 4] });
        B.text(B.x1, R.star, '不动点 s* = ' + fmt(R.star, 6) + ' ', { color: P.curve3, size: 11, align: 'right', bg: P.band });
      }
      var seq = [];
      for (i = 0; i < vals.length; i++) if (isFinite(vals[i])) seq.push([i + 1, vals[i]]);
      B.poly(seq, { stroke: R.conv ? P.curve : P.curve2, w: 1.5, dash: [4, 3] });
      for (i = 0; i < vals.length; i++) {
        if (!isFinite(vals[i])) continue;
        var yy = Math.max(lo, Math.min(hi, vals[i]));
        if (yy !== vals[i]) clipN++;
        B.dropLine(i + 1, 0, i + 1, yy, { color: P.grid, w: 1, dash: [3, 3] });
        B.dot(i + 1, yy, { color: R.conv ? P.curve : P.curve2, r: 2.4 });
      }
      B.text(B.x0 + (B.x1 - B.x0) * 0.03, B.y1 - (B.y1 - B.y0) * 0.08,
        '数列 {sₙ}（n = 1…' + vals.length + '）', { color: P.text, size: 11.5, bg: P.band });
      if (clipN) B.text(B.x0 + (B.x1 - B.x0) * 0.03, B.y0 + (B.y1 - B.y0) * 0.09,
        '有 ' + clipN + ' 项超出量程（贴边显示）', { color: P.curve2, size: 11, bg: P.band });
    },
    read: function (s) {
      var sp = this.spec(s), n = Math.round(s.n), R = cw_run(sp, s.s1, n), vals = R.vals, i;
      var show = [], k = Math.min(6, vals.length);
      for (i = 0; i < k; i++) show.push(fmt(vals[i], 6));
      var T = cw_tail(sp, s.s1, R.star, 400);
      var df = (R.star !== null && isFinite(R.star)) ? Math.abs(sp.df(R.star)) : NaN;
      return [
        ['迭代函数 f(s)', sp.name],
        ['初值 s₁ / 迭代步数 n', fmt(s.s1, 4) + ' / ' + n],
        ['前 ' + k + ' 项 s₁…s' + k, show.join(', ')],
        ['当前 sₙ（n = ' + n + '）', fmt(vals[vals.length - 1], 10)],
        ['不动点 s*（roots(f(x) − x) 求得）', R.star === null ? '未找到' : fmt(R.star, 10)],
        ['|sₙ − s*|（n = ' + n + '）', isFinite(R.err) ? fmt(R.err, 3) : '—'],
        ['|sₙ − s*|（n = 400，充足迭代）', isFinite(R.err400) ? fmt(R.err400, 3) : '—'],
        ['收敛速率 |sₙ₊₁−s*|/|sₙ−s*|（尾段） vs |f′(s*)|',
          isFinite(T.r) ? fmt(T.r, 6) + '  vs  ' + fmt(df, 6) : '—'],
        ['单调性 / 有界性', R.mono + ' / ' + R.bound.txt],
        ['定义域与不动点', sp.dom]
      ];
    },
    assert: function () {
      var out = [], sp = cw_specs(), keys = ['sqrt', 'cos', 'recip', 'quad', 'logi'];
      var bad1 = [], bad2 = [], bad3 = [], bad4 = [], i, j;
      /* 断言 1：迭代极限 = 不动点。5 个函数 × 2 个初值，n = 400，|sₙ − s*| < 1e-9，
         不动点由 roots(f(x)−x, a, b) 求出（再牛顿打磨）。 */
      keys.forEach(function (k) {
        sp[k].seeds.forEach(function (s1) {
          var S = sp[k], v = cw_iter(S, s1, 400), last = v[399];
          var star = cw_fix(S, last);
          if (star === null) { bad1.push(k + ' s₁=' + s1 + ' 未找到不动点'); return; }
          var e = Math.abs(last - star);
          if (!(e < 1e-9)) bad1.push(k + ' s₁=' + s1 + ' |s₄₀₀−s*|=' + e.toExponential(2) + '（s*=' + star + '）');
        });
      });
      out.push({ name: 'cobweb: 迭代极限 = 不动点（5 函数 × 2 初值，n=400，|sₙ − s*| < 1e-9；s* 由 roots(f(x)−x) 求得）',
        ok: bad1.length === 0, detail: bad1.join(';') || 'ok' });
      /* 断言 2：不动点满足 |f(s*) − s*| < 1e-12（列出各函数在扫描区间内的全部数值不动点） */
      var nroots = 0;
      keys.forEach(function (k) {
        var S = sp[k], rs = cw_roots(S);
        if (!rs.length) { bad2.push(k + ' 未找到不动点'); return; }
        nroots += rs.length;
        for (var t = 0; t < rs.length; t++) {
          var e = Math.abs(S.f(rs[t]) - rs[t]);
          if (!(e < 1e-12)) bad2.push(k + ' s*=' + fmt(rs[t], 10) + ' |f(s*)−s*|=' + e.toExponential(2));
        }
      });
      out.push({ name: 'cobweb: 不动点条件 |f(s*) − s*| < 1e-12（共 ' + nroots + ' 个数值不动点）',
        ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：收敛速率 |sₙ₊₁−s*|/|sₙ−s*| → |f′(s*)|（与解析导数之差 < 1e-3，5 函数 × 2 初值）。
         logi 的 f′(0.5) = 0（超稳定），尾段比值同样趋于 0，用同一条判据。 */
      keys.forEach(function (k) {
        sp[k].seeds.forEach(function (s1) {
          var S = sp[k], v = cw_iter(S, s1, 400), star = cw_fix(S, v[399]);
          var T = cw_tail(S, s1, star, 400), ana = Math.abs(S.df(star));
          if (!isFinite(T.r)) { bad3.push(k + ' s₁=' + s1 + ' 未取到尾段比值'); return; }
          var e = Math.abs(T.r - ana);
          if (!(e < 1e-3)) bad3.push(k + ' s₁=' + s1 + ' 比值=' + T.r.toExponential(4) + ' |f′|=' + ana.toExponential(4) + ' 差=' + e.toExponential(2));
        });
      });
      out.push({ name: 'cobweb: 尾段收敛速率 = |f′(s*)|（5 函数 × 2 初值，与解析导数之差 < 1e-3）',
        ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4：不收敛（发散）型数据。f(s)=2s(1−s) 在 s₁ = 1.2 ∉ [0,1] 时轨道双指数发散；
         f(s)=s²−0.2 在 s₁ = 3 时同样发散；同一 f 在 s₁ = 0.3 时仍收敛到 0.5（不是"必发散"）。 */
      var G = cw_iter(sp.logi, 1.2, 8), g6 = Math.abs(G[5]), g8 = Math.abs(G[7]);
      if (!(g8 > 1e6)) bad4.push('logi s₁=1.2 |s₈|=' + fmt(g8, 3) + ' 未超过 1e6');
      if (!(g8 > g6 * 1e6)) bad4.push('logi s₁=1.2 未双指数增长（|s₆|=' + fmt(g6, 3) + ' → |s₈|=' + fmt(g8, 3) + '）');
      var H = cw_iter(sp.quad, 3, 8), h8 = Math.abs(H[7]);
      if (!(h8 > 1e6)) bad4.push('quad s₁=3 |s₈|=' + fmt(h8, 3) + ' 未超过 1e6');
      var I = cw_iter(sp.logi, 0.3, 8);
      if (!(Math.abs(I[7] - 0.5) < 1e-9)) bad4.push('logi s₁=0.3 第 8 项未收敛到 0.5（=' + I[7] + '）');
      out.push({ name: 'cobweb: 发散数据——f(s)=2s(1−s) 在 s₁=1.2∉[0,1] 时 |s₈|>1e6 且 |s₈|>|s₆|·1e6（双指数）；f(s)=s²−0.2 在 s₁=3 时 |s₈|>1e6；同一 f 在 s₁=0.3 时仍收敛到 0.5',
        ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
      return out;
    }
  });

  /* ================= ② 积分表匹配器（第 19 章） ================= */

  /* 积分速查表（10 条）。f = 被积函数，F = 原函数，seg = 用于数值复核的区间，
     dom = 定义域约定。所有 f 在定义域外一律返回 NaN，绝不外推一个"看起来对"的值。 */
  function it_table() {
    return [
      { key: 'xn', label: '∫ x² dx', fTxt: 'x²', Ftxt: 'x³/3', seg: [0, 2],
        f: function (x) { return x * x; },
        F: function (x) { return x * x * x / 3; },
        dom: '∫ xⁿ dx = xⁿ⁺¹/(n+1)（n ≠ −1）；本例 n = 2，全域可积' },
      { key: 'recip', label: '∫ dx/x', fTxt: '1/x', Ftxt: 'ln|x|', seg: [0.5, 3],
        f: function (x) { return x === 0 ? NaN : 1 / x; },
        F: function (x) { return x === 0 ? NaN : Math.log(Math.abs(x)); },
        dom: 'x ≠ 0（x = 0 处返回 NaN）；含 0 的区间上不可积' },
      { key: 'exp', label: '∫ eˣ dx', fTxt: 'eˣ', Ftxt: 'eˣ', seg: [-1, 2],
        f: Math.exp, F: Math.exp,
        dom: '全域可积，原函数就是自己' },
      { key: 'sinx', label: '∫ sin x dx', fTxt: 'sin x', Ftxt: '−cos x', seg: [0, 3],
        f: Math.sin,
        F: function (x) { return -Math.cos(x); },
        dom: '全域可积；[0,3] 跨过 π，阴影面积带符号' },
      { key: 'atan1', label: '∫ dx/(1+x²)', fTxt: '1/(1+x²)', Ftxt: 'arctan x', seg: [-1.5, 2],
        f: function (x) { return 1 / (1 + x * x); },
        F: Math.atan,
        dom: '全域可积（1+x² ≥ 1 从不为 0）' },
      { key: 'asin1', label: '∫ dx/√(1−x²)', fTxt: '1/√(1−x²)', Ftxt: 'arcsin x', seg: [-0.9, 0.9],
        f: function (x) { return x * x < 1 ? 1 / Math.sqrt(1 - x * x) : NaN; },
        F: function (x) { return Math.abs(x) <= 1 ? Math.asin(x) : NaN; },
        dom: '|x| < 1（|x| ≥ 1 一律 NaN，绝不外推）；|x| = 1 处被积函数发散' },
      { key: 'sec2', label: '∫ sec²x dx', fTxt: 'sec²x', Ftxt: 'tan x', seg: [-0.7, 0.7],
        f: function (x) { var c = Math.cos(x); return Math.abs(c) < 1e-12 ? NaN : 1 / (c * c); },
        F: function (x) { var c = Math.cos(x); return Math.abs(c) < 1e-12 ? NaN : Math.tan(x); },
        dom: 'cos x ≠ 0（x ≠ π/2 + kπ 处返回 NaN）；本例区间在 (−π/2, π/2) 内' },
      { key: 'xexp', label: '∫ x eˣ dx', fTxt: 'x eˣ', Ftxt: '(x − 1)eˣ', seg: [0, 2],
        f: function (x) { return x * Math.exp(x); },
        F: function (x) { return (x - 1) * Math.exp(x); },
        dom: '全域可积（分部积分：∫x eˣ dx = (x−1)eˣ + C）' },
      { key: 'lnx', label: '∫ ln x dx', fTxt: 'ln x', Ftxt: 'x ln x − x', seg: [0.5, 3],
        f: function (x) { return x > 0 ? Math.log(x) : NaN; },
        F: function (x) { return x > 0 ? x * Math.log(x) - x : NaN; },
        dom: 'x > 0（x ≤ 0 返回 NaN）；[0.5,3] 在定义域内' },
      { key: 'a2x2', label: '∫ dx/(4+x²)', fTxt: '1/(4+x²)', Ftxt: '(1/2)arctan(x/2)', seg: [-2, 3],
        f: function (x) { return 1 / (4 + x * x); },
        F: function (x) { return 0.5 * Math.atan(x / 2); },
        dom: '∫ dx/(a²+x²) = (1/a)arctan(x/a) + C；本例 a = 2，全域可积' }
    ];
  }
  function it_entry(k) {
    var T = it_table(), i;
    for (i = 0; i < T.length; i++) if (T[i].key === k) return T[i];
    return T[0];
  }
  /* 匹配用的取样点：全部落在 (0,1)，10 条被积函数在这 4 点上都有限 */
  function it_xs() { return [0.15, 0.35, 0.55, 0.75]; }
  /* 匹配键 = 取样点上的函数值指纹 */
  function it_key(e, xs) {
    var out = [], i;
    for (i = 0; i < xs.length; i++) out.push(e.f(xs[i]).toPrecision(12));
    return out.join('|');
  }
  /* 两条被积函数在取样本点上是否数值不可区分（相对容差） */
  function it_same(e1, e2, xs, tol) {
    tol = tol || 1e-6;
    for (var i = 0; i < xs.length; i++) {
      var a = e1.f(xs[i]), b = e2.f(xs[i]);
      if (isNaN(a) && isNaN(b)) continue;
      if (!isFinite(a) || !isFinite(b)) { if (a !== b) return false; continue; }
      if (Math.abs(a - b) > tol * (1 + Math.abs(b))) return false;
    }
    return true;
  }
  /* 匹配器：返回表内所有与该被积函数数值一致的键 */
  function it_matchKeys(e, xs, tol) {
    var T = it_table(), out = [], i;
    for (i = 0; i < T.length; i++) if (it_same(e, T[i], xs, tol)) out.push(T[i].key);
    return out;
  }
  /* 每条表项的 4 个内点（区间的 20%/40%/60%/80%），用于导数复核 */
  function it_chk(e) {
    var a = e.seg[0], b = e.seg[1], out = [], t;
    for (t = 1; t <= 4; t++) out.push(a + (b - a) * t / 5);
    return out;
  }
  /* 5 点中心差分（截断误差 O(h⁴)）：内核 deriv 的 3 点差分在 1/√(1−x²)
     这种三阶导很大的函数上，光截断误差就有 ~3e-9，压不到 1e-9。 */
  function it_d5(f, x) {
    var h = 5e-4 * Math.max(1, Math.abs(x));
    return (-f(x + 2 * h) + 8 * f(x + h) - 8 * f(x - h) + f(x - 2 * h)) / (12 * h);
  }
  function it_num(e, a, b, n) {
    if (!isFinite(a) || !isFinite(b) || !(b > a)) return NaN;
    return simpson(e.f, a, b, n || 2000);
  }
  function it_an(e) { return e.F(e.seg[1]) - e.F(e.seg[0]); }
  function it_maxd(e) {
    var pts = it_chk(e), m = 0, i, d, fv;
    for (i = 0; i < pts.length; i++) {
      fv = e.f(pts[i]);
      if (!isFinite(fv)) { m = Infinity; continue; }
      d = Math.abs(it_d5(e.F, pts[i]) - fv);
      if (d > m) m = d;
    }
    return m;
  }

  /* ⑭ 积分表匹配器（第 19 章） */
  lab({
    id: 'inttable', ch: '19', title: '积分表匹配器：从被积函数到原函数',
    sub: '选一条被积函数：蓝线是 f(x)，橙线是用 Simpson 逐点累积出来的原函数，绿虚线是查表得到的解析原函数——两条应当重合。',
    tex: "\\int f(x)\\,dx=F(x)+C,\\qquad F'(x)=f(x)",
    note: '积分表的用法是「认形状」：把被积函数和表里的标准形对上，就换成已知的原函数。' +
      '本台用三条独立证据复核查表结果：原函数求导必须回到被积函数（<1e-9）、Simpson 数值积分必须等于 F(b)−F(a)（<1e-6）、' +
      '匹配键必须唯一（表内没有两条同时匹配同一被积函数）。橙线与绿虚线完全重合，就是这三条证据的图形版。',
    view: { x0: 0, x1: 2, y0: -0.5, y1: 2.5, h: 320 },
    ctrls: [
      { k: 'g', label: '被积函数', type: 'sel', val: 'xn',
        opts: [['xn', '∫ x² dx'], ['recip', '∫ dx/x'], ['exp', '∫ eˣ dx'], ['sinx', '∫ sin x dx'],
               ['atan1', '∫ dx/(1+x²)'], ['asin1', '∫ dx/√(1−x²)'], ['sec2', '∫ sec²x dx'],
               ['xexp', '∫ x eˣ dx'], ['lnx', '∫ ln x dx'], ['a2x2', '∫ dx/(4+x²)']] }
    ],
    /* 当前表项 */
    ent: function (s) { return it_entry(s.g); },
    draw: function (v, s) {
      var P = pal(), e = this.ent(s), a = e.seg[0], b = e.seg[1], i, x, y;
      var grid = [], Fn = [], Fa = e.F(a), lo = 0, hi = 0;
      for (i = 0; i <= 120; i++) {
        x = a + (b - a) * i / 120;
        grid.push(x);
        Fn.push(simpson(e.f, a, x, 300));
      }
      for (i = 0; i < grid.length; i++) {
        y = e.f(grid[i]); if (isFinite(y)) { if (y < lo) lo = y; if (y > hi) hi = y; }
        y = Fn[i]; if (isFinite(y)) { if (y < lo) lo = y; if (y > hi) hi = y; }
        y = e.F(grid[i]) - Fa; if (isFinite(y)) { if (y < lo) lo = y; if (y > hi) hi = y; }
      }
      var pd = Math.max(0.25, (hi - lo) * 0.14); lo -= pd; hi += pd;
      v.x0 = a; v.x1 = b; v.y0 = lo; v.y1 = hi;
      v.axes();
      shadeArea(v, e.f, a, b, P.fill2, 400);
      v.fn(function (t) { return e.F(t) - Fa; }, { color: P.curve3, w: 1.8, dash: [7, 4] });
      v.poly(grid.map(function (t, k) { return [t, Fn[k]]; }), { stroke: P.curve2, w: 2.1 });
      v.fn(e.f, { color: P.curve, w: 2.3 });
      v.line(b, v.y0, b, v.y1, { color: P.muted, w: 1, dash: [4, 4] });
      v.dot(b, Fn[Fn.length - 1], { color: P.curve2, r: 4.5, ring: true });
      v.text(v.x0 + (v.x1 - v.x0) * 0.02, v.y1 - (v.y1 - v.y0) * 0.09,
        '∫ ' + e.fTxt + ' dx = ' + e.Ftxt + ' + C', { color: P.text, size: 12, bg: P.band });
      v.text(v.x0 + (v.x1 - v.x0) * 0.02, v.y0 + (v.y1 - v.y0) * 0.07,
        '蓝 f(x)　橙 ∫ₐˣ f（Simpson 逐点累积）　绿虚线 解析原函数（平移 F(a)）',
        { color: P.muted, size: 11, bg: P.band });
    },
    read: function (s) {
      var e = this.ent(s), a = e.seg[0], b = e.seg[1];
      var num = it_num(e, a, b, 2000), num200 = it_num(e, a, b, 200), an = it_an(e), md = it_maxd(e);
      return [
        ['被积函数 f(x)', e.fTxt + '（表项 ' + e.key + '）'],
        ['匹配公式', '∫ ' + e.fTxt + ' dx = ' + e.Ftxt + ' + C'],
        ['积分区间 [a, b]', fmt(a, 3) + ' ~ ' + fmt(b, 3)],
        ['数值原函数端点值 F_num(a) / F_num(b)', '0 / ' + fmt(num, 8)],
        ['解析原函数端点值 F(a) / F(b)', fmt(e.F(a), 8) + ' / ' + fmt(e.F(b), 8)],
        ['解析值 F(b) − F(a)', fmt(an, 8)],
        ['数值 − 解析之差（验收 <1e-6）', isFinite(num - an) ? fmt(Math.abs(num - an), 3) : 'NaN'],
        ['n=200 与 n=2000 的 Simpson 之差', isFinite(num200 - num) ? fmt(Math.abs(num200 - num), 3) : 'NaN'],
        ['导数复核 max|F′(xᵢ) − f(xᵢ)|（5 点差分 h=5e-4，验收 <1e-9）',
          (md === null || !isFinite(md)) ? '—' : fmt(md, 3) + '（4 个内点）'],
        ['定义域', e.dom]
      ];
    },
    assert: function () {
      var out = [], T = it_table(), xs = it_xs();
      var bad1 = [], bad2 = [], bad3 = [], bad4 = [], bad5 = [], i, j, k;
      /* 断言 1：每条表项的解析原函数求导 = 左端被积函数（5 点中心差分，阈值 1e-9；10 条 × 4 个内点） */
      T.forEach(function (e) {
        it_chk(e).forEach(function (x) {
          var fv = e.f(x);
          if (!isFinite(fv)) { bad1.push(e.key + '@x=' + fmt(x, 3) + ' 被积函数非有限值，取样点越界'); return; }
          var d = Math.abs(it_d5(e.F, x) - fv);
          if (!(d < 1e-9)) bad1.push(e.key + '@x=' + fmt(x, 3) + ' 差=' + d.toExponential(2));
        });
      });
      out.push({ name: 'inttable: 表内每条 F′(x) = f(x)（10 条 × 4 个内点，5 点中心差分 h=5e-4，阈值 <1e-9）',
        ok: bad1.length === 0, detail: bad1.join(';') || 'ok' });
      /* 断言 2：Simpson(n=2000) 与解析原函数端点差一致（<1e-6，10 条） */
      T.forEach(function (e) {
        var num = it_num(e, e.seg[0], e.seg[1], 2000), an = it_an(e), d = Math.abs(num - an);
        if (!isFinite(d) || !(d < 1e-6)) bad2.push(e.key + ' 数值=' + num + ' 解析=' + an + ' 差=' + d);
      });
      out.push({ name: 'inttable: Simpson(n=2000) 与解析原函数端点差一致（10 条，误差 <1e-6）',
        ok: bad2.length === 0, detail: bad2.join(';') || 'ok' });
      /* 断言 3：匹配键唯一。① 容差 1e-6 下每条表项只匹配到自己；② 指纹串两两不同；
         ③ 负对照：表外函数 x³+1 匹配不到任何表项；④ 复制 sin x 的冒名表项只会被归到 sinx 这一条键。 */
      T.forEach(function (e) {
        var m = it_matchKeys(e, xs, 1e-6);
        if (m.length !== 1 || m[0] !== e.key) bad3.push(e.key + ' 匹配到 [' + m.join(',') + ']');
      });
      for (i = 0; i < T.length; i++) {
        for (j = i + 1; j < T.length; j++) {
          if (it_key(T[i], xs) === it_key(T[j], xs)) bad3.push('指纹重复：' + T[i].key + ' vs ' + T[j].key);
          if (it_same(T[i], T[j], xs, 1e-6)) bad3.push('表项数值不可区分：' + T[i].key + ' vs ' + T[j].key);
        }
      }
      var alien = it_matchKeys({ f: function (x) { return x * x * x + 1; } }, xs, 1e-6);
      if (alien.length !== 0) bad3.push('表外函数 x³+1 却匹配到 [' + alien.join(',') + ']');
      var fake = it_matchKeys({ key: 'fake', f: it_entry('sinx').f }, xs, 1e-6);
      if (fake.length !== 1 || fake[0] !== 'sinx') bad3.push('复制 sin x 的冒名表项匹配到 [' + fake.join(',') + ']');
      out.push({ name: 'inttable: 匹配键唯一（10 条各自只匹配自己、指纹两两不同；负对照 x³+1 零匹配、复制 sin x 只归到 sinx）',
        ok: bad3.length === 0, detail: bad3.join(';') || 'ok' });
      /* 断言 4：定义域检查。越界一律 NaN，绝不外推错值；越界区间上的数值积分也必须 NaN。 */
      var A1 = it_entry('asin1'), R1 = it_entry('recip'), L1 = it_entry('lnx'), S1 = it_entry('sec2');
      [1, -1, 1.0001, -1.5, 2.5, -3].forEach(function (x) {
        if (!isNaN(A1.f(x))) bad4.push('asin1 f(' + x + ')=' + A1.f(x) + ' 应为 NaN');
      });
      [-0.99, -0.5, 0, 0.5, 0.99].forEach(function (x) {
        if (!isFinite(A1.f(x))) bad4.push('asin1 f(' + x + ')=' + A1.f(x) + ' 应有限');
      });
      if (!isNaN(R1.f(0))) bad4.push('1/x 在 x=0 应为 NaN，实为 ' + R1.f(0));
      [-1, 0, -0.5].forEach(function (x) {
        if (!isNaN(L1.f(x))) bad4.push('ln x 在 x=' + x + ' 应为 NaN，实为 ' + L1.f(x));
      });
      [Math.PI / 2, -Math.PI / 2].forEach(function (x) {
        if (!isNaN(S1.f(x))) bad4.push('sec²x 在 x=' + fmt(x, 6) + ' 应为 NaN（cos x = 0）');
      });
      var over = it_num(A1, -1.5, 1.5, 200);
      if (!isNaN(over)) bad4.push('asin1 在 [−1.5,1.5] 上的 Simpson 应为 NaN，实为 ' + over);
      if (!isNaN(A1.F(1.5))) bad4.push('asin1 的原函数在 x=1.5 应为 NaN，实为 ' + A1.F(1.5));
      out.push({ name: 'inttable: 定义域检查（|x| ≥ 1 的 1/√(1−x²)、x=0 的 1/x、x ≤ 0 的 ln x、cos x=0 的 sec²x 全返回 NaN；越界区间 Simpson 也返回 NaN）',
        ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });
      /* 断言 5（附加）：Simpson 随 n 增大收敛到解析值（7 条光滑表项：n=100 → n=2000 误差不上升，且 n=2000 时 <1e-8） */
      ['xn', 'exp', 'sinx', 'atan1', 'xexp', 'a2x2', 'lnx'].forEach(function (key) {
        var e = it_entry(key), an = it_an(e);
        var e100 = Math.abs(it_num(e, e.seg[0], e.seg[1], 100) - an);
        var e2000 = Math.abs(it_num(e, e.seg[0], e.seg[1], 2000) - an);
        if (!(e2000 <= e100 + 1e-15)) bad5.push(key + ' 误差未随 n 减小（' + e100.toExponential(2) + ' → ' + e2000.toExponential(2) + '）');
        if (!(e2000 < 1e-8)) bad5.push(key + ' n=2000 误差 ' + e2000.toExponential(2) + ' ≥ 1e-8');
      });
      out.push({ name: 'inttable: Simpson 随 n 增大收敛（7 条光滑表项，n=200 → 2000 误差不上升，n=2000 时 <1e-8）',
        ok: bad5.length === 0, detail: bad5.join(';') || 'ok' });
      return out;
    }
  });
/* ==== /草稿合并：E.js ==== */

/* ==== 草稿合并：F.js ==== */
/* 来源：.tmp/labs17/F.js */
  /* =====================================================================
     全书知识依赖地图（第 00 章）—— 20 章可点击节点图 + 前置链高亮
     · 数据：章号 00–19 与章名逐字取自 data/index.js 的 chapters（assert ② 比对）；
     · 边：语义上的「前置 → 后续」直接依赖，已做传递归约（无冗余边，assert ⑥ 复核）；
     · 布局：层号 = 从 00 出发的最长路径长度；y = 10 − 层号（assert ③ 复核）；
     · 可达性：dm_chain 用迭代 DFS（draw/read 用），assert ④ 另用 BFS（dm_reachBFS）独立复算。
     · 全部辅助名以 dm_ 开头，不碰既有内核与其它实验台。
     ===================================================================== */

  /* 章号（顺序与 data/index.js 的 chapters[].id 一致） */
  var dm_ids = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
                '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];

  /* 节点短名（节点标签用；标签 = 圈内章号 + 圈下短名，合读即「03 导数」） */
  var dm_short = {
    '00': '总览', '01': '函数', '02': '极限', '03': '导数', '04': '导数应用',
    '05': '积分', '06': '积分应用', '07': '超越函数', '08': '积分技术', '09': '级数',
    '10': '参数·极坐标', '11': '向量', '12': '向量值函数', '13': '偏导数', '14': '多重积分',
    '15': '向量场', '16': '一阶方程', '17': '二阶方程', '18': '附录A', '19': '速查表'
  };

  /* 全章名：与 data/index.js 的 zh 字段逐字一致（assert ② 逐项比对） */
  var dm_full = {
    '00': '总览与复习路线', '01': '函数', '02': '极限与连续', '03': '导数', '04': '导数的应用',
    '05': '积分', '06': '定积分的应用', '07': '超越函数', '08': '积分技术', '09': '无穷序列与级数',
    '10': '参数方程与极坐标', '11': '向量与空间几何', '12': '向量值函数与空间运动',
    '13': '偏导数', '14': '多重积分', '15': '积分与向量场', '16': '一阶微分方程',
    '17': '二阶微分方程', '18': '附录 A：公式与证明工具箱', '19': '全书公式速查表'
  };

  /* 依赖边（前置 → 后续）：语义上的直接前置，已做传递归约——
     若 A→B→C 成立就不再画 A→C（A 仍是 C 的前置链成员，只是不重复画线）。
     分组注释即每族边的理由，便于逐条核对。 */
  var dm_edges = [
    /* 单变量主线 */
    ['00', '01'],   /* 第 00 章是复习路线总览 → 起点指向第 1 章 */
    ['01', '02'],   /* 函数 → 极限：sinθ/θ、自然定义域是极限的语言基础 */
    ['02', '03'],   /* 极限 → 导数：割线斜率的极限 */
    ['03', '04'],   /* 导数 → 导数应用：中值定理/极值判定建立在求导之上 */
    ['03', '05'],   /* 导数 → 积分：FTC 说面积函数的导数就是 f（02 经此入链） */
    ['05', '06'],   /* 积分 → 定积分应用：弧长/旋转体/做功都用定积分 */
    /* 超越函数族（07 吃 03 的求导法则与 05 的积分） */
    ['05', '07'],
    /* 积分技术（08 吃 05 的基本公式 + 07 的超越函数积分；05→07→08 已含 05） */
    ['07', '08'],
    /* 级数（09 吃 05：积分判别法、逐项积分；02/03 经 05←03←02 入链） */
    ['05', '09'],
    /* 参数方程与极坐标（10 吃 05：极坐标面积；03 经 05←03 入链） */
    ['05', '10'],
    /* 向量族：空间直线/曲线的参数式沿用第 10 章 */
    ['10', '11'],
    ['11', '12'],   /* 向量 → 向量值函数（12 另有 10 经 11 入链） */
    ['11', '13'],   /* 向量 → 偏导数（13 另有 03 经 11←10←05←03 入链） */
    ['13', '14'],   /* 偏导数 → 多重积分 */
    ['14', '15'],   /* 多重积分 → 向量场（Green/Stokes/散度定理） */
    /* 微分方程族（16 吃 05 的积分与 07 的指数解，故只留 07→16） */
    ['07', '16'],
    ['16', '17'],   /* 一阶 → 二阶微分方程 */
    /* 工具章（附录 A 吃 02：极限定理证明、归纳法；01 经 01→02 入链） */
    ['02', '18'],
    /* 汇聚：全书公式速查表挂在各知识链末端（这 8 章是依赖图的极大元） */
    ['04', '19'], ['06', '19'], ['08', '19'], ['09', '19'],
    ['12', '19'], ['15', '19'], ['17', '19'], ['18', '19']
  ];

  /* 布局：dm_L[章号] = [x, 层号]（层号 = 最长路径长度，0 = 起点层，10 = 汇聚层）
     y 世界坐标 = dm_rows − 层号（上层是前置、下层是后续）
     同行节点最小横向间隔 ≥ 1.0 单位，任意两节点像素中心距 ≥ 44px（assert ⑤ 复核） */
  var dm_rows = 10;
  var dm_L = {
    '00': [1.5, 0], '01': [1.5, 1], '02': [1.5, 2], '03': [1.5, 3], '18': [3.2, 3],
    '04': [0.5, 4], '05': [1.9, 4],
    '06': [0.0, 5], '07': [1.2, 5], '09': [2.35, 5], '10': [3.6, 5],
    '16': [-0.35, 6], '08': [1.7, 6], '11': [3.6, 6],
    '17': [-0.35, 7], '12': [2.5, 7], '13': [3.6, 7],
    '14': [3.6, 8], '15': [3.6, 9], '19': [1.5, 10]
  };

  /* ---------- 邻接表 / 拓扑序（模块级只算一次） ---------- */
  var dm_predMap = {}, dm_succMap = {}, dm_topoOrder = [];
  (function dm_init() {
    var i, j, u, indeg = {}, q = [];
    for (i = 0; i < dm_ids.length; i++) { dm_predMap[dm_ids[i]] = []; dm_succMap[dm_ids[i]] = []; }
    for (i = 0; i < dm_edges.length; i++) {
      dm_succMap[dm_edges[i][0]].push(dm_edges[i][1]);
      dm_predMap[dm_edges[i][1]].push(dm_edges[i][0]);
    }
    for (i = 0; i < dm_ids.length; i++) indeg[dm_ids[i]] = dm_predMap[dm_ids[i]].length;
    for (i = 0; i < dm_ids.length; i++) if (!indeg[dm_ids[i]]) q.push(dm_ids[i]);
    while (q.length) {
      u = q.shift(); dm_topoOrder.push(u);
      for (j = 0; j < dm_succMap[u].length; j++) if (--indeg[dm_succMap[u][j]] === 0) q.push(dm_succMap[u][j]);
    }
  })();

  /* ---------- 布局与标签小工具 ---------- */
  function dm_y(row) { return dm_rows - row; }
  function dm_xy(id) { var p = dm_L[id]; return [p[0], dm_y(p[1])]; }
  function dm_label(id) { return id + ' ' + dm_short[id]; }
  function dm_selId(s) { return (s && dm_L[s.pick]) ? s.pick : '00'; }
  function dm_maxRow() { var m = 0, i; for (i = 0; i < dm_ids.length; i++) m = Math.max(m, dm_L[dm_ids[i]][1]); return m; }

  var dm_nodeCache = null;
  function dm_nodes() {
    if (dm_nodeCache) return dm_nodeCache;
    var out = [], i, p;
    for (i = 0; i < dm_ids.length; i++) {
      p = dm_xy(dm_ids[i]);
      /* label 置空：章号与短名都由本台用 v.text 画（这样能随高亮状态一起淡出） */
      out.push({ id: dm_ids[i], x: p[0], y: p[1], r: 15, label: '' });
    }
    dm_nodeCache = out;
    return out;
  }

  /* ---------- 可达性：迭代 DFS 收全部前置（draw/read 用） ---------- */
  function dm_chain(id) {
    var seen = {}, stack = [id], out = [], j, x;
    seen[id] = true;
    while (stack.length) {
      x = stack.pop();
      var ps = dm_predMap[x] || [];
      for (j = 0; j < ps.length; j++) {
        if (!seen[ps[j]]) { seen[ps[j]] = true; out.push(ps[j]); stack.push(ps[j]); }
      }
    }
    out.sort();
    return out;
  }

  /* 通用 BFS 可达（map 传 dm_predMap 得前置闭包，传 dm_succMap 得后继闭包）；
     assert ④ 拿它与 dm_chain 的 DFS 结果逐章对照，两条独立算法互为复核 */
  function dm_reachBFS(id, map) {
    var seen = {}, q = (map[id] || []).slice(), out = [], i, x;
    seen[id] = true;
    while (q.length) {
      x = q.shift();
      if (seen[x]) continue;
      seen[x] = true; out.push(x);
      for (i = 0; i < (map[x] || []).length; i++) if (!seen[map[x][i]]) q.push(map[x][i]);
    }
    out.sort();
    return out;
  }

  /* 代表路径：每次取层号最大的前置（并列取章号小者），得到该章最深的一条前置链 */
  function dm_deepPath(id) {
    var path = [id], cur = id, guard = 0, i, ps, best;
    while (guard++ < 64) {
      ps = dm_predMap[cur] || []; best = null;
      for (i = 0; i < ps.length; i++) {
        if (best === null || dm_L[ps[i]][1] > dm_L[best][1] ||
            (dm_L[ps[i]][1] === dm_L[best][1] && ps[i] < best)) best = ps[i];
      }
      if (best === null) break;
      path.push(best); cur = best;
    }
    return path;
  }

  function dm_pathText(id) {
    var p = dm_deepPath(id), txt = [], i;
    for (i = 0; i < p.length; i++) txt.push(dm_label(p[i]));
    if (txt.length > 9) txt = ['…'].concat(txt.slice(txt.length - 9));
    return txt.join(' ⇠ ');
  }

  function dm_listOf(arr, max) {
    var out = [], i, n = Math.min(arr.length, max || 5);
    for (i = 0; i < n; i++) out.push(dm_label(arr[i]));
    if (arr.length > n) out.push('…共 ' + arr.length + ' 章');
    return out.join('、');
  }

  /* ---------- 高亮集与配色 ---------- */
  var dm_modes = ['chain', 'pre', 'succ', 'all'];
  function dm_hl(s) {
    var hl = {}, id = dm_selId(s), i, arr;
    if (s && s.mode === 'all') {
      for (i = 0; i < dm_ids.length; i++) hl[dm_ids[i]] = true;
      return hl;
    }
    hl[id] = true;
    if (!s || s.mode !== 'succ') { arr = dm_chain(id); for (i = 0; i < arr.length; i++) hl[arr[i]] = true; }
    if (!s || s.mode !== 'pre') { arr = dm_succMap[id] || []; for (i = 0; i < arr.length; i++) hl[arr[i]] = true; }
    return hl;
  }
  /* 边按「两端都在高亮集里」判亮，比 nodeGraph 内置的「沾边即亮」精确：
     只画链内的亮边，不会把后继章自己的下游边也点亮 */
  function dm_splitEdges(hl) {
    var on = [], off = [], i, e;
    for (i = 0; i < dm_edges.length; i++) {
      e = dm_edges[i];
      if (hl[e[0]] && hl[e[1]]) on.push(e); else off.push(e);
    }
    return { on: on, off: off };
  }

  function dm_rgba(hex, a) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  /* 箭头：nodeGraph 只画直线，方向由本台在目标端补三角箭头（尖端落在圆边缘） */
  function dm_arrowHead(v, ax, ay, bx, by, color, back) {
    var c = v.ctx;
    var sx = v.px(ax), sy = v.py(ay), tx = v.px(bx), ty = v.py(by);
    var dx = tx - sx, dy = ty - sy, len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return;
    var ux = dx / len, uy = dy / len, b = back || 17, s = 7.5;
    var x0 = tx - ux * b, y0 = ty - uy * b;
    c.save(); c.fillStyle = color; c.beginPath();
    c.moveTo(x0, y0);
    c.lineTo(x0 - ux * s - uy * s * 0.42, y0 - uy * s + ux * s * 0.42);
    c.lineTo(x0 - ux * s + uy * s * 0.42, y0 - uy * s - ux * s * 0.42);
    c.closePath(); c.fill(); c.restore();
  }

  /* 选中章的圈：nodeGraph 只能给「亮/暗」两档，选中态由本台加一圈橙色描边区分 */
  function dm_ring(v, x, y, r, color, w) {
    var c = v.ctx;
    c.save(); c.strokeStyle = color; c.lineWidth = w || 2.4;
    c.beginPath(); c.arc(v.px(x), v.py(y), r, 0, Math.PI * 2); c.stroke(); c.restore();
  }

  /* 一次性接线：点击节点 → 改 s.pick（并让 read/select 同步）；拖拽平移不算点击 */
  var dm_dragFrom = { x: 0, y: 0 };
  function dm_wire(v, s) {
    if (v.cv.__dmWired) return;
    v.cv.__dmWired = true;
    v.cv.addEventListener('pointerdown', function (e) { dm_dragFrom.x = e.clientX; dm_dragFrom.y = e.clientY; });
    v.cv.addEventListener('pointerup', function () { if (v.cv.style.cursor !== 'grabbing') v.cv.style.cursor = 'pointer'; });
    makeClickable(v, function () { return dm_nodes(); }, function (id, e) {
      if (!id) return;
      if (e && (Math.abs(e.clientX - dm_dragFrom.x) + Math.abs(e.clientY - dm_dragFrom.y) > 4)) return;
      s.pick = id;
      if (dm_lab._render) dm_lab._render();
    });
  }

  var dm_lab = {
    id: 'depmap', ch: '00',
    title: '全书知识依赖地图：点开一章看它的前置链',
    sub: '点节点（或选「目标章」）→ 亮起该章向上的全部前置链与向下的直接后继，其余节点变淡；箭头方向 = 前置 → 后续，上层是下层的前置。',
    tex: '00\\!\\to\\!01\\!\\to\\!02\\!\\to\\!03\\!\\to\\!\\{04,05\\},\\;\\; 05\\!\\to\\!\\{06,07,09,10\\},\\;\\; 07\\!\\to\\!\\{08,16\\}\\!\\to\\!17,\\;\\; 10\\!\\to\\!11\\!\\to\\!\\{12,13\\}\\!\\to\\!14\\!\\to\\!15,\\;\\; \\{04,06,08,09,12,15,17,18\\}\\!\\to\\!19',
    note: '用法：点任意节点或在「目标章」下拉里选一章——该章亮绿并加橙圈，向上递归点亮它的<b>全部前置链</b>（含间接前置），' +
      '向下点亮<b>直接后继</b>；「非高亮透明度」滑块控制其余节点淡到什么程度，「显示」可切成只看前置链 / 只看直接后继 / 全图。' +
      '依赖含义：边表示「读这章之前应先掌握什么」（学习顺序依赖，不是数学上的充要条件）；为避免连成蛛网，图上只画<b>传递归约</b>边——' +
      '若 A→B→C 已成立就不再画 A→C，所以 A 仍是 C 的前置链成员（点 C 就能看到），只是不重复画那条冗余边。' +
      '结构看点：第 00 章（总览与复习路线）是唯一源点，它只指向第 1 章——先定路线，再从函数起步；第 19 章（全书公式速查表）是唯一汇点，' +
      '前置链 = 其余 19 章，这就是「速查表放到最后当索引」的可视化理由；第 18 章（附录 A 工具箱）挂在第 2 章之后，服务于全书的证明与公式。',
    view: { x0: -0.95, x1: 4.3, y0: -0.8, y1: 12.0, h: 620, pad: { l: 20, r: 20, t: 14, b: 14 } },
    ctrls: [
      { k: 'pick', label: '目标章', type: 'sel', val: '03',
        opts: dm_ids.map(function (id) { return [id, dm_label(id)]; }) },
      { k: 'mode', label: '显示', type: 'sel', val: 'chain', opts: [
        ['chain', '前置链 + 直接后继'],
        ['pre', '只看前置链'],
        ['succ', '只看直接后继'],
        ['all', '全图（不淡出）']
      ] },
      { k: 'fade', label: '非高亮透明度', min: 0.05, max: 0.7, step: 0.05, val: 0.22 }
    ],

    draw: function (v, s) {
      dm_wire(v, s);
      var P = pal(), nodes = dm_nodes(), id = dm_selId(s), hl = dm_hl(s), sp = dm_splitEdges(hl);
      var a = typeof s.fade === 'number' ? s.fade : 0.22;
      var dimFill = dm_rgba(P.curve, Math.min(1, a * 0.8));
      var dimStroke = dm_rgba(P.curve, Math.min(1, a * 1.7));
      var dimText = dm_rgba(P.text, Math.min(1, 0.3 + a * 1.1));
      var arrowDim = dm_rgba(P.curve, Math.min(1, a * 1.3));
      var arrowOn = dm_rgba(P.curve3, 0.95);
      var i, nd, sel, on;

      v.clear();
      /* 两趟 nodeGraph：先暗边（只含两端不亮的边），再亮边 + 全节点着色，
         这样每条边只画一次，且亮边严格 = 高亮集内部的边 */
      v.nodeGraph(nodes, sp.off, { fill: dimFill, color: dimStroke, onFill: dimFill, onColor: dimStroke });
      v.nodeGraph(nodes, sp.on, {
        highlight: hl, fill: dimFill, color: dimStroke,
        onFill: P.fill3, onColor: P.curve3, hlColor: dm_rgba(P.curve, 0.8)
      });
      /* 方向箭头 */
      for (i = 0; i < dm_edges.length; i++) {
        var e = dm_edges[i], A = dm_xy(e[0]), B = dm_xy(e[1]);
        on = !!(hl[e[0]] && hl[e[1]]);
        dm_arrowHead(v, A[0], A[1], B[0], B[1], on ? arrowOn : arrowDim, 15 + 3);
      }
      /* 节点标签：圈内章号 + 圈下短名（合读即「03 导数」），并把命中区一并覆盖 */
      for (i = 0; i < nodes.length; i++) {
        nd = nodes[i]; sel = nd.id === id; on = !!hl[nd.id];
        if (sel) dm_ring(v, nd.x, nd.y, 19, P.curve2, 2.4);
        v.text(nd.x, nd.y, nd.id, { color: sel ? P.curve2 : (on ? P.text : dimText), size: 11, align: 'center' });
        v.text(nd.x, nd.y - 0.34, dm_short[nd.id],
          { color: sel ? P.curve2 : (on ? P.curve3 : dimText), size: 10.5, align: 'center' });
      }
      /* 画布上的文字回报：链、后继、图例 */
      var ch = dm_chain(id), sc = dm_succMap[id] || [];
      v.text(v.x0 + 0.06, dm_rows + 1.75,
        '箭头 = 前置 → 后续（上层是下层的前置）　·　点节点或选「目标章」切换　·　拖拽平移视野　·　边为传递归约',
        { color: P.muted, size: 10.5 });
      v.text(v.x0 + 0.06, dm_rows + 1.34,
        '目标 ' + dm_label(id) + '（' + dm_full[id] + '）　层 ' + dm_L[id][1] + '/' + dm_maxRow() +
        '　前置链 ' + ch.length + ' 章　直接后继 ' + sc.length + ' 章',
        { color: P.text, size: 12 });
      v.text(v.x0 + 0.06, dm_rows + 1.02,
        '前置链：' + (ch.length ? dm_pathText(id) + (ch.length > dm_deepPath(id).length - 1 ?
          '　…（共 ' + ch.length + ' 章，' + dm_listOf(ch, 4) + '）' : '') : '—（全书起点，无前置）'),
        { color: P.curve2, size: 11.5 });
      v.text(v.x0 + 0.06, dm_rows + 0.72,
        '直接后继：' + (sc.length ? dm_listOf(sc, 6) : '—（全书终点，无后继）'),
        { color: P.curve3, size: 11.5 });
    },

    read: function (s) {
      var id = dm_selId(s), ch = dm_chain(id), pr = dm_predMap[id] || [], sc = dm_succMap[id] || [];
      var down = dm_reachBFS(id, dm_succMap), prAll = dm_reachBFS(id, dm_predMap);
      var pos = dm_topoOrder.indexOf(id) + 1;
      return [
        ['目标章', dm_label(id) + '（' + dm_full[id] + '）'],
        ['依赖层号 / 最大层', dm_L[id][1] + ' / ' + dm_maxRow() + '（层号 = 从 00 出发的最长路径长度）'],
        ['前置链长度（反向可达）', ch.length + ' 章'],
        ['前置链代表路径', dm_pathText(id)],
        ['前置链成员（DFS 结果）', ch.length ? dm_listOf(ch, 8) : '—（全书起点）'],
        ['前置链成员（BFS 复核）', prAll.length === ch.length && prAll.join(',') === ch.join(',') ? '与 DFS 一致' : '与 DFS 不一致：' + dm_listOf(prAll, 8)],
        ['直接前置（' + pr.length + '）', pr.length ? dm_listOf(pr, 6) : '—（全书起点）'],
        ['直接后继（' + sc.length + '）', sc.length ? dm_listOf(sc, 6) : '—（全书终点）'],
        ['后继闭包（可支撑）', down.length + ' 章'],
        ['拓扑序位置', '第 ' + pos + ' / ' + dm_ids.length + ' 位'],
        ['全书规模', dm_ids.length + ' 章 / ' + dm_edges.length + ' 条依赖边（传递归约）']
      ];
    },

    /* 可选钩子（mountOne 每次重绘后调用）：把点击/下拉选出的目标章回写到 select */
    sync: function (sec, s) {
      var el = sec.querySelector('[data-k="pick"]');
      if (el && el.value !== s.pick) el.value = s.pick;
    },

    assert: function () {
      var L = this, out = [];
      var bad1 = [], bad2 = [], bad3 = [], bad4 = [], bad5 = [], bad6 = [];
      var ids = dm_ids, E = dm_edges, i, j, u, v, k;

      /* 断言内自建邻接表（不复用 draw 的缓存，保证独立） */
      var succ = {}, pred = {};
      for (i = 0; i < ids.length; i++) { succ[ids[i]] = []; pred[ids[i]] = []; }
      for (i = 0; i < E.length; i++) {
        u = E[i][0]; v = E[i][1];
        if (!succ[u] || !succ[v]) { bad1.push('未知章号的边 ' + u + '→' + v); continue; }
        succ[u].push(v); pred[v].push(u);
      }

      /* ① DAG：无自环/重复边 + Kahn 拓扑排序排满 20 章 + 唯一源点 00 / 唯一汇点 19 */
      var seenEdge = {}, indeg = {}, q = [], order = [];
      for (i = 0; i < E.length; i++) {
        u = E[i][0]; v = E[i][1];
        if (u === v) bad1.push('自环 ' + u);
        if (seenEdge[u + '>' + v]) bad1.push('重复边 ' + u + '→' + v);
        seenEdge[u + '>' + v] = true;
      }
      for (i = 0; i < ids.length; i++) indeg[ids[i]] = pred[ids[i]].length;
      for (i = 0; i < ids.length; i++) if (indeg[ids[i]] === 0) q.push(ids[i]);
      var srcs = q.slice(), sinks = [], deg = {};
      for (i = 0; i < ids.length; i++) deg[ids[i]] = indeg[ids[i]];
      while (q.length) {
        u = q.shift(); order.push(u);
        for (j = 0; j < succ[u].length; j++) if (--deg[succ[u][j]] === 0) q.push(succ[u][j]);
      }
      for (i = 0; i < ids.length; i++) if (succ[ids[i]].length === 0) sinks.push(ids[i]);
      if (order.length !== ids.length) bad1.push('拓扑排序只覆盖 ' + order.length + '/' + ids.length + ' 章（存在环）');
      if (srcs.length !== 1 || srcs[0] !== '00') bad1.push('源点应为唯一的 00，实为 [' + srcs.join(',') + ']');
      if (sinks.length !== 1 || sinks[0] !== '19') bad1.push('汇点应为唯一的 19，实为 [' + sinks.join(',') + ']');
      out.push({ name: 'depmap: 依赖关系是有向无环图（Kahn 拓扑排序排满 20 章、无自环与重复边、唯一源点 00 / 唯一汇点 19）',
        ok: bad1.length === 0, detail: bad1.join(';') || ('ok；拓扑序 ' + order.join('→')) });

      /* ② 与 data/index.js 的章节集合一致（能拿到 window.SITE_INDEX 就用它当基准，否则用内置同一份清单） */
      var refIds = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
                    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
      var refZh = dm_full, refSrc = '内置章号清单（运行时未取得 window.SITE_INDEX）';
      var idx = (typeof window !== 'undefined' && window.SITE_INDEX && window.SITE_INDEX.chapters) ? window.SITE_INDEX.chapters : null;
      if (idx && idx.length) {
        refIds = []; refZh = {};
        for (i = 0; i < idx.length; i++) { refIds.push(String(idx[i].id)); refZh[String(idx[i].id)] = String(idx[i].zh); }
        refSrc = 'window.SITE_INDEX.chapters（data/index.js）';
      }
      if (refIds.length !== ids.length) bad2.push('章数 ' + ids.length + ' ≠ 基准 ' + refIds.length);
      for (i = 0; i < Math.min(refIds.length, ids.length); i++) if (refIds[i] !== ids[i]) bad2.push('第 ' + (i + 1) + ' 位章号 ' + ids[i] + ' ≠ 基准 ' + refIds[i]);
      var seenId = {};
      for (i = 0; i < ids.length; i++) {
        if (seenId[ids[i]]) bad2.push('章号重复 ' + ids[i]);
        seenId[ids[i]] = true;
        if (!dm_L[ids[i]]) bad2.push('缺布局 ' + ids[i]);
        if (!dm_short[ids[i]]) bad2.push('缺短名 ' + ids[i]);
        if (dm_full[ids[i]] !== refZh[ids[i]]) bad2.push('章名不符 ' + ids[i] + '：' + dm_full[ids[i]] + ' vs ' + refZh[ids[i]]);
      }
      for (k in dm_L) if (!seenId[k]) bad2.push('未知章号（布局表）' + k);
      for (k in dm_full) if (!seenId[k]) bad2.push('未知章号（章名表）' + k);
      out.push({ name: 'depmap: 章号集合与 data/index.js 一致（20 章全覆盖、章号不重复、无未知章号、章名逐字相同；基准 = ' + refSrc + '）',
        ok: bad2.length === 0, detail: bad2.join(';') || ('ok（' + ids.length + ' 章：' + ids.join(',') + '）') });

      /* ③ 拓扑序满足所有边 + 层号 = 最长路径长度（按拓扑序递推，独立于布局表算一遍） */
      var pos = {};
      for (i = 0; i < order.length; i++) pos[order[i]] = i;
      for (i = 0; i < E.length; i++) {
        if (!(pos[E[i][0]] < pos[E[i][1]])) bad3.push(E[i][0] + '→' + E[i][1] + ' 不满足 order(u) < order(v)');
      }
      var depth = {}, d;
      for (i = 0; i < order.length; i++) {
        u = order[i]; d = 0;
        for (j = 0; j < pred[u].length; j++) d = Math.max(d, depth[pred[u][j]] + 1);
        depth[u] = d;
      }
      for (i = 0; i < ids.length; i++) {
        if (depth[ids[i]] !== dm_L[ids[i]][1]) bad3.push(ids[i] + ' 层号 ' + dm_L[ids[i]][1] + ' ≠ 最长路径 ' + depth[ids[i]]);
      }
      for (i = 0; i < E.length; i++) {
        if (!(depth[E[i][0]] < depth[E[i][1]])) bad3.push(E[i][0] + '→' + E[i][1] + ' 层号未递增');
      }
      out.push({ name: 'depmap: 拓扑序满足全部 ' + E.length + ' 条边（order(u) < order(v)），且每章层号 = 从 00 出发的最长路径长度（逐边层号递增）',
        ok: bad3.length === 0, detail: bad3.join(';') || ('ok；最长链 ' + dm_maxRow() + ' 层') });

      /* ④ 前置链：DFS（dm_chain）与 BFS（dm_reachBFS）两套独立算法逐章一致，并检查结构性质 */
      for (i = 0; i < ids.length; i++) {
        var A = dm_chain(ids[i]).join(','), B = dm_reachBFS(ids[i], dm_predMap).join(',');
        if (A !== B) bad4.push(ids[i] + ' 前置链不一致：DFS[' + A + '] vs BFS[' + B + ']');
        var C = dm_reachBFS(ids[i], dm_succMap);
        for (j = 0; j < C.length; j++) if (dm_chain(C[j]).indexOf(ids[i]) < 0) bad4.push(ids[i] + ' 不是后继 ' + C[j] + ' 的前置（正反可达不一致）');
      }
      if (dm_chain('00').length !== 0) bad4.push('00 的前置链应为空，实为 ' + dm_chain('00').length + ' 章');
      if (dm_chain('19').length !== ids.length - 1) bad4.push('19 的前置链应为 ' + (ids.length - 1) + ' 章，实为 ' + dm_chain('19').length);
      if (dm_reachBFS('00', dm_succMap).length !== ids.length - 1) bad4.push('00 的后继闭包应为 ' + (ids.length - 1) + ' 章，实为 ' + dm_reachBFS('00', dm_succMap).length);
      out.push({ name: 'depmap: 前置链两套独立算法逐章一致（迭代 DFS vs BFS，20 章全覆盖），且正反可达自洽、00 链空 / 19 链含其余 19 章',
        ok: bad4.length === 0, detail: bad4.join(';') || 'ok' });

      /* ⑤ 点击命中：离屏 View 上重建画布几何，4 档宽度实测命中半径与中心距 */
      var host = document.createElement('div'), cv = document.createElement('canvas');
      host.className = 'labCv';
      host.setAttribute('style', 'position:absolute;left:-10000px;top:0;width:640px;');
      host.appendChild(cv); document.body.appendChild(host);
      try {
        var widths = [280, 360, 640, 900], nodes = dm_nodes(), wi, vv, cx, cy, th, px, py, dd;
        var minPair = Infinity;
        for (wi = 0; wi < widths.length; wi++) {
          host.style.width = widths[wi] + 'px';
          vv = new View(cv, { x0: L.view.x0, x1: L.view.x1, y0: L.view.y0, y1: L.view.y1, h: L.view.h, pad: L.view.pad });
          for (i = 0; i < nodes.length; i++) {
            for (j = i + 1; j < nodes.length; j++) {
              dd = Math.hypot(vv.px(nodes[i].x) - vv.px(nodes[j].x), vv.py(nodes[i].y) - vv.py(nodes[j].y));
              if (dd < minPair) minPair = dd;
              if (!(dd >= 44)) bad5.push(widths[wi] + 'px 画布：' + nodes[i].id + '–' + nodes[j].id + ' 中心距 ' + dd.toFixed(1) + 'px < 44px');
            }
          }
          for (i = 0; i < nodes.length; i++) {
            cx = vv.px(nodes[i].x); cy = vv.py(nodes[i].y);
            if (vv.hitNode(nodes, cx, cy) !== nodes[i].id) bad5.push(widths[wi] + 'px 画布：中心未命中 ' + nodes[i].id);
            for (k = 0; k < 12; k++) {
              th = k * Math.PI / 6;
              px = cx + 21.9 * Math.cos(th); py = cy + 21.9 * Math.sin(th);
              if (vv.hitNode(nodes, px, py) !== nodes[i].id) bad5.push(widths[wi] + 'px 画布：' + nodes[i].id + ' 在 21.9px 环方向 ' + k + ' 未命中');
            }
          }
        }
      } catch (err) {
        bad5.push('异常：' + (err && err.message));
      } finally {
        if (host.parentNode) host.parentNode.removeChild(host);
      }
      out.push({ name: 'depmap: 点击命中半径 ≥22px（21.9px 环 12 方向 20 章全中 → 点击直径 ≥43.8px），且 20 章中心两两 ≥44px（280/360/640/900px 四档画布宽）',
        ok: bad5.length === 0, detail: bad5.join(';') || ('ok；四档最小中心距 ' + minPair.toFixed(1) + 'px') });

      /* ⑥ 边集已是传递归约：去掉任一条边后，从起点再走不到终点（否则该边冗余） */
      for (i = 0; i < E.length; i++) {
        u = E[i][0]; v = E[i][1];
        var seen = {}, qq = [u], hit = false;
        seen[u] = true;
        while (qq.length && !hit) {
          var x = qq.shift(), ns = succ[x];
          for (j = 0; j < ns.length; j++) {
            var w = ns[j];
            if (x === u && w === v) continue;   /* 跳过被检验的这条边本身 */
            if (w === v) { hit = true; break; }
            if (!seen[w]) { seen[w] = true; qq.push(w); }
          }
        }
        if (hit) bad6.push(u + '→' + v + ' 冗余（还存在一条更长的 u⇢v 路径）');
      }
      out.push({ name: 'depmap: ' + E.length + ' 条边已是传递归约（逐边屏蔽后复算：不存在长度 ≥2 的冗余通道）',
        ok: bad6.length === 0, detail: bad6.join(';') || 'ok' });

      return out;
    }
  };
  lab(dm_lab);
/* ==== /草稿合并：F.js ==== */

/* ==== 草稿合并：meanval.js ==== */
/* 来源：.tmp/labs05/meanval.js */
/* ⑫ 积分中值定理与平均值（第 5 章）——把面积“抹平”成等面积矩形，并找出取到平均高度的点 c */
function mv_cfg(k) {
  var C = {
    sq:    { txt: 'x²',   f: function (x) { return x * x; },           F: function (x) { return x * x * x / 3; } },
    sin:   { txt: 'sin x', f: function (x) { return Math.sin(x); },     F: function (x) { return -Math.cos(x); } },
    exp:   { txt: 'eˣ',   f: function (x) { return Math.exp(x); },      F: function (x) { return Math.exp(x); } },
    cubic: { txt: 'x³',   f: function (x) { return x * x * x; },        F: function (x) { return x * x * x * x / 4; } }
  };
  return C[k] || C.sq;
}
function mv_bounds(a, b) {              // 规范化：b 至少比 a 大 0.3（与控件下限一致）
  a = isFinite(a) ? a : 0;
  b = isFinite(b) ? b : a + 3;
  if (b < a + 0.3) { b = a + 0.3; }
  return [a, b];
}
function mv_int(k, a, b) {              // 闭式定积分 ∮ = F(b) − F(a)
  var C = mv_cfg(k);
  return C.F(b) - C.F(a);
}
function mv_minmax(k, a, b) {           // [a,b] 上 f 的数值最小 / 最大值（400 段含端点）
  var C = mv_cfg(k), lo = Infinity, hi = -Infinity, i;
  for (i = 0; i <= 400; i++) {
    var y = C.f(a + (b - a) * i / 400);
    if (y < lo) { lo = y; }
    if (y > hi) { hi = y; }
  }
  return [lo, hi];
}
function mv_avg(k, a, b) { return mv_int(k, a, b) / (b - a); }
function mv_meanRoots(k, a, b, avg) {   // f(c) = f̄ 的全部根（扫描 + 二分）
  var C = mv_cfg(k);
  return roots(function (x) { return C.f(x) - avg; }, a + 1e-9, b - 1e-9, 800);
}
function mv_Av(k, a, x) {               // 平均函数 A(x) = (1/(x−a))∫ₐˣ f(t)dt（闭式原函数）
  if (!(x > a)) { return NaN; }
  return (mv_cfg(k).F(x) - mv_cfg(k).F(a)) / (x - a);
}
function mv_sample(k, a, x1, x2, n) {   // 在 [x1,x2] 上采样 f 与 A，返回 y 范围
  var C = mv_cfg(k), lo = Infinity, hi = -Infinity, i;
  for (i = 0; i <= n; i++) {
    var x = x1 + (x2 - x1) * i / n, y = C.f(x), z = mv_Av(k, a, x);
    if (y < lo) { lo = y; }
    if (y > hi) { hi = y; }
    if (isFinite(z)) { if (z < lo) { lo = z; } if (z > hi) { hi = z; } }
  }
  return [lo, hi];
}

lab({
  id: 'meanval', ch: '05', title: '积分中值定理与平均值',
  sub: '把曲线下的面积“抹平”成同底等面积的矩形：矩形高就是平均高度 f̄；再在曲线上找出真正取到 f̄ 的点 c。右图是随右端点滑动的平均函数 A(x)——它从 f(a) 平滑过渡到 f̄，并在 x=b 处正好等于平均值。',
  tex: "\\bar f=\\frac{1}{b-a}\\int_a^b f(x)\\,dx,\\qquad A(x)=\\frac{1}{x-a}\\int_a^x f(t)\\,dt,\\qquad A'(x)=\\frac{f(x)-A(x)}{x-a}",
  note: '积分中值定理：f 在 [a,b] 上连续 ⇒ 存在 c∈(a,b) 使 f(c)=f̄，即「等面积矩形」的高一定被曲线取到。平均值永远夹在最小值与最大值之间（A 也一样）。A′(x)=(f(x)−A(x))/(x−a) 说明 A 把 f 向“平均值”方向拉动：A 高于 f 时下降、低于 f 时上升。',
  panes: 2,
  view:  { x0: -1.4, x1: 4.4, y0: -1.8, y1: 6.6 },
  view2: { x0: -1.4, x1: 4.6, y0: -1.8, y1: 6.6 },
  ctrls: [
    { k: 'k', label: '被积函数 f', type: 'sel', val: 'sq', opts: [['sq', 'x²'], ['sin', 'sin x'], ['exp', 'eˣ'], ['cubic', 'x³']] },
    { k: 'a', label: '左端点 a', min: -1, max: 1.5, step: 0.05, val: 0 },
    { k: 'b', label: '右端点 b', min: 0.4, max: 4, step: 0.05, val: 3 },
    { k: 'u', label: '取样位置 u', min: 0.05, max: 1, step: 0.01, val: 1 }
  ],
  draw: function (v, s) {
    var A = v[0], B = v[1], P = pal();
    var C = mv_cfg(s.k), ab = mv_bounds(s.a, s.b), a = ab[0], b = ab[1];
    var I = mv_int(s.k, a, b), avg = I / (b - a), mm = mv_minmax(s.k, a, b);
    var rs = mv_meanRoots(s.k, a, b, avg), c = rs.length ? rs[0] : null;
    var xu = a + Math.max(0.05, Math.min(1, s.u)) * (b - a);

    /* 左图：面积 + 等面积矩形 + 中值点 */
    var lo = Math.min(0, mm[0], avg) - 0.55, hi = Math.max(mm[1], avg, 0) + 0.75;
    A.x0 = Math.min(a, -0.25) - 0.7; A.x1 = b + 0.7; A.y0 = lo; A.y1 = hi;
    A.clear(); A.axes();
    shadeArea(A, C.f, a, b, P.fill, 300);
    A.poly([[a, 0], [b, 0], [b, avg], [a, avg]], { close: true, fill: P.fill3, stroke: P.curve2, w: 1.6 });
    A.fn(C.f, { color: P.curve, w: 2.2 });
    A.line(a, lo, a, hi, { color: P.muted, w: 1, dash: [3, 3] });
    A.line(b, lo, b, hi, { color: P.muted, w: 1, dash: [3, 3] });
    A.line(a, avg, b, avg, { color: P.curve2, w: 1.2, dash: [5, 4] });
    A.text(a + (b - a) * 0.5, avg, ' 平均高度 f̄=' + fmt(avg, 4) + ' ', { color: P.text, size: 12.5, align: 'center', base: 'middle', bg: true });
    A.text(a, lo + (hi - lo) * 0.04, ' a=' + fmt(a, 2) + ' ', { color: P.muted, size: 12, align: 'left', base: 'middle', bg: true });
    A.text(b, lo + (hi - lo) * 0.04, ' b=' + fmt(b, 2) + ' ', { color: P.muted, size: 12, align: 'right', base: 'middle', bg: true });
    if (c !== null) {
      A.line(c, 0, c, avg, { color: P.curve4, w: 1.3, dash: [4, 3] });
      A.dot(c, avg, { color: P.dot, r: 4.6, ring: true });
      A.text(c, avg, ' c=' + fmt(c, 4) + ' ', { color: P.text, size: 12.5, align: 'center', base: 'top', bg: true });
    }
    A.text(A.x0 + (A.x1 - A.x0) * 0.02, hi - (hi - lo) * 0.06, '面积 = f̄·(b−a) = ' + fmt(avg * (b - a), 5), { color: P.muted, size: 12, align: 'left', base: 'middle' });

    /* 右图：平均函数 A(x)（从 f(a) 过渡到 f̄）与 f 对照 */
    var x1 = a + (b - a) * 0.02, x2 = b + (b - a) * 0.40;
    var rng = mv_sample(s.k, a, x1, x2, 300);
    var b0 = Math.min(rng[0], avg) - 0.5, b1 = Math.max(rng[1], avg) + 0.6;
    B.x0 = a - 0.45; B.x1 = x2 + 0.25; B.y0 = b0; B.y1 = b1;
    B.clear(); B.axes();
    B.line(a, b0, a, b1, { color: P.muted, w: 1, dash: [3, 3] });
    B.line(b, b0, b, b1, { color: P.muted, w: 1, dash: [3, 3] });
    B.line(B.x0, avg, B.x1, avg, { color: P.curve2, w: 1.2, dash: [5, 4] });
    B.text(B.x1, avg, ' f̄=' + fmt(avg, 4) + ' ', { color: P.text, size: 12, align: 'right', base: 'bottom', bg: true });
    B.fn(C.f, { color: P.curve, w: 1.6, dash: [5, 4] });
    B.param(function (t) { return t; }, function (t) { return mv_Av(s.k, a, t); }, x1, x2, { color: P.curve3, w: 2.4, n: 900 });
    var av = mv_Av(s.k, a, xu), fv = C.f(xu);
    B.dropLine(xu, 0, xu, av, { color: P.muted, w: 1 });
    B.dot(xu, av, { color: P.dot, r: 4.4, ring: true });
    B.dot(xu, fv, { color: P.curve, r: 3.2 });
    B.text(xu, av, ' A(x)=' + fmt(av, 4) + ' ', { color: P.text, size: 12, align: 'left', base: 'bottom', bg: true });
    B.text(B.x0 + (B.x1 - B.x0) * 0.02, b1 - (b1 - b0) * 0.07, '绿：平均函数 A(x)　蓝虚线：f(x)', { color: P.muted, size: 12, align: 'left', base: 'middle' });
  },
  read: function (s) {
    var C = mv_cfg(s.k), ab = mv_bounds(s.a, s.b), a = ab[0], b = ab[1];
    var I = mv_int(s.k, a, b), avg = I / (b - a), mm = mv_minmax(s.k, a, b);
    var rs = mv_meanRoots(s.k, a, b, avg), c = rs.length ? rs[0] : null;
    var xu = a + Math.max(0.05, Math.min(1, s.u)) * (b - a), av = mv_Av(s.k, a, xu), fv = C.f(xu);
    var dh = 1e-5, dA = (mv_Av(s.k, a, xu + dh) - mv_Av(s.k, a, xu - dh)) / (2 * dh);
    var idn = (fv - av) / (xu - a);
    return [
      ['被积函数 f(x)', C.txt],
      ['区间 [a, b]', '[' + fmt(a, 2) + ', ' + fmt(b, 2) + ']'],
      ['积分 ∫ₐᵇ f（闭式原函数代值）', fmt(I, 6)],
      ['平均高度 f̄ = ∫/(b−a)', fmt(avg, 6)],
      ['矩形面积 f̄·(b−a)', fmt(avg * (b - a), 6)],
      ['面积差 |矩形 − 积分|', fmt(Math.abs(avg * (b - a) - I), 3) + '（应 0）'],
      ['中值点个数 / 取用的 c', rs.length + ' 个 / ' + (c === null ? '—' : fmt(c, 6))],
      ['f(c) − f̄（中值定理残差）', c === null ? '区间内无解' : fmt(C.f(c) - avg, 3)],
      ['f 在 [a,b] 的最小 / 最大值', fmt(mm[0], 4) + ' / ' + fmt(mm[1], 4) + '（f̄ 介于其间）'],
      ['平均函数 A(x) @ x=' + fmt(xu, 3), fmt(av, 6)],
      ['A(b)（应等于 f̄）', fmt(mv_Av(s.k, a, b), 6)],
      ['A′(x) 与 (f−A)/(x−a) 之差', fmt(Math.abs(dA - idn), 3)],
      ['x→a⁺ 时 A(x) → f(a)', fmt(mv_Av(s.k, a, a + 1e-6), 5) + ' → f(a)=' + fmt(C.f(a), 5)]
    ];
  },
  assert: function () {
    var out = [], L = this, cases = [['sq', 0, 3], ['sq', -1, 2], ['sin', 0.2, 2], ['sin', -1, 1], ['exp', -1, 1], ['exp', 0.5, 2], ['cubic', -1, 1], ['cubic', 0.5, 2], ['sq', 1, 4], ['sin', 0, Math.PI], ['exp', 0, 1], ['cubic', -2, 1]];
    var i, mI = 0, mA = 0, mF = 0, mMin = 0, bad = [];
    for (i = 0; i < cases.length; i++) {
      var k = cases[i][0], a = cases[i][1], b = cases[i][2];
      var I = mv_int(k, a, b), avg = I / (b - a), rect = avg * (b - a);
      var sim = simpson(mv_cfg(k).f, a, b, 4000);
      mI = Math.max(mI, Math.abs(rect - I), Math.abs(sim - I));            // 阈值 1e-9
      var rs = mv_meanRoots(k, a, b, avg);
      var c = rs.length ? rs[0] : null;
      if (c === null) { bad.push(k + '[' + a + ',' + b + '] 无中值点'); }
      else {
        mF = Math.max(mF, Math.abs(mv_cfg(k).f(c) - avg));                  // 阈值 1e-6
        if (!(c > a && c < b)) { bad.push(k + '[' + a + ',' + b + '] c 越界'); }
      }
      var mm = mv_minmax(k, a, b);
      mMin = Math.max(mMin, Math.max(0, mm[0] - avg), Math.max(0, avg - mm[1]));  // 阈值 1e-12
      mA = Math.max(mA, Math.abs(mv_Av(k, a, b) - avg));                    // 阈值 1e-9
    }
    var dh = 1e-5, mD = 0;
    var pts = [[0, 1.4], [-1, 0.7], [0.5, 2.1], [1, 3], [-0.6, 1.9]];
    for (i = 0; i < pts.length; i++) {
      var aa = pts[i][0], xx = pts[i][1];
      if (!(xx > aa + 0.2)) { continue; }
      var kk = cases[i % cases.length][0];
      var av = mv_Av(kk, aa, xx);
      var dA = (mv_Av(kk, aa, xx + dh) - mv_Av(kk, aa, xx - dh)) / (2 * dh);
      mD = Math.max(mD, Math.abs(dA - (mv_cfg(kk).f(xx) - av) / (xx - aa)));  // 阈值 1e-5
    }
    var lim = Math.abs(mv_Av('sq', 1, 1 + 1e-6) - 1);                      // 阈值 1e-4
    out.push({ name: 'meanval: 矩形面积 = 积分（闭式 + Simpson 复核，12 组，误差 <1e-9）', ok: mI < 1e-9 && bad.length === 0, detail: 'max=' + mI.toExponential(2) + (bad.length ? ' 例外：' + bad.join('；') : '') });
    out.push({ name: 'meanval: 中值点 c∈(a,b) 且 |f(c)−f̄| <1e-6（12 组）', ok: mF < 1e-6 && bad.length === 0, detail: 'max=' + mF.toExponential(2) });
    out.push({ name: 'meanval: f̄ 夹在 [min f, max f] 之间（12 组，容差 <1e-12）', ok: mMin < 1e-12, detail: 'max=' + mMin.toExponential(2) });
    out.push({ name: 'meanval: A(b)=f̄（<1e-9）+ 恒等式 A′(x)=(f−A)/(x−a)（差商，<1e-5）+ A(a⁺)→f(a)（<1e-4）', ok: (mA < 1e-9 && mD < 1e-5 && lim < 1e-4), detail: 'A(b)=' + mA.toExponential(2) + ' 恒等=' + mD.toExponential(2) + ' 极限=' + lim.toExponential(2) });
    var sinAvg = mv_int('sin', 0, Math.PI) / Math.PI;
    var sqAvg = mv_avg('sq', 0, 3);
    var sqC = mv_meanRoots('sq', 0, 3, 3);
    out.push({
      name: 'meanval: 经典值 f̄ = 2/π（sin 在 [0,π]，<1e-12）、f̄=3 且 c=√3（x² 在 [0,3]，<1e-9）',
      ok: (Math.abs(sinAvg - 2 / Math.PI) < 1e-12 && Math.abs(sqAvg - 3) < 1e-12 && sqC.length > 0 && Math.abs(sqC[0] - Math.sqrt(3)) < 1e-9),
      detail: '2/π=' + sinAvg.toFixed(12) + ' f̄=' + sqAvg + ' c=' + (sqC.length ? fmt(sqC[0], 9) : '—')
    });
    return out;
  }
});
/* ==== /草稿合并：meanval.js ==== */

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
     注册到新框架
     CSC.registerLabs({ id: { title, desc, ch, icon, tags, order, init } })
     · order 按章序（labOrder 的稳定排序）→ #/labs 索引页的自然顺序
     · ch 沿用旧站章号（00–19），映射为 'ch00'…'ch19'
     ===================================================================== */
  var LAB_ICON = {
    ch00: 'target', ch01: 'function', ch02: 'limit', ch03: 'tangent', ch04: 'chart',
    ch05: 'integral', ch06: 'integral', ch07: 'exp', ch08: 'formula', ch09: 'series',
    ch10: 'polar', ch11: 'vector', ch12: 'spacecurve', ch13: 'partial', ch14: 'multiple',
    ch15: 'field', ch16: 'diff', ch17: 'wave', ch18: 'repeat', ch19: 'book'
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
