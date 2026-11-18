# Monetization plan for Ditch (Nov 18, 2026)

Pairs with `demand-2026-11-18.md`. AppKittie: 13 credits used. (Unverified) = weak source or model guess. Nothing here changes a locked decision until the owner OKs it.

## Short answer
- Keep soft paywall + unlimited free tracking + reminders on 3 + first import free + $29.99/yr (trial, pre-selected) · $4.99/mo · $49.99 lifetime.
- Add 5 no-server levers: (1) personalized onboarding paywall naming what free won't cover; (2) test a 14-day vs 7-day trial on Yearly (replaces the planned 3-day test, #53); (3) win-back offers and offer codes; (4) honest trial-ending card + honest cancel screen from on-phone StoreKit data; (5) alternating-week tests measured in App Store Connect Analytics.
- Realistic: ~$0.80 net per install in year 1 now; ~$1.05 with the levers (unverified). A hard paywall might earn 1.1–2.5× per install but risks ratings and breaks "Free forever for tracking".
- **Biggest revenue driver: how many people get 4+ dated subscriptions into the app.** Find/import (names, prices, dates) matters more than any price change.

## 1. Revenue streams (year 1)
| # | Stream | Share | Why |
|---|---|---|---|
| 1 | Yearly $29.99 with trial, pre-selected | ~70% | 53% of subscription revenue starts in the first session; 93% of first purchases on day 0 ([Adapty 2026](https://adapty.io/state-of-paywalls/report/)) |
| 2 | Lifetime $49.99 | ~12–15% | Niche hates "a subscription to track subscriptions"; top manual-tracker paywalls are pay-once (Subtrack $8.99) |
| 3 | Monthly $4.99, no trial | ~12–14% | Anchors Yearly |
| 4 | Website affiliate links (price/compare pages only, labelled) | 0–5% | Paramount+ ~$9, Peacock $8–12, Disney+ $11–16 per signup ([LinkClicky](https://linkclicky.com/affiliate-programs/streaming/), unverified); Apple Performance Partners limited |
| 5 | Later: Family Sharing, a one-off "Find", tips | ~0 now | |
| ✗ | Sponsors, B2B, data | 0 | Breaks "on your side" / privacy |
Scale: 17% of new apps reach $1k/month in 2 years, 4.6% reach $10k ([ppc.land on SOSA 2026](https://ppc.land/the-app-middle-class-is-dying-and-revenuecats-data-shows-exactly-how-fast/)). $5k/month net ≈ 6,000 installs/month (≈4,700 with levers). **Installs are the bottleneck.**

## 2. Paywall strategy
- **Soft paywall at launch (8.5/10).** RevenueCat 2026: hard 10.7% vs freemium 2.1% download→paid by day 35, but 1-year retention of yearly subs 27% vs 28%, and 23% of freemium sales come after week 6. Hard-paywall trackers: 40% recent 1–2★, 9–28% scam/refund mentions. Keep the hard-paywall switch for a paid-ads phase.
- **Free vs Pro:** keep 3 free reminders (8; 1 = +7% revenue within noise and looks stingy; 0 = kills the aha and the rating prompt); first import free (9); trial detector: reading free, trial alert uses a free slot, "Swap one" always offered (8); price watch Pro but the teaser names the service (7.5); export, calendar, totals, cancel help always free (10).
- **When it shows** (max 1 unprompted paywall/day; never at app open, never during the Ditched moment): onboarding after the total (carries most revenue: ~$170 vs ~$40 per 1,000 views, Adapty), personalized ("Free covers Netflix, Spotify, iCloud. Pro adds Disney+, ChatGPT and 4 more"; if N ≤ 3 a different headline); 4th reminder; "renewed without a reminder" card; second import; trial found with no free slot; teasers; Settings.

## 3. Pricing within the honesty rules
| Lever | Recommendation |
|---|---|
| Yearly | $29.99 pre-selected (RevenueCat NA yearly median $39.99) |
| Trial | Launch 7 days, test 14: annual 5–9-day trials convert 33% (25.3% renew once), 10–16-day 43% (36.4%), ≤4-day 24% ([RevenueCat](https://www.revenuecat.com/blog/growth/free-trial-length)); 14 days covers about half a month of renewals |
| Monthly / Lifetime | Keep; test lifetime $39.99 if <3% of purchases after ~300 |
| Offer when the paywall closes | **Don't** (rule 4: × leads to the free app). A first-year price, if ever: at a later moment or via offer codes, "then $29.99/yr", no timer, ≤30% off |
| Win-back offers | Yes, after launch, no server (iOS 18+; set in App Store Connect; Apple shows them; expo-iap `winBackOffer`) ([Apple](https://developer.apple.com/documentation/storekit/supporting-win-back-offers-in-your-app)) |
| Offer codes | Yes; the way to run the free Lifetime weekend (#53) with an end date and cap; test one code first ([Apple](https://developer.apple.com/documentation/storekit/supporting-offer-codes-in-your-app)) |
| Promotional offers, Retention Messaging API, Advanced Commerce | Skip: need a server |
| Regional prices | Apple's matching; set India/Brazil/Türkiye/Mexico at ~50–60% of US if installs but no purchases |
| Apple's cut | Small Business Program 15% before the first sale |
| Billing grace period | Turn on |

## 4. Lifecycle levers (on the phone)
Trial-end reminders (built); "What Pro did this week" card on trial days 3–5 from the proof-it-fired log (8.5); honest trial-ending card if auto-renew is off (nothing deleted); reminder 7 days before Ditch's own yearly renewal (8); monthly→yearly nudge after 2 paid months; honest cancel screen before Apple's; ratings per #38, never in a paywall session; only functional notifications, promotional ones opt-in (4.5.4); optional free "Month ahead" summary.

## 5. Funnel per 1,000 installs, 12 months, net
| Step | A: launch plan | A+: with levers | B: hard paywall, 7-day trial |
|---|---|---|---|
| Reach paywall | 720 | 760 | 800 |
| Day-0 trial starts | 55 | 63 | 120 |
| Trial → paid | 35% → 19 | 40% → 25 | 32% → 38 |
| Day-0 direct buys | 5 | 6 | 8 |
| Later conversions | 9 | 12 | ~0 |
| Payers | 33 (3.3%) | 43 (4.3%) | 46 (4.6%) |
| Year-1 net | ~$815 | ~$1,055 | ~$1,065 (~$880–950 after ratings cost) |
1 free reminder ≈ A within noise. A+ gets most of a hard paywall's money without its risks.

## 6. Testing without RevenueCat
Measure in App Store Connect Analytics (Mar 2026: cohorts, offer conversion, peer benchmarks) ([Apple](https://developer.apple.com/news/?id=hh6v4b55)). Split by alternating weeks (variant flag in the public JSON file or scheduled intro offers), or by product ID buckets, plus Product Page Optimization. ~3,400 installs per variant to see +30% trial starts; ~5,800 for download→paid. Order: (1) PPO "Track everything free" vs "Find the subscriptions you forgot"; (2) 7 vs 14-day trial; (3) one- vs two-page personalized paywall; (4) lifetime $39.99; (5) India/Brazil prices; (6) hard paywall only with paid ads.

## 7. Don't
Weekly plan, countdowns, struck-through prices, trial toggle, rounded-up "Save 50%" (2.3.1(a), 3.1.2(a)); a second paywall after ×; promotional notifications without opt-in; taking away free features; "pay to add results" from import; claims of auto-detection, savings or cancelling; promo-offer keys in the app; analytics/attribution/ad SDKs; custom rating prompts; affiliate links in cancel guides or the app at launch. Apple 4.10: describe Pro as Ditch's own work (reminder days, nudge, price watch, import), not "notifications".

## Only-you tasks (M2)
Small Business Program; products `pro_yearly` (7-day trial), `pro_monthly`, `pro_lifetime`; billing grace period; after launch: win-back offers, the lifetime offer code (test one), PPO test.
