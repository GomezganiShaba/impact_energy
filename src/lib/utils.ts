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
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("265")) {
    return `+${digits}`;
  }
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  if (digits.length >= 8 && digits.length <= 9) {
    return `+265${digits}`;
  }
  return `+${digits}`;
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
