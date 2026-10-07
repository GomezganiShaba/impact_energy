import { NextRequest, NextResponse } from "next/server";
import { recordInboundMessage } from "@/lib/mail/service";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Resend Inbound Webhook event format:
    // {
    //   type: "email.received",
    //   data: {
    //     from: "customer@example.com",
    //     to: ["kombasteve@ies.engineer"],
    //     subject: "Inquiry",
    //     text: "Hello...",
    //     html: "<p>Hello...</p>",
    //     email_id: "...",
    //   }
    // }
    const emailData = payload.data || payload;

    const from = typeof emailData.from === "string" ? emailData.from : emailData.from?.email || "unknown@sender.com";
    const toRaw = Array.isArray(emailData.to) ? emailData.to : [emailData.to || "info@ies.engineer"];
    const subject = emailData.subject || "(No Subject)";
    const bodyText = emailData.text || "";
    const bodyHtml = emailData.html || "";
    const resendId = emailData.email_id || emailData.id || undefined;

    // For every recipient that belongs to @ies.engineer, store a copy in their mailbox
    for (const recipient of toRaw) {
      const emailAddress = typeof recipient === "string" ? recipient : recipient?.email || "";
      const cleaned = emailAddress.toLowerCase().trim();

      await recordInboundMessage({
        mailbox: cleaned || "info@ies.engineer",
        from,
        to: emailAddress,
        subject,
        bodyText,
        bodyHtml,
        resendId,
      });
    }

    return NextResponse.json({ success: true, count: toRaw.length });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error processing inbound mail";
    console.error("[InboundWebhook] Error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
