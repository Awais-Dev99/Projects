"use client";

import { LayoutDashboard, PlusCircle } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-white border-r p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-blue-600 mb-10">
        TaskFlow
      </h1>

      <nav className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer">
          <PlusCircle size={18} />
          <span>Add Task</span>
        </div>
      </nav>
    </div>
  );
}