'use client';

import { useEffect } from 'react';

/**
 * "Join the waitlist" links point at #join. Jumping straight to the form hid the headline and left half a phone
 * on screen (owner, Nov 14). Instead: bring the whole section that holds the form into view and put the cursor in
 * the email field.
 */
export function JoinFocus() {
  useEffect(() => {
    const go = () => {
      if (location.hash !== '#join') return;
      const form = document.getElementById('join');
      if (!form) return;
      const section = form.closest('section') ?? form;
      const header = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      // A section near the top of the page (the hero): show the page from the top. Anything lower: just under the header.
      window.scrollTo({ top: sectionTop < 200 ? 0 : Math.max(0, sectionTop - header - 8), behavior: 'smooth' });
      form.querySelector('input')?.focus({ preventScroll: true });
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href$="#join"]') as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !document.getElementById('join')) return;
      e.preventDefault();
      if (location.hash !== '#join') history.replaceState(null, '', '#join');
      go();
    };
    const t = window.setTimeout(go, 60);
    window.addEventListener('hashchange', go);
    document.addEventListener('click', onClick, true);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('hashchange', go);
      document.removeEventListener('click', onClick, true);
    };
  }, []);
  return null;
}
