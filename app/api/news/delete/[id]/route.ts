import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: { id: string } }   // ❤️ ต้องมี
) {
  const { id } = context.params;
  const nid = Number(id);

  if (isNaN(nid)) {
    return NextResponse.json({ ok: false, message: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  const bucket = process.env.SUPABASE_BUCKET!;
  const prefix = `${nid}_`;

  const { data: files } = await supabaseServer.storage.from(bucket).list("news");

  if (files) {
    const toDelete = files
      .filter((f) => f.name.startsWith(prefix))
      .map((f) => `news/${f.name}`);

    if (toDelete.length > 0) {
      await supabaseServer.storage.from(bucket).remove(toDelete);
    }
  }

  await prisma.newsMedia.deleteMany({
    where: { newsId: nid },
  });

  await prisma.news.delete({
    where: { id: nid },
  });

  return NextResponse.json({ ok: true });
}
