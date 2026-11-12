"""Finch-style icon options: the duck's face fills the icon, the way Finch's bird does.
Same duck as the app (built by icon-v4.py). Features (eyes + bill) are centred; the head
runs off the sides and bottom so only the top of the head shows against sunflower.
Writes design/icon/finch/. Nothing in assets/ changes. Run: python3 scripts/brand/icon-finch.py
"""
import importlib.util
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('v4', ROOT / 'scripts/brand/icon-v4.py')
v4 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v4)

OUT = ROOT / 'design/icon/finch'
OUT.mkdir(parents=True, exist_ok=True)
FEAT_C = (669.0, 525.0)  # centre of eyes + bill in source pixels (measured)


def finch(src, head_frac, cy=0.52, cx=0.5, blush=False):
    S = 1024
    k = S * head_frac / v4.HEAD_W_SRC
    d = src.resize((round(src.width * k), round(src.height * k)), Image.LANCZOS)
    c = Image.new('RGBA', (S, S), v4.SUN + (255,))
    ox, oy = round(S * cx - FEAT_C[0] * k), round(S * cy - FEAT_C[1] * k)
    if blush:  # Finch's cheeks: soft tangerine, under the eyes, drawn on the face only
        face = Image.new('L', (S, S), 0)
        face.paste(d.getchannel('A'), (ox, oy))
        cheeks = Image.new('L', (S, S), 0)
        dr = ImageDraw.Draw(cheeks)
        for ex in (432, 737):
            x, y = ox + ex * k, oy + 560 * k
            r = 70 * k
            dr.ellipse([x - r * 1.25 - (60 * k if ex < 600 else -60 * k), y - r, x + r * 1.25 - (60 * k if ex < 600 else -60 * k), y + r], fill=90)
        cheeks = cheeks.filter(ImageFilter.GaussianBlur(10))
    c.alpha_composite(d, (ox, oy))
    if blush:
        layer = Image.new('RGBA', (S, S), v4.TANGERINE + (0,))
        layer.putalpha(Image.fromarray(__import__('numpy').minimum(__import__('numpy').array(cheeks), __import__('numpy').array(face)).astype('uint8')))
        # keep the bill and eyes on top
        top = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        top.alpha_composite(d, (ox, oy))
        c.alpha_composite(layer)
    return c.convert('RGB')


if __name__ == '__main__':
    lined = v4.build(600, False)
    flat = v4.build(600, False, head_line=False)
    finch(lined, 1.45, 0.53).save(OUT / 'f1-lined.png')
    finch(flat, 1.45, 0.53).save(OUT / 'f2-flat.png')
    finch(lined, 1.30, 0.54).save(OUT / 'f3-lined-smaller.png')
