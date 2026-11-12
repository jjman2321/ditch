# ditchsubs.app: brief (owner interview, Nov 12)

Growth is organic only: SEO + ASO (DECISIONS #18). The site is a main growth channel, not a brochure.

## Owner answers
- **Who's behind it:** "Aribo", no photo (the duck can be the avatar). Shown on About and as the author of guides.
- **Domain:** registered at Spaceship, DNS on Cloudflare (same nameservers as the owner's other sites: normal and safe, each domain is its own zone).
- **Stack:** code on Cloudflare Pages, like the owner's other sites.
- **Languages:** English first (owner, Nov 12: "finish English version first then work on translations"). Then German, French, Spanish, Italian, written by Claude in each language (not word-for-word), no paid native check. Build the site so adding a language later is easy (locale folders, hreflang ready).
- **Timing:** go live now, before the app: home with waitlist, Privacy, Terms, Support, plus the first cancel and price pages, so they start ageing in Google.
- **Waitlist:** Resend audience (email only, no tracking). Launch email from support@ditchsubs.app.
- **References the owner likes (not locked):** Givingli, Spellbook, Quartz, Remote, Miro.
- **Look:** the app's Sunflower look (sunflower, ink, cream, tangerine, Archivo, the duck, the DITCHED stamp, real logos), the Bean icon as favicon (DECISIONS #52).

## Data we can publish (same files as the app)
- `docs/research/prices-2026-11.json`: hand-checked prices, 12 countries, source + checked date + status.
- `docs/research/cancel-guides-2026-11.json`: 49 cancel guides with official links.
- `assets/logos/`: 213 service logos.

## Open
- Research reports (design references on Mobbin; SEO/AEO/GEO plan) → site plan + mockups for owner approval before building.

## Owner answers, round 3–4 (Nov 12)
- **Logos:** small logos + "not affiliated" line. **Compare pages:** only where we win (lawyer OK); every row true, dated, sourced. **Upkeep:** 1–2 h a week. **Launch list:** waitlist (pre-order maybe later).
- **Stack:** Next.js 16 + Tailwind on Cloudflare Workers via OpenNext, like Ankidecks and PeptideTracker (`jjman2321/pepsi` is the template).
- **Motion:** subtle and smooth (fade-up on scroll, hover, stamp lands once; off with Reduce Motion; prices never move).
- **Hero:** sunflower hero with the phone (current mockup).
- **Dark mode:** light only at launch.
- **Newsletter:** monthly "Price Hike Report" from our price data.
- **Socials:** none yet (no `sameAs` until they exist).
- **About page:** Aribo's story: built Ditch to track his own subscriptions. No other personal details.
- **Countries:** keep India; **add MENA prices and pages, in English** (new data needed: official prices checked by hand like the other 12).
- **Search:** a search button in the nav on every page.

## Conversion direction (owner, Nov 12: "very, very important")
The site must convert, not just rank. Lead with money:
- **Yes, it's a subscription, and it costs less than the ones it catches.** Face the "a subscription to track subscriptions?" objection head-on (~115 competitor reviews raise it).
- **Cheap, and said plainly:** $29.99 a year is about $2.50 a month. Compare it with what people really lose (sourced: ~$205 a year wasted on unused subscriptions, CNET/YouGov 2025; people guess $86 a month but spend $219, C+R Research).
- **Lifetime front and centre:** "Rather pay once? $49.99, yours for good." for subscription-haters. Covers Pro only (never "all future features").
- **Helps you keep money:** the calculator's real yearly total, the DITCHED stamp "$X a year you won't pay". Never "saved", never a promised amount.
- Every page funnels to one action: the waitlist now, the App Store at launch.
