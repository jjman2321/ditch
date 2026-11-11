// The main app screens on every iPhone and iPad shape (scripts/lib/fit.mjs),
// with the same fit check as shoot-v12: text cut off, past the edges, under
// the status bar or home indicator, and how wide the content runs on big screens.
// Usage: npx expo start --web --port 8081   (in another terminal)
//        node scripts/shoot-devices.mjs [outDir] [--dev=all|name,name] [--only=name,name] [--dark]

import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DEVICES, audit } from './lib/fit.mjs';

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require('playwright');
} catch {
  playwright = require('/opt/node22/lib/node_modules/playwright');
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split('=')[1]?.split(',');
const out = resolve(args.find((a) => !a.startsWith('--')) ?? join(root, 'design/build-devices'));
const devs = opt('dev') ?? ['all'];
const only = opt('only');
const dark = args.includes('--dark');
const BASE = process.env.BASE ?? 'http://localhost:8081';
mkdirSync(out, { recursive: true });

const tap = (label) => async (page) => {
  await page.getByLabel(new RegExp(label)).first().click();
  await page.waitForTimeout(900);
};
const tab = (name) => async (page) => {
  await page.getByRole('tab', { name }).first().click().catch(() => page.getByText(name, { exact: true }).last().click());
  await page.waitForTimeout(900);
};
const go = (path) => async (page) => {
  await page.evaluate((p) => window.__ditchNavigate?.(p), path);
  await page.waitForTimeout(1500);
};

const SHOTS = [
  { name: 'home', seed: 'demo' },
  { name: 'home-empty', seed: 'empty' },
  { name: 'add', seed: 'demo', steps: [tap('^Add a subscription$')] },
  { name: 'edit', seed: 'demo', steps: [tap('^Netflix,')] },
  { name: 'forgotten', seed: 'demo', steps: [tap('^Add a subscription$'), tap('^Missing any')] },
  { name: 'ditched-screen', seed: 'demo', steps: [go('/ditch/netflix?preview=1')] },
  { name: 'ditched-tab', seed: 'ditched', steps: [tab('Ditched')] },
  { name: 'calendar', seed: 'demo', steps: [tab('Calendar')] },
  { name: 'settings', seed: 'demo', steps: [go('/settings')] },
  { name: 'settings-pro', seed: 'pro', steps: [go('/settings')] },
];

const browser = await playwright.chromium.launch();
const report = [];
for (const [devName, dev] of Object.entries(DEVICES)) {
  if (!devs.includes('all') && !devs.includes(devName)) continue;
  for (const s of SHOTS) {
    if (only && !only.includes(s.name)) continue;
    const ctx = await browser.newContext({ viewport: { width: dev.width, height: dev.height }, deviceScaleFactor: 1, colorScheme: dark ? 'dark' : 'light' });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?phone=${devName}&today=2026-11-09&seed=${s.seed}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    let failed = null;
    try {
      for (const step of s.steps ?? []) await step(page);
    } catch (e) {
      failed = String(e.message ?? e).split('\n')[0];
    }
    const file = `${devName}-${dark ? 'd-' : ''}${s.name}.jpg`;
    await page.screenshot({ path: join(out, file), type: 'jpeg', quality: 80 });
    const a = await audit(page, dev);
    // How wide the widest text block runs: on big screens a line over ~680pt is hard to read.
    const widest = await page.evaluate(() => Math.max(0, ...[...document.querySelectorAll('div')].filter((d) => d.innerText && d.children.length === 0).map((d) => d.getBoundingClientRect().width)));
    const wide = dev.width >= 600 && widest > 680 ? ` | WIDE text ${Math.round(widest)}pt` : '';
    const line = `${file}: ${failed ? `STEP FAILED (${failed}) | ` : ''}${a.issues.length ? a.issues.join(' | ') : 'ok'}${wide}`;
    report.push(line);
    console.log(line);
    await ctx.close();
  }
}
await browser.close();
writeFileSync(join(out, 'audit.txt'), report.join('\n') + '\n');
