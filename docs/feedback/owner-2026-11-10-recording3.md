# Owner feedback: recording 3 (Nov 10, 6 min, full app walk-through)

Transcribed with faster-whisper and checked against the frames. ✅ fixed in this session · 🎨 needs a design (mockups for approval) · 💬 explained, no change · ⏳ later milestone.

## Onboarding
| # | What the owner said | Status |
|---|---|---|
| 1 | Ticking a service "just changes completely" | ✅ Unticked rows now show the plan and price a tick gives ("Standard · $19.99/mo"); ticking only adds the tick and "Change". |
| 2 | Logos load very slowly; "have our own service for the images" | 💬 They're already inside the app (213 logos, ~5 KB each). In Expo Go every image comes over the internet tunnel from the dev computer, so it's slow; in the real App Store build they load instantly from the phone. |
| 3 | "ChatGPT Plus" with Go / Plus / Pro plans is weird branding | ✅ Renamed to "ChatGPT". |
| 4 | Your total: the price at the top is cut off | ✅ The big number was measured as one string but drawn digit by digit (wider on iPhone). Now measured the same way it's drawn, with room to spare. |
| 5 | "We removed the guess, so why does it say guess" | ✅ "Most people think it's way less. In one study, the real total was 2.5× what people thought." |
| 6 | "Ditch just one you don't use: up to $2,400…" is very bad | ✅ "Not using one? Ditch it before it renews." |
| 7 | Set up reminders button cut off the screen | ✅ Pinned to the bottom, so "Show all" can't push it away. |
| 8 | Dates screen feels very weird | ✅ Rebuilt: pick the day (1–31 grid / month + day), no guesses (DECISIONS #33). |
| 9 | "You removed that animation, which was very good" | ✅ The reminders arrive one by one again, like on the lock screen (skipped with Reduce Motion). |
| 10 | Fact should be about forgetting to cancel free trials | ✅ "7 in 10 people have paid for a forgotten free trial." (fits on one line on every iPhone). |
| 11 | Paywall: white space under Lifetime; title could go lower | ✅ The spare space now sits above the title. |
| 12 | Paywall: text under the trial button not needed | 💬 Kept: it's the trial timeline with real dates ("$0 today · reminder Sat · $29.99 Tue"), required by our honest-paywall rule and expected by App Review next to the buy button. |
| 13 | You're set: the yellow tables don't feel the best | ✅ First real reminder card + checklist that ticks in, no grey lines (DECISIONS #36). |

## App
| # | What the owner said | Status |
|---|---|---|
| 14 | Home: price columns not lined up (Later rows) | ✅ Every row uses the width of the longest price, so bells and prices line up. |
| 15 | Home: GUESS tags look weird | ✅ Gone. "No date yet" section + Add dates sheet. |
| 16 | Ditch screen wording ("One less thing to pay for, once you cancel") | ✅ "Now cancel it, and that's one less charge." (no-price subs). |
| 17 | Ditched tab says "Nothing cancelled yet" after cancelling | ✅ "1 cancelled. Nice. No price on it, so there's nothing to add up yet." With a price it shows "You're saving $X a year". |
| 18 | No screenshot / email / bank statement import in the flow | ⏳ Import is Pro and needs the EAS development build (DECISIONS #16, #29 took it out of onboarding). |
| 19 | The settings icon seems off | 💬 The blue round gear on the right edge of every screen is Expo Go's developer button, not ours; it won't exist in the App Store build. Our own gear was also redrawn as the standard rounded settings gear (it looked like a sun). ✅ |
| 20 | Settings: "Ditch Pro" should be in our font | ✅ The row now shows the ditch Pro lockup. |
| 21 | Calendar day details feel off (the counter part is nice) | ✅ One clear line per charge, no pills; grid unchanged (DECISIONS #36). |
| 22 | Add sheet: should have the onboarding-style picker | ✅ Built (search, chips, ticks, Add N). |
| 23 | Add sheet: can't put the keyboard down | ✅ "Done" bar above the number keyboard; drag the form down to dismiss. |
| 24 | Add sheet: "Remind me" should be more branded / helpful | ✅ Real dates + a live preview of the notification (DECISIONS #36). |
| 25 | The Athletic: no price; trial ends in 137 days | ✅ Trial dates now guess a week out. ⏳ Missing prices belong to the catalog work (top 100 verified first). |
| 26 | Research how others get your subs in (log in / automatic?) | 💬 Answered from `docs/research/autosync.md`; decision needed (see STATUS). |
