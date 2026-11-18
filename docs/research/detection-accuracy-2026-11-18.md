# Is it still active? Detection accuracy for the bank scan (Nov 18, 2026)

Pairs with `docs/plans/plaid-v1.md` (DECISIONS #64), `finder-apps-2026-11-18.md`, `autosync.md`. Code read: `src/import/statement.ts`, `merchants.ts`, `match.ts`, `types.ts`, `toSubs.ts`, `src/app/find/review.tsx`. No app code changed.

## The short answer
1. **A bank never says "cancelled".** A cancel only shows up as a **missing next charge**. Between a charge and the next due date, nobody can know from bank data alone: not Plaid, not Rocket Money, not us. Netflix charged Nov 10 and cancelled Nov 12 looks exactly like Netflix charged Nov 10 and kept.
2. So "10/10" can't mean "always right on its own". It means: **never pre-tick a guess, always show the proof, ask one smart question when we can't know, and check again at the next due date.**
3. **Use Plaid for clean data, build the decision ourselves.** Plaid Transactions gives tidy merchant names, merchant IDs, logos, pending flags and up to 24 months. Ditch's own rules (one engine for bank, CSV and PDF) decide active / stopped / ask. Plaid Recurring is a paid add-on whose "stopped" rules are mostly undocumented. Try it free on the Trial as a benchmark, and don't buy it for launch.
4. The current `findRepeats` has one serious gap for the bank scan: **it never says "stopped".** `nextFromLastCharge` rolls a charge from 8 months ago forward to next month and calls it `renews`. The rules below fix that.

## 1. What Plaid gives us (official docs)
**Recurring streams** (`/transactions/recurring/get`, [API ref](https://plaid.com/docs/api/products/transactions/#transactionsrecurringget)):
- Returns `inflow_streams` and `outflow_streams`. Each stream has `stream_id`, `account_id`, `description`, `merchant_name`, `first_date` and `last_date` (posted dates), `predicted_next_date` ("only set if the next payment date can be predicted"), `frequency` (WEEKLY, BIWEEKLY, SEMI_MONTHLY, MONTHLY, ANNUALLY, UNKNOWN; no quarterly), `transaction_ids`, `average_amount`, `last_amount`, `is_active` ("whether the transaction stream is still live"), `status`, and `personal_finance_category`.
- `status`: **MATURE** = "at least 3 transactions… on a regular cadence (for Annual… after 2 instances)". **EARLY_DETECTION** = "when a recurring transaction first appears… before it fulfills the requirement of a mature stream". **TOMBSTONED** = "a stream that was previously in EARLY_DETECTION… when no further transactions were found at the next expected date". **UNKNOWN** = none of the above.
- **The gap:** TOMBSTONED applies only to early streams. For a MATURE stream, Plaid documents no grace period for when `is_active` turns false. `is_user_modified` is deprecated because "the ability to modify transactions streams has been discontinued", so user corrections can't go back to Plaid.
- Plaid's blog: streams are grouped "based on the description, amount, and cadence"; habitual buys (gas, groceries, coffee) are excluded; no accuracy figures are published ([blog](https://plaid.com/blog/recurring-transactions/)).
- **Setup:** "request at least 180 days of history"; call it only after `historical_update_complete` is true; then listen for `RECURRING_TRANSACTIONS_UPDATE`.
- **Coverage:** an add-on "for Transactions customers in the US, Canada, and UK" ([Transactions overview](https://plaid.com/docs/transactions/)). Access needs a product access request.
- **Pricing:** Transactions and Recurring are **separate subscription fees**: "an Item will incur a monthly subscription fee as long as a valid access_token exists"; `/item/remove` ends it; cycles are UTC calendar months ([billing](https://plaid.com/docs/account/billing/)). Prices appear only in the Production form.

**History:** `days_requested` defaults to 90, max **730** (~24 months). It must be set in `/link/token/create` when Transactions starts in Link. Some banks give less: "Capital One provides only 90 days… and does not provide pending transactions" ([troubleshooting](https://plaid.com/docs/transactions/troubleshooting/)).

**Transaction fields we should use** (`/transactions/sync`):
- `amount`: **positive = money out**; refunds are negative.
- `pending`, `pending_transaction_id`: a pending row is removed and a new posted row is added. Posting takes "one to five business days… up to fourteen in rare situations". An authorization hold "may not convert to a posted transaction at all" ([transaction states](https://plaid.com/docs/transactions/transactions-data/)).
- `authorized_date`: the day it really happened. Better for intervals than the posted `date`.
- `merchant_name`: "a more human-readable version"; null for transfers. `merchant_entity_id` is a stable merchant ID across stores.
- `counterparties[]`: `name`, `entity_id`, `type` (`merchant`, `marketplace` e.g. Google Play, `payment_app` e.g. PayPal/Zelle, `financial_institution`…), `logo_url` (100×100 PNG), `website`, and `confidence_level` (VERY_HIGH >98%, HIGH >90%, MEDIUM, LOW = "a cleansed name parsed out of the… description").
- `logo_url` and `website` on the transaction. `payment_channel` (online / in store). `transaction_code` (`refund`, `membership fee`…; only some US banks).
- `personal_finance_category` `{primary, detailed, confidence_level}`. **There is no SUBSCRIPTION category** in PFCv1 or v2 ([taxonomy CSV](https://plaid.com/documents/pfc-taxonomy-all.csv)). The closest are ENTERTAINMENT_TV_AND_MOVIES, ENTERTAINMENT_MUSIC_AND_AUDIO, PERSONAL_CARE_GYMS_AND_FITNESS_CENTERS, RENT_AND_UTILITIES_INTERNET_AND_CABLE / _TELEPHONE and GENERAL_SERVICES_*. New Plaid customers (after Dec 3, 2025) get v2 only.
- Duplicates happen when the same account is linked twice. `persistent_account_id` tracks an account across Items at Chase, PNC and US Bank.

**Free-trial holds:** $0 card checks "should not appear on the cardholder's statement"; $1 checks are voided and "disappear" ([PXP](https://www.pxp.io/payments-glossary/zero-authorization), [Solidgate](https://solidgate.com/glossary/zero-value-authorization/)). In a one-time pull, a trial hold shows up only if it's still pending that week, and never at Capital One or USAA. **Bank data mostly can't see trials.** The Apple screenshot can.

**Stripe Financial Connections (fallback)** ([object](https://docs.stripe.com/api/financial_connections/transactions/object), [guide](https://docs.stripe.com/financial-connections/transactions)):
- Fields: `amount` (integer minor units, **negative = out**), `currency`, `description` (raw text), `status` (pending / posted / void), `status_transitions`, `transacted_at`.
- No merchant name, logo, category or recurring logic. "Up to the last 180 days". US only.
- Our own detector would do everything, which is one more reason to own it.

## 2. Recommended rule set (adapt `findRepeats`)
**Inputs from Plaid:** posted rows only for intervals; date = `authorized_date ?? date`. Merchant key = `merchant_entity_id` → counterparty `entity_id` → `cleanMerchant(merchant_name ?? name)`, then `matchMerchant` for the catalog. Carry `logo_url`, plus `pending` rows for "just charged" and trial-hold evidence.

**Pre-filters:**
- Drop PFC primary TRANSFER_IN/OUT, LOAN_PAYMENTS (stops "Chase Credit Card" showing up as a subscription, which Rocket Money does), INCOME and BANK_FEES.
- Drop FOOD_AND_DRINK, GROCERIES, gas and TRANSPORTATION **unless** the merchant is in our catalog and the amount cluster equals a catalog price (DashPass $9.99 is a subscription; DoorDash dinners aren't).

**Group, then split:** within a merchant, split into separate streams by amount cluster (±10%) and billing day. The current code merges two Netflix accounts into one group, the gaps of ~15 days fail every band, and **both get dropped**. Monarch allows only one recurring per merchant, and its users complain.

**"Data end"** = the newest posted date in the pull, never `today` (bank data lags). **Expected** = last charge + one cycle (anchor-day clamped, `domain/charges`). **Grace** (posting lag up to 14 days + card-retry windows): weekly 4 d, monthly 10 d, quarterly 14 d, yearly 21 d.

| Case | Rule | State · confidence | Pre-ticked | Row proof line |
|---|---|---|---|---|
| **a** Regular, recent | ≥3 charges (≥2 if yearly) fit one band; data end < expected + grace | `renews` · **high** if catalog match, else **medium** | yes | "$17.99 on Sep 10, Oct 10, Nov 10 · next Dec 10" |
| a′ Two monthly charges | 2 charges, one gap in band, recent | `renews` · **medium** (catalog) / **maybe** (unknown) | catalog only | "$17.99 on Oct 10, Nov 10" |
| **b** Looks stopped | ≥2 charges, but data end ≥ expected + grace with no charge | `expired` · **medium** | no | "Last charged Aug 10. Nothing since." |
| **c** One charge, known service, next date not reached | 1 charge, catalog match, data end < expected + grace | `renews` · **maybe** + question | no | "One charge: $17.99 on Nov 10" |
| c′ One charge, long ago | 1 charge, past expected + grace | `expired` · **maybe** | no | "One charge on Jun 3. Nothing since." |
| c″ One charge, unknown merchant | not shown (too noisy) | — | — | — |
| **d** Yearly | 2 charges 355–376 d apart, or 1 charge whose amount matches the catalog **yearly** price | 2: `renews` · **high**. 1 within 12 mo + 21 d: `renews` · **maybe** + question. Older: `expired` · **maybe** | 2 only | "$139 on Jan 14, 2026 · renews about Jan 14" |
| **e** Price change | Last 2 charges agree within ±max($1, 10%) **or** the new price matches the catalog / `price-changes` file; use `last_amount` | keep the state; confidence one step lower if only 1 charge at the new price | as row | "Went up from $15.49 to $17.99 in Oct" |
| **f** Refund | Negative row, same merchant, ≥80% of a charge, within 30 d after it → that charge doesn't count. If it refunds the **last** charge | `expired` · **medium** | no | "Charged Nov 10, refunded Nov 12. Looks cancelled." |
| f′ Partial refund after last charge | prorated money back | `expired` · **medium** | no | "Part refund on Nov 14. Looks cancelled." |
| **g** Trial hold | pending/posted ≤ $1.00 at a catalog merchant, no earlier charges | `trial` · **maybe** + question | no | "A $1 card check on Nov 16. Often a free trial." |
| g′ First full charge after a gap | 1 charge, nothing in the ≥1 cycle of history before it | as **c** (can't tell trial-converted from new) | no | as c |
| **h** APPLE.COM/BILL, Google Play | counterparty Apple or `marketplace`: never name an app from the amount | not a Found row. Counted: "Apple billed you 4 different amounts each month." Then the Apple screenshot, whose rows (`source: 'apple'`, exact Renews/Expires) **win** over bank guesses | — | — |
| **i** PayPal | `payment_app` PayPal plus a merchant counterparty → treat as that merchant. "PAYPAL" alone → group by amount + cadence | named: as a–d. Opaque: `renews` · **maybe** + question | no | "PayPal, $9.99 on Sep 2, Oct 2, Nov 2" |
| **j** Family plan | amount matches the catalog family tier → that plan. Someone else pays → invisible (fine: not your bill) | as a–d | as row | "Spotify Family · $19.99 on…" |
| **k** Card swap / duplicates | Same stream stops on card A and resumes on card B within 1 cycle → **one** stream. Same date+amount+merchant on two accounts of the same `persistent_account_id`/mask → keep one | as a–d | as row | "Moved to card ••4821 in Sep" |

**Type tweaks (when building):**
- Add `lastCharge: DateOnly | null` and `ask?: 'still-paying' | 'trial-end' | 'what-is-it'` to `Found`.
- Add `source: 'bank'`.
- For bank rows, rename the review group "Already cancelled" to **"Looks stopped"**: we're inferring, not reading a cancel.
- Keep `preTicked` as is: only `renews`/`trial` and not `maybe`.

## 3. Confirm-step copy (the "Maybe" rows)
One question per row, inline, two or three answers. Each answer is a full-width 44pt chip. No row ever needs typing except "what is it?".

| Case | Question on the row | Answers → result |
|---|---|---|
| c Netflix, one charge | "Netflix charged $17.99 on Nov 10. Still paying for it?" | **Yes, still on** → ticked, renews Dec 10 · **I cancelled it** → off, nothing added · **Not sure** → ticked, and the first reminder asks again |
| c′ / b Old charge | "Last Netflix charge was Aug 10. Did you cancel?" | **Yes** → off · **No, still paying** → ticked; ask for the date (it may be on another card) |
| d Yearly, one charge | "Amazon Prime charged $139 on Jan 14. Is it yearly?" | **Yes, renews in Jan** → ticked · **Cancelled** → off |
| g Trial hold | "A $1 check from Audible on Nov 16. Free trial?" | **Yes** → trial; then "When does it end?" (catalog trial length pre-filled; "Not sure" = no date, rule #33) · **No** → off |
| i PayPal opaque | "$9.99 through PayPal every month. What is it?" | search field (catalog) · **Skip** |
| h Apple | "Apple bills you for 4 things. Snap your Apple subscriptions to see which." | **Open Settings** · **Later** |
| Price change | "Netflix went up to $19.99 in Nov." | **Use $19.99** (default) · **Keep $17.99** |

The header stays honest: "We spotted 9. Check them." Under the button: "Nothing's added until you tap Add." Never write "We found all your subscriptions" (rule 5).

## 4. Competitors: what they show when unsure
- **Rocket Money:** anything "without detected payments in the past month" moves to an **Inactive** list, and goes back when a payment shows up ([help](https://help.rocketmoney.com/articles/934383-missing-subscriptions)). That rule wrongly marks every yearly sub inactive. Reviews: "tried to get me to cancel Disney+ (I canceled it 2 months ago already) saying it was active" (2★, Nov 10, 2026); "frequently it will drop reoccurring transactions and make them inactive… a reoccurring $225 bill" (3★, Oct 5); "kept recurring one-time bill payments… x50" (2★, Nov 5); "not all subscriptions show up" (1★, Nov 8). Its "Assign to Recurring" sheet splits **Active / Inactive services** ([Mobbin](https://mobbin.com/screens/a549a3e5-7aa7-483a-88fb-b8dbff03cde5)).
- **Monarch:** a **Recurring Review** flow shows "potential recurring merchants… for review and approval before they are considered recurring". Scans on every sync. "Mark merchant as not recurring". All Recurring is sorted Active / Canceled. Only one recurring per merchant ([help](https://help.monarch.com/hc/en-us/articles/4890751141908)).
- **Copilot:** recurrings are created only from a real transaction. **Paused** and **Archived** views. A paused recurring "will automatically be marked as active again" when a payment arrives. Several recurrings per merchant need separate filters ([help](https://help.copilot.money/en/articles/3983286-pause-or-archive-recurrings)).
- **Finly Money** (the clearest UX found): an unsure row shows "**Recurring?**" with **Yes / No**, a "To confirm" pill, a **Review** strip, and "**All correct**". A missed charge turns amber ("Oct 26 charge missed"), then moves to **Ended** "after a few missed cycles". **Mark cancelled** can take effect now, after the next charge, or on a date ([how it works](https://www.finlywealth.com/money/help/articles/how-recurring-works), [confirm](https://www.finlywealth.com/money/help/articles/confirm-recurring-charges)).
- **Banks:** Starling: "This transaction looks like it's a recurring card payment" with a **Show in scheduled payments** toggle ([Mobbin](https://mobbin.com/screens/91f20d3b-924c-452c-98f8-f508a3c85ed6)). Monzo: a **Repeating payment** toggle plus "8 payments · average £21.14" ([Mobbin](https://mobbin.com/screens/29581257-69b0-47b7-a52f-197021967a78)). Origin greys out an **Inactive ⓘ** section ([Mobbin](https://mobbin.com/screens/3441dd7a-d41e-4406-950a-299684f6dc02)). Orbit: **Mark as Cancelled** plus price history ([Mobbin](https://mobbin.com/screens/f5aee086-c46d-41db-8fc1-aee8319a38fa)). Cleo: "…Are any of these bills?" tap-to-add ([Mobbin](https://mobbin.com/screens/9870c99d-ed23-4b9f-af12-2fe295917d0a)).
- **MonoBoost / Feenko / Subpilot** (Plaid + email): complaints are about **misses**, not false positives. "Didn't find my subscriptions at all… I know I have four" (MonoBoost 1★, Aug 25); "only gets recurring payments off your bank account… Any of your apps it will not know" (MonoBoost 1★); "didn't find any of my subscriptions" (Feenko 1★, May 31). That's the Apple and PayPal blind spot. Reviews: Apple RSS, 493 recent US reviews across Rocket Money, Monarch, MonoBoost, Feenko and Subpilot, pulled Nov 18.
- **Takeaway:** everyone uses (1) a review/confirm step, (2) a grey "inactive" bucket after a missed charge, and (3) auto-reactivation when a charge comes back. Nobody shows the proof plus a pointed question on the row. That's Ditch's chance to be the most honest one.

## 5. Ongoing accuracy with Pro "watch for new subscriptions"
Sync on app open and in background refresh (still no push). The phone keeps the `/transactions/sync` cursor; the server stores no transactions. Match each new posted charge to a sub by merchant key + amount ±10% + within ±7 days of the expected date.

| Event | What Ditch does | Copy |
|---|---|---|
| Charge arrives on time | Record `lastCharge`; snap the next date to the real billing day (fixes drift) | — (silent; the row says "Charged Nov 10 ✓") |
| Charge at a new price | Ask once | "Netflix charged $19.99, up from $17.99. Update the price?" **Update** · **Not now** |
| Expected + grace passes, no charge (sub active) | Ask once; **never auto-change** | "No Netflix charge since Nov 10. Did you cancel it?" **Yes, cancelled** · **Still paying** · **Moved cards** |
| Same, sub is **ditched-pending** | The bank backs up "Did it go through?" | "No Netflix charge this month. Looks like your cancel worked. Mark it cancelled?" **Yes** → `ditched-confirmed` (Ditched tab, "$X a year you won't pay") |
| New charge **after** a ditch | The most valuable alert | "Netflix charged $17.99 on Dec 10, after you ditched it. The cancel may not have gone through." **How to cancel** (cancel guide) · **I'm on it** |
| Refund after a ditch | Confirms the cancel | "Netflix refunded $17.99. Mark it cancelled?" |
| New stream (2 charges, or 1 at a catalog merchant) | Suggest, unticked | "New: Claude Pro, $20 on Nov 12. Add it?" |

Rules: one question per sub per cycle, answers stored on the phone, and "Still paying" silences that sub's "missed" question for a cycle. Free users get the same check from the reminder itself: the 1-day-before note can end "Still on?". This plugs straight into the existing `ditched-pending → ditched-confirmed` path (`src/domain/subs.ts`, `src/app/ditch/[id].tsx`).

## 6. Plaid vs. build ourselves

| Piece | Use Plaid | Build ourselves | Why |
|---|---|---|---|
| History, pending/posted, refunds | ✓ Transactions (730 d) | | Only source |
| Merchant cleanup, IDs, logos | ✓ `merchant_name`, `merchant_entity_id`, `counterparties`, `logo_url` | fallback `cleanMerchant` | Plaid's cleanup beats regexes; we keep our catalog map for prices and cancel guides |
| Category filter | ✓ PFC primary to **exclude** | | No SUBSCRIPTION category exists |
| Cadence and active/stopped decision | Recurring only as a **benchmark** on the Trial | ✓ `findRepeats` v2 | Same engine for CSV/PDF/Stripe; we control grace, yearly, splits and questions; Plaid's mature-stream "inactive" rule is undocumented and can't take user corrections |
| Apple, trials | | ✓ screenshot + bank amounts | Bank data can't see either well |

**Cost impact if we bought Recurring:** it's a second per-Item monthly subscription, billed for the whole UTC month even for a 2-minute scan. Price is hidden until the Production form. Rough (est.): Transactions ~$0.25–0.30/Item-month; if Recurring adds a similar amount, a one-time scan at ~1.5 banks goes from ~$0.40 to ~$0.80, and the Pro "watch" from ~$0.40 to ~$0.80 a user a month. That's double the bank cost of the part that makes money, for a decision we'd still have to re-check. **Pick: Transactions only** (as #64 says). Re-check if our Trial benchmark shows Plaid catching much more.

## 7. How accurate can this be?
- **Public numbers:** none. Plaid publishes no precision or recall for Recurring (only the category confidence bands >98% / >90%). MX, Spade (needs "3 or more transactions") and Mastercard/Finicity ("a minimum of three months of transaction history") publish none either. No peer-reviewed benchmark was found; the closest are patents (e.g. US 11216751) and a SISSA thesis, with no usable figures.
- **Realistic error modes, biggest first:**
  1. Apple/Google-billed subs hidden in one bill.
  2. Paid from PayPal balance, a gift card or another person's card (invisible).
  3. Cancelled-but-not-yet-due (case c).
  4. Yearly subs with 1 charge, or outside a 90-day bank (Capital One).
  5. Two subs at one merchant merged.
  6. Card swaps splitting one stream.
  7. Habitual spending mistaken for a subscription.
  8. Card payments and transfers mistaken for subscriptions.
  9. Pending/posted duplicates.
  10. Refunds ignored.
- **Our bar** (proposal, measured on Plaid Sandbox personas, then the 10 Trial connections plus the owner's own statements, labelled by hand):
  - **"Still charging" (pre-ticked) precision ≥ 95%.**
  - "Looks stopped" correct ≥ 90%.
  - Recall of non-Apple subs ≥ 85%.
  - 0 rows from transfers or card payments.
  - Plaid Recurring is scored on the same set.
  - This is the "accuracy bar on our test set" from DECISIONS #34.

## Sources
Plaid: [Transactions API](https://plaid.com/docs/api/products/transactions/) · [Transactions overview](https://plaid.com/docs/transactions/) · [Transaction states](https://plaid.com/docs/transactions/transactions-data/) · [Troubleshooting](https://plaid.com/docs/transactions/troubleshooting/) · [Billing](https://plaid.com/docs/account/billing/) · [PFC taxonomy CSV](https://plaid.com/documents/pfc-taxonomy-all.csv) · [PFCv2 migration](https://plaid.com/docs/transactions/pfc-migration/) · [Recurring blog, May 2022](https://plaid.com/blog/recurring-transactions/).
Stripe: [Transaction object](https://docs.stripe.com/api/financial_connections/transactions/object) · [Transactions guide](https://docs.stripe.com/financial-connections/transactions).
Others: [Spade](https://docs.spade.com/reference/recurring-transaction-guide) · [Mastercard Recurring](https://developer.mastercard.com/open-finance-us/documentation/products/manage/recurring-transactions/) · [PXP zero auth](https://www.pxp.io/payments-glossary/zero-authorization) · [Solidgate](https://solidgate.com/glossary/zero-value-authorization/).
Competitors: [Rocket Money missing subs](https://help.rocketmoney.com/articles/934383-missing-subscriptions) · [Rocket Money cancellations](https://help.rocketmoney.com/en/articles/4649463-cancellations-faqs) · [Monarch recurring](https://help.monarch.com/hc/en-us/articles/4890751141908) · [Copilot pause/archive](https://help.copilot.money/en/articles/3983286-pause-or-archive-recurrings) · [Finly](https://www.finlywealth.com/money/help/articles/how-recurring-works).
Reviews: App Store review RSS `itunes.apple.com/us/rss/customerreviews/id=<id>/sortby=mostrecent/json` for Rocket Money 1130616675, Monarch 1459319842, MonoBoost 6740202306, Feenko 6747262759 and Subpilot 6751181747 (Nov 18, 2026). Mobbin screens linked inline.
