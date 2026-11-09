// A lock-screen style notification from Ditch, used as an illustration.

import { View, type StyleProp, type ViewStyle } from 'react-native';

import { DuckIcon } from './LogoTile';
import { usePalette } from './tokens';
import { F, Txt } from './type';

export function NotificationPreview({
  time,
  message,
  faded,
  style,
}: {
  time: string;
  message: string;
  /** The older notification underneath. */
  faded?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  return (
    <View
      accessible
      accessibilityLabel={`Example notification from Ditch, ${time}: ${message}`}
      style={[
        {
          backgroundColor: faded ? (p.dark ? '#1E1C18' : 'rgba(255,255,255,0.78)') : p.note,
          borderRadius: 22,
          paddingTop: 12,
          paddingBottom: 13,
          paddingHorizontal: 14,
          flexDirection: 'row',
          gap: 11,
          alignItems: 'flex-start',
        },
        p.dark
          ? { borderWidth: 1, borderColor: '#34312B' }
          : faded
            ? null
            : { shadowColor: '#503700', shadowOpacity: 0.16, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 4 },
        style,
      ]}
    >
      <DuckIcon size={38} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <Txt v="label" color={p.noteFg} style={{ lineHeight: 19 }}>
            Ditch
          </Txt>
          <Txt v="sub" color={p.noteMute} style={{ fontFamily: F.regular }}>
            {time}
          </Txt>
        </View>
        <Txt v="body" color={p.noteFg} num>
          {message}
        </Txt>
      </View>
    </View>
  );
}
