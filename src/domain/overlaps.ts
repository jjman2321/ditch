// "Netflix twice" and "3 music services" (DECISIONS #60). Free: it's a nudge toward the ditch moment,
// never a scold. Only active subs count; ditched ones, deleted ones and Ditch's own trial don't.
// Groups are explicit lists, so a password manager and iCloud never count as the same thing.

import { spendTotals, type SpendTotal } from './money';
import { isActive, isPricedSub, isProTrial, type Sub } from './subs';

export type Overlap = {
  /** Changes when the set of subs changes, so a dismissed card comes back only if something new joins. */
  key: string;
  kind: 'twice' | 'group';
  /** "Netflix" for twice; "music apps" for a group (a plural noun that reads after "You pay for 2"). */
  label: string;
  subs: Sub[];
  /** One total per currency (rule 1: never added across currencies). */
  totals: SpendTotal[];
};

export const GROUPS: { label: string; ids: string[]; min: number }[] = [
  { label: 'music apps', ids: ['spotify', 'apple-music', 'youtube-music', 'amazon-music', 'tidal', 'deezer', 'pandora', 'qobuz', 'soundcloud', 'jiosaavn', 'gaana'], min: 2 },
  { label: 'AI chat apps', ids: ['chatgpt-plus', 'claude-pro', 'google-ai-pro', 'perplexity', 'grok', 'copilot-pro', 'le-chat'], min: 2 },
  { label: 'cloud storage plans', ids: ['icloud', 'google-one', 'dropbox', 'onedrive'], min: 2 },
  {
    label: 'video streaming services',
    ids: [
      'netflix',
      'disney-plus',
      'max',
      'hulu',
      'prime-video',
      'paramount-plus',
      'peacock',
      'apple-tv',
      'youtube-premium',
      'crunchyroll',
      'starz',
      'discovery-plus',
      'mubi',
      'shudder',
      'britbox',
      'now',
      'skyshowtime',
      'itvx',
      'stan',
      'binge',
      'neon',
      'crave',
      'jiohotstar',
      'zee5',
      'sonyliv',
      'videoland',
      'npo-plus',
      'canal-plus',
      'rtl-plus',
      'joyn',
      'wow',
      'movistar-plus',
      'mediaset-infinity',
      'timvision',
    ],
    min: 4,
  },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const totalsOf = (subs: Sub[]) => spendTotals(subs.filter(isPricedSub).map((s) => ({ amountMinor: s.amountMinor, currency: s.currency, cycle: s.cycle })));
const keyOf = (kind: string, subs: Sub[]) =>
  `${kind}:${subs
    .map((s) => s.id)
    .sort()
    .join(',')}`;

/**
 * What the Home card says (owner, Nov 19): "You pay for 2 AI chat apps" / "You pay for Netflix twice".
 * `short` drops "You pay for" for narrow screens: "2 AI chat apps" / "Netflix twice".
 */
export function overlapWhat(o: Pick<Overlap, 'kind' | 'label' | 'subs'>, { short = false }: { short?: boolean } = {}): string {
  const n = o.subs.length;
  const what = o.kind === 'twice' ? `${o.label} ${n === 2 ? 'twice' : `${n} times`}` : `${n} ${o.label}`;
  return short ? what : `You pay for ${what}`;
}

export function overlaps(subs: Sub[]): Overlap[] {
  const live = subs.filter((s) => isActive(s) && !isProTrial(s));
  const out: Overlap[] = [];
  // The same service twice: by catalog id, or by name when it was added by hand.
  const byService = new Map<string, Sub[]>();
  for (const s of live) {
    const k = s.catalogId ?? `name:${norm(s.name)}`;
    if (!norm(s.name) && !s.catalogId) continue;
    byService.set(k, [...(byService.get(k) ?? []), s]);
  }
  for (const list of byService.values()) {
    if (list.length >= 2) out.push({ key: keyOf('twice', list), kind: 'twice', label: list[0].name, subs: list, totals: totalsOf(list) });
  }
  for (const g of GROUPS) {
    const list = live.filter((s) => s.catalogId && g.ids.includes(s.catalogId));
    const distinct = new Set(list.map((s) => s.catalogId));
    if (distinct.size >= g.min) out.push({ key: keyOf('group', list), kind: 'group', label: g.label, subs: list, totals: totalsOf(list) });
  }
  return out;
}

/** The first one they haven't dismissed, or null. */
export function overlapToShow(subs: Sub[], dismissed: readonly string[]): Overlap | null {
  return overlaps(subs).find((o) => !isDismissed(o.key, dismissed)) ?? null;
}

/** Dismissed, or a smaller set of one they dismissed (one left the group): it only comes back when something new joins. */
function isDismissed(key: string, dismissed: readonly string[]): boolean {
  const [kind, ids] = key.split(':');
  const mine = ids.split(',');
  return dismissed.some((d) => {
    const [k, rest] = d.split(':');
    if (k !== kind || rest === undefined) return false;
    const theirs = new Set(rest.split(','));
    return mine.every((id) => theirs.has(id));
  });
}
