'use client';

import { useEffect, useState } from 'react';

/** iPhone only: a "Join the waitlist" pill once the hero's form has scrolled away, hidden while another form is on screen. */
export function StickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById('join');
    const others = Array.from(document.querySelectorAll('[data-has-cta]'));
    if (!hero) return;
    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) visible.set(e.target, e.isIntersecting);
      const heroGone = visible.get(hero) === false && hero.getBoundingClientRect().bottom < 0;
      const otherOn = others.some((o) => visible.get(o));
      setShow(heroGone && !otherOn);
    });
    [hero, ...others].forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className={`sticky-cta${show ? ' show' : ''}`} aria-hidden={!show}>
      <a className="btn" href="#join" tabIndex={show ? 0 : -1}>
        Join the waitlist
      </a>
    </div>
  );
}
