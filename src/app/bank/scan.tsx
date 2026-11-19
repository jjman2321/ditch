// Reading your bank (design/v32 screen 5, spec c). First the bank's own sign-in: in this build a
// practice sheet, clearly labelled as a test, because the real sign-in needs the native build.
// Then real steps that tick as each part finishes (no percent bar), and the logos of what's
// found drop in. Leaving is safe: the reading carries on and the finds wait on Home.

import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';

import { bankEntry } from '@/bank/banks';
import { BankPage, BankTile, StepRow } from '@/bank/Parts';
import { useBankFlow } from '@/bank/flow';
import { setFindTarget } from '@/import/session';
import { BankApiError } from '@/services/bank';
import { useBank } from '@/state/bank';
import { tell } from '@/ui/alert';
import { Button, Card, LogoTile, Sheet, Stage, Txt, haptic, usePalette } from '@/ui/sunflower';

const STEP_MIN_MS = 1200;
const KEEP_GOING_MS = 20_000;
const SLOW_MS = 180_000;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function BankScan() {
  const flow = useBankFlow();
  const bank = useBank();
  const b = bankEntry(flow.bankId);
  const name = b?.name ?? 'your bank';
  // 'signin' → 'reading' (steps) → results; or 'failed'.
  const [phase, setPhase] = useState<'signin' | 'reading' | 'failed'>('signin');
  const [done, setDone] = useState(0);
  const [logos, setLogos] = useState<string[]>([]);
  const [found, setFound] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const alive = useRef(true);
  const left = useRef(false);
  useEffect(
    () => () => {
      alive.current = false;
    },
    [],
  );

  const steps: [string, string][] = [
    [`Connecting to ${name}`, `Connected to ${name}`],
    ['Reading the last 30 days', 'Read the last 30 days'],
    ['Reading the last 12 months', 'Read the last 12 months'],
    ['Matching charges to services', 'Matched charges to services'],
  ];

  // Announce each step once for VoiceOver.
  useEffect(() => {
    if (phase !== 'reading') return;
    const s = steps[Math.min(done, steps.length - 1)];
    AccessibilityInfo.announceForAccessibility(done >= steps.length ? 'Done.' : done === 0 ? s[0] : `${steps[done - 1][1]}. ${s[0]}.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, phase]);

  useEffect(() => {
    if (phase !== 'reading') return;
    const t = setInterval(() => setElapsed((e) => e + 1000), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const read = async () => {
    if (!b) return;
    setPhase('reading');
    setDone(0);
    try {
      const link = await bank.connect(b);
      if (!alive.current) return;
      haptic.light();
      setDone(1);
      const t0 = Date.now();
      await bank.runSync({ onboarding: flow.onboarding });
      await wait(Math.max(0, STEP_MIN_MS - (Date.now() - t0)));
      if (!alive.current) return;
      setDone(2);
      // What this bank turned up: sure finds as logos, unsure ones only counted on the results.
      const mine = bank.stateRef().finds.filter((f) => !f.undone && f.how === 'auto' && (f.linkId === link.id || f.linkId === null));
      for (let i = 0; i < mine.length; i++) {
        await wait(Math.max(120, STEP_MIN_MS / Math.max(1, mine.length)));
        if (!alive.current) return;
        setLogos((l) => [...l, mine[i].catalogId ?? `custom:${mine[i].name}`]);
        setFound(i + 1);
      }
      setDone(3);
      await wait(STEP_MIN_MS);
      if (!alive.current || left.current) return;
      setDone(4);
      bank.quietToasts();
      router.replace(`/bank/results?${flow.q({ link: link.id })}`);
    } catch (e) {
      if (!alive.current) return;
      if (e instanceof BankApiError && e.code === 'bank_limit') {
        tell('3 is the limit', 'You can connect up to 3. Disconnect one in Settings → Bank connections to add another.');
        router.back();
        return;
      }
      setPhase('failed');
    }
  };

  const leave = () => {
    left.current = true;
    if (flow.onboarding) router.replace('/onboarding/services');
    else router.dismissTo('/(tabs)');
  };

  const statement = () => {
    setFindTarget(flow.onboarding ? 'onboarding' : 'app');
    router.replace('/find/statement');
  };

  if (phase === 'failed') {
    return (
      <BankPage
        footer={
          <>
            <Button label="Try again" onPress={read} />
            <Button kind="secondary" label="Use a statement" onPress={statement} style={{ marginTop: 10 }} />
          </>
        }
      >
        <View style={{ marginTop: 24 }}>
          <BankTile bank={b} size={56} />
        </View>
        <Txt v="title" accessibilityRole="header" style={{ marginTop: 18, fontSize: 32, lineHeight: 36 }}>
          {`${name} isn’t answering.`}
        </Txt>
        <Txt v="leadS" tone="fg2" style={{ marginTop: 10 }}>
          That’s on their end. Try again in a bit.
        </Txt>
      </BankPage>
    );
  }

  const slow = elapsed >= SLOW_MS;
  const canLeave = !flow.onboarding || elapsed >= KEEP_GOING_MS;
  return (
    <BankPage
      onBack={phase === 'signin' ? undefined : leave}
      footer={
        phase === 'reading' ? (
          <>
            <Txt v="fine" tone="mute" center accessibilityLiveRegion="polite">
              {slow ? `${name} is slow today. We’ll finish in the background. Open Ditch later to see them.` : 'Usually under a minute.'}
            </Txt>
            {canLeave ? (
              <>
                <Button kind="secondary" label={flow.onboarding ? 'Keep going' : 'Go to my list'} onPress={leave} style={{ marginTop: 12 }} />
                <Txt v="fine" tone="mute" center style={{ marginTop: 6 }}>
                  We’ll keep reading in the background.
                </Txt>
              </>
            ) : null}
          </>
        ) : null
      }
    >
      <View style={{ marginTop: 16 }}>
        <BankTile bank={b} size={56} />
      </View>
      <Txt v="title" accessibilityRole="header" style={{ marginTop: 18, fontSize: 32, lineHeight: 36 }}>
        {`Reading ${name}…`}
      </Txt>
      <View style={{ marginTop: 18 }}>
        {steps.map(([now, past], i) => (
          <StepRow key={i} label={i < done ? past : now} state={phase !== 'reading' ? 'todo' : i < done ? 'done' : i === done ? 'now' : 'todo'} />
        ))}
      </View>
      {logos.length ? (
        <Card style={{ marginTop: 22, padding: 16 }}>
          <Txt v="eyebrow" tone="mute" accessibilityLiveRegion="polite">{`Found ${found} so far`}</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {logos.map((id, i) => (
              <Stage key={`${id}-${i}`} show rise={6} duration={220}>
                <LogoTile id={id.startsWith('custom:') ? 'custom' : id} size={36} mono={id.startsWith('custom:') ? id.slice(7, 8).toUpperCase() : undefined} />
              </Stage>
            ))}
          </View>
        </Card>
      ) : null}

      <PracticeSignIn visible={phase === 'signin'} bankName={name} live={bank.live} onConnect={read} onClose={() => router.replace(`/bank/missing?${flow.q({ closed: '1' })}`)} />
    </BankPage>
  );
}

/**
 * Test builds: the bank's sign-in is a practice sheet. It says so, in words, so nobody mistakes
 * it for their real bank. The App Store build opens the bank's own sign-in here instead.
 */
function PracticeSignIn({ visible, bankName, live, onConnect, onClose }: { visible: boolean; bankName: string; live: boolean; onConnect: () => void; onClose: () => void }) {
  const p = usePalette();
  return (
    <Sheet visible={visible} onClose={onClose} fit label="Practice bank, test build">
      <View style={{ alignSelf: 'flex-start', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: p.sunSoft }}>
        <Txt v="eyebrow" color={p.sunSoftFg} style={{ fontSize: 11, letterSpacing: 0.8 }}>
          Test build
        </Txt>
      </View>
      <Txt v="heading" accessibilityRole="header" style={{ marginTop: 10 }}>
        Practice bank (test build)
      </Txt>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
        {`This isn’t ${bankName}. It’s a practice bank with made-up charges, so you can try bank sync before it’s live. Nothing real is connected and no login is asked for.`}
      </Txt>
      <Txt v="sub" tone="mute" style={{ marginTop: 8 }}>
        {live ? 'The real bank sign-in needs the next app build.' : `In the App Store version, ${bankName}’s own sign-in opens here.`}
      </Txt>
      <Button label={`Connect practice ${bankName}`} onPress={onConnect} style={{ marginTop: 18 }} />
      <Button kind="text" label="Cancel" onPress={onClose} style={{ marginTop: 4 }} />
    </Sheet>
  );
}
