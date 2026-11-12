import type { Metadata } from 'next';
import Link from 'next/link';

import { Doc } from '@/components/Doc';
import { COUNTRIES, formatDate, siteCounts } from '@/lib/data';
import { STATS, SUPPORT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'How we check prices and cancel guides',
  description: 'Every price and cancel step on Ditch is read by hand from the service’s own page, with the date. What verified means, how often we re-check, and what we don’t do.',
  alternates: { canonical: '/how-we-check' },
};

export default function HowWeCheck() {
  const c = siteCounts();
  return (
    <Doc
      title="How we check"
      short={[
        { t: 'Official pages only', d: 'Prices and steps come from the service’s own pricing or help page for that country, or Apple’s in-app price list when that’s what you’d be charged.' },
        { t: 'A date on everything', d: 'Every price row and guide shows when we checked it and links to the page we read.' },
        { t: 'Only what we could confirm', d: 'If we couldn’t read a price or a step from an official page, it isn’t on the site.' },
      ]}
    >
      <h2 id="numbers">Where things stand</h2>
      <p>
        {c.services} services with checked prices in up to {c.countries} countries ({c.plans.toLocaleString('en-US')} plan prices), and {c.guides} cancel guides. Last price check: {formatDate(c.checked)}.
      </p>
      <p>Countries: {COUNTRIES.map((x) => x.name).join(', ')}.</p>

      <h2 id="method">How a price gets on the site</h2>
      <ul>
        <li><b>1. Read it at the source.</b> We open the service’s own page for that country and record every plan, its price and how often it bills.</li>
        <li><b>2. Write down where and when.</b> The exact page and the date go next to the price.</li>
        <li><b>3. Keep the country’s own money.</b> Prices stay in the currency you’re charged in. We never add different currencies together.</li>
        <li><b>4. Re-check.</b> Popular services every month, the rest at least every 90 days. After 90 days a page says the price may have changed; after 180 days it’s hidden from search until we check again.</li>
      </ul>

      <h2 id="status">What the labels mean</h2>
      <ul>
        <li><b>Verified:</b> every plan read from an official page on the date shown. Only verified prices appear on this site.</li>
        <li><b>Partial / unverified:</b> some or all plans couldn’t be read from an official page. We keep these off the site until they’re confirmed.</li>
      </ul>

      <h2 id="tax">Taxes</h2>
      <p>US and Canada prices are before sales tax. UK, EU, Australia, New Zealand and India prices include VAT or GST. In the Middle East it depends on the service; each country’s row says what its page says.</p>

      <h2 id="guides">Cancel guides</h2>
      <p>Steps come from the service’s own help page or terms. Each guide starts with how you pay, because that decides where you cancel: with the service, with Apple, or with a partner like your phone company. A guide is only published when we’re confident in every step.</p>

      <h2 id="limits">What we don’t do</h2>
      <p>We don’t take money to list or rank anyone, we don’t use affiliate links, and we can’t see your bank or cancel for you. Services change things without warning, so their own page always wins.</p>

      <h2 id="sources">Sources for the numbers we quote</h2>
      <ul>
        <li>
          <b>~$205 a year on unused subscriptions:</b> CNET/YouGov survey of 2,440 US adults, 2025 (<a href={STATS.wasted.url} rel="noopener">report</a>).
        </li>
        <li>
          <b>5,535 reviews of other trackers:</b> every App Store review Apple’s public feed returned for 17 subscription and bill apps in the US, UK, Canada and Australia, read in November 2026.
        </li>
      </ul>

      <h2 id="corrections">Corrections</h2>
      <p>
        Seen a different price or a step that changed? Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We re-check by hand and fix the page. See <Link href="/prices">all prices</Link> and <Link href="/cancel">all guides</Link>.
      </p>
    </Doc>
  );
}
