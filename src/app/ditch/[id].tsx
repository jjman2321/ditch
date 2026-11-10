import { router } from 'expo-router';

import { Button, Screen, Txt } from '@/ui/sunflower';

export default function Ditched() {
  return (
    <Screen surface="sun">
      <Txt v="title">Ditched</Txt>
      <Button label="Back" onPress={() => router.back()} />
    </Screen>
  );
}
