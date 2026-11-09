// Usage: node shot.js <html> <outprefix> [width]
// outprefix "board" also writes s1.jpg..s5.jpg (one per phone).
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const html = process.argv[2], out = process.argv[3] || 'board', w = +(process.argv[4] || 2260);
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: w, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.resolve(__dirname, html));
  await p.waitForTimeout(2500);
  await p.screenshot({ path: path.resolve(__dirname, out + '.jpg'), fullPage: true, type: 'jpeg', quality: 88 });
  if (out === 'board') {
    const phones = await p.$$('.phone');
    for (let i = 0; i < phones.length; i++) {
      await phones[i].screenshot({ path: path.resolve(__dirname, 's' + (i + 1) + '.jpg'), type: 'jpeg', quality: 90 });
    }
  }
  await b.close();
})();
