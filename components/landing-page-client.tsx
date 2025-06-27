"use client";

import { useSearchParams } from "next/navigation";
import {
  defaultConfig,
  noContactConfig,
  depriveRightsConfig,
  increaseAlimonyConfig,
  divorceConfig,
  propertySplitConfig,
  LandingConfig
} from "@/lib/landingConfigs";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works";
import { ComparisonSection } from "@/components/comparison-section";
import { ExamplesSection } from "@/components/examples-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FAQSection } from "@/components/faq-section";
import { AboutSection } from "@/components/about-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CTASection } from "@/components/cta-section";

function getLandingConfig(param: string | null): LandingConfig {
  switch (param) {
    case "no-contact":
      return noContactConfig;
    case "deprive-rights":
      return depriveRightsConfig;
    case "increase-alimony":
      return increaseAlimonyConfig;
    case "divorce":
      return divorceConfig;
    case "property-split":
      return propertySplitConfig;
    default:
      return defaultConfig;
  }
}

export default function LandingPageClient() {
  const searchParams = useSearchParams();
  const landingParam = searchParams.get("landing");
  const config = getLandingConfig(landingParam);

  return (
    <>
      <Header />
      <main>
        <HeroSection
          title={config.title}
          subtitle={config.subtitle}
          topText={config.topText}
          placeholder={config.placeholder}
        />
        <HowItWorksSection />
        <ComparisonSection />
        <ExamplesSection />
        <TestimonialsSection />
        <FAQSection />
        <AboutSection />
        <CTASection
          title={config.ctaTitle}
          subtitle={config.ctaSubtitle}
          buttonText={config.ctaButton}
          placeholder={config.placeholder}
        />
      </main>
      <Footer />
    </>
  );
} 