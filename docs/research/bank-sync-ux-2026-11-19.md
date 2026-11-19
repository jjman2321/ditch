# Bank sync: the experience, screen by screen (Nov 19, 2026)

Spec for DECISIONS #64/#66/#67/#69 (engine `src/import/bankSync.ts`). Scores out of 10; ✔ = pick. Mockups go to the owner before building.

## Principles for our user (anxious, wants control, hates surprises)
| # | Rule | Evidence |
|---|---|---|
| 1 | **Explain before the bank sheet opens:** what we read, what we can't do, how to stop. Max 3 lines. | Plaid: conversion is highest when users know what to expect; lead with the benefit, say it's read-only, say they can unlink ([Plaid messaging](https://plaid.com/docs/link/messaging/), [best practices](https://plaid.com/docs/link/best-practices/)). Good: Cleo ([Mobbin](https://mobbin.com/screens/96712606-5aa5-4393-95bd-f370ff115e6c)). Bad: Betterment's wall of text ([Mobbin](https://mobbin.com/screens/bbe379eb-26bc-41ac-9b79-184494a19ac0)). |
| 2 | **Price before the bank, never after.** | 8% of Rocket Money's bank complaints: "AFTER connecting ALL MY ACCOUNTS… it wants payment!" ([unstar, 150 reviews](https://unstar.app/blog/rocket-money-wont-link-bank-account-loop-reviews-2026)). Our trial gate is before (#66). |
| 3 | **Sure → add with Undo. Unsure → ask. Money → always ask.** | Wrong detections are a top finder complaint (`detection-accuracy` §4). |
| 4 | **Show the proof on every find:** the real charge dates. | Users check us in a second. |
| 5 | **Broken links are calm, specific, one tap, and never hide the list.** | Rocket Money: 32% "link loop", 26% "never completes", 14% "worked, then broke" ([unstar](https://unstar.app/blog/rocket-money-wont-link-bank-account-loop-reviews-2026)); Monarch: "reconnect every three days" ([Trustpilot](https://fi.trustpilot.com/review/www.monarchmoney.com)). Plaid repair often asks only for a new code ([update mode](https://plaid.com/docs/link/update-mode/)). |
| 6 | **Disconnect is two taps away and says what stays.** | Apple 5.1.1(ii): "an easily accessible and understandable way to withdraw consent" ([guidelines](https://developer.apple.com/app-store/review/guidelines/)). Privacy fear: 7% of MonoBoost reviews; Plaid's $58M privacy settlement still circulates ([Bloomberg Law](https://news.bloomberglaw.com/privacy-and-data-security/plaid-to-pay-58-million-to-settle-data-privacy-class-action)). |
| 7 | **Real progress, no fake bars.** | Named steps ([Monarch](https://mobbin.com/screens/33fc9bf6-cf4c-46f2-be9d-6373759dc721), [Origin](https://mobbin.com/screens/0a3297f4-b800-471a-a2bc-8236974a31ac)). |
| 8 | **One sync card on Home at a time.** | Home is a bill list, not a feed (home.png). |

**Never say anywhere:** Plaid (#64), "we cancel for you", "automatically finds everything", "nothing leaves your phone", "saved", "bank-level security" (vague), "Oops", "Uh-oh", or anything that blames the user.

## (a) First connect inside onboarding
Order: Where should we look? → Bank explainer → Paywall (trial) → bank sheet → Scanning → Results → Total reveal → (rest of onboarding).

**a1 · Where should we look?** (ob1c.png) Bank row on, at the top, tag "PRO · 7 DAYS FREE".
| | Title / line | Score |
|---|---|---|
| A ✔ | **My bank or card** · "Finds them for you. US & Canada." | 8.5 |
| B | **My bank** · "Read-only, takes a minute." (today's) | 7 (can take longer) |

Show it only when the **App Store storefront** is US/CA (billing country, not phone language).

**a2 · Bank explainer** (Ditch screen, cream, no duck)
| | Copy | Score |
|---|---|---|
| A ✔ | **Your bank already knows.** "Connect it once. Ditch finds what you pay for and keeps an eye out for new ones." · ✓ Read-only. Ditch can't move money. · ✓ You sign in with your bank. We never see your password. · ✓ Disconnect any time in Settings. | 9 |
| B | **Find them in your bank** "We read your charges and pick out the subscriptions." + same 3 ticks | 7.5 |

Button: **Connect my bank** (8.5) vs "Find mine" (7). Second line: "Not now". Fine print: "US & Canada. Part of Pro: 7 days free, then $59.99/yr." Link: "What we see" → sheet: "Charges from the accounts you pick: name, amount, date. Not your balance or login. Charges pass through to your phone; we don't keep them."
A11y: each bullet is one VoiceOver element.

**a3 · Paywall** (pw-ob.png, same layout). Only the headline changes.
| A ✔ "Find every subscription in your bank." 8.5 | B "Start free. Then connect your bank." 7 |
|---|---|

Renewal line unchanged. Lifetime picked: fine line adds "Bank sync for the first year" (#67). × → exit offer → back to a1. After purchase the bank sheet opens straight away.

**a4 · Bank sheet** (Plaid's own). Set: our logo, US/CA, Transactions only, OAuth app-to-app (Chase signs in with Face ID; Plaid calls the gain "very large").

## (b) Connect from Find hub or Settings
- **Find hub** (find.png): new first card "**Your bank or card**" · "Finds them, then watches for new ones." Free → a2 → paywall; Pro → a2 → sheet.
- **Settings**: "Bank connections" row (see h).
- Pro with 0 banks: one Home card, once: "Connect the card that pays your subscriptions. New ones show up on their own."

## (c) Scanning
Real timing: last 30 days in ~10 s, full history ~1 min, sometimes 2+ min ([Plaid](https://plaid.com/docs/transactions/webhooks/)). The detector needs ~3 charges, so history matters.

Bank logo + 4 steps that tick for real (no percent bar):
1. Connected to Chase ✓
2. Reading the last 30 days
3. Going back further
4. Matching charges to services

Under it: "Found 4 so far" with logos dropping in (no prices here).

At 20 s: "Usually under a minute." + **Keep going** (onboarding continues; results wait on Home). At 3 min: "Chase is slow today. We'll finish in the background. Open Ditch later to see them."

Title: A ✔ "**Reading Chase…**" (8) vs B "Hang tight" (5). A11y: announce each step once.

## (d) Results
Like Rocket Money's overview ([Mobbin](https://mobbin.com/flows/4ba37e27-0d46-4505-8129-8f6c4e2377d9)) and Cleo's "Are any of these bills?" ([Mobbin](https://mobbin.com/screens/66afba88-a2e7-4d4b-8f95-caad6c21173c)), in our find-review style.

| | Header | Score |
|---|---|---|
| A ✔ | **Found 7 at Chase.** "We added the 5 we're sure about. 2 need a yes or no." | 9 |
| B | **7 subscriptions found** "Review them below." | 6.5 |

- **Added (5):** logo, name, price, proof line ("$17.99 on Sep 10, Oct 10, Nov 10 · next Dec 10"), a ✓ to untick (the Undo).
- **Check these (2):** "Patreon · $9.99 on Oct 3, Nov 3 · Subscription?" **Yes / No** (44pt each).
- **Trial ends** get the yellow chip: "Trial ends Nov 24".
- **"APPLE.COM/BILL" row:** "Apple bundles all its subscriptions into one charge. Screenshot your Apple list to split them." [Screenshot].
- Button: **Looks right** (8.5) vs "Add to my list" (7, the 5 are already added). Then the total reveal.
- Under it: "Pay some with another card? **Add it**" (cap 3).

## (e) Home after sync
Priority, one card at a time: Reconnect > Price change > Looks cancelled > Check these. If 2+ wait: "**From your bank · 3 to check**" opening a sheet.

**e1 · Auto-added** (later syncs). Toast at the bottom, like Wise's "Transaction hidden · Undo" ([Mobbin](https://mobbin.com/screens/3d0d5be6-d405-4ec9-ad94-e2a815e16248)):
| A ✔ "Added Max from your bank. $16.99 a month." [Undo] | 8.5 | B "New: Max. On your list." [Undo] | 7 |
|---|---|---|---|

The row gets the ink tag "FOUND IN YOUR BANK" for 7 days (#67 wording). Undo also lives forever on the detail screen ("Not a subscription? Remove") and never re-offers it. A11y: toast stays 8 s, or until dismissed with VoiceOver on.

**e2 · Check these** (unsure). Card title: A ✔ "**Are these subscriptions?**" (8) vs B "New this week" (6.5, says nothing). Rows with proof line + Yes / No.

**e3 · Charged today.** No card: the row reads "Charged $17.99 today ✓" until midnight, then rolls forward.

**e4 · Price change** (never silent).
| A ✔ "**Netflix charged $17.99, not $15.49.**" "From your Nov 10 bill." [Update to $17.99] [Keep $15.49] | 9 |
|---|---|
| B "**Netflix went up $2.50.**" [Update] [Ignore] | 7.5 (hides the real numbers) |

**e5 · Looks cancelled** (missed date + 7 days).
| A ✔ "**No Hulu charge since Oct 12.**" "It was due Nov 12. Cancelled?" [Mark ditched] [Still paying] | 8.5 |
|---|---|
| B "**Hulu looks cancelled.**" [Yes] [No] | 7 |

Mark ditched → normal Ditched row and "$X a year you won't pay" (never "saved"). Never auto-ditch.

## (f) Background notifications (local, from background refresh)
Max one a day, 9 AM–9 PM, bundled. Keep 4 of the 64 slots free.
| Event | A | B | Pick |
|---|---|---|---|
| Sure find | "Found a new one: Max, $16.99 a month. It's on your list." 8.5 | "Max charged $16.99. Added it. Not yours? Tap to undo." 8 | A |
| Bundle | "2 new ones from your bank. Take a look." 8 | "Ditch found 2 things worth a look." 6.5 | A |
| Unsure | "Patreon charged $9.99 twice now. Subscription?" 8.5 | "New charge to check." 5 | A |
| Price | "Spotify charged $12.99, not $11.99. Update it?" 9 | "Spotify's price went up." 7 | A |
| Cancelled | "No Hulu charge this month. Gone for good?" 8.5 | "Hulu might be cancelled." 7 | A |
| Reconnect | "Chase signed Ditch out. Reconnect to keep watching." 8.5 | "Your bank connection needs attention." 6 | A |
| Charged | "Netflix charged $17.99. Right on schedule." 8 | "Netflix payment detected." 5 | A, off by default |

## (g) Reconnect
Card at the top of Home (Copilot does "1 needs attention · Sign in", [Mobbin](https://mobbin.com/screens/c249e8cb-67cb-4d06-a431-7b728d51b95d)).
| A ✔ "**Chase needs you to sign in again.**" "Banks do this every few months. Your list and reminders still work." [Reconnect] [Later] | 9 |
|---|---|
| B "**Chase signed Ditch out.**" [Reconnect] | 8 |

- Reconnect opens the repair flow (often just a code). Success: "Back on. Caught up on 12 days." `LOGIN_REPAIRED` → card disappears.
- Fail: "Didn't work. Chase might be having a moment." After 2 fails, offer "Use a statement instead".
- "Later" hides it 3 days. Notify at the break and day 23 only.
- Day 23: "We'll disconnect Chase on Dec 20 if it stays signed out. Your list stays." Day 30: removed (cost rule).
- Bank consent expiring (`PENDING_DISCONNECT`, 7 days ahead): "Chase wants a fresh OK by Dec 3. Takes a few seconds." (Plum, [Mobbin](https://mobbin.com/screens/5c6070dd-7691-4491-b426-a6fe6472c27b))

## (h) Settings → Bank connections
Settings row "Bank connections · Chase" (amber dot if broken). Like Wealthfront ([Mobbin](https://mobbin.com/screens/8970f849-c032-4126-85a2-dd1906961593)) and Rocket Money ([Mobbin](https://mobbin.com/screens/9000063d-7ae6-46ef-a087-e44eff9e1887)):
- Each bank: logo, name, "Visa ••4821, Checking ••1005", status **"Checked 2 hours ago"** or **"Needs sign-in"**. Tap → detail: Connected Nov 19 · Reconnect · **Disconnect** (red).
- No "Check now" button (Plaid bills refreshes). Line: "Banks update a few times a day."
- **Add a bank or card** + helper: "Connect the card or bank that pays your subscriptions."
- 3 connected: button disabled, line A ✔ "3 is the limit. Disconnect one to add another." (8) vs B "You've reached the maximum." (5).
- Disconnect sheet: A ✔ "**Disconnect Chase?**" "Ditch stops checking Chase. Everything on your list stays." [Disconnect] [Cancel] (9) vs B "Are you sure?" (4).
- Footer: "What we see" (a2 sheet). Owner's call: also link my.plaid.com (honest revoke route, but names Plaid, #64).
- Your data: "Delete everything" also disconnects every bank.

## (i) Trial cancelled / Pro lapsed
Server removes the bank when Apple says auto-renew is off or Pro ended (#67). Next open, one card:
| | Copy | Score |
|---|---|---|
| A ✔ trial | "**Bank sync is off.** You cancelled the trial, so we disconnected Chase. Pro stays on until Nov 26. Everything we found stays on your list." [Turn it back on] [OK] | 9 |
| A ✔ lapsed | "**Bank sync is off.** Pro ended, so we disconnected Chase. Your list stays. Reminders are back to 3." [Pick my 3] [Get Pro] | 8.5 |
| B | "Chase is disconnected. Your list isn't going anywhere." | 8 |

Never guilt, never "we deleted", never hide found subs (rule 6).

## (j) Lifetime, year 2
30 days before month 12 ends: one Home card + one notification.
| A ✔ "**Your free year of bank sync ends Dec 19.**" "Keep it for $19.99 a year, or let it go. Pro stays yours either way." [Keep bank sync · $19.99/yr] [Let it end] · fine line "Renews yearly until you cancel. Restore" | 9 |
|---|---|
| B "**Bank sync is almost over.** Keep it?" | 6 (no price or date) |

If not bought: "Bank sync ended. Pro is still yours." No pre-select, no countdown.

## (k) Empty and error states
| State | Copy (pick) | Buttons |
|---|---|---|
| Outside US/CA | "Bank sync works with US and Canadian banks for now. Screenshots and statements work anywhere." | Screenshot · Statement |
| Bank not listed / user closed the sheet | A ✔ "**Didn't find your bank?** Some banks and credit unions can't connect yet. The card you pay subscriptions with might work." (8.5) · B "Bank not supported." (5) | Try another · Use a statement |
| Connection failed | "**Chase isn't answering.** That's on their end. Try again in a bit." | Try again · Use a statement |
| Nothing found (duck, empty state) | A ✔ "**Nothing repeating at Chase.** Your subscriptions might be on another card." (8.5) · B "No subscriptions found." (5) | Add another card · Screenshot Apple list |
| Trial user, bank failed | add: "Your trial still covers reminders on everything." | |

Never an error code or a dead end.

## App Review and privacy
- **Label:** Financial Info, Linked to You, App Functionality, not Tracking (#64). Check Purchases (receipt check) and User ID too.
- **Privacy policy (5.1.1(i)):** names Plaid, what's read, "transactions are not stored", token deleted on disconnect or lapse, how to revoke.
- **5.1.1(ii):** paid features can't require granting data: Pro must fully work with no bank.
- **5.1.1(ix):** submit as Grasp Labs LLC (already).
- **3.2.1(viii)** ("money management" apps by the institution): review note "Read-only tracker. Moves no money."
- **2.1 demo:** production has no test bank. A review code routes the install to Plaid Sandbox (`user_good`/`pass_good`, [Plaid](https://plaid.com/docs/sandbox/test-credentials/)) + a screen recording. Demo modes need Apple's prior OK: ask in the notes.

## Audit checklist (10/10 bar)
1. No Plaid on Ditch screens (except the owner's call in h).
2. Price and renewal date shown before the bank sheet.
3. Explainer: ≤3 bullets (read-only, can't move money, disconnect).
4. Bank row is hidden outside US/CA storefronts.
5. Real scan steps; "Keep going" at 20 s; background exit at 3 min.
6. No price animates; Reduce Motion shows the end state.
7. Every find shows its proof dates.
8. Undo in the toast and forever on the detail; undone finds never return.
9. Unsure finds are never added without a Yes.
10. No price change or ditch without a tap.
11. Apple's bundled charge points to the screenshot finder.
12. Only one sync card on Home at a time.
13. ≤1 bank notification a day, 9 AM–9 PM; 4 of 64 slots kept free.
14. Reconnect: one tap, no modal, no loop; reminders keep working.
15. Disconnect: 2 taps, says what stays, removed on the server at once.
16. Lapse messages say what happened, what stays, and the date.
17. Lifetime add-on shows price, date and "until you cancel" next to the button.
18. Every error has a next step (another bank, statement, screenshot).
19. 44pt buttons, VoiceOver reads money in words, Dynamic Type AX5, dark mode.
20. Copy has no "saved", "Oops", "seamless", "automatically finds everything".
21. 3-bank cap message has a way out. 22. Delete-all-data disconnects banks.

## Sources
Plaid: [Data Transparency Messaging](https://plaid.com/docs/link/data-transparency-messaging-migration-guide/), plus links inline. Complaint counts from unstar.app are a third-party Android US sample. More Mobbin: Cleo security link ([1](https://mobbin.com/screens/05cdb7d6-2cd1-4b85-89a4-3ec303759d6e)), Plum per-data consent ([2](https://mobbin.com/screens/8a45a4fb-10de-40a8-8f26-9ada5fbc28a0)), Lloyds "days left" ([3](https://mobbin.com/screens/8d0513bd-a25f-4140-a302-6e66d19e62c2)), Monarch connection actions ([4](https://mobbin.com/screens/d8097af4-ebbb-4d33-90ab-760f65c8706b)), Rocket Money Recurring + inactive ([5](https://mobbin.com/flows/7a92c84e-dfc6-42d0-89de-2397c5610732)), Wealthfront's Plaid pane ([6](https://mobbin.com/screens/35c5a0c8-6e3d-491f-addb-003303ad57bd)).
