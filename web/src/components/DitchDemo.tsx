/* eslint-disable @next/next/no-img-element */

/**
 * The app's Ditched screen (src/app/ditch/[id].tsx), without the stamp (owner, Nov 12): the duck peeks over the
 * subscription row, then the yearly number. When scrolled into view the duck pops up once and the number fades in
 * (it never moves). Reduce Motion: shown finished. `small` is the step-card version.
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
