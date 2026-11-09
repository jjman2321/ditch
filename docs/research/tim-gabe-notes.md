# Tim Gabe videos: what we take for Ditch

Owner sent these on Nov 9, 2026. Transcripts were pulled with TranscriptAPI. The first video's write-up is in `premium-states.md`.

| Video | Link |
|---|---|
| The Psychology of Premium Apps | https://www.youtube.com/watch?v=8EAYZe6y3I8 |
| I Studied 500+ Gamified Apps | https://www.youtube.com/watch?v=LXX_qOA5D8E |
| I Studied 10,000 Paywall Screens | https://www.youtube.com/watch?v=sYRhXB_ZcLI |
| Why People Trust Products That Look Made With Care | https://www.youtube.com/watch?v=pqWPKgfBDiw |

## 1. Gamified apps
- **Points, badges, leaderboards and streaks backfire.** LinkedIn, Foursquare and Google News all dropped badges. Streaks turn "I want to" into "I can't miss today", and regulators are now looking at them. **Ditch: no streaks, no badges, no points.**
- **Too many game features hurt.** Past a point, adding more lowers engagement (Habitica).
- **Anticipation → reveal → celebration** works when the reveal is real. **Ditch:** our one big moment is the yearly total. Build anticipation (your own logos add up), reveal (the number rolls), then a small, calm celebration.
- **Completion drive** (Apple's rings): people want to close an open loop. **Ditch:** "Reminders 2 of 3 set" naturally pulls toward 3 of 3. Real, not fake.
- **Competence over theater:** show that the user actually got better at the thing. **Ditch:** "Saved $431 a year since you started" in Ditched comes from real ditched subs, never from opening the app.

## 2. Paywalls (10,000 screens)
- **The first session is everything.** 82–89% of trial starts happen on install day. The onboarding paywall is the main one.
- **Trust before price.** Cal AI and Lose It spend screens explaining the trial: "No payment due now", the exact charge date, "we'll remind you before your trial ends". **For Ditch this is the product itself:** the paywall timeline is a Ditch reminder, a live demo of what we sell.
- **Honest beats hidden.** Blinkist added one clear "you'll be charged on X for Y" line: +23% conversion, −55% complaints, no change in churn. That backs Rule 4.
- **Structure over price.** The number of plans and how the trial works move revenue more than the price does. Test plan count and trial framing before touching price.
- **Higher prices can convert better.** Serious buyers self-select. Don't race to the bottom.
- **Weekly plans** now earn 55.6% of subscription revenue (his data). **We keep "no weekly plan" (locked in DECISIONS.md, Rule 4).** A weekly plan in a "stop wasting money on subscriptions" app would undercut the whole pitch. Only the owner can reopen it.
- **Test a lot.** Top apps run about 15 paywall tests a year. After launch, plan for RevenueCat Experiments.

## 3. Looks made with care
- People read the look as proof of whether anyone cared. "AI-made" labels cut how much effort people see.
- **High-trust areas (health, finance, law) must look the part.** Ditch handles people's money and their charge dates, so it's in that group.
- "Fine" is the floor: about 9 in 10 AI-built sites land in the same 6 looks. **Decide what premium means to our buyer first**: calm and warm, or sharp and fast?
- Use real references, a designer's rules (Emil Kowalski's skills, which we already use) and **one thing only we would make**.
- The website (ditchsubs.app) should be built from the app's real parts.

## Why the Total loop failed (owner: "garbage")
The Seedance clip shows the raccoon doing a cartoon double-take at a long receipt, looping forever.
1. **Wrong feeling for the audience.** The person has just learned they spend about $1,091 a year. A cartoon gasp reads as making fun of them. They need calm and "we've got this", not a reaction shot.
2. **It competes with the number.** The total is the star of the screen. A looping character beside it pulls the eye away, which breaks our own rule: "never moves near a price" (MASCOT-ROLES.md).
3. **It's not their data.** A generic receipt says nothing about *their* subscriptions. Tim's point: proof beats decoration.
4. **The loop never ends.** After the first second it's noise, and some frames (squinting) look grumpy.
5. **AI-video look in a money app** works against trust (video 3).

**What replaces it** (built in code, no video): the user's own picked logos drop in one by one, each with its yearly cost. The total rolls up digit by digit to $1,091 and a success haptic lands with it. Then everything stops and one calm line explains what Ditch will do about it. Whether a raccoon appears at all depends on `mascot-or-not.md`.
