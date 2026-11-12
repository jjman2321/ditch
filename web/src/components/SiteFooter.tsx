import Link from 'next/link';

import { priceHubServices, publishedGuides } from '@/lib/data';
import { COMPANY } from '@/lib/site';

/** Dark footer card: link columns that help people (and search engines) reach every guide, plus the giant wordmark. */
export function SiteFooter() {
  const guides = publishedGuides().slice(0, 8);
  const hubs = priceHubServices().slice(0, 8);
  return (
    <footer className="ftr on-ink">
      <div className="wrap">
        <div className="cols">
          <nav aria-label="Cancel guides">
            <p className="ttl">Cancel guides</p>
            {guides.map((g) => (
              <Link key={g.id} href={`/cancel/${g.id}`}>
                Cancel {g.name}
              </Link>
            ))}
            <Link href="/cancel">All guides →</Link>
          </nav>
          <nav aria-label="Prices">
            <p className="ttl">Prices</p>
            {hubs.map((s) => (
              <Link key={s.id} href={`/prices/${s.id}`}>
                {s.name} prices
              </Link>
            ))}
            <Link href="/prices">All prices →</Link>
          </nav>
          <nav aria-label="Ditch">
            <p className="ttl">Ditch</p>
            <Link href="/#pricing" prefetch={false}>Pricing</Link>
            <Link href="/#join" prefetch={false}>Join the waitlist</Link>
            <Link href="/support">Support</Link>
            <Link href="/how-we-check">How we check prices</Link>
            <Link href="/about">About</Link>
          </nav>
          <nav aria-label="Legal">
            <p className="ttl">Legal</p>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href="mailto:support@ditchsubs.app">support@ditchsubs.app</a>
          </nav>
        </div>
        <div className="giant" aria-hidden>
          <svg viewBox="0 0 1000 250" preserveAspectRatio="xMidYMid meet">
            <text x="0" y="214" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="#FFCC2E" style={{ fontFamily: 'var(--f-wordmark)', fontSize: 300 }}>
              ditch
            </text>
          </svg>
        </div>
        <div className="legal">
          <span>
            © 2026 {COMPANY} · Made by <Link href="/about" style={{ display: 'inline', minHeight: 0, color: '#A69E8C', textDecoration: 'underline' }}>Aribo</Link>
          </span>
          <span>Not affiliated with any service shown. Names and logos belong to their owners.</span>
        </div>
      </div>
    </footer>
  );
}
