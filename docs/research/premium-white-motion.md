# Premium white + motion: research for onboarding and paywall

Nov 9, 2026. Direction: **premium white with strong structure** (`design/premium-white/*.jpg`).

**Builds on, doesn't repeat:**
- `docs/design/PLAYBOOK.md`: the flow, copy rules and the "never" list.
- `docs/design/AUDIT-premium-white.md`: layout fixes, data errors and the first token sheet. This doc refines those tokens. Where it disagrees, it says so.
- `docs/design/MASCOT-RESEARCH.md` §4.8: the raccoon's flick, idle loop and tool choice (Reanimated + SVG now, Rive later).
- `docs/research/*.md`: the per-app teardowns.

**How it was researched:**
- 11 Mobbin searches (10 screen searches, 1 flow): Bevel, Lightyear, Copilot, Revolut, Things 3, Opal, Arc Search, Glow, AllTrails, Neo and success screens. I looked at every image.
- Apple's HIG pages (Motion, Typography, Materials), read from Apple's own JSON.
- WWDC23 "Animate with springs".
- Emil Kowalski's skills repo (`animate-expo`, `apple-design`, `choreograph`, `emil-design-eng`).
- Reanimated 4.7.1 source and docs, plus the expo-video docs.
- RevenueCat, Adapty and Superwall on paywall motion and video.
- Rive and Lottie case studies.
- Video encoding threads.

**What the project already has:** Expo SDK 58, React Native 0.88 (New Architecture), Reanimated 4.7.1, worklets 0.13, expo-haptics, expo-symbols, expo-linear-gradient and expo-glass-effect. `expo-video` is **not** installed.

---

## 1. Top 12 rules

1. **Structure makes white look premium; decoration doesn't.** Bevel, AllTrails, Neo and Things look premium because of four things:
   - one strict margin;
   - a strong type contrast (big black Bold against small grey Regular);
   - tonal fills instead of borders;
   - at most **one** raised object per screen.

   Empty white with uneven gaps looks unfinished, not premium. *(Mobbin: [Bevel paywall](https://mobbin.com/screens/87ac5af9-7c7a-46b8-8a82-ad8c90bf574c), [AllTrails paywall](https://mobbin.com/screens/0e508882-f772-497d-959e-d51095983ef1), [Neo](https://mobbin.com/screens/0f8fe29c-bc7c-4723-b20e-7e780e8658f5), [Things 3](https://mobbin.com/screens/45fc38f9-b3e9-4b3e-87f0-4f2f97fbc69c).)*
2. **Use one white model per screen.** There are two, and mixing them on one screen looks muddy.
   - **Model A:** a pure `#FFFFFF` page with `#F5F5F7` grey groups. This is Apple marketing, AllTrails, Glow and our mockups. Use it for onboarding and the paywall.
   - **Model B:** a `#F2F2F7` grey page with white cards. This is iOS Settings and Health, Things, Copilot and Bevel's home. Use it later for in-app lists if needed.

   *(Mobbin: [Glow](https://mobbin.com/screens/b92dfcad-1b54-46fd-ba7f-fb6ab7223b57), [Copilot](https://mobbin.com/screens/ff90e0de-a9f0-494e-9323-8c5f8530bbf1), [Bevel home](https://mobbin.com/flows/9073b621-c34b-4308-b1e2-2658f4d549b6).)*
3. **Colour belongs to the content, not the frame.** The frame (background, buttons, text) uses a black CTA, greys and one teal accent. The colour comes from what's shown: service logos, the raccoon and one 3D object. Lightyear keeps its colour *inside* shapes (a glass sphere, ribbed cards) and never paints the page with it. Revolut, Opal and Arc Search are dark or saturated, so they are not references for this direction. *(Mobbin: [Lightyear sphere](https://mobbin.com/screens/f4c79a20-0ee2-4333-9f96-d47d4ff0a0cf), [Lightyear card](https://mobbin.com/screens/f4813f93-fe29-43ad-93d8-7e9dc25ab0ad), [Revolut](https://mobbin.com/screens/f7d90e37-7632-411e-bfb9-8e555a852962), [Arc Search](https://mobbin.com/screens/fd668832-1854-4394-84a7-42883bc774e7).)*
4. **Type: Bold is the heaviest weight. Tighten only the big sizes.**
   - Apple's own SF Pro tracking is **positive** from 24pt up: +0.38pt at 28pt, +0.40pt at 34pt, +0.22pt at 64pt. So the tight, editorial headline look needs negative letter-spacing at display sizes.
   - At 17pt, Apple's tracking is already −0.43pt, so don't add more to body text. (Check on the phone whether React Native's `letterSpacing` adds to the system tracking or replaces it. The AUDIT's −0.4 on body may double it.)
   - Use tabular figures for every amount.

   *(Apple HIG Typography, tracking table.)*
5. **Motion must earn its place.** It should be brief and precise. People must be able to cancel it. Don't animate interactions that happen often. Apple's HIG says: "Don't add motion for the sake of adding motion", "Let people cancel motion", and "avoid adding motion to UI interactions that occur frequently." *(HIG Motion.)*
6. **Timing numbers:**

   | Element | Timing |
   |---|---|
   | Press feedback | 100–160 ms, scale 0.97 |
   | Toggles and chips | 150–200 ms |
   | General UI | under 300 ms |
   | First-run entrances | 400–600 ms, with 100–150 ms between steps |

   No screen's opening sequence should run past about **1.1 s**, and it must never block a tap. *(Emil Kowalski `animate-expo`, `choreograph`, `emil-design-eng`.)*
7. **Springs settle with no bounce by default.**
   - The default spring is `{ duration: 400, dampingRatio: 1 }`.
   - Bounce (dampingRatio 0.7–0.8) is only for the raccoon and celebrations.
   - Apple's mapping: bounce 0.15 "doesn't feel very bouncy" and 0.3 is noticeable. SwiftUI's dampingRatio ≈ 1 − bounce.
   - Never use ease-in. The default curve is `Easing.bezier(0.23, 1, 0.32, 1)`.

   *(WWDC23 10158; Emil `apple-design` and `animate-expo`.)*
8. **One big moment per flow:** the yearly total rolling up on screen 3. The "You're set" celebration is the second, smaller one. Everything else stays quiet. If every screen performs, none of it registers. *(PLAYBOOK; Emil's frequency rule: rare, first-time moments get the delight budget.)*
9. **Reduce Motion collapses the motion; it doesn't just speed it up.**
   - Keep fades and colour changes that explain a state.
   - Drop sliding, scaling, overshoot, loops and the count-up. Show the final number.
   - Screen transitions become fades.
   - Pass `ReduceMotion.System` on every animation.

   *(Emil `animate-expo` and `choreograph`; HIG Motion: "Make motion optional.")*
10. **The paywall stays still at first.** × and Restore, the prices and the timeline are all visible on the first frame. There is no entrance delay on ×. The CTA never shimmers or pulses. Switching plans changes only colour and border, never the layout, and the CTA label follows the plan. *(CLAUDE.md rule 4; PLAYBOOK §7.)*
11. **Build animation in code by default.**
    - **Reanimated** for all UI.
    - **Raccoon:** PNG/SVG part-swap now, Rive later.
    - **Lottie:** only tiny one-shot effects.
    - **Video:** marketing and the App Store preview. In the app only if a loop passes the white-match test in §4.

    *(Callstack; RevenueCat video guide; MASCOT-RESEARCH §4.8; HIGGSFIELD-PLAYBOOK.)*
12. **Animation is polish, not the thing that sells.**
    - Adapty (2026): visual or copy tests raise conversion in only **31%** of tests, the lowest of any test type. When they do win, the gain is real ("animation and stronger visuals raised ARPU by 16–34% in winning tests").
    - 54% of the top 100 iOS paywalls have no image at all.
    - RevenueCat's "12–18%" figure for animation has no data behind it. The Fitness AI "+80%" changed two things at once.
    - So ship it restrained, then A/B test the hero after launch.

    *(Adapty State of Paywalls 2026; RevenueCat blog.)*

---

## 2. What the reference apps do (seen on Mobbin)

| App | Background | Depth | Type | Colour | Hero | Take for Ditch |
|---|---|---|---|---|---|---|
| **Bevel** | Off-white with very faint pastel washes (lavender top, yellow corner) and a faint grid texture ([1](https://mobbin.com/screens/f16c30b7-9839-4b4d-983a-e826b1f84b21)) | White cards with wide, soft shadows plus a hairline. Round 44pt white icon buttons with shadow ([2](https://mobbin.com/screens/e7cc93fb-0de5-4ec9-9738-98ae34298f3e)) | Centred Semibold titles, grey body | Almost none. Black pill CTA (`#1C1C1E`-ish) | **White-on-white 3D objects** (a safe, an envelope) ([3](https://mobbin.com/flows/9073b621-c34b-4308-b1e2-2658f4d549b6)) | One white 3D object per screen. Black pill. **Don't copy layouts**: Whoop reportedly sued Bevel in Apr 2026 over copied app designs. |
| **Lightyear** | White with a soft lavender gradient in the top ~25% ([4](https://mobbin.com/screens/f4c79a20-0ee2-4333-9f96-d47d4ff0a0cf)) | Flat. Colour sits inside cards ([5](https://mobbin.com/screens/f4813f93-fe29-43ad-93d8-7e9dc25ab0ad)) | Large Light/Regular display titles | One brand purple on the CTA | A glossy 3D sphere, centred | A faint top tint is fine. Keep colour inside shapes. |
| **Glow** | Pure white sheet | A 3D object with a floor reflection | Bold centred title, grey body | Purple object only | One object ([6](https://mobbin.com/screens/b92dfcad-1b54-46fd-ba7f-fb6ab7223b57)) | "One object on white" is the cleanest premium pattern. |
| **AllTrails** paywall | White | Selected plan: lavender tint plus a 2pt black border. No shadows | Left-aligned 30pt-ish Bold | Purple only on the selected card | None. The timeline sits *inside* the plan card ([7](https://mobbin.com/screens/0e508882-f772-497d-959e-d51095983ef1)) | The closest match to our paywall. The selected state is shown by border and tint, not by moving anything. |
| **Things 3** | `#F0F1F4`-ish grey page | One white card with a soft shadow ([8](https://mobbin.com/screens/45fc38f9-b3e9-4b3e-87f0-4f2f97fbc69c)) | Bold headers, hairline separators | Blue headers only | Logo | Model B, done well. |
| **Copilot** | Light grey-blue page | White cards about 12 radius, grey institution tiles ([9](https://mobbin.com/screens/ff90e0de-a9f0-494e-9323-8c5f8530bbf1)) | Small-caps tracked section labels; navy text instead of black | Logos carry the colour | — | The logo grid on grey tiles keeps third-party logos calm. |
| **Neo Financial** | `#F5F5F7` page | White plan cards, no shadow ([10](https://mobbin.com/screens/0f8fe29c-bc7c-4723-b20e-7e780e8658f5)) | Big Bold plan names | Black pill inside the cards | — | A tonal page lets white cards stand out without shadows. |
| **Opal** | Dark | — | — | — | A **rolling number wheel** ("30 / **31** / 32 years") ([11](https://mobbin.com/screens/fc3f2fbd-6a46-4fbb-94ca-90aae5db1ec5)) | A motion reference for our total: a digit roll, not a ticking counter. |
| **Success screens** | White: Truecaller, Chime, Withings. Off-white `#F7F7F9`: Jomo | A check with 2 soft halo rings ([12](https://mobbin.com/screens/e5edcd43-812f-4aa0-a6a3-708580022187), [13](https://mobbin.com/screens/4b4ced91-ae33-4d9c-9399-c950f5bf95b9), [14](https://mobbin.com/screens/df40391c-beb7-4a8a-a508-fec2b33601c5)) | Bold centred title | One colour | Check or mascot | "You're set" = raccoon plus 2 halo rings, no confetti rain. |
| **Apple** (system styles, not seen on Mobbin) | Grouped `#F2F2F7`, white cells | Inset grouped, no shadows | SF Pro, Bold titles | System tints | — | The values in §3 come from these system colours. |

**Background treatments, ranked for Ditch:**
1. **Pure `#FFFFFF`** for onboarding and the paywall. It matches the mockups, and a video or 3D hero can sit on it seamlessly.
2. **A faint teal wash** (`#F3FAF8` → `#FFFFFF`, top 30%) on Welcome and You're set only, if the page feels flat. Draw it with `expo-linear-gradient`. **Never** put it behind a video (the white match breaks).
3. **No noise, grain or glass on content.** Noise costs rendering time and fixes nothing on a flat colour. Apple: "Don't use Liquid Glass in the content layer." Use glass only on floating controls, and sparingly.

---

## 3. Design-token sheet: premium white

These values refine the AUDIT's sheet. They are sampled from the mockups (`board.jpg`: tick `#14A294`, bar `#06A295`, timeline panel `#F3F3F5`, search field `#EBECEE`, saving pill `#D5F5F0`) and snapped to iOS system greys.

> **Note:** `src/theme/tokens.ts` today is "warm paper + pine + lime". Switching to these tokens is the owner's call. I have not edited it.

### Colour (light / dark)
| Token | Light | Dark | Contrast on bg | Use |
|---|---|---|---|---|
| `bg` | `#FFFFFF` | `#000000` | — | Onboarding and paywall pages |
| `bgGrouped` | `#F2F2F7` | `#000000` | — | In-app lists (Model B) only |
| `surface` | `#F5F5F7` | `#1C1C1E` | — | Grouped cards, timeline, plan cards (unselected) |
| `surfaceRaised` | `#FFFFFF` | `#2C2C2E` | — | The selected plan card, floating tiles |
| `fill` | `#EEEEF0` | `#2C2C2E` | — | Search field, × circle, chips (mockup field is `#EBECEE`) |
| `track` | `#E5E5EA` | `#38383A` | — | Progress tracks, bar tracks |
| `hairline` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.10)` | — | 0.5pt borders on white logos and tiles |
| `separator` | `rgba(60,60,67,0.29)` | `rgba(84,84,88,0.6)` | — | List separators (iOS `separator`) |
| `label` | `#0A0A0A` | `#FFFFFF` | 19.8:1 | Titles, prices |
| `label2` | `#3C3C43` | `#EBEBF5` | 10.9:1 | Body |
| `label3` | `#6E6E73` | `#AEAEB2` | 5.1:1 (4.6:1 on `surface`) | Secondary text; the lightest grey allowed for text |
| `placeholder` | `#8E8E93` | `#8E8E93` | 3.3:1 | Placeholders and icons only, never text |
| `accent` | `#0B7A6E` | `#3FC1AE` | 5.2:1 | Accent *text*: links, the saving pill, "+ Something else?" |
| `accentFill` | `#06A295` | `#3FC1AE` | 3.2:1 | Non-text only: tick circles, bars, progress fill (≥3:1 passes for graphics) |
| `accentTint` | `#E3F5F1` | `#12312C` | — | Selected rows, saving pill background (`accent` on it is about 4.6:1) |
| `ctaBg` / `ctaLabel` | `#0A0A0A` / `#FFFFFF` | `#FFFFFF` / `#000000` | 19.8:1 | Primary button |
| `ctaDisabled` | `#D1D1D6` | `#3A3A3C` | — | Disabled primary |
| `warning` | `#B4530A` | `#F0A35E` | — | Over-limit notes |
| `scrim` | `rgba(0,0,0,0.35)` | `rgba(0,0,0,0.5)` | — | Behind sheets (HIG: dim bright content by 35%) |

Lime appears only in the raccoon's scarf, never in the frame.

### Type (SF Pro, `tabular-nums` on all money)
Dynamic Type sizes follow Apple's "Large (default)" column. `letterSpacing` is the **extra** spacing we add: negative only at display sizes.

| Token | Size / line | Weight | letterSpacing | Use |
|---|---|---|---|---|
| `display` | 72 / 76 | 700 | −1.5 | The yearly total (cap at 96 with large text, let it reflow) |
| `hero` | 40 / 44 | 700 | −0.8 | Welcome headline |
| `title` | 30 / 36 | 700 | −0.5 | Every other screen title |
| `title3` | 20 / 25 | 600 | 0 | Card headers ("Your biggest 3") |
| `headline` | 17 / 22 | 600 | 0 | Row names, plan names, button labels |
| `body` | 17 / 24 | 400 | 0 | Body (leave tracking to the system) |
| `callout` | 15 / 20 | 400 | 0 | Subheads, second lines |
| `footnote` | 13 / 18 | 400 | 0 | Legal, sources |
| `eyebrow` | 13 / 18 | 600 | +0.2, UPPERCASE | Optional section labels (the Copilot pattern); use sparingly |

- **Heaviest weight is Bold (700).** The mockups' Heavy/Black (800–900) reads as shouting.
- Grey text at Heavy weight looks muddy. Grey text is always Regular or Semibold.

### Spacing (4pt base)
`2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64`

| Rule | Value |
|---|---|
| Page margin (all text and buttons) | 24 |
| Card padding | 20 (rows inside: 16) |
| Title → body | 12 |
| Body → content | 24 |
| Section → section | 32 |
| Hero art → title | 32 |
| CTA → secondary button | 8 |
| CTA above the home indicator | 8 (inside the safe area) |
| Row height | 64 (logo 40) · compact 56 (logo 36) |
| Min tap target | 44 × 44 (`hitSlop` if the visual is smaller) |

### Radii (use `borderCurve: 'continuous'` on iOS)
| Token | Value |
|---|---|
| `logo` | 22.37% of size (9 at 40pt, 8 at 36pt) |
| `input` | 12 |
| `planCard` | 16 |
| `card` | 20 |
| `sheet` | 28 (top corners) |
| `button`, `chip` | pill (999) |

### Shadows (React Native `boxShadow`, New Architecture only, which we have)
The AUDIT said "no shadows on cards". I agree for grouped cards. Premium white still needs **one** raised level for the selected or hero object. Otherwise the page looks flat.

| Token | Value | Use |
|---|---|---|
| `none` | — | All grouped cards (they use `surface` fill instead) |
| `lift1` | `0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)` | Pressed or raised small controls, the × circle |
| `lift2` | `0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.06)` | The selected plan card, floating app tiles on Welcome |
| `lift3` | `0 2px 6px rgba(0,0,0,0.05), 0 24px 48px -12px rgba(0,0,0,0.14)` | One hero object per screen (3D card, bell) |
| `footerEdge` | 0.5pt `separator` top border, no shadow | The sticky footer |

- **Dark mode:** no shadows. Use `surfaceRaised` plus a `hairline`.
- **Never animate a shadow.** Cross-fade two pre-shadowed layers instead.

### Iconography
- Use SF Symbols via `expo-symbols`, matched to the text weight (Semibold beside Semibold). 17–20pt in rows, 13pt Semibold for the × glyph.
- Use the symbol's built-in effects (bounce on the bell, replace on the tick) instead of hand-made icon motion. Check `expo-symbols`' `animationSpec` options on SDK 58.
- **Logos:**
  - Flat, all the same size, no tilt.
  - A 0.5pt hairline on white logos.
  - Hidden from VoiceOver when decorative.
  - In rows, not as the hero (AUDIT: a trademark risk in screenshots).
- **3D objects:** at most one per screen, in the raccoon's teal family: a card, a receipt, a bell. Use `lift3` and a soft contact shadow baked into the PNG.

### Buttons
| Kind | Spec | Press |
|---|---|---|
| Primary | 56 tall, pill, `ctaBg`, `headline` label | scale 0.97 + opacity 0.9, 120 ms `easeOut`; light haptic on commit |
| Secondary (e.g. "Continue free: reminders for 3") | 44 tall, no fill, `headline`, `label2` | opacity 0.6, 120 ms |
| Icon (×) | 44 × 44 hit area, 30pt `fill` circle | scale 0.94, 100 ms |

### Motion tokens (Reanimated 4.7)
```ts
export const ease = {
  out: Easing.bezier(0.23, 1, 0.32, 1),       // entrances, default
  inOut: Easing.bezier(0.77, 0, 0.175, 1),    // things moving on screen, progress
  sheet: Easing.bezier(0.32, 0.72, 0, 1),     // sheets
};
export const spring = {
  settle: { duration: 400, dampingRatio: 1 },     // default, no overshoot (~bounce 0)
  soft:   { duration: 450, dampingRatio: 0.85 },  // ticks, chips (~bounce 0.15)
  lively: { duration: 500, dampingRatio: 0.7 },   // raccoon and celebration only (~bounce 0.3)
};
export const dur = { press: 120, small: 180, ui: 250, enter: 500, count: 1000 };
export const stagger = { list: 40, firstRun: 120 };
// Always: reduceMotion: ReduceMotion.System
```
For comparison, Reanimated's built-in presets are `GentleSpringConfigWithDuration` (550 ms, dampingRatio 1), `SnappySpringConfigWithDuration` (550 ms, 0.92, clamped) and `WigglySpringConfigWithDuration` (550 ms, 0.75). Ours are a bit quicker, in line with Emil's 400 ms default.

---

## 4. Video vs code vs Lottie/Rive

### Decision table
| Job | Use | Why | Budget |
|---|---|---|---|
| **Welcome hero** | **Reanimated**: logo tiles (or 3 flat tiles at 40%) plus raccoon parts | Reacts to state, works in Expo Go, Reduce Motion is built in, no white-match risk, works in dark mode, and the copy can change without re-rendering a video | 0 KB of motion. Raccoon PNG/SVG parts ≤ 150 KB total |
| Welcome hero, **later A/B variant** | A 4–6 s Seedance loop, only if it passes the white test below | Possible extra polish. There's no data that it converts better in onboarding | ≤ 1.5 MB, see the encode spec |
| **Raccoon reactions** (bubble replies, shocked, cheer) | **PNG/SVG pose swap + Reanimated transforms** now; **Rive** state machine later (needs an EAS dev build) | Duolingo and Brilliant use Rive state machines. Rive's own case studies report big size cuts (Intercom hero 1.49 MB Lottie → 831 KB Rive). These are vendor numbers | Pose set ≤ 150 KB; `.riv` rig ≤ 200 KB |
| Short transparent loops (blink, tail) | Option: **animated WebP sprite** via `expo-image` (AutoSprite in the Higgsfield playbook) | Keeps transparency, no video player, works in Expo Go | ≤ 400 KB, ≤ 2 s, ≤ 540 px wide (180pt @3x) |
| **Paywall hero** | **A still raccoon** (88pt), at most one blink | The paywall must show prices and × instantly. 54% of top paywalls use no image. Video adds load time, and the "honest paywall" should feel calm | ≤ 60 KB |
| **Celebration** (You're set, Ditched!) | **Reanimated** (raccoon hop + 3 lime sparks) + success haptic | Once only, under 1.6 s. A Lottie file is OK for the sparks alone | Lottie ≤ 50 KB if used (a 3 s Lottie is usually 10–40 KB) |
| **App Store preview video, TikTok, ads** | **Video** (Seedance/Kling, per the Higgsfield playbook) | This is where video pays off: no white-match problem, sound is optional, no Reduce Motion rule | Apple preview rules apply (check before making it) |

**Total in-app media budget for onboarding: ≤ 3 MB.** Keep the first screen's assets ≤ 500 KB so the first frame is instant.

### If we do put a looping video on white: the recipe
The problem: a video's "white" usually lands a few levels off `#FFFFFF`, through range or colour conversion or AI-generated noise. That shows a visible box edge. One iOS developer reports "a border will appear around the AVPlayer" on a white page.

1. **Generate for the loop.**
   - Use Seedance's first/last-frame mode with the **same still** as both the first and last frame, so the loop closes on itself.
   - Seedance outputs 24 fps; 2.5 allows 4–15 s.
   - Prompt: "seamless pure white #FFFFFF studio background, no vignette, no floor, no camera move, no light flicker."
   - Keep the subject inside the middle 70% of the frame.
2. **Clean the background.** Push near-whites to pure white and check that the subject's highlights don't blow out. Starting point:
   `ffmpeg -i raw.mp4 -vf "curves=all='0/0 0.93/1 1/1',scale=1080:-2:flags=lanczos,format=yuv420p" ...`
   If the raccoon's cream belly clips, go to step 6 (alpha) instead.
3. **Encode: H.264, tagged as standard video colour.**
   `-c:v libx264 -profile:v high -crf 20 -preset slow -r 30 -g 30 -an -movflags +faststart -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv`
   - `-an` means no audio track. That avoids loop flicker some people report and doesn't interrupt the user's music.
   - Range "tv" maps encoded white (235) to screen white (255).
   - HEVC (`-c:v libx265 -tag:v hvc1`, 10-bit `yuv420p10le`) is about 40% smaller and bands less. The `hvc1` tag is required for Apple players.
4. **Hide any small mismatch.**
   - Put the video in a container with `bg` colour.
   - Mask it 1pt inside its edges (the known fix for the AVPlayer border).
   - Or fade the edges into `bg` with a 24pt `expo-linear-gradient`.
5. **No flash on start.** Show the first frame as a PNG poster and hide it in `onFirstFrameRender`, with a 150 ms fade. Settings: `player.loop = true`, `player.muted = true`, `nativeControls={false}`, `contentFit="contain"`, `allowsExternalPlayback = false`. Keep `audioMixingMode` at `'auto'` so muted video never stops the user's music.
6. **Dark mode and the clean fix: HEVC with alpha.**
   - AVPlayerLayer has shown HEVC-with-alpha with a transparent background since iOS 13 (WWDC19 506).
   - That fixes both the white match and dark mode.
   - **Not verified** in `expo-video`: some developers see a black background instead. Test in a dev build first.
   - Without alpha, ship a second dark-background render, or show the still poster in dark mode.
7. **Reduce Motion, Low Power Mode, slow devices:** show the poster still with no autoplay.
8. **Verify on a real iPhone.** Take a screenshot and sample a background pixel. It must read 255,255,255, and the edge must be invisible at full brightness. The simulator and Expo Go don't count for feel, so judge in a release build.

### Performance rules (React Native)
- Animate only `transform` and `opacity`. Width is OK only for an absolutely positioned progress fill; prefer `scaleX` with a left origin.
- Use Reanimated **CSS transitions** (`transitionProperty`, `transitionDuration`) for state changes: press, selection, colour. Use **shared values** for the count-up and anything driven by a finger.
- **The count-up must not re-render React every frame.** Use a rolling-digit component on the UI thread (e.g. `number-flow-react-native`, which ports NumberFlow and needs Reanimated) or the `TextInput` + `animatedProps` pattern. Set `accessibilityLabel` to the final amount from the first frame.
- Set `CADisableMinimumFrameDurationOnPhone: true` in `infoPlist` for 120 Hz on ProMotion phones.
- No `entering` animations on virtualised list rows. Animate the container once instead.
- Never animate `BlurView` intensity or shadows.
- Judge feel only in a **release build on the oldest supported iPhone**.

---

## 5. Onboarding and paywall: layout + motion per screen

The layout fixes are in AUDIT-premium-white.md. Below are only the white-system additions, then the full motion spec.

**Global:**
- Native stack push between screens (the iOS default, about 350 ms). Don't rebuild it in JS. With Reduce Motion, use `animation: 'fade'`.
- **Progress bar:** 4pt, `track` / `accentFill`, covering screens 2–5. On each new screen the fill grows with `scaleX` over 400 ms `ease.inOut`, starting 150 ms after the push begins.
- **The raccoon never sits on or over a button.** Its avatar on work screens doesn't animate again between screens.
- **Haptics:** one per user action, on the same frame as the visual. `selectionAsync` for ticks and plan changes. `Light` impact on CTA commit. `Success` when the total lands and on You're set. No haptic on entrances the user didn't trigger.

### Motion spec table
Notation: `t` = ms after the screen's push begins. All animations pass `reduceMotion: ReduceMotion.System`. "RM" means Reduce Motion.

**1 · Welcome**

| Element | Trigger | Animation | Duration / timing | Easing / spring | RM fallback |
|---|---|---|---|---|---|
| Raccoon (lead) | Mount, t=100 | opacity 0→1, scale 0.96→1, translateY 12→0 | 550 ms | `spring.lively` on scale, `ease.out` on opacity | 200 ms fade, no scale |
| Logo tiles (support) | Mount, t=200 | opacity 0→1, scale 0.9→1, each tile ±4° → final angle | 450 ms each, 70 ms stagger (shrinking: 70, 60, 50…) | `spring.settle` | All at once, 200 ms fade |
| Headline | t=350 | opacity, translateY 8→0 | 400 ms | `ease.out` | 200 ms fade |
| Body + CTA + small print | t=450 | opacity only | 300 ms | `ease.out` | Same |
| CTA | Always | **Tappable from t=0.** Never wait for the sequence | — | — | — |
| Idle: tiles | After the entrance | translateY ±2pt, random phase, **period 3.5 s** (not 5 s: HIG says avoid ~0.2 Hz) | Stop after 12 s | sine `ease.inOut` | None |
| Idle: raccoon | After the entrance | Blink every 3–6 s (MASCOT §4.8) | 120 ms blink | — | None |
| CTA press | Press in / out | scale 0.97 | 120 ms in, 200 ms out | `ease.out` | Opacity 0.9 only |

**2 · What do you pay for?**

| Element | Trigger | Animation | Duration | Easing / spring | RM fallback |
|---|---|---|---|---|---|
| List card | Mount | One container entrance: opacity + translateY 12→0 | 350 ms, t=100 | `ease.out` | Fade |
| Row press | Press in | Row bg → `accentTint` | 120 ms | `ease.out` | Same (colour) |
| Tick circle | Tap commit | Fill `accentFill`, scale 0.85→1, then the checkmark draws (delay = 150 ms, the first step's duration) | 150 + 150 ms | `spring.soft` | Instant fill, no scale |
| Haptic | Tap commit | `selectionAsync` | — | — | Keep |
| Footer total | Tick changes | Digits roll to the new value | 250 ms | `ease.out` | Snap |
| Footer avatar line | Milestones only (1st, 3rd, 5th tick) | Old line fades out 100 ms; new line fades in + translateY 4→0 | 100 + 200 ms | `ease.out` | Crossfade 150 ms |
| CTA state "None of these" → "Continue" | First tick | Label crossfade; bg `surface` → `ctaBg` | 180 ms | `ease.out` | Same |
| Search, chips | Typing / tap | **No motion** (frequent) | — | — | — |

**3 · Your total (the big moment)**

| Element | Trigger | Animation | Duration | Easing / spring | RM fallback |
|---|---|---|---|---|---|
| "That's about" | t=100 | Fade | 200 ms | `ease.out` | Same |
| Total `display` | t=200 | **Digit roll from $0 to the total** (Opal-style wheel, tabular figures) | 1000 ms | `ease.out` (fast start, slow finish) | Final number, 200 ms fade |
| Haptic | Number lands (t≈1200) | `Success` | — | — | Keep |
| "a year" + month line | t=800 | Fade + translateY 4→0 | 250 ms | `ease.out` | Fade |
| Raccoon (shocked, receipt) | Lands with the number | scale 0.94→1 + receipt unroll (translateY under a mask) | 450 ms | `spring.lively` | Still pose |
| "Your biggest 3" card | t=1000 | One container entrance | 350 ms | `ease.out` | Fade |
| Bars | After the card | `scaleX` 0 → share, left origin, 80 ms stagger | 500 ms | `ease.out` | Final widths |
| Bridge line + CTA | t=0 | **Visible and tappable at once** | — | — | — |
| Multi-currency | — | One roll per currency line, 120 ms stagger. Never one combined number | — | — | — |

**4 · Charge dates**

| Element | Trigger | Animation | Duration | Easing / spring | RM fallback |
|---|---|---|---|---|---|
| Day cell | Tap | Fill → `ctaBg`, label → white | 150 ms | `ease.out` | Same |
| Haptic | Tap | `selectionAsync` | — | — | Keep |
| Confirmation line ("Netflix: the 14th, next on Nov 14") | Tap | Fade + translateY 4→0 | 200 ms | `ease.out` | Fade |
| Next service card | 350 ms after the tap (cancellable by Back) | Current card: translateX 0→−24 + fade out (180 ms). Next: +24→0 + fade in (250 ms), overlapping by 60 ms | 370 ms total | `ease.out` | Crossfade 200 ms |
| "2 of 6" counter | Advance | Digit roll | 200 ms | `ease.out` | Snap |
| "Not sure" / "Later" | Tap | Same advance, no fill | — | — | — |

**5 · Reminders (pre-ask)**

| Element | Trigger | Animation | Duration | Easing / spring | RM fallback |
|---|---|---|---|---|---|
| Lock-screen frame | Mount | Fade + scale 0.98→1 | 400 ms | `spring.settle` | Fade |
| Their own notifications (2–3) | t=400 | Drop in: translateY −16→0 + opacity, **120 ms stagger** | 400 ms each | `spring.settle` | All shown together |
| Raccoon bell | After the last notification | One wiggle: rotate ±8°, 3 swings (or the SF Symbol bell `bounce`) | 500 ms, once | `ease.inOut` | None |
| "Turn on reminders" | Tap | System prompt. On grant: tick + `Success` haptic. On deny: plain copy, no motion | 200 ms | `ease.out` | Same |

**6 · Paywall**

| Element | Trigger | Animation | Duration | Easing / spring | RM fallback |
|---|---|---|---|---|---|
| ×, Restore, prices, timeline, CTA, free button | Mount | **None. Visible on frame 1.** | 0 | — | — |
| Headline + raccoon | Mount | Fade only | 200 ms | `ease.out` | Same |
| Raccoon | Idle | At most one blink. No loop on this screen | — | — | None |
| Plan select | Tap | Border `transparent` → 2pt `label`; bg `surface` → `surfaceRaised` + `lift2` (crossfade a pre-shadowed layer). **Nothing moves or resizes.** | 150 ms | `ease.out` | Same |
| Haptic | Plan change | `selectionAsync` | — | — | Keep |
| CTA label | Plan change | Crossfade: "Start 7-day free trial" ↔ "Subscribe for $4.99 a month" ↔ "Buy for $49.99" | 150 ms | `ease.out` | Same |
| Timeline (no trial on Monthly or Lifetime) | Plan change | **Keep its height.** Crossfade its content to a one-line "No trial. Billed today." note | 200 ms | `ease.out` | Same |
| Reminder-day chip | Tap 1/2/3 days | The date rolls (Sat, Nov 14 → Fri, Nov 13) | 200 ms | `ease.out` | Snap |
| CTA purchase | Tap | Spinner replaces the label in place (same size) | — | — | — |
| CTA idle | — | **No shimmer, pulse or bounce. Ever.** | — | — | — |

**7 · Pick 3 (free path)**

| Element | Trigger | Animation | Duration | Easing / spring | RM fallback |
|---|---|---|---|---|---|
| The 3 auto-picked rows | Mount | Bells fill one after another ("I picked these") | 150 ms each, 120 ms stagger | `spring.soft` | All filled |
| Swap | Untick, then tick | As on screen 2 | — | — | — |
| 4th tick attempt | Tap | No shake. Note fades in: "Reminders cover 3 on free. Untick one first." + `Warning` haptic | 200 ms | `ease.out` | Fade |
| "3 of 3" counter | Change | Digit roll | 200 ms | `ease.out` | Snap |

**8 · You're set**

| Element | Trigger | Animation | Duration | Easing / spring | RM fallback |
|---|---|---|---|---|---|
| Raccoon (cheering) | Mount, t=100 | Hop: translateY 0→−10→0 with stretch/squash 3%, then hold | 600 ms, once | `spring.lively` | Still pose |
| 2 halo rings | With the hop | opacity 0→1, scale 0.9→1 | 500 ms | `ease.out` | Fade |
| 3 lime sparks | Last 20% of the hop | Burst out 12pt and fade | 300 ms | `ease.out` | None |
| Haptic | Hop landing | `Success`, once | — | — | Keep |
| Summary rows (first heads-up, N tracked, reminders on/off) | t=400 | 80 ms stagger, opacity + translateY 8→0 | 350 ms each | `ease.out` | Together, fade |
| CTA "Go to my list" | t=0 | Tappable at once | — | — | — |

---

## 6. What NOT to do

- **No looping motion on the paywall.** No shimmer, pulse or "breathing" CTA, no countdown-style ring, no auto-scrolling reviews. They add pressure and break rule 4.
- **No entrance delay on × or Restore.** Fading the × in "after 3 seconds" is a known dark pattern.
- **Nothing that moves the CTA.** When the plan or timeline changes, the button stays where the thumb is.
- **No `scale(0)` entrances, no ease-in, no bounce on menus or plain fades.**
- **No oscillation near 0.2 Hz** (one cycle every 5 s). Apple flags it as a comfort risk.
- **No count-up with Reduce Motion on.** No count-up from a fake number, and no "analysing…" loader (PLAYBOOK "Never").
- **No more than one big moment.** The rolling total is ours. Don't add confetti rain, fireworks or a full-screen Lottie.
- **No video with a near-white background that wasn't checked on a phone.** No video behind a gradient wash, no video in dark mode without a dark variant, no video with an audio track.
- **No real logos baked into a video or a 3D render.** You can't update them, and they're a trademark risk (5.2.1/5.2.2) if a frame becomes an App Store screenshot.
- **No Liquid Glass on content.** Glass is for floating controls only, and it looks like nothing on white.
- **No grey text below `#6E6E73`.** No teal `#06A295` as text (3.2:1 fails). No Heavy or Black weights.
- **No shadows on every card.** The `surface` fill is the default; `lift2` and `lift3` are for one object only.
- **Don't copy Bevel's layouts.** Whoop reportedly sued Bevel over copied app designs (Apr 2026). Take the principles, not the screens.
- **Don't judge motion in Expo Go or the simulator.** Use a release build on the oldest supported iPhone.
- **Don't add Rive or Lottie modules "just in case".** Rive needs an EAS dev build. `@lottiefiles/dotlottie-react-native` isn't in Expo Go.

---

## 7. References

### Mobbin (iOS, all looked at)
- Bevel personality picker: https://mobbin.com/screens/f5aab9fe-5429-4a39-a3f1-8dadb2328148
- Bevel "Answer the following" (pastel wash + grid): https://mobbin.com/screens/f16c30b7-9839-4b4d-983a-e826b1f84b21
- Bevel cycle cards: https://mobbin.com/screens/e7cc93fb-0de5-4ec9-9738-98ae34298f3e
- Bevel iCloud steps: https://mobbin.com/screens/de894bd1-4c6d-4f20-a1e7-28f92038d50c
- Bevel paywall: https://mobbin.com/screens/87ac5af9-7c7a-46b8-8a82-ad8c90bf574c
- Bevel onboarding flow (14 screens): https://mobbin.com/flows/9073b621-c34b-4308-b1e2-2658f4d549b6
- Lightyear 3D sphere success: https://mobbin.com/screens/f4c79a20-0ee2-4333-9f96-d47d4ff0a0cf
- Lightyear auto-invest card: https://mobbin.com/screens/f4813f93-fe29-43ad-93d8-7e9dc25ab0ad
- Lightyear new stocks: https://mobbin.com/screens/fc7ac1b4-3bdf-46e7-b943-8fecb4e08059
- Lightyear W-8BEN: https://mobbin.com/screens/f1249c87-9096-4d93-8e61-6ba9cbf2a2fa
- Copilot link accounts: https://mobbin.com/screens/ff90e0de-a9f0-494e-9323-8c5f8530bbf1
- Copilot recurring: https://mobbin.com/screens/ef051aac-998c-43b2-ba70-71c9d4977cbc
- Revolut (dark): https://mobbin.com/screens/f7d90e37-7632-411e-bfb9-8e555a852962
- Things 3 welcome: https://mobbin.com/screens/45fc38f9-b3e9-4b3e-87f0-4f2f97fbc69c
- Opal rolling number: https://mobbin.com/screens/fc3f2fbd-6a46-4fbb-94ca-90aae5db1ec5
- Arc Search icon picker: https://mobbin.com/screens/fd668832-1854-4394-84a7-42883bc774e7
- Glow welcome (3D object on white): https://mobbin.com/screens/b92dfcad-1b54-46fd-ba7f-fb6ab7223b57
- Facebook welcome (floating objects): https://mobbin.com/screens/2a189ef7-f75a-40e2-8214-e898a7b1b861
- AllTrails paywall: https://mobbin.com/screens/0e508882-f772-497d-959e-d51095983ef1
- Neo Financial memberships: https://mobbin.com/screens/0f8fe29c-bc7c-4723-b20e-7e780e8658f5
- 5 Minute Journal trial timeline: https://mobbin.com/screens/0b03c06a-63c8-43dd-87ed-58fecc57f0a1
- Truecaller all set: https://mobbin.com/screens/e5edcd43-812f-4aa0-a6a3-708580022187
- Chime all set: https://mobbin.com/screens/4b4ced91-ae33-4d9c-9399-c950f5bf95b9
- Withings setup complete: https://mobbin.com/screens/b5de7829-f383-4d7b-97d7-38c685afc7a9
- Jomo all set (mascot): https://mobbin.com/screens/df40391c-beb7-4a8a-a508-fec2b33601c5

### Apple
- HIG Motion: https://developer.apple.com/design/human-interface-guidelines/motion
- HIG Typography (Dynamic Type sizes, SF Pro tracking table): https://developer.apple.com/design/human-interface-guidelines/typography
- HIG Materials (Liquid Glass, 35% dimming): https://developer.apple.com/design/human-interface-guidelines/materials
- WWDC23 "Animate with springs": https://developer.apple.com/videos/play/wwdc2023/10158/ · notes: https://wwdcnotes.com/notes/wwdc23/10158
- WWDC19 "HEVC Video with Alpha": https://developer.apple.com/videos/play/wwdc2019/506/
- Using HEVC video with alpha: https://developer.apple.com/documentation/avfoundation/using-hevc-video-with-alpha
- UI element colours: https://developer.apple.com/documentation/uikit/ui-element-colors

### Motion engineering
- Emil Kowalski skills repo: https://github.com/emilkowalski/skills
  - animate-expo: https://github.com/emilkowalski/skills/blob/main/skills/animate-expo/SKILL.md
  - apple-design: https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md
  - choreograph: https://github.com/emilkowalski/skills/blob/main/skills/choreograph/SKILL.md
  - emil-design-eng: https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md
- animations.dev: https://animations.dev
- Reanimated `withSpring`: https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring
- Reanimated spring presets (4.7.1 source): https://app.unpkg.com/react-native-reanimated@4.7.1/files/src/animation/spring/springConfigs.ts
- Reanimated CSS transitions: https://docs.swmansion.com/react-native-reanimated/docs/css-transitions/overview
- React Native `boxShadow`: https://reactnative.dev/docs/view-style-props
- expo-video: https://docs.expo.dev/versions/latest/sdk/video/
- number-flow-react-native: https://socket.dev/npm/package/number-flow-react-native · rn-number-flow: https://www.npmjs.com/package/rn-number-flow

### Rive, Lottie, video
- Callstack, Lottie vs Rive: https://callstack.com/blog/lottie-vs-rive-optimizing-mobile-app-animation
- Rive as a Lottie alternative: https://rive.app/blog/rive-as-a-lottie-alternative
- Rive, Intercom case study: https://rive.app/blog/intercom-s-product-animation-evolution-embracing-rive
- Rive, Duolingo Lily: https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life
- LottieFiles, Headspace: https://lottiefiles.com/showcase/headspace
- LottieFiles vs Rive: https://lottiefiles.com/blog/lottie-animations/lottiefiles-or-rive
- dotLottie: https://lottiefiles.com/dotlottie
- Lottie size guide (3 s ≈ 10–40 KB): https://dev.to/fazalshah/lottie-animation-performance-the-complete-optimization-guide-2025-3e6h
- AVPlayer white border on white page: https://kaweah.freedombox.rocks/kiwix/stackoverflow.com_en_all_2023-11/questions/41559809/iphone-7-plus-avplayer-has-border-around-it-colors-mismatch-on-white
- Full vs limited range whites: https://forum.magicleap.cloud/t/video-player-adds-20-white/1777
- HEVC `hvc1` tag for Apple: https://developer.apple.com/forums/thread/79048
- 10-bit HEVC on iOS: https://lists.ffmpeg.org/pipermail/ffmpeg-devel-irc/2019-February/005570.html
- Video loop crossfade technique: https://convertintomp4.com/blog/how-to-loop-video
- Looping video flashing (expo): https://forums.expo.io/t/looping-video-flashing-2/20594
- Seedance 2.5 specs (24 fps, 4–30 s): https://docs.sogni.ai/models/seedance-2-5/
- Seedance first/last frame: https://muapi.ai/playground/seedance-2.5-first-last-frame-4k
- Seedance 1.0 Pro (first/last frame targeting): https://runware.ai/docs/models/bytedance-seedance-1-0-pro

### Paywall data
- RevenueCat, video paywalls: https://www.revenuecat.com/blog/growth/video-paywalls
- RevenueCat, paywall conversion boosters (the unsourced 12–18% claim): https://www.revenuecat.com/blog/growth/paywall-conversion-boosters
- Adapty, State of Paywalls 2026: https://adapty.io/blog/paywall-optimization-tests/
- Superwall case studies: https://superwall.com/case-studies/speak4me

### Other
- Bevel overview and Whoop lawsuit context: https://screensdesign.com/showcase/bevel-health-performance · https://gadgetsandwearables.com/2025/12/21/bevel-app-free/
- App Store 5.2.2 and third-party IP: https://ptkd.com/journal/app-store-rejection-5-2-2-third-party-ip-and-ai-generated-icons

---

## Mobbin notice

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
