import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, router, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Linking, Platform, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { EditorProvider } from '@/editor/Editor';
import { AppProvider, useApp } from '@/state/app';
import { OnboardingProvider } from '@/state/onboarding';
import { Button, EDGE, Txt, brand, paletteFor } from '@/ui/sunflower';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const dark = useColorScheme() === 'dark';
  const p = paletteFor('cream', dark);
  // The splash stays up until fonts are in, so there's never a blank or
  // unstyled frame.
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    'ArchivoDitch-Wordmark': require('../../assets/fonts/ArchivoDitch-Wordmark.ttf'),
    'ArchivoDitch-Display': require('../../assets/fonts/ArchivoDitch-Display.ttf'),
    'ArchivoDitch-Title': require('../../assets/fonts/ArchivoDitch-Title.ttf'),
    'ArchivoDitch-WideHeavy': require('../../assets/fonts/ArchivoDitch-WideHeavy.ttf'),
    'ArchivoDitch-WideBold': require('../../assets/fonts/ArchivoDitch-WideBold.ttf'),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  if (!loaded) return null;

  const base = dark ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: { ...base.colors, background: p.bg, card: p.bg, text: p.fg, primary: p.fg, border: p.rule },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={theme}>
          <AppProvider>
            <Navigator dark={dark} bg={p.bg} />
          </AppProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Web preview only: lets the screenshot script open a screen directly.
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  (window as unknown as { __ditchNavigate: (path: string) => void }).__ditchNavigate = (path) => router.push(path as never);
}

/** The list couldn't be opened: say so, and never start a fresh, empty app on top of it. */
function LoadFailed({ bg }: { bg: string }) {
  const app = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: bg, justifyContent: 'center', padding: EDGE }}>
      <Txt v="title" accessibilityRole="header">
        Couldn’t open your list.
      </Txt>
      <Txt v="leadS" tone="fg2" style={{ marginTop: 8 }}>
        It’s still on your phone. Try again, or restart the app. If it keeps happening, email us and we’ll help.
      </Txt>
      <Button label="Try again" onPress={app.retryLoad} style={{ marginTop: 24 }} />
      <Button kind="text" label="Email support" onPress={() => Linking.openURL('mailto:support@ditchsubs.app?subject=Ditch%20won%E2%80%99t%20open%20my%20list').catch(() => {})} />
    </View>
  );
}

function Navigator({ dark, bg }: { dark: boolean; bg: string }) {
  // A fresh onboarding after "Delete all data".
  const { generation, loadFailed } = useApp();
  if (loadFailed) return <LoadFailed bg={bg} />;
  const modal = { contentStyle: { backgroundColor: dark ? brand.night : brand.cream } };
  return (
    <OnboardingProvider key={generation}>
      <EditorProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: bg } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="paywall" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom', ...modal }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="ditch/[id]" options={{ presentation: 'fullScreenModal', animation: 'fade', contentStyle: { backgroundColor: dark ? brand.night : brand.sunflower } }} />
          <Stack.Screen name="settings" />
        </Stack>
      </EditorProvider>
    </OnboardingProvider>
  );
}
