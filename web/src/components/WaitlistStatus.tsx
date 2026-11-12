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
      <p className="lead" style={{ marginTop: 16, maxWidth: '34rem' }}>{invalid ? 'It may have expired. Pop your email in again and we’ll send a fresh one.' : 'One email when Ditch is on the App Store.'}</p>
      <div style={{ marginTop: 28, width: '100%', maxWidth: 520, textAlign: 'left' }}>
        <EmailBox source="waitlist-page" onCream />
      </div>
    </>
  );
}
