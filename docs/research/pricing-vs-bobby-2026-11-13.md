# Should we lower prices because of Bobby? (Nov 13, 2026)

The owner asked after watching Bobby: it does the same core job for $2.99 one-time, so do we need cheaper prices? Our prices are locked (DECISIONS #6, #12): $29.99/yr with a 7-day trial, $4.99/mo, $49.99 Lifetime. This note updates `pricing-competitors-2026.md` (Nov 10), with fresh Bobby reviews and RevenueCat's 2026 price-tier data.

## What's new since Nov 10
1. **Bobby fixed its notifications in v3.10.4 (Dec 2025).** Its App Store page says "Bobby now delivers more consistently". Only 9 US+UK reviews since then, which is about 1 a month, so the app is stalling. One says "Notifications no longer work" (1★, Dec 31). The rest complain about:
   - reminders being off by default, and only 1 per subscription
   - no export
   - no updates
   - purchases failing with no reply from support
   - bugs on new iPhones
   - no cycles over 30 days

   The best 5★: "Best $3 I've spent." Source: App Store RSS, US + GB, pulled Nov 13.
2. **RevenueCat 2026 (115k+ apps): pricier apps convert better, not worse.** Tiers are relative to the dataset average.

   | Price tier | Download→paid (D35, median) | Download→trial | Revenue per install (D60) | Year-1 revenue per payer |
   |---|---|---|---|---|
   | High | 2.8% | 8.9% | $0.94 | $62.19 |
   | Mid | 2.0% | 5.4% | n/a | $28.75 |
   | Low | 1.4% | 4.4% | $0.11 | $10.69 |

   The overall median yearly price is $34.80, so our $29.99 is under it. This is correlation: pricier apps also tend to be better made and better positioned. It still means there's no evidence that cutting price lifts conversion enough to pay for itself.

## The maths of a cut
At $14.99/yr (the manual-tracker median) we'd need **2× the payers** to earn the same. RevenueCat shows low-priced apps converting *worse* (1.4% vs 2.8%), not 2× better. Bobby-style $2.99 one-time would need about 10× the buyers just to match one year of a single yearly subscriber, with no money for upkeep afterwards. That's the "abandoned app" path Bobby's reviews describe.

## Options
| Option | Score | Why |
|---|---|---|
| **Keep $29.99 / $4.99 / $49.99, compete on value** | **8.5/10** | Below the RevenueCat median, mid-pack among 30 trackers, and the higher-tier data supports it. The money case is "one ditched Netflix ($239.88) pays for 8 years" |
| Keep yearly and monthly, test Lifetime $39.99 after launch | 7.5/10 | Lifetime $49.99 is at the 91st percentile (median $19.99). Test only if almost nobody buys it. Already planned |
| Lower yearly to $19.99 now | 5/10 | Matches Orbit. Needs 1.5× the payers to break even, with no evidence it brings them |
| $14.99/yr or a $2.99 one-time to match Bobby | 2/10 | Needs 2–10× the payers. Turns us into another cheap tracker with no budget to stay reliable |

## Pick
**Don't lower prices now.** Launch at $29.99 / $4.99 / $49.99 and let real data decide. After about 1,000 downloads, run the tests already planned in RevenueCat:
- Lifetime $39.99 vs $49.99
- a lower India price

Win on what Bobby users still ask for:
- reminders on by default, 2 per charge
- prices filled in for you
- cancel help
- free export
- an app that's updated and answers support
- any billing cycle (our app gap: every 2 weeks, every 6 months)

## Sources
- [RevenueCat, State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps): price-tier conversion, revenue per install and lifetime value, median yearly price
- Bobby App Store reviews, US + GB RSS (id 1059152023), Nov 13, 2026
- Bobby's App Store page, What's New 3.10.4, from the owner's screen recording
- `docs/research/pricing-competitors-2026.md`: 38 competitors, percentiles, margins
