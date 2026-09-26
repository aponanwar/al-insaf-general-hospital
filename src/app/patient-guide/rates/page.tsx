import type { Metadata } from 'next';
import RatesClient from '@/components/rates/RatesClient';
import { HOSPITAL_CONFIG } from '@/lib/constants';

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://alinsafhospital.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Diagnostic Test Rates, ICU & Cabin Tariffs | Al Insaf General Hospital',
  description:
    'Transparent pricing and rate charts for diagnostic pathology tests, digital X-ray, 4D ultrasonography, VIP cabins, general beds, ICU charges, and doctor fees at Al Insaf General Hospital, Dewanganj.',
  keywords: [
    'Hospital Rates Dewanganj',
    'Diagnostic Test Price List Jamalpur',
    'Ultrasonography Rate Dewanganj',
    'Digital X-Ray Cost Dewanganj',
    'Cabin Rent Al Insaf Hospital',
    'ICU Charges Dewanganj',
    'হাসপাতাল টেস্ট ফি তালিকা দেওয়ানগঞ্জ',
  ],
  alternates: {
    canonical: '/patient-guide/rates',
  },
  openGraph: {
    title: 'Hospital Rates & Diagnostic Tariffs | Al Insaf General Hospital',
    description:
      'Official fee schedules for tests, diagnostic investigations, ICU, and room tariffs at Al Insaf General Hospital Dewanganj.',
    url: `${baseUrl}/patient-guide/rates`,
    images: [
      {
        url: `${baseUrl}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Al Insaf General Hospital Rate Chart',
      },
    ],
  },
};

const ratesSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: 'Hospital Rate Charts & Diagnostic Investigation Tariffs',
  description: 'Pricing directory for medical services and diagnostic investigations at Al Insaf General Hospital.',
  url: `${baseUrl}/patient-guide/rates`,
  provider: {
    '@type': 'Hospital',
    name: HOSPITAL_CONFIG.nameEn,
    telephone: HOSPITAL_CONFIG.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: HOSPITAL_CONFIG.addressEn,
      addressLocality: 'Dewanganj',
      addressRegion: 'Jamalpur',
      addressCountry: 'BD',
    },
  },
};

export default function RatesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ratesSchema) }}
      />
      <RatesClient />
    </>
  );
}
