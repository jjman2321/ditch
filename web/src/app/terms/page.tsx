import type { Metadata } from 'next';

import { Doc } from '@/components/Doc';
import { COMPANY, PLANS, SUPPORT_EMAIL, pageTitle, og } from '@/lib/site';

export const metadata: Metadata = {
  title: pageTitle('Terms of use'),
  description: 'The terms for the Ditch app and ditchsubs.app: Apple’s standard license, how Pro and Lifetime work, bank sync, how to cancel, and what the guides and prices are (and aren’t).',
  alternates: { canonical: '/terms' }, openGraph: og('/terms'),
};

export default function Terms() {
  return (
    <Doc
      effective="Effective Nov 19, 2026 · Version 2"
      title="Terms"
      short={[
        { t: 'The app uses Apple’s standard license', d: 'Apple’s Licensed Application End User License Agreement applies to Ditch.' },
        { t: 'Pro renews until you cancel', d: `Yearly ${PLANS.yearly} after a ${PLANS.trialDays}-day free trial, or weekly ${PLANS.weekly}. Cancel anytime in iPhone Settings.` },
        { t: 'Lifetime is Pro, once', d: `${PLANS.lifetime} one time. Ditch Pro for good, plus bank sync for the first year. After that, bank sync is optional at ${PLANS.syncAddOn} a year.` },
        { t: 'Bank sync stays on while you pay', d: 'US and Canadian banks. We disconnect your bank when your trial or subscription ends. Your list stays.' },
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
        <li>The yearly plan starts with a {PLANS.trialDays}-day free trial if you haven’t had one. The price and the date the first charge happens are shown before you confirm.</li>
        <li>Subscriptions renew automatically unless you cancel at least 24 hours before the end of the current period. Cancel in Settings → your name → Subscriptions.</li>
        <li>If Pro ends, nothing you added is deleted or hidden. Reminders go back to 3 subscriptions.</li>
      </ul>

      <h2 id="lifetime">3. Lifetime</h2>
      <ul>
        <li>Lifetime is a one-time purchase of {PLANS.lifetime}. It unlocks Ditch Pro for as long as the app is offered, with nothing to renew.</li>
        <li>It includes bank sync for the first 12 months after you buy it. Bank sync costs us money every month, so after those 12 months it’s an optional add-on at {PLANS.syncAddOn} a year. You’re never charged for it unless you choose it, and it renews until you cancel, like any App Store subscription.</li>
        <li>Without the add-on, Lifetime keeps every other Pro feature, and your bank is disconnected. Nothing on your list is deleted.</li>
        <li>Lifetime doesn’t include separate future products.</li>
      </ul>

      <h2 id="bank">4. Bank sync</h2>
      <ul>
        <li>Bank sync is part of Ditch Pro (during the free trial, weekly and yearly plans) and of Lifetime’s first year. It isn’t part of the free version.</li>
        <li>It works with banks and cards in the United States and Canada. You connect through our bank data provider; Ditch never sees your bank password.</li>
        <li>While it’s on, Ditch checks your new transactions to spot subscriptions. Ones it’s sure about are added to your list and marked “Found in your bank”, and you can undo them. Ones it isn’t sure about are shown for you to check. It can miss things, so keep an eye on your statements.</li>
        <li>When your trial is cancelled or your subscription ends, we disconnect your bank. You can also disconnect it any time in Settings.</li>
        <li>How we handle bank data is in our <a href="/privacy">privacy policy</a>.</li>
      </ul>

      <h2 id="info">5. Cancel guides and prices</h2>
      <p>
        Guides and prices on this site and in the app are read from each service’s own pages, with the date shown. Services can change their steps or prices at any time. Ditch can’t cancel anything for you, and we aren’t responsible for charges made by other companies. If something looks wrong, tell us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
      <p>Service names and logos belong to their owners and are used only to identify the services. Ditch isn’t affiliated with or endorsed by any of them.</p>

      <h2 id="site">6. This website</h2>
      <p>You can read, link to and share our pages. Please don’t copy the site wholesale or scrape it in a way that harms it.</p>

      <h2 id="contact">7. Contact</h2>
      <p>
        {COMPANY} · <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </p>
    </Doc>
  );
}
