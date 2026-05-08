import { NextResponse } from 'next/server';
import { connectToDatabase } from './../../../lib/db';
import Product from './../../../models/Product';

// GET all products (with optional filtering)
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const query = category ? { category } : {};
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST a new product (Admin only logic should be added with middleware)
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 400 });
  }
}