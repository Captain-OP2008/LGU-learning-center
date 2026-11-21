/* =====================================================================
 * hub.js · 深空观测台 · 主控（2026-11-12 改版）
 * ---------------------------------------------------------------------
 * 1) 计算布局，驱动 WebGL 天体层与 Canvas2D 轨道层
 * 2) 点火序列（首次 3.1s / 之后 1.4s，可任意键跳过）
 * 3) 交互：视差、观测十字、行星命中与悬停放大、滚轮视场
 * 4) HUD：真实数据（课程 / 章节 / 题目 / 模拟卷）+ 跨课搜索 + 使用说明
 * 5) 静止模式 / prefers-reduced-motion：停主循环，只渲染一帧静态星图
 * 6) PWA：http(s) 下注册 sw.js、安装为应用、离线状态提示
 * 7) 字体：首屏只有 Jura Light，其余字重在 window load 后注入
 *
 * 数据来源：assets/hub-index.js（普通 <script> 引入，file:// 双击可用）。
 * 索引缺失时：统计保留静态兜底，搜索入口隐藏，其余功能不受影响。
 * ===================================================================== */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var rootEl = doc.documentElement;

  /* ------------------------------------------------------------ DOM */
  var skyCv = doc.getElementById('sky');
  var orbCv = doc.getElementById('orbits');
  var ignition = doc.getElementById('ignition');
  var ignBar = doc.getElementById('ignBar');
  var ignPct = doc.getElementById('ignPct');
  var ignLbl = doc.getElementById('ignLbl');
  var crosshair = doc.getElementById('crosshair');
  var curtain = doc.getElementById('curtain');

  var idxDateEl = doc.getElementById('idxDate');
  var netTextEl = doc.getElementById('netText');
  var netStateEl = doc.getElementById('netState');
  var netLed = netStateEl ? netStateEl.querySelector('.led') : null;

  var searchBtn = doc.getElementById('searchBtn');
  var helpBtn = doc.getElementById('helpBtn');
  var staticBtn = doc.getElementById('staticBtn');
  var installBtn = doc.getElementById('installBtn');

  var statCoursesEl = doc.getElementById('statCourses');
  var statChaptersEl = doc.getElementById('statChapters');
  var statQuizEl = doc.getElementById('statQuiz');
  var statExamsEl = doc.getElementById('statExams');
  var hudCoursesEl = doc.getElementById('hudCourses');
  var hudChaptersEl = doc.getElementById('hudChapters');
  var hudQuizEl = doc.getElementById('hudQuiz');
  var hudExamsEl = doc.getElementById('hudExams');
  var hintEl = doc.getElementById('hint');

  var searchDlg = doc.getElementById('searchDlg');
  var searchClose = doc.getElementById('searchClose');
  var srInput = doc.getElementById('srInput');
  var srHint = doc.getElementById('srHint');
  var srResults = doc.getElementById('srResults');
  var srEmpty = doc.getElementById('srEmpty');
  var srCount = doc.getElementById('srCount');

  var helpDlg = doc.getElementById('helpDlg');
  var helpClose = doc.getElementById('helpClose');

  var toastEl = doc.getElementById('toast');
  var toastMsg = doc.getElementById('toastMsg');
  var toastAct = doc.getElementById('toastAct');
  var toastClose = doc.getElementById('toastClose');

  var reduceMotion = !!(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ------------------------------------------------------------ 太阳系配置
   * 门户首页是太阳系的俯视示意图：太阳居中，八大行星按真实顺序由内向外。
   * 轨道半径与行星直径做了视觉压缩（真实比例下内行星会挤成一点、外行星
   * 会飞出屏幕），但顺序、颜色与相对大小关系保持真实。
   *   a      轨道半径（相对太阳半径的倍数）
   *   size   行星半径（相对太阳半径的倍数）
   *   speed  公转角速度（rad/s，按真实公转周期压缩到可观察范围）
   *   kind   交给 planet.js 的程序化贴图类型
   */
  var PLANETS = [
    {
      id: 'mercury', no: '01', en: 'MERCURY', short: '水星', zh: '水星',
      color: '#b9b2a6', colorDim: 'rgba(185,178,166,.30)', colorHot: '#e2dccf',
      lit: '#efe8dc', dark: '#4a443c', ring: 'rgba(185,178,166,.40)',
      glow: 'rgba(180,172,158,.16)', glowSoft: 'rgba(140,132,118,.05)',
      trail: 'rgba(185,178,166,.20)',
      a: 1.15, squash: 0.380, tilt: -0.160, speed: 0.113, phase: 0.40, size: 0.044,
      kind: 'mercury', seed: 1207,
      atmo: 'rgba(176,170,162,.10)',
      rimColor: 'rgba(212,206,196,.40)',
      moon: false
    },
    {
      id: 'venus', no: '02', en: 'VENUS', short: '金星', zh: '金星',
      color: '#e8cf9a', colorDim: 'rgba(232,207,154,.32)', colorHot: '#fff2cf',
      lit: '#fff4d8', dark: '#5c4a28', ring: 'rgba(232,207,154,.42)',
      glow: 'rgba(238,210,152,.22)', glowSoft: 'rgba(200,168,110,.06)',
      trail: 'rgba(232,207,154,.24)',
      a: 1.30, squash: 0.380, tilt: -0.160, speed: 0.075, phase: 2.10, size: 0.064,
      kind: 'venus', seed: 3311,
      atmo: 'rgba(238,210,152,.24)',
      rimColor: 'rgba(255,240,200,.60)',
      moon: false
    },
    {
      id: 'earth', no: '03', en: 'EARTH', short: '地球', zh: '地球',
      color: '#7fc4e8', colorDim: 'rgba(127,196,232,.34)', colorHot: '#d8f2ff',
      lit: '#eaf8ff', dark: '#123a52', ring: 'rgba(127,196,232,.46)',
      glow: 'rgba(110,190,240,.26)', glowSoft: 'rgba(70,140,200,.07)',
      trail: 'rgba(127,196,232,.26)',
      a: 1.46, squash: 0.380, tilt: -0.160, speed: 0.060, phase: 3.60, size: 0.068,
      kind: 'earth', seed: 5601,
      atmo: 'rgba(150,214,255,.28)',
      rimColor: 'rgba(210,240,255,.65)',
      moons: [
        { a: 2.9, size: 0.15, speed: 0.55, phase: 0.4, color: '#a8b0ba', hi: '#eef4fb', dark: '#232a34' }
      ]
    },
    {
      id: 'mars', no: '04', en: 'MARS', short: '火星', zh: '火星',
      color: '#d06a44', colorDim: 'rgba(208,106,68,.32)', colorHot: '#ffb08a',
      lit: '#ffd9c0', dark: '#4a1a10', ring: 'rgba(208,106,68,.42)',
      glow: 'rgba(220,110,70,.24)', glowSoft: 'rgba(180,80,50,.06)',
      trail: 'rgba(208,106,68,.26)',
      a: 1.63, squash: 0.380, tilt: -0.160, speed: 0.045, phase: 5.20, size: 0.050,
      kind: 'mars', seed: 7707,
      atmo: 'rgba(226,146,102,.16)',
      rimColor: 'rgba(250,190,150,.46)',
      moons: [
        { a: 1.75, size: 0.1, speed: 1.05, phase: 1.1, color: '#9a8a78', hi: '#d8cbb8', dark: '#2a241c' },
        { a: 2.25, size: 0.085, speed: 0.68, phase: 3.6, color: '#8d7f6e', hi: '#cbbca8', dark: '#241f18' }
      ]
    },
    {
      id: 'jupiter', no: '05', en: 'JUPITER', short: '木星', zh: '木星',
      color: '#e0b583', colorDim: 'rgba(224,181,131,.30)', colorHot: '#ffeccb',
      lit: '#ffefd4', dark: '#4a3018', ring: 'rgba(224,181,131,.40)',
      glow: 'rgba(226,186,136,.24)', glowSoft: 'rgba(180,140,90,.06)',
      trail: 'rgba(224,181,131,.26)',
      a: 1.92, squash: 0.380, tilt: -0.160, speed: 0.020, phase: 1.20, size: 0.155,
      kind: 'jupiter', seed: 8821,
      atmo: 'rgba(238,206,166,.22)',
      rimColor: 'rgba(255,238,206,.52)',
      moons: [
        { a: 1.45, size: 0.07, speed: 0.95, phase: 0.3, color: '#e6d9b0', hi: '#fff6da', dark: '#3a3226' },
        { a: 1.72, size: 0.062, speed: 0.78, phase: 2.2, color: '#dde4e8', hi: '#f6fbff', dark: '#2a3038' },
        { a: 2.02, size: 0.08, speed: 0.6, phase: 4.1, color: '#c9b69c', hi: '#f0e4d2', dark: '#332a20' },
        { a: 2.34, size: 0.068, speed: 0.46, phase: 5.4, color: '#9b928a', hi: '#d8d2c8', dark: '#26221e' }
      ]
    },
    {
      id: 'saturn', no: '06', en: 'SATURN', short: '土星', zh: '土星',
      color: '#ead9a8', colorDim: 'rgba(234,217,168,.32)', colorHot: '#fff6d8',
      lit: '#fff5d8', dark: '#54482a', ring: 'rgba(234,217,168,.44)',
      glow: 'rgba(236,218,168,.24)', glowSoft: 'rgba(190,170,120,.06)',
      trail: 'rgba(234,217,168,.26)',
      a: 2.18, squash: 0.380, tilt: -0.160, speed: 0.013, phase: 4.40, size: 0.138,
      kind: 'saturn', seed: 9931,
      ringColor: 'rgba(232,214,170,.72)',
      ringCfg: { inner: 1.24, outer: 2.28, squash: 0.360, tilt: -0.160, alpha: 1.00, shade: 0.40 },
      atmo: 'rgba(244,228,190,.18)',
      rimColor: 'rgba(255,246,220,.52)',
      moons: [
        { a: 2.75, size: 0.075, speed: 0.34, phase: 2.6, color: '#d6c296', hi: '#f6ead0', dark: '#3a3020' }
      ]
    },
    {
      id: 'uranus', no: '07', en: 'URANUS', short: '天王星', zh: '天王星',
      color: '#9fe0e6', colorDim: 'rgba(159,224,230,.32)', colorHot: '#e6fdff',
      lit: '#eafdff', dark: '#1a4048', ring: 'rgba(159,224,230,.42)',
      glow: 'rgba(146,224,234,.22)', glowSoft: 'rgba(100,180,190,.06)',
      trail: 'rgba(159,224,230,.24)',
      a: 2.42, squash: 0.380, tilt: -0.160, speed: 0.008, phase: 0.90, size: 0.096,
      kind: 'uranus', seed: 7301,
      spinAxis: -1.45,
      atmo: 'rgba(146,224,234,.16)',
      rimColor: 'rgba(200,246,250,.50)',
      ringColor: 'rgba(160,206,216,.45)',
      ringCfg: { inner: 1.55, outer: 1.95, squash: 0.300, tilt: -0.160, alpha: 0.7, shade: 0.3 },
      moons: [
        { a: 2.45, size: 0.06, speed: 0.46, phase: 1, color: '#b8c6cf', hi: '#e6eef4', dark: '#2a3238' }
      ]
    },
    {
      id: 'neptune', no: '08', en: 'NEPTUNE', short: '海王星', zh: '海王星',
      color: '#6f9be8', colorDim: 'rgba(111,155,232,.34)', colorHot: '#cfe0ff',
      lit: '#dce9ff', dark: '#122a5c', ring: 'rgba(111,155,232,.44)',
      glow: 'rgba(100,140,232,.26)', glowSoft: 'rgba(60,90,180,.07)',
      trail: 'rgba(111,155,232,.26)',
      a: 2.64, squash: 0.380, tilt: -0.160, speed: 0.006, phase: 2.80, size: 0.092,
      kind: 'neptune', seed: 6617,
      atmo: 'rgba(120,160,240,.22)',
      rimColor: 'rgba(190,214,255,.50)',
      moons: [
        { a: 2.35, size: 0.065, speed: 0.42, phase: 3.8, color: '#aebfd0', hi: '#dce8f4', dark: '#2a303a' }
      ]
    }
  ];

  /* ------------------------------------------------------------ 跨课索引 */
  var INDEX = (window.HUB_INDEX && typeof window.HUB_INDEX === 'object') ? window.HUB_INDEX : null;

  var STATS_FALLBACK = { courses: 66, chapters: 582, quiz: 5181, exams: 76 };
  var STATS = (function () {
    var s = (INDEX && INDEX.stats) || {};
    return {
      courses: s.courses || STATS_FALLBACK.courses,
      chapters: s.chapters || STATS_FALLBACK.chapters,
      quiz: s.quiz || STATS_FALLBACK.quiz,
      exams: s.exams || STATS_FALLBACK.exams
    };
  })();

  function pad2(n) { n = Number(n) || 0; return (n < 10 ? '0' : '') + n; }
  function setText(el, v) { if (el) el.textContent = v; }
  function fmtDate(s) {
    if (!s) return '--';
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s));
    return m ? m[1] + '.' + m[2] + '.' + m[3] : String(s);
  }

  /* HUD 读数全部来自索引；索引缺失时保留 HTML 里的静态兜底数字 */
  function applyStats() {
    setText(statCoursesEl, STATS.courses);
    setText(statChaptersEl, STATS.chapters);
    setText(statQuizEl, STATS.quiz);
    setText(statExamsEl, STATS.exams);
    setText(hudCoursesEl, pad2(STATS.courses));
    setText(hudChaptersEl, STATS.chapters);
    setText(hudQuizEl, STATS.quiz);
    setText(hudExamsEl, STATS.exams);
    setText(idxDateEl, fmtDate(INDEX && INDEX.generatedAt));
    if (srHint) {
      srHint.textContent = '输入关键词即时过滤：' + STATS.chapters + ' 章 · ' + STATS.exams + ' 套模拟卷';
    }
  }
  applyStats();

  /* ------------------------------------------------------------ 状态 */
  var S = {
    W: 1, H: 1, dpr: 1,
    cx: 0, cy: 0, r: 100,
    aperture: 1, apertureTarget: 1,
    pointer: { x: 0, y: 0 },
    pointerPx: { x: -999, y: -999 },
    time: 0,
    reveal: 0,
    orbitProgress: 0,
    hover: -1,
    fps: 0,
    live: false
  };

  var seen = false;
  try { seen = localStorage.getItem('obs.hub.seen') === '1'; } catch (e) { seen = false; }

  /* 静止模式：localStorage 优先；没有记录时跟随系统「减少动态效果」 */
  var STATIC_KEY = 'hub.static';
  var storedStatic = null;
  try { storedStatic = localStorage.getItem(STATIC_KEY); } catch (e) { storedStatic = null; }
  var staticMode = storedStatic === '1' || (storedStatic !== '0' && reduceMotion);

  var BOOT_DUR = reduceMotion || staticMode ? 1 : (seen ? 1500 : 3200);
  var bootStart = performance.now();
  var leaving = false;

  /* ------------------------------------------------------------ 工具 */
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ------------------------------------------------------------ 轻提示 */
  var toastTimer = 0;
  function hideToast() {
    clearTimeout(toastTimer);
    if (toastEl) toastEl.hidden = true;
  }
  function showToast(msg, actLabel, actFn, ms) {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = msg;
    if (toastAct) {
      if (actLabel) {
        toastAct.hidden = false;
        toastAct.textContent = actLabel;
        toastAct.onclick = function () { hideToast(); if (typeof actFn === 'function') actFn(); };
      } else {
        toastAct.hidden = true;
        toastAct.onclick = null;
      }
    }
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, ms || 7000);
  }
  if (toastClose) toastClose.addEventListener('click', hideToast);

  /* ------------------------------------------------------------ 字体：延迟加载 */
  /* 首屏只声明 Jura Light（hub.css 内联 @font-face + <link preload>）。
     Jura Medium(500)、RobotoMono Light(300)/Regular(400) 在 window load 后注入，
     让 486KB 字体不阻塞首屏；注入后视觉与原来完全一致（font-display:swap）。 */
  function loadLateFonts() {
    if (doc.getElementById('lateFonts')) return;
    var css =
      "@font-face{font-family:'Jura';src:url('shared/fonts/Jura-Medium.ttf') format('truetype');" +
        "font-weight:500;font-style:normal;font-display:swap}" +
      "@font-face{font-family:'RobotoMono';src:url('shared/fonts/RobotoMono-Light.ttf') format('truetype');" +
        "font-weight:300;font-style:normal;font-display:swap}" +
      "@font-face{font-family:'RobotoMono';src:url('shared/fonts/RobotoMono-Regular.ttf') format('truetype');" +
        "font-weight:400;font-style:normal;font-display:swap}";
    var st = doc.createElement('style');
    st.id = 'lateFonts';
    st.textContent = css;
    doc.head.appendChild(st);
  }
  if (doc.readyState === 'complete') setTimeout(loadLateFonts, 0);
  else window.addEventListener('load', function () { setTimeout(loadLateFonts, 0); });

  /* ------------------------------------------------------------ 初始化：天体 */
  /* WebGL 天体初始化要编译着色器 + 预渲染银河，约 80~120ms。
     若在首帧前同步执行，点火序列的第一帧会被顶住，观感像"闪/卡一下"。
     因此先让幕布绘制出来，再在下一帧初始化天空。 */
  var sky = null;
  function initSky() {
    try {
      sky = new Sky(skyCv);
      if (!sky.ok) {
        console.warn('[sky] WebGL 初始化失败：', sky.err);
        body.classList.add('no-gl');
        sky = null;
      }
    } catch (e) {
      console.warn('[sky] 异常：', e);
      body.classList.add('no-gl');
      sky = null;
    }
    /* 静止模式在天空就绪前就渲染过一帧；这里补一次真正的静态星图 */
    if (staticMode) renderStill();
  }
  var orb = new Orbits(orbCv);

  /* ---- 行星贴图：优先读缓存；缺失时在启动幕布遮住的后段逐帧烘焙 ----
   * 每颗 136px 贴图逐像素计算约 30~50ms，若在启动动画期间连续烘焙会掉帧，
   * 所以：1) 结果写入 localStorage，第二次打开直接复用；2) 首次加载把烘焙
   * 安排在点火序列后段（幕布尚未揭开），主界面出现时贴图已就绪。 */
  var PLANET_TEX_SIZE = 136;
  var TEX_KEY_PREFIX = 'obs.tex.v6.';
  function texKey(c) { return TEX_KEY_PREFIX + c.kind + '.' + c.seed + '.' + PLANET_TEX_SIZE; }

  (function loadPlanetTextures() {
    if (typeof Planets === 'undefined') return;
    var pending = [];
    PLANETS.forEach(function (c) {
      var cached = null;
      try { cached = localStorage.getItem(texKey(c)); } catch (e) { cached = null; }
      if (cached) {
        try {
          var img = new Image();
          img.decoding = 'async';
          img.onload = function () { c.tex = img; };
          img.onerror = function () { pending.push(c); scheduleBake(); };
          img.src = cached;
          return;
        } catch (e) { /* 落到烘焙分支 */ }
      }
      pending.push(c);
    });
    if (!pending.length) return;
    scheduleBake();

    var bakeStarted = false;
    function scheduleBake() {
      if (bakeStarted || !pending.length) return;
      bakeStarted = true;
      var i = 0;
      function next() {
        var c = pending[i++];
        if (!c) return;
        var cooked = Planets.bakeAsync ? Planets.bakeAsync : null;
        if (!cooked) { next(); return; }
        cooked(c.kind, PLANET_TEX_SIZE, c.seed, function (cv) {
          c.tex = cv;
          /* 写缓存放到下一帧，避免 toDataURL 的同步开销压在同一帧 */
          setTimeout(function () {
            try { localStorage.setItem(texKey(c), cv.toDataURL('image/png')); } catch (e2) {}
          }, 0);
          next();
        });
      }
      /* 让幕布先绘制两帧，再开始分片烘焙 */
      requestAnimationFrame(function () { requestAnimationFrame(next); });
    }
  })();

  var renderScale = 1;
  var renderScaleCap = 1;

  /* 幕布先绘制，再初始化天空（避免首帧被 WebGL 初始化顶住） */
  if (window.requestAnimationFrame) requestAnimationFrame(function () { initSky(); });
  else initSky();

  function measure() {
    S.W = Math.max(320, window.innerWidth);
    S.H = Math.max(320, window.innerHeight);
    S.dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* 超采样：1×屏幕也做 1.25 倍 SSAA，让恒星表面细节更锐利 */
    var dpr = window.devicePixelRatio || 1;
    var base = Math.min(Math.max(dpr, 1.25), 1.75);
    var budget = 3400000;
    var px = S.W * S.H * base * base;
    if (px > budget) base *= Math.sqrt(budget / px);
    renderScaleCap = clamp(base, 0.55, 1.75);
    renderScale = renderScaleCap;

    if (sky) sky.resize(S.W, S.H, renderScale);
    orb.resize(S.W, S.H, S.dpr);
    computeCore();
    if (staticMode) renderStill();
  }

  /* 天体在屏幕上的位置与半径 */
  function computeCore() {
    /* 左侧是标题 / 导语 / 统计，太阳系占右侧圆窗；窄屏时改为居中。
       半径按最外轨道（海王星 a=2.64，加上半颗行星≈2.70）与画布内边距反算，
       保证整圈轨道都在视口内；垂直方向还要除以轨道压扁系数 squash=0.38。 */
    var W = S.W, H = S.H;
    var wide = (W > 900 && W / H > 1.05);
    var cx, cy, r;
    if (wide) {
      cx = W * 0.605;
      cy = H * 0.470;
      r = Math.min(H * 0.300, (W * 0.995 - cx) / 2.70, (cy - 40) / (2.70 * 0.380));
    } else {
      /* 窄屏：文字在上、太阳系在下，留出安全间距；
         最外层行星允许略微出屏，太阳可以画得更大一点 */
      cx = W * 0.5;
      cy = H * 0.615;
      r = Math.min(W * 0.5 / 2.55, (cy - 80) / (2.70 * 0.380),
        (H - cy - 90) / (2.70 * 0.380), H * 0.235);
    }
    S.cx = cx;
    S.cy = cy;
    S.r = r;

    /* WebGL 降级时用 CSS 变量画渐变天体 */
    var st = rootEl.style;
    st.setProperty('--core-x', cx + 'px');
    st.setProperty('--core-y', cy + 'px');
    st.setProperty('--core-r', (r * 2) + 'px');
  }

  /* ------------------------------------------------------------ 火苗 / 耀斑 */
  var flareStart = -1e9;
  var flareNext = 4200 + Math.random() * 5000;
  var flareAmp = 0;
  var FLARE_MS = 2100;

  function currentFlare(now) {
    if (now - bootStart < BOOT_DUR * 0.5) return 0.35;
    if (now > flareNext) {
      flareStart = now;
      flareAmp = 0.55 + Math.random() * 0.45;
      flareNext = now + 6200 + Math.random() * 9000;
    }
    var k = (now - flareStart) / FLARE_MS;
    if (k < 0 || k > 1) return 0.05;
    return Math.sin(k * Math.PI) * flareAmp;
  }

  /* ------------------------------------------------------------ 交互 */
  function setHover(i) {
    if (S.hover === i) return;
    S.hover = i;
    body.style.cursor = i >= 0 ? 'pointer' : '';
    if (crosshair) crosshair.classList.toggle('is-hot', i >= 0);
  }

  function skipBoot() {
    if (S.live && bootStart === -1e9) return;
    bootStart = performance.now() - BOOT_DUR * 2;
  }

  function markLive() {
    if (S.live) return;
    S.live = true;
    body.classList.add('is-live');
    if (rootEl) rootEl.setAttribute('data-state', 'live');
    if (ignition) ignition.classList.add('done');
    try { localStorage.setItem('obs.hub.seen', '1'); } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------------ 四色幕布过场 */
  /* 与三个子站同一套转场：斜切四色幕布压屏后再导航。
     子站是 hash 路由（压屏→换内容→离场），门户是真实页面跳转，
     所以压屏动画结束后直接进入目标页，由目标页自己的启动序列接棒。 */
  function navigate(href) {
    if (!href || leaving) return;
    leaving = true;

    if (reduceMotion || staticMode || !curtain) {
      setTimeout(function () { window.location.href = href; }, 40);
      return;
    }

    curtain.classList.remove('out');
    curtain.classList.add('on', 'in');
    /* .46s 动画结束 + 100ms 停留：确保幕布已完全覆盖并被真实绘制后再导航，
       避免"滑到一半就跳走"的瞬闪。 */
    setTimeout(function () { window.location.href = href; }, 560);
  }

  /* ------------------------------------------------------------ 对话框 */
  function dlgOpen(d) {
    if (!d) return false;
    try {
      if (typeof d.showModal === 'function') { d.showModal(); return true; }
    } catch (e) { /* 已打开等情况，落到属性兜底 */ }
    d.setAttribute('open', '');
    return true;
  }
  function dlgClose(d) {
    if (!d) return;
    try {
      if (typeof d.close === 'function' && d.open) { d.close(); return; }
    } catch (e) { /* ignore */ }
    d.removeAttribute('open');
  }
  function dlgIsOpen(d) { return !!(d && (d.open || d.hasAttribute('open'))); }

  /* 点遮罩关闭（.dlgPanel 之外的区域，target 就是 dialog 本身） */
  [searchDlg, helpDlg].forEach(function (d) {
    if (!d) return;
    d.addEventListener('click', function (e) {
      if (e.target === d) dlgClose(d);
    });
  });

  /* ------------------------------------------------------------ 使用说明 */
  if (helpBtn) {
    helpBtn.addEventListener('click', function () { dlgOpen(helpDlg); });
  }
  if (helpClose) {
    helpClose.addEventListener('click', function () { dlgClose(helpDlg); });
  }

  /* ------------------------------------------------------------ 跨课搜索 */
  var searchEntries = [];
  var searchAvailable = false;
  var activeIdx = -1;
  var MAX_RESULTS = 60;

  (function buildSearch() {
    if (!INDEX || !INDEX.search || !INDEX.search.length) return;

    var courseMeta = {};
    (INDEX.courses || []).forEach(function (c) {
      courseMeta[c.id] = {
        dir: c.dir || c.id,
        cn: c.name || '',
        short: c.short || '',
        en: c.en || ''
      };
    });

    INDEX.search.forEach(function (s) {
      if (!s || !s.h) return;
      var cm = courseMeta[s.c] || {};
      var dir = cm.dir || s.c;
      var isExam = s.h === 'exam';
      var label = isExam ? '模拟卷' : (s.n ? 'ch' + s.n : s.h);
      var hay = [
        cm.cn || s.cn, s.t, s.e, s.p, s.b, label, s.h,
        cm.short, cm.en, isExam ? '模拟卷 试卷 exam mock' : ''
      ].join(' ').toLowerCase();

      searchEntries.push({
        cn: s.cn || cm.cn || s.c,
        label: label,
        t: s.t || '',
        e: s.e || '',
        hay: hay,
        href: 'sites/' + dir + '/index.html#/' + s.h
      });
    });

    searchAvailable = searchEntries.length > 0 && !!(searchDlg && srInput && srResults);
    if (!searchAvailable) return;

    if (searchBtn) searchBtn.hidden = false;
    if (hintEl) hintEl.textContent = '按 / 跨课搜索 · 全部课程在右上角';
  })();

  /* 索引缺失：隐藏搜索入口，其余功能照常 */
  if (!searchAvailable && searchBtn) searchBtn.hidden = true;
  if (!searchAvailable && hintEl) hintEl.textContent = '全部课程在右上角';

  function clearActive(items) {
    for (var i = 0; i < items.length; i++) items[i].classList.remove('is-active');
    if (srInput) srInput.removeAttribute('aria-activedescendant');
  }

  function setActive(items, idx) {
    if (!items.length) return;
    activeIdx = idx;
    clearActive(items);
    var el = items[activeIdx];
    if (!el) return;
    el.classList.add('is-active');
    if (srInput) srInput.setAttribute('aria-activedescendant', el.id);
    if (el.scrollIntoView) {
      try { el.scrollIntoView({ block: 'nearest' }); } catch (e) { el.scrollIntoView(false); }
    }
  }

  function renderResults() {
    if (!searchAvailable) return;
    var q = (srInput.value || '').trim().toLowerCase();
    var tokens = q ? q.split(/\s+/).filter(Boolean) : [];

    while (srResults.firstChild) srResults.removeChild(srResults.firstChild);
    activeIdx = -1;
    if (srInput) srInput.removeAttribute('aria-activedescendant');

    if (!tokens.length) {
      srResults.hidden = true;
      if (srEmpty) srEmpty.hidden = true;
      if (srCount) srCount.textContent = '';
      return;
    }

    var matched = [];
    for (var i = 0; i < searchEntries.length; i++) {
      var en = searchEntries[i];
      var ok = true, score = 0;
      for (var k = 0; k < tokens.length; k++) {
        var pos = en.hay.indexOf(tokens[k]);
        if (pos < 0) { ok = false; break; }
        /* 标题/英文名命中优先，其余字段次之 */
        score += (en.t.toLowerCase().indexOf(tokens[k]) >= 0 ||
                  en.e.toLowerCase().indexOf(tokens[k]) >= 0) ? 0 : 1;
      }
      if (!ok) continue;
      matched.push({ e: en, s: score });
    }
    matched.sort(function (a, b) { return a.s - b.s; });

    var shown = matched.length > MAX_RESULTS ? matched.slice(0, MAX_RESULTS) : matched;

    if (!matched.length) {
      srResults.hidden = true;
      if (srEmpty) srEmpty.hidden = false;
      if (srCount) srCount.textContent = '共 0 条';
      return;
    }

    if (srEmpty) srEmpty.hidden = true;
    if (srCount) {
      srCount.textContent = '共 ' + matched.length + ' 条' +
        (matched.length > MAX_RESULTS ? ' · 显示前 ' + MAX_RESULTS + ' 条' : '');
    }

    var frag = doc.createDocumentFragment();
    shown.forEach(function (item, n) {
      var e = item.e;
      var li = doc.createElement('li');
      var a = doc.createElement('a');
      a.className = 'srItem';
      a.id = 'sr-' + n;
      a.href = e.href;
      a.title = e.t + (e.e ? ' · ' + e.e : '');

      var c = doc.createElement('span');
      c.className = 'srCourse';
      c.textContent = e.cn;
      var sep = doc.createElement('span');
      sep.className = 'srSep';
      sep.textContent = '·';
      var t = doc.createElement('span');
      t.className = 'srTitle';
      t.textContent = e.label + ' ' + e.t;

      a.appendChild(c); a.appendChild(sep); a.appendChild(t);
      li.appendChild(a);
      frag.appendChild(li);
    });
    srResults.appendChild(frag);
    srResults.hidden = false;
  }

  function openSearch() {
    if (!searchAvailable) return;
    dlgOpen(searchDlg);
    setTimeout(function () {
      if (srInput) { srInput.focus(); srInput.select(); }
    }, 30);
  }

  if (searchAvailable) {
    if (searchBtn) searchBtn.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', function () { dlgClose(searchDlg); });
    srInput.addEventListener('input', renderResults);

    srInput.addEventListener('keydown', function (e) {
      var items = srResults.querySelectorAll('a.srItem');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!items.length) return;
        e.preventDefault();
        var next = e.key === 'ArrowDown'
          ? (activeIdx + 1) % items.length
          : (activeIdx - 1 + items.length) % items.length;
        setActive(items, next);
      } else if (e.key === 'Enter') {
        if (activeIdx >= 0 && items[activeIdx]) {
          e.preventDefault();
          var href = items[activeIdx].getAttribute('href');
          dlgClose(searchDlg);
          navigate(href);
        }
      }
    });

    /* 点击结果：走与课程卡一致的幕布转场 */
    srResults.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a.srItem') : null;
      if (!a) return;
      e.preventDefault();
      var href = a.getAttribute('href');
      dlgClose(searchDlg);
      navigate(href);
    });

    if (searchDlg) {
      searchDlg.addEventListener('close', function () {
        activeIdx = -1;
        if (srInput) srInput.removeAttribute('aria-activedescendant');
      });
    }
  }

  /* ------------------------------------------------------------ 静止模式 */
  function renderStill() {
    if (!S.W || !S.H) return;
    var rPx = S.r;
    S.reveal = 1;
    S.orbitProgress = 1;
    S.aperture = 1;

    if (sky) {
      try {
        sky.render({
          time: 0,
          pointer: { x: 0, y: 0 },
          reveal: 1,
          core: {
            x: (S.cx - S.W * 0.5) / S.H,
            y: -(S.cy - S.H * 0.5) / S.H
          },
          radius: rPx / S.H,
          flare: 0.32
        });
      } catch (e) { console.warn('[sky] 静态渲染异常：', e); }
    }

    try {
      orb.layout(S.cx, S.cy, rPx, PLANETS);
      orb.draw({
        time: 0,
        reveal: 1,
        orbitProgress: 1,
        hover: -1,
        active: -1,
        pointer: { x: 0, y: 0 }
      });
    } catch (e) { console.warn('[orbits] 静态渲染异常：', e); }
  }

  function applyStatic(on, quiet) {
    staticMode = !!on;
    body.classList.toggle('static', staticMode);
    if (staticBtn) staticBtn.setAttribute('aria-pressed', staticMode ? 'true' : 'false');

    if (staticMode) {
      stopLoop();
      S.time = 0;
      renderStill();
      markLive();
    } else {
      startLoop();
    }
    if (!quiet) {
      showToast(staticMode
        ? '已进入静止模式：恒星与轨道保持静态（设置已保存）'
        : '已恢复动态观测');
    }
  }

  function toggleStatic() {
    try { localStorage.setItem(STATIC_KEY, staticMode ? '0' : '1'); } catch (e) { /* ignore */ }
    applyStatic(!staticMode);
  }
  if (staticBtn) staticBtn.addEventListener('click', toggleStatic);

  /* 系统「减少动态效果」变化：用户没有显式选择时跟随系统 */
  if (window.matchMedia) {
    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var onMqChange = function () {
      var stored = null;
      try { stored = localStorage.getItem(STATIC_KEY); } catch (e) { stored = null; }
      if (stored === '1' || stored === '0') return;
      applyStatic(mqReduce.matches, true);
    };
    if (mqReduce.addEventListener) mqReduce.addEventListener('change', onMqChange);
    else if (mqReduce.addListener) mqReduce.addListener(onMqChange);
  }

  /* ------------------------------------------------------------ 在线状态 */
  function updateNet() {
    var online = navigator.onLine !== false;
    var isFile = window.location.protocol === 'file:';
    if (netTextEl) netTextEl.textContent = isFile ? 'LOCAL' : (online ? 'ONLINE' : 'OFFLINE');
    if (netLed) {
      netLed.style.background = online ? '' : '#c82337';
      netLed.style.boxShadow = online ? '' : '0 0 6px rgba(200,35,55,.9)';
    }
    if (netStateEl) netStateEl.title = isFile ? '以本地文件打开' : (online ? '网络可用' : '当前离线');
  }
  updateNet();
  window.addEventListener('online', function () {
    updateNet();
    showToast('网络已恢复');
  });
  window.addEventListener('offline', function () {
    updateNet();
    showToast('已进入离线模式 · 已缓存的页面与题库仍可打开');
  });

  /* ------------------------------------------------------------ PWA */
  var isHttp = window.location.protocol === 'http:' || window.location.protocol === 'https:';
  var hadController = !!(navigator.serviceWorker && navigator.serviceWorker.controller);

  if (isHttp && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        if (reg.waiting) {
          showToast('门户有新版本可用', '刷新', function () { window.location.reload(); });
        }
        reg.addEventListener('updatefound', function () {
          var sw = reg.installing;
          if (!sw) return;
          sw.addEventListener('statechange', function () {
            if (sw.state === 'installed' && navigator.serviceWorker.controller) {
              showToast('门户已更新，刷新后生效', '刷新', function () { window.location.reload(); });
            }
          });
        });
      }).catch(function () { /* file:// 或隐私模式：静默降级 */ });
    });

    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (hadController) {
        showToast('缓存已更新', '刷新', function () { window.location.reload(); });
      }
      hadController = true;
    });
  }

  /* 安装为应用 */
  var deferredPrompt = null;
  function hideInstall() { if (installBtn) installBtn.hidden = true; }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.hidden = false;
  });
  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    hideInstall();
    showToast('已安装为应用');
  });
  if (installBtn) {
    installBtn.addEventListener('click', function () {
      if (!deferredPrompt) {
        showToast('可在浏览器菜单里选择「安装应用」或「添加到主屏幕」', null, null, 9000);
        return;
      }
      var p = deferredPrompt;
      deferredPrompt = null;
      hideInstall();
      try {
        p.prompt();
        if (p.userChoice && p.userChoice.then) {
          p.userChoice.then(function () { /* 用户选择后无需提示 */ });
        }
      } catch (e) { /* ignore */ }
    });
  }
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) hideInstall();

  /* ------------------------------------------------------------ 事件绑定 */
  doc.addEventListener('pointermove', function (e) {
    body.classList.add('has-pointer');
    S.pointerPx.x = e.clientX;
    S.pointerPx.y = e.clientY;
    S.pointer.x = (e.clientX / S.W) * 2 - 1;
    S.pointer.y = -((e.clientY / S.H) * 2 - 1);

    if (crosshair) {
      crosshair.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
    }

    if (!S.live || staticMode) return;
    var idx = orb.hitTest(e.clientX, e.clientY);
    setHover(idx);
  }, { passive: true });

  doc.addEventListener('pointerleave', function () {
    setHover(-1);
  });

  doc.addEventListener('click', function (e) {
    /* 启动中：任意点击只跳过 */
    if (!S.live) { skipBoot(); return; }
  });

  doc.addEventListener('keydown', function (e) {
    var t = e.target;
    var typing = !!(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' ||
      t.tagName === 'SELECT' || t.isContentEditable));
    var dlgOpenNow = dlgIsOpen(searchDlg) || dlgIsOpen(helpDlg);

    if (!S.live) {
      if (e.key === 'Tab') return;          /* 保留键盘可达性 */
      skipBoot();
      return;
    }

    /* 非原生 dialog 的 Esc 兜底 */
    if (e.key === 'Escape' && dlgOpenNow) {
      if (dlgIsOpen(searchDlg)) dlgClose(searchDlg);
      if (dlgIsOpen(helpDlg)) dlgClose(helpDlg);
      return;
    }
    if (dlgOpenNow) return;

    /* / 或 Ctrl/⌘+K 打开搜索 */
    if (searchAvailable && !typing) {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openSearch();
        return;
      }
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openSearch();
        return;
      }
    }

    if (typing) return;
  });

  window.addEventListener('wheel', function (e) {
    if (!S.live || leaving || staticMode) return;
    if (dlgIsOpen(searchDlg) || dlgIsOpen(helpDlg)) return;
    S.apertureTarget = clamp(S.apertureTarget - e.deltaY * 0.0011, 0.76, 1.34);
  }, { passive: true });

  var rsz;
  window.addEventListener('resize', function () {
    clearTimeout(rsz);
    rsz = setTimeout(function () { measure(); }, 110);
  });
  window.addEventListener('orientationchange', function () {
    setTimeout(function () { measure(); }, 240);
  });

  /* ------------------------------------------------------------ 主循环 */
  var rafId = 0;
  var running = false;
  var lastNow = 0;
  var fpsAcc = 0, fpsN = 0, fpsCool = 0;

  function bootProgress(now) {
    var e = now - bootStart;
    var p = clamp(e / BOOT_DUR, 0, 1);
    return {
      p: p,
      reveal: clamp(e / (BOOT_DUR * 0.40), 0, 1),
      zoom: 1 + 0.62 * (1 - easeOutCubic(clamp(e / (BOOT_DUR * 0.58), 0, 1))),
      orbit: clamp((e - BOOT_DUR * 0.24) / (BOOT_DUR * 0.58), 0, 1),
      live: e > BOOT_DUR * 0.30
    };
  }

  function frame(now) {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    if (!lastNow) lastNow = now;
    var dt = Math.min(0.05, (now - lastNow) / 1000);
    lastNow = now;
    S.time += dt;

    var bs = bootProgress(now);
    S.reveal = bs.reveal;
    S.orbitProgress = bs.orbit;

    if (bs.live) markLive();

    /* 启动遮罩进度 */
    if (ignition && !S.live) {
      if (ignBar) ignBar.style.transform = 'scaleX(' + bs.p.toFixed(3) + ')';
      if (ignPct) ignPct.textContent = (bs.p * 100 < 10 ? '0' : '') + Math.round(bs.p * 100);
      if (ignLbl) {
        ignLbl.textContent = bs.p < 0.28 ? 'ACQUIRING TARGET'
          : bs.p < 0.55 ? 'LOCKING ORBIT'
          : bs.p < 0.82 ? 'CALIBRATING OPTICS'
          : 'SIGNAL LOCKED';
      }
    }

    /* 视场平滑 */
    S.aperture = lerp(S.aperture, S.apertureTarget, Math.min(1, dt * 5.5));

    var rPx = S.r * bs.zoom * S.aperture;

    /* —— WebGL 天体 —— */
    if (sky) {
      sky.render({
        time: S.time,
        pointer: S.pointer,
        reveal: S.reveal,
        core: {
          x: (S.cx - S.W * 0.5) / S.H,
          y: -(S.cy - S.H * 0.5) / S.H
        },
        radius: rPx / S.H,
        flare: currentFlare(now)
      });
    }

    /* —— 2D 轨道 —— */
    orb.layout(S.cx, S.cy, rPx, PLANETS);
    orb.draw({
      time: S.time,
      reveal: S.reveal,
      orbitProgress: S.orbitProgress,
      hover: S.hover,
      active: -1,
      pointer: S.pointer
    });

    /* —— 帧率与自适应降采样（只用于画质，不再显示 FPS） —— */
    fpsAcc += dt;
    fpsN++;
    if (fpsN >= 24) {
      S.fps = Math.round(fpsN / fpsAcc);
      fpsAcc = 0;
      fpsN = 0;
      fpsCool -= 1;
      if (sky && S.live) {
        /* 自适应分辨率：加大阈值间隔 + 更长的冷却，避免在临界帧率来回抖动 */
        if (S.fps > 0 && S.fps < 34 && renderScale > 0.55 && fpsCool <= 0) {
          renderScale = Math.max(0.5, renderScale * 0.85);
          sky.resize(S.W, S.H, renderScale);
          fpsCool = 8;
        } else if (S.fps > 58 && renderScale < renderScaleCap && fpsCool <= 0) {
          renderScale = Math.min(renderScaleCap, renderScale * 1.04);
          sky.resize(S.W, S.H, renderScale);
          fpsCool = 14;
        }
      }
    }
  }

  function startLoop() {
    if (running || staticMode || doc.hidden) return;
    running = true;
    lastNow = 0;
    rafId = requestAnimationFrame(frame);
  }
  function stopLoop() {
    running = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  }

  doc.addEventListener('visibilitychange', function () {
    if (doc.hidden) stopLoop();
    else if (!staticMode) startLoop();
  });

  /* ------------------------------------------------------------ 启动 */
  measure();

  if (staticMode) {
    bootStart = performance.now() - BOOT_DUR * 2;
    /* 走统一入口：补上 body.static、aria-pressed、静态首帧与 markLive */
    applyStatic(true, true);
  } else {
    rafId = requestAnimationFrame(frame);
    running = true;
  }

  if (reduceMotion && !staticMode) {
    bootStart = performance.now() - BOOT_DUR * 2;
    markLive();
  }

  /* 首帧后设置一次 CSS 变量，确保 no-gl 降级位置正确 */
  setTimeout(function () { measure(); }, 60);

  /* 调试/自动化接口（不影响正常使用） */
  window.__OBS = {
    S: S,
    orb: orb,
    planets: PLANETS,
    index: INDEX,
    stats: STATS,
    /* sky 在下一帧才初始化，用 getter 保证拿到当前实例 */
    get sky() { return sky; },
    isStatic: function () { return staticMode; },
    setStatic: function (on) { applyStatic(on, true); }
  };
})();
