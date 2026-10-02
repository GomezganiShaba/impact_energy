"use client";

import { useEffect, useState } from "react";
import { useScroll, useSpring, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "How we work" },
  { href: "#projects", label: "Projects" },
  { href: "#team", label: "Team" },
  { href: "#why", label: "Why us" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Gold scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold origin-left z-[60]"
        style={{ scaleX }}
        aria-hidden="true"
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-paper/95 backdrop-blur-md shadow-sm border-b border-ink/10"
            : "bg-gradient-to-b from-dusk-deep/90 via-dusk-deep/40 to-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0" aria-label="Impact Energy Solution home">
              <Image
                src="/brand/logo.png"
                alt="Impact Energy Solution"
                width={160}
                height={52}
                priority
                className="h-10 lg:h-12 w-auto"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className={`relative text-sm group py-1 transition-colors duration-300 ${
                    scrolled
                      ? "text-ink font-semibold hover:text-leaf-deep"
                      : "text-gold font-bold hover:text-gold-hi drop-shadow-sm"
                  }`}
                >
                  {label}
                  <span className="absolute bottom-0 left-0 h-0.5 bg-gold w-0 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-4">
              <Link
                href="/quote"
                className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-md bg-gold text-dusk-deep font-bold text-sm transition-all duration-200 hover:bg-gold-hi relative overflow-hidden group shadow-md"
              >
                <span className="relative z-10">Get a quote</span>
                <span className="absolute inset-0 -skew-x-12 bg-white/30 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-500" />
              </Link>

              {/* Mobile hamburger */}
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className={`lg:hidden p-2 rounded-md transition-colors duration-300 ${
                  scrolled ? "text-ink" : "text-gold hover:text-gold-hi"
                }`}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span
                    className={`block h-0.5 bg-current transition-all duration-300 origin-center ${
                      menuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 bg-current transition-all duration-300 ${
                      menuOpen ? "opacity-0 scale-x-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 bg-current transition-all duration-300 origin-center ${
                      menuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: "-100%" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed inset-0 z-40 bg-dusk-deep flex flex-col items-center justify-center lg:hidden"
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col items-center gap-8" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ href, label }, i) => (
            <motion.a
              key={href}
              href={href}
              initial={{ opacity: 0, y: 20 }}
              animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: menuOpen ? 0.1 + i * 0.05 : 0, duration: 0.3 }}
              className="text-gold text-3xl font-fraunces font-bold hover:text-gold-hi transition-colors tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </motion.a>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: menuOpen ? 0.1 + NAV_LINKS.length * 0.05 : 0, duration: 0.3 }}
          >
            <Link
              href="/quote"
              className="mt-4 inline-flex items-center px-8 py-3 rounded-md bg-gold text-dusk-deep font-semibold text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Get a quote
            </Link>
          </motion.div>
        </nav>
      </motion.div>
    </>
  );
}
