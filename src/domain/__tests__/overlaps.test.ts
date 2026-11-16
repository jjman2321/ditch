import { SERVICES } from '@/catalog/services';

import { GROUPS, overlapToShow, overlaps } from '../overlaps';
import { ditchSub, makeSub, type Sub } from '../subs';

const sub = (id: string, name: string, catalogId: string | null, amountMinor = 1000, currency = 'USD', extra: Partial<Sub> = {}) =>
  makeSub({ id, name, catalogId, amountMinor, currency, cycle: 'monthly', anchor: '2026-11-20', dateSource: 'next', ...extra });

describe('overlaps (DECISIONS #60)', () => {
  it('finds the same service twice, by catalog id or by typed name', () => {
    const o = overlaps([sub('a', 'Netflix', 'netflix'), sub('b', 'Netflix', 'netflix'), sub('c', 'My Gym', null), sub('d', 'my gym', null)]);
    expect(o.map((x) => [x.kind, x.label, x.subs.length])).toEqual([
      ['twice', 'Netflix', 2],
      ['twice', 'My Gym', 2],
    ]);
  });
  it('finds 2 music services with their monthly total', () => {
    const [o] = overlaps([sub('s', 'Spotify', 'spotify', 1299), sub('m', 'Apple Music', 'apple-music', 1099)]);
    expect(o.label).toBe('music services');
    expect(o.totals).toEqual([{ currency: 'USD', yearlyMinor: 28776, monthlyMinor: 2398, dailyMinor: 28776 / 365 }]);
  });
  it('keeps currencies apart', () => {
    const [o] = overlaps([sub('s', 'Spotify', 'spotify', 1299, 'USD'), sub('m', 'Apple Music', 'apple-music', 1099, 'GBP')]);
    expect(o.totals.map((t) => t.currency).sort()).toEqual(['GBP', 'USD']);
  });
  it('needs 4 video services, not 3', () => {
    const three = [sub('n', 'Netflix', 'netflix'), sub('d', 'Disney+', 'disney-plus'), sub('h', 'Hulu', 'hulu')];
    expect(overlaps(three)).toEqual([]);
    expect(overlaps([...three, sub('p', 'Peacock', 'peacock')])[0].label).toBe('video streaming services');
  });
  it('ignores ditched subs and different kinds of thing', () => {
    expect(overlaps([sub('s', 'Spotify', 'spotify'), ditchSub(sub('m', 'Apple Music', 'apple-music'), '2026-11-15', '2026-11-15T00:00:00Z')])).toEqual([]);
    expect(overlaps([sub('i', 'iCloud+', 'icloud'), sub('p', '1Password', '1password')])).toEqual([]);
  });
  it('a dismissed card stays away until the set changes', () => {
    const two = [sub('s', 'Spotify', 'spotify'), sub('m', 'Apple Music', 'apple-music')];
    const first = overlapToShow(two, [])!;
    expect(overlapToShow(two, [first.key])).toBeNull();
    expect(overlapToShow([...two, sub('t', 'TIDAL', 'tidal')], [first.key])?.subs).toHaveLength(3);
  });
});


it('every id in the groups is a real catalog service', () => {
  const ids = new Set(SERVICES.map((s) => s.id));
  expect(GROUPS.flatMap((g) => g.ids).filter((id) => !ids.has(id))).toEqual([]);
});
