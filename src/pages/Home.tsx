import Hero from '@/components/layout/landingpage/Hero';
import Features from '@/components/layout/landingpage/Features';
import Pricing from '@/components/layout/landingpage/Pricing';
import Testimonials from '@/components/layout/landingpage/Testimonials';
import FAQ from '@/components/layout/landingpage/FAQ';
import CTASection from '@/components/layout/landingpage/CTASection';

const Home = () => {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTASection />
    </main>
  );
};

export default Home;