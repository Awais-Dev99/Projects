import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export default async function EmployeeDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) return <div>Please sign in.</div>;

  const client = await clientPromise;
  const db = client.db("ems_database"); // Using the correct DB
  
  // Find only the data for this specific employee
  const employee = await db.collection("employees").findOne({ 
    username: session.user.email // Maps to 'username' from your auth logic
  });

  if (!employee) return <div>No profile found.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Welcome, {employee.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Your Role</p>
          <p className="text-lg font-bold text-blue-600">{employee.role}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Working Hours</p>
          <p className="text-lg font-bold text-slate-800">{employee.workingHours}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Salary</p>
          <p className="text-lg font-bold text-green-600">${employee.salary.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}