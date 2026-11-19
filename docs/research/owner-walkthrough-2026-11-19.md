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
