import clientPromise from "@/lib/mongodb";
import { Clock, DollarSign } from "lucide-react";
import AdminActions from "@/components/admin/AdminActions"; // Import your new client component

async function getEmployees() {
  const client = await clientPromise;
  const db = client.db("ems_database");
  const employees = await db.collection("employees").find({}).sort({ createdAt: -1 }).toArray();
  return JSON.parse(JSON.stringify(employees));
}

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workforce Directory</h1>
          <p className="text-slate-500">Manage status, payroll, and access for all roles.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm self-start">
          <span className="text-sm font-medium text-slate-500">Total Staff: </span>
          <span className="text-lg font-bold text-blue-600">{employees.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-600">Employee</th>
                <th className="p-4 font-semibold text-slate-600">Role</th>
                <th className="p-4 font-semibold text-slate-600">Salary</th>
                <th className="p-4 font-semibold text-slate-600">Status</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp: any) => (
                <tr key={emp._id} className={`hover:bg-slate-50/50 transition-colors ${emp.accountStatus === 'disabled' ? 'opacity-60' : ''}`}>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{emp.name}</div>
                    <div className="text-xs text-slate-500">@{emp.username}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {emp.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">${emp.salary.toLocaleString()}</td>
                  <td className="p-4">
                    <StatusBadge status={emp.accountStatus} />
                  </td>
                  <td className="p-4 text-right">
                    {/* id must be a string for client components */}
                    <AdminActions id={emp._id.toString()} status={emp.accountStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-slate-100">
          {employees.map((emp: any) => (
            <div key={emp._id} className={`p-6 space-y-4 ${emp.accountStatus === 'disabled' ? 'bg-slate-50 grayscale' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{emp.name}</h3>
                  <p className="text-sm text-slate-500">Role: {emp.role}</p>
                </div>
                <StatusBadge status={emp.accountStatus} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm py-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <DollarSign size={16} className="text-green-600" />
                  {emp.salary.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={16} className="text-blue-600" />
                  {emp.workingHours}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <AdminActions id={emp._id.toString()} status={emp.accountStatus} fullWidth />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'active';
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
      isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
      {status}
    </div>
  );
}