"use client";

import { use } from "react";
import OrderTimeline from "../../../../../components/shop/OrderTimeline";
import { Badge } from "../../../../../components/ui/Badge";
import { Button } from "../../../../../components/ui/Button";

export default function AdminOrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Mock data - replace with fetch request to /api/orders/[id]
  const order = {
    id: id,
    customer: "Jane Doe",
    email: "jane@example.com",
    status: "Processing" as const,
    total: 299.00,
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-gray-500 font-mono">Order ID: {id}</p>
          <h1 className="text-3xl font-black text-gray-900">Manage Order</h1>
        </div>
        <Badge variant="warning">{order.status}</Badge>
      </div>

      <OrderTimeline status={order.status} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white border rounded-2xl shadow-sm">
          <h3 className="font-bold mb-4">Customer Details</h3>
          <p className="text-sm text-gray-600">{order.customer}</p>
          <p className="text-sm text-gray-600">{order.email}</p>
        </div>
        <div className="p-6 bg-white border rounded-2xl shadow-sm flex flex-col justify-center gap-3">
          <Button>Mark as Shipped</Button>
          <Button variant="outline">Print Invoice</Button>
        </div>
      </div>
    </div>
  );
}