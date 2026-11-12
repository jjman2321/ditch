# ditchsubs.app page templates, motion and accessibility (Mobbin + live audit, Nov 12)

~30 Mobbin searches (web + iOS) and a live Playwright audit of Wise help, Apple Support, Stripe pricing and docs, Linear pricing, Vercel templates, Raycast store, Zapier apps, Notion help. Plus an automated check of our v1 cancel and price mockups.

## Top 10 fixes
1. Prose column max 680 px (v1 was 756 at 17 px ≈ 89 characters). Tables and answer box may use the full column.
2. "How you pay" must be real jump links to three always-visible H2 sections (Apple's own cancel page does this). On iPhone: three stacked 52 px rows with chevrons.
3. Price table on iPhone must keep the yearly price: "£13.99 a month" bold, "£167.88 a year" under it.
4. Tables: `<caption>`, `<thead>`, `scope`, one `<tbody>` per country with a header row carrying the checked date and source.
5. Skip link, `<main>`, 3 px ink focus ring with 2 px offset (Wise pattern).
6. Every tap target ≥ 44 px on phones (v1: nav 23, breadcrumbs 17, footer 31, nav button 40, chips 33; ☰ was a span).
7. No emoji-only flags (Windows shows letters): text codes + SVG flags, all 12 countries, sticky strip linking to `#uk` etc.
8. "Have this ready" before the steps.
9. No duck in the guide app box: show a mini lock-screen reminder instead.
10. Motion: 120–180 ms colour changes, `cubic-bezier(.215,.61,.355,1)`, smooth scroll only without Reduce Motion, nothing moves near a price, never `transition: all`.

## Shared article shell
Sticky header 64 (56 phone), gains a 1 px rule after scroll · breadcrumbs (underlined, ≥ 44 tap) · article 680 + 64 gap + 280 sticky aside (TOC with 2 px ink bar on the current section, app card) · H1 56/1.02 (34–36 phone) · H2 28/1.15 with 56 above (22, 40 phone) · body 17/1.6 (17/1.55 phone) · `scroll-margin-top` 88 · on phone the TOC becomes an inline "On this page" list · copy-link icon on H2s · `text-wrap: balance` on headings, `pretty` on paragraphs · print stylesheet.
Meta row: `[● Checked Nov 10, 2026]` (`<time>`) · source ↗ · By Aribo (→ /about). No read time.
**"Did this work?"** [Yes, it worked] [No, something changed] → opens a pre-filled email. "This opens your email app. We don't track clicks."

## Cancel guide
Logo 48 (40 phone) + category pill → H1 → meta → **answer box** ("Short answer" label, 40–60 words, full-width 52 px primary "Open Netflix's cancel page ↗", 13 px line showing the URL + copy button, "No cancel button? →") → **How do you pay for Netflix?** (3 jump links) → Have this ready (2 rows) → one H2 per way you pay with numbered steps (32 px ink badges, sunflower numbers) → callouts with a type label and 3 px ink left bar ("Netflix says", "Heads up") → what happens after → inline app card (mini notification) → price table for the visitor's country + link to the hub → Did this work? → Cancel something else (4 cards ≥ 56 px) → disclaimer.

## Price hub
Answer box (US + UK range, ~50 words) → sticky country strip (12 links, 44 px, visitor's country first from `navigator.language`, nothing stored) → table: Plan | A month | A year | Notes, one `<tbody>` per country with a header row "United Kingdom · incl. VAT · Checked Nov 9 · Netflix UK ↗", 52 px rows, right-aligned tabular numbers, monthly 700 ink / yearly 400 mute, sticky `<thead>` · phone: rows become name left / "£13.99" bold right / "£167.88 a year" under it, no header row → price changes log (date, country, old → new, difference, source; only verified old prices) → cheapest way card → "Want out?" card → method note.

## Index pages (/cancel, /prices)
H1 + "31 services, checked by hand on each service's own page" → 56 px search (max 640, "/" shortcut, clear ×, instant filter of cards already in the HTML, live "4 guides" count) → category chips with counts (44 px) → Popular (6) → A–Z strip (44×44, empty letters greyed with `aria-disabled`, sticky) → letter sections with cards (logo 40, name, "Checked Nov 10", whole card a link, ≥ 64 px) → "Can't find yours? Ask for a guide" → empty search: the duck, "No guide for 'xyz' yet.", popular chips, Ask for it, Clear search.

## Calculator
Country select → logo tiles (`<button aria-pressed>`, 4 cols / 3 phone) with plan select under picked tiles → sunflower receipt (sticky on desktop): line items, **one total per currency**, yearly in Display 64, rough "≈ … · Nov 10 rates" line only per DECISIONS #32, "Prices checked Nov 9 · This runs in your browser. We don't see it." → empty "$0 a year" greyed → no count-up; `aria-live="polite"` → CTA. Phone: sticky bottom bar "$412.76 a year · 5 picked ▴" that opens a sheet.

## Compare
Row | Ditch (sunflower tint) | Rival (name, no logo). Footnote marker on every row → rival's own page, checked date. Only rows where Ditch wins (owner + lawyer). Fits 358 px as 3 columns.

## Waitlist, success, newsletter
Visible "Email" label, 52 px input at 17 px (no iOS zoom), "Join the waitlist", **unticked** "Also send me the monthly Price Hike Report" + "See an example", line "One email when Ditch launches. Unsubscribe anytime. Privacy." Inline, announced errors. Success: the duck, "Check your inbox", "We sent a link to **you@…**", "While you wait: see what your subs cost →".

## 404
The duck, "Nothing here. Not even a subscription.", 56 px search, 6 popular chips, Go home. Real 404 status.

## Legal
Small caps "Effective Nov 12, 2026 · Version 1" → H1 → "The short version" ticked list → App / Website / Waitlist table (what, why, who receives it, how long) → numbered H2s, sticky TOC, 680 column, previous versions. Support: open FAQ + "Can't find it? Email us" card.

## About, How we check
About: "A note from Aribo", 560 column, hand-drawn ink signature, Grasp Labs LLC. How we check: numbered method steps (official page only → record price + date → second check → re-check every 90 days → stale banner, noindex at 180) · bold-term definitions of verified / partial / unverified · "What we don't do" limits · dated corrections log · data download.

## Motion tokens
```css
:root{--ease-out:cubic-bezier(.215,.61,.355,1);--ease:cubic-bezier(.4,0,.2,1);--t-fast:120ms;--t-base:180ms;--t-slow:260ms}
a,button{transition:color var(--t-fast) var(--ease),background-color var(--t-fast) var(--ease),border-color var(--t-fast) var(--ease)}
@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
```
Plus the reveal and stamp specs in `design-system.md`.

## Accessibility gates
Contrast: ink/cream 17.2, mute #6B6559/cream 5.41, fg2 7.01, sun-fg2/sunflower 6.63, ink/sunflower 12.2. **Tangerine never as text** (2.64). Meaning never by colour alone. Focus 3 px ink (sunflower ring on ink). Tap ≥ 44 phone. One H1, no skipped levels. Tables with caption/thead/scope/rowgroup. Real buttons and links; `aria-pressed`, `aria-current`, `aria-expanded`, `aria-live`. Text + SVG flags. rem sizes, 200% zoom and 320 px width without sideways scroll.
