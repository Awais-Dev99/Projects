import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/comment";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// 🔹 GET COMMENTS BY ARTICLE
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("articleId");

    const comments = await Comment.find({ articleId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// 🔹 POST COMMENT (Reader only)
export async function POST(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "READER") {
      return NextResponse.json(
        { error: "Only readers can comment" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { content, articleId } = body;

    if (!content || !articleId) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const comment = await Comment.create({
      content,
      articleId,
      userId: decoded.id,
    });

    return NextResponse.json({
      message: "Comment added",
      comment,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}