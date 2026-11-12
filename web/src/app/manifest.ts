import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return { name: 'Ditch: Subscription Tracker', short_name: 'Ditch', start_url: '/', display: 'browser', background_color: '#FBF7EE', theme_color: '#FFCC2E', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] };
}
