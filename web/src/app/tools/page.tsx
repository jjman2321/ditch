import type { Metadata } from 'next';
import Link from 'next/link';

import { SITE } from '@/lib/site';
import { TOOLS } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Free subscription tools: calculators, charge finder and more',
  description: 'Free tools to check what you pay for: find an unknown charge, see your yearly total, work out a free trial deadline, split a family plan, compare prices and more. Nothing is sent anywhere.',
  alternates: { canonical: '/tools' },
};

export default function Tools() {
  const ld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Free subscription tools', url: `${SITE}/tools`, mainEntity: { '@type': 'ItemList', itemListElement: TOOLS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: `${SITE}/${t.slug}` })) } };
  return (
    <div className="wrap gv3 tool">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="gv3-col" style={{ maxWidth: 1000 }}>
        <p className="kick-t">Free · Runs in your browser · Nothing is sent anywhere</p>
        <h1>Free subscription tools</h1>
        <p className="sub">Find a charge you don’t recognise, see your yearly total, catch a free trial before it charges, and more. Built on prices we check by hand in 17 countries.</p>
        <ul className="tools-grid">
          {TOOLS.map((t) => (
            <li key={t.slug}>
              <Link href={`/${t.slug}`}>
                <b>{t.name}</b>
                <span>{t.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
