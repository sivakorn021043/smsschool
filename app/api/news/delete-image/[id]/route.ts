import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(
  req: Request,
  context: { params: { id: string } }   // <-- ❗ ปรับแบบนี้
) {
  try {
    const { id } = context.params;      // <-- ไม่ต้อง await

    const filename = id;
    const bucket = process.env.SUPABASE_BUCKET!;

    const { error } = await supabaseServer.storage
      .from(bucket)
      .remove([`news/${filename}`]);

    if (error) {
      return NextResponse.json({ ok: false, message: error.message });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message });
  }
}
