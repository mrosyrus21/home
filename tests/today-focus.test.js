"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const start = html.indexOf("function renderToday() {");
const end = html.indexOf("// Build a full date-indexed map", start);
assert.ok(start >= 0 && end > start, "Today renderer must exist");
const source = html.slice(start, end);

const order = new Function(source.match(/const todayOrder=(\{[^;]+\});/)?.[0] + " return todayOrder;")();
assert.deepEqual(Object.keys(order), ["vitamin", "water", "beautyshop", "lunch", "newhome", "movement", "dinner", "winddown"], "Today must render only the requested eight cards after Morning routine");
assert.deepEqual(Object.values(order), [100, 200, 300, 400, 500, 600, 700, 800], "Today cards must stay in Cyrus's requested order");
const selectVisible = new Function("flow", "todayOrder", "return " + source.match(/flow\.filter\(function\(it\)\{return Object\.prototype\.hasOwnProperty\.call\(todayOrder,it\.key\);\}\)\s*\.map\(function\(it\)\{return Object\.assign\(\{\},it,\{order:todayOrder\[it\.key\]\}\);\}\)/)?.[0] + ";");
const allCards = ["move-launch", "dttest", "alarm", "vitamin", "task", "water", "beautyshop", "lunch", "newhome", "movement", "dinner", "winddown", "ro-add"].map(key => ({ key, done:false }));
assert.deepEqual(selectVisible(allCards, order).sort((a,b) => a.order-b.order).map(x => x.key), Object.keys(order), "old-house, test, and admin cards must not leak into Today or its completion drawer");
assert.match(source, /let topHtml=almanacRoutineHtml\(hc,nowM\)/, "Morning routine must be the sole top section");
assert.doesNotMatch(source, /let topHtml=wxAlerts\(\)/, "weather banners belong in Forecast, not Today");
assert.match(source, /visibleFlow=flow\.filter\(function\(it\)\{return Object\.prototype\.hasOwnProperty\.call\(todayOrder,it\.key\);\}\)/, "old move, room, reminder, and admin cards must be hidden without deleting their saved state");
assert.match(source, /active\.sort\(function\(a,b\)\{return a\.order-b\.order;\}\)/, "the visible cards must not be re-sorted into time lanes");
assert.match(source, /add\("movement",clockMin\(RY\.workout,1050\),hc\.workoutDone,workoutCard\(hc,today\),false\)/, "keep the existing workout plan, including Strength C on scheduled days");
assert.match(source, /const _ln=MA\.find\(function\(x\)\{return x\.id==='lunch';\}\)/, "Protein lunch must remain");
assert.match(source, /add\("newhome",800,newHomeDone,strip\("🏡","Today's one thing — make one new-house spot usable"/, "Today's one thing must reflect the new house, not the old move-out plan");
assert.match(html, /function toggleNewHomeOneThing\(\)[\s\S]{0,180}newhome-one-/, "new-house one thing must have its own daily completion history");
assert.match(source, /const _dn=MA\.find\(function\(x\)\{return x\.id==='dinner';\}\)/, "Dinner must remain");
assert.match(source, /Phone to the other room/, "phone-away must remain");
assert.match(source, /const pile=_dedupeAdjColors\(visibleFlow\.filter/, "only retained cards may enter Completed today");
assert.match(source, /visibleFlow\.forEach\(function\(it\)\{window\.__flowPrev\[it\.key\]=it\.done;\}\)/, "the retained completion animation must remain scoped to visible cards");
assert.match(html, /This button records the lineup together/, "the vitamin reminder must disclose that it also records Litfulo");
assert.match(html, /Mark morning lineup taken/, "the medication toggle must not say it records vitamins alone");
assert.doesNotMatch(html, /Test day — added to the top of your flow/, "hidden test-day cards must not be promised in Today");

console.log("Today focus regression checks passed");
