import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reaction from "@/models/Reaction";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// 🔹 ADD / UPDATE REACTION
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
        { error: "Only readers can react" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { articleId, type } = body;

    if (!articleId || !type) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 🔄 Check existing reaction
    const existing = await Reaction.findOne({
      userId: decoded.id,
      articleId,
    });

    if (existing) {
      // toggle logic
      if (existing.type === type) {
        await existing.deleteOne();

        return NextResponse.json({
          message: "Reaction removed",
        });
      } else {
        existing.type = type;
        await existing.save();

        return NextResponse.json({
          message: "Reaction updated",
        });
      }
    }

    // ➕ New reaction
    await Reaction.create({
      userId: decoded.id,
      articleId,
      type,
    });

    return NextResponse.json({
      message: "Reaction added",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to react" },
      { status: 500 }
    );
  }
}