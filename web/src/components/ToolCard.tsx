/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { SERVICE_TOOLS, TOOLS } from '@/lib/tools';

/** Line icons for tools that aren't about one service. 24px, ink stroke. */
const ICON: Record<string, React.ReactNode> = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></>,
  cal: <><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  sum: <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8M8 12h3M13 12h3M8 16h3M13 16h3" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
  grid: <><rect x="3.5" y="4" width="17" height="16" rx="2.5" /><path d="M3.5 9.5h17M3.5 15h17M10 4v16" /></>,
  swap: <path d="M4 8h14l-3-3M20 16H6l3 3" />,
  people: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 19c0-3 3-5 6-5s6 2 6 5M15 14.5c3 0 6 1.5 6 4.5" /></>,
  back: <><path d="M9 14L4 9l5-5" /><path d="M4 9h10a6 6 0 010 12h-3" /></>,
  repeat: <><path d="M17 3l3 3-3 3" /><path d="M4 11V9a3 3 0 013-3h13M7 21l-3-3 3-3" /><path d="M20 13v2a3 3 0 01-3 3H4" /></>,
  apple: <path d="M15.5 3.5c0 1.3-1 2.6-2.3 2.8-.2-1.3.9-2.6 2.3-2.8zM18.5 15.8c-.6 1.4-1.5 3-2.7 3-1 0-1.4-.6-2.6-.6s-1.6.6-2.6.6c-1.2 0-2.1-1.5-2.8-2.9-1.5-2.9-1.2-6.6 1-7.6 1-.5 2-.3 2.7 0 .6.2 1 .4 1.6.4s1.1-.3 1.8-.5c1-.3 2.2-.1 3 .8-2.5 1.4-2 5 .6 6.8z" />,
};
export function ToolIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICON[name] ?? ICON.sum}
    </svg>
  );
}

/** What each tool shows on its card: real service logos, or an icon. */
const VISUAL: Record<string, { logos?: string[]; icon?: string }> = {
  charges: { icon: 'search' },
  'charges/apple-com-bill': { icon: 'apple' },
  'charges/google': { logos: ['google-one'] },
  'charges/amazon': { logos: ['amazon-prime'] },
  'tools/subscription-cost-calculator': { icon: 'sum' },
  'tools/free-trial-calculator': { icon: 'cal' },
  'tools/apple-one-calculator': { icon: 'apple' },
  'tools/monthly-vs-yearly': { icon: 'repeat' },
  'tools/family-plan-split': { icon: 'people' },
  'tools/compare-prices': { icon: 'swap' },
  'tools/cost-per-hour': { icon: 'clock' },
  'tools/refund-helper': { icon: 'back' },
  'tools/subscription-spreadsheet': { icon: 'grid' },
};
for (const t of SERVICE_TOOLS) {
  VISUAL[`tools/${t.slug}`] = t.kind === 'vs' ? { logos: [t.a!, t.b!] } : t.kind === 'bundle' ? { logos: ['disney-plus', 'hulu'] } : { logos: [t.s!] };
}
export const visualOf = (path: string) => VISUAL[path] ?? { icon: 'sum' };

export function Visual({ path, size = 44 }: { path: string; size?: number }) {
  const v = visualOf(path);
  if (v.logos?.length === 2) {
    const s = Math.round(size * 0.82);
    return (
      <span className="tv pair" aria-hidden>
        {v.logos.map((id) => (
          <img key={id} className="logo" src={`/logos/${id}.png`} alt="" width={s} height={s} loading="lazy" />
        ))}
      </span>
    );
  }
  if (v.logos?.length) return <img className="logo tv" src={`/logos/${v.logos[0]}.png`} alt="" width={size} height={size} loading="lazy" aria-hidden />;
  return (
    <span className="tv ic" aria-hidden>
      <ToolIcon name={v.icon!} />
    </span>
  );
}

export type CardItem = { href: string; name: string; desc: string };
export function ToolCard({ item }: { item: CardItem }) {
  return (
    <Link className="tcard" href={item.href}>
      <Visual path={item.href.replace(/^\//, '')} />
      <span>
        <b>{item.name}</b>
        <small>{item.desc}</small>
      </span>
    </Link>
  );
}

/** Every tool as a card item, for "More free tools". */
export const allToolItems = (): CardItem[] => [
  ...TOOLS.map((t) => ({ href: `/${t.slug}`, name: t.name, desc: t.desc })),
  ...SERVICE_TOOLS.map((t) => ({ href: `/tools/${t.slug}`, name: t.name, desc: t.desc })),
];
