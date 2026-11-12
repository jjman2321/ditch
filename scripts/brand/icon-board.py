"""Board for the v4 icon options: each option at real sizes, and on a mock home screen between
real App Store icons (from the research download). Run after icon-v4.py:
python3 scripts/brand/icon-board.py <research icon folder>
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
V4 = ROOT / 'design/icon/v4'
RES = Path(sys.argv[1])
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
FS = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
OPTS = [('1-close.png', '1  Face close-up'), ('2-peek.png', '2  Peek'), ('3-whole.png', '3  Whole duck')]
NEIGH = ['duolingo', 'snapchat', 'bobby', 'rocketmoney', 'cashapp', 'finch', 'reddit', 'headspace', 'calm', 'waze', 'copilot']


def mask(im, size):
    im = im.convert('RGB').resize((size, size), Image.LANCZOS)
    m = Image.new('L', (size, size), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.225), fill=255)
    o = Image.new('RGBA', (size, size))
    o.paste(im, (0, 0), m)
    return o


def home(ours, bg, fg):
    """A 4x3 grid of 62pt icons (124px at 2x) with ours in the middle of the second row."""
    s, gap = 124, 44
    W = 4 * s + 5 * gap
    H = 3 * (s + 40) + 2 * gap
    im = Image.new('RGB', (W, H), bg)
    d = ImageDraw.Draw(im)
    names = NEIGH[:]
    for r in range(3):
        for c in range(4):
            x, y = gap + c * (s + gap), gap + r * (s + 40)
            if (r, c) == (1, 1):
                icon, label = ours, 'Ditch'
            else:
                n = names.pop(0)
                icon, label = Image.open(RES / f'{n}.png'), n.capitalize()
            ic = mask(icon, s)
            im.paste(ic, (x, y), ic)
            d.text((x + s / 2, y + s + 6), label, fill=fg, font=FS, anchor='mt')
    return im


def main():
    rows = []
    for fn, label in OPTS:
        ours = Image.open(V4 / fn)
        sizes = Image.new('RGB', (560, 300), (237, 230, 214))
        x = 20
        for sz in (240, 120, 60, 40):
            ic = mask(ours, sz)
            sizes.paste(ic, (x, 20 + 240 - sz), ic)
            x += sz + 18
        ImageDraw.Draw(sizes).text((20, 268), label, fill=(22, 20, 15), font=F)
        light = home(ours, (130, 170, 205), (255, 255, 255))
        dark = home(ours, (18, 20, 24), (235, 235, 235))
        row = Image.new('RGB', (sizes.width + light.width + dark.width + 40, max(sizes.height, light.height)), (237, 230, 214))
        row.paste(sizes, (0, 0))
        row.paste(light, (sizes.width + 20, 0))
        row.paste(dark, (sizes.width + light.width + 40, 0))
        rows.append(row)
    W = max(r.width for r in rows)
    H = sum(r.height for r in rows) + 20 * len(rows)
    b = Image.new('RGB', (W, H), (237, 230, 214))
    y = 0
    for r in rows:
        b.paste(r, (0, y))
        y += r.height + 20
    b = b.resize((W * 2 // 3, H * 2 // 3), Image.LANCZOS)
    b.save(V4 / 'board.jpg', quality=88)
    print(b.size)


if __name__ == '__main__':
    main()
