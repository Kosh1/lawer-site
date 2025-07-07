import { Header } from "@/components/header";
import LandingPageClient from "@/components/landing-page-client";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Suspense fallback={null}>
        <LandingPageClient />
      </Suspense>
    </main>
  );
}
