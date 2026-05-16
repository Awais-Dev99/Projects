"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Search, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from './../../lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from './../../context/CartContext'; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { cart } = useCart();

  // This accurately sums up quantities (e.g., 2 headphones + 1 shirt = 3)
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
    // Force a page reload to ensure session is cleared
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/store' },
    { name: 'Categories', href: '/categories' },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black text-blue-600 tracking-tighter">NEXTSHOP</span>
            </Link>

            {/* ONLY Admins see the dashboard/management links */}
            {session?.user?.role === "admin" && (
              <Link 
                href="/admin/dashboard" 
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full hover:bg-blue-100 transition-colors"
              >
                <LayoutDashboard size={14} />
                ADMIN PANEL
              </Link>
            )}
          </div>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  pathname === link.href ? "text-blue-600" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-5">
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <Search size={20} />
            </button>
            
            <Link 
              href={session ? "/cart" : "/login?callback=/cart"} 
              className="text-gray-600 hover:text-blue-600 transition-colors relative"
            >
              <ShoppingCart size={20} />
              {/* Badge only shows if there are items AND user is authenticated */}
              {totalItems > 0 && session && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link 
              href={session ? "/profile" : "/login"} 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <User size={20} />
            </Link>

            {session && (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors ml-2"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
          {session?.user?.role === "admin" && (
            <Link
              href="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="block text-lg font-bold text-blue-600 bg-blue-50 p-2 rounded"
            >
              Admin Dashboard
            </Link>
          )}
          
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block text-lg font-semibold",
                pathname === link.href ? "text-blue-600" : "text-gray-900"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-4 border-t flex justify-around items-center">
            <Link 
              href={session ? "/cart" : "/login?callback=/cart"} 
              onClick={() => setIsOpen(false)} 
              className="text-gray-600 relative"
            >
              <ShoppingCart size={24}/>
              {totalItems > 0 && session && (
                <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href={session ? "/profile" : "/login"} onClick={() => setIsOpen(false)} className="text-gray-600">
              <User size={24}/>
            </Link>
            {session && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={24}/>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}