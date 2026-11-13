import type { Metadata } from 'next';

import { WaitlistJoin } from '@/components/WaitlistStatus';

export const metadata: Metadata = { title: 'That link didn’t work', robots: { index: false }, alternates: { canonical: '/waitlist' } };

/** Where the confirm link lands (api/confirm). Static, so it shows the right thing with or without JavaScript. */
export default function Page() {
  return (
    <div className="wrap doc" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <WaitlistJoin invalid />
    </div>
  );
}
