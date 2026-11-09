# Auto-sync research: fresh prices and finding your subscriptions (Nov 9, 2026)

The owner asked: "research if there is a way we can autosync plans, that would be huge." This covers both meanings:
1. **Keep our catalog's plans and prices fresh** (Netflix, Spotify… change prices by country).
2. **Find the user's own subscriptions** without a bank link.

Per-country prices and competitor onboarding flows are in `niche-teardown.md` (another agent). This file is only about **automation**. Bank sync stays parked (DECISIONS "Bank sync research for v3") and appears here only as the comparison point.

## Summary (read this if nothing else)
- **No iPhone app can read your other App Store subscriptions.** StoreKit only sees the app's own products, and nothing at WWDC26 (iOS 27) changed that. The best route is still **"screenshot your Apple subscriptions, Ditch reads it on the phone"**.
- **Proof the catalog needs refreshing:** today's official pages say Netflix US Standard is **$19.99** and Spotify Individual is **$12.99**. Our bundled catalog says $17.99 and $11.99. Wrong prices make the "That's $X a year" reveal wrong.
- **Pick for prices:** a **public price list (one JSON file) on ditchsubs.app**. A weekly GitHub robot checks official pricing pages, uses an AI to read any changes, and opens a change request. **A human approves before anything goes live.** The app downloads the same file for everyone, so no personal data is sent and the privacy label doesn't change. Cost: about $0–5 a month.
- **Price-change heads-ups** ("Netflix says Standard goes to $19.99 on your next bill. Update yours?") come from the same pipeline. The app always **asks**; it never changes a price silently. Good for retention and a natural Pro feature.
- **Pick for finding subscriptions:** a **"Find more" hub** with honest, on-phone routes: Apple subscriptions screenshot (v1), bank or Apple Card statement PDF/CSV with on-phone repeat-charge spotting (v1/v1.1), paste or share a receipt (v1.1), then **Apple FinanceKit** (Apple Card, Apple Cash, Savings in the US; most big UK banks) in v2 if Apple approves. **Every route ends in a "check and confirm" list.**
- **Proof FinanceKit works for a tracker:** Outflow, a small subscription tracker in the Finance category, already uses FinanceKit to find repeating payments, with the label "Data Not Collected".
- **Skip for now:** Gmail scanning (restricted scope, Google review, maybe a $540–4,500 yearly security audit, and reviews show "Gmail was blocked"), forwarding receipts to an email address (needs a server and breaks our privacy label), and Shortcuts' Wallet trigger (it fires on tap-to-pay, which subscriptions never use).
- **Money signal:** the "we find your subscriptions automatically" apps earn the most (AppKittie estimates: MonoBoost ~$160k/mo, Subpilot ~$85k, Feenko ~$80k). Their reviews are brutal when they miss things ("Opened the app and found zero subscriptions"). There's room for an app that finds things **and** stays honest about it.
- **Naming:** don't call any of this "Auto-sync". DECISIONS #6b keeps that name for the future paid bank-sync tier. Use **"Find more"** and **"Price watch"**.
- **Owner to-dos:** FinanceKit request (now), a public GitHub repo plus a `prices.ditchsubs.app` DNS record (v1.1), an Anthropic API key stored as a GitHub secret (v1.1), 10 minutes a week to approve price changes.

---

## How to read the scores
Each option gets six scores out of 10. Higher is always better.

| Column | 10 means |
|---|---|
| **Value** | Users would really feel it |
| **Doable** | A solo first-time founder (with Claude) can build and run it |
| **Trust** | Privacy stays clean; the label stays "Data Not Linked to You: Purchases"; it feels safe |
| **Cost** | About $0 a month |
| **Review** | Little App Store or Google/Apple approval risk |
| **Conversion** | Raises onboarding completion, trial starts, trial→paid or retention, or is a strong Pro hook |

**Overall** is the plain average, rounded. Conversion and trust break ties, per the north star (our user is ~23–40, a bit anxious about money, and wants control and reliability).

---

# Part 1: Keep the catalog's prices fresh

## The problem, with evidence
- Prices change often and differ by country. A third-party tracker covers Netflix in 242 countries and checks them **monthly** ([World Price Index](https://worldpriceindex.org/subscriptions)).
- On Nov 9, 2026, the official pages showed:
  - Netflix US: Standard with ads **$8.99**, Standard **$19.99**, Premium **$26.99** ([Netflix Help, Plans and Pricing](https://help.netflix.com/en/node/24926)).
  - Spotify US: Individual **$12.99**, Duo **$18.99**, Family **$21.99**, Student **$6.99** ([spotify.com/us/premium](https://www.spotify.com/us/premium/)).
- `src/catalog/services.ts` says Netflix $17.99 and Spotify $11.99 and claims "Checked: Nov 2026". **Both are wrong today.** That's two of the most-ticked services in onboarding, so the yearly total reveal is off by about $36 for anyone with both. (Flagging for whoever owns the catalog; this file doesn't change it.)
- Today, a fix needs an app update and Apple review, and users who don't update keep the old prices.

## How to do it with no traditional backend
The idea is a **price list file**, not a server:

1. A file `prices.json` lives at `https://prices.ditchsubs.app/v1/prices.json`. It's served by **Cloudflare Pages** or **GitHub Pages**, both free.
2. The app ships with a **built-in copy** (today's `services.ts`), so it works offline and on first launch.
3. About once a week, on launch or through iOS background refresh, the app downloads the file with a normal "has it changed?" check (ETag). If the file is valid, it replaces the built-in prices.
4. **Everyone downloads the same file.** No country in the address, no user ID, no list of your subscriptions, no cookies. The phone picks your country's prices itself.
5. The same file later powers the cancel-guide pages (DECISIONS #9) and per-service price pages on ditchsubs.app. That's one dataset with two uses.

**What goes in the file (per service and plan):** id, name, plans (name, price in minor units, currency, cycle) **per country**, a `checkedOn` date, a source link, and optional `announcedChanges` (see price alerts below).

**Safety checks in the app:**
- Ignore a file that fails its format check.
- Ignore any price that moved more than 60% or has an unknown currency.
- Never make prices disappear: a missing service keeps its last known price.

### Does this keep our privacy label? Mostly yes, if we follow three rules
Apple's own definitions:
- "Collect" means sending data off the device **and keeping it** longer than needed to answer the request.
- "If an authentication token or IP address is sent on a server call and not retained … you do not need to disclose this."
- Data processed only on the device is not collected.
  ([Apple, App privacy details](https://developer.apple.com/app-store/app-privacy-details/))

A plain file download sends only what every web request sends (IP address, app version in the User-Agent). It stays label-neutral if we:
1. **Keep no logs** of who downloaded it and add no analytics to the price-list host. (Cloudflare and GitHub Pages don't hand us per-visitor logs on free plans; don't switch any on.)
2. **Send nothing personal:** one URL for everyone, no query strings, no country in the path. A per-country file name would reveal rough location.
3. **Never call third-party price APIs from the phone.** They'd see users' IP addresses. Only our weekly robot talks to them.

Add one line to the privacy policy: "The app downloads a public price list from ditchsubs.app. We don't log who downloads it." Re-check before each submission, as CLAUDE.md asks.

**App Store rule 2.5.2** bans downloading code that changes how the app works. A JSON price list is data, not code, and is fine ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)).

## Keeping the file fresh: the weekly robot
A scheduled **GitHub Action** (free cloud computer time) runs every Monday:

1. **Fetch** a short allowlist of official pricing pages, about one per service and country we support. Use an honest User-Agent like `DitchPriceCheck/1.0 (+https://ditchsubs.app/bot)`. Wait a few seconds between requests. Obey robots.txt.
2. **Detect changes:** strip each page to its visible text, keep only the price area, and compare a fingerprint (hash) with last week's. No change means nothing else happens. Most weeks, most pages won't change.
3. **Read the changed pages with an AI.** Send only the changed text to Claude with a strict output format: `{service, country, plan, price, currency, cycle, evidenceQuote}`. The `evidenceQuote` must appear word for word on the page, or the result is thrown away. That stops made-up prices.
4. **Open a change request (pull request)** that shows old → new, the quote and the link. The robot **never publishes on its own.**
5. **A human approves** on the phone in the GitHub app, about 10 minutes a week. Merging publishes the new `prices.json`. Cloudflare or GitHub Pages redeploys in about a minute.
6. If a page fails to load or its layout changed so the price can't be found, the robot opens an issue saying "check Netflix US by hand". It never guesses.

**Cost:**
- GitHub Actions: free for public repos. Private repos get 2,000 free minutes a month, and this job needs about 5 a week.
- Hosting: free.
- AI: Claude Opus 5.5 is $4 per million input tokens. Even sending all ~100 pages every week (~400k tokens) is about $7 a month. Reading only changed pages, and using the half-price Batch API, brings it to about **$1–3 a month**. A cheaper model (Claude Haiku 5.5, $0.10 per million input tokens) would cost cents; that's the owner's call.
- One gotcha: GitHub turns off scheduled jobs in a public repo after 60 days with no activity. Weekly commits keep it alive, but add a monthly "still alive" check.

### Is it legal to read official pricing pages? (Not legal advice)
- **US case law leans our way for public, logged-out pages.** In *Meta v. Bright Data* (N.D. Cal., Jan 2024), the court held Meta's terms didn't bar logged-out scraping of public data ([Quinn Emanuel](https://www.quinnemanuel.com/the-firm/news-events/client-alert-meta-v-bright-data-significant-decision-for-web-scraping-industry/)). *hiQ v. LinkedIn* says scraping public pages isn't "unauthorized access" under the US anti-hacking law, but hiQ later lost on contract grounds ([Fenwick](https://www.fbm.com/raven-quesenberry/publications/what-recent-rulings-in-hiq-v-linkedin-and-other-cases-say-about-the-legality-of-data-scraping/), [ScrapeHero](https://www.scrapehero.com/web-scraping-legal-cases/)). Contract, copyright and EU database claims can still apply ([AIMultiple](https://aimultiple.com/is-web-scraping-legal)).
- **Prices are facts.** We copy a number, a plan name and a date, never page text or images.
- **Terms of use:** Netflix's terms ban using "any robot, spider, scraper or other automated means to access the Netflix service" ([Netflix Terms of Use §1.8](https://help.netflix.com/legal/termsofuse)). That's aimed at members using the service. Even so, low volume plus human review keeps us on the careful side.
- **robots.txt, checked Nov 9, 2026:**

| Site | What robots.txt says | What we do |
|---|---|---|
| help.netflix.com | Allows the Plans and Pricing page but **bans `?locale=`**. The page shows prices for the visitor's own location ("A country must be selected"). | US only. Check other countries by hand or with a licensed dataset. No VPN tricks. |
| spotify.com | Allows `/{country}/premium/` pages | Easy to watch per country |
| youtube.com | Allows `/premium`, but it shows prices by location | US only by robot |
| disneyplus.com | **`Disallow: /` for every bot** except search engines | Don't fetch. Check by hand monthly. |

- **Apple rule 5.2.2:** an app that "uses, accesses … or displays content from a third-party service" must be permitted to under that service's terms ([guidelines](https://developer.apple.com/app-store/review/guidelines/)). We display a price and link to the source, which is low risk. Brand logos are a separate question (SPEC §12).
- **Do:** read only what robots.txt allows, at most weekly, with an honest bot name. Copy only facts. Add a human review and a source link with "checked on" in the app. Fold a 1-hour lawyer check into the trademark consult DECISIONS already suggests.

## Existing datasets and APIs (inputs for the robot, never called from the phone)

| Source | Coverage | Freshness | Licence / cost | Use? |
|---|---|---|---|---|
| [World Price Index](https://worldpriceindex.org/subscriptions) | 6 services (Netflix, Spotify, YouTube Premium, Disney+, Adobe, Revolut) in up to 243 countries; taken from official pages | Monthly (YouTube's was last checked May 2026) | JSON API with a key; price and reuse terms not stated | Good cross-check. Email them for terms. |
| [Subscription Land](https://subscriptionland.com/press/subscription-price-data) | 12 services with country tables (Spotify, Netflix, YouTube, ChatGPT, Xbox, Apple Music, PS Plus, Claude, Perplexity, Strava, LinkedIn, Nintendo) | Monthly; snapshot dated Sep 8, 2026 | Free CSV/JSON; licence unstated, asks for citation | Ask permission before using |
| [tompec/netflix-prices](https://github.com/tompec/netflix-prices) | Netflix, every country, JSON | "Updated regularly" | **CC BY 4.0** (credit required) | Fine with credit in Settings → About |
| [Geonode tables](https://geonode.com/blog/netflix-prices-by-country) | Netflix and Spotify, 20 countries | Oct 2026 | Reported as CC BY 4.0 (verify) | Cross-check only |
| [Aristocles API](https://dev.to/john_yesh38/i-built-a-subscription-pricing-api-because-every-ai-agent-gives-you-wrong-prices-for-netflix-517j) | 75+ services, 6 countries (US, UK, CA, AU, NZ, IN) | Not stated | Free 100 calls/day; $9/mo; licence unstated | Maybe, for the robot only |
| Kaggle Netflix prices | Netflix | Stale (2021 exchange rates) | — | No |

No source is official, complete and clearly licensed. The plan is: **our own watcher is the source of truth, and datasets help catch what it misses.**

## Price-change heads-ups ("Netflix is going up")
**Why it matters:** competitors that alert on price rises mostly do it **after** you've paid the higher price, by spotting it in bank data. Rocket Money alerts when a recurring charge rises "more than $1.99 and more than 5 percent" ([Rocket Money](https://www.rocketmoney.com/learn/personal-finance/is-there-an-app-that-can-tell-me-when-my-subscription-price-increased); [getfinny overview](https://getfinny.app/blog/apps-track-subscription-price-increases-2026)). Telling people **before** the bill, with no bank link, is rare and fits "Ditch it before it renews".

**Where announcements come from:**
- The pricing-page watcher above. The new price appears on the page when it starts for new members.
- Official newsrooms and investor letters: Netflix shareholder letters, Spotify's "For the Record" newsroom, YouTube and Google blogs.
- News searches per service ("Netflix price increase", weekly) for early warnings. The robot only proposes these. A human confirms each one with an official source, or a company email quoted by at least two major outlets.
- Existing members usually get an email about 30 days ahead, and the new price starts on their **next bill after a date**. So the effective date differs per person, which is why the app asks.

**How the app updates a price safely (never silently):**
1. Each tracked subscription stores `catalogId`, `planId`, `country`, the user's own `amountMinor`, and `priceSource` (`catalog` / `user` / `import`).
2. A change only touches subscriptions where the user's price **equals the old catalog price** for that plan and country. Custom prices are never touched.
3. The app shows a card (no notification needed):
   > **Netflix is going up.** Netflix says Standard goes from $17.99 to $19.99 in the US, starting with bills after Dec 1. [Update from my next bill] [Not yet] [I'm on a different plan] · Source · Checked Nov 12
4. "Update from my next bill" saves a **scheduled price change** (new amount plus the date it starts), so the reminder can say "Netflix renews in 3 days. $19.99, up from $17.99. Still watching?"
5. Pro could also get a local notification when an announced change lands on one of their subs ("Netflix is going up $2. Still watching?"). That's still local only, with no server, scheduled after the weekly download.
6. Yearly totals and the Ditched savings keep their own history. Old ditches keep the price they had when ditched.

## Part 1 options

| # | Option | Value | Doable | Trust | Cost | Review | Conversion | Overall |
|---|---|---|---|---|---|---|---|---|
| A1 | Status quo: prices only change with app updates | 4 | 10 | 10 | 10 | 10 | 3 | 8 |
| A2 | Public price-list file, **updated by hand** monthly | 7 | 9 | 9 | 10 | 10 | 6 | 8.5 |
| **A3** | **A2 + weekly robot + AI reading + human approval** | 8 | 7 | 9 | 9 | 10 | 7 | **8.3, pick** |
| A4 | Fully automatic, no human check | 8 | 6 | 7 | 9 | 9 | 4 | 7 |
| A5 | Buy or license a dataset as the main source | 6 | 8 | 9 | 6 | 10 | 5 | 7.3 |
| **A6** | **Price-change heads-ups (built on A3)** | 9 | 6 | 9 | 9 | 9 | 8 | **8.3, pick (v1.1–v2)** |

- **Why A3 beats A2 even though A2 scores the same:** A2 depends on someone remembering to check. A3 makes the robot do the remembering, and a human still makes every decision.
- **Why A4 loses:** a wrong price makes the total reveal wrong, and for a money-anxious user that breaks trust fast.
- **Conversion:**
  - Correct prices make the "That's $X a year" reveal believable. That moment is the onboarding hook leading into the paywall.
  - Price heads-ups give paying users a reason to keep Pro after the trial, and a reason to open Ditch that isn't nagging (DECISIONS #13).

---

# Part 2: Find the user's own subscriptions, with no bank link

## What can't be done (so we never promise it)
- **Reading other apps' App Store subscriptions:** impossible. StoreKit and the App Store Server API only cover your own app's products. WWDC26 added bundles, commitment plans and retention offers for **your own** subscriptions, not a way to see other apps' ([Apple WWDC26 session 210](https://developer.apple.com/videos/play/wwdc2026/210/), [RevenueCat WWDC26 recap](https://www.revenuecat.com/blog/engineering/wwdc26-whats-new-for-apps)). There's no "share my subscriptions" sheet.
- **Screen Time, iCloud Keychain, Apple Pay merchant data:** no API exposes purchases or subscriptions. Keychain access would also feel creepy.
- **Wallet order tracking (iOS 26):** Apple Intelligence finds orders in Mail for Wallet ([Apple, What's new in Wallet](https://developer.apple.com/wallet/whats-new/)). It's for shipments, and apps can't read it.
- **Apple-billed subscriptions in bank data:** they all show up as "APPLE.COM/BILL", so neither bank sync nor statements can tell which app each charge is for. A competitor review: "could not identify Apple transactions" (MonoBoost, 2★, Jul 2026). This is exactly why the Apple screenshot route matters.

## Route by route

### B1. Apple subscriptions screenshot, read on the phone (v1, already planned)
- **Flow:**
  1. "Find more" → "Apple subscriptions" → a button opens the Apple subscriptions screen. (On the owner's iPhone, check whether a link like `itms-apps://apps.apple.com/account/subscriptions` opens it. If not, show the path: Settings → your name → Subscriptions, [Apple support](https://support.apple.com/en-us/118428).)
  2. The user takes 1–2 screenshots and comes back. Ditch offers the newest screenshots from the photo picker (limited photo access, so only the ones they pick).
  3. Apple's own text reader (Vision, via `expo-text-extractor` 2.0.0) reads the text **on the phone**.
  4. Ditch matches names to the catalog and fills in renewal dates.
  5. The user sees a checklist with everything ticked. They untick anything wrong and tap Add.
- **Accuracy:**
  - Reading the text of a screenshot is very reliable: it's crisp system text, not a photo.
  - The hard part is the layout. The main list shows each subscription and its renew or expiry date, but **the price may only appear after tapping in** ([MacRumors](https://macrumors.com/2022/06/24/apple-updates-subscriptions-interface-on-iphone)). Check on iOS 26 on the owner's phone.
  - If prices are missing, use the catalog price per country, marked "about", and ask once: "Prices look right?"
  - Build a test set of 20 real screenshots (light and dark mode, 3 languages, expired items) and aim for 95% correct names and dates before shipping.
- **Needs:** a dev build (already planned), no entitlement, no server.
- **Privacy:** stays on the phone, so the label doesn't change.
- **Competitors:** Orbit, SubLess, SubTracker and Subtle do screenshot import. An Orbit 2★ review: "the import features, whether from a photo or from file manager, simply don't work for me". Reliability is what sets an app apart here.

### B2. Bank or card statement PDF/CSV, with on-phone repeat-charge spotting (v1 import, smarter in v1.1)
- **Flow:** share a statement PDF from the bank app or Files to Ditch (`expo-share-intent` 9.0.0 supports Expo 58), or pick it in Ditch. Ditch reads the text on the phone (`expo-pdf-text-extract`), shows the repeating charges it found, and the user confirms each one.
- **Apple Card users:** Wallet → Apple Card → Card Balance → pick a month under Statements → **Export Transactions** → CSV ([Macworld](https://www.macworld.com/article/233756/how-to-export-your-apple-card-monthly-transactions-in-csv-or-ofx-format.html), [MacRumors](https://macrumors.com/how-to/export-apple-card-data-to-spreadsheet)). That's a clean file, great for a step-by-step guide.
- **How "spotting repeats" works (plain version):**
  1. **Clean up merchant names.** Drop card numbers, dates, cities and states, reference codes, and "POS", "DEBIT" and "RECURRING". Unwrap payment-processor prefixes ("PAYPAL *", "SQ *", "GOOGLE *"). Map known aliases with a table that ships in the price list (`NETFLIX.COM`, `NFLX` → netflix; `SPOTIFY USA`, `SPOTIFYP` → spotify). Keep `APPLE.COM/BILL` separate and point the user to B1.
  2. **Group** charges by cleaned name and currency.
  3. **Check the timing.** Look at the gaps between charges. Weekly is 6–8 days, monthly 27–33, quarterly 85–95, yearly 355–375. Most gaps must fit one pattern.
  4. **Check the amount.** Amounts must be within about 10% or $1 of each other, which allows for tax and small price rises. A step up that stays up looks like a price rise, not a new subscription.
  5. **Score confidence:**
     - High: a known catalog service plus 2 or more matching charges.
     - Medium: an unknown merchant with 3 or more monthly charges.
     - "Maybe": a single charge from a known yearly service.
  6. **Show the list** sorted by confidence, with the evidence ("$19.99 on Sep 3, Oct 3, Nov 3"). Nothing is added until the user taps it. Plaid's "recurring streams" work the same way: merchant, amount, frequency, predicted next date ([DECISIONS bank research](../DECISIONS.md)).
  7. **Predict the next charge** from the last charge plus the cycle, using our date rules (anchor day, month-end clamping).
- **Limits:**
  - One statement covers about 30 days, so a monthly sub shows only once, and that's only a "maybe". Ask for 2–3 months.
  - Yearly plans need 12 months, so rely on catalog matches for those. A tracker blog makes the same point ([subtracker.io](https://subtracker.io/best/how-to-see-subscriptions-on-iphone)).
  - Bank PDF layouts vary. Start with the 5 biggest US banks and Apple Card, and say so.
- **Privacy:** on the phone, so the label doesn't change. SubFind sells exactly this ("without asking for your bank login", ~$5k/mo per AppKittie).

### B3. Paste or share a receipt (v1.1)
- **Flow:**
  - Select the receipt text in Mail or Gmail → Share → Ditch, or copy and tap "Paste a receipt".
  - Or share a screenshot, PDF or `.eml` file.
  - iOS Mail can't share an email directly. Print → share PDF works, and so does selecting text.
- **Reading it:** simple rules for price, cycle and date, plus Apple's on-device model (Foundation Models, iOS 26+, iPhone 15 Pro or newer with Apple Intelligence on) when available. There are community Expo wrappers such as `expo-apple-foundation-models` 1.2.0; they're young, so test them or write a tiny module ourselves. Phones without it fall back to the rules alone.
- **Trust pattern to copy:** SubTrack labels AI guesses "Suggested by the on-device AI" and says "nothing counts until you confirm it" (its App Store text). Outflow and Recur do on-device "Smart Add" too.

### B4. Apple FinanceKit (v2, if Apple says yes)
- **What it gives:**
  - Balances and transactions from **US Apple Card** (not Apple Card Family participants), **Apple Cash** (not children on Apple Cash Family) and **Savings**, iOS 17.4+.
  - **UK open-banking accounts in Wallet**, iOS 18.4+: Barclays, Barclaycard, First Direct, Halifax, HSBC, Lloyds, M&S Bank, MBNA, Monzo, Nationwide, NatWest, RBS, Santander.
  - All read **on the phone**; the data is "never seen by Apple" ([Apple FinanceKit](https://developer.apple.com/financekit/)).
  - iOS 18 added a **transaction picker**, where the user hand-picks transactions to share.
  - **iOS 26 added background delivery:** a small extension wakes when new transactions arrive, even with Ditch closed ([Apple sample](https://developer.apple.com/documentation/financekit/implementing-a-background-delivery-extension)).
  - No new FinanceKit API showed up for iOS 27 in our search.
- **Why it's exciting:** "New charge: Netflix $19.99 (you had $17.99). Update?" as a local notification, with no server and no bank login. It's real automatic detection, for the users who have it.
- **Who's eligible (Apple's rules):**
  - Organization developer account (we have one), and the Account Holder applies.
  - App listed in the **Finance** category and sold on the US or UK App Store.
  - The app must "provide financial management tools (for example … spending trends, or budgeting)".
  - Granted **per bundle ID**.
  - So Ditch needs a simple spending-trends view (monthly totals over time). DECISIONS already notes this.
- **Precedent:** Outflow (Finance category, updated Oct 21, 2026) says it "can find repeating payments in transactions already on your phone, using Apple's FinanceKit", with the label "Data Not Collected". So subscription trackers can get the entitlement. Outflow also has Trends and income tracking, which probably helped.
- **Expo:** works in an EAS dev build through a small Swift module. Community packages exist (`expo-finance-kit` 0.2.23, `@kickstartcrew/expo-financekit` 0.2.4) but they're small and young; plan to write our own thin module. The background extension needs an App Group, which we plan anyway for the widget.
- **Limits:**
  - US Apple Card, Apple Cash and Savings users, plus UK users of the banks above. Not other US banks.
  - Apple-billed subs still appear as one Apple line, so B1 is still needed.
- **Watch out:** iOS 27 brings **Wallet Insights** with "recurring transactions" to US users ([iThinkDiff](https://www.ithinkdiff.com/apple-wallet-insights-ios-27-beta-2-2/)). Apple itself is moving in. Our edge has to be the reminders, the cancelling help and the honesty, not just "we see your charges".

### B5. Gmail scanning (skip; DECISIONS already says skip)
- **Restricted scopes:** `gmail.readonly` and even `gmail.metadata` are **restricted** ([Gmail scopes](https://developers.google.com/workspace/gmail/api/auth/scopes)).
- **Verification:** restricted-scope verification "can potentially take several weeks", and a **security assessment every 12 months** is required if data reaches a server ([Google](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification)).
- **On-phone only?** It's unclear whether keeping everything on the phone avoids the assessment. A developer asked Google this exact question for a subscription app on Sep 19, 2026 and got **no answer** ([Google forum](https://discuss.google.dev/t/gmail-restricted-scope-is-the-casa-assessment-required-when-mail-is-processed-on-device-and-only-a-derived-subscription-list-reaches-our-server/398372)).
- **Cost reports vary:** $540 for one indie (approved in about a month) up to $3,000–4,500 at assessor list prices ([Latenode thread](https://community.latenode.com/t/is-casa-tier-2-assessment-necessary-for-all-gmail-api-apps-options-for-indie-developers/22861), [Leviathan](https://leviathansecurity.com/programs/google-casa-cloud-application-security-assessment)).
- **Trust:** Google's consent screen asks to "read all your email", which is scary for our user.
- **What reviews say:**
  - SubSeek (1.57★ recent): "I added Gmail and it was blocked".
  - Feenko: "I connected my email to the app and it didn't find any of my subscriptions".
  - Subpilot: "Limited to only gmail or outlook".
- **Privacy:** processed on the phone, it stays label-neutral, but trust still takes a hit.

### B6. Outlook (Microsoft Graph `Mail.Read`)
- Personal accounts can consent. Unverified publishers show an "Unverified" warning; free publisher verification removes it ([Unipile guide](https://www.unipile.com/microsoft-graph-oauth-email/)). No paid audit is required.
- Small reach among our users. Low priority.

### B7. Forward receipts to an @ditchsubs.app address
- Needs an inbound-mail server.
- The label would gain **Emails or Text Messages** and the sender's email address, **linked to you**. That breaks "Your list stays on your phone" and the label goal. Skip.

### B8. Siri Shortcuts, App Intents, and the Wallet "Transaction" trigger
- The automation is called "Transaction" (or "Wallet" in iOS 26). It runs when you **tap** a Wallet card or pass and passes the card, merchant and amount ([Cassinelli](https://matthewcassinelli.com/shortcuts-automations-ios-ipados-transaction-display-stage-manager/), [iDropNews](https://www.idropnews.com/ios-17/this-new-ios-17-shortcut-will-help-you-keep-track-of-your-spending/197589/)).
- Subscriptions are charged online, without a tap, so it almost never fires for them. Developers also report timeouts and failures since iOS 18 ([Apple forums](https://developer.apple.com/forums/thread/765516)). Not a detection route.
- **App Intents** ("Add a subscription", "What renews this week?") are still nice later for Siri and Spotlight. Outflow and Recur have them. That's v2 polish, not auto-sync.

### B9. Bank sync (comparison only; parked for v3)
- Plaid's recurring endpoint finds subscriptions for you. It needs a server, about $0.30 per bank per month, and a separate "Auto-sync" plan (DECISIONS #6b).
- Reviews of bank-link apps: "my bank isn't even an option", "bank locked my account" (Rocket Money, Nov 2026), "This went directly for my bank log in and password. Sounds fishy" (MonoBoost).

## Part 2 options

| # | Route | Value | Doable | Trust | Cost | Review | Conversion | Overall | When |
|---|---|---|---|---|---|---|---|---|---|
| **B1** | **Apple subscriptions screenshot, read on the phone** | 8 | 7 | 10 | 10 | 9 | 9 | **8.8** | **v1** |
| **B2** | **Statement PDF/CSV + on-phone repeat spotting** | 8 | 5 | 9 | 10 | 9 | 7 | **8.0** | **v1 basic, v1.1 smart** |
| B3 | Paste or share a receipt (+ on-device AI) | 6 | 7 | 10 | 10 | 9 | 5 | 7.8 | v1.1 |
| **B4** | **Apple FinanceKit + background delivery** | 7 | 5 | 9 | 10 | 6 | 7 | **7.3** | **v2 (apply now)** |
| B5 | Gmail scan (on the phone) | 7 | 3 | 5 | 5 | 4 | 6 | 5.0 | skip (maybe v3) |
| B6 | Outlook scan | 4 | 5 | 6 | 9 | 7 | 3 | 5.7 | skip |
| B7 | Forward-to-address inbox | 5 | 4 | 3 | 6 | 7 | 3 | 4.7 | skip |
| B8 | Wallet tap trigger / Shortcuts as detection | 2 | 5 | 10 | 10 | 9 | 2 | 6.3 | no (App Intents as polish) |
| B9 | Bank sync (Plaid) | 9 | 3 | 4 | 4 | 7 | 8 | 5.8 | v3, parked |
| — | Read App Store subs via StoreKit | — | 0 | — | — | — | — | impossible | never |

**Conversion notes:**
- **B1 is the best onboarding moment we can add.** Right after "That's $X a year", offer "Find your Apple ones too". Apple-billed subscriptions are the ones people forget: they're spread across many small apps and invisible in bank data. A fuller list means a bigger, truer yearly number, and the yearly number sells the paywall.
- **Open question for the owner (don't change DECISIONS #11 without them):** #11 makes import a Pro feature.
  - **Option 1 (8/10):** the Apple screenshot scan is free once in onboarding; statements and FinanceKit are Pro. It grows the list before the paywall and still leaves a clear Pro hook.
  - **Option 2 (7/10):** keep all import Pro, but let free users run the scan and see "Found 4 Apple subscriptions, $312 a year" before upgrading. It converts but can feel like a tease. If we pick this, the free user must still be able to add those 4 by hand, so nothing is held hostage.
  - **Option 3 (5/10):** import fully Pro with no preview. Simplest, weakest hook.
  - **Pick: Option 1.**
- **B4 is a retention feature.** "New charge spotted" notifications keep Pro valuable month after month for Apple Card and UK users. It's a strong reason to stay subscribed, and works for lifetime users too since it costs us nothing.
- **Mind the review evidence:** "auto-detect" apps get their 1★ reviews when they miss things (in recent reviews: MonoBoost 1.73★ average, SubSeek 1.57★, a "found nothing / didn't find" theme in all four we sampled). The same apps get their 5★ reviews from "found subscriptions I didn't know about". So **set expectations before the scan, and celebrate what it finds.**

## Copy check (CLAUDE.md rule: never claim detection we don't have)

| Where | ✅ Say | ❌ Never say |
|---|---|---|
| Find more hub | "Find more. Pick a way and check what we spot." | "Ditch finds all your subscriptions automatically" |
| Apple screenshot | "Screenshot your Apple subscriptions. We'll read it on your phone." | "Import your App Store subscriptions" (implies an Apple connection) |
| Statement | "Drop in a statement. We'll show what repeats. You choose what goes in." | "AI detects every recurring charge" (SubFind's line) |
| FinanceKit | "See new Apple Card charges as they happen. Read on your phone, nothing leaves it." Check this against the RevenueCat caveat: say "your card data stays on your phone". | "We watch your bank" / "all your accounts" |
| Price list | "Prices checked Nov 12" + source link | "Live prices", "always up to date", "real-time" |
| Price change | "Netflix says Standard is going to $19.99 in the US." | "Your Netflix price went up" (we can't see their bill) |
| Feature names | **"Find more"**, **"Price watch"** (8/10) · "Price alerts" (7/10) | **"Auto-sync"** (reserved for the bank tier, #6b; 3/10) |

The App Store description can say "Reads screenshots and statements on your phone" and "Price watch: a heads-up when big services raise prices". Never "automatic detection" until FinanceKit ships, and then only "for Apple Card".

---

# Roadmap

| Phase | Build | Why first |
|---|---|---|
| **v1 (current 4–5 weeks)** | 1. Fix today's catalog prices (Netflix, Spotify, plus a full pass).<br>2. Add `catalogId`, `planId`, `country`, `priceSource`, `checkedOn` to the data model now; cheap now, a migration later.<br>3. **Price-list file (A2):** app downloads `prices.json` weekly; built-in fallback; "checked on" in the UI. Hand-edited for now.<br>4. **B1 Apple screenshot import** with the confirm list.<br>5. B2 basic: PDF/CSV statement import showing candidate repeats. | Correct totals protect the reveal and the paywall. B1 is the biggest gain in list size for the least risk. All on the phone: $0 a month, label unchanged. |
| **v1.1 (about a month after launch)** | 1. **Weekly robot (A3):** GitHub Action, change detection, AI reading, pull request, human approval.<br>2. **Price-change cards (A6)** with "update from my next bill".<br>3. B2 smarter: alias table in the price list, confidence scores, Apple Card CSV guide.<br>4. B3 paste or share a receipt, with on-device AI where available. | Keeps prices fresh without app updates. Gives Pro a reason to stay. Uses the share extension we're building anyway. |
| **v2** | 1. **FinanceKit (B4)** if approved: Apple Card/Cash/Savings (US) and UK banks, background "new charge spotted" local notifications for Pro. Needs a simple Trends view.<br>2. Price-list coverage for top launch countries, cross-checked with a licensed dataset.<br>3. Price-change local notifications (Pro).<br>4. App Intents ("Add subscription", "What renews this week?"). | Real automatic detection, on the phone, with no monthly cost. Strong retention. |
| **v3** | Bank sync "Auto-sync" tier (already researched and parked). Gmail on the phone **only** if Google confirms in writing that no CASA audit is needed, and only if users ask for it. | Costs money every month and needs a server; only worth it with a few hundred paying users. |

**What to build first, and why:** the price-list file and the Apple screenshot import.
- The file makes every total right, and it's cheap.
- The screenshot covers the subscriptions nothing else can see.
- Together they make the onboarding "That's $X a year" both bigger and true, which is where trial starts are won.

---

# Only-you tasks (exact steps)

### ⏰ Now: FinanceKit entitlement (already in STATUS #3; add these details)
1. The app record and bundle ID must exist first, because the entitlement is granted per bundle ID. Claude will create them in M1/M2. Then:
2. Sign in to developer.apple.com as the **Account Holder** → open **developer.apple.com/contact/request/financekit**.
3. Pick the bundle ID. Category: **Finance**. Countries: **United States** (add **United Kingdom** if we plan to sell there).
4. Describe it: "Ditch is a subscription tracker in the Finance category. It shows monthly spending trends on subscriptions and finds repeating charges in Apple Card transactions, read on the device only. Nothing is sent to our servers."
5. Submit, then wait for the email saying the entitlement was assigned. Tell Claude; it does the App ID and setup steps.

### v1: Keep ditchsubs.app pointing at the right place
- When the price list ships, Claude will ask for one DNS record. In your domain registrar's DNS page, add a **CNAME** `prices` → the address Cloudflare Pages or GitHub Pages gives you. Claude will give the exact value.

### v1.1: The price robot
1. **GitHub repo:** in the GitHub app or on github.com → **+** → **New repository** → name `ditch-prices` → **Public** (free robot minutes, and the price list is public anyway) → Create.
2. **AI key (never paste it in chat):**
   1. At console.anthropic.com → **API keys** → **Create key**, and set a monthly **spend limit of $10** under Limits.
   2. In GitHub → `ditch-prices` → **Settings → Secrets and variables → Actions → New repository secret** → name `ANTHROPIC_API_KEY` → paste → Save.
3. **Weekly 10-minute review:** GitHub notifies you of a "Price changes" pull request. Open it, compare each line with the source link, and tap **Merge**. Anything odd: tap **Close** and tell Claude.
4. **Optional:** email World Price Index and Subscription Land: "Can a small subscription-tracker app use your price data with credit? Commercial use?" Forward the replies.

### Optional
- Add "Is reading public pricing pages for a price list OK?" to the 1-hour trademark lawyer check in DECISIONS.
- v3 only: ask Google's OAuth verification team in writing whether an on-device-only Gmail reader needs the yearly CASA assessment.

---

## Competitor scan (Nov 9, 2026)
Sources: iTunes Search API (US), App Store review RSS (up to 250 most recent per app), AppKittie API (revenue and downloads are monthly estimates).

| App | How it finds subs | Est. revenue/mo | Recent reviews | Note |
|---|---|---|---|---|
| MonoBoost | "automatic subscription detection" (Premium), bank | ~$160k | 1.73★ (189) | "didn't find my subscriptions at all"; "could not identify Apple transactions" |
| Subpilot | Bank + Gmail/Outlook, cancels for you | ~$85k | 4.22★ (250) | "connect bank and gmail it finds your subs"; "Limited to only gmail or outlook" |
| Feenko | Bank transactions (+ email) | ~$80k | 3.31★ (204) | "I have 12 subscriptions. It only found 6." |
| SubSeek | Email + bank ("coming soon") | n/a (850 ratings) | 1.57★ (58) | "Opened the app and found zero subscriptions"; "Gmail … was blocked" |
| Rocket Money | Plaid bank link | ~$1M (DECISIONS) | 2.18★ (250) | bank can't connect / disconnects |
| SubFind | Statement PDF/CSV, "AI scans it" | ~$5k | 30 ratings | "Zero Plaid or Open Banking" |
| Orbit | Screenshots, CSV, statements ("Magic Import") | ~$2k (DECISIONS) | 4.41★ (22) | "import features … simply don't work for me" (2★) |
| Outflow | **FinanceKit**, paste/screenshot/PDF, guided "where subs hide" audit | new | 1 rating | Label "Data Not Collected"; one-time Pro with Family Sharing |
| SubTrack (Airussolutions) | Receipts (.eml, PDF, screenshots) on the phone + on-device AI | new | 0 | "nothing counts until you confirm it" |
| Subtle, Recur, SubManager | Screenshot/PDF/email text on the phone, Apple Intelligence | small | few | "No bank linking, no email scanning" |
| SubRadar (two apps) | Gmail scan | new | 0 | First scan free, then paid |

**Takeaways:**
1. "We find them for you" is what earns the money in this niche.
2. The money is made despite poor accuracy and trust, so honesty plus good on-phone tools is an open position.
3. Outflow is the closest to our plan. Watch it.

## Sources not linked inline
- [Apple FinanceKit docs](https://developer.apple.com/documentation/financekit) (requirements: organization account, Account Holder, `NSFinancialDataUsageDescription`); [TransactionPicker, iOS 18](https://developer.apple.com/documentation/financekitui/transactionpicker)
- [Google Workspace user data policy](https://developers.google.com/workspace/workspace-api-user-data-developer-policy); [Nylas on Google verification](https://developer.nylas.com/docs/dev-guide/provider-guides/google/google-verification-security-assessment-guide)
- [AppKittie API](https://www.appkittie.com/docs/api-reference/apps/list-apps); [iTunes Search API](https://itunes.apple.com/search?term=subscription+tracker&entity=software&country=us)
- [expo-share-intent on npm](https://npmjs.com/package/expo-share-intent) (9.0.0, Oct 21, 2026, peer `expo ^58`); [Callstack on Apple's on-device LLM in React Native](https://www.callstack.com/blog/on-device-apple-llm-support-comes-to-react-native)
- [PageCrawl on streaming price monitoring](https://pagecrawl.io/blog/streaming-service-price-change-monitoring)
