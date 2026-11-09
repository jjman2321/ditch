# Manual tests (on your iPhone)

A click-through checklist for each feature. Tick the boxes as you go. If something fails, tell Claude which step and what you saw (a screenshot helps).

Sections get added as each feature is built. ⏳ = not built yet.

---

## 0. Docs review (now)
- [ ] Open the repo on GitHub and read `docs/SPEC.md` §3 (screens) and §12 (open questions).
- [ ] Check the prices in SPEC §6: $4.99/mo, $29.99/yr with a 7-day trial, $49.99 lifetime.
- [ ] Check the free tier in SPEC §7: unlimited tracking, reminders on 3.
- [ ] Reply "OK" or list what to change.

## 1. Onboarding ⏳ (M1)
- [ ] Delete the app or reset it, then open it. The Welcome screen shows the raccoon.
- [ ] Tap Get started. A catalog with logos and typical prices appears.
- [ ] Tick 5 services and search for one more, then tick it.
- [ ] Tap "Something else?" and add a custom one.
- [ ] Next screen: "That's $X a year" equals the sum of what you ticked. Check it with a calculator.
- [ ] Reminder screen: the example notification is visible. Tap **Maybe later**: no iOS prompt appears.
- [ ] You ticked more than 3, so the 3-pick sheet shows with the 3 biggest yearly charges pre-selected. Swap one and confirm.
- [ ] You land on Home with everything you ticked.
- [ ] Force-quit midway through onboarding, then reopen. It resumes where you left off.

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
- [ ] Tap Ditch it. It asks "Did you cancel it?". Confirm: the raccoon flicks it into the bin.
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
