import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import { connectToDatabase } from '../../../lib/db';
import Product from '../../../models/Product';
import DeleteProductButton from "../../../components/admin/DeleteProductButton";
import InventoryStatus from "../../../components/admin/InventoryStatus";
import CategoryFilter from "../../../components/admin/CategoryFilter"; 

export const revalidate = 0;

export default async function AdminProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ category?: string }> 
}) {
  await connectToDatabase();
  
  // 1. Properly await params for Next.js 15
  const params = await searchParams;
  const category = params.category;

  // 2. Build Query
  const query = category ? { category } : {};
  
  const rawProducts = await Product.find(query).sort({ createdAt: -1 }).lean();
  
  // 3. Essential Serialization for Client Components
  const products = JSON.parse(JSON.stringify(rawProducts));

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products ({products.length})</h1>
          <p className="text-sm text-gray-500">Manage your inventory and stock</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Category Dropdown Component */}
          <CategoryFilter currentCategory={category || ""} />

          <Link 
            href="/admin/products/new" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={20} /> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Name</th>
              <th className="p-4 font-semibold text-gray-700">Category</th>
              <th className="p-4 font-semibold text-gray-700">Price</th>
              <th className="p-4 font-semibold text-gray-700">Stock</th>
              <th className="p-4 font-semibold text-center text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product: any) => (
                <tr key={product._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{product.title}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                      {product.category || "General"}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <InventoryStatus stock={product.stock || 0} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/admin/products/edit/${product._id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteProductButton productId={product._id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400 font-medium italic">
                  No products found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}