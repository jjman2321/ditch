import type { DateOnly } from '@/domain/dates';
import type { Cycle } from '@/domain/money';
import type { Price } from './text';

/**
 * One subscription an importer spotted. It is only ever a suggestion: the
 * confirm list shows it and nothing is added until the user ticks it
 * (CLAUDE.md rule 5: we never claim we found everything).
 */
export type Found = {
  key: string;
  /** As shown on the screenshot or statement, tidied up. */
  name: string;
  catalogId: string | null;
  /** Next charge (renews / trial end), or the end date for 'ends' / 'expired'. */
  date: DateOnly | null;
  /** renews: active · trial: a free trial that turns paid · ends: already cancelled, runs out · expired: over. */
  state: 'renews' | 'trial' | 'ends' | 'expired';
  price: Price | null;
  cycle: Cycle | null;
  /** The proof, in words: "Renews Dec 12", "$19.99 on Sep 3, Oct 3, Nov 3". */
  evidence: string;
  confidence: 'high' | 'medium' | 'maybe';
  source: 'apple' | 'statement';
};

/** Ticked by default in the confirm list: the sure ones that still charge. */
export function preTicked(f: Found): boolean {
  return (f.state === 'renews' || f.state === 'trial') && f.confidence !== 'maybe';
}
