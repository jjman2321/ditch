import type { Metadata } from 'next';
import Link from 'next/link';

import { HUBS } from '@/components/tools/ChargesBody';
import { SITE } from '@/lib/site';
import { SERVICE_TOOLS, TOOLS } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Free subscription tools: calculators and charge finder',
  description: 'Free tools for what you pay for: find an unknown charge, see your yearly total, catch a free trial, split a family plan and compare prices.',
  alternates: { canonical: '/tools' },
};

type Item = { href: string; name: string; desc: string };
const t = (slug: string): Item => { const x = TOOLS.find((y) => y.slug === slug)!; return { href: `/${x.slug}`, name: x.name, desc: x.desc }; };
const s = (slug: string): Item => { const x = SERVICE_TOOLS.find((y) => y.slug === slug)!; return { href: `/tools/${x.slug}`, name: x.name, desc: x.desc }; };
const h = (k: string): Item => ({ href: `/charges/${k}`, name: HUBS[k].title, desc: HUBS[k].desc });

const GROUPS: { id: string; title: string; sub: string; items: Item[] }[] = [
  { id: 'charges', title: 'Check a charge', sub: 'Work out what that charge on your statement is.', items: [t('charges'), h('apple-com-bill'), h('google'), h('amazon')] },
  { id: 'costs', title: 'Know what you pay', sub: 'Add it all up.', items: [t('tools/subscription-cost-calculator'), t('tools/cost-per-hour'), t('tools/subscription-spreadsheet')] },
  { id: 'before', title: 'Before you pay', sub: 'Pick the cheaper way in.', items: [t('tools/free-trial-calculator'), t('tools/monthly-vs-yearly'), s('amazon-prime-monthly-vs-yearly'), t('tools/apple-one-calculator'), s('disney-hulu-bundle-calculator')] },
  { id: 'share', title: 'Share a plan', sub: 'What each person pays.', items: [t('tools/family-plan-split'), s('spotify-family-split'), s('apple-music-family-split'), s('youtube-premium-family-split'), s('microsoft-365-family-split'), s('netflix-cost-per-person')] },
  { id: 'compare', title: 'Compare', sub: 'Two services, plan by plan.', items: [t('tools/compare-prices'), s('spotify-vs-apple-music'), s('chatgpt-plus-vs-claude-pro'), s('netflix-vs-disney-plus'), s('netflix-vs-hbo-max')] },
  { id: 'refund', title: 'Get money back', sub: 'Forgot to cancel?', items: [t('tools/refund-helper')] },
];

export default function Tools() {
  const all = GROUPS.flatMap((g) => g.items);
  const ld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Free subscription tools', url: `${SITE}/tools`, mainEntity: { '@type': 'ItemList', itemListElement: all.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, url: `${SITE}${x.href}` })) } };
  return (
    <div className="wrap gv3 tool">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="gv3-col">
        <h1>Free subscription tools</h1>
        <p className="sub">Built on prices we check by hand in 17 countries. Everything runs in your browser.</p>
        <nav className="jump" aria-label="Jump to">
          {GROUPS.map((g) => (
            <a key={g.id} href={`#${g.id}`}>
              {g.title}
            </a>
          ))}
        </nav>
        {GROUPS.map((g) => (
          <section key={g.id} aria-labelledby={g.id}>
            <h2 id={g.id}>{g.title}</h2>
            <p className="hub-sub">{g.sub}</p>
            <ul className="hub">
              {g.items.map((x) => (
                <li key={x.href}>
                  <Link href={x.href}>
                    <b>{x.name}</b>
                    <span>{x.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
