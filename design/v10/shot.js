// Render design/v8/screens.html.
// Usage: node shot.js            -> board.jpg, board-<section>.jpg, one jpg per phone (<data-name>.jpg)
//        node shot.js audit      -> also prints small text that fails 4.5:1 contrast
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const audit = process.argv[2] === 'audit';
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 2800, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.resolve(__dirname, 'screens.html'));
  await p.waitForTimeout(2800);
  const out = path.resolve(__dirname, 'renders');
  if (!fs.existsSync(out)) fs.mkdirSync(out);
  await p.screenshot({ path: path.resolve(__dirname, 'board.jpg'), fullPage: true, type: 'jpeg', quality: 86 });
  for (const sec of await p.$$('section[data-name]')) {
    const n = await sec.getAttribute('data-name');
    await sec.screenshot({ path: path.resolve(__dirname, 'board-' + n + '.jpg'), type: 'jpeg', quality: 88 });
  }
  for (const ph of await p.$$('.phone[data-name]')) {
    const n = await ph.getAttribute('data-name');
    await ph.screenshot({ path: path.resolve(out, n + '.jpg'), type: 'jpeg', quality: 90 });
  }
  if (audit) {
    const fails = await p.evaluate(() => {
      const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(',').map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
      const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
      const mix = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
      const bgOf = (el) => {
        const layers = [];
        for (let e = el; e; e = e.parentElement) {
          const c = parse(getComputedStyle(e).backgroundColor);
          if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
        }
        let col = { r: 255, g: 255, b: 255, a: 1 };
        for (let i = layers.length - 1; i >= 0; i--) col = mix(layers[i], col);
        return col;
      };
      const opac = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
      const res = [];
      document.querySelectorAll('.phone *').forEach((el) => {
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!own) return;
        const cs = getComputedStyle(el);
        const size = parseFloat(cs.fontSize), w = +cs.fontWeight;
        const large = size >= 24 || (size >= 18.66 && w >= 700);
        const bg = bgOf(el);
        let fg = parse(cs.color); fg = { ...fg, a: fg.a * opac(el) };
        const f = mix(fg, bg);
        const L1 = lum(f), L2 = lum(bg);
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const need = large ? 3 : 4.5;
        if (ratio < need && !el.closest('[data-noaudit]')) res.push(el.closest('.phone').dataset.name + ' | ' + ratio.toFixed(2) + ' < ' + need + ' | ' + size + 'px | ' + el.textContent.trim().slice(0, 50));
      });
      return res;
    });
    console.log(fails.length ? fails.join('\n') : 'contrast: all text passes');
  }
  await b.close();
})();
