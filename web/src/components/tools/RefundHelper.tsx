'use client';

import Link from 'next/link';
import { useState } from 'react';

type Who = 'apple' | 'google' | 'amazon' | 'company' | 'unknown';

/** Two questions → the official place to ask. Never promises a refund: each company decides case by case. */
export function RefundHelper() {
  const [who, setWho] = useState<Who | null>(null);
  const [mine, setMine] = useState<boolean | null>(null);
  const opts: { id: Who; label: string }[] = [
    { id: 'apple', label: 'Apple (APPLE.COM/BILL)' },
    { id: 'google', label: 'Google Play' },
    { id: 'amazon', label: 'Amazon' },
    { id: 'company', label: 'The company itself' },
    { id: 'unknown', label: 'I don’t know' },
  ];
  return (
    <div>
      <div className="f">
        <span style={{ fontWeight: 700, fontSize: 15 }}>1. Who charged you?</span>
        <div className="seg" role="group" aria-label="Who charged you">
          {opts.map((o) => (
            <button key={o.id} type="button" aria-pressed={who === o.id} onClick={() => setWho(o.id)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div className="f" style={{ marginTop: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>2. Did you (or someone in your family) sign up for it?</span>
        <div className="seg" role="group" aria-label="Did you sign up">
          <button type="button" aria-pressed={mine === true} onClick={() => setMine(true)}>Yes, I forgot to cancel</button>
          <button type="button" aria-pressed={mine === false} onClick={() => setMine(false)}>No, I don’t recognise it</button>
        </div>
      </div>
      <div className="result" aria-live="polite">
        {!who || mine === null ? (
          <p className="muted">Answer both and you’ll see where to go.</p>
        ) : mine === false && who !== 'unknown' && who !== 'apple' ? (
          <p className="say">If nobody in your household signed up, contact your bank or card company about the charge. They can tell you who it came from.</p>
        ) : who === 'unknown' ? (
          <p className="say">
            Start with <Link href="/charges">What is this charge?</Link> to work out who billed you, then come back here. If you still can’t tell, your bank can show you the merchant’s details.
          </p>
        ) : who === 'apple' ? (
          <>
            <p className="say"><b>Ask Apple at reportaproblem.apple.com</b></p>
            <ol className="st">
              <li><span>Sign in at <b>reportaproblem.apple.com</b>.</span></li>
              <li><span>Tap <kbd>I’d like to</kbd>, then <kbd>Request a refund</kbd>.</span></li>
              <li><span>Choose the reason, then <kbd>Next</kbd>.</span></li>
              <li><span>Choose the subscription, then <kbd>Submit</kbd>.</span></li>
            </ol>
            <p className="note-l">If the charge is still pending, Apple says to wait for the email receipt first. Refunds can vary by country.{mine === false ? ' Use Family Sharing? Check with your family group first; their purchases can show up on your card.' : ''}</p>
          </>
        ) : who === 'google' ? (
          <>
            <p className="say"><b>Check Google Play’s refund policy</b></p>
            <p className="lead-s">Google says refund rules depend on what you bought, when and how you paid, and where you live. Find the order first: in the Play Store app, tap your profile icon, then <kbd>Payments &amp; subscriptions</kbd>, then <kbd>Budget &amp; history</kbd>.</p>
          </>
        ) : who === 'amazon' ? (
          <p className="say">Sign in at amazon.com, open <kbd>Memberships &amp; Subscriptions</kbd>, and contact Amazon customer service from there about the charge.</p>
        ) : (
          <p className="say">
            Contact the company directly; most have a billing page in their help centre. Our <Link href="/cancel">cancel guides</Link> link to each service’s own pages, so you can stop the next charge too.
          </p>
        )}
        <p className="note-l">Nobody can promise a refund. Each company decides, and asking soon after the charge helps.</p>
      </div>
    </div>
  );
}
