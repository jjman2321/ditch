"""App icon v4: the app's own duck (design/icon/hf-6-peek-up320.png: same eyes, bill, head shape and
outline weight), redrawn cleanly and given a complete body: the sides close in a round bottom with
two small feet, so he stands in the icon instead of rising from the bottom edge.

How: the duck's silhouette is taken from the source, extended with the new lower body, smoothed (the
AI art has small kinks in its outline), and re-outlined at the source's 40px weight. The original eyes
and bill are pasted back on top, bill recoloured tangerine like scripts/brand/cut-duck.py.
Writes design/icon/v4/. Nothing in assets/ changes. Run: python3 scripts/brand/icon-v4.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'design/icon/hf-6-peek-up320.png'
OUT = ROOT / 'design/icon/v4'
OUT.mkdir(parents=True, exist_ok=True)

SUN = (255, 204, 46)
INK_DARK = (22, 20, 15)
TANGERINE = (255, 108, 44)
STROKE = 40  # outline weight in source pixels
CUT_Y = 700  # the source is used above here; below, the new body
K = 2  # work at 2x for smooth edges


def erode(img, r):
    """Shrink a mask by about r pixels (a disc, by repeated small steps). Fast in numpy."""
    a = np.array(img) > 127
    for _ in range(int(r)):
        b = a.copy()
        b[1:, :] &= a[:-1, :]
        b[:-1, :] &= a[1:, :]
        b[:, 1:] &= a[:, :-1]
        b[:, :-1] &= a[:, 1:]
        a = b
    return Image.fromarray((a * 255).astype(np.uint8))


def dilate(img, r):
    a = np.array(img) > 127
    for _ in range(int(r)):
        b = a.copy()
        b[1:, :] |= a[:-1, :]
        b[:-1, :] |= a[1:, :]
        b[:, 1:] |= a[:, :-1]
        b[:, :-1] |= a[:, 1:]
        a = b
    return Image.fromarray((a * 255).astype(np.uint8))


def source():
    rgb = np.array(Image.open(SRC).convert('RGB')).astype(float)
    lum = rgb.mean(axis=2)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    h, w = lum.shape
    walls = Image.fromarray(np.where(lum > 24, 255, 0).astype(np.uint8)).copy()
    for seed in [(0, 0), (w - 1, 0)]:
        ImageDraw.floodfill(walls, seed, 128)
    outside = np.array(walls) == 128
    return rgb, lum, chroma, outside


def build(body_drop=70, feet=True, rim=None):
    rgb, lum, chroma, outside = source()
    h, w = lum.shape
    H = 1320
    # 1. Silhouette: the source's (inside + outline) above the cut, plus the new lower body.
    sil = np.zeros((H, w), bool)
    sil[:CUT_Y] = ~outside[:CUT_Y]
    left_outer, right_outer = 45.0, 950.0  # outer edges of the side lines at the cut (measured)
    side_end = CUT_Y + body_drop
    cx, rx = (left_outer + right_outer) / 2, (right_outer - left_outer) / 2
    ry = 0.42 * rx
    yy, xx = np.mgrid[0:H, 0:w]
    sil |= (yy >= CUT_Y - 2) & (yy <= side_end) & (xx >= left_outer) & (xx <= right_outer)
    sil |= (yy > side_end) & (((xx - cx) / rx) ** 2 + ((yy - side_end) / ry) ** 2 <= 1)
    # The bill pokes out past the head: keep it out of the silhouette (it's pasted on top later).
    bill = (~outside) & (chroma > 24)
    m = Image.fromarray((sil * 255).astype(np.uint8)).resize((w * K, H * K), Image.LANCZOS)
    # 2. Smooth the outline's small kinks: blur, then cut at half.
    m = m.filter(ImageFilter.GaussianBlur(5 * K)).point(lambda v: 255 if v >= 128 else 0)
    inner = erode(m, STROKE * K / 2 * 1.0)
    # soften the hard thresholded edges a little
    m_s = m.filter(ImageFilter.GaussianBlur(1.2))
    inner_s = inner.filter(ImageFilter.GaussianBlur(1.2))
    out = Image.new('RGBA', (w * K, H * K), (0, 0, 0, 0))
    ink = (0, 0, 0)
    if rim:  # dark-mode version: a cream rim around the whole duck, like the app
        rim_m = dilate(m, 12 * K).filter(ImageFilter.GaussianBlur(1.2))
        out.paste(rim + (255,), (0, 0), rim_m)
    # 3. Feet, behind the body.
    if feet:
        d = ImageDraw.Draw(out)
        bottom = side_end + ry
        for fx in (cx - 0.36 * rx, cx + 0.30 * rx):
            fw, fh = 0.34 * rx, 0.24 * rx
            box = [(fx - fw / 2) * K, (bottom - fh * 0.30) * K, (fx + fw / 2) * K, (bottom + fh * 0.70) * K]
            d.ellipse(box, fill=TANGERINE + (255,), outline=ink + (255,), width=int(STROKE * 0.8 * K))
    out.paste(ink + (255,), (0, 0), m_s)
    out.paste((255, 255, 255, 255), (0, 0), inner_s)
    # 4. The original eyes and bill on top (ink and colour inside the head, plus the whole bill area).
    src = np.zeros((H, w, 4), np.uint8)
    feat = np.zeros((H, w), float)
    # Eyes: ink well inside the head only, so no trace of the old outline comes along.
    deep = erode(inner, STROKE * K)
    inner_src = np.array(deep.resize((w, H), Image.LANCZOS)) > 128
    eyes = inner_src[:h] & (lum < 128) & ~bill
    ys, xs = np.where(bill)
    bx0, bx1, by0, by1 = xs.min() - 60, xs.max() + 60, ys.min() - 60, ys.max() + 60
    billzone = np.zeros((h, w), bool)
    billzone[by0:by1, bx0:bx1] = True
    # the bill and its own outline: ink or colour inside the bill box, but not the far side of the head
    billparts = billzone & ~outside & ((chroma > 24) | (lum < 128))
    near_bill = np.array(dilate(Image.fromarray((bill * 255).astype(np.uint8)), STROKE)) > 0
    billparts &= near_bill
    sel = eyes | billparts
    color = rgb.copy()
    k = np.clip(rgb[..., 1] / 161.0, 0, 1)
    color[bill] = np.array(TANGERINE) * k[bill, None]
    color[~bill] = np.where(lum[~bill, None] < 128, 0, 255)
    a = np.where(sel, np.where(bill, 1.0, np.clip((255 - lum) / 255 * 1.4, 0, 1)), 0)
    src[:h, :, :3] = color.clip(0, 255).astype(np.uint8)
    src[:h, :, 3] = (a * 255).astype(np.uint8)
    feat_img = Image.fromarray(src, 'RGBA').resize((w * K, H * K), Image.LANCZOS)
    out.alpha_composite(feat_img)
    out = out.resize((w, H), Image.LANCZOS)
    return out  # kept in source coordinates (for placing by the eyes)


EYE_SRC = (586.0, 430.0)  # midpoint between the eyes in the source
HEAD_W_SRC = 905.0  # outer width of the head in the source


def place(full_src, bg, head_frac, eye_x, eye_y):
    """Scale so the head is `head_frac` of the icon wide and put the eyes' midpoint at (eye_x, eye_y)."""
    S = 1024
    k = S * head_frac / HEAD_W_SRC
    d = full_src.resize((round(full_src.width * k), round(full_src.height * k)), Image.LANCZOS)
    c = Image.new('RGBA', (S, S), bg + (255,))
    c.alpha_composite(d, (round(S * eye_x - EYE_SRC[0] * k), round(S * eye_y - EYE_SRC[1] * k)))
    return c.convert('RGB')


def icon(d, bg, width_frac, center_y=0.5, shift=0.0):
    S = 1024
    w = round(S * width_frac)
    hh = round(d.height * w / d.width)
    dd = d.resize((w, hh), Image.LANCZOS)
    c = Image.new('RGBA', (S, S), bg + (255,))
    c.alpha_composite(dd, (round((S - w) / 2 + S * shift), round(S * center_y - hh / 2)))
    return c.convert('RGB')


def tight(im):
    return im.crop(im.getchannel('A').getbbox())


if __name__ == '__main__':
    whole = build(70, True)
    long = build(600, False)  # a body that runs well past the bottom, for crops
    tight(whole).save(OUT / 'duck-full.png')
    # 1 Face close-up (research pick A): head 116% wide, eyes 44% down; bleeds off the sides and bottom.
    place(long, SUN, 1.16, 0.49, 0.44).save(OUT / '1-close.png')
    # 2 Peek (research B): head 86% wide, eyes 50% down, body runs off the bottom.
    place(long, SUN, 0.86, 0.585, 0.50).save(OUT / '2-peek.png')
    # 3 Whole duck with feet, floating with margin (research C).
    icon(tight(whole), SUN, 0.74, 0.53, -0.02).save(OUT / '3-whole.png')
