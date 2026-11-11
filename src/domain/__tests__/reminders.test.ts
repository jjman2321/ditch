import { demoData } from '@/dev/demo';
import { proTrialSub } from '@/state/fromOnboarding';

import {
  MAX_PENDING,
  atTime,
  fingerprint,
  nextReminder,
  planReminders,
  reconcile,
  type PlanSettings,
  type PlannedReminder, reminderDaysFor, whenLabel } from '../reminders';
import { DEFAULT_SETTINGS } from '../settings';
import { confirmCancel, ditchSub, makeSub, type Sub } from '../subs';

const TODAY = '2026-11-09'; // Monday
const NOW = new Date(2026, 10, 9, 9, 41); // Mon, Nov 9 2026, 9:41 AM local
const FREE: PlanSettings = { reminderTime: '09:00', leadDays: [3, 1], currency: 'USD', pro: false };
const PRO: PlanSettings = { ...FREE, pro: true };

const demo = () => demoData('demo', TODAY).subs;
const at = (y: number, m: number, d: number, h = 9, min = 0) => new Date(y, m - 1, d, h, min).getTime();
const when = (plan: PlannedReminder[]) => plan.map((r) => [r.subId, r.fireAt.getTime()]);
const forSub = (plan: PlannedReminder[], id: string) => plan.filter((r) => r.subId === id);

function sub(fields: Partial<Sub> & { name: string }): Sub {
  return makeSub({ amountMinor: 1799, currency: 'USD', cycle: 'monthly', anchor: '2026-11-14', dateSource: 'next', freePick: true, category: 'Streaming', ...fields });
}

describe('defaults: 3 days and 1 day before, at 9:00 local', () => {
  it('Netflix on Sat, Nov 14 gets Wed, Nov 11 and Fri, Nov 13 at 9:00 AM, in the dry voice', () => {
    const plan = forSub(planReminders([sub({ id: 'n', name: 'Netflix' })], FREE, NOW), 'n');
    expect(plan.slice(0, 2).map((r) => [r.fireAt.getTime(), r.body])).toEqual([
      [at(2026, 11, 11), 'Netflix renews Saturday. $17.99. Still watching?'],
      [at(2026, 11, 13), 'Netflix renews tomorrow. $17.99. Last call if you’re done with it.'],
    ]);
    expect(plan[0].title).toBe('');
    expect(plan[0].id).toBe('sub:n:2026-11-14:3');
  });

  it('keeps going for every charge in the next year (12 monthly charges, 24 reminders)', () => {
    const plan = planReminders([sub({ id: 'n', name: 'Netflix' })], FREE, NOW);
    expect(plan).toHaveLength(24);
    expect(plan[2].chargeDate).toBe('2026-12-14');
  });

  it('honours the chosen time', () => {
    const plan = planReminders([sub({ id: 'n', name: 'Netflix' })], { ...FREE, reminderTime: '18:30' }, NOW);
    expect(plan[0].fireAt.getTime()).toBe(at(2026, 11, 11, 18, 30));
  });

  it('a week or more ahead names the date; no price leaves the price out', () => {
    const plan = planReminders([sub({ id: 'g', name: 'Gym', amountMinor: null, currency: null, category: null, anchor: '2026-11-30' })], { ...PRO, leadDays: [7] }, NOW);
    expect(plan[0].body).toBe('Gym renews on Mon, Nov 30. Still using it?');
  });
});

describe('who gets them', () => {
  it('free: only the picked subs that have a date (Amazon Prime is picked but has no date)', () => {
    const plan = planReminders(demo(), FREE, NOW);
    expect([...new Set(plan.map((r) => r.subId))].sort()).toEqual(['chatgpt', 'netflix']);
  });

  it('pro: all active ones, minus muted, with custom lead times', () => {
    const subs = demo().map((s) => (s.id === 'disney' ? { ...s, muted: true } : s));
    const plan = planReminders(subs, { ...PRO, leadDays: [7, 1] }, NOW);
    // Disney+ is muted; Amazon Prime has no date yet.
    expect([...new Set(plan.filter((r) => r.kind !== 'keep-going').map((r) => r.subId))].sort()).toEqual(['chatgpt', 'netflix', 'spotify', 'youtube']);
    expect(forSub(plan, 'chatgpt').slice(0, 2).map((r) => r.lead)).toEqual([7, 1]);
  });

  it('free ignores custom lead times (custom timing is Pro)', () => {
    const plan = planReminders(demo(), { ...FREE, leadDays: [7] }, NOW);
    expect(new Set(plan.map((r) => r.lead))).toEqual(new Set([3, 1]));
  });

  it('cancelled-for-real and deleted subs get nothing', () => {
    const n = sub({ id: 'n', name: 'Netflix' });
    expect(planReminders([confirmCancel(ditchSub(n, TODAY), TODAY), { ...n, id: 'd', status: 'deleted' }], PRO, NOW)).toEqual([]);
  });
});

describe('no date, no reminder (DECISIONS #33)', () => {
  it('a sub with no date gets nothing, even with Pro; once it has one, it gets the usual two', () => {
    const plain = sub({ id: 'x', name: 'Spotify', amountMinor: 1199, dateSource: 'none' });
    expect(planReminders([plain], PRO, NOW)).toEqual([]);
    const dated = { ...plain, anchor: '2026-11-16', dateSource: 'next' as const };
    expect(planReminders([dated], PRO, NOW).slice(0, 2).map((r) => r.body)).toEqual([
      'Spotify renews Monday. $11.99. Still watching?', // the test helper's category is Streaming
      'Spotify renews tomorrow. $11.99. Last call if you’re done with it.',
    ]);
  });

  it('a ditched sub with no date gets no last check (there is no day to check against)', () => {
    const d = ditchSub(sub({ id: 'y', name: 'Max', dateSource: 'none' }), TODAY);
    expect(d.cancelBy).toBeNull();
    expect(planReminders([d], PRO, NOW)).toEqual([]);
  });
});

describe('the Ditch Pro trial (DECISIONS #15)', () => {
  const trial = { ...proTrialSub(TODAY, 'x'), id: 'trial' };

  it('Mon, Nov 16 charge → heads-ups Fri, Nov 13 and Sun, Nov 15 at 9:00', () => {
    const plan = planReminders([trial], PRO, NOW);
    expect(plan.map((r) => [r.fireAt.getTime(), r.body])).toEqual([
      [at(2026, 11, 13), 'Your Ditch Pro trial ends Monday. Then it’s $29.99 a year. Keep it or ditch it.'],
      [at(2026, 11, 15), 'Your Ditch Pro trial ends tomorrow. $29.99 a year after that. Cancel in iPhone Settings if you’re done.'],
    ]);
  });

  it('always 3 and 1 days, even with custom Pro timing, and never counts toward the free 3', () => {
    const plan = planReminders([...demo(), trial], { ...FREE, leadDays: [7] }, NOW);
    expect(forSub(plan, 'trial').map((r) => r.lead)).toEqual([3, 1]);
    expect([...new Set(plan.map((r) => r.subId))].sort()).toEqual(['chatgpt', 'netflix', 'trial']);
  });

  it('stops once the trial charge has passed', () => {
    expect(planReminders([trial], PRO, new Date(2026, 10, 17, 8))).toEqual([]);
  });
});

describe('a tracked free trial', () => {
  it('Hulu trial ending Fri, Nov 20: trial words first, normal words after', () => {
    const hulu = sub({ id: 'h', name: 'Hulu', amountMinor: 999, anchor: '2026-11-20', isTrial: true });
    const plan = planReminders([hulu], FREE, NOW);
    expect(plan.slice(0, 3).map((r) => [r.kind, r.body])).toEqual([
      ['trial', 'Your Hulu trial ends Friday. Then it’s $9.99 a month.'],
      ['trial', 'Your Hulu trial ends tomorrow. It’ll charge $9.99.'],
      ['heads-up', 'Hulu renews Sunday. $9.99. Still watching?'],
    ]);
  });
});

describe('ditched, not cancelled yet: exactly one last check', () => {
  it('"Did you cancel Netflix? It charges tomorrow." on Fri, Nov 13 at 9:00, even if it wasn’t a free pick', () => {
    const n = ditchSub(sub({ id: 'n', name: 'Netflix', freePick: false }), TODAY);
    const plan = planReminders([n], FREE, NOW);
    expect(plan.map((r) => [r.kind, r.fireAt.getTime(), r.body])).toEqual([['last-check', at(2026, 11, 13), 'Did you cancel Netflix? It charges tomorrow.']]);
  });

  it('the ditched Pro trial asks about the trial', () => {
    const t = ditchSub({ ...proTrialSub(TODAY, 'x'), id: 't' }, TODAY);
    const plan = planReminders([t], PRO, NOW);
    expect(plan.map((r) => [r.fireAt.getTime(), r.body])).toEqual([[at(2026, 11, 15), 'Did you cancel your Ditch Pro trial? It charges tomorrow.']]);
  });

  it('too late for the last check → nothing (never in the past)', () => {
    const n = ditchSub(sub({ id: 'n', name: 'Netflix' }), TODAY);
    expect(planReminders([n], FREE, new Date(2026, 10, 13, 9, 0, 1))).toEqual([]);
  });
});

describe('never in the past; today at 9:00 is the edge', () => {
  const n = () => [sub({ id: 'n', name: 'Netflix' })];
  it('at 8:59 on Wed, Nov 11 the 9:00 heads-up today is still planned', () => {
    expect(planReminders(n(), FREE, new Date(2026, 10, 11, 8, 59))[0].fireAt.getTime()).toBe(at(2026, 11, 11));
  });
  it('at exactly 9:00 it is not (it would fire in the past)', () => {
    expect(planReminders(n(), FREE, new Date(2026, 10, 11, 9, 0, 0))[0].fireAt.getTime()).toBe(at(2026, 11, 13));
  });
  it('3-day one passed, 1-day one still ahead → only the 1-day one for this charge', () => {
    const plan = planReminders(n(), FREE, new Date(2026, 10, 12, 12));
    expect(plan.filter((r) => r.chargeDate === '2026-11-14').map((r) => r.lead)).toEqual([1]);
  });
  it('a charge due today gets nothing more; the next cycle is planned', () => {
    const plan = planReminders(n(), FREE, new Date(2026, 10, 14, 7));
    expect(plan[0].chargeDate).toBe('2026-12-14');
    expect(plan.every((r) => r.fireAt.getTime() > new Date(2026, 10, 14, 7).getTime())).toBe(true);
  });
});

describe('month-end and leap-year anchors', () => {
  it('monthly on the 31st: Jan 31 → Feb 28 → Mar 31, reminders follow the clamp', () => {
    const s = sub({ id: 'm', name: 'Gym', anchor: '2027-01-31', category: null });
    const plan = planReminders([s], FREE, new Date(2027, 0, 20, 12));
    expect(plan.slice(0, 6).map((r) => r.fireAt.getTime())).toEqual([
      at(2027, 1, 28),
      at(2027, 1, 30),
      at(2027, 2, 25),
      at(2027, 2, 27),
      at(2027, 3, 28),
      at(2027, 3, 30),
    ]);
  });

  it('yearly on Feb 29: Feb 28 in 2027, Feb 29 again in 2028', () => {
    const s = sub({ id: 'y', name: 'Domain', cycle: 'yearly', anchor: '2024-02-29', dateSource: 'receipt' });
    const plan = planReminders([s], FREE, new Date(2027, 1, 1, 12), { horizonDays: 500 });
    expect(plan.map((r) => r.chargeDate)).toEqual(['2027-02-28', '2027-02-28', '2028-02-29', '2028-02-29']);
    expect(plan.map((r) => r.fireAt.getTime())).toEqual([at(2027, 2, 25), at(2027, 2, 27), at(2028, 2, 26), at(2028, 2, 28)]);
  });

  it('a receipt anchor rolls forward through every missed cycle', () => {
    const s = sub({ id: 'r', name: 'Netflix', anchor: '2026-06-14', dateSource: 'receipt' });
    expect(planReminders([s], FREE, NOW)[0].chargeDate).toBe('2026-11-14');
  });
});

describe('no duplicates, at most 64, soonest first', () => {
  it('the same sub twice in the input still schedules each reminder once', () => {
    const s = sub({ id: 'n', name: 'Netflix' });
    const plan = planReminders([s, { ...s }], FREE, NOW);
    expect(new Set(plan.map((r) => r.id)).size).toBe(plan.length);
    expect(plan).toHaveLength(24);
  });

  it('caps at 60, keeps the soonest, and the last slot asks them to open Ditch', () => {
    const many = Array.from({ length: 40 }, (_, i) => sub({ id: `s${i}`, name: `Sub ${i}`, anchor: `2026-11-${String(10 + (i % 20)).padStart(2, '0')}`, cycle: 'weekly' }));
    const all = planReminders(many, PRO, NOW, { cap: 10_000 });
    const plan = planReminders(many, PRO, NOW);
    expect(all.length).toBeGreaterThan(MAX_PENDING);
    expect(plan).toHaveLength(MAX_PENDING);
    expect(plan.slice(0, -1)).toEqual(all.slice(0, MAX_PENDING - 1));
    const last = plan[plan.length - 1];
    expect(last.kind).toBe('keep-going');
    expect(last.id).toMatch(/^keep:/);
    expect(last.fireAt.getTime()).toBeGreaterThan(plan[plan.length - 2].fireAt.getTime());
    for (let i = 1; i < plan.length; i++) expect(plan[i].fireAt.getTime()).toBeGreaterThanOrEqual(plan[i - 1].fireAt.getTime());
  });

  it('no keep-going reminder when everything fits', () => {
    const one = [sub({ id: 'y', name: 'Yearly one', anchor: '2027-03-01', cycle: 'yearly' })];
    expect(planReminders(one, PRO, NOW).some((r) => r.kind === 'keep-going')).toBe(false);
  });

  it('the plan is stable: same input, same output', () => {
    expect(when(planReminders(demo(), PRO, NOW))).toEqual(when(planReminders(demo(), PRO, NOW)));
  });
});

describe('reconcile (cancel ours, schedule the plan, nothing twice)', () => {
  const plan = planReminders([sub({ id: 'n', name: 'Netflix' })], FREE, NOW).slice(0, 2);
  const existing = plan.map((r) => ({ id: r.id, fingerprint: fingerprint(r) }));

  it('nothing to do when the phone already matches', () => {
    expect(reconcile(existing, plan)).toEqual({ cancel: [], schedule: [] });
  });

  it('a changed time or text is cancelled and scheduled again', () => {
    const changed = [{ ...plan[0], body: 'new words' }, plan[1]];
    const r = reconcile(existing, changed);
    expect(r.cancel).toEqual([plan[0].id]);
    expect(r.schedule.map((x) => x.body)).toEqual(['new words']);
  });

  it('stale ones go, duplicates go, other apps’ ids (the test reminder) stay', () => {
    const r = reconcile([...existing, existing[0], { id: 'sub:old:2026-01-01:3', fingerprint: 'x' }, { id: 'test:1', fingerprint: null }], plan);
    expect(r.cancel.sort()).toEqual([plan[0].id, 'sub:old:2026-01-01:3'].sort());
    expect(r.schedule).toEqual([]);
  });

  it('starting from nothing schedules everything', () => {
    expect(reconcile([], plan).schedule).toHaveLength(2);
  });
});

it('nextReminder names the soonest one', () => {
  const plan = planReminders(demo(), FREE, NOW);
  expect(nextReminder(plan, demo())).toEqual({ name: 'Netflix', fireAt: atTime('2026-11-11', '09:00') });
  expect(nextReminder([], [])).toBeNull();
  expect(DEFAULT_SETTINGS.reminderTime).toBe('09:00');
});

describe('the Pro trial stays off your list but still reminds you', () => {
  it('plans its two reminders from the saved list', () => {
    const trial = { ...proTrialSub(TODAY, 'x'), id: 'trial' };
    expect(planReminders([trial], PRO, NOW).map((r) => r.kind)).toEqual(['pro-trial', 'pro-trial']);
  });
});

describe('whenLabel', () => {
  it('says today, tomorrow, or the date, with the reminder time', () => {
    expect(whenLabel(new Date(2026, 10, 10, 9, 0), '2026-11-10', '09:00')).toBe('Today, 9 AM');
    expect(whenLabel(new Date(2026, 10, 11, 9, 0), '2026-11-10', '09:00')).toBe('Tomorrow, 9 AM');
    expect(whenLabel(new Date(2026, 10, 14, 18, 30), '2026-11-10', '18:30')).toBe('Sat, Nov 14, 6:30 PM');
  });
});

describe('reminderDaysFor', () => {
  it('leaves out a reminder whose time has passed today', () => {
    const at10 = new Date(2026, 10, 10, 10, 0);
    // Charge Wed Nov 11: the 1-day reminder is today at 9:00, already gone.
    expect(reminderDaysFor('2026-11-11', at10, [3, 1], '09:00')).toEqual([]);
    expect(reminderDaysFor('2026-11-13', at10, [3, 1], '09:00')).toEqual(['2026-11-12']);
    // A later reminder time is still to come today.
    expect(reminderDaysFor('2026-11-11', at10, [3, 1], '18:30')).toEqual(['2026-11-10']);
    expect(reminderDaysFor('2026-11-20', at10, [7, 3, 1], '09:00')).toEqual(['2026-11-13', '2026-11-17', '2026-11-19']);
  });
});

describe('trial ends with custom lead days', () => {
  it('always gets the 3-day and 1-day reminders as well', () => {
    const t = sub({ id: 'tr', name: 'Trial', anchor: '2026-11-25', cycle: 'monthly', isTrial: true });
    const plan = planReminders([t], { ...PRO, leadDays: [7] }, NOW).filter((r) => r.chargeDate === '2026-11-25');
    expect(plan.map((r) => r.lead).sort((a, b) => b - a)).toEqual([7, 3, 1]);
  });
});
