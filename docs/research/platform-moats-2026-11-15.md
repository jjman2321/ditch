# Platform moats: what Apple's new tools can (and can't) do for Ditch

Written Nov 15, 2026. Builds on `moat-and-pro-features.md` (Nov 10) and `autosync.md` (Nov 9). It doesn't repeat them. It checks what changed with iOS 26 and iOS 27, and whether any of it gives Ditch a hard-to-copy edge **with no server**.

How to read it:
- Every claim has a source. **(Unverified)** means only one secondary source, or sources disagree.
- "Moat" means a solo rival can't copy it in about 6 months.
- Nothing here changes a locked decision. Picks need the owner's OK.

## Summary (15 lines)
1. **Honest headline:** none of these Apple tools is a moat by itself. They're free to every developer, and Outflow, Recur and SubTrack already use some of them. The edge is what we feed them: our price and alias data, our test screenshots, our cancel guides.
2. **Foundation Models is free, offline and private,** but only on Apple Intelligence iPhones (iPhone 15 Pro and newer). An analyst estimate puts that at about a third of active iPhones. On-device context is only about 4,000 tokens.
3. **iOS 27 added image input and Vision OCR tools** to Foundation Models. So "read this App Store screenshot and fill in the form" is now one native call. It needs iOS 27.
4. **Skip Private Cloud Compute for user data.** It's free for small developers, but it sends the screenshot to Apple's servers. Then "read on your phone" would be false.
5. **React Native bridges exist and are fresh:** `@react-native-ai/apple` 0.13.0 (Nov 11, 2026) and `expo-foundation-models` 1.0.2 (Sep 17, 2026). Expo's own `expo-ai` is alpha and not in SDK 58.
6. **Visual Intelligence works on screenshots.** Our app gets the image and can return results. But Apple's flow is "search", not "add". An "Add to Ditch" result is a workaround. App Review fit is unknown.
7. **FinanceKit hasn't changed since iOS 26 background delivery.** Still US Apple Card, Apple Cash, Savings, and 13 UK banks. Entitlement timing isn't published.
8. **Biggest threat:** iOS 27 Apple Card now has a "Recurring" calendar **and** "Upcoming Transactions" alerts before predicted charges. That's our core promise, for US Apple Card users only.
9. Apple still doesn't cover other cards in the US, App Store subs bundled as "Apple", trials, cancel help, or price-rise warnings before they hit.
10. **Wallet Insights** (spending and recurring across banks) shipped in some countries, not the US. Which countries is unclear.
11. **Expo tooling is ready:** `expo-share-intent` 9.0.0 (SDK 58), `expo-widgets` 58.0.28, `expo-app-intents` 0.5.17 (alpha, intents written in Swift), `expo-notifications` supports time-sensitive.
12. **Cancel law, Nov 2026:** the US FTC click-to-cancel rule is dead (vacated July 8, 2025). The FTC restarted rulemaking in March 2026, with no new rule yet. ROSCA still applies.
13. **States and countries are where the rights are:** California (since July 1, 2025), New York State (Nov 2025) and New York City (Oct 1, 2026), the EU withdrawal button (June 19, 2026), Germany, France. **UK rules start January 2027.**
14. **Best new moat idea:** a "Your rights" box in each cancel guide, by country and state, built into the public price file. It's on-device, sourced, slow to copy well, and good for SEO.
15. **Only you can do this:** confirm the FinanceKit request is in; decide whether import stays Pro; book the 1-hour lawyer check and add "rights box wording" to it.

---

## 1. Apple Foundation Models (on-device LLM)

### 1.1 Facts
| Question | Answer | Source |
|---|---|---|
| What it is | A Swift API to Apple's on-device model. Also, since iOS 27, any model through a `LanguageModel` protocol, plus Apple's server model on Private Cloud Compute (PCC) | [Apple: Foundation Models](https://developer.apple.com/documentation/foundationmodels) |
| Devices | "To use Apple Foundation Models, people need a device that supports Apple Intelligence." iPhones: iPhone 15 Pro and Pro Max, iPhone 16 and later, iPhone Air, and a model the page calls "iPhone Duo" (page dated Nov 5, 2026) | [Apple Support 121115](https://support.apple.com/en-us/121115) |
| Share of iPhones | About a third of active iPhones, by analyst estimates. **(Unverified: Apple doesn't publish this.)** | [AppsOps](https://appsops.store/news/apple-intelligence-device-gap-ios26-app-strategy), [Wccftech (CLSA)](https://wccftech.com/the-case-for-apple-iphones-upcoming-super-upgrade-cycle-based-on-just-2-simple-facts/) |
| Languages | English, Danish, Dutch, French, German, Italian, Norwegian, Portuguese, Spanish, Swedish, Turkish, Vietnamese, Chinese (Simplified and Traditional), Japanese, Korean. Check in code with `supportsLocale()`. Unsupported language throws `unsupportedLanguageOrLocale` | [Apple Support 121115](https://support.apple.com/en-us/121115), [Apple: languages](https://developer.apple.com/documentation/foundationmodels/supporting-languages-and-locales-with-foundation-models) |
| Regions | EU: full features on iOS 27. Mainland China: not available | [Apple Support 121115](https://support.apple.com/en-us/121115) |
| Context size | On-device: **4K** tokens (Apple's table). Input and output share it. PCC: 32K. `contextSize` and `tokenCount(for:)` from iOS 26.4. **(One blog says 8,192; Apple's own doc says 4K.)** | [Apple: PCC guide](https://developer.apple.com/documentation/foundationmodels/adding-server-side-intelligence-with-private-cloud-compute), [Apple: updates](https://developer.apple.com/documentation/updates/foundationmodels), [dev.to](https://dev.to/hariharanjagan/whats-new-in-apples-foundation-models-framework-at-wwdc-2026-5227) |
| Structured output | `@Generable` types: "the framework provides strong guarantees that the model generates instances of your type" | [Apple: Foundation Models](https://developer.apple.com/documentation/foundationmodels) |
| Images | **New in iOS 27 (June 2026):** images in prompts, plus Vision's `OCRTool` and `BarcodeReaderTool` the model can call. "Summarizing the content within a photo of a document" is an Apple example | [Apple: updates](https://developer.apple.com/documentation/updates/foundationmodels), [Apple: multimodal](https://developer.apple.com/documentation/foundationmodels/analyzing-images-with-multimodal-prompting) |
| Model changes | The model changes with OS updates (iOS 26.4, iOS 27). Apple says retest prompts each time | [Apple: updates](https://developer.apple.com/documentation/updates/foundationmodels) |
| Cost, on-device | No per-request cost. Usage limit: "Unlimited" | [Apple: PCC guide](https://developer.apple.com/documentation/foundationmodels/adding-server-side-intelligence-with-private-cloud-compute) |
| Cost, PCC | Free for developers in the Small Business Program with fewer than 2 million first-time downloads. Needs a managed entitlement. Each user gets a **daily limit**, and Apple can show an iCloud+ upsell. "Expanded access … will be available for a fee in the future." iOS 27+ only | [Apple: PCC](https://developer.apple.com/private-cloud-compute/), [Apple: PCC guide](https://developer.apple.com/documentation/foundationmodels/adding-server-side-intelligence-with-private-cloud-compute) |

### 1.2 Does App Review allow it for us?
- **Apple's acceptable use rules** don't ban reading receipts or statements. The closest rule bans "inaccurate or dangerous outputs, or makes decisions without human supervision that have a material impact … in high-risk domains, including … finance" ([Apple AUP](https://developer.apple.com/apple-intelligence/acceptable-use-requirements-for-the-foundation-models-framework/)). Our "check and confirm" list keeps a human in charge. Keep it.
- **Guideline 5.1.2(i)** asks for consent before sharing personal data "with third-party AI" ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)). On-device Foundation Models isn't third-party sharing. **(My reading, not Apple's words. A blog says the same: [stora.sh](https://stora.sh/blog/2026-05-06-apple-ai-consent-rule-5-1-2-i-implementation-guide).)**
- **Apple's design guidance** says to tell people where AI is used and that it can make mistakes ([HIG: generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)). Copy: "Read by Apple Intelligence on your phone. Check before adding."
- **PCC and privacy:** PCC sends the prompt to Apple's servers. Apple says it's private, but the page doesn't say what is kept ([Apple: PCC](https://developer.apple.com/private-cloud-compute/)). **Uncertain** whether it changes our privacy label. It does break the line "we read it on your phone". **Pick: on-device only.**

### 1.3 React Native and Expo bridges (npm, checked Nov 15, 2026)
| Package | Version | Last publish | Notes |
|---|---|---|---|
| `@react-native-ai/apple` (Callstack) | 0.13.0 | Nov 11, 2026 | Vercel AI SDK provider. Structured output. iOS 27: image prompts, PCC, Vision OCR tools. Needs New Architecture. Most active. ([npm](https://www.npmjs.com/package/@react-native-ai/apple), [Callstack](https://callstack.com/blog/on-device-apple-llm-support-comes-to-react-native)) |
| `expo-foundation-models` | 1.0.2 | Sep 17, 2026 | Expo module. JSON-schema output, token count (26.4), images and PCC (27), `getFeatures()` check ([npm](https://www.npmjs.com/package/expo-foundation-models)) |
| `expo-ai` (by Expo) | 0.2.0 | Nov 3, 2026 | **Alpha.** Docs are for the next SDK; there's no SDK 58 page (404). Schema helpers, up to 8 images, OCR tool on iOS 26+, image understanding needs iOS 27 ([Expo docs](https://docs.expo.dev/versions/unversioned/sdk/ai)) |
| `expo-ai-kit` | 0.19.0 | Nov 9, 2026 | Community. Wraps Foundation Models + Vision, structured JSON ([npm](https://www.npmjs.com/package/expo-ai-kit)) |
| `expo-apple-foundation-models` | 1.2.0 | Jan 27, 2026 | Ten months old. Not for us |
| `@drewalth/react-native-foundation-models` | 1.2.0 | Jan 13, 2026 | "Experimental" |
| `react-native-apple-llm` | 1.0.16 | Jan 17, 2026 | Bare RN |
| `react-native-apple-ai` | 0.1.0 | Sep 18, 2025 | Stale |

All need our EAS dev build. Apple staff say there's no official RN binding ([Apple forums](https://developer.apple.com/forums/thread/833676)). **Pick:** `@react-native-ai/apple` or `expo-foundation-models` behind our own small wrapper, so we can swap later. Or move to `expo-ai` once it's stable.

### 1.4 Our four use cases, judged
| Use case | How | Works on | Verdict |
|---|---|---|---|
| **App Store subscriptions screenshot** | Vision OCR (`expo-text-extractor`) for text → our rules match names to the catalog → Foundation Models only for messy lines, returning a `@Generable` `{name, price?, cycle?, renewsOn}` list. On iOS 27, pass the image directly | OCR: every iPhone. AI step: AI iPhones | **Yes (8/10).** The OCR + rules path must work alone, since two thirds of phones lack the AI |
| **Bank statement PDF** | `expo-pdf-text-extract` → our repeat-spotting rules (`autosync.md` B2) → AI only to clean merchant names in small chunks | Rules: all. AI: AI iPhones | **Yes, as a helper (6/10).** A 3-page statement won't fit in 4K tokens. Rules do the work; AI tidies names |
| **Receipt email shared to the app** | Share text or PDF → AI fills `{service, amount, currency, cycle, trialEnds?}` | AI iPhones; rules fallback | **Yes (7/10).** Short text fits easily. This is the best fit for the model |
| **Writing cancel-help steps** | — | — | **No (2/10).** A small model will invent menu paths. Wrong steps break trust and brush against Apple's "inaccurate outputs … finance" rule. Use our curated, dated guides. AI may only reword our own verified text, if at all |

### 1.5 Moat?
**Weak by itself (4/10).** Any rival gets the same model for free, and SubTrack, Outflow and Recur already advertise on-device reading (`autosync.md`). What's hard to copy: our 20+ real-screenshot test set in 5 languages, our alias table, and per-country catalog matching. Apple's new Evaluations framework can score our prompts against that set ([Apple: Foundation Models](https://developer.apple.com/documentation/foundationmodels)).

## 2. Visual Intelligence and App Intents

### 2.1 Facts
- When someone uses visual search on the camera **or a screenshot**, "the system forwards the information captured to an App Intents query you implement" ([Apple: Visual Intelligence](https://developer.apple.com/documentation/visualintelligence/integrating-your-app-with-visual-intelligence)).
- The app adopts `IntentValueQuery` and gets a `SemanticContentDescriptor`. It has generic English `labels` ("tower", never the brand name) and a `pixelBuffer` of the capture. The app returns `AppEntity` results. Tapping one runs an `OpenIntent` that opens the app ([same page](https://developer.apple.com/documentation/visualintelligence/integrating-your-app-with-visual-intelligence)).
- Only one such query per app. A "More results" button can use the `semanticContentSearch` schema ([same page](https://developer.apple.com/documentation/visualintelligence/integrating-your-app-with-visual-intelligence)).
- WWDC26 session 297 shows a screenshot used with "highlight to search". "On macOS and iPad, the primary entry point is screenshots." System-made actions (add to Calendar, Contacts, Health) are done by Apple, not by apps. **No app-defined "add" actions were shown** ([WWDC26 297](https://developer.apple.com/videos/play/wwdc2026/297/)).
- Apple Intelligence iPhones only ([MacRumors](https://www.macrumors.com/2025/06/09/ios-26-visual-intelligence-now-searches-on-screen-content/)).
- iOS 27 added a View Annotations API, so Siri can act on what's on screen inside your app ([Apple: What's new in iOS 27](https://developer.apple.com/ios/whats-new/)).

### 2.2 Can a screenshot add a subscription?
- **Yes, with a workaround.** In our query, OCR the `pixelBuffer` and match the catalog. Return entities like "Netflix · you track this · renews Dec 1" or "Add Netflix to Ditch". The `OpenIntent` opens a prefilled Add screen. **(Unverified: Apple designed this for search results. Whether review accepts "add" entities is unknown.)**
- **Simpler and certain:** from the screenshot screen, the user taps Share → Ditch (section 5.1).
- **Expo:** `expo-app-intents` (alpha) has a `--visual-intelligence` scaffold option. Intents must be written in Swift ([Expo docs](https://docs.expo.dev/versions/v58.0.0/sdk/app-intents/)).

### 2.3 Moat?
**Medium-low (5/10).** Few trackers do it, and it needs Swift. But it's discovery, not lock-in, and it only works on AI iPhones. Do it after share import works. Effort M–L.

## 3. FinanceKit (iOS 26 and 27)

### 3.1 What's new since our Nov 9 note
- **Accounts and countries: no change.** US (iOS 17.4+): Apple Card (not Family participants), Apple Cash (not Family children), Savings. UK (iOS 18.4+) through open banking: Barclays, Barclaycard, First Direct, Halifax, HSBC, Lloyds, M&S Bank, MBNA, Monzo, Nationwide, NatWest, RBS, Santander ([Apple FinanceKit](https://developer.apple.com/financekit/)).
- **Apple's FinanceKit change log lists nothing after June 2024** ([Apple: updates](https://developer.apple.com/documentation/updates/financekit)). Background delivery came with iOS 26 as a sample tied to WWDC25 ([Apple sample](https://developer.apple.com/documentation/financekit/implementing-a-background-delivery-extension)). I found no new FinanceKit API in iOS 27.
- **Wallet "connected cards" in the US are near dead:** Discover removed support in June 2026 ([getfinny](https://getfinny.app/blog/ios-27-wallet-money-features)). **(Single secondary source.)**
- **Eligibility:** Finance category, sold in the US or UK, offers "financial management tools" such as "spending trends" ([Apple FinanceKit](https://developer.apple.com/financekit/)). Organization account; Account Holder applies; granted per bundle ID ([Apple sample](https://developer.apple.com/documentation/financekit/implementing-a-background-delivery-extension)).
- **Timeline: not published.** Forum posts give no figure ([Apple forums](https://developer.apple.com/forums/thread/746770)). Other managed entitlements range from days to over a month ([Apple forums](https://developer.apple.com/forums/thread/812332)). **(Unverified for FinanceKit.)**

### 3.2 What a recurring-charge detector could do
- Each `Transaction` has `merchantName`, `originalTransactionDescription`, `transactionAmount`, `foreignCurrencyAmount`, `transactionDate`, `merchantCategoryCode` and `status`. **No "recurring" flag** ([Apple: Transaction](https://developer.apple.com/documentation/financekit/transaction)). So we run our own repeat rules (`autosync.md` B2).
- The background extension wakes when new data lands, even with Ditch closed. It shares an App Group with the app ([Apple sample](https://developer.apple.com/documentation/financekit/implementing-a-background-delivery-extension)). That gives local alerts like "New charge: Netflix $19.99 (you had $17.99). Update?"
- **What it can't do:** see other US banks; split "APPLE.COM/BILL" into apps; Apple's own docs say bundled Apple subscriptions may show as one "Apple" charge ([Apple Support 127699](https://support.apple.com/en-us/127699)).

### 3.3 Expo
- `expo-finance-kit` 0.2.23 (Jan 6, 2026) and `@kickstartcrew/expo-financekit` 0.2.4 (Oct 3, 2025): small and quiet (npm, checked today).
- `@bacons/apple-targets` 5.0.0 lists widget, share, app-intent and other targets, but **no FinanceKit background delivery type** (its README). So we'd hand-write one Swift extension. **(Unverified whether apple-targets can add it as a custom target.)**

### 3.4 Moat?
**Strongest of the Apple tools (7/10), smallest audience.** It's gated (entitlement, Finance category, trends view, native extension), so few indies will bother. But Apple now covers the US Apple Card case itself (section 4). Our real FinanceKit win is the **UK**, plus merging card data with the App Store screenshot and our cancel guides. Effort L.

## 4. iOS 27 Wallet: what Apple now shows (threat check)
| Feature | What it does | Where | Who | Source |
|---|---|---|---|---|
| **Apple Card → Recurring** | Upcoming view: a calendar with the expected total per day. All view: every recurring charge with frequency and next date. Details: expected amount, date, last charges. "Mark as Not Recurring". Price rises update after the new charge posts | Wallet → Apple Card → More (•••) → Recurring | US Apple Card only | [Apple Support 127699](https://support.apple.com/en-us/127699) |
| **Upcoming Transactions alerts** | Optional alert before a predicted recurring Apple Card charge posts | Apple Card → ••• → Notifications | US Apple Card | [9to5Mac](https://9to5mac.com/2026/09/15/apple-card-has-three-new-and-improved-features-in-ios-27/), [getfinny](https://getfinny.app/blog/apple-card-recurring-transactions-ios-27) **(not in Apple's own support page)** |
| **Wallet Insights** | Spending, recurring transactions and balances across linked accounts | Wallet | "Select territories", **not the US**. UK appears likely. **(Country list unverified.)** | [9to5Mac](https://9to5mac.com/2026/09/14/heres-everything-new-for-apple-wallet-in-ios-27/), [MacRumors](https://www.macrumors.com/guide/ios-27-wallet/) |
| Bill splitting | Scan a receipt in the Camera's Siri mode → split with Apple Cash | Camera → Wallet | Apple Cash (US) | [9to5Mac](https://9to5mac.com/2026/09/14/heres-everything-new-for-apple-wallet-in-ios-27/) |

**Apple's own limits** ([Apple Support 127699](https://support.apple.com/en-us/127699)): predictions are "estimates, not confirmed charges"; cancelled subs "may keep appearing … until an expected charge doesn't appear"; Apple One may show as one "Apple" charge; everyday spending can be mislabelled; amounts can't be edited.

**Threat: high for US Apple Card users, low elsewhere.** Apple has now copied "remind me before the charge" for its own card. It does **not** do: other cards; App Store subs split by app; free trials (no charge yet to predict); cancel help; price-rise warnings before the bill; reminders at days you choose. **Copy implication:** stop leading with "see your recurring charges". Lead with "before every charge, on every card, with help cancelling".

## 5. Smaller platform pieces

### 5.1 Share extension for receipts and emails
- `expo-share-intent` **9.0.0, Oct 21, 2026, peer `expo ^58`.** Shares "URL, text, images, videos and files". Text and URL are on by default; files and images need config. Needs a dev build ([npm](https://www.npmjs.com/package/expo-share-intent), [README](https://github.com/achorein/expo-share-intent)).
- **Moat: none (2/10). Value: high.** It's the doorway for screenshots, PDFs and receipt text. Effort S.

### 5.2 Siri, Shortcuts and Spotlight from Expo
- **`expo-app-intents` 0.5.17 (Nov 11, 2026), by Expo, alpha.** Siri, Shortcuts, App Shortcuts (max 10), entities and queries, Spotlight indexing, donations. "You cannot create App Intent types dynamically from JavaScript … Declare the `AppIntent` types you need in Swift." Not in Expo Go ([Expo docs](https://docs.expo.dev/versions/v58.0.0/sdk/app-intents/)).
- iOS 27: entity schemas feed the Spotlight semantic index, so Siri can find app content "with attribution back to your app" ([Apple: What's new in iOS 27](https://developer.apple.com/ios/whats-new/)).
- App Review 2.5.11: answer Siri requests "in the most direct way possible" with no marketing in between ([guidelines](https://developer.apple.com/app-store/review/guidelines/)). So no upsell inside "What renews this week?".
- Old `react-native-siri-shortcut` 3.2.4 (Dec 2023) is stale.
- **Moat: low (3/10).** Recur and Outflow have it. Effort M.

### 5.3 Widgets and Control Center
- **`expo-widgets` 58.0.28 (Nov 11, 2026).** Home and Lock Screen widgets written in JSX with `@expo/ui`. Interactive buttons on iOS 17+. Live Activities. Needs an App Group. Not in Expo Go. **The docs don't cover Control Center controls** ([Expo docs](https://docs.expo.dev/versions/v58.0.0/sdk/widgets/)).
- Controls are possible through `@bacons/apple-targets` 5.0.0 in Swift; its storage API has `reloadControls()` (README).
- iOS 27: widgets can be customised through App Intents ([Apple](https://developer.apple.com/ios/whats-new/)).
- **Moat: none (2/10). Retention value: medium.** Already planned for v1.1 (DECISIONS #27).

### 5.4 AlarmKit
- iOS 26+. An alarm "overrides both a device's focus and silent mode". Needs user permission and the `NSAlarmKitUsageDescription` Info.plist key. One-time `fixed(Date)` or weekly schedules ([Apple: AlarmKit](https://developer.apple.com/documentation/alarmkit), [Apple sample](https://developer.apple.com/documentation/alarmkit/scheduling-an-alarm-with-alarmkit), [Apple: Schedule](https://developer.apple.com/documentation/alarmkit/alarm/schedule-swift.enum)).
- **No special entitlement.** A forum thread found that `com.apple.developer.alarmkit` doesn't exist ([Apple forums](https://developer.apple.com/forums/thread/797950)).
- Expo: `expo-alarm-kit` 0.1.11 (Apr 15, 2026), small (npm).
- **(Unverified)** whether App Review accepts alarms for bills. Keep it opt-in, for trial endings only, max one per trial.
- **Moat: low (3/10).** Effort S–M. v2 experiment, as planned.

### 5.5 Time-sensitive notifications
- `expo-notifications` 58.1.9 supports `interruptionLevel: 'timeSensitive'`, which "breaks through system notification controls" ([Expo docs](https://docs.expo.dev/versions/v58.0.0/sdk/notifications/)).
- The entitlement `com.apple.developer.usernotifications.time-sensitive` is a normal capability, **no Apple approval** ([Pushwoosh](https://help.pushwoosh.com/hc/en-us/articles/27979836066717-How-do-I-configure-and-use-Time-Sensitive-notifications-for-my-iOS-app), [Apple forums](https://developer.apple.com/forums/thread/693464)). In Expo, add it under `ios.entitlements` in app config. **(Expo step unverified; test in the dev build.)** Developers report it can fail silently if the entitlement is missing ([Apple forums](https://developer.apple.com/forums/thread/703568)).
- Apple's notification guidance: "Avoid sending multiple notifications for the same thing, even if someone hasn't responded" ([HIG](https://developer.apple.com/design/human-interface-guidelines/notifications)). This is a caution for our "second nudge". Keep it to one, Pro opt-in, as decided.
- **Moat: none. Reliability: high.** Already in v1 (DECISIONS #27).

## 6. Cancellation law, Nov 2026 (for a "Your rights" box)
For showing users their rights, not legal advice. Re-check each date before shipping copy, and add it to the lawyer check.

### 6.1 United States, federal
- **The FTC click-to-cancel rule is gone.** The Eighth Circuit vacated it on July 8, 2025 ([FTC](https://www.ftc.gov/news-events/news/press-releases/2026/03/ftc-seeks-public-comment-response-advance-notice-proposed-rulemaking-regarding-negative-option)). The FTC restored the old rule on Feb 12, 2026 ([Federal Register](https://www.federalregister.gov/documents/2026/02/12/2026-02866/revision-of-the-negative-option-rule-withdrawal-of-the-cars-rule-removal-of-the-non-compete-rule-to)).
- **A new rulemaking started:** advance notice on March 11, 2026, published March 13, comments closed April 13 ([FTC](https://www.ftc.gov/news-events/news/press-releases/2026/03/ftc-seeks-public-comment-response-advance-notice-proposed-rulemaking-regarding-negative-option), [Federal Register](https://www.federalregister.gov/documents/2026/03/13/2026-04952/rule-concerning-the-use-of-prenotification-negative-option-plans)). **No proposed rule found as of today.**
- **Still law: ROSCA** (15 U.S.C. 8403). Online sellers must disclose terms, get "express informed consent", and provide "simple mechanisms for a consumer to stop recurring charges" ([Cornell LII](https://www.law.cornell.edu/uscode/text/15/8403)). The FTC keeps enforcing it ([Winston](https://www.winston.com/en/blogs-and-podcasts/direct-sellers-update-regulation-law-and-policy/no-more-click-to-cancelrule-but-ftcs-enforcement-actions-keep-coming)).
- **Safe user copy:** "US law says online subscriptions need a simple way to stop charges."

### 6.2 California (AB 2863, in force July 1, 2025)
- Online sign-up means you can cancel online, "at will, without unnecessary barriers or delays".
- Save offers are allowed only next to a visible "click to cancel" link or button.
- An **annual reminder** with the service, charges and how to cancel.
- Price changes: notice **7 to 30 days** before.
- Free trials that turn paid now count as automatic renewals.
- Sources: [Fenwick](https://fenwick.com/insights/publications/california-tightens-requirements-for-automatically-renewing-subscriptions), [Kilpatrick](https://ktslaw.com/en/insights/alert/2024/10/california-latest-automatic-renewal-law-amendments-take-effect-in-july-2025).

### 6.3 New York
- **State (GBL 527-a, amended in the budget signed May 9, 2025, effective November 2025):** trials over a month need a notice 3 to 21 days before the cancel deadline. Price rises need notice 5 to 30 days before. Cancelling must be as easy as signing up ([Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/ny-quietly-amends-automatic-renewal-law)). **(Exact November day unverified.)**
- **New York City rule:** adopted July 10, 2026, **in force Oct 1, 2026**. Cancel "just as easily — and through the same method they used to enroll" ([PoliticsNY](https://politicsny.com/2026/07/10/nycs-new-click-to-cancel-rule-takes-effect-this-fall-to-help-new-yorkers-get-out-of-a-bad-subscription/), [BCLP](https://www.bclplaw.com/en-US/events-insights-news/leaving-new-york-never-easy-but-now-a-little-easier-new-york-citys-click-to-cancel-rule-should-encourage-clients-to-revisit-their-sign-up-and-cancellation-flows.html)).
- Other states have their own auto-renewal laws ([Mondaq](https://www.mondaq.com/unitedstates/dodd-frank-consumer-protection-act/1743652/ftc-and-state-ags-continue-to-scrutinize-subscription-practices-amidst-a-possible-click-to-cancel-rule-revival)). Start with CA and NY only.

### 6.4 United Kingdom (DMCC Act 2024)
- **Starts January 2027.** Announced by the Prime Minister's office on Aug 9, 2026 ([GOV.UK](https://www.gov.uk/government/news/pm-starts-roll-out-of-everyday-fixes-on-the-cost-of-living-ending-rip-off-discounts-and-subscription-traps)). It was delayed twice before ([Lewis Silkin](https://www.lewissilkin.com/insights/2026/04/02/consumer-law-update-subscriptions-regime-delayed-again-to-spring-2027-102mops)).
- What people get: clearer info up front, "regular reminders before renewals", simpler cancelling, and a **14-day cooling-off** after a free trial ends or a long contract renews ([GOV.UK](https://www.gov.uk/government/news/pm-starts-roll-out-of-everyday-fixes-on-the-cost-of-living-ending-rip-off-discounts-and-subscription-traps)).
- "If customers can subscribe online, they must be able to cancel online too" ([Brodies](https://brodies.com/insights/commercial-contracts-and-outsourcing/the-dmcca-subscription-contracts-the-timeline-just-got-shorter/)).
- **Secondary legislation wasn't published** as of Sep 4, 2026 ([Brodies](https://brodies.com/insights/commercial-contracts-and-outsourcing/the-dmcca-subscription-contracts-the-timeline-just-got-shorter/)). The exact day and details may change.
- GOV.UK figures for marketing: **£1.6 billion a year** on unwanted subscriptions; **26% of UK adults** signed up by accident in a year ([GOV.UK](https://www.gov.uk/government/news/pm-starts-roll-out-of-everyday-fixes-on-the-cost-of-living-ending-rip-off-discounts-and-subscription-traps)).

### 6.5 European Union and member states
- **EU withdrawal button (Directive 2023/2673), from June 19, 2026:** online contracts need a clear "withdraw from contract here" function during the 14-day withdrawal period, with a confirm step and a receipt ([William Fry](https://www.williamfry.com/knowledge/world-consumer-rights-day-part-3-mandatory-withdrawal-button-coming-june-2026/)). It covers the first 14 days only, not cancelling later ([Taylor Wessing](https://www.taylorwessing.com/de/insights-and-events/insights/2026/02/withdrawal-button-as-compliance-risk-for-eu-and-non-eu-businesses)). Not every country has written it into law yet (Ireland hadn't, per William Fry).
- **Digital Fairness Act:** a proposal is expected around Q4 2026 and isn't law ([Arnold & Porter](https://www.arnoldporter.com/en/perspectives/advisories/2026/05/eu-withdrawal-button-uk-subscription-rules-and-data-protection-risks-for-us-online-sellers)). **(Timing unverified.)**
- **Germany:** a cancel button ("Verträge hier kündigen") is required for consumer contracts that can be signed online. If it's missing or wrong, consumers can cancel at any time with no notice period (§ 312k BGB) ([Verbraucherzentrale NRW](https://www.verbraucherzentrale.nrw/kuendigungsbutton), [IHK](https://www.ihk.de/osnabrueck/recht-und-fair-play/recht/internetrecht/kuendigungsbutton-5612382)).
- **France:** "résiliation en trois clics" since June 1, 2023: a permanently visible online cancel feature, with fines up to €75,000 ([Presse-citron](https://www.presse-citron.net/resiler-vos-abonnements-devient-beaucoup-plus-simple-le-1er-juin/), [Next](https://next.ink/brief-article/resilier-ses-contrats-en-ligne-en-trois-clics-fin-de-la-periode-de-grace/)). **(Decree number differs between sources; check Légifrance.)**

### 6.6 How Ditch could use this
- A short **"Your rights"** box on each cancel guide, picked by the user's country (and state for CA and NY). Example for the UK after January: "From Jan 2027, UK law says you can cancel online if you signed up online, and you get 14 days to cancel after a trial ends." Each box has a source link and a "checked on" date.
- It ships inside the public price file (`autosync.md`), so no server and no personal data.
- **Never claim** we enforce rights or cancel for the user (CLAUDE.md rule 5). Say "the law says", link the source, and suggest the official complaint route.
- **Moat: medium-high (7/10).** Accurate, dated, multi-country legal facts are slow to build and keep fresh. Rivals' blogs (getfinny, subtracker) already write about the law, but not inside each cancel flow. It feeds SEO (DECISIONS #18). It serves our anxious user: "you're allowed to leave". Effort M (content + lawyer check), then a monthly check by the price robot.

## 7. Ranked ideas
Score = moat × Expo feasibility × privacy fit, each out of 10, divided by 100.

| # | Idea | Moat | Feasible in Expo | Privacy | Score | Effort | Key source |
|---|---|---|---|---|---|---|---|
| 1 | **"Your rights" box in cancel guides** (US federal, CA, NY, UK, EU, DE, FR), shipped in the public price file | 7 | 9 | 10 | **6.3** | M | [GOV.UK Aug 9, 2026](https://www.gov.uk/government/news/pm-starts-roll-out-of-everyday-fixes-on-the-cost-of-living-ending-rip-off-discounts-and-subscription-traps) |
| 2 | **On-device "Find more" reader:** OCR + rules for everyone, Foundation Models `@Generable` on AI iPhones, image input on iOS 27. Never PCC | 5 | 8 | 10 | **4.0** | M | [Apple multimodal](https://developer.apple.com/documentation/foundationmodels/analyzing-images-with-multimodal-prompting) |
| 3 | **FinanceKit background "new charge / price went up"**, aimed at UK banks + US Apple Card/Cash | 7 | 5 | 10 | **3.5** | L | [Apple FinanceKit](https://developer.apple.com/financekit/) |
| 4 | **Share to Ditch** (screenshots, PDFs, receipt text) | 2 | 10 | 10 | **2.0** (but it enables #2) | S | [expo-share-intent](https://www.npmjs.com/package/expo-share-intent) |
| 5 | **Time-sensitive reminders** + proof they fired | 2 | 9 | 10 | **1.8** (reliability, not moat) | S | [Expo notifications](https://docs.expo.dev/versions/v58.0.0/sdk/notifications/) |
| 6 | **Visual Intelligence "Is this tracked? / Add to Ditch"** | 5 | 4 | 9 | **1.8** | M–L | [Apple Visual Intelligence](https://developer.apple.com/documentation/visualintelligence/integrating-your-app-with-visual-intelligence) |
| 7 | **Siri, Shortcuts and Spotlight** via `expo-app-intents` + interactive widget | 3 | 6 | 10 | **1.8** | M | [Expo app-intents](https://docs.expo.dev/versions/v58.0.0/sdk/app-intents/) |
| 8 | **AlarmKit opt-in for big trial endings** | 3 | 6 | 10 | **1.8** | S–M | [Apple AlarmKit](https://developer.apple.com/documentation/alarmkit/scheduling-an-alarm-with-alarmkit) |
| — | AI-written cancel steps | 1 | 7 | 10 | skip | — | [Apple AUP](https://developer.apple.com/apple-intelligence/acceptable-use-requirements-for-the-foundation-models-framework/) |
| — | Private Cloud Compute for user documents | 3 | 6 | 4 | skip | — | [Apple PCC](https://developer.apple.com/private-cloud-compute/) |

**How this serves the user and conversion:**
- #1 and #2 make the onboarding list bigger and truer, and cancelling feel allowed. That's the "That's $X a year" moment and the ditch moment, where trials and ratings are won.
- #3 is retention for Pro, and our only real "automatic" story.
- #5 protects ratings, our #1 moat (`moat-and-pro-features.md`).
- **Message change after iOS 27:** Apple now reminds US Apple Card users before their own card's charges. Ditch's line is "every card, every App Store sub, every trial, with help cancelling".

## Only you can do this
1. **FinanceKit:** confirm the entitlement request was sent (STATUS #3). If not: developer.apple.com/contact/request/financekit, signed in as Account Holder, Finance category, US + UK. Approval time isn't published, so send it now.
2. **Decide (no rush):** keep import Pro, or make the onboarding Apple-screenshot scan free (`autosync.md` Option 1)? The AI step only works on about a third of iPhones, so the free scan must work without it.
3. **Lawyer check:** add "Can we show 'Your rights' boxes with these sources?" to the 1-hour trademark consult in DECISIONS.
4. **At the dev build:** on your iPhone, check Settings → Apple Intelligence is on, then test the screenshot reader in English and Italian.

## Sources not linked above
- npm registry, checked Nov 15, 2026: `@react-native-ai/apple`, `expo-foundation-models`, `expo-ai`, `expo-ai-kit`, `expo-apple-foundation-models`, `@drewalth/react-native-foundation-models`, `react-native-apple-llm`, `react-native-apple-ai`, `expo-share-intent`, `expo-widgets`, `expo-app-intents`, `expo-notifications`, `expo-calendar`, `@bacons/apple-targets`, `expo-finance-kit`, `@kickstartcrew/expo-financekit`, `expo-alarm-kit`, `expo-text-extractor` (2.0.0, Feb 28, 2026), `expo-pdf-text-extract` (1.1.0, May 20, 2026), `react-native-siri-shortcut`. Published via `https://registry.npmjs.org/<name>`.
- [WWDC26 Apple Intelligence guide](https://developer.apple.com/wwdc26/guides/apple-intelligence/) (sessions 240, 241, 242, 297, 319, 343, 344, 345).
- [Sidley on the Jan 30, 2026 FTC filing](https://www.sidley.com/en/insights/newsupdates/2026/02/us-ftc-signals-renewed-interest-in-click-to-cancel-rulemaking); [Covington](https://www.cov.com/en/news-and-insights/insights/2026/03/ftc-launches-new-rulemaking-on-the-negative-option-rule).
- [9to5Mac Apple Card recurring](https://9to5mac.com/2026/09/25/apple-card-adds-new-feature-in-ios-27-that-every-card-should-have/); [MacRumors Insights beta 2](https://www.macrumors.com/2026/06/22/ios-27-beta-2-insights-wallet/).
