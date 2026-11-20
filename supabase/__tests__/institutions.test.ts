import { handleInstitutions } from '../functions/_shared/handlers.ts';
import { PlaidProvider } from '../functions/_shared/plaid.ts';
import { makeCtx, req } from '../testing/fakes.ts';

const body = async (r: Response) => JSON.parse(await r.text());

describe('bank directory (bank-institutions)', () => {
  it('maps Plaid institutions: id, name, logo, colour, country', async () => {
    const calls: { path: string; body: Record<string, unknown> }[] = [];
    const fetchFn = (async (url: string, init: RequestInit) => {
      calls.push({ path: new URL(url).pathname, body: JSON.parse(String(init.body)) });
      return new Response(JSON.stringify({ institutions: [{ institution_id: 'ins_127989', name: 'Bank of America', logo: 'iVBOR', primary_color: '#E31837', country_codes: ['US'] }] }), { status: 200 });
    }) as unknown as typeof fetch;
    const plaid = new PlaidProvider({ clientId: 'c', secret: 's', env: 'production', webhookUrl: 'https://x' }, fetchFn);
    expect(await plaid.institutions({ query: 'bank of am' })).toEqual([{ id: 'ins_127989', name: 'Bank of America', logo: 'iVBOR', color: '#E31837', country: 'US' }]);
    expect(calls[0]).toMatchObject({ path: '/institutions/search', body: { query: 'bank of am', products: ['transactions'], country_codes: ['US', 'CA'], options: { include_optional_metadata: true } } });
    expect(await plaid.institutions({ query: 'b' })).toEqual([]);
  });

  it('needs no sign-in, validates input and caches for a day', async () => {
    const ctx = await makeCtx();
    const seen: unknown[] = [];
    ctx.deps.institutions = async (q) => {
      seen.push(q);
      return [{ id: 'ins_1', name: 'Chase', logo: null, color: null, country: 'US' }];
    };
    const r = await handleInstitutions(req({ query: 'chase' }, { 'x-ditch-user': '', 'x-ditch-secret': '' }), ctx.deps);
    expect(r.headers.get('Cache-Control')).toContain('max-age=86400');
    expect((await body(r)).institutions[0].name).toBe('Chase');
    expect(await body(await handleInstitutions(req({ query: 'c' }), ctx.deps))).toEqual({ institutions: [] });
    await handleInstitutions(req({ ids: ['ins_56', 'DROP TABLE', 7] }), ctx.deps);
    expect(seen).toEqual([{ query: 'chase' }, { ids: ['ins_56'] }]);
  });
});
