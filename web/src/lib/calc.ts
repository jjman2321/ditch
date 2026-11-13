import type { CalcService } from '@/components/Calculator';

import { COUNTRIES, defaultPlan, formatDate, hasLogo, priceFor, serviceById, verifiedPrices } from './data';

export const CALC_IDS = ['netflix', 'spotify', 'chatgpt-plus', 'amazon-prime', 'disney-plus', 'apple-music', 'youtube-premium', 'youtube-music', 'max', 'xbox-game-pass', 'claude-pro', 'microsoft-365', 'hulu', 'ps-plus', 'paramount-plus', 'peacock', 'google-one', 'audible'];

/** The calculator's data: each service's usual plan per country, plus each country's latest check date. */
export function calcData(ids = CALC_IDS) {
  const services: CalcService[] = ids.flatMap((id) => {
    const s = serviceById(id);
    if (!s) return [];
    const prices: CalcService['prices'] = {};
    for (const r of verifiedPrices(id)) {
      const p = defaultPlan(r);
      prices[r.country] = { plan: p.name, amountMinor: p.amountMinor, cycle: p.cycle, currency: r.currency };
    }
    return [{ id, name: s.name, logo: hasLogo(id), prices }];
  });
  const countries = COUNTRIES.map((c) => {
    const checked = ids.map((id) => priceFor(id, c.code)?.checked).filter(Boolean).sort().pop();
    return { code: c.code, name: c.name, checked: checked ? formatDate(checked) : '' };
  });
  return { services, countries };
}
