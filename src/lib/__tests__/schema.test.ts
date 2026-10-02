import { describe, it, expect } from "vitest";
import { inquirySchema, compactInquirySchema } from "../schema";

describe("inquirySchema", () => {
  const validData = {
    name: "John Banda",
    phone: "0881682589",
    email: "john@example.com",
    service: "standalone-hybrid-solar",
    locationArea: "Area 23",
    locationDetail: "Near Community Centre",
    propertyType: "Home",
    message: "Need a solar system for my 3-bedroom house.",
    consent: true,
  };

  it("validates correct data and normalises phone", () => {
    const res = inquirySchema.safeParse(validData);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.phone).toBe("+265881682589");
    }
  });

  it("fails if name is too short", () => {
    const res = inquirySchema.safeParse({ ...validData, name: "J" });
    expect(res.success).toBe(false);
  });

  it("fails if phone is invalid", () => {
    const res = inquirySchema.safeParse({ ...validData, phone: "12345" });
    expect(res.success).toBe(false);
  });

  it("allows optional email to be empty or omitted", () => {
    const withoutEmail = { ...validData, email: "" };
    const res = inquirySchema.safeParse(withoutEmail);
    expect(res.success).toBe(true);
  });

  it("rejects honeypot submission", () => {
    const withHp = { ...validData, _hp: "bot-field" };
    const res = inquirySchema.safeParse(withHp);
    expect(res.success).toBe(false);
  });

  it("fails if consent is false", () => {
    const withoutConsent = { ...validData, consent: false };
    const res = inquirySchema.safeParse(withoutConsent);
    expect(res.success).toBe(false);
  });
});

describe("compactInquirySchema", () => {
  it("validates compact form submission", () => {
    const res = compactInquirySchema.safeParse({
      name: "Mary Phiri",
      phone: "+265 991 234 567",
      service: "solar-water-pumping",
      consent: true,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.phone).toBe("+265991234567");
    }
  });
});
