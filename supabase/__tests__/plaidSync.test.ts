import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { mergeSyncPages, paginateSync, type PlaidTxn, type SyncPage } from '../functions/_shared/plaidMap.ts';
import { linkTokenBody, PlaidProvider, type PlaidConfig } from '../functions/_shared/plaid.ts';
import { ProviderError } from '../functions/_shared/provider.ts';

const t = (id: string, amount = 10, extra: Partial<PlaidTxn> = {}): PlaidTxn => ({ transaction_id: id, amount, iso_currency_code: 'USD', date: '2026-11-01', name: id, pending: false, ...extra });
const page = (p: Partial<SyncPage<PlaidTxn>>): SyncPage<PlaidTxn> => ({ added: [], modified: [], removed: [], next_cursor: 'c', has_more: false, ...p });

describe('mergeSyncPages', () => {
  it('keeps the latest version and drops what was removed later', () => {
    const r = mergeSyncPages([
      page({ added: [t('a', 10), t('b', 20)], has_more: true }),
      page({ modified: [t('a', 11), t('old', 5)], removed: [{ transaction_id: 'b' }], has_more: true }),
      page({ added: [t('c', 30)], removed: [{ transaction_id: 'gone' }] }),
    ]);
    expect(r.added.map((x) => [x.id, x.amountMinor])).toEqual([
      ['a', 1100],
      ['c', 3000],
    ]);
    expect(r.modified.map((x) => x.id)).toEqual(['old']);
    expect(r.removed.sort()).toEqual(['b', 'gone']);
  });

  it('a pending charge replaced by its posted version: pending id removed, posted id added', () => {
    const r = mergeSyncPages([page({ added: [t('posted', 17.99, { pending_transaction_id: 'pend' } as Partial<PlaidTxn>)], removed: [{ transaction_id: 'pend' }] })]);
    expect(r.added.map((x) => x.id)).toEqual(['posted']);
    expect(r.removed).toEqual(['pend']);
  });
});

describe('paginateSync', () => {
  it('follows next_cursor until has_more is false', async () => {
    const seen: (string | null)[] = [];
    const pages: Record<string, SyncPage<PlaidTxn>> = {
      start: page({ added: [t('a')], next_cursor: 'p2', has_more: true }),
      p2: page({ added: [t('b')], next_cursor: 'end' }),
    };
    const r = await paginateSync(async (c) => (seen.push(c), pages[c ?? 'start']), null);
    expect(seen).toEqual([null, 'p2']);
    expect(r.nextCursor).toBe('end');
    expect(r.pages).toHaveLength(2);
  });

  it('restarts from the first cursor after TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION', async () => {
    const seen: (string | null)[] = [];
    let failOnce = true;
    const r = await paginateSync(async (c) => {
      seen.push(c);
      if (c === 'p2' && failOnce) {
        failOnce = false;
        throw new ProviderError('TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION', 'mutated', 400);
      }
      return c === 'saved' ? page({ added: [t('a')], next_cursor: 'p2', has_more: true }) : page({ added: [t('b')], next_cursor: 'new' });
    }, 'saved');
    expect(seen).toEqual(['saved', 'p2', 'saved', 'p2']);
    expect(r.pages).toHaveLength(2); // the failed attempt's pages are thrown away
    expect(r.nextCursor).toBe('new');
  });

  it('gives up after a few restarts and passes other errors straight through', async () => {
    const mut = new ProviderError('TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION', 'm');
    await expect(paginateSync(async () => Promise.reject(mut), null, 2)).rejects.toBe(mut);
    const login = new ProviderError('ITEM_LOGIN_REQUIRED', 'login');
    await expect(paginateSync(async () => Promise.reject(login), null)).rejects.toBe(login);
  });
});

const cfg: PlaidConfig = { clientId: 'cid', secret: 'sec', env: 'sandbox', webhookUrl: 'https://x.supabase.co/functions/v1/plaid-webhook', redirectUri: 'https://ditchsubs.app/plaid/oauth' };

describe('Plaid link token (cost rules)', () => {
  it('new: Transactions only, 730 days, our webhook, OAuth redirect, no personal data', () => {
    const b = linkTokenBody(cfg, { mode: 'new', appUserId: 'u-1' });
    expect(b.products).toEqual(['transactions']);
    expect(b.transactions).toEqual({ days_requested: 730 });
    expect(b.webhook).toBe(cfg.webhookUrl);
    expect(b.redirect_uri).toBe(cfg.redirectUri);
    expect(b.country_codes).toEqual(['US', 'CA']);
    expect(b.user).toEqual({ client_user_id: 'u-1' });
    expect(b.client_name).toBe('Ditch');
  });

  it('update mode: same Item via access_token, no products', () => {
    const b = linkTokenBody(cfg, { mode: 'update', appUserId: 'u-1', accessToken: 'access-x' });
    expect(b.access_token).toBe('access-x');
    expect(b.products).toBeUndefined();
    expect(b.transactions).toBeUndefined();
  });
});

describe('PlaidProvider over fetch', () => {
  function fakeFetch(routes: Record<string, (body: Record<string, unknown>) => [number, unknown]>) {
    const calls: { path: string; body: Record<string, unknown>; headers: Record<string, string> }[] = [];
    const f = (async (url: string, init: RequestInit) => {
      const path = new URL(url).pathname;
      const body = JSON.parse(String(init.body));
      calls.push({ path, body, headers: init.headers as Record<string, string> });
      const [status, json] = routes[path](body);
      return new Response(JSON.stringify(json), { status });
    }) as unknown as typeof fetch;
    return { f, calls };
  }

  it('exchange reads the institution name; sync pages through; secrets go in headers', async () => {
    const { f, calls } = fakeFetch({
      '/item/public_token/exchange': () => [200, { access_token: 'access-sandbox-1', item_id: 'item-1' }],
      '/item/get': () => [200, { item: { institution_id: 'ins_3', institution_name: 'Chase' } }],
      '/transactions/sync': (b) =>
        b.cursor === 'p2' ? [200, { added: [t('b')], modified: [], removed: [], next_cursor: 'c-end', has_more: false }] : [200, { added: [t('a')], modified: [], removed: [], next_cursor: 'p2', has_more: true }],
    });
    const p = new PlaidProvider(cfg, f);
    expect(await p.exchange('public-sandbox-1')).toEqual({ itemId: 'item-1', accessToken: 'access-sandbox-1', institutionId: 'ins_3', institutionName: 'Chase' });
    const d = await p.sync('access-sandbox-1', null);
    expect(d.added.map((x) => x.id)).toEqual(['a', 'b']);
    expect(d).toMatchObject({ nextCursor: 'c-end', ready: true });
    const first = calls.find((c) => c.path === '/transactions/sync')!;
    expect(first.body.cursor).toBeUndefined();
    expect(first.body.count).toBe(500);
    expect(first.headers['PLAID-CLIENT-ID']).toBe('cid');
    expect(JSON.stringify(first.body)).not.toContain('sec');
  });

  it('not ready yet: empty cursor -> ready false', async () => {
    const { f } = fakeFetch({ '/transactions/sync': () => [200, { added: [], modified: [], removed: [], next_cursor: '', has_more: false }] });
    expect(await new PlaidProvider(cfg, f).sync('a', null)).toMatchObject({ ready: false, nextCursor: '' });
  });

  it('errors carry the Plaid code; remove of an already-gone Item counts as done', async () => {
    const { f } = fakeFetch({
      '/transactions/sync': () => [400, { error_type: 'ITEM_ERROR', error_code: 'ITEM_LOGIN_REQUIRED', error_message: 'login' }],
      '/item/remove': () => [400, { error_type: 'INVALID_INPUT', error_code: 'ITEM_NOT_FOUND', error_message: 'gone' }],
    });
    const p = new PlaidProvider(cfg, f);
    await expect(p.sync('a', null)).rejects.toMatchObject({ code: 'ITEM_LOGIN_REQUIRED', needsRelogin: true });
    await expect(p.remove('a')).resolves.toBeUndefined();
  });
});

describe('never /transactions/refresh (billed per call)', () => {
  it('no function source calls it', () => {
    const root = join(__dirname, '..', 'functions');
    const files: string[] = [];
    const walk = (d: string) => {
      for (const f of readdirSync(d)) {
        const p = join(d, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (p.endsWith('.ts')) files.push(p);
      }
    };
    walk(root);
    expect(files.length).toBeGreaterThan(10);
    for (const f of files) expect(readFileSync(f, 'utf8')).not.toMatch(/['"`]\/transactions\/refresh|\/transactions\/recurring|\/accounts\/balance|\/auth\/get|\/identity\/get/);
  });
});
