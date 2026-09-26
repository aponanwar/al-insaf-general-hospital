import type { Metadata } from 'next';
import AppointmentsClient from '@/components/appointments/AppointmentsClient';
import { HOSPITAL_CONFIG } from '@/lib/constants';

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://alinsafhospital.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Book Doctor Appointment Online & Get Serial | Al Insaf General Hospital',
  description:
    'Book online appointments with specialist doctors at Al Insaf General Hospital, Dewanganj, Jamalpur. Instant SMS serial number confirmation, flexible morning/evening shifts, and affordable consultation fees.',
  keywords: [
    'Book Doctor Appointment Dewanganj',
    'Doctor Serial Dewanganj',
    'Online Doctor Booking Jamalpur',
    'Gynecologist Serial Dewanganj',
    'Child Specialist Serial Dewanganj',
    'Al Insaf Hospital Doctor Serial',
    'ডাক্তার সিরিয়াল বুকিং দেওয়ানগঞ্জ',
    'অনলাইন ডাক্তার বুকিং জামালপুর',
  ],
  alternates: {
    canonical: '/appointments',
  },
  openGraph: {
    title: 'Book Doctor Appointment Online | Al Insaf General Hospital',
    description:
      'Reserve your serial number with top specialist doctors and surgeons at Al Insaf General Hospital. Instant SMS confirmation.',
    url: `${baseUrl}/appointments`,
    images: [
      {
        url: `${baseUrl}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Doctor Appointment Booking at Al Insaf General Hospital',
      },
    ],
  },
};

const appointmentPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: 'Doctor Appointment Booking - Al Insaf General Hospital',
  description: 'Online booking service for specialist doctor consultations at Al Insaf General Hospital.',
  url: `${baseUrl}/appointments`,
  mainEntity: {
    '@type': 'MedicalBusiness',
    name: HOSPITAL_CONFIG.nameEn,
    telephone: HOSPITAL_CONFIG.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: HOSPITAL_CONFIG.addressEn,
      addressLocality: 'Dewanganj',
      addressRegion: 'Jamalpur',
      addressCountry: 'BD',
    },
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/appointments`,
        actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'],
      },
      result: {
        '@type': 'Reservation',
        name: 'Doctor Consultation Serial Reservation',
      },
    },
  },
};

export default function AppointmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appointmentPageSchema) }}
      />
      <AppointmentsClient />
    </>
  );
}
