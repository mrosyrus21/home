"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
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
const plantData = new Function(dataSource + ";return {PLANTS,PLANT_INFO,WATER_INFO,FUN_FACTS,CARE_INFO,PEST_INFO,FEED_INFO,HARVEST_INFO};")();
const plants = plantData.PLANTS;
assert.equal(plants.length, 31, "the refreshed inventory must have one card for each confirmed physical pot");
assert.equal(new Set(plants.map(p => p.id)).size, plants.length, "plant IDs must be unique");
assert.equal(plants.every(p => /^fresh_/.test(p.id)), true, "fresh pots must not reuse legacy state keys");
assert.equal(plants.every(p => Number.isInteger(p.days) && p.days > 0), true, "every plant needs a positive whole-day soil-check cadence");
assert.equal(plants.every(p => p.checkOnly === true), true, "a due card must request a soil check, not automatic watering");
assert.equal(plants.every(p => p.lastWatered === "2026-10-06"), true, "all 31 pots must retain the user's confirmed October 6 watering baseline");
assert.equal(plants.some(p => p.trimDays || p.trim), false, "fresh pots must not inherit dated trimming instructions");
assert.equal(plants.filter(p => p.loc === "indoor").length, 29);
assert.deepEqual(plants.filter(p => p.loc === "outdoor").map(p => p.id).sort(),
  ["fresh_pot1000016368", "fresh_strawberry_gray_outdoor"], "only the gray strawberry and temporarily outdoor tomato belong outdoors");

const mintIds = ["fresh_pot120755", "fresh_pot120830", "fresh_pot120835", "fresh_pot120837", "fresh_pot120841", "fresh_pot120843", "fresh_pot120855"];
const mints = plants.filter(p => p.plantType === "mint");
assert.deepEqual(mints.map(p => p.id), mintIds, "each mint number must stay attached to its own physical pot");
mints.forEach((p, index) => assert.match(p.name, new RegExp("^Mint #" + (index + 1) + "\\b")));

const activeIds = plants.map(p => p.id).sort();
for (const name of ["PLANT_INFO", "WATER_INFO", "FUN_FACTS", "CARE_INFO", "PEST_INFO", "FEED_INFO"]) {
  assert.deepEqual(Object.keys(plantData[name]).sort(), activeIds, `${name} must cover exactly the fresh active pots`);
}
const harvestIds = Object.keys(plantData.HARVEST_INFO).sort();
assert.equal(harvestIds.length, 14, "harvest cards must stay limited to confirmed edible plants");
assert.deepEqual(harvestIds, plants.filter(p => ["mint", "parsley", "rosemary", "strawberry", "tomato"].includes(p.plantType)).map(p => p.id).sort());

const photos = plants.map(p => plantData.PLANT_INFO[p.id].photo);
assert.equal(new Set(photos).size, 31, "each pot needs a unique primary photo path");
const photoHashes = photos.map(photo => {
  const file = path.join(__dirname, "..", photo);
  assert.equal(fs.existsSync(file), true, `primary photo must exist: ${photo}`);
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
});
assert.equal(new Set(photoHashes).size, 31, "duplicate photo bytes must not become additional physical-pot cards");

const retiredIds = ["white_onion", "green_onion", "potato", "potato_sprout", "turmeric", "mint", "rosemary", "strawberry", "strawberry_pot", "tomato", "fittonia", "shared_pot"];
const legacyWatered = Object.fromEntries(retiredIds.map(id => [id, "2026-10-06"]));
const legacyPushed = Object.fromEntries(retiredIds.map(id => [id, "2026-10-07"]));
const legacyBefore = JSON.stringify({ watered: legacyWatered, pushed: legacyPushed });
// Exercise genuinely unknown records separately from the user-confirmed live baseline.
const unknownPlants = plants.map(p => ({ ...p, lastWatered: null }));
const unknown = queue.build({ dateKey: "2026-10-06", plants: unknownPlants, watered: legacyWatered, pushed: legacyPushed });
assert.equal(unknown.length, 31);
assert.equal(unknown.every(entry => entry.days === null && entry.state.key === "due"), true, "legacy dates and deferrals must not initialize any fresh pot");
assert.equal(unknown.some(entry => retiredIds.includes(entry.id)), false, "retired history must stay dormant");
assert.equal(JSON.stringify({ watered: legacyWatered, pushed: legacyPushed }), legacyBefore, "building the active queue must retain all legacy history unchanged");

const firstId = plants[0].id;
const oneWatered = queue.build({ dateKey: "2026-10-06", plants: unknownPlants, watered: { ...legacyWatered, [firstId]: "2026-10-06" }, pushed: legacyPushed });
assert.equal(oneWatered.filter(entry => entry.state.key === "watered").length, 1, "logging one pot must not mark another pot watered");
assert.equal(oneWatered.filter(entry => entry.state.key === "due").length, 30);
const oneDeferred = queue.build({ dateKey: "2026-10-06", plants: unknownPlants, watered: legacyWatered, pushed: { ...legacyPushed, [firstId]: "2026-10-07" } });
assert.equal(oneDeferred.find(entry => entry.id === firstId).state.key, "tomorrow");
assert.equal(oneDeferred.find(entry => entry.id === firstId).days, null, "a moisture-check snooze must not invent a watering date");
assert.equal(oneDeferred.filter(entry => entry.state.key === "due").length, 30);
assert.equal(queue.build({ dateKey: "2026-10-07", plants: unknownPlants, watered: legacyWatered, pushed: { [firstId]: "2026-10-07" } }).find(entry => entry.id === firstId).state.key, "due", "a snoozed soil check must return on its target date");

console.log("watering schedule regression checks passed");
