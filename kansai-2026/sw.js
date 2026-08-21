/* 离线缓存 v2
   关键修正：HTML 和 JS 改成「网络优先」，避免页面框架被永久缓存成旧版。
   地图瓦片和天气仍然缓存，山里没信号照样能用。 */
const C = 'kansai-2026-v2';
const SHELL = [
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(C)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
      .then(() => self.skipWaiting())          // 立刻接管，不等旧版退出
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 页面与脚本：网络优先，拿到就更新缓存；断网才回落缓存
  const isDoc = req.mode === 'navigate'
    || /\.(html|js|webmanifest)$/.test(url.pathname)
    || url.pathname.endsWith('/');
  if (isDoc && url.origin === location.origin) {
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(req, cp)); return r; })
        .catch(() => caches.match(req).then(h => h || caches.match('./index.html')))
    );
    return;
  }
  // 天气 API：网络优先，失败回落缓存
  if (url.hostname.endsWith('open-meteo.com')) {
    e.respondWith(
      fetch(req).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(req, cp)); return r; })
        .catch(() => caches.match(req))
    );
    return;
  }
  // 地图瓦片与第三方库：缓存优先，看过的区域离线可用
  e.respondWith(
    caches.match(req).then(h => h || fetch(req).then(r => {
      const cp = r.clone(); caches.open(C).then(c => c.put(req, cp)); return r;
    }).catch(() => new Response('', { status: 504 })))
  );
});
