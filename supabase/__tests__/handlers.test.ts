import {
  handleAppleNotification,
  handleCleanup,
  handleEntitlementSync,
  handleExchange,
  handleLinkToken,
  handleList,
  handlePlaidWebhook,
  handleRemove,
  handleSync,
} from '../functions/_shared/handlers.ts';
import { hashSecret } from '../functions/_shared/crypto.ts';
import { ProviderError } from '../functions/_shared/provider.ts';
import type { BankTxn } from '../functions/_shared/types.ts';
import { makeCtx, req, SECRET, USER, type TestCtx } from '../testing/fakes.ts';

const DAY = 86_400_000;

/** A fake "JWS" (the test verifier just parses JSON). */
function txJws(ctx: TestCtx, o: Record<string, unknown> = {}) {
  const now = ctx.clock.now.getTime();
  return JSON.stringify({
    bundleId: 'app.ditchsubs.ditch',
    productId: 'ditch.pro.yearly',
    originalTransactionId: 'otx-1',
    transactionId: 'tx-1',
    purchaseDate: now - DAY,
    expiresDate: now + 6 * DAY,
    offerType: 1,
    offerDiscountType: 'FREE_TRIAL',
    price: 0,
    appAccountToken: USER,
    environment: 'Sandbox',
    signedDate: now - 1000,
    ...o,
  });
}

async function body(res: Response) {
  return JSON.parse(await res.text());
}

/** Registers the user with a running trial and connects one bank. */
async function setup(opts: { connect?: number } = {}) {
  const ctx = await makeCtx();
  const r = await handleEntitlementSync(req({ transactions: [txJws(ctx)] }), ctx.deps);
  expect(r.status).toBe(200);
  for (let i = 0; i < (opts.connect ?? 0); i++) {
    ctx.provider.institutionId = `ins_${i}`;
    expect((await handleExchange(req({ publicToken: `public-sandbox-${i}` }), ctx.deps)).status).toBe(200);
  }
  return ctx;
}

const allResponses: string[] = [];
async function capture(res: Response) {
  const t = await res.clone().text();
  allResponses.push(t);
  return res;
}

describe('entitlement-sync (the phone posts StoreKit signed transactions)', () => {
  it('creates the user only when Apple proves a purchase made with this app user id', async () => {
    const ctx = await makeCtx();
    expect((await handleEntitlementSync(req({ transactions: [] }), ctx.deps)).status).toBe(401);
    const other = txJws(ctx, { appAccountToken: '00000000-0000-4000-8000-000000000000' });
    expect((await handleEntitlementSync(req({ transactions: [other] }), ctx.deps)).status).toBe(401);
    expect((await handleEntitlementSync(req({ transactions: ['BAD'] }), ctx.deps)).status).toBe(401);
    const wrongApp = txJws(ctx, { bundleId: 'com.other.app' });
    expect((await handleEntitlementSync(req({ transactions: [wrongApp] }), ctx.deps)).status).toBe(401);

    const res = await handleEntitlementSync(req({ transactions: [txJws(ctx)], renewals: [JSON.stringify({ originalTransactionId: 'otx-1', autoRenewStatus: 1 })] }), ctx.deps);
    expect(res.status).toBe(200);
    expect((await body(res)).access).toMatchObject({ allowed: true, reason: 'trial' });
    expect(ctx.store.users.get(USER)!.secret_hash).toBe(await hashSecret(SECRET));
  });

  it('a new install secret is accepted only with freshly signed proof', async () => {
    const ctx = await setup();
    const other = 'b'.repeat(43);
    const stale = txJws(ctx, { signedDate: ctx.clock.now.getTime() - 3 * DAY });
    expect((await handleEntitlementSync(req({ transactions: [stale] }, { 'x-ditch-secret': other }), ctx.deps)).status).toBe(401);
    expect((await handleEntitlementSync(req({ transactions: [txJws(ctx)] }, { 'x-ditch-secret': other }), ctx.deps)).status).toBe(200);
    expect(ctx.store.users.get(USER)!.secret_hash).toBe(await hashSecret(other));
  });

  it('a cancelled trial posted by the phone keeps the bank until the trial ends', async () => {
    const ctx = await setup({ connect: 1 });
    const res = await handleEntitlementSync(
      req({ transactions: [txJws(ctx, { signedDate: ctx.clock.now.getTime() })], renewals: [JSON.stringify({ originalTransactionId: 'otx-1', autoRenewStatus: 0 })] }),
      ctx.deps,
    );
    expect(await body(res)).toMatchObject({ access: { allowed: true, reason: 'trial_ending' }, removed: 0 });
    expect(ctx.provider.calls.filter((c) => c.op === 'remove')).toHaveLength(0);
    // Keeps syncing, but no new banks while the trial is ending.
    expect((await handleSync(req({}), ctx.deps)).status).toBe(200);
    expect(await body(await handleLinkToken(req({}), ctx.deps))).toEqual({ error: 'not_entitled', reason: 'trial_ending' });
  });
});

describe('bank-link-token', () => {
  it('needs a paying user', async () => {
    const ctx = await makeCtx();
    await ctx.store.createUser(USER, await hashSecret(SECRET));
    const res = await handleLinkToken(req({}), ctx.deps);
    expect(res.status).toBe(402);
    expect(await body(res)).toEqual({ error: 'not_entitled', reason: 'none' });
  });

  it('rejects a wrong secret', async () => {
    const ctx = await setup();
    expect((await handleLinkToken(req({}, { 'x-ditch-secret': 'z'.repeat(43) }), ctx.deps)).status).toBe(401);
    expect((await handleLinkToken(req({}, { 'x-ditch-user': 'not-a-uuid' }), ctx.deps)).status).toBe(401);
  });

  it('makes a token, then stops at 3 banks', async () => {
    const ctx = await setup({ connect: 3 });
    const res = await handleLinkToken(req({}), ctx.deps);
    expect(res.status).toBe(409);
    expect(await body(res)).toEqual({ error: 'bank_limit', max: 3 });
  });

  it('update mode uses the stored (decrypted) token without creating a new Item', async () => {
    const ctx = await setup({ connect: 1 });
    const [link] = await ctx.store.listLinks(USER);
    const res = await capture(await handleLinkToken(req({ mode: 'update', linkId: link.id }), ctx.deps));
    expect(await body(res)).toMatchObject({ linkToken: 'link-sandbox-update', mode: 'update' });
    expect(ctx.provider.calls.find((c) => c.op === 'link')!.arg).toEqual({ mode: 'update', appUserId: USER, accessToken: 'access-sandbox-SECRET-1' });
  });

  it('is rate limited', async () => {
    const ctx = await setup();
    for (let i = 0; i < 10; i++) expect((await handleLinkToken(req({}), ctx.deps)).status).toBe(200);
    expect((await handleLinkToken(req({}), ctx.deps)).status).toBe(429);
    ctx.clock.now = new Date(ctx.clock.now.getTime() + 61 * 60_000);
    expect((await handleLinkToken(req({}), ctx.deps)).status).toBe(200);
  });
});

describe('bank-exchange', () => {
  it('stores the token encrypted and never returns it', async () => {
    const ctx = await setup();
    const res = await capture(await handleExchange(req({ publicToken: 'public-sandbox-1' }), ctx.deps));
    const b = await body(res);
    expect(b.link).toMatchObject({ institutionName: 'Test Bank', status: 'active' });
    const [row] = await ctx.store.listLinks(USER);
    expect(row.access_token_enc).toMatch(/^v1:/);
    expect(row.access_token_enc).not.toContain('SECRET');
  });

  it('the same bank again replaces the old connection (no double billing)', async () => {
    const ctx = await setup({ connect: 1 });
    ctx.provider.institutionId = 'ins_0';
    const b = await body(await handleExchange(req({ publicToken: 'public-sandbox-again' }), ctx.deps));
    expect(b.replaced).toBeTruthy();
    const links = await ctx.store.listLinks(USER);
    expect(links.map((l) => l.status).sort()).toEqual(['active', 'removed']);
    expect(ctx.provider.calls.find((c) => c.op === 'remove')!.arg).toBe('access-sandbox-SECRET-1');
  });

  it('a 4th bank (race past the link-token check) is removed at once', async () => {
    const ctx = await setup({ connect: 3 });
    ctx.provider.institutionId = 'ins_new';
    const res = await handleExchange(req({ publicToken: 'public-sandbox-4' }), ctx.deps);
    expect(res.status).toBe(409);
    expect(ctx.provider.calls.filter((c) => c.op === 'remove').map((c) => c.arg)).toEqual(['access-sandbox-SECRET-4']);
  });
});

describe('bank-sync', () => {
  const txn = (id: string): BankTxn => ({ id, date: '2026-11-03', text: 'NETFLIX.COM', merchantName: 'Netflix', amountMinor: 1799, currency: 'USD', pending: false });

  it('passes transactions through and only moves the cursor after the phone acks', async () => {
    const ctx = await setup({ connect: 1 });
    ctx.provider.syncResult = { added: [txn('a')], modified: [], removed: [], nextCursor: 'cur-1', ready: true };
    const first = await body(await capture(await handleSync(req({}), ctx.deps)));
    const [entry] = first.links;
    expect(entry.added).toEqual([txn('a')]);
    expect(entry.syncToken).toMatch(/^[0-9a-f]{32}$/);
    let [row] = await ctx.store.listLinks(USER);
    expect(row).toMatchObject({ cursor: null, pending_cursor: 'cur-1' });

    // No ack (phone crashed before saving): the same batch comes again, from the old cursor.
    await handleSync(req({}), ctx.deps);
    expect(ctx.provider.calls.filter((c) => c.op === 'sync').map((c) => (c.arg as { cursor: string | null }).cursor)).toEqual([null, null]);

    // Ack: the cursor moves, and the next pull starts there.
    ctx.provider.syncResult = { added: [], modified: [], removed: ['a'], nextCursor: 'cur-2', ready: true };
    const third = await body(await handleSync(req({ ack: { [entry.linkId]: entry.syncToken } }), ctx.deps));
    expect(third.links[0].removed).toEqual(['a']);
    expect((ctx.provider.calls.filter((c) => c.op === 'sync').pop()!.arg as { cursor: string }).cursor).toBe('cur-1');
    [row] = await ctx.store.listLinks(USER);
    expect(row).toMatchObject({ cursor: 'cur-1', pending_cursor: 'cur-2' });
    // Nothing is stored about transactions.
    expect(JSON.stringify([...ctx.store.links.values(), ...ctx.store.events])).not.toContain('NETFLIX');
  });

  it('not ready yet: no cursor stored', async () => {
    const ctx = await setup({ connect: 1 });
    ctx.provider.syncResult = { added: [], modified: [], removed: [], nextCursor: '', ready: false };
    const b = await body(await handleSync(req({}), ctx.deps));
    expect(b.links[0]).toMatchObject({ ready: false, syncToken: null });
    expect((await ctx.store.listLinks(USER))[0].pending_cursor).toBeNull();
  });

  it('a bank asking for a new login marks the connection and starts the 30-day clock', async () => {
    const ctx = await setup({ connect: 1 });
    ctx.provider.syncResult = new ProviderError('ITEM_LOGIN_REQUIRED', 'login', 400);
    const b = await body(await handleSync(req({}), ctx.deps));
    expect(b.links[0].status).toBe('needs_relogin');
    const [row] = await ctx.store.listLinks(USER);
    expect(row.needs_relogin_since).toBe(ctx.clock.now.toISOString());
    // While broken we don't call the provider again.
    const before = ctx.provider.calls.length;
    await handleSync(req({}), ctx.deps);
    expect(ctx.provider.calls.length).toBe(before);
  });

  it('a lapsed user gets 402 and the bank is removed', async () => {
    const ctx = await setup({ connect: 2 });
    ctx.clock.now = new Date(ctx.clock.now.getTime() + 30 * DAY);
    const res = await handleSync(req({}), ctx.deps);
    expect(res.status).toBe(402);
    expect((await ctx.store.listLinks(USER)).every((l) => l.status === 'removed' && l.access_token_enc === null)).toBe(true);
  });
});

describe('bank-remove and bank-list', () => {
  it('removes one connection; a failed provider call stays "removing" for the cleanup', async () => {
    const ctx = await setup({ connect: 2 });
    const [a, b] = await ctx.store.listLinks(USER);
    expect(await body(await handleRemove(req({ linkId: a.id }), ctx.deps))).toEqual({ removed: 1, pending: 0 });
    ctx.provider.removeError = new ProviderError('INTERNAL_SERVER_ERROR', 'down', 500);
    expect(await body(await handleRemove(req({ linkId: b.id }), ctx.deps))).toEqual({ removed: 0, pending: 1 });
    expect((await ctx.store.getLink(b.id))!.status).toBe('removing');
    const list = await body(await capture(await handleList(req({}), ctx.deps)));
    expect(list.links.map((l: { status: string }) => l.status)).toEqual(['removing']);
    expect(list.access).toMatchObject({ allowed: true });
    expect(Object.keys(list.links[0]).sort()).toEqual(['createdAt', 'id', 'institutionName', 'needsReloginSince', 'status', 'updatesAvailable']);
  });
});

describe('plaid-webhook', () => {
  const hook = (o: Record<string, unknown>, sig = 'good') => req(JSON.stringify({ environment: 'sandbox', ...o }), { 'plaid-verification': sig });

  it('rejects unsigned webhooks', async () => {
    const ctx = await setup({ connect: 1 });
    expect((await handlePlaidWebhook(hook({}, 'bad'), ctx.deps)).status).toBe(401);
  });

  it('login required -> reconnect; repaired -> active; updates -> flag; revoked -> removed', async () => {
    const ctx = await setup({ connect: 1 });
    const [link] = await ctx.store.listLinks(USER);
    const item = { item_id: link.item_id };
    await handlePlaidWebhook(hook({ ...item, webhook_type: 'ITEM', webhook_code: 'ERROR', error: { error_code: 'ITEM_LOGIN_REQUIRED' } }), ctx.deps);
    expect(await ctx.store.getLink(link.id)).toMatchObject({ status: 'needs_relogin', needs_relogin_since: ctx.clock.now.toISOString() });
    await handlePlaidWebhook(hook({ ...item, webhook_type: 'ITEM', webhook_code: 'LOGIN_REPAIRED' }), ctx.deps);
    expect(await ctx.store.getLink(link.id)).toMatchObject({ status: 'active', needs_relogin_since: null });
    await handlePlaidWebhook(hook({ ...item, webhook_type: 'TRANSACTIONS', webhook_code: 'SYNC_UPDATES_AVAILABLE' }), ctx.deps);
    expect((await ctx.store.getLink(link.id))!.updates_available).toBe(true);
    await handlePlaidWebhook(hook({ ...item, webhook_type: 'ITEM', webhook_code: 'PENDING_DISCONNECT' }), ctx.deps);
    expect((await ctx.store.getLink(link.id))!.status).toBe('expiring');
    await handlePlaidWebhook(hook({ ...item, webhook_type: 'ITEM', webhook_code: 'USER_PERMISSION_REVOKED' }), ctx.deps);
    expect((await ctx.store.getLink(link.id))!.status).toBe('removed');
  });

  it('ignores other environments and unknown items', async () => {
    const ctx = await setup({ connect: 1 });
    expect(await body(await handlePlaidWebhook(hook({ environment: 'production', item_id: 'x', webhook_type: 'ITEM', webhook_code: 'LOGIN_REPAIRED' }), ctx.deps))).toEqual({ ignored: 'environment' });
    expect(await body(await handlePlaidWebhook(hook({ item_id: 'nope', webhook_type: 'ITEM', webhook_code: 'LOGIN_REPAIRED' }), ctx.deps))).toEqual({ ignored: 'unknown_item' });
  });
});

describe('apple-notifications', () => {
  const note = (ctx: TestCtx, type: string, subtype: string | undefined, tx: Record<string, unknown> = {}, uuid = `${type}-${subtype}`) =>
    req(
      {
        signedPayload: JSON.stringify({
          notificationType: type,
          subtype,
          notificationUUID: uuid,
          data: { bundleId: 'app.ditchsubs.ditch', environment: 'Sandbox', signedTransactionInfo: txJws(ctx, { signedDate: ctx.clock.now.getTime(), ...tx }) },
        }),
      },
      { 'x-ditch-user': '', 'x-ditch-secret': '' },
    );

  it('trial cancelled (auto-renew off) keeps the bank; the cleanup removes it after the trial ends + 1 hour', async () => {
    const ctx = await setup({ connect: 2 });
    const res = await handleAppleNotification(note(ctx, 'DID_CHANGE_RENEWAL_STATUS', 'AUTO_RENEW_DISABLED'), ctx.deps);
    expect(await body(res)).toEqual({ ok: true, removed: 0 });
    expect(ctx.store.ents.get('otx-1')!.status).toBe('trial_cancelled');
    const run = () => handleCleanup(req({}, { 'x-cron-secret': 'cron-test-secret' }), ctx.deps);
    const trialEnd = Date.parse(ctx.store.ents.get('otx-1')!.expires_at!);
    ctx.clock.now = new Date(trialEnd + 30 * 60_000); // ended 30 min ago: still in the grace hour
    expect(await body(await run())).toMatchObject({ planned: 0 });
    ctx.clock.now = new Date(trialEnd + 61 * 60_000);
    expect(await body(await run())).toMatchObject({ planned: 2, removed: 2 });
  });

  it('trial cancelled, then turned back on: the bank stays past the old end date', async () => {
    const ctx = await setup({ connect: 1 });
    await handleAppleNotification(note(ctx, 'DID_CHANGE_RENEWAL_STATUS', 'AUTO_RENEW_DISABLED', {}, 'n1'), ctx.deps);
    ctx.clock.now = new Date(ctx.clock.now.getTime() + 1000);
    await handleAppleNotification(note(ctx, 'DID_CHANGE_RENEWAL_STATUS', 'AUTO_RENEW_ENABLED', {}, 'n2'), ctx.deps);
    expect(ctx.store.ents.get('otx-1')!.status).toBe('trial');
    // It converts to paid: DID_RENEW with a new year.
    const end = Date.parse(ctx.store.ents.get('otx-1')!.expires_at!);
    ctx.clock.now = new Date(end - 60_000);
    const renewed = note(ctx, 'DID_RENEW', undefined, { offerType: undefined, offerDiscountType: undefined, expiresDate: end + 365 * DAY }, 'n3');
    expect(await body(await handleAppleNotification(renewed, ctx.deps))).toEqual({ ok: true, removed: 0 });
    ctx.clock.now = new Date(end + 2 * 3600_000);
    expect(await body(await handleCleanup(req({}, { 'x-cron-secret': 'cron-test-secret' }), ctx.deps))).toMatchObject({ planned: 0 });
  });

  it('paid subscription with auto-renew off keeps the bank until expiry', async () => {
    const ctx = await setup({ connect: 1 });
    const paidTx = { offerType: undefined, offerDiscountType: undefined, price: 5999, expiresDate: ctx.clock.now.getTime() + 300 * DAY };
    expect(await body(await handleAppleNotification(note(ctx, 'DID_CHANGE_RENEWAL_STATUS', 'AUTO_RENEW_DISABLED', paidTx), ctx.deps))).toEqual({ ok: true, removed: 0 });
    expect(ctx.store.ents.get('otx-1')!.status).toBe('active');
  });

  it('refund removes the bank; a repeated notification is ignored', async () => {
    const ctx = await setup({ connect: 1 });
    expect(await body(await handleAppleNotification(note(ctx, 'REFUND', undefined, { revocationDate: ctx.clock.now.getTime() }), ctx.deps))).toEqual({ ok: true, removed: 1 });
    expect(await body(await handleAppleNotification(note(ctx, 'REFUND', undefined), ctx.deps))).toEqual({ ignored: 'duplicate' });
  });

  it('expired and grace-period-expired remove the bank', async () => {
    for (const type of ['EXPIRED', 'GRACE_PERIOD_EXPIRED']) {
      const ctx = await setup({ connect: 1 });
      expect(await body(await handleAppleNotification(note(ctx, type, undefined, { offerType: undefined, offerDiscountType: undefined }), ctx.deps))).toEqual({ ok: true, removed: 1 });
    }
  });

  it('a renewal keeps the bank; bad signatures and other apps are rejected', async () => {
    const ctx = await setup({ connect: 1 });
    const renewed = note(ctx, 'DID_RENEW', undefined, { offerType: undefined, offerDiscountType: undefined, expiresDate: ctx.clock.now.getTime() + 365 * DAY });
    expect(await body(await handleAppleNotification(renewed, ctx.deps))).toEqual({ ok: true, removed: 0 });
    expect((await handleAppleNotification(req({ signedPayload: 'BAD' }), ctx.deps)).status).toBe(400);
    const other = req({ signedPayload: JSON.stringify({ notificationType: 'EXPIRED', data: { bundleId: 'com.other' } }) });
    expect(await body(await handleAppleNotification(other, ctx.deps))).toEqual({ ignored: 'bundle' });
  });

  it('finds the user by original transaction when appAccountToken is missing', async () => {
    const ctx = await setup({ connect: 1 });
    expect(await body(await handleAppleNotification(note(ctx, 'EXPIRED', undefined, { appAccountToken: undefined }), ctx.deps))).toEqual({ ok: true, removed: 1 });
  });
});

describe('bank-cleanup (hourly cron)', () => {
  it('needs the cron secret', async () => {
    const ctx = await setup();
    expect((await handleCleanup(req({}), ctx.deps)).status).toBe(401);
  });

  it('removes lapsed users’ banks and 30-day broken ones, keeps the rest', async () => {
    const ctx = await setup({ connect: 2 });
    const [a] = await ctx.store.listLinks(USER);
    await ctx.store.updateLink(a.id, { status: 'needs_relogin', needs_relogin_since: new Date(ctx.clock.now.getTime() - 31 * DAY).toISOString() });
    const run = () => handleCleanup(req({}, { 'x-cron-secret': 'cron-test-secret' }), ctx.deps);
    expect(await body(await run())).toEqual({ live: 2, planned: 1, removed: 1, failed: 0 });
    // The trial runs out with no renewal: an hour later everything goes.
    ctx.clock.now = new Date(ctx.clock.now.getTime() + 6 * DAY + 2 * 3600_000);
    expect(await body(await run())).toEqual({ live: 1, planned: 1, removed: 1, failed: 0 });
    expect(await ctx.store.listLiveLinks()).toEqual([]);
  });
});

afterAll(() => {
  // No response the phone could ever see carries an access token.
  expect(allResponses.length).toBeGreaterThan(3);
  for (const r of allResponses) expect(r).not.toMatch(/access-sandbox|v1:/);
});
