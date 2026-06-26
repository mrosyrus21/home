// sw.js — network-first service worker.
// Fixes "deploys don't show up": always fetches the latest from the network when
// online, caches a copy for offline use, and falls back to cache only when offline.
const CACHE = 'hg-cache-20260626210000';

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
