# What makes an app feel premium (Tim Gabe, "The Psychology of Premium Apps")

Source: https://www.youtube.com/watch?v=8EAYZe6y3I8 (Tim Gabe, ex-Spotify designer). Transcript pulled Nov 9, 2026.

## The idea in one line
Looks get you picked; **proof that the product works** gets you called premium. Anyone can make good-looking screens with AI and Mobbin now. That's the floor (he calls it the "commodity ceiling"). What gets above it is the stuff people skip.

## His three places premium lives
1. **The boring states AI leaves out.** Showing what just happened, letting people undo, helping when something fails. Researchers call screens that skip this "design theater". Test: on every step of the core flow, does the user know (a) what just happened, (b) how to take it back, (c) what to do next?
2. **One product, not 80 screens.** The same situation must look and read the same everywhere. His example: two different "you've used all your sessions" screens became one pattern: a "2 of 2 used" badge, one plain line, and the exact date it resets.
3. **The worst moment.** Failed payment, no internet, empty list. Handled well, people end up as happy as if nothing went wrong, or happier (the "service recovery paradox"). Fix: say what happened, what to do, and put the help button right there.

## What this means for Ditch

### 1. Every action says what happened and can be undone
| Action | Confirmation | Undo |
|---|---|---|
| Ditch a sub | "Netflix ditched. You'll save $215.88 a year." + success haptic | "Undo" on the toast (5s), and "Bring back" in the Ditched tab |
| Delete a sub | "Netflix deleted" | "Undo" on the toast |
| Add or edit a sub | Row appears/updates in place + "Reminder set for Dec 12, 9:00 AM" | Edit again |
| Turn a reminder on | "We'll remind you Dec 12 and Dec 14" (the real dates) | Toggle off |
| A past charge date rolls forward | "Moved to Dec 15, the next charge" | – |

### 2. One pattern for the free reminder limit (the "2 of 2" lesson)
The free limit appears in onboarding (Pick 3), the sub detail, Settings and the paywall. It must look identical everywhere:
- Badge: **"Reminders 3 of 3"**
- Line: "Free covers 3 reminders. Swap one, or go Pro for all."
- Same two buttons everywhere: **Swap** and **See Pro**.

When Pro lapses, use the same pattern: "Pro ended Dec 3. Your whole list is still here. Reminders are back to 3, so pick which." Nothing is hidden or deleted (Rule 6).

### 3. The worst moments, designed on purpose
Reminders firing is the whole product, so the scariest state is **reminders silently off**.
| Moment | What we show |
|---|---|
| Notifications denied or turned off in iOS Settings | Home banner: "Reminders are off. Your iPhone is blocking them." + **Turn on** (opens Settings). Re-checked every time the app opens. |
| More than 64 reminders (iOS limit) | Nothing for the user to do. We schedule the soonest first and top up on each launch. Settings line: "Next 64 reminders booked." |
| Purchase fails | "Payment didn't go through. You weren't charged." + **Try again** + **Email us** |
| Restore finds nothing | "No Ditch Pro found on this Apple ID." + "Signed in with a different one?" + **Email us** |
| No internet on the paywall | Prices can't load: "Can't reach the App Store right now." + **Try again**. The × still works. |
| Empty Home | Raccoon + "Nothing tracked yet" + **Add your first sub** |
| Empty Ditched | "Ditched subs show up here, with what you saved." |
| Search with no match | "No 'Crunchyroll' in our list" + **Add it yourself** |

### 4. Our own checks before each release
- Walk the core flow (add → remind → ditch) and answer his three questions at every step.
- Use the app for an hour like a real person and note every spot where it stops feeling like the same app.
- Break it on purpose: airplane mode mid-purchase, deny notifications, empty every list, set a charge date in the past, add 70 subs.

These are now in `docs/MANUAL-TESTS.md` under "States and failures".
