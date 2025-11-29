import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,                               // ✅ ต้องเป็น NextRequest
  context: { params: Promise<{ id: string }> }   // ✅ ต้องเป็น Promise
) {
  try {
    const { id } = await context.params;         // ✅ ต้อง await
    const nid = Number(id);

    if (isNaN(nid)) {
      return NextResponse.json(
        { ok: false, message: "ID ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    await prisma.staff.delete({ where: { id: nid } });

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("DELETE STAFF ERROR:", err);
    return NextResponse.json(
      { ok: false, message: err.message },
      { status: 500 }
    );
  }
}
