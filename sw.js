const CACHE='hg-v88';
const SHELL=['./','./index.html','./recipes.html','./data.js','./recipes.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./dayarc.css','./dayarc.js'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==location.origin) return; // never intercept Firebase / fonts / external images
  const isHTML = req.mode==='navigate' || (req.headers.get('accept')||'').includes('text/html');
  if(isHTML){
    e.respondWith(
      fetch(req).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put('./index.html',cp)); return r; })
                .catch(()=>caches.match('./index.html').then(m=>m||caches.match('./')))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(cached=>{
      const net=fetch(req).then(r=>{ if(r&&r.status===200){ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); } return r; }).catch(()=>cached);
      return cached || net;
    })
  );
});
