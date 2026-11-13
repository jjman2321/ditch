# Manual tests (on your iPhone)

A click-through checklist for each feature. Tick the boxes as you go. If something fails, tell Claude which step and what you saw (a screenshot helps).

Sections get added as each feature is built. ⏳ = not built yet.

---

## 0. Docs review (now)
- [ ] Open the repo on GitHub and read `docs/SPEC.md` §3 (screens) and §12 (open questions).
- [ ] Check the prices in SPEC §6: $4.99/mo, $29.99/yr with a 7-day trial, $49.99 lifetime.
- [ ] Check the free tier in SPEC §7: unlimited tracking, reminders on 3.
- [ ] Reply "OK" or list what to change.

## 1. Onboarding (rebuilt Nov 10 to design v12)
Delete Ditch's data first so the onboarding shows again: Settings → Your data → Delete all data (or delete and reinstall Expo Go's copy). Phone in **light mode**, Region **United States**, normal text size. 7 steps: Welcome → What you pay for → Your total → Charge dates → Reminders → Paywall → You're set. The bar at the top has 4 dashes (pick, total, dates, reminders).

**1 · Welcome**
- [ ] Yellow screen: "ditch", the big "Ditch it before it renews." on 3 lines, the duck peeking over a Ditch notification ("Netflix renews Thursday. $19.99. Still watching?").
- [ ] The three dates under it are real: the first is 6 days from today, then 8 days, then the charge 9 days from today ("$19.99 charge").
- [ ] Under the button: "Free forever for tracking." Tap **See what I pay**.

**2 · What do you pay for?**
- [ ] Title on 2 lines ("What do you / pay for?"), then "Tick each one. Prices for 🇺🇸 US · Change".
- [ ] Chips read Popular · Streaming · Music · AI… and scroll sideways.
- [ ] Tick Netflix, Spotify, ChatGPT Plus, Amazon Prime, YouTube Premium and Disney+. Each tick gives a tiny tap. A ticked row says the plan and price, e.g. "Standard · $19.99/mo · Change". Spotify says "Individual", Disney+ "With Ads".
- [ ] YouTube Premium says **Add your price** (no checked US price yet). Tap it, type 15.99, Monthly, Save: it says "Your price · $15.99/mo · Change".
- [ ] Tap **Change** on Netflix. A sheet: "Which Netflix plan?" with 3 plans and prices, "Not sure? Standard is the most common…", "Enter my own price". Tap Premium: the tick moves, the sheet closes, the row and the bottom total change. Put it back to Standard.
- [ ] The bar above the button reads "6 picked · $96.44 a month". **There is no "Import from a screenshot" link anywhere.**
- [ ] Untick everything: the button greys out and a "Skip for now" link appears. Tick them again. Tap **See my total**.

**3 · Your total**
- [ ] "You pay", then the yearly total rolls up digit by digit and you feel one light tap: **$1,157**, then "a year." No letters touch.
- [ ] "That's $96.44 a month." and one line: "Most people guess way lower. In one study, the real total was about 2.5× the guess."
- [ ] The cream card lists the 3 biggest per year, then "3 more · Show all". Tap Show all: all 6 show.
- [ ] "Ditch just one you don't use: up to $240 a year you won't pay." Go back and forward: the number does **not** roll again.
- [ ] Tap **Set up reminders**.

**4 · When do they charge you?**
- [ ] "Rough is fine. Skip any you don't know." and "PICK ROUGHLY · 0 OF 6 SET". No "Paid through Apple?" card.
- [ ] Each row has 4 choices: This week · Next week · Later (with "in 2+ weeks" under it) · Pick a day.
- [ ] Tap **Next week** on Netflix: "around Thu, Nov 19" (on Tue, Nov 10; on another day, the Thursday of next week) shows at once, then a moment later the row folds to one line: "around … · Rough · Change". The counter says 1 of 6.
- [ ] Tap **Later** on Amazon Prime: "around" a date 2–3 weeks out (Tue, Dec 1 on Nov 10).
- [ ] Tap **Pick a day** on ChatGPT Plus: a sheet with days 1–31 and "Last day of the month". Tap 21: "Next charge: Sat, Nov 21. Then the 21st of every month." Tap **Done**: the row folds to "✓ Sat, Nov 21 · Change".
- [ ] Try **Last day of the month**: it says the next charge is Nov 30 and "Then the last day of every month".
- [ ] Tap a folded row: it opens again with your choice still selected.
- [ ] Leave one or two rows untouched (that's allowed). Tap **Continue**.

**5 · Get a reminder before each charge.**
- [ ] "3 days and 1 day before, at 9:00 AM. / Only about your subscriptions."
- [ ] The yellow panel "Your first reminders" shows your own 2 soonest reminders with their dates and prices, worded like real ones ("… renews Tuesday. $15.99. Still watching?"). Rough dates say "around".
- [ ] "7 in 10 people have forgotten to cancel a free trial." Tap **Turn on reminders**: the real iPhone prompt appears. Allow it.
- [ ] (Second run) Tap **Maybe later** instead: no prompt.

**6 · Paywall**
- [ ] Yellow band: "ditch Pro", the × top right, "Get a reminder / before all / 6 renewals." with the duck beside the last line. The × is there from the very first frame.
- [ ] Free vs Pro card, 5 rows: Subscriptions with reminders (3 · Unlimited), Choose your reminder times, Second nudge if you miss one, Home & Lock Screen widget, Import screenshots anytime. "FREE" and "PRO" sit centred over their columns; "Unlimited" has room on both sides and is the same size as the row text.
- [ ] Yearly is picked: "SAVE 49%" on its top edge, "7 days free", "$29.99/yr", "$2.50 a month". Monthly says "No free trial", Lifetime "Pay once".
- [ ] The line under the button reads "$0 today · reminder [7 days from today minus 3] · $29.99 [7 days from today]".
- [ ] Tap Monthly, then Lifetime: a light tap, the button text changes ("Subscribe for $4.99 a month", "Pay $49.99 once"), the line under it changes, and **nothing moves**.
- [ ] **No "Continue free" button.** Everything fits without scrolling. Restore says there's nothing to restore; Terms and Privacy open the website.
- [ ] Tap **Start 7-day free trial**: a box says purchases aren't switched on and nothing was charged. Tap OK. Then tap the **×**.

**7 · You're set (free)**
- [ ] "You're set." with 3 lines: "6 subscriptions on your list · $1,157 a year", "Reminders are on · 3 days and 1 day before, at 9:00 AM", and "○ N dates to check" naming the rough or skipped ones.
- [ ] The card "Reminders on your 3 biggest · Change" lists 3 subs, soonest reminder first: each shows its renewal date and its first reminder day.
- [ ] Tap **Change**: a sheet "Your 3 free reminders" with the 3 in yellow and the rest under "On your list, no reminder". Tap × on one: a free slot appears. Tap **Swap in** on another: it fills the slot. With 3 full, Swap in replaces the smallest. Tap **Keep these 3**: the card updates.
- [ ] Tap **Go to my list**: Home opens with all 6 subs, and the 3 you chose have bells. Close and reopen the app: it opens on Home, nothing lost.

**7 · Almost set (reminders skipped)**
- [ ] Run again and tap **Maybe later** on step 5. After the × on the paywall: "Almost set.", "! Reminders are off · Nothing can reach you until you turn them on.", and a card "Waiting for your OK" with each reminder marked "paused".
- [ ] Tap **Turn on reminders**: the real iPhone prompt. Allow: the screen turns into "You're set.".
- [ ] If you had tapped "Don't Allow" before, the button opens iPhone Settings instead. Turn notifications on there and come back: it says "You're set.".

**7 · You're set (Pro preview, test builds only)**
- [ ] On the paywall tap Start 7-day free trial, then **Preview Pro**. You're set says "Reminders on all 6" and "Ditch Pro trial on your list · Reminders [two days]". There's no Change link, and the card is "Your first reminders".

**Sizes, dark mode, text size, VoiceOver, motion**
- [ ] Dark mode: run through again. Everything is readable; the reminders panel stays yellow; the big total and buttons are sunflower.
- [ ] iPhone SE size (if you have one, or ask a friend): the paywall fits with 4 rows (no "Import screenshots anytime"), nothing is cut off.
- [ ] iPad (if you have one): every screen is a centred column; it also works sideways.
- [ ] Larger Text near the largest: body text grows, big headlines stay put, long screens scroll instead of cutting off.
- [ ] VoiceOver: every tick, quick pick, day, plan, link and × reads out what it is. The paywall table reads each row ("Subscriptions with reminders: Free, 3. Pro, Unlimited.").
- [ ] Reduce Motion: the total fades in instead of rolling, the duck doesn't rise, rows fold without sliding.

**Settings → About → Sources**
- [ ] Settings → About Ditch → **Sources** lists the studies (C+R Research 2022, Self Financial 2026, CNET/YouGov 2025, Chase 2021, West Monroe 2021) and each link opens the study.

## 1g. Release audit fixes (Nov 11, docs/audits/2026-11-11-release-audit.md)
Needs the EAS development build for the starred ones (*).

**Reminders**
- [ ] Free: 3 reminders on. Add a date to a 4th sub (Home → Add dates). It says "No reminder: your free 3 are in use", and the other 3 stay on.
- [ ] Editor date step: after 9 AM, pick tomorrow. It doesn't promise a reminder today.
- [ ] Track a free trial: the date step asks "When does the trial end?" with no receipt tab.
- [ ] Calendar, notifications off: hollow dots, the off banner, and "Reminders are off, so this one won't arrive."
- [ ] Calendar: tap a reminder day with no charge. It says which sub and when.
- [ ] *Pro: set a charge for tomorrow, keep the app closed. You get the 9 AM reminder and a 7 PM "Last call."
- [ ] *Pro: open the app after the 9 AM one. The 7 PM nudge doesn't come.

**Not losing anything**
- [ ] *Onboarding: tick 5, set 2 dates, swipe the app away, reopen. You're on the same step with everything kept. Back works.
- [ ] Settings → Your data → Delete everything: the alert says it can't be undone and offers Export first. After deleting, swiping back from Welcome goes nowhere.
- [ ] Double-tap "Add 1" in the Add sheet: it's added once.

**Leaving screens**
- [ ] Add sheet: drag the grabber down to close. The × closes it too.
- [ ] Ditch something: the top right says Done. Done keeps it ditched. Reopen it: top left says "Put it back" and asks first.
- [ ] Ditched tab → a cancelled one → "Not cancelled yet": it goes back to waiting.

**Additions**
- [ ] Welcome: under the button, "Free forever for tracking. Reminders on 3."
- [ ] Dates step: tap the first "Pick day", choose a day, Save. The sheet goes straight to the next one without a date. After the last, it closes.
- [ ] Paywall, Yearly: two lines under the button, "$0 today · $29.99/yr from …" and "Renews yearly · Cancel anytime".
- [ ] Track a free trial with a price and end date: the Home total shows "+ 1 trial, then $X a month".
- [ ] Settings → Feedback & help → Report a problem: an email opens with one line of counts at the bottom, with no subscription names or prices.

**Looks**
- [ ] Tab bar: "Home", "Calendar", "Ditched" are fully visible, letters not cut, on your iPhone.
- [ ] Home: a yearly sub shows "/yr" after its price.
- [ ] *iPad (if you have one): Home, Calendar and Settings sit in a centred column, not stretched.
- [ ] Home screen: the yellow "Bean" duck icon (round white duck, orange bill, on yellow). Needs an EAS build: Expo Go always shows its own icon.
- [ ] iPhone Settings → Display & Brightness → Dark: the icon stays the same yellow Bean (not darkened).
- [ ] Long-press the home screen → Edit → Customize → Tinted: a grey duck.
- [ ] Open Ditch from closed: the splash is the rounded yellow Bean, on cream (in dark mode, on black).
- [ ] Settings → About, and the lock-screen example in onboarding: the small icon is the same Bean as the home screen.
- [ ] Paywall: 4 rows (Track every subscription, Subscriptions with reminders, Pick reminder days, Nudge if you miss one). No widget row.

## 1f. Next reminder, "Find the ones you forgot", paywall Lifetime line (Nov 11, DECISIONS #42)
Pull first: `git pull`.

**Next reminder**
- [ ] With reminders on, Home shows **Next reminder: (name)** under the yellow total, with the day and time underneath (e.g. "Tomorrow, 9 AM").
- [ ] It matches Settings and the Calendar. Tapping it opens the Calendar.
- [ ] Change the reminder time in Settings: the row shows the new time.
- [ ] Turn notifications off in iPhone Settings: the row goes and the "Reminders are off" banner shows.

**Find the ones you forgot**
- [ ] Scroll to the bottom of Home: **Missing any? See where subscriptions hide**. Tap it.
- [ ] 6 places. **Apple subscriptions** opens Apple's page and ticks itself; **Google Play** opens play.google.com. The other four tick on tap.
- [ ] **Add what I found** opens the Add sheet.
- [ ] **Done** closes it and the Home card is gone for good.
- [ ] Home → **+**: under "Track a free trial" there's **Missing any? See where they hide**, which opens the same checklist.

**Paywall**
- [ ] Yearly or Monthly picked: **Rather pay once? Lifetime, $49.99** sits between the plans and the button. Tap it: Lifetime is picked and the line goes. The button doesn't move.
- [ ] On an SE-size phone nothing scrolls.

## 1e. Rating ask, "Track a free trial", cancel guides (Nov 10, DECISIONS #38–41)
Pull first: `git pull`, `npm install`. The rating prompt **can't be fully tested in Expo Go or TestFlight**: Apple shows it in development builds only as a test sheet and never in TestFlight. Check the rules here; the real prompt is checked after launch.

**Track a free trial**
- [ ] Home → **+**. The first row says **Track a free trial · We'll remind you before it ends**.
- [ ] Tap it. The title says **Track a free trial**, the switch "It's a free trial" is already on.
- [ ] Type "Paramount", pick Paramount+. The title becomes **Paramount+ free trial**. The price label says **Price after the trial**.
- [ ] Plan chips read short, e.g. **Essential $8.99/mo**, **Essential $89.99/yr** (no repeated "Paramount+").
- [ ] Without a date: the line under "Trial ends" says **It's in the sign-up email**.
- [ ] Pick the end date → **Track trial**. Home shows it as a trial with the end date.

**Cancel guides (DECISIONS #41)**
- [ ] Ditch Netflix → **Cancel in Netflix** opens netflix.com/cancelplan in Safari.
- [ ] Ditched tab → Netflix → **How to cancel**: 3 Netflix steps, then **Cancel in Netflix**, then Done.
- [ ] Ditch Amazon Prime → **How to cancel Amazon Prime** shows Amazon's steps and **Open Amazon Prime help**.
- [ ] Ditch Apple Music → **Cancel in iPhone Settings** opens Apple's subscriptions page.
- [ ] Ditch a custom one (e.g. "Gym") → the general steps, plus **Open Apple subscriptions**.
- [ ] Tap-test these links once (they were checked from the web, not on a phone): YouTube TV, Spotify, Hulu, Disney+, HBO Max.

**Rating ask (needs a development build; skip in Expo Go)**
- [ ] During onboarding: never shows.
- [ ] Ditch something, then **I already cancelled**: on a brand-new install nothing shows (first 3 days).
- [ ] It never appears from a button, and no screen offers anything for a rating.

## 1a. Fixes from your second recording (Nov 10)
Pull first: `git pull`, `npm install`, then `npx expo start --tunnel ngrok --clear`.

**Duck on Welcome**
- [ ] Open the app fresh (delete Ditch from Expo Go's recent list if it resumes). The duck rises a little and fades in, then stops. No bounce, no wobble.
- [ ] The **top of his head is round**, never sliced flat. Check it mid-rise and at rest.
- [ ] Dark mode: same, with a thin cream outline that is crisp, not blurry.
- [ ] Also check the duck on the paywall, "You're set", the empty Home and the Ditched screen: full head everywhere.
- [ ] The small duck app icon (in the Welcome notification and on the Pro trial row) still looks centred.

**Spotify → Enter my own price (the freeze)**
- [ ] On "What do you pay for?", tick Spotify, tap **Change**, then **Enter my own price**.
- [ ] The plan sheet slides away, then the price sheet comes up. The app never freezes.
- [ ] The number keyboard opens and the **Save button sits above it**, not under it.
- [ ] The price box is **empty**, with the plan price as a grey hint. The line under Spotify says "Paying something different? Type it here."
- [ ] Type 11.99. The button says "Save $11.99 a month". Tap it: the row says "Your price · $11.99/mo" and the total updates.
- [ ] Tap other rows right after: they tick and untick normally.
- [ ] Type something broken like 12.99.5: the button says "Check the price" and can't be tapped.
- [ ] Repeat with **Add your price** on YouTube Premium, and with the country sheet (Change → pick a country): every sheet opens and closes cleanly, one at a time.

**Mixed currencies: the "≈ in all" line (DECISIONS #32)**
- [ ] On "What do you pay for?" (Region United States), tick YouTube Premium and type your own price, e.g. 15.99 Monthly.
- [ ] Tap **Change** next to the country and pick 🇬🇧 UK. Tap **See my total**.
- [ ] Under "+ US$… a year" there's a small grey line "≈ £… a year in all · Nov 10 rates" (today's date or close). It doesn't move or animate.
- [ ] Only one currency on the list (stay on United States, no own price in another currency): **no** ≈ line anywhere.
- [ ] After "Go to my list": Home's yellow card shows the ≈ line in "a month" under the US$ line. VoiceOver on the card reads "About £… a month in all, at Nov 10 exchange rates."
- [ ] The list rows, notifications and Ditched tab still show the real amounts (US$ stays US$).
- [ ] Airplane mode, open the app: the ≈ line still shows (rates saved on the phone or built in).
- [ ] Settings → About Ditch → Sources lists "Exchange rates: Exchange Rate API".

**Wording**
- [ ] Hold a subscription on Home: the hint says "$X a year you won't pay once you cancel" (no "Saves").
- [ ] Empty Home says "Ditch reminds you before each charge." Calendar says "Reminder", never "heads-up".

## 1d. Charge dates without guesses + the new Add picker (Nov 10, DECISIONS #33)
**Onboarding**
- [ ] Tick a few services, go to **Which day does each one charge?**. Each row says "Monthly" or "Yearly" with a **Pick day** / **Pick date** button. Biggest first.
- [ ] Tap **Pick day** on a monthly one: a 1–31 grid and "Last day of the month". Tap 16: the yellow box says "Charges on the 16th of every month. Next: … Reminders … and … at 9 AM." Save: the row shows a yellow "16th" and "Next: …".
- [ ] A yearly one (e.g. Amazon Prime yearly): month buttons, then the day. The box says "Renews every year on Apr 28."
- [ ] **I'm not sure** leaves the row with no date. The footer says "1 of 6 set · You can add the rest later".
- [ ] Nowhere says "guess", "around" or "Rough".
- [ ] You're set: "2 with no date yet · Amazon Prime and Disney+ · add them from your list". Reminder rows only show dated ones.

**Home, Calendar, Settings**
- [ ] Home: a card "2 have no date yet, so no reminders · Add dates ›" (opens the biggest one). A **No date yet** section at the bottom with underlined **Add date** and a grey bell.
- [ ] "Reminders on X of Y" never counts a sub without a date.
- [ ] Add a date to one: it moves up into This week / Next week / Later and its bell can go yellow.
- [ ] Calendar: undated subs aren't on any day; a "No date yet · No reminders" list sits below with Add date. The legend has no "Guessed date".
- [ ] Settings → Which subscriptions: an undated sub shows "No date yet" and "Add date" instead of a bell.
- [ ] Ditch an undated sub: it says "Cancel before it renews" and there's no last-check reminder.

- [ ] Tap **Add dates ›** on Home: one sheet lists every sub with no date. Pick a day for one: it's saved, the list shrinks, and it moves up into This week / Next week / Later. When the last one is done the sheet closes.
- [ ] With room in the free 3, a newly dated sub gets a yellow bell. When the 3 are full, it stays grey.

**Add a subscription (+)**
- [ ] The picker opens: search, category chips, ticks, "Already on your list" ones greyed out. Tick two → **Add 2**. They land in No date yet.
- [ ] Type "Gym": "Add 'Gym' as your own" opens the full form with the name filled in. The date field says **Add date** and "No date, no reminder…". Remind me says "Starts once it has a date".
- [ ] No import buttons anywhere yet (they appear once import works in the development build).

**You're set, Calendar, Remind me (DECISIONS #36)**
- [ ] You're set: the checklist items fade in one by one, then a soft buzz. Below: "First reminder · <date>" and the real notification card with the duck peeking. Free with 4+ subs: "See all 3 reminders" opens the pick-3 sheet.
- [ ] Calendar: tap a charge day. Each row says "Reminders Wed 18, Fri 20" (or "No reminder · free covers 3"), no yellow pills, nothing cut off.
- [ ] Edit a sub that has reminders: "Remind me" shows the two real dates and a preview of the exact notification underneath. Turn it off: the preview goes away.

**Ditch's own trial (DECISIONS #37)**
- [ ] Start the Pro trial (test build: Preview Pro). Ditch Pro never appears on Home, the Calendar or in the export. You're set says "We'll remind you before your trial ends" with two dates.
- [ ] The trial reminders still arrive (Settings → test build → Reminder time 1 minute from now).

**Paywall (DECISIONS #35)**
- [ ] Under the Yearly button: "$0 today · $29.99/yr from <date 7 days out> · Cancel anytime". No reminder text.
- [ ] The table's last row says "Import anytime". The duck's bill points at the PRO column and never covers the title.

**Phones that had the old version**
- [ ] After updating, subs that had a guessed date now show **Add date** (nothing is deleted).

## 1c. Fixes from your third recording (Nov 10)
The blue round gear on the right edge is Expo Go's own button. Ignore it; it isn't in the real app.
- [ ] What do you pay for: an unticked Netflix says "Standard · $19.99/mo". Tick it: only the tick and "Change" appear.
- [ ] It says **ChatGPT** (not ChatGPT Plus); Change shows Go, Plus, Pro.
- [ ] Your total: the big yearly number never touches the right edge, during the roll or after. Try with ChatGPT Pro ($200) ticked.
- [ ] Tap **Show all**: the list grows and **Set up reminders** stays on screen.
- [ ] The line under the total says "Most people think it's way less…". The line above the button says "Not using one? Ditch it before it renews."
- [ ] Reminders screen: your two reminders slide in one after the other. The fact says "7 in 10 people have paid for a forgotten free trial."
- [ ] Paywall: no empty gap under Lifetime; the title sits a bit lower.
- [ ] Home: all bells sit in one straight column and all prices line up, including a $200.00 one.
- [ ] Ditch something with no price, tap "I already cancelled", open the Ditched tab: it says "1 cancelled. Nice." (not "Nothing cancelled yet").
- [ ] Settings: the Ditch Pro row shows the "ditch Pro" logo.
- [ ] + Add a subscription → type a price: a **Done** bar sits above the number keyboard and hides it. Dragging the form down also hides it.
- [ ] Turn on "It's a free trial" on a new sub with a guessed date: it says the trial ends about a week from today (not months away).

## 1b. Prices by country (built Nov 9)
Prices come from the iPhone's Region (Settings → General → Language & Region → Region), not the language.
- [ ] Region **United States**. On "What do you pay for?" the line under the title says "Tick each one. Prices for 🇺🇸 US · Change". Unticked Netflix shows "from $8.99/mo".
- [ ] Tick Netflix. Its row says "Standard · $19.99/mo · Change". Tap Change and pick Premium: the price and the total at the bottom change.
- [ ] Tick Amazon Prime. It says **Add your price** (we haven't checked Amazon's price yet). Tap it, type 14.99, pick Monthly, Save. The row now shows $14.99 (no "about").
- [ ] Tap **Change**, pick 🇬🇧 UK. Netflix becomes £ prices, HBO Max and Hulu disappear from the list (US-only or no UK price), and Amazon keeps the $14.99 you typed.
- [ ] Tap **See my total**. The big number is in £, with a separate line "+ US$… a year" for Amazon. They are never added together.
- [ ] Anything still without a price shows **Add your price** in the Your total list.
- [ ] Region **Australia**, then **India**: prices switch to A$/₹ local plans (India's Netflix has Mobile and Basic plans).
- [ ] Region **Japan** (not supported yet): the line says "No local prices for your region · Choose" and every row says Add your price.

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
- [ ] The × close button is visible immediately. Tap it and you're back to a working free app (it's the only free option; there's no "Continue free" button).
- [ ] Yearly is pre-selected, and the line under the button shows real dates ($0 today, the reminder day, the charge day 7 days out).
- [ ] Restore purchases works, and with nothing to restore it says so.
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

## W. Website (ditchsubs.app, once it's live)
- [ ] Home on your iPhone: headline rotates Netflix → Spotify → ChatGPT → Disney+ → Prime with no white bar under the logo. With Reduce Motion on, it stays on Netflix.
- [ ] Under the hero button there's no extra text, just the two reminder cards.
- [ ] Each heading reads as plain English and says what the section is about. No repeated lines.
- [ ] Turn the phone sideways and back, and zoom text to the largest size: nothing runs off the right edge.
- [ ] Open a cancel guide with a long web address (Microsoft 365, Xbox Game Pass): the address wraps, the page doesn't scroll sideways.
- [ ] Join the waitlist with a real email: you see "Check your inbox", the email arrives, the link confirms.
- [ ] "Cancel it and see what you won't pay": a phone shows the app's Ditched screen. As you scroll to it the phone rises, the duck pops up over the Netflix card, then the number and buttons fade in. No stamp.
- [ ] Pricing: heading "Pro costs less than two months of Netflix." A clean list (Free, Pro yearly, Pro monthly, Lifetime) on the left, the app's paywall in a phone on the right. Table, plans and button fade in one after another.
- [ ] With Reduce Motion on, both phones show finished, nothing moves.
- [ ] On your iPhone both phones fit the screen width with no sideways scroll.
- [ ] Pricing (option C): Free card + yellow Pro card (Yearly with "7 days free", Monthly) + dark Lifetime strip. On iPhone: Pro first, Yearly and Monthly as full-width rows, no button on the Free card, nothing cut off. The duck pops up over the Pro card and the "7 days free" badge drops in.
- [ ] Ditch card: the hold ring fills, "Hold to ditch" becomes a "Ditched" tag, the Netflix logo greys, the duck pops up, then "$239.88 a year you won't pay." fades in.
- [ ] Calculator: tap a few logos, then use the email box under the total. You see "Check your inbox" (or "Sign-ups aren't open yet" before launch).
- [ ] Open a cancel guide and tap the side card's "Join the waitlist": it scrolls to the box on the same page, it doesn't jump to the home page.
- [ ] Hover the hero headline on a laptop: the logo rotation pauses.
- [ ] On an iPad, tap the footer links and the "On this page" links: each is easy to hit.
