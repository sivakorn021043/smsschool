import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ ok: false, message: "Missing fields" });
    }

    // ตรวจแอดมินจากฐานข้อมูล
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ ok: false, message: "User not found" });
    }

    if (admin.password !== password) {
      return NextResponse.json({ ok: false, message: "Wrong password" });
    }

    // ออก token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ ok: true, token });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, message: err.message });
  }
}
