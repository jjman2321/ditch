/* eslint-disable @next/next/no-img-element */

/**
 * Official App Store and Google Play badges (unmodified artwork from Apple and Google), owner request Nov 14.
 * Ditch isn't in either store yet, so both say "Coming soon" beside them and lead to the waitlist.
 * On launch day: point `appStore` / `googlePlay` at the real store links and drop the "Coming soon" line.
 */
export function AppBadges({ appStore, googlePlay, note = 'Coming soon', className = '' }: { appStore?: string; googlePlay?: string; note?: string | null; className?: string }) {
  return (
    <div className={`app-badges ${className}`}>
      <div className="row">
        <a href={appStore ?? '#join'} aria-label={appStore ? 'Download on the App Store' : 'App Store: coming soon. Join the waitlist'}>
          <img src="/badges/app-store.svg" alt="" width={120} height={40} />
        </a>
        <a href={googlePlay ?? '#join'} aria-label={googlePlay ? 'Get it on Google Play' : 'Google Play: coming soon. Join the waitlist'}>
          <img src="/badges/google-play.png" alt="" width={135} height={52} className="gp" />
        </a>
      </div>
      {note ? <p className="note">{note}</p> : null}
    </div>
  );
}
