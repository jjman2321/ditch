# Owner's screen recordings, Nov 19 (3 videos, ~11 min)

Watched every frame (1 every 3 s) and transcribed the owner's voice. Times are video:minute:second. Owner's words are paraphrased; the list is what he raised plus what the frames show.

## What he liked
Welcome screen ("nice, I like it"), the slides, "Where should we look?", Pick them myself ("easy, good"), plan sheet (Claude Pro/Ultra), the dates step ("clean"), "You're set", Home, Ditched empty, Calendar ("clean"), the editor's notes idea, Ditched moment ("nice").

## What he raised (grouped)

### A. Wording
1. **"at 9 AM" everywhere** (v1 0:20, 4:07, v2 0:40). 9 AM is the default, not a rule; copy should say reminders come at the time you choose (default 9 AM). Slides, reminders step, You're set, Settings intro.
2. **"A reminder before it charges."** (v1 0:38): "charges" is unclear.
3. **"FREE ONCE"** (v1 0:54–1:09) doesn't say these are Pro features; should say the first one's free, then it comes with Pro.
4. **"2 AI chat plans · $219.99/mo · Pick one"** (v1 5:57): he didn't understand what it wanted.
5. **"Skip the Thu, Nov 19 reminders"** in the editor (v1 7:17): didn't understand.
6. **"It charges… Too close for a last check"** on the Ditched screen (v1 9:18): doesn't make sense.
7. **"APPLE.COM/BILL"** on the statement screen (v1 1:54) looks gimmicky.
8. Paywall fine print: yearly "Renews yearly until you cancel" is clutter; "Then $59.99/yr from Nov 26." is enough (v1 4:56). Lifetime "Pro for good, nothing renews" is good; weekly is good. (Note: auto-renewal law wants renewal terms clear; see plan.)

### B. Instructions that aren't intuitive (users 25–60+)
9. **Apple list and statement screens** (v1 1:12–2:15): too many arrows ("Settings → your name → …"); wants visual, can't-get-it-wrong steps like top apps.
10. **"Missing any? / Find the ones you forgot"** (v1 7:28, 8:13): same arrows; "takes you completely out".

### C. Flow consistency
11. **"Track a free trial"** (v1 7:36–8:00) shows a different search list than the normal Add list; should use the usual interface.
12. **Find / Missing any** open separate full pages that feel like leaving the app (v1 8:04–8:13).
13. **Report a problem / Suggest a feature / Suggest a subscription** open Mail (v2 1:26, v3 0:00). Wants an in-app form.

### D. Visual / layout
14. **Your total: the big number is cut off** ("$2,64**0**" clipped at the top on his iPhone) — "always been cut", must fit every device incl. Duo and iPad (v1 3:14).
15. **Lock-screen animation on the reminders step** isn't clean (cards overlap mid-animation at v1 4:00).
16. **Paywall** (v1 4:23–5:21): duck looks cut off / not integrated; plan buttons too small; big empty gap between table and plans on his phone. Wants bigger plan buttons that fill the screen on every device, duck part of the table.
17. **Calendar "+1"** on a day with two subs looks off (v1 6:13).
18. **Editor notes**: placeholder values ("you@email.com", "Shared with Sam…") look like real data (v1 7:04).
19. **Ditched sub**: grey/black the logo so it looks ditched (v2 0:07).
20. **Margins / empty space**: "is our app stretched? too much space top and bottom?" (v1 1:43); lots of empty space at the bottom of Home and the Ditched screen on iPhone 12, "built for the SE" (v1 9:06).
21. **Hold to ditch**: your finger covers the text while holding; is it the best way? (v1 8:47).
22. Home "nothing really pressable" — wants more useful things to tap (v1 6:31).
23. "You're set" page is a bit plain/empty (v1 5:28).

### E. Logic ("needs a specific pipeline")
24. **No date yet** (v1 3:41, 8:24, v2 0:16): what happens if they skip? Reminders on the day? Maybe default to the day they added it.
25. **Payday logic / time zones / midnight** (v2 0:50): unclear; wants rules that hold in every case and tests for every state.
26. **Test every state**: 0, 20, 30, 50, 60 subscriptions, every device (v1 6:16).
27. Test notification arrived ~15–20 s late (v1 5:43).
28. Settings "Remind me" etc. feel slow (v2 0:38).

### Bug found in the frames
- The Ditched screen says **"Cancel by Thu, Nov 19"** because ditching stores the next charge as "cancel by" automatically, so the earlier "Charges vs Cancel by" fix never triggers. Fix in the data, not just the label.

## Research (Mobbin, Nov 19) and the plan
| # | Fix | Based on |
|---|---|---|
| 1 | Reminder time: "3 days and 1 day before. You pick the time." Default 9 AM stays in Settings, not in onboarding copy | Owner |
| 2 | Slide 2 title: "A reminder before you pay." | Owner |
| 3 | Tags: "1 FREE, THEN PRO" | Owner |
| 4 | Overlap card: "You pay for 2 AI chat apps. Need both?" | Owner |
| 5 | Skip toggle: "Already paid this one? Skip its reminders" | Owner |
| 6 | Ditched screen: "Charges Thu, Nov 19. Cancel today to stop it." + fix the auto "Cancel by" data bug | Owner + frames |
| 7 | Statement screen: "Apple's charges all look the same on a statement…" (no APPLE.COM/BILL) | Owner |
| 8 | Yearly fine print: "Then $59.99/yr from Nov 26. Cancel anytime." (one line; still says it renews by the price) | Owner + law |
| 9 | Visual steps: 3 numbered cards with a drawn iPhone screen and the row to tap highlighted + tap dot; deep-link button | [Sweatcoin](https://mobbin.com/screens/3963cfe5-df6c-49b0-8650-283c95db318e), [Cash App](https://mobbin.com/screens/99208919-11c6-42f4-a1a6-353ba875fe6f), [Google](https://mobbin.com/screens/73101647-2740-45fb-aa4d-82aebce34ebf), [Orbit](https://mobbin.com/screens/143d819c-dc6a-41c6-9451-54e408bbbb1b) |
| 10 | One add sheet everywhere: Track a free trial = same sheet with the trial switch on; Missing any? = same sheet with search focused | [Orbit add](https://mobbin.com/flows/78e8655b-afa5-43db-ab32-42b53002a748), [Rocket Money](https://mobbin.com/flows/aa321cb3-1155-4319-913e-3248da1e247a) |
| 11 | In-app feedback sheet: chips (Problem / Idea / Missing service), text, optional screenshot + email, Send, duck "Got it" | [Substack](https://mobbin.com/screens/a3a6cddc-4f32-4e6e-ba99-82f42be65a32), [Yami](https://mobbin.com/screens/d8939cf6-d9b1-4139-ac31-07b8f211a312), [Clue](https://mobbin.com/screens/ae9bbd7e-bf98-4bcc-834d-b6e8e97877e9). Sends to a small ditchsubs.app endpoint (privacy label check) |
| 12 | Paywall: duck whole in its own header space (scales, never cropped); plan cards 64–72pt, fill the space on every phone | [Yazio](https://mobbin.com/screens/d444f04c-d1b9-4872-a056-a0dff266f600), [BitePal](https://mobbin.com/screens/de10057f-86df-48b6-bae9-8f3bc8eb854a), [DailyArt](https://mobbin.com/screens/9ab25919-5957-45e3-b2d7-bfcf713bbb79) |
| 13 | Ditching: swipe left on a row = Ditch; long-press menu (Ditch / Edit / Skip); hold-ring moves into a big button on the detail screen so the finger never covers the name | [Cleo](https://mobbin.com/screens/e571046b-44c2-41d4-a6c0-129cd8443270), [monday.com](https://mobbin.com/screens/934eb64d-5479-4f6d-8c6f-3e28434f4f57) |
| 14 | Calendar: up to 2 overlapping logos, 3+ = 2 logos + ink count circle | [Rocket Money](https://mobbin.com/screens/659d619e-4062-4cb0-9dff-8c986a7924f5), [Orbit](https://mobbin.com/screens/954dab6c-e3ed-4104-aae0-e5039bd5012f) |
| 15 | Optional fields: "Email (optional)" label, prompt placeholders in light grey, no fake data | [Rocket Money](https://mobbin.com/screens/fa648fc8-007a-4994-8946-e16208a69207), [Pangea](https://mobbin.com/screens/5908b677-67d5-4494-a0b0-6e70081a33b2) |
| 16 | Short lists: one-tap "Missing any?" logo row + dashed "Find my subscriptions" card under the list | [Ubank](https://mobbin.com/screens/9bbc33b2-7e59-49b5-8c8b-fb3da8f1918b), [Origin](https://mobbin.com/screens/daa3a327-0378-463f-a810-8ef6efdb7005) |
| 17 | Ditched look: logo grey (~60%), price struck through, DITCHED tag kept | [Revolut](https://mobbin.com/screens/f4e3b120-5492-4171-97c6-be853b4b899d), [Ro](https://mobbin.com/screens/7dd6efef-874d-466f-8a02-3a45ca37c048) |
| 18 | Your total: number always fits (shrink-to-fit on every width incl. Duo/iPad) | Owner |
| 19 | Reminders-step animation: cards land one after another with no overlap | Owner |
| 20 | No-date rule: a sub with no date gets no reminders and stays in "No date yet" with one tap to add; if the user says "I just paid", today becomes the date | Owner (pipeline) |
| 21 | Payday rule written down: day-of-month in the phone's time zone, date-only, last-day clamp; tests for every month and midnight | Owner (pipeline) |
| 22 | State tests: 0 / 1 / 3 / 20 / 60 subs × SE / 12 / Pro Max / Duo / iPad screenshots | Owner |
| 23 | Margins: check against Apple's 16–20pt sides; trim the bottom gaps on taller phones | Owner |
| 24 | Test reminder: fire after 1 s, not 5 | Owner |
