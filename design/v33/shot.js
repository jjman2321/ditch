// node design/v33/shot.js [name...]  -> renders each board HTML to a PNG next to it (deviceScaleFactor 2).
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const dir = __dirname;
  const want = process.argv.slice(2);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && (!want.length || want.some(w => f.includes(w))));
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (const f of files) {
    const p = await b.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
    await p.goto('file://' + path.join(dir, f));
    await p.waitForFunction(() => document.body.dataset.ready === '1');
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(500);
    const out = path.join(dir, f.replace('.html', '.png'));
    await p.screenshot({ path: out, fullPage: true });
    // overflow audit: text running outside its phone
    const issues = await p.evaluate(() => {
      const r = [];
      document.querySelectorAll('.phone').forEach((ph, i) => {
        const pb = ph.getBoundingClientRect();
        ph.querySelectorAll('*').forEach(el => {
          if (!el.childNodes.length || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return;
          if (el.closest('[data-allow]')) return;
          const b = el.getBoundingClientRect();
          if (b.width && (b.right > pb.right + 1 || b.left < pb.left - 1)) r.push(`phone ${i}: "${el.textContent.trim().slice(0, 30)}" outside x`);
          if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow === 'hidden') r.push(`phone ${i}: "${el.textContent.trim().slice(0, 30)}" clipped`);
        });
      });
      return r;
    });
    console.log(f, '->', path.basename(out), issues.length ? '\n  ' + issues.join('\n  ') : 'ok');
    await p.close();
  }
  await b.close();
})();
