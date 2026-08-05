"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");

const build = html.match(/var HG_BUILD_STAMP='(\d{14})'/)?.[1];
const cache = sw.match(/const CACHE = 'hg-cache-(\d{14})'/)?.[1];
const refresh = sw.match(/const REFRESH_STAMP = '(\d{14})'/)?.[1];

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

console.log("service-worker refresh regression checks passed");
