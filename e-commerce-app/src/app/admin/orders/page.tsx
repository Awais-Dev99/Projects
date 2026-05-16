import Link from "next/link";
import { connectToDatabase } from "./../../../lib/db";
import Order from "./../../../models/Order";
import OrderStatusSelector from "./../../../components/admin/OrderStatusSelector";

export default async function AdminOrdersPage() {
  await connectToDatabase();
  // Fetch orders
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .lean();

  const serializedOrders = JSON.parse(JSON.stringify(orders));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black mb-8">Manage Orders</h1>
      
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b uppercase text-xs font-bold text-gray-500">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {serializedOrders.map((order: any) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-xs text-blue-600">{order._id}</td>
                <td className="p-4">
                  <div className="font-bold">{order.user?.name || "Guest"}</div>
                  <div className="text-xs text-gray-400">{order.user?.email}</div>
                </td>
                <td className="p-4 font-bold">${order.totalPrice.toFixed(2)}</td>
                <td className="p-4">
                  <OrderStatusSelector 
                    orderId={order._id} 
                    currentStatus={order.status} 
                  />
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/orders/${String(order._id)}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}