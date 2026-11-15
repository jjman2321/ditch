// Tells Bing (and through it ChatGPT search and Copilot), Yandex, Naver, Seznam and Yep about changed pages (IndexNow).
// Google doesn't use IndexNow; it reads the sitemap. The key is public by design: it only proves we own the site.
// Usage after a deploy: node scripts/indexnow.mjs            → every URL in the live sitemap
//                       node scripts/indexnow.mjs /a /b       → only these paths (changed pages)
const KEY = '284e5a6f3e887450ca4dce4fb36ea06d';
const HOST = 'ditchsubs.app';
const paths = process.argv.slice(2);
let urls;
if (paths.length) urls = paths.map((p) => `https://${HOST}${p}`);
else {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log('IndexNow', res.status, res.statusText, urls.length, 'URLs');
