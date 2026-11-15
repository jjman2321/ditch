import type { Metadata } from 'next';

import { ServiceIndex, type IndexItem } from '@/components/ServiceIndex';
import { COUNTRIES, hasLogo, priceHubServices, verifiedPrices, slugOf } from '@/lib/data';
import { SITE, pageTitle, og } from '@/lib/site';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: pageTitle(`Subscription prices ${new Date().getFullYear()}: ${priceHubServices().length} services, ${COUNTRIES.length} countries`),
  description: 'What Netflix, Spotify, Disney+, ChatGPT and more cost in the US, UK, Canada, Australia, Europe, India and the Middle East. Every plan, local money, dated.',
  alternates: { canonical: '/prices' }, twitter: { card: 'summary_large_image', images: ['/og/prices.jpg'] }, openGraph: og('/prices', 'prices'),
};

export default function PricesIndex() {
  const hubs = priceHubServices();
  const items: IndexItem[] = hubs.map((s) => ({ id: s.id, slug: slugOf(s.id), name: s.name, aliases: s.aliases ?? [], category: s.category, meta: verifiedPrices(s.id).length === 1 ? 'US prices' : `${verifiedPrices(s.id).length} countries`, logo: hasLogo(s.id), color: s.color ?? '#6B6559', mono: s.mono ?? s.name[0] }));
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Subscription prices',
    url: `${SITE}/prices`,
    mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: `${x.name} prices`, url: `${SITE}/prices/${slugOf(x.id)}` })) },
  };
  return (
    <div className="wrap v4 index-head idx4">
      <JsonLd data={ld} />
      <header className="v4-hero solo">
        <div>
          <h1>Subscription prices by country</h1>
          <p className="lead">
        What {hubs.length} subscriptions cost in up to {COUNTRIES.length} countries, in local money. Read from each service’s own page, with the date and the page we read.
          </p>
        </div>
      </header>
      <ServiceIndex items={items} base="/prices" noun="services" />
    </div>
  );
}
