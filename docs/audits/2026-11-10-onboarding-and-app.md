# Audit: onboarding and the new app screens (Nov 10, 2026)

Checked from fresh screenshots at iPhone 12, iPhone SE, Pro Max and iPad, light and dark (`node scripts/shoot-v12.mjs`, `scripts/shoot-phase2.mjs`), plus the automated fit audit (text past edges, clipping, orphans, no-scroll). Scores are honest, out of 10, for our user (iPhone, 23–40, anxious about money, wants control) and for conversion.

## Flow
Welcome → What do you pay for? → Your total → Which day does each one charge? → Reminders (lock screen) → Paywall → You're set → Home. 8 screens, about 60–90 seconds. Value comes before every ask: the total before dates, the user's own reminders before the permission prompt, both before the paywall. **9/10.**

## Screen by screen
| Screen | Score | Good | Still to fix |
|---|---|---|---|
| Welcome | 8.5 | Clear promise, real dates in the timeline, duck has a job | Duck still needs the pro redraw |
| What do you pay for? | 8.5 | Local prices, ticking only adds "Change", running total | Import card hidden until import works |
| Plan sheet | 9 | Plain plans, "most common" hint | — |
| Your total | 8.5 | Big honest number, now never clipped; button pinned | Some empty space between the nudge line and the button on tall phones |
| Which day does each one charge? | 8.5 | No guesses, one tap per sub, "You can add the rest later" | 6 subs = up to 6 taps; watch completion once we can measure it |
| Day sheet (monthly / yearly) | 9 | Apple Wallet grid, sentence with the exact reminder days, "I'm not sure" | — |
| Reminders (lock screen) | 9 | Feels like a real phone, newest on top, dates, duck wallpaper | Web preview font crowds the duck; fine on the iPhone |
| Paywall | 8.5 | Personal headline, literal Free vs Pro table, one short price line, × always visible | "All 6 renewals" is a promise that needs dates; OK as a capability, keep an eye on it |
| You're set | 7.5 | Clear checklist, no-date line now plain, Pro count now honest | Yellow table look is still on the redesign list |
| Your 3 free reminders | 8 | Says which ones need a date first | — |
| Home | 8.5 | Prices and bells line up, "No date yet" section and card | "Add dates" opens one sub at a time; a list of all undated ones would be faster |
| Calendar | 7.5 | No fake dates, "No date yet" list | Day detail still on the redesign list |
| Add picker | 8.5 | Same picker as onboarding, multi-add, custom name opens the form | — |

## Wording
- Fixed today: "guess" lines, the $2,400 line, "ChatGPT Plus", "Saves", "heads-up", "One less thing…", the You're set no-date line, the Pro reminder count.
- Voice is short and dry everywhere. No AI phrases found.

## Colour and dark mode
- Sunflower, ink and cream are used consistently. Yellow marks "this is set / this is yours" (date pills, You're set, lock screen), black marks the action. Good split.
- Dark mode: every screen checked. Contrast passes the fit audit.

## Conversion
- Strong: value before each ask, personalised paywall headline, the lock screen shows the user's real reminders before the iOS prompt, honest × path.
- Risk: the dates step adds taps before the paywall. Mitigated by skipping. When import ships, the first import is free (DECISIONS #34) and fills dates in one go.
- Gap: we can't see where people drop off. Consider a privacy-friendly, anonymous counter later (no personal data; re-check the privacy label first).

## Next, in order
1. "Add dates" on Home opens one sheet with all undated subs (like the onboarding step).
2. Mockups: You're set (yellow tables), Calendar day detail, friendlier "Remind me".
3. Import (dev build), then flip `IMPORT_READY`.
