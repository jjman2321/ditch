import { chargeDay, chargesSoonLine } from '../copy';

describe('charge days in plain words (owner, Nov 19)', () => {
  it('today, tomorrow, then the date', () => {
    expect(chargeDay('2026-11-19', '2026-11-19')).toBe('today');
    expect(chargeDay('2026-11-20', '2026-11-19')).toBe('tomorrow');
    expect(chargeDay('2026-11-21', '2026-11-19')).toBe('Sat, Nov 21');
  });
  it('a charge too soon for reminders says when it charges, never "too close"', () => {
    expect(chargesSoonLine('2026-11-19', '2026-11-19')).toBe('Charges today');
    expect(chargesSoonLine('2026-11-20', '2026-11-19')).toBe('Charges tomorrow');
    expect(chargesSoonLine('2026-12-01', '2026-11-30')).toBe('Charges tomorrow');
  });
});
