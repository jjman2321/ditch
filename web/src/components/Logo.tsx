/* eslint-disable @next/next/no-img-element -- small static PNGs from /public; plain <img> keeps pages light */
import { hasLogo, serviceById } from '@/lib/data';

/** A service's real app icon, or a brand-colour monogram tile when there's no logo. Decorative: the name is always next to it. */
export function Logo({ id, size = 40, className = '' }: { id: string; size?: number; className?: string }) {
  const s = serviceById(id);
  if (hasLogo(id)) {
    return <img className={`logo ${className}`} src={`/logos/${id}.png`} alt="" width={size} height={size} loading="lazy" decoding="async" style={{ width: size, height: size }} />;
  }
  return (
    <span className={`mono ${className}`} aria-hidden style={{ width: size, height: size, background: s?.color ?? '#6B6559', fontSize: Math.round(size * 0.34) }}>
      {s?.mono ?? s?.name.slice(0, 1) ?? '?'}
    </span>
  );
}
