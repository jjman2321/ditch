import { describe, expect, it } from 'vitest';

import { fitDesc, pageTitle } from './site';

const full = (t: string | { absolute: string }) => (typeof t === 'string' ? `${t} | Ditch` : t.absolute);

describe('search titles', () => {
  it('adds " | Ditch" only when the whole title stays within 60 characters', () => {
    expect(pageTitle('Privacy policy')).toBe('Privacy policy');
    const long = 'How to cancel PlayStation Plus in 2026: official steps';
    expect(pageTitle(long)).toEqual({ absolute: long });
  });
  it('never makes a title longer than 60 when the base fits', () => {
    for (const t of ['Free trial calculator: when it charges and when to cancel', 'Subscription cost calculator: your monthly and yearly total', 'Terms of use'])
      expect(full(pageTitle(t)).length).toBeLessThanOrEqual(60);
  });
});

describe('meta descriptions', () => {
  it('adds extra sentences only while it stays within 160 characters', () => {
    const d = fitDesc('A'.repeat(100), 'B'.repeat(40), 'C'.repeat(40));
    expect(d.length).toBeLessThanOrEqual(160);
    expect(d).toContain('B'.repeat(40));
    expect(d).not.toContain('C');
  });
  it('skips empty extras', () => {
    expect(fitDesc('First.', '', 'Second.')).toBe('First. Second.');
  });
});
