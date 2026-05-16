import { NextResponse } from 'next/server';
import { connectToDatabase } from './../../../lib/db'; 
import Order from './../../../models/Order';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { userId, user, items, totalPrice, cardLast4, cardExpiry, paymentMethod } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please log in to place an order." }, { status: 401 });
    }

    if (!user || !items || !totalPrice || !cardLast4 || !cardExpiry) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newOrder = await Order.create({
      userId,
      user,
      items,
      totalPrice,
      paymentMethod: paymentMethod || "Credit Card",
      cardLast4,
      cardExpiry,
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Get query params to filter by userId if provided
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // If userId is provided, fetch only that user's orders
    if (userId) {
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      return NextResponse.json(orders);
    }

    // Otherwise return all orders (for admin)
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}