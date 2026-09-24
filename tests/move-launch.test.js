"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const dataSource = fs.readFileSync(path.join(root, "data.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const checklist = fs.readFileSync(path.join(root, "today-checklist.js"), "utf8");
const { TASKS, SCHEDULE, MOVE_LAUNCH_IDS, MOVE_DAILY } = new Function(
  dataSource + ";return {TASKS,SCHEDULE,MOVE_LAUNCH_IDS,MOVE_DAILY};"
)();

assert.deepEqual(MOVE_LAUNCH_IDS, [
  "move_bath_water_damage",
  "move_new_condition",
  "move_services_transfer",
  "move_call_joel",
  "move_carpet_po",
  "move_old_sink",
  "move_furniture_watch",
  "move_address"
], "move-launch IDs and display order must remain intentional");
assert.equal(new Set(MOVE_LAUNCH_IDS).size, MOVE_LAUNCH_IDS.length, "move-launch IDs must be unique");
MOVE_LAUNCH_IDS.forEach(id => assert.ok(TASKS[id], `missing ${id}`));

assert.equal(TASKS.xfinity_call, undefined, "the obsolete retention task must not remain active");
assert.equal(TASKS.find_desk, undefined, "the old desk task must not falsely complete the new measured-furniture task");
assert.doesNotMatch(dataSource, /CenturyLink|retention call|target \$135|target \$70/i, "stale retention guidance must stay out of schedule-facing data");
assert.doesNotMatch(dataSource, /until the destination is known/i, "the move milestones must reflect that Cyrus now has the new house");

const services = TASKS.move_services_transfer;
assert.match(services.label, /utility shutoff.*move internet/i);
assert.ok(services.steps.findIndex(step => /new-house services before ending/i.test(step)) < services.steps.findIndex(step => /shutoff only after final cleaning/i.test(step)), "new service must be confirmed before old-house shutoff");
assert.match(services.steps.join(" "), /confirmation numbers/i);

const joel = TASKS.move_call_joel.steps.join(" ");
assert.match(joel, /washer and dryer/i);
assert.match(joel, /prorated rent/i);
assert.match(joel, /inspection.*key return.*security-deposit/i);
assert.match(joel, /in writing/i);

const carpet = TASKS.move_carpet_po;
const carpetText = carpet.steps.join(" ");
const carpetOrder = [
  carpet.steps.findIndex(step => /load the empty, dry carpet cleaner/i.test(step)),
  carpet.steps.findIndex(step => /attend the PO meeting/i.test(step)),
  carpet.steps.findIndex(step => /after the meeting.*buy.*enzymatic/i.test(step)),
  carpet.steps.findIndex(step => /at the new house/i.test(step)),
  carpet.steps.findIndex(step => /apply the enzyme cleanser/i.test(step)),
  carpet.steps.findIndex(step => /use the carpet machine only if/i.test(step))
];
assert.deepEqual([...carpetOrder].sort((a, b) => a - b), carpetOrder, "the PO → purchase → new-house enzyme → compatible machine sequence must remain exact");
assert.ok(carpetOrder.every(index => index >= 0), "every carpet itinerary step must be present");
assert.match(carpetText, /Do not mix it with bleach, ammonia/i);
assert.match(carpetText, /avoid steam or hot water first/i);
assert.doesNotMatch(carpetText, /2026-\d{2}-\d{2}/, "the unknown PO-meeting date must not be invented");

const waterDamage = TASKS.move_bath_water_damage.steps.join(" ");
assert.match(TASKS.move_bath_water_damage.note, /Old house/i);
assert.match(waterDamage, /Photograph or video/i);
assert.match(waterDamage, /Report.*in writing/i);
assert.match(waterDamage, /written approval/i);
assert.match(waterDamage, /Do not paint over, caulk over, or hide damage/i);
assert.match(waterDamage, /water is near electricity|visible or musty mold/i);
assert.match(TASKS.move_old_sink.note, /Old house/i);
assert.match(TASKS.move_old_sink.steps.join(" "), /DIY only when the fix is clear, safe, and allowed/i);

assert.match(TASKS.move_new_condition.steps.join(" "), /fragile|aquariums|Measure rooms, doorways/i);
assert.match(TASKS.move_furniture_watch.note, /measured new house.*directly there/i);
assert.match(TASKS.move_address.steps.join(" "), /USPS mail forwarding.*insurance/i);

assert.deepEqual(MOVE_DAILY.map(item => item.id), ["move-sell", "move-fragile"]);
assert.match(MOVE_DAILY[0].label, /list up to 3 approved items/i);
assert.match(MOVE_DAILY[0].note, /Keep daily essentials.*anything you have not decided about/i);
assert.match(MOVE_DAILY[1].note, /TVs upright.*aquariums supported under the entire base.*framed art vertical/i);
assert.equal(MOVE_DAILY.every(item => item.end === "2026-08-30"), true, "daily boosters must retire before move-out day");

const rolling = SCHEDULE.filter(item => item.date < "2026-08-17");
assert.equal(rolling.every(item => item.tasks.length <= 1), true, "move-launch priorities must not expand the rolling daily schedule");
for (const milestone of ["2026-08-17", "2026-08-24", "2026-08-30", "2026-08-31"]) {
  assert.ok(SCHEDULE.some(item => item.date === milestone), `missing move milestone ${milestone}`);
}

assert.match(html, /function toggleMoveLaunch\(id\)[\s\S]{0,180}?checked\[id\]=todayKey\(\)/, "Today must date-stamp new one-time completions");
assert.doesNotMatch(checklist, /MOVE_LAUNCH_IDS|MOVE_DAILY|movePriorityCard|move-launch-|move-daily-/, "retired move-launch extras must not inflate Today or enter its completion drawer");

const moveStart = html.indexOf("function moveLaunchCompletedToday");
const moveEnd = html.indexOf("function movePriorityCard", moveStart);
const reminderStart = html.indexOf("function reminderKey");
const reminderEnd = html.indexOf("// 🚙 DMV", reminderStart);
const checked = {}, laundry = {};
let date = "2026-08-29";
const stateApi = new Function("checked", "laundry", "todayKey", `
  function save(){} function saveLaundry(){} function renderAll(){}
  ${html.slice(moveStart, moveEnd)}
  ${html.slice(reminderStart, reminderEnd)}
  return {toggleMoveLaunch, moveLaunchCompletedToday, toggleReminder, reminderDone};
`)(checked, laundry, () => date);
stateApi.toggleMoveLaunch("move_old_sink");
assert.equal(checked.move_old_sink, date, "one-time completion history must retain its actual date");
assert.equal(stateApi.moveLaunchCompletedToday("move_old_sink"), true);
stateApi.toggleReminder("move-sell", true);
assert.equal(laundry["rem-move-sell-2026-08-29"], true, "daily move state must retain its existing date-keyed path");
date = "2026-08-30";
assert.equal(stateApi.moveLaunchCompletedToday("move_old_sink"), false, "older one-time completions must not count as completed today");
assert.equal(stateApi.reminderDone("move-sell", true), false, "daily move reminders must reset on a new date");
assert.equal(checked.move_old_sink, "2026-08-29", "changing the visible date must not erase one-time history");

console.log("move launch regression checks passed");
