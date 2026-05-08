import Link from "next/link";
export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Recent Orders</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4 font-mono text-sm">#ORD-5501</td>
              <td className="p-4">John Doe</td>
              <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Processing</span></td>
              <td className="p-4 font-bold">$149.99</td>
              <td className="p-4 text-blue-600"><Link href="/orders/1">View Details</Link></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}