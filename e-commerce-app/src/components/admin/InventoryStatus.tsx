interface InventoryStatusProps {
  stock: number;
}

export default function InventoryStatus({ stock }: InventoryStatusProps) {
  let statusColor = "bg-green-100 text-green-700 border-green-200";
  let statusText = "In Stock";

  if (stock === 0) {
    statusColor = "bg-red-100 text-red-700 border-red-200";
    statusText = "Out of Stock";
  } else if (stock <= 10) {
    statusColor = "bg-orange-100 text-orange-700 border-orange-200";
    statusText = `Low Stock: ${stock}`;
  } else {
    statusText = `${stock} Available`;
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
      {statusText}
    </span>
  );
}