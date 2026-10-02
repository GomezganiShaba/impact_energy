import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Inquiries" };

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-gold text-dusk-deep",
  CONTACTED: "bg-leaf text-on-dark",
  QUOTED: "bg-leaf-deep text-on-dark",
  WON: "bg-dusk text-on-dark",
  LOST: "bg-ink/30 text-ink",
};

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const perPage = 20;
  const status = sp.status ?? "";
  const service = sp.service ?? "";
  const search = sp.search ?? "";

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(service ? { service: { contains: service } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as never } },
            { phone: { contains: search } },
            { email: { contains: search, mode: "insensitive" as never } },
          ],
        }
      : {}),
  };

  const [inquiries, total, newCount] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.inquiry.count({ where }),
    prisma.inquiry.count({ where: { status: "NEW" } }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  const buildUrl = (params: Record<string, string>) => {
    const p = new URLSearchParams({ ...(sp as Record<string, string>), ...params });
    return `/admin/inquiries?${p.toString()}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-fraunces text-3xl text-ink font-bold">Inquiries</h1>
          <p className="text-ink/60 text-sm mt-1">
            {total} total · {newCount} new
          </p>
        </div>
        <a
          href={`/api/admin/export?${new URLSearchParams(sp as Record<string, string>).toString()}`}
          className="px-4 py-2 rounded-lg bg-dusk text-on-dark text-sm font-medium hover:bg-dusk-deep transition-colors"
        >
          Export CSV
        </a>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3 mb-6">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search name, phone or email..."
          className="px-4 py-2 rounded-lg border border-ink/20 bg-paper text-ink text-sm w-64 focus:outline-none focus:border-leaf"
        />
        <select
          name="status"
          defaultValue={status}
          className="px-4 py-2 rounded-lg border border-ink/20 bg-paper text-ink text-sm focus:outline-none focus:border-leaf"
        >
          <option value="">All statuses</option>
          {["NEW", "CONTACTED", "QUOTED", "WON", "LOST"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-gold text-dusk-deep text-sm font-semibold hover:bg-gold-hi transition-colors"
        >
          Filter
        </button>
        <Link
          href="/admin/inquiries"
          className="px-4 py-2 rounded-lg border border-ink/20 text-ink text-sm hover:bg-paper-deep transition-colors"
        >
          Clear
        </Link>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-ink/10 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-dusk text-on-dark">
              {["Date", "Name", "Phone", "Service", "Location", "Type", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/50">
                  No inquiries found.
                </td>
              </tr>
            )}
            {inquiries.map((inq, i) => (
              <tr
                key={inq.id}
                className={`border-t border-ink/10 hover:bg-paper-deep transition-colors ${
                  i % 2 === 0 ? "bg-paper" : "bg-paper/70"
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-ink/60">
                  {new Date(inq.createdAt).toLocaleDateString("en-MW")}
                </td>
                <td className="px-4 py-3 font-medium text-ink">
                  <Link href={`/admin/inquiries/${inq.id}`} className="hover:text-leaf underline underline-offset-2">
                    {inq.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink/80">
                  <a href={`tel:${inq.phone}`} className="hover:text-leaf">{inq.phone}</a>
                </td>
                <td className="px-4 py-3 text-ink/70 max-w-[160px] truncate">{inq.service}</td>
                <td className="px-4 py-3 text-ink/70">{inq.location}</td>
                <td className="px-4 py-3 text-ink/70">{inq.propertyType}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${STATUS_COLORS[inq.status]}`}>
                    {inq.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-6 justify-center">
          {page > 1 && (
            <Link href={buildUrl({ page: String(page - 1) })} className="px-4 py-2 rounded-lg border border-ink/20 text-ink text-sm hover:bg-paper-deep">
              Previous
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-ink/60">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={buildUrl({ page: String(page + 1) })} className="px-4 py-2 rounded-lg border border-ink/20 text-ink text-sm hover:bg-paper-deep">
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
