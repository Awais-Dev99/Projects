import { connectToDatabase } from "../../../../../lib/db";
import Product from "../../../../../models/Product";
import EditProductForm from "../../../../../components/admin/EditProductForm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Product | ${id}`,
  };
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  let product = null;
  try {
    await connectToDatabase();
    
    // Fetch product and convert to plain object
    product = await Product.findById(id).lean();
  } catch (error) {
    console.error("Database connection error:", error);
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-red-600">Connection Error</h2>
        <p className="text-gray-500">Unable to reach the database. Please try again later.</p>
      </div>
    );
  }

  if (!product) {
    notFound(); 
  }

  // Deep serialization to handle MongoDB ObjectIds safely
  const serializedProduct = JSON.parse(JSON.stringify(product));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Navigation Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/products" className="hover:text-blue-600 transition-colors">Products</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">Edit Product</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Package size={24} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Update Inventory
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Editing: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-blue-700">{id}</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-1">
          <EditProductForm initialData={serializedProduct} />
        </div>
      </div>
    </div>
  );
}