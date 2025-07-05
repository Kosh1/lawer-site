export const dynamic = "force-dynamic";

//import LandingPageClient from "@/components/landing-page-client";
import HeroSectionV2 from "@/components/hero-section-v2";
import { Header } from "@/components/header";

export default function HomePage() {
  return (
    <main>
      <Header />
      <HeroSectionV2 />
    </main>
  );
}
