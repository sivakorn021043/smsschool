"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("ต้องการลบข่าวนี้จริงหรือไม่?")) return;

    const res = await fetch(`/api/news/delete/${id}`, {
      method: "POST",
    });

    const json = await res.json().catch(() => null);

    if (!json || !json.ok) {
      alert("ลบไม่สำเร็จ: " + (json?.message || "server error"));
      return;
    }

    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-red-600 hover:underline">
      ลบ
    </button>
  );
}
