import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import AdminSidebar from "../../../components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Inquiries",
  robots: { index: false, follow: false },
};

export default async function AdminInquiriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen" style={{ background: "var(--paper)" }}>
      <AdminSidebar />
      <main className="flex-1 ml-64 p-6 lg:p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}

