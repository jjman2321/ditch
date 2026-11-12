# ditchsubs.app: site plan (English first)

Nov 12, 2026. From two research passes (design references on Mobbin and live sites; SEO, AEO and GEO) and the owner interview (`BRIEF.md`). Status: **plan, waiting for owner approval of mockups.**

## The idea in one line
Win Google and AI answers with **fewer, better pages built from data nobody else has**: hand-checked prices for 12 countries with an official source and a "checked on" date on every row, and cancel guides split by how you pay. Every page funnels to the App Store (or the waitlist before launch).

## Why we can win
- The long tail ("cancel X", "X price UK") is flooded with AI-made template sites (subtracker.io, recurdash, resubs, subger, joingerald, *.pages.dev). Most show no source, mix currencies, or contradict their own dates. Google's spam policy calls this "scaled content abuse". We do the opposite.
- Big publishers own "how to cancel Netflix" (Netflix help, Tom's Guide, TechRadar). We aim for the long tail, the countries they skip (**Ireland, New Zealand, Canada**), and AI citations: only ~38% of Google AI Overview citations come from the top 10 results (Ahrefs, Mar 2026), and AI tools prefer fresh, dated, sourced facts.
- Our data is fresher: Netflix Italy's Nov 5 price rise is in our file; ranking Italian pages still show old prices.
- App Store keywords can't use trademarks (Guideline 2.3.7), so "Netflix" can't go in our ASO keywords. The website is where we rank for service names.

## Brand name
Always **"Ditch: Subscription Tracker"** / "ditchsubs". "Ditch app" clashes with "Ditch: Pay Off Debt Faster" (iOS finance app) and Ditch Labs.

## Stack (owner: same as Ankidecks and PeptideTracker)
- **Next.js 16 (App Router) + TypeScript + Tailwind 4 on Cloudflare Workers via OpenNext** (`@opennextjs/cloudflare`), copied from `jjman2321/pepsi` (PeptideTracker), which already has the SEO pieces we need: `sitemap.ts`, `robots.txt` route, `llms.txt` and `llms-full.txt` routes, `manifest.ts`, `search.json`, methodology, corrections, editorial-policy and privacy pages, and a content registry with `draft: true`.
- Lives in `web/` in this repo, so the site reads the same data files as the app (`docs/research/prices-*.json`, `cancel-guides-*.json`, `src/catalog/services.data.ts`, `assets/logos/`). Price and guide pages are statically generated at build time (no database reads per visit), so they're fast and fully readable without JavaScript.
- Deploy: `npm run deploy` (OpenNext build + wrangler deploy), custom domain ditchsubs.app on the Worker.
- **Cloudflare trap:** new domains block AI crawlers by default ("Block AI bots" + managed robots.txt). Turn both off and serve our own robots.txt, or ChatGPT/Claude/Perplexity never see the site.
- Analytics: Cloudflare Web Analytics (no cookies) → **no cookie banner**. Google Search Console + Bing Webmaster Tools (Bing shows AI citations). IndexNow.
- Waitlist: Resend audience (owner pick), double opt-in, one email at launch + optional monthly "Price Hike Report" (separate tick). Also saved to D1 as a backup, like PeptideTracker.
- Tests: Vitest for the price maths and the publishing gates.

## Look (from the app, Sunflower)
Cream pages, sunflower for brand moments, ink text, tangerine accent, Archivo 900 display, Inter body, the duck in a few jobs only (hero welcome, waitlist success, 404/empty search, trial card), the DITCHED stamp, real logos. Nothing moves next to a price. No star ratings or user counts until they're real. Ink on sunflower (white on sunflower fails contrast).

References: **Givingli** (cream, huge tight headline, objects floating round it, one giant number block, numbered How it works, category grid), **Miro** (yellow on cream looks grown-up; dark footer card with a big SEO link column; help-centre layout), **Remote** (giant wordmark, dry one-liners between sections, two-column FAQ, stat strip), **Quartz** (article template: pill, big headline, summary, "Updated" line), **Spellbook** (ruled logo grid; newsletter as its own small brand), **Rocket Money** (QR code in the hero on desktop; footer "Compare" column), **Wise** (country price tables), **Grammarly** (privacy "short version" ticked list), **Fiasco** (human FAQ).

## Home page, top to bottom
1. Nav: "ditch" wordmark · Cancel guides · Prices · Pricing · Support · **Join the waitlist** (App Store badge after launch).
2. Hero on sunflower: "Ditch it before it renews." · "See everything you pay for. Get a reminder before every charge." · email field (later: badge + QR on desktop) · "Free forever for tracking. Reminders on 3." · an iPhone with the real lock-screen reminder · the duck · logos drifting at the edges (no prices on them).
3. Logo strip: "Pick from 200+ services, or add your own." (never "works with")
4. **"What do you pay for?" calculator:** tap logos, pick a country, see the real yearly total from our prices. "This runs in your browser. We don't see it."
5. How it works, 3 big steps: add what you pay → reminder 3 days and 1 day before, at 9:00 → ditch it.
6. Dry one-liner: "Nobody signs up for nine subscriptions. It just happens."
7. Reminders that go off, every time (the product).
8. The DITCHED stamp: "$X a year you won't pay".
9. Privacy: "Your list stays on your phone. No bank login. No account."
10. Free | Pro table (paywall wording and prices).
11. "There's a guide for that": category grid → cancel guides; recent price changes (still list).
12. FAQ, two columns: Is it free? Can Ditch cancel for me? (no, honestly) How does it know my subscriptions? (you add them) Do you sell my data? What if Pro ends? Which countries?
13. Final card: waitlist + Price Hike Report.
14. Footer: giant wordmark · Cancel guides (top 10) · Prices (top 10) · Compare · Ditch (Pricing, Support, Privacy, Terms, How we check, About) · country row · "© Grasp Labs LLC".

## Page types
| Page | URL | What makes it worth ranking |
|---|---|---|
| Cancel guide | /cancel/netflix | 40–60 word answer block at the top · official cancel button · steps · **tabs by how you pay: Apple / direct / partner** · "No cancel button? You're billed by a partner" · have ready: email, card last 4 · price table · source + checked date · honest app box ("Ditch can't cancel for you. It reminds you before it renews.") · related services |
| Price hub | /prices/netflix | Every plan × 12 countries, local currency, monthly and yearly (exact maths), VAT note, source and checked date per row, change log |
| Country price page | /prices/netflix/uk | Only where it passes the content bar (≥2 plans or a country-specific fact); otherwise an anchor on the hub |
| Index pages | /cancel, /prices | Search, category chips, popular row, A–Z, logo cards |
| Guides | /guides/… | Hand-written: find all your subscriptions, see and cancel on iPhone, what APPLE.COM/BILL means, cancel a free trial before it charges (with a checked table), price rises 2026 |
| Calculator | /calculator | Real local yearly total |
| Compare | /compare/… | Owner, Nov 12: tables show only where Ditch wins (checked with his lawyer). Every row must be true today, dated, and sourced to the rival's own App Store page or site. No rival logos. |
| Trust | /about, /how-we-check, /sources, /data | Aribo (no photo), method, studies, the data with a Dataset schema |
| Legal | /privacy, /terms, /support | App Review needs them. Privacy covers app + site + waitlist; "short version" first |

## Publishing gates (build fails a page that doesn't pass)
1. Only `verified` price rows; `partial` shows verified plans with a note; `unverified` never shows.
2. Every page has an official source and a checked date, visible and in the structured data.
3. Cancel guides: `confidence: high` only (31) until the owner checks the 18 "medium" ones on a phone.
4. Stale: checked 90+ days ago → visible "may have changed" banner; 180+ days → noindex until re-checked.
5. **Copy lint:** the build fails on "we cancel for you", "automatically finds/detects", "nothing leaves your phone", "saved", "all future features included".
6. Weekly link check on every official link.

## AI search (AEO/GEO)
- Answer block near the top of every page, dated and sourced. Real HTML tables. Static HTML.
- Schema: Organization + WebSite (home), MobileApplication (no ratings until real), Article with `citation` and `dateModified` = checked date, author = Aribo (Person), BreadcrumbList, Dataset on /data. No HowTo/FAQ rich results (Google dropped them: HowTo 2023, FAQ May 2026). No Product/Offer for other companies' prices.
- robots.txt allows search and AI bots (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot, Googlebot, Bingbot, Applebot), and training bots too (judgement: brand presence beats hiding public prices).
- llms.txt (cheap; evidence it helps is weak).
- A "what 6 popular subscriptions cost in 12 countries" data study for press, to earn links.

## Owner answers (Nov 12, round 3)
- Logos: small, unchanged logos + "not affiliated" line on every page; never in ads or share images.
- Upkeep: 1–2 hours a week, so ~200 pages at launch is OK.
- Launch list: waitlist (no App Store pre-order for now).

## Phases (English)
- **Phase 0, now (owner: go live now with waitlist + guides; overrides "after the app ships" in DECISIONS #9/#18):** home + waitlist, /privacy, /terms, /support, /about, /how-we-check, ~15 price hubs (Netflix, Spotify, Disney+, ChatGPT Plus, Apple One, iCloud+, Apple Music, Apple TV, Microsoft 365, Xbox Game Pass, PS Plus, Claude Pro, Google AI Pro, Amazon Prime, Dropbox), the 31 high-confidence cancel guides, 2 guides, robots/sitemap/llms.txt, favicons, OG images.
- **Phase 1, app launch:** App Store badge + campaign links (installs per page type in App Analytics), Smart App Banner, all 42 price hubs, country pages that pass the bar (~70–85), 8–12 guides, calculator, compare pages, press study. ~160–200 pages.
- **Phase 2:** price robot + /price-changes feed, top 100 services, then translations (Italian first, then German, French, Spanish).

## Upkeep (honest)
About 1–2 hours a week once ~200 pages are live (approve price changes, spot-check pages). A stale price page hurts more than a missing one.
