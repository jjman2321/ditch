import type { Metadata } from 'next';

import { Doc } from '@/components/Doc';
import { COMPANY, PRO, SUPPORT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'The terms for the Ditch app and ditchsubs.app: Apple’s standard license, how Pro renews and how to cancel it, and what the guides and prices are (and aren’t).',
  alternates: { canonical: '/terms' },
};

export default function Terms() {
  return (
    <Doc
      effective="Effective Nov 12, 2026 · Version 1"
      title="Terms"
      short={[
        { t: 'The app uses Apple’s standard license', d: 'Apple’s Licensed Application End User License Agreement applies to Ditch.' },
        { t: 'Pro renews until you cancel', d: `Yearly ${PRO.yearly} after a ${PRO.trialDays}-day free trial, or monthly ${PRO.monthly}. Cancel anytime in iPhone Settings.` },
        { t: 'Lifetime is Pro, once', d: `${PRO.lifetime} one time. It covers Ditch Pro. It doesn’t include separate future products.` },
        { t: 'Guides and prices are information', d: 'We read them on each service’s own pages, but services change. Their own pages are always right.' },
      ]}
    >
      <h2 id="license">1. The app</h2>
      <p>
        Ditch is licensed to you under Apple’s{' '}
        <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" rel="noopener">
          Licensed Application End User License Agreement
        </a>
        . {COMPANY} is the developer.
      </p>

      <h2 id="pro">2. Ditch Pro</h2>
      <ul>
        <li>Pro is bought through your Apple ID. Apple charges you and handles refunds.</li>
        <li>The yearly plan starts with a {PRO.trialDays}-day free trial if you haven’t had one. The price and the date the first charge happens are shown before you confirm.</li>
        <li>Subscriptions renew automatically unless you cancel at least 24 hours before the end of the current period. Cancel in Settings → your name → Subscriptions.</li>
        <li>If Pro ends, nothing you added is deleted or hidden. Reminders go back to 3 subscriptions.</li>
      </ul>

      <h2 id="info">3. Cancel guides and prices</h2>
      <p>
        Guides and prices on this site and in the app are read from each service’s own pages, with the date shown. Services can change their steps or prices at any time. Ditch can’t cancel anything for you, and we aren’t responsible for charges made by other companies. If something looks wrong, tell us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
      <p>Service names and logos belong to their owners and are used only to identify the services. Ditch isn’t affiliated with or endorsed by any of them.</p>

      <h2 id="site">4. This website</h2>
      <p>You can read, link to and share our pages. Please don’t copy the site wholesale or scrape it in a way that harms it.</p>

      <h2 id="contact">5. Contact</h2>
      <p>
        {COMPANY} · <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </p>
    </Doc>
  );
}
