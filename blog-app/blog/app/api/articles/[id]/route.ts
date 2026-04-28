import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Article from "@/models/article";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// 🔹 GET ONE ARTICLE
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const article = await Article.findById(params.id);

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching article" },
      { status: 500 }
    );
  }
}

// 🔹 UPDATE ARTICLE
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    if (decoded.role !== "AUTHOR") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const article = await Article.findById(params.id);

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // ❗ Only owner can edit
    if (article.authorId.toString() !== decoded.id) {
      return NextResponse.json(
        { error: "Not your article" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const updated = await Article.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    return NextResponse.json({
      message: "Article updated",
      article: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating article" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE ARTICLE
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    if (decoded.role !== "AUTHOR") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const article = await Article.findById(params.id);

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    if (article.authorId.toString() !== decoded.id) {
      return NextResponse.json(
        { error: "Not your article" },
        { status: 403 }
      );
    }

    await Article.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: "Article deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting article" },
      { status: 500 }
    );
  }
}