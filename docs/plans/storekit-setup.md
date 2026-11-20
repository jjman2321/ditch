# In-app purchases: App Store Connect setup (owner only)

The app side is built (Nov 20): `src/services/purchases.ts` talks to Apple's StoreKit 2 through `expo-iap`. It can't sell anything until these products exist in App Store Connect with **exactly** these IDs. Nobody but you can do this part: it needs your Apple Developer login, your bank details and your tax forms.

Plan and prices: DECISIONS #66 and #69. Product IDs live in one place in the code: `src/config/products.ts`.

| What | Product ID | Type | Price (US) | Trial |
|---|---|---|---|---|
| Yearly | `app.ditchsubs.ditch.pro.yearly` | Auto-renewable subscription, 1 year | $59.99 | 7 days free (intro offer) |
| Weekly | `app.ditchsubs.ditch.pro.weekly` | Auto-renewable subscription, 1 week | $6.99 | none |
| Lifetime | `app.ditchsubs.ditch.pro.lifetime` | Non-consumable | $119.99 | none |

Yearly and Weekly go in one subscription group called **Ditch Pro**, so someone can only have one of them at a time and Apple handles switching between them.

Apple moves its menus around now and then. If a button below has a slightly different name, look for the closest match on the same page.

---

## 1. Agreements, tax and bank (do this first)

Without this, products stay stuck and the sandbox can't load prices.

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) and sign in.
2. Click **Business** (on some accounts: **Agreements, Tax, and Banking**).
3. Find **Paid Apps** (the Paid Applications Agreement). Click **View and Agree to Terms** and accept. Only the Account Holder can do this.
4. Under **Bank Accounts**, click **Add**, and enter the Grasp Labs LLC business bank account (routing + account number).
5. Under **Tax Forms**, fill in the **U.S. Form W-9** for Grasp Labs LLC (EIN, address).
6. Wait until Paid Apps shows **Active**. It can take a few hours to a day.

## 2. The subscription group and the two subscriptions

1. App Store Connect → **Apps** → **Ditch**.
2. In the left sidebar, under **Monetization**, click **Subscriptions**.
3. Next to **Subscription Groups**, click **+** (or **Create**). Reference name: `Ditch Pro`. Click **Create**.
4. Inside the Ditch Pro group, click **+** next to **Subscriptions** to make the **Yearly** one:
   - Reference Name: `Ditch Pro Yearly`
   - Product ID: `app.ditchsubs.ditch.pro.yearly` (copy it exactly; it can never be changed or reused)
   - Click **Create**.
   - **Subscription Duration:** `1 Year`.
   - **Subscription Prices:** click **Add Subscription Price** (or **+**), pick **United States** and **$59.99**. Let Apple fill in the other countries (it picks matching local prices). Click **Next** → **Confirm**.
   - **Availability:** all countries (the default).
   - **App Store Localization:** click **+** → English (U.S.). Display Name: `Ditch Pro Yearly`. Description: `Reminders on every subscription, and more.` (keep it short; max 55 characters).
   - **Review Information:** a screenshot of the paywall (any iPhone screenshot of it is fine) and a note like `Opens from Settings → Ditch Pro, or after onboarding.`
   - Click **Save**.
5. Back in the group, click **+** again for **Weekly**:
   - Reference Name: `Ditch Pro Weekly`
   - Product ID: `app.ditchsubs.ditch.pro.weekly`
   - Duration: `1 Week`. Price: **United States $6.99**.
   - Localization: Display Name `Ditch Pro Weekly`, Description `Reminders on every subscription, and more.`
   - Same review screenshot and note. **Save**.
   - Don't add any offer to Weekly. The paywall says "no free trial" for Weekly, so it must not have one.
6. **Group order (Subscription Levels):** in the group, drag **Yearly** above **Weekly** (Yearly is the higher level). This decides which counts as an upgrade.
7. **Group localization:** in the group page, under **App Store Localization**, click **+** → English (U.S.). Subscription Group Display Name: `Ditch Pro`. App Name Display: `Use App Name`. **Save**.

## 3. The 7-day free trial on Yearly

1. Open **Ditch Pro Yearly** (Subscriptions → Ditch Pro → Yearly).
2. Scroll to **Subscription Prices** and click **View all Subscription Pricing** (or the **Introductory Offers** tab), then **Set Up Introductory Offer** (or **+** next to Introductory Offers).
3. Countries: **all countries**. Start date: today. End date: **No End Date**.
4. Type: **Free**. Duration: **1 Week**.
5. **Next** → **Confirm**.

The app reads the trial from the App Store, so the paywall only says "Free for 7 days" and "$0 due today" when this offer exists **and** Apple says this Apple Account hasn't had it yet. Anyone who already had it sees "Subscribe for $59.99 a year" and "$59.99 today".

## 4. Lifetime (pay once)

1. App Store Connect → Apps → Ditch → **Monetization** → **In-App Purchases** → **+** (or **Create**).
2. Type: **Non-Consumable**. Reference Name: `Ditch Pro Lifetime`. Product ID: `app.ditchsubs.ditch.pro.lifetime`. **Create**.
3. **Price Schedule** → **Add Pricing** → United States **$119.99** → let Apple fill the rest → **Confirm**.
4. **Availability:** all countries.
5. **App Store Localization** → English (U.S.): Display Name `Ditch Pro Lifetime`, Description `Pay once. No subscription.`
6. Review screenshot + the same note. **Save**.
7. Leave **Family Sharing** off for all three products (it can't be turned off again once on).

## 5. A Sandbox tester (fake buyer, no real money)

1. App Store Connect → **Users and Access** → **Sandbox** (in the top bar or sidebar) → **Test Accounts** → **+**.
2. Use an email that is **not** an Apple Account yet. Gmail's plus trick works: `yourname+ditchsandbox1@gmail.com`. Pick any password you'll remember, country **United States**. **Create**.
3. On your iPhone: **Settings** → **App Store** → scroll to the bottom → **Sandbox Account** → sign in with that tester. (If you don't see it, open a TestFlight or development build of Ditch once and try to buy; iOS asks for the sandbox login then.)
4. Your real Apple Account stays signed in everywhere else. Sandbox purchases are free.

Good to know about the sandbox:
- Time runs fast: a 1-week subscription renews about every 3 minutes, 1 year about every hour, the 7-day trial lasts a few minutes. It renews up to 12 times and then stops, which is a quick way to test "Pro ended".
- To test the trial again, make a new sandbox tester (or in **Settings → App Store → Sandbox Account → Manage**, use **Clear Purchase History** if it's offered).
- To test "already had the trial": buy Yearly once with a tester, let it run out, then open the paywall again. It should show "$59.99 today", not "$0 due today".

## 6. Ship them with the app

- The first in-app purchases must be reviewed **together with an app version**. On the version page (Ditch → the iOS version you're submitting), scroll to **In-App Purchases and Subscriptions**, click **+**/**Select**, tick all three, **Done**, then submit the version.
- Each product's status should read **Ready to Submit** before that. If one says **Missing Metadata**, open it: usually it's the review screenshot or a localization.
- Purchases work in TestFlight and sandbox before review. The products must at least exist and the Paid Apps agreement must be active.

## 7. A new build is needed

`expo-iap` is native code, so the TestFlight build on your phone right now can't buy. That's on purpose: it keeps showing "Not switched on yet" and never crashes (the library is only loaded when the build has it). Make a new build:

```
eas build --profile testflight --platform ios
```

then submit it to TestFlight as usual. Expo Go and the web preview keep showing the planned US prices and never charge.

## 8. Bank sync's server (later, only when bank sync goes live)

When `EXPO_PUBLIC_API_URL` is set, the app also sends Apple's signed proof of purchase to our server after every purchase, restore and launch (`syncEntitlements`), so the server knows who may keep a bank connected. Put the same IDs in the Supabase Edge Function secrets (see `docs/plans/bank-sync-build.md` §6 and §9 step 6):

- `APPLE_PRODUCT_YEARLY` = `app.ditchsubs.ditch.pro.yearly`
- `APPLE_PRODUCT_WEEKLY` = `app.ditchsubs.ditch.pro.weekly`
- `APPLE_PRODUCT_LIFETIME` = `app.ditchsubs.ditch.pro.lifetime`

Set them in the Supabase dashboard → your project → **Edge Functions** → **Secrets**. Never paste them (or any key) into a chat.

## What the app does with all this

- **Prices:** on launch it asks the App Store for the three products and shows Apple's own price text in the user's currency. If the store can't be reached, it shows the planned US prices, exactly like before.
- **Trial:** "Free for 7 days" and "$0 due today" only when Apple says the person can still get the trial.
- **Buy:** Apple's own sheet. Cancel does nothing. Ask to Buy says "Sent for approval" and switches Pro on once a parent approves.
- **Restore:** asks Apple to sync, then reads what this Apple Account owns.
- **Every launch and every time the app comes back:** it checks with Apple. If nothing is active any more, Pro ends: nothing is deleted or hidden, reminders drop back to the 3 picked (or the 3 biggest).
