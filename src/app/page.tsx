import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import VisionMission from "@/components/sections/VisionMission";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import Team from "@/components/sections/Team";
import WhyUs from "@/components/sections/WhyUs";
import CtaBand from "@/components/sections/CtaBand";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Impact Energy Solution | Solar & Clean Water, Lilongwe, Malawi",
  alternates: { canonical: "/" },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Impact Energy Solution",
    description:
      "Solar power, water pumping and clean-cooking systems for homes, farms and institutions across Malawi.",
    telephone: "+265881682589",
    email: ["info@ies.mw", "bussiness@ies.mw"],
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ies.mw",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Area 23",
        postOfficeBoxNumber: "P.O Box 1984",
        addressLocality: "Lilongwe",
        addressCountry: "MW",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Area 49",
        postOfficeBoxNumber: "P.O Box 1984",
        addressLocality: "Lilongwe",
        addressCountry: "MW",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Malawi",
    },
    sameAs: ["https://www.facebook.com/61593167517055"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <VisionMission />
        <Services />
        <Process />
        <Projects />
        <Team />
        <WhyUs />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
