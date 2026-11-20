# Price-hike alert: US search demand (DataForSEO, Nov 20 2026)

**Scope:** US (location_code 2840), English, Google search. Data pulled Nov 20 2026.
**Spend:** $0.0377 in total. The DataForSEO account only had **$0.04 left** (a $1 trial balance), so the cheaper DataForSEO Labs endpoints did the main work:

| Call | Endpoint | Cost |
|---|---|---|
| Phrase-match ideas for "price increase" (top 70 by volume, out of 23,645 matches) | `dataforseo_labs/google/keyword_suggestions/live` | $0.0204 |
| 40 hand-picked seeds and variants (the brief's seeds plus year/"hike" variants) | `dataforseo_labs/google/keyword_overview/live` | $0.0161 |
| Weekly relative-interest index for 5 terms, past 12 months | `keywords_data/dataforseo_trends/explore/live` | $0.0012 |

**What I couldn't run:** `keywords_data/google_ads/search_volume/live` costs $0.09 per request, and the App Store endpoints (`dataforseo_labs/apple/*`, `app_data/apple/*`) cost at least $0.012 each. Neither fit in the balance. Labs `keyword_info` volumes come from Google Ads data (the 12-month average monthly searches plus a monthly history), so the numbers below match what the Google Ads endpoint would show, though not to the digit. **No App Store keyword popularity was collected.**

**How to read the volumes:**
- Google Ads volumes are rounded into buckets (10, 20, … 880, 1,000, 1,300, 1,600 …).
- Google merges close variants into one cluster. "netflix price increase", "price increase netflix", "netflix increase price" and similar each show 14,800, so I counted each cluster **once**.
- "Vol/mo" is the 12-month average. "Median month" is the typical month without a spike.
- "Top-2 months' share" is how much of the year's searches fell in the two busiest months. High means spiky; around 20% means flat.
- Months run Nov 2025 to Oct 2026 for most keywords. Labs updates some keywords later, so their 12-month window ends in Aug or Sep 2026 (see the Window column).

## 1. Top keywords by US monthly volume (subscription-relevant, deduplicated)

I left out the non-subscription terms that the "price increase" phrase match also returned. They're big but useless to Ditch: USPS stamps (27k), "consumer price increase" (27k), gas, Switch 2, PS5, Steam Deck, RAM, the price-increase calculator, and "apple price increase" (8.1k, which spiked to 74k in Jun 2026 and is most likely about hardware). The three telecom-bill rows are kept because they're real recurring bills, but they're one-off spikes.

| # | Keyword | Group | US vol/mo (12-mo avg) | CPC $ | Comp. | KD | Median month | Peak (month: searches) | Top-2 months' share of year | Window | Endpoint |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | netflix price increase | service | 14,800 | 0.38 | LOW | 36 | 4,400 | Apr 2026: 74,000 | 73% | Nov 25–Oct 26 | Labs keyword_suggestions |
| 2 | xbox game pass price increase | service | 12,100 | – | LOW | 33 | 600 | Oct 2025: 135,000 | 96% | Oct 25–Sep 26 | Labs keyword_suggestions |
| 3 | youtube premium price increase | service | 8,100 | – | LOW | 24 | 880 | Apr 2026: 90,500 | 89% | Nov 25–Oct 26 | Labs keyword_suggestions |
| 4 | subscription manager app | tracker/app | 8,100 | 15.26 | LOW | 46 | 6,000 | Sep 2025: 18,100 | 35% | Sep 25–Aug 26 | Labs keyword_overview |
| 5 | disney plus price increase | service | 5,400 | 2 | LOW | 20 | 940 | Nov 2025: 22,200 | 68% | Nov 25–Oct 26 | Labs keyword_suggestions |
| 6 | spotify price increase | service | 5,400 | – | LOW | 23 | 2,000 | Jan 2026: 27,100 | 61% | Oct 25–Sep 26 | Labs keyword_suggestions |
| 7 | crunchyroll price increase | service | 4,400 | 2.01 | LOW | 23 | 390 | Feb 2026: 40,500 | 89% | Nov 25–Oct 26 | Labs keyword_suggestions |
| 8 | netflix price increase 2026 | service variant | 3,600 | 0.07 | LOW | 22 | 940 | Apr 2026: 14,800 | 70% | Nov 25–Oct 26 | Labs keyword_suggestions |
| 9 | at&t internet home price increase | telecom bill | 3,600 | 5.28 | LOW | 33 | 20 | Oct 2025: 40,500 | 100% | Oct 25–Sep 26 | Labs keyword_suggestions |
| 10 | verizon discount offer price increase | telecom bill | 3,600 | – | LOW | 21 | 5 | Mar 2026: 40,500 | 100% | Sep 25–Aug 26 | Labs keyword_suggestions |
| 11 | playstation plus price increase | service | 2,900 | – | LOW | 12 | 600 | May 2026: 27,100 | 78% | Nov 25–Oct 26 | Labs keyword_suggestions |
| 12 | at&t bill price increase | telecom bill | 2,900 | – | LOW | 5 | 10 | Dec 2025: 40,500 | 100% | Nov 25–Oct 26 | Labs keyword_suggestions |
| 13 | hulu price increase | service | 2,400 | 4.76 | LOW | 22 | 800 | Sep 2026: 9,900 | 67% | Oct 25–Sep 26 | Labs keyword_overview |
| 14 | apple music price increase | service | 1,900 | – | LOW | 23 | 290 | Aug 2026: 9,900 | 77% | Nov 25–Oct 26 | Labs keyword_overview |
| 15 | youtube tv price increase | service | 1,600 | 7.26 | LOW | 9 | 490 | Sep 2025: 14,800 | 76% | Sep 25–Aug 26 | Labs keyword_overview |
| 16 | subscription tracker | tracker/app | 1,600 | 14.23 | MEDIUM | 33 | 1,750 | Jun 2026: 2,400 | 21% | Oct 25–Sep 26 | Labs keyword_overview |
| 17 | apple tv price increase | service | 1,300 | 2.8 | LOW | 19 | 1,040 | Sep 2025: 3,600 | 42% | Sep 25–Aug 26 | Labs keyword_overview |
| 18 | subscription tracker app | tracker/app | 1,300 | 12.59 | MEDIUM | 46 | 1,450 | Jan 2026: 3,600 | 31% | Nov 25–Oct 26 | Labs keyword_overview |
| 19 | paramount plus price increase | service | 1,000 | 5.04 | LOW | 22 | 435 | Jan 2026: 6,600 | 62% | Oct 25–Sep 26 | Labs keyword_overview |
| 20 | spotify price increase 2026 | service variant | 880 | – | LOW | 32 | 355 | Jan 2026: 4,400 | 58% | Nov 25–Oct 26 | Labs keyword_overview |
| 21 | disney plus price increase 2026 | service variant | 590 | 0.14 | LOW | 14 | 390 | Sep 2026: 2,900 | 53% | Oct 25–Sep 26 | Labs keyword_overview |
| 22 | peacock price increase 2026 | service variant | 590 | – | LOW | 17 | 480 | Sep 2026: 1,600 | 37% | Nov 25–Oct 26 | Labs keyword_overview |
| 23 | netflix price hike | service variant | 590 | – | LOW | 24 | 260 | Mar 2026: 2,900 | 72% | Nov 25–Oct 26 | Labs keyword_overview |
| 24 | hbo max price increase | service | 480 | – | LOW | 4 | 320 | Nov 2025: 1,600 | 47% | Nov 25–Oct 26 | Labs keyword_overview |
| 25 | adobe price increase | service | 480 | 3.91 | LOW | 3 | 480 | Nov 2025: 1,000 | 27% | Nov 25–Oct 26 | Labs keyword_overview |
| 26 | amazon prime price increase | service | 390 | – | LOW | 21 | 320 | Mar 2026: 880 | 32% | Nov 25–Oct 26 | Labs keyword_overview |
| 27 | apple one price increase | service | 390 | – | LOW | 37 | 70 | Aug 2026: 2,400 | 73% | Oct 25–Sep 26 | Labs keyword_overview |
| 28 | peacock price increase | service | 390 | – | LOW | 34 | 170 | Sep 2026: 1,900 | 63% | Oct 25–Sep 26 | Labs keyword_overview |
| 29 | youtube premium price increase 2026 | service variant | 320 | – | LOW | 18 | 130 | Apr 2026: 1,300 | 61% | Oct 25–Sep 26 | Labs keyword_overview |
| 30 | price increase notification | generic | 320 | – | LOW | 0 | 320 | Dec 2025: 590 | 25% | Nov 25–Oct 26 | Labs keyword_overview |

**These seeds returned no data at all** (Labs `keyword_overview`, which means fewer than about 10 searches a month): "price hike tracker", "subscription price tracker", "notify me when price goes up", "track subscription prices", "subscription price hike", "why is my spotify bill higher".

## 2. Totals: "[service] price increase" vs generic alert/tracker queries

Source: Labs `keyword_suggestions` + `keyword_overview`, each cluster counted once.

| Bucket | Keywords | Sum of 12-mo avg vol/mo | Sum of median months (a typical month without a spike) |
|---|---|---|---|
| **"[service] price increase"** head terms | 22 (Netflix, Xbox Game Pass, YouTube Premium, Disney+, Spotify, Crunchyroll, PS Plus, Hulu, Apple Music, YouTube TV, Apple TV, Paramount+, HBO Max, Adobe, Amazon Prime, Apple One, Peacock, Microsoft 365, Sling, ChatGPT, Audible, Max) | **≈ 64,000** | ≈ 14,600 |
| Service variants ("… 2026", "… price hike", "why did my netflix bill go up") | 11 | ≈ 7,400 | ≈ 3,100 |
| **Service-specific total** | 33 | **≈ 71,400** | **≈ 17,700** |
| **Generic price-hike alert/tracker** ("price increase notification" 320, "streaming price increase" 140, "subscription price increase" 40, "streaming price increases 2026" 40, "price increase alert" 10, "price hike alert" 10; plus 5 seeds with no data) | 11 | **≈ 560** | ≈ 515 |
| *For comparison:* subscription-tracker category ("subscription manager app" 8,100, "subscription tracker" 1,600, "subscription tracker app" 1,300) | 3 | ≈ 11,000 | ≈ 9,200 |
| *For comparison:* telecom bill hikes (AT&T ×2, Verizon) | 3 | ≈ 10,100 | ≈ 35 |

**Ratio:** service-specific searches outnumber generic "price increase alert/tracker" searches by about **125 to 1**. Even "price increase notification" (320) looks mostly like business intent (how to write a price-increase notice to customers), not consumers asking to be warned.

**All service terms added up, month by month** (Nov 2025 to Aug 2026, the months where every keyword has data):

| Nov 25 | Dec 25 | Jan 26 | Feb 26 | Mar 26 | Apr 26 | May 26 | Jun 26 | Jul 26 | Aug 26 |
|---|---|---|---|---|---|---|---|---|---|
| 49k | 26k | 52k | 74k | 99k | **196k** | 64k | 20k | 22k | 30k |

Oct 2025 alone held about 135k searches for Xbox Game Pass. So some service is raising prices in most months: the floor is about 20k a month, and announcement months reach 50k to 200k.

## 3. Spikes: which months, and how sharp

From the Labs monthly history, plus the DataForSEO Trends weekly index (0 to 100, relative across the 5 terms in that call):

- **Netflix:** 74,000 in Apr 2026 and 60,500 in Mar 2026, against a median month of 4,400. In Trends the spike starts the week of Mar 22 (index 68) and holds through Apr 19 (49), then drops to 12. Smaller bumps in Dec 2025 and Feb 2026 (6,600 each). "why did my netflix bill go up" peaks in **May 2026** (880), about a month after the announcement spike, when the higher charge actually lands.
- **YouTube Premium:** 90,500 in Apr 2026 against a median of 880. Trends shows a 2-week burst (Apr 5 at 100, Apr 12 at 62, then 8).
- **Xbox Game Pass:** 135,000 in Oct 2025 against a median of about 600. 96% of the year fell in its top 2 months.
- **Spotify:** 27,100 in Jan 2026 (Feb 14,800). Trends shows it lasting about 5 weeks (Jan 11 to Feb 8, index 33 → 16). Median 2,000, one of the higher floors.
- **Disney+:** 22,200 in Nov 2025 and again in Oct 2026 (12,100 in Sep 2026). A yearly fall pattern.
- **Crunchyroll:** 40,500 in Feb 2026. **PS Plus:** 27,100 in May 2026. **Paramount+:** 6,600 in Jan 2026. **Hulu:** 8,100 in Oct 2025 and 9,900 in Sep 2026, a yearly fall pattern (its all-time peak was 74,000 in Sep 2023). **Apple Music:** 9,900 in Aug 2026. **Apple One:** 2,400 in Aug 2026. **YouTube TV:** 14,800 in Sep 2025 (all-time peak 110,000 in Dec 2024). **Peacock:** 1,900 in Sep 2026 (also Jul 2023 and Jul 2024). **Amazon Prime:** 110,000 in Feb 2022, now only about 300 a month.
- **Flat (evergreen):** "subscription tracker" (1,300 to 2,400 every month; top-2 share 21%), "price increase notification", "adobe price increase". "subscription tracker app" peaks in **January** (3,600, the New Year money reset). "subscription manager app" averages 8,100 but slid from 18,100 (Sep 2025) to 1,300 (Aug 2026), so treat that number with caution.
- **Right now:** in the latest Trends week (Nov 8 2026), Netflix (18) and Spotify (12) are both rising off their baseline, and "subscription tracker" hit its 12-month high (31). This could be early hike news or just the usual pre-holiday rise. I didn't check.

## 4. App Store keyword popularity

Not collected: there wasn't enough balance for `dataforseo_labs/apple/*` or `app_data/apple/*`. Free ways to check: Apple Search Ads (the Keyword Planner popularity score for "subscription tracker", "price increase", "netflix price") or App Store Connect search-term data after launch. For context only (Google data): CPCs of **$12.59 to $15.26** on "subscription tracker (app)" / "subscription manager app" show advertisers pay for install intent. Price-hike terms mostly have no CPC or less than $8, which means people are looking for news, not an app.

## 5. Conclusions

1. **The demand is real, but people search the service, not the feature.** About 71k US searches a month, on average, go to "[service] price increase". About 560 a month go to anything like "price increase alert/tracker", and the most feature-like phrases ("price hike tracker", "notify me when price goes up", "subscription price tracker") have no measurable volume. Nobody types the feature's name, so it won't bring in App Store or Google installs on its own.
2. **It's event-driven.** For most services the 2 busiest months hold 60–96% of the year's searches, and the peak usually runs 5–225× the median month (Netflix 17×, YouTube Premium 100×, Xbox Game Pass 225×). Weekly data shows each burst lasts 2–5 weeks. A smaller second bump about a month later ("why did my netflix bill go up", May 2026) lines up with the first higher charge.
3. **Across services there's a steady floor.** Some service hikes prices in most months (Oct Xbox → Nov Disney+ → Jan Spotify/Paramount+ → Feb Crunchyroll → Mar–Apr Netflix/YouTube Premium → May PS Plus → Aug Apple Music/One → Sep Hulu/Peacock/Disney+). Typical months still add up to about 18k searches, and Netflix (4.4k) and Spotify (2k) have meaningful floors of their own. Price hikes are a recurring worry for exactly Ditch's anxious, money-conscious user.
4. **(a) In-app feature:** build it as a **retention and conversion feature, not a way to get found**. Its job is to be there at the moment of anxiety: "Netflix is going up to $X on [date]. Still watching?". It fits naturally with the existing 3-day/1-day reminder (show the new price on the first higher charge, which is what the May "why did my bill go up" bump is about). It's a strong App Store screenshot and paywall line ("Know before Netflix raises your price"), and a good reason to keep paying for Pro. To stay inside the "never claim automatic detection" rule, it should be driven by the public price file the app already downloads, worded as "when a service you track announces a new price", never as bill monitoring.
5. **(b) SEO pages:** **one page per service is worth building, one page per year is not.** Keyword difficulty is low (3–36) and competition LOW across the board. Go with **one evergreen URL per service** (e.g. `/prices/netflix`) that shows the current price, the full price-hike history and "what to do", and update it every time. Put "Netflix price increase 2026" in the title and H1 rather than the URL, since the "2026" variants mostly run 4–25% of the head term (Peacock is the exception: 590 vs 390). Have the pages live and indexed **before** the next announcement: a page published after the spike misses most of it. Priority by volume: Netflix, Xbox Game Pass, YouTube Premium, Disney+, Spotify, Crunchyroll, PS Plus, Hulu, Apple Music, YouTube TV, Apple TV, Paramount+, Peacock, HBO Max. Caveat: during a spike, news sites probably own the top results. I didn't check search results, so run a quick results-page check before investing.
6. **Seasonal timing:** the fall cluster (Sep–Nov: Disney+, Hulu, Peacock, YouTube TV, Xbox) and the spring cluster (Mar–Apr: Netflix, YouTube Premium) are when price-hike pages and a "price changes" push get the most traffic. January is when "subscription tracker app" demand peaks (3,600), the best month for App Store and Search Ads pushes on the category term.
7. **Use the category term for installs.** "subscription tracker" (1.6k, flat, $14 CPC) and "subscription tracker app" (1.3k, January peak) are the evergreen install-intent keywords. Price-hike pages should funnel into those: a clear "Get a heads-up before your next price hike" call to action on each service page.
8. **Data gaps to close later:** App Store popularity scores (Search Ads, free) and an exact Google Ads volume cross-check (`google_ads/search_volume/live`, about $0.09 per batch of up to 1,000 keywords) once the DataForSEO account is topped up. Raw JSON is saved in `raw/` next to this file.
