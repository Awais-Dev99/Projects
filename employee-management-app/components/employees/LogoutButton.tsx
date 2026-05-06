"use client"; // Required for the onClick event

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  variant?: "desktop" | "mobile";
}

export default function LogoutButton({ variant = "desktop" }: LogoutButtonProps) {
  if (variant === "mobile") {
    return (
      <button 
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex flex-col items-center gap-1 text-red-400 hover:text-red-600 transition-colors"
      >
        <LogOut size={24} />
        <span className="text-[10px] font-bold uppercase">Exit</span>
      </button>
    );
  }

  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-red-500 font-medium flex items-center gap-2 hover:text-red-700 transition-colors"
    >
      <LogOut size={18} /> Logout
    </button>
  );
}