"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "./../../app/actions/productAction";
import { toast } from "react-hot-toast";
import { useState } from "react";

interface Props {
  productId: string;
}

export default function DeleteProductButton({ productId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        toast.success("Product deleted");
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`p-2 rounded-lg transition-all ${
        loading ? "text-gray-300" : "text-gray-400 hover:text-red-600 hover:bg-red-50"
      }`}
    >
      <Trash2 size={18} className={loading ? "animate-pulse" : ""} />
    </button>
  );
}