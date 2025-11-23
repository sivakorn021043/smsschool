import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Link from "next/link";
import StaffFilter from "./StaffFilter";
import DeleteButton from "./DeleteButton"; // ⭐ เพิ่มเข้ามา

export const dynamic = "force-dynamic";

export default async function StaffPage({ searchParams }: any) {
  const params = await searchParams;

  const search = params.search || "";
  const position = params.position || "";

  const staff = await prisma.staff.findMany({
    where: {
      AND: [
        search ? { name: { contains: search, mode: "insensitive" } } : {},
        position ? { position } : {}
      ]
    },
    orderBy: { name: "asc" }
  });

  const positions = await prisma.staff.groupBy({
    by: ["position"]
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto p-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">จัดการบุคลากร</h1>

          <Link
            href="/admin/staff/add"
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:opacity-90"
          >
            + เพิ่มบุคลากร
          </Link>
        </div>

        <StaffFilter search={search} position={position} positions={positions} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {staff.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl p-4 shadow">
              <img
                src={s.imageUrl || "/no-profile.png"}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />

              <h2 className="text-xl font-bold text-center">{s.name}</h2>
              <p className="text-center text-gray-600">{s.position}</p>

              <div className="mt-4 flex justify-center gap-4">
                <Link
                  href={`/admin/staff/${s.id}`}
                  className="text-blue-600 hover:underline"
                >
                  แก้ไข
                </Link>

                {/* ⭐ ปุ่มลบแบบ Client Component */}
                <DeleteButton id={s.id} />
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
