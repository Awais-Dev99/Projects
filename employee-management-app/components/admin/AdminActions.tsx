"use client"; // Critical: This marks the component for the browser

import { toggleEmployeeStatus, removeEmployee } from "@/lib/actions";
import { Power, Trash2 } from "lucide-react";

interface AdminActionsProps {
  id: string;
  status: string;
  fullWidth?: boolean;
}

export default function AdminActions({ id, status, fullWidth }: AdminActionsProps) {
  const btnClass = fullWidth ? "flex-1 justify-center" : "";
  
  // Client-side confirmation handler
  const handleDelete = async (formData: FormData) => {
    if (confirm("Are you sure you want to remove this employee?")) {
      await removeEmployee(formData);
    }
  };

  return (
    <div className={`flex gap-2 ${fullWidth ? "w-full" : ""}`}>
      {/* Toggle Status */}
      <form action={toggleEmployeeStatus} className={btnClass}>
        <input type="hidden" name="id" value={id} />
        <button 
          type="submit"
          className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium w-full justify-center ${
          status === 'active' 
          ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' 
          : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
        }`}>
          <Power size={16} />
          {fullWidth && (status === 'active' ? 'Disable' : 'Enable')}
        </button>
      </form>

      {/* Remove Employee */}
      <form action={handleDelete} className={btnClass}>
        <input type="hidden" name="id" value={id} />
        <button 
          type="submit"
          className={`p-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all flex items-center gap-2 text-sm font-medium w-full justify-center`}>
          <Trash2 size={16} />
          {fullWidth && 'Remove'}
        </button>
      </form>
    </div>
  );
}