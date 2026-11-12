"""The Bean app icon (owner pick, Nov 12): design/icon/hf-v5/bean.png, made with Higgsfield from the
app duck, cleaned into exact flat colours and smooth edges, then turned into every asset the app needs.

Clean-up: upscale 4x, snap every pixel to the nearest of the four colours (sunflower, white, ink,
tangerine), smooth each colour's edge (blur + cut at half), rebuild, centre, scale back to 1024.
Writes design/icon/bean/. Pass --apply to also copy them over assets/images/ (the old files stay in git).
Run: python3 scripts/brand/icon-bean.py [--apply]
"""
import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'design/icon/hf-v5/bean.png'
OUT = ROOT / 'design/icon/bean'
OUT.mkdir(parents=True, exist_ok=True)

SUN, WHITE, INK, TANG = (255, 204, 46), (255, 255, 255), (0, 0, 0), (255, 108, 44)
NIGHT = (22, 20, 15)
K = 4
S = 1024


def smooth(mask, r=3 * K):
    return mask.filter(ImageFilter.GaussianBlur(r)).point(lambda v: 255 if v >= 128 else 0)


def layers():
    """Masks at 4x: silhouette (not background), white, tangerine, eyes. Centred on the canvas."""
    a = np.array(Image.open(SRC).convert('RGB').resize((S * K, S * K), Image.LANCZOS)).astype(float)
    pal = np.array([[253, 200, 27], [255, 255, 255], [0, 0, 0], [255, 120, 40]], float)
    idx = ((a[:, :, None, :] - pal[None, None]) ** 2).sum(-1).argmin(-1)
    m = lambda cond: Image.fromarray((cond * 255).astype(np.uint8))
    sil = smooth(m(idx != 0))
    white = smooth(m(idx == 1))
    tang = smooth(m(idx == 3))
    # eyes = ink islands not connected to the outline
    ink = np.array(sil) > 0
    ink &= ~(np.array(white) > 0) & ~(np.array(tang) > 0)
    ink_img = m(ink).copy()  # fromarray shares numpy memory; floodfill needs its own copy
    ys, xs = np.where(ink)
    seed = (int(xs.min()), int(ys[xs == xs.min()][0]))  # leftmost ink pixel is on the outline
    ImageDraw.floodfill(ink_img, seed, 128)
    eyes = smooth(m(np.array(ink_img) == 255), 2 * K)
    # centre: bbox centre at (50%, 49%) of the canvas (a touch above middle looks centred)
    x0, y0, x1, y1 = sil.getbbox()
    dx, dy = round(S * K * 0.5 - (x0 + x1) / 2), round(S * K * 0.49 - (y0 + y1) / 2)
    out = {}
    for name, im in dict(sil=sil, white=white, tang=tang, eyes=eyes).items():
        c = Image.new('L', im.size, 0)
        c.paste(im, (dx, dy))
        out[name] = c
    return out


def compose(L, bg, line, eye=INK, size=S, transparent=False, scale=1.0):
    W = S * K
    im = Image.new('RGBA', (W, W), (0, 0, 0, 0) if transparent else bg + (255,))
    duck = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    duck.paste(line + (255,), (0, 0), L['sil'])
    duck.paste(WHITE + (255,), (0, 0), L['white'])
    duck.paste(TANG + (255,), (0, 0), L['tang'])
    duck.paste(eye + (255,), (0, 0), L['eyes'])
    if scale != 1.0:
        d = duck.resize((round(W * scale), round(W * scale)), Image.LANCZOS)
        duck = Image.new('RGBA', (W, W), (0, 0, 0, 0))
        duck.alpha_composite(d, ((W - d.width) // 2, (W - d.height) // 2))
    im.alpha_composite(duck)
    return im.resize((size, size), Image.LANCZOS)


def rounded(im, r=0.2237):
    m = Image.new('L', (im.width * K, im.height * K), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, m.width - 1, m.height - 1], radius=int(m.width * r), fill=255)
    m = m.resize(im.size, Image.LANCZOS)
    o = im.convert('RGBA')
    o.putalpha(m)
    return o


if __name__ == '__main__':
    L = layers()
    light = compose(L, SUN, INK).convert('RGB')
    # iOS dark icon: night background; the ink line turns sunflower so the duck keeps its edge
    dark = compose(L, NIGHT, SUN).convert('RGB')
    tinted = dark.convert('L').convert('RGB')
    light.save(OUT / 'icon.png')
    dark.save(OUT / 'icon-dark.png')
    tinted.save(OUT / 'icon-tinted.png')
    rounded(light).save(OUT / 'splash-icon.png')
    rounded(dark).save(OUT / 'splash-icon-dark.png')
    # Android adaptive: the duck alone, inside the 66% safe circle; background stays plain sunflower
    compose(L, SUN, INK, transparent=True, scale=0.74).save(OUT / 'android-icon-foreground.png')
    Image.new('RGB', (S, S), SUN).save(OUT / 'android-icon-background.png')
    W = S * K
    mono = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    face = Image.fromarray(np.minimum(np.array(L['white']) + np.array(L['tang']), 255).astype(np.uint8))
    face = Image.fromarray(np.where(np.array(L['eyes']) > 0, 0, np.array(face)).astype(np.uint8))
    mono.paste((255, 255, 255, 255), (0, 0), face)
    d = mono.resize((round(W * 0.74), round(W * 0.74)), Image.LANCZOS)
    mono = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    mono.alpha_composite(d, ((W - d.width) // 2, (W - d.height) // 2))
    mono.resize((S, S), Image.LANCZOS).save(OUT / 'android-icon-monochrome.png')
    light.resize((48, 48), Image.LANCZOS).save(OUT / 'favicon.png')
    if '--apply' in sys.argv:
        for f in OUT.glob('*.png'):
            shutil.copy(f, ROOT / 'assets/images' / f.name)
        print('applied to assets/images')
    print('written', OUT)
