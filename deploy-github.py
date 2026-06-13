import sys, subprocess, os, re, datetime

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HOUSE = os.path.dirname(os.path.abspath(__file__))

# ── TOKEN RESOLUTION — the value is NEVER printed to stdout/logs ───────────────
def _read_token():
    t = os.environ.get("GH_TOKEN", "").strip()
    if t:
        return t
    candidates = []
    envf = os.environ.get("GH_TOKEN_FILE", "").strip()
    if envf:
        candidates.append(envf)
    candidates.append(os.path.join(HOUSE, "home-and-garden-project", ".deploy-token"))
    candidates.append(os.path.join(HOUSE, ".deploy-token"))
    for c in candidates:
        try:
            if c and os.path.isfile(c):
                with open(c, "r", encoding="utf-8") as f:
                    val = f.read().strip()
                if val:
                    return val
        except OSError:
            pass
    return ""

TOKEN = _read_token()
if not TOKEN:
    print("ERROR: No GitHub token found.")
    print("Fix: double-click  home-and-garden-project\\setup-deploy-token.bat  (one time),")
    print("     or set GH_TOKEN in your environment.")
    input("\nPress Enter to close...")
    sys.exit(1)
REMOTE = f"https://mrosyrus21:{TOKEN}@github.com/mrosyrus21/home.git"

def _mask(s):
    s = s.replace(TOKEN, "***")
    return re.sub(r"(github_pat_[A-Za-z0-9_]+|ghp_[A-Za-z0-9]+)", "***", s)

def run(cmd, **kw):
    print("> " + _mask(" ".join(cmd)))
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=HOUSE, **kw)
    if r.stdout.strip(): print(_mask(r.stdout.strip()))
    if r.stderr.strip(): print(_mask(r.stderr.strip()))
    return r.returncode

os.chdir(HOUSE)

# ── FIX 1: clear a stale git lock left behind by an interrupted (Ctrl+C) run ───
lock = os.path.join(HOUSE, ".git", "index.lock")
if os.path.isfile(lock):
    try:
        os.remove(lock)
        print("[FIX] Removed stale .git/index.lock from a previous interrupted run.")
    except OSError as e:
        print("[WARN] Could not remove index.lock: " + str(e))

# ── Stamp the "Last deployed" time into index.html (best-effort) ──────────────
try:
    idx = os.path.join(HOUSE, "index.html")
    if os.path.isfile(idx):
        try:
            from zoneinfo import ZoneInfo
            now = datetime.datetime.now(ZoneInfo("America/Denver"))
        except Exception:
            now = datetime.datetime.now()
        mons = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        h12 = now.hour % 12 or 12
        ampm = "AM" if now.hour < 12 else "PM"
        stamp = f"{mons[now.month-1]} {now.day} · {h12}:{now.minute:02d} {ampm}"
        html = open(idx, "r", encoding="utf-8").read()
        import time as _t
        html = re.sub(r'data\.js\?v=[0-9]*', "data.js?v="+_t.strftime("%Y%m%d%H%M%S"), html)
        new = re.sub(r'(const LAST_DEPLOY = ")[^"]*(";)', lambda m: m.group(1)+stamp+m.group(2), html, count=1)
        if new != html:
            open(idx, "w", encoding="utf-8").write(new)
            print("Stamped LAST_DEPLOY = " + stamp)
except Exception:
    print("(LAST_DEPLOY stamp skipped)")

# Initialize repo if needed
if not os.path.isdir(os.path.join(HOUSE, ".git")):
    run(["git", "init"])
    run(["git", "checkout", "-b", "main"])
    run(["git", "remote", "add", "origin", REMOTE])
    print("[INIT] Git repo initialized.")
else:
    run(["git", "remote", "set-url", "origin", REMOTE])

# Identity (safe to set every time)
run(["git", "config", "user.email", "mrosyrus@gmail.com"])
run(["git", "config", "user.name",  "mrosyrus21"])

# Stage ALL deployable files (NOT just index.html) — never the secret token.
for path in ["index.html", "recipes.html", "data.js", "recipes.js", "v2-features.js", "images", "archive", ".nojekyll", ".gitignore", "deploy-github.py", "manifest.webmanifest", "sw.js", "icons"]:
    if os.path.exists(os.path.join(HOUSE, path)):
        run(["git", "add", path])

status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True, cwd=HOUSE)
if status.stdout.strip():
    run(["git", "commit", "-m", "Deploy update"])
else:
    print("[OK] No local changes to commit.")

# ── FIX 2: integrate the remote's commits BEFORE pushing ──────────────────────
# The remote (GitHub) had work this folder didn't have, which is why the push was
# rejected with "fetch first". Pull and merge it in, keeping THIS folder's version
# of any file that conflicts (-X ours) so the celebrations + your latest edits win.
print("[SYNC] Pulling remote changes before push (keeping your local version on conflict)...")
rc_pull = run(["git", "pull", "--no-edit", "-X", "ours",
               "--allow-unrelated-histories", "origin", "main"])
if rc_pull != 0:
    print("[WARN] Pull reported a problem above. Attempting push anyway...")

print("[UP] Pushing to GitHub...")
rc = run(["git", "push", "-u", "origin", "main"])

if rc == 0:
    print("\n[DONE] Pushed to GitHub Pages.")
    print("  Live URL : https://mrosyrus21.github.io/home")
    print("  Repo     : https://github.com/mrosyrus21/home")
    print("\n  Now open the site and hard-refresh (Ctrl+Shift+R, or pull-to-refresh twice on phone).")
else:
    print("\n[ERR] Push still failed -- copy the masked lines above to Claude.")

input("\nPress Enter to close...")
