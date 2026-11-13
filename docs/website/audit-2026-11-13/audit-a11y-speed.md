# ditchsubs.app audit: accessibility, function, speed (Nov 13, 2026)

Scope: WCAG 2.2 AA, bugs, speed. Read-only on the project. Tested against the production build in `web/.next` (BUILD_ID `6tE7lKy3IiMYM5TrK0eEt`, built 00:13). The container had restarted, so **nothing was listening on :3100**. I started that existing build with `next start -p 3100` (no rebuild, no project files changed). It is still running.

Caveats:
- `next start` is Node, not Cloudflare. TTFB, compression (gzip here, brotli in prod) and `public/_headers` caching are not exercised locally. Header findings come from reading the code.
- Lighthouse numbers are simulated (Lantern, one run each), so ±5 points is noise.

Tools: Lighthouse 12 (mobile and desktop), axe-core 4.14 (injected; 390 and 1440 px; Reduce Motion on and off; tags wcag2a/aa, 21a/aa, 22aa and best-practice), and custom Playwright probes. The probes cover contrast for every text node, tap targets, Tab walks with focus-ring contrast, dialogs, focus hidden under sticky bars, overflow at 5 widths × 83 pages, console errors, broken images, CLS, the accessibility tree, and no-JS and Reduce Motion visibility.
Raw data: `/tmp/claude-0/-home-user/b6b27c63-8e53-560d-a517-60b6e884bad4/scratchpad/a11y-speed/` (`lh/*.json`, `axe.json`, `sweep.json`, `kbd.out`, `vis2.out`, `probe-contrast-taps.out`, `ext-results.txt`).

---

## 1. Scores

| Page | Form | Perf | A11y | BP | SEO | FCP | LCP | CLS | TBT | Total | JS (gz) | Img |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| / | mobile | 98 | 100 | 100 | 92 | 1.06s | **2.42s** | 0 | 51ms | 327K | 143K | 112K |
| / | desktop | 100 | 100 | 100 | 92 | 0.33 | 0.67 | 0.001 | 0 | 351K | 145K | 112K |
| /cancel | mobile | 100 | **96** | 100 | 92 | 0.76 | 1.89 | 0 | 47 | 347K | 144K | 141K |
| /cancel | desktop | 100 | **96** | 100 | 92 | 0.20 | 0.60 | 0 | 0 | 384K | 147K | 157K |
| /cancel/netflix | mobile | 100 | 100 | 100 | 92 | 0.91 | 1.90 | 0 | 35 | 224K | 144K | 8K |
| /cancel/netflix | desktop | 100 | 100 | 100 | 92 | 0.25 | 0.55 | 0 | 0 | 296K | 147K | 59K |
| /prices | mobile | 99 | **96** | 100 | 92 | 0.76 | 2.03 | 0 | 56 | 385K | 144K | 178K |
| /prices | desktop | 100 | **96** | 100 | 92 | 0.21 | 0.65 | 0 | 0 | 437K | 147K | 208K |
| /prices/netflix | mobile | 99 | 100 | 100 | 92 | 1.06 | 2.03 | 0 | 29 | 224K | 144K | 5K |
| /prices/netflix | desktop | 100 | 100 | 100 | 92 | 0.29 | 0.53 | 0 | 0 | 279K | 147K | 39K |
| /about | mobile | 99 | 100 | 100 | 92 | 0.76 | 1.55 | 0 | 76 | 196K | 140K | 0 |
| /about | desktop | 100 | 100 | 100 | 92 | 0.21 | 0.48 | 0 | 0 | 288K | 147K | 39K |
| /support | mobile | 97 | 100 | 100 | 92 | 0.91 | 1.96 | 0 | 176 | 202K | 140K | 0 |
| /support | desktop | 100 | 100 | 100 | 92 | 0.25 | 0.51 | 0 | 0 | 265K | 145K | 39K |

Failing Lighthouse audits:
- **A11y 96** on /cancel and /prices: `color-contrast` on the `.mono` letter tiles (finding P1-7).
- **SEO 92 everywhere**: `robots-txt` "Unknown directive" on line 2, `Content-Signal: search=yes, ai-input=yes, ai-train=yes`. Google ignores unknown lines, so this is cosmetic (P2-10).
- **Perf** (none failing hard):
  - `render-blocking-resources`: the one CSS file, 12.7 KB gz, est. 140–300 ms on mobile.
  - `unused-javascript`: 29–52 KB.
  - `legacy-javascript`: 13 KB of polyfills (`Array.prototype.at/flat/flatMap`, `Object.fromEntries/hasOwn`, `trimStart/End`) in chunk `2-3bcc782c_pu.js`.
  - `uses-responsive-images` / `image-delivery`: logos are 120 px PNGs shown at 40 px. That size is right for 3× iPhones, but PNG→WebP would save about 57%.
  - Mobile LCP render delay is 76–81% of LCP. The LCP element is text (the H1 on home), so the delay is CSS plus fonts plus JS boot, not images.
- **Best practices 100. Console errors: none** on all 81 sitemap pages at 390 and 1440. The only console "error" is the expected resource 404 on 404 pages.

---

## 2. Findings

No P0. Nothing blocks a user from reading a guide, using the calculator or joining the waitlist. All are reproduced unless marked *uncertain*.

### P1

**P1-1. Search dialog: Tab escapes the dialog (focus trap broken). WCAG 2.4.3 and 2.1.2 spirit, aria-modal contract.**
- Evidence: /cancel/netflix at 1440. Press `/`, type "spot", then press Tab ×5. Focus goes from "Close search" to "Home" in the breadcrumb, then "Cancel guides", "help.netflix.com" and "Aribo", all **outside** the dialog, which is still open with the body scroll locked. Shift+Tab from the input also lands outside.
- Cause: `web/src/components/HeaderBar.tsx` `useDialog`. The focusables list includes the result links, which are `tabIndex={-1}`, so `last` is a link that can never be reached by Tab. When focus sits on the Close button (the real last stop), nothing wraps it.
- Fix:
  ```ts
  const f = Array.from(ref.current.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]'))
    .filter((x) => x.tabIndex >= 0 && !x.hasAttribute('disabled'));
  // also: if (!ref.current.contains(document.activeElement)) { e.preventDefault(); f[0].focus(); return; }
  ```
  Optional: set `inert` on `main` and `footer` while a dialog is open (main measured `inert=false`), or switch to `<dialog>.showModal()`, which does both for free.

**P1-2. Menu sheet: closing it (Esc or ×) drops focus to `<body>` instead of the Menu button. WCAG 2.4.3.**
- Evidence: home at 390. Focus "Menu", press Enter (focus goes to "Close menu", fine), then Esc. `document.activeElement` is body and the `aria-label` is null. The search dialog returns focus correctly.
- Cause: the Close button has `autoFocus`. React focuses it during commit, *before* `useDialog`'s effect records `opener`, so `opener` is the Close button, which then unmounts.
- Fix (`HeaderBar.tsx` `MenuSheet`): remove `autoFocus`, add `const closeRef = useRef<HTMLButtonElement>(null);`, and after `useDialog(box, onClose)` add `useEffect(() => closeRef.current?.focus(), []);`. That copies what `SearchDialog` already does. More robust: keep refs to the two header buttons in `HeaderBar` and focus the right one in `setMenu(false)` / `setSearch(false)`.

**P1-3. Lifetime card button: focus ring is invisible (ink ring on ink card, 1:1). WCAG 2.4.7 / 1.4.11.**
- Evidence: home, `.pc-life .btn` ("Join the waitlist" on the Lifetime strip). Measured ring `3px solid #16140F` against `.pc-life` background `#16140F`, contrast 1.0.
- Fix: in `web/src/app/globals.css` add `.pc-life :focus-visible { outline-color: var(--sun); }`. Or add the existing `on-ink` class to the `.pc-life` div in `web/src/app/page.tsx`, since `.on-ink :focus-visible` already uses sun.

**P1-4. Hero logo rotation loops forever with no pause. WCAG 2.2.2 Pause, Stop, Hide (Level A).**
- Evidence: home H1 `.slot .chip`: `animation: chip 10s … infinite`. It moves, starts on its own, lasts more than 5 s, and sits next to other content. Reduce Motion users are covered (Netflix only, static); everyone else has no way to stop it.
- Fix (pick one), in `globals.css`:
  - (a) Play it once and stop. Change `infinite` to `1` and add a final state that holds the first chip (`.chip:first-child { animation-fill-mode: forwards }` with an end keyframe at `opacity:1`). For strict 2.2.2 it must also finish within 5 s, so use about 1 s per logo.
  - (b) Keep the loop and add a small Pause/Play toggle (44 px, `aria-pressed`) that sets `animation-play-state: paused` on `.slot`.
- (a) is cheaper and keeps the hero calm, which fits the "control, reliability" user.

**P1-5. /waitlist?status=confirmed: the page shows "Join the waitlist" first, then swaps to "You're on the list." CLS 0.26 on iPhone. WCAG 3.2 (unexpected change) plus a trust problem at the confirm moment.**
- Evidence: the server HTML for `/waitlist?status=confirmed` contains `<h1>Join the waitlist</h1>`, the Suspense fallback. On hydration it becomes the confirmed state. Measured CLS **0.2604 at 390** and **0.1271 at 1440**; the source is the footer jumping. With JS off, a confirmed user only ever sees "Join the waitlist".
- Cause: `web/src/app/waitlist/page.tsx` uses `<Suspense fallback={<h1>Join the waitlist</h1>}>`, and `WaitlistStatus` reads `useSearchParams()` in the browser.
- Fix: read `searchParams` on the server inside the Suspense boundary, so the right state streams in the first HTML response. It works without JS and has no swap:
  ```tsx
  export default function Waitlist({ searchParams }: PageProps<'/waitlist'>) {
    return (<div className="wrap doc" …><Suspense fallback={<div style={{ minHeight: 420 }} />}><Status sp={searchParams} /></Suspense></div>);
  }
  async function Status({ sp }: { sp: PageProps<'/waitlist'>['searchParams'] }) { const status = (await sp).status; … }
  ```
  Keep `EmailBox` as the client island. Quick stopgap: make the fallback a neutral box of the same height with no text.

**P1-6. Search field placeholders are 3.5:1 (needs 4.5:1). WCAG 1.4.3.**
- Evidence: the header search dialog ("Netflix, Spotify, ChatGPT…") and the index search on /cancel and /prices ("Search 31 guides" / "Search 42 services"). The computed placeholder color is Tailwind preflight's `oklab(… / 0.5)` (ink at 50%), which comes out as `#8A8987` on white, **about 3.5:1**. The email placeholder is fine at 5.78:1 because `.email input::placeholder` sets `var(--mute)`. axe does not test placeholders, which is why it passed.
- Fix: in `globals.css` add `.search-in input::placeholder { color: var(--mute); }` (gives 5.78:1).

**P1-7. Letter tiles for services without a logo fail contrast (axe "serious"; this is the Lighthouse a11y 96).**
- Evidence: /cancel and /prices `a.svc > span.mono`:
  - Apple Fitness+ is white on `#A6FF00`, **1.24:1**.
  - iCloud+ is white on `#3693F3`, **3.17:1**.
  - Apple Arcade is white on `#FF2D55`, **3.65:1**.
- Cause: `web/src/components/ServiceIndex.tsx` hand-rolls the tile, always uses white text, and has no `aria-hidden`. `web/src/components/Logo.tsx` already does this better (aria-hidden plus a luminance check).
- Fix:
  - In `ServiceIndex.tsx`, add `aria-hidden` to the `.mono` span. The name sits right next to it, so it is decorative, same as Logo.tsx.
  - Pick the text color by contrast: pass `fg` in `IndexItem` from the server pages, or compute it inline with the same 10-line formula.
  - In `Logo.tsx`, change the threshold from `lum > 0.35` to `lum > 0.179`. 0.179 is the point where ink and white give equal contrast. At 0.35, #FF2D55 and #3693F3 still get white text (3.6 and 3.2:1), where ink would give about 5:1.
  - Also add `aria-hidden` to the Calculator's `.mono` fallback (white on #6B6559 is 5.78:1, which passes, but it is decorative).

**P1-8. /prices/[slug] on phones and tablets (≤860 px): focus can hide completely under the sticky country strip. WCAG 2.4.11 Focus Not Obscured (AA, new in 2.2).**
- Evidence: /prices/netflix at 390, Shift+Tab backwards. The "help.netflix.com" source link in each country header row lands at top 88–104 px, **100% under `.cstrip`** (sticky at 56–120 px). The cause is that `html { scroll-padding-top: 88px }` is less than header (56) plus strip (64).
- Fix (`globals.css`): `@media (max-width: 860px) { html:has(.cstrip) { scroll-padding-top: 136px; } }`. This also makes the country-strip jump links land below the strip.

### P2

1. **Unknown slugs return 200 on first hit, 404 after.**
   - Evidence: `curl /cancel/zzz-28922` gives **200** (the noindex not-found page). A second request to the same URL gives 404. `/prices/<unknown>` behaves the same; `/foo` gives 404.
   - Impact: SEO-harmless because of `noindex`, but a soft 404 and inconsistent.
   - Fix: `export const dynamicParams = false;` in `web/src/app/cancel/[slug]/page.tsx` and `web/src/app/prices/[slug]/page.tsx`. *Uncertain* whether this is allowed alongside `cacheComponents: true` in Next 16.4, so check that the build accepts it. Behavior on OpenNext/Cloudflare is untested.

2. **Sticky table column headers hidden under the country strip at 640–860 px.**
   - Evidence: /prices/netflix at 768. `thead th` sticks at 56–104 and `.cstrip` at 56–120 (z-index 5 > 1). The topmost element at the header's position is a strip link, so the Plan/Price/A year headers vanish while scrolling.
   - Fix: `@media (max-width: 860px) { body:has(.cstrip) .tbl thead th { top: 120px; } }`.

3. **Guide H2 names include the "#" anchor.**
   - Evidence: accessibility tree on /cancel/netflix: heading "Have this ready Link to this section" (×5 per guide). VoiceOver's heading rotor reads that every time.
   - Fix in the `H2` helper in `cancel/[slug]/page.tsx`: `<h2 id={id} aria-labelledby={`${id}-t`}><span id={`${id}-t`}>{children}</span><a className="anchor" …/></h2>`.

4. **Arrow glyphs are read aloud.**
   - "Open Netflix's cancel page ↗" reads as "north east arrow". "Browse all cancel guides →" and "All guides →" read as "right arrow". The `.how a::after` "↓"/"›" are CSS content, which Chrome includes in the accessible name.
   - Also, the ↗ links open in the same tab (no `target`). That is fine, but the glyph promises otherwise.
   - Fix: `<span aria-hidden="true"> ↗</span>`, and in CSS use `content: "↓" / "";` (alt-text syntax).

5. **Calculator live region with nothing picked reads "0 picked.  a year."**
   - Fix (`Calculator.tsx`): `{chosen.length ? `${chosen.length} picked. ${…} a year.` : 'Nothing picked.'}`.

6. **Search combobox `aria-controls="search-results"` points to nothing when there are 0 results.**
   - The `ul` is not rendered, and `aria-expanded` is hard-coded to `"true"`.
   - Fix: always render the `ul` (empty), or drop `aria-controls` and set `aria-expanded={results.length > 0}`.

7. **Pricing card headings are uneven.** "Free" and "Pro" are `h3`, but "Lifetime. Pay once." is a `<b>`, so heading-rotor users skip the Lifetime option. Make it `<h3 className="…">` in `page.tsx`.

8. **404 page `<title>` is the generic home title** ("Ditch: Subscription Tracker for iPhone"). WCAG 2.4.2. Add `export const metadata = { title: 'Page not found' }` to `web/src/app/not-found.tsx`.

9. **Hidden hero chip logos are preloaded at High priority, competing with CSS and fonts on mobile.**
   - Evidence: the head contains `<link rel="preload" as="image">` for netflix, spotify, chatgpt-plus, disney-plus and amazon-prime (React auto-preloads non-lazy `<img>`). Lighthouse shows 4 of them at High priority. Only 1 is visible at first paint.
   - Fix (`page.tsx` hero): `loading={i ? 'lazy' : undefined}` or `fetchPriority={i ? 'low' : undefined}` on the chip `<img>`.
   - Also preloaded on every page: the Display font, which guide pages never use (`document.fonts` shows `display: unloaded` on /cancel/netflix). Meanwhile WideBold, used by every guide H2, is `preload: false`. This is minor (about 9 KB each), and next/font preload is per layout. *Uncertain* the fix is worth the effort.

10. **robots.txt `Content-Signal` line** costs the SEO 92 on every page. Google ignores unknown directives, so it is a cosmetic score only. Keep it for the AI-use signal, or remove it if the 100 matters.

11. **Logos as PNG.** 213 logos total 972 KB as PNG versus **417 KB as WebP q90 (−57%)** (measured with PIL). /prices loads about 178–208 KB of images, so WebP would save roughly 100 KB there. Update `/logos/*.png` refs in `ServiceIndex.tsx`, `Logo.tsx`, `Calculator.tsx`, `HeaderBar.tsx` and `page.tsx`, and keep the 120 px size for 3× iPhones.

12. **Render-blocking CSS (12.7 KB gz) on every page.**
    - Options:
      - Next's `experimental.inlineCss: true` removes the extra round-trip (Lighthouse estimates 140–300 ms on mobile). The trade-off is CSS not cached across pages, which suits single-page SEO visits. *Uncertain*: test it with Turbopack and OpenNext.
      - About 3.5 KB raw of the CSS is Tailwind preflight/theme, and no Tailwind utilities are used. Removing `@import "tailwindcss"` would need a small reset and re-checking lists. Low value.

13. **JS is about 140–147 KB gz on every page** (react-dom 72 KB, Next router 47 KB, app 25 KB). This is the App Router baseline: unused JS is 29–52 KB, and legacy polyfills are 13 KB. *Uncertain*: a `browserslist` of `"safari >= 16.4, chrome >= 111"` in `package.json` may drop the polyfills in Next 16; verify with the build. No action needed for the scores, which are 97–100.

14. **Field borders are faint (WCAG 1.4.11, debatable).**
    - The email and search pills are white on cream (1.08:1) or white on sunflower (1.5:1), with a 10%-ink border.
    - The fields are identifiable by placeholder and the adjacent button, so many auditors pass this. It is *uncertain* as a failure.
    - If you want a sure pass: `border-color: rgba(22,20,15,.45)` gives about 3:1.

15. **Price-table source links all share one name.** /prices/netflix has 17 links named "help.netflix.com" (they go to /ae, /au, /ca …). They pass 2.4.4 in context (inside the country row header), but a link list shows 17 identical names. Fix: `aria-label={`${host} (${c.name})`}` in `PriceTable.tsx`.

16. **Text spacing (1.4.12) at 320 px.** Forcing letter-spacing .12em makes home scroll 23 px sideways (hero chip and DitchDemo row). Both are decorative and aria-hidden or role=img, so no text is lost. Low priority.

17. *Out of my lane, but noticed:* the FAQ says "Prices fill in for 12 countries", while the calculator and llms.txt list **17**. It may be app versus site; worth a look. The pricing card shows "SAVE 49%" on yearly ($29.99/yr against $4.99×12). It is a real computed difference, not a fake discount, so probably fine; flagging it for whoever reviews copy and honesty.

---

## 3. What passed (checked, no issue)

- **Hero H1** accessible name is exactly **"Ditch it before it renews."** (CDP accessibility tree). The chip reel is `aria-hidden`, and "it" is sr-only.
- **Landmarks**: header, nav "Main", main (`#main`, tabindex −1), breadcrumb nav, "How you pay" nav, aside with "On this page", footer with 4 labelled navs. Home sections are named regions.
- **Headings**: one H1 on every page (all 81 plus waitlist states and 404), no skipped levels.
- **Skip link**: first Tab stop, visible at top 12 px, 50 px tall. Enter moves focus to `main`, and the next Tab reaches the breadcrumb.
- **Focus visible**: every Tab stop on home and a guide (75 and 68 stops) has a 3 px ring. Contrast is 12–18:1, except P1-3. No focus lands on hidden or aria-hidden elements; the sticky CTA uses `tabIndex=-1` while hidden.
- **Search dialog**:
  - `/` opens it, but not while typing in a field (email "a/b" typed fine) or on the checkbox.
  - Focus moves to the input. ArrowDown moves `aria-activedescendant`; the live region says "2 results".
  - Enter navigates to /prices/spotify. Esc closes and returns focus to the search button.
  - The empty state is honest: "No guide for 'zzzz' yet. Ask for it".
- **Menu sheet** trap cycles correctly; `aria-expanded` is right. Only the focus return is broken (P1-2).
- **FAQ `<details>`**: Enter and Space toggle.
- **Calculator**:
  - Tiles are `<button aria-pressed>`; Space and Enter toggle; the group is named "Tap what you pay for".
  - The country select is labelled "Country". All 17 countries work.
  - Currencies are never added: Qatar shows "US$144 + QAR 1,704" as two totals. The live region announces each change.
- **Email form**:
  - Empty submit gives "Type your email first." (`role=alert`, `aria-invalid`, `aria-describedby` wired).
  - "me@gmail" gives "That email doesn't look right. Check for a typo."
  - A valid address gets API 503 `unavailable`, and the UI shows **"Sign-ups open very soon. Nothing was saved yet. Try again in a day or two."** (`role=status`, focused). This is honest.
- **Waitlist states** (default, `confirmed`, `invalid`, bogus) all render the right H1 and are `noindex`. The only problem is the flash in P1-5.
- **Reduce Motion**: nothing animates and nothing is left at opacity 0. The only hidden element is `.dd-hold`, by design, because the demo shows its finished state.
- **JS disabled**: all content visible on 9 key pages (reveals are gated on `.js`). Direct load of `/#pricing` and End-key jumps both reveal correctly.
- **Overflow**: **0 cases** at 320/390/768/1024/1440 across all 81 sitemap pages plus waitlist and 404.
- **Tap targets at 390**: every control is ≥44 px. The only exceptions are inline text links (exempt under 2.5.8) and the heading "#" anchors, which are `display:none` on touch devices.
- **Contrast** of every text style on sunflower, cream, ink and white: all pass (lowest real text is `--mute` on chip, 4.74:1). Badges:
  - `.pc-save` ink on #FF6C2C: **6.51:1**
  - `.pc-badge` sun on ink: 12.21:1
  - `.dd-tag` sun on ink: 12.21:1
  - footer legal #A69E8C on ink: 6.92:1
  - `.sunfg2` on sun: 6.63:1
- **CLS**: 0 to 0.001 on all pages under throttled load (fonts are size-adjusted fallbacks with swap). The exception is P1-5.
- **Links and images**:
  - All 93 unique internal links return 200, all in-page `#` targets exist, and there are no duplicate IDs.
  - Broken images: 0.
  - /robots.txt, /llms.txt (6.6 KB, accurate summary) and /sitemap.xml (81 URLs) are all 200.
- **404 page**: status 404, `noindex`, helpful links.

## 4. External links (sample of 32: every guide's main button plus a few App Store and help links)

- **OK (200 after redirects; many end at a login page, which is expected):** 19.
- **HEAD refused, GET 200 (fine; servers that block HEAD), 10 links:**
  - Netflix cancelplan and help ×3 (HEAD 403)
  - Microsoft account ×2 (HEAD 404)
  - Hulu (HEAD 404, then login)
  - Prime Video (405)
  - Apple subscriptions (405)
  - Costco (429)
- **Blocked or uncertain (bot protection; check by hand), 3 links:**
  - `claude.ai/settings/billing`: Cloudflare "Just a moment…" 403.
  - `accounts.nintendo.com/portal`: ends in a 302 to login.
  - `help.uber.com/…/how-can-i-cancel-my-uber-one-membership`: **404 on GET**. But `help.uber.com/en/riders` also returns 404 from this sandbox, so this is likely bot or geo blocking, not a dead link. **Open it on the iPhone to confirm** (Uber One guide `helpUrl` and `source` in `web/src/data/cancel.json`, line ~668).

## 5. Speed notes

- **Critical path:**
  - HTML (8–19 KB gz)
  - 1 CSS (12.7 KB gz, render-blocking)
  - 3 preloaded WOFF2 fonts (Display, WideHeavy, Wordmark, about 8.5 KB each)
  - 5 hero chip images plus app-icon.webp, auto-preloaded on home
  - 8 JS chunks (async)
- **Fonts**: local WOFF2 via next/font, `display: swap`, metric-matched Arial fallbacks, so no visible layout jump. Title and WideBold are not preloaded. WideBold is used by guide H2s, so those swap late on slow connections; this is fine.
- **Caching** (`web/public/_headers`):
  - `/_next/static/*` (JS, CSS, fonts): immutable for 1 year. Good.
  - `/logos/*`, `/og/*` and `/*.webp`: 7 days plus stale-while-revalidate.
  - Not covered: `/duck.png`, `/app-icon.png`, `/icon-192.png`, `/icon-512.png`. They are rarely fetched, so this is fine.
  - *Uncertain*: whether Cloudflare's `_headers` matches the `/*.webp` suffix splat. Verify after deploy with `curl -I https://ditchsubs.app/duck.webp`.
- **What to cut** (biggest first):
  1. Logos to WebP (about −57% of image bytes on /cancel and /prices).
  2. Stop preloading 4 hidden hero logos.
  3. Optional: inline CSS.
  - Everything else is the framework baseline. Perf scores are already 97–100.
