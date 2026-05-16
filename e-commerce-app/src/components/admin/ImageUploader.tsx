"use client";

import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ImageUploaderProps {
  onImagesChange: (urls: string[]) => void;
}

export default function ImageUploader({ onImagesChange }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<Array<{ url: string; loading?: boolean }>>([]);
  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file:File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  // Use the EXACT name from your screenshot: ml_default
  formData.append("upload_preset", "ml_default"); 

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    try {
      const filesToUpload = Array.from(files);
      const uploadPromises = filesToUpload.map(file => {
        // Add loading preview first
        const previewUrl = URL.createObjectURL(file);
        setPreviews(prev => [...prev, { url: previewUrl, loading: true }]);
        
        // Then upload to Cloudinary
        return uploadToCloudinary(file);
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => url !== null);

      if (validUrls.length > 0) {
        // Replace previews with actual Cloudinary URLs
        setPreviews(prev => {
          const newPreviews = prev.filter(p => !p.loading);
          const cloudinaryPreviews = validUrls.map(url => ({ url, loading: false }));
          return [...newPreviews, ...cloudinaryPreviews];
        });

        // Update parent with new URLs
        const allUrls = previews
          .filter(p => !p.loading)
          .map(p => p.url)
          .concat(validUrls);
        
        onImagesChange(allUrls);
        toast.success(`${validUrls.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
      // Remove loading previews on error
      setPreviews(prev => prev.filter(p => !p.loading));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onImagesChange(updated.map(p => p.url));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-100 group bg-gray-50">
            <img src={preview.url} alt="preview" className="w-full h-full object-cover" />
            {preview.loading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            )}
            {!preview.loading && (
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        
        {previews.length < 6 && !uploading && (
          <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
            <Upload size={24} className="group-hover:text-blue-500 transition-colors" />
            <span className="text-[10px] font-bold mt-2 uppercase tracking-tight">Add Photo</span>
            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" disabled={uploading} />
          </label>
        )}

        {uploading && (
          <div className="aspect-square border-2 border-dashed border-blue-400 rounded-xl flex flex-col items-center justify-center bg-blue-50">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-tight text-blue-600">Uploading...</span>
          </div>
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