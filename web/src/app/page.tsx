/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { Calculator, type CalcService } from '@/components/Calculator';
import { AppBadges } from '@/components/AppBadges';
import { ScrollStory } from '@/components/ScrollStory';
import { EmailBox } from '@/components/EmailBox';
import { Notif } from '@/components/Notif';
import { DitchDemo } from '@/components/DitchDemo';
import { COUNTRIES, defaultPlan, formatDate, hasLogo, priceFor, serviceById, verifiedPrices } from '@/lib/data';
import { formatMoney } from '@/lib/money';
import { BRAND, COMPANY, PRO, PRO_MINOR, SITE, STATS, og } from '@/lib/site';
import { JsonLd } from '@/components/JsonLd';

const CALC_IDS = ['netflix', 'spotify', 'chatgpt-plus', 'amazon-prime', 'disney-plus', 'apple-music', 'youtube-premium', 'youtube-music', 'max', 'xbox-game-pass', 'claude-pro', 'microsoft-365', 'hulu', 'ps-plus', 'paramount-plus', 'peacock', 'google-one', 'audible'];

/** Hero rotation: only real services we have checked prices for. */
const HERO_ROTATION = [
  { id: 'netflix', name: 'Netflix' },
  { id: 'spotify', name: 'Spotify' },
  { id: 'chatgpt-plus', name: 'ChatGPT' },
  { id: 'disney-plus', name: 'Disney+' },
  { id: 'amazon-prime', name: 'Prime' },
];

const FAQ = [
  { q: 'Is Ditch free?', a: 'Yes. Tracking is free forever: your full list, your totals and the calendar, with no card and no account. Reminders are free on 3 subscriptions you pick. Pro adds reminders on all of them.' },
  { q: 'Why pay for a subscription tracker?', a: `Fair question. Pro is ${PRO.yearly} a year, about ${PRO.yearlyPerWeek} a week, with ${PRO.trialDays} days free first. In a 2025 CNET survey, Americans said they spend ${STATS.wasted.text} on ${STATS.wasted.on}. Rather not subscribe? Lifetime is ${PRO.lifetime}, once.` },
  { q: 'What’s the difference between Pro and Lifetime?', a: `Pro renews (${PRO.yearly} a year or ${PRO.weekly} a week). Lifetime is ${PRO.lifetime} once and never renews.` },
  { q: 'Can Ditch cancel subscriptions for me?', a: 'No. Ditch can’t, and it won’t pretend to. Ditch reminds you before each charge and opens the official cancel page, with the steps.' },
  { q: 'Do I need to link my bank?', a: 'No. You add what you pay for: tap the logos or type a name, and the price fills in for your country. Ditch never reads your bank or your email.' },
  { q: 'Do reminders work when the app is closed?', a: 'Yes. Reminders are set on your iPhone, so they arrive even when Ditch is closed. Opening it now and then keeps them topped up.' },
  { q: 'Can it remind me before a free trial ends?', a: 'Yes. Add the trial and its end date, and Ditch reminds you 3 days and 1 day before it turns into a charge.' },
  { q: 'Is my subscription list private?', a: 'Yes. Your list stays on your phone. No ads, no tracking, and we never sell anything about you. Pro payments go through Apple.' },
  { q: 'Which countries does Ditch work in?', a: 'Anywhere with the App Store. In the app, prices fill in for 12 countries, including the US, UK, Canada, Australia, much of Europe and India. Elsewhere you type the price in.' },
  { q: 'What happens if I stop paying for Pro?', a: 'Nothing gets deleted or hidden. Your list stays as it is, and reminders go back to 3.' },
  { q: 'How do I cancel Ditch Pro?', a: 'In iPhone Settings → your name → Subscriptions → Ditch. Cancel at least 24 hours before it renews.' },
  { q: 'Is Ditch on Android?', a: 'Not yet. Ditch is made for iPhone.' },
  { q: 'When does Ditch come out?', a: 'Soon. Join the waitlist and you get one email the day it’s on the App Store.' },
];

export const metadata = {
  alternates: { canonical: '/' }, openGraph: og('/'),
  title: { absolute: 'Free subscription tracker app for iPhone | Ditch' },
  description: 'Track every subscription free and get a reminder 3 days before a charge. No bank login, no account. For iPhone.',
};

export default function Home() {
  const calc: CalcService[] = CALC_IDS.flatMap((id) => {
    const s = serviceById(id);
    if (!s) return [];
    const prices: CalcService['prices'] = {};
    for (const r of verifiedPrices(id)) {
      const p = defaultPlan(r);
      prices[r.country] = { plan: p.name, amountMinor: p.amountMinor, cycle: p.cycle, currency: r.currency };
    }
    return [{ id, name: s.name, logo: hasLogo(id), prices }];
  });
  const calcCountries = COUNTRIES.map((c) => {
    const checked = CALC_IDS.map((id) => priceFor(id, c.code)?.checked).filter(Boolean).sort().pop();
    return { code: c.code, name: c.name, checked: checked ? formatDate(checked) : '' };
  });
  const nf = priceFor('netflix', 'US')!;
  const nfPlan = defaultPlan(nf);
  // Same badge as the app: yearly vs 52 weeks of Weekly ($59.99 vs $363.48 → 83%).
  const yearlySave = Math.floor((1 - PRO_MINOR.yearly / (PRO_MINOR.weekly * 52)) * 100);

  const org = { '@id': `${SITE}/#org` };
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE}/#org`,
      name: 'Ditch',
      legalName: COMPANY,
      url: SITE,
      logo: `${SITE}/icon.png`,
      email: 'support@ditchsubs.app',
      brand: { '@type': 'Brand', name: BRAND, alternateName: 'ditchsubs' },
    },
    { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE}/#site`, name: BRAND, alternateName: ['ditchsubs', 'Ditch Subscription Tracker'], url: SITE, publisher: org },
    {
      '@context': 'https://schema.org',
      '@type': 'MobileApplication',
      name: BRAND,
      alternateName: 'ditchsubs',
      operatingSystem: 'iOS',
      applicationCategory: 'FinanceApplication',
      description: 'An iPhone app that lists everything you pay for and reminds you 3 days and 1 day before each charge. Free forever for tracking. No bank login, no account.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: org,
    },
  ];

  return (
    <>
      <JsonLd data={ld} />

      {/* 1. Hero */}
      <section className="hero" aria-labelledby="hero-h">
        <div className="wrap grid">
          <div className="copy">
            {/* Screen readers and Google read "Ditch it before it renews." (the App Store subtitle). The logos are visual only. */}
            <p className="eyebrow">Free iPhone app · Coming soon</p>
            <h1 id="hero-h" className="d-h1">
              Ditch{' '}
              <span className="slot" aria-hidden="true">
                <span className="reel">
                  {HERO_ROTATION.map((r, i) => (
                    <span className="chip" key={i} data-n={r.name} style={{ ['--d' as string]: `${i * 3 - 0.6}s` }}>
                      <img src={`/logos/${r.id}.png`} alt="" width={64} height={64} fetchPriority={i === 0 ? undefined : 'low'} />
                    </span>
                  ))}
                </span>
              </span>
              <span className="sr">it </span>
              <br />
              before it renews.
            </h1>
            <p className="lead">Track every subscription free. Get a reminder 3 days before a charge.</p>
            <div id="join-form">
              <EmailBox source="home-hero" bare cta="Join the waitlist" />
            </div>
            <AppBadges className="hero-badges" />
          </div>
          <div className="stage" aria-hidden>
            <img className="float" width={64} height={64} fetchPriority="low" src="/logos/netflix.png" alt="" style={{ left: '4%', top: 70, transform: 'rotate(-6deg)' }} />
            <img className="float" width={64} height={64} fetchPriority="low" src="/logos/spotify.png" alt="" style={{ right: '2%', top: 36, transform: 'rotate(6deg)' }} />
            <img className="float" width={64} height={64} fetchPriority="low" src="/logos/chatgpt-plus.png" alt="" style={{ left: '0%', top: 300, transform: 'rotate(4deg)' }} />
            <img className="float" width={64} height={64} fetchPriority="low" src="/logos/disney-plus.png" alt="" style={{ right: '0%', top: 268, transform: 'rotate(-5deg)' }} />
            <div className="phone">
              <div className="scr">
                <div className="sbar">
                  <span>9:00</span>
                  <span className="sicons">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
                <div className="island" />
                <div className="lock">🔒</div>
                <div className="day">Wednesday, November 18</div>
                <div className="time">9:00</div>
                <Notif text={`Netflix renews in 3 days. ${formatMoney(nfPlan.amountMinor, 'USD')}. Still watching?`} style={{ top: 236 }} />
                <Notif className="second" when="Tue" text={`Spotify renews in 3 days. ${formatMoney(defaultPlan(priceFor('spotify', 'US')!).amountMinor, 'USD')}.`} style={{ top: 330 }} />
                <div className="lockbtns">
                  <span>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                      <path d="M7.5 2.5h9a1 1 0 011 1V6a1 1 0 01-.2.6L15 9.8V20a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 20V9.8L6.7 6.6a1 1 0 01-.2-.6V3.5a1 1 0 011-1z" />
                      <rect x="11" y="11.5" width="2" height="3.6" rx="1" fill="#2b2923" />
                    </svg>
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                      <path d="M9.2 4.5h5.6c.5 0 1 .3 1.3.7l1 1.6h1.9A2.5 2.5 0 0121.5 9.3v8.2a2.5 2.5 0 01-2.5 2.5H5a2.5 2.5 0 01-2.5-2.5V9.3A2.5 2.5 0 015 6.8h1.9l1-1.6c.3-.4.8-.7 1.3-.7zM12 9.3a4 4 0 100 8 4 4 0 000-8z" fillRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <img className="duck" src="/duck.webp" alt="" width={200} height={117} fetchPriority="low" />
          </div>
        </div>
      </section>


      {/* 2. The number */}
      <section className="sec" aria-labelledby="calc-h" data-has-cta>
        <div className="wrap">
          <div className="sec-head">
            <h2 id="calc-h" className="h2">
              See what your subscriptions cost in a year
            </h2>
            <p className="lead">Tap the ones you pay for. Prices fill in for your country, from each service’s own page.</p>
          </div>
          <div className="sec-body">
            <Calculator services={calc} countries={calcCountries} />
          </div>
        </div>
      </section>

      {/* 3. How it works */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="how-h">
        <div className="wrap">
          <div className="sec-head">
            <h2 id="how-h" className="h2">
              How it works: add it, get reminded, <span className="nw">ditch it</span>
            </h2>
          </div>
          <div className="sec-body">
            <ScrollStory
              steps={[
                {
                  title: 'Add your subscriptions',
                  body: 'Tap Netflix, Spotify, ChatGPT and the rest. The price fills in for your country. Anything else, type it in.',
                  screen: (
                <div className="mini-list" aria-hidden>
                  {['netflix', 'spotify', 'chatgpt-plus'].map((id) => {
                    const p = defaultPlan(priceFor(id, 'US')!);
                    return (
                      <div className="r" key={id}>
                        <img src={`/logos/${id}.png`} alt="" width={28} height={28} loading="lazy" />
                        {serviceById(id)!.name}
                        <span className="num">{formatMoney(p.amountMinor, 'USD')}</span>
                      </div>
                    );
                  })}
                </div>
                  ),
                },
                {
                  title: 'Get reminded before you pay',
                  body: 'A reminder 3 days and 1 day before each charge, at 9:00. Free trials too.',
                  screen: (
                <Notif text={`Spotify renews tomorrow. ${formatMoney(defaultPlan(priceFor('spotify', 'US')!).amountMinor, 'USD')}.`} when="9:00" />
                  ),
                },
                {
                  title: 'Cancel what you don’t use',
                  body: 'Hold to ditch, then cancel on the service’s own page with the steps right there.',
                  screen: (
                <div className="cpage" aria-hidden>
                  <span className="bar">netflix.com/cancelplan</span>
                  <p className="t">Cancel your membership?</p>
                  <p className="s">Your plan ends on Nov 18.</p>
                  <span className="b">Finish cancellation</span>
                </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 4. Reminders */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="rem-h">
        <div className="wrap split">
          <div>
            <h2 id="rem-h" className="h2">
              Reminders that actually arrive
            </h2>
            <p className="lead" style={{ marginTop: 20 }}>
              In our research, 38% said other trackers’ reminders never came. Ditch shows your next one, so you know it’s set.
            </p>
            <ul className="ticks">
              <li>
                3 days and 1 day before each charge<span>Or pick your own days with Pro.</span>
              </li>
              <li>
                Free trial alerts<span>Know before a trial turns into a charge.</span>
              </li>
              <li>
                Test it in 5 seconds<span>Send yourself a real reminder to check it works.</span>
              </li>
            </ul>
          </div>
          <div className="big-notif" aria-hidden data-reveal>
            <Notif text={`Netflix renews in 3 days. ${formatMoney(nfPlan.amountMinor, 'USD')}. Still watching?`} />
            <Notif text={`Your Spotify Premium trial ends tomorrow. Then ${formatMoney(defaultPlan(priceFor('spotify', 'US')!).amountMinor, 'USD')} a month.`} when="9:00" />
            <span className="next">Next reminder: Netflix · Fri 9:00</span>
          </div>
        </div>
      </section>

      {/* 3b. The ditch moment, with context */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="dd-h">
        <div className="wrap split">
          <div>
            <h2 id="dd-h" className="h2">
              Hold to ditch. See what you won’t pay this year.
            </h2>
            <p className="lead" style={{ marginTop: 20 }}>
              Once you’ve cancelled, Ditch shows what it would have cost you in a year.
            </p>
            <ul className="ticks">
              <li>
                Official links only<span>The service’s own cancel or help page, never a lookalike.</span>
              </li>
              <li>
                Steps from official pages<span>With the date we last checked them.</span>
              </li>
            </ul>
            <p style={{ marginTop: 20 }}>
              <Link href="/cancel">Browse all cancel guides →</Link>
            </p>
          </div>
          <DitchDemo name="Netflix" logo="/logos/netflix.png" meta={`${nfPlan.name} · ${formatMoney(nfPlan.amountMinor, 'USD')}/mo`} yearly={formatMoney(nfPlan.amountMinor * 12, 'USD')} />
        </div>
      </section>

      {/* 6. Price + lifetime (owner pick C): Free card, big Pro card with yearly and weekly (same plans as the app), Lifetime strip */}
      <section id="pricing" className="sec" style={{ paddingTop: 0 }} aria-labelledby="price-h" data-has-cta>
        <div className="wrap">
          <div className="price-head">
            <h2 id="price-h" className="h2">
              About $1 a week. Remember the renewals you’d forget.
            </h2>
            <p className="lead">Tracking is free forever. Pro puts reminders on every subscription. Rather not subscribe? Pay once.</p>
          </div>
          <div className="pg" data-reveal>
            <div className="pc-card pc-free">
              <h3 className="nm">Free</h3>
              <p className="desc">Track everything, forever.</p>
              <p className="amt num">$0</p>
              <p className="per">No card, no account.</p>
              <ul>
                <li>Every subscription in one list</li>
                <li>Totals, calendar and cancel guides</li>
                <li>Reminders on 3 you pick</li>
              </ul>
              <span className="push" />
              <Link className="btn ghost" href="/#join" prefetch={false}>
                Join the waitlist
              </Link>
            </div>
            <div className="pc-card pc-pro">
              <img className="pc-duck" src="/duck.webp" alt="" width={200} height={117} loading="lazy" />
              <h3 className="nm">Pro</h3>
              <p className="desc">Reminders on every subscription.</p>
              <div className="pc-opts">
                <div className="pc-opt on">
                  <span className="pc-badge">{PRO.trialDays} DAYS FREE</span>
                  <span className="pc-save">SAVE {yearlySave}%</span>
                  <p className="k">Yearly</p>
                  <p className="amt num">{PRO.yearly}</p>
                  <p className="per">
                    {PRO.yearlyPerWeek} a week
                  </p>
                </div>
                <div className="pc-opt">
                  <p className="k">Weekly</p>
                  <p className="amt num">{PRO.weekly}</p>
                  <p className="per">No free trial</p>
                </div>
              </div>
              <ul>
                <li>Everything in Free</li>
                <li>Reminders on all of them</li>
                <li>Pick your reminder days</li>
                <li>A last call the evening before</li>
              </ul>
              <span className="push" />
              <Link className="btn" href="/#join" prefetch={false}>
                Join the waitlist
              </Link>
            </div>
            <div className="pc-life">
              <p className="amt num">{PRO.lifetime}</p>
              <div className="t">
                <h3 className="lh">Lifetime. Pay once. No subscription.</h3>
                <span>Everything in Pro, and it never renews. For people who are done with subscriptions.</span>
              </div>
              <Link className="btn" href="/#join" prefetch={false}>
                Join the waitlist
              </Link>
            </div>
          </div>
          <p className="pc-foot">US prices. Your App Store shows your price before you pay. Cancel Pro anytime in iPhone Settings.</p>
        </div>
      </section>

      {/* 7. Trust */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="trust-h">
        <div className="wrap">
          <div className="sec-head">
            <h2 id="trust-h" className="h2">
              Private by design: <span className="nw">no bank login,</span> <span className="nw">no account</span>
            </h2>
          </div>
          <div className="sec-body dont">
            <div className="card">
              <h3 className="h3">Your list stays on your phone</h3>
              <p>You add what you pay for. Ditch never reads your bank or your email.</p>
            </div>
            <div className="card">
              <h3 className="h3">No ads, no tracking</h3>
              <p>We never sell anything about you. Payments go through Apple.</p>
            </div>
            <div className="card">
              <h3 className="h3">Honest about cancelling</h3>
              <p>Ditch can’t cancel for you, and it won’t pretend to. You cancel on the service’s own page.</p>
            </div>
          </div>
          <div className="faq" style={{ marginTop: 96 }}>
            <div>
              <h2 id="faq-h" className="h2" style={{ fontSize: 'clamp(1.75rem, 1rem + 2vw, 2.5rem)' }}>
                Frequently asked questions
              </h2>
              <p className="lead" style={{ marginTop: 16 }}>
                Something else? Email us at <a href="mailto:support@ditchsubs.app">support@ditchsubs.app</a>.
              </p>
            </div>
            <div>
              {FAQ.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>
                    {f.q}
                    <span className="pm" aria-hidden />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />

      {/* 8. Final */}
      <section className="wrap" aria-labelledby="final-h" data-has-cta>
        <div className="final">
          <h2 id="final-h" className="h2">
            Fewer surprise charges. More say in what renews.
          </h2>
          <p className="lead">Be the first to know when it’s out.</p>
          <EmailBox source="home-final" bare cta="Join the waitlist" />
          <AppBadges className="final-badges" />
        </div>
      </section>

    </>
  );
}
