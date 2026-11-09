# Ditch v8 (Sunflower, full flow): independent re-review (Nov 9, 2026)

Same reviewer, same persona, same criteria as `design/v7/REVIEW.md`.

What I looked at:
- `NOTES.md` and the three boards.
- All 16 files in `renders/` at full size, with zooms on the hold ring, the sticky bar on screen 2 and the dark-mode duck edge.
- Text contrast, measured from the renders (approximate because of JPEG artefacts).

**Verdict: 8.9/10 overall, up from 8.4.** This is a real step up. Every must-fix from v7 landed at least partly, every hybrid item landed, every number is right, and every paywall rule passes in light and dark. Contrast on yellow is good everywhere.

It isn't at 9.5 yet, because of three things:
1. **Flow logic.** The irony-killer ("Ditch Pro on your list") is never actually shown on a list.
2. **The trial reminder breaks the product's own rule** and the copy says "like the rest".
3. **The charge-dates step** is slow and its grid can be misread.

The NOTES' self-score of 9.5 on every screen is about half a point to a point too generous on four screens.

---

## 1. Maya again (29, $68k, just paid $139 for Prime she forgot)

- **Welcome:** "Ditch it before it renews." She now sees *when* she'd be warned: Wed and Fri at 9:00 AM, before Netflix charges Saturday. That's the reliability proof she needs after the Prime surprise. The smaller duck no longer says "kids' app". **Gut reaction: "OK, this gets it."**
- **Pick, Total, Dates:** Pick and Total feel quick and satisfying. The share bars make $1,091 make sense.
  - Then she hits "When does Netflix charge you? **2 of 6**" and realises there are six of these. She'll tap through, but it's where she starts wondering how long this onboarding is.
  - She also glances at the 7-column grid, sees 14 in the "Sunday" spot and thinks "wait, the 14th is a Saturday".
- **Reminders pre-ask:** the best screen in the flow. A lock screen showing her own two Netflix notifications. She turns them on.
- **Paywall:** clear and honest, and she trusts it. She'd still say **"Continue free"**: she just learned 3 reminders are free, and she has 6 subs, so "3 is fine for now". That's fine; the free path is designed well. If she does start the trial, she never sees the Pro trial sitting on her list (see defect #1), which is the very promise that made the paywall feel honest.
- **Trust with money:** high. Cream work screens, real dates everywhere, "Ditch can't cancel for you" stated plainly, and a "So Saturday's $17.99 doesn't go through" cancel row.
- **Would she start the trial?** About a 35/65 split toward continuing free on day 1. She's a good bet to upgrade later, when the 4th reminder matters. That's the honest outcome Ditch wants.

---

## 2. Did the v7 must-fixes and hybrid items land?

| v7 item | Status | Notes |
|---|---|---|
| Home hold: keep the Netflix row visible, ring on its logo, consequence line | ✅ Landed | Name, $17.99 and Sat, Nov 14 stay visible. "Ditching saves $215.88 a year. Let go to keep it." In light mode the ring's unfilled track is almost invisible (#9). |
| Welcome: duck about 35% smaller, fill the dead band with proof | ⚠️ Mostly | The duck is 146pt and the heads-up timeline is added. A dead band of about 60pt remains between the subhead and the duck, and the timeline label formats don't match each other (#6). |
| Ditched: one clear cancel row plus New total $72.96 | ⚠️ Mostly | The row and strip are good, but a dead band of about 80pt remains between the strip and the cancel row (#5). |
| Dark mode | ✅ Landed | 5 dark screens. Warm ink canvas, sunflower only for money, CTAs and stamp. The duck gets a cream sticker edge that reads well. |
| Stamp: hand-drawn | ⚠️ Partial | A much better code stamp (wobble, pinholes, uneven pressure, date). Still not real hand-lettering. The NOTES are honest about that. |
| Curly apostrophes, +8px above the plans, visible unselected-plan borders | ✅ Landed | |
| Hybrid: This week / Next week / Later, bell column, "Reminders on 3 of 6" | ✅ Landed | The bells match the "Which 3" choice exactly (ChatGPT Plus, Netflix, Amazon Prime). |
| Hybrid: share bars on Total | ✅ Landed | Bars are exactly proportional (Netflix 0.90, Amazon 0.75, YouTube 0.70, Spotify/Disney 0.60 of ChatGPT). |
| Hybrid: "$0 today, then $29.99/yr from Nov 16. Cancel anytime." and 9 AM on the timeline | ✅ Landed | |
| Hybrid: Tickets' cancel line and Receipt's steps | ✅ Landed | "So Saturday's $17.99 doesn't go through. Account → Cancel membership · 1 min". |
| Hybrid: Night's dark craft as Sunflower's dark mode | ✅ Landed | |

---

## 3. Audits

### Numbers and dates (against BRIEF.md): all correct
- **Totals:** $90.95, $1,091 a year, $2.99 a day.
- **Yearly figures:** 240.00, 215.88, 179.88, 167.88, 143.88, 143.88.
- **Next charges:** Sat Nov 14, Mon Nov 16, Wed Nov 18, Sat Nov 21, Fri Nov 27, Thu Dec 3.
- **Day counts:** 5, 7, 9, 12, 18 and 24 days from Mon, Nov 9.
- **Netflix heads-ups:** Wed, Nov 11 and Fri, Nov 13. "Friday, November 13" is the right weekday for 2026.
- **"Renews tomorrow"** on Friday is correct.
- **First heads-ups:** ChatGPT Plus Wed, Nov 18 (3 days before Nov 21). Amazon Prime Mon, Nov 30 (3 days before Dec 3).
- **Ditched:** +$215.88, $431 since June, new total $72.96 (= 90.95 − 17.99), was $90.95.
- **"Pick your biggest 3"** = ChatGPT $20.00, Netflix $17.99, Amazon $14.99. Correct.
- The Charge-dates order (ChatGPT, then Netflix 2 of 6, then Amazon Prime next) matches the Total order. Consistent.

### Paywall rules (light 06 and dark d06): all pass in both modes
- × on the first frame (ink on a darker-yellow circle; cream on a dark circle)
- "Continue free: reminders for 3" is a real outlined 56pt button
- Restore · Terms · Privacy, underlined, about 7:1 light and 9.6:1 dark
- The billed price ($29.99/yr) is the largest price
- Timeline Today $0 → Sat, Nov 14 (9 AM heads-up) → Mon, Nov 16 $29.99
- No fake discount, no countdown, no weekly plan
- CTA "Start 7-day free trial"
- Plans and sublines exact
- Radio selection
- Fits 393×852 with no scroll

**One honesty flag:** "with a reminder *like the rest*" isn't literally true (defect #2).

### Contrast (measured)
- **Small text on sunflower:** all about 6.4–7.0:1. That covers the subheads, "Heads-up", footers, "a month", "tracked / with reminders", "new total a month", "was", and the empty-state subtitle. ✅
- **Cream screens:** secondary text about 5.6–7.4:1. ✅
- **Dimmed rows during the hold:** about 3.9:1 in light and 5.4:1 in dark. ✅ (The target was 3:1.)
- **Dark mode:** all small text about 6.9–9.7:1. ✅

### Dynamic Island and cropping
- Nothing collides with the island. The first content sits at y ≥ 70pt, and the paywall × sits at 56–88pt, clear of the island.
- Duck crops are all intentional peeks.
- The only accidental-looking crop is the "Shop" chip on screen 2. It's meant to scroll and reads that way.
- No text wraps inside buttons or chips.

### Flow and CTA consistency
1. Welcome **See what I pay**
2. Pick **See my total**
3. Total **Set my charge dates**
4. Dates **Next: Amazon Prime** (×6)
5. Pre-ask **Turn on reminders**
6. Paywall **Start 7-day free trial** / **Continue free: reminders for 3**
7. Which 3 **Save my 3**
8. You're set **Go to my list**
9. Home

The "my / I" voice is consistent and each screen leads into the next. Permission comes *before* the paywall, which is best practice.

Gaps:
- No Pro-path ending is designed (#1).
- The charge-dates loop is long (#3).
- The progress bar has no paywall segment (it goes 4/6 → paywall → 6/6), and on the Pro path it jumps from 4/6 straight to the end (#14).

---

## 4. Scores

| # | Screen | Light | Dark | Main reason it isn't higher |
|---|---|---|---|---|
| 1 | Welcome | 9.0 | 9.0 | About 60pt dead band; timeline labels mix "Wed, 9:00 AM" with "Sat, Nov 14" |
| 2 | What do you pay for? | 9.0 | n/a | No fade above the sticky total; Max sits about 7pt from the bar |
| 3 | Your total | **9.5** | **9.5** | Very little to fix |
| 4 | Charge dates | **8.0** | n/a | 7-column grid reads as a calendar (14 lands under "Sun" though Nov 14 is a Saturday); "Not sure" vs "Skip" is unclear; 6 screens of this |
| 5 | Reminders pre-ask | 9.0 | n/a | "No ads, no nagging." comes right before a paywall |
| 6 | Paywall | 9.0 | 9.0 | "With a reminder like the rest" isn't true (one heads-up 2 days before, not 3 days + 1 day) |
| 7 | Which 3 get reminders? | 9.0 | n/a | A second Pro pitch seconds after "Continue free" (mild) |
| 8 | You're set | **8.5** | n/a | "Keeping an eye on all 6" blurs the free limit; about 75pt dead band |
| 9 | Home, holding | 9.0 | **9.5** | Light: the ring's unfilled track is invisible on yellow; no "hold to ditch" hint anywhere on Home |
| 10 | Ditched | **8.5** | **8.5** | About 80pt dead band and too many blocks (will overflow on the SE); cancel steps assume Netflix bills you directly |
| 11 | Home, empty | 9.0 | n/a | Labels "Prime" and "Music" are ambiguous |

**Overall: 8.9/10.** Screens under 9: **04 Charge dates (8.0), 08 You're set (8.5), 10 Ditched (8.5 light and dark).**

---

## 5. Remaining defects, ordered by impact

1. **The irony-killer is never shown on a list. (Flow, high.)** The paywall promises "Ditch Pro trial: on your list, with a reminder". No screen shows it there.
   - Design the Pro path's You're set ("6 with reminders" plus a Ditch Pro trial row).
   - Design Home with a pinned **Ditch Pro trial · Mon, Nov 16 · $29.99** row with its bell and heads-up.
   - This row is the brand's honesty proof and the best App Store screenshot you aren't using.
2. **The trial reminder contradicts the product rule. (Honesty, high.)** Welcome and the pre-ask teach "3 days and 1 day before, at 9:00 AM". The trial gets one heads-up on Sat, Nov 14, which is 2 days before. The copy still says "like the rest". Two options:
   - (a) Show the real rule: heads-ups on Fri, Nov 13 and Sun, Nov 15 at 9 AM.
   - (b) Keep Sat, Nov 14 (it's locked in the brief) and change the subline to "On your list. We'll remind you Sat, Nov 14."
   - The owner decides. The current wording can't stay.
3. **The Charge-dates step is long. (Flow, high.)** Six one-per-sub screens push onboarding to about 13 screens before Home, against a 2-minute target.
   - Replace it with one "Charge dates" screen: six rows, tap a row to open a day sheet.
   - Or keep one-per-sub and add "Set the rest later" as the secondary action.
   - Rename "Not sure" / "Skip" to "Not sure: ask me later" / "Skip this one". Right now they look like the same thing.
4. **The day grid reads as a calendar. (s4, medium.)** Seven columns with 14 under the 7th column looks like Sunday, but Nov 14 is a Saturday.
   - Use 6 or 8 columns, or label it "Day of the month".
   - Or show a real November calendar with weekday headers.
5. **Ditched has dead space and too much on it. (s10/d10, medium.)** About 80pt of empty yellow sits between the strip and the cancel row, and on a 375×667 SE the stack will overflow.
   - Pull the cancel row up under the strip, so the buttons sit 24pt below it.
   - On small screens, drop the strip and fold "New total $72.96" into the kept line.
6. **Welcome timeline formats don't match, and there's a dead band. (s1/d01, medium-low.)**
   - Use "Wed, Nov 11 · 9 AM", "Fri, Nov 13 · 9 AM", "Sat, Nov 14 · $17.99".
   - Move the duck and notification block up about 40pt.
7. **"No ads, no nagging." comes right before the paywall. (s5, medium-low.)** Then "Reminders on all 6 with Pro" appears again on s7. Cut "no nagging" (keep "Nothing else. No ads."), or make the s7 link a quiet grey text link.
8. **You're set blurs the free limit. (s8, medium-low.)**
   - Change the copy to "All 6 are on your list. 3 get a heads-up." "Keeping an eye on all 6" sounds like 6 get reminders.
   - Remove the dead band of about 75pt above the CTA.
9. **The light-mode hold ring has an invisible track. (s9, low-medium.)** The unfilled part is dark-yellow on yellow (about 1.3:1), so progress is hard to read.
   - Make the track ink at 15–20% opacity, or cream.
   - The dark version (sunflower on grey) is fine.
10. **Cancel steps assume direct billing. (s10/d10, low-medium.)** If Netflix is billed through Apple, the path is Settings → [your name] → Subscriptions. Add this as a second line in the "›" sheet ("Paying through Apple? …"), so Ditch never gives a wrong instruction.
11. **No "hold to ditch" hint on Home. (s9, low.)** v7 had "Hold a sub to ditch it". The gesture is undiscoverable. Show the hint once, on first Home visit, then hide it.
12. **The sticky total on s2 has no fade.** Max's subtitle sits about 7pt above the bar. Add a cream fade of about 12pt above the bar so the list clearly scrolls under it.
13. **Empty-state labels:** "Prime" → "Amazon Prime", "Music" → "Apple Music" (abbreviate if needed, not ambiguously). The header "+" and the card "Add a subscription" do the same thing. That's acceptable, but the header "+" could be hidden in the empty state.
14. **Progress bar logic:** give the paywall its own segment, or exclude it and the "Which 3" step, so the bar never jumps. Make sure the Pro path ends at full too.
15. **Stamp:** still code. It needs real hand-lettering before launch, which the NOTES already say.
16. **Yearly-renewal story** (from the v7 review): still none in the flow. This is the owner's call. Maya's $139 Prime renewal is the story that sells, and a yearly Amazon Prime example in the App Store screenshot set would land hardest.

**Fix 1–5 and this is a 9.4–9.5 flow.** Items 6–14 are polish that takes a few hours each.
