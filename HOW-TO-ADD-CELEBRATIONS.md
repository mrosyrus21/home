# 🎉 Add the celebrations to your LIVE site (safe, one paste)

You have two chats touching `index.html`, and shipping a whole new file from here keeps
clobbering the other chat's nav + watering fixes. So this is built to AVOID that entirely.

**`Celebrations (paste before body close).html`** is a single self-contained `<script>`
block. It layers on top of whatever your live `index.html` already is — it does NOT
replace anything. It's guarded so pasting it twice does nothing, and it quietly turns
itself off for anyone who prefers reduced motion.

## How to add it (≈1 minute)

1. Open your **live** `index.html` (the current good one the other chat deploys).
2. Open `Celebrations (paste before body close).html` and copy **everything between**
   the `<script>` and `</script>` tags (or just paste the whole block — the HTML comment
   above it is harmless).
3. Paste it into `index.html` **right before the closing `</body>` tag**, at the very end.
4. In `sw.js`, bump the cache number by one — find `const CACHE='hg-vNN'` and increase NN
   (e.g. `hg-v79` → `hg-v80`). This forces every device to pull the new file. *(If you
   don't bump it, phones may keep showing the old cached page.)*
5. Deploy as usual, then on the site hard-refresh once (desktop Ctrl+Shift+R, phone
   pull-to-refresh twice).

## Why you didn't see the water droplets before
The celebration code never reached the live build — the two chats were out of sync, so
the version that deployed didn't include it. Pasting this block onto the live file fixes
that directly, no matter which base it lands on.

## What you'll get
| Action | Delight |
|---|---|
| 💧 Tap a water bottle | droplets rise from your finger; hit your goal → splash + ring |
| 🍽️ Log a meal on time | warm sparkle burst + "Right on time"; late → gentle note; all 3 → 🎉 |
| 🌿 Water a plant | leafy green puff (whole group → bigger burst) |
| 🍅 Harvest | produce pops |
| ✅ Check a task | quick subtle sparkle (kept small — it happens a lot) |
| 💊 Meds & vitamins | calm green check |
| 🔥 Streak hits 7 / 14 / 30 / 50 / 100 | flame burst + "you're on fire" |
| 📳 Phones | a light haptic buzz on every positive tap |

No new Firebase nodes, no new files to forget — it's all in the one pasted block.
