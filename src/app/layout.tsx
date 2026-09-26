import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';
import { HOSPITAL_CONFIG } from '@/lib/constants';

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://alinsafhospital.com').replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${HOSPITAL_CONFIG.nameEn} (AIGH) | Leading Healthcare & Diagnostics in Dewanganj`,
    template: `%s | ${HOSPITAL_CONFIG.nameEn}`,
  },
  description:
    'Al Insaf General Hospital is a premier tertiary healthcare and digital diagnostic institution in Dewanganj, Jamalpur, Bangladesh. Providing 24/7 emergency services, modern ICU/HDU, outdoor specialist doctor chambers, 4D ultrasonography, digital X-ray, automated pathology lab, and 24+ specialized clinical departments.',
  keywords: [
    'Al Insaf General Hospital',
    'আল ইনসাফ জেনারেল হাসপাতাল',
    'Al Insaf Hospital Dewanganj',
    'Hospital in Dewanganj',
    'Hospital in Jamalpur',
    'Best Hospital in Dewanganj',
    'Doctor Appointment Dewanganj',
    'Diagnostic Center Dewanganj',
    'Emergency Hospital Dewanganj',
    'Ambulance Service Dewanganj Jamalpur',
    'ICU Service Dewanganj',
    'Gynecologist Doctor Dewanganj',
    'Child Specialist Doctor Dewanganj',
    'Laparoscopic Surgery Dewanganj',
    'Digital X-Ray Ultrasonography Dewanganj',
    'AIGH Dewanganj',
    'Dewanganj Govt High School Gate Hospital',
    'দেওয়ানগঞ্জ হাসপাতাল',
    'ডাক্তার সিরিয়াল দেওয়ানগঞ্জ',
    'আল ইনসাফ হাসপাতাল দেওয়ানগঞ্জ',
  ],
  authors: [{ name: HOSPITAL_CONFIG.nameEn, url: baseUrl }],
  creator: HOSPITAL_CONFIG.nameEn,
  publisher: HOSPITAL_CONFIG.nameEn,
  applicationName: HOSPITAL_CONFIG.nameEn,
  category: 'Hospital & Healthcare',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-BD': '/',
      'bn-BD': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    alternateLocale: ['bn_BD'],
    url: baseUrl,
    siteName: HOSPITAL_CONFIG.nameEn,
    title: `${HOSPITAL_CONFIG.nameEn} | 24/7 Tertiary Healthcare & Diagnostics`,
    description:
      'Premier tertiary healthcare and diagnostic center in Dewanganj, Jamalpur, Bangladesh. 24/7 emergency, ICU, top specialist doctors, and digital diagnostic center.',
    images: [
      {
        url: `${baseUrl}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: `${HOSPITAL_CONFIG.nameEn} Logo and Healthcare Services`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${HOSPITAL_CONFIG.nameEn} | Premier Hospital in Dewanganj`,
    description:
      '24/7 Emergency Care, ICU, Digital Pathology, and 24+ Medical Specialists in Dewanganj, Jamalpur.',
    images: [`${baseUrl}/images/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0b9e53',
};

const hospitalStructuredData = {
  '@context': 'https://schema.org',
  '@type': ['Hospital', 'MedicalBusiness', 'EmergencyService'],
  name: HOSPITAL_CONFIG.nameEn,
  alternateName: [
    HOSPITAL_CONFIG.nameBn,
    'Al Insaf Hospital',
    'AIGH Dewanganj',
    'Al Insaf Hospital Dewanganj',
  ],
  description:
    'Al Insaf General Hospital is a premier healthcare institution in Dewanganj, Jamalpur, Bangladesh, offering 24/7 emergency care, digital diagnostic labs, ICU, maternity wing, outdoor specialist chambers, and 24+ medical departments.',
  url: baseUrl,
  logo: `${baseUrl}/images/logo.png`,
  image: `${baseUrl}/images/logo.png`,
  telephone: HOSPITAL_CONFIG.phone,
  emergencyTelephone: HOSPITAL_CONFIG.emergencyPhone,
  email: HOSPITAL_CONFIG.email,
  priceRange: '৳৳',
  currenciesAccepted: 'BDT',
  paymentAccepted: 'Cash, bKash, Nagad, Visa, Mastercard',
  address: {
    '@type': 'PostalAddress',
    streetAddress: HOSPITAL_CONFIG.addressEn,
    addressLocality: 'Dewanganj',
    addressRegion: 'Jamalpur',
    postalCode: '2030',
    addressCountry: 'BD',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.1437,
    longitude: 89.7717,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  hasMap: HOSPITAL_CONFIG.mapsUrl,
  department: [
    { '@type': 'MedicalSpecialty', name: 'Cardiology & Heart Care' },
    { '@type': 'MedicalSpecialty', name: 'Gynaecology & Obstetrics' },
    { '@type': 'MedicalSpecialty', name: 'Child / Paediatrics & Neonatology' },
    { '@type': 'MedicalSpecialty', name: 'Medicine & Diabetes' },
    { '@type': 'MedicalSpecialty', name: 'General & Laparoscopic Surgery' },
    { '@type': 'MedicalSpecialty', name: 'Orthopaedic & Trauma Surgery' },
    { '@type': 'MedicalSpecialty', name: 'Urology & Kidney Care' },
    { '@type': 'MedicalSpecialty', name: 'Nephrology & Dialysis' },
    { '@type': 'MedicalSpecialty', name: 'Neurology & Brain Care' },
    { '@type': 'MedicalSpecialty', name: 'ENT, Head & Neck Surgery' },
    { '@type': 'MedicalSpecialty', name: 'Dermatology & Skin Care' },
    { '@type': 'MedicalSpecialty', name: 'Chest Medicine & Pulmonology' },
    { '@type': 'MedicalSpecialty', name: 'Breast Cancer & Surgical Oncology' },
    { '@type': 'MedicalSpecialty', name: 'Dental & Maxillofacial Care' },
    { '@type': 'MedicalSpecialty', name: 'Digital Diagnostic Pathology & Imaging' },
  ],
  availableService: [
    {
      '@type': 'MedicalProcedure',
      name: '24/7 Emergency & Trauma Care',
    },
    {
      '@type': 'MedicalProcedure',
      name: 'Specialist Doctor OPD Appointments',
    },
    {
      '@type': 'MedicalProcedure',
      name: 'Digital X-Ray & 4D Ultrasonography',
    },
    {
      '@type': 'MedicalProcedure',
      name: 'Automated Pathology Laboratory',
    },
    {
      '@type': 'MedicalProcedure',
      name: 'Modern Modular Operation Theaters',
    },
    {
      '@type': 'MedicalProcedure',
      name: '24-Hour Ambulance & Oxygen Service',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.maateen.me/kalpurush/font.css"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalStructuredData) }}
        />
      </head>
      <body className="font-sans flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}



