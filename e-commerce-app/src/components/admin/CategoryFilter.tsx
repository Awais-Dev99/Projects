"use client";

import { useRouter } from "next/navigation";

const categories = ["Electronics", "Clothing", "Home & Garden", "Accessories", "Health"];

export default function CategoryFilter({ currentCategory }: { currentCategory: string }) {
  const router = useRouter();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Pushes the new category to the URL ?category=Name
    if (value) {
      router.push(`/admin/products?category=${value}`);
    } else {
      router.push(`/admin/products`);
    }
  };

  return (
    <select
      value={currentCategory}
      onChange={handleFilterChange}
      className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}