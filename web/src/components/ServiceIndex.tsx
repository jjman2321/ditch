'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useMemo, useState } from 'react';

export type IndexItem = { id: string; name: string; aliases: string[]; category: string; meta: string; logo: boolean; color: string; mono: string };

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');

/** Search + category chips + cards. Every card is in the HTML already; typing only hides cards (no requests). */
export function ServiceIndex({ items, base, noun }: { items: IndexItem[]; base: string; noun: string }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const cats = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of items) m.set(i.category, (m.get(i.category) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);
  const n = norm(q);
  const shown = items.filter((i) => (!cat || i.category === cat) && (!n || [i.name, ...i.aliases].some((a) => norm(a).includes(n))));

  return (
    <>
      <div className="search-in big-search">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M13 13l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${items.length} ${noun}`} aria-label={`Search ${noun}`} />
        {q ? (
          <button className="iconbtn" type="button" aria-label="Clear search" onClick={() => setQ('')}>
            <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden>
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </div>
      <div className="chips" role="group" aria-label="Categories">
        <button type="button" aria-pressed={!cat} onClick={() => setCat(null)}>
          All <span className="c">{items.length}</span>
        </button>
        {cats.map(([c, count]) => (
          <button key={c} type="button" id={c.split(' ')[0].toLowerCase()} aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}>
            {c} <span className="c">{count}</span>
          </button>
        ))}
      </div>
      <p className="sr" aria-live="polite">
        {shown.length} {noun}
      </p>
      {shown.length ? (
        <div className="grid-cards">
          {shown.map((i) => (
            <Link key={i.id} className="svc" href={`${base}/${i.id}`}>
              {i.logo ? (
                <img className="logo" src={`/logos/${i.id}.png`} alt="" width={40} height={40} loading="lazy" />
              ) : (
                <span className="mono" style={{ width: 40, height: 40, background: i.color }}>
                  {i.mono}
                </span>
              )}
              <span>
                <b>{i.name}</b>
                <small>{i.meta}</small>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">
          <img src="/duck.png" alt="" width={140} />
          <p>
            Nothing for <b>“{q}”</b> yet.
          </p>
          <p className="meta" style={{ marginTop: 8 }}>
            <a href={`mailto:support@ditchsubs.app?subject=${encodeURIComponent(`Please add: ${q}`)}`}>Ask for it</a> and we’ll check it by hand ·{' '}
            <button type="button" className="btn sm ghost" style={{ marginLeft: 8 }} onClick={() => setQ('')}>
              Clear search
            </button>
          </p>
        </div>
      )}
    </>
  );
}
