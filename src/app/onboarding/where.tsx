// 3 · Where should we look? (design/v16 screen 2). Every way to find them in
// one place; you check everything before it's added (find/review). The first
// find is free (#34), so those cards say "1 free, then Pro". Bank sync (#64, #70) is the
// main card in test builds in the US/Canada (design/v32 screen 1), with the free
// routes below it, smaller; the App Store build doesn't show it yet (Apple 2.1).
// The bank data provider's name is never shown (owner, Nov 18).
// Each card's line fits on one line on a 375pt iPhone, so "Pick them myself"
// stays on screen on the SE. Back is the same bare chevron as the steps after it.

import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { showBankSync, showImport } from '@/config/features';
import { RouteCard } from '@/find/Parts';
import { useApp } from '@/state/app';
import { useOnboarding } from '@/state/onboarding';
import { setFindTarget } from '@/import/session';
import { OnbRoot } from '@/onboarding/Parts';
import { Bank, ChevronLeft, IconButton, ListCheck, PhoneList, STEP_HEADER_H, StatementIcon, Txt, brand, paletteFor, useInsets, useIsDark, usePageEdge, usePalette } from '@/ui/sunflower';

// No entrance of its own (motion pass 2): the cards arrive with the push itself, ready to tap on
// the first frame. A stagger after the slide read as "slides in, then builds again". Each card
// presses in on touch (RouteCard).

export default function Where() {
  const p = usePalette();
  const dark = useIsDark();
  const insets = useInsets();
  const edge = usePageEdge();
  // The same back chevron as the step header (ui/sunflower/ProgressBar.tsx), without the progress bar.
  const chevron = dark ? paletteFor('cream', dark).fg : brand.ink;
  const find = (path: '/find/apple' | '/find/statement') => {
    setFindTarget('onboarding');
    router.push(path);
  };
  // Bank sync (DECISIONS #70): test builds in the US/Canada get the bank as the main card, the free routes below it.
  const app = useApp();
  const { country } = useOnboarding();
  const bank = showBankSync(country ?? app.settings.country, app.settings.currency);
  return (
    <OnbRoot surface="cream">
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: edge, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: STEP_HEADER_H, flexDirection: 'row', alignItems: 'center' }}>
          <IconButton label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/onboarding/how'))} style={{ marginLeft: -12 }}>
            <ChevronLeft color={chevron} />
          </IconButton>
        </View>
        <Txt v="title" accessibilityRole="header" style={{ marginTop: 16 }}>
          {'Where should we\u00A0look?'}
        </Txt>
        <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
          Pick one. You check them all first.
        </Txt>
        {/* Four equal cards, most complete first (owner, Nov 19: the old card style, order matters).
            The bank finds everything and keeps watching, so it leads where we offer it; the
            free route is last. Tags say what each one costs, nothing else. */}
        {bank ? <RouteCard icon={Bank} title="My bank or card" line="Finds them and spots new ones." tag="7 DAYS FREE" onPress={() => router.push('/bank?from=onboarding')} /> : null}
        {showImport() ? (
          <>
            <RouteCard icon={PhoneList} title="Apple subscriptions" line="A screenshot of your list." tag="FIRST ONE FREE" onPress={() => find('/find/apple')} />
            <RouteCard icon={StatementIcon} title="A bank statement" line="PDF or CSV from any bank." tag="FIRST ONE FREE" onPress={() => find('/find/statement')} />
          </>
        ) : null}
        <RouteCard icon={ListCheck} title="Pick them myself" line="Tick them from our list." onPress={() => router.push('/onboarding/services')} />
      </ScrollView>
    </OnbRoot>
  );
}
