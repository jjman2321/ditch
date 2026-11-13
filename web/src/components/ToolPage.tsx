/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { EmailBox } from './EmailBox';
import { ToolCard, allToolItems, visualOf } from './ToolCard';
import { SITE } from '@/lib/site';

/**
 * One layout for every free tool (v4, Nov 13; mockups in design/site/tools-v4, after Upwork's calculators,
 * incident.io and Kit on Mobbin): short H1 + one line (+ the service's logo) → the tool, with the choices on
 * the left and the answer in a dark panel on the right → how it works (3 cards) → good to know → questions
 * (2 columns) → sources → one CTA → more tools as cards. Everything a reader or Google needs is in the HTML.
 */
export function ToolPage({
  slug,
  title,
  lead,
  children,
  how = [],
  good = [],
  faq = [],
  sources = [],
  cta,
  extra,
  wide = false,
  raw = false,
}: {
  slug: string;
  title: string;
  lead: string;
  children: React.ReactNode;
  how?: React.ReactNode[];
  good?: React.ReactNode[];
  faq?: { q: string; a: string }[];
  sources?: string[];
  cta?: string;
  extra?: React.ReactNode;
  /** The tool takes the full width (lists, pickers) instead of choices left / answer right. */
  wide?: boolean;
  /** The tool brings its own layout (the home page calculator). */
  raw?: boolean;
}) {
  const mine = visualOf(slug).logos ?? [];
  const others = allToolItems()
    .filter((t) => t.href !== `/${slug}`)
    .map((t, i) => ({ t, score: (visualOf(t.href.slice(1)).logos ?? []).some((l) => mine.includes(l)) ? -100 + i : i }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 6)
    .map((x) => x.t);
  const ld = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: title, url: `${SITE}/${slug}`, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@id': `${SITE}/#org` } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Free tools', item: `${SITE}/tools` }, { '@type': 'ListItem', position: 2, name: title, item: `${SITE}/${slug}` }] },
    ...(faq.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : []),
  ];
  return (
    <div className="wrap v4 tool">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/tools">Free tools</Link>
        <span aria-hidden>›</span>
        <span aria-current="page">{title}</span>
      </nav>
      <header className="v4-hero">
        <div>
          <h1>{title}</h1>
          <p className="lead">{lead}</p>
        </div>
        {mine.length ? (
          <div className={`hero-logos n${mine.length}`} aria-hidden>
            {mine.map((id) => (
              <img key={id} className="logo" src={`/logos/${id}.png`} alt="" width={104} height={104} />
            ))}
          </div>
        ) : null}
      </header>
      <div className={raw ? 'tk-raw' : `tk${wide ? ' wide' : ''}`}>{children}</div>
      {how.length ? (
        <section className="v4-sec" aria-labelledby="how">
          <h2 id="how">How it works</h2>
          <ol className="steps3">
            {how.map((x, i) => (
              <li key={i}>
                <span className="n" aria-hidden>
                  {i + 1}
                </span>
                <span>{x}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      {good.length ? (
        <section className="v4-sec" aria-labelledby="good">
          <h2 id="good">Good to know</h2>
          <ul className="good">
            {good.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {extra}
      {faq.length ? (
        <section className="v4-sec" aria-labelledby="faq">
          <h2 id="faq">Questions</h2>
          <div className="faq2">
            {faq.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {sources.length ? (
        <p className="srcline">
          Sources:{' '}
          {sources.map((u, i) => (
            <span key={u}>
              {i ? ' · ' : ''}
              <a href={u} rel="noopener">
                {u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </a>
            </span>
          ))}
        </p>
      ) : null}
      <section className="v4-cta" aria-labelledby="tool-cta-h" data-has-cta>
        <img src="/duck.webp" alt="" width={96} height={56} className="duck" />
        <div>
          <h2 id="tool-cta-h">{cta ?? 'Get a reminder before every charge'}</h2>
          <p>3 days and 1 day before each renewal. Free iPhone app, coming soon.</p>
        </div>
        <EmailBox source={`tool-${slug.split('/').pop()}`} bare />
      </section>
      <section className="v4-sec" aria-labelledby="more-tools">
        <h2 id="more-tools">More free tools</h2>
        <div className="tgrid">
          {others.map((t) => (
            <ToolCard key={t.href} item={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
