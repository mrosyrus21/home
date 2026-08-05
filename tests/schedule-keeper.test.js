"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const dataSource = fs.readFileSync(path.join(root, "data.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const { SCHEDULE, TASKS, PAUSED_FLIP_SCAN, TV_FOLLOWUP } = new Function(dataSource + ";return {SCHEDULE,TASKS,PAUSED_FLIP_SCAN,TV_FOLLOWUP};")();

const rolling = SCHEDULE.filter(item => item.date < "2026-08-17");
assert.equal(rolling.length, 7, "the rolling window must contain exactly seven days");
assert.equal(rolling[0].date, "2026-08-04", "the rolling window must start today");
assert.equal(rolling[rolling.length - 1].date, "2026-08-10", "the rolling window must cover seven days");

for (let i = 0; i < rolling.length; i += 1) {
  assert.equal(rolling[i].tasks.length, 1, `expected one task on ${rolling[i].date}`);
  assert.ok(TASKS[rolling[i].tasks[0]], `missing task definition for ${rolling[i].tasks[0]}`);
  if (i > 0) {
    const previous = new Date(rolling[i - 1].date + "T12:00:00");
    previous.setDate(previous.getDate() + 1);
    assert.equal(rolling[i].date, previous.toISOString().slice(0, 10), "rolling dates must be consecutive");
  }
}

assert.equal(new Set(rolling.flatMap(item => item.tasks)).size, rolling.length, "rolling task IDs must be date-safe and unique");
assert.deepEqual(SCHEDULE.find(item => item.date === "2026-08-04").tasks, ["move_books_aug03"], "today must retain the books task Cyrus pushed here");
assert.doesNotMatch(dataSource, /move_kitchen_aug04/, "the disliked kitchen starter must be removed from the active data");
assert.equal(rolling.some(item => item.date >= "2026-05-29" && item.date <= "2026-07-10"), false, "the obsolete whole-house plan must stay absent");
for (const milestone of ["2026-08-17", "2026-08-24", "2026-08-30", "2026-08-31"]) {
  assert.ok(SCHEDULE.some(item => item.date === milestone), `missing move milestone ${milestone}`);
}

const oneTaskStart = html.indexOf("function oneTaskForDate");
const oneTaskEnd = html.indexOf("function anyHouseTaskLeft", oneTaskStart);
const oneTaskSource = html.slice(oneTaskStart, oneTaskEnd);
assert.match(oneTaskSource, /effectiveTasksForDate\(dateStr\)/, "pushed rolling tasks must retain their effective date");
assert.ok(oneTaskSource.indexOf("if(scheduled.length) return scheduled[0]") < oneTaskSource.indexOf("if(dow===1) return null"), "scheduled tasks must win before Monday rest");
assert.match(html, /else if\(dow===1 && !oneId\)/, "Monday may rest only when no rolling task exists");
assert.doesNotMatch(html, /const oneId=\(dow===1\)\?null:oneTaskForDate/, "Today must not discard Monday's rolling task");

const pushed = {};
const oneTaskForDate = new Function("SCHEDULE", "TASKS", "pushed", `
  const checked = {}, taskCustom = {}, NO_PROGRESS = new Set(), RHYTHM_ROOM_ORDER = [];
  function effectiveTasksForDate(ds){
    const base = (SCHEDULE.find(item => item.date === ds)?.tasks || []).filter(id => !pushed[id] || pushed[id] === ds);
    const here = Object.entries(pushed).filter(([, date]) => date === ds).map(([id]) => id);
    return [...new Set([...base, ...here])];
  }
  function roomTaskEntries(){ return []; }
  ${oneTaskSource}
  return oneTaskForDate;
`)(SCHEDULE, TASKS, pushed);
assert.equal(oneTaskForDate("2026-08-10"), "move_docs_aug10", "the Monday rolling task must appear instead of rest");
pushed.move_docs_aug10 = "2026-08-11";
assert.equal(oneTaskForDate("2026-08-10"), null, "a pushed-away task must not be replaced by unrelated housework");

assert.equal(PAUSED_FLIP_SCAN.paused, true, "the flip scan must remain paused while Cyrus moves and house hunts");
assert.equal(PAUSED_FLIP_SCAN.label, "Morning flip scan — free TVs, mowers, curb alerts", "the paused idea must be saved intact for later");
assert.equal(PAUSED_FLIP_SCAN.links.length, 5, "the paused search links must remain saved without rendering");
assert.match(PAUSED_FLIP_SCAN.resume, /No date chosen/, "the paused idea must not invent a restart date");
assert.equal(TV_FOLLOWUP.label, "Fix or get rid of the TV I found", "the separate move-relevant reminder must focus on the TV already found");
assert.deepEqual(TV_FOLLOWUP.links, [], "the TV follow-up must not inherit paused deal-hunting links");
assert.doesNotMatch(html, /PAUSED_FLIP_SCAN/, "the paused flip scan must not be rendered on Today or Timeline");
assert.match(html, /TV_FOLLOWUP/, "the move-relevant TV follow-up must remain separate from the paused idea");
assert.match(html, /TV follow-up — done for today/, "the completed TV reminder must retain its compact state");

console.log("schedule keeper regression checks passed");
