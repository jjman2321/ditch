import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EmailBox } from '@/components/EmailBox';
import { Logo } from '@/components/Logo';
import { PriceTable } from '@/components/PriceTable';
import { AfterTimeline, ApplePath, ReadyChips, StatementDiagram } from '@/components/GuideVisuals';
import { APPLE_SOURCE, formatDate, freshness, guideById, neighbours, priceFor, priceHubServices, pubDates, publicNotes, publishedGuides, serviceById, idOf, shortHost, slugOf } from '@/lib/data';
import { COMPANY, SITE, SUPPORT_EMAIL } from '@/lib/site';

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id}>
      {children}
      <a className="anchor" href={`#${id}`} aria-label="Link to this section">
        #
      </a>
    </h2>
  );
}

export function generateStaticParams() {
  return publishedGuides().map((g) => ({ slug: slugOf(g.id) }));
}

function shortUrl(url: string) {
  const u = new URL(url);
  const path = u.pathname.replace(/\/$/, '');
  return `${u.hostname.replace(/^www\./, '')}${path.length > 28 ? '/…' : path}`;
}

/** The short answer: hand-written per guide, plus where and when it was checked (for people and AI answers). */
function answer(g: { answer?: string; steps: string[]; name: string; checkedOn: string; source: string }) {
  const base = g.answer ?? `${g.steps.join('. ')}.`;
  return `${base} Checked ${formatDate(g.checkedOn)}.`;
}

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export async function generateMetadata({ params }: PageProps<'/cancel/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const id = idOf(slug);
  const g = id ? guideById(id) : undefined;
  if (!g) return {};
  const desc = answer(g);
  return {
    title: `How to cancel ${g.name} in ${g.checkedOn.slice(0, 4)}: official steps`,
    description: desc.length > 158 ? `${desc.slice(0, 155).replace(/\s+\S*$/, '')}…` : desc,
    alternates: { canonical: `/cancel/${slugOf(g.id)}` },
    openGraph: { title: `How to cancel ${g.name}`, url: `/cancel/${slugOf(g.id)}`, type: 'article', siteName: 'Ditch: Subscription Tracker', locale: 'en_US', images: [{ url: '/og/cancel.png', width: 1200, height: 630, alt: 'How to cancel any subscription' }] },
    twitter: { card: 'summary_large_image', images: ['/og/cancel.png'] },
    robots: freshness(g.checkedOn) === 'expired' ? { index: false } : undefined,
  };
}

export default async function CancelGuide({ params }: PageProps<'/cancel/[slug]'>) {
  const { slug } = await params;
  const id = idOf(slug);
  const g = id ? guideById(id) : undefined;
  if (!g) notFound();
  const s = serviceById(g.id);
  const notes = publicNotes(g.note);
  const otherNotes = g.tips ?? notes;
  const partnerText = g.partner;
  const app = g.app ?? g.name;
  const company = g.company ?? g.name;
  const fresh = freshness(g.checkedOn);
  const us = priceFor(g.id, 'US');
  const sameCat = publishedGuides().filter((x) => serviceById(x.id)?.category === s?.category);
  const picked = (g.related ?? []).map((id) => guideById(id)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const related = picked.length ? picked.slice(0, 4) : neighbours(sameCat, g.id, 4);
  const more = related.length < 4 ? publishedGuides().filter((x) => x.id !== g.id && !related.includes(x)).slice(0, 4 - related.length) : [];
  const appleOnly = g.url?.startsWith('https://apps.apple.com');
  const hasHub = priceHubServices().some((x) => x.id === g.id);
  const ans = answer(g);
  const showApple = !appleOnly && g.appleBilling !== false;
  const year = g.checkedOn.slice(0, 4);

  const d = g.depth;
  const after = [
    ...(d?.after?.access ? [{ label: 'Until your next bill', ...d.after.access }] : []),
    ...(d?.after?.data ? [{ label: 'What stays', ...d.after.data }] : []),
    ...(d?.after?.refunds ? [{ label: 'Refunds', ...d.after.refunds }] : []),
  ];
  const faq = d?.faq ?? [];
  const toc = [
    { id: 'direct', label: appleOnly ? 'Cancel on iPhone' : `Cancel with ${g.name}` },
    ...(showApple ? [{ id: 'apple', label: 'If Apple bills you' }] : []),
    ...(d?.googlePlay ? [{ id: 'google', label: 'If Google Play bills you' }] : []),
    { id: 'partner', label: 'No cancel button?' },
    ...(d?.verify ? [{ id: 'check', label: 'Check it worked' }] : []),
    ...(after.length ? [{ id: 'after', label: 'After you cancel' }] : []),
    ...(d?.pause ? [{ id: 'pause', label: 'Not sure yet?' }] : []),
    ...(faq.length ? [{ id: 'faq', label: 'Questions' }] : []),
    ...(us ? [{ id: 'price', label: `What ${g.name} costs` }] : []),
  ];
  const src = (u: string) => (
    <a className="src" href={u} rel="noopener">
      {shortHost(u)}
    </a>
  );

  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `How to cancel ${g.name}`,
      description: ans,
      ...pubDates(g.checkedOn),
      author: { '@type': 'Organization', '@id': `${SITE}/#org`, name: COMPANY, url: SITE },
      publisher: { '@type': 'Organization', name: COMPANY, url: SITE },
      mainEntityOfPage: `${SITE}/cancel/${slugOf(g.id)}`,
      citation: [g.source, ...(appleOnly || !g.appleNote ? [] : [APPLE_SOURCE])],
      about: { '@type': 'Thing', name: g.name },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Cancel guides', item: `${SITE}/cancel` },
        { '@type': 'ListItem', position: 3, name: g.name, item: `${SITE}/cancel/${slugOf(g.id)}` },
      ],
    },
    ...(faq.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : []),
  ];

  return (
    <div className="wrap guide">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/" prefetch={false}>Home</Link>
        <span aria-hidden>›</span>
        <Link href="/cancel">Cancel guides</Link>
        <span aria-hidden>›</span>
        <span aria-current="page">{g.name}</span>
      </nav>
      <div className="art">
        <article>
          <header className="g-head">
            <Logo id={g.id} size={56} />
            <h1>How to cancel {g.name}</h1>
            <p className="g-meta">
              Checked <time dateTime={g.checkedOn}>{formatDate(g.checkedOn)}</time> · {d?.sourceLabel ? <a className="src" href={g.source} rel="noopener">{d.sourceLabel}</a> : src(g.source)}
            </p>
          </header>
          {fresh !== 'fresh' ? <p className="stale">Last checked {formatDate(g.checkedOn)}. {g.name} may have changed its steps since. We re-check every 90 days.</p> : null}

          <p className="g-lead">{g.answer ?? `${g.steps.join('. ')}.`}</p>
          <div className="g-acts">
            {g.url ? (
              <a className="btn" href={g.url} rel="noopener">
                {appleOnly ? 'Open your Apple subscriptions ↗' : (g.urlLabel ?? (g.name.length > 14 ? 'Open the cancel page ↗' : `Open ${g.name}’s cancel page ↗`))}
              </a>
            ) : g.helpUrl ? (
              <a className="btn" href={g.helpUrl} rel="noopener">
                Open {company}’s help page ↗
              </a>
            ) : (
              <a className="btn" href="#direct">
                Jump to the steps ↓
              </a>
            )}
            {g.url ? <span className="g-url">{appleOnly ? 'Opens the App Store' : shortUrl(g.url)}</span> : null}
          </div>

          <StatementDiagram name={g.name} apple={showApple} google={Boolean(d?.googlePlay)} appleOnly={appleOnly} />

          <H2 id="ready">Have this ready</H2>
          <ReadyChips email={appleOnly ? 'Your Apple Account sign-in' : `The email you use for ${g.name}`} />

          <H2 id="direct">{appleOnly ? 'Cancel on your iPhone' : `Cancel with ${g.name}`}</H2>
          <ol className="olist">
            {g.steps.map((st) => (
              <li key={st}>{st}</li>
            ))}
          </ol>
          {otherNotes.length ? (
            <div className="callout">
              <span className="lbl">Good to know</span>
              {otherNotes.map((n) => (
                <p key={n}>{n}</p>
              ))}
            </div>
          ) : null}

          {!showApple ? null : (
            <>
              <H2 id="apple">If Apple bills you</H2>
              <p>
                {g.appleNote
                  ? `If you signed up in the ${app} iPhone app, Apple bills you, and ${company} can’t cancel it for you. Cancel on your iPhone:`
                  : notes.some((n) => /apple/i.test(n))
                    ? `Signed up through Apple? Cancel on your iPhone:`
                    : `${g.name} doesn’t mention Apple billing, but if you see APPLE.COM/BILL on your statement, cancel on your iPhone:`}
              </p>
              <ApplePath name={g.name} />
              <p className="g-src">From {src(APPLE_SOURCE)}</p>
            </>
          )}

          {d?.googlePlay ? (
            <>
              <H2 id="google">If Google Play bills you</H2>
              <ol className="olist">
                {d.googlePlay.steps.map((st) => (
                  <li key={st}>{st}</li>
                ))}
              </ol>
              <p className="g-src">From {src(d.googlePlay.source)}</p>
            </>
          ) : null}

          <H2 id="partner">No cancel button?</H2>
          <p>{partnerText ?? `Then ${company} probably isn’t billing you directly. Look for the company named on your bank statement and cancel with them.`}</p>

          {d?.verify ? (
            <>
              <H2 id="check">How to check it worked</H2>
              <p>
                {cap(d.verify.text.replace(/^How to check it worked:\s*/i, ''))} <span className="g-src">From {src(d.verify.source)}</span>
              </p>
            </>
          ) : null}

          {after.length ? (
            <>
              <H2 id="after">What happens after you cancel</H2>
              <AfterTimeline items={after} src={src} />
            </>
          ) : null}

          {d?.pause ? (
            <>
              <H2 id="pause">Not sure yet?</H2>
              <p>
                {d.pause.text} <span className="g-src">From {src(d.pause.source)}</span>
              </p>
            </>
          ) : null}

          {faq.length ? (
            <>
              <H2 id="faq">Questions</H2>
              <div className="g-faq">
                {faq.map((f, n) => (
                  <details key={f.q} open={n === 0}>
                    <summary>
                      <h3>{f.q}</h3>
                      <span className="pm" aria-hidden />
                    </summary>
                    <p>
                      {f.a}
                      <span className="g-src">From {src(f.source)}</span>
                    </p>
                  </details>
                ))}
              </div>
            </>
          ) : null}

          {us ? (
            <>
              <H2 id="price">What {g.name} costs</H2>
              <PriceTable serviceId={g.id} countries={['US']} caption={`${g.name} prices in the US`} />
              {hasHub ? (
                <p className="g-src">
                  <Link href={`/prices/${slugOf(g.id)}`}>{g.name} prices in every country we check →</Link>
                </p>
              ) : null}
            </>
          ) : null}

          <section className="appcard" id="remind" aria-labelledby="remind-h" data-has-cta>
            <h2 id="remind-h" className="h3">
              Keeping {g.name} for now?
            </h2>
            <p>Ditch reminds you 3 days and 1 day before it renews, so you decide before the charge, not after. You still cancel on {company}’s own page.</p>
            <EmailBox source={`cancel-${g.id}`} bare />
          </section>

          <p className="g-feedback">
            <b>Did this work?</b> <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${g.name} guide: it worked`)}`}>Yes, it worked</a>
            {' · '}
            <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${g.name} guide: something changed`)}&body=${encodeURIComponent('What did you see instead?\n\n')}`}>No, something changed</a>
            <span className="g-hint">Opens your email app.</span>
          </p>

          <h2 id="more" className="g-more-h">Cancel something else</h2>
          <ul className="g-related">
            {[...related, ...more].map((r) => (
              <li key={r.id}>
                <Link href={`/cancel/${slugOf(r.id)}`}>
                  <Logo id={r.id} size={28} />
                  Cancel {r.name}
                </Link>
              </li>
            ))}
          </ul>

          <p className="disc">
            {g.name} is a trademark of its owner. Ditch isn’t affiliated with or endorsed by {g.name}. <Link href="/how-we-check">How we check guides</Link>. <span className="nw">© {year} {COMPANY}.</span>
          </p>
        </article>
        <aside>
          <nav className="side-toc" aria-label="On this page">
            <p className="ttl">On this page</p>
            {toc.map((t) => (
              <a key={t.id} href={`#${t.id}`}>
                {t.label}
              </a>
            ))}
          </nav>
          <a className="side-cta" href="#remind">
            Get a reminder before {g.name} renews →
          </a>
        </aside>
      </div>
    </div>
  );
}
