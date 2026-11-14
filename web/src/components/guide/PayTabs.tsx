'use client';

import { useEffect, useState } from 'react';

export type PayTab = { id: string; label: string; icon: React.ReactNode; hint: string; content: React.ReactNode };

/**
 * "How do you pay?" as tabs (after 1Password's platform tabs on Mobbin). Every panel stays in the page's HTML,
 * so the page keeps all its text for search; only the chosen one shows. Links to #apple, #google… open that tab.
 */
export function PayTabs({ tabs }: { tabs: PayTab[] }) {
  const [on, setOn] = useState(tabs[0]?.id);
  useEffect(() => {
    const pick = () => {
      const h = location.hash.slice(1);
      if (tabs.some((t) => t.id === h)) setOn(h);
    };
    pick();
    window.addEventListener('hashchange', pick);
    return () => window.removeEventListener('hashchange', pick);
  }, [tabs]);
  return (
    <div className="paytabs">
      <div className="pt-list" role="tablist" aria-label="How do you pay?">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={on === t.id}
            aria-controls={t.id}
            className={on === t.id ? 'on' : undefined}
            onClick={() => setOn(t.id)}
            onKeyDown={(e) => {
              const i = tabs.findIndex((x) => x.id === t.id);
              const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
              if (n === null) return;
              const next = tabs[(n + tabs.length) % tabs.length];
              setOn(next.id);
              document.getElementById(`tab-${next.id}`)?.focus();
            }}
            tabIndex={on === t.id ? 0 : -1}
          >
            <span className="pt-ic">{t.icon}</span>
            <span className="pt-tx">
              <b>{t.label}</b>
              <small>{t.hint}</small>
            </span>
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <section key={t.id} id={t.id} role="tabpanel" aria-labelledby={`tab-${t.id}`} className={`pt-panel${on === t.id ? ' on' : ''}`} tabIndex={0}>
          {t.content}
        </section>
      ))}
    </div>
  );
}
