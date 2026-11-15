'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Smallest page offset an anchor can land at: the pinned header plus a little air. */
const headerGap = () => (document.querySelector('header')?.getBoundingClientRect().height ?? 0) + 16;

/** Gentle start, soft landing: the scroll speeds up then settles (easeInOutCubic). */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Eased scroll to a page position. 450–900 ms depending on distance, so long jumps don't fly past (owner, Nov 15: "the scrolls were super fast"). */
export function smoothScrollTo(top: number) {
  const from = window.scrollY;
  const to = Math.max(0, Math.min(top, document.documentElement.scrollHeight - window.innerHeight));
  const dist = Math.abs(to - from);
  if (dist < 2) return;
  const dur = Math.min(900, Math.max(450, dist * 0.35));
  const start = performance.now();
  document.documentElement.style.scrollBehavior = 'auto';
  let stop = false;
  const cancel = () => {
    stop = true;
  };
  window.addEventListener('wheel', cancel, { passive: true, once: true });
  window.addEventListener('touchstart', cancel, { passive: true, once: true });
  const step = (now: number) => {
    if (stop) return done();
    const t = Math.min(1, (now - start) / dur);
    window.scrollTo(0, from + (to - from) * ease(t));
    if (t < 1) requestAnimationFrame(step);
    else done();
  };
  const done = () => {
    document.documentElement.style.scrollBehavior = '';
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
  };
  requestAnimationFrame(step);
}

/**
 * Site-wide motion care (Nov 15):
 * - Jump links on the same page (#steps, #all, #faq…) use the eased scroll above. #join is handled by JoinFocus.
 * - Looping animations (tap rings, the floating hero card, home floats, marquee) pause while off screen,
 *   so the phone only animates what you can see.
 */
export function SmoothMotion() {
  const path = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash || url.hash === '#join') return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      history.pushState(null, '', url.hash);
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - Math.max(margin, headerGap()));
      // Tabs and similar listen for the hash.
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.sa, .g5-hero-card, .hero .stage, .mq, .slot, .ditch-demo'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) en.target.classList.toggle('anim-off', !en.isIntersecting);
      },
      { rootMargin: '120px 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);

  return null;
}
