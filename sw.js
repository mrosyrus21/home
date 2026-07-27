// sw.js — network-first service worker.
// Fixes "deploys don't show up": always fetches the latest from the network when
// online, caches a copy for offline use, and falls back to cache only when offline.
const CACHE = 'hg-cache-20260727102500';
const REFRESH_PARAM = 'hg-refresh';
const REFRESH_STAMP = '20260727102500';

self.addEventListener('install', (e) => {
  // take over immediately, don't wait for old SW to release
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // wipe every old cache so stale files can't linger
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
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
