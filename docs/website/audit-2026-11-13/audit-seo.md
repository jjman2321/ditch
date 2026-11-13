# ditchsubs.app: SEO, AI search and content audit (Nov 13, 2026)

Read-only audit. Scope: SEO, AI search (ChatGPT, Perplexity, Google AI Overviews) and content strategy for guides, price pages and a future blog.

**How it was checked**
- The server that should have been on :3100 wasn't running. I served the existing production build (`.next`, built Nov 13 00:13) with `next start -p 3199`. I didn't rebuild anything or change any project file.
- All 81 sitemap URLs were crawled with Playwright with JavaScript off, so the numbers below are what a crawler sees without running scripts.
- I measured how much text the pages share using 5-word chunks (shingles).
- I read the code for the worker, sitemap, robots, llms.txt and the page templates.
- I compared our pages with live pages from RecurDash (Netflix guide, Netflix price page, "best trackers" post), PopSci and the current Google results for the three target queries.
- Ahrefs and Similarweb need sign-in in this session, so there are **no measured search volumes**. Demand below is ranked by how the search results look, not by numbers.

## Score: 6.5 / 10

| Area | Score | One line |
|---|---|---|
| Technical (crawl, index, canonicals, schema validity) | 8.5 | Clean: every page returns 200, one H1 each, no skipped headings, canonicals right, all 81 JSON-LD blocks parse, no broken internal links, no orphans. |
| On-page (titles, descriptions, headings) | 7 | Good lengths, no duplicates. Price titles waste the click and the homepage H1 has no keyword. |
| Content depth vs what ranks | 4.5 | Guides average 430 words. They skip what happens after cancelling, refunds and Android. Competitors have FAQs and screenshots. |
| Coverage of high-demand queries | 4 | No Amazon Prime or ChatGPT cancel guide. No Hulu, Peacock or YouTube Premium price page. None of the planned iPhone guides exist yet. |
| AI-search readiness | 7.5 | Short answer at the top, with date and source. Real HTML tables, server-rendered, AI bots allowed. Few question headings and missing "after you cancel" facts. |
| Authority / trust signals | 4 | Not live or indexed yet. Author is first name only. No sameAs. The brand name collides with other "Ditch" products. |

---

## 1. Crawl results (81 sitemap URLs)

| Check | Result |
|---|---|
| Status | 81/81 return 200. Trailing slash gets a 308 to the address without it. |
| Title length | Cancel guides 54–72 (72 = nintendo-online, cut off in results). Price pages 44–61. Home 66. Legal pages 17–19. |
| Meta description | 90–162 characters. Shortest: crunchyroll 92, headspace 90, max 100, nyt 104. All unique. |
| Canonical | Present and self-referencing on all 81 (home = `https://ditchsubs.app`). |
| H1 | Exactly one on every page. No skipped heading levels anywhere. |
| JSON-LD | Home: Organization + WebSite + MobileApplication + FAQPage. Guides and price pages: Article + BreadcrumbList. Indexes: CollectionPage/ItemList. About: AboutPage. Support: FAQPage. **None on /how-we-check, /privacy, /terms.** All 81 parse. |
| Words (article only) | Guides 312–494 (avg ~410). Price pages 507–1,851. Home 775. About 147. |
| Unique text | Guides: on average **28%** of 5-word chunks appear on no other guide. Lowest: apple-tv **9%**, apple-music 13%, apple-arcade 14%, youtube-music 17%. Price pages: 36% average. |
| Images | Every `<img>` has an alt (decorative ones use `alt=""`). |
| OG | og:title, og:description and og:image on every page. **og:url missing** on home, indexes, about, support, how-we-check, privacy and terms. One shared OG image per page type (cancel.png, prices.png, home.png). |
| Internal links in (whole page) | Lowest: /cancel/siriusxm 2, /prices/nyt 2, notion 2, discord-nitro 2, babbel 2, masterclass 2, economist 2, /cancel/linkedin-premium 3, snapchat-plus 3, strava 3. |
| Home main-content links | **0 links to any guide or price page** inside `<main>`. Only `#join`, `/cancel` and mailto. The only links to them are the 8 + 8 footer links. |
| hreflang | None. `lang="en"`, og:locale en_US. Correct for an English-only site. |
| Duplicates | No duplicate titles, descriptions or H1s. |

### Cannibalisation
- **Guide vs price page for the same service:** 13–30% shared text, almost all from the US price table on the guide. The titles go after different intents ("How to cancel Netflix in 2026" vs "Netflix price 2026"). **No action now.**
- **Future risks to plan for:**
  - Country price pages vs the hub. Only build a country page with unique content: price history, bundles, VAT detail.
  - `/cancel/prime-video` vs a future `/cancel/amazon-prime`. Make it one page, or two pages that clearly link to each other.
  - Blog posts about price rises vs the price pages. The price page owns "X price"; the report owns "X price increase [month]" and links to the price page.

## 2. robots, sitemap, llms.txt, 404s, worker

- **robots.txt:** `Allow: /`, `Disallow: /api/`, plus the Content-Signal line and the sitemap. Good. Search engines ignore the Content-Signal line; only Lighthouse complains about it.
  - The real risk is Cloudflare's "Block AI bots" and managed robots.txt on the zone (go-live item, owner). I couldn't check the live domain from here: it returned 503 or reset the connection.
- **sitemap.xml:** 81 URLs. For guides and price pages, lastmod is the real checked date (Nov 9–12). Two problems:
  - Home, /cancel, /prices and the legal pages use a hard-coded `SITE_UPDATED = '2026-11-12'` (`web/src/app/sitemap.ts:6`). That date will become false.
  - **Price pages are never filtered for staleness** (only guides are).
  - `priority` is ignored by Google. Harmless.
- **The freshness rule doesn't exist on price pages.** `web/src/app/prices/[slug]/page.tsx` never imports `freshness`. There's no "may have changed" banner at 90 days and no noindex at 180 days. PLAN gate 5 is only built for guides.
  - Both gates use `BUILD_DAY` from `src/data/build.json`, which is set at build time. Static pages only go stale when the site is rebuilt. Without a scheduled rebuild, **neither gate ever fires**.
- **llms.txt:** accurate and honest ("not on the App Store yet", "cannot cancel for you"). It lists all 31 guides and 42 price pages, with counts and the last check date.
  - Missing: a one-line answer per link (the llms.txt format allows `- [name](url): note`).
  - `/llms-full.txt` returns 404, even though PLAN lists it.
- **404s:** `/nope` returns a real 404 with noindex. Unknown slugs (`/cancel/nope`, `/prices/nope`, and real-but-unpublished ones like `/cancel/chatgpt-plus` and `/prices/hulu`) return **200 + `<meta name="robots" content="noindex">`** under plain Next.
  - In production, `custom-worker.ts` turns any page address that isn't in the sitemap into a 404 with x-robots noindex. The logic is sound:
    - It looks paths up against the sitemap's `<loc>` list.
    - If it can't read the sitemap, it lets everything through (fails open).
    - `/waitlist` is allowed through.
    - Files, `/_next` and `/api` are skipped.
  - Even if the worker fails open, the noindex meta stops soft-404s from being indexed.
- **Worker host rules:** www and http get a 301 to `https://ditchsubs.app`. `*.workers.dev` gets `x-robots-tag: noindex`. That covers preview URLs too. Good.
  - `wrangler.jsonc` still has `database_id: "REPLACE_WITH_D1_ID"`, so production isn't deployed.
- **Live status:** searching "ditchsubs.app" returns no ditchsubs pages, only DitchTV, Ditch Magazine and other "Subs" apps. **Not indexed yet.**

## 3. Guides and price pages vs what ranks

### Cancel guides read in full: Netflix, Spotify, Apple TV (Apple-only)

**What's good**
- Short answer at the very top (35–50 words), written as instructions, with the date and source inside the sentence: "Checked Nov 10, 2026 on help.netflix.com."
- Official cancel button.
- "How do you pay?" jump links.
- Have-this-ready list.
- Separate Apple and partner sections.
- US price table.
- "Did this work?" feedback.
- Disclaimer.
- Honest app box: "It can’t cancel for you."

**What's missing (counted across all 31 guides)**

| Topic | Guides that mention it | RecurDash Netflix | PopSci Netflix |
|---|---|---|---|
| When access ends after cancelling | **1/31** | yes | yes ("What happens next?") |
| Refunds | **3/31** | yes (none prorated; EU 14-day note) | no |
| Google Play / Android billing | **0/31** | yes (in step 8 + FAQ) | yes |
| Restarting / data kept (Netflix keeps profiles ~10 months) | **1/31** | yes | yes |
| Free-trial cancelling | 3/31 | yes | no |
| FAQ / question headings | none (only "How do you pay for X?" and "No cancel button?") | 6 FAQ H3s | 3 question H2s |
| Screenshots | none | 6 captioned | 3 |
| Length | ~410 words | ~1,000 | ~550 |
| Extra tools | none | difficulty score, price history link | none |

Notes per guide:
- **Apple TV (9% unique text):** the guide is Apple's 3 steps plus the shared template. It needs content only it can have:
  - What you lose (channels, the library).
  - The free months that come with a new device ending.
  - Apple One overlap.
  - Cancelling from Mac, Apple TV box, Android or tv.apple.com.
  - What happens to downloads.
  - The same applies to Apple Music (library, downloads, iCloud Music Library) and Apple Arcade (game saves).
- **Spotify:** "Spotify doesn’t mention Apple billing, but if you see APPLE.COM/BILL…" is weak filler. Missing: "you drop to Spotify Free at the end of the billing period, and your playlists stay." That's the line people and AI answers look for.
- **Netflix:** strong steps. Missing "you can keep watching until [end of billing period], no partial refunds, profiles kept ~10 months." Every top result has this.

**Can AI answers quote the short answer?** For "how do I cancel X", yes: it's self-contained, dated and sourced. For the follow-up questions AI Overviews almost always add ("will I be charged again", "do I get a refund", "what happens to my account"), no. We say nothing, so the AI cites a rival on the same answer card.

### Price pages read in full: Netflix, Spotify, ChatGPT

**What's good**
- Short answer with US + UK ranges and the check dates.
- Country jump strip with anchors (`#uk`).
- One real `<table>` with caption, thead, scope and one row group per country, each with tax basis, checked date and source.
- Exact yearly maths.
- "Cheapest plan per country" list.
- The 17-country coverage is unique: RecurDash is US-only.

**What's missing vs RecurDash's Netflix price page**
- RecurDash's title is "Netflix Price 2026: Plans From $8.99/mo", which puts the answer in the result. Ours: "Netflix price 2026 in 17 countries | ditchsubs". Nobody searches for "17 countries".
- **Plan features.** RecurDash has "What Standard with ads includes" (ads, HD/4K, screens, extra members). People searching "netflix plans" want to know what they get.
- **Price history.** The top results for "netflix price uk" are news about the **Sep 3, 2026 UK rise** (£5.99→£7.99 ads tier, £12.99→£13.99, £18.99→£20.99). Our data already has the new prices but doesn't say what changed or when. A per-country change log is the cheapest way to beat the news pages, and it's the raw material for the Price Hike Report.
- **The ChatGPT page shows iPhone app prices** (US Plus $19.99, Go $8). The answer says so, but the H1 is "ChatGPT prices in 2026". Most people searching expect the $20 web price. An AI answer could quote "$19.99" from us as the ChatGPT Plus price. Add the web price row when it's checked, or put "iPhone app" in the title and H1.
- **Duplicated text in the table.**
  - The caption appears twice: `<p class="tbl-cap" aria-hidden>` plus `<caption>`.
  - Each row extracts as "$8.99 a month /mo $107.88 a year $107.88", because the mobile yearly line and the desktop yearly column are both in the HTML.
  - Screen readers skip the aria-hidden copy. Text extractors and LLMs don't.
- **"Netflix price in United Kingdom: …".** People type "uk", "the UK", "the US", "UAE". Use natural names.

## 4. AI search readiness

**Already right**
- Server-rendered HTML that is complete without JavaScript.
- Answer block first in the article.
- Real tables.
- Visible `<time>` dates that match `dateModified`.
- Sources linked, plus `citation` in the Article schema.
- A methodology page.
- robots allows all bots, with Content-Signal ai-input=yes.
- llms.txt.
- Copy is honest: no "saved", "cancel for you" or "detects" anywhere (checked all page text).

**Things that hurt (all small, all fixable)**
1. **Facts don't match across pages.**
   - The home FAQ says "Prices fill in for **12 countries**" (`web/src/app/page.tsx:32`), while llms.txt, /how-we-check and /prices say **17**. Models punish facts that contradict each other. Decide whether the app fills in 17 (if the app really only has 12, keep the app claim and say "the site lists 17").
   - `<meta name="author">` is "Grasp Labs LLC" on every page (layout.tsx `authors`), while the byline and Article JSON-LD say "Aribo".
2. **The schema pieces aren't linked together.**
   - The Article `publisher` is a fresh `{name,url}`, not `{"@id": "https://ditchsubs.app/#org"}`, and has no logo.
   - The author Person has no `@id`. The About page's Person is a separate, unlinked node.
   - Article has no `image`, which Google recommends.
   - MobileApplication has no `@id`, no `url` and no `sameAs`.
3. **Few question headings.** AI engines pull Q→A pairs. Guides need "Will Netflix charge me after I cancel?" style headings, each with a 1–2 sentence answer.
4. **Price answers are ranges.** "Netflix costs $8.99 to $26.99 a month" is fine, but "How much is Netflix Standard in the UK?" gets a better quote from one sentence per plan. A "Plans at a glance" list does that: "Netflix Standard costs £13.99 a month in the UK (incl. VAT)."
5. **The brand name is ambiguous.** Search shows DitchTV, Ditch magazine and "Ditch: Pay Off Debt". There's no `sameAs` (no App Store URL yet; @ditchsubs is in CLAUDE.md but BRIEF says no socials yet). At launch, add the App Store URL and any real profiles to Organization and MobileApplication `sameAs`.
6. **Not indexed.** Nothing gets cited until it's live, crawled and in Bing (ChatGPT search leans on Bing).

## 5. Blog / report recommendation

**Yes, but not a generic "/blog".** Make two small sections that the data supports and the 1–2 h/week upkeep can sustain.

1. **`/guides/…`: evergreen, hand-written iPhone money guides.** PLAN had 2 of these in Phase 0; none exist.
   - Search demand: Apple-billing questions are huge and Apple's own pages are thin.
   - Fit: they're exactly Ditch's audience (iPhone, anxious about charges), and they lead straight to the app.
2. **`/report/2026-11`, `/report/2026-12`…: the monthly Price Hike Report as public pages**, plus one living `/price-changes` page that always shows the latest table.
   - Each issue: one table (service, country, old → new, % change, date, official source), a 3-sentence summary, "what to do" (links to the cancel guides and price pages), and the newsletter sign-up.
   - News sites cover one service in one country. A dated, sourced, 17-country table is the kind of page journalists and AI answers cite. It earns links the cancel guides never will.

**Template:** reuse the guide/price article shell:
- pill, H1, "Updated <time>", By Aribo
- **Short answer** box (40–60 words, dated)
- table of contents
- question-style H2s
- real tables with sources
- "What to do" links into guides and price pages
- disclaimer

Schema: Article (+ Dataset on the report tables), BreadcrumbList, author @id, publisher @id. No FAQ or HowTo rich-result chasing. Put both sections in the sitemap and llms.txt, and in the footer column ("Guides", "Price Hike Report").

**10 first articles, in order**

| # | Article | Query it targets | Why us |
|---|---|---|---|
| 1 | How to see and cancel every subscription on your iPhone | how to cancel subscriptions on iphone / see subscriptions on iphone | Core audience. Apple's page is bare. Links to all 31 guides. |
| 2 | What is APPLE.COM/BILL on my bank statement? | apple.com/bill charge | Already used as a hook in every guide. Includes how to find which app charged you. |
| 3 | How to get a refund for an App Store subscription | apple subscription refund | Natural follow-up to #2 (reportaproblem.apple.com). The support page already gets a refund question. |
| 4 | How to cancel a free trial on iPhone before it charges | cancel free trial iphone | Matches the trial-reminder feature. Includes the "trial ends immediately when cancelled" catch. |
| 5 | Price Hike Report, November 2026 | netflix price increase 2026, spotify price increase | Data we already have (Netflix UK Sep 3, US Mar). Earns links. |
| 6 | Best subscription tracker apps for iPhone (2026), honestly compared | best subscription tracker app iphone | RecurDash ranks with a 5,000-word roundup. We need our own, with disclosure, rows checked against App Store pages, and the owner+lawyer "only where true" rule. |
| 7 | Subscription tracker without linking your bank (Rocket Money alternatives) | rocket money alternative, subscription tracker no bank | Our positioning: no bank login, no account. |
| 8 | What AI subscriptions cost in 17 countries: ChatGPT, Claude, Gemini, Perplexity, Grok | chatgpt plus price uk/india, ai subscription prices | We already have 5 AI price pages, a fast-growing topic, and no strong rival. |
| 9 | The cheapest way to get Netflix / Spotify / Disney+ (ads plans, family, yearly, bundles) | cheapest netflix plan | Built from our plan data. Links to the price pages. |
| 10 | What 6 popular subscriptions cost in 17 countries (data study) | subscription prices by country | PLAN's press study. A linkable asset with a Dataset schema. |

Close runner-up: "Is Apple One worth it? The maths by country". We already have Apple One plus each separate service's price in 12 countries.

## 6. Keyword gaps: 15 highest-value queries we don't target

There are no measured volumes (Ahrefs isn't connected). They're ordered by how big the search results look, intent and fit.

| # | Query (and close variants) | Page type that should serve it | Blocker |
|---|---|---|---|
| 1 | how to cancel amazon prime | cancel guide `/cancel/amazon-prime` (merge with or link to prime-video) | guide is "medium" → owner phone check |
| 2 | how to cancel chatgpt plus / subscription | cancel guide | medium → owner check |
| 3 | how to cancel subscriptions on iphone / see all subscriptions | `/guides/iphone-subscriptions` | write it |
| 4 | apple.com/bill (what is this charge) | `/guides/apple-com-bill` | write it |
| 5 | app store subscription refund | `/guides/app-store-refund` | write it |
| 6 | hulu price / peacock price / youtube tv price / espn price / siriusxm price | price page for one country (US) | the ≥6-country gate in `priceHubServices()`. US data is already verified. |
| 7 | youtube premium price (by country, uk, india) | price page | data: only 2 verified rows |
| 8 | netflix price increase 2026 / spotify price increase | Price Hike Report + price history on the price page | build it |
| 9 | netflix plans / what's included / with ads | price page "Plans at a glance" + features | data fields |
| 10 | best subscription tracker app iphone | comparison article | write it, with the lawyer rule |
| 11 | rocket money alternative / tracker without bank | compare page / article | write it |
| 12 | cancel adobe subscription (without fee) | cancel guide (adobe-cc medium) | owner check. Big early-termination-fee angle. |
| 13 | cancel audible / kindle unlimited / paramount plus / duolingo | cancel guides (all medium) | owner check |
| 14 | cancel free trial iphone | `/guides/cancel-free-trial-iphone` | write it |
| 15 | subscription cost calculator / how much do I spend on subscriptions | `/calculator` as its own URL (the home calculator already exists) | small page |

Not recommended: "how to cancel planet fitness". The demand is huge, but it's a gym with steps that vary by club, we have no data, and a wrong step costs trust.

---

## Findings, ranked

### P0
1. **Guides are thin and templated compared with what ranks.**
   - Evidence: the article is about 410 words. 28% of the text is unique on average; Apple TV is 9%.
   - Evidence: 1/31 guides say when access ends, 3/31 mention refunds, 0/31 cover Google Play.
   - Evidence: RecurDash's Netflix guide is about 1,000 words, with 6 FAQs and 6 screenshots.
   - *Fix (code):* add optional fields to the guide data: `afterCancel`, `refund`, `android`, `restart`/`dataKept`, `alternative` (pause or downgrade), `faq[]`. Render a "What happens after you cancel" H2 and a "Questions" H2 with question-style H3s in `web/src/app/cancel/[slug]/page.tsx`, only when the data exists.
   - *Owner:* check the facts per service. Start with the top 10.
2. **The highest-demand pages don't exist.**
   - No Amazon Prime, ChatGPT, Audible, Paramount+, Adobe or Duolingo guides (all "medium" in `cancel.json`).
   - No Hulu, Peacock, YouTube TV, ESPN or SiriusXM price pages, even though US prices are verified.
   - No YouTube Premium price page.
   - Zero of the planned `/guides`.
   - *Fix (code):* allow a US-only price page, for example when ≥1 verified US row and ≥2 plans, titled "Hulu price 2026 (US)". Change `priceHubServices()` in `web/src/lib/data.ts`, the sitemap, the 6-country check in `prices/[slug]/page.tsx`, and llms.txt.
   - *Owner:* check the medium guides on a phone and approve the guide topics.

### P1: fix in code now
3. **Price pages have no freshness rule, and the gates only run at build time.**
   - Import `freshness` in `web/src/app/prices/[slug]/page.tsx`. Add the stale banner at 90 days and `robots: {index:false}` at 180.
   - Filter expired price pages out of `sitemap.ts` and llms.txt.
   - Add a weekly scheduled rebuild and deploy (GitHub Action cron) so `build.json.today` moves.
4. **The homepage passes no link value to guides or price pages** (0 links in main). Seven price pages have only 2 internal links in.
   - Add PLAN item 11, "There’s a guide for that": top 12 guides plus top 12 price pages, in `web/src/app/page.tsx`.
   - Make the calculator's logo tiles link to `/prices/<id>`.
   - Raise the footer columns from 8 to 10–12.
   - Make "More X prices" fill from all categories when a category has fewer than 4 pages.
5. **Price page titles don't carry the answer.**
   - `web/src/app/prices/[slug]/page.tsx` `generateMetadata` → `${name} price ${year}: from ${usLow}/mo (US), ${ukLow} (UK)`, under 60 characters. Fall back to the first two countries.
   - Shorten guide titles over 60 characters (nintendo-online is 72).
   - In the cheapest list, use "the US / the UK / the UAE" instead of full country names.
6. **Facts and the schema graph don't match up.**
   - `page.tsx:32` says "12 countries". Reconcile it with 17.
   - Set `authors` in `layout.tsx` to Aribo, or drop it.
   - In the Article JSON-LD (cancel and price templates):
     - `publisher: {"@id": SITE+"/#org"}`
     - `author: {"@id": SITE+"/about#aribo", ...}` (reuse the same @id on /about)
     - add `image` (the OG image) and `inLanguage: "en"`
   - Give MobileApplication an `@id` and a `url`.
   - Add a logo ImageObject to Organization.
7. **Price table text is duplicated for crawlers.**
   - `web/src/components/PriceTable.tsx`: drop the `aria-hidden` `<p class="tbl-cap">` and style `<caption>` instead.
   - Render the yearly figure once and move it with CSS, not two copies.

### P1: needs owner or content decisions
8. **Go live, and get indexed.** Live fetch returns 503 or a reset. No ditchsubs pages are indexed. D1 id is still a placeholder. Every week offline is a week of aging lost.
   - Turn off Cloudflare "Block AI bots" and managed robots.txt.
   - Add the site to Search Console and Bing Webmaster Tools and submit the sitemap.
   - Set up IndexNow.
   - After deploy, check that `curl -I https://ditchsubs.app/cancel/nope` returns 404 and `https://<x>.workers.dev/` returns x-robots noindex.
9. **Decide the slugs now, before Google indexes them.** Changing them later needs 301s and loses rankings.
   - `/cancel/max` (shows "HBO Max")
   - `/cancel/doordash` (DashPass)
   - `/prices/grok` (SuperGrok)
   - `/prices/chatgpt-plus` (H1 "ChatGPT")
   - `/prices/nyt`
10. **Price pages need plan features and a change log.**
    - Features: ads, HD/4K, screens, extra members.
    - Change log: date, country, old → new, source. Build it from the git history of `docs/research/prices-*.json`.
    - The "netflix price uk" results are price-rise news (Sep 3, 2026). We have the new prices but don't say what changed.
11. **ChatGPT, Claude and other AI pages show iPhone app prices under the plain service name.** Add web prices once they're checked, or put "iPhone app" in the H1 and title so AI answers don't quote $19.99 as the ChatGPT Plus price.
12. **Start `/guides` and `/report` (see §5).** Write articles 1–5 first. They need no new price data.

### P2
13. llms.txt: add a one-line answer per link. Add `/llms-full.txt` with every short answer and price summary (cheap; the evidence that it helps is weak).
14. Add og:url on non-article pages. Make an OG image per guide and price page (logo-free per the owner rule: service name and price only). Add `article:published_time` and `article:modified_time`.
15. Sitemap: set `/cancel` and `/prices` lastmod to the newest date among their pages. Replace the hard-coded `SITE_UPDATED` with per-file dates.
16. Consider `Dataset` schema on price pages (or a `/data` page, as in PLAN) for Google Dataset Search and press.
17. Home H1 "Ditch it before it renews." doesn't contain "subscription tracker". The title does. Add a small text eyebrow above the H1, "Subscription tracker for iPhone", rather than changing the slogan.
18. MobileApplication says `offers.price: 0` while the app isn't released. Harmless, but add `sameAs` and the App Store `url` at launch, and leave out ratings until they're real (already the plan).
19. FAQPage schema on home and support no longer gives rich results (Google, 2026). Keep it for AI parsing; no other action.
