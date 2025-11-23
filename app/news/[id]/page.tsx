// app/news/[id]/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewsDetail({ params }: any) {
  const { id } = await params;
  const nid = Number(id);

  if (!nid || isNaN(nid)) {
    return <div className="p-10 text-center text-red-500">ID ไม่ถูกต้อง</div>;
  }

  const news = await prisma.news.findUnique({
    where: { id: nid },
    include: { media: true },
  });

  if (!news) {
    return <div className="p-10 text-center text-red-500">ไม่พบข้อมูล</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/news" className="text-blue-600 underline block mb-4">
        ← กลับ
      </Link>

      <h1 className="text-3xl font-bold">{news.title}</h1>

      <p className="text-gray-500 mt-2">
        วันที่ {new Date(news.createdAt).toLocaleDateString("th-TH")}
      </p>

      {/* แสดงรูปทั้งหมด */}
      {news.media?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {news.media.map((m) => (
            <img
              key={m.id}
              src={m.url}
              className="w-full rounded-xl shadow"
              alt="news-image"
            />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-gray-500">ไม่มีรูปภาพในข่าวนี้</p>
      )}

      <div className="mt-10 text-lg whitespace-pre-line leading-relaxed">
        {news.detail}
      </div>
    </main>
  );
}
