# Why can't Ditch do what MonoBoost, Subpilot and Feenko do? (Nov 18, 2026)

Pairs with `demand-2026-11-18.md`, `monetization-2026-11-18.md` and `find-subs-2026-11-16.md`. AppKittie: 9 credits (1,822 → 1,831). Reviews: 450 US App Store reviews (150 each for MonoBoost, Subpilot and Feenko) from Apple's review RSS, pulled Nov 18 and read by hand plus keyword tags. **(Est.)** marks my own model numbers. Nothing here unlocks a DECISION until the owner says so.

## Short answer
1. **They don't have magic.** Each one connects the user's bank through **Plaid**, plus Gmail or Outlook. Subpilot also logs into some of your accounts to cancel them. Everything runs through their own servers, and all three show "Data Used to Track You" on their App Store privacy labels.
2. **The revenue is bought, not organic.** All three show signs of paid ads, web checkouts and attribution tools (Meta and TikTok pixels, Adjust, 173 Meta ads for Feenko). AppKittie's ~$80–160k a month covers **App Store revenue only**. It also mixes in renewals from older customers, so "$6 per download" overstates what one new install earns.
3. **Their written reviews are rough.** In MonoBoost's last 100 written reviews, **81% are 1–2★**. About **38%** complain about being charged, scammed, unable to cancel or wanting a refund, and **26%** say "it doesn't cancel for me". Feenko is at ~29% 1–2★ (~16–20% about charges). Subpilot is at ~10% 1–2★ because it asks for ratings right after a cancel works. **SubSeek is gone from the App Store** in every country I checked.
4. **Ditch can copy the money part (the paywall), not the finder part (bank and email).** Bank sync and real cancelling need a server, a new privacy label, months of work and paid ads to pay off. Gmail needs a yearly Google security audit.
5. **Maximum-revenue pick (8/10):** a **trial-first paywall right after the total reveal or the find results**, with the **found subscriptions' dates and trial-end dates locked behind Pro**. × stays and leads to a **free "Lite" mode** with unlimited manual tracking and reminders on 3. Estimate (est.): **~$1.6–1.8 net per download in year 1**, against ~$0.8–1.05 now. That's about 2× today's money with much less rating risk than a full hard paywall.
6. **"Turn Ditch into a finder app" (bank/email + cancel-for-you + weekly + ads): NO-GO, 3/10.** "Finder-style money on top of our on-phone finder": **GO, 7.5/10.**

## 1. How each app really "finds" and "cancels"
| App (id) | How it finds | "Cancels for you"? | Privacy label (App Store, Nov 18) | Company |
|---|---|---|---|---|
| **MonoBoost** (6740202306) | **Plaid** bank link (privacy policy v7; reviews: "my credit union isn't listed with Plaid", "Forced to use Google"). Optional Gmail "Email-Based Subscription Detection". The description says "automatic subscription detection" is Premium | **Mostly guides.** 26% of recent written reviews: "it tells you to do it yourself", "AI generated instructions". The policy covers processing "account credentials" for unsubscribe requests | Tracking: Contact Info. Linked: **Financial Info**, email, IDs, usage, ads data | Mnboost Corp (registered-agent address in Las Vegas); Amplitude analytics |
| **Subpilot** (6751181747) | **Plaid** (bank) + **Gmail** (Google) + **Outlook via Nylas**. Also "Olivia", an AI that watches your shared screen through Google Vertex/Gemini | **Partly real.** "Cancel For Me" runs through "automated systems" acting as your "limited authorized agent". It logs into your accounts using one-time codes and doesn't store passwords. It also files refund requests and negotiates bills (one review: 40% of the savings). For the rest it falls back to manual guides | Tracking: Identifiers. Linked: contact, user content, IDs. **No Financial Info declared despite Plaid** (looks under-declared) | Policy: Suberlis Tech Corp, Dover DE. App Store seller now **LINERIOS LIMITED**. Legal pages sit on finelo.com (Zimran/Finelo) |
| **Feenko** (6747262759) | "Scans your bank transactions" (description) + email (reviews: "connected my email", "doesn't support Yahoo") | Says "cancel, or renegotiate". Reviews: "I have to do lots of the work" | Tracking: Identifiers and Usage. Linked: **Financial Info**, email, IDs. Rated 17+ | GotYourBack Technologies LTD; Adjust attribution |
| **SubSeek** (6769329967) | Email, with bank "coming soon" (Nov 10 table). The description is manual tracking plus refund guidance | Guides only | n/a | BEGAMOB. **Not found in iTunes Lookup for US, GB, CA, AU, DE, FR, IN, JP or VN on Nov 18, and the developer lists no apps.** Cause unknown (pulled or removed) |
| Rocket Money | Its own bank aggregation (Plaid history) | **Human concierge** (Premium $7–14/mo). Bill negotiation takes **35–60% of first-year savings** | Linked: Financial Info, etc. | Rocket Companies |
So "finds your subscriptions" = **bank link (Plaid) + email scan on a server**. Nobody has a secret on-phone trick. "We cancel for you" = **guides at MonoBoost, Feenko and SubSeek**. Subpilot does real but partial automated cancelling, using your account access, with extra fees on top.

## 2. Funnel and monetization
| | MonoBoost | Subpilot | Feenko | SubSeek |
|---|---|---|---|---|
| Plans (US App Store) | Weekly $6.99–9.99 (IAPs named "90% off", "70% off"), monthly $19.99, quarterly $39.99, yearly $99.99 | Weekly $9.99, monthly $24.99, annual $99.99. **Add-ons:** 1 auto-cancel $4.99, 5 for $17.99, "Free Trial Detector" $39.99/49.99/69.99, Concierge Pro $59.99 | Weekly $9.99, 6 months $39.99, "AI Advisor" $9.49/mo | Weekly $6.99–14.99, yearly $39.99–59.99 |
| Paywall | After a long quiz, a "soft" paywall with weekly/monthly/yearly and a **countdown timer**. Closing it triggers an exit survey, then a discounted first week. The dashboard is blurred and "Cancel For Me" is locked (screensdesign) | "Access to the app requires a subscription" (description). Quiz → savings graph → email connect → paywall (3-day trial on monthly, or yearly) → **2 timed upsells** before home | Hard paywall ("subscribe just to see if they can help") | Weekly-first |
| Web funnel | Reviews: "signed up for App before I downloaded App", "the website is not user friendly", $39.99 monthly charges | **quiz.subpilot.tech** + getsubpilot.finelo.com, paid through SolidGate/PayPal. **9,077 Trustpilot reviews in 12 months** (4.4★) suggests big web sales on top of the App Store | Instagram ad → pay on the web → "app asks me to pay again" | — |
| Ads | 15 of 100 recent written reviews mention ads ("an ad while playing Words With Friends", "not like the ads") | Meta pixel, TikTok pixel, Google Ads, Amplitude (privacy policy) | **173 Meta ads** indexed (AppKittie), Adjust tracking links, active since ~Jul 2026 | — |
| AppKittie: App Store rev / DL a month, 90-day trend | $160k / 27.8k, rev **−47%** | $85k / 11.9k, rev **+70%** | $80k / 13.9k, rev −20% | $30k / 28.3k |
AppKittie leaves `meta_ads_estimated_spend_30d_usd` and `tiktok_ads_total_count` empty for all four, and `organic_sources` is empty too. **Spend estimate (est.):** US iOS non-gaming CPI on Meta is ~$3.50–6.50, with finance at the top of that range or above ([Semnexus 2026](https://semnexus.com/cpi-benchmarks-app-category-platform-2026/), vendor data). 12–28k downloads a month, mostly paid, works out to **~$40–180k a month of ads against $80–160k App Store revenue plus unseen web revenue**. These are ad-bought businesses that earn their margin from weekly renewals and upsells.

## 3. Reviews (100 most recent written US reviews each; tags overlap; tagged by keyword, then checked by reading)
| Theme | MonoBoost (Mar 21–Nov 12) | Subpilot (Nov 2–17) | Feenko (Apr 22–Nov 16) |
|---|---|---|---|
| Average of written reviews (overall App Store rating) | **1.7★** (4.37★, 6.5k ratings) | 4.2★ (4.58★, 6.7k) | 3.6★ (4.16★, 1.6k) |
| 1–2★ share | **81%** | 10% | 29% |
| "It actually found my subs" | ~5% | ~12% ("identified over $100 a month") | ~4% |
| Scam / charged / can't cancel / refund | **~38%** | ~10% (surprise add-ons: "$20 became $109", "$49.99 reminder service") | **~16–20%** ("still charged after cancel", "charged twice") |
| "Doesn't cancel for me" / not as advertised | **~26%** | ~4–6% | ~3% |
| "Didn't find anything" | ~9% | ~1% | ~1% |
| Bank link broke / bank not listed / email limits | ~7% (Plaid, "Google only") | ~1% ("only Gmail or Outlook") | ~1% (Yahoo) |
| Privacy worry | ~7% ("went for my bank login… fishy") | ~1% | 0 |
- **The gap between the overall rating and the written-review average** comes from in-app rating prompts at a happy moment, which collect stars without text. That's legal, and Ditch already plans it (#38).
- **Regulators:** I found no FTC, state AG or BBB action against these four. But the **FTC's June 2026 suit** against an 8-app web-funnel network (Genesis Tech: Wisey, MadMuscles, Nebula, PDF Guru… "nearly a quarter billion dollars", ROSCA) targets this exact pattern: hidden renewals, extra products added at checkout, charging after a cancel ([FTC](https://ftc.gov/news-events/news/press-releases/2026/06/ftc-sues-stop-sprawling-enterprise-operating-unlawful-subscription-schemes)). Click-to-cancel was revived in Mar 2026.

## 4. Can Ditch do the same? (scores out of 10: higher = better for Ditch)
| Option | Money | Effort with Claude | Cost | Risk | App Review | Overall | DECISIONS it changes |
|---|---|---|---|---|---|---|---|
| **(a) Hard paywall + weekly on our on-phone finder** | 7 | 8 (paywall code only) | 10 | 4 (ratings, refunds) | 8 | **6.5** | #11, #24, #29/#35 (× → free app), #51 Welcome line, #53 free Lifetime weekend, CLAUDE.md rules 4 and 6, "no weekly" |
| **(b) Gmail/Outlook receipt scanning** | 6 | 3 | 5 | 5 | 7 | **5.0** | #2 v1 scope, #63, find-subs "skip Gmail"; label stays "Not Collected" only if mail never leaves the phone (unverified) |
| **(c) Bank sync (Plaid, MX, Teller…)** | 7 (US only) | 2 | 3 | 3 | 7 | **4.0** | #2, #59 label, #6b, CLAUDE.md "no backend, no bank link" |
| **(d) Paid ads to scale** | 3 now, 6 if net per install ≥ $3 | 6 | 2 | 4 | 9 | **3.5 now** | #18 organic first; CLAUDE.md "no analytics…" if an attribution SDK is added |
| **(e) Real cancel-for-you** | 6 | 1 | 2 | 2 | 5 | **2.0** | CLAUDE.md rule 5 "never claim", #2, #59, needs a server and staff |
| (e′) Honest version: the exact cancel page, "Your rights", ready-to-send cancel emails, all on the phone | 5 | 8 | 10 | 9 | 10 | **8.0** | none (#41, #60 already) |

**(a) Can our finder give the "wow, it found 7" moment?** Partly (6.5/10).
- The Apple subscriptions screenshot usually shows 3–6 subscriptions. A bank app's Recurring page (Apple Card, Chase, Capital One, Revolut, Monzo) can show 6–12.
- It takes 2–3 minutes of the user's own effort, against ~60 s for Plaid.
- Upside: no "my bank isn't listed" failures (7% of MonoBoost's complaints) and no "they want my bank login" fear (7%).
- Downside: a statement CSV is too much friction on an iPhone to be the wow.
- **The trial-end date is our best hook.** It's exactly what Subpilot sells for $39.99–69.99.

**(b) Gmail.** Google lists **no on-device exemption** on its 2026 verification pages. Restricted scopes (gmail.readonly) need OAuth verification (privacy policy, demo video, Limited Use) and a **CASA assessment every year** (AL1/AL2) ([Google](https://support.google.com/cloud/answer/13465431), [exemptions](https://support.google.com/cloud/answer/13464323)).
- Assessor fees: ~$540–1,800 (TAC Security, Tier 2) up to $15–75k through consultants; 2–8 weeks plus Google's queue ([Switch Labs](https://www.switchlabs.dev/post/casa-tier-2-tier-3-security-review-providers-pricing-and-the-cheapest-option), 2024 prices).
- Apps under 100 users skip verification, which is useful for a test only.
- **Outlook (Microsoft Graph `Mail.Read`, delegated):** users can approve it themselves. Publisher verification is free and there's no paid audit. But few of our 23–40 iPhone users use Outlook, and iCloud Mail has no API.
- Verdict: v2 at the earliest, only if screenshot finding converts.

**(c) Bank sync.**
- **Plaid** doesn't publish pay-as-you-go prices; you see them in the Production access form. Transactions and Recurring are monthly per-Item fees, charged even when a link is broken. Third parties say ~$0.30 per Item a month. Pay-as-you-go has no minimum; Growth has an annual minimum. **Europe: custom plans only** ([Plaid](https://support.plaid.com/hc/en-us/articles/16110502116887), [billing](https://plaid.com/docs/account/billing/)).
- Recurring detection is US/CA only. A server is required (tokens can't live on the phone). Label → "Data Linked to You: Financial Info".
- **MX, Finicity, Akoya:** quotes from sales only. **Teller:** $0.30/enrollment, no recurring API. **FinanceKit** is the only on-phone, label-safe route (US Apple Card plus some UK banks, needs approval).
- Rocket Money uses its own aggregation at a 10M-user scale.
- Cost at 1,000 US payers: ~$450–600 a month plus a server (find-subs Nov 16). Verdict unchanged: v3 paid add-on at most.

**(d) Ads.** The math only works if **year-1 net per install ≥ CPI**.
- US iOS finance CPI is ~$4–8 on Meta. Apple Search Ads exact-match might be ~$1.5–3 (unverified).
- Ditch's net per install: ~$0.8–1.05 now, ~$1.6–1.8 with the pick. **So Meta ads lose ~$2–6 per install in year 1.**
- The finder apps make ads pay through weekly plans, $99.99 yearlies and $40–70 add-ons. Those are the moves that produce their 38% scam complaints.
- Test Apple Search Ads only (no SDK) after ~1,000 organic installs show net per install ≥ $2.

**(e) Cancel for you.**
- Real cancelling means signing into the user's accounts (one-time codes, stored sessions) on a server, or paying human agents like Rocket Money's concierge. Both carry liability and break other services' terms.
- Ditch would need a server, staff and security work, and would lose "Data Not Collected".
- Even Subpilot falls back to guides. MonoBoost's "cancel" promise is its #1 complaint.
- Ditch's honest version (e′) gets most of the value.

## 5. Maximum-revenue model for Ditch
Benchmarks:
- RevenueCat SOSA 2026, download→paid by day 35: hard paywall **10.7%** vs freemium **2.1%**. Revenue per install by day 60: **$3.09 vs $0.38**.
- Yearly-plan retention at 1 year: 27% vs 28%.
- Refunds (2025): hard 5.8% vs freemium 3.4% ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2026/), [Airbridge summary](https://www.airbridge.io/en/blog/hard-paywall-vs-freemium-2026)).
- These medians are partly selection effects. Ditch's organic searchers often want a free tracker (1,068 look-alikes).

Net per download in year 1 is my estimate: Apple 15%, VAT, refunds; ~$28–32 net per payer.

| # | Design | Funnel (est.) | Net per download, yr 1 (est.) | Ratings risk | Changes |
|---|---|---|---|---|---|
| 1 | **Current:** soft paywall, unlimited tracking, 3 free reminders, first import free | 3.3–4.3% pay | **$0.80–1.05** | Low | — |
| 2 | **Hard paywall** after the total reveal or find results: 7-day trial on yearly $39.99, weekly $4.99 (no trial), lifetime $59.99, no free mode | 12–16% start a trial, ~32% convert, plus weekly buyers → 6–8% pay | **$1.8–2.4** (downloads −10–20% as ratings and "free" ASO suffer) | **High.** Hard-paywall trackers run ~40% recent 1–2★; refunds ~1.7× | #11, #24, #29/#35, #51, #53, rules 4 and 6, "no weekly" |
| 3 | **Locked find results** inside today's soft model: count, logos and yearly total shown; dates, trial ends and "Add all" are Pro | Scanners convert ~8–12% vs ~3% | **$1.2–1.4** | Medium ("they read my screenshot, then made me pay") | #16, #34 first import free |
| 4 | **Hybrid (PICK):** full-screen trial-first paywall after the reveal or find results (yearly $29.99→test $39.99, 7-day trial pre-selected; monthly; lifetime). Find results show count, logos, total and **"2 trials end soon"**; **dates, trial ends and Add all are Pro**. × (44pt, first frame) → **Lite**: unlimited manual tracking, totals, calendar, reminders on 3 | 85% see it, 9–12% start a trial, 35–40% convert, plus ~2% later → 5.5–6.5% pay | **$1.6–1.8** | Medium-low (honest ×; rating prompt after the first reminder or ditch) | #16/#34, #24 (freemium → hybrid), #29/#35 layout (× kept), #6 if $39.99 wins; rules 4 and 6 still hold |

**Pick #4 (8/10).** It earns ~85–90% of a hard paywall's money while keeping the rating, the "free" ASO and the Free Lifetime weekend. Apple-safe:
- 3.1.2: price and renewal next to the button; Restore; no "90% off" names, no timers, no exit-offer pop-up.
- 2.3.1: copy says "You show us the list".
- Locked dates are real data from the user's own screenshot, shown as locked, never faked.

Weekly plan: **5/10**. It pays with ad traffic, but organic users read it as "a subscription to cancel subscriptions". Test it only if Lite converts under 4%. Free reminders 3 → 1 adds ~7%, within noise (monetization doc), and loses the first-reminder rating prompt: no.

## 6. Plan and money
- **Now (before launch, ~1–2 weeks with Claude):**
  - Design #4: trial-first paywall after the reveal and the find results, locked dates and trial ends, Lite after ×.
  - Make "screenshot your bank's Recurring page" the main find route (it's the biggest wow).
  - Add the honest cancel kit (e′).
  - Product Page test: "Find the subscriptions you forgot" vs "Track every subscription free".
- **v1.1 (after ~1,000 installs):**
  - $29.99 vs $39.99 yearly test.
  - Win-back offers and offer codes.
  - Small Apple Search Ads test only if net per install ≥ $2.
  - Weekly-plan test only if pay rate < 4%.
- **v2:** FinanceKit; Outlook on the phone if users ask; Gmail only with a CASA budget and proof that finding drives purchases.
- **v3:** Plaid as a separate paid "Auto-sync" (#6b), US only, 500+ payers first.

Year-1 net revenue (est.; organic downloads year 1: bear 4k, base 20k, bull 55k, per the demand doc):
| | Bear | Base | Bull |
|---|---|---|---|
| Today's plan (#1) | ~$2–4k | ~$16–21k | ~$60k |
| **Pick (#4)** | ~$6–7k | **~$32–36k** | ~$90–100k |
| Hard paywall + weekly (#2) | ~$6–8k (ratings risk) | ~$31–41k | ~$85–110k |
| Pick + $12k of Meta ads at ~$5 CPI (2,400 installs × ~$1.7) | −$8k | **−$8k** (ads return ~$4k) | −$7k |
Ads only make sense once net per install is above CPI. Finder-app money (~$80–160k a month) needs bank sync, cancelling for you, upsells and ~$40–180k a month of ads. That's a different company.

**Go/no-go:** "Turn Ditch into a finder app" = **NO-GO (3/10)**. It needs a server, Plaid, a privacy label change, an email audit and an ad budget, and it brings the reviews in §3. "Finder-style monetization on our on-phone finder" (#4) = **GO (7.5/10)**.

## Caveats
- AppKittie revenue and downloads are model estimates covering the App Store only. Web sales (SolidGate) aren't included, and ad-spend fields came back empty.
- Review tags overlap and were sorted by keyword, then checked by reading. MonoBoost's 100 reviews cover 8 months; Subpilot's cover 2 weeks.
- The SubSeek removal is seen in iTunes Lookup only; the cause is unknown.
- Plaid, CASA and CPI prices come from third parties. All conversion and revenue figures for Ditch are my estimates.
- Locked decisions stay locked until the owner OKs the changes listed above.

Sources: privacy policies ([MonoBoost](https://mnboost.com/privacy-policy/), [Subpilot](https://legal.subpilot.tech/en/privacy)); App Store pages and iTunes Lookup (Nov 18); review RSS `itunes.apple.com/us/rss/customerreviews/id=<id>/sortby=mostrecent/json`; [screensdesign MonoBoost](https://screensdesign.com/showcase/monoboost-cancel-subscriptions) and [Subpilot](https://screensdesign.com/showcase/subpilot-cancel-subscriptions); [Trustpilot Subpilot](https://www.trustpilot.com/review/subpilot.finelo.com); [Rocket Money fee](https://www.fincomparelab.com/reviews/rocket-money-review/); [Semnexus CPI](https://semnexus.com/cpi-benchmarks-app-category-platform-2026/); plus the links inline.
