'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { EmailBox } from './EmailBox';

/** Reads ?status= in the browser, so the page itself stays static. */
export function WaitlistStatus() {
  const status = useSearchParams().get('status');
  if (status === 'confirmed') {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/duck.webp" alt="" width={200} height={117} loading="lazy" style={{ margin: '0 auto 8px' }} />
        <h1>You’re on the list.</h1>
        <p className="lead" style={{ marginTop: 16, maxWidth: '34rem' }}>One email when Ditch is on the App Store. While you wait, see what your subscriptions cost.</p>
        <Link className="btn" href="/#calc-h" style={{ marginTop: 28 }}>
          Try the calculator
        </Link>
      </>
    );
  }
  const invalid = status === 'invalid';
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
