"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("ต้องการลบข่าวนี้จริงหรือไม่?")) return;

    const res = await fetch(`/api/news/delete/${id}`, {
      method: "POST",
    });

    let json = null;
    try {
      json = await res.json();
    } catch (e) {
      alert("Server error");
      return;
    }

    if (!json.ok) {
      alert("ลบไม่สำเร็จ: " + (json?.message || "server error"));
      return;
    }

    alert("ลบสำเร็จ");

    // 🔥 Refresh เฉพาะข้อมูลที่ SSR (เร็วกว่า reload ทั้งหน้า)
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-red-600 hover:underline">
      ลบ
    </button>
  );
}
