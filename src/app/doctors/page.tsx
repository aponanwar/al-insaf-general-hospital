import type { Metadata } from 'next';
import DoctorsClient from '@/components/doctors/DoctorsClient';
import { HOSPITAL_CONFIG, getBaseUrl } from '@/lib/constants';
import { INITIAL_DOCTORS } from '@/lib/seed-data';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: 'Specialist Doctors & Consultants Schedule | Al Insaf General Hospital',
  description:
    'Browse the full directory of specialist doctors, professors, and surgeons at Al Insaf General Hospital, Dewanganj, Jamalpur. View visiting hours, chamber room numbers, consultation fees, and book appointments online.',
  keywords: [
    'Doctors in Dewanganj',
    'Specialist Doctors Dewanganj',
    'Gynecologist Dewanganj',
    'Child Specialist Dewanganj Jamalpur',
    'Medicine Specialist Dewanganj',
    'Laparoscopic Surgeon Dewanganj',
    'Doctor Serial Dewanganj',
    'Al Insaf Hospital Doctors List',
    'ডাক্তার তালিকা দেওয়ানগঞ্জ',
    'অভিজ্ঞ ডাক্তার আল ইনসাফ হাসপাতাল',
  ],
  alternates: {
    canonical: '/doctors',
  },
  openGraph: {
    title: 'Specialist Doctors Directory | Al Insaf General Hospital Dewanganj',
    description:
      'Find expert specialist doctors, visiting schedules, and book appointments at Al Insaf General Hospital.',
    url: `${baseUrl}/doctors`,
    images: [
      {
        url: `${baseUrl}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Specialist Doctors at Al Insaf General Hospital',
      },
    ],
  },
};

const doctorsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Specialist Doctors at Al Insaf General Hospital',
  description: 'List of certified medical specialists and consultants practicing at Al Insaf General Hospital, Dewanganj.',
  itemListElement: INITIAL_DOCTORS.slice(0, 15).map((doc, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'Physician',
      name: doc.name,
      jobTitle: doc.designation,
      medicalSpecialty: doc.specialty || doc.department,
      description: doc.qualifications,
      worksFor: {
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
    },
  })),
};

export default function DoctorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorsSchema) }}
      />
      <DoctorsClient />
    </>
  );
}
