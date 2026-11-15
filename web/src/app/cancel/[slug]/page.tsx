import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EmailBox } from '@/components/EmailBox';
import { Logo } from '@/components/Logo';
import { ToolCard } from '@/components/ToolCard';
import { toolsFor } from '@/lib/tools';
import { PriceTable } from '@/components/PriceTable';
import { GuideFeedback } from '@/components/guide/GuideFeedback';
import { PayTabs, type PayTab } from '@/components/guide/PayTabs';
import { StepArt, stepUrl, tapLabel } from '@/components/guide/StepArt';
import { APPLE_SOURCE, formatDate, freshness, guideById, neighbours, priceFor, priceHubServices, pubDates, publicNotes, publishedGuides, serviceById, idOf, slugOf } from '@/lib/data';
import { COMPANY, SITE, SUPPORT_EMAIL, pageTitle } from '@/lib/site';
import { JsonLd } from '@/components/JsonLd';


export function generateStaticParams() {
  return publishedGuides().map((g) => ({ slug: slugOf(g.id) }));
}


/** The short answer: hand-written per guide, plus where and when it was checked (for people and AI answers). */
function answer(g: { answer?: string; steps: string[]; name: string; checkedOn: string; source: string }) {
  const base = g.answer ?? `${g.steps.join('. ')}.`;
  return `${base} Checked ${formatDate(g.checkedOn)}.`;
}

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/**
 * Search title (owner, Nov 14: "10/10 Google titles"). People type "how to cancel X subscription", "…on iPhone",
 * "…on phone" (Google autocomplete, Nov 14), so the title names the ways this guide covers: website, the app,
 * iPhone (Apple billing), Android (Google Play). Names like "Kindle+ (Kindle Unlimited)" use the name people search.
 * Falls back to shorter forms so it stays within 60 characters.
 */
function guideTitle(g: NonNullable<ReturnType<typeof guideById>>) {
  const year = g.checkedOn.slice(0, 4);
  // Platform guides ("subscriptions on Android (Google Play)") keep their words; brand guides use the name people search.
  const platform = /^subscriptions on/i.test(g.name);
  const name = platform ? g.name.replace(/\s*\(.*\)/, '') : g.name.replace(/^.+?\s*\((.+)\)$/, '$1');
  if (platform) return pageTitle(`How to cancel ${name} (${year})`);
  const appleOnly = /^https:\/\/(apps|account)\.apple\.com/.test(g.url ?? '') || g.id === 'icloud' || g.id.startsWith('apple-');
  const webish = /safari|website|browser|\.(com|net|tv|co|org)\b|sign in at/i.test(g.steps[0] ?? '');
  const ways = [appleOnly ? 'iPhone' : webish ? 'web' : 'app', ...(!appleOnly && g.appleBilling !== false ? ['iPhone'] : []), ...(g.depth?.googlePlay ? ['Android'] : [])];
  const list = [...new Set(ways)];
  const what = /costco|uber-one|dashpass|doordash|instacart|walmart|amazon-prime/.test(g.id) ? 'membership' : 'subscription';
  // One way only: "How to cancel Costco membership (2026)" reads better than a one-word list.
  const tries = [...(list.length > 1 ? [`How to cancel ${name} (${year}): ${list.join(', ')}`] : []), `How to cancel ${name} ${what} (${year})`, `How to cancel ${name} (${year})`];
  return pageTitle(tries.find((t) => t.length <= 60) ?? tries[2]);
}

export async function generateMetadata({ params }: PageProps<'/cancel/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const id = idOf(slug);
  const g = id ? guideById(id) : undefined;
  if (!g) return {};
  const desc = answer(g);
  return {
    title: guideTitle(g),
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
  // Platform guides (iPhone, Google Play, PayPal, Amazon) cover every subscription billed there, not one brand.
  const platform = /^subscriptions on/i.test(g.name);
  const who = platform ? company : g.name;
  const fresh = freshness(g.checkedOn);
  const us = priceFor(g.id, 'US');
  const sameCat = publishedGuides().filter((x) => serviceById(x.id)?.category === s?.category);
  const picked = (g.related ?? []).map((id) => guideById(id)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const related = picked.length ? picked.slice(0, 6) : neighbours(sameCat, g.id, 6);
  const more = related.length < 6 ? publishedGuides().filter((x) => x.id !== g.id && !related.includes(x)).slice(0, 6 - related.length) : [];
  // Apple's own services (iCloud+, Apple One, Apple Music…) are always cancelled in iPhone Settings.
  const appleOnly = /^https:\/\/(apps|account)\.apple\.com/.test(g.url ?? '') || g.id === 'icloud' || g.id.startsWith('apple-');
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
  // Questions the page already answers in its own section are left out, so nothing reads twice.
  const faq = (d?.faq ?? []).filter(
    (f) =>
      !(d?.after?.refunds && /\brefund/i.test(f.q)) &&
      !(showApple && /\b(through|via|by) apple\b|apple bills/i.test(f.q)) &&
      !(d?.after?.data && /\b(profiles?|playlists?|library|data|stuff|come back)\b/i.test(f.q)),
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

  const quick = g.answer ?? `${g.steps.join('. ')}.`;
  const host = g.url ? g.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : undefined;
  const mainHref = g.url ?? g.helpUrl ?? '#how';
  const mainLabel = appleOnly ? (g.url ? 'Open Subscriptions ↗' : 'See the steps ↓') : g.url ? (g.urlLabel ?? (g.name.length > 12 ? 'Open the cancel page ↗' : `Open ${g.name}’s page ↗`)) : g.helpUrl ? 'Open the help page ↗' : 'See the steps ↓';
  // Is the main path a website or the service's own app?
  const webish = /safari|website|browser|\.(com|net|tv|co|org)\b|sign in at/i.test(g.steps[0] ?? '');
  const mainWhere = appleOnly ? 'phone' : webish ? 'web' : 'app';
  const brand = { serviceId: g.id, name: platform ? company : g.name.replace(/\s*\(.*\)/, ''), color: s?.color };
  const finalLabel = [...g.steps].reverse().map(tapLabel).find(Boolean) ?? null;

  const stepCards = (steps: { text: React.ReactNode; art: React.ReactNode }[]) => (
    <ol className="g5-steps">
      {steps.map((st, i) => (
        <li key={i}>
          {st.art}
          <div className="g5-st-tx">
            <span className="g5-n" aria-hidden>
              {i + 1}
            </span>
            <p>{st.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
  const tabs: PayTab[] = [
    {
      id: 'direct',
      label: mainWhere === 'phone' ? 'On your iPhone' : mainWhere === 'app' ? `In the ${app} app` : 'Website',
      hint: appleOnly ? 'Apple bills it' : `You pay ${who}`,
      icon: <Logo id={g.id} size={28} />,
      content: (
        <>
          <h2 className="g5-panel-h">{mainWhere === 'phone' ? `How to cancel ${g.name} on your iPhone` : mainWhere === 'app' ? `How to cancel ${g.name} in the ${app} app` : `How to cancel ${g.name} on the website`}</h2>
          {stepCards(g.steps.map((st) => ({ text: keys(st), art: <StepArt kind={mainWhere === 'web' ? 'web' : 'phone'} {...brand} label={tapLabel(st)} url={stepUrl(st) ?? host} title={mainWhere === 'app' ? `${app} app` : undefined} /> })))}
          {otherNotes.length ? (
            <div className="tip">
              {otherNotes.map((n) => (
                <p key={n}>{withPhones(n)}</p>
              ))}
            </div>
          ) : null}
          {mainHref.startsWith('http') ? (
            <a className="btn g5-panel-btn" href={mainHref} rel="noopener">
              {mainLabel}
            </a>
          ) : null}
        </>
      ),
    },
    ...(showApple
      ? [
          {
            id: 'apple',
            label: 'iPhone (Apple)',
            hint: 'APPLE.COM/BILL',
            icon: <PhoneMark />,
            content: (
              <>
                <h2 className="g5-panel-h">How to cancel {g.name} if Apple bills you</h2>
                <p className="lead-s">
                  {g.appleNote ? `If you signed up in the ${app} iPhone app, Apple bills you, and ${company} can’t cancel it for you.` : `Signed up in the iPhone app? Then Apple may bill you. Your statement says APPLE.COM/BILL.`}
                </p>
                {stepCards([
                  { text: <>Open <kbd>Settings</kbd> on your iPhone.</>, art: <StepArt kind="phone" {...brand} title="Home Screen" label="Settings" rows={['Settings', 'App Store', g.name]} /> },
                  { text: <>Tap your name, then <kbd>Subscriptions</kbd>.</>, art: <StepArt kind="phone" {...brand} title="Settings" label="Subscriptions" rows={['Your name', 'Subscriptions', 'Sign Out']} /> },
                  { text: <>Tap {g.name}, then <kbd>Cancel Subscription</kbd>.</>, art: <StepArt kind="phone" {...brand} title="Subscriptions" label="Cancel Subscription" rows={[g.name, 'Cancel Subscription']} /> },
                ])}
              </>
            ),
          },
        ]
      : []),
    ...(d?.googlePlay
      ? [
          {
            id: 'google',
            label: 'Google Play',
            hint: 'Android',
            icon: <PlayMark />,
            content: (
              <>
                <h2 className="g5-panel-h">How to cancel {g.name} on Android (Google Play)</h2>
                {stepCards(d.googlePlay.steps.map((st) => ({ text: keys(st), art: <StepArt kind="phone" {...brand} title="Google Play" label={tapLabel(st)} rows={tapLabel(st) ? ['Payments & subscriptions', 'Subscriptions', g.name].filter((r) => r !== tapLabel(st)).slice(0, 2) : []} /> })))}
              </>
            ),
          },
        ]
      : []),
    {
      id: 'partner',
      label: 'Other ways',
      hint: 'Phone, store or another company',
      icon: <BarsMark />,
      content: (
        <>
          <h2 className="g5-panel-h">Other ways to cancel {g.name}</h2>
          <div className="g5-partner">
            <p className="lead-s">{partnerText ?? `Then ${company} probably isn’t billing you directly. Look for the company named on your bank statement and cancel with them.`}</p>
            {!partnerText || /phone|tv|internet|carrier|bundle|partner/i.test(partnerText) ? (
            <div className="g5-bill" aria-hidden>
              <span className="g5-bill-h">Your bill</span>
              <span className="g5-bill-r">
                Internet <i />
              </span>
              <span className="g5-bill-r hit">
                {g.name} <i />
              </span>
              <span className="g5-bill-r">
                Phone line <i />
              </span>
            </div>
            ) : null}
          </div>
        </>
      ),
    },
  ];

  const facts = [
    ...(d?.verify ? [{ k: 'check', icon: '✓', label: 'Check it worked', text: cap(d.verify.text.replace(/^How to check it worked:\s*/i, '')) }] : []),
    ...after.map((x) => ({ k: x.label, icon: x.label === 'Your access' ? '◷' : x.label === 'Refunds' ? '↺' : '▤', label: x.label, text: x.text })),
  ];

  return (
    <div className="wrap gv3 v4 guide4 g5">
      <JsonLd data={ld} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/cancel">Cancel guides</Link>
        <span aria-hidden>›</span>
        <span aria-current="page">{g.name}</span>
      </nav>

      <header className="g5-hero">
        <div className="g5-hero-tx">
          <div className="kick">
            <Logo id={g.id} size={40} />
          </div>
          <h1>How to cancel {g.name}</h1>
          <p className="lead">{withPhones(quick)}</p>
          {fresh !== 'fresh' ? <p className="stale">Last checked {formatDate(g.checkedOn)}. {g.name} may have changed its steps since. We re-check every 90 days.</p> : null}
          <div className="g5-cta-row">
            <a className="btn" href={mainHref} rel={mainHref.startsWith('http') ? 'noopener' : undefined}>
              {mainLabel}
            </a>
            {mainHref !== '#how' ? (
              <a className="btn ghost" href="#how">
                See the steps ↓
              </a>
            ) : null}
          </div>
        </div>
        <div className="g5-hero-art" aria-hidden>
          <div className="g5-hero-card">
            <StepArt kind={mainWhere === 'web' ? 'web' : 'phone'} {...brand} label={finalLabel} url={g.url ? g.url.replace(/^https?:\/\/(www\.)?/, '') : host} title={mainWhere === 'web' ? 'Membership' : undefined} />
          </div>
        </div>
      </header>

      <nav className="g5-jump" aria-label="On this page">
        <a href="#how">Steps</a>
        {facts.length ? <a href="#after">After you cancel</a> : null}
        {d?.pause ? <a href="#pause">{/downgrad|smaller plan|switch to|cheaper plan|lower plan/i.test(d.pause.text) ? 'Downgrade' : 'Pause'}</a> : null}
        {faq.length ? <a href="#faq">Questions</a> : null}
        {us ? <a href="#price">Price</a> : null}
      </nav>

      <section className="v4-sec" id="how" aria-labelledby="how-h">
        <h2 id="how-h">{platform ? 'The steps' : <>How do you pay for {g.name}?</>}</h2>
        <p className="g5-sub">Where you cancel depends on who bills you. Pick one.</p>
        <PayTabs tabs={tabs} />
      </section>

      {facts.length ? (
        <section className="v4-sec" aria-labelledby="after">
          <h2 id="after">After you cancel {g.name}</h2>
          <div className="g5-facts">
            {facts.map((f) => (
              <div key={f.k} id={f.k === 'check' ? 'check' : undefined}>
                <span className="g5-f-ic" aria-hidden>
                  {f.icon}
                </span>
                <h3>{f.label}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {d?.pause || faq.length ? (
        <section className="v4-sec g5-two" aria-label="More help">
          {d?.pause ? (
            <div id="pause" className="g5-pause">
              <h2>{/downgrad|smaller plan|switch to|cheaper plan|lower plan/i.test(d.pause.text) ? 'Not sure yet? Downgrade instead' : 'Not sure yet? Pause instead'}</h2>
              <p>{d.pause.text}</p>
            </div>
          ) : null}
          {faq.length ? (
            <div id="faq">
              <h2>{g.name} cancellation questions</h2>
              <div className="qa">
                {faq.map((f) => (
                  <div key={f.q}>
                    <h3>{f.q}</h3>
                    <p>{withPhones(f.a)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
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

      <GuideFeedback name={g.name} email={SUPPORT_EMAIL} />

      <section className="v4-cta" id="remind" aria-labelledby="remind-h" data-has-cta>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/duck.webp" alt="" width={96} height={56} className="duck" />
        <div>
          <h2 id="remind-h">{platform ? 'Keeping some of them?' : <>Keeping {g.name} for now?</>}</h2>
          <p>Ditch reminds you 3 days and 1 day before it renews, so you decide before the charge.</p>
        </div>
        <EmailBox source={`cancel-${g.id}`} bare />
      </section>

      <section className="v4-sec" aria-labelledby="more">
        <h2 id="more">Related guides and tools</h2>
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
          Checked <time dateTime={g.checkedOn}>{formatDate(g.checkedOn)}</time> on {who}’s own pages. {who} is a trademark of its owner. Ditch isn’t affiliated with or endorsed by {who}. <Link href="/how-we-check">How we check guides</Link>. <span className="nw">© {year} {COMPANY}.</span>
        </p>
      </section>
    </div>
  );
}


/** US-style phone numbers in guide text become tap-to-call links (QA: Costco's number wasn't tappable). */
function withPhones(text: string): React.ReactNode {
  const parts = text.split(/(\b1-\d{3}-\d{3}-\d{4}\b)/);
  return parts.map((t, i) => (i % 2 ? <a key={i} className="nw" href={`tel:+${t.replace(/-/g, '')}`}>{t}</a> : t));
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

/** A plain phone outline (Apple doesn't allow its logo on other websites). */
function PhoneMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10.5 18.5h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
