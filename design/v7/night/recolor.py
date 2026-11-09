# Recolour the teal bill of duck-teal.png to the Night accent (lamp amber).
import sys
from PIL import Image
src = Image.open('../../brand/duck-teal.png').convert('RGBA')
acc = tuple(int(sys.argv[1][i:i+2], 16) for i in (0, 2, 4)) if len(sys.argv) > 1 else (255, 181, 71)
teal = (4, 162, 149)
px = src.load()
w, h = src.size
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a == 0: continue
        # teal-ish: green & blue well above red
        if g - r > 40 and b - r > 30:
            t = min(1.0, g / teal[1])
            # mix of teal*t with white? if r high it's toward white
            wmix = r / 255.0  # amount of white
            nr = int(acc[0] * t * (1 - wmix) + 255 * wmix)
            ng = int(acc[1] * t * (1 - wmix) + 255 * wmix)
            nb = int(acc[2] * t * (1 - wmix) + 255 * wmix)
            px[x, y] = (min(255, nr), min(255, ng), min(255, nb), a)
src.save('duck-amber.png')
print('ok', acc)
