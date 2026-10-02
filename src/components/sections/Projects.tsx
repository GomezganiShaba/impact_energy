"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const PROJECTS = [
  {
    src: "/images/tower-greenhouse.jpg",
    alt: "Solar-fed tank tower with greenhouse at a farm installation",
    caption: "Solar-fed tank tower with greenhouse",
    tag: "Water pumping",
  },
  {
    src: "/images/hero-rooftop.jpg",
    alt: "Rooftop solar array installed by Impact Energy Solution",
    caption: "Rooftop array",
    tag: "Solar system",
  },
  {
    src: "/images/pumphouse-brick.jpg",
    alt: "Brick pump house constructed as part of water pumping installation",
    caption: "Brick pump house",
    tag: "Pump house",
  },
  {
    src: "/images/waterpoint-tap.jpg",
    alt: "Community tap stand providing clean water access",
    caption: "Tap stand",
    tag: "Tap stand",
  },
  {
    src: "/images/panel-wiring.jpg",
    alt: "Inverter and distribution board installation",
    caption: "Inverter and distribution board install",
    tag: "Wiring",
  },
  {
    src: "/images/greenhouse-drip.jpg",
    alt: "Drip irrigation lines running through greenhouse",
    caption: "Drip lines in greenhouse",
    tag: "Irrigation",
  },
];

export default function Projects() {
  const reduced = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + PROJECTS.length) % PROJECTS.length : 0)),
    []
  );
  const next = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % PROJECTS.length : 0)),
    []
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, prev, next]);

  return (
    <section id="projects" className="py-24 lg:py-32 bg-paper-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-leaf font-semibold text-xs tracking-[0.2em] uppercase mb-3">
            Our work
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl text-ink max-w-xl leading-tight">
            Projects across Malawi
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map(({ src, alt, caption, tag }, i) => (
            <motion.button
              key={src}
              initial={reduced ? {} : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: reduced ? 0 : (i % 3) * 0.1 }}
              onClick={() => setLightboxIndex(i)}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={`Open photo: ${caption}`}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover photo-filter transition-transform duration-700 ${reduced ? "" : "group-hover:scale-105 ken-burns"}`}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dusk-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                <span className="bg-gold text-dusk-deep text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                  {tag}
                </span>
                <p className="text-on-dark font-medium mt-2 text-sm">{caption}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dusk-deep/95 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Project photo: ${PROJECTS[lightboxIndex].caption}`}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-on-dark hover:text-gold transition-colors text-4xl leading-none"
              aria-label="Close lightbox"
            >
              &times;
            </button>

            {/* Prev */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-on-dark hover:text-gold transition-colors text-3xl p-2"
              aria-label="Previous photo"
            >
              &#8592;
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl aspect-video"
            >
              <Image
                src={PROJECTS[lightboxIndex].src}
                alt={PROJECTS[lightboxIndex].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 75vw"
                className="object-contain photo-filter rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-dusk-deep/70 rounded-b-lg px-6 py-4">
                <span className="bg-gold text-dusk-deep text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                  {PROJECTS[lightboxIndex].tag}
                </span>
                <p className="text-on-dark mt-2 font-medium">
                  {PROJECTS[lightboxIndex].caption}
                </p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-dark hover:text-gold transition-colors text-3xl p-2"
              aria-label="Next photo"
            >
              &#8594;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
