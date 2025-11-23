import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ ok: true, staff });

  } catch (err: any) {
    console.error("STAFF LIST ERROR:", err);
    return NextResponse.json({ ok: false, message: err.message });
  }
}
