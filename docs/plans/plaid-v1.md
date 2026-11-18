# Plan: v1 with Plaid bank scan (DECISIONS #64, Nov 18, 2026)

## What the user sees
1. **Find my subscriptions** hub gets a top row: **"Connect your bank (US & Canada)"**. Other rows stay: Apple subscriptions screenshot, bank app screenshot, statement PDF/CSV.
2. **Plaid Link:** the user picks their bank and logs in through Plaid. We never see the password.
3. **Scanning…** We pull ~12–24 months of transactions and run Ditch's repeat detector (the same engine as statements) on the phone.
4. **Disconnect:** we call `/item/remove`, then show "Done. We've disconnected your bank."
5. **The find results:** "Found 9 · $1,140 a year · 2 trials end soon", then the paywall step (paywall design still waiting on the owner's OK).
6. **The review list:** the same Still charging / Maybe / Already cancelled screen as other imports, then Add.

## Pieces to build
| # | Piece | Where | Notes |
|---|---|---|---|
| 1 | StoreKit 2 purchases (needed anyway) | app (`expo-iap`) | Yearly, monthly, lifetime; restore; entitlement on the phone; receipt check on the server for bank scans |
| 2 | Supabase project `ditch-api` | owner creates (or OKs it) | Edge Functions only; no transactions stored |
| 3 | `plaid-link-token` | Edge Function | Creates a Link token (products: transactions; countries: US, CA) |
| 4 | `plaid-exchange` | Edge Function | public_token → access_token (encrypted at rest, short TTL) |
| 5 | `plaid-scan` | Edge Function | `/transactions/sync` until complete, returns cleaned rows to the phone, then `/item/remove` |
| 6 | `plaid-webhook` | Edge Function | Historical update ready, item errors |
| 7 | Abuse limits | Edge Function | One free scan per device (App Attest / DeviceCheck), Pro rescans every 90 days, Lifetime once a year |
| 8 | Plaid Link in the app | `react-native-plaid-link-sdk` + config plugin | Needs an EAS dev build (not Expo Go); the web preview shows a mock |
| 9 | Connect-bank UI | `src/app/find/bank.tsx` | Mockups first (CLAUDE.md: design before building) |
| 10 | Transactions → Found | `src/import/` | Reuse `findRepeats`; add the merchant names Plaid returns (`merchant_name`, `personal_finance_category`) to matching |
| 11 | Privacy policy, label, review notes | site + App Store Connect | "Data Linked to You: Financial Info"; explain connect-scan-disconnect; demo login (Plaid Sandbox user_good) for App Review |
| 12 | Tests | Jest | Transaction → repeat detection fixtures, scan limits, token never logged |

## Timeline (realistic)
- **Nov 19–Dec 4:** purchases (1), mockups for the bank screens, Supabase plus Edge Functions against **Plaid Sandbox** (free, no approval), the app flow in a dev build.
- **Dec 5–16:** owner exams. Claude keeps building and testing on Sandbox; no owner testing needed.
- **Dec 17–Jan 2:** owner tests on iPhone with **Plaid Trial** real banks (10 connections), plus the privacy policy and label. Apply for **Production** by about Dec 15 (a few business days plus a security questionnaire; Chase can lag).
- **~Jan 5–9:** submit v1. **Mid-January launch**, timed for "new year, cut your subscriptions".

## Only the owner can do these
1. **Plaid:** sign up at dashboard.plaid.com/signup as Grasp Labs LLC → Sandbox keys right away → apply for the Trial.
2. **Stripe:** Grasp Labs LLC account → Settings → Financial Connections (fallback).
3. **Supabase:** create project `ditch-api` (free tier is fine to start), or tell Claude to create it.
4. **Keys:** Plaid client ID and secret go in Supabase → Project settings → Edge Functions → Secrets (`PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`). Never paste them in chat.
5. Answer: does the LLC have a US business bank account?
