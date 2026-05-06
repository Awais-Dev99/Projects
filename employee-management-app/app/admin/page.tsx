// app/admin/page.tsx
import clientPromise from "@/lib/mongodb";
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  TrendingUp, 
  Shield, 
  HardHat, 
  UserRound, 
  Calculator 
} from "lucide-react";

async function getStats() {
  const client = await clientPromise;
  const db = client.db("ems_database");
  const employees = await db.collection("employees").find({}).toArray();

  return {
    total: employees.length,
    active: employees.filter(e => e.accountStatus === 'active').length,
    disabled: employees.filter(e => e.accountStatus === 'disabled').length,
    roles: {
      security: employees.filter(e => e.role === 'Security Guard').length,
      engineer: employees.filter(e => e.role === 'Engineer').length,
      hr: employees.filter(e => e.role === 'HR').length,
      accountant: employees.filter(e => e.role === 'Accountant').length,
    }
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500">Real-time status of your workforce and system access.</p>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Employees" 
          value={stats.total} 
          icon={<Users className="text-blue-600" />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Active Access" 
          value={stats.active} 
          icon={<UserCheck className="text-green-600" />} 
          color="bg-green-50" 
        />
        <StatCard 
          title="Accounts Disabled" 
          value={stats.disabled} 
          icon={<UserMinus className="text-red-600" />} 
          color="bg-red-50" 
        />
      </div>

      {/* Role Distribution Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-500" />
          Staff Distribution
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <RoleCard name="Security" count={stats.roles.security} icon={<Shield size={20} />} />
          <RoleCard name="Engineers" count={stats.roles.engineer} icon={<HardHat size={20} />} />
          <RoleCard name="HR Team" count={stats.roles.hr} icon={<UserRound size={20} />} />
          <RoleCard name="Accountants" count={stats.roles.accountant} icon={<Calculator size={20} />} />
        </div>
      </div>

      {/* Quick Access Info */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">Administrative Control</h3>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            As the administrator, you have the authority to manage salaries, update credentials, 
            and broadcast notifications directly to employee mobile dashboards.
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
          <Shield size={200} />
        </div>
      </div>
    </div>
  );
}

// Sub-component: Primary Stats
function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
      <div className={`p-4 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

// Sub-component: Role Breakdown
function RoleCard({ name, count, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 cursor-default">
      <div className="text-slate-400">
        {icon}
      </div>
      <p className="text-sm font-semibold text-slate-700">{name}</p>
      <div className="px-3 py-0.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
        {count} Staff
      </div>
    </div>
  );
}