"use client";

import { useState } from "react";
import ImageUploader from "../../../../components/admin/ImageUploader";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";

export default function NewProductPage() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-black">Add New Product</h1>
      
      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Product Images</label>
          <ImageUploader onImagesChange={(urls) => setImages(urls)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Product Title" />
          <Input placeholder="Price ($)" type="number" />
        </div>

        <textarea 
          placeholder="Product Description" 
          className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none h-32"
        />

        <Button size="lg" className="w-full">Create Product</Button>
      </div>
    </div>
  );
}