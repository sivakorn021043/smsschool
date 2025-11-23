// app/api/news/upload/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // สำหรับ Cloudflare Pages

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
      const arrayBuf = await file.arrayBuffer();
      const buf = Buffer.from(arrayBuf); // ⭐ ใช้ค่า buffer ตรง ๆ (ไม่ใช้ sharp)

      const ext = file.name.split(".").pop() || "jpg";
      const path = `news/${news.id}_${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, buf, {
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

      // 3) บันทึกรูปลง NewsMedia
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
