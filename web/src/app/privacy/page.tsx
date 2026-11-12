import type { Metadata } from 'next';

import { Doc } from '@/components/Doc';
import { COMPANY, SUPPORT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Your list stays on your phone. No bank login, no account, no ads, no tracking. What the Ditch app, this website and the waitlist collect, and why.',
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <Doc
      effective="Effective Nov 12, 2026 · Version 1"
      title="Privacy"
      short={[
        { t: 'Your list stays on your phone', d: 'Your subscriptions, prices and dates are stored on your iPhone, not on our servers. When iCloud backup arrives for Pro, it will go to your own iCloud.' },
        { t: 'No bank login, no account', d: 'Ditch never asks for your bank, your email password or an account.' },
        { t: 'Purchases go through Apple and RevenueCat', d: 'If you buy Pro, RevenueCat receives the purchase (not your list) to unlock it. It isn’t linked to your identity.' },
        { t: 'No ads, no tracking, no selling', d: 'We don’t use advertising or analytics that follow you, in the app or on this site.' },
      ]}
    >
      <h2 id="app">1. The Ditch app</h2>
      <p>
        Everything you add (services, prices, dates, notes) is saved in a database on your iPhone. Reminders are local notifications scheduled by your iPhone; no server sends them. We can’t see your list.
      </p>
      <ul>
        <li>
          <b>Purchases:</b> Ditch Pro is sold through Apple. We use RevenueCat to check whether you have Pro. RevenueCat receives purchase data (product, price, date) with an anonymous ID. We don’t send your name or email. Apple’s App Store label for Ditch reads “Data Not Linked to You: Purchases”.
        </li>
        <li>
          <b>Exchange rates:</b> once a day the app may download the same public exchange-rate file everyone gets, to show a rough total for mixed currencies. The request carries nothing about you or your list.
        </li>
        <li>
          <b>iCloud backup (Pro, coming soon):</b> will be stored in your own iCloud account, under Apple’s privacy terms. We can’t read it.
        </li>
        <li>
          <b>Email to support:</b> if you email us, we see what you send. The app’s “Report a problem” adds counts only (like “12 subscriptions”), never names or prices.
        </li>
      </ul>

      <h2 id="site">2. This website</h2>
      <p>
        The site is hosted on Cloudflare. Like any web host, Cloudflare processes your IP address to deliver pages and stop attacks. We use Cloudflare Web Analytics, which counts visits without cookies and without following you across sites. There is no cookie banner because we don’t set tracking cookies.
      </p>
      <p>The “What do you pay for?” calculator runs in your browser. What you tap isn’t sent anywhere.</p>

      <h2 id="waitlist">3. The waitlist and the Price Hike Report</h2>
      <p>
        If you join the waitlist, we store your email address, the page you signed up on, whether you ticked the Price Hike Report, and when you confirmed. It’s kept in our Cloudflare database and in Resend, the service that sends our emails. We use it only to email you when Ditch launches and, if you asked, the monthly report.
      </p>
      <p>
        Every email has an unsubscribe link. To delete your address completely, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and we’ll remove it within 30 days.
      </p>

      <h2 id="rights">4. Your rights</h2>
      <p>
        You can ask what we hold about you, ask us to correct or delete it, or complain to your local data protection authority. Since the app’s data stays on your phone, deleting the app (or Settings → Your data → Delete all my data in Ditch) deletes it.
      </p>

      <h2 id="kids">5. Children</h2>
      <p>Ditch isn’t made for children under 13, and we don’t knowingly collect anything from them.</p>

      <h2 id="changes">6. Changes and contact</h2>
      <p>
        If this policy changes, we’ll update the date and version above and keep the old version available on request. Questions: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Ditch is made by {COMPANY}.
      </p>
    </Doc>
  );
}
