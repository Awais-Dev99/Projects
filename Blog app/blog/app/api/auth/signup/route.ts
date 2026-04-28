import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, role } = body;

    // 🔹 Basic validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 🔹 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Role logic
    let status = "APPROVED";

    if (role === "AUTHOR") {
      status = "PENDING";
    }

    // 🔹 Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status,
    });

    return NextResponse.json({
      message:
        role === "AUTHOR"
          ? "Signup successful. Wait for admin approval."
          : "Signup successful",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}