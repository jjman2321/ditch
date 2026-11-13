'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

import { EmailBox } from './EmailBox';

import { formatMoney, minorPerMajor, yearlyMinor, type Cycle } from '@/lib/money';

export type CalcPrice = { plan: string; amountMinor: number; cycle: Cycle; currency: string };
export type CalcService = { id: string; name: string; logo: boolean; prices: Record<string, CalcPrice> };
export type CalcCountry = { code: string; name: string; checked: string };

/**
 * "What do you pay for?" Tap services, see the real yearly total from our hand-checked prices.
 * Uses each service's usual plan (not the cheapest), never adds different currencies (one total per currency),
 * and the total changes instantly: no counting animation next to money. Runs entirely in the browser.
 */
export function Calculator({ services, countries, initial = ['netflix', 'spotify', 'chatgpt-plus', 'amazon-prime', 'disney-plus', 'apple-music'] }: { services: CalcService[]; countries: CalcCountry[]; initial?: string[] }) {
  const [country, setCountry] = useState('US');
  const [picked, setPicked] = useState<string[]>(initial);
  const available = services.filter((s) => s.prices[country]);
  const chosen = available.filter((s) => picked.includes(s.id));
  const c = countries.find((x) => x.code === country)!;

  const by = new Map<string, number>();
  for (const s of chosen) {
    const p = s.prices[country];
    by.set(p.currency, (by.get(p.currency) ?? 0) + yearlyMinor(p.amountMinor, p.cycle));
  }
  const totals = [...by.entries()];

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const lines = chosen.slice(0, 4);
  const rest = chosen.slice(4);

  return (
    <div className="panel calc">
      <div className="pick">
        <div className="bar">
          <b id="calc-label">Tap what you pay for</b>
          <label>
            <span className="sr">Country</span>
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              {countries.map((x) => (
                <option key={x.code} value={x.code}>
                  {x.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="tiles" role="group" aria-labelledby="calc-label">
          {available.map((s) => (
            <button key={s.id} type="button" className="tile" aria-pressed={picked.includes(s.id)} onClick={() => toggle(s.id)}>
              {s.logo ? <img className="logo" src={`/logos/${s.id}.png`} alt="" width={40} height={40} loading="lazy" /> : <span className="mono" style={{ background: '#6B6559' }}>{s.name[0]}</span>}
              {s.name}
            </button>
          ))}
        </div>
        <p className="meta" style={{ marginTop: 16 }}>
          Pick from 200+ services in the app, or add your own.
        </p>
      </div>
      <div className="receipt">
        <p className="sr" aria-live="polite">
          {chosen.length} picked. {totals.map(([cur, minor]) => formatMoney(Math.round(minor / minorPerMajor(cur)) * minorPerMajor(cur), cur, { country, whole: true })).join(' and ')} a year.
        </p>
        <b>{chosen.length ? 'That’s' : 'Tap a few to see'}</b>
        {totals.length ? (
          totals.map(([cur, minor]) => (
            <div key={cur} className="d-money" style={{ marginTop: 8 }}>
              {formatMoney(Math.round(minor / minorPerMajor(cur)) * minorPerMajor(cur), cur, { country, whole: true })}
            </div>
          ))
        ) : (
          <div className="d-money zero" style={{ marginTop: 8 }}>
            {formatMoney(0, available[0]?.prices[country]?.currency ?? 'USD', { whole: true, country })}
          </div>
        )}
        <b style={{ fontSize: 20 }}>a year</b>
        <div className="lines num">
          {lines.map((s) => {
            const p = s.prices[country];
            return (
              <div className="line" key={s.id}>
                <span>
                  {s.name} · {p.plan}
                </span>
                <span>
                  {formatMoney(p.amountMinor, p.currency, { country })}
                  {p.cycle === 'yearly' ? '/yr' : p.cycle === 'quarterly' ? '/qtr' : '/mo'}
                </span>
              </div>
            );
          })}
          {rest.length ? (
            <div className="line">
              <span>+ {rest.length} more</span>
              <span />
            </div>
          ) : null}
        </div>
        <p className="calc-cta">Ditch reminds you before each of these renews. Free iPhone app, coming soon.</p>
        <EmailBox source="calculator" bare />
        <p className="note">
          {c.name} prices, usual plan, checked by hand ({c.checked}). This runs in your browser. We don’t see what you tap.
        </p>
      </div>
    </div>
  );
}
