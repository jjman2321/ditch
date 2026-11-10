// Render design/v12/screens.html and audit every screen.
// node shot.js [filter]   -> renders/*.jpg, board-*.jpg, then the audit printed to the console
// Checks: text past the side edge, under the status bar / home indicator, clipped, truncated, overflowing;
// contrast (4.5:1, 3:1 large); orphan last words; INK collisions (real glyph bounds, so a comma tail that
// touches the next line is caught); vertical gaps between stacked blocks off the 4pt grid; tap targets < 44pt;
// the duck covering text. It also prints the rhythm (ink gaps) around the hero number.
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
  const noshots = process.argv.includes('--audit');
  if (!noshots) {
    for (const ph of await p.$$('.phone[data-name]:not([data-board])')) {
      const n = await ph.getAttribute('data-name');
      if (only && only !== '--audit' && !n.includes(only)) continue;
      await ph.screenshot({ path: path.resolve(out, n + '.jpg'), type: 'jpeg', quality: 90 });
    }
    if (!only) {
      for (const sec of await p.$$('section[data-name]')) {
        const n = await sec.getAttribute('data-name');
        await sec.screenshot({ path: path.resolve(__dirname, 'board-' + n + '.jpg'), type: 'jpeg', quality: 86 });
      }
    }
  }

  const report = await p.evaluate(() => {
    const res = [];
    const info = [];
    const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(',').map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
    const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    const mix = (a, b) => ({ r: a.r * a.a + b.r * (1 - a.a), g: a.g * a.a + b.g * (1 - a.a), b: a.b * a.a + b.b * (1 - a.a), a: 1 });
    const bgOf = (el) => {
      const layers = [];
      for (let e = el; e; e = e.parentElement) {
        const cs = getComputedStyle(e);
        const c = parse(cs.backgroundColor);
        if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
      }
      let col = { r: 255, g: 255, b: 255, a: 1 };
      for (let i = layers.length - 1; i >= 0; i--) col = mix(layers[i], col);
      return col;
    };
    const cv = document.createElement('canvas').getContext('2d');
    // glyph ink boxes, one per visual line, for an element's own text
    const inkLines = (el) => {
      const cs = getComputedStyle(el);
      cv.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      const tt = cs.textTransform;
      const words = [];
      el.childNodes.forEach((n) => {
        if (n.nodeType !== 3) return;
        const re = /\S+/g; let m;
        while ((m = re.exec(n.textContent))) {
          const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
          [...rg.getClientRects()].forEach((r) => { if (r.width > 0) words.push({ t: tt === 'uppercase' ? m[0].toUpperCase() : m[0], r }); });
        }
      });
      const lines = [];
      words.forEach((w) => {
        let L = lines.find((l) => Math.abs(l.top - w.r.top) < 2);
        if (!L) { L = { top: w.r.top, left: w.r.left, right: w.r.right, t: [] }; lines.push(L); }
        L.left = Math.min(L.left, w.r.left); L.right = Math.max(L.right, w.r.right); L.t.push(w.t);
      });
      return lines.map((L) => {
        const mt = cv.measureText(L.t.join(' '));
        const base = L.top + mt.fontBoundingBoxAscent;
        return { el, top: base - mt.actualBoundingBoxAscent, bot: base + mt.actualBoundingBoxDescent, left: L.left, right: L.right, text: L.t.join(' ') };
      });
    };
    const isHidden = (el) => !!(el.closest('.sb') || el.closest('[aria-hidden]'));
    const tapSel = 'button, .xbtn, .back, .chip, .seg span, .plan, .tickhit, .gchip, .dchip, .dgrid div, .lnk, .links u';

    document.querySelectorAll('.phone').forEach((ph) => {
      if (ph.dataset.board) return;
      const name = ph.dataset.name;
      const R = ph.getBoundingClientRect();
      const topLim = R.top + +ph.dataset.top;
      const botLim = R.bottom - +ph.dataset.bot;
      const hasScrim = !!ph.querySelector('.scrim');
      const overlays = [...ph.querySelectorAll('[data-overlay]')].map((o) => o.getBoundingClientRect());
      const ducks = [...ph.querySelectorAll('[data-duck]')].map((o) => o.getBoundingClientRect());
      const allInk = [];
      ph.querySelectorAll('*').forEach((el) => {
        if (isHidden(el)) return;
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!own) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        const cs = getComputedStyle(el);
        const t40 = el.textContent.trim().slice(0, 40);
        const covered = (hasScrim && !el.closest('.sheet')) || (el.closest('[data-scroll]') && overlays.some((o) => r.bottom > o.top + 1));
        if (r.left < R.left - .5 || r.right > R.right + .5) res.push(name + ' | OUTSIDE X | ' + t40);
        if (r.top < topLim - .5 && r.bottom > R.top) res.push(name + ' | UNDER STATUS BAR | ' + t40);
        if (r.bottom > botLim + .5 && r.top < R.bottom && !el.closest('[data-scroll]')) res.push(name + ' | UNDER HOME INDICATOR / CUT | ' + t40);
        if (el.scrollWidth > el.clientWidth + 1 && cs.overflow !== 'visible') res.push(name + ' | TRUNCATED | ' + t40);
        if (cs.display !== 'inline' && !el.hasAttribute('data-fit') && el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1) res.push(name + ' | OVERFLOWS ITS BOX | ' + t40);
        const scr = el.closest('.scr');
        if (scr && !el.closest('.sheet') && !el.closest('[data-bleed]')) {
          const sr = scr.getBoundingClientRect(), pl = parseFloat(getComputedStyle(scr).paddingLeft), pr = parseFloat(getComputedStyle(scr).paddingRight);
          if (r.right > sr.right - pr + 1.5 || r.left < sr.left + pl - 4.5) res.push(name + ' | PAST SIDE EDGE | ' + t40);
        }
        if (!el.closest('[data-scroll]')) for (let a = el.parentElement; a && a !== ph; a = a.parentElement) {
          const acs = getComputedStyle(a);
          if (acs.overflow === 'hidden' && !a.classList.contains('lt')) {
            const ar = a.getBoundingClientRect();
            if (r.bottom > ar.bottom + .5 || r.right > ar.right + .5) res.push(name + ' | CLIPPED | ' + t40);
            break;
          }
        }
        if (!covered) {
          const size = parseFloat(cs.fontSize), w = +cs.fontWeight;
          const large = size >= 24 || (size >= 18.66 && w >= 700);
          const bg = bgOf(el);
          let op = 1; for (let e = el; e && e !== ph; e = e.parentElement) op *= +getComputedStyle(e).opacity;
          const fc = parse(cs.color); fc.a *= op;
          const fg = mix(fc, bg);
          const ratio = (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);
          if (ratio < (large ? 3 : 4.5)) res.push(name + ' | CONTRAST ' + ratio.toFixed(2) + ' | ' + t40);
          inkLines(el).forEach((l) => allInk.push(l));
        }
      });
      // ink collisions between different text blocks
      for (let i = 0; i < allInk.length; i++) for (let j = i + 1; j < allInk.length; j++) {
        const a = allInk[i], c = allInk[j];
        if (a.el === c.el || a.el.contains(c.el) || c.el.contains(a.el)) continue;
        const hx = Math.min(a.right, c.right) - Math.max(a.left, c.left);
        if (hx <= 1) continue;
        const gap = Math.max(c.top - a.bot, a.top - c.bot);
        if (gap < 0) res.push(name + ' | INK COLLISION ' + gap.toFixed(1) + ' | ' + a.text.slice(0, 24) + ' ↔ ' + c.text.slice(0, 24));
        else if (gap < 3) res.push(name + ' | INK TIGHT ' + gap.toFixed(1) + ' | ' + a.text.slice(0, 24) + ' ↔ ' + c.text.slice(0, 24));
      }
      // pills (badges on a card edge) must not touch other text
      ph.querySelectorAll('.ribbon, .tag').forEach((pl) => { const pr = pl.getBoundingClientRect(); allInk.forEach((l) => { if (pl.contains(l.el)) return; if (l.right > pr.left - 2 && l.left < pr.right + 2 && l.bot > pr.top - 2 && l.top < pr.bottom + 2) res.push(name + ' | PILL TOUCHES TEXT | ' + pl.textContent.trim() + ' ↔ ' + l.text.slice(0, 24)); }); });
      // the duck must never sit on text (text inside the card it peeks over is drawn above it)
      ducks.forEach((dr) => allInk.forEach((l) => {
        if (l.el.closest('.note,.card,.cmp,[style*="z-index:2"]')) return;
        if (l.right > dr.left + 8 && l.left < dr.right - 8 && l.bot > dr.top + 4 && l.top < dr.bottom - 4) res.push(name + ' | DUCK OVER TEXT | ' + l.text.slice(0, 30));
      }));
      // rhythm around the hero number (ink to ink)
      const rh = [...ph.querySelectorAll('[data-rh]')];
      if (rh.length) {
        const box = (el) => { const ls = [el, ...el.querySelectorAll('*')].flatMap((e) => (e.closest('[data-rh]') === el ? inkLines(e) : [])); return { top: Math.min(...ls.map((l) => l.top)), bot: Math.max(...ls.map((l) => l.bot)) }; };
        const parts = [];
        for (let i = 1; i < rh.length; i++) { const a = box(rh[i - 1]), c = box(rh[i]); parts.push(rh[i - 1].dataset.rh + '→' + rh[i].dataset.rh + ' ' + (c.top - a.bot).toFixed(1)); }
        info.push('  rhythm ' + name + ': ' + parts.join(' · '));
      }
      // 4pt grid: gaps between stacked blocks in marked columns
      ph.querySelectorAll('[data-grid]').forEach((col) => {
        if (hasScrim && !col.closest('.sheet')) return;
        const kids = [...col.children].filter((k) => { const s = getComputedStyle(k); return s.position !== 'absolute' && s.display !== 'none' && k.getBoundingClientRect().height > 0; });
        for (let i = 1; i < kids.length; i++) {
          const g1 = +getComputedStyle(kids[i - 1]).flexGrow, g2 = +getComputedStyle(kids[i]).flexGrow;
          if (g1 > 0 || g2 > 0) continue;
          const gap = kids[i].getBoundingClientRect().top - kids[i - 1].getBoundingClientRect().bottom;
          if (Math.abs(gap / 4 - Math.round(gap / 4)) > .06) res.push(name + ' | OFF-GRID GAP ' + gap.toFixed(1) + ' | after ' + (kids[i - 1].textContent.trim().slice(0, 24) || kids[i - 1].className));
        }
        // box heights of text blocks on the grid too
        kids.forEach((k) => { const h = k.getBoundingClientRect().height; if (+getComputedStyle(k).flexGrow === 0 && !k.classList.contains('grab') && !k.classList.contains('band') && Math.abs(h / 4 - Math.round(h / 4)) > .06 && !k.hasAttribute('data-fit')) res.push(name + ' | OFF-GRID HEIGHT ' + h.toFixed(1) + ' | ' + (k.textContent.trim().slice(0, 24) || k.className)); });
      });
      // tap targets
      ph.querySelectorAll(tapSel).forEach((el) => {
        if (isHidden(el) || (hasScrim && !el.closest('.sheet'))) return;
        if (el.closest('[data-scroll]') && overlays.some((o) => el.getBoundingClientRect().top > o.top - 1)) return;
        const r = el.getBoundingClientRect();
        const s = +(el.dataset.slop || 0);
        const w = r.width + 2 * s, h = r.height + 2 * s;
        if (w < 43.5 || h < 43.5) res.push(name + ' | TAP TARGET ' + w.toFixed(0) + '×' + h.toFixed(0) + ' | ' + (el.textContent.trim().slice(0, 24) || el.className));
        if (r.bottom > botLim + .5 && !el.closest('[data-scroll]')) res.push(name + ' | CONTROL UNDER HOME INDICATOR | ' + el.textContent.trim().slice(0, 24));
      });
      // orphans
      ph.querySelectorAll('[data-orphan]').forEach((el) => {
        if (hasScrim && !el.closest('.sheet')) return;
        const words = [];
        const walk = (n) => { if (n.nodeType === 3) { const re = /\S+/g; let m; while ((m = re.exec(n.textContent))) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rr = rg.getClientRects(); if (rr.length) words.push({ t: m[0], top: rr[rr.length - 1].top, first: rr[0].top }); } } else n.childNodes.forEach(walk); };
        walk(el);
        if (words.length > 1) {
          const last = words[words.length - 1], prev = words[words.length - 2];
          if (Math.abs(last.first - prev.top) > 4 && !/ /.test(last.t)) res.push(name + ' | ORPHAN | ' + last.t);
        }
        const lines = new Set(words.map((w) => Math.round(w.top))).size;
        info.push('  ' + name + ' lines=' + lines + ' : ' + el.textContent.trim().slice(0, 40));
      });
      // free space left at the bottom of a no-scroll screen (the flexible spacer's height)
      const sp = [...ph.querySelectorAll('.scr > [style*="flex:1"], .scr [data-grid] > [style*="flex:1"]')].filter((e) => !e.hasAttribute('data-scroll') && !e.children.length && !e.textContent.trim());
      if (sp.length) info.push('  spare ' + name + ': ' + sp.map((e) => e.getBoundingClientRect().height.toFixed(0)).join(', '));
    });
    return res.concat(['--- info ---'], info);
  });
  console.log(report.join('\n'));
  await b.close();
})();
