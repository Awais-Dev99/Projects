import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Article from "@/models/article";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    await connectDB();

    const articles = await Article.find().sort({ createdAt: -1 });

    return NextResponse.json({ articles });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    // ❗ Only APPROVED AUTHORS
    if (decoded.role !== "AUTHOR") {
      return NextResponse.json(
        { error: "Only authors can create articles" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content required" },
        { status: 400 }
      );
    }

    const article = await Article.create({
      title,
      content,
      authorId: decoded.id,
    });

    return NextResponse.json({
      message: "Article created",
      article,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}