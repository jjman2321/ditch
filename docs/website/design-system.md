# ditchsubs.app design system (from Mobbin + live measurements, Nov 12)

Method: 22 Mobbin web searches (~230 section/screen images, incl. Givingli, Miro, Quartz, Spellbook, Remote) + live Playwright measurements of 22 sites at 1440 and 390 (Givingli, Remote, Miro, Spellbook, Quartz, Linear, Stripe, Raycast, Arc, Copilot, Monarch, Rocket Money, Wise, Monzo, Opal, Cash App, Revolut, Headspace, Duolingo, Things, Superhuman, Finch, Airbnb) + the same measurements of our v1 mockup.

## What separates top sites from v1
1. **One alignment logic.** Spellbook holds 11 blocks on one left edge, Stripe 42, Arc 36. v1 switched centred/left 6 times.
2. **Few radii.** Givingli 3, Remote 2. v1 had 10.
3. **3–5 elements per section.** v1's hero had 4 text bands under the headline; 7 eyebrows on one page.
4. **Show the product.** Best "how it works" sections end each card with a real screen crop (Norma).
5. **Motion is rare, short, on reveal only.** Fade + 16–24 px rise, 0.6–0.9 s, once, off under reduce motion. Nobody good animates money.

## Tokens
**Layout:** container max 1280; side margins 40 (≥1024), 32 (≥640), 20 phone. 12 columns, gutters 24 / 16. Splits 6/6 or 5/7. Hero lead ≤ 34rem; section intro ≤ 720; body ≈ 680 (60–70 ch); headings ≤ 18–20 ch.

**Spacing (×4):** 4 8 12 16 24 32 48 64 96 128 192. Sections: standard 128 / 80 phone; tight 96 / 64; moments 192 / 120; strips 48 / 40. Inside: eyebrow→H 12; H→intro 20 (16); intro→content 56 (40); content→button 48 (32). Cards: padding 32 / 24, gap 24 / 16. No ad-hoc padding overrides.

**Type:**
| Style | Desktop size / lh / tracking | Phone |
|---|---|---|
| H1 (Display) | 96 / 0.92 / −0.03em, `clamp(2.875rem, 1.2rem + 5.6vw, 6rem)` | 46 / 0.95 |
| Big money (Display, tabular) | 80 / 0.95 / −0.03em | 56 |
| One-liner (WideHeavy) | 64 / 1.02 / −0.025em | 36 |
| H2 (WideHeavy) | 56 / 1.0 / −0.025em, `clamp(2.125rem, 1rem + 3.1vw, 3.5rem)` | 34 / 1.04 |
| H3 (WideBold) | 26 / 1.12 / −0.01em | 21 / 1.15 |
| Lead | 22 / 1.45 | 19 |
| Body | 18 / 1.55 (articles 19 / 1.6) | 17 |
| Small | 15 / 1.5 | 14 |
| Eyebrow | 13 / 1.2 / +0.08em caps 700, max 2 on the home page | same |
Tracking always in em. Archivo is wide: never tighter than −0.03em.

**Radius:** 8 (chips, inputs), 16 (cards, tiles, images), 28 (big panels), 999 (pills). App-icon logos 22.5% of size. Phone keeps its device shape.

**Borders and shadows:** white cards on cream get `1px solid rgba(22,20,15,.08)`, no shadow. Rules `#E6DFD0`. Shadows only on physical objects: phone `0 32px 64px -24px rgba(22,20,15,.35)`, floating logo `0 8px 20px -6px rgba(22,20,15,.25)`. Focus ring 3px ink, 2px offset.

**Buttons:** primary 56 / 52 phone, pill, 28 px sides, ink with cream text, Inter 16 700; hover `#2E2A22` + 1 px lift 200 ms; press 0.98 80 ms. Secondary: transparent, 1.5px inset ink. Nav button 40 desktop / **44 phone**. Email capture: 64 px white pill, 1px ink-10% border, 52 px inset button; phone stacks both at 52 in a 24-radius box. One primary button per screen-height.

**Colour share:** cream 55–65%, white 10–15%, sunflower 12–18% in at most 3 blocks (hero, calculator result, final CTA; never adjacent), ink 8–12%, tangerine < 1% (bill, tiny dots; never text). Text greys: `#5A544A` on cream (7.0:1), `#6B6559` meta only (5.4:1), `#4B4220` on sunflower (6.6:1), ink on sunflower 12.2:1.

**Logo sizes:** hero floats 64 / 44 (max 3, still); calculator 40 / 36; category stack 32; article title 56; related 36; table rows 24. Never > 72. Duck: hero 200–240 / 140; elsewhere ≤ 160.

## Layout rules
1. Content sections left-aligned on the container edge; only 3 centred moments (one-liner, DITCHED stamp, final CTA).
2. Splits: text block vertically centred on the picture; equal-height card rows (grid stretch).
3. "View all" on the heading's baseline, right.
4. Optical centring: phone ~2% above centre; hang punctuation on centred display lines.
5. ≤ 5 elements per section. Say each claim once (v1 said "No bank login" 4 times).
6. One frame-breaking object per section at most. Sunflower as a frame, not wallpaper.

## Phone rules
Hero order: headline → lead → email box → one small line → phone (cut off). First CTA above y = 600 on 844. Sticky 52 px "Join the waitlist" pill after the hero CTA scrolls away; hidden while calculator, pricing or final CTA is on screen. Tap targets ≥ 44 everywhere. No section > 1.5 screens without something to tap. After launch: App Store badge on iPhone, 120 px QR on desktop.

## Motion
Only opacity/transform; plain CSS + ~15 lines of JS. Content visible by default; reveal only with JS on and no reduce-motion.
| What | Trigger | Spec | Reduce motion |
|---|---|---|---|
| Section reveal | in view once (20%) | fade + 16 px rise, 600 ms `cubic-bezier(.16,1,.3,1)`, siblings +80 ms (max 3) | instant |
| DITCHED stamp | in view | scale 1.35 → 0.96 → 1 at −6°, 420 ms `cubic-bezier(.2,.9,.3,1)`; the "$X a year you won't pay" line is already there and never moves, ≥ 40 px below | static |
| Button | hover/press | colour 150 ms; 1 px lift 200 ms; press 0.98 80 ms | colour only |
| Guide card | hover | border 8% → 24% ink, 150 ms | same |
| FAQ | click | height 300 ms; + rotates 45° | instant |
| Calculator tile | tap | border + tick 120 ms; total updates instantly | instant |
| Mobile menu | tap | sheet 250 ms, backdrop 200 ms | fade |
| Link underline | hover | 1 → 2 px, 150 ms | same |
**Never animate:** prices, totals, calculator numbers, pricing table, the hero notification, the H1 (LCP), hero logos and duck, the logo strip (no ticker), the footer wordmark, whole-page fades, scroll-jacking, parallax, cursor effects, auto carousels, idle duck loops, confetti.

## v1 home critique (scores) and fixes
- Hero 6.5: cut to lead → email → one line "Free forever for tracking · No bank login · No account"; 3 still logos ≥ 24 px from the phone; duck ≤ 200 beside the phone base facing the notification; phone 320–340 wide, notification text 15; top padding 64; highlight with `box-decoration-break: clone`.
- Logo strip 5: delete; move "Pick from 200+ services" into the calculator intro.
- Calculator 7: one white panel (picker 7 cols, sunflower result 5 cols); icon tiles 64 px, 6 across / 4 phone; pinned total row on phone; chips 44 px; default plans.
- How it works 5.5: number circles like the article steps; each card ends in a real screen crop (picker, notification, stamp).
- One-liner 7: its own 192 px moment, 64 px type.
- Reminders + stamp 5: split into (a) reminders with the notification at 1.5× and "Next reminder: Netflix · Tue 9:00"; (b) a centred DITCHED moment on cream, stamp ~360 wide, "$239.88 a year you won't pay." at 80 px, nothing else.
- Privacy 5: no duck; standard H2; 2×2 plain cards.
- Pricing 6: Free | Pro side by side with 40 px prices, identical row order with DECISIONS #31 wording, Pro outlined in ink; lifetime visible.
- Guides 6.5: counts on cards + a row of 8 direct guide links + "All guides →".
- FAQ 7.5: 64 px rows, + centred on the first line; /support shows all answers open.
- Final CTA 7: radius 28, centred stack; duck only on the success state.
- Footer 6: giant wordmark fitted edge to edge; radius 28; 44 px links on phone.

## Best Mobbin references
Givingli hero `e52fec04`, Givingli "100%" `134a231b`, Givingli hand-drawn quote `02577240`, Miro yellow canvas `071f7650`, Miro hero `338d34fd`, Origin track spending `ea1010a1`, Origin delete apps `272f9bf6`, Norma how it works `96f4183b`, Apple iCloud+ tile `601e00d5`, ClickUp calculator `24ffa4f6`, Slash pricing `23755ec5`, 1Password FAQ `3816b61f`, Mailchimp app CTA `4a2af4fd`, Legora logo grid `05bd8689`, BAGGU footer `ddfad441`, Quartz article header (screen `d7627781`), Town `bbcbaabb`, Monarch why pay `a2d2b97b`. (All at mobbin.com/sites/sections/<id>.)
