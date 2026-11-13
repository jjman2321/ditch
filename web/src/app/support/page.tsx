import type { Metadata } from 'next';

import { Doc } from '@/components/Doc';
import { SUPPORT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Help with Ditch: reminders not arriving, restoring Pro, cancelling Pro, moving to a new iPhone, and how to reach a person.',
  alternates: { canonical: '/support' },
};

const QA = [
  {
    q: 'My reminders aren’t arriving',
    a: [
      'Open iPhone Settings → Notifications → Ditch and make sure Allow Notifications is on.',
      'Check Focus: if a Focus mode is on at your reminder time (9:00 unless you changed it), reminders can be silenced. Add Ditch to the allowed apps.',
      'In Ditch, open Settings and tap “Send me a test reminder”. It should arrive in about 5 seconds.',
      'A subscription needs a next charge date to get reminders. Free covers 3 subscriptions; Settings → Which subscriptions shows which.',
    ],
  },
  { q: 'How do I restore Pro on a new iPhone?', a: ['Sign in with the same Apple Account, open Ditch → Settings → Ditch Pro → Restore purchases.'] },
  { q: 'How do I cancel Ditch Pro?', a: ['iPhone Settings → your name → Subscriptions → Ditch → Cancel Subscription. Cancel at least 24 hours before it renews. Nothing you added gets deleted; reminders go back to 3.'] },
  { q: 'Will I lose my list if I change phones?', a: ['Your list lives on your iPhone. Before you switch, use Settings → Your data → Export as spreadsheet (CSV) to save a copy. iCloud backup is coming to Pro.'] },
  { q: 'A cancel guide or price is wrong', a: [`Email ${SUPPORT_EMAIL} with the service and what you saw. We re-check it on the service’s own page and update the page.`] },
  { q: 'Can I get a refund?', a: ['Apple handles all payments, so refunds go through Apple: reportaproblem.apple.com.'] },
];

export default function Support() {
  return (
    <Doc title="Support">
      <p className="lead" style={{ marginTop: 16 }}>
        Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We read every message and usually reply within a day.
      </p>
      {QA.map((x, i) => (
        <section key={x.q}>
          <h2 id={`q${i + 1}`}>{x.q}</h2>
          {x.a.length > 1 ? (
            <ul>
              {x.a.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : (
            <p>{x.a[0]}</p>
          )}
        </section>
      ))}
      <div className="card" style={{ marginTop: 48 }}>
        <p className="h3">Still stuck?</p>
        <p style={{ marginTop: 8, color: 'var(--fg2)' }}>Tell us what you tapped and what you saw. A screenshot helps.</p>
        <a className="btn" style={{ marginTop: 20 }} href={`mailto:${SUPPORT_EMAIL}?subject=Ditch%20support`}>
          Email support
        </a>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: QA.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a.join(' ') } })) }) }}
      />
    </Doc>
  );
}
