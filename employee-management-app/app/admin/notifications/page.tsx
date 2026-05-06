// app/admin/notifications/page.tsx
import clientPromise from "@/lib/mongodb";
import { sendNotification } from "@/lib/actions";
import { Send, Bell, User, MessageSquare } from "lucide-react";

async function getEmployees() {
  const client = await clientPromise;
  const db = client.db("ems_database");
  const employees = await db.collection("employees")
    .find({ accountStatus: "active" })
    .project({ name: 1, role: 1, username: 1 })
    .toArray();
  return JSON.parse(JSON.stringify(employees));
}

export default async function NotificationsPage() {
  const employees = await getEmployees();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Staff Communication</h1>
        <p className="text-slate-500 mt-1">Send instant alerts or instructions to specific employees.</p>
      </div>

      <form action={sendNotification} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Recipient Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <User size={18} className="text-blue-500" />
              Select Recipient
            </label>
            <select 
              name="employeeId" 
              required 
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none"
            >
              <option value="">Choose an employee...</option>
              {employees.map((emp: any) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} — ({emp.role})
                </option>
              ))}
            </select>
          </div>

          {/* Message Area */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MessageSquare size={18} className="text-blue-500" />
              Message Content
            </label>
            <textarea 
              name="message" 
              required 
              rows={5}
              placeholder="Type your message here (e.g. Please update your shift logs...)"
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
            ></textarea>
          </div>

          {/* Alert Type Indicator (UI Only) */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
            <Bell className="text-blue-600 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-bold">Pro-Tip:</p>
              <p className="opacity-80">Employees will see this message as a high-priority alert on their mobile dashboard upon their next login.</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 flex justify-end">
          <button 
            type="submit" 
            className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-900/20"
          >
            <Send size={18} />
            Dispatch Notification
          </button>
        </div>
      </form>
    </div>
  );
}