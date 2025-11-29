import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }   // ✅ ต้องเป็น Promise
) {
  try {
    const { id } = await context.params;         // ✅ ต้อง await

    const filename = id;
    const bucket = process.env.SUPABASE_BUCKET!;

    const { error } = await supabaseServer.storage
      .from(bucket)
      .remove([`news/${filename}`]);

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message },
      { status: 500 }
    );
  }
}
