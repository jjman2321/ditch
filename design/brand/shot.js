const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1840, height: 1000 }, deviceScaleFactor: 1 });
  await p.goto('file://' + __dirname + '/brand.html');
  await p.waitForTimeout(2000);
  const dirs = await p.$$('.dir');
  for (let i = 0; i < dirs.length; i++) await dirs[i].screenshot({ path: __dirname + `/dir-${'ABC'[i]}.png` });
  await b.close();
})();
