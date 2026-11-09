const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1880, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto('file://' + __dirname + '/ditch.html');
  await p.waitForTimeout(2200);
  await p.screenshot({ path: __dirname + '/board.png', fullPage: true });
  const phones = await p.$$('.phone');
  for (let i = 0; i < phones.length; i++) await phones[i].screenshot({ path: __dirname + `/s${i + 1}.png` });
  await b.close();
})();
