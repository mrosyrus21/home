"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const dataSource = fs.readFileSync(path.join(root, "data.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const { HEALTH_COACH } = new Function(dataSource + ";return {HEALTH_COACH};")();

assert.deepEqual(HEALTH_COACH.workouts.strengthDays, [1, 3, 5]);
assert.equal(HEALTH_COACH.workouts.month1.startDate, "2026-10-30");
assert.equal(HEALTH_COACH.restart.formalStart, HEALTH_COACH.workouts.month1.startDate);
assert.equal(HEALTH_COACH.restart.moveDate, "2026-08-30");
assert.equal(HEALTH_COACH.restart.onRampStart, "2026-09-01");

const helperStart = html.indexOf("function fitnessDateAtNoon");
const helperEnd = html.indexOf("function _hd(", helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, "workout schedule helpers must remain present");
const helpers = html.slice(helperStart, helperEnd);
const api = new Function("HEALTH_COACH", `
  function hcCfg(){ return HEALTH_COACH; }
  function todayKey(){ return "2026-10-30"; }
  function almanacEsc(s){ return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  ${helpers}
  return { fitnessMonth1PlanForDate, fitnessGateMessage, fitnessPlanAllowed, fitnessFullScheduleHtml };
`)(HEALTH_COACH);

const beforeMove = api.fitnessMonth1PlanForDate("2026-08-29");
assert.equal(beforeMove.title, "Install the new-house anchors now");
assert.equal(beforeMove.type, "mobility");

const moveDay = api.fitnessMonth1PlanForDate("2026-08-30");
assert.equal(moveDay.type, "move");
assert.equal(moveDay.title, "Move day counts as exercise");
assert.match(moveDay.list.join("\n"), /Lunch happens/);

assert.equal(api.fitnessMonth1PlanForDate("2026-08-31").title, "Minimum-viable health day");
assert.equal(api.fitnessMonth1PlanForDate("2026-09-01").title, "Property walk + mobility");
assert.equal(api.fitnessMonth1PlanForDate("2026-09-02").workoutKey, "tutorial");
assert.equal(api.fitnessMonth1PlanForDate("2026-09-04").workoutKey, "tutorial");
assert.equal(api.fitnessMonth1PlanForDate("2026-09-05").title, "Health setup + optional property walk");
assert.equal(api.fitnessMonth1PlanForDate("2026-09-06").title, "Recovery + weekly reset");

const first = api.fitnessMonth1PlanForDate("2026-10-30");
assert.equal(first.type, "strength");
assert.equal(first.workoutKey, "strengthA");
assert.equal(first.title, "Strength A");
assert.equal(first.badge, "Day 1 · Week 1");
assert.match(first.rpe, /Week 1: RPE 5/);
assert.match(first.dose, /^1 easy round/);
assert.match(first.coach, /First workout back/);
assert.match(first.list.join("\n"), /Goblet squat/);
assert.match(first.list.join("\n"), /Jaw exerciser finisher/);

assert.equal(api.fitnessMonth1PlanForDate("2026-10-31").title, "Optional longer walk");
assert.equal(api.fitnessMonth1PlanForDate("2026-11-01").title, "Recovery + tiny reset");
assert.equal(api.fitnessMonth1PlanForDate("2026-11-02").workoutKey, "strengthA");
assert.equal(api.fitnessMonth1PlanForDate("2026-11-03").title, "Walk + mobility");
assert.equal(api.fitnessMonth1PlanForDate("2026-11-04").workoutKey, "strengthB");
assert.equal(api.fitnessMonth1PlanForDate("2026-11-05").week, 1);
assert.equal(api.fitnessMonth1PlanForDate("2026-11-06").workoutKey, "strengthC");
assert.equal(api.fitnessMonth1PlanForDate("2026-11-06").week, 2);
assert.equal(api.fitnessMonth1PlanForDate("2026-11-13").workoutKey, "strengthA");
assert.match(api.fitnessMonth1PlanForDate("2026-11-20").title, /easier Friday/);

assert.match(api.fitnessGateMessage({ rescue:false, pastBed:false, wc:0, meals:0 }), /water \+ protein/);
assert.match(api.fitnessGateMessage({ rescue:false, pastBed:true, wc:3, meals:3 }), /bedtime is protected/);
assert.match(api.fitnessGateMessage({ rescue:false, pastBed:false, wc:0, meals:0 }, beforeMove), /Drink water first/);
assert.equal(api.fitnessPlanAllowed({ rescue:false, pastBed:false, wc:1, workoutAllowed:false }, beforeMove), true);
assert.match(api.fitnessGateMessage({ rescue:false, pastBed:false, wc:1, meals:1 }, moveDay), /Move day is the workout/);
assert.equal(api.fitnessPlanAllowed({ rescue:false, pastBed:false, wc:1, meals:1, workoutAllowed:false }, moveDay), true);
assert.match(api.fitnessFullScheduleHtml("2026-08-29"), /New-house restart runway/);
const restartHtml = api.fitnessFullScheduleHtml("2026-10-30");
assert.match(restartHtml, /Today: Friday - Strength A/);
assert.match(restartHtml, /starts Oct 30/);
assert.match(restartHtml, /Day 1 · Week 1/);
assert.doesNotMatch(restartHtml, /starts Sep 7|2 rounds\./);

// Labels and first-day logic must follow the configured date on later restarts too.
HEALTH_COACH.workouts.month1.startDate = "2026-11-09";
assert.match(api.fitnessFullScheduleHtml("2026-11-09"), /starts Nov 9/);
assert.equal(api.fitnessMonth1PlanForDate("2026-11-09").badge, "Day 1 · Week 1");
assert.equal(api.fitnessMonth1PlanForDate("2026-11-08").phase, true);
HEALTH_COACH.workouts.month1.startDate = "2026-10-30";

assert.doesNotMatch(html, /Workout waits:|Movement day[^<]*· gated|Strength days · Tue \/ Thu \/ Sat/);
assert.doesNotMatch(html, /Monday — rest day/, "Monday's house-task break must not contradict the health plan");
assert.doesNotMatch(html, /rem-jaw-/, "the jaw exerciser must not return as a redundant daily reminder");
assert.doesNotMatch(html, /Esomeprazole — ALONE|Melatonin 3mg \+ L-theanine/);
assert.doesNotMatch(dataSource, /rx_setup/, "the retired reflux-med task must not remain visible in Priority");
assert.match(html, /Today’s health anchors/);
assert.match(html, /healthMiniToggle\('hygiene-am'/);

console.log("workout schedule regression checks passed");
