import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer";
import sharp from "sharp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ================= GET =================
export async function GET(
  req: Request,
  context: { params: { id: string } }   // ⭐ FIX: ไม่มี Promise
) {
  const { id } = context.params;        // ⭐ FIX: ไม่ต้อง await
  const nid = Number(id);

  if (!nid || isNaN(nid)) {
    return NextResponse.json({ ok: false, message: "ID ไม่ถูกต้อง" });
  }

  const news = await prisma.news.findUnique({
    where: { id: nid },
  });

  if (!news) {
    return NextResponse.json({ ok: false, message: "ไม่พบข้อมูล" });
  }

  const bucket = process.env.SUPABASE_BUCKET!;

  const { data: files, error } = await supabaseServer.storage
    .from(bucket)
    .list("news");

  const images =
    (files || [])
      .filter((f) => f.name.startsWith(`${nid}_`))
      .map((f) => ({
        filename: f.name,
        url: supabaseServer.storage
          .from(bucket)
          .getPublicUrl(`news/${f.name}`).data.publicUrl,
      }));

  return NextResponse.json({ ok: true, data: news, images });
}



// ================= PATCH =================
export async function PATCH(
  req: Request,
  context: { params: { id: string } }   // ⭐ FIX: ไม่มี Promise
) {
  try {
    const { id } = context.params;      // ⭐ FIX: ไม่ต้อง await
    const nid = Number(id);

    if (!nid || isNaN(nid)) {
      return NextResponse.json({ ok: false, message: "ID ไม่ถูกต้อง" });
    }

    const form = await req.formData();
    const title = form.get("title") as string;
    const detail = form.get("detail") as string;
    const files = form.getAll("files") as File[];

    if (!title || !detail) {
      return NextResponse.json({ ok: false, message: "Missing fields" });
    }

    await prisma.news.update({
      where: { id: nid },
      data: { title, detail },
    });

    const bucket = process.env.SUPABASE_BUCKET!;
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const buf = Buffer.from(await file.arrayBuffer());

      const compressed = await sharp(buf)
        .resize(1200)
        .jpeg({ quality: 75 })
        .toBuffer();

      const filePath = `news/${nid}_${Date.now()}.jpg`;

      const { error } = await supabaseServer.storage
        .from(bucket)
        .upload(filePath, compressed, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (!error) {
        uploadedUrls.push(
          supabaseServer.storage
            .from(bucket)
            .getPublicUrl(filePath).data.publicUrl
        );
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Update success",
      uploadedUrls,
    });

  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message });
  }
}
