import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;  // ⭐ ต้อง await แบบนี้

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
