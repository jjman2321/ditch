/* eslint-disable @next/next/no-img-element -- small static PNGs from /public; plain <img> keeps pages light */
import { hasLogo, serviceById } from '@/lib/data';

/** A service's real app icon, or a brand-colour monogram tile when there's no logo. Decorative: the name is always next to it. */
export function Logo({ id, size = 40, className = '' }: { id: string; size?: number; className?: string }) {
  const s = serviceById(id);
  if (hasLogo(id)) {
    return <img className={`logo ${className}`} src={`/logos/${id}.png`} alt="" width={size} height={size} loading="lazy" decoding="async" style={{ width: size, height: size }} />;
  }
  const bg = s?.color ?? '#6B6559';
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(bg.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return (
    <span className={`mono ${className}`} aria-hidden style={{ width: size, height: size, background: bg, color: lum > 0.179 ? '#16140F' : '#fff', fontSize: Math.max(11, Math.round(size * 0.34)) }}>
      {s?.mono ?? s?.name.slice(0, 1) ?? '?'}
    </span>
  );
}
