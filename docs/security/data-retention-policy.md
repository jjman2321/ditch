# Grasp Labs LLC: Data Retention and Disposal Policy

**Owner:** Founder · **Contact:** support@ditchsubs.app · **Last updated:** 20 November 2026 · **Reviewed:** every 12 months, and whenever we start collecting something new or a privacy law changes.

Part of the Grasp Labs Information Security Policy. Covers the Ditch iPhone app, its server and ditchsubs.app. The public version for users is section 5 of our privacy policy: ditchsubs.app/privacy.

## 1. Principles
- Collect only what a feature needs, keep it only as long as it needs it, then delete it.
- Consumer bank data from Plaid is never stored on our servers.
- Deletion is automatic wherever possible; manual steps have a fixed schedule and an owner.
- Users can ask for deletion at any time; we complete it within 30 days (sooner where the law requires).

## 2. Retention schedule

| Data | Where | Kept for | How it's disposed of |
|---|---|---|---|
| Subscription list, notes, reminders | User's iPhone (app storage) | Until the user deletes it or the app | User deletes in the app (Delete all my data) or removes the app |
| Bank transactions from Plaid | User's iPhone only; passed through our server in memory | Until the user deletes them or the app | As above. Never written to our servers |
| Plaid access token (encrypted, AES-256-GCM), item id, bank name, status | Supabase (US) | While the bank is connected and the user is entitled to bank sync | Automatic: Plaid `/item/remove` and row deletion within about 1 hour of disconnect, Delete all my data, or Pro ending. Broken connections removed after 30 days |
| Random app user id, Pro status | Supabase | While the user has Pro or a connected bank, at most 12 months after both end | Deleted on request; inactive ids cleared in the yearly review |
| Server audit log (short event codes, no tokens, amounts or transactions) | Supabase | 180 days | Automatic daily delete job |
| Server and hosting logs | Supabase, Cloudflare | Provider defaults (days) | Expire automatically |
| Database backups | Supabase | Supabase's backup window | Expire automatically |
| In-app feedback messages (and email if given) | Cloudflare D1 | Until handled, at most 12 months | Deleted on request; old messages cleared every 12 months |
| Support emails | Email inbox | Until handled, at most 24 months | Deleted on request; inbox cleared yearly |
| Waitlist emails | Cloudflare D1 | Until the launch email is sent | Deleted after launch, or sooner on request |
| Purchase status | Apple, RevenueCat (random id only) | Per Apple and RevenueCat | Under their own retention; we hold no card or payment data |

## 3. User requests
- **In the app:** Settings → Your data → Delete all my data deletes everything on the phone and disconnects every bank (removing the Plaid item and the encrypted token).
- **By email:** support@ditchsubs.app. We confirm the request, delete server-side data within 30 days, and reply when done.
- Requests to access or correct data are handled the same way.

## 4. Disposal methods
- Plaid connections: revoked with Plaid's `/item/remove` before our record is deleted, so the access token can't be used again.
- Database rows: deleted with SQL `delete`; backups age out on the provider's schedule.
- Devices: company laptops and phones are wiped (factory reset with encryption on) before being sold, recycled or given away.
- No paper records are kept.

## 5. Legal holds and law
- If the law requires us to keep something longer (for example tax records, or a legal hold), we keep only that item, only as long as required.
- We follow applicable US state privacy and breach laws (including CCPA/CPRA for California residents) and honor the same deletion rights for every user.

## 6. Checks
- The automatic jobs (hourly bank cleanup, daily log delete) are checked monthly in Supabase.
- Every 12 months the founder reviews this schedule, clears old feedback and support emails, and records the date.
