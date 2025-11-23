import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function DirectorPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto py-12 px-4 text-center">
        <img
          src="/director.jpg"
          className="w-40 h-40 rounded-full mx-auto shadow mb-6 object-cover"
        />
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          นายผู้บริหาร ใจดี
        </h1>
        <p className="text-gray-600 mb-6">
          ผู้อำนวยการโรงเรียนบ้านทรายมูล
        </p>

        <p className="text-lg leading-8 max-w-2xl mx-auto">
          ยินดีต้อนรับเข้าสู่เว็บไซต์โรงเรียนบ้านทรายมูล โรงเรียนแห่งการเรียนรู้
          สร้างอนาคตสู่ชุมชน
        </p>
      </div>

      
    </div>
  );
}
