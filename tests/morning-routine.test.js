"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { fixture } = require("./today-focus.test.js");
const root = path.join(__dirname, "..");
const data = fs.readFileSync(path.join(root, "data.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const { ALMANAC_MORNING, HEALTH_COACH, RHYTHM } =
  new Function(data + ";return {ALMANAC_MORNING,HEALTH_COACH,RHYTHM};")();

assert.deepEqual(ALMANAC_MORNING.map(x => x.id),
  ["sunlight", "water", "snack", "walk", "warmup", "workout"]);
assert.equal(RHYTHM.workout, "7:00 AM");
const day1 = HEALTH_COACH.workouts.month1.startDate;
assert.equal(day1, "2026-11-06");

const planSource = html.slice(html.indexOf("function fitnessDateAtNoon("), html.indexOf("function fitnessGateMessage("));
const planFor = new Function("hcCfg", planSource + ";return fitnessMonth1PlanForDate;")(() => HEALTH_COACH);

function morningFixture(date) {
  const f = fixture(date, 7);
  f.c.ALMANAC_MORNING = ALMANAC_MORNING;
  f.c.almanacRoutineTasks = () => ALMANAC_MORNING.map(x => ({...x, detail:""}));
  f.c.fitnessMonth1PlanForDate = planFor;
  f.c.renderAll();
  return f;
}

const weekday = morningFixture(day1);
const model = weekday.c.todayChecklistItems(day1, 420, {workoutDone:false});
assert.deepEqual(Array.from(model.morning, x => x.key),
  ["morning:sunlight", "morning:water", "morning:snack", "morning:walk", "morning:warmup", "movement"]);
assert.equal(model.morning.at(-1).time, "7 AM");
assert.ok(!model.items.some(x => x.key === "movement"));
assert.equal((weekday.view.innerHTML.match(/data-task="movement"/g) || []).length, 1);
assert.doesNotMatch(weekday.view.innerHTML, /Begin paid work|Make the bed|Protein breakfast/);
assert.equal(weekday.writes.length, 0, "rendering must never write history");
weekday.c.todayChecklistAction("morning:water", false);
weekday.c.todayChecklistAction("morning:snack", false);
weekday.c.todayChecklistAction("morning:warmup", false);
assert.equal(weekday.c.water, 0, "a glass reminder must not log a 32 oz bottle");
assert.equal(weekday.laundry["meal-breakfast-"+day1], undefined, "a snack is not breakfast");
assert.equal(weekday.laundry["well-workout-"+day1], undefined, "warm-up is not workout completion");
weekday.c.todayChecklistAction("movement", false);
assert.equal(weekday.laundry["well-workout-"+day1], true);
weekday.c.todayChecklistAction("movement", true);
assert.equal(weekday.laundry["well-workout-"+day1], false);

const weekend = morningFixture("2026-11-07");
const weekendModel = weekend.c.todayChecklistItems("2026-11-07", 540, {workoutDone:false});
assert.equal(weekendModel.morning.at(-1).time, "After waking");
assert.equal(model.morning.at(-1).label, "Workout: Strength A");
assert.match(weekday.view.innerHTML, /Optional before lifting: take baseline photos/);
assert.doesNotMatch(weekend.view.innerHTML, /baseline photos/);
assert.equal(weekendModel.morning.at(-1).label, "Optional longer walk");
assert.equal(weekend.writes.length, 0);
assert.equal((weekend.view.innerHTML.match(/data-task="movement"/g) || []).length, 1);

const stateSource = html.slice(html.indexOf("function clockMin("), html.indexOf("function healthRescueCard("));
function readiness(log, minutes, meals = 0, bottles = 0) {
  return new Function("laundry", "HEALTH_COACH", "RHYTHM", "mealCount", "bottles",
    "function mealsEaten(){return mealCount;} function waterCount(){return bottles;} function waterGoal(){return 3;}" +
    stateSource + ";return healthCoachState;"
  )(log, HEALTH_COACH, RHYTHM, meals, bottles)(day1, minutes, 5);
}
const water = "morning-water-"+day1, snack = "morning-snack-"+day1;
const log = {[water]:true, [snack]:true};
const snapshot = JSON.stringify(log);
assert.equal(readiness({}, 420).workoutAllowed, false);
assert.equal(readiness(log, 420).strengthDay, true);
assert.equal(readiness({[water]:true}, 420).workoutAllowed, false);
assert.equal(readiness({[snack]:true}, 420).workoutAllowed, false);
assert.equal(readiness(log, 420).workoutAllowed, true, "water + snack support the early workout");
assert.equal(readiness({}, 420, 1, 1).workoutAllowed, true, "a full breakfast also counts");
assert.equal(readiness(log, 1020).workoutAllowed, false, "a morning snack cannot replace later meals");
assert.equal(readiness({}, 780, 2, 2).workoutAllowed, true, "7 AM is a target, not a cutoff");
assert.equal(readiness(log, 1380, 3, 3).workoutAllowed, false, "bedtime remains protected");
assert.equal(JSON.stringify(log), snapshot, "readiness must not synthesize any saved history");

console.log("Compact morning order, workout logging, weekend timing and early fueling checks passed");
