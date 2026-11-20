// One look for every inline problem and note (owner, Nov 20: "error messages when dropping PDFs or
// screenshots are in normal black text and just don't look like an error").
// A tinted box with an icon, a bold title, one line and an optional action. Tangerine for a problem
// (calm, not bank-alarm red, and the same colour as "Reminders are off"), sunflower for a note.
// Mobbin: Mercury's peach box above the main button, Brex's amber warning, Warby Parker's upload error.

import { useEffect } from 'react';
import { AccessibilityInfo, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { haptic } from './haptics';
import { Bang } from './icons';
import { brand, usePalette } from './tokens';
import { F, Txt } from './type';

export type NoticeTone = 'problem' | 'info';

const TONES = {
  problem: { light: { bg: '#FFEDE3', border: '#F3B79B', line: '#5A3B2A' }, dark: { bg: '#2E1F17', border: '#7A3F22', line: '#D9C6B8' } },
  info: { light: { bg: '#FFF1BC', border: '#EBC46A', line: '#4B4220' }, dark: { bg: '#2A2516', border: '#8A6A1F', line: '#D8CDB0' } },
} as const;

/** A short problem or note. Says it out loud for VoiceOver, and buzzes once for a problem. */
export function Notice({
  tone = 'problem',
  title,
  line,
  action,
  onAction,
  style,
}: {
  tone?: NoticeTone;
  title: string;
  line?: string;
  action?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  const c = TONES[tone][p.dark ? 'dark' : 'light'];
  const ink = p.dark ? '#F6F0E3' : brand.ink;

  useEffect(() => {
    if (tone === 'problem') haptic.warning();
    AccessibilityInfo.announceForAccessibility(line ? `${title} ${line}` : title);
  }, [tone, title, line]);

  return (
    <View
      accessibilityRole="alert"
      style={[
        { flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderRadius: 16, borderWidth: 1.5, borderColor: c.border, backgroundColor: c.bg, paddingVertical: 14, paddingHorizontal: 14 },
        style,
      ]}
    >
      <View style={{ marginTop: 1 }}>
        <Bang size={22} bg={tone === 'problem' ? brand.bill : brand.sunflower} color={brand.ink} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt v="label" color={ink} style={{ fontFamily: F.bold, fontSize: 16, lineHeight: 21 }}>
          {title}
        </Txt>
        {line ? (
          <Txt v="sub" color={c.line} style={{ marginTop: 2, fontSize: 14.5, lineHeight: 20 }}>
            {line}
          </Txt>
        ) : null}
        {action && onAction ? (
          <Pressable
            accessibilityRole="button"
            onPress={onAction}
            hitSlop={6}
            style={({ pressed }) => ({
              alignSelf: 'flex-start',
              minHeight: 36,
              justifyContent: 'center',
              marginTop: 8,
              paddingHorizontal: 14,
              borderRadius: 18,
              borderWidth: 1.5,
              borderColor: ink,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Txt v="label" color={ink} style={{ fontFamily: F.bold, fontSize: 14.5 }}>
              {action}
            </Txt>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
