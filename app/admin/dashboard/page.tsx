import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Settings, Users, Newspaper } from "lucide-react"; // ใช้ไอคอนใหม่สำหรับบุคลากร

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ข่าว */}
          <a
            href="/admin/news"
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-xl group-hover:bg-blue-600 transition">
                <Newspaper className="w-8 h-8 text-blue-600 group-hover:text-white transition" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800">จัดการข่าว</h2>
                <p className="text-gray-600 text-sm">เพิ่ม / แก้ไข / ลบ ข่าวประชาสัมพันธ์</p>
              </div>
            </div>
          </a>

          {/* บุคลากร */}
          <a
            href="/admin/staff"
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-xl group-hover:bg-green-600 transition">
                <Users className="w-8 h-8 text-green-600 group-hover:text-white transition" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800">บุคลากร</h2>
                <p className="text-gray-600 text-sm">ข้อมูลครู / เจ้าหน้าที่</p>
              </div>
            </div>
          </a>

          {/* ตั้งค่า */}
          <a
            href="/admin/settings"
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-4 rounded-xl group-hover:bg-yellow-500 transition">
                <Settings className="w-8 h-8 text-yellow-500 group-hover:text-white transition" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800">ตั้งค่าเว็บไซต์</h2>
                <p className="text-gray-600 text-sm">ข้อมูลโรงเรียน / ระบบ / ผู้ใช้</p>
              </div>
            </div>
          </a>

        </div>
      </main>

      <Footer />
    </div>
  );
}
