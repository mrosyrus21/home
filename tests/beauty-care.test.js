"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const dataSource = fs.readFileSync(path.join(root, "data.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const { BEAUTY_CARE } = new Function(dataSource + ";return {BEAUTY_CARE};")();

assert.equal(BEAUTY_CARE.updated, "2026-08-29");
assert.equal(BEAUTY_CARE.products.length, 5, "Today should contain only the five required product categories");
const ids = BEAUTY_CARE.products.map(item => item.id);
assert.equal(new Set(ids).size, ids.length, "beauty product IDs must stay unique");
assert.deepEqual(ids, ["cleanser", "moisturizer", "sunscreen", "bha", "retinoid"]);
assert.match(BEAUTY_CARE.products.find(item => item.id === "bha").stage, /Week 3/);
const retinoid = BEAUTY_CARE.products.find(item => item.id === "retinoid");
assert.match(retinoid.label, /adapalene 0\.1% gel OR gentle retinol/);
assert.match(retinoid.note, /Do not buy both/);
assert.doesNotMatch(BEAUTY_CARE.products.map(item => item.label).join("\n"), /clay|oatmeal|petroleum|trimmer|floss/i, "optional products must not enter the required Today list");

assert.match(html, /let beautyPurchased = \{\};/, "beauty purchases need dedicated state");
assert.match(html, /beautyPurchased = d\.beautyPurchased \|\| \{\};/, "saved beauty purchases must hydrate independently");
assert.match(html, /const previous=beautyPurchased\[id\]\|\|null, next=previous\?null:todayKey\(\)/, "purchase history must be date-stamped rather than boolean-only");
assert.match(html, /ST\.child\('beautyPurchased'\)\.child\(id\)/, "each purchase must save to its own dedicated Firebase path");
assert.doesNotMatch(html, /ST\.child\('beautyPurchased'\)\.set\(/, "beauty updates must not replace the full purchase map");
assert.match(html, /add\("beautyshop",habitOrder\+2,false,beautyShoppingTodayHtml\(\),true\)/, "the separate Today list must remain passive");
assert.match(html, /Personal care · not groceries/);

const todayStart = html.indexOf("function beautyShoppingTodayHtml");
const healthStart = html.indexOf("function beautyCareSectionHtml", todayStart);
assert.ok(todayStart >= 0 && healthStart > todayStart, "beauty Today and Health renderers must exist");
const todayRenderer = html.slice(todayStart, healthStart);
assert.doesNotMatch(todayRenderer, /grocCustom|taskCustom|rollovers|\bchecked\b|\bshopping\[/, "beauty purchases must not couple to groceries or generic task state");

assert.match(html, /id="beauty-care"/);
assert.match(BEAUTY_CARE.phases[0].title, /Weeks 1-2 · install the baseline/);
assert.match(BEAUTY_CARE.phases[0].steps.join("\n"), /No acids, retinoids, scrubs, or aggressive masks yet/);
assert.match(BEAUTY_CARE.stopRule, /pause new actives and ask the dermatologist/);
assert.doesNotMatch(BEAUTY_CARE.fullNight.join("\n"), /moves quickly/);
assert.match(html, /out \+= beautyCareSectionHtml\(\);/, "Beauty care must render on Health");
assert.match(html, /Morning hygiene \+ face','Teeth · face routine · deodorant · hair\/scalp · clean clothes'/, "the existing morning hygiene history must keep its full meaning");
assert.match(html, /Evening hygiene \+ face','Teeth · face routine · stage tomorrow · bottle in place'/, "the existing evening hygiene history must keep its full meaning");
assert.equal((html.match(/healthMiniToggle\('hygiene-am'/g) || []).length, 1, "reuse the existing morning hygiene history instead of duplicating it");
assert.equal((html.match(/healthMiniToggle\('hygiene-pm'/g) || []).length, 1, "reuse the existing evening hygiene history instead of duplicating it");
assert.doesNotMatch(html, /well-skin-(am|pm)-|healthMiniToggle\('skin-(am|pm)'/, "do not create redundant daily face-care keys");

console.log("beauty care regression checks passed");
