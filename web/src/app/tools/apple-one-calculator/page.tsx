import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { AppleOne } from '@/components/tools/AppleOne';
import { formatMoney } from '@/lib/money';
import { allPoints, countryList } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Apple One calculator: is Apple One worth it for you?',
  description: 'Tick the Apple services you’d pay for anyway and see whether Apple One Individual, Family or Premier costs less than paying for each one, in your country.',
  alternates: { canonical: '/tools/apple-one-calculator' },
};

const IDS = new Set(['apple-one', 'apple-music', 'apple-tv', 'apple-arcade', 'apple-fitness', 'apple-news', 'icloud']);

export default function Page() {
  const pts = allPoints().filter((p) => IDS.has(p.s));
  const us = (s: string, p?: string) => pts.find((x) => x.c === 'US' && x.s === s && (!p || x.p === p) && x.cy === 'monthly')!.a;
  const sep = us('apple-music', 'Individual') + us('apple-tv') + us('apple-arcade') + us('icloud', '50 GB');
  const one = us('apple-one', 'Individual');
  return (
    <ToolPage
      slug="tools/apple-one-calculator"
      title="Apple One calculator"
      lead="Tick what you’d pay for anyway. See whether Apple One costs less than paying for each Apple service on its own."
      faq={[
        { q: 'What’s in each Apple One plan?', a: 'Individual: Apple Music, Apple TV, Apple Arcade and iCloud+ 50 GB. Family: the same with iCloud+ 200 GB, shared with up to five people. Premier: Family plus Apple Fitness+, Apple News+ and iCloud+ 2 TB.' },
        { q: 'Is Apple One worth it?', a: 'Only if you’d pay for at least two of its services anyway. If you only want Apple Music or only iCloud+, paying for that one service is less.' },
        { q: 'Is Apple News+ in every country?', a: 'No. Where it isn’t sold, the calculator leaves it out of the total.' },
      ]}
      more={
        <>
          <h2>Worked example</h2>
          <p className="lead-s">
            In the US, Apple Music, Apple TV, Apple Arcade and iCloud+ 50 GB bought one by one cost {formatMoney(sep, 'USD')} a month. Apple One Individual is {formatMoney(one, 'USD')}, so it’s <b>{formatMoney(sep - one, 'USD')} a month less</b> if you’d use all four.
          </p>
        </>
      }
    >
      <AppleOne countries={countryList()} />
    </ToolPage>
  );
}
