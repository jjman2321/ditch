# Prices vs competitors, and profit margins

Written Nov 10, 2026. Our prices are locked (DECISIONS #6, #12): **Yearly $29.99 with a 7-day free trial (pre-selected) · Monthly $4.99 · Lifetime $49.99 (Pro only)**. Free: unlimited tracking plus reminders on 3 subs. This note checks them against 38 competitors and works out what Ditch keeps from each sale. AppKittie revenue and download numbers are **estimates**, not facts.

## Summary (12 lines)
1. **Margin: Ditch keeps about 75–76¢ of every dollar a customer pays**, before income tax, your own pay and marketing. In year 1 it's ~68% at $1k a month, because fixed costs (illustrator, Apple fee) weigh more when sales are small.
2. Where the money goes: Apple 15%, VAT/GST in non-US stores ~6%, refunds ~3.5%, RevenueCat 1% (only above $2,500 a month). Fixed costs are tiny: **~$22 a month lean, ~$87 a month in year 1**.
3. **Net per paying user: $1.93 a month on yearly, $3.85 on monthly, $38.54 once on lifetime.** At a 70/20/10 mix, that's **~$2.23 a month per paying user** (from $2.89 paid).
4. **Break-even: about 12 yearly subscribers a month in running costs, or ~36 yearly subscribers to cover all of year 1** (including a $550 illustrator).
5. $5k a month needs **~1,730 paying users**, or roughly **5,500–7,000 downloads a month**. Orbit gets ~6,700 downloads and earns ~$2.2k (estimates).
6. **Yearly $29.99 sits exactly at the middle of all 30 apps that sell a yearly plan** (48th percentile). It's **2× the honest manual trackers** (median $14.99) and **less than half the bank/auto-find apps** (median ~$69).
7. **Monthly $4.99 is cheaper than average** (39th percentile; median $6.49). **Lifetime $49.99 is near the top** (91st percentile; median $19.99). Only 2 of 22 lifetimes cost more.
8. **$29.99 a year is becoming the indie standard.** SubGuard ($4.99/$29.99, 7-day trial) is identical to us, and Ditchr and Track My Subs are $29.99 too. Price won't set us apart. Reminders that fire, unlimited free tracking and local prices will.
9. **The money in this niche goes to "we find it for you" apps with weekly plans**: MonoBoost ~$160k a month, Subpilot ~$85k, Feenko ~$80k. They earn ~$4 per download, against ~$0.73 for manual trackers. Their reviews are harsh, and they pay for bank data, servers and Apple's 30% at scale.
10. **Bank-link apps have a cost we don't:** each user who links a bank costs them ~$0.30 per bank a month, **including free users**. A free Ditch user costs us $0.
11. **Recommendation: keep all three prices** (yearly 8.5/10, monthly 8/10, lifetime 7/10). The data doesn't strongly argue for a change. Two tests for *after* launch, with real data: a lower price in India, and lifetime at $39.99 if almost nobody buys it.
12. **Only you can do this:** enrol in Apple's Small Business Program before the first sale, and ask an accountant about the US LLC and income tax where you live.

---

## Part 1: competitor prices

**How I got them:** I took the US App Store top results for "subscription tracker" and "subscription manager" (iTunes Search API, Nov 10). For every app I pulled the In-App Purchase list from its App Store page and from AppKittie. AppKittie also gave revenue, downloads, ratings and country split. For trial length and the pre-selected plan, I used AppKittie paywall captures and the earlier Mobbin work (`paywalls-competitors.md`). "?" means I couldn't see it.

**Read the table like this:**
- "Yearly to user" is what a person pays in a year on the plan the app pushes. A weekly plan kept for a year costs 52× the weekly price.
- "Eff./mo" is that yearly cost ÷ 12.
- Rev and DL are AppKittie's estimates for the last month, for all countries. Countries are AppKittie's split of all-time users (26 countries tracked).
- The rating is AppKittie's total rating count, which matches the US App Store.
- Several apps list many prices for one plan. That usually means price tests or old prices, so I give the range.

### A. Bank-link, auto-find and "we cancel for you" apps
| App (ID) | Plans, US | Trial · pre-selected | Yearly to user | Eff./mo | Free tier | Rev / DL per mo (est.) | Top countries | Rating | Hook |
|---|---|---|---|---|---|---|---|---|---|
| **Rocket Money** (1130616675) | Premium pay-what-you-want **$7–14/mo**; Premium+ $15/mo (store IAPs $2.99–11.99) | 7 days · a slider, $10 shown in an older capture | $84–168 (Premium+ $180) | $7–14 | Bank link and subscription list free; cancelling for you is paid | **$1.0M** / 251k | US 100 | 4.47 (406k) | Plaid bank link + concierge cancel |
| **MonoBoost** (6740202306) | Weekly $6.99–9.99, monthly $11.99–19.99, quarterly $39.99, yearly $99.99; IAPs named "90% off" | ? · weekly | $100–520 | $8–43 | Hard paywall (earlier research) | **$160k** / 25.7k | US 100 | 4.37 (6.3k) | "Automatic detection", bank |
| **Subpilot** (6751181747) | Weekly $9.99, monthly $19.99–24.99, yearly $99.99; extras: $4.99 for 1 auto-cancel, $17.99 for 5, "Free Trial Detector" $39.99–69.99, Concierge Pro $59.99 | 3 days on weekly · **monthly $24.99** | $100–520 | $8–43 | Hard paywall | **$85k** / 12.6k | US 91, CA 5 | 4.57 (6.4k) | Bank + Gmail/Outlook, cancels for you |
| **Feenko** (6747262759) | Weekly $9.99, 6 months $39.99, AI Advisor $9.49/mo | 3 days on 6-month · **weekly** | $80–520 | $7–43 | ? | **$80k** / 13.1k | US 69, AU 11, CA 8 | 4.16 (1.3k) | Bank transactions + email |
| **SubSeek** (6769329967) | Weekly $6.99–14.99, yearly $39.99–59.99 | ? | $40–520 | $3–43 | ? | $29k / 27.7k | US 92 | 4.06 (850) | Email + bank "coming soon" |
| **Cancel Subscriptions & Refund** (VUNYO, 6479920412) | Weekly $1.99–4.99, monthly $4.99–19.99, yearly $29.99–79.99, lifetime $19.99 | ? | $30–240 | $2.50–20 | Limited subs | $20k / 5.0k | US 57, CA 26, AU 8 | 4.09 (872) | Cancel and chargeback guides |
| **Hiatus** (977040079) | Monthly $9.99–20.99, yearly $35.99–59.99 | ? | $36–252 | $3–21 | ? | $11.7k / 7.4k | US 100 | 4.16 (6.9k) | Bank link |
| **SubFind** (6761034583) | Weekly $9.99, monthly $9.99–14.99, yearly $49.99, lifetime $9.99–29.99 | ? | $50–520 | $4–43 | ? | $5k / 6.1k | US 53, CA 22, GB 18 | 4.83 (30) | Statement PDF/CSV, "AI scans it", no bank login |
| **Subscription Stopper** (inMarket, 6448767732) | Monthly $5.99–11.99, yearly $59–99 (says "100% free") | ? | $59–144 | $5–12 | Free to find subs | $3.5k / 2.5k | ? | 4.49 (686) | Bank link |
| **Cancel Subscriptions / Chargeback** (6444500753) | $30/mo to $144/yr (paid outside the App Store) | ? | $144–360 | $12–30 | ? | not visible / 20.1k | ? | 4.56 (29.3k) | Bank link + concierge |
| **Cancely** (6778323362) | Weekly $4.99, monthly $24.99, yearly $89.99 | ? | $90–300 | $7.50–25 | ? | $1.9k / 3.3k | US 60, CA 30 | 4.67 (12) | Manual + cancel guides |
| **Tracky AI** (6758150012) | Weekly $3.99, monthly $9.99, yearly $29.99, "Start Free" $4.99 | ? | $30–207 | $2.50–17 | ? | no data | — | 0 ratings | "AI" cancel helper |

### B. Honest manual trackers
| App (ID) | Plans, US | Trial · pre-selected | Yearly to user | Eff./mo | Free tier | Rev / DL per mo (est.) | Top countries | Rating | Hook |
|---|---|---|---|---|---|---|---|---|---|
| **Bobby** (1059152023) | One-time: $0.99 unlocks, "All-in-one" $1.99–2.99 | none | $0.99–2.99 once | ~$0 | 5 subs | $32.6k* / 11.9k | US 38, IT 14, ES 10 | 4.75 (8.0k) | Manual + catalog. No update since Dec 2025 |
| **Chronicle** (572561420) | Pro $14.99/yr | ? | $14.99 | $1.25 | Unlimited bills | $4.2k / 3.1k | US 89 | 4.83 (3.9k) | Manual bills |
| **Orbit** (6692620188) | Yearly $19.99, lifetime $24.99–39.99 (+ old $12.99 one-time) | none · **lifetime only** on one paywall | $19.99 or $25–40 once | $1.67 | 3–5 subs (differs by capture) | $2.2k / 6.7k | US 21, IT 17, GB 13 | 4.71 (133) | Manual + "Magic Import" (screenshots, CSV, statements) |
| **Pandora** (1470560916) | Yearly $2.49, lifetime $6.99 | ? | $2.49 | $0.21 | ? | $10.9k / 10.4k | **CN 84**, US 8 | 4.68 (437) | Manual + catalog + iCloud |
| **Subscription Tracker** (Ali Alhady, 1502336248) | One-time $2.99 | none | $2.99 once | ~$0 | ? | $8.6k* / 11.8k | US 93 | 4.60 (259) | Manual. #4 for "subscription tracker" |
| **Subscription Manager** (Kango, 1259029889) | $0.99/mo, $9.99/yr, one-time $4.99 or $29.99 | ? | $9.99 | $0.83 | Limited subs | $3.1k / 2.1k | US 76, CA 11 | 4.46 (1.7k) | Manual |
| **Subo** (6741823650) | Lifetime $24.99; non-renewing 12-month $9.99 or 3-month $3.99 | none | $9.99 | $0.83 | 6 subs | $1.4k / 8.2k | US 21, IT 20, DE 13 | 4.84 (82) | Manual + templates |
| **Subby** (6739703718) | Subby Plus $9.99 (one-time) or $9.99/yr | ? | $9.99 | $0.83 | ? | $2.5k / 5.4k | US 36, FR 14, GB 12 | 4.78 (18) | Manual |
| **Subtrack** (1519946553) | Lifetime $8.99; family $14.99 | none · **lifetime $8.99** | $8.99 once | ~$0 | 3 subs | $5.7k / 6.8k | US 30, FR 22, DE 11 | 4.52 (193) | Manual + Mac app |
| **Subscriptions** (Feist, 1551697409) | One-time $8.95 | none | $8.95 once | ~$0 | 5 subs | $3.8k / 5.2k | DE 49, US 18 | 4.72 (160) | Manual |
| **Subscription & Bill Manager** (1506451600) | $1.99/mo, $19.99/yr, $29.99 lifetime | ? | $19.99 | $1.67 | ? | $4.5k / 5.5k | JP 100 | 4.53 (1.1k) | Manual |
| **SubTracky** (6593692260) | Weekly $0.99, monthly $2.99, yearly $7.99, lifetime $12.99 | 3 days · **weekly**, with a trial toggle (Apple now rejects these) | $7.99–51 | $0.67–4.30 | ? | $4.3k / 9.0k | US 42, CN 17, TW 10 | 4.79 (176) | Manual |
| **Costly** (6738356072) | $1.99/mo, $14.99/yr, $29.99 one-time | ? | $14.99 | $1.25 | "Core features free" | $2.6k / 6.8k | JP 51, US 49 | 4.48 (29) | Manual |
| **ReSubs** (6740457603) | Weekly $1.99–4.99, monthly $3.99–7.99, yearly $13.99–17.99, lifetime $24.99–49.99 | ? · **yearly with "-50% ENDS SOON"**, struck-through $35.98 (fake urgency) | $13.99–17.99 | $1.17–1.50 | Unlimited subs | $6k / 7.6k | US 34, GB 14, AU 11 | 3.87 (38) | Manual, "no bank needed" |
| **Subpli** (6752722752) | $1.99/mo, $14.99/yr, $29.99 lifetime | ? | $14.99 | $1.25 | Unlimited subs | $1.7k / 7.4k | US 52, CA 16 | 4.80 (126) | Manual |

\* Bobby's and Ali Alhady's estimates look too high. At $0.99–2.99 once, $32.6k would mean 11,000–33,000 purchases a month from ~11,900 downloads. Treat AppKittie's numbers for one-time apps as unreliable.

### C. New and indie apps (2025–2026)
| App (ID) | Plans, US | Trial · pre-selected | Yearly to user | Eff./mo | Free tier | Rev / DL per mo (est.) | Top countries | Rating | Hook |
|---|---|---|---|---|---|---|---|---|---|
| **SubGuard** (MAPI PROJEKTAI, 6786820661) | **$4.99/mo, $29.99/yr** | **7 days on yearly**. The same as ours | $29.99 | $2.50 | "Essential tracking"; Premium = unlimited | ~$0 / 471 | US 100 | 5.0 (4) | Manual |
| **Ditchr** (Artmvstd SIA, 6788658909) | $3.99/mo, **$29.99/yr**, $39.99 lifetime | ? | $29.99 | $2.50 | ? | no data | — | 0 ratings | Manual, no bank. 34 languages |
| **Track My Subs** (Nocte, 6749513883) | $6.99/mo, **$29.99/yr**, $39.99 lifetime (its description still says $2.99/$24.99) | ? | $29.99 | $2.50 | 3 subs, **no reminders free** | ~$0 / 671 | DE 100 | 0 ratings | Manual + catalog. 44 languages |
| **Subtle** (North Studio, 6781251166) | $6.99/mo, $39.99/yr, $99.99 lifetime | ? | $39.99 | $3.33 | Limited subs | ~$0 / 1.5k | GB 32, CA 27, US 27 | 5.0 (6) | **Screenshot + statement import on the phone**. Closest to our features |
| **Subscription Tracker** (Furness, 6746950605) | Weekly $4.99, monthly $12.99, yearly $39.99, lifetime $59.99 | ? | $40–260 | $3.33–22 | ? | $1.7k / 8.3k | US 73 | 4.06 (47) | Manual. #10 for "subscription tracker" |
| **SubVault** (6791337140) | Weekly $2.99, monthly $4.99, yearly $34.99 | ? | $34.99 | $2.92 | Limited | ~$60 / 392 | US 100 | 5.0 (2) | Manual, on-device AI |
| **Outflow** (6779691937) | One-time Pro $4.99 | none | $4.99 once | ~$0 | ? | ~$80 / 497 | GB 67 | 5.0 (1) | FinanceKit, "Data Not Collected" |
| **Submind** (6752399847) | Weekly $2.99, yearly $8.99, lifetime $14.99 | ? | $8.99 | $0.75 | ? | ~$0 / 439 | ? | 5.0 (4) | Manual |
| Recurred, Postpone, Subtracker • App | No paid plans listed | — | $0 | — | — | ~0 | — | 0–1 ratings | Manual |
| **Ditch** | $4.99/mo, $29.99/yr, $49.99 lifetime | 7 days · yearly | **$29.99** | **$2.50** | **Unlimited tracking + 3 reminders** | — | — | — | Manual + catalog with local prices, on-phone import, reminders that fire |

**Names in your list I couldn't match exactly:**
- "Recurrent": no tracker by that name. The closest is "Recurred" (above).
- "TrackMySubs": two apps match. I used Track My Subs by Nocte. TrackMySub by Polat has ~300 downloads.
- "Subtrack": I used Mohit Nandwani's long-running app. "Subtracker AI" and "Subtracker • App" are tiny.
- Other big names in the search results that aren't trackers: Apple Wallet, YNAB, NerdWallet, Copilot, Experian.

### Where Ditch sits
| Plan | Our price | Apps compared | Median | Ditch's percentile | Cheaper than us | Pricier than us |
|---|---|---|---|---|---|---|
| Yearly | $29.99 | 30 | $29.99 | **48th** | 12 | 13 (+5 the same) |
| Yearly, manual trackers only | $29.99 | 18 | $14.99 | **75th** | 12 | 3 (+3 the same) |
| Yearly, bank/auto-find only | $29.99 | 12 | ~$69 | **8th** | 0 | 10 (+2 the same) |
| Monthly | $4.99 | 22 | $6.49 | **39th** | 7 | 12 (+3 the same) |
| Lifetime / one-time | $49.99 | 22 | $19.99 | **91st** | 20 | 2 (Furness $59.99, Subtle $99.99) |

For context, across all subscription apps, RevenueCat's 2026 report puts the median yearly price at **$34.80** ($39.99 in North America, **$18.32 in India/Southeast Asia**). So Ditch's yearly price is a bit below the median for apps in general.

### Value per dollar, by group
| Compared with | Their typical price | What they give that we don't | What we give that they don't | Ditch value score /10 |
|---|---|---|---|---|
| Bank/auto-find (A) | ~$69/yr, often $9.99/week ($520/yr) | Finds subs for you (badly, per reviews: "found zero subscriptions") and sometimes cancels for you | **Half the price or less**, no bank login, reminders on 3 subs free, no weekly plan, and an honest trial | **9** |
| Honest manual (B) | $14.99/yr, or a $9–25 lifetime | Cheaper. Bobby and Subtrack cost under $10 once | **Unlimited free tracking** (most cap at 3–6), local prices in 12 countries, on-phone import, the trial on your own list | **6.5**. We cost 2× the median, and the free tier has to prove it |
| New indie (C) | $29.99/yr (SubGuard, Ditchr, Track My Subs) | Ditchr and Track My Subs have $39.99 lifetimes and 34–44 languages | A more generous free tier (Track My Subs gives no free reminders), local catalog prices, import | **7.5**. Same price, so the product has to win |

### Risks
- **Too expensive (the bigger risk).** Manual-tracker buyers are used to $10–20 a year or a one-off under $25. Bobby reviewers praise "pay once" (DECISIONS research). Lifetime at $49.99 is near the top of the category.
  - The defence: free users already get the whole list and their real total. Only reminders beyond 3 and import are paid, so people pay after the app has proved itself.
  - Watch for: paywall conversion under ~2% of downloads, and "too expensive" in reviews.
- **Too cheap?** Only next to the bank apps, and their prices pay for bank data, servers and paid ads. Going to $39.99 would put us above every new indie rival without a feature that justifies it. Not recommended.
- **Lifetime cannibalising yearly.** At 1.67× yearly it's less tempting than the usual 1.3× (Adapty), which is the point of DECISIONS #12. The risk is that so few people buy it that it adds nothing.
- **Outside the US.** 60–80% of Bobby, Orbit and Subo users are outside the US, and Italy is often #2. Apple's automatic local prices are fine for Europe. India gets the same price converted, which is high locally (RevenueCat's India/Southeast Asia median is $18.32).
- **Same price as clones.** SubGuard matches us to the cent. Price is not our edge; reliability and the free tier are.

### Recommendation: keep all three prices
| Price | Score /10 | Verdict | Why (target user + conversion) |
|---|---|---|---|
| Yearly $29.99, 7-day trial, pre-selected | **8.5** | Keep | The middle of the market, half the price of bank apps, and the new indie standard. A 5–9-day trial has a **37.4% median trial-to-paid rate** (RevenueCat 2026), much better than 3-day trials (25.5%). A money-anxious buyer reads it as fair, not cheap or greedy. |
| Monthly $4.99 | **8** | Keep | Below the median ($6.49). The yearly plan saves a true 49%, which pushes people to yearly without tricks. |
| Lifetime $49.99 | **7** | Keep for launch | It's meant to steer people to yearly, and DECISIONS #12 already allows a lower test later. **Test $39.99 only if** lifetime is under ~3% of purchases after ~300 purchases. Ditchr and Track My Subs sit at $39.99. |
| No weekly plan | **10** | Keep | Weekly plans earn money (MonoBoost, Subpilot), but they're what review "scam" complaints attack (DECISIONS free-tier evidence: 20% of MonoBoost reviews), and they break our honesty rules. |

**Later test, not a change:** after launch, set a lower yearly price for **India** in App Store Connect (per-country pricing) if India shows downloads but almost no purchases.

---

## Part 2: profit margins

### The rules in 2026 (checked Nov 10)
- **Apple:** Small Business Program = **15%** on everything, for developers under $1M in proceeds a year (prior and current calendar year). Above $1M you go to the standard 30%, with subscriptions dropping to 15% after a subscriber's first year ([Apple](https://developer.apple.com/app-store/small-business-program/)).
  - Apple's page also mentions **10%**, but only for developers on the **EU alternative terms**, which we won't use.
  - China's rates dropped in March 2026 (12% for small developers), but China isn't a launch country ([AppleInsider](https://appleinsider.com/articles/26/03/13/apples-app-store-in-china-gets-lower-25-commission-to-appease-regulators)).
  - **$1M in proceeds ≈ $1.18M in sales a year ≈ $98k a month.** None of our scenarios gets close.
- **US web checkout:** since the Epic court ruling, US apps may link to a web checkout, and Apple currently charges no commission on those sales. The Supreme Court is reviewing this, and a lower court still has to set an allowed fee ([Courthouse News](https://www.courthousenews.com/apples-fight-over-commissions-for-linked-out-app-store-purchases-continues-in-district-court/), [TechSpot](https://www.techspot.com/news/112956-apple-fight-epic-over-app-store-fees-reaches.html)). At 15% it isn't worth the extra work and lost conversions for v1. Revisit only above ~$10k a month.
- **RevenueCat:** **free up to $2,500 a month in tracked revenue, then 1%** ([RevenueCat pricing](https://www.revenuecat.com/pricing/)). The page doesn't say whether the 1% covers all revenue or only the part above $2.5k, so I assume **all of it** (the cautious choice). Tracked revenue is what customers pay, before Apple's cut.
- **VAT and GST:** Apple collects and pays them. But prices in the UK, EU, Australia and India **include** tax, so Apple takes the tax out before splitting the rest. I assume ~45% of sales come from outside the US at ~14% average tax, so **about 6% of all sales goes to tax**. US prices have sales tax added on top, so no cut there.
- **Refunds:** RevenueCat's 2026 report puts the median refund rate at **3.5%** for non-AI apps ([report via MobileMarketingReads](https://www.mobilemarketingreads.com/?p=50360)). Adapty gives 3.0–3.5% for monthly plans and 4.2% for yearly ([Adapty](https://adapty.io/blog/refund-rate-metrics-and-benchmarking/)). Apple decides refunds, and there are no card chargebacks for App Store purchases. I use 3.5%.
- **Income tax:** not modelled. A US LLC owned by someone living outside the US has its own US filing rules (ask specifically about **Form 5472**), plus tax where you live. **Ask an accountant** before the first payout.

### Fixed costs
| Item | Cost | Per month | Note |
|---|---|---|---|
| Apple Developer Program | $99/yr | $8.25 | Required |
| Domain ditchsubs.app | ~$15/yr | $1.25 | |
| EAS (Expo builds) | Free: 15 iOS builds/month; Starter $19/mo ([Expo](https://expo.dev/pricing)) | $0–19 | Free is enough unless you build a lot |
| Price-update robot | ~$0–5/mo | ~$2 | `autosync.md`: GitHub Actions free, AI ~$1–2 |
| Support email | iCloud+ custom domain | ~$0.99 | `STATUS.md` setup; $0 if you already pay for iCloud+ |
| Privacy policy hosting | GitHub Pages or Cloudflare Pages | $0 | |
| LLC upkeep (state fee, registered agent) | ~$100–300/yr, depends on the state | ~$10 | Ask the accountant |
| Duck illustrator (one-off) | $300–800 | ~$46 in year 1 | $550 midpoint ÷ 12 |
| **Total** | | **~$22 lean · ~$87 in year 1** | |

### What one sale is worth
| Plan | Customer pays | After Apple only | **What Ditch keeps** (after Apple, VAT, refunds) | Same, above $2.5k/mo (RevenueCat 1%) | Per month |
|---|---|---|---|---|---|
| Yearly | $29.99 | $25.49 | **$23.12** | $22.82 | **$1.93** |
| Monthly | $4.99 | $4.24 | **$3.85** | $3.80 | **$3.85** |
| Lifetime | $49.99 once | $42.49 | **$38.54 once** | $38.04 | $1.07 if spread over 36 months |

**Plan mix 70% yearly, 20% monthly, 10% lifetime** (lifetime spread over 36 months; a guess at how long a lifetime buyer would otherwise have paid): **$2.89 paid → $2.23 kept per paying user per month.**

### At scale (monthly revenue = everything customers pay in a month, lifetime sales included)
| Monthly revenue | Paying users | Apple | VAT/GST | Refunds | RevenueCat | Fixed (lean / yr 1) | **You keep (lean)** | **Margin lean / yr 1** |
|---|---|---|---|---|---|---|---|---|
| $1,000 | ~350 | $141 | $60 | $28 | $0 | $22 / $87 | **$749** | **75% / 68%** |
| $5,000 | ~1,730 | $705 | $300 | $140 | $50 | $22 / $87 | **$3,783** | **76% / 74%** |
| $10,000 | ~3,470 | $1,410 | $600 | $280 | $100 | $22 / $87 | **$7,588** | **76% / 75%** |
| $25,000 | ~8,660 | $3,525 | $1,500 | $699 | $250 | $22 / $87 | **$19,003** | **76% / 76%** |

- The margin hardly moves with size. Almost every cost is a percentage, and the fixed ones are tiny. That's the upside of no server and no bank link.
- **Not included:** your income tax, your own pay, and marketing. DECISIONS #18 is organic first, so marketing is $0 to start. Paid ads would be the biggest cost by far if you ever turned them on.

### Break-even
- **Running costs:** $22 ÷ $1.93 ≈ **12 yearly subscribers**. With EAS Starter and the illustrator spread over year 1: ≈ **45**.
- **Whole first year:** ~$820 (Apple $99, domain, robot, email, illustrator $550, LLC ~$120) ÷ $23.12 per yearly subscriber ≈ **36 yearly subscribers in year 1.**

### How many downloads each target needs
These assumptions come from RevenueCat 2026 ([report](https://www.revenuecat.com/state-of-subscription-apps-2026/), [blog](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026)):
- **2.1%** of downloads become paying customers in freemium apps (median, day 35).
- About **28%** of yearly subscribers renew after year 1.
- I assume about **12% of monthly subscribers cancel each month**. RevenueCat gives no median for this, so it's my guess.
- So a paying customer stays about **15 months** on average.

| Target | Paying users | New payers needed / month | Downloads / month (2.1% pay) | Cross-check: manual-tracker median $0.73 per download (AppKittie est.) |
|---|---|---|---|---|
| $1k | ~350 | ~23 | ~1,100 | ~1,400 |
| $5k | ~1,730 | ~115 | ~5,500 | ~6,800 |
| $10k | ~3,470 | ~230 | ~11,000 | ~13,700 |
| $25k | ~8,660 | ~580 | ~27,500 | ~34,000 |

For scale: Orbit gets ~6.7k downloads a month, Subo ~8.2k and Bobby ~11.9k (AppKittie est.). Hitting $5k means matching the download level of the bigger indie trackers while converting about as well as a typical freemium app.

### Competitors' implied margins (rough; nobody publishes these)
| Type | Example | Apple's cut | Costs per user each month | Implied margin before marketing |
|---|---|---|---|---|
| **Ditch** | — | 15% | $0 | **~75–76%** |
| Manual tracker, subscription | Chronicle, Orbit, SubGuard | 15% | $0 | ~75–80% (the same stack; some skip RevenueCat) |
| Manual tracker, one-time | Bobby, Subtrack, Subscriptions | 15% | $0 | ~80% per sale, but **income stops when downloads stop** |
| Weekly auto-find | MonoBoost (~$1.9M/yr est.), Subpilot, Feenko | **Likely 30% on new subs** once over $1M proceeds; weekly subs rarely reach the 15% year-2 rate | Bank data ~$0.30 per bank a month, servers, a Google email-security audit ($540–4,500/yr, `autosync.md`), support | ~60–65% before ads. Their 90–100% US users and weekly paywalls suggest heavy paid ads (AppKittie had no ad data) |
| Bank budgeting | Rocket Money ($7–14/mo) | 30%, then 15% after year 1 | Plaid-type data ~$0.30 per bank a month **for every linked user, free ones too**, plus staff and concierge cancelling | Unknown. A $7 Premium user with 2 banks costs ~$0.60 a month in data alone (~9% of the price) |
| Ditch "Auto-sync" (v3 idea) | — | 15% | ~$0.45–0.90 (1.5 banks) + a server | ~67–76% at $4.99/mo (DECISIONS bank-sync numbers) |

**Takeaway:** Ditch's margin is as good as it gets in this category. The weekly auto-find apps make more money per download (~$4 against ~$0.73) by charging much more and paying for bank data and ads. That model goes against our honesty rules and the target user's trust. Our lever is volume and conversion, not price.

---

## Sources
- AppKittie API: [List Apps](https://www.appkittie.com/docs/api-reference/apps/list-apps), [Get App Details](https://www.appkittie.com/docs/api-reference/apps/get-app.md), [Get App Countries](https://www.appkittie.com/docs/api-reference/apps/get-app-countries.md), [Onboarding Screens](https://www.appkittie.com/docs/api-reference/onboarding/list-onboarding-screens.md). Pulled Nov 10, 2026. Revenue and downloads are monthly estimates.
- AppKittie paywall captures:
  - ReSubs: [04](https://storage.appkittie.com/onboardings/app.resubs/04.jpg)
  - Feenko: [12](https://storage.appkittie.com/onboardings/com.app.fynk/12.jpg), [24](https://storage.appkittie.com/onboardings/com.app.fynk/24.jpg)
  - SubTracky: [05](https://storage.appkittie.com/onboardings/com.erenberkay.Subtracky-Subscription-Tracker/05.jpg)
  - Orbit: [05](https://storage.appkittie.com/onboardings/com.flooben.orbit/05.jpg), [07](https://storage.appkittie.com/onboardings/com.flooben.orbit/07.jpg)
  - Subtrack: [09](https://storage.appkittie.com/onboardings/com.mohitnandwani.subtrack/09.jpg)
  - Subpilot: [15](https://storage.appkittie.com/onboardings/io.zimran.subpilot/15.jpg)
- iTunes Search API: ["subscription tracker"](https://itunes.apple.com/search?term=subscription+tracker&entity=software&country=us), ["subscription manager"](https://itunes.apple.com/search?term=subscription+manager&entity=software&country=us)
- App Store pages (In-App Purchases lists), e.g. [SubGuard](https://apps.apple.com/us/app/id6786820661), [Ditchr](https://apps.apple.com/us/app/id6788658909), [Track My Subs](https://apps.apple.com/us/app/id6749513883), [Subtle](https://apps.apple.com/us/app/id6781251166), [Orbit](https://apps.apple.com/us/app/id6692620188), [Chronicle](https://apps.apple.com/us/app/id572561420), [Bobby](https://apps.apple.com/us/app/id1059152023), [MonoBoost](https://apps.apple.com/us/app/id6740202306), [Subpilot](https://apps.apple.com/us/app/id6751181747), [Rocket Money](https://apps.apple.com/us/app/id1130616675). Every other app: `apps.apple.com/us/app/id{ID}` with the ID from the tables.
- Rocket Money pricing (Jan 19, 2026): https://www.rocketmoney.com/learn/personal-finance/how-much-does-rocket-money-cost
- Apple Small Business Program: https://developer.apple.com/app-store/small-business-program/
- RevenueCat pricing: https://www.revenuecat.com/pricing/
- RevenueCat State of Subscription Apps 2026: https://www.revenuecat.com/state-of-subscription-apps-2026/ and https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026
- Refund benchmarks: https://www.mobilemarketingreads.com/?p=50360, https://adapty.io/blog/refund-rate-metrics-and-benchmarking/
- Expo/EAS pricing: https://expo.dev/pricing
- Epic v. Apple status: https://www.courthousenews.com/apples-fight-over-commissions-for-linked-out-app-store-purchases-continues-in-district-court/, https://www.techspot.com/news/112956-apple-fight-epic-over-app-store-fees-reaches.html
- Earlier Ditch research: `DECISIONS.md` (bank-sync costs, free-tier evidence), `niche-teardown.md` (country splits), `autosync.md` (robot cost, Gmail audit), `paywalls-competitors.md` (Rocket Money and Orbit paywalls), `pricing-regional-and-plans.md` (the 49% saving).
