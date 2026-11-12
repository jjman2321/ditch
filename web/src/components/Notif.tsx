/* eslint-disable @next/next/no-img-element */
/** The lock-screen reminder, exactly as the app sends it. Static: it carries a price, so it never animates. */
export function Notif({ text, when = 'now', className = '', style }: { text: string; when?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`notif ${className}`} style={style} role="img" aria-label={`Ditch reminder: ${text}`}>
      <img src="/app-icon.png" alt="" width={40} height={40} />
      <div>
        <b>
          Ditch <span>{when}</span>
        </b>
        {text}
      </div>
    </div>
  );
}
