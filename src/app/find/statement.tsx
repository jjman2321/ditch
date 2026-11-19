// Drop in a statement: a CSV export (Apple Card, most banks) or a statement
// PDF. We show the charges that repeat; nothing is added until it's ticked.

import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { FindPage, SHOW_SAMPLES } from '@/find/Parts';
import { PhoneMock, Steps, type MockRow } from '@/find/Visual';
import { readDocument } from '@/import/device';
import { SAMPLE_STATEMENT } from '@/import/samples';
import { setFindResult } from '@/import/session';
import { readStatement } from '@/import/statement';
import { useApp } from '@/state/app';
import { Button, Segmented, Txt } from '@/ui/sunflower';

type Source = 'bank' | 'card' | 'paypal';
const SOURCES: { key: Source; label: string; screen: string; rows: MockRow[]; steps: string[] }[] = [
  {
    key: 'bank',
    label: 'Most banks',
    screen: 'Statements',
    rows: [
      { text: 'November 2026', sub: 'PDF', hi: true },
      { text: 'October 2026', sub: 'PDF' },
      { text: 'September 2026', sub: 'PDF' },
    ],
    steps: ['Open your bank’s app or website.', 'Tap **Statements**.', 'Download 2–3 months as **PDF** or **CSV**.'],
  },
  {
    key: 'card',
    label: 'Apple Card',
    screen: 'November Statement',
    rows: [{ text: 'Statement Balance', sub: '$412.38' }, { text: 'Payment Due', sub: 'Dec 31' }, { text: 'Export Transactions', hi: true }],
    steps: ['Open **Wallet** and tap **Apple Card**.', 'Tap **Card Balance**, then a month.', 'Tap **Export Transactions**.'],
  },
  {
    key: 'paypal',
    label: 'PayPal',
    screen: 'Statements',
    rows: [{ text: 'Monthly statements' }, { text: 'Activity download', hi: true }, { text: 'Tax documents' }],
    steps: ['Tap **Activity**, then **Statements**.', 'Tap **Activity download**.', 'Pick the dates, choose **CSV** and download.'],
  },
];

export default function Statement() {
  const [source, setSource] = useState<Source>('bank');
  const src = SOURCES.find((x) => x.key === source)!;
  const app = useApp();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const dayFirst = !['US', 'CA'].includes(app.settings.country ?? 'US');

  const finish = (text: string) => {
    const r = readStatement(text, app.today, app.settings.currency, dayFirst ? 'dmy' : 'mdy');
    if (!r.read) {
      setProblem('We couldn’t find any charges in that file. Try the CSV export, or a different month.');
      return;
    }
    const note = r.found.length ? null : `We read ${r.read} charges but none repeat yet. A file with 2–3 months finds more.`;
    setFindResult({ found: r.found, source: 'statement', appleCharges: r.appleCharges, note });
    router.push('/find/review');
  };

  const pick = async () => {
    setProblem(null);
    const res = await DocumentPicker.getDocumentAsync({
      type: ['text/csv', 'text/comma-separated-values', 'application/pdf', 'text/plain', 'public.comma-separated-values-text'],
      copyToCacheDirectory: true,
    });
    if (res.canceled || !res.assets.length) return;
    setBusy(true);
    try {
      finish(await readDocument(res.assets[0]));
    } catch (e) {
      setProblem(String((e as Error).message).includes('pdf') ? 'Reading PDFs needs the new Ditch build. A CSV export works now.' : 'We couldn’t open that file. Try exporting it again as CSV.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <FindPage
      title="Drop in a statement"
      intro="2–3 months finds the most: a monthly charge has to show up twice."
      footer={
        <>
          <Button label={busy ? 'Reading…' : 'Pick a CSV or PDF'} disabled={busy} onPress={pick} />
          {SHOW_SAMPLES ? <Button kind="text" label="Try with a sample (test builds)" onPress={() => finish(SAMPLE_STATEMENT)} /> : null}
        </>
      }
    >
      {/* Pick where it comes from, then see the screen and the three taps (no arrow chains, owner Nov 19). */}
      <Segmented options={SOURCES.map((x) => ({ value: x.key, label: x.label }))} value={source} onChange={setSource} label="Where your statement comes from" style={{ marginTop: 18 }} />
      <PhoneMock title={src.screen} rows={src.rows} label={`Picture of the ${src.screen} screen, with ${src.rows.find((r) => r.hi)?.text ?? ''} highlighted`} />
      <Steps steps={src.steps} />
      {busy ? <ActivityIndicator style={{ marginTop: 20 }} /> : null}
      {problem ? (
        <Txt v="body" style={{ marginTop: 16 }} accessibilityLiveRegion="polite">
          {problem}
        </Txt>
      ) : null}
      <Txt v="sub" tone="mute" center style={{ marginTop: 18 }}>
        Read on your iPhone, never uploaded or kept.
      </Txt>
    </FindPage>
  );
}
