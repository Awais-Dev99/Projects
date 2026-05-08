"use client";

import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImagesChange: (urls: string[]) => void;
}

export default function ImageUploader({ onImagesChange }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you'd upload to Cloudinary/S3 here
    // For now, we generate local blob URLs for preview
    const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
    const totalImages = [...previews, ...newPreviews];
    
    setPreviews(totalImages);
    onImagesChange(totalImages);
  };

  const removeImage = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {previews.map((src, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-100 group">
            <img src={src} alt="preview" className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {previews.length < 6 && (
          <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
            <Upload size={24} className="group-hover:text-blue-500 transition-colors" />
            <span className="text-[10px] font-bold mt-2 uppercase tracking-tight">Add Photo</span>
            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>
        )}
      </div>
      {previews.length === 0 && (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <ImageIcon className="text-gray-300" size={32} />
          <p className="text-xs text-gray-500">No images uploaded yet. You can add up to 6 photos.</p>
        </div>
      )}
    </div>
  );
}