# Variation: Tickets / passes

**Concept.** Every subscription is a pass in your wallet, with a perforated stub, punch notches and the renewal date printed like a boarding time. Your total is the gold "Season pass". Ditching punches out and tears off the stub, and the DITCHED stamp lands on the stub by itself.

## Type
- **Archivo**, condensed (wdth 68–80, 800–900): headlines, big money, pass titles. It reads like a stadium ticket or departure board, but it's still a calm grotesk, not a novelty face.
- **IBM Plex Mono** 500: labels, dates and codes (`RENEWS`, `SAT NOV 14`, `HOLDER`). Airline-utility feel.
- **Inter**: body copy and buttons (stand-in for SF Pro).
- Tabular lining figures on all money.

## Colour
| Token | Hex | Use |
|---|---|---|
| Night | `#0C1322` | canvas (deep navy, like Flighty or a Wallet pass at night) |
| Stock | `#FBF8F1` | pass card stock |
| Gold | `#FFB224` | Season pass, primary buttons, selected plan. Matches the duck's bill |
| Teal | `#0B8C7A` / `#2FC2A8` | the DITCHED stamp, the hold ring, money back |
| Ink | `#0C1322` | text on stock and gold |

How it differs from v6 (Receipt): dark navy instead of warm paper, gold and teal instead of red and black, condensed grotesk plus Plex Mono instead of Bricolage plus DM Mono, and stacked passes and stubs instead of one long receipt.

## What makes it ownable
- **The ticket row.** Each sub is a horizontal ticket, with the price on the body and the date on the stub (`MON / 16 / NOV`). It scans like a departures board.
- **Hold to punch.** While you hold, the ring fills on the stub and the perforation turns teal from the top down. You can see it's about to tear.
- **The torn stub** carries the stamp. The stamp gets its own clear space and never covers text.
- **The Season pass.** The gold total card, in onboarding and as the Home header.
- **Ditch Pro as a boarding-pass route:** Today $0 → Sat, Nov 14 🔔 → Mon, Nov 16 $29.99. It's the irony-killer, shown as a real pass on your list.
- Where the duck appears: peeking over the wallet stack (Welcome), as the app icon on the Pro pass, and over the ditched pass (celebration). Never next to a moving price.

## Honest scores (as a 23–40 target user)
1. Welcome: **9**. You get it in one second: a wallet of renewals plus a heads-up. The duck is friendly but not childish.
2. Your total: **9**. The gold Season pass with a huge $1,091 is the emotional peak. "$1,091.40 exactly" adds precision. The barcode is decorative and a bit of a cliché.
3. Paywall: **9**. All required pieces fit on 393×852 without scrolling. The trial route is the clearest real-date timeline I've seen for this. It's dense, though, with only ~14pt between blocks.
4. Home, hold in progress: **8.5**. The ticket rows scan well and the stub ring is clear. Dimmed rows go a little grey-beige, and the stacked notches between rows read as small "chain links".
5. Ditched: **9**. The torn stub and stamp feel satisfying. Undo is easy to see. "Now cancel it with Netflix" keeps us honest.

## Weakest point
Home. Six ticket rows with notches get busy, and during the hold the Netflix stub swaps its date for the ring, so the date only survives in the small subtitle. Also, everything here is designed dark-only. A light-mode version of the stock-on-navy look isn't designed yet and might lose the premium feel.

Files: `screens.html` (source), `shot.js` (render), `board.jpg`, `s1.jpg`–`s5.jpg`.
