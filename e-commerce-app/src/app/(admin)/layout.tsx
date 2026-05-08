import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Home } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile, visible on md+ */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Link href="/" className="flex items-center space-x-3 p-3 text-gray-600 hover:text-blue-600">
            <Home size={20} />
            <span>Back to Shop</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}