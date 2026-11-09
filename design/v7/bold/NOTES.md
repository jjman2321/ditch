# Ditch v7 · Bold: "Sunflower"

**Concept.** Ditch owns one colour: sunflower yellow, the colour of a heads-up. Sticky notes, highlighters and road signs that warn you *ahead* are yellow, and a heads-up before the charge is exactly what Ditch sells.
Brand moments (welcome, total, ditched) go full-bleed sunflower with huge ink type; work screens (home, paywall body) stay calm cream with one yellow block.

## Colour
| Token | Hex | Use |
|---|---|---|
| Sunflower | `#FFCC2E` | Full-bleed brand moments, home total card, paywall header, app icon tile |
| Ink | `#16140F` | All type on yellow, primary buttons, the DITCHED stamp, hold-to-ditch card |
| Cream | `#FBF7EE` | Work-screen canvas |
| White | `#FFFFFF` | Cards, notifications |
| Bill | `#FF6C2C` | Ditch's bill only (recoloured from `duck-teal.png` with `recolor.py` → `duck-ditch.png`) |

Why yellow: no subscription or money app owns it (Rocket Money red, Monarch orange, Copilot/YNAB blue-purple, Cash App/Robinhood green, Bobby orange). Ink on sunflower is roughly 14:1 contrast, so it reads as confident rather than cute. It's warm golden, not lemon, so it feels adult. It's also a duck colour, and a white duck with a tangerine bill pops on it. Yellow is never used for text on white; it's only ever a fill.

## Type
- **Archivo** (Google Fonts), width 118–125%, weight 900 for display and money. It's a wide, chunky grotesk, so prices look solid and deliberate. Tabular figures.
- **Inter** for body (it stands in for SF Pro).
- No mono and no receipt metaphor, so it's clearly different from v6.

## What makes it ownable
- One colour you can spot across a room: the App Store screenshots, the app icon (duck peeking up from the bottom of a yellow tile) and the lock-screen notification icon all match.
- Ditch peeks over whatever it's keeping an eye on: the notification (welcome), your own Pro trial (paywall), the sub you just ditched (ditched). That one repeated gesture is the brand.
- An ink rubber stamp on yellow for DITCHED. It sits in its own space and never covers text.
- The irony-killer is literal: "Ditch Pro trial" shows up as a row on your list, with Ditch's icon and a real-date reminder timeline.

## Honest scores (as a 23–40 target user)
| Screen | Score | Note |
|---|---|---|
| 1 Welcome | 9.5 | You get it in one second: the headline plus a real notification. The duck is the hero. |
| 2 Your total | 9 | `$1,091` fills the width and lands hard. The list underneath explains it. There's some empty yellow above the copy. |
| 3 Paywall | 9 | Fits 393×852 with no scrolling. × on the first frame, a real "Continue free" button, Restore/Terms/Privacy, and the billed price is the biggest one. |
| 4 Home (holding) | 9 | Calm and readable. The ink hold card and yellow ring are clear. It's the least "branded" screen by design. |
| 5 Ditched | 9 | Big payoff with an honest "you still cancel in Netflix" note and Undo. |

## Weakest point
Yellow is a risk: some people read it as "caution", and crypto apps like Binance use yellow on black. The full-bleed screens also need a separate dark-mode treatment, which isn't designed yet (probably an ink canvas with yellow numbers). The home screen leans on a single yellow card for its personality.

## Files
- `screens.html`: source for all 5 screens. Render with `node shot.js screens.html board`.
- `board.jpg`, `s1.jpg`–`s5.jpg`: the renders.
- `recolor.py`, `duck-ditch.png`: the bill recolour.
