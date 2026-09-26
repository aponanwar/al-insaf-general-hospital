import type { Metadata } from 'next';
import HeroSlider from '@/components/home/HeroSlider';
import QuickCards from '@/components/home/QuickCards';
import FeaturedBoxes from '@/components/home/FeaturedBoxes';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import StatsCounter from '@/components/home/StatsCounter';
import LatestNewsSection from '@/components/home/LatestNewsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FloatingHotline from '@/components/home/FloatingHotline';
import { HOSPITAL_CONFIG, getBaseUrl } from '@/lib/constants';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: `${HOSPITAL_CONFIG.nameEn} (AIGH) | Premier Tertiary Healthcare & Diagnostics in Dewanganj`,
  description:
    'Al Insaf General Hospital is a leading 24/7 hospital in Dewanganj, Jamalpur, offering expert specialist doctor chambers, modern ICU, 4D ultrasonography, digital X-ray, laparoscopic surgery, and comprehensive maternity care.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${HOSPITAL_CONFIG.nameEn} | 24/7 Tertiary Healthcare & Diagnostics`,
    description:
      'Premier healthcare institution in Dewanganj, Jamalpur. 24/7 emergency, ICU, top specialist doctors, digital pathology, and modern surgery suites.',
    url: baseUrl,
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: HOSPITAL_CONFIG.nameEn,
  alternateName: HOSPITAL_CONFIG.nameBn,
  url: baseUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/doctors?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HeroSlider />
      <QuickCards />
      <FeaturedBoxes />
      <WhyChooseUs />
      <StatsCounter />
      <LatestNewsSection />
      <TestimonialsSection />
      <FloatingHotline />
    </div>
  );
}

