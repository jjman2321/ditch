// 3 · Where should we look? (design/v16 screen 2). Every way to find them in
// one place; you check everything before it's added (find/review). The first
// find is free (#34), so those cards say "Free once". The bank scan (#64) shows
// as "Coming soon" in test builds only: Apple rejects buttons for features that
// don't exist yet (2.1). The bank's name is never shown (owner, Nov 18).
// Each card's line fits on one line on a 375pt iPhone, so "Pick them myself"
// stays on screen on the SE. Back is the same bare chevron as the steps after it.

import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { showImport } from '@/config/features';
import { DEV_TOOLS } from '@/dev/flags';
import { RouteCard } from '@/find/Parts';
import { setFindTarget } from '@/import/session';
import { OnbRoot } from '@/onboarding/Parts';
import { Bank, ChevronLeft, IconButton, ListCheck, PhoneList, STEP_HEADER_H, StatementIcon, Txt, brand, paletteFor, useInsets, useIsDark, usePageEdge, usePalette } from '@/ui/sunflower';

// No entrance of its own (motion pass 2): the cards arrive with the push itself, ready to tap on
// the first frame. A stagger after the slide read as "slides in, then builds again". Each card
// presses in on touch (RouteCard).

/** The bank row while it's not built: RouteCard's look, but nothing to tap, so no chevron. */
function SoonCard({ title, line, tag }: { title: string; line: string; tag: string }) {
  const p = usePalette();
  return (
    <View
      accessible
      accessibilityLabel={`${title}. ${line}. ${tag}`}
      accessibilityState={{ disabled: true }}
      style={{ marginTop: 12, backgroundColor: p.card, borderRadius: 20, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'flex-start', borderWidth: p.dark ? 1 : 0, borderColor: p.cardBorder }}
    >
      <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: p.dark ? '#2A2721' : '#FFF1BC', alignItems: 'center', justifyContent: 'center' }}>
        <Bank color={p.dark ? brand.sunflower : brand.ink} size={24} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt v="bodyStrong" color={p.cardFg} style={{ fontSize: 16.5 }}>
          {title}
        </Txt>
        <Txt v="sub" tone="fg2" style={{ marginTop: 2 }}>
          {line}
        </Txt>
        <View style={{ alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7, backgroundColor: p.dark ? '#33302A' : '#F3EDE0' }}>
          <Txt v="eyebrow" tone="fg2" style={{ fontSize: 10.5, letterSpacing: 0.6 }}>
            {tag}
          </Txt>
        </View>
      </View>
    </View>
  );
}

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
  return (
    <OnbRoot surface="cream">
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: edge, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: STEP_HEADER_H, flexDirection: 'row', alignItems: 'center' }}>
          <IconButton label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/onboarding/how'))} style={{ marginLeft: -12 }}>
            <ChevronLeft color={chevron} />
          </IconButton>
        </View>
        <Txt v="title" accessibilityRole="header" style={{ marginTop: 2, fontSize: 28, lineHeight: 34 }}>
          {'Where should we\u00A0look?'}
        </Txt>
        <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
          Pick one. You check everything before it’s added.
        </Txt>
        {showImport() ? (
          <>
            <RouteCard icon={PhoneList} title="Apple subscriptions" line="A screenshot of your list." tag="FREE ONCE" onPress={() => find('/find/apple')} />
            <RouteCard icon={StatementIcon} title="A bank statement" line="PDF or CSV from any bank." tag="FREE ONCE" onPress={() => find('/find/statement')} />
          </>
        ) : null}
        <RouteCard icon={ListCheck} title="Pick them myself" line="Tick them from our list." onPress={() => router.push('/onboarding/services')} />
        {/* Test builds only, last: nothing to tap yet, and full-contrast text (no faded card). */}
        {DEV_TOOLS ? <SoonCard title="My bank" line="Read-only, takes a minute." tag="COMING SOON" /> : null}
        <Txt v="sub" tone="mute" center style={{ marginTop: 20, color: p.mute }}>
          Read on your iPhone. Screenshots and statements aren’t uploaded.
        </Txt>
      </ScrollView>
    </OnbRoot>
  );
}
