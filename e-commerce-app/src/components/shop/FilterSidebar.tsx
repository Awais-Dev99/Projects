"use client";

export default function FilterSidebar() {
  const categories = ["All", "Electronics", "Clothing", "Home", "Accessories"];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">Category</h3>
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat}>
              <button className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors">
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">Price Range</h3>
        <div className="space-y-4">
          <input type="range" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          <div className="flex justify-between text-xs font-bold text-gray-400">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">Availability</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}