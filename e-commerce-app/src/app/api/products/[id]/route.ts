import { NextResponse } from 'next/server';
import { connectToDatabase } from './../../../../lib/db';
import Product from './../../../../models/Product';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const product = await Product.findById(params.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const body = await req.json();
  const updated = await Product.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Product deleted" });
}