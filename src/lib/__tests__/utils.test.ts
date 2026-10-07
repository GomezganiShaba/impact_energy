import { describe, it, expect } from "vitest";
import { normaliseMalawiPhone, hashWithSalt, cn, SERVICES } from "../utils";

describe("normaliseMalawiPhone", () => {
  it("normalises phone starting with 0 to +265 format", () => {
    expect(normaliseMalawiPhone("0881682589")).toBe("+265881682589");
    expect(normaliseMalawiPhone("0991234567")).toBe("+265991234567");
  });

  it("normalises phone starting with +265 correctly", () => {
    expect(normaliseMalawiPhone("+265881682589")).toBe("+265881682589");
    expect(normaliseMalawiPhone("+265 881 682 589")).toBe("+265881682589");
  });

  it("normalises phone starting with 265 without plus", () => {
    expect(normaliseMalawiPhone("265881682589")).toBe("+265881682589");
  });

  it("strips dashes and brackets", () => {
    expect(normaliseMalawiPhone("(+265) 88-168-2589")).toBe("+265881682589");
  });

  it("adds +265 prefix for raw digits", () => {
    expect(normaliseMalawiPhone("881682589")).toBe("+265881682589");
  });
});

describe("hashWithSalt", () => {
  it("generates consistent SHA-256 hex string", async () => {
    const hash1 = await hashWithSalt("192.168.1.1", "my-salt");
    const hash2 = await hashWithSalt("192.168.1.1", "my-salt");
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it("produces different hashes with different salts or ips", async () => {
    const hashA = await hashWithSalt("192.168.1.1", "salt-1");
    const hashB = await hashWithSalt("192.168.1.1", "salt-2");
    const hashC = await hashWithSalt("192.168.1.2", "salt-1");
    expect(hashA).not.toBe(hashB);
    expect(hashA).not.toBe(hashC);
  });
});

describe("cn utility", () => {
  it("merges class names properly", () => {
    expect(cn("bg-paper", "text-ink")).toBe("bg-paper text-ink");
    expect(cn("px-2", true && "py-2", false && "hidden")).toBe("px-2 py-2");
  });
});

describe("SERVICES catalog", () => {
  it("contains core services with proper slugs and labels", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(slugs).toContain("standalone-hybrid-solar");
    expect(slugs).toContain("solar-water-pumping");
    expect(slugs).toContain("mini-grids");
    expect(slugs).toContain("clean-cooking");
    expect(slugs).toContain("biogas");
    expect(slugs).toContain("maintenance-servicing");
    expect(slugs).toContain("not-sure");
    expect(SERVICES.length).toBeGreaterThanOrEqual(6);
  });
});

