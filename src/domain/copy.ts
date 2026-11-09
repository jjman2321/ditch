// Small pure helpers for onboarding copy, kept here so they can be tested.

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

/** Main button on the charge-dates screen. */
export function datesCtaLabel(confirmed: number, guesses: number): string {
  if (confirmed === 0) return 'Use the guesses for now';
  if (guesses === 0) return confirmed === 1 ? 'Save my date' : 'Save my dates';
  return `Save ${plural(confirmed, 'date')}, keep ${plural(guesses, 'guess', 'guesses')}`;
}

/** The dry nudge at the end of a reminder, by kind of service. */
export function stillUsingIt(category: string | undefined): string {
  switch (category) {
    case 'Streaming':
      return 'Still watching?';
    case 'Music':
      return 'Still listening?';
    case 'News':
      return 'Still reading?';
    case 'Gaming':
      return 'Still playing?';
    default:
      return 'Still using it?';
  }
}
