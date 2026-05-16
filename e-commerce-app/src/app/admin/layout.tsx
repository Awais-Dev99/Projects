// src/app/admin/layout.tsx
import React from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, Home, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="p-6 border-b">
          <h2 className="text-xl font-black text-blue-600 tracking-tight">ADMIN PANEL</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all font-semibold text-gray-600"
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Back to Shop Link - Useful for testing */}
        <div className="p-4 border-t">
          <Link href="/" className="flex items-center space-x-3 p-3 text-gray-500 hover:text-blue-600 font-medium">
            <Home size={20} />
            <span>View Storefront</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}