// Picture steps for the find screens (owner, Nov 19: "remove all the arrows").
// Like Truecaller, Orbit and Vocabulary on Mobbin: a drawn phone screen with the row to tap
// lit up and a tap dot on it, then three short numbered steps with the button names in bold.
// Drawn with plain views (no images), so it's light, sharp at every size and right in dark mode.

import { Fragment } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { F, Txt, brand, usePalette } from '@/ui/sunflower';

export type MockRow = { text: string; sub?: string; hi?: boolean };

/** A phone screen cut off at the bottom of a tinted panel, showing one screen of another app. */
export function PhoneMock({ title, rows, label }: { title: string; rows: MockRow[]; label: string }) {
  const p = usePalette();
  // Shorter on small phones (SE), so the steps start on the first screen.
  const small = useWindowDimensions().height < 720;
  const frame = p.dark ? '#3A362F' : brand.ink;
  const screen = p.dark ? '#1C1A16' : '#FFFFFF';
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={{
        marginTop: small ? 14 : 18,
        height: small ? 150 : 200,
        borderRadius: 20,
        backgroundColor: p.dark ? '#2A2516' : '#FFF1BC',
        overflow: 'hidden',
        alignItems: 'center',
        paddingTop: small ? 14 : 18,
      }}
    >
      <View
        style={{
          width: 236,
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderWidth: 6,
          borderBottomWidth: 0,
          borderColor: frame,
          backgroundColor: screen,
          paddingHorizontal: 12,
          paddingTop: 14,
        }}
      >
        <View style={{ alignSelf: 'center', width: 58, height: 14, borderRadius: 7, backgroundColor: frame, marginTop: -6 }} />
        <Txt v="label" color={p.fg} style={{ fontFamily: F.bold, fontSize: 15, marginTop: 10 }} maxFontSizeMultiplier={1}>
          {title}
        </Txt>
        <View style={{ marginTop: 8, borderRadius: 10, backgroundColor: p.dark ? '#26231E' : '#F4F1EA', overflow: 'hidden' }}>
          {rows.map((r, i) => (
            <View
              key={r.text}
              style={{
                height: 34,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderTopWidth: i && !r.hi && !rows[i - 1].hi ? 1 : 0,
                borderTopColor: p.hair,
                backgroundColor: r.hi ? brand.sunflower : 'transparent',
              }}
            >
              <Txt v="sub" color={r.hi ? brand.ink : p.fg} numberOfLines={1} style={{ flex: 1, fontSize: 12.5, fontFamily: r.hi ? F.bold : F.medium }} maxFontSizeMultiplier={1}>
                {r.text}
              </Txt>
              {r.sub ? (
                <Txt v="sub" color={r.hi ? brand.ink : p.mute} numberOfLines={1} style={{ fontSize: 11.5 }} maxFontSizeMultiplier={1}>
                  {r.sub}
                </Txt>
              ) : null}
              {r.hi ? (
                // The tap dot: where the finger goes.
                <View style={{ marginLeft: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(22,20,15,0.18)', alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: brand.ink }} />
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/** "Tap **Statements**": the words between ** are bold, the button names to look for. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 ? (
          <Txt key={i} v="leadS" style={{ fontFamily: F.bold }}>
            {part}
          </Txt>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Three numbered steps, each one short line. */
export function Steps({ steps }: { steps: string[] }) {
  const p = usePalette();
  return (
    <View style={{ marginTop: 18, gap: 14 }}>
      {steps.map((s, i) => (
        <View key={s} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: p.dark ? brand.sunflower : brand.ink, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
            <Txt v="label" color={p.dark ? brand.ink : brand.white} style={{ fontFamily: F.bold, fontSize: 13.5 }} maxFontSizeMultiplier={1.2}>
              {String(i + 1)}
            </Txt>
          </View>
          <Txt v="leadS" style={{ flex: 1, paddingTop: 2 }} accessibilityLabel={`Step ${i + 1}. ${s.replace(/\*\*/g, '')}`}>
            <Rich text={s} />
          </Txt>
        </View>
      ))}
    </View>
  );
}
