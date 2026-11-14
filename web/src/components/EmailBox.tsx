'use client';

/* eslint-disable @next/next/no-img-element */
import { useId, useState } from 'react';

type State = 'idle' | 'sending' | 'done' | 'already' | 'closed' | 'error';

/**
 * The waitlist box. One email field and a plain promise line (owner, Nov 13: no Price Hike Report option).
 * Posts to /api/subscribe (saved to D1; no emails for now). Never claims it saved when it didn’t.
 */
export function EmailBox({ source, cta = 'Join the waitlist', onCream = false, bare = false }: { source: string; cta?: string; onCream?: boolean; compact?: boolean; bare?: boolean }) {
  const id = useId();
  const [state, setState] = useState<State>('idle');
  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState<false | 'empty' | 'typo'>(false);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email.trim()) return setInvalid('empty');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setInvalid('typo');
    setState('sending');
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, source }) });
      const data = (await res.json().catch(() => ({}))) as { error?: string; already?: boolean };
      if (res.ok) return setState(data.already ? 'already' : 'done');
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
              <b>You’re on the list.</b>
              <p className="small" style={{ color: 'var(--fg2)' }}>
                We’ll email <b>{email}</b> once, the day Ditch is out.
              </p>
            </>
          ) : state === 'already' ? (
            <>
              <b>You’re already on the list.</b>
              <p className="small" style={{ color: 'var(--fg2)' }}>We’ll email {email} the day Ditch is out.</p>
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
      {bare ? null : (
        <p id={`${id}-fine`} className="fine">
          One email the day Ditch is out. Nothing else. <a href="/privacy">Privacy policy</a>
        </p>
      )}
    </form>
  );
}
