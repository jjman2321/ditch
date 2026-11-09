> **Superseded on Nov 9, 2026:** the owner dropped the mascot (DECISIONS #4, #5; `docs/research/mascot-or-not.md`). Ignore every raccoon or mascot instruction below; the rest still applies.

# Audit: "Premium white" onboarding mockups

Nov 9, 2026 · Screens: `design/premium-white/1-welcome.jpg`, `2-pick.jpg`, `3-total.jpg`, `4-paywall.jpg`
Checked against: `CLAUDE.md`, `docs/design/PLAYBOOK.md`, `docs/design/ONBOARDING.md`, `docs/DECISIONS.md` (#6, #11, #12), the rejected `onboarding-v4-a.jpg`, and Mobbin (Copilot paywall, Bevel onboarding, finance totals).

**How sizes were measured.** The mocks are 1520×2688 with no status bar or home indicator. I mapped the width to an iPhone 16 (393pt). All pt values below use that scale (1pt ≈ 3.87 source px). Treat them as ±2pt.

## Overall verdict: 6.5/10

The direction is better than v4: confident type, lots of white, black pill buttons, one accent. It reads "premium" at a glance.

It is a **style without a system**. Every screen has its own gutter, title size, button height and raccoon. Most of the product thinking from v4 is gone too: estimates, plan choice, "Something else", the mascot's replies, Dates, Reminders, Pick 3 and You're set. The numbers don't add up between screens. An App Store editor would spot the drift in about five seconds.

**Biggest structural problem:** the mocks use a 9:16 frame (393×695pt) with no status bar, Dynamic Island or home indicator. A real iPhone 16 is 393×852 (about 759pt usable), and an iPhone SE has about 627pt usable. All four layouts need redoing on real frames before anyone can judge spacing.

---

## Data check (deliberate and accidental errors)

| Where | Shown | Correct | Problem |
|---|---|---|---|
| 2 · footer | "3 selected · $519 a year" | Netflix 17.99 + Spotify 10.99 + Disney+ 15.99 = $44.97/mo → **$539.64/yr** | Wrong by $20. |
| 2 → 3 | 3 selected | Screen 3 says **6 subscriptions** | The flow contradicts itself. |
| 3 · biggest | ChatGPT, Netflix, Amazon | ChatGPT and Amazon are **unticked** on screen 2 | Same scenario problem. |
| 3 · total | $1,091/yr, $90.95/mo | 90.95 × 12 = 1,091.40 ✓. But no 6 of the 7 listed prices add to $90.95 (they give 93.95 / 92.95 / 89.95 / 88.95). | The total can't come from the list shown. |
| 3 · bars | 22% / 20% / 16% | The fills are about 54% / 47% / 35% of the track | The bars are neither share-of-total nor scaled to the biggest. |
| 3 · rows | $216/yr, $180/yr | 215.88 and 179.88, rounded | Fine for display, but the screen needs "about". |
| 4 · paywall | "all 6 renewals" | Screen 2 has 3 ticked | Same scenario problem. |
| 4 · plans | $29.99/yr, $4.99/mo, $49.99 | Match DECISIONS #6 and #12 ✓ | — |
| 4 · "about $2.50 a month" | 29.99 / 12 = 2.499 ✓ | — | — |
| 4 · "Save 50%" | 1 − 29.99/59.88 = **49.9%** | Rounds up | A tiny overstatement, but it's still a rounding-up claim on a price screen. |
| 4 · timeline | Today → Sat Nov 14 → Mon Nov 16 | Nov 9, 2026 is a Monday, so +7 = Mon Nov 16 and −2 = Sat Nov 14 ✓ | Correct. |
| 1 vs 2/3 | Amazon is a beige "a" tile | Amazon is a blue "prime" tile on 2 and 3 | One service, two identities. |
| 2 · prices | $17.99, $10.99 … as facts | Real prices vary by plan and region and go stale | v4 had "~"; this direction dropped it. |

**Fix:** pick one scenario and use it on every screen. For example, 6 ticked: Netflix 17.99, Spotify 11.99, Disney+ 15.99, ChatGPT Plus 20.00, Amazon Prime 14.99, YouTube Premium 13.99 = **$94.95/mo, $1,139.40/yr**. Generate the numbers from the real `money.ts` functions, not by hand.

---

## 1 · Welcome: 6/10
**Verdict:** clean and confident, but it's a stock "logo cloud + mascot" poster with nothing that is only Ditch.

### Keep
- The left-aligned 44pt headline "Ditch it before it renews." It's strong and on brand.
- One full-width black pill CTA, with a quiet reassurance line under it.
- White space. The raccoon's palette (teal, cream, lime scarf) is clearly not BitePal's grey and black.

### Problems (most important first)
1. **The composition has no centre.** The logo cluster sits at x≈130pt and the raccoon at x≈290pt. They don't touch or interact. The art block is centred on nothing, while the text below is left-aligned.
2. **The mascot does nothing.** The playbook asks for a "big, card-flick pose" plus a one-line hello. Here it sits beside the logos like a sticker.
3. **The logo cloud is the category cliché** (Bobby, Rocket Money, Orbit and every AI mock do it). The tiles are tilted and shadowed (2.5D), which fights the flat premium-white style. Six third-party trademarks lead the first frame. That's fine inside the app for identification, but **risky if this screen becomes App Store screenshot #1** (guideline 5.2.1).
4. **The vertical rhythm is loose.** About 80pt of empty space above the art and about 83pt between the art and the headline, then only about 22pt between the headline and the body. The gaps don't follow a scale.
5. **Generic CTA.** "Get started" says nothing. Playbook: "Let's see what I pay".
6. **Weak reassurance.** "Free · No account needed" leaves out the line ONBOARDING.md agreed: "Your list stays on your phone."
7. The **raccoon still has BitePal traits** (front-on view, round eyes inside dark patches, big head). The playbook asks for a ¾ view and smaller eyes.
8. **Accessibility.** The logo cluster must be hidden from VoiceOver (it's decoration). The 44pt headline needs a Dynamic Type cap: let it wrap to 3 lines, don't shrink it.

### Fixes
- **Layout (393×852):** art block 300pt tall, starting 24pt below the safe area and centred. The raccoon is the hero (180pt tall, centred), flicking **one** card (their likely biggest, e.g. a generic "Streaming $17.99" card, not a real logo) into a small bin or off-screen. Drop the 6-logo cloud, or shrink it to 3 flat 44pt tiles at 40% opacity behind the raccoon.
- Headline: 40/44 Bold, tracking −0.8, `#0A0A0A`, 24pt gutter. 32pt from the art to the headline, 12pt from the headline to the body, CTA pinned 8pt above the home indicator.
- Body: 17/24 Regular `#6E6E73`.
- Under the CTA: 13/18 `#6E6E73`.

| Body copy | Score | Note |
|---|---|---|
| "See everything you pay for and get a heads-up before each charge." (current) | 7 | Clear, a bit long. |
| "See what you pay. Get a heads-up before each charge." | **8** | **Pick.** Short, two beats. |
| "I'll add up what you pay and warn you before each charge." | 7 | Mascot voice. Use it only if the raccoon visibly "speaks". |

| CTA | Score |
|---|---|
| "Get started" (current) | 4 |
| "Let's see what I pay" (playbook) | 7 |
| **"See what I pay"** | **8 (pick)** |

| Small print | Score |
|---|---|
| "Free · No account needed" (current) | 6 |
| **"Free. No account. Your list stays on your phone."** | **8 (pick, matches ONBOARDING.md)** |

---

## 2 · Pick (Tick): 6/10
**Verdict:** the most "real app" screen of the four, but it lost the features that made v4's tick list better than Orbit, and its total is wrong.

### Keep
- The title "What do you pay for?" and the one-line helper.
- The grouped list in one card, with a big tick on the right.
- The sticky footer with a running count and total. This is our edge over Orbit.

### Problems
1. **The total is wrong** ($519 vs $539.64), and the count contradicts screens 3 and 4.
2. **Prices are stated as facts.** There's no "~"/"about" and no plan choice (Netflix has 3 plans). ONBOARDING.md requires both. The footer should say "about".
3. **No way out for "my sub isn't here".** No "Something else?" row, no category chips, no Skip. The list just ends after 7 rows with no scroll hint.
4. **The CTA never changes state.** The playbook says "None of these → Continue". With 0 ticked it must read differently.
5. **The mascot's replies are gone.** The playbook's small avatar plus speech bubble ("Nice! What else?") was the agreed engine for this screen. Without it, the screen feels like a settings form.
6. **Four different left edges:** title 20pt, search 16pt, card 13pt, footer text 17pt, CTA 13pt. This is the biggest "not premium" tell.
7. **The type is too heavy.** Row names are about 19pt Heavy and compete with the 34pt title. The prices are 19pt too, so name and price have the same weight.
8. **The CTA is about 39pt tall**, below 44pt and shorter than screen 1's (about 49pt). Only the small tick changes on a selected row (no row tint), so you can't scan what you've picked.
9. **Dynamic Type:** name and price share one line, so "YouTube Premium" will truncate at the first larger size.
10. **The progress bar** is about 7pt thick and shows the same fill (about 32%) as screen 3. Progress doesn't move.

### Fixes
- **Gutter 24pt for everything.** Search field 44pt tall, radius 12, fill `#F2F2F7`, placeholder 17pt `#8E8E93`, icon 17pt.
- **Chips row** under the search: 32pt tall, radius 16, 15pt Medium; selected chip `#0A0A0A` with white text.
- **Rows 64pt:** logo 40pt (continuous radius 9, 0.5px `rgba(0,0,0,.08)` hairline on white logos), 12pt gap. Name 17/22 Semibold. Price **under** the name, 15/20 Regular `#6E6E73`, tabular, written "~$17.99 a month · Standard ›" (tap to change plan). Tick 26pt visible circle on the right; the whole row is the tap target. Selected row gets a `#E6F4F1` fill.
- **Last row:** "+ Something else?" in 17pt Semibold `#0B7A6E`.
- **Footer:** the mascot reply lives here. 32pt avatar, then one line, then a 56pt CTA. That keeps the playbook rule with no extra height.

| Footer line | Score |
|---|---|
| "3 selected · $519 a year" (current, wrong) | 3 |
| "3 picked · about $540 a year" | 7 |
| **Avatar + "3 so far · about $540 a year"** | **8 (pick)** |

| CTA by state | |
|---|---|
| 0 ticked | "None of these" (secondary style) |
| 1+ ticked | "Continue" |

---

## 3 · Total (Reveal): 6.5/10
**Verdict:** the right big moment with the right number size, undercut by a cropped, smiling, shape-shifting raccoon and data that doesn't match the list.

### Keep
- A giant tabular number with the per-month line under it. This is the playbook's "value before any ask".
- "Biggest" as logo rows with yearly cost.
- The sourced C+R line (agreed in research; it's real and cited).
- "Set my dates" as the CTA (matches the playbook).

### Problems
1. **The mascot shares a row with the number** and is cropped by the screen edge. A total like "$12,480" or two currency lines will collide with it.
2. **The mascot is a different model from screens 1 and 4.** New head shape, different mask, flatter rendering, no tail. Three screens, three raccoons.
3. **Wrong emotion.** The playbook says "shocked with receipt". It smiles at a $1,091 bill.
4. **The number is about 84pt Black, and "per year" is about 38pt Heavy grey.** Grey Heavy type looks muddy, and Black weight looks shouty, not premium.
5. **"YOU SPEND"** is a cold eyebrow and drops the estimate word. Use "That's about", since prices are still estimates.
6. **The bars are not proportional** to the percentages shown (see the data check).
7. **The bridge line is missing.** "Let's make sure none of it surprises you." is what makes "Set my dates" feel like the obvious next step.
8. **The stat line backfires here.** At $90.95/mo, the user is below the $219 average, so the line quietly says "you're fine". It's also 13pt on one line that will wrap with larger text.
9. **Inconsistent card style.** This card has a radius of about 14pt and a shadow; screen 2's card is about 9pt; the paywall cards have borders.

### Fixes
- **Mascot band:** 140pt tall, right-aligned, fully inside the 24pt gutter, shocked pose holding a receipt. The text starts below it. The number gets the full width.
- Eyebrow "That's about": 15/20 Semibold `#6E6E73` (sentence case, no tracking).
- Number: 72/76 **Bold**, tracking −1.5, tabular, `#0A0A0A`. Count up over 1s with a light haptic at the end (static with Reduce Motion).
- "a year": 28/32 Semibold `#6E6E73` on the same baseline when it fits; otherwise on the next line.
- Under that: "$90.95 a month across 6 subscriptions", 17/24 Regular `#3C3C43`.
- **Biggest card:** fill `#F5F5F7`, radius 20, no shadow, padding 20. Header "Your biggest 3" in 17/22 Semibold. Rows 56pt: logo 36pt, name 17 Semibold, "about $240 a year" right-aligned 17 Semibold tabular. Bar 6pt with radius 3; fill = **share of total**, `#0B7A6E` on `#E5E5EA`. "22% of the total" in 13pt `#6E6E73`.
- **Bridge line** above the CTA: 17/24 Regular.
- **Stat line:** move it under the card, 13/18, allow 2 lines, and make it tappable to the source.

| Eyebrow | Score |
|---|---|
| "YOU SPEND" (current) | 5 |
| **"That's about"** | **8 (pick)** |
| "You pay" | 6 |

| Bridge line | Score |
|---|---|
| (none) | — |
| **"Let's make sure none of it surprises you."** | **8 (pick, playbook)** |
| "Next: when does each one charge?" | 7 |

| Stat line | Score |
|---|---|
| "People guess $86 a month. The real average is $219. C+R Research, 2022." (current) | 6 |
| **"In 2022, people guessed they spent $86 a month. It was really $219. (C+R Research)"** | **7 (pick; agreed wording)** |

---

## 4 · Paywall: 7/10
**Verdict:** the most honest and closest to shippable. It has correct real dates, a visible ×, Restore and the billed price biggest. It's missing legal links and the agreed free-button wording, and it's cramped at the top.

### Keep
- The headline "Get a heads-up before all 6 renewals." (DECISIONS #11).
- The subhead "Free covers 3. Pro covers every one, plus import, widget and iCloud backup." It's honest and specific (8/10).
- The billed amount is biggest, with the monthly breakdown smaller (3.1.2 ✓). Monthly shows "$59.88 a year", which proves the saving.
- The real-date timeline, with the exact amount on the charge row.
- No countdown, no strike-through prices, no trial toggle.

### Problems
1. **The free button doesn't match DECISIONS #11.** It should say "Continue free: reminders for 3". It's also grey text (about `#8E8E93`, 3.3:1 contrast) that doesn't look tappable. CLAUDE.md wants a real option.
2. **No Terms of Use / Privacy links and no auto-renew line.** This is a common 3.1.2 rejection. Copilot's paywall (Mobbin) has "Cancel anytime… automatically renews at the price selected above" right under the CTA.
3. **The CTA doesn't follow the selected plan.** "Start free week" makes no sense with Lifetime or Monthly (no trial) selected.
4. **No reminder-day picker in the timeline.** The playbook says to let the user pick it; it's our live product demo. The "Ditch Pro trial" row is missing too.
5. **The × is about 24pt visible**, in a grey circle with low contrast, sitting right against the mascot. The top-left corner is crowded, and the hit area must be 44pt.
6. **The plan cards are uneven:** Yearly about 62pt tall, the others about 50pt. The "7 days free" badge floats on the card's top-left corner and crowds "Yearly".
7. **"Save 50%"** rounds 49.9% up. Small, but this screen is where we promised to be exact.
8. **Lifetime says "$49.99 once / billed once"**, which repeats itself.
9. **Voice switches to "We remind you."** Everywhere else, the raccoon says "I". The summary line under the timeline repeats the charge row.
10. **The mascot pose isn't calm** (laughing, bell ringing, motion lines). The playbook asks for "small and calm" here.
11. **Fit:** the content is about 690pt. It won't fit on an iPhone SE (about 627pt usable). The CTA and legal links must be pinned, and the rest scrolls.
12. **"Save 50%"** is teal on mint, about 2.9:1 contrast, which fails.

### Fixes
- **Header:** × top-right, 30pt visible circle `#F2F2F7`, glyph 13pt Semibold `#3C3C43`, 44pt hit area. Move Restore into the legal row under the CTA (still visible on the first frame). Mascot 88pt, top-left, calm, holding the bell, 16pt below the safe area.
- **Headline:** 30/36 Bold, 2 lines. Subhead 15/20 `#6E6E73`.
- **Plan cards:** all 64pt tall, radius 16, fill `#F5F5F7`, 8pt gap. Selected card: white fill, 2pt `#0A0A0A` border. Name 17 Semibold on the left. Price 17 Semibold tabular on the right, with a 13pt `#6E6E73` second line under it. The trial goes inside the yearly card's second line, not in a floating badge.
  - Yearly: "$29.99 a year" / "7 days free · about $2.50 a month". Saving pill: 13 Semibold `#0B7A6E` on `#E6F4F1`.
  - Monthly: "$4.99 a month" / "$59.88 a year · no trial".
  - Lifetime: "$49.99" / "One payment. Pro stays yours."
- **Timeline:** fill `#F5F5F7`, radius 20, padding 20.
  - Row 1: "Today: Pro starts. $0 today."
  - Row 2: "**Sat, Nov 14**: I'll remind you ▾". The date is a tappable chip: 1 / 2 / 3 days before.
  - Row 3: "**Mon, Nov 16**: $29.99 unless you cancel."
  - Under it, 13pt: "I'll add 'Ditch Pro trial' to your list."
- **Pinned footer:** CTA 56pt, then the free button (44pt, 17 Semibold `#3C3C43`, no fill), then 13pt `#6E6E73`: "Cancel anytime in Settings. Renews at $29.99 a year." Last row: "Restore · Terms · Privacy" (13pt, each link 44pt tall).

| CTA (Yearly) | Score |
|---|---|
| "Start free week" (current) | 6 |
| **"Start 7-day free trial"** | **8 (pick, playbook)** |
| "Try 7 days free" | 7 |

The CTA changes with the plan: Monthly → "Subscribe for $4.99 a month". Lifetime → "Buy for $49.99".

| Saving label | Score |
|---|---|
| "Save 50%" (current) | 5 |
| "Save 49%" | 7 |
| **"Save $29.89 a year"** | **8 (pick; exact, and proven by the monthly card)** |

| Free button | Score |
|---|---|
| "Continue free" (current) | 5 |
| **"Continue free: reminders for 3"** | **9 (pick; DECISIONS #11)** |

| Lifetime line | Score |
|---|---|
| "$49.99 once / billed once" (current) | 4 |
| **"$49.99 / One payment. Pro stays yours."** | **8 (pick; never "all future features")** |

---

## Cross-screen system issues

| Measure | 1 Welcome | 2 Pick | 3 Total | 4 Paywall |
|---|---|---|---|---|
| Text gutter | ~21pt | ~20pt | ~17–20pt | ~17pt |
| Title size | ~44pt Heavy | ~34pt Heavy | ~84pt Black | ~31pt Heavy |
| Body size | ~19pt | ~17pt | ~20pt | ~16pt |
| CTA height | ~49pt | ~39pt | ~44pt | ~39pt |
| Card radius | — | ~9pt + shadow | ~14pt + shadow | ~8pt + border |
| Raccoon | model A, sitting | none | model B, cropped | model C, laughing |

Other system issues:
- **The progress bar** is 7pt thick and the same on screens 2 and 3. It should be 4pt, cover screens 2–5, and fill 25/50/75/100%.
- **The back chevron** sits at different heights (y≈30pt vs 39pt).
- **The accent colour** fails contrast as text. The lime scarf is the only lime anywhere: keep it in the art only.
- **No dark mode** shown. CLAUDE.md requires it.
- **No tabular figures** spec, even though money appears in columns.

### Proposed token sheet

**Colour (light / dark)**
| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#000000` | Screens |
| `surface` | `#F5F5F7` | `#1C1C1E` | Cards, timeline, plan cards |
| `fill` | `#F2F2F7` | `#2C2C2E` | Search, × circle, chips |
| `separator` | `#E5E5EA` | `#38383A` | Hairlines, bar tracks |
| `label` | `#0A0A0A` | `#FFFFFF` | Titles, prices |
| `label2` | `#3C3C43` | `#D1D1D6` | Body |
| `label3` | `#6E6E73` (5.1:1) | `#AEAEB2` | Secondary text. Smallest text colour allowed. |
| `placeholder` | `#8E8E93` | `#8E8E93` | Placeholders and icons only, never body text |
| `accent` | `#0B7A6E` (5.2:1 on white) | `#3FC1AE` | Ticks, bars, links, saving pill text |
| `accentTint` | `#E6F4F1` | `#12312C` | Selected rows, saving pill background |
| `ctaBg` / `ctaLabel` | `#0A0A0A` / `#FFFFFF` | `#FFFFFF` / `#000000` | Primary button |

**Type** (SF Pro, Bold is the heaviest weight, `tabular-nums` on all money)
| Token | Size/line | Weight | Tracking |
|---|---|---|---|
| display | 72/76 | Bold | −1.5 |
| hero | 40/44 | Bold | −0.8 |
| title | 30/36 | Bold | −0.5 |
| headline | 17/22 | Semibold | −0.4 |
| body | 17/24 | Regular | −0.4 |
| callout | 15/20 | Regular | −0.2 |
| footnote | 13/18 | Regular | 0 |
| button | 17/22 | Semibold | −0.4 |

All sizes scale with Dynamic Type. Cap `display` at 96 and let the layout reflow.

**Spacing:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64. Gutter = 24 for all text and buttons. Title → body 12. Section → section 32. Footer: 8 above the home indicator.

**Radii:** logo 22.4% continuous (9 at 40pt) · input 12 · plan card 16 · card 20 · button and chip = pill.

**Shadows:** none on cards (use `surface` fill instead). The only elevation is a sticky footer with a top hairline `separator`. The art carries its own soft shadow.

**Buttons**
- Primary: 56pt tall, pill, `ctaBg`, 17 Semibold. Pressed: 0.85 opacity plus a light haptic. Disabled: `#D1D1D6`.
- Secondary: 44pt tall, no fill, 17 Semibold `label2`.
- Icon buttons: 44×44 hit area, 30pt visible circle in `fill`.

**Mascot sizes:** talk screens 180pt · result screens 140pt · work screens 32pt avatar · paywall 88pt. One model sheet (¾ view, smaller eyes) used everywhere.

---

## Missing from the flow (vs PLAYBOOK.md v3)

| # | Playbook screen | In this set? |
|---|---|---|
| 1 | Welcome: big card-flick mascot, "Let's see what I pay" | Partly (static mascot, generic CTA) |
| 2 | Tick: avatar bubble replies, "None of these → Continue", chips, "Something else?", "~" prices | Partly (no bubble, no state change, no chips, no custom add, no "~") |
| 3 | Reveal: shocked mascot, "That's about…", bridge line | Partly (smiling, cropped, no bridge line) |
| **4** | **Dates:** one card per sub, 1–31 grid, Not sure / Later | **Missing** |
| **5** | **Reminders pre-ask:** lock screen with *their* subs, "Turn on reminders" / "Maybe later" | **Missing** (and it's the core product) |
| 6 | Paywall: reminder-day picker, "Ditch Pro trial" row, "Continue free: reminders for 3" | Partly |
| **7** | **Pick 3:** "Free it is! I picked your 3 biggest. Swap any time." | **Missing** |
| **8** | **You're set:** first heads-up date, number tracked, reminders on/off with a fix | **Missing** |

Also missing: Dynamic Island / status bar / home indicator, dark mode, the multi-currency reveal (one line per currency), the 0-ticked path, a large-text check and an iPhone SE check.

---

## Top 10 changes, ranked by impact

1. **Redraw on real iPhone frames** (393×852 plus the SE at 375×667) with the status bar, Dynamic Island and home indicator. Every spacing judgement depends on this.
2. **One scenario, real math.** Generate every number from `money.ts` so the count, total, biggest-3 and "all N renewals" agree across screens. Fix $519 → $539.64.
3. **Paywall compliance:** Terms and Privacy links, a renewal line, a CTA that follows the plan, "Continue free: reminders for 3" as a real 44pt button with at least 4.5:1 contrast, and a 44pt × away from the mascot.
4. **Apply one token sheet:** 24pt gutter, one title size (30), 56pt buttons, Bold as the heaviest weight, `surface` cards with no shadows, a 4pt progress bar that moves.
5. **One raccoon model sheet** (¾ view, smaller eyes, same scarf). Shocked and uncropped on Reveal, calm on the paywall, card-flick on Welcome. The mascot never shares a row with the number.
6. **Design the 4 missing screens**, Reminders pre-ask first. It's the product's #1 promise and the 5.1.1 risk.
7. **Bring back the Tick screen's product features:** "~" prices with a plan picker, "Something else?", chips, "None of these" state, and the avatar reply in the sticky footer.
8. **Reveal fixes:** "That's about", 72pt Bold, bars as share of total, the bridge line, the stat line on 2 lines with its source.
9. **Reminder-day picker plus the "Ditch Pro trial" row** in the paywall timeline, in the raccoon's "I" voice.
10. **Welcome:** drop the 6-logo cloud (cliché, trademark risk in screenshots), make the raccoon the hero with one action, and use "See what I pay" plus "Your list stays on your phone."
