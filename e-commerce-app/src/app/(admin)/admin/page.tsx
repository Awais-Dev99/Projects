import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "$45,231.89", icon: DollarSign, color: "text-green-600" },
    { label: "Orders", value: "+2350", icon: ShoppingCart, color: "text-blue-600" },
    { label: "Active Products", value: "122", icon: Package, color: "text-orange-600" },
    { label: "Customers", value: "1,200", icon: Users, color: "text-purple-600" },
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}