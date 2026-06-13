# 🔧 Finish the deploy — git fixes, all automatic now

Each run has gotten one step further. Latest blocker:
  `untracked working tree files would be overwritten by merge: restamp.py, wire-photos.py`
GitHub has tracked copies of those two scripts; your folder has its own untracked copies,
so git refused to merge over them.

The new `deploy-github.py` now handles the WHOLE chain automatically:
  1. deletes the stale `.git/index.lock` (from the first Ctrl+C)
  2. stages your untracked files so the merge can't be blocked — and NEVER stages your
     token (guarded explicitly)
  3. pulls + merges GitHub's commits, keeping YOUR version on any conflict
  4. pushes

## Do this
1. Copy **`deploy-github.py`** into your **House** folder, overwriting the old one.
   (You already copied the new `DEPLOY.bat` last time — if not, copy it too. `index.html`
   and `sw.js` are already correct in House.)
2. Double-click **`DEPLOY.bat`**. Let it run — do NOT press Ctrl+C.
3. Last line:
   - **`[DONE] Pushed to GitHub Pages`** → hard-refresh the site, celebrations are live 🎉
   - **`[ERR] Push still failed`** → paste the lines (or say "check it") and I'll look at
     your folder + log again.

Your token stays masked and is never committed — same protection as always, now doubly guarded.
