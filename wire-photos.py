#!/usr/bin/env python3
"""
wire-photos.py — Plant photo DROP-IN auto-wiring for the Home & Garden app.

WHAT IT DOES
  Drop a new plant photo into  home-and-garden-project/plants/<indoor|outdoor|greenhouse>/
  named after the plant (e.g. jade.jpg, heirloom_tomato.jpg, peppermint.jpg), then run
  this script. For every photo it can confidently match to a known plant id it will:
    1. web-optimize the image  -> images/<id>_<YYYYMMDD>.jpg  (EXIF-upright, <=1200px long edge, q85)
    2. repoint  PLANT_INFO["<id>"].photo  in data.js to that new file
    3. move the processed original into  plants/_archive_old/  so it is not re-processed
  Unrecognized filenames are listed and left untouched (never guesses).

SAFETY
  * Dry-run by DEFAULT. Pass  --apply  to actually write images, edit data.js, and move files.
  * Never touches a plant whose card hard-codes its image (strawberry, strawberry_pot) — warns instead.
  * Idempotent: only acts on files currently sitting in the plants/<loc> subfolders.
  * The valid plant-id list is parsed live from data.js PLANTS, so it always matches the app.

USAGE (from the repo root, i.e. the deploy clone or the House folder)
    python3 wire-photos.py                       # dry-run, default paths
    python3 wire-photos.py --apply               # do it
    python3 wire-photos.py --plants /path/to/plants --apply   # custom source (e.g. House plants mount)
    python3 wire-photos.py --repo  /path/to/repo            # where data.js + images/ live

DEPLOY-CLONE WORKFLOW (the documented safe flow lives in PROJECT_STATE.md Section 10):
    drop photos into House plants/<loc>/  ->  in the sandbox clone run:
        python3 wire-photos.py --plants "<session>/mnt/House/home-and-garden-project/plants" --apply
    ->  node --check data.js  ->  git add data.js images  ->  commit + push  ->  cp data.js+images to House
"""
import os, re, sys, argparse, datetime

def log(m): print(m, flush=True)

# ── plant-id resolution ───────────────────────────────────────────────────────
# Canonical filename stems that map to an app plant id. Add aliases here as needed.
ALIASES = {
    "philodendron":"philodendron", "heartleaf":"philodendron", "heartleaf_philodendron":"philodendron",
    "ivy":"ivy", "tea_ivy":"ivy", "royal_tea_ivy":"ivy", "royal_tee_ivy":"ivy", "hedera":"ivy",
    "fittonia":"fittonia", "nerve":"fittonia", "fittonia_nerve":"fittonia", "nerve_plant":"fittonia",
    "croton":"croton", "banana_croton":"croton",
    "jade":"jade", "jade_plant":"jade",
    "basil1":"basil1", "basil_1":"basil1", "basil":"basil1", "sweet_basil":"basil1", "basil_a":"basil1",
    "basil2":"basil2", "basil_2":"basil2", "basil_b":"basil2",
    "parsley":"parsley", "curled_parsley":"parsley",
    "mint":"mint", "peppermint":"mint", "spearmint":"mint",
    "dill":"dill",
    "rosemary":"rosemary",
    "tomato":"tomato", "heirloom":"tomato", "heirloom_tomato":"tomato", "beefsteak":"tomato",
    "cherry_tomato":"cherry_tomato", "husky":"cherry_tomato", "husky_cherry":"cherry_tomato",
    "husky_cherry_tomato":"cherry_tomato", "cherry":"cherry_tomato",
    "jalapeno":"jalapeno", "jalapeño":"jalapeno", "pepper":"jalapeno",
    "raspberry":"raspberry",
    "ristra":"ristra", "new_mexico_chile":"ristra", "nm_chile":"ristra", "hatch":"ristra", "chile":"ristra",
    "dianthus":"dianthus", "pinks":"dianthus",
    "daisy":"daisy",
    "candytuft":"candytuft", "iberis":"candytuft",
    "strawberry":"strawberry",
    "strawberry_pot":"strawberry_pot", "strawberry_pit":"strawberry_pot",
}
# Plants whose card hard-codes its image(s) — repointing PLANT_INFO.photo won't change the card.
HARDCODED_CARD = {"strawberry", "strawberry_pot"}
LOCS = ("indoor", "outdoor", "greenhouse")
EXTS = (".jpg", ".jpeg", ".png", ".webp", ".heic")

def norm_stem(fn):
    s = os.path.splitext(os.path.basename(fn))[0].lower()
    s = re.sub(r"^(indoor|outdoor|greenhouse)__", "", s)      # strip loc prefix if present
    s = re.sub(r"[ \-]+", "_", s)                              # spaces/hyphens -> _
    s = re.sub(r"_\d{6,8}$", "", s)                            # strip trailing date stamp
    s = re.sub(r"_\d+$", "", s)                                # strip trailing _2 / _copy index
    s = re.sub(r"_(copy|new|side|topdown|top|plant|orig|original|closeup|fruit)$", "", s)
    return s

def resolve_id(fn, valid):
    s = norm_stem(fn)
    if s in ALIASES and ALIASES[s] in valid:
        return ALIASES[s]
    if s in valid:                # filename already equals a plant id
        return s
    return None

def valid_ids_from_datajs(datajs_path):
    src = open(datajs_path, encoding="utf-8").read()
    m = re.search(r"const PLANTS\s*=\s*\[(.*?)\];", src, re.S)
    if not m:
        log("ERROR: could not find PLANTS array in data.js"); sys.exit(2)
    return set(re.findall(r'id\s*:\s*"([^"]+)"', m.group(1)))

# ── image optimization ─────────────────────────────────────────────────────────
def optimize(src, dst, max_edge=1200, quality=85):
    from PIL import Image, ImageOps
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)          # bake EXIF rotation -> upright
    if im.mode not in ("RGB", "L"):
        im = im.convert("RGB")
    w, h = im.size
    if max(w, h) > max_edge:
        if w >= h: im = im.resize((max_edge, round(h*max_edge/w)))
        else:      im = im.resize((round(w*max_edge/h), max_edge))
    im.save(dst, "JPEG", quality=quality, optimize=True)

# ── data.js editing ──────────────────────────────────────────────────────────
def set_photo(datajs_path, pid, newpath, apply):
    src = open(datajs_path, encoding="utf-8").read()
    # PLANT_INFO entry:  pid:{ ... photo:"..."  ... }  — replace just that photo value, key-anchored.
    entry = re.search(r'(\b%s\s*:\s*\{)' % re.escape(pid), src)
    if not entry:
        return False, "no PLANT_INFO entry"
    # Locate the photo: field within this entry's object (search forward to the entry's closing brace).
    start = entry.start(1)
    # find matching close brace for this object
    i = src.index("{", start); depth = 0; end = i
    while i < len(src):
        if src[i] == "{": depth += 1
        elif src[i] == "}":
            depth -= 1
            if depth == 0: end = i; break
        i += 1
    block = src[start:end+1]
    if 'photo:' in block.replace(" ", "") or 'photo :' in block:
        newblock = re.sub(r'photo\s*:\s*"[^"]*"', 'photo:"%s"' % newpath, block, count=1)
        action = "repointed"
    else:
        # no photo field yet — inject one right after the opening brace of the entry
        newblock = re.sub(r'(\{)', r'\1photo:"%s",' % newpath, block, count=1)
        action = "added photo field"
    if newblock == block:
        return False, "no change"
    if apply:
        open(datajs_path, "w", encoding="utf-8").write(src[:start] + newblock + src[end+1:])
    return True, action

def main():
    ap = argparse.ArgumentParser()
    here = os.path.dirname(os.path.abspath(__file__))
    ap.add_argument("--repo", default=here, help="folder containing data.js and images/ (default: script dir)")
    ap.add_argument("--plants", default=os.path.join(here, "home-and-garden-project", "plants"),
                    help="plants source folder containing indoor/ outdoor/ greenhouse/")
    ap.add_argument("--apply", action="store_true", help="actually write/edit/move (default: dry-run)")
    ap.add_argument("--date", default=datetime.date.today().strftime("%Y%m%d"))
    a = ap.parse_args()

    datajs = os.path.join(a.repo, "data.js")
    imgdir = os.path.join(a.repo, "images")
    if not os.path.isfile(datajs):
        log("ERROR: data.js not found at %s (use --repo)" % datajs); sys.exit(2)
    if not os.path.isdir(a.plants):
        log("No plants source folder at %s — nothing to do." % a.plants); return
    os.makedirs(imgdir, exist_ok=True)
    archive = os.path.join(a.plants, "_archive_old"); os.makedirs(archive, exist_ok=True)
    valid = valid_ids_from_datajs(datajs)

    found = []
    for loc in LOCS:
        d = os.path.join(a.plants, loc)
        if not os.path.isdir(d): continue
        for fn in sorted(os.listdir(d)):
            if fn.startswith(".") or fn.startswith("_"): continue
            if os.path.splitext(fn)[1].lower() not in EXTS: continue
            found.append((loc, os.path.join(d, fn), fn))

    if not found:
        log("No drop-in photos in %s/{indoor,outdoor,greenhouse}. Nothing to wire." % a.plants); return

    log("%s%d candidate photo(s) found.\n" % ("[DRY-RUN] " if not a.apply else "[APPLY] ", len(found)))
    wired, skipped, unknown = [], [], []
    for loc, path, fn in found:
        pid = resolve_id(fn, valid)
        if not pid:
            unknown.append("%s/%s  (stem '%s' — no known plant id)" % (loc, fn, norm_stem(fn)))
            continue
        if pid in HARDCODED_CARD:
            skipped.append("%s/%s -> %s : card hard-codes its image; edit the card in index.html instead" % (loc, fn, pid))
            continue
        dst_rel = "images/%s_%s.jpg" % (pid, a.date)
        dst = os.path.join(a.repo, dst_rel)
        if a.apply:
            try: optimize(path, dst)
            except Exception as e:
                skipped.append("%s/%s -> %s : optimize failed (%s)" % (loc, fn, pid, e)); continue
            ok, act = set_photo(datajs, pid, dst_rel, apply=True)
            if not ok:
                skipped.append("%s/%s -> %s : data.js %s" % (loc, fn, pid, act)); continue
            # move original into archive (prefixed with loc so names stay meaningful)
            arc = os.path.join(archive, "%s__%s" % (loc, fn))
            try: os.replace(path, arc)
            except OSError: pass
            wired.append("%s/%s -> %s  (%s, data.js %s, original archived)" % (loc, fn, pid, dst_rel, act))
        else:
            ok, act = set_photo(datajs, pid, dst_rel, apply=False)
            wired.append("%s/%s -> %s  (would write %s, data.js %s)" % (loc, fn, pid, dst_rel, act))

    def section(title, items):
        log(title); [log("  " + x) for x in items] if items else log("  (none)"); log("")
    section("WIRED (%d):" % len(wired), wired)
    section("SKIPPED (%d):" % len(skipped), skipped)
    section("UNRECOGNIZED — left untouched (%d):" % len(unknown), unknown)
    if not a.apply:
        log("Dry-run only. Re-run with  --apply  to write images, edit data.js, and archive originals.")
    else:
        log("Done. Now: node --check data.js  ->  review diff  ->  commit + push  ->  mirror to House.")

if __name__ == "__main__":
    main()
