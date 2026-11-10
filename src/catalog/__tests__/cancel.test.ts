import { APPLE_SUBSCRIPTIONS_URL, cancelHelp } from '../cancel';
import { CANCEL_GUIDES } from '../cancel.data';
import { SERVICE_BY_ID } from '../services';

describe('cancelHelp', () => {
  it('opens the official page when there is one', () => {
    const h = cancelHelp({ name: 'Netflix', catalogId: 'netflix' });
    expect(h).toMatchObject({ kind: 'url', url: 'https://www.netflix.com/cancelplan', label: 'Cancel in Netflix', appleNote: false });
    expect(h.steps).toHaveLength(3);
  });
  it('Apple services go to Apple subscriptions', () => {
    expect(cancelHelp({ name: 'Apple Music', catalogId: 'apple-music' })).toMatchObject({ kind: 'apple', url: APPLE_SUBSCRIPTIONS_URL });
    expect(cancelHelp({ name: 'Ditch Pro', catalogId: null, proTrial: true }).kind).toBe('apple');
  });
  it('help article only: steps first, with the article', () => {
    const h = cancelHelp({ name: 'Amazon Prime', catalogId: 'amazon-prime' });
    expect(h.kind).toBe('steps');
    expect(h.url).toMatch(/^https:\/\/www\.amazon\.com\//);
  });
  it('unknown or custom: the generic steps', () => {
    const h = cancelHelp({ name: 'Gym', catalogId: null });
    expect(h).toMatchObject({ kind: 'steps', appleNote: true });
    expect(h.url).toBeUndefined();
    expect(h.steps[0]).toContain('Gym');
  });
});

describe('cancel guides data', () => {
  it('every guide is a catalog service, with 3 short steps and https links', () => {
    for (const [id, g] of Object.entries(CANCEL_GUIDES)) {
      expect(SERVICE_BY_ID[id]).toBeDefined();
      expect(g.steps).toHaveLength(3);
      for (const s of g.steps) {
        expect(s.length).toBeLessThanOrEqual(70);
        expect(s).not.toMatch(/—/);
      }
      for (const u of [g.url, g.helpUrl]) if (u) expect(u).toMatch(/^https:\/\//);
    }
  });
});
