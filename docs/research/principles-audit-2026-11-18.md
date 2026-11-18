# Ditch vs the 8 principles: audit and change plan (Nov 18, 2026)

_Input for discussion, not a to-do list: the 8 points are talking points, not rules (owner, Nov 18). See `discussion-points-2026-11-18.md`._

Read-only audit of the app as built today, against the whole-app principles in DECISIONS #67. Nothing was changed. Checked in the code (`src/app/**`) and in the web preview at iPhone 12 size (Home, Calendar, Ditched, onboarding, paywall).

**One thing comes before all of this:** purchases are still switched off (`PURCHASES_LIVE = false` in `src/services/purchases.ts`). The best paywall in the world earns $0 until StoreKit 2 is in (Milestone 2). Several changes below (exit offer, paywall tests) need it too.

---

## The app today, in one look

**Onboarding (7 screens to Home):**
Welcome → What you pay for → Your total → Charge dates → Reminders → **Paywall** (screen 6) → You're set → Home.

- **First "wow" (the yearly total):** about 7 taps for someone who ticks 5 subscriptions.
- **Paywall:** about 22 taps with 5 dates filled in, or about 11 if they skip the dates. The dates screen alone is ~11 taps for 5 subs.
- **What's built vs the money model (#66, `design/model/model.png`):** only the main paywall. Not built yet: "Where should we look?", the bank scan behind a trial, the exit offer, locked details after a free find, and paywall #2.

**After onboarding:**
- **Home:** a big yellow "$90.95 a month" card on top, then up to 5 more rows and cards (next reminder, payday, missing dates, price change or overlap, card filter chips). The list comes after those, and "See where subscriptions hide" is at the bottom.
- **Calendar tab:** the month's total, a grid, Year ahead, and No date yet.
- **Ditched tab:** "You won't pay $431 a year", a list, an "Adding up" step chart, and a footnote.
- **Paywall moments in the app:** Settings, the editor at the 4th reminder, the "yearly would cost less" teaser, the price-change card, and the finder after its free use.

---

## Principle by principle

### 1) Structure beats price
**Today:** the paywall (`src/app/paywall.tsx`) offers 3 plans: Yearly $49.99 with 7 days free (pre-selected, "SAVE 86%", "$0.97 a week"), Lifetime $99.99 and Weekly $6.99 with no trial. Above the plans sits a Free vs Pro table. Its first row says Free already tracks every subscription, so the first thing the paywall teaches is that free is enough. Welcome also leads with "Free forever for tracking. Reminders on 3." (`src/app/onboarding/index.tsx`).
**Verdict:** the prices and plans are right. What people see first, and the missing exit path, are wrong.
**Changes:**
- Swap the table for the v17 top (`design/v17/paywall.html`): their own upcoming reminders as real-looking notifications, with the plans pinned to the bottom.
- Build the exit offer on ×, shown once.
- Take the "Free forever" line off Welcome. It can stay in the App Store text (owner call, see decisions).

### 2) Weekly is the new monthly
**Today:** Weekly $6.99 with "No free trial" (#66). The trial sits only on Yearly.
**Verdict:** this goes against principle 2 as written. It's also a locked decision, so it's the owner's call.
**Change:** don't switch it outright. Run it as the first paywall test (Weekly with a 3-day trial vs no trial; see principle 8). Note: our own niche research (`monetization-model-2026-11-18.md`) found that weekly plans in this category bring "scam" reviews. The owner's $54.50 vs $7.40 figure isn't checked yet.

### 3) The first session is the whole game
**Today:** the total reveal lands early, which is good. But nothing in session one actually gets a subscription ditched. The × goes straight to "You're set" with no second chance (`leaveFree` in `paywall.tsx`). You're set (`src/app/onboarding/done.tsx`) is a checklist of stats ("6 subscriptions on your list, $1,091 a year").
**Verdict:** half there. The wow is real, but there's no act and no second offer.
**Changes:**
- On Your total, let people tap the ones they'd ditch. Then the first Ditched moment happens on install day.
- Add the exit offer.
- Make You're set name the next charge: "Netflix charges Sat. $17.99. We'll remind you Wed."

### 4) Onboarding as short as possible
**Today:** 5 screens and 11–22 taps before the paywall.
- **Charge dates** asks for a day for every subscription. It does buy something (real reminders and a real paywall), but it's the biggest cost.
- **Your total** carries a study line ("2.5× what people thought"). That's a reference, not a step that pays its way.

**Verdict:** one step too heavy.
**Changes:**
- Dates for only the 3 that matter: the free reminders, biggest or soonest first. The rest go to Home's "Add dates" row.
- Drop the study line.
- Whatever flow wins the pending v16 plan (`docs/plans/ux-overhaul.md`, bank scan first), keep it to 4 screens or fewer before the paywall.

### 5) Do the job: get useless subscriptions cancelled
**Today:** the job shows up in only two places: hold-to-ditch (hidden behind a one-time hint) and the Ditched screen with the cancel link (`src/app/ditch/[id].tsx`). That screen is good. Everywhere else shows data about the job:
- **Notifications:** tapping one does nothing special. There's no tap handler anywhere in `src/` and no action buttons, even though each notification already carries `subId` (`src/services/notifications.ts`). The reminder is the moment people decide, and it drops them on Home.
- **Home** opens on a total, not a decision.
- **Ditched tab** leads with a trophy number and a step chart. The "still to cancel" ones are underneath.
- **Calendar:** month total, Year ahead. All data.

**Verdict:** the weakest principle in the app.
**Changes:**
- A notification tap opens a "Keep or ditch?" screen for that subscription, with "Cancel now" one tap away. Add notification buttons "Ditch it" / "Keep".
- Home's top card becomes the next decision.
- The Ditched tab leads with "To cancel".

### 6) Put the stake on screen, not the stat
Stats that could be stakes:

| Where | Stat today | Stake instead |
|---|---|---|
| Home top (`src/home/HomeParts.tsx` TotalCard) | "$90.95 a month" | "Netflix charges Sat · $17.99. Still watching?" with Ditch / Keep. Trials ending go first: "Your ChatGPT trial ends Fri. Then $20 a month." The total shrinks to one line. |
| Trials on Home | "+ 1 trial" inside the total card | Its own line with the end date and the price after it |
| Paywall | Free vs Pro table | Their own next 3–6 charges as notifications (v17 A). Not the dollar total (owner, #67). |
| You're set | "6 subscriptions · $1,091 a year" | "Next up: Netflix, Sat, $17.99. Reminder Wed." |
| Calendar header | "$63.97 due in November" | "Next: Netflix Sat $17.99" (keep the grid) |
| Editor at the 4th reminder | "Try Pro for reminders on everything" | "Canva charges Fri, $12.99. Free covers 3. Pro warns you on this one too." |

Already good: notification copy ("Netflix renews in 3 days. $17.99. Still watching?"), the Ditched moment ("$X a year you won't pay"), and the price-change teaser.

### 7) One point of view, then cut
**Today:** Ditch says "we help you cancel", but Home and Settings say "we're a budget dashboard". The extras:
- Home: payday row, card filter chips, the "Missing any?" row
- Calendar: Year ahead
- Ditched tab: step chart
- Editor: "yearly would cost less" (it sells keeping a subscription) and "skip one charge's reminders"
- Settings: Payday, Currency, plus 4 separate feedback rows
- Sources: the Sources page and the "Source 1/2" links in "Your rights"

**Verdict:** too many features shouting at once. See the cut list.

### 8) Test the paywall constantly
**Today:** one paywall, no variants, no way to test. No RevenueCat and no analytics (#59). The label should stay "Data Not Collected", or after #64 "Financial Info" for bank users only. Either way, testing must add nothing.
**Change: a zero-data test setup.**
1. **Separate products per variant.** Every variant gets its own App Store product IDs in the same subscription group (e.g. `pro.yearly.a`, `pro.yearly.b`, `pro.weekly.trial3`).
2. **Assigned on the phone.** On first launch the phone flips a coin, saves the result in its own database and never sends it anywhere.
3. **Switched from a public file.** Which variants are live comes from the public JSON file we already plan to ship (#59). Everyone gets the same file.
4. **Read in App Store Connect.** Under Subscriptions and Sales: trial starts, trial→paid and proceeds, per product ID. With a 50/50 coin flip, the variant with more paid users won.

Limits:
- It can't see paywall views or onboarding drop-off.
- Run one test at a time, for about 2–4 weeks or until each side has around 100+ trial starts.
- Each new product needs App Review once.

Store screenshots can be tested separately with Apple's Product Page Optimization, which also collects nothing in the app.

**First 3 tests:**
1. v17 notifications vs the v17 trial timeline.
2. Weekly with a 3-day trial vs without.
3. 3 plans vs 2 (Yearly + Lifetime).

---

## Top 12 changes, ranked
Ranked by effect on trial starts, then trial→paid, then retention. Effort: S = a day or less, M = a few days, L = a week or more.

| # | What | Principle | Why | Effort | Files |
|---|---|---|---|---|---|
| 1 | **v17 paywall:** their own upcoming reminders on top, plans pinned at the bottom, Free vs Pro table removed | 1, 6, 7 | The first screen people see when deciding shows what they're about to be charged, not that free is enough | M | `src/app/paywall.tsx`, `src/onboarding/useFirstReminders.ts`, `src/ui/sunflower` (NotificationPreview) |
| 2 | **Exit offer on ×**, once: first year $24.99, then $49.99 | 1, 3 | The only second chance in session one. #66 has it, the app doesn't | M (needs StoreKit) | `src/app/paywall.tsx`, new exit sheet, `src/services/purchases.ts` |
| 3 | **Zero-data paywall testing** (products per variant, coin flip on the phone, public switch file) | 8 | Without it every paywall choice is a guess, forever. Build it before launch so test 1 starts on day one | M | `src/services/purchases.ts`, `src/domain/settings.ts`, `src/db/` (one setting), public config JSON |
| 4 | **Notification tap → "Keep or ditch?" screen**, plus "Ditch it" / "Keep" buttons on the notification | 5, 6 | The reminder is the moment of decision. Today it opens Home. It drives retention (the reason to keep paying) and real cancels | M | `src/services/notifications.ts`, `src/app/_layout.tsx` (tap listener), `src/app/ditch/[id].tsx` or a new `src/app/decide/[id].tsx` |
| 5 | **Home opens on the next decision**, not the total: next charge or ending trial with Ditch / Keep; total shrinks to one line | 5, 6 | Each visit moves someone toward a cancel. Trial ends are the surprise charges people fear most | M | `src/app/(tabs)/index.tsx`, `src/home/HomeParts.tsx` |
| 6 | **"Which would you ditch?" on Your total**: tap rows to mark them, first Ditched moment on install day, carried into the paywall and You're set | 3, 5 | The job done in session one. A stake for the paywall that isn't the dollar headline ("2 to cancel before they renew") | M | `src/app/onboarding/total.tsx`, `src/state/onboarding.tsx`, `src/state/fromOnboarding.ts`, `src/app/onboarding/done.tsx` |
| 7 | **Shorter path to the paywall**: dates only for the 3 that matter, drop the study line, at most 4 screens before the paywall in whatever flow v16 settles on | 4, 3 | Cuts ~6–8 taps for a 5-sub user before the paywall. Fewer quit before seeing it | S | `src/app/onboarding/dates.tsx`, `src/app/onboarding/total.tsx` |
| 8 | **Locked details after a free find + paywall #2** ("Unlock your 6 and get a reminder before each renews") | 1 | Path 2 of #66. Today a free find hands over everything, so the strongest moment never asks for anything | M | `src/app/find/review.tsx`, `src/app/paywall.tsx` (a "from=find" headline) |
| 9 | **Stake copy on in-app paywall moments**: trial added, 4th reminder, price rise all name the service, date and price | 6 | Same paywall, more reasons to open it. The moments already exist, only their words change | S | `src/editor/Editor.tsx`, `src/home/HomeParts.tsx` (PriceChangeCard) |
| 10 | **Ditched tab leads with "To cancel"** (Cancel now buttons); the confirmed total becomes one line; step chart cut | 5, 7 | Turns a trophy page into a to-do list that ends in real cancels and real "$X a year you won't pay" | S | `src/app/(tabs)/ditched.tsx`, `src/ditched/StepChart.tsx` |
| 11 | **Weekly with a 3-day trial**, run as test 2, not a switch | 2, 8 | The principle says it earns far more, but our niche research says weekly brings bad reviews. Let the numbers decide | S code + App Store Connect setup | `src/services/purchases.ts`, `src/app/paywall.tsx` (button and line text) |
| 12 | **Welcome and You're set name the stake**: no "Free forever" line first; You're set says the next charge and its reminder day | 1, 3, 6 | What's shown first steers the paywall. You're set is the last screen before Home, so it should point at the next charge | S | `src/app/onboarding/index.tsx`, `src/app/onboarding/done.tsx` |

---

## Cut list (remove or hide)
- **Paywall:** the Free vs Pro table (replaced by v17).
- **Your total:** the "2.5× in one study" line.
- **Sources on screen:** the "Source 1/2" links in "Your rights" (keep a short "Not legal advice" and put sources on the website) and Settings → About → Sources. Needs an owner call: it goes against #19 and #60.
- **Home:**
  - Payday row (and Settings → Payday)
  - Card filter chips
  - "Missing any? See where subscriptions hide" (move it into + Add, where "Find your subscriptions" already is)
- **Calendar:** Year ahead. Keep the grid; it's free by rule 6.
- **Ditched tab:** the "Adding up" step chart.
- **Editor:**
  - "Yearly would cost less" teaser. It sells keeping a subscription, the opposite of Ditch's job. Pro already has plenty to sell.
  - "Skip this charge's reminders" goes behind a "More" row.
- **Settings:** merge Report a problem, Suggest a feature, Suggest a subscription and Rate into one "Help and feedback" row.
- **Later, when Plaid ships:** "No account, no bank link" in Settings → Your data stops being true.

Keep: hold-to-ditch and the Ditched moment, the overlap card (it's a ditch prompt), "For when you cancel" (card and email help cancel), notification copy.

---

## Needs an owner decision
1. **Weekly with a free trial.** It changes #66 ("Weekly $6.99, no trial"). Suggestion: run it as a test (change 11), not a switch.
2. **Exit offer, how.** Option A: a separate "first year $24.99" product. It works with no server and shows up in App Store Connect by itself. Option B: an Apple promotional offer, which needs signing on the new Supabase backend. Suggestion: A.
3. **Locked details after a free find vs the free tier.** #66 locks dates and trial ends. Rule 6 promises reminders on 3, and #11 says found subs are saved free. Suggestion: save every found sub and show its name; lock dates and trial ends except for the 3 free reminder picks.
4. **No on-screen sources vs #19 and #60.** The Sources page, the rights sources and the study line exist because of those decisions. Remove them? (The lawyer check covers the rights wording anyway.)
5. **"Free forever for tracking" on Welcome.** It came from review research (people hated finding out the deal late). Move it to the paywall's small print and the App Store page?
6. **Paywall top for launch:** v17 A (notifications) or B (trial timeline). Suggestion: A at launch, B as test 1.
7. **Onboarding order:** the v16 plan (bank scan first) is still waiting for approval. Changes 6, 7 and 12 should go into whichever flow wins, so decide v16 first.
