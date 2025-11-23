"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  // 🟦 state สำหรับ Settings
  const [settings, setSettings] = useState({
    schoolName: "",
    logoUrl: "",
  });

  // โหลด token และ settings จาก API
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    setIsLogged(!!token);

    // โหลดข้อมูลจาก Neon (ผ่าน API)
    fetch("/api/settings/general")
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          schoolName: data.schoolName || "ชื่อโรงเรียน",
          logoUrl: data.logoUrl || "",
        });
      });
  }, []);

  function logout() {
    localStorage.removeItem("admin_token");
    setIsLogged(false);
    window.location.href = "/";
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md">


      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO + NAME */}
        <Link href="/" className="flex items-center gap-3">
          {/* ถ้ามีโลโก้ ให้แสดง */}
          {settings.logoUrl && (
            <img
              src={settings.logoUrl}
              alt="Logo"
              className="w-10 h-10 object-cover rounded"
            />
          )}

          <span className="font-bold text-2xl text-white drop-shadow">
  {settings.schoolName || "โรงเรียนของเรา"}
</span>

        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-white font-medium">
  <Link href="/news" className="hover:text-yellow-300 transition">ข่าว</Link>
  <Link href="/staff" className="hover:text-yellow-300 transition">บุคลากร</Link>
  <Link href="/about" className="hover:text-yellow-300 transition">เกี่ยวกับ</Link>
  <Link href="/contact" className="hover:text-yellow-300 transition">ติดต่อ</Link>



          {isLogged ? (
            <>
              <Link
                href="/admin/dashboard"
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Mobile Button */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow px-4 py-4 space-y-4 text-gray-700 font-medium">

          <Link href="/news" className="block">ข่าว</Link>
          <Link href="/staff" className="block">บุคลากร</Link>
          <Link href="/about" className="block">เกี่ยวกับ</Link>
          <Link href="/contact" className="block">ติดต่อ</Link>

          {isLogged ? (
            <>
              <Link
                href="/admin/dashboard"
                className="block bg-green-600 text-white text-center py-2 rounded-lg shadow"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="block w-full bg-red-600 text-white text-center py-2 rounded-lg shadow"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              className="block bg-blue-600 text-white text-center py-2 rounded-lg shadow"
            >
              Admin
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
