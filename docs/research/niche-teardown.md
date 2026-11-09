# Niche teardown: local prices and competitor flows

Written Nov 9, 2026. This covers three things: how other subscription trackers handle prices in different countries (Part A), how Ditch should do it (Part B), and a step-by-step look at competitors' main flows (Part C). It changes no locked decision. The price data is in **`prices-2026-11.json`** next to this file. How prices stay fresh over time is in `autosync.md`. Paywall details are in `paywalls-competitors.md`, so this doc doesn't repeat them.

## Summary
1. **Our onboarding shows US prices to everyone.** A UK Netflix user sees "about $17.99". The real price is £13.99. In India it's ₹499.
2. **Even the US prices are out of date.** Of the 12 US prices I verified on official pages today, 6 are wrong in `services.ts`. Examples: Netflix is $19.99 (we say $17.99), Apple TV is $14.99 (we say $12.99), HBO Max is $18.49 (we say $16.99).
3. **Euro isn't one price.** Netflix Standard is €15.99 in Germany, €14.99 in France, Italy and Spain, and €18.99 in Ireland. Prices have to be stored **per country**, not per currency.
4. **Plan names differ by country.** India has Netflix "Mobile" and Spotify "Standard/Platinum". Ireland and the Netherlands have no Netflix ad tier.
5. **Only one competitor localizes catalog prices: Orbit.** It uses the iPhone's Region setting. The same screen shows S$ prices in Singapore and ₹ prices in India, while its paywall stays in the App Store currency.
6. Most others (Bobby, Subo, Rocket Money, Chronicle) **don't prefill prices** at all, or are US-only.
7. **Reviews:** about 50 of 2,872 reviews I read are about currency. The repeat complaints: "only USD", "$ for both USD and AUD", sums that add currencies wrongly, and Subpilot UK: "all values are in euros".
8. **Where tracker users are (AppKittie):** US 21–38%, then **Italy (14–20%)**, the UK, France, Germany, Canada and Spain. India and Brazil aren't measured.
9. **Pick:** bundle a per-country price file covering **12 countries** (US, GB, CA, AU, IE, NZ, DE, NL, FR, IT, ES, IN) and ~25 services. Each row has its plans, currency, a "checked" date and a source link.
10. **Country:** read it from the iPhone's Region setting, with a "Prices for 🇬🇧 UK · Change" line on the tick screen. No extra onboarding step.
11. **Plan:** a small inline plan chip on ticked rows ("Standard £13.99 ▾"). It's not a pop-up, so ticking stays fast.
12. **No data for a country?** The service is still tickable and shows "Add your price". We never show a US price in pounds.
13. **Totals:** one line per currency, as CLAUDE.md requires. Every amount is formatted so "US$" and "A$" never look alike.
14. **Flow lessons, ranked by conversion impact:** (1) a correct local total in under a minute, (2) no account wall, (3) ask for notifications with a preview, (4) inline plan pick, (5) an honest paywall beats a weekly hard paywall on refunds and reviews.
15. **Only you can do this:** nothing new for v1. The price robot in `autosync.md` needs a GitHub repo and a domain later.

---

## 1. The problem on one screen

Netflix "Standard" (or the closest plan) on Netflix's own help page, read today ([help.netflix.com/en/node/24926/{country}](https://help.netflix.com/en/node/24926/gb)):

| Country | Ads tier | Standard | Premium | What Ditch shows today |
|---|---|---|---|---|
| 🇺🇸 US | $8.99 | **$19.99** | $26.99 | about $17.99 (wrong) |
| 🇬🇧 UK | £7.99 | **£13.99** | £20.99 | about $17.99 |
| 🇩🇪 Germany | €6.99 | **€15.99** | €21.99 | about $17.99 |
| 🇫🇷🇮🇹 France, Italy | €7.99 | **€14.99** | €21.99 | about $17.99 |
| 🇪🇸 Spain | €8.99 | **€14.99** | €21.99 | about $17.99 |
| 🇮🇪 Ireland | — (Basic €11.99) | **€18.99** | €25.99 | about $17.99 |
| 🇳🇱 Netherlands | — (Basic €9.99) | **€15.99** | €20.99 | about $17.99 |
| 🇨🇦 Canada | CA$7.99 | **CA$18.99** | CA$23.99 | about $17.99 |
| 🇦🇺 Australia | A$9.99 | **A$20.99** | A$28.99 | about $17.99 |
| 🇳🇿 New Zealand | — (Basic NZ$17.99) | **NZ$25.99** | NZ$33.99 | about $17.99 |
| 🇮🇳 India | — (Mobile ₹149, Basic ₹199) | **₹499** | ₹649 | about $17.99 |

Why it matters for conversion: the onboarding total ("That's $1,091 a year") is the moment that makes people care. If a British user sees dollars, the number is wrong, it feels foreign, and they stop trusting everything after it, including the paywall.

**Our own US file is already stale.** Official pages today compared with `src/catalog/services.ts`:

| Service | Ditch says | Official today | Source |
|---|---|---|---|
| Netflix Standard | $17.99 | **$19.99** | Netflix Help |
| Spotify Individual | $11.99 | **$12.99** | spotify.com/us/premium |
| Apple Music Individual | $10.99 | **$11.99** | apple.com/apple-music |
| Apple TV+ (now "Apple TV") | $12.99 | **$14.99** | apple.com/apple-tv |
| Apple One Individual | $19.95 | **$21.95** | apple.com/apple-one |
| Max (now "HBO Max") Standard | $16.99 | **$18.49** | hbomax.com |
| YouTube Premium | $13.99 | $15.99 (press, unverified) | Tom's Guide |
| Still right | iCloud+ 200 GB $2.99 · Microsoft 365 $99.99/yr · Nintendo $19.99/yr · Audible $14.95 · Claude Pro $20 · Apple Arcade $6.99 | | |

---

## Part A: how competitors handle prices by country

### A.1 The comparison

Sources: Mobbin screens, AppKittie onboarding captures, App Store descriptions (iTunes Lookup API) and screenshots, and reviews. "?" means I couldn't see it.

| App | Catalog? | Prefills a price? | Price changes by country? | Where its currency comes from | Currency per sub? | Mixed currencies in totals | Evidence |
|---|---|---|---|---|---|---|---|
| **Orbit** | Yes, by category, with search ([▸][o-catalog]) | **Yes in onboarding** ("Typical monthly price, you can edit later"). **No in the normal add flow:** Netflix opens at $0.00 ([flow][o-add-flow]) | **Yes.** Singapore capture: Netflix $19.98, Spotify $10.98 ([▸][o-tick]). India capture: Netflix ₹499, Spotify ₹119, YouTube ₹149 ([AppKittie][ak-orbit-2]) | Device Region. The India capture shows ₹ catalog prices with a **$24.99** paywall, so catalog and App Store currency are separate | Yes, a "$" chip next to the price ([▸][o-form]) | Converted into one "Preferred currency" (Settings shows "SGD $" ([▸][o-settings])) | Mobbin + AppKittie |
| **Rocket Money** | Short list with search: "Choose a subscription" ([▸][r-choose]) | Comes from the bank link | US only (AppKittie: 100% US users) | Bank data, USD | No | USD only | Mobbin |
| **Bobby** | "Choose from hundreds of existing services" | Not in its screenshots. A 2016 UK review asks for "Auto-fill subscription amount for known services (eg. £5.99 for Netflix)" | No sign of it | App default currency | Yes (reviews from 2019 on) | Converts to the default. Reviews call the conversion broken | App Store screenshots + reviews |
| **Subo** | Templates: "For You", "Popular", "Essentials", "App subscriptions" | No prices on the template tiles | No sign of it | Device | Yes ("Track subscriptions in different currencies") | ? | App Store screenshots + description |
| **Subpilot** | 500+ cancel guides. Onboarding chips (iCloud, AT&T, Verizon, Comcast…) are US-centric ([AppKittie][ak-sub-3]) | From bank/email scan | No. A UK user: "all values are in euros" | Bank data | ? | ? | AppKittie + reviews |
| **Chronicle** | Bill categories, not services | No | No | "it just grabs the currency of the current system" (review) | No | Can't mix | Reviews |
| **Subscription Manager (Kango)** | "has most major services" (review) | ? | No sign of it | Default | Yes | A US review says it adds pounds, CAD and HKD to dollars without converting | Description + reviews |
| **Subscriptions (Touchbits), Pandora, SubManager, Subscription Day** | Templates / quick add | ? | No sign of it | Default | Yes | Convert using daily or live exchange rates (all four say so in their descriptions) | Descriptions |

**Pattern:** nearly everyone lets you set a currency per subscription and then converts everything into one total using online exchange rates. **Only Orbit localizes the catalog prices themselves**, and only in its onboarding tick list. Nobody shows the source or "checked" date for a catalog price.

### A.2 Orbit up close (our closest rival)

- **Catalog prices follow the device Region.** The tick list says "Typical monthly price, you can edit later". It shows Singapore prices in Singapore ([▸][o-tick], [▸][o-tick2]) and rupee prices in India ([AppKittie][ak-orbit-2]). The total uses local number formats: "That's ₹5,988.00 a year" ([AppKittie][ak-orbit-3]) and "₹1,20,000" with Indian digit grouping.
- **It quietly mixes currencies when it lacks data.** In the Singapore capture, Hulu ($25.99), Peacock ($15.99) and Paramount+ ($11.99) show US-looking prices with a bare "$", right next to Singapore-dollar prices. None of those three services is sold in Singapore. Ditch must not do this.
- **The add-subscription form loses the local price.** From the catalog, Netflix opens at "$ 0.00" ([flow][o-add-flow]). The onboarding knows the price but the normal add flow doesn't use it.
- **Its trial note is good:** "You'll be reminded about this free trial on 27 November, before it ends on 28 November." ([▸][o-trial]). It also has Price History per subscription ([flow][o-detail-flow]).
- **Red flags not to copy:**
  - The same review text appears under a different name and flag in each region: "DavidTan 🇸🇬" on the Singapore paywall ([▸][o-paywall]), "RahulSharma 🇮🇳 … Another ₹58,000 saved!" on the India one ([AppKittie][ak-orbit-5]).
  - The headline claim changes with the region too: "save $300 a year" vs "₹20,000 a year". Both are unsourced.
  - Its iCloud import lists App Store subscriptions at "$0.00" and asks you to "Upgrade to Add (9)" ([flow][o-icloud]).
- **Correction to `paywalls-competitors.md`:** that doc says Orbit has "no notification ask in onboarding". The newer AppKittie capture shows the iOS system prompt "'Orbit' Would Like to Send You Notifications" right after the total, with no pre-prompt ([AppKittie][ak-orbit-4]).

### A.3 What reviews say

I read 2,872 App Store reviews (US, GB, DE, IN, AU, CA RSS feeds) for 15 trackers. **About 52 (under 2%) are about currency or local prices**, mostly from Canada, the UK, Australia and India, or from Americans who pay in two currencies. It's a small share but a sharp one: these people leave or downgrade over it.

- **Same symbol, different money.** "Many of my subscriptions are in USD … but uses the same symbol ($). This makes subscriptions in USD look significantly cheaper than they actually are leading to some nasty surprises." (Bobby, AU, 3★, May 2024)
- **US-only apps.** "I browsed the whole U.K. store … a lot either only use USD as the currency and/or only work with US Accounts." (Bobby, GB, 5★, 2018)
- **Wrong country, wrong money.** "all values are in euros and I can't link my bank because it doesn't recognise UK banks!" (Subpilot, GB, 1★, Jun 2026). "It told me that I was paying Amazon $139 a year and also $8.99 a month for Prime! Not true." (Subpilot, GB, 1★, Oct 2026). That's US Prime pricing shown to a UK user.
- **Bad maths with mixed currencies.** "when automatically summing amounts for currencies like Pound, CAD, and HKD, the exchange rate isn't used; instead, it directly adds the USD amount to the local currency amount." (Subscription Manager, US, 4★, Apr 2026). "showing me a strange and totally nonsense number like TWD$315" (Bobby, AU, 2★).
- **Stuck with the system currency.** "it just grabs the currency of the current system and you cannot change it in the app settings." (Chronicle, US, 2★, 2023)
- **People want prefilled local prices and plans.** "Auto-fill subscription amount for known services (eg. £5.99 for Netflix)" (Bobby, GB, 4★). "Bring in the actual subscription plan choices for users so they don't have to look up their plan amount during on-boarding. Most people know their plan but not the dollar amount." (Bobby, US, 4★, 2020)
- **Praise when it works.** "able to pick the currency per subscription … view in your local currency" (Orbit, CA, 5★). "handles multiple currencies like a charm" (Touchbits, GB, 5★).

**What this means for Ditch:** the plan-picker review is the strongest signal. People know "I'm on Standard", not "£13.99". A plan chip turns that knowledge into a correct price with one tap.

### A.4 Market numbers (AppKittie estimates, Nov 9, 2026)

| App | Revenue / mo | Downloads / mo | Price model | Users by country (top) |
|---|---|---|---|---|
| Rocket Money | ~$1.0M | ~251k | Subscription, pay-what-you-want | US 100% |
| MonoBoost | ~$160k | ~25.7k | **Weekly $9.99**, yearly $99.99 | US 100% |
| Subpilot | ~$85k | ~12.6k | **Weekly $9.99** (3-day trial), monthly $24.99 | US 91% |
| Bobby | ~$33k | ~11.9k | One-time $0.99–2.99 | US 38, **IT 14**, ES 10, DE 5, CA 5, GB 5, FR 4 |
| SubSeek | ~$29k | ~27.7k | Weekly $6.99–9.99 | US 92% |
| Chronicle | ~$4.2k | ~3.1k | $14.99/yr | US 89% |
| Subscriptions (Touchbits) | ~$3.9k | ~6.7k | $2.99/yr, $8.99 lifetime | US 31, CN 20, CA 10 |
| Subscription Manager (Kango) | ~$3.1k | ~2.1k | $9.99/yr, $4.99 one-time | US 76, CA 11 |
| Orbit | ~$2.2k | ~6.7k | $19.99/yr, $24.99–39.99 lifetime | US 21, **IT 17**, GB 13, FR 10, CA 8, DE 6 |
| Subo | ~$1.4k | ~8.2k | $24.99 lifetime, non-renewing passes | US 21, **IT 20**, DE 13, FR 8, ES 6, NL 6 |

- **Two different markets.** The "we find and cancel for you" apps (weekly paywalls) are 90–100% American and earn the most. The calm, catalog-plus-currency apps (Bobby, Orbit, Subo) have **60–80% of their users outside the US**, and Italy is consistently #2.
- That second group is Ditch's crowd (manual, private, honest). **Local prices are not a nice-to-have for us. They matter to most of our likely users.**
- Caveat: AppKittie's country split covers only 26 countries and is lifetime, not monthly. India, Brazil and Mexico aren't included. Bobby, Orbit and Subo are also translated into 9–32 languages, which helps them in Italy. Ditch v1 is English-only.

---

## Part B: how Ditch should do local prices

### B.1 Where reliable prices come from

| Service | Best source | Machine-readable? | Notes |
|---|---|---|---|
| Netflix | Help Center "Plans and Pricing" with a country code in the URL: `help.netflix.com/en/node/24926/gb` | **Yes**, plain HTML | Best source I found. Lists each country's own plans. |
| Spotify | `spotify.com/{cc}/premium/` | **Mostly.** Duo and Family are plain; Individual sits in the trial text ("then £12.99 per month") | India and Japan call it "Standard". Spain's Individual price wasn't in the text. |
| iCloud+ | Apple Support "iCloud+ plans and pricing" ([108047](https://support.apple.com/en-us/108047)), published Sept 16, 2026 | **Yes**, one table for every country | One "Euro" row for euro countries. |
| Apple Music, TV, Arcade, One | `apple.com/{cc}/apple-music/` etc. | **Yes** | Apple TV+ is now called "Apple TV". |
| Microsoft 365 | `microsoft.com/{locale}/microsoft-365/buy/compare-all-microsoft-365-products` | **Yes** | Monthly and yearly side by side. |
| Disney+ | `disneyplus.com/{locale}` | **Yes** in Europe and NZ | The US now sells it as a Disney+/Hulu bundle. AU and CA pages had no prices in text. |
| HBO Max, Nintendo, Audible, Claude | Official pricing pages (US) | Yes | US checked only. |
| YouTube Premium, Google One, Canva, Xbox, PlayStation Plus | Official pages | **No.** Prices appear only after the page loads in a browser | Needs a headless browser (the robot in `autosync.md`) or a person. |
| Amazon Prime, Adobe, ChatGPT, Crunchyroll | Official pages | **Blocked** our automated read | Check by hand. |

**Public price lists and indexes** (useful to cross-check, not to copy):

| Source | Freshness | Can we use it? | Score |
|---|---|---|---|
| [tompec/netflix-prices](https://github.com/tompec/netflix-prices) (GitHub JSON, every country) | "Updated regularly" (per `autosync.md`) | CC BY 4.0, so yes with credit in Settings → About | 7/10 |
| [Teknofilo](https://www.teknofilo.com/precios-netflix-mayo-2024) Netflix table in euros | April 2026 | Article, all rights reserved. Cross-check only | 4/10 |
| [Selectra](https://selectra.com.au/streaming/providers/netflix-plans-around-the-world) Netflix by country | Says 2026 | Article. Cross-check only | 4/10 |
| [PriceWorld](https://priceworld.com/indexes/netflix/) Netflix index | Showed "Quiet, for now" when I opened it | No | 1/10 |
| [Comparitech](https://comparitech.com/blog/vpn-privacy/countries-netflix-cost/), Beebom, VPN blogs | Old or affiliate-driven | No | 1/10 |

- **Licensing in plain words:** a price is a fact. Facts aren't owned. Copying someone's whole table can still break their terms, or EU "database rights". Reading official pages ourselves avoids that.
- **Staleness is the real risk.** Netflix, Spotify, YouTube, Paramount+, Peacock and HBO Max all raised US prices in the last 12 months. Assume about half of the rows go stale within a year.

### B.2 Which countries and services first

**Countries (12):** where tracker users are (AppKittie), English first, and cheap to add.

| Wave | Countries | Why |
|---|---|---|
| **Launch** | 🇺🇸 US, 🇬🇧 UK, 🇨🇦 Canada, 🇦🇺 Australia, 🇮🇪 Ireland, 🇳🇿 New Zealand | English-speaking. They read Ditch as-is. US, UK and Canada are big in every tracker's split. |
| **Launch** | 🇩🇪 Germany, 🇳🇱 Netherlands, 🇫🇷 France, 🇮🇹 Italy, 🇪🇸 Spain | 30–50% of Bobby, Orbit and Subo users. Many use English apps. Euro prices differ by country, so each needs its own rows. |
| **Launch** | 🇮🇳 India | Huge and growing iPhone base, English-speaking, and very different prices and plans. AppKittie can't measure it, so treat it as a bet. |
| Next | 🇨🇭 Switzerland, 🇦🇹 Austria, 🇧🇪 Belgium, 🇸🇪 Sweden, 🇵🇹 Portugal, 🇯🇵 Japan, 🇧🇷 Brazil, 🇲🇽 Mexico, 🇸🇬 Singapore | Add when translations ship or downloads show up there. |

**Services (~25):** the global ones from our catalog first. `prices-2026-11.json` covers 17 of them now (Netflix, Spotify, iCloud+, Apple Music, Apple TV, Apple Arcade, Apple One, Disney+ and Microsoft 365 in most countries; HBO Max, Nintendo, Audible, Claude Pro, Dropbox, Notion, YouTube and ChatGPT in the US). Still to do: Amazon Prime, YouTube Premium (all countries), Google One, Xbox Game Pass, PlayStation Plus, Duolingo, Canva, Adobe, Crunchyroll, Headspace, Calm, Strava.

**US-only services** (Hulu, Peacock, Walmart+, Costco, DashPass, Instacart, SiriusXM) should be listed only in the US. Each catalog entry gets an `availableIn` list.

**Local favourites per country** come later, but they matter. Up, an Australian bank app, shows a local list: Telstra, Optus, amaysim, Stan, ALDI Mobile ([▸][up-au]). Candidates to verify: UK NOW and Deliveroo Plus; Germany RTL+, Joyn and DAZN; Italy DAZN and TIMvision; Spain Movistar Plus+; France Canal+ and Deezer; Australia Stan, Binge and Kayo; Canada Crave; India JioHotstar, SonyLIV and Zee5.

### B.3 Data model

Keep the catalog (names, logos, cancel steps) separate from the prices. Prices change often; logos don't.

```ts
// src/catalog/prices.ts — loaded from a bundled prices.json
type PlanPrice = {
  id: string;            // 'standard', 'standard-ads', 'premium'
  name: string;          // shown in the plan chip, as the service names it locally
  amountMinor: number;   // integer, in the currency's minor unit (JPY has none)
  cycle: Cycle;          // 'monthly' | 'yearly' | ...
  default?: boolean;     // the plan we pre-pick
};
type CountryPrice = {
  serviceId: string;     // matches SERVICES ids
  country: string;       // ISO 3166 'GB'
  currency: string;      // ISO 4217 'GBP'
  plans: PlanPrice[];
  checked: string;       // 'YYYY-MM-DD'
  source: string;        // official URL
  status: 'verified' | 'partial' | 'unverified';
};
```

- **Only `verified` and `partial` rows ship.** `unverified` rows stay in the research file.
- **New columns on a saved subscription** (one migration): `catalog_plan_id`, `catalog_country`. These add to the existing `catalog_id`, `currency` and `amount_is_estimate`. This lets the app say "about" until the user confirms, and lets `autosync.md`'s price-change heads-up find who's affected.
- **Settings gets a `price_country`** (defaults to the Region), separate from `default_currency`.
- **Tests (Jest):**
  - every amount is a whole number
  - every row's currency matches its country
  - each service has exactly one default plan
  - the US Netflix Standard row turns into $239.88 a year
  - **a "stale" test that fails when any row is older than 120 days.** That turns "prices go stale" into a red test instead of a silent bug.

**How to keep it fresh:**

| Option | How it works | Score | Notes |
|---|---|---|---|
| A. Bundled JSON, updated with each app release | Edit the file, ship an update | **8/10 for launch** | Simple, works offline, no privacy questions. A price change waits for the next release. |
| B. Same JSON pushed with EAS Update | Expo sends new JS and assets without App Review | 7/10 | Fast fixes. Needs care with app versions. |
| C. One public `prices.json` on our domain, checked weekly | Covered fully in `autosync.md` | 8/10 from v1.1 | Same file for everyone, nothing personal sent. |
| D. A paid price API | — | 2/10 | I found none that's reliable, and it adds cost and privacy questions. |

**Pick A now, C from v1.1**, as `autosync.md` already recommends.

### B.4 What the user sees

**1. Which country's prices?**

| Option | Score | Why |
|---|---|---|
| **iPhone Region setting** (`expo-localization` → `regionCode`), plus a "Prices for 🇬🇧 United Kingdom · Change" line on the tick screen | **9/10** | No extra step. Works in Expo Go. It's what Orbit does. The Change link covers expats. |
| App Store country (StoreKit storefront, via RevenueCat or a small module) | 6/10 | Closer to where Apple bills them, but it needs a development build, and RevenueCat's React Native method isn't confirmed. Use it later as a tie-breaker. |
| Ask "Where do you live?" as its own screen | 4/10 | One more screen means more people quit, for something we can usually guess. |

Pick: Region setting. Also use its `currencyCode` as the default currency for new custom subscriptions. Expo's docs say both come from the iOS Region setting, not the language.

**2. Which plan?**

| Option | Score | Why |
|---|---|---|
| **Inline plan chip on a ticked row:** "Netflix · Standard £13.99 ▾". Tapping it shows the 2–4 local plans in place | **9/10** | Ticking stays one tap. The plan is visible and fixable. It's exactly what the Bobby reviewer asked for. |
| Default plan only; change it later in edit | 6/10 | Fast, but the onboarding total is wrong for ad-tier and Premium users. |
| A pop-up "Which Netflix plan?" on every tick | 4/10 | Accurate, but it slows down the most important screen. |

Pick: the inline chip, only for services with 2+ common plans. Pre-pick the most common plan. The chip also shows in step 4 ("When do they charge you?"), so people can fix it there.

**3. "About" prices.** Keep "about £13.99 a month" while the price is a catalog estimate (`amount_is_estimate`). Totals say "about £1,091 a year" while any estimate is in them. Once the user edits or confirms, "about" goes away. In the US, add one line under the total: "US prices are before sales tax." UK, EU, Australian, New Zealand and Indian prices include VAT/GST, so they're already what people pay.

**4. No data for this country.**

| Option | Score | Why |
|---|---|---|
| **Tickable, row says "Add your price"; the total screen asks for the missing ones in a short list** | **8/10** | Honest. The reveal still works. No foreign currency sneaks in. |
| Show the US price, labelled "US price" | 3/10 | The wrong currency ends up in the total. It's what made Orbit's Singapore list wrong. |
| Convert the US price | 1/10 | Breaks the "never add currencies" rule and is simply wrong. Netflix UK isn't the dollar price converted. |
| Hide services we have no price for | 4/10 | People can't find Netflix and think the app is broken. |

Copy options for the row:

| Copy | Score |
|---|---|
| "Add your price" | **8/10** |
| "Price?" | 6/10 |
| "We don't have UK prices for this one" | 5/10 (too long for a row; fine in the sheet) |

**5. Mixed-currency totals.** One big total in the main currency, then a smaller line per other currency: "£1,091 a year" / "+ US$240 a year". Never add them together (CLAUDE.md §1), and never convert. We have no server and no exchange rates, and reviews show converting goes wrong. Always format with the user's locale and the item's currency (`Intl.NumberFormat`), so an Australian sees "US$10.00" next to "$15.99". That fixes the Bobby "same symbol" complaint.

**6. Honesty checks.**
- Never say "we detected your plan". The user picked it.
- The source link and "checked" date sit in the subscription's detail view: "Typical price from netflix.com, checked Nov 9, 2026."
- Never show a price we haven't verified.

### B.5 Build order (small steps)
1. Swap `services.ts`'s `amountMinor/currency` for a `prices.json` lookup by Region, starting with the verified rows in `prices-2026-11.json`. Fix the six stale US prices on the way.
2. Add the "Prices for … · Change" line and the Settings → "Prices for" row.
3. Add the inline plan chip and the "Add your price" fallback.
4. Add the per-currency total lines and the stale-data test.
5. Add one manual-test section: switch the iPhone Region to the UK, then India, and check the tick screen, the total and the paywall.

---

## Part C: flow teardown of the niche

Apps: **Orbit** (closest rival), **Rocket Money** (the biggest), **Bobby** (the classic), **Subpilot** (the weekly-paywall "finder"), **Subo** (the calm newcomer). Bobby and Subo aren't on Mobbin, so their rows come from App Store screenshots, descriptions and reviews. Compared with Ditch v10 (`design/v10/board-onboarding.jpg`, `board-app.jpg`).

### C.1 Step by step

| Step | Orbit | Rocket Money | Bobby | Subpilot | Subo | **Ditch v10** |
|---|---|---|---|---|---|---|
| **First screen** | Orbiting logos, "Welcome to Orbit", "Start tracking" ([▸][o-welcome]) | Logo, "$1.3 billion saved", "Create account" ([AppKittie][ak-rm-1]) | ? | Logo orbit, "Cancel Unwanted Subscriptions", "I already have an account" ([AppKittie][ak-sub-0]) | ? | Headline, a sample heads-up, a dated timeline, "See what I pay" |
| **Questions before value** | One stat: "$2,000 a year on forgotten subscriptions" (cites C+R) ([▸][o-overspend]) | Legal name, email, password, terms ([AppKittie][ak-rm-2]) | — | 10-step quiz: age, which subs, how often you check, trials… then an **email wall** ([AppKittie][ak-sub-3]) | — | None |
| **Pick what you pay for** | Tick list with local "typical" prices, "None of these" ([▸][o-tick]) | Bank link finds them | Catalog of "hundreds" of presets | Chips; then "You named 1. People like you actually have 11" | Templates | Tick grid with search, chips and a running total. **US prices only** |
| **Total reveal** | "That's $155.76 a year", then "How many others…?" ([▸][o-total]) | Spending dashboard | Monthly average | "Without Subpilot $1,676/yr, with $1,526" (no source) | Monthly and yearly totals | "$1,091 a year" with a per-service breakdown. **Strongest of the set** |
| **Notification ask** | iOS prompt with no pre-prompt, right after the total ([AppKittie][ak-orbit-4]) | Pre-prompt "Never miss important, personalized updates" plus "Tap Allow on the next screen" ([AppKittie][ak-rm-12]) | ? (reviews: reminders don't fire) | ? | ? | Pre-ask showing the real 9:00 lock-screen heads-up. **Best** |
| **Paywall** | Lifetime only, × is the only free path ([▸][o-paywall]) | Pay-what-you-want, no close (see `paywalls-competitors.md`) | One-time $0.99–2.99 for more than 5 subs | **Hard paywall:** weekly $9.99 with a 3-day trial, or $24.99/month ([AppKittie][ak-sub-15]) | Free up to 6 subs; $24.99 "Forever Pass", or non-renewing 3- or 12-month passes | Sheet: yearly with trial timeline, monthly, lifetime, "Continue free: reminders for 3" |
| **Home** | Count, "Total yearly", Free Trials section, "Get started guide" ([flow][o-onb-flow]) | Recurring: calendar strip, "Coming later", per-year totals by type ([▸][r-upcoming]) | Coloured cards, monthly total | ? | "Upcoming" timeline, "Remaining in August $90.93" | This week / Next week / Later, guesses marked, hold to ditch |
| **Add a subscription** | Catalog plus locked imports. The form asks for name, price with currency chip, date (defaults to today), cycle, trial toggle, list, category, payment method, notification (**1 day before**), price history, URL, notes ([flow][o-custom-flow]) | "Choose a subscription" or "Add a subscription" ([▸][r-choose]) | Big price on a brand-colour card. Name, description, category, first bill, cycle, duration, **"Remind me: Never"** by default | From the scan | Templates in seconds | Catalog plus custom (SPEC §4) |
| **Reminder default** | 1 day before | Bank alerts | Off ("Never") | ? | Before renewals, plus "Heads up" for yearly or big charges | **3 days + 1 day, 9:00** |
| **Calendar** | Calendar tab | Week strip, "Coming Up" | — | — | Month view with "$447.90 scheduled" | Month view with month total, dots, guesses |
| **Cancel help** | "Mark as Cancelled" plus a URL. No steps | **"Cancel this for me"** asks for your Amazon email and password. Or do it yourself: Phone, Website, Instructions ([flow][r-cancel-flow]) | — | "Easy Cancellation Guides … 500+ services" | — | Link, short steps, and "One last check: did you cancel?" |
| **Settings** | "Preferred currency SGD", Lists, Categories, Notifications Off ([▸][o-settings]) | Account, linked banks, "Change Monthly Fee", "Cancel Membership" ([flow][r-premium-flow]) | Default currency | ? | ? | Reminders, Free reminders, Pro, Data → Currency USD |

### C.2 Best in class, and what Ditch copies or beats

| Step | Best today | Ditch should |
|---|---|---|
| Welcome | Ditch v10 (shows the real heads-up) | Keep. Add nothing. |
| Pick what you pay for | Orbit (local prices, "you can edit later", "None of these") | **Beat it:** local prices with no silent foreign "$", a plan chip, a "Prices for…" line and "Add your price". |
| Total reveal | Ditch v10 (per-service breakdown); Orbit's local digit grouping | Keep. Format with the user's locale, one line per currency, "about" while estimated. |
| No account | Orbit, Bobby, Subo, Ditch | Keep no account. Rocket Money's 8 account screens and Subpilot's email wall are the opposite. |
| Notification ask | Ditch's lock-screen preview; Rocket Money's "Tap Allow" arrow | Keep the preview. Borrow the "on the next screen" hint. |
| Add form | Orbit (currency chip by the price, trial sentence with real dates) | Copy both. Also carry the local catalog price into this form, which Orbit fails to do. |
| Reminders | Ditch (3 + 1 days, 9:00); Subo's "Heads up" for yearly or large charges | Keep. Consider Subo-style extra notice for yearly charges (Pro). |
| Calendar | Subo and Ditch (month total) | On par. |
| Cancel help | Rocket Money's self-serve options (Phone, Website, Instructions) | Copy the self-serve part. **Never** ask for passwords, and never say "we cancel for you". |
| Settings | Orbit's "Preferred currency" | Two rows: "Prices for: United Kingdom" and "Currency for new subs: GBP". |
| Paywall | Ditch (see `paywalls-competitors.md`) | Keep honest. Don't copy the weekly hard paywalls. |

### C.3 Lessons ranked by conversion impact

This is my judgment of impact, for our target user (iPhone, 23–40, a bit anxious about money, wants control and reliability). The honesty rules come first.

1. **A correct local total in under a minute** (helps onboarding completion and trial starts, high impact). The total is the "aha". Orbit and Ditch both get there in 3–4 taps, but only Orbit shows local money. A wrong currency makes an anxious user feel the app isn't for them. Evidence: the "only USD" and "Amazon $139" reviews, and that 60–80% of calm-tracker users are outside the US.
2. **No account or email wall before value** (completion, high). Rocket Money asks for legal name, email and password first. Subpilot gates its results behind an email. People who want control and privacy leave at a login form. Ditch already wins here, so keep it.
3. **Notification ask with a real preview** (retention and trial→paid, high). Reminders are the product (CLAUDE.md §3). Orbit fires the raw iOS prompt with no context. Rocket Money primes it first. Ditch's lock-screen preview beats both. Every "Don't Allow" is a user who will never get the value.
4. **Inline plan pick** (completion and trust, medium-high). It makes the total right for ad-tier and Premium users at the cost of one optional tap. Bobby's reviewers asked for it.
5. **Honest paywall vs weekly hard paywall** (trial→paid, refunds, reviews, medium). Weekly paywalls earn a lot in the US ($85–160k a month), but their reviews read like "50 euro direkt abgebucht" (50 euros charged straight away; Subpilot, DE, 1★). For Ditch's trust-first user, the honest sheet with a free path protects ratings, and ratings drive downloads.
6. **Cancel help without credentials** (retention, medium). Rocket Money's concierge needs your Amazon password. Ditch's link plus "did you cancel?" check gives the same feeling of control without the risk.
7. **Price-rise heads-up and price history** (retention, low-medium now, higher later). Orbit has Price History, and `autosync.md` plans "Netflix is going up". It's a reason to keep Ditch installed, and it needs this doc's country and plan columns to work.

---

## Sources

**Official pricing pages (read Nov 9, 2026):**
- [Netflix Plans and Pricing](https://help.netflix.com/en/node/24926), per country via `/node/24926/{cc}`
- [Spotify Premium](https://www.spotify.com/uk/premium/), per country via `/{cc}/premium/`
- [Apple iCloud+ plans and pricing](https://support.apple.com/en-us/108047)
- [Apple Music](https://www.apple.com/apple-music/), [Apple TV](https://www.apple.com/apple-tv/), [Apple Arcade](https://www.apple.com/apple-arcade/), [Apple One](https://www.apple.com/apple-one/), plus country paths
- [Microsoft 365 compare](https://www.microsoft.com/en-us/microsoft-365/buy/compare-all-microsoft-365-products)
- [Disney+ UK](https://www.disneyplus.com/en-gb)
- [HBO Max](https://www.hbomax.com/)
- [Nintendo Switch Online](https://www.nintendo.com/us/switch/online/)
- [Audible](https://www.audible.com/ep/memberbenefits)
- [Claude pricing](https://claude.com/pricing)
- [Dropbox](https://www.dropbox.com/plans), [Notion](https://www.notion.com/pricing)

**Press (not verified on an official page):**
- [Tom's Guide on YouTube Premium](https://www.tomsguide.com/entertainment/streaming/google-just-announced-a-price-hike-for-youtube-premium-heres-what-youll-pay-now)
- [MacRumors on Spotify US](https://www.macrumors.com/2026/01/15/spotify-increasing-subscription-prices/)
- [Tom's Guide 2026 streaming costs](https://www.tomsguide.com/entertainment/streaming/what-streaming-costs-in-2026-the-price-of-netflix-disney-plus-max-and-more)
- [ChatGPT India pricing](https://bestmediainfo.com/mediainfo/mediainfo-digital/chatgpt-introduces-india-exclusive-pricing-with-plus-plan-at-rs-1999-pro-plan-at-rs-19900-9662640)

**Tools and docs:**
- [Expo Localization](https://docs.expo.dev/versions/latest/sdk/localization/) (`regionCode`, `currencyCode` come from the iOS Region setting)
- [RevenueCat community on storefront country](https://community.revenuecat.com/sdks-51/how-to-check-if-the-user-is-on-the-us-storefront-6357)
- [AppKittie API docs](https://www.appkittie.com/docs/llms.txt). I used app details, country split and onboarding screens, with the API key from the environment. The country split covers 26 countries only.
- iTunes Search and Lookup API: `https://itunes.apple.com/search?term=…&entity=software&country=us`
- Reviews: `https://itunes.apple.com/{us,gb,de,in,au,ca}/rss/customerreviews/page={1–5}/id={appId}/sortBy=mostRecent/json`, for 15 apps (Bobby 1059152023, Rocket Money 1130616675, Orbit 6692620188, Chronicle 572561420, Subpilot 6751181747, MonoBoost 6740202306, Subscription Manager 1259029889, SubSeek 6769329967, Subscriptions 1577082754, Subtrack 1519946553, Subo 6741823650, Pandora 1470560916, Subscription Stopper 6448767732, SubManager 1632853914, Subscription Tracker 1502336248)

**AppKittie onboarding captures:**
- Orbit, India region: [00][ak-orbit-0] [02][ak-orbit-2] [03][ak-orbit-3] [04][ak-orbit-4] [05][ak-orbit-5] [10][ak-orbit-10]
- Rocket Money: [01][ak-rm-1] [02][ak-rm-2] [12][ak-rm-12]
- Subpilot: [00][ak-sub-0] [03][ak-sub-3] [15][ak-sub-15]

[o-welcome]: https://mobbin.com/screens/0ad95c82-1dd1-4c8e-9100-4615486bf514?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-overspend]: https://mobbin.com/screens/0aefbc5b-663c-4384-9fae-7378badec476?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-tick]: https://mobbin.com/screens/592b68fc-549e-4df6-9d80-bc55b9914e1a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-tick2]: https://mobbin.com/screens/a759f7af-d765-4ebd-acaa-43018378b1c9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-total]: https://mobbin.com/screens/c49f7e84-d043-49a6-9b03-404e98ee6426?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-paywall]: https://mobbin.com/screens/40d3a02c-2503-4cc1-b940-518ebc20f189?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-onb-flow]: https://mobbin.com/flows/340b7fb6-8b5d-416c-9f9f-501a27d669bc?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-catalog]: https://mobbin.com/screens/5702f396-80eb-4f99-845a-7f64a28d4962?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-add-flow]: https://mobbin.com/flows/78e8655b-afa5-43db-ab32-42b53002a748?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-custom-flow]: https://mobbin.com/flows/2ae810db-afeb-4c3a-b333-f025de119d71?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-form]: https://mobbin.com/screens/aff9c5d7-e623-4f8f-a54f-11ac9e59c412?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-trial]: https://mobbin.com/screens/e3e9608a-4898-41f1-8401-f3293c2242a1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-detail-flow]: https://mobbin.com/flows/d7c17e15-d253-4903-b667-ca73cc24eae0?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-settings]: https://mobbin.com/screens/8e57188c-e629-4b34-9aa8-2e7e9ae94622?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[o-icloud]: https://mobbin.com/flows/2fa785a2-9291-473a-b23d-c22d6734838e?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[r-choose]: https://mobbin.com/screens/c57d146f-d81c-463a-a89f-c6b0e0d42249?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[r-cancel-flow]: https://mobbin.com/flows/7702f8ba-dd42-4e06-8771-ffc7dd72ba7e?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[r-upcoming]: https://mobbin.com/screens/e7afdc11-22a0-4b85-8088-31a2d4b06eaa?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[r-premium-flow]: https://mobbin.com/flows/db97702f-0c9c-44c0-8bab-6a46eed1b45b?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[up-au]: https://mobbin.com/screens/28509fff-f51f-4ce3-bd6e-cd0cc524b1c9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[ak-orbit-0]: https://storage.appkittie.com/onboardings/com.flooben.orbit/00.jpg
[ak-orbit-2]: https://storage.appkittie.com/onboardings/com.flooben.orbit/02.jpg
[ak-orbit-3]: https://storage.appkittie.com/onboardings/com.flooben.orbit/03.jpg
[ak-orbit-4]: https://storage.appkittie.com/onboardings/com.flooben.orbit/04.jpg
[ak-orbit-5]: https://storage.appkittie.com/onboardings/com.flooben.orbit/05.jpg
[ak-orbit-10]: https://storage.appkittie.com/onboardings/com.flooben.orbit/10.jpg
[ak-rm-1]: https://storage.appkittie.com/onboardings/com.truebill.truebillnative/01.jpg
[ak-rm-2]: https://storage.appkittie.com/onboardings/com.truebill.truebillnative/02.jpg
[ak-rm-12]: https://storage.appkittie.com/onboardings/com.truebill.truebillnative/12.jpg
[ak-sub-0]: https://storage.appkittie.com/onboardings/io.zimran.subpilot/00.jpg
[ak-sub-3]: https://storage.appkittie.com/onboardings/io.zimran.subpilot/03.jpg
[ak-sub-15]: https://storage.appkittie.com/onboardings/io.zimran.subpilot/15.jpg

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
