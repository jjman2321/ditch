# Plan cards: what to write on each one

Written Nov 9, 2026. Prices stay as they are: **Yearly $29.99 with a 7-day free trial (pre-selected), Monthly $4.99, Lifetime $49.99.** This note is only about the words on the three plan cards.

**Other countries, in one line:** Apple's automatic price matching (equalization) sets local prices in every other country from the US price for now. The cards must show the store's own price text and work out savings from those live prices, never a typed "$" or a fixed "49%".

---

## The short answer

| Card | Main price (biggest) | Small line under it | Badge |
|---|---|---|---|
| **Yearly** (pre-selected) | **$29.99/yr** | $2.50 a month | "7 days free" pill next to the name + a **"Save 49%"** tab on the card's top edge |
| **Monthly** | **$4.99/mo** | No free trial | none |
| **Lifetime** | **$49.99** | Pay once | none |

- **Drop "$59.88 a year" from Monthly.** The owner is right. Only 2 of the ~20 paywalls I checked do it (Monarch, Calm). The "Save 49%" tab now does the job of showing that yearly is the deal.
- **Never "Save 50%".** 12 × $4.99 = $59.88. $59.88 − $29.99 = $29.89, which is **49.9%**. Rounding it up to 50% claims a little more than is true. **The built app says "Save 50%" today** (`src/app/paywall.tsx` line 110), so that needs fixing. `docs/research/paywalls-competitors.md` §4 also calls 50% "true". It isn't.

---

## 1. What I looked at

I checked 22 iOS paywalls on Mobbin, about half of them new for this note. The rest come from `paywalls-competitors.md`. The savings maths is mine: 12 × monthly compared with yearly. ✓ means the badge matches the maths, ↑ means it claims more than the maths, ↓ means it claims less.

| App | Yearly card | Monthly card | Lifetime card | Badge, and is it true? | Pre-selected | Link |
|---|---|---|---|---|---|---|
| Duolingo | "Individual $7.99 / MO · 12 mo • $95.99" | "Monthly $13.99 / MO" under a "NO FREE TRIAL" header | — | "MOST POPULAR" only | Individual (yearly) | [▸](https://mobbin.com/screens/222c1c4e-37cd-4aba-bfb2-4721973fac71?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) [▸](https://mobbin.com/screens/413876ac-478b-4788-a6e6-d6950029cf14?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Calm | "Individual Yearly $91.98/yr. ($7.67/mo.)" | "Monthly $19.98/mo. **$239.76/yr.**" | — | "Save 56%" ↓ (real 61.6%) | Yearly | [flow](https://mobbin.com/flows/38549b00-2fe8-4fd1-914b-13c4905db245?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Monarch | "$99.99 / year — $8.33 per month, billed yearly" | "$14.99 / month — **$179.88 per year**, billed monthly" | — | "SAVE 44%" ✓ | Yearly | [▸](https://mobbin.com/screens/648acdda-e963-4f0d-b98d-e32dca5ccdd8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Headspace | "First 14 days free, then $69.99 ($5.83/month)" | Annual/Monthly switch | — | none | Annual | [▸](https://mobbin.com/screens/a9bf58c3-250a-4565-9808-c4722933ea54?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Cal AI | "Start for free & save 75% · $39.98 billed annually", with "$3.33/mo" on the right | "Monthly $14.98/mo" | — | 75% ↓ (real 77.8%), on a "3 DAYS FREE" tab | Yearly | [▸](https://mobbin.com/screens/b730224e-cacd-450a-98b4-74cb2be349e7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Strava | "Annual · Billed at S$69.98/year (S$5.83/month)" | — | — | "Save up to 60%" on a bundle, with the footnote "Savings calculated based on separate monthly Strava and Runna subscriptions." | Annual | [▸](https://mobbin.com/screens/55cdf1b4-a36a-4ee3-8981-7b50f38951e3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) [▸](https://mobbin.com/screens/5b6f970d-d70f-4241-a915-b20388efc1aa?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Copilot | "1 month free trial · Then $95 per year of service" | behind "All Plans" | — | Tab "Only $7.92 a month" | Yearly | [▸](https://mobbin.com/screens/b6ba77c0-7d8f-423e-8453-9db2a97f8035?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Blinkist | "7 days free, then $199.98 per year", then **bold "Only $16.66 / month"** | — | — | none. The monthly figure is bigger than the billed price, which breaks Apple's rule | Yearly | [▸](https://mobbin.com/screens/1c74c6aa-ae67-4bdf-811f-9019e3ad8564?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Hevy | "$23.99 · Billed annually" | "$2.99 · Billed monthly" | "$74.99 · Pay once" | "SAVE 33%" tab ✓ | Yearly | [▸](https://mobbin.com/screens/19fce77b-a3e7-428c-857c-79aa00fbe716?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Bloom | "$59.99 · $1.15/week · Billed yearly · 7-day free trial" | "$9.99 · $2.49/week · Billed monthly · **No trial**" | "$99.99 · Billed once · Bloom for life · No trial" | "Most Popular" tab | Yearly | [▸](https://mobbin.com/screens/db6e7f44-adcb-48a5-a585-48df56e93efe?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Buddy | "12 MONTHS $71.98 · $1.38 / week · 7 days free" | "1 MONTH $13.98 · $3.23 / week" | "UNLIMITED $149.98 · One-off" | "SAVE 57%" tab ✓ | Yearly | [▸](https://mobbin.com/screens/d81d0d25-b0c2-4138-a32e-759950886662?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Joi | "Annual S$39.98" | "Monthly S$6.98" | "S$89.98 · Pay once, use forever" | "-52%" ✓ | none shown | [▸](https://mobbin.com/screens/f534ccc2-5c15-4ef1-b50c-b823dd786fa6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| FocusFlight | "$18.99 · US$1.58/mo." | "$3.99" | "$33.99 · Pay once." | "-60%" ✓ | Annual | [▸](https://mobbin.com/screens/01e0b4d2-a045-47e0-a67d-37b3470e72f2?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Tide Guide | "Yearly S$28.98 · 1 Week Free" | "Monthly S$5.98" | "S$199.98" | "SAVE 17%" ↓ (real 59.6%) | Yearly | [▸](https://mobbin.com/screens/0a7fe4f5-58f1-46f5-a498-af07baa409fe?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Brink | "S$9.98 · Billed yearly" | "S$0.98 · Billed monthly" | "S$69.98 · Billed once" | "Best value" | Yearly | [▸](https://mobbin.com/screens/94cdf6cd-939e-4a80-80b0-c708b098130d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| The Outsiders | "S$59.98 /year" | "S$7.98 /month" | "S$99.98 /once" | "BEST OFFER" | Annual | [▸](https://mobbin.com/screens/65112b07-4e73-4a48-a3f5-0a83e895108e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| timespent | "$19.98 · Commit to your goals for a year, save 70%" | "$5.98 · Flexible month-to-month subscription" | "$59.98 · One-time purchase, lifetime access" | 70% ↓ (real 72%) | Yearly | [▸](https://mobbin.com/screens/c9098dc0-df20-49c8-9ff0-3720857cee3a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Plex | "$57.98 · Extra Savings" | "$6.98 · Most Popular" | "$199.98 · Pure Dedication" | none | Monthly | [▸](https://mobbin.com/screens/579c0b00-dfb7-434d-a987-c8903866ddfc?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| pillowtalk | "annual (50% off) S$129.98 per year" | "S$19.98 per month" | "…your gift for limited time only" | **50% ↑ (real 45.8%)**, plus fake urgency | Annual | [▸](https://mobbin.com/screens/4139d31a-e861-4982-b075-7e8d5ffd1468?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| mymind | "$129.00 YEARLY" | "$12.99 MONTHLY" | — | **"SAVE ~20%" ↑ (real 17.2%)** | Monthly | [▸](https://mobbin.com/screens/73d7e7d9-ef3b-431f-9970-ffc70f2a3c43?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| ABY Journal | "S$129.98 yearly / just S$10.83 monthly" | weekly S$5.98 | "S$249.98 one time payment" | "58% OFF" ✓ (vs weekly) | Yearly | [▸](https://mobbin.com/screens/65f1ef09-8067-43b6-a2d0-2210febda055?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Sunlitt | "Yearly $14.98 /year" + trial toggle | "$2.98 /month" | "$129.98" | "BEST VALUE". The trial toggle is the kind Apple now rejects | Yearly | [▸](https://mobbin.com/screens/1be71829-fa39-4b78-a3c9-c2726c2ef26f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) |

### What the screens show
1. **The yearly card usually shows a per-month (or per-week) price** (13 of 22). The good ones put it under the billed price: Monarch, Calm, Headspace, Strava, Copilot. Blinkist makes the per-month price the big number, which breaks Apple's rule.
2. **A savings badge sits on the yearly plan in 13 of 22.** Every one uses a **percent**. None uses a dollar amount. Wording: "Save X%" (Monarch, Hevy, Buddy, Calm, Tide Guide), "-X%" (Joi, FocusFlight), "X% off" (pillowtalk, ABY).
3. **Badges are often wrong.** Of the 12 I could check, 6 matched the maths. 4 claimed less than the truth (Calm, Cal AI, Tide Guide, timespent). 2 claimed **more** (pillowtalk says 50% when it's 45.8%; mymind says "~20%" when it's 17.2%). Rounding up is exactly the mistake Ditch should not make.
4. **Showing the monthly plan's yearly cost is rare.** Only Monarch and Calm do it. Most monthly cards show only the price, or a fact about the plan: "Billed monthly" (Hevy, Brink), "No trial" (Bloom), "Flexible month-to-month subscription" (timespent).
5. **Trial labels go on the plan that has the trial.** Some apps put it on the card ("7 days free" Buddy, "1 Week Free" Tide Guide, "7-day free trial" Bloom). Others group plans under headers ("7 DAY FREE TRIAL" / "NO FREE TRIAL" in Duolingo, Calm). Bloom also writes "No trial" under monthly and lifetime.
6. **Yearly is pre-selected or highlighted in 19 of 21** where a choice shows. The exceptions are Plex and mymind (Duolingo's "all plans" screen shows monthly ticked after a tap; Joi shows none).
7. **When there's a lifetime plan, it goes last**, with "Pay once" (Hevy, FocusFlight, Joi), "Billed once" (Brink, Bloom) or "One-off" (Buddy).

---

## 2. What the data says

There's no clean public A/B test for each of these questions. Here is what exists, from strongest to weakest.

| Question | Evidence | What it means for Ditch |
|---|---|---|
| Show the yearly plan's per-month price? | **Mojo** (RevenueCat Sub Club podcast): adding "a small line next to our yearly plan" with its per-month price, next to a pricier monthly plan, gave a **"10% lift in your revenue"** in the US and **"30 to 40 percentage"** in Brazil and Mexico. ([transcript](https://share.transistor.fm/s/3a7b25ee/transcript.txt)) | Keep "$2.50 a month". It's the best-backed line on the card. |
| ...but which price gets top billing? | **Apple:** the billed amount "must be the most prominent pricing element"; any breakdown goes "in a subordinate position and size" (Apple's subscriptions guidance, quoted in `paywalls-competitors.md` §0). Adapty's 100 top paywalls: **62%** show the full yearly price, **24%** a monthly breakdown, **4%** a weekly one. ([Adapty, Nov 1 2026](https://adapty.io/blog/paywall-optimization-tests/)) | $29.99/yr big, $2.50 small. That's what we have. |
| A savings badge? | Adapty, 100 top paywalls: savings show as a **"Save X%" badge in 41%**, and as a struck-through price in only 16%. Among paywalls with no trial, 56% use the badge. ([Adapty](https://adapty.io/blog/paywall-optimization-tests/)) | A badge is normal. A struck-through price is out anyway (our prices never were higher). |
| Percent or dollars? | I found no paywall test. A well-known pricing rule of thumb (Jonah Berger's "Rule of 100") says that under $100, a percent looks bigger than the same saving in dollars. Online-store tests point the same way, but they're shop pages, not paywalls: Bluestout found **+27.1%** for percent over dollars ([link](https://bluestout.com/cro-wins/we-rejected-best-practices-saw-a-27-conversion-boost/)). "49%" also feels bigger than "$29". | Use a percent. |
| Pre-select yearly? | Adapty: **67%** of top paywalls pre-select yearly. Putting yearly first with the trial on it raised money per user by **25–40%** in winning tests. Most people keep whatever is pre-selected (46% for yearly, 90% for weekly). ([Adapty](https://adapty.io/blog/paywall-optimization-tests/)) | Keep yearly pre-selected. |
| Show lifetime? | Adapty: placed next to yearly, lifetime lifted revenue **10–15%** in winning tests. Lifetime usually costs **1.3×** yearly (ours: 1.67×). ([Adapty](https://adapty.io/blog/paywall-optimization-tests/)) | Keep it third. |
| Plans as equals? | Dark Noise (RevenueCat, 2024, cited in `paywalls-competitors.md`): showing all plans as equals raised conversions ~10%, but yearly fell 30% and churn rose 57%. | Keep the yearly card visibly special (thicker border plus the tab). |
| Does the wording on the cards matter much? | Adapty (Mar 2026): tests of visuals or wording win on lifetime value only **34.6%** of the time, against 57–60% for plan count, plan length and trial setup. ([Adapty](https://adapty.io/blog/high-performing-paywall-2026/)) | Don't overthink the wording. Get the structure right, then test. |

### Does "$59.88 a year" on Monthly help, or is it clutter?
- **The case for it:** it proves the saving right there on the screen, and a subscription tracker is all about yearly totals, so it fits the brand. Monarch and Calm, both big money apps, do it.
- **The case against it:** 20 of 22 paywalls don't. It makes the cheaper-looking card the busiest one. And once a true "Save 49%" sits on the yearly card, it repeats the same message.
- **Verdict:** mostly repetition. Drop it, as the owner asked. If an A/B test later shows yearly uptake falling, it's the first thing to bring back.

---

## 3. Options

### 3a. The savings badge on the yearly card
| Wording | Conversion /10 | Honesty /10 | Notes |
|---|---|---|---|
| "Save 50%" (in the app today) | 8 | 3 | 49.9% rounded **up**. The same mistake as pillowtalk. Breaks our "no fake discounts" rule. |
| **"Save 49%"** | 8 | 10 | True (rounded down). Looks oddly exact, but odd numbers read as real numbers. **Pick.** |
| "Save $29" | 6 | 10 | True, but smaller-feeling (Rule of 100). |
| "Half the price of monthly" | 7 | 4 | False by 5¢ ($29.99 vs $29.94). |
| "Best value" | 6 | 10 | Safe but vague. Good fallback for countries where the saving is under 10%. |
| "Most popular" | 7 | 2 | We have no buyers yet, so it's unknown. Fine once data proves it. |

### 3b. The small line on the Monthly card
| Wording | Conversion /10 | Honesty /10 | Notes |
|---|---|---|---|
| "$59.88 a year" (current design) | 7 | 10 | Monarch/Calm style. The owner doesn't want it. |
| **"No free trial"** | 7 | 10 | A fact the buyer needs, because the button changes to "Subscribe for $4.99/month". Bloom, Duolingo and Calm do this. It also nudges people to yearly without pressure. **Pick.** |
| "Cancel anytime" | 6 | 9 | True of every plan, so it says nothing about this one. |
| "Billed monthly" | 5 | 10 | Repeats "/mo". |
| (nothing) | 6 | 10 | Cleanest, but the cards end up different heights. |

### 3c. The small line on the Lifetime card
| Wording | Conversion /10 | Honesty /10 | Notes |
|---|---|---|---|
| **"Pay once"** (current) | 7 | 10 | Short; the most common wording (Hevy, FocusFlight). **Keep.** |
| "Pay once. Pro for good." | 7 | 9 | Fine, but "for good" edges toward "everything forever". Leave the bank-sync note in the fine print. |
| "Billed once · no trial" (in the app today) | 6 | 10 | "Billed" sounds like a bill. Fine but colder. |

### 3d. The whole set
| Set | Yearly | Monthly | Lifetime | Conversion /10 | Honesty /10 |
|---|---|---|---|---|---|
| **A (pick)** | $29.99/yr · $2.50 a month · "7 days free" pill · **"Save 49%" tab** | $4.99/mo · No free trial | $49.99 · Pay once | **8** | **10** |
| B (current design) | $29.99/yr · $2.50 a month · "7 days free" | $4.99/mo · $59.88 a year | $49.99 · Pay once | 7 | 10 |
| C (built app today) | same as A, but "Save 50%" | $4.99/mo · $59.88 a year · no trial | $49.99 · Billed once · no trial | 8 | 4 |
| D (bare) | $29.99/yr · $2.50 a month · "7 days free" | $4.99/mo | $49.99 | 6 | 10 |

---

## 4. The pick, exactly

```
┌─[ Save 49% ]─────────────────────────────────┐   ← small tab on the top edge, only on Yearly
│ ●  Yearly  (7 days free)          $29.99/yr  │   ← billed price: biggest and boldest
│                                $2.50 a month │   ← smaller and grey
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│ ○  Monthly                         $4.99/mo  │
│                                No free trial │
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│ ○  Lifetime                          $49.99  │
│                                     Pay once │
└──────────────────────────────────────────────┘
```

**Why a tab and not a second pill:** "Yearly" plus two pills on one line wraps at large text sizes. A tab on the card's top edge (Hevy, Buddy, Bloom, The Outsiders) leaves the "7 days free" pill where it is.

### Rules for whoever builds this
1. **Prices come from the store.** Use RevenueCat's `priceString` for each plan. Never type "$".
2. **Work out the saving from the live prices, and round it down:** `floor((12 × monthly − yearly) ÷ (12 × monthly) × 100)`. US: 49. Other countries may land on 48 or 50, so let the maths decide. If the two plans are in different currencies, or the saving is under 10%, show "Best value" instead.
3. **Don't use RevenueCat's `product.relative_discount` for this.** Its docs show it rounding to the nearest whole percent (33.3% → "33%"), so ours would show "50%". ([RevenueCat docs](https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/variables))
4. **Round the per-month figure up, never down:** $29.99 ÷ 12 = $2.4992 → "$2.50". Never show "$2.49".
5. **Unit tests:** 499 and 2999 → 49; 2999 per year → "$2.50 a month"; different currencies → "Best value".
6. **Places that will need changing later** (nothing changed now): `src/app/paywall.tsx` lines 110–112 (the hard-coded "Save 50%", the monthly "$59.88 a year · no trial", and the lifetime "Billed once · no trial"); `docs/SPEC.md`'s paywall section, if it lists these lines; and `paywalls-competitors.md` §4 item D2 and its "Save 50% is true" line.
7. **First test after launch** (RevenueCat Experiments): A against B (does bringing back "$59.88 a year" lift yearly uptake?). Judge on money per user, not just taps.

---

## Sources
- Adapty, "Paywall Optimization: The Tests Most Apps Skip" (Nov 1, 2026; 100 top paywalls plus 78,000+ paywalls): https://adapty.io/blog/paywall-optimization-tests/
- Adapty, "What does a high-performing paywall look like in 2026?" (Mar 13, 2026): https://adapty.io/blog/high-performing-paywall-2026/
- RevenueCat Sub Club, Mojo episode transcript (per-month line on yearly: +10% US, 30–40% Brazil/Mexico): https://share.transistor.fm/s/3a7b25ee/transcript.txt
- RevenueCat, Mojo "60% ARPU growth in five months": https://www.revenuecat.com/blog/growth/mojo-60-percent-arpu-growth-five-months
- RevenueCat docs, paywall price variables (`price_per_month`, `relative_discount`, localized prices): https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/variables
- RevenueCat community, showing dollar savings instead of percent: https://community.revenuecat.com/general-questions-7/how-to-show-the-actual-dollar-amount-instead-of-the-percentage-on-the-saved-amount-on-yearly-subscription-6429
- Bluestout, percent vs dollar savings test (online store, not a paywall): https://bluestout.com/cro-wins/we-rejected-best-practices-saw-a-27-conversion-boost/
- Earlier Ditch research (Apple 3.1.2 wording, Dark Noise, Monarch/Calm screens): `docs/research/paywalls-competitors.md`
- Mobbin screens: linked in the table in §1.

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
