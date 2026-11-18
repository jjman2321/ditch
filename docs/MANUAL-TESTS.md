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

## 1k. Paywall plans: Yearly, Lifetime, Weekly (Nov 18, DECISIONS #66)
Open the paywall (finish onboarding, or Settings → Ditch Pro → Try Pro free).
- [ ] Three cards, in this order: **Yearly** (picked already, "SAVE 86%" ribbon, "7 days free", $49.99/yr, "$0.97 a week"), **Lifetime** ($99.99, "Pay once. No subscription.", "one time"), **Weekly** ($6.99/wk, "No free trial"). No Monthly.
- [ ] Tap Lifetime: the button says "Pay $99.99 once", and the line under it says "$99.99 once. Pro for good, nothing renews."
- [ ] Tap Weekly: the button says "Subscribe for $6.99 a week", and the line under it says "$6.99 today, then every week. Cancel anytime."
- [ ] Tap Yearly again: "Start 7-day free trial", "$0 today · $49.99/yr from (date a week from today)".
- [ ] Everything fits without scrolling. Restore, Terms and Privacy are at the bottom. The × still closes it.
- [ ] VoiceOver on a card reads the plan, price and trial.
- [ ] No big empty yellow block at the top: your own logos sit under the ditch Pro bar ("Netflix, Spotify and 4 more"). On bigger phones your yearly total shows under them too.

## 1l. Hold to ditch with Reduce Motion on (bug fix, Nov 18)
iPhone Settings → Accessibility → Motion → Reduce Motion **on**.
- [ ] On Home, press a row briefly and let go. Nothing is ditched.
- [ ] Hold the row. The ring fills in 4 steps over the same time as usual, then it's ditched.
- [ ] Turn Reduce Motion off again afterwards.

## 1i. Card and notes, overlap check, year ahead, price watch (Nov 16)
**Card, email and notes (free)**
- [ ] Edit Netflix: near the bottom, "For when you cancel" has Paid with, Account email and Notes. Type "Visa ending 4821" and save.
- [ ] With 2+ different cards filled in, Home shows chips (All cards · Amex… · Visa…). Tap one: only the subs on that card show, and the totals don't change.
- [ ] Hold to ditch Netflix: the Ditched screen shows "Paid with Visa ending 4821 · Account: …" so you know where to cancel.
- [ ] Skip one: edit a sub with a date, turn on "Skip the … reminders". That charge's reminders don't come; the next charge's do. Trial endings are never skipped.

**Overlap check (free)**
- [ ] Add Spotify and Apple Music: Home shows "2 music services: Spotify and Apple Music. $X a month together." Tap "Got it": it goes away and stays away.
- [ ] Two AI chats (ChatGPT + Claude) or two cloud storage apps do the same. Video only shows at 4 or more.

**Year ahead (free) and the 30-day yearly warning (Pro)**
- [ ] Calendar → scroll down to "Year ahead": one "Every month" or "Most months" row, then only the months with an extra yearly or 6-monthly charge, naming it.
- [ ] *Pro: a yearly sub renewing in 31+ days gets an extra reminder 30 days before: "… renews in a month, on …. Plenty of time to decide."

**Price watch and yearly check (Pro)**
- [ ] Pick Claude from the list on the Pro (monthly) plan, then type an older price, e.g. $18, and save.
- [ ] Free: Home shows "A price on your list went up. Price watch is in Pro." Tap it: the paywall opens.
- [ ] *Pro: Home shows "Claude Pro went up to $20.00. You have $18.00. Checked Nov 15 on Claude's own page." "Update to $20.00" changes the price; "Keep mine" hides the card for good.
- [ ] Edit that Claude sub: under the price it says "Pro (monthly) is $20.00 now, checked Nov 15. Change yours if it went up." (not "Typical price").
- [ ] Same screen, free: "Yearly would cost less. See how much with Pro" opens the paywall. *Pro: "Paying yearly would be $200.00 a year, $X less than 12 months of this."
- [ ] A sub you typed in yourself (not picked from our list) never gets a price-watch card.

## 1j. Find your subscriptions (Nov 16, DECISIONS #63)
Web preview: add `&import=1` to the address. On the iPhone this needs the development build.
- [ ] Add (+) → "Find your subscriptions" opens the Find page. Home → Missing any? → "Or let Ditch read a list for you" does too.
- [ ] Free: both routes say "Free once · then Pro". After one Add, they say "Pro" and lead to the paywall.
- [ ] Screenshot your Apple list → "Open Apple subscriptions" opens Apple's page. Take a screenshot of the list, come back, "Pick screenshots", pick it: the check list shows each subscription with "Renews …", trials with "Free trial ends …", cancelled ones under "Already cancelled".
- [ ] Ones already on your list are greyed "Already on your list" and can't be added twice.
- [ ] Drop in a statement → pick an Apple Card CSV (Wallet → Apple Card → Card Balance → a statement → Export Transactions): repeats show with their dates ("Sep 3, Oct 3, Nov 3"). APPLE.COM/BILL charges are counted with a link to the Apple screenshot.
- [ ] Untick one, tap Add: only the ticked ones appear on Home. Free: the first 3 with dates get reminders (trials first).
- [ ] A PDF statement works in the development build; in Expo Go it says PDFs need the new build and a CSV works now.
- [ ] Nothing about the screenshot or file is kept: close the app mid-way and reopen, the check list is gone.

**Full sweep fixes (Nov 16, late)**
- [ ] Edit a sub → Next charge on an SE: the calendar scrolls and "Set next charge …" can always be tapped.
- [ ] Edit → turn on "Skip the … reminders": the Remind me line says "Skipping Sat, Nov 21. Back on for the next one." and the Calendar has no dots for that charge.
- [ ] Edit Netflix and type a different price: the plan chips stay, and tapping one sets that plan again. "Typical price" only shows when the price matches a plan.
- [ ] Add → search "hbo": HBO Max is first; "Add 'hbo' as your own" is under it. Search "Paramount+ with SHOWTIME Essential": Paramount+ shows.
- [ ] Tap "Cancel in Netflix" on the Ditched screen, come back to Ditch: it asks "Did it go through?". "Yes, cancelled" moves it to Cancelled.
- [ ] SE: Home shows at most one card under Next reminder, so your first subscriptions are on the first screen.
- [ ] Open ditch://add?service=netflix with Netflix already on your list: it opens your Netflix, not a second copy.
- [ ] Calendar this month: "$X still to come" once some of the month's charges have passed.
- [ ] Paywall in dark mode: black top with a yellow headline (no olive). Pro Max and iPad: your logos fill the space above the headline.

**Audit calls (Nov 16, DECISIONS #62)**
- [ ] Hold a row on Home: only the logo and ring grow; the name and price stay still.
- [ ] Paywall: the table has a "Price watch" row (Free —, Pro ✓). On an SE: Track, Reminders, Pick reminder days, Price watch.
- [ ] iPhone SE, Settings → Display & Brightness → Display Zoom → Larger Text: Welcome, every onboarding step and the paywall fit with no scrolling; the paywall's × is at the top and Restore at the bottom. Turn Display Zoom back off after.

**Your rights (free, needs the lawyer check before launch)**
- [ ] Ditched tab → a waiting one → How to cancel: under the steps, "Your rights in the US ›". Closed at first. Tap it: US and California and New York lines, Source links, "Report a company to the FTC", and "The law as we read it. Not legal advice. Checked Nov 16."
- [ ] Change country (UK, Germany, France, Ireland…) by starting fresh: the row says "in the UK" etc. with that country's lines. Australia, Canada, New Zealand, India: no row at all.
- [ ] Website: any cancel guide has "Your rights when you cancel" (jump link "Your rights"). "In the UK, the EU, Germany or France +" opens the rest.

**Before payday (free)**
- [ ] Settings → Payday → tap 25. Back on Home, under Next reminder: "Before payday: $X · N charges until payday, Wed, Nov 25". Add the charges dated before the 25th yourself: they match.
- [ ] Pick 31 in a 30-day month: payday shows as the 30th. Settings → Payday → Turn off payday: the Home line goes away.

**Add-to-Ditch link (dev build)**
- [ ] *In Safari, open `ditch://add?service=netflix`: Ditch opens Home with the Add sheet on Netflix. A made-up service just opens Add. Mid-onboarding, it just opens onboarding.

## 1h. Ditched moment, new billing cycles, Bobby gaps (Nov 15)
- [ ] Hold a subscription on Home to ditch it. The Ditched screen: no big stamp. The row's DITCHED tag appears with a firm buzz, the logo dims, the duck pops up over the row, then "$X a year you won't pay, once you cancel." fades in. The number never moves.
- [ ] Turn on Reduce Motion (iPhone Settings → Accessibility → Motion) and ditch another: everything shows finished with a short fade, the buzz still comes.
- [ ] Nowhere says "saving" or "saved": the Ditched screen line reads "With the ones you've cancelled, that's $X a year you won't pay"; the Ditched tab reads "You won't pay $X a year."
- [ ] Ditched tab with nothing ditched: the duck sits on a faint placeholder row (no stamp).
- [ ] Edit any subscription: under Weekly · Monthly · 3 months · Yearly there are two chips, Every 2 weeks and Every 6 months. Pick Every 2 weeks at $10: Home's yearly total goes up by $260; the next charge steps 14 days at a time.
- [ ] Every 6 months with a date of Aug 31: the next charges read Feb 28 (Feb 29 in a leap year), then Aug 31.
- [ ] Settings → Your data → Export as spreadsheet (CSV): the Billed column says Monthly / Every 2 weeks / Every 6 months (words, not codes). Export is free.
- [ ] Add a subscription, search a name that isn't on our list (e.g. "Corner Bakery Club"): under "Add … as your own" is "Not on our list? Ask us to add it", which opens an email. Searching one we have (e.g. Netflix) doesn't show it. Editing an existing one never shows it.
- [ ] Settings → Feedback & help has "Suggest a subscription".
- [ ] Update over an old install: your saved list is all still there after the update (the app upgrades its storage once, on first open).

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

## W2. Free tools (ditchsubs.app/tools)
- [ ] /tools lists 10 tools; "Free tools" is in the top menu and the footer.
- [ ] Charge finder (/charges/apple-com-bill): type 9.99 → iCloud+ 2 TB, Apple Fitness+ and others; switch country to UK and type 11.99 → Disney+, Apple Music. Says "possible matches", never "this is".
- [ ] Free trial: start Jan 31, 1 month → ends Feb 28; Apple → cancel by Feb 27. "Add 2 reminders" downloads a calendar file; open it on iPhone and see 2 all-day events.
- [ ] Apple One: Music + TV + Arcade + 50 GB in the US → Apple One Individual is $13.01 a month less.
- [ ] Monthly vs yearly, Family split, Compare, Cost per hour: pick a country and a service, numbers change.
- [ ] Refund helper: Apple + "forgot to cancel" → reportaproblem.apple.com steps.
- [ ] Spreadsheet: download, open in Numbers or Google Sheets; prices filled in for your country.
- [ ] Turn on airplane mode after a page loads: tools still work (nothing is sent).
- [ ] /tools is grouped (Check a charge, Know what you pay, Before you pay, Share a plan, Compare, Get money back); the chips at the top jump to each group.
- [ ] Service tools: open /tools/spotify-family-split → Premium Family $21.99 picked, 4 people → $5.50 each. Open /tools/chatgpt-plus-vs-claude-pro → both plans listed side by side.
- [ ] Each tool page: short heading, one line under it, the tool, then How it works, Good to know, 3 questions, one Sources line. No strap line above the heading.
- [ ] Every example line reads right ("Claude Pro is $20.00", not "Claude Pro Pro").

### W3. New look (v4, Nov 13): check on iPhone and on a laptop
- [ ] /tools: search box at the top, 3 big cards (What's this charge?, Free trial deadline, What you pay in a year), then groups with real logos. Type "spotify" → only Spotify tools; type "zzz" → "Nothing for…" with a "see every tool" link that brings everything back.
- [ ] /tools/spotify-family-split: choices in a white box, answer in a black box with a big yellow number. Family is picked first. Tap − and + : stops at 2 and 6. Pick Duo: max 2 people. "$X a year each" for 4 people is $65.97 (not $66.00).
- [ ] /tools/microsoft-365-family-split: compares with Personal ("$67.49 less each year"), not Premium.
- [ ] /tools/netflix-vs-hbo-max: one table, both logos on top, the cheaper price in a yellow pill. Tap "A year": numbers switch to yearly. Under it: a by-country table.
- [ ] /charges/apple-com-bill: type 9.99 → count matches the list ("Showing the first 12" if more). Type 1,299.00 → reads as 1299. Type -5 → "doesn't look like an amount".
- [ ] /cancel/netflix on a laptop: yellow "On Netflix's website" box and "On this page" stay on the right while you scroll. On iPhone: 3 cards for how you pay, then steps.
- [ ] /prices/netflix: same layout; Related shows Netflix tools first.
- [ ] Every tool's yellow box says "Free for 3 subscriptions, Pro covers the rest."
- [ ] Tab through /tools/spotify-family-split with a keyboard: the focus ring is yellow inside the black answer box.
- [ ] /tools/youtube-premium-family-split is gone from the site (parked until US prices are checked).

### W4. Price changes, new guides (Nov 13)
- [ ] Home: the line under the headline reads "Track every subscription free. Get a reminder 3 days before a charge." No checkbox under any email box.
- [ ] /price-changes: 3 number cards (rises, subscriptions, biggest %), then months newest first. Each row: logo, plan, country tag, old price crossed out → new price, dates, a source link that opens. Xbox Game Pass (April 2026) shows a green "−" cut.
- [ ] /prices/netflix: a "Netflix price history" section with dated rises and a link to /price-changes.
- [ ] New guides open: /cancel/icloud, /cancel/adobe-cc, /cancel/crunchyroll, /cancel/kindle-unlimited (title says Kindle+), /cancel/nyt.
- [ ] /cancel/google-one: "What happens after", "How to check", "Pause instead" and 3 questions, each fact matching Google's own page.
- [ ] Footer → Prices column has "Price increases".

### W8. Comparison pages and every tier (Nov 15, late)
- [ ] Browser tab titles: /prices/claude-pro reads "Claude pricing 2026: Pro, Max and Ultra, 28 countries"; /prices/costco "Costco membership cost 2026…"; /prices/icloud "iCloud storage plans 2026…". Page heading on /prices/claude-pro says "Claude pricing 2026" and the plans say Claude Pro, Claude Max, Claude Ultra.
- [ ] /tools/chatgpt-plus-vs-go: title "ChatGPT Go vs Plus", Go on the left, "What ChatGPT Plus adds" table.
- [ ] /cancel/claude-pro heading: "How to cancel Claude".
- [ ] Home on iPhone and laptop: the header is yellow over the yellow hero. Scroll down: it stays yellow until the hero has gone under it, then fades to cream. Scroll back up: it fades to yellow as soon as the hero comes back. No cream bar over yellow, no snap.
- [ ] Laptop home hero: the phone's two round buttons at the bottom edge show a torch (left) and a camera (right), half hidden by the edge.
- [ ] Laptop: the menu reads Cancel guides · Prices · Compare · Free tools · Pricing in one row. Nothing wraps onto two lines. On an iPad or a narrow window it turns into the ☰ button.
- [ ] iPhone: ☰ shows Cancel guides, Prices, Compare, Free tools, Pricing. Tap Pricing from any page: it glides to the pricing section on the home page.
- [ ] Open ditchsubs.app/compare: groups AI chat, Music, TV and video, Cloud storage, Gaming, Which plan?. Type "claude" in the search: only Claude pages stay.
- [ ] /tools/claude-vs-gemini: the first line says both US prices. The price box works (switch country, switch A month / A year). Under it, "What you get": logos, then rows like Usage, Models, Deep research. On the iPhone each row shows the label on top and the two answers side by side. "Not stated" is grey and italic.
- [ ] /tools/claude-pro-vs-max: the box shows Pro and Max with "Pay monthly" and "Pay yearly". Under it: "Max costs $80.00 more a month". Switch the country to the UK. "What Max adds" table under it.
- [ ] /tools/netflix-standard-vs-premium: the country table at the bottom has Standard, Premium and Gap columns and fits (swipe on the iPhone).
- [ ] /prices/disney-plus: the top card shows 3 plans only. Scroll: "Disney+ bundles and live TV" lists the ESPN, HBO Max and Live TV bundles with prices. Same on /prices/hulu.
- [ ] /prices/claude-pro: plans include Max ($100) and Ultra ($200). The intro says UK prices are from the iPhone app (not the US ones).
- [ ] /prices/netflix: near the bottom, "Compare Netflix" with pills (Netflix vs Hulu, Netflix Standard vs Premium…). Each opens.
- [ ] /tools/disney-hulu-bundle-calculator on the iPhone: "$24.98" and "$12.99" sit on one line each, with "a month" underneath. The bundle is $12.99 (not $21.99).
- [ ] Footer → Free tools → "Compare subscriptions →" opens /compare.
- [ ] /prices/grok: US shows Plus $8, Premium $30, Super $100, Ultra $200 (and yearly). "Good to know" explains that other countries show the iPhone app's SuperGrok plans.
- [ ] /tools/claude-vs-grok: the columns say Claude Pro and Grok Premium; "Is Claude Pro or Grok Premium cheaper?" says $20 vs $30.
- [ ] /tools/grok-plus-vs-premium: "Grok Premium costs $22.00 more a month".
- [ ] Paste ditchsubs.app/tools/claude-vs-gemini into iMessage or WhatsApp: the preview is a yellow card with the Claude and Gemini logos and both US prices. Try /prices/netflix and /cancel/netflix too.
- [ ] Open /compare and /tools: cards show straight away (no fade). On a guide or price page, sections below still fade up as you scroll.

### W7. Phone top, menu and motion (Nov 15)
- [ ] Home at the top: yellow header and a yellow bar above it. Scroll a little: header and bar turn cream.
- [ ] Open the menu at the top of home: the menu is yellow, no strip. Open it on /tools: cream all the way up. Lines turn into an X in the same spot, links slide in; closing plays it backwards.
- [ ] Refresh any page, or tap the ditch logo from another page: you land at the very top.
- [ ] On a guide, tap "See the steps ↓": the page glides down and stops just under the header.
- [ ] Scroll a guide and a price page: sections fade up as they come on screen; nothing stutters.
- [ ] The rotating name in the home headline keeps changing.

### W6. Google titles and price-page questions (Nov 14, evening)
- [ ] Share or bookmark a few pages and check the tab title: home says "Free subscription tracker app for iPhone | Ditch"; /cancel/spotify says "How to cancel Spotify (2026): web, iPhone, Android"; /prices/netflix says "Netflix prices 2026: every plan, from $8.99/mo (US)". The full before/after list is in docs/website/titles-2026-11-14.md.
- [ ] /prices/netflix, under the country table: "Netflix prices: questions" with 3 answers (a month, other countries, the UK). Nothing repeats the price history list below it.
- [ ] /prices/claude-pro: a "cheaper if you pay yearly?" answer with the real difference ($40.00, 17%).
- [ ] Home pricing heading reads "Pro costs less than the subscription you forgot about."
- [ ] From any page, tap the ditch logo: you land at the top of the home page.

### W5. Price table, tool cards, big numbers, SEO (Nov 14)
- [ ] /tools/spotify-family-split, pick **Egypt**: the yellow number reads "EGP 34.75" on one line; "a month" sits next to it or neatly under it. Try Saudi Arabia, India, Qatar too. Same on the iPhone.
- [ ] /prices/spotify: "Spotify price by country" is one table. Countries down the left (they stay put when you swipe sideways on the iPhone), plans across the top, the cheapest price in each row on a yellow pill, "–" where a plan isn't sold. Your own country has a dark "YOU" tag.
- [ ] /prices/playstation-plus: a Monthly · 3 months · Yearly · All switch above the table. Each tap changes the columns; it fits on one line on the iPhone (swipe it if needed).
- [ ] /tools: the three big cards have a round arrow in the corner and an "Open the tool" link; on a laptop they lift a little under the mouse. Every smaller card has a › on the right. The jump chips at the top have a ↓.
- [ ] Browser tab titles fit: home says "Subscription Tracker for iPhone: Ditch it before it renews"; /cancel/kindle-unlimited says "How to cancel Kindle+ (Kindle Unlimited) in 2026".
- [ ] /support starts with a small box: Ditch isn't on the App Store yet, with a waitlist link.
- [ ] /how-we-check: the 4 steps show one number each (no "1. 1.").
- [ ] /cancel/netflix: the Questions section no longer repeats the refund, Apple and "your stuff" answers that sit higher up the page.
