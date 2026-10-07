import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import TeamNotificationEmail from "../../emails/TeamNotification";
import CustomerConfirmationEmail from "../../emails/CustomerConfirmation";
import type { Inquiry } from "@prisma/client";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM ?? "Impact Energy Solution <quotes@impactenergysolution.com>";

function getToEmails(): string[] {
  return (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

async function logEmail(
  inquiryId: string,
  type: "TEAM_NOTIFICATION" | "CUSTOMER_CONFIRMATION" | "STATUS_UPDATE",
  to: string,
  status: "SENT" | "FAILED",
  providerId?: string,
  error?: string
) {
  try {
    await prisma.emailLog.create({
      data: { inquiryId, type, to, status, providerId, error },
    });
  } catch (err) {
    console.error("[logEmail] Failed to write EmailLog:", err);
  }
}

export async function sendTeamNotification(inquiry: Inquiry) {
  const toEmails = getToEmails();
  if (!toEmails.length) {
    console.warn("[sendTeamNotification] CONTACT_TO_EMAIL is not set.");
    return;
  }

  if (!resend) {
    console.warn("[sendTeamNotification] RESEND_API_KEY not set, skipping email.");
    await logEmail(inquiry.id, "TEAM_NOTIFICATION", toEmails.join(","), "FAILED", undefined, "RESEND_API_KEY not configured");
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://impactenergysolution.com";
  const adminUrl = `${siteUrl}/admin/inquiries/${inquiry.id}`;
  const waNumber = inquiry.phone.replace(/\D/g, "");

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: toEmails,
      replyTo: inquiry.email ?? undefined,
      subject: `New quote request: ${inquiry.service} (${inquiry.location})`,
      react: TeamNotificationEmail({ inquiry, adminUrl, waNumber }),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    await logEmail(
      inquiry.id,
      "TEAM_NOTIFICATION",
      toEmails.join(","),
      "SENT",
      result.data?.id
    );

    // Also persist into team webmail inboxes
    try {
      const mailboxes = [
        "kombasteve@ies.engineer",
        "lichaparichard@ies.engineer",
        "thauzelouis@ies.engineer",
        "info@ies.engineer",
      ];
      const fromStr = `${inquiry.name} <${inquiry.email || inquiry.phone}>`;
      const subj = `New quote request: ${inquiry.service} (${inquiry.location})`;
      const text = `Customer Name: ${inquiry.name}\nPhone: ${inquiry.phone}\nEmail: ${inquiry.email || "Not provided"}\nService: ${inquiry.service}\nLocation: ${inquiry.location}\nProperty Type: ${inquiry.propertyType}\nMessage: ${inquiry.message || "None"}`;
      for (const mbox of mailboxes) {
        await prisma.mailMessage.create({
          data: {
            mailbox: mbox,
            direction: "INBOUND",
            folder: "INBOX",
            from: fromStr,
            to: mbox,
            subject: subj,
            bodyText: text,
            snippet: `Quote request for ${inquiry.service} from ${inquiry.name}`,
            isRead: false,
            resendId: result.data?.id,
          },
        });
      }
    } catch (mboxErr) {
      console.error("[sendTeamNotification] Failed to store in webmail inbox:", mboxErr);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[sendTeamNotification] Failed:", msg);
    await logEmail(inquiry.id, "TEAM_NOTIFICATION", toEmails.join(","), "FAILED", undefined, msg);
  }
}

export async function sendCustomerConfirmation(inquiry: Inquiry) {
  if (!inquiry.email) return;

  if (!resend) {
    console.warn("[sendCustomerConfirmation] RESEND_API_KEY not set.");
    await logEmail(inquiry.id, "CUSTOMER_CONFIRMATION", inquiry.email, "FAILED", undefined, "RESEND_API_KEY not configured");
    return;
  }

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: [inquiry.email],
      subject: "We received your request, Impact Energy Solution",
      react: CustomerConfirmationEmail({ inquiry }),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    await logEmail(
      inquiry.id,
      "CUSTOMER_CONFIRMATION",
      inquiry.email,
      "SENT",
      result.data?.id
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[sendCustomerConfirmation] Failed:", msg);
    await logEmail(inquiry.id, "CUSTOMER_CONFIRMATION", inquiry.email, "FAILED", undefined, msg);
  }
}

export async function resendTeamNotification(inquiryId: string) {
  const inquiry = await prisma.inquiry.findUniqueOrThrow({ where: { id: inquiryId } });
  await sendTeamNotification(inquiry);
}

