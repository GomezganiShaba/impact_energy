import { z } from "zod";
import { normaliseMalawiPhone, SERVICES } from "@/lib/utils";

const serviceSlugs = SERVICES.map((s) => s.slug) as [string, ...string[]];

export const inquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be under 120 characters"),

  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(25, "Phone number is too long")
    .transform((val) => normaliseMalawiPhone(val))
    .refine(
      (val) => /^\+265\d{7,10}$/.test(val) || /^\+\d{8,15}$/.test(val),
      "Please enter a valid phone number (e.g. 0881 234 567 or +265 881 234 567)"
    ),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),

  service: z.enum(serviceSlugs, {
    errorMap: () => ({ message: "Please select a service" }),
  }),

  locationArea: z.enum(
    ["Area 23", "Area 49", "Other in Lilongwe", "Outside Lilongwe"],
    { errorMap: () => ({ message: "Please select your area" }) }
  ),

  locationDetail: z
    .string()
    .max(200, "Location details must be under 200 characters")
    .optional(),

  propertyType: z.enum(["Home", "Farm", "School or clinic", "Business", "Other"], {
    errorMap: () => ({ message: "Please select a property type" }),
  }),

  message: z
    .string()
    .max(1000, "Message must be under 1000 characters")
    .optional(),

  consent: z
    .boolean({
      required_error: "Please agree to the privacy policy to proceed",
      invalid_type_error: "Please agree to the privacy policy to proceed",
    })
    .refine((val) => val === true, {
      message: "Please agree to the privacy policy to proceed",
    }),

  // Honeypot - must be empty
  _hp: z.string().max(0, "Spam detected").optional(),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

export const ctaInquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be under 120 characters"),

  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(25, "Phone number is too long")
    .transform((val) => normaliseMalawiPhone(val))
    .refine(
      (val) => /^\+265\d{7,10}$/.test(val) || /^\+\d{8,15}$/.test(val),
      "Please enter a valid Malawi phone number (e.g. 0881 234 567 or +265 881 234 567)"
    ),

  service: z.enum(serviceSlugs, {
    errorMap: () => ({ message: "Please select a service" }),
  }),

  _hp: z.string().max(0, "Spam detected").optional(),
});

export type CtaInquiryFormData = z.infer<typeof ctaInquirySchema>;

export const compactInquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be under 120 characters"),
  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(25, "Phone number is too long")
    .transform((val) => normaliseMalawiPhone(val))
    .refine(
      (val) => /^\+265\d{7,10}$/.test(val) || /^\+\d{8,15}$/.test(val),
      "Please enter a valid phone number"
    ),
  service: z.enum(serviceSlugs),
  consent: z.literal(true),
  _hp: z.string().max(0).optional(),
});

export type CompactInquiryFormData = z.infer<typeof compactInquirySchema>;

// Server-side schema additionally accepts timing and ip info
export const inquiryServerSchema = inquirySchema.extend({
  _submittedAt: z.number().optional(),
});

export type InquiryServerData = z.infer<typeof inquiryServerSchema>;


