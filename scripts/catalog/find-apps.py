"""Find each service's official App Store app and pin it in apps.json.

Usage: python3 -I scripts/catalog/find-apps.py [id ...]

For every catalog row with a search term and no pin yet, it searches the
App Store in the row's storefront (apps.apple.com search, then one iTunes
lookup call for the top results; the iTunes Search API throttles hard
with 403s), keeps only results whose seller
matches the row's seller regex, and pins the best one (trackId, name,
seller, storefront). Review the printed matches: a wrong pin means a wrong
logo. To fix one, edit apps.json by hand (set "trackId") or delete its
entry and re-run with a better search term.
"""

import functools
import json
import re
import sys
import time
import urllib.parse
import urllib.request

sys.path.insert(0, str(__import__('pathlib').Path(__file__).resolve().parent))
from catalog import APPS, read_catalog  # noqa: E402

print = functools.partial(print, flush=True)  # noqa: A001
UA = {'User-Agent': 'ditch-catalog/1.0'}


def get_json(url, tries=8):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                return json.loads(r.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            if e.code in (403, 429, 500, 502, 503) and i < tries - 1:
                time.sleep(60)  # Apple answers 403 when we go too fast
                continue
            raise
        except (urllib.error.URLError, TimeoutError):
            if i < tries - 1:
                time.sleep(5 * (i + 1))
                continue
            raise


def get_text(url, tries=6):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read().decode('utf-8')
        except urllib.error.HTTPError as e:
            if e.code in (403, 429, 500, 502, 503) and i < tries - 1:
                time.sleep(30 * (i + 1))
                continue
            raise


def norm(s):
    return re.sub(r'[^a-z0-9]', '', s.lower().replace('+', 'plus'))


def score(row, res):
    name = norm(res['trackName'])
    want = [norm(row['name']), norm(row['term'])] + [norm(a) for a in row['aliases']]
    s = 0
    if any(w and name.startswith(w) for w in want):
        s += 3
    elif any(w and w in name for w in want):
        s += 2
    return s


def main():
    only = set(sys.argv[1:])
    apps = json.loads(APPS.read_text()) if APPS.exists() else {}
    for row in read_catalog():
        if not row['term'] or (only and row['id'] not in only):
            continue
        if row['id'] in apps and not only:
            continue
        q = urllib.parse.urlencode({'term': row['term']})
        html = get_text(f'https://apps.apple.com/{row["cc"]}/iphone/search?{q}')
        found = list(dict.fromkeys(re.findall(r'"adamId":"(\d+)"', html)))[:15]
        time.sleep(2)
        data = get_json(f'https://itunes.apple.com/lookup?id={",".join(found)}&country={row["cc"]}') if found else {'results': []}
        order = {int(x): i for i, x in enumerate(found)}
        data['results'] = sorted((r for r in data.get('results', []) if r.get('kind') == 'software'), key=lambda r: order.get(r['trackId'], 99))
        time.sleep(2)
        seller = re.compile(row['seller'], re.I)
        ok = [r for r in data.get('results', []) if seller.search(r.get('sellerName', '')) or seller.search(r.get('artistName', ''))]
        ok.sort(key=lambda r: -score(row, r))  # stable: keeps Apple's relevance order on ties
        if not ok or score(row, ok[0]) == 0:
            top = [(r['trackName'], r.get('sellerName')) for r in data.get('results', [])[:5]]
            print(f'NO MATCH  {row["id"]:22} term={row["term"]!r}: {top}')
            continue
        r = ok[0]
        apps[row['id']] = {'trackId': r['trackId'], 'trackName': r['trackName'], 'seller': r.get('sellerName'), 'cc': row['cc']}
        print(f'ok        {row["id"]:22} {r["trackId"]:>11} {r["trackName"]!r} / {r.get("sellerName")!r}')
        APPS.write_text(json.dumps(dict(sorted(apps.items())), indent=1, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
