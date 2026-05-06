// app/admin/create/page.tsx
import { createEmployee } from "@/lib/actions";

export default function CreateEmployeePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Onboard New Staff</h1>
        <p className="text-slate-500 mt-1">Assign roles and credentials for your employees.</p>
      </div>

      <form action={createEmployee} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section: Basic Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Basic Information</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input name="name" type="text" required className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Position Role</label>
              <select name="role" required className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none transition-all">
                <option>Security Guard</option>
                <option>Engineer</option>
                <option>HR</option>
                <option>Accountant</option>
              </select>
            </div>
          </div>

          {/* Section: Access Credentials */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">System Access</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Set Username</label>
              <input name="username" type="text" required className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Set Temporary Password</label>
              <input name="password" type="password" required className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" />
            </div>
          </div>

          {/* Section: Employment Details */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Payroll & Schedule</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Monthly Salary ($)</label>
              <input name="salary" type="number" required className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div className="space-y-4">
             <h2 className="text-sm font-semibold uppercase text-white tracking-wider hidden md:block">Spacer</h2>
             <div className="space-y-2">
              <label className="text-sm font-medium">Working Hours (e.g. 9AM-5PM)</label>
              <input name="hours" type="text" required className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 flex justify-end">
          <button type="submit" className="w-full md:w-auto px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all">
            Deploy Employee Account
          </button>
        </div>
      </form>
    </div>
  );
}