"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function login() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    let json;
    try {
      json = await res.json();
    } catch {
      setMsg("Server error");
      return;
    }

    if (json.ok && json.token) {
      localStorage.setItem("admin_token", json.token);
      window.location.href = "/admin/dashboard";
    } else {
      setMsg(json.message || "ล็อกอินไม่สำเร็จ");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">🔐 Admin Login</h1>

        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-2 border mb-3 rounded"
        />

        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full p-2 border mb-3 rounded"
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          เข้าสู่ระบบ
        </button>

        {msg && <p className="text-center text-red-500 mt-2">{msg}</p>}
      </div>
    </div>
  );
}
