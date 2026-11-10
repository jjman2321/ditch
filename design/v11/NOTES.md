# Ditch v11: onboarding mockups (Nov 10, 2026)

These are mockups for the owner to approve before any building starts. They follow DECISIONS #25 (the approved v11 flow), #14 (the Sunflower look), #19 (facts with no inline citations), #21 (every device), #22 ("reminder", never "heads-up"), #23 (the craft bar) and #24 (freemium). Where the screens give copy, they use `docs/research/onboarding-v11.md` and `paywall-v11.md`. The paywall uses the coordinator's final copy from `docs/research/paywall-wording.md`.

## Files
- `screens.html`: one source file for every screen and size. Fonts are bundled in `fonts/` (Archivo variable, Inter); the duck images were copied from v10.
- `shot.js`: run `node shot.js` to render. It also runs an audit and prints any problem: text past the 24pt edge, under the status bar or home indicator, clipped, truncated or overflowing its box, contrast below 4.5:1 (3:1 for large text), or a lone last word in a headline. **The final run prints nothing, so every check passes.**
- `renders/*.jpg`: 28 screens at 2x. iPhone 12 light (13), dark (`d…`, 4), SE (`se-…`, 6) and iPad 11″ (`ipad-…`, 5).
- `board-onboarding.jpg`, `board-sizes.jpg`, `board-dark.jpg`.

## Example data (US, today Tue, Nov 10, 2026)
| Service | Plan | /mo | /yr | Next charge | Date set? |
|---|---|---|---|---|---|
| ChatGPT Plus | Plus | $20.00 ⚠ | $240.00 | Sat, Nov 21 | yes |
| Netflix | Standard | $19.99 | $239.88 | Thu, Nov 19 | yes |
| YouTube Premium | Individual | $15.99 ⚠ | $191.88 | Tue, Nov 17 | yes |
| Amazon Prime | Monthly | $14.99 | $179.88 | around Thu, Dec 3 | "Not sure" |
| Spotify | Individual | $12.99 | $155.88 | Mon, Dec 7 | yes |
| Disney+ | With Ads | $12.49 | $149.88 | around Sun, Nov 29 | "Not sure" |
| **Total** | | **$96.45** | **$1,157.40 → "$1,157"** | | |

⚠ **ChatGPT Plus ($20.00) and YouTube Premium ($15.99) are not verified yet** (`prices-2026-11.json` marks both "unverified"). Check them from a real US phone or browser before the build ships these numbers.

Every yearly figure is the exact monthly amount × 12, worked out in cents. The hero rounds once, for display only. Reminder dates are 3 days and 1 day before each charge, at 9:00. The trial starts today and charges Tue, Nov 17; its first reminder is Sat, Nov 14.

## Spacing and type
- One 24pt side edge on every phone. Every gap is 4, 8, 12, 16, 24, 32 or 48.
- Line heights snap to 4: title 30/36, heading 20/28, lead 17/24, leadS 16/24, body and label 15/20, sub 14/20, eyebrow 12/16. Money uses tabular figures.
- Headline line breaks use non-breaking spaces ("pay for?", "charge you?", "6 renewals."). Only the hero number and "You're set." are allowed to shrink to fit.
- CTAs are 56pt high and sit 16pt above the home indicator. Secondary buttons are 48pt and text buttons 44pt. Every tap target is at least 44pt.
- **SE:** the duck is hidden first, then the screenshot sample drops to one row. On the Total screen the number sits beside "a year." and the list shows 2 rows plus "4 more". On the paywall the "Up to 3 per subscription" sub-label is dropped. Text never gets smaller, except the paywall headline (26/32) and the free-button label (14).
- **iPad:** one centred column, 512pt of content (440pt on the paywall, 420pt for the day grid). It is capped in height and centred vertically, so nothing floats at the bottom of a 1194pt screen. On iPad the Total list is a rounded card and shows all 6 rows.

## Screen by screen
Scores are honest, for the mockup as drawn (/10).

| # | Screen | What it does for the user and for conversion | What changed vs the build | Score |
|---|---|---|---|---|
| 1 | Welcome ★ | The first frame says what Ditch does and that tracking is free. A sample reminder and a 3-dot timeline show the promise. | "Your list stays on your phone" is gone (owner); the footer is just "Free forever for tracking." The lead says "reminder", not "heads-up". The sample uses the real $19.99 Netflix price. | 9.5 |
| 2 | Quick guess (new) | One tap is a small commitment that makes the next screen a reveal. "No idea" is allowed. | New screen. Six full-width rows (easy to hit, and they work at large text sizes). A tap moves on; the render shows "$25–50" mid-tap. | 9.5 |
| 3 | What you pay for | A tick picks the usual plan, so 6 ticks take 6 taps. The plan is spelled out on the row. | No plan pills. Rows stay the same height and show "Standard · $19.99/mo · Change". The search says "Search 220 services". The bottom bar reads "6 picked · $96.45 a month". | 9.5 |
| 3b | Plan sheet | Picking the right plan is what makes the total correct. | New. A medium sheet titled "Which Netflix plan?" with 3 radio rows, "Not sure? Pick Standard…" and "Enter my own price". | 9.5 |
| 4 | Your total ★ | The "aha". Their real number sits next to their own guess, with one real fact and one money line tied to ditching. | Restructured into two surfaces (yellow hero, cream receipt) with ink text only. No bars, no grey table, no "a day" figure. Biggest charge first. The line reads "Ditch just one you don't use: up to $240 a year you won't pay." (never "save"). "Before sales tax" sits in the header. | 9.5 |
| 5 | Reminders pre-ask | Allowing notifications is what makes the product work. The lock-screen sample uses their own services, prices and dates, and the lead says "Only about your subscriptions. Nothing else." | The title is now "Get a reminder before each charge." The research version named their services, but it ran to 4 lines and broke the edge. Notifications show the Ditch icon (they come from Ditch). Adds the "7 in 10" fact and "Tap 'Allow' on the next screen." | 9.5 |
| 6a | Charge dates: scan | One screenshot fixes the dates (and prices) of everything billed through Apple. | New. It shows a sample of the Apple Subscriptions page so people know which screenshot to take, plus the path "Settings › Your name › Subscriptions". It never claims Ditch "found" anything. | 9.5 |
| 6b | Charge dates: day grid | It asks the question the way people remember it ("around the 19th"). One tap moves on. | Replaces the "GUESS" list. Netflix, "2 of 6", a 1–31 grid, "Last day of the month" and "Not sure". A live sentence: "Next charge: Thu, Nov 19. Then the 19th of every month." Anything left unsure shows as "around Nov 29" from then on. | 9.5 |
| 7 | Paywall ★ (Yearly) | Free vs Pro in 5 literal rows, real trial dates, and the free option always in view. It fits on SE and iPhone 12 with no scrolling. | Layout A with the final copy. Removed the "We'll remind you…" line, the duck card, the second reminder date and the stacked plan cards. The × sits beside the headline. | 9.5 |
| 7b | Paywall (Lifetime) | Being honest about lifetime avoids anger later. | The strip area shows the #6b text. CTA "Pay $49.99 once", fine print "One payment. No renewals." It is the same height as the Yearly state, so nothing jumps. | 9.5 |
| 8 | Which 3 | The limit is easy to see: three filled slots, and the rest are one tap away. | Replaces the bells. A large sheet over the paywall titled "3 free reminders". Each slot shows its price and date and has an ✕. The rest show "Swap in". The CTA is "Keep these 3". | 9.5 |
| 9 | You're set ★ | A receipt that says "it's working", which helps first-week retention. | Replaces the "6 / 3 / 6" stats and the tables. A 3-line checklist (each with a short detail), then "Your first reminders" with the reminder day on the right and the charge day under each name. The duck celebrates. | 9.5 |
| 9b | Almost set (skipped) | It doesn't pretend things are fine. One clear fix. | The title is "Almost set." and the checklist shows "! Reminders are off". The card says "Waiting for your OK". The primary button is **Turn on reminders**, which shows the iOS prompt, or opens Settings if they tapped Don't Allow. "Go to my list" is the secondary. | 9.5 |
| Dark | Welcome, Total, Paywall, You're set | Same layout on a warm ink background. Sunflower is used only for money, CTAs and key fills. | | 9.5 |

## Open items
1. **Paywall copy:** the final wording from `paywall-wording.md` is used as sent, but **the owner hasn't approved it yet**. The #6b Lifetime text now appears *only when Lifetime is picked* (paywall-v11 §4.2), and that move also needs the owner's OK.
2. **Prices to verify:** ChatGPT Plus $20.00 and YouTube Premium $15.99 (US).
3. **Pre-ask title:** the plan was "Get a reminder before Netflix, Spotify and 4 more renew." It broke the 3-line limit and the side edge at 30pt, and the research's own fallback ("…your 6 subscriptions renew.") broke the edge too. I used "Get a reminder before each charge." and let the lock-screen sample (their Netflix and YouTube Premium) show that it's about them. A row of their logos would fit on iPad only. Owner's pick.
4. **Day grid behaviour:** a tap moves on after about 0.6s, so the "Next charge…" sentence is visible as confirmation. Back undoes it. Yearly subscriptions ask for the month first (12 chips) and weekly ones for the weekday (7 chips). Neither is drawn here. The "Not sure" explainer sheet isn't drawn either (copy is in onboarding-v11 §06).
5. **Quick guess currencies:** £/€ use 15 · 30 · 60 · 120 and ₹ uses 500 · 1,000 · 2,000 · 5,000 (not drawn). If the real total is lower than the guess, show "Lower than you guessed. Nice." with no fact line.
6. **Not drawn:** Pro-path You're set (add "✓ Ditch Pro trial on your list · reminders Nov 14 and Nov 16"), Home first run, large Dynamic Type. The rules for those are in onboarding-v11 §3.0 and paywall-v11 §5.
7. **Facts:** "about 2.5× the guess" (C+R 2022) and "7 in 10 people have forgotten to cancel a free trial" (Self Financial 2026; "at least once" was cut to fit one line, and the meaning is the same) must both be listed on Settings → About → Sources.
8. **Duck:** still the v10 placeholder. It needs the professional redraw before launch (CLAUDE.md §8).
