import sys, subprocess, os, re, datetime

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HOUSE = os.path.dirname(os.path.abspath(__file__))

# ── TOKEN RESOLUTION — the value is NEVER printed to stdout/logs ───────────────
# Order: GH_TOKEN env  ->  GH_TOKEN_FILE env (a path)  ->  .deploy-token files.
# Create the token file ONCE by double-clicking:
#     home-and-garden-project\setup-deploy-token.bat
# .deploy-token is .gitignored and must NEVER be committed or printed.
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
        stamp = f"{mons[now.month-1]} {now.day}, {now.year} · {h12}:{now.minute:02d} {ampm} MT"
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
    run(["git", "config", "user.email", "mrosyrus@gmail.com"])
    run(["git", "config", "user.name",  "mrosyrus21"])
    run(["git", "checkout", "-b", "main"])
    run(["git", "remote", "add", "origin", REMOTE])
    print("[INIT] Git repo initialized.")
else:
    run(["git", "remote", "set-url", "origin", REMOTE])

# Stage ALL deployable files (NOT just index.html) — never the secret token.
for path in ["index.html", "data.js", "recipes.js", "images", "archive", ".nojekyll", ".gitignore", "deploy-github.py", "manifest.webmanifest", "sw.js", "icons"]:
    if os.path.exists(os.path.join(HOUSE, path)):
        run(["git", "add", path])

status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True, cwd=HOUSE)
if status.stdout.strip():
    run(["git", "commit", "-m", "Deploy update"])
else:
    print("[OK] No changes since last deploy.")

print("[UP] Pushing to GitHub...")
rc = run(["git", "push", "-u", "origin", "main"])

if rc == 0:
    print("\n[DONE] Pushed to GitHub Pages.")
    print("  Live URL : https://mrosyrus21.github.io/home")
    print("  Repo     : https://github.com/mrosyrus21/home")
else:
    print("\n[ERR] Push failed -- see masked output above.")

input("\nPress Enter to close...")
