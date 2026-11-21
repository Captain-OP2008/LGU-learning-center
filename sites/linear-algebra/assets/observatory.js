/* =====================================================================
 * CSC1003 互动学习站 · 签名视觉组件（NASA-Punk Observatory）
 * 职责：程序化等高线地形 / 终端打字机 / 轨道雷达 / 启动序列 / 四色幕布（低优先）。
 *       只暴露 window.CSC_OBS，不污染其他全局。
 * 依赖：零外部依赖（无 CDN / 无 import / 无 fetch），双击 file:// 可用。
 * API：mountTopo(canvas,opts) / mountCurtain(el) / runTerminal(el,opts)
 *      / mountRadar(el,opts) / mountBoot(el,opts) / tickSlider(input,cb)
 * CSS：外观全部在 assets/observatory.css，本文件只按下列既有 class 建结构：
 *   #topoCanvas（fixed 铺满，本文件只设 canvas.width/height × DPR）
 *   .curtain > i.c1..c4；状态 .on 可见 + .in/.out 触发 curtain-in/curtain-out
 *   .termOut 容器 + span.cursor 光标（blink 动画由 CSS 负责）
 *   .radarHost > .radar > svg.radarRings(circle.radarRing + line.radarAxis)
 *          + .radar-sweep + .radar-dot（--dot-c 上色，高亮 .on）+ .radar-core
 *   #boot > .bootTerm > .bootLine；收起状态 .done（兼容 .out）
 * 说明：等高线的 marching squares 状态表移植自 NASA-Punk Observatory（MIT）。
 * ===================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- 工具 */
  function noop() {}

  function num(v, d) {
    var n = typeof v === 'number' ? v : parseFloat(v);
    return isFinite(n) ? n : d;
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function mk(tag, cls, parent) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (parent) parent.appendChild(node);
    return node;
  }

  /* 自实现 debounce：本文件会先于 app.js 加载，不能依赖 CSC.debounce */
  function debounce(fn, ms) {
    var timer = null;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms || 0);
    };
  }

  /* 所有动效入口先问系统偏好：减少动效时直接给结果，不播动画 */
  function reduced() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;
    }
  }

  /* 颜色优先读 CSS 变量（observatory.css 定义 --obs-*，旧变量名兜底） */
  function cssVar(node, names, fallback) {
    try {
      var cs = window.getComputedStyle(node || document.documentElement);
      for (var i = 0; i < names.length; i++) {
        var v = cs.getPropertyValue(names[i]);
        if (v && v.trim()) return v.trim();
      }
    } catch (e) {}
    return fallback;
  }

  function toMs(s) {
    s = String(s || '0').trim();
    var n = parseFloat(s) || 0;
    return /ms$/.test(s) ? n : n * 1000;
  }

  /* 从 computed style 反推动画总时长：CSS 改时长时 JS 不用跟着改数字 */
  function animMs(node, fallback) {
    try {
      var cs = window.getComputedStyle(node);
      if (!cs || /^none$/i.test(String(cs.animationName || 'none').trim())) return fallback;
      var durs = String(cs.animationDuration || '0s').split(',');
      var dels = String(cs.animationDelay || '0s').split(',');
      var total = 0;
      for (var i = 0; i < durs.length; i++) {
        total = Math.max(total, toMs(durs[i]) + toMs(dels[i] || dels[0]));
      }
      return total > 0 ? total + 120 : fallback;
    } catch (e) {
      return fallback;
    }
  }

  /* 等 animationend，并挂兜底计时器：CSS 缺失/动画被禁用时回调也绝不丢失 */
  function afterAnim(node, fallback, next) {
    var done = false;
    var timer = null;
    function finish(e) {
      if (e && e.target && e.target !== node) return;   /* 忽略子元素冒泡的动画 */
      if (done) return;
      done = true;
      clearTimeout(timer);
      node.removeEventListener('animationend', finish);
      next();
    }
    node.addEventListener('animationend', finish);
    timer = setTimeout(finish, animMs(node, fallback));
  }

  /* 逐字追加到 Text 节点；按码点切分，emoji 不会被拆成半个字符。
     返回 stop()，用于打断上一次打字。 */
  function typer(textNode, text, speed, onDone) {
    var i = 0;
    var timer = null;
    var stopped = false;
    function step() {
      if (stopped) return;
      if (i >= text.length) {
        if (typeof onDone === 'function') onDone();
        return;
      }
      var code = text.charCodeAt(i);
      textNode.appendData(text.slice(i, i + (code >= 0xd800 && code <= 0xdbff ? 2 : 1)));
      i += code >= 0xd800 && code <= 0xdbff ? 2 : 1;
      timer = setTimeout(step, speed);
    }
    if (speed <= 0) {
      textNode.appendData(text);
      if (typeof onDone === 'function') onDone();
      return noop;
    }
    timer = setTimeout(step, speed);
    return function () { stopped = true; clearTimeout(timer); };
  }

  /* 启动文案里允许 <b>/<i> 两个行内标签（app.js 用它们做强调）：
     先按标签拆成元素树，再把文本节点交给打字机，这样打字中也能保留强调色。 */
  function buildRichLine(container, html) {
    var parts = [];
    var parent = container;
    var stack = [];
    var re = /<(\/?)(b|i)>/g;
    var last = 0;
    var m;
    function text(txt) {
      if (!txt) return;
      var node = document.createTextNode('');
      parent.appendChild(node);
      parts.push({ node: node, text: txt });
    }
    while ((m = re.exec(html))) {
      text(html.slice(last, m.index));
      if (m[1]) parent = stack.pop() || container;
      else {
        var tag = document.createElement(m[2]);
        parent.appendChild(tag);
        stack.push(parent);
        parent = tag;
      }
      last = m.index + m[0].length;
    }
    text(html.slice(last));
    return parts;
  }

  /* 跨多个 Text 节点顺序打字（buildRichLine 的产物），同样返回 stop() */
  function typeParts(parts, speed, onDone) {
    var pi = 0;
    var ci = 0;
    var timer = null;
    var stopped = false;
    function step() {
      if (stopped) return;
      while (pi < parts.length && ci >= parts[pi].text.length) { pi++; ci = 0; }
      if (pi >= parts.length) {
        if (typeof onDone === 'function') onDone();
        return;
      }
      var part = parts[pi];
      var code = part.text.charCodeAt(ci);
      var size = code >= 0xd800 && code <= 0xdbff ? 2 : 1;
      part.node.appendData(part.text.slice(ci, ci + size));
      ci += size;
      timer = setTimeout(step, speed);
    }
    if (speed <= 0) {
      for (var k = 0; k < parts.length; k++) parts[k].node.appendData(parts[k].text);
      if (typeof onDone === 'function') onDone();
      return noop;
    }
    timer = setTimeout(step, speed);
    return function () { stopped = true; clearTimeout(timer); };
  }

  /* ---------------------------------------------------------------- 噪声 */
  /* 梯度噪声（Perlin 风格）+ 确定性洗牌。项目要求零 vendor，这里只需 2D，
     输出约 [-1,1]，用法与参考站的 SimplexNoise.noise2D 一致。 */
  function makeNoise(seed) {
    var p = new Uint8Array(256);
    var perm = new Uint8Array(512);
    var i, j, t;
    for (i = 0; i < 256; i++) p[i] = i;
    var s = (seed >>> 0) || 1;
    function rnd() {
      /* xorshift32：同 seed 同地形，方便调试与截图复现 */
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    }
    for (i = 255; i > 0; i--) {
      j = Math.floor(rnd() * (i + 1));
      t = p[i]; p[i] = p[j]; p[j] = t;
    }
    for (i = 0; i < 512; i++) perm[i] = p[i & 255];

    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function grad(h, x, y) {
      switch (h & 7) {
        case 0: return x + y;
        case 1: return -x + y;
        case 2: return x - y;
        case 3: return -x - y;
        case 4: return x;
        case 5: return -x;
        case 6: return y;
        default: return -y;
      }
    }

    return function noise2(x, y) {
      var xi = Math.floor(x);
      var yi = Math.floor(y);
      var xf = x - xi;
      var yf = y - yi;
      var X = xi & 255;
      var Y = yi & 255;
      var u = fade(xf);
      var v = fade(yf);
      var aa = perm[perm[X] + Y];
      var ab = perm[perm[X] + Y + 1];
      var ba = perm[perm[X + 1] + Y];
      var bb = perm[perm[X + 1] + Y + 1];
      return lerp(
        lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
        lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
        v
      );
    };
  }

  /* 等值点在线段上的比例；两端相等取中点，避免除 0 出 Infinity */
  function iso(v1, v2, level) {
    var d = v2 - v1;
    return Math.abs(d) < 1e-6 ? 0.5 : (level - v1) / d;
  }

  /* ---------------------------------------------------------------- 1) 等高线地形 */
  /* 只在 mount / resize 重绘，不跑 rAF：这是静态背景，静止时零开销最省电。 */
  function mountTopo(canvas, opts) {
    var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
    if (!ctx) return { refresh: noop };                 /* 元素缺失/无 2D 上下文：静默降级 */
    if (canvas.__cscObsTopo) return canvas.__cscObsTopo; /* 重复 mount 复用同一实例 */

    var o = opts || {};
    var cfg = {
      lineWidth: num(o.lineWidth, 1.8),
      levels: Math.max(1, Math.round(num(o.levels, 6))),
      gridSize: Math.max(2, num(o.gridSize, 5)),
      /* 0.002 会在大屏上出现较多中频细节，观感偏碎；0.0016 让地形更“大块柔和” */
      noiseScale: num(o.noiseScale, 0.0016),
      noiseOffset: num(o.noiseOffset, 100),
      starCount: Math.max(0, Math.round(num(o.starCount, 0))),   /* 背景星点已关闭（0）：只保留等高线 + 技术网格 */
      gridAlpha: clamp(num(o.gridAlpha, 0.05), 0, 1),
      seed: num(o.seed, 0)
    };
    var lineColor = o.lineColor || cssVar(canvas, ['--obs-line', '--line-color', '--const-line'], '#3b4e6b');
    var noise2 = makeNoise(cfg.seed || ((Math.random() * 2147483646) | 0) + 1);
    var stars = [];
    var W = 0;
    var H = 0;
    var dpr = 1;
    var cols = 0;
    var rows = 0;
    var field = null;
    var fieldMin = 0;
    var fieldMax = 1;

    function fbm(x, y) {
      /* 两个 octave：低频（1x）决定大块柔和地形，高频（2.13x）只补一点边缘起伏。
         高频权重压到 .32：再大就“碎”，再小就退化成单频、失去层次。 */
      var n = noise2(x, y) + noise2(x * 2.13 + 37.2, y * 2.13 - 11.8) * 0.32;
      return (n / 1.32 + 1) * 0.5;
    }

    function resizeStore() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);  /* 3x 屏封顶 2x：肉眼无差，内存省一半 */
      W = Math.max(1, canvas.clientWidth || window.innerWidth || 1);
      H = Math.max(1, canvas.clientHeight || window.innerHeight || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);           /* 之后一律用 CSS 像素坐标绘制 */
    }

    function seedStars() {
      stars.length = 0;
      for (var i = 0; i < cfg.starCount; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.3 + Math.random() * 1.5,   /* 0.3–1.8px */
          a: 0.1 + Math.random() * 0.6    /* alpha .1–.7 */
        });
      }
    }

    function sampleField() {
      var step = cfg.gridSize;
      var scale = cfg.noiseScale;
      var off = cfg.noiseOffset;
      var i, j, v;
      cols = Math.ceil(W / step) + 2;
      rows = Math.ceil(H / step) + 2;
      field = new Float32Array(cols * rows);
      fieldMin = 1;
      fieldMax = 0;
      for (i = 0; i < cols; i++) {
        var nx = i * step * scale + off;
        for (j = 0; j < rows; j++) {
          v = fbm(nx, j * step * scale + off);
          field[i * rows + j] = v;
          if (v < fieldMin) fieldMin = v;
          if (v > fieldMax) fieldMax = v;
        }
      }
    }

    function drawGrid() {
      var g = 120;                    /* 技术网格间距（px） */
      var cross = 3;
      var x, y;
      ctx.save();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = cfg.gridAlpha;
      ctx.beginPath();
      for (x = 0; x <= W; x += g) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
      for (y = 0; y <= H; y += g) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
      ctx.stroke();
      /* 交点小十字：只做“仪器感”，所以比网格再淡一层（仍极淡） */
      ctx.globalAlpha = Math.min(1, cfg.gridAlpha * 2.5);
      ctx.beginPath();
      for (x = 0; x <= W; x += g) {
        for (y = 0; y <= H; y += g) {
          ctx.moveTo(x - cross + 0.5, y + 0.5);
          ctx.lineTo(x + cross + 0.5, y + 0.5);
          ctx.moveTo(x + 0.5, y - cross + 0.5);
          ctx.lineTo(x + 0.5, y + cross + 0.5);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawStars() {
      if (!cfg.starCount) return;   /* 星点关闭时提前返回 */
      var i;
      ctx.save();
      ctx.fillStyle = '#ffffff';
      for (i = 0; i < stars.length; i++) {
        ctx.globalAlpha = stars[i].a;
        ctx.beginPath();
        ctx.arc(stars[i].x, stars[i].y, stars[i].r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawContours() {
      var step = cfg.gridSize;
      var denom = cfg.levels > 1 ? cfg.levels - 1 : 1;
      var i, j, li, state, level, x, y, tl, tr, br, bl;
      var ax, ay, bx, by, cx, cy, dx, dy;
      /* 按本次噪声的实际取值范围自适应分布等值线：固定 0.2–0.8 时，
         某些视口会出现“贴边成框”或某几层完全找不到线的情况 */
      var span = Math.max(1e-4, fieldMax - fieldMin);
      var low = fieldMin + span * 0.12;
      var high = fieldMax - span * 0.12;
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = cfg.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (li = 0; li < cfg.levels; li++) {
        level = cfg.levels > 1 ? low + ((high - low) * li) / denom : (low + high) / 2;
        ctx.beginPath();
        for (i = 0; i < cols - 1; i++) {
          x = i * step;
          for (j = 0; j < rows - 1; j++) {
            y = j * step;
            tl = field[i * rows + j];
            tr = field[(i + 1) * rows + j];
            br = field[(i + 1) * rows + j + 1];
            bl = field[i * rows + j + 1];
            state = (tl >= level ? 8 : 0) | (tr >= level ? 4 : 0)
              | (br >= level ? 2 : 0) | (bl >= level ? 1 : 0);
            if (state === 0 || state === 15) continue;
            /* 四条边上的等值点，下面 14 种状态即 marching squares 的全部连线 */
            ax = x + step * iso(tl, tr, level); ay = y;
            bx = x + step; by = y + step * iso(tr, br, level);
            cx = x + step * iso(bl, br, level); cy = y + step;
            dx = x; dy = y + step * iso(tl, bl, level);
            switch (state) {
              case 1: ctx.moveTo(cx, cy); ctx.lineTo(dx, dy); break;
              case 2: ctx.moveTo(bx, by); ctx.lineTo(cx, cy); break;
              case 3: ctx.moveTo(bx, by); ctx.lineTo(dx, dy); break;
              case 4: ctx.moveTo(ax, ay); ctx.lineTo(bx, by); break;
              case 5: ctx.moveTo(ax, ay); ctx.lineTo(dx, dy); ctx.moveTo(bx, by); ctx.lineTo(cx, cy); break;
              case 6: ctx.moveTo(ax, ay); ctx.lineTo(cx, cy); break;
              case 7: ctx.moveTo(ax, ay); ctx.lineTo(dx, dy); break;
              case 8: ctx.moveTo(ax, ay); ctx.lineTo(dx, dy); break;
              case 9: ctx.moveTo(ax, ay); ctx.lineTo(cx, cy); break;
              case 10: ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.moveTo(cx, cy); ctx.lineTo(dx, dy); break;
              case 11: ctx.moveTo(ax, ay); ctx.lineTo(bx, by); break;
              case 12: ctx.moveTo(bx, by); ctx.lineTo(dx, dy); break;
              case 13: ctx.moveTo(bx, by); ctx.lineTo(cx, cy); break;
              default: ctx.moveTo(cx, cy); ctx.lineTo(dx, dy); break;   /* state 14 */
            }
          }
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    function refresh() {
      resizeStore();
      seedStars();
      sampleField();
      ctx.clearRect(0, 0, W, H);   /* 透明底：不填背景色，让页面背景透出来 */
      drawGrid();
      drawStars();
      drawContours();
    }

    canvas.__cscObsTopo = { refresh: refresh };
    window.addEventListener('resize', debounce(refresh, 150));
    refresh();
    return canvas.__cscObsTopo;
  }

  /* ---------------------------------------------------------------- 2) 四色幕布 */
  /* 路由转场 app.js 自己实现；这里只保留最小能力：.on 可见 → .in 盖屏 →
     .out 揭幕 → 清空状态并回调。连点时只排队，不叠加动画。 */
  function mountCurtain(el) {
    var waiters = [];
    var busy = false;

    function flush() {
      var list = waiters;
      waiters = [];
      for (var i = 0; i < list.length; i++) list[i]();
    }

    function play(onDone) {
      if (typeof onDone === 'function') waiters.push(onDone);
      if (!el) { flush(); return; }                  /* 元素缺失：直接放行，别挡住导航 */
      if (busy) return;                              /* 动画进行中：只排队，不重播 */
      if (reduced()) { flush(); return; }            /* 减少动效：不闪，直接走 */
      busy = true;
      el.classList.remove('out');
      el.classList.add('on');
      void el.offsetWidth;                           /* 强制 reflow，连点也能从头播 */
      el.classList.add('in');
      afterAnim(el, 580, function () {               /* curtain-in .46s */
        el.classList.remove('in');
        void el.offsetWidth;
        el.classList.add('out');
        afterAnim(el, 620, function () {             /* curtain-out .5s */
          el.classList.remove('out', 'on');
          busy = false;
          flush();
        });
      });
    }

    return { play: play };
  }

  /* ---------------------------------------------------------------- 3) 终端打字 */
  /* 容器 .termOut 的 white-space: pre-wrap 负责真换行；光标是 span.cursor，
     闪烁交给 CSS。文本用 Text 节点追加（不碰 innerHTML）。 */
  function runTerminal(el, opts) {
    var handle = { type: noop, clear: noop, stop: noop };
    if (!el) return handle;
    if (el.__cscObsTerm) return el.__cscObsTerm;     /* 重复 mount 复用，避免双光标 */

    var o = opts || {};
    var speed = Math.max(0, num(o.speed, 10));
    var cursorChar = o.cursor == null ? '▌' : String(o.cursor);
    var textNode = null;
    var cursorNode = null;
    var stopTyper = null;

    function idle() {
      if (stopTyper) { stopTyper(); stopTyper = null; }
    }

    function ensureCursor() {
      if (cursorNode && el.contains(cursorNode)) return;
      el.textContent = '';
      textNode = document.createTextNode('');
      el.appendChild(textNode);
      cursorNode = mk('span', 'cursor', el);
      cursorNode.textContent = cursorChar;
    }

    handle.type = function (text) {
      var s = String(text == null ? '' : text);
      var finished = false;
      idle();
      ensureCursor();
      textNode.data = '';
      /* 减少动效 / speed=0：直接出全文；否则逐字，"> " 行首也原样输出 */
      var stop = typer(textNode, s, reduced() ? 0 : speed, function () {
        finished = true;
        stopTyper = null;
      });
      if (!finished) stopTyper = stop;               /* 同步完成时不留下失效的 stop */
    };

    handle.clear = function () {
      idle();
      el.textContent = '';
      textNode = null;
      cursorNode = null;
    };

    handle.stop = function () {
      /* “暂停”而不是“清空”：保留已打出的字和光标 */
      idle();
    };

    ensureCursor();   /* 挂载即显示闪烁光标，终端呈待机态 */
    el.__cscObsTerm = handle;
    return handle;
  }

  /* ---------------------------------------------------------------- 4) 轨道雷达 */
  /* 结构全部用 DOM/SVG 生成（observatory.css 只负责外观与动画）：
     .radarHost > .radar > svg.radarRings(.radarRing/.radarAxis) + .radar-sweep
                + .radar-dot（--dot-c 上色）+ .radar-core。
     JS 不跑定时器，旋转靠 CSS 的 spin 动画；减少动效时只给 .radar 加 .static。 */
  function mountRadar(el, opts) {
    var handle = { setActive: noop, destroy: noop };
    if (!el) return handle;
    if (el.__cscObsRadar) return el.__cscObsRadar;   /* 重复 mount 复用 */

    var o = opts || {};
    var count = Math.max(1, Math.round(num(o.count, 14)));
    var rings = Math.max(1, Math.round(num(o.rings, 3)));
    var dots = [];
    var created = [];
    var root = el.classList && el.classList.contains('radar')
      ? el
      : mk('div', 'radar', el);

    /* 本函数生成的所有节点都记下来，destroy() 只回收自己的东西 */
    function add(tag, cls) {
      var node = mk(tag, cls, root);
      created.push(node);
      return node;
    }

    if (reduced()) root.classList.add('static');     /* CSS: .radar.static .radar-sweep 停转 */

    /* (a) 同心圆环 + 十字准线：SVG 放大缩小时虚线/线宽比例不变 */
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'radarRings');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    var r, k;
    for (r = 0; r < rings; r++) {
      var circle = document.createElementNS(NS, 'circle');
      circle.setAttribute('class', 'radarRing');
      circle.setAttribute('cx', '50');
      circle.setAttribute('cy', '50');
      circle.setAttribute('r', ((46 * (r + 1)) / rings).toFixed(2));
      svg.appendChild(circle);
    }
    var axes = [[50, 4, 50, 96], [4, 50, 96, 50]];
    for (k = 0; k < axes.length; k++) {
      var line = document.createElementNS(NS, 'line');
      line.setAttribute('class', 'radarAxis');
      line.setAttribute('x1', axes[k][0]);
      line.setAttribute('y1', axes[k][1]);
      line.setAttribute('x2', axes[k][2]);
      line.setAttribute('y2', axes[k][3]);
      svg.appendChild(line);
    }
    root.appendChild(svg);
    created.push(svg);

    /* (b) 扫描扇：conic-gradient 与 spin 动画都在 CSS */
    add('div', 'radar-sweep');

    /* (c) 轨道点：点落在对应圆环上，角度用黄金角错开避免扎堆；
           颜色按章节轮换（黄/橙/蓝/白/红），通过 --dot-c 交给 CSS 上色 */
    var palette = [
      cssVar(el, ['--obs-yellow', '--const-yellow'], '#d7ab61'),
      cssVar(el, ['--obs-orange', '--const-orange'], '#e06236'),
      cssVar(el, ['--obs-blue', '--const-blue'], '#2f4c79'),
      cssVar(el, ['--obs-white', '--text-white', '--const-white'], '#e8e8e8'),
      cssVar(el, ['--obs-red', '--const-red'], '#c82337')
    ];
    var base = Math.floor(count / rings);
    var extra = count - base * rings;
    var idx = 0;
    for (r = 0; r < rings; r++) {
      var per = base + (r < extra ? 1 : 0);
      var radius = (46 * (r + 1)) / rings;           /* 与圆圈半径对齐（viewBox %） */
      for (k = 0; k < per; k++) {
        var ang = ((k * 137.508) + (r * 29) + 12) * Math.PI / 180;
        var dot = add('div', 'radar-dot');
        dot.style.left = (50 + radius * Math.cos(ang)).toFixed(2) + '%';
        dot.style.top = (50 + radius * Math.sin(ang)).toFixed(2) + '%';
        dot.style.setProperty('--dot-c', palette[idx % palette.length]);
        dots.push(dot);
        idx++;
      }
    }

    /* (d) 中心亮点 */
    add('div', 'radar-core');

    handle.setActive = function (index) {
      var active = typeof index === 'number' ? index : -1;
      for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('on', i === active);
    };

    handle.destroy = function () {
      handle.setActive(-1);
      for (var i = 0; i < created.length; i++) {
        if (created[i].parentNode) created[i].parentNode.removeChild(created[i]);
      }
      if (root !== el && root.parentNode) root.parentNode.removeChild(root);
      created.length = 0;
      dots.length = 0;
      el.__cscObsRadar = null;
    };

    el.__cscObsRadar = handle;
    return handle;
  }

  /* ---------------------------------------------------------------- 5) 启动序列 */
  /* 静态 #boot 由本文件接管：首次进入逐行打字，本会话看过就直接跳过；
     点击/按键可跳过；另有 3s 兜底移除，任何异常都不会把站点挡死。 */
  var BOOT_LINES = [
    'LINK ESTABLISHED ......... OK',
    'LOADING MODULES .......... OK',
    'OBSERVATORY ENGINE ....... READY',
    'ALIGNING OPTICS .......... OK'
  ];

  function mountBoot(el, opts) {
    var handle = { skip: noop };
    if (!el) return handle;
    if (el.__cscObsBoot) return el.__cscObsBoot;     /* 重复 mount 复用，避免双份打字 */
    el.__cscObsBoot = handle;                        /* 先登记，提前 return 的分支也能复用 */

    var o = opts || {};
    var lines = Object.prototype.toString.call(o.lines) === '[object Array]' ? o.lines.slice() : BOOT_LINES;
    var minMs = Math.max(0, num(o.minMs, 1600));
    var key = typeof o.key === 'string' && o.key ? o.key : 'csc.boot.seen';
    var finished = false;
    var timers = [];
    var stopTyper = null;
    var i;

    function later(fn, ms) {
      var t = setTimeout(fn, ms);
      timers.push(t);
      return t;
    }

    function finish() {
      if (finished) return;
      finished = true;
      if (stopTyper) { stopTyper(); stopTyper = null; }
      for (i = 0; i < timers.length; i++) clearTimeout(timers[i]);
      timers = [];
      document.removeEventListener('click', finish, true);
      document.removeEventListener('keydown', finish, true);
      el.classList.add('done');    /* observatory.css：淡出并禁用交互 */
      el.classList.add('out');     /* 兼容旧 app.css 的 .boot.out */
      later(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 560);
    }

    handle.skip = finish;

    /* 本会话已看过：立刻拿掉，不再闪一下遮罩 */
    var seen = false;
    try { seen = !!sessionStorage.getItem(key); } catch (e) {}
    if (seen) {
      if (el.parentNode) el.parentNode.removeChild(el);
      return handle;
    }
    try { sessionStorage.setItem(key, '1'); } catch (e) {}

    /* 兜底：即使打字机与 CSS 动画全挂了，遮罩也不停留超过约 3s */
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, Math.max(3000, minMs + 1200));

    var log = el.querySelector('.bootTerm') || el.querySelector('#bootLog') || el.querySelector('.bootLog');
    if (!log) log = mk('div', 'bootTerm', el);
    log.textContent = '';   /* 丢掉可能的静态兜底行，避免和打字内容重复 */

    document.addEventListener('click', finish, true);
    document.addEventListener('keydown', finish, true);

    /* 先一次性建好所有行（空文本节点），把 min-height 之外的高度也预留出来，
       打字过程中 bootInner 就不会因为行高变化而上下跳 */
    var rows = [];
    var total = 0;
    for (i = 0; i < lines.length; i++) {
      var parts = buildRichLine(mk('div', 'bootLine', log), String(lines[i]));
      for (var k = 0; k < parts.length; k++) total += parts[k].text.length;
      rows.push(parts);
    }

    if (reduced()) {
      for (i = 0; i < rows.length; i++) {
        for (var r = 0; r < rows[i].length; r++) rows[i][r].node.appendData(rows[i][r].text);
      }
      later(finish, minMs);
      return handle;
    }

    /* 打字预算压到 minMs 的 55%（上限 1.25s、下限 0.6s）：整段打字控制在 ~1.4s 内，
       行间只停顿 70ms。速度上限 16ms/字，避免行数少时慢吞吞。 */
    var budget = Math.min(1250, Math.max(600, minMs * 0.55));
    var speed = Math.max(3, Math.min(16, Math.round(budget / Math.max(1, total))));
    var started = Date.now();

    function nextLine(index) {
      if (finished) return;
      if (index >= rows.length) {
        later(finish, Math.max(0, minMs - (Date.now() - started)));
        return;
      }
      stopTyper = typeParts(rows[index], speed, function () {
        stopTyper = null;
        later(function () { nextLine(index + 1); }, 70);
      });
    }

    nextLine(0);
    return handle;
  }

  /* ---------------------------------------------------------------- 6) 刻度滑块 */
  /* 外观交给 CSS；这里只把 min/max 归一化到 0..100 再回调（首页 FOV 滑块用）。 */
  function tickSlider(input, cb) {
    if (!input) return { set: noop, value: function () { return 0; } };
    if (input.__cscObsSlider) return input.__cscObsSlider;

    function bounds() {
      var min = parseFloat(input.min);
      var max = parseFloat(input.max);
      if (!isFinite(min)) min = 0;
      if (!isFinite(max) || max === min) max = min + 100;
      return { min: min, max: max };
    }

    function value() {
      var b = bounds();
      var raw = parseFloat(input.value);
      if (!isFinite(raw)) raw = b.min;
      return clamp(((raw - b.min) / (b.max - b.min)) * 100, 0, 100);
    }

    function emit() { if (typeof cb === 'function') cb(value()); }
    function onInput() { emit(); }

    input.addEventListener('input', onInput);
    input.addEventListener('change', onInput);
    input.__cscObsSlider = {
      set: function (v) {
        var b = bounds();
        var p = clamp(num(v, 0), 0, 100);
        input.value = String(b.min + (p / 100) * (b.max - b.min));
        emit();   /* 程序设值也走同一回调，外部标签状态才不会不同步 */
      },
      value: value
    };
    return input.__cscObsSlider;
  }

  /* ---------------------------------------------------------------- 7) 导出 + 自举 */
  window.CSC_OBS = {
    mountTopo: mountTopo,
    mountCurtain: mountCurtain,
    runTerminal: runTerminal,
    mountRadar: mountRadar,
    mountBoot: mountBoot,
    tickSlider: tickSlider
  };

  /* 静态元素（#topoCanvas / #boot）由本文件自举，app.js 不必再管；
     终端与雷达在首页动态渲染，由 app.js 调 CSC_OBS 挂载（重复调用会拿到同一 handle）。
     setTimeout(0) 让 app.js 的初始化先跑——它若自己调 mountBoot，就用它传入的文案。 */
  function bootstrap() {
    /* 静态元素才兜底自举：万一 app.js 初始化失败，地形与启动遮罩也不会缺席。
       首页终端/雷达由 app.js 动态渲染后调用，这里不猜 DOM，避免重复挂载。 */
    var canvas = document.getElementById('topoCanvas');
    if (canvas) mountTopo(canvas);
    var boot = document.getElementById('boot');
    if (boot) mountBoot(boot);
  }

  function scheduleBootstrap() { setTimeout(bootstrap, 0); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleBootstrap);
  } else {
    scheduleBootstrap();
  }
})();
