import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    await connectDB();

    // 🔐 Get auth header
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 401 }
      );
    }

    // 🔐 Verify token safely
    let decoded: any;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error("JWT ERROR:", err); // ✅ IMPORTANT
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // ❗ Only OWNER allowed
    if (decoded.role !== "OWNER") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 📦 Fetch pending users
    const pendingUsers = await User.find({
      role: "AUTHOR",
      status: "PENDING",
    }).select("-password");

    return NextResponse.json({ users: pendingUsers });

  } catch (error) {
    console.error("PENDING USERS ERROR:", error); // ✅ CRITICAL

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}