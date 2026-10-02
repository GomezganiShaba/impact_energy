"use client";

import { motion, useReducedMotion } from "framer-motion";

const CARDS = [
  {
    title: "Our Vision",
    icon: "◎",
    text: "To become a leading provider of inclusive clean energy solutions that transform livelihoods and protect the environment in Malawi and across the region.",
  },
  {
    title: "Our Mission",
    icon: "⬡",
    text: "To deliver accessible, affordable and sustainable energy technologies through innovative distribution systems, strong community partnerships and digital tools that ensure efficient last-mile delivery and long-term customer satisfaction.",
  },
];

export default function VisionMission() {
  const reduced = useReducedMotion();

  return (
    <section className="py-20 lg:py-28 bg-paper-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-leaf font-semibold text-xs tracking-[0.2em] uppercase mb-3">
            What drives us
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl text-ink">
            Vision and Mission
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {CARDS.map(({ title, icon, text }, i) => (
            <motion.div
              key={title}
              initial={reduced ? {} : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: reduced ? 0 : i * 0.15 }}
              className="bg-dusk rounded-2xl p-8 lg:p-10 flex flex-col"
            >
              <span className="text-gold text-3xl mb-5" aria-hidden="true">
                {icon}
              </span>
              <h3 className="font-fraunces text-2xl text-gold mb-4">
                {title}
              </h3>
              <p className="text-on-dark leading-relaxed font-normal">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
