"""Turn the app's Archivo TTFs into small WOFF2 files for the website (Latin + money symbols only).
Run once after the app's fonts change: python3 scripts/fonts.py"""
from pathlib import Path

from fontTools import subset

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parents[1] / 'src/fonts'
OUT.mkdir(parents=True, exist_ok=True)
TEXT = ''.join(chr(c) for c in range(0x20, 0x7F)) + '’‘“”–—…·•€£₹¥¢×→←↗✓✕°%€$'
for name in ['Display', 'Title', 'WideBold', 'WideHeavy', 'Wordmark']:
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    font = subset.load_font(str(ROOT / f'assets/fonts/ArchivoDitch-{name}.ttf'), opts)
    s = subset.Subsetter(opts)
    s.populate(text=TEXT)
    s.subset(font)
    subset.save_font(font, str(OUT / f'ArchivoDitch-{name}.woff2'), opts)
    print(name, (OUT / f'ArchivoDitch-{name}.woff2').stat().st_size)
