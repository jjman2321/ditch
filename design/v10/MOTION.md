# Ditch v9: motion spec

The rules: motion is short and confirms something real. Nothing moves next to a price while you read it, except the one digit-roll that reveals a total. Haptics only mark meaningful actions. Every animation has a Reduce Motion version.

Durations are in milliseconds. "Spring" means a critically damped spring (Reanimated `withSpring`, `damping: 20, stiffness: 220` unless noted). Haptics use `expo-haptics`.

## 1. Total digit-roll (screen 3, Your total; also the Home total on first load)
- **What:** each digit of `$1,091` rolls up from 0, like an odometer. The digits settle left to right, 40 ms apart.
- **Timing:** starts 250 ms after the screen arrives. Each digit rolls for 700 ms, ease-out `cubic-bezier(.2,.8,.2,1)`. The whole thing finishes by about 1,150 ms.
- **Then:** "a year." fades in over 200 ms, with a 6 pt upward slide. The month/day split and the "Where it goes" card fade in together 120 ms later. The share bars grow from 0 to their width over 500 ms, staggered by 40 ms.
- **Haptic:** one `impactAsync(Light)` when the last digit lands.
- **Rules:**
  - The number never overshoots and never counts past the real value.
  - Tabular figures, so the width stays fixed while the digits roll.
  - Plays once per session.
- **Reduce Motion:** the final number appears right away with a 150 ms fade, the bars show at full width, and there's no haptic.

## 2. Hold to ditch (Home)
- **Start:** after 150 ms of press, the row lifts in place. It scales 1.0 → 1.02 and gets a shadow, over 180 ms with a spring. In light mode the background goes cream → sunflower; in dark mode it gets a 1.5 pt sunflower border. The other rows dim to 55% over 200 ms.
- **Ring:** a 4 pt ring around the logo fills clockwise over **1,200 ms**, linear, so it feels predictable. In light mode it's ink on a white track; in dark mode it's sunflower on a 16% white track.
- **Haptic ticks:** `selectionAsync()` at 25%, 50% and 75% (300, 600 and 900 ms). `notificationAsync(Success)`, a firm tap, at 100%.
- **Let go early:** the ring drains back over 250 ms, the row settles back over 200 ms, the other rows return to full colour, and nothing changes. There's no haptic on cancel.
- **The consequence box** ("Keep holding to ditch Netflix. Saves $215.88 a year. Let go to keep it.") fades in at 0 ms with the lift. The price itself never moves.
- **Reduce Motion:** no scale or shadow change. The ring still fills, because it's the only feedback for the gesture, but as a stepped 4-segment fill instead of a smooth sweep. The haptics stay.

## 3. The stamp lands (screen 10, Ditched)
Order after the hold completes (t = 0 is the Success haptic):
1. **0–220 ms:** the Netflix row flies up into place as the struck-through card at the top. The strike line draws left to right over 180 ms.
2. **120–360 ms:** the duck peeks up from behind the card (see 4).
3. **260 ms: the stamp.** It starts at scale 1.4, rotation −2° and opacity 0. Over 160 ms it scales to 1.0 with ease-in `cubic-bezier(.5,0,.9,.4)`, so it feels like it's being pressed down. Rotation settles −2° → −6° with a spring (`damping: 14`) over 260 ms.
   - **Haptic:** `impactAsync(Heavy)` at the moment it hits scale 1.0 (about 420 ms).
   - **Ink:** the stamp's opacity steps 0 → 0.85 at impact, then to 1.0 over 120 ms, so it looks like ink soaking in.
4. **520 ms:** `$215.88` fades in (no roll). This is a result, not a reveal, and nothing moves near it once it's shown. "a year you won't pay." follows 80 ms later.
5. **700 ms:** the New total line, the "You're saving $431 a year" strip and the cancel row fade up together (6 pt, 220 ms).
- **Undo:** in reverse. The stamp lifts (scale 1.0 → 1.2, fades out over 180 ms) and the screen closes back to Home with the row restored. Haptic `impactAsync(Light)`.
- **Reduce Motion:** everything is shown at once with a 200 ms crossfade. The stamp appears at its final rotation. The heavy haptic stays, because it confirms the action.

## 4. Duck peek (brand moments only)
- **Where:** Welcome (1), Reminders pre-ask lock screen (5), Paywall (6), You're set (8 and 8b), Ditched (10) and the empty Home (11). Never on Home, Calendar, the Ditched tab or Settings.
- **What:** the duck sits behind its card's top edge and rises 14 pt into its resting peek over 420 ms, spring (`damping: 16, stiffness: 180`). Then one blink, eyes scaling to 10% height for 90 ms, 600 ms later. That's it: no idle loops.
- **Timing:** it starts 200 ms after the screen's main content has landed, so it never competes with the headline or a number.
- **Rules:** the duck never moves while a price is changing on screen. On Ditched it finishes its rise before `$215.88` appears.
- **Reduce Motion:** the duck is shown at rest. No rise, no blink.

## 5. Small things
- **Plan selection (paywall):** the radio fills over 120 ms. The selected border goes from 1.5 to 2.5 pt with no layout shift. `selectionAsync()`.
- **Bell toggle (Which 3, Settings):** the bell fills with sunflower over 150 ms and scales 1 → 1.12 → 1 (spring). `selectionAsync()`. If a 4th is tapped on free, the badge "Reminders 3 of 3" does a 2-cycle horizontal nudge (±3 pt, 240 ms) and `notificationAsync(Warning)`.
- **Date sheet (4b):** a standard iOS sheet. Picking a day fills the sunflower circle over 120 ms, and the heads-up line under the grid updates with a 150 ms crossfade.
- **Calendar day tap:** the selected day's fill moves to the new cell over 200 ms with a spring. The list below crossfades over 150 ms.
- **Reduce Motion (all of the above):** state changes are instant or a ≤150 ms fade. Haptics stay where they confirm an action.

## Haptic map
| Moment | Haptic |
|---|---|
| Total lands | Light impact |
| Hold ring 25 / 50 / 75% | Selection tick |
| Hold complete | Success notification |
| Stamp hits | Heavy impact |
| Undo | Light impact |
| Toggle a bell / pick a plan | Selection |
| Hit the free 3 limit | Warning notification |
