import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const schoolName = (form.get("schoolName") as string) || "";
    const address = (form.get("address") as string) || "";
    const phone = (form.get("phone") as string) || "";
    const email = (form.get("email") as string) || "";
    const vision = (form.get("vision") as string) || "";

    const history = (form.get("history") as string) || "";
    const about = (form.get("about") as string) || "";
    const philosophy = (form.get("philosophy") as string) || "";

    const logo = form.get("logo") as File | null;

    let logoUrl: string | null = null;

    // ----------------------------------------
    // Upload Logo (ถ้ามี)
    // ----------------------------------------
    if (logo) {
      const ext = logo.name.split(".").pop();
      const fileName = `logo_${Date.now()}.${ext}`;
      const buffer = Buffer.from(await logo.arrayBuffer());

      const { error } = await supabaseServer.storage
        .from("upload")        // ← ใช้ bucket upload
        .upload(fileName, buffer, {
          upsert: true,
          contentType: logo.type,
        });

      if (error) {
        console.error("Upload failed:", error);
        return NextResponse.json(
          { error: "Upload failed" },
          { status: 500 }
        );
      }

      // ✔ แก้ URL ให้ตรง bucket
      logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/upload/${fileName}`;
    }

    // ----------------------------------------
    // Upsert Settings (id = settings)
    // ----------------------------------------
    const updated = await prisma.settings.upsert({
      where: { id: "settings" },
      update: {
        schoolName,
        address,
        phone,
        email,
        vision,
        history,
        about,
        philosophy,
        ...(logoUrl && { logoUrl }),
      },
      create: {
        id: "settings",
        schoolName,
        address,
        phone,
        email,
        vision,
        history,
        about,
        philosophy,
        ...(logoUrl && { logoUrl }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "บันทึกสำเร็จ",
      logoUrl: updated.logoUrl,
    });

  } catch (err) {
    console.error("SAVE-ALL ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err },
      { status: 500 }
    );
  }
}
