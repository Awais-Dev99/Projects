import { NextResponse } from 'next/server';
import { connectToDatabase } from './../../../../lib/db';
import Order from './../../../../models/Order';

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { orderId, status } = await req.json();
    
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { status }, 
      { new: true }
    );

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}