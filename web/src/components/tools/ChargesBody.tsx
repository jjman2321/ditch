import { ChargeFinder } from './ChargeFinder';
import { ToolPage } from '@/components/ToolPage';
import { CYCLE_WORD, formatMoney } from '@/lib/money';
import { allPoints, countryList, type Biller, type Pt } from '@/lib/tools';

const APPLE_BILL = 'https://support.apple.com/102396';
const APPLE_REFUND = 'https://support.apple.com/118223';
const APPLE_SUBS = 'https://support.apple.com/en-us/118428';
const GOOGLE_HISTORY = 'https://support.google.com/googleplay/answer/2850369';

export const HUBS: Record<string, { biller: Biller; title: string; meta: string; lead: string }> = {
  'apple-com-bill': { biller: 'apple', title: 'What is APPLE.COM/BILL? Find the charge', meta: 'APPLE.COM/BILL charge: what is it?', lead: 'APPLE.COM/BILL is how Apple shows App Store and Apple subscription charges on your statement. Type the amount to see which subscriptions cost exactly that.' },
  google: { biller: 'google', title: 'What is this Google charge?', meta: 'Google charge on your statement: what is it?', lead: 'Google bills for Google One, YouTube Premium, YouTube Music, YouTube TV and Google AI plans. Type the amount to see which ones cost exactly that.' },
  amazon: { biller: 'amazon', title: 'What is this Amazon charge?', meta: 'Amazon subscription charge: what is it?', lead: 'Amazon bills for Prime and Amazon Music. Type the amount to see which plans cost exactly that.' },
};

/** Amounts we've checked for one biller in one country, grouped by amount (anchors like #9-99). */
function amountTable(pts: Pt[]) {
  const by = new Map<number, Pt[]>();
  for (const p of pts) by.set(p.a, [...(by.get(p.a) ?? []), p]);
  return [...by.entries()].sort((a, b) => a[0] - b[0]);
}

export function ChargesBody({ hub }: { hub: string | null }) {
  const h = hub ? HUBS[hub] : null;
  const points = allPoints();
  const biller = h?.biller ?? 'any';
  const usPts = points.filter((p) => p.c === 'US' && (!h || p.b === h.biller));
  const rows = amountTable(usPts);
  const top = h ? rows : rows.filter(([, ps]) => ps.length > 1 || ps[0].a % 100 === 99).slice(0, 40);
  const slug = hub ? `charges/${hub}` : 'charges';
  const title = h?.title ?? 'What is this charge? Subscription charge finder';
  const faq = [
    ...(biller === 'apple' || biller === 'any'
      ? [
          { q: 'What is APPLE.COM/BILL on my statement?', a: 'It’s how Apple shows charges for App Store purchases and subscriptions billed by Apple. Apple says these can appear as apple.com/bill or itunes.com/bill.' },
          { q: 'How do I see what Apple charged me for?', a: 'Sign in at reportaproblem.apple.com to see your purchases. If you use Family Sharing, a charge may be from someone else in your family group.' },
        ]
      : []),
    ...(biller === 'google' || biller === 'any' ? [{ q: 'How do I see what Google charged me for?', a: 'In the Play Store app, tap your profile icon, then Payments & subscriptions, then Budget & history. You can also check payments.google.com under Activity or Subscriptions & services.' }] : []),
    { q: 'Why doesn’t the amount match exactly?', a: 'In the US and Canada, listed prices are before sales tax, so your bank shows a little more. Some charges are one-off purchases, not subscriptions.' },
    { q: 'Does this tool see my bank or my statement?', a: 'No. It runs in your browser and only compares the amount you type with our checked price list. Nothing is sent anywhere.' },
  ];
  const more = (
      <>
        <h2 id="check">Where to check for sure</h2>
        {biller === 'apple' || biller === 'any' ? (
          <>
            <h3 className="h3s">Charged by Apple (APPLE.COM/BILL)</h3>
            <ol className="st">
              <li><span>Sign in at <b>reportaproblem.apple.com</b> to see what you bought.</span></li>
              <li><span>To stop a subscription, open <kbd>Settings</kbd> on your iPhone, tap your name, then <kbd>Subscriptions</kbd>.</span></li>
              <li><span>Use Family Sharing? Ask your family group. Their purchases can show up on your card.</span></li>
            </ol>
          </>
        ) : null}
        {biller === 'google' || biller === 'any' ? (
          <>
            <h3 className="h3s">Charged by Google</h3>
            <ol className="st">
              <li><span>In the Play Store app, tap your profile icon, then <kbd>Payments &amp; subscriptions</kbd>, then <kbd>Budget &amp; history</kbd>.</span></li>
              <li><span>Or go to <b>payments.google.com</b> and check <kbd>Activity</kbd> or <kbd>Subscriptions &amp; services</kbd>.</span></li>
            </ol>
          </>
        ) : null}
        {biller === 'amazon' || biller === 'any' ? (
          <>
            <h3 className="h3s">Charged by Amazon</h3>
            <ol className="st">
              <li><span>Sign in at <b>amazon.com</b> and open <kbd>Memberships &amp; Subscriptions</kbd> to see what renews.</span></li>
              <li><span>Check <kbd>Your Orders</kbd> for one-off digital purchases.</span></li>
            </ol>
          </>
        ) : null}
        {biller === 'any' ? (
          <>
            <h3 className="h3s">Charged by the company itself</h3>
            <p className="lead-s">Search your inbox for the company name and the amount. Receipts usually name the plan. Then use our cancel guide for that service.</p>
          </>
        ) : null}

        <h2 id="amounts">{h ? `${h.biller === 'apple' ? 'Apple' : h.biller === 'google' ? 'Google' : 'Amazon'} charges in the US, by amount` : 'Common subscription charges in the US, by amount'}</h2>
        <p className="lead-s">From our hand-checked price list. US prices are before sales tax.</p>
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
                <td>
                  {ps.map((p, i) => (
                    <span key={p.s + p.p}>
                      {i ? ' · ' : ''}
                      {p.n} {p.p} ({CYCLE_WORD[p.cy]})
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 id="sources-h" className="srcs-h">Sources</h2>
        <ul className="srcs">
          {[APPLE_BILL, APPLE_REFUND, APPLE_SUBS, GOOGLE_HISTORY].map((u) => (
            <li key={u}>
              <a href={u} rel="noopener">
                {u.replace(/^https?:\/\//, '')}
              </a>
            </li>
          ))}
        </ul>
      </>
  );
  return (
    <ToolPage more={more} slug={slug} title={title} lead={h?.lead ?? 'Found a charge you don’t recognise? Type the amount and who charged you, and see which subscriptions cost exactly that in your country.'} faq={faq} cta="Know every charge before it happens">
      <ChargeFinder countries={countryList()} biller={biller} />
    </ToolPage>
  );
}
