// app/admin/news/add/page.tsx
"use client";

import { useState } from "react";

export default function AddNewsPage() {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  function handleFileChange(e: any) {
    const f = e.target.files as FileList;
    setFiles(f);

    // สร้าง Preview รูป
    const arr: string[] = [];
    for (let i = 0; i < f.length; i++) {
      arr.push(URL.createObjectURL(f[i]));
    }
    setPreview(arr);
  }

  async function submit(e: any) {
    e.preventDefault();
    setMsg("กำลังอัปโหลด...");

    const form = new FormData();
    form.append("title", title);
    form.append("detail", detail);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        form.append("files", files[i]);
      }
    }

    const res = await fetch("/api/news/upload", { method: "POST", body: form });

    let json;
    try {
      json = await res.json();
    } catch {
      setMsg("API ไม่ได้ส่ง JSON");
      return;
    }

    if (!json.ok) {
      setMsg("ล้มเหลว: " + (json.message || "unknown"));
      return;
    }

    setMsg("เพิ่มข่าวสำเร็จ!");

    setTimeout(() => {
      window.location.href = "/news";
    }, 700);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">เพิ่มข่าว</h1>

      <form onSubmit={submit} className="space-y-4">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="หัวข้อข่าว"
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="รายละเอียด"
          rows={6}
          className="w-full p-2 border rounded"
          required
        />

        {/* อัปโหลดไฟล์ */}
        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Preview รูป */}
        {preview.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {preview.map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-full h-40 object-cover rounded shadow"
              />
            ))}
          </div>
        )}

        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full mt-4"
        >
          บันทึก
        </button>
      </form>

      {msg && <p className="mt-4 text-center text-blue-700">{msg}</p>}
    </div>
  );
}
