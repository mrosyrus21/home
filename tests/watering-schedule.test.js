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
assert.match(html, /data-water-card="picture" data-water-size="wide"/, "due reminders need wide picture cards");
const wateringViewStart = html.indexOf('if (gardenSub === "watering")');
const harvestViewStart = html.indexOf('else if (gardenSub === "harvest")', wateringViewStart);
const careViewStart = html.indexOf("const tDueSet", harvestViewStart);
const gardenViewEnd = html.indexOf("function renderShopping", careViewStart);
assert.ok(wateringViewStart >= 0 && harvestViewStart > wateringViewStart && careViewStart > harvestViewStart && gardenViewEnd > careViewStart, "watering and Care view boundaries must remain identifiable");
const wateringView = html.slice(wateringViewStart, harvestViewStart);
assert.match(wateringView, /if\(entry\.state\.key==="due"\)\{\s*html\+=pictureWaterCard\(entry\);\s*return;\s*\}/, "due entries must render as picture cards before the compact-row path");
assert.match(wateringView, /html\+=compactWaterCard\(entry\)/, "non-due entries must remain compact rows");
assert.doesNotMatch(wateringView, /WATER_INFO\[|p\.waterCue|p\.freq|ageLabel|water-card-water-cue|data-water-cue|plant-pot-note/, "watering reminders must show only a plant name and short status, never cue or age paragraphs");
assert.match(wateringView, /water-card-compact-meta">'\+plantHtml\(entryLabel\(entry\)\)/, "reminder metadata must come from the short status label");
assert.match(html, /\.water-card-compact-name\{[^}]*white-space:nowrap;overflow:hidden;text-overflow:ellipsis/, "long names must stay on one line");
assert.match(html, /\.water-card-compact-meta\{[^}]*white-space:nowrap;overflow:hidden;text-overflow:ellipsis/, "short statuses must stay on one line");
assert.match(html, /\.water-card-picture-photo\{[^}]*height:140px/, "due reminders must restore the old 140px photo header");
assert.match(html, /\.water-card-picture\[data-plant-type="strawberry"\] \.water-card-picture-photo\{height:172px/, "strawberry due reminders must retain their taller photo header");
assert.match(html, /\.water-card-compact-thumb\{\s*width:42px;height:42px/, "desktop photo thumbnail dimensions must remain unchanged");
assert.match(html, /@media\(max-width:430px\)\{[\s\S]*?\.water-card-compact-thumb\{width:38px;height:38px/, "mobile photo thumbnail dimensions must remain unchanged");
const reminderHelpersStart = wateringView.indexOf("function entryPending");
const reminderHelpersEnd = wateringView.indexOf("queue.forEach", reminderHelpersStart);
assert.ok(reminderHelpersStart >= 0 && reminderHelpersEnd > reminderHelpersStart, "watering reminder helpers must remain identifiable");
const previewHelperStart = html.indexOf("function plantPhotoPreview(");
const previewHelperEnd = html.indexOf("function gardenPlantMatches(", previewHelperStart);
assert.ok(previewHelperStart >= 0 && previewHelperEnd > previewHelperStart, "card-preview helper must remain identifiable");
const photoPreview = new Function(html.slice(previewHelperStart, previewHelperEnd) + ";return plantPhotoPreview;")();
const photoImageStart = html.indexOf("function photoImage(");
const photoImageEnd = html.indexOf("function photoControls(", photoImageStart);
assert.ok(photoImageStart >= 0 && photoImageEnd > photoImageStart, "card-photo renderer must remain identifiable");
const photoImageFactory = new Function("plantPhotoData", "plantHtml", "plantPhotoPreview",
  html.slice(photoImageStart, photoImageEnd) + ";return photoImage;"
);
const reminderFactory = new Function("wateringPending", "wateringOnline", "photo_", "plantHtml", "plantPhotoData", "photoPos_", "photoImage", "plantPhotoPreview",
  wateringView.slice(reminderHelpersStart, reminderHelpersEnd) + ';return function(entry){return entry.state.key==="due"?pictureWaterCard(entry):compactWaterCard(entry);};'
);
function reminder(state, options = {}) {
  const p = {id:"fixture", name:"Fixture physical pot", plantType:options.strawberry?"strawberry":"mint", emoji:"🪴", waterCue:"SHOULD_NOT_RENDER", freq:"SHOULD_NOT_RENDER"};
  const escape = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const photo = "plant-photos/2026-10-06/20261006_fixture.jpg";
  const photoData = () => ({photo, fit:"contain", position:"55% 45%"});
  const photoImage = photoImageFactory(photoData, escape, photoPreview);
  const render = reminderFactory(options.pending ? {fixture:"water"} : {}, !options.offline, () => photo, escape, photoData, () => "55% 45%", photoImage, photoPreview);
  return render({id:p.id, p, ids:[p.id], state:queue.STATE[state], days:options.unknown ? null : 1, warning:options.warning ? "Full warning must not render" : ""});
}
const reminderLabels = {due:"Check moisture", soon:"Check soon", good:"Good", tomorrow:"Check tomorrow", watered:"Watered today"};
for (const [state, label] of Object.entries(reminderLabels)) {
  const row = reminder(state);
  assert.match(row, new RegExp('data-water-card="' + (state === "due" ? "picture" : "compact") + '"'), `${state} needs the correct picture-card or compact-row layout`);
  assert.match(row, new RegExp('water-card-compact-meta">' + label + '<'), `${state} needs a short status`);
  assert.doesNotMatch(row, /SHOULD_NOT_RENDER|since watering|Full warning/, "cards must not render watering or age paragraphs");
  assert.doesNotMatch(row, /<p\b|plant-photo-controls/, "watering cards must not bring back paragraphs or framing controls");
  if (state === "due") assert.doesNotMatch(row, /water-card-compact-thumb/, "due photos must not shrink to thumbnails");
  else assert.match(row, /class="water-card-compact-thumb"/, "non-due photos stay in mini rows");
  assert.equal((row.match(/onclick="waterPlantGroup\(/g) || []).length, state === "watered" ? 0 : 1, "each active row gets only one primary watering action");
  assert.equal((row.match(/<details\b/g) || []).length, state === "due" ? 1 : 0, "only due rows may offer a hidden secondary menu");
}
const dueReminder = reminder("due");
const dampMenu = dueReminder.match(/<details class="water-row-menu">[\s\S]*?<\/details>/)?.[0];
assert.ok(dampMenu, "due reminders need a closed options menu");
assert.doesNotMatch(dampMenu, /<details[^>]*\bopen\b/, "secondary options must start collapsed");
assert.match(dampMenu, /<summary[^>]*>⋯<\/summary>/);
assert.match(dampMenu, /onclick="pushWateringGroup\([\s\S]*>Still damp<\/button>/);
assert.doesNotMatch(dueReminder.replace(dampMenu, ""), /pushWateringGroup|Still damp/, "damp deferral must not be a second visible primary action");
assert.match(dueReminder, /class="water-card-compact-name" title="Fixture physical pot"/, "the full plant name must remain available in its title");
assert.match(dueReminder, /class="water-card-picture-photo"/, "due photos need their own full-width header");
assert.match(dueReminder, /class="plant-photo-button" onclick="openPlantPhoto\('fixture'\)"/, "the due picture must still open its original");
assert.match(reminder("due", {strawberry:true}), /data-plant-type="strawberry"/, "strawberry picture cards need their taller layout selector");
for (const state of Object.keys(reminderLabels)) {
  assert.match(reminder(state), /src="plant-photo-previews\/2026-10-06\/20261006_fixture\.webp"[^>]*object-fit:contain;object-position:55% 45%/, "cards must use light previews without changing saved framing");
}
assert.equal(photoPreview("https://example.com/photo.jpg"), "https://example.com/photo.jpg", "non-inventory image sources must not be rewritten");
const originalViewerStart = html.indexOf("function openPlantPhoto(");
const originalViewerEnd = html.indexOf("function renderGarden(", originalViewerStart);
assert.ok(originalViewerStart >= 0 && originalViewerEnd > originalViewerStart, "original-photo viewer must remain identifiable");
const originalViewer = html.slice(originalViewerStart, originalViewerEnd);
assert.match(originalViewer, /photos=\[data\.photo\]\.concat\(data\.alternates\)/, "the viewer must retain original and alternate photo sources");
assert.doesNotMatch(originalViewer, /plantPhotoPreview\(/, "full original photos must never be replaced by card previews");
for (const state of ["due", "soon", "good", "tomorrow"]) {
  for (const options of [{offline:true}, {pending:true}]) {
    const row = reminder(state, options);
    assert.doesNotMatch(row, /waterPlantGroup|pushWateringGroup|water-row-menu/, "offline and pending reminders must not offer writes");
    assert.match(row, /<button[^>]*disabled>/, "unavailable writes must be disabled");
  }
}
assert.match(reminder("due", {warning:true}), /water-card-compact-meta">Review date</);
assert.match(reminder("due", {unknown:true}), /water-card-compact-meta">No saved date</);
const careView = html.slice(careViewStart, gardenViewEnd);
assert.match(careView, /const wi=WATER_INFO\[p\.id\]/, "Care must retain the existing per-plant watering guidance");
assert.match(careView, /<details class="plant-watering-details">[^\n]+wi\.when[^\n]+wi\.thirst[^\n]+<\/details>/, "Care must offer the full when/how and moisture guidance in a collapsed disclosure");
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
plants.forEach(p => {
  assert.equal(typeof p.waterCue, "string", `${p.id} needs a short watering cue`);
  assert.ok(p.waterCue.trim().length > 0 && p.waterCue.length <= 130, `${p.id} watering cue must be nonempty and at most 130 characters`);
  assert.doesNotMatch(p.waterCue, /[<>\r\n]/, `${p.id} watering cue must stay a single plain-text line`);
});
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
assert.equal(harvestIds.length, 17, "harvest cards must stay limited to confirmed edible plants");
assert.deepEqual(harvestIds, plants.filter(p => ["mint", "parsley", "rosemary", "strawberry", "tomato", "oregano", "spinach"].includes(p.plantType)).map(p => p.id).sort());

const correctedPots = {
  fresh_pot120913: ["Greek oregano", "oregano"],
  fresh_pot120734: ["Jade", "jade"],
  fresh_pot120748: ["Candytuft", "candytuft"],
  fresh_pot120806: ["Daisy", "daisy_provisional"],
  fresh_pot120848: ["Spinach", "spinach"],
  fresh_pot120851: ["Greek oregano", "oregano"],
  fresh_pot120923: ["Heartleaf philodendron", "philodendron_provisional"]
};
for (const [id, [name, type]] of Object.entries(correctedPots)) {
  const pot = plants.find(p => p.id === id);
  assert.ok(pot.name.toLowerCase().startsWith(name.toLowerCase()), `${id} must retain the reviewed name`);
  assert.equal(pot.plantType, type, `${id} must use its reviewed care type`);
}
assert.deepEqual(plants.filter(p => p.plantType === "oregano").map(p => p.id).sort(),
  ["fresh_pot120851", "fresh_pot120913"], "the two oregano pots must not be merged");
assert.equal(plants.find(p => p.id === "fresh_pot120923").provisionalIdentity, true, "the accepted vine guess must remain provisional");
const cactus = plants.find(p => p.id === "fresh_pot121003");
assert.equal(cactus.provisionalIdentity, true, "the cactus species guess must remain provisional");
assert.match(cactus.name, /prickly pear/i);
assert.match(plantData.CARE_INFO[cactus.id].fact, /rooting nicely/i, "the found cutting's user-reported rooting must be preserved");
assert.doesNotMatch(plantData.WATER_INFO[cactus.id].when, /Seedling exception:|2–3 inches|15–30 minutes/, "rooting-cactus care must not append generic mature-pot soaking instructions");

const photos = plants.map(p => plantData.PLANT_INFO[p.id].photo);
assert.equal(new Set(photos).size, 31, "each pot needs a unique primary photo path");
const photoHashes = photos.map(photo => {
  const file = path.join(__dirname, "..", photo);
  assert.equal(fs.existsSync(file), true, `primary photo must exist: ${photo}`);
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
});
assert.equal(new Set(photoHashes).size, 31, "duplicate photo bytes must not become additional physical-pot cards");
for (const photo of photos.concat(plants.flatMap(p => plantData.PLANT_INFO[p.id].alternatePhotos || []))) {
  const preview = photoPreview(photo);
  assert.match(preview, /^plant-photo-previews\/2026-10-06\/[^/]+\.webp$/, "every inventory photo needs a light card-preview path");
  const previewFile = path.join(__dirname, "..", preview);
  assert.equal(fs.existsSync(previewFile), true, `card preview must exist: ${preview}`);
  const bytes = fs.readFileSync(previewFile);
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP", `${preview} must contain WebP image bytes`);
  assert.ok(bytes.length < fs.statSync(path.join(__dirname, "..", photo)).size, `${preview} must be lighter than its full original`);
}

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
