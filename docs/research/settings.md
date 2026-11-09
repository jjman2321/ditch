# Settings: research and a cleaner design

Nov 9, 2026. Looks at the v10 Settings render (`design/v10/renders/14-settings.jpg` and `d14-settings.jpg`), compares it with Settings screens from well-made iPhone apps on Mobbin, and recommends a calmer layout. Nothing is built yet. This needs the owner's OK first.

## TL;DR
- **Pick: Layout A, "health card + one short list".** One status card on top, then **8 rows** in 4 groups. Fits about one screen. Today's version has 18 rows in 5 groups and is about 1.6 screens tall.
- **Rename "Heads-ups" to "Remind me".** The value reads as a sentence: *Remind me: 3 days and 1 day before.* "Heads-up" stays where it already works: onboarding, the paywall and the notifications.
- Merge "Free reminders" into the Reminders group. Move Pro, data and legal behind one row each. Take the PRO tags off the top level.

## Why the current screen feels cluttered
What's on it: 18 tappable rows, 5 group headers, 3 footnotes, 2 yellow PRO tags, 3 rows with coloured text and 2 status icons.

1. **Two reminder sections.** "Reminders" and "Free reminders" are about the same thing, so the user reads two headers for one idea.
2. **Pro takes up 4 rows**, even for someone who never paid. "Plan: Free" and "Manage subscription: App Store" mean nothing to a free user.
3. **Too much yellow.** The two PRO tags, "Try Pro" and the check icon all pull the eye, so nothing stands out.
4. **Rows people rarely use sit on the main page.** Terms, Privacy, Export CSV and Rate are all one-time taps.
5. **"Delete all my data" sits in the middle**, between Currency and About. A destructive action shouldn't be one slip away from a common one.
6. **"Heads-ups: 3 days + 1 day" reads oddly.** "Heads-ups" is a noun, not something you set, and the "+" looks like maths.
7. **"Next 12 reminders scheduled"** is a number the user can't check. Showing the *next* one ("Netflix, Fri, Nov 13 at 9 AM") is easier to trust.

## What good apps do (Mobbin, iOS)
Not on Mobbin: Bobby, Flighty, Fantastical, Apple's own apps, and Duolingo's settings (searching for it returned avatar screens). Similar apps stand in for them below.

**How many rows on the top level.** Most well-made apps keep it to 6–10 rows and put everything else on a sub-page.
- [Things 3](https://mobbin.com/screens/fe872e1e-90a8-4409-a62f-8360b64d7080?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp): 10 rows in 2 groups, and every row opens a sub-page. Rarely used items sit behind "General" ([sub-page](https://mobbin.com/screens/f3a29be4-2c1b-4f83-9ca6-c5655b442a62?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)).
- [Brilliant](https://mobbin.com/screens/81350243-ef4c-4d4c-aab3-fb272d5f5e83?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp): 9 rows in 2 groups. "Legal" is one grey row with the version under it.
- [Revolut](https://mobbin.com/screens/ff9a098a-d3c2-4a8f-bd86-8714c55af083?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp): 3 cards, "About us" last, then "Version 10.71" and the company name in small grey text.
- [Arc Search](https://mobbin.com/screens/f765ff38-7958-44a1-93b4-b44557213d14?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) and [timespent](https://mobbin.com/screens/1d33bc84-8bd7-43c0-a07f-4124ee9d78c5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp): plain Apple-style grouped lists, with the value on the right and a short grey note under the group.

**Sub-pages explain themselves.** Things ([Appearance](https://mobbin.com/screens/f868a18e-8e80-4a67-a5d9-2e9fd8431de8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Calendar Events](https://mobbin.com/screens/2efdbbf6-3680-4fed-989b-858382191ec1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) and [Structured](https://mobbin.com/screens/ff98b7df-7094-419f-b52f-d42a25903d51?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) start each sub-page with one or two plain sentences, then the controls. That's how they keep the top level short without anyone getting lost.

**How the Pro or upgrade row looks.** There are three ways:
- *One quiet row:* [Raycast](https://mobbin.com/screens/ce01e84e-b5d5-4e57-ad14-0b4acd421369?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) has a slim "Raycast Pro · Try Free" bar plus "Subscription: Free". [Brilliant](https://mobbin.com/screens/81350243-ef4c-4d4c-aab3-fb272d5f5e83?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) has a single "Premium ›" row. [Revolut](https://mobbin.com/screens/ff9a098a-d3c2-4a8f-bd86-8714c55af083?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) has a small "Upgrade" pill in the header.
- *A plan card on top:* [Jomo](https://mobbin.com/screens/ecb928b5-6d8c-4677-9604-9ea5242a3525?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) shows "Annual (Trial), ends 8 Jul" with a Manage button. [Numo](https://mobbin.com/screens/8a4aa9b0-32fb-41eb-80ed-cafbcc4e1b08?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) does the same.
- *A big sales banner:* [Matter](https://mobbin.com/screens/af11de20-2de3-4031-9770-cd12d8af5a91?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Perplexity](https://mobbin.com/screens/debd04eb-9fd8-4d8d-ab66-9083e1bea668?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Opal](https://mobbin.com/screens/ca8fff07-00d7-4340-9796-1eb8daa4112a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) and [Ladder](https://mobbin.com/screens/d3ee84ac-d44a-4b95-bacf-a585c8861a70?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp). These are loud. [Joi](https://mobbin.com/screens/2597b305-1785-46a4-96f9-e6b12d96148b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) adds a Pro tag to 5 rows under its banner, which is the same tag clutter Ditch has now.
- *The Pro sub-page:* [Sunlitt](https://mobbin.com/screens/82b5b811-4580-40f9-8e03-ce357078d67d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) and [Ahead](https://mobbin.com/screens/f22a1c1c-fda3-4038-b0d1-3a12a3ec8332?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) show a plan card ("Next billing on…"), then Manage, Restore purchases and Lifetime. That's the right place for those rows.

**When notifications are off.** The best apps put a warning card at the top, with one button that opens iPhone Settings.
- [Telegram](https://mobbin.com/screens/24793c63-044a-4396-85aa-dc25d7812bea?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp): a red "!" card ("Turn ON Notifications", one sentence, "Turn ON in Settings"), with the normal settings below it. This is closest to what Ditch needs.
- [Etsy](https://mobbin.com/screens/e139cb91-9e0e-462f-b5b7-95b45400457e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) and [Phantom](https://mobbin.com/screens/735da2f0-92b6-4675-8686-638663d7e3cb?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp): grey out the controls that won't work. [Claude](https://mobbin.com/screens/5f83a1d7-0040-4572-82c6-f6c3515a2b32?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp): just an "Open Settings" row.
- None of them shows an "everything is fine" state. That's a gap Ditch can fill, since reliable reminders are its whole pitch.

**What reminder settings are called.**
- Apps that remind you about money write it as a sentence: [Ubank](https://mobbin.com/screens/f78c0ae3-c163-40e8-ada1-ff876f8ec077?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Remind me a day before it's due"; [Instacart](https://mobbin.com/screens/d6d045d9-31a4-4b2c-9cfc-0e5a23b9b9ae?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Get an email reminder 7 days before renewal".
- Bigger finance apps use a "Notifications" page that gets heavy fast: [Monarch](https://mobbin.com/screens/8f11db97-f25b-4dde-a608-6cefcda8fe24?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) has a row per alert type with channel chips; [Rocket Money](https://mobbin.com/screens/19666973-c111-4f85-bf55-3caeb8e263de?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) has collapsible groups.
- [Opal](https://mobbin.com/screens/ff22ffa6-d47e-4f5a-a06c-78bdaea733f6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) uses "Heads up 🙌" as the *notification title* and shows a preview of it on the settings page, but the setting itself is called something plain. That's the split we want: "heads-up" in the voice, plain words on the controls.

**Apps with no account, legal links and the version.**
- With no account, there's no profile header. Things, Arc and Bear open straight onto settings.
- Legal goes last, either as one row ([Brilliant](https://mobbin.com/screens/81350243-ef4c-4d4c-aab3-fb272d5f5e83?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) or inside a "Help & Privacy" page ([Rocket Money](https://mobbin.com/screens/ecc6aa6e-2e95-420d-8763-6456f0f981d3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)).
- The version is small grey text at the very bottom (Brilliant, Revolut), or a row inside About ([Copilot](https://mobbin.com/screens/e02e6dfd-3210-4217-9aa3-d0b76f1c12ab?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)).

**Cards or plain grouped lists.** The calm apps use Apple's style: white rounded groups on a tinted background. That's what Ditch already does on cream, so keep it. Only *one* thing gets a richer card: the item that matters most (a plan for Jomo, a warning for Telegram). [Ladder](https://mobbin.com/screens/d3ee84ac-d44a-4b95-bacf-a585c8861a70?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) puts every row in its own card, and it looks busy for it.

## Apple's guidelines that apply here
- **Few settings, good defaults.** Apple says to choose defaults that suit most people and keep the number of settings small. Ditch's defaults (3 days and 1 day before, 9 AM) already suit most people.
- **Grouped lists:** a short header for each group, a grey note under it to explain, the value on the right, and a chevron (›) only when the row opens another page.
- **Follow the phone's light/dark setting.** Apple's dark mode guidelines advise against an in-app appearance switch, so leave it out. Note: SPEC §3.5 lists "Appearance: system / light / dark". That's the owner's call.
- **Permissions:** don't ask a second time. Send people to Ditch's page in iPhone Settings (`Linking.openSettings()`).
- **Restore purchases** must be easy to find (App Review requires it). **Manage subscription** should open Apple's own sheet (`showManageSubscriptions`) without leaving the app.
- **Rate Ditch** should open the App Store review page (`…?action=write-review`). Apple says not to fire the system rating popup from a button, because it may not appear.
- **Delete:** red text, in its own group at the bottom of a sub-page, with a confirmation.
- **Time picker:** a small inline picker in the row ("9:00 AM" as a tappable pill), not a separate page.

## The label for reminder timing
Each option is scored out of 10: **clear** (would a normal person get it?), **fits Ditch** (matches the onboarding, paywall and the "Continue free: reminders for 3" button), and **tone** (short, dry, kind).

| Label | What the row reads | Clear | Fits Ditch | Tone | Total |
|---|---|---|---|---|---|
| Heads-ups (now) | Heads-ups · 3 days + 1 day | 5 | 9 | 7 | 21 |
| Reminders | Reminders · 3 days and 1 day before | 8 | 7 | 6 | 21 |
| **Remind me** | **Remind me · 3 days and 1 day before** | **9** | **8** | **9** | **26** |
| Notify me | Notify me · 3 days and 1 day before | 8 | 5 | 6 | 19 |
| Alert timing | Alert timing · 3 days, 1 day | 7 | 3 | 4 | 14 |
| Heads-up timing | Heads-up timing · 3 days + 1 day | 7 | 9 | 5 | 21 |

**Pick: "Remind me".**
- With the value, it reads as a full sentence. It's the same wording Apple Reminders uses and the one money apps use (Ubank).
- "Reminders" would repeat the group header right above it. And "Heads-ups" is the part the owner already said feels off.
- Keep "heads-up" as a noun in the voice: the onboarding headline, the paywall and the notification text. On settings controls, use plain words.
- Later, check the Calendar legend ("Heads-up") and list rows ("Heads-ups at 9:00 AM"); those should probably say "Reminder" too.

## Recommended: Layout A, "health card + one short list"
Header: large title "Settings", back button "Home". Then, top to bottom:

**1. Health card** (one rich card, no group header). Exact copy for each state:

| State | Icon | Title | Line under it | Button |
|---|---|---|---|---|
| All good | yellow ✓ | All good | Next one: Netflix, Fri, Nov 13 at 9 AM | Send me a test reminder |
| Nothing due yet | yellow ✓ | All good | Nothing to remind you about yet. Add a next charge date to start. | Send me a test reminder |
| None picked (Free) | yellow bell | No reminders picked | Pick up to 3 and you'll hear before they charge. | Pick 3 |
| Not asked yet | yellow bell | Reminders aren't on yet | Ditch needs your OK to send them. | Turn on reminders |
| **Off** (blocked) | orange ! | Reminders are off | Your iPhone is blocking them, so nothing can reach you. | Turn on in iPhone Settings |
| On, but quiet | orange ! | On, but quiet | Banners are off, so reminders slip into Notification Center without a sound. | Change in iPhone Settings |

- In the off state, *hide* the test button rather than greying it out. That's one less dead row.
- Home shows the matching nudge card ("Reminders are off. Turn on in Settings."), as SPEC already says.
- **Test reminder:** it arrives in about 5 seconds, even with the app open. The notification says: **"Test from Ditch. If you can read this, you're set."** The card then says "Sent. Check the top of your screen." for a few seconds.
- **Health check:** run it every time Settings opens and every time the app comes back to the front:
  1. Read the notification permission, including whether banners are off.
  2. Compare what's scheduled with what should be.
  3. If they don't match, quietly reschedule, then show "All good".
  4. Never show a raw count.

**2. Reminders group** (header "Reminders")

| Row | Value on the right | Opens |
|---|---|---|
| Remind me | 3 days and 1 day before › | Remind me page |
| Time | [9:00 AM] (inline picker, no chevron) | inline |
| Which subscriptions | 3 of 3 › (Pro: All 12 ›) | Which subscriptions page |

Note under the group:
- Free: "Free covers 3 subscriptions. Pro covers all of them, on your own timing."
- Pro: no note.

**3. Pro group** (no header)

| Row | Value on the right |
|---|---|
| Ditch Pro | Free: **Try free ›** (in the bold accent; this is the only yellow on the page). Trial: Trial, ends Nov 16 ›. Paid: Yearly › / Monthly › / Lifetime ›. |

**4. Your stuff group** (no header)

| Row | Value on the right |
|---|---|
| Currency | USD $ › |
| Your data | › |

**5. Help group** (no header)

| Row | Value on the right |
|---|---|
| Contact support | › (opens an email, with the version and iOS version filled in) |
| About Ditch | › |

**Footer** (small, grey, centred): "Your list stays on your phone." on one line, then "Ditch 1.0 (1)" under it.

That's 8 rows plus one card, 4 short groups, 1 note and no PRO tags. It fits on an iPhone 15 at default text size, with the footer just below the fold.

### Sub-pages (exact copy)
**Remind me**
- Intro: "When should Ditch remind you? Every reminder lands at your chosen time."
- Preview at the top, drawn like a real notification with the duck icon: "Netflix renews in 3 days. $17.99. Still watching?"
- Choices, with checkmarks: 2 weeks before · 1 week before · **3 days before ✓** · 2 days before · **1 day before ✓** · On the day.
- Free: the two defaults are ticked and locked. The others carry a small PRO tag, and tapping one opens the paywall.
- Note: "Pick as many as you like. Trial ends always get the 3 day and 1 day reminders."

**Which subscriptions** (Free)
- Intro: "Pick 3 to get reminders."
- A list of the user's subscriptions with check circles, biggest yearly cost first.
- Note: "The rest stay on your list with real dates and totals. You just won't get a reminder."
- Bottom row: "Get reminders on all of them" › (opens the paywall).
- Pro version: the same list with a switch on each row, all on by default.

**Ditch Pro**
- Plan card. Free: "You're on Free", "Reminders on 3 subscriptions". Pro: "Ditch Pro, yearly", "Renews Tue, Nov 16, 2027".
- Button (Free only): "Try Pro free for 7 days".
- Rows: Restore purchases · Manage subscription (Pro only; opens Apple's sheet).
- Note: "Lifetime is a one-time $49.99 for Pro. Cancel a subscription anytime in iPhone Settings → Apple ID → Subscriptions."

**Currency**
- A searchable list.
- Note: "For new subscriptions. Ones you've already added keep their own currency."

**Your data**
- Intro: "Your list stays on your phone. No account, no bank link."
- iCloud backup: Off › (PRO tag). Per SPEC, hide this until M4.
- Export as spreadsheet (CSV).
- A separate group at the bottom: **Delete all my data** in red.
  - Note: "Deletes your list from this phone. It doesn't cancel any subscriptions, including Ditch Pro."
  - Confirmation: an alert titled "Delete everything?" with buttons "Delete" (red) and "Keep it".

**About Ditch**
- Duck icon with "Ditch" and "Ditch it before it renews."
- Rows: Rate Ditch · Follow @ditchsubs · Terms · Privacy.
- Footer: "Version 1.0 (1) · Grasp Labs LLC".

## Two alternatives
**Layout B, "doors only"** (Things, Brilliant).
- Health card, then 5 rows that each open a page: Reminders › · Ditch Pro › · Your data › · Contact support › · About Ditch ›.
- The cleanest-looking option. But timing and time, the settings people actually change, move one tap deeper, and the top level reads like a menu rather than settings.
- **7/10.**

**Layout C, "plan card on top"** (Jomo, Opal, Matter).
- A Pro card first ("You're on Free. Reminders on 3 of 12. Try Pro free for 7 days"), then Layout A's list.
- Probably makes more money. But it pushes the sale above the thing people come to Settings to check (are my reminders working?), it fights the honest-paywall rule, and it adds back the yellow the owner called cluttered.
- **5/10.**

**Pick: Layout A (9/10).**
- It shows what matters most first: whether reminders work, and a way to prove it.
- It keeps the 3 controls people change on the main page, has one quiet way into Pro, and hides the once-a-year stuff.
- What keeps it from a 10: "Contact support" and "About Ditch" could share a row, but support is worth one-tap access. A support email beats a 1-star review.

## Next steps (for the owner)
1. Approve the label ("Remind me") and Layout A, or pick B or C.
2. Decide whether to drop "Appearance" from SPEC §3.5.
3. Then: redraw renders 14 and d14 (plus the off and test-sent states). After that, update SPEC §3.5 and add a "Settings" section to `docs/MANUAL-TESTS.md`.

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
