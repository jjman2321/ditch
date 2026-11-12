'use client';

/* eslint-disable @next/next/no-img-element */
import { useId, useState } from 'react';

type State = 'idle' | 'sending' | 'done' | 'closed' | 'error';

/**
 * The waitlist box. One email field, an unticked Price Hike Report option, and a plain promise line.
 * Posts to /api/subscribe (D1 + Resend double opt-in). Never claims it saved when it didn't.
 */
export function EmailBox({ source, cta = 'Join the waitlist', onCream = false, compact = false }: { source: string; cta?: string; onCream?: boolean; compact?: boolean }) {
  const id = useId();
  const [state, setState] = useState<State>('idle');
  const [email, setEmail] = useState('');
  const [report, setReport] = useState(false);
  const [invalid, setInvalid] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setInvalid(true);
    setState('sending');
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, source, report }) });
      if (res.ok) return setState('done');
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (data.error === 'invalid-email') {
        setInvalid(true);
        return setState('idle');
      }
      setState(data.error === 'not-configured' ? 'closed' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done' || state === 'closed') {
    return (
      <div className="email-ok" role="status">
        <img src="/duck.png" alt="" width={88} />
        <div>
          {state === 'done' ? (
            <>
              <b>Check your inbox.</b>
              <p className="small" style={{ color: 'var(--fg2)' }}>
                We sent a link to <b>{email}</b>. Tap it to confirm your spot.
              </p>
            </>
          ) : (
            <>
              <b>Sign-ups open very soon.</b>
              <p className="small" style={{ color: 'var(--fg2)' }}>Nothing was saved yet. Try again in a day or two.</p>
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
          onChange={(e) => {
            setEmail(e.target.value);
            setInvalid(false);
          }}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-err` : `${id}-fine`}
        />
        <button className="btn" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : cta}
        </button>
      </div>
      {invalid ? (
        <p id={`${id}-err`} className="err" role="alert">
          That email doesn’t look right. Check for a typo.
        </p>
      ) : null}
      {state === 'error' ? (
        <p className="err" role="alert">
          Something went wrong. Try again in a minute.
        </p>
      ) : null}
      {compact ? null : (
        <label className="opt">
          <input type="checkbox" checked={report} onChange={(e) => setReport(e.target.checked)} />
          Also send me the monthly Price Hike Report
        </label>
      )}
      <p id={`${id}-fine`} className="fine">
        One email when Ditch is on the App Store. Unsubscribe anytime. <a href="/privacy">Privacy</a>
      </p>
    </form>
  );
}
