const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']});
const p=await b.newPage({viewport:{width:2400,height:1000},deviceScaleFactor:1});
await p.goto('file://'+__dirname+'/flow.html?board');await p.waitForTimeout(1500);
await p.screenshot({path:__dirname+'/board.png',fullPage:true});
for(let i=0;i<9;i++){const q=await b.newPage({viewport:{width:473,height:960},deviceScaleFactor:2});await q.goto('file://'+__dirname+'/flow.html?s='+i);await q.waitForTimeout(900);await q.screenshot({path:__dirname+`/s${i+1}.png`,clip:{x:30,y:30,width:413,height:872}});await q.close()}
await b.close()})();
