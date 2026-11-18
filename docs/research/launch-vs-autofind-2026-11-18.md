# Launch now, or wait for Auto-Find? Plus every bank-link option re-checked (Nov 18, 2026)

Pairs with `finder-apps-2026-11-18.md`, `find-subs-2026-11-16.md`, `demand-2026-11-18.md`, `monetization-2026-11-18.md`, `autosync.md`. **(est.)** = my own model number. Spend: AppKittie 0 credits (earlier docs already hold the revenue data); web search and fetch only. Nothing here changes a locked DECISION until the owner says so.

## Short answer
1. **Launch now. Don't wait.** Ship v1 in early December with the finder-style paywall (finder doc pick #4). Build Auto-Find as an optional US/Canada **"Bank Scan"** and ship it in v1.1, around **Feb 9–23, 2027**. Score **8/10**. Soft-launch: 4/10. Waiting: 3.5/10.
2. **Auto-Find isn't a moat. It's a feature anyone can buy.** Plaid's free Trial gives any US developer real bank data in about a day. MonoBoost, Subpilot, Feenko and Rocket Money already have it, and their reviews are rough. It raises **money per download**, but it doesn't bring **downloads**, and downloads are Ditch's bottleneck. Ditch's real moats are what bank data can't see: Apple-billed subscriptions, free-trial end dates, the Apple bill matcher, the prices in 29 countries, the website and honesty.
3. **There is no proof of a one-time "new app boost" to waste.** Sonar's 2026 study of 34 new apps found no launch spike in keyword ranks. Apple also lets you **reset the rating summary** with any new version, and **Featuring Nominations** plus **In-App Events** let a big v1.1 act like a relaunch. With 1 waitlist signup, a quiet v1 harms almost nobody's first impression.
4. **Is ~$4/month for reminders worth it? Barely, and you're right about that.** Manual trackers make a median of ~$3k a month, and none reliably make >$10k. The money is in the **reveal and find moment** and in **trial-end alerts**, not in reminders. That's why v1 should launch with the find-results paywall.
5. **Plaid timeline, really:** the Trial plan (free, 10 bank connections, "most applications approved automatically") takes a day. A paid Production application is "mostly reviewed automatically" in several business days. The security questionnaire comes after that. Chase can lag: a 2025 second-hand report said 3–4 months. **Risk:** the Trial is only for developers "located in the United States or Canada", and a founder outside the US is unverified (DECISIONS bank-sync notes).
6. **Cheapest US path:** Plaid pay-as-you-go, **Transactions only**, with Ditch's existing on-phone repeat detector doing the finding (no Recurring add-on). Default to **"scan once, then disconnect"**, which costs about one month's fee per bank (~$0.30–0.50, est.). Fallback if Plaid says no: **Stripe Financial Connections**, $0.30 published, but only 180 days of history.
7. **CFPB 1033 won't make bank data free.** The rule is stayed and being rewritten. The new draft went to White House review in Aug 2026 and considers **letting banks charge fees**. JPMorgan already charges Plaid. Plan for costs to rise.
8. **Year 1 (est.):** launch now + Bank Scan in v1.1 ≈ **$40–46k base** (bear ~$8k, bull ~$115–135k), against ~$32–36k for launching without it and ~$27–31k for waiting. If Plaid refuses us, "launch now" still earns the no-Auto-Find number. "Wait" earns nothing until a fallback is built.

## Part 1. Launch now vs wait

### 1.1 What launching now actually buys
| Claimed benefit | Evidence | Real value for Ditch |
|---|---|---|
| Apple's "new app boost" | No Apple confirmation. Sensor Tower (2014, 2 apps) saw ~7 days. **Sonar 2026 (34 new iOS apps, Mar–Jul 2026, vs 72 controls): "no spike in week one, no slide after it"**: median rank change 0 to +3. New apps were just noisier (19–30% slipped 10+ places vs 6–18%). Limit: tracking started ~day 5 | **Low.** If it exists at all, it lasts days and comes from outside traffic. Nothing big to "waste" |
| Ratings piling up | 3★ → 4★ raises conversion a lot (NP Digital index 0.57 vs 0.83; the "89%" figure is a 2015 survey). Rating prompt only after wins (DECISIONS #38) | **Medium-high.** Ratings take months to build. Starting in Dec means ~20–60 ratings by Feb (est.) |
| Real conversion data | You need ~3,400 installs per variant to read a +30% change in trial starts (monetization doc) | **High, but slow.** Every month earlier helps the 7- vs 14-day trial test and the $29.99 vs $39.99 test |
| Learning App Review, StoreKit, refunds and support | First submissions often get rejected once for metadata, 3.1.2 or 2.1 | **High.** Better to learn on v1 than on the Plaid version, which needs stricter privacy answers |
| ASO indexing time | Keyword-field changes only go live with a new version. Sonar: updates don't move ranks (218 releases, median change 0) | **Medium.** Starts rank history. v1.1 can add "bank" and "find" keywords |
| Waitlist | 1 signup | **None.** No audience to disappoint |

### 1.2 What waiting buys, and what a weak v1 really costs
- **Waiting buys** one first impression with the strongest feature, and US reviews that mention "it found my subs". It's real but small: almost nobody is watching yet.
- **What a mediocre v1 costs:** a low average and some 1–2★ text. The tools to undo it:
  - **Reset Summary Rating** on any new version (App Store Connect → version → Reset Summary Rating). It's permanent and covers that platform, and written reviews stay. Use it only if v1 averages under ~4.2★.
  - **Featuring Nominations** are tied to releases and updates. Nominate "Bank Scan" for v1.1.
  - **In-App Events:** up to 10, with 5 live at once. They show in search and on the product page ("Find every subscription in your bank, new").
  - **Product Page Optimization**, plus custom product pages for "find" vs "track".
- **What doesn't undo it:** updates alone. Sonar saw no rank lift from releases. A "relaunch" works through editorial, events, website/SEO pushes and the rating reset, not through the version bump.
- **Net:** a weak v1 is recoverable. A bad Plaid launch is harder to undo: broken links, "my bank isn't listed" (7% of MonoBoost complaints) and privacy fear (7%).

### 1.3 Middle paths
| Path | For | Against | Score |
|---|---|---|---|
| **Launch worldwide now (12 countries), Bank Scan for US/CA in v1.1** | Every benefit above. Bank Scan becomes a "relaunch" moment | US reviews before Bank Scan come from manual-only users | **8** |
| Soft-launch NZ/IE only | Learn App Review, crash-free, funnel shape | A manual tracker gets a few dozen organic installs a month there (est.), far below the ~3,400 per variant needed. **Plaid pay-as-you-go doesn't serve EU/UK users** ("only Custom plans"), and NZ isn't on Plaid, so it teaches nothing about Auto-Find. Sonar 2026: market choice "should follow a specific learning question" | 4 |
| Launch free or cheap, add a higher tier later | Gets ratings faster | Training users that it's free makes later paywalls feel like a bait-and-switch. Lifetime buyers at a low price block margin | 4.5 |
| TestFlight public beta to build a waitlist | Free, up to 10,000 testers, real feedback | Doesn't rank or earn. **The Plaid Trial caps at 10 bank connections**, so a public Bank Scan beta is impossible until paid Production | 5 (as a side path for 2–3 weeks only) |
| Wait for Auto-Find | One strong first impression | Loses ~2.5 months of ratings, data and ranking. The Plaid eligibility risk could push it to "never" | 3.5 |

### 1.4 Is reminders + manual tracking + on-phone find worth $29.99/yr to anyone?
- **Who pays in this niche (AppKittie, Nov 18, earlier docs):**
  - Manual freemium trackers: **median ~$3k a month**, top ~$4–6k, ~$0.73–0.79 per download.
  - Bank-link apps: ~$2.69 per download (Hiatus ~$11.7k a month).
  - Hard-paywall "finder" apps: ~$6 per download, but the revenue is bought with ads and they collect the scam reviews.
- **Honest answer:** reminders alone are worth "barely". People pay for **the moment they see the number**: "$1,140 a year, 2 trials end this week". That's why the finder doc's pick #4 (find results and trial ends locked, × to the free Lite mode) roughly doubles money per download (~$0.8–1.05 → ~$1.6–1.8, est.).
- **What v1 really is:** a modest business, ~$1–3k a month by month 12 in the base case. It's not a reason to wait. It's the floor that Auto-Find builds on.

### 1.5 Realistic Auto-Find timeline (from today, Nov 18)
| Step | Time | Source / note |
|---|---|---|
| Plaid Trial sign-up (US/CA developers; 10 Items; Transactions incl. Recurring; Chase, BofA, Wells and more at once) | 1 day ("most… approved automatically"; manual review answers in 2–3 business days) | Plaid help, updated Oct 14, 2026 |
| Build: Supabase backend, Plaid Link in the dev build, results screen | 3–4 weeks with Claude (est.) | Reuses the statement repeat detector and the results UI |
| Paid Production application (business, products, owners, plan) | "Several business days"; "most applications are reviewed automatically" | Plaid help, Oct 2026 |
| Security questionnaire (unlocks after approval), OAuth registration (1024px icon, name, site, MSA addendum) | Days to weeks. **Chase: a 2025 second-hand report says ~3–4 months** | Plaid OAuth docs; Schwab "up to 5 business days" |
| App Review for v1.1 (new label, finance data) | 1–3 days; **Apple's holiday break ~Dec 22–27** | |
| **Realistic ship** | **Feb 9–23, 2027.** Chase may only join later for new links | |

### 1.6 Recommendation: launch now (8/10), dated plan
- **Nov 18–Dec 5:** finish M2 (StoreKit 2); build pick #4 (trial-first paywall after the reveal or find results, find details locked, × to Lite); live Terms, Privacy and Support pages; real-iPhone reminder test.
- **Owner, today:** apply for the Plaid Trial (§2.5). It settles the eligibility question in 1–3 days.
- **Dec 8–12:** submit v1 (12 countries). Target live by ~Dec 15, ahead of Apple's break.
- **Dec 15–Jan 16:**
  - Build Bank Scan on the Trial (10 Items: owner and friends).
  - Apply for paid Production around Jan 5.
  - Submit the security questionnaire as soon as it unlocks.
- **Jan 19–Feb 6:** v1.1 TestFlight with real banks, the label and privacy policy update, the Featuring Nomination and an In-App Event.
- **~Feb 9:** submit v1.1. Decide on a rating reset only if v1 is under 4.2★.
- **Mar–Apr:** compare Bank Scan users with screenshot users. Go/no-go on "Live sync" (§3).

## Part 2. Bank-link providers (checked Nov 18, 2026)
Every server-side aggregator below needs **our own server** (secret keys, tokens, webhooks). Using one changes the privacy label to at least **"Data Linked to You: Financial Info"**: Apple counts data that "third-party partners whose code you integrate" collect. The optional-disclosure exemption doesn't fit, because it needs infrequent, non-core data typed by the user each time. Only FinanceKit, and SimpleFIN called from the phone, keep "Data Not Collected".

### 2.1 US and Canada
| Provider | Coverage | Recurring detection | Price | Minimum | Solo LLC self-serve? | Approval | RN/Expo | Fit |
|---|---|---|---|---|---|---|---|---|
| **Plaid** | US/CA ~12k institutions; EU/UK only on Custom plans | Yes (`/transactions/recurring/get`, US/CA), a separate subscription product | Pay-as-you-go price is shown only in the Production form. Reported ~$0.25–0.30 per Item a month for Transactions, more with Recurring. Billed monthly while a token exists, not prorated | Pay-as-you-go: none. Growth: annual minimum (reported ~$1k/mo). Custom: >$2k/mo | **Yes** (Trial, then pay-as-you-go). Trial requires being "located in the US or Canada" | Trial ~1 day; Production several business days, then the questionnaire and OAuth | `react-native-plaid-link-sdk` 13.5.0 (Nov 12, 2026), dev build | **8.5** |
| **Stripe Financial Connections** | US accounts (Canada for payments); businesses in the US and 30+ EU/EEA countries | No | **Published:** transactions $0.30 per institution per account holder a month; balances $0.10/call; ownership $1.50 | None | **Yes**, after "Financial Connections registration". Clearest path for a US LLC | Registration in the Dashboard | `@stripe/stripe-react-native` 0.85.1 | **7** (fallback; **180 days of history**, so some yearly subs get missed) |
| **Teller** | ~7,000 US institutions, strongest at big banks | No | **Published:** transactions $0.30/enrollment/month | None. **100 live connections free** | Yes | Sign-up | iOS/Android SDKs, no RN package (WebView or a native bridge) | 6 |
| **MX** | 16k US | Yes (enrichment) | Sales only | Enterprise | No | Contract | Via Quiltt | 3 |
| **Finicity (Mastercard Open Finance)** | 15k US | Partly | Sales; per event | Contract | Sandbox only | Contract | Via Quiltt | 3 |
| **Akoya** | ~750 institutions, API-only (no scraping) | No | Not published; "Standard <10k connections, self-service sign-up"; setup fee possible | Unclear | Sandbox self-serve | Registration | No | 3 |
| **Yodlee (Envestnet)** | 17k sources | Yes | Enterprise contract | High | No | Contract | No | 2 |
| **Quiltt** (wrapper over MX, Finicity, Akoya, Plaid) | Same as the source it uses | Through enrichment providers | **Builder $100/mo, 50 active users, then $2/user/mo**; Startup $500/mo annual | $100/mo | Yes | Fast sandbox | **RN SDK** | 5 (the self-serve doorway to MX/Finicity, pricey per user) |
| **Flinks (CA)** | Canada + US | Partly | **$500/mo for 200 connections**, $1,250 for 1,100; 1-year term | $500/mo | No (demo first) | Contract | No | 2 |
| **SimpleFIN Bridge** | US, via MX behind the scenes | No | **User pays $15/yr** (or $1.50/mo) for 25 institutions | — | Developer waitlist | — | Works from the phone with a pasted token (no server) | 3 (too clunky for our users) |

### 2.2 Other regions (for later; none are self-serve for a solo LLC)
| Provider | Region | Price / access | Note |
|---|---|---|---|
| TrueLayer | UK/EU | Sales-led; old starter tiers ~£150–300/mo | Pricing page removed |
| Tink (Visa) | EU/UK | Enterprise; four-figure monthly commitment typical | Indies sent to partners |
| Yapily | UK/EU | ~£200–500/mo entry (reported) | Needs a sales call for production |
| Enable Banking | EU/Nordics | Quote form since Apr 2026; production before contract, but **no public apps before a contract** | |
| Salt Edge | EU, CEE, MENA | No public price list; Partner Program for apps without a PSD2 licence | The "self-serve plans" in the brief: **not found in 2026** |
| GoCardless (Nordigen) | EU/UK | **New sign-ups disabled**; free tier removed | Existing users only |
| open-banking.io (new) | EU | **€3/mo first account, €1 each extra, self-serve** (from the founder's own article) | Tiny and unproven |
| Basiq (AU) | Australia | A$0.50/user/mo + A$500/mo minimum; Launchpad A$250/mo | |
| Akahu (NZ) | NZ | Free personal plan; app pricing not published | |
| Belvo | LatAm | Tiers from ~$1k/mo (reported); launched MCP servers Aug 2026 | |
| Lean / Tarabut | UAE, KSA | Sales-gated; licensed (Lean: SAMA Mar 2026) | MENA later |
| Mono | Africa | Not checked in depth (out of scope) | |
| **New, AI-agent style (2026):** Subaio MCP (Nov 2026, subscriptions, sold to Nordic banks), Bud, Meniga Fini, Mercury, HSBC, Danske | Mostly EU/corporate | Sold to banks or enterprises | **No new self-serve consumer aggregator found** |

### 2.3 Routes that aren't aggregators
- **Apple FinanceKit:**
  - Free and on-phone, and the label stays "Data Not Collected".
  - Covers US **Apple Card only**, plus UK banks through open banking (iOS 18.4+: Barclays, HSBC, Lloyds, Monzo, Nationwide…). It's a managed entitlement with long, uneven waits.
  - iOS 27 Wallet **Insights** ("recurring transactions… across accounts") works in the UK. In the US it's a placeholder or was pulled. It isn't tied to FinanceKit yet. **Watch WWDC27:** if Apple opens Wallet-connected accounts to FinanceKit, that's the free US route.
- **Card networks:** Visa Subscription Manager (enhanced Mar 2026, to North American issuers summer 2026) and Mastercard subscription controls (with Subaio) are **issuer-only**: they live inside the bank's own app. No route for an independent app.
- **Email:**
  - Gmail restricted scopes need verification plus a **yearly CASA audit**: Tier 2 ~$540–1,800 through TAC Security, 2–8 weeks plus Google's queue (2024 prices). No on-device exemption is listed.
  - Outlook (Graph `Mail.Read`): users consent themselves and publisher verification is free, but few of our users use Outlook.
  - Still v2 at the earliest.

### 2.4 CFPB 1033 (open banking rule)
- **The 2024 rule** banned banks from charging fees. A court stayed it (Forcht Bank, KY).
- **Reconsideration:**
  - The CFPB issued an advance notice in Aug 2025 asking whether "reasonable fees" should be allowed. Banks (CBA) asked for no fee cap.
  - The proposed rule went to OIRA (White House review) on **Aug 6, 2026**. I found no Federal Register publication yet.
  - Plaid's help page (Oct 15, 2026): "in flux… not proactively enforcing".
- **Fees are already here:** JPMorgan made Plaid pay for Chase data (Sep 2025). Plaid said customer pricing didn't change at the time.
- **Bottom line:** no free bank data for apps soon. Model at least +30% cost headroom.

### 2.5 Cheapest, fastest path for a solo dev, US-first
**Pick: Plaid pay-as-you-go, Transactions only, "Bank Scan" (connect once, disconnect). Fallback: Stripe Financial Connections.**

**Sign-up steps (owner only):**
1. Go to dashboard.plaid.com/signup and create a new team as **Grasp Labs LLC**. Choose the **Trial** plan, accept the MSA and pass identity verification. If it refuses because you're outside the US, write to Plaid Sales and go straight to step 4. Fallback: Stripe → Settings → Financial Connections registration.
2. In Dashboard → Application display, add the name "Ditch: Subscription Tracker", the 1024×1024 icon, ditchsubs.app and the redirect URI `https://ditchsubs.app/plaid-oauth` (a Universal Link; needs the Apple Team ID file on the site).
3. Put the Plaid client ID and secret into the **Supabase dashboard → Edge Functions → Secrets** (or `supabase secrets set`). Never paste them into chat or the repo.
4. When ready, Dashboard → **Get Production access**: business = consumer personal finance, subscription finder; product = **Transactions only** (not Recurring, not Auth); beneficial owners; **Pay-as-you-go** (note the price shown), then submit.
5. Then complete the security questionnaire and the OAuth registration (MSA addendum).
6. Create a **new Supabase project** (not AnkiDecks), US region, **Pro $25/mo** (the free tier pauses).
7. Update the App Store privacy label (Financial Info, Linked, App Functionality) and the privacy policy (Plaid named, deletion on request).

**Backend (Supabase Edge Functions; ~6 small functions):**
- `link-token`:
  - Signed in with Supabase anonymous auth.
  - Checks entitlement: a free-scan quota, or the StoreKit 2 signed transaction verified on the server (no App Store key needed).
  - Calls `/link/token/create` with `transactions.days_requested: 730` (catches yearly subs), US/CA only, redirect and webhook.
- `exchange`:
  - Swaps the public token for the access token.
  - Stores it **encrypted (Supabase Vault)** in a table with RLS and no client access.
- `scan`:
  - Runs `/transactions/sync` until done (the first pull can take minutes; wait for the webhook).
  - Returns date, amount and merchant to the phone and **stores no transactions**.
  - The phone runs Ditch's existing repeat detector and the confirm list.
- `remove`:
  - Calls `/item/remove` right after a scan (Scan mode).
  - In Live mode, removes it when Pro lapses. App Store Server Notifications v2 come into an Edge Function, plus a daily cron sweep.
- `plaid-webhook`: verifies Plaid's signed JWT.
- **Phone:** `react-native-plaid-link-sdk` in the EAS dev build. Copy: "We connect once, find your subscriptions, then disconnect. You pick what goes in." Never "automatic" for non-US users.

**Monthly cost (est.):** 1.6 bank logins per user; $0.25–0.50 per Item a month (Transactions, reported, not confirmed); Supabase $25.
| Linked users | Live sync (connection kept) | Scan-only (1 month's fee per scan) |
|---|---|---|
| 100 | ~$65–105/mo | ~$65–105 one time + $25/mo |
| 1,000 | ~$425–825/mo | ~$400–800 one time + $25/mo |
| 10,000 | ~$4–8k/mo (Growth plan would cut this) | ~$4–8k one time + ~$25–75/mo |

**Pricing to profit:**
- **Live sync** costs ~$0.40–0.80 per user a month. Yearly $29.99 nets ~$25.50 after Apple's 15%, leaving ~$16–21 after Plaid. Monthly $4.99 nets $4.24 and leaves ~$3.40–3.80.
- **Lifetime can't include Live sync** (DECISIONS #6b holds).
- **Scan-only** costs ~$0.40–0.80 once per scanner, so any paid plan covers it, even a free scan with the details locked (≈ $0.09 per download if 30% of US users scan, est.).

## Part 3. Verdict
**Plan: launch now (8/10), Bank Scan in v1.1. Don't soft-launch, don't wait.** Auto-Find raises revenue per US download, so treat it as a conversion feature, not as the moat.

**Auto-Find build plan:**
| Week (starts) | Work |
|---|---|
| 0 (Nov 18) | Owner: Plaid Trial and Stripe registration. Claude: finish v1 (M2, pick #4) |
| 1–3 (Dec 15) | Supabase project, the 6 functions, Vault, StoreKit-signed entitlement check |
| 3–4 (Jan 5) | Plaid Link in the dev build, OAuth Universal Link, scan → repeat detector → confirm list. Production application |
| 5 (Jan 19) | Security questionnaire, label and policy, TestFlight on 10 real banks, Featuring Nomination, In-App Event |
| 6–7 (Feb 2) | Fixes. Submit ~Feb 9. Live ~Feb 9–23 |
| +4–8 wks | Data: scan rate, trial starts, refunds, bank failures. Go/no-go on Live sync |

**Pricing model (needs owner OK; changes #6, #11, #16/#34, #24):**
- **Free (Lite):** unlimited manual tracking, totals, calendar, reminders on 3, the Apple-screenshot find. Results show count, logos and yearly total; dates and trial ends are Pro.
- **US/CA:** **one free Bank Scan** per device, same locked-details rule.
- **Pro, $29.99/yr with a 7-day trial, $4.99/mo:** reminders on everything, all finding, Bank Scan again every 90 days. Test **$39.99** once Bank Scan ships (RevenueCat's NA yearly median).
- **Lifetime $49.99:** Pro plus the screenshot and file finding, with one Bank Scan a year.
- **Auto-sync (Live, later, only on demand):** $6.99/mo or $49.99/yr, never in Lifetime.
- **Paywall moment:** full-screen and trial-first, right after the find results ("Found 9 · $1,140 a year · 2 trials end soon"), with the × in the first frame leading to Lite. Rule 4 honesty holds.

**Year 1 (Dec 2026–Nov 2027, est.).** Downloads come from the demand doc: bear 4k, base 20k, bull 55k, ramping. Money per download:
- $1.6–1.8 without Bank Scan.
- ~$2.0–2.3 blended with it: US ~50% of downloads, lifted toward the $2.69 bank-link benchmark.
- +10% downloads after v1.1 from find keywords.
- Bank Scan cost ~$0.09 per download plus $300 a year.
- Probabilities: bear ~45%, base ~40%, bull ~10–15%.
| Plan | Bear | Base | Bull |
|---|---|---|---|
| A. Launch now, no Auto-Find (pick #4) | ~$6–7k | ~$32–36k | ~$90–100k |
| **R. Launch now + Bank Scan v1.1 (PICK)** | **~$7–9k** | **~$40–46k** | **~$115–135k** |
| W. Wait, launch with Auto-Find ~Feb 15 (~64% of the download curve inside the window) | ~$5k | ~$27–31k | ~$80–90k |
| R if Plaid refuses us | = A, plus Stripe FC ~6 weeks later | | |
| W if Plaid refuses us | $0 until a fallback ships | | |

## Caveats
- **Plaid prices are hidden until the Production form.** The $0.25–0.50 range is third-party and could be higher with Recurring. Re-run §2.5's table with the real number.
- **Owner eligibility:** the Plaid Trial says "located in the United States or Canada". A US LLC with a founder abroad is unverified for both Trial and Production. Stripe FC's eligibility is clearest.
- The Chase "3–4 months" figure is a second-hand 2025 report. Plaid's own docs give no Chase timing.
- The new-app boost study (Sonar) is a vendor's small sample of keyword ranks only; it didn't measure Browse or featuring.
- Every Ditch revenue figure is my estimate built on AppKittie model data (App Store only) and RevenueCat/Adapty medians. Bank Scan's uplift is untested; the March data decides it.
- Bank Scan changes "Data Not Collected" for the whole app. Website copy must stay "Your list stays on your phone" (still true if transactions aren't stored) and must never say "Nothing leaves your phone".

## Sources
- **Plaid:**
  - [Trial plan](https://support.plaid.com/hc/en-us/articles/39994173227159), [plans](https://support.plaid.com/hc/en-us/articles/16110502116887), [upgrade](https://support.plaid.com/hc/en-us/articles/39917307426967), [OAuth registration](https://support.plaid.com/hc/en-us/articles/15373800196759), [1033 FAQ](https://support.plaid.com/hc/en-us/articles/26586096919063) (read via the Zendesk API, updated Oct 2026)
  - [billing](https://plaid.com/docs/account/billing/), [OAuth guide](https://plaid.com/docs/link/oauth/), [ActivePieces 2026 prices](https://www.activepieces.com/blog/plaid-pricing-2026-cost-per-connection-and-request), [StackOne timing](https://docs.stackone.com/connectors/plaid/guides/connector-profile/oauth-2-0-production)
- **Other US providers:**
  - Stripe: [FC page](https://stripe.com/financial-connections), [availability](https://docs.stripe.com/financial-connections), [transactions, 180 days](https://docs.stripe.com/financial-connections/transactions)
  - [Teller](https://teller.io/), [Quiltt pricing](https://quiltt.io/pricing), [Akoya pricing](https://akoya.com/pricing), [Flinks pricing](https://flinks.com/pricing/)
  - [FintechSpecs Jul 2026](https://fintechspecs.com/blog/plaid-alternatives-bank-data-connectivity/), [Frandsen Aug 2026](https://dev.to/johnfrandsen/the-cheapest-open-banking-apis-for-small-businesses-and-indie-builders-in-2026-5cab), [GoCardless closed](https://dev.to/johnfrandsen/gocardless-bank-account-data-alternatives-what-to-use-when-signups-are-disabled-326d), [Enable Banking FAQ](https://enablebanking.com/docs/faq), [Basiq](https://new.basiq.io/pricing.html), [SimpleFIN](https://beta-bridge.simplefin.org/), [MCP launches](https://ffnews.com/news/pressrelease-talk-to-your-finances-9ad63b5d)
- **Apple:**
  - [Privacy details](https://developer.apple.com/app-store/app-privacy-details/), [reset summary rating](https://developer.apple.com/help/app-store-connect/monitor-ratings-and-reviews/reset-an-app-summary-rating), [Featuring Nominations, WWDC24](https://developer.apple.com/wwdc24/10063), [In-App Events, AppTweak](https://www.apptweak.com/en/aso-blog/what-are-in-app-events-how-do-they-impact-aso)
  - [FinanceKit](https://developer.apple.com/financekit), [Wallet Insights iOS 27](https://www.macrumors.com/2026/06/22/ios-27-beta-2-insights-wallet/), [Gadget Hacks](https://apple.gadgethacks.com/news/ios-27-wallet-insights-feature-appears-in-beta-2-without-us-support/)
- **Launch:**
  - [Sonar new-app boost 2026](https://trysonar.app/blog/app-store-new-app-boost), [Sonar soft launch](https://trysonar.app/blog/app-soft-launch), [Sensor Tower 2014](https://sensortower.com/blog/why-app-store-keyword-rankings-drop-dramatically-seven-days-after-launch)
  - [NP Digital rating index](https://neilpatel.com/marketing-stats/app-downloads-vs-ratings/), [Adapty soft launch](https://adapty.io/blog/soft-launch-meaning/)
- **Rules:**
  - [CFPB ANPR](https://www.federalregister.gov/documents/2025/08/22/2025-16139/personal-financial-data-rights-reconsideration), [OIRA, Aug 2026](https://www.consumerfinancemonitor.com/2026/08/06/cfpb-sends-new-section-1033-open-banking-proposal-to-oira-for-review/), [PYMNTS fees](https://www.pymnts.com/legal/2026/cfpb-readies-changes-to-open-banking-rule/), [JPMorgan–Plaid](https://www.paymentsjournal.com/plaid-agrees-to-pay-jpmorgan-chase-fees-to-access-data/)
  - [Visa Subscription Manager](https://developer.visa.com/capabilities/visa-subscription-manager), [Mastercard controls](https://finextra.com/newsarticle/42573/mastercard-launches-subscription-control-tool)
- **npm (Nov 18):** react-native-plaid-link-sdk 13.5.0, @stripe/stripe-react-native 0.85.1, @quiltt/react-native 6.2.0, expo-finance-kit 0.2.23.

## Addendum (Nov 18): owner eligibility (Egypt-based founder, US LLC) and why bank scan is US/Canada only
- **Plaid Trial:** open to "developers located in the US or Canada" (Plaid support). Plaid doesn't say whether that means the company or the person. Grasp Labs LLC has a US address and EIN, so apply as the company; Plaid's identity check reportedly accepts passports for non-US founders (Meow blog, unverified). **Unconfirmed until we apply.** Europe-based companies get Custom plans only; UK banks need an Enterprise account.
- **Stripe Financial Connections:** generally available to **US businesses** (Stripe support). Stripe says LLC members don't need to be US citizens or residents. A US LLC with an active Stripe account should qualify; also unconfirmed for this exact case.
- **Why other countries are out:**
  - **UK/EU:** open banking needs a regulated account-information provider. Aggregators (TrueLayer, Tink, Plaid EU) sell only custom/enterprise contracts, and GoCardless is closed to new signups.
  - **Egypt:** no live third-party bank-data access. The Central Bank of Egypt's framework is "in progress"; no aggregator covers Egyptian banks.
  - **Gulf:** Lean and Tarabut are sales-led.
  - **Australia:** CDR accreditation (Basiq, sales-led).
  - Outside US/Canada, Ditch relies on the on-phone finder: screenshots, statement CSV/PDF.
- Sources: [Plaid Trial](https://support.plaid.com/hc/en-us/articles/39994173227159-What-is-the-Plaid-Trial-plan), [Plaid pricing plans](https://support.plaid.com/hc/en-us/articles/16110502116887), [Plaid UK billing docs](https://plaid.com/en-gb/docs/account/billing/), [Stripe FC availability](https://support.stripe.com/questions/where-is-financial-connections-currently-available), [Stripe on non-resident LLCs](https://stripe.com/en-mx/resources/more/how-to-open-an-llc-in-the-usa-for-nonresidents), [Meow on Plaid founder ID](https://www.meow.com/blog/founder-identity-verification-plaid-meow), [Fiskil Egypt](https://www.fiskil.com/open-finance-tracker/egypt), [Open Banking Tracker Egypt](https://openbankingtracker.com/country/egypt)
