import type { Metadata } from 'next';

import { COUNTRIES } from '@/lib/data';
import { pageTitle, og } from '@/lib/site';

import { ChargesBody } from '@/components/tools/ChargesBody';

export const metadata: Metadata = {
  title: pageTitle('What is this charge on my bank statement? Free finder'),
  description: `Type the amount from your bank statement and see which subscriptions cost exactly that, from hand-checked prices in ${COUNTRIES.length} countries. Free, in your browser.`,
  alternates: { canonical: '/charges' }, openGraph: og('/charges'),
};

export default function Page() {
  return <ChargesBody hub={null} />;
}
