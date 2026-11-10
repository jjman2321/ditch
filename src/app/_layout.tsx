import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, router, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, useApp } from '@/state/app';
import { OnboardingProvider } from '@/state/onboarding';
import { brand, paletteFor } from '@/ui/sunflower';

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

function Navigator({ dark, bg }: { dark: boolean; bg: string }) {
  // A fresh onboarding after "Delete all data".
  const { generation } = useApp();
  const modal = { contentStyle: { backgroundColor: dark ? brand.night : brand.cream } };
  return (
    <OnboardingProvider key={generation}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: bg } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="paywall" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom', ...modal }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="ditch/[id]" options={{ presentation: 'fullScreenModal', animation: 'fade', contentStyle: { backgroundColor: dark ? brand.night : brand.sunflower } }} />
        <Stack.Screen name="settings" />
      </Stack>
    </OnboardingProvider>
  );
}
