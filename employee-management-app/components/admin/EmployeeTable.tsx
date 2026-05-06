// components/admin/EmployeeTable.tsx
import StatusToggle from "./StatusToogle";
import RoleBadge from "./RoleBadge";
import { DollarSign, Clock, Trash2 } from "lucide-react";
import { removeEmployee } from "@/lib/actions";

export default function EmployeeTable({ employees }: { employees: any[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Employee</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Role</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Salary</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Access</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => (
              <tr key={emp._id} className={emp.accountStatus === 'disabled' ? 'opacity-50' : ''}>
                <td className="p-4">
                  <p className="font-bold text-slate-800">{emp.name}</p>
                  <p className="text-xs text-slate-400">@{emp.username}</p>
                </td>
                <td className="p-4"><RoleBadge role={emp.role} /></td>
                <td className="p-4 text-sm font-medium text-slate-600">${emp.salary.toLocaleString()}</td>
                <td className="p-4"><StatusToggle id={emp._id} status={emp.accountStatus} /></td>
                <td className="p-4 text-right">
                  <form action={removeEmployee}>
                    <input type="hidden" name="id" value={emp._id} />
                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD VIEW --- */}
      <div className="lg:hidden divide-y divide-slate-100">
        {employees.map((emp) => (
          <div key={emp._id} className={`p-5 space-y-4 ${emp.accountStatus === 'disabled' ? 'bg-slate-50' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-black text-slate-900">{emp.name}</p>
                <p className="text-xs text-slate-500">@{emp.username}</p>
              </div>
              <RoleBadge role={emp.role} />
            </div>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-1 text-slate-600">
                <DollarSign size={14} /> {emp.salary.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <Clock size={14} /> {emp.workingHours}
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <StatusToggle id={emp._id} status={emp.accountStatus} showLabel />
              <form action={removeEmployee}>
                <input type="hidden" name="id" value={emp._id} />
                <button className="flex items-center gap-2 px-3 py-2 text-red-600 text-xs font-bold uppercase">
                  <Trash2 size={16} /> Remove
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}