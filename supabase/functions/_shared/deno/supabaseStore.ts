// The Store on top of Supabase Postgres, using the service-role/secret key (RLS is on and
// no other role has access). Deno only.

// eslint-disable-next-line import/no-unresolved -- Deno npm: specifier, checked with `deno check`
import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';
import type { NewLink, Store } from '../store.ts';
import type { AppUser, BankLink, Entitlement, EventRow, ProviderName } from '../types.ts';

function check<T>(r: { data: T; error: { message: string; code?: string } | null }): T {
  if (r.error) throw new Error(`db: ${r.error.code ?? ''} ${r.error.message}`);
  return r.data;
}

export class SupabaseStore implements Store {
  constructor(private readonly db: SupabaseClient) {}

  static fromEnv(url: string, key: string) {
    return new SupabaseStore(createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }));
  }

  async getUser(id: string) {
    return check(await this.db.from('app_users').select('id, secret_hash, created_at').eq('id', id).maybeSingle()) as AppUser | null;
  }
  async createUser(id: string, secretHash: string) {
    check(await this.db.from('app_users').insert({ id, secret_hash: secretHash }));
  }
  async setUserSecret(id: string, secretHash: string) {
    check(await this.db.from('app_users').update({ secret_hash: secretHash }).eq('id', id));
  }
  async existingUsers(ids: string[]) {
    if (!ids.length) return new Set<string>();
    const rows = check(await this.db.from('app_users').select('id').in('id', ids)) as { id: string }[];
    return new Set(rows.map((r) => r.id));
  }

  async getEntitlements(userId: string) {
    return check(await this.db.from('entitlements').select('*').eq('app_user_id', userId)) as Entitlement[];
  }
  async getEntitlementsFor(userIds: string[]) {
    const map = new Map<string, Entitlement[]>();
    if (!userIds.length) return map;
    const rows = check(await this.db.from('entitlements').select('*').in('app_user_id', userIds)) as Entitlement[];
    for (const r of rows) map.set(r.app_user_id, [...(map.get(r.app_user_id) ?? []), r]);
    return map;
  }
  async getEntitlementByOriginal(otid: string) {
    return check(await this.db.from('entitlements').select('*').eq('original_transaction_id', otid).maybeSingle()) as Entitlement | null;
  }
  async putEntitlement(e: Entitlement) {
    check(await this.db.from('entitlements').upsert(e, { onConflict: 'original_transaction_id' }));
  }

  async listLinks(userId: string) {
    return check(await this.db.from('bank_links').select('*').eq('app_user_id', userId).order('created_at')) as BankLink[];
  }
  async listLiveLinks() {
    return check(await this.db.from('bank_links').select('*').neq('status', 'removed')) as BankLink[];
  }
  async getLink(id: string) {
    return check(await this.db.from('bank_links').select('*').eq('id', id).maybeSingle()) as BankLink | null;
  }
  async getLinkByItem(provider: ProviderName, itemId: string) {
    const rows = check(await this.db.from('bank_links').select('*').eq('provider', provider).eq('item_id', itemId).order('created_at', { ascending: false }).limit(1)) as BankLink[];
    return rows[0] ?? null;
  }
  async insertLink(row: NewLink) {
    return check(await this.db.from('bank_links').insert(row).select('*').single()) as BankLink;
  }
  async updateLink(id: string, patch: Partial<BankLink>) {
    check(await this.db.from('bank_links').update(patch).eq('id', id));
  }

  async logEvent(e: EventRow) {
    const r = await this.db.from('events').insert({ kind: e.kind, app_user_id: e.app_user_id ?? null, link_id: e.link_id ?? null, detail: e.detail ?? {}, dedupe_key: e.dedupe_key ?? null });
    if (r.error?.code === '23505') return false; // unique dedupe_key: already handled
    check(r);
    return true;
  }
  async countEvents(userId: string, kind: string, sinceIso: string) {
    const r = await this.db.from('events').select('id', { count: 'exact', head: true }).eq('app_user_id', userId).eq('kind', kind).gte('at', sinceIso);
    if (r.error) throw new Error(`db: ${r.error.message}`);
    return r.count ?? 0;
  }
}
