import HeroSlider from '@/components/home/HeroSlider';
import QuickCards from '@/components/home/QuickCards';
import FeaturedBoxes from '@/components/home/FeaturedBoxes';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import StatsCounter from '@/components/home/StatsCounter';
import LatestNewsSection from '@/components/home/LatestNewsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />
      <QuickCards />
      <FeaturedBoxes />
      <WhyChooseUs />
      <StatsCounter />
      <LatestNewsSection />
      <TestimonialsSection />
    </div>
  );
}
