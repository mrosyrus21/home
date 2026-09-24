"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const checklist = fs.readFileSync(path.join(root, "today-checklist.js"), "utf8");
const checklistCss = fs.readFileSync(path.join(root, "today-checklist.css"), "utf8");

const stepStart = html.indexOf("function todaySectionStep");
const stepEnd = html.indexOf("function todaySectionBox", stepStart);
assert.ok(stepStart >= 0 && stepEnd > stepStart, "missing the pure Today section transition helper");
const stepSource = html.slice(stepStart, stepEnd);
const todaySectionStep = new Function(
  "const TODAY_CLEAR_MS=950;" + stepSource + ";return todaySectionStep;"
)();

let result = todaySectionStep(undefined, false, 100);
assert.equal(result.mode, "active", "an unfinished section must start active");
assert.equal(result.entered, false, "initial load must not fake a transition");

result = todaySectionStep(undefined, true, 100);
assert.equal(result.mode, "hidden", "an already-finished section must stay out of the way on refresh");
assert.equal(result.entered, false, "refresh must not replay a completion celebration");

const active = todaySectionStep(undefined, false, 100).state;
result = todaySectionStep(active, true, 200);
assert.equal(result.mode, "celebrate", "a real completion must get a brief success state");
assert.equal(result.entered, true, "the first completion edge must be announced once");
assert.equal(result.state.until, 1150, "the success state must use the short fixed clear window");

const celebrating = result.state;
result = todaySectionStep(celebrating, true, 300);
assert.equal(result.mode, "celebrate", "a Firebase echo must not cut the success state short");
assert.equal(result.entered, false, "a Firebase echo must not replay the announcement");
assert.equal(result.state.until, 1150, "a Firebase echo must not extend the success timer");

result = todaySectionStep(celebrating, true, 1200);
assert.equal(result.mode, "hidden", "a completed section must clear after its success window");

result = todaySectionStep(result.state, false, 1300);
assert.equal(result.mode, "active", "undo must restore the active card");
result = todaySectionStep(result.state, true, 1400);
assert.equal(result.mode, "celebrate", "a later genuine re-completion may celebrate again");
assert.equal(result.entered, true);

assert.doesNotMatch(html, /Today's 3/, "the redundant Today's 3 card and completion copy must stay removed");
assert.match(checklist, /key:'vitamin'[^\n]+done:!!laundry\['well-litfulo-' \+ date\]/, "the replacement reminder must use the existing saved vitamin completion state");
assert.match(checklist, /label:'Vitamins \+ Litfulo'/, "Today must show one focused reminder that accurately names the whole lineup");
assert.match(checklist, /key === 'vitamin'\) return toggleWellness\('litfulo'\)/, "the morning reminder must retain the existing history action");
assert.match(checklist, /type="button" class="td-check" aria-label="Complete: /, "checklist completion must be labeled and keyboard accessible");
assert.match(checklist, /todaySectionState\('checklist:' \+ item\.key, item\.done\)/, "every checklist item must use the standard completion-and-collapse controller");
assert.match(checklist, /key:'water'[^\n]+done:waterCount\(\) >= waterGoal\(\)/, "Water may clear only after the actual bottle goal");
assert.doesNotMatch(html, /function habitsTodayHtml/, "the old oversized habits block must stay removed");
assert.doesNotMatch(html, /hydrationCard\("afternoon"/, "the duplicate afternoon hydration card must stay removed");
assert.match(html, /id="today-status"[^>]*role="status"[^>]*aria-live="polite"/, "completion feedback needs one persistent accessible status region");
assert.match(html, /window\.__stateHydrated = true;[\s\S]{0,100}clearTimeout\(fbTimeout\)/, "completion transitions must wait for saved state hydration");
assert.match(html, /if\(result\.mode==="celebrate"\) todaySectionSchedule\(\)/, "every still-visible success state must keep its clear timer scheduled");
assert.match(html, /if\(!window\.__stateHydrated\) return \{mode:done\?"hidden":"active",entered:false\}/, "checklist wins must wait for saved-state hydration");
assert.match(html, /window\.__todaySections\.date!==date[\s\S]{0,220}?items:\{\}/, "completion baselines must reset at the date boundary");
assert.match(checklistCss, /prefers-reduced-motion:reduce[\s\S]*?animation:none!important/, "completion motion must honor reduced-motion preferences");
assert.match(checklist, /Done today/, "cleared items need one collapsed undo/history drawer");
assert.match(checklist, /workout:false, done:false/, "the completion drawer must default to collapsed");
assert.doesNotMatch(checklist, /Day complete/, "Today must not make an unsafe all-day completion claim");
assert.match(checklist, /all = model\.morning\.concat\(model\.items\)/, "completion handling must use only the chosen checklist items");
assert.doesNotMatch(checklist, /today-agenda-head|agendaHtml\(active,nowM\)/, "time lanes must not clutter Today");
assert.match(checklist, /key:'newhome'[^\n]+done:!!laundry\['newhome-one-' \+ date\]/, "Today's new-house one thing must use its own completion state");

const waterStart = checklist.indexOf("function todayChecklistWater");
const waterEnd = checklist.indexOf("function renderTodayChecklist", waterStart);
const waterRow = new Function("window", "waterCount", "waterGoal", "waterServing", checklist.slice(waterStart, waterEnd) + ";return todayChecklistWater;")(
  {__stateHydrated:true}, () => 1, () => 3, () => 2
)({mode:"active"});
assert.match(waterRow, /class="td-water-add" type="button"/, "water logging must remain a keyboard control");
assert.match(waterRow, /\+2 bottles/, "water logging copy must respect the configured per-tap amount");
assert.match(waterRow, />Undo 1<\/button>/, "active Water undo copy must match the amount it can remove");
assert.match(waterRow, /role="progressbar" aria-label="Daily water goal"[^>]+aria-valuenow="1"/, "the compact water count must remain accessible");
assert.match(checklist, /key === 'water'\) return undo \? waterUndo\(\) : waterAdd\(\)/, "active and completed Water undo must use the existing per-tap action");

// Exercise the new undo routes against the real morning history helpers.
const date = "2026-09-23", writes = [];
const context = vm.createContext({
  window:{__stateHydrated:true},
  laundry:{["morning-stretch-" + date]:true, "morning-stretch-2026-09-22":true, ["health-workout-" + date]:true, "health-workout-2026-09-22":true},
  almanacFlow:{[date]:{tasks:{health:{status:"done",completedAt:123,snoozedUntil:456}}}},
  ALMANAC_MORNING:[{id:"health"}],
  todayKey:() => date,
  almanacRoutineTasks:() => [{id:"health"}],
  ST:{update:updates => writes.push(JSON.parse(JSON.stringify(updates)))},
  renderAll:() => {}, toast:() => {},
});
const morningStart = html.indexOf("function almanacDayState");
const morningEnd = html.indexOf("function almanacOutdoorDue", morningStart);
const persistStart = html.indexOf("function almanacPersist");
const persistEnd = html.indexOf("function almanacHold", persistStart);
const actionStart = checklist.indexOf("function todayChecklistAction");
const actionEnd = checklist.indexOf("function todayChecklistItems", actionStart);
vm.runInContext(html.slice(morningStart, morningEnd) + html.slice(persistStart, persistEnd) + checklist.slice(actionStart, actionEnd), context);
context.todayChecklistAction("morning:health", true);
assert.equal(context.laundry["morning-stretch-" + date], false, "morning undo must clear its canonical laundry key");
assert.equal(context.almanacFlow[date].tasks.health.status, "active", "morning undo must restore the step's active state");
assert.equal(context.almanacFlow[date].tasks.health.completedAt, undefined, "morning undo must clear the completion timestamp");
assert.equal(context.almanacFlow[date].tasks.health.snoozedUntil, undefined);
assert.equal(writes[0]["laundry/morning-stretch-" + date], false, "morning undo must persist its canonical key");
assert.ok(writes[0]["almanacFlow/" + date], "morning undo must persist the updated flow state together");
assert.equal(context.laundry["morning-stretch-2026-09-22"], true, "morning undo must not change prior history");
context.todayChecklistAction("morning:health", false);
assert.equal(context.laundry["morning-stretch-" + date], true, "a morning step must be completable again after undo");
assert.equal(context.laundry["well-workout-" + date], undefined, "morning mobility must not synthesize a workout completion");
assert.equal(context.laundry["health-workout-" + date], true, "morning actions must not alter existing workout history");
context.todayChecklistAction("movement", true);
assert.equal(context.laundry["well-workout-" + date], false, "explicit workout undo must clear the current key");
assert.equal(context.laundry["health-workout-" + date], false, "explicit workout undo must also clear the legacy key");
assert.deepEqual(writes.at(-1), {["laundry/well-workout-" + date]:false, ["laundry/health-workout-" + date]:false}, "workout undo must persist only the two current-date workout keys");
assert.equal(context.laundry["health-workout-2026-09-22"], true, "workout undo must preserve prior dates");
context.window.__stateHydrated = false;
const before = writes.length;
context.todayChecklistAction("morning:health", true);
context.todayChecklistAction("movement", true);
assert.equal(writes.length, before, "actions must not overwrite history before saved state hydrates");

console.log("Today completion regression checks passed");
