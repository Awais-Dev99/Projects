import { NextResponse } from 'next/server';
import { connectToDatabase } from './../../../lib/db';
import Order from './../../../models/Order';
import Product from './../../../models/Product';

// POST: Create a new order after successful checkout
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const { 
      userId, 
      items, 
      totalAmount, 
      shippingAddress, 
      paymentIntentId 
    } = body;

    // 1. Basic Validation
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    // 2. Create the Order in MongoDB
    // Note: status defaults to 'Processing' based on our brainstormed schema
    const newOrder = await Order.create({
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentIntentId,
      status: 'Processing',
      createdAt: new Date(),
    });

    // 3. Inventory Control: Update stock levels
    // We loop through each ordered item and decrement the stock in the Product collection
    const updateInventory = items.map((item: any) => 
      Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      })
    );
    await Promise.all(updateInventory);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Fetch orders for a specific user (User History) 
// or all orders (if requested by Admin)
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // If a userId is provided, filter by user (Shop Side)
    // Otherwise, return all orders (Admin Side)
    const query = userId ? { userId } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}