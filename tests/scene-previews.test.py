"""Verify lean scenery keeps the same uncropped art and original files."""
from pathlib import Path
import subprocess
from PIL import Image, ImageChops, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "dayarc-assets"
PREVIEWS = ASSETS / "optimized-v1"
subprocess.run(["git", "diff", "--exit-code", "HEAD", "--", "dayarc-assets/*.png", "dayarc-assets/*.jpg"], cwd=ROOT, check=True)
previews = sorted(PREVIEWS.glob("*.webp"))
assert len(previews) == 15
for preview in previews:
    source = ASSETS / (preview.stem + (".jpg" if preview.stem == "stars" else ".png"))
    with Image.open(source) as original, Image.open(preview) as encoded:
        mode = "RGBA" if "A" in original.getbands() else "RGB"
        expected = ImageOps.exif_transpose(original).convert(mode)
        edge = 256 if preview.stem == "moon-base" else 512 if preview.stem == "sun" else 1600
        expected.thumbnail((edge, edge), Image.Resampling.LANCZOS)
        assert encoded.format == "WEBP" and encoded.size == expected.size
        if mode == "RGBA":
            assert expected.getbbox() == encoded.getbbox(), f"altered transparency: {preview}"
            for image in (expected, encoded):
                background = Image.new("RGBA", image.size, "#102032")
                background.alpha_composite(image.convert("RGBA"))
                if image is expected:
                    expected_rgb = background.convert("RGB")
                else:
                    encoded_rgb = background.convert("RGB")
        else:
            expected_rgb, encoded_rgb = expected, encoded.convert("RGB")
        assert max(ImageStat.Stat(ImageChops.difference(expected_rgb, encoded_rgb)).mean) < 8
assert sum(p.stat().st_size for p in previews) < 1_000_000
initial = ["mtn-day", "mtn-dusk", "mtn-night", "stars", "sun", "moon-base"]
before = sum((ASSETS / (n + (".jpg" if n == "stars" else ".png"))).stat().st_size for n in initial)
after = sum((PREVIEWS / (n + ".webp")).stat().st_size for n in initial)
assert after < before * .05
print(f"15 uncropped scenery previews verified; initial six assets {before:,} -> {after:,} bytes; originals unchanged")
