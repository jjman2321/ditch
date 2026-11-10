import { router } from 'expo-router';

import { Button, Screen, Txt } from '@/ui/sunflower';

export default function Settings() {
  return (
    <Screen>
      <Txt v="title">Settings</Txt>
      <Button label="Back" onPress={() => router.back()} />
    </Screen>
  );
}
