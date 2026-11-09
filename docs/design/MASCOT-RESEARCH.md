# Mascot research and art direction: the Ditch raccoon

Status: research for round 2 (Nov 9, 2026). No images were made for this doc.
Locked rules come from `docs/DECISIONS.md` (#4, #5, "Mascot research") and `CLAUDE.md` §8.

**The short version:** round 1 described a *species and a style*. Round 2 must describe a *construction*. Duo works because he is one simple shape, owns one colour, and has a face that does all the acting. Our raccoon should be a single rounded squircle in its own colour (teal "Lagoon"). Its edge is always that colour. It has a dark inset mask with light eyes, and a big ringed tail that makes it a raccoon even at 32 px.

---

## 1. Why round 1 failed

All three share four root causes:

- **No construction.** The prompts asked for "a cute raccoon in style X". The model fell back to its average raccoon: front-facing, standing, arms down, head on a separate body. Nothing in it belongs only to Ditch.
- **No silhouette idea.** Fill any of them in black and you get a generic small mammal. Only the tail says "raccoon".
- **Brand colours painted onto anatomy.** Pine and lime were dropped onto the mask and tail. Nobody decided which colour does which job, or how each reads on light and dark backgrounds.
- **The flick was never designed.** In all three, the raccoon *drops* a small blob into a bucket. It reads as feeding or littering, not as a confident flick of a card.

### A: "Pebble" (tan, pine mask, cream belly)
- It is the stock "kawaii raccoon" template. Head about 45% of the height, front view, symmetrical, cream belly oval, cream brow patches. It could come from any sticker pack.
- It is built the same way as BitePal's raccoon (front-facing, mask band, stubby body, big head). Only the colours change. The decision log says to avoid exactly this.
- It has about 20 shapes, all a similar size: ears, inner ears, brow patches, cheek patches, muzzle, belly, arms, feet and 4 tail rings. Nothing leads the eye. Duolingo's rule is the fewest shapes, with deliberate variation in size ([Shape language](https://blog.duolingo.com/shape-language-duolingos-art-style/)).
- The dot eyes sink into the dark mask. At widget size the face becomes a dark smudge. Dot eyes also can't do *worried* or *cheeky*, so the "cheeky" face is mush.
- Tan and cream on warm paper are low contrast. Tan is natural raccoon brown, which is Rocket and Richard territory.
- The five poses are one body with different arms. There's no line of action, no weight shift, no acting.

### B: "Papercut" (slender humanoid)
- Wrong genre. Long limbs, hips, an hourglass torso and a hand-on-hip pose read as "anthro/furry" art. That is the Rocket Raccoon family, and not a friendly app character.
- The head is about 1/6 of the height. At 32 px the face is 4 px tall and unreadable, and the widget would show a stick.
- Pointy ears and a pointy snout read as fox or cat. Sharp shapes read as edgy, and Duolingo calls pointy shapes off-brand.
- The paper grain and cast shadows break "flat, no texture".
- The pine "gloves and boots" look like a costume, not anatomy.

### C: "Monoline" (outline doodle, lime mask)
- A uniform black outline on flat fill is the most generic doodle look. BitePal also uses heavy black outlines.
- **A light (lime) mask kills the species read.** A raccoon is recognised by a *dark* mask. A light mask reads as eyeshadow, goggles or a frog. Lime on tan is about 1.3:1, so the mask nearly disappears.
- The body is the same chibi bean as A, with cat ears.
- The bin is a generic outline icon and the card is a speck, so the signature move has no presence.
- Hand on hip for "cheeky" is a cliché.

---

## 2. What makes Duo work

**Who did the redesign?** Johnson Banks led Duolingo's 2019 brand identity: the wordmark and the Feather Bold typeface (made with Fontsmith), drawn from Duo's plumage. They worked alongside Duolingo's in-house design team ([Creative Review](https://www.creativereview.co.uk/duolingo-rebrand-johnson-banks/), [Johnson Banks](https://www.johnsonbanks.co.uk/templates/work/duolingo)). Duolingo's in-house art director **Greg Hartman** redrew Duo into flat geometric shapes, with more expression ([Design Week, Jan 2019](https://www.designweek.co.uk/issues/2-6-january-2019/duolingo-owl-receives-makeover-as-app-becomes-more-gamified)). Hartman also wrote the 2013 "Reshaping Duo" post. One blog credits a "Jack Morgan". That claim is unverified, so ignore it.

1. **Silhouette first.** "If the overall shape is not appealing, then the details within that shape can't compliment it successfully." The team tried many silhouettes before any detail. ([Reshaping Duo](https://blog.duolingo.com/reshaping-duo/))
2. **Head and body are one shape.** Hartman: Duo is "basically a chicken nugget with a face." There's no neck and no separate head. This gives a strong, compact silhouette that is easy to animate. ([Design Week](https://www.designweek.co.uk/issues/2-6-january-2019/duolingo-owl-receives-makeover-as-app-becomes-more-gamified), [Advertising Week](https://advertisingweek.com/the-surprising-reason-why-the-duolingo-owl-is-green/))
3. **A tiny shape vocabulary.** All Duolingo illustration uses three shapes: rounded rectangle (the most used), circle and rounded triangle. Use the fewest shapes possible, and no pointy shapes. Duo is a circle body, two soft "shark-fin" wings and two pill feet. ([design.duolingo.com/illustration](https://design.duolingo.com/illustration), now redirecting, quoted from search index; [How to draw Duo](https://blog.duolingo.com/how-to-draw-duo-the-owl))
4. **The face does the acting.** Eyes take up roughly half the front of Duo. The guide says eyes are geometric and pupils are *not* vertically centred. Mood comes from pupil size, lowered lids and a small tear shine. ([design.duolingo.com/illustration/characters](https://design.duolingo.com/illustration/characters), via search index)
5. **A quarter turn, not a mugshot.** Duo is posed at a slight quarter turn ("let him pick his best angle"). The far eye is drawn smaller and the beak offset, which gives depth without shading. ([Reshaping Duo](https://blog.duolingo.com/reshaping-duo/), [How to draw Duo](https://blog.duolingo.com/how-to-draw-duo-the-owl))
6. **Own one colour.** Duo is a green no owl is: Feather Green `#58CC02`, with a lighter Mask Green `#89E219` for the face. That is two values of one hue, and the colour *is* the brand. ([Brand Palettes](https://brandpalettes.com/duolingo-colors/))
7. **Flat and geometric because of motion.** The 2019 redraw moved to geometric shapes and flat perspective because that made animation easier. It also made the art scale crisply as vectors. ([Design Week](https://www.designweek.co.uk/issues/2-6-january-2019/duolingo-owl-receives-makeover-as-app-becomes-more-gamified), [Shape language](https://blog.duolingo.com/shape-language-duolingos-art-style/))
8. **Built as a rig of layers.** Characters are animated in Rive. There are pose states plus separate mouth states (20+ mouth shapes per character), mixed by a state machine. "You layer different parts, like eyes, brows, a mouth." Eight head and eight body moves give 64+ combinations. ([Duolingo: visemes](https://blog.duolingo.com/world-character-visemes), [Rive: Lily](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life))
9. **Restraint inside the app.** When Lily's eyes opened too wide she looked out of character, "so we had to dial it back." In the app Duo is "wholesome". The "unhinged" Duo lives on TikTok, and Duolingo keeps that tone out of PR. ([Rive: Lily](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life), [Campaign](https://campaignlive.com/article/duolingo-comms-head-sam-dalsimer-leads-wholesome-unhinged-strategy/1910699), [The Drum](https://www.thedrum.com/news/2025/02/25/duolingo-s-tiktok-mastermind-its-unhinged-social-strategy-and-killing-its-mascot))
10. **Emotion is tied to the user's state.** On the widget, Duo gets "more and more desperate as it nears midnight" while the streak is open, and relaxes once it's done. That grew into about 25 mood illustrations. Widget users retain better, even after controlling for commitment. ([Duolingo: widget](https://blog.duolingo.com/widget-feature))

**From Mobbin (what Duo looks like in use):**
- In the widget preview, Duo shrinks to **just the head and eyes** next to the streak number ([screen](https://mobbin.com/screens/11243abc-d521-46f0-ba2b-871bd71551d9)).
- On "Lesson complete" he goes huge: cropped by the frame, squashed, with motion streaks and an open mouth with no teeth ([screen](https://mobbin.com/screens/b2f67911-aff3-46eb-a7b5-e2055efb1772)).
- On the plan picker he is a small head in the top-left with a speech bubble, well away from the buttons ([screen](https://mobbin.com/screens/3a223593-d3c7-48fc-bb96-27d9f9e79fca)).
- His feet float below the body ([screen](https://mobbin.com/screens/7e61a85a-cd3c-4d2f-b282-79a15c33c55d)).

---

## 3. Lessons from other app mascots

**Finch (bird).** The most minimal mascot in the category. It's a peach bean with two dot eyes, a tiny beak, no outline and one flat ground shadow. It sits small in lots of empty space. Personality comes from pose and tiny eye changes (closed eyes for calm, ^^ for joy). On the paywall the bird hugs a heart *above* the offer and never touches the button. Lesson: simplicity reads as warmth, and a small character with space around it feels calm. ([welcome](https://mobbin.com/screens/79d7804c-51ed-4072-ba36-f2e72137fd4b), [paywall](https://mobbin.com/screens/70fe0e89-9150-48bf-ae6b-1bb69803107f), [celebration](https://mobbin.com/screens/87a4df00-120f-4fed-bbbd-28c7637e6c4b), [Engadget review](https://www.engadget.com/apps/this-self-care-virtual-pet-is-helping-me-get-my-act-together-160027169.html))

**BitePal (raccoon, our anti-reference).** Light grey-lavender body, heavy black outline, front-facing and symmetrical. The head is about 60% of the height, with huge round white-ringed eyes inside a black mask band. It has a white heart on the chest, a grey/black ringed tail and an open grin. It sits *above the dashboard data* on Home. Lesson: everything here is what we avoid. That means grey, black outlines, front view, giant sclera eyes, big-head sticker proportions and a mascot squatting on the data screen. ([pet screen](https://mobbin.com/screens/b4bd8e47-e8a0-45ac-8170-61ac7cee286e), [home](https://mobbin.com/screens/51e4e1aa-21b7-48c2-bef1-ac3e3c642845), [reminders](https://mobbin.com/screens/083cc63f-4506-4dd8-9fc4-b20c2dba4f77), [App Store](https://apps.apple.com/us/app/-/id6479529917))

**Mailchimp's Freddie (Collins, 2018).** Collins kept almost everything about Freddie, including the wink. They simplified him into a cleaner, single-colour mark with a stronger silhouette, so he works at any size. The new wordmark was drawn "to better connect with a more simplified Freddie." Lesson: the mascot should also work as a **one-colour mark**. If it needs full colour to read, it's too complex. ([Creative Review](https://www.creativereview.co.uk/mailchimp-goes-yellow-in-rebrand-by-collins/), [It's Nice That](https://www.itsnicethat.com/news/mailchimp-collins-brand-system-graphic-design-270918))

**Headspace (2024 refresh, in-house with Italic Studio).** The orange smiley is a single circle that now shows a range of emotions. Its soft curves even shaped the custom typeface. Characters are round, solid shapes in soft colours, built to feel calm, not silly. Lesson: one simple geometric form plus a face can carry a whole brand. A calm brand can still have an expressive character if the shapes stay soft. ([Design Compass](https://designcompass.org/en/2024/04/30/headspace/), [It's Nice That](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424))

**Notion Faces (BUCK with Roman Muradov).** A modular avatar system: a library of interchangeable facial features and accessories, all hand-drawn to one style, then "lined up visually across the system." Personality matters more than likeness. Lesson: design expressions as a **parts library** (eyes, brows, mouths) that snap onto one head. That is exactly how our expression rig should work. ([BUCK](https://buck.co/work/notion-faces))

**Celebration and empty states across apps (Mobbin).** Kit's empty state is one black ball with two eyes ([screen](https://mobbin.com/screens/dab9bc19-3a71-4c0f-aefd-d51afac2d129)). It proves one shape plus eyes is enough. Agoda's red ball cries over an empty wallet ([screen](https://mobbin.com/screens/6c47d9b9-7520-4d89-bee8-c61c059f9621)). Alan's furry 3D bear ([screen](https://mobbin.com/screens/78ceaa47-e48b-4cd4-913e-69c8bb776ccd)) shows how heavy fur texture feels next to flat UI. Ahead's spiky red blob ([screen](https://mobbin.com/screens/8246b3c6-7703-4f02-99fc-b16c8349f2cd)) shows that spikes read as alarm even when the face smiles. Lesson: round shapes and flat colour, and keep spikes for the "worried" sweat drop, not the body.

**General principles (character design guides).** Do the silhouette test: fill it black and it must still read. Pick one dominant shape that matches the personality (circles are friendly, squares stable, sharp triangles dangerous). Shrink it to icon size and simplify until it reads. Make a dedicated small-size variant. Limit the palette to 3–4 colours. ([Made Good Designs](https://madegooddesigns.com/character-design-basics/), [Studio Liddell](https://studioliddell.com/news/the-ultimate-guide-to-character-design-fundamentals))

---

## 4. Art direction for the Ditch raccoon

### 4.1 The idea in one line
A teal, one-piece squircle raccoon with a dark inset mask, light eyes and a big ringed tail. It flicks cards away with one snap of the paw.

The squircle body echoes the iOS app-icon shape and the subscription card's rounded corners. The raccoon is "made of the same stuff" as the UI.

### 4.2 Construction (basic shapes only)
Measure everything in **U = the body's width**.

| Part | Shape | Size and placement |
|---|---|---|
| **Body = head** | One superellipse (squircle, corner smoothing like the iOS icon), slightly egg-shaped: 4–6% narrower at the top. **No neck. No separate head.** | Width 1.0 U, height 1.1 U. |
| **Ears** | Two near-semicircles (circles cut by the body). No inner-ear shape. | Diameter 0.26 U. Set 0.12 U in from each side and sunk 40% into the body. In the ¾ view the far ear is 85% size. |
| **Mask** | One dark rounded band, like a domino mask. Its top edge is straight. Its bottom edge dips in a soft V over the nose, and its ends taper and curve down slightly. | Width 0.80 U, height 0.24 U. Its centre sits 0.38 U from the top of the body. **Inset at least 0.08 U from the outline, so it never touches the edge.** |
| **Eyes** | Light rounded rectangles (vertical lozenges, 1 : 1.35) set *inside* the mask, each with a dark pupil. The pupil is about 60% of the eye and sits high, toward the gaze. | Eye width 0.11 U, gap between eyes 0.20 U. In ¾ view the far eye is 85% size. |
| **Muzzle** | Light soft rounded triangle, point down. Its top tucks under the mask's V. | Width 0.34 U, height 0.20 U. |
| **Nose** | Dark rounded triangle, wider than tall, on top of the muzzle where it meets the mask. | 0.09 U × 0.06 U. |
| **Mouth** | A dark line or a dark filled shape (see §4.6). **Never teeth.** | Below the nose, inside the muzzle. |
| **Arms** | Short capsules (pills) with mitten ends. No fingers. Body colour. | Length 0.30 U, thickness 0.12 U. Attached at 0.62 U from the top. |
| **Legs** | Two short capsules or ovals. They may float just below the body, as Duo's feet do. | Height 0.10 U, gap 0.18 U. |
| **Tail** | One fat capsule bent into a "J". It comes out from behind the body on one side and curls up past the hip. **3 dark rings** run straight across the tail, and **the tip is body colour.** | Length 0.95 U along the curve, thickness 0.30 U. Its top reaches 0.55 U from the ground. It always sticks out of the silhouette. |
| **Ground** | One flat ellipse shadow (optional). | Width 0.9 U, 8% opacity of ink. |

Counting the mask, eye fills, pupils, muzzle, nose and mouth, that's **about 15 shapes**, down from round 1's ~20. The big shapes (body, tail) are big. The small ones (eyes, nose) are small. Nothing in between competes.

**Proportions:** the total height with ears and legs is about 1.35 U. The face is about 45% of the body's height, so it is large enough to act but not big-head chibi. The tail adds about 0.35 U of width on one side, which makes the silhouette **asymmetric** and memorable.

**Default view:** a ¾ turn toward the viewer's left, with the tail on the viewer's right. Never draw a symmetrical front-on mugshot for hero art. That is BitePal's look.

### 4.3 Silhouette and the 32 px test
- **The edge rule:** the outer edge of the silhouette is **always body colour**. The mask is inset, the tail tip is body-coloured, and the paws are body-coloured. So the shape reads on both paper and near-black, and nothing dark ever sits on the edge to melt into a dark background.
- **The fill test:** fill the figure solid black. Square body, two round bumps on top and a J-curl tail on one side should still say "masked animal with a tail". Ask yourself whether it could be anything but a raccoon.
- **Small variant (≤ 48 px; widget, notification, settings, 29–32 pt):**
  - Keep the body, ears, mask, eyes and tail.
  - Drop the mouth, pupils, legs and arms.
  - Use **2 tail rings, not 3**.
  - Eyes become plain light lozenges.
  - Make the mask 10% taller.

  Test at 32 × 32 px on paper, on `#000000`, and in iOS tinted (single-colour) widget mode.
- **Three values, not just three hues:** Lagoon is a mid value, Night Pine dark and Oat light. In iOS 18+ tinted or clear widget modes the art is drawn as one colour by brightness. Because these three values stay far apart, the mask, eyes and body still separate.

### 4.4 Colour (3 colours on the body, plus 1 accent for props)

| Role | Name | Hex | Where |
|---|---|---|---|
| Body | **Lagoon** | `#2F8F86` | Body, ears, arms, legs, tail base, tail tip. |
| Mask and details | **Night Pine** | `#132A22` | Mask, pupils, nose, mouth, tail rings, brows. |
| Light | **Oat** | `#FFF4E0` | Eyes and muzzle only. **No belly patch, no cheek patches.** |
| Accent (props only) | **Lime** | `#B6E97A` | The subscription card, savings sparks and "+$" pops. **Never on the raccoon's body.** |

Why these:
- **Lagoon is pine "turned up".** It's the same family as the brand pine `#224332`, the way Duo's Mask Green is Feather Green's sibling. So the raccoon belongs to Ditch, but it is a colour no real raccoon is.
- It is not grey (BitePal), not brown (Rocket, Richard), not rust/orange (that reads as red panda or fox), and not neon yellow-green (Duo).
- **Contrast (measured):**
  - Lagoon vs paper `#F6F5F0`: 3.57:1. Lagoon vs charcoal `#232C27`: 3.69:1. Lagoon vs black: 5.39:1. So the silhouette reads equally on light and dark.
  - Night Pine vs Lagoon: 3.9:1, so the mask reads. Oat vs Night Pine: 13.9:1, so the eyes pop at any size.
  - Lime vs Lagoon: 2.8:1, with a strong hue shift, so the card separates from the paw.
- The UI palette stays as it is. Brand pine `#224332` is still used for UI. It is too close to charcoal (1.31:1) to be the body colour in dark mode.
- **Alternative for an A/B round:** Cornflower `#5B8DEF` body with the same Night Pine, Oat and Lime. It reads 2.96:1 on paper and 4.45:1 on charcoal, contrasts more with lime, and is less "on brand". It is used in prompt 2.

**Line:** none. No outline, no stroke. Shapes are defined only by colour, like Duo and Finch. No gradients, no texture, no inner shading. The only optional depth is the flat ground ellipse.

### 4.5 How it differs from the three raccoons to avoid

| | BitePal | Goodfood's Richard | Rocket Raccoon | **Ours** |
|---|---|---|---|---|
| Colour | Light grey/lavender and black | Realistic brown/grey puppet fur | Realistic brown/grey fur | **Teal, Night Pine and Oat. Flat, no fur.** |
| Line | Heavy black outline | None (puppet) | Painted/CG | **No line** |
| Build | Big head on a tiny body, front view | Puppet, realistic raccoon head | Lanky humanoid, pointed ears | **One-piece squircle, no neck, ¾ view, round ears** |
| Eyes | Huge round eyes with white rings | Glassy puppet eyes | Realistic eyes | **Small light lozenges inside the mask, pupils high** |
| Mouth | Open grin, shows teeth | Puppet mouth | Snarl, teeth | **Line or dark shape, never teeth** |
| Personality | Pet you feed | Food-stealing "Garbage Manager" | Gruff mercenary with guns | **Tidy, decisive: tosses things out, never eats trash** |
| Extras | Hats, heart on chest | Puppet props | Jumpsuit, weapons | **No clothes, no accessories in core art** |

Never call it "Rocket". Avoid the "trash panda / garbage" jokes, which are Richard's whole persona.

### 4.6 Personality: decisive, cheeky, tidy
- **Decisive:** weight on the front foot, chin slightly up. The flick has a tiny anticipation and no hesitation, and once a thing is gone it doesn't look back.
- **Cheeky:** a half-lidded eye, a one-sided smile and a tail flick. It is a knowing look, never sneering or "sassy hand-on-hip".
- **Tidy:** a compact, closed silhouette with paws close to the body. The bin is clean and has a lid. It never rummages, eats or wears trash.

### 4.7 The expression rig (fewest swappable parts)
Build one master body. Swap only these parts:

- **Eyes (6):**
  - `open`: default, pupils high.
  - `arc`: an upside-down U in Oat, closed and happy.
  - `half`: the top 40% of the lozenge cut flat, half-lidded.
  - `wide`: 1.2× taller, smaller pupils.
  - `wink`: one `arc`, one `open`.
  - `swirl`: a flat line with a small spiral, used for stuffed.
- **Brows (3, Night Pine bars on the body above the mask):** `none`, `up-in` (inner ends raised, worried), `one-up` (one raised, cheeky).
- **Mouth (5):**
  - `smile`: a small curve.
  - `grin`: a dark D shape, **no teeth**, no tongue.
  - `smirk`: a one-sided curve.
  - `wobble`: a wavy line.
  - `o`: a small dark oval.
- **Arms (6):** `down`, `wave`, `both-up` (V), `flick` (arm straight out, paw open), `hold` (both paws hugging an object), `point-thumb`.
- **Tail (4):** `rest` (J-curl), `swish-up`, `tuck` (wrapped round the feet), `flick` (whip, opposite to the arm).
- **Body (3):** `idle`, `stretch` (0.92 width, 1.08 height), `squash` (1.12 width, 0.9 height).
- **Extras (2):** `sweat` (one Oat drop by the head), `sparks` (3 Lime ticks).

| State | Eyes | Brows | Mouth | Arms | Tail | Body | Extra |
|---|---|---|---|---|---|---|---|
| **Welcome** (onboarding) | open | none | smile | wave | swish-up | idle | — |
| **Celebrating** ("Ditched!") | arc | none | grin | both-up | swish-up | stretch | sparks |
| **Cheeky** (paywall, empty states) | half (or wink) | one-up | smirk | point-thumb, or flick resting on the card | flick | idle | — |
| **Happy** (widget: nothing due soon) | arc | none | smile | down | rest | idle | — |
| **Worried** (widget: a charge within 48 h) | wide | up-in | wobble | hold (clutching a Lime card) | tuck | idle | sweat |
| **Stuffed** (widget: over the user's limit, or too many subs) | swirl | up-in | o | hold (arms full of a stack of 4–5 Lime cards) | tuck | squash | — |

**Note on "stuffed":** draw it as *overloaded with cards*, never as "ate too much". Puffed cheeks or a round belly would suggest eating, and the brief says it never eats trash. Have product confirm the exact trigger for each widget state.

The widget runs on WidgetKit, which shows **static images**. Rive, Lottie and JS can't run there. So export each widget state as a static PNG/PDF from the same master file. Keep the raccoon at 45% or less of a small widget so the number stays the hero. Duo's widget shows only his head for the same reason.

### 4.8 Motion plan

**The flick (signature, about 1.0 s total):**
1. **Hold (0–150 ms):** the raccoon holds the Lime card between paw and body and glances at it. Eyes go `half` and the tail lifts.
2. **Anticipation (150–270 ms):** the body leans back 4°, squashes 4%, and the arm cocks back.
3. **Flick (270–350 ms):** the arm snaps out to `flick` with one smear frame. The card launches with a 360–540° spin. Play a light haptic here.
4. **Arc (350–700 ms):** the card follows a parabola into the bin. The body follows through, leaning 6° forward. The tail whips the opposite way (overlapping action).
5. **Land (700–800 ms):** the card drops into the bin, which squashes 10% while its lid bounces. A Lime "+$X/yr" pops out. Play a success haptic.
6. **Reaction (800–1000 ms):** the raccoon brushes its paws (two quick taps), turns to the viewer with a `wink`, then settles to idle.

**Idle loop** (hero screens only: welcome and paywall header):
- A blink every 3–6 s, randomised.
- 2% breathing scale on a 3 s cycle.
- 3° tail sway on a 4 s cycle.
- Stop the loop after about 12 s on screen, so it doesn't distract while the user reads the offer.

**Celebration ("Ditched!"):** the flick (above), then a hop into `celebrating` (stretch on the way up, squash on landing) with 3 Lime sparks. Total under 1.6 s, then hold still. Once only, no looping.

**Reduce Motion:**
- Show the **final pose** as a still: celebrating for "Ditched!", welcome for onboarding.
- Use a 150–200 ms crossfade at most.
- No idle loop, no spinning card, no hops, no parallax.
- Haptics may stay.
- Read the setting with Reanimated's `useReducedMotion()` (or `AccessibilityInfo.isReduceMotionEnabled()`).
- Pass `ReduceMotion.System` on Reanimated animations.
- For Lottie, use `autoPlay={false}` and `progress={1}`.
- For Rive, set a `reduceMotion` boolean input that jumps the state machine to its end state, or render the static PNG instead.

**Placement:** the mascot is never on top of a button or tappable control. Like Duo on the plan picker, it sits above or beside the content with clear space.

**Tool choice for this Expo app (SDK 58; Reanimated 4.7.1 and react-native-svg 15.16 already installed):**

| Option | Expo Go? | Good for | Cost |
|---|---|---|---|
| **Reanimated + react-native-svg** | ✅ Already in the project | A part-swap rig: each part is an SVG `<G>`, with transforms on the arm, tail and body. The same SVG master exports the widget PNGs. | Engineers hand-code the timing. Fine for a handful of moves. |
| **lottie-react-native** (Expo SDK 58 bundles `~7.5.0`) | ✅ Included in Expo Go | Linear one-shot animations from After Effects. | No state machine. Swapping expressions means separate files, and it needs After Effects skills. (`@lottiefiles/dotlottie-react-native` is *not* in Expo Go.) |
| **Rive**: `@rive-app/react-native` 0.5.x (Nitro; replaces the legacy `rive-react-native`; needs Expo SDK ≥ 53, iOS ≥ 15.1, `react-native-nitro-modules`) | ❌ **Needs an EAS development build** (it is not in Expo's bundled modules) | What Duolingo uses. Designer-built state machine (welcome/celebrate/cheeky as inputs), bones, small files, blends between states. | Adds a native dependency and a Rive editor workflow. |

**Recommendation:**
- **Now:** ship v1 with **Reanimated + SVG**. It needs no new dependency, works in Expo Go (CLAUDE.md: "Expo Go while possible"), handles Reduce Motion natively, and uses one source for the app and the widget exports.
- **Later:** move to **Rive** if and when an animator is hired for richer acting (TikTok, more states). The EAS dev build arrives with RevenueCat and the widget anyway.
- **Either way:** have the designer deliver the master as **layered SVG with named parts** (see §4.7) so it's rig-ready for either path.

---

## 5. Image-generation prompts for round 2

Notes for running them:
- Generate the **silhouette sheet first** if a model keeps drifting.
- Reject anything that fails the 32 px test or adds an outline.
- Ask for no text in the image (labels come out garbled). Label sheets afterwards.

### Prompt 1: "Squircle" (the primary brief)
```
Character design sheet for a mobile-app mascot: a raccoon built from simple geometric vector shapes, flat colour, no outlines.
CONSTRUCTION: head and body are ONE single squircle shape (iOS app-icon superellipse), 1.0 wide × 1.1 tall, slightly narrower at the top, no neck. Two small round ears like semicircles sunk 40% into the top corners. A dark domino-mask band across the upper face (80% of body width, 24% of body height, straight top edge, soft V dip over the nose, tapered ends), inset from the outline so it never touches the edge. Inside the mask: two small light vertical rounded-rectangle eyes (ratio 1:1.35) with dark pupils placed high. Light rounded-triangle muzzle under the mask with a small dark rounded-triangle nose. Short pill-shaped arms with mitten ends, no fingers. Two short pill legs, slightly floating. One big fat tail shaped like a "J", bending up from behind one hip, length about the body's height, with exactly 3 dark straight rings and a teal tip; the tail always sticks out of the silhouette on one side.
COLOURS (exactly these, flat): body #2F8F86 teal; mask, pupils, nose, mouth and tail rings #132A22 very dark green; eyes and muzzle #FFF4E0 oat cream; nothing else on the character. Background plain #F6F5F0.
LAYOUT: one clean sheet. Top row: three-quarter front view facing left, side profile, back view, same scale, standing on a faint flat ground ellipse. Bottom row: six head-and-shoulders expressions: friendly wave with a small smile; joyful eyes closed as upside-down U arcs with an open toothless grin and both arms up; cheeky half-lidded eye with one raised brow and a one-sided smirk; calm content smile; worried with wide eyes, inner brows raised, wavy mouth and one small sweat drop; overloaded and squashed wider holding a tall stack of lime #B6E97A cards with dizzy spiral eyes and a small "o" mouth.
STYLE: crisp flat vector, Duolingo-level geometric simplicity, thick confident shapes, generous negative space, friendly and tidy, reads clearly at 32 pixels.
DO NOT: no outlines or strokes, no gradients, no texture, no fur strands, no teeth, no tongue, no grey, no brown, no black #000, no white-ringed giant eyes, no big-head chibi proportions, no front-facing symmetrical mugshot for the main view, no pointy ears or snout, no humanoid long limbs, no clothes or accessories, no cream belly patch, no cheek blush, no food or trash, no text or labels, no drop shadows, no 3D, no sticker border.
```

### Prompt 2: "Pear sitter" (softer, Finch-calm, alternative colour)
```
Character design sheet for a calm, cheeky raccoon mascot in flat vector, no outlines.
CONSTRUCTION: body and head are one pear-shaped rounded form, narrow at the top and wide at the bottom (top width 0.75, bottom width 1.0, height 1.15), sitting low on the ground like a bean bag, no neck. Tiny round ears (semicircles). A dark mask shaped like a smooth rounded bar with a gentle downward point in the middle, inset from the edges. Two light rounded-square eyes with dark pupils set high inside the mask; the far eye 85% size for a three-quarter turn. Small light soft-triangle muzzle with a dark rounded nose. Stubby pill arms without fingers, held close to the body. No visible legs, just two small rounded-rectangle feet peeking out at the bottom. A thick tail with 3 dark rings that wraps around the front of the base like a scarf, tip in body colour.
COLOURS (exactly, flat): body #5B8DEF cornflower blue; mask, pupils, nose, mouth, tail rings #132A22; eyes and muzzle #FFF4E0; props only in lime #B6E97A. Background plain #F6F5F0.
LAYOUT: one sheet. Top row: three-quarter view facing left, side view, back view, same scale. Bottom row: six expressions on the same body: welcome (one paw waving, small smile), celebrating (eyes as happy arcs, toothless open grin, both arms up, three tiny lime sparks), cheeky (one half-lidded eye, raised brow, sideways smirk), happy (eyes closed in arcs, soft smile), worried (wide eyes, raised inner brows, wavy mouth, tail tucked tight, one cream sweat drop), stuffed (squashed wider, hugging a teetering stack of lime cards, spiral eyes).
STYLE: minimal like a premium wellness app character, few shapes, lots of empty space, soft and round, flat colour only, readable as a tiny icon.
DO NOT: no outlines, no gradients, no texture or fur, no teeth, no grey or brown, no black #000, no huge round eyes with white rings, no big-head sticker style, no humanoid body, no pointy shapes, no clothes, no blush, no belly patch, no food or garbage, no text, no 3D, no shadows except one faint flat ground ellipse.
```

### Prompt 3: "One-colour mark" (logo-grade, Freddie lesson)
```
Character design sheet for a raccoon mascot that must also work as a one-colour logo mark.
CONSTRUCTION: a circle head (diameter 0.55 of total height) overlapping a soft rounded-triangle body of the same width; the head is NOT bigger than the body. Two round ears. The mask is a single bold shape; the eyes are cut out of it as negative space (light rounded-rectangle holes, pupils as small dark dots high in each hole). Soft triangle muzzle, rounded nose. Short pill arms, no fingers. A thick crescent-shaped tail curling up behind the body with 3 bands cut as gaps, tip solid.
SHEET LAYOUT on plain #F6F5F0 background, top row: (1) the character in ONE colour only, solid #132A22 with negative-space details, three-quarter view facing left; (2) the same character in colour: body #2F8F86, mask and details #132A22, eye holes and muzzle #FFF4E0; (3) the colour version on a solid #232C27 dark square to prove it reads on dark; (4) a 32-pixel-style tiny version showing only body, ears, mask, eyes and a 2-band tail. Bottom row: six heads in the colour version: welcome smile, celebrating with arc eyes and toothless grin, cheeky half-lid smirk, happy calm, worried wide-eyed with raised brows and a sweat drop, overloaded with dizzy spiral eyes.
STYLE: bold, iconic, geometric, Mailchimp-Freddie-level simplicity, flat vector, strong silhouette, built for an iOS app icon and widget.
DO NOT: no outlines or strokes, no gradients, no texture, no fur, no teeth, no grey or brown, no pure black, no giant white eyes, no chibi big head, no pointy ears, no humanoid proportions, no clothes, no blush, no belly patch, no food or trash, no text, no 3D, no drop shadows.
```

### Prompt 4: Hero pose, "the flick" (transparent background)
```
Single hero illustration of a mascot raccoon flicking a subscription card into a bin, transparent background, flat vector, no outlines.
CHARACTER: head and body are one teal #2F8F86 squircle (no neck), two small round ears, a dark #132A22 domino mask band inset from the edges, two small light #FFF4E0 rounded-rectangle eyes with dark pupils high inside the mask, light #FFF4E0 rounded-triangle muzzle with a dark rounded nose, short pill arms with mitten paws (no fingers), short pill legs, a fat J-shaped tail with 3 dark #132A22 rings and a teal tip.
POSE: three-quarter view facing right toward a bin. Weight on the front foot, body leaning forward 6 degrees, the near arm fully extended in a quick follow-through with the paw open; the other paw relaxed near the chest. One eye half-lidded, the other open, a one-sided confident smirk, mouth closed. The tail whips up and back, opposite to the arm. Confident and tidy, like a perfect basketball shot.
PROP: a lime #B6E97A rounded-rectangle card (credit-card proportions) mid-air in a clean arc, spinning, with two short lime motion ticks behind it, about to drop into a simple rounded #132A22 bin with a slightly open lid and an oat #FFF4E0 rim, standing a little to the right.
OUTPUT: transparent PNG, character and bin centred with generous padding, nothing else in frame.
DO NOT: no outlines, no gradients, no texture, no fur, no teeth, no grey or brown, no black #000, no giant white eyes, no big-head chibi style, no humanoid limbs, no clothes, no food or garbage, no mess or spilling, no text, no background, no shadows except an optional faint flat ground ellipse under the feet.
```

### Review checklist for round 2
- [ ] Head and body are one shape. There's no neck.
- [ ] It reads as a raccoon at 32 × 32 px on paper and on black.
- [ ] The silhouette edge is always body colour.
- [ ] There are no outlines, no gradients, no texture and no teeth.
- [ ] The eyes are light shapes inside a dark mask that is inset from the edge.
- [ ] Pose and colours match none of BitePal, Richard or Rocket.
- [ ] Six expressions come from swapping eyes, brows, mouth, arms and tail, not from redrawing.
- [ ] The flick shows a *card* and a *bin*, and reads as tossing, not feeding.

---

## 6. References

**Duolingo**
- Reshaping Duo (Greg Hartman, 2013): https://blog.duolingo.com/reshaping-duo/
- Shape language: Duolingo's art style (Megan Barker, 2020): https://blog.duolingo.com/shape-language-duolingos-art-style/
- How to draw Duo in 10 easy steps (2022): https://blog.duolingo.com/how-to-draw-duo-the-owl
- Duolingo illustration guidelines (now redirects; quoted from search index): https://design.duolingo.com/illustration, https://design.duolingo.com/illustration/characters
- Bringing characters to life with Rive (visemes, 2022): https://blog.duolingo.com/world-character-visemes
- Rive on Duolingo's Lily: https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life
- How we developed our widget: https://blog.duolingo.com/widget-feature
- Streak milestone design: https://blog.duolingo.com/streak-milestone-design-animation
- Design Week, owl makeover (Jan 2019): https://www.designweek.co.uk/issues/2-6-january-2019/duolingo-owl-receives-makeover-as-app-becomes-more-gamified
- Advertising Week, why Duo is green: https://advertisingweek.com/the-surprising-reason-why-the-duolingo-owl-is-green/
- Creative Review, Johnson Banks rebrand: https://www.creativereview.co.uk/duolingo-rebrand-johnson-banks/
- Johnson Banks case study: https://www.johnsonbanks.co.uk/templates/work/duolingo
- Creative Bloq, Feather Bold: https://www.creativebloq.com/news/feather-bold
- Duolingo colours: https://brandpalettes.com/duolingo-colors/
- Campaign, "wholesome unhinged": https://campaignlive.com/article/duolingo-comms-head-sam-dalsimer-leads-wholesome-unhinged-strategy/1910699
- The Drum, unhinged social strategy: https://www.thedrum.com/news/2025/02/25/duolingo-s-tiktok-mastermind-its-unhinged-social-strategy-and-killing-its-mascot
- Digiday, unhinged content: https://digiday.com/marketing/how-duolingo-is-using-its-unhinged-content-with-duo-the-owl-to-make-people-laugh-on-tiktok/

**Other mascots and principles**
- Mailchimp/Collins (Creative Review): https://www.creativereview.co.uk/mailchimp-goes-yellow-in-rebrand-by-collins/
- Mailchimp/Collins (It's Nice That): https://www.itsnicethat.com/news/mailchimp-collins-brand-system-graphic-design-270918
- Headspace rebrand (Design Compass): https://designcompass.org/en/2024/04/30/headspace/
- Headspace × Italic Studio: https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424
- Notion Faces (BUCK): https://buck.co/work/notion-faces
- Finch review (Engadget): https://www.engadget.com/apps/this-self-care-virtual-pet-is-helping-me-get-my-act-together-160027169.html
- BitePal (App Store): https://apps.apple.com/us/app/-/id6479529917
- Goodfood's Richard the Raccoon: https://lbbonline.com/news/how-a-spokesracoon-highlighted-this-canadian-food-companys-zero-waste-platform
- Character design basics (silhouette, shape language, small sizes): https://madegooddesigns.com/character-design-basics/
- Character design fundamentals: https://studioliddell.com/news/the-ultimate-guide-to-character-design-fundamentals

**Engineering**
- Rive React Native runtime: https://rive.app/docs/runtimes/react-native/react-native
- Expo Lottie (bundled in Expo Go): https://docs.expo.dev/versions/latest/sdk/lottie
- Expo Go vs development builds: https://expo.dev/blog/expo-go-vs-development-builds
- Local check: `node_modules/expo/bundledNativeModules.json` lists `lottie-react-native ~7.5.0`, `react-native-reanimated 4.7.1` and `react-native-svg 15.16.0`, and has no Rive. npm on Nov 9, 2026: `@rive-app/react-native` 0.5.12, `rive-react-native` 9.8.6 (legacy).

**Mobbin screens**
- Duolingo: [widget install](https://mobbin.com/screens/11243abc-d521-46f0-ba2b-871bd71551d9) · [Super welcome](https://mobbin.com/screens/ac4b5ce2-7cd6-4526-a872-7e7d2cd22946) · [plan picker](https://mobbin.com/screens/3a223593-d3c7-48fc-bb96-27d9f9e79fca) · [sign back in](https://mobbin.com/screens/7e61a85a-cd3c-4d2f-b282-79a15c33c55d) · [course building](https://mobbin.com/screens/995a96a7-b9e7-4d1e-bea9-cbd7a5293790) · [lesson complete](https://mobbin.com/screens/b2f67911-aff3-46eb-a7b5-e2055efb1772) · [adventure complete](https://mobbin.com/screens/6be60a24-80c6-4411-9918-9a1768aa0275)
- Finch: [weekly](https://mobbin.com/screens/79d7804c-51ed-4072-ba36-f2e72137fd4b) · [buddies](https://mobbin.com/screens/a8194440-47cf-44fd-aef1-3626c5486fe7) · [day 2](https://mobbin.com/screens/ce3547bb-aec7-4cea-8a74-2997563f2a1d) · [learn about you](https://mobbin.com/screens/cff8f15a-488e-455b-973a-e1ce9e35193f) · [paywall](https://mobbin.com/screens/70fe0e89-9150-48bf-ae6b-1bb69803107f) · [name your bird](https://mobbin.com/screens/0b3973cb-4909-47e5-a90f-aa289957b6d4) · [three stars](https://mobbin.com/screens/87a4df00-120f-4fed-bbbd-28c7637e6c4b)
- BitePal: [hats](https://mobbin.com/screens/b4bd8e47-e8a0-45ac-8170-61ac7cee286e) · [backgrounds](https://mobbin.com/screens/9044f455-3995-4a39-8e8b-a73406beb823) · [home](https://mobbin.com/screens/51e4e1aa-21b7-48c2-bef1-ac3e3c642845) · [home 2](https://mobbin.com/screens/2ee8e5d6-668b-400b-a273-e9b1d588d572) · [reminders](https://mobbin.com/screens/083cc63f-4506-4dd8-9fc4-b20c2dba4f77) · [feed](https://mobbin.com/screens/eb74890f-44ab-41bd-8933-7beebe1036c3)
- Celebrations: [Headway](https://mobbin.com/screens/8a17076b-85c0-4590-9582-0b4d92b10692) · [Alan](https://mobbin.com/screens/78ceaa47-e48b-4cd4-913e-69c8bb776ccd) · [Me+](https://mobbin.com/screens/20ba2fcf-f312-486f-947a-9a338f3c2085) · [Ahead](https://mobbin.com/screens/8246b3c6-7703-4f02-99fc-b16c8349f2cd)
- Empty states: [Kit](https://mobbin.com/screens/dab9bc19-3a71-4c0f-aefd-d51afac2d129) · [Blinkit](https://mobbin.com/screens/d247347c-77c9-49ea-a445-002a73059840) · [sweetgreen](https://mobbin.com/screens/2a629cb0-e1cb-4916-9e0d-a5fb68cb592c) · [Agoda](https://mobbin.com/screens/6c47d9b9-7520-4d89-bee8-c61c059f9621) · [Yuka](https://mobbin.com/screens/f10c9441-2680-4066-b733-e528419e54cd) · [Zomato](https://mobbin.com/screens/77a3ce52-ca55-4736-b3c7-90c760c5363b)

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
