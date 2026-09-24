import HeroSlider from '@/components/home/HeroSlider';
import QuickCards from '@/components/home/QuickCards';
import FeaturedBoxes from '@/components/home/FeaturedBoxes';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import StatsCounter from '@/components/home/StatsCounter';
import LatestNewsSection from '@/components/home/LatestNewsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FloatingHotline from '@/components/home/FloatingHotline';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen relative">
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

