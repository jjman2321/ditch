# Profit at scale, organic vs paid ads (Nov 18, 2026)
Model per install, first 12 months, base case. **All figures are estimates** built from the benchmarks in `monetization-model-2026-11-18.md`.

**Assumed purchases per 100 installs:** 2.6 yearly (trial → paid), 0.8 exit-offer year ($24.99), 1.2 weekly (~8 weeks kept on average), 0.9 lifetime. That's ≈5.5% paying (hard paywalls 10.7%, freemium 2.1%).

**Revenue per install:**
- Gross ≈ **$3.07**
- After Apple's 15% and ~6% refunds ≈ **$2.45**
- Costs: bank scans for trial starters, half of yearly payers syncing, server ≈ **$0.18**
- **Profit ≈ $2.27 per install, about 74% margin**

| Installs a month (organic) | Gross a month | Profit a month |
|---|---|---|
| 5,000 | ~$15k | **~$11k** |
| 20,000 | ~$61k | **~$45k** |
| 50,000 | ~$154k | **~$114k** |
| 100,000 | ~$307k | **~$227k** |
Bear case (≈3% paying): roughly half of these. Year-2 renewals add ≈ +$0.40 per install.

## Paid ads (profit per install = $2.27 − cost per install)
| Cost per install | Profit per install | Return on ad spend, year 1 |
|---|---|---|
| $1.50 (Apple Search Ads on our own keywords, good TikTok) | +$0.77 | 1.6× |
| $2.00 | +$0.27 | 1.2× |
| $2.50 | −$0.23 | 1.0× |
| $4.00 (typical US finance on Meta) | −$1.73 | 0.6× |
- Ads work only when an install costs **≤ ~$2**, or conversion beats the base case.
- A **web checkout** (Stripe ≈3% instead of Apple 15–30%, US anti-steering ruling) lifts profit per install by ≈ 15–25%. That's how Finelo-style apps afford $4+ per install.
- **Margin with ads** is profit after ad spend, so it falls well below 65%. Judge ads by payback (6–12 months) and absolute profit, not by margin %.

## At scale
- **Apple's cut:** the Small Business Program is 15% only under $1M a year in proceeds. Above that, first-year subscriptions pay 30% (renewals after a year stay at 15%). Profit per install drops ≈ $2.27 → $1.84 (margin ≈ 60%).
- **Plaid:** the Growth plan (annual commitment) gives volume discounts.
- **Fixed costs** (server ~$25–300 a month, support) stay small.
- **Taxes:** a US LLC owned by a non-US founder needs an accountant (Form 5472 and related).
