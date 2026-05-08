import { Button } from "./../../../components/ui/button";
import CartItem from "./../../../components/shop/CartItem";
import Link from "next/link";

export default function CartPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-extrabold">Your Shopping Bag</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <CartItem />
          <CartItem />
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl h-fit space-y-4">
          <h2 className="font-bold text-lg">Summary</h2>
          <div className="flex justify-between border-b pb-4">
            <span>Subtotal</span>
            <span className="font-bold">$598.00</span>
          </div>
          <Link href="/checkout" className="block">
            <Button className="w-full" size="lg">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}