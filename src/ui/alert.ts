// Native alerts, with a fallback for the web preview (window.confirm).

import { Alert, Platform } from 'react-native';

type Btn = { text: string; style?: 'cancel' | 'destructive' | 'default'; onPress?: () => void };

/** The last button is the "yes" action; the first is the safe one. */
export function ask(title: string, message: string, buttons: Btn[]) {
  if (Platform.OS === 'web') {
    if (buttons.length > 1) {
      if (window.confirm(`${title}\n\n${message}`)) buttons[buttons.length - 1].onPress?.();
      else buttons[0].onPress?.();
    } else {
      window.alert(`${title}\n\n${message}`);
      buttons[0]?.onPress?.();
    }
    return;
  }
  Alert.alert(title, message, buttons);
}

export function tell(title: string, message: string) {
  ask(title, message, [{ text: 'OK' }]);
}
