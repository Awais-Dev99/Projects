"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { cn } from './../../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/store' },
    { name: 'Categories', href: '/categories' },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-black text-blue-600 tracking-tighter">NEXTSHOP</span>
          </Link>

          {/* Desktop Nav */}
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

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-5">
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <Search size={20} />
            </button>
            <Link href="/cart" className="text-gray-600 hover:text-blue-600 transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
              <User size={20} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-semibold text-gray-900"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t flex justify-around">
             <Link href="/cart" onClick={() => setIsOpen(false)}><ShoppingCart size={24}/></Link>
             <Link href="/login" onClick={() => setIsOpen(false)}><User size={24}/></Link>
          </div>
        </div>
      )}
    </nav>
  );
}