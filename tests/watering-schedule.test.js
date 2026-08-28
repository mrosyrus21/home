"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const queue = require(path.join(__dirname, "..", "watering-queue.js"));

const state = input => queue.classify(input).key;
assert.equal(state({ due: true }), "due");
assert.equal(state({ soon: true }), "soon");
assert.equal(state({}), "good");
assert.equal(state({ pushed: true }), "tomorrow");
assert.equal(state({ wateredToday: true, due: true }), "watered");
assert.equal(state({ due: true, pushed: true }), "due", "a stale deferral must never hide a due check");
assert.equal(queue.STATE.due.compact, false);
for (const key of ["soon", "good", "tomorrow", "watered"]) assert.equal(queue.STATE[key].compact, true);

const ordered = queue.sort([
  { id: "watered", state: queue.STATE.watered, order: 0 },
  { id: "good", state: queue.STATE.good, order: 1 },
  { id: "due-less", state: queue.STATE.due, overdue: 1, order: 2 },
  { id: "tomorrow", state: queue.STATE.tomorrow, order: 3 },
  { id: "soon", state: queue.STATE.soon, order: 4 },
  { id: "due-more", state: queue.STATE.due, overdue: 4, order: 5 }
]);
assert.deepEqual(ordered.map(x => x.id), ["due-more", "due-less", "soon", "good", "tomorrow", "watered"]);
assert.equal(queue.calendarDaysSince("2026-07-25", "2026-07-27"), 2);
assert.equal(queue.calendarDaysSince("2026-02-31", "2026-07-27"), null);
assert.equal(queue.calendarDaysSince("2026-07-28", "2026-07-27"), null, "future watering logs are unsafe");
assert.equal(queue.isFutureDateKey("2026-07-28", "2026-07-27"), true);

const fixturePlants = [
  { id: "due", name: "Due", days: 1 },
  { id: "pot_a", name: "Pot A", days: 2 },
  { id: "pot_b", name: "Pot B", days: 2 },
  { id: "done", name: "Done", days: 5 }
];
const fixtureGroup = [{ id: "shared_planter", ids: ["pot_a", "pot_b"], plant: { id: "shared_planter", name: "Shared planter", days: 2 } }];
const built = queue.build({
  dateKey: "2026-07-27",
  plants: fixturePlants,
  watered: { due: "2026-07-25", pot_a: "2026-07-26", pot_b: "2026-07-26", done: "2026-07-27" },
  pushed: {},
  groups: fixtureGroup
});
assert.deepEqual(built.map(x => [x.id, x.state.key]), [["due", "due"], ["shared_planter", "soon"], ["done", "watered"]]);
assert.equal(built.filter(x => x.id === "shared_planter").length, 1, "a shared planter must be one watering unit");
const partialPot = queue.build({
  dateKey: "2026-07-27",
  plants: fixturePlants.slice(1, 3),
  watered: { pot_a: "2026-07-27", pot_b: "2026-07-24" },
  pushed: {},
  groups: fixtureGroup
});
assert.equal(partialPot[0].state.key, "due", "one watered member must not hide the other due member");
const pushedPot = queue.build({
  dateKey: "2026-07-27",
  plants: fixturePlants.slice(1, 3),
  watered: { pot_a: "2026-07-24", pot_b: "2026-07-24" },
  pushed: { pot_a: "2026-07-28", pot_b: "2026-07-28" },
  groups: fixtureGroup
});
assert.equal(pushedPot[0].state.key, "tomorrow");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
assert.match(html, /WateringQueue\.build/);
assert.match(html, /data-water-card="compact"/);
assert.match(html, /data-water-card="full"[^>]+data-water-state="due"/, "only due entries may render full-size");
assert.match(html, /updates\["watered\/"\+id\]/, "watering writes must use per-plant paths");
assert.match(html, /\.info\/connected/, "watering writes must be gated on a live Firebase connection");
assert.match(html, /if\(!wateringStateLoaded\)/, "an unloaded history must not fabricate a due list");
assert.doesNotMatch(html, /child\(['"]watered['"]\)\.set\(watered\)/, "whole watering-history writes are forbidden");
assert.doesNotMatch(html, /child\(['"]waterPushed['"]\)\.set\(waterPushed\)/, "whole deferral-history writes are forbidden");
assert.doesNotMatch(html, /vacation-watering-jul2026|garden-init-v1|rain-2026-05-1[78]/, "retired watering migrations must not run in the browser");
assert.doesNotMatch(html, /Mark all as watered/i, "bulk watering controls are forbidden");
assert.doesNotMatch(html, /shared_pot|Wide Gray Pot · Green & White Onions/, "the removed shared onion pot must not return to live UI code");

const inlineScripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(match => !/\bsrc\s*=/.test(match[1]) && (!/\btype\s*=/.test(match[1]) || /javascript/i.test(match[1])));
inlineScripts.forEach((match, index) => assert.doesNotThrow(() => new Function(match[2]), `inline script ${index + 1} must parse`));
for (const file of ["data.js", "sw.js", "watering-queue.js"]) {
  const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  assert.doesNotThrow(() => new Function(source), `${file} must parse`);
}
const dataSource = fs.readFileSync(path.join(__dirname, "..", "data.js"), "utf8");
const plantData = new Function(dataSource + ";return {PLANTS,PLANT_INFO,WATER_INFO,HARVEST_INFO};")();
const plants = plantData.PLANTS;
assert.equal(new Set(plants.map(p => p.id)).size, plants.length, "plant IDs must be unique");
assert.equal(plants.every(p => Number.isInteger(p.days) && p.days > 0), true, "every plant needs a positive whole-day cadence");
assert.equal(plants.some(p => p.id === "white_onion"), false, "the removed white onion must not be scheduled");
assert.equal(queue.build({ dateKey: "2026-07-27", plants, watered: { white_onion: "2026-07-27" }, pushed: {} }).some(entry => entry.id === "white_onion"), false, "stale white-onion history must stay dormant");
assert.equal(plants.find(p => p.id === "green_onion").days, 2, "green-onion cadence must stay unchanged");
assert.equal(plants.find(p => p.id === "potato_sprout").days, 1, "second potato cadence must stay unchanged");
assert.equal(plants.some(p => p.id === "turmeric"), false, "removed turmeric must not be scheduled");
assert.equal(queue.build({ dateKey: "2026-08-28", plants, watered: { turmeric: "2026-08-27" }, pushed: {} }).some(entry => entry.id === "turmeric"), false, "stale turmeric history must stay dormant");
assert.equal(plantData.PLANT_INFO.potato_sprout.photo, plantData.PLANT_INFO.potato.photo, "both grow-bag potato cards must use the same photo");
assert.equal(fs.existsSync(path.join(__dirname, "..", plantData.PLANT_INFO.turmeric.photo)), true, "the turmeric photo must exist");
assert.match(plantData.PLANT_INFO.turmeric.photoCreditUrl || "", /^https:\/\/commons\.wikimedia\.org\//, "the turmeric example needs a source link");
assert.doesNotMatch(plantData.WATER_INFO.green_onion.when, /shared|gray pot|white onion/i, "green-onion watering copy must describe its individual pots");
assert.doesNotMatch(plantData.HARVEST_INFO.green_onion.how, /neighboring|potato|white onion/i, "green-onion harvest copy must describe its individual pots");

console.log("watering schedule regression checks passed");
