"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star } from 'lucide-react';

interface ProductProps {
  product: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    category: string;
  };
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-3 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
          <img
            src={product.images[0] || "/placeholder.png"}
            alt={product.title}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-blue-600 uppercase">
            {product.category}
          </div>
        </div>
      </Link>

      <div className="mt-4 px-1">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">(4.8)</span>
        </div>
        
        <Link href={`/products/${product._id}`}>
          <h3 className="font-bold text-gray-900 truncate hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-3">
          <p className="text-lg font-black text-gray-900">${product.price}</p>
          <button className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm">
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}