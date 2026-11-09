# Ditch: product spec

Built from `docs/DECISIONS.md` (wins on any conflict) and the rules in `docs/reference/BUILDOUT-ORIGINAL.md` §13 and §17. Screen layouts here are **functional**. The visual design is decided in the design step and linked from here once approved.

Status: **draft v1, Nov 9, 2026.** Items marked **[open]** need the owner's call. Most of them come up in the design step.

---

## 1. What v1 is
- Manual tracking with a catalog of services, plus on-phone import (Milestone 3).
- Reminders that actually fire.
- Cancel help: links and short steps. We never cancel anything ourselves.
- A Ditched list that shows projected savings.
- An honest paywall.
- No bank link, no server, no account, no analytics. Costs $0/month to run.

## 2. Navigation
- Tabs: **Home · Subs · Ditched**.
- **Settings** sits behind a gear on Home.
- Detail, add/edit and paywall open as pushed screens or sheets, never as extra tabs.

## 3. Screens

### 3.1 Onboarding (first launch only, resumable)
| # | Screen | What it does | Milestone |
|---|---|---|---|
| 1 | **Welcome** | Real service logos, one-line promise, "Get started". Small print: "Free forever for tracking." | M1 |
| 2 | **Tick everything you pay for** | Catalog grid grouped by category, with logos and typical price ("about $15.49/mo"), plus search. Tap to tick. "Something else?" adds a custom one. Every ticked item is saved. | M1 |
| 3 | **"That's $X a year. Ditch it."** | Yearly total of what they ticked, one line per currency. Marked "about" while prices are catalog estimates. Quick list of the biggest ones. | M1 |
| 4 | **Reminders** | Example notification ("Netflix renews in 3 days · $15.49"), "Turn on reminders" (fires the iOS prompt) and "Maybe later". | M1 |
| 5 | **Paywall** (skippable) | See §6. If they ticked more than 3, the headline is "Get a heads-up before all N renewals." and the free button is "Continue free: reminders for 3", which opens the **3-pick sheet**. | M2 (M1 goes straight to the 3-pick sheet when more than 3 are ticked) |
| 6 | **Home** | | M1 |

**3-pick sheet:** the 3 biggest yearly charges are pre-selected. The user can swap them and confirm.

**[open] Charge dates for ticked services.** Reminders need a next-charge date, but asking for one per service in onboarding is slow. My lean: save without a date and show an "Add dates so we can remind you" card on Home. The 3 reminder picks get a quick day-of-month chooser right after the 3-pick sheet. To be settled in the design step.

### 3.2 Home
- Gear (Settings) and "+" (Add).
- **Total:** monthly equivalent and yearly, one line per currency. Trials are shown apart ("1 trial, then $9.99/mo").
- **Next 7 days:** real amounts due (not monthly equivalents) and how many charges.
- **Upcoming:** next charges sorted by date, with logo, name, amount, date and a bell if a reminder is on.
- **Nudge cards** when relevant: "Add dates", "Reminders are off — turn on in Settings", "Find more" (import, Pro, M3).
- Empty state: a few faded real logos plus "Add your first subscription".

### 3.3 Subs
- List of active subs: search, sort by next charge (default), price or name.
- **[open]** List/calendar toggle. The calendar is free, per DECISIONS.
- Row: logo, name, cycle, amount, next date, trial badge, bell.

**Subscription detail:**
- Logo, name, category, amount + cycle, yearly equivalent ("$185.88 a year").
- Next charge date, and "Trial ends Dec 3, then $X" for trials.
- Reminder: on/off, lead times (custom lead times are Pro), and "1 of 3 free reminders" on free.
- **How to cancel:**
  - Apple-billed: "Manage in Apple Subscriptions" (`itms-apps://apps.apple.com/account/subscriptions`).
  - Direct: the catalog's cancel URL plus short steps, with a "checked on" date.
  - Unknown: "Where is this billed?" helper.
- Note.
- **"Ditch it"** (primary), Edit, Delete.
- Opening a cancel link never marks anything cancelled. Only "Ditch it" does, and it asks "Did you cancel it?" first.

**Add / Edit:**
- Search the catalog or "Custom".
- Fields: name, amount, currency, cycle (weekly/monthly/quarterly/yearly), next charge date, free-trial toggle (the date becomes the trial end and first charge), category, billed through (Apple / direct / Google / unknown), note, reminder on/off.
- Catalog prices pre-fill but stay editable, and are marked as estimates until the user edits or confirms them.
- Save is explicit. Validation is inline.

### 3.4 Ditched (the savings trophy)
- Headline: "**$X/mo** in projected savings" plus the yearly figure, one per currency. The word "projected" is mandatory: we never say money was "saved" or "recovered".
- List: logo, name, ditched date, former price.
- Tap one to reactivate ("Oops, still paying"), which removes it from savings.
- **Ditch celebration:** the card tilts and slides off, a hand-drawn teal DITCHED stamp lands with a success haptic, and "$X a year back" counts up. With Reduce Motion: the stamp appears with a fade, no slide or count.
- Empty state: a faded DITCHED stamp plus "Nothing ditched yet. Your first one feels great."

### 3.5 Settings
- **Reminders:**
  - Time of day (default 9:00).
  - Default lead times (3 and 1 days; custom is Pro).
  - Permission status, with "Open iOS Settings" if denied.
  - "Send a test reminder" button.
- **Default currency** for new entries. It never relabels existing ones.
- **Appearance:** system / light / dark.
- **Ditch Pro:**
  - Status.
  - Manage subscription.
  - Restore purchases.
  - Lifetime note. (M2)
- **iCloud backup** (Pro, M4). Not shown until it works.
- **Delete all data**, with a typed or double confirmation. It explains that this doesn't cancel any subscriptions, including Ditch Pro.
- Privacy policy, terms, support email (support@ditchsubs.app), version.

## 4. Data model (SQLite)

Schema version lives in `PRAGMA user_version`. Migrations are numbered files that run in order inside a transaction.

### `subscriptions`
| column | type | notes |
|---|---|---|
| `id` | TEXT PK | UUID |
| `name` | TEXT NOT NULL | |
| `catalog_id` | TEXT NULL | links to bundled catalog |
| `kind` | TEXT NOT NULL DEFAULT 'user' | `'user'` or `'ditch_pro_trial'` (Ditch's own trial entry) |
| `amount_minor` | INTEGER NOT NULL | whole minor units, ≥ 0 |
| `currency` | TEXT NOT NULL | ISO 4217, e.g. `USD` |
| `amount_is_estimate` | INTEGER NOT NULL DEFAULT 0 | 1 while it's still the catalog's typical price |
| `cycle` | TEXT NOT NULL | `weekly` \| `monthly` \| `quarterly` \| `yearly` |
| `anchor_date` | TEXT NULL | `YYYY-MM-DD`, a known charge date. The anchor day/month comes from it. NULL means the date is unknown. |
| `is_trial` | INTEGER NOT NULL DEFAULT 0 | when 1, `anchor_date` is the trial end / first charge |
| `category` | TEXT NOT NULL | |
| `billing_route` | TEXT NOT NULL DEFAULT 'unknown' | `apple` \| `direct` \| `google` \| `unknown` |
| `note` | TEXT NULL | |
| `status` | TEXT NOT NULL DEFAULT 'active' | `active` \| `ditched` |
| `ditched_at` | TEXT NULL | ISO timestamp |
| `ditched_amount_minor` / `ditched_currency` / `ditched_cycle` | NULL | snapshot taken at ditch time, used for savings |
| `free_pick` | INTEGER NOT NULL DEFAULT 0 | one of the 3 free reminder slots |
| `reminders_muted` | INTEGER NOT NULL DEFAULT 0 | the user turned reminders off for this one |
| `reminder_offsets` | TEXT NULL | JSON array of days, e.g. `[7,3,1]` (Pro). NULL means use the default. |
| `source` | TEXT NOT NULL | `onboarding` \| `catalog` \| `manual` \| `import` |
| `created_at` / `updated_at` | TEXT NOT NULL | ISO timestamps |

**Next charge date is computed, not stored.** It's worked out from `anchor_date` + `cycle` + today (see §5.2). Editing "next charge" sets `anchor_date`.

### `settings` (key/value)
- `reminder_time` (`09:00`)
- `default_offsets` (`[3,1]`)
- `default_currency`
- `appearance`
- `onboarding_step`
- `onboarding_done`

### Catalog (bundled JSON, not in SQLite)
- Fields: `id`, `name`, `category`, `logo` (bundled asset key), `color`, `typical: { amount_minor, currency, cycle }`, `cancel: { url?, steps?, billedVia?, checkedOn, source }`, `countries`.
- Launch with about 100 US/Canada services.
- Logos are bundled in the app, never fetched at runtime (privacy).
- **[open]** Logo source and licensing. Showing logos to name a service is common practice, but keep a file of where each one came from.

## 5. Rules (each one has unit tests)

### 5.1 Money
- Monthly equivalent: weekly × 52 / 12 · monthly × 1 · quarterly ÷ 3 · yearly ÷ 12.
- Keep the exact fraction (minor units × numerator / denominator) and round **only when displaying**, half-up to the currency's real number of decimals (`Intl.NumberFormat`).
- Yearly comes from the unrounded value.
- Totals are grouped **by currency**. Different currencies are never added together.
- Trials are excluded from "what you pay now" and shown separately with their after-trial price.

| Check | Expected |
|---|---|
| Netflix USD 15.49 monthly | $15.49/mo, $185.88/yr |
| USD 99 yearly | $8.25/mo, $99.00/yr |
| USD 10 weekly | $43.33/mo (43.333…), $520.00/yr |
| USD 30 quarterly | $10.00/mo, $120.00/yr |
| USD 15.49 + CAD 20 | two separate totals, never one |
| JPY 980 monthly | ¥980/mo, ¥11,760/yr (0 decimals) |

### 5.2 Dates
- Dates are `YYYY-MM-DD` and are handled as calendar dates, never as UTC timestamps.
- Weekly: anchor + 7 days × n.
- Monthly / quarterly / yearly: anchor + n months (1, 3, 12), **clamped** to the month's last day, and the clamp never sticks.
- The next charge is the first occurrence on or after **today**, so a charge due today stays today.

| Check | Expected |
|---|---|
| Monthly, anchor Jan 31 | Feb 28 (Feb 29 in leap years), then Mar 31, then Apr 30, then May 31 |
| Yearly, anchor Feb 29 2024 | Feb 28 2025, Feb 28 2026, Feb 28 2027, Feb 29 2028 |
| Quarterly, anchor Nov 30 | Feb 28/29, May 30, Aug 30, Nov 30 |
| Anchor 5 months in the past, monthly | rolls through every missed month to the next future one |
| Anchor is today | next charge = today |
| Weekly, anchor 21 days ago | next = today (anchor + 21) |
| Weekly, anchor 22 days ago | next = anchor + 28 days (6 days from now) |

### 5.3 Reminders
- Default lead times are **3 days and 1 day** before the charge, at **09:00 local**.
- The time is wall-clock local: if the phone changes timezone, the next reconcile reschedules for 9:00 in the new zone.
- **Who gets reminders:**
  - Pro: every active sub that isn't muted.
  - Free: only the `free_pick = 1` subs, at most 3. Trial-end alerts count toward the 3.
  - The Ditch Pro trial entry never counts.
- **Reconcile:** cancel all of Ditch's pending notifications, then schedule the plan again. Runs:
  - after any add/edit/ditch/delete/reactivate,
  - after a settings change,
  - on app launch and on return to the foreground.

  Identifiers are deterministic (`sub:<id>:<date>:<offset>`) so duplicates can't happen.
- **Limit:** iOS keeps at most 64 pending notifications. Schedule the soonest first and stop at 60, keeping a little room. Look ahead far enough to cover each sub's next charge.
- Skip any reminder whose time has already passed. If the 3-day one has passed but the 1-day one hasn't, schedule only the 1-day one.
- Subs with no date can't get reminders. The UI says so.
- Copy: "Netflix renews in 3 days · $15.49". For a trial: "Your Hulu trial ends tomorrow. It'll charge $9.99."
- Denied permission: the app keeps working fully, and Settings and Home show a clear "Reminders are off" state.
- Delivery has to be checked on a real iPhone (`docs/MANUAL-TESTS.md`), not just in tests.

### 5.4 Savings
- Projected monthly savings = sum of the monthly equivalents of ditched subs' **snapshots**, per currency.
- It's computed from the rows, not kept as a running counter, so reactivate → re-ditch can't double count.
- Ditching stops that sub's reminders right away.

## 6. Paywall (M2)
- **Plans** (prices always come from StoreKit through RevenueCat, never hard-coded):
  - **Yearly $29.99, pre-selected, with a 7-day free trial.**
  - Monthly $4.99.
  - Lifetime $49.99.
- **Lifetime note:** "Everything in Pro, forever. Bank sync, if we add it, is a separate plan because it costs us money every month."
- **Trial timeline with real dates:** Today (Pro unlocked) → Day 5, "We'll remind you" → Day 7, "$29.99 charged unless you cancel".
- When the trial starts, Ditch adds a **"Ditch Pro trial"** entry to the user's own list with a reminder 2 days before the charge.
- **Must have:**
  - Close (×) visible from the first frame.
  - "Continue free" (or "Continue free: reminders for 3").
  - Restore purchases.
  - Terms and privacy links.
  - "Cancel anytime in Settings → Apple ID → Subscriptions".
- **Not trial-eligible:** the CTA becomes "Subscribe for $29.99/yr" and the timeline is hidden.
- **Never:** a weekly plan, countdown timers, fake strike-through prices, a trial toggle, or a hidden close button.
- "Save 50%" against monthly is true ($59.88 vs $29.99) and allowed, if we want it.
- **Pro unlocks:**
  - reminders on every sub, with custom lead times,
  - import,
  - widget,
  - iCloud backup.
- **Pro lapses:** nothing is deleted or hidden. Reminders drop to the 3 `free_pick` subs. If none are picked, the 3 biggest yearly ones are picked automatically and the user is told.

## 7. Free tier
- Free forever: unlimited subs, full list, real totals, calendar, cancel help, Ditched.
- Reminders on 3 subs the user picks. Changing the picks is free and unlimited.
- The App Store description and screenshots say "3 reminders free".

## 8. Copy and claims
- Short, casual, human. Show a few options with scores when there's a choice.
- Banned:
  - "We cancel for you"
  - "Automatically finds your subscriptions" (v1 doesn't)
  - "Nothing leaves your phone"
  - "All future features included"
  - "Saved $X" (it's always "projected")
- Allowed: "Your list stays on your phone." Subs are stored only in local SQLite. iCloud backup (M4) goes to the user's own iCloud.
- Cite stats with their year: "2022 C+R Research: people guessed $86/mo, the real figure was $219."

## 9. Privacy
- No account, no analytics, no crash reporter that sends contents.
- Network calls: StoreKit/RevenueCat (M2) and cancel links the user opens. Nothing else.
- App Store label target: **"Data Not Linked to You: Purchases"** (required by RevenueCat). Everything else: not collected.
- Privacy policy at ditchsubs.app/privacy, written from what the app actually does. Needed before M5.

## 10. Accessibility
- Tap targets ≥ 44pt.
- Full Dynamic Type up to AX sizes, with layouts that wrap rather than truncate money.
- VoiceOver label on every control. Money is read as words ("15 dollars 49").
- Dark mode. Contrast ≥ 4.5:1 for body text.
- Reduce Motion swaps animations for fades.

## 11. Milestones
| # | Scope | Test on iPhone with |
|---|---|---|
| **M0** | Repo docs ✔ · onboarding design · Home/Subs/Ditched/Settings mockups (light + dark) · DITCHED stamp design. **Owner approves before code.** | — |
| **M1** | Expo project, theme tokens, strings file, SQLite + migrations, money/date logic + tests, catalog (~100 services), onboarding (without paywall), Home / Subs / Ditched / Settings, add / edit / ditch / delete / reactivate, cancel links, local reminders + 3-pick | Expo Go |
| **M2** | RevenueCat, paywall, Ditch Pro trial entry, Pro gating, restore, lapse handling | EAS development build |
| **M3** | On-phone import: screenshot OCR, PDF/CSV statements, share sheet. Review before save, duplicate detection | dev build |
| **M4** | Widget (small, medium, lock screen; next charge, logo, days left) via App Group · iCloud backup | dev build |
| **M5** | App Store assets, listing, privacy label, privacy policy, TestFlight, submit | TestFlight |
| v1.1 | Roast mode | |
| After launch | ditchsubs.app/cancel/[service] guide pages from the same catalog data | |

Each milestone ends with the owner testing it on their iPhone using `docs/MANUAL-TESTS.md`.

## 12. Open questions (for the design step)
1. Dates for ticked services in onboarding (see 3.1).
2. Where the calendar lives: a Home strip, or a Subs list/calendar toggle?
3. Catalog prices for non-USD users: hide the typical price, or show it as "about"?
4. Languages: English only for v1? The old plan listed 5. Lean: English first, with all strings kept in one file so translating later is easy.
5. Logo source and licensing.
6. Do trials count in the onboarding "That's $X a year" total? Lean: yes, at the after-trial price, labelled "incl. 1 trial".
