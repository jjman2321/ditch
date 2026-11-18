# Quit pond: which focus, and quit app or GLP-1? (Nov 18, 2026)

Builds on `quit-pond-deep-2026-11-18.md`, `quit-focus-2026-11-18.md`, `quit-pet-2026-11-18.md` and `open-ideas-2026-11-18.md` (not repeated).
**Method:** AppKittie (111 credits: 9 keyword scores, 10 country splits, 4 app details incl. Meta ad audiences, 3 30-day histories, 1 search), one DataForSEO call (Google US, 34 keywords, $0.016), App Store review RSS (~1,450 recent US reviews across 9 apps), web search.
**Caveats up front:** AppKittie revenue and downloads are model estimates (ranks, not bank statements). Meta audience data covers ads seen in the UK/EU, plus AppKittie's US estimate. **Reddit was unreachable** (reddit.com blocks this environment, and web search can't index it), so community findings come from directories, studies and app reviews, not threads.

## 0. Short answer
- **Lead with alcohol, not nicotine.** Pitch it as "count your dry days, quit or cut back". The pond's never-resetting "days off" total is already a dry-day counter, the same loop as Tipple, the only pet app making real money.
- **Why the flip:** nicotine is easier to rank for, but it's a small pool of the worst payers (young men; pouches earn ~$0.25 per download). Alcohol has ~8× the money, and its payers are women aged 25–44, a near-exact match for our 23–40 target. On honest soft paywalls the two earn about the same per download, so the bigger, better-fitting pool wins.
- **The pet doesn't make people pay; the paywall does.** Tipple's ~$10 per download comes from a hard paywall at $99.99, not the pet. Pet apps with softer or cheaper paywalls earn $0.20–0.80 per download. The pet helps retention and marketing.
- **An honest Tipple earns ~$20–30k a month, not $124k.** That's the realistic ceiling to plan around.
- **GLP-1 is plan B, scored lower than before (6.5, was 7.5).** The cute-companion slot is already taken: MeAgain's capybara gets fond mentions in 15 of its last 200 reviews, and DreamMe has a pet fish. Newcomers earn $0.60–1.50 per download, and users skew 50–64.
- **Don't plan a title swap at week 6–8.** Pick the lead with the 2-week demand test before building. Then use custom product pages and a small Apple Search Ads test.

## 1. Money by focus (est. per month, US-weighted)
| Focus | Pool (sum of leaders) | $/download, leaders | $/download, comps like us (soft paywall or new) | Prices people accept | Country split (top app) |
|---|---|---|---|---|---|
| **Alcohol, quit + cut back** | **~$670k**: I Am Sober $242k, Reframe $204k, Tipple $124k, Sober Time $25k, Loosid ~$24k, Sunnyside $20k, Sober $16k, Sobo $15k | Tipple 10.2, Sunnyside 13.9, Reframe 5.0 | I Am Sober 1.09, Sober Time 1.94, Sober 1.96, Sobo 0.80 | $39.99 (I Am Sober) to $59.99–119.99/yr (Tipple, Reframe, Sobo); $19.99–24.99/mo | I Am Sober US 60 / GB 10 / CA 8 / AU 4; Reframe US 74 / CA 8 / GB 8 / AU 6; Tipple US 85 / GB 9 / CA 5 |
| **Vaping** | ~$80k: QuitSure $35k (shared with smoking), Quit Vaping $19k, Escape $8k, Puff Count $7k, NoPuff $6k, QuitVape $5k | QuitSure 11.3, Quit Vaping 2.45 | Escape 0.92, NoPuff 0.67, QuitVape 1.43, Puff Count 1.70 | $19.99–99.99/yr, many "why pay" complaints | Quit Vaping US 73 / CA 10 / GB 9 / AU 4 |
| **Pouches (Zyn/snus)** | ~$5k: Quitty $1.9k, Snusless $1.8k, Snuuze $1.1k, Pouchly $0.5k | 0.37 | 0.06–0.37 | — | no data (too small) |
| **Cigarettes** | ~$130k in the West. **Smoke ($62k) is 100% China**, so leave it out | Smoke Free 3.64, Kwit 2.33 | Tobakko 1.28, Get Healthy 1.25 | $29.99 to $209.99 lifetime | Smoke Free's UK ads reach **45% aged 65+** |
| **Weed** | ~$28k: Grounded $13k, Quit Weed $10.5k, KLAR $2.4k, Odessa $2.3k | 1.41–1.55 | 0.53–0.57 | $39.99/yr | Grounded US 65 / CA 12 / GB 9 / AU 4 |
| **"Sober curious" / drink less only** | Reframe + Sunnyside; small new apps ~$0–2k | 5.0 / 13.9 | Drink Less 0.40, Sipwise 0.37 | Reframe up to $119.99 | as Reframe |
| **Multi-habit "ditch anything"** | Days Since $49k is the outlier; Try Dry $4.6k, iQuit $1.4k | 0.99 | 0.23–1.56 | — | — |
| *GLP-1 (for §4)* | *~$1.17M: MeAgain $581k, Shotsy $366k, Monju $156k (Brazil), Pep $32k, DreamMe $16k, Glapp $10k* | *8.42 / 12.0* | *Pep 1.50, Glapp 0.64, DreamMe 0.59* | *$39.99–119.99/yr, up to $24.99/mo* | *MeAgain US 96; Shotsy US 71 / GB 9 / CA 5 / DE 4* |

Sources: AppKittie list and detail endpoints, country splits `ak/q5_ctry_*`. **Germany is ≤4% everywhere**, so launch English-only (US/UK/CA/AU).
- **Trial-to-paid by habit isn't public.** The category median (Health & Fitness, [RevenueCat 2026](https://www.revenuecat.com/state-of-subscription-apps-2026/)): 6.9% of downloads start a trial and 37.7% of trials pay. Hard paywalls turn 10.7% of downloads into payers vs 2.1% for freemium. **That ~5× gap is the cost of our honesty rules**, and it explains most of Tipple vs I Am Sober.

### Who actually pays (audience)
- **Alcohol: women 25–44.**
  - Tipple's ads reach 68% women, and 68% of the reach is aged 25–44 (AppKittie Meta transparency, US + UK).
  - Reframe reaches 12.8M people in the US, 47% women, 77% aged 25–44, on an estimated ~$272k of US Meta spend (plus ~$75k UK).
  - Women are cutting back fastest: drinking among women fell 11 points to 51% ([Gallup via Semafor](https://www.semafor.com/article/08/12/2025/fewer-americans-are-drinking-poll-finds); 54% of US adults drink, a record low).
- **Nicotine: young men.**
  - Pouches: 72% of users are men and 47% are under 25 ([UCL/Lancet Public Health](https://ucl.ac.uk/news/2025/dec/nicotine-pouch-rise-driven-young-men)).
  - US current use is 4.3% for men vs 1.3% for women ([UC](https://www.uc.edu/news/articles/2026/10/n21439716.html)).
  - Vaping peaks at ages 18–24 ([CDC NHIS](https://www.cdc.gov/nchs/products/databriefs/db524.htm)).
  - That's below and outside our 23–40 core, and wellness apps earn least from it (pouch apps: $0.06–0.37 per download).
- **Cigarettes: older.** UK ads reach 45% people aged 65+, which is off-target.
- **GLP-1: older.** Current use is 4% at 18–29, 11% at 30–49 and **22% at 50–64** ([KFF](https://www.kff.org/public-opinion/poll-1-in-8-adults-say-they-are-currently-taking-a-glp-1-drug-for-weight-loss-diabetes-or-another-condition-even-as-half-say-the-drugs-are-difficult-to-afford/)).

## 2. User research
### Community size and rules (Reddit itself blocked; directory figures are approximate)
| Group | Size | Self-promotion | Use for us |
|---|---|---|---|
| r/stopdrinking | ~734k ([Hive Index](https://thehiveindex.com/topics/sobriety/)) | **"No promotion of any kind"** ([FAQ](https://lr.in.psf.lt/r/stopdrinking/wiki/index)) | Listening only. Its own day-counter **badges** show that counting days is culturally accepted ([Recovery.com](https://recovery.com/resources/one-communitys-fight-to-stop-drinking/)) |
| r/Sober | ~95k (Hive Index) | not verified | listening |
| r/leaves (weed) | ~436k, conflicting figures ([Hive Index](https://thehiveindex.com/communities/r-leaves/)) | not verified | listening |
| r/stopsmoking | ~101k, undated ([Everlast](https://everlastrecovery.com/?p=6381)) | not verified | — |
| r/QuitVaping, r/QuitZyn, r/dryalcoholics, r/sobercurious | no reliable current counts (r/QuitVaping was 4.7k in 2021, [JMIR](https://www.jmir.org/2021/10/e28303/)) | not verified | — |
- **Takeaway:** recovery subreddits are support groups that remove promotion. They aren't a launch channel for any focus. Shotsy's Reddit-led growth (GLP-1) has no quit-app equivalent we can count on.

### What people want and hate (recent reviews, US)
- **Billing anger dominates every low review.** Paywall or charge words appear in 14–21 of the 1–3★ reviews per app.
  - Tipple: 27 of its 29 written reviews are 1–3★, mostly "no reminder, charged $99, no refund", although its overall rating is 4.6.
  - Reframe: "tricked into a $150 coaching subscription", hard to cancel.
- **"Why pay to count days?"** comes up most in nicotine apps:
  - Quit Vaping: "you're replacing [the vape] by spending it on this app"; "tells you you're saving $ then charges $20 a month"
  - I Am Sober: "If I'm going to quit nicotine why do I have to pay?"
  - Grounded: "moving the community behind a paywall".
  - Alcohol users complain about *price and tricks*, not about paying at all. Sobo, Tipple, Reframe and I Am Sober all have paying 5★ reviewers.
- **The counter is the core.** "I just want to see the number of days grow" (I Am Sober). Community is the #2 praised feature (30–51 mentions per 200 reviews for I Am Sober, Reframe and Quit Vaping). We have no community.

### Is a pet wanted, or seen as childish?
- **Reviews: wanted, not mocked.**
  - Sobo: "on my longest streak because of the cute little sobo… I don't wanna let him down"; "the cute little guy is a bonus"; "It's korny but… checking in with yourself".
  - MeAgain: "the cute Capybara… so he is not sad".
  - Finch: 56 of 200 reviews mention the pet, and 1 says "Juvenile".
  - Tipple's pet complaints are about the game *running out* ("camp fully upgraded after a week", "unlucky spins"), never about it being childish.
- **Study signal:** in a gamified alcohol app, men chased the score while women found the game repetitive ([PMC 2026](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12874785/)). That means content depth matters more for the women who pay.
- **Not verified:** whether r/stopdrinking mocks gamification. Assume a vocal minority will. Keep the duck kind and quiet: no confetti on day 1, no streak-shaming.

## 3. Is the pet proven to matter?
| App | Model | $/download | Rating trend | Pet in reviews |
|---|---|---|---|---|
| Tipple (pet, May 2026) | **Hard paywall** $99.99/yr, 7-day trial, VC-backed (reportedly ~$4.7M seed, [CB Insights](https://www.cbinsights.com/company/tipple-1/financials), match unconfirmed) | **10.2** | 4.57 → 4.60 in 30 days; ratings 421 → 779; revenue $92k → $124k | rare: billing dominates |
| Reframe (coaching, no pet) | Hard-ish, $59.99–119.99/yr, upsells coaching; heavy Meta spend | 5.0 | −0.14 in 90 days; downloads −33% | n/a |
| I Am Sober (counter + community) | Free core, Pro $39.99 | 1.09 | flat 4.9; downloads −30% in 90 days, revenue +15% | n/a |
| Sobo (pet + AI chat) | Hard paywall, $4.99/wk to $99.99/yr | 0.80 | revenue +270% and downloads +46% in 90 days | warm |
| DreamMe (GLP-1 pet fish) | Thin free tier, sells Pearls | 0.59 | growing (+52% downloads in 90 days) | some |
| sobagotchi, DryDog, Breezling (pet clones) | various | 0–0.22 | 0–3 ratings | — |
| Finch (self-care pet, outside quitting) | Soft paywall, $34.99–69.99/yr | 3.34 | 4.95, stable | 56/200, very warm |
- **Verdict:** apps with a pet range from $0 to $10 per download, depending on the **paywall, price and ad budget**, not on whether there's a pet. Pet apps do show **unusual attachment** (Finch D1 54% / D7 37%, about 2× the category; [Deconstructor of Fun](https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl)) and give good **video hooks**.
- **Implication:** treat the pet as a retention and growth asset. Don't build a revenue plan on it. No study isolates the pet's effect on payment.

## 4. Devil's advocate
### Strongest reasons not to build the quit pond
1. **Honest-paywall ceiling.** Comparable apps earn $0.80–2.00 per download. $10k a month needs 5–8k downloads a month: Sober Time's scale after 10 years and 43k ratings.
2. **Distribution is bought.** Reframe spends ~$350k+ on Meta (est.); Tipple is VC-funded. The recovery subreddits ban promotion, and organic TikTok views per post are falling (−31% YoY).
3. **Copycats and "spam" review.** Five pet clones since 2025 earn ~$0. Apple can reject crowded-category apps under 4.3 (a reviewer hinted at this for a nicotine app, [Apple forums](https://developer.apple.com/forums/thread/726104)).
4. **Content treadmill.** A 365-day pond, ~260 art assets, monthly drops. If updates stop, it "runs out" like Tipple.
5. **Health and safety.** Apple 1.4.1 rejections hit even wellness apps ([forum](https://developer.apple.com/forums/thread/807508)). Alcohol withdrawal can be dangerous; vulnerable users; 18+ rating.
6. **Trademark in the title.** "Zyn" is a brand (Swedish Match/PMI). "Quit Vaping & Zyn" is a legal risk. Rivals use it, but don't copy that.
7. **Opportunity cost.** Ditch (the subscription tracker) is close to TestFlight. A second half-built app splits a part-time solo maker.
8. **The pet isn't proven to raise payment** (§3).

### GLP-1 duck vs quit pond, head to head
| | Quit pond, alcohol lead | GLP-1 duck |
|---|---|---|
| Money pool | ~$670k | ~$1.17M |
| $/download, leaders vs newcomers | 5–10 (hard paywalls) vs 0.8–2.0 | 8–12 vs **0.6–1.5** |
| Winnability | 3 entrenched leaders + Tipple/Sobo pets; the honest angle is open | MeAgain (41k ratings) and Shotsy (35k); **pet slot taken** (Capy, DreamMe) |
| App Store keywords | "sober" 89/29, "quit drinking" 45/17, "sobriety counter" 22/10 | "glp-1" 81/30, "ozempic tracker" 27/11 |
| Google US/mo | "how to stop drinking alcohol" 8.1k, "dry january" 74k in Jan | "glp-1" 823k (+47%), "glp-1 tracker" 480, "ozempic tracker" 40 |
| Organic growth | weak (subreddits ban promotion); TikTok and search | proven: Shotsy grew with no ads ([RevenueCat](https://www.revenuecat.com/blog/growth/aja-beckett-shotsy-launched-podcast-2025)) |
| Audience fit (23–40) | strong (women 25–44) | weak (50–64 peak) |
| Build effort | heavy: game, art, 365 days of content | lighter: dose log, site rotation, charts; reminder engine reused; little art |
| Risk | 1.4.1, alcohol safety | higher: medication, 1.4.1, drug trademarks, market shifts (pills, pricing) |
| Brand fit (duck, voice) | strong | medium; "Ditch" is a bad fit |
| **Score** | **7.5** | **6.5** |

## 5. ASO and SEO by focus
**App Store, US (AppKittie popularity / difficulty; higher popularity = more searches, lower difficulty = easier):**
- **Alcohol:** "sober" 89/29 · "quit drinking" 45/17 · "alcohol free" 34/16 · "sobriety counter" 22/10 · "dry january" 12/8 (measured in Nov; it peaks in Jan) · "quit drinking app" 8/8.
- **Nicotine:** "quit vaping" 83/28 · "quit smoking" 83/32 · "quit nicotine" 75/25 · "stop smoking" 70/27 · "quit zyn" 66/24 · "quit snus" 29/15 · **"nicotine pouches" 20/10**.
- **Weed:** "quit weed" 42/17.
- **GLP-1:** "glp-1" 81/30 · "ozempic tracker" 27/11.
- **Pouch caveat:** Google's 110k a month for "nicotine pouches" is buyers. App Store interest in quitting pouches is small.

**Google US/month (DataForSEO, Nov 2026; 12-month vs prior 12 where reliable):**
- **Nicotine and weed:** "nicotine pouches" 110k · "nicotine withdrawal" 18.1k · "quit vaping" 9.9k (yoy +124%) · "weed withdrawal" 6.6k · "stop smoking" 6.6k (−46%) · "quit nicotine" 3.6k · "quit zyn" 1.6k · "quit vaping app" 1.6k (+165%) · "how to quit zyn" 1.3k · "vape withdrawal" 1.3k · "quit weed app" 140.
- **Alcohol:** "dry january" 9.9k (74k in Jan) · "how to stop drinking alcohol" 8.1k · "reframe app" 4.4k · "i am sober app" 3.6k (+45%) · "sober app" 2.9k · "sober curious" 2.4k (−41%) · "quit drinking" 2.4k · "alcohol free" 2.4k · "sobriety counter" 1.3k · "sober tracker" 720 · "quit drinking app" 590 · "drink less" 210.
- **GLP-1 and pets:** "glp-1" 823k (+47%) · "finch app" 22.2k · "glp-1 tracker" 480 · "ozempic tracker" 40 · "tipple app" 50 (+517%).
- **Read:**
  - Nicotine wins on Google (website content: withdrawal guides).
  - Alcohol wins on the App Store head term ("sober") and in January.
  - "Sober curious" is shrinking as a search term even as drinking falls. People don't search the label.

## 6. Final call (scores /10; money weighted most)
| Rank | Option | Money | Winnable | Organic | Fit | Effort | Risk | **Overall** |
|---|---|---|---|---|---|---|---|---|
| 1 | **Quit pond, alcohol lead: dry days, quit or cut back** | 8 | 6 | 6 | 9 | 5 | 5 | **7.5** |
| 2 | GLP-1 duck companion | 7.5 | 5 | 8 | 5 | 7 | 4 | **6.5** |
| 3 | Quit pond, nicotine lead (vape + pouches) | 5 | 8 | 7 | 6 | 5 | 6 | **6.0** |
| 4 | "Sober curious" / drink-less only | 5 | 4 | 4 | 8 | 5 | 6 | **5.0** |
| 5 | Multi-habit "ditch anything" lead | 4 | 5 | 5 | 7 | 5 | 6 | **5.0** |
| 6 | Cigarettes lead | 5 | 5 | 5 | 3 | 5 | 6 | **4.5** |
| 7 | Weed lead | 3.5 | 7 | 5 | 5 | 5 | 6 | **4.5** |

**Recommendation:** build the quit pond, **lead with alcohol**, and keep vape, pouches and weed as custom product pages inside the same app. Still run the 2-week demand test (alcohol vs nicotine vs GLP-1 waitlist pages) before writing code.

**Rough money (gross per month at month 12, honest soft paywall, $49.99/yr):**
| Lead | Base case | Bull case |
|---|---|---|
| Alcohol | ~3k downloads × $1.75 ≈ **$5k** | ~13k downloads × $2 ≈ **$26k** (an honest Tipple) |
| Nicotine | ~4k downloads × $1.20 ≈ **$4.8k** | ≈ Quit Vaping's **$19k**, the top of its category |
| GLP-1 | **$3.2k** (earlier estimate, net) | $25k |

Alcohol's edge is the ceiling and the fit, not a sure win.

**Store listing (alcohol lead; 30-character limits; names still need a lawyer):**
| Title | Subtitle | Score |
|---|---|---|
| **"Puddle: Sober Counter & Pet"** (27) | "Quit or cut back. Grow a pond." (30) | **8.5, pick** |
| "Puddle: Quit Drinking Tracker" (29) | "Count dry days. Grow a pond." (28) | 7 |
| "Puddle: Sobriety Pet" (20) | "Dry days grow your duck's pond" (30) | 7.5 |
- **Keyword field:** `sobriety,alcohol,free,dry,january,days,drink,less,quit,vape,vaping,nicotine,snus,weed,habit,duck,streak`.
- **Product pages:** a default alcohol page, plus "quit vaping / quit nicotine / quit snus" and "quit weed" pages. No "Zyn" in the title.
- **Price:** start at $49.99/yr with a 7-day trial and reminder. Alcohol users accept $59.99–99.99, so A/B test $59.99 later. $99.99 lifetime.

**What would change the answer:**
- **Lead with nicotine instead** if the nicotine page gets ≥1.5× alcohol's sign-up rate *and* ≥25% say "I'd pay $49.99".
- **Build GLP-1 instead** if the GLP-1 page beats alcohol by ≥1.5× on sign-ups. Its organic path is proven, and the build is lighter.
- **Pick nicotine for safety** if the owner isn't comfortable carrying alcohol-withdrawal safety content for a vulnerable audience.
- **Our edge shrinks** if Tipple or Sobo add trial reminders and a free tier.
- **Don't build any of these** if the demand test fails (<5% sign-ups or <100 sign-ups). Then finish and launch Ditch first.

**Spend:** AppKittie 111 credits (log 692 → 803; CAP 725 → 812); DataForSEO $0.016 (1 call); reviews, iTunes and web search free. Cached data: scratchpad `ak/q5_*`, `q5rss/`, `dfs_q5.json`.
