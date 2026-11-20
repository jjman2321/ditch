# Grasp Labs LLC: Information Security Policy

**Owner:** Founder (security lead) · **Contact:** security@grasplabs.app · **Adopted:** Nov 20, 2026 · **Reviewed:** every 12 months, and after any incident or new vendor.

Covers Ditch (iOS app, ditchsubs.app) and every system that touches user or bank data.

## 1. What we hold, and what we don't
- **On the user's iPhone:** their subscription list and the bank transactions the app uses to find subscriptions. Not on our servers.
- **On our server (Supabase, US):** a random app user id, Pro status, and one row per connected bank: Plaid item id, the Plaid access token **encrypted with AES-256-GCM**, sync cursor, bank name, status. An audit log of small event codes, deleted after 180 days.
- **Never stored on our server:** bank logins (Plaid handles them), transactions, balances, account numbers, names, emails, ad ids.
- Bank transactions pass from Plaid through our server straight to the phone and are not written to disk.

## 2. Access control
- Only the founder has admin access to Supabase, Plaid, Apple, RevenueCat, Cloudflare, Expo and GitHub.
- **Two-factor authentication is on for every one of those accounts.** Passwords live in a password manager, never in chat, code or email.
- Database tables have row-level security on; the app can't read tables directly, only through our API.
- Contractors or new staff get the least access they need, removed the day they leave.

## 3. Secrets and keys
- API keys and the token encryption key live only in Supabase secrets, EAS environment variables or App Store Connect. Never in the code repository (`.env` files are git-ignored and checked before every commit).
- Keys are rotated after any suspected leak and when anyone with access leaves.

## 4. Data in transit and at rest
- All traffic uses HTTPS/TLS 1.2+. Supabase encrypts the database at rest; access tokens are also encrypted by us (above).

## 5. Keeping data small and deleting it
- Plaid is used for **Transactions only**.
- When a user disconnects a bank, deletes the app's data, or Pro ends, the server removes the Plaid item (`/item/remove`) and deletes the encrypted token. An hourly job enforces this. Connections stuck needing a re-login for 30 days are removed.
- Users can delete everything from Settings in the app, or by emailing support@ditchsubs.app.

## 6. Development
- Code lives in a private GitHub repository. Every change runs type checks, lint and automated tests before it ships.
- Dependencies come from the official npm registry; new SDKs are reviewed for what data they send before they're added.
- Plaid Sandbox is used for testing; real bank data never goes into test or development systems.

## 7. Vendors
Supabase (database, server functions), Plaid (bank connection), Apple (App Store, payments), RevenueCat (purchase status, random id only), Cloudflare (website), Expo (app builds). Each is checked for SOC 2 or equivalent before use and reviewed yearly.

## 8. Monitoring
- Supabase logs and Plaid webhooks are checked for errors and unusual activity. Plaid errors and failed logins are logged as codes only.
- security@grasplabs.app is monitored by the founder.

## 9. Incidents
1. Contain: revoke or rotate the affected keys, pause the server function if needed.
2. Assess: what data, which users, how it happened.
3. Notify: Plaid within 24 hours of confirming an incident involving Plaid data, affected users and authorities as the law requires (US state breach laws).
4. Fix the cause, write down what happened, update this policy.

## 10. Founder checklist (keep true)
- [ ] 2FA on: Apple ID / App Store Connect, Plaid, Supabase, RevenueCat, Cloudflare, Expo, GitHub, Zoho, Dynadot
- [ ] Password manager in use
- [ ] security@grasplabs.app alias set up and reaching your inbox
- [ ] Laptop and phone: screen lock, disk encryption (FileVault), automatic updates on
