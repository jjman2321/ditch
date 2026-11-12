import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EmailBox } from '@/components/EmailBox';
import { Logo } from '@/components/Logo';
import { Notif } from '@/components/Notif';
import { PriceTable } from '@/components/PriceTable';
import { APPLE_SOURCE, APPLE_STEPS, defaultPlan, formatDate, freshness, guideById, host, priceFor, publicNotes, publishedGuides, serviceById } from '@/lib/data';
import { formatMoney } from '@/lib/money';
import { AUTHOR, COMPANY, SITE, SUPPORT_EMAIL } from '@/lib/site';

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
  return publishedGuides().map((g) => ({ slug: g.id }));
}

function shortUrl(url: string) {
  const u = new URL(url);
  const path = u.pathname.replace(/\/$/, '');
  return `${u.hostname.replace(/^www\./, '')}${path.length > 28 ? '/…' : path}`;
}

function answer(steps: string[], apple: boolean) {
  const first = steps.map((s, i) => (i ? s.replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase()) : s).replace(/\.$/, '')).join(', then ');
  return `${first}.${apple ? ' Billed by Apple? Cancel in iPhone Settings instead.' : ''}`;
}

export async function generateMetadata({ params }: PageProps<'/cancel/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const g = guideById(slug);
  if (!g) return {};
  const desc = `${answer(g.steps, g.appleNote)} Checked ${formatDate(g.checkedOn)} on ${host(g.source)}.`;
  return {
    title: `How to cancel ${g.name} (${g.checkedOn.slice(0, 4)}): on iPhone and the web`,
    description: desc.length > 158 ? `${desc.slice(0, 155).replace(/\s+\S*$/, '')}…` : desc,
    alternates: { canonical: `/cancel/${g.id}` },
    openGraph: { title: `How to cancel ${g.name}`, url: `/cancel/${g.id}`, type: 'article' },
    robots: freshness(g.checkedOn) === 'expired' ? { index: false } : undefined,
  };
}

export default async function CancelGuide({ params }: PageProps<'/cancel/[slug]'>) {
  const { slug } = await params;
  const g = guideById(slug);
  if (!g) notFound();
  const s = serviceById(g.id);
  const notes = publicNotes(g.note);
  const partnerNotes = notes.filter((n) => /partner|third-party|carrier|provider|Roku|Google|Amazon|Verizon|T-Mobile|bundle/i.test(n));
  const otherNotes = notes.filter((n) => !partnerNotes.includes(n));
  const fresh = freshness(g.checkedOn);
  const us = priceFor(g.id, 'US');
  const usPlan = us ? defaultPlan(us) : null;
  const related = publishedGuides()
    .filter((x) => x.id !== g.id && serviceById(x.id)?.category === s?.category)
    .slice(0, 4);
  const more = related.length < 4 ? publishedGuides().filter((x) => x.id !== g.id && !related.includes(x)).slice(0, 4 - related.length) : [];
  const appleOnly = g.url?.startsWith('https://apps.apple.com');
  const ans = answer(g.steps, g.appleNote && !appleOnly);
  const year = g.checkedOn.slice(0, 4);

  const toc = [
    { id: 'direct', label: appleOnly ? 'Cancel on iPhone' : `Cancel with ${g.name}` },
    ...(appleOnly ? [] : [{ id: 'apple', label: 'If Apple bills you' }]),
    { id: 'partner', label: 'No cancel button?' },
    ...(us ? [{ id: 'price', label: `What ${g.name} costs` }] : []),
  ];

  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `How to cancel ${g.name}`,
      description: ans,
      datePublished: '2026-11-12',
      dateModified: g.checkedOn,
      author: { '@type': 'Person', name: AUTHOR.name, url: `${SITE}${AUTHOR.url}` },
      publisher: { '@type': 'Organization', name: COMPANY, url: SITE },
      mainEntityOfPage: `${SITE}/cancel/${g.id}`,
      citation: [g.source, ...(appleOnly || !g.appleNote ? [] : [APPLE_SOURCE])],
      about: { '@type': 'Thing', name: g.name },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Cancel guides', item: `${SITE}/cancel` },
        { '@type': 'ListItem', position: 3, name: g.name, item: `${SITE}/cancel/${g.id}` },
      ],
    },
  ];

  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden>›</span>
        <Link href="/cancel">Cancel guides</Link>
        <span aria-hidden>›</span>
        <span aria-current="page">{g.name}</span>
      </nav>
      <div className="art">
        <article>
          <div className="title-row">
            <Logo id={g.id} size={48} />
            {s?.category ? <span className="pill">{s.category}</span> : null}
          </div>
          <h1>How to cancel {g.name}</h1>
          <div className="metarow">
            <span className="pill ok">
              Steps checked <time dateTime={g.checkedOn}>{formatDate(g.checkedOn)}</time>
            </span>
            <span>
              on <a href={g.source} rel="noopener">{host(g.source)}</a> · By <Link href={AUTHOR.url}>{AUTHOR.name}</Link>
            </span>
          </div>
          {fresh !== 'fresh' ? <p className="stale">Last checked {formatDate(g.checkedOn)}. {g.name} may have changed its steps since. We re-check every 90 days.</p> : null}

          <div className="answer">
            <span className="lbl">Short answer</span>
            <p>{ans}</p>
            <div className="acts">
              {g.url ? (
                <a className="btn" href={g.url} rel="noopener">
                  Open {g.name}’s {appleOnly ? 'subscriptions page' : 'cancel page'} ↗
                </a>
              ) : null}
              <a className="btn ghost" href="#partner">
                No cancel button?
              </a>
            </div>
            {g.url ? <p className="url">{shortUrl(g.url)} · opens {appleOnly ? 'Apple’s' : `${g.name}’s`} site</p> : null}
          </div>

          <h2 id="how" style={{ marginTop: 48 }}>
            How do you pay for {g.name}?
          </h2>
          <nav className="how" aria-label="How you pay">
            <a href="#direct">{appleOnly ? 'Apple (iPhone)' : `${g.name} directly`}</a>
            {appleOnly ? null : <a href="#apple">Apple (in the iPhone app)</a>}
            <a href="#partner">Someone else (phone, TV…)</a>
          </nav>
          <p className="meta" style={{ marginTop: 10 }}>
            Not sure? Check your bank statement: <b>APPLE.COM/BILL</b> means Apple bills you.
          </p>

          <H2 id="ready">Have this ready</H2>
          <ul className="ticks" style={{ marginTop: 8 }}>
            <li>
              The email you use for {g.name}
              <span>Not sure which? Search your inbox for “{g.name}” receipts.</span>
            </li>
            <li>
              The last 4 digits of the card it charges
              <span>Handy if you have more than one account.</span>
            </li>
          </ul>

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

          {appleOnly ? null : (
            <>
              <H2 id="apple">If Apple bills you</H2>
              <p>
                {g.appleNote
                  ? `If you signed up in the ${g.name} iPhone app, Apple bills you, and ${g.name} can’t cancel it for you. Cancel on your iPhone:`
                  : `${g.name} doesn’t mention Apple billing, but if you see APPLE.COM/BILL on your statement, cancel on your iPhone:`}
              </p>
              <ol className="olist" style={{ marginTop: 14 }}>
                {APPLE_STEPS.map((st) => (
                  <li key={st}>{st}</li>
                ))}
              </ol>
              <p className="meta" style={{ marginTop: 10 }}>
                From <a href={APPLE_SOURCE} rel="noopener">Apple Support</a>. Cancel at least 24 hours before it renews.
              </p>
            </>
          )}

          <H2 id="partner">No cancel button?</H2>
          {partnerNotes.length ? (
            partnerNotes.map((n) => <p key={n}>{n}</p>)
          ) : (
            <p>Then {g.name} probably isn’t billing you directly. Look for the company named on your bank statement (a phone, TV or internet provider, Apple, Google or Amazon) and cancel with them.</p>
          )}

          <div className="appcard" data-has-cta>
            <div>
              <h2 className="h3" style={{ margin: 0 }}>
                Not ready to cancel?
              </h2>
              <p>Ditch reminds you 3 days and 1 day before {g.name} renews, so you can decide in time. It can’t cancel for you. It just makes sure you don’t forget.</p>
              <EmailBox source={`cancel-${g.id}`} cta="Join" compact />
            </div>
            {usPlan ? <Notif text={`${g.name} renews in 3 days. ${formatMoney(usPlan.amountMinor, 'USD')}. Still using it?`} /> : null}
          </div>

          {us ? (
            <>
              <H2 id="price">What {g.name} costs</H2>
              <PriceTable serviceId={g.id} countries={['US']} caption={`${g.name} prices in the US`} />
              <p className="meta" style={{ marginTop: 10 }}>
                <Link href={`/prices/${g.id}`}>{g.name} prices in every country we check →</Link>
              </p>
            </>
          ) : null}

          <div className="feedback">
            <b>Did this work?</b>
            <a className="btn sm ghost" href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${g.name} guide: it worked`)}`}>
              Yes, it worked
            </a>
            <a className="btn sm ghost" href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${g.name} guide: something changed`)}&body=${encodeURIComponent('What did you see instead?\n\n')}`}>
              No, something changed
            </a>
            <span className="meta">This opens your email app. We don’t track clicks.</span>
          </div>

          <h2 id="more">Cancel something else</h2>
          <div className="related">
            {[...related, ...more].map((r) => (
              <Link key={r.id} href={`/cancel/${r.id}`}>
                <Logo id={r.id} size={36} />
                {r.name}
              </Link>
            ))}
          </div>

          <p className="disc">
            Checked by hand on {formatDate(g.checkedOn)} from <a href={g.source} rel="noopener">{host(g.source)}</a>. {g.name} is a trademark of its owner. Ditch isn’t affiliated with or endorsed by {g.name}.{' '}
            <Link href="/how-we-check">How we check guides</Link>. © {year} {COMPANY}.
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
          <div className="side-card">
            <p className="h3">Get a reminder first</p>
            <p>3 days and 1 day before each charge. Free on 3 subscriptions.</p>
            <Link className="btn block sm" href="/#join">
              Join the waitlist
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
