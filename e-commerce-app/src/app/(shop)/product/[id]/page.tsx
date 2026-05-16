// src/app/(shop)/product/[id]/page.tsx
import { connectToDatabase } from "./../../../../lib/db";
import Product from "./../../../../models/Product";
import { notFound } from "next/navigation";
import AddToCartButton from "./../../../../components/shop/AddToCartButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params; // Crucial for Next.js 15
  
  await connectToDatabase();
  const product = await Product.findById(id).lean();

  if (!product) notFound();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden">
          <img 
            src={product.images?.[0] || "/placeholder.png"} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl font-black">{product.title}</h1>
          <p className="text-2xl font-bold text-blue-600">${product.price}</p>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
        </div>
      </div>
    </div>
  );
}