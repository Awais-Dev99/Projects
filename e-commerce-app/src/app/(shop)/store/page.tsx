"use client";

import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock categories and products
  const categories = ["Electronics", "Clothing", "Home & Garden", "Accessories", "Health"];
  const products = [
    { id: '1', name: 'Premium Headphones', price: 299, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
    { id: '2', name: 'Cotton T-Shirt', price: 25, category: 'Clothing', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' },
    { id: '3', name: 'Desk Lamp', price: 45, category: 'Home & Garden', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500' },
    { id: '4', name: 'Leather Bag', price: 120, category: 'Accessories', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500' },
    { id: '5', name: 'Yoga Mat', price: 35, category: 'Health', image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500' },
    { id: '6', name: 'Smart Speaker', price: 89, category: 'Electronics', image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header: Title and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500 mt-1">Showing {products.length} results</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* MOBILE FILTER TOGGLE */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl font-semibold bg-white"
        >
          <Filter size={18} /> Filters
        </button>

        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="hidden lg:block w-64 space-y-8 shrink-0">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <SlidersHorizontal size={18} /> Categories
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 border-gray-300 rounded accent-blue-600" />
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Price Range</h3>
            <div className="space-y-4">
              <input type="range" min="0" max="1000" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>$0</span>
                <span>$1000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl transition-all group">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-700">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-blue-600">${product.price}</p>
                  <button className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors">
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY FILTER MENU */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-8 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}><X size={24}/></button>
            </div>
            {/* Same filter content as desktop sidebar could be duplicated or abstracted here */}
            <div className="space-y-8">
               <h3 className="font-bold border-b pb-2">Categories</h3>
               <div className="flex flex-col gap-3">
                  {categories.map(c => <label key={c} className="flex gap-2"><input type="checkbox"/> {c}</label>)}
               </div>
               <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-10">Show Results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}