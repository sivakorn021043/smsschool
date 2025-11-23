"use client";

import { useState } from "react";
import CombinedForm from "./CombinedForm";   // ← ใช้อันนี้แทน General + Branding
import AdminUsersForm from "./AdminUsersForm";

export default function SettingsPage() {
  const [tab, setTab] = useState("general");

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        ตั้งค่าเว็บไซต์
      </h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("general")}
          className={`px-4 py-2 rounded-lg ${
            tab === "general" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          ตั้งค่าทั่วไป
        </button>

        <button
          onClick={() => setTab("admins")}
          className={`px-4 py-2 rounded-lg ${
            tab === "admins" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          ผู้ใช้แอดมิน
        </button>
      </div>

      {/* Content */}
      {tab === "general" && <CombinedForm />}   {/* ← ฟอร์มรวม */}
      {tab === "admins" && <AdminUsersForm />}
    </div>
  );
}
