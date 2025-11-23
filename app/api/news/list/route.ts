import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.news.findMany({
      include: { media: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, data });

  } catch (err: any) {
    console.error("NEWS LIST ERROR:", err);
    return NextResponse.json({ ok: false, message: err.message });
  }
}
