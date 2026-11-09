# Builds the duck assets for v8 from design/brand/duck-teal.png.
#   duck.png       : tangerine bill (#FF6C2C), same as v7 bold
#   duck-dark.png  : same duck with a thin cream "sticker" edge so the black outline reads on ink
# Run from design/v8:  python3 make_ducks.py
from PIL import Image, ImageFilter

SRC = '../brand/duck-teal.png'
BILL = (255, 108, 44)
EDGE = (246, 240, 227)  # cream text colour used in dark mode
PAD = 10


def recolor(im):
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            t = max(0, min(1, ((g + b) / 2 - r) / 145))
            if t > 0.05:
                k = min(1, (max(g, b) / 255) / 0.63)
                nr, ng, nb = BILL[0] * k, BILL[1] * k, BILL[2] * k
                px[x, y] = (round(r * (1 - t) + nr * t), round(g * (1 - t) + ng * t), round(b * (1 - t) + nb * t), a)
    return im


duck = recolor(Image.open(SRC).convert('RGBA'))
duck.save('duck.png')

# Sticker edge: grow the alpha by ~6px on top/left/right (bottom stays flat), fill cream, put the duck on top.
w, h = duck.size
canvas = Image.new('RGBA', (w + 2 * PAD, h + PAD), (0, 0, 0, 0))
canvas.paste(duck, (PAD, PAD), duck)
alpha = canvas.split()[3].point(lambda v: 255 if v > 40 else 0)
grown = alpha.filter(ImageFilter.MaxFilter(13)).filter(ImageFilter.GaussianBlur(0.8))
edge = Image.new('RGBA', canvas.size, EDGE + (0,))
edge.putalpha(grown)
out = Image.alpha_composite(edge, canvas)
# keep the bottom edge flat (crop the grown pixels below the original bottom)
out = out.crop((0, 0, out.size[0], PAD + h))
out.save('duck-dark.png')
print('ok', duck.size, out.size)
