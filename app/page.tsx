import { AuroraBackground } from '@/components/aurora-background';
import { ScrollProgress } from '@/components/scroll-progress';
import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { TrustedBy } from '@/components/trusted-by';
import { Features } from '@/components/features';
import { HowItWorks } from '@/components/how-it-works';
import { Stats } from '@/components/stats';
import { Testimonials } from '@/components/testimonials';
import { Pricing } from '@/components/pricing';
import { FAQ } from '@/components/faq';
import { CTA } from '@/components/cta';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="relative">
      <main className="relative overflow-x-hidden bg-white text-foreground">
      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Aurora Background */}
      <AuroraBackground />

      {/* Navigation */}
      <Navbar />

      {/* Content */}
      <Hero />
      <TrustedBy />
      <div className="gradient-line max-w-4xl mx-auto" />
      <Features />
      <div className="gradient-line max-w-4xl mx-auto" />
      <HowItWorks />
      <Stats />
      <div className="gradient-line max-w-4xl mx-auto" />
      <Testimonials />
      <Pricing />
      <div className="gradient-line max-w-4xl mx-auto" />
      <FAQ />
      <CTA />
      <Footer />
      </main>
    </div>
  );
}
