'use client';

import { useEffect } from 'react';

/**
 * Gentle reveal on scroll (design-system.md, Motion). Content is visible by default: the hidden state only
 * applies once this runs (it adds `js` to <html>) and only when Reduce Motion is off (that's in the CSS).
 * Each element animates once. Prices are never marked for reveal.
 */
export function Reveal() {
  useEffect(() => {
    document.documentElement.classList.add('js');
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return null;
}
