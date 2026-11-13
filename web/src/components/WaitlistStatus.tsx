'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { EmailBox } from './EmailBox';

/** Old links with ?status= still work; new confirm links go to /waitlist/confirmed and /waitlist/invalid (static). */
export function WaitlistStatus() {
  const status = useSearchParams().get('status');
  if (status === 'confirmed') return <WaitlistConfirmed />;
  return <WaitlistJoin invalid={status === 'invalid'} />;
}

export function WaitlistConfirmed() {
  return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/duck.webp" alt="" width={200} height={117} loading="lazy" style={{ margin: '0 auto 8px' }} />
        <h1>You’re on the list.</h1>
        <p className="lead" style={{ marginTop: 16, maxWidth: '34rem' }}>One email the day Ditch is out. While you wait, see what your subscriptions cost.</p>
        <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link className="btn" href="/#calc-h">
            Try the calculator
          </Link>
          <Link className="btn ghost" href="/cancel">
            Browse cancel guides
          </Link>
        </div>
      </>
  );
}

export function WaitlistJoin({ invalid = false }: { invalid?: boolean }) {
  return (
    <>
      <h1>{invalid ? 'That link didn’t work.' : 'Join the waitlist'}</h1>
      <p className="lead" style={{ marginTop: 16, maxWidth: '34rem' }}>{invalid ? 'Put your email in again and we’ll send a new one.' : 'Ditch is coming to iPhone. Leave your email and we’ll tell you the day it’s out.'}</p>
      <div style={{ marginTop: 28, width: '100%', maxWidth: 520, textAlign: 'left' }}>
        <EmailBox source="waitlist-page" onCream />
      </div>
    </>
  );
}
