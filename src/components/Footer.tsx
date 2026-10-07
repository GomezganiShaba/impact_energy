import Link from "next/link";
import Image from "next/image";

const SERVICE_LINKS = [
  { href: "/services/standalone-hybrid-solar", label: "Standalone & hybrid solar" },
  { href: "/services/solar-water-pumping", label: "Solar water pumping" },
  { href: "/services/mini-grids", label: "Mini-grids" },
  { href: "/services/clean-cooking", label: "Clean cooking" },
  { href: "/services/biogas", label: "Biogas installation" },
  { href: "/services/maintenance-servicing", label: "Maintenance & servicing" },
];

export default function Footer() {
  return (
    <footer className="bg-dusk-deep text-on-dark" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" aria-label="Impact Energy Solution home">
              <Image
                src="/brand/logo.png"
                alt="Impact Energy Solution"
                width={140}
                height={46}
                className="h-10 w-auto mb-5"
              />
            </Link>
            <p className="text-on-dark text-sm leading-relaxed">
              Solar power, water pumping and clean-cooking systems for homes,
              farms and institutions across Malawi.
            </p>
            <p className="text-gold text-xs mt-4 leading-relaxed font-medium">
              Registered with the Registrar of Companies, MERA licensed.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gold font-semibold text-xs uppercase tracking-widest mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {SERVICE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-on-dark text-sm hover:text-gold transition-colors font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-gold font-semibold text-xs uppercase tracking-widest mb-5">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { href: "#about", label: "About us" },
                { href: "#process", label: "How we work" },
                { href: "#projects", label: "Projects" },
                { href: "#team", label: "Team" },
                { href: "/quote", label: "Get a quote" },
                { href: "/privacy", label: "Privacy policy" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-on-dark text-sm hover:text-gold transition-colors font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold font-semibold text-xs uppercase tracking-widest mb-5">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-on-dark">
              <div>
                <a
                  href="tel:+265881682589"
                  className="text-gold font-bold hover:text-gold-hi transition-colors block text-base"
                >
                  +265 881 682 589
                </a>
                <p className="text-on-dark text-xs mt-0.5 font-medium">
                  Steve Khomba, Co-founder & Director of Marketing and Business
                  Development
                </p>
              </div>
              <div>
                <p className="text-gold font-bold">Impact Energy Solution (IES)</p>
                <p className="text-on-dark font-medium">P.O Box 1984, Lilongwe, Malawi</p>
                <p className="text-on-dark font-medium">Lilongwe Area 23 & Area 49, Malawi</p>
              </div>
              <div className="space-y-1 pt-1">
                <a
                  href="mailto:info@ies.engineer"
                  className="block text-gold hover:text-gold-hi transition-colors text-xs font-mono font-medium"
                >
                  info@ies.engineer
                </a>
                <a
                  href="mailto:bussiness@ies.engineer"
                  className="block text-gold hover:text-gold-hi transition-colors text-xs font-mono font-medium"
                >
                  bussiness@ies.engineer
                </a>
              </div>
              <a
                href="https://www.facebook.com/61593167517055"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-hi transition-colors font-medium"
                aria-label="Impact Energy Solution on Facebook"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-on-dark/20 flex flex-col sm:flex-row justify-between gap-4 text-xs text-on-dark">
          <p className="font-medium">
            &copy; {new Date().getFullYear()} Impact Energy Solution. All rights reserved.
          </p>
          <Link href="/privacy" className="text-gold hover:text-gold-hi transition-colors font-medium">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

