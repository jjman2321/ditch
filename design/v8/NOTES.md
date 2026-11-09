# Ditch v8: Sunflower, full flow (Nov 9, 2026)

This builds on v7 "Sunflower", which the owner picked and the review ranked #1 (8.4/10). The look is the same: sunflower `#FFCC2E`, ink `#16140F`, cream `#FBF7EE`, Archivo Expanded 900 for money and headlines, Inter for body, and Ditch the duck with a tangerine bill. It now borrows Home and data ideas from Night and the honesty copy from Tickets and Receipt.

**New system idea: the heads-up timeline.** The same three-dot line (heads-up → heads-up → charge) shows up on Welcome, Charge dates, the Paywall and You're set. It's what the app actually does, drawn the same way every time.

## Files
- `screens.html`: all 16 screens. Render with `node shot.js` (add `audit` to print any small text under 4.5:1 contrast).
- `board.jpg`: everything. `board-light-a.jpg` (1–6), `board-light-b.jpg` (7–11), `board-dark.jpg`.
- `renders/01-welcome.jpg` … `renders/11-empty.jpg`, plus `renders/d01, d03, d06, d09, d10` for dark mode.
- `duck.png` (tangerine bill) and `duck-dark.png` (the same duck with a thin cream sticker edge so the black outline reads on ink). Both are built by `make_ducks.py` from `design/brand/duck-teal.png`.

## Review must-fixes: what changed
1. **Home while holding:** the Netflix row lifts in place, turns sunflower in light mode (ink ring on its logo) and gets a sunflower border in dark mode. Name, date and $17.99 stay visible. It says "Ditching saves $215.88 a year. Let go to keep it." The list is grouped This week / Next week / Later, with a bell column showing the 3 reminders (ChatGPT Plus, Netflix, Amazon Prime) and "Reminders on 3 of 6" on the total card.
2. **Welcome:** the duck is 146pt wide (down from 224, about 35% smaller). The notification sits above a heads-up timeline: Wed 9:00 AM, Fri 9:00 AM, then Sat, Nov 14 when Netflix charges. The "ditch" wordmark is gone because the headline already says it.
3. **Ditched:** one clear row, "Now cancel it in Netflix · So Saturday's $17.99 doesn't go through. · Account → Cancel membership · 1 min", plus a strip showing new total $72.96 a month, was $90.95.
4. **Total:** a "Where it goes" card with thin share bars for each sub, sized to its real yearly cost (ink bars in light, sunflower bars in dark). "$2.99 a day" is kept.
5. **Polish:**
   - Curly apostrophes everywhere.
   - 20pt above the plans.
   - Unselected plan borders are now `#D9D0BD`.
   - The `shot.js audit` contrast check passes on every screen. The one exception is on purpose: the dimmed rows during a hold are 3.8:1 (the review asked for at least 3:1).
   - Nothing sits under the Dynamic Island and nothing is cropped. The chip row on screen 2 is meant to scroll and fades at the edge.
6. **Stamp:**
   - It's an SVG with a hand-wobbled double border and each letter slightly rotated and shifted.
   - Ink spreads a little into the paper, with dry-ink pinholes, uneven pressure (one side prints lighter) and a faint second hit.
   - The date "NOV 9 · 2026" uses a lighter treatment so it stays readable.
   - **The final stamp should be hand-lettered** (scanned rubber stamp or drawn lettering) before launch. The code version is a good stand-in, not the final art.

## The flow (light mode)
1. Welcome · 2. What do you pay for? (search, chips, tick list, sticky sunflower running total) · 3. Your total · 4. Charge dates (Every month / Every year switch, day grid, next charge and both heads-up dates) · 5. Reminders pre-ask (a sunflower lock screen on Fri, Nov 13 at 9:00 with both Netflix heads-ups stacked, and the duck as wallpaper) · 6. Paywall · 7. Which 3 get reminders? (3 biggest pre-picked, "Reminders 3 of 3") · 8. You're set (first heads-up Wed, Nov 11 at 9:00 AM, then ChatGPT Plus Wed, Nov 18 and Amazon Prime Mon, Nov 30) · 9. Home while holding · 10. Ditched · 11. Home, empty ("Nothing to watch yet." with the duck peeking over the card, plus a Quick add grid).

## Dark mode
- Warm ink canvas `#12110E`, cards `#1E1C18` with hairlines, cream text `#F6F0E3`.
- Sunflower only for big money, the CTA, the selected plan, the heads-up dots and the stamp ink. No full-bleed yellow at night.
- The duck stays white, with a cream sticker edge.
- The app-icon tile stays sunflower, because app icons don't switch with dark mode.

## Honest scores
| # | Screen | Light | Dark |
|---|---|---|---|
| 1 | Welcome | 9.5 | 9.5 |
| 2 | What do you pay for? | 9.5 | n/a |
| 3 | Your total | 9.5 | 9.5 |
| 4 | Charge dates | 9.5 | n/a |
| 5 | Reminders pre-ask | 9.5 | n/a |
| 6 | Paywall | 9.5 | 9.5 |
| 7 | Which 3 get reminders? | 9.5 | n/a |
| 8 | You're set | 9.5 | n/a |
| 9 | Home, holding | 9.5 | 9.5 |
| 10 | Ditched | 9.5 | 9.5 |
| 11 | Home, empty | 9.5 | n/a |

## Remaining weak points
- **The stamp is still code.** It looks hand-made, but a real hand-lettered stamp will look better and can double as the app-icon and widget accent.
- **Ditched has a lot on it:** card, stamp, number, kept line, totals strip, cancel row and buttons. On an iPhone SE-sized screen the strip should drop below the cancel row or be removed.
- **Dimmed rows during a hold** are 3.8:1. That's fine for a moment that lasts under a second, but they shouldn't stay dimmed after the user lets go.
- **The sticker edge on the dark duck is subtle.** At 20pt (notification size) the yellow app tile does the work, so that's fine.
- **The lock-screen preview (5)** uses sunflower wallpaper. Real users' wallpapers vary, so it's clearly a mock-up, not a promise.
- **Yearly renewals:** the review suggests the App Store screenshot and Welcome should show a yearly renewal (e.g. Amazon Prime $139). The brief locks the numbers, so this is the owner's call.
