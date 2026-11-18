# Plan: Ditch UX overhaul + Plaid in v1 (Nov 18, 2026)

Built from `docs/research/ux-overhaul/A-niche-flows.md` (in-niche flows on Mobbin), `B-best-in-class.md` (outside the niche, plus the slop checklist) and `C-ditch-audit.md` (audit of the current app). Mockups: `design/v15-overhaul/` (`mock.html`, `overhaul-v1.png`). **Waiting for owner approval before building.**

## The diagnosis
- **The app never shows the product before asking for things.** Clear rivals open on a real product shot or a real number (Rocket Money, Monarch).
- **Finding, the strongest feature, isn't in onboarding.** In the app it's buried at the bottom of Home.
- **Charge dates are the worst friction:** 11 taps for 5 subs, before the paywall.
- **The paywall sells "2 more reminders".** It should sell the money found.
- **Home is overloaded:** only one subscription shows above the fold on the overlap list.
- **The "slop" comes from sameness and small inconsistencies:** one template on every screen, emoji used as icons, link-as-button, orphan words in headlines, mixed money and date formats, default press states.

## New flow (US/Canada)
1. **Welcome:** a real product shot plus "Find every subscription. Get a reminder before each charge." Button: Find my subscriptions.
2. **How to start:**
   - Scan my bank (FASTEST, first scan free)
   - Pick from a list
   - Apple screenshot card
   - Outside US/CA: no bank card; the screenshot takes the top spot.
3. **Trust screen, "We look once, then let go":**
   - Read-only.
   - Your login goes to Plaid.
   - Disconnected after the scan.
   - Buttons: Connect with Plaid / Not now.
4. **Plaid Link:** Plaid's own consent and login screens.
5. **Scanning:** a staged checklist with logos dropping in. The last tick is "Disconnecting from Chase".
6. **Found reveal:**
   - "We found 9 · $1,140 a year · 2 free trials end this week"
   - Still charging / Maybe groups, with dates taken from the transactions
   - Button: "Add all 9"
   - All found subs are saved for free (Apple 3.1.2, #11)
7. **Reminder ask from their own data:** "Netflix charges you Tue, Dec 16", a real banner, and "Tap Allow".
8. **Paywall anchored on their list:**
   - their logos and their total
   - Pro = reminders on all, trial alerts, bank rescans, price-rise alerts
   - **7a** is today's one-line style; **7b** adds a trial timeline (owner to choose)
9. **You're set:**
   - 9 on your list
   - reminders on your 3 biggest
   - 6 without reminders (swap anytime, or Pro)

Manual path: today's flow, with the charge-dates step optional (ask later, or "Connect your bank" to fill the dates).

## In the app
- **Home:**
  - the next reminder sits inside the total card
  - one nudge slot, in priority order: trial ending > no date > overlap > price rise
  - the list sits above the fold
  - card chips move to Calendar/filters, and payday moves to Calendar
- **The + button opens a chooser:** Scan my bank / Apple screenshot / Statement / Add one myself.
- **Empty Home:** a hero with faint logo rows and "Scan my bank" / "Add one myself".
- **Edit sheet:** Basics (name, price, how often, next charge) plus a collapsed "More".
- **Settings → Bank scans:** last scan, "disconnected after scan", next rescan.

## Craft pass (slop checklist, B §3)
- **Formatting:**
  - one money formatter and one date format ("Thu, Nov 19")
  - "/mo" everywhere
  - tabular figures
- **Visuals:**
  - at most 4 corner radii and one icon set
  - no emoji in the app's interface
  - press states scale to 0.97
- **Copy:**
  - no centred paragraphs, no orphan words
  - buttons are a verb plus a result
- **Motion and feel:**
  - motion only after something the user did
  - a written haptic map
  - designed empty, 1-item, 100-item and error states

## Owner decisions needed
1. Approve the flow and screens (mockups 1–11).
2. Paywall: **7a** one-line vs **7b** timeline (#29 says no timeline).
3. Lifetime $49.99 vs $39.99.
4. Find-results rules: all found subs saved free; Pro = reminders beyond 3, rescans, trial alerts, price alerts. (Changes #11/#16/#34/#24 as discussed.)

## Build order after approval
1. Craft pass and component cleanup.
2. New onboarding with the manual path.
3. Home, the + chooser and the empty state.
4. Purchases (StoreKit).
5. Paywall.
6. Plaid on Sandbox: server functions and the Link SDK in a dev build.
7. Bank flow screens.
8. Tests, then the owner's iPhone run.
