// Copies the app's data into the website, so both always show the same prices and guides.
// Sources (one level up, in the app): the catalog, the hand-checked prices, the cancel guides, the logos and fonts.
// Output: src/data/*.json, public/logos/*.png, src/fonts/*. Runs before dev and build.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(WEB, '..');
const out = (p) => join(WEB, p);
for (const d of ['src/data', 'public/logos']) mkdirSync(out(d), { recursive: true });

// Catalog: services.data.ts holds a JSON array after `SERVICE_ROWS: CatalogService[] = `.
const cat = readFileSync(join(APP, 'src/catalog/services.data.ts'), 'utf8');
const start = cat.indexOf('= [', cat.indexOf('SERVICE_ROWS')) + 2;
let depth = 0, end = start;
for (let i = start; i < cat.length; i++) {
  if (cat[i] === '[') depth++;
  else if (cat[i] === ']' && --depth === 0) { end = i + 1; break; }
}
const services = JSON.parse(cat.slice(start, end));

// Newest price and cancel-guide files (named *-YYYY-MM.json).
const latest = (prefix) => {
  const f = readdirSync(join(APP, 'docs/research')).filter((n) => n.startsWith(prefix) && n.endsWith('.json')).sort().pop();
  return JSON.parse(readFileSync(join(APP, 'docs/research', f), 'utf8'));
};
// Main 12-country file and the MENA file (website only for now) are merged.
const prices = latest('prices-20');
const mena = latest('prices-mena-');
prices.prices = [...prices.prices, ...mena.prices];
prices.about.countries = { ...prices.about.countries, ...(mena.about.countries ?? {}) };
// Cancel guides: every cancel-guides-*.json, oldest first; a later file's guide replaces the same id (e.g. the "-b" re-check).
const all = (prefix) => readdirSync(join(APP, 'docs/research')).filter((n) => n.startsWith(prefix) && n.endsWith('.json')).sort().map((f) => JSON.parse(readFileSync(join(APP, 'docs/research', f), 'utf8')));
const cancelFiles = all('cancel-guides-');
const cancel = cancelFiles[0];
for (const f of cancelFiles.slice(1)) {
  for (const g of f.services ?? []) {
    const i = cancel.services.findIndex((x) => x.id === g.id);
    if (i >= 0) cancel.services[i] = { ...cancel.services[i], ...g };
    else cancel.services.push(g);
  }
}
// Deeper, officially sourced sections (after cancelling, refunds, check it worked, pause, Google Play, FAQ), from every guide-depth-*.json.
const depthById = new Map();
for (const f of all('guide-depth-')) {
  const list = Array.isArray(f.guides) ? f.guides : Object.entries(f.guides ?? {}).map(([id, d]) => ({ id, ...d }));
  for (const d of list) depthById.set(d.id, d);
}
for (const g of cancel.services) {
  const d = depthById.get(g.id);
  if (d) g.depth = d;
}
// Price rises with sources (for /price-changes). Optional until the research lands.
const changeFiles = all('price-changes-');
const priceChanges = changeFiles.length ? changeFiles[changeFiles.length - 1] : { checkedOn: null, changes: [] };

const logos = [];
for (const s of services) {
  const src = join(APP, 'assets/logos', `${s.id}.png`);
  if (existsSync(src)) { copyFileSync(src, out(`public/logos/${s.id}.png`)); logos.push(s.id); }
}
// Fonts: small WOFF2 cuts live in src/fonts (made by scripts/fonts.py).
// duck.webp and app-icon.webp are small web copies made once from assets/brand.
// Small icons (icon.png 192, apple-icon.png 180, favicon.ico) are made once from assets/images/icon.png.

const w = (name, data) => writeFileSync(out(`src/data/${name}.json`), JSON.stringify(data, null, 1) + '\n');
w('services', services);
w('prices', prices);
w('cancel', cancel);
w('logos', logos);
w('price-changes', priceChanges);
// The build's date, for the stale/expired gates (pages are built ahead of time, so 'today' is the build day).
w('build', { today: new Date().toISOString().slice(0, 10) });
console.log(`synced ${services.length} services, ${prices.prices.length} price rows, ${cancel.services.length} cancel guides, ${logos.length} logos`);
