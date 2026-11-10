# Freemium v2: are we giving too much away?

Written Nov 10, 2026. This checks DECISIONS #11 (unlimited free tracking + reminders on 3) against 40+ competitors, 3,532 App Store reviews and 2025–26 industry data. It builds on `pricing-competitors-2026.md` (prices, margins), `niche-teardown.md` (flows, countries) and DECISIONS "Free-tier evidence"; it doesn't repeat them. **AppKittie revenue and download numbers are estimates.** It changes no locked decision; the pick needs the owner's OK.

## Summary (12 lines)
1. **Verdict: no, we're not giving too much away.** Free tracking costs us $0 per user and makes the yearly-total reveal honest. Reminders are the right thing to charge for. The real risk is a thin Pro list at launch, not a generous free tier.
2. **Ditch's free tier is unusual.** Of 39 trackers I checked, 18 cap how many subs you can track (2–6), 9 give unlimited tracking, 5 have a hard or trial-first paywall, 7 are unclear. Only Track My Subs gates reminders (it gives none free). Nobody else does "track everything, reminders on 3".
3. **Capping tracking doesn't make more money in this niche.** Capped manual trackers earn a median **$0.73 per download**, unlimited ones **$0.79** (AppKittie est.). Ratings are about the same (4.71 vs 4.68).
4. **But caps cause the angry reviews:** 4.7% of capped apps' reviews talk about free limits vs 1.6% for unlimited ones. "The irony is thick that I have to pay a subscription to use a subscription tracking app." (1★)
5. **Hard paywalls make ~8× more per download** (median $6.16, est.) **but 40% of their recent reviews are 1–2★** (unlimited manual trackers: 19%) and 9–28% mention scams, refunds or surprise charges.
6. RevenueCat 2026: hard paywall 10.7% download→paid vs freemium 2.1%, yet **year-1 retention is the same** (27% vs 28%) and freemium keeps converting after week 6 (23% of its sales).
7. **Is 3 the right number? Yes (8/10).** 1 looks stingy next to Bobby/Orbit's 5 with reminders; 5 would cover most people's biggest charges and remove the reason to pay.
8. **Reverse trial (Pro for 7 days, no card): not now (6/10).** A week rarely includes a renewal, so people wouldn't feel Pro, and it would compete with the card trial that gets ~37% trial→paid. Test a 14-day version after launch.
9. **Hard paywall: no (4/10).** Best money per download on paper, worst for ratings, trust and our organic ASO plan (DECISIONS #18).
10. **Pick: F1, "same free tier, sharper Pro" (8.5/10).** Keep unlimited tracking + 3 reminders. Add an in-app "renewed without a heads-up" card, price-rise alerts and custom timing in Pro, a Pro list that only shows what works, and a Ditch Pro trial that doesn't use a free slot.
11. **Modelled 12-month net revenue per 1,000 downloads:** A $675 · B $800 · C $725–755 · D $540 · E $1,500–1,600 · **F1 $740** · F2 $575–845. E wins on money alone; it loses on everything we grow with.
12. **Only you can do this:** approve F1 (it adds one Home card and one copy rule), and after launch set up the F2 test in RevenueCat once there are ~1,000 downloads.

---

## 1. Competitors' free tiers

**How:** iTunes Search top 20 for "subscription tracker" in the US, UK and Italy (+ "abbonamenti" in Italy), plus the named apps. Free tiers come from App Store descriptions (AppKittie + iTunes Lookup), AppKittie paywall captures, Mobbin and reviews that state the limit. Revenue (Rev) and downloads (DL) are AppKittie estimates for last month, all countries. RPD = Rev ÷ DL, a rough "money per download". "?" = couldn't confirm. UK search also shows Emma, Snoop and Plum, which are budgeting apps, not trackers.

**Models:** *Hard* = no use without a trial or purchase. *Cap* = freemium, tracking limited to N subs. *Unlimited* = freemium, track everything free.

### Hard paywalls and "we find it for you" apps
| App (ID) | Model | Free | Paid | Rev / DL (est.) | RPD | Rating (US) |
|---|---|---|---|---|---|---|
| Subpilot (6751181747) | **Hard**: "Access to the app requires a subscription" | Nothing | Weekly $9.99, monthly $24.99, yearly $99.99, add-ons ($49.99 "Free Trial Detector") | $85k / 12.6k | $6.75 | 4.57 (6.4k) |
| MonoBoost (6740202306) | **Hard** (earlier research) | Nothing | Weekly $9.99, monthly $19.99, yearly $99.99 | $160k / 25.7k | $6.23 | 4.37 (6.3k) |
| Feenko (6747262759) | **Hard** (likely; review: "purchased BEFORE any trial") | ? | Weekly $9.99, 6-month $39.99 | $80k / 13.1k | $6.10 | 4.16 (1.4k) |
| SubSeek (6769329967) | Trial-first (?) | ? | Weekly $6.99–9.99, yearly $39.99 | $29k / 27.7k | $1.06 | 4.06 (850) |
| Tally (6802007596) | **Hard**: "Premium unlocks the app" | Export, delete | ? | no data | — | 0 |
| Rocket Money (1130616675) | Unlimited (bank) | Bank link, sub list, budgets | Premium $7–14/mo pay-what-you-want (cancel concierge) | $1.0M / 251k | $4.00 | 4.47 (407k) |
| Subscription Stopper (6448767732) | Unlimited (bank), "100% free" | Finding subs | $5.99–11.99/mo, $59–99/yr | $3.5k / 2.5k | $1.39 | 4.49 (686) |
| Hiatus (977040079) | ? (bank) | ? | $9.99–20.99/mo, $36–60/yr | $11.7k / 7.4k | $1.57 | 4.16 (6.9k) |
| VUNYO "Cancel Subscriptions" (6479920412) | Cap + weekly plans | "Limited" subs, edit/analyse kept | Weekly $1.99–4.99, yearly $29.99–79.99 | $20k / 5.0k | $3.99 | 4.08 (873) |

### Manual trackers
| App (ID) | Model | Free subs | Reminders free? | Other free | Paid unlocks / price | Rev / DL (est.) | RPD | Rating |
|---|---|---|---|---|---|---|---|---|
| **Bobby** (1059152023) | Cap | **5** (+ category limit) | Yes | Totals | One-time $0.99 unlock, packs $1.99–2.99 | $32.6k* / 11.9k | $2.74* | 4.75 (8.0k) |
| **Orbit** (6692620188) | Cap | **3–5** (AppKittie capture: 5; Mobbin: 3; UK review: "now… only 3") | Yes | Multi-currency, widgets | Magic Import, iCloud backup, custom lists; $19.99/yr, $24.99–39.99 lifetime | $2.2k / 6.7k | $0.32 | 4.71 (133) |
| Subo (6741823650) | Cap | **6** | Yes | Calendar, widgets | Unlimited; $24.99 lifetime, $9.99 / 12 months | $1.4k / 8.2k | $0.17 | 4.84 (82) |
| Subtrack (1519946553) | Cap | **3** | Yes | — | $8.99 one-time (Mac app, iCloud, export) | $5.7k / 6.8k | $0.84 | 4.52 (193) |
| Subscriptions, Feist (1551697409) | Cap | **5** | Yes | — | $8.95 one-time | $3.8k / 5.2k | $0.73 | 4.72 (160) |
| Subscription Tracker, Ali Alhady (1502336248) | Cap | **5** (reviews) | Yes | Calendar, widgets | $2.99 one-time | $8.6k* / 11.8k | $0.73* | 4.60 (259) |
| Subscription Manager, Kango (1259029889) | Cap | **2–3** (reviews) | Yes | — | $0.99/mo, $9.99/yr, $4.99–29.99 once | $3.1k / 2.1k | $1.47 | 4.46 (1.7k) |
| Subscription Day (6743316600) | Cap | **5** (reviews) | Yes | Calendar | $19.99 lifetime | $1.0k / 4.8k | $0.21 | 4.84 (19) |
| Subsee (1499253615) | Cap | ? ("Unlimited Subscriptions" IAP) | Yes | — | $2.99–19.99 | $3.8k / 2.5k | $1.50 | 4.44 (317) |
| **Track My Subs** (6749513883) | Cap | **3** | **No** | Totals | Unlimited + reminders + widget; $6.99/mo, $29.99/yr | ~$0 / 671 | — | 0 |
| **SubGuard** (6786820661) | Cap | "Essential tracking" | Basic ("extended reminders" are paid) | Calendar | Unlimited subs, analytics; $4.99/mo, $29.99/yr, 7-day trial | ~$0 / 471 | — | 5.0 (4) |
| **Subtle** (6781251166) | Cap | "Limited" | Yes | Renewals | Unlimited, scanning, calendar, stats, export, widgets; $39.99/yr, $99.99 lifetime | ~$0 / 1.5k | — | 5.0 (6) |
| **Outflow** (6779691937) | Cap | **5** | Yes | Totals, Siri | Unlimited, price-rise history, CSV export; $4.99 once | ~$80 / 497 | $0.16 | 5.0 (1) |
| SubVault (6791337140) | Cap | "Free-tier limits" | ? | — | $2.99/wk, $4.99/mo, $34.99/yr | ~$60 / 392 | $0.16 | 5.0 (2) |
| Burn (6760963548) | Cap | **5** | Yes | Widget | Unlimited, stats, iCloud, CSV export | no data / 101 | — | 0 |
| Mori (6757408961) | Cap | **5** | Yes | — | Unlimited, full calendar, CSV export; one-time | no data / 228 | — | 5.0 (1) |
| Subvia (6751438405) | Cap | **3** | Yes | Widgets, reports | Unlimited, multiple accounts | no data / 795 | — | 4.5 (2) |
| **Chronicle** (572561420) | **Unlimited** | All | Yes | Everything core | Forecast, "amount to save"; $14.99/yr | $4.2k / 3.1k | $1.37 | 4.83 (3.9k) |
| Pandora (1470560916) | **Unlimited** ("fully usable without a subscription") | All | Yes | iCloud sync | $2.49/yr, $6.99 lifetime (84% China) | $10.9k / 10.4k | $1.04 | 4.68 (437) |
| Costly (6738356072) | **Unlimited** ("all core features free") | All | Yes | Calendar | $0.99/mo, $11.99/yr | $2.6k / 6.8k | $0.38 | 4.48 (29) |
| ReSubs (6740457603) | **Unlimited** | All | Yes | CSV import | $17.99/yr with fake "-50% ends soon" | $6k / 7.6k | $0.79 | 3.87 (38) |
| Subpli (6752722752) | Unlimited per its description, **but** an Italian 1★ (Feb 2026) says an update added a limit and removed widgets and notifications | All? | Was yes | — | $1.99/mo, $14.99/yr, $29.99 lifetime | $1.7k / 7.4k | $0.24 | 4.80 (126) |
| **Recur** (1584753654) | **Unlimited** | All | Yes | CSV/JSON export | One-time "Full Version" (Smart Add, reports): "No subscription. That would be ironic." | no data / 230 | — | 5.0 (2) |
| Subtracker • App (6794934928) | Unlimited | All | ? | — | none listed | — / 200 | — | 5.0 (1) |
| **Subby** (6739703718), **SubFind** (6761034583), SubTracky, Furness, Cancely, **Ditchr** (6788658909) | ? | ? | ? | ? | Subby $14.99 once; SubFind $9.99/wk–$49.99/yr; SubTracky $7.99/yr; Furness $39.99/yr; Cancely $89.99/yr; Ditchr $29.99/yr | Subby $2.5k / 5.4k ($0.46); SubFind $5k / 6.1k ($0.82); SubTracky $4.3k / 9.0k ($0.47) | | 4.06–4.83 |
| **Ditch** | **Unlimited tracking, reminders on 3** | All | **3** | Totals, calendar, cancel help, Ditched | All reminders + custom timing, import, widget, iCloud, price-rise alerts; $29.99/yr | — | — | — |

\* AppKittie's numbers for one-time apps look too high (see `pricing-competitors-2026.md`).

### Does the free model go with money or ratings? (apps with ≥1k downloads a month)
| Model | Apps | Median RPD (est.) | Pooled RPD (est.) | Median rating | Recent reviews that are 1–2★ (pooled RSS) |
|---|---|---|---|---|---|
| Hard paywall | 4 | **$6.16** | $4.48 | 4.27 | **40%** (MonoBoost 80%, SubSeek 85%) |
| Cap on tracking | 11 | **$0.73** | $1.24 (Bobby skews it) | 4.71 | 23% (18% since 2025) |
| Unlimited tracking, manual | 5 | **$0.79** | $0.72 | 4.68 | 19% (17% since 2025) |
| Unlimited, bank link | 2 | $2.69 | $3.97 | 4.48 | Rocket Money 64% |

**What it means, in plain words:**
- Among apps like ours (manual entry), **capping the list doesn't earn more per download**. The money differences in this niche come from *what* is sold (bank links, "we find it for you", weekly plans, paid ads), not from how stingy the free tier is.
- The hard-paywall apps that earn ~$6 per download also charge ~$100 a year or $9.99 a week. You can't separate the paywall from the price. It's a correlation, not proof.

## 2. What reviews say about free limits

**How:** App Store review RSS, newest first, up to 10 pages per country, for 28 apps in the US, UK and Italy. **3,532 reviews from 27 apps** (US 2,976, UK 299, Italy 257), pulled Nov 10, 2026. I tagged them with English and Italian keyword lists and read every hit for the quotes. The RSS only shows *written* reviews, which skew lower than star-only ratings, so compare groups rather than reading the numbers as each app's rating.

| Group | Reviews | Mention free limits / paywall | …of those, 1–2★ | Average stars on those |
|---|---|---|---|---|
| Hard paywall (4 apps) | 896 | 0.2% (nobody expects free use) | 0 | — |
| Cap on tracking (9 apps) | 1,214 | **4.7%** | **19** | 3.4 |
| Unlimited, manual (5 apps) | 831 | **1.6%** | 2 | 3.7 |

**Per app, share of reviews with "scam", "fraud", refund or surprise-charge words:** SubSeek 28%, MonoBoost 21%, Feenko 18%, Subpilot 9%, Rocket Money 9%. Every manual tracker: 0–2%.

**What people actually write:**
- Caps stop people reaching the "aha": "No way to sample this app. How can you decide if it's a useful app with only two subscriptions… Happy to pay for apps but need to know they work for me." (Kango, 1★, UK, Jul 2026)
- The irony our target user hates: "The irony is thick that I have to pay a subscription to use a subscription tracking app." (Kango, 1★, US, Jul 2026). "I find it ironic that a subscription tracker app is trying to make me upgrade to add subscriptions… support is earned not…" (Subscription Day, 1★, US, Feb 2026)
- Surprise limits feel dishonest: "only to find out the max is only 3 for the free version. It's not a matter of pay vs free it has to do with honesty. Let people know up front." (Subtrack, 1★, US)
- "Free version useless… only 5 entries… I wouldn't download and install it if I knew." (Bobby, 2★, UK)
- Taking free things away is worst: after an update "a limit on the number of subscriptions, the widgets are no longer available, nor are the notifications" (Subpli, 1★, Italy, Feb 2026, translated). This backs CLAUDE.md rule 6 (never take away).
- Cheap one-time unlocks are forgiven: "Well worth the 49p I paid to add unlimited subscriptions" (Bobby, 5★); "a one-off fee so I think that's quite fair" (Subo, 5★); "la versione free è sufficiente" (Subo, 5★, Italy).
- Reminders that fail are the deepest complaint: 5% of Bobby's reviews (e.g. "Paid for premium and still no notifications!"), and "Notifications limited to 1 per subscription. So if you miss that one… tough luck." (Bobby, 1★, UK, Mar 2026). One user with ADHD asks for "at least five different reminders at different time lengths". **Custom timing is a real Pro reason.**
- Nobody in 3,532 reviews complains about "reminders limited to N", because almost nobody sells it that way. That's an open lane, not proof it's safe; watch for "only 3" in our own reviews.

**Why ratings matter for us:** our growth is organic ASO (DECISIONS #18). Apple shows the summary rating in search results and says few ratings "may discourage potential users from downloading" ([Apple](https://developer.apple.com/app-store/ratings-and-reviews/)). NP Digital (2024) found 4★ apps convert product-page visitors at 0.83× and 3★ apps at 0.57× a 5★ app ([Neil Patel](https://neilpatel.com/marketing-stats/app-downloads-vs-ratings/)); older Apptentive data put 3→4★ at +89% ([MarTech](https://martech.org/app-store-ratings-a-single-star-jump-can-mean-340-percent-more-downloads)). Free users with ≤3 subs never pay, but they rate us, and the ratings prompt fires after a real win.

## 3. Industry data
| Finding | Number | Source |
|---|---|---|
| Download→paid by day 35 | Hard paywall **10.7%** median (top quartile 20%), freemium **2.1%** (top quartile 4.5%) | [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps-2026/) |
| Revenue per install, day 60 | Hard $3.09, freemium $0.38 | same; [RevenueCat trends](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026) |
| Yearly subscribers still paying after 1 year | Freemium **28%**, hard **27%**: "statistically negligible" | same |
| When freemium users buy | 23% of freemium conversions come after week 6 (hard paywall: spike on days 4–7) | [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps-2026/) |
| Trial length → trial→paid | ≤4 days 25.5%, **5–9 days 37.4%**, 17–32 days 42.5% | same |
| Trials started on install day | 78–90% depending on category | same |
| 2025 report: year-1 revenue per payer | Hard $49.30, freemium $24.24 | RevenueCat SOSA 2025 via [Airbridge](https://www.airbridge.io/en/blog/hard-paywall-vs-freemium-2026) |
| 2025 report: refund rate | Hard **5.8%**, freemium **3.4%** | same |
| Soft vs hard paywall, view→payment | Soft 4.85%, hard 3.34% (16,000+ apps) | Adapty 2026 via [Impact Origins](https://impactorigins.co/blog/app-paywall-conversion-rate) |
| Switching to freemium, real cases | One app: LTV per user +75% (bundled with other changes). Another: paid conversion fell >50%, pulled in 2 weeks. "Too generous removes the reason to upgrade; too strict and people leave before the habit forms." | [RevenueCat, Apr 29, 2026](https://www.revenuecat.com/blog/growth/hard-paywall-vs-freemium) |
| Reverse trial | App Masters: freemium conversion 0.4% → 4.5% with a reverse trial (one company, anecdote) | quoted in [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps-2026/) |
| Reverse trial, B2B software | Converts about the same as freemium or a no-card trial; "not statistically significant"; only 7% use it | [ChartMogul Conversion Report](https://chartmogul.com/reports/saas-conversion-report/) |

- RevenueCat doesn't publish Finance or Utilities medians on its public pages (the 263-page PDF may have them). I didn't find a reliable Finance-only figure, so the model below uses the all-category numbers.
- RevenueCat's own advice leans hard paywall for bootstrapped apps that need cash flow. That describes us. It leans freemium when the app has strong retention and growth isn't paid ads, which also describes us (we grow through ratings and search).
- **Mobbin:** reverse trials in the wild look like Badoo's "You get 3 days of Premium — starting now. No need to subscribe." ([Badoo](https://mobbin.com/screens/776ae4bd-c8d5-44c7-ba9d-d905852df5ab?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) and Finch's "free preview" (`paywalls-competitors.md`). Free-vs-Pro tables with real ticks, like Tide Guide ([Mobbin](https://mobbin.com/screens/5b34dc0f-7bf4-4ba1-ac0f-1780eb282738?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) and Orbit ([AppKittie](https://storage.appkittie.com/onboardings/com.flooben.orbit/07.jpg)), make the free tier visible and honest.

## 4. Ditch-specific analysis

### Where the "aha" is
1. **Minute 1: "That's $X a year."** It only works if every ticked sub is saved and counted. A tracking cap would make that number include subs the free app then refuses to keep: the bait-and-switch risk in DECISIONS (Apple 3.1.2(a)).
2. **Days 1–30: the first reminder that actually fires.** This is the product (Bobby's #1 complaint is that reminders don't fire) and it's the ratings-prompt moment (DECISIONS #18). Free users get it on their 3 biggest charges.
3. **The first ditch: "$X a year you won't pay."** Free, and shareable.

### Unlimited free tracking: asset or leak?
**An asset.** It costs $0 per user (no server, no bank link), makes the total honest, avoids the "only 5 entries" reviews, and is the cleanest answer to "a subscription to manage subscriptions": *the list is free forever; you pay for the app watching your back.* The competitor data shows no money gained from capping (§1), and the reviews show the cost (§2). The leak is elsewhere: people with ≤3 subs never need Pro. They weren't going to pay, and they still rate us.

### Are reminders the right thing to charge for?
**Yes.** It's the thing people value most (§2) and it gets more valuable the more subs you have, so the people who pay are the ones with the biggest bills, which is fair. It's also the one thing a spreadsheet can't do. Two honest notes:
- Free reminders are already generous: 2 heads-ups each (3 days and 1 day before, 9:00).
- "Changing the picks is free and unlimited" (SPEC §7) lets a careful user rotate picks. Keep it: rotating takes effort, which is exactly what Pro removes, and blocking it would feel petty.

### Is 3 the right number?
| Free reminders | Score /10 | Why |
|---|---|---|
| 1 | 5 | Reads like a demo next to Bobby/Orbit/Outflow (5 subs with reminders). The first-reminder "aha" happens once a month at most. |
| 2 | 6 | A little more pressure, still looks stingy, and the "3 biggest charges" picker gets weaker. |
| **3** | **8** | Covers the biggest charges (pre-selected by yearly cost), matches rivals' generosity, already in the copy and SPEC. Paywall trigger "Get a heads-up before all N renewals." works from the 4th sub. |
| 5 | 6 | Better reviews, but many people's biggest charges are all covered, so fewer reasons to pay. |

### Should anything move between Free and Pro?
| Feature | Now | Recommendation | Score for the rec | Why (user + conversion) |
|---|---|---|---|---|
| Calendar | Free | **Keep free** | 8 | It's a view of your own data; gating it feels like hiding data (rule 6). Little conversion value. |
| Totals per currency | Free | **Keep free** | 10 | It's the aha and an honesty rule. |
| Custom timing (a week before, the day of, 2 alerts) | Pro | **Keep Pro** | 8 | Defaults are already good. Power users ask for more (Bobby reviews). |
| Price-rise alerts | Pro (planned) | **Keep Pro, ship with the hosted price file** | 8 | New, clearly extra value. Outflow sells "price-rise history" too. |
| Import after onboarding | Pro | **Keep Pro** | 8 | Saves real time; the free onboarding scan shows it works (#16). |
| Widget | Pro | **Keep Pro** | 6 | Orbit and Burn give it free, but it's a nice-to-have. Don't list it until it ships. |
| iCloud backup | Pro | **Keep Pro** | 6 | The iPhone's own iCloud backup normally includes the app's data, so free users aren't at risk of losing their list. Don't list it until it ships (SPEC already says so). |
| CSV export (when added) | — | **Free** | 8 | "Your list is yours." Cheap trust; Recur and Tally do it free. Gating export reads like holding data hostage. |
| Ditch Pro trial reminder | Counts? | **Never uses a free slot** | 9 | Otherwise starting the trial costs a free user a reminder. Obvious fairness. |
| "More than N subs" | Free | **Never cap** | 10 | §1–§2. |

### The missing upgrade moment
Right now the only strong upgrade moment is the onboarding paywall. Freemium apps make 23% of their sales after week 6 (RevenueCat), so they need an honest moment later. The natural one for Ditch: **a sub without a reminder renews.** Show a small card on Home the next time the app is opened. **In-app only, never a notification** (that would be a reminder in disguise), once per charge, dismissible, no running "money lost" counter, nothing moving near the price.

| Copy for the card | Score /10 |
|---|---|
| **"Spotify renewed yesterday. $12.99. No heads-up on this one. Reminders are on for 3 of your 9 subs. Cover all 9 →"** | **8.5** (pick: dry, factual, on the user's side) |
| "You missed Spotify's renewal. Don't let it happen again! Go Pro" | 3 (shames, salesy) |
| "Spotify charged you $12.99 without warning. Upgrade to Pro." | 5 (blames, a bit scary) |

## 5. Options

**Model assumptions** (12 months, net after Apple, tax, refunds):
- Net per paying user in year 1 ≈ **$25**: yearly $23.12; monthly $3.85 × ~6.5 months (12% monthly churn, a guess); lifetime $38.54; mix 70/20/10 (`pricing-competitors-2026.md`). Cross-check: RevenueCat 2025 freemium payer LTV $24.24 (gross).
- Baseline (A) download→paid in 12 months ≈ **2.7%**: freemium day-35 median 2.1% × 1.3 for late buyers (23% come after week 6). Range 1.8–4.5%.
- Other options move that rate by the stated %. These are **reasoned guesses from the benchmarks**, not measurements. Treat any gap under ~15% as noise.
- "Per would-be 1,000" also counts downloads lost to a lower rating (NP Digital index).

| Option | What it is | Download→paid (12 mo) | **Net per 1,000 downloads** | Conversion /10 | Ratings & ASO /10 | Trust /10 | Revenue per download /10 | **Overall** |
|---|---|---|---|---|---|---|---|---|
| **A** Keep as is | Unlimited tracking + 3 reminders | 2.7% | **$675** | 6 | 9 | 9 | 6 | **7.5** |
| **B** Cap tracking at 5 | Free list limited to 5 subs | 3.2% (+20%) | $800 (~$770 per would-be 1,000) | 7 | 4 | 3 | 7 | **5** |
| **C** 1–2 free reminders | Same, fewer reminders | 2.9–3.0% (+7–12%) | $725–755 | 6.5 | 7 | 7 | 6.5 | **6.5** |
| **D** Reverse trial instead of the card trial | Everyone gets Pro 7 days, no card, then 3 | ~2.2% (−20%, very uncertain) | $540 (range $400–1,100) | 5 | 8 | 7 | 5 | **6** |
| **E** Hard paywall + 7-day trial | No use without a trial | ~7% (below the 10.7% median: no weekly plan, manual app) | ~$1,760; **$1,500–1,600 per would-be 1,000** (rating ~4.2★, refunds 5.8%) | 10 | 2 | 2 | 9 | **4** |
| **F1** Same free tier, sharper Pro (**pick**) | A + "renewed without a heads-up" card + price-rise alerts and custom timing in Pro + launch Pro list shows only what works + Pro trial doesn't use a slot + export free | ~3.0% (+10%) | **$740** | 7 | 9 | 9 | 7 | **8.5** |
| **F2** A + reverse trial for "Continue free" | Card trial stays; people who skip get Pro free for 14 days, then 3 | 2.3–3.4% (−15% to +25%) | $575–845 | 6–8 | 8 | 8 | 6–8 | **7** (test, don't launch) |

**Why not D or F2 at launch:**
- Most subs renew monthly, so a 7-day window usually holds **zero renewals**. People wouldn't feel "reminders on everything", and then reminders they never saw would switch off. For an anxious user that reads like a threat.
- A free Pro week offered right next to the paywall gives people a reason to skip the card trial. Card trials of 5–9 days convert at ~37%, and 80%+ of trials start on day 0, so that's the conversion we can least afford to lose.
- A **14-day** version for people who already chose "Continue free" covers about half of their monthly renewals. It's worth an A/B test once we have a baseline (~1,000 downloads, 30+ purchases).

**Why not E, even though it earns the most per download:** its 40% recent 1–2★ rate and 9–28% "scam/refund" reviews (§2) would drag down the rating that our organic ASO plan depends on. It breaks "Free forever for tracking" (welcome screen, DECISIONS #11). Refunds are higher (5.8% vs 3.4%). And it's exactly the "subscription to manage subscriptions" our target user hates. If ASO fails and we move to paid ads, revisit it with real data.

## 6. The pick: F1, same free tier, sharper Pro (8.5/10)

**Serves the user:** the whole list stays free forever, nothing is ever taken away, and the only thing we charge for is the app doing the watching. **Serves conversion:** keeps the Day-0 trial paywall untouched, adds an honest later upgrade moment (where freemium makes ~1 in 4 of its sales), and makes Pro feel worth $29.99 at launch.

**What changes in the app:**
1. **Free tier: no change.** Unlimited tracking, totals, calendar, cancel help, Ditched, reminders on 3 (DECISIONS #11 stays).
2. **New Home card "renewed without a heads-up"** for a sub with no reminder whose charge date just passed. In-app only, once per charge, dismissible, hidden when Pro is active, not shown for ditched subs. Tap → paywall with headline "Get a heads-up before all N renewals."
3. **The Ditch Pro trial entry never uses one of the 3 free slots.**
4. **The paywall's Pro list only shows what works on the day.** At launch: "Reminders on all N subs" · "Pick your own timing: a week, 3 days, the day before" · "Import from screenshots and statements" (once M3 ships). Add "Price-rise alerts" when the hosted price file is live; widget and iCloud backup when M4 ships.
5. **A visible free column on the paywall:** "Free forever: your whole list, real totals, the calendar, reminders on 3."
6. **When CSV export is added, it's free.**
7. **After launch:** A/B test F2 (14-day reverse trial for "Continue free") in RevenueCat once there are ~1,000 downloads. Track download→trial, trial→paid, the share of free users with more than 3 subs, and reviews that say "only 3".

**Copy:**
| Where | Copy |
|---|---|
| App Store description, first lines | "Track every subscription free, forever. Get reminders on 3 for free. Ditch Pro covers the rest." |
| Screenshot caption | "Your whole list is free. Reminders on 3 are too." |
| Paywall free column | "Free forever: your whole list, real totals, the calendar, reminders on 3." |
| Home card | "Spotify renewed yesterday. $12.99. No heads-up on this one. Reminders are on for 3 of your 9 subs. Cover all 9 →" |
| Settings → Reminders (free) | "3 of 3 free reminders in use · Change picks" |

**Manual test (when built):** set a sub with no reminder to renew yesterday → open the app → see the card once → dismiss → it doesn't come back → start the Pro trial → the "Ditch Pro trial" entry has a reminder and "3 of 3" doesn't change → let Pro lapse → nothing disappears and reminders drop to your 3 picks.

---

## Sources
- AppKittie API (all revenue and download figures are **estimates**, pulled Nov 10, 2026): [List Apps](https://www.appkittie.com/docs/api-reference/apps/list-apps), [Get App Details](https://www.appkittie.com/docs/api-reference/apps/get-app.md), [Onboarding Screens](https://www.appkittie.com/docs/api-reference/onboarding/list-onboarding-screens.md). Orbit free-vs-Plus capture: [07](https://storage.appkittie.com/onboardings/com.flooben.orbit/07.jpg).
- iTunes Search: [US](https://itunes.apple.com/search?term=subscription+tracker&entity=software&country=us), [UK](https://itunes.apple.com/search?term=subscription+tracker&entity=software&country=gb), [Italy](https://itunes.apple.com/search?term=subscription+tracker&entity=software&country=it), [Italy "abbonamenti"](https://itunes.apple.com/search?term=abbonamenti&entity=software&country=it). iTunes Lookup: `https://itunes.apple.com/lookup?id={ID}`.
- App Store pages: `https://apps.apple.com/us/app/id{ID}` with the IDs in §1, e.g. [Track My Subs](https://apps.apple.com/us/app/id6749513883), [Outflow](https://apps.apple.com/us/app/id6779691937), [Recur](https://apps.apple.com/us/app/id1584753654), [Subtle](https://apps.apple.com/us/app/id6781251166), [Subpilot](https://apps.apple.com/us/app/id6751181747), [Kango](https://apps.apple.com/us/app/id1259029889), [Subo](https://apps.apple.com/us/app/id6741823650), [Tally](https://apps.apple.com/us/app/id6802007596), [Burn](https://apps.apple.com/us/app/id6760963548), [Mori](https://apps.apple.com/us/app/id6757408961).
- Reviews: `https://itunes.apple.com/{us|gb|it}/rss/customerreviews/page={1–10}/id={ID}/sortBy=mostRecent/json`, pulled Nov 10, 2026 (3,532 reviews, 27 apps). Quotes are from Kango (1259029889), Subscription Day (6743316600), Subtrack (1519946553), Bobby (1059152023), Subpli (6752722752), Subo (6741823650).
- RevenueCat: [State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps-2026/), [2026 trends](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026), [Hard paywall vs freemium (Apr 29, 2026)](https://www.revenuecat.com/blog/growth/hard-paywall-vs-freemium). 2025 figures via [Airbridge](https://www.airbridge.io/en/blog/hard-paywall-vs-freemium-2026).
- Adapty 2026 soft vs hard paywall via [Impact Origins](https://impactorigins.co/blog/app-paywall-conversion-rate). Reverse trials: [ChartMogul](https://chartmogul.com/reports/saas-conversion-report/).
- Ratings: [Apple](https://developer.apple.com/app-store/ratings-and-reviews/), [NP Digital / Neil Patel](https://neilpatel.com/marketing-stats/app-downloads-vs-ratings/), [Apptentive via MarTech](https://martech.org/app-store-ratings-a-single-star-jump-can-mean-340-percent-more-downloads).
- Mobbin: [Badoo reverse trial](https://mobbin.com/screens/776ae4bd-c8d5-44c7-ba9d-d905852df5ab?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Tide Guide free vs Pro](https://mobbin.com/screens/5b34dc0f-7bf4-4ba1-ac0f-1780eb282738?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Origin trial timeline](https://mobbin.com/screens/b3ebe000-42ff-431e-9d6b-8b27338ba9c5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp).
- Earlier Ditch research: `DECISIONS.md` (#11, #16, #18, free-tier evidence), `pricing-competitors-2026.md`, `niche-teardown.md`, `paywalls-competitors.md`, `SPEC.md` §6–7.

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
