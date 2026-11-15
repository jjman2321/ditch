'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Hash to glide to once the next page has rendered (a link like /#pricing clicked on another page). */
let pending: string | null = null;

/** Smallest page offset an anchor can land at: the pinned header plus a little air. */
// 32px of air under the header on phones, 40px on bigger screens (owner, Nov 15: 16px felt tight; 48px let the
// section above peek in on phones).
const headerGap = () => (document.querySelector('header')?.getBoundingClientRect().height ?? 0) + (window.innerWidth < 860 ? 32 : 40);

/** Gentle start, soft landing: the scroll speeds up then settles (easeInOutCubic). */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Eased scroll to a page position. 450–900 ms depending on distance, so long jumps don't fly past (owner, Nov 15: "the scrolls were super fast"). */
/** True while a glide is running or waiting to start, so ScrollTop doesn't pull the page back to the top. */
let gliding = false;
export const isGliding = () => gliding || pending !== null;

export function smoothScrollTo(top: number) {
  const from = window.scrollY;
  const to = Math.max(0, Math.min(top, document.documentElement.scrollHeight - window.innerHeight));
  const dist = Math.abs(to - from);
  if (dist < 2) return;
  gliding = true;
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
  gliding = true;
  const done = () => {
    gliding = false;
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
const glideTo = (hash: string) => {
  const el = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!el) return false;
  // Line up on the first line of text, so every heading lands the same distance under the header
  // (some headings have extra space above the letters inside their box).
  const rg = document.createRange();
  rg.selectNodeContents(el);
  const tops = [...rg.getClientRects()].filter((r) => r.height > 0).map((r) => r.top);
  let top = tops.length ? Math.min(...tops) : el.getBoundingClientRect().top;
  // A heading still waiting to fade in sits a few px lower until its animation ends: aim for where it settles.
  for (let n: HTMLElement | null = el; n && n !== document.body; n = n.parentElement) {
    const t = getComputedStyle(n).transform;
    if (t && t !== 'none') top -= new DOMMatrix(t).m42;
  }
  smoothScrollTo(top + window.scrollY - headerGap());
  return true;
};

export function SmoothMotion() {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Capture phase, so this runs before Next.js's own Link handling (which would jump instantly).
    // preventDefault tells Next.js to leave the click alone; the link's own onClick (closing the menu) still runs.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !url.hash || url.hash === '#join') return;
      if (url.pathname === location.pathname) {
        if (!document.getElementById(decodeURIComponent(url.hash.slice(1)))) return;
        e.preventDefault();
        history.pushState(null, '', url.hash);
        glideTo(url.hash);
        // Tabs and similar listen for the hash.
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        return;
      }
      // Another page: open it at the top, then glide down to the section.
      e.preventDefault();
      pending = url.hash;
      router.push(url.pathname + url.search, { scroll: false });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  // Arrived from a /page#section link: start at the top, then glide to the section once it has rendered.
  useEffect(() => {
    if (!pending) return;
    const hash = pending;
    window.scrollTo(0, 0);
    const t = window.setTimeout(() => {
      pending = null;
      if (glideTo(hash)) history.replaceState(null, '', hash);
    }, 180);
    return () => window.clearTimeout(t);
  }, [path]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.sa, .g5-hero-card, .hero .stage, .mq'));
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
