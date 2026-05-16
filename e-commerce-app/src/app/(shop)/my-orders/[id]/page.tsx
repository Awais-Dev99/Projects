"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city?: string;
    zipCode?: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status: authStatus } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const orderId = params.id as string;

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      toast.error("Please log in to view order details");
      router.push("/login?callback=/my-orders");
      return;
    }

    if (authStatus === "authenticated" && session?.user) {
      fetchOrder();
    }
  }, [authStatus, session, router, orderId]);

  const fetchOrder = async () => {
    try {
      const userId = (session?.user as any)?.id;
      const response = await fetch(`/api/orders?userId=${userId}`);

      if (!response.ok) throw new Error("Failed to fetch orders");

      const orders = await response.json();
      const currentOrder = orders.find((o: Order) => o._id === orderId);

      if (!currentOrder) {
        toast.error("Order not found");
        router.push("/my-orders");
        return;
      }

      setOrder(currentOrder);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || order.status === "Cancelled") return;

    // Only allow cancellation for pending orders
    if (order.status !== "Pending") {
      toast.error("Cannot cancel orders that are already processed");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to cancel this order? This action cannot be undone.");
    if (!confirmed) return;

    setCancelling(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        toast.success("Order cancelled successfully");
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!session || !order) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Processing": return "bg-blue-100 text-blue-700";
      case "Shipped": return "bg-purple-100 text-purple-700";
      case "Delivered": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending": return <Package size={20} />;
      case "Processing": return <Loader2 size={20} className="animate-spin" />;
      case "Shipped": return <Truck size={20} />;
      case "Delivered": return <CheckCircle size={20} />;
      case "Cancelled": return <XCircle size={20} />;
      default: return <Package size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/my-orders")}
          className="text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h2>
                <p className="text-gray-500 text-sm">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Cancel Order Button */}
            {order.status === "Pending" && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-yellow-600" />
                    <div>
                      <p className="font-semibold text-yellow-800">Cancel Order</p>
                      <p className="text-sm text-yellow-700">You can cancel this order before it starts processing</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {cancelling ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        Cancel Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Order Items</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Customer Info */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-blue-600">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{order.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{order.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{order.user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold">{order.user.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}