/* eslint-disable @next/next/no-img-element */

/**
 * The app's ditch moment as a web card (no phone, no stamp). When scrolled into view it plays once:
 * the hold ring fills, "Hold to ditch" turns into a "Ditched" tag, the logo goes grey, the duck pops up
 * over the row, then the yearly number fades in (it never moves). Reduce Motion: shown finished.
 * `small` is the step-card version (finished, no number).
 */
export function DitchDemo({ name, meta, yearly, logo, small = false }: { name: string; meta: string; yearly?: string; logo: string; small?: boolean }) {
  return (
    <div className={`ditch-demo${small ? ' sm' : ''}`} data-reveal={small ? undefined : true} role="img" aria-label={yearly ? `${name} ditched. ${yearly} a year you won’t pay.` : `${name} ditched.`}>
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
