"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditStaffPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/staff/${id}`)
      .then((r) => r.json())
      .then((j) => setData(j.data));
  }, [id]);

  if (!data) return <div className="p-10 text-center">กำลังโหลด...</div>;

  async function save(e: any) {
    e.preventDefault();

    const form = new FormData(e.target);

    const res = await fetch(`/api/staff/update/${id}`, {
      method: "POST",
      body: form,
    });

    const json = await res.json();

    if (json.ok) {
      alert("บันทึกสำเร็จ");
      window.location.href = "/admin/staff";
    } else {
      alert("บันทึกไม่สำเร็จ: " + json.message);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">แก้ไขบุคลากร</h1>

      <form onSubmit={save} className="space-y-4">

        {/* ชื่อ */}
        <input
          name="name"
          defaultValue={data.name}
          className="w-full p-3 border rounded"
          required
        />

        {/* ⭐ Dropdown ตำแหน่ง */}
        <select
          name="position"
          defaultValue={data.position}
          className="w-full p-3 border rounded"
          required
        >
          <option value="ผู้อำนวยการ">ผู้อำนวยการ</option>
          <option value="รองผู้อำนวยการ">รองผู้อำนวยการ</option>
          <option value="ครู">ครู</option>
          <option value="ครูพี่เลี้ยงเด็กพิการ">ครูพี่เลี้ยงเด็กพิการ</option>
          <option value="ธุรการโรงเรียน">ธุรการโรงเรียน</option>
          <option value="ภารโรง">ภารโรง</option>
        </select>

        {/* email */}
        <input
          name="email"
          defaultValue={data.email}
          className="w-full p-3 border rounded"
        />

        {/* phone */}
        <input
          name="phone"
          defaultValue={data.phone}
          className="w-full p-3 border rounded"
        />

        {/* รูปภาพปัจจุบัน */}
        {data.imageUrl && (
          <img
            src={`${data.imageUrl}?v=${Date.now()}`}
            className="w-32 h-32 rounded-full object-cover"
          />
        )}

        {/* อัปโหลดรูปใหม่ */}
        <input type="file" accept="image/*" name="image" />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          บันทึก
        </button>
      </form>
    </div>
  );
}
