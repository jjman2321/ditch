'use client';

import { useRef, useState } from 'react';

import { ToolCard, ToolIcon, type CardItem } from './ToolCard';

export type Group = { id: string; title: string; sub: string; items: CardItem[] };

/** The /tools list: search box + jump chips, then each group as a heading and cards. All cards are in the HTML; search only hides. */
export function ToolHub({ groups, children }: { groups: Group[]; children?: React.ReactNode }) {
  const [q, setQ] = useState('');
  const box = useRef<HTMLInputElement>(null);
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hit = (x: CardItem) => words.every((w) => `${x.name} ${x.desc}`.toLowerCase().includes(w));
  const shown = groups.map((g) => ({ ...g, items: g.items.filter(hit) })).filter((g) => g.items.length);
  const count = shown.reduce((n, g) => n + g.items.length, 0);
  return (
    <>
      <div className="hub-search">
        <label className="search-pill">
          <ToolIcon name="search" />
          <span className="sr">Search the free tools</span>
          <input ref={box} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search, like “Spotify” or “trial”" autoComplete="off" enterKeyHint="search" />
        </label>
        <p className="sr" aria-live="polite">
          {q ? `${count} ${count === 1 ? 'tool' : 'tools'} found` : ''}
        </p>
        {q ? null : (
          <nav className="chips-row" aria-label="Jump to a group">
            {groups.map((g) => (
              <a key={g.id} href={`#${g.id}`}>
                {g.title}
              </a>
            ))}
          </nav>
        )}
      </div>
      {q ? null : children}
      {shown.length ? (
        shown.map((g) => (
          <section key={g.id} className="grp" aria-labelledby={g.id}>
            <div className="grp-h">
              <h2 id={g.id}>{g.title}</h2>
              <p>{g.sub}</p>
            </div>
            <div className="tgrid two">
              {g.items.map((x) => (
                <ToolCard key={x.href} item={x} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <p className="hub-none">
          Nothing for “{q}” yet. Try a service name, like Netflix, or{' '}
          <button type="button" className="linkish" onClick={() => { setQ(''); box.current?.focus(); }}>
            see every tool
          </button>
          .
        </p>
      )}
    </>
  );
}
