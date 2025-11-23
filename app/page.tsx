// app/page.tsx
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  // ⭐ ดึงค่าตั้งค่าจากฐานข้อมูล (รวมปรัชญา)
  const settings = await prisma.settings.findUnique({
    where: { id: "settings" },
  });

  // ⭐ ดึงข่าวจาก API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/list`, {
    cache: "no-store",
  });

  const json = await res.json();
  const newsList = json.data || [];

  // ⭐ ดึงบุคลากร (3 คนแรก)
  const staff = await prisma.staff.findMany({
    orderBy: { name: "asc" },
    take: 3,
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/* HERO BANNER */}
<div
  className="w-full h-[360px] mt-[-20px] relative flex items-center justify-center"
>
  {/* พื้นหลังรูป + ไล่สี */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/banner.jpg')" }}
  />

  {/* ไล่สีทับอีกชั้น */}
   <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/70 via-blue-600/70 to-blue-800/70"></div>

  {/* เนื้อหา */}
  <div className="relative text-center text-white px-4">
    <h1 className="text-4xl md:text-5xl font-bold drop-shadow-xl">
      {settings?.schoolName || "โรงเรียนบ้านทรายมูล"}
    </h1>

    <p className="mt-3 text-lg md:text-xl text-blue-200 drop-shadow">
      สำนักงานเขตพื้นที่การศึกษาประถมศึกษาหนองบัวลำภู เขต 1
    </p>
  </div>
</div>


      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* ข่าวประชาสัมพันธ์ */}
        <section className="mb-20">
          <div className="border-l-8 border-blue-700 pl-4 mb-8">
            <h2 className="text-3xl font-bold text-blue-700">
              ข่าวประชาสัมพันธ์
            </h2>
          </div>

          {newsList.length === 0 && (
            <p className="text-gray-500 text-center">ยังไม่มีข่าวประชาสัมพันธ์</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsList.map((n: any) => (
              <Link
                key={n.id}
                href={`/news/${n.id}`}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition"
              >
                <img
                  src={n.media[0]?.url || "/noimage.png"}
                  className="w-full h-48 object-cover"
                  alt={n.title}
                />

                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{n.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{n.detail}</p>

                  <span className="text-blue-700 mt-4 inline-block font-semibold hover:underline">
                    อ่านเพิ่มเติม →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ⭐ บุคลากรโรงเรียน */}
        <section className="mb-20">
          <div className="border-l-8 border-purple-700 pl-4 mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-purple-700">บุคลากรโรงเรียน</h2>

            <Link
              href="/staff"
              className="text-purple-700 font-semibold hover:underline text-lg"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          {staff.length === 0 && (
            <p className="text-gray-500 text-center">
              ยังไม่มีข้อมูลบุคลากร
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {staff.map((s: any) => (
              <div
                key={s.id}
                className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition"
              >
                <img
                  src={s.imageUrl || "/no-profile.png"}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow"
                />

                <h3 className="text-xl font-bold">{s.name}</h3>
                <p className="text-gray-600">{s.position}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ⭐ ปรัชญาโรงเรียน (ดึงจาก DB) */}
        <section className="bg-white p-10 rounded-xl shadow border-l-8 border-green-700 mb-20">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            ปรัชญาโรงเรียน
          </h2>
          <p className="text-gray-700 leading-7 text-lg whitespace-pre-line">
            {settings?.philosophy || "ยังไม่มีข้อมูลปรัชญาโรงเรียน"}
          </p>
        </section>

        {/* ผู้บริหาร */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-blue-700 mb-8 border-l-8 pl-4 border-blue-700">
            ผู้บริหารสถานศึกษา
          </h2>

          <div className="flex flex-col items-center text-center bg-white shadow-xl rounded-xl p-10 max-w-md mx-auto hover:shadow-2xl transition">
            <img
              src="/director.jpg"
              className="w-36 h-36 rounded-full object-cover shadow-md mb-5"
              alt="director"
            />

            <h3 className="text-xl font-bold">นายผู้บริหาร ใจดี</h3>
            <p className="text-gray-600">ผู้อำนวยการโรงเรียนบ้านทรายมูล</p>

            <a
              href="/director"
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              ดูรายละเอียด →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
