# House Project — State & Handoff

This file tracks staged changes to the Home & Garden schedule site (`mrosyrus21/home`,
https://mrosyrus21.github.io/home/). Only Schedule Keeper (`home-schedule-keeper`) may publish,
after Cyrus authorizes it, from a fresh current-origin worktree with explicitly reviewed files.

---

## Section 10 — Staged changes (awaiting GO LIVE)

### 2026-10-08 — Mobile speed, picture cards and runtime repair

- Cyrus authorized the repair batch after the whole-site audit. Fresh worktree starts at current `origin/main` `b3cf74a`; no dirty shared-worktree code is included. Build/cache `20261008193000`.
- Due watering cards regain the original wide photo layout with only name, short status and Watered action. Other states remain mini cards below. Mechanical uncropped WebP delivery copies reduce all 32 plant photos from 80.79 MB to 1.37 MB; tapping still opens the unchanged full original with existing framing controls.
- Mechanical scenery copies and visible-layer-only loading replace multi-megabyte header downloads. Phones use lightweight tinted backgrounds, no grain layer or continuous weather animations. Task-completion effects remain. Static assets cache safely; failed responses do not poison the offline cache, and first worker activation does not force a second page load.
- Saved-state loading stays blocked until a successful snapshot; nested Firebase writes are guarded before hydration. Snapshot refreshes are coalesced and keep current drafts, selections, focus and open instructions. NWS requests are bounded, shared and reused instead of repeated after every save. Grocery purchases no longer save the same food state twice.
- Restore missing Sleep and Finance helpers through a small selected module, not the entire dormant feature bundle. Correct Rooms difficulty ordering. No plant data, watering dates/history, recipes, user task state or production Firebase records changed by this release.
- Verification: all 11 JavaScript regression suites, original-photo/scenery fidelity tests and 27 mobile views passed; no JavaScript errors, missing local assets or horizontal overflow. Long recipe scrolling, draft retention, pre-hydration write blocking and one weather chain passed in an isolated fixture (no production writes).
- Slow-4G/4x-CPU mobile fixture verified no duplicate Wikimedia background request and no full original photo downloads for cards. Night header fetched only two visible scenery assets (141,166 bytes); all six original initial scene assets totaled 6,289,412 bytes. Fixture isolates external services and is not a promise about real-phone load time.

### 2026-10-08 — Watering finish and reviewed plant corrections

- Published the eight reviewed identity/care corrections, retaining provisional vine/cactus species labels and the user's report that the found cactus piece is rooting well. Two oregano pots remain separate; spinach replaces the pepper guess. Conditional harvest guides total 17, without dated readiness claims.
- Watering stays compact: unchanged original photo, one-line plant name, short status, Watered action, and a closed damp-deferral menu. No watering dates, history, pot IDs, photo bytes/framing, or daily soil-check cadence changed; no live Firebase writes.
- Dated same-origin plant photos now reuse a stable cache on repeat visits. App files and build probes remain fresh; writes and Firebase requests bypass caching. First-time photo downloads still use the originals.
- Fresh release from origin `c58f5cd`; reviewed `data.js`, `index.html`, `sw.js`, this record, and the two watering/service-worker regression files. Build/cache `20261008173000`.

### 2026-10-07 — Remove every watering-card paragraph

- Cyrus says the shortened cues still look like walls of text and asks that pictures remain the same. Watering cards now show only the existing photo, one-line plant name, short status and primary Watered action. Damp deferral remains available in a closed ellipsis menu; full watering and care guidance stays in Care.
- Photo paths, bytes, framing functions and thumbnail dimensions are unchanged. No plant data, watering cadence or saved state changed. Elapsed time is not mislabeled as proof a plant needs water.
- Fresh release from origin `52927a0`; reviewed only `index.html`, `sw.js`, this record and watering regression assertions. Build/cache `20261007210000`.

### 2026-10-07 — Simple watering reminders

- Cyrus requested less overwhelming watering cards: just inform when it is time to water. All watering states now render short compact rows with one moisture-based timing cue; actual-water and damp-deferral controls remain. Watered rows stay at the bottom.
- Existing detailed watering methods, moisture checks and references are preserved in collapsed Watering instructions within Care. Removed repeated daily-check banners, full-card photos, fun facts and daily-check count pressure from the watering view. No automatic watering claim is made from elapsed time.
- No watering dates, history, plant identity, cadence or deferred light/overwinter decisions changed. Brief cues summarize existing care templates and retain uncertainty for unidentified or tiny seedlings.
- Fresh release from origin `a11bf50`: reviewed `data.js`, `index.html`, `sw.js`, this record and `tests/watering-schedule.test.js`; build/cache `20261007190000`. All nine regression suites and isolated mobile/desktop watering/Care layout and write-safety checks passed.

### 2026-10-06 — Complete current plant replacement

- Cyrus authorized publication of the new Plant chat intake and confirmed these 31 pots are all current plants, all watered October 6. Retired plants are no longer active; historical watering, harvest and completion keys remain untouched.
- Source: `home-and-garden-project/docs/plant-refresh-2026-10-06/` in the shared House project. Integrate only the current confirmed set: 31 physical pots, seven distinct mint pots, 29 indoor and two outdoor (tomato temporarily outside).
- Source-backed care replaces obsolete guidance; provisional identities stay provisional and are excluded from edible harvest advice. Daily reminders are soil checks, not orders to water every day. No light-placement or overwintering assumptions added.
- Publish 32 unchanged original photos, per-pot crop/whole-pot controls, original-photo viewer and All/Mint/Indoor/Outdoor filters. Westcliffe city-level NWS weather and Day Arc coordinates replace the old Denver location.
- Explicitly reviewed release from fresh `origin/main` at `c7c02d6`: `data.js`, `index.html`, `sw.js`, `tests/watering-schedule.test.js`, this record and `plant-photos/2026-10-06/`. Recipes and unrelated shared changes are not included. Build/cache `20261006190000`.
- Saved confirmed October 6 watering to all 31 fresh per-pot Firebase paths using server ETag conditional writes. Verified 31 current dates and all 27 pre-existing retired watering records unchanged. No whole-state or whole-watering-map overwrite; newer dates would be preserved.

### 2026-09-30 — Revised Zoey combined Instant Pot method

- User requested upload of the revised dog-food recipe. Source: `Recipes/Recipe Box/Shareable/Zoey - Chicken & Brown Rice Split Batch.txt` and `Recipes/Recipe Box/SCHEDULE_ZOEY_CHICKEN_SPLIT_HANDOFF.md`, revised September 30 at 19:30.
- Update existing `r_zoey_chicken_split` rather than duplicate it. Regular batch now first: 2 cups DRY brown rice + 2.5 cups water + 5 oz carrots + 8 oz sweet potato, one HIGH 30-minute cycle and full natural pressure release. Use entire mixture. No shared rice or second vegetable pressure cycle.
- Beans now 5 oz and peas 6 oz. Plain batch remains separate below, with its own separately cooked plain rice. Preserve raw/drained weights, calcium alternatives, temporary-diet warning and prompt shallow-container cooling.
- Release starts from fresh `origin/main` at `107e9df`; only `data.js`, version stamps in `index.html`/`sw.js`, this record and recipe regression assertions reviewed. No other recipes, inventory or saved state changed. Build/cache `20260930200000`.

### 2026-09-30 — Zoey's Chicken & Brown Rice Split Batch

- User authorized publication: "Upload the new recipes for my dog go live."
- Source: `Recipes/Recipe Box/Shareable/Zoey - Chicken & Brown Rice Split Batch.txt`, via `Recipes/Recipe Box/SCHEDULE_ZOEY_CHICKEN_SPLIT_HANDOFF.md`.
- Additive `data.js` entry `r_zoey_chicken_split` in Zoey's Kitchen: two separate formulas, all ounce/cup measures and calcium alternatives, plain-batch exclusions, and temporary-diet warning. Existing recipes and inventory unchanged.
- `index.html`: optional bordered batch sections, batch-ingredient search, fixed-batch serving guard, neutral dog-recipe introduction. Safe-cooling clarification links USDA guidance; quantities otherwise preserved.
- Release prepared from fresh `origin/main` worktree at `55bf206`; only reviewed recipe changes, regression test, this record, and cache/build stamps included. No shared dirty-worktree files copied wholesale.
- Build/cache stamp: `20260930120000`. Verify via Recipe Box → Zoey's Kitchen → Chicken & Brown Rice Split Batch, including scrolling to the bottom on mobile.

### 2026-07-07 — Encoding repair + deploy marker restamp

**Status:** DEPLOYED after Cyrus said "go live."

**What changed:**
- Repaired mojibake in `index.html` so UTF-8 text renders as real emoji and punctuation again instead of broken multi-character sequences.
- Repaired the same encoding issue in `sw.js` comments.
- Bumped cache-busters for `data.js`, `dayarc.js`, and `sw.js`.
- Restamped visible `LAST_DEPLOY` to `Jul 7 · 8:50 AM`.

**Verification:**
- Syntax checked `data.js`, `dayarc.js`, `sw.js`, and all inline scripts extracted from `index.html`.
- Confirmed `index.html` has no leftover mojibake markers.

### 2026-07-07 — Health-coach schedule layer

**Status:** DEPLOYED after Cyrus said "go live."

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
