# Website audit round 2 (Nov 13, 2026)

Five auditors (SEO + AI search, accessibility + speed, design + motion, wording + conversion, guide + price accuracy) and a 28-screen device test. Full reports are in this folder.

## Scores before fixes
| Area | Score | Main gaps |
|---|---|---|
| SEO / AI search | 6.5 | guides thin (~410 words, 28% unique), high-demand pages missing, site not live/indexed |
| Accessibility / speed | no P0, 8 small P1s | dialog focus, faint placeholders, letter-tile contrast, focus under sticky strip, waitlist confirm page flash, endless hero loop |
| Design / motion | home 6.5 | 9 yellow blocks, prices moving in pricing, duplicate duck picture, misaligned step cards |
| Wording / conversion | 6.5 | untrue sign-up states, unsourced numbers, calculator CTA jumped to top, guide CTAs left the page |
| Guides / prices accuracy | 6.5 / 6 | steps and 13 of 14 checked prices correct; extra unsourced sentences; template lines shown on wrong guides |

## Fixed (Nov 13)
- Sign-up states honest (Send it again, spam hint, no "expired"); static /waitlist/confirmed and /waitlist/invalid.
- Guides: unsourced lines removed (Netflix, Spotify, Peacock, Apple 24h); billing hints only where they apply; Costco button names its auto-renew page; side cards stay on the page.
- Home: yellow cut to ~5 blocks; step cards aligned; step 3 shows the service's own cancel page; reminders before the ditch card; pricing only fades; email box in the calculator result; review-based reminders proof; sourced FAQ answer.
- SEO: price titles give the starting price; single table caption; author metadata; 12 footer links per column.
- Accessibility: dialog focus trap/return, Lifetime focus ring, placeholder and tile contrast, scroll padding under the country strip, 44pt targets on touch screens, 404 title, hero loop pauses on hover/focus.
- Screens: 448 checks (16 pages x 28 sizes: Galaxy Fold folded/open, Surface Duo, iPhone SE to 16 Pro Max, phones sideways, every iPad both ways, laptops, 1920 and 2560 desktops): 0 issues. Headline and email box visible without scrolling on every size.
- Lighthouse (final build): / 98/100/100, /cancel 96/100/100, /prices/netflix 99/100/100 (perf/a11y/best practices), CLS 0.

## Owner decisions (open)
1. Deeper guides: add "What happens after you cancel", refunds, Google Play, pause option and a Questions section, from the official pages already read (auditor lists the facts). Needs your OK on the facts.
2. Publish the medium-confidence guides (Amazon Prime, ChatGPT, iCloud+, Audible, Paramount+, Adobe) after a phone check.
3. Allow price pages with only US prices (Hulu, Peacock, YouTube TV, ESPN, SiriusXM).
4. Slugs before launch: max -> hbo-max, ps-plus -> playstation-plus, nintendo-online -> nintendo-switch-online, doordash -> dashpass.
5. Blog: /guides (iPhone money guides) and /report/YYYY-MM + /price-changes (the Price Hike Report as pages). 10 first articles in audit-seo.md.
6. Conversion: "Free iPhone app · Coming soon" line above the hero headline; button wording ("Join the waitlist" vs "Email me when it's out"); one form under pricing instead of 3 buttons.
7. Price pages: country-by-plan matrix instead of one long table; web vs iPhone-app price callout.
8. Go live: Cloudflare (Block AI bots off), D1 id, Resend secrets, Search Console + Bing.
