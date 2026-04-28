"use client";

import { LogOut } from "lucide-react";

export default function Topbar() {
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-700">
        Dashboard
      </h2>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}