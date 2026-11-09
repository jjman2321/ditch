# Ditch v10: Sunflower, last fix round before build (Nov 9, 2026)

v10 starts from a copy of v9 (v9 is untouched). It fixes every item in `design/v9/REVIEW-v9.md`, the six owner-approved product-logic changes and the owner's polish requests for the hold ring and the icon tiles.

## Files
- `screens.html`: all screens. Render with `node shot.js`, or `node shot.js audit` to also run the contrast check.
- `board-onboarding.jpg`, `board-app.jpg`, `board-dark.jpg`, `board.jpg`.
- `renders/*.jpg`: 29 screens.
- `MOTION.md`: updated motion spec.
- `duck.png`, `duck-dark.png` and `make_ducks.py`.

## Product logic (owner-approved)
1. **Ditching doesn't end reminders.**
   - Screen 10 (light, dark, SE) shows "One last check: Fri, Nov 13 · 9 AM — 'Did you cancel Netflix? It charges tomorrow.'"
   - The primary button is **Cancel in Netflix ↗** (opens the how-to), with a secondary **I already cancelled**. Undo moves top-left.
   - Copy: "$215.88 / a year you won't pay, once you cancel." and "Cancel it and you'll be saving $647 a year." ($647 is $431 plus $215.88.)
   - The row reads "Cancel by Sat, Nov 14". No strike-through and no "reminders off".
   - Ditched tab:
     - "You're saving $431 a year" counts only confirmed cancels.
     - Netflix sits under **Waiting for you to cancel** with "I cancelled it" and "How to cancel".
     - Confirmed ones sit under **Cancelled**.
   - Home 9c shows Netflix with a DITCHED tag and "Cancel by Sat, Nov 14".
   - **10b** shows ditching the Pro trial itself: one last check Sun, Nov 15, and "Cancel in iPhone Settings".
2. **Guessed dates stay labelled.**
   - A "Guess" tag on Home (9, 9b, 9c, dark).
   - A dashed outline on Calendar logos, with a legend.
   - "around Mon, Nov 30" on You're set.
   - 9b has a "4 dates are guesses · Check them ›" row.
   - Screen 4 is clear about it: "Grey dates are guesses" and "Save 2 dates, keep 4 guesses".
   - Reminder copy for guesses: "renews around Thu, Dec 3."
3. **Reminders-off banner on Home (9c, light and dark):** "Reminders are off. Nothing can reach you. [Turn on]". The total card says "Reminders off" and every bell shows a slash.
4. **The date sheet (4b) has a "Next charge / From my last receipt" switch.** In receipt mode past days are allowed. Picking Oct 14 rolls forward to "Last charged Oct 14, so next is Sat, Nov 14", with the heads-ups listed.
5. **MOTION.md:**
   - Only onboarding's total rolls (digit by digit).
   - The Success haptic at 100% is removed, so the stamp's Heavy is the only strong haptic, with a 600 ms rule between strong haptics.
   - The duck blink is dropped (single image: rise plus a small tilt only).
6. **"ditch [Pro]" lockup:** the wordmark plus a sunflower Pro pill on the paywall header and trial card (light and dark), the 9b trial row, You're set 8b and 10b. The Settings section header stays text.

## Owner polish
- **Hold ring (9, d9):**
  - A perfect SVG circle, 3pt stroke, round caps, starting at 12 o'clock.
  - The track is ink at 15% (cream at 18% in dark); progress is ink (sunflower in dark).
  - The ring clears the 30pt tile's corners by about 3.5pt.
  - The stray white line is gone, since the old white track was removed.
  - Checked zoomed at 2x.
- **Duck app-icon tile:**
  - Sunflower, 22.5% corner radius (iOS-like), duck centred and resting on the bottom edge, inner 0.5pt hairline.
  - The same `dicon()` is used everywhere: notifications, paywall, 8b, 9b, 10b, Settings.
- **Every logo tile:** one component (`.lt`) with a 22.5% radius and an inset 0.5pt hairline (ink 18%, cream 18% in dark). White logos (ChatGPT, YouTube, Apple Music) now have a clean edge.

## Other REVIEW-v9 fixes
- **Calendar:**
  - Day numbers sit top-left and heads-up dots top-right, so a dot never sits under another service's logo.
  - Past days are now at least 4.5:1.
- **Settings:**
  - With notifications off, "Send me a test reminder" is greyed with "Turn notifications on first".
  - "Heads-ups 3 days + 1 day" has a PRO tag and the note "Custom heads-up timing comes with Pro."
  - Added **Delete all my data**.
- **Ditched tab:** the "SINCE JUNE" mini-stamp is gone ("since June" is in the subline). No badges.
- **You're set:** "Change which 3" is removed. The split shows "dates to check". The 8b dead band is shorter.
- **SE (10-se):** keeps the "Billed by Apple?" line and fits 375×667 with no dead gap.
- **Paywall timeline at large Dynamic Type:** in the build, switch to a vertical 4-row list at accessibility sizes. This is a note for the build, not drawn here.

## Example data note
The Ditched tab's confirmed cancels are Apple Music (Sep 17, $131.88), Audible Premium Plus (Aug 22, $179.40) and Hulu (Jun 14, $119.88). They add up to $431.16 a year ($35.93 a month), so "You're saving $431" is true *before* Netflix. The step chart reads $119.88 → $299.28 → $431.16.

## Contrast
`node shot.js audit` passes everywhere except two intentional cases:
- Dimmed rows during a hold (about 4.1:1, transient).
- Dimmed dark "Guess" tags during a hold (about 4.0:1).

## Honest scores
| # | Screen | Light | Dark |
|---|---|---|---|
| 1 | Welcome | 9.5 | 9.5 |
| 2 | Pick | 9.5 | n/a |
| 3 | Total | 9.5 | 9.5 |
| 4 / 4b | Charge dates / date sheet | 9.5 / 9.5 | n/a |
| 5 | Reminders pre-ask | 9.5 | n/a |
| 6 | Paywall | 9.5 | 9.5 |
| 7 | Which 3 | 9.5 | n/a |
| 8 / 8b | You're set | 9.5 / 9.5 | n/a |
| 9 / 9b / 9c | Home hold / Pro / reminders off | 9.5 / 9.5 / 9.5 | 9.5 / n/a / 9.5 |
| 10 / 10b / 10-se | Ditched / trial / SE | 9.5 / 9.5 / 9.5 | 9.5 |
| 11 | Empty | 9.5 | n/a |
| 12 | Calendar | 9.5 | 9.5 |
| 13 | Ditched tab | 9.5 | 9.5 |
| 14 | Settings | 9.5 | 9.5 |

## Remaining weak points (owner tasks)
- The stamp art is still code. It needs real hand-lettering before launch.
- There's still no yearly-renewal example (Maya's $139 Prime) in the data or the screenshots.
- CLAUDE.md rule 8 already says "a year you won't pay". Add "once you cancel" there and in SPEC.
