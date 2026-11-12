/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { Calculator, type CalcService } from '@/components/Calculator';
import { EmailBox } from '@/components/EmailBox';
import { Logo } from '@/components/Logo';
import { Notif } from '@/components/Notif';
import { Stamp } from '@/components/Stamp';
import { StickyCta } from '@/components/StickyCta';
import { COUNTRIES, defaultPlan, formatDate, hasLogo, priceFor, priceHubServices, publishedGuides, serviceById, siteCounts, verifiedPrices } from '@/lib/data';
import { formatMoney } from '@/lib/money';
import { BRAND, COMPANY, PRO, SITE, STATS } from '@/lib/site';

const CALC_IDS = ['netflix', 'spotify', 'chatgpt-plus', 'amazon-prime', 'disney-plus', 'apple-music', 'youtube-premium', 'youtube-music', 'max', 'xbox-game-pass', 'claude-pro', 'microsoft-365', 'hulu', 'ps-plus', 'paramount-plus', 'peacock', 'google-one', 'audible'];

const FAQ = [
  { q: 'Is it really free?', a: 'Tracking is free forever: your full list, real totals and the calendar. Reminders are free on 3 subscriptions you pick. Pro adds reminders on all of them.' },
  { q: 'A subscription to track subscriptions?', a: `Fair question. Pro is ${PRO.yearly} a year, about ${PRO.yearlyPerMonth} a month, and two forgotten months of Netflix cost more than that. Rather not subscribe? Lifetime is ${PRO.lifetime}, once.` },
  { q: 'Can Ditch cancel for me?', a: 'No. No app can do that honestly without your passwords. Ditch reminds you before each charge and shows you the official place to cancel, step by step.' },
  { q: 'How does it know what I pay for?', a: 'You tell it. Tap the logos or type a name. Ditch never reads your bank or your email.' },
  { q: 'Do you sell my data?', a: 'No. Your list stays on your phone. No ads, no tracking. Pro payments go through Apple.' },
  { q: 'What if I stop paying for Pro?', a: 'Nothing gets deleted or hidden. Reminders go back to 3.' },
];

export const metadata = {
  title: { absolute: 'Ditch: Subscription Tracker for iPhone | Reminders before every charge' },
  description: 'See everything you pay for and get a reminder 3 days and 1 day before each charge. Free forever for tracking. No bank login, no account.',
};

export default function Home() {
  const counts = siteCounts();
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
  const nfYear = formatMoney(nfPlan.amountMinor * 12, 'USD');
  const guides = publishedGuides();
  const byCat = (cat: string) => guides.filter((g) => serviceById(g.id)?.category === cat);
  const cats = [
    { cat: 'Streaming', label: 'Streaming' },
    { cat: 'Music & audio', label: 'Music' },
    { cat: 'AI', label: 'AI' },
    { cat: 'Gaming', label: 'Gaming' },
  ];

  const ld = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: 'Ditch', legalName: COMPANY, url: SITE, logo: `${SITE}/icon.png`, email: 'support@ditchsubs.app' },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, url: SITE, publisher: { '@type': 'Organization', name: COMPANY } },
    {
      '@context': 'https://schema.org',
      '@type': 'MobileApplication',
      name: BRAND,
      operatingSystem: 'iOS',
      applicationCategory: 'FinanceApplication',
      description: 'See everything you pay for and get a reminder 3 days and 1 day before each charge. Free forever for tracking. No bank login, no account.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: COMPANY },
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* 1. Hero */}
      <section className="hero" aria-labelledby="hero-h">
        <div className="wrap grid">
          <div className="copy">
            <h1 id="hero-h" className="d-h1">
              Ditch it before it <span className="hl">renews.</span>
            </h1>
            <p className="lead">See everything you pay for. Get a reminder 3 days before every charge, so nothing renews by surprise.</p>
            <div id="join">
              <EmailBox source="home-hero" />
            </div>
            <p className="hero-note">
              <b>Free forever for tracking.</b> Reminders on 3, or all of them with Pro. Coming to iPhone.
            </p>
          </div>
          <div className="stage" aria-hidden>
            <img className="float" src="/logos/netflix.png" alt="" style={{ left: '2%', top: 96, transform: 'rotate(-4deg)' }} />
            <img className="float" src="/logos/spotify.png" alt="" style={{ right: '0%', top: 40, transform: 'rotate(5deg)' }} />
            <img className="float" src="/logos/chatgpt-plus.png" alt="" style={{ left: '0%', top: 330, transform: 'rotate(3deg)' }} />
            <div className="phone">
              <div className="scr">
                <div className="island" />
                <div className="day">Wednesday, November 18</div>
                <div className="time">9:00</div>
                <Notif text={`Netflix renews in 3 days. ${formatMoney(nfPlan.amountMinor, 'USD')}. Still watching?`} style={{ top: 214 }} />
              </div>
            </div>
            <img className="duck" src="/duck.png" alt="" />
          </div>
        </div>
      </section>

      {/* 2. Proof strip: real counts from the data */}
      <section className="proof" aria-label="What's behind Ditch">
        <div className="wrap cells">
          <div className="cell">
            <b className="num">{counts.services}</b>
            <span>services with checked prices</span>
          </div>
          <div className="cell">
            <b className="num">{counts.countries}</b>
            <span>countries, in local money</span>
          </div>
          <div className="cell">
            <b className="num">{counts.plans.toLocaleString('en-US')}</b>
            <span>plan prices checked by hand</span>
          </div>
          <div className="cell">
            <b>{formatDate(counts.checked).replace(/, \d{4}$/, '')}</b>
            <span>
              last checked · <Link href="/how-we-check">how</Link>
            </span>
          </div>
        </div>
      </section>

      {/* 3. Calculator */}
      <section className="sec" aria-labelledby="calc-h" data-has-cta>
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Try it</p>
            <h2 id="calc-h" className="h2">
              What do you pay for?
            </h2>
            <p className="lead">People guess low. Tap what you have and see the real yearly number, with real prices for your country.</p>
          </div>
          <div className="sec-body">
            <Calculator services={calc} countries={calcCountries} />
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="how-h">
        <div className="wrap">
          <div className="sec-head">
            <h2 id="how-h" className="h2">
              Three steps. Then you’re covered.
            </h2>
          </div>
          <div className="sec-body steps">
            <div className="card step" data-reveal style={{ ['--i' as string]: 0 }}>
              <span className="n">1</span>
              <h3 className="h3">Add what you pay for</h3>
              <p>Tap the logos. Prices fill in for your country. Anything else, type it in.</p>
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
              <h3 className="h3">Get a reminder</h3>
              <p>3 days and 1 day before each charge, at 9:00. Free trials too.</p>
              <div className="shot">
                <Notif text={`Spotify renews tomorrow. ${formatMoney(defaultPlan(priceFor('spotify', 'US')!).amountMinor, 'USD')}.`} when="9:00" />
              </div>
            </div>
            <div className="card step" data-reveal style={{ ['--i' as string]: 2 }}>
              <span className="n">3</span>
              <h3 className="h3">Ditch what you don’t use</h3>
              <p>Hold to ditch. Ditch shows you the official place to cancel, step by step.</p>
              <div className="shot" style={{ alignItems: 'center', paddingBottom: 24 }}>
                <div style={{ width: 220 }}>
                  <Stamp date="2026-11-12" paper="#FFCC2E" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. One-liner moment */}
      <section className="sec-moment oneliner" aria-label="Why Ditch">
        <div className="wrap">
          <p className="d-line" data-reveal>
            Nobody signs up for nine subscriptions. <span>It just happens.</span>
          </p>
        </div>
      </section>

      {/* 6. Reminders */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="rem-h">
        <div className="wrap split">
          <div>
            <h2 id="rem-h" className="h2">
              Reminders that actually go off.
            </h2>
            <p className="lead" style={{ marginTop: 20 }}>
              We read 5,535 reviews of other trackers. Reminders that never came were one of the biggest complaints. Ditch plans every reminder on your phone, re-checks them each time you open it, and shows you the next one.
            </p>
            <ul className="ticks">
              <li>
                3 days and 1 day before<span>Or pick your own days with Pro.</span>
              </li>
              <li>
                Free trials too<span>Hear about it before a trial turns into a charge.</span>
              </li>
              <li>
                Send yourself a test<span>See a real reminder arrive in 5 seconds.</span>
              </li>
            </ul>
          </div>
          <div className="big-notif" aria-hidden>
            <Notif text={`Netflix renews in 3 days. ${formatMoney(nfPlan.amountMinor, 'USD')}. Still watching?`} />
            <Notif text={`Your Disney+ trial ends tomorrow. Then ${formatMoney(defaultPlan(priceFor('disney-plus', 'US')!).amountMinor, 'USD')} a month.`} when="9:00" />
            <span className="next">Next reminder: Netflix · Sun 9:00 AM</span>
          </div>
        </div>
      </section>

      {/* 7. The DITCHED moment */}
      <section className="sec-moment stamp-moment" aria-labelledby="ditch-h">
        <div className="wrap">
          <h2 id="ditch-h" className="sr">
            Ditch a subscription
          </h2>
          <Stamp date="2026-11-12" />
          <p className="d-money">{nfYear} a year</p>
          <p className="d-line" style={{ fontSize: 'clamp(1.75rem, 1.2rem + 1.6vw, 2.5rem)', marginTop: 8 }}>
            you won’t pay.
          </p>
          <p className="cap">Netflix Standard ({formatMoney(nfPlan.amountMinor, 'USD')} a month in the US), ditched.</p>
        </div>
      </section>

      {/* 8. Value: yes it's a subscription, and it's cheap */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="val-h">
        <div className="wrap">
          <div className="sec-head">
            <h2 id="val-h" className="h2">
              Yes, Pro is a subscription. It costs less than the ones it catches.
            </h2>
          </div>
          <div className="sec-body value">
            <div className="card" data-reveal style={{ ['--i' as string]: 0 }}>
              <p className="eyebrow">Pro, yearly</p>
              <b className="big num">{PRO.yearlyPerMonth}</b>
              <p>
                a month, billed {PRO.yearly} a year after a {PRO.trialDays}-day free trial. Less than one streaming plan.
              </p>
            </div>
            <div className="card" data-reveal style={{ ['--i' as string]: 1 }}>
              <p className="eyebrow">What people lose</p>
              <b className="big">~$205</b>
              <p>
                a year on {STATS.wasted.on}, on average.{' '}
                <a href={STATS.wasted.url} rel="noopener">
                  {STATS.wasted.source}
                </a>
              </p>
            </div>
            <div className="card" data-reveal style={{ ['--i' as string]: 2, background: 'var(--sun)', borderColor: 'transparent' }}>
              <p className="eyebrow" style={{ color: 'var(--sunfg2)' }}>Hate subscriptions?</p>
              <b className="big num">{PRO.lifetime}</b>
              <p style={{ color: 'var(--sunfg2)' }}>once. Pro for good, no renewals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Pricing */}
      <section id="pricing" className="sec" style={{ paddingTop: 0 }} aria-labelledby="price-h" data-has-cta>
        <div className="wrap">
          <div className="row-head">
            <div className="sec-head">
              <h2 id="price-h" className="h2">
                Free to track. Pro to never miss one.
              </h2>
            </div>
          </div>
          <div className="sec-body plans">
            <div className="card plan">
              <h3 className="h3">Free</h3>
              <div className="price num">$0</div>
              <p className="per">forever. No card, no account.</p>
              <ul>
                <li>Track every subscription</li>
                <li>Totals, calendar and cancel guides</li>
                <li>Reminders on 3 subscriptions</li>
                <li className="no">Pick reminder days</li>
                <li className="no">Nudge if you miss one</li>
              </ul>
            </div>
            <div className="card plan pro">
              <div className="plan-head">
                <h3 className="h3">Pro</h3>
                <span className="tag">{PRO.trialDays} days free</span>
              </div>
              <div className="price num">{PRO.yearly}</div>
              <p className="per">
                a year (about {PRO.yearlyPerMonth} a month), or {PRO.monthly} a month. Cancel anytime in iPhone Settings.
              </p>
              <ul>
                <li>Track every subscription</li>
                <li>Totals, calendar and cancel guides</li>
                <li>
                  <b>Reminders on unlimited subscriptions</b>
                </li>
                <li>Pick reminder days</li>
                <li>Nudge if you miss one</li>
              </ul>
            </div>
            <div className="card plan life">
              <h3 className="h3">Lifetime</h3>
              <div className="price num">{PRO.lifetime}</div>
              <p className="per">once. Everything in Pro, no renewals ever.</p>
              <ul>
                <li>Everything in Pro</li>
                <li>Pay once, keep it</li>
                <li>Restore it on a new iPhone</li>
              </ul>
            </div>
          </div>
          <p className="price-line">US prices. Your App Store shows the price in your currency before you pay. Lifetime covers Pro.</p>
        </div>
      </section>

      {/* 10. Honest: what Ditch doesn't do */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="dont-h">
        <div className="wrap">
          <div className="sec-head">
            <h2 id="dont-h" className="h2">
              What Ditch doesn’t do.
            </h2>
            <p className="lead">So you know exactly what you’re getting.</p>
          </div>
          <div className="sec-body dont">
            <div className="card">
              <span className="x" aria-hidden>
                ✕
              </span>
              <h3 className="h3">Read your bank</h3>
              <p>No bank login, no email scanning, no account. You add what you pay for, and your list stays on your phone.</p>
            </div>
            <div className="card">
              <span className="x" aria-hidden>
                ✕
              </span>
              <h3 className="h3">Cancel for you</h3>
              <p>Nobody can do that honestly without your passwords. Ditch opens the right page and walks you through it.</p>
            </div>
            <div className="card">
              <span className="x" aria-hidden>
                ✕
              </span>
              <h3 className="h3">Run on Android</h3>
              <p>Ditch is for iPhone. It uses iPhone reminders that work even when the app is closed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Guides + prices */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="guides-h">
        <div className="wrap">
          <div className="row-head">
            <div className="sec-head">
              <h2 id="guides-h" className="h2">
                Want out? There’s a guide for that.
              </h2>
              <p className="lead">Official cancel links and steps, split by how you pay. Checked by hand, with the date on every page.</p>
            </div>
            <Link href="/cancel" className="hide-sm">
              All {guides.length} guides →
            </Link>
          </div>
          <div className="sec-body cats">
            {cats.map(({ cat, label }) => {
              const list = byCat(cat);
              if (!list.length) return null;
              return (
                <Link key={cat} className="card cat" href={`/cancel#${cat.split(' ')[0].toLowerCase()}`}>
                  <span className="stack" aria-hidden>
                    {list.slice(0, 3).map((g) => (
                      <Logo key={g.id} id={g.id} size={32} />
                    ))}
                  </span>
                  <span className="h3">{label}</span>
                  <span>
                    {list.length} guides · {list.slice(0, 2).map((g) => g.name).join(', ')}…
                  </span>
                </Link>
              );
            })}
          </div>
          <nav className="linkrow" aria-label="Popular cancel guides">
            {guides.slice(0, 10).map((g) => (
              <Link key={g.id} href={`/cancel/${g.id}`}>
                Cancel {g.name}
              </Link>
            ))}
          </nav>
          <div style={{ marginTop: 64 }}>
            <div className="row-head">
              <h3 className="h3">Prices in your country</h3>
              <Link href="/prices">All prices →</Link>
            </div>
            <nav className="linkrow" aria-label="Popular price pages">
              {priceHubServices()
                .slice(0, 10)
                .map((s) => (
                  <Link key={s.id} href={`/prices/${s.id}`}>
                    {s.name} prices
                  </Link>
                ))}
            </nav>
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="faq-h">
        <div className="wrap faq">
          <div>
            <h2 id="faq-h" className="h2">
              These tend to come up.
            </h2>
            <p className="lead" style={{ marginTop: 20 }}>
              Something else? <a href="mailto:support@ditchsubs.app">Email us</a>. A person answers.
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
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }}
      />

      {/* 13. Final CTA */}
      <section className="wrap" aria-labelledby="final-h" data-has-cta>
        <div className="final">
          <h2 id="final-h" className="h2">
            Be first when it’s out.
          </h2>
          <p className="lead">One email when Ditch is on the App Store. Want the monthly Price Hike Report too? Tick the box.</p>
          <EmailBox source="home-final" />
        </div>
      </section>

      <StickyCta />
    </>
  );
}
