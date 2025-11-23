import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: "settings" },
    });

    return NextResponse.json({
      schoolName: settings?.schoolName || "",
      logoUrl: settings?.logoUrl || "",
      address: settings?.address || "",
      phone: settings?.phone || "",
      email: settings?.email || "",
      vision: settings?.vision || "",
      history: settings?.history || "",
      about: settings?.about || "",
      philosophy: settings?.philosophy || "",   // ⭐ เพิ่มตรงนี้สำคัญมาก
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
