"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { DollarSign, Package, ShoppingCart, Users, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Revenue", value: "Loading...", icon: DollarSign, color: "text-green-600" },
    { label: "Orders", value: "Loading...", icon: ShoppingCart, color: "text-blue-600" },
    { label: "Active Products", value: "Loading...", icon: Package, color: "text-orange-600" },
    { label: "Customers", value: "Loading...", icon: Users, color: "text-purple-600" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersRes = await fetch("/api/orders");
      if (!ordersRes.ok) throw new Error("Failed to fetch orders");
      const orders = await ordersRes.json();

      // Fetch products
      const productsRes = await fetch("/api/products");
      if (!productsRes.ok) throw new Error("Failed to fetch products");
      const products = await productsRes.json();

      // Calculate statistics
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);
      const uniqueCustomers = new Set(orders.map((order: any) => order.userId)).size;
      const totalOrders = orders.length;
      const activeProducts = products.length;

      setStats([
        { 
          label: "Total Revenue", 
          value: `$${totalRevenue.toFixed(2)}`, 
          icon: DollarSign, 
          color: "text-green-600" 
        },
        { 
          label: "Orders", 
          value: `+${totalOrders}`, 
          icon: ShoppingCart, 
          color: "text-blue-600" 
        },
        { 
          label: "Active Products", 
          value: activeProducts.toString(), 
          icon: Package, 
          color: "text-orange-600" 
        },
        { 
          label: "Customers", 
          value: uniqueCustomers.toString(), 
          icon: Users, 
          color: "text-purple-600" 
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        {loading && <Loader2 className="w-6 h-6 animate-spin text-blue-600" />}
      </div>
      
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