import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalise a Malawi phone number to E.164 format (+265XXXXXXXXX).
 * Accepts:
 *   0881682589   (local, 10-digit with leading 0)
 *   881682589    (local, no leading 0)
 *   +265881682589
 *   265881682589
 */
export function normaliseMalawiPhone(raw: string): string {
  if (!raw) return "";
  let digits = raw.replace(/\D/g, "");

  // Handle +265 or 265 prefix with optional leading 0 (e.g. 2650881... -> +265881...)
  if (digits.startsWith("265")) {
    let rest = digits.slice(3);
    if (rest.startsWith("0")) {
      rest = rest.slice(1);
    }
    return `+265${rest}`;
  }

  // Strip local leading 0
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // 7 to 10 digits without country code is a Malawi local number (mobile or landline)
  if (digits.length >= 7 && digits.length <= 10) {
    return `+265${digits}`;
  }

  // Fallback for international numbers
  return digits ? `+${digits}` : "";
}

/**
 * Hash a string with SHA-256 using a salt (for IP anonymisation).
 * Works in both Node.js and Edge runtimes.
 */
export async function hashWithSalt(
  value: string,
  salt: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${value}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const SERVICES = [
  { slug: "standalone-hybrid-solar", label: "Standalone & hybrid solar systems" },
  { slug: "solar-water-pumping", label: "Solar water pumping" },
  { slug: "mini-grids", label: "Mini-grids" },
  { slug: "clean-cooking", label: "Clean cooking technologies" },
  { slug: "biogas", label: "Biogas installation" },
  { slug: "maintenance-servicing", label: "Maintenance & servicing" },
  { slug: "not-sure", label: "Not sure" },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];

