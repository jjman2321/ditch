# Site v4 audit (Nov 13, 2026)

There were three independent audits of the new v4 look, plus our own screen-size and speed runs:
- function and accessibility (Playwright + axe)
- SEO and AI search
- wording, honesty and conversions

## Results after fixes
| Check | Result |
|---|---|
| 28 screen sizes × 33 pages (Galaxy Fold 280 → 2560 desktop) | 924 checks, 0 issues |
| axe-core accessibility, 35 pages × phone + laptop | 0 violations |
| Lighthouse mobile (/tools, Spotify split, Netflix guide, Netflix prices) | Performance 96–99, Accessibility 100, Best practices 96–100, SEO 92*, CLS 0 |
| Internal links | 123 links, all 200 |
| JSON-LD | Valid. FAQ answers appear word for word on the page |

\* SEO 92 is only Lighthouse flagging the Cloudflare `Content-Signal:` line in robots.txt as an "unknown directive". Google ignores lines it doesn't know. We kept it on purpose.

## Fixed
- **Honesty**
  - Every tool CTA now says "Free for 3 subscriptions, Pro covers the rest."
  - The calculator line says "3 free, all N with Pro" when more than 3 are picked.
  - "Checked by hand" is now "from each service's own page" everywhere. The prices were read by scripts and a browser, not by a person.
  - The FAQ line "No app can do that honestly without your passwords" is now "Ditch can't, and it won't pretend to."
  - The waitlist line now says a confirm link comes first.
  - The home demo used a Disney+ trial. Disney+ has no US trial, so it's now a Spotify trial.
- **Wrong numbers**
  - Microsoft 365 split now compares against Personal ($67.49 a year, not $167.49).
  - Yearly shares come from exact maths ($65.97, not $66.00).
  - Monthly vs yearly no longer pairs India's Prime Lite with full Prime.
  - The vs table has no "Top plan" row, which compared Claude Pro with ChatGPT Pro.
  - Bundles and student plans are left out of the vs table.
  - The Google AI Pro title now quotes the Pro price.
  - Student plans are left out of the "cheapest plan" lists.
- **Charge finder**
  - "1,299.00" reads as 1299, and "-5" is rejected.
  - The match count is the real total.
  - Doubled rows are removed.
  - Added a "Found it? … ask for a refund" next step.
- **Names**: no doubled words ("Discord Nitro Basic", not "Discord Nitro Nitro Basic"). Countries read "in the Netherlands" and "in the UK".
- **Layout**
  - The plan picker no longer runs off the screen. Long plan names stack.
  - Long headings wrap on a 280px folded phone.
  - The tool keeps its space while prices load (CLS 0).
- **Accessibility**
  - Yellow focus ring inside the dark answer panel.
  - Field and option borders at 3:1.
  - One focus ring on the search box.
  - Focus returns to the search box after clearing.
  - Counts read "1 tool", not "1 tools", and no announcement repeats.
  - 44pt "On this page" links on touch tablets.
- **SEO**
  - Each service tool shows a by-country price table in the page itself, so AI crawlers that don't run JavaScript still get the numbers.
  - The vs pages lead with the real answer, which is also their meta description.
  - Each page has 3 questions and a "Prices checked" date.
  - Sources come from the price rows.
  - Price and cancel pages link to their tools.
  - llms.txt lists the tools and charge pages.
  - Titles end "| Ditch".
  - Old-slug redirects only fire when the new page exists.
- **Parked**: YouTube Premium Family split. We have only Saudi and Qatar prices for it, so US visitors saw SAR. It's back once US, UK and EU prices are checked (`PARKED_TOOLS` in `web/src/lib/tools.ts`).

## Open, for the owner
1. **Home hero and the free limit.** "Free iPhone app" plus "a reminder 3 days before each charge" reads like free reminders on everything. Options:
   - "Track every subscription free. Reminders 3 days before, on 3 free or all with Pro." (8/10)
   - Keep the hero as it is and rely on the pricing table. (5/10)
   - Pick: the first one.
2. **"Price Hike Report" checkbox.** It promises a monthly email we haven't planned. Either plan the first send or remove the checkbox.
3. **Missing guides.** Amazon Prime and ChatGPT are top-4 searches with no cancel guide.
4. **Data gaps**
   - Claude Max US price.
   - YouTube Premium US, UK and EU prices.
   - Apple One shows News+ in India.
5. **Support answer on changing phones.** Check on a device that Quick Start and iCloud backup carry the list over before we say so.

The full raw findings from the three audits are in the session scratchpad (audit-a/b/c).
