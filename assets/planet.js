/* =====================================================================
 * planet.js · 程序化行星建模
 * ---------------------------------------------------------------------
 * 门户首页「太阳系」用到的每一颗行星都不是渐变圆点，而是各自烘焙贴图：
 *   MERCURY  水星：灰褐岩石 / 陨石坑场 / 暗色平原 / 皱脊
 *   VENUS    金星：浓密硫酸云层 / 超级旋转纬向云带 / 极区暗涡
 *   EARTH    地球：深蓝海洋 / 绿褐大陆 / 大块白云 / 亮极冠
 *   MARS     火星：铁锈红地表 / 大块暗斑 / 小而亮的极冠 / 沙尘雾
 *   JUPITER  木星：宽纬向条带 / 细条带 / 湍流漩涡 / 大红斑
 *   SATURN   土星：淡金奶油条带 / 金色多层环带
 *   URANUS   天王星：甲烷青大气 / 近乎无条纹 / 极区亮斑 / 竖立暗环
 *   NEPTUNE  海王星：深蓝球体 / 亮白甲烷云 / 大暗斑
 *
 * 实现方式：
 *   · 启动时用 JS 值噪声逐像素做球面映射，烘成一张圆盘贴图（136²）
 *   · 运行时仅 drawImage + 光照/大气/环带叠加，开销极低
 * ===================================================================== */
(function (global) {
  'use strict';

  var TAU = Math.PI * 2;

  /* ------------------------------------------------------------ 噪声 */
  function hash3(x, y, z, seed) {
    var h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) +
            Math.imul(z | 0, 1274126177) + Math.imul(seed | 0, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h = h ^ (h >>> 16);
    return (h >>> 0) / 4294967296;
  }

  function smooth(t) { return t * t * (3 - 2 * t); }

  function vnoise3(x, y, z, seed) {
    var ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
    var fx = smooth(x - ix), fy = smooth(y - iy), fz = smooth(z - iz);
    var n000 = hash3(ix, iy, iz, seed);
    var n100 = hash3(ix + 1, iy, iz, seed);
    var n010 = hash3(ix, iy + 1, iz, seed);
    var n110 = hash3(ix + 1, iy + 1, iz, seed);
    var n001 = hash3(ix, iy, iz + 1, seed);
    var n101 = hash3(ix + 1, iy, iz + 1, seed);
    var n011 = hash3(ix, iy + 1, iz + 1, seed);
    var n111 = hash3(ix + 1, iy + 1, iz + 1, seed);
    var a = n000 + (n100 - n000) * fx;
    var b = n010 + (n110 - n010) * fx;
    var c = n001 + (n101 - n001) * fx;
    var d = n011 + (n111 - n011) * fx;
    var e = a + (b - a) * fy;
    var f = c + (d - c) * fy;
    return e + (f - e) * fz;
  }

  function fbm3(x, y, z, oct, seed) {
    var a = 0.5, s = 0, n = 0;
    for (var i = 0; i < oct; i++) {
      s += a * vnoise3(x, y, z, seed + i * 131);
      n += a;
      x = x * 2.03 + 0.37;
      y = y * 2.03 + 1.71;
      z = z * 2.03 + 2.59;
      a *= 0.5;
    }
    return s / n;
  }

  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function ss(a, b, x) { var t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function mix(a, b, t) { return a + (b - a) * t; }

  /* ------------------------------------------------------------ 色板 */
  function lerpRGB(c1, c2, t) {
    return [
      mix(c1[0], c2[0], t),
      mix(c1[1], c2[1], t),
      mix(c1[2], c2[2], t)
    ];
  }

  /* ================================================================ 冰封行星 */
  function shadeIce(nx, ny, nz, seed) {
    var lat = ny;

    /* 冰壳板块 */
    var n1 = fbm3(nx * 2.2 + 5.0, ny * 2.2 + 1.0, nz * 2.2 + 7.0, 5, seed);
    var n2 = fbm3(nx * 5.6 + 11.0, ny * 5.6 + 3.0, nz * 5.6 + 9.0, 4, seed + 37);

    /* 裂隙网络：ridged 的脊线就是冰裂缝 */
    var c1 = 1.0 - Math.abs(fbm3(nx * 2.8 + 3.0, ny * 2.8 + 7.0, nz * 2.8 + 1.0, 4, seed + 7) * 2.0 - 1.0);
    var c2 = 1.0 - Math.abs(fbm3(nx * 6.8 + 5.0, ny * 6.8 + 2.0, nz * 6.8 + 11.0, 3, seed + 73) * 2.0 - 1.0);
    var crack = Math.pow(c1, 5.0) * 0.88 + Math.pow(c2, 8.0) * 0.50;

    /* 冰晶闪光点 */
    var spark = fbm3(nx * 15.0 + 3.0, ny * 15.0 + 8.0, nz * 15.0 + 2.0, 3, seed + 19);
    var sparkle = Math.pow(Math.max(0, spark - 0.63) / 0.37, 2.2);

    var abyss = [16, 26, 56];      /* 裂隙深处的深蓝 */
    var deep  = [52, 82, 128];
    var mid   = [124, 172, 214];
    var light = [194, 224, 244];
    var white = [240, 248, 254];
    var cyan  = [148, 216, 238];

    /* 冰壳：按高度由深到浅 */
    var h = n1 * 0.65 + n2 * 0.35;
    var col = lerpRGB(deep, mid, ss(0.16, 0.56, h));
    col = lerpRGB(col, light, ss(0.50, 0.80, h));
    col = lerpRGB(col, white, ss(0.76, 1.0, h) * 0.85);

    /* 裂隙：露出深处的暗蓝 */
    var cr = Math.min(1.0, crack * 1.15);
    col = lerpRGB(col, abyss, cr * 0.92);

    /* 裂隙边缘的青色反光 */
    var edge = ss(0.32, 0.74, crack) * (1.0 - ss(0.74, 1.0, crack));
    col = lerpRGB(col, cyan, edge * 0.48);

    /* 极区纯白 */
    var cap = ss(0.52, 0.94, Math.abs(lat));
    col = lerpRGB(col, white, cap * 0.80);

    /* 冰雾薄云 */
    var haze = ss(0.54, 0.80, fbm3(nx * 3.4 + 21.0, ny * 3.4 + 6.0, nz * 3.4 + 13.0, 4, seed + 29));
    col = lerpRGB(col, [226, 240, 252], haze * 0.32);

    /* 冰晶闪烁 */
    col = lerpRGB(col, white, sparkle * 0.65);

    return col;
  }

  /* ================================================================ 金星 */
  function shadeVenus(nx, ny, nz, seed) {
    var lat = ny;

    /* 云层高度场 */
    var c1 = fbm3(nx * 1.7 + 2.0, ny * 1.7 + 5.0, nz * 0.374 + 9.0, 5, seed);
    var c2 = fbm3(nx * 3.9 + 7.0, ny * 3.9 + 1.0, nz * 0.858 + 3.0, 4, seed + 23);

    /* 超级旋转：被强烈扭曲的纬向云带 */
    var warp = fbm3(nx * 2.4 + 11.0, ny * 2.4 + 7.0, nz * 0.528 + 5.0, 3, seed + 41) - 0.5;
    var bandA = Math.sin(lat * 8.5 + warp * 4.5 + c1 * 3.0);
    var bandB = Math.sin(lat * 19.0 + warp * 8.0 + c2 * 4.0);
    var bandC = Math.sin(lat * 34.0 + warp * 12.0);

    var t = clamp01(0.5 + 0.32 * bandA + 0.12 * bandB + 0.06 * bandC);

    var deep  = [130, 98, 56];
    var ochre = [184, 148, 94];
    var gold  = [226, 198, 142];
    var cream = [244, 232, 202];
    var white = [252, 247, 230];

    var col = lerpRGB(ochre, gold, ss(0.10, 0.55, t));
    col = lerpRGB(col, cream, ss(0.50, 0.86, t));
    col = lerpRGB(col, white, ss(0.82, 1.0, t) * 0.75);
    col = lerpRGB(col, deep, ss(0.30, 0.0, t) * 0.74);

    /* 云层细节丝 */
    var fine = fbm3(nx * 8.5 + 3.0, ny * 8.5 + 13.0, nz * 1.870 + 5.0, 3, seed + 61);
    col = lerpRGB(col, cream, ss(0.55, 0.84, fine) * 0.26);

    /* 极涡：暗色旋涡 */
    var pole = ss(0.56, 0.96, Math.abs(lat));
    var poleSwirl = 0.5 + 0.5 * Math.sin(ny * 42.0 + nx * 9.0);
    col = lerpRGB(col, [116, 88, 52], pole * (0.42 + 0.28 * poleSwirl));

    return col;
  }

  /* ------------------------------------------------------------ 陨石坑（水星） */
  var _craterCache = {};

  function craterList(seed) {
    if (_craterCache[seed]) return _craterCache[seed];
    var arr = [];
    var specs = [
      { n: 22, rMin: 0.16, rMax: 0.34, depth: 0.55 },   /* 大坑 */
      { n: 80, rMin: 0.070, rMax: 0.150, depth: 0.42 }, /* 中坑 */
      { n: 220, rMin: 0.028, rMax: 0.065, depth: 0.30 } /* 小坑 */
    ];
    var k = 0;
    for (var s = 0; s < specs.length; s++) {
      var sp = specs[s];
      for (var i = 0; i < sp.n; i++) {
        k++;
        var u = hash3(k, 7, 3, seed) * 2 - 1;
        var th = hash3(k, 19, 11, seed) * TAU;
        var sr = Math.sqrt(Math.max(0, 1 - u * u));
        var r = sp.rMin + (sp.rMax - sp.rMin) * hash3(k, 31, 5, seed);
        arr.push({
          x: sr * Math.cos(th),
          y: u,
          z: sr * Math.sin(th),
          r: r,
          cosR: Math.cos(r),
          depth: sp.depth * (0.75 + 0.5 * hash3(k, 43, 17, seed))
        });
      }
    }
    _craterCache[seed] = arr;
    return arr;
  }

  function craterRelief(nx, ny, nz, seed) {
    var list = craterList(seed);
    var best = 0;
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      var dot = nx * c.x + ny * c.y + nz * c.z;
      if (dot <= c.cosR) continue;
      var t = Math.acos(dot > 1 ? 1 : dot) / c.r;
      var bowl = -(1 - t * t) * c.depth;
      var rim = Math.exp(-Math.pow((t - 0.88) / 0.135, 2)) * c.depth * 1.22;
      var v = bowl + rim;
      if (Math.abs(v) > Math.abs(best)) best = v;
    }
    return best;
  }

  /* ================================================================ 水星 */
  function shadeMercury(nx, ny, nz, seed) {
    /* 陨石坑起伏 */
    var relief = craterRelief(nx, ny, nz, seed);

    /* 岩石基底 */
    var rock = fbm3(nx * 2.6 + 3.0, ny * 2.6 + 9.0, nz * 0.572 + 1.0, 5, seed + 101);
    /* 暗色玄武岩平原 */
    var plain = ss(0.34, 0.66, fbm3(nx * 1.5 + 7.0, ny * 1.5 + 2.0, nz * 0.330 + 11.0, 3, seed + 151));
    /* 皱脊（lobate scarp） */
    var ridge = 1 - Math.abs(fbm3(nx * 4.2 + 5.0, ny * 4.2 + 13.0, nz * 0.924 + 3.0, 4, seed + 181) * 2 - 1);
    ridge = Math.pow(ridge, 6);

    var v = clamp01(0.5 + relief * 0.62 + (rock - 0.5) * 0.28);

    var deep  = [54, 50, 46];
    var dark  = [86, 80, 74];
    var mid   = [138, 130, 120];
    var lit   = [196, 188, 176];
    var bright= [226, 220, 208];

    var col = lerpRGB(dark, mid, ss(0.10, 0.60, v));
    col = lerpRGB(col, lit, ss(0.58, 0.88, v));
    col = lerpRGB(col, bright, ss(0.86, 1.0, v) * 0.7);
    col = lerpRGB(col, deep, ss(0.34, 0.0, v) * 0.85);

    /* 暗色平原 */
    col = lerpRGB(col, [70, 66, 62], plain * 0.30);
    /* 皱脊亮线 */
    col = lerpRGB(col, [180, 172, 160], ridge * 0.28);
    /* 细颗粒 */
    var grain = fbm3(nx * 16.0 + 2.0, ny * 16.0 + 6.0, nz * 3.520 + 14.0, 3, seed + 211);
    col = lerpRGB(col, [160, 152, 142], (grain - 0.5) * 0.16);

    return col;
  }

  /* ================================================================ 熔岩行星 */
  function shadeLava(nx, ny, nz, seed) {
    var lat = ny;

    /* 玄武岩基底 */
    var base = fbm3(nx * 3.0 + 7.0, ny * 3.0 + 2.0, nz * 3.0 + 5.0, 5, seed);
    var shell = fbm3(nx * 8.5 + 11.0, ny * 8.5 + 3.0, nz * 8.5 + 13.0, 4, seed + 29);

    /* 岩浆裂纹：ridged noise 的脊线 */
    var r1 = 1.0 - Math.abs(fbm3(nx * 2.6, ny * 2.6, nz * 2.6, 4, seed + 7) * 2.0 - 1.0);
    var r2 = 1.0 - Math.abs(fbm3(nx * 6.4 + 4.0, ny * 6.4, nz * 6.4 + 8.0, 3, seed + 61) * 2.0 - 1.0);
    var crack = Math.pow(r1, 3.2) * 0.65 + Math.pow(r2, 5.0) * 0.45;

    /* 熔岩湖：低频阈值 */
    var lake = ss(0.60, 0.74, fbm3(nx * 1.7 + 21.0, ny * 1.7 + 6.0, nz * 1.7 + 15.0, 3, seed + 97));

    var basalt = [34, 30, 30];
    var basalt2 = [62, 54, 52];
    var ash = [96, 88, 84];
    var magma = [196, 62, 10];
    var hot = [255, 156, 34];
    var white = [255, 226, 160];

    var col = lerpRGB(basalt, basalt2, shell * 0.8);
    col = lerpRGB(col, ash, ss(0.62, 0.86, base) * 0.5);

    /* 裂纹里的岩浆 */
    var glow = clamp01(crack);
    var lava = lerpRGB(magma, hot, glow);
    lava = lerpRGB(lava, white, Math.pow(glow, 3.0) * 0.75);
    col = lerpRGB(col, lava, Math.min(1.0, glow * 1.25));

    /* 熔岩湖 */
    var lakeCol = lerpRGB(hot, white, 0.35 + 0.3 * Math.sin(base * 20.0));
    col = lerpRGB(col, lakeCol, lake * 0.85);

    /* 极区冷却壳 */
    var cap = ss(0.72, 0.95, Math.abs(lat));
    col = lerpRGB(col, [82, 76, 78], cap * 0.45);

    /* 灰烬云 */
    var ashCloud = ss(0.56, 0.78, fbm3(nx * 4.2 + 33.0, ny * 4.2 + 8.0, nz * 4.2 + 2.0, 4, seed + 13));
    col = lerpRGB(col, [140, 118, 104], ashCloud * 0.35);

    return col;
  }

  /* ================================================================ 气态巨行星 */
  /* ================================================================ 海洋行星 */
  function shadeOcean(nx, ny, nz, seed) {
    var lat = ny;

    /* 海陆分布：低频噪声决定大陆轮廓 */
    var landN = fbm3(nx * 1.75 + 4.0, ny * 1.75 + 1.0, nz * 1.75 + 7.0, 5, seed + 31);
    var landMask = ss(0.505, 0.565, landN);

    /* 海洋：深浅两层 + 洋流细纹 */
    var sea = fbm3(nx * 3.2 + 9.0, ny * 3.2 + 5.0, nz * 3.2 + 2.0, 4, seed + 71);
    var deep    = [10, 26, 48];
    var mid     = [22, 56, 92];
    var shallow = [40, 100, 132];
    var col = lerpRGB(deep, mid, ss(0.18, 0.72, sea));
    col = lerpRGB(col, shallow, ss(0.70, 0.94, sea) * 0.55);
    /* 低纬海域略亮 */
    col = lerpRGB(col, [32, 92, 124], (1 - ss(0.15, 0.85, Math.abs(lat))) * 0.10);

    /* 大陆：森林绿 → 沙色 → 高原亮 */
    var landVar = fbm3(nx * 4.6 + 2.0, ny * 4.6 + 8.0, nz * 4.6 + 3.0, 4, seed + 101);
    var green = [58, 98, 62];
    var sand  = [166, 148, 104];
    var landCol = lerpRGB(green, sand, ss(0.38, 0.82, landVar));
    landCol = lerpRGB(landCol, [188, 182, 162], ss(0.80, 0.96, landVar) * 0.55);
    /* 大陆边缘偏暗：海岸林 */
    landCol = lerpRGB(landCol, [38, 66, 48], (1 - ss(0.10, 0.42, landMask)) * 0.30);
    col = lerpRGB(col, landCol, landMask * 0.92);

    /* 海岸浅滩：海陆交界的青绿 */
    var coast = ss(0.475, 0.515, landN) * (1 - ss(0.525, 0.575, landN));
    col = lerpRGB(col, [78, 150, 142], coast * 0.55);

    /* 纬向云带 + 涡旋 */
    var belt = fbm3(nx * 1.6 + 11.0, ny * 1.6 + 2.0, nz * 1.6 + 6.0, 4, seed + 131);
    var band = 0.5 + 0.5 * Math.sin(lat * 8.5 + (belt - 0.5) * 2.4);
    var cloudN = fbm3(nx * 3.6 + 5.0, ny * 3.6 + 3.0, nz * 3.6 + 8.0, 4, seed + 151);
    var cloud = ss(0.34, 0.86, cloudN) * ss(0.30, 0.72, band);
    col = lerpRGB(col, [236, 244, 250], cloud * 0.55);

    /* 极冠 */
    var cap = ss(0.74, 0.94, Math.abs(lat));
    col = lerpRGB(col, [234, 244, 252], cap * 0.88);

    /* 细颗粒 */
    var grain = fbm3(nx * 17.0 + 1.0, ny * 17.0 + 7.0, nz * 17.0 + 5.0, 3, seed + 211);
    col = lerpRGB(col, [206, 224, 240], (grain - 0.5) * 0.07);

    return col;
  }

  function shadeGas(nx, ny, nz, seed) {
    var lat = ny;

    /* 湍流扰动经纬度 */
    var tw = fbm3(nx * 2.2 + 9.0, ny * 2.2 + 3.0, nz * 2.2 + 6.0, 4, seed) - 0.5;
    var tw2 = fbm3(nx * 5.5 + 2.0, ny * 5.5 + 11.0, nz * 5.5 + 4.0, 3, seed + 37) - 0.5;

    /* 纬向条带 */
    var band = Math.sin(lat * 17.0 + tw * 3.4 + tw2 * 1.2);
    var band2 = Math.sin(lat * 31.0 + tw * 5.0);

    var cream = [232, 210, 168];
    var gold = [196, 148, 76];
    var rust = [138, 82, 40];
    var umb = [86, 54, 30];
    var pale = [246, 232, 200];

    /* 主条带 */
    var t = 0.5 + 0.5 * band;
    var col = lerpRGB(gold, cream, ss(0.25, 0.85, t));
    col = lerpRGB(col, rust, ss(0.55, 0.15, t) * 0.7);
    col = lerpRGB(col, pale, ss(0.72, 0.98, t) * 0.55);

    /* 细条带纹理 */
    var fine = 0.5 + 0.5 * band2;
    col = lerpRGB(col, umb, (1.0 - fine) * 0.18);

    /* 湍流涡旋 */
    var swirl = fbm3(nx * 8.0 + 5.0, ny * 8.0 + 2.0, nz * 8.0 + 9.0, 3, seed + 71);
    col = lerpRGB(col, cream, ss(0.55, 0.85, swirl) * 0.30);

    /* 大红斑：定位于南半球某经度 */
    var spotLon = 0.95;
    var spotLat = -0.34;
    var lon = Math.atan2(nx, nz);
    var dLon = lon - spotLon;
    while (dLon > Math.PI) dLon -= TAU;
    while (dLon < -Math.PI) dLon += TAU;
    var dx = dLon / 0.42;
    var dy = (lat - spotLat) / 0.19;
    var spotR = Math.sqrt(dx * dx + dy * dy);
    var spotA = 1.0 - ss(0.55, 1.05, spotR);
    if (spotA > 0.002) {
      var spotCol = lerpRGB([146, 58, 32], [206, 104, 62], ss(0.2, 0.9, spotR));
      spotCol = lerpRGB(spotCol, [120, 44, 30], spotA * 0.35);
      col = lerpRGB(col, spotCol, spotA * 0.9);
    }

    /* 极区偏暗偏蓝 */
    var pole = ss(0.55, 0.95, Math.abs(lat));
    col = lerpRGB(col, [92, 108, 128], pole * 0.35);

    return col;
  }

  /* ================================================================ 天王星（冰巨星） */
  /* 真实天王星在可见光下几乎没有特征：均匀的甲烷青、极淡的纬向带、
     极区雾霭、边缘一层明亮的大气雾，以及极少量高对比的甲烷亮云。
     这里的色调偏"青绿 + 淡蓝"，避免做成地球海洋星那样的高对比。 */
  function shadeUranus(nx, ny, nz, seed) {
    var lat = ny;

    /* 极低频的云层起伏：只提供缓慢的明暗呼吸，不形成明显条纹 */
    var haze = fbm3(nx * 1.25 + 4.0, ny * 1.25 + 9.0, nz * 0.275 + 2.0, 4, seed + 11);
    var tone = fbm3(nx * 2.4 + 13.0, ny * 2.4 + 5.0, nz * 0.528 + 7.0, 3, seed + 53);

    /* 极淡的纬向带：振幅压到可见光下的 2~3%，并让扰动更大，
       避免看起来像规则条纹（真实天王星几乎是均匀的青蓝色球） */
    var warp = (haze - 0.5) * 1.8 + (tone - 0.5) * 0.9;
    var band = Math.sin(lat * 8.0 + warp * 3.4) * 0.34 +
               Math.sin(lat * 15.0 + warp * 5.2) * 0.16 +
               Math.sin(lat * 26.0 + warp * 7.0) * 0.07;

    var deep  = [92, 158, 176];    /* 深层偏青 */
    var mid   = [126, 196, 208];
    var pale  = [168, 226, 232];
    var ice   = [206, 244, 246];

    var t = clamp01(0.5 + 0.5 * band);
    var col = lerpRGB(mid, pale, ss(0.18, 0.82, t));
    col = lerpRGB(col, deep, ss(0.42, 0.02, t) * 0.42);
    col = lerpRGB(col, ice, ss(0.86, 1.0, t) * 0.35);

    /* 极区雾霭：98° 轴倾角让极区常常朝向观察者，呈现淡青色亮斑 */
    var cap = ss(0.55, 0.97, Math.abs(lat));
    col = lerpRGB(col, [214, 246, 248], cap * 0.42);
    col = lerpRGB(col, [104, 172, 190], ss(0.80, 1.0, Math.abs(lat)) * 0.16);

    /* 极少见的甲烷亮云：低对比白色团块，只在极高阈值处出现 */
    var cloud = ss(0.66, 0.86, fbm3(nx * 2.9 + 21.0, ny * 2.9 + 11.0, nz * 0.638 + 3.0, 4, seed + 97));
    col = lerpRGB(col, [236, 252, 252], cloud * 0.24);

    /* 边缘雾霭：limb 处偏亮，让球体边缘有一圈柔和的甲烷雾 */
    var limb = 1.0 - ss(0.02, 0.52, nz);
    col = lerpRGB(col, [208, 244, 248], limb * 0.30);

    /* 细颗粒：只给一点点质感，不能形成噪声 */
    var grain = fbm3(nx * 15.0 + 6.0, ny * 15.0 + 2.0, nz * 3.300 + 8.0, 3, seed + 211);
    col = lerpRGB(col, [150, 206, 218], (grain - 0.5) * 0.05);

    return col;
  }


  /* ================================================================ 海洋类地行星（Python） */
  /* 设计目标：特征尺度大、边界清楚——在 30px 直径下仍然读得出"海洋 + 大陆 + 云带 + 极冠" */
  function shadePython(nx, ny, nz, seed) {
    var lat = ny;

    /* 纬度渐变：极地深青 → 赤道亮青绿（规则、无随机斑块） */
    var col = lerpRGB([12, 58, 82], [26, 130, 142], ss(-0.92, 0.58, lat));
    col = lerpRGB(col, [70, 188, 172], ss(0.52, 0.86, lat) * 0.66);

    /* 极低频洋流：只做明暗呼吸 */
    var flow = fbm3(nx * 1.1 + 9.0, ny * 1.1 + 5.0, nz * 1.1 + 2.0, 3, seed + 71);
    col = lerpRGB(col, [46, 162, 150], (flow - 0.5) * 0.30);

    /* 两三条柔和纬向云带 */
    var band = Math.sin(lat * 5.4 + 0.6);
    var cloudN = fbm3(nx * 1.6 + 5.0, ny * 1.6 + 3.0, nz * 1.6 + 8.0, 3, seed + 151);
    col = lerpRGB(col, [246, 252, 255], ss(0.45, 0.95, band) * ss(0.35, 0.78, cloudN) * 0.55);

    /* 极冠 */
    col = lerpRGB(col, [240, 250, 255], ss(0.66, 0.92, Math.abs(lat)) * 0.90);

    /* 边缘雾霭 */
    col = lerpRGB(col, [190, 236, 228], (1 - ss(0.05, 0.55, nz)) * 0.28);

    return col;
  }

  /* ================================================================ 地球 */
  /* 太阳系封面用：在 30~50px 直径下也要读得出「深蓝海 + 绿褐陆 + 白云 + 极冠」。
     大陆用低频噪声给轮廓，海岸线不追求真实，只求一眼可辨。 */
  function shadeEarth(nx, ny, nz, seed) {
    var lat = ny;

    var landN = fbm3(nx * 1.55 + 4.0, ny * 1.55 + 1.0, nz * 0.341 + 7.0, 5, seed + 31);
    var landMask = ss(0.505, 0.575, landN);

    /* 海洋：深海 → 浅海 → 赤道略亮 */
    var sea = fbm3(nx * 3.0 + 9.0, ny * 3.0 + 5.0, nz * 0.660 + 2.0, 4, seed + 71);
    var col = lerpRGB([7, 26, 56], [18, 62, 116], ss(0.16, 0.72, sea));
    col = lerpRGB(col, [34, 104, 158], ss(0.70, 0.95, sea) * 0.60);
    col = lerpRGB(col, [40, 120, 168], (1 - ss(0.12, 0.88, Math.abs(lat))) * 0.14);

    /* 陆地：森林绿 → 沙色 → 高原亮 */
    var landVar = fbm3(nx * 4.2 + 2.0, ny * 4.2 + 8.0, nz * 0.924 + 3.0, 4, seed + 101);
    var landCol = lerpRGB([48, 92, 54], [156, 138, 96], ss(0.40, 0.84, landVar));
    landCol = lerpRGB(landCol, [190, 176, 150], ss(0.82, 0.97, landVar) * 0.50);
    landCol = lerpRGB(landCol, [36, 66, 44], (1 - ss(0.12, 0.44, landMask)) * 0.32);
    col = lerpRGB(col, landCol, landMask * 0.95);

    /* 海岸浅滩 */
    var coast = ss(0.478, 0.512, landN) * (1 - ss(0.522, 0.572, landN));
    col = lerpRGB(col, [86, 158, 146], coast * 0.50);

    /* 云层：大块低频，赤道与中纬更密 */
    var cloudN = fbm3(nx * 2.5 + 11.0, ny * 2.5 + 3.0, nz * 0.550 + 6.0, 4, seed + 131);
    var band = 0.55 + 0.45 * Math.sin(lat * 6.0 + (cloudN - 0.5) * 2.0);
    var cloud = ss(0.44, 0.82, cloudN) * ss(0.25, 0.75, band);
    col = lerpRGB(col, [238, 246, 252], cloud * 0.62);

    /* 极冠 */
    col = lerpRGB(col, [240, 248, 255], ss(0.76, 0.94, Math.abs(lat)) * 0.90);

    /* 细颗粒 */
    var grain = fbm3(nx * 16.0 + 1.0, ny * 16.0 + 7.0, nz * 3.520 + 5.0, 3, seed + 211);
    col = lerpRGB(col, [200, 220, 236], (grain - 0.5) * 0.06);

    return col;
  }

  /* ================================================================ 火星 */
  /* 铁锈红基底 + 大块暗区 + 小而亮的极冠；边缘留一层沙尘雾。 */
  function shadeMars(nx, ny, nz, seed) {
    var lat = ny;

    var surf = fbm3(nx * 2.0 + 3.0, ny * 2.0 + 7.0, nz * 0.440 + 1.0, 5, seed + 17);
    var dark = fbm3(nx * 1.2 + 9.0, ny * 1.2 + 2.0, nz * 0.264 + 5.0, 3, seed + 53);

    var col = lerpRGB([150, 74, 48], [196, 108, 70], ss(0.28, 0.78, surf));
    col = lerpRGB(col, [214, 148, 102], ss(0.78, 0.96, surf) * 0.55);
    /* 大块暗斑 */
    col = lerpRGB(col, [104, 56, 40], ss(0.40, 0.62, dark) * 0.55);
    /* 岩屑颗粒 */
    var grain = fbm3(nx * 9.0 + 5.0, ny * 9.0 + 4.0, nz * 1.980 + 8.0, 4, seed + 111);
    col = lerpRGB(col, [168, 104, 72], (grain - 0.5) * 0.16);

    /* 极冠：小而亮 */
    col = lerpRGB(col, [240, 242, 244], ss(0.86, 0.96, Math.abs(lat)) * 0.92);

    /* 边缘沙尘雾 */
    col = lerpRGB(col, [206, 152, 116], (1 - ss(0.05, 0.50, nz)) * 0.20);

    return col;
  }

  /* ================================================================ 木星 */
  /* 宽纬向条带 + 细条带 + 湍流漩涡 + 大红斑；整体米白偏橙棕。 */
  function shadeJupiter(nx, ny, nz, seed) {
    var lat = ny;

    var tw = fbm3(nx * 2.0 + 9.0, ny * 2.0 + 3.0, nz * 0.440 + 6.0, 4, seed) - 0.5;
    var tw2 = fbm3(nx * 5.0 + 2.0, ny * 5.0 + 11.0, nz * 1.100 + 4.0, 3, seed + 37) - 0.5;

    var band = Math.sin(lat * 13.0 + tw * 3.2 + tw2 * 1.1);
    var band2 = Math.sin(lat * 27.0 + tw * 4.6);

    var cream = [236, 220, 190];
    var pale = [250, 240, 222];
    var gold = [206, 160, 104];
    var rust = [150, 94, 58];
    var umb = [96, 62, 38];

    var t = 0.5 + 0.5 * band;
    var col = lerpRGB(gold, cream, ss(0.22, 0.86, t));
    col = lerpRGB(col, rust, ss(0.58, 0.14, t) * 0.62);
    col = lerpRGB(col, pale, ss(0.74, 0.99, t) * 0.60);

    var fine = 0.5 + 0.5 * band2;
    col = lerpRGB(col, umb, (1.0 - fine) * 0.16);

    var swirl = fbm3(nx * 7.0 + 5.0, ny * 7.0 + 2.0, nz * 1.540 + 9.0, 3, seed + 71);
    col = lerpRGB(col, cream, ss(0.55, 0.86, swirl) * 0.30);

    /* 大红斑：南半球一条暗红涡旋 */
    var spotLon = 0.95, spotLat = -0.32;
    var lon = Math.atan2(nx, nz);
    var dLon = lon - spotLon;
    while (dLon > Math.PI) dLon -= TAU;
    while (dLon < -Math.PI) dLon += TAU;
    var dx = dLon / 0.40, dy = (lat - spotLat) / 0.16;
    var spotR = Math.sqrt(dx * dx + dy * dy);
    var spotA = 1.0 - ss(0.50, 1.0, spotR);
    if (spotA > 0.002) {
      var spotCol = lerpRGB([152, 62, 36], [214, 116, 74], ss(0.2, 0.9, spotR));
      col = lerpRGB(col, spotCol, spotA * 0.92);
    }

    /* 极区偏暗 */
    col = lerpRGB(col, [96, 108, 124], ss(0.62, 0.97, Math.abs(lat)) * 0.30);

    return col;
  }

  /* ================================================================ 土星 */
  /* 淡金奶油色、柔和宽条带，没有大红斑；主要靠一层金色环带识别。 */
  function shadeSaturn(nx, ny, nz, seed) {
    var lat = ny;

    var tw = fbm3(nx * 1.8 + 4.0, ny * 1.8 + 8.0, nz * 0.396 + 2.0, 4, seed) - 0.5;
    var band = Math.sin(lat * 10.0 + tw * 2.6);
    var band2 = Math.sin(lat * 21.0 + tw * 4.0);

    var cream = [240, 226, 190];
    var pale = [252, 244, 220];
    var gold = [224, 200, 148];
    var tan = [196, 166, 112];

    var t = 0.5 + 0.5 * band;
    var col = lerpRGB(gold, cream, ss(0.20, 0.85, t));
    col = lerpRGB(col, tan, ss(0.60, 0.20, t) * 0.50);
    col = lerpRGB(col, pale, ss(0.76, 0.99, t) * 0.55);

    var fine = 0.5 + 0.5 * band2;
    col = lerpRGB(col, tan, (1 - fine) * 0.10);

    /* 极区略微偏冷 */
    col = lerpRGB(col, [206, 196, 168], ss(0.60, 0.96, Math.abs(lat)) * 0.30);

    var grain = fbm3(nx * 12.0 + 3.0, ny * 12.0 + 6.0, nz * 2.640 + 9.0, 3, seed + 131);
    col = lerpRGB(col, [232, 214, 178], (grain - 0.5) * 0.05);

    return col;
  }

  /* ================================================================ 海王星 */
  /* 深蓝球体 + 极淡纬向带 + 少量亮白甲烷云 + 一块大暗斑。 */
  function shadeNeptune(nx, ny, nz, seed) {
    var lat = ny;

    var tw = fbm3(nx * 2.0 + 7.0, ny * 2.0 + 2.0, nz * 0.440 + 5.0, 4, seed) - 0.5;
    var band = Math.sin(lat * 9.0 + tw * 3.0);

    var deep = [44, 82, 176];
    var mid = [68, 118, 218];
    var pale = [112, 160, 238];
    var white = [198, 220, 252];

    var t = 0.5 + 0.5 * band;
    var col = lerpRGB(deep, mid, ss(0.20, 0.80, t));
    col = lerpRGB(col, pale, ss(0.70, 0.98, t) * 0.50);

    /* 亮白云带：少而清晰 */
    var cloud = ss(0.62, 0.85, fbm3(nx * 3.0 + 11.0, ny * 3.0 + 4.0, nz * 0.660 + 8.0, 4, seed + 61));
    col = lerpRGB(col, white, cloud * 0.42);

    /* 大暗斑 */
    var spotLon = 2.1, spotLat = -0.28;
    var lon = Math.atan2(nx, nz);
    var dLon = lon - spotLon;
    while (dLon > Math.PI) dLon -= TAU;
    while (dLon < -Math.PI) dLon += TAU;
    var dx = dLon / 0.34, dy = (lat - spotLat) / 0.15;
    var spotR = Math.sqrt(dx * dx + dy * dy);
    col = lerpRGB(col, [30, 56, 130], (1.0 - ss(0.45, 1.0, spotR)) * 0.72);

    /* 极区甲烷雾 */
    col = lerpRGB(col, [120, 158, 226], ss(0.68, 0.98, Math.abs(lat)) * 0.30);
    col = lerpRGB(col, [110, 150, 224], (1 - ss(0.05, 0.50, nz)) * 0.22);

    return col;
  }

  /* ================================================================ 冷灰岩质世界（C） */
  /* 设计目标：大陨石坑 + 冷灰紫岩层，结构清楚，不靠高频噪声堆细节 */
  function shadeRocky(nx, ny, nz, seed) {
    /* 只取「大坑」这一档：数量少、坑浅、环弱，避免满屏白圈 */
    var list = craterList(seed + 17);
    var relief = 0;
    var CRATER_N = 84;                 /* 大坑 22 + 中坑 62，小坑不用 */
    for (var i = 0; i < CRATER_N && i < list.length; i++) {
      var c = list[i];
      var dot = nx * c.x + ny * c.y + nz * c.z;
      if (dot <= c.cosR) continue;
      var t = Math.acos(dot > 1 ? 1 : dot) / c.r;
      var bowl = -(1 - t * t) * c.depth * (i < 22 ? 0.62 : 0.42);
      var rim = Math.exp(-Math.pow((t - 0.90) / 0.22, 2)) * c.depth * (i < 22 ? 0.50 : 0.32);
      var v0 = bowl + rim;
      if (v0 > relief) relief = v0;
      if (v0 < -relief * 2) relief = v0 * 0.5;
    }

    /* 冷银蓝基底 + 极低频岩层明暗 */
    var rock = fbm3(nx * 1.2 + 3.0, ny * 1.2 + 9.0, nz * 1.2 + 1.0, 3, seed + 101);
    var v = clamp01(0.55 + relief * 0.55 + (rock - 0.5) * 0.26);

    var col = lerpRGB([62, 66, 98], [150, 156, 186], ss(0.10, 0.72, v));
    col = lerpRGB(col, [206, 212, 232], ss(0.80, 1.0, v) * 0.55);
    col = lerpRGB(col, [44, 46, 78], ss(0.30, 0.02, v) * 0.75);

    /* 边缘淡紫，呼应课程色 */
    col = lerpRGB(col, [146, 134, 192], (1 - ss(0.06, 0.60, nz)) * 0.22);

    /* 极区霜白 */
    col = lerpRGB(col, [228, 234, 250], ss(0.74, 0.96, Math.abs(ny)) * 0.50);

    /* 极轻颗粒 */
    var grain = fbm3(nx * 9.0 + 2.0, ny * 9.0 + 6.0, nz * 9.0 + 14.0, 3, seed + 211);
    col = lerpRGB(col, [168, 174, 200], (grain - 0.5) * 0.025);

    return col;
  }

  /* ================================================================ 烘焙圆盘贴图 */
  function bake(kind, size, seed) {
    var cv = document.createElement('canvas');
    cv.width = size;
    cv.height = size;
    var ctx = cv.getContext('2d');
    var img = ctx.createImageData(size, size);
    var d = img.data;
    var c = (size - 1) / 2;
    var shadeMap = {
      ice: shadeIce,
      venus: shadeVenus,
      lava: shadeLava,
      mercury: shadeMercury,
      ocean: shadeOcean,
      gas: shadeGas,
      python: shadePython,
      c: shadeRocky,
      uranus: shadeUranus,
      earth: shadeEarth,
      mars: shadeMars,
      jupiter: shadeJupiter,
      saturn: shadeSaturn,
      neptune: shadeNeptune
    };
    var shade = shadeMap[kind] || shadeGas;

    for (var y = 0; y < size; y++) {
      var ny = (y - c) / c;
      for (var x = 0; x < size; x++) {
        var nx = (x - c) / c;
        var r2 = nx * nx + ny * ny;
        var idx = (y * size + x) * 4;
        if (r2 > 1.0) { d[idx + 3] = 0; continue; }
        var nz = Math.sqrt(1.0 - r2);
        var rgb = shade(nx, ny, nz, seed);
        d[idx] = rgb[0] < 0 ? 0 : (rgb[0] > 255 ? 255 : rgb[0]);
        d[idx + 1] = rgb[1] < 0 ? 0 : (rgb[1] > 255 ? 255 : rgb[1]);
        d[idx + 2] = rgb[2] < 0 ? 0 : (rgb[2] > 255 ? 255 : rgb[2]);
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    /* 收边：把最外圈做 1px 抗锯齿，避免放大后锯齿 */
    ctx.globalCompositeOperation = 'destination-in';
    var g = ctx.createRadialGradient(c, c, c * 0.965, c, c, c + 0.5);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(c, c, c + 1, 0, TAU);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    return cv;
  }


  /* ================================================================ 分片异步烘焙
   * 与 bake() 逐像素结果完全一致，但把行计算切成小块：每帧最多占 6ms，
   * 避免 136px×6 颗在启动时连成 300ms 的长任务（那是"打开时闪一下"的根源）。
   * onReady(canvas) 在所有行算完后调用。 */
  function bakeAsync(kind, size, seed, onReady) {
    var cv = document.createElement('canvas');
    cv.width = size;
    cv.height = size;
    var ctx = cv.getContext('2d');
    var img = ctx.createImageData(size, size);
    var d = img.data;
    var c = (size - 1) / 2;
    var shadeMap = {
      ice: shadeIce,
      venus: shadeVenus,
      lava: shadeLava,
      mercury: shadeMercury,
      ocean: shadeOcean,
      gas: shadeGas,
      python: shadePython,
      c: shadeRocky,
      uranus: shadeUranus,
      earth: shadeEarth,
      mars: shadeMars,
      jupiter: shadeJupiter,
      saturn: shadeSaturn,
      neptune: shadeNeptune
    };
    var shade = shadeMap[kind] || shadeGas;
    var y = 0;
    var now = (window.performance && performance.now) ? function () { return performance.now(); } : function () { return Date.now(); };

    function finish() {
      ctx.putImageData(img, 0, 0);
      /* 收边：最外圈 1px 抗锯齿 */
      ctx.globalCompositeOperation = 'destination-in';
      var g = ctx.createRadialGradient(c, c, c * 0.965, c, c, c + 0.5);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(c, c, c + 1, 0, TAU);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      if (onReady) { try { onReady(cv); } catch (e) { console.warn('[planet] bakeAsync callback failed', e); } }
    }

    function step() {
      var t0 = now();
      do {
        var ny = (y - c) / c;
        var row = y * size;
        for (var x = 0; x < size; x++) {
          var nx = (x - c) / c;
          var r2 = nx * nx + ny * ny;
          var idx = (row + x) * 4;
          if (r2 > 1.0) { d[idx + 3] = 0; continue; }
          var nz = Math.sqrt(1.0 - r2);
          var rgb = shade(nx, ny, nz, seed);
          d[idx] = rgb[0] < 0 ? 0 : (rgb[0] > 255 ? 255 : rgb[0]);
          d[idx + 1] = rgb[1] < 0 ? 0 : (rgb[1] > 255 ? 255 : rgb[1]);
          d[idx + 2] = rgb[2] < 0 ? 0 : (rgb[2] > 255 ? 255 : rgb[2]);
          d[idx + 3] = 255;
        }
        y++;
      } while (y < size && (now() - t0) < 6);
      if (y < size) requestAnimationFrame(step);
      else finish();
    }

    requestAnimationFrame(step);
  }

  /* ================================================================ 绘制 */
  /* 土星式暖色环：多条明暗细环叠出的层次感 */
  var RING_STOPS_DEFAULT = [
    [0.00, 'rgba(176,158,120,0.00)'],
    [0.06, 'rgba(206,188,150,0.86)'],
    [0.18, 'rgba(220,203,166,0.96)'],
    [0.36, 'rgba(232,216,182,1.00)'],
    [0.52, 'rgba(216,199,164,0.96)'],
    [0.57, 'rgba(166,150,120,0.40)'],
    [0.63, 'rgba(208,192,158,0.92)'],
    [0.82, 'rgba(202,186,152,0.82)'],
    [0.92, 'rgba(172,157,126,0.42)'],
    [1.00, 'rgba(140,127,102,0.00)']
  ];

  var RING_STOPS_URANUS = [
    [0.00, 'rgba(160,200,210,0.00)'],
    [0.03, 'rgba(176,214,222,0.30)'],
    [0.07, 'rgba(120,158,172,0.10)'],
    [0.10, 'rgba(206,236,240,0.44)'],
    [0.13, 'rgba(140,178,190,0.09)'],
    [0.17, 'rgba(170,206,214,0.16)'],
    [0.21, 'rgba(120,158,172,0.06)'],
    [0.42, 'rgba(198,230,236,0.26)'],
    [0.45, 'rgba(130,168,180,0.07)'],
    [0.68, 'rgba(216,242,246,0.34)'],
    [0.71, 'rgba(130,168,180,0.06)'],
    [0.88, 'rgba(190,224,230,0.18)'],
    [1.00, 'rgba(160,196,206,0.00)']
  ];

  function ringParams(p, r) {
    var cfg = p.ringCfg || {};
    return {
      inner: r * (cfg.inner == null ? 1.42 : cfg.inner),
      outer: r * (cfg.outer == null ? 2.56 : cfg.outer),
      squash: cfg.squash == null ? 0.30 : cfg.squash,
      tilt: cfg.tilt == null ? (p.ringTilt || 0) : cfg.tilt,
      alpha: cfg.alpha == null ? 1 : cfg.alpha,
      shade: cfg.shade == null ? 1 : cfg.shade,
      stops: cfg.stops || (p.kind === 'uranus' ? RING_STOPS_URANUS : RING_STOPS_DEFAULT)
    };
  }

  function drawRing(ctx, x, y, r, p, lightAng, front) {
    var prm = ringParams(p, r);
    var tilt = prm.tilt;
    var inner = prm.inner;
    var outer = prm.outer;
    var squashY = prm.squash;

    var a0, a1;
    if (front) { a0 = 0; a1 = Math.PI; }
    else { a0 = Math.PI; a1 = TAU; }

    ctx.save();
    ctx.globalAlpha = prm.alpha;
    ctx.translate(x, y);
    ctx.rotate(tilt);
    ctx.scale(1, squashY);

    function path() {
      ctx.beginPath();
      ctx.arc(0, 0, outer, a0, a1);
      ctx.arc(0, 0, inner, a1, a0, true);
      ctx.closePath();
    }

    /* 多条明暗细环组成的径向渐变 */
    var g = ctx.createRadialGradient(0, 0, inner, 0, 0, outer);
    for (var i = 0; i < prm.stops.length; i++) g.addColorStop(prm.stops[i][0], prm.stops[i][1]);

    path();
    ctx.fillStyle = g;
    ctx.fill();

    /* 朝恒星一侧被照亮，另一侧压暗 */
    ctx.save();
    path();
    ctx.clip();
    var lit = 0.5 + 0.5 * Math.cos(lightAng - tilt);
    lit = Math.min(0.90, Math.max(0.10, lit));
    var lg = ctx.createLinearGradient(-outer, 0, outer, 0);
    lg.addColorStop(0, 'rgba(6,10,18,' + (0.60 * prm.shade).toFixed(3) + ')');
    lg.addColorStop(lit, 'rgba(255,246,224,' + (0.15 * prm.shade).toFixed(3) + ')');
    lg.addColorStop(1, 'rgba(6,10,18,' + (0.50 * prm.shade).toFixed(3) + ')');
    ctx.fillStyle = lg;
    ctx.fillRect(-outer, -outer, outer * 2, outer * 2);
    ctx.restore();

    ctx.restore();
  }

  /* 一颗行星可以挂多颗卫星；只写 moon:true 的老配置视为一颗默认卫星 */
  var MOON_DEFAULT = [
    { a: 2.90, size: 0.150, speed: 0.55, phase: 0.4, color: '#cfd8e2', hi: '#eef4fb', dark: '#232a34' }
  ];
  function moonsOf(p) {
    if (p.moons && p.moons.length) return p.moons;
    if (p.moon) return MOON_DEFAULT;
    return null;
  }

  /**
   * 画一颗卫星（按轨道角度分前后半程，后半程在球体前、前半程在球体后）
   * @param {Object} m { a 轨道半径(×行星半径), size 半径(×行星半径), speed, phase, color, hi, dark, squash }
   */
  function drawMoon(ctx, x, y, r, t, lightAng, m, front) {
    var ax = r * (m.a || 2.6);
    var az = ax * (m.squash === undefined ? 0.36 : m.squash);
    var a = t * (m.speed || 0.5) + (m.phase || 0);
    var mx = x + Math.cos(a) * ax;
    var my = y + Math.sin(a) * az;
    if ((Math.sin(a) > 0) !== front) return;
    var mr = Math.max(0.9, r * (m.size || 0.12));
    var lx = mx + Math.cos(lightAng) * mr * 0.55;
    var ly = my + Math.sin(lightAng) * mr * 0.55;
    var g = ctx.createRadialGradient(lx, ly, 0, mx, my, mr);
    g.addColorStop(0, m.hi || '#e2eaf4');
    g.addColorStop(0.62, m.color || '#8894a2');
    g.addColorStop(1, m.dark || '#1e242c');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, TAU);
    ctx.fill();
  }

  function drawMoons(ctx, x, y, r, t, lightAng, p, front) {
    var ms = moonsOf(p);
    if (!ms) return;
    for (var i = 0; i < ms.length; i++) {
      drawMoon(ctx, x, y, r, t, lightAng, ms[i], front);
    }
  }

  /**
   * 画一颗行星
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x, y      屏幕坐标
   * @param {number} r         半径
   * @param {Object} p         hub 提供的行星配置（含 tex / kind / 颜色）
   * @param {Object} env       { lightAngle, time, hot }
   */
  function draw(ctx, x, y, r, p, env) {
    var lightAng = env.lightAngle;
    var t = env.time;
    var hot = env.hot;

    /* ---- 1 · 外层大气辉光（尺寸固定，悬停不扩散） ---- */
    var ga = ctx.createRadialGradient(x, y, r * 0.92, x, y, r * 2.7);
    ga.addColorStop(0, p.atmo);
    ga.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ga;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.7, 0, TAU);
    ctx.fill();

    /* ---- 2 · 环 / 卫星（后半） ---- */
    if (p.ringColor) drawRing(ctx, x, y, r, p, lightAng, false);
    drawMoons(ctx, x, y, r, t, lightAng, p, false);

    /* ---- 3 · 本体 ---- */
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.clip();

    if (p.tex) {
      if (p.spinAxis) {
        /* 自转轴倾斜：整张球面贴图绕视轴旋转，让极区朝向侧面
           （天王星 98° 轴倾角，视觉上"躺着"自转） */
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.spinAxis);
        ctx.drawImage(p.tex, -r, -r, r * 2, r * 2);
        ctx.restore();
      } else {
        ctx.drawImage(p.tex, x - r, y - r, r * 2, r * 2);
      }
    } else {
      /* 贴图尚未生成时的降级 */
      ctx.fillStyle = p.color;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }

    /* 光照：朝恒星的一侧明显提亮，背侧压暗 */
    var lx = x + Math.cos(lightAng) * r * 0.55;
    var ly = y + Math.sin(lightAng) * r * 0.55;
    var lg = ctx.createRadialGradient(lx, ly, r * 0.02, x, y, r * 1.46);
    lg.addColorStop(0, 'rgba(255,250,238,' + (hot ? 0.30 : 0.22) + ')');
    lg.addColorStop(0.40, 'rgba(255,240,218,0.045)');
    lg.addColorStop(0.72, 'rgba(5,9,16,0.34)');
    lg.addColorStop(1, 'rgba(2,4,9,0.66)');
    ctx.fillStyle = lg;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);

    /* 大气边缘散射：与球心同心的窄亮环，只落在边缘一圈，
       渐变等值线不会横穿球面留下弧线 */
    var rimG = ctx.createRadialGradient(x, y, r * 0.70, x, y, r * 1.02);
    rimG.addColorStop(0, 'rgba(0,0,0,0)');
    rimG.addColorStop(0.50, 'rgba(0,0,0,0)');
    rimG.addColorStop(0.88, p.rimColor);
    rimG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rimG;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);

    ctx.restore();

    /* ---- 4 · 环 / 卫星（前半） ---- */
    if (p.ringColor) drawRing(ctx, x, y, r, p, lightAng, true);
    drawMoons(ctx, x, y, r, t, lightAng, p, true);

    /* ---- 5 · 悬停高亮环 ---- */
    if (hot) {
      var pulse = 0.5 + 0.5 * Math.sin(t * 3.0);
      ctx.beginPath();
      ctx.arc(x, y, r + 5 + pulse * 7, 0, TAU);
      ctx.strokeStyle = p.colorHot;
      ctx.globalAlpha = 0.30 * pulse;
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  global.Planets = {
    bake: bake,
    bakeAsync: bakeAsync,
    draw: draw
  };
})(window);
