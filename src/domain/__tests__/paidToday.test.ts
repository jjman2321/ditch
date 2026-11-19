// "It charged today" and the no-date pipeline (owner, Nov 19, plan item 20).

import { chargeFrom } from '../charges';
import { addDays } from '../dates';
import { paidToday } from '../paidToday';
import { planReminders, type PlanSettings } from '../reminders';
import { chargeOfSub, homeGroups, makeSub, undatedSubs, type Sub } from '../subs';

const FREE: PlanSettings = { reminderTime: '09:00', leadDays: [3, 1], currency: 'USD', pro: false };

function sub(fields: Partial<Sub> & { name: string }): Sub {
  return makeSub({ amountMinor: 1799, currency: 'USD', cycle: 'monthly', anchor: '2026-11-19', dateSource: 'next', freePick: true, category: 'Streaming', ...fields });
}

describe('It charged today: the next charge is one cycle after today', () => {
  it.each([
    ['weekly', '2026-11-19', '2026-11-26'],
    ['biweekly', '2026-11-19', '2026-12-03'],
    ['monthly', '2026-11-19', '2026-12-19'],
    ['quarterly', '2026-11-19', '2027-02-19'],
    ['semiannual', '2026-11-19', '2027-05-19'],
    ['yearly', '2026-11-19', '2027-11-19'],
    ['monthly', '2026-12-31', '2027-01-31'], // across the year
  ] as const)('%s, paid %s → next %s', (cycle, today, next) => {
    const p = paidToday(cycle, today);
    expect(p).toEqual({ anchor: today, dateSource: 'receipt', next });
    // The same answer from the saved data, today and every day up to the next charge.
    expect(chargeFrom(p.anchor, p.dateSource, cycle, today)).toBe(next);
    expect(chargeFrom(p.anchor, p.dateSource, cycle, addDays(next, -1))).toBe(next);
    expect(chargeFrom(p.anchor, p.dateSource, cycle, next)).toBe(next); // due today stays today
  });

  it('keeps the billing day through short months (Jan 31 → Feb 28 → Mar 31)', () => {
    const p = paidToday('monthly', '2027-01-31');
    expect(p.next).toBe('2027-02-28');
    expect(chargeFrom(p.anchor, p.dateSource, 'monthly', '2027-03-01')).toBe('2027-03-31');
    expect(chargeFrom(p.anchor, p.dateSource, 'monthly', '2027-04-01')).toBe('2027-04-30');
    // Leap year February.
    expect(paidToday('monthly', '2028-01-31').next).toBe('2028-02-29');
    expect(paidToday('monthly', '2026-11-30').next).toBe('2026-12-30');
  });

  it('a yearly paid on Feb 29 renews Feb 28, then Feb 29 again in a leap year', () => {
    const p = paidToday('yearly', '2028-02-29');
    expect(p.next).toBe('2029-02-28');
    expect(chargeFrom(p.anchor, p.dateSource, 'yearly', '2031-03-01')).toBe('2032-02-29');
  });

  it("never reminds about today's charge, only the next one", () => {
    const now = new Date(2026, 10, 19, 7, 0); // Thu, Nov 19, 7:00 AM: before 9, so today's slot is still open
    const p = paidToday('monthly', '2026-11-19');
    const s = sub({ id: 'n', name: 'Netflix', anchor: p.anchor, dateSource: p.dateSource });
    expect(chargeOfSub(s, '2026-11-19')).toBe('2026-12-19');
    const plan = planReminders([s], FREE, now).filter((r) => r.kind === 'heads-up');
    expect(plan[0].chargeDate).toBe('2026-12-19');
    expect(plan.map((r) => r.chargeDate)).not.toContain('2026-11-19');
    expect(plan.slice(0, 2).map((r) => r.lead)).toEqual([3, 1]);
  });

  it('is never "No date yet"', () => {
    const p = paidToday('monthly', '2026-11-19');
    const s = sub({ id: 'n', name: 'Netflix', anchor: p.anchor, dateSource: p.dateSource });
    expect(undatedSubs([s])).toEqual([]);
    expect(homeGroups([s], '2026-11-19').map((g) => g.title)).not.toContain('No date yet');
  });
});

describe("I'm not sure: no date, no reminders, listed under No date yet", () => {
  const s = sub({ id: 'd', name: 'Disney+', dateSource: 'none' });
  it('has no next charge and no reminders', () => {
    expect(chargeOfSub(s, '2026-11-19')).toBeNull();
    expect(planReminders([s], { ...FREE, pro: true }, new Date(2026, 10, 19, 7, 0))).toEqual([]);
  });
  it('is listed as No date yet', () => {
    expect(undatedSubs([s]).map((x) => x.id)).toEqual(['d']);
    expect(homeGroups([s], '2026-11-19').map((g) => [g.title, g.rows.map((r) => r.sub.id)])).toEqual([['No date yet', ['d']]]);
  });
});
