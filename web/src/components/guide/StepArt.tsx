import { Logo } from '../Logo';

/** The button or menu name a step asks you to tap: the first Capitalised phrase after Tap/Open/Select…, else a web address. */
export function tapLabel(step: string): string | null {
  const m = step.match(/(?:Tap|tap|then|Select|select|Choose|choose|Click|click|Open|open) ((?:[A-Z][\w’'+&-]*)(?: (?:[A-Z][\w’'+&-]*|your|the|my|plan|subscription|membership|account|&))*)/);
  if (m) return m[1];
  const u = step.match(/\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|tv|co|app|org)(?:\/[^\s,]*)?/);
  return u ? u[0] : null;
}
/** The web address a step mentions (e.g. netflix.com/cancelplan), if any. */
export const stepUrl = (step: string) => step.match(/\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|tv|co|app|org)(?:\/[^\s,]*)?/)?.[0] ?? null;

/** Ink or white text, whichever reads better on the brand colour. */
function onColor(hex?: string) {
  const h = (hex ?? '#16140F').replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179 ? '#16140F' : '#FFFFFF';
}

/**
 * A drawing of the screen for one step, made for this service: its brand colour, logo and name, the real web
 * address, and the exact button to tap highlighted in sunflower with a tap ring. Generic device shapes only
 * (no Apple device drawing or Apple logo, per Apple's marketing rules).
 */
export function StepArt({ kind, serviceId, name, color, label, url, rows, title }: { kind: 'web' | 'phone'; serviceId: string; name: string; color?: string; label: string | null; url?: string | null; rows?: string[]; title?: string }) {
  const fg = onColor(color);
  const brand = { ['--brand' as string]: color ?? '#16140F', ['--on-brand' as string]: fg } as React.CSSProperties;
  if (kind === 'web') {
    return (
      <div className="sa sa-web" style={brand} aria-hidden>
        <div className="sa-bar">
          <i />
          <i />
          <i />
          {url ? <span className="sa-url">{url}</span> : null}
        </div>
        <div className="sa-top">
          <Logo id={serviceId} size={22} />
          <b>{name}</b>
          <span>{title ?? 'Account'}</span>
        </div>
        <div className="sa-body">
          <span className="sa-line w80" />
          <span className="sa-line w60" />
          {label ? (
            <span className="sa-btn">
              {label}
              <span className="sa-tap" />
            </span>
          ) : null}
        </div>
      </div>
    );
  }
  const list = rows?.length ? rows : [];
  const hitIn = label ? list.findIndex((r) => r.toLowerCase() === label.toLowerCase()) : -1;
  return (
    <div className="sa sa-phone" style={brand} aria-hidden>
      <div className="sa-notch" />
      <div className="sa-ptop">
        <Logo id={serviceId} size={18} />
        <b>{title ?? name}</b>
      </div>
      <div className="sa-body">
        {list.map((r, i) => (
          <span key={r + i} className={`sa-row${i === hitIn ? ' hit' : ''}`}>
            {r}
            {i === hitIn ? <span className="sa-tap" /> : <em>›</em>}
          </span>
        ))}
        {hitIn < 0 && label ? (
          <span className="sa-btn">
            {label}
            <span className="sa-tap" />
          </span>
        ) : null}
        {!list.length && !label ? <span className="sa-line w70" /> : null}
      </div>
    </div>
  );
}
