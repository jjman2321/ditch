import type { Metadata } from 'next';

import { ChargesBody } from '@/components/tools/ChargesBody';

export const metadata: Metadata = {
  title: 'What is this charge? Free subscription charge finder',
  description: 'Type the amount from your bank statement and see which subscriptions cost exactly that, from a hand-checked price list for 17 countries. Free, runs in your browser.',
  alternates: { canonical: '/charges' },
};

export default function Page() {
  return <ChargesBody hub={null} />;
}
