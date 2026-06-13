# Go live — FINAL approach (no separate file to miss)

The previous tries failed because `v2-features.js` is a separate file your deploy
script wouldn't stage — it kept 404ing. So that file is GONE now. All of its code is
baked directly inside `index.html`, which already deploys correctly. There is nothing
left that can be "forgotten."

### NEW in this build: 🎉 little celebrations
- Tap a water bottle → droplets rise from your finger. Hit your daily goal → a
  bigger splash + ring.
- Log a meal inside its time window → warm sparkle burst + "Right on time."
  Logged late still gets a gentle "every meal counts." All three meals → confetti.
- Respects reduced-motion (keeps the encouraging message, skips the particles).

## Deploy = 2 files, one click

1. Copy these TWO files into your `home` folder, **overwriting** the old ones:
   - `index.html`   (v2 app WITH all features baked in — bigger file now, that's expected)
   - `sw.js`        (cache bumped to hg-v79; no longer references v2-features.js)

   You can DELETE the old `v2-features.js` from the folder if it's there — not needed
   anymore. (Leaving it does no harm either.)

2. Double-click **`DEPLOY.bat`**.

3. Open https://mrosyrus21.github.io/home and force the new build through once:
   - Phone: pull-to-refresh twice, or close the app fully and reopen.
   - Desktop: Ctrl+Shift+R.

## You'll know it worked
On the live site you'll see:
   - 📜 **This week** recap at the bottom of Today
   - 😴 **Sleep** section at the top of Health
   - 📉 debt line + 🗓️ bills timeline on Finance
   - 📸 **Harvest journal** under Plants → Harvest

No URL to check this time — if `index.html` loads (it already does), the features are in it.

## Firebase — nothing to do
`state/sleep` and `state/harvestLog` create themselves on first write.
