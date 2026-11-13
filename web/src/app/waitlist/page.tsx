import type { Metadata } from 'next';
import { Suspense } from 'react';

import { WaitlistStatus } from '@/components/WaitlistStatus';

export const metadata: Metadata = { title: 'Waitlist', robots: { index: false }, alternates: { canonical: '/waitlist' } };

export default function Waitlist() {
  return (
    <div className="wrap doc" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Suspense fallback={<div style={{ minHeight: 320 }} aria-hidden />}>
        <WaitlistStatus />
      </Suspense>
    </div>
  );
}
