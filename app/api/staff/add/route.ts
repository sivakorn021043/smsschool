import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = form.get("name") as string;
    const position = form.get("position") as string;
    const email = form.get("email") as string;
    const phone = form.get("phone") as string;
    const file = form.get("image") as File | null;

    let imageUrl: string | null = null;

    // ⭐ supabaseServer เป็น client instance ไม่ใช่ function
    const supabase = supabaseServer;

    if (file && file.size > 0) {

      // ⭐ แปลงไฟล์เป็น buffer
      const buf = Buffer.from(await file.arrayBuffer());

      // ⭐ Optimize image ด้วย sharp
      const optimized = await sharp(buf)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

      const path = `staff/${Date.now()}.jpg`;

      // ⭐ Upload ไป bucket ที่ถูกต้อง (upload)
      const { error } = await supabase.storage
        .from("upload")
        .upload(path, optimized, {
          contentType: "image/jpeg",
          upsert: false,   // ✔️ ไม่ให้ทับไฟล์เดิม จะปลอดภัยกว่า
        });

      if (error) {
        console.error("SUPABASE UPLOAD ERROR:", error);
        throw new Error(error.message);
      }

      // ⭐ Get Public URL
      const { data: urlData } = supabase.storage
        .from("upload")
        .getPublicUrl(path);

      imageUrl = urlData.publicUrl;
    }

    // ⭐ บันทึกลง Prisma
    await prisma.staff.create({
      data: { name, position, email, phone, imageUrl }
    });

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("STAFF ADD ERROR:", err);
    return NextResponse.json({ ok: false, message: err.message || "error" });
  }
}
