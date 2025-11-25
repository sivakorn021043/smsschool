import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const nid = Number(id);

    if (isNaN(nid)) {
      return NextResponse.json(
        { ok: false, message: "ID ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // ⭐ ใช้ bucket ที่ถูกต้อง (ต้องตรงกับ upload API)
    const bucket = "upload";
    const prefix = `${nid}_`;

    // ⭐ List รูปในโฟลเดอร์ news
    const { data: files, error: listError } =
      await supabaseServer.storage.from(bucket).list("news");

    if (listError) {
      console.error("SUPABASE LIST ERROR:", listError);
    }

    // ⭐ ลบเฉพาะไฟล์ที่ชื่อขึ้นต้นด้วย <id>_
    if (files) {
      const toDelete = files
        .filter((f) => f.name.startsWith(prefix))
        .map((f) => `news/${f.name}`);

      if (toDelete.length > 0) {
        await supabaseServer.storage.from(bucket).remove(toDelete);
      }
    }

    // ⭐ ลบข้อมูลใน DB
    await prisma.newsMedia.deleteMany({ where: { newsId: nid } });
    await prisma.news.delete({ where: { id: nid } });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ ok: false, message: err.message });
  }
}
