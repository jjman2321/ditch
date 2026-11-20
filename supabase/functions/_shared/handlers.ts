// Every Edge Function's logic, as plain functions of (Request, Deps) -> Response.
// The Deno entry files only build Deps and call these, so Jest can test them with an
// in-memory store and fake providers.
//
// Hard rules kept here:
// - access tokens: decrypted only in memory, never logged, never returned to the phone
// - transactions: passed through to the phone, never stored or logged
// - Plaid cost rules: 3 banks max, remove at once when access ends, never /transactions/refresh

import { timingSafeEqual } from './bytes.ts';
import { decryptToken, encryptToken, hashSecret, sha256Hex } from './crypto.ts';
import type { AppleNotification, AppleRenewalInfo, AppleTransaction } from './appleJws.ts';
import { bankAccess, deriveEntitlement, isNewer, type BankAccess } from './entitlements.ts';
import { fail, json, parseJson, readBody, UUID_RE } from './http.ts';
import { canAddLink, duplicateOf, isLive, linkTokenAllowed, planCleanup, RENEWAL_GRACE_MS } from './policy.ts';
import { plaidWebhookAction, type PlaidWebhookBody } from './plaidWebhook.ts';
import { ProviderError, type BankProvider } from './provider.ts';
import type { Store } from './store.ts';
import type { AppUser, BankLink, BankTxn, EntitlementKind, ProviderName } from './types.ts';

export type Deps = {
  store: Store;
  provider(name: ProviderName): BankProvider;
  defaultProvider: ProviderName;
  tokenKey: CryptoKey;
  now(): Date;
  apple: {
    verify<T>(jws: string): Promise<T>;
    bundleId: string;
    /** 'Production', and 'Sandbox' for TestFlight and App Review. */
    environments: string[];
    products: Record<string, EntitlementKind>;
  };
  plaidWebhook: { verify(rawBody: string, header: string | null): Promise<{ ok: boolean; why?: string }>; env: string };
  cronSecret: string;
};

// ---------- helpers ----------

const HOUR = 60 * 60 * 1000;
const aad = (provider: ProviderName, itemId: string) => `${provider}:${itemId}`;
const syncToken = async (linkId: string, cursor: string) => (await sha256Hex(`${linkId}:${cursor}`)).slice(0, 32);
const errCode = (e: unknown) => (e instanceof ProviderError ? e.code : 'INTERNAL');
/** For troubleshooting with Plaid (Item Debugger, support tickets): the error code plus Plaid's request_id. */
const errInfo = (e: unknown) => ({ code: errCode(e), request_id: e instanceof ProviderError ? e.requestId : null });
/** Short, plain IDs from the phone only (link_session_id, request_id, codes): never free text. */
const idOrNull = (v: unknown) => (typeof v === 'string' && /^[A-Za-z0-9_.:-]{1,128}$/.test(v) ? v : null);

/** What the phone may see about a connection. No tokens, no cursors. */
export function publicLink(l: BankLink) {
  return {
    id: l.id,
    institutionName: l.institution_name,
    status: l.status,
    needsReloginSince: l.needs_relogin_since,
    updatesAvailable: l.updates_available,
    newAccounts: l.new_accounts,
    createdAt: l.created_at,
  };
}

async function authenticate(req: Request, store: Store): Promise<AppUser | Response> {
  const id = req.headers.get('x-ditch-user')?.toLowerCase() ?? '';
  const secret = req.headers.get('x-ditch-secret') ?? '';
  if (!UUID_RE.test(id) || secret.length < 32) return fail(401, 'unauthorized');
  const user = await store.getUser(id);
  if (!user || !timingSafeEqual(user.secret_hash, await hashSecret(secret))) return fail(401, 'unauthorized');
  return user;
}

async function postJson<T>(req: Request, maxBytes?: number): Promise<T | Response> {
  if (req.method !== 'POST') return fail(405, 'method_not_allowed');
  const text = await readBody(req, maxBytes);
  if (text === null) return fail(413, 'too_large');
  if (!text.trim()) return {} as T;
  return parseJson<T>(text) ?? fail(400, 'bad_json');
}

async function accessFor(deps: Deps, userId: string, graceMs = 0): Promise<BankAccess> {
  return bankAccess(await deps.store.getEntitlements(userId), deps.now(), graceMs);
}

/**
 * Stops billing for one connection: mark it "removing" (sync stops using it), call the
 * provider, then wipe the token and cursor. A failed remove stays "removing" and the hourly
 * cleanup retries it.
 */
export async function removeLink(deps: Deps, link: BankLink, reason: string): Promise<boolean> {
  const { store } = deps;
  if (link.status === 'removed') return true;
  if (link.status !== 'removing') await store.updateLink(link.id, { status: 'removing' });
  try {
    if (link.access_token_enc) {
      const token = await decryptToken(deps.tokenKey, link.access_token_enc, aad(link.provider, link.item_id));
      await deps.provider(link.provider).remove(token);
    }
  } catch (e) {
    await store.updateLink(link.id, { remove_attempts: link.remove_attempts + 1, last_error: errCode(e) });
    await store.logEvent({ kind: 'remove_failed', app_user_id: link.app_user_id, link_id: link.id, detail: { reason, item_id: link.item_id, ...errInfo(e) } });
    return false;
  }
  await store.updateLink(link.id, {
    status: 'removed',
    removed_at: deps.now().toISOString(),
    access_token_enc: null,
    cursor: null,
    pending_cursor: null,
    updates_available: false,
  });
  await store.logEvent({ kind: 'link_removed', app_user_id: link.app_user_id, link_id: link.id, detail: { reason, item_id: link.item_id } });
  return true;
}

async function removeAllLinks(deps: Deps, userId: string, reason: string): Promise<number> {
  let n = 0;
  for (const l of (await deps.store.listLinks(userId)).filter(isLive)) if (await removeLink(deps, l, reason)) n++;
  return n;
}

// ---------- bank-link-token ----------

export async function handleLinkToken(req: Request, deps: Deps): Promise<Response> {
  // newAccounts (update mode only): open Account Select so the person can share the bank's new accounts.
  const body = await postJson<{ mode?: 'new' | 'update'; linkId?: string; provider?: ProviderName; newAccounts?: boolean }>(req);
  if (body instanceof Response) return body;
  const user = await authenticate(req, deps.store);
  if (user instanceof Response) return user;

  const access = await accessFor(deps, user.id);
  if (!access.allowed) return fail(402, 'not_entitled', { reason: access.reason });

  const now = deps.now().getTime();
  const [hour, day] = await Promise.all([
    deps.store.countEvents(user.id, 'link_token', new Date(now - HOUR).toISOString()),
    deps.store.countEvents(user.id, 'link_token', new Date(now - 24 * HOUR).toISOString()),
  ]);
  if (!linkTokenAllowed(hour, day)) return fail(429, 'rate_limited');

  const links = await deps.store.listLinks(user.id);
  try {
    if (body.mode === 'update') {
      const link = links.find((l) => l.id === body.linkId && isLive(l) && l.status !== 'removing');
      if (!link?.access_token_enc) return fail(404, 'link_not_found');
      const token = await decryptToken(deps.tokenKey, link.access_token_enc, aad(link.provider, link.item_id));
      const newAccounts = body.newAccounts === true;
      const lt = await deps.provider(link.provider).createLinkToken({ mode: 'update', appUserId: user.id, accessToken: token, ...(newAccounts ? { newAccounts } : {}) });
      await deps.store.logEvent({ kind: 'link_token', app_user_id: user.id, link_id: link.id, detail: { mode: 'update', ...(newAccounts ? { newAccounts } : {}) } });
      return json(200, { linkToken: lt.linkToken, expiration: lt.expiration, provider: link.provider, mode: 'update' });
    }
    // A cancelled trial keeps its banks until the end date, but adds no new ones (each new bank bills a month).
    if (access.reason === 'trial_ending') return fail(402, 'not_entitled', { reason: access.reason });
    if (!canAddLink(links)) return fail(409, 'bank_limit', { max: 3 });
    const providerName = body.provider === 'stripe' || body.provider === 'plaid' ? body.provider : deps.defaultProvider;
    const lt = await deps.provider(providerName).createLinkToken({ mode: 'new', appUserId: user.id });
    await deps.store.logEvent({ kind: 'link_token', app_user_id: user.id, detail: { mode: 'new', provider: providerName } });
    return json(200, { linkToken: lt.linkToken, expiration: lt.expiration, provider: providerName, mode: 'new' });
  } catch (e) {
    await deps.store.logEvent({ kind: 'link_token_failed', app_user_id: user.id, link_id: body.mode === 'update' ? (body.linkId ?? null) : null, detail: { mode: body.mode ?? 'new', ...errInfo(e) } });
    return fail(502, 'provider_error', { code: errCode(e) });
  }
}

// ---------- bank-exchange ----------

export async function handleExchange(req: Request, deps: Deps): Promise<Response> {
  // linkSessionId: Plaid Link's session id from the phone, logged for troubleshooting with Plaid.
  const body = await postJson<{ publicToken?: string; provider?: ProviderName; linkSessionId?: string }>(req);
  if (body instanceof Response) return body;
  const user = await authenticate(req, deps.store);
  if (user instanceof Response) return user;
  if (typeof body.publicToken !== 'string' || !body.publicToken || body.publicToken.length > 512) return fail(400, 'bad_public_token');

  const access = await accessFor(deps, user.id);
  if (!access.allowed || access.reason === 'trial_ending') return fail(402, 'not_entitled', { reason: access.reason });

  const providerName = body.provider === 'stripe' || body.provider === 'plaid' ? body.provider : deps.defaultProvider;
  const provider = deps.provider(providerName);
  let ex;
  try {
    ex = await provider.exchange(body.publicToken);
  } catch (e) {
    await deps.store.logEvent({ kind: 'exchange_failed', app_user_id: user.id, detail: { link_session_id: idOrNull(body.linkSessionId), ...errInfo(e) } });
    return fail(502, 'provider_error', { code: errCode(e) });
  }

  // From here on a billable connection exists: any failure removes it again.
  try {
    const links = (await deps.store.listLinks(user.id)).filter(isLive);
    const dup = duplicateOf(links, ex.institutionId);
    const others = dup ? links.filter((l) => l.id !== dup.id) : links;
    if (!canAddLink(others)) {
      await provider.remove(ex.accessToken);
      await deps.store.logEvent({ kind: 'exchange_over_cap', app_user_id: user.id, detail: { item_id: ex.itemId, link_session_id: idOrNull(body.linkSessionId) } });
      return fail(409, 'bank_limit', { max: 3 });
    }
    // Same bank again (usually a re-link): the old connection goes first, so the cap holds.
    if (dup) await removeLink(deps, dup, 'replaced_by_relink');
    const row = await deps.store.insertLink({
      app_user_id: user.id,
      provider: providerName,
      item_id: ex.itemId,
      access_token_enc: await encryptToken(deps.tokenKey, ex.accessToken, aad(providerName, ex.itemId)),
      cursor: null,
      pending_cursor: null,
      status: 'active',
      institution_id: ex.institutionId,
      institution_name: ex.institutionName,
      needs_relogin_since: null,
      updates_available: false,
      new_accounts: false,
      last_error: null,
      remove_attempts: 0,
      removed_at: null,
    });
    await deps.store.logEvent({
      kind: 'link_created',
      app_user_id: user.id,
      link_id: row.id,
      detail: { provider: providerName, item_id: ex.itemId, institution_id: ex.institutionId, link_session_id: idOrNull(body.linkSessionId) },
    });
    return json(200, { link: publicLink(row), replaced: dup?.id ?? null });
  } catch (e) {
    await provider.remove(ex.accessToken).catch(() => undefined);
    await deps.store.logEvent({ kind: 'exchange_failed', app_user_id: user.id, detail: { item_id: ex.itemId, link_session_id: idOrNull(body.linkSessionId), ...errInfo(e) } });
    return fail(500, 'exchange_failed');
  }
}

// ---------- bank-sync ----------

export type SyncedLink = {
  linkId: string;
  institutionName: string | null;
  status: BankLink['status'];
  /** The bank has an account not shared with Ditch yet (Plaid NEW_ACCOUNTS_AVAILABLE). */
  newAccounts: boolean;
  ready: boolean;
  added: BankTxn[];
  modified: BankTxn[];
  removed: string[];
  /** Send back as ack[linkId] on the next call once these transactions are saved on the phone. */
  syncToken: string | null;
};

export async function handleSync(req: Request, deps: Deps): Promise<Response> {
  // repaired: the link the phone just fixed in Plaid's update mode. Plaid sends no webhook for that
  // (LOGIN_REPAIRED is only for Items that heal on their own), so the phone tells us.
  const body = await postJson<{ linkId?: string; ack?: Record<string, string>; repaired?: string }>(req);
  if (body instanceof Response) return body;
  const user = await authenticate(req, deps.store);
  if (user instanceof Response) return user;
  const { store } = deps;

  // Same 1-hour grace as the cleanup, so a late Apple renewal notice can't cost a paying user their bank.
  const access = await accessFor(deps, user.id, RENEWAL_GRACE_MS);
  if (!access.allowed) {
    // Paying stopped and we missed it: remove now (Plaid bills every month a connection exists).
    await removeAllLinks(deps, user.id, `sync_${access.reason}`);
    return fail(402, 'not_entitled', { reason: access.reason });
  }

  const ack = body.ack && typeof body.ack === 'object' ? body.ack : {};
  const links = (await store.listLinks(user.id)).filter((l) => isLive(l) && l.status !== 'removing' && (!body.linkId || l.id === body.linkId));
  const out: SyncedLink[] = [];
  for (const link of links) {
    const entry: SyncedLink = {
      linkId: link.id,
      institutionName: link.institution_name,
      status: link.status,
      newAccounts: link.new_accounts,
      ready: false,
      added: [],
      modified: [],
      removed: [],
      syncToken: null,
    };
    out.push(entry);
    const repaired = body.repaired === link.id;
    if ((link.status === 'needs_relogin' && !repaired) || !link.access_token_enc) continue; // calling would only fail; the phone shows "Reconnect"

    // The phone confirmed it saved the last batch: that cursor becomes the real one.
    let cursor = link.cursor;
    if (link.pending_cursor && ack[link.id] && ack[link.id] === (await syncToken(link.id, link.pending_cursor))) {
      cursor = link.pending_cursor;
      await store.updateLink(link.id, { cursor, pending_cursor: null });
    }

    try {
      const token = await decryptToken(deps.tokenKey, link.access_token_enc, aad(link.provider, link.item_id));
      const delta = await deps.provider(link.provider).sync(token, cursor);
      entry.ready = delta.ready;
      entry.added = delta.added;
      entry.modified = delta.modified;
      entry.removed = delta.removed;
      const changed = delta.ready && delta.nextCursor && delta.nextCursor !== cursor;
      entry.syncToken = changed ? await syncToken(link.id, delta.nextCursor) : null;
      // A good sync heals errors and a lost login; "expiring" only clears once the person re-consented (repaired).
      const healed = link.status === 'error' || link.needs_relogin_since != null || (repaired && link.status !== 'active');
      // The phone just finished update mode (Account Select for new accounts included): the new-account flag is done.
      const sharedNew = repaired && link.new_accounts;
      await store.updateLink(link.id, {
        pending_cursor: changed ? delta.nextCursor : null,
        updates_available: false,
        ...(healed ? { status: 'active', needs_relogin_since: null, last_error: null } : {}),
        ...(sharedNew ? { new_accounts: false } : {}),
      });
      if (healed) entry.status = 'active';
      if (sharedNew) entry.newAccounts = false;
    } catch (e) {
      if (e instanceof ProviderError && e.needsRelogin) {
        await store.logEvent({ kind: 'needs_relogin', app_user_id: user.id, link_id: link.id, detail: { item_id: link.item_id, ...errInfo(e) } });
        await store.updateLink(link.id, { status: 'needs_relogin', needs_relogin_since: link.needs_relogin_since ?? deps.now().toISOString(), last_error: e.code });
        entry.status = 'needs_relogin';
      } else {
        await store.updateLink(link.id, { last_error: errCode(e) });
        await store.logEvent({ kind: 'sync_failed', app_user_id: user.id, link_id: link.id, detail: { item_id: link.item_id, ...errInfo(e) } });
        entry.status = 'error';
      }
    }
  }
  return json(200, { links: out });
}

// ---------- bank-remove ----------

export async function handleRemove(req: Request, deps: Deps): Promise<Response> {
  const body = await postJson<{ linkId?: string; all?: boolean }>(req);
  if (body instanceof Response) return body;
  const user = await authenticate(req, deps.store);
  if (user instanceof Response) return user;
  const links = (await deps.store.listLinks(user.id)).filter((l) => isLive(l) && (body.all || l.id === body.linkId));
  if (!links.length) return body.all ? json(200, { removed: 0, pending: 0 }) : fail(404, 'link_not_found');
  let removed = 0;
  for (const l of links) if (await removeLink(deps, l, 'user')) removed++;
  // Anything that failed stays "removing" and the hourly cleanup finishes it.
  return json(200, { removed, pending: links.length - removed });
}

// ---------- bank-list ----------

export async function handleList(req: Request, deps: Deps): Promise<Response> {
  if (req.method !== 'POST' && req.method !== 'GET') return fail(405, 'method_not_allowed');
  const user = await authenticate(req, deps.store);
  if (user instanceof Response) return user;
  const [links, access] = await Promise.all([deps.store.listLinks(user.id), accessFor(deps, user.id)]);
  return json(200, { links: links.filter(isLive).map(publicLink), access, maxLinks: 3 });
}

// ---------- plaid-webhook ----------

export async function handlePlaidWebhook(req: Request, deps: Deps): Promise<Response> {
  if (req.method !== 'POST') return fail(405, 'method_not_allowed');
  const raw = await readBody(req);
  if (raw === null) return fail(413, 'too_large');
  const v = await deps.plaidWebhook.verify(raw, req.headers.get('plaid-verification'));
  if (!v.ok) return fail(401, 'bad_signature');
  const body = parseJson<PlaidWebhookBody>(raw);
  if (!body) return fail(400, 'bad_json');
  if (body.environment && body.environment !== deps.plaidWebhook.env) return json(200, { ignored: 'environment' });

  const action = plaidWebhookAction(body);
  if (action.kind === 'ignore') return json(200, { ignored: action.reason });
  const link = await deps.store.getLinkByItem('plaid', action.itemId);
  if (!link || link.status === 'removed') {
    // An Item we don't hold a token for can't be removed by us; log it for the monthly bill check.
    await deps.store.logEvent({ kind: 'webhook_unknown_item', detail: { code: body.webhook_code, item_id: action.itemId } });
    return json(200, { ignored: 'unknown_item' });
  }
  const now = deps.now().toISOString();
  switch (action.kind) {
    case 'sync_ready':
      await deps.store.updateLink(link.id, { updates_available: true });
      break;
    case 'needs_relogin':
      await deps.store.updateLink(link.id, { status: 'needs_relogin', needs_relogin_since: link.needs_relogin_since ?? now, last_error: action.code });
      break;
    case 'error':
      await deps.store.updateLink(link.id, { status: 'error', last_error: action.code });
      break;
    case 'expiring':
      if (link.status === 'active') await deps.store.updateLink(link.id, { status: 'expiring' });
      break;
    case 'repaired':
      await deps.store.updateLink(link.id, { status: 'active', needs_relogin_since: null, last_error: null });
      break;
    case 'revoked':
      await removeLink(deps, link, 'user_revoked_at_bank');
      break;
    case 'new_accounts':
      await deps.store.updateLink(link.id, { new_accounts: true });
      break;
  }
  await deps.store.logEvent({ kind: 'plaid_webhook', app_user_id: link.app_user_id, link_id: link.id, detail: { type: body.webhook_type, code: body.webhook_code, action: action.kind, item_id: action.itemId } });
  return json(200, { ok: true });
}

// ---------- apple-notifications (App Store Server Notifications V2) ----------

export async function handleAppleNotification(req: Request, deps: Deps): Promise<Response> {
  const body = await postJson<{ signedPayload?: string }>(req, 256 * 1024);
  if (body instanceof Response) return body;
  if (typeof body.signedPayload !== 'string') return fail(400, 'no_signed_payload');
  let n: AppleNotification;
  try {
    n = await deps.apple.verify<AppleNotification>(body.signedPayload);
  } catch {
    return fail(400, 'bad_signature');
  }
  const data = n.data ?? {};
  if (data.bundleId !== deps.apple.bundleId) return json(200, { ignored: 'bundle' });
  if (data.environment && !deps.apple.environments.includes(data.environment)) return json(200, { ignored: 'environment' });
  if (n.notificationUUID && !(await deps.store.logEvent({ kind: 'apple_notification', dedupe_key: `apple:${n.notificationUUID}`, detail: { type: n.notificationType, subtype: n.subtype ?? null } }))) {
    return json(200, { ignored: 'duplicate' });
  }
  if (n.notificationType === 'TEST' || !data.signedTransactionInfo) return json(200, { ok: true });

  let tx: AppleTransaction;
  let renewal: AppleRenewalInfo | null = null;
  try {
    tx = await deps.apple.verify<AppleTransaction>(data.signedTransactionInfo);
    if (data.signedRenewalInfo) renewal = await deps.apple.verify<AppleRenewalInfo>(data.signedRenewalInfo);
  } catch {
    return fail(400, 'bad_signature');
  }
  if (tx.bundleId !== deps.apple.bundleId) return json(200, { ignored: 'bundle' });

  // Who is it? The appAccountToken we set at purchase, else the original transaction we've seen.
  let userId = tx.appAccountToken?.toLowerCase() ?? '';
  if (!UUID_RE.test(userId) || !(await deps.store.getUser(userId))) {
    userId = (tx.originalTransactionId && (await deps.store.getEntitlementByOriginal(tx.originalTransactionId))?.app_user_id) || '';
  }
  if (!userId) return json(200, { ignored: 'unknown_user' }); // never connected a bank: nothing to do

  const ent = deriveEntitlement({
    appUserId: userId,
    tx,
    renewal,
    notification: { notificationType: n.notificationType, subtype: n.subtype, status: data.status },
    products: deps.apple.products,
    now: deps.now(),
  });
  if (!ent) return json(200, { ignored: 'product' });
  if (isNewer(ent, tx.originalTransactionId ? await deps.store.getEntitlementByOriginal(tx.originalTransactionId) : null)) await deps.store.putEntitlement(ent);

  // Expired, refunded, revoked: the bank goes now. A cancelled trial or auto-renew off keeps it until
  // the period ends (DECISIONS #67); the hourly cleanup removes it then.
  const access = await accessFor(deps, userId, RENEWAL_GRACE_MS);
  const removed = access.allowed ? 0 : await removeAllLinks(deps, userId, `apple_${n.notificationType}_${access.reason}`);
  return json(200, { ok: true, removed });
}

// ---------- entitlement-sync (the phone posts its StoreKit 2 signed transactions) ----------

const ROTATE_MAX_AGE_MS = 24 * HOUR;

export async function handleEntitlementSync(req: Request, deps: Deps): Promise<Response> {
  const body = await postJson<{ transactions?: unknown; renewals?: unknown }>(req, 256 * 1024);
  if (body instanceof Response) return body;
  const id = req.headers.get('x-ditch-user')?.toLowerCase() ?? '';
  const secret = req.headers.get('x-ditch-secret') ?? '';
  if (!UUID_RE.test(id) || secret.length < 32) return fail(401, 'unauthorized');
  const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.length < 20_000).slice(0, 20) : []);
  const now = deps.now();

  // Only Apple-signed transactions for our app, made with this install's appAccountToken, count.
  const txs: AppleTransaction[] = [];
  for (const jws of list(body.transactions)) {
    try {
      const tx = await deps.apple.verify<AppleTransaction>(jws);
      if (tx.bundleId !== deps.apple.bundleId) continue;
      if (tx.environment && !deps.apple.environments.includes(tx.environment)) continue;
      if (tx.appAccountToken?.toLowerCase() !== id) continue;
      txs.push(tx);
    } catch {
      // ignore unverifiable data
    }
  }
  const renewals = new Map<string, AppleRenewalInfo>();
  for (const jws of list(body.renewals)) {
    try {
      const r = await deps.apple.verify<AppleRenewalInfo>(jws);
      if (r.originalTransactionId) renewals.set(r.originalTransactionId, r);
    } catch {
      // ignore
    }
  }

  const secretHash = await hashSecret(secret);
  const user = await deps.store.getUser(id);
  if (!user) {
    // First contact: a user row exists only once Apple proves a purchase made with this id.
    if (!txs.length) return fail(401, 'unauthorized');
    await deps.store.createUser(id, secretHash);
    await deps.store.logEvent({ kind: 'user_created', app_user_id: id });
  } else if (!timingSafeEqual(user.secret_hash, secretHash)) {
    // Same Apple id, new install secret (Keychain lost): allowed only with freshly signed proof.
    const fresh = txs.some((t) => typeof t.signedDate === 'number' && now.getTime() - t.signedDate < ROTATE_MAX_AGE_MS);
    if (!fresh) return fail(401, 'unauthorized');
    await deps.store.setUserSecret(id, secretHash);
    await deps.store.logEvent({ kind: 'secret_rotated', app_user_id: id });
  }

  for (const tx of txs) {
    const ent = deriveEntitlement({ appUserId: id, tx, renewal: tx.originalTransactionId ? renewals.get(tx.originalTransactionId) : null, products: deps.apple.products, now });
    if (!ent) continue;
    if (isNewer(ent, await deps.store.getEntitlementByOriginal(ent.original_transaction_id))) await deps.store.putEntitlement(ent);
  }

  const ents = await deps.store.getEntitlements(id);
  const access = bankAccess(ents, now, RENEWAL_GRACE_MS);
  const removed = access.allowed ? 0 : await removeAllLinks(deps, id, `entitlement_${access.reason}`);
  return json(200, {
    access,
    removed,
    entitlements: ents.map((e) => ({ kind: e.kind, status: e.status, expiresAt: e.expires_at, inTrial: e.in_trial })),
  });
}

// ---------- bank-cleanup (pg_cron, hourly) ----------

export async function handleCleanup(req: Request, deps: Deps): Promise<Response> {
  if (req.method !== 'POST') return fail(405, 'method_not_allowed');
  if (!deps.cronSecret || !timingSafeEqual(req.headers.get('x-cron-secret') ?? '', deps.cronSecret)) return fail(401, 'unauthorized');
  const links = await deps.store.listLiveLinks();
  const userIds = [...new Set(links.map((l) => l.app_user_id))];
  const [users, ents] = await Promise.all([deps.store.existingUsers(userIds), deps.store.getEntitlementsFor(userIds)]);
  const plan = planCleanup(links, ents, users, deps.now());
  let removed = 0;
  const byId = new Map(links.map((l) => [l.id, l]));
  for (const r of plan) if (await removeLink(deps, byId.get(r.linkId)!, `cleanup_${r.reason}`)) removed++;
  await deps.store.logEvent({ kind: 'cleanup_run', detail: { live: links.length, planned: plan.length, removed } });
  return json(200, { live: links.length, planned: plan.length, removed, failed: plan.length - removed });
}

// ---------- link-event (Plaid Link exits from the phone, for troubleshooting) ----------

/**
 * The phone reports how Plaid Link ended when it didn't finish: link_session_id, request_id, error code
 * and type, the step it stopped at, and the bank's id. IDs and codes only; nothing about the person.
 */
export async function handleLinkEvent(req: Request, deps: Deps): Promise<Response> {
  const body = await postJson<Record<string, unknown>>(req);
  if (body instanceof Response) return body;
  const user = await authenticate(req, deps.store);
  if (user instanceof Response) return user;
  const now = deps.now().getTime();
  // A little flood guard: plenty for real use, too few to fill the log.
  if ((await deps.store.countEvents(user.id, 'link_exit', new Date(now - HOUR).toISOString())) >= 30) return json(200, { ok: true, dropped: true });
  await deps.store.logEvent({
    kind: 'link_exit',
    app_user_id: user.id,
    link_id: idOrNull(body.linkId),
    detail: {
      link_session_id: idOrNull(body.linkSessionId),
      request_id: idOrNull(body.requestId),
      code: idOrNull(body.errorCode),
      error_type: idOrNull(body.errorType),
      status: idOrNull(body.status),
      institution_id: idOrNull(body.institutionId),
      mode: body.mode === 'update' ? 'update' : 'new',
    },
  });
  return json(200, { ok: true });
}
