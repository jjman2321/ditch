# Charge dates: how other apps ask, and what Ditch does (Nov 10, 2026)

The owner picked **option B** (ask the day of the month, no guesses) after recording 3 ("GUESS tags look weird", "this page is very weird") and asked what other apps do.

## What others do
| App | How it gets the date | Source |
|---|---|---|
| **Apple Wallet** (Apple Card payments) | "Payment Date": *Due Date* or *Other Date*, then a **1–31 grid** and a sentence: "Your payment will occur on the 11th of every month." | [Mobbin](https://mobbin.com/screens/26161afc-b067-45fe-86d4-0188c949ff8f) |
| **Orbit** (subscription tracker) | Add form with "Payment date" (a full calendar). **Defaults to today** if you don't touch it. Import from photos / a file sits at the top of the add list, locked for Pro. | [Mobbin form](https://mobbin.com/screens/9666985d-4303-48ea-8ae4-9f4d96a4d700), [flow](https://mobbin.com/flows/78e8655b-afa5-43db-ab32-42b53002a748) |
| **Rocket Money** (manual bills) | "Next bill due*" is required, full calendar. Most dates come from the bank link. | [Mobbin](https://mobbin.com/screens/9d3f088c-2670-4a8b-80f6-93f6ac3e91a2) |
| **Cleo** | "When is this next paid?" full date field. | [Mobbin](https://mobbin.com/screens/6bdbd003-43a8-4a39-84b1-4f4f50c407d8) |
| **Ubank** | "Next due date" DD / MM / YYYY plus "Remind me a day before it's due". | [Mobbin](https://mobbin.com/screens/f78c0ae3-c163-40e8-ada1-ff876f8ec077) |
| **Bobby** (closest competitor) | "First bill" date hidden under *More options*; a forum user got the meaning wrong and had to back-date it. | [GadgetHacks](https://ios.gadgethacks.com/how-to/keep-track-what-you-spend-spotify-netflix-other-online-subscriptions-using-your-iphone-0170450/), [MPU forum](https://talk.macpowerusers.com/t/thoughts-on-bobby-and-tracking-subscriptions-in-general/15698) |

**Patterns**
1. **Nobody guesses.** Every app asks for a real date.
2. Several (Orbit, Bobby) quietly **default to today** when you skip it. That's a hidden wrong date, and the reminder fires on the wrong day. That is the exact failure our user fears (reminders that don't fire, or fire wrong, are the #1 Bobby complaint).
3. Full calendars make you scroll months; **Apple's own 1–31 grid** is faster for monthly bills and says the result in plain words.
4. Bank-linked apps (Rocket) get dates automatically. Without a bank link, the honest shortcut is import (an Apple subscriptions screenshot shows exact renew dates), which is Pro and needs the development build.

## What Ditch does (mockup: `design/v13-dates/board-dates.jpg`)
- **Onboarding** "Which day does each one charge?": one row per sub. Monthly → **Pick day** (1–31 grid + "Last day of the month"). Yearly → **Pick date** (month, then day). Set rows turn sunflower: "Every 19th · next Thu, Nov 19". "Skip the rest for now" is always there.
- **The sheet says what will happen**: "Charges on the 16th of every month. Next: Mon, Nov 16. Reminders Fri, Nov 13 and Sun, Nov 15 at 9 AM." "I'm not sure" leaves it blank.
- **No fake dates.** A skipped sub has **no date**: Home shows it under "No date yet" with an **Add date** link and a quiet bell, and one card on top says "4 have no date yet, so no reminders. Add dates ›". The free 3 reminders go to subs that have dates.
- Totals still count undated subs (the price is known); the calendar lists them under "No date yet".
- Later: import fills exact dates for App Store subscriptions (Pro, dev build).

## Why it helps the user and conversions
- Reliability is the product: a reminder only exists when it can be right.
- One tap per sub keeps onboarding short; skipping is never punished.
- The sentence under the grid shows the reminders working before the paywall, which supports trial starts.
- "No date yet · Add date" is a clear, finishable to-do that brings people back (retention), instead of GUESS tags that read as "this app isn't sure".

## Reminder bells and import (owner follow-up, Nov 10)
- **Bells:** Orbit and Rocket Money show only "Renews in 4 days · 28 Nov" on each row, with no per-row reminder status. Ditch keeps its own drawn bell (sunflower fill = reminder on, grey outline = off) because the free 3 make reminder status matter on every row. Emoji are never used for icons.
- **Where import goes** (Orbit puts "Import from photos" and "Import a file" at the top of Add, locked for Pro: [Mobbin](https://mobbin.com/screens/5702f396-80eb-4f99-845a-7f64a28d4962); Brink ends a screenshot import with "We found 13. Uncheck any that aren't right": [Mobbin](https://mobbin.com/screens/d26c1251-848d-4740-8b39-ac056cd08eda); Rocket Money's add menu has "Track a free trial": [Mobbin](https://mobbin.com/screens/acd7fd86-d95d-44c0-80d2-1011c75a602f)):
  1. **Top of Add** (screen 5): "From a screenshot" and "From a bank statement", both Pro.
  2. **Onboarding "What do you pay for?"** (screen 0): "Find them for me" with **Screenshot** and **Bank statement** (Pro). A statement (PDF or CSV) finds the subs people forgot, which is the strongest "see everything you pay for" moment; it ends in the same check list. Ticking by hand stays the main path.
  2b. **Onboarding dates step** (screen 1): "Fill from a screenshot or statement" (Pro), shown before the paywall so it sells Pro.
  3. **Home "No date yet" card** (screen 3): "Add dates" or "Use a screenshot" (Pro).
  4. **The result** (screen 6): "We found 4." Exact prices and dates filled in; nothing is added until the user confirms; already-listed subs just get their date.
- Import needs the EAS development build (on-phone text reading). Until it ships, the Pro rows open the paywall in Expo Go.
