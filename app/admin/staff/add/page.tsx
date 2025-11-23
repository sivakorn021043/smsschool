"use client";

import { useState } from "react";

export default function AddStaff() {
  const [msg, setMsg] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    setMsg("กำลังบันทึก...");

    const form = new FormData(e.target);

    const res = await fetch("/api/staff/add", {
      method: "POST",
      body: form
    });

    const json = await res.json();
    if (!json.ok) return setMsg("บันทึกไม่สำเร็จ: " + json.message);

    setMsg("บันทึกสำเร็จ!");
    setTimeout(() => (window.location.href = "/admin/staff"), 800);
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">เพิ่มบุคลากร</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          name="name"
          className="w-full p-3 border rounded"
          placeholder="ชื่อ - สกุล"
          required
        />

        {/* ⭐ Dropdown ตำแหน่ง */}
        <select
          name="position"
          className="w-full p-3 border rounded"
          required
        >
          <option value="">-- เลือกตำแหน่ง --</option>
          <option value="ผู้อำนวยการ">ผู้อำนวยการ</option>
          <option value="รองผู้อำนวยการ">รองผู้อำนวยการ</option>
          <option value="ครู">ครู</option>
          <option value="ครูพี่เลี้ยงเด็กพิการ">ครูพี่เลี้ยงเด็กพิการ</option>
          <option value="ธุรการโรงเรียน">ธุรการโรงเรียน</option>
          <option value="ภารโรง">ภารโรง</option>
        </select>

        <input
          name="email"
          className="w-full p-3 border rounded"
          placeholder="อีเมล"
        />

        <input
          name="phone"
          className="w-full p-3 border rounded"
          placeholder="เบอร์โทร"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          บันทึก
        </button>
      </form>

      {msg && (
        <p className="mt-4 text-center text-red-600">{msg}</p>
      )}
    </div>
  );
}
