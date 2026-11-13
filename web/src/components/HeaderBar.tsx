'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { NAV } from '@/lib/site';

export type SearchItem = { id: string; slug: string; name: string; aliases: string[]; guide: boolean; prices: boolean; rank: number };

/** Keeps Tab inside a dialog, locks page scroll, and returns focus to whatever opened it. */
function useDialog(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab' || !ref.current) return;
      const f = Array.from(ref.current.querySelectorAll<HTMLElement>('a[href], button, input, [tabindex="0"]')).filter((x) => !x.hasAttribute('disabled') && x.tabIndex >= 0);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [ref, onClose]);
}

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
        <Link className="wordmark" href="/" aria-label="Ditch, home" prefetch={false}>
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
        <Link className="btn sm" href="/#join" prefetch={false}>
          <span className="hide-xs">Join the waitlist</span>
          <span className="show-xs">Join</span>
        </Link>
        <button className="iconbtn menu-btn" type="button" aria-label="Menu" aria-expanded={menu} aria-controls="menu-sheet" onClick={() => setMenu(true)}>
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
  const box = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useDialog(box, onClose);
  // Focus the close button after useDialog has noted what opened the sheet, so Esc returns focus there.
  useEffect(() => {
    close.current?.focus();
  }, []);
  return (
    <div className="sheet" id="menu-sheet" role="dialog" aria-modal="true" aria-label="Menu" onClick={onClose}>
      <div className="in" ref={box} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
          <span className="wordmark">ditch</span>
          <button ref={close} className="iconbtn" type="button" aria-label="Close menu" onClick={onClose}>
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
        <Link className="btn block" href="/#join" prefetch={false} onClick={onClose} style={{ marginTop: 20 }}>
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
  const box = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useDialog(box, onClose);
  const results = useMemo(() => {
    const n = norm(q);
    const list = n ? items.filter((i) => [i.name, ...i.aliases].some((a) => norm(a).includes(n))) : items.slice(0, 8);
    return list.slice(0, 12).flatMap((i) => [
      ...(i.guide ? [{ key: `${i.id}-c`, id: i.id, label: `Cancel ${i.name}`, href: `/cancel/${i.slug}`, kind: 'Cancel guide' }] : []),
      ...(i.prices ? [{ key: `${i.id}-p`, id: i.id, label: `${i.name} prices`, href: `/prices/${i.slug}`, kind: 'Prices' }] : []),
    ]);
  }, [q, items]);

  useEffect(() => {
    input.current?.focus();
  }, []);
  useEffect(() => {
    if (results[sel]) document.getElementById(`sr-${results[sel].key}`)?.scrollIntoView({ block: 'nearest' });
  }, [sel, results]);

  return (
    <div className="search-dlg" role="dialog" aria-modal="true" aria-label="Search" onClick={onClose}>
      <div className="box" ref={box} onClick={(e) => e.stopPropagation()}>
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
              if (e.key === 'Enter' && results[sel]) {
                onClose();
                router.push(results[sel].href);
              }
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
          <ul className="search-res" id="search-results" role="listbox" aria-label="Results">
            {results.map((r, i) => (
              <li key={r.key} role="option" id={`sr-${r.key}`} aria-selected={i === sel} className={i === sel ? 'sel' : undefined}>
                <Link href={r.href} tabIndex={-1} onClick={onClose}>
                  <img className="logo" src={`/logos/${r.id}.png`} alt="" width={32} height={32} onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')} />
                  {r.label}
                  <small>{r.kind}</small>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">
            <img src="/duck.webp" alt="" width={140} height={82} loading="lazy" />
            <p>
              No guide for <b>“{q}”</b> yet.
            </p>
            <p className="meta" style={{ marginTop: 8 }}>
              <a href={`mailto:support@ditchsubs.app?subject=${encodeURIComponent(`Guide request: ${q}`)}`}>Ask for it</a> and we’ll look into it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
