import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { prisma } from "../../../lib/prisma";
import { inquirySchema } from "../../../lib/schema";
import { rateLimit } from "../../../lib/ratelimit";
import { hashWithSalt, SERVICES } from "../../../lib/utils";
import { sendTeamNotification, sendCustomerConfirmation } from "../../../lib/email";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Rate limiting
    const ip = getClientIp(req);
    const rl = await rateLimit(`inquiry:${ip}`);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before submitting again." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)) },
        }
      );
    }

    // Minimum time check (3 seconds)
    const submittedAt = Number(body._submittedAt ?? 0);
    if (submittedAt && Date.now() - submittedAt < 3000) {
      return NextResponse.json(
        { error: "Submission too fast. Please try again." },
        { status: 429 }
      );
    }

    // Honeypot
    if (body._hp) {
      // Return 200 to not reveal the check to bots
      return NextResponse.json({ ok: true });
    }

    // Validate
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // Hash IP
    const salt = process.env.IP_HASH_SALT ?? "default-salt-change-me";
    const ipHash = await hashWithSalt(ip, salt);

    // Derive location string
    const location = data.locationDetail
      ? `${data.locationArea} - ${data.locationDetail}`
      : data.locationArea;

    // Derive service label
    const serviceLabel =
      SERVICES.find((s) => s.slug === data.service)?.label ?? data.service;

    // Persist inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email ?? null,
        service: serviceLabel,
        location,
        propertyType: data.propertyType,
        message: data.message ?? null,
        sourcePath: body.sourcePath ?? "/",
        ipHash,
        userAgent: req.headers.get("user-agent") ?? null,
        status: "NEW",
      },
    });

    // Fire emails after response (non-blocking)
    after(async () => {
      await sendTeamNotification(inquiry);
      if (inquiry.email) {
        await sendCustomerConfirmation(inquiry);
      }
    });

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/inquiries]", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please call us directly." },
      { status: 500 }
    );
  }
}

