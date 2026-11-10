# Onboarding v11: research and redesign plan

Written Nov 10, 2026, after the owner's walkthrough (`docs/feedback/owner-2026-11-10-onboarding.md`). It proposes changes for the owner to approve before anything is built. It follows DECISIONS #7, #11, #15, #16, #19, #20 and #21 and reopens none of them.

## Summary (read this if nothing else)
1. **Keep the short, value-first spine.** Quiz-style apps (Opal, Cal AI, Feenko) show 17–25 screens before the paywall. Calm trackers (Orbit, Bobby) show 5–8. Our "aha" is the user's own real total. A quiz can't beat that, so we stay short: **8 steps to Home, about 60–90 seconds**.
2. **Add one new screen: "Quick guess".** One tap: "What do you pay a month?" Then the total screen compares their guess with their real number. It's how the C+R study found the gap, and it makes the reveal personal instead of preachy.
3. **Facts: two in the whole flow, all real.** On the total: "Most people guess low. In one study the real total was about 2.5× the guess" (C+R 2022). On the reminders screen: "7 in 10 people have forgotten to cancel a free trial at least once" (Self Financial 2026). No inline citations (DECISIONS #19). Never say "people like you": we have no such data.
4. **Plans: drop the pill rows.** A tick uses the usual plan. The row shows "Standard · $19.99/mo · Change" and "Change" opens a small sheet with radio buttons (Substack, Saily). 9/10.
5. **Total screen: two zones.** The yellow top holds one number ("$726 a year") plus the guess comparison. Below it, one cream "receipt" list with no bars, no second card and no "4 of your 6" header. Missing prices sit at the bottom of the same list.
6. **Dates: stop saying "GUESS".** Ask "Which day does Netflix usually charge you?" one service at a time with a 1–31 day grid (Apple Wallet, App Store). One tap moves on. "Not sure" keeps our date and shows it as "**around** Nov 19" (Copilot's "Expected around"). The Apple-subscriptions screenshot scan comes first on this screen, since that list shows real renewal dates.
7. **Ask for dates after reminders, before the paywall.** Then the paywall can name their real next charges.
8. **Reminders pre-ask:** the headline names their own services ("Before Netflix, Spotify and 4 more renew"), and the preview uses their real price and date. Adds "Only about your subscriptions. Nothing else." and Strava's "Tap Allow on the next screen".
9. **Paywall:** a 7-row Free vs Pro table (Fixtured style), a 3-stop timeline, and no "We'll remind you before we charge you, too".
10. **Which 3:** three "slots" at the top with the rest listed below (Bumble's Opening Moves). It opens as a sheet from "Continue free". No bells.
11. **You're set:** a 3-line checklist (Facebook, Nibble) plus the real "Your first reminders" line. No stats row. Separates reminder day from charge day.
12. **Logos:** bundle the top 100 as local images so they appear instantly. The other ~120 load in the background behind a monogram tile.
13. **Every screen gets small and large phone rules** (SE 375×667 → Pro Max 440×956, iPad centred at 560pt), listed per screen below.
14. **Biggest wins for conversion, in order:** the guess + reveal, right dates (reminders that fire on the right day are the product), the pre-ask naming their services, a clearer paywall.
15. **Only you can do this:** approve this plan; confirm the 2026 CNET number on cnet.com before we quote it (I couldn't open the page); take one real screenshot of your Apple subscriptions page for the scanner tests.

---

## 1. How the best apps order onboarding

| App | Screens before paywall | Order | Where the "aha" is | How it says "this will help you" |
|---|---|---|---|---|
| **Orbit** ([flow][orbit-flow]) | 6 | Welcome → one cited stat ([▸][orbit-stat]) → tick list ([▸][orbit-tick]) → total ([▸][orbit-total]) → iOS prompt → lifetime paywall | Screen 4: "That's $155.76 a year" | "How many others are you paying for quietly in the background?" |
| **Rocket Money** | ~14 (account + bank) | Account → bank link → "Your Subscription Overview" ([▸][rm-overview]) → "You could save up to $378 a year" ([▸][rm-378]) | After the bank link | "Save up to $96 annually by canceling just 1 subscription" (from your own list) |
| **Feenko** (AppKittie [00–24][feenko]) | 13 | Welcome → reviews → 3 feature cards → quiz ("How many subscriptions do you have? How many do you use?") → three "Did you know?" cards → weekly paywall | None of it is your data. Its claims ($1,416 a year; "92% of our users had 8.3 unwanted subs") are unsourced | Self-diagnosis, then big scary numbers |
| **Subpilot** | ~12 | 10-step quiz → email wall → hard weekly paywall | "You named 1. People like you actually have 11" (no source) | Scare plus "people like you" |
| **Opal** (AppKittie [funnel][opal-ak]) | ~17 | Age → social proof → screen-time slider (with "The average American now spends 7h 4m/day" under it) → apps → what you lose → projection ([▸][opal-proj]) → feelings → "Fix this" | The projection: "24 YEARS of your life looking down", with small print on how it's worked out | Your own number, projected, then a "Fix this" button |
| **Cal AI** ([flow][calai]) | 17 | Quiz → "Designed to help you stay on track" chart (with vs without) → goals → plan → paywall | "Your plan" built from the answers | A before/after chart |
| **Monarch** ([flow][monarch]) | 6 steps + account | Account → email code → priorities → profile → dashboard | Only after linking a bank | "Step 2 of 6" progress, priorities chips |
| **Copilot, Cleo, YNAB, Emma, Snoop** | — | All need a bank link (or an account) before any value. Cleo's plan screen is a 3-step vertical timeline ([▸][cleo-plan]) | After linking | Plan or "what's next" lists |
| **Revolut** | n/a (inside a bank) | Subscriptions are a list: "Premium plan · Monthly, next on 20 Apr" ([▸][revolut]) | — | Plain facts, no hype |
| **Duolingo, Calm** | see `duolingo-brilliant.md` | Value first (a real lesson or a breathing exercise) before any ask | Inside the first minute | You *do* the thing before paying |

**What this means for Ditch**
- There are two families. **Quiz funnels** (Opal, Cal AI, Feenko, Subpilot) are long and emotional and end on hard or weekly paywalls. They earn well, but their reviews complain about money and scams (`DECISIONS.md` free-tier evidence). **Value-first** apps (Orbit, Bobby, Duolingo) show you your own result fast.
- Ditch's honest version of Opal's projection is **your real total compared with your own guess**. It's your data, not a statistic about strangers, so it isn't a scare tactic. Each step costs one tap.
- RevenueCat: 82–89% of trial starts happen on install day (DECISIONS). The paywall has to arrive while the total is still fresh, so nothing slow goes between the reveal and the paywall except reminders and dates, and both feed the paywall's message.

## 2. Savings facts: what's real, and where it goes

Every number below I opened at the source or at a named news report. All of them go on the **Settings → About → Sources** page and the legal pages (DECISIONS #19), not inline.

| Study | What it found | Sample | Use in app? |
|---|---|---|---|
| **C+R Research, 2022** ([crresearch.com][cr]) | People guessed **$86** a month. Itemized, it was **$219**: $133 more, about 2.5×. **42%** kept paying for a service they'd stopped using. **74%** say recurring charges are easy to forget. | 1,000 US adults, Apr 22–May 2, 2022 | **Yes**: the total screen |
| **Self Financial, 2026** ([self.inc][self]) | **70%** have forgotten to cancel a free trial at least once. **59.9%** have at least one paid subscription they didn't use in the last 30 days. | 1,272 US adults, March 2026. Run for a fintech, research firm not named | **Yes**: the reminders pre-ask |
| **CNET / YouGov, 2025** ([The Desk][cnet25]) | About **$90 a month** on subscriptions; about **$205 a year** on ones people don't use | 2,440 US adults, Apr 28–30, 2025 | Sources page; App Store copy |
| CNET, 2026 (via [ABC7, Jul 28 2026][cnet26]) | **$252 a year** unused, up from $204 | Not stated in the report | Only after the owner checks cnet.com |
| **Chase / OnePoll, 2021** ([Chase][chase]) | **60%** forgot at least one recurring payment in the past year; **55%** don't know how much goes out each month | 2,000+ US adults | Sources page |
| **West Monroe, 2021** ([West Monroe][wm]) | People spend **$273** a month; **66%** guessed wrong by more than $200 | 2,500 US adults, June 2021 | Sources page |
| Bango, 2022/2024 | 72% say there are "too many" services; average US subscriber has about 5 | 2,500–5,000 US (second-hand) | Sources page only |
| Feenko "$1,416", Orbit "$2,000", Subpilot "people like you have 11" | No source found | — | **Never** |

**How to show them without preaching** (patterns from Opal, Rocket Money and Feenko, minus their spin):
- **One fact per screen, two in the whole flow.** Feenko stacks three "Did you know?" screens in a row, and that's where it starts to feel like a lecture.
- **Put the fact next to the user's own number**, never instead of it. Opal's average sits under the user's own slider. Rocket Money's "save $96" comes from your own list.
- **Use ratios and shares, not dollars, outside the US.** "2.5×" and "7 in 10" read the same in pounds, euros and rupees. In the US we can use the dollar version. Both are from US studies, so non-US copy says "in one study", never "in the UK".
- **Never "people like you".** It implies we profiled them.
- **Neutral voice.** "Most people guess low" is fine. "You're wasting money" isn't.

| Option for the "how much could you save" moment | Score | Why |
|---|---|---|
| **A. Guess vs real total + one fact line** | **9/10** | Personal, honest, and it's how the study itself worked |
| B. "Ditch just one you don't use: up to $239.88 a year you won't pay" (uses their biggest charge) | 8/10 | Real money from their own list, tied to the stamp. Use it as a second line |
| C. 5-year projection: "$3,628 over 5 years at today's prices" | 6/10 | True maths, but starts to feel like Opal-style scaring. Optional, test later |
| D. "People like you could save $X" | 1/10 | We have no data on "people like you". Breaks the honesty rules |
| E. Feenko-style fact carousel | 3/10 | Preachy, slows people down, and stats about strangers |

**Pick A + B.**

## 3. Screen by screen

Layout rules for every screen (DECISIONS #21):
- The CTA is pinned above the home indicator. Content scrolls under it.
- If the screen is shorter than 700pt (the SE), drop decorative art (the duck) before shrinking text.
- Display sizes scale with width, e.g. hero number `clamp(64, 22% of width, 120)`.
- Dynamic Type up to AX sizes: rows wrap to two lines and never cut off with "…".
- iPad and unfolded foldables: one centred column, max 560pt; sheets become form sheets.
- Tap targets ≥ 44pt.

### 01 Welcome (keep)
- **Wrong now:** almost nothing. The owner likes it. The footer line "Your list stays on your phone" is noise here.
- **Change:** the footer becomes only "Free forever for tracking." Keep the headline, the sample notification and the 3-dot timeline.
- **Copy:** "Ditch it before it renews." / "See everything you pay for. Get a reminder before every charge." (was "heads-up", DECISIONS #22) / CTA "See what I pay" / footer "Free forever for tracking."
- **Layout:** SE: hide the duck and keep the notification card. iPad: centre the column, headline max 6 words per line.
- **Why it converts:** the first frame says what you get and that it's free. That's what lifts completion.

### 02 Quick guess (new)
- **References:** Opal's "How much time do you spend on your phone?" slider with an average under it ([AppKittie][opal-ak]); Cleo's big number + slider ([▸][cleo-slider]); Feenko's "How many subscriptions do you have?" chips.
- **Design:** one question, six big chips, one tap moves on (no Continue button). Chips beat a slider: one tap, easy at large text sizes, and nothing fiddly on an SE.
- **Copy:** title "Quick guess." / "What do you pay for subscriptions each month?" / chips "Under $25" · "$25–50" · "$50–100" · "$100–200" · "Over $200" · "No idea" / small "No wrong answers. We'll show you the real number in a minute."
- **Currency ladders:** USD, CAD, AUD and NZD use the numbers above. GBP and EUR use £/€ 15 · 30 · 60 · 120. INR uses ₹500 · 1,000 · 2,000 · 5,000. Ladders come from the iPhone Region, like prices.
- **Layout:** chips are a 2-column grid on phones and stack to 1 column at AX text sizes.
- **Why it converts:** a small commitment creates curiosity ("am I right?"), so the next screens feel like finding out, not data entry. One screen, about 3 seconds.

### 03 What do you pay for?
- **Wrong now:** the plan pills scroll sideways and get cut off ("Prime (year", "Disney+"). Ticked rows change height. The price shows twice ("about $14.99 a month" plus "$14.99/mo" in the pill). Only 44 services. Logos load slowly.
- **References:** Orbit's tick list with "Typical monthly price, you can edit later" and "None of these" ([▸][orbit-tick]); Substack's grouped radio sheet ([▸][substack]); Saily's half-sheet "Choose unlimited plan duration" ([▸][saily]); Rocket Money's "Continue with 2 Subscriptions" button ([▸][rm-bills]).

| Plan-picking option | Score | Why |
|---|---|---|
| **A. Tick picks the usual plan; row shows "Standard · $19.99/mo · Change"; Change opens a sheet** | **9/10** | One tap stays one tap. Rows stay the same height. Plan names match what people know ("I'm on Standard") |
| B. Inline pills (now) | 4/10 | Cut off, busy, unclear, and it changes row height |
| C. A sheet on every tick | 5/10 | Accurate but slow: 6 ticks means 6 sheets |
| D. A dropdown menu on the row | 6/10 | Native-looking, but the iOS menu can't show logos or prices well at large text sizes |

- **Row (unticked):** logo 40pt · "Netflix" · grey "from $8.99/mo" · empty circle.
- **Row (ticked):** filled circle · second line "Standard · $19.99/mo" and a small underlined "Change". Services with one plan show no "Change". No local price: "Add your price".
- **Plan sheet (medium height):** title "Which Netflix plan?" / radio rows "Standard with ads · $8.99/mo", "Standard · $19.99/mo", "Premium · $26.99/mo" / small "Not sure? Pick Standard. You can change it later." / text button "Enter my own price". Picking closes the sheet.
- **Search and catalog:** "Search 220 services" (DECISIONS #20). Category chips stay. At the end of every list or search: "Can't find it? Add it yourself". For people with none: "None of these" (Orbit).
- **Bottom bar:** one line, "6 picked · $60.46 a month", above "See my total". If any price is missing: "2 without a price". On an SE, fold the count into the button: "See my total (6)".
- **Logos:** ship the top 100 as local images in the app (instant, offline). The other ~120 load in the background with a coloured monogram tile until they're ready. No spinner.
- **Layout:** iPad uses a 2-column grid of rows. SE: rows 64pt, plan text on one line.
- **Why it converts:** a correct total depends on the right plan (`niche-teardown.md` C.3 #4). A clean list cuts drop-off on the slowest screen.

### 04 Your total (restructure)
- **Wrong now:**
  - "4 of your 6 subscriptions cost" is confusing as a header.
  - There are four numbers ($726, $60.46, $1.99, and every row).
  - The bars add noise.
  - Two white cards sit on yellow, and the grey and black type clash.
  - The footer text is cut off ("It usually is. Let's").
- **References:** Orbit's single sentence ([▸][orbit-total]); Opal's one huge number with small print under it ([▸][opal-proj]); Rocket Money's overview ("costing you a total of $121 a year", then the one-subscription line) ([▸][rm-overview]); Revolut's plain rows ([▸][revolut]).
- **New structure, top to bottom:**
  1. **Yellow hero (top ~45%):** small "You pay" → huge "$726" → "a year." → "That's $60.46 a month." Drop "$1.99 a day": it shrinks the number, which works against the moment.
  2. **Guess line (ink pill on yellow):** "You guessed $25–50 a month."
  3. **Fact line (small, ink at 70%):** US: "Most people guess low. In one study, people guessed $86 a month. It was $219." Elsewhere: "Most people guess low. In one study, the real total was about 2.5× the guess."
  4. **Cream "receipt" sheet (rises from the bottom, scrolls):** header "Per year", then one row per subscription: logo 32pt · name · amount right-aligned in tabular figures, all in ink. Sorted biggest first. No-price rows go last in the same list, with "Add price" on the right. On phones, show 5 rows, then "+3 more".
  5. **Ditch line (last row of the sheet):** "Ditch just one you don't use: up to $239.88 a year you won't pay." (uses their biggest yearly charge, never "save")
  6. **CTA:** "Set up reminders". US only, small under the list: "US prices are before sales tax."
- **Copy variants:** guess "No idea" → drop the guess line and keep the fact. Real total below the guess → "Lower than you guessed. Nice." and no fact line. Prices missing → under the hero: "Plus 2 without a price yet." More than one currency → hero shows the main currency and a second line "+ US$240 a year" (never added together).
- **Colours:** two surfaces only, yellow (hero) and cream (list). All text is ink. No grey tables, no white cards on yellow.
- **Layout:** SE: hero number 72pt and list peeks at 3 rows. Pro Max: 112pt. iPad: hero and list side by side at 2 × 420pt.
- **Money rules:** every row is monthly × 12 on exact cents. The hero rounds once, for display ($725.52 → "$726"). Tests: Netflix $19.99 → $239.88; 4 subs → $725.52 / $60.46.
- **Why it converts:** one number plus their own guess is the "aha". The list proves it's real. Cutting from 4 numbers to 2 makes it land.

### 05 Reminders pre-ask
- **Wrong now:** the owner likes it, but the lock-screen preview could be any app's. The title doesn't say it's about *their* subscriptions.
- **References:** Strava's "Make sure you select 'Allow' on the next step" ([▸][strava]); Vocabulary's preview with timing shown before Allow ([▸][vocab]); Zalando's lock-screen mock ([▸][zalando]); Feenko's "we'll let you know about…" bullets. Airship's median iOS opt-in is about 49% (vendor data). A preview screen is the cheapest lift we have.
- **Design:** a row of their own logos (up to 5, then "+3") above the lock-screen mock. Each notification in the mock shows the service's real name, price and date from their list.
- **Copy:** title "Get a reminder before Netflix, Spotify and 4 more renew." / "3 days and 1 day before, at 9:00 AM. Only about your subscriptions. Nothing else." / mock 1: "**Netflix renews in 3 days.** $19.99 on Thu, Nov 19. Still watching?" / mock 2: "**Netflix renews tomorrow.** Last call if you're done with it." / fact (small): "7 in 10 people have forgotten to cancel a free trial at least once." / CTA "Turn on reminders" / hint under it "Tap Allow on the next screen." / "Maybe later".
- **Layout:** SE: shrink the mock to 2 notifications, no duck, logos row 28pt. iPad: mock max 380pt wide.
- **Why it converts:** a "Don't Allow" means the product can never work (CLAUDE.md §3). Naming their services shows the notifications are about them, not marketing.

### 06 Charge dates (replace "GUESS")
- **Wrong now:**
  - "GUESS" chips confused the owner.
  - The text says "Grey dates are guesses", but the dates aren't grey.
  - "Your last receipt has the real day" doesn't say where to look.
  - Six dropdowns read like a form.
  - "Use the guesses for now" sounds like giving up.
- **References:** Apple Wallet's 1–31 grid with "Your payment will occur on the 11th of every month" ([▸][wallet]); the App Store's 1–28 + "End of Month" with a plain sentence under it ([▸][appstore]); Copilot's "Expected around Sep 3rd" ([▸][copilot]); Shopee's "Monthly · 1st" picker ([▸][shopee]); Cleo's big suggested-date cards ([▸][cleo-date]).
- **What people actually know:** not "Thu, Nov 19". They know "around the 19th" or "start of the month", and their bank app shows the last charge. For monthly subscriptions the **day of the month** is all we need. Yearly ones need month + day.

| Option | Score | Why |
|---|---|---|
| A. Skip dates; fix later on Home | 5/10 | Fast, but reminders may fire on the wrong day, which breaks the core promise |
| B. Current list with dropdowns + "GUESS" | 4/10 | Confusing (owner) |
| **C. One service at a time: "Which day does it usually charge you?" day grid, one tap moves on, "Not sure" allowed** | **8/10** | One tap each. The question matches how people remember |
| D. Only the 3 free reminders get dates | 6/10 | Short, but the calendar and Pro reminders still need the rest |
| **E. C plus the Apple-screenshot scan first** | **9/10** | Apple's Subscriptions list shows each one's renewal date, so one screenshot fixes those dates *and* prices (DECISIONS #16, free once) |

**Pick E.**
- **Step 6a (intro, one screen):** title "When do they charge you?" / "So your reminders land on the right day." / big card "**Scan your Apple subscriptions.** Paid through Apple? Take a screenshot of Settings → your name → Subscriptions, and Ditch reads the dates on your phone." CTA "Choose screenshot" / secondary "Pick days myself" / text button "Skip for now". Copy never says Ditch found or detected anything. The user shares a screenshot and Ditch reads it.
- **Step 6b (one per remaining sub, auto-advance):** header "2 of 6" · logo · "**When does Netflix charge you?**" / "Pick the day it usually comes out. Your bank app shows the last one." / grid 1–31 plus "Last day of the month" and "Not sure" / live sentence under the grid: "Next charge: Thu, Nov 19. Then the 19th of every month." / tiny "Back". Yearly: first "Which month?" (12 chips), then the grid. Weekly: "Which day of the week?" (7 chips).
- **"Not sure" explained, once, in a small sheet:** "No problem. We'll use **around Nov 19** for now. Your reminders will still come, but they could be a few days off. Tap the date on your list any time to fix it."
- **The word:** never "GUESS". Show "**around** Nov 19" everywhere (list, Home, notifications: "Netflix renews around Thu, Nov 19"). Checked dates drop "around".

| Label for an unchecked date | Score |
|---|---|
| **"around Nov 19"** | **9/10**: plain English, already in our notification copy |
| "Not checked" chip | 7/10 |
| "Estimated" | 5/10: sounds technical |
| "GUESS" (now) | 3/10: owner didn't get it |

- **Date rules:** the day grid stores an anchor day. 31 → Feb 28/29 → Mar 31 (CLAUDE.md §2). "Last day of the month" stores anchor 31. A date that's already past rolls forward. Tests for each.
- **Layout:** the grid is 7 columns × 5 rows, 44pt cells, on every phone (7 × 44 = 308pt fits the SE's 343pt content width). iPad: grid max 420pt.
- **Why it converts:** right dates mean reminders that fire on the right day (retention, ratings). Asking before the paywall gives the paywall real next charges to name.

### 07 Paywall (tidy)
- **Wrong now:** cluttered. The 4-stop timeline is messy. "We'll remind you before we charge you, too" is irrelevant. It doesn't say plainly what Free gets vs Pro.
- **References:** Fixtured's compact Free | Plus table above two plan tiles ([▸][fixtured]); deeper teardown in `paywalls-competitors.md`. Blinkist's honest timeline lifted trial starts 23%, and Superwall's Stompers test found one page beat several by 16%+ (both already in DECISIONS / paywalls doc).
- **Design:** headline "Get a reminder before all 6 renewals." (DECISIONS #22) → a 7-row table, columns Free | Pro:
  - Track everything: ✓ | ✓
  - Totals and calendar: ✓ | ✓
  - Reminders: 3 | Unlimited ("All 6" read like a cap)
  - Pick your timing: — | ✓
  - Scan screenshots and statements: — | ✓
  - Widget: — | ✓
  - iCloud backup: — | ✓

  Then the 3 plan rows (Yearly pre-picked), the 3-stop timeline "Today · free → Sat Nov 14 & Mon Nov 16 · reminders → Tue Nov 17 · $29.99", CTA "Start 7-day free trial", "Continue free: reminders for 3", and "Restore · Terms · Privacy".
- **Layout:** SE: the table collapses to 4 rows ("+3 more in Pro") so the CTA stays above the fold. iPad: form sheet, 540pt.
- **Why it converts:** people buy what they understand. The free path stays visible (CLAUDE.md §4).

### 08 Which 3 (free path, as a sheet)
- **Wrong now:** it's another identical table. The bell toggles don't explain themselves. The "Reminders 3 of 3" pill and "Tap a bell to swap" make people think about it more than they need to.
- **References:** Bumble's "Opening Moves", with 3 slots where empty ones say "Add" ([▸][bumble]); Cosmos's "Continue 3/3" counter in the button ([▸][cosmos]); Tonal dims the rest once the limit is reached ([▸][tonal]).

| Option | Score |
|---|---|
| **A. 3 slots on top, the rest below with "Swap in"** | **9/10**: you see "3" as a physical limit |
| B. Checklist with a counter; the rest dim at 3 | 8/10 |
| C. Bells (now) | 5/10 |

- **Copy:** title "Your 3 free reminders" / "We picked your biggest charges. Swap any of them." / slots: logo · "Netflix · $19.99 · around Thu, Nov 19" · ✕ / section "On your list, no reminder" with rows ending in "Swap in" (tap, then choose which slot it replaces) / small "These stay on your list with their totals and dates." / CTA "Keep these 3".
- **Layout:** a large sheet over the paywall (keeps context). SE: slots 56pt and the list scrolls. iPad: form sheet.
- **Why it converts:** free users understand the deal and still get value (retention), and the limit is felt without nagging. It follows DECISIONS #11 (picker with the 3 biggest pre-selected).

### 09 You're set
- **Wrong now:**
  - "FIRST HEADS-UPS · Netflix around Mon, Nov 16" mixes up the reminder day and the charge day (Netflix charges Thu Nov 19).
  - The "6 / 3 / 6" stats row has no meaning.
  - It's yet another table.
- **References:** Facebook's "You're all done!" checklist ([▸][fb-done]); Nibble's 3 ticks ([▸][nibble]); Neo's "What's next?" ([▸][neo]).
- **Copy:** title "You're set." (duck allowed: celebration) / checklist:
  - "✓ 6 subscriptions on your list · $726 a year"
  - "✓ Reminders on Netflix, Prime and Spotify"
  - "○ 2 dates to check" (or "✓ All dates set")

  Then a short "**Your first reminders**" block: "Mon, Nov 16 · 9:00 — Netflix renews Thu, Nov 19." (one line per reminder, max 3) / CTA "Go to my list".
- **Notifications off:** the second line becomes "! Reminders are off" with a "Turn on" button that opens iPhone Settings. Never a grey paragraph.
- **Pro path:** add "✓ Ditch Pro trial on your list · reminders Nov 14 and Nov 16" (DECISIONS #15).
- **Layout:** SE: no duck. iPad: centred 480pt.
- **Why it converts:** a clear receipt builds trust ("it's working") and cuts first-week churn.

### 10 Home (first run)
- **Wrong now:** a "GUESS" chip on every row, and the banner says "6 dates are guesses". That reads as unreliable.
- **Change:** rows read "Thu, Nov 19" or "around Thu, Nov 19". The banner becomes "2 dates to check · Check" (Revolut-style plain rows, [▸][revolut]) and disappears at 0. Keep "Add price" and the bells.
- **Why it converts:** the first look at Home should say "under control", the feeling our user is buying.

## 4. Ideal order and flow

| # | Screen | Taps (typical) | Can skip? |
|---|---|---|---|
| 1 | Welcome | 1 | — |
| 2 | Quick guess | 1 | "No idea" |
| 3 | What do you pay for? (+ plan sheet) | 6–10 | "None of these" |
| 4 | Your total | 1 | — |
| 5 | Reminders pre-ask → iOS prompt | 2 | "Maybe later" |
| 6 | Charge dates (scan, or day per sub) | 1–7 | "Skip for now" |
| 7 | Paywall | 1 | × / "Continue free" |
| 8 | Which 3 (free only, sheet) | 1 | keeps the 3 biggest |
| 9 | You're set | 1 | — |
| 10 | Home | — | — |

```
Welcome ──► Quick guess ──► Tick what you pay ──► Your total ($726 a year,
   │            │                 │  └─ Change ▸ plan sheet         vs your guess)
   │            │                 └─ none ▸ skip to Reminders          │
   │            └─ "No idea" ok                                        ▼
   │                                              Reminders pre-ask ──► iOS prompt
   │                                                                   │ (Allow / Don't)
   │                                                                   ▼
   │                          Charge dates: [Scan Apple screenshot] or [day per sub] or Skip
   │                                                                   │
   │                                                                   ▼
   │                                       Paywall ──► Start trial ──► You're set (Pro)
   │                                          │                            │
   │                                          └─► Continue free ─► Which 3 sheet ─► You're set
   │                                                                                 │
   └──────────────────────────────────────────────────────────────────────────► Home
```

## 5. Sources

**Mobbin (iOS)**
- Orbit: [onboarding flow][orbit-flow] · [stat][orbit-stat] · [tick list][orbit-tick] · [total][orbit-total]
- Rocket Money: [overview][rm-overview] · [save $378][rm-378] · [bills list][rm-bills]
- Opal: [projection][opal-proj]
- [Cal AI flow][calai] · [Monarch flow][monarch]
- Copilot: [expected around][copilot]
- Cleo: [plan][cleo-plan] · [slider][cleo-slider] · [billing date][cleo-date]
- [Revolut][revolut] · [Substack sheet][substack] · [Saily sheet][saily] · [Apple Wallet][wallet] · [App Store reload][appstore] · [Shopee][shopee]
- [Strava][strava] · [Vocabulary][vocab] · [Zalando][zalando]
- [Bumble][bumble] · [Cosmos][cosmos] · [Tonal][tonal]
- [Facebook][fb-done] · [Nibble][nibble] · [Neo][neo] · [Fixtured][fixtured]

**AppKittie onboarding captures:** [Feenko 00–24][feenko], [Opal funnel 00–17][opal-ak]. Subtrack's (11 screens) had nothing new.

**Studies:** [C+R 2022][cr] · [Self Financial 2026][self] · [CNET 2025 via The Desk][cnet25] · [CNET 2026 via ABC7][cnet26] · [Chase 2021][chase] · [West Monroe 2021][wm] · [Bango 2022 via TV Tech][bango] · Airship opt-in benchmark via [MobiLoud][airship]

[orbit-flow]: https://mobbin.com/flows/340b7fb6-8b5d-416c-9f9f-501a27d669bc?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[orbit-stat]: https://mobbin.com/screens/0aefbc5b-663c-4384-9fae-7378badec476?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[orbit-tick]: https://mobbin.com/screens/592b68fc-549e-4df6-9d80-bc55b9914e1a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[orbit-total]: https://mobbin.com/screens/c49f7e84-d043-49a6-9b03-404e98ee6426?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[rm-overview]: https://mobbin.com/screens/301a0b9c-d67a-4a7b-b154-23a57f864940?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[rm-378]: https://mobbin.com/screens/a1255580-9eed-4fcd-883f-88633b5998d4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[rm-bills]: https://mobbin.com/screens/117ead1a-efe1-445f-8ec1-781907699330?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[opal-proj]: https://mobbin.com/screens/fc3f2fbd-6a46-4fbb-94ca-90aae5db1ec5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[calai]: https://mobbin.com/flows/05ca2ff4-106a-4fda-a0dd-3cc9b73a83c1?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[monarch]: https://mobbin.com/flows/337e1f92-cc63-4c7f-8516-4b462dbb891c?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[copilot]: https://mobbin.com/screens/9d35c12c-74aa-4aa7-b27c-b47c3d258d06?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[cleo-plan]: https://mobbin.com/screens/11d798f8-7610-4f9e-9501-54edde995aad?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[cleo-slider]: https://mobbin.com/screens/bb54e1b8-e2f5-4961-adbd-fbd0e26ec47c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[cleo-date]: https://mobbin.com/screens/eadb93e7-08fa-4c62-bc59-e865730dac0b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[revolut]: https://mobbin.com/screens/87422e20-8bd6-4ab7-a663-35776baff036?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[substack]: https://mobbin.com/screens/3f4dcd74-9b0f-4c34-b9ff-afc5c5702b98?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[saily]: https://mobbin.com/screens/70369d52-2993-419f-9f5d-0ff2c994576a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[wallet]: https://mobbin.com/screens/26161afc-b067-45fe-86d4-0188c949ff8f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[appstore]: https://mobbin.com/screens/fab54447-7e42-4132-a211-1e4e23b60f91?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[shopee]: https://mobbin.com/screens/fa318366-aa00-4bca-8f79-562c961cd53b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[strava]: https://mobbin.com/screens/c43f3937-d7e3-4af8-9a56-1bb85e63a06d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[vocab]: https://mobbin.com/screens/e992e0e3-bea7-4f37-b9bc-5dd096236d7d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[zalando]: https://mobbin.com/screens/112cf398-5569-4dbc-8a43-56d7572a39bf?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[bumble]: https://mobbin.com/screens/8ddc6fe1-1c3b-4976-a918-f8a763a6a2d4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[cosmos]: https://mobbin.com/screens/526d39a3-4416-4756-88df-5aedc49d8f99?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[tonal]: https://mobbin.com/screens/6ef5e1ef-5078-4260-9d07-5e2b7d502cf1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[fb-done]: https://mobbin.com/screens/8b544c5c-5f0d-484a-af0a-c9ce86684c07?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[nibble]: https://mobbin.com/screens/a7b69d8b-3203-4f94-b936-6682cbfa1572?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[neo]: https://mobbin.com/screens/f34404fe-d4ab-4b9e-a5fd-9b3ae10dfdc4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[fixtured]: https://mobbin.com/screens/0576cc85-bcfb-48ce-9115-cc4fbd774e02?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[feenko]: https://storage.appkittie.com/onboardings/com.app.fynk/00.jpg
[opal-ak]: https://storage.appkittie.com/funnels/funnel-bd279312bd23e6b27ff287b0/00.jpg
[cr]: https://www.crresearch.com/blog/subscription-service-statistics-and-costs/
[self]: https://www.self.inc/info/cost-of-unused-paid-subscriptions/
[cnet25]: https://thedesk.net/2025/05/cnet-subscription-survey-2025/
[cnet26]: https://abc7news.com/post/americans-wasting-money-unused-subscriptions-cnet-report-says-here-are-tips-how-manage/19552319/
[chase]: https://media.chase.com/news/survey-from-chase-reveals
[wm]: https://www.westmonroe.com/press-releases/americans-are-spending-more-on-subscriptions-and-are-less-aware-of-spending
[bango]: https://www.tvtechnology.com/news/oversubscribed-72-of-americans-say-there-are-too-many-subscription-services
[airship]: https://www.mobiloud.com/blog/push-notification-opt-in-rate

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
