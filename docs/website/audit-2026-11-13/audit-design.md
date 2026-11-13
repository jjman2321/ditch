# ditchsubs.app: UI craft audit (Nov 13, 2026)

Scope: layout, spacing, alignment, type scale, shape language, colour, consistency, mobile, motion.
Method: Playwright full-page shots of 12 routes at 1440 and 390 (@2x), reduced motion on. Two scroll videos of home (1440, 390) with motion on, cut into frames with ffmpeg. DOM measurements (radii, shadows, yellow blocks, heading sizes, card geometry). 6 Mobbin searches.

Note: localhost:3100 was down when I started (connection refused). I briefly ran `next start -p 3107` on the existing build, then 3100 came back and every capture below was taken from 3100. Nothing was rebuilt and no project files were touched.

Evidence folder: `/tmp/claude-0/-home-user/b6b27c63-8e53-560d-a517-60b6e884bad4/scratchpad/design-audit/`
- Full pages: `<page>-1440.png`, `<page>-390.png`
- Readable slices: `slices/<page>-<w>_NN.png`
- Motion: `video/1440/v.webm`, `video/390/v.webm`, contact sheets `video/hero-1440-sheet.png`, `video/hero-transition-1440.png`, `video/sheet1440_0..6.png`, `video/sheet390_0..9.png`
- Measurements: `../metrics.txt`

Owner-locked items I did not reopen: the rotating chip, the desktop hero phone, pricing option C, the ditch card plus duck, light theme only, English only. Where I comment on them, it's only about how they're built, never whether they should exist.

---

## Scores

| Page | 1440 | 390 | One-line verdict |
|---|---|---|---|
| Home | 6.5 | 6 | Strong parts, but it's one yellow block after another and one 56px three-line H2 after another. |
| /cancel (index) | 6.5 | 5.5 | A clean directory, but generic. On phone the filter chips take 5 rows before the first guide. |
| /cancel/netflix | 7.5 | 7 | The best template on the site. A few slop tells: the rounded card with a coloured left border, a cramped email box, steps that are text only. |
| /cancel/disney-plus | 7.5 | 7 | Same template. The "Apple (signed up on iPhone)" tile wraps, so the three tiles don't match. |
| /prices (index) | 6.5 | 6 | Same as /cancel. Logo tiles are inconsistent. |
| /prices/netflix | 6 | 5 | A 51-row table: 4,500px on desktop, about 12 screens on phone. |
| /about | 5 | 5.5 | Half the page is empty. The "signature" is set in a typeface, so it reads as fake. |
| /how-we-check | 6 | 6 | Double list markers (a bullet plus "1."). Text-only page. |
| /support | 6 | 6 | Fine but bare. No anchors or groups. |
| /privacy | 7 | 7 | Good summary card. Typical legal layout. |
| /waitlist | 4.5 | 5 | The most important conversion page is the emptiest one. |
| 404 | 7 | 7 | Nice copy. The duck floats with its flat cut bottom showing. |

---

## P0: rule breaks or the biggest craft problems

### P0-1. Nine sunflower blocks on the home page (budget is 3, never next to each other)
Measured yellow blocks wider than 200px: hero, calculator receipt, step shots ×3, ditch card, reminders panel, Pro card, final CTA = **9**. Five of them sit between y=1177 and y=3776 at 1440. The design system says 12–18% sunflower in at most 3 blocks, never adjacent. Right now yellow is the wallpaper, not the frame, and the page looks like one long run of the same thing.
Evidence: `slices/home-1440_01.png`, `slices/home-1440_02.png`, `slices/home-390_03.png`–`_06.png`, `metrics.txt` ("yellow").
Fix (keep yellow on the hero, the receipt, the ditch card (owner-locked), the Pro card (locked) and the final CTA, and take it off everything else):
- `.step .shot { background: var(--chip); }` (#EFE8D9). Or, better, see P1-3.
- `.big-notif { background: var(--ink); background-image: radial-gradient(120% 80% at 50% 0%, #4a4537 0%, #2b2923 55%, #1d1b17 100%); }` and `.big-notif .next { background: rgba(255,255,255,.12); color: #EDE6D6; }`. The notifications then sit on a lock-screen-dark surface without a drawn phone, and it breaks the yellow run.
- `.calc .receipt` stays yellow, but it sits right before the steps. Once the step shots go cream, the yellows alternate.

### P0-2. The pricing table moves (breaks "Never animate: pricing table" and "nothing moves near a price")
`globals.css` lines 626–637: the `.pg` cards fade and rise in a stagger, the "7 DAYS FREE" and "SAVE 49%" badges pop (scale .6→1 with overshoot) on the $29.99 box, and the duck springs up 60% beside the prices. The frames show it: `video/sheet1440_2.png` (t≈10.3–11.7s). CLAUDE.md rule 8 says nothing moves near a price, and design-system.md says never animate the pricing table.
Fix: delete the whole `@media (prefers-reduced-motion: no-preference) { .js .pg … }` block (lines 626–637) and drop `data-reveal` from `<div className="pg">` in `page.tsx`. Keep the duck static: he's still "watching" from the Pro card edge, and that's his job.

### P0-3. Notifications that carry a price fade in (hero on phone, reminders panel)
`Notif.tsx` itself says "Static: it carries a price, so it never animates", and the design system lists "the hero notification" under Never animate. But `.js .hero-notifs .notif` (lines 538–542) and `.js .big-notif > *` (lines 678–684) fade them in one after another. On desktop that also leaves an **empty yellow panel** on screen for about 0.5–0.9s (`video/sheet1440_1.png`, last frame).
Fix: delete both blocks. If you want a sign of life, put the motion on the "Next reminder" pill only (it has no price).

---

## P1: hurts craft or conversion, fix next

### P1-1. Seven H2s at 56px, five of them three lines tall, all left-aligned with an empty right half
Measured: calc, how, trust: 3 lines at 720px wide. The `.sec-head { max-width: 720px }` cap plus Archivo Wide gives a column of headings with ~600px of dead space beside each one (`slices/home-1440_00.png` bottom, `_01.png` middle, `_03.png` bottom). The hierarchy is also flat: H1 72px vs H2 56px (ratio 1.29; a good ratio is ≥1.6).
Fix:
- `.sec-head { max-width: 880px; }`. Calc and trust then wrap to 2 lines.
- Cut the titles: "How it works: from sign-up to cancelled" → **"How it works"**; "Private by design: no bank login, no account" → **"Private by design"** (the cards already say no bank login).
- Give the 3 "moment" H2s (calc, pricing, final) the full 56px. Drop the support H2s (how, trust, FAQ) to a "section H2s" of `clamp(1.75rem, 1rem + 2vw, 2.5rem)` so the page has a rhythm instead of 7 equal shouts. Then delete the inline `style={{ fontSize: … }}` on the FAQ H2 and use a class.

### P1-2. The same "Netflix ditched + duck" picture appears twice in a row
Step 3's shot (`DitchDemo small`) and section 3b (`DitchDemo`) are the same card 300px apart, on desktop and on phone (`slices/home-390_04.png` → `_05.png`). That reads as filler.
Fix: step 3's shot becomes the **official cancel page hand-off** instead. A drawn mini sheet: "Netflix · Cancel guide · ① Open netflix.com/cancelplan · Open cancel page ↗" (reuse `.mini-list` styling). Then section 3b is the only place the ditch moment lives.

### P1-3. The "How it works" cards don't line up: the picture tops differ by 29px
Measured: shot tops at y=2345 / 2374 / 2374. Card 1's H3 is one line and cards 2–3 are two. `grid-template-rows: auto auto auto 1fr` is set per card, so rows don't line up across cards (`slices/home-1440_01.png`).
Fix (subgrid):
```css
@media (min-width: 861px) {
  .steps { grid-template-rows: auto auto auto 1fr; }
  .steps .step { grid-row: span 4; display: grid; grid-template-rows: subgrid; }
  .step p { min-height: 0; }
}
```
Better still, borrow from Airtasker/Norma (refs below): **picture on top, text under it, no white card**. That alone aligns the tops and takes away one box layer.

### P1-4. Section order: the steps go add → remind → cancel, but the detail sections go cancel → remind
Reminders are the product (CLAUDE.md rule 3, "the #1 complaint about Bobby"), yet they come 5th, after the cancel moment.
Fix: swap 3b and 4 in `page.tsx`. Steps → **Reminders that actually arrive** → **Cancel it and see what you won't pay** → Pricing. The emotional peak (the $239.88 card) then lands right before the price, which helps the "it pays for itself" argument.

### P1-5. On phone, the hold ring reads as a loading spinner, and the meta wraps to 3 lines
At ≤480px `.dd-hold { font-size: 0 }` hides "Hold to ditch", so all you see is a small ring filling: a spinner (`video/sheet390_3.png`, bottom row). The row meta "Standard · $19.99/mo" breaks into "Standard ·" / "$19.99/mo" (`slices/home-390_05.png`).
Fix: `@media (max-width:480px){ .dd-hold{ font-size:13px; gap:6px; } .dd-name span{ white-space:nowrap; } }` and pass `meta={`${formatMoney(...)}/mo`}` (without the plan name) on phone, or move the plan to its own line on purpose.

### P1-6. Ditch card and reminders panel show an empty yellow box while they animate
Before `.is-in` the ditch card is a 347px yellow panel with one row and a blank lower half for ~1.95s. On phone, at normal scroll speed, people see the empty state more often than the finished one (`video/sheet390_3.png`, frames 6–8).
Fix: start it later and run it shorter. In `Reveal.tsx`, give `.ditch-demo` its own observer with `threshold: 0.6`. Then ring `1s → .7s`, tag at `1.0s`, duck at `1.1s`, number at `1.35s`. The motion stays owner-approved, it just finishes while the card is fully on screen. (The reminders panel is fixed by P0-3.)

### P1-7. The calculator on phone is 2.2 screens tall before the total
Measured: the section is 1,831px at 390. Tiles are 3 across (`@media (max-width:400px)`) with 96px min-height, and the 18th tile (Audible) sits alone on a row (`slices/home-390_01.png`, `_02.png`). The design system says 4 across on phone with a pinned total row.
Fix: `@media (max-width:639px){ .tiles{ grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px } .tile{ min-height:80px; padding:10px 2px 8px; font-size:11px } .tile img,.tile .mono{ width:36px;height:36px } }`. Delete the `max-width:400px` 3-column rule. Then add the planned sticky total bar: `.receipt-mini { position: sticky; bottom: 12px; }` showing "$1,109 a year · See list" while the tiles are in view. 18 tiles ÷ 4 = 4.5 rows, so either drop to 16 or add a 20th "Add your own +" tile so the last row is full.

### P1-8. The `Notif` time isn't right-aligned when the message is short
Phone hero: "Tue" sits ~70px left of "now" in the card above it (`slices/home-390_00.png`). The inner `<div>` doesn't grow, so `justify-content: space-between` on `<b>` only spans the text width.
Fix: `.notif > div { flex: 1; min-width: 0; }`.

### P1-9. Service logos are drawn three different ways (affects every page)
Some are full-bleed app icons (Netflix, Spotify), some are glyphs on a light tile (ChatGPT, Apple Music, Notion), and some are bare glyphs with no tile at all (Google One, YouTube, Costco, ESPN, Headspace, Instacart+). In a grid, the bare ones look broken or missing (`slices/cancel-1440_00.png`, `slices/prices-1440_00.png`, the calculator).
Fix: put every logo in one tile: `.logo-tile { background:#fff; border-radius:22.5%; box-shadow: inset 0 0 0 1px rgba(22,20,15,.08); display:grid; place-items:center; } .logo-tile img { width:72%; height:72%; }` for glyph logos, and full-bleed for real app-icon logos (add a flag per logo in the data: `bleed: true|false`).

### P1-10. Guide "Short answer" card: a rounded card with a coloured left border
`.answer { border-left: 6px solid var(--sun); border-radius: 16px }` bends the yellow bar around the corners into a crescent. It's the most recognisable template-site tell, and it's the first thing on every SEO page (`slices/cancel-netflix-390_00.png`, left edge).
Fix: `.answer { border-left: 1px solid var(--card-border); background:#FFF8DC; }` and turn `.lbl` into a small ink pill: `.answer .lbl{ display:inline-flex; background:var(--ink); color:var(--sun); border-radius:999px; padding:4px 10px; }`. Or use the same white card with a 4px sunflower **top** strip clipped by `overflow:hidden` (a top strip on a rounded card reads as a tab, not a sliver).

### P1-11. The guide's email box is too narrow inside "Not ready to cancel?"
The placeholder is cut to "you@email.cc" at 1440 (`slices/cancel-netflix-1440_01.png`). The appcard splits 50/50, and the notification takes half.
Fix: `.appcard { grid-template-columns: minmax(0,1fr) 280px; }` and `.appcard .email { max-width: none; }`. Or stack the notification above the text and let the email box run the full width.

### P1-12. Cancel steps are text only
Best-in-class how-to pages show the exact control to tap (Voicenotes and Square refs below). Ours is "Tap Cancel" in body text.
Fix (no screenshots, no phone mockups): render the UI words as drawn buttons. `<span class="ui">Cancel Membership</span>` with `.ui{ display:inline-flex; padding:2px 10px; border-radius:8px; background:#fff; box-shadow: inset 0 0 0 1px rgba(22,20,15,.15), 0 1px 0 rgba(22,20,15,.1); font-weight:600; font-size:.92em; }`. That's cheap, honest, scannable and on-brand.

### P1-13. The price page is one 51-row table
`/prices/netflix` is 7,933px tall at 1440 and 10,214px at 390. 17 country header bands × 3 plans; the phone view also stacks the "a year" figure inside every row (`slices/prices-netflix-1440_02.png`, `slices/prices-netflix-390_01.png`).
Fix: a matrix. **Rows = countries, columns = the 3 plans**, monthly price bold with the yearly figure in small grey under it. The visitor's country row gets highlighted (Wise and Mailchimp pattern), and the country header bands go away. That's 17 rows instead of 51 (≈ −60% height). On phone, keep a single-country card (a country `<select>` at the top, defaulting to the visitor's country) plus "See all 17 countries" which expands the matrix with horizontal scroll and a sticky first column.

### P1-14. /waitlist is a bare form
It's a headline, a field, a checkbox and nothing else (`waitlist-1440.png`): no product, no duck, no reason to sign up. A focused page like this should convert better than the home page, and right now it's the weakest page on the site.
Fix (ISO Meet pattern): the app icon (duck) 72px above the H1. 4–6 **still** real service logos floating at the outer edges (desktop only, 56px, rotated ±6°, the same `.float` style as the hero). Under the form, 3 ticks: "One email on launch day · Free forever for tracking · No bank login". Success state: the duck plus "You're on the list."

### P1-15. On phone, the cancel/prices indexes push the first result below the fold
The chips wrap to 5 rows, so the first guide sits at y≈720 of 844 (`slices/cancel-390_00.png`).
Fix: `@media (max-width:639px){ .chips{ flex-wrap:nowrap; overflow-x:auto; scrollbar-width:none; margin-right:calc(-1*var(--pad)); padding-right:var(--pad); -webkit-mask-image:linear-gradient(90deg,#000 88%,transparent); } .chips > *{ flex:none; } }`. Also shorten the 4-line lead to one line.

---

## P2: polish

1. **20 different corner radii on home** (tokens allow 4 plus the logo %): 7, 9, 10, 11, 12, 15, 18, 20, 22, 24, 28, 44, 56… Move `.mini-list` 18→16, `.pc-opt` 20→16, `.dd-row` 20→16, `.search-res a` 14→8, `.email` phone 24→28, `.hero .float` 15px → 22.5%. Leave `.notif` 22 (iOS spec) and the phone alone. Evidence: `metrics.txt` "radii".
2. **Shadows**: 4 different "floating" shadows. Use one: `0 8px 20px -6px rgba(22,20,15,.25)`, and drop the heavier `.dd-row` double shadow (`0 16px 32px -14px .35`).
3. **The hero phone's bottom is cut through the lock-screen buttons**: two grey half-circles sit on the hero edge, which looks like a cropping mistake (`slices/home-1440_00.png`, y≈715). Use `.phone .lockbtns{ display:none }` or `bottom:-120px`.
4. **The Netflix floating logo touches the phone edge** (x 850–910 against the phone at 910). The design system says ≥24px. Set `left:'-2%', top: 96`. Netflix also appears 3× in the hero (chip, float, notification). Swap that float for Hulu or YouTube.
5. **The hero chip changes width by up to 138px** (Prime 327 → ChatGPT 465), and the cross-fade shows two half-transparent white chips over each other: a muddy cream ghost mid-transition (`video/hero-transition-1440.png`, row 2). Keep one white chip still and animate only its contents. Put `.chip` background on `.slot` (`background:#fff; border-radius:.18em; transition: width .4s cubic-bezier(.65,0,.35,1)`), set the slot width from JS to the incoming name's measured width, and slide just the logo+name (`clip-path` on the slot, no opacity on the white). Owner-locked, so this is only about how it's built.
6. **The FAQ left column is 900px of empty** next to 13 questions (`slices/home-1440_04.png`). Use `.faq > div:first-child { position: sticky; top: 96px; align-self: start; }` and put the duck (≤120px, empty-state job) or a "Still stuck? Email us" mini card under it.
7. **The trust cards are three text boxes with dead space under them.** Use the Monarch "Why pay" layout: H2 plus lead in the left 4 columns, a 2×2 grid of short claims on the right (add a 4th: "Your list stays if Pro lapses"). That removes the 3-line H2 and fills the empty right side. Or use the Shop pattern: two big claims split by a 1px vertical rule, with no cards at all.
8. **Final CTA**: a 458px yellow slab with a headline and a field. Add the app icon (72px) above the H2 and 4 still logos at the slab's corners (ISO Meet). On phone the H2 breaks as "Fewer surprise / charges. / More say in / what renews." Add `<br>` after "charges." and wrap "More say" in `.nw`.
9. **Footer**: the 4 equal columns leave Ditch and Legal half empty. Calendly/Origin pattern: left 5 columns for "The Price Hike Report, monthly" email signup (the owner already wants this newsletter), right 7 columns for 3 link columns (merge Legal into Ditch). The 128px cream gap between the final CTA and the footer makes the footer look detached. Set `.ftr{ margin-top:64px }` when it follows `.final`.
10. **Inline style overrides** in `page.tsx` (`paddingTop:0` ×6, `marginTop:20` ×3, `marginTop:96`, FAQ fontSize) break "no ad-hoc padding overrides". Make them classes: `.sec + .sec { padding-top: 0 }` (or a `.sec-flow` modifier) and `.split .lead { margin-top:20px }`.
11. **About**: the right 55% is empty, and "Aribo" set in Archivo Display rotated −4° reads as a fake signature. Use a 2-column letter: letter in 7 columns, right 5 columns a sticky "maker card" (duck avatar 120px, "Aribo · makes Ditch", email link). Replace the type signature with a real hand-drawn SVG signature, the same hand as the stamp, or drop it.
12. **How-we-check** has double markers: a bullet plus "1." inline (`slices/howwecheck-1440_00.png`). Use the `.olist` numbered circles.
13. **Index cards**: "Checked Nov 10, 2026" repeated 31× is noise. Say "All checked Nov 10, 2026" once under the H1 and give each card something useful ("3 steps · cancel on web").
14. **"How do you pay" tiles**: "Apple (signed up on iPhone)" wraps to 2 lines, so the 3 tiles look uneven. Shorten it to "Apple (iPhone)".
15. **404 duck**: the flat cut-off bottom floats in mid-air. Peek him over the top edge of a card (like the Pro card) or put a 2px ink ground line under him.
16. **The header icon buttons on sunflower** (`rgba(22,20,15,.07)` on #FFCC2E) look olive and muddy. Use `.hdr.on-sun .iconbtn{ background: rgba(255,255,255,.45) }`.
17. **The calculator picker panel** has ~117px of empty white under "Pick from 200+" at 1440 (the receipt is taller). Use `.calc .pick{ display:flex; flex-direction:column } .calc .pick > :last-child{ margin-top:auto }` so the note sits on the panel's bottom edge, or add the 20th "Add your own" tile.
18. Data oddity seen while auditing: the Disney+ guide says "Source: hulu.com". Check that it's intended.

---

## Motion review (videos + frames)

| Item | Timing/easing | Verdict |
|---|---|---|
| Hero chip rotation | 2s per name, 0.4s `cubic-bezier(.65,0,.35,1)` | Smooth rhythm. The cross-fade shows ghosted double chips, and the width jumps (P2-5). Never stops (by design). Netflix-only under Reduce Motion: correct. |
| Section reveal (steps) | 600ms `(.16,1,.3,1)`, +80ms stagger | Good, matches spec. |
| Ditch card | ring 1s linear, tag pop 1.45s, duck spring 1.6s, number fade 1.95s | Nice once seen. Too long: an empty yellow pre-state (P1-6), and it reads as a spinner on phone (P1-5). |
| Reminders panel | fades at 0, .45, .9s | Breaks the "price never animates" rule; empty panel flash (P0-3). |
| Hero notifs (phone) | fade .4s/.85s | Breaks the rule (P0-3). |
| Pricing | card stagger, badge pop overshoot, duck spring | Breaks the rule (P0-2). |
| Calculator tiles | press scale .96, tick pop .16s | Good. Totals update instantly: correct. |
| Sticky CTA (phone) | appears after hero form leaves | Works. Hidden over calc and pricing as specced. |
| Anything that never finishes | Only the chip loop (intended). No layout shift seen. | OK |

---

## References (Mobbin)

**How it works / steps**
- Airtasker "What is Airtasker?": https://mobbin.com/sites/sections/f826ae26-068d-4c62-a1a2-b7ee79a8ecbf. Borrow: picture tiles first (equal height, coloured), title and 1-line text **below on the page background**, no card wrapper. That fixes the 29px misalignment and removes a box layer.
- Norma "How it works": https://mobbin.com/sites/sections/96f4183b-7eb5-437c-90ad-95d1306d320c. Borrow: number in a hairline circle (not a solid ink dot), one-line descriptions so the cards are the same height, picture zone split off by a 1px rule, a quiet "Or start from Siri · Widget" chip row under it. That's where "Free trials too" could go.

**Guide / help article**
- Voicenotes install steps: https://mobbin.com/screens/5e8c7341-3c55-4ca2-8f71-90136c2666f7. Borrow: drawn UI crops per step, with the **bold UI label** in the caption.
- Square "How to mark alcoholic items": https://mobbin.com/screens/6027dc85-8d7c-48ff-b3f0-c60073b69bf0. Borrow: three tiny wireframe crops in a row with numbered captions. A light way to show "where the button is" without screenshots.
- NYT cancel page: https://mobbin.com/screens/b7ea3850-08f8-4a57-9660-95ba6708a19d. Borrow: one plain bold option per method with a single solid button. That confirms our "How do you pay?" split is right, but the methods should look like equal option blocks, not 3 small tiles.

**Price page**
- Mailchimp postcard pricing matrix: https://mobbin.com/sites/sections/1e414f2f-d61b-47c1-83e5-26860fcb4508. Borrow: a matrix with one tinted column, big column heads, generous row height.
- Wise comparison table: https://mobbin.com/sites/sections/2c88f039-e6d1-42ea-bbd1-12ab87f99bcf. Borrow: the **highlighted row** for the visitor's country, a small green "Cheapest" tag (honest, factual), logo at row start.

**Waitlist / final CTA**
- ISO Meet waitlist: https://mobbin.com/sites/sections/c494bf4c-177f-4b26-830f-1168406fd48f. Borrow: app icon above a centred H2, a pill email field, still floating tiles at the outer margins. Use our real service logos, not photos.
- Base waitlist: https://mobbin.com/sites/sections/75fb9e38-9f05-494f-92ab-86ff2a2e5efd. Borrow: a split layout for a desktop /waitlist page, with the illustration (our duck) left and the form right.

**Privacy / trust**
- Monarch "Why pay for a personal finance app?": https://mobbin.com/sites/sections/a2d2b97b-3758-44e5-808d-48e54c134358. Borrow: heading plus lead in 4 columns left, 2×2 short claims right. It fills the empty half and answers "why pay" right next to privacy.
- Shop privacy: https://mobbin.com/sites/sections/a7b1096b-331c-4a63-9a4d-f33edd5d13d6. Borrow: two big claims split by a vertical rule, no card boxes.

**Footer**
- Calendly: https://mobbin.com/sites/sections/b78f17db-eeb0-4276-bbfa-31d7c0812601. Borrow: tagline/signup in the left block, link columns right, all in one rounded ink panel.
- Origin: https://mobbin.com/sites/sections/ecdde543-4ff0-4f33-94a4-b031616fb5d2. Borrow: a newsletter field as the first footer column (the "Price Hike Report").

---

## Suggested home order after fixes
Hero (yellow) → Calculator (white panel + yellow receipt) → How it works (cream tiles) → Reminders (ink panel) → Cancel moment (yellow ditch card) → Pricing (Free white / Pro yellow / Lifetime ink) → Privacy (Monarch 2×2, white) → FAQ (sticky left) → Final CTA (yellow) → Footer (ink + newsletter).
Yellow then alternates with white, cream and ink, and no two yellow blocks touch.
