import { NextRequest, NextResponse } from "next/server";
import { sendMailMessage } from "@/lib/mail/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mailbox, to, cc, bcc, subject, bodyText, bodyHtml, replyToId } = body;

    if (!mailbox || !to || (!bodyText && !bodyHtml)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: mailbox, to, bodyText/bodyHtml" },
        { status: 400 }
      );
    }

    const message = await sendMailMessage({
      mailbox,
      to,
      cc,
      bcc,
      subject,
      bodyText,
      bodyHtml,
      replyToId,
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to send email";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
