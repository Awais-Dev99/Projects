"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function OrderStatusSelector({ orderId, currentStatus }: any) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        toast.success("Status updated!");
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => handleStatusChange(e.target.value)}
      className={`text-xs font-bold py-1 px-3 rounded-full border ${
        status === "Delivered" ? "bg-green-50 text-green-700 border-green-200" :
        status === "Processing" ? "bg-blue-50 text-blue-700 border-blue-200" :
        "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      <option value="Processing">Processing</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  );
}