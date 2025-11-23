import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const nid = Number(id);

  if (isNaN(nid)) {
    return NextResponse.json({ ok: false, message: "ID ไม่ถูกต้อง" });
  }

  const bucket = process.env.SUPABASE_BUCKET!;
  const prefix = `${nid}_`;

  // ============ 1) ลบรูปจาก Supabase =============
  const { data: files } = await supabaseServer.storage
    .from(bucket)
    .list("news");

  if (files) {
    const toDelete = files
      .filter((f) => f.name.startsWith(prefix))
      .map((f) => `news/${f.name}`);

    if (toDelete.length > 0) {
      await supabaseServer.storage.from(bucket).remove(toDelete);
    }
  }

  // ============ 2) ลบรูปใน Prisma =============
  await prisma.newsMedia.deleteMany({
    where: { newsId: nid },
  });

  // ============ 3) ลบข่าว =============
  await prisma.news.delete({
    where: { id: nid },
  });

  return NextResponse.json({ ok: true, message: "Deleted successfully" });
}
