"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {fixture} = require("./today-focus.test.js");
const root = path.join(__dirname, "..");
const data = fs.readFileSync(path.join(root, "data.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const {HEALTH_COACH, ALMANAC_MORNING} = new Function(data + ";return {HEALTH_COACH,ALMANAC_MORNING};")();
const helpers = html.slice(html.indexOf("function fitnessDateAtNoon"), html.indexOf("function _hd("));
const wellnessSource = html.slice(html.indexOf("function fitnessPlanForDate("), html.indexOf("function renderWellness("));
const api = new Function("HEALTH_COACH", `
  function hcCfg(){return HEALTH_COACH;}
  function todayKey(){return "2026-11-07";}
  const laundry={};
  function healthCoachState(){return {rescue:false,pastBed:false,wc:1,meals:2,workoutAllowed:true};}
  function almanacEsc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  ${helpers}
  ${wellnessSource}
  return {fitnessMonth1PlanForDate,fitnessWorkoutDetailsHtml,fitnessFullScheduleHtml,fitnessSectionHtml};
`)(HEALTH_COACH);
const guide = HEALTH_COACH.workouts.month1.guide;
for (const key of ["strengthA","strengthB","strengthC"]) {
  assert.equal(guide.planKeys[key].length,6);
  const detail = api.fitnessWorkoutDetailsHtml({workoutKey:key,week:1});
  assert.equal((detail.match(/class="fg-exercise"/g)||[]).length,6);
  assert.match(detail,/60-90 seconds/);
  assert.match(detail,/One round is one set/);
  assert.match(detail,/1 easy round/);
  assert.match(detail,/not a required starting weight/);
  assert.doesNotMatch(detail,/onclick=|onchange=/,"reading the guide cannot log exercise");
  for (const id of guide.planKeys[key]) {
    const ex = guide.exercises[id];
    assert.ok(ex.dose && ex.why && ex.load && ex.easier && ex.watch && ex.steps.length>=3);
  }
}
const first = api.fitnessMonth1PlanForDate("2026-11-07");
assert.equal(first.workoutKey,"strengthA");
assert.match(api.fitnessWorkoutDetailsHtml(first),/baseline photos/);
assert.doesNotMatch(api.fitnessWorkoutDetailsHtml(api.fitnessMonth1PlanForDate("2026-11-09")),/baseline photos/);
assert.match(api.fitnessWorkoutDetailsHtml(api.fitnessMonth1PlanForDate("2026-11-14")),/Walk outside/);
assert.match(HEALTH_COACH.workouts.month1.jaw.text,/not evidence-based/);
assert.doesNotMatch(HEALTH_COACH.workouts.month1.jaw.text,/move up only/);
const f=fixture("2026-11-07",7);
f.c.ALMANAC_MORNING=ALMANAC_MORNING;
f.c.fitnessMonth1PlanForDate=api.fitnessMonth1PlanForDate;
f.c.fitnessWorkoutDetailsHtml=api.fitnessWorkoutDetailsHtml;
f.c.renderAll();
assert.match(f.view.innerHTML,/See workout/);
assert.match(f.view.innerHTML,/Per round: 6-8 reps/);
assert.match(f.view.innerHTML,/60-90 seconds/);
assert.equal(f.writes.length,0);
f.c.todayChecklistDisclosure("workout",true);
f.c.renderAll();
assert.match(f.view.innerHTML,/class="td-plan" open/);
assert.equal(f.writes.length,0);
const section=html.slice(html.indexOf("function fitnessSectionHtml("),html.indexOf("function renderWellness("));
assert.doesNotMatch(section,/<div onclick="toggleWellness/);
assert.match(section,/type="checkbox"/);
assert.match(section,/fitnessWorkoutDetailsHtml\(plan\)/);
assert.match(api.fitnessFullScheduleHtml("2026-11-07"),/Technique references/);
const wellnessFirst=api.fitnessSectionHtml("2026-11-07");
assert.match(wellnessFirst,/Strength A/);
assert.match(wellnessFirst,/Day 1 · Week 1/);
assert.match(wellnessFirst,/Week 1: RPE 5/);
assert.match(wellnessFirst,/1 easy round/);
assert.match(wellnessFirst,/baseline photos/);
assert.doesNotMatch(wellnessFirst,/type="checkbox" checked/);
assert.match(api.fitnessSectionHtml("2026-11-14"),/Optional longer walk/);
assert.doesNotMatch(api.fitnessSectionHtml("2026-11-14"),/Day 1 ·/);
console.log("Workout walkthroughs, beginner options, sources and read-without-completion checks passed");
module.exports={api,fixtureHtml:f.view.innerHTML};
