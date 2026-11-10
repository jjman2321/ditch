import { EMPTY_REVIEW, markAsked, parseReview, pastReminderDays, shouldAskForReview, type ReviewState } from '../review';
import { parseSettings, settingsToKv } from '../settings';
import { makeSub } from '../subs';

const base: ReviewState = { ...EMPTY_REVIEW, installedOn: '2026-11-01' };
const ctx = { today: '2026-11-10', version: '1.0.0', onboardingDone: true };

describe('shouldAskForReview', () => {
  it('asks after a win once the install is 3+ days old', () => {
    expect(shouldAskForReview(base, ctx)).toBe(true);
  });
  it('never in onboarding or without an install day', () => {
    expect(shouldAskForReview(base, { ...ctx, onboardingDone: false })).toBe(false);
    expect(shouldAskForReview(EMPTY_REVIEW, ctx)).toBe(false);
  });
  it('never in the first 3 days', () => {
    expect(shouldAskForReview({ ...base, installedOn: '2026-11-08' }, ctx)).toBe(false);
    expect(shouldAskForReview({ ...base, installedOn: '2026-11-07' }, ctx)).toBe(true);
  });
  it('once per version, 60 days apart, 3 times ever', () => {
    const asked = markAsked(base, '2026-11-10', '1.0.0');
    expect(asked).toMatchObject({ lastAskedOn: '2026-11-10', askedVersion: '1.0.0', askCount: 1 });
    expect(shouldAskForReview(asked, { ...ctx, today: '2027-03-01' })).toBe(false); // same version
    expect(shouldAskForReview(asked, { ...ctx, today: '2026-12-20', version: '1.1.0' })).toBe(false); // 40 days
    expect(shouldAskForReview(asked, { ...ctx, today: '2027-01-09', version: '1.1.0' })).toBe(true); // 60 days
    expect(shouldAskForReview({ ...asked, askCount: 3 }, { ...ctx, today: '2028-01-01', version: '2.0.0' })).toBe(false);
  });
});

describe('parseReview', () => {
  it('falls back on anything broken', () => {
    expect(parseReview(undefined)).toEqual(EMPTY_REVIEW);
    expect(parseReview('nope')).toEqual(EMPTY_REVIEW);
    expect(parseReview('{"installedOn":"x","askCount":-2}')).toEqual(EMPTY_REVIEW);
  });
  it('round-trips through settings', () => {
    const review = markAsked(base, '2026-11-10', '1.0.0');
    const kv = settingsToKv({ review }) as Record<string, string>;
    expect(parseSettings(kv).review).toEqual(review);
  });
});

describe('pastReminderDays', () => {
  const netflix = makeSub({ id: 'n', name: 'Netflix', cycle: 'monthly', anchor: '2026-11-05', amountMinor: 1799, currency: 'USD', freePick: true, dateSource: 'next' });
  const opts = { pro: false, leads: [3, 1], from: '2026-11-01', today: '2026-11-10' };

  it('counts reminder days that have passed since install', () => {
    // Nov 5 charge: reminders Nov 2 and Nov 4.
    expect(pastReminderDays([netflix], opts)).toBe(2);
  });
  it('ignores days before install and today itself', () => {
    expect(pastReminderDays([netflix], { ...opts, from: '2026-11-03' })).toBe(1);
    expect(pastReminderDays([netflix], { ...opts, today: '2026-11-04' })).toBe(1);
  });
  it('skips subs without reminders or without a date', () => {
    expect(pastReminderDays([{ ...netflix, freePick: false }], opts)).toBe(0);
    expect(pastReminderDays([{ ...netflix, dateSource: 'none' }], opts)).toBe(0);
  });
  it('counts a shared day once', () => {
    const other = { ...netflix, id: 'o', name: 'Other' };
    expect(pastReminderDays([netflix, other], opts)).toBe(2);
  });
});
