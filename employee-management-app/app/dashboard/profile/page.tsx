// app/dashboard/profile/page.tsx
import clientPromise from "@/lib/mongodb";
import { 
  User, 
  Briefcase, 
  DollarSign, 
  Clock, 
  ShieldAlert, 
  Lock 
} from "lucide-react";

// In a real app, you would get the 'username' from the auth session.
// For now, we fetch a sample user to show the UI structure.
async function getProfileData(username: string) {
  const client = await clientPromise;
  const db = client.db("ems_database");
  const employee = await db.collection("employees").findOne({ username: username });
  return JSON.parse(JSON.stringify(employee));
}

export default async function ProfilePage() {
  // Replace "john_doe" with the actual logged-in username from your session
  const user = await getProfileData("john_doe") || {
    name: "User Not Found",
    role: "N/A",
    salary: 0,
    workingHours: "N/A",
    accountStatus: "active"
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center relative overflow-hidden">
        <div className="absolute top-4 right-4 text-slate-300">
          <Lock size={20} />
        </div>
        <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-blue-200">
          {user.name.charAt(0)}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
        <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm mt-1">
          {user.role}
        </p>
      </div>

      {/* Employment Details (Read-Only) */}
      <div className="grid grid-cols-1 gap-4">
        <InfoCard 
          label="Official Designation" 
          value={user.role} 
          icon={<Briefcase className="text-slate-400" />} 
        />
        <InfoCard 
          label="Monthly Base Salary" 
          value={`$${user.salary.toLocaleString()}`} 
          icon={<DollarSign className="text-slate-400" />} 
        />
        <InfoCard 
          label="Assigned Shift / Hours" 
          value={user.workingHours} 
          icon={<Clock className="text-slate-400" />} 
        />
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-xl">
                    <ShieldAlert className="text-slate-400" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Account Status</p>
                    <p className={`text-lg font-bold ${user.accountStatus === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {user.accountStatus.toUpperCase()}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Admin Disclaimer Footer */}
      <div className="p-6 bg-slate-100 rounded-2xl border border-dashed border-slate-300">
        <div className="flex gap-3">
          <Lock className="text-slate-400 shrink-0" size={20} />
          <p className="text-sm text-slate-500 leading-relaxed">
            Personal and employment details are managed exclusively by the <strong>System Administrator</strong>. 
            If you need to change your bank details, designation, or working hours, please contact the HR department.
          </p>
        </div>
      </div>
    </div>
  );
}

// Sub-component: Clean Data Row
function InfoCard({ label, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 transition-all active:bg-slate-50">
      <div className="p-3 bg-slate-100 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}