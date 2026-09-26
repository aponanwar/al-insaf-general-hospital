import type { Metadata } from 'next';
import ContactClient from '@/components/contact/ContactClient';
import { HOSPITAL_CONFIG } from '@/lib/constants';

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://alinsafhospital.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Contact Us, 24/7 Helpline & Location Map | Al Insaf General Hospital',
  description:
    'Contact Al Insaf General Hospital in Dewanganj, Jamalpur. Access our 24/7 hotline numbers, emergency ambulance desk, hospital address at Govt. High School Gate, and send online inquiries.',
  keywords: [
    'Contact Al Insaf Hospital',
    'Hospital Phone Number Dewanganj',
    'Dewanganj Hospital Address',
    'Emergency Ambulance Dewanganj',
    'Hospital Helpline Jamalpur',
    'আল ইনসাফ হাসপাতাল যোগাযোগ',
    'দেওয়ানগঞ্জ হাসপাতাল ফোন নাম্বার',
  ],
  alternates: {
    canonical: '/contact-us',
  },
  openGraph: {
    title: 'Contact Us & Location Map | Al Insaf General Hospital Dewanganj',
    description:
      '24/7 Hospital Hotline, Emergency Ambulance Transport, and Location Map in Dewanganj Bazar, Jamalpur.',
    url: `${baseUrl}/contact-us`,
    images: [
      {
        url: `${baseUrl}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Contact Al Insaf General Hospital Dewanganj',
      },
    ],
  },
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact & Location - Al Insaf General Hospital',
  description: 'Hospital emergency hotlines, address, Google Maps directions, and online inquiries.',
  url: `${baseUrl}/contact-us`,
  mainEntity: {
    '@type': 'Hospital',
    name: HOSPITAL_CONFIG.nameEn,
    telephone: HOSPITAL_CONFIG.phone,
    emergencyTelephone: HOSPITAL_CONFIG.emergencyPhone,
    email: HOSPITAL_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: HOSPITAL_CONFIG.addressEn,
      addressLocality: 'Dewanganj',
      addressRegion: 'Jamalpur',
      addressCountry: 'BD',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.1437,
      longitude: 89.7717,
    },
  },
};

export default function ContactUsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactClient />
    </>
  );
}
