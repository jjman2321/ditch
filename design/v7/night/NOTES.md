# Ditch v7: Night (calm ledger)

**Concept.** Your money at night, under control: a dark ink-navy ledger with one warm light in it.
The duck is that light (a little nightlight that glows on the welcome, in the app icon and on the ditched moment), and the same amber marks only what matters: the next charge, the hold ring, the stamp.

Files: `screens.html` (source), `board.jpg` (all 5), `s1.jpg`–`s5.jpg`, `shot.js` (render), `duck-amber.png` + `recolor.py` (bill recoloured from `duck-teal.png` to the accent).

## Type
- **Newsreader** (Google Fonts, optical sizes, has tabular figures): headlines and the big money numbers ($1,091, $90.95, +$215.88). Italic for one emphasis word ("before", "too.", "a year"). Gives a private-bank, calm feel.
- **Inter** with tabular figures: every list amount, labels and buttons (the precise grotesk next to the serif).
- **Archivo** Expanded Black: the DITCHED stamp only (bank "PAID" stamp style, double rule, date line).

## Colour
| Token | Hex | Use |
|---|---|---|
| bg | `#0A0D14` (top glow `#0E1320`) | canvas, ink navy |
| card | `#121722` | ledger cards, 1px white 7% hairline |
| text | `#F3EFE7` / `#A6ACB9` / `#6B7284` | warm off-white, secondary, muted |
| accent "lamp" | `#FFB547` | duck bill, primary button (dark text `#1B1206`), next charge, hold ring, stamp |

One accent only. Amber reads warm and soft on dark (like Night Shift), not alarm-red.

## What makes it ownable
- **The nightlight duck**: a white duck glowing in the dark is unlike any finance app; it doubles as a strong app icon (duck rising from the bottom of a navy square with an amber glow).
- **Luminous stamp**: DITCHED in glowing amber ink with the date, on its own card under the struck-out row, never over text.
- **Spotlight hold-to-ditch**: while you hold, the list dims and the Netflix row lifts and lights up, with the ring around its logo. It feels deliberate and calm.
- **App Store**: dark, warm screenshots with big serif numbers stand out in a feed of white finance apps.

## Honest scores (as a 23–40 money-anxious user)
| Screen | Score | Note |
|---|---|---|
| 1 Welcome | 9 | Notification + list explain the app at a glance; duck glow is warm. |
| 2 Your total | 8.5 | Clear and calm, maybe *too* calm for the emotional peak. Needs the count-up + glow animation to land. |
| 3 Paywall | 9 | All honest parts on one screen; the "Ditch Pro on your list" timeline is the hero. |
| 4 Home (holding) | 9 | Spotlight reads instantly; reminders-on-3 bells show the free limit honestly. |
| 5 Ditched | 9 | Stamp, money back, new total, plus the honest "now cancel it in Netflix" step. |

## Weakest point
The duck PNG has a black outline that disappears on navy, so on dark it reads as a white dome held together by the glow. It works at large sizes, but in small spots (notification icon) it is less crisp than on light. A white-outline version of the duck art for dark mode would fix it. Second: the stamp is a font plus texture filter, not truly hand-drawn yet.
