import { ChargeFinder } from './ChargeFinder';
import { ToolPage } from '@/components/ToolPage';
import { CYCLE_WORD, formatMoney } from '@/lib/money';
import { allPoints, countryList, planLabel, type Biller, type Pt } from '@/lib/tools';

const SRC = { apple: ['https://support.apple.com/102396', 'https://support.apple.com/118223'], google: ['https://support.google.com/googleplay/answer/2850369'], amazon: [] as string[] };

export const HUBS: Record<string, { biller: Biller; title: string; meta: string; lead: string; name: string; desc: string }> = {
  'apple-com-bill': { biller: 'apple', name: 'Apple', desc: 'App Store and Apple subscription charges, by amount.', title: 'APPLE.COM/BILL charge finder', meta: 'What is APPLE.COM/BILL? Find the charge by amount', lead: 'APPLE.COM/BILL is how Apple shows App Store and subscription charges. Type the amount to see what it could be.' },
  google: { biller: 'google', name: 'Google', desc: 'Google Play and Google subscription charges, by amount.', title: 'Google charge finder', meta: 'Google charge on your statement: find it by amount', lead: 'Google Play and Google subscriptions show up as Google on your statement. Type the amount to see what it could be.' },
  amazon: { biller: 'amazon', name: 'Amazon', desc: 'Prime and Amazon Music charges, by amount.', title: 'Amazon charge finder', meta: 'Amazon subscription charge: find it by amount', lead: 'Amazon bills for Prime and Amazon Music. Type the amount to see what it could be.' },
};

const HOW: Record<Biller | 'any', React.ReactNode[]> = {
  apple: [<>Sign in at <b>reportaproblem.apple.com</b> to see what you bought.</>, <>To stop it: <kbd>Settings</kbd> → your name → <kbd>Subscriptions</kbd>.</>, <>Use Family Sharing? It may be someone in your family group.</>],
  google: [<>Play Store app: profile icon → <kbd>Payments &amp; subscriptions</kbd> → <kbd>Budget &amp; history</kbd>.</>, <>Or check <b>payments.google.com</b> → <kbd>Subscriptions &amp; services</kbd>.</>],
  amazon: [<>Sign in at <b>amazon.com</b> → <kbd>Memberships &amp; Subscriptions</kbd>.</>, <>One-off digital buys are in <kbd>Your Orders</kbd>.</>],
  direct: [],
  any: [<>Type the amount and pick who charged you.</>, <>Check the matches against your email receipts.</>, <>Confirm with the company that billed you: Apple, Google, Amazon or the service itself.</>],
};

/** Amounts we've checked for one biller in the US, grouped by amount (anchors like #9-99). */
function amountTable(pts: Pt[]) {
  const by = new Map<number, Pt[]>();
  for (const p of pts) by.set(p.a, [...(by.get(p.a) ?? []), p]);
  return [...by.entries()].sort((a, b) => a[0] - b[0]);
}

export function ChargesBody({ hub }: { hub: string | null }) {
  const h = hub ? HUBS[hub] : null;
  const biller = h?.biller ?? 'any';
  const us = allPoints().filter((p) => p.c === 'US' && (!h || p.b === h.biller));
  const rows = amountTable(us);
  const top = h ? rows : rows.filter(([, ps]) => ps.length > 1).slice(0, 30);
  return (
    <ToolPage
      slug={hub ? `charges/${hub}` : 'charges'}
      title={h?.title ?? 'Subscription charge finder'}
      lead={h?.lead ?? 'Found a charge you don’t recognise? Type the amount and see which subscriptions cost exactly that.'}
      cta="Next time, know 3 days before"
      how={HOW[biller]}
      good={[
        'Matches come from prices we read on each service’s own page. Only the company that billed you can confirm it.',
        'US and Canada prices are before sales tax, so your bank shows a bit more. The tool allows for that.',
        'Nothing you type leaves your browser.',
      ]}
      sources={h ? SRC[h.biller as 'apple' | 'google' | 'amazon'] : [...SRC.apple, ...SRC.google]}
      faq={[
        ...(biller !== 'google' && biller !== 'amazon' ? [{ q: 'What is APPLE.COM/BILL on my statement?', a: 'Apple’s name for App Store and Apple subscription charges. Apple says they can also show as itunes.com/bill.' }] : []),
        ...(biller === 'google' ? [{ q: 'How do I see what Google charged me for?', a: 'In the Play Store app, tap your profile icon, then Payments & subscriptions, then Budget & history.' }] : []),
        ...(biller === 'amazon' ? [{ q: 'How do I see what Amazon charged me for?', a: 'Sign in at amazon.com and open Memberships & Subscriptions. One-off digital purchases are in Your Orders.' }] : []),
        { q: 'Why doesn’t the amount match exactly?', a: 'Tax may be added, or it may be a one-off purchase rather than a subscription.' },
      ]}
      extra={
        <section className="v4-sec" aria-labelledby="amounts">
          <h2 id="amounts">{h ? `${h.name} charges by amount (US)` : 'Common charges by amount (US)'}</h2>
          <table className="ttable">
            <thead>
              <tr>
                <th scope="col">Amount</th>
                <th scope="col">Could be</th>
              </tr>
            </thead>
            <tbody>
              {top.map(([a, ps]) => (
                <tr key={a} id={(a / 100).toFixed(2).replace('.', '-')}>
                  <td>
                    <b className="num">{formatMoney(a, 'USD')}</b>
                  </td>
                  <td>{ps.map((p) => `${planLabel(p.n, p.p)} (${CYCLE_WORD[p.cy]})`).join(' · ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      }
    >
      <ChargeFinder countries={countryList()} biller={biller} />
    </ToolPage>
  );
}
