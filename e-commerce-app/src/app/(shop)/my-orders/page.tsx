"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Package, AlertCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function MyOrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  // Check authentication and fetch orders
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please log in to view your orders");
      router.push("/login?callback=/my-orders");
      return;
    }

    if (status === "authenticated" && session?.user) {
      fetchOrders();
    }
  }, [status, session, router]);

  const fetchOrders = async () => {
    try {
      const userId = (session?.user as any)?.id;
      const response = await fetch(`/api/orders?userId=${userId}`);

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const confirmed = window.confirm("Are you sure you want to cancel this order? This action cannot be undone.");
    if (!confirmed) return;

    setCancellingOrderId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(order => 
          order._id === orderId ? updatedOrder : order
        ));
        toast.success("Order cancelled successfully");
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Show loading state while checking authentication
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Package size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <Link
            href="/store"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/my-orders/${order._id}`}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                      order.status === "Shipped" ? "bg-purple-100 text-purple-700" :
                      order.status === "Delivered" ? "bg-green-100 text-green-700" :
                      order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{order.user.name} • {order.user.email}</p>
                  <p className="text-gray-500 text-sm">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} • 
                    {new Date(order.createdAt).toLocaleDateString("en-US", { 
                      month: "short", 
                      day: "numeric", 
                      year: "numeric" 
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-2xl font-black text-blue-600">${order.totalPrice.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Total Amount</p>
                  </div>
                  {order.status === "Pending" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCancelOrder(order._id);
                      }}
                      disabled={cancellingOrderId === order._id}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                      {cancellingOrderId === order._id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircle size={14} />
                          Cancel
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-xs font-semibold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center">
                      <p className="text-xs font-bold text-gray-500">+{order.items.length - 4} more</p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}