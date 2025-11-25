import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: { id: string } }   // <- กำหนด type ให้ถูกต้อง
) {
  try {
    const { id } = context.params;        // <- ไม่ต้อง await
    const nid = Number(id);

    if (!nid || isNaN(nid)) {
      return NextResponse.json({ ok: false, message: "ID ไม่ถูกต้อง" }, { status: 400 });
    }

    const staff = await prisma.staff.findUnique({
      where: { id: nid },
    });

    if (!staff) {
      return NextResponse.json({ ok: false, message: "ไม่พบข้อมูล" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      data: staff,
    });

  } catch (err: any) {
    console.error("GET STAFF ERROR:", err);
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
