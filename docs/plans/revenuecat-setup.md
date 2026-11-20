# In-app purchases with RevenueCat: setup (owner only)

The app side is built (Nov 20). `src/services/purchases.ts` uses RevenueCat (`react-native-purchases`, DECISIONS #79). Apple takes the money. RevenueCat checks the receipt and tells the app whether Pro is on. It also handles renewals, the billing grace period, Ask to Buy and restores. The paywall is still our own.

Nothing can be sold until the steps below are done. Only you can do them: they need your Apple and RevenueCat logins, the bank details and the tax forms. Never paste a key or password into a chat. Each step says where it goes.

Plans and prices: DECISIONS #66 and #69. The IDs live in one place in the code: `src/config/products.ts`.

| Plan | App Store product ID | Type | Price (US) | Trial | RevenueCat package |
|---|---|---|---|---|---|
| Yearly | `app.ditchsubs.ditch.pro.yearly` | Auto-renewable subscription, 1 year | $59.99 | 7 days free | `$rc_annual` (Annual) |
| Weekly | `app.ditchsubs.ditch.pro.weekly` | Auto-renewable subscription, 1 week | $6.99 | none | `$rc_weekly` (Weekly) |
| Lifetime | `app.ditchsubs.ditch.pro.lifetime` | Non-consumable | $119.99 | none | `$rc_lifetime` (Lifetime) |

RevenueCat entitlement: **`pro`** (all three). RevenueCat offering: **`default`**.

Apple and RevenueCat rename buttons now and then. If one below looks a bit different, pick the closest match on the same page.

---

## Part A: App Store Connect

### A1. Agreements, tax and bank (do this first)
Without this, prices won't load, not even in the sandbox.
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **Business** (on some accounts: **Agreements, Tax, and Banking**).
2. **Paid Apps** agreement → **View and Agree to Terms**. Only the Account Holder can do this.
3. **Bank Accounts** → **Add**: the Grasp Labs LLC business account.
4. **Tax Forms** → the U.S. **W-9** for Grasp Labs LLC.
5. Wait until Paid Apps says **Active**. This can take a few hours to a day.

### A2. Subscription group "Ditch Pro" with Yearly and Weekly
1. **Apps** → **Ditch** → left sidebar, **Monetization** → **Subscriptions**.
2. **Subscription Groups** → **+** → Reference Name `Ditch Pro` → **Create**.
3. In the group, **+** next to Subscriptions → **Yearly**:
   - Reference Name `Ditch Pro Yearly`, Product ID `app.ditchsubs.ditch.pro.yearly` (copy it exactly; it can never be changed or reused). **Create**.
   - Subscription Duration **1 Year**.
   - **Subscription Prices** → **+** → United States **$59.99** → let Apple fill in the other countries → **Next** → **Confirm**.
   - **App Store Localization** → **+** → English (U.S.): Display Name `Ditch Pro Yearly`, Description `Reminders on every subscription, and more.`
   - **Review Information**: any iPhone screenshot of the paywall, plus the note `Opens from Settings → Ditch Pro, or after onboarding.` **Save**.
4. **+** again → **Weekly**: Reference Name `Ditch Pro Weekly`, Product ID `app.ditchsubs.ditch.pro.weekly`, Duration **1 Week**, United States **$6.99**. Same localization, screenshot and note. **Save**. Don't give Weekly any offer: the paywall says Weekly has no free trial.
5. In the group, drag **Yearly** above **Weekly** (Yearly is the higher level).
6. Group **App Store Localization** → **+** → English (U.S.): Display Name `Ditch Pro` → **Save**.

### A3. The 7-day free trial on Yearly
1. Open **Ditch Pro Yearly** → **Subscription Prices** → **View all Subscription Pricing** (or the **Introductory Offers** tab) → **Set Up Introductory Offer**.
2. Countries: **all**. Start: today. End: **No End Date**. Type: **Free**. Duration: **1 Week**. → **Next** → **Confirm**.

The app reads the trial from the store. "Free for 7 days" and "$0 due today" only show when this offer exists **and** RevenueCat says this Apple Account can still get it. Anyone who already had it sees "Subscribe for $59.99 a year" and "$59.99 today".

### A4. Lifetime (pay once)
1. **Monetization** → **In-App Purchases** → **+**.
2. Type **Non-Consumable**. Reference Name `Ditch Pro Lifetime`, Product ID `app.ditchsubs.ditch.pro.lifetime` → **Create**.
3. **Price Schedule** → United States **$119.99** → **Confirm**.
4. Localization: Display Name `Ditch Pro Lifetime`, Description `Pay once. No subscription.` Add the same screenshot and note. **Save**.
5. Leave **Family Sharing** off on all three products. Once it's on, it can't be turned off.

### A5. Sandbox tester (a fake buyer, no real money)
1. **Users and Access** → **Sandbox** → **Test Accounts** → **+**.
2. Use an email that isn't an Apple Account yet. Gmail's plus trick works: `yourname+ditchsandbox1@gmail.com`. Set a password and country **United States** → **Create**.
3. On the iPhone: **Settings** → **App Store** → bottom of the page → **Sandbox Account** → sign in with the tester. Your real Apple Account stays as it is.

### A6. In-App Purchase key (.p8): RevenueCat needs it to check purchases
1. **Users and Access** → **Integrations** → **In-App Purchase** → **+** (Generate In-App Purchase Key).
2. Name it `RevenueCat` → **Generate**.
3. **Download** the `.p8` file. Apple lets you download it **only once**, so keep it somewhere safe (not in the project folder, not in chat). Note the **Key ID** and the **Issuer ID** shown on that page.

### A7. App Store Connect API key: lets RevenueCat import your products
1. **Users and Access** → **Integrations** → **App Store Connect API** → **Team Keys** → **+**.
2. Name `RevenueCat`, Access **App Manager** → **Generate**.
3. **Download** the `.p8` (again, only once), and note its **Key ID** and the **Issuer ID** at the top of the page.

## Part B: RevenueCat

### B1. Project and app
1. Sign up at [app.revenuecat.com](https://app.revenuecat.com) with the Grasp Labs email.
2. **Create new project** → name `Ditch`.
3. **Apps & providers** (or **Project settings → Apps**) → **+ New** → **App Store**:
   - App name `Ditch`, Bundle ID `app.ditchsubs.ditch`.
   - **In-App Purchase Key**: upload the `.p8` from A6, and type its Key ID and the Issuer ID.
   - **App Store Connect API**: upload the `.p8` from A7 with its Key ID and Issuer ID. Vendor number: App Store Connect → **Payments and Financial Reports**, top left.
   - **Save**. Leave everything about attribution and ad networks off. Ditch doesn't use them.

### B2. Products
1. **Product catalog** → **Products** → **Import** (or **+ New** → **Import from App Store**).
2. Tick the three: `app.ditchsubs.ditch.pro.yearly`, `.weekly`, `.lifetime` → **Import**.

### B3. Entitlement "pro"
1. **Product catalog** → **Entitlements** → **+ New**. Identifier `pro` (lower case, exactly), description `Ditch Pro` → **Add**.
2. Open **pro** → **Attach** → tick all three products → **Attach**.

All three must be attached. A product that isn't attached charges the person, but Ditch won't switch Pro on.

### B4. Offering "default" with 3 packages
1. **Product catalog** → **Offerings**. If there's already one called `default`, open it. Otherwise **+ New** → Identifier `default`, Description `Main paywall` → **Add**.
2. Make it the **current** offering (the ⋯ menu → **Make current**, or the star).
3. In it, **+ New Package** three times:
   - Identifier **Annual** (`$rc_annual`) → attach `app.ditchsubs.ditch.pro.yearly`
   - Identifier **Weekly** (`$rc_weekly`) → attach `app.ditchsubs.ditch.pro.weekly`
   - Identifier **Lifetime** (`$rc_lifetime`) → attach `app.ditchsubs.ditch.pro.lifetime`

If any of the three is missing, the paywall falls back to the planned US prices.

### B5. The public SDK key, into EAS
1. RevenueCat → **Project settings** → **API keys** → the **App Store** public key (it starts with `appl_`). This key is public by design: it ships inside every app. Still, don't paste it into a chat.
2. In Terminal, in the `ditch` folder:
   ```
   eas env:create --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --environment preview --environment production --visibility plaintext
   ```
   Paste the key when it asks for the value. Or go to expo.dev → **ditch** → **Environment variables** → **Add variable**: name `EXPO_PUBLIC_REVENUECAT_IOS_KEY`, environments **Preview** and **Production**, visibility **Plain text**.
3. Without this key, the app keeps purchases off and says "Not switched on yet", even in a new build.

## Part C: A new build

RevenueCat's SDK is native code, so the TestFlight build on your phone now (build 5) can't buy. That's on purpose: it keeps saying "Not switched on yet" and never crashes, because the SDK is only loaded when the build has it. Make a new one:

```
eas build --profile testflight --platform ios
```

then submit it to TestFlight as usual. Expo Go and the web preview keep showing the planned US prices and never charge.

## Part D: Before the App Store review

- The first in-app purchases are reviewed **together with an app version**. On the version page, under **In-App Purchases and Subscriptions**, tick all three, then submit the version. Each product must say **Ready to Submit** first. If one says **Missing Metadata**, it's usually the screenshot or a localization.
- App Privacy (App Store Connect → Ditch → **App Privacy**): add **Purchases → Purchase History**, used for **App Functionality**, **not linked** to identity, **not used for tracking** (DECISIONS #79). RevenueCat only gets a random app user id, never a name, email or ad id.

## Sandbox tips
- Time runs fast: Weekly renews about every 3 minutes, Yearly about every hour, and the 7-day trial lasts a few minutes. After about 12 renewals it stops, which is a quick way to test "Pro ended".
- To see the trial again, make a new sandbox tester.
- RevenueCat → **Customers** shows each test purchase (look for the random id), handy if something looks wrong.

## Bank sync's server (done Nov 20)
The server asks RevenueCat's REST API v2 about the app user id (the same random id the app gives RevenueCat) on every bank call, on `entitlement-sync`, and in the hourly cleanup (`supabase/functions/_shared/revenuecat.ts`). Key: a V2 secret key with **Customer information: Read only**, saved in Supabase → Edge Functions → Secrets as `REVENUECAT_SECRET_KEY`. Product ids live in `deps.ts` (override with `REVENUECAT_PROJECT_ID` / `REVENUECAT_PRODUCTS`). If RevenueCat can't be reached, the last stored answer is used, so nobody loses their bank over a blip. Check it any time with the `rc-check` self-test step.

## What the app does with all this
- **Prices:** on launch it loads the `default` offering and shows Apple's own price text in the person's currency. If the store can't be reached, it shows the planned US prices, exactly like before.
- **Trial:** "Free for 7 days" and "$0 due today" only when RevenueCat says the person is eligible. "Unknown" counts as not eligible.
- **Buy:** Apple's sheet. Closing it does nothing. Ask to Buy says "Sent for approval", and Pro switches on once a parent approves.
- **Restore:** RevenueCat asks Apple what this Apple Account owns.
- **Every launch, every return to the app, and every update from RevenueCat:** if `pro` isn't active any more, Pro ends. Nothing is deleted or hidden, and reminders drop back to 3. During Apple's billing grace period, Pro stays on.
