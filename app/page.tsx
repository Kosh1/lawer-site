export const dynamic = "force-dynamic";

import LandingPageClient from "@/components/landing-page-client";
import HeroSectionV2 from "@/components/hero-section-v2";

export default function HomePage() {
  return (
    <main>
      <HeroSectionV2 />
      <LandingPageClient />
    </main>
  );
}
