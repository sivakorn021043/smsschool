// app/staff/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StaffPage() {
  // ดึงข้อมูลทั้งหมด
  const staff = await prisma.staff.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
  });

  // ผู้อำนวยการ
  const director = staff.find((s: any) =>
    s.position.includes("อำนวย")
  );
  const others = staff.filter((s: any) => s.id !== director?.id);

  return (
    <div className="bg-gray-50 min-h-screen pt-28 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold text-purple-700 mb-10 border-l-8 border-purple-700 pl-4">
          บุคลากรทั้งหมด
        </h1>

        {/* ⭐️ ผู้อำนวยการ */}
        {director && (
          <div className="bg-white rounded-2xl shadow-2xl p-10 text-center mb-16 border border-purple-200 hover:shadow-purple-300 transition">
            <img
              src={director.imageUrl || "/no-profile.png"}
              className="w-44 h-44 rounded-full mx-auto mb-6 object-cover border-4 border-purple-300 shadow-lg"
            />
            <h2 className="text-3xl font-bold text-purple-800">
              {director.name}
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              {director.position}
            </p>
          </div>
        )}

        {/* ⭐ บุคลากรคนอื่น ๆ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {others.map((s: any) => (
            <div
              key={s.id}
              className="bg-white shadow-md hover:shadow-xl rounded-xl p-6 text-center transition border border-gray-100"
            >
              <img
                src={s.imageUrl || "/no-profile.png"}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-purple-200 shadow"
              />
              <h3 className="text-xl font-bold text-gray-800">
                {s.name}
              </h3>
              <p className="text-gray-600">{s.position}</p>
            </div>
          ))}
        </div>

        {/* Back */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="text-purple-700 font-semibold hover:underline text-lg"
          >
            ← กลับหน้าแรก
          </Link>
        </div>

      </div>
    </div>
  );
}
