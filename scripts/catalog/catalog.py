"""Shared reader for scripts/catalog/catalog.txt (the hand-edited catalog)."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CATALOG = ROOT / 'scripts/catalog/catalog.txt'
APPS = ROOT / 'scripts/catalog/apps.json'
COUNTRIES = ['US', 'GB', 'CA', 'AU', 'IE', 'NZ', 'DE', 'NL', 'FR', 'IT', 'ES', 'IN']
CATEGORIES = {
    'ST': 'Streaming',
    'MU': 'Music & audio',
    'AI': 'AI',
    'PR': 'Productivity',
    'CS': 'Cloud & security',
    'SH': 'Shopping & food',
    'HF': 'Health & fitness',
    'DA': 'Dating',
    'SO': 'Social',
    'NE': 'News & reading',
    'GA': 'Gaming',
    'LE': 'Learning',
}


def _split(line):
    """Split on | but not inside (...) so seller regexes can use alternation."""
    parts, cur, depth = [], '', 0
    for ch in line:
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
        if ch == '|' and depth == 0:
            parts.append(cur)
            cur = ''
        else:
            cur += ch
    parts.append(cur)
    return parts


def read_catalog():
    rows = []
    for raw in CATALOG.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line or line.startswith('#'):
            continue
        p = _split(line)
        if len(p) not in (11, 12):
            raise ValueError(f'bad catalog line ({len(p)} columns): {line}')
        sid, name, cat, color, mono, cycle, countries, aliases, term, cc, seller = p[:11]
        flags = p[11].split(',') if len(p) > 11 and p[11] else []
        if set(flags) - {'apple'}:
            raise ValueError(f'unknown flags {flags} (too many columns?): {line}')
        rows.append(
            {
                'id': sid,
                'name': name,
                'category': CATEGORIES[cat],
                'color': color,
                'mono': mono,
                'cycle': {'m': 'monthly', 'y': 'yearly'}[cycle],
                'countries': None if countries == '-' else countries.split(','),
                'aliases': [a.strip() for a in aliases.split(',') if a.strip()],
                'term': None if term == '-' else term,
                'cc': cc,
                'seller': None if seller == '-' else seller,
                'apple': 'apple' in flags,
            }
        )
    ids = [r['id'] for r in rows]
    dupes = {i for i in ids if ids.count(i) > 1}
    if dupes:
        raise ValueError(f'duplicate ids: {dupes}')
    for r in rows:
        for c in r['countries'] or []:
            if c not in COUNTRIES:
                raise ValueError(f'{r["id"]}: unknown country {c}')
    return rows
