# Motion and flow: a plan and an audit

Nov 18, 2026. Research only: no app code was changed.

**What this adds.** `docs/research/premium-white-motion.md` (Nov 9) set the taste: short, quiet motion, one big moment per flow. `design/v10/MOTION.md` set the first timings. Both are partly out of date: the stamp is gone (DECISIONS #58) and only the logo grows on hold now (#62). This doc does three new things:
1. It turns the rules into a small **motion system**, so every screen uses the same few motions.
2. It **audits the code** as it stands today.
3. It **ranks the fixes** by what they do for smoothness and conversion.

**Not reopened:** the onboarding notification cards springing in and the total line rising (#62), the Ditched moment's order (#58), You're set's item-by-item fade (#36).

**How it was researched:**
- Apple's HIG pages on Motion and Playing haptics, and WWDC23 "Animate with springs".
- Reanimated 4.7.1's own source in `node_modules`.
- Mobbin flows for Rocket Money, Copilot, Monarch, Opal, Headspace, Duolingo, Finch, Cash App, Revolut and Things 3.
- Every animation, haptic and timer in `src/`, found with grep and read in context.

**Limits:**
- Mobbin shows still screens, not video, so the motion in other apps is *inferred* from the order of the screens and from screens caught mid-transition.
- The web preview wasn't recorded. Its timing isn't the iPhone's, and the iPhone is what counts.

---

## The short version: top 8 fixes

| # | Fix | Why it matters | Effort |
|---|---|---|---|
| 1 | **Hold to ditch is instant with Reduce Motion on.** A 0.15 s touch ditches the row. | It's an accident waiting to happen, on our most important gesture, for exactly the people who asked for less motion. | S |
| 2 | **The Ditched moment starts late, and its buttons can be tapped while still invisible.** | Our signature moment should land the instant the ring closes. | S |
| 3 | **One shared press feedback, plus a highlight when you tap a row.** | Right now there are 7 different press styles and Home rows show nothing when tapped. Rows that don't react feel "web", not iPhone. | M |
| 4 | **Onboarding progress bar fixed at the top, filling as you go.** | Today it slides away with every screen. Opal and Monarch keep it still: it's the main "almost done" signal. | M |
| 5 | **Paywall is a step in onboarding, not a pop-up.** | A step from the right keeps the rhythm going. A sheet from the bottom reads as an ad. | M |
| 6 | **The total reveal waits for the screen to finish sliding in.** | The one big moment shouldn't half-play while the screen is still moving. | S |
| 7 | **Sheets that feel like iOS sheets.** | Drag from anywhere near the top, a flick closes with real speed, the dim follows your finger. | M |
| 8 | **No blank frame at launch.** | Keep the splash up until the list is loaded. | S |

The full list, with files and evidence, is in §5.

---

## 1. The motion system

### 1.1 Four named motions (and nothing else)

Put these in one file, `src/ui/sunflower/motion.ts`, and use them everywhere. Every value comes from Reanimated 4.7.1.

| Name | What it is | Numbers | Used for |
|---|---|---|---|
| **press** | Your finger is down | In: 80 ms ease-out. Out: 180 ms ease-out | Buttons scale to 0.97. Rows and cards get a tint behind them. Nothing else |
| **quick** | A state flips | `withTiming`, 160 ms, `Easing.out(Easing.cubic)` | Colour, opacity, ticks, bells, label crossfades, plan select |
| **settle** | Something arrives, leaves or changes size | `withSpring({ duration: 300, dampingRatio: 1 })` | Sheets opening, drag release, cards arriving, gaps closing |
| **stage** | A first-run or celebration screen builds up | Opacity plus at most an 8pt rise, 60–100 ms between items, done within 900 ms | Welcome, total reveal, reminders preview, You're set, Ditched moment |

**Why these numbers:**
- **One spring, no bounce.** Apple's SwiftUI presets are smooth (bounce 0), snappy (0.15) and bouncy (0.3) (WWDC23 "Animate with springs"). Reanimated's `dampingRatio` is about 1 − bounce, so `dampingRatio: 1` is Apple's "smooth". Bounce reads as playful. Our user is anxious about money and wants control, so "calm and sure" beats "fun". The duck's rise is the only thing with any character, and it already uses no overshoot (`Duck.tsx:2-5`).
- **Reanimated's spring `duration` is not the real time.** It's a "perceptual" duration, and the real tail lasts 1.5× longer (`node_modules/react-native-reanimated/src/animation/spring/springConfigs.ts:61`). So `duration: 300` *looks* done at about 300 ms. The Nov 9 doc's `duration: 400` really runs about 600 ms, which is too slow for sheets.
- **The press scale is 0.97**, the common premium-app value (Nov 9 doc §3 Buttons). Our `Button.tsx:79` uses 0.985, which you can't really see.
- **Under 300 ms for UI, under 1 s for a moment.** Nielsen: 0.1 s feels instant and 1 s keeps the flow. Apple: "don't make people wait for an animation to complete before they can do anything."

**Easing:**
- Keep `Easing.out(Easing.cubic)`, which the code already uses everywhere.
- Never use ease-in on something arriving.
- Ease-in is fine for something leaving (the sheet close, `Sheet.tsx:112`).

### 1.2 Rules every motion follows
1. **Nothing moves near a price** (CLAUDE.md rule 8):
   - Prices fade. They never slide, scale or count.
   - The one exception is onboarding's yearly total roll. It plays once per session, never overshoots, and VoiceOver reads the final value.
2. **Never on top of an action.** A button is tappable on the first frame, or it isn't tappable until it can be seen. It is never both invisible and tappable (see audit, `ditch/[id].tsx:74`).
3. **Start after the screen arrives.** A screen's `stage` begins when its push or fade ends, not when it mounts (see §1.4).
4. **Frequent things barely move.** Apple: "avoid adding motion to UI interactions that occur frequently." Bells, ticks and plan cards change colour (`quick`) and don't pop or wiggle.
5. **Transform and opacity only.** Never animate `height`, `width`, `top` or `margin`: they force a layout pass every frame.
6. **Every animation runs on the UI thread** (Reanimated shared values). No animation is driven by `setState` timers, except the 2-card reminders stack (approved, #62).

### 1.3 Screen transitions, by type

| Type | Transition | Today | Change |
|---|---|---|---|
| Drill-down (Settings rows, Find steps) | Native push from the right, swipe-back on | ✅ `settings/_layout.tsx:9`, `find/_layout.tsx:9` | None |
| Onboarding step | Native push from the right. **The progress header stays fixed**, outside the sliding screen | Push ✅. The header slides with each screen ❌ (`ProgressBar.tsx:35`, rendered inside every step) | Move the header into `onboarding/_layout.tsx` and fill the segment with `quick` |
| Paywall, **in onboarding** | A normal push step (step 5 of 5), with × going **forward** to You're set | Full-screen pop-up from the bottom (`_layout.tsx:93`); × and buy call `router.replace` out of the pop-up (`paywall.tsx:192,199`) | Push inside the onboarding stack |
| Paywall, **in the app** (Settings, teasers) | Full-screen pop-up from the bottom | ✅ | None |
| Sheets (editor, pickers, date) | Our sheet: open with `settle`, close with 220 ms ease-in, drag-to-close with velocity | 320 ms timing; drag only from a 24pt strip | See fix 7 |
| Ditched moment | Full-screen fade (it's a moment, not a place) | ✅ `_layout.tsx:95` | Start without waiting for the save |
| Onboarding done → Home | Fade | ✅ `_layout.tsx:94` | None |
| Tabs | None (iOS standard) | ✅ | None |
| Alerts | System alert | ✅ | None |

**Reduce Motion version of every row:**
- Pushes become fades. Already done for onboarding, Settings and Find.
- Pop-ups and sheets become a 150 ms fade.

**Evidence for "paywall as a step":**
- **Opal, Monarch, Rocket Money:** every onboarding question is a same-direction push, with progress fixed at the top. Opal has a segmented bar and Monarch has "Step 2 of 6" in the nav bar, and neither moves between steps ([Opal](https://mobbin.com/flows/91394aa7-8b77-461f-b95a-ad3f177e98f3), [Monarch](https://mobbin.com/flows/337e1f92-cc63-4c7f-8516-4b462dbb891c), [Rocket Money](https://mobbin.com/flows/fed2772b-6edd-432f-b195-0691f2d84d04)).
- **Copilot:** the paywall sits inside the onboarding run. Apple's purchase sheet is the only thing that comes up from the bottom ([Copilot](https://mobbin.com/flows/bec90a3f-1c1b-490a-b27d-8445cc6e62a7)).
- **Headspace** is the counter-example: a few steps show up as cards over the previous screen. Some screenshots catch the previous screen peeking above ([Headspace](https://mobbin.com/flows/31b21791-dec6-448a-8253-648f5ebbba3e)).
- **Why it matters for money:** RevenueCat's State of Subscription Apps reports that most trial starts happen on install day, inside onboarding. That's the moment the flow must not break.

### 1.4 Starting on time
Mount happens when the push *begins*. The native push takes about 0.35–0.5 s (the system decides). Anything timed from mount plays partly while the screen is still sliding.

**Fix:**
- Listen for the navigation `transitionEnd` event, or use a small `useScreenArrived()` hook that returns true once it fires.
- Start each `stage` from that moment.
- With Reduce Motion, or with no transition (a relaunch straight onto a step), it returns true at once.

### 1.5 Haptics map

Rule (Apple): one haptic, one clear cause, at the same moment as the visual. "Avoid overusing haptics." Keep the existing 600 ms guard between strong haptics (`haptics.ts:2`).

| Moment | Today | Proposed |
|---|---|---|
| Hold ring 25 / 50 / 75% | Selection ✅ `SubRow.tsx:144` | Keep |
| DITCHED tag lands | Heavy, 350 ms after the Ditched screen mounts, which comes after the save (`ditch/[id].tsx:75`, `(tabs)/index.tsx:74`) | Heavy, **≤ 200 ms after the ring closes**: open the screen first, save in the background, tag at 150 ms |
| Undo | Light ✅ | Keep |
| "I already cancelled" | Success ✅ | Keep |
| Total lands | Light ✅ `total.tsx:73` | Keep (it then lands *after* the slide, see fix 6) |
| You're set checklist | Success at 890 ms ✅ `done.tsx:73` | Keep |
| Import added | Success ✅ `find/review.tsx:66` | Keep |
| Toggle bell, tick a service, pick a day or plan | Selection ✅ | Keep |
| Free limit hit | Warning plus a ±3pt nudge ✅ | Keep |
| Paywall buy **tap** | Medium (`paywall.tsx:207`) | **None or Light.** Apple's purchase sheet takes over right away |
| Purchase **confirmed** (in the app) | None. It goes straight back (`paywall.tsx:196`) | **Success**, once StoreKit says yes |
| Delete | None ✅ | Keep none. Don't celebrate a loss |
| Sheet open/close, tab switch, scroll | None ✅ | Keep none |

### 1.6 Reduce Motion, and a Reanimated catch

**The catch, from the source.** In Reanimated 4.7.1, every `withTiming`, `withSpring`, `withDelay` and `entering` animation defaults to `ReduceMotion.System`. When the iPhone's Reduce Motion is on, the animation **jumps straight to its end on the first frame** and fires its "finished" callback at once (`node_modules/react-native-reanimated/src/animation/utilCommon.ts:474-486`). Three things follow:
- **Anything that uses an animation's end as a timer breaks.** Hold to ditch does exactly that (fix 1).
- **The "short fades for Reduce Motion" in our code never play.** They're instant:
  - the sheet's 150 ms fade (`Sheet.tsx:108`);
  - the Ditched moment's 200 ms crossfade (`ditch/[id].tsx:67`);
  - the total's `FadeIn.duration(150)` (`total.tsx:110`).
  That's acceptable ("show the finished state"). But Apple's own system swaps slides for **dissolves**, and a 150 ms fade on a sheet feels kinder than a pop. Pass `reduceMotion: ReduceMotion.Never` on those few deliberate fades only.
- **Use real timers for timing logic.** Never use an animation's end for it.

**What Reduce Motion does in Ditch:**
- Slides, scales, rises and springs: off. Show the end state.
- Pushes and pop-ups: 150 ms fades.
- The total: shows the final number.
- Haptics: kept wherever they confirm an action (hold ticks, ditch, limit).
- Hold to ditch: still takes the full 1.2 s. The ring fills in 4 steps.

### 1.7 Keeping it at 60/120 fps

| Thing | Status |
|---|---|
| ProMotion (120 Hz) unlocked: `CADisableMinimumFrameDurationOnPhone` | ✅ `app.json:19`. The frame budget is 8.3 ms at 120 Hz and 16.7 ms at 60 Hz |
| Animations on the UI thread (Reanimated) | ✅ All of them |
| Gestures | The hold and tap callbacks run on the JS thread (`SubRow.tsx:165,170`, `runOnJS: true`). Fine while the JS thread is idle. Worth moving the "lift" start into a worklet if holds ever feel late |
| Re-renders at the moment of an animation | Home re-renders **every** row when a hold starts (`holding`/`dimmed` props) and again when the list changes. No row is memoised (no `memo(` anywhere in `src/`). Wrap `SubRow` in `memo` with stable callbacks |
| Long lists | `FlatList` in the onboarding services list (`services.tsx:305`, about 226 services) and the add picker (`Picker.tsx:282`) has no tuning. Add a memoised row, `getItemLayout` (the rows have a fixed height), `initialNumToRender` ~12, `windowSize` ~7 (React Native docs, "Optimizing FlatList configuration") |
| Layout animations (`entering`, `LinearTransition`) | Used only on the 2-card reminders stack. Keep them off long lists: each one costs a native layout pass |

### 1.8 Count-ups, spinners and feeling fast
- **No count-ups near prices.** A rolling price is hard to read, looks like a slot machine, and makes an anxious reader ask "is that right?". The only one is onboarding's total, and it stays.
- **Totals change by snapping, not counting.** Home, Calendar, the Ditched tab and the pick bar already do this ✅.
- **Skeletons vs spinners:**
  - Our data is on the phone, so most screens should simply appear filled. No spinner for anything under about 400 ms.
  - Real work (reading a screenshot or statement) gets honest step text instead of a bare spinner, for example "Reading your screenshot…" then "Found 6". Never a fake "analysing…" (PLAYBOOK "Never").
  - When StoreKit prices arrive (M2): keep the price slots at their final size and keep the buy button disabled until prices load, so nothing jumps and no made-up price ever shows.
- **Optimistic actions.** The app already updates memory before saving (`state/app.tsx:193-195`). So screens can move on right away: there's no reason to `await` the save before navigating.

---

## 2. What the reference apps do

Inferred from screen order, not video.

| App | What we saw | Take for Ditch |
|---|---|---|
| **Opal** ([flow](https://mobbin.com/flows/91394aa7-8b77-461f-b95a-ad3f177e98f3)) | One question per screen. A segmented bar fixed at the top. Continue in the exact same spot on every screen. Calm text-only interstitials | A fixed progress header. CTA position never changes (ours is pinned ✅) |
| **Monarch** ([flow](https://mobbin.com/flows/337e1f92-cc63-4c7f-8516-4b462dbb891c)) | "Step 2 of 6" lives in the nav bar, not the content | The same idea: progress outside the sliding content |
| **Rocket Money** ([flow](https://mobbin.com/flows/fed2772b-6edd-432f-b195-0691f2d84d04)) | Brand splash → a full-screen "You've started your journey…" beat → questions, all pushes with a back arrow | One deliberate pause screen is fine, and our total reveal *is* that beat |
| **Copilot** ([flow](https://mobbin.com/flows/bec90a3f-1c1b-490a-b27d-8445cc6e62a7), [flow](https://mobbin.com/flows/92d7d390-97fc-485a-8fab-d9cf1acbd632)) | A pinned full-width bottom CTA. The notification step shows a sample notification above a toggle card. The paywall is in the flow; only Apple's sheet comes up from the bottom | Paywall as a step. Our lock-screen preview matches their pattern |
| **Headspace** ([flow](https://mobbin.com/flows/31b21791-dec6-448a-8253-648f5ebbba3e)) | Some steps are cards over the previous screen (caught mid-presentation) | Counter-example: possible, but it breaks the left-to-right rhythm |
| **Duolingo** ([flow](https://mobbin.com/flows/c199f9a9-7a91-4795-8ba5-5a3c24847009)) | The result banner rises from the bottom while Continue stays in the same place. Celebrations are their own full screens with one Continue | A celebration is its own screen, and the action never moves. Their confetti and bounce are too childish for us |
| **Finch** ([flow](https://mobbin.com/flows/80ef83ef-f872-4825-b18d-6b193d60a9aa)) | The pre-permission ask shows a sample notification plus the mascot. "You hatched a birb" is a full-screen moment | Same as our reminders step (duck plus their real reminder) ✅ |
| **Cash App** ([flow](https://mobbin.com/flows/5b503bce-f7a8-463d-8419-c36158cef0ea)) | Confirm in a bottom sheet → a full-screen black "Goal met" moment | A short, bold success screen after money moves. Our Ditched screen is this |
| **Revolut** ([flow](https://mobbin.com/flows/c8c4b7d9-8f9b-472e-85ac-bb78ac034355)) | Block subscription: confirm sheet → the result shows in place (struck-through price, status card). No celebration | Calm in-place state for the second visit ("Put it back" mode) ✅ |
| **Things 3** ([flow](https://mobbin.com/flows/995bee55-6669-4997-91c6-d3d3114452da)) | A touched or selected row gets a soft tinted highlight; a deleted row leaves in place | Home rows need a touch highlight (fix 3). New or removed rows: highlight and fade, no slide |

---

## 3. Audit: what the code does today

Verdict key: ✅ keep · 🟡 tweak · ❌ fix.

| Where | What it does | Verdict | Fix |
|---|---|---|---|
| `src/home/SubRow.tsx:138-142` | The ring fills over 1,200 ms; the animation's "finished" callback ditches the sub | ❌ | With Reduce Motion it finishes on frame 1, so a 150 ms press ditches. Pass `reduceMotion: ReduceMotion.Never` on this one, or time the ditch with a 1,200 ms timer and keep the ring purely visual |
| `SubRow.tsx:175` | Reduce Motion: 4-step ring | 🟡 | Never seen today because of the bug above. Works once fixed |
| `SubRow.tsx:137` | Logo lift spring, damping 20 / stiffness 220 (≈ 0.67 damping ratio, a small overshoot) | 🟡 | Use `settle` (no bounce): it sits right beside the name and price |
| `SubRow.tsx:144` | Selection ticks at 25/50/75% (JS timers) | ✅ | |
| `SubRow.tsx:118` | Other rows dim over 200 ms | ✅ | |
| `SubRow.tsx:170` | A tap opens the editor with **no visual press state** | ❌ | Tint the row on touch-down; fade it out over 180 ms (fix 3) |
| `(tabs)/index.tsx:73-76` | `await app.ditch()` (SQLite save, maybe a settings save), **then** opens the Ditched screen | ❌ | Open first, save in the background. The state is already updated before the save (`state/app.tsx:193`) |
| `ditch/[id].tsx:71-75` | Card fades in 220 ms; tag at 350 ms plus heavy haptic; amount at 750 ms; buttons at 950 ms | 🟡 | Tag and haptic at 150 ms, amount 400 ms, rest 550 ms. Done well under 1 s |
| `ditch/[id].tsx:74,235` | The buttons sit at opacity 0 but **can be tapped** for 0.95 s | ❌ | `pointerEvents="none"` until visible, or show them by 550 ms (rule 8, "never on top of an action") |
| `ditch/[id].tsx:67` | Reduce Motion "200 ms crossfade" | 🟡 | Really instant (§1.6). Fine, or use `ReduceMotion.Never` for a real 150 ms fade |
| `ditch/[id].tsx:80-86` | Price card and amount fade only | ✅ | Rule 8 done right |
| `ditch/[id].tsx:97-104` | "Did it go through?" 400 ms after returning to the app | ✅ | |
| `ditch/[id].tsx:134`, `(tabs)/ditched.tsx:186` | Review prompt 1.5 s after a win | ✅ | |
| `editor/Editor.tsx:315-318` | Ditch from the editor: starts the sheet closing, waits for the save, then opens the Ditched screen | 🟡 | Open first. Check on the iPhone that the full-screen fade never shows under a sheet that's still closing |
| `ui/sunflower/Sheet.tsx:108,112` | Open: 320 ms ease-out timing. Close: 220 ms ease-in | 🟡 | Open with `settle`. Close is fine |
| `Sheet.tsx:191-195` | Drag-to-close only from a 24pt grabber strip | ❌ | Make the whole top bar (grabber plus title row) draggable, and the content when it's scrolled to the top |
| `Sheet.tsx:143-144` | Release: closes past a third or above 900 pt/s; otherwise springs back (damping 22 / stiffness 260) | 🟡 | Hand the release speed to the close animation, so a flick keeps its speed |
| `Sheet.tsx:152` | The dim depends only on open/close, not on the drag | 🟡 | Fade the dim as you drag |
| `Sheet.tsx:122-127` | Follows the keyboard using its own duration | ✅ | Later: Reanimated's `useAnimatedKeyboard` tracks the keyboard frame by frame |
| `ui/sunflower/modalSlot.ts:10` | 60 ms gap between one sheet closing and the next opening | ✅ | |
| `onboarding/PlanSheet.tsx:51` | Tick lands, then the sheet closes 220 ms later | ✅ | A good pattern: reuse it for every single-choice sheet |
| `ui/sunflower/Button.tsx:78-79` | Press: opacity 0.86 plus scale 0.985, snapping instantly in and out | 🟡 | `press` motion: 0.97, eased out (fix 3) |
| About 30 `Pressable` styles in `src/` | Press opacity varies: 0.6, 0.7, 0.75, 0.8, 0.86, 0.9 | 🟡 | One shared `Press` component. Rows tint; buttons scale; icons 0.6 |
| `ui/sunflower/Controls.tsx:63` | Bell pops to 1.12, then a spring with damping 12 / stiffness 260 (≈ 0.37 ratio: a visible wobble) | ❌ | A frequent action: colour change only (`quick`), or at most 1 → 1.06 → 1 with no bounce. On Home the bell sits beside the price |
| `ui/sunflower/Duck.tsx:53-54` | Rises 12pt and fades, 420 ms ease-out, no overshoot; still with Reduce Motion | ✅ | |
| `ui/sunflower/RollingNumber.tsx:30` | Odometer roll, starts 250 ms after **mount** | 🟡 | Start after the push finishes (§1.4, fix 6) |
| `app/onboarding/total.tsx:73` | Light haptic when the last digit lands | ✅ | |
| `total.tsx:37-44, 76-77` | "a year." and the rest fade in and rise 6pt after the roll | ✅ | Approved (#62) |
| `total.tsx:224-228` | CTA pinned, visible from frame 1 | ✅ | |
| `app/onboarding/reminders.tsx:77` | Cards arrive at 400 ms and 1,300 ms (900 ms apart) | 🟡 | 400 + i × 600 ms. 2.2 s is long to wait before the duck shows |
| `reminders.tsx:146` | `FadeInDown.springify().damping(18)` (≈ 0.9 ratio) plus `LinearTransition` | ✅ | Approved (#62). The price is inside the card, and the card moves as a whole |
| `reminders.tsx:157` | Duck rises after the last card (400 + count × 900 ms) | 🟡 | Follows the new timing |
| `reminders.tsx:88-93` | "Turn on reminders" → system prompt → straight to the paywall | 🟡 | Optional: a 400 ms "Reminders on ✓" beat on grant before moving on. It confirms the win right before the ask |
| `app/onboarding/done.tsx:162` | Checklist fades in, 160 ms apart, 260 ms each | ✅ | |
| `done.tsx:73` | Success haptic once the list has landed | ✅ | |
| `app/onboarding/_layout.tsx:26` | Push; fade with Reduce Motion | ✅ | |
| `ui/sunflower/ProgressBar.tsx:35` | The progress header is drawn **inside** each step, so it slides away and back | ❌ | Fix 4 |
| `app/_layout.tsx:93` | Paywall is a full-screen pop-up from the bottom, for onboarding too | ❌ | Fix 5 |
| `app/paywall.tsx:192,199` | `router.replace('/onboarding/done')` from inside the pop-up | ❌ | It replaces a pop-up with a step from another stack, so the transition is unpredictable. Becomes a normal push once the paywall is a step |
| `paywall.tsx:207` | Medium haptic on tapping buy | 🟡 | None or Light (§1.5) |
| `paywall.tsx:206-219` | No "working" state while the purchase runs (only the 450 ms double-tap guard) | 🟡 | M2: the button label becomes "Starting your trial…" with a small spinner and stays disabled; Success haptic on yes |
| `paywall.tsx:243-262` | × visible on frame 1, prices still, duck rises once | ✅ | Matches rule 4 |
| `app/_layout.tsx:36-38` + `app/index.tsx:11` | Splash hides once **fonts** load; the start screen then shows nothing until the **database** loads | ❌ | Hide the splash once `ready` and `draftReady` are true (fix 8) |
| `app/add.tsx:26` | Waits 350 ms before opening the add sheet over Home | 🟡 | Wait for Home's transition end instead of a guess |
| `find/statement.tsx:81`, `find/apple.tsx:73` | A bare spinner while reading | 🟡 | Step text (§1.8) |
| `app/settings/which.tsx:44` | ±3pt nudge plus Warning at the free limit | ✅ | v10 spec. Small, and it explains itself |
| `app/(tabs)/_layout.tsx` | No tab animation | ✅ | iOS standard |
| `ui/sunflower/haptics.ts` | 600 ms guard between strong haptics | ✅ | |

**Flow notes that aren't animations:**
- **Ditch then back.** After Done on the Ditched screen, the row is already restyled as "ditched" on Home, because the list changed before the screen opened. That's fine, but it should look settled, not flash. Check on the iPhone.
- **New sub saved from the editor.** The row just appears. Nothing shows *which* row is new, so the list "jumps". Proposed: the new row fades in with a 600 ms sunflower tint that fades out (Things 3 style), with no sliding, so rule 8 holds. **Owner question:** when a row is deleted, should the gap close with a 200 ms `settle` (the rows move as blocks and no number changes), or snap shut? A snap is safer for rule 8; the glide is smoother. Score: snap 6/10, glide 8/10. Pick glide, but only if you're happy that whole rows (with their prices) move.
- **Keyboard:** sheets lift above the keyboard ✅; lists dismiss it on drag ✅ (`services.tsx:310`, `Picker.tsx:288`).
- **Dead time inventory:**
  - On purpose and fine: 220 ms tick-then-close and 60 ms between sheets.
  - Worth removing: the save before ditch, the 350 ms add wait, the 900 ms card gap and the blank launch frame.

---

## 4. Plain-language picture of "smooth" for Ditch

- **Tap anything and it answers in under a tenth of a second.** A tint or a slight press.
- **Moving between steps always slides the same way**, and the step bar stays still and fills.
- **Sheets come up quickly, settle without wobbling, and follow your finger down.**
- **Big moments, which are the total and the ditch, start the instant you've earned them**, finish within a second, and never make you wait to tap.
- **Prices never move.**
- **With Reduce Motion on, everything simply appears**, and nothing gets easier to trigger by accident.

---

## 5. Ranked fix list

Most impact on smoothness and conversion first. S is under 1 hour, M is half a day, L is a day or more.

**1. Hold to ditch must take 1.2 s even with Reduce Motion on.** · S
- **What:** don't let the ring animation's "finished" decide the ditch. Use `reduceMotion: ReduceMotion.Never` on the progress timing (the ring still shows 4 steps), or a separate 1,200 ms timer.
- **Why:** Reanimated skips animations under Reduce Motion and fires their callbacks at once (`utilCommon.ts:474-486`). So today a 0.15 s touch ditches. Accidental ditches break the trust our user comes for. It hits exactly the people who turned Reduce Motion on.
- **Files:** `src/home/SubRow.tsx`.
- **Check:** iPhone Settings → Accessibility → Motion → Reduce Motion on. A quick press on a row should open it; a hold of about 1 s should ditch.

**2. The Ditched moment lands at once, and its buttons are never invisible-but-tappable.** · S
- **What:**
  - Open the screen before saving.
  - Tag plus heavy haptic at 150 ms, amount at 400 ms, the rest at 550 ms.
  - `pointerEvents` off until the rest is visible.
  - Same in the editor's "Ditch it".
- **Why:** the haptic should match its cause (Apple: "a clear, causal relationship"). Today the gap is the save plus 350 ms. It's our signature moment and the App Store screenshot device (DECISIONS #58).
- **Files:** `src/app/(tabs)/index.tsx`, `src/app/ditch/[id].tsx`, `src/editor/Editor.tsx`.

**3. One press feedback for the whole app, plus row highlights.** · M
- **What:** a shared `Press` component on Reanimated:
  - buttons and cards scale to 0.97;
  - rows tint (`p.rowPressed`);
  - icons go to 0.6 opacity;
  - in 80 ms, out 180 ms.
  - Home rows, Calendar rows and Settings rows tint on touch-down.
- **Why:** there are 7 different press opacities today, and Home rows show nothing on tap. Rows that react are the single biggest "native" tell (Things 3). It reads as premium without adding any decoration.
- **Files:** new `src/ui/sunflower/Press.tsx`; `Button.tsx`, `Chip.tsx`, `PlanCard.tsx`, `home/SubRow.tsx`, `home/HomeParts.tsx`, `settings/Parts.tsx`, `editor/Picker.tsx`.

**4. Fixed onboarding progress header.** · M
- **What:** render the back chevron and the 4 segments once, in `onboarding/_layout.tsx`, above the sliding stack. The new segment fills with `quick` when a step arrives.
- **Why:** Opal and Monarch keep progress still. A bar that slides away with every screen reads as "another new screen", not "you're getting closer". Visible progress helps onboarding completion.
- **Files:** `src/app/onboarding/_layout.tsx`, `src/ui/sunflower/ProgressBar.tsx`, the 4 step screens (remove their `StepHeader`).
- **Watch:** the total step is yellow, so the header must be transparent and read on both cream and yellow.

**5. Paywall as the last onboarding step.** · M
- **What:**
  - In onboarding, push the paywall like the other steps.
  - × and buy push "You're set" (or replace inside the same stack).
  - In the app, keep the bottom pop-up.
- **Why:**
  - It keeps one direction of travel (Opal, Monarch, Copilot).
  - It removes the unpredictable `replace` out of a pop-up.
  - The trial ask then feels like part of setup, not an ad, and that's where most trials start (RevenueCat).
- **Files:** `src/app/_layout.tsx`, `src/app/onboarding/_layout.tsx` (or a route file `onboarding/pro.tsx` that renders the paywall), `src/app/paywall.tsx`, `src/app/onboarding/reminders.tsx`.
- **Honesty:** × stays visible on frame 1 (rule 4).

**6. The total reveal starts after the slide.** · S
- **What:** a `useScreenArrived()` hook (navigation `transitionEnd`). The roll starts 100 ms after it.
- **Why:** today a 250 ms start from mount means the first digits roll while the screen is still moving. The one big moment should land in front of still eyes.
- **Files:** new hook in `src/ui/sunflower/`, `src/app/onboarding/total.tsx`, `src/ui/sunflower/RollingNumber.tsx`. Reuse it for `reminders.tsx`, `done.tsx` and `ditch/[id].tsx`.

**7. Sheets that feel like iOS.** · M
- **What:**
  - Open with `settle`.
  - Drag from the whole top bar (and the content when it's at the top).
  - Close with the release speed.
  - The dim follows the drag.
  - With Reduce Motion, a real 150 ms fade (`ReduceMotion.Never`).
- **Why:** sheets are where most editing happens (add, edit, dates, prices). People try to swipe them down from anywhere.
- **Files:** `src/ui/sunflower/Sheet.tsx`.
- **Option (L):** Expo Router's native `formSheet` gives Apple's exact physics. It's a bigger move because of the one-sheet-at-a-time queue (`modalSlot.ts`).

**8. No blank frame at launch.** · S
- **What:** hide the splash only once fonts, `ready` and `draftReady` are all true.
- **Why:** the very first frame after the splash is empty cream. It's tiny, but it's the first impression, and on a slow first launch it reads as broken.
- **Files:** `src/app/_layout.tsx`, `src/app/index.tsx`.

**9. Purchase states (with M2 StoreKit).** · M
- **What:**
  - Price slots at their final size while products load.
  - The buy button is disabled until loaded, and shows "Starting your trial…" while Apple works.
  - Success haptic on yes.
  - No haptic (or Light) on the tap.
- **Why:** an unclear "did it work?" moment is where trust and trial starts leak. No price ever pops in or shifts (rule 4: clear price).
- **Files:** `src/app/paywall.tsx`, `src/services/purchases.ts`, `src/ui/sunflower/PlanCard.tsx`, `Button.tsx`.

**10. Calm the bell.** · S
- **What:** a colour change only (`quick`), or 1 → 1.06 → 1 with no bounce.
- **Why:** it's a frequent action (Apple: don't animate those), and the wobble sits next to a price.
- **Files:** `src/ui/sunflower/Controls.tsx`.

**11. Tighten the reminders preview.** · S
- **What:** cards 600 ms apart instead of 900; the duck follows.
- **Why:** 2.2 s to "done" on the step right before the paywall is long. It keeps the approved motion (#62).
- **Files:** `src/app/onboarding/reminders.tsx`.

**12. Honest steps instead of a spinner in Find.** · S
- **What:** "Reading your screenshot…" then "Found 6", with no fake progress.
- **Files:** `src/app/find/apple.tsx`, `src/app/find/statement.tsx`.

**13. Lighter Home renders.** · S
- **What:** `memo(SubRow)` with stable callbacks; tune both `FlatList`s (§1.7).
- **Why:** it keeps hold-start and sheet animations from dropping frames on long lists.
- **Files:** `src/home/SubRow.tsx`, `src/app/(tabs)/index.tsx`, `src/app/onboarding/services.tsx`, `src/editor/Picker.tsx`.

**14. New and removed rows.** · M
- **What:** a new row fades in with a 600 ms tint. Removal: fade out, then a glide or a snap (owner's pick, §3 flow notes).
- **Files:** `src/app/(tabs)/index.tsx`, `src/home/SubRow.tsx`.

**15. Write it down.** · S
- **What:** `src/ui/sunflower/motion.ts` (the 4 motions plus `useScreenArrived`).
- **Docs:** refresh `design/v10/MOTION.md`: drop the stamp and the row scale, and add §1.3 and §1.5 from here.

---

## 6. Sources
- Apple HIG, Motion: "Don't add motion for the sake of adding motion", "Let people cancel motion", "avoid adding motion to UI interactions that occur frequently", "Make motion optional". https://developer.apple.com/design/human-interface-guidelines/motion
- Apple HIG, Playing haptics: causal relationship, "complement other feedback", "match the intensity and sharpness of a haptic with… the animation", "Avoid overusing haptics", notification/impact/selection meanings. https://developer.apple.com/design/human-interface-guidelines/playing-haptics
- WWDC23, Animate with springs (duration and bounce; smooth, snappy and bouncy presets). https://developer.apple.com/videos/play/wwdc2023/10158/
- Apple, Optimizing ProMotion refresh rates (`CADisableMinimumFrameDurationOnPhone`). https://developer.apple.com/documentation/quartzcore/optimizing-promotion-refresh-rates-for-iphone-13-pro-and-ipad-pro
- Reanimated 4.7.1 source in this repo:
  - `src/animation/spring/springConfigs.ts:61` (spring duration is perceptual, real ≈ 1.5×);
  - `src/animation/utilCommon.ts:474-486` (Reduce Motion jumps to the end);
  - `src/animation/timing.ts:25` (default `ReduceMotion.System`).
- React Native docs, Performance and Optimizing FlatList configuration. https://reactnative.dev/docs/performance · https://reactnative.dev/docs/optimizing-flatlist-configuration
- Nielsen Norman Group, Response times: the 3 important limits (0.1 s / 1 s / 10 s). https://www.nngroup.com/articles/response-times-3-important-limits/
- RevenueCat, State of Subscription Apps (most trial starts happen on install day). https://www.revenuecat.com/state-of-subscription-apps/
- Mobbin flows, linked in §2.
- In-repo: `docs/research/premium-white-motion.md`, `design/v10/MOTION.md`, DECISIONS #36, #56, #58, #62.
