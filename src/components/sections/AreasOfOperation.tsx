"use client";

import { motion, useReducedMotion } from "framer-motion";

const AREAS = [
  {
    number: "01",
    title: "Clean Energy Distribution",
    intro:
      "IES distributes renewable energy technologies that improve energy access while reducing environmental impact.",
    items: [
      "Solar lighting solutions",
      "Clean cooking technologies",
      "Solar powered productive-use equipment",
      "Energy-efficient appliances",
    ],
  },
  {
    number: "02",
    title: "Last-Mile Distribution Networks",
    intro:
      "IES uses community-based distribution systems designed to reach rural and underserved areas. This decentralized model ensures energy technologies reach households often excluded from traditional retail.",
    items: [
      "Recruitment and training of local sales agents",
      "Door-to-door product demonstrations",
      "Community marketing campaigns",
      "Local distribution hubs for product availability",
    ],
  },
  {
    number: "03",
    title: "Digital Sales and Customer Management",
    intro:
      "IES integrates digital tools into its operations to improve efficiency and transparency. Digital platforms allow IES to monitor distribution performance and improve customer service.",
    items: [
      "Digital sales tracking",
      "Customer data management",
      "Mobile payment systems",
      "Stock and logistics monitoring",
    ],
  },
  {
    number: "04",
    title: "Productive Use of Energy",
    intro:
      "IES promotes renewable energy technologies for income-generating activities that help communities increase productivity and incomes.",
    items: [
      "Solar irrigation systems",
      "Solar powered food processing equipment",
      "Energy solutions for small enterprises",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function AreasOfOperation() {
  const reduced = useReducedMotion();

  return (
    <section id="areas" className="py-20 lg:py-28 bg-dusk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-gold font-semibold text-xs tracking-[0.2em] uppercase mb-4">
            Operations
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl text-gold leading-tight mb-4 max-w-2xl">
            Key Areas of Operation
          </h2>
          <p className="text-gold/80 leading-relaxed max-w-2xl">
            From last-mile distribution to digital customer management, our
            operations are built to deliver clean energy where it is needed most.
          </p>
        </motion.div>

        {/* Grid of areas */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {AREAS.map((area, i) => (
            <motion.div
              key={area.number}
              variants={fadeUp}
              initial={reduced ? {} : "hidden"}
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.1 }}
              className="bg-dusk-deep rounded-xl p-7 lg:p-8 flex flex-col gap-5"
            >
              {/* Number + Title */}
              <div className="flex items-start gap-4">
                <span className="font-fraunces text-gold text-3xl font-bold leading-none flex-shrink-0">
                  {area.number}
                </span>
                <h3 className="font-fraunces text-gold text-xl leading-snug font-semibold pt-1">
                  {area.title}
                </h3>
              </div>

              {/* Intro */}
              <p className="text-gold/80 text-sm leading-relaxed">
                {area.intro}
              </p>

              {/* Bullet list */}
              <ul className="space-y-2">
                {area.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gold text-sm"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

