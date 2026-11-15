import type { Metadata } from 'next';
import Link from 'next/link';

import { ToolIcon } from '@/components/ToolCard';
import { ToolHub, type Group } from '@/components/ToolHub';
import { HUBS } from '@/components/tools/ChargesBody';
import { COUNTRIES } from '@/lib/data';
import { SITE, pageTitle, og } from '@/lib/site';
import { SERVICE_TOOLS, TOOLS } from '@/lib/tools';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: pageTitle('Free subscription tools and calculators'),
  description: 'Free tools for what you pay for: find an unknown charge, see your yearly total, catch a free trial, split a family plan and compare prices.',
  alternates: { canonical: '/tools' }, openGraph: og('/tools'),
};

const t = (slug: string) => { const x = TOOLS.find((y) => y.slug === slug)!; return { href: `/${x.slug}`, name: x.name, desc: x.desc }; };
const s = (slug: string) => { const x = SERVICE_TOOLS.find((y) => y.slug === slug)!; return { href: `/tools/${x.slug}`, name: x.name, desc: x.desc }; };
const h = (k: string) => ({ href: `/charges/${k}`, name: HUBS[k].title, desc: HUBS[k].desc });

const GROUPS: Group[] = [
  { id: 'charges', title: 'Check a charge', sub: 'What’s that charge on your statement?', items: [t('charges'), h('apple-com-bill'), h('google'), h('amazon')] },
  { id: 'costs', title: 'Know what you pay', sub: 'Add it all up.', items: [t('tools/subscription-cost-calculator'), t('tools/cost-per-hour'), t('tools/subscription-spreadsheet')] },
  { id: 'before', title: 'Before you pay', sub: 'Pick the cheaper way in.', items: [t('tools/free-trial-calculator'), t('tools/monthly-vs-yearly'), s('amazon-prime-monthly-vs-yearly'), t('tools/apple-one-calculator'), s('disney-hulu-bundle-calculator')] },
  { id: 'share', title: 'Share a plan', sub: 'What each person pays.', items: [s('spotify-family-split'), s('apple-music-family-split'), s('microsoft-365-family-split'), s('netflix-cost-per-person'), t('tools/family-plan-split')] },
  { id: 'compare', title: 'Compare', sub: 'Two services, plan by plan.', items: [s('spotify-vs-apple-music'), s('chatgpt-plus-vs-claude-pro'), s('netflix-vs-disney-plus'), s('netflix-vs-hbo-max'), t('tools/compare-prices')] },
  { id: 'refund', title: 'Get money back', sub: 'Charged after you meant to cancel?', items: [t('tools/refund-helper')] },
];

const FEATURED = [
  { href: '/charges', icon: 'search', name: 'What’s this charge?', desc: 'Type the amount on your statement.', ink: true },
  { href: '/tools/free-trial-calculator', icon: 'cal', name: 'Free trial deadline', desc: 'The day it charges, and the day to cancel by.' },
  { href: '/tools/subscription-cost-calculator', icon: 'sum', name: 'What you pay in a year', desc: 'Tap what you pay for. See the total.' },
];

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function Tools() {
  const all = GROUPS.flatMap((g) => g.items);
  const ld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Free subscription tools', url: `${SITE}/tools`, mainEntity: { '@type': 'ItemList', itemListElement: all.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, url: `${SITE}${x.href}` })) } };
  return (
    <div className="wrap v4 tool hubpage">
      <JsonLd data={ld} />
      <header className="v4-hero solo">
        <div>
          <h1>Free subscription tools</h1>
          <p className="lead">{all.length} free tools built on prices from each service’s own page, in {COUNTRIES.length} countries. They run in your browser.</p>
        </div>
      </header>
      <ToolHub groups={GROUPS}>
        <div className="feat">
          {FEATURED.map((f) => (
            <Link key={f.href} href={f.href} className={`fc${f.ink ? ' ink' : ''}`}>
              <span className="fc-top" aria-hidden>
                <span className="fc-ic">
                  <ToolIcon name={f.icon} />
                </span>
                <span className="fc-go">
                  <Arrow />
                </span>
              </span>
              <span>
                <b>{f.name}</b>
                <small>{f.desc}</small>
                <span className="fc-open" aria-hidden>
                  Open the tool
                </span>
              </span>
            </Link>
          ))}
        </div>
      </ToolHub>
    </div>
  );
}
