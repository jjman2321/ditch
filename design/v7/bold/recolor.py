# Recolour the teal bill of duck-teal.png. Usage: python3 recolor.py out.png R G B
import sys
from PIL import Image
src = Image.open('../../brand/duck-teal.png').convert('RGBA')
r, g, b = map(int, sys.argv[2:5])
px = src.load()
w, h = src.size
for y in range(h):
    for x in range(w):
        R, G, B, A = px[x, y]
        if A == 0: continue
        # teal-ish pixel: green and blue well above red. Blend by "tealness" for antialiased edges
        t = max(0, min(1, ((G + B) / 2 - R) / 145))
        if t > 0.05:
            lum = max(G, B) / 255  # edge darkening carried through
            k = min(1, lum / 0.63)
            nr, ng, nb = r * k, g * k, b * k
            px[x, y] = (round(R * (1 - t) + nr * t), round(G * (1 - t) + ng * t), round(B * (1 - t) + nb * t), A)
src.save(sys.argv[1])
