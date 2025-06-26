"use client"

import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { ExamplesSection } from "@/components/examples-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { AboutSection } from "@/components/about-section"
import { CTASection } from "@/components/cta-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HowItWorksSection } from "@/components/how-it-works"
import { ComparisonSection } from "@/components/comparison-section"
import {
  defaultConfig,
  noContactConfig,
  depriveRightsConfig,
  increaseAlimonyConfig,
  divorceConfig,
  propertySplitConfig,
  LandingConfig
} from "@/lib/landingConfigs"
import { useSearchParams } from "next/navigation"

function getLandingConfig(param: string | null): LandingConfig {
  switch (param) {
    case "no-contact":
      return noContactConfig
    case "deprive-rights":
      return depriveRightsConfig
    case "increase-alimony":
      return increaseAlimonyConfig
    case "divorce":
      return divorceConfig
    case "property-split":
      return propertySplitConfig
    default:
      return defaultConfig
  }
}

export default function HomePage() {
  const searchParams = useSearchParams()
  const landingParam = searchParams.get("landing")
  const config = getLandingConfig(landingParam)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main>
        <HeroSection
          title={config.title}
          subtitle={config.subtitle}
          topText={config.topText}
        />
        <HowItWorksSection />
        <ComparisonSection />
        <ExamplesSection />
        <TestimonialsSection />
        <FAQSection />
        <AboutSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
