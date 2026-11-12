"""Put real Ditch app screens into the Higgsfield phone photos (green screens) for the website.
Run: python3 scripts/brand/site-compose.py  → web/public/art/*.webp"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
ART = ROOT / 'design/site/v3/art'
APP = ROOT / 'design/site/v3/public-assets/app'
OUT = ROOT / 'design/site/v3/public-assets/art'
OUT.mkdir(parents=True, exist_ok=True)


def green(img):
    a = np.array(img.convert('RGB')).astype(int)
    return (a[..., 1] > 150) & (a[..., 0] < 140) & (a[..., 2] < 140) & (a[..., 1] - a[..., 0] > 60)


def regions(mask):
    """Split the green mask into separate screens by flood-filling from seeds."""
    m = Image.fromarray((mask * 255).astype(np.uint8)).copy()
    out = []
    a = np.array(m)
    while True:
        ys, xs = np.where(a == 255)
        if len(ys) < 5000:
            break
        seed = (int(xs[len(xs) // 2]), int(ys[len(ys) // 2]))
        ImageDraw.floodfill(m, seed, 128)
        a = np.array(m)
        reg = a == 128
        out.append(reg)
        a[reg] = 0
        m = Image.fromarray(a).copy()  # fromarray shares memory; floodfill needs its own copy
    return sorted(out, key=lambda r: np.where(r)[1].mean())


def compose(photo, screens, name, scale=2, sun=False):
    img = Image.open(ART / photo).convert('RGB')
    W, H = img.size
    big = img.resize((W * scale, H * scale), Image.LANCZOS)
    regs = regions(green(img))
    for reg, scr in zip(regs, screens):
        ys, xs = np.where(reg)
        x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
        # screen mask (includes the island hole) slightly grown so no green fringe shows
        m = Image.fromarray((reg * 255).astype(np.uint8)).resize((W * scale, H * scale), Image.LANCZOS)
        m = m.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(0.8))
        # keep the dynamic island: dark pixels inside the screen box are not part of the mask already
        shot = Image.open(APP / scr).convert('RGB')
        bw, bh = (x1 - x0 + 1) * scale, (y1 - y0 + 1) * scale
        sh = shot.resize((bw, round(shot.height * bw / shot.width)), Image.LANCZOS)
        if sh.height < bh:  # fill height, crop width centre
            sh = shot.resize((round(shot.width * bh / shot.height), bh), Image.LANCZOS)
            off = (sh.width - bw) // 2
            sh = sh.crop((off, 0, off + bw, bh))
        else:
            sh = sh.crop((0, 0, bw, bh))
        layer = Image.new('RGB', big.size)
        layer.paste(sh, (x0 * scale, y0 * scale))
        big.paste(layer, (0, 0), m)
    # remove green spill, but only in a thin band around each screen edge (logos inside stay their real colours)
    allm = Image.fromarray((green(img) * 255).astype(np.uint8)).resize((W * scale, H * scale))
    band = np.array(allm.filter(ImageFilter.MaxFilter(15))) > 0
    band &= ~(np.array(allm.filter(ImageFilter.MinFilter(15))) > 0)
    a = np.array(big).astype(np.int16)
    spill = band & (a[..., 1] > a[..., 0] + 40) & (a[..., 1] > a[..., 2] + 40)
    a[spill, 1] = np.maximum(a[spill, 0], a[spill, 2])
    big = Image.fromarray(a.clip(0, 255).astype(np.uint8))
    if sun:  # match the photo's yellow to the site's sunflower so the image has no visible box edge
        a = np.array(big).astype(np.float32)
        ref = np.array([254, 196, 42], np.float32)
        d = np.linalg.norm(a - ref, axis=2)
        w = np.clip(1 - d / 70, 0, 1)[..., None]
        a = a + w * (np.array([255, 204, 46], np.float32) - ref)
        big = Image.fromarray(a.clip(0, 255).astype(np.uint8))
    big.save(OUT / f'{name}.webp', quality=88, method=6)
    big.resize((W, H), Image.LANCZOS).save(OUT / f'{name}-sm.webp', quality=86, method=6)
    print(name, big.size, len(regs), 'screens')


compose('hand.png', ['home.png'], 'hero-hand', sun=True)
compose('flatlay.png', ['total.png'], 'flatlay-total')
compose('two.png', ['total.png', 'home.png'], 'two-phones', sun=True)
