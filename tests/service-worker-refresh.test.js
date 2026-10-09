"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");

const build = html.match(/var HG_BUILD_STAMP='(\d{14})'/)?.[1];
const cache = sw.match(/const CACHE = 'hg-cache-(\d{14})'/)?.[1];
const refresh = sw.match(/const REFRESH_STAMP = '(\d{14})'/)?.[1];
const photoCache = sw.match(/const PHOTO_CACHE = '([^']+)'/)?.[1];
const staticCache = sw.match(/const STATIC_CACHE = '([^']+)'/)?.[1];

assert.ok(build, "index.html must expose a deploy build stamp");
assert.equal(build, cache, "the page and service-worker cache stamps must match");
assert.equal(build, refresh, "the page and service-worker refresh stamps must match");
assert.match(html, /register\('sw\.js\?v='\+HG_BUILD_STAMP,\{updateViaCache:'none'\}\)/, "every deploy must use its current stamp in the service-worker URL");
assert.match(html, /fetch\('sw\.js\?hg-version='\+Date\.now\(\),\{cache:'no-store'\}\)/, "a visible stale tab must probe the uncached live worker");
assert.match(html, /pageStamp>=workerStamp && pageStamp>HG_BUILD_STAMP/, "the page must not reload until the matching new index has reached production");
assert.match(html, /window\.location\.replace\(url\.href\)/, "a confirmed newer build must replace the stale page");
assert.match(html, /setInterval\(hgCheckLatestBuild,300000\)/, "a continuously visible tab must still discover future builds");
assert.match(sw, /url\.pathname\.endsWith\('\/sw\.js'\) \|\| url\.searchParams\.has\('hg-build-check'\)/, "timestamped freshness probes must bypass the cache");
assert.doesNotMatch(html, /sw\.js\?v=20260731000500/, "the obsolete fixed worker URL must stay removed");
assert.equal(photoCache, "hg-plant-photos-v1", "the photo cache name must not change with app build stamps");
assert.equal(staticCache, "hg-static-v1");
assert.doesNotMatch(sw, /client\.navigate|clients\.matchAll/, "worker activation must not force a second page navigation");
assert.match(html, /controllerchange',function\(\)\{ hgCheckLatestBuild\(\); \}/, "controller changes check versions instead of reloading a fresh page");
assert.doesNotMatch(html, /controllerchange[^\n]+window\.location\.reload/, "first install must not reload an already-current document");

const origin = "https://mrosyrus21.github.io";
const site = `${origin}/home/`;
const photoUrl = `${site}plant-photos/2026-10-06/20261006_120734.jpg`;

function response(id, status = 200) {
  return { id, status, ok: status >= 200 && status < 300, clone() { return response(id, status); } };
}

function workerHarness(replies = []) {
  const listeners = new Map();
  const stores = new Map();
  const fetches = [];
  const puts = [];
  const deleted = [];
  let claims = 0;
  const cacheApi = {
    async keys() { return [...stores.keys()]; },
    async delete(name) { deleted.push(name); return stores.delete(name); },
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const entries = stores.get(name);
      return {
        async match(req) { return entries.get(req.url); },
        async put(req, value) { puts.push({ name, url: req.url }); entries.set(req.url, value); }
      };
    },
    async match(req) {
      for (const entries of stores.values()) {
        if (entries.has(req.url)) return entries.get(req.url);
      }
    }
  };
  vm.runInNewContext(sw, {
    URL,
    caches: cacheApi,
    self: {
      location: { origin },
      addEventListener(type, listener) { listeners.set(type, listener); },
      skipWaiting() {},
      clients: { async claim() { claims++; }, async matchAll() { return []; } }
    },
    async fetch(req, options) {
      fetches.push({ url: req.url, options });
      const next = replies.length ? replies.shift() : response("network");
      if (next instanceof Error) throw next;
      return next;
    }
  }, { filename: "sw.js" });
  return {
    stores, fetches, puts, deleted,
    get claims() { return claims; },
    async request(url, method = "GET") {
      let handled = false;
      let result;
      listeners.get("fetch")({
        request: { url, method },
        respondWith(promise) { handled = true; result = promise; }
      });
      return { handled, response: handled ? await result : undefined };
    },
    async activate() {
      let completion;
      listeners.get("activate")({ waitUntil(promise) { completion = promise; } });
      await completion;
    }
  };
}

async function runBehaviorChecks() {
  const hit = workerHarness();
  const savedPhoto = response("saved-original");
  hit.stores.set(photoCache, new Map([[photoUrl, savedPhoto]]));
  assert.equal((await hit.request(photoUrl)).response, savedPhoto, "a saved photo must be reused");
  assert.equal(hit.fetches.length, 0, "a photo cache hit must skip the network");

  for (const extension of ["jpg", "jpeg", "png", "webp", "JPG"]) {
    const miss = workerHarness([response(`original-${extension}`)]);
    const url = `${site}plant-photos/2026-10-06/pot.${extension}`;
    assert.equal((await miss.request(url)).response.id, `original-${extension}`);
    assert.equal(miss.puts.length, 1, "a successful photo response must be cached");
    assert.equal(miss.puts[0].name, photoCache, "photos must use the dedicated cache");
    await miss.request(url);
    assert.equal(miss.fetches.length, 1, "the next photo request must reuse the successful response");
  }

  for (const status of [0, 404, 500]) {
    const unsuccessful = workerHarness([response("unsuccessful", status), response("retry")]);
    assert.equal((await unsuccessful.request(photoUrl)).response.status, status);
    assert.equal(unsuccessful.puts.length, 0, "unsuccessful photo responses must not be cached");
    await unsuccessful.request(photoUrl);
    assert.equal(unsuccessful.fetches.length, 2, "an unsuccessful photo response must be retried");
  }

  const activated = workerHarness();
  activated.stores.set(photoCache, new Map([[photoUrl, savedPhoto]]));
  activated.stores.set("hg-cache-20261007210000", new Map());
  activated.stores.set(`hg-cache-${cache}`, new Map());
  activated.stores.set(staticCache, new Map());
  await activated.activate();
  assert.deepEqual([...activated.stores.keys()], [photoCache, `hg-cache-${cache}`, staticCache], "activation must preserve static assets, photos, and this build's cache");
  assert.equal(activated.claims, 1, "activation must still claim clients");
  assert.equal((await activated.request(photoUrl)).response, savedPhoto, "preserved photos must remain reusable after activation");
  assert.equal(activated.fetches.length, 0);

  for (const url of [site, `${site}data.js`, `${site}bundle.js`]) {
    const app = workerHarness([response("fresh-one"), response("fresh-two"), new Error("offline")]);
    assert.equal((await app.request(url)).response.id, "fresh-one");
    assert.equal((await app.request(url)).response.id, "fresh-two", "non-photo assets must remain network-first");
    assert.equal((await app.request(url)).response.id, "fresh-two", "app assets must retain their offline fallback");
    assert.equal(app.fetches.length, 3);
    assert.ok(app.fetches.every((call) => call.options.cache === "no-store"), "app requests must bypass the HTTP cache");
    assert.ok(app.puts.every((put) => put.name === `hg-cache-${cache}`), "non-photo assets must not enter the photo cache");
  }

  for (const [url, expectedCache] of [
    [`${site}images/recipe.jpg`, `hg-cache-${cache}`],
    [`${site}data.js?v=${build}`, `hg-cache-${cache}`],
    [`${site}dayarc.css?v=${build}`, `hg-cache-${cache}`],
    [`${site}plant-photo-previews/2026-10-06/pot.webp`, photoCache],
    [`${site}dayarc-assets/optimized-v1/mtn-day.webp`, staticCache]
  ]) {
    const asset = workerHarness([response("asset-one"), response("should-not-fetch")]);
    assert.equal((await asset.request(url)).response.id, "asset-one");
    assert.equal((await asset.request(url)).response.id, "asset-one");
    assert.equal(asset.fetches.length, 1, "repeated static delivery requests must skip the network");
    assert.equal(asset.puts[0].name, expectedCache);
    assert.equal(asset.fetches[0].options, undefined, "static misses should allow normal HTTP caching");
  }

  const lastGood = workerHarness([response("last-good"), response("server-error", 500), new Error("offline")]);
  const documentUrl = `${site}index.html`;
  assert.equal((await lastGood.request(documentUrl)).response.id, "last-good");
  assert.equal((await lastGood.request(documentUrl)).response.id, "last-good", "HTTP errors must fall back to last good content");
  assert.equal(lastGood.puts.length, 1, "HTTP errors must not poison the cache");
  assert.equal((await lastGood.request(documentUrl)).response.id, "last-good", "offline still receives good cached content after a server error");
  const uncachedError = workerHarness([response("missing", 404)]);
  assert.equal((await uncachedError.request(documentUrl)).response.status, 404);
  assert.equal(uncachedError.puts.length, 0);

  for (const url of [`${site}sw.js?hg-version=1`, `${site}?hg-build-check=${refresh}&t=1`, `${photoUrl}?hg-build-check=${refresh}`]) {
    const probe = workerHarness();
    await probe.request(url);
    assert.equal(probe.fetches.length, 1, "freshness probes must go to the network");
    assert.equal(probe.fetches[0].options.cache, "no-store");
    assert.equal(probe.puts.length, 0, "freshness probes must never enter either cache");
  }

  const bypass = workerHarness();
  for (const method of ["POST", "PUT", "DELETE"]) {
    assert.equal((await bypass.request(photoUrl, method)).handled, false, "writes must bypass the worker");
  }
  for (const url of ["https://schedule-c6dc7-default-rtdb.firebaseio.com/state.json", "https://sample.europe-west1.firebasedatabase.app/state.json", "https://schedule-c6dc7.firebaseapp.com/__/auth/handler", "https://schedule-c6dc7.firebasestorage.app/photo.jpg", "https://firebasestorage.googleapis.com/v0/b/example/o/photo.jpg", "https://firestore.googleapis.com/v1/projects/example", "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword", "https://securetoken.googleapis.com/v1/token", "https://firebaseinstallations.googleapis.com/v1/projects/example", "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"]) {
    assert.equal((await bypass.request(url)).handled, false, "Firebase requests must bypass the worker caches");
  }
  assert.equal(bypass.fetches.length, 0);
  assert.equal(bypass.puts.length, 0);
  console.log("service-worker refresh and photo-cache regression checks passed");
}

runBehaviorChecks().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
