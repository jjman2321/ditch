/* eslint-disable @next/next/no-img-element */
/**
 * Two of the app's real screens, drawn in HTML inside the same phone as the hero (no screenshots):
 * the paywall and the Ditched screen. Decorative: each section says the same in text beside it.
 * When scrolled into view the parts fade in one after another and the duck pops up once.
 * Prices never move, they only fade. Reduce Motion: shown finished.
 */

function Phone({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`device ${className}`} data-reveal aria-hidden>
      <div className="dv-scr">
        <div className="dv-bar">
          <span>9:41</span>
          <span className="dv-icons">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="dv-island" />
        {children}
      </div>
    </div>
  );
}

const ROWS: [string, string, string][] = [
  ['Track every subscription', '✓', '✓'],
  ['Subscriptions with reminders', '3', 'Unlimited'],
  ['Pick reminder days', '–', '✓'],
  ['Nudge if you miss one', '–', '✓'],
];

export function PaywallPhone({ yearly, perMonth, monthly, lifetime, trialDays, save, startDay }: { yearly: string; perMonth: string; monthly: string; lifetime: string; trialDays: number; save: number; startDay: string }) {
  return (
    <Phone className="dv-pay">
      <div className="pw-sun">
        <div className="pw-head">
          <span className="pw-word">
            ditch <em>Pro</em>
          </span>
          <span className="pw-x">×</span>
        </div>
        <p className="pw-h">
          Get a reminder before all 6&nbsp;renewals.
        </p>
        <img className="dv-duck" src="/duck.webp" alt="" width={200} height={117} loading="lazy" />
      </div>
      <div className="pw-tbl st" style={{ ['--s' as string]: 0 }}>
        <div className="tr th">
          <span />
          <span>FREE</span>
          <span className="pc">PRO</span>
        </div>
        {ROWS.map(([l, f, p]) => (
          <div className="tr" key={l}>
            <span>{l}</span>
            <span className={f === '–' ? 'no' : ''}>{f}</span>
            <span className="pc">{p}</span>
          </div>
        ))}
      </div>
      <div className="pw-rows">
        <div className="pw-row on st" style={{ ['--s' as string]: 1 }}>
          <span className="badge">SAVE {save}%</span>
          <span className="rad on" />
          <span className="nm">
            Yearly <span className="chip">{trialDays} days free</span>
          </span>
          <span className="pr">
            <b>{yearly}/yr</b>
            <small>{perMonth} a month</small>
          </span>
        </div>
        <div className="pw-row st" style={{ ['--s' as string]: 2 }}>
          <span className="rad" />
          <span className="nm">Monthly</span>
          <span className="pr">
            <b>{monthly}/mo</b>
            <small>No free trial</small>
          </span>
        </div>
        <div className="pw-row st" style={{ ['--s' as string]: 3 }}>
          <span className="rad" />
          <span className="nm">Lifetime</span>
          <span className="pr">
            <b>{lifetime}</b>
            <small>Pay once</small>
          </span>
        </div>
        <div className="pw-cta st" style={{ ['--s' as string]: 4 }}>
          Start {trialDays}-day free trial
        </div>
        <p className="pw-fine st" style={{ ['--s' as string]: 4 }}>
          <b>$0 today</b> · {yearly}/yr from {startDay}
        </p>
      </div>
    </Phone>
  );
}

export function DitchedPhone({ name, logo, meta, yearly }: { name: string; logo: string; meta: string; yearly: string }) {
  return (
    <Phone className="dv-ditched">
      <div className="dt-top">
        <span>Put it back</span>
        <span>Done</span>
      </div>
      <div className="dt-stack">
        <img className="dv-duck" src="/duck.webp" alt="" width={200} height={117} loading="lazy" />
        <div className="dt-row">
          <img src={logo} alt="" width={40} height={40} />
          <span>
            <b>{name}</b>
            <small>{meta}</small>
          </span>
        </div>
      </div>
      <p className="dt-num st" style={{ ['--s' as string]: 1 }}>
        {yearly}
      </p>
      <p className="dt-sub st" style={{ ['--s' as string]: 1 }}>
        a year you won’t pay, once you cancel.
      </p>
      <div className="dt-btns st" style={{ ['--s' as string]: 3 }}>
        <span className="b1">Cancel in {name} ↗</span>
        <span className="b2">I already cancelled</span>
        <small>Billed by Apple? Settings → Subscriptions.</small>
      </div>
    </Phone>
  );
}
