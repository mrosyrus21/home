STAGED (NOT DEPLOYED) — Dry Terrarium update, Jun 10 2026.
Base origin commit: f6d54d5 (SW hg-v69).
Apply on GO LIVE from a fresh clone of origin:
    git apply dry_terrarium_jun10.patch
Then: node --check all surfaces -> jsdom render assert (dry view) ->
      bump sw.js hg-v69 -> hg-v70 -> python3 restamp.py ->
      ONE commit + push origin main -> mirror index.html+sw.js to House sha256-identical.
Changes (in renderShopping(), tankSub==="dry"): removed all ladybugs; added a small
jumping spider (smaller than the katydid nymph); added a Current inhabitants & greens
panel; added more basil + more strawberry cuttings; banner re-dated Jun 10; katydid kept.
