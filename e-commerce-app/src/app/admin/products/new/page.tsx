"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ImageUploader from "../../../../components/admin/ImageUploader";

const categories = ["Electronics", "Clothing", "Home & Garden", "Accessories", "Health"];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "General",
    stock: "0",
    image: "", // Singular 'image' to match the POST handler
    description: ""
  });

  const handleImagesChange = (urls: string[]) => {
  if (urls.length > 0) {
    // Send the first URL string to the API
    setFormData({ ...formData, image: urls[0] }); 
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Double check that the image actually exists in state
    if (!formData.image) {
      toast.error("Please wait for the image to finish uploading.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price), // Ensure price is a number
          stock: parseInt(formData.stock)    // Ensure stock is a number
        }),
      });

      if (res.ok) {
        toast.success("Product created successfully!");
        // Redirect to the main product list to avoid 404s
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save product");
      }
    } catch (err) {
      console.error("SUBMIT_ERROR:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Create New Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border shadow-sm">
        {/* IMAGE UPLOADER SECTION */}
        <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
          <label className="block text-sm font-bold mb-2 text-gray-700">Product Images</label>
          <ImageUploader onImagesChange={handleImagesChange} />
          {formData.image && (
            <p className="text-xs text-green-600 mt-2 font-medium">✓ Image ready for upload</p>
          )}
        </div>

        {/* BASIC INFO */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Product Title</label>
            <input
              required
              placeholder="e.g. Wireless Headphones"
              className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe your product..."
              className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Category</label>
            <select
              required
              className="w-full p-2.5 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="General">Select a Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Stock</label>
              <input
                type="number"
                required
                className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.image}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-all shadow-lg shadow-blue-100"
        >
          {loading ? "Saving to Database..." : "Add Product to Store"}
        </button>
      </form>
    </div>
  );
}