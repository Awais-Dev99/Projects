import Link from "next/link";
import { LayoutDashboard, User, Bell } from "lucide-react";
import LogoutButton from "../../components/employees/LogoutButton"; // Import the new component

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Desktop Header */}
      <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 justify-between items-center sticky top-0 z-50">
        <Link href="/dashboard" className="font-bold text-xl text-blue-600">Home</Link>
        <nav className="flex gap-6 items-center">
          <Link href="/dashboard/alerts" className="text-slate-600 hover:text-blue-600 font-medium">Alerts</Link>
          {/* Desktop Logout */}
          <LogoutButton variant="desktop" /> 
        </nav>
      </header>

      <main className="flex-1 p-4 md:p-8 lg:p-12 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">{children}</div>
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
        <Link href="/dashboard/alerts" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600">
  <Bell size={24} />
  <span className="text-[10px] font-bold uppercase">Alerts</span>
</Link>
        {/* Mobile Logout */}
        <LogoutButton variant="mobile" />
      </nav>
    </div>
  );
}