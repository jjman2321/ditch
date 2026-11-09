# Paywalls and competitors: screen-by-screen research

Written Nov 9, 2026. This goes deeper than `docs/design/CONVERSION-RESEARCH.md` and does not repeat it. It changes no locked decision. Where it suggests something new, it says so.

**How to read it**
- I looked at about 190 Mobbin screens from 70+ iOS apps. Every row below describes a screen I saw. Links are in §6.
- Mobbin captures many apps in Singapore, so some prices are in S$. I quote them as shown.
- Mobbin shows still images. I can't see whether a close button fades in late. Where a screen has no close button at all, I say so.
- "Ratio" for lifetime = lifetime price ÷ yearly price. Ditch's is $49.99 ÷ $29.99 = **1.67**.
- Savings math is mine: 12 × monthly vs yearly. I flag badges that don't match.
- Vendor numbers (RevenueCat, Adapty, Superwall) are self-reported. Treat them as direction.

**Corrections to earlier research**
- `CONVERSION-RESEARCH.md` says Orbit "never asks for money in onboarding". **That's out of date.** Orbit's current onboarding ends on a lifetime-only paywall ([▸][s40d3a02c]).
- `DECISIONS.md` lists Ditch's trial-in-your-list idea as a "Ditch twist". **Rocket Money already does it.** After a trial starts, "Rocket Money Premium · in 9 days · $10.00" appears in its Recurring list with a "Trial Reminder Added" toast ([▸][s01d9cc58]). Ditch can still own it, because Rocket Money never shows it before you pay (§3).
- Orbit's free tier caps **tracking** at 3 subs, not reminders ([▸][s05b8e0fa]). DECISIONS says "3–5". It's 3.

---

## 0. The 12 findings that matter most

1. **Apple's own rule is stricter than most paywalls follow.** Apple's subscriptions page says: "the amount that will be billed must be the most prominent pricing element in the layout… breakdown price… in a subordinate position and size" (Apple, read Nov 2026). Blinkist ("Only $16.66 / month" in bold), 5 Minute Journal ("then $3.33 per month") and Stardust (yearly shows only "$4.16 per month") all break it. Ditch's built yearly card passes.
2. **Show monthly's yearly cost instead of a strike-through.** Monarch writes "$14.99 / month — $179.88 per year, billed monthly" ([▸][sf4f97ca0]). Calm writes "Monthly $19.98/mo. $239.76/yr." That makes the yearly saving obvious without a fake "was" price.
3. **Let people see the reminder before they start the trial.** Bevel shows its real lock-screen banner: "Free trial ending soon ⏰ Cancel before September 9, 2026 to avoid being charged." ([▸][s4e61701e]). Ditch can show its own banner, built from the user's own trial.
4. **Duolingo and Opal let users pick the reminder day** ("2 days before · Dec 14" / "3 days before · Dec 13") before the trial starts ([▸][sdffccfd7], [flow][f7b6dc8e9]). The headline then changes to "We'll remind you 3 days before your trial ends" ([▸][s97ef7575]). A cheap, honest version fits Ditch: a tappable date chip.
5. **The best post-purchase screens are receipts.** Structured shows "Trial Reminders ✓ Enabled" plus "Trial ends on 5/1/26 · Started through App Store" ([▸][s0af9c955]). Woolworths lists the trial range, the monthly amount and the first billing date ([▸][s42878139]). Most apps (Duolingo, Finch, Headspace) just say "Your trial has started".
6. **Rocket Money's "trial in your list" is real but hidden.** You only see it after you pay. Ditch should put it on the paywall timeline and on the post-purchase screen.
7. **A visible free choice is normal, not risky.** Google Health uses two equal buttons, "No thanks" and "Try it on us" ([▸][sa6a5ec71]). N26 puts "Continue with Standard" above its CTA ([▸][se3c08810]). Duolingo's onboarding offers a "Learn for free" card next to Super ([▸][seade4735]).
8. **Lifetime at 1.67× yearly is common.** Bloom ($59.99 / $99.99) and The Outsiders (S$59.98 / S$99.98) use the same ratio. Bloom labels each plan's trial honestly: "No trial" under monthly and lifetime ([▸][sdb6e7f44]).
9. **Single page can beat multi-page.** Superwall's Stompers case (Jan 2026) found a single-page paywall beat a flow with a trial-reminder screen before pricing by "over 16%". That counters Superwall's aggregate multi-page number. Keep Ditch at one page, then test.
10. **Orbit, our closest rival, is weak exactly where Ditch is strong.** No notification ask in onboarding. Its settings show "Notifications Off" ([▸][s8e57188c]). Lifetime-only paywall, "×" as the only free path. Unsourced claims ("84% more likely to save money", "save $300 a year on average").
11. **Exit offers and fake urgency are everywhere.** Finch: "Offer expires when you exit this screen!" ([▸][sdd24134d]). Opal: "Not ready for a year?" with a struck-through yearly price next to monthly ([▸][s75d53eed]). Blinkist: "Would a discount help? 40% OFF" in the cancel flow ([▸][s0ee44212]). None of these fit Ditch.
12. **Trial toggles are dead.** Apple has rejected them under 3.1.2 since mid-January 2026: "This design is confusing and may prevent users from understanding that they are committing to an auto-renewing subscription" (RevenueCat, Feb 9 2026, updated Apr 23 2026). I still saw one live ([▸][s1be71829]).

---

## 1. Per-app screen tables

Columns: **#** · **Purpose** · **Layout (top → bottom)** · **Exact wording** · **Price presentation** · **Trial wording** · **Close / skip / restore** · **Mascot / illustration** · **Link**. "—" means none on screen.

### 1.1 Orbit (direct competitor) — onboarding, paywall, core
Flow: [onboarding][f340b7fb6] · [get started][f6b941627] · [adding a sub][f78e8655b]

| # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Welcome | Orbiting logos (Netflix, Spotify, Duolingo, ChatGPT, Apple, mail, card, iCloud) → planet logo → headline → body → button | "Welcome to Orbit" / "Find your subscriptions, see your spending and never miss a renewal" / "Start tracking" | — | — | No skip, no sign-in | Planet; no character | [▸][s0ad95c82] |
| 2 | Stat | Big headline with purple number → ghost blob → grey source line → button | "On average, we overspend $2,000 a year on forgotten subscriptions" / "Sources: C+R Research and Waterstone Survey" / "Show me an example" | — | — | — | Ghost blob | [▸][s0aefbc5b] |
| 3 | Tick list | "Skip" pill → title → subtitle → rows (radio left, logo, name, price right) → sticky button | "Which subscriptions do you pay for?" / "Typical monthly price, you can edit later." / button "None of these" while nothing is ticked | Monthly price per row (Netflix $19.98, Disney+ $15.98…) | — | "Skip" top right | — | [▸][s592b68fc] [▸][sa759f7af] |
| 4 | Tick list, 1 ticked | Same; button turns purple | "See my yearly total" | No running total | — | Skip | — | [▸][sdeac87fe] |
| 5 | Reveal | Number line → question → ghost → button | "That's $155.76 a year" / "How many others are you paying for quietly in the background?" / "Continue" | Exact yearly (12.98 × 12) | — | — | Ghost | [▸][sc49f7e84] |
| 6 | **Paywall** (onboarding step 7) | × circle top right → phone mock of Home → laurels "Apple Favourites" + "4.8★" → headline → 3 icon rows → review carousel → ghost peeking → sticky card: plan row, button, note | "Orbit customers save $300 a year on average" / "Find your subscriptions" · "See your spending" · "Never miss a renewal" / review "WOW ★★★★★ DavidTan… This app really helped me get rid of unnecessary subscriptions…" / plan "Lifetime [Early bird]" / "Continue" / "Pay once and enjoy forever" | **One plan only**: "S$ 24.98" lifetime | — | × top right is the only free path. No "Continue free". | Ghost peeks over the review | [▸][s40d3a02c] |
| 7 | Paywall, scrolled | Feature list with line icons and 2-line text | "Unlock all features" / "Magic Import — Find your subscriptions instantly by scanning screenshots, spreadsheets or bank statements. Private by design." / "Renewal reminders — Get reminded of upcoming free-trials or regular charges. No more surprises." / "iCloud backup stores everything safely" | Sticky lifetime card stays | — | × stays | — | [▸][s521769df] |
| 8 | Paywall, table | Proof line → Free vs Plus table | "Orbit Plus customers are 84% more likely to save money" / rows: "Unlimited tracking 3 ✓", "Renewal reminders ✓ ✓", "Widgets ✓ ✓", "Magic Import – ✓", "iCloud backup – ✓", "Regular new features – ✓" | — | — | — | — | [▸][s05b8e0fa] |
| 9 | Paywall, bottom | Centered icon links | "Restore Purchase" / "Privacy Policy" / "Terms of Service" | — | — | Restore only at the very bottom of the scroll | — | [▸][s2553cf9e] |
| 10 | Empty Home | "Upgrade" pill top left, + top right → planet → guide card → tab bar | "Get started guide — Find your subscriptions" | — | — | — | Planet | [▸][sccee144c] |
| 11 | Home with subs | Planet with one dot per sub → count + total → guide card → sections | "3 Personal ⌃" / "$240.00 Total yearly" / "Free Trials $5.05" / "Spotify — Renews in 4 days • 28 Nov 2025" / "Active · Next ↑↓" | Yearly total is the headline number | Free trials get their own section | — | Planet | [▸][s79551e51] [▸][s499ecfb2] |
| 12 | Get started guide | "Close" pill → title → 4 rows → text link | "Get started — Find your subscriptions in four easy steps" / "Import a Bank Statement" / "Set up Sharing" / "Import from iCloud" / "Search your Emails" / "Do this later" | — | — | Close + "Do this later" | Icons | [▸][s13f0e2b8] |
| 13 | Import guides | Back + "Done" → title → hero → numbered steps with buttons | Sharing: "Open the Share Menu" / iCloud: "Go to iCloud subscriptions [Open iCloud subscriptions]… Screenshot all your active subscriptions" / Email: "Copy a Search term: [Renewal] [Subscription confirmation]" → toast "Copied to clipboard" | — | — | Back, Done | Phone mock | [▸][sf697f2a7] [▸][s9525457d] [▸][se51aeb7f] [▸][s143d819c] |
| 14 | Add sheet | Cancel → import rows with 🔒 → custom → catalog → floating search | "Import from photos — Receipt, bill or renewal screenshots 🔒" / "Import a file — Bank statement or spreadsheet (PDF or CSV) 🔒" / "Custom subscription" | — | — | Cancel | Logos | [▸][s5702f396] |
| 15 | Add form | Back, Save → logo + name + $ → grouped settings | "Payment date 24 Nov 2025" / "Billing Cycle Every month" / "Free Trial" toggle / "Notification 1 day before" / "Price History" / notes "Cancel before free trial period ends" | — | Free-trial toggle on each sub | Back | — | [▸][saa09c6a8] [▸][s1c6bea40] [▸][sf12defd2] |
| 16 | **Import results, gated** | Back + Cancel → list of found subs, all ticked → locked button | "Add subscriptions — Tap a subscription to edit the details" / rows "Apple One · Renews 24 Dec 2025 · $0.00" / "🔒 Upgrade to Add (9)" | — | — | Back, Cancel | — | [▸][sd864c477] |
| 17 | Settings | Plus card → prefs | "Orbit Plus — Add unlimited subscriptions [Upgrade]" / "Notifications Off" / "Leave a review" / "Share with a friend" | — | — | — | — | [▸][s8e57188c] |
| 18 | Calendar | Month header with two totals → grid with logos on days | "November $15.10 Total $5.10 Upcoming" | — | — | — | Logos | [▸][s954dab6c] |

### 1.2 Rocket Money (direct competitor) — onboarding, paywall, core
Flows: [onboarding][ffed2772b] · [setting up account][fc039b598] · [subscribing][f7baec4d3] · [commitment][f45887c47]

| # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Splash + intro | Gradient logo → "journey" line | "You've started your journey to financial zen!" | — | — | — | Logo | [flow][ffed2772b] |
| 2 | Goal quiz | Back → title → 5 icon rows → disabled Continue | "Are you saving for something specific? Choose your top savings goal" (A car / To pay off debt / An emergency fund / A house / Something else) | — | — | Back | Line icons | [flow][ffed2772b] |
| 3 | Name + email | Form | "What's your name? Please enter your full, legal name…" / "What's your email? … This will be your login" / ☑ "Enable FaceID" / ☑ "I agree to the: Rocket Money Terms of Service…" | — | — | Back | — | [flow][ffed2772b] |
| 4 | Life quiz | Multi-select rows | "Tell us about yourself" (I Currently Rent / I Own A Home / I Am Married / I Have Kids…) | — | — | — | — | [flow][ffed2772b] |
| 5 | Attribution | List + Skip | "How Did You Find Us? This helps our marketing team reach more people like you!" | — | — | Skip | — | [flow][ffed2772b] |
| 6 | Bank link | Gear → title → body → chip → 2 rows → review toast | "Link your accounts — We'll detect your subscriptions and uncover ways to help save you money." / "Bank-level Security" / "Checking Required ⊕" / "Credit Cards ⊕" / toast "'Best app I've ever used.' Serena R. ☆☆☆☆☆" | — | — | No skip (checking is "Required") | — | [flow][ffed2772b] |
| 7 | Reveal | × → title → card → savings line | "Your Subscription Overview — Here's what we know so far." / "We detected 2 subscriptions costing you a total of $121 a year." / "Save up to $96 anually [sic] by canceling just 1 subscription." | Yearly | — | × | — | [▸][s301a0b9c] |
| 8 | Bills quiz | Progress bar + × → title → info → list with checkboxes | "Do you consider any of these to be bills?" / "We know a subscription can feel like a bill, like a meal kit or streaming service." / "Continue with 2 Subscriptions" / "Something Missing?" | "$29.30 per month" | — | × | — | [▸][s117ead1a] |
| 9 | Savings nudge | × → phone mock → headline → checkbox | "You could save up to $378 a year by canceling unwanted subscriptions" / ☑ "Remind me to cancel subscriptions" / "Next question" | — | — | × | Netflix row mock | [▸][sf6a479d0] |
| 10 | Concierge teaser | Logo carousel + slider | "Discover unwanted subscriptions" / "Cancel This For Me" | — | — | — | Logos | [▸][s40fe4679] |
| 11 | **Paywall** | No × visible → headline → body → PWYW tiles → card carousel → sticky chip + button | "Try money-saving features for free" / "Invest in financial peace. We trust you to pick a post-trial price that feels fair." / "Pay What You Think Is Fair" / chip "★ Most people pick $10" / "Choose custom amount" / "Rocket Money pays for itself — Save up to $768 per year*" / "419K members saved money in past 30 days" / chip "7 day free trial, cancel anytime" / "Start Free Trial" | Three tiles "$9/mo ($0.30/day)", "$10/mo ($0.33/day)" pre-selected, "$11/mo ($0.36/day)" | Chip only. No date. | **No close or skip on screen** | Illustrations | [▸][s50401be4] [▸][sdb7e5d7d] |
| 12 | Paywall bottom | Laurels → testimonial → footnote | "5.0 ★★★★★ 186K+ ratings" / "'I truly feel more confident about my finances…' - Lilian S." / "*This annualized figure is based on members' combined usage of Subscription Cancellation, Smart Savings, and Bill Negotiations services. Actual savings may vary and are not guaranteed." | — | — | — | Laurels | [▸][sf1e40472] |
| 13 | Authorization | Back → "Fantastic!" → 7 features → legal → button | "You're well on your way to a brighter financial future…" / "I authorize Rocket Money to electronically debit my account for **$10.00 per month + applicable tax** after the trial period ends on **October 08, 2025**. I understand I may cancel… in app or by emailing support@rocketmoney.com." / "Agree & Continue" | $10/mo in fine print | **Real end date, but only here** | Back | Icons | [▸][s1137fa1a] |
| 14 | Processing | Illustration → line → bar | "We're processing your premium membership" / "This can take up to 30 seconds" | — | — | — | Illustration | [▸][s2fb93a76] |
| 15 | **Trial added to list** | Recurring tab → calendar → "Coming later" list → toast | "Rocket Money Premium · in 9 days · $10.00" / toast "✓ Trial Reminder Added" | — | Its own trial is a row | — | — | [▸][s01d9cc58] [▸][s6eaf1f66] |
| 16 | You're Premium | Header × → member card → link → renew line → accordion | "Member since October 2025 / Plan Monthly" / "View Payment History" / "Your Premium subscription will renew on October 8, 2025." | — | — | × | Card | [▸][s68a06a26] [▸][s6ac66e8d] |
| 17 | Manage membership | List | "Change Payment Method" / "Change Monthly Fee $10/mo" / "Cancel Membership" / "Chat With An Expert" | Fee is editable | — | In-app cancel | — | [▸][s5506dc22] |
| 18 | Track a free trial | × + Save → form | "Track a Free Trial — Enter the details below for your free trial." / Name (autocomplete "Duolingo Plus") / Bill Date / Schedule "Every month" / Amount | — | Trial is its own add type | ×, Save | — | [▸][sbec00605] [▸][sd84d8f69] [▸][s3577e8cc] [▸][s07aab661] [▸][sacd7fd86] |
| 19 | Cancel a sub | Logo → savings line → two cards | "Cancel Amazon Prime — You could save up to $95.88 per year…" / "Cancel this for me" / "If you'd like to cancel yourself: Phone · Website [View instructions]" | — | — | Back, × | — | [▸][s3bc03e0a] |
| 20 | Concierge login | Form + legal checkbox | Asks for Amazon email + password / "…authorize Rocket Money to contact this provider on my behalf… our agents to represent to your provider that they're the account holder…" | — | — | Back, × | — | [▸][s2a04ea4f] |
| 21 | After cancel | Confetti → body → emoji row | "We're on it! … It may take up to 10 days…" / "HOW ARE YOU LIKING ROCKET MONEY?" 😠😒😀😍 | — | — | × | Confetti | [▸][sb8bd90c5] |
| 22 | Recurring list | Grouped by card | "To cancel subscriptions or lower your bills, tap ⋮" / "Rocket Money Premium $10.00 Monthly" | "$72 per year" per card | — | — | — | [▸][s5aa3e934] [▸][s932d9fb9] [▸][s3b479401] |
| 23 | Delete account | × → title → free features → 2 buttons | "Are you sure you want to delete everything? If you choose to downgrade instead…" / "Switch to a Free Account" (primary) / "Delete My Account" | — | — | × | — | [▸][s1934eab1] |

### 1.3 Bobby (direct competitor)
- **Not on Mobbin.** I searched "Bobby subscription manager" and got other apps. No screens to describe.
- From the web: free download tracks up to 5 subs; one-time unlocks from $0.99 to $2.99 (6 in-app purchases, incl. "Unlock Subscription Limit" and "All-in-one Pack"); reminders a set number of days or weeks before each payment, with a configurable time (App Store listing; apppricinglab.com, 2026; MacStories review).
- Our own review research (DECISIONS) says Bobby's #1 low-star complaint is reminders that don't fire.

### 1.4 Duolingo — Super / Max
Flows: [Subscribing to Super, 19 screens][fc71bfa5f] · [Subscribing, 24 screens][f53299ac2] · [Super hub][f06aa7cd2]

| # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Free vs paid choice in onboarding | Progress bar → Duo with bubble → 2 cards → Continue | "Awesome! You can upgrade anytime." / "Super Duolingo — Faster progress, no ads [RECOMMENDED]" / "Learn for free — Core learning features, with ads" (selected) | — | — | Back | Duo talks | [▸][seade4735] |
| 2 | Contextual offer | SUPER badge → headline → phone with no-ads icon → reminder line → button → text link | "Skip ads with a 7 day free trial of Super!" / "🔔 We'll remind you before your trial ends" / "TRY FOR $0.00" / "NO THANKS" | — | Reminder promise right above the button | "NO THANKS" text link | Grumpy Duo | [▸][s97e9b0dc] |
| 3 | Benefits | Icon list → Duo → line → button → link | "Unlimited Hearts" / "No ads" / "Mistakes review to target your weak areas" / "Cancel anytime, no penalties or fees" / "TRY FOR $0.00" / "NO THANKS" | — | — | "NO THANKS" | Duo floating | [▸][sbb7d6e68] |
| 4 | Comparison | Headline → FREE vs SUPER table → line → button → link | "Super learners are 4.2x more likely to finish the Korean course!" / "Easy to cancel, no penalties or fees" / "START MY FREE 2 WEEKS" / "NO THANKS" | — | — | No × on this frame; "NO THANKS" | — | [flow][fc71bfa5f] |
| 5 | **Reminder picker** | × → headline → Duo with bell → 2 option rows with dates → line → disabled button | "When should we remind you before your trial ends?" / "2 days before · Dec 14" / "3 days before · Dec 13" / "Easy to cancel, no penalties or fees" / "START MY FREE WEEK" (greyed until a pick) | — | Real dates | × top left | Duo rings a bell | [▸][sdffccfd7] |
| 6 | Reminder picked | Headline rewrites itself | "We'll remind you 3 days before your trial ends" | — | — | × | Duo winks | [▸][s97ef7575] |
| 7 | Plan picker | × top left, SUPER badge → title → "7 DAY FREE TRIAL" divider → 2 cards → "3 DAY FREE TRIAL" divider → monthly → footer | "Choose a plan" / "[2-6 MEMBERS] Family Plan 12 mo • $119.99 — $9.99 / MO" / "[MOST POPULAR] Individual 12 mo • $83.99 — $6.99 / MO" ✓ / "Monthly $12.99 / MO" / "Cancel anytime in the App Store" / "START MY FREE WEEK" | **Per-month is the big number**; yearly total is small | Trial length grouped above each plan | × top left | — | [flow][fc71bfa5f] |
| 8 | Max plan picker | × → art → headline → 2 cards → line → button → legal | "Save up to 76% with Family Plan after your 7 day free trial" / "Family Plan 12 mo • $239.99 — $19.99 / MO" / "Individual 12 mo • $167.99 — $13.99 / MO" / "TRY FOR $0.00" / "Your annual subscription automatically renews for the same term unless cancelled at least 24 hours prior…" | Same per-month-first layout | — | × | Characters | [▸][s9bbb4867] [▸][sd383e614] |
| 9 | App Store sheet | System | "2-week free trial Starting today / $83.99 per year Starting Jul 25, 2024 / No commitment. Cancel anytime in Settings > Apple Account at least a day before each renewal date." | System shows yearly total | System dates | — | — | [flow][fc71bfa5f] |
| 10 | **Post-purchase** | Stepper 1–4 ✓ → headline → Duo → NEXT | "Your 7-day free trial has started! We'll remind you 2 days before it ends" | — | Restates the reminder | — | Duo | [▸][s98836c8b] [▸][s1a40c1b8] |
| 11 | Feature tour | Stepper → headline → phone → Got it | "Enjoy continuous learning with ad-free lessons" / "Don't worry about mistakes with Unlimited Hearts" | — | — | — | Characters | [flow][fc71bfa5f] |
| 12 | Manage subscription | Banner → plan card → upgrades | "We'll send you a notification 3 days before your trial ends!" / "Super ✓ Learn without ads ✓ Unlimited energy / Next billing date on December 16, 2025" | — | Reminder restated in settings | Back | Duo with bell | [▸][se937c8a3] |
| 13 | Trial ending hub | Duo → headline → button → benefits | "Your Super Duolingo trial will end in **4 days**" / "STAY ON SUPER" | — | Countdown in days (real) | × | Duo | [▸][sa3e467db] |
| 14 | In-context upsell | Energy sheet | "SUPER Unlimited — FREE TRIAL" vs "Recharge 500 gems" / "+5 energy WATCH AD" | — | — | × | — | [▸][sd6a2c6fe] |
| 15 | Cancel survey | Back → title → reasons → Continue | "Why are you canceling Super?" / "I subscribed by accident" / "I wanted to try Super temporarily" / "Super is out of my price range" | — | — | Back | — | [▸][sf395f96c] |
| 16 | Gift | Gift Duo → note field → line | "$95.99 for 1 year of Super. No auto-renewal" | Total | — | Back | Duo in a box | [▸][sefc1b751] |

### 1.5 Finch — Plus
Flows: [subscribing][f352a16af] · [choose plan][fa20f4c9b] · [free preview][fd8578ebe]

| # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Soft intro | Grey line → black headline → bird hugging heart → green button | "Finch is free forever" / "But we'd love for you to try Finch Plus for **7 days free** too!" / "See my FREE offer" | — | — | **No close or skip** | Bird with heart | [flow][f352a16af] |
| 2 | Trial timeline + offer | Green check line → headline → colored vertical bar → 4 rows → price line → button → links | "✓ One-time offer applied" / "Start your 7-day FREE trial" / "Today — Get instant access and see how it changes your life." / "Day 5 — We'll remind you with a notification that your trial is ending." / "Day 7 — You will be charged on Aug 30, cancel anytime before." / "Full Refund Anytime! Changed your mind? Just let us know — no questions asked." / "Start my free trial now" / "Skip this one-time offer" / orange "Offer expires when you exit this screen!" | "~~$99.98~~ S$ 59.98 per year (save 40%)", red | Real charge date | No ×. "Skip this one-time offer" | — | [▸][sdd24134d] [▸][sf58ab869] |
| 3 | Post-purchase | Modal over "Welcome to Finch PLUS" | "Your 7-day trial has started! You will get notifications about when your trial is about to end and more." / "Okay!" | — | — | — | Bird + confetti | [flow][f352a16af] |
| 4 | Regular paywall | × on confetti → bird → headline → proof → 5 benefits → price line → button → link | "Subscribe to PLUS" / "Plus Users are 2x more likely to stick with their self-care goals!" / "Support our mission — Your subscription helps keep self-care free and accessible for thousands!" / "Subscribe now for S$ 99.98 per year ($8.33/month)" / "Subscribe now for S$ 99.98" / "See all plans" | Yearly total in button | — | × top right | Bird | [▸][s0525a643] |
| 5 | Plan sheet | Header → 2 rows → restore → line | "CHOOSE A PLAN" / "12 Months [BEST DEAL] ~~$179.76~~ S$ 99.98 ($8.33/month)" / "Monthly S$ 14.98 every month" / "Restore purchase" / "Cancel anytime in App Store" | Strike = 12 × monthly (true, but looks like a sale) | — | Restore in sheet | — | [▸][s981c04ab] [▸][s11ec5a8d] |
| 6 | Free preview (no card) | Sheet over game | "Your free Finch Plus preview is live! 3 exciting days of extra magic with Lee start right now!" / "Let's go!" | — | Reverse trial | × | Bird in Plus outfit | [▸][sfbfb220d] |
| 7 | Preview ended | Same sheet | "Your free Finch Plus preview ended! Subscribe now to keep enjoying Plus." / "Subscribe now" / "End Finch Plus access" | — | — | × + clear opt-out | Sad bird | [▸][sfa147bb8] |
| 8 | Sponsor | Tiers | "Become a Guardian — Sponsor Finch Plus for those who cannot afford it" | Strike-throughs, "Save 56%" | — | × | Birds | [▸][s5476a849] |

### 1.6 Headspace
Flows: [onboarding, 21 screens][f31b21791] · [subscribing][fccf14439]

| # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Quiz | Sun → title → options | "What's on your mind? I want to…" | — | — | — | Sun face | [flow][f31b21791] |
| 2 | **Trial paywall** | Sun art, × top right → headline → price line → Annual/Monthly segment → timeline (orange bar) → Restore → button | "How your trial works" / "First 14 days free, then $69.99 ($5.83/month)" / "Today — Unlock our library of meditations, sleep sounds, and more." / "In 12 days — We'll send you a reminder that your trial is ending soon." / "In 14 days — You'll be charged on September 1, **cancel anytime** before." / "Restore Purchase" / "Start my free trial" | Yearly total first, per-month in brackets | Relative days + one real date | × top right; Restore under timeline | Sun | [▸][sa9bf58c3] |
| 3 | Monthly selected | Same | "First 7 days free, then $12.99/month" / "In 5 days…" / "In 7 days — You'll be charged on March 28" | — | Trial length changes with plan | — | Sun | [▸][sf807e12e] [▸][seafc7a2d] |
| 4 | **Post-purchase** | Headline → body → bell → 2 buttons | "Your 14 day trial has started" / "Get notifications about when your trial is about to end and more." / "Remind me" / "Maybe later" | — | Asks for push here | "Maybe later" | Bell with face | [▸][s66e6952c] |
| 5 | Manage | Fields → benefits → button | "Subscription Type Annual / Member since August 18, 2025 / Renewal date September 1, 2025 / Subscription via App Store" / "Here's what your mind gets:" / "Cancel my subscription" | — | — | — | Illustrations | [▸][sab864429] |

### 1.7 Calm
Flows: [onboarding, ends in paywall][f38549b00] · [Premium][f66841373]

| # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Attribution | × top left → radio list | "How did you hear about Calm?" | — | — | × | — | [flow][f38549b00] |
| 2 | **Onboarding paywall, all plans** | × top left → "Your plan is ready. Unlock Calm for free" → sheet "View Fewer Plans" → "7-Day Free Trial" section → "No Free Trial" section → button → reminder toggle → settings box → fine print | "Individual Yearly $91.98/yr. ($7.67/mo.) Save 56%" / "Family Yearly - 6 members $137.98/yr. Save up to 90%" / "Monthly $19.98/mo. **$239.76/yr.**" / "Try Free & Subscribe" / "Remind me 2 days before renewal" (toggle) / "Enable notifications in Settings to receive your reminder before renewal [Open Settings]" / "Totally free for 7 days, then $7.67/month, billed annually at $91.98/year. Cancel anytime." | Monthly shows its yearly cost. Badge says 56%; real saving vs monthly is 61.6% | Plans grouped by trial / no trial | × top left | Photo | [flow][f38549b00] |
| 3 | Premium tab | Photos → headline → 3 ✓ benefits → card | "Find your calm today with Calm Premium." / "Backed by research — In a randomized controlled study…" / "Start your 7-day free trial today" / "Try For $0" / same reminder toggle + Open Settings / "Then $7.67/month, billed annually at $91.98/year." | Fine print leads with per-month | — | Tab, no × | Photos | [▸][sd3a2e8d0] |
| 4 | Guest pass | Card → chip → headline | "Extended Offer" / "Gift a free ~~7-Day~~ 30-Day Calm Guest Pass" | — | — | × | Card | [▸][saa50356b] |

### 1.8 Blinkist
Flows: [onboarding][fa9e95e3d] · [canceling free trial][fe1955af2]

| # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Quiz | "STEP 1 OF 4" → title → chips → Next | "Welcome to Blinkist! What are your biggest goals right now? You can always update your answers." | — | — | — | — | [flow][fa9e95e3d] |
| 2 | **Paywall** | × in circle top right → headline → green rule → timeline (emoji icons) → 2 price lines → button → shield line → legal | "Try Blinkist PRO **free for 7 days.**" / "How your free trial works:" / "✅ Today – Free trial starts — Enjoy full access free for 7 days" / "✉️ Mar 31 – Email reminder — We'll let you know when your trial is ending" / "❤️ Apr 2 – Become a member — Your trial ends unless canceled. Enjoy!" / "7 days free, then $199.98 per year" / "**Only $16.66 / month**" / "Start your free 7-day trial" / "🛡 Cancel anytime. Secure with App Store." | **Per-month is bigger and bolder than the billed yearly** | Real dates | × top right | Emoji only | [▸][s1c74c6aa] |
| 3 | Post-purchase | Modal over account screen | "Your 7-day trial has started! We'll remind you that your trial is ending with a push notification." / "Let's go" | — | Paywall said email, this says push | — | "WELCOME" banner people | [▸][s0b792ef8] |
| 4 | Settings | Rows | "Subscription — Your full subscription comes into effect on Apr 2, 2026 · Pro trial" / red "Cancel free trial" | — | Real date | — | — | [▸][s421f73ef] |
| 5 | Cancel survey | Title → reasons → disabled button | "Sorry to see you go — Before you go, would you mind sharing why you're canceling?" / "Continue to cancel" | — | — | × | Broken heart | [▸][s23bce2b9] |
| 6 | Guilt step | Headline → body → 2 buttons | "Sam is learning with you — If you cancel, you'll both lose access on Apr 2, 2026…" / "Keep for us both" / "Continue to cancel" | — | — | Back, × | Hands with books | [▸][sa07cf4e2] |
| 7 | Win-back discount | Headline → big % → prices → button → link | "Would a discount help?" / "40% OFF" / "Your price $119.98 / YEAR" / "~~Original price $199.98/year~~" / "Only $10.00/month" / "Claim my discount" / "Continue to cancel" | Strike | — | × | Gift box | [▸][s0ee44212] |
| 8 | After cancel | Settings row | "Your free trial expires on Apr 2, 2026. You will not be charged" / "Reactivate membership" | — | Clear state | — | — | [flow][fe1955af2] |

### 1.9 Opal
Flows: [onboarding, 23 screens][f7b6dc8e9] · [account setup][f79ce4841]

| # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Loader | Bar | "Preparing report..." | — | — | — | — | [flow][f7b6dc8e9] |
| 2 | Personal promise | Headline → 3 rows → small line → button | "Sam, Opal will get you back **9 years** of your life" / "30% less screen time… to 4h 54m each day" / "Let's solidify it with a fist bump" / "👊 Let's Do It" | — | — | — | — | [▸][se21e4d00] |
| 3 | Reminder picker | Headline → 3D bell → 2 options → line → button | "When should we remind you before your trial ends?" / "2 days before · March 7" ✓ / "3 days before · March 6" / "Enable notifications to receive this reminder" / "Continue" | — | Real dates | — | Bell | [flow][f7b6dc8e9] |
| 4 | Paywall A | Before/After charts → headline → 3 rows → proof → button | "Start Your Free Week And Gain **2+ Hours** Back" / "★★★★★ 100,000+ Reviews — Join 8 Million+ people using Opal" / "Reclaim My Time" | **No price on screen** | — | **No × on screen** | Charts | [▸][sf874f93b] |
| 5 | Paywall B | "Restore" top left, × top right → timeline (first step pre-checked) → plan sheet | "Design Your Trial Experience" / "✓ Get your Focus Diagnosis — You successfully started your journey" / "Today: Improve Your Focus" / "Day 6: See first results — We'll send you a notification with a report…" / options "Free — 7 days free" ✓ vs "30-Day Trial $4.99" / "✓ No payment due now!" / "Redeem 7 days for $0.00" / "7 days free, then $99.99 per year ($8.33/mo). Cancel anytime." | Yearly in fine print | Trial picker framed as "design" | Restore + × visible | — | [▸][sa20e0bb1] |
| 6 | Paywall B scrolled | Last step → press → proof → links → sticky | "Day 7: Trial Ends — Your subscription will start on day 7. Cancel anytime within 24hrs" / "★★★★★ 1,500+ Reviews — Join 200k+ people" / "Subscriptions can be cancelled anytime for any reason." / "Restore Purchases" / "Skip for now" / sticky "Try Free For 1 week / $99.99/year ($8.33/month)" / "Start Your Free Week" | Yearly first | — | "Skip for now" (scroll needed) | Press logos | [▸][s2b025166] [▸][sb41b47ab] |
| 7 | **Exit offer after ×** | Sheet | "Not ready for a year? We get it. Try a monthly plan instead." / "Monthly Plan ~~$99.99/year~~ $19.99/ month" / "Redeem 7 days for $0.00" / "No thanks →" | Strikes the yearly price next to a monthly one | — | Close leads to an offer | — | [▸][s75d53eed] |
| 8 | Settings | Card | "You're on a Free Plan — Upgrade to focus better with ⚡Opal Pro" / "Try for $99.99" | — | — | — | — | [▸][sca8fff07] |
| 9 | Pro benefits | Sheet | "Pro since 6/2/2026 / Renews on 6/9/2026" | — | — | × | — | [▸][sdde0aab2] |

### 1.10 Copilot Money

| # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | **Paywall** | Back + chat → "EDITORS CHOICE" laurels → blue timeline → one plan card with tab → button → legal → link row → reviews | "Claim your free trial" / "Today — Copilot will analyze your connected accounts…" / "7 days before — You'll receive a reminder that your free trial is about to end." / "In a month — Your Copilot subscription will begin, cancel anytime before." / tab "Only $7.92 a month" / "1 month free trial / Then $95 per year of service" ✓ / "Start your 1 month free trial" / "Cancel anytime, for any reason. After the free trial, this subscription automatically renews at the price selected above." / "Restore · All Plans · Enter Referral · Skip" | Yearly in card, per-month in a small tab | 1 month; reminder 7 days before | "Skip" in a link row with Restore | Laurels | [▸][sb6ba77c0] |
| 2 | FAQ below | Q&A blocks | "Why isn't Copilot free? We believe charging a fair price for a well-made product is the best way to run a sustainable business… we'll never sell your financial data…" / "Can I cancel through the app? Yes, you're always in control…" | — | — | "Manage your account" | — | [▸][s008d84bc] |
| 3 | Not eligible | Same layout, no timeline | "Annual Plan $95 per year of service" / "Please restore your previous subscription before subscribing again." | — | No trial shown | — | — | [▸][s74fe23bf] |
| 4 | App Store sheet | System | "1-month free trial Starting today / $95.00 per year Starting Apr 18, 2024" | — | — | — | — | [▸][s2998f38f] |
| 5 | Manage | Sheet | "MANAGE YOUR SUBSCRIPTION — Select the plan that makes sense for you" / "Annual $95 ($7.92 / month) [Active]" / "Monthly $13" / "Manage in the App Store" | — | — | — | — | [▸][s7ab7b855] |
| 6 | Gift | Sheet | "12 months + 2 extra on us — $95 at $6.79 per month of service" / "Gift 14 months for $95" | — | — | — | Gift emoji | [▸][s9253b243] |

### 1.11 Monarch Money

| # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Paywall v1 | Gradient header with press laurel → white sheet → timeline → side-by-side plans → button → links | "Featured in BUSINESS INSIDER" / "How your free trial works" / "Today — Sync your accounts…" / "In 6 days — We'll send you a reminder email that your trial is ending soon. Cancel anytime." / "In 7 days — Your subscription starts February 8 unless you've canceled during the trial." / "[SAVE 44%] $99.99 / year — $8.33 per month, billed yearly" / "$14.99 / month — $179.88 per year, billed monthly" / "Start 7-day trial" / "Restore purchase · Terms · Privacy" | **Yearly total big; monthly shows its yearly cost.** 44% checks out | Real date | No × on screen | — | [▸][s648acdda] [▸][s7e92d605] |
| 2 | Paywall v2 | Same, rating laurel | "4.8 stars ★★★★★ 1,000+ reviews" | Same | Same | Same | — | [▸][s5444ac68] |
| 3 | Paywall v3 | Same, stacked plans + web link | "Start 7-day trial and save 30% more" / "Or continue in-app without additional discount ›" | Same | "starts July 14" | Same | — | [▸][sf4f97ca0] |
| 4 | In-app trial status | Sidebar card with bar | "Free trial — 7 days left" | — | Always visible | — | — | [▸][sa50e61eb] |

### 1.12 Strava

| # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Simple paywall | × → headline → dashed timeline ending in an arrow → button | "Try the very best of Strava. First month's on us." / "Today — Unlock subscription features…" / "2 Days before — Get a reminder about when your trial will end." / "In 30 days — You'll be charged the subscription amount. Cancel at least 24 hours before." / "Start free trial" | **No price on screen** | No date | × | — | [▸][s9851d751] |
| 2 | Bundle paywall | "Subscription" + "Skip" → badge → headline → 2 plan cards → button → line | "UP TO 60% SAVINGS" / "Train smarter with Strava + Runna… Now for 60% less." / "Strava + Runna — Billed at S$ 169.00/year (S$14.08/month)" / "Annual — Billed at S$ 69.98/year (S$5.83/month)" / "Try it for 30-days free" / "You won't be charged until Jun 30. Cancel any time up to 24hrs before your trial ends." | Yearly first, per-month in brackets | Real date under button | "Skip" top right | App tiles | [▸][s55cdf1b4] |
| 3 | Bundle scrolled | Timeline end → "What you'll unlock" → footnote | "In 30 days — Your annual subscription begins! You'll be charged S$ 169.00." / "Savings calculated based on separate monthly Strava and Runna subscriptions." | Exact charge in timeline | — | × | — | [▸][s708c082e] [▸][s40d104f8] |
| 4 | In-app sheet | Sheet | "There's so much more to Strava." / "Start Free Trial Now" | — | — | × | — | [▸][s7bb88f5d] |
| 5 | Membership | Card + link | "Your subscription is set to automatically renew on **2 Jul 2026**." / "Cancel Subscription" → after: "Your subscription is canceled and will expire on 2 Jul 2026." / "Resubscribe Now" | — | — | — | — | [▸][sbeccd794] [▸][sb05a266e] [▸][sa65d3bf6] |
| 6 | Cancel flow | Feature reminder → 2 buttons | "Keep Subscription" / "Next" | — | — | Back | Feature cards | [▸][s94178124] |

### 1.13 Cal AI (hard paywall, 3 pages)

| # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Page 1 | Headline → phone mock of the app → line → button | "We want you to try 🍎 Cal AI for free" / "✓ No Payment Due Now" / "Try Now" | — | — | **No exit** | Phone mock | [▸][sb38ea1cf] |
| 2 | Page 2 | Back → headline → caveat → bell with "1" → line → button | "We'll send a reminder before your trial ends" / "As long as notifications are enabled" / "Continue for FREE" | — | Honest caveat | Back only | Bell | [▸][sca622b90] |
| 3 | Page 3 | Back → food photo → headline → 2 plan cards → button → fine print → links | "Start your 3-day FREE trial to continue" / "[3 DAYS FREE] Start for free & save 75% — $39.98 billed annually — $3.33/mo" / "Monthly $14.98/mo" / "Continue" / "3 days free, then $39.98 per year. Billed annually and renews automatically unless canceled in the App Store." / "Terms · Privacy · Restore" | Yearly total in card; per-month on the right. Real saving 77.8% | — | Back only | Photo | [▸][sb730224e] |
| 4 | Family upsell | Art → 3 rows → line → button | "Only $2.50/mo more! ($59.99/yr)" / "Upgrade to Family Plan" | — | — | Back | Family drawing | [▸][s499d50fd] |

### 1.14 Ladder, Bear, Mimo, 5 Minute Journal, Nibble, Vocabulary

| App · # | Purpose | Layout | Exact wording | Price | Trial | Close / skip / restore | Mascot | Link |
|---|---|---|---|---|---|---|---|---|
| Ladder 1 | Upgrade tab | Headline → rating → ✓ list → 2 plan cards → line → neon button → faint restore | "Get Results, Without Planning Workouts." / "4.9 stars (over 25,000 reviews)" / "[BEST VALUE + ALL TEAM ACCESS] Annual 12 mo • $249.98 — $20.83/mo" / "Monthly 1 mo • $43.98" / "Cancel anytime in the App Store" / "CONTINUE - SAVE 50%" | Savings in the CTA. Real saving 52.6% | — | Tab, no ×; faint "Restore Purchase" | — | [▸][sd67cb7a1] [▸][sd5705369] |
| Bear 1 | Pro sheet | × → logo → bear peeking over the card → 7 one-line benefits → trial line → **two price buttons** → links | "Sync and backup with iCloud" … "Support Bear's development" / "Look and feel smarter" / "A 14-day free trial, then..." / "$3.98 / month" · "$39.98 / year [-16%]" / "Restore Purchases" / "Terms of Use · Privacy Policy" | The price IS the button. 16% is correct | Trial line above prices | × top right | Bear holds the card | [▸][s8a228d8b] |
| Bear 2 | Purchasing | Trial line swaps to spinner | "Contacting Apple…" | — | — | — | — | [▸][s8210e912] |
| Bear 3 | Pro status | Bear + bird → status | "You're a PRO — We appreciate your support!" / "Valid Through Aug 10, 2023" / "To avoid being charged, cancel a free trial period or a subscription 24 hours before the renewal date." / "Manage Subscription" | — | — | × | Bear | [▸][s80d40725] |
| Mimo 1 | Timeline paywall | Onboarding progress bar → logo + × → headline → bar timeline → price line → button → note | "The first two weeks of Pro are on us" / "In 12 days — Get a reminder about when your free trial ends" / "In 14 days — Your subscription starts, unless you cancel anytime before" / "Try 14 days free, then **$89.99/year** ($7.49/month)" / "Start my 14-day free trial" / "No charges yet. Cancel anytime on the App Store." | Yearly bold, per-month in brackets: correct hierarchy | 14 days | × top right | — | [▸][se257555e] |
| 5MJ 1 | Minimal paywall | Faint "Restore" + faint "Skip" → lotus → orange pill → price lines → line → button | "Try 3 Days" / "then $3.33 per month (billed annually as $39.99)" / "No commitment, cancel anytime." / " Secured by Apple" / "Accept Free Trial" | **Per-month first** | — | Faint Restore, faint Skip | Line art | [▸][sc5de87f4] |
| 5MJ 2 | Timeline paywall | × → headline → rows with "TODAY / DAY 6 / DAY 7" tiles → plan card → links → button | "How your free trial works" / "In 2 Days — You'll get a reminder…" / "In 3 Days — Full access starts. Cancel anytime before." / "[BEST VALUE] Annual — $39.99 / $3.33 per month, billed annually, 3 days free trial" / "Restore Purchase" · "More Subscription Plans ⌄" / "Start your 3 days free trial ✍" / "NO PAYMENT NOW" | Yearly first | Tiles say Day 6/7, text says 2/3 days | × top right | — | [▸][s0b03c06a] [▸][s7fff754e] |
| 5MJ 3 | Post-purchase | Modal | "Welcome to FMJ premium – your trial has started" / "We'll send you a push notification when your trial is about to end" / "Remind me" / "Maybe later" | — | — | "Maybe later" | Bells | [▸][sa40086d6] |
| Nibble 1 | Trial guide | × → title → 3 date tiles → button | "Free trial guide" / "TODAY — No payment now…" / "DAY 5 — Get a reminder about the end date of your free trial" / "DAY 7 — Cancel in advance to avoid payment" / "Start free trial" / "Restore purchase" | — | — | × | — | [▸][se722f5a0] |
| Nibble 2 | Reminder | × → goat with phone + bell → headline → green date chip → button | "We'll remind you **2 days** before your free trial ends" / "🔔 January 24" / "Start free trial" | — | Real date chip | × | Purple goat | [▸][sfb296b02] |
| Nibble 3 | Price | × → mostly empty → price line → link → badge → button | "Try 7 days for free then $10.83 per month (billed yearly at S$ 129.98)" / "View other plans" / "Start free trial — 2 taps to start, super easy to cancel" | Per-month first | — | × | — | [▸][s95725ce5] |
| Nibble 4 | Discount | Goat with "69% OFF" sign → price → chip | "Only $39.98/year" / "$0.76/WEEK" / "Cancel anytime. Billed yearly" | Weekly reframe | — | × | Goat | [▸][s8add0191] |
| Vocabulary 1 | Manage | Title → 2-step mini timeline → note → button | "You are subscribed to: Vocabulary free Premium trial" / "Started: 03/24/2026" → "Renewal: 03/27/2026" / "If you cancel, you can keep using the subscription until the next billing date." / "Cancel or change subscription" | — | Trial as a timeline in settings | Back | Crown icon | [▸][s8775ef63] |

### 1.15 More trial timelines and reminder promises

| App | Purpose | Exact wording (key lines) | Price | Close | What's notable | Link |
|---|---|---|---|---|---|---|
| Bevel | Reminder preview | "We'll remind you before your trial ends" + lock screen banner "Free trial ending soon ⏰ Cancel before September 9, 2026 to avoid being charged." / "Continue" / "✓ No payment due now" | — | — | **Shows the real notification text** | [▸][s4e61701e] |
| Bevel | Paywall | "Start your health journey today with Bevel" / "[Save 37%] Yearly S$ 149.98/yr — $12.50/mo equivalent" / "Monthly S$ 19.98/mo — Billed monthly" / "Start Free for 7 days" | Yearly first; 37% correct | × top left | Two tiles side by side | [▸][s87ac5af9] |
| Insight Timer | Reminder paywall | "We'll remind you 2 days before your trial ends" / "You'll get an in-app notification on 26 July. If you do not cancel your free trial, your account will be charged on 28 July." / "Start my free week" | "7-day free trial, then Rp 859ribu/year" under button | × | Two real dates in one sentence | [▸][s6dbe8849] |
| Flo | Reminder setup | "Peace of mind: Check! Create an account to get reminded when your trial is ending. Easy." / "Enable trial reminder" (toggle on) / "2 days before end of trial — You'll get an email reminder." / "Set reminder" | — | × | Reminder needs an account | [▸][se91cde1b] |
| N26 | Multi-reminder | "Get reminders before the trial ends — Cancel anytime before your paid membership starts on August 11, 2025." / "10 days left: First reminder" / "5 days left: Second reminder" / "24 hours left: Last reminder" / "Continue with Standard" / "Try N26 Smart free for 60 days" | "Free for 60 days, then only €4.90/month." | Free option above CTA | **Three reminders** | [▸][se3c08810] |
| Headway | Trial guide | "Free trial guide" / "DAY 7 — Cancel in advance to avoid payment" | None on screen | × | Same tile style as Nibble | [▸][sc550c1aa] |
| Brilliant | Timeline | "How your Premium free trial works" / "In 5 days — Get an email reminder…" / "In 7 days — Your account will be charged; cancel anytime before September 24" | — | × | | [▸][sc5954cee] [▸][s4769fa19] |
| KOHO | Plan details | "Today — We'll upgrade you right away." / "April 15th, 2026 — Your plan renews, and you'll pay $18/month." / "Cancel any time." | "~~$18/month~~ Free trial" | × | Charge row has a real date | [▸][sbb36bc0f] |
| Kitchen Stories | Timeline | "Day 14: Trial ends — Your paid Plus membership starts on **November 4, 2024**" | — | Back | Free / plus switch at the bottom | [▸][s8d0a33c4] |
| pillowtalk | Timeline | "how your 7 day free trial works" / "day 6: trial reminder" / "day 7: trial ends — you'll be charged and your subscription will start." / sticker "save 50%" / "S$ 129.98/year (~$2.50/week)" / "continue" / "view all plans" | Weekly reframe | × | Review card inside timeline | [▸][s2f9bcce8] |
| Stardust | Timeline | "Try Stardust Super for free" / "In 7 days — You'll be charged unless you cancel anytime before" / "Yearly $4.16 per month" · "Monthly $9.98 per month" | **Yearly total missing** | ‹ and × | | [▸][s414bbd15] [▸][sbe08aff0] |
| Google Health | Offer | "Start using your personal coach today" / "Pay nothing until 29 Aug 2026" / "Cancel at any time" / "RM 429.90 billed yearly after a 3-month RM 0 trial" | Yearly total | **Equal "No thanks" and "Try it on us" buttons** | | [▸][sa6a5ec71] |
| Jomo | FAQ paywall | "How is Jomo different? We're two founders who built Jomo in 2022… No investors, no pressure to keep you hooked…" / "Can I trust you with my data?" / "Try FREE for 3 days / then S$ 44.98/year" / "🔔 We'll notify you 24h before your trial ends!" | Yearly in button | Faint "Later" | Founder voice | [▸][s355c903b] |
| Brainly | Limit sheet | "You've used 10 of 10 free questions" / bar "10 total · 0 left this week" / "S$ 14.48/month. Cancel anytime." / "Maybe later" | — | "Maybe later" | Usage-limit paywall, like a 4th reminder | [▸][sba6ce0da] |
| Joi | Features | "Magic input [New] / Daily summary / Reminders sync / Custom alerts / Widgets / iCloud backup [Soon]" (greyed) | S$ 6.98 monthly | — | Labels a future feature honestly | [▸][s919fda8d] |
| Medium | Why it's paid | "Member-only story — The writer chose to paywall this story and earns from Medium's Partner Program when you read." | — | × | Explains who the money goes to | [▸][se15a50db] |

### 1.16 Lifetime presentations

| App | Layout | Exact wording | Ratio | Notes | Link |
|---|---|---|---|---|---|
| timespent | × → founder letter → signature → 3 round stamp buttons | "not ready for a paid tier? that's ok. i'll still keep building for you, and i promise:" / "meaningful free tier" / "no dark patterns — no intrusive pop-ups, no long ass sign-up flow that forces you to subscribe, betting you'll forget to cancel. none of that." / "thanks for your support" / signed "Cal." / "MONTHLY $5.98" · "YEARLY $19.98" · "FOREVER $59.98" | 3.0 | The honest-indie voice Ditch wants | [▸][sb00fa672] |
| Bloom | Timeline → proof → 3 dark columns → button | "Forget to cancel? No problem. Get a full refund, no questions asked." / "MONTHLY $9.99 · $2.49/week · Billed monthly · No trial" / "[Most Popular] YEARLY $59.99 · $1.15/week · Billed yearly · 7-day free trial" / "LIFETIME $99.99 · Billed once · Bloom for life · No trial" / "Change plans or cancel anytime" | **1.67** | Says "No trial" per plan. Refund promise and weekly math are bad (§4) | [▸][sdb6e7f44] |
| The Outsiders | Laurels → 3 tiles → button | "Made by Apple Design Award & App of the Year Winning Team" / "Monthly S$ 7.98" · "[BEST OFFER] Annual S$ 59.98/year" · "Lifetime S$ 99.98 /once" / "Start 1 week Free Trial" | **1.67** | | [▸][s65112b07] |
| Hevy | "Skip" → ✓ list → 3 tiles → button → "Not now" | "PRO MONTHLY $2.99 Billed monthly" · "[SAVE 33%] PRO YEARLY $23.99 Billed annually" · "PRO LIFETIME $74.99 Pay once" / "Subscribe to Yearly plan" / "Not now" / "Cancel your subscription at any time." | 3.1 | CTA names the plan; 33% correct | [▸][s19fce77b] |
| Joi | Back/Skip → headline with inline icons → 3 rows → button | "Monthly — Monthly subscription to Joi S$ 6.98" / "Annual [-52%] S$ 39.98" / "Lifetime — Pay once, use forever S$ 89.98" / "Recurring billing · Cancel any time" | 2.25 | Plain rows | [▸][sf534ccc2] |
| Buddy | Sheet with 3 tiles | "1 MONTH $13.98 · $3.23 / week" · "[SAVE 57%] 12 MONTHS $71.98 · $1.38 / week · 7 days free" · "∞ UNLIMITED $149.98 · One-off" / "Try 7-days for free, then $71.98/year." | 2.1 | Weekly breakdown | [▸][sd81d0d25] |
| FocusFlight | Carousel → 3 tiles (lifetime first) | "Lifetime $33.99 Pay once." · "[-60%] Annually $18.99 US$1.58/mo." · "Monthly $3.99" / "Start 7 days free trial" / "Cancelable at any time." | 1.8 | Faint × and Restore | [▸][s01e0b4d2] |
| Brink+ | 3 tiles → list → sticky bar | "Monthly S$0.98" · "[Best value] Yearly S$9.98" · "Lifetime S$69.98 Billed once" / "Cancel anytime. No commitment." / "Made by a designer" / sticky "Yearly S$9.98 • Billed yearly" + **"Pay S$ 9.98"** | 7.0 | CTA = the exact price | [▸][s94cdf6cd] |
| Plex | Photo → 3 rows | "Monthly Plex Pass $6.98 Most Popular" · "Yearly $57.98 Extra Savings" · "Lifetime Plex Pass $199.98 Pure Dedication" | 3.4 | Playful lifetime label | [▸][s579c0b00] |
| 5 Minute Journal | Expanded plans | "Lifetime — $199.00 · One time payment, yours forever" | 5.0 | | [▸][s7fff754e] |
| Tide Guide | 3 rows + family toggle | "Yearly S$ 28.98 [SAVE 17%] 1 Week Free" · "Lifetime S$ 199.98" / "Share with Family via iCloud Family" / "Already Purchased? [Restore Purchase]" | 6.9 | Badge says 17%; vs 12 × monthly it's 60% | [▸][sac1f26f9] [flow][f5bef40b5] |
| Sunlitt | 3 rows, yearly has a toggle | "Yearly $14.98 /year [BEST VALUE]" + "Not sure? Try 7 days free" (toggle) · "Lifetime $129.98" / "$1.25 per month – Billed yearly" | 8.7 | **Trial toggle** (§4) | [▸][s1be71829] |
| ABY Journal | Plans | "S$ 5.98 / week" · "[58% OFF] 1 week FREE trial S$ 129.98 yearly / just $10.83 monthly" · "[Best deal!] LIFETIME S$ 249.98" | 1.9 | Weekly plan + "just" | [▸][s65f1ef09] |
| pillowtalk | Plan sheet | "lifetime S$149.98 one-time payment, own it forever. your gift for limited time only" | 1.15 | Fake scarcity | [▸][s4139d31a] |
| Orbit | Single sticky card | "Lifetime [Early bird] S$ 24.98" / "Pay once and enjoy forever" | — | Lifetime is the only plan | [▸][s40d3a02c] |

### 1.17 Post-purchase, trial status and "manage subscription"

| App | Purpose | Exact wording | What's notable | Link |
|---|---|---|---|---|
| Structured | Trial started | "Structured Pro — Your free trial ends in 3 days" / "Trial Reminders ✓ Enabled — We'll remind you when your free trial is about to end." / "Your Free Trial — Trial ends on 5/1/26 · Started through App Store · Your free trial ends in 3 days. Unless cancelled 24 hours before, the subscription will start automatically." / "Continue" | **Best model for Ditch's "You're in"** | [▸][s0af9c955] |
| Woolworths | Receipt | "Subscribed! Congratulations! Delivery Unlimited is now active…" / "30 DAY FREE TRIAL 19 May, 2025 - 18 June, 2025" / "MONTHLY PAYMENT AMOUNT $15.00/month (Cancel anytime)" / "FIRST BILLING DATE 18 June, 2025" / "Trial expiry reminder — You'll receive a reminder email…" | Every fact in one card | [▸][s42878139] |
| Plum | Trial started | Card "PREMIUM — Free trial remaining 30 days" / "Your Plum Premium trial has begun" / "Let's do it" | Status as a card | [▸][sc49f2795] |
| 7-Eleven | Trial started | "Success! Welcome to your 30-day free trial… Your benefits are active, so start saving today!" | Generic | [▸][seb69750e] |
| Canva | Plan picker | "Free 14 day trial, cancel anytime" / "We'll remind you before your trial ends" / "Due today S$0" | Shows "due today" | [▸][s37f19e2f] |
| Pillow | Trial status | "Your free trial expires on 29 October 2024. You can cancel the trial 24 hours before it expires." / "Change or cancel subscription" | | [▸][scb1df573] |
| Oportun | Manage plan | "30 day free trial — Ends on July 3, 2026" / "Monthly plan $5.99 per month [Upcoming]" / "Your monthly plan will start after your free trial ends." / "Cancel subscription" → "Subscription canceled. After your plan end date, you will no longer have access… You can restart your subscription at any time." / "Resume subscription" | Shows what comes next | [▸][sb7677589] [flow][fa8db76de] |
| Splitwise | Manage | "Splitwise Pro $6.98/month · Renews Dec 13, 2025" / "Manage your payment info — Go to App Store to make changes ↗" / "Cancel subscription ↗" | Honest about where cancel happens | [▸][sf6f30609] |
| Slopes | Manage | "Current Plan Free Trial (Annual) · Renews June 26, 2026" / "Manage Subscription" | | [▸][s68bd28d4] |
| Lyft | Manage | "[Active] Lyft Pink 1-month trial · Renews Jun 1, 2026 · $9.99/month + tax" / "Cancel plan" | | [▸][s3c6731e6] |
| Blue Apron | Manage | "MONTHLY [CURRENT PLAN] 30-day free trial ($9.99/mo) Trial ends on Aug 26, 2026" / "ANNUAL $99.99/yr ($8.33/mo)" / "Cancel Blue Apron+" | | [▸][s7e066253] |
| Lifesum | Manage | "Current subscription: Monthly subscription · Renews: 15-08-2026" / "What you have access to now:" / big "Cancel subscription" | Cancel is the main button | [▸][sf6acb512] |
| Uber One | Renewal | "Uber One expires in 20 days. Renew to keep saving. You'll be charged $9.99 on Mar 31, 2026 when you renew." / "Money saved $0.00" | Shows real value so far | [▸][s187ba480] |
| Forest | Settings | "you won't be charged if you cancel at least 24 hours before the next renewal date…" / "Restore Purchases · Manage Subscription · FAQ" / "Annual (Early Bird) Next renewal date: 1/15/2027" | | [▸][s66fede2c] |
| Cleo | Plan | "Builder [Active] · Next payment Jun 12, 2026 · $14.99 / month" | | [▸][s664374c7] |
| Notion | Plan | "Plus & Notion AI [Active]" / "Manage plan" | Doodle cat | [▸][sfeb095c4] |
| PlayStation | Manage | "Next payment date: 03/07/2024 · Next payment: SGD120.90" / "If you cancel now, you can still enjoy your subscription until 03/07/2024." | | [flow][ff70919ad] |
| Starling (bank) | Card sub | "This transaction looks like it's a recurring card payment…" / "Show in scheduled payments" / "Cancel subscription" | | [▸][s91f20d3b] |

Not covered: **Things** sells as a one-time App Store purchase, so it has no in-app paywall to study. **Notion** only showed a plan status screen.

---

## 2. Paywall patterns that work, with evidence

### 2.1 Headline types
| Type | Example seen | When it works | Evidence |
|---|---|---|---|
| Their own data | Opal "Sam, Opal will get you back 9 years of your life" | When the number is real | Adapty (Nov 2026): winning personalization tests lifted 13–35% (prior research). Ditch's "all N renewals" is this type and is true. |
| How the trial works | Headspace, Monarch, 5MJ, Brilliant: "How your (free) trial works" | Trial-first paywalls | Blinkist: +23% trial starts, −55% complaints (prior research). |
| Offer | Blinkist "Try Blinkist PRO free for 7 days." / Strava "First month's on us." / Mimo "The first two weeks of Pro are on us" | Simple, but invites the 3.1.2(c) "trial more conspicuous than price" problem | Apple forum rejection, Aug 2026. |
| Outcome | Ladder "Get Results, Without Planning Workouts." | When the outcome is concrete | — |
| Mission / free-first | Finch "Finch is free forever. But we'd love for you to try…" | Freemium apps | — |

**Pick for Ditch:** keep "their own data" as the headline and put the trial in the timeline title. Don't make the trial the headline.

### 2.2 Benefit lists
- Short and concrete wins: Bear lists 7 one-line benefits and adds a joke last ("Look and feel smarter"). Duolingo bolds the noun ("**Unlimited Hearts**").
- Two-line benefits push plans down (Orbit, Finch, Calm). Adapty found visual or text-only tests win on LTV only 34.6% of the time, vs 57–60% for plan count, plan length and trial structure (Adapty, Mar 13 2026). Copy polish matters less than plan structure.
- Free vs Pro tables (Orbit, Duolingo) make the free tier visible. Duolingo's has a "FREE" column with real ✓ marks.
- Honest roadmap: Joi greys out "iCloud backup [Soon]". Ditch must never list Auto-sync as a Pro benefit.

### 2.3 Plan layout
| Pattern | Seen | Note |
|---|---|---|
| Single plan + "All plans" link | Copilot, Blinkist, Finch, Orbit | Fewest choices. Copilot's "All Plans" sits in a link row. |
| Stacked rows, yearly pre-selected | Duolingo, Monarch v3, Cal AI, Calm, Joi | Most common. |
| 2–3 tiles side by side | Monarch v1, Bevel, Hevy, Bloom, Buddy, Outsiders | Fits 3 plans in ~120pt height. |
| Price buttons, no selection | Bear | Fastest; no CTA-state logic. |
| Grouped by trial | Duolingo ("7 DAY FREE TRIAL" / "3 DAY FREE TRIAL"), Calm ("7-Day Free Trial" / "No Free Trial") | Makes clear which plan has a trial. |

**Evidence:** Dark Noise (RevenueCat, 2024): showing all plans as equals raised conversions ~10% but yearly fell 30% and churn rose 57% (prior research). Adapty (Mar 2026): plan-count tests win on LTV 57.1% of the time.

### 2.4 Showing price honestly
- **Apple's rule** (subscriptions page, read Nov 2026): "the amount that will be billed must be the most prominent pricing element in the layout… additional elements should be displayed in a subordinate position and size to the annual price."
- **Good:** Mimo "Try 14 days free, then **$89.99/year** ($7.49/month)"; Monarch "$99.99 / year — $8.33 per month, billed yearly"; Copilot "Then $95 per year of service" with a small "Only $7.92 a month" tab.
- **Breaks it:** Blinkist bold "Only $16.66 / month"; 5MJ "then $3.33 per month (billed annually as $39.99)"; Stardust "Yearly $4.16 per month" with no total; Duolingo "$6.99 / MO" as the big number.
- **Honest anchor for monthly:** Monarch "$14.99 / month — $179.88 per year, billed monthly"; Calm "$19.98/mo. $239.76/yr."
- **Badges must match the math.** Monarch 44% ✓, Hevy 33% ✓, Bear 16% ✓, Bevel 37% ✓. Calm says 56% (real 61.6%). Tide Guide says 17% (real 60%). Ditch's "Save 50%" is true: 12 × $4.99 = $59.88; $29.99 is 49.9% less.

### 2.5 Lifetime presentation
- Third tile or third row, labeled with how it's billed: "Billed once" (Bloom, Brink), "Pay once" (Hevy, FocusFlight), "Pay once, use forever" (Joi).
- Say there's no trial on it: Bloom writes "No trial" under monthly and lifetime.
- Ratios seen: 1.15 to 8.7. Ditch's 1.67 matches Bloom and The Outsiders. Adapty's figure from prior research: typical lifetime ≈ 1.3× annual.
- Revenue share: a secondary write-up of Adapty's 2026 report says lifetime and one-time purchases rose from 6.4% to 10.3% of subscription-app revenue, 2023–2025 (unverified against the report itself).

### 2.6 Trial timelines
| Choice | Options seen | Best for Ditch |
|---|---|---|
| Labels | Relative ("In 12 days", Headspace) · Day number ("DAY 5", Nibble) · Real date ("Mar 31", Blinkist; "Jan 24" chip, Nibble) | **Real weekday + date.** |
| Rows | 3 (most) · 4 with refund row (Finch) · 5 with 3 reminders (N26) | 3 rows. |
| Charge row | Generic "You'll be charged" (Strava v1) · Exact amount + date (Strava bundle "You'll be charged S$ 169.00", KOHO "April 15th, 2026 … $18/month") | **Exact amount + date.** |
| Reminder row | "We'll send you a reminder" (most) · channel named (Blinkist "Email reminder", Flo) · caveat (Cal AI "As long as notifications are enabled") · user picks day (Duolingo, Opal) | Name the channel, handle "off", let them change the day. |
| First row pre-checked | Opal "✓ Get your Focus Diagnosis — You successfully started your journey"; Duolingo stepper | "You've already added N subs" is true for Ditch. |
| Reminder lead time | 1 day (Jomo 24h) · 2 days (Duolingo, Insight Timer, Nibble, Strava, Calm) · 3 days (Duolingo option) · 7 days (Copilot, 1-month trial) | 2 days (locked). |

**Evidence:** Blinkist +23% / −55% complaints (prior). Superwall-hosted "Sunflower" case: +46% trial conversion after adding trial reminders (Stormy AI blog, 2026; vendor-adjacent, weak). Counter-evidence: Stompers (Superwall, Jan 1 2026): a single page beat a multi-page flow that put a trial-reminder screen before pricing, by "over 16%" in conversion.

### 2.7 Social proof
- Common: laurels (Copilot "EDITORS CHOICE", Orbit "Apple Favourites", Monarch press), star counts, one review card.
- Inconsistent proof is a red flag: Opal shows "100,000+ Reviews · 8 Million+ people" on one paywall and "1,500+ Reviews · 200k+ people" on another.
- Honest options with nothing to show yet: founder voice (Jomo "We're two founders…", timespent letter), an FAQ (Copilot "Why isn't Copilot free?"), who the money goes to (Medium).

### 2.8 CTA wording
| Wording | Apps | Note |
|---|---|---|
| "Start (my) free trial" / "Start your 7-day free trial" | Headspace, Strava, Blinkist, Mimo, Nibble | Clear. |
| "Try for $0.00" / "Try For $0" | Duolingo, Calm | Price-forward. |
| "Start my free week" | Duolingo, Brilliant, Insight Timer | Warm. |
| "Continue" | Orbit, Cal AI, Bloom | Hides what happens. |
| "Subscribe to Yearly plan" | Hevy | Names the plan. |
| "Pay S$ 9.98" | Brink+ | Names the exact charge. |
| "CONTINUE - SAVE 50%" | Ladder | Puts a claim in the button. |

Under-button lines that reassure: "No charges yet. Cancel anytime on the App Store." (Mimo), "You won't be charged until Jun 30." (Strava), "✓ No payment due now" (Opal, Bevel), "We'll notify you 24h before your trial ends!" (Jomo). Lazyweb (Jul 2026): only 3.7% of 4,406 paywall CTAs use "cancel anytime"-style copy; no measured lift either way.

### 2.9 Fine print
- Strong: Monarch "Your subscription starts February 8 unless you've canceled during the trial." Copilot "Cancel anytime, for any reason. After the free trial, this subscription automatically renews at the price selected above."
- Apple's sample screen also expects: subscription name, duration, what's included, full renewal price, trial length + post-trial price, restore, Terms and Privacy (Built by Foundry summary of Apple pages, Oct 13 2026).

### 2.10 Close, skip, restore
| Placement | Apps |
|---|---|
| × top right | Orbit, Headspace, Blinkist, Finch (regular), Strava, Bear, Mimo, 5MJ timeline, Opal B, Bevel (top left), Nibble |
| × top left | Duolingo, Calm |
| Text link under CTA | Duolingo "NO THANKS", Hevy "Not now", Brainly "Maybe later", N26 "Continue with Standard" (above CTA) |
| Equal button | Google Health "No thanks" |
| Faint | 5MJ "Skip", Jomo "Later", FocusFlight × |
| None on screen | Rocket Money, Opal A, Monarch, Cal AI (back only), Finch offer, Ladder (tab) |
| Restore | Top left (Opal, 5MJ, FocusFlight) · under timeline (Headspace) · link row (Copilot, Monarch, Cal AI) · bottom of scroll only (Orbit) |

### 2.11 Post-purchase
- Best: Structured (reminder status + trial end date + where it was bought), Woolworths (full receipt), Duolingo (restates the reminder day), Vocabulary manage screen (trial as a 2-step timeline).
- Headspace and 5MJ ask for push **after** purchase ("Remind me" / "Maybe later"). Ditch asks before the paywall (correct, see prior research), so Ditch's post-purchase can show "Reminder on ✓" instead.
- Rocket Money's toast "Trial Reminder Added" is the closest to Ditch's twist.

---

## 3. Competitor teardown

### 3.1 Step by step
| Step | Orbit | Rocket Money | Bobby | Ditch can own |
|---|---|---|---|---|
| Welcome | Pretty orbit of logos. Says "Find your subscriptions" though it can't find anything without your help. | Logo splash, then a goal quiz. | — (not on Mobbin) | Say what it does: track, warn, ditch. No "find". |
| Stat | "$2,000 a year" with a source line. Good that it cites; the number isn't in the C+R summary we have. | "Save up to $768 per year*" with a long footnote. | — | One dated, checkable stat (C+R 2022). |
| Data entry | Tick list with prices, Skip, "None of these". No running total. | Bank link required. Name + email + legal name first. | Manual, 5 free | Tick list with a live total. No account. |
| Reveal | "That's $155.76 a year. How many others are you paying for quietly in the background?" Good bridge. | "We detected 2 subscriptions costing you a total of $121 a year." | — | Reveal + the bridge to import. |
| Notifications | **None in onboarding. Settings later shows "Notifications Off".** | To-do card about a credit report. | Reminders, but the #1 complaint is they don't fire | **Ask with a preview of their own subs.** Reminders are the product. |
| Paywall | Lifetime only, "Early bird", × only. Unsourced "84%" and "$300". | PWYW tiles, default nudged ("Most people pick $10"), no × on screen, date only on the next screen. | Cheap one-time unlocks | Yearly + monthly + lifetime, real dates, visible "Continue free". |
| Trial handling | Free-trial toggle on any sub + a "Free Trials" section on Home. | Separate "Track a Free Trial" flow. Its own Premium shows up in the list after purchase. | — | Same, plus "Ditch Pro trial" shown **on the paywall** before purchase. |
| Import | Strong guides (sharing, iCloud, email search terms). Results gated: "🔒 Upgrade to Add (9)". | Bank sync. | — | Same on-phone import, labeled Pro up front. |
| Cancel | Not covered. | Concierge needs your Amazon password and lets agents pose as you. Also guides. | — | Guides only. No passwords. "We never cancel for you." |
| Manage own sub | — | In-app cancel, change the PWYW fee, renew date shown. | One-time | A Pro screen with trial dates, reminder status, App Store link. |
| Leaving | — | Delete → "Switch to a Free Account" first. | — | Pro lapses → reminders drop to 3, nothing deleted (locked). |

### 3.2 What they do well (copy these)
- Orbit's tick list subtitle: "Typical monthly price, you can edit later." Honest about estimates.
- Orbit's empty-state button: "None of these" instead of a dead "Next".
- Orbit's reveal bridge: "How many others are you paying for quietly in the background?"
- Orbit's import guides: copyable search terms ("Renewal", "Subscription confirmation") and "Open iCloud subscriptions".
- Orbit's Home: free trials as their own section, with the total yearly figure as the headline.
- Rocket Money: its own trial row + "Trial Reminder Added" toast; in-app "Cancel Membership"; downgrade before delete.

### 3.3 What they do badly (avoid)
- Orbit: no notification ask, lifetime-only paywall, × as the only free path, "Early bird" with no end date, unsourced claims, restore buried at the bottom of the scroll.
- Rocket Money: no visible close on the paywall, pre-selected "Most people pick $10", the trial date only on the second screen in fine print, a 10-field onboarding before any value, custom emoji rating row before any Apple prompt.

### 3.4 Gaps Ditch can own
1. **Reminders proven before the ask.** Neither Orbit nor Rocket Money previews a reminder built from your own subs.
2. **The trial on your list, shown before you pay.** Rocket Money only reveals it afterward.
3. **Real dates on the paywall.** Orbit has no trial; Rocket Money hides the date.
4. **Unlimited free tracking.** Orbit caps tracking at 3; Bobby at 5.
5. **A real "Continue free" button.**
6. **No bank, no password, no agents.** Rocket Money's concierge asks for your login.
7. **Three plan shapes.** Orbit sells only lifetime; Rocket Money only monthly.

---

## 4. Rejected tactics (seen in the wild)

| Tactic | Seen in | Why Ditch says no |
|---|---|---|
| Exit / one-time offers | Finch "One-time offer applied… Offer expires when you exit this screen!" ([▸][sdd24134d]); Opal "Not ready for a year?" after × ([▸][s75d53eed]); Blinkist "Would a discount help? 40% OFF" in cancel ([▸][s0ee44212]); Nibble "69% OFF" ([▸][s8add0191]) | Fake urgency; teaches people to close for a deal. Adapty (Mar 2026) even pitches a 24h post-close offer (+10–15% ARPU, expected). Locked out. |
| Strike-through "was" prices | Finch ~~$99.98~~ S$59.98; Opal ~~$99.99/year~~ next to monthly; Calm ~~7-Day~~ 30-Day; KOHO ~~$18/month~~; Ahead "Save ~~40%~~ 50%" ([▸][s71d10c31]) | Our prices never were higher. Apple 3.1.2(a) "trick users… under false pretenses". |
| Trial toggle | Sunlitt "Not sure? Try 7 days free" ([▸][s1be71829]) | Apple rejects under 3.1.2 since mid-Jan 2026 (RevenueCat, Feb 9 + Apr 23 2026). |
| No or faint close | Rocket Money, Opal A, Monarch, Cal AI, Finch offer (none); 5MJ, Jomo, FocusFlight (faint) | Locked: × at full contrast from frame one. |
| Per-month bigger than billed | Blinkist "Only $16.66 / month"; 5MJ; Stardust; Duolingo "$6.99 / MO" | Breaks Apple's "most prominent pricing element" rule; 3.1.2(c) rejection seen Aug 2026. |
| Weekly reframing | Bloom "$1.15/week"; Buddy "$1.38 / week"; Nibble "$0.76/WEEK"; pillowtalk "~$2.50/week" | Makes the price look smaller than it is. Ditch never shows weekly. |
| Unverifiable stats | Orbit "84% more likely to save money", "save $300 a year on average"; Opal "9 years of your life" and two different review counts; Finch "2x more likely"; Buddy "over 2x more likely" | Rule 5 "Never claim". Only dated, sourced stats. |
| "Most popular" with no data | Duolingo, Bloom, Plex (on monthly), Brilliant | We can't know at launch. |
| Default-nudged price | Rocket Money "★ Most people pick $10" pre-selected | Social pressure on a price choice. |
| Refund promises | Finch "Full Refund Anytime!… no questions asked"; Bloom "Get a full refund, no questions asked" | Apple decides App Store refunds. We can't promise one. |
| Fake scarcity on lifetime | pillowtalk "your gift for limited time only"; Orbit "Early bird" with no end date | If we stop selling lifetime (DECISIONS 6b), we just stop. No countdown, no "early bird". |
| Labor-illusion loaders | Opal "Preparing report...", Rocket Money "This can take up to 30 seconds" | Our total is a sum. |
| Guilt in cancel | Blinkist "Sam is learning with you… Keep for us both" | Cancel happens in iOS Settings; our guide just links there. |
| Custom rating gate | Rocket Money emoji row "HOW ARE YOU LIKING ROCKET MONEY?" ([▸][s3b479401]) | Apple 5.6.1: system prompt only. |
| Commitment gimmicks | Opal "👊 Let's Do It" fist bump | No evidence for a utility app. |
| Credentials to cancel | Rocket Money concierge asks for your Amazon password | Rule 5: "We cancel for you" is banned. |
| Hidden free path | Finch "See my FREE offer" with no skip; Cal AI hard paywall | Locked: "Continue free". |

Law context: the FTC's click-to-cancel rule was vacated by the Eighth Circuit on July 8, 2025; the FTC restarted with an ANPRM (2026) and still enforces ROSCA. State auto-renewal laws (California, Colorado, New York) still apply (law-firm summaries, Feb–Apr 2026).

---

## 5. Apply to Ditch

Example dates: install **Mon, Nov 9, 2026**. Reminder **Sat, Nov 14**. Charge **Mon, Nov 16**. User ticked 6 subs.

### 5.1 What to keep from the built paywall
- × top left, RESTORE top right, both from the first frame (matches Duolingo/Calm close side, Opal/5MJ restore side).
- Personalized headline and FREE/PRO logo row.
- CTA changes per plan; timeline only for trial-eligible yearly.
- Reminders-off handling with "Open Settings" (Calm does the same).
- Lifetime line from DECISIONS 6b.
- "Continue free: 3 reminders" as a full-width secondary button (Google Health, N26 show this is normal).

### 5.2 What to change, most important first
| # | Change | Why (evidence) |
|---|---|---|
| D1 | **Fit plans + timeline above the fold.** Shrink the raccoon to ~96pt and tuck it beside the headline; put benefits after the timeline as one compact list. | In the mock, the yearly card is cut at the fold and the timeline is fully below. Headspace, Monarch, Mimo show the timeline without a scroll. |
| D2 | **Monthly row shows its yearly cost**: "$4.99 a month · $59.88 a year". | Monarch, Calm. Makes "Save 50%" provable on screen. |
| D3 | **Yearly row: billed amount biggest.** "$29.99 a year" big; "about $2.50 a month" small. Keep "Save 50%". | Apple subscriptions page rule. |
| D4 | **Lifetime row says "Billed once · No trial".** Keep the 6b sentence under it, always visible. | Bloom labels "No trial" per plan. |
| D5 | **Timeline: exact amount in the charge row** ("$29.99 charged") and a **tappable reminder date chip** ("Sat, Nov 14 ▾" → 1, 2 or 3 days before). | Strava bundle shows the exact charge. Duolingo/Opal let users pick. A chip avoids Duolingo's extra disabled-button step. |
| D6 | **Show "Ditch Pro trial" as a mini list row inside the timeline's middle step**, same style as rows on Home. | Rocket Money proves people get it; showing it before purchase is our gap. |
| D7 | **CTA states per plan** (§5.6). | Hevy names the plan; Brink names the exact price. |
| D8 | **Founder line** at the bottom, only if true: "Made by one person. No ads. Your list stays on your phone." | Jomo, timespent, Copilot FAQ. |
| D9 | **Post-purchase "You're in" screen** as a receipt (§5.7). | Structured, Woolworths. |
| D10 | **Settings → Ditch Pro** screen with the trial as a 2-step timeline and a link to Apple's manage page. | Vocabulary, Oportun, Splitwise; Apple says "always make it easy for people to access the system-provided management UI". |

### 5.3 Layout (top → bottom)
1. **Top bar** (52pt): × (44pt, full contrast) left · "Restore" right.
2. **Header** (~110pt): raccoon 96pt left, headline right (2 lines).
3. **Logo row** (~56pt): their logos, first 3 "FREE", rest "PRO". Caption: "Free covers 3 of your 6. Pro covers all 6."
4. **Plans** (~170pt): Yearly card (taller, selected) · Monthly row · Lifetime row.
5. **Timeline card** (~170pt, yearly + eligible only): 3 rows.
6. *Scroll area:* "What's in Pro" (4 one-line rows) · lifetime note · founder line · Terms · Privacy.
7. **Sticky footer**: CTA · one line under it · "Continue free: 3 reminders".

On a 6.1" iPhone, items 1–5 plus the footer should fit; on an iPhone SE the timeline may need a short scroll. Check both (prior research P-list).

### 5.4 Copy options (score /10, ★ = pick)

**Headline (more than 3 ticked)**
| Option | Score | Note |
|---|---|---|
| ★ "Get a heads-up before all 6 renewals." | 9 | Locked. Their number, plain promise. |
| "6 renewals. I'll warn you about every one." | 7.5 | Raccoon voice; "every" over-promises if reminders get turned off. |
| "Pro watches all 6. Free watches 3." | 7 | Clear trade, but sounds like a pitch. |

**Headline (3 or fewer)**
| Option | Score | Note |
|---|---|---|
| ★ "Add the rest from a screenshot." | 8 | True: import is the Pro thing they need (prior pick). |
| "Got more than 3? Pro covers them all." | 7.5 | Honest, a bit salesy. |
| "Reminders on everything, plus import and backup." | 7 | A list, not a headline. |

**Timeline card title**
| Option | Score | Note |
|---|---|---|
| ★ "How your free week works" | 8.5 | Built; warm; standard pattern. |
| "Your free week, day by day" | 7.5 | Fine. |
| "What happens next" | 7 | Vague. |

**Timeline rows** (yearly, reminders on)
- Today · Mon, Nov 9 — "Pro is on. $0 today."
- Sat, Nov 14 ▾ — "I remind you." + mini row: logo · "Ditch Pro trial · $29.99 · Mon, Nov 16"
- Mon, Nov 16 — "$29.99 charged, unless you cancel before."
- Small print: "Cancel at least 24 hours before, in Settings → your name → Subscriptions."

Reminders off: middle row becomes "Turn on reminders so I can warn you" + "Open Settings" (built).

**Line under the CTA (yearly, eligible)**
| Option | Score | Note |
|---|---|---|
| ★ "$0 today. Then $29.99 a year from Mon, Nov 16." | 9 | Price and date in one line, body size. Fixes the 3.1.2(c) risk. |
| "Then $29.99 a year from Mon, Nov 16. No need to cancel today, I'll remind you Sat, Nov 14." | 8 | Built. Strong, but two lines in a crowded footer; the timeline already says the reminder. |
| "No charge until Mon, Nov 16." | 6.5 | Missing the amount. |

**Yearly badge**
| Option | Score |
|---|---|
| ★ "Save 50%" | 8 (true; prove it with the monthly row's "$59.88 a year") |
| "Best value" | 7 |
| "Most popular" | 2 (unknown at launch) |

**Lifetime row label**
| Option | Score | Note |
|---|---|---|
| ★ "Lifetime · $49.99 · Billed once · No trial" | 8.5 | Plain facts (Bloom/Brink style). |
| "Pay once, keep Pro" | 7.5 | Nice, less exact. |
| "Forever" | 6 | timespent's word; too cute next to the 6b caveat. |

**Founder line (only if true)**
| Option | Score |
|---|---|
| ★ "Made by one person. No ads. Your list stays on your phone." | 8 |
| "Why does Pro cost money? It pays for the app. No ads, no data sold." | 7.5 |
| "Thanks for backing a one-person app." | 7 |

### 5.5 Plan card design
| Card | Line 1 (big) | Line 2 (small) | Right side | Badge |
|---|---|---|---|---|
| Yearly (selected, taller) | "Yearly" | "7 days free · about $2.50 a month" | "**$29.99**/yr" | "Save 50%" (lime, small) |
| Monthly | "Monthly" | "$59.88 a year" | "**$4.99**/mo" | — |
| Lifetime | "Lifetime" | "Billed once · No trial" | "**$49.99**" | — |

- Radio + 2pt teal border + light fill for selected (built style).
- Tabular figures for prices. Never show $2.50 bigger than $29.99.
- Not trial-eligible: yearly line 2 becomes "about $2.50 a month"; no "7 days free".

### 5.6 CTA states
| State | CTA | Line under | Timeline |
|---|---|---|---|
| Yearly, eligible | "Start 7-day free trial" (8.5) — alt "Try Pro free for 7 days" (8) | "$0 today. Then $29.99 a year from Mon, Nov 16." | Shown |
| Yearly, not eligible | "Subscribe · $29.99 a year" | "Renews yearly. Cancel anytime in Settings." | Hidden |
| Monthly | "Subscribe · $4.99 a month" | "Renews monthly. Cancel anytime in Settings." | Hidden |
| Lifetime | "Buy once · $49.99" | "One payment. No renewal." | Hidden |
| Purchasing | Spinner in button, label "Talking to Apple…" (Bear's "Contacting Apple…") | Same | Same |
| Failed / cancelled sheet | Back to normal, no message if user cancelled; "That didn't go through. Try again?" on error | — | — |

The secondary button is always "Continue free: 3 reminders" (more than 3 ticked) or "Continue free".

### 5.7 Post-purchase screen ("You're in")
Layout: raccoon (thumbs up) → headline → receipt card → mini list → buttons.

| Part | Copy |
|---|---|
| Headline ★ (8.5) | "Pro is on. Your trial is in your list." — alt "You're all set." (7), "Welcome to Ditch Pro!" (6) |
| Receipt card | "Free until Mon, Nov 16" · "Then $29.99 a year" · "Reminder: Sat, Nov 14 ✓ On" · "Bought through the App Store" (Structured + Woolworths) |
| Mini list | Their list with the new row sliding in: "Ditch Pro trial · $29.99 · Mon, Nov 16" |
| Body | "All 6 now get reminders. I'll warn you about this one too." |
| Main button | "Go to my list" |
| Secondary | "Got more? Add them from a screenshot." |
| Reminders off | Receipt line becomes "Reminder: off · Turn on" (button opens Settings) |
| Lifetime | Headline "Pro is yours for good." · card "Paid once · $49.99" · no trial row |
| Monthly | Card "Renews Wed, Dec 9 · $4.99 a month" · no trial row |

No confetti (save it for "Ditched!").

### 5.8 Settings → Ditch Pro
- Status: "Ditch Pro · Free trial" / "Started Mon, Nov 9 → Charges Mon, Nov 16" (Vocabulary's 2-step timeline).
- "Reminder Sat, Nov 14 ✓" with a link to the trial row.
- "Manage in the App Store" (opens Apple's manage sheet; Splitwise is honest that this is where cancel happens).
- Lifetime upsell for yearly users: "Buy lifetime · $49.99" (Tide Guide does this).
- After cancel: "Pro ends Mon, Nov 16. You won't be charged. Reminders drop back to 3 after that." (Blinkist's after-cancel state).

### 5.9 Notes for the other onboarding screens
- **Welcome:** don't say "find" (Orbit does, and can't). Keep "Track, get warned, ditch".
- **Tick:** steal Orbit's subtitle ("Typical monthly price, you can edit later.") and "None of these" as the button label when nothing is ticked. Keep our live total; Orbit lacks it.
- **Reveal:** add a bridge line under the number, Orbit style: "Got more hiding? Add them later from a screenshot." (7.5) — or keep "Let's fix that" (8). Owner's call.
- **Reminders pre-prompt:** consider Bevel's lock-screen mock with *their* banners (already planned). Use the same wording the real reminder will use.
- **Paywall order:** stay one page. Stompers (Jan 2026) beat a multi-page flow with a reminder screen by 16%+; our Reminders step already does the warm-up.
- **Import ("Find more" on Home):** Orbit shows results then gates with "🔒 Upgrade to Add (9)". If Ditch does the same, label the entry "Pro" before the scan so it isn't a surprise. Open question for the owner: let free users import once as a taste?
- **4th reminder tap (free user):** use a Brainly-style sheet: "3 of 3 reminders used" with a bar, "Swap one" (primary for free users) and "Get Pro". Never block tracking.
- **Trials as a sub type:** both competitors treat trials as first-class (Orbit "Free Trials" section; Rocket Money "Track a Free Trial"). Make sure Ditch's add flow has it, since our own trial row depends on it.

---

## 6. References

### 6.1 Mobbin screens and flows (all looked at)

- **Orbit:** [Welcome](https://mobbin.com/screens/0ad95c82-1dd1-4c8e-9100-4615486bf514?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["$2,000" stat](https://mobbin.com/screens/0aefbc5b-663c-4384-9fae-7378badec476?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Tick list](https://mobbin.com/screens/592b68fc-549e-4df6-9d80-bc55b9914e1a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Tick list scrolled](https://mobbin.com/screens/a759f7af-d765-4ebd-acaa-43018378b1c9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Tick list, one ticked](https://mobbin.com/screens/deac87fe-f7ef-4452-8deb-f233aada237f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["That's $155.76 a year"](https://mobbin.com/screens/c49f7e84-d043-49a6-9b03-404e98ee6426?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Onboarding paywall (lifetime only)](https://mobbin.com/screens/40d3a02c-2503-4cc1-b940-518ebc20f189?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Paywall, "Unlock all features"](https://mobbin.com/screens/521769df-d360-452b-baf3-e6329b58a842?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Paywall, Free vs Plus table](https://mobbin.com/screens/05b8e0fa-1f61-43d7-a9f0-c77506ce6377?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Paywall bottom (Restore, Terms)](https://mobbin.com/screens/2553cf9e-e681-4e4e-b81c-06b6bbc3d665?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Empty home](https://mobbin.com/screens/ccee144c-65ce-4813-8876-2b4f67017a63?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Home with subs](https://mobbin.com/screens/79551e51-5fce-4789-b599-15ec83d3961b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Home group menu](https://mobbin.com/screens/499ecfb2-4ecc-4446-9aa9-2f12c458d123?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Get started guide](https://mobbin.com/screens/13f0e2b8-5ba1-48b1-88ec-d023b7740863?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Set up Sharing](https://mobbin.com/screens/f697f2a7-a980-4675-a9e7-caf437fbc897?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [iCloud import guide](https://mobbin.com/screens/9525457d-4d73-4e36-ad50-6b908138a8b1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Email search guide](https://mobbin.com/screens/e51aeb7f-9145-4af9-b72e-64dd0852d74e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Copied to clipboard"](https://mobbin.com/screens/143d819c-dc6a-41c6-9451-54e408bbbb1b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Add subscription sheet](https://mobbin.com/screens/5702f396-80eb-4f99-845a-7f64a28d4962?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Add form (custom)](https://mobbin.com/screens/aa09c6a8-1f87-49fa-b0f9-d44c7fb2942d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Add form (Spotify)](https://mobbin.com/screens/1c6bea40-9f76-488b-a6a8-4ec39eead7cd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Add form (icon)](https://mobbin.com/screens/8dcaf769-aefb-4fc3-bdf9-2f2cc0908db6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Add form, notes](https://mobbin.com/screens/f12defd2-64bf-4cee-8cc9-0720675cbffb?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Import results, "Upgrade to Add (9)"](https://mobbin.com/screens/d864c477-0206-47bc-aa27-f9d963b5e843?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Settings](https://mobbin.com/screens/8e57188c-e629-4b34-9aa8-2e7e9ae94622?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Calendar](https://mobbin.com/screens/954dab6c-e3ed-4104-aae0-e5039bd5012f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Onboarding flow (flow)](https://mobbin.com/flows/340b7fb6-8b5d-416c-9f9f-501a27d669bc?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Get started flow (flow)](https://mobbin.com/flows/6b941627-b728-4443-a947-985a27be4b63?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Subscriptions flow (flow)](https://mobbin.com/flows/e0d2902c-4de8-4584-856f-c2972b802519?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Adding a subscription flow (flow)](https://mobbin.com/flows/78e8655b-afa5-43db-ab32-42b53002a748?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Rocket Money:** [Paywall (pay what you think is fair)](https://mobbin.com/screens/50401be4-6845-434a-989c-153bf925170f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Paywall scrolled](https://mobbin.com/screens/db7e5d7d-bf6c-4e34-8f42-d5a8ba2105f5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Paywall bottom (ratings, footnote)](https://mobbin.com/screens/f1e40472-8469-4dbd-992f-7c768766f3f5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Fantastic!" authorization](https://mobbin.com/screens/1137fa1a-5548-440a-8f06-0a52032a713a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Processing your premium membership"](https://mobbin.com/screens/2fb93a76-3c62-45b5-909a-f342e9a4c653?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Recurring, "Trial Reminder Added"](https://mobbin.com/screens/01d9cc58-851a-4e29-9b1b-a6f0bef3b85d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Calendar day with RM Premium](https://mobbin.com/screens/6eaf1f66-8809-46bd-a6ec-b379586a5418?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["You're Premium"](https://mobbin.com/screens/68a06a26-0750-4fd7-8e84-ac86bb127d38?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Premium feature list](https://mobbin.com/screens/6ac66e8d-7cd5-48f4-9a58-f4f2e3c450ba?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Manage membership](https://mobbin.com/screens/5506dc22-dad3-4e4f-8977-5c1d85a6d2dd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Referral](https://mobbin.com/screens/a70b4ae3-0f10-4375-9f24-7238107ee442?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Track a Free Trial (empty)](https://mobbin.com/screens/bec00605-5470-4f16-bc9e-9b410a1c5cde?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Track a Free Trial (autocomplete)](https://mobbin.com/screens/d84d8f69-931b-4b65-8a6e-82052bf8b385?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Track a Free Trial (filled)](https://mobbin.com/screens/3577e8cc-8a93-4935-a3dd-52e5c694db92?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Trial date picker](https://mobbin.com/screens/07aab661-7b9f-42c6-8cb2-920f995de76a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Choose a subscription](https://mobbin.com/screens/c57d146f-d81c-463a-a89f-c6b0e0d42249?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Save up to $378 a year"](https://mobbin.com/screens/f6a479d0-e3de-413c-a8aa-8e817ceac949?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Do you consider any of these to be bills?"](https://mobbin.com/screens/117ead1a-efe1-445f-8ec1-781907699330?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Subscription overview](https://mobbin.com/screens/301a0b9c-d67a-4a7b-b154-23a57f864940?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Discover unwanted subscriptions"](https://mobbin.com/screens/40fe4679-76a4-40ab-aaa3-45d537486173?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Cancel Amazon Prime](https://mobbin.com/screens/3bc03e0a-dc4d-41cb-be4d-123fb65c3a79?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Concierge asks for login](https://mobbin.com/screens/2a04ea4f-4c76-483a-98c2-2a58b63764ff?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["We're on it!"](https://mobbin.com/screens/b8bd90c5-cf3b-44fd-a1b3-6e6e49a00a1b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Recurring bottom](https://mobbin.com/screens/932d9fb9-1ac1-4dfa-9b5a-127999295b69?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Emoji rating row](https://mobbin.com/screens/3b479401-25db-4ce6-8207-f28a46c981cd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Recurring All](https://mobbin.com/screens/5aa3e934-65e2-482a-ad39-b61ab22f5855?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Delete account → downgrade](https://mobbin.com/screens/1934eab1-59e1-4cd9-abd6-4a9dcd614338?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Add bill / Track a Free Trial sheet](https://mobbin.com/screens/acd7fd86-d95d-44c0-80d2-1011c75a602f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Onboarding flow (flow)](https://mobbin.com/flows/fed2772b-6edd-432f-b195-0691f2d84d04?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Setting up account flow (flow)](https://mobbin.com/flows/c039b598-adfb-4216-9e7b-2fc896fd1a8b?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Subscribing flow (flow)](https://mobbin.com/flows/7baec4d3-c65a-4f49-ae8b-8aad04a2d06a?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Setting up commitment flow (flow)](https://mobbin.com/flows/45887c47-fde8-4af6-aa98-9bf992a51669?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Duolingo:** ["Skip ads with a 7 day free trial"](https://mobbin.com/screens/97e9b0dc-f653-4422-96e8-53650ff9accd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Super vs "Learn for free"](https://mobbin.com/screens/eade4735-8f46-4659-bc9e-2e93d306019e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["When should we remind you?"](https://mobbin.com/screens/dffccfd7-c78a-4964-b31a-49d052b1e176?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Reminder picked](https://mobbin.com/screens/97ef7575-6542-4c87-af8a-91237d9d1bb8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Your 7-day free trial has started!"](https://mobbin.com/screens/98836c8b-4166-4dc6-878e-ee8558048d90?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Manage Subscription](https://mobbin.com/screens/e937c8a3-ccda-4319-a684-5107b0689fe8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Max plan picker](https://mobbin.com/screens/9bbb4867-3bc1-4b86-981c-c51c038a3903?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Max comparison](https://mobbin.com/screens/d383e614-83f8-430e-907d-5e91461aa7c9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Benefits + "Try for $0.00"](https://mobbin.com/screens/bb7d6e68-6ec5-4bbf-abbc-b59e1389c10b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Trial will end in 4 days"](https://mobbin.com/screens/a3e467db-f7e3-4d4e-9eea-11c639c2e32a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Energy (in-context upsell)](https://mobbin.com/screens/d6a2c6fe-f807-4485-b505-7778c7b59847?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Why are you canceling Super?"](https://mobbin.com/screens/f395f96c-bce1-4424-80ea-1923015c7ec9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Gift, "No auto-renewal"](https://mobbin.com/screens/efc1b751-d8c1-4ad1-be27-1a13b1d46025?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Max trial started](https://mobbin.com/screens/1a40c1b8-449c-488c-9479-a47e2d4f9d78?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Subscribing to Super flow (19) (flow)](https://mobbin.com/flows/c71bfa5f-4aab-488b-a2af-d5276353a736?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Subscribing to Duolingo Super flow (24) (flow)](https://mobbin.com/flows/53299ac2-ebb2-494b-afc8-b3b574457622?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Super flow (flow)](https://mobbin.com/flows/06aa7cd2-7316-4bc0-9e26-1a50ece280d5?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Finch:** [One-time offer trial timeline](https://mobbin.com/screens/dd24134d-f4c8-404a-8b9a-a16fa9d6be98?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["You're all set" over offer](https://mobbin.com/screens/f58ab869-a56d-4d44-bba4-9c41158451b3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Plus paywall](https://mobbin.com/screens/0525a643-772d-4665-b5fc-b0d7d10a3a3a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Choose a plan sheet](https://mobbin.com/screens/981c04ab-3348-492a-b506-7e456db8b1ae?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Monthly selected](https://mobbin.com/screens/11ec5a8d-7a51-4e18-b70c-9d2da2a0e59a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Free preview is live](https://mobbin.com/screens/fbfb220d-665b-4d16-985b-767d65e398a4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Free preview ended](https://mobbin.com/screens/fa147bb8-a2bb-4c99-bf87-00f28bc44e15?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Become a Guardian](https://mobbin.com/screens/5476a849-e09a-437e-b4c8-c39260617658?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Subscribing to Finch Plus flow (flow)](https://mobbin.com/flows/352a16af-ee34-4cff-8274-936a6d643fdc?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Choose a subscription plan flow (flow)](https://mobbin.com/flows/a20f4c9b-cc45-4346-9baf-4e8846b5f470?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Free preview flow (flow)](https://mobbin.com/flows/d8578ebe-5d78-45e4-9b88-e653e2665e5d?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Headspace:** ["How your trial works" (annual)](https://mobbin.com/screens/a9bf58c3-250a-4565-9808-c4722933ea54?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["How your trial works" (monthly)](https://mobbin.com/screens/f807e12e-39f7-4672-a6ca-b1a4caca3b5c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [App Store sheet](https://mobbin.com/screens/eafc7a2d-5606-45d3-8322-634334b9214e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Your 14 day trial has started"](https://mobbin.com/screens/66e6952c-8999-4997-903d-514d9e6fbb4c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Manage subscription](https://mobbin.com/screens/ab864429-6dbb-4259-b2ca-48debdc4a81b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Onboarding flow (flow)](https://mobbin.com/flows/31b21791-dec6-448a-8253-648f5ebbba3e?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Subscribing flow (flow)](https://mobbin.com/flows/ccf14439-4c45-4d56-b031-45173490cafe?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Calm:** [Premium tab paywall](https://mobbin.com/screens/d3a2e8d0-30b8-461f-8941-093453cc209a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["~~7-Day~~ 30-Day" guest pass](https://mobbin.com/screens/aa50356b-4550-462e-86bf-bf93cb19f85d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Onboarding flow (ends in paywall) (flow)](https://mobbin.com/flows/38549b00-2fe8-4fd1-914b-13c4905db245?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Calm Premium flow (flow)](https://mobbin.com/flows/66841373-6f71-4920-9432-531ffad47076?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Blinkist:** ["Try Blinkist PRO free for 7 days"](https://mobbin.com/screens/1c74c6aa-ae67-4bdf-811f-9019e3ad8564?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Your 7-day trial has started!"](https://mobbin.com/screens/0b792ef8-7177-4ed3-81f2-f7cc63f4c0fe?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Settings, "Cancel free trial"](https://mobbin.com/screens/421f73ef-efa7-4a02-92f4-2fea162e16d4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Sorry to see you go"](https://mobbin.com/screens/23bce2b9-c92d-4d98-b920-42f432ea3eef?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Sam is learning with you"](https://mobbin.com/screens/a07cf4e2-7d74-4b2d-a1e3-3bb27800b15d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Would a discount help?"](https://mobbin.com/screens/0ee44212-8ee5-4d4b-9c04-c44cff089393?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Onboarding flow (flow)](https://mobbin.com/flows/a9e95e3d-961b-422b-b217-d3fe6fe34e0f?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Canceling free trial flow (flow)](https://mobbin.com/flows/e1955af2-75c9-4a0b-ab51-ab1510e4c549?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Opal:** ["Opal will get you back 9 years"](https://mobbin.com/screens/e21e4d00-1d89-488b-bde6-4882ccc5749c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Before/After paywall](https://mobbin.com/screens/f874f93b-8ef4-408a-bd23-101d703c2ae1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Design Your Trial Experience"](https://mobbin.com/screens/a20e0bb1-4df0-4275-83b6-7b2ec095cdf9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Paywall scrolled](https://mobbin.com/screens/2b025166-9404-4108-986a-c6a507884518?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Exit offer "Not ready for a year?"](https://mobbin.com/screens/75d53eed-31bf-4fb6-99f1-c9e00d7b912a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [App Store sheet](https://mobbin.com/screens/b41b47ab-b6ba-4f21-9e45-14960b8df6b2?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Settings, free plan](https://mobbin.com/screens/ca8fff07-00d7-4340-9796-1eb8daa4112a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Your Pro Benefits](https://mobbin.com/screens/dde0aab2-6fe9-47d3-9698-c78534e3a906?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Onboarding flow (flow)](https://mobbin.com/flows/7b6dc8e9-56e3-4db3-a898-cfdddc9b1e8a?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Completing account setup flow (flow)](https://mobbin.com/flows/79ce4841-55da-4728-9ea4-29b3b162ba02?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Copilot:** ["Claim your free trial"](https://mobbin.com/screens/b6ba77c0-7d8f-423e-8453-9db2a97f8035?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Paywall FAQ](https://mobbin.com/screens/008d84bc-3e1e-4b7b-a4d6-616e19c3c3e6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Not trial-eligible state](https://mobbin.com/screens/74fe23bf-1ce8-4dd2-b8ef-e639daf9b0df?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [App Store sheet](https://mobbin.com/screens/2998f38f-b1e0-4540-b408-083df447729d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Manage your subscription](https://mobbin.com/screens/7ab7b855-11c1-4aef-a9fe-3fe64fcfe259?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Gift Copilot](https://mobbin.com/screens/9253b243-88e6-47a6-b607-b93517d22d1b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Recurrings grid](https://mobbin.com/screens/2b94e085-ab6f-4794-b898-f52a065e4c91?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Monarch:** [Paywall v1 (Business Insider)](https://mobbin.com/screens/648acdda-e963-4f0d-b98d-e32dca5ccdd8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Paywall v2 (4.8 stars)](https://mobbin.com/screens/5444ac68-4dd7-4569-a3c5-4667ef2d66ad?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [App Store sheet](https://mobbin.com/screens/7e92d605-a811-4473-bbf3-81636fe88066?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Paywall v3 (web discount link)](https://mobbin.com/screens/f4f97ca0-8e85-4609-8f21-c5c9902171d4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Sidebar "Free trial 7 days left"](https://mobbin.com/screens/a50e61eb-ab7f-420e-9607-03b92db84ec1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Strava:** ["First month's on us"](https://mobbin.com/screens/9851d751-4b71-4a29-ac49-29a155e3dbe4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Strava + Runna plans](https://mobbin.com/screens/55cdf1b4-a36a-4ee3-8981-7b50f38951e3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Runna paywall scrolled](https://mobbin.com/screens/708c082e-03cc-44ca-9876-4ec9b32c3869?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [30-day timeline with charge](https://mobbin.com/screens/40d104f8-8f25-4ae3-90eb-373e30e35acd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["There's so much more" sheet](https://mobbin.com/screens/7bb88f5d-cae1-4400-9e4d-8d159097644f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Subscription hub](https://mobbin.com/screens/a65d3bf6-2111-49d9-b3db-f035a7b35e8e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Membership (renews)](https://mobbin.com/screens/beccd794-33de-4e56-82c9-c4bf404d781b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Membership (canceled)](https://mobbin.com/screens/b05a266e-a1dc-4343-bea0-79169f5fdf7f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Cancel flow](https://mobbin.com/screens/94178124-98a0-4282-88c4-eb65c8e5de01?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Cal AI:** ["We want you to try Cal AI for free"](https://mobbin.com/screens/b38ea1cf-1eba-47f5-99b2-27e11ba842e8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["We'll send a reminder"](https://mobbin.com/screens/ca622b90-453e-40d0-b981-7fbdc7ec41dd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Start your 3-day FREE trial to continue"](https://mobbin.com/screens/b730224e-cacd-450a-98b4-74cb2be349e7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Family plan](https://mobbin.com/screens/499d50fd-ea92-4e16-9c24-21c78f3b92ba?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Ladder:** [Upgrade tab paywall](https://mobbin.com/screens/d67cb7a1-a18f-4deb-aa87-3ac00916e913?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Settings upgrade banner](https://mobbin.com/screens/d5705369-7a8d-4cf8-bccc-59f5996fd8a5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Bear:** [Pro paywall](https://mobbin.com/screens/8a228d8b-b9cb-42ac-9683-a972387950e3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Contacting Apple…" / all set](https://mobbin.com/screens/8210e912-9049-49f2-bd38-7c7ed8581c3b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["You're a PRO"](https://mobbin.com/screens/80d40725-dc80-47ba-bad0-f1fbceaba6ed?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **5 Minute Journal:** ["Try 3 Days"](https://mobbin.com/screens/c5de87f4-a628-4e77-a937-6ddda93aadb4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Timeline paywall](https://mobbin.com/screens/0b03c06a-63c8-43dd-87ed-58fecc57f0a1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Plans expanded (lifetime)](https://mobbin.com/screens/7fff754e-0548-4edf-bcb4-e6693302e99b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["Your trial has started" modal](https://mobbin.com/screens/a40086d6-f7f8-43f0-af8f-6c9f0987064d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Nibble:** ["Free trial guide"](https://mobbin.com/screens/e722f5a0-b638-4060-86cc-2a05426b3f17?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["We'll remind you 2 days before"](https://mobbin.com/screens/fb296b02-4eb7-4ecd-926a-077cd88c30b8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Price page](https://mobbin.com/screens/95725ce5-ccaa-4feb-b9e0-0429ed293280?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["69% OFF" offer](https://mobbin.com/screens/8add0191-e507-4d67-a1e6-c2a4f42e3227?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Mimo:** ["The first two weeks of Pro are on us"](https://mobbin.com/screens/e257555e-bd98-4163-b095-198a8c58473b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Vocabulary:** [Manage subscription (trial timeline)](https://mobbin.com/screens/8775ef63-9c42-4fc9-b7ca-474132af5fdd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Bevel:** [Paywall](https://mobbin.com/screens/87ac5af9-7c7a-46b8-8a82-ad8c90bf574c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Lock-screen reminder preview](https://mobbin.com/screens/4e61701e-2514-4dc9-b6a8-a7c1e9e187e7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Insight Timer:** ["We'll remind you 2 days before"](https://mobbin.com/screens/6dbe8849-58b3-44ff-a86e-eb56b2c48e9f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Flo:** ["Peace of mind: Check!"](https://mobbin.com/screens/e91cde1b-542d-4989-8921-596ccb2a07c7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **N26:** [Three trial reminders](https://mobbin.com/screens/e3c08810-b4c7-46c1-9a3f-d98ed02c910a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Headway:** ["Free trial guide"](https://mobbin.com/screens/c550c1aa-b7d4-4b06-b4f3-ef448c07419f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Brilliant:** ["How your Premium free trial works"](https://mobbin.com/screens/c5954cee-b3b0-4d32-a959-bbd9907c5785?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Plan picker](https://mobbin.com/screens/4769fa19-5abe-4bd9-8b9e-e1260ace9d56?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **KOHO:** [New plan details](https://mobbin.com/screens/bb36bc0f-428c-4b09-8200-38bac562631e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **pillowtalk:** [Trial timeline + "~$2.50/week"](https://mobbin.com/screens/2f9bcce8-e4bd-4cf1-9027-3b8f44eb4ca6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ["lifetime… limited time only"](https://mobbin.com/screens/4139d31a-e861-4982-b075-7e8d5ffd1468?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Stardust:** [Trial paywall](https://mobbin.com/screens/414bbd15-0f01-4af3-a325-4d08448d746d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Reminder promise](https://mobbin.com/screens/be08aff0-553d-4a78-8f55-c0eee9ffe1e4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Google Health:** ["No thanks" = "Try it on us"](https://mobbin.com/screens/a6a5ec71-199a-477c-b4c4-a3d351d06418?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Jomo:** [Founders FAQ](https://mobbin.com/screens/355c903b-4580-4f82-bd8f-0c46195fa434?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Kitchen Stories:** [Timeline with real date](https://mobbin.com/screens/8d0a33c4-54d1-406d-b502-7cf17b997e91?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Brainly:** ["You've used 10 of 10"](https://mobbin.com/screens/ba6ce0da-0545-485c-8138-fbe1f51bd414?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Joi:** [Feature list with "Soon"](https://mobbin.com/screens/919fda8d-1b21-4645-af65-187100030337?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Monthly / Annual / Lifetime](https://mobbin.com/screens/f534ccc2-5c15-4ef1-b50c-b823dd786fa6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Medium:** ["Member-only story" explains why](https://mobbin.com/screens/e15a50db-3cba-4f34-a78c-0fe021f45a67?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **timespent:** [Founder letter + Forever](https://mobbin.com/screens/b00fa672-0e18-4d18-8040-8912c0af8ca7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Bloom:** [Monthly / Yearly / Lifetime columns](https://mobbin.com/screens/db6e7f44-adcb-48a5-a585-48df56e93efe?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Sunlitt:** [Trial toggle + lifetime](https://mobbin.com/screens/1be71829-fa39-4b78-a3c9-c2726c2ef26f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Hevy:** [Pro with lifetime, "Not now"](https://mobbin.com/screens/19fce77b-a3e7-428c-857c-79aa00fbe716?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Tide Guide:** [Plans with lifetime](https://mobbin.com/screens/ac1f26f9-2a89-4539-9ad2-4388c495269e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Pro settings flow (Buy Lifetime) (flow)](https://mobbin.com/flows/5bef40b5-8760-4eb3-b232-dfaf5da7b41b?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Plex:** ["Pure Dedication" lifetime](https://mobbin.com/screens/579c0b00-dfb7-434d-a987-c8903866ddfc?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Brink+:** ["Pay S$9.98" CTA](https://mobbin.com/screens/94cdf6cd-939e-4a80-80b0-c708b098130d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Ahead:** ["Save ~~40%~~ 50%"](https://mobbin.com/screens/71d10c31-1c85-4d54-9b05-0f440d1a80b9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Buddy:** [Weekly breakdown plans](https://mobbin.com/screens/d81d0d25-b0c2-4138-a32e-759950886662?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Reminders screen](https://mobbin.com/screens/905ca8c9-796d-4ca4-b106-f0163fa06eba?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **FocusFlight:** [Lifetime first](https://mobbin.com/screens/01e0b4d2-a045-47e0-a67d-37b3470e72f2?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **The Outsiders:** [Lifetime 1.67×](https://mobbin.com/screens/65112b07-4e73-4a48-a3f5-0a83e895108e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **ABY Journal:** [Weekly + lifetime](https://mobbin.com/screens/65f1ef09-8067-43b6-a2d0-2210febda055?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Woolworths:** ["Subscribed!" receipt](https://mobbin.com/screens/42878139-86a3-4139-aa51-3d85127628d7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Structured:** [Trial started, reminders enabled](https://mobbin.com/screens/0af9c955-85af-4b9e-bb2a-50a06b2be2be?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Pillow:** [Free trial status](https://mobbin.com/screens/cb1df573-1ff6-4aa2-97b0-d5157b693181?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Plum:** ["Free trial remaining 30 days"](https://mobbin.com/screens/c49f2795-a07d-46ed-a51c-8f0de8d887ec?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **7-Eleven:** ["Success!"](https://mobbin.com/screens/eb69750e-dbe1-49a1-8401-007366254d9f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Canva:** ["Due today S$0"](https://mobbin.com/screens/37f19e2f-bdff-4b31-a0da-75cbc259676f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Julienne:** [Monthly pre-selected](https://mobbin.com/screens/321d991f-a691-45e8-8da8-59b702cc8be9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Oportun:** [Manage plan](https://mobbin.com/screens/b7677589-efaf-4ca1-9f11-38d21b834d39?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Manage subscription flow (flow)](https://mobbin.com/flows/a8db76de-3c58-43b1-b3b4-469d30f768c0?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Splitwise:** [Pro, renews](https://mobbin.com/screens/f6f30609-ce4a-4d8c-af11-00ac0d85ff31?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Slopes:** [Free Trial (Annual)](https://mobbin.com/screens/68bd28d4-b6b1-4a29-baec-63d54c0dbd69?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Lyft:** [Pink trial](https://mobbin.com/screens/3c6731e6-7f2f-4356-b270-79a58a95cae8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Blue Apron:** [Your Plan](https://mobbin.com/screens/7e066253-be2b-4a7f-91cf-fdca4d4bb5ef?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Lifesum:** [Manage subscription](https://mobbin.com/screens/f6acb512-7309-4c36-9342-823ac00b5989?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Forest:** [Plus settings](https://mobbin.com/screens/66fede2c-593c-4e0a-914c-a1c8859f883e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Uber One:** ["You'll be charged $9.99 on Mar 31"](https://mobbin.com/screens/187ba480-60f6-4c72-ade2-8dd72fd53e55?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Cleo:** [Builder, next payment](https://mobbin.com/screens/664374c7-8f10-4560-bc12-be1821ff8604?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Starling:** [Card subscription](https://mobbin.com/screens/91f20d3b-924c-452c-98f8-f508a3c85ed6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Notion:** ["Plus & Notion AI — Active"](https://mobbin.com/screens/feb095c4-37c5-4af5-8eef-4f67a80e57ad?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **PlayStation:** [Subscriptions management flow (flow)](https://mobbin.com/flows/f70919ad-6174-4b17-9047-32da7209904b?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Monzo:** [Calendar of payments](https://mobbin.com/screens/fc38868c-15e2-4acd-9a7f-df9a83ecbf9b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
- **Up:** [Upcoming rail](https://mobbin.com/screens/f74de08d-881e-46b4-bb44-1715b802d238?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)

### 6.2 Web sources
**Apple**
- Apple, "Auto-renewable subscriptions" (billed amount must be the most prominent price; trial disclosure; make it easy to reach the manage UI). Read Nov 9, 2026: https://developer.apple.com/app-store/subscriptions/
- Apple App Review Guidelines (3.1.2, 5.6, 5.6.1; 3.1.2 last updated June 8, 2026 per Built by Foundry): https://developer.apple.com/app-store/review/guidelines/
- Apple Developer Forums, "Rejected for 3.1.2(c) Subscriptions. Is 'Try for Free' too conspicuous now?" (Aug 2026; quotes "promotes the free trial… more clearly and conspicuously than the billed amount"; no fix posted): https://developer.apple.com/forums/thread/841626
- Built by Foundry, "Apple subscription paywall rules 2026: 7 things a sign-up screen must show" (Oct 13, 2026): https://www.builtbyfoundry.io/blog/apple-subscription-paywall-rules-2026-7-things-sign-up-screen

**Trial toggles**
- RevenueCat, "R.I.P. toggle paywall" (Feb 9, 2026; updated Apr 23, 2026; quotes Apple's 3.1.2 rejection; Flo's switch to a 14-day trial plan; Fits test where visual hierarchy, not the toggle, drove the lift): https://www.revenuecat.com/blog/growth/rip-toggle-paywall
- Adapty, "Your toggle paywall is about to get rejected" (2026): https://adapty.io/blog/your-toggle-paywall-is-about-to-get-rejected/

**Benchmarks and tests**
- Adapty, "What does a high-performing paywall look like in 2026?" (Mar 13, 2026; test win rates by type; onboarding paywall with trial 1.35% vs 0.89% in-app; 90% of trial starts on day 0; 24h post-close offer "expected" +10–15% ARPU): https://adapty.io/blog/high-performing-paywall-2026/
- Adapty, State of In-App Subscriptions 2026 (lifetime share figures came via a secondary write-up and are unverified): https://adapty.io/state-of-in-app-subscriptions-report/
- RevenueCat, State of Subscription Apps 2026 (115,000+ apps; trials of 17–32 days convert at a 42.5% median vs 25.5% under 4 days; hard paywall 10.7% vs freemium 2.1% day-35 trial-to-paid): https://www.revenuecat.com/state-of-subscription-apps-2026/
- Superwall, Stompers case study (Jan 1, 2026; single-page paywall beat a multi-page flow with a trial-reminder screen by "over 16%" in conversion): https://api.superwall.me/case-studies/stompers
- Superwall, A/B testing page (a customer saw +10% trial conversion testing opt-in vs default trial offers; vendor claim): https://api.superwall.me/features/ab-testing
- Stormy AI, "Optimizing paywall… Superwall revenue increase 2026" (Sunflower trial reminders +46% trial conversion; secondary, weak): https://stormy.ai/blog/optimizing-paywall-superwall-revenue-increase-2026
- Lazyweb Research, "Does 'cancel anytime' copy help or hurt conversion?" (Jul 7, 2026; 165 of 4,406 CTAs = 3.7%; no measured lift): https://design.lazyweb.com/blog/does-cancel-anytime-copy-help-or-hurt-conversion
- Lazyweb Research, "Which apps A/B tested adding a paywall close button?" (Jul 7, 2026; 11 experiments at 8 companies; no outcomes measured): https://design.lazyweb.com/blog/which-apps-ab-tested-adding-a-paywall-close-button.md
- Adapty Feb 2024 update (close-button delay + fade-in setting; no outcome data). I found no published test linking close-button delay to refunds: https://adapty.io/blog/adapty-february-2024-updates

**Competitors**
- Bobby on the App Store: https://apps.apple.com/us/app/-/id1059152023 · in-app purchase list: https://apppricinglab.com/iap/apple/1059152023 · MacStories review: https://www.macstories.net/reviews/bobby-subscription-tracking-made-easy/
- Orbit on the App Store ("Orbit Plus… one-time purchase"; Magic Import): https://apps.apple.com/us/app/manage-subscriptions-orbit/id6692620188 · TechRadar 2026 coverage ($24.99 lifetime): https://www.techradar.com/computing/websites-apps/orbit
- Rocket Money, "How much does Rocket Money cost?" (Premium typically $7–$14/mo, pay what you think is fair): https://www.rocketmoney.com/learn/personal-finance/how-much-does-rocket-money-cost
- Rocket Money BBB complaints page (273 complaints in 3 years per a 2026 summary): https://prod.bbb.org/us/md/silver-spring/profile/billing-services/rocket-money-inc-0241-236043013/complaints

**Law**
- JD Supra, "FTC Relaunches Negative Option Rulemaking…" (2026; click-to-cancel vacated July 8, 2025; ANPRM): https://www.jdsupra.com/legalnews/ftc-relaunches-negative-option-6871835/
- JD Supra, "FTC Steps Up Subscription Enforcement After 'Click to Cancel' Rule Struck Down" (ROSCA enforcement continues): https://www.jdsupra.com/legalnews/ftc-steps-up-subscription-enforcement-4518749/

**From earlier research (not re-checked here):** Blinkist +23% / −55% complaints; Dark Noise plan test; Adapty Nov 2026 "tests subscription apps skip". See `docs/design/CONVERSION-RESEARCH.md` §5.

---

## Mobbin notice

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)

[s0ad95c82]: https://mobbin.com/screens/0ad95c82-1dd1-4c8e-9100-4615486bf514?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s0aefbc5b]: https://mobbin.com/screens/0aefbc5b-663c-4384-9fae-7378badec476?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s592b68fc]: https://mobbin.com/screens/592b68fc-549e-4df6-9d80-bc55b9914e1a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sa759f7af]: https://mobbin.com/screens/a759f7af-d765-4ebd-acaa-43018378b1c9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sdeac87fe]: https://mobbin.com/screens/deac87fe-f7ef-4452-8deb-f233aada237f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sc49f7e84]: https://mobbin.com/screens/c49f7e84-d043-49a6-9b03-404e98ee6426?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s40d3a02c]: https://mobbin.com/screens/40d3a02c-2503-4cc1-b940-518ebc20f189?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s521769df]: https://mobbin.com/screens/521769df-d360-452b-baf3-e6329b58a842?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s05b8e0fa]: https://mobbin.com/screens/05b8e0fa-1f61-43d7-a9f0-c77506ce6377?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s2553cf9e]: https://mobbin.com/screens/2553cf9e-e681-4e4e-b81c-06b6bbc3d665?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sccee144c]: https://mobbin.com/screens/ccee144c-65ce-4813-8876-2b4f67017a63?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s79551e51]: https://mobbin.com/screens/79551e51-5fce-4789-b599-15ec83d3961b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s499ecfb2]: https://mobbin.com/screens/499ecfb2-4ecc-4446-9aa9-2f12c458d123?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s13f0e2b8]: https://mobbin.com/screens/13f0e2b8-5ba1-48b1-88ec-d023b7740863?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf697f2a7]: https://mobbin.com/screens/f697f2a7-a980-4675-a9e7-caf437fbc897?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s9525457d]: https://mobbin.com/screens/9525457d-4d73-4e36-ad50-6b908138a8b1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[se51aeb7f]: https://mobbin.com/screens/e51aeb7f-9145-4af9-b72e-64dd0852d74e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s143d819c]: https://mobbin.com/screens/143d819c-dc6a-41c6-9451-54e408bbbb1b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s5702f396]: https://mobbin.com/screens/5702f396-80eb-4f99-845a-7f64a28d4962?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[saa09c6a8]: https://mobbin.com/screens/aa09c6a8-1f87-49fa-b0f9-d44c7fb2942d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s1c6bea40]: https://mobbin.com/screens/1c6bea40-9f76-488b-a6a8-4ec39eead7cd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s8dcaf769]: https://mobbin.com/screens/8dcaf769-aefb-4fc3-bdf9-2f2cc0908db6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf12defd2]: https://mobbin.com/screens/f12defd2-64bf-4cee-8cc9-0720675cbffb?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sd864c477]: https://mobbin.com/screens/d864c477-0206-47bc-aa27-f9d963b5e843?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s8e57188c]: https://mobbin.com/screens/8e57188c-e629-4b34-9aa8-2e7e9ae94622?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s954dab6c]: https://mobbin.com/screens/954dab6c-e3ed-4104-aae0-e5039bd5012f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f340b7fb6]: https://mobbin.com/flows/340b7fb6-8b5d-416c-9f9f-501a27d669bc?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f6b941627]: https://mobbin.com/flows/6b941627-b728-4443-a947-985a27be4b63?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[fe0d2902c]: https://mobbin.com/flows/e0d2902c-4de8-4584-856f-c2972b802519?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f78e8655b]: https://mobbin.com/flows/78e8655b-afa5-43db-ab32-42b53002a748?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s50401be4]: https://mobbin.com/screens/50401be4-6845-434a-989c-153bf925170f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sdb7e5d7d]: https://mobbin.com/screens/db7e5d7d-bf6c-4e34-8f42-d5a8ba2105f5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf1e40472]: https://mobbin.com/screens/f1e40472-8469-4dbd-992f-7c768766f3f5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s1137fa1a]: https://mobbin.com/screens/1137fa1a-5548-440a-8f06-0a52032a713a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s2fb93a76]: https://mobbin.com/screens/2fb93a76-3c62-45b5-909a-f342e9a4c653?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s01d9cc58]: https://mobbin.com/screens/01d9cc58-851a-4e29-9b1b-a6f0bef3b85d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s6eaf1f66]: https://mobbin.com/screens/6eaf1f66-8809-46bd-a6ec-b379586a5418?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s68a06a26]: https://mobbin.com/screens/68a06a26-0750-4fd7-8e84-ac86bb127d38?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s6ac66e8d]: https://mobbin.com/screens/6ac66e8d-7cd5-48f4-9a58-f4f2e3c450ba?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s5506dc22]: https://mobbin.com/screens/5506dc22-dad3-4e4f-8977-5c1d85a6d2dd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sa70b4ae3]: https://mobbin.com/screens/a70b4ae3-0f10-4375-9f24-7238107ee442?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sbec00605]: https://mobbin.com/screens/bec00605-5470-4f16-bc9e-9b410a1c5cde?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sd84d8f69]: https://mobbin.com/screens/d84d8f69-931b-4b65-8a6e-82052bf8b385?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s3577e8cc]: https://mobbin.com/screens/3577e8cc-8a93-4935-a3dd-52e5c694db92?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s07aab661]: https://mobbin.com/screens/07aab661-7b9f-42c6-8cb2-920f995de76a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sc57d146f]: https://mobbin.com/screens/c57d146f-d81c-463a-a89f-c6b0e0d42249?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf6a479d0]: https://mobbin.com/screens/f6a479d0-e3de-413c-a8aa-8e817ceac949?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s117ead1a]: https://mobbin.com/screens/117ead1a-efe1-445f-8ec1-781907699330?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s301a0b9c]: https://mobbin.com/screens/301a0b9c-d67a-4a7b-b154-23a57f864940?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s40fe4679]: https://mobbin.com/screens/40fe4679-76a4-40ab-aaa3-45d537486173?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s3bc03e0a]: https://mobbin.com/screens/3bc03e0a-dc4d-41cb-be4d-123fb65c3a79?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s2a04ea4f]: https://mobbin.com/screens/2a04ea4f-4c76-483a-98c2-2a58b63764ff?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sb8bd90c5]: https://mobbin.com/screens/b8bd90c5-cf3b-44fd-a1b3-6e6e49a00a1b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s932d9fb9]: https://mobbin.com/screens/932d9fb9-1ac1-4dfa-9b5a-127999295b69?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s3b479401]: https://mobbin.com/screens/3b479401-25db-4ce6-8207-f28a46c981cd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s5aa3e934]: https://mobbin.com/screens/5aa3e934-65e2-482a-ad39-b61ab22f5855?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s1934eab1]: https://mobbin.com/screens/1934eab1-59e1-4cd9-abd6-4a9dcd614338?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sacd7fd86]: https://mobbin.com/screens/acd7fd86-d95d-44c0-80d2-1011c75a602f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[ffed2772b]: https://mobbin.com/flows/fed2772b-6edd-432f-b195-0691f2d84d04?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[fc039b598]: https://mobbin.com/flows/c039b598-adfb-4216-9e7b-2fc896fd1a8b?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f7baec4d3]: https://mobbin.com/flows/7baec4d3-c65a-4f49-ae8b-8aad04a2d06a?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f45887c47]: https://mobbin.com/flows/45887c47-fde8-4af6-aa98-9bf992a51669?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s97e9b0dc]: https://mobbin.com/screens/97e9b0dc-f653-4422-96e8-53650ff9accd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[seade4735]: https://mobbin.com/screens/eade4735-8f46-4659-bc9e-2e93d306019e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sdffccfd7]: https://mobbin.com/screens/dffccfd7-c78a-4964-b31a-49d052b1e176?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s97ef7575]: https://mobbin.com/screens/97ef7575-6542-4c87-af8a-91237d9d1bb8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s98836c8b]: https://mobbin.com/screens/98836c8b-4166-4dc6-878e-ee8558048d90?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[se937c8a3]: https://mobbin.com/screens/e937c8a3-ccda-4319-a684-5107b0689fe8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s9bbb4867]: https://mobbin.com/screens/9bbb4867-3bc1-4b86-981c-c51c038a3903?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sd383e614]: https://mobbin.com/screens/d383e614-83f8-430e-907d-5e91461aa7c9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sbb7d6e68]: https://mobbin.com/screens/bb7d6e68-6ec5-4bbf-abbc-b59e1389c10b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sa3e467db]: https://mobbin.com/screens/a3e467db-f7e3-4d4e-9eea-11c639c2e32a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sd6a2c6fe]: https://mobbin.com/screens/d6a2c6fe-f807-4485-b505-7778c7b59847?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf395f96c]: https://mobbin.com/screens/f395f96c-bce1-4424-80ea-1923015c7ec9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sefc1b751]: https://mobbin.com/screens/efc1b751-d8c1-4ad1-be27-1a13b1d46025?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s1a40c1b8]: https://mobbin.com/screens/1a40c1b8-449c-488c-9479-a47e2d4f9d78?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[fc71bfa5f]: https://mobbin.com/flows/c71bfa5f-4aab-488b-a2af-d5276353a736?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f53299ac2]: https://mobbin.com/flows/53299ac2-ebb2-494b-afc8-b3b574457622?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f06aa7cd2]: https://mobbin.com/flows/06aa7cd2-7316-4bc0-9e26-1a50ece280d5?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sdd24134d]: https://mobbin.com/screens/dd24134d-f4c8-404a-8b9a-a16fa9d6be98?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf58ab869]: https://mobbin.com/screens/f58ab869-a56d-4d44-bba4-9c41158451b3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s0525a643]: https://mobbin.com/screens/0525a643-772d-4665-b5fc-b0d7d10a3a3a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s981c04ab]: https://mobbin.com/screens/981c04ab-3348-492a-b506-7e456db8b1ae?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s11ec5a8d]: https://mobbin.com/screens/11ec5a8d-7a51-4e18-b70c-9d2da2a0e59a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sfbfb220d]: https://mobbin.com/screens/fbfb220d-665b-4d16-985b-767d65e398a4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sfa147bb8]: https://mobbin.com/screens/fa147bb8-a2bb-4c99-bf87-00f28bc44e15?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s5476a849]: https://mobbin.com/screens/5476a849-e09a-437e-b4c8-c39260617658?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f352a16af]: https://mobbin.com/flows/352a16af-ee34-4cff-8274-936a6d643fdc?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[fa20f4c9b]: https://mobbin.com/flows/a20f4c9b-cc45-4346-9baf-4e8846b5f470?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[fd8578ebe]: https://mobbin.com/flows/d8578ebe-5d78-45e4-9b88-e653e2665e5d?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sa9bf58c3]: https://mobbin.com/screens/a9bf58c3-250a-4565-9808-c4722933ea54?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf807e12e]: https://mobbin.com/screens/f807e12e-39f7-4672-a6ca-b1a4caca3b5c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[seafc7a2d]: https://mobbin.com/screens/eafc7a2d-5606-45d3-8322-634334b9214e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s66e6952c]: https://mobbin.com/screens/66e6952c-8999-4997-903d-514d9e6fbb4c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sab864429]: https://mobbin.com/screens/ab864429-6dbb-4259-b2ca-48debdc4a81b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f31b21791]: https://mobbin.com/flows/31b21791-dec6-448a-8253-648f5ebbba3e?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[fccf14439]: https://mobbin.com/flows/ccf14439-4c45-4d56-b031-45173490cafe?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sd3a2e8d0]: https://mobbin.com/screens/d3a2e8d0-30b8-461f-8941-093453cc209a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[saa50356b]: https://mobbin.com/screens/aa50356b-4550-462e-86bf-bf93cb19f85d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f38549b00]: https://mobbin.com/flows/38549b00-2fe8-4fd1-914b-13c4905db245?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f66841373]: https://mobbin.com/flows/66841373-6f71-4920-9432-531ffad47076?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s1c74c6aa]: https://mobbin.com/screens/1c74c6aa-ae67-4bdf-811f-9019e3ad8564?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s0b792ef8]: https://mobbin.com/screens/0b792ef8-7177-4ed3-81f2-f7cc63f4c0fe?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s421f73ef]: https://mobbin.com/screens/421f73ef-efa7-4a02-92f4-2fea162e16d4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s23bce2b9]: https://mobbin.com/screens/23bce2b9-c92d-4d98-b920-42f432ea3eef?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sa07cf4e2]: https://mobbin.com/screens/a07cf4e2-7d74-4b2d-a1e3-3bb27800b15d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s0ee44212]: https://mobbin.com/screens/0ee44212-8ee5-4d4b-9c04-c44cff089393?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[fa9e95e3d]: https://mobbin.com/flows/a9e95e3d-961b-422b-b217-d3fe6fe34e0f?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[fe1955af2]: https://mobbin.com/flows/e1955af2-75c9-4a0b-ab51-ab1510e4c549?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[se21e4d00]: https://mobbin.com/screens/e21e4d00-1d89-488b-bde6-4882ccc5749c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf874f93b]: https://mobbin.com/screens/f874f93b-8ef4-408a-bd23-101d703c2ae1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sa20e0bb1]: https://mobbin.com/screens/a20e0bb1-4df0-4275-83b6-7b2ec095cdf9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s2b025166]: https://mobbin.com/screens/2b025166-9404-4108-986a-c6a507884518?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s75d53eed]: https://mobbin.com/screens/75d53eed-31bf-4fb6-99f1-c9e00d7b912a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sb41b47ab]: https://mobbin.com/screens/b41b47ab-b6ba-4f21-9e45-14960b8df6b2?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sca8fff07]: https://mobbin.com/screens/ca8fff07-00d7-4340-9796-1eb8daa4112a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sdde0aab2]: https://mobbin.com/screens/dde0aab2-6fe9-47d3-9698-c78534e3a906?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f7b6dc8e9]: https://mobbin.com/flows/7b6dc8e9-56e3-4db3-a898-cfdddc9b1e8a?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f79ce4841]: https://mobbin.com/flows/79ce4841-55da-4728-9ea4-29b3b162ba02?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sb6ba77c0]: https://mobbin.com/screens/b6ba77c0-7d8f-423e-8453-9db2a97f8035?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s008d84bc]: https://mobbin.com/screens/008d84bc-3e1e-4b7b-a4d6-616e19c3c3e6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s74fe23bf]: https://mobbin.com/screens/74fe23bf-1ce8-4dd2-b8ef-e639daf9b0df?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s2998f38f]: https://mobbin.com/screens/2998f38f-b1e0-4540-b408-083df447729d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s7ab7b855]: https://mobbin.com/screens/7ab7b855-11c1-4aef-a9fe-3fe64fcfe259?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s9253b243]: https://mobbin.com/screens/9253b243-88e6-47a6-b607-b93517d22d1b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s2b94e085]: https://mobbin.com/screens/2b94e085-ab6f-4794-b898-f52a065e4c91?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s648acdda]: https://mobbin.com/screens/648acdda-e963-4f0d-b98d-e32dca5ccdd8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s5444ac68]: https://mobbin.com/screens/5444ac68-4dd7-4569-a3c5-4667ef2d66ad?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s7e92d605]: https://mobbin.com/screens/7e92d605-a811-4473-bbf3-81636fe88066?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf4f97ca0]: https://mobbin.com/screens/f4f97ca0-8e85-4609-8f21-c5c9902171d4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sa50e61eb]: https://mobbin.com/screens/a50e61eb-ab7f-420e-9607-03b92db84ec1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s9851d751]: https://mobbin.com/screens/9851d751-4b71-4a29-ac49-29a155e3dbe4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s55cdf1b4]: https://mobbin.com/screens/55cdf1b4-a36a-4ee3-8981-7b50f38951e3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s708c082e]: https://mobbin.com/screens/708c082e-03cc-44ca-9876-4ec9b32c3869?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s40d104f8]: https://mobbin.com/screens/40d104f8-8f25-4ae3-90eb-373e30e35acd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s7bb88f5d]: https://mobbin.com/screens/7bb88f5d-cae1-4400-9e4d-8d159097644f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sa65d3bf6]: https://mobbin.com/screens/a65d3bf6-2111-49d9-b3db-f035a7b35e8e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sbeccd794]: https://mobbin.com/screens/beccd794-33de-4e56-82c9-c4bf404d781b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sb05a266e]: https://mobbin.com/screens/b05a266e-a1dc-4343-bea0-79169f5fdf7f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s94178124]: https://mobbin.com/screens/94178124-98a0-4282-88c4-eb65c8e5de01?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sb38ea1cf]: https://mobbin.com/screens/b38ea1cf-1eba-47f5-99b2-27e11ba842e8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sca622b90]: https://mobbin.com/screens/ca622b90-453e-40d0-b981-7fbdc7ec41dd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sb730224e]: https://mobbin.com/screens/b730224e-cacd-450a-98b4-74cb2be349e7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s499d50fd]: https://mobbin.com/screens/499d50fd-ea92-4e16-9c24-21c78f3b92ba?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sd67cb7a1]: https://mobbin.com/screens/d67cb7a1-a18f-4deb-aa87-3ac00916e913?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sd5705369]: https://mobbin.com/screens/d5705369-7a8d-4cf8-bccc-59f5996fd8a5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s8a228d8b]: https://mobbin.com/screens/8a228d8b-b9cb-42ac-9683-a972387950e3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s8210e912]: https://mobbin.com/screens/8210e912-9049-49f2-bd38-7c7ed8581c3b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s80d40725]: https://mobbin.com/screens/80d40725-dc80-47ba-bad0-f1fbceaba6ed?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sc5de87f4]: https://mobbin.com/screens/c5de87f4-a628-4e77-a937-6ddda93aadb4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s0b03c06a]: https://mobbin.com/screens/0b03c06a-63c8-43dd-87ed-58fecc57f0a1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s7fff754e]: https://mobbin.com/screens/7fff754e-0548-4edf-bcb4-e6693302e99b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sa40086d6]: https://mobbin.com/screens/a40086d6-f7f8-43f0-af8f-6c9f0987064d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[se722f5a0]: https://mobbin.com/screens/e722f5a0-b638-4060-86cc-2a05426b3f17?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sfb296b02]: https://mobbin.com/screens/fb296b02-4eb7-4ecd-926a-077cd88c30b8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s95725ce5]: https://mobbin.com/screens/95725ce5-ccaa-4feb-b9e0-0429ed293280?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s8add0191]: https://mobbin.com/screens/8add0191-e507-4d67-a1e6-c2a4f42e3227?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[se257555e]: https://mobbin.com/screens/e257555e-bd98-4163-b095-198a8c58473b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s8775ef63]: https://mobbin.com/screens/8775ef63-9c42-4fc9-b7ca-474132af5fdd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s87ac5af9]: https://mobbin.com/screens/87ac5af9-7c7a-46b8-8a82-ad8c90bf574c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s4e61701e]: https://mobbin.com/screens/4e61701e-2514-4dc9-b6a8-a7c1e9e187e7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s6dbe8849]: https://mobbin.com/screens/6dbe8849-58b3-44ff-a86e-eb56b2c48e9f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[se91cde1b]: https://mobbin.com/screens/e91cde1b-542d-4989-8921-596ccb2a07c7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[se3c08810]: https://mobbin.com/screens/e3c08810-b4c7-46c1-9a3f-d98ed02c910a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sc550c1aa]: https://mobbin.com/screens/c550c1aa-b7d4-4b06-b4f3-ef448c07419f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sc5954cee]: https://mobbin.com/screens/c5954cee-b3b0-4d32-a959-bbd9907c5785?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s4769fa19]: https://mobbin.com/screens/4769fa19-5abe-4bd9-8b9e-e1260ace9d56?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sbb36bc0f]: https://mobbin.com/screens/bb36bc0f-428c-4b09-8200-38bac562631e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s2f9bcce8]: https://mobbin.com/screens/2f9bcce8-e4bd-4cf1-9027-3b8f44eb4ca6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s4139d31a]: https://mobbin.com/screens/4139d31a-e861-4982-b075-7e8d5ffd1468?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s414bbd15]: https://mobbin.com/screens/414bbd15-0f01-4af3-a325-4d08448d746d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sbe08aff0]: https://mobbin.com/screens/be08aff0-553d-4a78-8f55-c0eee9ffe1e4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sa6a5ec71]: https://mobbin.com/screens/a6a5ec71-199a-477c-b4c4-a3d351d06418?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s355c903b]: https://mobbin.com/screens/355c903b-4580-4f82-bd8f-0c46195fa434?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s8d0a33c4]: https://mobbin.com/screens/8d0a33c4-54d1-406d-b502-7cf17b997e91?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sba6ce0da]: https://mobbin.com/screens/ba6ce0da-0545-485c-8138-fbe1f51bd414?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s919fda8d]: https://mobbin.com/screens/919fda8d-1b21-4645-af65-187100030337?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf534ccc2]: https://mobbin.com/screens/f534ccc2-5c15-4ef1-b50c-b823dd786fa6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[se15a50db]: https://mobbin.com/screens/e15a50db-3cba-4f34-a78c-0fe021f45a67?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sb00fa672]: https://mobbin.com/screens/b00fa672-0e18-4d18-8040-8912c0af8ca7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sdb6e7f44]: https://mobbin.com/screens/db6e7f44-adcb-48a5-a585-48df56e93efe?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s1be71829]: https://mobbin.com/screens/1be71829-fa39-4b78-a3c9-c2726c2ef26f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s19fce77b]: https://mobbin.com/screens/19fce77b-a3e7-428c-857c-79aa00fbe716?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sac1f26f9]: https://mobbin.com/screens/ac1f26f9-2a89-4539-9ad2-4388c495269e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s579c0b00]: https://mobbin.com/screens/579c0b00-dfb7-434d-a987-c8903866ddfc?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s94cdf6cd]: https://mobbin.com/screens/94cdf6cd-939e-4a80-80b0-c708b098130d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s71d10c31]: https://mobbin.com/screens/71d10c31-1c85-4d54-9b05-0f440d1a80b9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sd81d0d25]: https://mobbin.com/screens/d81d0d25-b0c2-4138-a32e-759950886662?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s01e0b4d2]: https://mobbin.com/screens/01e0b4d2-a045-47e0-a67d-37b3470e72f2?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s65112b07]: https://mobbin.com/screens/65112b07-4e73-4a48-a3f5-0a83e895108e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s65f1ef09]: https://mobbin.com/screens/65f1ef09-8067-43b6-a2d0-2210febda055?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s42878139]: https://mobbin.com/screens/42878139-86a3-4139-aa51-3d85127628d7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s0af9c955]: https://mobbin.com/screens/0af9c955-85af-4b9e-bb2a-50a06b2be2be?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[scb1df573]: https://mobbin.com/screens/cb1df573-1ff6-4aa2-97b0-d5157b693181?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sc49f2795]: https://mobbin.com/screens/c49f2795-a07d-46ed-a51c-8f0de8d887ec?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[seb69750e]: https://mobbin.com/screens/eb69750e-dbe1-49a1-8401-007366254d9f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s37f19e2f]: https://mobbin.com/screens/37f19e2f-bdff-4b31-a0da-75cbc259676f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s321d991f]: https://mobbin.com/screens/321d991f-a691-45e8-8da8-59b702cc8be9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sb7677589]: https://mobbin.com/screens/b7677589-efaf-4ca1-9f11-38d21b834d39?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[fa8db76de]: https://mobbin.com/flows/a8db76de-3c58-43b1-b3b4-469d30f768c0?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf6f30609]: https://mobbin.com/screens/f6f30609-ce4a-4d8c-af11-00ac0d85ff31?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s68bd28d4]: https://mobbin.com/screens/68bd28d4-b6b1-4a29-baec-63d54c0dbd69?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s3c6731e6]: https://mobbin.com/screens/3c6731e6-7f2f-4356-b270-79a58a95cae8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s7e066253]: https://mobbin.com/screens/7e066253-be2b-4a7f-91cf-fdca4d4bb5ef?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf6acb512]: https://mobbin.com/screens/f6acb512-7309-4c36-9342-823ac00b5989?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s66fede2c]: https://mobbin.com/screens/66fede2c-593c-4e0a-914c-a1c8859f883e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s187ba480]: https://mobbin.com/screens/187ba480-60f6-4c72-ade2-8dd72fd53e55?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s664374c7]: https://mobbin.com/screens/664374c7-8f10-4560-bc12-be1821ff8604?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s91f20d3b]: https://mobbin.com/screens/91f20d3b-924c-452c-98f8-f508a3c85ed6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sfeb095c4]: https://mobbin.com/screens/feb095c4-37c5-4af5-8eef-4f67a80e57ad?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[f5bef40b5]: https://mobbin.com/flows/5bef40b5-8760-4eb3-b232-dfaf5da7b41b?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[ff70919ad]: https://mobbin.com/flows/f70919ad-6174-4b17-9047-32da7209904b?tab=screens&utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sfc38868c]: https://mobbin.com/screens/fc38868c-15e2-4acd-9a7f-df9a83ecbf9b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[sf74de08d]: https://mobbin.com/screens/f74de08d-881e-46b4-bb44-1715b802d238?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[s905ca8c9]: https://mobbin.com/screens/905ca8c9-796d-4ca4-b106-f0163fa06eba?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
