# Feature gaps and new moat ideas: the market on Nov 15, 2026

The question: what has the market shipped, and what do users ask for, that `moat-and-pro-features.md` (Nov 10) missed? That study isn't repeated here. Everything comes from App Store pages, version histories and reviews pulled on Nov 15, 2026, plus Apple and press sources (linked at the end). Estimates are marked. Nothing here changes a locked decision.

## Summary
1. **Outflow is now the rival to watch.** It launched Jun 16, 2026, has shipped 25 versions in 5 months, costs **$4.99 one-time** (Family Sharing up to 6), and says "Data Not Collected". It has a guided "find what you forgot" audit, FinanceKit (iOS 27), household splits, Apple Watch, iPad and Mac, Siri, and "Worth a look" checks (price rises, overlapping services, big yearly renewals). It barely sells yet: **1 US and 4 UK ratings**.
2. **Apple moved again (new since Nov 10).** In iOS 27, Apple Card can now **notify you before a predicted recurring charge** ("Upcoming Transactions"), not just list it. This is Apple Card only and US only, and Apple warns the dates are "estimates, not confirmed charges".
3. **Our privacy edge is shrinking.** 7 direct rivals show **"Data Not Collected"** (Outflow, Recur, Subtrack, Subscriptions by Touchbits, Subio, Sublimit, Subscription Tracker). Ditch's label will say "Data Not Linked to You: Purchases" because of RevenueCat. "No bank login, no account" no longer sets us apart; it's the minimum.
4. **The iOS 27 and iPhone Duo wave.** Between Oct 7 and Nov 12, 6 rivals shipped "ready for iPhone Duo". Since July, 5 have added Siri, Shortcuts or Spotlight (App Intents). Rocket Money users are already asking for Duo layouts (3 reviews).
5. **Reviews, Aug 1 to Nov 15, 2026: 663 reviews of 23 apps (US and UK).** The biggest complaints are about the cancel-for-you apps:
   - charged by the tracker itself, or can't cancel it: 71
   - didn't find my subscriptions: 45
   - "cancels for you" didn't: 32
   - "a subscription to manage subscriptions": 28
   - bank link broke: 21

   This confirms our honest, no-bank position. It isn't new.
6. **New asks we hadn't logged:**
   - a duplicate and overlap check (5)
   - which card and which email each sub uses (4, plus 4 asking for notes on that)
   - a "before payday" view (5: Rocket Money removed theirs and got 1★s)
   - Duo layouts (3)
   - help cancelling for someone who died (2)
   - fear of AI assistants touching money (3)
7. **What rivals shipped in the last 6 months that Ditch lacks:**
   - year-ahead view and an extra heads-up before big yearly charges (6 apps)
   - mark as paid, skip this one, or mute this time (4)
   - card and payment-method fields with a filter by card (4)
   - free import from an Apple Subscriptions screenshot (SubTracker made it free; DueEve is built on it)
   - "Add to Calendar" without asking for calendar access (Outflow 6.1)
8. **AI is splitting the market.** The big apps add assistants: Rocket Money's Rowan (Sep 3), Copilot's Money Assistant (Oct 27), Monarch connectors for Claude (Nov 4) and ChatGPT (Nov 11). Indies keep AI on the phone (Recur, Outflow, Subtle) or let you bring your own key (Spendlight, Nov 11). Reviews are split: 3 fear it, 3 want it.
9. **Price models (new apps):** almost every new indie offers a one-time option ($4.99 to $99.99). Cancel-for-you apps still sell weekly plans ($6.99 to $9.99 a week). The one 1★ about a 3-sub cap at £40 a year (Subtle) backs our "track everything free" choice.
10. **82 new subscription or bill apps** turned up in our searches, all first released after May 15, 2026. Together they have **107 US ratings**, and only 3 have 10 or more. Launching is easy; getting noticed is not. Ratings and search ranking still decide who wins (moat #1 in the Nov 10 study).

---

## 1. Competitor scan

**Method:**
- 16 searches through the iTunes Search API: 8 terms, US and UK, 405 unique apps.
- iTunes Lookup (US and UK) for 37 apps.
- The public App Store web page of 32 apps, for in-app purchase prices, the privacy label and version history (up to 25 versions).

Ratings counts are each country's own App Store. "Lacks in Ditch" compares against Ditch today (`STATUS.md`) and what's already planned (M3 import, widget, iCloud backup, Price watch, Calendar sync, Wrapped). Features already planned are marked (planned).

### 1.1 Named competitors

| App | Last update | Ratings US / UK (avg) | Price model (App Store IAPs) | Listed features Ditch lacks |
|---|---|---|---|---|
| **Outflow** (new Jun 16, 2026) | 6.1, Nov 9 | 1 / 4 (5.0) | Free 5 subs. Pro **$4.99 one-time**, Family Sharing up to 6. Data Not Collected | Guided 4-place audit (Apple, Google Play, PayPal, statement); FinanceKit "find from transactions" (iOS 27); Shareflows (share chosen subs with a partner over iCloud, split by %); income and net position; Apple Watch (Pro); iPad and Mac layouts; Siri; **mark as paid**; **skip a payment**; pause; **CSV import from other apps**; **Add to Calendar without calendar access**; price-history graph and "What's gone up"; **Year ahead (12 months)**; "Worth a look" (price rises, **overlapping services**, big yearly renewals); filter by card; "Cancelled & saved" total; Every 2 Years cycle; budgets; Hindi, Chinese, Turkish and German |
| **Recur** | 2.2, Sep 23 (2.0 rewrite Jul 15) | 2 / 2 (5.0) | Full Version **$4.99 one-time**. iOS 26+. Data Not Collected | Smart Add (screenshots, emails and PDFs read on the device; share sheet; camera); **custom intervals up to 2 years**; mark cancelled with a last day; resubscribe after a pause; change plan / log a one-off payment; lifetime spent per service; reports; Year in Review; widgets (Home, Lock Screen, Control Center); Watch; Spotlight; Shortcuts; iCloud sync; JSON export; a **second earlier heads-up** before a pricey yearly renewal |
| **Orbit** | 1.3.3, Nov 8 | 134 (4.71) / 79 | Orbit Plus $12.99, $19.99/yr; lifetime $24.99 or $39.99 | Magic Import (screenshots, CSV, statements); **Siri, Shortcuts, Spotlight (iOS 27)**; **iPhone Duo**; one-time payments and fixed payment plans; widgets; iCloud backup; 30+ languages; billing history; "Featured by Apple" |
| **Chronicle** | 14.11.5, Nov 12 | 3,927 (4.83) / 68 | Chronicle Pro $14.99 (auto-renewing; the period isn't shown) | **Siri AI**: create bills, mark paid; **"Due soon" = before your next payday**; 12-month forecast; "amount to save" each month for non-monthly bills; estimated variable amounts; payment history with confirmation numbers; cloud sync and partner sharing; Mac app; Duo |
| **Bobby** | 3.10.4, **Dec 9, 2025** | 8,036 (4.75) / 1,007 | One-time packs, $0.99 to $2.99 | Nothing Ditch lacks. No update in 11 months |
| **Rocket Money** | 17.2.1, Nov 12 | 408,039 (4.47) / not in UK | Premium, pick your price, $2.99 to $11.99 a month; Premium+ | Bank link (Plaid); bill negotiation; "cancels for you"; **Rowan, an AI assistant that texts you** (Sep 3, Premium+). Off-mission for Ditch |
| **Subtrack** | 1.10.3, Sep 26 | 193 / 39 | Pro $8.99 one-time; Family $14.99. Data Not Collected | **Spaces** (personal, family, work); Mac app; iCloud sync; Face ID; Siri Shortcuts; pause; **mark paid with the real date**; an "Ended" tab; custom "upcoming" range; widgets that keep dates current with the app closed |
| **Subo** | 1.4.2, Oct 26 | 82 (4.84) / 17 | Free 6 subs. Forever Pass $24.99; **12 months $9.99 or 3 months $3.99, non-renewing**; tips | **"Heads up" for annual renewals and larger charges**; prepaid and fixed-term plans; plan-end reminders; reminders up to 60 days ahead; payment methods; Siri and Spotlight; Duo; automatic local backups; iCloud sync |
| **Subscriptions** (Touchbits) | 7.2.2, Nov 9 | 67 / 38 | Free 5. Subscriptions+ $8.95 one-time. Data Not Collected | **Cancellation periods and notice-deadline alerts**; documents; Watch; calendar integration; price history; next 12 months; share and import list files; Duo |
| **Track My Subs** (iOS) | 1.3.1, Aug 28 | 0 / 0 | Free 3 subs, **with no reminders at all** on Free. The IAP list shows $6.99/mo, $29.99/yr, $39.99 lifetime; the description still says $2.99 and $24.99 (mismatch) | Close to Ditch's model, but stricter. No real gap |
| **TrackMySubs.com** (web) | site © 2022 | n/a | Free 10 subs; $10/mo or $99.99/yr; Enterprise $30/mo | Email alerts to several people; Zapier; folders and tags; file storage. Server-based |
| **Copilot Money** | 8.7.2, Nov 4 | 31,056 (4.75) | $18/mo, $109/yr | Bank link; budgets; **Money Assistant** (AI, iOS 26, Oct 27). Off-mission |
| **Monarch** | 2.0.131, Nov 14 | 118,536 (4.89) | $14.99/mo, $99.99/yr; Plus $199.99/yr | Bank link; Gmail receipt forwarding; **MCP connectors for Claude (Nov 4) and ChatGPT (Nov 11)**. Off-mission |

### 1.2 New or trending entrants (first released or relaunched in 2026)

| App | Released | Ratings US / UK | Price model | What's new or different | Privacy label |
|---|---|---|---|---|---|
| **Spendlight** | **Nov 11, 2026** | 3 / 0 | No IAP listed yet | **"I used this" taps → cost per use**; flags unused subs; **spots services that do the same job**; 12-month charge breakdown; import from a Settings screenshot or a bank screenshot; Face ID; **optional AI with your own Claude, ChatGPT or Gemini account**, sent straight from the phone; "can't cancel for you — no app can" | Not linked: Financial Info, User Content |
| **DueEve** | Sep 17 | 13 (5.0) / 0 | $9.99/yr, $6.99/quarter, $14.99 lifetime | "A pre-charge decision tool, not a spending ledger"; import from **store subscription screenshots**; **"mute this period"**; several reminder times a day; sample data before your own | Not linked: Diagnostics, Identifiers |
| **SubTracker** (Saroar) | Mar 5 | 22 (2.73) / 1 | $1.99/mo, $8.99/6 mo, $14.99/yr, $49 lifetime | **All Apple subs from one screenshot, free for everyone** (Sep 24); price field opens Apple's subscription list; Watch app; its own trial tracked with reminders 3 days and 1 day before (same as Ditch #15); "Ready for iPhone Duo" | Not linked: Purchases (same as Ditch's expected label) |
| **Subtle** | Jul 2 | 6 / 7 | Free 3 subs; $6.99/mo, $39.99/yr, $99.99 lifetime | On-device screenshot scan; statement PDF/CSV; 256-service catalog; cancel guides; budgets | **"Data Used to Track You"**, though the description says "Anonymous analytics only" |
| **Subtracker AI** | Jul 5 | 88 (4.3) / 1 | $19.99 and $99.99 | Cancel guidance, "AI" in the name. 8 of its 9 reviews since Aug are 1★ | Used to track you |
| **Subveto** (was Gravity) | Apr 16; 4.0 on Nov 12 | 55 (4.67) / 0 | $7.99/week, $19.99/mo, $39 to $59.99/yr | "Ask Subveto AI" walks you through cancelling | Used to track you |
| **Submo** | Sep 11 | 9 / 3 | $9.99/week; **"Cancellation Notice Letter" $19.99** | Writes a cancellation letter | Used to track you |
| **Suberry** | Jul 9 | 7 / 0 | $3.99/week to $39.99 | Import from bank statements, transactions and emailed invoices | Used to track you |
| **Cancely** | Jun 23 | 12 / 0 | $4.99 to $89.99/yr | Premium plans | Not linked |
| Subpilot (trending since Sep 2025) | 1.26.2, Nov 10 | 6,554 (4.58) / 36 | $9.99 to $99.99; **"Free Trial Detector" $39.99 to $69.99**; per-cancel fees | Bank and email scan; budgeting (Nov 9); bill negotiation; 40% of refunds | Used to track you |

**Read:**
- The new wave splits in two:
  - (a) cancel-for-you apps with weekly plans, tracking labels and 1★ storms;
  - (b) calm on-device indies with one-time prices.
- Ditch belongs in (b), and Outflow and Recur are the best of it.
- No one in (b) has Ditch's verified local prices for 29 countries, a reminder-first free tier, or 59 cancel guides with sources. That remains our edge.

### 1.3 Who shipped what since May 15, 2026 (features Ditch doesn't have or plan)

| Feature | Who shipped it (date) | Count |
|---|---|---|
| Siri / Shortcuts / Spotlight via App Intents | Orbit (Oct 7), Subo (Oct 20), Chronicle (Sep 25), Outflow, Recur | 5 |
| "Ready for iPhone Duo" | Orbit, Subo, Chronicle, Touchbits, Outflow, SubTracker (Oct to Nov) | 6 |
| Year ahead / next 12 months / forecast | Outflow (Aug 6), Touchbits (May 19), Chronicle, Spendlight | 4 |
| Extra heads-up before big yearly or large charges | Outflow (Jul 2), Subo (Sep 2), Recur (Aug 20) | 3 |
| Mark paid / skip / mute this time | Outflow (Jul 3, Nov 9), Subtrack (Jul 17), DueEve, Chronicle | 4 |
| Overlap or duplicate check | Outflow (Jun 28), Spendlight (Nov 11), Subpilot ("merge duplicates", Aug 4) | 3 |
| Card / payment-method field with a filter | Outflow (Aug 1), Subio (Jul 3), Subo, Orbit | 4 |
| Household sharing or Family Sharing for Pro | Outflow (Aug 12, Aug 26), Subtrack (Family IAP), SubTracker, Chronicle | 4 |
| Free Apple-subscriptions screenshot import | SubTracker (Sep 24, made free), DueEve (core), Spendlight, Orbit | 4 |
| Add to Calendar without calendar permission | Outflow (Nov 9) | 1 |
| Cancellation notice periods / letters (European contracts) | Touchbits, Submo | 2 |
| Prepaid / fixed-term / one-time payments | Orbit (Jul 17), Subo, Recur | 3 |

## 2. What users ask for now (Aug 1 to Nov 15, 2026)

**Method:**
- App Store RSS, `sortby=mostrecent`, pages 1 to 5, US and GB, for 23 apps. 2,335 reviews pulled; **663** are dated Aug 1 to Nov 15, 2026.
- Big apps fill 5 pages fast: Rocket Money's 250 cover only Oct 9 to Nov 13, and Subpilot has 253. So they dominate the counts.
- Indie rivals have very few recent reviews: Outflow 3, Recur 1, Orbit 7, Chronicle 18, Bobby 3, Subo 4.
- Tags are keyword matches. Every small theme (under 10) was read by hand; the big ones were spot-checked. Treat the counts as "about".
- **Caution:** all 13 DueEve reviews are 5★, very alike in style, and several describe Google Play screenshots on an iPhone app. They read as solicited, so we use them only as a sign of what the developer markets, not as demand.

### 2.1 Theme counts

| Theme | Reviews | 1–2★ | Where | New vs Nov 10/11? |
|---|---|---|---|---|
| Charged by the tracker itself / can't cancel it | 71 | 53 | Rocket Money 31, Subpilot 23, MonoBoost 8 | Known |
| Didn't find my subs, or "found" wrong ones (rent, mortgage) | 45 | 41 | Rocket Money 21, Subpilot 9 | Known |
| "Cancels for you" didn't | 32 | 24 | Rocket Money 17, Subpilot 7 | Known |
| "A subscription to cancel subscriptions" / too expensive | 28 | 22 | Rocket Money 14, Subpilot 6 | Known |
| Bank link broke / bank not supported | 21 | 16 | Rocket Money 18 | Known |
| Hated TV and social ads | 9 | 7 | Rocket Money 8 | Known |
| Support silent / bots only | 9 | 9 | Rocket Money 7 | Known |
| **Feature removed in an update** (payday view ×4, projected savings, charts, upcoming bills) | 7 | 5 | Rocket Money | **New** |
| Own trial charged with no warning | 6 | 6 | Subpilot 3, Rocket Money 3 | Known (Ditch #15 covers ours) |
| Pay-once praise | 6 | 0 | Outflow 3, Recur, Bobby, Orbit | Known |
| **Duplicate charges found (as a win) or asked for** | 5 | 1 | Subpilot 3, Outflow, Feenko | **New** |
| **Payday view / "what's due before payday"** | 5 | 3 | Rocket Money 4, Chronicle | **New** |
| Support praised (named dev) | 5 | 0 | Chronicle 2, Recur | Known |
| **Which card / which email / notes for that** | 4 + 4 | 2 | Subpilot, Subtracker AI, Rocket Money, Chronicle, Orbit | Partly (Ditch has a note field) |
| **AI: afraid of it / dismiss it** | 3 | 3 | Rocket Money | **New** |
| AI: want it / like it | 3 | 0 | Orbit, Hiatus, Rocket Money | **New** |
| **iPhone Duo layout** | 3 | 1 | Rocket Money | **New** |
| Partner or other devices (iPad overwrite, Android partner) | 3 | 1 | Chronicle | Known |
| **Cancelling for someone who died** | 2 | 1 | Subpilot, Rocket Money | **New** |
| Odd cycles (every 180 days, twice a month on set days) | 2 | 0 | Bobby, Rocket Money | Partly fixed (Ditch has every 2 weeks and every 6 months) |
| Free tier capped at 3 subs | 1 | 1 | Subtle | Backs our "track everything free" choice |
| Reminders didn't fire | ~0 | 0 | — | Quiet this quarter. Still the product |

### 2.2 Short quotes (verbatim, under 20 words)

**Duplicates and overlap**
- "Found a double Netflix … Paid for itself." (Outflow, 5★, UK, Oct)
- "I had no idea I had so many duplicated subscriptions." (Subpilot, 5★, Oct)

**Which card, which email**
- "Please allow how at least two emails per subscription" (Subtracker AI, 5★, Nov)
- "Since i use 2 emails and multiple cards its hard to be accurate" (Subpilot, 4★, Oct)
- "Sometimes difficult to remember which credit card is used to make the original purchase" (Subpilot, 5★, Oct)

**Payday**
- "Payday view was the main reason I have this app. Will unsubscribe." (Rocket Money, 1★, Nov)
- "I make sure that I check Chronicle at every payday" (Chronicle, 5★, Sep)

**Someone who died**
- "They can't cancel the subscription for my husband, who died several months ago" (Rocket Money, 1★, Nov)
- "It has been so hard to cancel my Dad's Netflix account." (Subpilot, 3★, Nov)

**AI**
- "now that they've added an AI assistant, I'm terrified that it'll do something rogue" (Rocket Money, 1★, Oct)
- "AI Slop that is barely functioning" (Rocket Money, 1★, Oct, title)
- "adding like a bot to help manage things can make it better" (Orbit, 4★, Oct)

**iPhone Duo**
- "we need optimization for the iPhone Duo pronto!" (Rocket Money, 3★, Nov)

**Detection and bank link**
- "it only found 3 outta like 10" (Rocket Money, 2★, Oct)
- "All of a sudden my bank locked my account" (Rocket Money, 2★, Nov)

**Price and model**
- "makes u subscribe for 11$ a month" (Rocket Money, 1★, Oct)
- "charged an additional $49.99 for a reminder service" (Subpilot, 1★, Nov)
- "you can only add 3 subscriptions to the tracker before it's begging for you to pay" (Subtle, 1★, UK, Sep)
- "I am especially thankful for the incredible one time purchase price." (Recur, 5★, UK, Aug)

**Sync and devices**
- "sometimes it takes old data and overwrites on iCloud" (Chronicle, 2★, Oct)
- "Pleaaase make chronicle for android" (Chronicle, 5★, Nov)

**Cycles**
- "Some subscriptions renew every 180 days" (Bobby, 5★, Aug)
- "I pay one bill twice monthly" (Rocket Money, 4★, Oct)

**What the calm apps' fans want**
- "Not looking for an app that cancels for me." (DueEve, 5★, Nov; see the caution above)

## 3. What Apple shipped that overlaps

| Date | What | Overlap with Ditch | Source |
|---|---|---|---|
| Jun 8–9, 2026 (WWDC) | iOS 27 announced. Siri AI: "personal context understanding extends to third-party apps when developers integrate with Spotlight", plus "systemwide app actions" | Rivals are adding App Intents so Siri can answer "what renews this week?". Siri AI isn't in the EU or China at launch | Apple Newsroom (Siri AI; EU delay) |
| Jun 9, 2026 | Wallet: split bills with Apple Cash (US), passes from physical cards, Apple Pay checkout redesign. **Nothing on subscriptions or App Store subscription management** | None | Apple Newsroom (services) |
| iOS 27 (public Sep 2026) | **Apple Card "Recurring"** in Wallet: a calendar or list of predicted recurring charges, with a "Variable" badge, "Mark as Not Recurring", and the warning "estimates, not confirmed charges". A cancelled sub may keep showing "until an expected charge doesn't appear" | Known on Nov 10. Apple Card only, US only | Apple Support 127699; 9to5Mac Jul 22 / Sep 25 |
| iOS 27 | **NEW: "Upcoming Transactions" notifications.** Apple Card "can predict when new recurring charges will go through" and "notify you ahead of time" | **Direct overlap with our core promise, for Apple Card holders only.** No custom timing, no other cards, no non-US, no cancel help, and it learns from history, so a new trial isn't covered | 9to5Mac, Sep 15, 2026 |
| iOS 27 | Wallet Insights for connected bank accounts: UK banks first, **not in the US release** (secondary source) | UK users may see recurring charges from their bank in Wallet. Watch this before the UK launch | getfinny.app (Sep 10), not checked against Apple |
| iOS 27 | No change found to Settings → Subscriptions (renewal dates; "Renewal Receipts" emails after a renewal). Apple still sends no reminder before an ordinary App Store renewal (secondary sources) | Our trial and renewal reminders still fill a gap Apple leaves | getfinny.app; Subgrove |
| Sep 9, 2026 | **iPhone Duo**, Apple's first foldable ($1,999, on sale Oct 23). A 7.6-inch inner screen and a smaller outer one | 6 rivals already advertise Duo layouts. Our Nov 11 audit already checked Duo folded and open | Apple Newsroom (SG); press |
| FinanceKit | Still Apple Card, Apple Cash, Savings and Orders in the US, plus UK open-banking accounts (iOS 18.4+). Needs a Finance-category app and an entitlement Apple must approve. **No official iOS 27 country expansion found.** Outflow 5.0 uses it "for iOS 27" | Our v2 FinanceKit idea is still US/UK only | Wikipedia (FinanceKit), MacStories; Outflow notes |
| Expo (next SDK, alpha) | **`expo-ai`**: on-device text and structured output through Apple's Foundation Models (iOS 26+, Apple Intelligence on), Gemini Nano on Android. "Currently in alpha"; needs a dev build and Xcode 26.4+ | A no-server way to read messy screenshots and statements in M3 import, with nothing leaving the phone | docs.expo.dev/versions/unversioned/sdk/ai |

## 4. Ideas, ranked (user demand × fit with "no server, list stays on the phone")

Score = demand (reviews plus how many rivals shipped it) × fit. Effort: XS under a day, S days, M 1–2 weeks. All need the owner's OK; nothing here reopens a locked decision.

| # | Idea | Evidence | Fit (no server) | Effort | Tier |
|---|---|---|---|---|---|
| 1 | **Duplicate and overlap check.** On Home: "You pay for Netflix twice" (same service twice) and "3 music services: $34 a month". Uses our catalog categories; all on the phone | 5 reviews, 3 rivals | 10 | S | Free (it's a "win" moment and a ditch trigger) |
| 2 | **"Paid with" (card or account) and "Account email" fields**, a filter by card, and both shown on the cancel screen ("Signed up with jo@…, Visa ••42") | 4 + 4 reviews, 4 rivals | 10 | S (migration) | Free (it protects cancels) |
| 3 | **Year ahead + a bigger heads-up before big yearly charges.** A 12-month strip showing the expensive month, and a default extra reminder 7 days before any yearly charge | 6 rivals; Chronicle forecast; the ask behind the payday reviews | 10 | S–M | Strip free; the extra yearly reminder free for yearly subs (counts toward 3?) or Pro (owner call) |
| 4 | **"Before payday" view.** Set your payday (a date only, no income amount). Home shows "Due before Nov 28 payday: $63" | 5 reviews (Rocket Money 1★ when removed), Chronicle shipped it | 9 (stores one date) | S | Free |
| 5 | **Free Apple-subscriptions screenshot import** at onboarding (on-device OCR, optionally `expo-ai`), with Pro keeping statements and bulk import | 4 rivals; SubTracker moved it to free; 45 "didn't find my subs" reviews show the pain | 9 | M (dev build, M3) | Owner call: free for Apple screenshots only? |
| 6 | **Mark as paid / skip this one / mute this time** on a reminder or row ("Netflix: skip November"), so reminders never nag for something handled | 4 rivals; past "reminders for things I handled" hates | 10 | S | Free |
| 7 | **iPhone Duo + iPad layouts, and say so in the store text and What's New** | 3 reviews, 6 rivals; our audit already covers Duo | 10 | XS–S | Free |
| 8 | **Siri / Shortcuts / Spotlight (App Intents):** "What renews this week?", "Add a subscription". No Siri AI in the EU | 5 rivals in 6 weeks; 0 reviews | 9 | M (native module) | Free |
| 9 | **Cancel guide: "When someone has died"** (Apple, Google, Netflix and Spotify bereavement steps, what to have ready), on the website and linked from the cancel screen | 2 reviews, high emotion; no rival covers it | 10 | XS (content) | Free; SEO |
| 10 | **"Every card, not just Apple Card" answer to iOS 27 alerts.** One store screenshot line plus a compare page: Apple Card alerts vs Ditch (any card, trials, your timing, cancel links) | Apple shipped it in iOS 27; 0 reviews yet | 10 | XS | Marketing |

**Also worth knowing:**
- **AI stays on the phone.** If Ditch ever adds AI, use on-device `expo-ai` for import only. Never an assistant that acts on money: 3 fear reviews, and rule 5 bans "we cancel for you". Spendlight's bring-your-own-key model keeps our label clean but adds setup friction (4/10).
- **Notice periods** (Touchbits, Submo letters): useful for German and Italian contracts (gyms, phones). Revisit with the translated app (v1.1).
- **Never remove a feature people use.** Rocket Money lost 1★s for removing Payday View (4) and others (3). Add a line to the release checklist.
- **The privacy label.** 7 calm rivals say "Data Not Collected"; we'll say "Purchases, not linked". This is a fact for the owner, not a proposal. Recur and Outflow sell one-time IAPs; whether they use StoreKit directly isn't stated. Owner call only if they want to revisit DECISIONS on RevenueCat.
- **Household:** Outflow's Shareflows and Family Sharing make "Family Sharing for Pro" (still pending from Nov 10) a real comparison point. Chronicle reviews (3) love couple sync and hate sync bugs.

## Sources
**App Store data (pulled Nov 15, 2026):**
- Search: `https://itunes.apple.com/search?term={term}&entity=software&country={us|gb}&limit=50`. Terms: subscription tracker, subscription manager, bill reminder, cancel subscriptions, subscription reminder, recurring payments, trial reminder, subscriptions.
- Lookup: `https://itunes.apple.com/lookup?id={ids}&country={us|gb}`.
- Pages (IAPs, privacy label, version history): `https://apps.apple.com/us/app/id{ID}`.

**IDs:**

| App | ID |
|---|---|
| Outflow | [6779691937](https://apps.apple.com/us/app/id6779691937) |
| Recur | [1584753654](https://apps.apple.com/us/app/id1584753654) |
| Orbit | [6692620188](https://apps.apple.com/us/app/id6692620188) |
| Chronicle | [572561420](https://apps.apple.com/us/app/id572561420) |
| Bobby | [1059152023](https://apps.apple.com/us/app/id1059152023) |
| Rocket Money | [1130616675](https://apps.apple.com/us/app/id1130616675) |
| Subtrack | [1519946553](https://apps.apple.com/us/app/id1519946553) |
| Subo | [6741823650](https://apps.apple.com/us/app/id6741823650) |
| Subscriptions (Touchbits) | [1551697409](https://apps.apple.com/us/app/id1551697409) |
| Track My Subs | [6749513883](https://apps.apple.com/us/app/id6749513883) |
| Copilot | [1447330651](https://apps.apple.com/us/app/id1447330651) |
| Monarch | [1459319842](https://apps.apple.com/us/app/id1459319842) |
| Spendlight | [6821620364](https://apps.apple.com/us/app/id6821620364) |
| DueEve | [6806725994](https://apps.apple.com/us/app/id6806725994) |
| SubTracker | [6759149326](https://apps.apple.com/us/app/id6759149326) |
| Subtle | [6781251166](https://apps.apple.com/us/app/id6781251166) |
| Subtracker AI | [6783674801](https://apps.apple.com/us/app/id6783674801) |
| Subveto | [6762061120](https://apps.apple.com/us/app/id6762061120) |
| Submo | [6796041389](https://apps.apple.com/us/app/id6796041389) |
| Suberry | [6786779615](https://apps.apple.com/us/app/id6786779615) |
| Cancely | [6778323362](https://apps.apple.com/us/app/id6778323362) |
| Subpilot | [6751181747](https://apps.apple.com/us/app/id6751181747) |
| Subio | [6758654066](https://apps.apple.com/us/app/id6758654066) |
| Sublimit | [6766039404](https://apps.apple.com/us/app/id6766039404) |
| Subscription Tracker (Furness) | [6746950605](https://apps.apple.com/us/app/id6746950605) |

**Reviews:** `https://itunes.apple.com/{us|gb}/rss/customerreviews/page={1–5}/id={ID}/sortby=mostrecent/json` for the apps above, plus Kango 1259029889, Feenko 6747262759, MonoBoost 6740202306, Hiatus 977040079, ReSubs 6740457603, Subpli 6752722752, Cancel Subscriptions & Refund 6479920412, SubFind 6761034583.

**TrackMySubs:** [trackmysubs.com](https://trackmysubs.com/).

**Apple:**
- [Siri AI (Newsroom, Jun 2026)](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/)
- [Services and Wallet (Newsroom, Jun 2026)](https://www.apple.com/newsroom/2026/06/apple-unveils-innovative-features-and-intelligence-experiences-across-services/)
- [Siri AI delayed in EU (Newsroom)](https://www.apple.com/newsroom/2026/06/due-to-dma-siri-ai-delayed-in-eu-for-ios-27-and-ipados-27/)
- [See your Apple Card recurring transactions (Apple Support 127699)](https://support.apple.com/en-us/127699)
- [Apple Card has three new features in iOS 27 (9to5Mac, Sep 15)](https://9to5mac.com/2026/09/15/apple-card-has-three-new-and-improved-features-in-ios-27/)
- [Apple Card recurring (9to5Mac)](https://9to5mac.com/2026/07/22/apple-card-adds-new-feature-in-ios-27-that-every-card-should-have/)
- [How to see recurring Apple Card charges (The Apple Post, Sep 16)](https://www.theapplepost.com/2026/09/16/71418/how-to-see-recurring-apple-card-charges-in-ios-27/)
- [Track subscriptions in iOS 27 (getfinny, Sep 10)](https://getfinny.app/blog/track-subscriptions-iphone-ios-27)
- [Subgrove on renewal reminders](https://subgrove.com/blog/renewal-reminders-on-iphone)
- [iPhone Duo (Apple Newsroom SG)](https://www.apple.com/sg/newsroom/2026/09/apple-unveils-iphone-duo/)
- [iPhone Duo price and dates (The National)](https://www.thenationalnews.com/future/technology/2026/09/09/iphone-duo-price-apple-event/)
- [FinanceKit (Wikipedia, Apple Wallet)](https://en.wikipedia.org/wiki/Apple_Wallet)
- [FinanceKit (MacStories)](https://www.macstories.net/linked/financekit-opens-real-time-apple-card-apple-cash-and-apple-savings-transaction-data-to-third-party-apps/)
- [Outflow site](https://outflowapp.org/)

**Expo:** [expo-ai (next SDK, alpha)](https://docs.expo.dev/versions/unversioned/sdk/ai). [Apple forums: no official React Native binding for Foundation Models](https://developer.apple.com/forums/thread/833676).

**Raw data (not committed):** the session scratchpad `f1115/` (`reviews.json`, `parsed.json`, `lk_us.json`, `allapps.tsv`).
