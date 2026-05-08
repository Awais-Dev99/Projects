"use client";

import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartItem() {
  return (
    <div className="flex gap-4 py-4 border-b last:border-0">
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
        <img src="https://via.placeholder.com/150" alt="product" className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-grow flex flex-col justify-between py-0.5">
        <div>
          <h4 className="font-bold text-gray-900 text-sm line-clamp-1">Premium Wireless Headphones</h4>
          <p className="text-xs text-gray-500 mt-0.5">Electronics</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded-lg bg-gray-50">
            <button className="p-1.5 hover:text-blue-600"><Minus size={14} /></button>
            <span className="px-2 text-xs font-bold">1</span>
            <button className="p-1.5 hover:text-blue-600"><Plus size={14} /></button>
          </div>
          <p className="font-bold text-sm">$299.00</p>
        </div>
      </div>
      
      <button className="self-start p-1 text-gray-300 hover:text-red-500 transition-colors">
        <Trash2 size={16} />
      </button>
    </div>
  );
}