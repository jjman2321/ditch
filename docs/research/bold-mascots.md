# Bold mascots & high-energy onboarding: screen-by-screen research

For: Ditch onboarding v2 (Welcome → tick → reveal → dates → reminders → paywall → pick 3).
Date: 9 Nov 2026. Sources: Mobbin (iOS), plus web articles listed in §7.
Scope: **BitePal** (main visual competitor), **Cal AI**, **Brainly**, **Duolingo**, **Cleo**, **Speak**, plus short looks at Noom, Quizlet, Flo, Brilliant. Lingokids and Photomath have no usable mascot flows on Mobbin, so they are not covered.

**Count:** 194 screens viewed one by one in 10 full flows, plus about 60 single screens from screen searches. Every row below is a screen I looked at. Animation notes are marked *(implied by stills)* where they come from frame sequences, not video.

How to read the tables: **#** = position in the Mobbin flow. **Exits** = every way off the screen. Links go to the exact Mobbin screen.

---

## 1. Per app, per flow

### 1.1 BitePal (raccoon "virtual pet" calorie app, by Reface)

**House style.** Lavender-grey backgrounds (#C9C8DD-ish) and soft pastel gradients that change per chapter (mint, pink, peach, periwinkle). Huge condensed black display type (a Druk/Anton-style condensed grotesk) for headlines, plain sans for options. Black pill CTA, floating, centred, about 60% width, with "›". Option cards are white, 16pt radius, emoji icon left, grey dot right; selected = green 2px border, pale green fill, green check. No progress bar except in the "goals" questionnaire. Copy is mostly third person ("BitePal keeps you on track"); the raccoon speaks only from a small round avatar.

**The raccoon (exactly as drawn).** Light lavender-grey body (#C4C3D8-ish), **heavy black outline (about 3–4px at hero size)** on every shape, solid black ears and a solid black mask band that wraps the whole eye line, **huge round eyes: white sclera ring + big black pupil + white catch-light**, pink blush ovals, **open mouth with two buck teeth and pink tongue**, a **white heart on the chest**, black-and-grey ringed tail with black tip. Proportions: head ≈ 55–60% of height, tiny bean body, stubby arms and legs, mostly **front-facing and symmetrical**. It has cosmetics (hats, bows, caps, chains), a name the user picks, hearts (health), coins and room backgrounds. It eats food, drools and lives in a bin.

#### Flow A: Onboarding (19 screens) · [flow](https://mobbin.com/flows/280827a4-34c7-4915-9dde-5d4de3005186)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Splash | Flat lavender, mark centred | (none) | Face-only mark: black mask blob, one eye winking, open mouth, 2 buck teeth, pink tongue | – | auto | Logo is the raccoon face, so the face = brand | [bpA-1](https://mobbin.com/screens/0aee27e7-0240-4559-a724-7fe57e392b10) |
| 2 | Welcome | Photo collage over sky gradient, giant headline, CTA low | "Reach your weight goals" · "With Cute raccoon" (handwritten, arrow) · "Get started" · "I already have an account" | Small round badge top-right, heart-holding, blush | Start | Sign in | Food photo, "310 kcal" chip, fasting ring "16:8"; handwritten annotation | [bpA-2](https://mobbin.com/screens/6d91ec2c-3183-4a94-bc91-e60724edaf4c) |
| 3 | Goal | Title top, 3 cards mid | "What is your main goal?" · "Lose weight" / "Maintain weight" / "Gain weight" | none | single pick | back | No CTA until a pick | [bpA-3](https://mobbin.com/screens/92057478-1609-4bbc-a61f-06bde5b72045) |
| 4 | Goal picked | same | same | none | – | Next ›, back | Green selected state; CTA appears | [bpA-4](https://mobbin.com/screens/feba873f-5205-406b-bede-84ef16c30cbd) |
| 5 | Extra goals | 8 multi-select cards | "Any additional goals?" · "Build healthy relationship with food", "Improve overall wellbeing", "Boost daily energy", "Improve gut health", "Feel better about myself", "Improve sport performance", "Reduce stress", "Learn more about nutrition" | none | multi | "No additional goals ›" | **Zero-selection CTA says what will happen** | [bpA-5](https://mobbin.com/screens/07351d14-0b6b-47cd-9ac9-e28055317646) |
| 6 | Extra goals picked | same | CTA becomes "Next ›" | none | – | Next | Label swap on first tick | [bpA-6](https://mobbin.com/screens/f30afab0-57b3-42b3-bafe-d2f69dffda71) |
| 7 | Proof chart | Chart card, stat chip | "BitePal keeps you on track" · "Other apps" vs "Your weight" · "58% BitePal users consistently maintain their weight over 6 months" | none | – | Next | Mint bg, confetti specks; **no source for 58%** | [bpA-7](https://mobbin.com/screens/263cb596-cc8c-4583-8215-96cad0b8bc82) |
| 8 | Feature collage | 3 tilted sticker cards | "Why BitePal's unique approach works" · "Just take a photo of your food" · "Track your daily progress" · "Get support from your virtual pet" · "Love it!" | Heart-eyed raccoon inside the coral card | – | Let's go › | Cards rotated ±8°, sticker look | [bpA-8](https://mobbin.com/screens/9a7d49b6-d0f8-43f2-a48b-9c71b294d109) |
| 9 | Science claim | Icon, headline, citation card | "Fasting boosts your body's potential" · NEJM card · "Source of recommendations" | none | – | Let's go | Real citation link | [bpA-9](https://mobbin.com/screens/6b861558-2104-40d9-b32d-3501a2422379) |
| 10 | **Mascot tease** | Illustration centred | "Open to see who is there" · button "Open" | Only a striped tail pokes out of a teal bin lid | Tap to reveal | Open | Bin, apple core, fish bone, bottle, brick wall; **reveal as a tap** | [bpA-10](https://mobbin.com/screens/167bab5d-99d8-4407-96a7-d065e5586685) |
| 11 | **Reveal** | Big raccoon bursting up from bin | "This raccoon is now your virtual pet" | Full body mid-leap, pointing at self, open grin; trash flying | – | Next › | *(implied)* pop-out with flying debris | [bpA-11](https://mobbin.com/screens/1e19816e-88c6-419e-9258-b336cfe58722) |
| 12 | Name it | Big text field, keyboard up | "Name your raccoon" · prefilled "Nomad" | Head peeks from top-right corner, cropped | type name | Next ›, 🎲 random | Dice = no-effort default | [bpA-12](https://mobbin.com/screens/5e120298-7e6f-473f-8a31-09c1ba88de06) |
| 13 | Named | same | "Alex" | same | – | Next › | – | [bpA-13](https://mobbin.com/screens/c4bc41b1-0690-4630-9cc4-bfd2647d601e) |
| 14 | **Personality picker** | Avatar + bubble, 2×2 cards | "How should I talk to you?" · "Cheerleader" / "Gentle & kind" / "Straight talker" / "Mindful guide" | 4 costumed raccoons: star eyes; pink bow + sparkly eyes; backwards cap + smirk; eyes closed + robe | single pick | back | No CTA until picked | [bpA-14](https://mobbin.com/screens/767e06bd-82f9-4837-bff5-61b04bd7266f) |
| 15 | Personality preview | same | Bubble changes to a sample line: "You showed up again today. That's the whole thing." | Selected card gets green ring | – | Next › | **Bubble previews the chosen voice** | [bpA-15](https://mobbin.com/screens/2079a9b1-d935-48ba-a533-058e77de08a0) |
| 16 | Reminder pitch | Mock notification + raccoon on rainbow | "We'll support you to keep logging" · notif: "Don't forget to snap your meal 📸" "(1 left)" hearts | Standing, thumbs up, on a rainbow | – | Set up reminders › | Pink bg; hearts = pet health | [bpA-16](https://mobbin.com/screens/083cc63f-4506-4dd8-9fc4-b20c2dba4f77) |
| 17 | Reminder timing | 3 options + tip card | "When would you like to receive reminders" · "In the morning" / "Before all meals" / "When pet is hungry" · tip "Reminders build healthy eating habits 2x faster" | none | multi | "Set up later" | **"2x faster" unsourced** | [bpA-17](https://mobbin.com/screens/09d48551-961b-4c22-89fb-8efc19df2d62) |
| 18 | Timing picked | same | – | none | – | Next ›, Set up later | – | [bpA-18](https://mobbin.com/screens/35aa1210-024f-4255-a4e9-2115e9ff509d) |
| 19 | Chapter break | Headline + raccoon | "Now let's talk about your eating habits" · "Let's go" | Sitting, ^^ eyes, thought bubbles (apple, drumstick), "?" marks | – | Let's go | **Chapter cards split the long flow** | [bpA-19](https://mobbin.com/screens/ec8613f3-504c-4f56-8b67-49941c26e3d0) |

#### Flow B: Onboarding, other variant (18 screens) · [flow](https://mobbin.com/flows/3aca70bc-a1e3-4895-9a72-24dc68de3bf9)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1–2 | Splash, welcome | as Flow A | as Flow A | as Flow A | – | – | – | [bpB-1](https://mobbin.com/screens/b47ad272-f932-4e85-8a50-5ce4b4378191) [bpB-2](https://mobbin.com/screens/7f0f1cef-f5a1-40ba-8a33-9ae85b35716e) |
| 3 | Feature slide 1/5 | Food photo card, raccoon peeking up from bottom edge | "Track calories" · "Just snap a photo and let AI do the rest" | Paws up, blush, big eyes, peeking | – | Next › | Calorie chips on food ("Avocado 100 kcal") | [bpB-3](https://mobbin.com/screens/2fdad348-afaa-4b0e-aa97-b5234faac3fc) |
| 4 | Attribution | 6 cards | "How did you hear about us?" · "From influencer", "Instagram", "TikTok", "Youtube", "App Store search", "Friends/family" | none | single | "Skip ›" | Skip until picked | [bpB-4](https://mobbin.com/screens/64e19186-5560-40d7-9084-8880d022e6fb) |
| 5 | picked | same | – | none | – | Next › | – | [bpB-5](https://mobbin.com/screens/2b9da463-6c1f-4a1d-87f8-f10e552b4df6) |
| 6 | Influencer name | Field + keyboard | "Enter the influencer's name (if you remember)" | none | text | "No, skip ›" | Attribution for creator deals | [bpB-6](https://mobbin.com/screens/097aefdf-5254-45ae-9a11-1eacc976e33a) |
| 7 | Proof chart | Chart | "BitePal provides long-term results" · "76% BitePal users maintain their weight loss over 6 months" | none | – | Next › | **Flow A said 58%** for a similar claim | [bpB-7](https://mobbin.com/screens/1bc860d4-3486-4b40-a763-ada0374565ff) |
| 8 | Feature collage | as A8 | as A8 | heart eyes | – | Let's go › | – | [bpB-8](https://mobbin.com/screens/9883a97b-c8ba-4012-af5b-0b425bdd462b) |
| 9 | Science claim | Icon + citation | "Fasting makes you lose weight 1.2x faster" · Harvard Health card | none | – | Let's go | Number in blue | [bpB-9](https://mobbin.com/screens/9e717c99-e710-478b-a400-31432659c0c0) |
| 10 | Pet intro | Paw prints, stat chip | "Let's meet your virtual pet!" · "5x Gamification makes habits stick for up 5x longer" | Paw prints only | – | (auto) | **"5x" unsourced** | [bpB-10](https://mobbin.com/screens/b308455c-2a52-4fcc-97b9-2244358a7269) |
| 11 | Reveal frame 1 | Closed bin | "This raccoon is now your virtual pet" | Hidden | – | Next › | Lid on | [bpB-11](https://mobbin.com/screens/4f7dc39e-f519-490d-a32e-7297439e3e8e) |
| 12 | Reveal frame 2 | Raccoon pops out | same | Leaping out | – | Next › | *(implied)* auto pop, no tap | [bpB-12](https://mobbin.com/screens/fd8caa0a-40a4-4ff8-8d0c-39274f6d6f6d) |
| 13 | Name | Field | "Name your raccoon" · "Caramel" | Peeking corner | text | Next ›, 🎲 | – | [bpB-13](https://mobbin.com/screens/fb89e82e-cda9-4af5-bb3f-8415b5f0b0ef) |
| 14 | **Rating ask before use** | Sunburst, stats, reviews | "Help us grow" · "Give us rating" · "4.8 average rating" · "2M+ people" · reviews "Exactly what I needed!", "Loving this app!!!" | Star-eyed head | rate | Next › | Asks for App Store rating **before the user has used the app** | [bpB-14](https://mobbin.com/screens/18829648-7e6f-4e5f-8fd0-4361487a0a10) |
| 15–17 | Reminders | as A16–18 | as A | as A | – | – | – | [bpB-15](https://mobbin.com/screens/637cd36a-b7ac-4b8d-a2cb-a600adb71ef3) [bpB-16](https://mobbin.com/screens/66bbc88e-dd92-4254-8c21-a7bd82affeaf) [bpB-17](https://mobbin.com/screens/eeda109a-2260-4802-8849-eb96f7c97434) |
| 18 | Chapter break | as A19 | as A19 | as A19 | – | – | – | [bpB-18](https://mobbin.com/screens/b4f31e6f-e773-42b3-a554-45a0d70e6d89) |

#### Flow C: Setting up goals (14 screens) · [flow](https://mobbin.com/flows/240d794c-1df2-459c-b295-5ef878eb37a1)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Chapter card | Headline + raccoon | "Got it! We'll help you to reach your goals" · "Set up your goal" | Heart eyes, paws to mouth, floating hearts | – | Set up your goal | Pink gradient | [bpG-1](https://mobbin.com/screens/8277cb35-898e-41fc-9385-63507eebae8a) |
| 2 | Gender | **Thin green progress bar appears**; avatar + bubble | "Select your gender." · Female / Male / Non-binary | 40pt round avatar (blue circle) left of bubble | single | back | CTA hidden until pick | [bpG-2](https://mobbin.com/screens/57a66015-4bb5-47b5-87d4-8fd69534f758) |
| 3 | picked | same | – | same | – | Next › | – | [bpG-3](https://mobbin.com/screens/c9681c10-91c0-411f-a64d-9bf1312762b4) |
| 4 | Activity | 4 cards w/ signal bars | "What's your activity level?" · "Not active: I quickly lose my breath climbing stairs" · "Lightly active: Sometimes I do short workouts to keep myself moving" · "Moderately active…" · "Highly active: Fitness is a core part of my lifestyle" | avatar | single | – | **Funny, relatable subtitles** | [bpG-4](https://mobbin.com/screens/350443c0-dfb4-41f5-afc1-ea8253f8e087) |
| 5 | picked | same | – | – | – | Next › | – | [bpG-5](https://mobbin.com/screens/6be72e1f-08f3-4a3a-85c1-6656805039aa) |
| 6 | Health primer | Icon pair, body, trust line | "Connect Health to sync activity" · "We never use your health data for ads or sale" | App icon (raccoon face) ↔ Health heart | permission | "Connect Health" / "I'll add activities manually" | Honest decline label | [bpG-6](https://mobbin.com/screens/af5234db-93d1-42a6-a2f7-89aa28d07c6f) |
| 7 | Calorie mode | 2 cards | "How should your activity affect your daily calories?" · "Smart mode" (Recommended) / "All calories" | avatar | single | Next › | – | [bpG-7](https://mobbin.com/screens/d6e34e12-16b7-4b96-93ad-7ecd77f95ee2) |
| 8 | Weight | Big wheel picker + live card | "What's your current weight?" · "Your BMI: 20.8 Healthy" · "You're in a healthy range. Let's focus on what matters most to you." | avatar | wheel | Next › | **Live feedback under the picker** | [bpG-8](https://mobbin.com/screens/c54810d2-f9e5-49dc-807e-21184c10a239) |
| 9 | Summary | Card under big raccoon head | "Your personal summary" · BMI gradient bar "You: 20.8" | Huge grin, squint eyes, teeth, peeking over card | – | Next › | Mint bg | [bpG-9](https://mobbin.com/screens/ebcb96f6-6a5e-47c6-a884-0c1eaa33ee72) |
| 10 | Summary scrolled | same | "Activity level: Lightly active" · "Diet type: Balanced" · "Metabolism: Balanced: needs steady habits to see change" | – | – | Next › | – | [bpG-10](https://mobbin.com/screens/82a3b1e4-5b14-400b-9a20-f4a131b49ca0) |
| 11 | Target | Wheel + live card | "What's your target weight?" · "Maintain weight · Realistic" | avatar | wheel | Next › | Live "Realistic" tag | [bpG-11](https://mobbin.com/screens/0e7cb7e0-68e9-48e6-b2c0-7143bcede7b8) |
| 12 | Target changed | same | "Weight gain: 8% · Realistic · A steady, manageable increase, great for muscle growth." | – | – | Next › | Card text updates with value | [bpG-12](https://mobbin.com/screens/e382855b-2c2e-4853-86ab-ea99e06d9f8b) |
| 13 | Pace slider | Slider w/ tooltip | "How fast you want to achieve your goal?" · "0.4 kg" · "Recommended" · "Slow / Optimal / Fast" · "Reach your goal by 27 December" | avatar | slider | Next › | **Date updates live** | [bpG-13](https://mobbin.com/screens/52067204-a95e-43b0-b8c9-011c736417bb) |
| 14 | Payoff | Sunburst | "Gaining 5 kg is a realistic target" · "You are just one step away from getting you personalized plan" · "Get my personal plan" | Hands on cheeks, awed, blush | – | CTA | Yellow sunburst | [bpG-14](https://mobbin.com/screens/245ab2df-35f9-4a3e-b886-50787b19704d) |

#### Flow D: Completing setup → paywall → home (15 screens) · [flow](https://mobbin.com/flows/d84c49f9-1052-4d02-a283-2f0b22ad1da9)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Payoff | as G14 | "Gaining 5 kg is a realistic target" | awed | – | Get my personal plan | – | [bpS-1](https://mobbin.com/screens/245ab2df-35f9-4a3e-b886-50787b19704d) |
| 2 | **"Analyzing" loader** | Checklist + bar, raccoon reads scroll | "Personalizing your plan" · "Analyzing your profile ✓" · "Calculating your metabolism 69%" · "Defining your nutrition" · "Analyzing lifestyle" · "Loved by 10M+ users ★★★★★" | Bottom-cropped, reading a long yellow scroll, one eye squinting | – | none (wait) | **Theatre loader**; "10M+" | [bpS-2](https://mobbin.com/screens/b9b346a7-8a54-4825-ab5f-f6d29ea5579d) |
| 3 | Question in loader | Grey scrim, bubble modal from raccoon | "Do you tend to eat more on the weekend?" · No / Yes / Not sure | Same, bubble points at it | single | – | Questions fill the wait | [bpS-3](https://mobbin.com/screens/6e23aa19-c964-4009-b436-7a5e5b5c9824) |
| 4 | Question 2 | same | "Do you get cravings?" · All the time / Now and then / Rarely | same | single | – | – | [bpS-4](https://mobbin.com/screens/d4010868-c3dd-4f14-b546-f04695a57738) |
| 5 | Plan ready | Confetti, chart, checks | "Your personal plan is ready" · "Reach 65 kg by 27 December" · "See the first visible results in just 3 weeks" · "Habits will help you sustain your success" | none | – | "Commit to my goal ›" | Commitment CTA | [bpS-5](https://mobbin.com/screens/06dc81da-8575-4971-a790-73df7bc8b3cb) |
| 6 | Plan scroll | Cards | "Nutrition recommendations 2,325 Calories" · "Meal plan 28 days" · "A plan that suits your needs" | none | – | Commit… | – | [bpS-6](https://mobbin.com/screens/f01b41a2-91da-4f86-84b9-7b50505ae88c) |
| 7 | Plan scroll | Checks + review carousel | "Customized for male age 31+" · "Trusted by 10k users" · review "…the character is so cute, it's always kind to you no matter what you eat…" | none | – | Commit… | **"10k users" vs "10M+" vs "2M+"** | [bpS-7](https://mobbin.com/screens/80675a62-2c61-4046-afd3-624e8989f99c) |
| 8 | **Paywall** | X top-left, hero, 2 plans, CTA | "I'll help you reach 65 kg by 27 Dec" · "Yearly plan · Most popular · $49.98/yr · $4.16/mo" · "Family plan 2–6 members $99.98/yr · $8.33/mo" · "Secure payment. Cancel anytime." · "Continue ›" · "Terms of Use · Privacy Notice · Restore" | Surfing a carrot on a wave, cool squint | buy | X, Continue | First-person headline from mascot; no trial timeline | [bpS-8](https://mobbin.com/screens/de10057f-86df-48b6-bae9-8f3bc8eb854a) |
| 9 | **Exit offer 1** | Gift box | "We have a gift! Just for you!" · "Open now" | Tail sticking out of gift box | – | Open now | Shown after X | [bpS-9](https://mobbin.com/screens/170c5659-b8af-4d75-b095-5bfd6c23b84f) |
| 10 | **Exit offer 2** | Dark ticket card | "Limited time -60% offer" · "Offer expire in: 59:51" · "$7.28" struck → "$2.91 per month" · "Claim your offer" · "First year $34.98, then $89.98/year. Cancel anytime." | Heart-eyed raccoon peeking over card | buy | faint X | **Countdown + fake anchor; renews at $89.98, higher than the $49.98 plan** | [bpS-10](https://mobbin.com/screens/6a2d89ef-cd39-44c1-87d8-19f7a2b8631d) |
| 11 | **Confirmshaming** | Bottom sheet | "Are you sure to skip -60% offer?" · "Back to offer" / "Skip this offer forever" | Panicking: wide eyes, sweat puffs, crouched | – | 2 buttons | Mascot used as guilt | [bpS-11](https://mobbin.com/screens/84d38c37-2e24-4a25-8a92-df7c531fc571) |
| 12 | Widget | Phone mock | "Bring Alex to your home screen" · "Add widget" / "Maybe later" | Squinting grin in widget | – | X, Maybe later | Uses pet name | [bpS-12](https://mobbin.com/screens/69b5a69d-2172-48b2-a0a9-e0248ed03de4) |
| 13 | Account | Raccoon + SSO | "Now let's create account" · "Save your progress & reach your goals" · Continue with Apple / Google | Making a heart with paws | sign in | – | Account after paywall | [bpS-13](https://mobbin.com/screens/30e8159f-dbe6-4f75-8c77-34f8be796c04) |
| 14 | First action | Home + speech card | "Feed Alex" · "What did you eat last?" · "I'll do it later" | Raccoon huge at top, arms out | log | I'll do it later | **Mascot owns the first action** | [bpS-14](https://mobbin.com/screens/eb74890f-44ab-41bd-8933-7beebe1036c3) |
| 15 | Home | Raccoon fills top 40% | "Calories eaten 390" · macros 🔒 · "BitePal Plus 🔒" | Standing, talking | – | tabs | Mascot sits **above** the data | [bpS-15](https://mobbin.com/screens/59cbdcda-5d83-4d87-940f-12e95fcfacfb) |

**Other BitePal screens seen** (single screens):
- Plan ready, loss variant: "Reach 62 kg by 28 January 2026"; scroll card "Over 10,000+ With 5-star reviews worldwide" with a shy raccoon hugging its tail ([flow](https://mobbin.com/flows/ffd6f588-b052-4fe7-ad34-d1fb96473e42)).
- "Now you should take care of Caramel": "Every time you log a meal, you fill Caramel health meter" with 4 hearts ([flow](https://mobbin.com/flows/9c310318-40a5-48df-b0a5-176a7cfce2d8)).
- First-run coachmark, handwritten "Log your first meal…" with an arrow to +. Halloween pumpkins on the home scene.
- Questionnaire: "Between what hours do you eat?" two wheels with a live "Eating window: 9 hours" card. Food restrictions as a chip cloud, where the **default CTA is "✓ I eat everything"** ([flow](https://mobbin.com/flows/80476d01-be1c-4556-92ed-a98135fdada4)).
- Paywall v2: X and "Restore" pill, raccoon peeking from a food photo, "Annual · Best deal -50% off · $99.99 → $49.98 · $4.16/per month" next to "Weekly · Pay-as-you-go · $5.99", CTA "Claim 50% off now" [screen](https://mobbin.com/screens/19ffa622-fc5f-4dd1-803b-530c11d4c9de).
- BiteCoins store, where coin packs carry struck "was" prices [screen](https://mobbin.com/screens/40c52098-ea32-40e1-a952-bcee5a435529). Cosmetic "Cozy room · Unlock for 250" [screen](https://mobbin.com/screens/49941afc-fdc0-4d6e-a12d-fef622bc92e4). Weekly challenges [screen](https://mobbin.com/screens/f6acf138-8589-497c-8e83-ad0105baefd8).
- "2 day streak!" calendar with "Streak saver ×2" [screen](https://mobbin.com/screens/c6961180-60fb-450b-88af-27755cdfd567).
- Meal result: the raccoon says **"You're the master of the noms! Thanks for being such a pawsome provider!"** (pun voice) [screen](https://mobbin.com/screens/c3bbc587-3c65-4942-a658-b049e17b0f8e).
- Raccoon in a chef hat, "Rate your food logging experience?" with 5 stars and "Not now" (pre-filter before the App Store prompt) [screen](https://mobbin.com/screens/bf79d202-5e82-47bc-b1eb-5db218375af5).
- AI scan loader "Almost ready…" with the raccoon **drooling** [screen](https://mobbin.com/screens/bc9099c8-21ca-4619-aa8a-1db4ca9fce01).

**Every place the BitePal raccoon appears:** splash mark, welcome badge, feature slides, bin reveal, naming, personality picker, question avatar, chapter cards, summary, loader, paywall hero, exit offers, confirmshaming sheet, widget, account screen, home hero, meal results, rating prompt, scan loader, store/cosmetics, streaks. **It is everywhere, including on top of data and inside guilt moments.**

**Voice:** puns ("pawsome", "noms"), cute, first person on the paywall ("I'll help you reach…"), and four user-picked personalities. The review cited in §7 says its "Messaging avoids guilt and restriction" in day-to-day use. The paywall exit flow does the opposite.

---

### 1.2 Cal AI (no mascot; the "long quiz" benchmark)

**House style.** Pure white, near-black type in a geometric sans, full-width near-black pill CTA "Continue" pinned at the bottom (grey while disabled). Round back arrow, thin black progress line, "EN" language pill. A selected option inverts to solid black. Line-art illustrations inside pastel gradient rings. No character. Energy comes from **momentum**: one question per screen, an instant response, and charts every few steps.

#### Onboarding (34 screens) · [flow](https://mobbin.com/flows/579da5dd-453a-4e7c-9c11-d20708a4db82)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Splash | Logo | "Cal AI" | – | – | auto | – | [cal-1](https://mobbin.com/screens/2faf5056-f041-4378-bde4-105eaaeb9efd) |
| 2 | Welcome | Phone mock scanning a sandwich | "Calorie tracking made easy" · "Get Started" · "Already have an account? Sign In" | – | – | Get Started, Sign In | Shows the product doing its job | [cal-2](https://mobbin.com/screens/b81a2852-a56e-4a65-a5b3-1fe910eac735) |
| 3–4 | Gender | 3 grey cards | "Choose your Gender" · "This will be used to calibrate your custom plan." · Male / Female / Other | – | single | back | Grey CTA until picked; the sub-line repeats on most screens | [cal-3](https://mobbin.com/screens/d11cc90b-432b-4a3d-9a35-87cd360d30ae) [cal-4](https://mobbin.com/screens/db41a38f-ced1-474a-abac-b9469c3c14e5) |
| 5 | Workouts | 3 cards w/ dot icons | "How many workouts do you do per week?" · "0-2 Workouts now and then" · "3-5 A few workouts per week" · "6+ Dedicated athlete" | – | single | Continue | Dot-count icons | [cal-5](https://mobbin.com/screens/fc7c2bc0-e679-4e5b-8b90-b09615c685e8) |
| 6 | Attribution | list w/ logos | "Where did you hear about us?" | – | single | Continue | – | [cal-6](https://mobbin.com/screens/a0f93583-592f-40bd-a528-ae80623fc1bd) |
| 7 | Prior apps | 2 cards w/ thumbs | "Have you tried other calorie tracking apps?" · No / Yes | – | single | Continue | – | [cal-7](https://mobbin.com/screens/8853b8bc-b410-4628-8977-48e3eba5c746) |
| 8 | Proof chart | Chart card | "Cal AI creates long-term results" · "Traditional diet" · "80% of Cal AI users maintain their weight loss even 6 months later" | – | – | Continue | No source | [cal-8](https://mobbin.com/screens/adcbd8be-482c-44fd-b267-035af17bce34) |
| 9–11 | Height & weight | Toggle + wheels | "Height & weight" · Imperial / Metric | – | wheels | Continue | Unit toggle | [cal-9](https://mobbin.com/screens/9397241f-70e0-4cc9-a5f5-d478d9a7c989) [cal-10](https://mobbin.com/screens/cbf00a91-d454-4224-b596-dc06d0134741) [cal-11](https://mobbin.com/screens/7fd29012-5220-449b-8801-d456b95518c5) |
| 12 | Birthday | 3 wheels | "When were you born?" | – | wheels | Continue | – | [cal-12](https://mobbin.com/screens/722866e6-1450-4e55-bffd-69bbff3dbedc) |
| 13 | Goal | 3 cards | "What is your goal?" · "This helps us generate a plan for your calorie intake." | – | single | Continue | – | [cal-13](https://mobbin.com/screens/41704253-ceba-49de-b89d-8f4289cf02e6) |
| 14–15 | Desired weight | Big number + **ruler slider** | "What is your desired weight?" · "Gain weight" · "77.0 kg" → "78.0 kg" | – | ruler drag | Continue | Tactile ruler with ticks | [cal-14](https://mobbin.com/screens/d6318876-764c-4c68-aeb0-2be58f6eb0c1) [cal-15](https://mobbin.com/screens/5d842120-f0ee-4d42-8942-87931d18be95) |
| 16 | Reassure | Centred text | "Gaining 6 kg is a realistic target. It's not hard at all!" · "90% of users say that the change is obvious after using Cal AI and it is not easy to rebound." | – | – | Continue | Number in orange; no source | [cal-16](https://mobbin.com/screens/d89d378a-1604-425f-9943-309a674ff098) |
| 17 | Pace | Slider w/ animal icons | "How fast do you want to reach your goal?" · "Gain weight speed per week 1.0 kg" · sloth / hare / cheetah · "Recommended" | – | slider | Continue | **Animal icons make a slider fun** | [cal-17](https://mobbin.com/screens/31013767-003c-4cc7-951a-6f081cbbce14) |
| 18 | Proof bars | 2 bars | "Gain twice as much weight with Cal AI vs on your own" · "Without Cal AI 20%" vs "With Cal AI 2X" · "Cal AI makes it easy and holds you accountable." | – | – | Continue | Unclear maths (20% vs 2X) | [cal-18](https://mobbin.com/screens/980d921a-ad79-4e83-a9bb-c9eddc3d0e8f) |
| 19 | Barriers | 5 cards w/ icons | "What's stopping you from reaching your goals?" · "Lack of consistency" / "Unhealthy eating habits" / "Lack of support" / "Busy schedule" / "Lack of meal inspiration" | – | single | Continue | – | [cal-19](https://mobbin.com/screens/421d286e-7917-402b-9a47-dab5a17231ff) |
| 20 | Projection | Curve 3/7/30 days, trophy | "You have great potential to crush your goal" · "Based on Cal AI's historical data, weight gain is usually delayed at first, but after 7 days, you can reach your goal quickly!" | – | – | Continue | – | [cal-20](https://mobbin.com/screens/2cf049e1-e6f3-4a04-b10b-b0323d01b4f5) |
| 21 | Trust beat | Line-art high-five in gradient ring | "Thank you for trusting us" · "Now let's personalize Cal AI for you..." · "Your privacy and security matter to us. We promise to always keep your personal information private and secure." | – | – | Continue | Halfway "thank you" | [cal-21](https://mobbin.com/screens/a28f488e-8d73-42b8-88c8-4fcb6830dc78) |
| 22 | Health | Diagram | "Connect to Apple Health" · "Sync your daily activity between Cal AI and the Health app to have the most thorough data." | – | permission | Continue / "Not now" | – | [cal-22](https://mobbin.com/screens/8712ac96-74cd-4f29-a2c8-6bb93458f8ac) |
| 23 | Setting | Photo + card | "Add calories burned back to your daily goal?" · "Today's Goal 500 Cals · Running +100 cals" | – | yes/no | No / Yes | Two equal pills | [cal-23](https://mobbin.com/screens/a4f37604-1ddc-4643-8fbc-64f30246c0c2) |
| 24 | Setting | 2 ring cards | "Rollover extra calories to the next day?" · "Rollover up to 200 cals" · "Yesterday 350/500 … Today 350/650" | – | yes/no | No / Yes | Shows the effect visually | [cal-24](https://mobbin.com/screens/084ba014-f77c-4c59-ba9a-2acc8f4a5224) |
| 25 | **Rating ask** | Laurel, avatars, review | "Give us a rating" · "4.8 ★★★★★ 100K+ App Ratings" · "Cal AI was made for people like you" · "5M+ Cal AI Users" · review: "I lost 15 lbs in 2 months! I was about to go on Ozempic…" | – | rate | Continue | Rating before use | [cal-25](https://mobbin.com/screens/52b265a8-450d-4169-8247-24e70250d0c7) |
| 26 | **Notification primer** | In-page drawing of the system alert, finger emoji | "Reach your goals with notifications" · drawn alert "Cal AI would like to send you Notifications" "Don't Allow / Allow" (Allow is black) · 👆 | – | permission | Allow / Don't Allow | Fake alert drawn on the page | [cal-26](https://mobbin.com/screens/66d99844-e915-4e28-b31f-53214b84d2d4) |
| 27 | Account | Sign-in alert | "Save your progress" · "Would you like to sign in later? Skip" | – | sign in | Skip | – | [cal-27](https://mobbin.com/screens/5d023924-4ed5-44d4-b952-c4863226fd25) |
| 28 | Referral | Field | "Enter referral code (optional)" · "You can skip this step" | – | text | Continue | – | [cal-28](https://mobbin.com/screens/9375f3af-76c5-4917-b2bf-53b2a9494471) |
| 29 | Build-up | Finger-heart line art | "All done!" · "Time to generate your custom plan!" | – | – | Continue | – | [cal-29](https://mobbin.com/screens/66c86298-a8b3-4c30-94d3-8db0c7806fdd) |
| 30 | **Loader** | Big % + bar + checklist | "18%" · "We're setting everything up for you" · "Customizing health plan..." · "Daily recommendation for · Calories · Carbs · Protein · Fats · Health Score" | – | – | wait | Theatre loader | [cal-30](https://mobbin.com/screens/63944ee4-76ea-4bcd-8f0f-543e7240f4ff) |
| 31 | **Result** | Check, goal chip, 4 rings | "Congratulations your custom plan is ready!" · "You should gain: Gain 6 kg by October 13" · "Daily recommendation · You can edit this anytime" · 2583 / 300g / 184g / 71g | – | – | "Let's get started!" | **Every number has an edit pencil** | [cal-31](https://mobbin.com/screens/7294b9e4-76ae-4d49-af18-bfb3d8a2566a) |
| 32 | Account again | SSO | "Save your progress" · Sign in with Apple / Google · Skip | – | – | Skip | – | [cal-32](https://mobbin.com/screens/8a2c0faf-61ab-4b84-b833-c80c3aeb19de) |
| 33 | **Paywall** | Phone mock, CTA, price under | "Unlock CalAI to reach your goals faster." · "✓ No Payment Due Now" · "Continue" · "Just $29.99 per year ($2.49/mo)" · "Restore" | – | buy | **no close visible in this frame** | Price small, under the CTA | [cal-33](https://mobbin.com/screens/6e269857-5e29-4c86-8d0a-8b0961d10c53) |
| 34 | Home | Rings, week strip | "2583 Calories left" · "You can switch apps or turn off your phone. We'll notify you when the analysis is done." | – | – | tabs | Honest async note | [cal-34](https://mobbin.com/screens/384c2f84-ab20-437a-b149-82a9881328bf) |

**Cal AI paywall variants** (single screens):
- Step 1: "We want you to try Cal AI for free" · "✓ No Payment Due Now" · "Try Now". No price, no close [screen](https://mobbin.com/screens/b38ea1cf-1eba-47f5-99b2-27e11ba842e8).
- Step 2: "Start your 3-day FREE trial to continue" · "3 DAYS FREE · Start for free & save 75% · $39.98 billed annually · $3.33/mo" vs "Monthly $14.98/mo" · "3 days free, then $39.98 per year. Billed annually and renews automatically unless canceled in the App Store." Back arrow, no X [screen](https://mobbin.com/screens/e145982d-dec3-4809-9325-816c72f9db32).
- Superwall's case study says Cal AI ran 123 paywall experiments, including a **spin-wheel discount** paywall. 87% of new users see a paywall (§7).

---

### 1.3 Brainly (purple three-eyed mascot)

**House style.** Neon lime (#84E84A-ish) + near-black + white. The slanted black "BRAINLY" box logo. Heavy condensed caps for paywall headlines. Forms on white sheets with very rounded corners. **Mascot:** a violet teardrop/ghost blob with **three eyes** (a small third eye on top), raised worried brows, no mouth, no outline, and green 4-point sparkles around it. It shows up only at the start (welcome, "Let's go") and as a greeter on Home. **It never appears on a paywall.**

#### Onboarding (16 screens) · [flow](https://mobbin.com/flows/39be929d-0ba5-40ce-a922-e15af126770e)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Splash | Lime full-bleed | "BRAINLY" | – | – | auto | Slanted logo | [br-1](https://mobbin.com/screens/7824d5e0-5161-4fac-8161-e97645729054) |
| 2 | Country | Sheet list A–Z | "WHERE ARE YOU LOCATED?" · "USA · BRAINLY.COM" | – | single | – | Domain under each country | [br-2](https://mobbin.com/screens/45a20664-8938-4b32-934e-2b5795a9328f) |
| 3 | Country picked | same | "CONFIRM" (inline pill) | – | – | Confirm | Inline confirm, no bottom CTA | [br-3](https://mobbin.com/screens/53fb1894-91c1-46e3-9352-b65c59429de2) |
| 4 | **Mascot arrives (frame 1)** | Dark bg, purple orb centred | "Welcome to Brainly." · "If you're already a registered user you can log in at any time to let me know who you are and to get the most out" | Curled into a purple ball with sparkles | – | – | *(implied)* orb unfurls | [br-4](https://mobbin.com/screens/0e56f94f-0f0c-495d-986e-4784e5f3144d) |
| 5 | Welcome (frame 2) | same | same text + "Log in" (lime) / "Register" (dark) · "Skip" | Unfurled: three eyes, brows raised | – | Log in, Register, **Skip** | Mascot speaks in first person ("let me know") | [br-5](https://mobbin.com/screens/aea64cc3-9d39-4d32-998b-9f96ebdee895) |
| 6–7 | Sign up | White sheet, email + SSO | "Join Brainly Community" · "Get instant answers, scan your homework to solve it, and ace your exams with AI-powered features tailored to your learning style!" · "We won't spam you. We value your privacy." · "We never share anything on your behalf." | – | email/SSO | X, LOG IN | Royal-blue SIGN UP | [br-6](https://mobbin.com/screens/cfbea01b-d9df-4820-aade-6cb9175e1f0d) [br-7](https://mobbin.com/screens/b99e7dad-b1cb-48be-add7-994b5222ae79) |
| 8 | Username | Field | "First, we need to know what to call you" · "You'll see this name on your profile" | – | text | NEXT | – | [br-8](https://mobbin.com/screens/3ddbf9b2-cb9a-469c-bb0c-b60d50d7c5e1) |
| 9–10 | Password | Field | "Next up, your password" · "Pick 6-32 of your favorite characters." | – | text | NEXT | Playful rule text | [br-9](https://mobbin.com/screens/e0df269f-992f-4967-8afe-8dd3b61b2074) [br-10](https://mobbin.com/screens/d5a62282-6266-4bd1-9278-28d11f74d64f) |
| 11–12 | About you | Dropdowns | "Tell us about yourself" · "We need this information to keep Brainly safe place." · "How did you hear about Brainly?" | – | fields | NEXT | – | [br-11](https://mobbin.com/screens/bc3a61e9-16c8-4d5a-9fa4-6b6aee8e3a48) [br-12](https://mobbin.com/screens/24692f8b-d848-4572-80b3-f848bf525d6d) |
| 13–14 | Role + terms | 2 rows + checkbox | "Finally, tell us how you identify" · "Don't worry, it's safe space." · "I'm a student" / "I'm a parent" · "I agree to the Terms of Use and Privacy Policy." | – | – | SIGN UP | – | [br-13](https://mobbin.com/screens/86b64838-efed-4805-8749-7cdcdb9a7051) [br-14](https://mobbin.com/screens/d9a72cad-76e5-4fbe-ac65-1ffa0bac4365) |
| 15 | ATT primer | Modal over Home | "Help us improve your experience!" · "Please hit "Allow" on the next screen so we can use personalized ads to tailor your experience to your preferences." · "CONTINUE" | Mascot visible on Home behind | – | **one button only** | Primer with no decline | [br-15](https://mobbin.com/screens/97e9f7c8-7723-44db-9317-2cf59394c0b7) |
| 16 | Home | Mascot + bubble-less text, 6 cards | "Hi there! How can I help you get an A+?" · "Start AI tutoring / Get guidance" … | Top-left, big, sparkles | – | tabs | 3D glossy icons | [br-16](https://mobbin.com/screens/07e5079c-e9f0-4996-8365-06b9d39e93a6) |

**Brainly paywalls** (single screens):
- **Usage-limit sheet:** "You've used 10 of 10 free questions" · "Unlock unlimited access for every answer." · full bar "10 total / 0 left this week" · "SUBSCRIBE" · "S$ 14.48/month. Cancel anytime." · "Maybe later". This is an honest counter shown at the moment of need [screen](https://mobbin.com/screens/ba6ce0da-0545-485c-8138-fbe1f51bd414).
- Plan compare: "NO THANKS" top-right · "Pick a plan. You can cancel anytime." · red hand-drawn arrow "Save up to 70% on annual plan" · "Your first charge of S$ 43.98 will be on 9/14/2026, then every month. Cancel anytime." (**real charge date**) [screen](https://mobbin.com/screens/ce0e5f24-2e8d-431e-8143-8eb94c3ac95d).
- Tutor annual "$138.98", struck "$527.76" (12× monthly as the anchor), "Restore purchase" [screen](https://mobbin.com/screens/68994ef2-7fe3-4c72-a608-b9eb6c964fdd).
- "87% of students report better grades with Brainly+" · "Join … and millions of other users" · "MAYBE LATER" [screen](https://mobbin.com/screens/b94d9e77-9c05-4d61-baf1-5a5e03392f6f).
- Mascot "READY? LET'S GO · Start creating your first practice round." [screen](https://mobbin.com/screens/ad250cf9-f524-4ca5-be8b-cc9e7750d183).

---

### 1.4 Duolingo (Duo the owl: the reference for "mascot as host")

**House style.** White background, feather green #58CC02 **3D buttons** (a darker green bottom lip about 4pt, pressed state drops it), ALL-CAPS bold rounded labels (DIN Round / Feather Bold), option cards with a 2px grey border and bottom lip. Selected = light-blue fill, blue border, blue text. **Thick green rounded progress bar with a lighter highlight stripe.** Duo is small (about 90pt) at top-left, holding a clipboard and pencil, with the speech bubble to his right (2px grey border, tail pointing at him). On "beat" screens Duo moves to the centre with the bubble above.

#### Onboarding (20 screens) · [flow](https://mobbin.com/flows/b0b4f93f-5637-46ec-9d77-49ecda6b991d)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Splash | Green full-bleed | "duolingo" | Face only (eyes + beak) | – | auto | – | [duo-1](https://mobbin.com/screens/812f8244-ea93-446c-983d-0d71967318a8) |
| 2 | Welcome | Duo, wordmark, 2 buttons | "Learn for free. Forever." · "GET STARTED" / "I ALREADY HAVE AN ACCOUNT" | Standing, neutral | – | 2 buttons | **No account needed to start** | [duo-2](https://mobbin.com/screens/fb4eda98-538d-4bc0-9ef6-bf06ed401c12) |
| 3 | Hello beat | Duo centred, bubble above | "Hi there! I'm Duo!" | Waving wing, mouth open *(implied wave loop)* | – | CONTINUE | No progress bar yet | [duo-3](https://mobbin.com/screens/a824931a-588b-4f12-9073-2bddae0816ca) |
| 4 | **Sets length** | same | "Just **7 quick questions** before we start your first lesson!" | Sparkle eyes, excited | – | CONTINUE | **Tells you how long it is** | [duo-4](https://mobbin.com/screens/74201708-1b1b-4b6d-b804-92f9eb2d65c9) |
| 5–6 | Language | Bar starts as a dot; Duo top-left + bubble; flag list | "What would you like to learn?" · "For English speakers" | Clipboard pose | single | CONTINUE (grey until pick) | – | [duo-5](https://mobbin.com/screens/64a19efc-ba60-44ee-afd2-f8a7e4a59044) [duo-6](https://mobbin.com/screens/6f28eb68-b3c3-43d1-a4be-fb5f43b8f930) |
| 7 | Building beat | Duo reading on books, no bar | "COURSE BUILDING..." · "Get ready to join the **7 million people** currently learning French with Duolingo!" | Reading a book on a pile of books | – | auto | Social proof tied to *your* pick | [duo-7](https://mobbin.com/screens/995a96a7-b9e7-4d1e-bea9-cbd7a5293790) |
| 8 | Level | 5 cards w/ signal bars | "How much French do you know?" · "I'm new to French" … "I can discuss most topics in detail" | top-left | single | CONTINUE | – | [duo-8](https://mobbin.com/screens/ed5fd27f-19fb-48a9-ae0f-4481e5b7671a) |
| 9 | Why | 7 multi cards, emoji + checkbox | "Why are you learning French?" · "Just for fun" / "Boost my career" / "Spend time productively" / "Connect with people" / "Prepare for travel" / "Support my education" / "Other" | top-left | multi | CONTINUE | – | [duo-9](https://mobbin.com/screens/e8ec9068-fe70-4882-b463-a1a6f8abd9ff) |
| 10 | **Reacts** | same, 3 ticked | Bubble changes to "Let's prepare you for conversations!" | same | – | CONTINUE | **Bubble answers your choice** | [duo-10](https://mobbin.com/screens/1a2c3854-ea7a-41fa-ab1b-95466c2c0228) |
| 11 | Chapter beat | Duo + bubble, empty body | "Let's set up a learning routine!" | same | – | CONTINUE | An empty screen as a breather | [duo-11](https://mobbin.com/screens/88ba156b-e484-4d98-b17b-7123a1d7c6cb) |
| 12 | Goal | 4 rows w/ tags | "What's your daily learning goal?" · "5 min / day Casual" · "10 min / day Regular" · "15 … Serious" · "20 … Intense" | same | single | "**I'M COMMITTED**" | CTA wording = commitment | [duo-12](https://mobbin.com/screens/14f1b986-098a-47da-9172-1f3567c17b5c) |
| 13 | **Payoff** | Bubble only | "That's **50 words** in your first week!" | same | – | CONTINUE | Computed from your pick; number in purple | [duo-13](https://mobbin.com/screens/cf740740-e217-4a08-bb8b-4000e986ce07) |
| 14 | **Notification primer** | Bubble + replica of system alert + blue ↑ arrow | "I'll remind you to practice so it becomes a habit!" · "REMIND ME TO PRACTICE" | same | permission | the button | Arrow points at "Allow" | [duo-14](https://mobbin.com/screens/817844ed-f7df-4645-b18b-a9803879821f) |
| 15 | Widget | Phone mock | "I'll cheer you on from your home screen!" · "ADD WIDGET" / "NOT NOW" | Duo inside a purple widget with 🔥1 | – | NOT NOW | – | [duo-15](https://mobbin.com/screens/02616458-9551-4f91-bd89-5c9e16046dc8) |
| 16 | Outcomes | 3 rows w/ icons | "Here's what you can achieve in 3 months!" · "Converse with confidence" · "Build up your vocabulary" · "Develop a learning habit" | same | – | CONTINUE | – | [duo-16](https://mobbin.com/screens/0eed678c-da44-4e3a-ba32-c02660e92866) |
| 17 | **Free vs Super choice** | 2 cards | "How do you want to get started?" · "Super Duolingo · Faster progress, no ads" (RECOMMENDED) · "Learn for free · Core learning features, with ads" | same | single | CONTINUE (grey until pick) | **Free is a first-class option** | [duo-17](https://mobbin.com/screens/3a223593-d3c7-48fc-bb96-27d9f9e79fca) |
| 18 | **No guilt** | Free picked | "Awesome! You can upgrade anytime." | same | – | CONTINUE | Mascot approves the free choice | [duo-18](https://mobbin.com/screens/eade4735-8f46-4659-bc9e-2e93d306019e) |
| 19 | Start point | 2 cards | "Where would you like to start?" · "Start from scratch" / "Find my level" (RECOMMENDED) | same | single | CONTINUE | – | [duo-19](https://mobbin.com/screens/8888d91a-a97b-44e7-9c1e-08a75ced8b5c) |
| 20 | Send-off | Duo centred | "Since you know a few words, let's start at **Score 10**!" | Holding pencil | – | CONTINUE → lesson | Account comes *after* the lesson ("Don't lose your progress! Let's create a profile.", "CREATE PROFILE" / "LATER") | [duo-20](https://mobbin.com/screens/24aaae49-d6dd-479e-913d-55740b8b25fc) |

**Duolingo paywalls and trial reminders** (single screens):
- "Get started with a 7 day free trial on Super" · Family $9.99/mo (12 mo • $119.99) vs **MOST POPULAR** Individual $7.99/mo (12 mo • $95.99) · "Cancel anytime in the App Store" · "START MY FREE WEEK" · "VIEW ALL PLANS" · X. **Duo turns holographic** (teal→purple gradient) for Super [screen](https://mobbin.com/screens/53e21140-a6d1-43c8-a3d4-1908646142e2).
- **"When should we remind you before your trial ends?"** "2 days before · Dec 17" / "3 days before · Dec 16". "Easy to cancel, no penalties or fees". The CTA stays grey until you pick. Black Max-Duo rings a hand bell [screen](https://mobbin.com/screens/03c0d236-bd56-42b0-8ce1-95a1f6bc478e). After the pick the headline becomes "We'll remind you **2 days** before your trial ends" [screen](https://mobbin.com/screens/66959fc7-7c36-4713-a034-531e04c1e510).
- "Skip ads with a 7 day free trial of Super!" · "🔔 We'll remind you before your trial ends" · "TRY FOR $0.00" / "NO THANKS" [screen](https://mobbin.com/screens/97e9b0dc-f653-4422-96e8-53650ff9accd).
- Perks scroll ending "Cancel anytime, no penalties or fees" [screen](https://mobbin.com/screens/bb7d6e68-6ec5-4bbf-abbc-b59e1389c10b). FREE vs SUPER checklist [screen](https://mobbin.com/screens/61cfcfcd-0502-429d-a32b-5e3f6be2afbd).
- Manage Subscription: "We'll send you a notification **3 days** before your trial ends!" · "Next billing date on December 16, 2025" [screen](https://mobbin.com/screens/e937c8a3-ccda-4319-a684-5107b0689fe8).
- Cancel sheet: sad holographic Duo, "If you cancel, you'll start seeing ads again" · "KEEP SUPER" / "CANCEL SUPER" (red). It states a fact, but the sad mascot is mild guilt [screen](https://mobbin.com/screens/656742c0-7f62-4a7f-a5a9-05e54747e036).
- Streak goal: "I bet 7 days will be easy peasy! Right?" · "I CAN DO IT" [screen](https://mobbin.com/screens/9cd76ce4-3e66-47ed-99cc-93aa95605cc9).

---

### 1.5 Cleo (no drawn character: the personality is the copy)

**House style.** Electric indigo #3A1EFF, mint #65F5B0, lilac. Heavy condensed ALL-CAPS display. Glossy airbrushed 3D *objects* instead of a character (winged money bag, dollar-bill heart, party poppers with coins, an eyeball wrapped like a sweet, donuts, a padlocked piggy bank). **The logo is a speech bubble with typing dots.** Every "Next" has a 👉. Chat bubbles carry the voice, even on non-chat screens.

#### Onboarding (20 screens) · [flow](https://mobbin.com/flows/480b563d-86bb-44b8-a771-448c209e8408)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Splash | Indigo, logo bubble with "…" | "CLEO" | (voice) | – | auto | Typing dots = "she's about to talk" | [cleo-1](https://mobbin.com/screens/2c855964-6ba9-4609-9d5c-9553811ed914) |
| 2–5 | Value carousel | Logo, headline, 3D object, arrows + dots | "UP TO $500 IN CASH ADVANCES · When you need a little extra" · "LEARN TO SPEND BETTER · With spending limits and budget tips" · "STRESS LESS ABOUT YOUR SCORE · Apply for the Credit Builder Card" · "SIMPLIFY YOUR SAVINGS · With automatic transfers to a savings wallet" · "Sign up" / "I already have an account" | – | – | Sign up, sign in | One object per benefit | [cleo-2](https://mobbin.com/screens/3a69e5c5-90f7-4887-aab7-13dfc20a61de) [cleo-3](https://mobbin.com/screens/2450641d-dcb2-47c2-a1aa-43576c9a4c4b) [cleo-4](https://mobbin.com/screens/694e0538-84d4-4e2c-b7d6-93ff87d16582) [cleo-5](https://mobbin.com/screens/5d629e84-3e47-469b-aed6-c2ecb9d24f4a) |
| 6–7 | Name | 5-segment bar, fields | "NAME" · "Add your full legal details" · "ⓘ Your data explained" · "Next 👉" | – | text | back, X | **"Your data explained" on every form step** | [cleo-6](https://mobbin.com/screens/202f0e14-4c19-41a5-aca7-9960c8984c61) [cleo-7](https://mobbin.com/screens/a541c0e0-d6ae-4941-936f-dcd0cca21de9) |
| 8–9 | Email | field | "EMAIL" · "Enter the email where you'd like to receive the code" | – | text | Next 👉 | – | [cleo-8](https://mobbin.com/screens/70d15057-999c-4c37-b380-eb37d59339a0) [cleo-9](https://mobbin.com/screens/aa99c50f-9ae1-4583-bd4e-dc43200eddc6) |
| 10–11 | DOB | wheel | "DATE OF BIRTH" · "You must be 18 or over to use Cleo" | – | wheel | Next 👉 | – | [cleo-10](https://mobbin.com/screens/7696f80b-9945-4b08-ba56-a58eb5a81715) [cleo-11](https://mobbin.com/screens/65e04f4d-e2f1-49a3-bbbc-b7fe4b9df6f2) |
| 12–13 | State | dropdown | "WHICH STATE DO YOU LIVE IN?" · "Banking regulations may vary by location" | – | single | Next 👉 | Says *why* it asks | [cleo-12](https://mobbin.com/screens/60d6735b-27f4-4e28-ae94-dbdae33f201c) [cleo-13](https://mobbin.com/screens/672f7b23-3a32-4d9f-a888-4c17bf31559f) |
| 14–15 | Attribution | dropdown | "WHERE DID YOU HEAR ABOUT CLEO?" | – | single | Next 👉 | – | [cleo-14](https://mobbin.com/screens/3e079079-b5b4-4dbc-b440-61aec2e7557c) [cleo-15](https://mobbin.com/screens/0bcf1c36-51da-4764-96f1-0453dcb2f974) |
| 16 | Verify | code dots | "VERIFY YOUR EMAIL" · "Didn't get the email? Check your spam and promotions, or resend" · "Open my email" | – | code | Resend | – | [cleo-16](https://mobbin.com/screens/6b7a9b06-7b6f-4eca-860f-bfecbdd104da) |
| 17 | **Tiny win** | Mint, poppers, huge type | "THAT TOTALLY WORKED" · "Next 👉" | Party poppers with coins | – | Next | **Celebrates an email code** | [cleo-17](https://mobbin.com/screens/9cd27255-d309-406e-b8b4-a6f0073497a6) |
| 18 | **Honest limit** | Eyeball-sweet, chat bubbles | "JUST A HEADS UP" · "Due to your state's laws, cash advances and certain subscriptions such as Plus or Builder aren't available" · "But insights, budget and savings tools are good to go" · "Explore the app" | (voice) | – | Explore | **Bad news in the brand voice** | [cleo-18](https://mobbin.com/screens/b9602601-df77-4341-840c-bf1f7ec46d83) |
| 19 | **Notification primer** | Navy, sample notification, bullets | "NEVER MISS A DOLLAR" · notif: "🥊 You smashed yet another target · Stick to $50 today to stay on track" · "Tailored coaching on your spending" · "Watch Cleo grow your savings" · "Reminders that you're only human 💙" · "Turn on notifications" / "Not now" | (voice) | permission | **Not now** | Shows a real notification in the voice | [cleo-19](https://mobbin.com/screens/13f36736-b672-43d7-8807-56608dab301d) |
| 20 | Bank link | Bubbles + Plaid line | "LINK YOUR ACCOUNT" · "Plaid connects Cleo securely and you're in good company with millions of users" · "Cleo can't move your money, she's just an AI with bad attitude" · "She also never stores your bank login details, bit creepy if she did" · "Connect me ⚡" / "I need more info on security" | (voice) | permission | more info | **Trust copy that's funny and true** | [cleo-20](https://mobbin.com/screens/05cdb7d6-2cd1-4b85-89a4-3ec303759d6e) |

#### Setting up Cleo (chat onboarding, 14 screens) · [flow](https://mobbin.com/flows/78850b24-4ac4-4c5a-ae91-89014abd6d4d)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Hype | Mint, poppers | "[Name], ARE YOU READY?" · toast "Connected! Updating your bank details now..." · "Unleash Cleo 👀" | – | – | CTA | Uses first name | [cs-1](https://mobbin.com/screens/b7a3670a-577e-475d-8146-b33ea611f314) |
| 2 | Typing | Empty chat, "CLEO CHAT" watermark, "…" | – | typing dots | – | – | Anticipation | [cs-2](https://mobbin.com/screens/16d3880b-76a5-4af1-89a8-6b5b87680270) |
| 3 | Greeting + chips | Chat bubbles, GIF, chips | "Trisha! I've been expecting you here 👋" · "You've just walked into the best decision of your fabulous life" · GIF clapping · "Knew you could do it ✨" · "So, where do we start?" · chips "control my spending ✂️" / "get a cash advance ⏰" / "improve my credit score 🚀" / "I don't know 🦄" / "see where my money goes 👀" | – | chip | – | **Answers are chips with emoji** | [cs-3](https://mobbin.com/screens/0ded316e-868a-49c8-9a7e-8f372e868ddb) |
| 4 | Sets length | chat | "But first, I'm gonna ask you about your money habits" · "Be honest in the next 5 qs, Trisha. The more I know, the better I can help you" · "let's go 💃" | – | – | chip | Count + reason | [cs-4](https://mobbin.com/screens/2c28f1dd-5d34-4aa8-ae74-3ebe71f7cc4f) |
| 5 | Question | GIF + chips | "Think back over the last 6 months" · "How much of your income did you usually spend?" · "(This is any money that comes in…)" · "not much ☀️" / "most of it 🌤" / "about the same ⛅" / "all of it, and then some 🌧" / "all of it, and then a lot more 🌨" | – | chip | – | **Weather emoji as a scale** | [cs-5](https://mobbin.com/screens/44af2edb-67d5-42ab-b73e-83bb8793d1b8) |
| 6 | Question | chat | "What are you like with bills?" · "I'm on top of them 🦸" / "they're on top of me 🦀" | – | chip | – | Funny both ways | [cs-6](https://mobbin.com/screens/e89de099-ea6c-4658-a33e-58c727c49e23) |
| 7 | Close quiz | GIF | "K, final thing. Fill in the blank" · "This was less painful than..." · "getting my wisdom teeth out ✂️" · "Cheers Trisha. That's it for the quiz" · "Cause now I've got enough ammo" · "To set your worst habits on fire" · "roast me Cleo 🔥" | – | chip | – | Jokes reward finishing | [cs-7](https://mobbin.com/screens/895252e2-0b5e-4a2e-9e6b-96b72611dfa7) |
| 8 | Explain | chat | "Your overview's ready" · "Basically, I lay it all out for you 👉 We see what's coming in and out 👉 I give you a daily spending limit 👉 You check your damn phone to stay on track" · "I can do this 🌶" · "Trisha. Let's fucking do this thing 👇" · "My overview 👀" | – | – | link | Swearing (US, opt-in brand) | [cs-8](https://mobbin.com/screens/b68fa6c6-97ed-4413-bb09-50e115af92a0) |
| 9–10 | Done | Lilac, salt shaker object | "YOU'RE ALL SET" · "A spend limit a day keeps the overdraft away" · "Think of it as a harness..." · "There to protect you from financial chaos" · "See updated budget 👀" | – | – | CTA | – | [cs-9](https://mobbin.com/screens/034cd0f2-2f36-47f7-a058-cec7e6e52438) [cs-10](https://mobbin.com/screens/5859feb3-7aec-4f47-b7de-c339de9ed360) |
| 11 | Bills intro | Indigo, coins | "TRACK YOUR BILLS" · "Bills suck, but I can make them suck less" · "Confirm your bills here so I can track 'em for you 👇" · "Verify bills ⚡" | – | – | X | – | [cs-11](https://mobbin.com/screens/128e50f9-a737-42f1-8556-30d46b498eef) |
| 12 | Detected bills | list | "ARE THESE YOUR BILLS?" · "Bills are any recurring or fixed payments. Tap to edit or swipe to remove" · "Online Banking Transfer · Weekly · Due on February 5 · $130.00" | – | edit | Next | **Needs a bank link. Ditch can't do or claim this.** | [cs-12](https://mobbin.com/screens/e571046b-44c2-41d4-a6c0-129cd8443270) |
| 13 | Celebrate | Donuts, huge type | "LIKE A BOSS." · "Nice job 👌" · "You've fully customised your budget." · "Take a look 👀" | – | – | CTA | – | [cs-13](https://mobbin.com/screens/6a6947c6-6341-4b65-97bb-32146b4880a9) |
| 14 | Budget | Coin stacks | "FEBRUARY'S BREAKDOWN" · "In $326 / Out $188" · "$115.90 per day" · "Been 2 weeks of budgets. Thoughts?" | – | – | tabs | Data screen has no character | [cs-14](https://mobbin.com/screens/a252fcfd-1c89-43d2-a090-7c70d5af3c5c) |

**Cleo plans** (single screens): "Hey angel face, I'm Cleo 👋 · Here to help you sort your sh*t out" [screen](https://mobbin.com/screens/bdc43981-96ae-4757-ae10-0cffa0892bd0). "CHOOSE YOUR FIGHTER · Here's a 'lil overview" [screen](https://mobbin.com/screens/2711bef3-fac7-4ddf-8801-1b103a857f9e). "TAKE A CLOSER LOOK · Compare the plans in checklist form ('cause all brains work in different ways)" [screen](https://mobbin.com/screens/1de22016-ef20-4487-a77c-8be08e100dba). "GOT QUESTIONS?" FAQ under the CTA [screen](https://mobbin.com/screens/41dd7f27-8fc9-4332-b08f-ae5717004ae6).

---

### 1.6 Speak (3D blue tutor blob)

**House style.** Royal blue #1F4BFF, white/very light grey, a clean sans, pill buttons. **Mascot "Speak Tutor":** a glossy 3D blue ghost/blob with a white visor face and two dark oval eyes, tiny arms, no mouth. It sits in a 56pt circle avatar at top-left with a white bubble, the same as Duo.

#### Onboarding (24 screens) · [flow](https://mobbin.com/flows/60e05ece-3567-4ad8-9dbe-577de850a017)

| # | Purpose | Layout | Exact wording | Mascot | Ask | Exits | Notable UI | Link |
|---|---|---|---|---|---|---|---|---|
| 1–2 | Splash | Blue, spinner | "Speak" | – | – | auto | – | [sp-1](https://mobbin.com/screens/fd36438a-30e7-481f-80cd-6acb03a26a52) [sp-2](https://mobbin.com/screens/c9a22516-5060-4b61-8aae-4e5645eb95b2) |
| 3 | Claim 1/3 | Logo, 3 dashes, gradient blob | "Adults can become fluent — even faster than kids." · "Tap to continue" | – | tap | Sign in | Tap anywhere | [sp-3](https://mobbin.com/screens/835b7c66-b3c0-43a1-aa60-5d2811edd9a5) |
| 4 | Claim 3/3 | same | "Speak turns science into real speaking practice from Day 1." · "Start speaking today" | – | – | CTA | – | [sp-4](https://mobbin.com/screens/0915565a-a7d2-4133-a009-7febc0844d2c) |
| 5–6 | Language | Avatar + bubble, list | "What language do you want to learn?" | avatar | single | Continue | – | [sp-5](https://mobbin.com/screens/7f0cd367-2e06-40fd-9573-aea98e08bed1) [sp-6](https://mobbin.com/screens/b756f497-58d5-4508-8702-c1b018dcb6d0) |
| 7 | Account | SSO stack | "Let's sign you up to continue" | – | sign up | Log in | Early account | [sp-7](https://mobbin.com/screens/3b88f3b6-0b11-48f1-85bf-ab1aebe3bf2e) |
| 8–9 | Email | fields w/ ticks | "Sign up with email" | – | text | Sign up | Green tick per field | [sp-8](https://mobbin.com/screens/af026ca4-b2d6-4937-a204-2610de6b45f8) [sp-9](https://mobbin.com/screens/df529627-68a9-46d8-98cb-667288ab90c5) |
| 10 | Mascot intro | Full-body mascot centred, bubble above | "Hey there! I'm Speak Tutor. I have a few quick questions to design the best curriculum for you." · "Start" | Floating, waving, shadow below *(implied bob)* | – | Start | – | [sp-10](https://mobbin.com/screens/2ff2142a-53ef-4e63-acf0-24a0b8f137f1) |
| 11–13 | Attribution | X + thin bar; long list | "How did you hear about Speak?" · "Select all that apply" | avatar | multi | X | – | [sp-11](https://mobbin.com/screens/483ff410-b002-4d98-a9f2-26132b2d2ce4) [sp-12](https://mobbin.com/screens/9a27408e-5e05-4040-a9f7-e20d2ff0107d) [sp-13](https://mobbin.com/screens/e7cdc784-b17e-423f-b652-f58d3c4a8d70) |
| 14 | **Voice answer** | Bottom sheet, big mic | "What's motivating you to learn French?" · "I can't speak now" | avatar | **speak** | keyboard fallback | **Answer by talking = the product** | [sp-14](https://mobbin.com/screens/bfb35bd0-7f78-4007-900e-ad108f89fb9c) |
| 15 | Recording | Waveform | "Speak now..." · ✕ / ↑ | avatar | – | cancel | Live waveform | [sp-15](https://mobbin.com/screens/b54b1ed9-3256-48cf-a652-e0a40442efb9) |
| 16 | **Reflects answer** | Bubble + chart | "Thank you! In two months, you'll be able to communicate while traveling in France." · "Reach your goals faster with Speak!" | avatar | – | Continue | Echoes what you said | [sp-16](https://mobbin.com/screens/b87fa9ce-6c41-4fa5-9086-9bc6f263a880) |
| 17 | Course card | Card with mascot holding phone | "Thank you! We have the perfect course for you!" · "Upper Elementary Part 1 … 47 lessons" | Big, holding a phone | – | Continue | – | [sp-17](https://mobbin.com/screens/facb1ee8-3297-4f8f-9cfb-397f7a0f6d29) |
| 18 | Reviews | Cards | "Our users agree - here's how Speak helped." · "Maria C., Speak user for 193 days" | avatar | – | Continue | Named, dated reviews | [sp-18](https://mobbin.com/screens/2c3b736e-75ac-4039-a92c-abacc5ef4383) |
| 19 | Ready | Bar full | "We've got everything we need to build your perfect language curriculum. Let's get started!" · "Generate your curriculum" | avatar | – | CTA | User triggers the build | [sp-19](https://mobbin.com/screens/03f2142a-2e6f-4413-a245-cbb49e94432e) |
| 20 | Loader | Mascot centred + bubble | "Generating your curriculum..." | Floating *(implied bob)* | – | wait | Mascot *is* the loader | [sp-20](https://mobbin.com/screens/9366c893-4599-44a9-95eb-bf352bd740f3) |
| 21 | Reflection | Swipe cards | "Here's what we learned about you." · "You haven't studied French before · We'll start you off with the basics…" | – | – | Get started | Mirrors answers | [sp-21](https://mobbin.com/screens/69fe36fa-992f-4a20-bfeb-75c157fd9c97) |
| 22 | Paywall | Photo collage, X top-left | "Speak 1,000 phrases in your first week" · "Start my free week" · "Build your speaking confidence" demo "Enchanté !" | – | buy | X | Demo of the real feature | [sp-22](https://mobbin.com/screens/d5bc2c4a-81af-4ff9-8877-6921982d9fe9) |
| 23–24 | Home | Unit path | "Welcome!" mascot node · "J'apprends le français pour voyager." · "Get Full Access · Get Premium" | small, in nodes | – | tabs | Upsell card inline in path | [sp-23](https://mobbin.com/screens/7bc75c5a-a256-4994-8b27-6dbcfad90411) [sp-24](https://mobbin.com/screens/2642be4f-23ca-4940-a04f-80f42d87c3b8) |

---

### 1.7 Short looks (single screens)

| App | Screen | What it shows | Link |
|---|---|---|---|
| Noom | Proof chart | "Noom creates long-term results through habit and behavior change, not restrictive dieting" · **cited**: "Scientific Reports - 78% of participants using Noom lost weight over a 6 month study" · "Got it!" | [screen](https://mobbin.com/screens/f1b987b2-5724-4e00-9280-1a44525bda32) |
| Noom | Plan + price | "VIEW PERSONALIZED PLAN" curve to "GOAL 57 KG", event marker "VACATION (57 KG)" · "Lose 8 kg for the vacation on 16 October 2026" · "PRICE TODAY · Free 7-day trial · You'll have 1 week to see how Noom…" | [screen](https://mobbin.com/screens/e863b1da-a3eb-4319-aae0-efa5e3c0eff6) |
| Noom | AI helper | "Insights from Welli BETA · Would you like an insight on your meal?" · "Sure, I'm open to an insight." (small green blob, opt-in) | [screen](https://mobbin.com/screens/f3bcb945-0cdb-40df-997e-cab6ea1c39db) |
| Quizlet | Paywall | "7 days of limitless learning" · "We'll remind you 2 days before your trial ends." · "Start free trial" / "Skip for now" (no price on the face) | [screen](https://mobbin.com/screens/fbe78bd9-408d-44b0-83ae-d895973259eb) |
| Flo | Mascot intro | Lime battery "Flori" with pink feather: "You're in the right place! I'm Flori, your very own Well-Being Battery!" The mascot *is* a metaphor for a state | [screen](https://mobbin.com/screens/44405cd8-e7cb-4640-9778-969032ac7ac6) |
| Brilliant | Mascot intro | Green squircle "Koji", one square eye: "Hi, I'm Koji! I'll be your personal tutor." Very minimal | [screen](https://mobbin.com/screens/b54bafbc-2547-4959-91e5-a3aacf0c3f43) |
| Reddit | Honest loader | "Hold on as we build your feed based on your interests" with *your* picked topics ticking off one by one | [screen](https://mobbin.com/screens/7b5cc2e3-e4e0-4ced-bf54-7443abcef6ba) |

---

## 2. Patterns

### 2.1 What makes these feel high-energy and fun
1. **The mascot hosts and the UI does the work.** On question screens the mascot is small (40–90pt) at top-left with a bubble: Duo ([duo-8](https://mobbin.com/screens/ed5fd27f-19fb-48a9-ae0f-4481e5b7671a)), Speak ([sp-5](https://mobbin.com/screens/7f0cd367-2e06-40fd-9573-aea98e08bed1)), BitePal ([bpG-2](https://mobbin.com/screens/57a66015-4bb5-47b5-87d4-8fd69534f758)). It only goes big on "beat" screens (hello, reveal, chapter break, result).
2. **The bubble answers you.** Duo's bubble changes after you pick reasons ("Let's prepare you for conversations!", [duo-10](https://mobbin.com/screens/1a2c3854-ea7a-41fa-ab1b-95466c2c0228)). BitePal previews the voice you chose ([bpA-15](https://mobbin.com/screens/2079a9b1-d935-48ba-a533-058e77de08a0)). Speak repeats your spoken goal back ([sp-16](https://mobbin.com/screens/b87fa9ce-6c41-4fa5-9086-9bc6f263a880)). It feels like talking, not filling a form.
3. **A number pays off each choice.** "That's **50 words** in your first week!" ([duo-13](https://mobbin.com/screens/cf740740-e217-4a08-bb8b-4000e986ce07)). "Reach your goal by 27 December" updates while you drag ([bpG-13](https://mobbin.com/screens/52067204-a95e-43b0-b8c9-011c736417bb)). Cal AI draws rollover calories as two rings ([cal-24](https://mobbin.com/screens/084ba014-f77c-4c59-ba9a-2acc8f4a5224)).
4. **Huge type and loud colour on beat screens.** BitePal and Cleo use heavy condensed display faces at 40–60pt. BitePal changes the background colour per chapter: mint, periwinkle, pink, peach.
5. **Tiny wins get a celebration.** Cleo throws confetti for an email code, "THAT TOTALLY WORKED" ([cleo-17](https://mobbin.com/screens/9cd27255-d309-406e-b8b4-a6f0073497a6)), and for a budget, "LIKE A BOSS." ([cs-13](https://mobbin.com/screens/6a6947c6-6341-4b65-97bb-32146b4880a9)).
6. **Funny option labels.** "I quickly lose my breath climbing stairs" ([bpG-4](https://mobbin.com/screens/350443c0-dfb4-41f5-afc1-ea8253f8e087)). "they're on top of me 🦀" ([cs-6](https://mobbin.com/screens/e89de099-ea6c-4658-a33e-58c727c49e23)). "This was less painful than… getting my wisdom teeth out" ([cs-7](https://mobbin.com/screens/895252e2-0b5e-4a2e-9e6b-96b72611dfa7)).
7. **A surprise moment.** BitePal's "Open to see who is there" bin ([bpA-10](https://mobbin.com/screens/167bab5d-99d8-4407-96a7-d065e5586685) → [bpA-11](https://mobbin.com/screens/1e19816e-88c6-419e-9258-b336cfe58722)). Brainly's orb unfurling into the mascot ([br-4](https://mobbin.com/screens/0e56f94f-0f0c-495d-986e-4784e5f3144d) → [br-5](https://mobbin.com/screens/aea64cc3-9d39-4d32-998b-9f96ebdee895)).

### 2.2 How 15–34 screens avoid feeling long
- **Say how long up front.** Duo: "Just 7 quick questions before we start your first lesson!" ([duo-4](https://mobbin.com/screens/74201708-1b1b-4b6d-b804-92f9eb2d65c9)). Cleo: "Be honest in the next 5 qs" ([cs-4](https://mobbin.com/screens/2c28f1dd-5d34-4aa8-ae74-3ebe71f7cc4f)).
- **One decision per screen.** The CTA stays hidden or grey until you answer (Duo, Cal AI, BitePal). Some single picks auto-advance.
- **Chapter cards every 3–6 screens.** "Let's set up a learning routine!" ([duo-11](https://mobbin.com/screens/88ba156b-e484-4d98-b17b-7123a1d7c6cb)). "Now let's talk about your eating habits" ([bpA-19](https://mobbin.com/screens/ec8613f3-504c-4f56-8b67-49941c26e3d0)). "Got it! We'll help you to reach your goals" ([bpG-1](https://mobbin.com/screens/8277cb35-898e-41fc-9385-63507eebae8a)).
- **Mix the input types.** Cards, wheels, a ruler ([cal-14](https://mobbin.com/screens/d6318876-764c-4c68-aeb0-2be58f6eb0c1)), an animal pace slider ([cal-17](https://mobbin.com/screens/31013767-003c-4cc7-951a-6f081cbbce14)), voice ([sp-14](https://mobbin.com/screens/bfb35bd0-7f78-4007-900e-ad108f89fb9c)), weather-emoji chips ([cs-5](https://mobbin.com/screens/44af2edb-67d5-42ab-b73e-83bb8793d1b8)), a name field with a dice button ([bpA-12](https://mobbin.com/screens/5e120298-7e6f-473f-8a31-09c1ba88de06)).
- **Live feedback under inputs.** BMI and "Realistic" cards change as you scroll ([bpG-8](https://mobbin.com/screens/c54810d2-f9e5-49dc-807e-21184c10a239), [bpG-12](https://mobbin.com/screens/e382855b-2c2e-4853-86ab-ea99e06d9f8b)).
- **A progress bar that moves a lot early.** Duo's bar starts as a dot and jumps in big steps.
- **Cal AI's founder says the length is deliberate.** He says extra questions *raised* conversion "because the user invests more time" (Founderpath, §7). That is a sunk-cost effect. Ditch should only ask questions whose answers it actually uses.

### 2.3 Interaction tricks worth copying (honestly)
| Trick | Seen in | Why it works | Ditch use |
|---|---|---|---|
| Bubble reacts to the answer | Duo [duo-10](https://mobbin.com/screens/1a2c3854-ea7a-41fa-ab1b-95466c2c0228), BitePal [bpA-15](https://mobbin.com/screens/2079a9b1-d935-48ba-a533-058e77de08a0) | Feels heard | Tick screen: bubble changes as the total grows |
| Live-computed payoff | Duo [duo-13](https://mobbin.com/screens/cf740740-e217-4a08-bb8b-4000e986ce07), BitePal [bpG-13](https://mobbin.com/screens/52067204-a95e-43b0-b8c9-011c736417bb) | Turns input into value | Reveal count-up; "saves $X" if they mark ones to ditch |
| CTA label follows state | BitePal [bpA-5](https://mobbin.com/screens/07351d14-0b6b-47cd-9ac9-e28055317646)→[bpA-6](https://mobbin.com/screens/f30afab0-57b3-42b3-bafe-d2f69dffda71), Duo "I'M COMMITTED" | Says what happens next | "Skip" → "Continue" (already built) |
| Quick-reply chips with emoji | Cleo [cs-3](https://mobbin.com/screens/0ded316e-868a-49c8-9a7e-8f372e868ddb) | Fast, playful | Optional "Any you barely use?" step |
| Reflection screen ("here's what we learned") | Speak [sp-21](https://mobbin.com/screens/69fe36fa-992f-4a20-bfeb-75c157fd9c97), Cal AI [cal-31](https://mobbin.com/screens/7294b9e4-76ae-4d49-af18-bfb3d8a2566a) | Proves the answers mattered | Final "You're set" summary |
| Editable result | Cal AI [cal-31](https://mobbin.com/screens/7294b9e4-76ae-4d49-af18-bfb3d8a2566a) (a pencil on every number) | Honest; the user stays in control | Summary rows tap through to edit |
| User picks the trial reminder | Duo [screen](https://mobbin.com/screens/03c0d236-bd56-42b0-8ce1-95a1f6bc478e) | Trust plus real dates | Already shown as a line; could become a choice |

### 2.4 Paywall timing and wording
- **Timing.** BitePal, Cal AI and Speak put the paywall right after the "plan is ready" moment. Cal AI: 87% of new users see it (Superwall, §7). Duolingo makes Free vs Super a **choice inside onboarding** and answers a free pick with "Awesome! You can upgrade anytime." ([duo-17](https://mobbin.com/screens/3a223593-d3c7-48fc-bb96-27d9f9e79fca), [duo-18](https://mobbin.com/screens/eade4735-8f46-4659-bc9e-2e93d306019e)). Brainly also shows a paywall **when you hit the limit**: "You've used 10 of 10 free questions" ([screen](https://mobbin.com/screens/ba6ce0da-0545-485c-8138-fbe1f51bd414)).
- **Wording that respects the user:** "Your first charge of S$ 43.98 will be on 9/14/2026" (Brainly). "We'll remind you 2 days before your trial ends" (Duo, Quizlet). "Easy to cancel, no penalties or fees" (Duo). "Awesome! You can upgrade anytime." (Duo).
- **Wording that pressures:** "Limited time -60% offer · Offer expire in: 59:51" and "Are you sure to skip -60% offer?" (BitePal [bpS-10](https://mobbin.com/screens/6a2d89ef-cd39-44c1-87d8-19f7a2b8631d), [bpS-11](https://mobbin.com/screens/84d38c37-2e24-4a25-8a92-df7c531fc571)). "Claim 50% off now" against an inflated $99.99 (BitePal). "No Payment Due Now" with the price in small text under the CTA (Cal AI [cal-33](https://mobbin.com/screens/6e269857-5e29-4c86-8d0a-8b0961d10c53)).

---

## 3. BitePal vs Ditch: how our raccoon and UI must differ

**Check of our current v2 mock (`design/onboarding-v2-a.jpg`, `-b.jpg`):** the raccoon there has **big round white eyes with dark pupils and catch-lights inside a dark mask**, a **dark outline**, a **front-facing symmetrical** pose, an open grin and a cream belly oval. Those are the three things that most define BitePal's raccoon. The round-4 flat sheet (`design/mascot/round4/flat-sheet.jpg`) is closer to our own spec (no outline, small eyes) but is still front-on. **Fix this before building motion.** Use the spec in `docs/design/MASCOT-RESEARCH.md` §4.

| Trait | BitePal (seen) | Ditch must be |
|---|---|---|
| Body colour | Lavender-grey, black ears, black-tipped tail | Teal "Lagoon" body, Night Pine mask, Oat accents. Never grey, black or lavender |
| Outline | Heavy black outline on every shape | **No outline.** Shapes defined by colour only |
| Eyes | Huge round white rings, big black pupils, white catch-light | Small light lozenges inset in the mask. No white sclera rings |
| Mouth | Open, two buck teeth, pink tongue | Closed line or small dark shape. **Never teeth or tongue** |
| Chest | White heart | Plain. No heart, no belly emblem |
| Pose | Front-facing, symmetrical, stubby limbs | ¾ view, weight on one leg, clear line of action |
| Proportion | Head ≈ 55–60%, bean body | One-piece squircle body, no neck (spec §4) |
| Role | Pet you feed, name and keep healthy (hearts, hunger, drool) | **A tidy helper who tosses cards into a bin.** Never a pet, never hungry, never eats trash |
| Bin | Raccoon *lives in* a trash bin with fish bones and apple cores | Raccoon stays *outside* a clean bin and flicks a subscription card in. No food waste |
| Naming | User names it ("Nomad", "Alex", "Caramel"), dice button | No user naming. One fixed name (not "Rocket"), or none |
| Costumes | Hats, bows, caps, chains, chef hat, room backgrounds bought with coins | No clothes or accessories in core art (spec). No store |
| Voice | Puns ("pawsome provider", "master of the noms"); 4 selectable personalities | Plain, short, dry-funny. No animal puns. Roast/tone modes stay v1.1 (DECISIONS #10) |
| Where it appears | Everywhere: home hero above data, loaders, paywall, exit offers, rating prompts, store | Only onboarding, the Ditched celebration, paywall, widget, empty states (CLAUDE.md rule 8). **Never above data, never on an action** |
| Emotional use | Panic face on "Are you sure to skip -60% offer?" | **Never used for guilt or pressure.** No sad or panicked raccoon near a purchase or decline |
| UI shell | Lavender bg, black pill CTA, condensed black display, emoji option cards, green select | Keep ours: white/pine, fat 3D teal buttons, Nunito rounded, service-logo cards, teal select. Avoid lavender, black pills and condensed display type |
| Game layer | Hearts, coins, streak savers, challenges | None. The money saved *is* the score |

---

## 4. Animation and feel (documented)

**What the stills show** *(implied by frame sequences)*:
- **BitePal reveal:** closed bin ([bpB-11](https://mobbin.com/screens/4f7dc39e-f519-490d-a32e-7297439e3e8e)), then the raccoon bursting up mid-air with a banana peel, fish bone and apple core flying ([bpB-12](https://mobbin.com/screens/fd8caa0a-40a4-4ff8-8d0c-39274f6d6f6d)). In Flow A the user taps "Open" first ([bpA-10](https://mobbin.com/screens/167bab5d-99d8-4407-96a7-d065e5586685)). The "realistic target" screen has a sunburst behind the raccoon ([bpG-14](https://mobbin.com/screens/245ab2df-35f9-4a3e-b886-50787b19704d)), likely rotating. Confetti falls on "plan ready" ([bpS-5](https://mobbin.com/screens/06dc81da-8575-4971-a790-73df7bc8b3cb)). The loader ticks a checklist while question bubbles pop out of the reading raccoon ([bpS-2](https://mobbin.com/screens/b9b346a7-8a54-4825-ab5f-f6d29ea5579d) → [bpS-3](https://mobbin.com/screens/6e23aa19-c964-4009-b436-7a5e5b5c9824)). The paywall raccoon surfs with motion lines ([bpS-8](https://mobbin.com/screens/de10057f-86df-48b6-bae9-8f3bc8eb854a)).
- **Brainly:** the mascot starts as a purple orb and unfurls into the three-eyed character ([br-4](https://mobbin.com/screens/0e56f94f-0f0c-495d-986e-4784e5f3144d) → [br-5](https://mobbin.com/screens/aea64cc3-9d39-4d32-998b-9f96ebdee895)).
- **Speak:** the mascot floats above a separate shadow ellipse, which means an idle bob ([sp-10](https://mobbin.com/screens/2ff2142a-53ef-4e63-acf0-24a0b8f137f1), [sp-20](https://mobbin.com/screens/9366c893-4599-44a9-95eb-bf352bd740f3)). There is a live waveform while you talk ([sp-15](https://mobbin.com/screens/b54b1ed9-3256-48cf-a652-e0a40442efb9)).
- **Duolingo:** a different Duo pose per beat (wave [duo-3](https://mobbin.com/screens/a824931a-588b-4f12-9073-2bddae0816ca), sparkle eyes [duo-4](https://mobbin.com/screens/74201708-1b1b-4b6d-b804-92f9eb2d65c9), reading [duo-7](https://mobbin.com/screens/995a96a7-b9e7-4d1e-bea9-cbd7a5293790)). The bell-ringing Duo has two frames, mid-swing and up ([screen](https://mobbin.com/screens/03c0d236-bd56-42b0-8ce1-95a1f6bc478e), [screen](https://mobbin.com/screens/66959fc7-7c36-4713-a034-531e04c1e510)). The 3D buttons have a pressed state. Duo turns holographic for Super.
- **Cleo:** typing dots in the logo and in the chat ([cleo-1](https://mobbin.com/screens/2c855964-6ba9-4609-9d5c-9553811ed914), [cs-2](https://mobbin.com/screens/16d3880b-76a5-4af1-89a8-6b5b87680270)), GIF reactions, party poppers.
- **Cal AI:** a % counter and a gradient bar ([cal-30](https://mobbin.com/screens/63944ee4-76ea-4bcd-8f0f-543e7240f4ff)), a draggable ruler ([cal-14](https://mobbin.com/screens/d6318876-764c-4c68-aeb0-2be58f6eb0c1)).

**From the web:**
- Duolingo's own blog explains that its World Characters get automatic lip-sync from visemes. Hand-animating 40+ languages across 100+ courses was not an option (§7). Third-party write-ups say Duolingo uses Rive state machines, driven by app state rather than fixed timelines. Duolingo bought the animation studio Gunner in 2022 (Cartoon Brew).
- Cleo's personality is written by paid comedy writers. "Roast mode" is **opt-in**, with "hype mode" as the counterpart (Sifted, Writer).

**Motion spec for Ditch** (Reanimated, already in the stack):
- Build the raccoon as 4–6 layered SVG/PNG parts (body, tail, eyes, arm, card) and animate transforms. No new dependency, works in Expo Go. Rive would need a native module and an EAS dev build (check before adding).
- Idle: blink every 3–5s and a tail sway of ±4° over 2s. Keep it subtle.
- Reveal: count the total from $0 to $X over about 1.2s (ease-out), with a light haptic tick every ~10% and a success haptic at the end. The raccoon's eyes widen at the end. Stagger the "Biggest ones" rows in at 60ms each.
- Flick (signature): arm wind-up 120ms, card arcs into the bin 350ms, bin lid bounce 150ms. Use on Welcome (once), the end celebration and the Ditched celebration.
- Screen transitions: slide from right (already set). The bubble pops in with a spring (scale 0.9 → 1, damping ~14) 100ms after the screen.
- Buttons: 3D lip press, translateY 4 → 0, plus a light haptic.
- **Reduce Motion:** no count-up (show the final number), no flick (static "card in bin" pose), fades only. The layout already does this.

---

## 5. What works and what doesn't

**Works (copy these):**
- Saying how long onboarding is (Duo, Cleo).
- Free as a respected choice: "Awesome! You can upgrade anytime." (Duo).
- Real charge and reminder dates on the paywall (Brainly, Duo).
- Letting the user pick when the trial reminder fires (Duo).
- "Your data explained" next to every personal-data field (Cleo).
- Funny trust copy that is also true: "Cleo can't move your money, she's just an AI with bad attitude" (Cleo).
- Bad news told plainly in the brand voice: "JUST A HEADS UP" (Cleo).
- Editable numbers on the result screen (Cal AI).
- An honest async note: "You can switch apps or turn off your phone. We'll notify you when the analysis is done." (Cal AI).
- A loader that lists *your real picks* (Reddit).
- Health primer with an honest decline button, "I'll add activities manually" (BitePal).
- A cited proof chart (Noom cites *Scientific Reports*).

**Doesn't work / manipulative (flag, never copy):**
| Tactic | Where | Why it's a problem |
|---|---|---|
| Fake countdown on an exit offer | BitePal [bpS-10](https://mobbin.com/screens/6a2d89ef-cd39-44c1-87d8-19f7a2b8631d) | Invented urgency. Breaks Ditch rule 4 |
| Strike-through anchors that aren't real prices ($99.99 → $49.98; $7.28 → $2.91; coin "was" prices) | BitePal | Fake discount. Breaks rule 4 |
| Discount that renews higher than the normal plan ($34.98, then $89.98/yr vs $49.98) | BitePal [bpS-10](https://mobbin.com/screens/6a2d89ef-cd39-44c1-87d8-19f7a2b8631d) | Bait |
| Confirmshaming with a panicking mascot ("Skip this offer forever") | BitePal [bpS-11](https://mobbin.com/screens/84d38c37-2e24-4a25-8a92-df7c531fc571) | Guilt; mascot used against the user |
| Weekly plan next to annual | BitePal paywall v2 | Breaks rule 4 (no weekly) |
| "Analyzing / calculating metabolism 69%" theatre loader | BitePal [bpS-2](https://mobbin.com/screens/b9b346a7-8a54-4825-ab5f-f6d29ea5579d), Cal AI [cal-30](https://mobbin.com/screens/63944ee4-76ea-4bcd-8f0f-543e7240f4ff) | The result is ready instantly. A fake wait borrows the "labor illusion" |
| Social-proof numbers that disagree (10M+, 2M+, 10k, 10,000+) | BitePal | At least some must be false |
| Unsourced stats (58% / 76%, "2x faster", "5x longer", 80%, 90%, "2X") | BitePal, Cal AI | No sources; the same claim even changes between variants |
| App Store rating ask before any use | BitePal [bpB-14](https://mobbin.com/screens/18829648-7e6f-4e5f-8fd0-4361487a0a10), Cal AI [cal-25](https://mobbin.com/screens/52b265a8-450d-4169-8247-24e70250d0c7) | The rating isn't about the app. Asked too early |
| Drawing the system alert inside the page with a 👆 at "Allow" | Cal AI [cal-26](https://mobbin.com/screens/66d99844-e915-4e28-b31f-53214b84d2d4) | Imitates iOS UI to push Allow |
| ATT primer with no decline button | Brainly [br-15](https://mobbin.com/screens/97e9f7c8-7723-44db-9317-2cf59394c0b7) | Only one way forward |
| No visible close on the paywall; price small under the CTA | Cal AI [cal-33](https://mobbin.com/screens/6e269857-5e29-4c86-8d0a-8b0961d10c53), [screen](https://mobbin.com/screens/b38ea1cf-1eba-47f5-99b2-27e11ba842e8) | Breaks rule 4 |
| Sad mascot on cancel ("If you cancel, you'll start seeing ads again") | Duo [screen](https://mobbin.com/screens/656742c0-7f62-4a7f-a5a9-05e54747e036) | The fact is fine; the sad face is mild guilt |
| Swearing and roast humour by default | Cleo | Opt-in only. Wrong default for Ditch |
| Pet-health guilt loop ("fill Caramel health meter") | BitePal | Pressure via a creature's wellbeing |

---

## 6. Apply to Ditch, screen by screen

Scores are out of 10. ★ = pick. Copy follows CLAUDE.md: short, casual, no em-dash chains.

### Screen 1 · Welcome
**Layout:** keep the big raccoon and headline. Change the pose from **waving** (Duo and BitePal both wave) to the **signature flick**: ¾ view, card in paw, clean bin beside it. Add one speech bubble above the raccoon (Duo [duo-3](https://mobbin.com/screens/a824931a-588b-4f12-9073-2bddae0816ca) style).
**Motion:** the flick plays once on load (~0.8s), then idle blink. Reduce Motion: static "card above bin".

| Element | Option | Score |
|---|---|---|
| Headline | "Ditch it before it renews." (current, matches App Store subtitle) | ★ 8 |
| Headline | "Every sub. One heads-up before each charge." | 6 |
| Bubble | "Let's find what you're paying for. Three quick steps." | ★ 8 (honest: tick, dates, reminders) |
| Bubble | "Hi! I catch sneaky renewals." | 6 |
| Bubble | "Let's see where your money's sneaking off to." | 7 |
| Footer | "Free. No account. Your list stays on your phone." (current, true) | ★ 9 |

### Screen 2 · What do you pay for?
**Layout:** keep it. It's already the strongest screen. Add a **reacting bubble** (Duo [duo-10](https://mobbin.com/screens/1a2c3854-ea7a-41fa-ab1b-95466c2c0228)) and make the footer total **roll** with a selection haptic on each tick.
**Mascot:** the 92pt avatar stays. At 0 ticks: neutral. At 3+: "keep going" bubble. Above $500/yr: eyes widen.

| Element | Option | Score |
|---|---|---|
| Bubble (start) | "What do you pay for? Tap them all!" (current) | 7 |
| Bubble (start) | "Tap everything you pay for. Small ones count too." | ★ 8 |
| Bubble (3+ ticked) | "Keep going. Gym? Cloud storage?" | ★ 8 |
| Bubble (over $500/yr) | "Ooh. That adds up." | ★ 8 |
| Price label | "~$17.99/mo" plus a one-time hint "Typical price. You can edit it later." | ★ 9 (honest about estimates) |

### Screen 3 · That's $X a year (the reveal)
**Layout:** make this *the* big beat, like the "plan ready" screens. Full-bleed pine background for this screen only. Count the number up, then the "Biggest ones" rows stagger in. Keep the C+R Research footnote; it's cited and true.
**Mascot:** current "shocked + receipt unrolling" is right. Redraw it to spec (§3). The receipt unrolls with the count-up.

| Element | Option | Score |
|---|---|---|
| Headline | "That's about $887 a year. Ditch it." (current) | 7 ("Ditch it" may sound pushy when they want most of them) |
| Headline | "That's about $887 a year." + sub "$73.94 a month across 6 subscriptions." | ★ 8 |
| Bubble | "Let's make sure each one's worth it." | ★ 8 |
| CTA | "Let's fix that" (current) | 7 |
| CTA | "Set up my reminders" | ★ 8 (says what's next) |

### Screen 4 · Charge dates
**Layout:** keep the one-tap day grid with auto-advance; it's faster than any wheel seen. Make "1/6" bigger as dots under the card. Each answered card slides left (already in code).
**Mascot:** avatar + bubble. Vary the lead-in after the first card so it doesn't repeat.

| Element | Option | Score |
|---|---|---|
| Bubble (1st) | "When does Netflix charge you?" (current) | ★ 8 |
| Bubble (2nd+) | "And Spotify?" | ★ 8 |
| Help under "Not sure" | "Check your last receipt, or iPhone Settings → Apple ID → Subscriptions. You can add it later." | ★ 9 (honest; no detection claim) |

### Screen 5 · Reminder permission
**Layout:** keep the lock-screen mock built from *their* subs (as Cleo shows a sample notification [cleo-19](https://mobbin.com/screens/13f36736-b672-43d7-8807-56608dab301d)). **Don't** draw a fake iOS alert (Cal AI [cal-26](https://mobbin.com/screens/66d99844-e915-4e28-b31f-53214b84d2d4)). Tap the button, then show the real alert.
**Mascot:** bell pose. The bell swings twice on entry.
**Copy fix:** "before anything charges" promises reminders on everything, but free covers 3. Make it accurate.

| Element | Option | Score |
|---|---|---|
| Bubble | "I'll ring you 3 days and 1 day before anything charges." (current) | 6 (overpromises on free) |
| Bubble | "I'll ping you 3 days and 1 day before a charge." | ★ 9 |
| Bubble | "Two heads-ups before each charge. 3 days out, then 1 day." | 7 |
| Small print | "Times can be changed later in Settings." | ★ 8 |
| CTA / secondary | "Turn on reminders" / "Maybe later" (current) | ★ 9 |

### Screen 6 · Paywall
**Layout:** it's already honest (X, Restore, Continue free, real dates). Changes:
1. **Shrink the raccoon** to about 72pt and use the bell or flick pose, not jumping. Duo and Speak keep mascots modest on paywalls; Brainly has none.
2. Put the real-date trial line **above** the CTA, not only under it (Brainly [screen](https://mobbin.com/screens/ce0e5f24-2e8d-431e-8143-8eb94c3ac95d)).
3. Keep "Save 50%" only because it's real ($29.99 vs $4.99 × 12 = $59.88, 49.9%). Compute it from live store prices, and hide it if the maths changes.
4. Never add exit offers, countdowns or a "sure you want to skip?" sheet.

| Element | Option | Score |
|---|---|---|
| Headline | "Get a heads-up before all 6 renewals." (current) | 8 |
| Headline | "Free covers 3. Pro covers all 6." | ★ 9 (clear, true, uses their number) |
| Headline | "Never miss a renewal again." | 4 (generic, can't promise) |
| Trial line | "Free for 7 days. Then $29.99 a year from Mon, Nov 16. I'll remind you Sat, Nov 14." | ★ 9 |
| CTA | "Start 7-day free trial" (current) | ★ 8 |
| Secondary | "Continue free: 3 reminders" (current) | ★ 9 |
| After free pick (bubble on next screen) | "Good call. You can go Pro anytime." (Duo [duo-18](https://mobbin.com/screens/eade4735-8f46-4659-bc9e-2e93d306019e)) | ★ 8 |

Optional, inspired by Duo [screen](https://mobbin.com/screens/03c0d236-bd56-42b0-8ce1-95a1f6bc478e): let the user pick "2 days before (Sat, Nov 14)" or "1 day before (Sun, Nov 15)". Score 6: it's honest and charming but adds a tap at the point of purchase. Default stays automatic.

### Screen 7 · Pick 3 (free)
**Layout:** keep. When one is swapped, the card does a small hop.
**Mascot:** the current "worried with a pile of cash" pose is fine. Redraw to spec.

| Element | Option | Score |
|---|---|---|
| Bubble | "Free gets 3 reminders. I picked your biggest. Swap any time!" (current) | 8 |
| Bubble | "You get 3 free reminders. I picked your 3 biggest. Tap to swap." | ★ 9 |
| Bubble (after free choice on paywall) | "Good call. You can go Pro anytime." | 8 |

### Missing screens worth adding (honest, evidence-backed)
1. **"You're set" celebration (after Pick 3)** ★ 9. Evidence: Cleo "YOU'RE ALL SET" ([cs-9](https://mobbin.com/screens/034cd0f2-2f36-47f7-a058-cec7e6e52438)), Cal AI editable result ([cal-31](https://mobbin.com/screens/7294b9e4-76ae-4d49-af18-bfb3d8a2566a)), Duo send-off ([duo-20](https://mobbin.com/screens/24aaae49-d6dd-479e-913d-55740b8b25fc)). The raccoon flicks one card into the bin, then shows a summary built only from their data: "6 tracked · $887 a year · Reminders on Netflix, Prime, YouTube." Each row taps to edit. CTA "Take me home". No loader before it; it shows instantly.
2. **"Any you barely use?" (optional, after the reveal)** ★ 8. Evidence: Cal AI's barrier question ([cal-19](https://mobbin.com/screens/421d286e-7917-402b-9a47-dab5a17231ff)), Cleo's chips ([cs-3](https://mobbin.com/screens/0ded316e-868a-49c8-9a7e-8f372e868ddb)). Multi-select over their own list, with "Not sure yet" as the zero-pick CTA (BitePal pattern [bpA-5](https://mobbin.com/screens/07351d14-0b6b-47cd-9ac9-e28055317646)). The payoff: "Ditching those would save $214 a year." It only *marks* them; it never cancels anything. Skippable.
3. **Length promise** ★ 8: no new screen, just the Welcome bubble above plus a 3-segment progress bar.

**Don't add:** "How did you hear about us?" (we collect no analytics, so the answer would go nowhere). A rating ask before use (ask after the first real Ditched celebration instead). Any "analyzing" loader (nothing to compute). Naming the raccoon or a personality picker (BitePal's signature screens; tone modes are locked to v1.1). A fake system alert.

---

## 7. References

### Mobbin flows
- BitePal Onboarding A: https://mobbin.com/flows/280827a4-34c7-4915-9dde-5d4de3005186
- BitePal Onboarding B: https://mobbin.com/flows/3aca70bc-a1e3-4895-9a72-24dc68de3bf9
- BitePal Setting up goals: https://mobbin.com/flows/240d794c-1df2-459c-b295-5ef878eb37a1
- BitePal Setting up goals v2: https://mobbin.com/flows/ffd6f588-b052-4fe7-ad34-d1fb96473e42
- BitePal Completing account setup: https://mobbin.com/flows/d84c49f9-1052-4d02-a283-2f0b22ad1da9
- BitePal Completing questionnaires: https://mobbin.com/flows/80476d01-be1c-4556-92ed-a98135fdada4
- BitePal Health meter: https://mobbin.com/flows/9c310318-40a5-48df-b0a5-176a7cfce2d8
- BitePal Creating an account: https://mobbin.com/flows/afe7a4e9-8207-4c35-8a0f-7ebb2f2eff09
- Cal AI Onboarding (34): https://mobbin.com/flows/579da5dd-453a-4e7c-9c11-d20708a4db82
- Cal AI Onboarding (17, older): https://mobbin.com/flows/05ca2ff4-106a-4fda-a0dd-3cc9b73a83c1
- Brainly Onboarding: https://mobbin.com/flows/39be929d-0ba5-40ce-a922-e15af126770e
- Duolingo Onboarding: https://mobbin.com/flows/b0b4f93f-5637-46ec-9d77-49ecda6b991d
- Duolingo Creating a profile: https://mobbin.com/flows/4511e153-c7d5-4b70-b37e-09cc798e49d9
- Cleo Onboarding: https://mobbin.com/flows/480b563d-86bb-44b8-a771-448c209e8408
- Cleo Setting up Cleo: https://mobbin.com/flows/78850b24-4ac4-4c5a-ae91-89014abd6d4d
- Speak Onboarding: https://mobbin.com/flows/60e05ece-3567-4ad8-9dbe-577de850a017
- Noom Onboarding: https://mobbin.com/flows/0592dfbd-aac4-408b-ab48-76334ce7fc11

Individual screen links are inline in every table row and bullet above.

### Web
- BitePal on the App Store: https://apps.apple.com/us/app/-/id6479529917
- BitePal review, "The Food Tracker That Promises Magic (But Delivers Mixed Results)": https://neurospicynomnoms.beehiiv.com/p/bitepal-review
- BitePal showcase (ScreensDesign): https://screensdesign.com/showcase/bitepal-ai-calorie-tracker
- BitePal listing data (AppGoblin): https://appgoblin.info/apps/6479529917
- Android Central calorie app test: https://www.androidcentral.com/apps-software/ai/testing-calorie-counting-apps-for-three-days-this-one-is-more-accurate
- Superwall × Cal AI case study (vendor, self-reported): https://superwall.com/case-studies/cal-ai
- Founderpath, Zach Yadegari on Cal AI onboarding tests: https://founderpath.com/resources/zach-yadegari-cal-ai-onboarding-tests-and-influencer-marketing
- Writer, Cleo "Big Sister Energy": https://writer.com/blog/big-sis-energy
- Sifted, Cleo's comedy writers: https://sifted.eu/articles/want-to-make-your-ai-chatbot-funny-hiring-comedians-is-a-start
- ElevenLabs × Cleo voice: https://elevenlabs.io/blog/cleo
- Duolingo blog, World Character visemes: https://blog.duolingo.com/world-character-visemes
- Duolingo blog, shape language: https://blog.duolingo.com/shape-language-duolingos-art-style/
- Cartoon Brew (Duolingo acquired Gunner): https://www.cartoonbrew.com/educational/duolingo-anime-inspired-series-titmouse-255505.html
- Third-party, Duolingo-style Rive mascots (secondary): https://dev.to/uianimation/how-duolingo-uses-rive-for-their-character-animation-and-how-you-can-build-a-similar-rive-mascot-5d19
- Taplytics, Duolingo delayed sign-up test: https://taplytics.com/blog/duolingo-ab-test-onboarding
- Known references, not re-fetched today: Apple App Review Guidelines 3.1.2 (subscriptions) https://developer.apple.com/app-store/review/guidelines/#subscriptions · FTC, "Bringing Dark Patterns to Light" (2022) https://www.ftc.gov/reports/bringing-dark-patterns-light · Buell & Norton, "The Labor Illusion", Management Science 2011, https://doi.org/10.1287/mnsc.1110.1376

### Mobbin notice

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
