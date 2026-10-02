"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SERVICES_DETAILED } from "@/lib/services-data";

export default function Services() {
  const reduced = useReducedMotion();

  return (
    <section
      id="services"
      className="relative py-24 lg:py-36 bg-dusk-deep overflow-hidden text-on-dark"
    >
      {/* Background photo at low opacity */}
      <div className="absolute inset-0 -z-0 opacity-10 pointer-events-none">
        <Image
          src="/images/tower-greenhouse.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "blur(2px) sepia(1) saturate(0.5) hue-rotate(100deg)" }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <p className="text-gold font-semibold text-xs tracking-[0.2em] uppercase mb-4">
            OUR SERVICES · WHAT WE INSTALL
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl text-on-dark leading-tight mb-6">
            Design, installation and maintenance, all from one team.
          </h2>
          <p className="text-on-dark leading-relaxed text-base sm:text-lg">
            We handle standalone and hybrid solar systems, solar water pumping
            for homes, institutions and farms, mini-grids, and clean cooking,
            quoted after a site visit, then maintained for as long as you run
            the system. Click any service to view full specifications, photos, and what to expect.
          </p>
        </motion.div>

        {/* Horizontal Numbered Service Rows */}
        <div className="border-t border-on-dark/20 divide-y divide-on-dark/15">
          {SERVICES_DETAILED.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.08 }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group py-8 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-dusk/50 px-4 sm:px-6 rounded-xl transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1">
                  {/* Service Number */}
                  <span className="font-mono text-gold text-xl sm:text-2xl font-bold w-10 flex-shrink-0">
                    {service.num}
                  </span>

                  {/* Thumbnail Preview */}
                  <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 border border-gold/40 shadow-md group-hover:border-gold transition-colors">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      sizes="144px"
                      className="object-cover photo-filter group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-dusk/20 group-hover:bg-transparent transition-colors" />
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-fraunces text-xl sm:text-2xl text-on-dark group-hover:text-gold transition-colors font-semibold">
                        {service.title}
                      </h3>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-leaf-deep/80 text-gold border border-gold/30">
                        {service.tag}
                      </span>
                    </div>
                    <p className="text-on-dark text-sm sm:text-base leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Arrow CTA */}
                <div className="flex items-center gap-2 text-gold group-hover:text-gold-hi font-semibold text-sm sm:text-base flex-shrink-0 md:pl-4">
                  <span className="whitespace-nowrap">View details</span>
                  <span className="transform group-hover:translate-x-1.5 transition-transform text-lg" aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
