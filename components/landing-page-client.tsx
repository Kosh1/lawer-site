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
import HeroSectionV2 from "@/components/hero-section-v2";

const configMap = {
  "no-contact": noContactConfig,
  "deprive-rights": depriveRightsConfig,
  "increase-alimony": increaseAlimonyConfig,
  "divorce": divorceConfig,
  "property-split": propertySplitConfig,
};

export default function LandingPageClient() {
  const searchParams = useSearchParams();
  const landing = searchParams.get("landing");
  const config = configMap[landing] || defaultConfig;

  const utm: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith("utm_")) {
      utm[key] = value;
    }
  });

  return (
    <>
      <main>
        <HeroSectionV2 config={config} utm={utm} />
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
          utm={utm}
        />
      </main>
      <Footer />
    </>
  );
} 