import mongoose from "mongoose";
import { connectToDatabase } from "./../../../../lib/db";
import Order from "./../../../../models/Order";
import Link from "next/link";
import { notFound } from "next/navigation";

interface OrderDetailParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailParams) {
  await connectToDatabase();
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    notFound();
  }

  const order = await Order.findById(id).lean();

  if (!order) {
    notFound();
  }

  const serializedOrder = JSON.parse(JSON.stringify(order));

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black">Order Details</h1>
          <p className="text-gray-500 mt-2">Order ID: <span className="font-mono text-sm text-blue-600">{serializedOrder._id}</span></p>
        </div>
        <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 font-medium">
          &larr; Back to orders
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Customer Information</h2>
            <div className="grid gap-3 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Name:</span> {serializedOrder.user?.name}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {serializedOrder.user?.email}
              </div>
              <div>
                <span className="font-semibold">Phone:</span> {serializedOrder.user?.phone}
              </div>
              <div>
                <span className="font-semibold">Address:</span> {serializedOrder.user?.address}
              </div>
              <div>
                <span className="font-semibold">Status:</span> {serializedOrder.status}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <div className="grid gap-3 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Payment method:</span> {serializedOrder.paymentMethod || "Credit Card"}
              </div>
              <div>
                <span className="font-semibold">Card last 4 digits:</span> **** **** **** {serializedOrder.cardLast4}
              </div>
              <div>
                <span className="font-semibold">Expiry:</span> {serializedOrder.cardExpiry}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Items</h2>
            <div className="space-y-4">
              {serializedOrder.items?.map((item: any) => (
                <div key={item.productId || item.title} className="flex justify-between gap-4 items-center border-b border-gray-100 pb-3">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="grid gap-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Total items</span>
                <span>{serializedOrder.items?.reduce((acc: number, item: any) => acc + Number(item.quantity), 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>${serializedOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
