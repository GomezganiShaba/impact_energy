import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const service = searchParams.get("service") ?? "";
  const search = searchParams.get("search") ?? "";

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

  try {
    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "ID",
      "Date",
      "Name",
      "Phone",
      "Email",
      "Service",
      "Location",
      "Property Type",
      "Status",
      "Notes",
    ];

    const escapeCsv = (val: string | null | undefined) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = inquiries.map((inq) => [
      escapeCsv(inq.id),
      escapeCsv(inq.createdAt.toISOString()),
      escapeCsv(inq.name),
      escapeCsv(inq.phone),
      escapeCsv(inq.email),
      escapeCsv(inq.service),
      escapeCsv(inq.location),
      escapeCsv(inq.propertyType),
      escapeCsv(inq.status),
      escapeCsv(inq.notes),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="inquiries-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/export] Error:", error);
    return NextResponse.json(
      { error: "Failed to export inquiries" },
      { status: 500 }
    );
  }
}

