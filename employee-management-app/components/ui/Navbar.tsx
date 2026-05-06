// components/ui/Navbar.tsx
import { Menu, UserCircle } from "lucide-react";


export default function Navbar({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40 lg:hidden">
      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
        <Menu size={24} />
      </button>
      
      <h1 className="font-bold text-slate-800 tracking-tight">{title}</h1>
      
      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
        <UserCircle size={24} />
      </div>
    </header>
  );
}