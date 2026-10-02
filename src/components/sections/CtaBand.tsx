"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { ctaInquirySchema, type CtaInquiryFormData } from "@/lib/schema";
import { SERVICES } from "@/lib/utils";

export default function CtaBand() {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CtaInquiryFormData>({
    resolver: zodResolver(ctaInquirySchema),
    defaultValues: { name: "", phone: "", service: "not-sure" },
  });

  const onSubmit = async (data: CtaInquiryFormData) => {
    if (data._hp) return; // honeypot
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          service: data.service,
          locationArea: "Area 23",
          propertyType: "Home",
          consent: true,
          _hp: data._hp,
          sourcePath: "/",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = json?.error ?? "Something went wrong. Please call us directly.";
        throw new Error(msg);
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please call us directly.");
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-paper-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: copy */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-leaf font-semibold text-xs tracking-[0.2em] uppercase mb-4">
              Get started
            </p>
            <h2 className="font-fraunces text-3xl sm:text-4xl text-ink leading-tight mb-6">
              Ready to power your home or farm?
            </h2>
            <p className="text-ink/80 leading-relaxed mb-6">
              Drop your details and we will call you back within one business
              day to arrange a free site visit. Or reach out to us directly.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <a
                href="tel:+265881682589"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-dusk text-on-dark font-semibold hover:bg-dusk-deep transition-colors shadow-sm"
              >
                <span aria-hidden="true">&#9742;</span>
                Call +265 881 682 589
              </a>
            </div>

            <div className="space-y-2 pt-3 border-t border-ink/15">
              <p className="text-leaf-deep font-mono text-xs uppercase tracking-wider font-bold">
                Direct Email Inquiries
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <a
                  href="mailto:info@ies.mw"
                  className="inline-flex items-center gap-1.5 text-ink font-semibold hover:text-leaf-deep underline decoration-gold underline-offset-2 transition-colors font-mono text-xs sm:text-sm"
                >
                  <span aria-hidden="true">✉</span>
                  info@ies.mw
                </a>
                <a
                  href="mailto:bussiness@ies.mw"
                  className="inline-flex items-center gap-1.5 text-ink font-semibold hover:text-leaf-deep underline decoration-gold underline-offset-2 transition-colors font-mono text-xs sm:text-sm"
                >
                  <span aria-hidden="true">✉</span>
                  bussiness@ies.mw
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: mini form */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            {status === "success" ? (
              <div
                role="status"
                aria-live="polite"
                className="bg-dusk rounded-xl p-8 text-center"
              >
                <p className="text-gold font-fraunces text-2xl mb-3">Received!</p>
                <p className="text-on-dark font-medium">
                  We will be in touch within one business day.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="bg-dusk rounded-xl p-8 space-y-5"
              >
                {/* Honeypot */}
                <input
                  type="text"
                  {...register("_hp")}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="absolute opacity-0 pointer-events-none"
                  autoComplete="off"
                />

                <div>
                  <label htmlFor="cta-name" className="block text-on-dark text-sm font-semibold mb-1">
                    Full name
                  </label>
                  <input
                    id="cta-name"
                    type="text"
                    autoComplete="name"
                    {...register("name")}
                    className="w-full rounded-md bg-dusk-deep border border-on-dark/30 text-on-dark placeholder-on-dark/70 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-gold-hi text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cta-phone" className="block text-on-dark text-sm font-semibold mb-1">
                    Phone number
                  </label>
                  <input
                    id="cta-phone"
                    type="tel"
                    autoComplete="tel"
                    {...register("phone")}
                    className="w-full rounded-md bg-dusk-deep border border-on-dark/30 text-on-dark placeholder-on-dark/70 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                    placeholder="0881 234 567"
                  />
                  {errors.phone && (
                    <p className="text-gold-hi text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cta-service" className="block text-on-dark text-sm font-medium mb-1">
                    Service needed
                  </label>
                  <select
                    id="cta-service"
                    {...register("service")}
                    className="w-full rounded-md bg-dusk-deep border border-on-dark/30 text-on-dark px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  >
                    {SERVICES.map(({ slug, label }) => (
                      <option key={slug} value={slug} className="bg-dusk-deep text-on-dark">
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {status === "error" && (
                  <p role="alert" aria-live="assertive" className="text-gold-hi text-sm">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 rounded-md bg-gold text-dusk-deep font-bold text-sm hover:bg-gold-hi transition-colors disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {status === "loading" ? "Sending..." : "Request a callback"}
                  </span>
                  <span className="absolute inset-0 -skew-x-12 bg-white/20 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-500" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
