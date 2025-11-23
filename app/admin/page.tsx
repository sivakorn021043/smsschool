"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function login() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (json.ok && json.token) {
      localStorage.setItem("admin_token", json.token);
      window.location.href = "/admin/dashboard";
    } else {
      setMsg(json.message || "ล็อกอินไม่สำเร็จ");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-12">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border mb-2" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border mb-2" />
      <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">เข้าสู่ระบบ</button>
      <p className="text-sm mt-2 text-red-500">{msg}</p>
    </div>
  );
}
