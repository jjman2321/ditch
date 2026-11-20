# Price hike alerts: worth building? (Nov 20, 2026)

Three research passes, full detail in `docs/research/price-hike-2026-11-20/` (keywords.md, voices.md, landscape.md).

## Verdict
**Yes, as a Pro retention/conversion feature, built cheaply first. Not as a download driver.**

## Evidence
- **Search (DataForSEO, US):** "[service] price increase" ≈ 64–71k searches/month across 22 services (Netflix 14.8k, Xbox Game Pass 12.1k, YouTube Premium 8.1k, Disney+ 5.4k, Spotify 5.4k). Generic "price increase alert/tracker" ≈ 560/month total. Searches are spiky: the two biggest months hold 60–96% of a service's year (Netflix 74k in Apr 2026). People search the service, not an alert app.
- **People (news, forums, reviews):** strong anger at hikes found late ("quietly raised", "I didn't even get an email"); few explicit "build me an alert" requests. Chargebee: 90% notice a hike, 22% cancelled something. Deloitte: 61% would cancel if their favourite service rose $5. Moderate demand.
- **Competitors:** everyone (Rocket Money, Finly, Hiatus, Chase, Capital One Eno, Copilot, Monarch) warns **after** the higher charge posts, and needs a bank link. Nobody warns **before** the bill from a public price list. That gap fits Ditch.
- **Frequency:** ~0.6 hikes per service per year, median +14% (~$2/month). A user with 4–5 big services gets ~2–3 alerts a year. Enough to feel useful, rare enough not to annoy.

## What Ditch has / is missing
- Has: Pro "Price watch" card on Home + editor line, built-in prices only; "Price rise check" paywall row; bank price-change detection coded but bank sync is off in the App Store build.
- Missing: no notification ever mentions a price rise; no downloaded price file (built-in prices change only with an app update); imported subs (screenshot/statement) are skipped by price watch.

## Plan (recommended)
1. **Now (2–4 days, Pro):** put the rise inside the existing 3-day/1-day renewal reminders ("Netflix renews Tuesday. Now $19.99, you had $17.99. Still watching?"). No extra notifications. Also watch imported subs whose price matches one of our plans. Ship price fixes via over-the-air updates until step 2.
2. **v1.1:** a daily public price file (same for everyone, sends nothing about the user: privacy label unchanged) with upcoming hikes and when existing members pay. Then one heads-up alert per hike, before the bill.
3. **Later:** confirm hikes from bank charges once bank sync is live.
4. **Website:** one evergreen page per service ("Netflix price increase" + history), indexed before the spring/fall hike seasons. This is where the 70k/month search demand is.

## Honesty rules
Say "Our checked price for your plan went up", never imply we watch their account. Never "saved". Regional prices, Apple billing, bundles, grandfathered members: show "may not apply to you yet" when existing-member dates are unknown.

## Notes
DataForSEO trial balance ran out ($0.04 left); App Store keyword popularity not collected. Reddit couldn't be opened directly; Reddit voices come via news quotes.
