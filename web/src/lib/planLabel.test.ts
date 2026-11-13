import { describe, expect, it } from 'vitest';

import { planLabel } from './tools';

describe('planLabel: one readable name, no doubled words', () => {
  it.each([
    ['Netflix', 'Standard', 'Netflix Standard'],
    ['Claude Pro', 'Pro (monthly)', 'Claude Pro'],
    ['Discord Nitro', 'Nitro Basic', 'Discord Nitro Basic'],
    ['Dropbox Plus', 'Plus', 'Dropbox Plus'],
    ['Amazon Prime', 'Prime (yearly)', 'Amazon Prime'],
    ['Disney+', 'Disney+/Hulu Premium bundle (no ads)', 'Disney+/Hulu Premium bundle (no ads)'],
    ['Peacock', 'Apple TV and Peacock Premium bundle', 'Apple TV and Peacock Premium bundle'],
    ['Google AI Pro', 'Google AI Plus', 'Google AI Plus'],
  ])('%s + %s → %s', (n, p, want) => {
    expect(planLabel(n, p)).toBe(want);
  });
});
