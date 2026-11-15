'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { smoothScrollTo } from './SmoothMotion';

/**
 * "Join the waitlist" links point at #join. Jumping straight to the form hid the headline and left half a phone
 * on screen (owner, Nov 14). Instead: bring the whole section that holds the form into view and put the cursor in
 * the email field.
 */
export function JoinFocus() {
  const path = usePathname();
  useEffect(() => {
    const go = () => {
      if (location.hash !== '#join') return;
      const form = document.getElementById('join-form');
      if (!form) return;
      const section = form.closest('section') ?? form;
      const header = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      // A section near the top of the page (the hero): show the page from the top. Anything lower: just under the header.
      smoothScrollTo(sectionTop < 200 ? 0 : Math.max(0, sectionTop - header - 8));
      form.querySelector('input')?.focus({ preventScroll: true });
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href$="#join"]') as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !document.getElementById('join-form')) return;
      e.preventDefault();
      if (location.hash !== '#join') history.replaceState(null, '', '#join');
      go();
    };
    // Arriving from another page: run after the page has painted (and again in case fonts/images shifted it).
    const t = window.setTimeout(go, 60);
    const t2 = window.setTimeout(go, 400);
    window.addEventListener('hashchange', go);
    document.addEventListener('click', onClick, true);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
      window.removeEventListener('hashchange', go);
      document.removeEventListener('click', onClick, true);
    };
  }, [path]);
  return null;
}
