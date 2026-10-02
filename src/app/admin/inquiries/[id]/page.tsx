import { prisma } from "../../../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import AdminInquiryActions from "../../../../components/admin/AdminInquiryActions";

export const metadata: Metadata = { title: "Inquiry Detail" };

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { emailLogs: { orderBy: { createdAt: "desc" } } },
  });

  if (!inquiry) notFound();

  const waNumber = inquiry.phone.replace(/\D/g, "");

  const fields = [
    { label: "Name", value: inquiry.name },
    { label: "Phone", value: inquiry.phone },
    { label: "Email", value: inquiry.email ?? "Not provided" },
    { label: "Service", value: inquiry.service },
    { label: "Location", value: inquiry.location },
    { label: "Property type", value: inquiry.propertyType },
    { label: "Message", value: inquiry.message ?? "None" },
    { label: "Source", value: inquiry.sourcePath },
    { label: "Submitted", value: new Date(inquiry.createdAt).toLocaleString("en-MW", { timeZone: "Africa/Blantyre" }) },
  ];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/inquiries" className="text-leaf text-sm hover:text-leaf-deep font-medium">
          &larr; Back to inquiries
        </Link>
      </div>

      <div className="bg-paper-deep rounded-2xl p-8 shadow-sm border border-ink/10 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-fraunces text-2xl text-ink font-bold">{inquiry.name}</h1>
            <p className="text-ink/60 text-sm mt-1">{inquiry.service}</p>
          </div>
          <span className="px-3 py-1 rounded-lg bg-gold text-dusk-deep text-xs font-bold uppercase">
            {inquiry.status}
          </span>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a
            href={`tel:${inquiry.phone}`}
            className="px-4 py-2 rounded-lg bg-dusk text-on-dark text-sm font-medium hover:bg-dusk-deep transition-colors"
          >
            Call {inquiry.phone}
          </a>
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${inquiry.name}, regarding your ${inquiry.service} enquiry...`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-leaf text-on-dark text-sm font-medium hover:bg-leaf-deep transition-colors"
          >
            WhatsApp
          </a>
        </div>

        {/* Fields */}
        <dl className="space-y-3">
          {fields.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-3 gap-2">
              <dt className="text-ink/60 text-sm font-medium">{label}</dt>
              <dd className="col-span-2 text-ink text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Actions: status update, notes, resend */}
      <AdminInquiryActions inquiry={{
        id: inquiry.id,
        status: inquiry.status,
        notes: inquiry.notes ?? "",
        email: inquiry.email ?? undefined,
      }} />

      {/* Email logs */}
      {inquiry.emailLogs.length > 0 && (
        <div className="mt-6 bg-paper-deep rounded-2xl p-6 border border-ink/10">
          <h2 className="font-fraunces text-lg text-ink font-bold mb-4">Email log</h2>
          <div className="space-y-2">
            {inquiry.emailLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between text-sm py-2 border-b border-ink/10 last:border-0">
                <div>
                  <span className="font-medium text-ink">{log.type}</span>
                  <span className="text-ink/50 ml-2">to {log.to}</span>
                  {log.error && (
                    <p className="text-red-600 text-xs mt-0.5">{log.error}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.status === "SENT" ? "bg-leaf text-on-dark" : "bg-red-100 text-red-700"}`}>
                    {log.status}
                  </span>
                  <p className="text-ink/50 text-xs mt-1">
                    {new Date(log.createdAt).toLocaleString("en-MW")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
