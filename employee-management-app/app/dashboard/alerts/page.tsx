import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { Bell, Clock } from "lucide-react";

export default async function AlertsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Unauthorized</div>;

  const client = await clientPromise;
  const db = client.db("ems_database");
  
  // Fetch the current logged-in employee's notifications
  const employee = await db.collection("employees").findOne(
    { username: session.user.email },
    { projection: { notifications: 1 } }
  );

  const alerts = employee?.notifications || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <Bell className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold">Admin Notifications</h1>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400">
          No new alerts from management.
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert: any, index: number) => (
            <div key={index} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500 border-y border-r">
              <h3 className="font-bold text-slate-800">{alert.title}</h3>
              <p className="text-slate-600 mt-1">{alert.message}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                <Clock size={12} />
                {new Date(alert.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}