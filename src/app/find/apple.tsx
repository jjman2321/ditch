// Screenshot your Apple list: open Apple's Subscriptions page, screenshot it,
// pick the screenshots. Apple's own text reader reads them on the phone.

import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { APPLE_SUBSCRIPTIONS_URL } from '@/catalog/cancel';
import { openUrl } from '@/ditch/CancelHelp';
import { FindPage, SHOW_SAMPLES, Step } from '@/find/Parts';
import { readAppleSubscriptions } from '@/import/appleScreenshot';
import { canReadImages, readImage } from '@/import/device';
import { SAMPLE_APPLE_LINES } from '@/import/samples';
import { setFindResult } from '@/import/session';
import { useApp } from '@/state/app';
import { Button, External, Txt, usePalette } from '@/ui/sunflower';

const CANT_READ = 'This iPhone can’t read screenshots yet. Use a statement or pick them yourself.';

export default function AppleScreenshot() {
  const p = usePalette();
  const app = useApp();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const dayFirst = !['US', 'CA'].includes(app.settings.country ?? 'US');

  const finish = (lines: string[]) => {
    const found = readAppleSubscriptions(lines, app.today, app.settings.currency, dayFirst ? 'dmy' : 'mdy');
    if (!found.length) {
      setProblem('We couldn’t read any subscriptions in that. Make sure it’s the Subscriptions list, then try again.');
      return;
    }
    setFindResult({ found, source: 'apple', appleCharges: 0, note: null });
    router.push('/find/review');
  };

  const pick = async () => {
    // This build can't read screenshots: say so and point to the other ways, instead of a dead button.
    if (!canReadImages) {
      setProblem(CANT_READ);
      return;
    }
    setProblem(null);
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, selectionLimit: 5, quality: 1 });
    if (res.canceled || !res.assets.length) return;
    setBusy(true);
    try {
      const lines: string[] = [];
      for (const a of res.assets) lines.push(...(await readImage(a.uri)));
      finish(lines);
    } catch {
      setProblem(CANT_READ);
    } finally {
      setBusy(false);
    }
  };

  return (
    <FindPage
      title="Screenshot your Apple list"
      footer={
        <>
          <Button label="Open Apple subscriptions" hint="Opens outside Ditch" right={<External color={p.ctaFg} size={19} />} onPress={() => openUrl(APPLE_SUBSCRIPTIONS_URL)} />
          <Button kind="secondary" label={busy ? 'Reading…' : 'Pick screenshots'} disabled={busy} onPress={pick} style={{ marginTop: 6 }} />
          {SHOW_SAMPLES ? <Button kind="text" label="Try with a sample (test builds)" onPress={() => finish(SAMPLE_APPLE_LINES)} /> : null}
        </>
      }
    >
      <View style={{ marginTop: 18, gap: 14 }}>
        <Step n={1}>Open your Apple subscriptions</Step>
        <Step n={2}>Screenshot the list. Long list? Scroll and take another.</Step>
        <Step n={3}>Come back and pick the screenshots</Step>
      </View>
      <View style={{ marginTop: 18, backgroundColor: p.card, borderRadius: 18, padding: 14, borderWidth: p.dark ? 1 : 0, borderColor: p.cardBorder }}>
        <Txt v="sub" tone="fg2">
          It’s in iPhone Settings → your name → Subscriptions. Free trials show there too, so we can remind you before they end.
        </Txt>
      </View>
      {busy ? <ActivityIndicator style={{ marginTop: 20 }} /> : null}
      {problem ? (
        <Txt v="body" style={{ marginTop: 16 }} accessibilityLiveRegion="polite">
          {problem}
        </Txt>
      ) : null}
      <Txt v="sub" tone="mute" center style={{ marginTop: 18 }}>
        Read on your iPhone with Apple’s own text reader. Only the screenshots you pick.
      </Txt>
    </FindPage>
  );
}
