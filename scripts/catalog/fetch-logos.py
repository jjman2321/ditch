"""Download each pinned app's App Store icon into assets/logos/<id>.png.

Usage: python3 -I scripts/catalog/fetch-logos.py [--force] [id ...]
Needs Pillow (pip install pillow). Then run `npm run catalog`.

Reads the pins in apps.json (made by find-apps.py, checked by hand), looks
each app up by trackId in its storefront, checks the seller still matches
the catalog's seller regex, and saves a 120x120 PNG with a 256-colour
palette (about 2-12 KB each; fewer colours for busy icons). Existing files are kept unless --force.
Pass --optimize to only re-shrink the PNGs already in assets/logos.
"""

import io
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from catalog import APPS, ROOT, read_catalog  # noqa: E402

OUT = ROOT / 'assets/logos'
SIZE = 120
UA = {'User-Agent': 'ditch-catalog/1.0'}


def fetch(url, tries=6):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (403, 429, 500, 502, 503) and i < tries - 1:
                time.sleep(10 * (i + 1))
                continue
            raise
        except (urllib.error.URLError, TimeoutError):
            if i < tries - 1:
                time.sleep(5 * (i + 1))
                continue
            raise


def save_small(img, path):
    """120x120, flattened on white (tiles are white behind the icon), 256-colour palette."""
    img = img.convert('RGBA')
    if img.size != (SIZE, SIZE):
        img = img.resize((SIZE, SIZE), Image.LANCZOS)
    flat = Image.new('RGB', img.size, (255, 255, 255))
    flat.paste(img, mask=img.split()[3])
    for colors in (256, 128, 64):  # fewer colours until it's under 12 KB
        pal = flat.quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
        pal.save(path, optimize=True)
        if path.stat().st_size <= 12_000:
            break


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    force = '--force' in sys.argv
    if '--optimize' in sys.argv:
        for f in sorted(OUT.glob('*.png')):
            save_small(Image.open(f), f)
        print('re-optimised', len(list(OUT.glob('*.png'))))
        return
    apps = json.loads(APPS.read_text())
    rows = {r['id']: r for r in read_catalog()}
    for sid, pin in apps.items():
        if sid not in rows or (args and sid not in args):
            continue
        path = OUT / f'{sid}.png'
        if path.exists() and not force:
            continue
        data = json.loads(fetch(f'https://itunes.apple.com/lookup?id={pin["trackId"]}&country={pin["cc"]}'))
        time.sleep(1)
        if not data.get('results'):
            print(f'GONE      {sid}: {pin["trackId"]} not in the {pin["cc"]} store')
            continue
        res = data['results'][0]
        seller = rows[sid]['seller']
        if seller and not (re.search(seller, res.get('sellerName', ''), re.I) or re.search(seller, res.get('artistName', ''), re.I)):
            print(f'SELLER?   {sid}: {res.get("sellerName")!r} does not match {seller!r}; skipped')
            continue
        url = res['artworkUrl512'].rsplit('/', 1)[0] + '/512x512bb.png'
        save_small(Image.open(io.BytesIO(fetch(url))), path)
        time.sleep(0.5)
        print(f'saved     {sid:22} {path.stat().st_size:>6} B  {res["trackName"]!r}')


if __name__ == '__main__':
    main()
