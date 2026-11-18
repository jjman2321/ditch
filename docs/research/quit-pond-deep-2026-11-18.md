# Duck-pond quit app: build-ready research (Nov 18, 2026)

Builds on `quit-pet-2026-11-18.md`, `pivot-niches-2026-11-18.md` §1 and `open-ideas-2026-11-18.md` (not repeated). Working name "the pond app" until §6 is settled.
**Method:** AppKittie (48 credits: 4 App Store keyword scores, 8 app detail pulls), one DataForSEO call (Google US, $0.015), iTunes Search, review RSS for Tipple, Sobo, DreamMe, Finch and Quit Vaping (most recent ~100 each), Mobbin (Finch flows and paywalls; it has no quit apps), web sources linked inline.
**All revenue and download figures are AppKittie model estimates** (ranks, not bank statements). Retention figures come from vendor reports with differing methods.

## 0. Short answer
- **Game loop:** the pond grows with *total days off* (this never resets).
  - One free "pond find" per day off (chance-based, odds published, never sold), a guaranteed weekly visitor, an egg at each milestone.
  - The pond follows the real calendar season. Content runs to day 365; year 2 adds rare variants.
  - Designed against Tipple's top game complaint: "camp fully upgraded after a week".
- **Launch habit: nicotine (vapes + pouches)**, with alcohol and weed in the app from day one, each with its own custom product page. The 2-week demand test decides nicotine vs alcohol before building.
- **Onboarding:** 12 screens to the paywall (Tipple 35, Finch 40, I Am Sober 20).
- **Pricing:** free counter, money and milestones forever. Pro **$49.99/yr with a 7-day trial**, $9.99/mo, $99.99 lifetime. Trial reminder on by default.
- **Names for the lawyer:** Puddle, Pondly, Quackit.
- **Build:** ~10–12 weeks part-time to the App Store with 90 days of content, then monthly drops. Launch art ~$3–8k.
- **Biggest risks:** (1) content treadmill and art cost; (2) distribution: Tipple's ~$10 per download pays for ads, an honest soft paywall earns less; (3) name, health-claim and safety review, plus fast copycats.

## 1. Game loop that keeps people for a year
### 1a. How the leaders loop (help pages, ScreensDesign recordings, reviews)
| App | Daily action → reward | Variable reward | Collection / long tail | Miss-a-day rule | "Needs you" pings |
|---|---|---|---|---|---|
| Finch (~$1.05M/mo) | Self-care tasks → energy → timed adventure ([help](https://help.finchcare.com/hc/en-us/articles/37780134479757-Energy-vs-Rainbow-Stones)) | Random friend visits, adventure stories | Rainbow Stones shop, micropets, monthly [seasonal events](https://help.finchcare.com/hc/en-us/articles/37780438941965-Seasonal-Event-Overview) | Pause mode keeps streaks | Pet-voiced reminders, live widget ([DoF](https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl)) |
| Tipple (~$124k) | Dry-day check-in (chat) → coins → "camp" upgrades ([ScreensDesign](https://screensdesign.com/showcase/tipple-alcohol-moderation-pet)) | Spin after each check-in | Camp items **all bought within ~7–14 days** (reviews) | "Unlucky" spins, "starting over" (reviews) | AI chat check-ins |
| DreamMe (GLP-1 fish, ~$16k) | Log a shot or food → fish grows | Tank items, "trade up" | Sells **Pearls** currency ($0.99 for 100) | n/a | Shot reminders (some reviews say they never arrived) |
| Sobo (~$15k) | Daily prompts, home and garden | Gift-card rewards (**removed**; a 1★ review says it lost them) | Garden items | n/a | AI chat |
| Kwit (~$35k) | Check-ins, craving logs → trophies (incl. "resisted a craving") | None seen | Avatar, goals timeline | Slips logged | Mascot chat quiz |
| Pokémon Sleep | Sleep → Snorlax grows → morning visitors | Which Pokémon and Sleep Style appear | Sleep Style dex, Research Rank | Nothing lost | Monthly 3-day [Good Sleep Day](https://bulbapedia.bulbagarden.net/wiki/List_of_events_in_Pok%C3%A9mon_Sleep) |
| Duolingo | Lesson → XP, streak | Chests, quests | Leagues, streak milestones | Streak Freeze / Repair ([blog](https://blog.duolingo.com/how-duolingo-streak-builds-habit)) | Guilt-tinged owl pushes |
| Forest / Plant Nanny / Habitica | Focus / water / tasks | Habitica random egg and potion drops | Trees, plants, pets, mounts | **Tree dies, plant wilts, HP loss**: real stakes, frequent guilt complaints | "Thirsty" pushes |

### 1b. Retention data
- Health & Fitness benchmarks: **D1 ~20–28%, D7 ~7–18%, D30 ~3–9%** by source ([Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/), [Phiture](https://phiture.com/mobilegrowthstack/managing-retention-rate-benchmarks-and-expectations/), [Braze](https://www.braze.com/resources/articles/mobile-app-retention)).
- Pet effect: Finch is reported at **D1 54% / D7 37%** (Sensor Tower via [DoF](https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl)), ~2× the category. This is correlational; no study isolates the pet. Duolingo says a 7-day streak makes course completion 3.6× likelier (company claim).
- Money ([RevenueCat 2026](https://www.revenuecat.com/state-of-subscription-apps-2026/), H&F medians):
  - download→trial 6.9%, trial→paid 37.7%, download→paid by day 35 2.9%
  - **82.1% of trials start on day 0**, so the end of onboarding is the money moment
  - all categories: hard paywall 10.7% download→paid vs freemium 2.1%
- **Our targets:** D1 ≥40%, D7 ≥25%, D30 ≥12%.

### 1c. Recommended loop (one minute a day)
1. **Morning check-in:** "Still off it?" **Yes** / **I slipped**. Yes = +1 day off and today's pond piece (fixed, not random).
2. **Pond find** (chance, free): one per day off, from this month's pool. Every draw gives something (no blanks, no "unlucky").
   - Odds Common 70 / Uncommon 22 / Rare 7 / Golden 1%, shown in a "How finds work" sheet. Pity: a Rare by the 14th find without one. Duplicates → feathers; 30 feathers = pick any item you've seen.
3. **Weekly visitor** (Sunday, guaranteed): a new critter. 12 at launch, then 1 a month.
4. **Milestone eggs** hatch after N more days off. A slip *pauses* the egg; it never breaks.
5. **Season:** the pond follows the real calendar (snow in December), so a lapsed user comes back to something new.
6. **Craving SOS (free):** 2 minutes of "skim stones" or "paddle-breathing". Finishing one adds a calm ripple (rewards coping, like Kwit's trophy).
7. **Money as real things:** "$214 kept: that's the trainers." Uses the user's own items or a local list; never alcohol or vape items.

### 1d. 365-day unlock outline (days = total days off, not in a row)
| Day | Pond event | Health fact (§4) | Money | Chance layer |
|---|---|---|---|---|
| 0 | Hold to ditch → a puddle and the duck | — | Year total set | First find (guaranteed Uncommon) |
| 1–2 | First lily pad; frog visits | Heart rate and CO facts | Day cost | Daily finds start |
| 3 | Storm night, the duck brings a blanket | "Withdrawal is usually worst in the first days" | — | — |
| 7 | **Puddle → Pond** (area 2) | Week-one fact | "A week = X" | Egg 1 (hatches day 14) |
| 14 / 21 | Duckling hatches / dragonflies | Two-week facts | Real thing #1 | — |
| 30 | **Reed bed** (area 3) | Month facts | Monthly total | Egg 2 |
| 45 / 60 | Heron / **Willow bank** (area 4) | NHS: mental-health benefits from ~6 weeks | Real thing #2 | Egg 3 |
| 90 / 100 | **Island** (area 5) / "100 days" fireworks | 3-month facts | Quarter total | Double-Rare weekend (free) |
| 120–150 | Rowboat, bridge | — | — | Monthly pools rotate |
| 180 | **Waterfall** (area 6) | 6-month facts | Half-year total | Egg 4 |
| 200–330 | Lantern night, autumn fair, winter skate | — | — | Seasonal pools |
| 365 | **Lake** (area 7), "Year one" scene | 1-year facts | Year kept | Year-2 golden variants |
**Content:** launch = 3 areas, 90 days of events, 3 monthly pools of ~12 finds, 12 visitors. Year 1 = 7 areas, ~144 finds, 24 visitors, ~20 scenes. Ship each monthly pool as an App Store [In-App Event](https://developer.apple.com/app-store/in-app-events/) (free featuring).

### 1e. Slips: no guilt, still stakes
- **No guilt:** "I slipped" → the duck: "Happens. One day isn't the story." The **days-off total** is the headline and never resets; the pond keeps everything. A one-tap "what was going on?" (stress, people, boredom, habit) feeds a "your tricky times" card. No sick or dying duck (Plant Nanny and Forest show the guilt route; Tipple's "unlucky" reviews show the cost).
- **Stakes:** no pond find that day; the egg pauses; the secondary "current run" restarts. Optional **Bounce back:** 3 days off in a row restores the run, earned and never bought (Duolingo's Streak Repair without gems).
- **Owner decision needed:** DECISIONS #13 ("no streaks, badges or points") was written for the tracker. This app needs its own rule.
- **Pings (curiosity, not guilt):** at most 1 a day (morning check-in at the user's time), an optional craving-hour ping, and milestone eves ("Tomorrow's day 7. Something's wobbling in the reeds."). Never "your duck misses you" with a sad face.

### 1f. Apple rules on chance mechanics
- **3.1.1:** loot boxes "or other mechanisms that provide randomized virtual items **for purchase** must disclose the odds… prior to purchase" ([guidelines](https://developer.apple.com/app-store/review/guidelines/)).
- **Age ratings:** loot boxes 9+ globally (16+ Australia, A18 Brazil); "simulated gambling" 13+ infrequent, 18+ frequent ([age ratings](https://developer.apple.com/help/app-store-connect/reference/age-ratings)).
- **Our rules:** finds and eggs are **earned, never sold**; no paid currency (unlike DreamMe's Pearls); Pro gets the **same odds** (it unlocks fixed content, not draws); odds published anyway; no wheels, slots or near-miss animation, so nothing reads as simulated gambling.
- **Rating:** "frequent alcohol, tobacco or drug references" makes the app **18+** (rivals are 17+/18+). That also keeps us off teen marketing.

## 2. Onboarding and paywall that convert
### 2a. Competitor map
| App | Steps to paywall | Questions | Paywall | Trial | Prices (US) |
|---|---|---|---|---|---|
| Tipple | **35** ([ScreensDesign](https://screensdesign.com/showcase/tipple-alcohol-moderation-pet)) | Many personal; slider plan; "Hold to commit" | **Hard**; trial timeline; reminder *opt-in* | 7 d | $99.99/yr, $24.99/mo (+ $59.99/$79.99/yr, $19.99/mo variants) |
| I Am Sober | 20 ([ScreensDesign](https://screensdesign.com/showcase/i-am-sober)) | Motivation, identity, substance, frequency | Soft, after quiz; "67% savings" badge | 7 d | $29.99–39.99/yr, $9.99/mo |
| Kwit | 27 ([ScreensDesign](https://screensdesign.com/showcase/quit-smoking-for-good-kwit)) | Chat quiz with mascots | Soft, after yearly-benefits screen | 3 d | Quarterly, annual, lifetime |
| QuitSure | 27 ([ScreensDesign](https://screensdesign.com/showcase/quitsure-quit-smoking-vaping)) | Quiz + testimonials + "analyzing" | — | — | not checked |
| Finch | 40 ([ScreensDesign](https://screensdesign.com/showcase/finch-self-care-pet)); 21 on [Mobbin](https://mobbin.com/flows/80ef83ef-f872-4825-b18d-6b193d60a9aa) | Egg hatch, name, areas, starter plan | Soft; strike-through "one-time offer" later ([Mobbin](https://mobbin.com/screens/f58ab869-a56d-4d44-bba4-9c41158451b3)) | 7 d | $39.99–69.99/yr, $5.99–9.99/mo |
| Sobo | Long quiz + account (reviews) | "Describe a bunch of stuff" | **Hard** ("can't go past the paywall") | 7 d | $59.99–99.99/yr, $24.99/mo, **$4.99/wk** |
| DreamMe | Long; email before price (review) | GLP-1 setup | Thin free tier | — | $69.99/yr ($39.99 offer), $14.99–19.99/mo |
| Quit Vaping / Grounded / Puff Count | not checked | — | — | — | $99.99/yr, $19.99/mo / $39.99/yr, $9.99/mo / $59.99/yr + weekly |
Review signals: "why am I paying to be sober" (Sobo, ~14 of its last 27 low reviews); "charged $99 with no reminder" (Tipple, ~12 of 30); "too many questions" (Tipple, Sobo); "AI chat, no thanks" (Tipple, Sobo).

### 2b. Recommended flow (12 screens, Sunflower UI)
1. **Welcome:** duck in a puddle, "Ditch it. Grow a pond." Under the button: "Free forever: counter, money, milestones."
2. **What are you ditching?** Vape · Pouches · Cigarettes · Drinks · Weed · Something else.
3. **What it costs:** amount per day or week, with defaults (Ditch money engine).
4. **Why?** Up to 3: money, sleep, health, focus, someone. Used in copy only.
5. **Year-total reveal:** "Your vape costs **$1,300 a year**", then "that's a flight to Lisbon".
6. **What changes:** 3 sourced milestones with source tags.
7. **Safety:** always shown for alcohol; one line for nicotine and weed (§3c).
8. **Meet the duck:** name him (prefilled).
9. **Notification primer:** a sample duck notification, then the iOS prompt. Tipple asks at launch; ScreensDesign flags that.
10. **Quit day:** today or a date.
11. **Hold to ditch:** ring, DITCHED lands, haptic, puddle appears.
12. **Paywall:** × from the first frame, Free | Pro table, Restore. "$0 today · $49.99/yr from Nov 25 · Cancel anytime". "We'll remind you 2 days before", on by default (Tipple's is opt-in). No weekly plan, strike-throughs or "one-time offers".
   - **Owner call:** the tracker paywall has no reminder line (Nov 10). Here it answers Tipple's #1 complaint.

### 2c. Free vs Pro, price
- **Free forever:** 1 habit, days-off total and run, money kept, all milestones and safety info, craving SOS, daily finds, eggs and visitors, the first 3 pond areas (to day 30).
- **Pro:** all 7 areas and seasonal scenery, more habits, home- and lock-screen widget (Finch's engine), tricky-times insights, custom check-ins, extra SOS games, iCloud backup. Never better odds.
- **Upgrade moments:** day 0 paywall; day 30 ("your pond wants to grow past the reeds"); adding a 2nd habit; adding the widget.
- **Price:** **$49.99/yr with a 7-day trial**: above the H&F median yearly ($39.94), below Tipple ($99.99). Median trial→paid by trial length: 5–9 days 37.4%, ≤4 days 25.5%, 17–32 days 42.5% but slower cash ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2026/)); a week also covers the hardest withdrawal days. **$9.99/mo** with no trial. **$99.99 lifetime** (quitters "graduate": pay once, keep the pond). Later A/B test: $59.99/yr.
- **Rough math:** H&F medians (6.9% trial × 37.7% paid ≈ 2.6% of downloads pay) × $49.99 ≈ **$1.30 per download** in year one. $10k a month gross needs ~7–8k downloads a month.

## 3. Which habit to lead with
### 3a. Comparison
| | Nicotine (vape + pouches) | Alcohol (quit) | Weed | Multi-habit |
|---|---|---|---|---|
| App Store pop./difficulty (AppKittie US) | "quit vaping" 83/28 · "quit nicotine" 75/25 · "quit zyn" 66/24 · "quit smoking" 83/32 | "sober" 89/29 · "quit drinking" **45/17** | "quit weed" 42/17 | "habit tracker" 86/34 |
| Google US/month (DataForSEO) | "how to quit vaping" 18.1k · "quit vaping" 9.9k (+124% YoY) · "nicotine pouches" 110k · "nicotine withdrawal" 18.1k · "quit zyn" 1.6k | "alcohol withdrawal" 33.1k · "how to stop drinking" 9.9k · "sobriety calculator" 6.6k · "quit drinking" 2.4k | "weed withdrawal" 6.6k · "quit weed" 2.9k | "bad habits" 33.1k |
| Leaders (est./mo) | Smoke $62k, Smoke Free $36k, Kwit $35k, QuitSure $35k, Quit Vaping $19k, Puff Count $7k; vape pet Breezling (Nov 2, 0 ratings) | I Am Sober $242k, **Tipple $124k**, Sober Time $25k, Sunnyside $20k, Sobo $15k + 4 pet clones | Grounded $13k | Days Since $49k |
| $ per download | quit-smoking median $1.87 | sober median $1.72; Tipple ~$10 | Grounded ~$1.40 | Days Since ~$1 |
| Fit with 23–40 target | Best (vapes and Zyn skew 18–35) | Good (Tipple's Meta reach: 68% women, peak 25–44) | Narrow | Good but vague |
| Safety | Teens vape: 18+, never target them | **Withdrawal can be dangerous** | Mild (peaks ~day 3) | Mixed |
| Pet competition | Almost none | Crowded | None | None |
- **Pick nicotine first:** bigger and rising search, no real pet rival, best age fit, lowest safety risk.
- **Alcohol is the money bet:** proven ~$10 per download with a pet, but head-on with Tipple and the heaviest safety load.
- Ship all three habits on day one (one habit model); lead marketing with nicotine.
- If alcohol's demand-test sign-up rate is more than 1.5× nicotine's, swap the lead.
- Skip "ditch" wording for vaping: Truth Initiative's teen quit text code is DITCHVAPE.

### 3b. Custom product pages
Up to 70, each tied to search keywords ([Phiture](https://phiture.com/blog/keyword-based-custom-product-pages-cpps-arrive-in-app-store-connect/)):
- **Nicotine (default page):** "quit vaping / nicotine / zyn". Screens: vape year cost, day-3 storm, pond.
- **Alcohol:** "quit drinking / sober / sobriety counter". Lead with the honest trial and "no AI chat"; safety line visible.
- **Weed:** "quit weed / weed withdrawal".
- **Cigarettes:** "quit smoking". Strongest sourced timeline (WHO, CDC).

### 3c. Safety lines (shown, not hidden)
- **Alcohol (onboarding and Help):** "Drinking every day? Talk to a doctor before you stop. Stopping suddenly can be dangerous if your body depends on alcohol." ([NHS](https://www.nhs.uk/conditions/alcohol-use-disorder/): withdrawal starts 6–12 h after the last drink, usually lasts 3–7 days, can include seizures; "Call 999 or go to A&E" for severe symptoms.)
- **Help numbers (re-check before shipping):** US: SAMHSA 1-800-662-4357, 988, 1-800-QUIT-NOW. UK: 111/999, Drinkline 0300 123 1110, Smokefree 0300 123 1044. Under-18 vapers: Truth's free "This is Quitting".
- **Everywhere (1.4.1):** "Not medical advice. Check with a doctor before medical decisions." No "lungs 43% healed" meters.

## 4. Health milestones (App-Review-safe: on-screen source, "may", population facts, not personal predictions)
| Habit | When | Fact (keep wording close) | Source |
|---|---|---|---|
| Smoking/nicotine | 20 min | Heart rate and blood pressure drop | [WHO](https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation) |
| | 12–24 h | Blood CO back to normal (12 h); nicotine in blood reaches zero (~24 h) | WHO; [CDC](https://www.cdc.gov/tobacco/about/benefits-of-quitting.html) |
| | First days–2 wks | Withdrawal strongest in the first days; worst lasts a few days to a couple of weeks | [Smokefree.gov](https://smokefree.gov/challenges-when-quitting/withdrawal/understanding-withdrawal) |
| | Days–weeks | Taste and smell improve, breathing easier, more energy | [NHS](https://www.nhs.uk/better-health/quit-smoking/benefits-of-quitting-smoking/) |
| | 6 weeks | Mental-health benefits can start | NHS |
| | 2–12 wks / 1–9 mo | Circulation and lung function improve / coughing and breathlessness decrease | WHO |
| | 1 / 10 / 15 yrs | Heart-attack risk halves / lung-cancer death risk halves / heart risk like a never-smoker | NHS, WHO |
| Vaping only | — | Long-term data is thin: use withdrawal and money facts; keep the smoking timeline on the cigarettes page | [Truth Initiative](https://truthinitiative.org/news/quitting-vaping-here-are-5-tips-handling-nicotine-withdrawal) |
| Alcohol | 6–12 h → 3–7 days | Withdrawal window (a safety note, not a reward) | [NHS](https://www.nhs.uk/conditions/alcohol-use-disorder/) |
| | Ongoing | "Drinking less is better for your health than drinking more"; heavy drinking raises risk of cancer, liver disease, high blood pressure, poor sleep | [CDC](https://www.cdc.gov/alcohol/checkyourdrinking/index.html) |
| | Weeks | More energy, better sleep, mood and memory; fewer calories | [NHS Better Health](https://www.nhs.uk/better-health/drink-less/) |
| Cannabis | 24–48 h / day 3 / ≤2 wks | Withdrawal starts / peaks / often eases (sleep and dreams can take longer) | [Cleveland Clinic](https://my.clevelandclinic.org/health/diseases/marijuana-weed-withdrawal) |
**Apple 1.4.1:** medical apps "may be reviewed with greater scrutiny", accuracy claims must be backed, and apps "should remind users to check with a doctor". We cite public-health facts and never diagnose or dose.

## 5. Growth
### 5a. How rivals grew
- **Tipple:** Meta ads in the US and UK (AppKittie: 65 US ads, ~380k reach, ~$7.6k visible or estimated spend; 68% women, peak 25–44); no organic social detected. Revenue +1,100% in 90 days while downloads fell 41%: monetization tuning (price variants up to $99.99), not just reach.
- **Puff Count:** founder-led organic TikTok (120k followers) to ~$5k a month, then paid ads to ~$44k MRR, then sold ([Starter Story](https://www.starterstory.com/puff-count-breakdown), [founder](https://saas-accelerator.beehiiv.com/p/why-i-sold-my-44k-mrr-app)).
- **QUITTR:** influencers plus organic success stories ([Starter Story](https://www.starterstory.com/businesses/quittr/growth-channels)); ~$3M a year reported ([The Week](https://theweek.com/health/the-app-tackling-porn-addiction)).
- **I Am Sober:** no ads or social detected; search, word of mouth, 191k ratings.
- **Sobo, DreamMe, Grounded, Quit Vaping:** organic TikTok and Instagram (AppKittie). Sobo ran a paid UGC program (a 1★ review alleges unpaid creators); DreamMe was called "AI slop" for an AI TikTok account.
- **Lesson:** the free path is a mascot account plus App Store search. Use ads only after paywall conversion is proven.
- **TikTok context:** average views per post fell 31% YoY in early 2026; video got 5.6× the views of carousels ([Metricool via NetInfluencer](https://www.netinfluencer.com/tiktok-content-volume-up-nearly-80-percent-in-early-2026-as-per-post-performance-declined-report-finds/)).

### 5b. Ten duck videos (faceless, 10–20 s, drawn duck, no AI footage)
1. **"Your vape is a subscription":** receipt "$1,300/yr", hold to ditch, DITCHED.
2. **"Day 3 is the worst day":** storm night, the duck brings a blanket (sourced caption).
3. **Day 1 vs day 100** pond timelapse.
4. **"What $8 a day bought instead":** trainers, then a concert ticket, then a flight.
5. **"Craving? Do this for 2 minutes":** SOS stone-skim, filmed live.
6. **Rare find reveal:** "Day 47: the golden feather (1 in 100)", odds on screen.
7. **"I slipped on day 12. My duck didn't leave."**
8. **"Vape" texts the duck "u up?"**, dry reply.
9. **Pouch edition:** a Zyn tin tower falls over at the duck's desk.
10. **"Red flags in quit apps":** trial with no reminder, AI chat, 35 questions, and what we do instead (no rivals named).

### 5c. Two-week demand test
- **Setup:** 3 waitlist pages on the existing Cloudflare site (vape / drinks / weed), each with an email field and one follow-up: "Would you pay $49.99/yr after a free week?" (Yes / Maybe / No). One new TikTok + Reels + Shorts account; 20 posts (the 10 ideas × nicotine and alcohol cuts), 1–2 a day. Optional $150 of Meta traffic split evenly, for a clean comparison. Emails are collected on the website, not in the app; add a site privacy note.
- **Pass (all):** **≥15% visitor→sign-up from social** (waitlist median ~11% per [LaunchList](https://app.getlaunchlist.com/glossary/waitlist-conversion-rate); all-industry landing median 6.6% per Unbounce, cited there; vendor data), **≥300 sign-ups**, **≥25% "Yes, I'd pay"**, and at least one video ≥10k views with a median ≥1k.
- **Kill or rethink:** <5% conversion or <100 sign-ups. **Lead habit:** the page with the higher sign-up rate wins.

## 6. Names (iTunes Search, Nov 18; **all need a lawyer check, none cleared**)
| Name | Idea | App Store collisions | Note | Score |
|---|---|---|---|---|
| **Puddle** | Puddle → pond → lake: growth in one word | None titled "Puddle"; "Puddle & Pile" (lifestyle, 309 ratings), "PuddlePin" | Avoid "Puddle-Duck" (Beatrix Potter) | 8.5 |
| **Pondly** | Pond + friendly | None | Coined, easiest to register; less meaning | 8 |
| **Quackit** | "Quack it" = quit it | None in apps | Quackit.com (web tutorials) exists | 7.5 |
| Quit Pond | Says what it does | None | Good for search, weak trademark | 7 |
| Mallard | The duck | Small business apps only | Reads hunting, older | 6 |
| Duckling | The duck grows up | "Duckling" (social, 0 ratings) + games | Generic | 6 |
| Lilypad | Pond item | **"Lilypad – Earn Screen Time" (2026)** | Adjacent habit app | 5 |
| Waddle | Cute motion | **6 "Waddle" apps since 2025**, incl. "Walk More, Scroll Less" | Crowded | 4 |
| Paddle / Ripple | Pond words | Paddle (payments), Ripple (crypto) | Big brands | 3 |
| Duck Off | Viral pun | Not checked (rate-limited) | Clashes with the kind voice | 4 |
Subtitle idea: "Quit vaping. Grow a pond." (25 of 30 characters).

## 7. Risks and the honest build estimate
### 7a. Art
- **Launch set (~120 assets):** duck in ~10 states (idle, happy, cheer, sleepy, blanket, swim, SOS paddle, hold-to-ditch, slip-hug, celebrate); 3 area backgrounds + 4 season overlays; 36 finds, 12 visitors, 4 eggs, ~10 event scenes; icon set; 4 product-page screenshot sets. **Year one:** ~260 assets.
- **Cheapest good route:** one illustrator for the duck model sheet, style guide and backgrounds (~$1.5–4k); finds and visitors as small sticker batches (~$15–40 each); a **Rive** duck with 4–6 states (freelance multi-state mascot ~$1–3k, interactive Rive $2.5–6k+ per a [freelancer guide](https://dev.to/uianimation/how-much-does-custom-mascot-animation-cost-4c64)); Lottie only for one-off celebrations.
- **Total ~$3–8k.** AI art is cheaper but risks style drift and "AI slop" backlash. The duck needs a professional redraw anyway (CLAUDE.md §8).

### 7b. Reuse vs new (Ditch codebase)
- **Reused (~50–60%):** `domain/money.ts`, `domain/dates.ts`, `domain/reminders.ts` + `services/notifications.ts` (64-cap scheduler); `services/purchases.ts` (StoreKit 2); SQLite migrations; Sunflower UI, onboarding sheets, hold-to-ditch / Ditched moment, year-total reveal, honest paywall, voice, Jest setup; the website stack (waitlist, SEO, share images).
- **New:** habit and day log (off, slip, trigger); pond renderer (layered images + Reanimated); seeded find engine (odds, pity, feathers), eggs and visitors; milestone content system; SOS mini-games; safety screens; Rive duck; widget (WidgetKit + App Group, dev build); iCloud backup; custom product pages.
- **Weeks (part-time, with AI):** design and mockups 2 · core loop and data 3 · pond, finds, art 3 · paywall, StoreKit, widget 2 · TestFlight and review 1–2 = **≈10–12 weeks**, then ~1 week a month for content. The earlier 4–6 weeks (`pivot-niches`) left out the game layer and art.

### 7c. Top risks
1. **Content treadmill:** a year of monthly drops plus art; if updates stop, it "runs out" like Tipple. Mitigation: calendar seasons, rarity variants, a 90-day launch scope.
2. **Distribution and money per install:** Tipple's ~$10 per download pays for ads; ours likely ~$1–3; organic TikTok reach is falling. Mitigation: search pages per habit, the mascot account, and the demand test before building.
3. **Name, review and safety:** trademark (Ditch Labs; DITCHVAPE); 1.4.1 health claims; alcohol withdrawal; teens on TikTok (18+ rating); copycats (Breezling launched Nov 2; 4 sober-pet clones in 2026).

**Spend:** AppKittie 48 credits (log 613 → 661, cap raised 615 → 695); DataForSEO $0.0149 (1 call); Mobbin 4 searches; iTunes and RSS free.
