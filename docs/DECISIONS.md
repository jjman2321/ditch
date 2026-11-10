# Ditch: decisions and research (started Nov 9, 2026)

The source of truth for Ditch. Copied from `jjman2321/MMTEST` (`docs/ditch/DECISIONS.md`) on Nov 9, 2026, and kept here from now on. Where they differ, it overrides `docs/reference/BUILDOUT-ORIGINAL.md` (the older ChatGPT plan). Each entry gives the owner's answer and the date.

## Locked decisions
| # | Topic | Decision | Date |
|---|---|---|---|
| 1 | Name | Keep **Ditch: Subscription Tracker**. Checked US trademarks (see below). | 2026-11-09 |
| 2 | v1 scope | **Manual entry + on-phone import.** Includes a "tick what you pay for" checklist, a catalog, screenshot import (OCR on the phone), and CSV/PDF statement import. No bank link, no server, $0 a month to run, privacy label "Data Not Collected". | 2026-11-09 |
| 3 | App Store subtitle | **"Ditch it before it renews."** The owner chose brand over keywords. "bill reminder" goes in the keyword field and on the screenshots. | 2026-11-09 |
| 4 | Look | **Premium white, no mascot.** Apple-clean white UI, black text, one teal accent, real app logos. Personality comes from the DITCHED stamp moment, the total reveal and a short, dry voice. *(Replaces "clean UI with a mascot", Nov 9.)* | 2026-11-09 |
| 5 | Mascot | **None. The raccoon is retired.** Our buyers are money-anxious adults who want reliability; top-grossing finance apps don't use mascots; cute signals warmth over competence; our raccoon was AI-made and close to BitePal's. It can come back only as a small hand-drawn image in empty states, and only if an App Store screenshot test says people miss it. Research: `docs/research/mascot-or-not.md`. | 2026-11-09 |
| 6 | Pricing | **$4.99/mo · $29.99/yr (pre-selected, 7-day trial) · $49.99 lifetime.** | 2026-11-09 |
| 6b | Lifetime rule | Lifetime is a one-time purchase that unlocks **Ditch Pro only**. Future bank sync ("Auto-sync") will be a **separate subscription**, because it costs money every month. Lifetime users can add it. Paywall text under lifetime: "Everything in Pro, forever. Bank sync, if we add it, is a separate plan because it costs us money every month." Never write "all future features included". We can stop selling lifetime to new buyers at any time. Worst case, even if lifetime users got bank sync for free: about $0.45 per user per month against about $42.50 net per sale, which covers about 8 years. | 2026-11-09 |
| 7 | Onboarding | Welcome (real logos) → tick what you pay for → "That's $X a year. Ditch it." → allow reminders → skippable paywall → home. Import lives on home as "Find more". The owner wants it top class: design each screen from Mobbin references before building. | 2026-11-09 |
| 8 | Tabs | **Home · Calendar · Ditched.** Settings sit behind a gear on Home. *(Changed Nov 9 from Home · Subs · Ditched: Home already lists every sub grouped by week, and Calendar is core to reminders.)* | 2026-11-09 |
| 9 | Cancel-guide website | Publish the guides as ditchsubs.app/cancel/[service] pages **after the app ships**, using the same data as the app. Start with the top 50–100 services, each with a source link and a "checked on" date. | 2026-11-09 |
| 10 | Roast mode | **v1.1**, not v1. | 2026-11-09 |
| 11 | Free tier | **Unlimited tracking, free forever.** The full list, the real total and the calendar are free, plus reminders on **3** subscriptions the user picks (trial-end alerts count toward the 3). **Pro:** reminders on every subscription with custom lead times, screenshot/statement import, widget, iCloud backup. In onboarding, save every subscription the user ticks. If they ticked more than 3, the paywall headline is "Get a heads-up before all N renewals." and the free button is "Continue free: reminders for 3", which opens a picker with the 3 biggest yearly charges pre-selected. If Pro lapses, never delete or hide data; reminders drop back to 3. Say "3 reminders free" in the App Store description and screenshots. Chosen after research; the owner's earlier lean was "5 subscriptions + reminders for 3". | 2026-11-09 |
| 12 | Lifetime price | Keep **$49.99**. Most lifetimes in the category are under $40; ours nudges people toward yearly, and we can test lower later. | 2026-11-09 |
| 14 | Look | **Sunflower** (design/v8 → v9): sunflower yellow #FFCC2E + ink #16140F + cream #FBF7EE, Archivo (wide, 900) for display and money, Inter/SF for body, Ditch the duck with a tangerine bill. Chosen by the owner and ranked #1 by an independent review (`design/v7/REVIEW.md`). Replaces the earlier "premium white" look in #4. | 2026-11-09 |
| 15 | Ditch Pro trial reminders | The trial follows the same rule as every sub: heads-ups **3 days and 1 day before** the charge (Fri, Nov 13 and Sun, Nov 15 for a Mon, Nov 16 charge), and it shows up on the user's list. | 2026-11-09 |
| 16 | Import in v1 | **Free once in onboarding:** scan a screenshot of the Apple subscriptions page (read on the phone with on-device text recognition) to fill in the list with real prices. **Also in v1:** bank/card statement import (PDF/CSV) with the *smarter* repeat-charge detection (merchant clean-up, interval and amount matching), all on the phone. After onboarding, import is Pro. Copy never claims automatic detection: the user shares a screenshot or file and Ditch reads it. Needs an EAS development build (not Expo Go). Research: `docs/research/autosync.md`. | 2026-11-09 |
| 17 | Service prices by country | Catalog prices are stored **per country** (euro prices differ by country; plans differ, e.g. India's Netflix Mobile). v1 covers **12 countries**: US, UK, Canada, Australia, Ireland, New Zealand, Germany, Netherlands, France, Italy, Spain, India. Country comes from the iPhone's Region setting, shown as "Prices for 🇬🇧 UK · Change" (no extra screen). An inline plan chip on ticked rows. If we have no local price: "Add your price", never a converted one. One total per currency (plus the rough "≈ in all" line for mixed lists, #32). Bundled file now (`docs/research/prices-2026-11.json`, verified on official pages), hosted weekly file later (`autosync.md`). Research: `docs/research/niche-teardown.md`. | 2026-11-09 |
| 18 | Growth | **Organic first: ASO + SEO.** ASO before launch: localized name, subtitle and keywords for all 12 launch countries, screenshot set built around the yearly-total reveal and the duck, ratings prompt after a real win (first ditch confirmed or first reminder delivered), Apple Product Page Optimization tests after launch. SEO after launch: ditchsubs.app pages generated from our verified per-country price data, aimed at long-tail searches ("cancel X free trial on iPhone", "X price increase 2026", "X price in the UK") and Italian/German/French/Spanish versions; never thin template pages. Short-form video is optional extra. Reasoning and odds: chat Nov 10 (≈40–60% chance of $5k MRR in 18 months with strong execution). | 2026-11-10 |
| 19 | Savings facts in onboarding | OK to show real study facts (e.g. people underestimate subscriptions by $133 a month, C+R Research; ~$205 a year wasted on unused subscriptions, CNET/YouGov) **without inline citations**. All sources are listed on a Sources page (Settings → About → Sources) and in the privacy/legal pages. Only real, findable studies. | 2026-11-10 |
| 20 | Catalog size | ~220 services. The **top 100** get verified local prices in all 12 countries; the rest get their official logo and an "Enter your price" box. | 2026-11-10 |
| 21 | Devices | Must look right on **every iPhone** (SE 375×667 up to Pro Max 440×956; owner tests on an iPhone 12, 390×844), **iPad** (centred max-width layouts, split views where useful, all orientations), and later **Android incl. foldables/dual-screen**. Every screen is checked at SE, 12/13/14, Pro Max and iPad sizes before shipping. | 2026-11-10 |
| 22 | Wording: reminder | Use **"reminder"** everywhere in the UI, never "heads-up" (an idiom many non-native users miss; "bill reminder" is what people search). Paywall headline: **"Get a reminder before all N renewals."** Free | Pro table: **Reminders · 3 · Unlimited** ("All N" read like a cap). Settings label stays "Remind me". Notification text keeps the dry voice with no label word. Replaces the "heads-up" wording in #11. | 2026-11-10 |
| 23 | Craft bar for type and spacing | Every screen uses the Sunflower type scale and a 4/8pt spacing grid, one 24pt side edge, consistent line heights, no orphaned single words in headlines, no truncation at default text size, and is checked at SE, iPhone 12, Pro Max and iPad sizes and at larger Dynamic Type before it ships. | 2026-11-10 |
| 24 | Freemium (confirmed) | **Keep freemium (option F1)** while growth is organic-only (no ads/UGC): unlimited free tracking + reminders on 3 subscriptions. Sharper Pro: custom timing and price-rise alerts are Pro; the paywall lists only Pro features that work; the Ditch Pro trial never uses a free slot; CSV export stays free. Upgrade moments: a "renewed without a reminder" card on Home, the 4th-reminder tap, price-rise alerts. A hard-paywall mode is built behind a remote switch to test later (when ads/UGC start or at 200+ ratings ≥4.6★). Research: `docs/research/freemium-v2.md`. | 2026-11-10 |
| 25 | Onboarding v11 plan (approved) | Welcome → Quick guess → What you pay for (tick picks the usual plan, "Change" opens a plan sheet) → Your total (guess vs real, one list, "Ditch just one…") → Reminders pre-ask → Charge dates (Apple screenshot first; else "When does X charge you?" day grid; "around Nov 19", no GUESS tags) → Paywall (Free vs Pro table, plan tiles, 3-step trial) → Which 3 (3 slots) → You're set (3-line checklist) → Home. Paywall wording pending research. Research: `docs/research/onboarding-v11.md`, `paywall-v11.md`. | 2026-11-10 |
| 26 | Paywall copy (approved) | Final deck in `docs/research/paywall-wording.md` + Pro list below. Headline "Get a reminder before all N renewals."; logos line; table: Track every subscription ✓✓ · **Subscriptions with reminders 3 · Unlimited** · Choose your reminder times (up to 3 per subscription) —✓ · Second nudge if you miss one —✓ · Import screenshots anytime —✓. Tiles Yearly $29.99 ($2.50 a month, Save 49%, 7 days free) / Monthly $4.99 (No free trial) / Lifetime $49.99 (Pay once). CTA follows the plan. Free button **"Continue free"** with "Reminders for 3 subscriptions" under it. Updates #11 and #22. | 2026-11-10 |
| 27 | Pro at launch, no email | **No email reminders** (needs a server, breaks "Your list stays on your phone", no demand in 4,211 reviews). Instead a no-server reminder backup: time-sensitive reminders + "proof it fired" log (free), second nudge (Pro); Calendar sync + Lock Screen widget in v1.1. **v1 Pro = reminders on every sub, up to 3 reminders per sub at chosen times, second nudge, import anytime.** No Family Sharing at launch. Roadmap: `docs/research/moat-and-pro-features.md`. | 2026-11-10 |
| 28 | Missing catalog prices | Services without a verified local price show "Add your price" at launch; the weekly price robot fills them in after launch. YouTube Premium waits for an official web price. | 2026-11-10 |
| 29 | Onboarding v12 (approved) | Flow: Welcome → What you pay for → Your total (fact line, **no guess screen**) → Charge dates on one screen (quick picks This week · Next week · Later · Pick a day; **no screenshot import in onboarding**, it moves into the app under + Add) → Reminders pre-ask → Paywall (v10 structure: yellow band + duck + white Free vs Pro card, full-width plan cards, one trial line; **no "Continue free" button, the × is the way to free**) → You're set ("Reminders on your 3 biggest · Change"). Design: `design/v12/`. Updates #11, #16, #25, #26 and CLAUDE.md rule 4. | 2026-11-10 |
| 30 | Widget in v1 | **Home + Lock Screen widget moves into v1 (Pro)**: ~half of finance-app users never allow notifications, and the dev build is needed anyway for RevenueCat. Paywall table gains "Home & Lock Screen widget · — · ✓". iCloud backup stays v1.1, iCloud sync v2. Updates #27. | 2026-11-10 |
| 31 | Paywall table labels | Short one-line labels so the Pro column has room: **Subscriptions with reminders · 3 · Unlimited** (2 lines on purpose), **Pick reminder times**, **Nudge if you miss one**, **Lock Screen widget**, **Screenshot import**. Free column 56pt, Pro column fits "Unlimited" with 12pt each side, same text size. Updates #26 and #30. | 2026-11-10 |
| 32 | Rough combined total for mixed currencies | Owner picked option B (Nov 10). When a list has **2+ currencies**, Home and Your total add one small grey line under the real totals: "≈ £69 a month in all · Nov 10 rates" (in the user's own currency, whole units). The real per-currency totals stay; stored amounts, the list, notifications and the Ditched savings are **never converted**. Rates: free daily file from open.er-api.com (Exchange Rate API, credited on Sources), downloaded at most once a day and **only for people with 2+ currencies**; nothing about the user is sent. A snapshot ships in the app (`npm run fx`), the last download is saved on the phone, and the line hides if rates are over 45 days old or any currency is missing (never a partial sum). Rejected: converting catalog prices for uncovered countries (local prices differ a lot, so it would show prices nobody pays) and converting everything (reminders would disagree with the bank). Competitors that convert: Recur, SubPilot, SubManager, Bobby. | 2026-11-10 |
| 13 | Rewards | **No streaks, badges or points.** Reward real results, never app opens. Allowed: money you're no longer paying ("You're saving $431 a year"; never "saved" or "kept", since Ditch can't see the bank), finishing setup ("Reminders 2 of 3 set"), one celebration per ditch, milestones tied to real money ("Saving $500 a year"). If we ever want a streak-like hook: "months with no surprise charges", which doesn't need the app to be opened. Why: Ditch succeeds when people open it rarely and save money; streaks turn into nagging (Tim Gabe gamification research, `docs/research/tim-gabe-notes.md`). | 2026-11-09 |

## Roadmap
- **v1 (about 4–5 weeks):**
  - Catalog of services, with logos in the app.
  - "Tick what you pay for" onboarding, then "That's $___ a year".
  - Reminders.
  - Cancel guides.
  - A Ditched list with savings.
  - On-phone import: `expo-text-extractor`, `expo-pdf-text-extract`, `expo-share-intent`. These need a development build, not Expo Go.
  - Honest paywall.
- **v2:**
  - Apple FinanceKit (Apple Card), if Apple approves. Apply in week 1. It needs the organization developer account (we have one), the Finance category, and a spending-trends view.
  - Optional AI import on a server, only with the user's clear consent.
- **v3:** Bank sync (Teller or Plaid), only once there are a few hundred paying users, and priced as a higher "Auto-sync" tier. First confirm that a founder living outside the US can use it.
- **Skip:** Gmail scanning. It needs a yearly Google CASA security review (~$540+/yr) and only covers some users.

## Research summary (Nov 9, 2026)
### Competitors
Revenue and download figures are AppKittie monthly estimates. Rating counts are from the US App Store.

| App | Revenue / month | How it finds subscriptions | Price |
|---|---|---|---|
| Rocket Money | ~$1M (+ ~$250k on a second listing) | Plaid bank link. Cancels subscriptions for you on Premium. | Pay-what-you-want; Premium+ $15/mo |
| Bobby | ~$33k | Manual + catalog | One-time $0.99–2.99 |
| Pandora | ~$11k | Catalog + share sheet + iCloud | $2.49/yr or $6.99 lifetime |
| Orbit | ~$2k | Manual + "Magic Import" (screenshots, CSV, statements) | $19.99/yr or $24.99–39.99 lifetime |
| Ditchr (Artmvstd SIA, Latvia) | launched Aug 17, 2026; 0 ratings | Manual, no bank | $3.99/mo, $29.99/yr, $39.99 lifetime |
| Most other indie trackers | $0–3k | Manual | — |

Takeaways:
- Apps that don't link a bank sell for about $20–40 a year, or a $25–40 lifetime price. Apps that link a bank charge $100 a year or more.
- An AppKittie search for "subscription tracker" counts about 1,419 apps. Keywords alone won't get Ditch noticed; it needs a hook.

### What reviews say (1,411 recent App Store reviews)
- **Rocket Money** (average 2.2★ lately). Main complaints:
  - the price and the paywall
  - surprise charges, and Rocket Money itself being hard to cancel
  - bank links breaking ("Chase will not allow you to link to rocket money because of plaid")
  - not trusting it with their data
  - "Subscription to cancel subscriptions… The irony is heinous."
- **Bobby:** the #1 low-star complaint is that notifications don't fire. **Reminders that actually work are the product.**
- **Bobby, Orbit:** people praise the one-time price.

### Keywords (AppKittie, US)
| Keyword | Popularity | Difficulty |
|---|---|---|
| subscription tracker | 85 | 28 |
| subscriptions | 85 | 26 |
| subscription manager | 84 | 27 |
| bill reminder | 65 | 23 |
| bill tracker | 57 | 22 |
| track subscriptions | 53 | 17 |
| cancel subscriptions | 28 | 11 |
| free trial reminder | 6 | 5 |

"waste", "forgot" and "honest" have almost no search volume.

### A stat we can cite
In a 2022 C+R Research survey, people guessed they spent $86 a month on subscriptions, but the real total was $219. 42% were still paying for a service they had stopped using. ([CNBC](https://www.cnbc.com/2022/09/06/consumers-underestimate-monthly-subscription-costs-by-at-least-100.html))

Always give the year. Don't copy Orbit's unsourced "$1,500".

### Trademarks
Checked through third-party aggregators, because the USPTO search API was blocked from the sandbox. Re-check on USPTO TSDR before filing.

| Mark | Owner | Status | Classes | Goods / services | Conflict? |
|---|---|---|---|---|---|
| DITCH | Ditch Labs Inc. (Montreal) | Registered 2024 (Reg. 7296301) | 42 | Quit-vaping app + DitchPen device | Different field |
| DITCH | Extent Devices LLC | Registered 2025 (Reg. 7892534) | 9 + 39 | — | Different field |
| DITCHIT | DitchIt LLC | Registered Jan 2026 (Reg. 8120323) | 9, 42, 35 | Buy/sell marketplace app | Different field |
| DITCH IT! | USAopoly (a game) | Dead | — | — | — |
| DITCHR | — | No filing found | — | — | — |

- **Using "Ditch" for a subscription tracker:** low risk.
- **Registering plain "DITCH" ourselves in classes 9/42:** may be refused because of the live marks above.
- **Option:** file a combined name + DITCHED stamp mark, or "DITCH SUBSCRIPTION TRACKER", after a 1-hour check with a trademark lawyer.

### Mascot research (historical: the mascot was dropped, see decision #5)
- **Shortlist:** raccoon 8.5, hamster 7, beaver 6.5, capybara 6.
- **Ruled out:**
  - Crab: SubsCrab owns the crab, and the Arabic سرطان means both crab and cancer.
  - Pig, dog and owl: cultural problems.
  - Hamster: Hamster Kombat gives it a crypto-scam vibe.
- **Raccoon clashes to stay away from:**
  - BitePal, a calorie app with a raccoon mascot.
  - Goodfood's "Richard the Raccoon" in Canada.
  - Rocket Raccoon. Never name ours "Rocket".
- **How to draw it:** keep it clean. It tosses things into the bin, it never eats trash. Use 3–4 flat colours, no teeth, no fur texture.
- **Optional villain:** a magpie that hoards subscriptions.

### Paywall pattern to copy
A trial timeline (Today → reminder day → charge day) with real dates. References: Mimo, 5 Minute Journal.

Ditch twist: when a trial starts, Ditch adds "Ditch Pro trial" to the user's own list and reminds them 2 days before the charge.

## Still open (next interview rounds)
- **App icon (parked Nov 9, owner: "not bad but doesn't feel professional, later"):** favourite so far is duck 6 reframed (`design/icon/hf-6-peek-up240.png`). Needs a professional redraw before it ships.
- **App icon: stamp or a flat animal mark?** Bobby (4.7★, 8,033 US ratings, no update since Dec 2025) uses a squirrel *only* as its icon: no squirrel in its App Store screenshots, which sell colourful real-logo cards. An icon is the one place a character can't sit near money, and it helps stand out in search. If we try it: a flat, hand-finished mark (not the AI 3D raccoon, not raccoon-like BitePal), tested against the stamp icon with App Store Product Page Optimization after launch. In-app stays character-free either way (#5).
- Screen-by-screen onboarding and home designs.
- Languages.
- Testing setup: iPhone + Mac, Expo dev build via EAS.
- Mascot design via Higgsfield (show the credit cost first).

### Free-tier evidence (Nov 9, 2026)
- **Competitor free tiers:**
  - Bobby: 5 subscriptions free, then a one-time $0.99 unlock.
  - Subo: 6.
  - Orbit: 3–5.
  - Chronicle and Costly: no cap.
  - Subpilot and MonoBoost: hard paywall.
- **Hard paywall vs freemium** (RevenueCat 2026): median download-to-paid is 10.7% vs 2.1%. One-year retention is about the same.
- **Day 0 is when people decide:** 82–89% of trial starts happen on install day.
- **Reviews:**
  - MonoBoost (hard paywall): 20% of reviews are 1–2★ complaints about money or "scam".
  - Bobby (5-subscription cap): 5%, e.g. "Free version useless… only 5 entries".
  - Chronicle (unlimited free): 2%.
- **Apple rule 3.1.2(a)** forbids bait-and-switch. A subscription cap would make the onboarding "That's $X a year" total include services the free app then won't save.
- **Blinkist:** its honest trial timeline raised trial starts 23% and cut complaints 55%.

## Bank sync research for v3 (Nov 9, 2026)
**How Plaid works:**
1. Our server gets a `link_token`.
2. The app opens Plaid Link and the user logs in to their bank.
3. The app gets a `public_token`.
4. The server swaps it for a permanent `access_token`, one per bank login (Plaid calls it an "Item").
5. Data comes from `/transactions/sync` plus webhooks.

**Recurring Transactions** (`/transactions/recurring/get`) already returns subscription "streams": merchant, amount, frequency, `predicted_next_date`, and whether each one is active. Built-in subscription detection.

A server is mandatory because of the secret keys and webhooks. The React Native SDK works in Expo dev builds, not in Expo Go.

**Plaid Trial (since Apr 2026):**
- Free, 10 real bank connections total, US/Canada developers only.
- Applying for paid Production ends the Trial for good.

**Plaid Production:**
- A few business days, plus a security questionnaire and OAuth registration.
- Prices are not public. Transactions is about $0.25–0.30 per bank per month; the Recurring add-on price is unknown.
- Billing runs every month the connection exists, even if it's broken. Call `/item/remove` the day a user stops paying.
- **Eligibility for an Egypt-based founder with a US LLC is unverified.** Test it by applying for the Trial.

**Alternatives:**
| Option | Price | Notes | Score |
|---|---|---|---|
| Stripe Financial Connections | **$0.30 per bank per month, published** | US only. No recurring detection. Eligibility clearest (non-US owners of a US LLC allowed). | 7.5 (fallback) |
| Teller | ~$0.30 | 100 free connections. No React Native SDK. | 5 |
| SimpleFIN | User pays $1.50/mo | Clunky for normal users. | 4 |
| MX, Finicity, Yodlee, Akoya | Sales contracts only | Not realistic for v3. | — |
| Quiltt | $100/mo + $2 per user | Too expensive at small scale. | — |
| FinanceKit | Free | On-device extra for Apple Card users. | — |

**Pick:** Plaid as primary (8/10), Stripe Financial Connections as fallback.

**Money at $4.99/mo Auto-sync:**
- $4.24 left after Apple's 15%.
- About $3.34–3.79 left per user after aggregator costs, at 1.5 banks per user.
- If bank data-access fees rise, price Auto-sync at $5.99. (The CFPB open-banking rule is blocked by a court and being rewritten; the draft reportedly allows banks to charge fees.)

**Set up now (all free):**
1. Plaid Sandbox account.
2. Apply for the Plaid Trial as Grasp Labs LLC. Don't apply for paid Production yet.
3. Stripe account for the LLC, testing Financial Connections in test mode.
4. FinanceKit entitlement request.
