# ditchsubs.app: copy and conversion audit (Nov 13, 2026)

Read-only audit. Sources: the code in `web/src` (home, cancel/[slug], prices/[slug], about, support, waitlist, 404, EmailBox, WaitlistStatus, Calculator, PriceTable, DitchDemo, HeaderBar, SiteFooter, api/subscribe, api/confirm), `docs/website/BRIEF.md`, `research-competitors.md`, `audit-2026-11-12.md`, `CLAUDE.md`, `DECISIONS.md`, `STATUS.md`.

**Note:** the local site at http://localhost:3100 did not answer (connection refused on every route), and I was told not to restart it. Every string below comes from the source, using the real data (Netflix US Standard is $19.99/mo, so the guide's yearly figure is $239.88).

Owner-approved items I did not reopen: the rotating hero "Ditch [logo] before it renews.", pricing option C, the ditch card with the duck, no founder note on home, no small print under the hero form.

---

## Score

| Area | Score | Why |
|---|---|---|
| Copy (voice, clarity, rules) | **7.5/10** | Mostly plain, short and on-voice. It loses points for 5 lines we can't fully back, about 8 vague lines, and "SAVE 49%". |
| Home as a funnel | **6/10** | The hero is clear but never says "iPhone", "coming soon" or "free". There's no proof yet. Five of the seven CTAs are links that jump back to the hero. The calculator, the moment people care most, has no form. Nothing gives a reason to join now rather than wait for the App Store. |
| Guides as a funnel | **5.5/10** | This is where most search traffic will land. The only in-page box says "Not ready to cancel?", which misses the reader who just cancelled. The side card sends people to the home page, which also loses the sign-up source. The "Yes, it worked" moment goes to a mailto link. |
| Form and states | **7/10** | One field, good error copy. Two states say untrue things ("We'll try again soon", "It may have expired"). There's no spam/Promotions hint after sign-up, and that's where double opt-in loses people. |
| **Overall** | **6.5/10** | The honest base is strong. Most of the gain is in placement and a few specific lines, not a rewrite. |

---

## 1. Line-by-line: every flagged string

Scores are out of 10. **Bold** = pick. Lines that pass aren't listed, except where a note helps.

### 1a. Things we can't back, or that break a rule (fix first)

| # | Where | Current | Problem | Option A | Option B | Pick |
|---|---|---|---|---|---|---|
| R1 | EmailBox, `unsent` state | "You're on the list. The confirm email didn't go out just now. We'll try again soon." | **Untrue twice.** Nothing retries (api/subscribe sends once). The person is also *not* on the list for launch day: only confirmed addresses go into the Resend audience (api/confirm). | **"Almost there. Our confirm email didn't send. Tap below to try again."** + a "Send it again" button that re-posts (the API already re-sends to unconfirmed rows) · 9 | "We have your email, but the confirm link didn't send. Try again in a minute." · 7 | A |
| R2 | Waitlist `?status=invalid` | "That link didn't work. It may have expired. Pop your email in again and we'll send a fresh one." | Tokens never expire (api/confirm only checks that the token exists). "Pop your email in" is fine but a bit twee. | **"That link didn't work. Put your email in again and we'll send a new one."** · 9 | "That confirm link didn't match. Try your email again." · 7 | A |
| R3 | Pricing, yearly tile | "SAVE 49%" | Breaks the site rule against "save" about money. (It's approved for the in-app paywall, DECISIONS #26, but BRIEF and research-competitors.md ban "save" on the site, and the lint only catches "you save".) The per-month line already does the job: $2.50 vs $4.99. | **Drop the badge. Keep "7 DAYS FREE" as the only badge** · 9 | "49% LESS THAN MONTHLY" · 6 | A |
| R4 | Home step 3 | "Hold to ditch. Ditch opens the official cancel page and shows you the steps." | Overclaims: per DECISIONS #41, 30 of 50 have a direct page, 19 only a help article, and NYT has none. "Ditch. Ditch" also reads badly. | **"Hold to ditch. Then go to the service's own cancel page, with the steps."** · 8 | "Hold to ditch. Ditch opens the cancel page when there is one, and the steps when there isn't." · 7 | A |
| R5 | Home ditch section tick | "Official cancel pages · The real page for each service, never a lookalike." | "for each service" overclaims (see R4). | **"Official cancel links · For 50 popular services, never a lookalike."** · 8 | "Official pages only · Straight from the service, never a lookalike." · 7 | A |
| R6 | FAQ "Why pay for a subscription tracker?" | "...two forgotten months of Netflix cost more than that." | The pricing heading only shows this while it's true (`cheaperThanNetflix`). The FAQ hard-codes it, so it goes stale if the price moves. | **Use the same condition in the FAQ, or swap in a sourced number:** "Pro is $29.99 a year, about $2.50 a month. People say they waste about $205 a year on subscriptions they don't use (CNET/YouGov, 2025). Rather not subscribe? Lifetime is $49.99, once." · 8 | Keep the Netflix line behind the condition · 7 | A (the stat is already in `STATS`, unused) |
| R7 | FAQ "Which countries…" | "Prices fill in for 12 countries…" | The site's calculator and price pages cover **17** (12 + MENA). If the app really has 12, say "in the app". Two numbers on one site look careless. | **"Prices fill in for 12 countries in the app (US, UK, Canada, Australia, much of Europe and India). Elsewhere you type the price in."** · 8 | Update the app to 17, then say 17 · 9 (if true at launch) | B if the app gets MENA, else A |
| R8 | Support lead | "We read every message and usually reply within a day." | This is a promise. The owner has 1 to 2 hours a week of upkeep (BRIEF). | **"We read every message and reply within 2 days."** · 8 | "We read every message. Most get a reply the same week." · 6 | A |
| R9 | Support meta description | "...and how to reach a person." | This echoes "A person answers", which the owner disliked. | **"...and how to email us."** · 8 | "...and who to email." · 7 | A |
| R10 | Hero lead (for reference) | "...get a reminder 3 days before each charge." | Free covers 3 subscriptions. Pricing and the FAQ cover this, so the risk is low, but the eyebrow (Top-10 #2) should carry "Free to track" so nobody feels baited. | Leave the lead. Fix through the eyebrow | | |

### 1b. Vague, clunky or repetitive lines

| # | Where | Current | Problem | Option A | Option B | Pick |
|---|---|---|---|---|---|---|
| V1 | FAQ "When does Ditch come out?" | "Soon." | This is the vaguest line on the site, and it's the question every waitlist visitor has. | **"We're testing it on real iPhones now. The day it's on the App Store, the waitlist gets one email."** (add the month once there is one) · 8 | "Early 2027, if testing goes well. You'll get one email the day it's out." · 9 (only if the owner commits to a window) | A now, B once there's a date |
| V2 | FAQ Android | "Not yet. Ditch is made for iPhone." | "Not yet" suggests a plan that doesn't exist. | **"No. Ditch is iPhone only, and there's no Android date."** · 8 | "Not for now. Ditch is built for iPhone: lock-screen reminders, Settings shortcuts, the works." · 6 | A |
| V3 | FAQ "Do reminders work when the app is closed?" | "...Opening it now and then keeps them topped up." | "Topped up" doesn't explain anything. Reliability is the product, so say how it works. | **"Yes. Ditch sets them on your iPhone up to a year ahead, so they arrive with the app closed. iPhone holds 64 at a time, so opening Ditch now and then tops them up."** · 8 | "Yes. They're set on your iPhone, not on a server, so they arrive with Ditch closed." · 7 | A |
| V4 | Home "How it works" H2 | "How it works: from sign-up to cancelled" | "sign-up" to what, Netflix or Ditch? | **"How it works: add it, get reminded, ditch it"** · 9 | "How Ditch works, in 3 steps" · 6 | A |
| V5 | Reminders lead | "Missed reminders are a common complaint about subscription trackers. Ditch sets every reminder on your iPhone…" | "a common complaint" is vague, and we hold a real number. | **"We read 5,535 App Store reviews of 17 subscription trackers. About 125 said reminders never came. Ditch sets every reminder on your iPhone and shows you the next one, so you know it's set."** · 9 | "In reviews of Bobby and Bill Tracker Pro, about 125 people said reminders never came. Ditch shows you the next one, so you know it's set." · 8 | A (source: docs/research/reviews-niche-2026-11.md) |
| V6 | Pro list | "A nudge if you miss one" | Miss what, a reminder or a charge? | **"A last call at 7 PM the day before"** · 8 | "A second nudge if you miss the first" · 7 | A (matches DECISIONS #44) |
| V7 | Ditch section lead | "Once you've cancelled, Ditch shows what it would have cost you in a year." | The app shows it at the ditch moment ("…once you cancel"), not after. Small mismatch. | **"Ditch it and see what it would have cost you in a year."** · 8 | "Hold to ditch, and Ditch shows the year you won't pay for." · 6 | A |
| V8 | Final section lead | "Be the first to know when it's out." | Cliché, and it skips the one promise that matters here: with no small print, people wonder about spam. | **"One email the day it's on the App Store. Nothing else."** · 9 | "We'll email you once, on launch day." · 8 | A |
| V9 | Final H2 | "Fewer surprise charges. More say in what renews." | Fine, a bit abstract. | Keep · 7 | "Know before every charge. Ditch what you don't use." · 8 | B (optional) |
| V10 | EmailBox checkbox | "Also send me the monthly Price Hike Report" | Readers don't know what the "Price Hike Report" is. | **"Also email me each month when Netflix, Spotify and others raise prices"** · 8 | "Also send the monthly price-rise roundup" · 6 | A |
| V11 | EmailBox `done` | "Check your inbox. We sent a link to X. Tap it to confirm your spot." | Good. It's missing the line that saves lost confirmations. | **Add: "Not there in a minute? Check Spam or Promotions."** · 9 | | A |
| V12 | EmailBox `closed` | "Sign-ups open very soon. Nothing was saved yet. Try again in a day or two." | "very soon" is vague. | **"Sign-ups aren't open yet, so we didn't keep your email. Try again tomorrow."** · 8 | keep · 6 | A |
| V13 | Cancel guide box H2 | "Not ready to cancel?" | Most readers *are* cancelling. It speaks to the minority (see section 3). | **"Cancelled it? Catch the next one."** · 8 | "Keeping it for now? Get a reminder first." · 7 | Use both in a two-path box (section 3) |
| V14 | Cancel guide box body | "…It can't cancel for you. It makes sure you don't forget." | Defensive, and "makes sure" is a guarantee. | **"Ditch reminds you 3 days and 1 day before Netflix renews, so you can decide in time. You still cancel on Netflix's own page."** · 8 | keep · 6 | A |
| V15 | Guide side card | "Get a reminder first" | First before what? Also links to `/#join` on the home page (see Top-10 #4). | **"Get a reminder before Netflix renews"** · 9 | "Know before the next charge" · 7 | A |
| V16 | Nav | "Prices" next to "Pricing" | Two near-identical labels side by side. Visitors can't tell which is Ditch's price. | **"Prices" → "Subscription prices"; "Pricing" → "Free & Pro"** · 8 | "Pricing" → "Ditch Pro" · 7 | A |
| V17 | About, para 1 | "…and nothing I tried felt right." | Vague. The next paragraph has the real reasons. | **"I'm Aribo. I made Ditch to keep track of my own subscriptions, because every app I tried got something basic wrong."** · 8 | Cut the clause: "I'm Aribo. I made Ditch to keep track of my own subscriptions." · 7 | A |
| V18 | About, para 3 | "Reminders are planned on your iPhone and checked every time you open the app." | "planned" is odd. | **"Reminders are set on your iPhone and topped up every time you open the app."** · 8 | | A |
| V19 | About | (no CTA) | The page with the most trust has no next step. | **Add EmailBox (compact), H3 "Want it when it's out?"** · 8 | Link "Join the waitlist →" · 6 | A |
| V20 | Support | "iCloud backup is coming to Pro." | A promise with no date. | **"iCloud backup is planned for Pro."** · 7 | keep · 6 | A |
| V21 | Calculator receipt button | "Remind me before these renew" | Promises reminders, but the button gives a launch email and then jumps to the top of the page. | See Top-10 #1 | | |
| V22 | Pricing heading | "Pro costs less than two months of Netflix." | Good (8). Saying "a year" makes it exact. | **"Pro is $29.99 a year. Less than two months of Netflix."** · 9 | keep · 8 | A |
| V23 | Trust H2 | "Private by design: no bank login, no account" | "Private by design" is a stock phrase, but it's descriptive and keyword-first. | keep · 7 | "Your list stays on your phone: no bank login, no account" · 8 | B (reuses the approved true phrase) |
| V24 | Waitlist page, confirmed | "One email when Ditch is on the App Store. While you wait, see what your subscriptions cost." + "Try the calculator" | Fine but a dead end. See Top-10 #10. | | | |

### 1c. Lines that already work (keep)
- Hero lead: "Track every subscription in one list and get a reminder 3 days before each charge. No bank login, no account." Keyword-first, ankidecks-style (8.5).
- Calculator: "Tap the ones you pay for. Prices fill in for your country, checked by hand." and "This runs in your browser. We don't see what you tap." This is the best trust line on the site (9).
- "Netflix renews in 3 days. $19.99. Still watching?" (9).
- Lifetime strip: "Everything in Pro, and it never renews. For people who are done with subscriptions." (8.5). It hits the "subscription to track subscriptions" objection directly.
- "Honest about cancelling: Ditch can't cancel for you, and it won't pretend to." (9).
- pc-foot: "US prices. Your App Store shows your price before you pay. Cancel Pro anytime in iPhone Settings." (9).
- Guide short answer, "Not sure? Check your bank statement: APPLE.COM/BILL means Apple bills you." (9, and no rival does this).
- 404: "Nothing here. Not even a subscription." (8).
- Error copy: "That email doesn't look right. Check for a typo." (9).

---

## 2. Home page as a funnel

### 2a. The 5-second test (iPhone, first screen)
A visitor sees: rotating logos ("Ditch [Netflix] before it renews."), the lead, an email box with "Join the waitlist", and two lock-screen reminders.

| Question a visitor asks | Answered in 5 s? |
|---|---|
| What is it? | **Yes**. The logos plus "Track every subscription… reminder" do it. |
| Is it for my phone? | **Partly**. Only the lock-screen picture says iPhone. The word never appears above the fold. |
| Can I get it now? | **No**. Nothing says it isn't out yet. The button is the only hint, and people who expect an App Store badge bounce. |
| What does it cost? | **No**. "Free" doesn't appear until the pricing section. |
| Why trust it? | "No bank login, no account" helps. There's no proof. |

Benchmark: Descript's waitlist hero puts a **"Coming soon" pill** above the H1. Ankidecks puts **"Used by 6,000+ students"** as an eyebrow and **"Free to try · No credit card needed"** next to the CTA. RecurDash's subhead ends with **"We never ask for your bank login."** (Mobbin: Descript, ISO Meet, Base; ankidecks.ai, recurdash.com, fetched Nov 13). ISO Meet puts **"5,000+ creatives already signed up"** under the form.

**Fix:** an eyebrow above the H1 (it isn't small print under the form, so the owner's rule holds): **"Free iPhone app · Coming soon"**. Once the confirmed count passes about 100, add **"· 214 people waiting"**, a real number from D1. Never fake or round it up.

### 2b. Proof and trust
Pre-launch, there are no ratings or testimonials to show, and inventing them is off the table. The real, specific proof we hold, ranked by how much it moves a skeptical 23 to 40-year-old:
1. **"We read 5,535 App Store reviews of 17 subscription trackers"**, which shows we know why the others fail (reviews-niche-2026-11.md).
2. **Hand-checked prices in 17 countries, with the date**. The calculator shows this, and RecurDash is US-only.
3. **Official cancel links for 50 services, checked by hand**. RecurDash shows "319 cancel guides" as a stat, and our count is honest too.
4. **A real waitlist count** (above).
5. **"This runs in your browser. We don't see what you tap."** (already there).

The Tines "Sounds… hard to believe?" section (Mobbin) is the pattern: name the doubt, then show receipts. Ditch's version is the reminders section (V5).

### 2c. Objection handling

| Objection | Where it's handled now | Grade | Fix |
|---|---|---|---|
| Privacy ("will it read my bank?") | Hero lead, trust cards, FAQ | A | V23 (optional) |
| "A subscription to track subscriptions?" (~115 reviews raise it, DECISIONS #42) | Pricing H2 (Netflix comparison), Lifetime strip, FAQ #2 | B+ | R6: use the sourced $205 stat that's already in `STATS` but unused |
| Will reminders actually arrive? (Bobby's #1 complaint) | "Reminders that actually arrive" + "Test it in 5 seconds" | B | V5 (a real number), V3 (how it works) |
| Android | FAQ | B- | V2 |
| "When?" | FAQ "Soon." | D | V1 |
| "Will you spam me?" | Fine print on the guide forms only. The hero and final forms have none (owner choice) | C | V8: the final section's lead carries the promise as a heading, not small print |

### 2d. CTA count and placement
On home: header "Join" (sticky, always visible), hero form, calculator link (jumps to the hero), 3 pricing buttons (each jumps to the hero), final form. That's **2 real forms and 4 links that jump back to the top**. A jump to the top on iPhone pulls the reader away from the content that persuaded them. They land on the hero, and some don't scroll back.
- Add a real form where motivation peaks: the calculator receipt (Top-10 #1).
- Pricing: swap the 3 identical jump buttons for one inline form under the cards (Top-10 #5). Three "Join the waitlist" buttons under three prices also read like "buy" buttons on a page where nothing can be bought yet.
- `StickyCta.tsx` isn't mounted anywhere. It's dead code. The sticky header's "Join" already covers this, so delete it or keep it out.

### 2e. Form friction
It's already minimal: one field, `type=email`, `autocomplete=email`, inline validation, no captcha. Good. The friction is *after* the form:
- **Double opt-in leaks.** Reported confirmation rates run from 31 to 42% (Klaviyo community) up to 65 to 90% (HubSpot community). No rigorous benchmark exists, but every source agrees it's a real loss. A "Check Spam or Promotions" line (V11) and a subject line that says what to do ("Tap to confirm: Ditch waitlist") are the cheap fixes. Also track `confirmed / submitted` per `source` in D1.
- **Button wording.** The first-person CTA tests (ContentVerve/Unbounce: "Start **my** free trial" beat "your" by 90% in one test; Aagaard reports 30 to 90% across tests, with a warning that results vary) point to a specific, first-person button. Options:

| Button | Score | Note |
|---|---|---|
| "Join the waitlist" (now) | 6 | Clear, generic, and doesn't say what you get |
| **"Email me when it's out"** | **8.5** | First person, says exactly what happens, matches the one-email promise |
| "Get the launch email" | 7 | Accurate, a bit flat |
| "Remind me at launch" | 7 | On-theme, but "remind" may blur with the app's reminders |

Pick: **"Email me when it's out"** in the forms. Keep "Join the waitlist" / "Join" as the header nav label, where a short noun phrase reads better. This is a wording change, not a structural one. If the owner wants one label everywhere, keep the current one and A/B test it later.

### 2f. What the waitlist should promise
Now it promises "one email when it's out", which is honest but gives no reason to join *today* rather than search the App Store later. Honest reasons, strongest first:
1. **The launch-day email with the App Store link** (have it).
2. **The monthly price-rise email** (Price Hike Report). It's real ongoing value, but it's hidden in the guide forms. Offer it on the confirmed page (Top-10 #10).
3. **A real waitlist-only launch offer.** For example, an App Store offer code for 1 extra free month of Pro, or Lifetime at a launch price for the first week. This is only OK if it's real, has a stated end date and no countdown timer (rule 4). **Only the owner can decide this.** Without it, don't hint at "early access" or "perks".

### 2g. Benchmarks for "good"
- Unbounce 2024 (41,000+ pages): median landing-page conversion is **6.6%**, finance about 8.3%. Copy at a 5th to 7th-grade reading level converts at **11.1%** vs 5.3% for professional-level copy. Word count and hard words both correlate negatively (-18.6%, -24.3%). Mobile converts about 8% lower than desktop. These are correlations, not experiments.
- Waitlist pages: vendor-sourced numbers run from **5 to 10%** for mixed traffic up to **10 to 20%+** for warm traffic (LaunchList, SeedProd, Flowjam). There's no independent study. Cold SEO traffic to guides will convert far lower than the home page, so track by `source`.
- RevenueCat SOSA 2026: median annual price is about $34.80, so $29.99/yr sits just under the norm and the "less than two months of Netflix" framing holds. RevenueCat publishes no solid lifetime-share data. A third-party playbook claims lifetime/one-time is about 10% of app revenue (unverified).

---

## 3. Guide pages as a conversion surface

Guides and price pages will get most of the search traffic. The reader arrives with one job ("cancel Netflix"), and most finish it in under a minute.

**What's there now (Netflix):** short answer → "Open Netflix's cancel page ↗" → how you pay → steps → Apple → "No cancel button?" → **"Not ready to cancel?" + email box** → US prices → "Did this work? [Yes, it worked] [No, something changed]" (mailto) → related guides. Side card: "Get a reminder first" → `/#join` (home page).

**Problems**
1. **Wrong moment, wrong reader.** "Not ready to cancel?" talks to people who aren't cancelling. Most readers either cancel or are about to.
2. **The success moment goes nowhere.** Someone who just cancelled Netflix feels good and is ready to act. "Yes, it worked" opens their mail app. That's the web version of the DITCHED moment, and it's being missed.
3. **The side card leaves the page.** `/#join` drops the reader on the home hero and records the sign-up as `home-hero`, so you can't tell guides are working.
4. **The cancel button sends people to netflix.com in the same tab.** That's correct (official link), but there's no "come back" hook. `rel="noopener"` with no `target` means they leave. That's fine. The fix is to catch them *before* they click and *after* they come back.

**What makes a reader who just cancelled Netflix join**
- Show the number they just stopped paying, in the house phrase: **"$239.88 a year you won't pay."** This is real data from the page's own price table and never "saved".
- Point to the next one: "What else renews this month?" People who cancel one subscription usually have others they forgot (70% have forgotten to cancel a trial at least once, Self Financial 2026, per DECISIONS #39).
- Make the promise small and exact: one email at launch.

**Proposed two-path box** (replaces "Not ready to cancel?", same spot, plus a short version right under the short-answer buttons):

> **Cancelled it? Catch the next one.**
> Netflix Standard is $239.88 a year you won't pay. Ditch is a free iPhone app that reminds you 3 days and 1 day before your other subscriptions renew.
> [you@email.com] [Email me when it's out]
> *Keeping Netflix? Ditch will remind you before it renews, too.*

**"Did this work?" → in-page reveal** (no tracking, no mailto for "yes"):
> Tap "Yes, it worked" → the card flips to: **"Nice. $239.88 a year you won't pay."** + the duck + compact email box "Want a reminder before the rest renew?"
> Keep "No, something changed" as the mailto.

**Side card:** "Get a reminder before Netflix renews" · "3 days and 1 day before each charge. Free on 3 subscriptions." · button scrolls to the in-page box (`#remind`). No more `/#join`.

**Price pages:** "Paying for Netflix? Ditch reminds you 3 days and 1 day before it renews, so you can decide before you pay." is good (8). Add the yearly figure as the hook: **"Netflix Standard is $239.88 a year in the US. Ditch reminds you 3 days and 1 day before it renews, so you can decide before you pay."** (9).

---

## 4. Top 10 changes most likely to lift waitlist sign-ups

The impact numbers are my estimates of the relative lift in sign-ups from the affected traffic, based on the evidence cited. None is measured, so verify each by `source` in D1.

### 1. Put a real email form in the calculator receipt
- **Why:** this is the most motivated moment on the site. The visitor has just seen their own yearly total. Today the button jumps them back to the hero, and its label promises reminders the form can't give.
- **Copy:** under the total, "**Get a reminder before these renew.** Ditch is a free iPhone app, coming soon." · [you@email.com] [**Email me when it's out**] · source `home-calc`.
- **Impact:** high. My estimate is +15 to 30% on home sign-ups. Interactive tools that create a personal number are a known lead-capture pattern (RecurDash's "Netflix costs you $X a year" is its centrepiece), and removing a scroll-jump removes a drop-off point.
- **Serves the user:** it turns their anxiety ("$1,1xx a year?!") into one easy step.

### 2. Hero eyebrow: "Free iPhone app · Coming soon"
- **Why:** it answers the 3 five-second questions the hero misses (which phone, can I get it now, what does it cost). This is an eyebrow above the H1, not small print under the form.
- **Copy:** **"Free iPhone app · Coming soon"**. Later: "Free iPhone app · Coming soon · 214 people waiting" (real D1 count, only once it's at least about 100).
- **Evidence:** Descript's "Coming soon" pill, Ankidecks' eyebrow and "Free to try" line (Mobbin, ankidecks.ai). Unbounce: clarity and reading ease correlate with conversion.
- **Impact:** medium-high, +5 to 15%. It mostly stops "where's the download button?" bounces.

### 3. Guides: the "Cancelled it?" box and the "Yes, it worked" reveal
- **Copy:** as in section 3: "**Cancelled it? Catch the next one.** Netflix Standard is $239.88 a year you won't pay. Ditch is a free iPhone app that reminds you 3 days and 1 day before your other subscriptions renew." and the reveal "**Nice. $239.88 a year you won't pay.**"
- **Evidence:** this is the web version of the app's DITCHED moment (CLAUDE.md rule 8). A guide reader's peak emotion comes just after success. The current box only speaks to people who aren't cancelling.
- **Impact:** high on guide traffic. My estimate is 2 to 3× the current guide sign-up rate, from a low base. Guides will be most of the site's traffic (SEO-first, DECISIONS #18).

### 4. Side cards stay on the page, and name the service
- **Copy:** "**Get a reminder before Netflix renews**" · "3 days and 1 day before each charge. Free on 3 subscriptions." · [Email me when it's out] scrolls to `#remind` on the same page (or holds a compact form inline).
- **Why:** `/#join` throws away the context and mislabels the source as `home-hero`, so you can't measure guides at all.
- **Impact:** medium, +10 to 20% of side-card clicks converting, plus correct attribution, which makes every later test possible.

### 5. Pricing: one inline form instead of 3 jump buttons, and drop "SAVE 49%"
- **Copy:** under the cards: "**Pro starts with 7 days free when Ditch launches.** Get one email that day." [you@email.com] [Email me when it's out] · source `home-pricing`. Remove the "SAVE 49%" badge (R3). Heading: "**Pro is $29.99 a year. Less than two months of Netflix.**" (V22).
- **Evidence:** three identical buttons under three prices look like checkout buttons for something not yet on sale. A form at the point of a price decision avoids the scroll-jump. "Save" breaks the site's own rule.
- **Impact:** medium, +5 to 10% of pricing-section readers. The pricing structure (option C) stays.

### 6. Fix the post-submit states (honesty first, then confirmations)
- **Copy:** `done` + "**Not there in a minute? Check Spam or Promotions.**" · `unsent` → "**Almost there. Our confirm email didn't send.**" + [Send it again] · invalid link → "**That link didn't work. Put your email in again and we'll send a new one.**" · confirm email subject → "**Tap to confirm: Ditch waitlist**".
- **Evidence:** double opt-in confirmation rates run from about 31 to 42% to 65 to 90% depending on the source (Klaviyo/HubSpot communities). Every unconfirmed address is a lost launch-day download. Two current lines are untrue (R1, R2).
- **Impact:** medium, +5 to 15% confirmed per submitted, and it removes two honesty problems.

### 7. Specific CTA and promise at the close
- **Copy:** final H2 can stay. Lead → "**One email the day it's on the App Store. Nothing else.**" Button in forms → "**Email me when it's out**".
- **Evidence:** first-person, outcome-specific buttons beat generic ones (ContentVerve/Unbounce, 30 to 90% in Aagaard's tests, with mixed results across languages). Saying "nothing else" answers the spam worry where there's no fine print.
- **Impact:** medium, +5 to 10% on the final form. Treat it as an A/B test if the owner wants to keep "Join the waitlist".

### 8. Make the reliability proof specific
- **Copy:** reminders lead → "**We read 5,535 App Store reviews of 17 subscription trackers. About 125 said reminders never came. Ditch sets every reminder on your iPhone and shows you the next one, so you know it's set.**" FAQ V3. Pro bullet V6.
- **Evidence:** the target user wants reliability. Specific numbers beat "a common complaint". Tines' "Sounds… hard to believe?" pattern (Mobbin). The data is ours and documented.
- **Impact:** medium. It's indirect: trust → more people scroll to a form.

### 9. Answer "when?", "Android?" and "is it worth paying for?" plainly
- **Copy:** V1 "**We're testing it on real iPhones now. The day it's on the App Store, the waitlist gets one email.**" (add a month when the owner commits). V2 "**No. Ditch is iPhone only, and there's no Android date.**" R6 with the sourced $205/yr stat. R7 country count.
- **Evidence:** "Soon." is the vaguest line on the site, on the question every waitlist visitor has. The $205 stat is already approved and sourced in `STATS`, but unused.
- **Impact:** low-medium, plus it removes stale or contradicting claims.

### 10. Turn the confirmed page into a next step
- **Copy:**
  > **You're on the list.**
  > One email the day Ditch is on the App Store.
  > **Want the monthly price-rise email too?** Netflix, Spotify and others raise prices every year. We'll tell you when. [Yes, add it] *(one tap, sets `report=1`)*
  > **Know someone who forgets free trials?** [Share ditchsubs.app] *(native share sheet, no tracking)*
  > **Something to cancel today?** [Browse cancel guides]
- **Evidence:** the waitlist referral pattern (Going, Tash on Mobbin; Tash's gamified tiers would break the honest tone, but a plain share works). This is the only page every confirmed person sees.
- **Impact:** medium for list growth. Each share brings warm traffic, which converts 2 to 3× cold traffic (LaunchList/vendor data).

### Also worth doing (smaller)
- Nav: "Prices" → "Subscription prices", "Pricing" → "Free & Pro" (V16).
- About: add a compact waitlist form (V19), fix V17/V18.
- Support: R8, R9, V20.
- Copy lint: add `/\bsave \d+%/i` and `/\bsave\b/i` near money to `BANNED` in `lib/checks.test.ts`, so "SAVE 49%" can't come back on the site.
- Delete the unused `StickyCta.tsx` (dead code).
- Measure: a confirmed/submitted ratio and sign-ups per `source` (home-hero, home-calc, home-pricing, home-final, cancel-*, prices-*) from D1. Cloudflare Web Analytics gives the visits. That's enough for an honest conversion rate per placement, with no new tracking.

---

## 5. Only the owner can decide
1. Whether to offer a **real** waitlist launch offer (an offer code for an extra free month, or a launch-week Lifetime price) with a stated end date and no countdown. Without one, don't say "early access" or "perks".
2. Whether to commit to a launch month for the FAQ (V1).
3. Whether to change the form button from "Join the waitlist" to "Email me when it's out" (or A/B test it).
4. Whether the app gets MENA prices before launch (R7: 12 vs 17).
5. A support reply time you can keep (R8).

---

## Sources
- Mobbin sections: [Descript waitlist hero](https://mobbin.com/sites/sections/c330ae44-f7ff-4fdd-a84a-e3a50507a182), [ISO Meet waitlist hero](https://mobbin.com/sites/sections/c494bf4c-177f-4b26-830f-1168406fd48f), [Base waitlist](https://mobbin.com/sites/sections/75fb9e38-9f05-494f-92ab-86ff2a2e5efd), [Tines "Sounds… hard to believe?"](https://mobbin.com/sites/sections/58a55724-34ad-4dc5-accb-743f3b00cd68), [Revolut proof strip](https://mobbin.com/sites/sections/09ae3406-2495-4c11-94b4-843ac935049b), [Monologue FAQ](https://mobbin.com/sites/sections/db650941-8219-42f4-8053-64fa5cd5c8f1), [Family FAQ](https://mobbin.com/sites/sections/e64d9ea0-551d-4122-823a-cac8c58e8661), [Going referral](https://mobbin.com/sites/sections/a6697569-fdd0-4f72-a318-9d4e4ad0e445), [Tash waitlist tiers](https://mobbin.com/sites/sections/8fc473ec-1a77-46f5-9169-8ec25ae7eeeb)
- Live pages (fetched Nov 13, 2026): [ankidecks.ai](https://ankidecks.ai) (eyebrow "Used by 6,000+ students", "Free to try · No credit card needed", hero "Turn your lectures into Anki flashcards"); [recurdash.com](https://recurdash.com) ("Catch every subscription before it renews", "We never ask for your bank login.", "Create free account", 319 guides / 329 prices, $48/yr with a 30-day money-back guarantee); [rocketmoney.com](https://www.rocketmoney.com) ("Join 10 million+ members"); [getsubby.app](https://getsubby.app) (no proof, no pricing, no FAQ); Bobby has no real site ([App Store](https://apps.apple.com/us/app/-/id1059152023)). Chronicle and Recurrent: no live landing pages found (research-competitors.md calls Chronicle neglected).
- [Unbounce 2024 Conversion Benchmark Report (PR Newswire)](https://prnewswire.com/news-releases/unbounces-2024-conversion-benchmark-report-proves-that-attention-spans-are-declining-and-so-are-conversion-rates-302239407.html): 6.6% median, reading level 11.1% vs 5.3%. [Search Engine Journal on the mobile gap](https://searchenginejournal.com/new-report-reveals-an-8-mobile-landing-page-conversion-gap/557513).
- Waitlist benchmarks (vendor-sourced): [LaunchList waitlist benchmark](https://app.getlaunchlist.com/tools/waitlist-benchmark), [SeedProd coming-soon conversion](https://www.seedprod.com/coming-soon-page-conversion-rate/), [Flowjam calculator](https://www.flowjam.com/blog/waitlist-conversion-calculator).
- Double opt-in: [HubSpot community](https://community.hubspot.com/t5/Email-Deliverability/Benchmark-for-Double-Opt-in/td-p/506332), [Klaviyo community](https://community.klaviyo.com/marketing-30/newsletter-subscription-opt-in-rate-2047).
- First-person CTAs: [MarketingExperiments/Sherpa write-up](https://marketingexperiments.com/?p=12262), [ClickZ](https://clickz.com/me-vs-you-how-pronouns-affect-click-conversion-rates/32596/).
- [RevenueCat State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps): median annual price about $34.80.
- Internal: docs/research/reviews-niche-2026-11.md (5,535 reviews, ~70 Bobby + ~55 Bill Tracker Pro missed-reminder reviews), DECISIONS #11, #26, #39, #41, #42, #44, `web/src/lib/site.ts` STATS (CNET/YouGov 2025, ~$205/yr).
