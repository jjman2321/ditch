import { RIGHTS } from '../rights.data';
import { rightsFor, rightsPlace } from '../rights';

describe('Your rights', () => {
  it('maps every country to regions that exist', () => {
    for (const [c, ids] of Object.entries(RIGHTS.countries)) {
      expect(rightsFor(c)).toHaveLength(ids.length);
      expect(rightsPlace(c)).not.toBe(c);
    }
  });

  it('puts the most local rule first', () => {
    expect(rightsFor('DE').map((r) => r.id)).toEqual(['de', 'eu']);
    expect(rightsFor('US').map((r) => r.id)).toEqual(['us', 'ca-ny']);
  });

  it('shows nothing where we have not checked the law', () => {
    expect(rightsFor('AU')).toEqual([]);
    expect(rightsFor(null)).toEqual([]);
  });

  it('every region is short, sourced over https, and never overclaims', () => {
    for (const r of RIGHTS.regions) {
      expect(r.text.length).toBeLessThan(230);
      expect(r.sources.length).toBeGreaterThan(0);
      for (const s of [...r.sources, ...(r.help ? [r.help] : [])]) expect(s.url).toMatch(/^https:\/\//);
      expect(r.text).not.toMatch(/we cancel|for you|guarantee|saved|saving/i);
    }
    expect(RIGHTS.disclaimer).toMatch(/not legal advice/i);
  });
});
