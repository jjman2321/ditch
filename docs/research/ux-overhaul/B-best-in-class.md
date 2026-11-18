# B · Best in class outside our niche: what "crafted" looks like

Written Nov 18, 2026 for the UX overhaul. Scope: consumer apps **outside** subscription and finance tracking (Copilot only for craft). Doc A covers in-niche finance apps and doc C audits Ditch, so neither is repeated here. Nothing below reopens a locked decision. Where the evidence pulls against one, it's flagged for the owner.

**Method.** I viewed 9 full Mobbin iOS flows screen by screen: Structured (20 screens), Finch (21), Opal (23), Speak (24), Headspace (21), Blinkist (17), Gentler Streak (17), Copilot (23) and Cash App and Airbnb (previews). I also looked at 15 paywall screens. Duolingo and Brilliant come from `../duolingo-brilliant.md` (360 screens). Mobbin shows only still images. Motion claims come from first-party write-ups (Not Boring's "Art of Game Feel", Apple's Behind the Design: Flighty, Airbnb's May 2025 launch) or are marked *inferred*. Flighty, Things and (Not Boring) have no flows on Mobbin.

## Summary
1. **The best onboardings make you do the product, not read about it.** In Structured you build your first real task, using the real task card, before you see a paywall. In Speak you say a sentence into the mic. Ditch already has this spine (tick → total). The upgrade is to make the list you build *be* your Home when you land.
2. **A personal "aha" comes before every ask.** Opal shows "22 years", Speak shows "Here's what we learned about you", Finch shows "Sam Lee's starter plan" and Headspace shows "The Calm Explorer". Ditch's total beats all of them because it's real money, not a projection.
3. **Permission asks that work show the actual notification**, from the brand, in the user's own terms (Finch "From Lee · Remember to drink water!", Structured "Clean Up · Starts in 5 min", Copilot "You just got paid · $2,145"). They give one reason and a skip with no guilt.
4. **Trustworthy paywalls share 6 traits:** a visible ×, the charge date as a real date, a reminder promise, one plain price with the monthly figure secondary, borrowed trust ("Secure with App Store"), and a ✓ in the Free column. **Scammy ones** use a crossed-out price, a countdown, a "No free trial" plan pre-selected, or hide the × on the first frame.
5. **"AI slop" is sameness**: everything centred, one font in four weights, emoji as icons, a purple gradient, every card the same radius and shadow, "Unlock your potential" copy, and fade-ins on every mount. **Craft is specific**: one idea per screen, big type contrast, one icon family, numbers set like a departure board (Flighty), one person's voice, and motion that only confirms something the user did.
6. **Ditch already has a real identity** (Sunflower, Archivo, real logos, a dry voice, the duck). The slop risk is in the gaps between screens: default RN press states, mixed icon libraries, inconsistent money and date formats, stray emoji, mixed radii and generic empty states. §3 is an audit list for exactly that.
7. **Top 3 moves:** (a) the "living list", where onboarding rows become Home rows; (b) one real lock-screen reminder that slides in once on the reminders screen; (c) a craft pass on numbers, dates, icons, radii and press states, using §3.

---

## 1. Onboarding: the 9 best flows, screen by screen

**Structured · 20 screens** · [flow](https://mobbin.com/flows/88def011-f342-45ad-9597-764a72338f2d)
- **1** The check logo draws itself.
- **2–3** Full-bleed coral intro (notebook photo, round → button bottom-right, 3-dot pager).
- **4** "Let's get started by planning today…" / "This will only take a few steps".
- **5–7** "When did you **wake up**?" with a big wheel picker inside a sky drawing (the sun sits at 9:00). For "When will you go to **bed**?" the whole screen turns to a night sky with a moon. [▸](https://mobbin.com/screens/2f8446b7-41a2-485c-a96f-5d0a10dc0faf)
- **8–9** "What's up **next**?" Text field plus 4 suggestion chips with icons (Answer Emails, Clean Up…).
- **10–17** Time wheel, then duration pills (15m, 30, 45, 1h), then colour. **The real task card sits pinned at the top and updates live**, and choosing a colour re-tints the progress bar and the CTA.
- **18** "**Awesome!** That's a great plan." Your real 3-item timeline (Rise and Shine · Clean Up · Wind Down). [▸](https://mobbin.com/screens/2ccea049-12ce-490a-a0a0-3b9ad0ae5ed7)
- **19** Notification ask as a sheet over your plan: a real banner "Clean Up · Starts in 5 min", "Don't Miss Your Task!", Allow / Skip For Now. [▸](https://mobbin.com/screens/ff9fb695-e58b-49eb-b8de-cf23993499ce)
- **20** Free vs Pro paywall.
- **Techniques:** real product component from screen 8, a progress bar, answers change the UI live, the "aha" is the plan you just built, and the ask uses your own task. One brand-coloured keyword per headline.

**Finch · 21 screens** · [flow](https://mobbin.com/flows/80ef83ef-f872-4825-b18d-6b193d60a9aa)
- **2** "Your new self-care best friend." Hatch a new pet / Have an invite? / Load Backup.
- **3–6** Choose an egg (6 eggs around the bird), the egg cracks, then "You hatched a birb!" over sun rays.
- **7–9** The bird asks your name in a speech bubble. The answers are big coloured speech bubbles, so the quiz reads as a conversation.
- **11** "Get reminders from Lee": a mock banner "From Lee · Remember to drink water!", Turn on notifications / Maybe later. [▸](https://mobbin.com/screens/3e88469e-f60a-439d-ac4d-0bd06fd8eae4)
- **12–13** Goals multi-select, then "**Sam Lee's starter plan**" on a notepad card with binder rings. [▸](https://mobbin.com/screens/c229ad54-ed26-4dec-80d1-399d54964f31)
- **14** "**Finch is free forever.** But we'd love for you to try Finch Plus for 7 days free too!" / See my FREE offer. [▸](https://mobbin.com/screens/70fe0e89-9150-48bf-ae6b-1bb69803107f)
- **15** "Welcome to Finch Plus", signed by the founders "Nino & Steph".
- **17–19** "1 DAY STREAK", then "How many days in a row…?" with labelled options (Baby steps · Strong start · Clearly committed). The bubble reacts: "Wooohooo! Each step counts".
- **20** Widget ask with the real widget drawn in.
- **Techniques:** the mascot reacts to every answer, the notification comes from the character, and honesty about the free tier comes right before the upsell.

**Opal · 23 screens** · [flow](https://mobbin.com/flows/7b6dc8e9-56e3-4db3-a898-cfdddc9b1e8a)
- **2** ATT prompt on screen 2 (an anti-pattern).
- **3–4** A real iPhone mock with a "Block Apps" sticker.
- **5–6** "What is your daily average Screen Time? *Your best guess is ok.*" with 6 chips.
- **7–10** Age and job, each with Skip top-right.
- **11–12** "Calculating", then "Preparing report…" with a gradient bar.
- **13** "Some not-so-good news, and some great news." A 5-segment, Stories-style bar appears at the top.
- **14** "…you'll spend 114 days on your phone this year… **22 years**" in a huge purple number, with a footnote under it saying how it's worked out. [▸](https://mobbin.com/screens/236c2dba-4f91-48da-8c0d-6e203325d37a)
- **15** "The good news… **6 years+**".
- **17** The real Apple dialog greyed out, with a hand-drawn blue arrow at the button to tap, and "Your information is protected by Apple and will stay 100% on your phone". [▸](https://mobbin.com/screens/7252919d-22aa-4a38-b779-dd4687e2b080)
- **18** Sheet: "We take privacy very seriously. Opal does NOT see:" with 3 ✗ rows. [▸](https://mobbin.com/screens/7d462c63-7051-4f8c-98b0-8035ded1aefb)
- **Techniques:** the Stories bar for the reveal, a method footnote under the big number, the arrow, and a "what we don't see" list. Avoid the ATT prompt up front and the scare framing.

**Speak · 24 screens** · [flow](https://mobbin.com/flows/60e05ece-3567-4ad8-9dbe-577de850a017)
- **3–4** Two claim slides with a 3-dash pager.
- **5–6** Language picked inside the tutor's speech bubble.
- **7–9** Sign-up comes too early (an anti-pattern).
- **14–15** "**Speak now**": a mic button and a live waveform. You actually use the product. [▸](https://mobbin.com/screens/bfb35bd0-7f78-4007-900e-ad108f89fb9c)
- **16** "In two months, you'll be able to communicate while traveling in France." with a rising curve.
- **17** A real course card ("Upper Elementary Part 1 · 47 lessons").
- **18** Reviews with tenure ("Maria C., Speak user for 193 days").
- **21** "**Here's what we learned about you.**" as swipe cards. [▸](https://mobbin.com/screens/69fe36fa-992f-4a20-bfeb-75c157fd9c97)
- **22** Paywall over a collage of real lesson screens. [▸](https://mobbin.com/screens/d5bc2c4a-81af-4ff9-8877-6921982d9fe9)

**Headspace · 21 screens** · [flow](https://mobbin.com/flows/31b21791-dec6-448a-8253-648f5ebbba3e)
- **1–2** "Breathe in" / "Breathe out": the orange face rises and falls. **The splash is the product.** [▸](https://mobbin.com/screens/43f17864-7e82-4968-a736-b41225e0ba74)
- **10–11** "What's on your mind? I want to…"
- **13** "How your trial works" (see §2).
- **15** "Your 14 day trial has started. Get notifications about when your trial is about to end" with a bell drawing, Remind me / Maybe later. **The notification ask rides on a promise the user wants.** [▸](https://mobbin.com/screens/66e6952c-8999-4997-903d-514d9e6fbb4c)
- **19–21** "Thinking carefully…", then "Your style is… The Calm Explorer", then a course with "Why this recommendation".

**Blinkist · 17 screens** · [flow](https://mobbin.com/flows/a9e95e3d-961b-422b-b217-d3fe6fe34e0f)
- **3–4** One illustration with a single word changing ("…while **running**", "…while **waiting**").
- **5–10** "**STEP 1 OF 4**" in small caps over a green bar. Goals, then one review, then categories, then a 👎/👍 swipe on real book covers. [▸](https://mobbin.com/screens/d4a99f21-9575-471e-9ae3-53c600de867d)
- **11–12** "Preparing your content": a ring from 10% to 100% while 3 checklist lines tick ("Saving titles to your Library ✓"). [▸](https://mobbin.com/screens/8e9dd5be-c638-44b8-a165-d5ccc2eac752)
- **13** Paywall (§2).
- **14–15** Account comes *after* purchase ("Save your purchase").
- **16** "Your 7-day trial has started! We'll remind you…" [▸](https://mobbin.com/screens/0b792ef8-7177-4ed3-81f2-f7cc63f4c0fe)

**Gentler Streak · 17 screens** · [flow](https://mobbin.com/flows/8d4fa57c-1176-4557-8d5c-4d241bfdf9d4)
- **1–4** "Hi, I'm Yorhart" / "… and who are you?" with a huge inline name field, then "Let's get to know each other, Alex!"
- **5–7** Features shown on **real charts with handwritten notes** ("you today ↘", "Activity Path", "too low / too high"). [▸](https://mobbin.com/screens/3daa822b-8f28-4ed3-84e0-d9607f4da700)
- **9** A Health mock and "Your health data will never leave this device." [▸](https://mobbin.com/screens/709ce134-543f-433b-a4a7-73749b7992d3)
- **14** "No spam. We're as allergic to it as you are."
- **16** "50% OFF · Ends in 47 hours" (anti-pattern). [▸](https://mobbin.com/screens/30edc428-54cb-4def-9160-3874a0b9b9c4)

**Copilot · 23 screens (design quality only)** · [flow](https://mobbin.com/flows/92d7d390-97fc-485a-8fab-d9cf1acbd632)
- **1, 7** "Demo Mode ▸" on screen 1, and "Not ready to link yet? Try demo mode →" at the bank step.
- **11** **Notification types as cards**, each with a real sample ("You just got paid · $2,145 from Business Inc. has been deposited") and an OFF/ON switch. [▸](https://mobbin.com/screens/2cff4fd7-5d58-4995-ab9d-24d6fea8a5b6)
- **12** "Types of transactions": one example row per concept instead of a paragraph. [▸](https://mobbin.com/screens/9de1a23b-e573-45bf-9875-1d9786950435)
- **15–19** "Let's make sure these numbers are correct": you review cards.

**Duolingo + Brilliant** (from `../duolingo-brilliant.md`)
- Duolingo says "Just **7 quick questions**" up front, and Duo's line reacts to each answer.
- Its notification pre-ask shows a faded fake iOS dialog with an arrow, in exactly the spot where the real one appears. [▸](https://mobbin.com/screens/3a9230ea-4367-4a3c-a30a-d7027588b11c)
- It teaches the streak by simulation: the week fills, a day is missed, it resets. [flow](https://mobbin.com/flows/25145623-749c-4a2c-bd32-ddea59ee235d)
- Brilliant puts a tiny drag-the-tiles demo inside onboarding, and its "No thanks" is the same size as "Allow".

### Technique scorecard
| Technique | Best example | Exactly how | Ditch today → next |
|---|---|---|---|
| Real product early | Structured 8–18, Headspace 1 | The real component appears by screen 2–3 and fills in as you answer | Tick list ✓ → the same row component becomes Home (Rec 1) |
| Interactive demo | Speak mic, Brilliant tiles | One real action, under 10 s, can't fail | A practice row for hold to ditch (Rec 9) |
| Quiz that pays off | Headspace "Calm Explorer", Finch starter plan | Every answer shows up again later, by name | Ditch asks only what it uses (services, dates). Keep it that way. |
| Progress / step count | Blinkist "STEP 1 OF 4", Duolingo "7 quick questions", Opal Stories bar | A number promise in the copy beats a bare bar | Add "4 quick steps" to Welcome's sub-line and keep the 4-segment bar |
| Aha before paywall | Opal 22 years, Speak "what we learned" | One huge personal number, a method footnote, then the ask | Total ✓ → also echo it on the paywall (Rec 4) |
| Permission priming | Finch 11, Structured 19, Opal 17, Duolingo mock | A real sample notification in the brand voice, an arrow at the real button, and "Maybe later" | v12 has the sample → add one-time motion and the arrow (Rec 2) |
| Motion + haptics | Headspace breathing splash, Finch egg hatch | One hero motion per flow, tied to meaning | The total reveal is our one (MOTION.md) |
| Reaction beats | Duolingo, Finch "Wooohooo!" | The line changes after a choice | Duck-free micro copy under chips ("6 picked. Nice list.") |

---

## 2. Paywalls: the 8 best

| App | Layout (top → bottom) | Copy that works | Timeline | Plans | Proof | Close | Link |
|---|---|---|---|---|---|---|---|
| **Blinkist** | × in a circle top-right; headline; "How your free trial works:" 3 rows; price block; CTA; shield line | "Try Blinkist PRO **free for 7 days.**" / "7 days free, then $199.98 per year" / "Only $16.66 / month" / "🛡 Cancel anytime. Secure with App Store." | ✅ Today: Free trial starts · ✉️ **Mar 31**: Email reminder · ❤️ **Apr 2**: Become a member, "Your trial ends unless canceled. Enjoy!" | One | None | × visible | [▸](https://mobbin.com/screens/1c74c6aa-ae67-4bdf-811f-9019e3ad8564) |
| **Headspace** | Sunrise art; × top-right; "How your trial works"; Annual/Monthly segment; timeline; Restore; CTA | "First 14 days free, then $69.99 ($5.83/month)" | Today · In 12 days "We'll send you a reminder" · In 14 days "charged on **September 1**, cancel anytime before" | Segment | None | × + Restore | [▸](https://mobbin.com/screens/a9bf58c3-250a-4565-9808-c4722933ea54) |
| **Strava** | "Try it for 30-days free"; icon timeline (lock, bell, calendar); "What you'll unlock" list; sticky CTA | "You won't be charged until **Jul 1**. Cancel any time up to 24hrs before your trial ends." | Today / In 28 days / In 30 days "charged S$169.00" | One | None | × | [▸](https://mobbin.com/screens/40d104f8-8f25-4ae3-90eb-373e30e35acd) [▸](https://mobbin.com/screens/94178124-98a0-4282-88c4-eb65c8e5de01) |
| **Duolingo** | Mascot with a bell; 2 option rows; CTA disabled until you pick | "**When should we remind you** before your trial ends?" / "2 days before: Dec 14" · "3 days before: Dec 13" | The user picks the reminder | Next screen | None | × | [▸](https://mobbin.com/screens/dffccfd7-c78a-4964-b31a-49d052b1e176) |
| **Structured** | "Structured Pro ★ vs Structured Free" headline; 8-row table (Free ✓ on Cloud Sync and Unlimited Tasks); bottom sheet | "Try 3 days for free, then just S$17.48 / year." / Skip For Now / All Plans · Restore · Help | Price line only | One plus "All Plans" | None | Skip | [▸](https://mobbin.com/screens/164379e9-258f-4b6c-9f91-7a02a3f4c277) |
| **Opal** | **Before / After bar charts** ("6h 32m" vs "1h 49m"); headline; 3 benefits with bold lead-ins; ★ 100,000+ reviews; CTA | "Start Your Free Week And Gain **2+ Hours** Back" / CTA "**Reclaim My Time**" | None | Next step | Reviews and user count | Swipe | [▸](https://mobbin.com/screens/f874f93b-8ef4-408a-bd23-101d703c2ae1) |
| **Speak** | Headline; 2 plan cards; laurels with the Apple logo; tick line; CTA; "View More Plans" | "Billed $129.98 / year · $10.83 / month" / "✓ No payment due now. Cancel anytime." / CTA "**Try for $0.00, then $129.98 per year**" | Inside the CTA | 2 cards | 4.8★ · 140,000 reviews | Back | [▸](https://mobbin.com/screens/77414034-af28-4040-ad58-d67ae6ab6718) |
| **Copilot** | Editors' Choice laurel; vertical timeline; one plan card with an "Only $7.92 a month" tag; footer | "Then $95 per year of service" / Restore · All Plans · Enter Referral · Skip | Today / 7 days before / In a month | One | Apple award | Skip | [▸](https://mobbin.com/screens/b6ba77c0-7d8f-423e-8453-9db2a97f8035) |

**Anti-examples, so we know the line:**
- Flo puts "**No free trial** · Yearly · MOST POPULAR" pre-selected under the trial option. [▸](https://mobbin.com/screens/7400674a-9772-48bc-a56c-471ce1fabc2e)
- Gentler Streak shows "50% OFF · Ends in 47 hours".
- Calm Sleep crosses out "$69.99" to show "$19.99". [flow](https://mobbin.com/flows/bdd52f6f-3495-46c7-b68a-3363523e08f6)
- One Duolingo variant has no × on the first frame.

**What reads as trustworthy rather than scammy:**
1. **Money dates are dates.** "Apr 2", "September 1", "Jul 1". Never "in 7 days" alone.
2. **A reminder promise.** 5 of 8 show it. For Ditch it's the product itself, so it's the most believable thing we can say.
3. **One price, said once, in plain words.** The yearly price leads and the monthly figure is small and secondary (Blinkist). No strike-throughs.
4. **Borrowed trust.** "Secure with App Store" plus a shield, Apple's logo, or an Apple award. This is true for us too (StoreKit 2).
5. **A calm exit.** × in a circle with a 44pt hit area, Restore always visible, and no guilt copy.
6. **The Free column gets ✓ marks** (Structured, Comet). It says "you keep this" to an anxious user.
7. **The CTA names the outcome** ("Reclaim My Time", "Try for $0.00, then…") rather than "Continue".

> **Flag for the owner (locked rule 4, Nov 10: one line, no reminder text, no visual timeline).** Blinkist credits its 3-row timeline with fixing its #1 complaint and a 23% conversion lift ([UX Planet](https://uxplanet.org/how-solving-our-biggest-customer-complaint-at-blinkist-led-to-a-23-increase-in-conversion-b60ad514134b)). Headspace, Strava and Copilot use one too. I'm not changing anything. It's the strongest outside evidence against that rule, so worth a 2-minute re-look once there's traffic to A/B test.

---

## 3. "Slop vs crafted" audit checklist

Score each row Pass / Fail on the real build (SE, iPhone 12, Pro Max, dark mode, AX3 text).

| # | Area | Slop (fail) | Crafted (pass) | How to check Ditch |
|---|---|---|---|---|
| 1 | Type hierarchy | One sans in 4 weights; sizes 14/15/16/18 that all look alike; everything centred | Two families with jobs (Archivo for headlines and hero money, Inter for reading); each step ≥1.25× the last; one display moment per screen; reading text left-aligned | ≤4 sizes and ≤3 weights per screen; no centred paragraph over 2 lines |
| 2 | Spacing rhythm | Random 10/14/20 values; dead bands; equal gaps everywhere | A 4/8 scale; 24 edge; gaps between groups bigger than gaps inside them | Grep for padding/margin not in {4,8,12,16,24,32,48} |
| 3 | Illustration | Mixed 3D emoji, flat clip-art, AI renders with different lighting | One hand: the duck in a fixed set of poses, the same stroke and tangerine; everything else is real logos or real UI | List every image asset. Anything not duck, logo or product UI = fail |
| 4 | Icon set | SF Symbols + Ionicons + emoji; mixed stroke widths; filled and outline at random | One family, one stroke weight, filled only for selected state (Airbnb's 2025 tab icons [▸](https://mobbin.com/screens/e6cad3f5-94c7-47a7-a4ff-ab951455076e)) | Grep icon imports: one library only |
| 5 | Copy voice | "Seamlessly", "Unlock", "Elevate", "journey", em-dash chains, Title Case Buttons, "!" everywhere | One specific thing in the user's words; buttons are a verb plus a result ("See what I pay", Opal's "Reclaim My Time"); a dry joke at most once per flow (Gentler's "allergic to spam") | Banned-word grep; sentence case; every button is a verb + object |
| 6 | Motion | Every screen fades or slides in on mount; staggered lists on every visit; bouncy springs on static things | Motion only after a user action or a real state change; one hero per flow; critically damped springs; Reduce Motion handled | Home shows 0 mount animations on its 2nd visit |
| 7 | Empty states | Grey icon + "No items yet" + "Add item" | Ghost rows with real logos at 30%, one line of voice, one action (Revolut "Finish setting up 1/5" [flow](https://mobbin.com/flows/fe848fd8-58f2-48d4-bdd5-627ae623fda0)) | Every list has designed empty, 1-item, 100-item, error and offline states |
| 8 | Micro-interactions | The RN default `activeOpacity` 0.2 flash, or no pressed state at all | Pressed scale 0.97 plus a slight darken within 100 ms; toggles and pickers tick (haptic); long-press lifts | Grep `TouchableOpacity`; every `Pressable` has a pressed style |
| 9 | Real vs stock | Emoji as feature icons (🔔💰📅), stock photos, lorem phone mocks | Real screens, real logos, the user's own data (Speak's real lessons, Opal's before/after) | No emoji in UI chrome; every mock uses real services and real prices |
| 10 | Radius + shadow | 8/12/16/20 radii mixed; soft shadow on every card; border and shadow together | 3 radii mapped to size (chip, card, sheet); nested radius = outer − padding; shadow only on things that float (sheets, the lifted row) | Grep `borderRadius` values (≤4 distinct); shadows only on floating layers |
| 11 | Numbers | "$1157.4"; "$15.5/mo"; "/mo", "per month" and "a month" mixed; digits that jiggle | One formatter; tabular figures; prices always 2 decimals, big totals 0 (one rule); a non-breaking space; numbers never wrap or truncate (Flighty sets numbers in monospace like a departure board) | Every money string goes through `formatMoney`; unit test for each currency's decimals |
| 12 | Dates | "11/19/2026", "in 3 days" and "Nov 19" mixed | One family: "Thu, Nov 19"; relative words only within 7 days ("Tomorrow"); approximate shown honestly ("around Nov 19") | One date formatter; snapshot test |
| 13 | Haptics | None, or a thud on every tap | A written map: selection for pickers and ticks, Light for confirm, **one** Heavy for the Ditched moment, Success for purchase; ≥600 ms between strong ones (MOTION.md) | Grep `Haptics.` calls against the map |
| 14 | Sound | A stock ding, or sound the user didn't choose | None, or one designed sound for the one big moment. Respect the silent switch (unlike Not Boring, which plays through it) | If added: Ditched only, a Settings toggle, silent mode respected |
| 15 | Colour | Purple-blue gradients, a new accent per screen, grey text on yellow failing contrast | Each colour has a job: sunflower = your money / attention, ink = action, semantic colours only for state | Contrast audit (4.5:1 body, 3:1 large) in light and dark |
| 16 | Layout | Cards inside cards; one card template everywhere; centred stacks | Lists run edge to edge; hierarchy comes from type, not boxes (Apple Wallet, Things) | Max one card nesting level |
| 17 | Loading | Spinners; fake "Analysing…" waits | Local data shows instantly. A wait only when real work is happening, and then it reports the steps (Blinkist's checklist). | No artificial delays in onboarding (grep `setTimeout` in onboarding) |
| 18 | Native feel | Web-style modals, broken swipe-back, centred alerts for everything | Real iOS sheets with detents and grabber, swipe back, context menus, swipe actions | Every sheet dismisses by swipe; long press shows a context menu |
| 19 | Words | "heads-up" / "reminder" / "alert" mixed; "saved" | One word per concept ("reminder", "ditch", "a year you won't pay") | Grep the banned synonyms |
| 20 | Dark mode | Inverted colours, yellow slabs at night | Designed: sunflower becomes an accent, ink becomes the surface | Every screen is checked in dark |
| 21 | Mascot | On every screen, idle-blinking | Only where he has a job; still at rest (Duolingo takes Duo off data screens) | Duck appears only on the 6 listed screens |
| 22 | Seams | The splash jumps to Welcome; the layout shifts when the plan changes; truncated names | The launch screen matches Welcome's first frame (Headspace); fixed slots for changing text; names wrap and never truncate | Record the cold start at 0.25× speed: no jump |

---

## 4. Motion and delight

**10 micro-interactions worth copying**
1. **Reversible hold with wind-up** (Not Boring Habits): a big action needs a big wind-up. Let go early and it plays in reverse. The haptic is shaped from the sound. → Ditch's hold ring already does this. Make sure the drain-back is as smooth as the fill.
2. **Banner drop as the explainer** (*inferred* from Finch, Structured and Duolingo stills): the sample notification slides down like a real iOS banner. → Reminders screen: the first real reminder drops in once (350 ms spring, Light haptic). No price moves after it lands.
3. **Live component fill** (Structured 10–17): the pinned task card updates as each answer comes in. → In the date sheet the row's "Next charge" line updates as you tap (crossfade, no roll).
4. **Answer-reactive line** (Finch, Duolingo): after a choice, one line of copy changes. → Under the tick list: "6 picked" (selection haptic). The money total swaps instantly, with no roll.
5. **Checklist ticks in sequence** (Blinkist "Preparing", Revolut 1/5): → You're set (DECISIONS #36 already): items tick in turn with soft buzzes.
6. **Breathing splash** (Headspace 1–2): the brand mark *does* the product. → The launch screen holds the wordmark exactly where Welcome puts it, so the cold start feels seamless.
7. **Purchase confirm** (Apple Pay / Wallet: a check draws, then a success haptic): → After StoreKit succeeds, a check draws on the "ditch Pro" pill with `notificationAsync(Success)`, then "Reminders are on for all 6".
8. **Threshold tick on swipe** (Mail): a selection haptic when a swipe crosses its action point. → Row swipe for "Skip this charge's reminders" / "Edit".
9. **Numeric crossfade** (Flighty: numbers change by crossfade, progress lines move slowly). → Home's "in 3 days" chips change only at midnight and only by crossfade. Countdown wording never animates.
10. **Coach mark once** (Duolingo "Tap on a word to see its meaning!"): a dim overlay shown once per install. → "Hold a sub to ditch it" on the first Home visit, gone forever after the first hold.

**Restraint rules** (on top of `design/v10/MOTION.md`)
- Motion must answer "what just happened?" If it doesn't, cut it.
- **Nothing moves near a price.** The only exception is the onboarding total reveal (MOTION.md §1). Prices swap instantly inside fixed-width slots, so nothing reflows.
- One hero moment per flow: onboarding has the total; the app has the Ditched moment.
- Durations: 120–250 ms for state changes, ≤400 ms for transitions. Only gestures the user controls (the 1.2 s hold) run longer.
- Critically damped springs for UI. Only the duck may bounce, and only once.
- Entrance choreography plays once per install (onboarding) or once per session (the total). Never on every visit.
- Never block taps during an animation; a tap skips it to the end.
- **Reduce Motion:** a ≤150 ms crossfade replaces any movement. Haptics that confirm an action stay. The hold ring stays, stepped.
- No idle loops (no blinking duck, no shimmer on local data, no pulsing buttons).
- At most one haptic per user action, and nothing on scroll or appear.

---

## 5. Explaining features without walls of text

**Patterns, best first**
- **A · Do it for real:** Structured, Speak's mic, Brilliant's tiles.
- **B · Show the real artefact:** Finch, Structured and Copilot notification cards; Duolingo's widget art.
- **C · Annotate real UI:** Gentler's handwritten arrows; Copilot's one-example-row explainer.
- **D · 3 dated steps:** Blinkist, Headspace and Strava timelines.
- **E · Simulation:** Duolingo's streak demo (fill → miss → reset in 4 frames).
- **F · Before/after with your own number:** Opal.
- **G · One-time coach mark on first real use.**

**Avoid:** feature carousels (Blinkist 2–4 and Speak 3–4 are the weakest screens in their flows) and icon-plus-paragraph lists.

| Ditch feature | Pattern | Exactly what to show | Where |
|---|---|---|---|
| Finding subs (screenshot, statement) | C + A | A 3-frame vignette: a sample Apple **Subscriptions** page with a handwritten "this page ↘" note, a scan line passes, then rows land in a Ditch list with logos and dates. Caption: "You pick the screenshot. Ditch reads it on your phone." Statement: the same, with recurring lines highlighted. **No bank** (CLAUDE.md: no bank link); never imply automatic detection. Opal-style sheet "Ditch never sees:" ✗ your bank login ✗ your email ✗ your other photos. | Dates step and Add |
| Reminders before charges | B | A lock-screen mock with *their* first reminder ("Netflix renews Thursday. $19.99. Still watching?" · Sat, Nov 14 · 9:00 AM) dropping in once, then an arrow at where iOS puts Allow. | Reminders pre-ask |
| Free-trial alerts | D | Inside "Add a trial": a 3-stop mini timeline built live from the input: "Today · trial starts → Sat, Nov 14 · reminder → Mon, Nov 16 · $13.99". This is the app, not the paywall, so rule 4 isn't touched. | Add trial sheet |
| Hold to ditch / cancel help | A + G | A one-time "Try it" card with a pretend row ("Old gym · $39.99/mo") that you hold to see the real Ditched moment, then "Now do it for real anytime." Cancel help as numbered steps using the service's real button names. | First Home visit; how-to-cancel sheet |
| Totals and calendar | F (real data) | The onboarding total *is* the explainer. In Calendar, a one-line legend under the grid ("● charge · ○ reminder") shown until the first day is tapped. | Total; Calendar first open |
| Price-rise alerts (price watch) | B | A sample alert card ("Spotify goes up to $12.99 on Jan 3. Keep it?") with "$11.99 → $12.99 a month · +$12 a year". Uses a real checked price only. | Pro teaser; Settings → Notifications |

---

## 6. The 15 highest-impact recommendations (ranked)

| # | Do this | Example | Concrete application in Ditch | User / conversion |
|---|---|---|---|---|
| 1 | **Living list:** onboarding rows *are* the Home rows | Structured 8→18 [▸](https://mobbin.com/screens/2ccea049-12ce-490a-a0a0-3b9ad0ae5ed7) | The tick list, total "receipt" and You're set all use the Home row component (logo 40, name, plan, price right, next date). After You're set, Home opens with the rows already in place. No re-layout jump. | Control and continuity; completion + D1 |
| 2 | **Real banner prime, animated once, with an arrow** | Finch [▸](https://mobbin.com/screens/3e88469e-f60a-439d-ac4d-0bd06fd8eae4), Duolingo [▸](https://mobbin.com/screens/3a9230ea-4367-4a3c-a30a-d7027588b11c), Opal [▸](https://mobbin.com/screens/7252919d-22aa-4a38-b779-dd4687e2b080) | The first real reminder drops in (350 ms, Light), then "Tap Allow on the next screen" with a hand-drawn ink arrow placed where the system button will be | Notification opt-in = the product works |
| 3 | **Craft pass with §3** (rows 1–13, 22) | Flighty, Airbnb 2025 [▸](https://mobbin.com/screens/e6cad3f5-94c7-47a7-a4ff-ab951455076e) | One money formatter, one date formatter, ≤4 radii, one icon library, a `Pressable` pressed style, no emoji in chrome | Kills the "AI slop" feel; trust = trial→paid |
| 4 | **Echo the user's list on the paywall** | Speak "what we learned" [▸](https://mobbin.com/screens/69fe36fa-992f-4a20-bfeb-75c157fd9c97), Opal before/after [▸](https://mobbin.com/screens/f874f93b-8ef4-408a-bd23-101d703c2ae1) | A strip under the headline: 5 overlapping real logos + "6 subs · $1,157 a year · next charge Tue, Nov 17". Static, nothing moves. | The paywall is about *them* → trial starts |
| 5 | **Borrowed-trust line + always-visible Restore** | Blinkist [▸](https://mobbin.com/screens/1c74c6aa-ae67-4bdf-811f-9019e3ad8564), Headspace [▸](https://mobbin.com/screens/a9bf58c3-250a-4565-9808-c4722933ea54) | Under the price line: shield glyph + "Paid through Apple. Cancel in Settings anytime." Restore stays in the footer at 44pt. | Anxious users need the exit → trial starts |
| 6 | **"Free forever" said right before the ask** | Finch [▸](https://mobbin.com/screens/70fe0e89-9150-48bf-ae6b-1bb69803107f) | The last line of the reminders screen: "Your list stays free forever. Pro adds reminders on all 6." | Honesty lowers the guard → trial starts, fewer refunds |
| 7 | **Notification types as live sample cards** | Copilot [▸](https://mobbin.com/screens/2cff4fd7-5d58-4995-ab9d-24d6fea8a5b6) | Settings → Reminders: one card per type (3 days, 1 day, trial ending, price change, 30-day yearly) with the real text for their next sub, plus a switch. Pro types show a lock and open the paywall. | Control; a contextual paywall entry |
| 8 | **Privacy "Ditch never sees" sheet at the import ask** | Opal [▸](https://mobbin.com/screens/7d462c63-7051-4f8c-98b0-8035ded1aefb), Gentler [▸](https://mobbin.com/screens/709ce134-543f-433b-a4a7-73749b7992d3) | Before the photo picker: ✗ bank login ✗ email ✗ other photos · "Your list stays on your phone." (Never "nothing leaves your phone".) | Import use (Pro) |
| 9 | **Practice row for hold to ditch** | Duolingo streak simulation [flow](https://mobbin.com/flows/25145623-749c-4a2c-bd32-ddea59ee235d), Speak mic [▸](https://mobbin.com/screens/bfb35bd0-7f78-4007-900e-ad108f89fb9c) | A one-time "Try it" card with a pretend row; holding it plays the real Ditched moment, then the card leaves | Teaches the signature gesture; retention |
| 10 | **Setup ring on Home until done** | Revolut 1/5 [flow](https://mobbin.com/flows/fe848fd8-58f2-48d4-bdd5-627ae623fda0) | The top card "2 of 4 done": dates checked · reminders on · add a trial · try hold to ditch. It disappears when done. | Activation → retention → later upgrades |
| 11 | **A number promise up front** | Blinkist "STEP 1 OF 4" [▸](https://mobbin.com/screens/d4a99f21-9575-471e-9ae3-53c600de867d), Duolingo "7 quick questions" | Welcome sub-line ends with "4 quick steps."; the bar keeps its 4 segments | Onboarding completion |
| 12 | **One accent keyword per headline** | Structured [▸](https://mobbin.com/screens/2f8446b7-41a2-485c-a96f-5d0a10dc0faf) | In Archivo headlines, one key word sits on a hand-drawn sunflower marker stroke ("before **each charge**"); on yellow screens it's an ink underline. Max one per screen. | Scannable, distinctly ours |
| 13 | **Empty states with ghost rows** | Finch home, Revolut [flow](https://mobbin.com/flows/fe848fd8-58f2-48d4-bdd5-627ae623fda0) | Empty Home: 3 rows at 30% (Netflix, Spotify, iCloud+), the duck, "Nothing here yet. Add what you pay for." with one button | Gets the first add |
| 14 | **The launch screen equals Welcome's first frame** | Headspace [▸](https://mobbin.com/screens/43f17864-7e82-4968-a736-b41225e0ba74) | Sunflower background with the "ditch" wordmark at Welcome's exact x/y, so the headline fades in under it with no jump | The first second feels made, not assembled |
| 15 | **Mini timeline when adding a trial** | Strava [▸](https://mobbin.com/screens/40d104f8-8f25-4ae3-90eb-373e30e35acd), Blinkist timeline | In the Add trial sheet, a live 3-stop line from the user's dates (§5). Pro-gated beyond 3 picks per the free tier. | Trial alerts are the #1 fear (7 in 10 forgot one) |

**Not recommended, even though top apps do it:** ATT or sign-up before value (Opal, Speak), fake "analysing" waits, reviews or laurels we haven't earned, countdowns and strike-throughs, mascot on every screen, sound through the silent switch.

## Sources
- Mobbin flows and screens: linked inline (iOS, viewed Nov 18, 2026). Duolingo and Brilliant: `../duolingo-brilliant.md`.
- (Not Boring), "The Art of Game Feel": https://notbor.ing/words/the-most-satisfying-checkbox · "Behind the Design: (Not Boring) Habits" (Apple Developer).
- Apple, "Behind the Design: Flighty" (Jun 2023; airport-board conventions, Live Activities) · third-party teardown (type sizes, monospaced numbers): https://blakecrosley.com/guides/design/flighty (secondary, treat as indicative).
- Airbnb May 2025 redesign, dimensional icons: It's Nice That https://www.itsnicethat.com/articles/airbnb-app-redesign-140525 · Bloomberg, Jun 13 2025.
- Blinkist trial timeline, +23% conversion: https://uxplanet.org/how-solving-our-biggest-customer-complaint-at-blinkist-led-to-a-23-increase-in-conversion-b60ad514134b
- "7 in 10 have forgotten to cancel a free trial": Self Financial 2026 (see `../onboarding-v11.md` §2).
