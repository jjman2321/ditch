import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return { name: 'Ditch: Subscription Tracker', short_name: 'Ditch', start_url: '/', display: 'browser', background_color: '#FBF7EE', theme_color: '#FFCC2E', icons: [{ src: '/icon.png', sizes: '1024x1024', type: 'image/png' }] };
}
