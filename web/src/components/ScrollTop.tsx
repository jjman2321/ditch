'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * A normal link to another page always opens it at the top (owner, Nov 14: the logo on another page landed
 * half-way down the home page, where it was last scrolled). Back and Forward keep the browser's own position,
 * links with a #section keep their jump, and a link to the page you're already on scrolls back to the top.
 */
export function ScrollTop() {
  const path = usePathname();
  const first = useRef(true);
  const popped = useRef(false);

  useEffect(() => {
    const onPop = () => {
      popped.current = true;
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.origin === location.origin && url.pathname === location.pathname && !url.hash) window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onPop);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (popped.current) {
      popped.current = false;
      return;
    }
    if (location.hash) return;
    const top = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    top();
    // Once more after the page has painted, in case a restored position lands late.
    const t = window.setTimeout(top, 60);
    return () => window.clearTimeout(t);
  }, [path]);

  return null;
}
