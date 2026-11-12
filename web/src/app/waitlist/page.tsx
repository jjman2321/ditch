import type { Metadata } from 'next';
import { Suspense } from 'react';

import { WaitlistStatus } from '@/components/WaitlistStatus';

export const metadata: Metadata = { title: 'Waitlist', robots: { index: false }, alternates: { canonical: '/waitlist' } };

export default function Waitlist() {
  return (
    <div className="wrap doc" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Suspense fallback={<h1>Join the waitlist</h1>}>
        <WaitlistStatus />
      </Suspense>
    </div>
  );
}
