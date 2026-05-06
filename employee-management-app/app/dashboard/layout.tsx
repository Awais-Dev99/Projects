// app/dashboard/layout.tsx
import Link from "next/link";
import { LayoutDashboard, User, Bell, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Desktop Header */}
      <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 justify-between items-center sticky top-0 z-50">
        <div className="font-bold text-xl text-blue-600">Employee Portal</div>
        <nav className="flex gap-6">
          <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium">Dashboard</Link>
          <Link href="/dashboard/profile" className="text-slate-600 hover:text-blue-600 font-medium">My Profile</Link>
          <button className="text-red-500 font-medium flex items-center gap-2">
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-blue-600">
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold uppercase">Home</span>
        </Link>
        <Link href="/dashboard/profile" className="flex flex-col items-center gap-1 text-slate-400">
          <User size={24} />
          <span className="text-[10px] font-bold uppercase">Profile</span>
        </Link>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Bell size={24} />
          <span className="text-[10px] font-bold uppercase">Alerts</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-red-400">
          <LogOut size={24} />
          <span className="text-[10px] font-bold uppercase">Exit</span>
        </button>
      </nav>
    </div>
  );
}