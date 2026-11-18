# C. Ditch audit: screen by screen, plus where Plaid goes (Nov 18, 2026)

Agent C of the UX overhaul. Scope: Ditch as it is today (web preview, iPhone 15 size 393×852, light + dark), not competitors.
Screenshots: `/tmp/claude-0/-home-user/b6b27c63-8e53-560d-a517-60b6e884bad4/scratchpad/ux/c/` (`o*` = onboarding, `m*` = main app, `d*` = dark mode, `dark-contact-sheet.png` = all dark shots on one page).
Severity: **P0** costs conversions or trust now · **P1** clearly hurts clarity or polish · **P2** nice to fix.

## The short version
The bones are good: a strong welcome, a real yearly-total "aha", an honest paywall and a genuinely nice Ditched moment. The "AI slop" feeling doesn't come from any single ugly screen. It comes from **sameness and piling up**:
- Every screen is the same template: big Archivo headline, grey uppercase label, white rounded card, list rows, one black pill button, then a line of grey small print under it.
- Every feature that got built also got its own card on Home.
- Underlined text links are used as a second button style everywhere.
- Two emoji stand in for icons.

The app's best-selling feature (finding your subscriptions, and soon the bank scan) **isn't in onboarding at all**. In the app, it's a card at the bottom of Home and a small grey link in the Add sheet.

---

## 1. Every screen, in journey order

### Onboarding (7 screens)
**O1 Welcome** (`o01-welcome.png`, dark `d01-welcome.png`). **P1**
- Shows: "Ditch it before it renews." A sample Netflix reminder and a 3-stop timeline. "See what I pay". "Free forever for tracking. Reminders on 3."
- Confusing: "Reminders on 3" reads like a typo until you know the free tier. Nothing says Ditch can *find* your subscriptions or help you cancel. It reads as a reminder app only.
- Slop: the timeline repeats the notification right above it (the same fact twice). Small print under the CTA.
- Good: the strongest screen in the app. Keep the type, the duck and the real notification.

**O2 What do you pay for?** (`o02-services.png`, `o02c-icloud.png`, `o02d-picked.png`). **P1**
- Shows: search, 13 category chips, 176 services with tick circles, "Change" plan links, a live total at the bottom.
- Confusing: The header (title, country line, search, chips) takes ~330pt, about 40% of the screen, so only ~5 rows show; The #4 popular service, YouTube Premium, shows "Add your price", so ticking it adds $0 to the total; Apple TV's plan reads "TV · $14.99". Disney+ defaults to "With Ads", which undercounts; Once ticked, Amazon Prime loses its plan name ("$14.99/mo · Change").
- Slop: iCloud+ uses a ☁ emoji tile instead of a logo (`o02c`); Underlined "Change" links wrap onto their own line on some rows (Spotify), so rows have ragged heights; The disabled button is grey with "Tick what you pay for" in the bar.

**O3 Your total** (`o03-total.png`, `d03-total.png`). **P1**
- Shows: "You pay $965 a year", $80.45 a month, a study fact, the list biggest first, "Set up reminders".
- This is the aha moment (tap ~7). It works.
- Confusing: "Not using one? Ditch it before it renews." is a dead line with no action. It's also the perfect moment for "Missing any? Let us find the rest", which isn't offered.
- Slop: the uppercase "BIGGEST FIRST / PER YEAR" label pair is the same pattern as every other list.

**O4 Which day does each one charge?** (`o04-dates.png`, `o04b-day-sheet.png`, `o04c-day-picked.png`, `o04e-dates-partial.png`). **P0**
- Shows: one "Pick day" button per sub. A 1–31 grid sheet that moves to the next sub after Save. "0 of 5 set · No reminders without a date".
- Confusing: this is homework. Most people don't know their charge days, and the screen admits it ("It's on your bank app or the receipt email"), sending them *out of the app*. 5 subs = 11 taps here alone; It's the most likely place to quit, and it comes **before** the paywall.
- Slop: the hint is said twice (subtitle and the yellow box in the sheet). The sheet is huge (grid, "Last day of the month", hint box, Save, "I'm not sure") for one number.

**O5 Reminders pre-ask** (`o05-reminders.png` mid-animation, `o05b-reminders-settled.png`, dark `d05-reminders.png`). **P1**
- Shows: "Get a reminder before you're charged.", a fake lock screen with 2 notifications, "Turn on reminders", "Tap Allow on the next screen", "Maybe later".
- Confusing: The headline is the welcome subhead again, word for word; The lock screen says Sunday, Dec 13. The top card says "now", but the card under it says "Mon, Nov 30", an older date in the wrong order.
- Slop: The headline orphans "before" on its own line, which breaks DECISIONS #23; Mid-animation, the two cards overlap and their text collides (`o05`); The duck is cropped by the lock screen and sits between the torch and camera buttons; In dark mode, the bright yellow lock screen is the loudest block in the app (`d05`).

**O6 Paywall** (`o06-after-reminders.png`, `m10-paywall.png`, dark `d-paywall.png`). **P0**
- Shows: "Get a reminder before all 5 renewals." A Free | Pro table (5 rows), Yearly / Monthly / Lifetime cards, "Rather pay once? Lifetime, $49.99", "Start 7-day free trial", and the honest price line.
- Confusing: **the pitch is weak for this exact user.** They have 5 subs, and Free already covers 3, so Pro sells "2 more reminders". "Price watch" isn't explained. Nothing sells finding, the bank scan, or the widget.
- Slop: "Rather pay once? Lifetime, $49.99" repeats the Lifetime card right above it; There are two bordered card systems (the table and the plans) stacked tight; The duck's bill overlaps the table's PRO header.
- Good: the × is visible, there are no fake timers, and Restore is there.

**O7 You're set** (`o07-done.png`). **P1**
- Shows: a checklist (5 on your list · $965; Reminders on 2 of 5; 3 with no date), the first reminder card, "See all 2 reminders", "Send me a test now", "Go to my list".
- Confusing: "Reminders on 2 of 5" right after a paywall that said Free = 3 reads like the app shorted them. The real reason (only 2 have dates) is in the third line.
- Slop: two underlined links stacked under the card. "You're set." while 3 items are still to-dos.

### Main app
**M1 Home** (`m01-home.png`, `m01b-home-bottom.png`, `m01c-home-overlap.png`, `m01d-home-overlap-scroll.png`, `m13-home-overlap-se.png`, after onboarding `o08-home-after-onb.png`). **P0**
- Shows: the yellow total card; the "Next reminder" card; the "Before payday" card; the "2 have no date yet" card; the overlap card ("2 music services… Got it"); card filter chips; This week / Next week / Later / No date yet groups; "Missing any?" at the very bottom
- Confusing: With the "overlap" example list, **only one subscription row shows above the fold** (`m01c`). The list, which *is* the product, is pushed under five cards; The bell (filled yellow or outline) is the only sign of reminder state, and nothing says it's tappable; Ditching only works by holding a row, and the only hint is a small grey "Hold a sub to ditch it".
- Slop: 5 cards built from the same white rounded rectangle, each with different inner layouts (one has a "Got it" text link, one a "Add dates ›" link, two have chevrons); "YouTube Premi…" truncates (`m01d`, breaks #23); "Add date" is an underlined link inside rows; The "Amex ending 1005 / Visa ending 4821" chips run off the edge.

**M2 Add sheet** (`m02-add.png`). **P0**
- Shows: "Track a free trial" card, "Missing any? See where they hide" text link, search, chips, list, a disabled "Tick what you pay for" button.
- Confusing: the find tools (the launch moat) are a 13pt grey text link. The list starts on Prime Video because ones already on the list are hidden, which looks like a bug.
- Slop: the instruction used as a button label (also on O2 and the find review screen).

**M3 Find hub** (`m03-find.png`, `d-find.png`). **P0**
- Shows: "Find your subscriptions", 2 big cards (Apple screenshot, Statement) with "FREE ONCE · THEN PRO" pills, then "Or check the usual places" (Google Play, PayPal, Amazon, bank app, email).
- Confusing: it's reachable only from the bottom of Home and the Add-sheet link. "Banks can't name these" sits on the Apple card, which is about to be odd next to a bank-connect row.
- Slop: 📱 and 🧾 **emoji as icons**, the clearest "AI slop" tell in the app; The pills are all-caps small print; The "usual places" list is a wall of arrow paths; The back button's VoiceOver label reads "Back to Back" (`src/find/Parts.tsx:22`).

**M4 Find: Apple / Statement** (`m03-find-apple.png`, `m03-find-statement.png`). **P2**
- Shows: clear 3-step instructions. Fine.
- Slop: grey "Read on your iPhone…" small print, and the yellow callout box pattern again.
- "Try with a sample (test builds)" is hidden from App Store builds (`SHOW_SAMPLES`). OK.

**M5 Find review** (`m04-find-review-sample.png`, `m04b-find-review-apple.png`). **P1**
- Shows: "We spotted 6. Check them." in groups: Still charging / Maybe / Already cancelled. Ticks, "Add 1", small print.
- Confusing: **no money total**. The bank-scan payoff ("$1,140 a year") is missing, and this is where it should land. Subs already on the list are shown greyed out with an empty tick circle, which looks tappable.
- Slop: "Check them." orphaned on its own line. A disabled "Tick what you pay for" button. Small print under the button.

**M6 Edit sheet** (`m06-edit.png`, `m06b-edit-scroll.png`, dark `d-edit.png`). **P1**
- Shows: name; plan chips; price; 8 currency chips; a 4-way cycle segmented control, plus 2 loose chips ("Every 2 weeks", "Every 6 months"); next charge; trial toggle; Remind me, with a live notification preview; "For when you cancel" (paid with, email, notes); skip-this-charge toggle; Ditch button; Delete; Save
- Confusing: Netflix shows price $17.99 but the plan chips offer $8.99 / $19.99 / $26.99, with none selected. Is the price right?
- Slop: about 14 controls in one scroll. Two components for one choice (cycle). A notification preview inside a form. Chip rows that run off screen.

**M7 Ditched moment** (`m07-ditch-moment.png`, dark `d-ditch.png`). **P2**
- Shows: the row with the DITCHED tag, duck, "$215.88 a year you won't pay, once you cancel.", the running total line, the "One last check" card, "Cancel in Netflix", "I already cancelled", the Apple-billing hint.
- Good: the best moment in the app.
- Slop: 7 stacked blocks. "Paid with Visa · Account: sam@…" and "With the ones you've cancelled, that's $647…" both compete with the hero number. Cut one.

**M8 Ditched tab** (`m08-ditched-tab.png`, `m08b-ditched-tab-scroll.png`, `m08d-ditched-empty.png`). **P1**
- Shows: "You won't pay $431 a year", To cancel (with "I cancelled it" / "How to cancel"), Cancelled list, the "Adding up" step chart, a footnote.
- Confusing: the footnote "Ditch can't see your bank…" stops being true in spirit once bank scan ships. The tab icon (a rubber stamp) doesn't say "savings".
- Slop: the step chart adds little over the list. The DITCHED tag and the black "I cancelled it" pill fight for attention.

**M9 How to cancel sheet** (`m08c-howto.png`). **Keep.** Clear, 3 steps, honest ("Ditch can't cancel for you"), with "Your rights in the US" tucked into one row. This is how every secondary feature should be handled.

**M10 Calendar** (`m05-calendar.png`, `m05b-calendar-scroll.png`, dark `d-calendar.png`). **P1**
- Shows: the month, the total due, a grid with logos and reminder dots, the selected day, "Year ahead", "No date yet".
- Confusing: Year ahead reads "Most months $63.97 / November $49.98". No one knows what "Most months" means at a glance. Today (18) and the selected day (23) use two different highlight styles.
- Slop: "No date yet" is repeated from Home.

**M11 Settings** (`m09-settings.png`, `m09b-settings-scroll.png`). **P2**
- Shows: an "All good" health card plus test reminder, Reminders, the Pro row, Currency / Payday / Your data, Feedback & help, About.
- Fairly clean.
- Payday hides here, but it surfaces as a Home card, so the feature lives in two places.
- There is no place for "Find subscriptions" or "Bank scans" yet.

**M12 Empty Home** (`m01e-home-empty.png`). **P1**
- Shows: duck, "Nothing to watch yet.", "Add a subscription", a quick-add grid.
- It never offers "Find them for me", which will be the best empty-state hero once Plaid is in.

### Patterns across all screens (the "slop" list)
1. **One template everywhere:** uppercase grey label, white rounded card, rows. There's no hierarchy between "this is the product" (the list) and "this is a tip" (overlap, payday).
2. **Small print under every main button:** "Tap Allow on the next screen", "Nothing's added until you tap Add. Edit any of them after.", "Read on your iPhone…", "A real person reads every email.", "Ditch can't see your bank…". Each is fine alone. Together they read as nervous.
3. **Underlined links as a second button system:** Change, Add date, Got it, See all 2 reminders, Send me a test now, See where they hide, Lifetime $49.99.
4. **Emoji placeholders:** 📱 🧾 ☁.
5. **Orphaned headline words:** "before" (O5) and "them." (M5).
6. **Repeated copy:** "Get a reminder before you're charged" (O1 and O5). "It's on your bank app or the receipt email" (O4, twice).

---

## 2. Onboarding specifically
- **10-second test:** half a pass. In 10 seconds a new user gets "tracker + reminders before charges". They do **not** learn that Ditch finds subscriptions, helps cancel, or shows what you've stopped paying.
- **Key features, and whether onboarding teaches them:** See your yearly total: yes (O3); Reminders before charges: yes, twice (O1, O5); Find what you forgot (screenshot, statement, bank): **no**; Track free trials: **no**; Ditch + cancel help: **no**. The Ditched moment is never previewed; Calendar: no. That's fine; it's discoverable.
- **Where people get lost:** O4 dates. It's homework, and it sends them to the bank app; the paywall. Weak reason to pay when Free covers 3 of 5; O7's "Reminders on 2 of 5". It feels like a bait-and-switch, though it isn't one.
- **Length:** 7 screens. With 5 subs and every date set, that's **~24 taps**: Welcome 1; Picks 5 + 1; Total 1; Dates 1 + 10 + 1; Reminders 1 + iOS Allow 1; Paywall × 1; Done 1
- **The aha moment:** the $965 reveal at tap ~7. The *second* aha (we found things you forgot) doesn't exist yet, and Plaid is exactly that moment.

## 3. Information architecture
- **Today:** 3 tabs: Home, Calendar, Ditched; in Home's header: a gear (Settings) and a + (Add sheet); Find has no front door. It's a stack screen reached from the bottom of Home or a text link.
- **Features competing for attention** (13 small ones on top of the core): price watch; overlap check; payday; year ahead; skip a charge; paid with, email, notes; card filter; free-trial tracking; cancel how-to; rights; find hub; test reminder; "which 3". Each is reasonable alone. The problem is that six of them claim permanent space on Home or in the edit form.
- **Hide, merge or remove:** **Home gets one "nudge" slot**, not five cards. Show the most useful one, in this order: no dates, trial ending, price went up (Pro), overlap, payday. Move "Next reminder" into the yellow total card as its second line.
  - **Payday:** move it to the Calendar, as a line under the month total. Remove the Home card.
  - **Card filter chips:** remove from Home. Show "Paid with" in the row's subtitle, or make it a filter in Calendar. Few people will set cards on more than 2 subs.
  - **Year ahead:** replace "Most months / November" with one sentence ("Next 12 months: $1,091 · biggest month Jan, $157.96") or cut it.
  - **Edit sheet:** Basics (plan, price, how often, next charge, reminders) and a collapsed "More" (trial, currency, paid with, email, notes, skip this charge). Fold the 6 cycles into one menu picker.
  - **Rights:** keep it where it is (one row inside the cancel sheet). That's the model.
  - **Find:** give it a real front door. The + opens a short chooser: **Find automatically** (bank / Apple screenshot / statement) and **Add one myself**.
  - **Ditched tab:** keep it (it's the reward loop), but use a clearer icon (a down-arrow coin or a cut card), not a stamp.

---

## 4. Plaid proposal: where bank connection lives

**Answer: all three, with one main path.** Bank connection becomes the *first* step of onboarding for US/CA users. It's also the top row of the Find hub, and the hero of the empty state. Manual picking becomes the fallback, not the default.

### Onboarding with Plaid (US/CA). Target: 8 screens, ~12 taps, two aha moments.
1. **Welcome.** Headline unchanged. Subhead: "Find every subscription. Get a reminder before each charge." Button: "Find my subscriptions".
2. **How to start** (new, one screen, 2 big choices + 1 small):
   - **Connect your bank** (primary card): "Finds them in about a minute. US & Canada."
   - **Pick them myself** (secondary card): "Tick from 176 services."
   - Small link: "Got an iPhone list? Scan a screenshot instead."

   Outside US/CA, the bank card is hidden and the screenshot becomes the primary card.
3. **Before you connect** (Ditch's own trust screen, before Plaid opens). Duck, plus 3 short lines with icons:
   - "We look once, then disconnect." (connect → scan → `/item/remove`)
   - "Read-only. We can't move money."
   - "Your bank login goes to Plaid, never to us."

   Then "Connect with Plaid" and "Not now".
   - Footnote, one line: "We don't keep your transactions. Privacy policy ›"
   - No "nothing leaves your phone" (rule 5, and #64 changes the privacy label).
4. **Plaid Link.** Plaid's own sheets: bank, login, accounts.
5. **Scanning.** "Reading 12 months of charges…"
   - Service logos pop in as they're found. Logos only; no counting numbers next to prices (rule 8).
   - Ends with a quiet "Bank disconnected ✓" chip.
6. **Found: the reveal.** This replaces O3 for this path.
   - "We found 9. **$1,140 a year.**"
   - "2 free trials end this week."
   - The list biggest first, split into Still charging / Maybe.
   - **Dates come from the transactions, so the date screen (O4) disappears.**
   - Button: "Add all 9" (untick to remove).
7. **Reminders pre-ask.** New headline, e.g. "Netflix charges Dec 16. Want a nudge on the 13th?" (uses real found data).
8. **Paywall.** Headline anchored on what they found: "Watch all $1,140 a year." Rows:
   - Reminders 3 · Unlimited
   - Rescan your bank anytime (Pro) / once (Free)
   - Pick reminder days
   - Nudge if you miss one
   - Price watch, renamed "Price-rise alerts"

   Drop the duplicate lifetime link.

Then You're set, then Home.
- **All found subs are saved for free users too** (DECISIONS #11: tracking is unlimited, and Apple 3.1.2 says no bait-and-switch). Only reminders beyond 3 and rescans are Pro.
- The free scan is "once per device" (plan item 7). Say that on screen 2 ("Your first scan is free").

**Manual path** (the "Pick them myself" card): today's O2 → O3 → O5 → O6 → O7, with **O4 made optional**:
- Default every sub to "No date yet".
- Ask only for the ones the user taps.
- Or offer at the end of O3: "Don't know the dates? Connect your bank and we'll fill them in."

### In the app
- **Empty Home hero:** "Find what you pay for", with buttons "Connect your bank" (US/CA) and "Add one myself". Quick-add grid below.
- **+ button:** a 2-option chooser (Find automatically ›, Add one myself ›). "Track a free trial" stays as a row inside "Add one myself".
- **Find hub**, ordered by power, one icon style, no emoji, no all-caps pills: **Your bank** (US/CA). Last scan date, plus "Free once · then Pro" as plain grey text; **Apple subscriptions screenshot.** Change "Banks can't name these" to "Names the App Store ones your bank shows as APPLE.COM/BILL". This makes it the bank scan's partner, not its rival; **Statement file.**; **"Where else to look"** as one collapsed row.
- **Home bottom:** "Missing any?" becomes a one-line nudge in the Home slot, shown only when the list has had no find in 90 days.
- **Settings → "Bank scans":** last scan date; "Disconnected after scan"; next free rescan (Pro: every 90 days); "Delete scan data" (there is none, so say so plainly)
- **Ditched tab footnote:** "We don't stay connected to your bank, so this counts the ones you told us you cancelled."

### Trust and permission screens needed
1. Ditch's own "Before you connect" screen (3 promises, shown above).
2. Plaid's consent pane (Plaid owns it, and it's required).
3. "Scanning" with a visible disconnect confirmation.
4. Failure states:
   - bank not found → "Try a screenshot or statement instead"
   - login failed → retry
   - Chase OAuth slow → "This bank can take a minute"
   - no subscriptions found → "Nothing repeating in 12 months. Add any we missed?"
5. Notifications pre-ask, *after* the found list, so it's about real charges.
6. App Store / privacy:
   - label "Data Linked to You: Financial Info"
   - update every "Read on your iPhone" line so the bank row doesn't claim it
   - review notes with the Plaid Sandbox login

---

## 5. Top 20 fixes, ranked by impact on clarity and conversion
| # | Screen | Problem | Fix | Effort |
|---|---|---|---|---|
| 1 | Onboarding | Finding (the moat) isn't offered. The user does all the work | Add the "How to start" fork with Connect your bank first (§4) | L |
| 2 | O4 Dates | 11-tap homework before the paywall; sends users to the bank app | Dates come from bank/screenshot; on the manual path make the step optional, ask later | M |
| 3 | O6 Paywall | Sells "2 more reminders" to a 5-sub user | Anchor on the found or total money ("Watch all $1,140 a year"); add rescan and trial rows; drop the duplicate lifetime link | S |
| 4 | M1 Home | 5 stacked cards push the list below the fold | One nudge slot with priorities; "Next reminder" goes into the total card | M |
| 5 | M2/M1 | Find is buried (bottom card, grey link) | + opens a "Find automatically / Add myself" chooser | S |
| 6 | M5 Find review | No money reveal after a find | "We found 6 · $X a year" header; "Add all"; real button label | S |
| 7 | M12 Empty Home | Offers only manual add | "Find what you pay for" hero with the bank button | S |
| 8 | O1 Welcome | Reads as a reminder app only | Subhead names finding + reminders; CTA "Find my subscriptions" | S |
| 9 | M3 Find hub | Emoji icons, all-caps pills, wall of paths | Drawn icons, plain grey price note, collapse "usual places" | S |
| 10 | O7 You're set | "Reminders on 2 of 5" feels like a short-change | "2 reminders set · 1 free one left · 3 need a date"; one link, not two | S |
| 11 | O3 Total | Dead line "Not using one? Ditch it…" | Swap for "Missing any? Let us find the rest" (bank) | S |
| 12 | M6 Edit | ~14 controls; plan/price mismatch; two cycle components | Basics plus collapsed More; one cycle picker; select the plan that matches the price | M |
| 13 | O2 Picker | YouTube Premium (#4) has no price; iCloud ☁ emoji; ragged "Change" rows; header eats 40% | Fill top-20 prices or let ticking ask for the price; real logo; plan as a tappable subtitle; collapse header on scroll | M |
| 14 | O5 Pre-ask | Repeats the welcome; orphan word; notifications out of order; duck cropped; dark yellow glare | Headline from a real sub; fix the order; keep the duck clear of lock-screen buttons; dim the lock screen in dark mode | S |
| 15 | All | Small print under almost every CTA | Keep it only where the law or Apple needs it (paywall, permissions) | S |
| 16 | All | Underlined links as a second button style | One tertiary button style; links only inside sentences | M |
| 17 | M1 Home | Hold-to-ditch is hidden; bell meaning unclear | Swipe action "Ditch" plus hold; bell gets a label on first run ("Reminder on") | S |
| 18 | M10 Calendar | "Most months $63.97" unclear; payday lives on Home | One-line year summary; move payday here | S |
| 19 | M1 Home | Card filter chips run off screen for little value | Remove from Home; show card in the row subtitle | S |
| 20 | Polish | "YouTube Premi…" truncation; "before" / "them." orphans; "Back to Back" VoiceOver label | Fix per DECISIONS #23; `src/find/Parts.tsx:22` | S |

## 6. What to keep
- **Welcome** type, the duck and the real notification preview (`o01`).
- **The yearly total reveal** (`o03`): big number, biggest first, real logos.
- **The Ditched moment** (`m07`): "a year you won't pay, once you cancel." Honest and satisfying.
- **The how-to-cancel sheet** (`m08c`): 3 steps, one rights row, a deep link. The model for secondary features.
- **The honest paywall bones:** × from frame one, Restore, real start date and price line, no timers.
- **The find review groups** (Still charging / Maybe / Already cancelled) and "Nothing's added until you tap Add". Reuse them for Plaid results.
- **Settings' "All good" health card** plus "Send me a test reminder". A real trust builder against the Bobby complaint.
- **The Sunflower look and dark mode.** Dark is consistent across screens (`dark-contact-sheet.png`). The slop is in layout density, not the palette.
- **The voice in notifications** ("Still watching?", "Last call.").

Quick external check: Rocket Money's iOS onboarding (Mobbin flow "Onboarding") puts **"Link your accounts. We'll detect your subscriptions"** (with a "Bank-level Security" pill) at the centre of onboarding, then a paywall that leads with "pays for itself". Ditch can match the find-first order while staying more honest about connect-scan-disconnect.
