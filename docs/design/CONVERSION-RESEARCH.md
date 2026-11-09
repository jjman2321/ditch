# Conversion research: onboarding and paywall

Written Nov 9, 2026. Research for `docs/design/ONBOARDING.md` and SPEC §3.1, §6, §7. It does not change any locked decision. Where it suggests something new, it says so.

**How to read the evidence:**
- Mobbin links go to screens and flows I actually looked at.
- Most paywall numbers come from vendors (RevenueCat, Adapty, Superwall) and are self-reported. Blinkist's numbers are Blinkist's own. Treat them as direction, not promises.
- "Ditch applies it" always means the honest version. Nothing here needs a fake number, a timer or a hidden button.

**Today's dates used in examples:** a user installs on Mon, Nov 9, 2026. The 7-day trial ends Mon, Nov 16. The reminder fires Sat, Nov 14 (2 days before).

---

## 0. Structure first (the founder's priority)

**Short answer:**
- Keep all 7 screens, in the order they're built.
- Merge nothing.
- Add one screen: a "You're in" screen after a purchase.
- Don't add a "personalising…", commitment or social-proof screen. The honest version of "personalising" goes inside the Reveal as motion (§0.5).
- Fix the paywall layout so the trial timeline shows without scrolling (§0.6).

### 0.1 What the data says about length
- **No good study links the number of screens to conversion.** The figures people quote are weak:
  - "Every step costs you about 20% of users" comes from one app in 2012 (Gabor Cselle, 2018 post).
  - It cuts both ways. Coconote went from about 5 screens to 13+ and trial conversion rose 16% (one vendor-reported case).
  - Superwall (Feb–May 2026, 40M+ paywall views): multi-page onboarding paywalls converted at 12.41% vs 9.07% for single-page ones.
  - Lazyweb (2026, 129 apps): the median onboarding is 11 screens. Health and fitness apps run to about 20.
- **What fits all of it:** screens that give something back (a result, a plan, a preview of your own stuff) cost little. Screens that only take (forms, accounts, surveys that change nothing) cost a lot.
- **The rule for Ditch:** every screen must either show users something about their own money, or collect something that changes what they see next.
- Our 5 steps plus the paywall all pass that test. That's short for the industry, and that's fine. Don't pad it to look like Noom.

### 0.2 Time to value
These are my estimates for someone with 8 subs. We have no analytics to measure them.

| Step | Time |
|---|---|
| Welcome | ~5s |
| Tick | 20–40s |
| Reveal | ~8s |
| Dates | ~2s per sub (~16s) |
| Reminders | ~8s |
| Paywall | 20–30s |

- **The first real value, their own yearly total, lands at about 35–55 seconds.** The whole flow takes about 1.5–2 minutes.
- **Compare:**
  - [Noom][f-noom-onb] asks 10+ questions and makes an account before showing its plan.
  - [Calm][f-calm] asks "How did you hear about Calm?" before the paywall.
  - [Orbit][f-orbit-onb] reaches the total in two taps, but then stops: no dates, no reminders, no ask.

### 0.3 Where top apps put the permission and the paywall
| App (Mobbin) | Notification ask | Paywall | What we learn |
|---|---|---|---|
| [Finch][f-finch] | Mid-onboarding. The mascot "sends" a preview. "Maybe later". | After setup | A preview with personality works mid-flow. |
| [Headspace][f-headspace] | **After the trial starts**: "Your 7 day trial has started. Get notifications about when your trial is about to end." "Remind me" / "Maybe later". | Timeline paywall, "You'll be charged on April 4" | The trial reminder is a strong reason to allow notifications. |
| Blinkist (case study) | After the trial starts, tied to the trial reminder. Opt-in went from 6% to 74%. | Timeline paywall | Same lesson, with numbers. |
| [Calm][f-calm] | On the paywall: "Remind me 2 days before renewal", plus "Enable notifications in Settings to receive your reminder before renewal. Open Settings." | End of onboarding | **Handles the "notifications are off" case on the paywall itself.** We should copy that. |
| [Duolingo][f-duolingo] | Mid-onboarding (widget ask, "Not now") | Later | Small asks fit mid-flow if each has a "not now". |
| [Orbit][f-orbit-onb] | None in onboarding | "Upgrade" button on Home | No ask at all leaves day-0 money on the table (tactic 1). |
| **Ditch (built)** | Before the paywall | Last step | **Right for us.** |

Why our order is right:
- Our reminders are the free product, not just a trial helper. So the ask belongs before the sales screen, not inside it.
- The paywall timeline promises a reminder, which needs permission first.
- **The gap:** when someone taps "Maybe later", the paywall still promises "We remind you". Fix it the Calm way (§0.6, change P5).

### 0.4 Progress bar, back and skip
- **Progress bar.** Conrad et al. (2010, *Interacting with Computers*) found that people quit more when a bar shows slow progress early. Fast early progress helped.
  - Ours shows 25% on the first real step. Good.
  - But on Dates, someone with 12 subs taps 12 cards while the bar sits still at 75%. That's slow progress in the middle of the flow.
  - **Fix:** fill the bar a little on each Dates card, from 50% toward 75%.
- **The paywall isn't in the bar** (built correctly). So "100%" honestly means "set-up is done". Keep it that way.
- **Back** is on every step and keeps what was entered (built). Keep it.
- **A way past every step:**
  - Tick: "Skip" and "Skip for now".
  - Dates: "Finish later" and "Not sure".
  - Reminders: "Maybe later".
  - Paywall: × and "Continue free".

  Keep all of them.

### 0.5 Verdict for each screen
| # | Screen (file) | Verdict | Why | Changes to the built screen |
|---|---|---|---|---|
| 1 | Welcome (`onboarding/index.tsx`) | **Stay** | One screen sets the promise and the "Free. No account." line. Every app on Mobbin has one ([Finch][f-finch], [Duolingo][f-duolingo], [Orbit][f-orbit-onb]). Merging it into Tick would make it a bare list with no "why". | None. Copy matches the picks in ONBOARDING.md. |
| 2 | Tick (`tick.tsx`) | **Stay** | This is where they give us their data and watch the total build. It works because they build it themselves (IKEA effect). | T1, T2 below. |
| 3 | Reveal (`reveal.tsx`) | **Stay, and it takes over the "personalising" job** | It's the "aha". It's also where an honest version of the "building your plan" moment fits (see the table below). | R1, R2. |
| 4 | Dates (`dates.tsx`) | **Stay** | Without dates, reminders can't fire and the next screen can't show real dates. One tap per sub is about as short as it gets. | D1. |
| 5 | Reminders (`reminders.tsx`) | **Stay, before the paywall** | See §0.3. | N1. |
| 6 | Paywall (`paywall.tsx`) | **Stay, as the last step** | Day 0 is where the money is (tactic 1). | P1–P10 (§0.6). |
| 7 | Pick 3 (`pick.tsx`) | **Stay** (only for free users with more than 3) | It keeps the free plan honest: they choose what gets reminders, and nothing is hidden. The copy is already good ("Everything stays on your list either way"). | None. |
| new | **"You're in" after a purchase** | **Add** | Blinkist added a welcome screen after the trial started and got its opt-in jump there. [Headspace][f-headspace] and [7-Eleven][s-7eleven] confirm the trial on its own screen. None of them show the end date. We can. | See §2.8. |

**Merges I considered and rejected:**
- *Welcome + Tick:* saves one tap but loses the promise line. No.
- *Reveal + Dates:* the reveal needs its own moment. Asking for dates in the same breath kills it. No.
- *Reminders inside the paywall* (Calm's toggle): reminders are free, so tying the ask to the sales screen would feel like reminders are a paid thing. No.
- *Pick 3 inside the paywall:* it would turn "Continue free" into a chore on the paywall. No.

**New screens I considered:**
| Candidate | Add it? | Why |
|---|---|---|
| "Personalising… / calculating…" loader | **No screen. Do it as motion inside the Reveal.** | The "labor illusion" is real: people value a result more when they see the work behind it (Buell & Norton, *Management Science*, 2011). But our sum is instant, so a fake wait is a lie, like Noom's "Cross-checking with User Database" ([flow][f-noom-plan]). **Honest version:** as the total counts up, the logos they ticked drop into it one by one (~1s total). That's the real work, shown. |
| Commitment step ("I promise…", "which will you ditch?") | **No, for v1** | No evidence for this kind of app. For us, the honest commitment is turning on reminders, which we already ask. Maybe later as a "Thinking of ditching?" card on Home. |
| Social-proof screen | **No** | We have nothing true to show at launch. |
| "How did you hear about us?" ([Calm][f-calm], [Noom][f-noom-plan]) | **No** | Ditch has no analytics, so the answer would never leave the phone. It's a screen that does nothing. |
| Account / sign-in | **No** | Locked. |
| Rating prompt | **No** | Too early, and Apple only allows the system prompt (5.6.1). |
| "You're in" after a purchase | **Yes** | See above. |

**Changes to the built onboarding screens:**
- **T1 (`tick.tsx`):** the search placeholder hard-codes "Search 45 services". Build it from `SERVICES.length`, so it stays true when the catalog grows.
- **T2 (`tick.tsx`):** the total in the bottom bar fades in on each change. Optional: roll the digits instead. That's polish, not conversion.
- **R1 (`reveal.tsx`):** the stat line has no source. Change it to: "In 2022, people guessed they spent $86 a month on subscriptions. It was really $219 (C+R Research)." SPEC §8 wants stats cited with their year; naming the source lets people check it. Dropping "You're not alone" makes it shorter.
- **R2 (`reveal.tsx`):** the labor-illusion motion above. Logos drop into the number during `useCountUp`. Reduce Motion: plain fade.
- **D1 (`dates.tsx`):** pass fractional progress to `OnboardingTopBar`, so the bar moves on every card. Example: step = 2 + (index / queue.length), with a total of 4.
  - I also considered stopping after the 3 biggest with "Keep going (5 left) / Finish later". **Rejected:** it nudges people toward free and adds a tap for everyone. "Finish later" at the top right already covers it.
- **N1 (`reminders.tsx`):** the preview must match what the real reminder will say. No reminder code exists yet. SPEC §5.3 says "Netflix renews in 3 days · $15.49". The preview currently says "$15.49. Keep it or ditch it?". Pick one wording and use it in both places. I like the preview's wording better (8/10 vs 7/10); if you agree, update SPEC §5.3.

### 0.6 Paywall structure
**One page or two:**
- Keep one page, as the last onboarding step.
- Superwall's multi-page result is real. But our Reveal and Reminders screens already do the warm-up a second page would do.
- Test two pages after launch (§4, test 4).

**What's built, top to bottom:**
× → "DITCH PRO" badge → headline → subhead → 4 benefits, two lines each → 3 plan cards → timeline (yearly only). Then a sticky footer: button, note, "Continue free", links.

**The problem:**
- The sticky footer is about 230pt tall.
- On a 6.1" iPhone, the two-line benefits push the timeline below the fold.
- On an iPhone SE, most of the plan cards are below the fold too.
- The timeline is our strongest honest asset (tactic 2). It shouldn't need a scroll.

**Fix:** keep the order, but shrink the benefits.
- Benefits first, before the plans, is right. Apple 3.1.2(c): "Before asking a customer to subscribe, you should clearly describe what the user will get for the price."
- Make each benefit one line (keep the titles, drop the second lines). That saves about 120pt.
- Check it on an iPhone SE and a 6.1" iPhone.

**Changes to `paywall.tsx`**, most important first:
| # | What | Now | Change to | Why |
|---|---|---|---|---|
| P1 | Price vs trial prominence | "7 days free" is a bold accent pill. The price "$29.99/yr" is a grey subhead. | Show "$29.99 a year" in the card's headline line. Make the trial pill neutral (outline, not filled accent). | **App Store risk.** Apple rejected an app in Aug 2026 under 3.1.2(c) for promoting the trial "more clearly and conspicuously than the billed amount". |
| P2 | Note under the button | Footnote size, tertiary grey: "$0 today. Then $29.99/yr from Mon, Nov 16. Cancel anytime." | Subhead size, secondary color. Two lines: "Then $29.99 a year from Mon, Nov 16." and "No need to cancel today. We'll remind you Sat, Nov 14." | Same 3.1.2(c) risk, plus tactic 3. |
| P3 | Headline with 3 or fewer subs | "Never get caught by a renewal." | "Add the rest from a screenshot." (8/10). Or "Reminders on everything, plus import and backup" (7.5). | It over-promises (we can't guarantee it, especially with reminders off). And with 3 or fewer, free already covers all their subs, so it pitches the wrong thing. |
| P4 | Yearly price line | "$29.99/yr · just $2.50/mo" | "$29.99 a year · about $2.50 a month" | "just" is a sales nudge, and the brand doesn't need it. |
| P5 | Timeline when reminders are off | Always "We remind you" | If permission isn't granted: "Turn on reminders so we can warn you", with an "Open Settings" link. | Otherwise the timeline makes a promise we can't keep. [Calm][f-calm] handles it the same way. |
| P6 | × size | 36pt circle, hitSlop 6 | 44pt circle, icon in `p.text`, not `textSecondary`. | Apple's minimum tap target. "Visible from the first frame" means full contrast. |
| P7 | "Continue free" button | `kind="plain"` | `kind="secondary"`, full width. | It's a real choice, so make it look like one (§2.6). |
| P8 | Terms / Privacy links | `onPress={() => {}}` | Real links before submitting. | 3.1.2 needs working links to the Terms of Use and Privacy Policy in the purchase flow. |
| P9 | Trial eligibility | `trialDays: 7` is hard-coded in `PLANS` | Read eligibility from RevenueCat when purchases go live. Hide the timeline and say "Subscribe for $29.99 a year" when not eligible. | Otherwise a returning user is shown a trial they won't get. |
| P10 | Lifetime note | Shown only when lifetime is selected | One line under the lifetime card, always visible (DECISIONS 6b says "under lifetime"). | It's a limit, so it shouldn't take a tap to find. 7/10 as built, 8/10 always shown. |

**Keep as built:**
- the × at the top right from the first frame,
- yearly pre-selected,
- the button changes per plan ("Subscribe for $4.99/mo", "Buy once for $49.99"),
- the timeline hides for monthly and lifetime,
- "How your free week works",
- the three timeline rows,
- "Save 50% vs monthly" (true),
- "Continue free: reminders for 3" leading to Pick 3,
- Restore in the footer.

---

## 1. Top 10 tactics, ranked by expected impact

### 1. Make the money on day 0, at the end of onboarding, after the user has seen value
- **What:** The paywall goes right after the reveal and the reminder setup, once. Not before the value, and not on every launch after.
- **Evidence:**
  - RevenueCat (2025 report): 82% of trial starts happen on install day.
  - Adapty (Nov 2026, 30,000+ apps): 93% of first purchases happen on install day. Onboarding paywalls convert at 0.85% per view vs 0.23% for later ones, and start 53% of all subscription revenue.
- **Mobbin:** [Orbit onboarding][f-orbit-onb] shows the total but never asks for money in onboarding (it puts "Upgrade" on Home). [Noom plan setup][f-noom-plan] asks right after "Based on your answers", but behind a fake timer (see §3).
- **Ditch:** Keep the order in ONBOARDING.md: Welcome → Tick → Reveal → Dates → Reminders → Paywall. Show the full paywall only once in onboarding. After that, show it only when the user taps something Pro (a 4th reminder, Import, Widget, Backup). No pop-up on launch.

### 2. A trial timeline with real dates, and Ditch puts the trial in the user's own list
- **What:** Three rows: Today → reminder day → charge day, with real weekday and date. Plus our twist: the trial shows up in their Ditch list with a reminder.
- **Evidence:**
  - Blinkist: the honest timeline plus a reminder raised trial sign-ups 23% and cut complaints 55%. Push opt-in went from 6% to 74%, because people wanted the reminder (Blinkist case study by Jaycee Day; RevenueCat Sub Club podcast).
  - Adapty (Nov 2026): a winning "trial explainer" test lifted results 12–36%. Only 24% of top iOS trial paywalls show a timeline, so it still stands out.
- **Mobbin:**
  - [Vocabulary][s-vocabulary] uses real dates ("Mar 26 – Trial reminder", "Mar 27 – Become member") and shows "Install the app" already crossed off, so the user feels one step in.
  - [Strava][s-strava] puts the exact charge in the timeline ("You'll be charged S$169.00") and repeats it under the button ("You won't be charged until Jul 1").
  - [5 Minute Journal][s-5mj] shows the trap to avoid: the rows say "In 2 Days / In 3 Days" but the icons say "Day 6 / Day 7" for a 3-day trial. Confusing.
  - [Nibble][s-nibble] and [Mesh][s-mesh] use "Day 5 / Day 10". Mesh also says what happens if you don't pay ("access to Mesh Personal features"), which matches our "drops back to 3 reminders".
- **Ditch:**
  - Today, Mon Nov 9: "Pro unlocked. $0 today."
  - Sat, Nov 14: "We remind you. 'Ditch Pro trial' is already in your list."
  - Mon, Nov 16: "$29.99 charged, unless you cancel before."
  - Draw the line between the rows once (about 0.6s) as the screen opens.
  - **New:** if the user said "Maybe later" to reminders, the middle row must not promise a push. Change it to "Sat, Nov 14: turn on reminders so we can warn you" with a "Turn on" link. Otherwise the timeline lies.

### 3. Tell people they don't need to cancel today
- **What:** One line next to the button that answers "will I forget?".
- **Evidence:**
  - Adapty (Nov 2026): 32% of trials are cancelled within an hour, 44% within 24 hours.
  - RevenueCat (2026 report): 55.4% of 3-day trial cancellations happen on day 0.
  - Blinkist found the same thing: people cancelled on day 1 so they wouldn't forget later. The reminder fixed it.
  - Most of these early cancels are people protecting themselves, not people who dislike the app. A reminder they trust removes the reason.
- **Mobbin:** [Jomo][s-jomo] puts "We'll notify you 24h before your trial ends!" under its button. [Copilot][s-copilot] says "Cancel anytime, for any reason."
- **Ditch:** Under the button: "No need to cancel today. We'll remind you Sat, Nov 14." Then show it again on the post-purchase screen (see §2.8). We can say it because we really do it.

### 4. Build the paywall from their own list
- **What:** Use their number of subs, their logos and what free does and doesn't cover.
- **Evidence:**
  - Adapty (Nov 2026): onboarding personalization tests that won lifted results 13–35%. Only 2% of top paywall headlines are personalized.
  - Superwall case study (JourneyStamp, 2026, vendor-reported): personalized paywalls raised conversion 50%.
- **Mobbin:**
  - [Finch][f-finch] ends onboarding with "Sam Lee's starter plan", built from the answers.
  - [Cleo][s-cleo] puts a small "Based on your answers" badge under the score.
  - [Tide Guide][s-tide-guide] and [Fixtured][s-fixtured] use a plain Free vs Pro table.
- **Ditch:**
  - Headline (locked): "Get a heads-up before all 8 renewals."
  - Under it, a row of their logos: the 3 biggest marked "Free", the rest marked "Pro". Small text: "Free covers 3 of your 8. Pro covers all 8."
  - Then the 4 benefit rows. No made-up features.

### 5. Make the reveal the "wow", and show where the number came from
- **What:** Count up to their real yearly total, then show the inputs: how many subs, the monthly figure, the 3 biggest.
- **Evidence:**
  - C+R Research (2022): people guessed they spent $86 a month on subscriptions. The real figure was $219. The surprise is real and common, so we don't need to fake it.
  - This is the "personalized result" step that health apps build with quizzes. We get it from real data instead.
- **Mobbin:**
  - [Me+][s-meplus] shows a big number ("73oz") with every input listed and tappable underneath. The user can see and fix how it was made.
  - [Lovi][s-lovi] uses one huge number and one line.
  - [Breathwrk][s-breathwrk] shows a score, then says "We'll show you what this means after sign up". That holds the result back; we won't.
- **Ditch:** Big "$1,284" counts up over about 1s and lands with a light haptic. Under it: "about $107 a month across 8 subscriptions". Then the 3 biggest with logos. Then one sourced line (C+R 2022). "about" stays until prices are confirmed.

### 6. Pre-select yearly and make it the biggest card, but keep the real price prominent
- **What:** Yearly is pre-selected and visually first. Monthly and lifetime are visible but smaller. The billed amount ($29.99/yr) is at least as visible as "7 days free".
- **Evidence:**
  - Adapty (Nov 2026): 67% of top iOS paywalls pre-select annual (78% of trial paywalls). Winning "annual-forward" layouts lifted revenue per user 25–40%.
  - RevenueCat, Dark Noise test (Charlie Chapman, 2024): showing all 3 plans as equals raised conversions about 10%, but yearly fell 30%, monthly rose 242% and churn rose 57%.
  - **App Store risk (3.1.2(c)):** an Aug 2026 rejection said the app "promotes the free trial… more clearly and conspicuously than the billed amount" (Apple Developer Forums).
- **Mobbin:**
  - [Copilot][s-copilot]: one pre-selected plan card, "Then $95 per year" right in the card.
  - [Everyday Rewards][s-everyday] states savings in dollars: "By paying annually you pay $14 less."
  - [Lifesum][s-lifesum] pre-selects monthly and crosses out prices. Don't copy it.
- **Ditch:**
  - Yearly card: "Yearly · $29.99 a year" big; "7 days free · about $2.50 a month" smaller; badge "Save 50%". True: 12 × $4.99 = $59.88.
  - Never show "$2.50/mo" bigger than "$29.99/yr".
  - Monthly and lifetime are one line each, below.

### 7. Lifetime as a small, honest third option
- **What:** A one-line lifetime option, for people who hate subscriptions. In a subscription tracker, that's a lot of our users.
- **Evidence:**
  - Adapty (Nov 2026): a winning "lifetime next to annual" test added 10–15% revenue. Only 14% of apps offer lifetime. It's usually priced at 1.3× annual; ours is 1.67× ($49.99 vs $29.99), which nudges people to yearly.
  - Dark Noise (2024): when lifetime was shown up front, lifetime purchases rose 266%.
  - Our own review research (DECISIONS): Bobby and Orbit users praise one-time prices.
- **Mobbin:** [one year][s-oneyear] offers only monthly and lifetime under a signed founders' note. [Tide Guide's Pro settings][f-tideguide-sub] offer "Buy Lifetime" to people already on yearly. [Moonly][s-moonly-plans] shows what not to do: lifetime under a pre-selected weekly plan.
- **Ditch:** "Lifetime · $49.99 once". Under it, always visible, the locked text: "Everything in Pro, forever. Bank sync, if we add it, is a separate plan because it costs us money every month." When lifetime is selected, the button says "Buy lifetime for $49.99" and the trial timeline hides.

### 8. Ask for reminders with a preview built from their own subs
- **What:** Before the iOS prompt, show 2 example notifications using their real subs and dates, then "Turn on reminders" / "Maybe later".
- **Evidence:**
  - Apple's notification docs say to ask in context, at the moment people can see why.
  - Blinkist's push opt-in went from 6% to 74% once the notification was tied to something users wanted (the trial reminder).
  - Reminders are the product (Bobby's #1 complaint is reminders that don't fire). Every "Don't Allow" weakens free and Pro.
- **Mobbin:**
  - [Atoms][s-atoms] previews the user's own habit text ("Time to Meditate") with "Maybe later".
  - [Finch][f-finch] has the mascot "send" the notification ("From Lee: Remember to drink water!").
  - [Expedia][s-expedia] puts an example banner on a phone outline.
  - [Attio][s-attio] uses a generic bell, which says nothing. [Asana][s-asana] gives no way out.
- **Ditch:** Phone outline, 2 banners drop in one after the other: "Netflix renews in 3 days · $15.49" and "Spotify renews tomorrow · $11.99". Body: "3 days and 1 day before, at 9am. Change it anytime." Buttons: "Turn on reminders" and "Maybe later".

### 9. A live running total while they tick
- **What:** The bottom bar updates on every tick: "6 ticked · about $1,240 a year".
- **Evidence:**
  - No paywall vendor has published a number for this. The case rests on the "IKEA effect": people value what they built themselves more (Norton, Mochon & Ariely, 2012).
  - The total also sets up the reveal: they watch it grow, then see it big.
  - Orbit, our closest competitor, has no running total.
- **Mobbin:**
  - [Orbit tick list][s-orbit-tick]: logos and prices, but only "See my yearly total" at the bottom.
  - [Uber Eats][s-ubereats] puts the live total in the button ("Done • $15.62").
  - [Shopee][s-shopee] puts "Subtotal" on the left and the button on the right.
  - [Instacart][s-instacart] has a search field plus chips above the list.
- **Ditch:** Shopee layout: total on the left, "Next" on the right. The number rolls digit by digit (about 0.3s) on each tick, with a light haptic.

### 10. Honest social proof: a sourced stat and a founder note now, real ratings later
- **What:** We have no reviews at launch. Use what's true.
- **Evidence:**
  - Adapty (Nov 2026): when social proof tests win, conversion rises 10–30%. Only 27% of top paywalls use it.
  - Apple 5.6.3 bans manipulating reviews and ratings. 5.6.1 bans custom review prompts.
- **Mobbin:**
  - [Halide][s-halide]: "Every purchase supports Ben, the developer of Halide, and his family" plus "Why is Halide not free?".
  - [Gentler Streak][s-gentler] thanks buyers and says subscriptions are their "sole source of income".
  - [Fixtured][s-fixtured] shows one real review with a username.
  - [Moonly][s-moonly-proof] shows "10 million souls" and press logos. We can't say anything like that, so we don't.
- **Ditch:**
  - **At launch:** one small line on the paywall: "Made by one person, a med student. No ads, no data sold." Only if every word is true; the owner fills it in.
  - **Later:** once the US App Store rating is real (say 4.5★ from 50+ ratings), show "4.6★ on the App Store" with the actual number, updated with each release.
  - Ask for ratings only with Apple's system prompt, after a "Ditched!" moment. Never in onboarding.

---

## 2. Screen-by-screen recommendations

Scores are out of 10. ★ = pick. Locked copy from DECISIONS is marked (locked).

### 2.1 Welcome
**Layout**
- Raccoon fills the top half.
- Headline, one line of body, then "Get started" at the bottom.
- Small print under the button.
- No skip, no login, no Restore here (no account, nothing to restore yet).

**Copy: headline**
| Option | Score | Note |
|---|---|---|
| ★ "Ditch it before it renews." | 8.5 | Same as the App Store subtitle. Says the job. |
| "Stop paying for stuff you forgot about." | 8 | Punchy, a bit negative. |
| "See what you really pay for." | 7 | Clear, but doesn't mention reminders. |

- Body: "Track every subscription, get a heads-up before each charge, and cancel what you don't use."
- Small print: "Free. No account. Your list stays on your phone."

**Motion**
- The raccoon flicks one card into the bin once (about 1.2s). A light haptic when it lands.
- Then the raccoon blinks every few seconds. No loop of the throw.
- Reduce Motion: a still raccoon next to a closed bin.

**Don't**
- Don't say "find your subscriptions". [Orbit's welcome][f-orbit-onb] says it, and we don't detect anything.
- No carousel of 3–4 feature slides. One screen is enough.
- No mascot speech bubble wall like [Duolingo][f-duolingo]. That suits a daily-habit app, not a calm tracker.

### 2.2 Tick everything you pay for
**Layout**
- Title at the top, then a search field, then category chips (like [Instacart][s-instacart]).
- Rows: logo, name, "about $15.49/mo", and a big tick circle on the right (like [Orbit][s-orbit-tick], but the whole row is the tap target).
- The bottom bar sticks: running total on the left, "Next" on the right (like [Shopee][s-shopee]).
- Progress bar at the top (screen 1 of 4).
- "Skip" at the top right.

**Copy: title**
| Option | Score | Note |
|---|---|---|
| ★ "Tick everything you pay for" | 8 | A plain instruction. |
| "What do you pay for?" | 7.5 | Friendly, less clear about the action. |
| "Let's find your subs" | 5 | "Find" suggests auto-detection. |

- Subtitle: "Typical US prices. You can fix any of them later."

**Copy: bottom bar**
| Option | Score | Note |
|---|---|---|
| ★ "6 ticked · about $1,240 a year" | 8.5 | Yearly builds toward the reveal. |
| "6 ticked · about $103 a month" | 7 | Smaller number, less punch. |
| "$1,240/yr" | 6 | Too bare. |

**Motion**
- Tick: the circle fills with a small spring (about 0.2s), plus a light "selection" haptic.
- The total rolls digit by digit. Don't animate the whole bar.
- On untick, the number rolls back down. Same speed, no "sad" effect.

**Don't**
- Don't pre-tick popular services to inflate the total.
- Don't hide the "Skip" or make "Next" grey and dead with 0 ticked. Change it to "Skip for now".
- Don't show a "you could save $X" figure here. We don't know what they'll ditch.

### 2.3 Reveal: "That's $X a year."
**Layout**
- The big number in the centre.
- One line under it with the monthly figure and the count.
- The 3 biggest as compact rows.
- One sourced stat line.
- The raccoon peeks from the bin at the bottom corner, away from the button.
- The "Let's fix that" button.

**Copy: headline**
| Option | Score | Note |
|---|---|---|
| ★ "That's about $1,284 a year. Ditch it." | 8.5 | Brand verb, honest "about". |
| "You pay about $1,284 a year for these 8." | 7.5 | Clear, flatter. |
| "$1,284 a year. Surprised?" | 5 | Assumes a feeling. |

**Copy: under the number**
| Option | Score | Note |
|---|---|---|
| ★ "About $107 a month across 8 subscriptions." | 8 | Gives the inputs (the [Me+][s-meplus] idea). |
| "Based on what you ticked." | 7 | Good as a small badge (like [Cleo][s-cleo]), weak as a line. |

**Copy: button**
| Option | Score | Note |
|---|---|---|
| ★ "Let's fix that" | 8 | Warm, moves forward. |
| "Set up reminders" | 7.5 | Literal and true. A fine fallback. |
| "Next" | 5 | Wastes the moment. |

- Stat line: "In 2022, people guessed they spent $86 a month. It was really $219." (C+R Research)

**Motion**
- The number counts up over about 1s with ease-out and lands with a "success" haptic.
- The 3 biggest rows slide in one after another, 80ms apart, after the number lands.
- The raccoon pops up from the bin last.
- Reduce Motion: everything fades in, no count.

**Don't**
- No "Analysing…" or "Calculating your results" loading screen. [Noom][f-noom-plan] shows "Cross-checking with User Database..". It's a sum of the rows; showing fake work is a lie.
- Don't compare them with a made-up "average user" bar like [QUITTR][s-quittr-reveal].
- Don't hold the number back until after the paywall like [Breathwrk][s-breathwrk].
- Don't add currencies together. Show one line per currency.

### 2.4 Dates: "When does each one charge?"
**Layout**
- One card per sub, biggest first.
- Each card: logo + name, then a day grid 1–31. One tap saves and slides to the next card.
- "Not sure" on each card. "Finish later" at the top right.
- Progress: "3 of 8".

**Copy: card title**
| Option | Score | Note |
|---|---|---|
| ★ "When does Netflix charge?" | 8.5 | Uses their sub; one question at a time. |
| "When does each one charge?" | 7.5 | Good as the screen title above the first card. |
| "Set your billing dates" | 6 | Sounds like a form. |

- Helper: "Check your bank app or the receipt email. Not sure? Skip it."

**Motion**
- After a tap, the day pops, then the card slides left (about 0.25s) and the next one slides in.
- Light haptic on each tap.

**Don't**
- Don't guess dates for them. A reminder on the wrong day is worse than none.
- Don't block "Next" until all dates are filled.

### 2.5 Reminders pre-prompt
**Layout**
- Phone outline at the top, with 2 banners built from their data.
- Headline, one line of body.
- "Turn on reminders" button, then "Maybe later" text button under it.

**Copy: headline**
| Option | Score | Note |
|---|---|---|
| ★ "We'll warn you before it charges" | 8.5 | Concrete and human. |
| "Get a heads-up before you're charged" | 8 | Close second. |
| "Never miss a renewal" | 5 | Every app says it. |

**Copy: main button**
| Option | Score | Note |
|---|---|---|
| ★ "Turn on reminders" | 8 | Says what it does. |
| "Continue" | 6 | Safest by the letter of Apple's pre-alert rules, but vague. |
| "Allow notifications" | 4 | Copies the system "Allow" button, which Apple calls manipulative. |

**App Store note**
- Apple's HIG says a custom screen before a permission alert should have one button and no cancel. That rule lists camera, microphone, location, contacts, calendar and tracking. It does not list notifications.
- Many reviewed apps use "Maybe later" on notification pre-prompts ([Atoms][s-atoms], [Finch][f-finch], [Expedia][s-expedia]). Risk is low.
- Keep it low:
  - never use "Allow" on our button,
  - never draw a fake iOS alert like [Saturn][s-saturn],
  - never offer a reward for saying yes,
  - keep the app fully working if they say no (5.1.1(iv)).

**Motion**
- The banners drop in from the top like real ones (spring, 0.4s apart). A soft "tick" haptic on each.
- Nothing else moves.

**Don't**
- Don't ask again on the next launch. Show "Reminders are off" on Home with a fix button. That's it.
- No "provisional" (quiet) notifications. Reminders that land silently in Notification Center miss the whole point.

### 2.6 Paywall
**Layout, top to bottom**
1. × at the top right (as built and as in ONBOARDING.md), visible from the first frame, full contrast. "Restore" stays in the footer.
2. Raccoon, small, holding a bell. Not a hero image.
3. Headline (personalized), then the logo row: their 3 biggest marked "Free", the rest "Pro".
4. 4 benefit rows, one line each.
5. Plans: Yearly (big, pre-selected), Monthly, Lifetime (one line each).
6. Trial timeline (yearly only).
7. Main button, with the price line and the reassurance line right under it.
8. "Continue free: reminders for 3" as a full-width secondary button. Not a grey text link.
9. Footer: Terms · Privacy · "Cancel anytime in Settings → Apple ID → Subscriptions".

On small iPhones this scrolls. The button area stays pinned at the bottom.

**Copy: headline**
| Situation | Option | Score |
|---|---|---|
| More than 3 ticked | ★ "Get a heads-up before all 8 renewals." (locked) | 9 |
| 3 or fewer ticked | "Ditch Pro" (ONBOARDING.md plan) | 6 |
| 3 or fewer ticked | "Never get caught by a renewal." (built now) | 4: over-promises |
| 3 or fewer ticked | ★ **New suggestion:** "Add the rest from a screenshot." | 8 |
| 3 or fewer ticked | "Reminders on everything, plus import and backup" | 7.5 |

Why the new one: with 3 or fewer, free already covers what they ticked. The honest pitch is "you probably have more", and import is the Pro feature that adds them. It's the owner's call.

**Copy: benefit rows**
- "Reminders on every subscription, with your own timing"
- "Add subscriptions from a screenshot or bank statement"
- "Home-screen widget with your next charge"
- "Backup to your own iCloud"

**Copy: yearly badge**
| Option | Score | Note |
|---|---|---|
| ★ "Save 50%" | 8 | True vs $59.88 a year on monthly. |
| "Best value" | 7 | True, vaguer. |
| "Most popular" | 2 | We can't know this at launch. False until data says so. |

**Copy: main button**
| Option | Score | Note |
|---|---|---|
| ★ "Start 7-day free trial" | 8.5 | The words people expect. Adapty: 36% of top paywalls use "Start free trial". |
| "Try Pro free for 7 days" | 8 | Fine alternative. |
| "Continue" | 5 | Hides what happens. |

**Lines under the button** (body size, not tiny, for 3.1.2(c)):
- "Then $29.99 a year from Mon, Nov 16."
- "No need to cancel today. We'll remind you Sat, Nov 14."

**Button and timeline by plan**
| Selected plan | Main button | Under the button | Timeline |
|---|---|---|---|
| Yearly, trial eligible | "Start 7-day free trial" | "Then $29.99 a year from Mon, Nov 16." | Shown |
| Yearly, not eligible | "Subscribe for $29.99 a year" | "Renews yearly. Cancel anytime." | Hidden |
| Monthly | "Subscribe for $4.99 a month" | "Renews monthly. Cancel anytime." | Hidden |
| Lifetime | "Buy lifetime for $49.99" | "One payment. No renewal." | Hidden |

**Copy: timeline**
- Today, Mon Nov 9: "Pro unlocked. $0 today."
- Sat, Nov 14: "We remind you. 'Ditch Pro trial' is already in your list."
- Mon, Nov 16: "$29.99 charged, unless you cancel before."
- Small print: "Cancel at least 24 hours before to avoid the charge." This is Apple's renewal rule, and the reminder on the 14th leaves room for it.
- If reminders are off, the middle row becomes "Turn on reminders so we can warn you" (see tactic 2).

**Motion**
- The timeline line draws from Today to the charge day once (about 0.6s).
- Selecting a plan: the card border and tick move with a short spring, plus a selection haptic.
- The raccoon is still, or blinks once. **Nothing moves near the price.**
- No shimmer on the button, no pulsing, no confetti.

**Don't**
- No countdown, no "offer ends", no strike-through, no weekly plan, no trial toggle, no faded or delayed ×. See §3.
- Don't make "Continue free" a tiny grey link. It's a real choice, so make it a real button.
- Don't show the paywall a second time if they close it. No "wait, here's 50% off".

### 2.7 Pick 3 (free users with more than 3 subs)
**Layout**
- Bottom sheet with their list. The 3 biggest yearly ones are pre-ticked.
- Counter "3 of 3" at the top. "Done" at the bottom.

**Copy: title**
| Option | Score | Note |
|---|---|---|
| ★ "Pick 3 for reminders" | 8.5 | Plain. |
| "Which 3 should we watch?" | 7.5 | Warmer, slightly cute. |

- Subtitle: "We picked your 3 biggest. Swap any, anytime. Free."

**Motion**
- Ticking a 4th makes the counter shake gently once, then asks which one to swap. No error red.

**Don't**
- No upsell inside this sheet. They just said "free". Respect it.
- Don't make the unpicked subs look locked or greyed in the list. They're tracked; they just don't get pushes.

### 2.8 After purchase: "You're all set"
**What the references do**
- [7-Eleven][s-7eleven]: "Welcome to your 30-day free trial… Your benefits are active."
- [Gentler Streak][s-gentler]: the mascot plus a thank-you that says the money pays for the app.
- [X][s-x] and [Deezer][s-deezer]: generic "Welcome to Premium" / "Congratulations".
- [Headway][s-headway]: "together with 1.7M+ learners".
- **None of them show the trial-end date or what happens next.** That's our gap to fill.

**Layout**
- Raccoon gives a thumbs up, or tucks a card into its pocket.
- Headline.
- A real preview of the new row in their list.
- One main button, plus one optional secondary.

**Copy: headline**
| Option | Score | Note |
|---|---|---|
| ★ "Pro is on. Your trial is in your list." | 8.5 | Says the two facts that matter. |
| "You're all set." | 7 | Fine, but says nothing. |
| "Welcome to Ditch Pro!" | 6 | Generic. |

**Row preview**
- "Ditch Pro trial · $29.99 on Mon, Nov 16 · reminder Sat, Nov 14"

**Body**
| Option | Score | Note |
|---|---|---|
| ★ "All 8 now get reminders. We'll warn you about this one too." | 8.5 | Honest, a little wry. |
| "Thanks for backing a one-person app." | 7.5 | True and warm. Add it only if the owner wants it. |

**Buttons**
- Main: "Go to my list".
- Secondary: "Got more? Add them from a screenshot." This gets them to use a Pro feature on day 0, which gives them a reason to keep it.

**Lifetime buyers**
- Headline: "Pro is yours for good."
- No trial row.

**Motion**
- The trial row slides into a mini list with a soft highlight that fades over 1s. One "success" haptic.
- No confetti. Save the big celebration for "Ditched!", where the user actually saved money.

**Don't**
- Don't push a rating request here. They haven't used Pro yet.

### 2.9 Home, first visit
- One toast that fades on its own: "All set. Next up: Netflix on Thu."
- No coach marks or tours.
- If there are subs without dates, show an "Add dates" card. If reminders are off, show a "Reminders are off" card with a fix button.

---

## 3. Tactics we reject

| Tactic | Seen in | Why we reject it |
|---|---|---|
| Countdown timers / "plan reserved for 15 minutes" | [Noom plan setup][f-noom-plan] ("Expires in 14:59") | Fake urgency. The FTC's 2022 dark patterns report names countdown timers that aren't tied to a real deadline. Apple 5.6 bans "manipulative practices". It breaks our brand. |
| Fake "analysing" / "building your plan" loaders | [Noom][f-noom-plan] ("Cross-checking with User Database") | Our total is a sum. Pretending it takes work is a lie, even if it's a small one. |
| Weekly plan | [Moonly][s-moonly-plans] (weekly pre-selected) | Adapty (2026): 90% of buyers keep a pre-selected weekly plan, and weekly brings 62% of revenue in their data. It works by being expensive per year (about 9× annual). Locked out by DECISIONS. |
| Free-trial toggle | [pushr][s-pushr] ("activate free trial") | Apple started rejecting trial toggles under 3.1.2 in Jan 2026 as "confusing and misleading" (RevenueCat, Adapty). Locked out anyway. |
| Strike-through "was" prices and fake % off | [Lifesum][s-lifesum] ("50% off", crossed-out prices), [Skip][s-skip] ("~~$9.99 per month~~") | Our prices never were higher. Apple 5.6: don't "trick them into making unwanted purchases". Our only true saving is yearly vs monthly (50%), and we say it plainly. |
| Exit offer / second-chance discount after × | Adapty says 4% of apps do it | It teaches people to close the paywall to get a deal. It hurts trust and revenue: Adapty's data shows discounts over 60% earn 46% of full-price revenue over six months. Closing means closing. |
| Hidden, faded or late close button | [Moonly][s-moonly-plans] (faint ×), [TIDE][s-tide] (faint ×), [Jomo][s-jomo] (faint "Later"), [Cal AI][s-calai] (back arrow only) | Locked rule: × at full contrast from the first frame. |
| "Claim your offer now" language | [QUITTR][s-quittr-paywall] ("CLAIM YOUR OFFER NOW", "SAVE 80%") | There is no special offer. Calling the normal price an "offer" is a nudge built on a false idea. |
| Hard paywall | [Cal AI][s-calai] | RevenueCat (2026): hard paywalls convert about 5× better (10.7% vs 2.1%). But our free tier is locked, and 3.1.2(a) bans bait-and-switch after showing their total. Our review research showed hard paywalls get "scam" reviews. |
| Holding the result back until sign-up or purchase | [Breathwrk][s-breathwrk] ("after sign up") | The reveal is free and stays free. |
| Comparing them with a made-up "average" | [QUITTR reveal][s-quittr-reveal] | We have no data on other users and no analytics. Only cite published, dated stats (C+R 2022). |
| Big unverifiable social proof | [Moonly][s-moonly-proof] ("10 million souls", press logos) | We have nothing like that. Apple 5.6.3 bans manipulating reviews. Use real numbers only, when they exist. |
| Custom screen that looks like the iOS alert | [Saturn Calendar][s-saturn] | Apple's HIG names "displaying a screen or window that looks like a request" and images of the alert as rejection causes. |
| "Allow" on our pre-prompt button, or rewards for allowing | — | Apple's HIG: don't use "Allow" or similar on a pre-alert screen, and don't offer rewards for permission. |
| Custom rating prompt / "rate us 5★" screen in onboarding | — | Apple 5.6.1 allows only the system rating API. |
| "Most popular" badge at launch | — | We can't back it until the data says so. |
| Promising what we don't do | Orbit welcome ("Find your subscriptions") | Banned claims in SPEC §8: "we cancel for you", auto-detection, "nothing leaves your phone", "all future features included". |

---

## 4. What to A/B test later (RevenueCat Experiments, after launch)

**First, the rules:**
- Change one thing at a time.
- Judge on revenue per install after 30+ days, not on trial starts. Superwall warns that a variant can win on trial starts and lose on revenue.
- Adapty suggests about 200 subscriptions per variant before you trust a result. At indie scale, one test may take a couple of months.
- Ditch has no analytics, so RevenueCat sees purchases only. It can't show which onboarding screen people drop at.

| # | Test | Why | Evidence |
|---|---|---|---|
| 1 | **Trial length: 7 vs 14 days** on yearly | Longer trials convert better to paid. It also gives the reminder more time to prove itself. | RevenueCat 2025: 17–32-day trials convert at a 45.7% median vs 26.8% for shorter ones. Adapty 2026: 7 days beats 3 for annual plans. |
| 2 | **Plans: all 3 visible vs yearly + "Other plans"** | Showing all plans can raise sales but shift people to monthly, which churns more. | Dark Noise (RevenueCat, 2024): annual −30%, monthly +242%, churn +57%. |
| 3 | **Lifetime price: $49.99 vs $39.99** | DECISIONS #12 already plans this. Check whether a cheaper lifetime steals yearly buyers. | Adapty 2026: typical lifetime is 1.3× annual (about $39). |
| 4 | **Paywall: one page vs two** (page 1: timeline and their logos; page 2: plans) | Our onboarding already warms people up, so a second page may not add anything. Test it rather than guess. Ship the logo row without testing; the evidence for personalization is good enough. | Superwall (Feb–May 2026): multi-page onboarding paywalls converted at 12.41% vs 9.07%. Adapty 2026: winning personalization tests lifted 13–35%. |
| 5 | **Proof line: founder note vs real App Store rating** (once there are 50+ real ratings) | See which honest proof works better. | Adapty 2026: winning social proof tests lifted conversion 10–30%. |

---

## 5. References

### Mobbin screens and flows (all looked at)
**Subscription trackers**
- [Orbit: onboarding flow][f-orbit-onb]
- [Orbit: tick list ("See my yearly total")][s-orbit-tick]
- [Orbit: "Get started" import guide flow][f-orbit-getstarted]
- [Tide Guide: Pro settings (renewal date, Buy Lifetime, Manage Subscription)][f-tideguide-sub]

**Onboarding flows**
- [Noom: personalized plan setup (fake loader, "Based on your answers", 15-minute timer)][f-noom-plan]
- [Noom: behavioral profile quiz][f-noom-quiz]
- [Noom: weight loss profile][f-noom-profile]
- [Noom: onboarding / sign-up][f-noom-onb]
- [Finch: onboarding (mascot notification pre-prompt, starter plan)][f-finch]
- [Finch: setting up goals][f-finch-goals]
- [Duolingo: onboarding (progress bar, widget "Not now")][f-duolingo]
- [Calm: onboarding ("How did you hear about Calm?", paywall with "Remind me 2 days before renewal" and "Enable notifications in Settings")][f-calm]
- [Headspace: subscribing ("How your trial works", "You'll be charged on April 4", then "Your 7 day trial has started… Remind me / Maybe later")][f-headspace]

**Reveal screens**
- [Breathwrk: score, result held back until sign-up][s-breathwrk]
- [QUITTR: "Analysis complete" vs "average"][s-quittr-reveal]
- [Cal AI: BMI result][s-calai-bmi]
- [Lovi: big-number result][s-lovi]
- [Cleo: score with "Based on your answers" badge][s-cleo]
- [Ahead: test result][s-ahead]
- [Me+: number with editable inputs][s-meplus]

**Lists with running totals**
- [Uber Eats: "Done • $15.62"][s-ubereats]
- [Fiverr: extras with total in the button][s-fiverr]
- [Shopee: subtotal + confirm bar][s-shopee]
- [Instacart: search + chips][s-instacart]
- [Bolt Food: add-ons with total][s-bolt]

**Notification pre-prompts**
- [Atoms: preview with the user's own habit][s-atoms]
- [Attio: generic][s-attio]
- [Particle: card + "No Thanks"][s-particle]
- [Expedia: phone mock + example][s-expedia]
- [Asana: no way out][s-asana]
- [Saturn Calendar: fake system-style alert][s-saturn]

**Trial timelines**
- [5 Minute Journal][s-5mj]
- [Vocabulary: real dates][s-vocabulary]
- [Nibble][s-nibble]
- [Mesh][s-mesh]
- [Copilot: Skip + Restore][s-copilot]
- [foodpanda][s-foodpanda]
- [Strava: charge date under the button][s-strava]

**Plan pickers**
- [one year: founders' note, monthly + lifetime][s-oneyear]
- [Feeld][s-feeld]
- [CapCut][s-capcut]
- [Lifesum: strike-throughs][s-lifesum]
- [Kit: "Your first charge will be after…"][s-kit]
- [Moonly: weekly pre-selected, lifetime][s-moonly-plans]
- [Everyday Rewards: "you pay $14 less"][s-everyday]

**Free option and benefits**
- [Skip: strike-through][s-skip]
- [The New Yorker][s-newyorker]
- [Halide: founder note, "Why is Halide not free?"][s-halide]
- [Cal AI: hard paywall][s-calai]
- [Tide Guide: Free vs Pro table + Skip][s-tide-guide]
- [Fixtured: Free vs Plus + real review][s-fixtured]

**Social proof**
- [QUITTR: "Claim your offer now"][s-quittr-paywall]
- [Jomo: "We'll notify you 24h before"][s-jomo]
- [Moonly: "10 million souls"][s-moonly-proof]
- [pushr: trial toggle][s-pushr]
- [Lifesum: review + 50% off][s-lifesum2]
- [TIDE: faint ×][s-tide]

**Post-purchase**
- [X][s-x]
- [Deezer][s-deezer]
- [Headway][s-headway]
- [Gentler Streak][s-gentler]
- [7-Eleven][s-7eleven]
- [DailyArt][s-dailyart]

### Web sources
**Subscription data**
- RevenueCat, *State of Subscription Apps 2026* summary (2026): https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026
- RevenueCat, *State of Subscription Apps 2025* (82% of trial starts on day 0; trial length): https://www.revenuecat.com/state-of-subscription-apps-2025
- Adapty, "The tests subscription apps skip" (*State of Paywalls 2026*; published Nov 1, 2026): https://adapty.io/blog/paywall-optimization-tests/
- Superwall, onboarding flow optimization (multi-page paywalls 12.41% vs 9.07%, Feb–May 2026): https://superwall.com/solutions/onboarding-flow-optimization
- Superwall, JourneyStamp case study (2026, vendor-reported; read via search summary): https://superwall.com/case-studies/journeystamp
- Charlie Chapman, RevenueCat, Dark Noise plan test (2024, updated 2025): https://www.revenuecat.com/blog/engineering/how-i-successfully-migrated-my-indie-app-to-revenuecat-paywalls

**Blinkist**
- Jaycee Day, Blinkist case study, UX Planet (+23% trial sign-ups, −55% complaints, opt-in 6%→74%; blocked for me, figures via search summaries): https://uxplanet.org/how-solving-our-biggest-customer-complaint-at-blinkist-led-to-a-23-increase-in-conversion-b60ad514134b
- Sub Club podcast, "How Ethical Design at Blinkist Led to 23% Growth": https://metacast.app/podcast/sub-club-by-revenuecat/DlWjuiPD/how-ethical-design-at-blinkist-led-to-23-growth---jaycee-day/IiL4Mf8f
- Onboard Me, "Why Most Free Trials Fail (And How Blinkist Gets It Right)" (Jan 2025): https://onboardme.substack.com/p/why-most-free-trials-fail-and-how-blinkist-gets-it-right

**Trial toggles**
- RevenueCat, "R.I.P. toggle paywall" (Feb 9, 2026; updated Apr 23, 2026): https://www.revenuecat.com/blog/growth/rip-toggle-paywall
- Adapty, "Your toggle paywall is about to get rejected" (2026): https://adapty.io/blog/your-toggle-paywall-is-about-to-get-rejected/

**Apple**
- Apple Developer Forums, 3.1.2(c) rejection for a trial more prominent than the billed amount (Aug 2026): https://developer.apple.com/forums/thread/841626
- Apple App Review Guidelines (3.1.2, 5.1.1, 5.6, 5.6.1, 5.6.3): https://developer.apple.com/app-store/review/guidelines/
- Apple HIG, Privacy (pre-alert screens): https://developer.apple.com/design/human-interface-guidelines/privacy
- Apple, "Asking permission to use notifications": https://developer.apple.com/documentation/usernotifications/asking-permission-to-use-notifications

**Law and consumer research**
- FTC staff report, "Bringing Dark Patterns to Light" (Sept 2022): https://www.ftc.gov/reports/bringing-dark-patterns-light
  - Summary: https://www.huntonprivacyblog.com/2022/09/27/ftc-releases-report-on-dark-patterns/
- California Automatic Renewal Law amendments, AB 2863 (in force July 1, 2025; free trials covered): https://fenwick.com/insights/publications/california-tightens-requirements-for-automatically-renewing-subscriptions
- C+R Research survey via CNBC (2022): https://www.cnbc.com/2022/09/06/consumers-underestimate-monthly-subscription-costs-by-at-least-100.html
- Norton, Mochon & Ariely, "The IKEA effect: When labor leads to love", *Journal of Consumer Psychology* (2012): https://doi.org/10.1016/j.jcps.2011.08.002

**Onboarding structure**
- Conrad, Couper, Tourangeau & Peytchev, "The impact of progress indicators on task completion", *Interacting with Computers* (2010): https://pmc.ncbi.nlm.nih.gov/articles/PMC2910434
- Buell & Norton, "The Labor Illusion: How Operational Transparency Increases Perceived Value", *Management Science* (2011): https://doi.org/10.1287/mnsc.1110.1376
- Gabor Cselle, "Every Step Costs You 20% of Users" (2018; data from one app in 2012): https://medium.com/gabor/every-step-costs-you-20-of-users-b613a804c329

**Onboarding length**
- No good study links length to conversion. The one "longer onboarding converts better" data point (Coconote, +16%) is a single vendor-reported case: https://stormy.ai/blog/coconote-superwall-case-study-conversion-optimization
- Lazyweb's 2026 count puts the median app onboarding at 11 screens: https://www.lazyweb.com/research/average-onboarding-screens-2026
- Our 6–7 screens each collect real data, so there's no reason to pad them with quiz screens.

[f-orbit-onb]: https://mobbin.com/flows/340b7fb6-8b5d-416c-9f9f-501a27d669bc?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f-orbit-getstarted]: https://mobbin.com/flows/6b941627-b728-4443-a947-985a27be4b63?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f-tideguide-sub]: https://mobbin.com/flows/5bef40b5-8760-4eb3-b232-dfaf5da7b41b?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f-noom-plan]: https://mobbin.com/flows/0f88ecd3-ceb0-43d1-af33-6feafe56928b?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f-noom-quiz]: https://mobbin.com/flows/d7a6d025-2d82-4e5a-9383-cb83579b95f8?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f-noom-profile]: https://mobbin.com/flows/7154e10b-ba9f-48a2-b2a4-19e7b438978e?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f-noom-onb]: https://mobbin.com/flows/0592dfbd-aac4-408b-ab48-76334ce7fc11?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f-finch]: https://mobbin.com/flows/80ef83ef-f872-4825-b18d-6b193d60a9aa?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f-finch-goals]: https://mobbin.com/flows/19212698-61fe-43ca-9144-60c9e73bbcd2?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f-duolingo]: https://mobbin.com/flows/b0b4f93f-5637-46ec-9d77-49ecda6b991d?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f-calm]: https://mobbin.com/flows/38549b00-2fe8-4fd1-914b-13c4905db245?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f-headspace]: https://mobbin.com/flows/ccf14439-4c45-4d56-b031-45173490cafe?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-orbit-tick]: https://mobbin.com/screens/deac87fe-f7ef-4452-8deb-f233aada237f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-breathwrk]: https://mobbin.com/screens/daa63b01-b6a9-4ff1-a681-693e9f88cbb9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-quittr-reveal]: https://mobbin.com/screens/e5703cd1-aaea-492d-a900-ac649caeb516?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-calai-bmi]: https://mobbin.com/screens/cf64017e-3c15-4492-995b-9dc9e434ffef?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-lovi]: https://mobbin.com/screens/53ddcdcc-dca1-4368-8fbc-dd57136a951e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-cleo]: https://mobbin.com/screens/8c905f3c-e573-42b4-a31e-faf44c7606f2?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-ahead]: https://mobbin.com/screens/061ce41f-838f-469a-aec3-f1509357c2e2?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-meplus]: https://mobbin.com/screens/13449be8-6eaa-4350-8206-f5acad61770c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-ubereats]: https://mobbin.com/screens/42d44d37-cb97-43be-9879-83d880d121ca?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-fiverr]: https://mobbin.com/screens/823c5091-2847-462b-aa45-3c7c7ffa5c42?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-shopee]: https://mobbin.com/screens/bb0fadf7-7bfb-4df9-bd47-2ed356cd252a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-instacart]: https://mobbin.com/screens/066d7dae-cdb8-429c-937a-5714ac2279b1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-bolt]: https://mobbin.com/screens/abd98bd4-5058-4342-a2cd-ea2cf1d7fd56?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-atoms]: https://mobbin.com/screens/10e80f9a-ea1d-4c26-9f5a-54e5e48fac34?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-attio]: https://mobbin.com/screens/3ecd678d-fe98-4a2c-bc0b-5e6694796bab?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-particle]: https://mobbin.com/screens/76636207-af81-4cb4-aeff-74ec5bf6822a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-expedia]: https://mobbin.com/screens/bf55a526-0657-4c71-abd8-5f7f0c0c7e51?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-asana]: https://mobbin.com/screens/b2e0857e-0f8a-4b58-9a4b-3d5a9b363c91?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-saturn]: https://mobbin.com/screens/e363049b-4c08-445e-9ecb-a4e4957fb81e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-5mj]: https://mobbin.com/screens/0b03c06a-63c8-43dd-87ed-58fecc57f0a1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-vocabulary]: https://mobbin.com/screens/32238af5-552f-4ac3-bede-16981f4c23d3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-nibble]: https://mobbin.com/screens/e722f5a0-b638-4060-86cc-2a05426b3f17?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-mesh]: https://mobbin.com/screens/60db255e-0f7c-4caf-a0a5-4d91c0aa8740?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-copilot]: https://mobbin.com/screens/b6ba77c0-7d8f-423e-8453-9db2a97f8035?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-foodpanda]: https://mobbin.com/screens/5c330e96-9e24-4420-a703-7612ab830a4b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-strava]: https://mobbin.com/screens/40d104f8-8f25-4ae3-90eb-373e30e35acd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-oneyear]: https://mobbin.com/screens/df0d769a-48b0-46b0-beb4-9f8225d4ce5a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-feeld]: https://mobbin.com/screens/e9591446-1a0a-442d-90bb-1f2f64dd434e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-capcut]: https://mobbin.com/screens/cf1c2398-379d-4826-9ff5-3cad4ccd711f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-lifesum]: https://mobbin.com/screens/8b62f92e-5ada-4dc4-89f1-70a82820887e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-lifesum2]: https://mobbin.com/screens/ad5263b9-359c-41a6-9386-5f79f465dec1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-kit]: https://mobbin.com/screens/d106d676-f01e-4213-8f11-81cea7a8af20?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-moonly-plans]: https://mobbin.com/screens/b2a7f4f6-e03e-4875-97ec-79c299a244c7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-everyday]: https://mobbin.com/screens/41353fd9-a196-4982-a8b9-5e1cc8f51ee7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-skip]: https://mobbin.com/screens/386a753c-d4ca-4cb8-9277-366b89720c37?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-newyorker]: https://mobbin.com/screens/46cdf1b1-f3d5-40f1-8c01-992344508a96?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-halide]: https://mobbin.com/screens/699b087c-8c67-4fe6-8b91-360a080edace?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-calai]: https://mobbin.com/screens/b730224e-cacd-450a-98b4-74cb2be349e7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-tide-guide]: https://mobbin.com/screens/5b34dc0f-7bf4-4ba1-ac0f-1780eb282738?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-fixtured]: https://mobbin.com/screens/0576cc85-bcfb-48ce-9115-cc4fbd774e02?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-quittr-paywall]: https://mobbin.com/screens/a55ce65a-240c-4a00-a121-97a00854d738?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-jomo]: https://mobbin.com/screens/7be16b7a-3b9b-4380-9f9f-6de8487b4cc5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-moonly-proof]: https://mobbin.com/screens/08c67706-045f-450a-af70-ad31a0996ccb?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-pushr]: https://mobbin.com/screens/18cdfc71-1855-4eaf-aa83-13fcf58fe528?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-tide]: https://mobbin.com/screens/f16a7a88-a1cc-4517-b6fe-b4697ce4c77c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-x]: https://mobbin.com/screens/03c501e7-abaa-4543-9b95-9ece4cc0de2c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-deezer]: https://mobbin.com/screens/789bdd09-de9e-4782-81b7-d5699366d4cf?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-headway]: https://mobbin.com/screens/8b8714eb-2ed6-4468-bde5-59df3f8ae4f2?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-gentler]: https://mobbin.com/screens/9cf2b993-bf44-4790-b49b-3dbcd4329694?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-7eleven]: https://mobbin.com/screens/eb69750e-dbe1-49a1-8401-007366254d9f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s-dailyart]: https://mobbin.com/screens/53319839-f792-4372-ba99-94c56d3a1a0a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp

---

## Mobbin notice

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
