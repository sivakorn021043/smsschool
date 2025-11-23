 "use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ContactPage() {
  const [data, setData] = useState({
    schoolName: "",
    address: "",
    phone: "",
    email: "",
    vision: "",
  });

  // โหลดข้อมูลจากฐานข้อมูล
  useEffect(() => {
    fetch("/api/settings/general")
      .then((res) => res.json())
      .then((json) => {
        setData({
          schoolName: json.schoolName || "",
          address: json.address || "",
          phone: json.phone || "",
          email: json.email || "",
          vision: json.vision || "",
        });
      });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">ติดต่อโรงเรียน</h1>

        <p className="text-gray-700 mb-4">
          <strong>โรงเรียน:</strong> {data.schoolName || "ยังไม่มีข้อมูล"}
        </p>

        <p className="text-gray-700 mb-4">
          <strong>ที่อยู่:</strong> {data.address || "ยังไม่มีข้อมูล"}
        </p>

        <p className="text-gray-700 mb-4">
          <strong>โทร:</strong> {data.phone || "ยังไม่มีข้อมูล"}
        </p>

        <p className="text-gray-700 mb-4">
          <strong>อีเมล:</strong> {data.email || "ยังไม่มีข้อมูล"}
        </p>

        {/* ⭐ วิสัยทัศน์แบบเดียวกับส่วนอื่น */}
        <p className="text-gray-700 mb-4">
          <strong>วิสัยทัศน์:</strong>{" "}
          <span className="whitespace-pre-line">
            {data.vision || "ยังไม่มีข้อมูลวิสัยทัศน์"}
          </span>
        </p>
      </div>

      <Footer />
    </div>
  );
}
