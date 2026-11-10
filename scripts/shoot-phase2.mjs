// Screenshots of the Phase 2 screens from the Expo web preview, at an
// iPhone 15's 393×852 (and an SE's 375×667 for 10-se).
// Usage: npx expo start --web --port 8081   (in another terminal)
//        node scripts/shoot-phase2.mjs [outDir] [only-these-names...]
// The preview uses example data (?seed=…) and pins the day to Mon, Nov 9 2026
// so the shots line up with design/v10/renders.

import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require('playwright');
} catch {
  playwright = require('/opt/node22/lib/node_modules/playwright');
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.argv[2] ?? join(root, 'design/build-phase2'));
const only = process.argv.slice(3);
const BASE = process.env.BASE ?? 'http://localhost:8081';
mkdirSync(out, { recursive: true });

const q = (seed, extra = '') => `/?phone&today=2026-11-09&seed=${seed}${extra}`;

/** name, url, steps (run in the page), dark, size */
const SHOTS = [
  { name: '09-home', url: q('demo') },
  { name: '09-home-hold', url: q('demo'), hold: 'Netflix' },
  { name: '09b-home-pro', url: q('pro') },
  { name: '09c-home-off', url: q('off', '&notif=denied') },
  { name: '11-empty', url: q('empty') },
  { name: '12-calendar', url: q('demo'), tab: 'Calendar' },
  { name: '13-ditched-tab', url: q('ditched'), tab: 'Ditched' },
  { name: '13c-ditched-chart', url: q('ditched'), tab: 'Ditched', scroll: 900 },
  { name: '13d-howto', url: q('ditched'), tab: 'Ditched', clicks: ['^How to cancel'] },
  { name: 'd13d-howto', url: q('ditched'), tab: 'Ditched', clicks: ['^How to cancel'], dark: true },
  { name: '13b-ditched-empty', url: q('empty'), tab: 'Ditched' },
  { name: '10-ditched', url: q('demo'), ditch: 'netflix' },
  { name: '10-se', url: q('demo'), ditch: 'netflix', size: { width: 375, height: 667 }, phone: 'se' },
  { name: '10b-ditched-trial', url: q('pro'), ditch: 'trial' },
  { name: '14-settings', url: q('demo'), path: '/settings' },
  { name: '14b-settings-off', url: q('demo', '&notif=denied'), path: '/settings' },
  { name: '14c-settings-pro', url: q('pro'), path: '/settings' },
  { name: '15-add', url: q('demo'), add: true },
  { name: '15b-edit', url: q('demo'), edit: 'ChatGPT' },
  { name: '15c-add-trial', url: q('demo'), add: true, clicks: ['^Track a free trial'] },
  { name: '15d-add-trial-filled', url: q('demo'), add: true, clicks: ['^Track a free trial'], type: 'Paramount', clicksAfter: ['^Paramount'] },
  { name: 'd09-home-hold', url: q('demo'), hold: 'Netflix', dark: true },
  { name: 'd09c-home-off', url: q('off', '&notif=denied'), dark: true },
  { name: 'd10-ditched', url: q('demo'), ditch: 'netflix', dark: true },
  { name: 'd12-calendar', url: q('demo'), tab: 'Calendar', dark: true },
  { name: 'd13-ditched-tab', url: q('ditched'), tab: 'Ditched', dark: true },
  { name: 'd14-settings', url: q('demo'), path: '/settings', dark: true },
];

const browser = await playwright.chromium.launch();
for (const s of SHOTS) {
  if (only.length && !only.includes(s.name)) continue;
  const size = s.size ?? { width: 393, height: 852 };
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 2, colorScheme: s.dark ? 'dark' : 'light', reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const url = s.phone === 'se' ? s.url.replace('?phone', '?phone=se') : s.url;
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  if (s.tab) {
    await page.getByRole('tab', { name: s.tab }).first().click().catch(async () => page.getByText(s.tab, { exact: true }).last().click());
    await page.waitForTimeout(900);
  }
  if (s.path) {
    await page.evaluate((p) => window.__ditchNavigate?.(p), s.path);
    await page.waitForTimeout(1200);
  }
  if (s.ditch) {
    await page.evaluate((id) => window.__ditchNavigate?.(`/ditch/${id}?preview=1`), s.ditch);
    await page.waitForTimeout(1800);
  }
  if (s.add) {
    await page.getByRole('button', { name: 'Add a subscription' }).first().click();
    await page.waitForTimeout(900);
  }
  for (const c of s.clicks ?? []) {
    await page.getByLabel(new RegExp(c)).first().click();
    await page.waitForTimeout(900);
  }
  if (s.type) {
    await page.keyboard.type(s.type);
    await page.waitForTimeout(700);
  }
  for (const c of s.clicksAfter ?? []) {
    await page.getByLabel(new RegExp(c)).first().click();
    await page.waitForTimeout(900);
  }
  if (s.edit) {
    await page.getByLabel(new RegExp(`^${s.edit},`)).first().click();
    await page.waitForTimeout(900);
  }
  if (s.scroll) {
    await page.mouse.move(200, 400);
    await page.mouse.wheel(0, s.scroll);
    await page.waitForTimeout(700);
  }
  if (s.hold) {
    const row = page.getByLabel(new RegExp(`^${s.hold},`)).first();
    const box = await row.boundingBox();
    await page.mouse.move(box.x + 40, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(650);
    await page.screenshot({ path: join(out, `${s.name}.png`) });
    await page.mouse.move(box.x + 40, box.y + box.height / 2 + 80);
    await page.mouse.up();
  } else {
    await page.screenshot({ path: join(out, `${s.name}.png`) });
  }
  console.log('shot', s.name);
  await ctx.close();
}
await browser.close();
