import { MetadataRoute } from 'next';
import { HOSPITAL_CONFIG } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${HOSPITAL_CONFIG.nameEn} (AIGH)`,
    short_name: 'Al Insaf Hospital',
    description: 'Premier Tertiary Healthcare & Digital Diagnostic Center in Dewanganj, Jamalpur, Bangladesh',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0b9e53',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/images/logo-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
