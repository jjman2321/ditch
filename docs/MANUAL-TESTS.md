# Manual tests (on your iPhone)

A click-through checklist for each feature. Tick the boxes as you go. If something fails, tell Claude which step and what you saw (a screenshot helps).

Sections get added as each feature is built. ⏳ = not built yet.

---

## 0. Docs review (now)
- [ ] Open the repo on GitHub and read `docs/SPEC.md` §3 (screens) and §12 (open questions).
- [ ] Check the prices in SPEC §6: $4.99/mo, $29.99/yr with a 7-day trial, $49.99 lifetime.
- [ ] Check the free tier in SPEC §7: unlimited tracking, reminders on 3.
- [ ] Reply "OK" or list what to change.

## 1. Onboarding (built Nov 9, Phase 1: Sunflower look)
Start the app fresh (close it fully in the app switcher, then open it). Phone in **light mode** first.

**Welcome**
- [ ] Yellow screen, big "Ditch it before it renews.", a duck peeking over a Ditch notification about Netflix.
- [ ] The three dates under it are real: 2 days from today, 4 days from today, 5 days from today.
- [ ] Tap **See what I pay**.

**What do you pay for?**
- [ ] Real logos. Tick Netflix, Spotify, ChatGPT Plus, Amazon Prime, YouTube Premium and Disney+. Each tick gives a tiny tap.
- [ ] A yellow bar appears: "6 picked · $90.95 a month" (with today's catalog prices).
- [ ] Try the search box and a category chip. Untick one: the bar updates.
- [ ] Scroll to the bottom: "Import from a screenshot" opens a "not in this build yet" screen. Tap **Pick them by hand** to come back.
- [ ] Tap **See my total**.

**Your total**
- [ ] The big number rolls up digit by digit, then you feel one light tap. It should be the yearly total of what you ticked (6 picks above: **$1,091**). Check it with a calculator: monthly price × 12, added up.
- [ ] "$90.95 a month" and "$2.99 a day" show under it, and the bars grow in.
- [ ] Go back and forward again: the number does **not** roll a second time.

**When do they charge you?**
- [ ] Every date starts grey with a GUESS tag. "0 of 6 confirmed".
- [ ] Tap Netflix's date. A sheet slides up. Pick **From my last receipt**, then a day last month (e.g. Oct 14). The card says "Last charged Oct 14, so next is Sat, Nov 14" and lists 2 heads-ups.
- [ ] Tap **Set next charge…**. Netflix's chip turns solid black, the GUESS tag goes away, "1 of 6 confirmed".
- [ ] Open another one, choose **Next charge**, pick a future day, set it. Past days can't be picked in this mode; future days can't be picked in receipt mode.
- [ ] Open one more and tap **Not sure: use a guess**: it stays a guess.
- [ ] The button reads "Save 2 dates, keep 4 guesses". Tap it.

**A heads-up before every charge**
- [ ] A yellow lock screen shows your soonest real date. Two notifications drop in one after the other, then the duck rises.
- [ ] Tap **Turn on reminders**: the real iPhone permission prompt appears. Allow it.
- [ ] (Second run) Tap **Maybe later** instead: no prompt.

**Paywall**
- [ ] The × is visible straight away, and the plans, the black button and "Continue free" all fit without scrolling.
- [ ] Headline says "before all 6 renewals". The timeline shows Today $0, two 9 AM heads-ups (3 days and 1 day before), then the charge 7 days from today.
- [ ] Yearly is pre-selected with a **Save 49%** tab, "$29.99/yr" and "$2.50 a month". Monthly says "No free trial" (no yearly price). Lifetime says "Pay once".
- [ ] Tap Monthly and Lifetime: a light tap, the card text and the button change, nothing jumps. Lifetime says bank sync would be a separate plan.
- [ ] Tap **Start 7-day free trial**: a box says purchases aren't switched on yet and nothing was charged.
- [ ] **Restore** says there's nothing to restore. **Terms** and **Privacy** open the website.
- [ ] Tap **Continue free: reminders for 3** (or ×).

**Which 3 get reminders?**
- [ ] Your 3 biggest yearly charges have yellow bells. Tap a 4th bell: the "Reminders 3 of 3" badge wiggles and you feel a warning buzz. Nothing changes.
- [ ] Turn one off, turn another on. Tap **Save my 3**.

**You're set**
- [ ] "First heads-ups" lists your 3, soonest first. Guessed ones say "around".
- [ ] The line under it names the subs with no heads-up and quotes a guessed one's wording.
- [ ] Counts: 6 tracked · 3 with heads-ups · 4 dates to check.
- [ ] If you said **Maybe later** to notifications, the line says notifications are off instead.
- [ ] **Go to my list** opens Home (a simple list for now).

**Dark mode, text size, VoiceOver, motion**
- [ ] Switch the iPhone to Dark mode and run through again. Everything is readable; the lock-screen picture stays yellow.
- [ ] Settings → Accessibility → Display & Text Size → Larger Text, near the largest. Body text grows, big headlines stay put, the paywall timeline turns into a list.
- [ ] Turn on VoiceOver: every button, tick, bell, plan and calendar day reads out what it is.
- [ ] Turn on Reduce Motion: the total fades in instead of rolling, the duck doesn't rise.

## 2. Money math ⏳ (M1)
- [ ] Add Netflix at $15.49 monthly. Detail shows $185.88 a year.
- [ ] Add something at $99 yearly. It counts as $8.25/mo in the Home total.
- [ ] Add one in CAD. Home shows **two** totals (USD and CAD), never one mixed number.

## 3. Dates ⏳ (M1)
- [ ] Add a monthly sub whose next charge is Jan 31. The upcoming list shows Feb 28 (or 29), then Mar 31.
- [ ] Add a sub with next charge **today**. It shows as "Today", not next month.

## 4. Reminders ⏳ (M1). The most important section.
- [ ] Settings → Send a test reminder. It arrives within a few seconds, even with the app closed.
- [ ] Add a sub that charges in 3 days, with reminders on. Set the reminder time to 2 minutes from now (Settings), lock the phone and wait. The notification arrives.
- [ ] Edit that sub's date to next month. The old reminder does **not** arrive.
- [ ] Ditch a sub that has a reminder pending. The reminder does **not** arrive.
- [ ] Restart the phone and wait for a scheduled reminder. It still arrives.
- [ ] Free: try to turn on a reminder for a 4th sub. It asks you to swap one of your 3 (or offers Pro), and nothing is deleted.
- [ ] Turn notifications off in iOS Settings. Home and Settings show "Reminders are off" with a button to fix it, and the app still works.

## 5. Add / edit / delete ⏳ (M1)
- [ ] Add from the catalog: the price pre-fills and you can change it.
- [ ] Add a custom one with every field filled in. All of them show on the detail screen.
- [ ] Edit the price. The totals update.
- [ ] Delete one. It's gone from Home and Subs and doesn't show in Ditched.

## 6. Ditch it ⏳ (M1)
- [ ] Detail → How to cancel opens the right page (or Apple Subscriptions for Apple-billed). The sub is still active when you come back.
- [ ] Tap Ditch it. It asks "Did you cancel it?". Confirm: the card slides off, the DITCHED stamp lands with a buzz, and "$X a year back" counts up.
- [ ] The Ditched tab shows "$X/mo in projected savings", with X matching that sub's monthly price.
- [ ] Reactivate it ("Oops, still paying"). Savings go back down and it's in Subs again.
- [ ] Turn on Settings → Accessibility → Motion → Reduce Motion on the iPhone, then ditch something. You get a simple fade, no flick.

## 7. Accessibility and look ⏳ (M1)
- [ ] Switch the iPhone to Dark mode. Every screen stays readable.
- [ ] Settings → Display → Text Size at its largest. Money doesn't get cut off.
- [ ] Turn on VoiceOver and swipe through Home. Every button says what it does.

## 8. Paywall ⏳ (M2)
- [ ] The × close button is visible immediately. Tap it and you're back to a working free app.
- [ ] Yearly is pre-selected, and the timeline shows real dates (today, day 5, day 7).
- [ ] "Continue free" works. Restore purchases works, and with nothing to restore it says so.
- [ ] Start the trial (sandbox account). A "Ditch Pro trial" entry appears in your list, with a reminder 2 days before the charge.
- [ ] No weekly plan, no countdown timer, no fake strike-through price.

## 9. States and failures ⏳ (M1–M2)
Why: an app feels premium when the bad moments are handled well, not only the happy path. See `docs/research/premium-states.md`.
- [ ] Ditch a sub. A message says what you'll save, and **Undo** brings it back.
- [ ] Delete a sub. **Undo** brings it back.
- [ ] Turn a reminder on. The message shows the real reminder dates.
- [ ] Free limit: wherever it shows (Pick 3, sub detail, Settings, paywall), it reads "Reminders 3 of 3" with the same **Swap** and **See Pro** buttons.
- [ ] iPhone Settings → Ditch → Notifications off. Open Ditch. A banner says reminders are off, and **Turn on** opens Settings.
- [ ] Airplane mode, then open the paywall. It says it can't reach the App Store, **Try again** works, and × still closes it.
- [ ] Empty Home, empty Ditched, and a search with no match each show a friendly line and one clear button.
- [ ] Set a charge date in the past. It moves to the next charge and says so.
