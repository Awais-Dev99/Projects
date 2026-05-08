import React from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Search } from 'lucide-react';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter text-blue-600">
            NEXTSHOP
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="/store" className="hover:text-blue-600">All Products</Link>
            <Link href="/my-orders" className="hover:text-blue-600">Orders</Link>
          </div>

          <div className="flex items-center space-x-5">
            <button className="hover:text-blue-600"><Search size={20} /></button>
            <Link href="/cart" className="relative hover:text-blue-600">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 rounded-full">0</span>
            </Link>
            <Link href="/login" className="hover:text-blue-600"><User size={20} /></Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center border-t border-gray-800 pt-8">
          <p>© 2026 NextShop E-commerce. Built with Next.js & MongoDB.</p>
        </div>
      </footer>
    </div>
  );
}