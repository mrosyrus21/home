"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const dataSource = fs.readFileSync(path.join(root, "data.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const { HEALTH_COACH } = new Function(dataSource + ";return {HEALTH_COACH};")();

assert.deepEqual(HEALTH_COACH.workouts.strengthDays, [1, 3, 5]);
assert.equal(HEALTH_COACH.workouts.month1.startDate, "2026-07-31");

const helperStart = html.indexOf("function fitnessDateAtNoon");
const helperEnd = html.indexOf("function _hd(", helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, "workout schedule helpers must remain present");
const helpers = html.slice(helperStart, helperEnd);
const api = new Function("HEALTH_COACH", `
  function hcCfg(){ return HEALTH_COACH; }
  function todayKey(){ return "2026-07-31"; }
  function almanacEsc(s){ return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  ${helpers}
  return { fitnessMonth1PlanForDate, fitnessGateMessage, fitnessFullScheduleHtml };
`)(HEALTH_COACH);

const first = api.fitnessMonth1PlanForDate("2026-07-31");
assert.equal(first.type, "strength");
assert.equal(first.workoutKey, "strengthA");
assert.equal(first.title, "Strength A");
assert.equal(first.badge, "Day 1 · Week 1");
assert.match(first.coach, /First workout back/);
assert.match(first.list.join("\n"), /Goblet squat/);
assert.match(first.list.join("\n"), /Jaw exerciser finisher/);

assert.equal(api.fitnessMonth1PlanForDate("2026-08-01").title, "Optional longer walk");
assert.equal(api.fitnessMonth1PlanForDate("2026-08-02").title, "Recovery + tiny reset");
assert.equal(api.fitnessMonth1PlanForDate("2026-08-03").workoutKey, "strengthA");
assert.equal(api.fitnessMonth1PlanForDate("2026-08-05").workoutKey, "strengthB");
assert.equal(api.fitnessMonth1PlanForDate("2026-08-07").workoutKey, "strengthC");
assert.equal(api.fitnessMonth1PlanForDate("2026-08-14").workoutKey, "strengthA");
assert.match(api.fitnessMonth1PlanForDate("2026-08-21").title, /easier Friday/);

assert.match(api.fitnessGateMessage({ rescue:false, pastBed:false, wc:0, meals:0 }), /water \+ protein/);
assert.match(api.fitnessGateMessage({ rescue:false, pastBed:true, wc:3, meals:3 }), /bedtime is protected/);
assert.match(api.fitnessFullScheduleHtml("2026-07-31"), /Today: Friday - Strength A/);

assert.doesNotMatch(html, /Workout waits:|Movement day[^<]*· gated|Strength days · Tue \/ Thu \/ Sat/);
assert.doesNotMatch(html, /rem-jaw-/, "the jaw exerciser must not return as a redundant daily reminder");

console.log("workout schedule regression checks passed");
