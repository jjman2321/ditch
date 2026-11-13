'use client';

import { useState, useSyncExternalStore } from 'react';

import { CYCLE_SHORT, formatMoney, yearlyMinor, type Cycle } from '@/lib/money';

export type CountryPrices = { country: string; name: string; tax: string; currency: string; checked: string; source: string; sourceLabel: string; appStore: boolean; plans: { id: string; name: string; amountMinor: number; cycle: Cycle }[] };

/** Best guess from the browser's time zone. Nothing is sent anywhere; the page is the same file for everyone. */
const ZONES: Record<string, string> = {
  'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Berlin': 'DE', 'Europe/Paris': 'FR', 'Europe/Rome': 'IT', 'Europe/Madrid': 'ES', 'Europe/Amsterdam': 'NL',
  'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Qatar': 'QA', 'Asia/Kuwait': 'KW', 'Africa/Cairo': 'EG',
  'Pacific/Auckland': 'NZ', 'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA', 'America/Winnipeg': 'CA', 'America/Halifax': 'CA', 'America/St_Johns': 'CA',
};
function guess(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (ZONES[tz]) return ZONES[tz];
    if (tz.startsWith('Australia/')) return 'AU';
    if (tz.startsWith('America/')) return 'US';
  } catch {}
  return 'US';
}
const noop = () => () => {};

export function YourCountryPrices({ service, rows }: { service: string; rows: CountryPrices[] }) {
  const guessed = useSyncExternalStore(noop, guess, () => 'US');
  const [picked, setPicked] = useState<string | null>(null);
  const want = picked ?? guessed;
  const r = rows.find((x) => x.country === want) ?? rows.find((x) => x.country === 'US') ?? rows[0];
  return (
    <section className="ycp" aria-labelledby="ycp-h">
      <div className="ycp-top">
        <h2 id="ycp-h">
          {service} in <span className="sr">{r.name}</span>
        </h2>
        {rows.length > 1 ? (
          <label className="ycp-sel">
            <span className="sr">Country</span>
            <select value={r.country} onChange={(e) => setPicked(e.target.value)}>
              {rows.map((x) => (
                <option key={x.country} value={x.country}>
                  {x.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <span className="ycp-one">{r.name}</span>
        )}
      </div>
      <ul className="ycp-plans" aria-live="polite">
        {r.plans.map((p) => (
          <li key={p.id}>
            <span className="n">{p.name}</span>
            <span className="p num">
              {formatMoney(p.amountMinor, r.currency, { country: r.country })}
              <small>{CYCLE_SHORT[p.cycle]}</small>
            </span>
            <span className="y num">{p.cycle === 'yearly' ? 'per year' : `${formatMoney(yearlyMinor(p.amountMinor, p.cycle), r.currency, { country: r.country })} a year`}</span>
          </li>
        ))}
      </ul>
      <p className="ycp-meta">
        {r.appStore ? 'iPhone app price · ' : ''}
        {r.tax} · checked {r.checked} ·{' '}
        <a href={r.source} rel="noopener">
          {r.sourceLabel}
        </a>
      </p>
    </section>
  );
}
