"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/admin/inquiries", label: "Inquiries", icon: "📋" },
  { href: "/", label: "View Website", icon: "🌐", external: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed inset-y-0 left-0 w-64 bg-dusk text-on-dark flex flex-col z-30 shadow-xl border-r border-leaf-deep/40"
      aria-label="Admin Navigation"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-leaf-deep/40 flex items-center gap-3">
        <Link href="/admin/inquiries" className="flex items-center gap-2">
          <Image
            src="/brand/logo.png"
            alt="Impact Energy Solution"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
        <span className="text-xs uppercase tracking-wider font-semibold text-gold px-2 py-0.5 rounded bg-dusk-deep border border-gold/30">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-leaf-deep text-gold shadow-sm font-semibold"
                  : "text-on-dark/80 hover:bg-leaf-deep/50 hover:text-on-dark"
              }`}
            >
              <span className="text-base" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-leaf-deep/40 bg-dusk-deep/50">
        <div className="px-4 py-2 mb-2">
          <p className="text-xs text-on-dark/60">Signed in as Administrator</p>
          <p className="text-xs font-semibold text-gold truncate">Area 23 & 49 HQ</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-leaf-deep text-gold text-sm font-bold hover:bg-gold hover:text-dusk-deep transition-all focus:outline-none focus:ring-2 focus:ring-gold border border-gold/30"
        >
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
