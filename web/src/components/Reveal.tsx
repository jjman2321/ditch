'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Blocks that rise in as you scroll, on every page. Nothing that shows a price is listed here (CLAUDE.md rule 8). */
const AUTO = ['.v4-sec > h2', '.tgrid > *', '.feat > *', '.tgroup', '.steps3 > li', '.faq2 > div', '.g5-facts > *', '.g5-pause', '.v4-cta', '.ways4 > li', '.idx4 .grid > *'].join(',');

/**
 * Gentle reveal on scroll. Content is visible by default; the hidden state only applies once this has run
 * (it adds `js` to <html>). Anything already on screen is shown at once, so nothing flashes.
 * Runs again after every page change. Each element animates once.
 */
export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    document.documentElement.classList.add('js');
    const vh = window.innerHeight;
    const auto = Array.from(document.querySelectorAll<HTMLElement>(AUTO));
    const groups = new Map<Element | null, number>();
    for (const el of auto) {
      if (el.hasAttribute('data-reveal')) continue;
      // On screen already: mark it shown first, so it never blinks out and back.
      if (el.getBoundingClientRect().top < vh * 0.95) el.classList.add('is-in');
      const n = groups.get(el.parentElement) ?? 0;
      groups.set(el.parentElement, n + 1);
      el.style.setProperty('--i', String(Math.min(n, 5)));
      el.setAttribute('data-reveal', '');
    }
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('is-in'));
      return;
    }
    // Already visible on arrival: show now, no animation from hidden.
    els.filter((e) => e.getBoundingClientRect().top < vh * 0.95).forEach((e) => e.classList.add('is-in'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px 8% 0px' },
    );
    els.filter((e) => !e.classList.contains('is-in')).forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [path]);
  return null;
}
