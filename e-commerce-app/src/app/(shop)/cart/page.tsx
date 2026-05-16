"use client";

import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from './../../../context/CartContext'; // Using @ alias for cleaner imports
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cart, updateQuantity, removeFromCart } = useCart();

  // Check authentication on mount
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please log in to view your cart");
      router.push("/login?callback=/cart");
    }
  }, [status, router]);

  // 2. Memoized-style calculation for subtotal
  const subtotal = cart.reduce((acc: number, item: any) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return acc + (price * quantity);
  }, 0);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Shopping Bag is empty</h2>
        <Link href="/" className="text-blue-600 flex items-center gap-2 hover:underline font-medium">
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Your Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* List of Items */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item: any) => (
            <div key={item._id} className="flex gap-6 pb-8 border-b border-gray-100 last:border-0">
              {/* Product Image */}
              <div className="w-28 h-28 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border">
                <img 
                  src={item.image || "/placeholder.png"} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Product Info & Controls */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-400 capitalize mt-1">{item.category || 'General'}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center border rounded-xl overflow-hidden bg-white shadow-sm">
                    <button 
                      onClick={() => updateQuantity(item._id, -1)}
                      className="p-2.5 hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    
                    <span className="px-4 py-1 text-sm font-bold min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    
                    <button 
                      onClick={() => updateQuantity(item._id, 1)}
                      className="p-2.5 hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <p className="font-black text-xl text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-[2.5rem] p-8 lg:sticky lg:top-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Order Summary</h2>
            
            <div className="space-y-5">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-500 font-medium pb-5 border-b border-gray-200">
                <span>Shipping</span>
                <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">FREE</span>
              </div>
              
              <div className="flex justify-between pt-3">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-blue-600 block">
                    ${subtotal.toFixed(2)}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">Including VAT & Taxes</p>
                </div>
              </div>
            </div>

            <Link href="/checkout" className="block w-full">
  <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold mt-10 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">
    Proceed to Checkout
  </button>
</Link>
          </div>
        </div>
      </div>
    </div>
  );
}