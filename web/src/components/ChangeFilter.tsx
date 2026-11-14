'use client';

import { useEffect, useState } from 'react';

/**
 * Filter /price-changes by service (QA, Nov 14: 75 cards and no way to find yours). Every row stays in the HTML;
 * picking a service only hides the others and any month left empty.
 */
export function ChangeFilter({ services }: { services: { id: string; name: string; n: number; logo: boolean }[] }) {
  const [on, setOn] = useState<string | null>(null);
  useEffect(() => {
    document.querySelectorAll<HTMLElement>('.ch-list > li').forEach((li) => {
      li.hidden = Boolean(on) && li.dataset.s !== on;
    });
    document.querySelectorAll<HTMLElement>('.ch-month').forEach((m) => {
      m.hidden = Boolean(on) && !m.querySelector('.ch-list > li:not([hidden])');
    });
  }, [on]);
  return (
    <nav className="ch-filter" aria-label="Show price changes for">
      <button type="button" aria-pressed={!on} onClick={() => setOn(null)}>
        All
      </button>
      {services.map((s) => (
        <button key={s.id} type="button" aria-pressed={on === s.id} onClick={() => setOn(on === s.id ? null : s.id)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {s.logo ? <img src={`/logos/${s.id}.png`} alt="" width={20} height={20} /> : null}
          {s.name}
          <span className="c">{s.n}</span>
        </button>
      ))}
    </nav>
  );
}
