// Render design/v11/screens.html.
// node shot.js        -> renders/*.jpg, board-*.jpg, plus a fit + contrast audit printed to the console
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 2800, height: 1200 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.resolve(__dirname, 'screens.html'));
  await p.waitForFunction(() => document.body.dataset.ready === '1');
  await p.waitForTimeout(1200);
  const out = path.resolve(__dirname, 'renders');
  if (!fs.existsSync(out)) fs.mkdirSync(out);
  const only = process.argv[2];
  for (const ph of await p.$$('.phone[data-name]')) {
    const n = await ph.getAttribute('data-name');
    if (only && !n.includes(only)) continue;
    await ph.screenshot({ path: path.resolve(out, n + '.jpg'), type: 'jpeg', quality: 90 });
  }
  if (!only) {
    for (const sec of await p.$$('section[data-name]')) {
      const n = await sec.getAttribute('data-name');
      await sec.screenshot({ path: path.resolve(__dirname, 'board-' + n + '.jpg'), type: 'jpeg', quality: 86 });
    }
  }

  const report = await p.evaluate(() => {
    const res = [];
    const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(',').map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
    const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    const mix = (a, b) => ({ r: a.r * a.a + b.r * (1 - a.a), g: a.g * a.a + b.g * (1 - a.a), b: a.b * a.a + b.b * (1 - a.a), a: 1 });
    const bgOf = (el) => {
      const layers = [];
      for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; } }
      let col = { r: 255, g: 255, b: 255, a: 1 };
      for (let i = layers.length - 1; i >= 0; i--) col = mix(layers[i], col);
      return col;
    };
    document.querySelectorAll('.phone').forEach((ph) => {
      const name = ph.dataset.name;
      const R = ph.getBoundingClientRect();
      const top = R.top + +ph.dataset.top;
      const bot = R.bottom - +ph.dataset.bot;
      ph.querySelectorAll('*').forEach((el) => {
        if (el.closest('.sb') || el.closest('[aria-hidden]')) return;
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!own) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        const cs = getComputedStyle(el);
        // is this element inside the scaled backdrop of a sheet? skip geometry checks there
        const inBackdrop = !!el.closest('[style*="scale(.92)"]');
        if (!inBackdrop) {
          if (r.left < R.left - .5 || r.right > R.right + .5) res.push(name + ' | OUTSIDE X | ' + el.textContent.trim().slice(0, 40));
          if (r.top < top - .5 && r.bottom > R.top) res.push(name + ' | UNDER STATUS BAR | ' + el.textContent.trim().slice(0, 40));
          if (r.bottom > bot + .5 && r.top < R.bottom) res.push(name + ' | UNDER HOME INDICATOR / CUT | ' + el.textContent.trim().slice(0, 40));
          if (el.scrollWidth > el.clientWidth + 1 && cs.overflow !== 'visible') res.push(name + ' | TRUNCATED | ' + el.textContent.trim().slice(0, 40));
          // clipped by an overflow:hidden ancestor
          for (let a = el.parentElement; a && a !== ph; a = a.parentElement) {
            const acs = getComputedStyle(a);
            if (acs.overflow === 'hidden' && !a.classList.contains('lt')) {
              const ar = a.getBoundingClientRect();
              if (r.bottom > ar.bottom + .5 || r.right > ar.right + .5) { res.push(name + ' | CLIPPED | ' + el.textContent.trim().slice(0, 40)); }
              break;
            }
          }
        }
        // contrast
        const size = parseFloat(cs.fontSize), w = +cs.fontWeight;
        const large = size >= 24 || (size >= 18.66 && w >= 700);
        const bg = bgOf(el);
        const fg = mix(parse(cs.color), bg);
        const L1 = lum(fg), L2 = lum(bg);
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        if (!inBackdrop && ratio < (large ? 3 : 4.5)) res.push(name + ' | CONTRAST ' + ratio.toFixed(2) + ' | ' + el.textContent.trim().slice(0, 40));
      });
      // orphans: last word alone on its line
      ph.querySelectorAll('[data-orphan]').forEach((el) => {
        const words = [];
        const walk = (n) => { if (n.nodeType === 3) { const re = /\S+/g; let m; while ((m = re.exec(n.textContent))) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rr = rg.getClientRects(); if (rr.length) words.push({ t: m[0], top: rr[rr.length - 1].top, first: rr[0].top }); } } else n.childNodes.forEach(walk); };
        walk(el);
        if (words.length > 1) {
          const last = words[words.length - 1], prev = words[words.length - 2];
          // a word joined by a no-break space is one "word" here, so a lone last token is an orphan
          if (Math.abs(last.first - prev.top) > 4 && !/ /.test(last.t)) res.push(name + ' | ORPHAN | ' + last.t);
        }
        const lines = new Set(words.map((w) => Math.round(w.top))).size;
        res.push('  ' + name + ' lines=' + lines + ' : ' + el.textContent.trim().slice(0, 36));
      });
    });
    return res;
  });
  console.log(report.join('\n'));
  await b.close();
})();
