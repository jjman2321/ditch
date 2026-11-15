'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { NAV } from '@/lib/site';

export type SearchItem = { id: string; slug: string; name: string; aliases: string[]; guide: boolean; prices: boolean; rank: number; logo: boolean };
export type PageItem = { key: string; label: string; href: string; words: string };

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

export function HeaderBar({ items, pages = [] }: { items: SearchItem[]; pages?: PageItem[] }) {
  const path = usePathname();
  const onSun = path === '/';
  const [scrolled, setScrolled] = useState(false);
  // Open state remembers the page it was opened on, so moving to another page closes it without an effect.
  const [menuAt, setMenuAt] = useState<string | null>(null);
  const [searchAt, setSearchAt] = useState<string | null>(null);
  const menu = menuAt === path;
  const search = searchAt === path;
  const setMenu = (v: boolean) => setMenuAt(v ? path : null);
  // Closing plays the menu's exit animation first, then removes it.
  const [closing, setClosing] = useState(false);
  const closeMenu = () => {
    setClosing(true);
    window.setTimeout(() => {
      setMenu(false);
      setClosing(false);
    }, 260);
  };
  const setSearch = (v: boolean) => setSearchAt(v ? path : null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // Yellow header on the home hero (owner, Nov 15: "cleaner"). iOS 26 Safari tints its top bar from that header,
  // so the menu panel matches it (yellow at the top of home, cream elsewhere) instead of fighting the bar.
  // Older Safari and Android read theme-color, which follows the same rule.
  const sunTop = onSun && !scrolled;
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', sunTop ? '#FFCC2E' : '#FBF7EE');
  }, [sunTop]);

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
            <Link key={n.href} href={n.href} prefetch={n.href.startsWith('/#') ? false : undefined}>
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
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="burger">
            <path d="M3 6h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {menu ? <MenuSheet closing={closing} sun={sunTop} onClose={closeMenu} /> : null}
      {search ? <SearchDialog items={items} pages={pages} onClose={() => setSearch(false)} /> : null}
    </header>
  );
}

/**
 * Phone menu (owner, Nov 14: "super smooth"): the panel drops from the top with an iOS-style ease while the page
 * dims, the links slide in one after another, and the menu icon's two lines turn into the close X in the same spot.
 * Closing plays it backwards, faster. Pure CSS animations; nothing moves near a price.
 */
function MenuSheet({ onClose, closing, sun }: { onClose: () => void; closing: boolean; sun: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useDialog(box, onClose);
  // Focus the close button after useDialog has noted what opened the sheet, so Esc returns focus there.
  useEffect(() => {
    close.current?.focus();
  }, []);
  return (
    <div className={`sheet menu-sheet${sun ? ' sun' : ''}${closing ? ' out' : ''}`} id="menu-sheet" role="dialog" aria-modal="true" aria-label="Menu" onClick={onClose}>
      <div className="in" ref={box} onClick={(e) => e.stopPropagation()}>
        <div className="menu-top">
          <span className="wordmark">ditch</span>
          <button ref={close} className="iconbtn" type="button" aria-label="Close menu" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="burger x">
              <path d="M3 6h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav aria-label="Menu">
          {NAV.map((n, i) => (
            <Link key={n.href} href={n.href} onClick={onClose} prefetch={n.href.startsWith('/#') ? false : undefined} style={{ '--i': i } as React.CSSProperties}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link className="btn block" href="/#join" prefetch={false} onClick={onClose} style={{ marginTop: 20, '--i': NAV.length } as React.CSSProperties}>
          Join the waitlist
        </Link>
      </div>
    </div>
  );
}

function SearchDialog({ items, pages, onClose }: { items: SearchItem[]; pages: PageItem[]; onClose: () => void }) {
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
    ]).map((r) => ({ ...r, logo: items.find((x) => x.id === r.id)?.logo ?? false }));
  }, [q, items]);
  const pageHits = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return pages.filter((p) => words.every((w) => norm(p.words).includes(w))).slice(0, 6);
  }, [q, pages]);
  const all = useMemo(() => [...results, ...pageHits.map((p) => ({ key: p.key, id: '', label: p.label, href: p.href, kind: p.href.startsWith('/charges') ? 'Charge finder' : p.href === '/price-changes' ? 'Prices' : 'Free tool', logo: false }))], [results, pageHits]);

  useEffect(() => {
    input.current?.focus();
  }, []);
  useEffect(() => {
    if (all[sel]) document.getElementById(`sr-${all[sel].key}`)?.scrollIntoView({ block: 'nearest' });
  }, [sel, all]);

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
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, all.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              if (e.key === 'Enter' && all[sel]) {
                onClose();
                router.push(all[sel].href);
              }
            }}
            placeholder="Netflix, Spotify, ChatGPT…"
            aria-label="Search guides and prices"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={all[sel] ? `sr-${all[sel].key}` : undefined}
          />
          <button className="iconbtn" type="button" aria-label="Close search" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="sr" aria-live="polite">{all.length} results</p>
        {all.length ? (
          <ul className="search-res" id="search-results" role="listbox" aria-label="Results">
            {all.map((r, i) => (
              <li key={r.key} role="option" id={`sr-${r.key}`} aria-selected={i === sel} className={i === sel ? 'sel' : undefined}>
                <Link href={r.href} tabIndex={-1} onClick={onClose}>
                  {r.logo ? <img className="logo" src={`/logos/${r.id}.png`} alt="" width={32} height={32} /> : <span className="logo sr-mono" aria-hidden>{r.label.replace(/^Cancel /, '').slice(0, 1)}</span>}
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
              Nothing for <b>“{q}”</b> yet.
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
