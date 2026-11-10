"""Cut Ditch the duck out of the source art, with room around his head.

Source: design/icon/hf-6-peek.png (1024x1024, white background, teal bill).
Writes:
  assets/brand/duck.png       light: transparent background, tangerine bill
  assets/brand/duck-dark.png  dark: same duck with a thin cream rim

The bottom edge stays flush (the duck tucks behind a card there). The top,
left and right get padding so nothing is ever sliced off, even mid-animation.

Run: python3 scripts/brand/cut-duck.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'design/icon/hf-6-peek.png'
OUT = ROOT / 'assets/brand'

TANGERINE = np.array([255, 108, 44], dtype=float)
CREAM = (246, 240, 227)
PAD = 40  # source pixels of air above and beside the head
RIM = 24  # dark-mode rim, in source pixels
WIDTH = 600  # exported width


def cut():
    rgb = np.array(Image.open(SRC).convert('RGB')).astype(float)
    h, w, _ = rgb.shape
    lum = rgb.mean(axis=2)

    # Outside = everything reachable from the corners without crossing the
    # black outline. The face is white too, but the outline walls it in.
    walls = Image.fromarray(np.where(lum > 24, 255, 0).astype(np.uint8)).copy()
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if walls.getpixel(seed) == 255:
            ImageDraw.floodfill(walls, seed, 128)
    outside = np.array(walls) == 128
    if outside.mean() > 0.8 or outside.mean() < 0.2:
        raise SystemExit(f'flood fill looks wrong: {outside.mean():.2f} of the image is background')

    # Outside pixels are the outline's anti-aliased edge over white:
    # keep them as black with alpha from how dark they are.
    alpha = np.where(outside, (255 - lum) / 255, 1.0)
    alpha[outside & (lum > 250)] = 0
    color = rgb.copy()
    color[outside] = 0

    # Teal bill -> tangerine. Bill pixels sit between black and teal.
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    bill = (~outside) & (chroma > 24)
    k = np.clip(rgb[..., 1] / 161.0, 0, 1)
    color[bill] = TANGERINE * k[bill, None]

    rgba = np.dstack([color, alpha * 255]).clip(0, 255).astype(np.uint8)
    img = Image.fromarray(rgba, 'RGBA')

    # Crop to the duck, then add air on top and both sides. Bottom stays flush.
    ys, xs = np.where(alpha > 0.02)
    top, left, right = ys.min(), xs.min(), xs.max()
    box = (left, top, right + 1, h)
    duck = img.crop(box)
    pad = PAD + RIM
    canvas = Image.new('RGBA', (duck.width + 2 * pad, duck.height + pad), (0, 0, 0, 0))
    canvas.paste(duck, (pad, pad))
    return canvas


def with_rim(img):
    a = img.getchannel('A')
    # Grow the silhouette into a round, crisp-edged rim: blur, then cut the
    # blur at a low level with a steep ramp so the edge stays anti-aliased.
    grown = a.filter(ImageFilter.GaussianBlur(RIM / 2))
    g = np.array(grown).astype(float)
    rim_a = np.clip((g - 4) * 24, 0, 255).astype(np.uint8)
    rim = Image.new('RGBA', img.size, CREAM + (0,))
    rim.putalpha(Image.fromarray(rim_a))
    out = Image.new('RGBA', img.size, (0, 0, 0, 0))
    out.alpha_composite(rim)
    out.alpha_composite(img)
    return out


def export(img, name):
    scale = WIDTH / img.width
    small = img.resize((WIDTH, round(img.height * scale)), Image.LANCZOS)
    small.save(OUT / name, optimize=True)
    a = np.array(small)[..., 3]
    ys, xs = np.where(a > 0)
    print(f'{name}: {small.width}x{small.height}, ink from row {ys.min()} col {xs.min()}-{xs.max()}')
    return small.size


if __name__ == '__main__':
    light = cut()
    size_l = export(light, 'duck.png')
    size_d = export(with_rim(light), 'duck-dark.png')
    print('Update DUCK_SIZE in src/ui/sunflower/duckAsset.ts if these changed:', size_l, size_d)
