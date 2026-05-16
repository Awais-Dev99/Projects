import React from 'react';
import { connectToDatabase } from "./../../lib/db";
import Product from "./../../models/Product";
import FilterSidebar from "./../../components/shop/FilterSidebar"; 
import ProductCard from "./../../components/shop/ProductCard"; 
import { Search } from 'lucide-react';

// Force Next.js to fetch fresh data on every request
export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  await connectToDatabase();
  
  const filters = await searchParams;
  const category = filters.category;
  const maxPrice = filters.maxPrice;
  const search = filters.search;

  // Build Query
  const query: any = {};
  if (category && category !== "all") query.category = category;
  if (maxPrice) query.price = { $lte: Number(maxPrice) };
  if (search) query.title = { $regex: search, $options: 'i' };

  // Fetch and Serialize
  const rawProducts = await Product.find(query).sort({ createdAt: -1 }).lean();
  const products = JSON.parse(JSON.stringify(rawProducts));

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Featured Products</h1>
          <p className="text-gray-500 font-medium">
            Showing {products.length} {products.length === 1 ? 'product' : 'results'}
          </p>
        </div>

        <form className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            name="search"
            type="text" 
            defaultValue={search || ""}
            placeholder="Search products..." 
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </form>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <FilterSidebar currentCategory={category} />
          </div>
        </aside>

        <section className="flex-grow">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-900 font-bold text-xl">No products found</p>
              <p className="text-gray-500 text-sm mt-2">Try resetting your filters.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}