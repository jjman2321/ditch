// "Your rights" in cancel help (DECISIONS #60, item 5): short, dated, sourced
// lines about cancellation law where the user lives. The law as we read it,
// never legal advice, and never a claim that Ditch enforces or cancels anything.

import { RIGHTS } from './rights.data';

export type RightsLink = { label: string; url: string };
export type RightsRegion = { id: string; title: string; text: string; sources: RightsLink[]; help?: RightsLink };
export type RightsData = { checked: string; disclaimer: string; countries: Record<string, string[]>; regions: RightsRegion[] };

/** The regions that apply in a country, most local first. Empty when we haven't checked that country. */
export function rightsFor(country: string | null, data: RightsData = RIGHTS): RightsRegion[] {
  if (!country) return [];
  const ids = data.countries[country] ?? [];
  return ids.map((id) => data.regions.find((r) => r.id === id)).filter((r): r is RightsRegion => !!r);
}

/** "the US", "Germany": for "Your rights in …". */
export function rightsPlace(country: string): string {
  return { US: 'the US', GB: 'the UK', NL: 'the Netherlands' }[country] ?? ({ DE: 'Germany', FR: 'France', IE: 'Ireland', IT: 'Italy', ES: 'Spain' }[country] ?? country);
}

export const RIGHTS_CHECKED = RIGHTS.checked;
export const RIGHTS_DISCLAIMER = RIGHTS.disclaimer;
