import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Get a Free Site Quote",
  description:
    "Request a free site visit and quote for solar, water pumping, biogas or clean cooking systems in Lilongwe and across Malawi.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-paper pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-leaf font-semibold text-xs tracking-[0.2em] uppercase mb-3">
              Free consultation
            </p>
            <h1 className="font-fraunces text-4xl sm:text-5xl text-ink leading-tight mb-4">
              Get a free site quote
            </h1>
            <p className="text-ink/75 leading-relaxed text-lg">
              Fill in the form below and we will call you within one business
              day to arrange a free site visit. Every quote starts with us
              seeing your property.
            </p>
          </div>

          <div className="bg-paper-deep rounded-2xl p-8 lg:p-12">
            <Suspense fallback={<div className="text-ink">Loading form...</div>}>
              <QuoteForm sourcePath="/quote" />
            </Suspense>
          </div>

          <div className="mt-10 text-center">
            <p className="text-ink/60 text-sm">
              Prefer to call?{" "}
              <a
                href="tel:+265881682589"
                className="text-leaf-deep underline hover:text-leaf font-medium"
              >
                +265 881 682 589
              </a>
              {" "}&mdash; Steve Khomba, Lilongwe Area 23 and Area 49.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
