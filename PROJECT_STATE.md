# House Project — State & Handoff

This file tracks staged changes to the Home & Garden schedule site (`mrosyrus21/home`,
https://mrosyrus21.github.io/home/). Deploys happen ONLY from the Master Shake chat, ONLY after
Cyrus says "GO LIVE."

---

## Section 10 — Staged changes (awaiting GO LIVE)

### 2026-07-07 — Health-coach schedule layer

**Status:** STAGED in the House working folder. NOT pushed. Holding for "GO LIVE."

**What changed:**
- Added a health-coach layer to Today so food, hydration, sleep, and movement outrank house/admin tasks.
- `data.js` now defines wake water, afternoon hydration, workout timing, protein-focused meal anchor copy, rescue meal options, and a 3-month two-dumbbell training structure.
- `index.html` now computes a daily health state: missed meals, low water, underfed/dehydrated flags, bedtime/late-night rescue mode, strength vs recovery day, and workout gating.
- Late-night rescue mode suppresses alarm/project pins, rollover task management, house tasks, and manual schedule tasks. It shows only water, easy protein + carbs, bathroom/teeth/bed guidance.
- Today now includes wake-water and afternoon hydration checkpoints, plus a movement card that only unlocks after enough food/water and before bedtime.
- Health tab now has a Health Coach section with protein/hydration targets, Tue/Thu/Sat dumbbell strength plan, recovery-day movement, rescue meals, and the no-guilt rule.
- `dayarc.js` now shows wake water, hydration, and movement markers alongside meals, wind-down, and bedtime.
- Cache-busters updated for `data.js`, `dayarc.js`, and `sw.js`; `LAST_DEPLOY` restamped for the staged build.

**Exact locations:**
- `data.js` top rhythm block: `RHYTHM`, `MEAL_ANCHORS`, new `HEALTH_COACH`.
- `index.html`: health helpers after `mealAnchorHtml`, Today flow inside `renderToday`, Health tab section before Vitamins & Meds.
- `dayarc.js`: `tasks()` marker list.
- `sw.js`: cache/refresh stamp.

**Verification to run before GO LIVE:**
1. `node --check data.js`
2. Extract the inline script from `index.html` and run `node --check` on it.
3. `node --check dayarc.js`
4. `node --check sw.js`
5. Render-test Today, Timeline, Health, and the other tabs with the existing stubbed DOM/Firebase harness.

**Safe deploy notes:**
- Deploy only after Cyrus says "GO LIVE."
- A GO LIVE deploy will include all currently staged file-level changes in `data.js`, `index.html`, `dayarc.js`, and `sw.js`, including earlier weather/trip/plant/manual-schedule work already present in the working tree.

### 2026-06-27 — Add "Set up paid website testing" to-do to the schedule

**Status:** STAGED in the House working folder. NOT pushed. Holding for "GO LIVE."

**What changed:**
A new to-do was added to the schedule app and slotted onto today (2026-06-27):
- **New task `paid_testing`** in the `TASKS` map (room: `priority`, level: `easy`) — label
  "💻 Set up paid website testing — earn from the couch," with a note (realistic $150–$400/mo,
  no driving, $0 upfront) and a 7-step checklist: set up PayPal first, then sign up for
  UserTesting, Userlytics, PlaybookUX, and Respondent.io + Enroll (the big-money research
  interviews), fill every profile out 100%, and grab screeners fast (expect ~1 in 5 to qualify).
- **Scheduled it on 2026-06-27**: appended `"paid_testing"` to that date's `tasks` array and
  added a "💻 set up paid website testing" mention to the day's note.

**Why:**
Cyrus is cashflow-negative by ~$324/mo and wanted a low-effort, no-driving income stream tracked
on his daily schedule. Full step-by-step lives in the Financial Stability project
(`Paid Testing - Setup Checklist.md`).

**Exact location — both edits are in `data.js` (NOT index.html):**
> Note: `TASKS` and `SCHEDULE` live in `data.js` per its own header ("Edit plant/task/room data
> HERE"). index.html only holds CONFIG/EYEBROWS/LAST_DEPLOY.
- `data.js` ~line 62 — `paid_testing:` task definition, inserted directly after the `vacuum:` entry
  (last entry in the PRIORITY block, just before the `// ── KITCHEN ──` comment).
- `data.js` ~line 205 — the `{ date:"2026-06-27", ... }` SCHEDULE entry now includes
  `"paid_testing"` and an updated note.

**Verification done:**
- Host file confirmed complete and intact via the host-side reader (ends at line 754 with `};`,
  all finance tips present); both `paid_testing` references confirmed present (grep count = 2).
- `node --check` on the bash mount FAILED on a pre-existing line ~741 finance tip — this is the
  known OneDrive sync-lag truncation (the mount served a cut-off copy), NOT a problem with this
  edit, which sits far above it. **At deploy time, run `node --check data.js` on the FRESH CLONE**
  (Method A handles this) to validate before pushing.

**Safe deploy steps (GO LIVE):**
1. Clone `mrosyrus21/home` fresh using the token already in the OneDrive git remote (never print/commit it).
2. Copy `data.js` (and any other changed files) into the clone.
3. Bump cache-busters to a new timestamp: `data.js?v=` in index.html and the `hg-cache-` / `hg-v##`
   string in `sw.js`. Restamp `LAST_DEPLOY`.
4. Run `node --check data.js` and confirm index.html ends in `</html>`.
5. Commit and push to `main`.
6. Sync changed files back into the House folder so Windows and the repo match, then verify the
   commit landed / the live URL loads before reporting success.

> Heads-up: the earlier-staged **"Launch Kai" (`kai_launch`)** and the 2026-06-21 cleanup are also
> still staged in this working copy — a GO LIVE now deploys all of them together.

---

### 2026-06-27 — Add "Launch Kai" to-do to the schedule

**Status:** STAGED in the House working folder. NOT pushed. Holding for "GO LIVE."

**What changed:**
A new to-do was added to the schedule app and slotted onto today (2026-06-27):
- **New task `kai_launch`** in the `TASKS` map (room: `priority`, level: `easy`) — label
  "🎬 Launch \"Kai\" — render & post the free tester video," with a note and a 6-step checklist
  covering: make a brand Gmail, claim the `heyitskai` handle across TikTok/IG/YouTube/FB Page/
  Snapchat (creator mode), render the free HeyGen tester, edit in CapCut, post to TikTok with the
  AI label on, and read the 48–72 hr reaction.
- **Scheduled it on 2026-06-27**: appended `"kai_launch"` to that date's `tasks` array and added
  "Plus ⭐ kick off Kai — render & post the free tester video." to the day's note.

**Why:**
Cyrus asked to put the Kai content-channel launch (the free tester step) on his schedule as a
to-do so it's tracked alongside his daily tasks. Full plan/scripts live in the Financial
Stability project (`kai-launch-plan.md`, `kai-week1-pack.md`).

**Exact location — both edits are in `data.js` (NOT index.html):**
> Note: `TASKS` and `SCHEDULE` live in `data.js` per its own header ("Edit plant/task/room data
> HERE"). index.html only holds CONFIG/EYEBROWS/LAST_DEPLOY.
- `data.js` ~line 53 — `kai_launch:` task definition, inserted directly after the `rx_setup:` entry.
- `data.js` ~line 204 — the `{ date:"2026-06-27", ... }` SCHEDULE entry now includes `"kai_launch"`.

**Verification done:**
- Host file confirmed complete and intact (ends at line 754 with `};`); both edits present and
  well-formed.
- `node --check` could NOT be run cleanly because the Linux/bash mount was serving a
  truncated copy (the known OneDrive sync-lag gotcha — it cut off at line 746, a pre-existing
  finance tip far from this edit). **At deploy time, run `node --check data.js` on the FRESH
  CLONE** (Method A handles this) to validate before pushing.

---

### 2026-06-21 — schedule cleanup (dermatologist, romaine, burn, headrest, herbs, TV triage)

**Status:** STAGED in the House working folder. "go live" requested.

**What changed:**
1. Removed "Call the dermatologist" reminder — `data.js` REMINDERS (`rem_derm`).
2. Removed the "Regrow a romaine head" project card — `index.html` PIN_OPEN (`proj_romaine`, ~line 1703).
3. Removed the "Burn healed & skin fully closed → silicone scar gel" reminder — `index.html` BURN_CARE block (~lines 1830–1840); wounds healed.
4. Relabeled the headrest print item to "🛠️ 3D print: new clean gyroid headrest" — `index.html` seed (~line 4132) + a one-time relabel migration (flag `rollover-headrest-gyroid-v2`) so the existing saved app item updates.
5. Trimmed "After work:" off the TV-triage task; herbs reminder now "Get thyme plant/seeds" (saffron + cilantro obtained) — `data.js` REMINDERS.
6. Bumped cache-busters: `data.js?v=20260621-go1` (index.html), `hg-cache-20260621-go1` (sw.js).

**Heads-up:** the earlier-staged **"Launch Kai" to-do (`kai_launch`)** is still in this working data.js — a GO LIVE now deploys it too.

**Still PENDING (not in this batch):**
- "Look into unfiltered avocado" — in-app task (Firebase), not in code → delete it in the app.
- Romaine + avocado-seed CARE instructions on the Plants page — needs Plants-schema work, not yet added.
- Reorganize the Today page order — pending Cyrus's preferred order.

---

### SAFE DEPLOY STEPS — only run on "GO LIVE"

**Method A — clone fresh (preferred from sandbox):**
1. Clone `mrosyrus21/home` fresh using the token already in the OneDrive git remote (keep token masked).
2. Copy the changed `data.js` into the clone.
3. Bump cache-busters so browsers pick up the new build: `data.js?v=` in `index.html` and the
   `hg-cache-` / `hg-v##` string in `sw.js`, both to a new timestamp. Restamp `LAST_DEPLOY`.
4. Run `node --check data.js` and `node --check index.html`; confirm `index.html` ends in `</html>`
   and `data.js` ends in `};`.
5. Commit and push to `main`.
6. Sync the changed files back into the House folder so Windows and the repo match.
7. Confirm the push landed (check the commit / load the live URL) before reporting success.

**Method B — DEPLOY.bat (Windows one-click fallback):**
- Copy changed files into the `home` folder, double-click `DEPLOY.bat`, let it finish (do NOT
  Ctrl+C). Last line `[DONE] Pushed to GitHub Pages` = success; `[ERR]` = paste it back.

**After deploy:** force the new build — phone: pull-to-refresh twice or fully close/reopen the
app; desktop: Ctrl+Shift+R.
