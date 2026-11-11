import { SERVICE_BY_ID } from '@/catalog/services';
import { demoData } from '@/dev/demo';
import { subsFromOnboarding } from '@/state/fromOnboarding';
import { newPick } from '@/state/picks';

import { cleanLeads, leadsLabel, parseSettings, settingsToKv, timeLabel, DEFAULT_SETTINGS } from '../settings';
import { addDays, nextChargeDate } from '../dates';
import { currencyDigits } from '../money';
import {
  calendarMonth,
  chargesBetween,
  confirmCancel,
  confirmedSavings,
  defaultFreePicks,
  ditchSub,
  homeGroups,
  homeTotals,
  makeSub,
  settleFreePicks,
  monthDue,
  pendingSavings,
  reactivateSub,
  remindedIds,
  savingsSteps,
  toCsv,
  type Sub,
  chargeOfSub,
  hasDate,
  inTrial,
  undatedSubs,
} from '../subs';

const TODAY = '2026-11-09'; // a Monday, like the renders
const demo = () => demoData('demo', TODAY).subs;
const byName = (subs: Sub[], name: string) => subs.find((s) => s.name === name)!;

describe('Home totals (per currency, ditched and trials left out)', () => {
  it('the six demo subs make $90.95 a month and $1,091.40 a year', () => {
    const [t] = homeTotals(demo(), TODAY, 'USD');
    expect(t.currency).toBe('USD');
    expect(Math.round(t.monthlyMinor)).toBe(9095);
    expect(t.yearlyMinor).toBe(109140);
  });

  it('ditching Netflix drops it from the total ($72.96 a month, like 9c)', () => {
    const subs = demo().map((s) => (s.name === 'Netflix' ? ditchSub(s, TODAY) : s));
    expect(Math.round(homeTotals(subs, TODAY, 'USD')[0].monthlyMinor)).toBe(7296);
  });

  it('never adds two currencies together; the home currency comes first', () => {
    const subs = [
      makeSub({ name: 'A', amountMinor: 1549, currency: 'USD', cycle: 'monthly', anchor: TODAY }),
      makeSub({ name: 'B', amountMinor: 2000, currency: 'CAD', cycle: 'monthly', anchor: TODAY }),
    ];
    const totals = homeTotals(subs, TODAY, 'CAD');
    expect(totals.map((t) => [t.currency, t.yearlyMinor])).toEqual([
      ['CAD', 24000],
      ['USD', 18588],
    ]);
  });

  it('a free trial is not "what you pay now" until it ends; unpriced subs are skipped', () => {
    const trial = makeSub({ name: 'Hulu', amountMinor: 999, currency: 'USD', cycle: 'monthly', anchor: '2026-11-20', isTrial: true });
    const unpriced = makeSub({ name: 'Gym', cycle: 'monthly', anchor: TODAY });
    expect(homeTotals([trial, unpriced], TODAY)).toEqual([]);
    expect(homeTotals([trial], '2026-11-21')[0].yearlyMinor).toBe(11988);
  });
});

describe('Home groups', () => {
  it('This week runs to Saturday, Next week is the following Sun–Sat, then Later, then No date yet (biggest first)', () => {
    const groups = homeGroups(demo(), TODAY);
    expect(groups.map((g) => [g.title, g.rows.map((r) => `${r.sub.name} ${r.charge ?? 'no date'}`)])).toEqual([
      ['This week', ['Netflix 2026-11-14']],
      ['Next week', ['Spotify 2026-11-16', 'ChatGPT 2026-11-21']],
      ['Later', ['YouTube Premium 2026-11-27']],
      ['No date yet', ['Amazon Prime no date', 'Disney+ no date']],
    ]);
  });

  it('a ditched-but-not-cancelled sub stays on Home under its cancel-by date; confirmed ones leave', () => {
    const subs = demo().map((s) => (s.name === 'Netflix' ? ditchSub(s, TODAY) : s));
    expect(homeGroups(subs, TODAY)[0].rows[0].sub.status).toBe('ditched-pending');
    const done = subs.map((s) => (s.name === 'Netflix' ? confirmCancel(s, TODAY) : s));
    expect(homeGroups(done, TODAY)[0].title).toBe('Next week');
  });

  it('past dates roll forward: a monthly anchor in the past lands next month', () => {
    const s = makeSub({ name: 'X', amountMinor: 100, currency: 'USD', cycle: 'monthly', anchor: '2026-06-05' });
    expect(homeGroups([s], TODAY)[0].rows[0].charge).toBe('2026-12-05');
  });
});

describe('who gets reminders', () => {
  it('free: only the picked ones with a date, at most 3', () => {
    const subs = demo();
    // Amazon Prime is picked but has no date yet, so it gets nothing (DECISIONS #33).
    expect([...remindedIds(subs, false)].sort()).toEqual(['chatgpt', 'netflix']);
    const four = subs.map((s) => (s.name === 'Spotify' ? { ...s, freePick: true } : s));
    expect(remindedIds(four, false).size).toBe(3);
  });

  it('pro: every active one that is not muted; Ditch’s own trial never counts', () => {
    const subs = demoData('pro', TODAY).subs.map((s) => (s.name === 'Disney+' ? { ...s, muted: true } : s));
    const ids = remindedIds(subs, true);
    // Netflix, Spotify, ChatGPT, YouTube. Disney+ is muted; Amazon Prime has no date.
    expect(ids.size).toBe(4);
    expect(ids.has('trial')).toBe(false);
  });

  it('the free default is the 3 biggest yearly charges that have a date', () => {
    expect(defaultFreePicks(demo()).sort()).toEqual(['chatgpt', 'netflix', 'youtube']);
  });
});

describe('ditching and savings', () => {
  it('ditch snapshots the price and the cancel-by date; savings ignore later price edits', () => {
    const n = ditchSub(byName(demo(), 'Netflix'), TODAY);
    expect([n.status, n.ditchedOn, n.cancelBy, n.snapAmountMinor]).toEqual(['ditched-pending', TODAY, '2026-11-14', 1799]);
    const edited = { ...n, amountMinor: 9999 };
    expect(pendingSavings([edited])[0].yearlyMinor).toBe(21588);
  });

  it('"You’re saving" counts confirmed cancels only: $431.16 a year, $35.93 a month', () => {
    const subs = demo().map((s) => (s.name === 'Netflix' ? ditchSub(s, TODAY) : s));
    const [s] = confirmedSavings(subs, 'USD');
    expect([s.yearlyMinor, Math.round(s.monthlyMinor), s.count]).toEqual([43116, 3593, 3]);
    expect(pendingSavings(subs, 'USD')[0].yearlyMinor).toBe(21588);
  });

  it('reactivate → re-ditch never double counts', () => {
    let n = confirmCancel(ditchSub(byName(demo(), 'Netflix'), TODAY), TODAY);
    n = reactivateSub(n);
    expect(n.snapAmountMinor).toBeNull();
    n = confirmCancel(ditchSub(n, TODAY), TODAY);
    expect(confirmedSavings([n])[0].yearlyMinor).toBe(21588);
  });

  it('confirm only works on a ditched sub', () => {
    const a = byName(demo(), 'Spotify');
    expect(confirmCancel(a, TODAY)).toBe(a);
  });

  it('the step chart adds up in date order: $119.88 → $299.28 → $431.16', () => {
    expect(savingsSteps(demo(), 'USD').map((x) => [x.date, x.totalMinor])).toEqual([
      ['2026-06-14', 11988],
      ['2026-08-22', 29928],
      ['2026-09-17', 43116],
    ]);
  });
});

describe('calendar', () => {
  const reminded = remindedIds(demo(), false);
  const days = calendarMonth(demo(), 2026, 11, TODAY, reminded, [3, 1]);
  const day = (n: number) => days.find((d) => d?.date === `2026-11-${String(n).padStart(2, '0')}`)!;

  it('November: 4 dated charges, $63.97 due (Disney+ has no date, so it isn’t on a day)', () => {
    const due = monthDue(days, 'USD');
    expect(due.count).toBe(4);
    expect(due.totals).toEqual([{ currency: 'USD', amountMinor: 6397 }]);
  });

  it('reminder dots land 3 and 1 days before reminded charges (Netflix 14th, ChatGPT 21st)', () => {
    const dots = days.filter((d) => d?.headsUp).map((d) => d!.date.slice(8));
    expect(dots).toEqual(['11', '13', '18', '20']);
  });

  it('subs with no date never appear; today and past days are flagged, Sunday-first blanks', () => {
    expect(days.flatMap((d) => d?.charges ?? []).some((c) => c.sub.name === 'Disney+' || c.sub.name === 'Amazon Prime')).toBe(false);
    expect(day(9).today).toBe(true);
    expect(day(8).past).toBe(true);
    expect(days[0]).not.toBeNull(); // Nov 1 2026 is a Sunday
  });

  it('weekly charges repeat and month-end anchors clamp', () => {
    const w = makeSub({ name: 'W', amountMinor: 100, currency: 'USD', cycle: 'weekly', anchor: '2026-10-01' });
    expect(chargesBetween(w, '2026-11-01', '2026-11-30')).toEqual(['2026-11-05', '2026-11-12', '2026-11-19', '2026-11-26']);
    const m = makeSub({ name: 'M', amountMinor: 100, currency: 'USD', cycle: 'monthly', anchor: '2026-01-31' });
    expect(chargesBetween(m, '2027-02-01', '2027-03-31')).toEqual(['2027-02-28', '2027-03-31']);
  });

  it('a ditched-and-confirmed sub disappears; a waiting one is marked pending and not counted', () => {
    const subs = demo().map((s) => (s.name === 'Netflix' ? ditchSub(s, TODAY) : s));
    const d = calendarMonth(subs, 2026, 11, TODAY, remindedIds(subs, false), [3, 1]);
    const nov14 = d.find((x) => x?.date === '2026-11-14')!;
    expect(nov14.charges[0].pending).toBe(true);
    expect(monthDue(d, 'USD').totals[0].amountMinor).toBe(6397 - 1799);
  });
});

describe('settings', () => {
  it('parses with safe defaults and writes back only what changed', () => {
    expect(parseSettings({})).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings({ reminder_time: '25:00', lead_days: 'oops', currency: 'usd' })).toEqual(DEFAULT_SETTINGS);
    expect(settingsToKv({ leadDays: [1, 3, 3] })).toEqual({ lead_days: '[3,1]' });
  });

  it('labels read as sentences', () => {
    expect(leadsLabel([3, 1])).toBe('3 days and 1 day before');
    expect(leadsLabel([7, 3, 1])).toBe('1 week, 3 days and 1 day before');
    expect(leadsLabel([3, 0])).toBe('3 days before and on the day');
    expect(leadsLabel([0])).toBe('On the day');
    expect(timeLabel('09:00')).toBe('9:00\u00A0AM');
    expect(timeLabel('00:05')).toBe('12:05\u00A0AM');
    expect(timeLabel('18:30')).toBe('6:30\u00A0PM');
    expect(cleanLeads([])).toEqual([3, 1]);
  });
});

describe('onboarding is saved', () => {
  it('every ticked sub becomes a saved sub; the picked 3 get reminders; a Pro trial adds Ditch’s own entry', () => {
    const picks = ['netflix', 'spotify', 'chatgpt-plus', 'amazon-prime'].map((id) => newPick(SERVICE_BY_ID[id], 'US', TODAY));
    const subs = subsFromOnboarding({ picks, reminderIds: ['netflix', 'spotify', 'chatgpt-plus', 'amazon-prime'], pro: null, today: TODAY, nowIso: 'x' });
    expect(subs).toHaveLength(4);
    expect(subs.filter((s) => s.freePick)).toHaveLength(3);
    expect(subs[0]).toMatchObject({ catalogId: 'netflix', name: 'Netflix', currency: 'USD', dateSource: 'none', source: 'onboarding', status: 'active' }); // not picked on the dates step yet
    const pro = subsFromOnboarding({ picks, reminderIds: [], pro: 'yearly', today: TODAY, nowIso: 'x' });
    const trial = pro.find((s) => s.kind === 'ditch_pro_trial')!;
    expect([trial.anchor, trial.amountMinor, trial.isTrial]).toEqual(['2026-11-16', 2999, true]);
  });
});

describe('CSV export', () => {
  it('writes plain decimals in each sub’s own currency and quotes commas', () => {
    const subs = [makeSub({ name: 'Gym, downtown', amountMinor: 4500, currency: 'USD', cycle: 'monthly', anchor: '2026-11-20' }), makeSub({ name: 'Netflix JP', amountMinor: 980, currency: 'JPY', cycle: 'monthly', anchor: '2026-11-12', dateSource: 'none' })];
    const csv = toCsv(subs, TODAY, currencyDigits).split('\n');
    expect(csv[0]).toBe('Name,Amount,Currency,Billed,Next charge,Status,Ditched on,Cancelled on');
    expect(csv[1]).toBe('"Gym, downtown",45.00,USD,monthly,2026-11-20,Active,,');
    expect(csv[2]).toBe('Netflix JP,980,JPY,monthly,,Active,,'); // no date yet: blank
  });
});

describe('no date yet (DECISIONS #33)', () => {
  const none = makeSub({ name: 'Gym', amountMinor: 4500, currency: 'USD', cycle: 'monthly', anchor: TODAY, dateSource: 'none' });

  it('has no next charge, but still counts in the totals', () => {
    expect(hasDate(none)).toBe(false);
    expect(chargeOfSub(none, TODAY)).toBeNull();
    expect(homeTotals([none], TODAY)[0].monthlyMinor).toBe(4500);
  });

  it('is listed as undated; Ditch’s own trial and ditched ones are not', () => {
    expect(undatedSubs(demo()).map((s) => s.name).sort()).toEqual(['Amazon Prime', 'Disney+']);
    expect(undatedSubs([ditchSub(none, TODAY)])).toEqual([]);
  });

  it('a free trial with no end date yet counts as still in its trial (not paying)', () => {
    expect(inTrial({ ...none, isTrial: true }, TODAY)).toBe(true);
    expect(homeTotals([{ ...none, isTrial: true }], TODAY)).toEqual([]);
  });

  it('can never hold a reminder, even when picked', () => {
    expect(remindedIds([{ ...none, freePick: true }], false).size).toBe(0);
    expect(remindedIds([none], true).size).toBe(0);
  });
});

describe('Ditch’s own Pro trial is not one of your subscriptions (owner, Nov 10)', () => {
  const pro = () => demoData('pro', TODAY).subs;

  it('never shows on Home, in the calendar or in the export', () => {
    const names = homeGroups(pro(), TODAY).flatMap((g) => g.rows.map((r) => r.sub.kind));
    expect(names).not.toContain('ditch_pro_trial');
    const days = calendarMonth(pro(), 2026, 11, TODAY, remindedIds(pro(), true), [3, 1]);
    expect(days.flatMap((d) => d?.charges ?? []).some((c) => c.sub.kind === 'ditch_pro_trial')).toBe(false);
    expect(toCsv(pro(), TODAY, currencyDigits)).not.toContain('Ditch Pro');
  });
});

describe('chargesBetween with old anchors', () => {
  it('never skips a charge, however old the anchor', () => {
    for (const cycle of ['weekly', 'monthly', 'quarterly', 'yearly'] as const) {
      for (let years = 0; years <= 30; years++) {
        const anchor = `${2026 - years}-01-31`;
        const sub = makeSub({ name: 'Old', cycle, anchor, dateSource: 'next' });
        const today = '2026-11-11';
        const next = nextChargeDate(anchor, cycle, today);
        expect(chargesBetween(sub, today, addDays(today, 400))[0]).toBe(next);
      }
    }
  });
});

describe('settleFreePicks', () => {
  const mk = (id: string, amountMinor: number, dated = true, freePick = true) =>
    makeSub({ id, name: id, cycle: 'monthly', anchor: '2026-11-20', dateSource: dated ? 'next' : 'none', amountMinor, currency: 'USD', freePick });
  it('adding a date never turns another sub’s reminder off', () => {
    const all = [mk('a', 2000), mk('b', 1500), mk('c', 1000), mk('d', 5000, false)];
    const dated = { ...all[3], dateSource: 'next' as const };
    const [after] = settleFreePicks(all, [dated], false);
    expect(after.freePick).toBe(false);
    const next = all.map((s) => (s.id === 'd' ? after : s));
    expect([...remindedIds(next, false)].sort()).toEqual(['a', 'b', 'c']);
  });
  it('gives the slot when there is room, and none to a sub without a date', () => {
    const all = [mk('a', 2000), mk('b', 1500)];
    expect(settleFreePicks(all, [mk('c', 900)], false)[0].freePick).toBe(true);
    expect(settleFreePicks(all, [mk('c', 900, false)], false)[0].freePick).toBe(false);
  });
  it('a swap in one save works, and Pro is left alone', () => {
    const all = [mk('a', 2000), mk('b', 1500), mk('c', 1000), mk('d', 800, true, false)];
    const out = settleFreePicks(all, [{ ...all[2], freePick: false }, { ...all[3], freePick: true }], false);
    expect(out.map((s) => s.freePick)).toEqual([false, true]);
    expect(settleFreePicks(all, [mk('e', 1)], true)[0].freePick).toBe(true);
  });
});
