// Plaid cost rules as code (docs/research/bank-sync-2026-11-19.md, "Keeping Plaid costs down").
// Plaid bills every Item every calendar month while it exists, so anything we don't need is removed.

import { bankAccess } from './entitlements.ts';
import type { BankLink, Entitlement } from './types.ts';

/** Rule 1: at most 3 banks per user. */
export const MAX_LINKS_PER_USER = 3;
/** Rule 5: a connection stuck on "Reconnect your bank" this long is removed. */
export const RELOGIN_REMOVE_DAYS = 30;
/** How late an Apple renewal may be before the hourly cleanup treats a period as over. */
export const RENEWAL_GRACE_MS = 60 * 60 * 1000;
/** Link-token rate limits (each token can create a billable Item). */
export const LINK_TOKENS_PER_HOUR = 10;
export const LINK_TOKENS_PER_DAY = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

export const isLive = (l: Pick<BankLink, 'status'>) => l.status !== 'removed';

export function canAddLink(liveLinks: BankLink[]): boolean {
  return liveLinks.filter(isLive).length < MAX_LINKS_PER_USER;
}

/** Same bank connected again (often a re-link after a broken login): the older one goes. */
export function duplicateOf(liveLinks: BankLink[], institutionId: string | null, exceptId?: string): BankLink | null {
  if (!institutionId) return null;
  return liveLinks.find((l) => isLive(l) && l.id !== exceptId && l.institution_id === institutionId) ?? null;
}

export function linkTokenAllowed(lastHour: number, lastDay: number): boolean {
  return lastHour < LINK_TOKENS_PER_HOUR && lastDay < LINK_TOKENS_PER_DAY;
}

export type RemovalReason = 'retry_remove' | 'no_user' | 'not_entitled' | 'relogin_30d' | 'over_cap';
export type Removal = { linkId: string; appUserId: string; reason: RemovalReason };

/**
 * The hourly/nightly reconciliation: every live Item must belong to an entitled user, must not be
 * stuck needing a re-login for 30+ days, and a user holds at most 3. Returns what to remove.
 */
export function planCleanup(links: BankLink[], entitlementsByUser: Map<string, Entitlement[]>, knownUsers: Set<string>, now: Date): Removal[] {
  const out: Removal[] = [];
  const taken = new Set<string>();
  const add = (l: BankLink, reason: RemovalReason) => {
    if (taken.has(l.id)) return;
    taken.add(l.id);
    out.push({ linkId: l.id, appUserId: l.app_user_id, reason });
  };
  const live = links.filter(isLive);
  for (const l of live) {
    if (l.status === 'removing') add(l, 'retry_remove');
    else if (!knownUsers.has(l.app_user_id)) add(l, 'no_user');
    else if (!bankAccess(entitlementsByUser.get(l.app_user_id) ?? [], now, RENEWAL_GRACE_MS).allowed) add(l, 'not_entitled');
    else if (l.needs_relogin_since && now.getTime() - Date.parse(l.needs_relogin_since) >= RELOGIN_REMOVE_DAYS * DAY_MS) add(l, 'relogin_30d');
  }
  // Over the cap (shouldn't happen, but a race between two phones could): keep the 3 newest.
  const byUser = new Map<string, BankLink[]>();
  for (const l of live) if (!taken.has(l.id)) byUser.set(l.app_user_id, [...(byUser.get(l.app_user_id) ?? []), l]);
  for (const list of byUser.values()) {
    list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    for (const l of list.slice(MAX_LINKS_PER_USER)) add(l, 'over_cap');
  }
  return out;
}
