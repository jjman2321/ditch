// Screenshot your Apple list: open Apple's Subscriptions page, screenshot it,
// pick the screenshots. Apple's own text reader reads them on the phone.

import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, useWindowDimensions } from 'react-native';

import { APPLE_SUBSCRIPTIONS_URL } from '@/catalog/cancel';
import { openUrl } from '@/ditch/CancelHelp';
import { FindPage, PrivateNote, SHOW_SAMPLES } from '@/find/Parts';
import { PhoneMock, Steps } from '@/find/Visual';
import { readAppleSubscriptions } from '@/import/appleScreenshot';
import { canReadImages, readImage } from '@/import/device';
import { SAMPLE_APPLE_LINES } from '@/import/samples';
import { setFindResult } from '@/import/session';
import { useApp } from '@/state/app';
import { Button, External, Notice, usePalette } from '@/ui/sunflower';

type Problem = { title: string; line: string; action?: 'statement' };
// This build has no text reader: point to what works now.
const NO_READER: Problem = { title: 'Screenshots need the newest Ditch', line: 'Use a bank statement for now.', action: 'statement' };
// The reader ran but failed on this picture.
const BAD_PICTURE: Problem = { title: 'We couldn’t read that picture', line: 'Try a fresh screenshot of the Subscriptions page.' };

export default function AppleScreenshot() {
  const p = usePalette();
  const app = useApp();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const dayFirst = !['US', 'CA'].includes(app.settings.country ?? 'US');
  // iPhones with a Home button (SE, 8) are 667pt tall and screenshot with side + Home.
  const homeButton = useWindowDimensions().height <= 667;
  const shot = homeButton ? 'side button + Home button' : 'side button + volume up';

  const finish = (lines: string[]) => {
    const found = readAppleSubscriptions(lines, app.today, app.settings.currency, dayFirst ? 'dmy' : 'mdy');
    if (!found.length) {
      setProblem({ title: 'No subscriptions in that one', line: 'Make sure it’s the Subscriptions list, then pick it again.' });
      return;
    }
    setFindResult({ found, source: 'apple', appleCharges: 0, note: null });
    router.push('/find/review');
  };

  const pick = async () => {
    // This build can't read screenshots: say so and point to the other ways, instead of a dead button.
    if (!canReadImages) {
      setProblem(NO_READER);
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
      setProblem(BAD_PICTURE);
    } finally {
      setBusy(false);
    }
  };

  return (
    <FindPage
      title="Screenshot your Apple list"
      intro="Free trials show up there too, so we can remind you before they end."
      footer={
        <>
          {/* Problems sit right above the buttons, so they're on screen even on an SE (audit, Nov 20). */}
          {problem ? (
            <Notice
              title={problem.title}
              line={problem.line}
              action={problem.action === 'statement' ? 'Use a statement' : undefined}
              onAction={() => router.replace('/find/statement')}
              style={{ marginBottom: 10 }}
            />
          ) : null}
          <Button label="Open Apple subscriptions" hint="Opens outside Ditch" right={<External color={p.ctaFg} size={19} />} onPress={() => openUrl(APPLE_SUBSCRIPTIONS_URL)} />
          <Button kind="secondary" label={busy ? 'Reading…' : 'Pick screenshots'} disabled={busy} onPress={pick} style={{ marginTop: 6 }} />
          <PrivateNote />
          {SHOW_SAMPLES ? <Button kind="text" label="Try with a sample (test builds)" onPress={() => finish(SAMPLE_APPLE_LINES)} /> : null}
        </>
      }
    >
      {/* The screen they'll see, then three taps (no arrow chains, owner Nov 19). */}
      <PhoneMock
        title="Subscriptions"
        rows={[
          { text: 'Netflix', sub: 'Renews Dec 3' },
          { text: 'Spotify', sub: 'Renews Dec 15' },
          { text: 'ChatGPT', sub: 'Trial ends Nov 28' },
        ]}
        label="Picture of Apple's Subscriptions list, to screenshot"
      />
      <Steps steps={['Tap **Open Apple subscriptions** below.', `Take a screenshot: **${shot}**. Long list? Scroll and take another.`, 'Come back and tap **Pick screenshots**.']} />
      {busy ? <ActivityIndicator style={{ marginTop: 20 }} /> : null}
    </FindPage>
  );
}
