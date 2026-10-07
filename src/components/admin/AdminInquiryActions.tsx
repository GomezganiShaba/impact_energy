"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  inquiry: {
    id: string;
    status: string;
    notes: string;
    email?: string;
  };
}

const STATUSES = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as const;

export default function AdminInquiryActions({ inquiry }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(inquiry.status);
  const [notes, setNotes] = useState(inquiry.notes);
  const [saved, setSaved] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    setError("");
    setSaved(false);
    startTransition(async () => {
      const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      } else {
        setError("Failed to save. Please try again.");
      }
    });
  };

  const handleResend = () => {
    setResent(false);
    setError("");
    startTransition(async () => {
      const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resend" }),
      });
      if (res.ok) {
        setResent(true);
        router.refresh();
      } else {
        setError("Failed to resend notification.");
      }
    });
  };

  return (
    <div className="bg-paper-deep rounded-2xl p-6 border border-ink/10">
      <h2 className="font-fraunces text-lg text-ink font-bold mb-4">Manage inquiry</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-ink/20 bg-paper px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-leaf"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-ink/20 bg-paper px-4 py-3 text-ink text-sm resize-none focus:outline-none focus:border-leaf"
            placeholder="Internal notes about this inquiry..."
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {saved && <p className="text-leaf text-sm font-medium">Saved successfully.</p>}
        {resent && <p className="text-leaf text-sm font-medium">Team notification resent.</p>}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-5 py-2.5 rounded-lg bg-gold text-dusk-deep text-sm font-semibold hover:bg-gold-hi transition-colors disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save changes"}
          </button>
          <button
            onClick={handleResend}
            disabled={isPending}
            className="px-5 py-2.5 rounded-lg bg-dusk text-on-dark text-sm font-medium hover:bg-dusk-deep transition-colors disabled:opacity-60"
          >
            Resend team notification
          </button>
        </div>
      </div>
    </div>
  );
}

