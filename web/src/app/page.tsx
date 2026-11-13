/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { Calculator, type CalcService } from '@/components/Calculator';
import { EmailBox } from '@/components/EmailBox';
import { Notif } from '@/components/Notif';
import { DitchDemo } from '@/components/DitchDemo';
import { COUNTRIES, defaultPlan, formatDate, hasLogo, priceFor, serviceById, verifiedPrices } from '@/lib/data';
import { formatMoney } from '@/lib/money';
import { BRAND, COMPANY, PRO, PRO_MINOR, SITE } from '@/lib/site';

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
  { q: 'Why pay for a subscription tracker?', a: `Fair question. Pro is ${PRO.yearly} a year, about ${PRO.yearlyPerMonth} a month, and two forgotten months of Netflix cost more than that. Rather not subscribe? Lifetime is ${PRO.lifetime}, once.` },
  { q: 'What’s the difference between Pro and Lifetime?', a: `Nothing in the app. Pro renews (${PRO.yearly} a year or ${PRO.monthly} a month). Lifetime is ${PRO.lifetime} once and never renews.` },
  { q: 'Can Ditch cancel subscriptions for me?', a: 'No. No app can do that honestly without your passwords. Ditch reminds you before each charge and opens the official cancel page, with the steps.' },
  { q: 'Do I need to link my bank?', a: 'No. You add what you pay for: tap the logos or type a name, and the price fills in for your country. Ditch never reads your bank or your email.' },
  { q: 'Do reminders work when the app is closed?', a: 'Yes. Reminders are set on your iPhone, so they arrive even when Ditch is closed. Opening it now and then keeps them topped up.' },
  { q: 'Can it remind me before a free trial ends?', a: 'Yes. Add the trial and its end date, and Ditch reminds you 3 days and 1 day before it turns into a charge.' },
  { q: 'Is my subscription list private?', a: 'Yes. Your list stays on your phone. No ads, no tracking, and we never sell anything about you. Pro payments go through Apple.' },
  { q: 'Which countries does Ditch work in?', a: 'Anywhere with the App Store. Prices fill in for 12 countries, including the US, UK, Canada, Australia, much of Europe and India. Elsewhere you type the price in.' },
  { q: 'What happens if I stop paying for Pro?', a: 'Nothing gets deleted or hidden. Your list stays as it is, and reminders go back to 3.' },
  { q: 'How do I cancel Ditch Pro?', a: 'In iPhone Settings → your name → Subscriptions → Ditch. Cancel at least 24 hours before it renews.' },
  { q: 'Is Ditch on Android?', a: 'Not yet. Ditch is made for iPhone.' },
  { q: 'When does Ditch come out?', a: 'Soon. Join the waitlist and you get one email the day it’s on the App Store.' },
];

export const metadata = {
  alternates: { canonical: '/' },
  title: { absolute: 'Ditch: Subscription Tracker for iPhone | Ditch it before it renews' },
  description: 'Track every subscription in one list and get a reminder 3 days before each charge. No bank login, no account. Free to track, for iPhone.',
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
  // Only say "less than two months of Netflix" while it's true for the US price we show.
  const cheaperThanNetflix = nfPlan.cycle === 'monthly' && nfPlan.amountMinor * 2 > PRO_MINOR.yearly;
  const yearlySave = Math.floor((1 - PRO_MINOR.yearly / (PRO_MINOR.monthly * 12)) * 100);

  const org = { '@id': `${SITE}/#org` };
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE}/#org`,
      name: COMPANY,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* 1. Hero */}
      <section className="hero" aria-labelledby="hero-h">
        <div className="wrap grid">
          <div className="copy">
            {/* Screen readers and Google read "Ditch it before it renews." (the App Store subtitle). The logos are visual only. */}
            <h1 id="hero-h" className="d-h1">
              Ditch{' '}
              <span className="slot" aria-hidden="true">
                <span className="reel">
                  {HERO_ROTATION.map((r, i) => (
                    <span className="chip" key={i} data-n={r.name} style={{ ['--d' as string]: `${i * 2 - 0.4}s` }}>
                      <img src={`/logos/${r.id}.png`} alt="" width={64} height={64} />
                    </span>
                  ))}
                </span>
              </span>
              <span className="sr">it </span>
              <br />
              before it renews.
            </h1>
            <p className="lead">Track every subscription in one list and get a reminder 3 days before each charge. No bank login, no account.</p>
            <div id="join">
              <EmailBox source="home-hero" bare cta="Join the waitlist" />
            </div>
            <div className="hero-notifs" aria-hidden>
              <Notif text={`Netflix renews in 3 days. ${formatMoney(nfPlan.amountMinor, 'USD')}. Still watching?`} />
              <Notif when="Tue" text={`Spotify renews in 3 days. ${formatMoney(defaultPlan(priceFor('spotify', 'US')!).amountMinor, 'USD')}.`} />
            </div>
          </div>
          <div className="stage" aria-hidden>
            <img className="float" fetchPriority="low" src="/logos/netflix.png" alt="" style={{ left: '4%', top: 70, transform: 'rotate(-6deg)' }} />
            <img className="float" fetchPriority="low" src="/logos/spotify.png" alt="" style={{ right: '2%', top: 36, transform: 'rotate(6deg)' }} />
            <img className="float" fetchPriority="low" src="/logos/chatgpt-plus.png" alt="" style={{ left: '0%', top: 300, transform: 'rotate(4deg)' }} />
            <img className="float" fetchPriority="low" src="/logos/disney-plus.png" alt="" style={{ right: '0%', top: 268, transform: 'rotate(-5deg)' }} />
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
                  <span />
                  <span />
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
            <p className="lead">Tap the ones you pay for. Prices fill in for your country, checked by hand.</p>
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
              How it works: <span className="nw">from sign-up</span> <span className="nw">to cancelled</span>
            </h2>
          </div>
          <div className="sec-body steps">
            <div className="card step" data-reveal style={{ ['--i' as string]: 0 }}>
              <span className="n">1</span>
              <h3 className="h3">Add your subscriptions</h3>
              <p>Tap Netflix, Spotify, ChatGPT and the rest. The price fills in. Anything else, type it in.</p>
              <div className="shot">
                <div className="mini-list" aria-hidden>
                  {['netflix', 'spotify', 'chatgpt-plus'].map((id) => {
                    const p = defaultPlan(priceFor(id, 'US')!);
                    return (
                      <div className="r" key={id}>
                        <img src={`/logos/${id}.png`} alt="" />
                        {serviceById(id)!.name}
                        <span className="num">{formatMoney(p.amountMinor, 'USD')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="card step" data-reveal style={{ ['--i' as string]: 1 }}>
              <span className="n">2</span>
              <h3 className="h3">Get reminded before you pay</h3>
              <p>A reminder 3 days and 1 day before each charge, at 9:00. Free trials too.</p>
              <div className="shot">
                <Notif text={`Spotify renews tomorrow. ${formatMoney(defaultPlan(priceFor('spotify', 'US')!).amountMinor, 'USD')}.`} when="9:00" />
              </div>
            </div>
            <div className="card step" data-reveal style={{ ['--i' as string]: 2 }}>
              <span className="n">3</span>
              <h3 className="h3">Cancel what you don’t use</h3>
              <p>Hold to ditch. Ditch opens the official cancel page and shows you the steps.</p>
              <div className="shot" style={{ paddingTop: 0 }}>
                <DitchDemo small name="Netflix" meta={`${formatMoney(nfPlan.amountMinor, 'USD')}/mo`} logo="/logos/netflix.png" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3b. The ditch moment, with context */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="dd-h">
        <div className="wrap split">
          <div>
            <h2 id="dd-h" className="h2">
              Cancel it and see what you won’t pay
            </h2>
            <p className="lead" style={{ marginTop: 20 }}>
              Once you’ve cancelled, Ditch shows what it would have cost you in a year.
            </p>
            <ul className="ticks">
              <li>
                Official cancel pages<span>The real page for each service, never a lookalike.</span>
              </li>
              <li>
                Steps checked by hand<span>With the date we last checked them.</span>
              </li>
            </ul>
            <p style={{ marginTop: 20 }}>
              <Link href="/cancel">Browse all cancel guides →</Link>
            </p>
          </div>
          <DitchDemo name="Netflix" logo="/logos/netflix.png" meta={`${nfPlan.name} · ${formatMoney(nfPlan.amountMinor, 'USD')}/mo`} yearly={formatMoney(nfPlan.amountMinor * 12, 'USD')} />
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
              Missed reminders are a common complaint about subscription trackers. Ditch sets every reminder on your iPhone and shows you the next one, so you know it’s set.
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
            <Notif text={`Your Disney+ trial ends tomorrow. Then ${formatMoney(defaultPlan(priceFor('disney-plus', 'US')!).amountMinor, 'USD')} a month.`} when="9:00" />
            <span className="next">Next reminder: Netflix · Fri 9:00</span>
          </div>
        </div>
      </section>

      {/* 6. Price + lifetime (owner pick C): Free card, big Pro card with yearly and monthly, Lifetime strip */}
      <section id="pricing" className="sec" style={{ paddingTop: 0 }} aria-labelledby="price-h" data-has-cta>
        <div className="wrap">
          <div className="price-head">
            <h2 id="price-h" className="h2">
              {cheaperThanNetflix ? 'Pro costs less than two months of Netflix.' : `Free to track. Pro for about ${PRO.yearlyPerMonth} a month.`}
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
                  <p className="k">Yearly</p>
                  <p className="amt num">{PRO.yearly}</p>
                  <p className="per">
                    {PRO.yearlyPerMonth} a month · save {yearlySave}%
                  </p>
                </div>
                <div className="pc-opt">
                  <p className="k">Monthly</p>
                  <p className="amt num">{PRO.monthly}</p>
                  <p className="per">No free trial</p>
                </div>
              </div>
              <ul>
                <li>Everything in Free</li>
                <li>Reminders on all of them</li>
                <li>Pick your reminder days</li>
                <li>A nudge if you miss one</li>
              </ul>
              <span className="push" />
              <Link className="btn" href="/#join" prefetch={false}>
                Join the waitlist
              </Link>
            </div>
            <div className="pc-life">
              <p className="amt num">{PRO.lifetime}</p>
              <p className="t">
                <b>Lifetime. Pay once.</b>
                <span>Everything in Pro, and it never renews. For people who are done with subscriptions.</span>
              </p>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }}
      />

      {/* 8. Final */}
      <section className="wrap" aria-labelledby="final-h" data-has-cta>
        <div className="final">
          <h2 id="final-h" className="h2">
            Fewer surprise charges. More say in what renews.
          </h2>
          <p className="lead">Be the first to know when it’s out.</p>
          <EmailBox source="home-final" bare cta="Join the waitlist" />
        </div>
      </section>

    </>
  );
}
