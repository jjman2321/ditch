# A duck that tells history: build-ready research (Nov 18, 2026)

Brief: a Duolingo-style history micro-learning app starring the duck (white, tangerine bill; sunflower / ink / cream). Money first. A hard paywall, weekly plans, a web funnel and upsells are allowed, as long as they're legal.
Builds on `skill-pick-2026-11-18.md` (history #1, 7/10) and `trading-niche-2026-11-18.md` (Paper Duck 5.5/10). I haven't repeated what those files say.
**AppKittie numbers are model estimates** of monthly store gross, and they can't see web sales. Read them as rankings.
**Budget:** AppKittie **97 credits** (log 1,566 → 1,663, cap 1,666). DataForSEO not used. Everything else was free.

## 1. Short answer
- **Go, 6.5/10, and better than Paper Duck (5.5).** Start with a cheap test: 30 duck history shorts on TikTok before writing app code. Build only if the shorts pass the gate in §7.
- **Paladin's biggest weakness is our product brief.**
  - Its ads are "X explained like you're 5": hand-drawn stick figures, cheap and funny. Its app is slow AI narration with forced quizzes.
  - **32 of its 80 recent 1–3★ reviews** say "nothing like the ads". About 22 say the quizzes get in the way or ask for a listen-only mode, and about 20 say "AI slop" or wrong facts.
  - So we build the app to *be* the ad: short, drawn, narrated by the duck, quizzes optional, a sources card on every story.
- **The money is real but it comes from paid ads.** Paladin spends ~**$300k a month** on Meta (≈ $185k of it in the US), sells on the web through Stripe, and has only **158k TikTok followers**.
  - Organic demand for history is strong on YouTube. On TikTok it's solid but mid-sized: the top history accounts have 0.5–1M followers.
  - Organic-only is a slow climb. Expect a base case of ~$2–4k a month by month 12.
- **Search is better than we thought.** "history quiz" scores **81/27** (popularity/difficulty) and "history" **89/32**, and the apps ranking for "history quiz" are old trivia apps earning $6–20k a month.

## 2. Paladin teardown
**Business:**
- Brainstash Inc. (Delaware address on the funnel; team in Romania) also runs Deepstash (~$690k/mo iOS), **Empirio: Learn Business** (2026, ~$40k/mo, +65% in 30 days, the same template applied to business), Dilemmo ($10k) and Protocol ($4.5k). PvX Partners put up **$9M in user-acquisition financing** (Oct 2025).
- Paladin revenue: **iOS ~$116k/mo** (92k downloads, $1.26 a download) and **Android ~$35k/mo** (35k downloads; 500k+ installs on Google Play). Financiarul (Mar 31, 2026): group annualised revenue "over 19 million" (currency not stated); lessons "verified by historians" (the reviews disagree).
- **App Store prices:** yearly $29.99–99.99 (six price points under test), monthly $12.99, 3 months $19.99/24.99; 7-day trial. No weekly plan in the App Store.

**Onboarding (in the app, ~19 steps; ScreensDesign):** 2 intro slides → social proof → optional sign-up → mascot hello → goal, age, eras, 3 "persona" questions → notification time picker and permission → "Building your plan" → **a rate-us prompt before you've used the app** → pick a historical-figure card → 4-step trial timeline → paywall (7-day trial, "Pro: infinite hearts") → "how did you hear about us" → streak and 30-day challenge screens.

**Lessons and gamification:** stories of 3–6 chapters (illustrated cards with narration, some captioned videos, animated maps, polls), a **quiz gate after every chapter**, "Deep Dive" links. Game layer: streak with freezes, hearts, **1v1 trivia battles**, timed boss battles, **59 collectible historical characters**, streak-unlocked app icons.

**Web funnel** (walked Nov 18; screenshots in scratchpad `paladin/gp-01…34.png`; I stopped at the email gate):
- Entry: learnpaladin.com "Get started" → `/growth-plan`: "Uncover the past, one story at a time · Trusted by 3 Million+ · The Best History Learning Apps 2026".
- **~30 steps:** age ("The impact of doomscrolling depends on your age") · interest scales (Cleopatra? Civil War? Marcus Aurelius?) · how history classes felt, information sources, learning style, reasons · a **"Yes/No" swipe on 6 topic packs** · distractions ("Doomscrolling") · daily goal 3 / 5 / 10 / 15 min. Interstitials: "Curated by experts", "92% report better understanding after 4 weeks", "We already helped 3M+ escape doomscrolling".
- Then a fake-progress screen ("Loved by over 10M people worldwide") with pop-up commitment questions ("Are you a perfectionist?"), then the **email gate**.
- **After the gate** (read from the funnel's own text strings, not seen live): a Stripe checkout with **intro-discount plans priced "PER DAY"**, "MOST POPULAR / BEST VALUE", "SAVE x%", a **min/sec countdown**, a "30-day Money-Back Guarantee", a lifetime option, holiday coupon skins all year round (Halloween, Black Friday, Christmas…), "extra discount" coupons, "flip the switch" promos, and the disclaimer "renewed at full price of {price} at the end of the intro period".
- **Cross-app pay** ("Deepstash reader gift"): the same funnel serves all 5 Brainstash apps. Trackers: Meta (2 pixels), TikTok, Snapchat, X, Google, Amplitude, Sentry.

**Ads** (Meta Ad Library, US, active, Nov 18):
- **~3,900 active ads** for "learnpaladin.com". AppKittie counts ad volume up 235% in 30 days.
- Every ad uses the same primary text: "Have you tried Paladin yet? Learn History in just 5 minutes a day!" Destination: learnpaladin.com (the web funnel) or appstack.link.
- **Videos run 15 s to 10 min.** These are full mini-documentaries used as ads.
- **The hooks that work:** "**[North Korea / The Black Death / How a fruit company took over a country] explained like you're 5**", hand-drawn on paper · stick-figure cartoons ("HALF PRICE: ZERO EXCUSES") · "The true story Hollywood won't tell" · fake-tweet memes ("my uncle corrects everyone's history at Thanksgiving…") · a staged comment reply ("love paladin but it's so expensive" → "up to 60% off this week for Halloween… a year costs less than a bag of candy").
- **Creator partnership ads** (whitelisting) with "null.histories".
- **Spend (AppKittie, Meta transparency):** last 30 days **$300k** (US $185k is AppKittie's estimate; UK $43k; EU ~$70k), lifetime ~$1.18M. Reach: 25–34 is 39%, 35–44 is 26%, 18–24 is 13%; **65% men**.

**Organic:** TikTok @learnpaladin 158k followers, 1.6M likes, 621 videos (~250 followers per video). YouTube 3.0k subscribers. Organic is small, which makes Paladin a paid-ads machine.

**Reviews:** 100 most recent US reviews (Sep 28–Nov 16): **56× 1★, 11× 2★, 13× 3★, 6× 4★, 14× 5★**. Theme counts are rough keyword tallies on the 80 that are 1–3★.

| What they hate (1–3★) | ~n | What it means for us |
|---|---|---|
| "Nothing like the ads" (ELI5 drawings and pacing vs slow AI narration) | 32 | Make the app identical to our TikToks |
| Billing: charged after cancelling, no trial reminder, Stripe cancellation, half refunds | 24 | Trial reminder 2 days before; cancel steps on screen |
| Forced quizzes, "let me just listen while driving", constant taps | 22 | **Quizzes optional; Listen mode (lock-screen audio)** |
| AI art, AI voice, wrong facts ("USIA" mix-up in the Molasses story) | 20 | Drawn duck plus public-domain art, sources card, report-an-error button |
| Too elementary or too short / "fourth graders" | 13 | "Go deeper" second layer on each story |
| Rate-us prompt "15 times in 5 minutes"; endless questionnaire; price hidden | 7+5 | One review prompt after day-3 streak; short onboarding |

**What they love (20 reviews at 4–5★):** it replaces doomscrolling, "learned more than a semester", short chapters, and some like the quizzes ("reinforces what I learned"). People ask for maps, filters by era, harder quizzes, and indigenous history.

## 3. The rest of the market (AppKittie, US iOS, monthly)
| App | Launched | Rev/mo | DL/mo | $/dl | Note |
|---|---|---|---|---|---|
| Headway (micro-learning) | 2019 | $501k | 40k | $12.5 | Web funnel inflates $/dl |
| Imprint (Polywise) | 2021 | $341k | 338k | $1.0 | Yearly $74.99–99.99, monthly $15.99 |
| SmartyMe | Nov 2024 | $270k | 240k | $1.1 | **Weekly $6.99/7.99**, yearly $29.99–79.99 |
| Brilliant | 2015 | $260k | 55k | $4.7 | Yearly $119.99–191.99 |
| Nibble | Nov 2022 | $150k | 48k | $3.1 | History is 1 of 35 topics; running "Nibble vs Paladin" SEO pages |
| **Paladin** | Sep 2024 | **$116k** (+$35k Android) | 92k | $1.26 | The only history breakout |
| Facts – Daily Random Trivia | 2014 | $104k | 52k | $2.0 | Daily-fact habit; lifetime $99.99 |
| **Empirio (Brainstash)** | **2026** | $40k | 10k | $3.9 | **Funded rival cloning the format into business/money** |
| World History Quiz Test Trivia | 2018 | $20k | 11k | $1.75 | Ranks for "history quiz" |
| Farout – Daily Trivia | 2026 | $18k | 27k | $0.7 | |
| History Trivia Quiz Game / Eventology | 2017–20 | $10k each | 5–9k | $1.1–1.7 | |
| Heritale (watch history stories) | 2026 | $6.4k | 8.5k | $0.75 | Video-first newcomer |
| Archives – Islamic History | 2025 | $4.0k | 7.6k | $0.53 | +22% downloads |
| Epictok History | Oct 2025 | $4.0k | 9.0k | $0.44 | 3.8★ |
| HistoryDays / Timeline Quiz / Daily Bios | 2022–25 | $1.5–2.4k | 5–7k | $0.3–0.4 | |
| Fragmenta (daily history facts) | 2026 | $0.6k | 8.0k | $0.07 | |
| "On this day" apps | various | $0–1.8k | ≤8k | ≤$1.2 | "today in history" is only 19/14 |
| Philosophy (Fathom, Stoa…) | various | ≤$10k | ≤12k | ≤$1.6 | Keep philosophy as an extra course |

- **Has anyone besides Paladin broken out? No.** Every 2024–26 history newcomer is under $7k. The only fast riser is Brainstash's own Empirio.
- **Funded rivals:**
  - Brainstash keeps launching clones of this template (business, decisions, health).
  - Nibble is attacking Paladin with SEO comparison pages, not a dedicated app.
  - Sophia (France, culture générale) went from $0 to ~$375k in 2026, which shows the general-knowledge format is hot.
- **Tail apps earn $0.3–0.7 a download.** They're freemium and cheap-looking. Paladin's $1.26 comes from a hard trial paywall plus web sales.

## 4. Organic demand
**Accounts (followers checked live Nov 18):**
- **TikTok:** HISTORY (A&E) 2.3M · absolute history 998k · HistAIry Films (AI-made history) 933k · TheHistoryLegends 633k · History Hit 523k.
- **YouTube:** OverSimplified (stick-figure comedy history) 9.69M subscribers · Fern 2.61M · History Matters (10-second ELI5 animations) 1.92M · Epic History TV 1.19M.

- **Verdict:** history storytelling is a proven, evergreen format, and **the winning style is simple drawings plus a dry narrator** (OverSimplified, History Matters, Paladin's ELI5 ads). That's exactly a duck.
- But TikTok history accounts top out around 1M, and Paladin's own account is small. History is a good organic channel, not a lottery ticket.

**App Store keywords (AppKittie, US popularity/difficulty):** history 89/32 · **history quiz 81/27 (best opening)** · world history 60/24 · daily learning 57/21 · learn history 45/17 (earlier round) · history facts 38/15 · today in history 19/14 (skip) · learn something new 14/37 (skip).

## 5. Our product spec
**Positioning:** "History, explained like you're 5. By a duck." The promise: *the app looks exactly like the videos*.

**Core loop (one a day, 2–4 minutes):**
1. **Today's Story:** 6–10 swipeable drawn cards, each with 1–2 lines, narrated by the duck (auto-plays like a Short).
2. **Duck Check (optional):** 3 quick questions → XP. Skipping still counts for the streak, which fixes Paladin's #3 complaint.
3. **Sources card:** 2 links plus "Report an error".
4. **Streak**, with 1 free freeze a week.
5. **Costume card:** the duck dressed as the story's figure (Napoleon Duck, Cleopatra Duck). The set grows 1 card a story, and the full set is shareable. This is our version of Paladin's 59 characters, and it's cheaper because it's one duck plus props.
6. **Listen mode (Pro):** a whole season as a lock-screen audio playlist for the commute.

- **Leagues: not at launch.** They need a server, and the users who complain about Paladin want less pressure, not more. Add a weekly "Season" leaderboard in v2 if retention data supports it.
- **Lesson format that works on TikTok:**
  - Hook card ("Australia lost a war. To birds.") → 5–7 story beats → twist → "the boring truth" (the myth-check) → sign-off line ("Quack. Sources in the app.").
  - 60–90 s spoken, about 180–220 words. The same script and drawings export as a 9:16 video.
  - A "Go deeper" button opens 3 more cards for people who say it's "too elementary".
- **Course map:**
  - **Spine:** Seasons of 7 stories (one a week), mixed across eras.
  - **Library:** Ancient → Classical → Medieval → Early modern → 1800s → 1900s → Cold War.
  - **Extra courses:** Money Stories (bubbles, frauds, hyperinflation); Philosophy (Stoics, Socrates, Diogenes; told as stories, not concepts); Psychology (famous experiments, debunked or not); Disasters.
  - **Custom product page courses later:** WWII, Ancient Rome, Women in history.

**First 30 lessons** (M = Money, P = Philosophy, Ψ = Psychology):
- **1–10:** The Emu War: Australia vs 20,000 birds · The Dancing Plague of 1518 · The Great Stink: the river that sent Parliament running · Tulip Mania: was a flower really worth a house? (M) · The Year Without a Summer, and how it made Frankenstein · The Radium Girls · Napoleon wasn't short. A cartoon made him short · The Boston Molasses Flood · Weimar: when money was cheaper than wallpaper (M) · Stanislav Petrov, the man who didn't start WW3
- **11–20:** Cleopatra lived closer to the iPhone than to the pyramids · Thrown out of a window. Twice. (Prague) · Phineas Gage and the iron rod (Ψ) · The South Sea Bubble: how Isaac Newton lost a fortune (M) · Diogenes, the man who lived in a jar (P) · The Christmas Truce of 1914 · Operation Mincemeat: a dead man fooled Hitler · The 1962 laughter epidemic · Mansa Musa: so rich he crashed the price of gold (M) · The Pig War: the US and Britain nearly fought over one pig
- **21–30:** Marcus Aurelius's diary was never meant for you (P) · Charles Ponzi, the original (M) · The Library of Alexandria didn't burn in a day · The Halifax Explosion · Vikings didn't wear horned helmets. Blame an opera · The Stanford Prison Experiment: what they didn't tell you (Ψ) · Socrates, sentenced to death for asking questions (P) · The Cadaver Synod: a pope put a corpse on trial · Clever Hans, the horse that could "count" (Ψ) · Apollo 13: "Houston, we've had a problem"

**Content production (per lesson):**
1. Claude drafts the script, the quiz, the myth-check and 2–3 candidate sources.
2. **The owner checks every claim against 2 independent sources** (Wikipedia is never the second: use Britannica, Smithsonian, BBC History, a museum page, or an academic or primary source). Flag anything disputed as "historians argue…". About 30–45 min a story.
3. Later, a paid second check by a history grad before each season (freelance, ~$15–25 a story, rough).
- **Art:** **the drawn duck is the hero**: a professional pose and prop kit (~40 poses, ~60 props; ~$1–2.5k, rough; the same redraw Ditch already needs). **Public-domain paintings** as "real evidence" cards (Met Open Access, Wikimedia PD, Library of Congress). **No AI imagery**: it's the #4 complaint about Paladin.
- **Voice:** ElevenLabs Starter/Creator ~$0.17–0.20 a minute with a commercial licence (~$0.30 a lesson). One warm, dry voice everywhere (ads and app). Test the owner reading 5 stories himself against TTS on TikTok.
- **Cost a lesson:** ~$0.10 Claude + ~$0.30 voice + ~$20 reviewer (later) ≈ **$0–25 cash plus ~45 minutes**. Launch with 60 stories (~$1.5k, or $0 if self-checked), then add 7 a week.

## 6. Monetization and growth
**Benchmarks (RevenueCat 2026):**
- Education: median monthly **$9.99** and yearly **$44.99** (the highest of any category); download→trial **6.5%**; revenue per install by day 14 **$0.30**.
- All categories: hard paywalls convert **10.7%** of downloads to paid by day 35 (freemium **2.1%**) and earn **$3.09** per install by day 60 (freemium $0.38). One-year retention of payers is about the same (27% vs 28%).
- Rival prices: Paladin $59.99–99.99/yr, $12.99/mo · Imprint $74.99–99.99/yr · Nibble $59.99–89.99/yr · SmartyMe weekly $6.99–7.99.

**Our pricing:** **yearly $39.99 with a 7-day free trial** (pre-selected; under Paladin and the category median; test $49.99 later) · **weekly $4.99, no trial** (for impulse buyers from TikTok) · **lifetime $79.99**, shown once after someone declines the trial, never with a fake "was" price. **A trial reminder notification 2 days before the charge**, listed in the store as a feature: it answers Paladin's billing reviews directly. Keep auto-renewal disclosures that meet ROSCA.

**Free vs paid: a hard paywall with a taste.** Onboarding (~8 screens, no rate-us) → **story #1 is free** (the moment it clicks) → paywall with × → closing it leaves **today's story only, text with no narration, no library**. **Pro:** full library and all courses, narration and Listen mode, costume cards, Go deeper, streak freezes, widget. Why: hard paywalls make ~8× more per install, and the free daily story keeps TikTok visitors coming back to see the paywall again.

**Organic-first growth:**
1. **TikTok engine:**
   - 1 duck short a day, posted to TikTok, Reels and Shorts, made from the lesson's own drawings and audio (CapCut template, ~30 min each).
   - Hook formats to copy from Paladin's paid winners: "X explained like you're 5", "The true story Hollywood won't tell", "History's dumbest moment, day N", and myth-busts.
   - Pin a "the app looks exactly like this" comment.
2. **ASO:**
   - Title: "[Name]: History Stories & Quiz". The subtitle carries "learn history daily".
   - Target **history quiz** (81/27), **history** (89/32), **world history** (60/24) and **learn history** (45/17).
   - **Custom product pages** for each course (Money Stories, Philosophy, WWII), assigned to keywords (Apple has allowed keyword-linked custom product pages in organic search since 2025).
3. **Web quiz funnel (after month 3, once a short wins):**
   - Copy Paladin's structure (~15 steps, not 30): age, eras, a Yes/No swipe on topic packs, daily goal, email, then Stripe checkout.
   - **Honest version:** no "10M people" or "92%" claims we can't prove, no fake timers, real coupons only.
   - US apps may link to web checkout with no Apple fee for now. The Supreme Court case is pending (see the trading file), so keep App Store purchases as the fallback.
   - It needs Supabase plus Stripe, the same stack as AnkiDecks.

**Ad economics (later):**
- Paladin's blended cost per install is at most **~$2.4** ($300k of Meta spend ÷ ~127k iOS and Android downloads, organic included). iOS cost per install across categories is ~$3.0 (Singular, Q2 2026).
- At the hard-paywall median of $3.09 per install by day 60, App Store-only ads roughly break even by day 60. A web funnel and upsells are what make them profitable.
- **$3–5k test:** 3 weeks of Meta and TikTok using our 3 best organic shorts as Spark/partner ads. **Go if** cost per install ≤ $2.5, install → trial ≥ 8%, trial → paid ≥ 35%, and day-7 return on ad spend ≥ 0.35.

## 7. Names (App Store US search, Nov 18; all need a lawyer and USPTO check)
| Name | Collision? | Score | Note |
|---|---|---|---|
| **Duckumentary** | Clear | **8/10** | Says "history stories" and "duck" in one word; easy to remember on TikTok. **Pick** |
| Daily Quack | Clear | 7/10 | Habit plus voice; weaker on "history" |
| Time Duck | Clear | 7/10 | Simple; a little generic |
| Quack Through Time | Clear | 6/10 | Long |
| Past Duck | Clear | 6/10 | Neat, but "past due" pun confuses |
| History Duck | Clear | 6/10 | Plain, good for search |
| Quackstory | Clear | 5/10 | Hard to spell out loud |
| Duckstory | Near "Duck Story World" (TutoToons kids app) | 4/10 | Collides |
| DuckTales | **Disney trademark** | 0 | Never |

**Build estimate** (owner plus Claude, with the Expo / EAS / StoreKit pipeline already learnt on Ditch):
- MVP in **6–8 weeks**: story player (cards + audio), optional quiz, streak, costume cards, paywall via `expo-iap`, local notifications, content as bundled JSON plus EAS Update.
- Write content in parallel: 60 stories ≈ 45–60 hours.
- Web funnel: +3–4 weeks later.

**Gate before building:** post 30 shorts in 30 days. **Build if** one short passes 50k views or the median passes 3k. **Rethink if** everything stays under 1k.

## 8. Year 1 and verdict
Year-1 gross (App Store plus web, before Apple's 15%), with $/download from the tail apps vs Paladin:

| | Bear | Base | Bull |
|---|---|---|---|
| Organic only | ~$1–2k total (shorts flop; ~1k downloads/mo × $0.3) | **~$15–25k** (3–5k downloads/mo × ~$0.8 by month 12 ≈ $2–4k/mo) | ~$100–150k (a series goes viral: 20k+ downloads/mo × $1.2) |
| Plus a $3–5k ad test | Lose the $3–5k, learn the funnel | Same as organic plus ~$5k; scale only if the §6 gates pass | Scale with the web funnel to $30–60k/mo by month 12; needs $15–30k of cash float |

**Scores (/10):** proof of money 7 · gap vs the leader 9 · organic and TikTok fit 7 · search 7 · content cost 8 · fit for the duck 9 · legal risk 9 · ceiling without paid ads 4 · threat from Brainstash/Nibble 4.

**Overall 6.5/10: GO,** behind the 30-shorts gate. Start the shorts now (no code). Build once Ditch v1 is in review.

**Blunt comparison vs Paper Duck (5.5):**
- **History wins** on legal risk (no finance ad rules or earnings-claim law), content cost and accuracy stakes (a wrong date isn't a lost life savings), the duck's fit, competitor weakness (Paladin 80% 1–3★ vs Finelo 91% 4–5★), and search ("history quiz" 81/27 vs "trading simulator" 39/16). And we can start for free tomorrow on TikTok.
- **Paper Duck wins** on revenue per user: trading simulators make $1.5–3.4 a download vs $0.3–1.3 for history, and its buyers expect to pay more.
- History is the better first bet for a solo, organic-first maker. Paper Duck only makes sense with ad money and a web funnel.

## Caveats
- AppKittie revenue misses web/Stripe sales (big for Paladin and Headway) and can be ~10× off for small apps. The US Meta spend is AppKittie's estimate (EU and UK are measured).
- Paladin's post-email paywall was read from its code, not seen live (I stopped at the email gate as instructed).
- Review themes are keyword tallies on 100 recent US reviews, which skew negative.
- Follower counts are one live snapshot. Year-1 ranges are judgment, not forecasts.

## Sources
- AppKittie API (list, get-app, keyword difficulty), Nov 18: scratchpad `ak/hx_*.json`, `ak/app_6511242367.json`, `ak/app_com.learnpaladin.json`, log `ak_log.tsv`.
- Paladin: [App Store](https://apps.apple.com/us/app/id6511242367) · [Google Play](https://play.google.com/store/apps/details?id=com.learnpaladin) · [learnpaladin.com](https://learnpaladin.com) · [web funnel](https://learnpaladin.com/growth-plan) · [ScreensDesign](https://screensdesign.com/apps/paladin-learn-history/) · [Adapty paywall library](https://adapty.io/paywall-library/paladin/) · reviews `https://itunes.apple.com/us/rss/customerreviews/page=1..2/id=6511242367/sortby=mostrecent/json`
- [Meta Ad Library: learnpaladin.com, US, active](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=learnpaladin.com&search_type=keyword_unordered) · [TikTok @learnpaladin](https://www.tiktok.com/@learnpaladin)
- [Financiarul, Mar 31 2026 ("19 million")](https://financiarul.ro/tehnologie/istorie-in-5-minute-aplicatia-romaneasca-ce-a-ajuns-la-venituri-de-19-milioane/) · [PvX $9M to Brainstash](https://itbrief.co.uk/story/pvx-partners-backs-brainstash-with-9m-in-ua-financing-to-accelerate-global-growth-of-deepstash)
- [Nibble vs Paladin (competitor blog)](https://nibble-app.com/blog/nibble-vs-paladin)
- [RevenueCat SOSA 2026: Education](https://www.revenuecat.com/state-of-subscription-apps-2026-education) · [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps-2026/) · [Singular Q2 2026](https://www.singular.net/quarterly-report-2026-q2/)
- [ElevenLabs pricing](https://elevenlabs.io/pricing) · [CreatorDB: HistAIry Films](https://creatordb.app/creatorstats/histairy_films/) · TikTok and YouTube profiles checked directly (@history, @absolutehistory, @thehistorylegends, @historyhit; YouTube @OverSimplified, @Fern-tv, @HistoryMatters, @EpicHistoryTV)
- Name checks: iTunes Search API (US, software), Nov 18; scratchpad `hx_names/itunes.json`.
