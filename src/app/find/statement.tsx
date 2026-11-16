// Drop in a statement: a CSV export (Apple Card, most banks) or a statement
// PDF. We show the charges that repeat; nothing is added until it's ticked.

import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { FindPage, SHOW_SAMPLES } from '@/find/Parts';
import { readDocument } from '@/import/device';
import { SAMPLE_STATEMENT } from '@/import/samples';
import { setFindResult } from '@/import/session';
import { readStatement } from '@/import/statement';
import { useApp } from '@/state/app';
import { Button, Txt, usePalette } from '@/ui/sunflower';

export default function Statement() {
  const p = usePalette();
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
    const res = await DocumentPicker.getDocumentAsync({ type: ['text/csv', 'text/comma-separated-values', 'application/pdf', 'text/plain', 'public.comma-separated-values-text'], copyToCacheDirectory: true });
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
      intro="2–3 months finds the most. A monthly charge needs to show up at least twice."
      footer={
        <>
          <Button label={busy ? 'Reading…' : 'Pick a CSV or PDF'} disabled={busy} onPress={pick} />
          {SHOW_SAMPLES ? <Button kind="text" label="Try with a sample (test builds)" onPress={() => finish(SAMPLE_STATEMENT)} /> : null}
        </>
      }
    >
      <View style={{ marginTop: 18, backgroundColor: p.card, borderRadius: 20, paddingHorizontal: 16, borderWidth: p.dark ? 1 : 0, borderColor: p.cardBorder }}>
        {[
          ['Apple Card', 'Wallet → Apple Card → Card Balance → a statement → Export Transactions'],
          ['Most banks', 'Statements → download PDF, or Transactions → export CSV'],
          ['PayPal', 'Activity → Statements → Activity download → CSV'],
        ].map(([t, w], i) => (
          <View key={t} style={{ paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderTopColor: p.hair }}>
            <Txt v="bodyStrong" color={p.cardFg}>
              {t}
            </Txt>
            <Txt v="sub" tone="mute">
              {w}
            </Txt>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 12, backgroundColor: p.dark ? '#2A2516' : '#FFF6D6', borderRadius: 14, padding: 14 }}>
        <Txt v="sub" color={p.dark ? p.fg2 : '#4B4220'}>
          Charges to APPLE.COM/BILL don’t say which app. We count them and point you to the Apple screenshot.
        </Txt>
      </View>
      {busy ? <ActivityIndicator style={{ marginTop: 20 }} /> : null}
      {problem ? (
        <Txt v="body" style={{ marginTop: 16 }} accessibilityLiveRegion="polite">
          {problem}
        </Txt>
      ) : null}
      <Txt v="sub" tone="mute" center style={{ marginTop: 18 }}>
        Read on your iPhone. Your statement isn’t uploaded or kept.
      </Txt>
    </FindPage>
  );
}
