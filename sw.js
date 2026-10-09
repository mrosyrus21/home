// Fresh documents, reusable static delivery assets. Never intercept writes/Firebase.
const CACHE = 'hg-cache-20261008193000';
const PHOTO_CACHE = 'hg-plant-photos-v1';
const STATIC_CACHE = 'hg-static-v1';
const REFRESH_PARAM = 'hg-refresh';
const REFRESH_STAMP = '20261008193000';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => ![PHOTO_CACHE, STATIC_CACHE, CACHE].includes(k)).map(k => caches.delete(k)));
    await self.clients.claim();
    // Pages compare build stamps on controllerchange. Do not navigate/reload a
    // fresh first visit just because the worker has taken control.
  })());
});
self.addEventListener('message', (e) => { if(e.data === 'skipWaiting') self.skipWaiting(); });

async function cachedAsset(req, name) {
  let cache;
  try {
    cache = await caches.open(name);
    const saved = await cache.match(req);
    if(saved) return saved;
  } catch (_) {}
  const fresh = await fetch(req);
  if(fresh.ok && cache) {
    try { await cache.put(req, fresh.clone()); } catch (_) {}
  }
  return fresh;
}
async function freshDocument(req) {
  try {
    const fresh = await fetch(req, {cache:'no-store'});
    if(fresh.ok) {
      try { const cache = await caches.open(CACHE); await cache.put(req, fresh.clone()); } catch (_) {}
      return fresh;
    }
    const saved = await caches.match(req);
    return saved || fresh;
  } catch (err) {
    const saved = await caches.match(req);
    if(saved) return saved;
    throw err;
  }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  // External fonts/weather/SDKs use their normal HTTP policies. Database/auth
  // requests never enter app caches, regardless of their response or URL.
  if(url.origin !== self.location.origin) return;
  if(url.pathname.endsWith('/sw.js') || url.searchParams.has('hg-build-check')) {
    e.respondWith(fetch(req, {cache:'no-store'}));
    return;
  }
  if(/\/(?:plant-photos|plant-photo-previews)\/\d{4}-\d{2}-\d{2}\/[^/]+\.(jpe?g|png|webp)$/i.test(url.pathname)) {
    e.respondWith(cachedAsset(req, PHOTO_CACHE));
    return;
  }
  if(url.pathname.includes('/dayarc-assets/optimized-v1/')) {
    e.respondWith(cachedAsset(req, STATIC_CACHE));
    return;
  }
  if(/\.(?:jpe?g|png|webp|gif|svg|ico|woff2?)$/i.test(url.pathname)
      || (/\.(?:js|css)$/i.test(url.pathname) && url.searchParams.has('v'))) {
    e.respondWith(cachedAsset(req, CACHE));
    return;
  }
  e.respondWith(freshDocument(req));
});
