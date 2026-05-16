import { connectToDatabase } from "./../../../lib/db";
import Product from "./../../../models/Product";
import ProductCard from "./../../../components/shop/ProductCard";

export default async function AllProductsPage({ searchParams: _searchParams }: any) {
  await connectToDatabase();
  
  // Basic fetching - we will add filters here in step 3
  const products = await Product.find({}).lean();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product: any) => (
        <ProductCard key={product._id} product={JSON.parse(JSON.stringify(product))} />
      ))}
    </div>
  );
}