// A "Done" bar above the number keyboard. The iPhone's number pad has no
// return key, so without this there's no obvious way to put it away.
// Give the TextInput `inputAccessoryViewID={KEYBOARD_DONE}` and render
// <KeyboardDone /> once anywhere in the same screen or sheet.

import { InputAccessoryView, Keyboard, Platform, Pressable, View } from 'react-native';

import { usePalette } from './tokens';
import { Txt } from './type';

export const KEYBOARD_DONE = 'ditch-keyboard-done';

export function KeyboardDone() {
  const p = usePalette();
  if (Platform.OS !== 'ios') return null;
  return (
    <InputAccessoryView nativeID={KEYBOARD_DONE}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 8, backgroundColor: p.dark ? '#2A2722' : '#F4EFE3', borderTopWidth: 1, borderTopColor: p.hair }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Done, hide the keyboard" onPress={() => Keyboard.dismiss()} style={({ pressed }) => ({ minHeight: 44, minWidth: 64, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}>
          <Txt v="bodyStrong" style={{ fontSize: 17 }}>
            Done
          </Txt>
        </Pressable>
      </View>
    </InputAccessoryView>
  );
}
