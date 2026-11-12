# ditchsubs.app

The Ditch website. Next.js 16 + Tailwind on Cloudflare Workers (OpenNext), the same setup as ankidecks.ai and peptidetracker.xyz.
Plan and research: `../docs/website/` (PLAN, BRIEF, design-system, templates, research-competitors).

## Run it
```bash
npm install
npm run dev        # copies the app's data in, then runs at localhost:3000
npm test           # copy rules, money maths, publishing gates
npm run build      # production build
npm run preview    # build + run on the Cloudflare runtime locally
npm run deploy     # build + deploy to Cloudflare
```

## Where things come from
- `scripts/sync-data.mjs` copies the app's catalog, hand-checked prices (`../docs/research/prices-*.json`), cancel guides and logos into `src/data` and `public/logos` before every dev/build. Change data in the app, never here.
- Publishing gates live in `src/lib/data.ts`: only verified prices, only high-confidence guides, a "may have changed" note after 90 days, hidden from search after 180.
- `src/lib/checks.test.ts` fails the build on banned phrases ("we cancel for you", "you save", "limited time"...).

## One-time setup (owner)
1. Cloudflare → Workers & Pages → connect this repo, root directory `web`, build command `npm run deploy` (or deploy from a Mac with `npm run deploy`).
2. Waitlist database: `npx wrangler d1 create ditchsubs`, paste the id into `wrangler.jsonc`, then `npx wrangler d1 migrations apply ditchsubs --remote`.
3. Secrets (never in chat or the repo): `npx wrangler secret put RESEND_API_KEY` and `npx wrangler secret put RESEND_AUDIENCE_ID`. Verify ditchsubs.app as a sending domain in Resend.
4. Cloudflare → ditchsubs.app → Security → Bots: turn **off** "Block AI bots" and the managed robots.txt, so ChatGPT, Claude and Perplexity can read the site.
5. Turn on Cloudflare Web Analytics (no cookies). Add the site to Google Search Console and Bing Webmaster Tools and submit `https://ditchsubs.app/sitemap.xml`.
