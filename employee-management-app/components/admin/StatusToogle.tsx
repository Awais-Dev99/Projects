// components/admin/StatusToggle.tsx
"use client";

import { toggleEmployeeStatus } from "@/lib/actions";
import { Power } from "lucide-react";

export default function StatusToggle({ id, status, showLabel }: { id: string, status: string, showLabel?: boolean }) {
  const isActive = status === 'active';

  return (
    <form action={toggleEmployeeStatus}>
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
          isActive 
          ? 'bg-green-50 border-green-200 text-green-700' 
          : 'bg-slate-100 border-slate-300 text-slate-500'
        }`}
      >
        <Power size={14} className={isActive ? 'animate-pulse' : ''} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          {showLabel ? (isActive ? "Access: Active" : "Access: Disabled") : (isActive ? "Active" : "Disabled")}
        </span>
      </button>
    </form>
  );
}