"use client";


import { use, useEffect, useState } from "react";

export default function EditNewsPage({ params }: any) {
  const resolved = use(params);   // ⭐ แก้ตรงนี้
  const id = resolved.id;         // ⭐ ดึง id จริง


  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  // รูปแบบข้อมูล: [{ id: number, url: string }]
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // ========== โหลดข้อมูลข่าว ==========
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/news/${id}`);
      const json = await res.json();

      if (json.ok) {
        setTitle(json.data.title);
        setDetail(json.data.detail);
        setImages(json.images || []); // ⬅️ มี {id, url}
      } else {
        setMsg("โหลดข้อมูลไม่สำเร็จ");
      }

      setLoading(false);
    }
    load();
  }, [id]);

  // ========== ลบรูป ==========
  async function deleteImage(imageId: number) {
    if (!confirm("ต้องการลบรูปนี้ใช่ไหม?")) return;

    const res = await fetch(`/api/news/delete-image/${imageId}`, {
      method: "POST",
    });

    let json;
    try {
      json = await res.json();
    } catch {
      alert("เซิร์ฟเวอร์ไม่ส่ง JSON กลับมา");
      return;
    }

    if (json.ok) {
      alert("ลบรูปสำเร็จ");

      // อัปเดต state
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } else {
      alert("ลบไม่สำเร็จ: " + json.message);
    }
  }

  // ========== บันทึกข่าว ==========
  async function save(e: any) {
    e.preventDefault();
    setMsg("กำลังบันทึก...");

    const form = new FormData();
    form.append("title", title);
    form.append("detail", detail);

    if (files) {
      for (let i = 0; i < files.length; i++) {
        form.append("files", files[i]);
      }
    }

    const res = await fetch(`/api/news/${id}`, {
      method: "PATCH",
      body: form,
    });

    const json = await res.json();

    if (!json.ok) return setMsg("บันทึกไม่สำเร็จ: " + json.message);

    setMsg("บันทึกสำเร็จ!");
    setTimeout(() => (window.location.href = "/news"), 700);
  }

  // ========== UI ==========
  if (loading) return <div className="p-10 text-center">กำลังโหลด...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">แก้ไขข่าว #{id}</h1>

      {/* แสดงรูป */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {images.map((img) => (
            <div key={img.id} className="relative">
              <img src={img.url} className="rounded shadow w-full" />

              <button
                onClick={() => deleteImage(img.id)}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded"
              >
                ลบ
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ฟอร์มแก้ไข */}
      <form onSubmit={save} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="หัวข้อข่าว"
          required
        />

        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className="w-full p-2 border rounded"
          rows={6}
          placeholder="รายละเอียด"
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(e.target.files)}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          บันทึก
        </button>
      </form>

      {msg && <p className="mt-3 text-center text-red-600">{msg}</p>}
    </div>
  );
}
