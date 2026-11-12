// The DITCHED stamp, drawn like the app's (src/ui/sunflower/Stamp.tsx): wobbly double border, worn ink speckles.
// Deterministic for a given date. It lands once when scrolled into view (CSS), static with Reduce Motion.

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x9e3779b9) >>> 0;
    return (s % 10_000) / 10_000;
  };
}

function wobblyRect(x: number, y: number, w: number, h: number, r: number, amp: number, rand: () => number): string {
  const pts: [number, number][] = [];
  const steps = 9;
  const edge = (x1: number, y1: number, x2: number, y2: number) => {
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      pts.push([x1 + (x2 - x1) * t + (rand() - 0.5) * amp, y1 + (y2 - y1) * t + (rand() - 0.5) * amp]);
    }
  };
  edge(x + r, y, x + w - r, y);
  edge(x + w, y + r, x + w, y + h - r);
  edge(x + w - r, y + h, x + r, y + h);
  edge(x, y + h - r, x, y + r);
  return `M${pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' L')} Z`;
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function Stamp({ date, paper = '#FBF7EE', still = false }: { date: string; paper?: string; still?: boolean }) {
  const [y, m, d] = date.split('-').map(Number);
  const rand = rng(y * 400 + m * 31 + d);
  const W = 300;
  const H = 128;
  const specks = Array.from({ length: 90 }, () => ({ cx: 8 + rand() * (W - 16), cy: 6 + rand() * (H - 12), r: 0.5 + rand() * 1.3 }));
  return (
    <div className="stamp" data-reveal={still ? undefined : true} role="img" aria-label={`Ditched stamp, ${MONTHS[m - 1]} ${d}, ${y}`}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <path d={wobblyRect(5, 5, W - 10, H - 10, 12, 1.6, rand)} stroke="#16140F" strokeWidth={7} fill="none" strokeLinejoin="round" />
        <path d={wobblyRect(17, 17, W - 34, H - 34, 7, 1.1, rand)} stroke="#16140F" strokeWidth={3.2} fill="none" strokeLinejoin="round" />
        <text x={W / 2} y={71} textAnchor="middle" fill="#16140F" style={{ fontFamily: 'var(--f-display)', fontSize: 43, letterSpacing: -0.5 }}>
          DITCHED
        </text>
        <text x={W / 2} y={96} textAnchor="middle" fill="#16140F" style={{ fontFamily: 'var(--f-widebold)', fontSize: 13, letterSpacing: 2 }}>
          {`${MONTHS[m - 1]} ${d}, ${y}`}
        </text>
        {specks.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={paper} />
        ))}
      </svg>
    </div>
  );
}
