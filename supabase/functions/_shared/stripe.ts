// Stripe Financial Connections as a drop-in fallback for Plaid (DECISIONS #64).
// UNTESTED against Stripe so far: written from docs.stripe.com/financial-connections. Differences:
// - The "link token" is a Financial Connections Session client_secret; the phone opens it with
//   @stripe/stripe-react-native collectFinancialConnectionsAccounts, then sends the session id back.
// - There's no per-item access token: our "token" is a small encrypted JSON of the account ids.
// - Stripe bills transactions per institution per account holder per month while subscribed;
//   remove() disconnects every account, which stops it.
// - Stripe amounts are already minor units and NEGATIVE for money leaving the account, so we flip
//   the sign to match the phone (outgoing positive). Up to 180 days of history.
// - No update mode: a broken connection is removed and connected again.

import { ProviderError, type BankProvider, type Exchanged, type LinkToken, type LinkTokenRequest, type SyncDelta } from './provider.ts';
import { isIsoCurrency } from './money.ts';
import type { BankTxn } from './types.ts';

const API = 'https://api.stripe.com/v1';

type StripeTxn = {
  id: string;
  amount: number;
  currency: string;
  description: string | null;
  status: 'pending' | 'posted' | 'void';
  transacted_at: number;
};
type StripeAccount = { id: string; institution_name?: string | null; status?: string; transaction_refresh?: { id: string; status: string } | null };
type StripeToken = { customer: string; accounts: string[] };

export function mapStripeTxn(t: StripeTxn): BankTxn | null {
  const currency = t.currency?.toUpperCase();
  if (!isIsoCurrency(currency) || !Number.isInteger(t.amount)) return null;
  return {
    id: t.id,
    date: new Date(t.transacted_at * 1000).toISOString().slice(0, 10),
    text: (t.description ?? '').trim(),
    merchantName: null,
    amountMinor: t.amount === 0 ? 0 : -t.amount,
    currency,
    pending: t.status === 'pending',
  };
}

function form(params: Record<string, string | string[]>): string {
  const out = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) for (const x of Array.isArray(v) ? v : [v]) out.append(k, x);
  return out.toString();
}

export class StripeFcProvider implements BankProvider {
  readonly name = 'stripe' as const;
  constructor(
    private readonly secretKey: string,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  private async call<T>(method: 'GET' | 'POST', path: string, params: Record<string, string | string[]> = {}): Promise<T> {
    const q = form(params);
    const res = await this.fetchFn(`${API}${path}${method === 'GET' && q ? `?${q}` : ''}`, {
      method,
      headers: { Authorization: `Bearer ${this.secretKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: method === 'POST' ? q : undefined,
    });
    const json = (await res.json().catch(() => ({}))) as { error?: { code?: string; message?: string } };
    if (!res.ok) throw new ProviderError(json.error?.code ?? `STRIPE_HTTP_${res.status}`, json.error?.message ?? 'Stripe error', res.status);
    return json as T;
  }

  async createLinkToken(req: LinkTokenRequest): Promise<LinkToken> {
    if (req.mode === 'update') throw new ProviderError('UPDATE_MODE_UNSUPPORTED', 'Stripe has no update mode; connect again');
    // A customer with no email or phone: Stripe only needs an account holder to attach accounts to.
    const customer = await this.call<{ id: string }>('POST', '/customers', { 'metadata[app_user_id]': req.appUserId });
    const s = await this.call<{ client_secret: string }>('POST', '/financial_connections/sessions', {
      'account_holder[type]': 'customer',
      'account_holder[customer]': customer.id,
      'permissions[]': ['transactions'],
      'prefetch[]': ['transactions'],
      'filters[countries][]': ['US'],
    });
    return { linkToken: s.client_secret, expiration: null };
  }

  /** `publicToken` is the Financial Connections Session id the phone got back. */
  async exchange(publicToken: string): Promise<Exchanged> {
    const s = await this.call<{ id: string; account_holder?: { customer?: string }; accounts: { data: StripeAccount[] } }>(
      'GET',
      `/financial_connections/sessions/${encodeURIComponent(publicToken)}`,
    );
    const accounts = s.accounts.data.filter((a) => a.status !== 'inactive');
    for (const a of accounts) await this.call('POST', `/financial_connections/accounts/${a.id}/subscribe`, { 'features[]': ['transactions'] });
    const token: StripeToken = { customer: s.account_holder?.customer ?? '', accounts: accounts.map((a) => a.id) };
    const name = accounts[0]?.institution_name ?? null;
    return { itemId: s.id, accessToken: JSON.stringify(token), institutionId: name, institutionName: name };
  }

  async sync(accessToken: string, cursor: string | null): Promise<SyncDelta> {
    const token = JSON.parse(accessToken) as StripeToken;
    const prev = (cursor ? JSON.parse(cursor) : {}) as Record<string, string>;
    const next: Record<string, string> = { ...prev };
    const upserts = new Map<string, BankTxn>();
    const removed = new Set<string>();
    let ready = true;
    for (const acct of token.accounts) {
      const a = await this.call<StripeAccount>('GET', `/financial_connections/accounts/${acct}`);
      if (a.transaction_refresh?.status !== 'succeeded') {
        if (!prev[acct]) ready = false;
        continue;
      }
      let startingAfter: string | undefined;
      for (let page = 0; page < 100; page++) {
        const params: Record<string, string> = { account: acct, limit: '100' };
        if (prev[acct]) params['transaction_refresh[after]'] = prev[acct];
        if (startingAfter) params.starting_after = startingAfter;
        const list = await this.call<{ data: StripeTxn[]; has_more: boolean }>('GET', '/financial_connections/transactions', params);
        for (const t of list.data) {
          if (t.status === 'void') {
            upserts.delete(t.id);
            removed.add(t.id);
            continue;
          }
          const m = mapStripeTxn(t);
          if (m) upserts.set(m.id, m);
        }
        if (!list.has_more || !list.data.length) break;
        startingAfter = list.data[list.data.length - 1].id;
      }
      next[acct] = a.transaction_refresh.id;
    }
    // Stripe doesn't say which rows are new vs changed; the phone treats both as "upsert by id".
    return { added: [...upserts.values()], modified: [], removed: [...removed], nextCursor: ready ? JSON.stringify(next) : '', ready };
  }

  async remove(accessToken: string): Promise<void> {
    const token = JSON.parse(accessToken) as StripeToken;
    for (const acct of token.accounts) {
      try {
        await this.call('POST', `/financial_connections/accounts/${acct}/disconnect`);
      } catch (e) {
        if (!(e instanceof ProviderError && e.alreadyGone)) throw e;
      }
    }
  }
}
