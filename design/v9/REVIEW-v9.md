# Ditch v9 (Sunflower): independent re-review (Nov 9, 2026)

Same reviewer, persona and criteria as `design/v7/REVIEW.md` and `design/v8/REVIEW-v8.md`.

What I looked at:
- `NOTES.md` and `MOTION.md`.
- The three boards.
- All 26 files in `renders/` at full size (18 light, 8 dark).
- Contrast measured from the renders (approximate because of JPEG artefacts).
- Every date checked against the 2026 calendar.
- The locked decisions in `docs/DECISIONS.md` (#11, #13, #14, #15).

**Verdict: 9.2/10 overall, up from 8.9.** Every v8 item landed except the two the owner has to decide (hand-lettered stamp art, a yearly-renewal example). The new screens (one-screen dates, the calendar sheet, Calendar tab, Ditched tab, Settings, the trial on the list) are well made, and all numbers are right.

What keeps it under 9.5 is no longer how it looks. It's **three product-logic holes, all about reliability**, which is the one thing Ditch sells:
1. Ditching turns off a sub's reminders *before* the user has actually cancelled.
2. "Typical" guessed dates drive real reminders but look like facts everywhere after screen 4.
3. If reminders are off, only Settings says so.

---

## 1. Maya, one more time

Maya is 29, earns $68k, and just paid $139 for an Amazon Prime renewal she forgot.

- **Onboarding** is now short and confident: Welcome → pick → total → **one** dates screen → lock-screen pre-ask → paywall → which 3 → done. That's 8 screens.
- **Charge dates:** she likes "We filled in typical dates" because it's fast. But she doesn't know what a "typical" date for Amazon Prime is, and she'll tap **Save dates** without fixing the four grey "GUESS" chips.
  - From then on, Home, Calendar and You're set show "Thu, Dec 3" and "Mon, Nov 30" heads-up as if they were real.
  - If her real Prime date is Nov 22, Ditch warns her a week late. That's the Bobby failure, the one thing Ditch promised to fix.
- **Date sheet:** her receipt says "Oct 22". The sheet greys out every past day, so she has to work out the next date herself. For a **yearly** Prime renewal she has to page forward up to 11 months.
- **Paywall:** "Get a heads-up before all 6 renewals" lands, because she was just told free covers 3 of her 6. She trusts the four-dot trial timeline. It's a closer call than in v8, but she probably still continues free on day 1.
- **Ditching Netflix:** a big, satisfying stamp and "$215.88 a year you won't pay". She taps the big **Done** button. The row says "reminders off".
  - If she forgets to actually cancel in Netflix, Ditch is now silent before Saturday's charge.
  - That's the exact surprise-charge story that made her download the app.

---

## 2. Did every item from REVIEW-v8.md land?

| # | v8 item | Status | Notes |
|---|---|---|---|
| 1 | Irony-killer never shown on a list | ✅ | **9b** has a "Ditch Pro trial · Mon, Nov 16 · trial ends · $29.99" row with a bell. **8b** lists the trial's Fri, Nov 13 heads-up. |
| 2 | Trial reminder broke the rule / "like the rest" | ✅ | Fri, Nov 13 and Sun, Nov 15 at 9 AM (DECISIONS #15). The "like the rest" line is gone. |
| 3 | Charge dates was 6 screens; Not sure vs Skip | ✅ | One screen plus a sheet. "Save dates" / "Do the rest later". The sheet says "Not sure: use a guess". (New problems with guesses: #2 and #4 below.) |
| 4 | Day grid read as a calendar | ✅ | A real November 2026 month: S–S headers, Nov 1 on Sunday, Nov 14 on Saturday, today circled. |
| 5 | Ditched dead band / SE overflow | ✅ / ⚠️ | 393pt is balanced. The SE fits, but it keeps a band of about 65pt *and* drops the "Billed by Apple?" line "to save space" (#6). |
| 6 | Welcome label formats, dead band | ✅ | "Wed, Nov 11 / 9 AM heads-up" etc., the same format as the paywall. A band of about 55pt remains, which is fine. |
| 7 | "No ads, no nagging" before the paywall | ✅ | "That's all we'll ever send." Better *and* a promise. |
| 8 | You're set blurred the free limit | ✅ | "All 6 are on your list. 3 get a heads-up." The 3 without heads-ups are named. |
| 9 | Hold ring track invisible | ✅ | White track, ink progress. Clearly readable. |
| 10 | Cancel steps assumed direct billing | ✅ | "Billed by Apple? Settings → Subscriptions." (missing on the SE) |
| 11 | No hold hint | ✅ | "Hold a sub to ditch it" on 9b (first visit). |
| 12 | Sticky total had no fade | ✅ | The Max row fades under the bar. |
| 13 | Empty-state labels, duplicate + | ✅ | "Amazon Prime", "Apple Music". The + is hidden. |
| 14 | Progress bar jumps | ✅ | 5 steps. The paywall is a sheet with no bar. |
| 15 | Stamp still code | ⚠️ Partial | Crisper and better. Still needs real hand-lettering (owner task). |
| 16 | Yearly-renewal story | ⚠️ Owner's call | Not in the data. Item #4 below makes it worse: a yearly sub is the hardest one to enter. |

### Numbers and dates: all correct
- **Onboarding totals:** $90.95 / $1,091 / $2.99. Bars are proportional.
- **Weekdays:** Sat Aug 22, Sun Jun 14, Fri Nov 13, Sun Nov 15, Mon Nov 16, Mon Nov 30 all fall on the stated weekdays in 2026.
- **Calendar:** $75.96 = 17.99 + 11.99 + 11.99 + 20.00 + 13.99, 5 charges. Amazon falls in December. Free-tier heads-up dots on 11, 13 (Netflix), 18, 20 (ChatGPT) and 30 (Amazon).
- **Ditched tab:** $431.16 = 215.88 + 95.40 + 119.88. $35.93 a month. Step chart $119.88 → $215.28 → $431.16.
- **8b (Pro) first heads-ups** in date order: Netflix Wed 11, trial Fri 13, Spotify Fri 13, Disney+ Sun 15. Correct.
- **Ditched:** new total $72.96.
- **The "3 biggest yearly charges" pre-pick** (DECISIONS #11): ChatGPT, Netflix, Amazon. Correct.

### Paywall rules (light 06 and dark d06): all pass in both modes
- × on first frame
- Real "Continue free: reminders for 3" button
- Restore · Terms · Privacy
- $29.99/yr is the largest price
- Real-date timeline Today $0 → Fri, Nov 13 → Sun, Nov 15 → Mon, Nov 16 $29.99
- "$0 today, then $29.99/yr from Nov 16. Cancel anytime."
- No discount, countdown or weekly plan
- CTA "Start 7-day free trial"
- Exact sublines
- Radio selection
- Fits 393×852

### Contrast (measured)
- **Small text on sunflower:** about 6.5:1 everywhere.
- **Cream and white secondary text:** 5.0–7.2:1. The GUESS chip is about 5.0:1.
- **Dimmed hold rows:** about 4.2:1 light and 5.0:1 dark.
- **Calendar-tab past days: about 3.2:1 (light).** That's acceptable in the date picker (disabled), but on the Calendar tab past days are history you read, not disabled controls (#7).

### Dynamic Island, cropping, flow
- Nothing touches the island.
- The only crop is the scrolling chip row ("Shop"), which is intended.
- CTAs are consistent ("See what I pay → See my total → Set my charge dates → Save dates → Turn on reminders → Save my 3 → Go to my list").
- Flow gaps are listed in §5.

---

## 3. Scores

| # | Screen | Light | Dark | Why not higher |
|---|---|---|---|---|
| 1 | Welcome | 9.5 | 9.5 | |
| 2 | What do you pay for? | 9.5 | n/a | |
| 3 | Your total | 9.5 | 9.5 | |
| 4 | Charge dates (one screen) | **8.5** | n/a | Invented "typical" dates; "Save dates" and "Do the rest later" both save the guesses |
| 4b | Date sheet | 9.0 | n/a | Past days disabled although the copy says "your last receipt" (a past date); yearly subs need up to 11 page-flips |
| 5 | Reminders pre-ask | 9.5 | n/a | |
| 6 | Paywall | 9.5 | 9.5 | The 4-node timeline will collide at large Dynamic Type |
| 7 | Which 3 | 9.5 | n/a | |
| 8 | You're set (free) | 9.0 | n/a | Amazon's "Mon, Nov 30" heads-up comes from a guess but reads as fact; "Change which 3" right after "Save my 3" |
| 8b | You're set (Pro) | 9.0 | n/a | Dead band of about 75pt above the CTA |
| 9 | Home, holding | 9.5 | 9.5 | |
| 9b | Home, Pro trial | 9.0 | n/a | Guessed dates have no marker; the trial row's ditch behaviour isn't defined |
| 10 | Ditched | **8.5** | **8.5** | Reminders go off before the user cancels; "Done" is the primary action, the cancel row is secondary |
| 10-se | Ditched on SE | **8.5** | n/a | Drops "Billed by Apple?" while leaving a 65pt gap |
| 11 | Home, empty | 9.5 | n/a | |
| 12 | Calendar | 9.0 | 9.0 | The heads-up dot on the 18th sits under Disney+'s logo but belongs to ChatGPT; past days 3.2:1 |
| 13 | Ditched tab | 9.0 | 9.0 | Counts Netflix in "$431" before it's cancelled; "SINCE JUNE" is about 8pt and badge-like |
| 14 | Settings | 9.0 | **8.5** | Dark (notifications off): "Send me a test reminder" is live and yellow even though it can't deliver |

**Overall: 9.2/10.** Screens under 9: **04 Charge dates (8.5), 10 Ditched (8.5 light and dark), 10-se (8.5), d14 Settings with notifications off (8.5).**

---

## 4. Paywall headline verdict

| | "Get a heads-up before all 6 renewals." (current) | "We'll remind you before we charge you, too." (previous) |
|---|---|---|
| What it does | States the benefit, with **her** number, right after she learned free covers 3 | Defuses the "subscription to cancel subscriptions" irony; reassures about billing |
| Conversion | **8.5**. Specific and personalised, and it answers "what do I get?" at the moment of decision. The gap (3 of 6) is fresh. | **7.0**. Clever and memorable, but it describes *how you'll be billed*, not *why to pay*. "Too" needs a second read. |
| Trust | **8.0**. Plain and true, but says nothing about the trial. | **9.0**. The most trust-building line in the app. |
| Brand voice | 7.5 | 9.0 |

**Pick: keep the current headline.** It's also the locked wording in DECISIONS #11, so only the owner can reopen it.

v9 already does the right thing with the other line: it is the **subtitle of the trial card** ("We'll remind you before we charge, too."), right above the dates that prove it. That puts the trust line next to the evidence and the benefit line in the headline. That combination beats either line alone.

After launch, A/B "Get a heads-up before all 6 renewals." against "Heads-ups on all 6, not just 3." with RevenueCat Experiments. Don't swap them on taste.

---

## 5. Remaining defects, ordered by impact

1. **Ditching silences reminders before the user has cancelled. (s10, d10, 10-se, 13; product logic, highest.)** "Reminders off" the moment the stamp lands means that if Maya forgets to cancel in Netflix, Ditch says nothing before Saturday's charge. That's the exact problem the app exists to stop. Fix:
   - **(a)** Keep one **"cancel check"** heads-up for ditched subs until confirmed: Fri, Nov 13 · 9 AM, "Did you cancel Netflix? It charges tomorrow." with the actions *I cancelled* and *Show me how*.
   - **(b)** Make the cancel row the **primary** action on Ditched ("Cancel in Netflix ›" as the ink button). "Done" becomes secondary.
   - **(c)** On the Ditched tab, show Netflix as *"$215.88 · cancel by Sat, Nov 14"* with a **"I cancelled"** control. Count it in "You're saving" only once it's confirmed, or label the total "$431 a year, 1 still to cancel".
   - **(d)** Change the row label "reminders off" to "one last check Fri".
   - This also keeps "You're saving" (DECISIONS #13) honest.
2. **Guessed dates turn into real-looking reminders. (s4 → 7, 8, 9, 9b, 12; reliability, high.)** A service has no "typical" charge day; it depends on when the user signed up. Fix:
   - Carry a visible **"Guess"** marker everywhere the date appears: Home rows ("Thu, Dec 3 · guess"), Calendar (dashed outline), You're set ("about Nov 30").
   - Word guessed heads-ups as "**around** Dec 3, check your date".
   - Add a **"Confirm 4 dates"** row on Home until they're confirmed.
   - Better still: default an unknown date to "No date yet" plus one nudge, rather than inventing one.
   - On the first visit the header should read "0 of 6 confirmed", and "Save dates" should say "Save 2, guess 4" so the choice is explicit.
3. **Reminders being off is only visible in Settings. (Home, Calendar; reliability, high.)** Anyone who tapped "Maybe later" on the pre-ask, or later denied permission, sees a normal Home with bells that can't ring. Fix: a pinned card at the top of Home and Calendar: "Reminders are off. Nothing can reach you. **Turn on** ›". Disable the bell glyphs (outline + slash) while permission is off.
4. **The date sheet can't take the date on the receipt. (4b, high for yearly subs.)** The copy says "Your last receipt has the real day", but every past day is disabled. Fix:
   - Add a **"Last charged / Next charge"** toggle. "Last charged" allows past dates and rolls forward per Rule 2 ("Last charged Oct 22 → Next: Sun, Nov 22").
   - When **Yearly** is on, open on the month of the last charge, so Maya's Prime takes two taps, not 11 page-flips.
5. **Motion spec conflicts. (MOTION.md, medium.)**
   - **(a)** The digit-roll "also on the Home total on first load, once per session" puts a moving price on the everyday screen daily, against the "nothing moves near a price" rule. Limit it to onboarding's Total (and maybe a month change on Calendar).
   - **(b)** Hold-complete *Success* and then stamp *Heavy* 420 ms later are two strong haptics back to back. Keep only the Heavy on stamp impact. Make the 100% ring tick a selection tick, or drop it.
   - **(c)** The duck's "blink, eyes scaling to 10% height" needs a separate eye layer, but the duck is a single PNG and the owner banned redrawing it. Either export an eye-layer version from the source art, or drop the blink.
   - **(d)** CLAUDE.md rule 8 says "'$X a year back' counts up". MOTION says the number fades in, the copy is now "a year you won't pay", and DECISIONS #13 replaced "back"/"kept". The fade is the better call, but CLAUDE.md must be updated to match, or the next build will follow the old rule.
6. **The SE version drops "Billed by Apple?" while a 65pt gap sits empty. (10-se, medium.)** Put the line back in the cancel row. If the strip is still needed, tighten the gap above the cancel card to 16pt. The billing line matters more than the space.
7. **Calendar clarity. (12, d12, medium-low.)**
   - On Nov 18 the heads-up dot sits under Disney+'s logo but belongs to ChatGPT (Disney+ has no reminder on free). Put heads-up dots in a fixed corner of the cell, not under the charge logo. Or, on tap, list "Heads-up: ChatGPT Plus (charges Sat, Nov 21)" in the day panel.
   - Raise past-day numbers on the tab to at least 4.5:1. They're readable history here, not disabled controls.
8. **Settings logic. (14, d14, medium-low.)**
   - With notifications off, grey out "Send me a test reminder", or make it open iPhone Settings. Right now it's a live yellow action that can't work, competing with "Turn on in iPhone Settings".
   - On free, "Heads-ups: 3 days + 1 day before ›" implies you can change it, but custom lead times are Pro. Add a PRO tag or explain the lock.
   - Add **"Delete all my data"** under Data. "Your list stays on your phone" deserves a way to clear it.
9. **Ditched-tab hero stamp. (13, d13, low.)** "SINCE JUNE" is about 8pt rotated text, so it can't be read, and a stamp next to a running total reads like a badge (DECISIONS #13 bans badges). Drop the stamp and put "since June" in the subline, or make the text at least 11pt.
10. **The trial row has no ditch behaviour. (9b, low-medium.)** Holding "Ditch Pro trial" should run the same stamp, then a cancel row: "Cancel in Settings → Subscriptions before Mon, Nov 16". Design that one state. It's the irony-killer's payoff ("we'll even help you ditch us").
11. **Dynamic Type on the paywall timeline. (6, d6, low-medium.)** Four nodes with two-line labels have only about 15pt of space between them at default size. At accessibility sizes, switch to a vertical 4-row list (Night's v7 pattern).
12. **"Change which 3" right after "Save my 3". (8, low.)** The user picked their 3 five seconds earlier. Drop the button here (Settings and Home already have it), or show it only if they skipped step 7. Trim the band of about 75pt above the CTA on 8b.
13. **Stamp art. (Owner task.)** Get a real hand-lettered stamp before launch. The code stamp is a good stand-in.
14. **Yearly-renewal example. (Owner's call.)** Prime at $139/yr is Maya's story, and #4 shows the yearly path is the weakest. Add one yearly sub to the App Store screenshot set and to QA.

**Fix 1–4 and this is a 9.5 flow.** Those four are product logic, not pixels, and each one protects the single promise the brand makes: *the heads-up actually reaches you, on the right day.*
