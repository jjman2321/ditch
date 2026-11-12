/* eslint-disable @next/next/no-img-element */
import { Calculator, type CalcService } from '@/components/Calculator';
import { EmailBox } from '@/components/EmailBox';
import { Notif } from '@/components/Notif';
import { Stamp } from '@/components/Stamp';
import { StickyCta } from '@/components/StickyCta';
import { COUNTRIES, defaultPlan, formatDate, hasLogo, priceFor, serviceById, verifiedPrices } from '@/lib/data';
import { formatMoney } from '@/lib/money';
import { BRAND, COMPANY, PRO, SITE } from '@/lib/site';

const CALC_IDS = ['netflix', 'spotify', 'chatgpt-plus', 'amazon-prime', 'disney-plus', 'apple-music', 'youtube-premium', 'youtube-music', 'max', 'xbox-game-pass', 'claude-pro', 'microsoft-365', 'hulu', 'ps-plus', 'paramount-plus', 'peacock', 'google-one', 'audible'];

const FAQ = [
  { q: 'Is it really free?', a: 'Tracking is free forever: your full list, real totals and the calendar. Reminders are free on 3 subscriptions you pick. Pro adds reminders on all of them.' },
  { q: 'A subscription to track subscriptions?', a: `Fair question. Pro is ${PRO.yearly} a year, about ${PRO.yearlyPerMonth} a month, and two forgotten months of Netflix cost more than that. Rather not subscribe? Lifetime is ${PRO.lifetime}, once.` },
  { q: 'What’s the difference between Pro and Lifetime?', a: `Nothing in the app. Pro renews (${PRO.yearly} a year or ${PRO.monthly} a month). Lifetime is ${PRO.lifetime} once and never renews.` },
  { q: 'Can Ditch cancel for me?', a: 'No. No app can do that honestly without your passwords. Ditch reminds you before each charge and shows you the official place to cancel, step by step.' },
  { q: 'How does it know what I pay for?', a: 'You tell it. Tap the logos or type a name, and the price fills in for your country. Ditch never reads your bank or your email.' },
  { q: 'Do reminders work if the app is closed?', a: 'Yes. Reminders are set on your iPhone, so they arrive even when Ditch is closed. Opening it now and then keeps them topped up.' },
  { q: 'Can it remind me before a free trial ends?', a: 'Yes. Add the trial and its end date, and Ditch reminds you 3 days and 1 day before it turns into a charge.' },
  { q: 'Do you sell my data?', a: 'No. Your list stays on your phone. No ads, no tracking. Pro payments go through Apple.' },
  { q: 'Which countries does it work in?', a: 'Anywhere with the App Store. Prices fill in for 12 countries, including the US, UK, Canada, Australia, much of Europe and India. Elsewhere you type the price in.' },
  { q: 'What if I stop paying for Pro?', a: 'Nothing gets deleted or hidden. Reminders go back to 3.' },
  { q: 'How do I cancel Pro?', a: 'In iPhone Settings → your name → Subscriptions → Ditch. Cancel at least 24 hours before it renews.' },
  { q: 'Is it on Android?', a: 'Not yet. Ditch is made for iPhone.' },
  { q: 'When does it launch?', a: 'Soon. Join the waitlist and you get one email the day it’s on the App Store.' },
];

export const metadata = {
  title: { absolute: 'Ditch: Subscription Tracker for iPhone | Ditch it before it renews' },
  description: 'Every subscription in one list. A reminder 3 days before each charge. No bank login, no account. Free forever for tracking.',
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
  const nfYear = formatMoney(nfPlan.amountMinor * 12, 'USD');

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
              Ditch it before it{' '}
              <span className="scribble">
                renews.
                <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden>
                  <path d="M4 15 C 52 7, 110 5, 168 9 S 262 17, 296 8" />
                </svg>
              </span>
            </h1>
            <p className="lead">Every subscription in one list. A reminder 3 days before each charge. No bank login.</p>
            <div id="join">
              <EmailBox source="home-hero" bare />
            </div>
            <p className="hero-note">
              <b>Free forever for tracking.</b> Reminders on 3, or all of them with Pro. Coming to iPhone.
            </p>
          </div>
          <div className="stage" aria-hidden>
            <img className="float" src="/logos/netflix.png" alt="" style={{ left: '4%', top: 70, transform: 'rotate(-6deg)' }} />
            <img className="float" src="/logos/spotify.png" alt="" style={{ right: '2%', top: 36, transform: 'rotate(6deg)' }} />
            <img className="float" src="/logos/chatgpt-plus.png" alt="" style={{ left: '0%', top: 300, transform: 'rotate(4deg)' }} />
            <img className="float" src="/logos/disney-plus.png" alt="" style={{ right: '0%', top: 268, transform: 'rotate(-5deg)' }} />
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
                <Notif className="second" when="Mon" text={`ChatGPT Plus renews tomorrow. ${formatMoney(defaultPlan(priceFor('chatgpt-plus', 'US')!).amountMinor, 'USD')}.`} style={{ top: 330 }} />
                <div className="lockbtns">
                  <span />
                  <span />
                </div>
              </div>
            </div>
            <img className="duck" src="/duck.png" alt="" />
          </div>
        </div>
      </section>

      {/* 2. The number */}
      <section className="sec" aria-labelledby="calc-h" data-has-cta>
        <div className="wrap">
          <div className="sec-head">
            <h2 id="calc-h" className="h2">
              What do you actually pay?
            </h2>
            <p className="lead">Tap what you have. Real prices for your country, checked by hand.</p>
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
              Add it. Get reminded. Ditch it.
            </h2>
          </div>
          <div className="sec-body steps">
            <div className="card step" data-reveal style={{ ['--i' as string]: 0 }}>
              <span className="n">1</span>
              <h3 className="h3">Add it</h3>
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
              <h3 className="h3">Get reminded</h3>
              <p>3 days and 1 day before each charge, at 9:00. Free trials too.</p>
              <div className="shot">
                <Notif text={`Spotify renews tomorrow. ${formatMoney(defaultPlan(priceFor('spotify', 'US')!).amountMinor, 'USD')}.`} when="9:00" />
              </div>
            </div>
            <div className="card step" data-reveal style={{ ['--i' as string]: 2 }}>
              <span className="n">3</span>
              <h3 className="h3">Ditch it</h3>
              <p>Hold to ditch. Ditch opens the official place to cancel and walks you through it.</p>
              <div className="shot" style={{ alignItems: 'center', paddingBottom: 24 }}>
                <div style={{ width: 220 }}>
                  <Stamp date="2026-11-12" paper="#FFCC2E" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Reminders */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="rem-h">
        <div className="wrap split">
          <div>
            <h2 id="rem-h" className="h2">
              Reminders that actually show up.
            </h2>
            <p className="lead" style={{ marginTop: 20 }}>
              One of the biggest complaints about other trackers: reminders that never came. Ditch plans every one on your phone and shows you the next one, so you know it’s on.
            </p>
            <ul className="ticks">
              <li>
                3 days and 1 day before<span>Or pick your own days with Pro.</span>
              </li>
              <li>
                Free trials too<span>Hear about it before a trial turns into a charge.</span>
              </li>
              <li>
                Send yourself a test<span>A real reminder in 5 seconds.</span>
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

      {/* 5. The ditch moment */}
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
          <p className="cap">Netflix Standard, ditched.</p>
        </div>
      </section>

      {/* 6. Price + lifetime */}
      <section id="pricing" className="sec" style={{ paddingTop: 0 }} aria-labelledby="price-h" data-has-cta>
        <div className="wrap">
          <div className="sec-head">
            <h2 id="price-h" className="h2">
              Costs less than the one you forgot.
            </h2>
            <p className="lead">
              Pro is about {PRO.yearlyPerMonth} a month. People lose around $205 a year on subscriptions they don’t use. Hate subscriptions? Pay once.
            </p>
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
                  <b>Reminders on every subscription</b>
                </li>
                <li>Pick reminder days</li>
                <li>Nudge if you miss one</li>
              </ul>
            </div>
            <div className="card plan life">
              <div className="plan-head">
                <h3 className="h3">Lifetime</h3>
                <span className="tag">Pay once</span>
              </div>
              <div className="price num">{PRO.lifetime}</div>
              <p className="per">once. Everything in Pro, no renewals ever.</p>
              <ul>
                <li>Everything in Pro</li>
                <li>Never renews</li>
                <li>Restore it on a new iPhone</li>
              </ul>
            </div>
          </div>
          <p className="price-line">US prices. Your App Store shows your price before you pay. Lifetime covers Pro.</p>
        </div>
      </section>

      {/* 7. Trust */}
      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="trust-h">
        <div className="wrap">
          <div className="sec-head">
            <h2 id="trust-h" className="h2">
              No bank login. No account. No catch.
            </h2>
          </div>
          <div className="sec-body dont">
            <div className="card">
              <h3 className="h3">Your list stays on your phone</h3>
              <p>You add what you pay for. Nothing reads your bank or your email.</p>
            </div>
            <div className="card">
              <h3 className="h3">No ads, no tracking</h3>
              <p>We don’t sell anything about you. Pro payments go through Apple.</p>
            </div>
            <div className="card">
              <h3 className="h3">Honest about cancelling</h3>
              <p>Ditch can’t cancel for you. It opens the right page and walks you through it.</p>
            </div>
          </div>
          <div className="faq" style={{ marginTop: 96 }}>
            <div>
              <h2 id="faq-h" className="h2" style={{ fontSize: 'clamp(1.75rem, 1rem + 2vw, 2.5rem)' }}>
                Fair questions.
              </h2>
              <p className="lead" style={{ marginTop: 16 }}>
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
            Stop paying for stuff you forgot.
          </h2>
          <p className="lead">One email when Ditch is on the App Store. Want the monthly Price Hike Report too? Tick the box.</p>
          <EmailBox source="home-final" />
        </div>
      </section>

      <StickyCta />
    </>
  );
}
