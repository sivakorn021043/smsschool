import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(
  req: Request,
  context: { params: { id: string } }   // ⭐ FIX: type ที่ถูกต้อง
) {
  try {
    const { id } = context.params;       // ⭐ FIX: ไม่ต้อง await
    const staffId = Number(id);

    const form = await req.formData();

    const name = form.get("name") as string;
    const position = form.get("position") as string;
    const email = form.get("email") as string;
    const phone = form.get("phone") as string;

    const image = form.get("image") as File | null;

    // ดึงข้อมูลเก่าจาก DB
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
    });

    let imageUrl = staff?.imageUrl || "";

    // -----------------------------
    // 1) อัปโหลดรูปใหม่ (ถ้ามี)
    // -----------------------------
    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const bucket = "upload";
      const newFileName = `staff_${staffId}_${Date.now()}.jpg`;

      const { error: uploadError } =
        await supabaseServer.storage
          .from(bucket)
          .upload(newFileName, buffer, {
            contentType: image.type,
            upsert: true,
          });

      if (uploadError) {
        console.error(uploadError);
        return NextResponse.json({
          ok: false,
          message: "อัปโหลดรูปใหม่ไม่สำเร็จ",
        });
      }

      // ลบรูปเก่า ถ้ามี
      if (imageUrl) {
        const oldFileName = imageUrl.split("/").pop()!;
        await supabaseServer.storage.from(bucket).remove([oldFileName]);
      }

      const {
        data: { publicUrl },
      } = supabaseServer.storage.from(bucket).getPublicUrl(newFileName);

      imageUrl = publicUrl;
    }

    // -----------------------------
    // 2) อัปเดตข้อมูลลง DB
    // -----------------------------
    await prisma.staff.update({
      where: { id: staffId },
      data: { name, position, email, phone, imageUrl },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, message: err.message });
  }
}
