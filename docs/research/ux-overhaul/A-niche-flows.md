# A. How the niche and finance apps onboard, connect a bank and sell (Nov 18, 2026)

Part A of the UX overhaul. Scope: subscription trackers, "cancel" finder apps and personal-finance apps only. Part B covers best-in-class apps outside finance; part C audits Ditch itself.

- **Sources:** Mobbin flows and screens (`M:` = mobbin.com), ScreensDesign stills for MonoBoost and Subpilot, AppKittie's free onboarding captures for Feenko and the current Rocket Money, recent US App Store reviews, and surveys (linked in §5).
- **AppKittie:** 2 credits (1,834 → 1,836, cap 1,844). Neither app has Meta ad-audience data: Meta only publishes age splits for ads shown in the EU.
- **Nothing here unlocks a locked DECISION.** Where an idea touches one, it's flagged.

## Summary
1. **The apps that feel clear show the product, then your own data.** Monarch, Copilot and Rocket Money open on a real product screenshot or a big number, not a mascot or a slogan. Rocket's current welcome is a phone showing the dashboard, plus "$1.3 billion saved by 10 million people" and "186K+ 5-star ratings". Ditch's "slop" feeling is mostly the absence of product: users never *see* what they're getting before they're asked to do things.
2. **Each screen has one job and one sentence.** "Link your accounts. We'll detect your subscriptions and uncover ways to help save you money." (Rocket). "Securely give Copilot read-only access… We don't sell your financial data." (Copilot). No feature carousels with five bullets.
3. **Bank link sits early, right after account basics, and it is the onboarding.** Rocket even marks checking as "Required". Cleo, Copilot and Monarch put it within 3–6 screens. The finder apps (MonoBoost, Subpilot, Feenko) do the reverse: quiz → paywall → *then* connect.
4. **The trust screen is the conversion screen.** The best ones answer three fears in three lines. Can they move my money? ("read-only", "Cleo can't move your money, she's just an AI with bad attitude"). Do they see my password? ("We never see your password", "never stores your bank login details"). Can I undo it? ("Unlink anytime", "Disconnect anytime"). They also show the Plaid mark. Plaid's own consent pane follows, so the app's screen must not repeat it.
5. **Ditch's "connect → scan → disconnect" is a better trust story than any competitor has.** No one else can say "we disconnect right after." Lead with it.
6. **Every good flow has a no-shame exit:** "Not ready to link yet? Try demo mode →" (Copilot); "Having issues? Try these alternatives: MX · Finicity · Add a manual account" (Monarch); "Verify bank manually instead" (Venmo); and Feenko's exit sheet "Quick one, why not now?", which offers "Not sure it's safe" as an answer.
7. **Scanning screens are short, honest checklists:** Monarch: "Syncing transactions ✓ / Updating net worth"; Origin: "Connecting to Chase Bank and syncing data. Hang tight." over three staged pills.
8. **The reveal is one sentence with real numbers:** "We detected 2 subscriptions costing you a total of $121 a year." Then Rocket lets you confirm them ("Continue with 3 Expenses", "Add A Missing Recurring Expense").
9. **Paywall after the reveal (honest versions):** Copilot's 3-step timeline ("7 days before: you'll receive a reminder"); Monarch's yearly vs monthly with "$179.88 per year, billed monthly"; YNAB's tick box "I understand that my free trial will last until October 2, 2025, and will auto-renew at $109.00/year". **Dishonest versions to avoid:** MonoBoost's "50% off for you. Expires in 9:58", Subpilot's "Discount expires in 09:59" and fake strike-through prices, Feenko's $9.99/week default.
10. **ICP: aim the design at 25–44. Make it work cleanly up to ~60.** The heaviest subscribers and the people who "feel oversubscribed" are under 45 (Motley Fool, CNET). The paid finder apps fish wider: Subpilot's first quiz screen offers age brackets up to "65+". Implication: big type, plain words, visible trust, no Gen-Z meme voice (Cleo's tone is too young for this). §5.

---

## 1. Onboarding, screen by screen

### 1.1 Rocket Money: account, then bank, then reveal, then paywall
Flows: [M: onboarding](https://mobbin.com/flows/fed2772b-6edd-432f-b195-0691f2d84d04) · [M: setting up account (17)](https://mobbin.com/flows/c039b598-adfb-4216-9e7b-2fc896fd1a8b) · [M: recurring setup (13)](https://mobbin.com/flows/d4cc0f80-7fe5-4bcb-b0d7-64617e591927) · current welcome via AppKittie (`storage.appkittie.com/onboardings/com.truebill.truebillnative/01.jpg`)

| # | Shows | Headline / copy | Visual | Ask | Verdict |
|---|---|---|---|---|---|
| 1 | Welcome (2026) | Logo, then a phone on the dashboard ("$2,942 current spend", Checking, Card Balance, Net Cash), then laurels "$1.3 billion Saved by 10 million people" · "186K+ 5 star ratings" · "Create account" · "See how we calculated $1.3B" | **Real product shot** + 2 proof numbers | — | **Best welcome in the niche.** You see the app before reading a word. The footnote link makes the claim checkable |
| 2–4 | Name, email, password | "What's your name? Please enter your full, legal name…" · checkboxes "Enable Passcode", "I agree to the…" | Plain form | Name, email, password | Friction, but expected at a bank-grade app |
| 5 | Account created | "Account created. Your email and password have been successfully set." | Green tick with sparkles | — | Small win before the hard ask |
| 6 | Notification pre-ask | "Never miss important, personalized updates" + a fake iOS dialog + red arrow "Tap "Allow" on the next screen" · Continue / Not Now | **Mock of the system alert** | Notifications | Copy this pattern exactly (Ditch's v11 plan already has it) |
| 7 | Bank link | "Link your accounts. We'll detect your subscriptions and uncover ways to help save you money." · chip "🔒 Bank-level Security" · rows "Checking Required ⊕" / "Credit Cards ⊕" · floating review "'Best app I've ever used.' Serena R. ★★★★★" [M](https://mobbin.com/screens/e6242047-88a9-465d-a81d-1b1b655d5a04) | Two big rows, review toast | Bank (required) | Clear, but "Required" with no skip feels forced |
| 8 | Institution list | "Select your account" · search "Search all institutions" · Chase, Capital One, BofA… each with its **web address under the name** [M](https://mobbin.com/screens/4055fb4b-a1ac-488a-9be8-72d765a7c87c) | Logo list | Bank login (aggregator) | The URLs reassure ("this is the real Chase") |
| 9 | Reveal | "Your Subscription Overview. Here's what we know so far." · "We detected 2 subscriptions costing you a total of $121 a year." · linked accounts list · "Save up to $96 annually by canceling just 1 subscription." [M](https://mobbin.com/screens/301a0b9c-d67a-4a7b-b154-23a57f864940) | Card with bank logos | — | **The model for Ditch's "Found 9".** Yearly number, from your own data |
| 10 | Confirm | "Do you consider any of these to be bills?" [M](https://mobbin.com/screens/117ead1a-efe1-445f-8ec1-781907699330) → "Here are all of your recurring expenses." Bills / Utilities / Subscriptions (logo stack, $29) / Other · "Monthly Average $31" · "Continue with 3 Expenses" · "Add A Missing Recurring Expense" [M](https://mobbin.com/screens/e919b59d-41e9-43ea-bf92-f4b7603723e0) | Grouped rows + logo stacks | Confirm | The user *owns* the list. The count sits in the button |
| 10b | Nothing found | "We didn't detect any bills. Think something is missing? You'll have the chance to add recurring expenses manually…" · "Continue with 0 Bills" (in the recurring flow above) | Envelope icon | — | An honest empty state. Ditch needs one |
| 11 | Savings nudge | "You could save up to $378 a year by canceling unwanted subscriptions" · ☑ "Remind me to cancel subscriptions" [M](https://mobbin.com/screens/f6a479d0-e3de-413c-a8aa-8e817ceac949) | Netflix row on a phone mock | — | Ties the money to a reminder |
| 12 | Paywall | "Try money-saving features for free" · pay what you think is fair ($9/$10/$11 a month, "Most people pick $10") · "Rocket Money pays for itself. Save up to $768 per year*" · "419K members saved money in past 30 days" · **no ×** [M](https://mobbin.com/screens/50401be4-6845-434a-989c-153bf925170f) [M](https://mobbin.com/screens/f1e40472-8469-4dbd-992f-7c768766f3f5) | Tiles, carousel, laurels | Trial | Strong social proof, but no visible close. Don't copy that |
| 13 | Authorization | "I authorize Rocket Money to electronically debit my account for **$10.00 per month + applicable tax** after the trial period ends on **October 08, 2025**" [M](https://mobbin.com/screens/1137fa1a-5548-440a-8f06-0a52032a713a) | Legal text | Agree | The real date, but buried after the paywall |
| 14 | Home | "Your Recurring Subscriptions & Bills: see what's coming and cancel things you no longer need" modal → Recurring tab with "3 SUBSCRIPTIONS $377 per year" [M](https://mobbin.com/screens/df5e0c45-f720-4e21-95e0-e783701b1717) | Product | — | Shows the yearly total per group |

### 1.2 Copilot Money: polished, trust-first, with a demo mode
Flows: [M: onboarding incl. connect + subscribe (27)](https://mobbin.com/flows/bec90a3f-1c1b-490a-b27d-8445cc6e62a7) · [M: onboarding (23)](https://mobbin.com/flows/92d7d390-97fc-485a-8fab-d9cf1acbd632) · [M: adding an account](https://mobbin.com/flows/489c99a0-ed60-4650-afc4-c30b0c319e31)

| # | Shows | Copy | Visual | Ask | Verdict |
|---|---|---|---|---|---|
| 1 | Welcome | "Let's Do Money Better" · "Sign up with Apple" / "Sign up with your email" · top right "Demo Mode ▸" | Full-bleed isometric city whose buildings are **real brands** (Chase, Citi, BofA, Amazon, Capital One) | Account | The brands work as the illustration (like Ditch's logos). Demo Mode lets doubters look first |
| 2 | Link | "Link bank accounts. Securely give Copilot read-only access to automatically keep track of your accounts. We don't sell your financial data." · empty $0.00 chart · **"Not ready to link yet? Try demo mode →"** · dashed "Link a new account" boxes | The empty product with dashed slots | Bank | Read-only plus "don't sell" in two lines, the product behind it, and a no-shame skip |
| 3 | Plaid pane | "Copilot uses Plaid to connect your account" · "Connect in seconds. Thousands of apps trust Plaid…" · "Keep your data safe. Plaid uses best-in-class encryption…" · "By continuing, you agree to Plaid's Privacy Policy" | App icon + Plaid icon side by side | — | Plaid's standard pane. Every Plaid app gets it free |
| 4 | Institutions | "Select your institution" · "Search" · logo grid (Chase, BofA, Amex, Wells Fargo, Citi…) [M](https://mobbin.com/screens/93a1f045-b0ae-41d8-a969-9c1be98cdf4a) | Logo tiles | Login | Recognition beats search |
| 5 | Explainers | "Types of transactions. Not all transactions mean the same thing…" with real rows ("Joe's Supermarket FOOD $56.24") | **Real UI rows as the illustration** | — | Teaches by showing the product, never with clip art |
| 6 | Notifications | "Notification Preferences. With Copilot, you're always in control." A card shows a live-looking notification "You just got paid. $2,145 from Business Inc…" with an ON toggle | **Notification preview** | Notifications | Shows the exact alert you'll get |
| 7 | Confirm numbers | "Your finances. Let's make sure these numbers are correct" · "Subscriptions & Bills $1,787 expected this month · Review in detail →" · "Tap to confirm" | Cards | Confirm | The reveal-and-confirm step again |
| 8 | Paywall | "Claim your free trial" · timeline "Today: Copilot will analyze your connected accounts" → "7 days before: You'll receive a reminder…" → "In a month: Your Copilot subscription will begin" · "Only $7.92 a month" tab · "$95 per year" · "Restore · All Plans · Enter Referral · Skip" [M](https://mobbin.com/screens/b6ba77c0-7d8f-423e-8453-9db2a97f8035) | Laurels "Editors' Choice" | Trial | The cleanest honest timeline. Its FAQ answers "Why isn't Copilot free?" |
| 9 | Recurring detail | "Transactions named X from $2 to $7 on any day of the month every month · NEXT PAYMENT $9.00 **Expected around Sep 18th**" + price-history line chart [M](https://mobbin.com/screens/430efb0a-7ac5-42e1-a8e3-a3e7c46e3abe) | Chart | — | "Expected around" is honest about uncertainty (Ditch v11 already copies it) |

### 1.3 Monarch: product carousel, short quiz, linking inside the app
Flows: [M: onboarding (28)](https://mobbin.com/flows/e12ffc88-2d1f-4cc5-96dd-97761b730c5e) · [M: onboarding (18)](https://mobbin.com/flows/337e1f92-cc63-4c7f-8516-4b462dbb891c)

| # | Shows | Copy | Visual | Ask | Verdict |
|---|---|---|---|---|---|
| 1 | Welcome carousel (5 dots) | "See all your money in one place. Monarch's intuitive dashboard brings all of your accounts into one view…" · Apple / Google / email [M](https://mobbin.com/screens/f7276c87-9f71-4d4c-9a6d-7001df30d67a) | **Two overlapping real widgets** ("$1.92M net worth", "Spending this month vs last month") | Account | A product shot per slide; one benefit per slide |
| 2–6 | "Step 2 of 6" | Verify email code → "What brings you to Monarch?" (gradient chips, multi-select) → "How did you hear about Monarch?" → "Tell us about yourself" | Progress label | Data | Visible "Step x of 6" makes it feel short |
| 7 | Paywall | "How your free trial works · Today… · In 6 days: We'll send you a reminder email… · In 7 days: Your subscription starts July 14 unless you've canceled" · "$99.99/year, $8.33 per month, billed yearly [SAVE 44%]" · "$14.99/month, $179.88 per year, billed monthly" [M](https://mobbin.com/screens/f4f97ca0-8e85-4609-8f21-c5c9902171d4) [M](https://mobbin.com/screens/648acdda-e963-4f0d-b98d-e32dca5ccdd8) | Gradient header, press or rating laurel | Trial | **Shows the yearly cost of monthly**: the honest way to push yearly |
| 8 | Empty dashboard | Cards "See a snapshot… · Add account"; a "Getting Started" checklist (Add an account ✓ · Customize categories · Create a goal) | Ghosted real data behind the prompt | Bank | Linking happens after the paywall, from the dashboard |
| 9 | Sync | "Syncing accounts ✓ · Syncing transactions ✓ · Updating net worth ● · Updating spending reports" [M](https://mobbin.com/screens/33fc9bf6-cf4c-46f2-be9d-6373759dc721) | Animated checklist | — | **The scanning pattern to copy** |
| 10 | Fallbacks | "Add Account · Search 13,000+ institutions · Having issues? Try these alternatives: MX · Finicity · Add a manual account · Request new connection" [M](https://mobbin.com/screens/0c9f6275-6ed1-4af3-8691-982a6e08e752) | List | — | A failed link never ends in a dead end |
| 11 | Apple Card | "Connect Apple Wallet: 1. Allow Access… 2. Select Accounts… 3. Sync" [M](https://mobbin.com/screens/f6efe9b5-5395-4412-9826-c3e4158e1e73) | Numbered steps | FinanceKit | Pre-explains the system sheet. Reuse this for Ditch's v2 FinanceKit work |

### 1.4 MonoBoost: quiz funnel, scare stats, timer paywall (ScreensDesign, [showcase](https://screensdesign.com/showcase/monoboost-cancel-subscriptions))
1. **Welcome:** "Let's sort out your subscriptions and more" · "Continue with Apple". A floating "Managing budget" card with an icon. The product is barely visible.
2. **Fear stat:** CNN logo, "INSIGHT", "73% of Americans report feeling stressed about money". Orange scribble ball.
3. **Mood quiz:** "How would you describe your finances right now?" Three faces: Stressed / Uncertain / Stable. Reply line: "Uncertainty is okay, we'll guide you to more confidence and control."
4. **Fake projection:** "Your personal subscription savings solution is almost ready". A falling curve "No tracking → With MonoBoost", "This chart is for illustrative purposes only", plus a West Monroe stat.
5. **Paywall:** "Start saving with Premium", feature cards "All Subscriptions in One Place", "**50% off for you. Expires in: 9:58**".
   - Weekly $9.99 ~~$19.99~~, Monthly $19.99 ~~$39.99~~ "$4.99 / week", Yearly $99.99 ~~$199.99~~ "$1.92 / week MOST POPULAR".
   - Green Continue · "See all plans".
6. **On close:** "What stopped you from buying?" (Prices are too high / Want a trial first / Don't want another subscription…), then a discounted first week.
7. **Inside:** "Unsubscribe guide · Powered by AI", text steps for Spotify, "It works, thanks!" / "It didn't work".

**Verdict:** clear emotional arc, zero product clarity, dark-pattern pricing. 81% of recent written reviews are 1–2★ (`finder-apps-2026-11-18.md`). Copy only the mood-reply line idea (answering a choice with one reassuring sentence).

### 1.5 Subpilot: 12-step quiz → email gate → paywall → timed upsells ([showcase](https://screensdesign.com/showcase/subpilot-cancel-subscriptions))
1. **1/12, "What is your age?"** 18–34 / 35–44 / 45–54 / 55–64 / 65+, emoji faces that age with each row (see §5).
2. **4/12, "Do you know how much you spend in your subscriptions?"** Less than $50 / $50–100 / More than $100 / Not sure.
3. **"You're Spending More Than You Think"** graph, then "Preparing Subscription Manager" loader with rotating testimonials.
4. **Email gate:** "Enter your email to reveal what is charging you:" (the email is the reveal key).
5. **Paywall:** "Cancel Unwanted Subscription in one place" · "€924.00 a year in average was saved by users" · "3 Unknown subscription users discover in average".
   - Yearly $99.99 "SAVE 75%" (struck $99.99, "US$8.33 per month") vs Monthly "(3-day free trial) $19.99/monthly after 3 day trial".
6. **Upsell:** "Discount expires in 09:59" · "Save $500+ Automatically Every Year…" · "Buy and Unlock Concierge Pro".
7. **Home:** "Spot Hidden *Subscriptions*. Connect email or bank to find and cancel subscriptions" · card "Scan my Email · Gmail | Outlook · **Fastest Method**" · "Based on your answers" Netflix/Spotify/YouTube tiles with **Cancel** buttons · "Pick from the list and we will cancel".
8. **Cancel step:** "Connect your Netflix Email to complete cancellation" / "Manual Instruction".

**Verdict:** the home screen is the clearest "what this does" moment in the niche (logos + Cancel buttons + "Fastest Method" tag). The money tactics (timer, struck prices that equal the real price, add-ons) are what Ditch must not do.

### 1.6 Feenko: product-shot carousel, quiz, paywall, then connection (AppKittie captures 00–24)
1. **Welcome:** a 3D folder spilling real app icons (Netflix, Spotify, ChatGPT, Canva, Google Drive). "Master your **subscriptions** reclaim your money" · Get Started.
2. **Fork:** "How would you like to start? · I already purchased · I'm new to Feenko".
3. **Social proof:** a review wall ("#1 subscription management app loved by millions", 4.8 badge).
4. **Product shots, 1 benefit each:**
   - "Stay on top of your subscriptions and **cut the waste**" (real list: YouTube Premium, Adobe, HBO, OneDrive, LinkedIn, each with date and payment method)
   - "Discover unwanted subscriptions and **cancel easily**" (Spotify detail: "14.99 USD billed monthly · Oct 12, 2025" · red "Cancel for Me")
5. **Quiz:** "Answer a few quick questions to personalize your experience" → "How many subscriptions do you currently have?" (None / 1–3 / 4–7 / 7–10 / 10+) → "How many of them do you actually use?"
6. **Three "Did you know?" cards:** "92% of our users had 8.3 unwanted subs", "$1,416 is an average amount people spend on subscriptions a year", "An average subscription cancellation takes up to 10 steps 30 minutes". All unsourced.
7. **Paywall:** "Master Your Subscriptions" ✓ "Connect your banking." ✓ "Find sneaky charges." ✓ "Cancel what you don't need." · **$9.99/week pre-selected** vs "3 days free, then $39.99/6 months" · Continue "Cancel anytime" · × top left · Restore.
8. **Post-purchase tour:** "Automatically find all your subscriptions (1 of 6)", "Build skills…", "Use your personal AI money advisor". Then an "Are you enjoying Feenko?" star prompt.
9. **Notifications pre-ask:** "Stay on top of your subscriptions. Turn on notifications and we'll let you know about: ✓ When we've found your subs ✓ Charge and trial reminders [Coming soon] ✓ When a price goes up [Coming soon]".
10. **Email connect:** app icon ↔ 🔒 ↔ mail icon. "Let's start with your email. We'll read receipts to find your subscriptions." · "We never see your password · Receipts, not personal email · Disconnect anytime" · Gmail / Yahoo / Outlook rows.
11. **Skip → exit sheet:** "Quick one, why not now?" · Not sure it's safe / Don't have time right now / Want to look around first / Provider isn't listed / Don't use email for bills · Done / Skip.
12. **Source picker:** "Choose **where to find** your subscriptions": Bills from email ✉ / Bank & card payments 🏛 / Browse my subscriptions 📁 / Enter manually 📋.

**Verdict:** screens 4, 10, 11 and 12 are the best-written in the niche. Short, concrete, one icon per promise. The weekly default and unsourced stats are not for Ditch.

### 1.7 Others worth stealing from
- **Cleo** ([M: onboarding](https://mobbin.com/flows/480b563d-86bb-44b8-a771-448c209e8408)): Link screen in chat bubbles: "LINK YOUR ACCOUNT · Plaid connects Cleo securely and you're in good company with millions of users · Cleo can't move your money, she's just an AI with bad attitude · She also never stores your bank login details, bit creepy if she did" · "Login powered by Plaid" · **"Connect me ⚡" / "I need more info on security"**; The security page "Your privacy comes first" lists 5 ticks: Private bank logins / Bank-level encryption / Read-only access / We never sell your data / Unlink anytime ([M](https://mobbin.com/screens/96712606-5aa5-4393-95bd-f370ff115e6c)); Voice is the trust device. The second button gives anxious users a door instead of a no.
- **YNAB** ([M: completing onboarding](https://mobbin.com/flows/b05bd5de-003b-488c-b4d8-a487f5f99c56)): You build your plan first: "Wow, now that's a plan! 🎉 Save your progress (and keep going!) when you sign up for a free trial today."; Paywall: "Start Your Free Month Today · The average YNABer saves $600 in their first month" · Yearly $109 "SAVE 39%" "That's just 30 cents per day!" · "We don't like to brag… so we let others do it for us. Featured by Apple"; Consent tick: "I understand that my free trial will last until **October 2, 2025**, and will auto-renew at **$109.00/year** until cancelled."
- **Orbit** (closest direct rival, [M: onboarding](https://mobbin.com/flows/340b7fb6-8b5d-416c-9f9f-501a27d669bc), [M: get started](https://mobbin.com/flows/6b941627-b728-4443-a947-985a27be4b63)): Welcome: orbiting real logos, "Find your subscriptions, see your spending and never miss a renewal"; Tick list → "That's $155.76 a year"; Home "Get started guide": "Find your subscriptions in four easy steps: Import a Bank Statement · Set up Sharing · Import from iCloud · Search your Emails · Do this later".
- **Origin:** "Start tracking your money. Do you know where your money is going? Link your bank to find out" · CONNECT MY ACCOUNTS / NEXT · "Learn more about Origin's safety commitment" ([M](https://mobbin.com/screens/4ccd2d0a-2ec4-4e5e-8729-76cdc0732c88)); Sync sheet: "Connecting to Chase Bank and syncing data. Hang tight." with staged pills Loading balances → Fetching transactions → Updating spending data ([M](https://mobbin.com/screens/0a3297f4-b800-471a-a2bc-8236974a31ac)).
- **Trust-copy variants:** Betterment: "Get a secure connection with read-only access · Betterment will never store your credentials" ([M](https://mobbin.com/screens/bbe379eb-26bc-41ac-9b79-184494a19ac0)); Venmo: "Verify bank manually instead" ([M](https://mobbin.com/screens/b2e90f2a-5c36-4e8c-bac6-b97560339907)); Dave's analyzing screen with progress bar + "Dave helps over 11M members stay on top of their finances" ([M](https://mobbin.com/screens/7f4361d6-78ed-49aa-b435-e9b4a730d861)).
- **Bank-built recurring lists:** Starling: "This transaction looks like it's a recurring card payment… Show in scheduled payments" ([M](https://mobbin.com/screens/91f20d3b-924c-452c-98f8-f508a3c85ed6)); Origin's Recurring grouped Biweekly / Monthly / Annual / **Inactive** greyed out ([M](https://mobbin.com/screens/3441dd7a-d41e-4406-950a-299684f6dc02)); Revolut: "Premium plan · Monthly, next on 20 Apr" ([M](https://mobbin.com/screens/87422e20-8bd6-4ab7-a663-35776baff036)).

## 2. How they explain "what the app does"
| Pattern | Who | Clarity | Conversion fit for Ditch | Score |
|---|---|---|---|---|
| **Real product shot + one benefit line** (carousel of 2–4) | Monarch, Rocket (2026), Feenko 4 | Instant: you see a list of your kind of thing | High, if it's *Ditch's* real list with logos and dates | **9/10** |
| **Interactive demo** (tick your subs → your yearly total) | Orbit, Ditch v11 | Instant and personal | Highest; the user makes their own aha | **9/10** (keep) |
| **Do-the-thing-first** (connect → reveal) | Rocket, Copilot | Clearest for bank users | High for US/CA; needs a fallback for everyone else | **8/10** |
| Demo mode with fake data | Copilot | Good for the doubtful | Medium; a "see an example" link from the trust screen | 6/10 |
| Personal quiz (age, mood, spend guess) | MonoBoost, Subpilot, Feenko | Low: you learn about yourself, not the app | Works with paid traffic, feels like slop to organic users | 4/10 (one question max, e.g. Ditch's "Quick guess") |
| "Did you know?" stat cards | Feenko, MonoBoost | Low | Preachy; unsourced numbers break rule 5 | 2/10 |
| Feature list on the paywall (3 ticks) | Feenko, Rocket | Medium | Fine as a reminder, not as the explanation | 6/10 |

**Best headlines (verbatim):**
- "Link your accounts. We'll detect your subscriptions and uncover ways to help save you money." (Rocket)
- "We detected 2 subscriptions costing you a total of $121 a year." (Rocket)
- "Find your subscriptions, see your spending and never miss a renewal" (Orbit)
- "That's $155.76 a year" (Orbit)
- "Choose where to find your subscriptions" (Feenko)
- "Let's start with your email. We'll read receipts to find your subscriptions." (Feenko)
- "Spot Hidden Subscriptions" (Subpilot)
- "Do you know where your money is going? Link your bank to find out" (Origin)
- "Securely give Copilot read-only access… We don't sell your financial data." (Copilot)
- "Cleo can't move your money, she's just an AI with bad attitude" (Cleo)
- "Expected around Sep 18th" (Copilot)

## 3. Bank connection UX (the critical part)
**3.1 Where they ask**
| App | Position | Skip? |
|---|---|---|
| Rocket | Right after account creation, before any value ("Checking Required") | No |
| Copilot | After sign-up, as step 2 | "Try demo mode" |
| Cleo | After name/DOB/attribution | "I need more info on security" |
| Monarch | After the paywall, from the dashboard checklist | Yes (dashboard works empty) |
| Feenko, Subpilot, MonoBoost | **After** the paywall, as the first home task | Feenko: exit survey; Subpilot: manual list |

For Ditch: the free total reveal comes first (works everywhere). The bank scan is offered as the **fastest way to fill the list** (US/CA only), *before* the paywall, because the found results are what the paywall sells (finder doc pick #4, DECISIONS #64).

**3.2 The pre-Link trust screen: what the best ones contain**
- One headline with the benefit, not the mechanism: "Link your accounts" + "We'll detect your subscriptions".
- **Three promises, one line each, with an icon:** read-only / never see your password / disconnect anytime (Feenko, Cleo, Betterment, Copilot).
- The **Plaid mark** at the bottom ("Login powered by Plaid"), not a Plaid essay. Plaid's own pane ("Ditch uses Plaid to connect your account · Connect in seconds · Keep your data safe") follows automatically, so don't duplicate it.
- Plaid's docs: "Link conversion is highest when users have the right expectations set going into Link." Explain why, the benefit, that it's secure, and what they'll need ([Plaid best practices](https://plaid.com/docs/link/best-practices/)).
- A second, softer button: "I need more info on security" (Cleo), "Try demo mode" (Copilot). Never only "Skip".

**3.3 Skip / manual**
- Show the alternatives on the same screen as text links:
  - Monarch: "Having issues? Try these alternatives".
  - Orbit/Feenko: source picker with "Enter manually".
- On skip, ask once why (Feenko). Each answer gets a fix:
  - "Not sure it's safe" → the security page
  - "Bank isn't listed" → screenshot route

**3.4 Scanning**
- Staged real steps with ticks (Monarch, Origin). 10–60 s. Social proof or a fact under the spinner (Dave, Subpilot testimonials). Never a fake progress bar.

**3.5 Reveal and results**
- One sentence + yearly total (Rocket's overview). Then a confirm list grouped by type with logo stacks and the count in the button (Rocket "Continue with 3 Expenses", Copilot "Let's make sure these numbers are correct"). Inactive or stopped charges greyed (Origin, Rocket "Inactive since May 27"). "Add a missing one" link. An honest zero state (Rocket "We didn't detect any bills").

**3.6 Proposed Ditch Plaid flow (US/CA), screen by screen**
1. **Source picker** (after the guess/tick-list reveal, or from Find): "Want us to find the rest?"
   - **Scan my bank** · "US & Canada · about a minute" · tag "Fastest"
   - **Screenshot Apple subscriptions**
   - **Pick from a list**
   - Feenko and Orbit pattern; Subpilot's "Fastest Method" tag.
2. **Trust screen:** headline "We look once, then let go." Three rows:
   - 👁 "Read-only. Ditch can't move money."
   - 🔑 "You log in with Plaid. We never see your password."
   - ✂︎ "We disconnect right after the scan. Your transactions aren't stored."

   Footer "🔒 Connected securely by Plaid". Buttons **Connect my bank** / "How this works" (sheet with the five Cleo-style points and the privacy-label truth).
3. **Plaid Link:** Plaid's consent pane and logo grid. Pre-initialise Link and pass email/phone only if we ever have them (we don't; fine).
4. **Scanning:** "Reading 12 months of charges ✓ · Finding repeats ✓ · Disconnecting from Chase ✓". Logos drop in as they're found (Reduce Motion: show the list). The third tick is the trust payoff, so it must be real (`/item/remove`).
5. **Reveal:** "Found 9 subscriptions. **$1,140 a year.**" · logo stack · "2 free trials end soon" · chip "Chase disconnected ✓". Rocket overview structure; Ditch's yellow hero number.
6. **Confirm list:** "Still charging (7) · Maybe (1) · Stopped (1)" with toggles · button "Add 8 to Ditch" · "Something missing? Add it".
7. Reminders pre-ask naming services → paywall (§4).
8. **Failure paths:**
   - Bank not listed / link failed: "No problem. Screenshot your bank's Recurring page instead" (Monarch alternatives).
   - Zero found: "We didn't spot any repeats. Most people find a few on their Apple subscriptions page."
   - Skip: one-question sheet (Feenko).

**Lock question (owner, DECISIONS #64 still open):** the finder doc suggests showing count, logos and total free, with dates and trial ends behind Pro. Competitors do the reverse. Rocket shows everything free and sells features; MonoBoost blurs the dashboard (1–2★ reviews follow). Showing names and the total but locking dates is the honest middle.

## 4. Paywall after the reveal
| Element | Best honest example | Avoid |
|---|---|---|
| Headline | Copilot "Claim your free trial"; YNAB "Start Your Free Month Today"; personalised: "Get a reminder before all 9 renew" (Ditch v11) | "Master your subscriptions" (generic) |
| Plans | Monarch: yearly first, "$8.33 per month, billed yearly", monthly shows "$179.88 per year" | Struck-through fake prices (MonoBoost, Subpilot); weekly default (Feenko) |
| Trial | Copilot/Monarch 3-stop timeline with a **real date** ("starts July 14"); YNAB tick box with date and price | A "3-day free trial" chip with no date (Rocket) |
| Proof | Rocket "$1.3 billion saved by 10 million people" (footnoted); YNAB "Featured by Apple"; Copilot "Editors' Choice" laurels | Feenko "loved by millions"; unsourced savings |
| Close | Feenko × top-left + Restore top-right; Copilot "Skip" in the link row | Rocket: no close; MonoBoost: exit survey → discount; Subpilot: 2 timed upsells after paying |
| Timer | none | "Expires in 9:58" (MonoBoost, Subpilot) |
| FAQ | Copilot "Why isn't Copilot free?… we'll never sell your financial data" | — |

For Ditch (rule 4 holds): × from frame one, the found count in the headline, Free | Pro table, one line "$0 today · $29.99/yr from Dec 2 · Cancel anytime", Restore. A proof line only once it's real (rating count, or "Featured" if Apple features us).

## 5. Target user: what the evidence says
| Evidence | What it shows |
|---|---|
| Rocket Money affiliate brief ([page](https://www.rocketmoney.com/affiliates)) | Audience "23–34+", 54% women, 75% iPhone, 70% earn >$50k |
| Motley Fool Money survey, n=2,000, Mar 2024 ([fool.com](https://www.fool.com/money/research/survey-overpaying-for-subscriptions)) | **Feel oversubscribed:** Gen Z ~50%, millennials ~50%, Gen X 39%, boomers 29%. **6+ subscriptions:** 56% / 55% / 34% / 29%. **Spending more than last year:** millennials 44%, boomers 16%. **Think they overpay:** every generation >50% (boomers 58%) |
| CNET/YouGov 2025, n=2,440 ([The Desk](https://thedesk.net/2025/05/cnet-subscription-survey-2025/)) | Millennials spend most ($101/mo); Gen Z wastes most on unused subs ($272/yr) |
| AARP via MoneyDigest ([link](https://www.moneydigest.com/2070973/baby-boomer-favorite-way-to-budget-save)) | Likely to use a budgeting app: 38% of 25–44, 21% of 50–64, 15% of 65+ |
| CivicScience ([link](https://civicscience.com/trend-watch-budgeting-apps-are-not-yet-center-stage/)) | Millennials are ~70% of people who like and use budgeting apps |
| Subpilot's quiz (paid Meta traffic) | First screen: "What is your age? 18–34 · 35–44 · 45–54 · 55–64 · 65+". Four of five brackets are 35+, so their ads reach older people |
| Feenko's Meta ads (AppKittie, 173 ads) | "Unused Subs Costing You? Ditch the hassle of multiple subscriptions!… no awkward calls or hold music": a 35–60 Facebook voice. No US age split published |
| Reviews (250 recent US: Rocket 200, Subpilot 50) | Few age cues: "I'm 18" (Rocket), "being retired I watch my money closer" (Subpilot). Not enough to size |

**Recommendation: ICP 25–44 (design persona ~32), and make it comfortable up to ~60.**
- The owner's "28–70" is too wide to design for. The over-55s are reachable with paid Facebook ads, which Ditch isn't doing (finder doc §4d).
- CLAUDE.md's 23–40 slightly under-weights the 40–50 group, who pay for the most household subscriptions and fear bank links.

**What it means for the UI:**
- **Type:** body 17pt minimum, never under 13pt for fine print (it carries price and date). Hero number 80pt+. Full Dynamic Type to AX3.
- **Density:** one idea per screen, ≤ 2 lines of body, ≤ 5 rows visible on the reveal. Logos do the explaining.
- **Tone:** dry and plain ("Still watching?"). No meme slang or "bad attitude" bravado (Cleo skews 18–24). No guilt.
- **Trust signals:** Plaid mark, "read-only", "we disconnect after", real dates, Restore visible, plain cancel path, the App Store rating once it exists, a "How this works" sheet. Show the price with no math tricks.

## 6. Fifteen patterns to copy (ranked by expected conversion impact)
| # | Pattern | Seen in | Evidence | Apply to Ditch |
|---|---|---|---|---|
| 1 | **Reveal sentence with your yearly total** | Rocket overview, Orbit | Top aha in both direct rivals; RevenueCat: most trials start on install day | "Found 9 subscriptions. $1,140 a year." Same screen for tick list, screenshot and bank scan |
| 2 | **Three-promise trust screen before Plaid** | Cleo, Feenko, Betterment, Copilot | Plaid: conversion highest with expectations set; MonoBoost reviews: 7% "went for my bank login… fishy" | "We look once, then let go." Read-only / never see password / disconnect after |
| 3 | **Disconnect proof in the scan** | Ditch only (Monarch-style ticks) | Unique; turns the privacy-label change into a selling point | Last tick "Disconnecting from Chase ✓" + chip on the reveal |
| 4 | **Product shot welcome with proof numbers** | Rocket 2026, Monarch, Feenko | The clearest "what is this" in the niche | Real Ditch list (logos, dates, one DITCHED row) + one line. Duck small or absent |
| 5 | **Source picker with a "Fastest" tag** | Feenko, Orbit, Subpilot | Gives everyone a route; no dead end outside US/CA | Bank (US/CA) · Apple screenshot · Pick from list |
| 6 | **Confirm list with the count in the button** | Rocket, Copilot | Ownership raises trust in detection; fixes false positives | "Add 8 to Ditch"; groups Still charging / Maybe / Stopped |
| 7 | **No-shame second door** | Copilot demo, Cleo "more info", Monarch alternatives | Keeps the doubtful in the funnel | "How this works" + "Not now, pick from a list" |
| 8 | **Honest trial timeline with real dates** | Copilot, Monarch, YNAB | Rule 4; Apple 3.1.2 | Today → reminder day → charge date, with the actual date |
| 9 | **Yearly cost under monthly** | Monarch | Pushes yearly without fake discounts | "$3.99/mo · $47.88 a year" under monthly |
| 10 | **Notification pre-ask with a live preview + "Tap Allow"** | Rocket, Copilot | Higher opt-in (Ditch v11 research) | Preview "Netflix renews in 3 days. $17.99. Still watching?" with their data |
| 11 | **Staged scanning checklist** | Monarch, Origin | Waiting feels shorter; honest | 3 real steps, logos appear as found |
| 12 | **Exit sheet with fixes** | Feenko | Recovers skippers | "Why not now?" → each answer routes to a fix, not a discount |
| 13 | **"Expected around" for uncertain dates** | Copilot | Honesty about detection | Detected dates from bank show "around Dec 3" until confirmed |
| 14 | **Logo stacks as illustration** | Rocket, Copilot city, Orbit | Brands explain faster than art | Rows, reveal and paywall use real logos |
| 15 | **Real, checkable social proof** | Rocket ("See how we calculated"), YNAB, Copilot | Trust for 35+ users | Add only once true (ratings, featuring). Never "loved by millions" |

**Avoid (dark patterns and slop signals):** countdown timers; Struck-through prices that equal the real price; Weekly pre-selected; Exit-survey-then-discount; Upsells right after purchase; No close button (Rocket); Unsourced "92% of users" / "$1,416" stats; "People like you" projections; Fake "illustrative" charts; "AI" badges on plain text guides ("Powered by AI" for a Spotify FAQ); "Cancel for me" when you can't; Long quizzes that teach nothing about the product; Emoji-face age pickers; Duplicating Plaid's own consent copy; Generic gradient 3D blobs or folders instead of the product; More than one fact screen.

## Sources
- **Mobbin:** links inline.
- **ScreensDesign:** [MonoBoost](https://screensdesign.com/showcase/monoboost-cancel-subscriptions), [Subpilot](https://screensdesign.com/showcase/subpilot-cancel-subscriptions).
- **AppKittie captures:** `storage.appkittie.com/onboardings/com.app.fynk/00–24.jpg` (Feenko) and `…/com.truebill.truebillnative/00–12.jpg` (Rocket Money).
- **Plaid:** [Link best practices](https://plaid.com/docs/link/best-practices/).
- **Surveys:** [Motley Fool Money 2024](https://www.fool.com/money/research/survey-overpaying-for-subscriptions); [CNET 2025 via The Desk](https://thedesk.net/2025/05/cnet-subscription-survey-2025/); [CNET 2026 via ABC7](https://abc7news.com/post/americans-wasting-money-unused-subscriptions-cnet-report-says-here-are-tips-how-manage/19552319/); [AARP via MoneyDigest](https://www.moneydigest.com/2070973/baby-boomer-favorite-way-to-budget-save); [CivicScience](https://civicscience.com/trend-watch-budgeting-apps-are-not-yet-center-stage/); [Rocket Money affiliates](https://www.rocketmoney.com/affiliates)
- **Reviews:** `itunes.apple.com/us/rss/customerreviews/…/json`, pulled Nov 18.
