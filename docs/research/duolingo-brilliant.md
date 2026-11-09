# Duolingo and Brilliant: onboarding, mascot and paywall research

For: Ditch: Subscription Tracker (iOS, Expo). Written 2026-11-09.

**How this was made.** I pulled every relevant Mobbin iOS flow for both apps and looked at every screen in each flow at full size (not just the flow previews). About 260 Duolingo screens and 100 Brilliant screens were seen, across 30+ flows. Many flows are A/B variants of each other, so some screens repeat. Mobbin is still screenshots. Anything I say about motion is either (a) implied by a mid-animation frame Mobbin happened to capture, or (b) from a cited web source. I mark which.

**Short names used below.** "Duo" = Duolingo's owl. "Super Duo" = the rainbow-gradient Duo used only in Super screens. "Max Duo" = the black Duo used only in Max screens. "Koji" = Brilliant's green blob tutor with one square eye. "3D button" = a filled button with a darker strip along its bottom edge.

---

## Contents

1. Screen-by-screen tables
   - Duolingo: onboarding A, onboarding B, onboarding C, widget tutorial, first lesson, streak + goal, deferred profile, Super paywall (3 variants), plan picker, hearts paywall, Subscription tab, Max, manage/cancel, widgets, reminder settings, streak page
   - Brilliant: onboarding A (Koji voice), onboarding B (speech bubbles), onboarding C, in-app paywall, onboarding paywall (long scroll), single-plan paywall, first lesson, streak, Premium settings
2. Patterns
3. Animation and feel
4. What works / what doesn't
5. Apply to Ditch, screen by screen
6. References
7. Mobbin notice

---

## 1. Screen-by-screen tables

Column key: **#** screen number in the Mobbin flow · **Purpose** · **Layout (top → bottom)** · **Exact wording** · **Mascot** · **Ask** · **Exits** · **Notable UI** · **Link**.

### DUOLINGO

#### D1. Onboarding A (20 screens) — the "full" version with the in-flow Super choice

| # | Purpose | Layout (top → bottom) | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Splash | Solid green. Duo face centred. White wordmark at bottom. | "duolingo" | Face only (eyes + beak), very large | – | – | Brand green fills screen | [flow][d1] |
| 2 | Welcome | Small Duo, wordmark, tagline, two buttons at bottom | "duolingo" / "Learn for free. Forever." / GET STARTED / I ALREADY HAVE AN ACCOUNT | Small, sitting, centred top | – | Sign-in path | Green 3D primary, white outlined secondary. All caps. | [flow][d1] |
| 3 | Mascot intro | Back arrow. Duo centre. Bubble above Duo. CONTINUE at bottom. | "Hi there! I'm Duo!" | ~110pt, centre, one wing waving | – | Back | No progress bar yet | [screen][s-d1-hi] |
| 4 | Set expectations | Same as 3 | "Just **7 quick questions** before we start your first lesson!" | Same size, star eyes, wings up (excited) | – | Back | The count is bold. | [screen][s-d1-7q] |
| 5 | Q1 language | Back + progress bar (tiny dot). Duo top-left. Bubble right. List. CONTINUE pinned. | "What would you like to learn?" / "For English speakers" / Spanish, French, German, Italian, Intermediate English, Japanese… | ~80pt, top-left, holding clipboard + pencil | Choice | Back | CONTINUE grey and flat until a choice is made | [flow][d1] |
| 6 | Q1 selected | Same | French selected | Same | Choice | Back | Selected card: light blue fill, blue border, blue text | [flow][d1] |
| 7 | Interstitial "loading" | No bar. Duo reading on a stack of books. Caps label. Body. No button. | "COURSE BUILDING…" / "Get ready to join the **7 million people** currently learning French with Duolingo!" | Medium, centred, reading | – | – | No button seen, so it likely auto-advances | [screen][s-d1-build] |
| 8 | Q2 level | Same as 5 | "How much French do you know?" / I'm new to French / I know some common words / I can have basic conversations / I can talk about various topics / I can discuss most topics in detail | Top-left | Choice | Back | Signal-bar icons show level | [flow][d1] |
| 9 | Q3 motivation | Same | "Why are you learning French?" / Just for fun / Boost my career / Spend time productively / Connect with people / Prepare for travel / Support my education / Other | Top-left | Multi-select | Back | Square checkboxes on right, emoji icons on left | [flow][d1] |
| 10 | Mascot reacts | Same, 3 ticked | Bubble changes to "Let's prepare you for conversations!" | Same pose | – | Back | The line reacts to the answer, live | [screen][s-d1-react] |
| 11 | Section break | Bubble only, empty body | "Let's set up a learning routine!" | Top-left | – | Back | Lots of white space | [flow][d1] |
| 12 | Q4 goal | List of 4 | "What's your daily learning goal?" / 5 min / day Casual · 10 min / day Regular · 15 min / day Serious · 20 min / day Intense / CTA **I'M COMMITTED** | Top-left | Choice | Back | Commitment wording on the button | [flow][d1] |
| 13 | Payoff | Bubble only | "That's **50 words** in your first week!" | Top-left | – | Back | Number in purple | [screen][s-d1-50] |
| 14 | Notification pre-ask | Bubble. Faded fake iOS dialog in body with a blue arrow at "Allow". | "I'll remind you to practice so it becomes a habit!" / CTA **REMIND ME TO PRACTICE** | Top-left | Notifications | Back. Decline only inside the real iOS dialog. | The mock sits where the real dialog will appear | [screen][s-d1-notif] |
| 15 | Widget ask | Bubble. Phone mock with purple widget (flame "1", Duo). | "I'll cheer you on from your home screen!" / ADD WIDGET / NOT NOW | Top-left | Widget | NOT NOW (green text button) | Real widget art in the mock | [screen][s-d1-widget] |
| 16 | Outcome list | Bubble. 3 icon rows. | "Here's what you can achieve in 3 months!" / Converse with confidence — Stress-free speaking and listening exercises / Build up your vocabulary — Common words and practical phrases / Develop a learning habit — Smart reminders, fun challenges, and more | Top-left | – | Back | Bold title + grey line per row | [flow][d1] |
| 17 | Soft paywall inside onboarding | Two cards | "How do you want to get started?" / Super Duolingo — Faster progress, no ads [RECOMMENDED] / Learn for free — Core learning features, with ads | Top-left | Plan | Pick "Learn for free" | Blue RECOMMENDED tag on Super. No price on this screen. | [screen][s-d1-plan] |
| 18 | Free picked | Same, free selected | Bubble: "Awesome! You can upgrade anytime." | Top-left | – | – | No guilt for choosing free | [screen][s-d1-free] |
| 19 | Placement | Two cards | "Where would you like to start?" / Start from scratch — Take the easiest lesson of the French course / Find my level — Let Duo recommend where you should start learning [RECOMMENDED] | Top-left | Choice | Back | RECOMMENDED moves to match earlier answer ("I know some words") | [flow][d1] |
| 20 | Result | No bar. Duo centre, bubble above. | "Since you know a few words, let's start at **Score 10**!" | ~110pt centre | – | Back | Echoes the user's own answer | [flow][d1] |

#### D2. Onboarding B (20 screens) — differences only

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 2 | Splash → welcome transition | White circle growing from centre over green, carrying Duo + wordmark | "Learn for free. Forever." | Small | – | – | Mid-animation frame: a circle-wipe reveal | [flow][d2] |
| 6–7 | Language list | Locale-aware: "For Tamil speakers" section first, then English | – | Top-left | Choice | Back | Content adapts to device language | [flow][d2] |
| 10 | Attribution survey | Text-only rows | "How did you hear about Duolingo?" / YouTube / X (Twitter) / TV / Friends/family / TikTok / Google Search / News/article/blog / Roblox… | Top-left | Data (marketing) | Back | No icons | [screen][s-d2-hear] |
| 12 | Reaction screen | Bubble only | "Okay, we'll start fresh!" | Top-left, squinting smile | – | Back | Answer gets its own beat | [screen][s-d2-fresh] |
| 13 | Single-select motivation | Bubble already reacts | "Let's ace those tests!" (Support my education picked) | Top-left | Choice | Back | Options re-ordered vs D1 | [flow][d2] |
| 17 | Widget ask | Teal widget art | "Tracking your habit is easier from your home screen!" / ADD WIDGET / NOT NOW | Top-left | Widget | NOT NOW | Different copy than D1 = tested variant | [flow][d2] |
| 18 | After "Not now" | Bubble only | "Okay! You can add my widget any time." | Winking | – | Back | Skip is acknowledged kindly | [screen][s-d2-notnow] |
| – | Missing | No notification step and no Super choice in this variant | – | – | – | – | Shows the steps are A/B tested | [flow][d2] |

#### D3. Onboarding C (24 screens) — differences only

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 4 | Typing bubble | Bubble half-written, confetti bits around it | "Just 7 quick questions" (rest not yet shown) | Jumping, star eyes | – | CONTINUE greyed while typing | Proves a typewriter reveal; button enables when the line ends | [screen][s-d3-typing] |
| 9 | Interstitial | Same as D1-7 | "Get ready to join the **3 million people** currently learning Korean with Duolingo!" | Reading | – | – | Number changes per course | [flow][d3] |
| 21 | Notification pre-ask | Bubble + faded fake dialog + arrow | "I'll remind you to practice so it becomes a habit!" / CTA plain **CONTINUE** | Top-left | Notifications | Back | Neutral CTA in this variant | [screen][s-d3-mock] |
| 22 | Real iOS dialog | Dimmed screen. System alert in the exact spot of the mock. | "'Duolingo' Would Like to Send You Notifications" / Don't Allow / Allow | Dimmed | Notifications | Don't Allow | Mock and real dialog line up | [screen][s-d3-real] |

#### D4. Widget tutorial (3 screens, inside onboarding)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Ask | Bubble + phone mock | "I'll cheer you on from your home screen!" / ADD WIDGET / NOT NOW | Top-left | Widget | NOT NOW | – | [flow][d-widget] |
| 2 | Step 1 | Bubble + jiggle-mode phone drawing | "First, press and hold on your home screen…" / CONTINUE | Top-left | – | Back | Simple flat illustration, "Edit" pill | [flow][d-widget] |
| 3 | Step 2 | Bubble + widget gallery drawing | "Then, tap the "Edit" button and add my widget!" / GO TO HOME SCREEN | Top-left | – | Back | Progress bar keeps moving through the tutorial | [flow][d-widget] |

#### D5. First lesson (34 screens) — grouped

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 3–4 | Motivation framing, split over 2 screens | Duo centre, bubble above | "It can be hard to stay motivated…" → "…so Duolingo is designed to be fun like a game!" | ~110pt centre | – | Back | One thought split with "…" so each line stays short | [flow][d-lesson] |
| 5 | Loading with a fact | Duo reading | "LOADING…" / "By spending just 15 minutes a day on Duolingo, you could learn 100 French words a month!" | Reading | – | – | Wait time used for a value line | [flow][d-lesson] |
| 6–8 | Exercise + correct | X + bar. "NEW WORD" tag. 2×2 picture cards. Bottom sheet on answer. | "Select the correct image" / CHECK / "Correct!" / CONTINUE | None | – | X | Green sheet + sparkles on the correct card | [flow][d-lesson] |
| 9–10 | Wrong answer | Pink sheet | "Incorrect" / "Correct Answer: the man" / GOT IT | None | – | X | Red button | [flow][d-lesson] |
| 11–12 | Graceful skip | "What do you hear?" + "CAN'T LISTEN NOW" | Yellow sheet: "We'll skip listening for 15 minutes." | None | – | Skip | Skip has its own colour (yellow) | [flow][d-lesson] |
| 16 | Combo moment | Duo jumping, confetti | "5 in a row!" | Medium, centre | – | X | Bar turns gold during a streak of right answers | [flow][d-lesson] |
| 17 | Coach mark | Dim overlay + tooltip | "Tap on a word to see its meaning!" | None | – | – | Shown once | [flow][d-lesson] |
| 29 | Difficulty bump | Duo in a headband, sweating | "Great work! Let's make this a bit harder…" | Centre, sliding in | – | X | Warns before it gets harder | [flow][d-lesson] |
| 31 | Big correct | Lightning bolt hits the bar; green cloud burst | "Excellent!" / "10 IN A ROW" | None | – | X | Strong effect saved for "hard" items | [flow][d-lesson] |
| 32 | Review | Duo slides in from right edge | "Let's correct the exercises you missed!" | Cropped at screen edge | – | X | Mascot enters from off-screen | [flow][d-lesson] |
| 34 | Lesson complete | Duo with wings bursting from an egg shell. 3 stat cards. | "Learning legend!" / "You just completed your first lesson!" / TOTAL XP 25 · AMAZING 100% · SPEEDY 1:54 / CLAIM XP | Large, top | – | – | Blue 3D button after the lesson | [screen][s-d5-legend] |

#### D6. After first lesson: streak + goal + widget + profile (16 screens)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Bridge | Duo centre, bubble above | "Now let's help you build a habit of practicing every day." / CONTINUE | Centre | – | – | Blue 3D button | [flow][d-goal] |
| 2–3 | First streak | Flame "1" with burst ring, week strip | "day streak!" / "Practice each day so your streak won't reset!" / WHAT'S A STREAK? / CONTINUE | None | – | CONTINUE | Share icon button | [flow][d-goal] |
| 4–7 | Streak explainer (animated demo) | Week fills to 5, then a miss shows "0", then back to 1 | "A **streak** counts how many days you've practiced in a row" / "Miss a day, and it resets to 0." / "Your streak restarts next time you do a lesson!" | None | – | X | Teaches by simulation, not text | [flow][d-goal] |
| 8 | Pep line | Duo holding flame | "Keep the streak alive!" / "Daily practice is the best way to learn a language. Let's go!" / I'M READY | Large, centre | – | X | – | [flow][d-goal] |
| 9–10 | Goal commit | Table + Duo + bubble | "Commit to learning!" / 7 day streak Good · 14 Great · 30 Incredible · 50 Unstoppable / "Streak goals help you stay committed!" → after pick: "You'll be **2x more** likely to complete the course!" / COMMIT TO MY GOAL | Medium, lower half, holding flame | Goal | – | Bubble updates after pick | [flow][d-goal] |
| 11–12 | Quest progress | Bar animates 25/30 | "Daily Quest update!" / "Earn 30 XP" | None | – | – | Animated fill | [flow][d-goal] |
| 13 | Widget ask (stat) | No bubble; plain headline | "Learners with our widget are **60%** more likely to keep their streak for a month!" / ADD WIDGET / MAYBE LATER | Widget art only | Widget | MAYBE LATER | Claim with a number | [flow][d-goal] |
| 14–15 | Widget how-to | Phone drawings | "Start by holding anywhere on your home screen" / "Tap the "+" button and add our widget!" / NEXT / GOT IT | None | – | – | – | [flow][d-goal] |
| 16 | Deferred profile ask | Duo centre, bubble above | "Create a profile to save your progress!" / CREATE PROFILE / LATER | Centre | Account | LATER | Account asked only after value | [flow][d-goal] |

#### D7. Creating a profile (16 screens)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Soft wall | Duo centre, bubble above | "Don't lose your progress! Let's create a profile." / CREATE PROFILE / LATER | Centre, clipboard | Account | LATER | Loss framing | [flow][d-profile] |
| 2–3 | Age | X + bar. Big title. Field. | "How old are you?" / NEXT / "By signing in to Duolingo, you agree to our Terms and Privacy Policy." | **None** | Data | X | Blue tick when valid | [flow][d-profile] |
| 4–5 | Name | Fields, NEXT inline, social buttons at bottom | "What is your name?" / SIGN UP WITH GOOGLE / FACEBOOK / APPLE | None | Data | Back | – | [flow][d-profile] |
| 6–8 | Email | Uses the name | "What is your email address, Sam Lee?" / "Invalid email address" / "Suggested email" | None | Data | Back | Typo fix suggestion | [flow][d-profile] |
| 9–10 | Password | Field + eye toggle | "Create a password" / CREATE PROFILE | None | Data | Back | – | [flow][d-profile] |
| 11 | Contacts pre-ask | Duo + bubble + faded fake dialog + arrow | "Let's find some friends to have the best experience!" / SYNC CONTACTS / CONTINUE WITHOUT CONTACTS | Wing raised | Contacts | Clear named skip | Skip says exactly what happens | [flow][d-profile] |
| 12–14 | Friends | All pre-ticked | "Add your friends and learn faster together!" / ADD 4 FRIENDS → ADD 2 FRIENDS | None | Social | X | Count lives in the button | [flow][d-profile] |
| 15 | Done | Duo star eyes | "Welcome, Sam Lee! Your profile has been successfully created." / CONTINUE | Centre | – | – | – | [flow][d-profile] |
| 16 | Home | Path | – | – | – | – | – | [flow][d-profile] |

#### D8. Super paywall, onboarding version (19 screens)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Long scroll paywall (bottom) | Benefit list, flying Super Duo, headline, CTA | Unlimited Hearts / No ads / **Speaking and listening** practice on-demand / **Mistakes review** to target your weak areas / **Free entry** to Legendary and timed challenges / "Cancel anytime, no penalties or fees" / TRY FOR $0.00 / NO THANKS | Super Duo, small, flying, winking | Payment | NO THANKS | Indigo 3D button | [flow][d-super19] |
| 2 | Step 1: compare | Dark navy→purple gradient. X top-left. SUPER badge top-right. Table. | "Progress faster in your French course with Super!" / FREE vs SUPER: Learning content ✓✓; Unlimited Hearts, No ads, Skills practice, Mistakes review, Free challenge entry — vs ✓ / START MY FREE WEEK | None | Payment | X | Super column is a raised tinted card | [flow][d-super19] |
| 3 | Step 2: trial reminder promise | Headline, bubble, mascot | "We'll remind you **2 days** before your trial ends" / bubble: "You'll get a push notification on December 24" / "Easy to cancel, no penalties or fees" / START MY FREE WEEK | Super Duo holding a gold bell, ~150pt, centre | Payment | X | A real date in the bubble | [screen][s-d8-remind] |
| 4–5 | Step 3: plans | Super Duo peeking down from top. Two plan cards. Legal text. | "Get started with a **7 day free trial** on Super" / Family Plan $9.99 / MO, 12 mo • $119.99 / Individual [MOST POPULAR] $6.99 / MO, 12 mo • $83.99 / "Cancel anytime in the App Store" / START MY FREE WEEK / VIEW ALL PLANS / "Your monthly or annual subscription **automatically renews**…" | Peeking, cropped | Payment | X | Per-month price big, yearly total small | [screen][s-d8-plans] |
| 6 | All plans | Sections by trial length | "Choose a plan" / 7 DAY FREE TRIAL: Family, Individual / 3 DAY FREE TRIAL: Monthly $12.99 / MO | None | Payment | X | – | [flow][d-super19] |
| 7–11 | Purchase | Button → "SETTING UP YOUR TRIAL…" spinner → Apple sheet → "JUST A BIT LONGER…" → "You're all set." | Apple sheet: "1-week free trial Starting today / $83.99 per year Starting Dec 25, 2024" | None | Payment | Apple sheet close | Button text changes while waiting | [flow][d-super19] |
| 12–14 | Welcome animation | Duo in a white blob → light burst with black silhouette → Super Duo on a white comet | "Welcome to Super Duolingo!" / LET'S GO | Transforms into Super Duo | – | – | Frames show a multi-step transform | [flow][d-super19] |
| 15–17 | Feature tour 1–5 | Numbered stepper at top | "Enjoy continuous learning with **ad-free** lessons" … "Turn on your Super Duolingo app icon to get started!" / NEXT / GREAT! | Other characters | App icon | – | iOS "You have changed the icon" alert | [flow][d-super19] |
| 18 | Trial confirmation | Super Duo, eyes closed, happy | "Your 7-day free trial has started! We'll remind you **2 days** before it ends" / NEXT | Centre | – | – | Repeats the promise after purchase | [screen][s-d8-started] |
| 19 | Home | – | – | – | – | – | – | [flow][d-super19] |

#### D9. Super paywall with "choose your reminder" (14 screens)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Subscription tab | Gradient header + cards | "Subscription" / "COMPARE PLANS" / [RECOMMENDED] Super — "Learn without distractions" ✓Unlimited energy ✓No ads / TRY FOR $0.00 / Super Family — "Share Super and save" ✓For you and 5 others ✓Only $2 more per month | Super Duo in header | Payment | Tab bar | – | [flow][d-sub14] |
| 2–3 | Long paywall | Super Duo bursting from a cloud edge | "Super learners are **4.2x** more likely to finish the French course!" / benefits / "Cancel anytime, no penalties or fees" / TRY FOR $0.00 / NO THANKS | Large, header | Payment | NO THANKS | Correlation stat | [flow][d-sub14] |
| 4 | Compare | Table | "Progress faster in your French course with Super!" | None | Payment | X | – | [flow][d-sub14] |
| 5 | **User picks reminder day** | Headline, Super Duo with bell, 2 option rows | "When should we remind you before your trial ends?" / "2 days before — Dec 14" / "3 days before — Dec 13" / "Easy to cancel, no penalties or fees" / START MY FREE WEEK (disabled until pick) | Holding bell, ~150pt | Payment + choice | X | Real dates on each option | [screen][s-d9-choose] |
| 6 | After pick | Headline updates | "We'll remind you **3 days** before your trial ends" | Winks, rings bell | – | X | Picked row gets gradient border | [screen][s-d9-picked] |
| 7–8 | Plans | Same as D8-4 | Individual $7.99 / MO, 12 mo • $95.99 | Peeking | Payment | X | – | [flow][d-sub14] |
| 9–12 | Welcome + tour | – | "Welcome to Super Duolingo!" / "**Target weak areas** and review mistakes in the Practice Hub" / MORE | Transform | – | – | – | [flow][d-sub14] |
| 13 | Confirmation | – | "Your 7-day free trial has started! We'll remind you 2 days before it ends" | Happy | – | – | Says "2 days" though "3 days" was picked in #6. Could be a stitched recording or a bug. | [screen][s-d9-confirm] |
| 14 | Home | – | – | – | – | – | – | [flow][d-sub14] |

#### D10. Super paywall after profile, 14-day trial (24 screens) — differences

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Compare | **No X on this first frame**; only NO THANKS at bottom | "Super learners are 4.2x more likely to finish the Korean course!" / START MY FREE 2 WEEKS / NO THANKS | None | Payment | NO THANKS only | Close is not visible from the first frame | [screen][s-d10-nox] |
| 2 | Reminder promise | X appears | "We'll remind you **2 days** before your trial ends" / "You'll get a push notification on July 23" | Regular green Duo holding a bell, no bubble | Payment | X | – | [screen][s-d10-remind] |
| 3–5 | Plans | – | "Choose a plan for after your **14 day free trial**" / 14 DAY FREE TRIAL / 7 DAY FREE TRIAL Monthly $12.99 / MO | Peeking | Payment | X | Headline says what happens after the trial | [flow][d-sub24] |
| 6–10 | Purchase | – | Apple sheet: "2-week free trial Starting today / $83.99 per year Starting Jul 25, 2024" | – | Payment | – | – | [flow][d-sub24] |
| 11–15 | Welcome animation | Duo in thought-blob → white light beams + black silhouette → Super Duo on comet → flies off right edge | "Welcome to Super Duolingo!" / LET'S GO | Transform | – | – | 5 frames of one animation | [flow][d-sub24] |
| 16–20 | Tour | Stepper 1–5 | "Don't worry about mistakes with **Unlimited Hearts**" / GOT IT … GREAT! | Other characters | App icon | – | – | [flow][d-sub24] |
| 21 | Confirmation | – | "Your 14-day free trial has started! We'll remind you 2 days before it ends" | Super Duo | – | – | – | [flow][d-sub24] |
| 22–24 | Profile done + coach mark | – | "Welcome, Alex! Your profile has been successfully created." / "Manage your Super features here!" | Duo | – | – | Points to where to manage | [flow][d-sub24] |

#### D11. Plan picker detail (3 screens)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Plans | Super Duo + 2 cards | "Get started with a 7 day free trial on Super" | Peeking | Payment | X | – | [flow][d-choose] |
| 2 | All plans | Sections | 7 DAY FREE TRIAL: Family / Individual / **NO FREE TRIAL**: Monthly $13.99 / MO / START MY FREE WEEK | None | Payment | Back | Says plainly which plan has no trial | [flow][d-choose] |
| 3 | Monthly picked | Same | CTA changes to **CONTINUE** | None | Payment | Back | CTA matches the plan's real terms | [flow][d-choose] |

#### D12. "Run out of hearts" paywall (3 screens)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | In lesson | Heart count 1 | "Tap the matching pairs" | None | – | X | – | [flow][d-hearts] |
| 2 | Hard stop | Bottom sheet, 2 cards | "You ran out of hearts!" / SUPER Unlimited FREE TRIAL (pre-selected) vs Refill 600 gems / TRY 1 WEEK FOR FREE / NO THANKS | None | Payment | NO THANKS | Paid option pre-selected | [flow][d-hearts] |
| 3 | Wait or pay | 3 cards | "You need hearts to start new lessons!" / "Next heart in **4h 15m**" (red) / Unlimited FREE TRIAL · +1 Heart Practice · Refill 500 / PRACTICE TO EARN HEARTS / NOT NOW | None | Payment | NOT NOW | Red countdown | [screen][s-d12-timer] |

#### D13. Subscription tab, Max, manage and cancel

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| T3–5 | Plans tab | Cards + FAQ | Max — "Speak with confidence" / Max Family — "Only $6 more per month" / Gift Super — "Add a personalized note / Lasts all year long / No auto-renewal" / FAQS: "What's the difference between Super and Max?", "Which plan is best for speaking?", "How does Family Plan work?" | Character art per card | Payment | Tab bar | FAQ accordion answers in plain words | [flow][d-subtab] |
| T6–10 | Subscriber view | Header + current plan + upgrades | "CURRENT PLAN" / MANAGE / "It's just you so far! Add up to 5 members to learn with you." / feature rows with action links (START ROLEPLAY, START LESSON) | Header art | – | Tab bar | Features you paid for link straight to use | [flow][d-subtab] |
| M1 | Manage subscription during trial | Card + offers | "We'll send you a notification **2 days** before your trial ends!" / Offers for you: Super Family, Max Individual / CHANGE PLAN | Super Duo | Upsell | Back | Trial promise repeated in manage | [flow][d-max] |
| M2–4 | Max paywall | Black/purple | "**Speak French** with confidence on Duolingo Max" / "Unlock **deeper learning** with Duolingo Max" / TRY FOR $0.00 / NO THANKS | Black Max Duo dabbing | Payment | NO THANKS / X | Separate mascot variant per tier | [flow][d-max] |
| M5 | Reminder promise | – | "We'll remind you **2 days** before your trial ends" / "You'll get a push notification on December 31" | Max Duo + bell bubble | Payment | X | Same pattern as Super | [flow][d-max] |
| M6 | Family upsell | Family pre-selected | "Save up to 76% with Family Plan after your 7 day free trial" / Family $19.99 / MO, 12 mo • $239.99 / Individual [MOST POPULAR] $13.99 / MO | Group art | Payment | X | "Up to 76%" only true per seat with 6 users | [screen][s-d13-76] |
| M7–14 | Plans, purchase, tour | – | Apple sheet "$167.99 per year Starting Jan 1, 2025" / "Turn on your **Max App icon** to show off your new Duo!" | Max Duo | Payment | X | – | [flow][d-max] |
| S1 | Settings | Grouped list | Subscription: "Manage Subscription — Super Duolingo 12 months" / RESTORE SUBSCRIPTION / SIGN OUT / TERMS / PRIVACY POLICY | None | – | DONE | Restore lives in Settings | [flow][d-manage] |
| S2 | Manage | Card + art | "Current Plan" / "Super Duolingo 12 month subscription" / "Next billing date July 25, 2024" / CHANGE PLAN / "We'll send you a notification **2 days** before your trial ends!" | Super Duo with a hula hoop | – | Back | Next billing date shown in-app | [flow][d-manage] |
| C1 | Trial ending notice | Header art + CTA + benefits | "Your Super Duolingo trial will end in **4 days**" / STAY ON SUPER / Super Benefits | Super Duo | Retention | X | In-app trial status | [screen][s-d13-4days] |
| C2 | Cancel step 1 | Super Duo + bell bubble | "Going so soon?" / "We'll remind you **2 days** before your free trial ends" / KEEP SUPER / PROCEED TO CANCEL | Super Duo, worried look | Retention | PROCEED TO CANCEL | Reminds that a warning is coming anyway | [screen][s-d13-going] |
| C3 | Cancel step 2 | Bottom sheet | "If you cancel, you'll start seeing ads again" / KEEP SUPER / CANCEL SUPER (red) | Super Duo | Retention | CANCEL SUPER | Cancel is visible and named | [screen][s-d13-sheet] |
| C4 | Ad-break upsell | Phone art + Super Duo | "Skip ads with a 7 day free trial of Super!" / "We'll remind you before your trial ends" / TRY FOR $0.00 / NO THANKS | Super Duo | Payment | NO THANKS | Reminder promise next to CTA | [screen][s-d13-skipads] |

#### D14. Widgets (7 states), reminder settings, streak page

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| W1 | Not started | Blue widget | "Ready to start learning?" | Duo peeking up, happy | – | – | – | [flow][d-widgets] |
| W2 | Early | Blue, week strip | "6 days" / "Get started early!" | Duo in sweatband, flexing | – | – | – | [flow][d-widgets] |
| W3 | Getting late | Purple | "845 days" / "Please practice!" / "Extend your streak!" | Worried, sweating | – | – | Flame gets a red "!" badge | [flow][d-widgets] |
| W4 | Last chance | Red | "Last chance!" | Arms crossed / slumped crying | – | – | – | [flow][d-widgets] |
| W5 | Threat | Dark red | "Save your streak!" / "Don't forget me!" | Laser eyes / glowing red eyes | – | – | Guilt and menace | [flow][d-widgets] |
| W6 | Done | Magenta | "Don't forget me!" / "Come back soon!" | Sleeping by the flame | – | – | – | [flow][d-widgets] |
| W7 | Lapsed | Navy | "1 week abandoned" / "1 week without French" | Crying ghost / wilted Duo with a rose | – | – | Strong guilt | [flow][d-widgets] |
| R1 | Reminder settings | Grouped list | Practice reminder (push / email chips) / Smart scheduling (toggle) / Reminder time 5:00 PM / Streak Freeze Used / Streak Saver / Early Bird Reward / Night Owl Reward / Weekly progress / RESTORE DEFAULT | None | – | Back | Smart scheduling greys out the time | [flow][d-reminders] |
| K1 | Streak page | Tabs + calendar | "588 day streak!" / "You've kept a **Perfect Streak** for 2 straight weeks. Wow!" / "7 Day Challenge Day 3 of 7" / "22 Days practiced" / "1 Freeze used" / "7-day Streak Shield BUY FOR 3000" | None in header | – | X | Calendar shows the history | [flow][d-streak1] |
| K2 | Empty friends state | Duo hugs Lily + flame | "Start **Friend Streaks** to make daily progress together!" / ADD FRIENDS | Duo, medium | Social | X | Mascot used for the empty state | [flow][d-streak2] |

### BRILLIANT

#### B1. Onboarding A — Koji with voice (21 screens)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Splash | White, black wordmark | "Brilliant" | – | – | – | Very plain | [flow][b1] |
| 2 | Welcome | Photo of a teen + tablet showing Koji helping. Serif headline. Two buttons. | "A world-class tutor for every home" / "Your personal tutor for math and coding. Built by top learning experts from MIT and Harvard." / I'm a learner / I'm a parent or teacher / "Existing user? Sign in" | Tiny Koji inside the photo, with captions "Can you help?" / "Sure! Try looking at it this way." | Role | Sign in | Green pill primary | [flow][b1] |
| 3 | Mascot intro | Back only. Koji centre, text under (no bubble). | "Hi, I'm Koji! I'll be your personal tutor." / Continue | ~90pt centre | – | Back | Charcoal 3D pill button | [screen][s-b1-hi] |
| 4–5 | Goal | Segmented 3-part bar + back. Koji left of title. 2×2 tiles. | "What motivates you to learn?" / Excelling in school / Professional growth / Staying sharp / Helping my child learn | ~60pt, left of title, no bubble border | Choice | Back | Picked tile gets a teal gradient | [flow][b1] |
| 6–7 | Voice choice | Two blank cards + toggle | "How do you want me to sound?" / "Turn up your volume if you can't hear me." / Melodic / Deep / "Voice on" | Koji peeks over a card, then moves **into** the picked card | Setting | Back | Speaker icon appears in the nav from here on | [screen][s-b1-voice] |
| 8 | Promise of help | Koji next to a drag-tile algebra demo | "I'm here to help if you ever get stuck." | Large, beside demo | – | Back | Mini interactive demo | [flow][b1] |
| 9 | Start | Koji on a coordinate grid | "Let's get started." | On grid | – | Back | Glowing axes, points A/B | [flow][b1] |
| 10–11 | Age | Field | "How old are you? ⓘ" | Left of title | Data | Back | Info icon explains why | [flow][b1] |
| 12–13 | Subject | 2 tiles | "What do you want to learn first?" / "You can make progress in both subjects later on" / Math / Computer Science & Coding | After pick, Koji's eye turns into a smile curve | Choice | Back | Eye shape = emotion | [flow][b1] |
| 14 | Social proof | Expert photo card + uni logos | "Built by the best minds in education" / "Isidora Millin, Harvard math, Stanford PhD, International Math Olympiad two-time medalist" / "WORLD-CLASS EXPERTS FROM" Stanford, MIT, Harvard, Cornell, Caltech | Small, bottom-left | – | Back | – | [flow][b1] |
| 15–16 | Level | 4 code tiles | "What level of programming are you currently at?" / Beginner — I want to start from the basics. / Novice — I've seen, but not touched code before. / Intermediate — I can write simple programs with loops. / Advanced — I've written longer programs. | Left of title | Choice | Back | Real code in each tile | [flow][b1] |
| 17 | Inspiration | Koji in a node network | "There's no limit to how far you can go." | In art | – | Back | – | [flow][b1] |
| 18–19 | Routine | 4 tiles | "How will learning fit into your day?" / Morning routine / Afternoon break / Nightly ritual / Another time | Left of title | Choice | Back | – | [flow][b1] |
| 20 | Notification pre-ask | Koji peeking over a mock iOS notification | "You're about to level up! / You're one step away from Level 4: Designing Programs" (mock) / "Reach your goal with reminders" / "Allow notifications to help you stay motivated and on track" / Allow notifications / No thanks | Peeking over the mock | Notifications | **No thanks**, same size as Allow | Shows a sample notification, not the dialog | [screen][s-b1-notif] |
| 21 | Account wall | Social + email | "Create a free profile to discover your learning plan" / Google / Apple / Email / Sign up / "Existing user? Sign in" | None | Account | None visible | Hard wall | [flow][b1] |

#### B2. Onboarding B — speech-bubble Koji, ends in paywall (15 screens)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Splash | – | "Brilliant" | – | – | – | – | [flow][b2] |
| 2 | Welcome | Rocket illustration with physics notation | "The best way to learn math and computer science" / "Effective, hands-on learning, while learning at your level with guided bite-sized lessons." / Continue / Log in | None | – | Log in | – | [flow][b2] |
| 3 | Goal | Bar + back. Koji left. Pale-yellow bubble with lime border. List rows with pixel emoji. | "What's your top goal?" / Professional growth / Staying sharp / Excelling in school / Helping my child learn / Helping my students learn / Something else | ~50pt left | Choice | Back | Bold bubble text | [flow][b2] |
| 4 | Reaction | Same | "Prepare to be prepared for the future." | Same | – | Back | Witty, short | [screen][s-b2-react] |
| 5 | Interstitial | Koji + topic cards | "You'll fit right in" / "Millions of professionals use Brilliant to supercharge their skill sets. You'll feel right at home in our community of problem solvers and knowledge seekers." | In art | – | Back | Copy matches the goal picked | [flow][b2] |
| 6–7 | Level | Math tiles | "What's your math comfort level?" / Arithmetic / Basic Algebra / Algebra / Calculus → "Every math genius starts here." | Left | Choice | Back | – | [flow][b2] |
| 8–9 | Routine | List | "How will learning fit into your day?" → after Morning: "Cosines over coffee? Nice." | Koji now holds a blue mug | Choice | Back | Prop changes with the answer | [screen][s-b2-coffee] |
| 10 | Notification pre-ask | Koji's arm pressing "Allow" on a mock dialog | "Brilliant Would Like to Send You Notifications" (mock) / "Reach your daily goal with reminders" / "Enable push notifications to keep you motivated and on track." / Allow notifications / No thanks | Pressing the button | Notifications | No thanks (text) | Playful mock | [screen][s-b2-notif] |
| 11 | Social proof | Koji bouncing on a 3D block, 5 stars, quote | "You're on your way!" / "Through its engaging and well-structured courses, Brilliant has taught me mathematical concepts that I previously struggled to understand…" — Jacob S. | Smiling, squashed | – | Back | – | [flow][b2] |
| 12–14 | Account | Apple / Google / Facebook / email form | "Create a free account to discover your personalized learning path" | None | Account | Log in | Hard wall | [flow][b2] |
| 15 | **Paywall: trial timeline** | X top-right. Big title. Vertical timeline. Sticky bottom sheet. | "How your Premium free trial works" / ✓ ~~Set your learning goals~~ "You've successfully created your profile and learning goals" / "Today: Get Premium access — Full access to 70+ interactive courses, and more" / "Day 5: Trial reminder — We'll send you an email reminder about when your trial ends" / "Day 7: Trial ends — You'll be charged and your subscription will start on October 30. Cancel anytime before." / "⚡ Special discount applied" / "7-day free trial, then ~~$197.98~~ S$ 164.98 per year ($13.74 per month)" / Start your 7-day free trial | None | Payment | Small grey X only | First step already ticked off | [screen][s-b2-paywall] |

#### B3. Onboarding C — "Learn by doing" (14 screens), differences

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 2 | Welcome | Huge serif headline with code fragments | "Learn by doing" / "Interactive problem solving that's effective and fun. Get smarter in 15 minutes a day." / Continue / Sign in | None | – | Sign in | – | [flow][b3] |
| 3 | Mascot intro | Koji centre, bubble above | "Let's build a learning path just for you." | ~100pt centre | – | Back | – | [flow][b3] |
| 5 | Reaction | – | "Smart move. Future you approves." | Left | – | Back | – | [flow][b3] |
| 8 | Reaction | – | "So we speak the same language(s). Cool." | Left | – | Back | – | [flow][b3] |
| 9 | Claim | Koji lifting a dumbbell | "Learn 6x more effectively" / "…Interactive learning has been shown to be 6x more effective than watching lecture videos." | Squinting with effort | – | Back | Uncited claim | [flow][b3] |
| 11 | Reaction | – | "Source code by starlight. Sounds dreamy." | Sleepy eye, purple mug | – | Back | – | [flow][b3] |
| 12 | Notification pre-ask | Bubble + mock iOS dialog + green arrow | "I'll remind you to learn so it becomes a long-term habit." / Continue | Left | Notifications | Don't Allow in system dialog | Same trick as Duolingo | [screen][s-b3-notif] |
| 13 | Social proof | Koji over a glowing ring | "You're on your way!" / "…If school math looked like this, nobody would think 'math is hard.'" — Joel M. | Levitating | – | Back | – | [flow][b3] |
| 14 | Account | – | "Sign up for free to discover your learning path" | None | Account | Sign in | – | [flow][b3] |

#### B4. In-app Premium paywall (7 screens)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Soft paywall | Pastel peach/pink/lavender gradient. Serif title. Table. | "Unlock the full Brilliant experience with **Premium**" / Benefits · Free · Premium: Daily lesson ✓✓ / Unlimited learning / Tutoring by Koji / No ads / Jump ahead and personalized practice / Remind me later / Learn more | Koji icon in the "Tutoring by Koji" row | Payment | **Remind me later** | Premium column is a raised gradient-border card | [screen][s-b4-table] |
| 2 | Trial timeline | X top-right | "How your **Premium** free trial works" / Today — "Get access to all interactive courses, personalized tutoring, and more" / In 5 days — "Get an email reminder that your trial is about to end" / In 7 days — "Your account will be charged; cancel anytime before September 24" / Start my free week | None | Payment | X | Real date on the charge step | [screen][s-b4-timeline] |
| 3 | Plans | 3D key art. Plan cards. Legal. | "Unlock **Premium** with a 7 day free trial" / "Premium gives you unlimited learning, personalized tutoring, and more." / Individual [MOST POPULAR] $25/mo*, 12 mo · S$ 300.00 / Family $50/mo*, 12 mo · S$ 600.00, 6 seats included / "You won't be charged until after your free trial ends. Your annual subscription **automatically renews**…" / "Cancel anytime in the App Store" / Start my free week | Koji peeks over the top edge of the chosen plan card | Payment | X | Gradient border on chosen card | [screen][s-b4-plans] |
| 4 | Purchase | HUD | "Completing purchase…" | – | – | – | – | [flow][bp1] |
| 5 | Celebration | 3D objects (gem, key, bolt, "+45 XP") burst from a glowing ring with Koji in the middle | "Premium trial unlocked!" / "Enjoy 7 free days of the full Brilliant experience, Sam" / Continue | Centre of burst | – | – | Uses the first name | [screen][s-b4-unlocked] |
| 6–7 | Path + home | – | "Keep it going!" / Continue course | Koji standing on the current node | – | – | – | [flow][bp1] |

#### B5. Onboarding paywall, long scroll (10 screens)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Timeline | As B2-15 | – | None | Payment | X | Sticky price + CTA on every scroll position | [flow][bp2] |
| 2 | Proof | Award laurels, press quotes, review | "APP OF THE DAY" / "Best App" / "Tantalizing" The New York Times / "Advanced" The Atlantic / "Over 50,000 5-star reviews" | None | Payment | – | – | [flow][bp2] |
| 3 | Feature | Phone mock with graph sliders | "Level up with Premium" / "Learn efficiently — Unlimited access to 100+ interactive courses…" | None | Payment | – | Says 70+ on one screen, 100+ on another | [flow][bp2] |
| 4–5 | Catalogue | Tabs + preview window | "Build quantitative & technical problem solving skills" / Foundational Math · Data · CS · Science · Advanced Math · Electives | None | Payment | – | – | [flow][bp2] |
| 6 | Compare | Table | "Unlock it all with Premium" / Guided courses (Preview only / ✓) / Bonus math, science, & CS puzzles (Preview only / ✓) / No content limits / Fully unlocked learning paths | None | Payment | – | "Preview only" is a clear free tier | [flow][bp2] |
| 7–8 | Legal + purchase | Grey small text | "You won't be charged until after your free trial ends. Upon subscribing, your iTunes account will be charged S$ 164.98/yr…" | None | Payment | – | – | [flow][bp2] |
| 9 | Personal loader | Yellow ring | "Finding learning path recommendations based on your responses" | None | – | – | – | [flow][bp2] |
| 10 | Result | Cards | "Recommendations" / "Choose one to get started. You can switch anytime." / [MOST POPULAR] Foundational Math — 5 LEVELS • 6 COURSES | None | Choice | – | – | [flow][bp2] |

#### B6. Single-plan paywall (7 screens)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Compare | Table, X top-right | Daily lessons / Unlimited learning / Jump ahead in courses / Learn at your pace / No ads / Start my free week | None | Payment | X | – | [flow][bp3] |
| 2 | Timeline | 3 steps | "Today: Get unlimited access to all our interactive courses, and more" / "In 5 days: Get an email reminder that your trial is about to end" / "In 7 days: Your account will be charged; cancel anytime before October 13" | None | Payment | X | – | [flow][bp3] |
| 3 | One plan | [7 DAYS FREE] Premium $13.33/mo, 12 mo · $159.99 | "Unlock Premium with a 7 day free trial" / legal | Peeking over card | Payment | X | – | [flow][bp3] |
| 4–5 | Purchase | – | "You're all set. Your purchase was successful." | – | – | – | – | [flow][bp3] |
| 6 | Unlocking | Koji hugging a 3D padlock on a ring | "Unlocking all levels" | Hugging | – | – | Short transition | [flow][bp3] |
| 7 | Celebration | Burst | "Premium trial unlocked!" | Centre | – | – | – | [flow][bp3] |

#### B7. First lesson (17 screens) + streak

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Course pick | Path list | "Programming & CS" / "Speak the language of computers" / ✦ RECOMMENDED Thinking in Code | Peeks over the recommended card | Choice | Back | – | [flow][b-lesson] |
| 2 | Transition | Blank, vertical green light trail | – | Koji dives down the trail | – | – | Mid-animation frame | [flow][b-lesson] |
| 3 | Lesson intro | X + segmented bar + bolt | "Writing Programs" / "Programs are instructions. You already know how to write them — let's prove it." | None | – | X | – | [flow][b-lesson] |
| 4–8 | Puzzle + feedback | Map puzzle, bottom sheets | Hint (yellow): "Try turning the truck left first." See answer / Try again · Answer (grey): "Here's the answer" Why? / Skip explanation · Right (green): "Correct! +15 XP" Why? / Continue | Koji badge beside Continue | – | X | Hint before answer | [flow][b-lesson] |
| 10 | Check-in | Koji large, bubble above, yellow burst at top | "Nice work. Let's quickly check your understanding." | ~130pt centre | – | X | Bolt turns yellow (streak earned) | [screen][s-b7-check] |
| 16 | Wrong | Grey sheet | "Incorrect" / Why? / Continue | Badge | – | X | Wrong is grey, not red | [flow][b-lesson] |
| 17 | Complete | Koji glowing above a purple ring | "Lesson Complete!" / "TOTAL XP 110" | Glowing | – | – | Sparkles | [screen][s-b7-done] |
| K1 | Streak | Big 3D lime bolt, Koji peeking from behind | "1" / "You started a streak!" / Th F S dots | Peeking | – | – | – | [flow][b-streak] |
| K2 | Toast | Top banner during lesson | "1⚡ Nice work today! Keep it up." | None | – | – | Non-blocking | [flow][b-streak] |

#### B8. Premium settings (2 screens)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Settings | List with toggles | Account / Premium / Notifications / **Sounds** (on) / **Haptics** (on) / About / Help / Report a problem / Product Updates / Log out / Legal | None | – | X | Sound and haptics each have a toggle | [flow][b-prem] |
| 2 | Premium | Plain text | "Current plan Premium" / "Started on: October 06, 2025" / "Renewing on: October 13, 2025" / Manage Subscription › / "Have a question? We're here to help!" | Help illustration | – | Back | Renewal date in-app | [flow][b-prem] |

---

## 2. Patterns

### Sequencing
- **Duolingo:** splash → welcome → mascot says hi → "Just 7 quick questions" → ~7 questions with 3–5 short interstitials → notifications → widget → outcome list → (soft plan choice in some variants) → placement → **first lesson** → streak → goal → widget → **account ask** → **paywall** (14 to 24 screens before lesson one).
- **Brilliant:** splash → welcome → mascot says hi → 5–7 questions with 2–4 interstitials (social proof, claims) → notifications → **hard account wall** → **paywall** (trial timeline) → recommended path. 14–21 screens.
- Both: one question per screen. Interstitials every 2–3 questions. They break up the asks and pay back each answer.
- Both ask for notifications *inside* onboarding, after the user has said why they're here.
- Both end with a celebration screen, not a form.

### How the mascot talks
- **Two layouts only.** "Guide" = small mascot top-left (Duo ~80pt, Koji ~50–60pt) with the bubble to its right, used on every question. "Host" = larger mascot centred (~110–150pt) with the bubble above, used for hellos, reactions, interstitials and results.
- **Lines are short.** Most Duo lines are 4–10 words. The longest is ~13. If a thought is longer, Duo splits it over two screens with "…" ("It can be hard to stay motivated…" → "…so Duolingo is designed to be fun like a game!").
- **First person, present tense.** "I'll remind you…", "I'll cheer you on…", "Let Duo recommend…". Brilliant: "How do you want me to sound?", "I'm here to help if you ever get stuck."
- **The mascot reacts to every answer.** Duo: "Let's prepare you for conversations!", "Okay, we'll start fresh!", "Let's ace those tests!". Koji: "Smart move. Future you approves.", "Cosines over coffee? Nice." Koji also changes *prop* (mug) and *eye shape* (smile curve, sleepy curve).
- **Skips get a kind reply.** "Awesome! You can upgrade anytime." / "Okay! You can add my widget any time."
- **When the mascot disappears:** form fields (age, name, email, password), the lesson exercises themselves, the plan table and legal text. On paywalls Duolingo swaps in a different-looking Duo (Super gradient, Max black) so the "shop" feels like a separate place.
- **Voice of Duo:** exclamation marks on almost every line, simple words, no jokes. **Voice of Koji:** drier, witty, one pun per reaction, full stops not exclamation marks.

### Making it feel personal
- Uses the answer in the next line ("Since you know a few words, let's start at Score 10!").
- Numbers made from the user's choice ("That's 50 words in your first week!").
- Uses the name ("What is your email address, Sam Lee?", "Enjoy 7 free days…, Sam").
- RECOMMENDED tag moves to match the answer.
- Interstitial copy changes by segment ("Millions of professionals…" vs "Millions of students…").
- Brilliant lets you choose Koji's voice (Melodic / Deep).

### Permission asks
- Always **after** the user has stated a goal, so the ask has a reason.
- Always a **pre-ask screen first**. Two styles:
  1. Fake system dialog drawn faded in the body, with an arrow pointing at "Allow". The real dialog then appears in the exact same spot (Duolingo D3-21/22, Brilliant B2-10, B3-12).
  2. A sample of a real notification ("You're about to level up!") — Brilliant B1-20. This shows value instead of the dialog.
- Decline options: Duolingo often has no "no" on the pre-ask (decline only in the system dialog). Brilliant gives **"No thanks"** at equal or near-equal weight.
- Widget and contacts asks always have a named skip: NOT NOW, MAYBE LATER, CONTINUE WITHOUT CONTACTS.

### Screen counts
- Duolingo: 7 stated questions, ~14–20 screens to lesson one, 30+ more before the account ask.
- Brilliant: ~6 questions, 14–21 screens to the paywall.
- Ditch today: 7 screens total. Already much shorter. That is fine: we have less to learn about the user.

### When the paywall appears
- Duolingo: (a) a price-free "Super or free?" choice inside onboarding (D1-17), (b) a full paywall after the account is made (D10), (c) contextual ones at friction points (hearts, ads). Duolingo's Director of Product said putting the trial offer *inside* onboarding, in context, gave a "significantly higher" take rate than a generic upsell ([Sub Club][sub-club]).
- Brilliant: right after the account wall, as the last onboarding step, then again in-app with "Remind me later".

### How they word trial and price
- CTA names the trial, not "Subscribe": START MY FREE WEEK / START MY FREE 2 WEEKS / TRY FOR $0.00 / Start your 7-day free trial.
- CTA changes to CONTINUE when the chosen plan has no trial (D11-3).
- Price shown as per-month big, yearly total small ("$6.99 / MO" over "12 mo • $83.99"; "$25/mo*" over "12 mo · S$ 300.00").
- Both promise a reminder with a **real date**: "You'll get a push notification on December 24" / "cancel anytime before September 24".
- Duolingo lets the user **pick** the reminder day ("2 days before — Dec 14" / "3 days before — Dec 13"). Duolingo's Director of Product: the extra step "drew attention to the fact that you can choose when you want your reminder and we're going to remind you", and was "a really great way to increase confidence in the product" ([Sub Club][sub-club]).
- Reassurance line right above the CTA: "Easy to cancel, no penalties or fees" / "Cancel anytime in the App Store" / "You won't be charged until after your free trial ends."
- The reminder promise is repeated after purchase ("Your 7-day free trial has started! We'll remind you 2 days before it ends") and again on Manage Subscription.

### How they handle "skip"
- Questions: no skip. CONTINUE stays grey until you answer.
- Asks (notifications, widget, contacts, account, paywall): always a skip. Labels: NOT NOW, LATER, MAYBE LATER, NO THANKS, Remind me later, CONTINUE WITHOUT CONTACTS.
- Duolingo's growth lead says swapping a prominent "Discard my progress" for a subtle "Later" on the sign-up wall "moved the needle", and that soft walls you can dismiss made the later hard walls work better ([First Round][firstround]).

---

## 3. Animation and feel

### What is documented
- **Both use Rive state machines.** Duolingo picked Rive because files are compact and "the State Machine's powerful system is what allowed this project to be feasible on a grand scale" ([Duolingo blog: visemes][duo-visemes]).
- Duolingo characters have **body pose states and mouth states running at the same time**. Idle behaviour includes head nods, blinking and eyebrow movement. After an answer the character moves to a final state that reacts to right or wrong ([Duolingo blog][duo-visemes]).
- Lip-sync is data-driven: audio plus phoneme timings drive mouth shapes ("visemes"). Duolingo made "20+ mouths". Sending timings instead of video keeps data transfer "to an absolute minimum" ([Duolingo blog][duo-visemes]).
- For the AI video-call character Lily, a Duolingo engineer said animating every reaction by hand would make the file too big, so they used modular pieces with the State Machine handling transitions and blending ([Rive blog: Lily][rive-lily]).
- **Koji has no mouth.** Without animation "it wasn't clear that Koji was the one talking", so Brilliant drove a speaking effect from audio volume via a Data Binding variable. Koji has "a full set of states that cover the arc of a tutoring session": waving, nodding, different reactions for easy vs hard solves, and a flip when you get everything right ([Rive blog: Koji][rive-koji]).
- Brilliant's streak animation uses Rive Events and is "aligned with the increasing number count" so it feels tied to the user's action. Their streak was the first feature they shipped to iOS, Android and web at once from one Rive file ([Rive blog: Brilliant streaks][rive-brilliant]).
- Brilliant explored "over 500 icons" before choosing a character for the tutor. By default Koji speaks first at the start of every lesson page and points out what changed, rather than reading instructions ([Brilliant blog][brilliant-koji]).
- Duo's 2019 redesign: built from a few simple shapes ("basically a chicken nugget with a face") so he is easy to pose; big eyes keep expressions readable; feet were finally animated. Duolingo reported ~5% more sessions after the redesign ([Design Week][designweek], [Creative Bloq][creativebloq], [Duolingo: Reshaping Duo][duo-reshape]).
- Widget: Duo "gets more and more desperate as it nears midnight". ~25 illustrations. "Half of the learners with the widget installed have a streak of at least 6 months." An animated install guide after lessons made installs rise sharply ([Duolingo blog: widget][duo-widget]).
- Notifications: personalised "Hi, it's Duo" copy won (+5% DAU); sending 23.5 hours after the last session became the standard ([First Round][firstround]).
- **Sound and haptics:** I found no first-party Duolingo or Brilliant write-up on sound or haptics. Third-party accounts describe a "bouncy chime" on correct and a descending tone on wrong for Duolingo; treat as unverified. Brilliant's Settings has separate **Sounds** and **Haptics** toggles, both on by default (seen on Mobbin, B8-1).

### What the stills imply (my reading, not documented)
- **Typewriter bubble:** D3-4 shows a half-written bubble with CONTINUE greyed. Text types in; the button enables when the line is done.
- **Mascot stays put between question screens.** On every Duolingo and Brilliant question screen the mascot sits in the identical spot and size. Only the bubble text and the content below change. That suggests the mascot is part of a persistent header, not re-entered per screen.
- **Bubble text swaps on selection** (D1-10, B2-4): the reaction appears without leaving the screen.
- **Splash to welcome is a circle wipe** (D2-2).
- **Mascot enters from off-screen** for interruptions (D5-32 Duo slides in from the right; B7-2 Koji dives down a light trail).
- **Big moments get a transform or burst:** Duo hatches from an egg on lesson complete; Duo turns into Super Duo through a light burst; Brilliant bursts 3D objects from a ring on "Premium trial unlocked!".
- **Progress feedback:** Duolingo's bar sparkles on each correct answer and turns gold, then gets hit by a lightning bolt on "10 IN A ROW".
- **Answer sheets slide up from the bottom** in a colour that means something: green right, red/pink wrong, yellow skip or hint, grey (Brilliant) neutral wrong.

---

## 4. What works / what doesn't

### Works (and why)
1. **Mascot reacts to each answer.** It makes a form feel like a chat. It also proves the answer was heard. Cheap to build: one line per option.
2. **"Just 7 quick questions."** Telling the count up front lowers the cost of starting. Honest if the count is true.
3. **Pre-ask before the system dialog.** The reason comes in the mascot's voice. Showing the real dialog's position (or a sample notification) makes it feel expected.
4. **Trial reminder with a real date, and letting the user choose it.** Turns the scary part of a trial into a promise. Duolingo's own product lead credits it with higher confidence and conversion ([Sub Club][sub-club]).
5. **Trial timeline (Brilliant).** "Today → Day 5 reminder → Day 7 charged on October 30" answers "when will I be charged?" before it's asked. The first step is already ticked, so it feels like progress.
6. **CTA honesty switch** (START MY FREE WEEK → CONTINUE for a no-trial plan).
7. **Kind replies to skips.** "Awesome! You can upgrade anytime." No shame, and it tells the truth about how to come back.
8. **Delayed account ask.** Value first. Duolingo measured ~20% more DAU from moving sign-up back ([First Round][firstround]). (Ditch has no account at all, which is even better.)
9. **Manage screens show the next billing date** and repeat the reminder promise (Duolingo D13-S2, Brilliant B8-2).
10. **Celebration that names what happened** ("Premium trial unlocked! Enjoy 7 free days…, Sam" / "Your 7-day free trial has started! We'll remind you 2 days before it ends").

### Doesn't work, or breaks our rules
| Pattern | Where | Problem | Our rule |
|---|---|---|---|
| No close button on the first paywall frame | Duolingo D10-1 | Close must be visible from the first frame | Rule 4 |
| "Next heart in 4h 15m" in red, paid option pre-selected | Duolingo D12-3 | Countdown pressure | Rule 4: no countdowns |
| "⚡ Special discount applied" with ~~$197.98~~ | Brilliant B2-15, B5 | Reference price is never explained; reads as a fake discount | Rule 4: no fake discounts |
| "Save up to 76% with Family Plan" + Family pre-selected | Duolingo D13-M6 | "Up to" only holds per seat with 6 people; default nudges the pricier plan | Honest pricing |
| "Super learners are 4.2x more likely to finish" | Duolingo D9, D10 | Correlation sold as cause; people who pay were already more committed | Rule 5 spirit: don't overclaim |
| "6x more effective than lecture videos" | Brilliant B3-9 | No source on screen | Same |
| Widget guilt: laser eyes, "1 week abandoned", crying ghost | Duolingo D14-W5/W7 | Shame as a motivator. Fine for a game; wrong for money stress | Rule 8 spirit |
| "Don't lose your progress!" | Duolingo D7-1 | Loss framing | – |
| No "continue free" on the onboarding paywall, tiny grey X | Brilliant B2-15 | The free path is hidden | Rule 4: "Continue free" |
| Price shown as "$25/mo*" while billed yearly | Brilliant B4-3 | Asterisk pricing; yearly total in small type | Show the real charge |
| Fake "COURSE BUILDING…" / "LOADING…" waits | Duolingo D1-7, D5-5 | Probably padded time. Small harm, but it's theatre | Don't fake work |
| Promised reminder not arriving | User complaints about Duolingo ([complaints][complaint]) | A broken promise costs more trust than no promise | Rule 3: reminders must fire |
| "Going so soon?" + "If you cancel, you'll start seeing ads again" | Duolingo C2–C3 | Mild confirmshaming; but cancel is visible and named, so it's borderline-OK | – |

---

## 5. Apply to Ditch — screen by screen

Our current flow: Welcome → Tick → Reveal → Dates → Reminders → Paywall → Pick 3 → Home. Mascot poses we already have: `wave`, `flick`, `shock`, `bell`, `cheer`, `worried`.

### Global changes (all screens)

1. **Pin the raccoon + bubble in a shared header** across Tick, Dates, Reminders and Pick 3. Today `Mascot` plays `ZoomIn` on every screen mount, so the raccoon re-enters on each push. Duolingo's stills show the mascot never moves between question screens. Do: render the "guide" header once in `onboarding/_layout.tsx`; slide only the content below. Swap pose with a 120ms cross-fade. Keep `ZoomIn` only for "host" screens (Welcome, Reveal, Paywall hero).
2. **Bubble text reveal.** Reveal by word over ≤ 500ms. Tap the bubble to finish instantly. Do **not** disable the main button while it types (VoiceOver users and fast users). Reduce Motion: show text at once. Announce the line with `accessibilityLiveRegion="polite"`.
3. **Reaction lines.** Every choice gets a short reply in the bubble (≤ 10 words, sentence case, one "!" max per screen). Light haptic (`selection`) on each pick.
4. **Two layouts only.** Guide (≈ 72–80pt raccoon, top-left, bubble right) for anything with input. Host (≈ 140–180pt, centred, text below) for Welcome, Reveal, and Paywall top.
5. **Kind skip replies.** When a user taps Skip / Later / Maybe later / Continue free, the next screen's first bubble says it's fine and how to come back.
6. **Hide the progress bar on host screens** (Welcome, Reveal) like Duolingo hides it on interstitials. Show it on Tick, Dates, Reminders.
7. **Motion budget.** Spring for mascot entrances (damping ≈ 0.6, ~500ms, as now). 200–300ms ease-out for content. One "big" moment only: the Reveal count-up. Rive later (needs an EAS dev build): one rig with a `pose` number input, a `talking` boolean driven by bubble reveal, and a `blink` idle. Until then, swap PNG poses.

### Screen 1 — Welcome

- **Keep:** big waving raccoon, headline, "Free. No account. Your list stays on your phone." (true per Rule 5).
- **Change layout:** add one bubble line above the raccoon (host layout), like Duolingo's "Hi there! I'm Duo!" + "Just 7 quick questions". Keep the body text but shorten it.
- **Motion:** raccoon `ZoomIn` spring, then bubble types in 250ms later, then button fades up. Total < 900ms.

Bubble line options:
| Option | Score | Why |
|---|---|---|
| "Tick what you pay for. I'll add it up." | 8/10 | Says the first task and the payoff. No count to get wrong. |
| "Four quick steps and you'll see your yearly total." | 7/10 | Mirrors "7 quick questions". But the total comes after step 1, so "four" muddles it. |
| "Hi! Let's find out what your subscriptions really cost." | 6/10 | Friendly, vaguer. "Really" hints we know better. |

**Pick:** "Tick what you pay for. I'll add it up."

Body options (under the headline):
| Option | Score |
|---|---|
| "See every subscription. Get a heads-up before each charge." | 8/10 |
| "Track every subscription. Get a heads-up before each charge. Cancel what you don't use." (current) | 6/10 — three sentences, "cancel" may read as "we cancel" at a glance |
| "Know what renews, and when." | 7/10 |

**Pick:** "See every subscription. Get a heads-up before each charge." Button stays "Get started" (9/10; Duolingo uses the same).

### Screen 2 — Tick ("What do you pay for?")

- **Keep:** search, chips, 3D rows, running total in the footer (very good; neither app shows a live tally).
- **Change:** bubble reacts as the count grows. Lines are about the count, never about the user's taste.
- **Mascot pose:** `wave` at 0; `flick` while ticking; `shock` at 8+.
- **Motion:** tick = row press-in 60ms + `selection` haptic; footer total rolls digits (tabular figures) over 250ms.
- **Skip:** keep "Skip". If skipped, Reveal must not show $0 drama: go to an empty-state line instead (see Reveal).

Bubble lines by state:
| State | Option A (pick) | Option B | Score A / B |
|---|---|---|---|
| 0 ticked | "What do you pay for? Tap them all!" (current) | "Tap everything you pay for." | 8 / 7 |
| 1–2 | "Good start. Keep going." | "Nice. What else?" | 8 / 7 |
| 3–7 | "That's {n}. Any more?" | "{n} so far." | 8 / 6 |
| 8+ | "Wow, {n}. Let's see the total." | "Okay, that adds up fast." | 8 / 6 (B sounds like judging) |

### Screen 3 — Reveal ("That's about $X a year")

This is our "That's 50 words in your first week!" moment, but better: it's real money from real picks.

- **Layout:** host layout, no progress bar. Raccoon `shock` with receipt (current art) above. Number centred. "Biggest ones" card. Source line.
- **Motion:** count up from $0 to $X over ~900ms with ease-out, tabular figures; `success` haptic when it lands; raccoon does one small jump (translateY −8pt, spring) on landing. Reduce Motion: show the final number, no count.
- **Don't** add a fake "Adding up…" loading screen (Duolingo's "COURSE BUILDING…" is theatre).
- **Survey line:** keep it, it's sourced. Make it fully visible (it's cut off in the mock). Short form: "In a 2022 survey, people guessed $86 a month. It was really $219. (C+R Research)".
- **Skipped Tick path:** bubble "No problem. Add subscriptions any time from Home." and go to Reminders.

Headline options:
| Option | Score | Note |
|---|---|---|
| "That's about **$887** a year." + bubble "Let's make sure none of it surprises you." | 9/10 | Neutral; leads into dates and reminders |
| "That's about **$887** a year. Ditch it." (current) | 6/10 | Pushy; many subs are wanted. |
| "You spend about **$887** a year on these." | 7/10 | Clear, flatter |

**Pick:** option 1. CTA options: "Let's fix that" (current, 6/10, implies something is broken), "Set my dates" (8/10), "Continue" (6/10). **Pick:** "Set my dates".

### Screen 4 — Charge dates

- **Keep:** one service per card, "1/6" count, "Not sure", "Later" skip.
- **Change:** bubble confirms each pick before moving on: "Got it. The 14th." (shows for ~600ms, then the next service slides in). Same pattern as Duolingo's "Okay, we'll start fresh!" but without a separate screen.
- **Mascot pose:** `flick` (thinking) while choosing; `cheer` on the last one.
- **Motion:** card slides left 220ms; next card slides in; per-service progress fills.
- **"Not sure":** what the app does with it must be what the bubble says. If the date stays empty: "No worries. You can add it later from Home." (Don't say "I'll guess.")

Question line options:
| Option | Score |
|---|---|
| "When does Netflix charge you?" (current) | 8/10 |
| "What day does Netflix take the money?" | 6/10 — slangy |
| "When's Netflix's next charge?" | 7/10 |

**Pick:** keep current. After last date: "All set. Now let's make sure you hear about them." (8/10) vs "Done! On to reminders." (6/10). **Pick** the first.

### Screen 5 — Reminders (notification pre-ask)

We already beat both apps here: we show *the user's own* next two renewals as lock-screen notifications (Brilliant's "sample notification" style), not a drawing of the iOS dialog.

- **Keep:** sample notifications with real names, real amounts, real "in 3 days / tomorrow".
- **Add:** a real date to the sample ("Netflix renews Thu, Nov 12"), matching Duolingo's "You'll get a push notification on December 24".
- **Change button pair:** keep "Turn on reminders" (primary) + "Maybe later" (text). Brilliant shows the skip at near-equal weight; ours is fine as a text button but keep it ≥ 44pt tall.
- **After "Maybe later":** the Paywall timeline already shows "Turn on reminders so I can warn you" with an Open Settings action. Good. Make the raccoon on Paywall use `worried` only in that row, not as the hero.
- **Mascot:** `bell` pose (already). On tap, ring the bell (rotate ±12°, 3 swings, 450ms) and fire the system dialog after the swing.

Bubble options:
| Option | Score |
|---|---|
| "I'll ring you 3 days and 1 day before anything charges." (current) | 8/10 |
| "I'll ping you 3 days and 1 day before each charge, at 9am." | 8/10 — adds the time (true per Rule 3) |
| "Want a heads-up before money leaves?" | 6/10 — vague |

**Pick:** "I'll ping you 3 days and 1 day before each charge, at 9am." (Note: free tier = 3 subscriptions. If the user has more than 3, the bubble must not imply "each". Use "before your biggest charges" in that case, or the Pro line.)

### Screen 6 — Paywall

Biggest opportunity. Our product *is* reminders, so the trial reminder is a live demo of Ditch. Duolingo's tested "choose your reminder day" step fits us better than anyone.

**Layout (top → bottom):**
1. Close (top-left, visible on first frame) · Restore (top-right). Keep.
2. Smaller raccoon (`cheer`, ~110pt, not 180) so price and timeline sit higher.
3. Headline (personal count): keep "Get a heads-up before all 6 renewals."
4. Service icons strip with FREE / PRO labels (keep; better than a generic table).
5. 4 benefit rows (keep).
6. Plan cards: Yearly (selected, "7 days free first · $2.50/mo"), Monthly $4.99, Lifetime $49.99. "SAVE 50%" is true after rounding ($29.99 vs 12 × $4.99 = $59.88, a 49.9% saving). "Half the monthly price" says the same with no rounding. Show the **yearly total in the large type** and the per-month in small type (the opposite of Duolingo/Brilliant), so nobody misreads $2.50 as the charge.
7. **Trial timeline with a reminder choice** (merge Duolingo D9-5 into our timeline): Today · Pro unlocks, $0 · **[3 days before] [2 days before]** chips with real dates · Mon, Nov 16 · $29.99 charged unless you cancel.
8. Sticky footer: "Start 7-day free trial" / "Then $29.99 a year from Mon, Nov 16. I'll remind you Sat, Nov 14." / "Continue free: 3 reminders".
9. CTA switches to "Subscribe for $4.99/month" or "Buy for $49.99" when those plans are picked (Duolingo D11-3 pattern; our code already does this).

**Mascot:** on the timeline's reminder row only, a small `bell` raccoon (≈ 40pt) next to the row, never over a button (Rule 8). Do not copy Koji peeking over the plan card: it sits on top of a tappable control.

**Motion:** when the user picks a reminder chip, the date in the footer line updates with a 200ms cross-fade and the small raccoon rings once. No other motion.

Reminder-choice line options:
| Option | Score |
|---|---|
| "When should I remind you before the trial ends?" + chips "3 days before · Fri, Nov 13" / "2 days before · Sat, Nov 14" | 9/10 |
| "Pick your heads-up day." | 7/10 |
| "I'll remind you 2 days before." (no choice, current) | 7/10 |

**Pick:** option 1, default to 2 days. Don't offer "1 day before": a 9:00 reminder the day before can land less than 24 hours before renewal, and Apple needs cancellation at least 24 hours before.

"Continue free" options:
| Option | Score |
|---|---|
| "Continue free: 3 reminders" (current) | 8/10 |
| "Not now, keep it free" | 7/10 |
| "Stay on Free" | 6/10 |

**Pick:** keep current.

Under-button line options:
| Option | Score |
|---|---|
| "Then $29.99 a year from Mon, Nov 16. I'll remind you Sat, Nov 14." | 9/10 (current shape, add chosen date) |
| "$0 today. $29.99 on Mon, Nov 16 unless you cancel." | 8/10 |
| "Cancel anytime in Settings." alone | 4/10 — no date |

**Also:** add one honest reassurance line above the CTA like both apps do: "Cancel in iPhone Settings any time before Nov 16. No fee." (8/10). Don't add press quotes, "MOST POPULAR", ratings or "x times more likely" stats.

### Screen 7 — Pick 3 (free path)

- **Keep:** biggest three pre-selected, swap any time, "3 of 3 picked", Done.
- **Change the first bubble** to acknowledge the free choice the way Duo does ("Awesome! You can upgrade anytime."):

| Option | Score |
|---|---|
| "Free it is! I picked your 3 biggest. Swap any time." | 9/10 |
| "Free gets 3 reminders. I picked your biggest. Swap any time!" (current) | 7/10 — three sentences, reads like a limit |
| "Cool. You can upgrade any time. Here are your 3 biggest." | 7/10 |

**Pick:** option 1.

- **Mascot pose:** today `worried` with a stack of cash. Use `cheer` instead: picking free is not a problem. (`worried` reads like guilt, the thing we flagged in Duolingo's widget.)
- **When the user tries a 4th:** keep the polite message "That's 3! Untick one to swap." (8/10). Don't open the paywall from here.
- **Motion:** each tick = `selection` haptic; "3 of 3" pulses once (scale 1.0 → 1.06 → 1.0, 200ms).

### Screens to add (honest and evidence-backed)

1. **"All set" screen after Pick 3 or after purchase** (both apps end on a celebration that names what happened: D8-18, B4-5).
   - Free: raccoon `cheer` · "You're set." · "Next heads-up: Netflix, Thu, Nov 12, 9:00." · button "Go to my list".
   - Pro trial: "Pro is on. $0 today." · "I'll remind you Sat, Nov 14, before the trial ends." · "Go to my list".
   - If notifications are off: same screen, but the line becomes "Reminders are off, so I can't ping you yet." + "Turn on in Settings" button. (This protects us from the "promised reminder never came" complaints Duolingo gets.)
   - Motion: one confetti burst (≤ 800ms) + `success` haptic. Reduce Motion: no confetti.
   - Score: 9/10. Cost: one screen.

2. **Manage Pro screen in Settings** (Duolingo D13-S2, Brilliant B8-2): "Current plan: Pro yearly" · "Renews Mon, Nov 16, 2026" · "Manage in App Store" · "Restore purchases". During trial, repeat: "I'll remind you Sat, Nov 14." Not part of onboarding, but it completes the trial promise.

3. **Widget ask — later, when the widget ships.** Follow D4: one ask screen with the *real* widget showing the user's next charge, then a two-step how-to. Ask after the first reminder fires, not in onboarding (it's Pro-only). Widget raccoon states: calm (nothing due), alert ears + "Tomorrow: Netflix $17.99", holding the bell (today). **Never** sad, angry, or "abandoned" states.

4. **Sounds / Haptics toggles in Settings** (Brilliant B8-1). We use haptics; give an off switch.

**Do not add:** an attribution survey ("How did you hear about us?"), a fake loading screen, social-proof interstitials with uncited stats, a goal-commitment screen ("I'M COMMITTED"), or an account wall. None fit a no-account tracker, and some break our rules.

### Summary table: what changes where

| Screen | Layout change | Copy pick | Pose | Motion |
|---|---|---|---|---|
| Welcome | Add bubble line, host layout | "Tick what you pay for. I'll add it up." | wave | Zoom spring → bubble → button, < 900ms |
| Tick | Pinned guide header | Count-based reactions | wave → flick → shock | Row press + selection haptic, total rolls |
| Reveal | No bar, survey line fully visible | "That's about $887 a year." / "Let's make sure none of it surprises you." / CTA "Set my dates" | shock | 900ms count-up, success haptic, small jump |
| Dates | Pinned header, confirm per pick | "Got it. The 14th." | flick → cheer | 220ms card slide |
| Reminders | Add real dates to samples | "I'll ping you 3 days and 1 day before each charge, at 9am." | bell | Bell swing then system dialog |
| Paywall | Smaller hero, yearly total large, reminder-day chips in timeline | "When should I remind you before the trial ends?" | cheer + small bell by timeline | 200ms date cross-fade on chip pick |
| Pick 3 | Same | "Free it is! I picked your 3 biggest. Swap any time." | cheer (not worried) | Tick haptic, counter pulse |
| **New: All set** | Host layout | "You're set. Next heads-up: Netflix, Thu, Nov 12, 9:00." | cheer | One confetti burst, success haptic |

---

## 6. References

### Mobbin flows (all iOS)
Duolingo
- [d1]: Onboarding A (20) — https://mobbin.com/flows/b0b4f93f-5637-46ec-9d77-49ecda6b991d?tab=screens
- [d2]: Onboarding B (20) — https://mobbin.com/flows/ac9d2f58-868d-4fd3-a79c-9655ce6b1522?tab=screens
- [d3]: Onboarding C (24) — https://mobbin.com/flows/7d7aacbe-213b-471e-8b1f-b5b7087bcb65?tab=screens
- Add a widget (3) — https://mobbin.com/flows/09b8d881-7654-443d-acb5-b64bf2bb6c3b?tab=screens
- Completing the first lesson (34) — https://mobbin.com/flows/b736389a-cb5c-4889-8011-a220baf09171?tab=screens
- Choosing a learning goal (16) — https://mobbin.com/flows/25145623-749c-4a2c-bd32-ddea59ee235d?tab=screens
- Creating a profile (16) — https://mobbin.com/flows/4511e153-c7d5-4b70-b37e-09cc798e49d9?tab=screens
- Creating a profile, variant (15, previews only) — https://mobbin.com/flows/9f5126ab-a403-4ac6-bc9f-1f44b1d373ec?tab=screens
- Subscribing to Super (19) — https://mobbin.com/flows/c71bfa5f-4aab-488b-a2af-d5276353a736?tab=screens
- Subscribing to Super Duolingo (14) — https://mobbin.com/flows/027521bb-14de-477a-96ac-5279c66ee6fb?tab=screens
- Subscribing to Duolingo Super (24) — https://mobbin.com/flows/53299ac2-ebb2-494b-afc8-b3b574457622?tab=screens
- Super (7) — https://mobbin.com/flows/06aa7cd2-7316-4bc0-9e26-1a50ece280d5?tab=screens
- Choose a plan (3) — https://mobbin.com/flows/92978b58-fc8c-4923-bbdb-a6c97d0e5513?tab=screens
- Run out of hearts (3) — https://mobbin.com/flows/971343d0-7807-40af-841e-4b36f224f109?tab=screens
- Subscription (10) — https://mobbin.com/flows/e4f50850-cdcf-4c5c-8832-3950e265bcec?tab=screens
- Subscribing to Max (14) — https://mobbin.com/flows/8ec5623c-44a2-4b8e-9174-a6451a97d8f7?tab=screens
- Manage subscriptions (2) — https://mobbin.com/flows/a0971a93-f3f7-4175-a8e7-093b5e6348d6?tab=screens
- Widgets (7) — https://mobbin.com/flows/abc20f90-e070-4929-a063-c163265e2cc0?tab=screens
- Customizing reminders (7, previews) — https://mobbin.com/flows/1c640d38-55e1-4be3-a692-e6a098d3c203?tab=screens
- Streak (9, previews) — https://mobbin.com/flows/d1739059-58c7-4b20-8630-8833869d34bb?tab=screens
- Streak (7, previews) — https://mobbin.com/flows/e7d141df-f1bd-4092-b218-59df9b26a657?tab=screens
- Personal streak (7, previews) — https://mobbin.com/flows/971a833b-d067-4302-86b1-34df80ae62ac?tab=screens
- Streak (5, previews) — https://mobbin.com/flows/381d56b5-b9a6-426e-8d13-2f5b06d9d420?tab=screens
- Also found, not used: Adding a course (math) https://mobbin.com/flows/590c9eaf-9037-40c1-acf7-7c0cfcbcefe9 · Updating notifications https://mobbin.com/flows/ccba2c23-2780-4327-b6e2-613607f91d29 · Turning off notifications https://mobbin.com/flows/dc559078-8954-45ca-997d-3bd08e65ecc2 · Turning off unlimited hearts https://mobbin.com/flows/bf50e558-acf4-4e90-9d4d-709a2dd4a277

Brilliant
- Onboarding A, Koji voice (21) — https://mobbin.com/flows/30231b26-5284-4891-b613-193a16c55b2e?tab=screens
- Onboarding B, speech bubbles + paywall (15) — https://mobbin.com/flows/7ffbd4f0-78d1-49be-bf0d-9c90cac00e8c?tab=screens
- Onboarding C, "Learn by doing" (14) — https://mobbin.com/flows/20ad012b-2683-4c0c-beb8-8ff62c6f509e?tab=screens
- Subscribing to Brilliant Premium (7) — https://mobbin.com/flows/70d3200e-a9ff-4339-aa42-5a1b7ba11760?tab=screens
- Subscribing to premium (10) — https://mobbin.com/flows/56a17e55-be7a-41bc-a1ef-cbfc2e5957dc?tab=screens
- Subscribing to Brilliant (7) — https://mobbin.com/flows/48aa5db4-c481-4af8-8a7c-36cd47824317?tab=screens
- Premium (2) — https://mobbin.com/flows/24b16d83-c7b3-4304-a2bb-e159cdf4b1b3?tab=screens
- Completing the first lesson (17) — https://mobbin.com/flows/149f97af-ed5a-4639-9286-5484c1daea3b?tab=screens
- Streak (3, previews) — https://mobbin.com/flows/33644a98-3f54-4a97-8a9a-5464f159702f?tab=screens
- Streak information (2, previews) — https://mobbin.com/flows/89b63c63-e827-4830-a61f-aa22616ecf27?tab=screens
- Also found: Creating an account (9) https://mobbin.com/flows/c77bcaf6-3a1c-4253-80e4-23b1b8cf311b · Creating account (4) https://mobbin.com/flows/32fdc45b-7950-426b-ad4b-ef74e562a944 · Starting a learning path (4) https://mobbin.com/flows/f4b83446-23c7-43c3-b9d7-a71105cd7392 · Completing a lesson (onboarding) (12) https://mobbin.com/flows/bf45375f-4cfc-42bb-84d0-5eb5ae958f3c

### Key Mobbin screens
- Duolingo "Hi there! I'm Duo!" — https://mobbin.com/screens/a824931a-588b-4f12-9073-2bddae0816ca
- Duolingo "Just 7 quick questions…" — https://mobbin.com/screens/74201708-1b1b-4b6d-b804-92f9eb2d65c9
- Duolingo bubble mid-typing — https://mobbin.com/screens/ee97593a-ac2b-4b71-a6e3-ea104aa61396
- Duolingo reaction "Let's prepare you for conversations!" — https://mobbin.com/screens/1a2c3854-ea7a-41fa-ab1b-95466c2c0228
- Duolingo notification pre-ask (mock dialog) — https://mobbin.com/screens/3a9230ea-4367-4a3c-a30a-d7027588b11c
- Duolingo real iOS dialog in same spot — https://mobbin.com/screens/b390ce08-0ae8-4581-b8a6-3a1a7d10e03d
- Duolingo "Super or free" choice — https://mobbin.com/screens/3a223593-d3c7-48fc-bb96-27d9f9e79fca
- Duolingo "Awesome! You can upgrade anytime." — https://mobbin.com/screens/eade4735-8f46-4659-bc9e-2e93d306019e
- Duolingo "Okay! You can add my widget any time." — https://mobbin.com/screens/87d92401-1020-42d8-9c41-a427528f9f7e
- Duolingo "We'll remind you 2 days before…" (bell) — https://mobbin.com/screens/a79bc5a0-78f6-4e3d-b677-e6eea78af004
- Duolingo "When should we remind you…?" — https://mobbin.com/screens/dffccfd7-c78a-4964-b31a-49d052b1e176
- Duolingo "Your 7-day free trial has started!" — https://mobbin.com/screens/e4db775d-921f-4ee0-87dd-824ec3fbe15b
- Duolingo paywall with no X on first frame — https://mobbin.com/screens/26548660-83c7-42e5-9ee0-65e47fd4dcc5
- Duolingo "Save up to 76%" — https://mobbin.com/screens/ac6f6af9-c6c9-455e-817e-a3a4b18d36f7
- Duolingo hearts countdown — https://mobbin.com/screens/163037d7-1bc3-41eb-8909-aef55bccd135
- Duolingo "Going so soon?" — https://mobbin.com/screens/5e9dae45-4474-4f5c-9db0-9bfe372b290e
- Duolingo "If you cancel, you'll start seeing ads again" — https://mobbin.com/screens/656742c0-7f62-4a7f-a5a9-05e54747e036
- Duolingo "trial will end in 4 days" — https://mobbin.com/screens/a3e467db-f7e3-4d4e-9eea-11c639c2e32a
- Duolingo "Skip ads with a 7 day free trial" — https://mobbin.com/screens/97e9b0dc-f653-4422-96e8-53650ff9accd
- Brilliant "Hi, I'm Koji!" — https://mobbin.com/screens/b54bafbc-2547-4959-91e5-a3aacf0c3f43
- Brilliant voice choice — https://mobbin.com/screens/7388c25e-4081-48a8-8de3-ed7c623f04af
- Brilliant sample-notification pre-ask — https://mobbin.com/screens/c33921fd-b1a6-4f0e-8c59-70b4121a18c7
- Brilliant "Cosines over coffee? Nice." — https://mobbin.com/screens/81e83c70-504c-45c6-a079-b37dd104fa98
- Brilliant Koji pressing Allow — https://mobbin.com/screens/e538aa16-c301-4734-a606-ea7d78278ba2
- Brilliant trial timeline paywall — https://mobbin.com/screens/e54dd53d-62d8-4e5d-8955-920db2669848
- Brilliant in-app table paywall — https://mobbin.com/screens/9ff9cfa3-8209-4275-a972-11a892f7d0a5
- Brilliant "Premium trial unlocked!" — https://mobbin.com/screens/b01053cd-3881-484a-94e0-007f1df69739

### Web sources
- Duolingo blog, "World character visemes" (Rive state machine, visemes, idle states) — https://blog.duolingo.com/world-character-visemes
- Duolingo blog, "How we developed our addictive and delightful widget" — https://blog.duolingo.com/widget-feature/
- Duolingo blog, "Reshaping Duo" — https://blog.duolingo.com/reshaping-duo/
- Design Week, Duolingo owl makeover (2019) — https://www.designweek.co.uk/issues/2-6-january-2019/duolingo-owl-receives-makeover-as-app-becomes-more-gamified
- Creative Bloq, "Duolingo's redesigned mascot is a hoot" — https://www.creativebloq.com/news/duolingos-redesigned-mascot-is-a-hoot
- Rive blog, Duolingo's AI video call (Lily) — https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life
- Rive blog, "Brilliant builds its math and coding tutor character with Rive" (Koji, June 2026) — https://rive.app/blog/brilliant-builds-its-math-and-coding-tutor-character-with-rive
- Rive blog, "How Brilliant.org motivates learners with Rive animations" — https://rive.app/blog/how-brilliant-org-motivates-learners-with-rive-animations
- Brilliant blog, "A world-class tutor in every home" (Koji launch, May 29, 2026) — https://blog.brilliant.org/a-world-class-tutor-in-every-home/
- Brilliant help, "How does Koji work?" — https://brilliant.org/help/features/how-does-koji-work/
- First Round Review, Gina Gotthilf on Duolingo A/B tests (delayed sign-up, notifications, streaks) — https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker
- Sub Club podcast, Anmol Tiwari (Duolingo Director of Product) on trial reminders, timelines, onboarding paywalls — https://share.transistor.fm/s/4702cbd4/transcript.txt
- Making Duolingo, "How streaks keep Duolingo learners committed" — https://making.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals
- User complaints about missing Duolingo trial reminders (anecdotal) — https://www.sikayetvar.com/en/duolingo-us/duolingo-charged-me-for-premium-without-sending-the-promised-trial-expiration-notice

[d1]: https://mobbin.com/flows/b0b4f93f-5637-46ec-9d77-49ecda6b991d?tab=screens
[d2]: https://mobbin.com/flows/ac9d2f58-868d-4fd3-a79c-9655ce6b1522?tab=screens
[d3]: https://mobbin.com/flows/7d7aacbe-213b-471e-8b1f-b5b7087bcb65?tab=screens
[d-widget]: https://mobbin.com/flows/09b8d881-7654-443d-acb5-b64bf2bb6c3b?tab=screens
[d-lesson]: https://mobbin.com/flows/b736389a-cb5c-4889-8011-a220baf09171?tab=screens
[d-goal]: https://mobbin.com/flows/25145623-749c-4a2c-bd32-ddea59ee235d?tab=screens
[d-profile]: https://mobbin.com/flows/4511e153-c7d5-4b70-b37e-09cc798e49d9?tab=screens
[d-super19]: https://mobbin.com/flows/c71bfa5f-4aab-488b-a2af-d5276353a736?tab=screens
[d-sub14]: https://mobbin.com/flows/027521bb-14de-477a-96ac-5279c66ee6fb?tab=screens
[d-sub24]: https://mobbin.com/flows/53299ac2-ebb2-494b-afc8-b3b574457622?tab=screens
[d-choose]: https://mobbin.com/flows/92978b58-fc8c-4923-bbdb-a6c97d0e5513?tab=screens
[d-hearts]: https://mobbin.com/flows/971343d0-7807-40af-841e-4b36f224f109?tab=screens
[d-subtab]: https://mobbin.com/flows/e4f50850-cdcf-4c5c-8832-3950e265bcec?tab=screens
[d-max]: https://mobbin.com/flows/8ec5623c-44a2-4b8e-9174-a6451a97d8f7?tab=screens
[d-manage]: https://mobbin.com/flows/a0971a93-f3f7-4175-a8e7-093b5e6348d6?tab=screens
[d-widgets]: https://mobbin.com/flows/abc20f90-e070-4929-a063-c163265e2cc0?tab=screens
[d-reminders]: https://mobbin.com/flows/1c640d38-55e1-4be3-a692-e6a098d3c203?tab=screens
[d-streak1]: https://mobbin.com/flows/d1739059-58c7-4b20-8630-8833869d34bb?tab=screens
[d-streak2]: https://mobbin.com/flows/e7d141df-f1bd-4092-b218-59df9b26a657?tab=screens
[b1]: https://mobbin.com/flows/30231b26-5284-4891-b613-193a16c55b2e?tab=screens
[b2]: https://mobbin.com/flows/7ffbd4f0-78d1-49be-bf0d-9c90cac00e8c?tab=screens
[b3]: https://mobbin.com/flows/20ad012b-2683-4c0c-beb8-8ff62c6f509e?tab=screens
[bp1]: https://mobbin.com/flows/70d3200e-a9ff-4339-aa42-5a1b7ba11760?tab=screens
[bp2]: https://mobbin.com/flows/56a17e55-be7a-41bc-a1ef-cbfc2e5957dc?tab=screens
[bp3]: https://mobbin.com/flows/48aa5db4-c481-4af8-8a7c-36cd47824317?tab=screens
[b-prem]: https://mobbin.com/flows/24b16d83-c7b3-4304-a2bb-e159cdf4b1b3?tab=screens
[b-lesson]: https://mobbin.com/flows/149f97af-ed5a-4639-9286-5484c1daea3b?tab=screens
[b-streak]: https://mobbin.com/flows/33644a98-3f54-4a97-8a9a-5464f159702f?tab=screens
[s-d1-hi]: https://mobbin.com/screens/a824931a-588b-4f12-9073-2bddae0816ca
[s-d1-7q]: https://mobbin.com/screens/74201708-1b1b-4b6d-b804-92f9eb2d65c9
[s-d1-build]: https://mobbin.com/screens/995a96a7-b9e7-4d1e-bea9-cbd7a5293790
[s-d1-react]: https://mobbin.com/screens/1a2c3854-ea7a-41fa-ab1b-95466c2c0228
[s-d1-50]: https://mobbin.com/screens/cf740740-e217-4a08-bb8b-4000e986ce07
[s-d1-notif]: https://mobbin.com/screens/817844ed-f7df-4645-b18b-a9803879821f
[s-d1-widget]: https://mobbin.com/screens/02616458-9551-4f91-bd89-5c9e16046dc8
[s-d1-plan]: https://mobbin.com/screens/3a223593-d3c7-48fc-bb96-27d9f9e79fca
[s-d1-free]: https://mobbin.com/screens/eade4735-8f46-4659-bc9e-2e93d306019e
[s-d2-hear]: https://mobbin.com/screens/0b5a0441-a7a1-472b-af2b-57dd5bc625a3
[s-d2-fresh]: https://mobbin.com/screens/392377a9-5035-42e4-86be-77c944737101
[s-d2-notnow]: https://mobbin.com/screens/87d92401-1020-42d8-9c41-a427528f9f7e
[s-d3-typing]: https://mobbin.com/screens/ee97593a-ac2b-4b71-a6e3-ea104aa61396
[s-d3-mock]: https://mobbin.com/screens/3a9230ea-4367-4a3c-a30a-d7027588b11c
[s-d3-real]: https://mobbin.com/screens/b390ce08-0ae8-4581-b8a6-3a1a7d10e03d
[s-d5-legend]: https://mobbin.com/screens/181ffc84-d045-4fac-a191-a4ef3aaa6565
[s-d8-remind]: https://mobbin.com/screens/a79bc5a0-78f6-4e3d-b677-e6eea78af004
[s-d8-plans]: https://mobbin.com/screens/956ca066-0d9e-49aa-b19c-9d29b15fe569
[s-d8-started]: https://mobbin.com/screens/e4db775d-921f-4ee0-87dd-824ec3fbe15b
[s-d9-choose]: https://mobbin.com/screens/dffccfd7-c78a-4964-b31a-49d052b1e176
[s-d9-picked]: https://mobbin.com/screens/97ef7575-6542-4c87-af8a-91237d9d1bb8
[s-d9-confirm]: https://mobbin.com/screens/98836c8b-4166-4dc6-878e-ee8558048d90
[s-d10-nox]: https://mobbin.com/screens/26548660-83c7-42e5-9ee0-65e47fd4dcc5
[s-d10-remind]: https://mobbin.com/screens/39ccc31c-fc93-412d-96da-66331591daa6
[s-d12-timer]: https://mobbin.com/screens/163037d7-1bc3-41eb-8909-aef55bccd135
[s-d13-76]: https://mobbin.com/screens/ac6f6af9-c6c9-455e-817e-a3a4b18d36f7
[s-d13-4days]: https://mobbin.com/screens/a3e467db-f7e3-4d4e-9eea-11c639c2e32a
[s-d13-going]: https://mobbin.com/screens/5e9dae45-4474-4f5c-9db0-9bfe372b290e
[s-d13-sheet]: https://mobbin.com/screens/656742c0-7f62-4a7f-a5a9-05e54747e036
[s-d13-skipads]: https://mobbin.com/screens/97e9b0dc-f653-4422-96e8-53650ff9accd
[s-b1-hi]: https://mobbin.com/screens/b54bafbc-2547-4959-91e5-a3aacf0c3f43
[s-b1-voice]: https://mobbin.com/screens/7388c25e-4081-48a8-8de3-ed7c623f04af
[s-b1-notif]: https://mobbin.com/screens/c33921fd-b1a6-4f0e-8c59-70b4121a18c7
[s-b2-react]: https://mobbin.com/screens/67fd93e8-f894-4ea5-b839-54cab47e9292
[s-b2-coffee]: https://mobbin.com/screens/81e83c70-504c-45c6-a079-b37dd104fa98
[s-b2-notif]: https://mobbin.com/screens/e538aa16-c301-4734-a606-ea7d78278ba2
[s-b2-paywall]: https://mobbin.com/screens/e54dd53d-62d8-4e5d-8955-920db2669848
[s-b3-notif]: https://mobbin.com/screens/44631af1-bf92-454a-b37f-4be7927a6b65
[s-b4-table]: https://mobbin.com/screens/9ff9cfa3-8209-4275-a972-11a892f7d0a5
[s-b4-timeline]: https://mobbin.com/screens/c5954cee-b3b0-4d32-a959-bbd9907c5785
[s-b4-plans]: https://mobbin.com/screens/c8179730-ad3b-4408-9574-cf64b4588649
[s-b4-unlocked]: https://mobbin.com/screens/b01053cd-3881-484a-94e0-007f1df69739
[s-b7-check]: https://mobbin.com/screens/09af69bb-65c2-4c02-8445-76386c0bccbd
[s-b7-done]: https://mobbin.com/screens/3c3cb198-8f28-4ed3-84e0-d9607f4da700
[duo-visemes]: https://blog.duolingo.com/world-character-visemes
[duo-widget]: https://blog.duolingo.com/widget-feature/
[duo-reshape]: https://blog.duolingo.com/reshaping-duo/
[designweek]: https://www.designweek.co.uk/issues/2-6-january-2019/duolingo-owl-receives-makeover-as-app-becomes-more-gamified
[creativebloq]: https://www.creativebloq.com/news/duolingos-redesigned-mascot-is-a-hoot
[rive-lily]: https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life
[rive-koji]: https://rive.app/blog/brilliant-builds-its-math-and-coding-tutor-character-with-rive
[rive-brilliant]: https://rive.app/blog/how-brilliant-org-motivates-learners-with-rive-animations
[brilliant-koji]: https://blog.brilliant.org/a-world-class-tutor-in-every-home/
[firstround]: https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker
[sub-club]: https://share.transistor.fm/s/4702cbd4/transcript.txt
[complaint]: https://www.sikayetvar.com/en/duolingo-us/duolingo-charged-me-for-premium-without-sending-the-promised-trial-expiration-notice

---

## 7. Mobbin notice

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
