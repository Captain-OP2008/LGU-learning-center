/* =====================================================================
 * sw.js · 深空观测台 · Service Worker
 * ---------------------------------------------------------------------
 * 只在 http(s) 下注册（file:// 双击打开时 hub.js 会跳过注册）。
 * 策略：
 *   - 安装时预缓存门户骨架（CORE）与首屏字体；
 *   - 页面导航：network-first，断网回退缓存的 index.html；
 *   - 其它同源 GET：network-first，失败时 ignoreSearch 回退缓存
 *     （版本号 ?v=20261112p1 变化时也能命中旧缓存，保证离线可用）。
 *
 * 改动门户资源后：同步改 CACHE 里的 stamp（与 index.html 的 ?v= 一致），
 * 新 SW 激活时会清掉旧版本缓存。
 * ===================================================================== */

var STAMP = '20261122n1';
var CACHE = 'hub-' + STAMP;

/* 预缓存清单：check-hub.js 会逐条核对文件是否存在 */
var CORE = [
  'index.html',
  'manifest.webmanifest',
  'assets/hub.css',
  'assets/hub.js',
  'assets/hub-index.js',
  'assets/sky.js',
  'assets/planet.js',
  'assets/orbits.js',
  'courses.html',
  'assets/catalog.css',
  'assets/catalog.js',
  'assets/courses-data.js',
  'assets/favicon.svg',
  'shared/icons/icon-192.png',
  'shared/icons/icon-512.png',
  'shared/icons/icon-maskable-512.png',
  'shared/fonts/Jura-Light.ttf',
  'shared/fonts/Jura-Medium.ttf',
  'shared/fonts/RobotoMono-Light.ttf',
  'shared/fonts/RobotoMono-Regular.ttf'
];

/* ------------------------------------------------------------ install */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      /* 逐条缓存：单个文件缺失不阻断整个安装 */
      return Promise.all(CORE.map(function (path) {
        return cache.add(new Request(path, { cache: 'reload' })).catch(function () {
          /* 缺文件时跳过，离线时该资源自然回退到网络失败 */
        });
      }));
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* ------------------------------------------------------------ activate */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE && key.indexOf('hub-') === 0) return caches.delete(key);
        return null;
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ------------------------------------------------------------ message */
self.addEventListener('message', function (event) {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

/* ------------------------------------------------------------ fetch */
self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;

  /* 页面导航：network-first → 缓存 index.html */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (cache) { cache.put('index.html', copy); });
        }
        return res;
      }).catch(function () {
        return caches.match('index.html', { ignoreSearch: true }).then(function (hit) {
          if (hit) return hit;
          return new Response('离线状态：门户尚未缓存，请先联网打开一次。', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });
      })
    );
    return;
  }

  /* 其它同源 GET：network-first，失败回退缓存（忽略 ?v= 查询串） */
  event.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok && res.type === 'basic') {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || Response.error();
      });
    })
  );
});
