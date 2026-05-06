// components/ui/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  BellRing, 
  ShieldCheck 
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "All Employees", href: "/admin/employees", icon: Users },
  { name: "Create Account", href: "/admin/create", icon: UserPlus },
  { name: "Send Alerts", href: "/admin/notifications", icon: BellRing },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full bg-slate-900 text-slate-300 w-64 fixed left-0 top-0 hidden lg:flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 text-white">
        <ShieldCheck className="text-blue-500 w-8 h-8" />
        <span className="text-xl font-bold tracking-tight">Admin CMS</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Status</p>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Admin Mode
          </div>
        </div>
      </div>
    </aside>
  );
}