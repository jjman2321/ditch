"""Finch-style, front-facing: the same duck (white head, ink line at the app's weight, black dot
eyes, tangerine bill with an ink outline) looking straight at you, his face filling the icon.
Proportions come from the app duck (design/icon/hf-6-peek-up320.png): line 4.4% of head width,
eye 7.5%. Writes design/icon/finch/. Nothing in assets/ changes.
Run: python3 scripts/brand/icon-finch-front.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'design/icon/finch'
OUT.mkdir(parents=True, exist_ok=True)
SUN, TANG, INK, WHITE = (255, 204, 46), (255, 108, 44), (0, 0, 0), (255, 255, 255)
NIGHT, CREAM = (22, 20, 15), (255, 248, 231)
K = 4  # supersample


def bill_path(cx, cy, w, h, n=180):
    """A front-on duck bill: flat-ish top that dips in the middle, full round bottom."""
    import math
    pts = []
    for i in range(n + 1):
        t = math.pi * i / n  # top edge, left to right
        x = cx - w / 2 * math.cos(t)
        y = cy - h * 0.40 * math.sin(t) ** 0.55  # rounded top, like a bill seen head-on
        pts.append((x, y))
    for i in range(n + 1):
        t = math.pi * i / n  # bottom edge, right to left
        x = cx + w / 2 * math.cos(t)
        y = cy + h * 0.60 * math.sin(t) ** 0.65
        pts.append((x, y))
    return pts


def draw(bg=SUN, face=WHITE, ink=INK, line=True, blush=False, head=(700, 780, 150), eye_gap=0.36,
         eye_y=430, eye_d=92, bill=(400, 150, 585), stroke=40, rim=None):
    S = 1024 * K
    s = lambda v: v * K
    im = Image.new('RGBA', (S, S), bg + (255,))
    d = ImageDraw.Draw(im)
    rx, ry, top = head
    cy = top + ry
    box = [s(512 - rx), s(top), s(512 + rx), s(top + 2 * ry)]
    if rim:
        r = 14
        d.ellipse([box[0] - s(r), box[1] - s(r), box[2] + s(r), box[3] + s(r)], fill=rim)
    if line:
        d.ellipse(box, fill=ink)
        d.ellipse([box[0] + s(stroke), box[1] + s(stroke), box[2] - s(stroke), box[3] - s(stroke)], fill=face)
    else:
        d.ellipse(box, fill=face)
    if blush:
        bl = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        bd = ImageDraw.Draw(bl)
        for sx in (-1, 1):
            x = 512 + sx * 330
            bd.ellipse([s(x - 95), s(eye_y + 70), s(x + 95), s(eye_y + 175)], fill=TANG + (70,))
        im.alpha_composite(bl.filter(ImageFilter.GaussianBlur(s(6))))
    gap = eye_gap * 2 * rx / 2
    for sx in (-1, 1):
        x = 512 + sx * gap
        d.ellipse([s(x - eye_d / 2), s(eye_y - eye_d * 0.56), s(x + eye_d / 2), s(eye_y + eye_d * 0.56)], fill=ink)
    bw, bh, by = bill
    outer = [(s(x), s(y)) for x, y in bill_path(512, by, bw + 2 * stroke * 0.9, bh + 2 * stroke * 0.9)]
    inner = [(s(x), s(y)) for x, y in bill_path(512, by, bw, bh)]
    d.polygon(outer, fill=ink)
    d.polygon(inner, fill=TANG)
    # the line between upper and lower bill, like the app duck's mouth line
    return im.resize((1024, 1024), Image.LANCZOS).convert('RGB')


if __name__ == '__main__':
    draw().save(OUT / 'front-1-lined.png')
    draw(blush=True).save(OUT / 'front-2-blush.png')
    draw(line=False, blush=True).save(OUT / 'front-3-flat.png')
    draw(head=(560, 600, 190), eye_y=470, eye_d=84, bill=(350, 135, 610), stroke=36).save(OUT / 'front-4-smaller.png')
    draw(bg=NIGHT, rim=CREAM).save(OUT / 'front-1-dark.png')
