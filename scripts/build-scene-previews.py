"""Mechanical, uncropped WebP delivery copies; source art is never changed."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "dayarc-assets"
TARGET = SOURCE / "optimized-v1"
TARGET.mkdir(exist_ok=True)
names = ["mtn-day", "mtn-dusk", "mtn-night", "stars", "sun", "moon-base",
         "clouds-light", "clouds-medium", "clouds-overcast",
         "rain-light", "rain-medium", "rain-heavy", "snow-light", "snow-medium", "snow-heavy"]
for name in names:
    source = SOURCE / (name + (".jpg" if name == "stars" else ".png"))
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGBA" if "A" in original.getbands() else "RGB")
        edge = 256 if name == "moon-base" else 512 if name == "sun" else 1600
        image.thumbnail((edge, edge), Image.Resampling.LANCZOS)
        target = TARGET / (name + ".webp")
        image.save(target, "WEBP", quality=85, method=6)
        print(f"{name}: {source.stat().st_size:,} -> {target.stat().st_size:,} bytes; {image.width}x{image.height}")
