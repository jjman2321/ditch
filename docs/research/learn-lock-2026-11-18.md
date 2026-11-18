# Learn-to-unlock for students: "review your flashcards to open TikTok" (Nov 18, 2026)

Builds on `niches-round2-2026-11-18.md` §2 (not repeated). **Revenue and download figures are AppKittie model estimates** of App Store gross per month (US-heavy). Read them as ranks, not bank statements. For apps with fewer than 50 ratings the download numbers are especially noisy.
**Method:** iTunes Search (45 terms, ~1,160 apps screened), AppKittie (94 credits: 6 keyword scores, 2 searches, 20 app details), one DataForSEO call (Google US, $0.016), App Store review RSS (10 apps, ~190 reviews), App Store pages, Anki forums, Apple docs and forums, GitHub.

## 0. Short answer
- **The student flashcard lock is the most crowded corner of an already crowded space.** About **89 learning/quiz app locks** have launched on iOS since Jan 2025 (78 of them in 2026). 82 of the 89 have fewer than 50 US ratings.
  - Only **ScrollToll** earns real money (~$9k/mo, 920 ratings, revenue +65% in 90 days).
  - The next tier makes **$1–3k/mo** (Study Guard, Delay, Exam Master, Recess, QuizLok).
- **An Anki-import lock already exists on iOS, 7 times over, and none of them make money.** AnkiLock (free, tips ~$0.9k/mo, "2,000+ students"), FareGate, Bauble, CardGate, Braintoll, Quizkey and Guru all import Anki decks or sync with Anki. Every one except AnkiLock has ≤8 ratings and an estimated $0.
- **The demand is real but small and loud.** An Anki forum request ([Feb 2026](https://forums.ankiweb.net/t/block-social-media-until-daily-reviews-are-done/68810)) got 591 views and 8 replies, and a community wiki lists 8 Anki blockers. AnkiLock's reviews are glowing ("crushed a 2,000-card backlog in 14 days"). Anki users *want* this, but the free/hobby versions already satisfy them.
- **ScrollToll wins with ready-made exam content, not your-own-cards.** It ships MCAT, USMLE, NCLEX, LSAT and SAT packs, has "Exam" in its title and runs Meta ads (ad count +264% in 30 days). Recess works the way AnkiDecks would ("send your notes, get a deck, then a gate") and earns ~$1.3k.
- **Duolingo is testing "Focus Mode"** ([May 2026](https://www.tubefilter.com/2026/05/20/duolingo-focus-mode-screen-time-cap-limit/)), which locks other apps until your lessons are done. That closes the language angle.
- **The AnkiDecks synergy is real in theory but worth ~0 today.** AnkiDecks is pre-build with no traffic. The plan also hits two hard walls:
  - **(1) Trademark.** You can't put "Anki" in an App Store title or keyword field. Ankitects filed ANKI in Class 9 (Apr 2025), Anki Pro was renamed Noji, and Apple guideline 2.3.7 bans others' trademarks in keywords. So the cheap "anki" keyword (popularity 34, difficulty 12) is out of reach.
  - **(2) Split reviews.** Reviews done in our app don't count in the student's real Anki collection. iOS gives no way to read AnkiMobile's progress, which is why AnkiLock and FareGate need a desktop add-on.
- **Score for the best version, (b) bring-your-own cards for exam students: 5.0/10.** That's below the duck-pond quit app (7.0 on the same scale). **Call: don't build it now.** Keep the idea as AnkiDecks' second product once AnkiDecks has traffic, or as a "scrolling" habit inside the quit app.

## 1. The student flashcard-lock market (iOS, US)
### 1a. Apps that gate social apps behind flashcards, quizzes or Anki
| App (released) | What it does | Rev/mo est. | US ratings | Price (US) | Anki/CSV import |
|---|---|---|---|---|---|
| [ScrollToll](https://apps.apple.com/us/app/id6757320347) (Feb 2026) | 1 exam question per unlock; MCAT/USMLE/NCLEX/SAT/LSAT/Chinese packs; photo of notes → pack | **~$9.0k** (+65% 90d; DL −28%) | 920 | $9.99/mo, $49.99/yr (testing $69.99), student $44.99/yr, weekly $4.49 | No ("Anki only works when you open Anki") |
| [Study Guard](https://apps.apple.com/us/app/id6744607430) (Apr 2025) | AI flashcards from PDFs, lock | ~$2.7k | 390 | $19.99–34.99/yr, weekly $4.99, lifetime $79.99 | No |
| [Delay](https://apps.apple.com/us/app/id6749641307) (Jan 2026) | Practice questions plus games, "loan" and betting mechanics | ~$2.3k | 106 | $59.99/yr, $9.99/mo, weekly $4.99, family $17.99/mo | Own material |
| [Recess](https://apps.apple.com/us/app/id6777757202) (Aug 2026) | Notes/PDF/slides → deck → gate (**the AnkiDecks idea**) | ~$1.3k | 36 | $29.99–39.99/yr | No |
| [Exam Master](https://apps.apple.com/us/app/id6743142831) / [QuizLok](https://apps.apple.com/us/app/id6761145492) | AI quizzes from notes / topics | ~$1.3k / ~$1.0k | 17 / 14 | $59.99/yr / $49.99/yr | No |
| [AnkiLock](https://apps.apple.com/us/app/id6748466549) (Dec 2025) | Locks apps until your **real Anki** daily goal is met (desktop add-on + account) | ~$0.9k (tips only) | 27 (4.9★) | Free, tips $2.99–9.99 | Syncs via desktop Anki |
| TakeTime, Proll (SAT), ScrollScholar, Study Lock, Quizlock | Study/SAT question gates | $0.3–0.7k each | 11–20 | $34.99–69.99/yr, most with weekly plans | No / PDF |
| [FareGate](https://apps.apple.com/us/app/id6789437518) (Aug 2026) | Your Anki deck, reviews **sync back** via open-source desktop bridge | $0 | 2 (1.5★) | – | .apkg + bridge |
| [Bauble](https://apps.apple.com/us/app/id6789819513), [CardGate](https://apps.apple.com/us/app/id6761844846), [Braintoll](https://apps.apple.com/us/app/id6819666916), [Quizkey](https://apps.apple.com/us/app/id6816228252), [Guru](https://apps.apple.com/us/app/id6757980593) (May–Oct 2026) | .apkg import (media, cloze, image occlusion, FSRS) + lock | $0 each | 0–8 | Guru $24.99 lifetime; others subscription | **.apkg**, CSV |
| ~70 more 2026 "Study/Learn to Unlock" clones (Slate, LockToLearn, Emberlock, Scrollar, Clavis, SAT Locker…) | Same | ~$0 | 0–5 | – | Some CSV |
| *Different model:* [Scroll The Bible](https://apps.apple.com/us/app/id6756558351) (Dec 2025) | A TikTok-style **feed** of Bible content, not a gate | ~$882k | 20.8k | $29.99–39.99/yr | – |
Android signals: [AnkiBlock](https://github.com/TrimeraDev/AnkiBlock) (open source, reads AnkiDroid locally, 12 GitHub stars), "Blocker", [ProcrastiLearn](https://f-droid.org/packages/com.procrastilearn.app/) (F-Droid). Desktop add-ons: FocusForce, Dopamine, Micromanager ([wiki](https://forums.ankiweb.net/t/awesome-app-social-media-blockers-for-anki/70673)). All are free hobby projects.

### 1b. What reviews say (latest ~190 US reviews)
- **Love:** "2nd UWorld", "30 questions a day without trying", "ADHD life hack", "finally finished my Anki cards", Anki widgets, friend leaderboards (AnkiLock), "doesn't feel like being forced off my phone".
- **Hate:**
  - **Paywalls students can't afford.** ScrollToll 13/58 reviews ≤2★: "just let students use it free", "free version only unlocks 5 min", "$9.99 PER MONTH". Recess: "only way to use it is to pay."
  - **Bugs after updates** (Study Guard 8/11 ≤2★: AI deck generation fails; Delay "stopped blocking after update"; XLocker 33/48 ≤2★).
  - **Questions too easy / "not real exam level".**
  - **AnkiLock setup:** "you have to install Anki desktop, sync phone → desktop → AnkiWeb…"
- **Who pays:** high-schoolers churn at the paywall. Parents show up ("installed on my child's phone"; Delay sells a family plan). Pre-meds and med students pay; ScrollToll's paying reviewers are mostly MCAT/USMLE.

### 1c. Was "Anki before Instagram" asked for? Yes, by a niche.
- **AnkiWeb forum, Feb 2026:** "an option in AnkiMobile to temporarily block social media apps until daily reviews are done" (591 views, 8 replies). One reply: "Just delete your social media apps." Another parent cites Duolingo doing it.
- **r/Anki:** at least 3 developer launch posts (AnkiBlock, AnkiBlocker, a "non-uninstallable blocker"), linked from the [forum thread](https://forums.ankiweb.net/t/block-social-media-until-daily-reviews-are-done/68810). Reddit itself blocks automated reads, so we have no vote counts. I found no r/medicalschool or r/premed thread about these apps.
- **Read:** Anki power users build this themselves and share it for free. That's a sign of real demand with low willingness to pay, the same pattern as the Anki add-on world.

## 2. Demand and money
**App Store (AppKittie, US, popularity / difficulty out of 100):** "flashcards" 90/32 · "app blocker" 81/29 · "screen time" 81/32 · "study timer" 80/29 · "focus app" 51/23 · "study app" 37/16 · "anki" 34/12 (can't target: trademark) · "learn to unlock" 11/7.
**Google US / month (DataForSEO):** "anki" 135k (flat) · "screen time" 49.5k (+49%) · "anki flashcards" 27.1k (−33%) · "anking" 8.1k (+22%) · "study app" 8.1k (+22%) · "study timer" 6.6k · "anki deck" 6.6k · "app blocker" 4.4k · "anki ios" 480 · "mcat app" 320 · "pdf to anki" 140 · "anki alternative" 140 (+143%) · "app blocker for studying" 40 (+250%) · "study to unlock" / "block apps until study" / "duolingo focus mode" ≈ 0.
**Money per download (est. gross ÷ downloads):**
| Group | Apps | $/download |
|---|---|---|
| Study apps | AnkiMobile ($24.99 paid, ~$1.05M/mo) **14.3** · Quizlet 5.0 · Noji 4.3 · Knowt 2.0 · Flashka 0.7 | median ~4 |
| Blockers | Opal 4.29 · BePresent 3.07 · Brainrot 1.60 · Unrot 1.40 · one sec 1.37 | median ~1.6 |
| **Study locks** | ScrollToll 0.77 · Study Guard 0.27 · Delay 0.21 · Recess 0.20 · QuizLok 0.24 · AnkiLock 0.11 (tips) | **median ~0.25** |
- **Students vs parents:** med/pre-med/nursing students pay for themselves (AnkiMobile's $25 upfront price, UWorld, AnKing). High-schoolers mostly can't (SAT gates earn $0.5–0.7k), and their parents buy parental-control apps. Education has a long trial tail ([Adapty 2026](https://adapty.io/blog/mobile-app-monetization-2026/): only 71% of trials start on day 0, subscription LTV ~$45).
- **Synergy check (AnkiDecks):**
  - *Real:* same buyer (exam students with money), same file (.apkg/CSV), and a natural "send this deck to your phone lock" button.
  - *Not real yet:* AnkiDecks has zero users (README: "pre-build"), and its SEO needs months. You can't use "Anki" in App Store metadata. And the full AnkiDecks-plus-lock product already exists as Recess (~$1.3k/mo) and ScrollToll's "photo of notes".

## 3. Which version? (scores /10; Build: 10 = easiest; overall weights money most)
| Version | Money | Demand | Winnability | Moat | Build | ASO/SEO | **Overall** |
|---|---|---|---|---|---|---|---|
| (a) General micro-learning lock, our own content | 4 | 5 | 2 (89 clones, Duolingo) | 3 | 4 (content + lock) | 4 ("learn to unlock" 11/7) | **3.5** |
| (b) Bring-your-own cards for exam students (Anki/CSV/AnkiDecks), plus starter exam packs | 5 (ScrollToll proves $9k; BYO apps $0) | 5 (vocal Anki niche) | 5 (no polished leader for BYO, but 7 Anki locks already) | 6 (decks + FSRS history, but the main collection stays in Anki) | 4 (.apkg parse incl. zstd "anki21b", FSRS, 3 extensions) | 5 ("flashcards" 90/32; "anki" off-limits; AnkiDecks SEO later) | **5.0** |
| (c) Language-learning lock | 3 | 4 ("learn spanish app" −91%) | 2 (Duolingo Focus Mode, LingoLock, Gobble, Langwish) | 4 | 4 | 4 | **3.0** |
| (d) Duck-pond quit app, "scrolling" as one habit (`quit-pond-deep`) | 7 | 7 ("quit vaping" 83/28) | 6 | 6 (days-off pond) | 5 (no entitlement for the core; art cost) | 7 | **7.0** |
Moat reality for (b): spaced-repetition history is a switching cost only if *we* are where the student reviews. Med students' 30k-card collections live in Anki, and we can't sync with AnkiMobile. So our lock becomes a second, smaller deck, or needs a desktop bridge (FareGate's route, 1.5★).

## 4. Build reality (Expo, late 2026)
**FamilyControls entitlement: what the owner must do**
1. In the Apple Developer account (Grasp Labs LLC), create 4 App IDs: the app plus ShieldConfiguration, ShieldAction and DeviceActivityMonitor extensions. Create one App Group.
2. Fill in the **Family Controls (Distribution)** request form at `developer.apple.com/contact/request/family-controls-distribution` (sign-in required) **once per bundle ID**. Describe the purpose plainly: "user blocks their own distracting apps; nothing leaves the device."
3. Wait. 2026 forum reports range from 1 day to a month or more ([13 days, no response](https://developer.apple.com/forums/thread/826427); [pending nearly a month](https://developer.apple.com/forums/thread/827181)). Extensions sometimes get approved later than the main app. After ~2 weeks, follow up through Developer Support.
4. Once approved, tick "Family Controls (Distribution)" on each ID and regenerate profiles (EAS credentials). Until then you're limited to local Xcode development builds, with no Expo dev client ([README](https://github.com/kingstinct/react-native-device-activity)).

**Library:** [`react-native-device-activity`](https://github.com/kingstinct/react-native-device-activity) (Expo config plugin, 182★). It generates the 3 extensions and lets you set shield text, colours and two buttons, with actions like close, defer, web request or **notification**.
**Getting from the shield to "review 3 cards":** the shield can't show custom UI or open your app. Apple: "launching your parent app from your Shield Action extension is not currently supported" ([forum](https://developer.apple.com/forums/thread/719905)). The standard workaround: shield button → the extension posts a **local notification** → the user taps it → a deep link opens the quiz → on pass, lift the shield for N minutes and re-apply it with DeviceActivityMonitor ([Expo write-up](https://dev.to/ayumu_kitabayashi_8e0de96/aus-dem-screen-time-sperrbildschirm-die-eigene-app-offnen-shieldaction-kann-es-nicht-eine-3o82), [example PR](https://github.com/kennethteh90/morning-guard/pull/21)). It's 2 taps and feels clunky. one sec avoids it with a Shortcuts automation that opens its own app first, but that needs no entitlement and is easy to switch off.

**App Review risks**
- **Guideline 4.10:** you "may not monetize… Screen Time APIs". Paywall the content and features (more apps, more decks, import, unlock length), never the act of blocking itself.
- Using others' trademarks in the name or keywords (2.3.7), so no "Anki" in metadata. A not-affiliated line in the description is fine (Braintoll does this).
- Age rating and minors: market to 17+ exam students. A kids' version means parental-control rules.
- Re-shield bugs after iOS updates (the top 1★ theme across Opal, Delay and XLocker).

**Time estimate, part-time with AI help:** ~**9–12 weeks** to the store.
- Lock plus notification hand-off: 3–4 weeks.
- .apkg/CSV import, including the newer zstd-compressed collection format and media: 2–3 weeks.
- FSRS reviews ([`ts-fsrs`](https://github.com/open-spaced-repetition/ts-fsrs)): 1 week.
- Onboarding, paywall and StoreKit reused from Ditch: 2 weeks.
- Testing on a real iPhone: 1–2 weeks.
- The entitlement wait runs in parallel. Request it on day 1.

## 5. Pricing, onboarding and paywall norms
| App | Prices (US) | Free tier | Notes |
|---|---|---|---|
| ScrollToll | $49.99/yr, $9.99/mo, student $44.99/yr, weekly $4.49 | 1 app, 5-min unlocks, 1 own pack | Reviews: free tier feels like a trap after the trial |
| Opal | $99.99/yr, $19.99/mo, weekly $4.99–9.99, student weekly $9.99, Pro $49.99 | Basic sessions | 17 onboarding screens (AppKittie funnel) |
| one sec | $19.99/yr, $6.99/mo, lifetime $99.99, family $29.99/yr | Delay on 1 app | Cheapest; Shortcuts-based |
| Unrot / Brainrot | $29.99–69.99/yr + $9.99/wk / $19.99–59.99/yr + $4.99/wk | Near-hard paywall | Brainrot: 61/100 recent reviews ≤2★ about the paywall |
| Recess / QuizLok / Delay | $29.99–39.99 / $49.99 / $59.99 per yr | Hard paywall after onboarding | "Wish that was made clear beforehand" |
- **Norm:** $30–60/yr, a 3–7 day trial, most with weekly plans, and many hard paywalls.
- **If built (fits Ditch rules):** free = gate 1 app, 1 deck up to 200 cards, unlimited reviews (answers the #1 complaint). Pro = all apps, unlimited decks, .apkg import with media, custom unlock length, widget.
  - Prices: **$34.99/yr (7-day trial, reminder 2 days before it ends), $5.99/mo, $59.99 lifetime**, no weekly plan.
  - Use a .edu-free "student" price only if testing shows it lifts conversion.
- **Onboarding (~10 screens):** pick your exam → screen-time shock number → "how many cards before TikTok?" → pick apps → import or pick a starter pack → first card → paywall.

## 6. Final call (ranked)
1. **Duck-pond quit app (d), 7.0.** Still first. Add "scrolling" as a habit using a one-card pause screen built on Shortcuts (no entitlement). This tests demand for the study-lock idea for free.
2. **Student BYO-flashcard lock (b), 5.0.** Worth building only **after AnkiDecks is live and pulling traffic**, as its phone companion, with starter MCAT/USMLE/NCLEX packs (ScrollToll's lesson: content beats "bring your own").
   - Year-1 net at month 12: bear ~$100, base ~$0.9k, bull ~$8k/mo. Assumes 500 / 2,000 / 12,000 downloads a month at $0.25 / $0.55 / $0.80 per download, after Apple's 15%.
3. Language lock (c), 3.0, and general micro-learning lock (a), 3.5: skip.

**Suggested App Store listing, if (b) is built:**
- Title: **"Duck Deck: Study Before Scroll"** (30 chars; no app found with this name; needs a trademark check). Or **"Ditch: Study Before You Scroll"** (30), which shares the "Ditch" verb with Brick ("Ditch Distractions", 60.7k ratings) in the same space.
- Subtitle: **"Flashcard App Blocker & Study"** (29).
- Keywords: flashcards, app blocker, study timer, mcat, usmle, nclex, spaced repetition, apkg, csv, screen time.

**What would change my mind**
- AnkiDecks reaches ~5k monthly visitors, and a "send to phone lock" waitlist gets ≥300 signups. That moves (b) to ~6.5.
- ScrollToll passes ~$25k/mo with BYO-deck users, or AnkiLock adds a paid tier that sells.
- Apple adds a supported "open app from shield" path, which would remove the clunky 2-tap hand-off.
- Duolingo drops Focus Mode, or Ankitects launches an official AnkiMobile lock. The latter would kill (b).
- A 2-week fake-door test for (b) (landing page plus TikTok posts aimed at med students) beats the quit app's test on cost per signup.

## Sources
Apps and data: [iTunes Search API](https://itunes.apple.com/search), App Store review RSS, AppKittie API, DataForSEO Labs. Apps linked in §1a, plus [Opal](https://apps.apple.com/us/app/id1497465230), [one sec](https://apps.apple.com/us/app/id1532875441), [AnkiMobile](https://apps.apple.com/us/app/id373493387), [AnkiLock site](https://ankilock.com/).
Anki world: [forum request](https://forums.ankiweb.net/t/block-social-media-until-daily-reviews-are-done/68810), [blocker wiki](https://forums.ankiweb.net/t/awesome-app-social-media-blockers-for-anki/70673), [AnkiBlock](https://github.com/TrimeraDev/AnkiBlock), [Anki on knock-off apps](https://docs.ankiweb.net/faqs/anki-knockoffs.md), [ANKI trademark notice (r/Anki)](https://reddit.birdcat.cafe/r/Anki/comments/1kdcdu4/looks_like_anki_trademark_will_be_registered_on).
Competition: [Duolingo Focus Mode (Tubefilter)](https://www.tubefilter.com/2026/05/20/duolingo-focus-mode-screen-time-cap-limit/), [PocketGamer.biz](https://www.pocketgamer.biz/duolingo-experiments-with-tool-to-lock-other-apps-until-daily-lessons-are-complete), [Gobble / Cold Turkey (Lifehacker repost)](https://pipedot.org/6Q558).
Apple: [App Review Guidelines (4.10, 2.3.7)](https://developer.apple.com/app-store/review/guidelines/), [shield can't open app](https://developer.apple.com/forums/thread/719905), [entitlement waits](https://developer.apple.com/forums/thread/809190).
Benchmarks: [Adapty 2026](https://adapty.io/blog/mobile-app-monetization-2026/), [RevenueCat 2026](https://www.revenuecat.com/state-of-subscription-apps-2026/).
