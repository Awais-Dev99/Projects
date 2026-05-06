// app/admin/layout.tsx
import Sidebar from "../../components/ui/Sidebar";
import Navbar from "../../components/ui/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Sidebar is fixed, so it takes up no "physical" space in the flow */}
      <Sidebar />

      {/* 2. Add 'pl-64' (or however wide your sidebar is) to push the content out */}
      <div className="pl-64 flex flex-col min-h-screen">
        <Navbar title="Admin Dashboard" />
        
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}