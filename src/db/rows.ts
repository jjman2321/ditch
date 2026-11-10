// Row <-> Sub mapping. Pure, so it's tested without a database.

import type { DateSource } from '@/domain/charges';
import type { Cycle } from '@/domain/money';
import type { PriceSource, Sub, SubKind, SubSource, SubStatus } from '@/domain/subs';

import type { SqlParam } from './sql';

export type SubRow = {
  id: string;
  kind: string;
  catalog_id: string | null;
  name: string;
  category: string | null;
  amount_minor: number | null;
  currency: string | null;
  cycle: string;
  amount_is_estimate: number;
  plan_id: string | null;
  plan_name: string | null;
  price_source: string;
  price_country: string | null;
  anchor_date: string;
  date_source: string;
  is_trial: number;
  free_pick: number;
  reminders_muted: number;
  status: string;
  ditched_on: string | null;
  cancel_by: string | null;
  confirmed_on: string | null;
  ditched_amount_minor: number | null;
  ditched_currency: string | null;
  ditched_cycle: string | null;
  source: string;
  created_at: string;
  updated_at: string;
};

export const SUB_COLUMNS: (keyof SubRow)[] = [
  'id',
  'kind',
  'catalog_id',
  'name',
  'category',
  'amount_minor',
  'currency',
  'cycle',
  'amount_is_estimate',
  'plan_id',
  'plan_name',
  'price_source',
  'price_country',
  'anchor_date',
  'date_source',
  'is_trial',
  'free_pick',
  'reminders_muted',
  'status',
  'ditched_on',
  'cancel_by',
  'confirmed_on',
  'ditched_amount_minor',
  'ditched_currency',
  'ditched_cycle',
  'source',
  'created_at',
  'updated_at',
];

const CYCLES: Cycle[] = ['weekly', 'monthly', 'quarterly', 'yearly'];
const oneOf = <T extends string>(v: string | null, ok: readonly T[], fallback: T): T => (ok.includes(v as T) ? (v as T) : fallback);
const int = (v: number | null) => (v === null || v === undefined ? null : Math.round(Number(v)));

export function rowToSub(r: SubRow): Sub {
  return {
    id: r.id,
    kind: oneOf<SubKind>(r.kind, ['user', 'ditch_pro_trial'], 'user'),
    catalogId: r.catalog_id,
    name: r.name,
    category: r.category,
    amountMinor: int(r.amount_minor),
    currency: r.currency,
    cycle: oneOf(r.cycle, CYCLES, 'monthly'),
    amountIsEstimate: !!r.amount_is_estimate,
    planId: r.plan_id,
    planName: r.plan_name,
    priceSource: oneOf<PriceSource>(r.price_source, ['catalog', 'user', 'none'], 'none'),
    priceCountry: r.price_country,
    anchor: r.anchor_date,
    dateSource: oneOf<DateSource>(r.date_source, ['none', 'next', 'receipt'], 'none'),
    isTrial: !!r.is_trial,
    freePick: !!r.free_pick,
    muted: !!r.reminders_muted,
    status: oneOf<SubStatus>(r.status, ['active', 'ditched-pending', 'ditched-confirmed', 'deleted'], 'active'),
    ditchedOn: r.ditched_on,
    cancelBy: r.cancel_by,
    confirmedOn: r.confirmed_on,
    snapAmountMinor: int(r.ditched_amount_minor),
    snapCurrency: r.ditched_currency,
    snapCycle: r.ditched_cycle ? oneOf(r.ditched_cycle, CYCLES, 'monthly') : null,
    source: oneOf<SubSource>(r.source, ['onboarding', 'manual', 'catalog', 'import', 'trial'], 'manual'),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function subToRow(s: Sub): SubRow {
  if (s.amountMinor !== null && !Number.isSafeInteger(s.amountMinor)) throw new Error('Amounts are whole minor units');
  return {
    id: s.id,
    kind: s.kind,
    catalog_id: s.catalogId,
    name: s.name,
    category: s.category,
    amount_minor: s.amountMinor,
    currency: s.currency,
    cycle: s.cycle,
    amount_is_estimate: s.amountIsEstimate ? 1 : 0,
    plan_id: s.planId,
    plan_name: s.planName,
    price_source: s.priceSource,
    price_country: s.priceCountry,
    anchor_date: s.anchor,
    date_source: s.dateSource,
    is_trial: s.isTrial ? 1 : 0,
    free_pick: s.freePick ? 1 : 0,
    reminders_muted: s.muted ? 1 : 0,
    status: s.status,
    ditched_on: s.ditchedOn,
    cancel_by: s.cancelBy,
    confirmed_on: s.confirmedOn,
    ditched_amount_minor: s.snapAmountMinor,
    ditched_currency: s.snapCurrency,
    ditched_cycle: s.snapCycle,
    source: s.source,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  };
}

export function rowParams(r: SubRow): SqlParam[] {
  return SUB_COLUMNS.map((c) => r[c] as SqlParam);
}
