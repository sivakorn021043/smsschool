import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, context: any) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ ok: false, message: "ID ไม่ถูกต้อง" });
    }

    await prisma.staff.delete({ where: { id } });

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("DELETE STAFF ERROR:", err);
    return NextResponse.json({ ok: false, message: err.message });
  }
}
