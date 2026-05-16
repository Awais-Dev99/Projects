"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./../../components/ui/Input";
import { Button } from "./../..//components/ui/Button";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";

interface ProductData {
  _id: string;
  title: string;
  price: number;
  description: string;
  category?: string;
  stock?: number;
  image?: string;
}

export default function EditProductForm({ initialData }: { initialData: ProductData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    price: initialData.price || 0,
    description: initialData.description || "",
    category: initialData.category || "General",
    stock: initialData.stock || 0,
    image: initialData.image || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productId = initialData._id;

      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Product updated successfully!");
        router.refresh();
        router.push("/admin/products");
      } else {
        throw new Error(data.error || "Update failed");
      }
    } catch (error: any) {
      console.error("Save Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData({ ...formData, image: urls[0] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border shadow-sm">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Product Image</label>
        <p className="text-xs text-gray-600 mb-3">Upload a new product image or keep the current one</p>
        <ImageUploader onImagesChange={handleImagesChange} />
        {formData.image && (
          <div className="mt-3">
            <p className="text-xs text-gray-600 mb-2">Current Image:</p>
            <img src={formData.image} alt="Current product" className="w-32 h-32 object-cover rounded-lg border" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Product Title</label>
          <Input
            placeholder="Name of product"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Price ($)</label>
          <Input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value === "" ? 0 : parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Category</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Stock Level</label>
          <Input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value === "" ? 0 : parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Full Description</label>
        <textarea
          className="w-full p-4 border rounded-xl h-32 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1"
          onClick={() => router.push("/admin/products")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {loading ? "Syncing with Database..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}