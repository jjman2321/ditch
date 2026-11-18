# Round 2: "Ditch doomscrolling" with lessons, plus more Ditch niches (Nov 18, 2026)

Builds on `pivot-niches-2026-11-18.md` (17 niches) and `demand-2026-11-18.md`. AppKittie revenue and download numbers are **model estimates** of App Store gross per month: treat them as ranks, not bank statements. They miss web billing (Headway, Nibble and Imprint sell on the web too). Budget: AppKittie ~190 credits (balance 1,693 → 1,504), DataForSEO $0.020 (one US call). Free sources: iTunes Search, App Store review RSS, web.

## 1. Short answer
- **The hybrid already exists, and the learning version earns the least.** Blockers that make you *learn* before you can scroll top out around **$9k/month** (ScrollToll, exam questions). Blockers that make you *do something* (walk, push-ups, chores) earn more (Unrot ~$35k). Plain blockers with a strong character earn far more (Brainrot ~$80k, Opal ~$737k, BePresent ~$920k).
- **The clone wave has started.** At least 7 "Learn to Unlock" apps launched in 2026 (Vocab Lock, LearnLock, LearnToll, Langwish, WordLock, Wisdom Lock, Aconomy). The model estimates **$0** for every one of them.
- **"Focused is where the money is" is half true.** A focused app reaches its first few $k quickly with very few ratings (ScrollToll: 917 ratings, $9k; BibleSwipe: 229 ratings, $8.5k), and it can charge more. But the big earners in both feeds and blockers are broad apps with a strong brand and TikTok reach. Focus wins the first $10k. Distribution and brand win after that.
- **Best focused version: a word/exam card gate.** Ship vocabulary packs and let people bring their own flashcards (CSV/Anki). Content costs almost nothing, demand is rising ("sat vocab" +52%, "study app" +63%), and ScrollToll proves people will pay $45–50 a year. Money facts fit our brand best, but nobody pays for finance lessons (paid apps ~$0).
- **The build is hard either way.** A real lock needs Apple's FamilyControls permission (2026 waits run from 1 day to 4+ weeks), 3–4 native Swift extensions, and a workaround to show a quiz (Apple doesn't let the lock screen open your app). The Shortcuts route ("when TikTok opens, open Ditch first", how one sec works) needs no permission. It's on the App Store today, but setup is fiddly and easy to switch off, and one sec earns ~$1.37 per download vs Opal's ~$4.29.
- **Score: 5.5/10 for the best version** (5.0 for a general "learn instead of scrolling" app). That's below the quit-a-habit app (7.5) and a plain blocker (6.5). **Recommendation:** don't build it as its own app first. Add "scrolling" as a habit inside the "Ditch it" quit app with a Shortcuts pause screen that shows one card. Build a standalone gate only if people actually use that pause.
- **Best new niche: "Ditch the snooze" (wake-up alarm), 6.0.** Alarmy ~$680k/month. Newcomer Wayk reached ~$134k within ~9 months. Apple's new AlarmKit (iOS 26) lets any app ring through silent mode. Runner-ups: a duck self-care pet (Finch ~$1.05M) and vocabulary (~$715k), both 5.5.
- **New name clashes:** Brick's app is called **"Brick - Ditch Distractions"** (60.7k ratings) in exactly the doomscroll space. A new **"Camera Roll Cleaner - Ditch"** app plus a PICDITCH trademark filing (Mar 2026) touch the photo cleaner niche.

## 2. Deep dive: Ditch doomscrolling with lessons inside

### 2a. Market map (AppKittie est. gross $/month · US ratings · released)
| App | What it does | $/mo est. | Ratings | $/download |
|---|---|---|---|---|
| BePresent | Blocker, challenges | ~$920k | 71.9k | 3.07 |
| Opal | Blocker, sessions (company says $10M ARR, Jan 2026) | ~$737k | 91.7k | 4.29 |
| SocialLite | Strips Reels/Shorts, keeps DMs (Jan 2026) | ~$174k | 18.4k | 0.64 |
| Brainrot | Blocker; cute brain avatar rots as you scroll (May 2025) | ~$80k | 23.1k | 1.60 |
| one sec | Shortcuts "pause before opening" | ~$55k | 23.9k | 1.37 |
| Unrot | Earn coins by walking/reading/chores to unlock (Jun 2025) | ~$35k | 57.1k | 1.40 |
| Jomo / ClearSpace / ScreenZen (tips) / Brick ($59 device, free app) | Blockers | $20k / $7k / $10k / $0 app | 2.6k / 9.0k / 54k / 60.7k | – |
| **Hybrid: learn or earn to unlock** | | | | |
| One Thing | Earn screen time | ~$10k | 892 | 0.67 |
| **ScrollToll** | One exam question per app open, spaced repetition (Feb 2026); $49.99/yr | ~$9.0k | 917 | 0.77 |
| BibleSwipe / Bible Focus | Bible verse gate | ~$8.5k / ~$5.1k | 229 / 1.2k | 0.43 / 0.67 |
| Blocus / Fitblock / Fitlock / Grindlocker | Exercise or task gates | $2.6–4.7k | 89–326 | 0.4–0.5 |
| ScrollToStudy | Study feed (Apr 2025) | ~$3.4k | 218 | 0.67 |
| Recess | Your notes → flashcard gate (Aug 2026) | ~$1.3k | 36 | 0.20 |
| Yuno: App Blocker for Japanese | Kana/kanji gate (Sep 2026) | ~$0.3k | 8 | 0.09 |
| 7 "Learn to Unlock" clones (2026) | Vocab/language/wisdom gates | $0 | 0 | 0 |
| **Micro-learning feeds** | | | | |
| Vocabulary (Monkey Taps) | Word a day + widget | ~$715k | 223k | 2.54 |
| Deepstash / Headway / Imprint | Idea cards / book summaries / visual lessons | $690k / $501k / $341k | 93k / 117k / 61k | 1.50 / 12.5* / 1.01 |
| Elevate / Brilliant / Mimo | Brain games / math / coding | $610k / $260k / $180k | 547k / 33.5k / 111k | 3.0 / 4.7 / 3.6 |
| SmartyMe / Yuno (general) / Nibble | Bite-size lessons + quizzes | $270k / $240k / $150k | 63k / 16.6k / 47k | 1.1 / 4.0 / 3.1 |
| Facts (Monkey Taps) / Wiser / Uptime | Daily facts / bite-size / summaries | $104k / $30k / $11k | 70k / 56k / 2.7k | 2.0 / 0.6 / 1.2 |
\* Headway's ratio is inflated by web sales the model attributes to the app.
Search demand: App Store "app blocker" popularity 81 / difficulty 29; "doomscrolling" 55 / 17 (low competition); "brain rot" 17. Google US/month: "brain rot" 110k (−80% in the past year: a fading fad), "doomscrolling" 27.1k (−14%), "brick phone" 27.1k (+61%), "app blocker" 4.4k (+25%), "learn instead of scrolling" 20.

### 2b. What reviewers complain about (latest 50–100 US reviews)
- **Paywall before you can try anything.** Brainrot: 61 of 100 recent reviews ≤2★ ("not even a free trial"). Imprint: 55/100 ("can't learn anything without a payment plan"). ScrollToll: the free tier only unlocks for 5 minutes, and "let students use it free."
- **Billing traps.** Web subscriptions that don't show in Apple settings (Nibble, Headway, Imprint), charges after cancelling a trial (BePresent), an account that hides an old subscription (Brainrot).
- **Updates that change what people paid for.** Unrot: 23/50 ≤2★ after a redesign ("whole different app"). Opal: 21/50 ("glitchy, doesn't relock").
- **Too easy to get around** (one sec toggle, BePresent, Opal), or **too much setup** (one sec emails you the Shortcuts workflow).
- **Thin or wrong content** (Headway "inaccurate summaries", Nibble "AI slop", ScrollToll questions "not real exam level").
- **Lots of teens who can't pay** (Brainrot "I'm just a minor", BibleSwipe, ScrollToll).
- **Our opening:** a real free tier, an honest paywall, no account, "Data Not Collected", and content checked by a human. That's what the 1★ reviews are asking for.

### 2c. Focused angles, ranked (/10, money weighted most)
| # | Angle | Demand evidence | Money evidence | Fit | Content cost | Score |
|---|---|---|---|---|---|---|
| 1 | **Words + bring-your-own flashcards** (SAT/GRE/everyday words; CSV/Anki import for exams) | "word of the day" 165k; "sat vocab" 6.6k (+52%); "study app" 8.1k (+63%); "anki" 135k | ScrollToll $9k at $49.99/yr; Vocabulary $715k (no gate) | 6.5: "Ditch the scroll, learn a word" | Low: ~1,000 words written once; users bring the rest | **6.0** |
| 2 | "Learn one thing" (facts, history) | "fun facts" 201k (+23%); "history facts" 9.9k (+33%) | Facts $104k (no gate); Epictok $4k | 5 | Medium: 500+ sourced facts | 5.0 |
| 3 | Money facts / finance literacy | "financial literacy" 33.1k (−6%); "learn about investing" 880 (−50%) | Finance learning apps ~$0 (Zogo bank-funded; Bloom $0 est.; data thin) | 9 | Medium, plus a "not advice" line | 4.5 |
| 4 | Language while blocked | "learn japanese" 12.1k (−21%); "learn spanish app" 27.1k (−40%) | Yuno JP $306; Langwish $0; Duolingo owns the category | 5 | Medium: per-language packs (JMdict CC BY-SA) | 4.0 |
| 5 | Med/exam decks only | small, high-intent audience | ScrollToll student plan $44.99/yr | 4 | Users bring decks | inside #1 |
| 6 | Faith (Bible verses), found in research | – | BibleSwipe $8.5k, Bible Focus $5.1k on tiny rating counts | 2: off-brand for a dry duck | Low (public-domain KJV) | 4.0 |
| 7 | Kids/teens | parents search "parental controls iphone" 9.9k (−34%) | Teens can't pay; parents buy parental-control apps instead | 3 | – | **3.0, avoid** |
Kids/teens risk: a lock for a child needs a parent's Family Sharing approval, which makes it a parental-control app. Apple's Kids Category bans third-party analytics and ads and requires parental gates. US state app-store age laws are adding consent steps for minors. Reviews show teen users mostly churn at the paywall. Rate 17+ or 12+ and market to adults.

### 2d. Build reality
| | Real lock (Screen Time API) | Shortcuts "open Ditch first" (one sec's way) |
|---|---|---|
| Apple permission | FamilyControls distribution entitlement. 2026 forum reports: 1 day to 4+ weeks, backlog acknowledged | None |
| Native work with Expo | `react-native-device-activity` or `expo-app-blocker` config plugins; App Group; Shield + ShieldAction + DeviceActivityMonitor extensions; dev build only | One Swift App Intent (iOS 26 `.foreground(.dynamic)` avoids the open-loop bug); dev build |
| Showing the quiz | The shield screen only shows text and 2 buttons and **can't open your app** (Apple: "not currently supported"). Workaround: a notification "tap to answer" | Your own screen opens right away, with full freedom for the quiz UI |
| Weak spots | Bugs on iOS updates (Opal reviews), setup permissions | User must add one automation per app by hand (no programmatic setup); the app shows for a second first; one tap turns it off |
| App Review | Clear path once the entitlement is granted | one sec has shipped this way since 2020 ($55k/mo est.) |
| Money signal | Opal $4.29, BePresent $3.07 per download | one sec $1.37 per download |
Plan if built: start with Shortcuts (4–6 weeks), request the entitlement on day 1, add "strict lock" as Pro when it arrives. Reuse from Ditch: StoreKit, SQLite, paywall, duck, hold-to-ditch, notifications.

### 2e. Content plan
- **Write once, keep small.** Ship 300–500 vocabulary cards first (word, plain definition, example, 3 wrong answers), then grow to ~1,000. Definitions in our own words; Princeton WordNet's licence allows commercial use as a base. AI draft plus a human check: about 40–80 hours per 1,000 cards. Add one new pack a month.
- **Bring your own deck:** CSV and Anki `.apkg` import (SQLite inside, same tech we already use). Exam content becomes free and unlimited, with no licensing.
- **Licensing:** facts can't be copyrighted, but wording can. Rewrite Wikipedia facts in our own words (copied text is CC BY-SA: credit plus share-alike). Language data: JMdict/KANJIDIC (CC BY-SA, credit needed), Tatoeba sentences (CC BY). Money facts: cite CFPB/Fed/FTC, no personal advice.
- **Quality is the moat.** The top 1★ complaint for learning apps is "AI slop" and wrong answers.

### 2f. Pricing
Competitors: ScrollToll $9.99/mo · $49.99/yr (student $44.99); Unrot $9.99/wk · $29.99–69.99/yr; Brainrot $4.99/wk · $19.99–59.99/yr; Recess $29.99–39.99/yr; Yuno JP $29.99/yr; one sec $19.99/yr.
Proposed (same as Ditch): **Free:** gate 1 app, 1 starter pack, your own deck up to 50 cards. **Pro:** every app, all packs, unlimited import, strict lock, widget. **$29.99/yr (7-day trial) · $4.99/mo · $49.99 lifetime.** No weekly plan.

### 2g. Year 1 (net after Apple's cut, at month 12)
| | Bear (40%) | Base (45%) | Bull (15%) |
|---|---|---|---|
| Downloads/month at month 12 | ~600 | ~3,000 | ~15,000 (a TikTok hit like Brainrot/Unrot) |
| $/download | ~$0.40 | ~$0.65 (median of learn/earn gates) | ~$1.40 |
| Net $/month | **~$200** | **~$1.6k** | **~$18k** |
Compare: tracker base ~$1.9k, quit app base ~$4.4k, plain blocker base ~$5.1k.

### 2h. Score: 5.5/10 (best version)
Demand 6 · Money 5 · Brand fit 6.5 (Brick already says "Ditch Distractions") · Effort 3.5 · Risk 4.5 (clone wave, entitlement wait, teens). It's a good **feature**, not a strong standalone business.

## 3. New niches (ranked; Effort 10 = easiest, Risk 10 = safest)
| # | Niche | Demand | Top competitors ($/mo est.) | $/DL | Fit | Effort | Risk | Overall |
|---|---|---|---|---|---|---|---|---|
| 1 | **Ditch the snooze** (wake-up alarm, duck quacks, tasks to dismiss) | 7.5: Google "alarm clock app" 27.1k (+36%), "wake up early" +44% | Alarmy $680k (252k ratings), Wayk $134k (Feb 2026, 21k ratings) | 1.74 / 1.00 | 7 | 5 (AlarmKit Swift module, iOS 26+) | 5 (Alarmy dominant, weekly plans) | **6.0** |
| 2 | Duck self-care / habit pet | 8: App Store "virtual pet" 84 / diff 29 | Finch $1.05M (777k), Musa $65k, Callie $21k, Cub $16k | 3.34 | 6 (the duck works, "Ditch" doesn't) | 3 (lots of art) | 6 | **5.5** |
| 3 | Vocabulary / word a day (+ widget) | 7: "word of the day" 165k (−8%) | Vocabulary $715k (DL +40%), WordPal $76k, 26s $45k | 2.54 | 5.5 | 7 | 6 | **5.5** |
| 4 | Mascot focus timer ("ditch procrastination") | 6.5: "procrastination" 135k (mostly reading, not apps) | Focus Friend (Hank Green) $130k, Study Bunny $77k, Doer $3.4k | 2.57 | 5 | 6 | 7 | 5.0 |
| 5 | Daily facts | 7: "fun facts" 201k (+23%) | Facts $104k, Epictok $4k | 2.00 | 4.5 | 7 | 7 | 5.0 |
| 6 | Ditch caffeine | 4.5: "caffeine tracker" 64 / diff 26; "caffeine withdrawal" 33.1k | HiCoffee $8.4k, Caffeine App $5.6k | ~1.0 | 8 | 8 | 8 | 4.5 (habit in Ditch it) |
| 7 | Impulse buys / cooling-off list | 4.5: App Store 51 / diff 18; Google 9.9k | Stop Impulse Buying $1.9k; 5 others <$150 | 0.90 | 9.5 | 9 | 8 | 4.5 (feature in tracker) |
| 8 | Kids chores | 4: "chore chart" 14.8k (−14%) | Happy Kids Timer $13k, Joon $5k*, Habit Owl $4k | 1.6 | 4 | 6 | 3 (kids rules) | 3.5 |
| 9 | Nail biting / skin picking | 4: Google 33.1k (+28%), but apps tiny | Best $787 | 0.40 | 7 | 7 | 6 | 3.5 |
| 10 | No-buy / fast fashion / wardrobe | 4: "capsule wardrobe" 33.1k | No-buy apps ~$0 (6 launched 2026); Whering 12k ratings | ~0 | 8 | 8 | 7 | 3.5 |
| 11 | Rubber-duck journal (talk it out to the duck) | 3: "rubber duck debugging" 2.9k | Generic journals (DailyBean 71k ratings); data thin | – | 7 | 7 | 7 | 3.5 |
| 12 | Negative self-talk | 3: 2.4k | Clarity CBT (29k ratings), Self-Talk+ | – | 4 | 6 | 4 (mental-health claims) | 3.0 |
| 13 | Takeout / delivery spend | 2: Google ~10–20 | Cook Well $3.5k | 0.6 | 9 | 8 | 8 | 3.0 (habit in Ditch it) |
| 14 | Zero waste / plastic | 2.5: "zero waste" 3.6k (−31%) | Marketplaces (Too Good To Go) | – | 5 | 6 | 7 | 2.5 |
Skipped after a quick look: pregnancy cravings (no paid apps found) and a Duolingo-style language mascot (Duolingo ~$48M/month owns it). \* Joon sells mostly on the web.
**Pattern:** money-themed "ditch" niches (impulse buys, takeout, no-buy, caffeine) fit the brand best but earn little alone. They belong as habits inside "Ditch it" or as features in the tracker. The niches that pay are character-led daily-use apps (alarm, pet, words).

## 4. Updated overall top 5 (old 17 + new)
| # | Idea | Score | Why |
|---|---|---|---|
| 1 | **"Ditch it": quit a costly habit** (vape, drink, sugar, plus scrolling, caffeine, takeout, impulse buys as extra habits) | **7.5** | Every brand piece does a job; base ~$4.4k/mo; absorbs 5 of the small niches above |
| 2 | Screen time blocker (plain or earn-it) | 6.5 | Biggest money; entitlement plus Swift extensions |
| 3 | **Ditch the snooze** (alarm) | 6.0 | Proven big market, AlarmKit opens the door, duck fits waking up |
| 4 | Photo cleaner / general habit tracker (tie) | 6.0 / 6.0 | Cleaner now faces "Camera Roll Cleaner - Ditch" + PICDITCH, so treat it as 5.5 |
| 5 | Doomscroll + learn gate / duck pet / vocabulary (tie) | 5.5 | Real money exists but the gate tops out low; pet is art-heavy; words are dominated by Monkey Taps |

## 5. Name and trademark clashes (App Store search + trademark directories; not legal advice)
- **Brick - Ditch Distractions** (Brick LLC, 60.7k ratings): "Ditch" as the verb in the doomscroll space. No trademark found on the phrase, but a confusion risk in search. Brick holds a pending BRICK mark (Class 9).
- **Giraffocus: ditch brainrot** (8 ratings): small, same wording.
- **Camera Roll Cleaner - Ditch** (Sep 2026) and **PICDITCH** (filed Mar 14, 2026, Class 9 photo-organizing software): photo cleaner niche.
- **Ditches - Habit Breaker** (2024, 0 ratings), **DitchIt: Phone Book Cleaner** (2026).
- **DINE & DITCH** (filed May 2026, dating apps): not our space.
- **DITCH Reg. 7892534** (Extent Devices, Classes 9/39, boat navigation): not our space.
- Already known: Ditch Labs DITCH Reg. 7296301 (quit vaping), Ditch: Quit Zyn, Ditch: Pay Off Debt, DITCHIT (marketplace, registered Jan 2026).
- No "ditch" apps found for alarm, caffeine, takeout, procrastination or learning. Ask the trademark lawyer about "Ditch" in Class 9 for screen time and alarm use while checking the quit app.

## 6. Sources
- Data: AppKittie API (list, app detail, keyword difficulty), DataForSEO Labs keyword overview (US), [iTunes Search API](https://itunes.apple.com/search), App Store review RSS (Unrot, Brainrot, ScrollToll, one sec, BePresent, Opal, Recess, Imprint, Headway, Nibble, Yuno, BibleSwipe).
- Apps: [ScrollToll](https://apps.apple.com/us/app/id6757320347), [Unrot](https://apps.apple.com/us/app/id6746537171), [Brainrot](https://apps.apple.com/us/app/id6744338972), [Recess](https://apps.apple.com/us/app/id6777757202), [Yuno JP](https://apps.apple.com/us/app/id6812043270), [BibleSwipe](https://apps.apple.com/us/app/id6791399960), [Brick](https://apps.apple.com/us/app/id6448794069), [Wayk](https://apps.apple.com/us/app/id6758021281), [Alarmy](https://apps.apple.com/us/app/id1163786766), [Focus Friend](https://apps.apple.com/us/app/id6742278016), [Finch](https://apps.apple.com/us/app/id1528595748), [Camera Roll Cleaner - Ditch](https://apps.apple.com/us/app/id6804876077).
- Revenue claims: [Opal $10M ARR (company blog)](https://opalapp.com/blog/screen-time-next-big-category), [RevenueCat podcast on Opal](https://www-docs.revenuecat.com/blog/growth/kenneth-schlenker-sub-club-podcast-2026/), [Brainrot founder story](https://www.wearefounders.uk/he-built-an-app-to-fix-his-phone-addiction-it-made-26k-in-30-days/), [Unrot estimates (Adapty)](https://adapty.io/paywall-library/unrot/).
- Build: [one sec Shortcuts setup](https://tutorials.one-sec.app/en/articles/10309122), [open-source one sec alternative (iOS 26 App Intent)](https://dev.to/eliguzz/building-an-open-source-one-sec-alternative-breaking-the-shortcuts-infinite-loop-thanks-to-ios-26-ka4), [react-native-device-activity](https://npmjs.com/package/react-native-device-activity), [expo-app-blocker](https://cdn.jsdelivr.net/npm/expo-app-blocker@0.1.77/README.md), [FamilyControls waits](https://developer.apple.com/forums/thread/812332), [13 days no response](https://developer.apple.com/forums/thread/826427), [shield can't open app](https://developer.apple.com/forums/thread/766644), [AlarmKit (MacRumors)](https://www.macrumors.com/2025/06/11/ios-26-third-party-alarm-apps/), [expo-alarm-kit](https://www.pkgstats.com/pkg:expo-alarm-kit).
- Trademarks: [DITCH 97814961](https://markinton.com/trademark/ditch-97814961), [DITCHIT 98584646](https://markinton.com/trademark/ditchit-98584646), [PICDITCH 99702913](https://markinton.com/trademark/picditch-99702913), [DINE & DITCH](https://markinton.com/trademark/dine-ditch-99829514), [BRICK 99066015](https://markinton.com/trademark/brick-99066015).
