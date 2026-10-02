import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SERVICES_DETAILED, getServiceBySlug } from "@/lib/services-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SERVICES_DETAILED.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} | Impact Energy Solution`,
    description: service.shortDesc,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: `${service.title} | Impact Energy Solution`,
      description: service.shortDesc,
      images: [{ url: service.image, alt: service.alt }],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  const otherServices = SERVICES_DETAILED.filter((s) => s.slug !== slug);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen">
        {/* Section 1: Hero (GREEN) */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-dusk-deep text-on-dark border-b border-on-dark/15 overflow-hidden">
          {/* Subtle background glow */}
          <div
            className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs uppercase tracking-wider text-on-dark font-semibold">
                <li>
                  <Link href="/" className="hover:text-gold transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-gold">/</li>
                <li>
                  <Link href="/#services" className="hover:text-gold transition-colors">
                    Services
                  </Link>
                </li>
                <li aria-hidden="true" className="text-gold">/</li>
                <li className="text-gold font-bold">{service.tag}</li>
              </ol>
            </nav>

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Heading & Summary */}
              <div className="lg:col-span-7">
                <span className="inline-block px-3 py-1 rounded bg-leaf-deep text-gold text-xs font-mono font-bold tracking-wider mb-4 border border-gold/30">
                  SERVICE {service.num} · {service.tag.toUpperCase()}
                </span>
                <h1 className="font-fraunces text-3xl sm:text-5xl lg:text-6xl text-on-dark leading-tight mb-6">
                  {service.title}
                </h1>
                <p className="text-gold font-medium text-lg sm:text-xl leading-relaxed mb-6">
                  {service.heroHeadline}
                </p>
                <p className="text-on-dark leading-relaxed text-base sm:text-lg mb-8">
                  {service.overview}
                </p>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap gap-4 items-center">
                  <Link
                    href={`/quote?service=${service.slug}`}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-gold text-dusk-deep font-bold text-sm sm:text-base hover:bg-gold-hi transition-all shadow-lg hover:shadow-gold/20"
                  >
                    Request a free site quote →
                  </Link>
                  <a
                    href="tel:+265881682589"
                    className="inline-flex items-center justify-center px-6 py-4 rounded-md border border-gold text-gold font-semibold text-sm sm:text-base hover:bg-gold/10 transition-colors"
                  >
                    Call +265 881 682 589
                  </a>
                </div>
              </div>

              {/* Right Column: High-Res Service Image */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/40 group aspect-[4/3] lg:aspect-[5/4]">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover photo-filter transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dusk-deep/90 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-dusk-deep/90 border border-on-dark/20 backdrop-blur-sm">
                    <p className="text-xs font-mono text-gold uppercase tracking-wider font-bold">
                      IES Field Installation
                    </p>
                    <p className="text-xs text-on-dark mt-0.5">{service.alt}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Impact Highlights Bar (YELLOW) */}
        <section className="bg-paper-deep text-ink py-10 border-b border-ink/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
              {service.impact.map(({ metric, label }) => (
                <div key={label} className="border-l-0 sm:border-l-2 border-leaf-deep/40 pl-0 sm:pl-6 py-2">
                  <p className="font-fraunces text-3xl sm:text-4xl font-bold text-leaf-deep">
                    {metric}
                  </p>
                  <p className="text-xs sm:text-sm text-ink font-semibold mt-1 uppercase tracking-wider">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: What to Expect Section (GREEN) */}
        <section className="py-20 lg:py-28 bg-dusk-deep text-on-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <p className="text-gold font-semibold text-xs tracking-[0.2em] uppercase mb-3">
                Execution & Methodology
              </p>
              <h2 className="font-fraunces text-3xl sm:text-4xl text-on-dark leading-tight">
                What to expect when you work with IES
              </h2>
              <p className="text-on-dark mt-4 leading-relaxed text-base sm:text-lg">
                From initial site audit to ongoing servicing, here is how our renewable energy professionals coordinate every phase of your {service.title.toLowerCase()} installation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {service.whatToExpect.map((step, idx) => (
                <div
                  key={step.title}
                  className="bg-dusk rounded-2xl p-8 border border-on-dark/20 hover:border-gold/50 transition-colors flex gap-5"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gold text-dusk-deep font-bold font-mono flex items-center justify-center text-sm shadow">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-fraunces text-xl text-gold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-on-dark text-sm sm:text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Hardware Components & Key Applications (YELLOW) */}
        <section className="py-20 lg:py-28 bg-paper text-ink border-t border-b border-ink/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Components Column */}
              <div className="bg-paper-deep rounded-2xl p-8 sm:p-10 border border-ink/20 shadow-sm">
                <span className="text-leaf-deep font-mono text-xs uppercase tracking-widest block mb-2 font-bold">
                  System Architecture
                </span>
                <h3 className="font-fraunces text-2xl text-ink mb-6">
                  Typical Equipment & Hardware
                </h3>
                <ul className="space-y-4">
                  {service.components.map((comp) => (
                    <li key={comp} className="flex items-start gap-3 text-sm sm:text-base text-ink">
                      <span className="text-leaf font-bold text-base mt-0.5" aria-hidden="true">✔</span>
                      <span className="leading-relaxed">{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Applications Column */}
              <div className="bg-paper-deep rounded-2xl p-8 sm:p-10 border border-ink/20 shadow-sm">
                <span className="text-leaf-deep font-mono text-xs uppercase tracking-widest block mb-2 font-bold">
                  Sectors & Use Cases
                </span>
                <h3 className="font-fraunces text-2xl text-ink mb-6">
                  Where This System Delivers
                </h3>
                <ul className="space-y-4">
                  {service.keyApplications.map((app) => (
                    <li key={app} className="flex items-start gap-3 text-sm sm:text-base text-ink">
                      <span className="text-leaf font-bold text-base mt-0.5" aria-hidden="true">▸</span>
                      <span className="leading-relaxed">{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Operational Model Box (Distribution & Agent Network) */}
            {service.operationalModel && (
              <div className="mt-12 bg-paper-deep rounded-2xl p-8 sm:p-10 border-2 border-leaf-deep/30 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-ink/20">
                  <div>
                    <span className="text-leaf-deep text-xs font-mono uppercase tracking-widest font-bold">
                      IES Operational Framework
                    </span>
                    <h4 className="font-fraunces text-2xl text-ink mt-1">
                      {service.operationalModel.heading}
                    </h4>
                  </div>
                  <span className="inline-block px-3 py-1 rounded bg-leaf text-paper text-xs font-semibold tracking-wider uppercase">
                    Lilongwe Area 23 & 49 Hub
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.operationalModel.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm sm:text-base text-ink">
                      <span className="text-leaf-deep font-bold font-mono">0{i + 1}.</span>
                      <span className="leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 5: Direct Quote CTA Box (GREEN) */}
        <section className="py-20 lg:py-28 bg-dusk-deep text-on-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-dusk rounded-3xl p-10 sm:p-16 border-2 border-gold/50 shadow-2xl relative overflow-hidden">
              <span className="text-gold font-mono text-xs uppercase tracking-widest font-bold block mb-3">
                Tailored Site Sizing
              </span>
              <h2 className="font-fraunces text-3xl sm:text-4xl text-on-dark mb-4">
                Ready to engineer your {service.title.toLowerCase()}?
              </h2>
              <p className="text-on-dark text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Contact Steve Khomba and our renewable energy professionals in Area 23 & 49. We will visit your property, audit your requirements, and provide a transparent, itemized quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href={`/quote?service=${service.slug}`}
                  className="w-full sm:w-auto px-8 py-4 rounded-md bg-gold text-dusk-deep font-bold text-sm sm:text-base hover:bg-gold-hi transition-colors shadow-lg"
                >
                  Submit Quote Request →
                </Link>
                <a
                  href={`https://wa.me/265881682589?text=${encodeURIComponent(`Hi Steve, I am interested in Impact Energy Solution's ${service.title}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-md bg-leaf-deep text-gold font-semibold text-sm sm:text-base hover:bg-leaf transition-colors border border-gold/30"
                >
                  WhatsApp Steve Khomba
                </a>
              </div>
              <p className="text-xs text-on-dark/70 mt-6">
                Registered with the Registrar of Companies · MERA Licensed · P.O Box 1984, Lilongwe, Malawi
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Explore Other Services (YELLOW) */}
        <section className="py-16 bg-paper-deep text-ink border-t border-ink/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xs uppercase font-mono tracking-widest text-leaf-deep mb-8 text-center font-bold">
              Explore Other Clean Energy Solutions
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {otherServices.map((other) => (
                <Link
                  key={other.slug}
                  href={`/services/${other.slug}`}
                  className="bg-paper p-4 rounded-xl border border-ink/15 hover:border-leaf-deep transition-colors group flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <span className="text-xs font-mono text-leaf-deep font-bold">
                      {other.num}
                    </span>
                    <h4 className="font-fraunces text-sm text-ink group-hover:text-leaf-deep transition-colors mt-1 font-semibold">
                      {other.title}
                    </h4>
                  </div>
                  <span className="text-xs text-leaf font-semibold mt-4 group-hover:translate-x-1 transition-transform inline-block">
                    View service details →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
