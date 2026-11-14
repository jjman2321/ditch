'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from 'react';

/**
 * The app's ditch moment as a web card (no phone, no stamp). When scrolled into view it plays once:
 * the hold ring fills, "Hold to ditch" turns into a "Ditched" tag, the logo goes grey, the duck pops up
 * over the row, then the yearly number fades in (it never moves). Owner, Nov 14: it must always be seen, so it
 * replays every time it comes into view and repeats every few seconds while on screen.
 * `small` is the step-card version (finished, no number).
 */
export function DitchDemo({ name, meta, yearly, logo, small = false }: { name: string; meta: string; yearly?: string; logo: string; small?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || small || !('IntersectionObserver' in window)) return;
    let timer: number | undefined;
    const play = () => {
      el.classList.remove('is-in');
      void el.offsetWidth; // restart from the start state
      el.classList.add('is-in');
    };
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearInterval(timer);
        if (e.isIntersecting) {
          play();
          timer = window.setInterval(play, 5200);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [small]);
  return (
    <div ref={ref} className={`ditch-demo${small ? ' sm' : ''}`} data-play={small ? undefined : true} role="img" aria-label={yearly ? `${name} ditched. ${yearly} a year you won’t pay.` : `${name} ditched.`}>
      <div className="dd-stack">
        <img className="dd-duck" src="/duck.webp" alt="" width={200} height={117} loading="lazy" />
        <div className="dd-row">
          <img src={logo} alt="" width={44} height={44} className="logo" />
          <div className="dd-name">
            <b>{name}</b>
            <span className="num">{meta}</span>
          </div>
          {small ? (
            <span className="dd-tag on">Ditched</span>
          ) : (
            <span className="dd-act">
              <span className="dd-hold">
                <svg viewBox="0 0 28 28" width="28" height="28">
                  <circle cx="14" cy="14" r="11" className="track" />
                  <circle cx="14" cy="14" r="11" className="ring" />
                </svg>
                Hold to ditch
              </span>
              <span className="dd-tag">Ditched</span>
            </span>
          )}
        </div>
      </div>
      {yearly ? (
        <p className="dd-year num">
          {yearly}
          <span>a year you won’t pay.</span>
        </p>
      ) : null}
    </div>
  );
}
