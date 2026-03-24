import { BenefitsSection } from "../components/landing/benefits-section";
import { FeaturesSection } from "../components/landing/features-section";
import { FinalCtaSection } from "../components/landing/final-cta-section";
import { Footer } from "../components/landing/footer";
import { Hero } from "../components/landing/hero";
import { Navbar } from "../components/landing/navbar";
import { PricingSection } from "../components/landing/pricing-section";
import { ProblemSection } from "../components/landing/problem-section";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <BenefitsSection />
      <PricingSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
}
