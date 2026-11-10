// Screenshots of the v12 onboarding from the Expo web preview, at four
// sizes (iPhone 12 390×844, SE 375×667, Pro Max 430×932, iPad 834×1194),
// light and dark, plus a fit audit (anything past the screen, under the
// status bar or home indicator, or a page that scrolls when it shouldn't).
// Usage: npx expo start --web --port 8081   (in another terminal)
//        node scripts/shoot-v12.mjs [outDir] [--only=name,name] [--dev=i12,se] [--light]
// The preview loads the six v12 picks (?ob=v12) and pins the day to
// Tue, Nov 10 2026 so the shots line up with design/v12/renders.

import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require('playwright');
} catch {
  playwright = require('/opt/node22/lib/node_modules/playwright');
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const out = resolve(args.find((a) => !a.startsWith('--')) ?? join(root, 'design/build-v12'));
const opt = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split('=')[1]?.split(',');
const only = opt('only');
const devs = opt('dev');
const lightOnly = args.includes('--light');
const BASE = process.env.BASE ?? 'http://localhost:8081';
mkdirSync(out, { recursive: true });

const DEVICES = {
  i12: { width: 390, height: 844, top: 47, bot: 34 },
  se: { width: 375, height: 667, top: 20, bot: 0 },
  max: { width: 430, height: 932, top: 59, bot: 34 },
  ipad: { width: 834, height: 1194, top: 24, bot: 20 },
};

const click = (label) => async (page) => {
  await page.getByLabel(label, { exact: true }).first().click();
  await page.waitForTimeout(700);
};

/** name, query, path, steps, noScroll (must fit without scrolling) */
const SHOTS = [
  { name: '01-welcome', q: 'ob=v12', path: '/onboarding', noScroll: true },
  { name: '02-pick', q: 'ob=v12', path: '/onboarding/services' },
  { name: '02b-plan-sheet', q: 'ob=v12', path: '/onboarding/services', steps: [click('Change Netflix plan')] },
  { name: '03-total', q: 'ob=v12', path: '/onboarding/total', noScroll: true },
  {
    name: '04-dates',
    q: 'ob=v12dates',
    path: '/onboarding/dates',
    steps: [
      async (page) => {
        await page.getByRole('radiogroup', { name: 'When Netflix charges' }).getByLabel('Next week', { exact: true }).click();
        await page.waitForTimeout(250);
      },
    ],
  },
  {
    name: '04b-day-sheet',
    q: 'ob=v12dates',
    path: '/onboarding/dates',
    steps: [
      async (page) => {
        await page.getByRole('radiogroup', { name: 'When Netflix charges' }).getByLabel('Pick a day', { exact: true }).click();
        await page.waitForTimeout(700);
        await page.getByLabel('The 19th', { exact: true }).click();
        await page.waitForTimeout(300);
      },
    ],
  },
  { name: '05-reminders', q: 'ob=v12', path: '/onboarding/reminders', noScroll: true },
  { name: '06-paywall', q: 'ob=v12', path: '/paywall', noScroll: true },
  { name: '06b-paywall-lifetime', q: 'ob=v12', path: '/paywall', steps: [click('Lifetime, $49.99, pay once')], noScroll: true },
  { name: '06c-paywall-monthly', q: 'ob=v12', path: '/paywall', steps: [click('Monthly, $4.99 a month, no free trial')], noScroll: true },
  { name: '07-set', q: 'ob=v12', path: '/onboarding/done', noScroll: true },
  { name: '07b-which3-sheet', q: 'ob=v12', path: '/onboarding/done', steps: [click('Change which 3 get reminders')] },
  { name: '07c-almost-set', q: 'ob=v12&obnotif=later', path: '/onboarding/done', noScroll: true },
  { name: '07d-set-pro', q: 'ob=v12&obpro=yearly', path: '/onboarding/done', noScroll: true },
];

/**
 * Text that's cut off, past the 24pt side edges, under the status bar or the
 * home indicator, or a lone last word on a line. Text that's scrolled out of
 * view or covered by a pinned footer is skipped (it isn't on screen).
 */
async function audit(page, dev) {
  return page.evaluate(({ dev }) => {
    const issues = [];
    const W = window.innerWidth;
    const H = window.innerHeight;
    const scrollers = [...document.querySelectorAll('div')].filter((el) => {
      const cs = getComputedStyle(el);
      return (cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1 && el.clientHeight > 300;
    });
    const overflow = scrollers.map((el) => el.scrollHeight - el.clientHeight);
    /** The part of a rect that its clipping ancestors let through. */
    const visible = (el, r) => {
      let { left, right, top, bottom } = r;
      for (let a = el.parentElement; a; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
          const c = a.getBoundingClientRect();
          left = Math.max(left, c.left); right = Math.min(right, c.right); top = Math.max(top, c.top); bottom = Math.min(bottom, c.bottom);
        }
      }
      return right - left > 1 && bottom - top > 1 ? { left, right, top, bottom } : null;
    };
    const covered = (el, r) => {
      const x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2;
      if (x < 0 || y < 0 || x > W || y > H) return true;
      const hit = document.elementFromPoint(x, y);
      return hit && hit !== el && !el.contains(hit) && !hit.contains(el);
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent.trim();
      if (!text) continue;
      const el = node.parentElement;
      if (!el || seen.has(el)) continue;
      seen.add(el);
      let hidden = false;
      for (let a = el; a; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.opacity === '0' || cs.visibility === 'hidden' || cs.display === 'none') hidden = true;
      }
      if (hidden) continue;
      const big = parseFloat(getComputedStyle(el).fontSize) >= 60;
      // Chips in a sideways scroller run off the edge on purpose.
      let sideways = false;
      for (let a = el.parentElement; a; a = a.parentElement) if (['auto', 'scroll'].includes(getComputedStyle(a).overflowX) && a.scrollWidth > a.clientWidth + 1) sideways = true;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const raw of range.getClientRects()) {
        const r = visible(el, raw);
        if (!r || covered(el, r)) continue;
        // The hero number sits 4pt into the edge on purpose (optical alignment).
        if (r.left < 23.5 && W < 600 && !(big && r.left > 18)) issues.push(`edge-left ${Math.round(r.left)}: ${text.slice(0, 30)}`);
        if (r.right > W - 23.5 && W < 600 && !sideways) issues.push(`edge-right ${Math.round(W - r.right)}: ${text.slice(0, 30)}`);
        if (r.top < dev.top - 1) issues.push(`under status bar: ${text.slice(0, 30)}`);
        if (dev.bot && r.bottom > H - dev.bot + 1) issues.push(`under home indicator: ${text.slice(0, 30)}`);
      }
      const cs = getComputedStyle(el);
      if (el.scrollWidth > el.clientWidth + 1 && (cs.overflow === 'hidden' || cs.textOverflow === 'ellipsis')) issues.push(`clipped: ${text.slice(0, 30)}`);
      // A lone last word: group each word by its line.
      const words = [...node.textContent.matchAll(/\S+/g)];
      if (words.length > 2) {
        const tops = words.map((m) => {
          const wr = document.createRange();
          wr.setStart(node, m.index);
          wr.setEnd(node, m.index + m[0].length);
          return Math.round(wr.getBoundingClientRect().top);
        });
        const lines = [...new Set(tops)];
        if (lines.length > 1 && tops.filter((t) => t === lines[lines.length - 1]).length === 1 && !node.textContent.includes('\n')) issues.push(`lone last word: …${words[words.length - 1][0]}`);
      }
    }
    return { issues: [...new Set(issues)], overflow };
  }, { dev });
}

const browser = await playwright.chromium.launch();
const report = [];
for (const [devName, dev] of Object.entries(DEVICES)) {
  if (devs && !devs.includes(devName)) continue;
  for (const dark of lightOnly ? [false] : [false, true]) {
    for (const s of SHOTS) {
      if (only && !only.includes(s.name)) continue;
      const ctx = await browser.newContext({ viewport: { width: dev.width, height: dev.height }, deviceScaleFactor: 2, colorScheme: dark ? 'dark' : 'light' });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/?phone=${devName}&today=2026-11-10&${s.q}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(900);
      await page.evaluate((p) => window.__ditchNavigate?.(p), s.path);
      await page.waitForTimeout(1500);
      for (const step of s.steps ?? []) await step(page);
      const file = `${dev === DEVICES.i12 ? '' : `${devName}-`}${dark ? 'd' : ''}${s.name}.png`;
      await page.screenshot({ path: join(out, file) });
      const a = await audit(page, dev);
      const scrolls = s.noScroll && a.overflow.some((o) => o > 0);
      const line = `${file}: ${a.issues.length ? a.issues.join(' | ') : 'ok'}${scrolls ? ` | SCROLLS by ${Math.max(...a.overflow)}pt` : ''}`;
      report.push(line);
      console.log(line);
      await ctx.close();
    }
  }
}
await browser.close();
writeFileSync(join(out, 'audit.txt'), report.join('\n') + '\n');
