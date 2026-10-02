"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { inquirySchema, type InquiryFormData } from "@/lib/schema";
import { SERVICES } from "@/lib/utils";

const LOCATION_AREAS = [
  "Area 23",
  "Area 49",
  "Other in Lilongwe",
  "Outside Lilongwe",
] as const;

const PROPERTY_TYPES = [
  "Home",
  "Farm",
  "School or clinic",
  "Business",
  "Other",
] as const;

interface QuoteFormProps {
  sourcePath?: string;
}

export default function QuoteForm({ sourcePath = "/quote" }: QuoteFormProps) {
  const params = useSearchParams();
  const serviceParam = params.get("service") ?? "not-sure";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const startTimeRef = useRef(Date.now());
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      service: "not-sure",
      locationArea: "Area 23",
      propertyType: "Home",
    },
  });

  // Prefill service from query param
  useEffect(() => {
    const validSlug = SERVICES.find((s) => s.slug === serviceParam)?.slug ?? "not-sure";
    setValue("service", validSlug as InquiryFormData["service"]);
  }, [serviceParam, setValue]);

  // Focus success message on submit
  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    }
  }, [status]);

  const onSubmit = async (data: InquiryFormData) => {
    if (data._hp) return; // honeypot triggered

    // Minimum time check: 3 seconds
    const elapsed = Date.now() - startTimeRef.current;
    if (elapsed < 3000) {
      await new Promise((r) => setTimeout(r, 3000 - elapsed));
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          _submittedAt: startTimeRef.current,
          sourcePath,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong. Please try again or call us.");
        setStatus("error");
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setErrorMsg("Could not connect. Please call +265 881 682 589.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        aria-label="Form submitted successfully"
        className="rounded-2xl bg-dusk p-10 text-center focus:outline-none"
      >
        <p className="text-gold font-fraunces text-3xl mb-4">Request received!</p>
        <p className="text-on-dark/85 mb-6 leading-relaxed max-w-md mx-auto">
          Thank you for reaching out. We will review your request and call you
          back within one business day to arrange your free site visit.
        </p>
        <p className="text-on-dark/70 text-sm">
          Questions? Call Steve Khomba on{" "}
          <a href="tel:+265881682589" className="text-gold underline">
            +265 881 682 589
          </a>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-8"
      aria-label="Get a free site quote"
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

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Full name */}
        <div>
          <label htmlFor="name" className="block text-ink font-medium text-sm mb-1.5">
            Full name <span className="text-leaf" aria-label="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register("name")}
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
            className="w-full rounded-lg border border-ink/30 bg-paper px-4 py-3 text-ink text-sm focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf"
            placeholder="e.g. Jane Banda"
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-leaf-deep text-xs mt-1.5 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-ink font-medium text-sm mb-1.5">
            Phone number <span className="text-leaf" aria-label="required">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            {...register("phone")}
            aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
            aria-invalid={!!errors.phone}
            className="w-full rounded-lg border border-ink/30 bg-paper px-4 py-3 text-ink text-sm focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf"
            placeholder="0881 234 567 or +265 881 234 567"
          />
          <p id="phone-hint" className="text-ink/60 text-xs mt-1">
            We will use this to call you back.
          </p>
          {errors.phone && (
            <p id="phone-error" role="alert" className="text-leaf-deep text-xs mt-1 font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-ink font-medium text-sm mb-1.5">
            Email address{" "}
            <span className="text-ink/50 font-normal text-xs">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-describedby={errors.email ? "email-error" : "email-hint"}
            aria-invalid={!!errors.email}
            className="w-full rounded-lg border border-ink/30 bg-paper px-4 py-3 text-ink text-sm focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf"
            placeholder="jane@example.com"
          />
          <p id="email-hint" className="text-ink/60 text-xs mt-1">
            We will send a confirmation if provided.
          </p>
          {errors.email && (
            <p id="email-error" role="alert" className="text-leaf-deep text-xs mt-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Service */}
        <div>
          <label htmlFor="service" className="block text-ink font-medium text-sm mb-1.5">
            Service <span className="text-leaf" aria-label="required">*</span>
          </label>
          <select
            id="service"
            {...register("service")}
            aria-describedby={errors.service ? "service-error" : undefined}
            aria-invalid={!!errors.service}
            className="w-full rounded-lg border border-ink/30 bg-paper px-4 py-3 text-ink text-sm focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf"
          >
            {SERVICES.map(({ slug, label }) => (
              <option key={slug} value={slug}>{label}</option>
            ))}
          </select>
          {errors.service && (
            <p id="service-error" role="alert" className="text-leaf-deep text-xs mt-1.5 font-medium">
              {errors.service.message}
            </p>
          )}
        </div>

        {/* Location area */}
        <div>
          <label htmlFor="locationArea" className="block text-ink font-medium text-sm mb-1.5">
            Area <span className="text-leaf" aria-label="required">*</span>
          </label>
          <select
            id="locationArea"
            {...register("locationArea")}
            aria-invalid={!!errors.locationArea}
            className="w-full rounded-lg border border-ink/30 bg-paper px-4 py-3 text-ink text-sm focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf"
          >
            {LOCATION_AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Location detail */}
        <div>
          <label htmlFor="locationDetail" className="block text-ink font-medium text-sm mb-1.5">
            Location details{" "}
            <span className="text-ink/50 font-normal text-xs">(optional)</span>
          </label>
          <input
            id="locationDetail"
            type="text"
            {...register("locationDetail")}
            className="w-full rounded-lg border border-ink/30 bg-paper px-4 py-3 text-ink text-sm focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf"
            placeholder="Village name, road, landmark..."
          />
        </div>

        {/* Property type */}
        <div>
          <label htmlFor="propertyType" className="block text-ink font-medium text-sm mb-1.5">
            Property type <span className="text-leaf" aria-label="required">*</span>
          </label>
          <select
            id="propertyType"
            {...register("propertyType")}
            aria-invalid={!!errors.propertyType}
            className="w-full rounded-lg border border-ink/30 bg-paper px-4 py-3 text-ink text-sm focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-ink font-medium text-sm mb-1.5">
          Message{" "}
          <span className="text-ink/50 font-normal text-xs">(optional, max 1000 chars)</span>
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          aria-describedby={errors.message ? "message-error" : "message-count"}
          aria-invalid={!!errors.message}
          className="w-full rounded-lg border border-ink/30 bg-paper px-4 py-3 text-ink text-sm focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf resize-y"
          placeholder="Tell us more about your property or project..."
        />
        <p id="message-count" className="text-ink/60 text-xs mt-1">
          {watch("message")?.length ?? 0}/1000
        </p>
        {errors.message && (
          <p id="message-error" role="alert" className="text-leaf-deep text-xs mt-1 font-medium">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          {...register("consent")}
          aria-describedby={errors.consent ? "consent-error" : undefined}
          aria-invalid={!!errors.consent}
          className="mt-0.5 h-4 w-4 rounded border-ink/40 accent-leaf"
        />
        <div>
          <label htmlFor="consent" className="text-sm text-ink leading-relaxed">
            I agree to the{" "}
            <a href="/privacy" className="underline text-leaf-deep hover:text-leaf">
              Privacy Policy
            </a>{" "}
            and consent to Impact Energy Solution contacting me about my request.{" "}
            <span className="text-leaf" aria-label="required">*</span>
          </label>
          {errors.consent && (
            <p id="consent-error" role="alert" className="text-leaf-deep text-xs mt-1 font-medium">
              {errors.consent.message}
            </p>
          )}
        </div>
      </div>

      {/* Server error */}
      {status === "error" && (
        <div role="alert" aria-live="assertive" className="rounded-lg bg-dusk/10 border border-leaf/30 p-4">
          <p className="text-ink text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto px-10 py-4 rounded-lg bg-gold text-dusk-deep font-bold text-base hover:bg-gold-hi transition-colors disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
      >
        <span className="relative z-10">
          {status === "loading" ? "Submitting..." : "Submit request"}
        </span>
        <span className="absolute inset-0 -skew-x-12 bg-white/20 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-500" />
      </button>
    </form>
  );
}
