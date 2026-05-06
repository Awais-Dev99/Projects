import clientPromise from "@/lib/mongodb";
import InteractiveDashboard from "../../components/InteractiveDashboard";

async function getEmployees() {
  const client = await clientPromise;
  const db = client.db("ems_database");
  const employees = await db.collection("employees").find({}).toArray();
  // We stringify and parse to ensure MongoDB ObjectIDs are converted to strings for the Client Component
  return JSON.parse(JSON.stringify(employees));
}

export default async function AdminDashboardPage() {
  const employees = await getEmployees();
  return <InteractiveDashboard initialEmployees={employees} />;
}