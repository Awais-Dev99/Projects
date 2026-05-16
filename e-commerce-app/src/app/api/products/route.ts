import { NextResponse } from 'next/server';
import { connectToDatabase } from './../../../lib/db'; 
import Product from './../../../models/Product';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const query = category ? { category } : {};
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { title, price, description, image, images, category, stock } = body;

    // 1. Validation
    if (!title || !price || !description) {
      return NextResponse.json(
        { error: "Title, Price, and Description are required." }, 
        { status: 400 }
      );
    }

    // 2. Resolve Image Logic
    // This looks for a single URL string from any possible source
    const imageUrl = image || (Array.isArray(images) && images.length > 0 ? images[0] : images);

    if (!imageUrl) {
      return NextResponse.json({ error: "Product image is required." }, { status: 400 });
    }

    // 3. Create Product mapped to your exact DB Structure
    const newProduct = await Product.create({
      title,
      price: parseFloat(price),
      description,
      category: category || "General",
      stock: parseInt(stock) || 0,
      // We wrap the single URL in an array to match your MongoDB screenshot
      images: [imageUrl], 
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("DB_ERROR:", error);
    return NextResponse.json(
      { 
        error: "Database save failed", 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}