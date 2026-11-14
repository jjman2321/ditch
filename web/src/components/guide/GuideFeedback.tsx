'use client';

import { useState } from 'react';

/** "Did this work?" as two taps (QA: the old links opened a Mail draft). "No" offers one email link to report the change. */
export function GuideFeedback({ name, email }: { name: string; email: string }) {
  const [a, setA] = useState<null | 'yes' | 'no'>(null);
  if (a === 'yes') return <p className="g-feedback" role="status"><b>Nice.</b> Keep the confirmation email until the last day you paid for.</p>;
  if (a === 'no')
    return (
      <p className="g-feedback" role="status">
        <b>Sorry about that.</b> Tell us what you saw and we’ll re-check {name}:{' '}
        <a href={`mailto:${email}?subject=${encodeURIComponent(`${name} guide: something changed`)}&body=${encodeURIComponent('What did you see instead?\n\n')}`}>email us</a>.
      </p>
    );
  return (
    <div className="g-feedback gfb">
      <b>Did this work?</b>
      <button type="button" onClick={() => setA('yes')}>Yes</button>
      <button type="button" onClick={() => setA('no')}>No, something changed</button>
    </div>
  );
}
