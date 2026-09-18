"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

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
assert.match(html, /const vitaminDone=!!hd\.vit/, "the replacement reminder must use the existing saved vitamin completion state");
assert.match(html, /💊 Vitamin reminder/, "Today must show one focused vitamin reminder");
assert.match(html, /type="button" onclick="toggleWellness\('litfulo'\)" aria-label="Record morning Litfulo and vitamins taken"/, "the morning reminder must retain the existing history key, describe it accurately, and support keyboard control");
assert.match(html, /todaySectionState\("vitamins",vitaminDone\)/, "the vitamin reminder must use the standard completion-and-collapse controller");
assert.match(html, /waterDone=wc>=goal/, "Water may clear only after the actual bottle goal");
assert.doesNotMatch(html, /function habitsTodayHtml/, "the old oversized habits block must stay removed");
assert.doesNotMatch(html, /hydrationCard\("afternoon"/, "the duplicate afternoon hydration card must stay removed");
assert.match(html, /id="today-status"[^>]*role="status"[^>]*aria-live="polite"/, "completion feedback needs one persistent accessible status region");
assert.match(html, /window\.__stateHydrated = true;[\s\S]{0,100}clearTimeout\(fbTimeout\)/, "completion transitions must wait for saved state hydration");
assert.match(html, /if\(result\.mode==="celebrate"\) todaySectionSchedule\(\)/, "every still-visible success state must keep its clear timer scheduled");
assert.match(html, /const canCelebrateFlow=!!window\.__stateHydrated&&!!window\.__flowBaselineReady/, "ordinary task wins must wait for a hydrated baseline");
assert.match(html, /if\(window\.__flowBaselineDate!==today\)[\s\S]{0,220}?window\.__flowBaselineReady=false/, "ordinary task baselines must reset at the date boundary");
assert.match(html, /if\(canCelebrateFlow&&it\.done&&window\.__flowPrev\[it\.key\]===false\)/, "only a real post-baseline completion edge may celebrate");
assert.match(html, /if\(window\.__stateHydrated\) window\.__flowBaselineReady=true/, "the first hydrated render must become the quiet baseline");
assert.match(html, /prefers-reduced-motion:reduce[\s\S]*?\.today-win/, "completion motion must honor reduced-motion preferences");
assert.match(html, /Completed today/, "cleared items need one collapsed undo/history drawer");
assert.doesNotMatch(html, /Day complete/, "Today must not make an unsafe all-day completion claim");
assert.match(html, /const visibleFlow=flow\.filter/, "completion handling must use only the chosen Today cards");
assert.doesNotMatch(html.slice(html.indexOf("function renderToday"), html.indexOf("// Build a full date-indexed map", html.indexOf("function renderToday"))), /today-agenda-head|agendaHtml\(active,nowM\)/, "the removed day meter and time lanes must not clutter Today");
assert.match(html, /if\(habitCards\.vitaminDone\)[\s\S]{0,220}?<span>Morning lineup<\/span>/, "completed morning lineup must move into the collapsed completion drawer");
assert.match(html, /<button type="button" class="today-water-step next"[^>]*aria-label=/, "the next water cell must be a labeled keyboard control");
assert.match(html, /undoN=Math\.min\(waterServing\(\),wc\)/, "active Water undo copy must match the configured per-tap amount");
assert.match(html, /undoWater=Math\.min\(waterServing\(\),habitCards\.wc\)/, "collapsed Water undo copy must match the amount it removes");
assert.match(html, /add\("newhome",800,newHomeDone,strip\(/, "Today's new-house one thing must use its own completion state");

console.log("Today completion regression checks passed");
