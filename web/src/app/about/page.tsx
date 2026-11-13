import type { Metadata } from 'next';
import Link from 'next/link';

import { COMPANY, SITE, SUPPORT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'Ditch is made by Aribo, who built it to keep track of his own subscriptions. A small, independent app from Grasp Labs LLC.',
  alternates: { canonical: '/about' },
};

export default function About() {
  const ld = { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About Ditch', url: `${SITE}/about`, mainEntity: { '@type': 'Person', name: 'Aribo', jobTitle: 'Maker of Ditch', worksFor: { '@type': 'Organization', name: COMPANY } } };
  return (
    <div className="wrap doc v4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p className="effective">A note from the maker</p>
      <h1>Why Ditch exists</h1>
      <div className="letter">
        <p>I’m Aribo. I made Ditch because I wanted to keep track of my own subscriptions, and nothing I tried felt right.</p>
        <p>Some apps wanted my bank login. Some wanted an account before showing me anything. Some sent reminders that never came. I just wanted to see what I pay for, know before each charge, and drop what I don’t use.</p>
        <p>So that’s Ditch. Your list stays on your phone. Reminders are planned on your iPhone and checked every time you open the app. The prices and cancel guides on this site are checked by hand, with the date on every page, because a wrong price is worse than none.</p>
        <p>
          If something’s off, or you want a service added, email me at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. I read everything.
        </p>
        <span className="sig" aria-hidden>
          Aribo
        </span>
        <p className="meta" style={{ marginTop: 24, fontSize: 14 }}>
          Ditch is made by {COMPANY}. <Link href="/how-we-check">How we check prices and guides</Link>.
        </p>
      </div>
    </div>
  );
}
