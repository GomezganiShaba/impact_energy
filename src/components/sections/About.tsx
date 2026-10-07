"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay } },
});

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const INFO_BLOCKS = [
  {
    label: "Who we are",
    text: "Impact Energy Solution is a Lilongwe-based renewable energy company delivering solar, water pumping and clean cooking systems for homes, institutions and farms across Malawi. We size every system to the site, not a catalogue.",
  },
  {
    label: "Our project",
    text: "the Dowa Mpisi solar water pumping system with drip irrigation for farming.",
  },
  {
    label: "Our location",
    text: "Lilongwe Area 23 and Area 49, P.O Box 1984, Lilongwe, Malawi.",
  },
];

export default function About() {
  const reduced = useReducedMotion();
  const motionProps = (variants: Variants) =>
    reduced
      ? {}
      : { variants, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.2 } };

  return (
    <section id="about" className="py-24 lg:py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: text content */}
          <motion.div {...(reduced ? {} : { variants: { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.15 } })}>
            <motion.p
              {...motionProps(fadeUp(0))}
              className="text-leaf font-semibold text-xs tracking-[0.2em] uppercase mb-4"
            >
              About us
            </motion.p>
            <motion.h2
              {...motionProps(fadeUp(0.08))}
              className="font-fraunces text-3xl sm:text-4xl lg:text-5xl text-ink leading-tight mb-10"
            >
              A local team, doing the work that matters.
            </motion.h2>

            <div className="space-y-8">
              {INFO_BLOCKS.map(({ label, text }) => (
                <motion.div key={label} {...motionProps(fadeUp(0.12))}>
                  <p className="text-leaf font-semibold text-xs uppercase tracking-widest mb-1">
                    {label}
                  </p>
                  <p className="text-ink leading-relaxed">{text}</p>
                </motion.div>
              ))}

              {/* Contact block */}
              <motion.div {...motionProps(fadeUp(0.16))}>
                <p className="text-leaf font-semibold text-xs uppercase tracking-widest mb-1">
                  Contact
                </p>
                <p className="text-ink leading-relaxed">
                  Steve Khomba, Co-founder and Director of Marketing and Business
                  Development,{" "}
                  <a
                    href="tel:+265881682589"
                    className="font-semibold text-leaf-deep underline decoration-gold underline-offset-2 hover:text-leaf transition-colors"
                  >
                    +265 881 682 589
                  </a>
                </p>
              </motion.div>
            </div>

            <motion.p
              {...motionProps(fadeUp(0.2))}
              className="mt-8 text-sm text-ink/70 border-t border-ink/20 pt-6"
            >
              A local company registered with the Registrar of Companies and
              licensed by the Malawi Energy Regulatory Authority (MERA).
            </motion.p>
          </motion.div>

          {/* Right: photo with floating badge */}
          <motion.div
            {...(reduced ? {} : { variants: fadeRight, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.2 } })}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
              <Image
                src="/images/technician-panel.jpg"
                alt="Renewable energy professional working on solar panel installation"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover photo-filter"
              />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5, ease: "backOut" }}
              className="absolute -bottom-6 -left-6 bg-dusk text-on-dark rounded-xl p-4 shadow-xl max-w-[220px]"
            >
              <p className="text-gold font-semibold text-xs uppercase tracking-wider mb-1">
                Feb 2023
              </p>
              <p className="text-on-dark/90 text-sm leading-snug">
                Working across the Lilongwe Area and beyond since our first
                installs
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

