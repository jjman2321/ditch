// Fake bank provider + deps for the handler tests (not deployed).
import { importTokenKey } from '../functions/_shared/crypto.ts';
import type { Deps } from '../functions/_shared/handlers.ts';
import { ProviderError, type BankProvider, type Exchanged, type LinkToken, type LinkTokenRequest, type SyncDelta } from '../functions/_shared/provider.ts';
import { MemoryStore } from './memoryStore.ts';

export const TEST_KEY = Buffer.alloc(32, 7).toString('base64');

export class FakeProvider implements BankProvider {
  readonly name = 'plaid' as const;
  calls: { op: string; arg?: unknown }[] = [];
  next = 0;
  institutionId: string | null = 'ins_1';
  syncResult: SyncDelta | ProviderError = { added: [], modified: [], removed: [], nextCursor: 'c1', ready: true };
  removeError: ProviderError | null = null;

  async createLinkToken(req: LinkTokenRequest): Promise<LinkToken> {
    this.calls.push({ op: 'link', arg: req });
    return { linkToken: `link-sandbox-${req.mode}`, expiration: null };
  }
  async exchange(publicToken: string): Promise<Exchanged> {
    this.calls.push({ op: 'exchange', arg: publicToken });
    const n = ++this.next;
    return { itemId: `item-${n}`, accessToken: `access-sandbox-SECRET-${n}`, institutionId: this.institutionId, institutionName: 'Test Bank' };
  }
  async sync(accessToken: string, cursor: string | null): Promise<SyncDelta> {
    this.calls.push({ op: 'sync', arg: { accessToken, cursor } });
    if (this.syncResult instanceof ProviderError) throw this.syncResult;
    return this.syncResult;
  }
  async remove(accessToken: string): Promise<void> {
    this.calls.push({ op: 'remove', arg: accessToken });
    if (this.removeError) throw this.removeError;
  }
}

export type TestCtx = { deps: Deps; store: MemoryStore; provider: FakeProvider; clock: { now: Date } };

/** Apple's JWS is faked as plain JSON in these tests; real signature checks live in appleJws.test.ts. */
export async function makeCtx(start = '2026-11-19T12:00:00Z'): Promise<TestCtx> {
  const clock = { now: new Date(start) };
  const store = new MemoryStore(() => clock.now);
  const provider = new FakeProvider();
  const deps: Deps = {
    store,
    provider: () => provider,
    defaultProvider: 'plaid',
    tokenKey: await importTokenKey(TEST_KEY),
    now: () => clock.now,
    apple: {
      verify: async <T>(jws: string) => {
        if (jws.startsWith('BAD')) throw new Error('bad signature');
        return JSON.parse(jws) as T;
      },
      bundleId: 'app.ditchsubs.ditch',
      environments: ['Production', 'Sandbox'],
      products: { 'ditch.pro.yearly': 'yearly', 'ditch.pro.weekly': 'weekly', 'ditch.pro.lifetime': 'lifetime', 'ditch.bank.addon': 'bank_addon' },
    },
    plaidWebhook: { verify: async (_raw, header) => ({ ok: header === 'good' }), env: 'sandbox' },
    cronSecret: 'cron-test-secret',
  };
  return { deps, store, provider, clock };
}

export const USER = '7f0c2a52-8d9e-4b8e-9a51-2a3b4c5d6e7f';
export const SECRET = 'a'.repeat(43);

export function req(body: unknown, headers: Record<string, string> = {}, method = 'POST'): Request {
  return new Request('https://fn.test/x', {
    method,
    headers: { 'Content-Type': 'application/json', 'x-ditch-user': USER, 'x-ditch-secret': SECRET, ...headers },
    body: method === 'GET' ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}
