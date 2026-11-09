// Render the Night variation: board.jpg + s1..s5.jpg
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 2221, height: 1060 }, deviceScaleFactor: 2 });
  await p.goto('file://' + __dirname + '/screens.html');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(2500);
  await p.screenshot({ path: __dirname + '/board.jpg', fullPage: true, type: 'jpeg', quality: 88 });
  const phones = await p.$$('.phone');
  for (let i = 0; i < phones.length; i++) {
    await phones[i].screenshot({ path: __dirname + '/s' + (i + 1) + '.jpg', type: 'jpeg', quality: 90 });
  }
  await b.close();
})();
