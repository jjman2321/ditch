# Ditch: Subscription Tracker

iOS app by **Grasp Labs LLC** · ditchsubs.app · @ditchsubs · App Store subtitle: "Ditch it before it renews."

Ditch shows people everything they pay for, reminds them before each charge, and helps them cancel what they don't want. Tracking is free and unlimited. Ditch Pro adds reminders on everything, on-phone import, the widget and iCloud backup.

It's the owner's first app. The goal is to learn the whole Apple pipeline and still make real money.

## Read first
1. `docs/STATUS.md`: where we are and what's next. **Update it at the end of every session.**
2. `docs/DECISIONS.md`: locked decisions and research. **Source of truth.** Don't reopen a locked decision unless the owner brings it up.
3. `docs/SPEC.md`: screens, data model, money/date/reminder rules, paywall, free tier, milestones.
4. `docs/MANUAL-TESTS.md`: the iPhone click-through checklist for each feature.
5. `docs/reference/BUILDOUT-ORIGINAL.md`: older plan. Only for money/date/reminder/paywall rules and acceptance checks. DECISIONS.md wins wherever they disagree.

## How the owner likes to work
- **Whole-app principles (DECISIONS #67):** structure beats price, weekly with a trial, the first session is the whole game, short onboarding, do the job (get useless subs cancelled), the stake not the stat, one point of view then cut, test the paywall constantly. Apply them to every screen.
- **North star for every change:** does it serve our target user (iPhone, ~23–40, a bit guilty and anxious about money, wants control and reliability; see `docs/research/mascot-or-not.md`) and does it help conversion (onboarding completion, trial starts, trial→paid, retention)? If a change doesn't help either, cut it. Say how each change serves the user and conversions, and back it with research (Mobbin, AppKittie, RevenueCat/Adapty data, competitor reviews) where possible. Honesty rules (paywall, "never claim") still win over conversion.
- Med student with limited coding experience. Explain in plain language, no jargon.
- **After every change:** say what changed in plain words, then give a short click-through checklist to test it on the iPhone. Add or update the matching section in `docs/MANUAL-TESTS.md`.
- **Secrets:** never ask the owner to paste API keys or passwords into chat. Tell them exactly where to put them: EAS environment variables (`eas env:create` or expo.dev → project → Environment variables), App Store Connect, or claude.ai environment settings.
- **Copy:** short, casual, human. No AI-sounding phrases ("seamlessly", "effortlessly", "unlock your potential", em-dash chains). When there's a choice, show options side by side with an honest score out of 10 and a pick.
- Design before building. Big UI work gets mockups and the owner's approval first.
- Remind the owner about "only you can do this" tasks when they become needed, with exact steps (list in `docs/STATUS.md`).

## Stack
- Expo (current stable SDK, pinned at setup) + React Native + TypeScript (strict) + Expo Router.
- `expo-sqlite` with numbered migrations from day one.
- `expo-notifications`: local notifications only. No push, no server.
- Reanimated for restrained animation. `expo-haptics` for meaningful actions.
- Payments straight through Apple's StoreKit 2 (no RevenueCat; owner, Nov 16, DECISIONS #59): Pro yearly, lifetime, weekly (DECISIONS #66). Library picked at Milestone 2 (candidate: `expo-iap`). No third-party payment SDK, no server.
- WidgetKit through an App Group. Later.
- EAS Build / TestFlight.
- On-phone import later: `expo-text-extractor`, `expo-pdf-text-extract`, `expo-share-intent`. **These need an EAS development build, not Expo Go.**
- Tests: Jest (`jest-expo`) for domain logic. Lint: ESLint (Expo config). Typecheck: `tsc --noEmit`.
- **No backend, no bank link, no analytics that collect personal data, no crash reporter that sends subscription contents.**

### Privacy label
- Goal and plan: **"Data Not Collected"** (owner, Nov 16, DECISIONS #59: no RevenueCat, so no third party receives purchase data; 7 direct rivals show this label).
- Purchases go straight through Apple's StoreKit 2. Apple handles them; we run no server and send nothing about the user anywhere.
- The daily exchange-rate download (DECISIONS #32) is the same public file for everyone and sends nothing about the user, so it doesn't change the label.
- Re-check this before each App Store submission, and again if any SDK is added.

## Rules
### 1. Money
- Store amounts as **whole minor units** (integer cents; respect the currency's real decimals, e.g. JPY has 0). Never floats in storage.
- **Never add up different currencies.** Show one total per currency. The one exception is the clearly marked rough line "≈ £69 a month in all · Nov 10 rates" for mixed lists (DECISIONS #32); stored amounts and reminders are never converted.
- Monthly equivalent: weekly × 52 / 12, monthly × 1, quarterly ÷ 3, yearly ÷ 12.
- Do the math on exact values and round only for display. Yearly totals come from unrounded values.
- Unit tests for every acceptance check, e.g. Netflix $15.49/mo → $185.88/yr; $99/yr → $8.25/mo.

### 2. Dates
- Next-charge dates are **date-only** (`YYYY-MM-DD`), never timestamps.
- Keep a **billing anchor day** and clamp to month end without losing the anchor: Jan 31 → Feb 28/29 → Mar 31.
- Yearly Feb 29 anchor → Feb 28 in non-leap years, Feb 29 again in leap years.
- Past dates roll forward through every missed cycle. A charge due today stays "today" until the day ends.
- Tests required.

### 3. Reminders must actually fire
This is the #1 complaint about Bobby, so it's the product.
- Default: **3 days and 1 day before** the charge, at **9:00 local time**.
- Reschedule after every add/edit/ditch/delete, on app launch, and when the app returns to the foreground.
- Never schedule in the past. Never duplicate.
- iOS keeps at most **64** pending local notifications per app. Schedule the soonest ones first, inside that cap.
- Test the scheduling logic in Jest **and** delivery on a real iPhone.

### 4. Paywall: monetization first, legal only (owner, Nov 18, DECISIONS #66)
- The model and plans live in DECISIONS #66 and `design/model/model.png`: trial-gated bank scan, weekly + yearly + lifetime, exit offer, locked details, and more paywall moments later.
- Psychology is welcome: anchoring, per-week framing, decoys, badges, loss aversion, curiosity gaps, real time-limited offers.
- Never: fake timers or fake "was" prices, fake reviews or ratings, unclear price or renewal terms, trial toggles, hard-to-cancel flows. These break Apple 3.1.2 and FTC/state auto-renewal law and get the app pulled.
- Restore purchases is always visible. The price and the real charge date are shown next to the buy button.

### 5. Never claim
- "We cancel for you."
- Automatic detection we don't have.
- "Nothing leaves your phone." Still don't say it: the app downloads public price and rate files, and Apple handles purchases. Say "Your list stays on your phone" (true: subs live in local SQLite; iCloud backup goes to the user's own iCloud).

### 6. Free tier
- Unlimited tracking, free forever: full list, real totals, calendar.
- Reminders on **3** subscriptions the user picks. Trial-end alerts count toward the 3.
- Pro: reminders on everything with custom lead times, import, widget, iCloud backup.
- **Never delete or hide data when Pro lapses.** Reminders drop back to 3.

### 7. Lifetime
- $99.99 one-time (DECISIONS #66), shown on the main paywall. Covers **Pro** with one bank scan a year; always-on bank sync is not included.
- Never write "all future features included".

### 8. Ditch the duck, the Ditched moment and the voice
- **Look: Sunflower** (DECISIONS #14, `design/v9/`): sunflower yellow, ink, cream, Archivo display, the duck with a tangerine bill.
- **Ditch the duck** (owner decision, Nov 9) replaces the retired raccoon. He only appears where he has a job: welcome, the notification icon, watching your trial, celebrating a ditch, empty states. Never next to a moving price. Needs a professional redraw before launch.
- Ditch's personality comes from four things:
  - the **Ditched moment** (DECISIONS #58, matches the website): hold to ditch, the ring fills, the row's DITCHED tag lands with a firm haptic, the logo dims, the duck pops up, then "$X a year you won't pay" (never "saved" or "back"). No big stamp.
  - the **yearly total reveal** in onboarding
  - **real service logos** as the illustration
  - a **short, dry voice** in copy and notifications that's on the user's side and never shames them ("Netflix renews in 3 days. $17.99. Still watching?")
- The DITCHED mark can still be the app icon motif, the widget accent and the App Store screenshot device.
- Nothing moves near a price. Never on top of an action. With Reduce Motion: show the finished state, skip the motion.

### 9. Accessibility
- Tap targets ≥ 44pt. Dynamic Type. VoiceOver labels on every control. Dark mode. Tabular figures for money.

### 10. Git
- Never commit secrets. `.env*` files stay ignored; only `.env.example` (names only) is committed.
- Small commits with clear messages.
- Run lint, typecheck and tests before each commit.

## Testing on the owner's iPhone
- Expo Go while possible.
- An EAS development build once native modules arrive (StoreKit purchases, import, widget).
- The owner has a Mac but don't assume Xcode is installed. Prefer EAS cloud builds.
