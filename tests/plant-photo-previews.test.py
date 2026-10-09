"""Mechanical preview fidelity and immutable-original checks (Pillow required)."""
from pathlib import Path
import subprocess
from PIL import Image, ImageChops, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "plant-photos"
PREVIEWS = ROOT / "plant-photo-previews"
originals = sorted(p for p in SOURCES.rglob("*") if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
assert originals, "original plant photos must exist"
subprocess.run(["git", "diff", "--exit-code", "HEAD", "--", "plant-photos"], cwd=ROOT, check=True)
for source in originals:
    destination = (PREVIEWS / source.relative_to(SOURCES)).with_suffix(".webp")
    assert destination.exists(), f"missing card preview: {destination}"
    with Image.open(source) as original, Image.open(destination) as encoded:
        expected = ImageOps.exif_transpose(original).convert("RGB")
        expected.thumbnail((640, 640), Image.Resampling.LANCZOS)
        assert encoded.format == "WEBP", f"wrong preview format: {destination}"
        assert encoded.size == expected.size, f"preview was cropped or stretched: {destination}"
        error = ImageStat.Stat(ImageChops.difference(expected, encoded.convert("RGB"))).mean
        assert max(error) < 8, f"preview differs materially from the original resize: {destination}, {error}"
print(f"{len(originals)} preview dimensions/content verified; original photos unchanged")
