import Link from 'next/link';

import { EmailBox } from './EmailBox';
import { SITE } from '@/lib/site';
import { TOOLS, SERVICE_TOOLS } from '@/lib/tools';

/**
 * One layout for every free tool (owner, Nov 13: clean, AnkiDecks-style, Google's people-first guidance):
 * short H1 → one line → the tool → how it works (3 steps) → good to know → 3 questions → sources → more tools → one CTA.
 * Everything a reader or Google needs is in the HTML; nothing is padded.
 */
export function ToolPage({ slug, title, lead, children, how = [], good = [], faq = [], sources = [], cta, extra }: { slug: string; title: string; lead: string; children: React.ReactNode; how?: React.ReactNode[]; good?: React.ReactNode[]; faq?: { q: string; a: string }[]; sources?: string[]; cta?: string; extra?: React.ReactNode }) {
  const all = [...TOOLS, ...SERVICE_TOOLS.map((t) => ({ slug: `tools/${t.slug}`, name: t.name }))];
  const others = all.filter((t) => t.slug !== slug).sort((a, b) => (a.slug.length % 7) - (b.slug.length % 7)).slice(0, 6);
  const ld = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: title, url: `${SITE}/${slug}`, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@id': `${SITE}/#org` } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Free tools', item: `${SITE}/tools` }, { '@type': 'ListItem', position: 2, name: title, item: `${SITE}/${slug}` }] },
    ...(faq.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : []),
  ];
  return (
    <div className="wrap gv3 tool">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <article className="gv3-col tool-col">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/tools">Free tools</Link>
          <span aria-hidden>›</span>
          <span aria-current="page">{title}</span>
        </nav>
        <h1>{title}</h1>
        <p className="sub">{lead}</p>
        <div className="tool-box">{children}</div>
        {how.length ? (
          <>
            <h2 id="how">How it works</h2>
            <ol className="st">
              {how.map((x, i) => (
                <li key={i}>
                  <span>{x}</span>
                </li>
              ))}
            </ol>
          </>
        ) : null}
        {good.length ? (
          <>
            <h2 id="good">Good to know</h2>
            <ul className="good">
              {good.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </>
        ) : null}
        {extra}
        {faq.length ? (
          <>
            <h2 id="faq">Questions</h2>
            <div className="qa">
              {faq.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </>
        ) : null}
        {sources.length ? (
          <p className="srcline">
            Sources:{' '}
            {sources.map((u, i) => (
              <span key={u}>
                {i ? ', ' : ''}
                <a href={u} rel="noopener">
                  {u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
              </span>
            ))}
          </p>
        ) : null}
        <section className="cta" aria-labelledby="tool-cta-h" data-has-cta>
          <h2 id="tool-cta-h">{cta ?? 'Get a reminder before every charge'}</h2>
          <p>Ditch reminds you 3 days and 1 day before each subscription renews. Free iPhone app, coming soon.</p>
          <EmailBox source={`tool-${slug.split('/').pop()}`} bare />
        </section>
        <h2 id="more-tools">More free tools</h2>
        <ul className="g-related">
          {others.map((t) => (
            <li key={t.slug}>
              <Link href={`/${t.slug}`}>{t.name}</Link>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
