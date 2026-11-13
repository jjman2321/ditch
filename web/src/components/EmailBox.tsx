'use client';

/* eslint-disable @next/next/no-img-element */
import { useId, useState } from 'react';

type State = 'idle' | 'sending' | 'done' | 'already' | 'unsent' | 'closed' | 'error';

/**
 * The waitlist box. One email field, an unticked Price Hike Report option, and a plain promise line.
 * Posts to /api/subscribe (D1 + Resend double opt-in). Never claims it saved when it didn't.
 */
export function EmailBox({ source, cta = 'Join the waitlist', onCream = false, compact = false, bare = false }: { source: string; cta?: string; onCream?: boolean; compact?: boolean; bare?: boolean }) {
  const id = useId();
  const [state, setState] = useState<State>('idle');
  const [email, setEmail] = useState('');
  const [report, setReport] = useState(false);
  const [invalid, setInvalid] = useState<false | 'empty' | 'typo'>(false);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email.trim()) return setInvalid('empty');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setInvalid('typo');
    setState('sending');
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, source, report }) });
      const data = (await res.json().catch(() => ({}))) as { error?: string; confirmed?: boolean; sent?: boolean };
      if (res.ok) return setState(data.confirmed ? 'already' : data.sent ? 'done' : 'unsent');
      if (data.error === 'invalid-email') {
        setInvalid('typo');
        return setState('idle');
      }
      setState(data.error === 'not-configured' || data.error === 'unavailable' ? 'closed' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state !== 'idle' && state !== 'sending' && state !== 'error') {
    return (
      <div className="email-ok" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <img src="/duck.webp" alt="" width={88} height={51} loading="lazy" />
        <div>
          {state === 'done' ? (
            <>
              <b>Check your inbox.</b>
              <p className="small" style={{ color: 'var(--fg2)' }}>
                We sent a link to <b>{email}</b>. Tap it to confirm your spot.
              </p>
              <p className="small" style={{ color: 'var(--fg2)', marginTop: 4 }}>Not there in a minute? Check Spam or Promotions.</p>
            </>
          ) : state === 'already' ? (
            <>
              <b>You’re already on the list.</b>
              <p className="small" style={{ color: 'var(--fg2)' }}>We’ll email {email} the day Ditch is out.</p>
            </>
          ) : state === 'unsent' ? (
            <>
              <b>Almost there.</b>
              <p className="small" style={{ color: 'var(--fg2)' }}>Our confirm email didn’t send.</p>
              <button type="button" className="linkbtn" onClick={() => submit()}>
                Send it again
              </button>
            </>
          ) : (
            <>
              <b>Sign-ups aren’t open yet.</b>
              <p className="small" style={{ color: 'var(--fg2)' }}>We didn’t keep your email. Try again in a day or two.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <form className={`email-wrap${onCream ? ' on-cream' : ''}`} onSubmit={submit} noValidate>
      <label htmlFor={id} className="sr">
        Email
      </label>
      <div className="email">
        <input
          id={id}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@email.com"
          value={email}
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setInvalid(false);
          }}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={invalid ? `${id}-err` : bare ? undefined : `${id}-fine`}
        />
        <button className="btn" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : cta}
        </button>
      </div>
      {invalid ? (
        <p id={`${id}-err`} className="err" role="alert">
          {invalid === 'empty' ? 'Type your email first.' : 'That email doesn’t look right. Check for a typo.'}
        </p>
      ) : null}
      {state === 'error' ? (
        <p className="err" role="alert">
          Something went wrong. Try again in a minute.
        </p>
      ) : null}
      {compact || bare ? null : (
        <label className="opt">
          <input type="checkbox" checked={report} onChange={(e) => setReport(e.target.checked)} />
          Also send me the monthly Price Hike Report
        </label>
      )}
      {bare ? null : (
        <p id={`${id}-fine`} className="fine">
          We’ll send a confirm link, then one email the day Ditch is out. Unsubscribe anytime. <a href="/privacy">Privacy policy</a>
        </p>
      )}
    </form>
  );
}
