# What to add next: features and moats (Nov 15, 2026)

Merges `moat-and-pro-features.md` (Nov 10), `features-market-2026-11-15.md` (market: 405 apps, 2,335 reviews) and `platform-moats-2026-11-15.md` (Apple tools and cancellation law). Nothing here changes a locked decision. Picks need the owner's OK.

## The big picture
- **Apple's new tools aren't a moat.** Every developer gets them free. Our moat is the data we feed them: checked prices in 29 countries, 75 sourced price rises, 43 comparisons and dated cancel guides. Nobody else has that data.
- **Apple moved in (iOS 27):** for US Apple Card users, Wallet now shows recurring charges and can alert before them. So "see your subscriptions" is no longer special. Lead with: **every card, every App Store sub, every trial, with help cancelling.**
- **The loudest complaints in the market are about cancel-for-you and bank-link apps:**
  - charged by the app or can't cancel it: 71
  - didn't find my subs: 45
  - "cancels for you" didn't: 32
  - "a subscription to cancel subscriptions": 28
  - bank link broke: 21

  Our honest, no-bank-login approach already answers them.
- **New rival to watch: Outflow.** $4.99 one-time, 25 updates since June, family sharing, "Data Not Collected". It barely sells yet: 5 ratings.

## Ranked list
Score /10 = user demand × fit with "your list stays on your phone" × moat × conversion. Effort: S = days, M = 1–2 weeks, L = a month or more.

| # | Feature | Why | Free / Pro | Effort | When | Score |
|---|---|---|---|---|---|---|
| 1 | **Price-rise alerts from our own data**: "Netflix is going up to $19.99 on your next bill" | The only feature built on data nobody else has: 75 sourced rises, monthly rechecks. Apple only estimates dates, and only for Apple Card | Pro | M | v1.1 | **9** |
| 2 | **Duplicate and overlap check**: "Netflix twice", "3 music services, $36 a month" | 5 reviews ask, 3 rivals shipped it. It leads straight to the ditch moment | Free | S | v1 | **8.5** |
| 3 | **Free screenshot import, read on the phone**: Apple's built-in text reading on every iPhone, Apple's on-device AI on iPhone 15 Pro and newer, never the cloud | Answers "didn't find my subs" (45 reviews). 4 rivals have it; SubTracker made it free | Free in onboarding, Pro afterwards (as planned) | M | M3 | **8.5** |
| 4 | **"Paid with" card, account email and notes fields**, plus a filter by card, shown on the cancel screen | 8 reviews, 4 rivals. "Which card is it on?" is the first question when you try to cancel | Free | S | v1 | **8** |
| 5 | **"Your rights" box in cancel help** (app and website): US ROSCA, California, New York, UK from 2027, EU, Germany, France | Dated, sourced, local. Nobody else does it, and it builds trust and search traffic. Needs the lawyer check | Free | M | v1.1 | **8** |
| 6 | **"Add to Ditch" links from the website**: price pages and cancel guides open the app with the service filled in | A growth loop from our search traffic into the app. Needs Universal Links (dev build) | Free | S–M | with the dev build | **7.5** |
| 7 | **Year-ahead view, plus an extra reminder 30 days before big yearly charges** | 6 rivals. Yearly charges are the ones that hurt most | View free; extra reminder Pro | M | v1.1 | **7.5** |
| 8 | **Cheaper-plan check from our comparisons**: "Yearly would cost you $40 less", "Duo costs less than 2 Individuals" | Uses our 43 comparisons and per-country plans. Shows real money | Pro | M | v1.1 | **7.5** |
| 9 | **Lead with "every card"** in App Store text and screenshots, plus "made for iPhone Duo and iPad", plus a "Ditch vs Apple Wallet" page | Zero code. 6 rivals now say Duo | — | S | before launch | **7** |
| 10 | **Mark as paid / skip this one** | 4 rivals. Quiets a reminder once without muting the subscription | Free | S | v1.1 | **7** |
| 11 | **Before-payday view** (you enter your payday date only, no income) | 5 reviews. Rocket Money got 1★s for removing its version | Free | M | v1.1 | **6.5** |
| 12 | **Cancel guide for when someone has died** (website first) | 2 reviews, no rival covers it, helps search | Free | S | website now | **6** |
| 13 | Siri, Shortcuts and Spotlight ("What renews this week?") | 5 rivals, 0 reviews asking. The library is still alpha | Free | M | v2 | **5.5** |
| 14 | FinanceKit "new charge spotted" (US Apple Card, Apple Cash and Savings, plus 13 UK banks) | Real but narrow. Apple must approve it, and we'd need our own Swift code | Pro | L | v2 | **5** |
| 15 | AlarmKit loud alarm, opt-in, for big trial endings only | Unknown whether App Review accepts it | Pro | S–M | experiment | **4** |
| — | **Skip:** AI-written cancel steps (they'd invent menus), cloud AI on user documents (breaks "on your phone"), Visual Intelligence "Add to Ditch" (unclear App Review), email reminders (Nov 10) | | | | | |

## Owner decisions
1. **Privacy label vs RevenueCat.** 7 rivals show "Data Not Collected". With RevenueCat, Ditch shows "Data Not Linked to You: Purchases". Buying through Apple's StoreKit 2 directly would keep "Data Not Collected", but we'd lose RevenueCat's dashboards and paywall tests, and we'd write more purchase code ourselves. Lean: keep RevenueCat for launch (7/10), because purchase bugs are the costliest kind for a first app. Revisit after 1,000 downloads.
2. **The extra yearly reminder (#7):** Pro (lean) or free.
3. **Family Sharing for Pro:** still pending since Nov 10. Outflow offers it.
4. **"Your rights" wording:** add it to the 1-hour lawyer check.
5. **FinanceKit:** has the request been sent to Apple? (v2)
