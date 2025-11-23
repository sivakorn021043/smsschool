"use client";

export default function StaffFilter({ search, position, positions }: any) {
  return (
    <div className="flex gap-4 mb-6">
      <input
        defaultValue={search}
        placeholder="ค้นหาชื่อครู..."
        className="p-2 w-full border rounded"
        onChange={(e) =>
          (window.location.href = `?search=${e.target.value}&position=${position}`)
        }
      />

      <select
        defaultValue={position}
        className="p-2 border rounded"
        onChange={(e) =>
          (window.location.href = `?search=${search}&position=${e.target.value}`)
        }
      >
        <option value="">ทั้งหมด</option>
        {positions.map((p: any) => (
          <option key={p.position} value={p.position}>
            {p.position}
          </option>
        ))}
      </select>
    </div>
  );
}
