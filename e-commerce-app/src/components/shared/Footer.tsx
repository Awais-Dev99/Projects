import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="text-xl font-black text-blue-600">NEXTSHOP</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Premium e-commerce experience built for performance and speed. Shop the latest tech and lifestyle essentials.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/store" className="hover:text-blue-600">All Products</Link></li>
            <li><Link href="/categories" className="hover:text-blue-600">Categories</Link></li>
            <li><Link href="/my-orders" className="hover:text-blue-600">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/faq" className="hover:text-blue-600">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:text-blue-600">Shipping Policy</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <button className="p-2 bg-white border rounded-full hover:text-blue-600 transition-colors"><Twitter size={18} /></button>
            <button className="p-2 bg-white border rounded-full hover:text-pink-600 transition-colors"><Instagram size={18} /></button>
            <button className="p-2 bg-white border rounded-full hover:text-blue-800 transition-colors"><Facebook size={18} /></button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t text-center text-sm text-gray-400">
        <p>© 2026 NextShop. All rights reserved.</p>
      </div>
    </footer>
  );
}