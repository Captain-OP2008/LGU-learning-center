/* =====================================================================
 * sw.js · Service Worker（仅在 http/https 下生效，file:// 双击打开时自动跳过）
 * 策略：network-first（保证内容更新即时生效），断网时回退缓存，做到离线可学。
 * 预缓存核心文件；其余访问过的资源在拿到第一次响应后写入缓存。
 * ===================================================================== */
var CACHE = 'c-20261122n4';
/* 注意：data/ch00.js … ch09.js 必须全部列在这里。
 * 章节正文是运行时用 <script> 注入的，若漏掉，断网后会显示「这一章还没准备好」。 */
var CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  '../../shared/icons/favicon.svg',
  '../../shared/icons/icon-192.png',
  '../../shared/icons/icon-512.png',
  '../../shared/icons/icon-maskable-512.png',
  '../../shared/css/app.css',
  '../../shared/css/observatory.css',
  '../../shared/css/pages-reference.css',
  '../../shared/css/pages-tools.css',
  '../../shared/css/pages-features.css',
  '../../shared/css/pages-projects.css',
  '../../shared/css/pages-advanced.css',
  '../../shared/css/pages-widgets.css',
  './assets/observatory.js',
  './assets/app.js',
  './assets/motion.js',
  './assets/quiz.js',
  './assets/exam.js',
  './assets/projects.js',
  '../../shared/fonts/Jura-Light.ttf',
  '../../shared/fonts/Jura-Medium.ttf',
  '../../shared/fonts/Jura-Bold.ttf',
  '../../shared/fonts/RobotoMono-Light.ttf',
  '../../shared/fonts/RobotoMono-Regular.ttf',
  './data/site.js',
  './data/index.js',
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
  './data/quiz.js',
  './data/exam.js',
  './data/projects.js'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      var failed = [];
      return Promise.all(CORE.map(function (u) {
        return c.add(u).catch(function () { failed.push(u); }); /* 单个失败不影响整体 */
      })).then(function () {
        if (failed.length) {
          console.warn('[SW] 预缓存失败 ' + failed.length + ' 项（离线时不可用）：' + failed.join(', '));
        }
      });
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () {
      return self.clients.claim();
    }).then(function () {
      /* 新版本接管后通知已打开的页面：可刷新加载新版 */
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
        for (var i = 0; i < list.length; i++) {
          try { list[i].postMessage({ type: 'sw:updated', cache: CACHE }); } catch (err) {}
        }
      });
    })
  );
});

function cachePut(req, res) {
  if (!res || !res.ok) return;
  var copy = res.clone();
  caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    fetch(req).then(function (res) {
      cachePut(req, res);
      return res;
    }).catch(function () {
      /* 断网：先用缓存（忽略 ?v= 查询串），再回退 index.html */
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('离线且未缓存：' + req.url, { status: 504, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      });
    })
  );
});
