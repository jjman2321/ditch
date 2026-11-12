/* eslint-disable @next/next/no-img-element */
import { Stamp } from './Stamp';

/**
 * "Changed your mind? Ditch it." The app's ditch moment, shown in order: the row, the hold ring fills,
 * the stamp lands below the row (never on the price), then the yearly number fades in. Runs once when
 * scrolled into view (Reveal adds .is-in). Reduce Motion: shown finished.
 */
export function DitchDemo({ name, plan, price, renews, yearly, logo }: { name: string; plan: string; price: string; renews: string; yearly: string; logo: string }) {
  return (
    <div className="ditch-demo" data-reveal>
      <div className="dd-row">
        <img src={logo} alt="" width={44} height={44} className="logo" />
        <div className="dd-name">
          <b>{name}</b>
          <span>
            {plan} · renews {renews}
          </span>
        </div>
        <span className="dd-price num">{price}</span>
      </div>
      <div className="dd-hold" aria-hidden>
        <svg viewBox="0 0 44 44" width="44" height="44">
          <circle cx="22" cy="22" r="19" className="track" />
          <circle cx="22" cy="22" r="19" className="ring" />
        </svg>
        Hold to ditch
      </div>
      <div className="dd-stamp">
        <Stamp date="2026-11-12" />
      </div>
      <p className="dd-year num">
        {yearly} a year <span>you won’t pay.</span>
      </p>
    </div>
  );
}
