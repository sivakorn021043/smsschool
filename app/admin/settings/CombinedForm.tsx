"use client";

import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

export default function CombinedForm() {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    schoolName: "",
    address: "",
    phone: "",
    email: "",
    vision: "",
    history: "",
    about: "",
    philosophy: "",
  });

  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // โหลดข้อมูลจาก API
  useEffect(() => {
    fetch("/api/settings/general")
      .then((res) => res.json())
      .then((data) => {
        setForm({
          schoolName: data.schoolName || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          vision: data.vision || "",
          history: data.history || "",
          about: data.about || "",
          philosophy: data.philosophy || "",
        });

        setLogoPreview(data.logoUrl || "");
      })
      .finally(() => setLoading(false));
  }, []);

  // อัปเดตฟอร์ม
  function onChange(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ---------------------------
  // ⭐ เลือกโลโก้ + บีบอัดไฟล์
  // ---------------------------
  async function pickLogo(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.2,          // สูงสุด 200KB
      maxWidthOrHeight: 800,   // ความกว้างสูงสุด 800px
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);

      setLogoFile(compressedFile);
      setLogoPreview(URL.createObjectURL(compressedFile));

    } catch (error) {
      console.log("Compression error:", error);
    }
  }

  // ---------------------------
  // บันทึกข้อมูลทั้งหมด
  // ---------------------------
  async function saveAll() {
    const fd = new FormData();

    Object.keys(form).forEach((key) => {
      fd.append(key, (form as any)[key]);
    });

    if (logoFile) fd.append("logo", logoFile);

    const res = await fetch("/api/settings/save-all", {
      method: "POST",
      body: fd,
    });

    const json = await res.json();
    alert(json.message || "บันทึกสำเร็จ!");
  }

  const inputClass =
    "border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const textareaClass =
    "border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div className="space-y-6">

      {/* ------------------ 1) ข้อมูลโรงเรียน ------------------ */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">ข้อมูลโรงเรียน</h2>

        <div className="flex flex-col gap-3">

          <input
            className={inputClass}
            placeholder="ชื่อโรงเรียน"
            value={form.schoolName}
            onChange={(e) => onChange("schoolName", e.target.value)}
          />

          <input
            className={inputClass}
            placeholder="ที่อยู่"
            value={form.address}
            onChange={(e) => onChange("address", e.target.value)}
          />

          <input
            className={inputClass}
            placeholder="เบอร์โทร"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />

          <input
            className={inputClass}
            placeholder="อีเมล"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
          />

          <textarea
            className={textareaClass}
            placeholder="วิสัยทัศน์โรงเรียน"
            rows={4}
            value={form.vision}
            onChange={(e) => onChange("vision", e.target.value)}
          />

          <textarea
            className={textareaClass}
            placeholder="ประวัติโรงเรียน"
            rows={6}
            value={form.history}
            onChange={(e) => onChange("history", e.target.value)}
          />

          <textarea
            className={textareaClass}
            placeholder="ข้อมูลเกี่ยวกับโรงเรียน (About)"
            rows={6}
            value={form.about}
            onChange={(e) => onChange("about", e.target.value)}
          />

          <textarea
            className={textareaClass}
            placeholder="ปรัชญาของโรงเรียน"
            rows={4}
            value={form.philosophy}
            onChange={(e) => onChange("philosophy", e.target.value)}
          />

        </div>
      </div>

      {/* ------------------ 2) โลโก้โรงเรียน ------------------ */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-bold">โลโก้โรงเรียน</h2>

        {logoPreview ? (
          <img
            src={logoPreview}
            className="w-32 h-32 object-cover rounded border shadow"
            alt="logo"
          />
        ) : (
          <p className="text-gray-500">ยังไม่มีโลโก้</p>
        )}

        <label className="cursor-pointer inline-block">
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            เลือกโลโก้ใหม่
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={pickLogo}
            className="hidden"
          />
        </label>
      </div>

      <button
        onClick={saveAll}
        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        บันทึกทั้งหมด
      </button>
    </div>
  );
}
