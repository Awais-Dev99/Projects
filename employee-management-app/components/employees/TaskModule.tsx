// components/employee/TaskModule.tsx
import { Shield, HardHat, UserRound, Calculator, CheckCircle } from "lucide-react";

const roleConfigs: any = {
  "Security Guard": { icon: Shield, task: "View Gate Log", color: "text-blue-600" },
  "Engineer": { icon: HardHat, task: "Submit Maintenance Report", color: "text-amber-600" },
  "HR": { icon: UserRound, task: "Review Leave Requests", color: "text-purple-600" },
  "Accountant": { icon: Calculator, task: "Verify Payroll Sheet", color: "text-emerald-600" },
};

export default function TaskModule({ role }: { role: string }) {
  const config = roleConfigs[role] || roleConfigs["Engineer"];
  const Icon = config.icon;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-2xl bg-slate-50 ${config.color}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Role Tasks</h3>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Assigned to {role}</p>
        </div>
      </div>

      <button className="w-full group flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all">
        <span className="font-semibold text-slate-700 group-hover:text-blue-700">{config.task}</span>
        <CheckCircle size={20} className="text-slate-300 group-hover:text-blue-500" />
      </button>
    </div>
  );
}