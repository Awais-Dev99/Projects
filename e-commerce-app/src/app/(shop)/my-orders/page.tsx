// src/app/(shop)/orders/[id]/page.tsx
import { Package, Truck, CheckCircle } from 'lucide-react';

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order #{params.id}</h1>
          <p className="text-gray-500">Placed on Oct 24, 2026</p>
        </div>
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-bold">SHIPPED</span>
      </div>

      {/* Tracking Timeline */}
      <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
        <div className="flex gap-6 items-start relative z-10">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white ring-8 ring-white"><Package size={20}/></div>
          <div><p className="font-bold">Order Confirmed</p><p className="text-sm text-gray-500">Oct 24 - 10:00 AM</p></div>
        </div>
        <div className="flex gap-6 items-start relative z-10">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white ring-8 ring-white"><Truck size={20}/></div>
          <div><p className="font-bold">Shipped with DHL</p><p className="text-sm text-gray-500">Oct 25 - 02:30 PM</p><p className="text-blue-600 text-sm font-medium">Tracking ID: DHL-99821</p></div>
        </div>
        <div className="flex gap-6 items-start relative z-10 opacity-30">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white ring-8 ring-white"><CheckCircle size={20}/></div>
          <div><p className="font-bold text-gray-400">Delivered</p></div>
        </div>
      </div>
    </div>
  );
}