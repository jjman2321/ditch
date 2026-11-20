# Grasp Labs LLC: Plaid Security Questionnaire Answers

**App:** Ditch (iOS) · **Contact:** support@ditchsubs.app · **Last updated:** 20 November 2026

## Security governance
- **Security contact:** Founder, support@ditchsubs.app (monitored).
- **Documented information security policy:** Yes. Grasp Labs maintains a written information security policy, reviewed yearly and after any incident or new vendor. It covers data minimization (we never store bank credentials, transactions, balances or account numbers; Plaid access tokens are encrypted with AES-256-GCM), access control (single admin, MFA and a password manager on all systems, row-level security on the database), secrets management (keys only in our hosting providers' secret stores, never in code), encryption in transit and at rest, automatic deletion of Plaid items when a user disconnects or deletes their data, vendor review, vulnerability management, monitoring, and an incident response plan that includes notifying Plaid within 24 hours.

## Access control and authentication
- **Access controls in place:** a defined and documented access control policy; periodic access reviews (every 12 months); OAuth tokens / API keys over TLS for non-human (server-to-server) authentication.
- **MFA for consumers before Plaid Link:** No. Ditch has no user accounts. Bank connections are tied to the device, which is protected by the iPhone's own passcode/Face ID. No consumer financial data is stored on our servers.
- **MFA on critical systems that store or process consumer financial data:** Yes. MFA is enabled on Supabase, Plaid, Apple, RevenueCat and our other admin accounts.

## Encryption
- **TLS 1.2 or better in transit:** Yes. All traffic (app to server, server to Plaid, website) uses HTTPS with TLS 1.2+.
- **Plaid data encrypted at rest:** Yes. Plaid access tokens are encrypted with AES-256-GCM at the application level before storage, on top of Supabase's database encryption at rest. Transaction data is not stored on our servers; it is passed to the user's iPhone and stored in the app's sandbox, protected by iOS Data Protection (hardware encryption tied to the device passcode).

## Vulnerability management
- **Vulnerability scanning of machines and production assets:** Yes. We run no self-managed servers: production runs on Supabase and Cloudflare, which patch the underlying infrastructure. We scan our database configuration with Supabase's security advisor after every change and monthly, and scan all code dependencies weekly with GitHub Dependabot plus npm audit before each release (critical/high patched within 7 days, moderate within 30). Company laptops run automatic OS security updates and built-in malware protection.

## Privacy
- **Privacy policy:** Yes. https://ditchsubs.app/privacy
- **Consumer consent:** Yes. Bank sync is optional and off by default. Before Plaid Link opens, the app explains what data is read and why, and the user must tap to continue; Plaid Link then shows its own consent screen. Our privacy policy describes all collection. Users can disconnect any bank at any time in Settings, which removes the connection.
- **Data deletion and retention policy, reviewed periodically:** Yes. Our Data Retention and Disposal Policy sets a retention period and disposal method for every data type and is reviewed every 12 months. Deletion is automated: an hourly job removes Plaid Items (/item/remove) and deletes encrypted access tokens when a user disconnects, deletes their data, or their subscription ends; broken connections are removed after 30 days; audit logs are deleted after 180 days. Transaction data is never stored on our servers. User deletion requests are completed within 30 days.

## Attached policies
- Grasp Labs Information Security Policy
- Grasp Labs Access Control Policy
- Grasp Labs Data Retention and Disposal Policy
