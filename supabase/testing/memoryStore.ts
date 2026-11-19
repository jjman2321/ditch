// In-memory Store for the Jest tests (not deployed).
import type { NewLink, Store } from '../functions/_shared/store.ts';
import type { AppUser, BankLink, Entitlement, EventRow, ProviderName } from '../functions/_shared/types.ts';

export class MemoryStore implements Store {
  users = new Map<string, AppUser>();
  ents = new Map<string, Entitlement>();
  links = new Map<string, BankLink>();
  events: (EventRow & { at: string })[] = [];
  private n = 0;
  constructor(private readonly now: () => Date = () => new Date()) {}

  async getUser(id: string) {
    return this.users.get(id) ?? null;
  }
  async createUser(id: string, secret_hash: string) {
    this.users.set(id, { id, secret_hash, created_at: this.now().toISOString() });
  }
  async setUserSecret(id: string, secret_hash: string) {
    const u = this.users.get(id);
    if (u) u.secret_hash = secret_hash;
  }
  async existingUsers(ids: string[]) {
    return new Set(ids.filter((i) => this.users.has(i)));
  }
  async getEntitlements(userId: string) {
    return [...this.ents.values()].filter((e) => e.app_user_id === userId);
  }
  async getEntitlementsFor(userIds: string[]) {
    const m = new Map<string, Entitlement[]>();
    for (const id of userIds) m.set(id, await this.getEntitlements(id));
    return m;
  }
  async getEntitlementByOriginal(otid: string) {
    return this.ents.get(otid) ?? null;
  }
  async putEntitlement(e: Entitlement) {
    this.ents.set(e.original_transaction_id, { ...e });
  }
  async listLinks(userId: string) {
    return [...this.links.values()].filter((l) => l.app_user_id === userId).map((l) => ({ ...l }));
  }
  async listLiveLinks() {
    return [...this.links.values()].filter((l) => l.status !== 'removed').map((l) => ({ ...l }));
  }
  async getLink(id: string) {
    const l = this.links.get(id);
    return l ? { ...l } : null;
  }
  async getLinkByItem(provider: ProviderName, itemId: string) {
    const l = [...this.links.values()].reverse().find((x) => x.provider === provider && x.item_id === itemId);
    return l ? { ...l } : null;
  }
  async insertLink(row: NewLink) {
    const live = [...this.links.values()].filter((l) => l.app_user_id === row.app_user_id && l.status !== 'removed' && l.status !== 'removing');
    if (live.length >= 3) throw new Error('bank_limit'); // mirrors the SQL trigger
    const link: BankLink = { ...row, id: `link-${++this.n}`, created_at: new Date(this.now().getTime() + this.n).toISOString() };
    this.links.set(link.id, link);
    return { ...link };
  }
  async updateLink(id: string, patch: Partial<BankLink>) {
    const l = this.links.get(id);
    if (l) Object.assign(l, patch);
  }
  async logEvent(e: EventRow) {
    if (e.dedupe_key && this.events.some((x) => x.dedupe_key === e.dedupe_key)) return false;
    this.events.push({ ...e, at: this.now().toISOString() });
    return true;
  }
  async countEvents(userId: string, kind: string, sinceIso: string) {
    return this.events.filter((e) => e.app_user_id === userId && e.kind === kind && e.at >= sinceIso).length;
  }
}
