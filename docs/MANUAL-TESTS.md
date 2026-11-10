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

## 1b. Prices by country (built Nov 9)
Prices come from the iPhone's Region (Settings → General → Language & Region → Region), not the language.
- [ ] Region **United States**. On "What do you pay for?" the line under the title says "Prices for 🇺🇸 US · Change". Netflix shows "about $19.99 a month", Spotify "about $12.99".
- [ ] Tick Netflix. A row of plan pills appears under it (Standard with ads · Standard · Premium). Tap Premium: one tap, the price and the yellow total change.
- [ ] Tick Amazon Prime. It says **Add your price** (we haven't checked Amazon's price yet). Tap it, type 14.99, pick Monthly, Save. The row now shows $14.99 (no "about").
- [ ] Tap **Change**, pick 🇬🇧 UK. Netflix becomes £ prices, HBO Max and Hulu disappear from the list (US-only or no UK price), and Amazon keeps the $14.99 you typed.
- [ ] Tap **See my total**. The big number is in £, with a separate line "+ US$… a year" for Amazon. They are never added together.
- [ ] Anything still without a price is listed under **No price yet** with an Add your price link.
- [ ] Region **Australia**, then **India**: prices switch to A$/₹ local plans (India's Netflix has Mobile and Basic plans).
- [ ] Region **Japan** (not supported yet): the line says "No local prices for your region · Choose" and every row says Add your price.
- [ ] In the US the total screen says "US prices are before sales tax."

## 2. Your list is saved (built Nov 10, Phase 2)
- [ ] Finish onboarding with 4 or more subs. Tap **Go to my list**.
- [ ] Close Ditch fully (swipe it away in the app switcher) and open it again. It opens straight on **Home** with the same list, not onboarding.
- [ ] Do it again after adding, editing and ditching something. Everything is still there.

## 3. Home (built Nov 10)
Compare with `design/v10/renders/09-home-hold.jpg`, `09b-home-pro.jpg`, `09c-home-off.jpg`.
- [ ] Top: the **ditch** wordmark, a grey gear and a black **+**.
- [ ] The yellow card shows **$X a month**, then **$Y a year · Reminders on 3 of N**. Check it with a calculator: monthly prices added up; yearly is that × 12 (a $99/yr sub adds $8.25 a month).
- [ ] Add one sub in a second currency (e.g. CAD). The card shows a separate "+ CA$… a month" line. Two currencies are never added together.
- [ ] Subs are grouped **This week** (until Saturday), **Next week**, **Later**, soonest first.
- [ ] Each row: real logo, name, date ("Sat, Nov 14 · in 5 days"), a bell, the price. Guessed dates show a grey **GUESS** tag.
- [ ] Yellow bells are the ones that get reminders (your 3 on Free). The others are grey outlines.
- [ ] "N dates are guesses · Check them ›" opens the soonest guessed one so you can set its real date.
- [ ] Until you ditch your first sub, the first group says "Hold a sub to ditch it" on the right.
- [ ] A free trial you added shows "Trial ends …" and isn't in the monthly total until it ends.
- [ ] **Empty Home** (Settings → Your data → Delete all my data, then skip through onboarding without ticking anything): the duck peeks over "Nothing to watch yet.", **Add a subscription**, and 8 quick-add logos. Tap Netflix: the add sheet opens with Netflix filled in.

## 4. Add and edit (built Nov 10)
- [ ] Tap **+**. Type "net": Netflix shows with "about $19.99". Tap it. Name, price (marked "Typical price"), plan chips, "Monthly" and a guessed date fill in.
- [ ] Tap a different plan chip: the price changes.
- [ ] Type your own price. "Typical price" goes away.
- [ ] Tap the date: the calendar sheet from onboarding opens. Pick **From my last receipt** and a day last month: it rolls forward. Tap **Set next charge…**, then **Add Netflix**.
- [ ] Add a custom one: type "Gym", tap **Add "Gym" as your own**, price 45, **Add Gym**. It appears with a GUESS date until you set one.
- [ ] Free with 3 reminders already on: the **Remind me** switch on a new sub stays off and says "Free covers 3…" with a **Try Pro** link. Nothing gets deleted.
- [ ] Tap an existing row: the sheet opens with its details. Change the price, **Save**: the totals update.
- [ ] **Delete from my list** asks first and says it doesn't cancel the subscription. After deleting, it's gone from Home and Calendar.

## 5. Reminders really arrive (built Nov 10). The most important section.
Do this on the iPhone, not the web preview. Reminders are local: no internet needed.
- [ ] **Test reminder:** Settings → **Send me a test reminder**. The card says "Sent. Check the top of your screen." Within about 5 seconds a banner from Ditch says "Test from Ditch. If you can read this, you're set." Do it again with the app in the background (swipe home right after tapping): it still arrives.
- [ ] **A real heads-up today:**
  1. Add a sub (or edit one) so its next charge is **tomorrow**, and make sure its bell is yellow (it's one of your 3).
  2. Settings → **Time** → set it to **2 minutes from now**. (In Expo Go there's also "Reminder time: 1 minute from now" under "Test build only".)
  3. Lock the phone and wait. At that minute a banner says "<Name> renews tomorrow. $X. Last call if you're done with it."
  4. Set **Time** back to 9:00 AM.
- [ ] **3 days before:** set a sub's next charge to **3 days from today**, Time to 2 minutes from now, lock the phone. The banner says "<Name> renews <weekday>. $X. Still watching?" (or listening/using). Guessed dates say "renews around Mon, Nov 16".
- [ ] **Moving the date cancels the old one:** repeat the step above, but before the minute comes, change that sub's date to next month. Nothing arrives.
- [ ] **Turning the bell off cancels it:** same again, but turn its reminder off (Settings → Which subscriptions). Nothing arrives.
- [ ] **No duplicates:** open and close Ditch a few times, then let one fire. You get it once.
- [ ] **Survives a restart:** schedule one for a few minutes ahead, restart the iPhone, unlock it and wait. It still arrives.
- [ ] **Ditched gets one last check:** set a sub's next charge to **tomorrow**, then hold it to ditch (don't tap "I already cancelled"). The Ditched screen says "One last check: <today> · <time>". Set Time to 2 minutes from now and lock the phone: you get "Did you cancel <Name>? It charges tomorrow." and no normal heads-up for it.
- [ ] **Health card:** Settings top card says **All good** and "Next one: <Name>, <day> at 9 AM", which matches Calendar's yellow dots.
- [ ] **Permission off:** iPhone Settings → Ditch → Notifications → off. Back in Ditch: Home shows the black "Reminders are off. Nothing can reach you. [Turn on]" banner and every bell has a slash. Settings' card says "Reminders are off" and **Turn on in iPhone Settings** opens the right page. Turn them back on, return to Ditch: the banner is gone and reminders are scheduled again (no restart needed).
- [ ] **Banners off but allowed:** iPhone Settings → Ditch → Notifications → keep Allow on, but turn off Lock Screen, Notification Center and Banners. Settings in Ditch says "On, but quiet" with a button to change it.

## 6. Hold to ditch and the Ditched screen (built Nov 10)
Compare with `09-home-hold.jpg`, `10-ditched.jpg`, `10-se.jpg`, `10b-ditched-trial.jpg`.
- [ ] Press and hold Netflix on Home. After a moment the row turns yellow and lifts, the others fade, a ring fills around the logo, and you feel 3 small ticks. It says "Keep holding to ditch. Let go to keep it. Saves $X a year once you cancel."
- [ ] Let go halfway: the ring drains back, nothing changes, no buzz.
- [ ] Hold all the way (about 1.2 s): the Ditched screen opens. The Netflix card flies up, the duck peeks, the DITCHED stamp thumps down with **one firm buzz**, then "$X a year you won't pay, once you cancel." No "saved" anywhere.
- [ ] If you've already confirmed other cancels, it says "Cancel it and you'll be saving $Y a year." (Y = confirmed savings + this one).
- [ ] "One last check: <day before the charge> · 9 AM" with the exact words of that reminder.
- [ ] **Cancel in Netflix ↗** opens Netflix's own cancel page. Coming back, Netflix is still "ditched", not cancelled. Spotify, Hulu and YouTube open their own pages too; Apple Music / iCloud / Apple TV open Apple's subscriptions; anything else shows a short how-to.
- [ ] **Undo** (top left) puts it back on Home as normal, light tap.
- [ ] Ditch it again and tap **I already cancelled**: a success buzz and the Ditched tab opens with it under **Cancelled**.
- [ ] On Home, a ditched-but-not-cancelled sub shows the DITCHED tag, "Cancel by <date>" and a slashed bell; it's no longer in the yellow total. Tapping it reopens the Ditched screen (without the stamp animation).
- [ ] Pro trial (Settings → Test build only → Preview Pro): hold the "ditch Pro trial" row. The screen says "Charges Mon, …", "You keep your whole list. Reminders drop back to 3.", and **Cancel in iPhone Settings ↗**.
- [ ] iPhone SE or Display Zoom: everything on the Ditched screen fits without scrolling.
- [ ] Reduce Motion on (Settings → Accessibility → Motion): no lift or flying card; the ring fills in 4 steps; the stamp just appears (the buzz stays).
- [ ] VoiceOver: on a Home row, swipe up/down to the **Ditch it** action and double-tap. It ditches without holding.

## 7. Ditched tab (built Nov 10)
Compare with `13-ditched-tab.jpg`.
- [ ] "You're saving $X a year." counts **only** the ones you confirmed with "I cancelled it". "From N subs you cancelled since <month> · $Y a month".
- [ ] **Waiting for you to cancel** lists ditched-but-not-confirmed ones with "+$Z a year" on the right, **I cancelled it** and **How to cancel ›**.
- [ ] **Cancelled** lists confirmed ones with the date and the yearly amount. Tap one → "Still paying for X?" → **Put it back**: it returns to Home and the savings drop.
- [ ] **Adding up** shows a step for each cancel, oldest first, ending at the total.
- [ ] The footnote says Ditch can't see your bank.
- [ ] Nothing ditched yet: a faded stamp and "Nothing ditched yet." (no duck here).

## 8. Calendar (built Nov 10)
Compare with `12-calendar.jpg`.
- [ ] The month name, ‹ › to move months, and "$X due in <month> · N charges" (one total per currency; ditched ones don't count).
- [ ] Logos sit on charge days; guessed dates have a dashed outline. Today's number is in a black circle. Yellow dots mark reminder days (3 and 1 days before your reminded subs).
- [ ] A monthly sub set on the 31st shows on Feb 28 (29 in a leap year) and back on Mar 31.
- [ ] Tap a day: it turns yellow and the list below shows its charges with "Heads-ups at 9:00 AM" and the two reminder days. Tap a charge to edit it.

## 9. Settings (built Nov 10)
Compare with `docs/research/settings.md` (Layout A), not render 14.
- [ ] Back says "‹ Home". Big "Settings". The health card is first (see §5 for its states).
- [ ] **Remind me** says "3 days and 1 day before". On Free, other days show a PRO tag and open the paywall. With Preview Pro on, you can tick 1 week, 2 days, etc.; at least one stays ticked; new reminders follow it.
- [ ] **Time** shows the iOS time pill. Change it: the health card's "Next one" time changes too.
- [ ] **Which subscriptions** says "3 of 3". Inside, bells biggest first; a 4th bell wiggles the "Reminders 3 of 3" badge with a warning buzz. With Pro: a switch per sub.
- [ ] **Ditch Pro** shows a yellow **Try free** that opens the paywall (with ×). With Preview Pro on it says "Trial, ends …" and opens the Pro page (Restore, Manage).
- [ ] **Currency**: pick EUR. New subs start in EUR; existing ones keep their own currency.
- [ ] **Your data → Export as spreadsheet (CSV)** opens the share sheet with a .csv file. Save to Files and open it: one row per sub.
- [ ] **Your data → Delete all my data**: an alert "Delete everything?" that says it doesn't cancel anything. **Delete** takes you to onboarding with an empty list and no reminders pending.
- [ ] **Contact support** opens Mail to support@ditchsubs.app with the version filled in.
- [ ] **About Ditch**: duck icon, "Ditch it before it renews.", Rate (says "not yet" until we're in the App Store), Terms, Privacy, version.
- [ ] Footer: "Your list stays on your phone." and the version. No light/dark switch, no iCloud row.

## 10. Look and accessibility (Phase 2 screens)
- [ ] Dark mode: Home, the hold, Ditched, Calendar, Ditched tab and Settings all read well (compare the `d*` renders).
- [ ] Larger Text near the largest: money isn't cut off, rows grow taller, big headlines stay put.
- [ ] VoiceOver through Home, Calendar (each day reads its charges), Ditched and Settings: every control says what it does.

## 11. Paywall ⏳ (M2: real purchases)
- [ ] The × close button is visible immediately. Tap it and you're back to a working free app.
- [ ] Yearly is pre-selected, and the timeline shows real dates (today, day 5, day 7).
- [ ] "Continue free" works. Restore purchases works, and with nothing to restore it says so.
- [ ] Start the trial (sandbox account). A "Ditch Pro trial" entry appears in your list, with a reminder 2 days before the charge.
- [ ] No weekly plan, no countdown timer, no fake strike-through price.

## 12. States and failures ⏳ (partly built)
Why: an app feels premium when the bad moments are handled well, not only the happy path. See `docs/research/premium-states.md`.
- [x] Ditch a sub. A message says what you'll save, and **Undo** brings it back. (Built: §6.)
- [ ] Delete a sub. **Undo** brings it back. (Not yet: delete asks first instead.)
- [ ] Turn a reminder on. The message shows the real reminder dates.
- [ ] Free limit: wherever it shows (Pick 3, sub detail, Settings, paywall), it reads "Reminders 3 of 3" with the same **Swap** and **See Pro** buttons.
- [x] iPhone Settings → Ditch → Notifications off. Open Ditch. A banner says reminders are off, and **Turn on** opens Settings. (Built: §5.)
- [ ] Airplane mode, then open the paywall. It says it can't reach the App Store, **Try again** works, and × still closes it.
- [ ] Empty Home, empty Ditched, and a search with no match each show a friendly line and one clear button.
- [ ] Set a charge date in the past. It moves to the next charge and says so.
