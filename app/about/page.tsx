"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AboutPage() {
  const [data, setData] = useState({
    history: "",
    about: "",
  });

  // โหลดข้อมูลจากฐานข้อมูล
  useEffect(() => {
    fetch("/api/settings/general")
      .then((res) => res.json())
      .then((json) => {
        setData({
          history: json.history || "",
          about: json.about || "",
        });
      });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-6 border-l-8 border-green-700 pl-4">
          ประวัติและข้อมูลโรงเรียน
        </h1>

        {/* ส่วนประวัติ */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">ประวัติโรงเรียน</h2>
          <p className="text-lg leading-8 text-gray-700 whitespace-pre-line">
            {data.history || "ยังไม่มีข้อมูลประวัติโรงเรียน"}
          </p>
        </section>

        {/* ส่วนข้อมูลโรงเรียน */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">ข้อมูลโรงเรียน</h2>
          <p className="text-lg leading-8 text-gray-700 whitespace-pre-line">
            {data.about || "ยังไม่มีข้อมูลโรงเรียน"}
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
