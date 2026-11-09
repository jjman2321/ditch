const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage();
  await p.setContent('<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet"><p style="font-family:Archivo">x</p>');
  await p.waitForTimeout(2500);
  console.log(await p.evaluate(()=>document.fonts.check('800 20px Archivo')+' '+document.fonts.check('500 12px "IBM Plex Mono"')+' '+[...document.fonts].map(f=>f.family+f.status).slice(0,5).join(',')));
  await b.close();
})();
