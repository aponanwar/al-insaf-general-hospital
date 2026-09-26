import type { Metadata } from 'next';
import SpecialitiesClient from '@/components/specialities/SpecialitiesClient';
import { HOSPITAL_CONFIG } from '@/lib/constants';
import { INITIAL_DEPARTMENTS } from '@/lib/seed-data';

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://alinsafhospital.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Medical Specialities & Clinical Departments | Al Insaf General Hospital',
  description:
    'Explore 24+ medical specialities and clinical departments at Al Insaf General Hospital, Dewanganj, Jamalpur. Including Cardiology, Gynecology, Pediatrics, General & Laparoscopic Surgery, Orthopedics, Urology, and ICU.',
  keywords: [
    'Hospital Specialities Dewanganj',
    'Medical Departments Jamalpur',
    'Cardiology Dewanganj',
    'Pediatric Care Dewanganj',
    'Gynecology Department Jamalpur',
    'Laparoscopic Surgery Dewanganj',
    'Orthopedics Dewanganj',
    'চিকিৎসা বিভাগসমূহ দেওয়ানগঞ্জ',
    'আল ইনসাফ হাসপাতাল ডিপার্টমেন্ট',
  ],
  alternates: {
    canonical: '/specialities',
  },
  openGraph: {
    title: 'Medical Specialities & Clinical Departments | Al Insaf General Hospital',
    description:
      'Providing comprehensive clinical and surgical care across 24+ medical departments in Dewanganj, Jamalpur.',
    url: `${baseUrl}/specialities`,
    images: [
      {
        url: `${baseUrl}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Clinical Specialities at Al Insaf General Hospital',
      },
    ],
  },
};

const specialitiesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Clinical Specialities & Departments at Al Insaf General Hospital',
  description: 'Specialized clinical, medical, and surgical wings operating at Al Insaf General Hospital.',
  itemListElement: INITIAL_DEPARTMENTS.map((dept, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'MedicalSpecialty',
      name: dept.name,
      description: dept.shortDescription,
      url: `${baseUrl}/specialities/${dept.slug}`,
    },
  })),
};

export default function SpecialitiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(specialitiesSchema) }}
      />
      <SpecialitiesClient />
    </>
  );
}
