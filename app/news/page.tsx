// app/news/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";



export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const newsList = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: { media: true }
  });

  return (
    <main className="max-w-5xl mx-auto p-4 py-10">
      <h1 className="text-3xl font-bold mb-6">📰 ข่าวประชาสัมพันธ์</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsList.map((news) => (
          <Link
            href={`/news/${news.id}`}
            key={news.id}
            className="bg-white rounded shadow hover:shadow-lg transition p-3"
          >
            {news.media[0] ? (
              <img
                src={news.media[0].url}
                className="w-full h-48 object-cover rounded"
                alt={news.title}
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                ไม่มีรูป
              </div>
            )}

            <h2 className="text-lg font-bold mt-3">{news.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(news.createdAt).toLocaleDateString("th-TH")}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
