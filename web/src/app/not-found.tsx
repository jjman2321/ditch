/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { publishedGuides } from '@/lib/data';

export default function NotFound() {
  return (
    <div className="wrap doc" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src="/duck.webp" alt="" width={200} height={117} loading="lazy" />
      <h1 style={{ marginTop: 8 }}>Nothing here. Not even a subscription.</h1>
      <p className="lead" style={{ marginTop: 16 }}>Try one of these instead.</p>
      <div className="chips" style={{ justifyContent: 'center' }}>
        {publishedGuides()
          .slice(0, 6)
          .map((g) => (
            <Link key={g.id} href={`/cancel/${g.id}`}>
              Cancel {g.name}
            </Link>
          ))}
      </div>
      <Link className="btn" href="/" style={{ marginTop: 32 }}>
        Go home
      </Link>
    </div>
  );
}
