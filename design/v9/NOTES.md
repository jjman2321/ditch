# Ditch v9: Sunflower, every review item and owner decision applied (Nov 9, 2026)

v9 starts from a copy of v8 (v8 is untouched). Same brand: sunflower `#FFCC2E`, ink `#16140F`, cream `#FBF7EE`, Archivo Expanded 900 for display and money, Inter for body, and Ditch the duck with a tangerine bill.

## Files
- `screens.html`: every screen. Render with `node shot.js`, or `node shot.js audit` to also run the contrast check.
- `board-onboarding.jpg` (1–8b), `board-app.jpg` (9–14 plus 10-se), `board-dark.jpg` (8 dark screens), `board.jpg` (everything).
- `renders/*.jpg`: one file per screen.
- `MOTION.md`: digit-roll, hold ring with haptic ticks, stamp landing, duck peek, Reduce Motion fallbacks and timings.
- `duck.png`, `duck-dark.png` and `make_ducks.py`: copied over from v8.

## Owner decisions applied
- **Tabs:** Home · Calendar · Ditched, with a house, a calendar and a rubber-stamp icon (filled when active). Settings is a real gear on Home, next to +.
- **Wordmark:** "ditch" is back top-left on Welcome, Home and the empty Home.
- **Pro trial reminders (DECISIONS #15):** the paywall timeline in light and dark is now Today $0 → Fri, Nov 13 9 AM heads-up → Sun, Nov 15 9 AM heads-up → Mon, Nov 16 $29.99.
- **No "saved/recovered" claims:**
  - Ditched says "$215.88 / a year you won't pay." and "You're saving $431 a year · from 3 subs you ditched".
  - The Ditched tab hero says "You're saving $431 a year".
  - The $431 is Netflix $215.88 + Audible Plus $95.40 + Hulu $119.88 = $431.16 a year ($35.93 a month).
- **Paywall headline is now "Get a heads-up before all 6 renewals.", following DECISIONS #11.** The irony line moved into the trial card: "Ditch Pro trial · We'll remind you before we charge, too." **Owner: please confirm.** If you'd rather keep "We'll remind you before we charge you, too." as the headline, it's a one-line swap.

## Review and audit fixes
| Item | Fix |
|---|---|
| Irony-killer never shown on a list | **9b** Home on the Pro path has a "Ditch Pro trial · Mon, Nov 16 · trial ends · $29.99" row with the duck icon and a bell. **8b** You're set shows the trial's heads-up on Fri, Nov 13. |
| Trial reminder breaks the rule | It now follows the rule: Fri, Nov 13 and Sun, Nov 15. "Like the rest" is true. |
| Charge dates was 6 screens | Now **one screen (4)**. Each row has a date chip: confirmed chips have an ink border; guesses are grey with a "Guess" tag. "Save dates" plus "Do the rest later". **4b** is a real month sheet (S M T W T F S, Nov 14 on a Saturday, today circled, past days greyed) with "Set Sat, Nov 14" and "Not sure: use a guess". |
| Ditched dead band, too many blocks, SE | The strip is merged into one line ("New total $72.96 a month · was $90.95"), with the savings line below it. Spacing is balanced. **10-se** (375×667) fits with room to spare. |
| Stamp | Crisper: even ink, a slightly ragged edge, sparse wear marks and one soft lighter patch, with no grainy speckle. The date line is crisp. Still needs real hand-lettering before launch. |
| You're set blurs the limit / dead band | The free version says "All 6 are on your list. 3 get a heads-up." and lists the 3 first heads-ups, then "YouTube Premium, Spotify and Disney+ are tracked with no heads-up. Swap them anytime." It also has a "Change which 3" button. The top band is tighter. |
| Welcome dead band / label formats | The labels now share one format: "Wed, Nov 11 / 9 AM heads-up", "Fri, Nov 13 / 9 AM heads-up", "Sat, Nov 14 / $17.99 charge" (the same format as the paywall). The spacing is rebalanced. |
| "No ads, no nagging" before the paywall | Now "3 days and 1 day before, at 9:00 AM. That's all we'll ever send." |
| Which 3 had a second Pro pitch | Replaced by a quiet line: "You can switch to Pro anytime in Settings." |
| Hold ring track invisible | The track is now white on sunflower with ink progress. |
| Home layout | The list sits in white cards on the 24pt edge. The lifted row is exactly as wide as the cards. Bells sit in one column next to the prices. Section headers have consistent 16/8 spacing. There's more space under the gear/+ row. |
| No hold hint | 9b shows "Hold a sub to ditch it" next to This week (on first visit). |
| Cancel assumes direct billing | The cancel row adds "Billed by Apple? Settings → Subscriptions." (left out on SE to save space; it's in the › sheet there). |
| Sticky total had no fade | It now has a 40pt cream fade, so the list visibly scrolls under it. |
| Empty-state labels | Labels are now "Amazon Prime", "Apple Music" and "ChatGPT". The + is hidden in the empty state, leaving only the gear and the card CTA. |
| Progress bar jumps | 5 steps: Pick 1 → Total 2 → Dates 3 → Reminders 4 → Which 3 5. The paywall is a sheet with no bar. The Pro path ends at You're set. |

## New screens
- **12 Calendar:**
  - Month header with "$75.96 due in November · 5 charges". The 5 charges are 17.99 + 11.99 + 11.99 + 20.00 + 13.99; Amazon Prime falls on Dec 3.
  - Weekday headers, service logos on charge days, sunflower dots on heads-up days (11, 13, 18, 20, 30), today filled.
  - Selected Sat, Nov 14 shows Netflix with its two heads-up chips.
- **13 Ditched tab:**
  - "You're saving $431 a year." hero with a small SINCE JUNE stamp that sits clear of the text.
  - The list: Netflix with "Cancel in Netflix by Sat, Nov 14 ›", Audible Plus and Hulu.
  - An "Adding up" step chart: $119.88 → $215.28 → $431.16.
  - The honest footnote "Ditch can't see your bank…". No streaks or badges.
- **14 Settings (full scroll):**
  - Reminders: health "All good · Next 12 reminders scheduled", heads-ups, time, "Send me a test reminder". In dark mode it shows the "Notifications are off" fix row.
  - Free reminders: 3 of 3 · Change.
  - Ditch Pro: plan, try, restore, manage.
  - Data: iCloud backup (PRO), Export CSV, Currency.
  - About: "Your list stays on your phone", support, rate, terms, privacy, version.

## Contrast
`node shot.js audit` passes on all text except two cases that are on purpose:
- Dimmed rows during a hold: 4.1:1 light, at least 5:1 dark.
- Past or disabled calendar days: 3.1–4.2:1. Disabled controls are exempt from WCAG contrast, and they're still readable.

## Honest scores
| # | Screen | Light | Dark |
|---|---|---|---|
| 1 | Welcome | 9.5 | 9.5 |
| 2 | What do you pay for? | 9.5 | n/a |
| 3 | Your total | 9.5 | 9.5 |
| 4 | Charge dates (one screen) | 9.5 | n/a |
| 4b | Date sheet | 9.5 | n/a |
| 5 | Reminders pre-ask | 9.5 | n/a |
| 6 | Paywall | 9.5 | 9.5 |
| 7 | Which 3 | 9.5 | n/a |
| 8 / 8b | You're set (free / Pro) | 9.5 / 9.5 | n/a |
| 9 / 9b | Home holding / Home Pro | 9.5 / 9.5 | 9.5 |
| 10 / 10-se | Ditched / iPhone SE | 9.5 / 9.5 | 9.5 |
| 11 | Home, empty | 9.5 | n/a |
| 12 | Calendar | 9.5 | 9.5 |
| 13 | Ditched tab | 9.5 | 9.5 |
| 14 | Settings | 9.5 | 9.5 |

## Remaining weak points
- **Stamp art:** good, but still code. Commission or draw the real hand-lettered stamp.
- **Paywall headline** now follows DECISIONS #11. That's the owner's call (see above).
- **Ditched tab numbers** use made-up example ditches (Audible Plus in Aug, Hulu in Jun), chosen so the total is $431. Swap them if the brief changes.
- **Settings** is drawn as a full-length scroll (a taller artboard), not a single 852pt screen.
- **10-se** uses a simplified SE frame (no Touch ID ring drawn).
- **Yearly-renewal story** (Maya's $139 Prime) is still not in the example data. That's the owner's call for the App Store screenshots.
