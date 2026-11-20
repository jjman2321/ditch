# Price-hike alerts for Ditch: who has them, how often prices rise, what we have, how to build it (Nov 20, 2026)

Research only. No repo files were changed. Sources are linked inline. Where a fact could not be confirmed it says so.

## Short answer
- **Everyone who alerts today does it after the fact, from bank charges.** Rocket Money, Chase, Capital One (Eno), Finly, and Apple Card's iOS 27 Recurring view all see a higher charge *after it posts*. Bank versions are free (Chase, Capital One), so the bank-based alert is turning into a commodity.
- **Nobody found alerts *before* the bill from a checked price list** in a consumer app, except the services' own emails and Apple's own App Store notices. Outflow sells "price-rise history" (a list, not an alert). This gap is Ditch's opening: we already keep 524 checked country prices and 79 sourced rises.
- **How often:** in our data, a major US service raises prices about **0.6 times a year** (31 rises across 18 services, Jan 2024 to Nov 2026). The **median rise is 14%** (middle half 9–20%), typically **+$2.00/month**. A user with 4–5 big catalog services would get **about 2–3 alerts a year**, roughly one every 4–6 months. Not spammy, but too rare to carry Pro alone.
- **Notice:** services usually tell existing members **about 30 days** ahead (Netflix "a month", HBO Max, Peacock, Max: 30 days; Xbox 64 days). Apple's rules for App Store subscriptions: first notice **27 days** before renewal for monthly, **60 days** for yearly when consent is needed.
- **Ditch today:** a Pro "Price watch" *card on Home* and a line in the editor, built from the catalog that ships *inside the app*. **No notification. No downloaded price file** (only exchange rates are downloaded). Bank-detected price changes are coded but bank sync is off in the App Store build.
- **Recommendation:** put the price rise **inside the renewal reminder that already fires** ("Netflix renews in 3 days. Standard is $19.99 now, you have $17.99. Still watching?"), fed by a **daily public price file** (the A2 plan already in `docs/research/autosync.md`) with an "effective for existing members" date. Low risk, no new notification slots, no background work, no privacy label change. Details at the end.

---

## 1. Competitors

| App / provider | Has price-rise alert? | How it detects | Free or paid | Delivered as | Marketing emphasis | Source |
|---|---|---|---|---|---|---|
| **Rocket Money** (was Truebill) | Yes | Bank link (Plaid): compares each new charge with past payments. Fires when the rise is **> $1.99 and > 5%** | Not stated by Rocket Money; a third-party review lists it in the free tier (likely free, unconfirmed) | Push notification, **after** the higher charge | High: in the App Store description ("will notify you when an existing subscription goes up in price") and its own SEO article | [Rocket Money article](https://www.rocketmoney.com/learn/personal-finance/is-there-an-app-that-can-tell-me-when-my-subscription-price-increased), [App Store](https://apps.apple.com/app/1130616675), [Finny review](https://getfinny.app/blog/apps-track-subscription-price-increases-2026) |
| Truebill (legacy) | Yes, carried into Rocket Money | Bank link: "monitors for new charges and sneaky price increases" | Free core | In-app/push | Was part of the launch pitch | [Money Talks News](https://www.moneytalksnews.com/save-hundreds-on-recurring-charges/) |
| **Copilot Money** | Weak / not confirmed as a push alert | Bank link, "Recurrings" with expected amount | Paid (~$95/yr) | In-app recurring view; no documented push for price changes | Pricing page: "Recurrings help you spot price hikes sooner" | [Copilot pricing](https://copilot.money/pricing/), [Help: recurrings](https://intercom.help/copilotmoney/en/articles/3760068-create-recurrings), [Finny](https://getfinny.app/blog/apps-track-subscription-price-increases-2026) |
| **Monarch** | No dedicated alert found | Bank link. A recurring paid at a different amount turns **yellow** in the calendar | Paid (~$99.99/yr) | In-app colour; push only for "expected in 3 days" and review items | Low | [Monarch help](https://help.monarch.com/hc/en-us/articles/4890751141908), [Monarch launch post](https://www.monarch.com/blog/track-recurring-bills-and-subscriptions) |
| **Hiatus** | Yes ("rate increase" alerts) | Bank link | Premium (~$13.99/mo) | Not documented | Listed among features | [AlternativeTo](https://alternativeto.net/software/hiatus/about), [App Store](https://apps.apple.com/us/app/-/id977040079) |
| **Finly** (finlywealth) | Yes, the most carefully specified | Bank charges. Old price must be steady; rise ≥ $0.50 **and** ≥ 3%; skips rises > 75%; max 1 alert per sub per 60 days; only charges from the last 3 weeks | Paid tiers (Grow and up; SMS on Thrive) | Email/SMS, bundled with bill reminders, **after** the charge | Help-centre feature page | [Finly help](https://www.finlywealth.com/money/help/articles/price-rise-alerts) |
| **SubTracker** (web) | Yes | Manual: the amounts you enter (no bank) | Paid (Plus $5.90/mo) | Email | Has its own SEO answer page | [SubTracker](https://subtracker.io/answers/spot-subscription-price-increases) |
| **Outflow** (iOS, closest manual rival) | History, not an alert | On-phone data; "Price-rise history shows when a service hiked its price" | Pro, $4.99 one-time | In-app list ("Worth a look" checks per our Nov 15 research) | In the Pro list | [App Store](https://apps.apple.com/au/app/id6779691937), `docs/research/features-market-2026-11-15.md` |
| **Bobby** | No evidence | Manual + catalog; user edits the price | One-time $0.99–2.99 | n/a | None | [App Store](https://apps.apple.com/us/app/-/id1059152023) |
| Orbit, Chronicle, Subby/"Subscriptions", TrackMySubs | Nothing found | Manual | n/a | n/a | None found | Searches returned no price-alert feature. Many tiny 2025–26 trackers (Subix, SubTrack, SubsTracker+) *list* "price change history/notifications" but have almost no ratings ([search results](https://apps.apple.com/us/app/id6760389560)) |
| **Chase** | Yes | Bank: "Enable notifications for new or increased subscription charges"; Stored Cards flags irregular amounts | Free | Push/email/text | Education pages | [Chase](https://www.chase.com/personal/credit-cards/education/basics/subscription-fatigue), [Bankrate](https://www.bankrate.com/credit-cards/advice/chase-recurring-charges-tool) |
| **Capital One** (Eno) | Yes | Bank: Eno "can notify you when it spots a recurring charge that's higher than usual"; takes a few cycles to learn | Free | App/email (varies by card) | Subscription manager page | [Capital One Eno](https://www.capitalone.com/learn-grow/money-management/eno-recurring-charges/), [Subscription management](https://www.capitalone.com/digital/tools/subscription-management/) |
| **Revolut** | Not found | Has a subscriptions view; no source for a price-rise alert | n/a | n/a | n/a | Searches only found Revolut's own plan price rises |
| **Apple Card (iOS 27)** | No warning; predicted amount just updates after the charge | Apple Card transactions only, US | Free | "Upcoming transactions" alert (amount, not a rise warning) | iOS 27 launch coverage | [Apple support](https://support.apple.com/en-ae/127699), [9to5Mac](https://9to5mac.com/2026/09/15/apple-card-has-three-new-and-improved-features-in-ios-27/) |
| **Apple App Store (subscriptions billed by Apple)** | Yes, the service-side notice | Apple itself, before the rise | Free | Email + push (if on) + in-app sheet, **27 days** (monthly) before; consent needed if > ~50% and > ~$5/period (> $50/yr), a second rise within 12 months, or local law; consent requests ~weekly until expiry; yearly consent notices start **60 days** out | n/a | [Apple support](https://support.apple.com/HT213252), [App Store Connect help](https://developer.apple.com/help/app-store-connect/manage-subscriptions/manage-pricing-for-auto-renewable-subscriptions) |

**What this means for Ditch**
1. **"After the charge" is free at Chase and Capital One.** A bank-based alert alone is not something people will pay for long-term.
2. **"Before the charge" only comes from the services and Apple.** It arrives as an email people miss. Ditch can deliver it *at the decision point* (the renewal reminder), with no bank, in 12 countries. Rocket Money is US-only.
3. **Marketing:** Rocket Money puts the line in its App Store description and runs an SEO article on "is there an app that tells me when my subscription price increased". Ditch already ranks content on `/price-changes` and `/prices/[slug]`, so there's an SEO-to-install path.

## 2. How often prices rise (from `docs/research/price-changes-2026-11.json`, checked Nov 13, plus news)

Dataset: 81 rows (79 rises, 2 cuts: Xbox Game Pass Apr 2026), 18 services, Jan 2024 to Sep 2026. All rises are sourced (10 official, the rest major press quoting both prices).

| Year (by announcement) | Rises (plan rows) | US services that rose | Distinct US rise events | Median rise | Mean rise |
|---|---|---|---|---|---|
| 2024 | 20 | 10 (Crunchyroll, Disney+, ESPN+, Hulu, Max, Paramount+, Peacock, Spotify, Xbox, YouTube TV) | 10 | 15.5% | 16.1% |
| 2025 | 18 | 9 (Apple TV, Disney+, ESPN, Hulu, Microsoft 365, Netflix, Paramount+, Peacock, Xbox) | 9 | 20.0% | 25.4% |
| 2026 (to Nov) | 38 (35 US + Netflix UK) | 12 (Apple Music, Apple One, Apple TV, Disney+, ESPN, Hulu, Netflix, Peacock, Prime Video ad-free, Spotify, YouTube Music, YouTube Premium) | 14 | 12.5% | 14.4% |

- **All rises:** median **14.3%**, middle half **9.1–20%**, mean 17.1% (pulled up by Prime ad-free +67%, Paramount+ Essential yearly +50%, Xbox Ultimate +50%, Microsoft 365 +43%).
- **USD monthly plans:** median **+$2.00/month**, mean +$2.22. So Rocket Money's "> $1.99 and > 5%" rule would catch about half of them. Ditch shouldn't copy that threshold: from a price list, any real rise is worth saying.
- **Per service:** 31 service-years with a rise across 18 services in ~2.9 years ≈ **0.6 rises per service per year.** Disney+, Hulu, ESPN and Peacock rose every year 2024–2026; Netflix in 2025 and 2026; Spotify in 2024 and 2026.
- **Gaps in our data (it undercounts):** HBO Max's Oct 21, 2025 rise is missing (+$1 to +$2/month; existing monthly members from Nov 20, 2025 with 30 days' notice; yearly members at renewal; [Engadget](https://www.engadget.com/entertainment/streaming/hbo-max-is-getting-even-more-expensive-starting-today-143939446.html), [IBTimes](https://www.ibtimes.com/hbo-max-increases-subscription-prices-across-board-effective-immediately-how-much-more-your-3788025)). AI tools, cloud storage, news and gaming beyond Xbox aren't covered. Wider context: BLS "subscription and rental of video and video games" rose **19.5% in 2025** vs 2.7% overall inflation ([Scripps News](https://www.scrippsnews.com/entertainment/streaming-costs-surge-at-seven-times-inflation-in-2025)); the top-10 streamers' average price rose 12% in 2025 (LA Times via the same search).
- **Expected alerts per user:** with 4–5 big catalog services → **~2.5–3 alerts a year**. With 8+ catalog services → ~5 a year.

**Notice existing members get**
| Service | Notice to existing members | Source |
|---|---|---|
| Netflix | Email "a month before the new prices are applied" (2026); same pattern in 2016 and 2022 | [TechCrunch 2026](https://techcrunch.com/2026/03/26/netflix-confirms-its-raising-prices-again/) |
| HBO Max (2025) | 30 days; yearly members at renewal | [Engadget](https://www.engadget.com/entertainment/streaming/hbo-max-is-getting-even-more-expensive-starting-today-143939446.html) |
| Peacock (2024–26), Max (2024) | 30 days after announcement (dataset `effectiveExisting`); Peacock's 2024 yearly plans 110 days | dataset |
| YouTube TV (2024) | 32 days | dataset |
| Xbox Game Pass (2024) | 64 days | dataset |
| Apple App Store subs | 27 days (monthly) / 7 days (weekly) before renewal; 60 days for yearly when consent is needed | [App Store Connect help](https://developer.apple.com/help/app-store-connect/manage-subscriptions/manage-pricing-for-auto-renewable-subscriptions) |
| Most press rows | **Unknown**: 60 of 81 rows have no `effectiveExisting` date | dataset gap to fill |

**Takeaway:** there is usually a **~30-day window** between "new price is public" and "existing member pays it". A catalog-based alert can land *inside that window*, before the bill. Bank alerts can't.

## 3. What Ditch already has (code, Nov 20)

**Price data: shipped inside the app, not downloaded**
- `src/catalog/prices.data.ts`: 524 country-price rows (all `verified`, checked 2026-11-09), generated from `docs/research/prices-2026-11.json` by `npm run prices` (`scripts/build-prices.mjs`). Lookup in `src/catalog/prices.ts` (`priceRow`, `catalogPrice`, `planChoices`).
- **The app downloads no price file.** The only download is exchange rates (`src/services/fx.ts`: `open.er-api.com`, at most once a day, only for people with 2+ currencies, cached on the phone). The hosted `prices.ditchsubs.app/v1/prices.json` and the weekly "price robot" are **planned, not built** (`docs/research/autosync.md` §A2/A3, owner to-dos: DNS record, public `ditch-prices` repo, Anthropic key as a GitHub secret).
- So today, **new prices reach phones only through an app update**: an App Store build, or an **EAS over-the-air update** (already used for TestFlight; applies on the next launch).
- `docs/research/price-changes-2026-11.json` (79 sourced rises) feeds only the **website** (`web/src/data/price-changes.json`, `/price-changes`, price-history blocks). The app doesn't use it.

**Catalog "Price watch" (Pro, DECISIONS #60/#62)**
- `src/domain/priceWatch.ts` → `priceChanges(subs, lookup)`: flags an active sub when its stored price ≠ our checked price for the **same plan, country, currency and cycle**. Only for subs with `priceSource === 'catalog'`. Flags rises *and* drops. Tested in `src/domain/__tests__/priceWatch.test.ts`.
- Home (`src/app/(tabs)/index.tsx` + `PriceChangeCard` in `src/home/HomeParts.tsx`): **Pro** sees "Claude Pro went up to $20.00. You have $18.00. Checked Nov 15 on Claude's own page." with **Update to $X / Keep mine**. **Free** sees "A price on your list went up. Price watch is in Pro." → paywall. Only one suggestion card at a time; the overlap card goes first.
- Editor (`src/editor/Editor.tsx` ~l.461): Pro sees "Pro (monthly) is $20.00 now, checked Nov 15. Change yours if it went up."
- Paywall (`src/app/paywall.tsx`): row **"Price rise check"** (Free —, Pro ✓).
- Manual tests: `docs/MANUAL-TESTS.md` §1i.

**Bank-detected price changes (Pro/trial, US/CA, not live)**
- `src/import/bankSync.ts` → `analyzeBank(...).priceChanges`: the latest real charge differs from the saved price by more than max(50¢, 2%). The user is asked; the price never changes silently. Stored in `src/state/bankLogic.ts` (`priceChanges`, `caught` list of rises, `priceKey`), with a Home sync card ("price" kind) and **Update** (sets `priceSource: 'user'`). Statement import also tags "· price went up" (`src/import/statement.ts`).
- Off in the App Store build: `BANK_READY = false` (`src/config/features.ts`). **Background refresh isn't built** (no `expo-background-task`/BackgroundFetch in the code), so sync only runs when the app is open.

**Notifications**
- Local only (`src/services/notifications.ts`, plan in `src/domain/reminders.ts`): renewal reminders (`headsUpBody`: "Netflix renews in 3 days. $17.99. Still watching?"), trial endings, Pro's 30-day yearly warning, a nudge, a "keep going" note, capped at `MAX_PENDING = 60`. Rescheduled on launch and foreground.
- **No notification mentions a price change**, from the catalog or the bank. MANUAL-TESTS even checks that onboarding slide 2 has "no price-rise notification" (the fake one was removed in the Nov 19 audit).

**What's missing**
1. A way to get new prices to phones **without an app update**: the hosted daily or weekly price file.
2. **Upcoming rises**: the app only knows "the price is X now". It can't say "goes up on your next bill (from Dec 3)", because `effectiveExisting` from the price-changes data isn't in the app.
3. **Any notification** about a rise. Today the user has to open Ditch to see the card.
4. **Coverage:** price watch only runs on `priceSource === 'catalog'`. **Imported subs with a real price** (screenshot/statement) get `'user'` (`src/import/toSubs.ts` l.27), and so do subs the user typed. The import-first onboarding (DECISIONS #63/#66) means **most subs may never be watched**. They could be watched when the user's price equals a catalog plan price for their country.
5. **Small bugs or inconsistencies:** the catalog "Update" sets `amountIsEstimate: true` (index.tsx ~l.220) while the bank "Update" sets `'user'`/false. Drops also show as "went down" cards. Price watch has no "checked date newer than the user's price date" guard: a stale catalog can raise false "went down" cards.
6. Bank path: live aggregator, background refresh, and a notification.

## 4. Feasibility and cost under Ditch's rules

Rules that shape it: local notifications only (no push server; the Supabase server added for bank sync, DECISIONS #64, must not get push tokens or anything that would change "Data Not Collected"), max ~60 pending notifications, honest copy ("our checked price", never "we detected"), Pro feature (DECISIONS #24/#60/#66: price rise is also a listed paywall moment), nothing moves near a price.

### Option A: catalog-based (recommended core)
| Step | What | Effort | Risk |
|---|---|---|---|
| **A1. Rise inside the renewal reminder** (Pro) | When a sub's catalog price for its plan is above its stored price (or an announced price takes effect on or before that charge), the 3-day and 1-day reminder text changes: "Netflix renews in 3 days. Standard is $19.99 now (you have $17.99). Still watching?" Built in `planReminders`/`headsUpBody` from data already on the phone. **Uses no extra notification slots**, needs no background work, and arrives in the existing ~30-day window before the bill. | S: 2–4 days incl. Jest tests | Low |
| **A2. Hosted public price file** | `prices.ditchsubs.app/v1/prices.json` (or a path on the existing Cloudflare `ditchsubs` worker), same file for everyone, fetched at most once a day on launch/foreground, same pattern as `fx.ts` (bundled fallback, cache, 8 s timeout, schema check, refuse absurd jumps). Add an `upcoming` block per plan `{newAmountMinor, effectiveNew, effectiveExisting, source}` from the price-changes research. Privacy label unchanged (public file, nothing about the user); add the line already drafted for the privacy policy. App Review 2.5.2: JSON data is fine. **Stopgap that works today:** ship price edits by EAS Update. | M: ~1 week app + file; weekly robot (A3 in autosync.md) later, ~$0–5/month, plus 10 owner minutes a week to approve | Low–medium (bad data reaches everyone fast, so keep human review + sanity limits) |
| **A3. One stand-alone "price went up" notification** | After a new file shows a rise for a tracked plan, schedule one local note for the next 9:00 ("Netflix Standard is going up to $19.99 from your Dec 3 bill. Still watching?"), once per sub+price key. Only fires when the app has been opened since the file changed. True background download (`expo-background-task`) needs a new EAS build and iOS runs it when it likes, so no promise of timing. | M (S without background) | Medium: timing unreliable without background; uses a slot |
| **A4. Watch more subs** | Treat imported or typed subs as watched when their price equals one catalog plan's price in their country and cycle (store the matched `planId` with a "matched" flag). Otherwise most imported lists get no alerts. | S | Medium: wrong plan match gives wrong alerts; only match exact prices |

### Option B: bank-based (Pro/trial, US/CA)
Already coded (`bankSync.ts` priceChanges, Home card, "caught" list). Missing: live bank sync, background refresh, and a local notification when a sync finds a rise. Cheap to add once bank sync is live (S). But it's **after the charge**, US/Canada only, and free at Chase and Capital One. Use it to **confirm** a catalog alert ("Your Dec 3 Netflix charge was $19.99, our checked price. Update?") and to catch services not in the catalog.

### Option C: user-reported / history
- When a user edits a price upward, keep the old one and show "Up from $17.99 since Mar" (price history, like Outflow's Pro feature). Effort S; useful for the year-in-review and the Ditched moment.
- "Wrong price? Tell us" in the editor (mailto, like the existing "Suggest a subscription") feeds the robot's review queue. No server.
- Low alert value alone.

### Pitfalls (and guards)
- **Regional prices:** 12 countries; the country comes from the iPhone Region or the user's pick, and may differ from the store or card country. Guard: only compare same country + currency + cycle (already done); never convert.
- **Billing channel:** the same service costs more through Apple (e.g. YouTube Premium in-app), carriers, bundles (Disney+/Hulu/Max, Apple One, Verizon, student, annual promos). Guard: only alert when the user's stored price equals the *old* catalog price for that plan, which proves they're on the plain plan. If it doesn't match, say nothing or say "if you pay $X".
- **Plan names and renames** (ESPN+ → ESPN Select, Max → HBO Max, Prime ad-free → "Prime Video Ultra"): keep stable `planId`s and an alias map in the file. Drop the alert when a plan disappears.
- **Grandfathered and staggered rollouts:** new members pay now, existing members a month later, yearly members at renewal, some never (Netflix kept old Basic). Guard: word it as "Our checked price is now X", or use `effectiveExisting` and say "from your next bill after Dec 3". Never "you will be charged".
- **Taxes:** US list prices are before tax and UK/EU include VAT, so bank amounts won't match exactly. Keep the bank threshold (max 50¢, 2%) and never compare bank amounts with catalog prices for alerts.
- **False alerts from stale data:** a user who typed a newer price than our catalog gets a "went down" card. Guard: alert on rises only, and only when the catalog's `checked` date is after the sub's last price edit.
- **Frequency is low** (~2–3 a year): the alert can't carry the paywall alone. Keep it as one row and one upgrade moment (DECISIONS #66), not a headline.
- **Honesty (CLAUDE.md rule 5):** never "we detect price changes automatically" for the catalog path. Say "We check prices on each service's own page". Never claim it for services we don't cover.
- **Free users:** keep notifications free of upsell (the free 3 reminders should keep the plain text). The Home teaser card already does the upsell, and A1 could add a "Prices changed on 1 of your subs" line on the free reminder's Home row.

## 5. Recommendation

1. **Now (S, v1):** **A1**: Pro reminders mention a rise when our catalog price for their exact plan is above what they have. Ship price edits by EAS Update until the file exists. Also fix the small inconsistencies in §3.5 and add **A4** exact-price matching so imported subs are covered.
2. **v1.1 (M):** **A2** hosted daily price file with `upcoming` rises and `effectiveExisting` dates, then the weekly robot with human approval (already planned). Turn the copy into the strongest version: "Netflix renews in 3 days. It's going up to $19.99 (you have $17.99). Still watching?"
3. **Then:** **A3** one stand-alone note only for rises announced more than 7 days before the next reminder, and **B** as confirmation once bank sync is live.
4. **Paywall / store copy (honest):** keep the "Price rise check" row. Store line idea: "Know before a price goes up. We check prices on each service's own page." Rough scores: "Price rise check" 7/10 (current, short); **"Price-rise heads up before the bill" 6/10** (clearer but "heads-up" is banned by DECISIONS #22); **"Know before prices go up" 8/10 (pick for the store/screenshot)**.

**Why it serves the target user and conversion:** our anxious, control-seeking user hates surprise charges. A price rise delivered *at the renewal reminder* turns "surprise" into a decision with a ditch button next to it, which feeds the Ditched moment and retention. It is a real Pro differentiator because it doesn't need a bank, works in 12 countries, and arrives before the bill, where Rocket Money, Chase and Capital One are after the fact and US-only. Frequency (~2–3 a year) means it supports Pro rather than being the reason to buy.
