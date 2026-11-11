# Release audit (Nov 11, 2026)

Six auditors each covered one area of the app:
1. Onboarding.
2. The paywall, You're set, and App Store readiness.
3. Home, Add and Edit.
4. The Ditched screen, the Ditched tab, the Calendar and cancel help.
5. Settings.
6. A code bug hunt.

Each auditor read the code, tapped through the web preview with Playwright, and compared the screens with Mobbin and our competitors. After that, the app was screenshotted on 19 device shapes, from the iPhone SE to the 18 Pro Max, plus the iPhone Duo folded and open, and iPad mini to 13" in landscape, Split View and Slide Over. An automatic fit check ran on every screenshot. The raw reports are in the session scratchpad, under `audit/reports/A–F`.

## Verdict
**The app is ready for a TestFlight build, but not yet for App Store submission.** Every P0 and P1 that code can fix has been fixed and pushed (14 commits, 228 tests passing). Three things still block submission, and none of them can be fixed in code (the app icon and splash were done after the audit, DECISIONS #50):

| Blocker | Who | Why |
|---|---|---|
| Purchases and Restore are stubs | M2: RevenueCat, plus App Store Connect products | App Review 2.1, 3.1.1 |
| ditchsubs.app is a parked domain: /terms, /privacy and /support don't load | Owner | 3.1.2 and 5.1.1 need working Terms and Privacy links, and App Store Connect needs Privacy and Support URLs |
| Nothing has been tested on a real iPhone | Owner, with an EAS development build | Reminders must fire (CLAUDE.md rule 3) |

## What was fixed

### Reminders (the product)
- **Long-held subscriptions stopped getting reminders.** A monthly sub older than about 3 years quietly skipped its next charge, because the code estimated a month as 28 days. The estimate is fixed, with a regression test covering anchors from 1 to 30 years old.
- **One failed iOS schedule call stopped the whole pass.** It could leave the phone with no reminders at all. Each call is now tried on its own. Anything due within 2 seconds is dropped, and Delete all stops a pass that is already running.
- **The pending cap is now 60, as SPEC says.** When more reminders exist than fit, the last slot asks the user to open Ditch, so a long list never just goes quiet.
- **The free 3 stay exact on every save** (`settleFreePicks`). A sub with no date holds no slot, so giving one sub a date can never switch another sub's reminder off without telling the user. Before, that happened.
- **Date pickers only promise reminders that will come.** They skip times that have already passed today, use Pro's lead days, and say so when the free 3 are full or Remind me is off.
- **Trials:** "Track a free trial" asks when the trial ends, with no receipt tab. A trial's end always gets the 3-day and 1-day reminders, whatever lead days the user picked. Ditch's own trial stops showing as running once its date has passed, and its reminders are removed when the user switches to monthly or lifetime.
- **When Pro ends, reminders top back up to the 3 biggest subs with a date** (SPEC §6).
- **Weekly subs skip lead days of a week or more.** Those stacked several notifications onto one charge.
- **Pro's "Nudge if you miss one" is now built** (DECISIONS #27). It's a 7 PM follow-up on the day of the last reminder, and it's dropped once the user opens the app.
- **The Calendar now tells the truth:**
  - hollow dots and the off banner when reminders are off
  - "Reminder at 9 AM: Netflix charges Sat, Nov 14" (it used to say "today" for any day)
  - "1 free left" instead of "free covers 3"
  - "Reminded Wed 11, Fri 13" for charges due today or tomorrow
- **Home has a "Next reminder" row** (DECISIONS #42).

### Not losing data
- **Onboarding resumes where the user left off,** for example after checking their bank app for a date (SPEC §3.1). Progress is kept in a small file that is cleared when onboarding finishes or on Delete all.
- **The list is saved before onboarding is marked done.**
- **If the database can't be opened, the app shows "Couldn't open your list"** with Try again and Email support. Before, it started an empty app on top of the real data.
- **Delete all** now says it can't be undone, offers "Export first", and leaves nothing behind onboarding.
- **Buttons take one press at a time.** A double tap used to add subs twice and open screens twice.

### Pro, the paywall and App Review
- **The paywall decides between onboarding and in-app mode from whether onboarding is done.** It used to read the link, so a `?from=import` link could rerun onboarding and switch Pro off. Onboarding now redirects to Home once it's done.
- **Paywall rows only list features that exist.** The widget row is hidden until v1.1 and Import until it works. "Pick reminder times" is now "Pick reminder days", and "Track every subscription ✓ ✓" is back.
- **Build setup:**
  - `eas.json` profiles.
  - The production build can never show "Preview Pro".
  - `usesNonExemptEncryption: false`.
  - Settings shows the real version and build number.
- **You're set:**
  - "Trial reminders are paused" when reminders are off.
  - "Reminders on 3 of 6".
  - "Then 3 more" counts every reminded sub.
  - Pro's fallback 3 are now the biggest subs.

### Screens and devices
- **Tab bar labels were cut off on every iPhone.** The built-in item left the label only 11pt. The bar is now 54pt plus the home indicator.
- **Lists fade out above the tab bar** instead of looking sliced.
- **iPad and the open iPhone Duo:** every main screen now sits in a centred column (at most 600pt). Onboarding, the paywall and sheets already did.
- **Sheets:** drag the grabber down to close, the add/edit sheet has a 44pt ×, and content taller than the screen scrolls.
- **Ditched screen:** "Done" keeps the sub ditched. "Undo" only shows right after ditching, and "Put it back" (with a confirm) when the screen is reopened. The reminders-off card opens iPhone Settings, or asks for permission.
- **Ditched tab:** "Not cancelled yet" undoes a mistaken "I cancelled it", and the waiting list is sorted by the soonest cancel-by date.
- **Home rows** show /yr, /wk or /qtr when a sub isn't monthly. A scroll flick no longer opens a row. Dates drop "in N days" after a week, so they fit small iPhones.
- **Editor:**
  - "Check the price." appears under the price field when it can't read the price.
  - Prices over 99,999 are refused, and so is "15.490" (a typo for 15.49).
  - Switching currency rewrites the number to that currency's decimals.
- **Onboarding:**
  - A service ticked before a country change stays findable, so it can be unticked.
  - The pre-ask shows an example built from the user's own pick, and VoiceOver calls it an example.
  - The pre-ask has a "Continue" or "Open iPhone Settings" state when the permission was already decided.
  - The SE title fits on two lines.
- **Settings:**
  - VoiceOver can reach the time picker.
  - The health card has the right copy for an empty list and for a list with no dates.
  - Only one test reminder can be sent at a time.
  - The Remind me preview shows the real time.
  - The 4th-bell tap says "Free covers 3. Turn one off, or see Pro".
- **Polish:**
  - No orphan last words on any device.
  - The Ditched card fades without sliding, because nothing moves next to a price (rule 8).
  - Quick add uses the short names "Prime" and "HBO Max".

## Still open (smaller, not blocking)

| Area | Item | Sev |
|---|---|---|
| RevenueCat (M2) | Trial eligibility on the CTA; Restore sets Pro; Pro comes from the purchase, not settings; store prices for the trial entry; a busy state on buy and restore; showManageSubscriptions | P1 at M2 |
| Paywall | Headline counts undated subs ("all 6" when 4 have a date) | P2 |
| Calendar | Header says "due" for past charges and empty months; on SE the tapped day's details sit below the fold | P2 |
| Cancel help | Links are US only (amazon.com, Costco); no "I cancelled it" in the steps sheet; no "Have ready: email, card's last 4" | P2 |
| Ditched | A confirmed cancel gets no banner; empty state shows today's date on the stamp, has no duck | P2 / P3 |
| Settings | 24-hour clock in the UK and EU; the back button scrolls away on long pages; support email has no diagnostics line; CSV (BOM, formula guard, Cancelled rows) | P2 / P3 |
| Editor | Swap in place at the free limit (#24); picker ticks lost when switching to custom or trial; renaming drops the logo | P2 / P3 |
| Logic | "Reminders worked" counts days before a sub existed; deleted subs stay in SQLite; travel moves 9 AM (calendar trigger) | P3 |
| Visual | The off bell is 2.76:1 contrast (needs 3:1); savings round half up; old dates lack the year | P3 |

## Decisions for the owner

| # | Question | Options (score) | Pick |
|---|---|---|---|
| 1 | Auto-renew wording by the buy button (App Review 3.1.2 risk; conflicts with #35) | Keep "$0 today · $29.99/yr from Nov 17 · Cancel anytime" (4) · **"… · Renews yearly, cancel anytime" (8)** · Duolingo-style small print (6) | Renews yearly |
| 2 | Say the free limit before setup (~155 "told me after" reviews) | Keep it on the paywall only (4) · **Welcome small print "Free forever for tracking. Reminders on 3." (8)** | Welcome line |
| 3 | Many picks on the dates step | One sheet per tap (6) · **Save jumps to the next undated pick (9)** | Auto-advance |
| 4 | Custom service in onboarding (gym, phone plan) | Later from Home (5) · **"Add 'gym' as your own" in empty search (8)** | Add it |
| 5 | Share card after real cancels | None (4) · **"$431 a year I won't pay" on the Ditched tab (8)** | Add it |
| 6 | Week start | Always Sunday (5) · **Follow the iPhone Region (8)** | Region |
| 7 | Calendar header | Month total (6) · **"$X still to come · next Sat" (8)** | Still to come |
| 8 | Trials on the Home total | Nothing (5) · **"+ 1 trial, then $13.99 a month" (8)** | Add the line |
| 9 | Tappable bell on Home | Display only (5) · **Tap toggles, the 4th opens Swap / See Pro (8)** | Tappable |
| 10 | Price country after onboarding | Copy change only (5) · **"Prices for 🇬🇧 UK" row in Settings (8)** | Add the row |
| 11 | Reminder trigger type | Fixed time (6) · **Calendar trigger, so reminders follow local time when travelling (7, test in M2)** | Calendar trigger |
| 12 | Lifetime nudge on the paywall | Keep the line (current, 6) · Drop it and make the card read "Pay once, no subscription" (7) | Owner's call |

## Owner-only tasks (exact steps in STATUS.md)
1. **ditchsubs.app:** publish /terms (or use Apple's standard EULA), /privacy and /support over HTTPS. Check each loads on your iPhone.
2. **support@ditchsubs.app:** create the inbox and send it a test email.
4. **App Store Connect:** finish the Paid Apps agreement, tax and bank, create the app record, and paste the App Store ID into `src/app/settings/about.tsx`.
5. **RevenueCat (M2):** create the account and the 3 products. Put the key in EAS environment variables (`eas env:create`), never in chat.
6. **First EAS development build:** `eas build --profile development --platform ios`, then run MANUAL-TESTS §5 (reminders really arrive) and §1g.

## Needs a real device
The web preview can't prove these:
- notifications arriving, including the 7 PM nudge
- haptics
- the iOS permission prompt
- swiping sheets down on a real touchscreen
- VoiceOver and large Dynamic Type sizes
- the iPhone Duo fold and unfold
- iPad multitasking resizing
