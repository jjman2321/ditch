'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState as useStateR, useSyncExternalStore } from 'react';

import type { Pt } from '@/lib/tools';

import { guessCountry } from '@/lib/guessCountry';

const noop = () => () => {};
/** The visitor's country from the browser's time zone (US on the server). Never sent anywhere. */
export const useCountry = () => useSyncExternalStore(noop, guessCountry, () => 'US');

export function Ico({ id, logo, name }: { id: string; logo: boolean; name: string }) {
  return logo ? <img className="logo" src={`/logos/${id}.png`} alt="" width={36} height={36} loading="lazy" /> : <span className="mono" aria-hidden style={{ background: '#EFE8D9', color: '#16140F', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13 }}>{name.slice(0, 1)}</span>;
}

export function CountrySelect({ value, onChange, countries, label = 'Country' }: { value: string; onChange: (v: string) => void; countries: { code: string; name: string }[]; label?: string }) {
  return (
    <label className="f">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}


let cache: Pt[] | null = null;
let inflight: Promise<Pt[]> | null = null;
/** The shared price list (/data/points.json), fetched once per visit. null while loading. */
export function usePoints(): Pt[] | null {
  const [pts, setPts] = useStateR<Pt[] | null>(cache);
  useEffect(() => {
    if (cache) return;
    inflight ??= fetch('/data/points.json')
      .then((r) => r.json())
      .then((d: { svc: { s: string; n: string; g: string | null; h: string | null; l: boolean }[]; rows: [number, string, string, string, number, Pt['cy'], Pt['b'], number][] }) =>
        (cache = d.rows.map(([i, c, cur, p, a, cy, b, def]) => ({ ...d.svc[i], c, cur, p, a, cy, b, d: def === 1 }))),
      );
    let live = true;
    inflight.then((x) => live && setPts(x));
    return () => {
      live = false;
    };
  }, [setPts]);
  return pts;
}

export function Loading() {
  return <p className="muted" style={{ color: 'var(--mute)' }}>Loading prices…</p>;
}
