# Higgsfield playbook for Ditch

How we use Higgsfield. Researched Nov 9, 2026 from Higgsfield's model catalog and its built-in "character-sheet" workflow. Costs are live quotes from the account.

**Rule from the owner:** show the credit cost before generating anything.

## Which model for which job
| Job | Model | Cost | Why |
|---|---|---|---|
| **Design the character** (expression / turnaround sheet) | **GPT Image 2.6**, quality high, 2k, 3:2 or 16:9 | ~2.75 / image | Follows long, precise briefs best, and can output a transparent background. |
| **Keep it on-model in new poses** (welcome, flick, celebrate, cheeky, widget states) | **Nano Banana Pro**, with the approved sheet as a reference | ~2 / image | Google's model is strongest at keeping one character identical across images. It's also the cheapest. |
| Same, harder poses | **FLUX 3**, up to 10 reference images | ~3 / image | Takes many references at once (front + side + expression), which helps tricky angles. |
| **Clean cut-outs** for the app | `remove_background` tool | small | Gives a transparent PNG for any pose that came back on a background. |
| **Vector version** | GPT Image 2.6 with `output_format: svg` | ~1.5 | Scales to any size (widget, app icon) and can be recoloured. It can't take a reference image, so use it to redraw once the design is locked. |
| **In-app animation** (idle, flick, celebrate) | **AutoSprite**: one approved pose turned into a transparent sprite sheet (idle / jump / custom "flick") | quote first | Frames play in React Native with no video player and keep a transparent background. Reduce Motion can show a single frame instead. |
| Quick looping GIF | GPT Image 2.6 with `output_format: gif` | quote first | Good for previews and social posts, less for the app. |
| **Marketing / TikTok clips** | Kling 4.0 or Seedance 2.5, image-to-video | quote first | Proper video for ads. Too heavy for the app, and no transparency. |

## The pipeline
1. **Brief.** Use the mascot research (`docs/design/MASCOT-RESEARCH.md`) for shape language, proportions, colours and expression parts.
2. **Round of concepts.** 3 directions, GPT Image 2.6, about 8 credits. The owner picks one or asks for changes.
3. **Lock the sheet.** Once a direction is picked, make one clean turnaround + expression sheet. That becomes the reference for every later image.
4. **Poses.** Nano Banana Pro with the sheet as reference, one image per pose, about 2 credits each:
   - welcome, celebrating, cheeky,
   - flick (3 frames: wind-up, release, follow-through),
   - widget happy, worried, stuffed.
5. **Cut-outs.** `remove_background` where needed. Export @2x/@3x PNGs into `assets/mascot/`.
6. **Motion.** For the flick: AutoSprite sprite sheet, or the 3 keyframes animated with Reanimated (cheaper and smoother). Reduce Motion shows a single still.

Steps 3–6 cost about 9 poses × ~2 = ~18 credits, plus animation (quoted when we get there).

## Prompting rules (from Higgsfield's character-sheet workflow)
- Fill the slots in order: composition → "identical original character on all views" → identity and shape → face/eyes → colours → pose list → lighting → quality → negative list.
- Be specific: exact hex colours, shapes ("head is a rounded square"), proportions ("head is 45% of height").
- One plain seamless background, even lighting, no text, no watermark, no props unless the prompt asks for them (the bin and card).
- When changing an approved character, restate every locked detail. Change only what's asked.
- Original characters only. Never "in the style of" another brand's mascot.
