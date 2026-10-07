"use server";

import { prisma } from "@/lib/prisma";
import {
  getMailMessages,
  sendMailMessage,
  seedInquiriesIntoMailbox,
  type MailboxAccount,
} from "@/lib/mail/service";
import type { MailFolder } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getMailData(mailbox: string, folder: MailFolder = "INBOX", search?: string) {
  await seedInquiriesIntoMailbox();
  return await getMailMessages({ mailbox, folder, search });
}

export async function sendEmailAction({
  mailbox,
  to,
  cc,
  bcc,
  subject,
  bodyText,
  replyToId,
}: {
  mailbox: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  bodyText: string;
  replyToId?: string;
}) {
  try {
    const result = await sendMailMessage({
      mailbox,
      to,
      cc,
      bcc,
      subject,
      bodyText,
      replyToId,
    });
    revalidatePath("/mail");
    return { success: true, message: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email.";
    return { success: false, error: message };
  }
}

export async function markMessageReadAction(id: string, isRead: boolean) {
  try {
    await prisma.mailMessage.update({
      where: { id },
      data: { isRead },
    });
    revalidatePath("/mail");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function toggleStarAction(id: string) {
  try {
    const msg = await prisma.mailMessage.findUnique({ where: { id } });
    if (!msg) return { success: false };
    await prisma.mailMessage.update({
      where: { id },
      data: { isStarred: !msg.isStarred },
    });
    revalidatePath("/mail");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function moveMessageFolderAction(id: string, folder: MailFolder) {
  try {
    await prisma.mailMessage.update({
      where: { id },
      data: { folder },
    });
    revalidatePath("/mail");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function deleteMessageAction(id: string) {
  try {
    // If already in trash, delete permanently; otherwise move to trash
    const msg = await prisma.mailMessage.findUnique({ where: { id } });
    if (!msg) return { success: false };

    if (msg.folder === "TRASH") {
      await prisma.mailMessage.delete({ where: { id } });
    } else {
      await prisma.mailMessage.update({
        where: { id },
        data: { folder: "TRASH" },
      });
    }
    revalidatePath("/mail");
    return { success: true };
  } catch {
    return { success: false };
  }
}
