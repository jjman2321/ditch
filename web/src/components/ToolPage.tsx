import Link from 'next/link';

import { EmailBox } from './EmailBox';
import { SITE } from '@/lib/site';
import { TOOLS } from '@/lib/tools';

/**
 * Shared layout for every free tool: crumbs, title, one-line answer, the tool, then written content
 * (how it works, a worked example, questions) so search engines and AI answers can read the result.
 */
export function ToolPage({ slug, title, lead, children, more, faq = [], cta }: { slug: string; title: string; lead: string; children: React.ReactNode; more?: React.ReactNode; faq?: { q: string; a: string }[]; cta?: string }) {
  const others = TOOLS.filter((t) => t.slug !== slug).slice(0, 6);
  const ld = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: title, url: `${SITE}/${slug}`, applicationCategory: 'FinanceApplication', operatingSystem: 'Any (runs in your browser)', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@id': `${SITE}/#org` } },
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
        <p className="kick-t">Free tool · Runs in your browser · Nothing is sent anywhere</p>
        <h1>{title}</h1>
        <p className="sub">{lead}</p>
        <div className="tool-box">{children}</div>
        {more}
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
        <section className="cta" aria-labelledby="tool-cta-h" data-has-cta>
          <h2 id="tool-cta-h">{cta ?? 'Never get surprised by a charge'}</h2>
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
