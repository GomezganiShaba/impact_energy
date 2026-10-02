"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Team() {
  const reduced = useReducedMotion();

  return (
    <section id="team" className="py-24 lg:py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-leaf font-semibold text-xs tracking-[0.2em] uppercase mb-3">
            Our team
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl text-ink max-w-xl leading-tight">
            The people behind the work
          </h2>
        </motion.div>

        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="max-w-md"
        >
          <div className="bg-dusk rounded-2xl p-8 relative overflow-hidden">
            {/* Decorative accent */}
            <div
              className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full -translate-y-12 translate-x-12"
              aria-hidden="true"
            />

            <div className="relative">
              {/* Initials avatar */}
              <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center mb-6">
                <span className="font-fraunces text-dusk-deep text-xl font-bold">SK</span>
              </div>

              <h3 className="font-fraunces text-2xl text-gold mb-1">
                Mr Steve Khomba
              </h3>
              <p className="text-gold-hi text-sm font-semibold mb-5 leading-snug">
                Co-founder & Director of Marketing and Business Development
              </p>
              <p className="text-on-dark leading-relaxed text-sm font-normal">
                7+ years distributing solar home systems and PAYGO energy models,
                with a track record training field agents and building
                community-level adoption across Malawi.
              </p>

              <div className="mt-6 pt-6 border-t border-on-dark/20">
                <a
                  href="tel:+265881682589"
                  className="text-gold font-medium hover:text-gold-hi transition-colors text-sm"
                >
                  +265 881 682 589
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
