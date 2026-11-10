# Ditch v12: onboarding mockups (Nov 10, 2026)

These are mockups for the owner to approve before anything gets built. They replace the v11 parts the owner turned down ("the old paywall structure was better", "the flow of onboarding and questions needs work", "the 'you pay' spacing isn't correct"). They follow DECISIONS #14, #16, #17, #19–#28. Nothing outside `design/v12/` was changed.

## The flow (7 steps)
Welcome → What you pay for → Your total → Charge dates → Reminders → Paywall → You're set (Which 3 is folded in) → Home.

What changed from v11:
- The separate Quick guess screen is gone from the main flow, and so is the "You guessed" pill.
- The two date screens (scan, then a day grid for each service) are now one screen.
- The reminders ask now comes after the dates, so it can show the user's own first reminders.
- The paywall is back to v10's structure.
- Which 3 is now a "Change" link on You're set instead of its own sheet.

The progress bar has 4 steps: pick, total, dates, reminders.

## Files
- `screens.html`: one source for every screen and size.
- `shot.js`: run `node shot.js` to render everything (add `--audit` to skip the screenshots). The audit is described below.
- `renders/`: 31 screens at 2x.
  - iPhone 12: steps 1–7, plus the plan sheet, the day-grid sheet, the Lifetime and Monthly paywall states, the pick-3 sheet and Almost set.
  - SE, iPad and dark versions.
  - The guess variant: `02v-guess`, `03v-total-with-guess`, `02v-pick-no-total`, plus their SE versions.
- Boards: `board-onboarding.jpg`, `board-sizes.jpg`, `board-dark.jpg`, `board-guess-compare.jpg`.

## Example data (US, today Tue, Nov 10, 2026)
Same as v11: 6 ticked, $96.45 a month, $1,157.40 a year (shown as "$1,157").

Next charges:

| Service | Next charge |
|---|---|
| ChatGPT Plus | Sat, Nov 21 |
| Netflix | Thu, Nov 19 |
| YouTube Premium | Tue, Nov 17 |
| Amazon Prime | around Tue, Dec 1 ("Later") |
| Spotify | Mon, Dec 7 |
| Disney+ | around Thu, Nov 19 ("Next week") |

- First reminders: Sat, Nov 14 (YouTube Premium), Mon, Nov 16 (Netflix), Wed, Nov 18 (ChatGPT Plus).
- Pro trial: reminder Sat, Nov 14, charge Tue, Nov 17.
- ⚠ ChatGPT Plus $20.00 and YouTube Premium $15.99 are still unverified US prices.

## Screen notes
- **3 · Your total.** Gaps between the actual letter shapes (measured, not the text boxes):
  - "You pay" to the number: **8pt**.
  - The comma's tail to "a year.": **11pt**. Nothing collides.
  - "a year." to the month line: **21pt**.
  - The month line to the fact line: **16pt**.

  There is one fact line: "Most people guess way lower. In one study, the real total was about 2.5× the guess." The list shows the 3 biggest plus "3 more · Show all" (2 plus 4 more on SE, all 6 on iPad). "Ditch just one…" sits right under the list, and the button sits at the bottom.
- **4 · Charge dates.**
  - The Apple card comes first: "Paid through Apple?", the screenshot line, the path Settings › Your name › Subscriptions, and a "Choose screenshot" button.
  - Below it, "Or pick roughly · 2 of 6 set" and one row per sub with a segmented quick pick.
  - A tap shows "around Thu, Nov 19" right away. A moment later the row folds into one line ("✓ Sat, Nov 21 · Change" or "around … · Rough · Change"), so you can see your progress and the list gets shorter.
  - "Pick a day" opens the day-grid sheet. It has 31 days and "Last day of the month", then the sentence "Next charge: Thu, Nov 19. Then the 19th of every month.", then **Done**.
  - There is one button, **Continue**, pinned at the bottom. The lead line is "Rough is fine. Skip any you don't know."
  - **Changed from the brief:** the third option says **"Later"**, not "Later this month". "Later this month" doesn't fit 4 equal segments at 375pt without cutting off. It's also wrong for half of any monthly list: on Nov 10, a charge on Dec 1–9 has no bucket (Amazon and Spotify in our own example). "Later" covers Nov 23–Dec 9.
  - Rough dates are stored as the middle of their range: This week → Fri, Nov 13. Next week → Thu, Nov 19. Later → Tue, Dec 1.
- **5 · Reminders.** The yellow panel shows "Your first reminders": the real notifications on Sat, Nov 14 and Mon, Nov 16, with their own prices. It also has the "7 in 10" fact, the bell button, "Tap 'Allow' on the next screen." and "Maybe later".
- **6 · Paywall (v10 structure).**
  - A yellow band holds the "ditch Pro" lockup, × and the headline. On phones the headline breaks as v10's did: "Get a reminder / before all / 6 renewals.". The duck sits beside the short last line and peeks over the white card.
  - The card is the 4-row Free vs Pro comparison (3 rows on SE, without "Second nudge").
  - Then three full-width plan cards, 56pt each (48 on SE). The "SAVE 49%" ribbon sits on Yearly's top edge above the name, so it never touches the price.
  - The button text follows the plan.
  - Under the button is one quiet line: "**$0 today** · reminder Sat, Nov 14 · $29.99 Tue, Nov 17". Monthly shows "$4.99 today, then every month. Cancel anytime." Lifetime shows the #6b sentence.
  - That line sits in a **fixed 56pt slot**, so the button and "Continue free" never move when the plan changes.
  - Then "Continue free / Reminders for 3 subscriptions", and Restore · Terms · Privacy, each 44pt tall.
  - No scrolling at 390×844 (15pt to spare) or 375×667 (7pt to spare).
- **7 · You're set.**
  - Checklist: "6 subscriptions on your list · $1,157 a year", "Reminders are on · 3 days and 1 day before, at 9:00 AM", "○ 2 dates to check".
  - Then the card "Reminders on your 3 biggest · Change". Each of the 3 rows shows the renewal date and the first reminder day. "Change" opens the pick-3 sheet (7b).
  - **Almost set** (7c) shows "! Reminders are off" and "Waiting for your OK" with "paused", plus Turn on reminders / Go to my list.

## The guess variant (for comparison, `board-guess-compare.jpg`)
- **02v Quick guess** sits between pick and total. It has the user's 6 logos, "What do these 6 cost you a month?", "Your best guess. One tap.", 6 one-tap answers, and "No wrong answers. Your real total is next."
- **03v Total with the guess.** Same number block. The fact line becomes: "You guessed **$25–50** a month. Most people guess way lower: in one study, the real total was about 2.5× the guess." It's a calm line in the same rhythm, with no pill.
- **The pick bar must hide the running total in this variant** (it shows "6 picked" and the logos), or the guess is spoiled.
- **My pick: the main flow, without the guess (8/10 vs 7/10).**
  - The variant adds a screen and a decision.
  - Asking for a guess *after* they've just ticked their prices feels like a quiz.
  - The yearly number already does the reveal.
  - The guess is worth an A/B test after launch.

## The audit (shot.js, run after every round)
Text checks:
- Past the 24pt edge, or under the status bar or home indicator.
- Clipped, cut off, or overflowing its box.
- Contrast below 4.5:1 (3:1 for large text), opacity included.
- A lone last word on a line.

New in v12:
- **Ink collisions:** real letter bounds, worked out from the font, so a comma tail touching the next line is caught.
- **Gaps between stacked blocks that are off the 4pt grid.**
- **Tap targets under 44pt.** Text links use a 14pt hitSlop. Segments use the 44pt track.
- **Pills touching text.**
- **The duck covering text.**
- **The rhythm readout** around the hero number, and the **spare height** on each no-scroll screen.

How each round went:
- **Round 1:** 150+ problems.
  - The hero ink touched the label (0pt). The paywall overflowed by about 33pt and its row labels didn't fit.
  - The no-break space was a plain space. Chip contrast was 1.07:1 (the pill was a pseudo-element). Segments were 40pt tall.
  - The "Change" links wrapped onto their own line. The Welcome headline ran to 4 lines.
- **Round 2:** problems in the dates card, the paywall and the tap targets.
  - The dates card text broke badly. The Apple card was 192pt tall.
  - On the paywall the duck covered "renewals." and the trial line changed height between plans, so the button jumped.
  - The legal links were 20pt tall and the "Change" links were 41pt.
- **Round 3:** the paywall had overflowed again after the fixed slot went in (33pt), so I trimmed it (table rows 32pt, band padding). On SE, the ribbon overlapped the price, which led to the new pill check.
- **Round 4:** the iPhone 12 headline broke to "before" alone on a line, so I went back to v10's three-line shape. The Dates title went back to "charge you?" ("renew?" still took 2 lines). Tighter iPad columns.
- **Round 5:** the Lifetime sentence crowded the button on SE (slot now 56pt), and the SE guess variant ran 5pt over its bottom padding. **The final run reports nothing.**

## Final audit (scores are honest, /10)
| # | Screen | Score | Fixed in v12 | Still imperfect |
|---|---|---|---|---|
| 1 | Welcome | 9.5 | Headline back to 3 lines (72→70pt). 40pt notification icon. Footer no longer under the home indicator. | The duck is still a placeholder (needs the redraw). |
| 2 | What you pay for + plan sheet | 9.5 | "Change" stays inline (it was wrapping). Chips have a 44pt tap area with a real 36pt pill (contrast fixed). Added "Tick each one." Sheet copy: "Standard is the most common." | The list scrolls under the bar by design. |
| 3 | Your total | 9.6 | Measured ink rhythm 8 · 11 · 21 · 16. No pill, one fact. "Ditch just one…" is grouped with the list. | iPhone 12 shows 3 rows plus "3 more" (a 4th row doesn't fit). |
| 4 | Charge dates + day sheet | 9.5 | One screen, Apple card first, quick pick on every row, rows fold when answered, one button, no "GUESS". | Shows about 2.5 rows on iPhone 12 and about 1.5 on SE, so it scrolls. "Later" replaces "Later this month" (reason above). Segment labels are tight on SE (4pt of side room, not cut off). |
| 5 | Reminders pre-ask | 9.5 | After the dates, with their own first two reminders (real dates and prices). "Only about your subscriptions." on its own line. | SE shows one notification. |
| 6 | Paywall (Yearly / Monthly / Lifetime) | 9.5 | v10 band, duck and card. 4-row comparison. Stacked plan cards. One trial line. The button doesn't jump between plans. Every control is 44pt or more. Fits SE and iPhone 12 with no scrolling. | Trial line is 13/16 (one step below `sub`). SE headline is 26/32 (the one size exception). The Lifetime sentence takes 3 lines. Only 7pt to spare on SE. |
| 7 | You're set / pick 3 / Almost set | 9.5 | Which 3 folded in ("Reminders on your 3 biggest · Change"). Each row shows the reminder day and the charge day. Almost set has one clear fix. | The Pro-path version isn't drawn (add "✓ Ditch Pro trial on your list · reminders Nov 14 and Nov 16"). |
| 2v/3v | Guess variant | 9.5 (layout) | Clean guess line in the same rhythm, and the pick bar hides the total. | As a flow choice I'd still pick the main flow (see above). |

Every screen passes at 390×844, 375×667 and the iPad 834×1194 centred column, in light and dark mode (Welcome, Total, Paywall, You're set). Larger Dynamic Type sizes are **not** drawn yet. At those sizes the paywall and Dates would have to scroll.

## Open items for the owner
1. Approve the paywall structure and the fixed trial-line slot.
2. "Later" instead of "Later this month", and where rough dates land: the middle of the range, with reminders 3 days and 1 day before the "around" date. An alternative is to remind before the range starts.
3. Guess or no guess: my pick is no guess, with an A/B test after launch.
4. Verify the ChatGPT Plus and YouTube Premium US prices.
5. The duck still needs the professional redraw.
6. List the facts ("2.5×", C+R 2022; "7 in 10", Self Financial 2026) on Settings → About → Sources.
