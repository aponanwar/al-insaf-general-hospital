import type { Metadata } from 'next';
import StaffClient from '@/components/staff/StaffClient';
import { HOSPITAL_CONFIG, getBaseUrl } from '@/lib/constants';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: 'Hospital Staff & Medical Team Directory | Al Insaf General Hospital',
  description:
    'Meet the dedicated healthcare team at Al Insaf General Hospital, Dewanganj, Jamalpur. Directory of administrative officers, specialist doctors, nurses, pharmacists, and medical technologists.',
  keywords: [
    'Hospital Staff Dewanganj',
    'Doctors and Nurses Jamalpur',
    'Hospital Administration Dewanganj',
    'Pharmacist Dewanganj',
    'Medical Technologist Jamalpur',
    'হাসপাতাল কর্মকর্তা কর্মচারী তালিকা',
  ],
  alternates: {
    canonical: '/staff',
  },
  openGraph: {
    title: 'Hospital Staff & Workforce Directory | Al Insaf General Hospital',
    description:
      'Meet the healthcare workforce, doctors, nurses, and administration of Al Insaf General Hospital.',
    url: `${baseUrl}/staff`,
    images: [
      {
        url: `${baseUrl}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Staff Directory at Al Insaf General Hospital',
      },
    ],
  },
};

const staffSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Staff & Healthcare Team Directory - Al Insaf General Hospital',
  description: 'Hospital healthcare workforce and staff member directory.',
  url: `${baseUrl}/staff`,
  mainEntity: {
    '@type': 'Hospital',
    name: HOSPITAL_CONFIG.nameEn,
    address: {
      '@type': 'PostalAddress',
      streetAddress: HOSPITAL_CONFIG.addressEn,
      addressLocality: 'Dewanganj',
      addressRegion: 'Jamalpur',
      addressCountry: 'BD',
    },
  },
};

export default function StaffDirectoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(staffSchema) }}
      />
      <StaffClient />
    </>
  );
}
