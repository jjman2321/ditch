import { buildSetSummary, type SummarySub } from '../summary';

const TODAY = '2026-11-09';
const SUBS: SummarySub[] = [
  { id: 'chatgpt-plus', name: 'ChatGPT Plus', charge: '2026-11-21', guess: false },
  { id: 'netflix', name: 'Netflix', charge: '2026-11-14', guess: false },
  { id: 'amazon-prime', name: 'Amazon Prime', charge: '2026-12-03', guess: true },
  { id: 'youtube-premium', name: 'YouTube Premium', charge: '2026-11-27', guess: true },
  { id: 'spotify', name: 'Spotify', charge: '2026-11-16', guess: true },
  { id: 'disney-plus', name: 'Disney+', charge: '2026-11-18', guess: true },
];

describe("You're set summary", () => {
  it('free: the 3 picks, soonest first, matching v10 screen 8', () => {
    const s = buildSetSummary({ subs: SUBS, remindedIds: ['chatgpt-plus', 'netflix', 'amazon-prime'], today: TODAY, notificationsOn: true });
    expect(s.rows.map((r) => [r.name, r.date, r.guess])).toEqual([
      ['Netflix', '2026-11-11', false],
      ['ChatGPT Plus', '2026-11-18', false],
      ['Amazon Prime', '2026-11-30', true],
    ]);
    expect(s.note).toBe(
      'YouTube Premium, Spotify and Disney+ have no heads-up. Amazon Prime’s date is a guess, so its heads-up says “renews around Thu, Dec 3.”',
    );
    expect([s.tracked, s.withHeadsUps, s.datesToCheck]).toEqual([6, '3', 4]);
  });

  it('pro trial: everything plus the trial, 4 rows, matching v10 screen 8b', () => {
    const s = buildSetSummary({
      subs: SUBS,
      remindedIds: SUBS.map((x) => x.id),
      trialCharge: '2026-11-16',
      today: TODAY,
      notificationsOn: true,
    });
    expect(s.rows.map((r) => [r.name, r.date])).toEqual([
      ['Netflix', '2026-11-11'],
      ['Ditch Pro trial', '2026-11-13'],
      ['Spotify', '2026-11-13'],
      ['Disney+', '2026-11-15'],
    ]);
    expect(s.withHeadsUps).toBe('6 + trial');
    expect(s.note).toContain('4 dates are still guesses, like Spotify’s and Disney+’s');
  });

  it('says so when notifications are off', () => {
    const s = buildSetSummary({ subs: SUBS, remindedIds: ['netflix'], today: TODAY, notificationsOn: false });
    expect(s.note).toMatch(/Notifications are off/);
  });

  it('skips charges too close for a heads-up', () => {
    const s = buildSetSummary({
      subs: [{ id: 'a', name: 'A', charge: TODAY, guess: false }],
      remindedIds: ['a'],
      today: TODAY,
      notificationsOn: true,
    });
    expect(s.rows).toEqual([]);
    expect(s.note).toBe('Every heads-up comes at 9:00 AM, 3 days and 1 day before.');
  });
});
