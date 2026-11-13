import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import { Reveal } from '@/components/Reveal';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { BRAND, COMPANY, SITE } from '@/lib/site';
import './globals.css';

// Archivo, cut for Ditch (the same files the app uses). Body text is the phone's own system font: nothing to download.
const display = localFont({ src: '../fonts/ArchivoDitch-Display.woff2', variable: '--f-display', display: 'swap' });
const wide = localFont({ src: '../fonts/ArchivoDitch-WideHeavy.woff2', variable: '--f-wide', display: 'swap' });
const wideBold = localFont({ src: '../fonts/ArchivoDitch-WideBold.woff2', variable: '--f-widebold', display: 'swap', preload: false });
const title = localFont({ src: '../fonts/ArchivoDitch-Title.woff2', variable: '--f-title', display: 'swap', preload: false });
const wordmark = localFont({ src: '../fonts/ArchivoDitch-Wordmark.woff2', variable: '--f-wordmark', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${BRAND} for iPhone`, template: '%s | Ditch' },
  description: 'Track every subscription in one list and get a reminder 3 days and 1 day before each charge. Free to track. No bank login, no account.',
  applicationName: 'Ditch',
  authors: [{ name: 'Aribo', url: '/about' }],
  publisher: COMPANY,
  openGraph: { siteName: 'Ditch: Subscription Tracker', type: 'website', locale: 'en_US', images: [{ url: '/og/home.png', width: 1200, height: 630, alt: 'Ditch: Subscription Tracker. Ditch it before it renews.' }] },
  twitter: { card: 'summary_large_image', images: ['/og/home.png'] },
};

export const viewport: Viewport = { themeColor: '#FFCC2E', colorScheme: 'light' };

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${display.variable} ${wide.variable} ${wideBold.variable} ${title.variable} ${wordmark.variable}`}>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>{children}</main>
        <SiteFooter />
        <Reveal />
      </body>
    </html>
  );
}
