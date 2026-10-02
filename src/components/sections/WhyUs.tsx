"use client";

import { motion, useReducedMotion } from "framer-motion";

const ITEMS = [
  {
    title: "Sized to the site, not the shelf",
    desc: "Every quote follows a real site visit. No fixed packages that leave you short of power or paying for capacity you don't need.",
  },
  {
    title: "Integrated Installation from Start to Finish",
    desc: "Our technical team coordinates electrical, plumbing and structural works throughout the installation process, ensuring smooth project delivery, consistent quality and clear accountability from start to finish.",
  },
  {
    title: "Built for irrigation and off-grid life",
    desc: "From borehole pumps to mini-grids, we design for the way power and water are actually used here.",
  },
  {
    title: "Continued Support After Installation",
    desc: "Our support does not end at handover. We provide ongoing servicing and troubleshooting to help keep your system operating reliably, with our technical team available to respond to your support needs.",
  },
];

export default function WhyUs() {
  const reduced = useReducedMotion();

  return (
    <section id="why" className="py-24 lg:py-32 bg-dusk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-gold font-semibold text-xs tracking-[0.2em] uppercase mb-4">
            Why choose us
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl text-on-dark leading-tight">
            Practical, reliable and sustainable energy solutions tailored to your
            needs.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8">
          {ITEMS.map(({ title, desc }, i) => (
            <motion.div
              key={title}
              initial={reduced ? {} : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: reduced ? 0 : i * 0.1 }}
              className="border border-on-dark/20 rounded-xl p-8 hover:border-gold/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center mb-5">
                <span className="text-gold font-bold text-lg" aria-hidden="true">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-fraunces text-xl text-gold mb-3">{title}</h3>
              <p className="text-on-dark leading-relaxed text-sm font-normal">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
