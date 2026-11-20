// Drop in a statement: a CSV export (Apple Card, most banks) or a statement
// PDF. We show the charges that repeat; nothing is added until it's ticked.

import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';

import { FindPage, PrivateNote, SHOW_SAMPLES } from '@/find/Parts';
import { PhoneMock, Steps, type MockRow } from '@/find/Visual';
import { readDocument, readFailure, type ReadFailure } from '@/import/device';
import { SAMPLE_STATEMENT } from '@/import/samples';
import { setFindResult } from '@/import/session';
import { readStatement } from '@/import/statement';
import { useApp } from '@/state/app';
import { Button, Notice, Segmented } from '@/ui/sunflower';

type Asset = DocumentPicker.DocumentPickerAsset;
type Problem = { title: string; line: string };
const PROBLEMS = {
  password: { title: 'This PDF has a password', line: 'Your bank’s PDFs often do. Type it once and we’ll read it. It isn’t saved.' },
  noPdf: { title: 'PDFs need the newest Ditch', line: 'Export a CSV from your bank instead. That works now.' },
  broken: { title: 'That file wouldn’t open', line: 'Download it again from your bank, or use the CSV.' },
} satisfies Record<string, Problem>;

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
    steps: ['Open your bank’s app or website.', 'Tap **Statements**.', 'Download **3 months** as **PDF** or **CSV**.'],
  },
  {
    key: 'card',
    label: 'Apple Card',
    screen: 'October Statement',
    rows: [
      { text: 'Statement Balance', sub: '$412.38' },
      { text: 'Payment Due', sub: 'Nov 30' },
      { text: 'Export Transactions', hi: true },
    ],
    steps: [
      'Open **Wallet** and tap **Apple Card**.',
      'Tap **Card Balance**, then a month under **Statements**.',
      'Tap **Export Transactions**, pick **CSV**, then **Save to Files**. Do it for 2–3 months.',
    ],
  },
  {
    key: 'paypal',
    label: 'PayPal',
    screen: 'Statements',
    rows: [{ text: 'Monthly statements' }, { text: 'Activity download', hi: true }, { text: 'Tax documents' }],
    steps: [
      'Go to **paypal.com** in Safari and sign in. Tap **Activity**, then **Statements**.',
      'Tap **Activity download**.',
      'Pick the last 3 months, choose **CSV**, tap **Create report**, then **Download**.',
    ],
  },
];

export default function Statement() {
  const app = useApp();
  // Apple Card is US only, so the tab only shows there.
  const sources = SOURCES.filter((x) => x.key !== 'card' || (app.settings.country ?? 'US') === 'US');
  const [source, setSource] = useState<Source>('bank');
  const src = sources.find((x) => x.key === source) ?? sources[0];
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [locked, setLocked] = useState<Asset[]>([]);
  const dayFirst = !['US', 'CA'].includes(app.settings.country ?? 'US');

  const finish = (text: string | string[], skipped = 0) => {
    const r = readStatement(text, app.today, app.settings.currency, dayFirst ? 'dmy' : 'mdy');
    if (!r.read) {
      setProblem({ title: 'No charges in that file', line: 'Try the CSV export, or a different month.' });
      return;
    }
    const skippedLine = skipped ? ` We couldn’t open ${skipped === 1 ? '1 file' : `${skipped} files`}, so we skipped ${skipped === 1 ? 'it' : 'them'}.` : '';
    const note = r.found.length ? skippedLine.trim() || null : `We read ${r.read} charges but none repeat yet. Add 2–3 months to find more.${skippedLine}`;
    setFindResult({ found: r.found, source: 'statement', appleCharges: r.appleCharges, note });
    router.push('/find/review');
  };

  // Each file on its own, so one bad file doesn't sink the others (audit, Nov 20).
  const read = async (assets: Asset[], password?: string) => {
    setBusy(true);
    setProblem(null);
    const texts: string[] = [];
    const failures: ReadFailure[] = [];
    const needPassword: Asset[] = [];
    for (const a of assets) {
      try {
        texts.push(await readDocument(a, password));
      } catch (e) {
        const why = readFailure(e);
        if (why === 'password' || why === 'wrong-password') needPassword.push(a);
        failures.push(why);
      }
    }
    setBusy(false);
    if (needPassword.length) {
      setLocked(needPassword);
      // A statement PDF with a password: ask for it right away (iPhone's own secure prompt).
      if (Platform.OS === 'ios')
        Alert.prompt(
          failures.includes('wrong-password') ? 'That password didn’t work' : 'This PDF has a password',
          'Type it once so we can read it. It isn’t saved.',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setProblem(PROBLEMS.password) },
            { text: 'Open', onPress: (pw?: string) => void read(needPassword, pw ?? '') },
          ],
          'secure-text',
        );
      else setProblem(PROBLEMS.password);
      if (!texts.length) return;
    }
    if (!texts.length) {
      setProblem(failures.includes('pdf-unsupported') ? PROBLEMS.noPdf : PROBLEMS.broken);
      return;
    }
    finish(texts, failures.length - needPassword.length);
  };

  const pick = async () => {
    setProblem(null);
    // One file per month is normal (Apple Card, most banks), so take up to 3 and read them together.
    const res = await DocumentPicker.getDocumentAsync({
      type: ['text/csv', 'text/comma-separated-values', 'application/pdf', 'text/plain', 'public.comma-separated-values-text'],
      copyToCacheDirectory: true,
      multiple: true,
    });
    if (res.canceled || !res.assets.length) return;
    await read(res.assets.slice(0, 3));
  };

  return (
    <FindPage
      title="Drop in a statement"
      intro="2–3 months finds the most: a monthly charge has to show up twice."
      footer={
        <>
          {/* Problems sit right above the button, so they're on screen even on an SE (audit, Nov 20). */}
          {problem ? (
            <Notice
              title={problem.title}
              line={problem.line}
              action={problem === PROBLEMS.password && locked.length && Platform.OS === 'ios' ? 'Enter password' : undefined}
              onAction={() => void read(locked)}
              style={{ marginBottom: 10 }}
            />
          ) : null}
          <Button label={busy ? 'Reading…' : 'Pick 1–3 files'} hint="CSV or PDF statements" disabled={busy} onPress={pick} />
          <PrivateNote text="Read on your iPhone. Never uploaded or kept." />
          {SHOW_SAMPLES ? <Button kind="text" label="Try with a sample (test builds)" onPress={() => finish(SAMPLE_STATEMENT)} /> : null}
        </>
      }
    >
      {/* Pick where it comes from, then see the screen and the three taps (no arrow chains, owner Nov 19). */}
      <Segmented options={sources.map((x) => ({ value: x.key, label: x.label }))} value={src.key} onChange={setSource} label="Where your statement comes from" height={48} style={{ marginTop: 18 }} />
      <PhoneMock title={src.screen} rows={src.rows} label={`Picture of the ${src.screen} screen, with ${src.rows.find((r) => r.hi)?.text ?? ''} highlighted`} />
      <Steps steps={src.steps} />
      {busy ? <ActivityIndicator style={{ marginTop: 20 }} /> : null}
    </FindPage>
  );
}
