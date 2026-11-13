import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { RefundHelper } from '@/components/tools/RefundHelper';

export const metadata: Metadata = {
  title: 'Subscription refund helper: where to ask for your money back',
  description: 'Forgot to cancel? Answer two questions and get the official place to ask Apple, Google, Amazon or the company for a refund.',
  alternates: { canonical: '/tools/refund-helper' },
};

export default function Page() {
  return (
    <ToolPage
      wide
      slug="tools/refund-helper"
      title="Subscription refund helper"
      lead="Forgot to cancel? Find the official place to ask for a refund."
      how={['Pick who charged you.', 'Say whether you signed up.', 'Follow the official steps.']}
      good={['Nobody can promise a refund. Each company decides, and asking soon helps.', 'Cancel too, so it doesn’t charge again.']}
      sources={['https://support.apple.com/118223', 'https://support.google.com/googleplay/answer/2479637', 'https://support.google.com/googleplay/answer/2850369']}
      faq={[
        { q: 'How do I get a refund from Apple for a subscription?', a: 'Sign in at reportaproblem.apple.com, tap I’d like to, then Request a refund. Pick the reason and the subscription, then Submit.' },
        { q: 'Can I get a refund if I forgot to cancel?', a: 'Sometimes. It depends on who billed you, your country and how long ago it was.' },
      ]}
    >
      <RefundHelper />
    </ToolPage>
  );
}
