// Small pure helpers for onboarding copy, kept here so they can be tested.

import { shortDate, type DateOnly } from './dates';

/** "A", "A and B", "A, B and C". */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** "Spotify’s", "Disney+’s". */
export function possessive(name: string): string {
  return `${name}’s`;
}

/** "1 date" / "4 dates". */
export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * A plan name without the service's own name, for "Standard · $19.99/mo":
 * "Disney+ (With Ads)" → "With Ads", "Prime (monthly)" for Amazon Prime → "Monthly".
 */
export function shortPlanName(planName: string, serviceName: string, siblings: string[] = []): string {
  let rest = planName.trim();
  const words = serviceName.split(' ');
  // The full name, or just its last word ("Prime" in "Amazon Prime").
  for (const prefix of [serviceName, words[words.length - 1]]) {
    if (prefix && rest.toLowerCase().startsWith(prefix.toLowerCase() + ' ')) {
      rest = rest.slice(prefix.length).trim();
      break;
    }
  }
  // A first word every plan shares says nothing ("Premium Individual", "Premium Duo" → "Individual").
  const first = rest.split(' ')[0];
  if (siblings.length > 1 && rest.includes(' ') && siblings.every((x) => x.trim().split(' ')[0] === first)) rest = rest.slice(first.length).trim();
  const paren = /^\((.+)\)$/.exec(rest);
  if (paren) rest = paren[1];
  return rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : planName;
}

/** "Amazon Prime and Disney+", "Netflix, Hulu and 3 more". */
export function namesLine(names: string[], max = 2): string {
  if (names.length <= max + 1) return joinNames(names);
  return `${names.slice(0, max).join(', ')} and ${names.length - max} more`;
}

/**
 * Split a label into two balanced lines at a space: the split with the
 * shortest longer line (by characters); on a tie, the longer first line.
 * A line never ends on a little word ("if", "&"). Non-breaking spaces
 * ("Lock Screen") never split.
 */
export function balanceLines(label: string): string {
  const words = label.split(' ');
  let best = label;
  let longest = Infinity;
  for (let i = 1; i < words.length; i++) {
    if (words[i - 1].length <= 2 && words.length > 2) continue;
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const m = Math.max(a.length, b.length);
    if (m <= longest) {
      longest = m;
      best = `${a}\n${b}`;
    }
  }
  return best;
}

/** The dry nudge at the end of a reminder, by kind of service. */
export function stillUsingIt(category: string | undefined): string {
  switch (category) {
    case 'Streaming':
      return 'Still watching?';
    case 'Music':
    case 'Music & audio':
      return 'Still listening?';
    case 'News':
    case 'News & reading':
      return 'Still reading?';
    case 'Gaming':
      return 'Still playing?';
    default:
      return 'Still using it?';
  }
}

/** "≈ £1,240 a year in all · Nov 10 rates": the rough combined total (DECISIONS #32). */
export function approxLine(amount: string, period: 'a month' | 'a year', ratesDate: DateOnly): { text: string; spoken: string } {
  return {
    text: `≈ ${amount} ${period} in all · ${shortDate(ratesDate)} rates`,
    spoken: `About ${amount} ${period} in all, at ${shortDate(ratesDate)} exchange rates.`,
  };
}
