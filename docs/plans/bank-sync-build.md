# Bank sync: server build (Nov 19, 2026)

The server side of always-on bank sync (DECISIONS #64, #67, #69). Cost rules: `docs/research/bank-sync-2026-11-19.md` ("Keeping Plaid costs down"). The phone does all the finding (`src/import/bankSync.ts`). The server only gets bank transactions from Plaid and passes them straight to the phone. **It never stores them.**

Status: code and tests are done, and it runs against fakes. **Not deployed. Not yet tried against Plaid Sandbox or Apple's sandbox.** Nothing on screen uses it yet.

## 0. Live setup (Nov 20, 2026)
- Supabase project **ditch-api**, ref `olqpjlcaksdsbmffryoh`, US East, Free plan (centile paused to make room). Move to Pro before real users: free projects pause after a week idle.
- Database: both migrations applied, plus `20261120130000_bank_cleanup_via_api.sql`. Vault has `project_url`; `cron_secret` still to add (same value as the CRON_SECRET function secret).
- Server: ONE Edge Function `api` (supabase/functions/api/index.ts) serves every route at `https://olqpjlcaksdsbmffryoh.supabase.co/functions/v1/api/<route>`. Deployed as an esbuild bundle through the Supabase MCP (the saved SUPABASE_ACCESS_TOKEN is rejected as invalid). To redeploy: `npx esbuild supabase/functions/api/index.ts --bundle --format=esm --platform=neutral --target=es2022 --external:'npm:*' --legal-comments=none` and upload the output as `index.ts` (verify_jwt off), or `npx supabase functions deploy api --project-ref olqpjlcaksdsbmffryoh --no-verify-jwt` once a valid access token exists.
- App (EAS env, later): `EXPO_PUBLIC_API_URL=https://olqpjlcaksdsbmffryoh.supabase.co/functions/v1/api`. Plaid webhook URL: `.../functions/v1/api/plaid-webhook`. Apple notifications URL: `.../functions/v1/api/apple-notifications`.
- Secrets still to add (Supabase → Edge Functions → Secrets): PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV=sandbox, PLAID_WEBHOOK_URL, TOKEN_ENC_KEY, CRON_SECRET, APPLE_BUNDLE_ID=app.ditchsubs.ditch.

## 1. How it fits together

```
 iPhone (Ditch)                                Supabase "ditch-api"                         Outside
 ─────────────────                             ─────────────────────                        ───────
 Keychain: app user id (UUID)                  Edge Functions (Deno)                        Plaid
           + install secret                    ┌─────────────────────────┐                  (Stripe FC fallback)
                                               │ entitlement-sync        │◄── StoreKit JWS
 StoreKit 2 purchase ──appAccountToken=UUID──► │ bank-link-token         │──► /link/token/create
                                               │ bank-exchange           │──► /item/public_token/exchange, /item/get
 Plaid Link (native SDK) ◄── link_token ────── │ bank-sync               │──► /transactions/sync (pages, cursor)
          └── public_token ──────────────────► │ bank-remove             │──► /item/remove
                                               │ bank-list               │
 src/services/bank.ts  ─ x-ditch-user ───────► │ plaid-webhook           │◄── Plaid webhooks (signed JWT)
                         x-ditch-secret        │ apple-notifications     │◄── App Store Server Notifications V2
 bankSync.ts finds the subs on the phone       │ bank-cleanup  (hourly)  │◄── pg_cron + pg_net
                                               └───────────┬─────────────┘
                                                           │ service role only (RLS on, no policies)
                                               Postgres: app_users · entitlements · bank_links · events
```

### What happens, step by step
1. **First launch:** `bank.ts` makes a random UUID and a 32-byte secret and saves both in the iOS Keychain.
2. **Purchase:** StoreKit 2 buys with `appAccountToken = UUID`. The phone posts the signed transaction (and renewal info) to `entitlement-sync`. The server checks Apple's signature, bundle id and environment, and that `appAccountToken` equals the caller's id. Only then does it create the `app_users` row (it stores just a SHA-256 hash of the secret). So a user row only exists after Apple proves a purchase.
3. **Connect:** `bank-link-token` checks access, the 3-bank cap and the rate limit, then asks Plaid for a Link token: Transactions only, 730 days, our webhook, and the OAuth redirect. The phone opens Plaid Link and gets a `public_token`. `bank-exchange` swaps it for an access token, encrypts that token (AES-256-GCM) and saves it. The same bank connected again replaces the old connection, so we're never billed twice. A 4th bank is removed straight away.
4. **Sync:** on app open or background refresh, `bank-sync` calls `/transactions/sync` from the saved cursor through every page. It restarts from the first cursor if Plaid reports `TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION`. It maps rows to the phone's `BankTxn` and returns `added / modified / removed`. The new cursor stays *pending* until the phone confirms it saved the batch (the `ack` sent with the next sync), so a crash mid-save never loses charges.
5. **Plaid webhooks:** `SYNC_UPDATES_AVAILABLE` sets `updates_available`. `ITEM: ERROR / ITEM_LOGIN_REQUIRED` marks the bank "needs reconnect" and starts the 30-day clock. `PENDING_DISCONNECT` / `PENDING_EXPIRATION` mark it "expiring". `LOGIN_REPAIRED` clears both. `USER_PERMISSION_REVOKED` removes the Item.
6. **Apple notifications:**
   - `EXPIRED`, `GRACE_PERIOD_EXPIRED`, `REFUND`, `REVOKE` and billing retry end bank access, and **every bank is removed in the same request**.
   - A cancelled trial (`DID_CHANGE_RENEWAL_STATUS` / `AUTO_RENEW_DISABLED`), or a paid plan with auto-renew off, **keeps** bank sync until the period's end date (`expires_at`). The hourly cleanup removes it once `expires_at` + 1 hour has passed, unless they turned auto-renew back on or renewed.
   - While a trial is ending, existing banks keep syncing but no new bank can be added.
7. **Hourly cleanup:** `bank-cleanup` checks every live connection. It must belong to an existing, entitled user, must not have been stuck needing a re-login for 30+ days, and a user may hold at most 3. Anything else is removed. It also retries removals that failed.

### Who can keep a bank connected (`_shared/entitlements.ts`)
| Plan | Bank sync |
|---|---|
| Yearly / Weekly in the free trial, auto-renew **on** | Yes, until the trial ends |
| Free trial with auto-renew **off** (trial cancelled) | Yes, until the trial's end date, then removed by the hourly cleanup. No new banks meanwhile (DECISIONS #67, updated Nov 19) |
| Paid period, even with auto-renew off | Yes, until the period ends |
| Apple billing grace period | Yes, until grace ends |
| Billing retry, expired, refunded, revoked | No |
| Lifetime | Yes for 12 months from purchase, then only with the $19.99/yr bank add-on |
| Family Sharing copy | No (open question below) |
| Free | No (DECISIONS #67: free users get 0 scans) |

## 2. What's stored where
| Where | What | Never |
|---|---|---|
| iPhone Keychain | app user id, install secret, sync acks | |
| iPhone (app's own storage, to be built) | the bank transactions (`mergeBankTxns`), the subscription list | |
| `app_users` | id, SHA-256 of the secret, created_at | name, email, phone, device id |
| `entitlements` | product, status, expiry, trial flag, auto-renew, original transaction id | receipts, prices paid |
| `bank_links` | provider, item_id, **encrypted** access token, sync cursor, institution name, status, error code | transactions, account numbers, balances |
| `events` | kind + small codes (e.g. `link_removed`, `{reason: "apple_EXPIRED_expired"}`), kept 180 days | tokens, transactions, amounts, merchant names |
| Plaid | the bank login and transactions (Plaid's side) | |
| Function logs | error class + a short message on crashes | tokens, request bodies |

Removing a connection wipes the token and cursor from the row. The row itself stays as an audit record.

## 3. Cost rules → code
| Rule (research doc) | Where it's enforced |
|---|---|
| Transactions only; no Recurring, Balance, Auth or Identity | `plaid.ts` `linkTokenBody` sends `products: ['transactions']`. A test fails if any function source mentions `/transactions/refresh`, `/transactions/recurring`, `/accounts/balance`, `/auth/get` or `/identity/get` |
| Never `/transactions/refresh` | Not in the client. Same test. Only `/transactions/sync` (included in the price) |
| Max 3 banks | `bank-link-token` (409 `bank_limit`), `bank-exchange` (a 4th is removed at once), SQL trigger `bank_links_cap`, cleanup `over_cap` |
| Same bank twice = one bill | `bank-exchange` removes the older connection to the same institution |
| Trial cancelled → keep until the trial's end date, then remove | `bankAccess` allows a cancelled trial (`trial_ending`) until `expires_at`. The hourly cleanup removes it after `expires_at` + 1 hour. `bank-link-token`/`bank-exchange` refuse new banks while a trial is ending |
| Pro lapsed / refund / revoke → remove | `apple-notifications` removes in the same request (EXPIRED, GRACE_PERIOD_EXPIRED, REFUND, REVOKE). Fallbacks: `entitlement-sync` on app open, `bank-sync` (removes and answers 402), and the hourly cleanup |
| Lifetime year 1 over without the add-on → remove | `bankAccess` → hourly cleanup |
| Stuck on "reconnect" 30 days → remove | `needs_relogin_since` + cleanup `relogin_30d` |
| Nightly check that every Item belongs to a paying user | hourly `bank-cleanup` (`planCleanup`). An hour of grace after a period ends, in case Apple's renewal notice is late |
| Rate-limit link tokens | 10 an hour and 30 a day per user (`policy.ts`) |
| Failed `/item/remove` | the row stays `removing`, cleanup retries every hour, `remove_attempts` counts up |

**Can't be automated:** Plaid has no API that lists every Item we own. Once a month, compare Plaid Dashboard → Usage (billed Items) with `select count(*) from bank_links where status <> 'removed'`. A gap means an Item we lost track of (`webhook_unknown_item` events can help find it).

## 4. Security model
- **Caller identity (phone):** `x-ditch-user` (UUID) + `x-ditch-secret` (32 random bytes). Only a hash is stored and compared in constant time. A new secret for an existing id (Keychain lost) is accepted only with an Apple-signed transaction for that id that was signed less than 24 hours ago.
- **Supabase JWT check is off** (`verify_jwt = false` in `config.toml`) because Ditch has no Supabase Auth. Every function checks its own caller: the phone by its secret, Plaid by its JWT, Apple by its JWS, cron by `x-cron-secret`.
- **Database:** RLS on all four tables with no policies, and `anon`/`authenticated` grants revoked. Only the functions' service key can reach the data.
- **Access tokens:** AES-256-GCM with `TOKEN_ENC_KEY` (env secret). A fresh IV each time, and the row's `provider:item_id` is bound in as additional data, so a ciphertext copied to another row won't decrypt. Decrypted only in memory, never logged, never returned (a test checks every response). Alternative: Supabase Vault, if we'd rather not hold the key in function secrets.
- **Plaid webhooks:** the `Plaid-Verification` JWT must be ES256, the key comes from `/webhook_verification_key/get` (cached for a day), `iat` must be 5 minutes old or less, and the SHA-256 of the raw body must match `request_body_sha256` (constant-time).
- **Apple data:** header `alg` ES256, an `x5c` of 3 certificates, a root pinned to Apple Root CA - G3's SHA-256 (`63343abf…3e9179`), WWDR OID `1.2.840.113635.100.6.2.1` on the intermediate, receipt-signing OID `1.2.840.113635.100.6.11.1` on the leaf, chain signatures and validity dates checked at `signedDate`, then the JWS signature. These are the same checks Apple's `app-store-server-library` does offline. No OCSP (Apple's library makes it optional too). Bundle id and environment are checked. `notificationUUID` dedupes repeats. Older signed data never overwrites newer.
- **Transactions** are only in memory while a request runs.
- **Error replies** are short codes (`not_entitled`, `bank_limit`, `provider_error` + Plaid's error code). Never Plaid's message text.

## 5. Files
```
supabase/
  config.toml                         functions, verify_jwt off
  migrations/20261119120000_bank_sync.sql         tables, RLS, cap trigger
  migrations/20261119120100_bank_cleanup_cron.sql pg_cron hourly cleanup + event pruning
  functions/.env.example              secret NAMES only
  functions/deno.json
  functions/<9 functions>/index.ts    3 lines each: serve(handler)
  functions/_shared/
    handlers.ts      all function logic (pure, tested)
    provider.ts      BankProvider interface (Plaid ⇄ Stripe swap)
    plaid.ts         Plaid over fetch      stripe.ts  Stripe Financial Connections (untested fallback)
    plaidMap.ts      Plaid → BankTxn, page merge, pagination restart
    plaidWebhook.ts  webhook JWT check + webhook → action
    appleJws.ts      Apple JWS + x5c chain check     x509.ts  tiny DER reader
    entitlements.ts  Apple data → entitlement → "may keep a bank?"
    policy.ts        cap, rate limit, 30-day rule, cleanup plan
    crypto.ts bytes.ts jws.ts money.ts http.ts store.ts types.ts
    deno/deps.ts deno/supabaseStore.ts   (Deno-only: env, supabase-js)
  __tests__/*.test.ts                 run by the app's `npx jest`
  testing/                            in-memory store, fakes, Apple test-chain fixtures (+ generator)
src/services/bank.ts, bank.web.ts, bankShared.ts   phone client, web mock, sample data
```
The pure modules use only web-standard APIs, so the app's Jest and `tsc` check them. The Deno-only files are left out of the app's `tsconfig.json` and checked with `deno check supabase/functions/*/index.ts` (passed with Deno 2.9.6).

## 6. Environment variable names
Edge Function secrets (`supabase/functions/.env.example`): `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`, `PLAID_WEBHOOK_URL`, `PLAID_REDIRECT_URI`, `PLAID_COUNTRY_CODES` (optional), `BANK_PROVIDER` (optional), `STRIPE_SECRET_KEY` (fallback only), `TOKEN_ENC_KEY`, `APPLE_BUNDLE_ID`, `APPLE_ENVIRONMENTS` (optional), `APPLE_PRODUCT_YEARLY`, `APPLE_PRODUCT_WEEKLY`, `APPLE_PRODUCT_LIFETIME`, `APPLE_PRODUCT_BANK_ADDON`, `CRON_SECRET`. Supabase adds `SUPABASE_URL` and `SUPABASE_SECRET_KEYS` / `SUPABASE_SERVICE_ROLE_KEY` by itself.
App (EAS env, root `.env.example`): `EXPO_PUBLIC_API_URL` (not secret).
Vault (for cron): `project_url`, `cron_secret`.

## 7. Deploy (Claude can run all of these once the owner has made the project and saved the keys)
```bash
npx supabase login                                   # owner's browser sign-in
npx supabase link --project-ref <ref>
npx supabase db push                                 # both migrations
npx supabase functions deploy bank-link-token bank-exchange bank-sync bank-remove bank-list \
  plaid-webhook apple-notifications entitlement-sync bank-cleanup --no-verify-jwt
# secrets: the owner types them in the dashboard (section 9), or from their own terminal:
#   npx supabase secrets set --env-file ./supabase/functions/.env
```
Then, once in the SQL editor (the owner pastes the cron secret value, never in chat):
```sql
select vault.create_secret('https://<ref>.supabase.co', 'project_url');
select vault.create_secret('<CRON_SECRET value>', 'cron_secret');
```
Check: `select * from cron.job;` shows `bank-cleanup-hourly`. `select * from net._http_response order by created desc limit 5;` shows a 200 after the next :07.

## 8. App build steps (later, needs a new EAS build: not Expo Go)
Already added: `expo-secure-store` and `expo-crypto` (both work in Expo Go; the next EAS build includes them). The secure-store config plugin isn't added; it's only needed for Face ID prompts.

When the bank screens are approved:
1. `npx expo install react-native-plaid-link-sdk` (v13+, needs Expo 52+, iOS 15.1+). There's no config plugin; autolinking does it. API: `createPlaidLinkSession({ token, onSuccess, onExit, onEvent })` then `await session.open()`. `onSuccess` gives `publicToken` → `exchangePublicToken()`.
2. **OAuth banks (Chase, Capital One and others) need an https Universal Link.** Custom URL schemes don't work.
   - Pick `https://ditchsubs.app/plaid/oauth` and serve a blank page there.
   - Serve `https://ditchsubs.app/.well-known/apple-app-site-association` (JSON, no redirect) with `{"applinks":{"details":[{"appIDs":["<TEAMID>.app.ditchsubs.ditch"],"components":[{"/":"/plaid/oauth*"}]}]}}`.
   - In `app.json`: `"ios": { "associatedDomains": ["applinks:ditchsubs.app"] }`.
   - Set `PLAID_REDIRECT_URI` to the same URL, and add it in the Plaid Dashboard.
3. Purchases (expo-iap, M2): pass `appAccountToken: await getAppUserId()` on every purchase. After a purchase, on launch and on restore, call `syncEntitlements(jwsOfEachCurrentEntitlement, renewalInfoJws)`.
4. Background refresh: on open and in the background task, call `listBanks()`. If `updatesAvailable` is set or it's been more than 12 hours, call `syncBank()` → `mergeBankTxns()` → save → `confirmBankSync()` → `analyzeBank()`.
5. Stripe fallback: `npx expo install @stripe/stripe-react-native`. `bank-link-token` returns a Financial Connections Session `client_secret`. Collect accounts with the Stripe SDK, then pass the session id to `exchangePublicToken(id, 'stripe')`.

## 9. Only the owner can do these (exact clicks)
1. **Supabase project:** supabase.com → New project → name `ditch-api`, region **East US (N. Virginia)**, strong DB password (keep it in your password manager) → Create.
2. **Plaid keys:** dashboard.plaid.com → Developers → Keys. Copy client_id and the Sandbox secret.
3. **Save the secrets:** Supabase → your project → Edge Functions → Secrets → Add new secret, one per name in section 6.
   - `PLAID_ENV` = `sandbox`.
   - `TOKEN_ENC_KEY` and `CRON_SECRET`: make each on your Mac in Terminal (`openssl rand -base64 32` and `openssl rand -hex 32`) and paste the result straight into Supabase.
   - **Never in chat.** Save `TOKEN_ENC_KEY` in your password manager too: losing it means everyone reconnects their bank.
4. **Plaid Dashboard settings:**
   - Developers → Webhooks: webhook URL `https://<ref>.supabase.co/functions/v1/plaid-webhook`. The code also sends it with every Link token.
   - Developers → API → Allowed redirect URIs: add `https://ditchsubs.app/plaid/oauth`.
   - Link → Link customization: name **Ditch**.
   - Products: request only **Transactions** in the Production application. Don't enable Recurring, Balance, Auth, Identity or Refresh.
5. **App Store Connect:**
   - Apps → Ditch → General → App Information → App Store Server Notifications.
   - Production Server URL **and** Sandbox Server URL: `https://<ref>.supabase.co/functions/v1/apple-notifications`, **Version 2**.
   - Then press "Request a Test Notification" (or Claude calls the API): `events` should show `apple_notification` with type `TEST`.
6. **Product IDs:** after creating the in-app products (Weekly, Yearly, Lifetime, Bank add-on), add each ID to its `APPLE_PRODUCT_*` secret. `APPLE_BUNDLE_ID` = `app.ditchsubs.ditch`.
7. **EAS:** expo.dev → project → Environment variables → `EXPO_PUBLIC_API_URL` = `https://<ref>.supabase.co/functions/v1` (plain text, not secret).

## 10. Test plan
**Automated (done, `npx jest`):**
- Money: minor units incl. JPY 0 and KWD 3 decimals, Plaid/Stripe sign.
- Sync: page merge and pagination restart.
- Plaid client: request bodies, error codes, removing an Item that's already gone.
- Apple JWS: a valid fake chain, wrong root, rogue intermediate, wrong key, edited payload, alg/x5c, validity dates, and the **real** Apple G6 → G3 signature.
- Plaid webhook JWT: good, edited body, old token, wrong alg, expired key, other key; plus webhook → action mapping.
- Entitlements: trial, trial cancelled (kept until the end date, then removed after the grace hour; resubscribe keeps it), paid period with auto-renew off, expired, refund, grace, billing retry, Lifetime first year (and Feb 29), add-on, Family Sharing, out-of-order data.
- Policy: cap, duplicate bank, rate limit, cleanup reasons.
- Handlers end to end with an in-memory database: no token ever appears in a response, and transactions are never stored.

**Plaid Sandbox (next, with real keys; Claude runs these with curl against the deployed functions):**
1. Create a link token → open Link in a dev build (or `/sandbox/public_token/create` with `institution_id: ins_109508`, `initial_products: ['transactions']`) → exchange.
2. Log in as `user_good` / `pass_good`. `bank-sync` first returns `ready:false`, then data after `SYNC_UPDATES_AVAILABLE`.
3. Log in as `user_transactions_dynamic` (any password) for realistic repeating transactions. Call `/sandbox/transactions/create` (Sandbox only) to add a charge, then check that `added` shows it and that the ack moves the cursor.
4. `/sandbox/item/reset_login` → `ITEM: ERROR ITEM_LOGIN_REQUIRED` webhook → the bank shows "needs reconnect" → an update-mode link token → `LOGIN_REPAIRED`.
5. `/sandbox/item/fire_webhook` with `SYNC_UPDATES_AVAILABLE` → `updates_available` is true.
6. `bank-remove` → Plaid `/item/get` returns `ITEM_NOT_FOUND`.
7. Connect 3 banks, then try a 4th → 409. Connect the same bank twice → the old one is removed.
8. Check the Plaid webhook signature on a real Sandbox webhook (the code path that fetches `/webhook_verification_key/get`).

**Apple sandbox (with M2 purchases, TestFlight):**
1. Start the Yearly trial with a Sandbox account → `entitlement-sync` → `trial`.
2. Settings → Apple ID → Subscriptions → cancel → `DID_CHANGE_RENEWAL_STATUS` arrives → the bank **stays** (`trial_ending`), adding a new bank is refused, and the cleanup removes the bank about an hour after the trial ends. Turn auto-renew back on → it's a normal trial again.
3. Let a Sandbox weekly expire (accelerated renewals) → `EXPIRED` → removed.
4. Refund through StoreKit Testing / `REFUND` → removed.
5. App Store Connect → "Request a Test Notification" → `TEST` is logged.

## 11. Open questions and risks
- **Family Sharing:** right now shared copies don't get bank sync (each bank costs us monthly). Decide whether the products have Family Sharing on at all.
- **Product IDs** aren't decided yet. The `APPLE_PRODUCT_*` secrets must match App Store Connect.
- **Sandbox in production:** TestFlight and App Review purchases are Sandbox and free, so testers get real bank sync (real Plaid cost in Production). `APPLE_ENVIRONMENTS` can drop `Sandbox` after review, but App Review needs it during review.
- **No Apple OCSP check** (revoked Apple certificates). Same as Apple's library by default; low risk.
- **Late renewal notices:** the hourly cleanup waits 1 hour after a period ends. If Apple is later than that, a paying user loses the bank and must reconnect. Watch `link_removed` events with `cleanup_not_entitled` reasons.
- **Stripe fallback** is written from the docs but never run against Stripe. Stripe has no update mode, and only 180 days of history.
- **Key rotation** for `TOKEN_ENC_KEY` isn't built. The `v1:` prefix leaves room for a `v2` key later.
- **Privacy label and policy** must change before launch: "Data Linked to You: Financial Info" (DECISIONS #64). The Plaid end-user privacy policy has to be linked.
- `entitlement-sync` has no rate limit (each call checks up to 40 Apple signatures). Fine at our size; add a per-IP limit if abused.
- Large first syncs (2 years of history) go back in one response, a few MB at most. If that's slow on cellular, page it by link.

## Sources
- Plaid: [Link token create](https://plaid.com/docs/api/link/#linktokencreate) (`products`, `transactions.days_requested` max 730, `webhook`, `redirect_uri`, update mode `access_token`; tokens expire after 4 hours, 30 minutes in update mode) · [Transactions sync](https://plaid.com/docs/api/products/transactions/#transactionssync) (`cursor`, `count` up to 500, `has_more`, `next_cursor`, `TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION` restart, positive `amount` = money out, `authorized_date`, `original_description`; `/transactions/refresh` is billed per call) · [SYNC_UPDATES_AVAILABLE](https://plaid.com/docs/api/products/transactions/#sync_updates_available) · [Items and webhooks](https://plaid.com/docs/api/items/) (`/item/public_token/exchange`, `/item/remove`, `/item/get`, `ERROR`, `PENDING_DISCONNECT`, `PENDING_EXPIRATION`, `USER_PERMISSION_REVOKED`, `LOGIN_REPAIRED`) · [Update mode](https://plaid.com/docs/link/update-mode/) · [OAuth on iOS](https://plaid.com/docs/link/oauth/) (an https Universal Link; custom schemes not supported) · [Webhook verification](https://plaid.com/docs/api/webhooks/webhook-verification/) · [Billing](https://plaid.com/docs/account/billing/) · [react-native-plaid-link-sdk](https://github.com/plaid/react-native-plaid-link-sdk) (v13 `createPlaidLinkSession`, Expo 52+, no Expo Go)
- Stripe: [Financial Connections transactions](https://docs.stripe.com/financial-connections/transactions) (sessions with `permissions[]=transactions`, `prefetch`, `subscribe`, `transaction_refresh[after]`, `refreshed_transactions` event, 180 days, negative amount = money out) · [Disconnect](https://docs.stripe.com/api/financial_connections/accounts/disconnect)
- Apple: [App Store Server Notifications V2](https://developer.apple.com/documentation/appstoreservernotifications) · [responseBodyV2DecodedPayload](https://developer.apple.com/documentation/appstoreservernotifications/responsebodyv2decodedpayload) · [JWSTransactionDecodedPayload](https://developer.apple.com/documentation/appstoreserverapi/jwstransactiondecodedpayload) · [appAccountToken](https://developer.apple.com/documentation/appstoreserverapi/appaccounttoken) · [app-store-server-library (Node) JWS verification](https://github.com/apple/app-store-server-library-node) (x5c of 3, OIDs `1.2.840.113635.100.6.11.1` / `…6.2.1`, validity at `signedDate`) · [Apple PKI](https://www.apple.com/certificateauthority/) (Apple Root CA - G3, WWDR G6)
- Supabase: [Scheduling Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions) (pg_cron + pg_net + Vault) · [Function configuration](https://supabase.com/docs/guides/functions/function-configuration) (`verify_jwt`) · [Environment variables](https://supabase.com/docs/guides/functions/secrets) (`SUPABASE_SECRET_KEYS`, `SUPABASE_SERVICE_ROLE_KEY`) · [New API keys](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys)
