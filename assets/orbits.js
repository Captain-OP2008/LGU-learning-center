/* =====================================================================
 * orbits.js · 轨道系统 · Canvas2D 层
 * ---------------------------------------------------------------------
 * 首页是一张真实太阳系的俯视示意图：太阳居中，八大行星沿透视椭圆轨道运行。负责：
 *   · 透视椭圆轨道（统一倾角与压扁，真实太阳系近似共面）
 *   · 星系遮挡：行星没入太阳圆盘的部分被真实裁掉，边缘柔和渐隐；
 *     行星之间也按远近相互遮挡，交界处同样做柔化，避免一帧硬切
 *   · 行星本体（朝太阳受光）、拖尾、光晕、悬停放大
 *   · 星尘粒子场
 *   · 命中测试（供 hub.js 做鼠标交互）
 * ===================================================================== */
(function (global) {
  'use strict';

  var TAU = Math.PI * 2;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function smoothstep(a, b, x) {
    var t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function Orbits(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.w = 1;
    this.h = 1;
    this.dpr = 1;
    this.cx = 0;
    this.cy = 0;
    this.R = 100;
    this.planets = [];
    this.dust = [];
    this._pos = [];
    this._lastPos = [];
    this._prev = [];
    this.hover = -1;
    this.active = -1;
    this._initDust();
    this._initBelt();
  }

  Orbits.prototype._initDust = function () {
    this.dust = [];
    var n = 78;
    for (var i = 0; i < n; i++) {
      var seed = (i * 9301 + 49297) % 233280 / 233280;
      var seed2 = (i * 4801 + 9973) % 233280 / 233280;
      this.dust.push({
        a: seed * TAU,
        r: 1.08 + seed2 * 1.75,
        speed: 0.008 + seed2 * 0.020,
        size: 0.5 + seed * 1.1,
        alpha: 0.08 + seed2 * 0.26,
        tw: seed * 6.28
      });
    }

    /* 镜头前景尘埃（bokeh）：制造纵深与"呼吸感" */
    this.fore = [];
    for (var j = 0; j < 16; j++) {
      var s1 = ((j * 7919 + 104729) % 100003) / 100003;
      var s2 = ((j * 6151 + 3571) % 100003) / 100003;
      this.fore.push({
        x: s1, y: s2,
        r: 2.5 + s2 * 11,
        a: 0.020 + s1 * 0.055,
        sp: 0.0025 + s2 * 0.0085,
        ph: s1 * 6.28
      });
    }
  };


  /* 小行星带：火星与木星轨道之间的碎石环。
     每颗碎石有自己的轨道半径、初始角度、公转速度（越外越慢）与轨道倾角微扰，
     因此不会像刚体一样整体旋转，而是缓慢地互相错动。 */
  Orbits.prototype._initBelt = function () {
    this.belt = [];
    var n = 3600;
    for (var i = 0; i < n; i++) {
      var s1 = ((i * 9301 + 49297) % 233280) / 233280;
      var s2 = ((i * 4801 + 9973) % 233280) / 233280;
      var s3 = ((i * 7919 + 104729) % 100003) / 100003;
      var s4 = ((i * 6571 + 3559) % 100003) / 100003;
      var a = 1.650 + s1 * 0.225;
      this.belt.push({
        a: a,
        ang0: s2 * TAU,
        speed: 0.0125 / Math.pow(a, 1.5),
        squash: 0.366 + s3 * 0.018,
        size: 0.48 + s4 * s4 * 1.05,
        alpha: 0.16 + s3 * 0.30,
        tone: s2
      });
    }
  };

  /* 带底是静态的（椭圆只随尺寸缩放），预渲染一次比每帧画几道描边更省，
     也能用 blur 做出真正的雾状过渡。R 变了才重建（见 _drawBelt）。 */
  Orbits.prototype._bakeBeltGlow = function () {
    var R = this.R;
    this._glowR = R;
    if (!(R > 8)) { this.beltGlow = null; return; }
    var sq = 0.374;
    var pad = Math.max(26, R * 0.20);
    var w = Math.ceil(R * 1.752 * 2 + pad * 2);
    var h = Math.ceil(R * 1.752 * sq * 2 + pad * 2);
    var cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    var c = cv.getContext("2d");
    c.save();
    c.filter = "blur(" + Math.max(2, R * 0.042).toFixed(1) + "px)";
    c.beginPath();
    c.ellipse(w / 2, h / 2, R * 1.752, R * 1.752 * sq, 0, 0, TAU);
    c.strokeStyle = "rgba(212,188,152,0.34)";
    c.lineWidth = Math.max(10, R * 0.155);
    c.stroke();
    c.beginPath();
    c.ellipse(w / 2, h / 2, R * 1.752, R * 1.752 * sq, 0, 0, TAU);
    c.strokeStyle = "rgba(236,216,184,0.16)";
    c.lineWidth = Math.max(4, R * 0.045);
    c.stroke();
    c.restore();
    this.beltGlow = cv;
  };

  Orbits.prototype.resize = function (w, h, dpr) {
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.cv.width = Math.max(2, Math.round(w * dpr));
    this.cv.height = Math.max(2, Math.round(h * dpr));
    this.cv.style.width = w + 'px';
    this.cv.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  /**
   * @param {number} cx  天体中心 CSS x
   * @param {number} cy  天体中心 CSS y
   * @param {number} R   天体半径 CSS px
   * @param {Array}  list [{id,no,en,zh,chapters,color,colorDim,colorHot,lit,dark,ring,glow,a,squash,tilt,speed,phase,size}]
   */
  Orbits.prototype.layout = function (cx, cy, R, list) {
    this.cx = cx;
    this.cy = cy;
    this.R = R;
    this.planets = list || this.planets;
  };

  Orbits.prototype._orbitA = function (i) {
    return this.R * this.planets[i].a;
  };

  Orbits.prototype._planetAt = function (i, t) {
    var p = this.planets[i];
    var A = this._orbitA(i);
    var ang = t * p.speed + p.phase;
    var ex = A * Math.cos(ang);
    var ey = A * p.squash * Math.sin(ang);
    var ct = Math.cos(p.tilt), st = Math.sin(p.tilt);
    return {
      x: this.cx + ex * ct - ey * st,
      y: this.cy + ex * st + ey * ct,
      dist: Math.sqrt(ex * ex + ey * ey),
      ang: ang
    };
  };

  /* 恒星背后的区域（上半球且落在星体圆内）——只用于轨道线的断开 */
  Orbits.prototype._occluded = function (x, y, pad) {
    var dx = x - this.cx;
    var dy = y - this.cy;
    if (dy > 0) return false;
    var rr = this.R * (pad == null ? 0.995 : pad);
    return dx * dx + dy * dy < rr * rr;
  };

  /* 行星当前可见度（0 = 完全没入恒星背后，1 = 完全可见）。
     用于标签淡出与命中测试；行星本体由 _occludePlanet 做真实几何遮挡。 */
  Orbits.prototype._visibility = function (i) {
    var p = this.planets[i];
    var pos = this._pos[i];
    if (!p || !pos) return 1;
    /* 轨道近侧的行星永远在恒星前面 */
    if (Math.sin(pos.ang) >= 0) return 1;
    var base = this.R * p.size;
    var dx = pos.x - this.cx;
    var dy = pos.y - this.cy;
    var d = Math.sqrt(dx * dx + dy * dy);
    var inner = this.R - base * 0.9;
    var outer = this.R + base * 1.1;
    var t = clamp((d - inner) / (outer - inner), 0, 1);
    return t * t * (3 - 2 * t);
  };

  /* 行星一点点没入恒星背后：只擦掉「行星本体落在恒星圆盘内」的那部分像素，
     而不是擦掉整个圆盘。旧实现用 destination-out 擦满盘，会把先画好的
     轨道线（尤其恒星前方本应可见的近侧轨道）和星尘一并抹掉，
     椭圆因此在恒星处断成左右两截 —— 这就是「轨道不全」的根因。 */
  Orbits.prototype._occludePlanet = function (i, s, ox, oy) {
    var p = this.planets[i];
    var pos = this._pos[i];
    if (!p || !pos) return;
    var ctx = this.ctx;
    var hot = (s.hover === i || s.active === i);
    var base = this.R * p.size * (hot ? 1.75 : 1);
    var r = base * 1.55 + 6;
    var x = pos.x + ox;
    var y = pos.y + oy;

    ctx.save();
    /* 只作用在恒星圆盘内：行星在盘外的部分必须保持可见 */
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.R * 1.02, 0, TAU);
    ctx.clip();
    ctx.globalCompositeOperation = 'destination-out';
    var g = ctx.createRadialGradient(x, y, r * 0.5, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.72, 'rgba(0,0,0,0.96)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    ctx.restore();
  };

  /* 行星之间的相互遮挡：远侧行星在近侧行星背后时，交界处柔和隐没。
     实体遮挡仍由"由远及近"的绘制顺序保证，这里只负责磨掉硬边。 */
  Orbits.prototype._eraseBehindNeighbors = function (order, k, s, ox, oy) {
    var ctx = this.ctx;
    var pos = this._pos[order[k]];
    var cur = order[k];
    var r0 = this.R * this.planets[cur].size *
             (s.hover === cur || s.active === cur ? 1.75 : 1);
    for (var j = k + 1; j < order.length; j++) {
      var idx = order[j];
      var np = this._pos[idx];
      var nr = this.R * this.planets[idx].size *
               (s.hover === idx || s.active === idx ? 1.75 : 1);
      var dx = np.x - pos.x;
      var dy = np.y - pos.y;
      var reach = (r0 + nr) * 1.22 + 6;
      if (dx * dx + dy * dy > reach * reach) continue;

      var x = np.x + ox;
      var y = np.y + oy;
      var g = ctx.createRadialGradient(x, y, nr * 0.84, x, y, nr * 1.18);
      g.addColorStop(0, 'rgba(0,0,0,0.94)');
      g.addColorStop(0.55, 'rgba(0,0,0,0.64)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, nr * 1.18, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  };

  /* ------------------------------------------------------------ 主绘制 */
  Orbits.prototype.draw = function (s) {
    var ctx = this.ctx;
    var W = this.w, H = this.h;
    ctx.clearRect(0, 0, W, H);
    if (!this.planets.length) return;
    if (s.reveal <= 0.002) return;

    var t = s.time;
    var i, n = this.planets.length;

    /* 行星位置 */
    this._pos = [];
    for (i = 0; i < n; i++) this._pos.push(this._planetAt(i, t));
    this._lastPos = this._pos;

    /* 拖尾历史 */
    if (!this._prev.length) this._prev = this._pos.map(function () { return []; });
    for (i = 0; i < n; i++) {
      var tr = this._prev[i];
      tr.push({ x: this._pos[i].x, y: this._pos[i].y });
      if (tr.length > 26) tr.shift();
    }

    var shakeX = s.pointer.x * 3.2;
    var shakeY = s.pointer.y * 2.4;

    /* 1 · 星尘 */
    this._drawDust(s, shakeX, shakeY);

    /* 2 · 小行星带（火星与木星之间） */
    this._drawBelt(s, shakeX, shakeY);

    /* 3 · 行星（按 y 由远及近） */
    var order = [];
    for (i = 0; i < n; i++) order.push(i);
    order.sort(function (a, b) { return this._pos[a].y - this._pos[b].y; }.bind(this));

    for (var k = 0; k < order.length; k++) {
      this._drawPlanet(order[k], s, shakeX, shakeY);
      /* 近处的行星继续往外画时，让刚画的行星在其背后柔和隐没 */
      this._eraseBehindNeighbors(order, k, s, shakeX, shakeY);
    }

    /* 4 · 镜头前景尘埃（纵向视差最强，制造景深） */
    this._drawFore(s, shakeX, shakeY);
  };

  /* ---------------------------------------------------------- 小行星带 */
  Orbits.prototype._drawBelt = function (s, ox, oy) {
    var ctx = this.ctx;
    var R = this.R;
    var t = s.time;
    var rv = s.reveal;
    if (rv <= 0.01) return;
    var px = Math.max(0.7, R / 208);
    var stride = R < 110 ? 2 : 1;
    var cx = this.cx + ox * 0.7, cy = this.cy + oy * 0.7;

    /* 恒星是不透明实体：整条带（含带底）都裁在圆盘之外 */
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, this.w, this.h);
    ctx.arc(this.cx + ox * 0.7, this.cy + oy * 0.7, R * 0.995, 0, TAU, true);
    ctx.clip("evenodd");

    /* 1 · 带底：预渲染的模糊椭圆雾带，给碎石一个"底子"，
           不至于散成一把沙子。R 变化（窗口尺寸变了）才重新烘焙。 */
    if (!this.beltGlow || this._glowR !== R) this._bakeBeltGlow();
    if (this.beltGlow) {
      ctx.globalAlpha = rv;
      ctx.drawImage(this.beltGlow, cx - this.beltGlow.width / 2, cy - this.beltGlow.height / 2);
      ctx.globalAlpha = 1;
    }

    /* 2 · 碎石：尺寸压小、透明度压低，数量提上去，看起来是细尘而不是颗粒 */
    for (var i = 0; i < this.belt.length; i += stride) {
      var b = this.belt[i];
      var ang = b.ang0 + t * b.speed;
      var x = cx + Math.cos(ang) * R * b.a;
      var y = cy + Math.sin(ang) * R * b.a * b.squash;
      if (x < -2 || x > this.w + 2 || y < -2 || y > this.h + 2) continue;
      var sz = Math.max(0.7, b.size * px * 1.05);
      ctx.globalAlpha = b.alpha * rv;
      ctx.fillStyle = b.tone > 0.55 ? "rgba(228,206,170,1)" : "rgba(208,198,180,1)";
      ctx.fillRect(x - sz * 0.5, y - sz * 0.5, sz, sz);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  };

  /* ------------------------------------------------------------ 前景尘埃 */
  Orbits.prototype._drawFore = function (s, ox, oy) {
    var ctx = this.ctx;
    var W = this.w, H = this.h;
    var t = s.time;
    for (var i = 0; i < this.fore.length; i++) {
      var f = this.fore[i];
      var px = (f.x + t * f.sp) % 1;
      var py = (f.y + Math.sin(t * 0.11 + f.ph) * 0.018 + 1) % 1;
      var x = px * W + ox * 15;
      var y = py * H + oy * 15;
      var r = f.r * (1 + 0.14 * Math.sin(t * 0.45 + f.ph));
      var g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.4);
      g.addColorStop(0, 'rgba(206,224,252,' + (f.a * s.reveal).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(206,224,252,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 3.4, 0, TAU);
      ctx.fill();
    }
  };

  /* ------------------------------------------------------------ 星尘 */
  Orbits.prototype._drawDust = function (s, ox, oy) {
    var ctx = this.ctx;
    var t = s.time;
    for (var i = 0; i < this.dust.length; i++) {
      var d = this.dust[i];
      var a = d.a + t * d.speed;
      var rr = this.R * d.r;
      var x = this.cx + Math.cos(a) * rr + ox * 0.5;
      var y = this.cy + Math.sin(a) * rr * 0.42 + oy * 0.5;
      if (x < -20 || x > this.w + 20 || y < -20 || y > this.h + 20) continue;
      /* 星尘闪烁原为 0.10~1.00，闪烁幅度过大；收窄为 0.55~1.00 的细微呼吸 */
      var tw = 0.775 + 0.225 * Math.sin(t * 0.9 + d.tw);
      ctx.beginPath();
      ctx.arc(x, y, d.size, 0, TAU);
      ctx.fillStyle = 'rgba(159,192,226,' + (d.alpha * tw * s.reveal).toFixed(3) + ')';
      ctx.fill();
    }
  };

  /* ------------------------------------------------------------ 行星 */
  Orbits.prototype._drawPlanet = function (i, s, ox, oy) {
    var p = this.planets[i];
    var pos = this._pos[i];

    var x = pos.x + ox, y = pos.y + oy;

    var ctx = this.ctx;
    var hot = (s.hover === i || s.active === i);
    var base = this.R * p.size;

    /* 远侧行星转到恒星背后：恒星是不透明实体，用恒星圆盘做反向裁剪，
       行星（含环带与卫星）落在圆盘内的部分整体消失。
       用透明度淡出会让环带与恒星图案叠在一起，看起来像"穿模"。 */
    var behind = Math.sin(pos.ang) < 0;
    ctx.save();
    if (behind) {
      ctx.beginPath();
      ctx.rect(-this.w, -this.h, this.w * 3, this.h * 3);
      ctx.arc(this.cx + ox, this.cy + oy, this.R * 1.005, 0, TAU, true);
      ctx.clip('evenodd');
    }

    /* 拖尾 */
    var tr = this._prev[i] || [];
    if (tr.length > 2) {
      for (var k = 1; k < tr.length; k++) {
        var a0 = (k / tr.length);
        ctx.beginPath();
        ctx.moveTo(tr[k - 1].x + ox, tr[k - 1].y + oy);
        ctx.lineTo(tr[k].x + ox, tr[k].y + oy);
        ctx.strokeStyle = p.trail;
        ctx.globalAlpha = a0 * 0.5 * (hot ? 1.6 : 1);
        ctx.lineWidth = Math.max(0.5, base * 0.28 * a0);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    var r = base * (hot ? 1.75 : 1);
    var lightAng = Math.atan2(this.cy - y, this.cx - x);

    /* 交给 planet.js：程序化贴图 + 受光 + 大气散射 + 环带 + 卫星 */
    if (typeof Planets !== 'undefined') {
      Planets.draw(ctx, x, y, r, p, {
        lightAngle: lightAng,
        time: s.time,
        hot: hot
      });
    } else {
      /* 降级：渐变球 */
      var bg = ctx.createRadialGradient(
        x + Math.cos(lightAng) * r * 0.4,
        y + Math.sin(lightAng) * r * 0.4,
        r * 0.05, x, y, r
      );
      bg.addColorStop(0, p.lit);
      bg.addColorStop(0.5, p.color);
      bg.addColorStop(1, p.dark);
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
  };

  /* ------------------------------------------------------------ 交互 */
  Orbits.prototype.hitTest = function (x, y) {
    if (!this._lastPos.length) return -1;
    var best = -1;
    var bestD = Infinity;
    for (var i = 0; i < this._lastPos.length; i++) {
      var p = this._lastPos[i];
      if (this._visibility(i) < 0.25) continue;
      var dx = x - p.x, dy = y - p.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      var hitR = Math.max(24, this.R * this.planets[i].size * 3.2);
      if (d < hitR && d < bestD) { bestD = d; best = i; }
    }
    return best;
  };

  Orbits.prototype.planetScreenPos = function (i) {
    var p = this._lastPos[i];
    return p ? { x: p.x, y: p.y } : null;
  };

  global.Orbits = Orbits;
})(window);
