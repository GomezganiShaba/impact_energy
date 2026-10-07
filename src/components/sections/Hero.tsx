"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const STATS = [
  { value: "Area 23 & 49", label: "Lilongwe Area base" },
  { value: "7 days", label: "A week, on call" },
];

export default function Hero() {
  const reduced = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.18 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image with green scrim */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ scale: reduced ? 1 : 1.12, filter: reduced ? "blur(0px)" : "blur(4px)" }}
          animate={{ scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/hero-rooftop.jpg"
            alt="Solar panel rooftop installation in Lilongwe, Malawi"
            fill
            priority
            sizes="100vw"
            className="object-cover photo-filter"
            style={{ filter: "sepia(0.45) saturate(1.6) hue-rotate(52deg) brightness(0.72)" }}
          />
        </motion.div>
        {/* Dark green gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-dusk-deep/80 via-dusk/70 to-dusk-deep/90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Kicker */}
          <motion.p
            variants={itemVariants}
            className="text-gold font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase mb-6"
          >
            SOLAR · WATER · BIOGAS · LILONGWE, MALAWI
          </motion.p>

          {/* H1 */}
          <motion.h1
            variants={itemVariants}
            className="font-fraunces text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-on-dark leading-tight mb-6"
          >
            Power and clean water,{" "}
            <em className="text-gold not-italic">built to reach</em> the last
            rooftop.
          </motion.h1>

          {/* Lede */}
          <motion.p
            variants={itemVariants}
            className="text-on-dark text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl font-normal"
          >
            We design and install solar power, irrigation pumping and
            clean-cooking systems for homes, farms and institutions across
            Malawi, from a single rooftop to a full mini-grid.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/quote"
              className="btn-pulse inline-flex items-center justify-center px-8 py-4 rounded-md bg-gold text-dusk-deep font-bold text-base relative overflow-hidden group transition-colors hover:bg-gold-hi"
            >
              <span className="relative z-10">Get a free site quote</span>
              <span className="absolute inset-0 -skew-x-12 bg-white/20 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-500" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 py-4 rounded-md border-2 border-gold text-gold font-bold text-base hover:bg-gold/15 transition-colors"
            >
              See what we install
            </a>
          </motion.div>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: reduced ? 0 : 0.8 }}
          className="mt-16 flex flex-wrap gap-8 sm:gap-16"
        >
          {STATS.map(({ value, label }) => (
            <div key={value} className="flex flex-col">
              <span className="font-fraunces text-3xl sm:text-4xl text-gold font-bold">
                {value}
              </span>
              <span className="text-on-dark text-sm mt-1 font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

