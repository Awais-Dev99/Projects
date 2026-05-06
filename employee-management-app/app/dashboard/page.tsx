// app/dashboard/page.tsx
import clientPromise from "@/lib/mongodb";
import { Bell, Calendar, Info, Clock } from "lucide-react";

async function getEmployeeData(username: string) {
  const client = await clientPromise;
  const db = client.db("ems_database");
  return await db.collection("employees").findOne({ username });
}

export default async function EmployeeDashboard() {
  // In production, this comes from the auth session
  const user = await getEmployeeData("john_doe");

  if (!user) return <div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest">Access Denied</div>;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Hello, {user.name}!</h1>
          <p className="text-blue-100 mt-2 font-medium">Welcome back to your {user.role} dashboard.</p>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
              <Calendar size={16} />
              <span className="text-sm font-semibold">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
              <Clock size={16} />
              <span className="text-sm font-semibold">{user.workingHours}</span>
            </div>
          </div>
        </div>
        <Bell className="absolute -right-6 -top-6 text-white/10" size={180} />
      </div>

      {/* Notifications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bell size={20} className="text-blue-600" />
            Official Notifications
          </h2>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
            {user.notifications?.length || 0} New
          </span>
        </div>

        {user.notifications && user.notifications.length > 0 ? (
          <div className="grid gap-4">
            {user.notifications.map((note: any) => (
              <div key={note.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start hover:border-blue-300 transition-colors">
                <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                  <Info className="text-blue-600" size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {note.message}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-2">
                    Received: {new Date(note.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-slate-400 font-medium italic">No active notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}