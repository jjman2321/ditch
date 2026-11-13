'use client';

import Link from 'next/link';
import { useState } from 'react';

import { CYCLE_WORD, formatMoney, minorPerMajor } from '@/lib/money';
import type { Biller, Pt } from '@/lib/tools';

import { CountrySelect, Ico, Loading, useCountry, usePoints } from './ToolBits';

const BILLERS: { id: Biller | 'any'; label: string }[] = [
  { id: 'any', label: 'Not sure' },
  { id: 'apple', label: 'Apple (APPLE.COM/BILL)' },
  { id: 'google', label: 'Google' },
  { id: 'amazon', label: 'Amazon' },
  { id: 'direct', label: 'The company itself' },
];
const TAXED = new Set(['US', 'CA']);

/** Amount + who billed + country → subscriptions on our checked list that cost exactly that. */
export function ChargeFinder({ countries, biller = 'any' }: { countries: { code: string; name: string }[]; biller?: Biller | 'any' }) {
  const loaded = usePoints();
  if (!loaded) return <Loading />;
  return <ChargeFinderInner points={loaded} countries={countries} biller={biller} />;
}

function ChargeFinderInner({ points, countries, biller: start = 'any' }: { points: Pt[]; countries: { code: string; name: string }[]; biller?: Biller | 'any' }) {
  const guessed = useCountry();
  const [country, setCountry] = useState<string | null>(null);
  const [biller, setBiller] = useState<Biller | 'any'>(start);
  const [amount, setAmount] = useState('');
  const c = country ?? guessed;
  const inCountry = points.filter((p) => p.c === c);
  const cur = inCountry[0]?.cur ?? 'USD';
  const typed = parseFloat(amount.replace(/[^0-9.,]/g, '').replace(',', '.'));
  const minor = Number.isFinite(typed) ? Math.round(typed * minorPerMajor(cur)) : NaN;
  const pool = inCountry.filter((p) => biller === 'any' || p.b === biller);
  const exact = Number.isFinite(minor) ? pool.filter((p) => p.a === minor) : [];
  // US and Canada prices are before sales tax, so the bank shows a bit more. Up to 15% on top counts as "with tax".
  const withTax = Number.isFinite(minor) && TAXED.has(c) ? pool.filter((p) => !exact.includes(p) && minor > p.a && minor <= Math.round(p.a * 1.15)).sort((a, b) => b.a - a.a) : [];
  const shown = [...exact, ...withTax].slice(0, 12);
  return (
    <div>
      <div className="row">
        <label className="f">
          Amount on your statement
          <input type="text" inputMode="decimal" placeholder="9.99" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <CountrySelect value={c} onChange={setCountry} countries={countries} />
      </div>
      <div className="row">
        <div className="f">
          <span style={{ fontWeight: 700, fontSize: 15 }}>Who charged you?</span>
          <div className="seg" role="group" aria-label="Who charged you">
            {BILLERS.map((b) => (
              <button key={b.id} type="button" aria-pressed={biller === b.id} onClick={() => setBiller(b.id)}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="result" aria-live="polite">
        {!amount ? (
          <p className="muted">Type an amount like 9.99 to see what it could be.</p>
        ) : !Number.isFinite(minor) ? (
          <p className="say">That doesn’t look like an amount. Try something like 9.99.</p>
        ) : shown.length ? (
          <>
            <p className="say">
              <b>{shown.length === 1 ? '1 possible match' : `${shown.length} possible matches`}</b> for {formatMoney(minor, cur, { country: c })} on our checked price list.
            </p>
            <ul className="hits">
              {shown.map((p) => (
                <li key={`${p.s}-${p.p}-${p.a}`}>
                  <Ico id={p.s} logo={p.l} name={p.n} />
                  <span>
                    <b>
                      {p.n} · {p.p}
                    </b>
                    <small>
                      {formatMoney(p.a, p.cur, { country: c })} {CYCLE_WORD[p.cy]}
                      {withTax.includes(p) ? ' + sales tax' : ''}
                      {p.b === 'apple' && p.s.indexOf('apple') !== 0 && p.s !== 'icloud' ? ' · in the iPhone app' : ''}
                    </small>
                  </span>
                  <span className="amt">{p.g ? <Link href={`/cancel/${p.g}`}>How to cancel</Link> : p.h ? <Link href={`/prices/${p.h}`}>Prices</Link> : null}</span>
                </li>
              ))}
            </ul>
            <p className="note-l">These are possible matches, not a diagnosis. Only {biller === 'apple' ? 'Apple' : biller === 'google' ? 'Google' : biller === 'amazon' ? 'Amazon' : 'the company that charged you'} can tell you for sure. See below for where to check.</p>
          </>
        ) : (
          <p className="say">Nothing on our checked list costs exactly {formatMoney(minor, cur, { country: c })} in {countries.find((x) => x.code === c)?.name}. It may be a plan we don’t track, a one-off purchase, or a price with tax added. Check the official places below.</p>
        )}
      </div>
    </div>
  );
}
