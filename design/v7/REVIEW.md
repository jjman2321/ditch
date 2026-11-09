# Ditch v7: independent design review (Nov 9, 2026)

Reviewer brief: judge the 4 variations the way the target user and an App Store conversion person would. No politeness, no inflated scores. I looked at every `board.jpg` and every `s1–s5.jpg` at full size, zoomed into the risky areas, and measured text contrast from the renders (WCAG ratios, approximate because of JPEG artefacts).

**Short version:** **Sunflower (bold) wins, 8.4/10.** Night has the best everyday screen and Tickets has the best detail writing, but neither can beat Sunflower in the App Store or on the lock screen. A hybrid (Sunflower brand + Night's Home and data + Tickets' copy) scores higher than any single variation, about 9/10.

---

## 1. Persona check: Maya

Maya is 29, earns $68k and uses an iPhone. Amazon just charged her $139 for a Prime renewal she forgot. She searched "subscription tracker", tapped a result, installed it, and is now looking at the Welcome screen.

> One thing none of the four do: Maya's pain is a **yearly** renewal she didn't see coming. The example data is all monthly, so no Welcome screen shows "Amazon Prime renews in 3 days. $139." This is not a defect (the brief locks the numbers). But the App Store screenshot and the first notification shown should probably be about a yearly renewal, because that's the story that brings people in. The owner should decide.

### Receipt
- **First 3 seconds:** "Oh, a receipt. Netflix is crossed out. OK, a list of what I pay." It's clear but quiet, and it looks like many other clean white apps. The red DITCHED mini-stamp is the only spark. Nothing on the screen says *reminder*. The "heads-up" is only in the subtitle, so the main promise (we warn you before the charge) is told, not shown.
- **Trust with money:** Medium-high. Paper, mono numbers and white space feel honest and look like an accountant made it. The red stamp leans slightly toward "overdue bill".
- **Start the trial?** Probably not. The paywall's "Continue free" is plain text and the yellow plan has no clear selected state, so she'd pause. The receipt metaphor doesn't make her *feel* the reminder product.

### Tickets
- **First 3 seconds:** "Ooh, nice. Like Apple Wallet / Flighty." The Netflix pass says *Renews Sat Nov 14 · Heads-up Nov 11 + 13 · 9:00 AM*, which is the most concrete proof of reliability in any variation. The duck on navy is a bit lost (black outline on near-black).
- **Trust with money:** High. Navy, gold and mono labels read as "precise, time-critical, like an airline". That fits "reminders that actually fire".
- **Start the trial?** Likely. The boarding-pass trial route (Today $0 → Sat, Nov 14 We remind you → Mon, Nov 16 $29.99) is the clearest timeline of the four. But the "Season pass" and the fake barcode make her wonder for a second whether she's *buying* a pass.

### Sunflower (bold)
- **First 3 seconds:** "Ditch it before it renews." in giant black type, then a real notification: "Netflix renews Saturday. $17.99. Still watching?" She gets it in one second, without reading the subtitle. Then: "cute duck... is this a kids' app?" The duck takes up a third of the screen.
- **Trust with money:** Medium on Welcome, high from the Total screen on. The work screens (cream, ink and tabular numbers) are calm and grown-up. Yellow is friendly and confident (think Bumble or Mailchimp), not "bank". It's the opposite of Rocket Money's red-alert feel, which is good for someone who already feels a bit guilty.
- **Start the trial?** Yes, most likely of the four. This paywall is the easiest to read: the duck peeks over *its own* trial row, the timeline uses real dates, there are radio buttons, and "Continue free" is a real button. It looks like nobody is trying to trick her.

### Night
- **First 3 seconds:** "Pretty. Moody. Premium." The serif "Ditch it *before* it renews." with the glowing duck is the most elegant Welcome. A notification plus a fading list shows the product clearly. She might also think "dark and gold... is this a crypto or investing app?" The dark + gold + serif look is a common way to say "premium tier", and it hints at being upsold.
- **Trust with money:** High. It reads as calm and private, like a private bank. That also makes it feel more serious and expensive than she expects from a $30/yr utility.
- **Start the trial?** Likely. The vertical timeline and the "$0 today, then $29.99/yr from Nov 16" line are excellent. But "Continue free" is plain text, and that is the one rule miss on this paywall.

---

## 2. Score table

Each screen score covers clarity, trust, brand distinctiveness, craft and rule compliance. The "Duck" column scores how well the duck is used across all five screens. The overall score is weighted toward what earns money: Welcome, Paywall, App Store presence and Home retention.

| Variation | S1 Welcome | S2 Total | S3 Paywall | S4 Home (hold) | S5 Ditched | Duck use | Distinct (logo hidden?) | **Overall** |
|---|---|---|---|---|---|---|---|---|
| Receipt | 7 | 7 | **6** ⚑ | 6 | 7.5 | 7 | 6 (receipt + red stamp is a known trope; it's also the v6 look the owner already saw) | **6.5** |
| Tickets | 8 | 8 | 8.5 | 7 | **9** | 6.5 | 8 (ticket stubs with date columns are ownable) | **7.9** |
| Sunflower | 8.5 | 8.5 | **9** | 7.5 | 8 | 8 | **9.5** (you'd know it across a room) | **8.4** |
| Night | 8 | 8.5 | 7.5 ⚑ | **9** | 8.5 | 8 | 6.5 (dark + amber + serif is "premium fintech" in general; only the glow-duck is ownable) | **8.0** |

⚑ = a paywall rule from the brief is missed (details below).

### Paywall rule audit (brief §"Honest paywall")

| Rule | Receipt | Tickets | Sunflower | Night |
|---|---|---|---|---|
| × visible on first frame | ✅ (15.9:1) | ✅ | ✅ | ✅ (10.8:1, but sits at a 16pt margin, not 24) |
| "Continue free: reminders for 3" **as a real button** | ❌ bold text, no button shape | ✅ outlined button | ✅ outlined button | ❌ bold text, no button shape |
| Restore · Terms · Privacy | ⚠️ present, but "Restore ·" ends line 1 and "Terms · Privacy" wraps to line 2 | ✅ | ✅ (underlined, ~5.2:1) | ✅ |
| Billed price most prominent | ✅ | ✅ | ✅ | ✅ |
| Timeline Today $0 → Sat, Nov 14 → Mon, Nov 16 $29.99 | ⚠️ the data is there, but as two mono text lines, not a timeline; "SAT NOV 14" has no comma | ✅ best | ✅ | ✅ (adds 9 AM) |
| No fake discount / countdown / weekly | ✅ (but the red "7 DAYS FREE" chip looks like a sale tag) | ✅ | ✅ | ✅ |
| CTA "Start 7-day free trial" | ✅ | ✅ | ✅ | ✅ |
| Plans and sublines exact ($2.50 a month / $59.88 a year / Pay once) | ✅ | ✅ | ✅ | ✅ |
| Fits 393×852, no scroll | ✅ | ✅ (tight) | ✅ | ✅ |
| Clear selected-plan state | ⚠️ border weight only | ⚠️ gold border only | ✅ radio + check | ✅ radio + check |

### Number audit (against the brief's table)
All four get every number right: $90.95, $1,091 (and $1,091.40), $2.99 a day, the yearly figures (240.00, 215.88, 179.88, 167.88, 143.88, 143.88), the dates, the "in N days" counts (5/7/9/12/18/24 from Mon, Nov 9), +$215.88, $431 since June. Night's $72.96 new total is correct (90.95 − 17.99). Night's bars on the Total screen are proportional to the real yearly values (Netflix bar = 90% of ChatGPT, Spotify = 60%). Tickets' "heads-up Nov 11 + 13" is correct (3 days and 1 day before Nov 14). Sunflower's "Wed 9:00 AM" notification is correct (3 days before Sat, Nov 14).

Small data liberty: Receipt s5 says "Netflix **Standard**", a plan name that isn't in the data.

### Duck usage
- **Receipt (7):** peeks over the receipt on Welcome and Ditched. That's correct and restrained. The paywall icon crops the bill off the tile edge.
- **Tickets (6.5):** the black outline nearly vanishes on navy. On the paywall the duck is jammed into the bottom-left of a dark tile with the bill running off the edge. It looks like a cropped photo, not an icon.
- **Sunflower (8):** the duck peeking over *its own Pro trial* on the paywall is the best duck moment in the set. On the yellow tile it's the strongest small icon (notification and app icon). But on Welcome it's far too big, close to the "cute makes people treat themselves" risk in `mascot-or-not.md` (Nenkov & Scott).
- **Night (8):** the "nightlight" glow is the most original duck idea. But the notification and paywall icons put a tiny duck in the corner of a dark tile with lots of dead space, so it's weak at 20pt. The notes admit the outline problem.

---

## 3. App Store test

Picture one search-results row: **Rocket Money** (white screens, bright purple and red accents, busy dashboards) and **Bobby** (light pastel with colourful bubbles). Ditch's first screenshot sits next to them at thumbnail size, about 120pt wide.

| Variation | What survives at thumbnail size | Gets the tap? |
|---|---|---|
| **Sunflower** | A solid yellow tile with giant black "Ditch it before it renews." and a notification card. It's the only full-colour block in the row, and the headline is readable even at thumbnail size. | **Yes, wins.** It stands out most and makes its promise most clearly. |
| Tickets | Dark tile with a gold card; the condensed headline is readable. It looks premium and different from both competitors. | Strong second. |
| Night | Dark tile; the thin serif and glow turn to mush when small; the amber CTA is the only clear shape. Stands out by darkness, but you can't read the promise. | Third. |
| Receipt | White tile with small mono text. It looks like Bobby's and Rocket Money's light screens and disappears. | Last. |

---

## 4. Defects (concrete fixes)

### Receipt
1. **s3:** "Continue free: reminders for 3" is bold text, not a button. Make it a 56pt outlined button (rule miss).
2. **s3:** fine print breaks after "Restore ·". Put "Restore · Terms · Privacy" on its own line.
3. **s3:** the trial timeline is two mono text lines. Turn it into a visual Today → Sat, Nov 14 → Mon, Nov 16 timeline with commas in the dates.
4. **s3:** the red "7 DAYS FREE" chip reads as a sale or discount badge. Use an ink or neutral chip.
5. **s3:** the headline runs to 3 lines with a lone "too." Tighten it or reduce the size.
6. **s3:** body copy "Pro puts a heads-up... And Ditch Pro goes on your receipt" repeats "Pro". Rewrite it.
7. **s3:** the selected plan only has a thicker border. Add a radio or check.
8. **s3:** the duck in the Ditch Pro tile has its bill cropped by the tile edge.
9. **s4:** the hold ring sits in a toast at the bottom of the screen, away from the Netflix row being pressed. Your finger is on the row but the feedback is 800px away. Put the ring on the row.
10. **s4:** about 280px of empty canvas between the receipt and the toast.
11. **s4:** the list is sorted by price, but the header says "NEXT: NETFLIX". Sort by next charge or label the sort.
12. **s4:** the free-tier state (which 3 subs have reminders) isn't shown anywhere.
13. **All screens:** DM Mono's slashed zero renders "$20.00" like "$2Ø.ØØ", which hurts money legibility. Use a mono with a plain zero, or Inter tabular.
14. **s2:** about 200px of dead space between the receipt and the line above the CTA. Put the guess-vs-real line there, or the per-sub yearly figures.
15. **s5:** the stamp's lower border touches the dashed rule below it. Give it 12px of clearance.
16. **s5:** "+$215.88" appears twice ("$215.88/yr" on the receipt and the big number below). Drop one.
17. **s5:** about 230px of dead space between the cancel card and Undo/Done.
18. **s1:** nothing on the Welcome screen shows a reminder. Add a notification.
19. **Status bar:** the Wi-Fi glyph is missing.

### Tickets
1. **s4: no tab bar.** Home can't reach Calendar or Settings except through the gear. Add tabs.
2. **s4:** dimmed rows turn muddy grey-beige (#BCBCB4) and look broken or disabled rather than "in the background". Dim with opacity over navy instead of greying the card stock.
3. **s4:** the black notches between stacked rows form a column of "chain links" down the right side. Hide the notches on dimmed rows, or space the rows 12pt apart.
4. **s4:** during the hold, Netflix's date stub turns into the ring and the date survives only as small mono text. Keep "SAT 14 NOV" on the stub and put the ring around the logo.
5. **s4:** the free-tier reminder state isn't shown (no bells, no "3 of 6").
6. **s2:** the "$1,091" comma descender ends about 3px above "$1,091.40 EXACTLY" and nearly collides. Add 12px.
7. **s2:** the fake barcode is decoration that means nothing. Remove it.
8. **s2:** "HOLDER YOU" and "NOV 2026 – NOV 2027" make the total look like something you *bought*. Rename it "Your year" or similar.
9. **s2:** dead gold band of about 80px under the number.
10. **s3:** "A YEAR / A MONTH / ONCE" labels are about 10pt mono at ~4.1:1. Raise them to 4.5:1 or 12pt.
11. **s3:** the Ditch Pro duck icon is cropped into the bottom-left of a dark tile. Use the same app-icon artwork as everywhere else.
12. **s3:** blocks have only about 14pt between them. It's dense.
13. **s1/s5:** the duck's black outline on #0C1322 is almost invisible. You need a white-outline dark-mode duck asset.
14. **s1:** the back tickets (Spotify, Disney+) are greyed beige, the same problem as #2.
15. **Copy:** straight apostrophes (We'll, Let's, You've, Saturday's, doesn't). Use ’.
16. **System:** dark-only. A light-mode version isn't designed, and the stock-on-navy look may not survive one.

### Sunflower (bold)
1. **s4 (biggest):** the ink "Keep holding" card *replaces* the Netflix row. During the hold you can't see the name, date or $17.99 of the thing you're about to ditch. Keep the row visible and lifted in place, put the yellow ring on its logo, and show the consequence ("Ditching it saves $215.88 a year. Let go to keep it.").
2. **s4:** the overlay is 12pt wider than the list and covers its top edge. It reads as a toast that landed on the list, not as the row reacting.
3. **s1:** the duck is about 55% of screen width and leaves a dead yellow band (about y 720–950). Shrink the duck by ~35%, move the notification up, and add one proof line under it ("Heads-up Wed and Fri, 9:00 AM").
4. **s5:** the honesty note is a 3-line paragraph on pale yellow (#FCECA4), lowest in the hierarchy and the wordiest copy in the set. Replace it with a row: "Now cancel it in Netflix · before Sat, Nov 14 ›".
5. **s5:** dead band of about 210px between "$431" and the note. Add the New total $72.96 / Was $90.95 strip.
6. **s2:** dead yellow band of about 150px under the list. Move the line and CTA up, or add proportional bars.
7. **s3:** checklist to plan card gap is about 16px, tighter than everything else. Add 8px.
8. **s3:** unselected Monthly and Lifetime cards have a near-invisible border on cream. Darken the border to #E6DFD0.
9. **Stamp:** it's Archivo plus a roughness filter, not hand-drawn. Ink on yellow also says "caution tape / streetwear". The real hand-lettered stamp is required before launch.
10. **Dark mode isn't designed.** Full-bleed #FFCC2E at 11 PM is a flashbang. Design it as an ink canvas with sunflower money and accents. Night's craft is the template.
11. **Wordmark:** "ditch" is plain Archivo lowercase. It needs a drawn wordmark, or should be dropped from Welcome (the headline already says Ditch).
12. **Copy:** straight apostrophes (We'll, Let's, You've, can't). Use ’.

### Night
1. **s3:** "Continue free: reminders for 3" is bold text, not a button. Make it a 56pt outlined button (rule miss).
2. **s3:** the × circle sits at a 16pt right margin while everything else is at 24, and it crowds the headline's first line. Move it in and up.
3. **s3:** the timeline's right column mixes money ($0, $29.99) and a time (9 AM). Move "9 AM" into the left text ("Sat, Nov 14 · 9 AM").
4. **s4:** dimmed rows during the hold measure about **1.9:1**. Even as a transient state, keep them at 3:1 or higher so the list stays readable while the user decides.
5. **s4:** the header "$90.95" is also dimmed to grey serif. The total should stay legible during the hold.
6. **s1:** the notification says "now". It should show the real scheduled time ("Wed 9:00 AM") so it proves the 3-days-before promise.
7. **s1/s3:** the notification and paywall duck icon is a tiny duck in the corner of a dark tile. Make the duck about 70% of the tile.
8. **s1:** the footer measures about 4.2:1. Raise it to 4.5:1.
9. **s2/s4:** the light-weight Newsreader money numbers ($1,091, $90.95) look elegant at full size but turn to mush in App Store thumbnails and the widget. Use a heavier optical size for money.
10. **s5:** the glowing amber stamp reads as a neon sign, not a rubber stamp. Lose the outer glow and keep the ink texture.
11. **s5:** heavy stack (stamp card, number, kept line, totals strip, cancel card, buttons). Cut the space between the strip and the cancel card or merge them.
12. **Brand:** dark + amber + serif is the generic "premium tier" look (Robinhood Gold, Amex, crypto wallets). With the duck hidden, it isn't recognisable.
13. **System:** dark-only. Light mode isn't designed.
14. **Status bar:** the Wi-Fi glyph is missing.

### Dynamic Island / cropping check
Nothing collides with the Dynamic Island in any variation. All headers start at y ≥ 110pt-equivalent. The closest is Night s3's × (top at about 56pt), which is legal but tight.

---

## 5. What to steal

| From | Steal this | Why |
|---|---|---|
| **Receipt** | The concrete cancel step on Ditched: "Account → Cancel membership. Takes 1 minute." with "Show me". | The most useful honesty line in the set. It tells you *how*, not just *that*. |
| **Receipt** | "*** THAT'S $2.99 EVERY DAY ***" as a receipt-style footnote for the share card or widget. | Cheap personality. |
| **Tickets** | The heads-up detail on Welcome: "Heads-up Nov 11 + 13 · 9:00 AM". | The most direct proof of "reminders that actually fire", which is the #1 thing the product sells. |
| **Tickets** | Ditched copy "So Saturday's $17.99 doesn't go through." and the "Reminders Off · History Kept" facts. | The best line in all four. It says what's at stake, with a real date and amount. |
| **Tickets** | Teal for money-back and the stamp. | It matches CLAUDE.md ("hand-drawn teal stamp") and it's the only variation that does. Worth deciding on purpose. |
| **Sunflower** | The whole brand layer: sunflower brand moments, cream work screens, wide Archivo money, the duck peeking over its own Pro trial, the yellow-tile icon. | The highest App Store and lock-screen recognition. |
| **Night** | The Home screen: This week / Next week / Later grouping, the bell column showing which 3 have reminders, "Reminders on 3 of 6", and the spotlight hold with "Ditching it saves $215.88 a year. Let go to keep it." | The best everyday screen. The free tier is honest and the hold gesture shows its consequence. |
| **Night** | Proportional bars on the Total list. | They turn the reveal into a picture of *where it goes*. |
| **Night** | New total $72.96 / Was $90.95 on Ditched. | A real result, not a badge. |
| **Night** | Paywall fine print "$0 today, then $29.99/yr from Nov 16. Cancel anytime." | The clearest one-line billing disclosure (Blinkist-style). |
| **Night** | The dark-mode craft (ink navy, hairline cards, warm off-white text). | This *is* Sunflower's missing dark mode, with sunflower replacing amber. |

---

## 6. Ranking and pick

| Rank | Variation | Overall |
|---|---|---|
| **1** | **Sunflower (bold)** | **8.4** |
| 2 | Night | 8.0 |
| 3 | Tickets | 7.9 |
| 4 | Receipt | 6.5 |

### Why Sunflower is #1 for Ditch's success
1. **It wins the App Store row.** It's the only full-colour tile next to Rocket Money and Bobby, and its headline is readable at thumbnail size. With no ad budget, the search-results tap is the whole funnel.
2. **It wins the lock screen,** where users see Ditch most (`mascot-or-not.md` point 8). A yellow tile with a white duck is the only icon of the four that's crisp at 20pt.
3. **It has the best paywall:** every rule met, radio selection, a real "Continue free" button, and the duck peeking over its own trial (a visual version of the irony-killer).
4. **Light work screens by default.** Most iPhones run in light mode. Night and Tickets are dark-only, and their premium feel may not survive a light version. Sunflower's missing dark mode is easier to solve because Night already shows how.
5. **It's the most ownable:** with the logo hidden, you'd still know it. Night fails that test, and Tickets only half passes.

What holds it back from 9+: the Home hold state hides the row being ditched, the Welcome duck is too big (the cute-cuts-trust risk), the Ditched honesty note is buried, and the dark mode doesn't exist yet.

### Would a hybrid beat every single variation? Yes, at about 9/10.
**The hybrid: "Sunflower brand, Night behaviour, Tickets precision."**

- **Brand layer (Sunflower):** #FFCC2E full-bleed for Welcome, Total, Ditched and the paywall header. Cream #FBF7EE work screens, ink #16140F type, Archivo wide 900 for display money, Inter for body. The duck peeks over whatever it's watching. Yellow-tile app icon. Ink (or teal, decided on purpose) hand-drawn stamp.
- **Welcome:** Sunflower's layout with the duck about 35% smaller. The notification moves up and gets Tickets' proof line underneath: "Heads-up Wed, Nov 11 and Fri, Nov 13 · 9:00 AM". Night's idea of a short list fading out under the notification fills the dead band.
- **Total:** Sunflower's giant "$1,091 a year." and the month/day split, plus Night's proportional bars on each yearly row (ink bars on white). Move the CTA up to remove the dead band.
- **Paywall:** keep Sunflower's paywall as it is. Swap in Night's fine print "$0 today, then $29.99/yr from Nov 16. Cancel anytime.", add "9 AM" to the Sat, Nov 14 step, and darken the unselected card borders.
- **Home:** Night's structure in Sunflower's colours. Yellow total card with "Reminders on 3 of 6"; This week / Next week / Later; a bell column. The hold is Night's spotlight: the Netflix row lifts in place, a yellow ring fills around its logo, other rows dim to at least 3:1, and the line under it reads "Ditching it saves $215.88 a year. Let go to keep it." No toast covering the list.
- **Ditched:** Sunflower's yellow stamp moment. Replace the pale paragraph with a single row: "Now cancel it in Netflix: So Saturday's $17.99 doesn't go through ›" (Tickets). Inside it, Receipt's "Account → Cancel membership. Takes 1 minute." Add Night's New total $72.96 / Was $90.95 strip in the dead band.
- **Dark mode:** Night's ink-navy canvas, hairline cards and off-white text, with sunflower as the only accent instead of amber, and a white-outline duck asset.

### Top 5 must-fix for the winner (Sunflower)
1. **s4:** don't hide the Netflix row during the hold. Lift it in place, ring around the logo, add the "saves $215.88 a year, let go to keep it" line.
2. **s1:** shrink the duck by about 35% and fill the dead yellow band with proof (the heads-up dates and 9:00 AM).
3. **s5:** replace the 3-line pale honesty note with one clear "Now cancel it in Netflix before Sat, Nov 14 ›" row, and add New total $72.96 in the empty band.
4. **Dark mode:** design it (ink canvas, sunflower accents) before building. Full-bleed yellow at night isn't shippable.
5. **Stamp:** replace the font-plus-filter stamp with a real hand-lettered one, and fix the small craft slips while you're there: straight apostrophes → ’, 8px more space above the plans, and visible borders on unselected plan cards.
