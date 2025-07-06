import { useSearchParams } from "next/navigation";
import {
  defaultConfig,
  noContactConfig,
  depriveRightsConfig,
  increaseAlimonyConfig,
  divorceConfig,
  propertySplitConfig,
} from "@/lib/landingConfigs";
import HeroSectionV2 from "@/components/hero-section-v2";
import { Header } from "@/components/header";

const configMap = {
  "no-contact": noContactConfig,
  "deprive-rights": depriveRightsConfig,
  "increase-alimony": increaseAlimonyConfig,
  "divorce": divorceConfig,
  "property-split": propertySplitConfig,
};

export default function HomePage() {
  const searchParams = useSearchParams();
  const landing = searchParams.get("landing");
  const config = configMap[landing] || defaultConfig;

  return (
    <main>
      <Header />
      <HeroSectionV2 config={config} />
    </main>
  );
}
