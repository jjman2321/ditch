# Welcome screen v29: internal audit (Nov 19, 2026)

Blind reviewer (independent agent, saw v27 only) + my own checks. v27 scored ~7 overall.

## Fixed in v29
- Pill: flat sunflower, no gloss or shadow, -2° tilt, bell 23px, line-height 40 (even headline line gaps).
- Declutter: 4 sparkles removed; outer ring 6 → 4, set in the corners; logo tilts ±9° → ±5°.
- Apple Music icon removed (App Review risk using Apple's own icons); Hulu in its place. Amazon tried, too muddy.
- Vertical balance: spacers .8 / .5 / .45 (was .7 / .55 / 1); art scale 1.05 on 390, 1.18 on 440; headline 38/42 on 440-wide.
- Dark mode: faded logos keep their colour (were muddy).
- Subtitle: "Every subscription in one place. Reminders before you get charged." (two clean sentences, same words).
- Fine print: "Free to track. Your list stays on your phone." (true: CLAUDE.md rule 5).

## Rejected
- Reviewer's subtitle used "heads-up" (banned, DECISIONS #22).
- Headline change to "Know what renews before it charges": owner picked "Know what renews next."
- "Find my subscriptions" button: the next screen is an intro slide, not finding, so "Get started" stays honest.

## Contrast (WCAG)
Headline 17.2:1 · subtitle 6.6:1 · pill text 12.2:1 · dark subtitle 8.3:1 · buttons 18.4:1 / 12.2:1. All pass AA.

## For the build
- VoiceOver: headline = one header "Know what renews next."; bell and logo cluster hidden; button hint "Starts a short intro".
- Dynamic Type: headline maxFontSizeMultiplier 1.3; subtitle and fine print scale fully; at accessibility sizes hide the logo cluster so the button never scrolls off.
- Logos: use higher-resolution sources (current files are 120px, soft on 3x screens).
- Motion: duck icon pops, logos fan out, pill slides in, bell rings once; Reduce Motion shows the finished screen.
- Still not 10: the duck art itself (needs the pro redraw or a 3D render).
