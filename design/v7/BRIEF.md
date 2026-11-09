# Design brief: Ditch v7 variations (Nov 9, 2026)

The owner wants 3–5 brand/UI variations of the Ditch iPhone app, **every one 10/10** as judged by a real target user. "Plain and non-brandable" was rejected, the previous mascot (raccoon) was rejected, and generic "premium white" was rejected. Take your time; quality over speed.

## The app
Ditch: Subscription Tracker (iOS, Expo/React Native). Shows everything you pay for, reminds you **before each charge** (3 days + 1 day before, 9 AM), and helps you decide what to cancel ("ditch"). Free: unlimited tracking + reminders on 3 subs. Pro: reminders on everything, import, widget, iCloud backup. **Ditch never cancels for you**; the user cancels with the service.

## Target user (research, `docs/research/mascot-or-not.md`)
- iPhone users ~23–40, slightly more women, mostly earning $50k+.
- Something annoyed them: a forgotten charge, a trial that rolled over, or a total higher than they guessed (people guess $86/mo, the real figure is $219).
- They feel a bit guilty and want control. Reliability matters most: Bobby's #1 complaint is reminders that don't fire.
- They hate "a subscription to cancel subscriptions" (Rocket Money reviews: "The irony is heinous").
- They first meet Ditch in the App Store, then in a 2-minute onboarding on their phone, then mostly through lock-screen notifications.

## Brand pieces that stay in every variation
- **Ditch the duck** (name: Ditch). A peeking duck head: round white dome, two dot eyes, a coloured bill sticking out to the right. Cut-out PNGs with bill colours are at `design/brand/duck-orange.png`, `duck-lime.png`, `duck-red.png` and `duck-teal.png` (transparent background, 600×357, head cropped flat at the bottom so it can peek over an edge). You may recolour the bill by editing pixels with Python/PIL (the teal pixels in `duck-teal.png` are the bill). Use the duck only where it makes sense: welcome, as the notification sender/app icon, celebrations and empty states. **Never next to a moving price.** Don't redraw it yourself in SVG (the owner said hand-drawn versions looked bad).
- **The DITCHED stamp**: the signature moment when you ditch a sub. It must never cover readable text; give it its own space.
- **Hold to ditch**: press and hold, a ring fills, the stamp lands with a firm haptic. Deliberate, so you can't ditch by accident.
- **Honest paywall** (Apple rule 3.1.2 + our rules, all required):
  - × visible on the first frame
  - "Continue free: reminders for 3" as a real button
  - Restore · Terms · Privacy
  - the billed price is the most prominent price
  - a real-date trial timeline: Today $0 → Sat, Nov 14 reminder → Mon, Nov 16 $29.99
  - no fake discounts, no countdowns, no weekly plan
  - the CTA "Start 7-day free trial" (for yearly)
  - Plans: Yearly $29.99 (7-day trial, "$2.50 a month"), Monthly $4.99 ("$59.88 a year"), Lifetime $49.99 ("Pay once").
- **The irony-killer idea** (keep it in some form): "We'll remind you before we charge you, too": Ditch Pro trial appears on the user's own list with its reminder.
- **Never claim**: "we cancel for you", automatic detection, "nothing leaves your phone". "Your list stays on your phone" is fine.
- **No streaks, badges or points.** Reward real money only ("You've kept $431 since June").
- **Voice**: short, dry, on the user's side, never shaming. Example notification: "Netflix renews Saturday. $17.99. Still watching?" No AI-sounding phrases, no em-dash chains.

## One consistent example (use these exact numbers)
Today is **Mon, Nov 9, 2026**. Six subs:

| Logo file (`assets/logos/<id>.png`) | Name | Monthly | Yearly | Next charge |
|---|---|---|---|---|
| chatgpt-plus | ChatGPT Plus | $20.00 | $240.00 | Sat, Nov 21 |
| netflix | Netflix | $17.99 | $215.88 | Sat, Nov 14 |
| amazon-prime | Amazon Prime | $14.99 | $179.88 | Thu, Dec 3 |
| youtube-premium | YouTube Premium | $13.99 | $167.88 | Fri, Nov 27 |
| spotify | Spotify | $11.99 | $143.88 | Mon, Nov 16 |
| disney-plus | Disney+ | $11.99 | $143.88 | Wed, Nov 18 |

Totals: **$90.95 a month, $1,091.40 a year (show "$1,091"), about $2.99 a day.** After ditching Netflix: "+$215.88 a year back", and "You've kept $431 since June".

## Screens to design (5 per variation)
1. **Welcome**: the first impression; it must explain the app in one second.
2. **Your total**: the big reveal of the yearly total. The emotional peak of onboarding.
3. **Paywall**: honest, brand-forward, must fit an iPhone 15 screen (393×852) without scrolling.
4. **Home with hold-to-ditch in progress**: the everyday screen, mid-gesture on Netflix.
5. **Ditched**: the celebration after the stamp lands, with Undo.

## Craft rules
- Real phone frame 393×852 (status bar 9:41, Dynamic Island, home indicator). 24pt-ish side margins, 44pt tap targets, 56pt primary buttons.
- Tabular figures for all money. Every number must match the table above.
- Nothing overlaps or gets cropped by mistake (check the notch area, stamps over text, text wrapping into 2 lines in buttons or chips).
- Fonts from Google Fonts are fine (Expo can bundle them). Inter is the stand-in for Apple's SF Pro in body text.
- Pick fonts and colours with intent for this audience: trust and calm, but with personality.

## Reference: Variation 1 (Receipt) already exists
`design/v6/ditch.html` and `design/v6/board.jpg`: subscriptions as a paper receipt, mono numbers, a red rubber stamp, warm paper canvas. Study it for data, structure and the rendering script (`design/v6/shot.js`), but **your variation must be clearly different** in concept, colour, type and layout.

## How to work
1. Write `design/v7/<your-folder>/screens.html` (self-contained HTML; reference assets with relative paths like `../../../assets/logos/netflix.png` and `../../brand/duck-orange.png`). Note: don't name a top-level JS const `top` (it clashes with `window.top`).
2. Render with Playwright (pre-installed: `require('playwright')`, `chromium.launch({args:['--allow-file-access-from-files']})`), viewport wide enough for 5 phones in a row, deviceScaleFactor 2. Save `board.jpg` (all 5) and `s1.jpg`–`s5.jpg`. Write helper scripts as files, not inline heredocs with backticks. Never use `rm -rf`.
3. **Look at your own renders** with the Read tool. Critique them honestly as the target user would, fix, and re-render. Do at least 3 rounds. Stop only when you'd honestly score every screen 9+/10.
4. Write `design/v7/<your-folder>/NOTES.md`: the concept in 2 lines, fonts, colours, what makes it ownable, your honest score per screen, and the weakest point.
5. Don't edit files outside your folder. Don't commit.
