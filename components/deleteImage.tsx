"use client";
import { useState } from "react";

export default function DeleteButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm("ต้องการลบข่าวนี้จริงหรือไม่?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/news/delete/${id}`, { method: "POST" });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        alert("ลบไม่สำเร็จ: " + (json?.message || res.statusText || "server error"));
      } else if (json && json.ok) {
        // รีเฟรชหน้าหรือ redirect
        window.location.reload();
      } else {
        alert("ลบไม่สำเร็จ: " + (json?.message || "unknown"));
      }
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:underline"
      disabled={loading}
    >
      {loading ? "กำลังลบ..." : "ลบ"}
    </button>
  );
}
