import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  // Mock data for featured products
  const featuredProducts = [
    { id: '1', name: 'Premium Wireless Headphones', price: 299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
    { id: '2', name: 'Smart Fitness Watch', price: 199, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
    { id: '3', name: 'Minimalist Leather Wallet', price: 49, image: 'https://images.unsplash.com/photo-1627123430984-705199f74d56?w=500&q=80' },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] flex items-center bg-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center z-10">
          <div className="space-y-6">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">New Collection 2026</span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-gray-900">
              Tech That Defines <span className="text-blue-600">Future.</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              Discover our curated selection of premium electronics and lifestyle essentials designed for the modern world.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/products" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Shop Collection <ArrowRight size={20} />
              </Link>
              <Link href="/products?category=electronics" className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold border hover:bg-gray-50 transition-all">
                Browse Categories
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block relative">
             {/* Replace with a high-quality product image */}
            <div className="w-full h-[500px] bg-blue-200 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" 
                alt="Hero Product" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES STRIP */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Truck /></div>
            <div><h4 className="font-bold">Free Shipping</h4><p className="text-sm text-gray-500">On all orders over $100</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><ShieldCheck /></div>
            <div><h4 className="font-bold">Secure Payment</h4><p className="text-sm text-gray-500">100% secure checkout</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><ShoppingBag /></div>
            <div><h4 className="font-bold">Easy Returns</h4><p className="text-sm text-gray-500">30-day money back policy</p></div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Featured Arrivals</h2>
            <p className="text-gray-500 mt-2">Handpicked for your lifestyle</p>
          </div>
          <Link href="/products" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <button className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <ShoppingBag size={20} className="text-blue-600" />
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-yellow-400 gap-1">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                <p className="text-xl font-black">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. NEWSLETTER / CTA */}
      <section className="my-10 mx-4">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Join the Club. Get 20% Off.</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
              Subscribe to our newsletter and be the first to know about new arrivals and exclusive offers.
            </p>
            <form className="max-w-md mx-auto flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-6 py-4 rounded-full text-gray-900 outline-none"
              />
              <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-all">
                Join
              </button>
            </form>
          </div>
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-20 -mt-20 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 rounded-full -ml-10 -mb-10 opacity-30"></div>
        </div>
      </section>
    </div>
  );
}