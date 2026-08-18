const C='camino-v2';
const SHELL=['./','./index.html','./manifest.webmanifest',
 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C)
 .then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys()
 .then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 if(e.request.method!=='GET')return;
 if(u.hostname.endsWith('open-meteo.com')){e.respondWith(fetch(e.request)
  .then(r=>{const c2=r.clone();caches.open(C).then(c=>c.put(e.request,c2));return r})
  .catch(()=>caches.match(e.request)));return}
 if(/tile|cartocdn|opentopomap/.test(u.hostname)){e.respondWith(caches.match(e.request)
  .then(h=>h||fetch(e.request).then(r=>{const c2=r.clone();caches.open(C).then(c=>c.put(e.request,c2));return r})
  .catch(()=>new Response('',{status:504}))));return}
 e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).catch(()=>caches.match('./index.html'))))});