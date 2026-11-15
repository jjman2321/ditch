// Draws a 1200×630 share image per page (SEO skill: a unique share image per page) from scripts/og-cards.ts.
// Usage: npx tsx scripts/og-cards.ts > cards.json && node scripts/og.mjs cards.json   → public/og/{c,p,g}/<slug>.jpg
// Sunflower look like the original cards; real logos as the illustration. No duck next to prices (CLAUDE.md rule 8).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const WEB = join(dirname(fileURLToPath(import.meta.url)), '..');
const cards = JSON.parse(readFileSync(process.argv[2], 'utf8'));
// Embedded as data URIs: a page made with setContent can't read local files.
const data = (path, type) => `data:${type};base64,${readFileSync(path).toString('base64')}`;
const font = (f) => data(join(WEB, 'src/fonts', f), 'font/woff2');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const css = `
@font-face{font-family:W;src:url(${font('ArchivoDitch-Wordmark.woff2')})}
@font-face{font-family:H;src:url(${font('ArchivoDitch-WideHeavy.woff2')})}
@font-face{font-family:B;src:url(${font('ArchivoDitch-WideBold.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#FFCC2E;color:#16140F;padding:64px 72px;display:flex;flex-direction:column;position:relative;overflow:hidden}
.wm{font:400 64px W;letter-spacing:-.02em;line-height:1}
.logos{position:absolute;top:56px;right:72px;display:flex}
.logos .t{width:150px;height:150px;border-radius:34px;box-shadow:0 18px 40px -12px rgba(22,20,15,.35);display:flex;align-items:center;justify-content:center;font:400 60px H;overflow:hidden;background:#fff}
.logos .t+.t{margin-left:-26px;outline:8px solid #FFCC2E}
.logos.n4 .t{width:112px;height:112px;border-radius:26px}
.logos .t img{width:100%;height:100%;display:block}
h1{font:400 var(--fs,92px)/1.02 H;letter-spacing:-.03em;margin-top:auto;max-width:1056px}
.sub{font:400 32px/1.25 B;margin-top:26px;color:rgba(22,20,15,.82);max-width:1056px}
.foot{font:400 24px B;margin-top:22px;color:rgba(22,20,15,.6)}
`;
const html = (c) => {
  const tiles = c.logos.map((l) => l.logo ? `<span class="t"><img src="${data(join(WEB, 'public/logos', l.id + '.png'), 'image/png')}"></span>` : `<span class="t" style="background:${l.color};color:#fff">${esc(l.mono)}</span>`).join('');
  const len = c.title.length;
  const fs = len > 34 ? 70 : len > 26 ? 80 : 92;
  return `<!doctype html><meta charset=utf-8><style>${css}</style><body><div class="wm">ditch</div>${tiles ? `<div class="logos n${c.logos.length}">${tiles}</div>` : ''}<h1 style="--fs:${fs}px">${esc(c.title)}</h1><p class="sub">${esc(c.sub)}</p><p class="foot">${esc(c.foot ? c.foot + ' · ditchsubs.app' : 'ditchsubs.app')}</p></body>`;
};

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of cards) {
  const out = join(WEB, 'public/og', c.file + '.jpg');
  mkdirSync(dirname(out), { recursive: true });
  await p.setContent(html(c), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out, type: 'jpeg', quality: 88 });
}
await b.close();
// The site only points at images that exist (a test checks every comparison, price page and guide has one).
writeFileSync(join(WEB, 'src/data/og.json'), JSON.stringify(cards.map((c) => c.file).sort(), null, 1) + '\n');
console.log('drew', cards.length, 'share images');
