# 🔁 NEW-CHAT HANDOFF — "Schedule" app (Home & Garden)
**Written:** 2026-05-31 · **Live commit:** `2f548cd` · **App:** https://mrosyrus21.github.io/home

> Paste this whole file into the new chat. It is self-contained. The deeper change-log lives in `PROJECT_STATE.md` (Section 10); this doc is the operational handoff: what the app is, how to change it safely, the rules to follow, and what's left to do.

---

## 0. Read this first — the rules (Cyrus's standing preferences)
1. **Be concise and direct.** Minimal preamble, no fluff.
2. **Never take control of the computer without asking first.**
3. **Ask clarifying questions before any heavy/multi-step task. Only start work without asking when Cyrus says "Go."** Deploys go live **only** when he says **"GO LIVE."**
4. **Do NOT use the AskUserQuestion tool — it glitches for him. Ask questions in plain prose.**
5. **Don't reinvent the wheel.** Before building, check `PROJECT_STATE.md` + past context — a lot already exists. Don't re-solve solved things.
6. **When he references something you don't recall, go find it** (PROJECT_STATE.md, prior work) instead of asking him to re-explain.
7. **"update schedule" rule:** whenever he says "update schedule"/"update my schedule"/similar in ANY chat → write a full handoff into `PROJECT_STATE.md` Section 10 (what changed in `index.html`, why, exact location, safe deploy steps) and **stage** the edit. Deploy still only on "GO LIVE."
8. Only **this** (the Home/Garden/Schedule) chat deploys the site.

---

## 1. What the app is
A single-file personal dashboard: **`index.html`** (~2,480 lines, ~256 KB), vanilla **HTML/CSS/JS**, no build step. Title shows as **"📅"** with a rotating eyebrow phrase ("everything in its place" + variants). It tracks Cyrus's daily routine, a house cleaning/organizing campaign, plants, a shrimp tank, 3D printing, groceries, and health.

- **Hosting:** GitHub Pages. **Repo:** `github.com/mrosyrus21/home` (branch `main`). **Live URL:** `https://mrosyrus21.github.io/home`.
- **State/persistence:** **Firebase Realtime Database** (`schedule-c6dc7`, `databaseURL: https://schedule-c6dc7-default-rtdb.firebaseio.com`). Loaded via firebase compat SDK 10.12.0. State syncs across devices.
- **Repo also contains:** `images/` (committed plant photos, served by Pages), `archive/` (original full-res photos kept for the record), `.nojekyll`.

---

## 2. ⚠️ DEPLOY PROCESS — follow exactly (this has bitten us)
**The OneDrive House mount truncates files written from the Linux sandbox at ~140 KB.** `index.html` is ~256 KB, so **writing it directly into the House folder from the sandbox CORRUPTS the app.** Never do that.

**Safe process (always):**
1. `git clone --depth 1 https://<user>:<TOKEN>@github.com/mrosyrus21/home.git /tmp/repo` (fresh clone every time — never trust a stale clone or the House file as the source of truth).
2. Edit `/tmp/repo/index.html` in the sandbox with **Python exact find/replace** (assert each match count == 1 so a bad match aborts).
3. **Validate JS:** extract the inline `<script>` and run `node --check`:
   ```
   python3 -c "h=open('/tmp/repo/index.html',encoding='utf-8').read();i=h.find('\n<script>\n');js=h[i+9:];js=js[:js.rfind('</script>')];open('/tmp/repo/app.js','w').write(js)" && node --check /tmp/repo/app.js
   ```
4. **Review** the changed region of the local file before pushing.
5. `git add index.html` (plus any new `images/`, `archive/` files) → `git commit` → `git push origin main`.
6. **Sync House:** `cp /tmp/repo/index.html "<House>/index.html"` (and copy any new images into House `images/`).
7. **Verify:** confirm `git rev-parse HEAD` == `git ls-remote origin -h refs/heads/main`; then `curl` the live site cache-busted (`?cb=$(date +%s)`) and grep for your change markers; for new images, curl the image URL and expect `200`. Pages takes ~20–40s to rebuild.

**Token / security:**
- A **fine-grained GitHub PAT** is used for pushes. It has **Contents** permission only (cannot rename the repo or change admin settings).
- **NEVER print the token.** Always mask it in any command output: `sed -E 's/github_pat_[A-Za-z0-9_]+/***/g'`.
- `deploy-github.py` reads the token from the `GH_TOKEN` env var; **`DEPLOY.bat`** is Cyrus's one-click deploy.

**Sandbox path map:** House → `/sessions/<id>/mnt/House/`; uploads (read-only) → `/sessions/<id>/mnt/uploads/`. The bash sandbox can't display images; to view an uploaded image, copy it into House `images/` (a connected folder) and use the Read tool on the Windows path `C:\Users\cyrus\OneDrive\Documents\Claude\Projects\House\images\...`.

---

## 3. App architecture (where things live in `index.html`)

**Navigation**
- **Main tabs:** Today, Plants (`garden`), Tank (`shopping`), List (`grocery`), Print, Health (`wellness`).
- **Util pills (top-right):** 🌤️ Forecast, 🏠 Rooms, 📅 Timeline.
- **Sub-tabs:** Plants → Watering / Harvest / Care (`gardenSub`); Tank → To-Do / Setup / Params / Log (`tankSub`).
- Tab switching: `switchTab(t)` toggles `view-<t>` divs + `renderAll()`. `renderSubtabs(t)` builds sub-tab bars.

**Data objects (all top-level `const`):**
`CONFIG`, `EYEBROWS` (rotating header phrases), `APP_FACTS` (header fun-facts — unique, NOT duplicated from tab facts), `ROOMS`, `TASKS` (house tasks: `{room,label,level,note,steps?}`), `SCHEDULE` (legacy date→tasks calendar, still used by Rooms/garden helpers), `TIME_META` + `NO_PROGRESS` (task timing/exclusions), `PLANTS`, `PLANT_INFO`, `WATER_INFO` (`{when,thirst}`), `HARVEST_INFO` (`{how,fact,date}`), `CARE_INFO`, `FUN_FACTS` (per-plant rotating pool), `PEST_PLAN` (Care tab pest/bird control), `TAB_BG`, `TODAY_BG`, `HEADER_NIGHT`.

**Firebase state objects (`let`):** `checked` (task done), `watered`, `trimmed`, `laundry` (habits/daily toggles, keyed `morning-bed-<date>` etc.), `pushed`, `waterPushed`, `shopping`, `funPrints`. UI state: `currentTab`, `gardenSub`, `tankSub`, `expanded`, `expandedRoom`. Save fns: `saveW/saveTrimmed/saveLaundry/savePushed/saveWP/saveShopping/saveFunPrints/saveG/save`.

**Key functions:** `renderAll` (dispatches per `currentTab`), `renderToday`, `renderTimeline`, `renderRooms`, `renderGarden`, `renderShopping`, `renderGrocery`, `renderPrint`, `renderWellness`, `renderForecast`; `todaysPlan`, `planCard`, `agendaHtml`, `getTaskTime`, `timePill`, `strip`; `loadWeather`, `renderHeaderWeather`, `renderHeaderFact`, `updateHeaderBg`, `updateClock`, `todaySeg`, `dayOfYear`, `dailyFact`; plant helpers `plantsDueOn/plantsTrimDueOn/daysSinceWatered/daysSinceTrimmed/waterPlant/trimPlant`.

---

## 4. Current behavior by screen (so you don't rebuild what exists)

**Header (3 zones, pill-based):**
- **Left:** greeting + **big time** + **date pill** + a **rotating app fun-fact** (`APP_FACTS`, daily, home/printing/dog/tank trivia — deliberately NOT the same facts shown inside tabs).
- **Center:** rotating **eyebrow phrase** (`EYEBROWS`, daily) — the "Schedule" title word was removed per Cyrus.
- **Right:** **weather card** — current temp + icon, High/Low, Rain%/Wind, Humidity, and a Tomorrow line.
- **Background:** **time-of-day** image (morning/midday/evening from `TODAY_BG`; night = Milky Way over Rocky Mtn NP = `HEADER_NIGHT`), via `updateHeaderBg()` keyed on `todaySeg()`.
- Trackers row (💧 water / ✂️ harvest-ready / ❤️ care) below.

**Weather:** Open-Meteo, **ZIP 80249** (lat **39.78**, lon **−104.75**, tz America/Denver). `loadWeather()` runs on app load + **auto-refreshes every 45 min** (`__wxTimer`). Forecast advice is **baked into the plant tabs** (no standalone widget there): rain → skip/ease watering & "pick ripe fruit first"; heat → water deeply; wind → shelter pots/secure stakes; frost → cover. **Forecast pill** opens `renderForecast()` = a **7-day forecast view** (current conditions + daily rows).

**Today tab = dynamic daily plan (NOT date-locked):**
- `todaysPlan()` pulls real **room TASKS** by completion state: focus = first room not 100% (order: kitchen → living → office → bedroom → bathroom → backyard → garage), **easy→moderate first**, **4 tasks/day**. Advances room-by-room to 100% as `checked` updates.
- Tasks are **woven into one time-of-day agenda** with the daily routine (`agendaHtml` buckets: Morning / Midday / Afternoon / Evening / Night). Each plan task is a **detailed `planCard`** (label + level badge + time pill + the task's full `note` + optional steps). A slim room-progress banner sits on top. Pinned at very top: **"Call DT"** extreme-priority + (seasonal) freeze-watch.
- Daily routine habits: make bed, open blinds, water+vitamins, **stretching + 12 pushups**, morning dog walk, Zoey snuffle-mat enrichment, shower, teeth, breakfast; midday work-msg + lunch; evening/night dinner, stop-eating, 2nd dog walk, tidy, journal, vitamins prep, shower, teeth, bedtime, sleep-position guide.

**Timeline (util pill) = forward projection of the same plan** starting **today as Day 1** (Cyrus has done nothing yet, so today is the start). Simulates the daily planner forward (4/day, easy→mod first, room order), assigns consecutive dates, shows a whole-house progress bar + **live finish-date estimate** + a "🎉 Room done" flourish on each room's last day. Completion-driven, so it never drifts or goes blank.

**Rooms (util pill):** `renderRooms()` — expandable card per room with progress fraction/bar; expanded shows all that room's tasks (sorted easy→mod→hard) with the detailed `note` and a level badge.

**Plants tab (`garden`):**
- **Watering:** per-plant photo cards — "💧 When & how" (exact timing), "👀 Thirst check" (a fact about that plant's water relationship), forecast note, water button, and a **rotating 💡 fun-fact pill** (`FUN_FACTS`, daily). Sorted most-overdue first.
- **Harvest:** "✂️ How to pick" (detailed), "🌟 Good to know" (harvest fact), forecast note, rotating fun-fact pill; "Ready now" badge handles timing (no redundant "when").
- **Care:** greenhouse seasonal plan + **🐦 Pest & Bird Control** panel (incl. the red-painted-rock decoy trick + netting, aphids/hornworm/mites/slugs/flea-beetles, Denver-specific), then per-plant cards: "🌿 Care note" (maintenance fun-fact), detailed "🌿 Maintenance" + status, **"Mark tended"** button (terminology is **"Tended"**, intentionally NOT "Trimmed"), rotating fun-fact pill.
- **Single strawberry has a DISTINCT card** (`pcardStrawberry`): dual-photo header (`images/strawberry_single_1.jpg` + `_2.jpg`), berry-tinted bg, pink/red border + glow, "🍓 Single plant · potted" ribbon. All other plants use the standard green-accent `pcard`. (Photos from 5/31; plant is healthy & flowering, no berries yet.)

**Tank tab (`shopping`):** freshwater shrimp tank — To-Do / Setup / Params / Log. 5/30 update applied (mini-cycle complete, NH3 0, stable, cleared to feed).
**Print tab:** 3D printing notes for the **Sovol SV06 Plus** (upgrade tier list).
**List tab (`grocery`) & Health tab (`wellness`):** grocery list and wellness/health.

---

## 5. Open threads / TODO
- [ ] **Repoint the stale Cowork "home-garden-schedule" artifact redirect** to the github.io URL (awaiting "Go").
- [ ] **Optional:** add a separate **"multi-plant strawberry pit"** entry — right now there is only the single potted `strawberry` entry. Cyrus distinguished the two; the pit isn't in the app yet.
- [ ] **Verify the `xfinity_call` retention script wording** — it was reconstructed from a summary, not the Financial-Stability chat's verbatim original.
- [ ] Note for new chat: **Today + Timeline are now completion-driven (dynamic), not the old date-locked `SCHEDULE`.** `SCHEDULE` still exists and feeds Rooms/garden helpers, but the daily plan and timeline derive from `checked` state.

---

## 6. About Cyrus (context that informs the app)
- Denver, **ZIP 80249**; email mrosyrus@gmail.com. Plays **pool league Monday nights** (rest day historically).
- **Dog: Zoey** (snuffle-mat enrichment, two walks/day).
- **Health:** recurring shoulder/arm/wrist + buttock-joint pain; takes **Litfulo (ritlecitinib, a JAK inhibitor)** for alopecia areata — had been missing doses. Sleep-position guide + "Call DT" reminder live on Today. (Not a doctor; provide info, not diagnoses.)
- **Plants:** indoor — heartleaf philodendron, royal tea ivy, fittonia, banana croton, jade; greenhouse — 2× sweet basil, curled parsley, peppermint (declined badly 5/29), rosemary, dill; outdoor — heirloom tomato, husky cherry tomato, jalapeño, **strawberry (single potted)**, raspberry, dianthus, daisy, candytuft.
- **Tank:** freshwater, Blue Dream (Neocaridina) shrimp + nerite snails.
- **3D printer:** Sovol SV06 Plus.
- **Big project:** clean & organize the whole house room-by-room to 100%, starting with the **kitchen**, easy→moderate first ("start simple but start strong").

---
*End of handoff. Deeper per-change history is in `PROJECT_STATE.md` Section 10. When in doubt: clone fresh, edit in the sandbox, `node --check`, push, then `cp` to House — and deploy only on "GO LIVE."*
