"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = ["Electronics", "Clothing", "Home & Garden", "Accessories", "Health"];

// Update the function signature to accept props
export default function FilterSidebar({ currentCategory }: { currentCategory?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [price, setPrice] = useState(searchParams.get('maxPrice') || "1000");

  const updateUrl = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          Categories
        </h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                // Now using the prop to check the status
                checked={currentCategory === cat}
                onChange={() => updateUrl('category', currentCategory === cat ? null : cat)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={`ml-3 font-medium transition-colors ${
                currentCategory === cat ? "text-blue-600" : "text-gray-600 group-hover:text-black"
              }`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Section stays the same */}
      <div>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold flex items-center gap-2">
             <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
             Price Range
          </h3>
          <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-lg text-sm">
            ${price}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onMouseUp={() => updateUrl('maxPrice', price)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>
    </div>
  );
}