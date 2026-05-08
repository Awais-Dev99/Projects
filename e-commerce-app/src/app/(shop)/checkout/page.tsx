"use client";

import { Button } from "./../../../components/ui/Button";
import { useCartStore } from "./../../../store/useCartStore";

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Shipping Information</h2>
        <div className="grid gap-4">
          <input placeholder="Full Name" />
          <input placeholder="Shipping Address" />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="City" />
            <input placeholder="Zip Code" />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-3xl h-fit space-y-6">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <div className="space-y-4">
          {items.map(item => (
            <div key={item._id} className="flex justify-between text-sm">
              <span>{item.title} x {item.quantity}</span>
              <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 flex justify-between text-lg font-black">
          <span>Total</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
        <Button className="w-full" size="lg">Pay Now</Button>
      </div>
    </div>
  );
}