// sw.js — fresh app files, reusable original plant photos.
// App files stay network-first so deploys show up. Dated plant photos are
// unchanged originals and can be reused without downloading them every visit.
const CACHE = 'hg-cache-20261008173000';
const PHOTO_CACHE = 'hg-plant-photos-v1';
const REFRESH_PARAM = 'hg-refresh';
const REFRESH_STAMP = '20261008173000';

self.addEventListener('install', (e) => {
  // take over immediately, don't wait for old SW to release
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // Clear app caches for freshness, but retain unchanged original photos.
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== PHOTO_CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(clients.map((client) => {
      try {
        const url = new URL(client.url);
        if (url.origin !== self.location.origin) return null;
        if (url.searchParams.get(REFRESH_PARAM) === REFRESH_STAMP) return null;
        url.searchParams.set(REFRESH_PARAM, REFRESH_STAMP);
        return client.navigate(url.href);
      } catch (_) {
        return null;
      }
    }));
  })());
});

self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return; // never cache writes
  const url = new URL(req.url);
  // Firebase data, auth, storage, and SDK requests never enter our caches.
  if (/(^|\.)(firebaseio\.com|firebasedatabase\.app|firebaseapp\.com|firebasestorage\.app)$/.test(url.hostname)
      || /^(firebasestorage|firestore|identitytoolkit|securetoken|firebaseinstallations)\.googleapis\.com$/.test(url.hostname)
      || (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/'))) return;
  if (url.origin === self.location.origin && (url.pathname.endsWith('/sw.js') || url.searchParams.has('hg-build-check'))) {
    e.respondWith(fetch(req, { cache: 'no-store' }));
    return; // freshness probes must never create one cache entry per timestamp
  }
  if (url.origin === self.location.origin && /\/plant-photos\/\d{4}-\d{2}-\d{2}\/[^/]+\.(jpe?g|png|webp)$/i.test(url.pathname)) {
    e.respondWith((async () => {
      let cache;
      try {
        cache = await caches.open(PHOTO_CACHE);
        const cached = await cache.match(req);
        if (cached) return cached;
      } catch (_) {}
      const fresh = await fetch(req, { cache: 'no-store' });
      if (fresh.ok && cache) {
        try { await cache.put(req, fresh.clone()); } catch (_) {}
      }
      return fresh;
    })());
    return;
  }
  e.respondWith((async () => {
    try {
      // network first — always the freshest version when online
      const fresh = await fetch(req, { cache: 'no-store' });
      try {
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
      } catch (_) {}
      return fresh;
    } catch (err) {
      // offline: serve the last good copy if we have one
      const cached = await caches.match(req);
      if (cached) return cached;
      throw err;
    }
  })());
});
