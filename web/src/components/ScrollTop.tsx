'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { isGliding, smoothScrollTo } from './SmoothMotion';

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
      if (url.origin === location.origin && url.pathname === location.pathname && !url.hash) smoothScrollTo(0);
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
    // Next.js scrolls the new page's first block into view after it renders, which on Safari can land after us
    // and leave the page ~35px down under the pinned header (owner, Nov 15). Repeat a few times while the page
    // settles, but never fight someone who has started scrolling.
    let moved = false;
    const stop = () => {
      moved = true;
    };
    window.addEventListener('wheel', stop, { passive: true, once: true });
    window.addEventListener('touchmove', stop, { passive: true, once: true });
    const ts = [60, 160, 360].map((ms) => window.setTimeout(() => !moved && !isGliding() && window.scrollY < 240 && top(), ms));
    return () => {
      ts.forEach(window.clearTimeout);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
    };
  }, [path]);

  return null;
}
