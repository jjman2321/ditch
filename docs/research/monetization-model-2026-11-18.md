# Which money model makes Ditch the most? (Nov 18, 2026)

Pairs with `pricing-margins-2026-11-18.md`, `finder-apps-2026-11-18.md`, `monetization-2026-11-18.md`, `pricing-competitors-2026.md` and DECISIONS #63–65. **(Est.)** marks my own model numbers. AppKittie revenue and downloads are its estimates for the last month, App Store only, and they include renewals from older customers, so "revenue per download" flatters old apps (YNAB, Copilot). AppKittie: **7 credits** this round (1,844 → 1,851). Nothing here changes a locked decision until the owner says so.

## Short answer
- **Pick: a hybrid, 8.5/10.** Bank scanning is Pro, and you start the 7-day free trial to use it. The paywall shows **before** the bank connects, not after the results. The × is visible from the first frame and goes straight to a free **Lite** mode: unlimited tracking, totals, calendar, reminders on 3, and the on-phone finders (screenshot, statement, pick from 176). People who find their subs on the phone see a second, softer paywall right after their reveal.
- **Why before the scan:** every bank-scan app that earns more than $5 per download gates the finding (MonoBoost, Subpilot, Feenko, Copilot, Monarch). Each free bank scan costs us ~$0.45–0.75. Gating it keeps free users at $0 and moves the "we found 9" wow inside the trial, where it drives trial→paid.
- **Money (est.):** ~**$1.70–1.80 net per download in year 1**, against ~$0.85–1.00 for today's freemium with a free first scan. A hard paywall makes about the same (~$1.65–1.70) but breaks rule 4 and risks the rating.
- **Prices (updated for the owner's lean):** launch **$49.99/yr (7-day trial, pre-selected) · $7.99/mo · $99.99 lifetime**. That's ~+5% net per install over $39.99/$6.99/$89.99 in the middle case (range −6% to +13%), and lowering a price later is easier than raising it. Keep lifetime at 2× yearly: a yearly buyer pays ~1.6–2 years in total, so $99.99 beats the average yearly buyer. No weekly plan.
- **Margin:** 89–93% of what we keep after Apple, ~70% of what the customer pays. Both clear the 65% target.
- **Paid ads:** none of the models pays back a $4 US CPI in year 1. That needs ~11.5% of installs to pay (~26% trial starts). Start with Apple Search Ads when organic net per install is ≥ $2.

## 1. What each competitor does
Paywall screen = position in the first-run flow (AppKittie captures in `ux-overhaul/appkittie-onboarding/`, Mobbin, ScreensDesign). Rev, DL, $/DL = AppKittie, per month, Nov 10–18.
| App | Model | Paywall at | Trial · pre-selected | Prices (wk / mo / yr / lifetime) | Free forever | Exit offer | Rev / DL / $ per DL |
|---|---|---|---|---|---|---|---|
| **Rocket Money** | Freemium + paid concierge | Not in the 13-screen signup (account, notifications); Premium upsell comes after the bank link | 7 days · pay-what-you-want slider | — / $7–14 (IAPs $2.99–11.99) / web only / — | Bank link, subscription list, basic budget | None seen | $1.00M / 251k / $4.00 |
| **Copilot Money** | Hard (trial, then pay) | After signup, before the app (not in Mobbin's 23-screen capture, recorded with an active subscription) | 1 month | — / $18 in-app ($13 web) / $109 in-app ($95 web) / — | Nothing | — | $900k / 31k / $28.9* |
| **Monarch** | Hard | After signup | 7 days | — / $14.99 / $99.99 (Plus $199.99) / — | Nothing | — | $621k / 86k / $7.18 |
| **YNAB** | Hard (34-day trial, no card) | After signup | 34 days | — / $14.99 / $109 / — | Nothing after the trial | — | $1.00M / 10k / $100* |
| **MonoBoost** | Soft on paper, hard in practice (blurred dashboard, cancel locked) | After a ~10-screen quiz | None · weekly-first, **countdown timer** | $6.99–9.99 / $11.99–19.99 / $99.99 (quarterly $39.99) / — | Blurred list, guides | **Exit survey → "heavily discounted first week"** | $160k / 25.7k / $6.23 |
| **Subpilot** | Hard | **16 of 16** (quiz, email gate, "people like you have 11") | 3 days on weekly · **monthly $24.99** | $9.99 / $19.99–24.99 / $99.99 / add-ons $4.99–69.99 | Nothing | 2 timed upsells | $85k / 12.6k / $6.75 |
| **Feenko** | Soft, finding is paid | **13 of 25**, again at 25 | 3 days on 6-month · **weekly** on the first paywall, trial on the second | $9.99 / — / $39.99 per 6 months (~$80) / — | Manual add, browse | "Quick one, why not now?" sheet (on email connect) | $80k / 13.9k / $5.74 |
| **Orbit** | Freemium | **6 of 11** (after the notification ask), Free vs Plus table | None · yearly | — / — / $19.99 / $24.99–39.99 | 5 subscriptions | **"Lifetime early bird $24.99" on ×** | $2.4k / 6.5k / $0.36 |
| **Bobby** | One-time unlocks | In-app only | None | $0.99–2.99 once | 5 subscriptions | — | $32.6k* / 11.9k |
| **Subtrack** | Freemium, pay once | **10 of 11** (when you add a 4th sub) | None · lifetime $8.99 | — / — / — / $8.99 (family $14.99) | 3 subscriptions | "Relaunch offer" banner | $5.7k / 6.8k / $0.84 |
| **Chronicle** | Freemium | In-app | ? | — / — / $14.99 / — | Unlimited bills | — | $4.2k / 3.1k / $1.37 |
| **Hiatus** | Freemium, price tiers | In-app | ? | — / $9.99–20.99 / $35.99–59.99 / — | Bank-linked list | — | $11.1k / 7.4k / $1.49 |
| **SubSeek** | Weekly-first | ? | ? · weekly | $6.99–14.99 / — / $39.99–59.99 / — | ? | ? | $29.3k / 27.7k / $1.06 (**gone from the App Store**) |
| **Cancel Subscriptions & Refund** | Hard-ish, after a 9-screen quiz | After screen 9 ("personalizing 13%") | ? | $1.99–4.99 / $4.99–19.99 / $29.99–79.99 / $19.99 | Limited | ? | $30k / 5.6k / $5.37 |
| **SubTracky** | Soft | **6 of 6** (after notifications, empty home) | 3 days · **weekly**, trial toggle, "SAVE 90%" struck-through prices | $0.99 / $2.99 / $7.99 / $12.99 | ? | — | $4.3k / 9.0k / $0.47 |
| **ReSubs** | Soft | **5 of 5** | ? · yearly with **"-50% ENDS SOON"**, struck-through $35.98 | $1.99–4.99 / $3.99–7.99 / $17.99 / $39.99–49.99 | Unlimited subscriptions | — | $6.0k / 7.2k / $0.84 |
\* Renewal-heavy or unreliable: YNAB and Copilot earn mostly from older subscribers; Bobby's number is impossible at $0.99–2.99 one-time.

**Patterns**
1. **Every app above ~$5 per download gates the core value** behind a trial or payment: the bank finding (MonoBoost, Subpilot, Feenko, Cancel Subs) or the whole app (Copilot, Monarch, YNAB). **Every freemium or manual tracker sits under ~$1.50.** The one exception is Rocket Money, a 10M-user brand that earns from bill negotiation fees.
2. **The finders paywall before the scan, not after it.** Feenko (13 of 25) and Subpilot (16 of 16) sell the promise first. MonoBoost blurs what it found. Nobody hands out free bank results except Rocket Money.
3. **The tricks cluster in the low-rated apps:** weekly-first, countdowns, struck-through prices, exit discounts. MonoBoost's written reviews are 81% 1–2★ (finder doc). The budget apps (Monarch 4.89★, Copilot 4.75★, YNAB 4.79★) run hard paywalls with clean terms and plain yearly plans, and they keep top ratings. **Hard isn't what hurts ratings. Weekly plans, surprise charges and fake urgency are.**

## 2. Benchmarks: freemium vs hard vs hybrid
| Metric | Hard paywall | Freemium | Source |
|---|---|---|---|
| Download → paid by day 35 (median) | **10.7%** (top quartile >20%) | **2.1%** (top quartile >4.5%) | [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps-2026/) |
| Revenue per install, day 14 / day 60 | $2.32 / **$3.09** | $0.27 / **$0.38** | same |
| 1-year retention, yearly plans | ~27% | ~28% ("nearly identical") | same; [Airbridge](https://www.airbridge.io/en/blog/hard-paywall-vs-freemium-2026) |
| Refund rate | 5.8% | 3.4% | RevenueCat 2025 via Airbridge |
| Paywall view → trial | 4.7% | 3.2% (soft) | [Adapty State of Paywalls 2026](https://adapty.io/state-of-paywalls/report/) |
| Paywall view → direct purchase | 0.50% | 0.75% (soft) | same; hard wins on total in 57% of apps |
| Onboarding paywall vs later | $170 vs $40 per 1,000 views | — | same; yet 38% of revenue comes from later paywalls, 48% in Utilities |
| Trial → paid by trial length | ≤4 days 25.5% · 5–9 days **37.4%** · 17–32 days 42.5% | | RevenueCat 2026 |
| Day-0 trial cancels | 3-day 55% · 7-day 40% · 14-day 36% | | same |
| Download → trial, Utilities (incl. Finance) | 6.5% median (D30) | | [RevenueCat Utilities](https://www.revenuecat.com/state-of-subscription-apps-2026-utilities/) |
| US paywall view → paid | 2.75% median (−14% year on year) | | Adapty |
Finance isn't reported on its own: RevenueCat folds it into Utilities, and Adapty's 8 categories skip it. **Caveat:** the hard-paywall medians are partly a selection effect. Hard-paywall apps are often paid-ads funnels with quizzes, and organic searchers for "subscription tracker" often want a free app (1,068 look-alikes). I halve those medians for Ditch.

## 3. The four options, per 1,000 installs (est., at $39.99/$6.99/$89.99; $49.99 adds ~5%, see 6b)
Assumptions: 60% of installs in the US/Canada (bank scan available); 55% of those pick the bank; a bank scan costs $0.45–0.75 (1.5 banks, Plaid billed per Item per month); net per payer in year 1 = **$34.76** (70% yearly at $31.27 net, 18% monthly at 4.5 months = $24.60, 12% lifetime at $70.37; after Apple's 15%, ~8% VAT and refunds). Paying US users rescan 4× a year and 20% opt into sync. Fixed costs $400 a year.
| | 1. Freemium now (free first scan) | 2. Hard paywall, no free mode | 3. Hybrid A: free scan, dates locked | **4. Hybrid B: trial-gated scan (PICK)** |
|---|---|---|---|---|
| Trial starts | 5.5% | 15% | 10% | 9% |
| Trial → paid | 37% | 35% | 38% | **42%** (the wow happens inside the trial) |
| Direct + later buyers | 1.5% | 1% | 1.8% | 1.8% |
| Pay rate | 3.5% | 6.2% | 5.6% | 5.6% |
| Free users scanning a bank | 330 | 0 | 330 | 0 |
| Downloads lost to ratings / no-free ASO | 0 | ~15% | ~3% | ~2% |
| **Net per download, year 1** | **$0.86–1.00** | **$1.63–1.71** | **$1.47–1.63** | **$1.69–1.77** |
| Margin (after Apple) | 70–81% | 88–93% | 78–86% | **89–93%** |
| Ratings risk | Low | High (refunds ~1.7×) | Medium ("read my bank, then made me pay") | Low–medium |
| Rules it breaks | — | Rule 4 (× → free app), rule 6, "Free forever for tracking" | — (locking your own data feels like a hostage) | None |
**Why B beats A:** A gives free users the result (cost ~$0.20 per download) and then locks part of it, which reads as bait. B asks before we spend anything. Its wow lands during the trial, and the people who connect a bank are the ones most likely to pay.

## 4. The recommended model, ready to build
**Free (Lite), forever:** unlimited tracking, real totals, calendar, Ditched list, cancel help, export, reminders on 3 (trial alerts count), and **the on-phone finders**: Apple-subscriptions screenshot, statement PDF/CSV, pick from 176. Never delete or hide data when Pro lapses (rule 6).
**Pro (trial or paid):** **bank scan** (US/Canada; rescan anytime; "watch for new subscriptions" sync opt-in, yearly and monthly only), reminders on everything with custom lead times, price-rise alerts, the 30-day yearly warning, cheaper-plan check, widget, iCloud backup. Lifetime gets one bank scan a year and no sync (#65).

**Placement in v16** (screen numbers count every screen from the first):
| # | Bank path (US/CA) | On-phone path (or outside US/CA) |
|---|---|---|
| 1–4 | Welcome, then the 3-slide hook | same |
| 5 | Where should we look? (bank row loses "First scan free" and gains "Free for 7 days with Pro") | same, then screenshot / statement / pick |
| 6 | We look once, then let go (trust) | Import and check |
| **7** | **Paywall A, "Find yours in about a minute."** The checklist names the bank scan first. × → Lite, and the screenshot route opens | Reveal (full results, never locked) |
| 8 | Plaid sign-in → scanning → disconnect | Reminders ask |
| 9 | Reveal: "We found 9" (Pro, so everything is shown) | **Paywall B, "Get a reminder before all 9 renew."** (v16 screen 7, personalised; free covers 3) |
| 10 | Reminders ask → You're set (reminders on all 9, trial end date shown) | You're set (3 covered, Swap) |
Only one paywall shows per first run. Later paywalls follow the existing rule (max 1 unprompted a day, never at launch or during the Ditched moment): a 4th reminder, "Scan my bank" from the + button, and a trial found with no free slot.

**Honesty check:** a "hard-ish" model fits rules 4 and 5 as long as only the *costly feature* is gated, never the app. The × is 44pt and visible from frame one, with no delay; 22% of apps delay it ([Adapty](https://adapty.io/state-of-paywalls/report/)), and we don't. It leads to Lite with no second sheet. The line under the button stays "$0 today · $49.99/yr from Sat, Dec 20 · Cancel anytime". No timer, no struck-through price, no trial toggle. Plaid's own screens still name Plaid (#64).
**Trial:** **7 days** on Yearly (5–9 days convert 37.4% vs 25.5% for ≤4 days; 40% vs 55% day-0 cancels). Test 14 days once ~400 trial starts per arm are possible. Since each trial scan costs about $0.60, longer trials cost nothing extra in bank fees.
**Pre-selected:** Yearly. With annual pre-selected, 46% of buyers pick it; with weekly pre-selected, 90% pick weekly (Adapty). Monthly has no trial. Lifetime sits third, never pre-selected, at 2× yearly (see 6a).
**Weekly: no (3/10).** Weekly plans make 55–62% of app revenue (Adapty), but in this niche they produce the "scam" reviews. Our yearly at $3.33 a month already undercuts every finder's weekly.
**Win-back and exit offers (Apple-safe):** no offer on × (rule 4; Adapty's "second-chance" paywalls only convert 0.88× the main one anyway). After launch: (1) **win-back offers** for lapsed subscribers, set up in App Store Connect and shown by Apple on iOS 18+ with no server, e.g. first year $24.99 ([Apple](https://developer.apple.com/documentation/storekit/supporting-win-back-offers-in-your-app)); (2) **offer codes** for creators and launch weekends ([Apple](https://developer.apple.com/documentation/storekit/supporting-offer-codes-in-your-app)); (3) **promotional offers** are now possible because the Plaid backend exists: Supabase signs them for a monthly→yearly switch after 2 paid months. Keep discounts ≤30% (Adapty: ≤30% off keeps 90% of revenue; >60% off keeps 46%). An honest trial-ending card on day 5 sums up what Pro did ("reminded you 4 times, found 2 trials").
**Trial abuse:** someone can start the trial, scan and cancel the same day. They keep their list (rule 6), and it costs us ~$0.60. That's priced into option 4. Limit it to one trial scan per Apple ID (intro-offer eligibility), and allow rescans only while subscribed.

## 5. Year 1 (est.; organic downloads: bear 4k, base 20k, bull 55k)
| Model | Bear | Base | Bull |
|---|---|---|---|
| 1. Freemium now | ~$3.5k | ~$18.6k | ~$51k |
| 2. Hard paywall | ~$6.5k | ~$33k | ~$92k |
| 3. Hybrid A | ~$6k | ~$31k | ~$85k |
| **4. Hybrid B (pick)** | **~$6.5–7k** | **~$34–35k** | **~$95k** |
Year 2 adds ~28% yearly renewals ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2026/)), which takes 2-year value to ~$41 per payer. **Margin:** worst case, where every yearly payer syncs all year at $9 a year, is still 73% of what we keep after Apple (pricing doc: 62–71% on the customer's price). The blend is 89–93%. Plaid has no minimum on pay-as-you-go, Supabase is $25 a month, and the Apple account is $99 a year.

## 6. Pricing: $49.99 yearly, lifetime, and where Ditch sits
### 6a. Lifetime economics (owner: "lifetime ≈ 2 years of yearly")
Yearly renewals: RevenueCat 2026 puts the **first annual renewal at 23–40% by category** (Productivity 23%, Business 40%), the 2nd at 44–64% and the 3rd at 56–70% ([SOSA 2026 part 2](https://www.revenuecat.com/sosa-2026-insights-part-2)). Finance isn't listed; utilities sat at 23% in RevenueCat's older table ([renewal rates](https://www.revenuecat.com/blog/growth/average-subscription-renewal-rates-by-app-category/)). Net = after Apple's 15% and ~8% VAT and refunds, minus bank pulls: yearly payers ~$2.30 a year (60% US × 4 rescans + some sync), lifetime ~$1.80 over 5 years (1 scan a year, #65).
| | Paid years (5-yr) | Net value of one buyer |
|---|---|---|
| Yearly $39.99, low renewals (28 → 50 → 60 → 65%) | 1.56 | **$45** |
| Yearly $39.99, high renewals (40 → 64 → 70 → 72%) | 1.96 | **$57** |
| Yearly $49.99, low / high | 1.56 / 1.96 | **$57 / $72** |
| Lifetime $79.99 · $89.99 · **$99.99** · $129.99 | 1 payment | **$61 · $69 · $76 · $100** |
**The owner's instinct holds:** a yearly buyer pays for **~1.6–2.0 years** in total, not forever. So lifetime at **2× yearly ($99.99)** is worth more than the average yearly buyer ($57–72) and brings the cash in on day 0, which helps an ads payback later.
**Cannibalisation (est.):** no benchmark measures it directly.
- Adapty: 14% of apps sell lifetime, typically at 1.3× yearly, and it makes ~5.6% of revenue in the apps that offer it ([State of Paywalls](https://adapty.io/state-of-paywalls/report/)).
- RevenueCat's examples run from 2× to 12× yearly ([Airbridge](https://www.airbridge.io/en/blog/should-you-offer-a-lifetime-subscription)), with a warning when lifetime passes 20–30% of revenue.
- Subscription-tired buyers in this niche pick it more often (Subtrack and Orbit pre-select it).

My share estimates per 100 buyers, with $49.99/yr and $7.99/mo alongside, and 25–50% of lifetime buyers being extra people who'd never subscribe:
| Lifetime | × yearly | Buyers picking it | Revenue vs no lifetime |
|---|---|---|---|
| $79.99 | 1.6× | ~15% | +3% to +11% (the weakest when renewals are high) |
| $89.99 | 1.8× | ~12% | +4% to +10% |
| **$99.99** | **2.0×** | **~9%** | **+4% to +9%** |
| $129.99 | 2.6× | ~5% | +4% to +7% |
**Call: keep lifetime and raise it to $99.99 (8/10).** Dropping it gives up 4–9% of revenue and the "no subscription to track subscriptions" buyer (5/10). $79.99 cannibalises the most (6/10). $129.99 is safe but sells little (6.5/10).
- **Placement:** the third card on the main paywall, never pre-selected, labelled "Pay once".
- **Not as an exit offer:** that breaks rule 4, and it's Orbit's move.
- Re-check after ~300 purchases: if lifetime is over 20% of revenue, raise it to $129.99; if under 3% of purchases, try $79.99.
- On the owner's "10–30 lifetime subs": the base case (20k downloads, ~1,000 buyers) gives ~90 lifetime buyers in year 1.

### 6b. $49.99 yearly with $7.99 or $8.99 monthly (est., Hybrid B, per install)
The paywall says "$0 today", so the higher price mostly bites at trial→paid. I assume trial starts fall 2–10% and trial→paid falls 3–12%. **Break-even for $49.99 is a 20% drop in payers.**
| Prices (yr / mo / lifetime) | Payers vs today | Net per install, yr 1 | 2-year | Score |
|---|---|---|---|---|
| $39.99 / $6.99 / $89.99 | — | $1.79 | $2.19 | 7.5 |
| **$49.99 / $7.99 / $99.99** | −5% / **−13%** / −21% | $2.03 / **$1.87** / $1.69 | $2.52 / **$2.31** / $2.09 | **8.5 (pick)** |
| $49.99 / $8.99 / $99.99 | −6% / −14% / −23% | $2.05 / $1.88 / $1.68 | $2.54 / $2.32 / $2.08 | 7.5 |
| $59.99 / $8.99 / $129.99, 14-day trial | −25% | $1.93 | $2.40 | 6 |
- **Why launch at $49.99:** the expected gain is +5% in year 1 (+13% if mild, −6% if harsh) and more in year 2.
- It's still half the finders' $99.99.
- **Testing down is easy and testing up is not.** Lowering a price is just a setting in App Store Connect. Raising it on existing subscribers needs notices and sometimes their consent ([Apple](https://developer.apple.com/help/app-store-connect/manage-subscriptions/manage-pricing-for-auto-renewable-subscriptions)).
- If trial→paid comes in under 35% after ~400 trials, test $39.99.
- **$7.99 over $8.99:** they earn the same, but $7.99 stays under Rocket Money's $7–14 and the NA median ($9.99). Yearly is still "save 48%" ($95.88 vs $49.99) and "$4.17 a month".
- **Margin at $49.99:** 90–94% of what we keep after Apple. The worst case (every yearly payer syncing all year) is ~78%.

### 6c. Pricing position at $49.99 / $7.99 / $99.99 (old $39.99 / $6.99 / $89.99 in brackets where the call changes)
| Competitor | Yearly vs Ditch $49.99 | Monthly vs $7.99 | Weekly (Ditch none) | Lifetime vs $99.99 |
|---|---|---|---|---|
| Rocket Money | web only | **same/cheaper** ($7–14) | — | — |
| Copilot | **cheaper** ($109 in-app) | **cheaper** ($18) | — | — |
| Monarch | **cheaper** ($99.99) | **cheaper** ($14.99) | — | — |
| YNAB | **cheaper** ($109) | **cheaper** ($14.99) | — | — |
| MonoBoost | **cheaper** ($99.99) | **cheaper** ($11.99–19.99) | $6.99–9.99 | — |
| Subpilot | **cheaper** ($99.99) | **cheaper** ($19.99–24.99) | $9.99 | — |
| Feenko | **cheaper** (~$80 via 6 months) | — | $9.99 | — |
| Hiatus | **same** ($35.99–59.99) | **cheaper** ($9.99–20.99) | — | — |
| SubSeek (removed) | **same** ($39.99–59.99) | — | $6.99–14.99 | — |
| Cancel Subs & Refund | **same** ($29.99–79.99) | **same** ($4.99–19.99) | $1.99–4.99 | **pricier** ($19.99) |
| Subtle (screenshot import) | **pricier** ($39.99) [was same] | **pricier** ($6.99) [was same] | — | **same** ($99.99) |
| Orbit | **pricier** ($19.99) | — | — | **pricier** ($24.99–39.99) |
| ReSubs | **pricier** ($17.99) | **same** ($3.99–7.99) | $1.99–4.99 | **pricier** ($39.99–49.99) |
| Chronicle | **pricier** ($14.99) | — | — | — |
| SubTracky | **pricier** ($7.99) | **pricier** ($2.99) | $0.99 | **pricier** ($12.99) |
| Subtrack / Bobby | — | — | — | **pricier** ($8.99 / $0.99–2.99) |
**Read:** the NA median is $39.99 yearly and $9.99 monthly ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2026/)). At $49.99, Ditch sits **25% above that yearly median, half the bank finders and budget apps** ($99–109), level with the bank-linked mid-tier (Hiatus, SubSeek, Cancel Subs), and 2.5–6× the manual trackers. That fits an app that scans your bank.
**Willingness to pay:**
- Hiatus already sells $35.99–59.99 yearly tiers for bank-linked tracking.
- Subpilot sells its trial detector alone for $39.99–69.99.
- The finders sell $99.99 a year to the same 25–44 iPhone user.

## 7. Paid ads readiness (US finance CPI ≈ $4 on Meta/TikTok)
Payback in year 1 needs net per install ≥ $4, so **~11.5% of installs must pay** at $39.99 ($4 ÷ $34.76), **~10% at $49.99** (~$40 net per payer). Over 2 years it's ~8.5–9.8%.
| Model | Needs | Realistic? |
|---|---|---|
| Freemium | 11.5% pay | No: the freemium top quartile is 4.5% |
| Hard paywall | 11.5% pay, i.e. ~30% trial starts at 35% | The median hard app (10.7%) only just breaks even |
| **Hybrid B** | **~26% trial starts at 42% conversion**, or ~24% at 45% | Top-quartile territory; plan on 9–12% organic |
| Any model + Apple Search Ads (est. $1.5–3 CPI, no SDK) | 4–9% pay | **Yes, test first** once organic net per install ≥ $2 |
Also count the extra ~$0.30–0.50 of bank fees per ad-driven trial. A US web checkout through Apple's external purchase link (allowed in the US storefront since May 2025; confirm current terms) would lift net per payer ~12% and lower these thresholds. Meta and TikTok need an attribution SDK, which changes the privacy label. Decide that later.

## 8. Decisions this would change (owner to OK)
#24 freemium → hybrid; #63/#34 "first scan free" → bank scan with the trial, on-phone imports stay free once; #6 and #65 prices → $49.99/$7.99/$99.99; #29/#35 unchanged (× kept); v16 screens 5 and 7, plus a new Paywall A. Testing order: (1) PPO store copy, (2) $49.99 vs $39.99 (only if trial→paid < 35%), (3) 7 vs 14 days, (4) Paywall A before the scan vs after a free scan with locked dates (only if Plaid's real price turns out to be <$0.25).

## Caveats
- AppKittie figures are estimates and App Store only (no web sales). Finder revenue is bought with ads.
- Paywall positions for Copilot, Monarch, YNAB, Rocket Money, Bobby, Chronicle, Hiatus and MonoBoost aren't in AppKittie's onboarding library (0 results); they come from Mobbin, ScreensDesign and vendor or review pages ([Monarch/YNAB/Copilot pricing](https://www.asianefficiency.com/technology/copilot-money-vs-monarch-vs-ynab/), [MonoBoost on ScreensDesign](https://screensdesign.com/showcase/monoboost-cancel-subscriptions)).
- All Ditch conversion rates are my estimates. Plaid prices come from third parties.

Sources: [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps-2026/), [RevenueCat Utilities](https://www.revenuecat.com/state-of-subscription-apps-2026-utilities/), [RevenueCat trial length](https://www.revenuecat.com/blog/growth/free-trial-length), [Adapty State of Paywalls 2026](https://adapty.io/state-of-paywalls/report/), [Adapty SOIS 2026](https://adapty.io/state-of-in-app-subscriptions-report/), [Airbridge hard vs freemium](https://www.airbridge.io/en/blog/hard-paywall-vs-freemium-2026), [RevenueCat hard vs soft](https://www.revenuecat.com/blog/growth/hard-paywall-vs-soft-paywall), [Apple win-back](https://developer.apple.com/documentation/storekit/supporting-win-back-offers-in-your-app), [Apple offer codes](https://developer.apple.com/documentation/storekit/supporting-offer-codes-in-your-app), [Semnexus CPI](https://semnexus.com/cpi-benchmarks-app-category-platform-2026/), AppKittie `/apps/{id}` and `/onboarding/screens`, iTunes IAP lists, [Mobbin Copilot onboarding](https://mobbin.com/flows/92d7d390-97fc-485a-8fab-d9cf1acbd632).
