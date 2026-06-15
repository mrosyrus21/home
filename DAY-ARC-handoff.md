# Day Arc — handoff note

**What it is:** a living "Day Arc" header that sits at the top of the **Today** tab — the real path of the sun and moon across the Front Range for the day, with the day's reminders on their own timeline below the horizon. Sky color, clouds, rain, stars, snow + alpenglow all track the time of day and the forecast. You can drag the sky to scrub through past/future, tap a marker to jump, and hit **● Now** to snap back to live.

## The four files (keep them together in the same folder)
- **`index.html`** — the schedule app (unchanged except it now loads the Day Arc as a shared module).
- **`dayarc.css`** — all Day Arc styles.
- **`dayarc.js`** — all Day Arc logic (sun/moon astronomy, scene, timeline, interactions).
- **`Day Arc.html`** — a standalone example page with placeholder reminders + a sample forecast, for showing it off without personal data.

## Single source of truth
`index.html` **and** `Day Arc.html` both load the same `dayarc.css` + `dayarc.js`.
**To change how the Day Arc looks or behaves, edit `dayarc.js` and/or `dayarc.css` only — both pages update automatically.** Don't paste the code inline again.

## How each page feeds it data
- **The app (`index.html`)** feeds real data automatically — no config needed:
  - Reminders come from the app's `RHYTHM` times (breakfast, lunch, dinner, wind‑down, bedtime).
  - Weather comes from the app's `WXF` feed. The weather fetch in `loadWeather()` now includes `&hourly=weather_code,temperature_2m` and stores `WXF.hourlyCodes` / `WXF.hourlyTemp` — the arc reads those so the sky follows the day's forecast as you scrub. If you ever rewrite the weather fetch, keep those two fields.
  - It mounts itself at the top of `#view-today` and re‑mounts on every `renderToday()`.
- **The example (`Day Arc.html`)** overrides data via a `window.DAYARC_CONFIG` object defined in the page (host element id, `lat`/`lng`, `tasks`, and a sample `hourly` forecast). Edit that object to change the example.

## Location / astronomy
Sun + moon position, sunrise/sunset, and moon phase are computed live for `LAT`/`LNG` near the top of `dayarc.js` (currently ~39.78, ‑104.75 = Denver / 80249). Change those constants to move the location. Note: on a **new‑moon** day the moon rides with the sun all day and is gone at night — so you'll see its faint path but no lit disc. That's correct, not a bug.

## Deploy
Drop all four files into the House folder (replacing `index.html`) and run the normal deploy. Nothing else in the app changed.
