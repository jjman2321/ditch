# ditchsubs.app: cancel guides and price pages, content audit (Nov 13, 2026)

Read-only audit. Nothing in the project was changed. Site checked at http://localhost:3100 (31 guides, 42 price hubs, 81 sitemap URLs).
Live checks used WebFetch/WebSearch on Nov 13, 2026. Ahrefs/Similarweb connectors are not authorised in this session, so search demand below is reasoned, not measured.

## Scores

| Template | Score | One-line verdict |
|---|---|---|
| Cancel guide `/cancel/[slug]` | **6.5/10** | Accurate and well sourced, but it answers "where do I click" only. No "what happens after", pause, refunds, "did it work", Google Play, or FAQ, all of which every top-ranking page has. A few hard-coded lines are wrong on non-streaming guides. |
| Price hub `/prices/[slug]` | **6/10** | Numbers are right (14 of 14 checkable rows match). But ranges mix in bundles and higher tiers, Student/Family/extra-member prices are missing, there's no price history, no per-country page for "<service> price <country>" searches, and most hubs show iPhone-app prices without the web price beside them. |
| Index `/cancel`, `/prices` | **6.5/10** | Search and categories work. Missing: "Popular", A–Z, "Ask for a guide" (a free demand signal), and price-change news. |

---

## 1. Accuracy spot-check

### Cancel guides (8)

| Guide | Verdict | What the official page says | Fix |
|---|---|---|---|
| **Netflix** | Correct | help.netflix.com/en/node/407: netflix.com/cancelplan → **Cancel** → **Finish Cancellation**, confirmation email. Partner billing shown under Membership on the Account page. | Our answer says "the iPhone app has no cancel button". The page doesn't say that; it says signing out or deleting the app doesn't cancel. Use that line instead. Add: **Pause for 1 Month** (up to 3 months; not on Basic or some payment methods), access until the end of the billing period, viewing history and game saves kept **24 months**. |
| **Spotify** | Correct | support.spotify.com/us/article/cancel-premium: **Manage your plan** → **Cancel subscription**. Family/Duo members can only leave. Partner shown under **Payment**. | "You can't cancel inside the Spotify app" isn't on the page. Use "Spotify says to cancel on your account page". Add: Premium stays until next billing date, then free; **cancelling a $0 trial switches you to free immediately**; playlists and saved music are kept; mail-in cancel form exists. |
| **Disney+** | Partly verified | Disney+/Hulu/ESPN Subscriber Agreement (hulu.com/subscriber_agreement): disneyplus.com/account/cancel-subscription, cancel before **11:59 pm ET the day before** renewal, no refunds for partial periods, access until end of term. help.disneyplus.com renders empty, so button names ("Subscription", "Cancel Subscription") **can't be verified** from an official page. | The answer box prints "Checked … on **hulu.com**" on the Disney+ guide, which confuses readers. Show "Disney+ Subscriber Agreement" as the label. Re-check button names on a phone. |
| **YouTube Premium** | Mostly correct, one conflict | support.google.com/youtube/answer/6308278 (iOS): Settings → **Purchases and memberships** → tap membership → **Manage Apple Subscriptions** → membership → **Cancel**. If Google bills you, you "must cancel using a non-iOS device". Pause not available when Apple bills. Web: paid_memberships → **Manage membership** → **Deactivate** → **Continue** → **Yes, cancel**. | Step 3 "follow the steps to cancel" is vague; use the exact labels. The big primary button "Open YouTube Premium's cancel page" goes to youtube.com/paid_memberships, which Google says won't work from an iPhone for Google-billed members. Relabel it "On a computer: youtube.com/paid_memberships" or make Apple the primary path. |
| **HBO Max** | Correct | help.hbomax.com/us/Answer/Detail/000002526: hbomax.com/subscription → **Cancel Your Subscription** → confirm → note expiration date. Billing provider shown at the top of Subscription. | Add the official third-party list (Amazon, Apple, Google Play, Roku, Samsung, Xumo, Hulu add-on, YouTube TV, Prime Video Channels; each has steps on that page). Extra Member add-on gets a prorated refund. |
| **Xbox Game Pass** | Partly verified | Microsoft's general page: account.microsoft.com/services → **Manage** → **Cancel** (sometimes **Upgrade or Cancel**). If you see **Turn on recurring billing**, it's already set to expire. Prorated refunds in some countries (CA, IL, KR, TR; DE/NL/PL/PT etc. for longer subs). The Xbox-specific article (support.xbox.com) renders empty. | Our "Cancel subscription" label may not match; say "Cancel (or Turn off recurring billing)". Add the "Turn on recurring billing = already cancelled" check. |
| **Peacock** | Correct, one unsourced line | peacocktv.com/help/article/cancellation: /account/plans → **Cancel All Subscriptions** (ends add-ons too); email within a few hours; **Remove Add-On** for add-ons only; cancel by chat if you can't log in; no refunds or credits. Third parties: Amazon, Apple, DIRECTV, Google Play, Roku, Spectrum, Verizon, Xfinity, Xumo. | "Cancel by the day before it renews" (answer + tip) is **not on the official page**. Remove it or replace it with "it won't renew at the end of the current term". Our partner list is missing DIRECTV, Spectrum, Xfinity, Xumo. |
| **Apple TV** (Apple-only) | Correct | support.apple.com/118428: Settings → name → **Subscriptions** → subscription → **Cancel Subscription**. No cancel button or a red expiry line means it's already cancelled. Web: account.apple.com. | The template says "From Apple Support. Cancel at least 24 hours before it renews". The current article says that about **trials**. Reword it to "Cancelling a free trial? Do it at least 24 hours before it ends." Add the "red expiry line = done" check and the web option. |

**Pattern:** every step we publish is right. The errors are extra sentences in `answer`/`tips` that sound sensible but aren't on the source page (Netflix, Spotify, Peacock). The rule should be: **every sentence in answer/tips needs a source URL**, the same as the steps.

### Price rows (14 checked across US / UK / EU / India / MENA)

| Row | Our data | Official page (Nov 13) | Verdict |
|---|---|---|---|
| Netflix US | $8.99 / $19.99 / $26.99 | help.netflix.com/en/node/24926/us | Correct |
| Netflix UK | £7.99 / £13.99 / £20.99 | …/24926/gb | Correct |
| Netflix Germany | €6.99 / €15.99 / €21.99 | …/24926/de | Correct |
| Netflix India | ₹149 / ₹199 / ₹499 / ₹649 | …/24926/in | Correct |
| Netflix UAE | AED 35 / 49 / 71 | …/24926/ae (taxes "may be" added) | Correct |
| Spotify US | $12.99 / $18.99 / $21.99 | spotify.com/us/premium | Correct, but **Student $6.99 missing** |
| Spotify India | ₹139 / ₹299 | spotify.com/in/premium | Correct. **Student ₹69 missing**; note "Lite not checked" is stale (Lite was dropped in May 2026) |
| Spotify Saudi | SAR 23.99 / 59.99 / Student 12.99 | spotify.com/sa-en/premium | Correct |
| Spotify Egypt | EGP 79 / 109 / 139 / Student 39 | spotify.com/eg-en/premium | Correct |
| Disney+ UK | £6.99 / £11.99 / £15.99; yearly £119.90 / £159.90 | disneyplus.com/en-gb | Correct |
| Apple Music India | ₹139 / ₹229 / Student ₹69 | apple.com/in/apple-music | Correct |
| HBO Max US | $10.99 / $18.49 / $22.99; yearly $109.99 / $184.99 / $229.99 | hbomax.com | Correct |
| Peacock US | $8.99 / $12.99 / $19.99; yearly $89.99 / $129.99 / $199.99 | Plans page won't render for our tools; matches Peacock's own help article "price-increase" (Aug 18, 2026), as quoted in search results | Correct (via the official help article) |
| PS Plus France | Monthly €9.99 / 15.99 / 18.99; 12 mo €71.99 / 125.99 / 151.99 | playstation.com/fr-fr/ps-plus hides prices behind sign-in | **Can't verify** on the official page; matches May 2026 press (Tom's Guide FR, KultureGeek) |

**Result:** 13 correct, 0 wrong, 1 can't verify officially. The numbers are the strongest part of the site. Several ranking pages still show old prices: subger.com says Netflix "starts at $7.99", search snippets still show YouTube Premium at $13.99, and Netflix data kept "10 months" when Netflix says 24. Being right and dated is a real advantage over them.

---

## 2. Usefulness vs top-ranking pages

Read: SERPs for "how to cancel Netflix", "how to cancel Spotify Premium", "Netflix price UK 2026", "Spotify Premium price India 2026", "Netflix plans price India", "YouTube Premium price 2026"; pages: resubs.app, subger.com (Tom's Guide blocked full text; its SERP snippet used).
Top results are the official help page, Tom's Guide / TechRadar / Engadget / Trusted Reviews, then programmatic rivals (resubs, subger, subtracker, recurdash, cancelmanual, "subscription-cleaner").

### What top pages cover that we don't

| Topic | Top pages | Us | Can we add it honestly? |
|---|---|---|---|
| Cancel per device: web, iPhone app, Android app, TV/Roku, console | Tom's Guide, resubs: separate H2s for web, App Store, Google Play, Roku, PayPal | Web + Apple + generic "partner" | **Yes, for web/Apple/Google Play** (Google Play is one official generic article: support.google.com/googleplay/answer/7018481). **TV/Roku/console only where the service's page lists it** (HBO Max, Peacock, Xbox do). |
| Named third-party billers (Roku, Amazon, carriers, bundles) | Most | One sentence, sometimes incomplete (Peacock) | **Yes.** Copy the official list per service (HBO Max and Peacock list them all). |
| What happens after: access until period end | All | No | **Yes.** On the official page for Netflix, Spotify, YouTube, HBO Max, Peacock, Disney+, Microsoft. |
| Data kept (profiles, playlists, saves) | Some (often wrong: "10 months" for Netflix) | No | **Yes, where official:** Netflix 24 months, Spotify keeps playlists, Apple Music downloads stop. Leave it out where the source is silent. |
| Refunds | resubs has a refund table | No | **Only quote the official line** (Disney/Hulu: none for partial periods; Peacock: none; Microsoft: prorated in listed countries; HBO Max: add-on prorated). Never promise refunds or quote EU cooling-off rules without a source. |
| How to check it worked | Few, briefly | Only "keep the email" | **Yes, high value and rare.** Netflix BillingActivity; YouTube paid_memberships; Apple "red expiry line"; Microsoft "Turn on recurring billing" shown; HBO Max expiration date; Peacock email within hours. This is exactly what the anxious target user wants. |
| Pause or downgrade instead | Subger/resubs mention save offers | Hulu only | **Yes, where official:** Netflix Pause for 1 Month (max 3), YouTube pause (not for Apple billing), Hulu pause, Canva 3-month pause, Amazon Music pause. Frame it neutrally ("Not sure? Netflix lets you pause"). That serves the user and fits "Not ready to cancel?". |
| Free-trial cancellation | Some | No | **Yes:** Spotify (trial cancel ends Premium immediately), Apple (cancel ≥24 h before the trial ends), Amazon ("End trial and benefits"), Walmart+ (trial benefits end right away). |
| "Deleting the app doesn't cancel" | Most | Implied | **Yes**, Netflix says so; Duolingo/Tinder/Bumble notes say it too. |
| Charged after cancelling / second account | Spotify official, resubs | No | **Yes** (Spotify: "Premium on a different account"; Apple: check the email the receipt went to, Family Sharing). |
| Phone/chat support | resubs prints phone numbers | Costco only | **Only official numbers.** Never copy numbers from third parties; scam numbers float around these SERPs. |
| FAQ block (People Also Ask) | resubs, subger: 6 Qs | None | **Yes**, built only from the facts above. |
| Price: plan features (ads, HD/4K, screens) | Indian price pages, Tom's Guide | No | **Yes**, from the official plan page (Netflix lists resolution and screens). |
| Price history / increases | News sites, the ranking pages for "price UK" | No (spec has a log, not built) | **Yes, only with verified old prices:** Peacock help "price-increase" (old → new + dates), YouTube Premium Apr 2026, Netflix UK Sep 3, 2026, Spotify India cut May 2026. Use Wayback snapshots of the official page as the "old" source. |
| Student / Family / Duo / extra member | Everywhere | Patchy (Spotify US/IN Student missing; Netflix extra member missing) | **Yes**, same official pages. |
| Web price vs iPhone-app price | Rare (piunikaweb: YouTube $20.99 via Apple vs $15.99 web) | Rows are labelled "iPhone app price" but the web price isn't shown | **Yes, and it's our best angle.** An iPhone site telling people "you may pay more in the app" serves the user and leads straight into the app's pitch. |
| Cheapest way / alternatives | subger: "cheaper alternatives" | Cheapest plan per country | Yearly plans, student and official bundles: yes. Skip "alternatives" lists (affiliate bait, off-brand). |

---

## 3. Template review

### Cancel guide: what's good
- Answer-first box with a dated, sourced sentence and a one-tap official link. AI answer engines can lift it cleanly.
- "How do you pay?" jump links, real H2s, anchors, sticky TOC, numbered steps, visible checked date, source link, author, disclaimer, stale banner at 90 days and noindex at 180.
- Article + BreadcrumbList JSON-LD, `citation`, honest `datePublished`/`dateModified`.
- "Did this work?" without tracking. Waitlist CTA has honest copy ("It can't cancel for you").

### Cancel guide: problems
1. **Hard-coded lines that are wrong on many guides.** "A phone or TV company" in the pay-method nav and "APPLE.COM/BILL means Apple bills you" show on Costco, Xbox, PS Plus, Nintendo, Uber One, DashPass, Instacart, Claude, Strava and Dropbox. On Costco the primary button "Open Costco's cancel page" goes to a renewal page, and "No cancel button?" makes no sense there. Drive both from data (`billers: [...]`, `appleBilling`).
2. **Source label shows the wrong brand** (Disney+ → "hulu.com"). Add a `sourceLabel`.
3. **No FAQ, no "what happens after", no "did it work" check, no Google Play.** These are the topics where we lose to Tom's Guide and resubs.
4. **Price block is US-only.** UK and India visitors see dollars. The spec says visitor's country; the hub already has the rows.
5. **The "Did this work?" signal goes nowhere visible.** A mailto has low response. A no-personal-data yes/no counter (D1 is already planned) could show "12 readers said this worked this month". That's real freshness proof for people and for Google.
6. **No "Ask for a guide"** on the index or the guide pages.
7. Notes-to-tips filtering uses a regex over research notes (`publicNotes`). It's fragile; one new phrasing leaks a research note. Store `internalNote` separately.
8. **Schema:** Article + Breadcrumb is right. HowTo rich results were retired in 2023 and FAQ rich results are limited to government and health sites, so FAQPage won't show stars. It is still worth adding as visible Q&A plus JSON-LD: it feeds People Also Ask and AI answers, and costs nothing.

### Cancel guide: 10/10 outline
```
Breadcrumbs (Home › Cancel guides › Netflix)
[logo] Streaming
H1  How to cancel Netflix
Meta: ● Checked Nov 10, 2026 · re-checked every 90 days · Sources: Netflix Help (2) · By Aribo
ANSWER BOX (40–60 words, every clause sourced)
  "Go to netflix.com/cancelplan, tap Cancel, then Finish Cancellation. You keep watching
   until your billing date. Billed by Apple or your phone company? Cancel with them."
  [Open Netflix's cancel page ↗]  url line + copy
  Who bills you?  [Netflix] [Apple] [Google Play] [Phone/TV company]   ← from data, only real options
H2 Not sure yet? (only if official)  "Netflix lets you pause for 1 month, up to 3." [how ↓]
H2 Cancel on netflix.com (iPhone Safari or computer)   numbered steps, exact labels in bold
H2 If Apple bills you        Apple steps + "red expiry line = done"
H2 If Google Play bills you  generic Google Play steps (one official source)
H2 If a partner bills you    named list from the official page (Roku, Amazon, carriers…)
H2 How to check it worked    confirmation email · netflix.com/BillingActivity shows end date
H2 What happens after you cancel   (each line cites its source)
     • Watch until the end of the billing period
     • Profiles, history, game saves kept 24 months
     • Refunds: what Netflix says, or "Netflix's page doesn't mention refunds"
H2 Questions people ask (FAQPage JSON-LD; 4–6 Q from PAA, answered only from sources)
     Can I cancel Netflix in the app? · Does deleting the app cancel it? · Do I get a refund?
     · Why was I charged after cancelling? · Can I pause instead? · Free trial?
H2 What Netflix costs in [visitor country]   table + "last price change: Sep 3, 2026 (UK)" + hub link
Card  Not ready to cancel? Ditch reminds you 3 days and 1 day before it renews. [waitlist]
Did this work? [Yes] [Something changed]  "23 readers said yes in Nov" (anonymous count)
H2 Cancel something else (4 related + "Ask for a guide")
Sources (list of every official URL with what it confirmed and the date) · disclaimer
```
Data fields to add per guide (all with `source`): `methods[] {type: web|apple|google-play|partner|tv|console|phone|in-person, steps, source}`, `billers[]`, `after {access, data, refunds}`, `pause`, `trial`, `verifyDone`, `faq[]`, `sourceLabel`, `internalNote`.

### Price hub: what's good
- Correct numbers, local money, never summed across currencies, per-country header with tax, date and source link, "iPhone app price" labelling, Article + Breadcrumb, "Spotted a different price?" link.

### Price hub: problems
1. **No page for the actual query.** People search "netflix price uk" and "spotify price india". We have one hub per service with `#uk` anchors. The title says "in 17 countries", not "UK".
2. **Ranges include bundles or higher tiers:** Disney+ US "to $21.99" is the Hulu bundle (Premium is $21.49). Claude Pro: "$20 a month in the US and £20 to £119.99 in the UK" (UK row includes Max, US doesn't). ChatGPT "$8 to $200". Perplexity Pro includes Max $200.
3. **Web price is missing where we show iPhone-app prices** (27 hubs are mostly or all App Store rows). For YouTube Premium the gap is $15.99 web vs $20.99 via Apple.
4. **No price history** (the spec has it, it isn't built), no plan-feature table, Student/Family/extra-member prices patchy.
5. "Cheapest plan in each country" repeats "{Service} price in {Country}: …" 17 times. It reads as keyword-templated and adds little. Replace it with one "cheapest way to pay" card.
6. Tax header "Egypt · VAT 14%" reads as "includes 14% VAT" while the note says the service doesn't say. Use "VAT 14% (not stated if included)".
7. Schema: add a `Dataset` (honest fit for a dated price table, with a CSV `distribution`). Don't use Product/Offer: we don't sell it.

### Price hub: 10/10 outline
```
Breadcrumbs
H1  Netflix price in 2026: every plan, 17 countries
Meta: ● Checked Nov 9–12, 2026 · Netflix help pages · By Aribo
ANSWER BOX  "Netflix costs $8.99 to $26.99 a month in the US and £7.99 to £20.99 in the UK.
             UK prices rose on Sep 3, 2026. In [visitor country]: …"   (no bundles in ranges)
Callout (if different)  "Signed up in the iPhone app? Apple charges $X; the website charges $Y."
H2 What each plan gets   (ads, quality, screens, extra member: from the official page)
Country strip (visitor country first)
H2 Netflix price by country   table: Plan | Month | Year | Student/Family | Notes
H2 Price changes          date · country · old → new · source (verified old prices only)
H2 Cheapest way to pay    yearly plan, student, official bundles (no affiliate)
H2 Questions              How much is Netflix in the UK? · Is yearly cheaper? · VAT included? · Why more in the app?
Card  Paying for Netflix? Ditch reminds you before it renews. [waitlist]
H2 Want out? → cancel guide
H2 More streaming prices
Spotted a different price? · Method + CSV download · Sources · disclaimer
JSON-LD: Article + BreadcrumbList + Dataset
```
**Country pages** `/prices/netflix/uk`: build only for the top ~15 services × the countries where we have something unique (local plans, history, VAT, web vs app). H1 "Netflix price in the UK (2026)", local answer, one table, history, cancel link, sibling-country links. Canonical to itself. Don't generate the full 42 × 17 grid; that's the thin pSEO pattern Google demotes.

### Index pages: 10/10 outline
```
H1 How to cancel a subscription · "31 services, checked by hand" · last checked date
Search (instant, "/" shortcut) · empty state: "No guide for 'x' yet" + Ask for it (counts demand)
Popular (6 by demand) · Recently re-checked · Recent price changes (prices index)
Category chips with counts · A–Z strip · cards (logo, name, "Checked Nov 10")
"Can't find yours? Ask for a guide"  · generic: "How to cancel any App Store / Google Play subscription"
```
Add two generic guides: **"Cancel any iPhone subscription"** and **"Cancel any Google Play subscription"**. They are high volume, need one official source each, and every unpublished guide can link to them.

---

## 4. Coverage

No measured volumes (Ahrefs needs authorising). Ranking below uses catalog rank (`services.json`), how strong the cancel intent is (known friction), and whether every rival covers it.

**Highest-demand, written but unpublished (medium confidence):**
1. **Amazon Prime** (catalog #2). The most-searched cancel query among apps. Friction: several confirm screens, trial "End trial and benefits". Publish after a phone check.
2. **ChatGPT Plus** (#6). Fast-growing; App Store vs web confusion.
3. **iCloud+** (#8). "Downgrade" wording, iOS-version paths.
4. **Audible** (#17). Credits lost on cancel; the app can't cancel.
5. **Paramount+** (#18).
6. **Adobe Creative Cloud**. Early-cancel fee on annual plans; very high "cancel" intent and anger.
7. **Walmart+**, **Kindle Unlimited** (renamed "Kindle+" on some pages: check the name), **Duolingo**, **Crunchyroll**, **Canva**, **Tinder / Hinge / Bumble**, **Calm / Headspace**, **Amazon Music**, **Apple Fitness+**.
8. **NYT**: no official source reachable. Needs an owner check.

**In the catalog, no guide at all, high demand:** Planet Fitness (one of the biggest "how to cancel" queries in the US; in-person or letter rules vary by club, so be careful), HelloFresh, Sling TV, Fubo, Philo, Starz, Discovery+, X Premium, NordVPN, ExpressVPN, Norton, McAfee, Grammarly, Peloton, Noom, WW, Match, Patreon, Discord Nitro, Perplexity, Copilot Pro, Grok, DAZN, NOW, Sky, JioHotstar.
**Price hub but no cancel guide** (easy internal-link wins): Perplexity, Grok, Copilot Pro, Discord Nitro, Notion, 1Password, Babbel, MasterClass, Roblox, Economist, Proton, Deezer, TIDAL, Oura.
**Missing from the catalog:** MENA services (Shahid VIP, OSN+, STARZPLAY, Anghami; we publish MENA price pages but no MENA-native services), Ancestry, DirecTV Stream, AMC+.
**Price hubs missing for huge queries:** **YouTube Premium** (only Qatar/Saudi rows, so no hub; "YouTube Premium price" is a top query, prices rose Apr 2026, and many ranking pages are stale), Hulu, Peacock, YouTube TV, ESPN (US-only rows, so no hub). Allow a US-only price page for US-only services instead of requiring 6 countries.

**Slugs to review** (301 the old ones):
- `max` → **`hbo-max`** (renamed back in 2025; title and data already say HBO Max).
- `ps-plus` → `playstation-plus`; `nintendo-online` → `nintendo-switch-online`; `doordash` → `dashpass` (or `doordash-dashpass`); `now` → `now-tv`; `nyt` → `new-york-times`.
- Keep `apple-tv`, but add "formerly Apple TV+" in the intro. Same for `google-ai-pro` ("formerly Google One AI Premium / Gemini Advanced"), `espn` ("ESPN+ is now ESPN Select/Unlimited") and `x-premium` ("Twitter Blue"). People still search the old names.
- `claude-pro`, `chatgpt-plus`, `perplexity` hubs cover several tiers. Either rename the hubs to the brand ("ChatGPT plans and prices") or show only the named tier in the answer range.

---

## 5. Data hygiene

| Issue | Where | Fix |
|---|---|---|
| Local-language plan names on an English site | Disney+ DE "Standard mit Werbung", FR "Standard avec pub", IT "Standard con pubblicità", ES "Estándar / Prémium / Estándar con anuncios" | English name, local name in brackets: "Standard with Ads (Standard mit Werbung)" |
| Ranges include bundles or other tiers | Disney+ US (top = Hulu bundle $21.99); Hulu US includes Disney+ bundles; Claude Pro (Max £119.99 in UK, not in US); Perplexity Pro (Max); ChatGPT ($8 Go to $200 Pro) | Add `kind: 'bundle' \| 'tier-up'` per plan; exclude from the answer range; show them in a separate "Bundles" row group |
| Same name, two prices | Google One "AI Plus (2 TB)" $9.99 vs Google AI Pro hub "Google AI Plus" $4.99. Press: AI Plus cut to $4.99 in June 2026; the 2 TB plan was "upgraded" with AI Plus perks | Rename the Google One row "2 TB (includes AI Plus perks)" after an official check |
| Missing common plans | Spotify US Student $6.99, Spotify India Student ₹69; Netflix extra-member prices | Add them; they're on the same official page |
| Stale research note | Spotify IN: "Lite not checked" (Lite was discontinued May 2026) | Update the note |
| Mixed currencies in one country | Qatar (USD + QAR), UAE (USD + AED), Kuwait (USD) | Fine, but say it in the header: "Billed in US$ in Qatar" |
| Tax label reads as fact | "VAT 14%" / "VAT 5%" headers when the note says the service doesn't state it | "VAT 14% (not stated if included)" |
| Cycle encoded in plan names | "Standard (yearly)", "Premium (12 months)", PS Plus 9 rows per country | Use the cycle column; group PS Plus by tier with 1/3/12-month columns |
| Wrong brand as visible source | Disney+ guide source = hulu.com | `sourceLabel: "Disney+ Subscriber Agreement"` |
| Research notes mixed with reader tips | `note` field filtered by regex | Split into `tips` (public) and `internalNote` |
| Unsourced sentences in answers | Netflix ("no cancel button in app"), Spotify ("can't cancel in app"), Peacock ("by the day before") | Every answer/tip sentence carries a source, same rule as steps |
| Dates | All rows Nov 9–12, 2026: fresh. Prices change often (Netflix UK Sep 3, Peacock Aug 18, YouTube Apr 10) | Re-check the top 20 hubs monthly, not every 90 days |
| Currency formatting | Consistent: $, £, €, CA$, A$, NZ$, ₹, US$; whole-unit display for AED/EGP | OK |

---

## Top 10 actions, in order
1. Fix the three unsourced answer lines (Netflix, Spotify, Peacock), the YouTube primary button, Disney+'s "hulu.com" label and Apple's "24 hours" wording. Small edits, real accuracy wins.
2. Stop the hard-coded "A phone or TV company" and "APPLE.COM/BILL" lines on non-Apple and non-streaming guides (Costco, Xbox, PS, Nintendo, Uber One, DashPass, Instacart).
3. Add "What happens after", "How to check it worked" and "Pause instead" sections, from the official pages already read (facts above).
4. Add a Google Play section (one official source) and named partner lists.
5. Add a visible FAQ with FAQPage JSON-LD.
6. Owner phone-checks and publishes Amazon Prime, ChatGPT, iCloud, Audible, Paramount+ and Adobe (biggest demand).
7. Price hubs: exclude bundles and higher tiers from ranges; add Student/Family; show web vs iPhone-app price; start the price-change log with Peacock, YouTube, Netflix UK and Spotify India.
8. YouTube Premium price page (allow US-only hubs) plus Hulu, Peacock and YouTube TV.
9. Country pages for the top ~15 services × the countries with unique content.
10. Slug 301s (`max` → `hbo-max` first), the "Ask for a guide" link, and an anonymous "Did this work?" counter.

## Sources used (live, Nov 13, 2026)
help.netflix.com/en/node/407 · help.netflix.com/en/node/24926/{us,gb,de,in,ae} · support.spotify.com/us/article/cancel-premium · spotify.com/{us,in,sa-en,eg-en}/premium · support.google.com/youtube/answer/6308278 (iOS + Desktop) · help.hbomax.com/us/Answer/Detail/000002526 · hbomax.com · peacocktv.com/help/article/cancellation · peacocktv.com/help/article/price-increase (via search) · support.microsoft.com/…/cancel-your-microsoft-subscription · support.apple.com/en-us/118428 · hulu.com/subscriber_agreement · disneyplus.com/en-gb · apple.com/in/apple-music · playstation.com/fr-fr/ps-plus (prices behind sign-in).
Blocked or empty to our tools: help.disneyplus.com, support.xbox.com, peacocktv.com/plans, one.google.com/about/plans, tomsguide.com (full text).
Rival pages read: resubs.app/resources/how-to-cancel-netflix, subger.com/en/cancel/netflix.
