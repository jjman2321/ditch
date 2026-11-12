import type { Metadata } from 'next';

import { ServiceIndex, type IndexItem } from '@/components/ServiceIndex';
import { COUNTRIES, hasLogo, priceHubServices, verifiedPrices } from '@/lib/data';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: `Subscription prices in ${COUNTRIES.length} countries, checked by hand`,
  description: 'What Netflix, Spotify, Disney+, ChatGPT and more cost in the US, UK, Canada, Australia, Europe, India and the Middle East. Every plan, local money, dated.',
  alternates: { canonical: '/prices' },
};

export default function PricesIndex() {
  const hubs = priceHubServices();
  const items: IndexItem[] = hubs.map((s) => ({ id: s.id, name: s.name, aliases: s.aliases ?? [], category: s.category, meta: `${verifiedPrices(s.id).length} countries`, logo: hasLogo(s.id), color: s.color ?? '#6B6559', mono: s.mono ?? s.name[0] }));
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Subscription prices',
    url: `${SITE}/prices`,
    mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: `${x.name} prices`, url: `${SITE}/prices/${x.id}` })) },
  };
  return (
    <div className="wrap index-head">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h1 className="d-h1">Subscription prices by country</h1>
      <p className="lead" style={{ marginTop: 20, maxWidth: '34rem' }}>
        What {hubs.length} subscriptions cost in up to {COUNTRIES.length} countries, in local money. Checked by hand, with the date and the page we read.
      </p>
      <ServiceIndex items={items} base="/prices" noun="services" />
    </div>
  );
}
