// Page spacing rules (DECISIONS #85, owner Nov 21: "the spacing is so tight"; Mobbin study of N26, Rocket Money,
// Wealthfront, Chime, Noom, Oura, Cleo, Monzo). Values are layout gaps; the title's own line box adds ~2pt,
// so what you see is ~2pt more. Content stays top-aligned (DECISIONS #84): these are fixed gaps, never flex spacers.
import { useFrame } from './Screen';

export const GAP = {
  /** One-line large title on list pages (Settings and its pages): Apple's large-title gap, 8–12pt. */
  listTitle: 10,
  /** Headline under a back row on headline pages (onboarding steps, Find, bank screens): 24pt in top apps. */
  headline: 22,
  /** Headline under the top bar that carries the centred ditch wordmark: a logo bar needs more air (28–32pt). */
  brandHeadline: 28,
  /** iPhone SE and other short screens: headline gaps shrink so the content still fits above the buttons. */
  headlineSmall: 16,
  /** Headline to its intro line: 12–16pt in top apps (was 8). */
  lead: 12,
} as const;

/** The gap above a page headline: more under the wordmark bar, less on short phones. */
export function useHeadlineGap(brandBar = false): number {
  const { small } = useFrame();
  if (small) return GAP.headlineSmall;
  return brandBar ? GAP.brandHeadline : GAP.headline;
}
