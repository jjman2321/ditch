# Moats and Pro features (and: should Pro get email reminders?)

Written Nov 10, 2026. The owner asked: "Maybe add email notifications for paid? Good moat? Research features and moats we can have for paid, and the app in general." This builds on DECISIONS #11, #16–#25, `freemium-v2.md`, `autosync.md`, `pricing-competitors-2026.md` and `niche-teardown.md`, and doesn't repeat them. **AppKittie revenue and download numbers are estimates.** Nothing here changes a locked decision; the picks need the owner's OK.

## Summary (15 lines)
1. **Email reminders: no, not now (3.5/10), and they're not a moat.** Out of 4,211 App Store reviews of 12 trackers and finance apps, **0 ask for email reminders**. Out of 48 tracker, bill and finance apps' store pages, **0 list them**.
2. Email needs a server holding every Pro user's list (names, prices, dates), an account, an email address, a sender domain, unsubscribe and GDPR handling. Our label would gain **Contact Info and probably Financial Info, linked to you**, and "Your list stays on your phone" would stop being true.
3. The money cost is small (Resend free up to 3,000 emails a month, then $20). The real cost is complexity, trust and our privacy story. Any rival with a server can copy it in a week, so it defends nothing.
4. **Pick instead: a no-server "reminder backup" bundle (8.5/10).** Time-sensitive reminders that get through Focus and the notification summary, a second nudge if you miss the first, a "proof it fired" log, Calendar sync (alerts on Mac, iPad and Watch), and a Lock Screen widget.
5. Reliability is still the gap rivals leave: "notifications don't work" is in **4.9% of Bobby's reviews**, and 19 of the 36 tracker reviews about it are 1–2★.
6. **What tracker users talk about most is using it on more than one device:** 15% of tracker reviews mention iCloud, iPad, Mac or sync, and **3.6% complain that sync broke** (19 are 1–2★). Sync done badly loses more than it wins, so it's v2.
7. Data loss shows up in 2.1% of tracker reviews (17 of them 1–2★). Free CSV export and a v1.1 iCloud backup cover it.
8. **v1 Pro must-haves:** reminders on every sub, up to 3 reminders each with your own timing, the second nudge, and import after onboarding. Nothing else goes on the paywall until it works (DECISIONS #24).
9. **v1.1:** Price watch alerts, Home and Lock Screen widgets, Calendar sync, iCloud backup, trial screenshots and attachments, an opt-in converted total, and "Still watching?" buttons on reminders.
10. **Also v1.1, free:** Subscription Wrapped (a shareable card, organic growth), Face ID lock, app translated into Italian, German, French and Spanish.
11. **v2:** iCloud sync across devices, FinanceKit, a yearly-vs-monthly advisor and plan finder, Siri/Shortcuts, sharing with a partner. **Skip:** budgets, cost per use, Live Activities, critical alerts, a "who owes what" ledger.
12. **Real moats for a solo indie, in order:** (1) reliability plus ratings, (2) the verified per-country price dataset and its growing price history, (3) localisation, (4) SEO built on that data. Brand helps people remember us but doesn't defend.
13. **Weak or fake moats:** integrations (Recur and Outflow already have widgets, Watch and Shortcuts), family network effects (households of 2), switching cost (a list is 5 minutes to retype, and we keep export free on purpose).
14. **Platform risk:** iOS 27 Wallet now lists **Apple Card** recurring charges (US). Apple will keep moving in. We win on what Apple doesn't do: reminders before every charge, on every card, in 12 countries, with help cancelling.
15. **Only you can do this:** approve the v1 Pro list and "no email"; decide whether Pro allows Apple Family Sharing (it can't be turned off once on); and later test Calendar sync with a Google calendar on your iPhone.

---

## How I researched
- **Reviews:** App Store RSS, newest first, 10 pages each for the US and UK, pulled Nov 10, 2026. **4,211 reviews**: Bobby 536, Rocket Money 500, Orbit 42, Subpilot 508, MonoBoost 189, Chronicle 531, Copilot 500, Monarch 500, Emma 606, Subo 33, Subtrack 105, Subscription Manager (Kango) 161. I tagged them with keyword lists and read the hits. "Trackers" below means Bobby, Chronicle, Orbit, Subo, Subtrack and Kango (1,408 reviews). Written reviews skew negative, so compare themes rather than reading them as ratings.
- **Store pages:** iTunes Lookup for 48 trackers, bill apps and finance apps, scanned for features. **AppKittie:** searches for "subscription tracker email reminders" and "bill reminder email" (estimates).
- **Mobbin** for split-cost and price-alert patterns, plus web sources for costs, Apple rules and Expo support (linked in Sources).

## 1. Email reminders for Pro: worth it?

### 1.1 The honest case for email
- **It's a second channel.** If someone turns notifications off, deletes the app or changes phones, an email still arrives. For a money-anxious user, "you'll hear from us twice" sounds comforting.
- **It works where the phone doesn't:** at a work laptop, or for someone who clears notifications without reading them.
- **But the evidence is thin:**
  - 0 of 4,211 reviews ask for email reminders.
  - People who get email from money apps often hate it: "STOP SENDING ME EMAILS" (Rocket Money, 1★, Sep 2026). "my email is nonstop getting spam" (Rocket Money, 1★, Sep 2026). "sent 2 emails in an hour" (Emma, 2★, UK, Mar 2026).
  - Email isn't reliable either: "Sometimes my email bill notices go into my junk folder. So I like using [Chronicle]" (Chronicle, 5★).
- **What actually breaks reminders:** permission turned off, Focus, the scheduled summary hiding them, the app never rescheduling, or bugs. We fix the last two in code (DECISIONS rule 3), and the bundle in 1.5 handles the others without a server.

### 1.2 What email would need
| Piece | What it means | Cost | Effort for us |
|---|---|---|---|
| A server | Something has to wake at 9:00 in each user's time zone and send, so it must **store each Pro user's list and dates**, and the phone must keep it in sync after every edit | Cloudflare Workers or Supabase: $0–25/mo | **High.** Our first server: logins, database, scheduling, time zones, backups, security |
| Email provider | [Resend](https://automationatlas.io/answers/resend-pricing-explained-2026/): free for 3,000 a month (max 100 a day), $20 for 50,000. [Postmark](https://postmarkapp.com/support/article/1107-how-does-monthly-pricing-work): $15 for 10,000. Amazon SES is about $0.10 per 1,000 | 1,000 Pro users × ~8 subs × 2 reminders ≈ 16,000 emails a month ≈ **$20/mo** | Low |
| Sender domain | SPF, DKIM and DMARC records on ditchsubs.app. Gmail enforces stricter rules above 5,000 emails a day, including one-click unsubscribe for marketing mail ([Red Sift](https://redsift.com/guides/bulk-email-sender-requirements)) | $0 | Medium (DNS, warm-up, watching spam complaints) |
| Email sign-up | Enter and confirm an email (a magic link). If accounts exist, **account deletion has to be in the app** (App Review 5.1.1(v)), and we can't force a login for the rest of the app ([Apple forums](https://developer.apple.com/forums/thread/724336)) | $0 | Medium |
| Consent and law | **CAN-SPAM:** reminders count as "transactional", but one "Try Pro" line can make an email commercial, and then opt-out rules apply ([FTC primary-purpose rule via Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/ftc-assesses-primary-purpose-of-emails-in-can-spam-enforcement)). **GDPR/UK GDPR** (8 of our 12 countries): lawful basis, a privacy policy, a processor agreement, US data transfers, deletion on request | $0–500 for a lawyer check | Medium, and it never ends |
| Privacy label | **Contact Info → Email Address, linked to you.** Storing the list on our server probably adds **Financial Info → Other Financial Info, linked to you** ([how vendors fill in Contact Info](https://help.socio.events/en/articles/4724867-apple-app-privacy-questionnaire); re-check Apple's own definitions before any submission) | — | Label goes from 1 item to 3 |
| Copy | "Your list stays on your phone" (CLAUDE.md rule 5) becomes false for email users | — | Breaks our main trust line |
| Breach risk | We'd hold a list of what thousands of people pay for, tied to their email | — | New risk for a solo founder |

### 1.3 Who does email reminders
- **Rocket Money:** email and push toggles for Alerts, Updates and Tips ([help](https://help.rocketmoney.com/en/articles/934668-updating-your-notification-settings)). It has a server and accounts anyway because of the bank link.
- **TrackMySubs** (a website): email reminders at times you pick ([TrustRadius](https://www.trustradius.com/products/trackmysubs/reviews)).
- **iOS manual trackers:** none of the 48 I scanned (Bobby, Orbit, Subo, Subtrack, Chronicle, Recur, Outflow, SubGuard, Track My Subs, Billsy, 99subs, iBill and more) mention email reminders in their store text. AppKittie's "bill reminder email" search turned up no indie tracker selling it.
- **Read:** apps that already run a server add email almost for free. For us it would be the first and only reason to build one.

### 1.4 Is email a moat?
**No (2/10).** A moat is something rivals can't copy quickly. Email reminders are a standard pattern any developer with a server can build. Worse, building it would give up our real edge: no account and nothing about your list on our servers. Revisit only if v3 bank sync adds a server and accounts anyway, and then only as an opt-in weekly email digest.

### 1.5 No-server backups, scored
Scores out of 10: **Backup value** (it catches a missed reminder) · **Effort** (10 = easy) · **Privacy** (10 = label unchanged) · **Conversion** (it's a reason to pay, or it helps retention and ratings).

| # | Option | What it does | Backup value | Effort | Privacy | Conversion | **Overall** | When / tier |
|---|---|---|---|---|---|---|---|---|
| A | **Email reminders** | Server sends an email too | 6 | 2 | 2 | 4 | **3.5** | Skip |
| B | **Time-sensitive reminders** | Marks the "1 day before" and trial-end reminders as time-sensitive, so they get through Focus and the scheduled summary (the user can still turn this off) ([WWDC21 notes](https://www.wwdcnotes.com/notes/wwdc21/10091)). `expo-notifications` supports the level; the entitlement needs our dev build | 8 | 8 | 10 | 7 | **8.5** | v1, everyone (reliability shouldn't be paywalled) |
| C | **"Proof it fired" + health check** | Settings and Home show "Last reminder: Netflix, Fri 9:00 ✓" from notifications still in Notification Center (`getPresentedNotificationsAsync`), plus warnings for "notifications off" and "delivered in summary" | 7 | 8 | 10 | 8 (trust and ratings) | **8.5** | v1, everyone |
| D | **Second nudge if you miss it** | If the 1-day reminder isn't tapped and the app isn't opened, one more at 7 pm: "Netflix charges tomorrow. $17.99. Last call." Cancelled as soon as you open the app. Stays inside the 64-notification cap | 8 | 8 | 10 | 8 | **8.5** | v1, **Pro** (always on for the Ditch Pro trial and for trial-end reminders) |
| E | **Calendar sync** (EventKit via `expo-calendar`, dev build) | A "Ditch" calendar with an event on each charge day and alerts. It shows on Mac, iPad and Watch, and in Google Calendar if you pick it. Keeping events up to date needs **full** calendar access; write-only access can add events but can't update or remove them ([Expo docs](https://docs.expo.dev/versions/v58.0.0/sdk/calendar/)) | 8 | 6 | 9 (stays in the user's calendar) | 7 | **7.5** | v1.1, Pro |
| F | One-off .ics file export | Share a calendar file once. No permission needed, but it goes stale the moment you edit a sub | 4 | 8 | 10 | 3 | 5 | Fallback inside E |
| G | **Lock Screen and Home widget** | "Next: Netflix, tomorrow, $17.99". You see it without any notification permission. `expo-widgets` went stable in SDK 56 and needs a dev build ([Expo](https://expo.dev/blog/home-screen-widgets-and-live-activities-in-expo)) | 6 | 6 | 10 | 7 | **7** | v1.1, Pro (already decided) |
| H | Apple Reminders | Puts each charge in the Reminders app, where it stays until ticked off. Needs **full access to all reminders** (there's no write-only option) | 7 | 6 | 7 | 4 | 6 | v2, maybe |
| I | Apple Watch | iPhone notifications already show on the Watch for free when the phone is locked. A Watch app is Swift-only and a lot of work | 3 (app) | 2 | 10 | 3 | 4 | Say "works on your Watch" now; no app |
| J | Live Activity "Netflix charges today" | Can only start while the app is open, or from a server push (iOS 17.2+), and lasts at most 8 hours ([Apple](https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities)). It can't start by itself at 9:00 | 2 | 4 | 10 | 3 | **3** | Skip |
| K | AlarmKit loud alarm (iOS 26) | A real alarm that rings through silent mode and Focus ([MacRumors](https://www.macrumors.com/2025/06/11/ios-26-third-party-alarm-apps/)). Too loud for bills; maybe an opt-in for big trial endings | 7 | 4 | 10 | 4 | 5 | v2 experiment |
| L | Critical alerts | Apple only grants these to health and safety apps | — | 0 | — | — | 1 | Never |
| M | App icon badge | A small number for charges in the next 3 days. A Chronicle user asked for this | 4 | 9 | 10 | 5 | 6.5 | v1.1, everyone |

**Pick: B + C + D in v1, E + G in v1.1.** This gives the "you'll hear from us twice" comfort that email promises, on every device the user owns, with no server and no label change. It serves the target user (control and reliability) and conversion (D is a clear Pro reason; B and C protect the rating that our ASO plan depends on).

**Email's one honest trick, to test:** Google Calendar can send its own email alerts for a calendar. If a user picks a Google calendar in option E, Ditch can say "Want email too? Turn on email alerts for this calendar in Google Calendar." Google sends the email, not us. **Unverified:** it's unclear whether events created from the iPhone use those defaults. Test on the owner's iPhone before we write it anywhere.

| Paywall line for D | Score |
|---|---|
| **"A second nudge if you miss the first."** | **8.5 (pick)** |
| "Reminders that don't give up." | 7 (fun, a bit vague) |
| "Never miss a renewal." | 4 (a promise we can't fully keep: the user can still turn things off) |

## 2. Pro features that drive conversion and retention

### 2.1 What reviews say people want
| Theme | Trackers (1,408 reviews) | Finance apps (2,106) | What it tells us |
|---|---|---|---|
| iPad, Mac, iCloud, sync | **15.2%** | 4.2% | The most-mentioned thing. Chronicle charges for it |
| Sync broke | **3.6%** (19 are 1–2★) | 1.1% | Sync done badly makes 1★ reviews: "One is always outdated" (Chronicle, 3★, Feb 2026) |
| Calendar | 4.0% | 0.3% | Mostly praise for a calendar view and calendar tie-in |
| Widgets | 2.8% | 0.7% | Requests: "there are no widgets! Needs widgets" (Bobby, 3★) |
| Reminders not firing | 2.6% (Bobby 4.9%) | 0 | Still the deepest complaint |
| Data lost | 2.1% (17 are 1–2★) | 0.3% | "the data I spent a long time entering just disappeared" (Bobby, 1★) |
| Currency | 1.9% | 0.1% | Covered by DECISIONS #17 |
| Face ID / passcode | 1.6% | 0 | Mostly Kango's lock being broken: if we build it, build it well |
| Partner / household | 1.4% | 3.3% | "me and my husband can sync to the same calendar" (Chronicle, 4★, Aug 2026) |
| Trial charges | 0.4% | **2.8%, of which 84% are 1–2★** | Finance apps' *own* trials anger people: "Took money for a full year pro… no warning" (Emma, 1★, Oct 2026). Our trial goes on the user's own list with reminders (DECISIONS #15) |
| Watch | 0.9% | 0.2% | "Patiently waiting for an apple watch version!" (Chronicle) |
| Custom or multiple reminders | 0.4% | 0 | Small but clear: "add multiple reminders so we can set one early, then right before due" (Chronicle, 5★) |
| Export | 0.9% | 0.5% | Kept free (DECISIONS #24) |
| Email reminders | **0** | **0** | — |

**What indie rivals now sell** (store text): Recur, a one-time purchase, has widgets on the Home and Lock Screen and in Control Center, a Watch app, Shortcuts, Year in Review, price-hike history and iCloud sync. Outflow has a Watch app with Pro, **household sharing over iCloud with cost splitting**, FinanceKit, Mac and iPad. "Subscriptions" (Touchbits) has a calendar tie-in, Watch, documents and cancellation deadlines. **These are now the normal checklist for the category, not things that set an app apart.**

### 2.2 The feature list
Value and Conversion are out of 10. Effort: S = days, M = 1–2 weeks, L = a month or more. "Dev build" means it doesn't work in Expo Go; our EAS dev build arrives in M2.

| Feature | Value | Conv. / retention | Effort | Dev build? | Privacy | Tier | When | **Score** |
|---|---|---|---|---|---|---|---|---|
| Reminders on every sub | 10 | 10 | done | no | none | Pro | v1 | **10** |
| Your own timing, up to 3 reminders each (a week, 3 days, 1 day, the day of, any time) | 8 | 8 | S | no | none | Pro | v1 | **9** |
| Second nudge if you miss it (1.5 D) | 8 | 8 | S | no | none | Pro | v1 | **8.5** |
| Time-sensitive reminders + "proof it fired" (1.5 B, C) | 9 | 8 | S | B: yes | none | Free | v1 | **8.5** |
| "Renewed without a reminder" Home card | 7 | 9 | S | no | none | Free (upgrade moment) | v1 | **8.5** |
| Import after onboarding (screenshot, statement) | 8 | 8 | L | yes | none | Pro | v1 (M3) | **8** |
| Trial tracker: end date, "2 days before" reminder, a photo of the Apple confirmation sheet (which shows "then $71.99 starting Dec 1", [Quicken on Mobbin](https://mobbin.com/screens/b92100b0-a835-4afe-944d-ee1469c494cb?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) | 9 | 8 | S (photo: M) | no | none (photo stays on the phone) | Free (counts toward 3); photo Pro | v1; photo v1.1 | **8.5** |
| Cancel guides + "open the cancel page" links, top 50 services | 9 | 7 | M (data work) | no | none | Free | v1 (4 services) → v1.1 (50) | **8.5** |
| **Price watch** alerts ("Netflix says Standard goes to $19.99") | 8 | 9 | M | no | none (public file) | Pro | v1.1 | **8.5** |
| "Still watching?" buttons on reminders (Keep / Ditch it) | 7 | 8 (more ditches, more ratings) | S | no | none | Free | v1.1 | **8** |
| Notes field (account email, plan, cancel deadline). Orbit praise: "tracks… my email address associated with this account" | 7 | 6 | S | no | none | Free | v1 | **7.5** |
| Home + Lock Screen widget | 7 | 7 | M | yes | none | Pro | v1.1 | **7.5** |
| Calendar sync (1.5 E) | 7 | 7 | M | yes | none | Pro | v1.1 | **7.5** |
| iCloud **backup** (one file, restore on a new phone) | 8 | 6 | M | yes | none (user's own iCloud) | Pro (decided #11) | v1.1 | **7.5** |
| Subscription Wrapped (a yearly card to share: "2026: 14 subs, $1,204, 3 ditched") | 6 | 8 (free sharing = organic installs) | M | no | none (an image the user chooses to share) | Free | v1.1, timed for December | **7.5** |
| App translated into IT, DE, FR, ES | 8 (outside the US) | 8 | M | no | none | Free | v1.1 | **8** |
| iPad layouts, which also run on Apple Silicon Macs as an iPad app | 6 | 5 | M (decided #21) | no | none | Free | v1 / v1.1 | **7** |
| Apple Family Sharing for Pro (one purchase covers the family) | 6 | 6 | S (an App Store Connect switch, **can't be turned off**) | no | none | Pro | owner decision | **6.5** |
| Opt-in converted total ("about $1,310 a year in US$, ECB rates Nov 10"), never replacing the per-currency totals | 6 | 5 | S–M | no | none if rates ship in the same public file | Pro | v1.1 | **6.5** |
| Attachments (receipts, PDFs) | 5 | 5 | M | no | none | Pro | v1.1 | **6** |
| Face ID lock | 5 | 4 | S (`expo-local-authentication`) | no | none | Free | v1.1 | **6** |
| App icon badge | 4 | 5 | S | no | none | Free | v1.1 | **6** |
| **iCloud sync** across iPhone, iPad and Mac (CloudKit records, merging edits) | 8 | 7 | **L** (young Expo libraries such as `expo-cloudkit` 0.9) | yes | none (user's own iCloud) | Pro | v2 | **6.5** (high value, high 1★ risk) |
| Yearly-vs-monthly advisor ("Yearly would cost you $X less") | 6 | 6 | M (needs verified yearly prices per country) | no | none | Pro | v2 | **6.5** |
| Plan finder ("2 Spotify Individuals cost more than Duo") | 5 | 5 | M | no | none | Pro | v2 | **5.5** |
| Share with a partner + "my share" split (Outflow does this over iCloud; [Monzo split](https://mobbin.com/screens/c018c2cd-c757-4e60-8fa4-5d0a51578c11?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) | 6 | 5 | L (CloudKit sharing) | yes | none | Pro | v2 (a simple "my share" field in v1.1) | **5.5** |
| Siri / Shortcuts / App Intents ("What renews this week?") | 4 | 3 | M (native module) | yes | none | Free | v2 | **5** |
| FinanceKit "new charge spotted" (`autosync.md` B4) | 7 | 7 | L | yes | none | Pro | v2 | **7** |
| Trends view (monthly totals over time; also needed to qualify for FinanceKit) | 5 | 5 | M | no | none | Free | v2 | **6** |
| PDF report | 3 | 3 | S | no | none | Pro | v2 | **4** |
| Apple Watch app | 3 | 3 | L (Swift) | yes | none | Pro | later | **4** |
| Live Activity "charges today" | 3 | 3 | M | yes | none | — | skip | **3** |
| Budgets and goals per category | 4 | 4 | L | no | none | — | skip (that's Copilot and Monarch's game) | **3** |
| Cost per use (you log every use) | 3 | 2 | M | no | none | — | skip (nagging, DECISIONS #13) | **2.5** |
| "Who owes what" ledger | 4 | 3 | L | no | needs accounts if real | — | skip (Splitwise does it) | **2.5** |
| Email reminders | 4 | 4 | L | no | **label grows** | — | skip (section 1) | **3.5** |

### 2.3 Notes on the tricky ones
- **Converted total:** CLAUDE.md says never add currencies together. So it's opt-in, labelled "about", shows the rate's date and source, sits *under* the real per-currency totals and never replaces them. Rates ride in the public `prices.json`, so the phone never calls a rates API.
- **Partner sharing:** households are small (2 people), so there's no real network effect. Outflow already does it. A "My share: ⅓" field gets most of the value in a day, and joint bills then count once.
- **Wrapped:** it's free on purpose. It's an image the user chooses to share, with a short link, so it helps organic growth without ads. The copy stays honest: "$X a year you won't pay", never "saved". It needs real data, so the first one makes sense in December 2027, with a "Your year so far" version possible from December 2026.
- **"Still watching?":** this is a usage check-in folded into reminders we already send, so it adds no notifications and doesn't nag. "Ditch it" opens the cancel flow.
- **Family Sharing for Pro:** Outflow offers it. It's warm and fair for couples, but it lowers revenue per household, and Apple doesn't let you switch it off later. Owner call; my lean is to wait until there's data (6.5/10).
- **Free vs Pro rule (DECISIONS #11, #24):** anything that protects reliability or the user's data is free (B, C, export, notes, Face ID). Pro is the app doing *more* watching for you: every sub, more reminders, Price watch, the widget, calendar, backup.

## 3. Moats: what makes Ditch hard to copy

### 3.1 How the leaders defend
- **Bobby** (4.75★, 8,033 US ratings, no update since Dec 9, 2025): its moat is **age and ratings**. Ten years of reviews keep it near the top of "subscription tracker" searches. It also has a cheap one-time price, a big logo catalog, and users in Italy and Spain. Its holes are reminders not firing (4.9% of its reviews), data loss, no iPad app, no widgets, and an absent developer ("Developers ignore requests for help", 1★, Jun 2025). It defends by inertia, and inertia fades without updates.
- **Rocket Money** (406k ratings, ~$1M a month, AppKittie est.): its moat is **bank data, money and brand.** Rocket Companies bought Truebill for $1.275B ([eMarketer](https://www.emarketer.com/content/rocket-will-acquire-pfm-app-truebill-1-275b-deal)). It has paid ads at scale, a bank link through Plaid, and people who cancel subscriptions for you (bill negotiation moved to the $15/mo Premium+ plan on Nov 2, 2026, [help](https://help.rocketmoney.com/en/articles/2217739-how-much-does-rocket-money-cost)). Its holes are trust (recent reviews average 2.2★), broken bank links, US only, and annoying emails. **We can't copy its moat. We attack its holes:** privacy, local prices, honesty.
- **Apple:** iOS 27 Wallet shows a "Recurring" view for **Apple Card only**, and wider Insights only in some countries, not the US ([9to5Mac](https://9to5mac.com/2026/09/14/heres-everything-new-for-apple-wallet-in-ios-27/)). Apple sees the charges but doesn't remind you before each one on every card, or help you cancel.

### 3.2 Scoring our possible moats
"Real?" = how hard it is for a solo rival to copy within a year (10 = very hard).

| Moat | Real? | Why | Invest |
|---|---|---|---|
| **Reliability reputation + ratings** | **8** | Ratings pile up and can't be bought. Apple shows them in search, and our growth is ASO (DECISIONS #18). "Proof it fired" makes reliability visible. Bobby shows ratings protect even an abandoned app | **#1, now** |
| **Verified per-country price dataset + weekly robot** | **7** | Only Orbit localises prices, and nobody shows sources or "checked on" dates (`niche-teardown.md`). Each week adds **price history per country** that nobody can go back and collect. It powers the total reveal, Price watch, the advisors and SEO | **#2, v1.1 robot** |
| **Localisation (12 countries)** | 6 | Real today: Italy is the #2 country for calm trackers, and few rivals do local prices. It gets stronger once the app itself is translated. Rivals can catch up, but slowly | #3, v1.1 |
| **SEO from that data** | 6 | It compounds, but takes 6–12 months. "Cancel X" searches are crowded with spammy pages and rival blogs (getfinny, resubs, LemSubs). Our edge is real dates, real prices and sources, and pages in Italian, German, French and Spanish. Thin pages would hurt us | #4, after launch |
| Brand (the duck, the stamp, the voice) | 5 | Helps people remember us, stand out in screenshots and share Wrapped. Looks are easy to copy; a consistent voice is harder. It only defends once people know us | Steady (pro redraw before launch) |
| Privacy positioning | 5 | Strong against Rocket Money and Subpilot, but every indie tracker says "no bank login". It only stays true if we skip servers (another reason to skip email) | Keep, don't spend |
| Apple-screenshot import accuracy | 5 | A 6–12 month lead if our 20-screenshot test set (languages, dark mode) gets it to 95%. Orbit's import gets "simply don't work" reviews | Do it well in M3 |
| Fast, human support | 5 | Cheap to do. Bobby, Subtrack and Subo all lose stars for going silent | Always reply within 48h |
| Your data history (switching cost) | 3 | About 10 subs is a 5-minute retype. Price history and the Ditched total add a little. We keep export free on purpose: trust beats lock-in | Don't chase |
| Integrations (Calendar, widgets, Watch, Shortcuts) | 3 | The normal checklist: Recur and Outflow already have them. Needed so we don't fall behind | Match them, don't brag |
| Family sharing network effects | 2 | Households of 2; no viral loop | Skip as a moat |

**What to invest in first:** (1) reliability you can see, plus the ratings prompt after the first delivered reminder or first ditch, (2) the price dataset and Price watch, (3) translating the app, (4) SEO pages built on the dataset. Brand runs alongside all four.

## 4. Ranked roadmap

### v1 launch: what Pro must have (the paywall lists only these)
1. **Reminders on every sub.** The core, and the reason to pay once you have more than 3.
2. **Your own timing, up to 3 reminders each.** The one ask power users make ("at least five different reminders", Bobby).
3. **A second nudge if you miss the first.** Our honest answer to email: backup without a server.
4. **Import after onboarding** (M3). Saves real typing time, and the free onboarding scan proves it works.

**v1, free, to protect reliability and conversion:** time-sensitive level (needs the dev build), "proof it fired" + health check, the "renewed without a reminder" card, trial entries with their reminders, a notes field, cancel guides, CSV export.

### v1.1 (1–2 months after launch)
1. **Price watch** (Pro): built on the price robot. A new reason to stay subscribed, from our own data.
2. **Translate the app into IT, DE, FR, ES**: our biggest audiences outside the US.
3. **Widgets** (Pro): something to see without notifications, and widgets are often asked for.
4. **Calendar sync** (Pro): alerts on Mac, iPad and Watch.
5. **iCloud backup** (Pro): fixes data-loss fear.
6. **"Still watching?" buttons** (free): more ditches, more good reviews.
7. **Subscription Wrapped** (free): shareable growth for December.
8. Trial screenshot + attachments (Pro), opt-in converted total (Pro), Face ID lock, icon badge, "my share" field, cancel guides for the top 50.

### v2
1. **iCloud sync across devices** (Pro): the most-mentioned theme, but only once it's rock solid.
2. **FinanceKit** (Pro) + the Trends view Apple requires.
3. Yearly-vs-monthly advisor and plan finder (Pro): uses the dataset again.
4. Siri / Shortcuts; partner sharing over iCloud; the AlarmKit trial-end experiment.

### Skip (and why)
- **Email reminders:** a server and an account for something nobody asks for, and it breaks our privacy line. Revisit only with v3 bank sync.
- Budgets, cost per use, the "who owes what" ledger: off-mission or nagging.
- Live Activities, critical alerts, a Watch app: blocked by Apple or too much work for too little.

## Only you can do this
1. **Approve:** "no email" plus the reminder backup bundle, and the 4-item v1 Pro list above.
2. **Decide (no rush, before M2 products):** Apple Family Sharing for Pro? Once it's on in App Store Connect it can't be switched off. My lean: not at launch.
3. **At the dev build (M2):** on your iPhone, test a time-sensitive reminder with a Focus mode on, and, once Calendar sync exists, pick your Google calendar and check whether Google's email alerts fire.

---

## Sources
- **Reviews:** `https://itunes.apple.com/{us|gb}/rss/customerreviews/page={1–10}/id={ID}/sortBy=mostRecent/json`, pulled Nov 10, 2026. IDs: Bobby 1059152023, Rocket Money 1130616675, Orbit 6692620188, Subpilot 6751181747, MonoBoost 6740202306, Chronicle 572561420, Copilot 1447330651, Monarch 1459319842, Emma 1270062373, Subo 6741823650, Subtrack 1519946553, Kango 1259029889.
- **Store pages:** `https://itunes.apple.com/lookup?id={ID}` for 48 apps, including [Recur](https://apps.apple.com/us/app/id1584753654), [Outflow](https://apps.apple.com/us/app/id6779691937), [Subscriptions (Touchbits)](https://apps.apple.com/us/app/id1551697409), [Bobby](https://apps.apple.com/us/app/id1059152023).
- **AppKittie** (estimates): [List Apps](https://www.appkittie.com/docs/api-reference/apps/list-apps), searches "subscription tracker email reminders" and "bill reminder email", Nov 10, 2026.
- **Email:** [Resend pricing](https://automationatlas.io/answers/resend-pricing-explained-2026/), [Postmark pricing](https://postmarkapp.com/support/article/1107-how-does-monthly-pricing-work), [Gmail/Yahoo sender rules (Red Sift)](https://redsift.com/guides/bulk-email-sender-requirements), [CAN-SPAM primary purpose (Kelley Drye)](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/ftc-assesses-primary-purpose-of-emails-in-can-spam-enforcement), [Rocket Money notification settings](https://help.rocketmoney.com/en/articles/934668-updating-your-notification-settings), [TrackMySubs on TrustRadius](https://www.trustradius.com/products/trackmysubs/reviews), [App privacy questionnaire example](https://help.socio.events/en/articles/4724867-apple-app-privacy-questionnaire), [Apple privacy details](https://developer.apple.com/app-store/app-privacy-details/), [5.1.1(v) forum thread](https://developer.apple.com/forums/thread/724336).
- **Apple and Expo:** [Time-sensitive notifications (WWDC21 notes)](https://www.wwdcnotes.com/notes/wwdc21/10091), [OneSignal on interruption levels](https://documentation.onesignal.com/docs/ios-focus-modes-and-interruption-levels), [expo-calendar SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/calendar/), [expo-widgets](https://expo.dev/blog/home-screen-widgets-and-live-activities-in-expo), [ActivityKit](https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities), [AlarmKit (MacRumors)](https://www.macrumors.com/2025/06/11/ios-26-third-party-alarm-apps/), [Expo iCloud libraries (react-native-cloud-storage)](https://react-native-cloud-storage.oss.kuatsu.de/docs), [iOS 27 Wallet (9to5Mac)](https://9to5mac.com/2026/09/14/heres-everything-new-for-apple-wallet-in-ios-27/).
- **Competitors:** [Truebill deal (eMarketer)](https://www.emarketer.com/content/rocket-will-acquire-pfm-app-truebill-1-275b-deal), [Rocket Money pricing help](https://help.rocketmoney.com/en/articles/2217739-how-much-does-rocket-money-cost).
- **Push opt-in context:** iOS finance apps run at about 45–55% opt-in ([OneSignal 2024](https://onesignal.com/mobile-app-benchmarks-2024)), so about half of users may never see a push. That's one more reason the widget and calendar backups matter.
- **Mobbin:** [Monzo split bill](https://mobbin.com/screens/c018c2cd-c757-4e60-8fa4-5d0a51578c11?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Buddy members split](https://mobbin.com/screens/c8b64a43-82d3-413e-a069-73ce289d7dc4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Quicken trial-then-price sheet](https://mobbin.com/screens/b92100b0-a835-4afe-944d-ee1469c494cb?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Trust Wallet price alert](https://mobbin.com/screens/3bb20a14-7fab-4838-b931-5b52d17e2721?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp).
- **Earlier Ditch research:** `DECISIONS.md`, `freemium-v2.md`, `autosync.md`, `pricing-competitors-2026.md`, `niche-teardown.md`.

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
