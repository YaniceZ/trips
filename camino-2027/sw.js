/* japow 离线缓存 — 山上没信号也能开 */
const C='camino-v1';
const SHELL=['./','./index.html','./manifest.webmanifest',
 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  // 天气 API：网络优先，失败回缓存
  if(u.hostname.endsWith('open-meteo.com')){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r})
      .catch(()=>caches.match(e.request)));return}
  // 地图瓦片：缓存优先，看过的区域离线还能看
  if(/tile|cartocdn|opentopomap/.test(u.hostname)){
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
      const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>new Response('',{status:504}))));return}
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).catch(()=>caches.match('./index.html'))))});
