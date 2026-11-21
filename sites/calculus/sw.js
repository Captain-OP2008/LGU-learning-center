/* =====================================================================
 * sw.js · 微积分学习站 离线缓存
 * 策略：网络优先（network-first）+ 缓存兜底。
 *   - 同源 GET 一律先请求网络，成功后顺手更新缓存；
 *   - 网络失败时用 caches.match(..., {ignoreSearch:true}) 兜底，
 *     这样 data/ch01.js?v=20261112p1 也能命中缓存里的 data/ch01.js；
 *   - 只有页面导航（request.mode === 'navigate'）才回退到 index.html，
 *     缺图 / 缺脚本时不会把 HTML 当成 JS 返回；
 *   - activate 清掉所有旧版本缓存；页面侧检测到新 SW 会提示刷新。
 * 只处理同源 GET；file:// 双击打开时浏览器不注册 SW，本来就地离线可用。
 * ===================================================================== */
const VERSION = 'calculus-20261121n8';
const CORE = [
  './index.html',
  './manifest.webmanifest',
  '../../shared/css/app.css',
  '../../shared/css/observatory.css',
  '../../shared/css/pages-reference.css',
  '../../shared/css/pages-tools.css',
  '../../shared/css/pages-advanced.css',
  './assets/math.css',
  './assets/observatory.js',
  './assets/math.js',
  './assets/app.js',
  './assets/motion.js',
  './assets/viz.js',
  './assets/labs.js',
  './assets/quiz.js',
  './assets/exam.js',
  './assets/calc.js',
  '../../shared/mathjax/es5/tex-svg.js',
  '../../shared/fonts/Jura-Light.ttf',
  '../../shared/fonts/Jura-Medium.ttf',
  '../../shared/fonts/Jura-Bold.ttf',
  '../../shared/fonts/RobotoMono-Light.ttf',
  '../../shared/fonts/RobotoMono-Regular.ttf',
  '../../shared/icons/favicon.svg',
  './assets/logo.svg',
  '../../shared/icons/icon-192.png',
  '../../shared/icons/icon-512.png',
  '../../shared/icons/icon-maskable-512.png',
  './data/index.js',
  './data/site.js',
  './data/ch00.js',
  './data/ch01.js',
  './data/ch02.js',
  './data/ch03.js',
  './data/ch04.js',
  './data/ch05.js',
  './data/ch06.js',
  './data/ch07.js',
  './data/ch08.js',
  './data/ch09.js',
  './data/ch10.js',
  './data/ch11.js',
  './data/ch12.js',
  './data/ch13.js',
  './data/ch14.js',
  './data/ch15.js',
  './data/ch16.js',
  './data/ch17.js',
  './data/ch18.js',
  './data/ch19.js',
  './data/quiz.js',
  './data/exam.js',
  './data/cheatsheet.js',
  './data/glossary.js',
  './data/pitfalls.js',
  './data/deps.js',
  './data/adv-analysis.js',
  './data/adv-proof.js',
  './data/adv-numeric.js',
  './data/adv-challenge.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => Promise.all(CORE.map((u) => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => {
      return caches.match(req, { ignoreSearch: true }).then((hit) => {
        if (hit) return hit;
        if (req.mode === 'navigate') return caches.match('./index.html', { ignoreSearch: true });
        return Response.error();
      });
    })
  );
});
