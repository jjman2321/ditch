# Grasp Labs LLC: Access Control Policy

**Owner:** Founder · **Contact:** support@ditchsubs.app · **Adopted:** Nov 20, 2026 · **Reviewed:** every 12 months, and when anyone joins or leaves.

Part of the Grasp Labs Information Security Policy. Covers every production system and all sensitive data for Ditch (iOS app, ditchsubs.app).

## 1. Systems covered
- **Supabase:** production database and server functions (holds encrypted Plaid access tokens).
- **Plaid Dashboard:** API keys and bank connection settings.
- **Apple App Store Connect, RevenueCat:** app releases, purchases.
- **Cloudflare, Expo (EAS), GitHub, domain registrar, email:** website, app builds, source code, DNS.

## 2. Who gets access
- Access is given only to people who need it for their job, and only to the systems and level they need (least privilege).
- Today only the founder has admin access to production systems. Anyone added later gets their own named account; shared logins are not allowed.
- Every grant is written down (person, system, level, date, reason).

## 3. How access is protected
- **Multi-factor authentication is required** on every account listed in section 1.
- Strong, unique passwords stored in a password manager. Never shared in chat, email or code.
- Company devices must use a screen lock, full-disk encryption and automatic security updates.

## 4. Sensitive data
- Plaid access tokens are encrypted with AES-256-GCM before they are stored. The key lives only in Supabase's secret store.
- The production database has row-level security on every table. The app can't read tables directly; it can only call our server API, which checks each request.
- No person reads bank data. Transactions pass from Plaid through the server straight to the user's phone and are never stored on our servers.

## 5. Systems talking to systems
- Server-to-server calls (our server to Plaid, Supabase and Apple) use API keys or signed tokens over HTTPS/TLS.
- Keys live only in Supabase secrets, EAS environment variables or App Store Connect, never in source code. `.env` files are git-ignored.

## 6. Removing access
- When someone leaves or no longer needs access, it is removed the same day, and any keys they could see are rotated.
- Keys are also rotated straight away after any suspected leak.

## 7. Reviews
- Every 12 months the founder reviews every account on every system in section 1, removes anything not needed, and confirms MFA is still on.
- Review date and results are recorded.

## 8. Logging
- Supabase keeps access and function logs. Our server keeps an audit log of bank connection events as small codes (no tokens, amounts or transactions), deleted after 180 days.
