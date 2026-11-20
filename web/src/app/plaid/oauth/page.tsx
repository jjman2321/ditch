import type { Metadata } from 'next';

// Plaid's OAuth return address (https://ditchsubs.app/plaid/oauth). On an iPhone with Ditch this opens the
// app instead (Universal Link). Anyone who lands here in a browser just gets a way back.
export const metadata: Metadata = { title: 'Back to Ditch', robots: { index: false, follow: false } };

export default function PlaidOAuth() {
  return (
    <div className="wrap doc legal">
      <h1>Back to Ditch</h1>
      <div className="prose">
        <p>Your bank sign-in is done. Open the Ditch app on your iPhone to finish connecting.</p>
      </div>
    </div>
  );
}
