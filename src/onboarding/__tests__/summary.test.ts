import { firstReminderRows, undatedNames, type SetSub } from '../summary';

// The v12 example (design/v12/NOTES.md): US, today Tue, Nov 10 2026.
const TODAY = '2026-11-10';
const SUBS: SetSub[] = [
  { id: 'chatgpt-plus', name: 'ChatGPT Plus', charge: '2026-11-21', following: '2026-12-21' },
  { id: 'netflix', name: 'Netflix', charge: '2026-11-19', following: '2026-12-19' },
  { id: 'youtube-premium', name: 'YouTube Premium', charge: '2026-11-17', following: '2026-12-17' },
  { id: 'amazon-prime', name: 'Amazon Prime', charge: null, following: null },
  { id: 'spotify', name: 'Spotify', charge: '2026-12-07', following: '2027-01-07' },
  { id: 'disney-plus', name: 'Disney+', charge: null, following: null },
];
const BIGGEST = ['chatgpt-plus', 'netflix', 'youtube-premium'];

describe("first reminders (pre-ask and You're set)", () => {
  it('free: the 3 biggest, soonest reminder first, matching render 07', () => {
    const rows = firstReminderRows({ subs: SUBS, remindedIds: BIGGEST, today: TODAY });
    expect(rows.map((r) => [r.name, r.reminder, r.charge])).toEqual([
      ['YouTube Premium', '2026-11-14', '2026-11-17'],
      ['Netflix', '2026-11-16', '2026-11-19'],
      ['ChatGPT Plus', '2026-11-18', '2026-11-21'],
    ]);
  });

  it('the pre-ask shows the first two', () => {
    const rows = firstReminderRows({ subs: SUBS, remindedIds: BIGGEST, today: TODAY, max: 2 });
    expect(rows.map((r) => r.name)).toEqual(['YouTube Premium', 'Netflix']);
  });

  it('Pro trial: reminders on everything with a date, the trial first on its day', () => {
    const rows = firstReminderRows({ subs: SUBS, remindedIds: SUBS.map((s) => s.id), trialCharge: '2026-11-17', today: TODAY, max: 4 });
    expect(rows.map((r) => [r.name, r.reminder])).toEqual([
      ['Ditch Pro trial', '2026-11-14'],
      ['YouTube Premium', '2026-11-14'],
      ['Netflix', '2026-11-16'],
      ['ChatGPT Plus', '2026-11-18'],
    ]);
    expect(rows[0].trial).toBe(true);
  });

  it('a charge today (too close for a reminder) shows the next cycle instead', () => {
    const soon: SetSub[] = [{ id: 'hulu', name: 'Hulu', charge: '2026-11-10', following: '2026-12-10' }];
    const rows = firstReminderRows({ subs: soon, remindedIds: ['hulu'], today: TODAY });
    expect(rows).toEqual([{ id: 'hulu', name: 'Hulu', charge: '2026-12-10', reminder: '2026-12-07' }]);
  });

  it('never a reminder in the past: 9:00 today has gone by 10 AM', () => {
    const s: SetSub[] = [{ id: 'max', name: 'Max', charge: '2026-11-13', following: '2026-12-13' }];
    expect(firstReminderRows({ subs: s, remindedIds: ['max'], today: TODAY, nowHour: 8 })[0].reminder).toBe('2026-11-10');
    expect(firstReminderRows({ subs: s, remindedIds: ['max'], today: TODAY, nowHour: 10 })[0].reminder).toBe('2026-11-12');
  });

  it('no date, no reminder: a picked sub without a date gets no row', () => {
    const rows = firstReminderRows({ subs: SUBS, remindedIds: ['disney-plus', 'amazon-prime', 'netflix'], today: TODAY });
    expect(rows.map((r) => r.name)).toEqual(['Netflix']);
  });

  it('lists the ones with no date yet, in list order', () => {
    expect(undatedNames(SUBS)).toEqual(['Amazon Prime', 'Disney+']);
  });
});
