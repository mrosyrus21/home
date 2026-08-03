"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const dataSource = fs.readFileSync(path.join(root, "data.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const { SCHEDULE, TASKS } = new Function(dataSource + ";return {SCHEDULE,TASKS};")();

const rolling = SCHEDULE.filter(item => item.date < "2026-08-17");
assert.equal(rolling.length, 7, "the rolling window must contain exactly seven days");

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
assert.equal(oneTaskForDate("2026-08-03"), "move_books_aug03", "the Monday rolling task must appear instead of rest");
pushed.move_books_aug03 = "2026-08-10";
assert.equal(oneTaskForDate("2026-08-03"), null, "a pushed-away task must not be replaced by unrelated housework");

console.log("schedule keeper regression checks passed");
