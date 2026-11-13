import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EmailBox } from '@/components/EmailBox';
import { Logo } from '@/components/Logo';
import { ToolCard } from '@/components/ToolCard';
import { toolsFor } from '@/lib/tools';
import { PriceTable } from '@/components/PriceTable';
import { ReadyChips } from '@/components/GuideVisuals';
import { APPLE_SOURCE, formatDate, freshness, guideById, neighbours, priceFor, priceHubServices, pubDates, publicNotes, publishedGuides, serviceById, idOf, slugOf } from '@/lib/data';
import { COMPANY, SITE, SUPPORT_EMAIL } from '@/lib/site';


export function generateStaticParams() {
  return publishedGuides().map((g) => ({ slug: slugOf(g.id) }));
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
  const related = picked.length ? picked.slice(0, 6) : neighbours(sameCat, g.id, 6);
  const more = related.length < 6 ? publishedGuides().filter((x) => x.id !== g.id && !related.includes(x)).slice(0, 6 - related.length) : [];
  const appleOnly = g.url?.startsWith('https://apps.apple.com');
  const hasHub = priceHubServices().some((x) => x.id === g.id);
  const ans = answer(g);
  const showApple = !appleOnly && g.appleBilling !== false;
  const year = g.checkedOn.slice(0, 4);

  const d = g.depth;
  const after = [
    ...(d?.after?.access ? [{ label: 'Your access', ...d.after.access }] : []),
    ...(d?.after?.data ? [{ label: 'Your stuff', ...d.after.data }] : []),
    ...(d?.after?.refunds ? [{ label: 'Refunds', ...d.after.refunds }] : []),
  ];
  const faq = d?.faq ?? [];

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

  const ways = [
    { id: 'direct', icon: <Logo id={g.id} size={40} />, title: appleOnly ? 'On your iPhone' : `On ${g.name}’s website`, line: g.steps.slice(1).map((x) => x.replace(/^Tap /, '')).join(' → ') || g.steps[0], primary: true },
    ...(showApple ? [{ id: 'apple', icon: <AppleMark />, title: 'Through Apple', line: 'Your statement says APPLE.COM/BILL. Cancel in iPhone Settings.', primary: false }] : []),
    ...(d?.googlePlay ? [{ id: 'google', icon: <PlayMark />, title: 'Through Google Play', line: 'Google Play → Subscriptions → ' + g.name + ' → Cancel.', primary: false }] : []),
    { id: 'partner', icon: <BarsMark />, title: 'Your phone or TV company', line: 'No cancel option? Someone else bills you. Cancel with them.', primary: false },
  ];
  const mainHref = g.url ?? g.helpUrl ?? '#direct';
  const mainLabel = appleOnly ? 'Open Subscriptions ↗' : g.url ? (g.urlLabel ?? (g.name.length > 12 ? 'Open the cancel page ↗' : `Open ${g.name}’s page ↗`)) : g.helpUrl ? 'Open the help page ↗' : 'See the steps ↓';

  const toc = [
    { id: 'direct', label: appleOnly ? 'On your iPhone' : 'On the website' },
    ...(showApple ? [{ id: 'apple', label: 'If Apple bills you' }] : []),
    ...(d?.googlePlay ? [{ id: 'google', label: 'On Android' }] : []),
    { id: 'partner', label: 'No cancel button?' },
    ...(d?.verify ? [{ id: 'check', label: 'Check you cancelled' }] : []),
    ...(after.length ? [{ id: 'after', label: 'What happens after' }] : []),
    ...(d?.pause ? [{ id: 'pause', label: 'Pause instead' }] : []),
    ...(faq.length ? [{ id: 'faq', label: 'Questions' }] : []),
    ...(us ? [{ id: 'price', label: `What ${g.name} costs` }] : []),
  ];
  const quick = g.answer ?? `${g.steps.join('. ')}.`;

  return (
    <div className="wrap gv3 v4 guide4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/cancel">Cancel guides</Link>
        <span aria-hidden>›</span>
        <span aria-current="page">{g.name}</span>
      </nav>
      <div className="g4">
        <article className="g4-main">
          <div className="kick">
            <Logo id={g.id} size={40} />
            <span>
              Checked <time dateTime={g.checkedOn}>{formatDate(g.checkedOn)}</time>
            </span>
          </div>
          <h1>How to cancel {g.name}</h1>
          <p className="lead">{quick}</p>
          {fresh !== 'fresh' ? <p className="stale">Last checked {formatDate(g.checkedOn)}. {g.name} may have changed its steps since. We re-check every 90 days.</p> : null}

          <h2 id="ways" className="sr">Pick how you pay</h2>
          <ul className={`ways4 n${ways.length}`}>
            {ways.map((w) => (
              <li key={w.id} className={w.primary ? 'on' : undefined}>
                <span className="w-top">
                  <span className="ic">{w.icon}</span>
                  <h3>{w.title}</h3>
                </span>
                <p>{w.line}</p>
                {w.primary ? (
                  <a className="btn" href={mainHref} rel={mainHref.startsWith('http') ? 'noopener' : undefined}>
                    {mainLabel}
                  </a>
                ) : (
                  <a className="w-go" href={`#${w.id}`}>
                    Show me how <span aria-hidden>↓</span>
                  </a>
                )}
              </li>
            ))}
          </ul>

          <section className="v4-sec" aria-labelledby="ready">
            <h2 id="ready">Have this ready</h2>
            <ReadyChips email={appleOnly ? 'Your Apple Account sign-in' : `The email you use for ${g.name}`} />
          </section>

          <section className="v4-sec" aria-labelledby="direct">
            <h2 id="direct">{appleOnly ? `Cancel ${g.name} on your iPhone` : `How to cancel ${g.name} on the website`}</h2>
            <ol className="st">
              {g.steps.map((st) => (
                <li key={st}>
                  <span>{keys(st)}</span>
                </li>
              ))}
            </ol>
            {otherNotes.length ? (
              <div className="tip">
                {otherNotes.map((n) => (
                  <p key={n}>{n}</p>
                ))}
              </div>
            ) : null}
          </section>

          {showApple ? (
            <section className="v4-sec" aria-labelledby="apple">
              <h2 id="apple">How to cancel {g.name} if Apple bills you</h2>
              <p className="lead-s">
                {g.appleNote ? `If you signed up in the ${app} iPhone app, Apple bills you, and ${company} can’t cancel it for you.` : `Signed up in the iPhone app? Then Apple may bill you. Your statement says APPLE.COM/BILL.`}
              </p>
              <ol className="st">
                <li>
                  <span>Open <kbd>Settings</kbd> on your iPhone.</span>
                </li>
                <li>
                  <span>Tap your name, then <kbd>Subscriptions</kbd>.</span>
                </li>
                <li>
                  <span>Tap {g.name}, then <kbd>Cancel Subscription</kbd>.</span>
                </li>
              </ol>
            </section>
          ) : null}

          {d?.googlePlay ? (
            <section className="v4-sec" aria-labelledby="google">
              <h2 id="google">How to cancel {g.name} on Android (Google Play)</h2>
              <ol className="st">
                {d.googlePlay.steps.map((st) => (
                  <li key={st}>
                    <span>{keys(st)}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section className="v4-sec" aria-labelledby="partner">
            <h2 id="partner">No cancel button? Your phone or TV company may bill you</h2>
            <p className="lead-s">{partnerText ?? `Then ${company} probably isn’t billing you directly. Look for the company named on your bank statement and cancel with them.`}</p>
          </section>

          {d?.verify ? (
            <section className="v4-sec" aria-labelledby="check">
              <h2 id="check">How to check you cancelled {g.name}</h2>
              <p className="lead-s">{cap(d.verify.text.replace(/^How to check it worked:\s*/i, ''))}</p>
            </section>
          ) : null}

          {after.length ? (
            <section className="v4-sec" aria-labelledby="after">
              <h2 id="after">What happens after you cancel {g.name}</h2>
              <dl className="after">
                {after.map((x) => (
                  <div key={x.label}>
                    <dt>{x.label}</dt>
                    <dd>{x.text}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {d?.pause ? (
            <section className="v4-sec" aria-labelledby="pause">
              <h2 id="pause">Not sure yet? Pause instead</h2>
              <p className="lead-s">{d.pause.text}</p>
            </section>
          ) : null}

          {faq.length ? (
            <section className="v4-sec" aria-labelledby="faq">
              <h2 id="faq">{g.name} cancellation questions</h2>
              <div className="qa">
                {faq.map((f) => (
                  <div key={f.q}>
                    <h3>{f.q}</h3>
                    <p>{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {us ? (
            <section className="v4-sec" aria-labelledby="price">
              <h2 id="price">What {g.name} costs</h2>
              <PriceTable serviceId={g.id} countries={['US']} caption={`${g.name} prices in the US`} />
              {hasHub ? (
                <p className="src">
                  <Link href={`/prices/${slugOf(g.id)}`}>{g.name} prices in every country we check →</Link>
                </p>
              ) : null}
            </section>
          ) : null}

          <p className="g-feedback">
            <b>Did this work?</b> <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${g.name} guide: it worked`)}`}>Yes, it worked</a>
            {' · '}
            <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${g.name} guide: something changed`)}&body=${encodeURIComponent('What did you see instead?\n\n')}`}>No, something changed</a>
          </p>
        </article>

        <aside className="g4-side" aria-label="Quick answer">
          <div className="g4-stick">
            <div className="qa-card">
              <p className="k">{ways[0].title}</p>
              <p>{ways[0].line}</p>
              <a className="btn" href={mainHref} rel={mainHref.startsWith('http') ? 'noopener' : undefined}>
                {mainLabel}
              </a>
            </div>
            <nav className="toc4" aria-label="On this page">
              <p className="k">On this page</p>
              {toc.map((x) => (
                <a key={x.id} href={`#${x.id}`}>
                  {x.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>

      <section className="v4-cta" id="remind" aria-labelledby="remind-h" data-has-cta>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/duck.webp" alt="" width={96} height={56} className="duck" />
        <div>
          <h2 id="remind-h">Keeping {g.name} for now?</h2>
          <p>Ditch reminds you 3 days and 1 day before it renews, so you decide before the charge.</p>
        </div>
        <EmailBox source={`cancel-${g.id}`} bare />
      </section>

      <section className="v4-sec" aria-labelledby="more">
        <h2 id="more">Cancel something else</h2>
        <div className="tgrid">
          {toolsFor(g.id).slice(0, 2).map((t) => (
            <ToolCard key={t.href} item={t} />
          ))}
          {[...related, ...more].slice(0, 6 - toolsFor(g.id).slice(0, 2).length).map((r) => (
            <Link key={r.id} className="tcard" href={`/cancel/${slugOf(r.id)}`}>
              <Logo id={r.id} size={44} />
              <span>
                <b>Cancel {r.name}</b>
                <small>Official steps, dated</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="g4-foot" aria-labelledby="sources">
        <h2 id="sources" className="srcs-h">Sources</h2>
        <ul className="srcs">
          {[...new Set([g.source, ...(showApple ? [APPLE_SOURCE] : []), ...(d?.googlePlay ? [d.googlePlay.source] : []), ...(d?.verify ? [d.verify.source] : []), ...after.map((x) => x.source), ...(d?.pause ? [d.pause.source] : []), ...faq.map((f) => f.source)])].map((u) => (
            <li key={u}>
              <a href={u} rel="noopener">
                {u.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </li>
          ))}
        </ul>
        <p className="disc">
          {g.name} is a trademark of its owner. Ditch isn’t affiliated with or endorsed by {g.name}. <Link href="/how-we-check">How we check guides</Link>. <span className="nw">© {year} {COMPANY}.</span>
        </p>
      </section>
    </div>
  );
}

/** "Tap Manage your plan" → Tap [Manage your plan]; web addresses in bold. Same words, easier to scan. */
function keys(step: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /(\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|tv|co|app|org)(?:\/[^\s,]*)?)|((?:Tap|tap|then|select|Select|choose|Choose) )((?:[A-Z][\w’'+-]*)(?: (?:[A-Z][\w’'+-]*|(?:your|the|my|plan|subscription|membership|account)\b))*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(step))) {
    if (m.index > last) parts.push(step.slice(last, m.index));
    if (m[1]) parts.push(<b key={k++}>{m[1]}</b>);
    else {
      parts.push(m[2]);
      const label = m[3];
      parts.push(<kbd key={k++}>{label}</kbd>);
      parts.push(m[3].slice(label.length));
    }
    last = m.index + m[0].length;
  }
  if (last < step.length) parts.push(step.slice(last));
  return parts;
}

function AppleMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M16.5 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.7zM14.2 5.6c.6-.8 1.1-1.8 1-2.9-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.7-1.3z" fill="currentColor" />
    </svg>
  );
}
function PlayMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path d="M5 3.5v17l14-8.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function BarsMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 18h2M9 18v-4M14 18v-8M19 18V6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
