import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Impact Energy Solution. How we collect, use and protect your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-paper pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-leaf font-semibold text-xs tracking-[0.2em] uppercase mb-3">
              Legal
            </p>
            <h1 className="font-fraunces text-4xl sm:text-5xl text-ink leading-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-ink/60 text-sm">
              Last updated: September 2026
            </p>
          </div>

          <div className="prose max-w-none">
            <div className="space-y-8 text-ink/85 leading-relaxed">
              <section>
                <h2 className="font-fraunces text-2xl text-ink mb-3">
                  Who we are
                </h2>
                <p>
                  Impact Energy Solution is a renewable energy company
                  registered in Malawi, operating from Lilongwe Area 23 and
                  Area 49, and licensed by the Malawi Energy Regulatory
                  Authority (MERA). We design and install solar, water pumping
                  and clean-cooking systems across Malawi.
                </p>
              </section>

              <section>
                <h2 className="font-fraunces text-2xl text-ink mb-3">
                  Information we collect
                </h2>
                <p>
                  When you submit a quote request through our website, we
                  collect:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li>Your name and phone number (required to contact you)</li>
                  <li>
                    Your email address (optional, used only to send a
                    confirmation)
                  </li>
                  <li>
                    Details about your property and the service you are
                    interested in
                  </li>
                  <li>
                    Your approximate location, to plan a site visit
                  </li>
                  <li>
                    A hashed (anonymised) version of your IP address, for
                    security and spam prevention
                  </li>
                  <li>
                    Your browser user-agent string, for technical diagnostics
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-fraunces text-2xl text-ink mb-3">
                  How we use your information
                </h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li>
                    Contact you about your quote request and arrange a site
                    visit
                  </li>
                  <li>Send you a confirmation email if you provide one</li>
                  <li>Manage our customer relationships internally</li>
                  <li>
                    Prevent spam and abuse of our contact form
                  </li>
                </ul>
                <p className="mt-3">
                  We do not sell, share or rent your personal information to
                  any third party. We do not use your information for
                  marketing unless you have separately agreed.
                </p>
              </section>

              <section>
                <h2 className="font-fraunces text-2xl text-ink mb-3">
                  Data storage and security
                </h2>
                <p>
                  Your inquiry data is stored securely in a PostgreSQL database
                  hosted on Neon or Supabase (within the European Union or
                  United States, depending on your chosen hosting region).
                  Access is restricted to authorised staff only.
                </p>
                <p className="mt-3">
                  We use industry-standard security measures including HTTPS
                  encryption, IP address hashing, and rate limiting to protect
                  your data.
                </p>
              </section>

              <section>
                <h2 className="font-fraunces text-2xl text-ink mb-3">
                  Email
                </h2>
                <p>
                  Transactional emails (confirmation and team notifications) are
                  sent via Resend. Your email address is transmitted to Resend
                  solely for delivery purposes and is not used for any other
                  purpose.
                </p>
              </section>

              <section>
                <h2 className="font-fraunces text-2xl text-ink mb-3">
                  Retention
                </h2>
                <p>
                  We retain inquiry records for as long as is necessary to
                  provide our services and comply with applicable legal
                  requirements, typically no longer than three years after your
                  last contact with us.
                </p>
              </section>

              <section>
                <h2 className="font-fraunces text-2xl text-ink mb-3">
                  Your rights
                </h2>
                <p>
                  You have the right to request access to, correction of, or
                  deletion of personal information we hold about you. To make a
                  request, please call us on{" "}
                  <a
                    href="tel:+265881682589"
                    className="text-leaf-deep underline hover:text-leaf"
                  >
                    +265 881 682 589
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="font-fraunces text-2xl text-ink mb-3">
                  Cookies
                </h2>
                <p>
                  This website uses only essential session cookies required for
                  the admin area to function. We do not use tracking or
                  advertising cookies.
                </p>
              </section>

              <section>
                <h2 className="font-fraunces text-2xl text-ink mb-3">
                  Contact
                </h2>
                <p>
                  For any privacy-related queries, contact Steve Khomba on{" "}
                  <a
                    href="tel:+265881682589"
                    className="text-leaf-deep underline hover:text-leaf"
                  >
                    +265 881 682 589
                  </a>
                  {" "}or email{" "}
                  <a
                    href="mailto:info@ies.engineer"
                    className="text-leaf-deep underline hover:text-leaf"
                  >
                    info@ies.engineer
                  </a>
                  . Impact Energy Solution (IES), P.O Box 1984, Lilongwe Area 23 and Area 49, Malawi.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

