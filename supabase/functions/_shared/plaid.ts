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
    // NEW_ACCOUNTS_AVAILABLE: Account Select lets the person tick the bank's new accounts.
    if (req.newAccounts) body.update = { account_selection_enabled: true };
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
      throw new ProviderError(String(json.error_code ?? 'PLAID_HTTP_' + res.status), String(json.error_message ?? 'Plaid error'), res.status, typeof json.request_id === 'string' ? json.request_id : null);
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
  async sandboxSelfTest(): Promise<{ accounts: number; types: string[]; transactions: number; transactionsReady: boolean; webhookFired: boolean; webhookCode: string; loginRequiredDetected: boolean; updateModeToken: boolean }> {
    if (this.cfg.env !== 'sandbox') throw new ProviderError('NOT_SANDBOX', 'self-test runs in Sandbox only');
    const pub = await this.call<{ public_token: string }>('/sandbox/public_token/create', {
      institution_id: 'ins_109508',
      initial_products: ['transactions'],
      options: { webhook: this.cfg.webhookUrl },
    });
    const ex = await this.call<{ access_token: string }>('/item/public_token/exchange', { public_token: pub.public_token });
    try {
      const r = await this.call<{ accounts: { type: string }[] }>('/accounts/get', { access_token: ex.access_token });
      // Plaid's Transactions core workflow: /transactions/sync until the first pull is ready (a few seconds in Sandbox).
      let tx = await this.sync(ex.access_token, null);
      for (let k = 0; k < 6 && !tx.ready; k++) {
        await new Promise((res) => setTimeout(res, 3000));
        tx = await this.sync(ex.access_token, null);
      }
      // Plaid's "test your webhook" step: ask Plaid to send NEW_ACCOUNTS_AVAILABLE to our receiver, and keep
      // the item alive a few seconds so it arrives (it shows in the function logs as a 200 on /plaid-webhook).
      // Items made with /sandbox/public_token/create aren't Account Select v2 items, so Plaid can refuse
      // NEW_ACCOUNTS_AVAILABLE (SANDBOX_ACCOUNT_SELECT_V2_NOT_ENABLED); then send SYNC_UPDATES_AVAILABLE instead.
      const fire = (webhook_type: string, webhook_code: string) =>
        this.call<{ webhook_fired: boolean }>('/sandbox/item/fire_webhook', { access_token: ex.access_token, webhook_type, webhook_code }).then((x) => ({ ...x, code: webhook_code }));
      const w = await fire('ITEM', 'NEW_ACCOUNTS_AVAILABLE').catch(() => fire('TRANSACTIONS', 'SYNC_UPDATES_AVAILABLE'));
      await new Promise((res) => setTimeout(res, 8000));
      // Update mode: break the login on purpose, check we see ITEM_LOGIN_REQUIRED, and that a fix-it Link token opens.
      await this.call('/sandbox/item/reset_login', { access_token: ex.access_token });
      let loginRequiredDetected = false;
      try {
        await this.sync(ex.access_token, null);
      } catch (e) {
        loginRequiredDetected = e instanceof ProviderError && e.needsRelogin;
      }
      const fix = await this.createLinkToken({ mode: 'update', appUserId: 'sandbox-selftest', accessToken: ex.access_token });
      return {
        accounts: r.accounts.length,
        types: [...new Set(r.accounts.map((a) => a.type))],
        transactions: tx.added.length,
        transactionsReady: tx.ready,
        webhookFired: !!w.webhook_fired,
        webhookCode: w.code,
        loginRequiredDetected,
        updateModeToken: !!fix.linkToken,
      };
    } finally {
      await this.remove(ex.access_token);
    }
  }

  /**
   * Sandbox only, step 1 of the Account Select test: a Hosted Link page (Plaid's real sign-in screen on the web),
   * so the item is made with Account Select v2 and NEW_ACCOUNTS_AVAILABLE can fire.
   */
  async sandboxHostedLink(): Promise<{ linkToken: string; url: string }> {
    if (this.cfg.env !== 'sandbox') throw new ProviderError('NOT_SANDBOX', 'self-test runs in Sandbox only');
    const r = await this.call<{ link_token: string; hosted_link_url: string }>('/link/token/create', {
      ...linkTokenBody(this.cfg, { mode: 'new', appUserId: 'sandbox-selftest' }),
      redirect_uri: undefined,
      hosted_link: {},
    });
    return { linkToken: r.link_token, url: r.hosted_link_url };
  }

  /** Step 2: swap the finished Hosted Link session, fire NEW_ACCOUNTS_AVAILABLE, then remove the test item. */
  async sandboxFinishHostedLink(linkToken: string): Promise<{ webhookFired: boolean; accounts: number }> {
    if (this.cfg.env !== 'sandbox') throw new ProviderError('NOT_SANDBOX', 'self-test runs in Sandbox only');
    type Session = { results?: { item_add_results?: { public_token: string; accounts?: unknown[] }[] } };
    const got = await this.call<{ link_sessions?: Session[] }>('/link/token/get', { link_token: linkToken });
    const add = (got.link_sessions ?? []).flatMap((s) => s.results?.item_add_results ?? [])[0];
    if (!add) throw new ProviderError('NO_LINK_RESULT', 'Hosted Link not finished yet');
    const ex = await this.call<{ access_token: string }>('/item/public_token/exchange', { public_token: add.public_token });
    try {
      const w = await this.call<{ webhook_fired: boolean }>('/sandbox/item/fire_webhook', { access_token: ex.access_token, webhook_type: 'ITEM', webhook_code: 'NEW_ACCOUNTS_AVAILABLE' });
      await new Promise((res) => setTimeout(res, 8000));
      return { webhookFired: !!w.webhook_fired, accounts: add.accounts?.length ?? 0 };
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
