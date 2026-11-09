# Status

_Update this at the end of every session._

**Last updated:** Nov 9, 2026 (late) · **Milestone:** M0 → M1 (look locked, rebuilding onboarding)

## Where we are
- ✅ Docs, decisions, spec. Expo SDK 58 app with money/date logic and 23 passing tests.
- ✅ **Look locked: premium white, no mascot** (DECISIONS #4, #5). The raccoon is retired after research on our buyers (`docs/research/mascot-or-not.md`). Personality now comes from the DITCHED stamp, the total reveal, real logos and a dry, kind voice.
- ✅ **Rewards rule:** no streaks, badges or points; only real money kept (DECISIONS #13).
- ✅ Research: premium-white motion (`docs/research/premium-white-motion.md`), Tim Gabe videos (`docs/research/tim-gabe-notes.md`), states and failures (`docs/research/premium-states.md`).
- ✅ **Total reveal prototype** built in code: `design/premium-white/proto/total-reveal.mp4`.
- ⚠️ The onboarding in the app (v4) still uses the old Kiwi look and raccoon. It gets rebuilt next.
- ⚠️ Purchases are stubbed (RevenueCat in M2). Home, Subs and Ditched are placeholders. Nothing is saved to SQLite yet.
- 🗄️ Retired: raccoon poses and Seedance loops in `design/premium-white/anim/` (kept for reference, not used).

## Next
1. Owner approves mockups of the **DITCHED stamp moment** and the **real-logo Welcome**.
2. Rebuild all 8 onboarding screens in premium white (token sheet in `docs/design/AUDIT-premium-white.md`, motion in `premium-white-motion.md`), with every state from `premium-states.md`.
3. Home / Subs / Ditched, then SQLite, local reminders, and running on the owner's iPhone (Expo Go).

## How to run the app
Not yet: the app gets created at the start of M1. The plan:
1. Install **Expo Go** from the App Store on your iPhone.
2. Claude starts the dev server.
3. You scan the QR code with the iPhone Camera.

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
