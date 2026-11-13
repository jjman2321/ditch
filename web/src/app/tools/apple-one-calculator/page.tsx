import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { AppleOne } from '@/components/tools/AppleOne';
import { formatMoney } from '@/lib/money';
import { allPoints, countryList } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Apple One calculator: is Apple One worth it for you?',
  description: 'Tick the Apple services you’d pay for anyway. See whether Apple One Individual, Family or Premier costs less, in your country.',
  alternates: { canonical: '/tools/apple-one-calculator' },
};

export default function Page() {
  const us = (s: string, p?: string) => allPoints().find((x) => x.c === 'US' && x.s === s && (!p || x.p === p) && x.cy === 'monthly')!.a;
  const sep = us('apple-music', 'Individual') + us('apple-tv') + us('apple-arcade') + us('icloud', '50 GB');
  const one = us('apple-one', 'Individual');
  return (
    <ToolPage
      slug="tools/apple-one-calculator"
      title="Apple One calculator"
      lead="Apple One, or each Apple service on its own: which costs less for you."
      how={['Pick your country and who it’s for.', 'Tick the Apple services you’d pay for anyway.', 'See the cheapest Apple One plan next to paying for each one.']}
      good={[<>In the US, Music, TV, Arcade and iCloud+ 50 GB cost {formatMoney(sep, 'USD')} a month on their own. Apple One Individual is {formatMoney(one, 'USD')}.</>, 'Individual: Music, TV, Arcade, iCloud+ 50 GB. Family: the same with 200 GB, for up to 6 people. Premier: adds Fitness+, News+ and 2 TB.']}
      sources={['https://www.apple.com/apple-one/']}
      faq={[
        { q: 'Is Apple One worth it?', a: 'Only if you’d pay for at least two of its services anyway. For just Apple Music or just iCloud+, paying for that one service is less.' },
        { q: 'Is Apple News+ in every country?', a: 'No. Where it isn’t sold, the calculator leaves it out.' },
      ]}
    >
      <AppleOne countries={countryList()} />
    </ToolPage>
  );
}
