# Paywall v11: say what Pro adds, fit every screen

Written Nov 10, 2026. Builds on `paywalls-competitors.md` and `pricing-regional-and-plans.md` and doesn't repeat them. Changes no locked decision. Where a pick touches one (#6b lifetime line, #15 trial reminders, #21 devices), it says so.

## Summary (read this first)
1. **The fix for "what do I get vs free?":** swap the 2-line checklist for a small **Free | Pro table** (5 rows). Adapty calls these tables "one of the most consistent paywall additions among top apps right now".
2. **Personalise the table, not just the headline:** the heads-up row reads **Free "3" · Pro "All 6"**. Only 2% of paywall headlines use what the app knows about the user (Adapty), so ours already stands out.
3. **Trial timeline: 4 steps down to 3, in plain words.** "Today · Free" → "Sat, Nov 14 · Heads-up" → "Tue, Nov 17 · $29.99". Drop the second reminder date, the "9 AM" labels, the bell icons and the "ditch Pro trial" card.
4. **Cut "We'll remind you before we charge, too."** (owner's call). The one-word "Heads-up" step stays, because CLAUDE.md rule 4 requires a reminder day and because 32–55% of trials get cancelled on day 0 by people afraid of forgetting.
5. **Plans become 3 tiles side by side** (Comet, Fixtured, Bevel). That saves about 80pt, so Lifetime stops getting cut off on the owner's iPhone 12.
6. **Your logos replace the big duck in the header:** "Netflix, Spotify + 4 more" under the headline. Real logos are already one of Ditch's four personality pieces.
7. **Social proof: none for now.** We have no ratings, and fake laurels break our honesty rules. Add the real App Store rating once it's earned.
8. **One page, at the end of onboarding.** Onboarding paywalls convert about 4× better than later ones (Adapty). Our total-reveal and reminder screens already do the "value first" job that multi-page paywalls do.
9. **Size rules:** three height classes (compact < 700pt, regular 700–880, roomy > 880), a 440pt max-width centred column on iPad, and scrolling only at large text sizes. The × and the buttons always stay visible.
10. **Pick: Layout A (table + tiles + 3-step strip), 9/10.** A two-page version (D, 7.5/10) is worth testing once there's enough traffic.
11. **Don't list price-rise alerts** until they ship (Joi marks unbuilt features "Soon"; we just leave them off).
12. **AppKittie has no paywall captures in its API**, only store data. I used it for competitor reviews, which show that buyers punish Pro being unclear.

---

## 1. What I looked at
- **Mobbin:** 44 iOS screens, all new for this note. 15 Free-vs-Pro tables, 15 trial timelines, 14 benefit lists and personalised paywalls. Links in §8. Bear, Cal AI, Calm, Headspace and Monarch are already covered in `paywalls-competitors.md` §1. Flighty returned no paywall on Mobbin. Things has no subscription.
- **AppKittie API:** it offers app search, details, revenue estimates, in-app purchase lists and reviews, but **no paywall screenshots** ([docs](https://www.appkittie.com/docs)). I pulled 300 Bobby reviews and Orbit's reviews (§2.4).
- **Data:** RevenueCat State of Subscription Apps 2026, Adapty State of Paywalls (Nov 2026) and High-performing paywall (Mar 2026), Superwall's multi-page study and Stompers case, RevenueCat's redesign case studies, and Blinkist's write-up. All of them are vendors reporting their own numbers, so read them as direction, not proof.

## 2. What the screens show

### 2.1 Free vs Pro tables
| App | Rows | Free cells | Pro column | Plans on the same screen? | Link |
|---|---|---|---|---|---|
| Comet | 6 | ✓ on 1, "—" on 5 | teal text | **Yes**: 2 tiles + CTA, no scroll | [▸][comet] |
| Structured | 8 | ✓ on 2, ✗ on 6 | — | Price line, CTA, "Skip For Now" | [▸][structured] |
| Fixtured | 6 | ✗ on all | blue column | Yes, plus a review card and 2 tiles | [▸][fixtured] |
| Brilliant | 5 | ✓ on 1, ✗ on 4 | gradient-bordered column | "Remind me later" / "Learn more" | [▸][brilliant] |
| Speak | 7 | ✓ on 4, "—" on 3 | tinted column | CTA "Try for $0.00, then $129.98 per year" | [▸][speak] |
| Matter | 11 | ✓ on 3, blank on 8 | — | No, plans are on a separate page | [▸][matter] |
| Jomo | 8+ | grey ✓ on 3, blank | "Plus ✦" pill | No, scrolls | [▸][jomo] |
| Cleo | 6 | **numbers**: "Up to $250" vs "Up to $500" | green column | "Continue with Builder" / "Not right now" | [▸][cleo] |
| Monzo | 5 | numbers + ✗ across 4 tiers | — | No | [▸][monzo] |
| Insight Timer | 8+ | ✓ on 1 | cream column | Yes, but cut off | [▸][insight] |
| Lifesum | 5 | ✓ on 1 | green column | Yes, but with a fake "50% off" strike-through | [▸][lifesum] |
| AllTrails · SCMP · Acorns · Coffee Meets Bagel | 11–15+ | mixed | tinted | No, long scroll | [▸][alltrails] [▸][scmp] [▸][acorns] [▸][cmb] |

What this means for Ditch:
- **Short tables sell, long ones get scrolled past.** The tables that fit beside the plans have 5–8 rows (Comet, Structured, Fixtured, Brilliant). Tables with 11+ rows (AllTrails, SCMP, Acorns) push the price off screen. Adapty: apps that "bury feature information in a long text list are asking users to do work they won't do" ([Mar 2026][ad-hp]).
- **A ✓ in the Free column builds trust.** Matter, Speak, Structured and Comet tick what you keep. For a user who feels guilty about money, "your list stays free" lowers the guard. Ditch's free tier is generous, so show it.
- **Numbers in cells beat ticks when the difference is "how many".** Cleo ("Up to $250" vs "Up to $500") and Jomo ("Includes 1 lock") do this. Ditch: **"3" vs "All 6"**.
- **✗ vs "—":** ✗ reads as a scolding next to a free plan. A dash (Speak, Comet) is calm. Pick the dash.
- **Unsourced claims are common:** "5x more likely" (Lifesum), "3x more likely" (AllTrails), "94% of members reported…" (Insight Timer). These break our "never claim" rules.

### 2.2 Trial timelines
| App | Steps | Labels | Charge step | Link |
|---|---|---|---|---|
| foodpanda | 3, **one line each**, inside the plan card | "Today", "Day 89", "Day 91" | "Plan starts and billing begins" + price | [▸][foodpanda] |
| Blinkist | 3 | real dates "Mar 31", "Apr 2" | "Become a member" | [▸][blinkist] |
| Mimo · 5MJ · Strava | 3 | relative "In 12 days" / "In 2 days" | Strava: "You'll be charged S$ 169.00" | [▸][mimo] [▸][5mj] [▸][strava] |
| Headway · Kitchen Stories · Mesh | 3 | "Day 5", "Day 12" | Kitchen Stories adds a real date in bold | [▸][headway] [▸][kitchen] [▸][mesh] |
| Copilot · TIDE · pillowtalk · Flo · Dropbox | 3 | mixed | TIDE: "You'll be charged on 02/15" | [▸][copilot] [▸][tide] [▸][pillowtalk] [▸][flo] [▸][dropbox] |
| Vocabulary | 4, the first one crossed out | real dates | "Become member" | [▸][vocab] |
| N26 | **5**, three of them reminders | "10 days left" | "Your free trial ends" | [▸][n26] |

- **13 of 15 use 3 steps.** The busiest one I saw is N26, with three reminder rows, and that's the shape of our current 4-step version (two reminder dates plus "9 AM heads-up").
- **The cleanest is foodpanda:** three single lines inside a card. Each step is a date plus 2–4 plain words.
- **Real dates are rare but honest** (Blinkist, Vocabulary, Dropbox). Keep real dates; just say less under each one.
- Only 24% of trial paywalls show a timeline at all. Most use one "Cancel anytime" line instead. Tests that explained how the trial works lifted money per user by **12–36%** ([Adapty, Nov 2026][ad-sop]). Blinkist's timeline paywall: **+23% trial starts and 55% fewer subscription complaints** ([Blinkist write-up][blinkist-case]).

### 2.3 Benefit lists and personalisation
- **Icon lists only say what Pro has, never what Free keeps:** Orbit ("Unlock all features", 6 two-line rows), Bevel, Hatch, Locket, NGL ([▸][orbit] [▸][bevel] [▸][hatch] [▸][locket]). That's exactly the owner's complaint about our current list.
- **Joi shows a one-word list** and greys out "iCloud backup · Soon" ([▸][joi]). It's honest, but adds a line. For Ditch: leave price-rise alerts off the paywall until they're built.
- **Personal lines:** AllTrails "The real adventure starts now, Alex", Lifesum "Alex, be 5x more likely…", Opal "Gain 2+ Hours Back" over a before/after chart ([▸][peak] [▸][lifesum] [▸][opal]). Only Opal uses the user's *own data*. Ditch has better data than all of them: the user's actual subscriptions.
- **Free as a real choice:** Duolingo's "Learn for free" card, Structured's "Skip For Now", Cleo's "Not right now" ([▸][duo-free] [▸][structured] [▸][cleo]). This backs our "Continue free: reminders for 3".
- **Bad patterns seen:** a pre-selected weekly plan (Moonly [▸][moonly]), unbuilt features listed as if they exist, and rows of laurels.

### 2.4 What competitor buyers say (AppKittie review pull)
- **Bobby** (AppKittie revenue estimate $32.6k; the API doesn't say for what period; sells one-time packs at $0.99–$2.99): *"Found this out AFTER i bought the premium upgrade"* (1★, no auto-import). *"Only let me add 5 accounts and now demands an upgrade"* (1★). *"I cannot STAND apps that lock dark mode behind a paywall"* (1★). 39 of 300 reviews mention paying.
- **Orbit** ($19.99/yr, $24.99–39.99 lifetime): *"I immediately regretted paying for it"* (2★). *"Flagship features don't work correctly"* (2★, import).
- **Lesson:** regret comes from not knowing exactly what Pro does. The table has to be literal: "Import screenshots anytime", never "Magic import". Ditch already avoids the "5 then pay" anger, because tracking is unlimited and free.

## 3. The data: what lifts conversion
| Lever | Evidence | What Ditch does |
|---|---|---|
| **Placement in onboarding** | 93% of first purchases happen on install day. Onboarding paywalls convert 0.85% of views vs 0.23% for later ones. 60% of buyers buy on their first paywall view ([Adapty][ad-sop]). | Keep the paywall right after the reminders screen (DECISIONS #7). |
| **Free vs Pro table** | "One of the most consistent paywall additions among top apps." No isolated win rate published ([Adapty][ad-hp]). | Add one, 5 rows. |
| **Personalisation** | Personalised onboarding raised money per user 13–35% in winning tests. 69% of the top 10% of mid-size apps personalise, vs 42% of the rest ([Adapty][ad-sop]). | Headline count, logos, the "3 vs All 6" cell. |
| **Trial explained** | +12–36% money per user ([Adapty][ad-sop]); Blinkist +23% ([write-up][blinkist-case]). 32% of trials are cancelled within an hour, 44% within 24h ([Adapty][ad-sop]). 55.4% of 3-day-trial cancellations happen on day 0 ([RevenueCat 2026][rc-26]). | Keep a 3-step strip with real dates. |
| **Trial length** | 17–32-day trials: 42.5% trial-to-paid; under 4 days: 25.5% ([RevenueCat 2026][rc-26]). | 7 days is fine (locked). |
| **Social proof** | 27% of top paywalls use it; +10–30% in winning tests; "don't manufacture fake social proof" ([Adapty][ad-sop]). | Nothing yet. Add the real rating later. |
| **Single vs multi-page** | Multi-page onboarding paywalls 12.41% vs single-page 9.07% across 40M opens, with no control for which apps chose which ([Superwall, May 2026][sw-multi]). Stompers: single page **beat** multi-page by 16% on yearly trials ([Superwall][sw-stompers]). | Single page. Our total-reveal and reminder screens already do "value first". |
| **Shorter paywall** | Long → short redesigns: +17% money per user, +31%, +72% install-to-trial ([RevenueCat][rc-redesign]). Those also added trial toggles, which Apple now rejects, so they're not clean tests. | Cut repetition, fit one screen. |
| **What to test first** | Plan and trial-structure tests win 57–60% of the time; copy and visual tests 34.6% ([Adapty][ad-hp]). A 5% baseline needs ~9,000 views per variant to detect +20% ([Superwall][sw-ab]). | Don't A/B test copy at launch. Ship the clean version, then test plans. |
| **Hard paywall** | Day-35 conversion 10.7% vs 2.1% freemium, same 1-year retention ([RevenueCat 2026][rc-26]). | Not for us: free tracking is our promise (#11). |

## 4. Recommended layout: A, "Table + tiles + 3-step strip" (9/10)

### 4.1 Wireframe (iPhone 12, 390×844, user ticked 6)
```
┌──────────────────────────────────────┐
│ ditch Pro                        (×) │ top bar 44
│ Get a heads-up before                │ headline, 2 lines
│ all 6 renewals.                      │
│ [N][S][D][Y][+2] Netflix, Spotify +4 │ logos 28 ("+ 4 more" in app)
│ ┌──────────────────────────────────┐ │
│ │ What you get        Free   PRO   │ │ table: header + 5 rows
│ │ Full list, totals, calendar ✓ ✓  │ │
│ │ Heads-ups before a charge 3 All 6│ │
│ │ Your own timing            —  ✓  │ │
│ │ Import screenshots anytime —  ✓  │ │
│ │ Widget + iCloud backup     —  ✓  │ │
│ └──────────────────────────────────┘ │
│  Save 49%                            │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐  │ plan tiles ~100
│ │●Yearly  │ │ Monthly │ │Lifetime │  │
│ │$29.99/yr│ │$4.99/mo │ │ $49.99  │  │
│ │ $2.50/mo│ │No free  │ │Pay once │  │
│ │7 days ✦ │ │ trial   │ │         │  │ (chip: "7 days free")
│ └─────────┘ └─────────┘ └─────────┘  │
│  ●───────────○───────────○           │ trial strip 52
│  Today       Sat, Nov 14  Tue, Nov 17│
│  Free        Heads-up     $29.99     │
│ [      Start 7-day free trial      ] │ CTA 56
│  Then $29.99 a year. Cancel anytime. │
│ [  Continue free: reminders for 3  ] │ 48
│        Restore · Terms · Privacy     │
└──────────────────────────────────────┘
```

### 4.2 Exact copy, line by line
| Slot | Copy | Notes |
|---|---|---|
| Top bar | "ditch Pro" wordmark left · × right (44pt, full contrast, first frame) | × label for VoiceOver: "Close, continue free". |
| Headline (>3 subs) | **Get a heads-up before all 6 renewals.** | Locked (#11). Use the ≤3 headline from `paywalls-competitors.md` §5.4. |
| Logo line | Their logos, biggest yearly charge first (max 5 + "+N"), then **"Netflix, Spotify + 4 more"** | Same order as the free picker's pre-selection. 1 sub: "Netflix"; 2: "Netflix and Spotify". |
| Table header | What you get · **Free** · **Pro** | Pro column on a sunflower tint, as Brilliant and Fixtured do. |
| Row 1 | Full list, totals, calendar · ✓ · ✓ | Shows that Free is real. |
| Row 2 | Heads-ups before a charge · **3** · **All 6** | Personalised. ≤3 subs: "3" · "Unlimited". |
| Row 3 | Your own timing · — · ✓ | Detail on tap/long-press: "A week before, or extra nudges". |
| Row 4 | Import screenshots anytime · — · ✓ | "Anytime" is true: the onboarding import is free once (#16). |
| Row 5 | Widget + iCloud backup · — · ✓ | |
| Not listed | Price-rise alerts | Add a row once it ships. |
| Yearly tile | tab **Save 49%** · "Yearly" · **$29.99/yr** · "$2.50/mo" · chip "7 days free" | Billed price biggest (Apple). 49%, never 50%. |
| Monthly tile | "Monthly" · **$4.99/mo** · "No free trial" | |
| Lifetime tile | "Lifetime" · **$49.99** · "Pay once" | |
| Strip (Yearly) | **Today** / Free · **Sat, Nov 14** / Heads-up · **Tue, Nov 17** / $29.99 | First heads-up only (3 days before); the 1-day one still fires (#15). Dates follow the phone's region. |
| Strip (Monthly) | "No free trial. You pay $4.99 today, then every month." | Same height, so nothing jumps. |
| Strip (Lifetime) | "Everything in Pro, forever. Bank sync, if we add it, is a separate plan because it costs us money every month." | #6b's exact text. It moves from "always under Lifetime" to "shown when Lifetime is picked". **Owner OK needed.** |
| CTA | Yearly: **Start 7-day free trial** · Monthly: **Subscribe for $4.99/month** · Lifetime: **Buy lifetime for $49.99** | |
| Under CTA | Yearly: "Then $29.99 a year. Cancel anytime." · Monthly: "Renews monthly. Cancel anytime." · Lifetime: "One payment. No renewals." | Replaces the current line, which repeated the dates. |
| Secondary | **Continue free: reminders for 3** | Locked (#11). ≤3 subs: "Continue free". |
| Links | Restore · Terms · Privacy | |

### 4.3 Copy choices (score /10, ★ = pick)
| Choice | Options | Pick |
|---|---|---|
| Line under the headline | ★ "Netflix, Spotify + 4 more" (8.5: recognition; the table does the free/pro split) · "Free covers 3 of your 6. Pro covers all 6." (7.5: says the same thing as row 2) · logos only (7: small logos are hard to place) | first |
| Empty cell mark | ★ "—" (9: calm; Speak, Comet) · ✗ (6: scolds, anxious users) · blank (7: unclear to VoiceOver and on small screens) | dash |
| Trial strip | ★ 3 dots, 2 short lines each (9) · foodpanda-style 3 one-line rows (8.5: reads as sentences but costs ~32pt) · one sentence "Free until Tue, Nov 17. Heads-up Sat, Nov 14." (7) · 2 steps, no reminder (6: breaks rule 4) | 3 dots |
| Middle step word | ★ "Heads-up" (9: matches the headline) · "Reminder" (7) · "We ping you" (6.5) | Heads-up |

### 4.4 What to cut from the current paywall
1. "We'll remind you before we charge, too." (owner).
2. The "ditch Pro trial" card with the app icon. It doubles the timeline's height.
3. The second reminder date, the "9 AM heads-up" sub-labels, the bell icons and the dashed lines.
4. The 2-line ✓ list. The table replaces it.
5. The 3-line headline at display size, and the large duck. The duck still shows up on the post-purchase "You're in" screen (his job: watching your trial).
6. Stacked full-width plan cards. They become tiles.
7. "$0 today, then $29.99/yr from Nov 17…". The strip already shows the dates.

### 4.5 Why this serves the user and conversion
- **The user** (anxious, wants control) sees in one glance what stays free, what Pro adds, and exactly when money moves. No surprises, and the reviews in §2.4 show surprises are what gets punished.
- **Conversion:** personal numbers (Adapty +13–35%), the trial explained (+12–36%), the plan on screen at first view (60% buy on first view), and no scrolling to reach the price. Honesty rules all pass: × on the first frame, Continue free, Restore/Terms/Privacy, billed price biggest, real dates, no countdowns, no fake discounts.

## 5. Size rules (DECISIONS #21)
**Why the iPhone 12 cuts off Lifetime today:** 3-line headline (~180pt) + trial card (~170) + list (~70) + three 66pt cards with 12pt gaps (~230) + footer (~200) ≈ 850pt, against about 763pt of usable height.

**Height budget (pt, inside the safe area):**
| Block | Compact (SE 375×667, ~647 usable) | Regular (12–16, ~763) | Roomy (Plus/Pro Max 440×956, ~860) |
|---|---|---|---|
| Top bar | 44 | 44 | 44 |
| Headline | 2 lines @ 24–26pt ≈ 60 | 2 lines @ 28–30pt ≈ 72 | up to 3 lines @ 32pt ≈ 110 |
| Logo line | 24 | 28 | 32 |
| Table (header + 5 rows) | 22 + 5×28 = 162 | 24 + 5×32 = 184 | 26 + 5×36 = 206 |
| Plan tiles | 92 | 100 | 108 |
| Trial strip | 48 | 52 | 56 |
| CTA + line + secondary + links | 50+16+44+20 = 130 | 56+18+48+20 = 142 | 56+18+52+20 = 146 |
| Gaps | 8 × 7 = 56 | 12 × 7 = 84 | 16 × 7 = 112 |
| **Total** | **~616 ✓** | **~706 ✓** | **~814 ✓** |

**Rules for the build:**
1. Choose the class from the **window height** after safe areas, not the device name: < 700 compact, 700–880 regular, > 880 roomy. That also covers Display Zoom, iPad Split View and landscape.
2. The headline uses auto-shrink down to 80%, capped at 2 lines on compact and regular.
3. Spare height on roomy screens goes into top padding and gaps. Tiles and table never stretch.
4. **Width < 360pt** (iPad Slide Over, zoomed SE): tiles stack as 3 rows and the body may scroll.
5. **Large text** (Dynamic Type above "xLarge"): the body scrolls and the footer (CTA, Continue free, links) stays pinned. Tiles become rows. The × is always pinned.
6. **iPad:** present full screen with a cream background and the content in a centred column, **max width 440pt**, centred vertically when there's room. The × sits at the column's top-right. iPad landscape (≈744–1024 tall) uses the compact or regular rules from rule 1.
7. Tap targets ≥ 44pt everywhere (a tile is one target). Money uses tabular figures. Dark mode uses the same layout.
8. VoiceOver reads each table row as one sentence: "Heads-ups before a charge. Free: 3. Pro: all 6."
9. **Check before shipping:** SE (375×667), iPhone 12 (390×844), Pro Max (440×956), iPad mini landscape, iPad 13" portrait, and the largest text size on the 12. Nothing can be cut off, and × plus both buttons must be visible without scrolling at default text size.

## 6. Three alternatives, scored
| Layout | What it is | Score | Why |
|---|---|---|---|
| **A ★ Table + tiles + strip** | §4 | **9** | Answers "what vs free" in 5 rows, personal, fits SE to Pro Max, every honesty rule passes. Risk: dense on SE; follow the budget. |
| B Pro icon list | Orbit/Bevel style: "What's in Pro" with 4 icon rows, stacked plans, timeline | 6 | The current problem again: it never says what Free keeps. Also taller. |
| C Two cards: Free vs Pro | Duolingo "Learn for free" / Cleo style: two big cards, pick one, plans on the next step | 6.5 | Very clear, but makes Free look like an equal choice. Dark Noise saw yearly drop 30% when plans looked equal (`paywalls-competitors.md` §2.3). Adds a step. |
| D Two pages | Page 1: Free vs Pro table + "Try Pro free" / "Continue free". Page 2: tiles + strip + CTA | 7.5 | Superwall's aggregate favours multi-page (+37%), but Stompers saw the opposite, and our onboarding already has value screens. **Test it against A** once there are ~9,000 paywall views per variant. |

## 7. Next steps
1. Owner: approve layout A and the #6b placement change (Lifetime line shown when Lifetime is picked).
2. Mock A in `design/v11/` at SE, 12, Pro Max and iPad sizes, light and dark, before any code.
3. After launch: add the real App Store rating as a single line under the headline, only at ≥ 4.5★ with ≥ 50 ratings, then try test D.

## 8. Sources
**Mobbin screens** (all looked at)
[comet]: https://mobbin.com/screens/d0723672-d16e-4883-977b-f7e4cb31e9f7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[structured]: https://mobbin.com/screens/164379e9-258f-4b6c-9f91-7a02a3f4c277?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[fixtured]: https://mobbin.com/screens/0576cc85-bcfb-48ce-9115-cc4fbd774e02?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[brilliant]: https://mobbin.com/screens/9ff9cfa3-8209-4275-a972-11a892f7d0a5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[speak]: https://mobbin.com/screens/a560862e-b0cb-4006-927e-8c4447655a46?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[matter]: https://mobbin.com/screens/2133c08c-0529-46a0-a735-ad7ab815beaf?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[jomo]: https://mobbin.com/screens/46254a5c-b3a2-4092-b36d-c1202878bbc8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[cleo]: https://mobbin.com/screens/c330c3f7-92f0-4323-8260-19342d065716?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[monzo]: https://mobbin.com/screens/baf88068-f789-4371-be70-4a7848e4c999?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[insight]: https://mobbin.com/screens/04b668d5-9abd-4bb4-8dc7-f75386e3739f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[lifesum]: https://mobbin.com/screens/43d1ac57-cca2-4939-ba2e-bb0d4d6c3fbb?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[alltrails]: https://mobbin.com/screens/5f3e4df9-ad41-4d04-91ca-cf8c8a69507a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[scmp]: https://mobbin.com/screens/0b41f5dd-af78-409d-b708-f4e43ff52554?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[acorns]: https://mobbin.com/screens/6f8958c4-f659-431b-a287-6d22161632e3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[cmb]: https://mobbin.com/screens/8f7f70d8-4d92-433c-a39e-160568d996cc?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[foodpanda]: https://mobbin.com/screens/5c330e96-9e24-4420-a703-7612ab830a4b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[blinkist]: https://mobbin.com/screens/1c74c6aa-ae67-4bdf-811f-9019e3ad8564?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[mimo]: https://mobbin.com/screens/e257555e-bd98-4163-b095-198a8c58473b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[5mj]: https://mobbin.com/screens/0b03c06a-63c8-43dd-87ed-58fecc57f0a1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[strava]: https://mobbin.com/screens/40d104f8-8f25-4ae3-90eb-373e30e35acd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[headway]: https://mobbin.com/screens/c550c1aa-b7d4-4b06-b4f3-ef448c07419f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[kitchen]: https://mobbin.com/screens/8d0a33c4-54d1-406d-b502-7cf17b997e91?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[mesh]: https://mobbin.com/screens/60db255e-0f7c-4caf-a0a5-4d91c0aa8740?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[copilot]: https://mobbin.com/screens/b6ba77c0-7d8f-423e-8453-9db2a97f8035?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[tide]: https://mobbin.com/screens/4946c946-896e-433d-a459-e031e0e011b6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[pillowtalk]: https://mobbin.com/screens/2f9bcce8-e4bd-4cf1-9027-3b8f44eb4ca6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[flo]: https://mobbin.com/screens/e91cde1b-542d-4989-8921-596ccb2a07c7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[dropbox]: https://mobbin.com/screens/5ea4e218-270a-4fd8-b086-67ed9bb9ea55?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[vocab]: https://mobbin.com/screens/32238af5-552f-4ac3-bede-16981f4c23d3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[n26]: https://mobbin.com/screens/e3c08810-b4c7-46c1-9a3f-d98ed02c910a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[orbit]: https://mobbin.com/screens/521769df-d360-452b-baf3-e6329b58a842?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[bevel]: https://mobbin.com/screens/87ac5af9-7c7a-46b8-8a82-ad8c90bf574c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[hatch]: https://mobbin.com/screens/e956459e-49dd-4768-bce7-5bb72d0472e3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[locket]: https://mobbin.com/screens/42ccb9e6-d515-44d3-87fe-cd26bc1ecbfe?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[joi]: https://mobbin.com/screens/919fda8d-1b21-4645-af65-187100030337?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[peak]: https://mobbin.com/screens/68f69be3-bdd5-4ff8-9072-6654d5020e6b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[opal]: https://mobbin.com/screens/f874f93b-8ef4-408a-bd23-101d703c2ae1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[duo-free]: https://mobbin.com/screens/eade4735-8f46-4659-bc9e-2e93d306019e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp
[moonly]: https://mobbin.com/screens/b2a7f4f6-e03e-4875-97ec-79c299a244c7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp

Also seen, not linked above: Duolingo "Skip ads" ([▸](https://mobbin.com/screens/97e9b0dc-f653-4422-96e8-53650ff9accd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)), Jomo founder FAQ ([▸](https://mobbin.com/screens/355c903b-4580-4f82-bd8f-0c46195fa434?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)), KOHO, NGL, Instagram, Weverse, Swiggy, Garmin Connect.

**Web**
[ad-sop]: https://adapty.io/blog/paywall-optimization-tests/
[ad-hp]: https://adapty.io/blog/high-performing-paywall-2026/
[rc-26]: https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026
[rc-redesign]: https://www.revenuecat.com/blog/growth/paywall-redesigns-case-studies
[sw-multi]: https://superwall.com/blog/new-postmulti-page-onboarding-paywalls-convert-37-better-than-single-page-heres-why
[sw-stompers]: https://superwall.com/case-studies/stompers
[sw-ab]: https://superwall.com/blog/how-to-ab-test-a-paywall
[blinkist-case]: https://uxplanet.org/how-solving-our-biggest-customer-complaint-at-blinkist-led-to-a-23-increase-in-conversion-b60ad514134b

- Adapty, State of Paywalls 2026 (Nov 1 2026): <https://adapty.io/blog/paywall-optimization-tests/>
- Adapty, What does a high-performing paywall look like in 2026? (Mar 13 2026): <https://adapty.io/blog/high-performing-paywall-2026/>
- RevenueCat, subscription app benchmarks 2026: <https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026> · report: <https://www.revenuecat.com/state-of-subscription-apps-2026/>
- RevenueCat, four paywall redesigns (Mar 27 2025): <https://www.revenuecat.com/blog/growth/paywall-redesigns-case-studies>
- Superwall, multi-page onboarding paywalls (May 26 2026): <https://superwall.com/blog/new-postmulti-page-onboarding-paywalls-convert-37-better-than-single-page-heres-why> · Stompers: <https://superwall.com/case-studies/stompers> · A/B sizing: <https://superwall.com/blog/how-to-ab-test-a-paywall>
- Blinkist trial timeline: <https://uxplanet.org/how-solving-our-biggest-customer-complaint-at-blinkist-led-to-a-23-increase-in-conversion-b60ad514134b>
- Apple, auto-renewable subscriptions: <https://developer.apple.com/app-store/subscriptions/> · Guideline 3.1.2: <https://developer.apple.com/app-store/review/guidelines/#subscriptions>
- AppKittie API (apps, reviews): <https://www.appkittie.com/docs>. Data pulled Nov 10 2026 for Bobby (id1059152023) and Orbit (id6692620188).

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
