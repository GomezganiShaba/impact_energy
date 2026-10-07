import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import type { MailFolder, MailDirection } from "@prisma/client";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const TEAM_ACCOUNTS = [
  {
    email: "kombasteve@ies.engineer",
    name: "Steve Khomba",
    role: "Co-founder & Director",
    avatar: "SK",
  },
  {
    email: "lichaparichard@ies.engineer",
    name: "Richard Lichapa",
    role: "Engineering & Operations",
    avatar: "RL",
  },
  {
    email: "thauzelouis@ies.engineer",
    name: "Louis Thauzeni",
    role: "Technical Operations",
    avatar: "LT",
  },
  {
    email: "info@ies.engineer",
    name: "Impact Energy Solution",
    role: "General / Inquiries",
    avatar: "IE",
  },
  {
    email: "bussiness@ies.engineer",
    name: "Impact Business",
    role: "Business Inquiries",
    avatar: "IB",
  },
] as const;

export type MailboxAccount = typeof TEAM_ACCOUNTS[number]["email"];

/**
 * Send an outbound email from the selected team mailbox using Resend
 * and persist it to the Sent folder in the database.
 */
export async function sendMailMessage({
  mailbox,
  to,
  cc,
  bcc,
  subject,
  bodyText,
  bodyHtml,
  replyToId,
}: {
  mailbox: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  replyToId?: string;
}) {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const account = TEAM_ACCOUNTS.find((a) => a.email.toLowerCase() === mailbox.toLowerCase());
  const fromDisplay = account ? `${account.name} <${mailbox}>` : mailbox;

  const toList = to.split(",").map((s) => s.trim()).filter(Boolean);
  const ccList = cc ? cc.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
  const bccList = bcc ? bcc.split(",").map((s) => s.trim()).filter(Boolean) : undefined;

  // Send via Resend
  const res = await resend.emails.send({
    from: fromDisplay,
    to: toList,
    cc: ccList,
    bcc: bccList,
    subject: subject || "(No Subject)",
    text: bodyText || undefined,
    html: bodyHtml || (bodyText ? `<div style="font-family: sans-serif; white-space: pre-wrap;">${bodyText}</div>` : "<p></p>"),
  });

  if (res.error) {
    throw new Error(res.error.message || "Failed to send email via Resend.");
  }

  const snippet = (bodyText || subject).slice(0, 120).trim();

  // Store in database under SENT folder (graceful fallback if DB is offline/unreachable on Vercel)
  try {
    const saved = await prisma.mailMessage.create({
      data: {
        mailbox,
        direction: "OUTBOUND",
        folder: "SENT",
        from: fromDisplay,
        to,
        cc,
        bcc,
        subject: subject || "(No Subject)",
        bodyText: bodyText || "",
        bodyHtml: bodyHtml || (bodyText ? `<div style="font-family: sans-serif; white-space: pre-wrap;">${bodyText}</div>` : ""),
        snippet,
        isRead: true,
        resendId: res.data?.id,
        replyToId,
      },
    });
    return saved;
  } catch (dbError) {
    console.warn("[sendMailMessage] Warning: Email sent via Resend successfully, but database is not reachable to log sent message:", dbError);
    // Return a mock object so the client knows sending succeeded
    return {
      id: `sent-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      mailbox,
      direction: "OUTBOUND" as const,
      folder: "SENT" as const,
      from: fromDisplay,
      to,
      cc: cc || null,
      bcc: bcc || null,
      subject: subject || "(No Subject)",
      bodyText: bodyText || "",
      bodyHtml: bodyHtml || "",
      snippet,
      isRead: true,
      isStarred: false,
      resendId: res.data?.id || null,
      replyToId: replyToId || null,
    };
  }
}

/**
 * Ingest an incoming email (from webhook, form submission, or sync)
 */
export async function recordInboundMessage({
  mailbox,
  from,
  to,
  subject,
  bodyText,
  bodyHtml,
  resendId,
  isStarred = false,
}: {
  mailbox: string;
  from: string;
  to: string;
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  resendId?: string;
  isStarred?: boolean;
}) {
  const snippet = (bodyText || subject).slice(0, 120).trim();

  return await prisma.mailMessage.create({
    data: {
      mailbox,
      direction: "INBOUND",
      folder: "INBOX",
      from,
      to,
      subject: subject || "(No Subject)",
      bodyText: bodyText || "",
      bodyHtml: bodyHtml || (bodyText ? `<div style="font-family: sans-serif; white-space: pre-wrap;">${bodyText}</div>` : ""),
      snippet,
      isRead: false,
      isStarred,
      resendId,
    },
  });
}

/**
 * Fetch messages for a specific mailbox and folder
 */
export async function getMailMessages({
  mailbox,
  folder = "INBOX",
  search,
}: {
  mailbox: string;
  folder?: MailFolder;
  search?: string;
}) {
  const where: any = {
    mailbox,
    folder,
  };

  if (folder === "ARCHIVE") {
    where.folder = "ARCHIVE";
  }

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { subject: { contains: q, mode: "insensitive" } },
      { from: { contains: q, mode: "insensitive" } },
      { to: { contains: q, mode: "insensitive" } },
      { bodyText: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const messages = await prisma.mailMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Calculate folder counts for badges
    const unreadInboxCount = await prisma.mailMessage.count({
      where: { mailbox, folder: "INBOX", isRead: false },
    });

    const totalInboxCount = await prisma.mailMessage.count({
      where: { mailbox, folder: "INBOX" },
    });

    const totalSentCount = await prisma.mailMessage.count({
      where: { mailbox, folder: "SENT" },
    });

    const totalStarredCount = await prisma.mailMessage.count({
      where: { mailbox, isStarred: true },
    });

    const totalTrashCount = await prisma.mailMessage.count({
      where: { mailbox, folder: "TRASH" },
    });

    return {
      messages,
      counts: {
        unreadInbox: unreadInboxCount,
        inbox: totalInboxCount,
        sent: totalSentCount,
        starred: totalStarredCount,
        trash: totalTrashCount,
      },
    };
  } catch (err) {
    console.warn("[getMailMessages] Database not reachable:", err);
    return {
      messages: [],
      counts: {
        unreadInbox: 0,
        inbox: 0,
        sent: 0,
        starred: 0,
        trash: 0,
      },
      error: "Database not connected. Please configure a cloud PostgreSQL database on Vercel.",
    };
  }
}

/**
 * Seed initial website inquiries into the mailboxes if empty
 * so that team members immediately see incoming requests.
 */
export async function seedInquiriesIntoMailbox() {
  try {
    const count = await prisma.mailMessage.count();
    if (count > 0) return;

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    if (!inquiries.length) return;

  const mailboxes = TEAM_ACCOUNTS.map((a) => a.email);

  for (const inq of inquiries) {
    const fromStr = `${inq.name} <${inq.email || inq.phone}>`;
    const subj = `New quote request: ${inq.service} (${inq.location})`;
    const text = `Customer Name: ${inq.name}
Phone: ${inq.phone}
Email: ${inq.email || "Not provided"}
Service: ${inq.service}
Location: ${inq.location}
Property Type: ${inq.propertyType}
Message: ${inq.message || "No additional message"}
Received: ${inq.createdAt.toLocaleString()}

View in Admin: https://ies.engineer/admin/inquiries/${inq.id}`;

    const html = `<div style="font-family: sans-serif; line-height: 1.6; color: #163A28;">
      <h2 style="color: #2E7D4F; border-bottom: 2px solid #F2B705; padding-bottom: 8px;">New Quote Request from ${inq.name}</h2>
      <p><strong>Customer Name:</strong> ${inq.name}</p>
      <p><strong>Phone:</strong> <a href="tel:${inq.phone}">${inq.phone}</a></p>
      <p><strong>Email:</strong> ${inq.email ? `<a href="mailto:${inq.email}">${inq.email}</a>` : "Not provided"}</p>
      <p><strong>Service Requested:</strong> ${inq.service}</p>
      <p><strong>Location:</strong> ${inq.location}</p>
      <p><strong>Property Type:</strong> ${inq.propertyType}</p>
      ${inq.message ? `<div style="background: #F6E79A; padding: 12px; border-radius: 8px; margin: 12px 0;"><strong>Message:</strong> ${inq.message}</div>` : ""}
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      <p style="font-size: 13px; color: #666;">Impact Energy Solution Inquiry System &bull; <a href="https://ies.engineer/admin/inquiries/${inq.id}">Open in Dashboard</a></p>
    </div>`;

        // Add for each team account
        for (const mailbox of mailboxes) {
          await prisma.mailMessage.create({
            data: {
              mailbox,
              direction: "INBOUND",
              folder: "INBOX",
              from: fromStr,
              to: mailbox,
              subject: subj,
              bodyText: text,
              bodyHtml: html,
              snippet: `Quote request for ${inq.service} at ${inq.location} from ${inq.name}`,
              isRead: false,
              createdAt: inq.createdAt,
            },
          });
        }
      }
  } catch (err) {
    console.warn("[seedInquiriesIntoMailbox] Database offline or inquiries table not accessible:", err);
  }
}

