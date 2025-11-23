"use client";

export default function DeleteButton({ id }: { id: number }) {
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

    alert("ลบสำเร็จ");
    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:underline"
    >
      ลบ
    </button>
  );
}
