// Plaid through plain fetch (no SDK). Transactions only. We never call /transactions/refresh
// (billed per call) or any other product: cost rules in docs/research/bank-sync-2026-11-19.md.
// Secrets come in through the constructor; nothing here logs a token.

import { mergeSyncPages, paginateSync, type PlaidTxn, type SyncPage } from './plaidMap.ts';
import { ProviderError, type BankProvider, type Exchanged, type LinkToken, type LinkTokenRequest, type SyncDelta } from './provider.ts';

export type PlaidConfig = {
  clientId: string;
  secret: string;
  env: 'sandbox' | 'production';
  /** Our plaid-webhook function URL. */
  webhookUrl: string;
  /** https Universal Link for OAuth banks on iOS (must be listed in the Plaid Dashboard). */
  redirectUri?: string;
  /** Shown in Plaid's own screens. Ditch's screens never name Plaid (DECISIONS #64). */
  clientName?: string;
  countryCodes?: string[];
  /** History pulled at connect: 730 days (the max) so yearly subscriptions are seen twice. */
  daysRequested?: number;
};

export const PLAID_HOSTS = { sandbox: 'https://sandbox.plaid.com', production: 'https://production.plaid.com' } as const;

/** Exactly what /link/token/create gets. Exported so a test can pin the cost rules. */
export function linkTokenBody(cfg: PlaidConfig, req: LinkTokenRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {
    client_name: cfg.clientName ?? 'Ditch',
    language: 'en',
    country_codes: cfg.countryCodes ?? ['US', 'CA'],
    // A random app user id: no name, email or phone goes to Plaid.
    user: { client_user_id: req.appUserId },
    webhook: cfg.webhookUrl,
  };
  if (cfg.redirectUri) body.redirect_uri = cfg.redirectUri;
  if (req.mode === 'update') {
    // Update mode: same Item, user logs in again. No products, no new access token afterwards.
    body.access_token = req.accessToken;
  } else {
    body.products = ['transactions'];
    body.transactions = { days_requested: cfg.daysRequested ?? 730 };
  }
  return body;
}

export class PlaidProvider implements BankProvider {
  readonly name = 'plaid' as const;
  constructor(
    private readonly cfg: PlaidConfig,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  private async call<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const res = await this.fetchFn(`${PLAID_HOSTS[this.cfg.env]}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': this.cfg.clientId,
        'PLAID-SECRET': this.cfg.secret,
        'Plaid-Version': '2020-09-14',
      },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      // Plaid errors: { error_type, error_code, error_message, display_message }. Safe to keep the code.
      throw new ProviderError(String(json.error_code ?? 'PLAID_HTTP_' + res.status), String(json.error_message ?? 'Plaid error'), res.status);
    }
    return json as T;
  }

  async createLinkToken(req: LinkTokenRequest): Promise<LinkToken> {
    const r = await this.call<{ link_token: string; expiration?: string }>('/link/token/create', linkTokenBody(this.cfg, req));
    return { linkToken: r.link_token, expiration: r.expiration ?? null };
  }

  async exchange(publicToken: string): Promise<Exchanged> {
    const r = await this.call<{ access_token: string; item_id: string }>('/item/public_token/exchange', { public_token: publicToken });
    let institutionId: string | null = null;
    let institutionName: string | null = null;
    try {
      const g = await this.call<{ item: { institution_id?: string | null; institution_name?: string | null } }>('/item/get', { access_token: r.access_token });
      institutionId = g.item.institution_id ?? null;
      institutionName = g.item.institution_name ?? null;
    } catch {
      // The name is only for Settings; the connection still works without it.
    }
    return { itemId: r.item_id, accessToken: r.access_token, institutionId, institutionName };
  }

  async sync(accessToken: string, cursor: string | null): Promise<SyncDelta> {
    const fetchPage = (c: string | null) =>
      this.call<SyncPage<PlaidTxn> & { transactions_update_status?: string }>('/transactions/sync', {
        access_token: accessToken,
        ...(c ? { cursor: c } : {}),
        count: 500,
        options: { include_original_description: true },
      });
    const { pages, nextCursor } = await paginateSync(fetchPage, cursor);
    const merged = mergeSyncPages(pages);
    // An empty cursor means Plaid hasn't pulled the bank yet (SYNC_UPDATES_AVAILABLE comes later).
    return { ...merged, nextCursor, ready: nextCursor !== '' };
  }

  async remove(accessToken: string): Promise<void> {
    try {
      await this.call('/item/remove', { access_token: accessToken });
    } catch (e) {
      if (e instanceof ProviderError && e.alreadyGone) return;
      throw e;
    }
  }

  /**
   * Sandbox only: Plaid's "test your endpoints" step. Makes a test bank item (First Platypus Bank),
   * swaps the token, reads its accounts (/accounts/get), then removes the item. Returns counts only.
   */
  async sandboxSelfTest(): Promise<{ accounts: number; types: string[] }> {
    if (this.cfg.env !== 'sandbox') throw new ProviderError('NOT_SANDBOX', 'self-test runs in Sandbox only');
    const pub = await this.call<{ public_token: string }>('/sandbox/public_token/create', { institution_id: 'ins_109508', initial_products: ['transactions'] });
    const ex = await this.call<{ access_token: string }>('/item/public_token/exchange', { public_token: pub.public_token });
    try {
      const r = await this.call<{ accounts: { type: string }[] }>('/accounts/get', { access_token: ex.access_token });
      return { accounts: r.accounts.length, types: [...new Set(r.accounts.map((a) => a.type))] };
    } finally {
      await this.remove(ex.access_token);
    }
  }

  /** For webhook verification (plaidWebhook.ts). */
  async webhookKey(kid: string): Promise<PlaidJwk> {
    const r = await this.call<{ key: PlaidJwk }>('/webhook_verification_key/get', { key_id: kid });
    return r.key;
  }
}

export type PlaidJwk = { alg: string; crv: string; kid: string; kty: string; use: string; x: string; y: string; created_at: number; expired_at: number | null };
