"use client";

import { useState } from "react";
import { 
  Users, UserCheck, UserMinus, TrendingUp, 
  Shield, HardHat, UserRound, Calculator 
} from "lucide-react";

export default function InteractiveDashboard({ initialEmployees }: { initialEmployees: any[] }) {
  const [filter, setFilter] = useState("all");

  // Filter logic based on the clicked card
  const filteredEmployees = initialEmployees.filter((emp) => {
    if (filter === "all") return true;
    if (filter === "active") return emp.accountStatus === "active";
    if (filter === "disabled") return emp.accountStatus === "disabled";
    if (filter === "Security") return emp.role === "Security Guard";
    if (filter === "Engineer") return emp.role === "Engineer";
    if (filter === "HR") return emp.role === "HR";
    if (filter === "Accountant") return emp.role === "Accountant";
    return true;
  });

  const stats = {
    total: initialEmployees.length,
    active: initialEmployees.filter(e => e.accountStatus === 'active').length,
    disabled: initialEmployees.filter(e => e.accountStatus === 'disabled').length,
    security: initialEmployees.filter(e => e.role === 'Security Guard').length,
    engineer: initialEmployees.filter(e => e.role === 'Engineer').length,
    hr: initialEmployees.filter(e => e.role === 'HR').length,
    accountant: initialEmployees.filter(e => e.role === 'Accountant').length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500">Click any card to filter the employee list below.</p>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="text-left transition-all active:scale-95" onClick={() => setFilter("all")}>
          <StatCard title="Total Employees" value={stats.total} icon={<Users className="text-blue-600" />} color="bg-blue-50" isActive={filter === "all"} />
        </button>
        <button className="text-left transition-all active:scale-95" onClick={() => setFilter("active")}>
          <StatCard title="Active Access" value={stats.active} icon={<UserCheck className="text-green-600" />} color="bg-green-50" isActive={filter === "active"} />
        </button>
        <button className="text-left transition-all active:scale-95" onClick={() => setFilter("disabled")}>
          <StatCard title="Accounts Disabled" value={stats.disabled} icon={<UserMinus className="text-red-600" />} color="bg-red-50" isActive={filter === "disabled"} />
        </button>
      </div>

      {/* Role Distribution Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-500" /> Staff Distribution
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <RoleCard name="Security" count={stats.security} icon={<Shield size={20} />} onClick={() => setFilter("Security")} isActive={filter === "Security"} />
          <RoleCard name="Engineers" count={stats.engineer} icon={<HardHat size={20} />} onClick={() => setFilter("Engineer")} isActive={filter === "Engineer"} />
          <RoleCard name="HR Team" count={stats.hr} icon={<UserRound size={20} />} onClick={() => setFilter("HR")} isActive={filter === "HR"} />
          <RoleCard name="Accountants" count={stats.accountant} icon={<Calculator size={20} />} onClick={() => setFilter("Accountant")} isActive={filter === "Accountant"} />
        </div>
      </div>

      {/* NEW: Display List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Showing: {filter}</h3>
            <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded">{filteredEmployees.length} Found</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp: any) => (
              <div key={emp._id} className="p-4 hover:bg-slate-50 flex justify-between items-center transition-colors">
                <div>
                  <p className="font-bold text-slate-900">{emp.name}</p>
                  <p className="text-xs text-slate-500">{emp.role} • @{emp.username}</p>
                </div>
                <div className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${emp.accountStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {emp.accountStatus}
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400">No employees found for this category.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, isActive }: any) {
  return (
    <div className={`bg-white p-6 rounded-2xl border-2 transition-all flex items-center gap-5 ${isActive ? 'border-blue-500 shadow-md ring-4 ring-blue-50' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}>
      <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function RoleCard({ name, count, icon, onClick, isActive }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 hover:scale-105 ${isActive ? 'border-blue-500 bg-blue-50 shadow-md' : 'bg-white border-slate-100 shadow-sm'}`}
    >
      <div className={isActive ? 'text-blue-600' : 'text-slate-400'}>{icon}</div>
      <p className={`text-sm font-semibold ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>{name}</p>
      <div className={`px-3 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
        {count} Staff
      </div>
    </button>
  );
}