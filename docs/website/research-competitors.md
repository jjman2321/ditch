# Competitor websites (teardown, Nov 12, 2026)

48 pages captured live with Playwright (1440 and 390 wide). Raw HTML read for schema and no-JS content. Screenshots stay in the session scratchpad (not committed).

## Scores (out of 10)
| Site | What it is | Design | Conversion | SEO | Trust | Note |
|---|---|---|---|---|---|---|
| **RecurDash** (recurdash.com) | web app + guides | 8 | 7 | 9 | 8 | **The real rival.** ~320 cancel guides, 72 price pages, "Last read Nov 12" badges (47 vendor pages re-read nightly), methodology page, big "Netflix costs you $107.88 a year". 267 KB home. **US only**, Apple/Google billing buried at step 8, reminders by email only, picker defaults to cheap plans, two different dates on one page, Product/Offer schema on other companies' prices. |
| SubTracker (subtracker.io) | web app + 400+ template pages | 6 | 6 | 9 | 4 | "The short answer" box, founder byline, "Where SubTracker is not the right choice" section (good). Wrong-currency Netflix price, lifetime-deal countdown, cookie banner + install prompt stacked on mobile. |
| ReSubs (resubs.app) | iOS/Android app | 7 | 8 | 8 | 6 | Only rival with a **Smart App Banner**; sticky "Get App" bar; 30 languages; Guides/Articles/Comparisons footer; fair-ish "vs Bobby". Unsourced stats. |
| Rocket Money (deep pages) | bank-link app | 7 | 8 | 8 | 6 | 457 /learn pages aimed at hard-to-cancel services (gyms), **no streaming guides**. ~2.5 MB pages, H1 at 584 px on mobile. "5 million" vs "1 million" cancelled in the same page. |
| Copilot | bank-link app | 9 | 8 | 4 | 8 | Little content; clever country-vote leaderboard; 404 as a declined transaction. |
| Monarch | bank-link app | 8 | 7 | 7 | 7 | 7.7 MB home, LCP ~5 s, 168 px cookie banner, promo-code bar. |
| Orbit (tryorbit.com) | iOS app | 8 | 7 | 1 | 6 | Beautiful, **no H1, no schema, no guides**, "finds every bill" overclaim. |
| SubPilot | iOS app | 6 | 6 | 7 | 4 | "Editorial Team" bylines, "$1.8M savings" claims, stale Apple One price, /cancel/netflix redirects home. |
| Subger | waitlist | 5 | 4 | 6 | 3 | AdSense cookies on a privacy pitch, stale $7.99, "You save $95.88/year". |
| Bobby | iOS app | 5 | 4 | 1 | 5 | One page, 7 words without JS, no schema. |
| Chronicle | iOS/Mac app | 3 | 4 | 2 | 6 | Neglected, last post 2023. |
| Trim / Chargeback | gone | – | – | – | – | Trim → OneMain; Chargeback stopped sign-ups June 2026. |
| App Store Tracker (best-of list) | list site | 7 | – | 8 | 4 | Ranks for "best subscription tracker iphone"; its #1 pick (Chargeback) shut down in June. |
| Tom's Guide | publisher | 5 | – | 9 | 6 | Ranks for "cancel Netflix" with a Jan 2024 date, 5.9 MB. |
| Netflix Help | official | 7 | – | – | 10 | The floor: 3 steps, every edge case (partner billing, gift card, on hold). |

## Match the best
1. Answer block at the very top (styled as a small receipt card).
2. Big yearly number with plan tabs (this is Ditch's onboarding reveal; own it).
3. Visible checked date next to the source, matching `dateModified`.
4. Methodology page + "Disagree? Tell us" corrections line on every page.
5. Official "Open [service]'s cancel page" button high up.
6. Reminder CTA inside the guide, right under the cancel button.
7. Footer link columns (Guides / Prices / Compare, ~10 each + "View all").
8. Index pages with search and category chips with counts.
9. Smart App Banner + desktop QR + store badge at launch (only ReSubs does the banner).
10. Price history per service.

## Where we clearly win
- **12 countries of real local prices** (nobody else; RecurDash is US only). Put it on the home page.
- **How you pay comes first** in cancel guides (everyone buries Apple/partner billing).
- **iPhone first**: Settings paths, lock-screen reminders, Smart App Banner (rivals are web or bank-link apps).
- **Honesty** made visible (rivals: countdowns, "you save $X", contradicting numbers, faceless bylines).
- **Speed**: static pages under 150 KB vs 2.5–7.7 MB.
- **Mobile first screen**: no cookie banner, answer visible without scrolling.
- **Fresh own data** instead of the recycled "people underestimate by $133" stat.
- **Design**: cream, sunflower, Archivo, real logos and the duck vs generic blue/purple SaaS.

## Risks
- Looking like RecurDash (it also has a yellow CTA, a stamp-like badge, "costs you $X a year"). Keep the DITCHED stamp only for the ditch moment; show "checked on" as a plain receipt line; lead with countries and how-you-pay.
- Freshness race: RecurDash re-reads nightly. Keep the 90/180-day gates; consider an owner-only price-diff alert for the top 15 hubs in Phase 1.
- Scaled-content crackdown (Gerald's pages already pulled): fewer, better pages.
- Comparison pages must stay accurate and re-checked (rivals change and shut down).
- Copy lint must also block "finds every", "you save", "limited time", "in 2 minutes".
