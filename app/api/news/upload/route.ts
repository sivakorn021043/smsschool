// app/api/news/upload/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const title = String(form.get("title") || "");
    const detail = String(form.get("detail") || "");
    const files = form.getAll("files") as File[];

    if (!title || !detail) {
      return NextResponse.json({ ok: false, message: "Missing title/detail" });
    }

    // 1) บันทึกข่าว
    const news = await prisma.news.create({
      data: { title, detail },
    });

    const bucket = "upload";
    const urls: string[] = [];

    // 2) อัปโหลดไฟล์ทั้งหมดลง Supabase
    for (const file of files) {
      const buf = Buffer.from(await file.arrayBuffer());

      // ย่อรูป
      let compressed = buf;
      try {
        compressed = await sharp(buf)
          .resize(1200)
          .jpeg({ quality: 80 })
          .toBuffer();
      } catch (e) {
        console.log("sharp fallback", e);
      }

      const ext = file.name.split(".").pop() || "jpg";
      const path = `news/${news.id}_${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, compressed, {
          contentType: file.type,
        });

      if (error) {
        console.error("supabase upload error", error);
        continue;
      }

      const publicUrl = supabase.storage
        .from(bucket)
        .getPublicUrl(path).data.publicUrl;

      urls.push(publicUrl);

      // 3) บันทึกรูปลง NewsMedia (ชื่อที่ถูกต้อง!)
      await prisma.newsMedia.create({
        data: {
          newsId: news.id,
          url: publicUrl,
        },
      });
    }

    return NextResponse.json({ ok: true, data: { news, urls } });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, message: String(err) });
  }
}
