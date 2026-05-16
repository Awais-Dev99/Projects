"use client";

import { useCart } from "./../../context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";

interface Props {
  product: any;
}

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isUnauthorized = status === "unauthenticated" || (!session && status !== "loading");

  const handleAddToCart = () => {
    if (isUnauthorized) {
      toast.error("Please log in to add items to cart");
      router.push("/login?callback=" + encodeURIComponent(pathname));
      return;
    }

    if (status === "loading") {
      return;
    }

    addToCart(product);
    toast.success("Added to cart!");
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isUnauthorized || status === "loading"}
      title={isUnauthorized ? "Log in to enable adding products" : undefined}
      className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-colors active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingBag size={20} />
      {status === "loading" ? "Loading..." : isUnauthorized ? "Login to Add" : "Add to Cart"}
    </button>
  );
}