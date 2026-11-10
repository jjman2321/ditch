"""Read the App Store "In-App Purchases" list for apps, per storefront.

Usage: python3 -I scripts/catalog/fetch-iap.py [--top] [--force] [id ...]

For each pinned app (apps.json) it opens https://apps.apple.com/{cc}/app/id{ID}
in every country the service is sold in (English page where the store has
one) and saves the list Apple shows (up to 10 names and prices) to
iap-2026-11.json. That file is the evidence for "Apple billing" prices;
iap-prices.py turns it into rows for docs/research/prices-2026-11.json.
"""

import functools
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from catalog import APPS, COUNTRIES, ROOT, read_catalog  # noqa: E402

print = functools.partial(print, flush=True)  # noqa: A001
OUT = ROOT / 'scripts/catalog/iap-2026-11.json'
TOP = ROOT / 'scripts/catalog/top100.txt'
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'}
LANG = {'DE': 'en-GB', 'NL': 'en-GB', 'FR': 'en-GB', 'IT': 'en-GB', 'ES': 'en-GB'}
ANNOT = re.compile(r'"\$kind":"Annotation","title":"([^"]*)","summary":"([^"]*)","items":\[(\{"\$kind":"textPair".*?)\]')
PAIR = re.compile(r'"leadingText":"((?:[^"\\]|\\.)*)","trailingText":"((?:[^"\\]|\\.)*)"')


def page(url, tries=6):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
                return r.read().decode('utf-8')
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if e.code in (403, 429, 500, 502, 503) and i < tries - 1:
                time.sleep(30 * (i + 1))
                continue
            raise
        except (urllib.error.URLError, TimeoutError):
            if i < tries - 1:
                time.sleep(10)
                continue
            raise


def iap_list(html):
    """[(name, price text)] from the page's In-App Purchases annotation, or []."""
    for m in ANNOT.finditer(html):
        items = PAIR.findall(m.group(3))
        if items:
            return [(json.loads(f'"{a}"'), json.loads(f'"{b}"').replace(' ', ' ')) for a, b in items]
    return []


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if '--top' in sys.argv:
        args += [l.strip() for l in TOP.read_text().splitlines() if l.strip() and not l.startswith('#')]
    force = '--force' in sys.argv
    # --shard=k/n: only every n-th service, saved to its own part file (run n at once, then --merge)
    shard = next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--shard=')), None)
    if '--merge' in sys.argv:
        out = json.loads(OUT.read_text()) if OUT.exists() else {}
        for part in sorted(OUT.parent.glob(OUT.name + '.part*')):
            for sid, by_cc in json.loads(part.read_text()).items():
                out.setdefault(sid, {}).update(by_cc)
            part.unlink()
        OUT.write_text(json.dumps(out, indent=1, ensure_ascii=False, sort_keys=True) + '\n')
        print('merged into', OUT.name)
        return
    apps = json.loads(APPS.read_text())
    rows = {r['id']: r for r in read_catalog()}
    done = json.loads(OUT.read_text()) if OUT.exists() else {}
    dest = OUT if not shard else OUT.parent / f'{OUT.name}.part{shard.split("/")[0]}'
    out = json.loads(dest.read_text()) if dest.exists() else {}
    ids = list(dict.fromkeys(args))
    if shard:
        k, n = map(int, shard.split('/'))
        ids = ids[k::n]
    for sid in ids:
        pin = apps.get(sid)
        if not pin or sid not in rows:
            continue
        for cc in rows[sid]['countries'] or COUNTRIES:
            if not force and (cc in out.get(sid, {}) or cc in done.get(sid, {})):
                continue
            url = f'https://apps.apple.com/{cc.lower()}/app/id{pin["trackId"]}'
            html = page(url + (f'?l={LANG[cc]}' if cc in LANG else ''))
            time.sleep(2.5)
            items = iap_list(html) if html else None
            out.setdefault(sid, {})[cc] = {'url': url, 'checked': time.strftime('%Y-%m-%d'), 'items': items}
            print(f'{sid:20} {cc} {"not in this store" if items is None else len(items)}')
            dest.write_text(json.dumps(out, indent=1, ensure_ascii=False, sort_keys=True) + '\n')


if __name__ == '__main__':
    main()
