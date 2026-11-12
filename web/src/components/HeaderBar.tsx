'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { NAV } from '@/lib/site';

export type SearchItem = { id: string; name: string; aliases: string[]; guide: boolean; prices: boolean; rank: number };

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');

export function HeaderBar({ items }: { items: SearchItem[] }) {
  const path = usePathname();
  const onSun = path === '/';
  const [scrolled, setScrolled] = useState(false);
  // Open state remembers the page it was opened on, so moving to another page closes it without an effect.
  const [menuAt, setMenuAt] = useState<string | null>(null);
  const [searchAt, setSearchAt] = useState<string | null>(null);
  const menu = menuAt === path;
  const search = searchAt === path;
  const setMenu = (v: boolean) => setMenuAt(v ? path : null);
  const setSearch = (v: boolean) => setSearchAt(v ? path : null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // "/" opens search, like Stripe and Linear docs. Not while typing in a field.
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(t.tagName)) {
        e.preventDefault();
        setSearchAt(window.location.pathname);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  return (
    <header className={`hdr${onSun && !scrolled ? ' on-sun' : ''}${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap bar">
        <Link className="wordmark" href="/" aria-label="Ditch, home">
          ditch
        </Link>
        <nav className="links" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="spacer" />
        <button className="iconbtn" type="button" aria-label="Search guides and prices" onClick={() => setSearch(true)}>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
            <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M13 13l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <Link className="btn sm" href="/#join">
          Join the waitlist
        </Link>
        <button className="iconbtn menu-btn" type="button" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(true)}>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
            <path d="M3 6h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {menu ? <MenuSheet onClose={() => setMenu(false)} /> : null}
      {search ? <SearchDialog items={items} onClose={() => setSearch(false)} /> : null}
    </header>
  );
}

function MenuSheet({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label="Menu" onClick={onClose}>
      <div className="in" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
          <span className="wordmark">ditch</span>
          <button className="iconbtn" type="button" aria-label="Close menu" onClick={onClose} autoFocus>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav aria-label="Menu">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={onClose}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link className="btn block" href="/#join" onClick={onClose} style={{ marginTop: 20 }}>
          Join the waitlist
        </Link>
      </div>
    </div>
  );
}

function SearchDialog({ items, onClose }: { items: SearchItem[]; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => {
    const n = norm(q);
    const list = n ? items.filter((i) => [i.name, ...i.aliases].some((a) => norm(a).includes(n))) : items.slice(0, 8);
    return list.slice(0, 12).flatMap((i) => [
      ...(i.guide ? [{ key: `${i.id}-c`, id: i.id, label: `Cancel ${i.name}`, href: `/cancel/${i.id}`, kind: 'Cancel guide' }] : []),
      ...(i.prices ? [{ key: `${i.id}-p`, id: i.id, label: `${i.name} prices`, href: `/prices/${i.id}`, kind: 'Prices' }] : []),
    ]);
  }, [q, items]);

  useEffect(() => {
    input.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div className="search-dlg" role="dialog" aria-modal="true" aria-label="Search" onClick={onClose}>
      <div className="box" onClick={(e) => e.stopPropagation()}>
        <div className="search-in">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
            <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M13 13l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              if (e.key === 'Enter' && results[sel]) window.location.href = results[sel].href;
            }}
            placeholder="Netflix, Spotify, ChatGPT…"
            aria-label="Search guides and prices"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={results[sel] ? `sr-${results[sel].key}` : undefined}
          />
          <button className="iconbtn" type="button" aria-label="Close search" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="sr" aria-live="polite">{results.length} results</p>
        {results.length ? (
          <ul className="search-res" id="search-results" role="listbox">
            {results.map((r, i) => (
              <li key={r.key} role="option" id={`sr-${r.key}`} aria-selected={i === sel}>
                <Link href={r.href} aria-selected={i === sel} onClick={onClose}>
                  <img className="logo" src={`/logos/${r.id}.png`} alt="" width={32} height={32} onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')} />
                  {r.label}
                  <small>{r.kind}</small>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">
            <img src="/duck.png" alt="" width={140} />
            <p>
              No guide for <b>“{q}”</b> yet.
            </p>
            <p className="meta" style={{ marginTop: 8 }}>
              <a href={`mailto:support@ditchsubs.app?subject=${encodeURIComponent(`Guide request: ${q}`)}`}>Ask for it</a> and we’ll check it by hand.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
