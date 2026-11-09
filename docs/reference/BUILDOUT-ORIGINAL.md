> **Historical reference only.** This is the older, longer ChatGPT plan. `docs/DECISIONS.md` and `docs/SPEC.md` win wherever they disagree: no bank sync in v1, different prices ($4.99/mo · $29.99/yr · $49.99 lifetime), unlimited free tracking with reminders on 3, a raccoon mascot, and Home · Subs · Ditched tabs. Use this file for its money, date, reminder and paywall rules and its acceptance checks (§13, §17).

# Ditch: Subscription Tracker — Buildout

Updated: 9 November 2026  
Company: Grasp Labs LLC  
Domain: ditchsubs.app  
Social: @ditchsubs  
Platform: iOS first, Expo / React Native / TypeScript

## 1. How to use this document

This is the consolidated product and implementation handoff from our conversation. It combines the original brief, later accepted changes, research findings and the latest design concepts.

- **Agreed:** a direction the founder explicitly accepted or requested.
- **Proposed:** a recommendation or concept that has not been approved as a final decision.
- **Open:** a decision or dependency still needing resolution.

The latest conversation takes precedence over older drafts. Do not silently turn proposals into approved scope.

**Current state:** research, product planning and visual mockups exist. No working Expo application, live bank integration, purchase implementation or iOS Simulator demonstration has been delivered in this conversation. The design images are concepts, not running screens.

**Working preference:** interview the founder in focused, detailed rounds before decisions that materially change the product. Make routine implementation choices independently. Do not repeat questions already answered.

**Required checkpoint:** complete Milestone 1 and show the actual app running in Apple's iOS Simulator before moving to Milestone 2. A browser preview or generated image does not satisfy this requirement.

## 2. Product definition

Ditch helps people discover and track subscriptions, anticipate renewals and follow through on cancelling services they no longer want.

The two leading jobs are:

1. Avoid surprise charges.
2. Get unwanted subscriptions cancelled.

Monthly spending visibility supports those jobs. Ditch should remain a subscription tracker, rather than expanding into a full budgeting, investing or general spending app.

### Audience and launch

- People who lose track of recurring charges, trials and cancellation processes.
- United States and Canada first; European expansion later.
- Start with a small operation and expand if demand and economics support it.
- Planned acquisition: App Store search, Apple search advertising and organic search.
- Category revenue estimates support investigating the opportunity; they do not establish Ditch's product-market fit.

### Brand

- Product name: **Ditch: Subscription Tracker**.
- Positioning: **The honest subscription tracker.**
- Catchphrase: **Ditch it.** Use it where an action or celebration makes it meaningful.
- Tone: clear, capable and lightly cheeky. Never shame users about financial hardship.
- Explain what the app actually does at each step.

## 3. Decisions that supersede the original brief

| Topic | Original brief | Current direction | Status |
| --- | --- | --- | --- |
| Discovery | Mainly catalog/manual entry | Optional bank discovery as the main paid experience; screenshot/statement import as an alternative; catalog/manual fallback | Agreed |
| Bank access | No bank login | Optional bank connection | Agreed |
| Privacy promise | Everything stays on the phone | Local tracking works offline; bank services and external extraction require accurate server/data disclosures | Agreed |
| Pricing | $14.99/year and $29.99 lifetime | Test $6.99/month and $49.99/year, with an eligible 7-day annual trial | Accepted test direction; final economics open |
| Lifetime | Unlimited lifetime Pro | Do not offer lifetime access to unlimited ongoing bank syncing | Agreed |
| Weekly plan | None | Monthly and annual are the launch direction; no weekly plan | Agreed |
| Free access | Up to 5 subscriptions | Retain useful tracking for up to 5 active subscriptions, reminders and cancellation guidance | Agreed |
| Import timing | AI screenshot import in v1.1 | Basic screenshot/statement import belongs in launch scope; precise milestone placement remains open | Agreed direction |
| Service branding | Coloured initials | Recognizable real service logos; initials for unknown/custom services | Requested |
| Visual style | Large bold type and lime CTAs in first concepts | Lighter type, more useful detail, warm white, deep green buttons and restrained lime accents | Latest proposal |
| Mascot | Simple round green character | Four directions explored; A/Pebble used provisionally in the latest UI | Selection open |

Do not reuse the old claims “no bank connection,” “all data stays on your phone” or “data not collected” as universal claims for the bank-connected product.

## 4. Product differentiation

### Launch value

- Discover subscriptions without requiring users to enter every item manually.
- Review findings before they become tracked subscriptions.
- Show expected charges, dates and reminders clearly.
- Keep the free tracker usable.
- Provide service-specific cancellation links and short instructions.
- Show prices and renewal terms plainly, with an immediate free exit from the paywall.

### Longer-term moat hypothesis

The strongest proposed direction is **cancellation follow-through**:

1. Identify how a subscription is billed.
2. Provide the correct cancellation route.
3. Track whether a cancellation was started, reported complete or confirmed.
4. Where a connected account supports it, flag a subsequent matching charge for review.
5. Maintain merchant instructions and recover from failed attempts.

The defensibility would come from reliable merchant workflows, maintained information, detection quality and operational follow-through. A mascot, bank connection or AI extraction alone is not a durable moat.

This is a product hypothesis, not proof that competitors lack these capabilities. Human-assisted cancellation, its scope and operating model remain open. Do not promise that Ditch cancels on the user's behalf unless that service actually exists for the relevant merchant.

## 5. Pricing and feature access

All amounts below are proposed USD test prices. Real purchase screens must use the store's localized product details and actual eligibility.

| Offer | Proposed price | Access |
| --- | --- | --- |
| Free | $0 | Up to 5 active tracked subscriptions, core dashboard, reminders and cancellation guidance |
| Ditch Pro monthly | $6.99/month | Unlimited tracking and paid features, subject to connection/import limits still to be set |
| Ditch Pro yearly | $49.99/year | Annual Pro, with a 7-day trial for eligible users |

### Pro direction

- Automatic updates from connected bank accounts.
- Unlimited tracked subscriptions.
- Widgets.
- Optional roast mode.
- Screenshot/statement extraction, with allowance and free sampling still open.
- CSV export.
- Advanced category tools and insights.

**Category boundary is open:** category fields and basic totals are part of the core data model. Decide whether the basic category breakdown remains free and which category/insight tools belong to Pro before implementing entitlements.

### Honest paywall requirements

- Annual option preselected where the eligible trial is available.
- Close control visible and usable immediately.
- A clear “Continue with free tracking” action.
- Restore purchases.
- Monthly and annual billed amounts shown clearly.
- Explain trial start, reminder and first charge using real dates.
- Show renewal terms and how to manage/cancel Ditch's own purchase.
- No fake countdown, exit offer, hidden close control or free-trial toggle.
- If trial eligibility is absent, change both the purchase CTA and explanation.
- A reminder promise must match notification permission and actual scheduling.
- Closing the paywall preserves existing subscriptions and reminders.
- Adding a sixth active subscription triggers a friendly upgrade route once entitlements are implemented. Users can decline and keep using existing records.

### Operating economics to settle

Bank-provider pricing, institution coverage, connection limits, AI usage allowances, app-store costs, support effort and any assisted-cancellation labour must be understood before final prices are fixed.

## 6. Discovery and import

Manual entry must be a fallback, not the whole product story.

### A. Optional bank discovery

**Candidate implementation:** Plaid Link with Transactions; evaluate the Recurring Transactions product and production economics. Provider choice is not finally locked.

Proposed journey:

1. Explain what connecting provides and that it is optional.
2. Disclose price and establish a recoverable identity if needed.
3. Start the eligible trial/purchase at the agreed point in the flow.
4. Open the provider connection flow.
5. Fetch and identify possible recurring subscriptions.
6. Let the user review, correct, dismiss or merge findings.
7. Save only confirmed selections.

The exact identity/paywall/provider ordering remains a design decision. Explain that abandoning or failing bank setup does not itself cancel an already-started Ditch trial, and expose purchase management.

Required states:

- Connecting, waiting for data and ready for review.
- No matching recurring payments yet.
- Unsupported institution or account.
- User cancelled connection.
- Connection needs attention or reauthorization.
- Provider unavailable, offline or stale data.
- Disconnected account.

Do not treat transfers, rent, loan payments or every repeated transaction as a subscription. Keep dismissals and user corrections. Label estimated dates and possible subscriptions as such.

Use Sandbox first and label test data clearly. Production launch depends on real provider access, supported institutions and satisfactory detection behaviour.

### B. Screenshot or statement import

Sources include a user-selected image of Apple subscription settings or a bank statement. Define supported file formats and limits before implementation; PDF support is not automatically implied by a screenshot importer.

Proposed journey:

1. Choose a file explicitly.
2. Explain processing and obtain appropriate consent if content is sent to an external provider.
3. Extract name, amount, currency, cycle and renewal date where available.
4. Show uncertain or missing fields for correction.
5. Detect possible duplicates against existing records.
6. Let the user confirm selected records before saving.

Requirements:

- No automatic saving of unreviewed findings.
- Do not invent missing renewal dates or prices.
- Model/provider configuration comes from server environment variables.
- Record per-call cost and usage metadata, without logging raw statements, financial contents or credentials.
- Define retention, deletion, file-size limits, supported formats, retries and per-user allowances.
- Keep model keys out of the client bundle.
- An extraction failure must preserve the manual/catalog route.

### C. Catalog and manual entry

- Search a bundled catalog of approximately 150 services.
- Show recognizable service icons and names.
- Defaults help fill the form but are not treated as the user's actual price or plan.
- Confirm amount, currency, cycle and next charge before saving.
- Manual fields: name, amount, currency, cycle, next charge, category, trial details and optional note.
- Custom subscriptions remain first-class records even without a catalog match.

## 7. Proposed first-time flow

The original six-screen outline is a starting point. Branching discovery adds review, connection and error states; it should not become a mandatory long questionnaire.

| Step | Purpose | Behaviour |
| --- | --- | --- |
| Welcome | Explain the benefit | Show a labelled example, Get started and Restore |
| Optional priority | Personalize a meaningful next step | Avoid charges / cancel unused services / understand subscription spending; skip if it changes nothing |
| Discovery choice | Avoid a manual-only start | Bank, screenshot/statement, catalog or manual |
| Connection/import | Obtain the selected data | Clear permission, pricing and progress states |
| Review | Establish accurate records | Edit, dismiss, select and merge before saving |
| Reveal | Show value from confirmed data | Monthly/yearly totals, with currency and date uncertainty respected |
| Reminders | Explain the permission request | Example notification, timing controls, Enable and Maybe later |
| Paywall where relevant | Offer Pro honestly | Bank route may require earlier pricing; free routes remain usable |
| Dashboard | Begin recurring use | Upcoming charges and monthly/yearly cost |

Do not display fabricated scan findings before a connection/import has completed. Example data in onboarding must be labelled as an example.

## 8. Screen inventory and behaviour

### Navigation

Proposed tabs: **Home**, **Subscriptions**, **Settings**. Put **Active** and **Ditched** inside the subscription list. Detail and review screens use a back action rather than duplicating the tab bar.

### Home / Overview

- Monthly-equivalent subscription total and annualized total.
- “Next 7 days” amount and number of renewals.
- Upcoming charges with service marks, prices and expected dates.
- Compact calendar or date strip supporting the list.
- Later renewals, sorted by next charge.
- One category breakdown, without duplicating the same chart elsewhere on the screen.
- Last update / disconnected / offline state where relevant.
- Add control.

Make clear that an annualized monthly equivalent is different from cash due in a particular month. “Next 7 days” uses actual expected charge amounts, not monthly equivalents.

### Subscriptions

- Active and Ditched filters.
- Search and sort by next charge; category filtering as scoped.
- Row: service, cycle, amount, next date and trial/status indicator where useful.
- Empty state with discovery and manual entry routes.

### Add / Edit

- Name and optional catalog match.
- Actual price and currency.
- Weekly / monthly / quarterly / yearly cycle.
- Next charge date.
- Category, optional note and optional trial end.
- Billing route where cancellation depends on it.
- Clear validation and a deliberate save action.

### Subscription detail

- Service mark, name, status and category.
- Actual charge amount/cycle and annual equivalent.
- Next charge, with an estimated-date label where needed.
- Billing route: direct merchant, Apple or unknown.
- Reminder timing and edit controls.
- Cancellation link/guide and separate completion action.
- Optional note.

### Import review

- Editable findings with selected/deselected states.
- Clear possible-subscription and estimated-date labels.
- Missing amount/currency/date validation.
- Duplicate handling before save.
- Summary of selected records, separated by currency when necessary.
- Retry/cancel/empty/error states.

### Cancellation helper

- Apple-billed subscription: “Manage” opens `itms-apps://apps.apple.com/account/subscriptions`.
- Direct merchant: appropriate cancellation URL and short steps.
- Unknown route: help determine where the subscription is billed.
- Opening a guide or URL does not mark the subscription cancelled.
- A separate “I've cancelled this subscription” / “Ditch it” action records the user's confirmation.
- Move confirmed records to Ditched and stop future subscription reminders.
- Permit correction/reactivation if the user marked it incorrectly.

Use a separate cancellation workflow status if implementing request/confirmation tracking. A local record status must not imply that the merchant's contract was terminated automatically.

### Ditched and savings

- Show service, cancelled/ditched date and the former recurring amount.
- Celebrate with “Ditched!” and the monthly-equivalent reduction.
- Keep a running counter labelled **projected monthly savings** or equivalent precise wording.
- Do not describe future avoided charges as money already recovered.
- Snapshot the amount/currency used for the savings calculation.
- Prevent double-counting when records are edited, restored or ditched again.
- Keep different currencies separate unless a conversion policy is explicitly agreed.

### Settings

- Display currency and locale.
- Default reminder lead times and time of day.
- Notification permission state and route to system settings.
- Roast mode off/on; Gentle/Savage only when enabled.
- Appearance: system/light/dark.
- Language.
- Manage Ditch Pro and restore purchases.
- Connected accounts: status, reconnect and disconnect.
- CSV export as entitled.
- Delete all data with an explicit confirmation.
- Privacy, terms and support.
- iCloud backup is deferred; do not ship a toggle that does nothing.

## 9. Latest visual direction

**Status: proposed, not finally approved.** The founder rejected the first version as too bold, poorly worded and too simple, then requested a much stronger UI and multiple mascot variations.

Latest concept direction:

- Warm paper background: approximately `#F6F5F0`.
- White surfaces for useful groups, with fewer nested cards.
- Pine primary actions: approximately `#224332`.
- Charcoal body text: approximately `#232C27`.
- Restrained green accent: approximately `#B6E97A`.
- Mostly regular/medium native-style typography.
- Tabular money figures; reserve large type for important amounts.
- Clear spacing and subdued separators rather than heavy outlines everywhere.
- Recognizable service marks; official assets for implementation, with initials as fallback.
- A small clipped-corner/notch detail can echo the proposed Pebble mascot.

The hex values and type scales are concept guidance, not measured accessibility-approved tokens. Validate contrast, Dynamic Type, VoiceOver order and target sizes in the real UI.

### Latest concept boards

- [Core screens: Overview, subscription detail and Pro](https://chatgpt.com/library?file_id=libfile_a76256e5b4f08191b111c17a664d17b1&account_id=personal)
- [Onboarding: Welcome, discovery and reminders](https://chatgpt.com/library?file_id=libfile_655dbad5fe0c8191a985c5215e03e10a&account_id=personal)
- [Mascot directions and expressions](https://chatgpt.com/library?file_id=libfile_6b6618879b80819194afcb3d07aa5914&account_id=personal)

The latest pass covers six representative screens. It is not the full flow inventory, a validated design system or an implemented interface. Dates and amounts in these images are sample data. Generated service marks must be replaced with suitable source assets in code.

### Mascot options

| Direction | Character | Current assessment |
| --- | --- | --- |
| A: Pebble | Round green character with an upper-right notch | Assistant recommendation; used provisionally in UI |
| B: Stub | Rounded receipt character with a folded corner | Most direct connection to subscriptions/receipts |
| C: Bean | Curved, relaxed bean silhouette | Softer personality |
| D: Drop | Rounded droplet with a tapered flick | More energetic silhouette |

Each direction has welcoming, celebrating and cheeky/skeptical expressions. **The founder has not selected a final mascot.**

Allowed mascot locations remain:

1. Onboarding.
2. Optional roast mode.
3. Cancellation celebrations.
4. Widget expressions.

Keep the core dashboard and task controls serious and readable. The mascot must never block an action.

For the selected character, a later asset set should cover welcoming, cheeky, celebrating and the happy/worried/stuffed widget states. Respect Reduce Motion in celebrations. Roast mode must avoid jokes about hardship, debt or users' inability to afford essentials.

## 10. Copy direction

These are draft strings from the latest concepts, not final localization-ready approvals.

| Location | Draft copy |
| --- | --- |
| Welcome headline | Stay ahead of your next charge. |
| Welcome body | Track renewals, get reminders and find the steps to cancel. |
| Welcome CTA | Get started |
| Free reassurance | Free tracking for up to 5 subscriptions. |
| Optional connection | No bank connection required. |
| Discovery headline | Find what you're paying for |
| Bank description | Find recurring payments in your connected accounts. |
| Bank action | See connection options |
| Bank pricing note | See pricing before you connect. |
| Review | Review subscriptions |
| Uncertain finding | Possible subscription |
| Date estimate | Expected around {date} |
| Notification heading | A reminder before it renews. |
| Notification CTA | Enable reminders |
| Notification deferral | Maybe later |
| Pro headline | Less upkeep. More control. |
| Eligible trial CTA | Start 7-day free trial |
| Free paywall exit | Continue with free tracking |
| Merchant cancellation | Open cancellation page |
| Record completion | I've cancelled this subscription |
| Celebration | Ditched! {amount}/mo in projected savings. |

Write concrete task copy. Do not turn every screen into a slogan. Avoid claiming universal detection, guaranteed reminders regardless of permissions, automatic cancellation or verified savings without supporting behaviour.

## 11. Technical architecture

This section is an implementation proposal, not an inventory of code already built. Verify exact SDK/provider APIs against official documentation when implementation begins.

### Mobile

- Current stable Expo SDK at implementation time, with compatible versions pinned.
- React Native and TypeScript.
- Expo Router.
- `expo-sqlite` as the proposed local store; migrations from the beginning.
- `expo-notifications` for local reminders.
- Reanimated for restrained animation.
- Haptics for meaningful actions, respecting device/user settings.
- RevenueCat for purchase status and entitlements in the monetization milestone.
- Native development builds for native integrations; do not assume Expo Go can host every dependency.

### Local-first data

- The device keeps the confirmed subscription records needed for offline tracking.
- Core manual add/edit, dashboard, saved guides and scheduled local reminders work without an account or network.
- Bank refreshes, new external extraction and purchase/restore requests require their respective services.
- Show stale/disconnected state rather than hiding the existing dashboard.
- Define conflict resolution between user edits and newly imported/provider data. User corrections must not be silently overwritten.

### Backend for connected features

Suggested responsibilities:

- Recoverable identity for connected users.
- Provider session/token exchange.
- Server-side storage of bank access tokens and private credentials.
- Provider updates/webhooks and recurring-candidate processing.
- Minimal subscription-relevant data delivery to the app.
- External import/extraction requests, validation and cost accounting.
- Usage/connection allowances and server-side entitlement checks.
- Disconnection and remote deletion workflows.

Backend hosting, database and authentication provider remain open. Sign in with Apple is a recommended identity route for bank users, not yet an approved requirement for all users.

### Suggested module boundaries

| Area | Responsibility |
| --- | --- |
| Routes/screens | Presentation, navigation and screen states |
| Domain | Money normalization, recurrence, savings and candidate matching |
| Repositories | SQLite access and migrations |
| Catalog | Bundled services, assets and local cancellation content |
| Notifications | Permission, scheduling, cancellation and reconciliation |
| Discovery | Bank/import/manual adapters and review drafts |
| Purchases | RevenueCat adapter and entitlement decisions |
| Localization | Translation resources, dates and currency display |
| Widgets | Native extension and shared snapshot |
| Server | Bank tokens, extraction, webhooks, identity and deletion |

Keep domain logic independent of React components and provider SDKs so the money/date rules can be tested directly.

### Widget architecture

- Native WidgetKit extension via a verified Expo-compatible approach, such as an Apple-targets integration or config plugin.
- App Group for a minimal widget snapshot.
- Small and medium home widgets: monthly total and next two renewals, adjusted to available space.
- Lock-screen widget: next renewal.
- Pro entitlement and appropriate stale/empty states.
- User control over showing financial information on a visible lock screen.
- Widgets should not need direct access to private bank credentials.

Do not claim widget refresh behaviour is complete until tested in the native target.

## 12. Data model

Preserve the original public model as the starting point:

```ts
export type Cycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type Subscription = {
  id: string;
  name: string;
  catalogId?: string;
  price: number;
  currency: string;
  cycle: Cycle;
  nextChargeDate: string; // Date-only ISO: YYYY-MM-DD
  isTrial: boolean;
  trialEndDate?: string;
  category: string;
  cancelUrl?: string;
  note?: string;
  status: 'active' | 'ditched';
  ditchedAt?: string;
  createdAt: string;
};

export type CatalogItem = {
  id: string;
  name: string;
  color: string;
  defaultPrice?: number;
  currency?: string;
  cycle?: Cycle;
  cancelUrl?: string;
  cancelSteps?: string[];
  category: string;
  countries?: string[];
};
```

### Proposed extensions to agree before schema freeze

- Source: manual, catalog, bank or file import.
- Separate provider/source identifiers for deduplication; avoid exposing raw credentials.
- Renewal-date provenance: estimated or user/receipt confirmed.
- Billing route: merchant, Apple or unknown.
- Billing anchor day and month-end intent for recurrence.
- Updated timestamp and user overrides for synchronization.
- Per-subscription reminder preferences.
- Cancellation progress distinct from `active` / `ditched`.
- Savings snapshot at cancellation.
- Catalog asset key and localized guide references.
- A separate review-candidate model that does not become a Subscription until confirmed.

The API type above uses `price: number` because it came from the original brief. Before persistence is finalized, choose a precise decimal or currency-minor-unit representation and a rounding policy. Do not assume every currency has two decimal places.

## 13. Money, dates and notifications

### Money rules

| Billing cycle | Monthly equivalent |
| --- | --- |
| Weekly | Price × 52 ÷ 12 |
| Monthly | Price |
| Quarterly | Price ÷ 3 |
| Yearly | Price ÷ 12 |

- Annual equivalent is calculated from the unrounded normalized amount, not a rounded display value.
- Round for display according to the selected currency/locale.
- Never silently sum USD, CAD, EUR or other currencies together.
- Until a conversion policy is approved, group totals by currency.
- The settings currency can set new-entry defaults; it must not relabel existing amounts as another currency.
- Keep trial-ending charges distinguishable from current paid spending. The exact free-trial inclusion policy for headline totals is open.

### Renewal rules

- Weekly: advance by seven calendar days.
- Monthly/quarterly/yearly: advance by the appropriate calendar interval, retaining the billing anchor.
- Clamp a short month to its last valid day without permanently changing the intended anchor.
- Handle leap years, end-of-month billing and multiple missed cycles.
- Keep date-only renewal values separate from timestamped events.
- A charge due today is not rolled away before the selected policy says it has passed.
- Use a documented local time/timezone policy for reminder delivery, including travel and daylight-saving changes.

### Reminder requirements

- Defaults: three days and one day before the expected charge.
- Configurable lead times and reminder time; latest concept uses 9:00 AM.
- Separate handling for trial-end reminders.
- Request permission after a useful pre-prompt.
- On add/edit/ditch/delete, reconcile scheduled notifications and remove obsolete ones.
- Do not schedule notifications in the past or duplicate the same reminder.
- Plan future reminders using the recurrence rules rather than depending solely on a user opening the app after each charge.
- Reconcile a finite scheduling horizon at appropriate opportunities; verify native limits and background behaviour during implementation.
- Clearly handle denied permission and explain how to enable it later.
- Successful scheduling is not proof of delivery. Validate actual delivery on supported native test hardware.

## 14. Privacy, credentials and data deletion

- Local users should not need an account for the basic tracker.
- Bank-connected users need a recoverable identity and accurate disclosure of provider/backend processing.
- Do not log subscription contents into analytics.
- If crash reporting is used, scrub names, amounts, notes, documents, tokens and other sensitive contents.
- Keep provider secrets and bank access tokens server-side.
- Send only data needed for the selected feature.
- Define external document retention and deletion before enabling import.
- Deleting local data and deleting connected/server data are different operations; the product must explain and handle both.
- Disconnect provider access when requested and cancel monitoring jobs appropriately.
- Deleting Ditch data does not automatically cancel Ditch's App Store purchase or the user's merchant subscriptions; provide the relevant management routes.
- Do not submit the original “data not collected” nutrition-label assumption for the revised bank/AI product. Prepare disclosures from actual data flows before release.

### Environment template

Names only, with empty values. Final names depend on the selected backend/provider setup.

```dotenv
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=
AI_PROVIDER=
AI_MODEL_ID=
AI_API_KEY=
REVENUECAT_SECRET_API_KEY=
REVENUECAT_WEBHOOK_AUTHORIZATION=
DATABASE_URL=
APPLE_APP_GROUP_ID=
```

`EXPO_PUBLIC_*` values are visible in the client bundle. Only genuinely public configuration, including the appropriate RevenueCat public SDK key, belongs there. No private bank, AI or server credential may use that prefix. Never copy credentials from earlier chat messages into the document or repository.

## 15. Localization and catalog content

Original launch-language requirement remains English, German, French, Spanish and Brazilian Portuguese unless explicitly changed.

- Translation resources from the first implementation.
- Localize screen copy, validation, notifications, accessibility labels, widgets, paywall explanations and store metadata.
- Use locale-aware currency/date formatting and pluralization.
- Keep language, billing currency and country as separate concepts.
- Avoid concatenated sentence fragments that break translations.
- Country-aware service availability and cancellation content.
- Record guide source and last verification date.
- Verify current local requirements before publishing legal claims or country-specific guides, including the Germany/France routes requested in the original brief.
- Catalog prices are editable examples, not guaranteed current quotes.
- Preserve an offline catalog and saved cancellation instructions; external cancellation pages still require a connection.

## 16. Delivery milestones

### Milestone 0: Lock the first journey and design direction

Already produced: research summaries, several UI concept passes and four mascot directions.

Still needed:

- [ ] Choose or refine the mascot.
- [ ] Approve the visual direction and first journey copy.
- [ ] Resolve the first demo's discovery scope and operating budget.
- [ ] Choose connected-user identity approach.
- [ ] Confirm access to a Mac/Xcode environment for the simulator checkpoint.

### Milestone 1: Core tracker and discovery foundation

Local foundation:

- [ ] Expo Router + TypeScript project and native development-build configuration.
- [ ] Translation resources, theme tokens and accessibility baseline.
- [ ] SQLite schema and migrations.
- [ ] Bundled catalog, search and manual entry.
- [ ] Add/edit and input validation.
- [ ] Monthly/yearly totals, upcoming renewals and category data.
- [ ] Billing recurrence and reminder scheduling.
- [ ] Offline operation and explicit empty/error states.

Discovery increment:

- [ ] Discovery route with bank, file, catalog and manual choices.
- [ ] Candidate-review model and UI.
- [ ] Confirmation-before-save and deduplication.
- [ ] Bank Sandbox integration when provider setup is available.
- [ ] Extraction integration when the import scope/provider is agreed.
- [ ] Loading, no-findings, unsupported, disconnected and retry states.

Verification:

- [ ] Meaningful automated money/date tests.
- [ ] Candidate confirmation/deduplication tests.
- [ ] Actual iOS Simulator demonstration.
- [ ] Notification delivery checks, with a physical device where needed.

**Scope boundary:** the local core is the first concrete build target. The exact bank/import increment included before the first demo remains open; do not claim automatic discovery is complete using static fixtures. Do not proceed to Milestone 2 before the founder reviews the real Milestone 1 simulator screens.

### Milestone 2: Cancellation and Ditched

- [ ] Apple management route.
- [ ] Direct-merchant guides and links.
- [ ] User-confirmed completion and Ditched list.
- [ ] Projected monthly savings with snapshot and undo/reactivation behaviour.
- [ ] Mascot celebration and reduced-motion alternative.
- [ ] Candidate cancellation progress model if included.

Human-assisted cancellation and subsequent-charge monitoring require separate scope and operational decisions; do not silently include them as completed MVP functions.

### Milestone 3: Onboarding, purchases and settings

- [ ] Implement the approved onboarding branches and resume/skip behaviour.
- [ ] RevenueCat products, entitlement checks, restore and purchase states.
- [ ] Honest paywall and real eligible-trial timeline.
- [ ] Free-tier sixth-subscription gate without breaking existing records.
- [ ] Settings, currency/locale/reminder controls and appearance.
- [ ] CSV export with correct quoting and spreadsheet-safe text handling.
- [ ] Connected-account management and deletion.
- [ ] Production bank/import readiness and cost limits before public paid access.

### Milestone 4: Widgets

- [ ] App Group snapshot and WidgetKit target.
- [ ] Small/medium home widgets and lock-screen widget.
- [ ] Empty, stale and entitlement states.
- [ ] Appropriate mascot expressions and privacy controls.
- [ ] Native validation of updates and deep links.

### Milestone 5: Localization and launch preparation

- [ ] Complete and review the five requested locales.
- [ ] Country-aware catalog/guide content.
- [ ] Light/dark, Dynamic Type, VoiceOver and tap-target review.
- [ ] Localized App Store listing and screenshots.
- [ ] Privacy disclosures and clear purchase terms based on the shipped behaviour.
- [ ] EAS build, TestFlight testing and release checklist.

### Post-launch / v1.1 candidates

- Better extraction coverage and more file formats.
- Optional iCloud backup.
- Additional banks/countries and localized service guides.
- Full email integration, if justified.
- Supported assisted cancellation.
- Subsequent-charge alerts and improved confirmation workflows.
- Deeper insights without becoming a general budgeting app.

The original “AI screenshot import only in v1.1” schedule has been superseded by the launch-import direction. Advanced import improvements can still follow later.

## 17. Acceptance checks

| Check | Expected outcome |
| --- | --- |
| Add Netflix at USD 15.49 monthly | USD 15.49/month and USD 185.88/year |
| Add USD 99 yearly | USD 8.25/month and USD 99/year |
| Weekly / quarterly | Normalize with 52/12 and 1/3 respectively |
| Different currencies | Separate totals unless an explicit conversion policy exists |
| Future renewal with both defaults enabled | Reminders scheduled three days and one day before the charge at the chosen time |
| Past renewal | Roll to the next valid occurrence, including multiple missed periods |
| January 31 monthly anchor | Use February's valid end date and retain the anchor for March |
| Annual leap-day anchor | Follow a documented leap-year policy without accidental month drift |
| Edit or cancel a tracked item | Reconcile or remove obsolete reminders |
| Denied notifications | Tracker remains usable; permission state is clear |
| Review imported candidates | Nothing persists as a confirmed subscription until user confirmation |
| Repeat import | Duplicate candidates are identified rather than silently added |
| Provider unavailable | Existing dashboard stays usable; sync state is honest |
| Sixth active subscription on Free | Friendly upgrade prompt; existing five and reminders keep working |
| Close paywall | Return to a usable free path |
| Restore purchase | Reflect the verified entitlement; handle empty/error results |
| Open merchant cancellation page | Record remains active until completion is separately confirmed |
| Confirm Ditch it | Move to Ditched, stop reminders and add its monthly equivalent to projected savings once |
| Reactivate a ditched item | Remove it from active projected-savings totals and restore tracking correctly |
| Offline manual tracker | Add/edit/list/totals and saved content work without an account or network |
| Delete connected data | Confirmed scope is removed locally/remotely and monitoring access is disconnected as applicable |
| Native demonstration | Actual simulator screens are shown and reviewed before Milestone 2 |

Use targeted tests for business logic and integration boundaries. A mockup does not verify calculations, notification delivery, accessibility or purchase behaviour.

## 18. App Store and launch assets

Working English listing:

- Name: **Ditch: Subscription Tracker**.
- Subtitle: **Track, remind & cancel subs**.
- Keyword themes: subscription manager, cancel subscriptions, bill tracker, renewal reminder, free trial reminder, recurring payments.

Localize and validate field-length limits at implementation time. The keyword list above is a research pool, not a finished keyword-field payload.

Screenshot concepts from the original brief:

1. See every subscription in one place.
2. Get reminded before you pay.
3. Ditch what you don't use.
4. No weekly fees. Ever.
5. Widgets.

Show the chosen mascot in the first screenshot. Use actual shipped UI for final store assets. Keep cancellation claims aligned with guides/links or whatever supported assistance is genuinely implemented. Do not display mock capability as an existing feature.

## 19. Open decisions for the next interview

Ask these in small groups, not one long questionnaire:

1. Which mascot direction should become Ditch: A, B, C or D?
2. Does the latest warm-white/pine direction fit, and should upcoming charges remain the home-screen emphasis?
3. What monthly operating budget is available before revenue, excluding ads?
4. Is there an existing bank-provider account for Grasp Labs LLC, and what coverage/pricing is available?
5. Should bank users sign in with Apple while local users stay account-free?
6. What is included in the first simulator demonstration: local core, Sandbox discovery, file extraction, or an agreed sequence of those increments?
7. What are the free extraction allowance and paid connection/import limits?
8. What category breakdown is free versus Pro?
9. How should free trials contribute to the headline spending total?
10. Is assisted cancellation in launch scope, and who would operate it?
11. Which Mac/Xcode setup will run the required simulator checkpoint?

Do not reopen settled decisions such as whether discovery can be mainly manual, whether service logos are desired, or whether the founder wants to review UI before the full build.

## 20. Research and reference appendix

This appendix records earlier research. It is not a fresh pricing, legal or provider-capability audit as of 9 November.

### Category estimates

AppKittie estimates retrieved 6 November 2026:

| App | Estimated monthly iOS downloads | Estimated monthly revenue |
| --- | ---: | ---: |
| MonoBoost | 25,700 | $160,000 |
| Subpilot | 14,992 | $85,000 |
| Feenko | 13,120 | $80,000 |
| Bobby | 11,909 | $32,606 |

These are provider estimates, not audited MRR, profit, acquisition economics or private conversion metrics. Use them as category signals, not a Ditch revenue forecast.

Earlier captured screens inspected:

- [Feenko discovery](https://storage.appkittie.com/onboardings/com.app.fynk/21.jpg): bank/card, email, browsing and manual paths.
- [Feenko paywall](https://storage.appkittie.com/onboardings/com.app.fynk/12.jpg): $9.99/week selected; alternative three-day trial followed by $39.99/six months; close/restore visible.
- [Subpilot paywall](https://storage.appkittie.com/onboardings/io.zimran.subpilot/15.jpg): $24.99/month selected; alternative $9.99/week with a three-day trial.

A visible close control alone does not prove that a competitor offers a useful free tier. Not every captured onboarding step was inspected.

### UI references previously inspected

- [Rocket Money renewals](https://mobbin.com/screens/e47323a1-a857-4c5a-b7dc-4cea3fd9f3a8): calendar, merchant marks and renewal rows.
- [Greenlight onboarding](https://mobbin.com/screens/ca38f3b0-98e3-4d61-a746-5c7e2d0dbfa0): product-feature previews.
- [Orbit calendar](https://mobbin.com/screens/954dab6c-e3ed-4104-aae0-e5039bd5012f): service marks on dates.
- [Headspace onboarding](https://mobbin.com/flows/31b21791-dec6-448a-8253-648f5ebbba3e?tab=screens): character and goal-selection references.
- [Finch onboarding](https://mobbin.com/flows/80ef83ef-f872-4825-b18d-6b193d60a9aa?tab=screens): character moments and notification previews.
- [Monarch paywall](https://mobbin.com/screens/f4f97ca0-8e85-4609-8f21-c5c9902171d4): trial timeline and plan selection.
- [Copilot paywall](https://mobbin.com/screens/b6ba77c0-7d8f-423e-8453-9db2a97f8035): trial timeline, pricing and skip route.
- [Airwallex receipt edit](https://mobbin.com/screens/d7e0560a-014b-4312-b7e9-ce1511ba345b): editable extraction-field structure.

These references informed layout choices. Their presence is not evidence of conversion uplift or permission to copy an entire brand.

### Technical references to verify when implementing

- [Expo documentation](https://docs.expo.dev/)
- [Plaid React Native Link](https://plaid.com/docs/link/react-native/)
- [Plaid Transactions](https://plaid.com/docs/transactions/)
- [Plaid billing documentation](https://plaid.com/docs/account/billing/)
- [RevenueCat documentation](https://www.revenuecat.com/docs/)
- [Apple WidgetKit](https://developer.apple.com/documentation/widgetkit)

### Earlier decision record

[Ditch-product-decisions.md](https://chatgpt.com/library?file_id=libfile_af57d95085f88191b3154cdfc88ce333&account_id=personal)

## 21. Handoff prompt for the next development session

> Read Ditch-Buildout.md before acting. Ditch is an iOS subscription tracker for Grasp Labs LLC. We have agreed on optional bank discovery with screenshot/statement import as an alternative, a useful free tier and proposed $6.99/month or $49.99/year Pro pricing. The latest designs use warm white, pine actions and restrained green accents. Four mascot directions exist; Pebble was used provisionally and is not yet selected. No app or simulator build has been delivered. Continue the focused product interview only for unresolved decisions, inspect the project and available Mac/Xcode setup, and implement the agreed Milestone 1 scope. Keep bank and model credentials server-side, make the local tracker work offline, test money and recurrence logic, and show the actual app in the iOS Simulator before moving to Milestone 2. Do not treat generated images as working screens or assume open design, provider, account and pricing choices are approved.
