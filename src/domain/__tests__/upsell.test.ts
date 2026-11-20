import { addDays, type DateOnly } from '../dates';
import { parseSettings, settingsToKv } from '../settings';
import { makeSub } from '../subs';
import { shouldShowOpenUpsell, soonUnreminded, type OpenUpsellInput } from '../upsell';

const TODAY = '2026-11-20' as DateOnly;
const base: OpenUpsellInput = {
  pro: false,
  onboardingDone: true,
  blocked: false,
  installedOn: addDays(TODAY, -10),
  lastShownOn: null,
  reviewAskedOn: null,
  remindedCount: 3,
  unremindedCount: 2,
  freeReminders: 3,
  today: TODAY,
};

describe('weekly Pro paywall on open', () => {
  it('shows for a free user with all 3 reminders used and more subs left without one', () => {
    expect(shouldShowOpenUpsell(base)).toBe(true);
  });

  it('never for Pro, before onboarding, or with notifications off', () => {
    expect(shouldShowOpenUpsell({ ...base, pro: true })).toBe(false);
    expect(shouldShowOpenUpsell({ ...base, onboardingDone: false })).toBe(false);
    expect(shouldShowOpenUpsell({ ...base, blocked: true })).toBe(false);
  });

  it('only when it is about something real: 3 of 3 used and one left out', () => {
    expect(shouldShowOpenUpsell({ ...base, remindedCount: 2 })).toBe(false);
    expect(shouldShowOpenUpsell({ ...base, unremindedCount: 0 })).toBe(false);
  });

  it('not in the first 3 days after install', () => {
    expect(shouldShowOpenUpsell({ ...base, installedOn: addDays(TODAY, -2) })).toBe(false);
    expect(shouldShowOpenUpsell({ ...base, installedOn: addDays(TODAY, -3) })).toBe(true);
    expect(shouldShowOpenUpsell({ ...base, installedOn: null })).toBe(false);
  });

  it('at most once every 7 days', () => {
    expect(shouldShowOpenUpsell({ ...base, lastShownOn: TODAY })).toBe(false);
    expect(shouldShowOpenUpsell({ ...base, lastShownOn: addDays(TODAY, -6) })).toBe(false);
    expect(shouldShowOpenUpsell({ ...base, lastShownOn: addDays(TODAY, -7) })).toBe(true);
  });

  it('never on a day the rating prompt was offered', () => {
    expect(shouldShowOpenUpsell({ ...base, reviewAskedOn: TODAY })).toBe(false);
    expect(shouldShowOpenUpsell({ ...base, reviewAskedOn: addDays(TODAY, -1) })).toBe(true);
  });

  it('the last-shown day is saved and read back', () => {
    expect(parseSettings(settingsToKv({ upsellShownOn: TODAY }) as Record<string, string>).upsellShownOn).toBe(TODAY);
    expect(parseSettings({}).upsellShownOn).toBeNull();
    expect(parseSettings({ upsell_shown_on: 'nope' }).upsellShownOn).toBeNull();
  });
});

describe('"charges soon, no reminder" card', () => {
  const hulu = makeSub({ name: 'Hulu', cycle: 'monthly', anchor: addDays(TODAY, 3), amountMinor: 999, currency: 'USD', dateSource: 'next' });
  const max = makeSub({ name: 'Max', cycle: 'monthly', anchor: addDays(TODAY, 2), amountMinor: 1699, currency: 'USD', dateSource: 'next' });
  const far = makeSub({ name: 'Far', cycle: 'monthly', anchor: addDays(TODAY, 12), amountMinor: 500, currency: 'USD', dateSource: 'next' });

  it('picks the soonest charge within a week', () => {
    expect(soonUnreminded([hulu, max, far], TODAY)).toEqual({ sub: max, charge: addDays(TODAY, 2) });
  });

  it('today or tomorrow is too late for a reminder to help, so no pitch; 8+ days out is too far', () => {
    expect(soonUnreminded([{ ...hulu, anchor: TODAY }], TODAY)).toBeNull();
    expect(soonUnreminded([{ ...hulu, anchor: addDays(TODAY, 1) }], TODAY)).toBeNull();
    expect(soonUnreminded([{ ...hulu, anchor: addDays(TODAY, 7) }], TODAY)?.charge).toBe(addDays(TODAY, 7));
    expect(soonUnreminded([far], TODAY)).toBeNull();
  });

  it('nothing to show with no subs', () => {
    expect(soonUnreminded([], TODAY)).toBeNull();
  });
});
