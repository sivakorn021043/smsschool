import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }   // ⭐ FIX: ระบุ type ให้ถูก
) {
  try {
    const { id } = context.params;       // ⭐ FIX: ไม่ต้อง await
    const nid = Number(id);

    if (isNaN(nid)) {
      return NextResponse.json({ ok: false, message: "ID ไม่ถูกต้อง" });
    }

    await prisma.staff.delete({ where: { id: nid } });

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("DELETE STAFF ERROR:", err);
    return NextResponse.json({ ok: false, message: err.message });
  }
}
