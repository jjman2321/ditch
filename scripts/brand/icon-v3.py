"""App icon options built from the exact duck used in the app (design/icon/hf-6-peek.png,
cut the same way as scripts/brand/cut-duck.py). Writes design/icon/v3/*.png and a board.
Nothing in assets/ is touched. Run: python3 scripts/brand/icon-v3.py
"""
import importlib.util
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'design/icon/v3'
spec = importlib.util.spec_from_file_location('cut', ROOT / 'scripts/brand/cut-duck.py')
cut = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cut)
# The same duck art, drawn with more body below the head, so the body can run off the
# bottom edge of the icon instead of ending in a flat cut.
cut.SRC = ROOT / 'design/icon/hf-6-peek-up320.png'

SUN, INK, CREAM = (255, 204, 46), (22, 20, 15), (251, 247, 238)
S = 1024


def tight(img):
    return img.crop(img.getchannel('A').getbbox())


def place(duck, bg, width_frac, bleed_frac, shift_frac=0.0):
    """Duck scaled to `width_frac` of the canvas, its head `top_frac` down; the body must reach
    the bottom edge (it's cropped there), so it never floats."""
    d = tight(duck)
    w = round(S * width_frac)
    h = round(d.height * w / d.width)
    d = d.resize((w, h), Image.LANCZOS)
    # Bottom-anchored: the body runs `bleed_frac` past the bottom edge.
    y = S - h + round(S * bleed_frac)
    print(f'  head top at {y / S:.0%} of the height, duck {w / S:.0%} wide')
    c = Image.new('RGBA', (S, S), bg + (255,))
    x = round((S - w) / 2 + S * shift_frac)
    c.alpha_composite(d.crop((0, 0, w, S - y)), (x, y))
    return c.convert('RGB')


def main():
    light = cut.cut()
    dark = cut.with_rim(light)
    opts = {
        # Same framing as the app: the duck peeks up from the bottom, big, a touch left so the bill
        # (which points right) balances the head. Little empty space.
        'a-peek': place(light, SUN, 0.90, 0.04, -0.02),
        # Closer: head and bill fill the square, body bleeds off the bottom.
        'b-close': place(light, SUN, 1.08, 0.14, -0.07),
        # The same as A on ink, with the app's dark-mode cream rim (the iPhone dark-icon version).
        'c-dark': place(dark, INK, 0.90, 0.04, -0.02),
    }
    for k, im in opts.items():
        im.save(OUT / f'{k}.png')
    board(opts)


def mask(im, size):
    im = im.resize((size, size), Image.LANCZOS)
    m = Image.new('L', (size, size), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.225), fill=255)
    o = Image.new('RGBA', (size, size))
    o.paste(im, (0, 0), m)
    return o


def board(opts):
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
    fs = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22)
    labels = {'a-peek': 'A  Peek (like the app)', 'b-close': 'B  Close-up', 'c-dark': 'C  Dark-icon version of A'}
    colW = 480
    W = colW * 3 + 60
    H = 2 * 330 + 70
    b = Image.new('RGB', (W, H), (237, 230, 214))
    dr = ImageDraw.Draw(b)
    for r, (name, bg, fg) in enumerate([('Light home screen', (217, 210, 195), INK), ('Dark home screen', (27, 26, 24), (246, 240, 227))]):
        y = 30 + r * 340
        dr.rounded_rectangle([30, y, W - 30, y + 310], radius=24, fill=bg)
        dr.text((50, y + 12), name, fill=fg, font=fs)
        for c, (k, im) in enumerate(opts.items()):
            x = 50 + c * colW
            for s in (180, 120, 60, 40):
                ic = mask(im, s)
                b.paste(ic, (x, y + 60 + (180 - s)), ic)
                x += s + 18
            dr.text((50 + c * colW, y + 260), labels[k], fill=fg, font=f)
    b.save(OUT / 'board-icons.jpg', quality=90)


if __name__ == '__main__':
    main()
