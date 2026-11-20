import type { Metadata } from 'next';

import { Doc } from '@/components/Doc';
import { COMPANY, SUPPORT_EMAIL, pageTitle, og } from '@/lib/site';

export const metadata: Metadata = {
  title: pageTitle('Privacy policy'),
  description: 'Your list stays on your phone. No account, no ads, no tracking. Optional bank sync through Plaid. What the Ditch app, this website and the waitlist collect, and why.',
  alternates: { canonical: '/privacy' }, openGraph: og('/privacy'),
};

export default function Privacy() {
  return (
    <Doc
      effective="Effective Nov 20, 2026 · Version 3"
      title="Privacy"
      short={[
        { t: 'Your list stays on your phone', d: 'Your subscriptions, prices and dates are stored on your iPhone, not on our servers. When iCloud backup arrives for Pro, it will go to your own iCloud.' },
        { t: 'No account. Bank sync only if you choose it', d: 'Ditch never needs an account. If you turn on bank sync, you sign in to your bank through Plaid, never in Ditch, and we never see your bank password.' },
        { t: 'Apple takes the payment', d: 'If you buy Pro, Apple handles the payment and we never see your card. RevenueCat checks the purchase using a random ID, not your name or email.' },
        { t: 'No ads, no tracking, no selling', d: 'We don’t use advertising or analytics that follow you, in the app or on this site.' },
      ]}
    >
      <h2 id="app">1. The Ditch app</h2>
      <p>
        Everything you add (services, prices, dates, notes) is saved in a database on your iPhone. Reminders are local notifications scheduled by your iPhone; no server sends them. We can’t see your list.
      </p>
      <ul>
        <li>
          <b>Purchases:</b> Ditch Pro is sold through Apple. RevenueCat, our purchase provider, receives the purchase receipt from Apple and a random app ID (never your name, email or advertising ID) so the app knows whether Pro is on.
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
        <li>
          <b>Feedback form:</b> if you send feedback from the app, we store your message, your email if you add one (only so we can reply), the optional counts line, and the date in our Cloudflare database. The app never adds anything from your list.
        </li>
      </ul>

      <h2 id="bank">2. Bank sync (optional)</h2>
      <p>
        Bank sync finds subscriptions in your card and bank transactions. It’s off unless you turn it on, and you can turn it off at any time.
      </p>
      <ul>
        <li>
          <b>How you connect:</b> you sign in to your bank inside Plaid’s secure screen, not in Ditch. Before it opens, Ditch tells you what it reads and why, and Plaid asks for your consent. We never see or store your bank username or password. Plaid’s own privacy policy is at{' '}
          <a href="https://plaid.com/legal/#end-user-privacy-policy">plaid.com/legal</a>.
        </li>
        <li>
          <b>What we read:</b> your transactions (date, amount, merchant name) from the accounts you pick, only to find recurring charges. Plaid passes them through our server straight to your iPhone, where they’re stored inside the app. We don’t keep them on our server, and we don’t read balances, account numbers or anything else.
        </li>
        <li>
          <b>What our server keeps:</b> a random app ID, whether you have Pro, and for each connected bank the Plaid connection ID, an encrypted access key, the bank’s name and its status. Our server runs on Supabase in the United States.
        </li>
        <li>
          <b>We never</b> sell your data, use it for ads, or share it with anyone other than Plaid and the providers that run our service.
        </li>
      </ul>

      <h2 id="site">3. This website</h2>
      <p>
        The site is hosted on Cloudflare. Like any web host, Cloudflare processes your IP address to deliver pages and stop attacks. We use Cloudflare Web Analytics, which counts visits without cookies and without following you across sites. There is no cookie banner because we don’t set tracking cookies.
      </p>
      <p>The “What do you pay for?” calculator runs in your browser. What you tap isn’t sent anywhere.</p>

      <h2 id="waitlist">4. The waitlist</h2>
      <p>
        If you join the waitlist, we store your email address, the page you signed up on, and the date. It’s kept in our Cloudflare database. We use it only to email you once, when Ditch launches.
      </p>
      <p>
        Every email has an unsubscribe link. To delete your address completely, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and we’ll remove it within 30 days.
      </p>

      <h2 id="retention">5. How long we keep things</h2>
      <ul>
        <li><b>Your list and bank transactions in the app:</b> on your iPhone until you delete them or the app.</li>
        <li><b>Bank connections:</b> removed from Plaid and our server, with the access key deleted, within about an hour of you disconnecting a bank, deleting your data in Ditch, or your Pro ending. Connections that stay broken for 30 days are removed too.</li>
        <li><b>Our server’s activity log:</b> short codes only (like “bank removed”), never transactions or amounts. Deleted after 180 days.</li>
        <li><b>Feedback and support emails:</b> kept while we deal with them, deleted on request, and cleared out every 12 months.</li>
        <li><b>Waitlist emails:</b> deleted after the launch email, or sooner if you ask.</li>
      </ul>

      <h2 id="rights">6. Your rights</h2>
      <p>
        You can ask what we hold about you, ask us to correct or delete it, or complain to your local data protection authority. Since the app’s data stays on your phone, deleting the app (or Settings → Your data → Delete all my data in Ditch) deletes it. Delete all my data also disconnects every bank. To have anything on our server deleted, email us and we’ll do it within 30 days.
      </p>

      <h2 id="kids">7. Children</h2>
      <p>Ditch isn’t made for children under 13, and we don’t knowingly collect anything from them.</p>

      <h2 id="changes">8. Changes and contact</h2>
      <p>
        If this policy changes, we’ll update the date and version above and keep the old version available on request. Questions: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Ditch is made by {COMPANY}.
      </p>
    </Doc>
  );
}
