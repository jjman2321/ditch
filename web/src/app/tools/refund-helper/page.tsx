import type { Metadata } from 'next';

import { ToolPage } from '@/components/ToolPage';
import { RefundHelper } from '@/components/tools/RefundHelper';

export const metadata: Metadata = {
  title: 'Subscription refund helper: how to ask for your money back',
  description: 'Forgot to cancel? Answer two questions and get the official place to ask Apple, Google, Amazon or the company for a refund, with the exact steps.',
  alternates: { canonical: '/tools/refund-helper' },
};

export default function Page() {
  return (
    <ToolPage
      slug="tools/refund-helper"
      title="Subscription refund helper"
      lead="Forgot to cancel, or don’t recognise a charge? Answer two questions and get the official place to ask."
      faq={[
        { q: 'How do I get a refund from Apple for a subscription?', a: 'Sign in at reportaproblem.apple.com, tap I’d like to, then Request a refund. Choose the reason and the subscription, then Submit. Apple decides each request.' },
        { q: 'Can I get a refund if I forgot to cancel?', a: 'Sometimes. It depends on who billed you, the country and how long ago it was. Ask soon after the charge.' },
        { q: 'How do I stop it happening again?', a: 'Cancel the subscription so it doesn’t renew, and set a reminder before the next charge.' },
      ]}
      more={
        <>
          <h2>Sources</h2>
          <ul className="srcs">
            <li><a href="https://support.apple.com/118223" rel="noopener">support.apple.com/118223</a></li>
            <li><a href="https://support.google.com/googleplay/answer/2479637" rel="noopener">support.google.com/googleplay/answer/2479637</a></li>
            <li><a href="https://support.google.com/googleplay/answer/2850369" rel="noopener">support.google.com/googleplay/answer/2850369</a></li>
          </ul>
        </>
      }
    >
      <RefundHelper />
    </ToolPage>
  );
}
