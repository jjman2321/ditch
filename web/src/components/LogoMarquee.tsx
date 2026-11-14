/* eslint-disable @next/next/no-img-element */
import { hasLogo, serviceById } from '@/lib/data';

const IDS = ['netflix', 'spotify', 'chatgpt-plus', 'disney-plus', 'youtube-premium', 'amazon-prime', 'apple-music', 'max', 'hulu', 'claude-pro', 'microsoft-365', 'xbox-game-pass', 'playstation-plus', 'paramount-plus', 'peacock', 'audible', 'duolingo', 'adobe-cc', 'icloud', 'google-one'];

/** A slow band of real service logos (no prices). Doubled so the loop has no seam; the copy is hidden from screen readers. */
export function LogoMarquee() {
  const list = IDS.filter((id) => hasLogo(id) && serviceById(id));
  const row = (hidden: boolean) => (
    <ul className="mq-row" aria-hidden={hidden || undefined}>
      {list.map((id) => (
        <li key={id}>
          <img src={`/logos/${id}.png`} alt="" width={36} height={36} loading="lazy" />
          <span>{serviceById(id)!.name}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section className="mq" aria-label="Some of the 200+ subscriptions you can track">
      <div className="mq-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
