import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(
  req: NextRequest,                               // ✅ ต้องเป็น NextRequest
  context: { params: Promise<{ id: string }> }   // ✅ ต้องเป็น Promise
) {
  try {
    const { id } = await context.params;         // ✅ ต้อง await
    const staffId = Number(id);

    if (isNaN(staffId)) {
      return NextResponse.json(
        { ok: false, message: "ID ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

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

    if (!staff) {
      return NextResponse.json(
        { ok: false, message: "ไม่พบบุคลากร" },
        { status: 404 }
      );
    }

    let imageUrl = staff.imageUrl || "";

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
        return NextResponse.json(
          { ok: false, message: "อัปโหลดรูปใหม่ไม่สำเร็จ" },
          { status: 500 }
        );
      }

      // ลบรูปเก่า (ถ้ามี)
      if (imageUrl) {
        const oldFileName = imageUrl.split("/").pop()!;
        await supabaseServer.storage
          .from(bucket)
          .remove([oldFileName]);
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
    console.error("UPDATE STAFF ERROR:", err);
    return NextResponse.json(
      { ok: false, message: err.message },
      { status: 500 }
    );
  }
}
