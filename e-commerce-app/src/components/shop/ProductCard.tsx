"use client";
import { useCart } from "./../../context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isUnauthorized = status === "unauthenticated" || (!session && status !== "loading");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUnauthorized) {
      toast.error("Please log in to add items to cart");
      router.push("/login?callback=" + encodeURIComponent(pathname));
      return;
    }

    if (status === "loading") {
      return;
    }

    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <Link
      href={`/product/${product._id}`}
      className="block bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{product.title}</h3>
      <div className="flex justify-between items-center mt-4">
        <span className="text-blue-600 font-black text-xl">${product.price}</span>
        <button
          onClick={handleAddToCart}
          disabled={isUnauthorized || status === "loading"}
          title={isUnauthorized ? "Log in to enable adding products" : undefined}
          className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Loading..." : isUnauthorized ? "Login to Add" : "Add"}
        </button>
      </div>
    </Link>
  );
}