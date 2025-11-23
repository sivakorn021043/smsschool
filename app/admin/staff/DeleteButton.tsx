"use client";

export default function DeleteButton({ id }: { id: number }) {
  const handleDelete = async () => {
    if (!confirm("ต้องการลบข้อมูลนี้ใช่ไหม?")) return;

    await fetch(`/api/staff/delete/${id}`, {
      method: "DELETE",
    });

    window.location.reload();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:underline"
    >
      ลบ
    </button>
  );
}
