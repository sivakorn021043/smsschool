import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, context: any) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    const staff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      return NextResponse.json({ ok: false, message: "ไม่พบข้อมูล" });
    }

    return NextResponse.json({
      ok: true,
      data: staff,
    });

  } catch (err: any) {
    console.error("GET STAFF ERROR:", err);
    return NextResponse.json({ ok: false, message: err.message });
  }
}
