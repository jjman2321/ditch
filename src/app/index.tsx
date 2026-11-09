import { Redirect } from 'expo-router';

// M1 will check SQLite for "onboarding done" and go to Home instead.
export default function Index() {
  return <Redirect href="/onboarding" />;
}
