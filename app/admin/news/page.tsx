export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/app/admin/news/DeleteButton";

export default async function AdminNewsPage() {
  const newsList = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: { media: true }, // แนะนำ include เพื่อใช้ข้อมูลรูปด้วย (ถ้าต้องการ)
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">จัดการข่าว</h1>

          <Link
            href="/admin/news/add"
            prefetch={false}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            + เพิ่มข่าว
          </Link>
        </div>

        {newsList.length === 0 && (
          <p className="text-center text-gray-500">ยังไม่มีข่าว</p>
        )}

        <div className="space-y-4">
          {newsList.map((n) => (
            <div
              key={n.id}
              className="bg-white p-4 shadow rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-bold text-lg">{n.title}</h2>
                <p className="text-sm text-gray-600">
                  {n.detail?.slice(0, 80)}...
                </p>
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/admin/news/${n.id}`}
                  prefetch={false}
                  className="text-blue-600 hover:underline"
                >
                  แก้ไข
                </Link>

                <DeleteButton id={n.id} />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
