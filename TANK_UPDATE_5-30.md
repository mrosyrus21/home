# Tank Tab Update — 5/30/26 (backup for deploying chat)

**Context:** On 5/30/26 the tank's post-stocking mini cycle completed — ammonia is back to **0** (NO2 0, NO3 5, pH 7.6). Tank is stable, cleared to resume feeding and start the calcium project.

These edits were already applied to `index.html` in another chat. If a save collision wiped them, re-apply the 8 find/replace changes below to `index.html` before deploying. Each is a single, exact replacement.

---

## 1. Add 5/30 row to the parameter data array `P`

**Find:**
```
    ["5/29","0.25","0","5","7.6","—","—","Mini cycling, dosed Prime"]
  ];
```
**Replace:**
```
    ["5/29","0.25","0","5","7.6","—","—","Mini cycling, dosed Prime"],
    ["5/30","0","0","5","7.6","—","—","Mini cycle COMPLETE — NH3 back to 0 ✅"]
  ];
```

## 2. "Last updated" date

**Find:** `Last updated May 29, 2026`
**Replace:** `Last updated May 30, 2026`

## 3. Status banner label

**Find:** `Status — May 29`
**Replace:** `Status — May 30`

## 4. Status headline

**Find:** `✅ Cycled · 🦐 Stocked · ⚠️ Mini-cycling`
**Replace:** `✅ Cycled · 🦐 Stocked · ✅ Stable`

## 5. Status description (note: straight apostrophe in "don't")

**Find:**
```
Cycled 5/27, then 10 Blue Dream shrimp + 2 nerites added — normal post-stocking mini cycle. <b style="color:#F5B830">Dose Prime every 24–48h; don't feed until ammonia hits 0.</b>
```
**Replace:**
```
Cycled 5/27, then 10 Blue Dream shrimp + 2 nerites added. The post-stocking mini cycle is <b style="color:#4AD490">complete as of 5/30 — ammonia back to 0</b>. <b style="color:#4AD490">Cleared to resume feeding and start the calcium project.</b>
```

## 6. "Right Now" panel

**Find:**
```
html += panel('⚗️ Right Now (May 29)','Ammonia 0.25 — a normal mini cycle from adding 12 animals. Dose Prime <b>2–3 drops</b> every 24–48h; do <b>not</b> feed until it hits 0. Should clear in 24–48h.');
```
**Replace:**
```
html += panel('⚗️ Right Now (May 30)','✅ Mini cycle <b>complete</b> — ammonia is back to <b>0</b> (NO2 0, NO3 5, pH 7.6). Tank is stable. Cleared to resume feeding and begin the calcium project. Keep an eye on pH/alk with the eggshell in.');
```

## 7. Feeding Plan opener

**Find:**
```
html += panel('🍤 Feeding Plan','<b>Not feeding yet</b> — wait for the mini cycle to clear.'
```
**Replace:**
```
html += panel('🍤 Feeding Plan','<b style="color:#4AD490">Cleared to feed — mini cycle resolved 5/30.</b> Resume the <b>half stick every other day</b>.'
```

## 8. Params chip — NH3

**Find:** `${chip('0.25','NH3','warn')}`
**Replace:** `${chip('0','NH3','ok')}`

---

*All 8 are currently applied in `index.html`. This file is just insurance against a save collision between chats.*
