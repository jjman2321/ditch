> **Superseded on Nov 9, 2026:** the owner dropped the mascot (DECISIONS #4, #5; `docs/research/mascot-or-not.md`). Ignore every raccoon or mascot instruction below; the rest still applies.

# Onboarding plan

Status: **plan, waiting for the owner's go-ahead** (Nov 9, 2026). Mockups come after approval.

## Goal
A new user sees their **real yearly subscription total** and has **reminders set before their next charges** in about 90 seconds. No account, no survey, and no permission or payment ask before they've seen the value.

- **Who:** first launch only. The flow is resumable, so a force-quit continues where they left off.
- **What it collects:**
  - the subscriptions they pay for (each one is saved),
  - rough charge dates,
  - notification permission,
  - optionally Pro.
- **Rules that apply:** Apple 3.1.2 (honest subscription terms) and 5.1.1 (don't force a permission). The rules in `CLAUDE.md`.

## What real apps do (Mobbin)
| App | Flow | Takeaway |
|---|---|---|
| [Orbit onboarding](https://mobbin.com/flows/340b7fb6-8b5d-416c-9f9f-501a27d669bc) | Welcome → tick list with prices → "See my yearly total" → Home. Imports sit in a "Get started guide" on Home. | The closest match, and proof the tick-list idea works. It's only 3 steps. Its tick list has **no search, no categories and no running total**, so there's room to do better. |
| [Rocket Money onboarding](https://mobbin.com/flows/fed2772b-6edd-432f-b195-0691f2d84d04) | 10 screens: savings-goal survey, legal name, then account. | The opposite of what we want: questions before any value. |
| [Monarch](https://mobbin.com/flows/337e1f92-cc63-4c7f-8516-4b462dbb891c), [Origin](https://mobbin.com/flows/c3a6fc47-bd8c-4587-bd6c-6e26103d7763) | 18–19 screens: email code, "what brings you here", personal details. | Same problem. The surveys don't change anything for the user. |
| [Viator](https://mobbin.com/screens/d179248b-a66b-44c0-be7d-70f2bb901873), [Tiimo](https://mobbin.com/screens/4a21582b-e050-4b2f-898d-bd63e8ff6495), [Once](https://mobbin.com/screens/a29830fb-bc8f-4410-a7d1-18d999b7ad37) | Phone mock with an example notification, "Turn on", "Not now". | Show the notification before asking. Ours goes further: **the example uses their own subscription.** |
| [Nibble](https://mobbin.com/screens/e722f5a0-b638-4060-86cc-2a05426b3f17), [5 Minute Journal](https://mobbin.com/screens/0b03c06a-63c8-43dd-87ed-58fecc57f0a1), [Vocabulary](https://mobbin.com/screens/32238af5-552f-4ac3-bede-16981f4c23d3), [Copilot](https://mobbin.com/screens/b6ba77c0-7d8f-423e-8453-9db2a97f8035) | Trial timeline: Today → reminder day → charge day. | Most say "Day 5". Vocabulary uses **real dates**, which is clearer, so we do that. Copilot has a visible **Skip**. 5 Minute Journal has a visible ×. |
| [Brilliant](https://mobbin.com/screens/b54bafbc-2547-4959-91e5-a3aacf0c3f43), [Brainly](https://mobbin.com/screens/ad250cf9-f524-4ca5-be8b-cc9e7750d183) | Mascot welcome: one character, one line, one button. | Keep the mascot moment short. |
| [BitePal](https://mobbin.com/screens/6d91ec2c-3183-4a94-bc91-e60724edaf4c) | Grey/black raccoon with a big toothy grin. | **What ours must not look like:** no grey/black palette, no teeth, no big-head sticker style. |

**Pattern:** the best ones show value in the first 30 seconds and ask for permission and payment only after. The finance apps that open with surveys and accounts are the ones people complain about.

## The flow
`1 Welcome → 2 Tick → 3 Reveal → 4 Dates → 5 Reminders → 6 Paywall (M2) → [7 Pick 3] → Home`

- A thin progress bar on screens 2–5.
- Back works everywhere and keeps everything entered.
- Each step is saved to the database as it's done.

### 1 · Welcome
- **Shows:** the raccoon flicks a subscription card into a bin, once (static with Reduce Motion). Headline, one line of body text, and "Get started".
- **Small print:** "Free. No account. Your list stays on your phone."
- **Way out:** none needed. There's no Restore here: no account means nothing to restore yet, and Restore lives on the paywall and in Settings.

### 2 · Tick everything you pay for
- **Top:** search field, then category chips (Streaming · Music · AI & apps · Cloud · Shopping · Fitness · News · Gaming).
- **Rows:** logo, name, typical price ("~$15.49/mo") and a big tick circle. The whole row is the tap target.
  - Tap the price to change the plan or amount. For example, Netflix has 3 plans.
- **Last row:** "Something else?", which opens a quick custom add (name, price, cycle).
- **Sticky bottom bar:** "6 ticked · about $1,240/yr", updating live, plus a **Next** button. *Orbit doesn't have a running total. Ours lets the number build up as you tick.*
- **Way out:** "Skip" top right. With 0 ticked, Next becomes "Skip for now".
- **States:** a search with no result offers "Add '[text]' as custom".

### 3 · Reveal: "That's $1,284 a year. Ditch it."
- **Big number:** counts up over about 1s (static with Reduce Motion).
- **Under it:** "$107 a month across 8 subscriptions."
- **Biggest 3:** logo, name, yearly cost.
- **Small cheeky raccoon** peeking out of the bin. It sits away from the button.
- **One sourced line:** "In 2022, people guessed they spent $86 a month. It was really $219." (C+R Research)
- **Main action:** "Let's fix that".
- **Several currencies:** one line per currency, never added up.
- **Estimates:** "about" stays on the number until prices are confirmed.
- Skipped if 0 were ticked.

### 4 · Dates: "When does each one charge?"
- One card per subscription, biggest first, with a **day-of-month grid (1–31)**. One tap saves and moves to the next card.
- Yearly subs get a month + day picker. Weekly subs get a weekday picker.
- "Not sure" skips that card. "Finish later" skips the rest: they show on Home as an "Add dates" card.
- About 1 tap per sub, so 8 subs take about 15 seconds.
- **Why it's here:** reminders and the upcoming list both need dates, and asking right after the total feels natural ("ok, when do they hit?"). It also lets the next screen show a real date.

### 5 · Reminders
- **Phone mock** with 2 notifications built from **their** data, e.g. "Netflix renews in 3 days · $15.49" and "Spotify renews tomorrow · $11.99".
- **Body:** "3 days and 1 day before, at 9am. Change it anytime."
- **Main action:** "Turn on reminders", which opens the iOS prompt. **"Maybe later"** is right under it.
- **If denied, or Maybe later:** carry on. Home shows "Reminders are off" with a fix button. No nagging.
- With 0 subs or 0 dates: the mock uses an example labelled "Example".

### 6 · Paywall (built in M2; M1 skips straight to 7)
- **× visible from the first frame**, top right.
- **Headline:**
  - more than 3 ticked: "Get a heads-up before all 8 renewals."
  - otherwise: "Ditch Pro".
- **4 benefit rows:**
  - reminders on everything,
  - import from screenshots and statements,
  - home-screen widget,
  - iCloud backup.
- **Plans:**
  - **Yearly $29.99, pre-selected:** "7 days free, then $29.99/yr ($2.50/mo)".
  - Monthly $4.99.
  - Lifetime $49.99, with the separate-plan note for bank sync.
- **Timeline with real dates:**
  - **Today, Nov 9:** "Pro unlocked. $0 today."
  - **Sat, Nov 14:** "We remind you. It's already in your Ditch list."
  - **Mon, Nov 16:** "$29.99 charged unless you cancel."
- **Main action:** "Start 7-day free trial".
- **Free action:** "Continue free: reminders for 3", or plain "Continue free" with 3 or fewer.
- **Footer:** Restore · Terms · Privacy · "Cancel anytime in Settings → Apple ID → Subscriptions".
- **Not trial-eligible:** "Subscribe for $29.99/yr" and no timeline.

### 7 · Pick 3 (sheet; only when free with more than 3 subs)
- "Pick 3 for reminders": the 3 biggest yearly ones are pre-ticked.
- A counter shows "3 of 3". Ticking a 4th asks which one to swap.
- **Done** finishes onboarding. You can change the picks anytime, for free.

### Home (first visit)
- The real total and the upcoming list, straight away.
- One quiet toast: "All set. Next up: Netflix on Thu."
- No coach marks or tours.

## Copy options (score /10, ★ = my pick)
**Welcome headline**
| Option | Score | Why |
|---|---|---|
| ★ "Ditch it before it renews." | 8.5 | Same as the App Store subtitle. Says the job and has the brand verb. |
| "Stop paying for stuff you forgot about." | 8 | Punchy and true. Slightly negative. |
| "See what you're really paying for." | 7 | Clear, but it doesn't mention reminders. |
| "Every subscription. One list. No surprises." | 6 | Sounds like a slogan, which you said you don't want. |

Body: "Track every subscription, get a heads-up before each charge, and cancel what you don't use."

**Tick screen title**
| Option | Score |
|---|---|
| ★ "Tick everything you pay for" | 8 (plain instruction, from DECISIONS) |
| "What are you paying for?" | 7.5 |
| "Let's find your subs" | 6 ("find" suggests we detect them automatically, which we don't) |

**Reminder headline**
| Option | Score |
|---|---|
| ★ "We'll warn you before it charges" | 8.5 (concrete, human) |
| "Get a heads-up before you're charged" | 8 |
| "No more surprise charges" | 7 (a promise we only half control) |
| "Never miss a renewal" | 5 (every app says it) |

**Reveal button**
| Option | Score |
|---|---|
| ★ "Let's fix that" | 8 |
| "Set charge dates" | 7 (accurate, but flat) |
| "Next" | 5 |

## Decisions for the owner
1. **The Dates step (screen 4).** I recommend it: one tap per sub, skippable. Without it, reminders can't work until the user goes back and adds dates.
2. **Copy picks** above. Say "go with your picks" or swap any of them.
3. **Canadian users:** catalog prices are in US$ at launch, shown as "about US$15.49", with the currency switchable per sub. CAD catalog prices come later.
