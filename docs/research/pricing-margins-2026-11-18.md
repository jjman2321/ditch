# Pricing, bank-data costs and margins (Nov 18, 2026)
Owner goals: maximise conversion and revenue, at least a **65% profit margin**, and paid ads possible later.

## Bank-data cost (per connected bank)
- **Plaid** (Transactions): Plaid doesn't publish a price; it shows only inside the Production form. Third parties report **~$0.25–0.50 per connected bank per month**. It's billed every month the bank stays connected, even if the connection is broken. Pay-as-you-go has no minimum (Plaid docs).
- **Stripe Financial Connections:** about **$0.30 per account per month** for transactions, from our Nov 16 reading. Stripe's pricing page currently only shows balances at $0.10 per call, so confirm in the dashboard. US only.
- Average user ≈ 1.5 banks. **Staying connected (sync) ≈ $0.45–0.75 a month, or $5.40–9.00 a year per user.** Scanning and disconnecting 4 times a year ≈ $1.80–3.00 a year.

## Margin per plan (Apple Small Business Program, 15%)
| Plan | Price | You keep after Apple (15%) | Bank cost (low–high) | Margin (low–high cost) |
|---|---|---|---|---|
| Yearly $29.99, always synced | $29.99 | $25.49 | $5.40–$9.00 | **67%–55%** |
| Yearly $29.99, scan 4x/yr | $29.99 | $25.49 | $1.80–$3.00 | **79%–75%** |
| Yearly $39.99, always synced | $39.99 | $33.99 | $5.40–$9.00 | **71%–62%** |
| Yearly $39.99, scan 4x/yr | $39.99 | $33.99 | $1.80–$3.00 | **80%–77%** |
| Monthly $4.99, synced | $4.99 | $4.24 | $0.45–$0.75 | **76%–70%** |
| Monthly $6.99, synced | $6.99 | $5.94 | $0.45–$0.75 | **79%–74%** |
| Lifetime $89.99, 1 scan/yr x5 yrs | $89.99 | $76.49 | $2.25–$3.75 | **82%–81%** |
Extra costs:
- Trial starters who connect a bank and don't pay. One month of bank fees each ≈ $0.45–0.75; at ~37% trial→paid that's ≈ $1.20–2.00 per paying user in year 1.
- Fixed costs: Supabase Pro $25/mo and the Apple developer account $99/yr. Negligible from a few hundred subscribers.

## Recommendation (meets ≥65%)
- **Yearly $39.99** with a 7-day trial (was $29.99).
- **Monthly $6.99** (was $4.99).
- **Lifetime $89.99** (#65): one scan a year, no ongoing sync.
- **Sync is opt-in for Pro.** "Watch for new subscriptions" is off by default; the default is scan and disconnect, as promised on the trust screen. That gives a blended margin of ~70–78%. Even if every yearly user synced all year, it stays at 62–71%.
- **Gate bank scans behind starting the trial,** so free downloads cost $0 in bank fees.

## How we compare (US, Nov 2026)
| App | Yearly | Monthly / weekly | Finds subs? |
|---|---|---|---|
| Rocket Money | $84–168 | $7–14/mo | Bank |
| MonoBoost | $99.99 | $6.99–9.99/wk | Bank + email |
| Subpilot | $99.99 | $24.99/mo, $9.99/wk | Bank + email |
| Feenko | ~$80 ($39.99 per 6 months) | $9.99/wk | Bank + email |
| Hiatus | $35.99–59.99 | $9.99+/mo | Bank |
| **Ditch (proposed)** | **$39.99** | **$6.99/mo** | Bank + Apple screenshot + statement |
| Manual trackers (median) | $14.99 | — | No |

Positioning: about half the price of the bank-finder apps, with no weekly plans or tricks, and still above the manual trackers because Ditch does the finding.

## Paid ads (later)
- US finance cost per install ≈ $4.
- App Store-only revenue per install is likely ~$1.30–2.70 at these prices, so ads lose money at first.
- Ads become worth it when: trial starts ≥ 10% of installs, trial→paid ≥ 40%, and/or a web checkout (Stripe ≈ 3% fee instead of Apple's 15%) lifts net per install above CPI.
- Start with a $1–3k test only once organic numbers hit those marks.
