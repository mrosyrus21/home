"""Build uncropped card previews; never write to the original plant-photo files.

Run with the bundled Pillow Python. Orientation follows the original EXIF display.
The longest edge is at most 640 pixels; full originals remain in the photo viewer.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "plant-photos"
PREVIEWS = ROOT / "plant-photo-previews"
MAX_EDGE = 640
QUALITY = 82


def main():
    originals = sorted(p for p in SOURCES.rglob("*") if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
    original_bytes = preview_bytes = 0
    for source in originals:
        destination = (PREVIEWS / source.relative_to(SOURCES)).with_suffix(".webp")
        destination.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as original:
            preview = ImageOps.exif_transpose(original).convert("RGB")
            preview.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
            preview.save(destination, "WEBP", quality=QUALITY, method=6)
        original_bytes += source.stat().st_size
        preview_bytes += destination.stat().st_size
    print(f"{len(originals)} uncropped previews: {preview_bytes:,} bytes vs {original_bytes:,} original bytes")


if __name__ == "__main__":
    main()
