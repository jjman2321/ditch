# AppKittie onboarding captures (Nov 18, 2026)
Endpoint: `GET /api/v1/onboarding/screens` (1 credit per app; 10 credits used). Contact sheets in `appkittie-onboarding/`.

| App | Screens | What they do | What we took |
|---|---|---|---|
| **Feenko** | 25 | Logo-cloud hero; reviews wall; real list and detail product shots; quiz (how many subs / how many you use); "Did you know? 8.3 unwanted subs", "$1,416 a year"; early paywall as a checklist; 6-step feature tour; notification ask with a checklist; email connect with 3 trust lines; **"Quick one, why not now?" exit sheet**; source picker ("Bills from email / Bank & card / Browse / Enter manually") | Exit sheet that routes each answer to a fix; checklist paywall; source picker with all options |
| **Subpilot** | 16 | Dark quiz funnel (age, which subs as chips, how often you check, trials); FTC stat chart; "one surprise charge is a warning sign"; email gate; personalised "people like you have 11"; with/without comparison; paywall monthly $24.99 or weekly | The money-gap hook, but sourced and short; skip the quiz and email gate |
| **Orbit** (closest rival) | 11 | Welcome; "On average we overspend ₹1,20,000 a year on forgotten subs" + "Show me an example"; pick list with prices → "See my yearly total"; "How many others are you paying for quietly?"; notification ask; import options (photos, file, custom); laurels + "customers save ₹20,000"; Free vs Plus table; lifetime early-bird $24.99 on close | The money-gap stat slide; keep pick-list → total |
| **Rocket Money** | 13 | Welcome product shot + "$1.3 billion saved · 186K+ 5-star ratings"; account creation; notification ask with "Tap Allow on the next screen" arrow | Product-shot welcome; "Tap Allow" arrow (already in v16) |
| Subtrack, ReSubs, SubTracky, Cancel Subscriptions & Refund | 5–11 | Simpler feature carousels and paywalls | — |

Not copied: fake urgency, weekly-first plans, email gates before value, unearned social proof (we add ratings only once they're real).

## Top-earning finance paywalls (AppKittie, `label=paywall`, Finance, by revenue; 15 credits)
Contact sheet: `appkittie-onboarding/fin_paywalls.jpg` (LifeLock, Settlemate, Cashably, CoinKeeper, Collect, Subpilot, Wallet, ClaimHunt, Mobills, Spending Tracker, Smart Receipts, Trade AI, Hammer).
- **A trial timeline is the norm among the top earners:**
  - Mobills: Today / In 5 days reminder / In 7 days charge
  - Smart Receipts: Today / Day 5 reminder / Day 7 plan begins, plus a "Remind me before trial ends" toggle
  - Trade AI: "How your free trial works"
  - Cashably: "14-day free trial, then…"
- **Yearly is pre-selected and marked "Most popular"** almost everywhere. Lifetime appears as one card (Wallet $49.99, CoinKeeper $49.99 forever).
- **Social proof** (laurels, ratings, download counts) sits near the plans in about half of them. We add it only once it's real.
- **Tricks we skip:**
  - per-week price framing ($0.96/week)
  - "SAVE 75%" against weekly anchors
  - "Limited time offer, price will increase soon"
  - trial toggles (Trade AI; Apple rejects these now)
- Applied to v16 screen 7: the timeline with real dates, the reminder promise, yearly pre-selected, and lifetime as the 3rd card.
