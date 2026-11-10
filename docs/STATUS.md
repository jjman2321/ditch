# Status

_Update this at the end of every session._

**Last updated:** Nov 10, 2026 · **Milestone:** M1, Phase 2 done (the core app: saving, reminders, Home, Ditched, Calendar, Settings)

## Where we are
- ✅ Docs, decisions, spec. Expo SDK 58 app with money/date logic and 23 passing tests.
- ✅ **Look locked: premium white, no mascot** (DECISIONS #4, #5). The raccoon is retired after research on our buyers (`docs/research/mascot-or-not.md`). Personality now comes from the DITCHED stamp, the total reveal, real logos and a dry, kind voice.
- ✅ **Rewards rule:** no streaks, badges or points; only real money kept (DECISIONS #13).
- ✅ Research: premium-white motion (`docs/research/premium-white-motion.md`), Tim Gabe videos (`docs/research/tim-gabe-notes.md`), states and failures (`docs/research/premium-states.md`).
- ✅ **Total reveal prototype** built in code: `design/premium-white/proto/total-reveal.mp4`.
- ✅ **Phase 1 built: Sunflower design system + onboarding 01–08 and the paywall** (matches `design/v10`; screenshots in `design/build-phase1/`).
  - Design system in `src/ui/sunflower/` (colours with dark mode, Archivo/Inter type, buttons, logo tiles, the duck, timeline, plan cards, sheet…).
  - Fonts: five wide Archivo cuts bundled in `assets/fonts/` (OFL).
  - Every number comes from the user's picks and the catalog. Charge dates start as labelled guesses; the date sheet takes a next charge or a last receipt and rolls it forward.
  - Paywall follows the honest rules and the plan-card research: Save 49% (rounded down), $2.50 a month (rounded up), Monthly says "No free trial".
  - "Turn on reminders" asks for the real iPhone permission.
  - Jest tests pass (money, dates, guesses, receipts, heads-ups, totals, prices, You're set copy).
  - The Kiwi kit, raccoon, 3D emoji and Plus Jakarta Sans are gone.
- ✅ **Phase 2 built (Nov 10): the core app.** Screenshots in `design/build-phase2/` (`node scripts/shoot-phase2.mjs` with the web preview running).
  - **Saving:** SQLite with numbered migrations (`src/db/`). Everything from onboarding is saved when you tap "Go to my list"; after that the app opens on Home.
  - **Reminders that fire** (`src/domain/reminders.ts`, `src/services/notifications.ts`): 3 days and 1 day before at 9:00 AM (Pro: your own days), Free = your 3 picks, "around" for guessed dates, the Pro trial's own heads-ups, one "Did you cancel X? It charges tomorrow." for ditched-but-not-cancelled subs, never in the past, never twice, max 64 soonest first, a year ahead. Rescheduled after every change, on launch, on return to the app and at midnight. "Send me a test reminder" in Settings.
  - **Home** (09/09b/09c/11): yellow total per currency, This week / Next week / Later, GUESS tags, bells, reminders-off banner, empty state with quick add, add/edit sheet, **hold to ditch** with the ring.
  - **Ditched screen** (10/10b/10-se): the stamp lands with one heavy buzz, "$X a year you won't pay, once you cancel.", one last check, official cancel page (Netflix, Hulu, Spotify, YouTube; Apple's page for Apple-billed and the Pro trial; a how-to for the rest), I already cancelled, Undo.
  - **Ditched tab** (13): "You're saving" from confirmed cancels only, waiting list, cancelled list, step chart, honest footnote.
  - **Calendar** (12): month grid, dashed guesses, heads-up dots, day detail with the reminder days.
  - **Settings** (Layout A from `docs/research/settings.md`): health card, Remind me, Time, Which subscriptions, Ditch Pro, Currency, Your data (CSV export, delete all), Contact support, About.
  - 155 Jest tests pass (31 for reminders alone; migrations run real SQL in Jest through Node's built-in SQLite).
  - New Expo Go modules: the iOS time picker, `expo-sharing`, `expo-file-system`.
- ⚠️ Purchases are still stubbed (RevenueCat in M2). In Expo Go, Settings has a "Test build only" group with **Preview Pro** and "Reminder time: 1 minute from now". It never shows in the App Store build.
- ⚠️ Differences from the v10 renders, on purpose: Home shows "N dates are guesses · Check them" on Free too (not only Pro), because exact dates make reminders exact; Settings follows Layout A, not render 14; deleting a sub asks first instead of offering Undo.
- ⚠️ The DITCHED stamp is still drawn in code (wobbly border, ink specks). It needs real hand-lettering before launch.
- ⚠️ Reminder delivery can only be proven on a real iPhone: run `docs/MANUAL-TESTS.md` §5.
- ⚠️ "Import from a screenshot" (DECISIONS #16) is a placeholder screen.
- ✅ **Prices by country (DECISIONS #17):** 102 verified rows for 12 countries, generated into `src/catalog/prices.data.ts` by `npm run prices`. Country from the iPhone Region with "Prices for 🇺🇸 US · Change", one-tap plan pills, "Add your price" where we have no checked price, one total per currency (US$ vs A$ kept apart). 81 Jest tests pass.
- ✅ **Price research, round 2 (Nov 9, headless browser):** 148 verified rows. New: Amazon Prime (10 countries), Disney+ US/CA/AU/ES/NL, PS Plus and Xbox Game Pass (all 12), Hulu, Peacock, Paramount+, Canva Pro (US), Spotify ES, Dropbox and Notion US (monthly vs yearly now split). US total for the 6 popular picks: $396 → $726 a year.
- ⚠️ **Still "Add your price":** YouTube Premium (youtube.com says "not available in your country" to our cloud browser) and ChatGPT Plus (chatgpt.com loads amounts from a request we never get; openai.com blocks bots). Both US rows stay unverified at $15.99 / $20. Amazon NL unverified (blocked). Google One, Adobe CC, Crunchyroll not checked; see `notChecked` in the research file.
- 🗄️ Retired: raccoon poses and Seedance loops in `design/premium-white/anim/` (kept for reference, not used).

## Next
1. **Only you can do this (20 min):** on your iPhone with Expo Go, run `docs/MANUAL-TESTS.md` §5 "Reminders really arrive". This is the product: a test reminder, a real heads-up at a time 2 minutes away, one after a restart, and the "Reminders are off" state. Tell me any step that fails.
2. Then §2–§4 and §6–§9 (saving, Home, add/edit, hold to ditch, Ditched, Calendar, Settings), light and dark.
3. **Only you can do this (5 min):** on your iPhone or Mac in the US, open youtube.com/premium and chatgpt.com/pricing and tell me the prices you see (Individual / Family / Student; Plus). I'll mark them verified, then `npm run prices`.
4. M2: RevenueCat, real purchases and restore, Pro lapse handling, then an EAS development build.
5. Owner decision: should "Check your guessed dates" show on Free too (built that way), or only on Pro like render 9b?

## How to run the app
1. Install **Expo Go** from the App Store on your iPhone.
2. On your Mac, in the `ditch` folder: `npm install`, then `npx expo start`.
3. Scan the QR code with the iPhone Camera. The onboarding opens.

Once native modules arrive (M2), we switch to an **EAS development build**, installed on your iPhone through a link. No Xcode needed.

## Things only you can do
Do the ⏰ ones now; they take days to get approved. The rest can wait until the milestone listed.

### ⏰ 1. App Store Connect: Paid Apps agreement, tax and bank (start now)
1. Go to appstoreconnect.apple.com and sign in as the **Account Holder** of the Grasp Labs LLC developer account.
2. Open **Business** (it used to be called "Agreements, Tax, and Banking").
3. Next to **Paid Apps**, tap **View and Agree to Terms** and accept.
4. **Bank account:** add the LLC's US business bank account.
5. **Tax forms:** fill in the US tax form for the LLC, using its EIN.
   - A single-member US LLC owned by someone living outside the US is a special case for US tax. **Ask your accountant which form applies (W-9 or W-8BEN-E) before you submit.**
6. Done when Paid Apps shows **Active**. It can take a few days.

### ⏰ 2. App Store Small Business Program (right after #1)
This drops Apple's cut from 30% to 15%.
1. Go to developer.apple.com/app-store/small-business-program and tap **Enroll**.
2. Sign in as the Account Holder.
3. List any associated developer accounts (probably none) and submit.
4. Apple emails you when it's approved.

### ⏰ 3. FinanceKit entitlement request (week 1, free)
This is for v2 (Apple Card data). Approval is slow, so asking early costs nothing.
1. As the Account Holder, open developer.apple.com/contact/request/financekit.
2. Describe Ditch: "Subscription tracker. Reads Apple Card transactions on the device to find recurring charges. No data leaves the device."
3. Submit.

### 4. Expo account (before M1, free)
1. Sign up at expo.dev, using the Grasp Labs email.
2. Install **Expo Go** on your iPhone.
3. Don't share the password in chat.

### 5. Support inbox: support@ditchsubs.app (before M5)
You own ditchsubs.app (confirmed Nov 9). There's no inbox yet. Easiest free route, if you pay for any iCloud+ plan (even 50 GB):
1. On a Mac or at icloud.com, open **Settings → iCloud → Custom Email Domain**.
2. Pick **Only you**, enter `ditchsubs.app` and add the address `support@ditchsubs.app`.
3. Apple shows a few DNS records (MX, TXT, SPF, DKIM). Add them where you bought the domain: its DNS settings page.
4. Back in iCloud, tap **Finish setup**. Mail to support@ now lands in the Mail app on your phone, and you can reply from it.

No iCloud+? Cloudflare Email Routing is free but forward-only (replies come from your personal address).

### 6. Create the Pro products (at M2, steps will come then)
- **$4.99/mo** and **$29.99/yr with a 7-day free trial**, in one subscription group.
- **$49.99 lifetime**, as a non-consumable.
- The app record and bundle ID get created first, in M1/M2.

### 7. RevenueCat account (at M2)
- Sign up at revenuecat.com and connect App Store Connect.
- Its **public iOS SDK key** goes into EAS:
  - expo.dev → project → **Environment variables**,
  - named `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`.
- **Not in chat.**

### 8. Trademark (before filing anything, by M5)
- Book a 1-hour check with a US trademark lawyer.
- Plain "DITCH" is already registered by others in classes 9 and 42.
- Options to ask about:
  - a combined name + DITCHED stamp mark, or
  - "DITCH SUBSCRIPTION TRACKER".

### 9. Free sign-ups for v3 bank sync (anytime, no rush)
- **Plaid:**
  - Sign up at dashboard.plaid.com as **Grasp Labs LLC** and use Sandbox.
  - Request the free **Trial** (10 real bank connections).
  - **Do not apply for paid Production yet.** That ends the free Trial for good.
  - The Trial application also tells us whether an Egypt-based founder qualifies.
- **Stripe:**
  - Create an account for Grasp Labs LLC at dashboard.stripe.com/register.
  - Stay in test mode to try Financial Connections.
