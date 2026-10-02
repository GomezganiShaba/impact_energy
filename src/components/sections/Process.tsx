"use client";

import { motion, useReducedMotion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Site visit and survey",
    desc: "Our engineers visit your site to understand your energy and water needs, assess available sunlight, and take measurements for system sizing.",
  },
  {
    num: "02",
    title: "System design and quote",
    desc: "We produce a detailed design tailored to your site, then present a full quote with component specifications and expected output.",
  },
  {
    num: "03",
    title: "Installation",
    desc: "Mounting, wiring, plumbing and brickwork carried out by our own crew. We coordinate all trades under one team to keep the project on schedule.",
  },
  {
    num: "04",
    title: "Handover and support",
    desc: "We walk you through the system, provide documentation, and remain available for ongoing servicing and troubleshooting.",
  },
];

export default function Process() {
  const reduced = useReducedMotion();

  return (
    <section id="process" className="py-24 lg:py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-leaf font-semibold text-xs tracking-[0.2em] uppercase mb-3">
            How we work
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl text-ink max-w-xl leading-tight">
            How a project runs
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map(({ num, title, desc }, i) => (
            <motion.div
              key={num}
              initial={reduced ? {} : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: reduced ? 0 : i * 0.12 }}
              className="relative"
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-6 left-[calc(100%_-_16px)] w-8 h-0.5 bg-gold/30"
                  aria-hidden="true"
                />
              )}

              <div className="bg-paper-deep rounded-xl p-6 h-full">
                <span className="font-mono text-gold text-2xl font-bold block mb-4">
                  {num}
                </span>
                <h3 className="font-fraunces text-lg text-ink mb-3">{title}</h3>
                <p className="text-ink/75 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
