import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import { loginSchema } from "@/lib/validator";

const JWT_SECRET = process.env.JWT_SECRET!; // ✅ FIXED

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // ✅ Validate input
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data; // ✅ use validated data
    console.log("INPUT EMAIL:", email);
console.log("ENV EMAIL:", process.env.OWNER_EMAIL);
console.log("INPUT PASSWORD:", password);

    // 🟡 OWNER LOGIN
  const inputEmail = email.trim().toLowerCase();
const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();

if (inputEmail === ownerEmail) {
  const isMatch = await bcrypt.compare(
    password,
    process.env.OWNER_PASSWORD_HASH!
  );

  if (!isMatch) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // ✅ 1. Create token
  const token = jwt.sign(
    { email, role: "OWNER" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // ✅ 2. Create response
  const response = NextResponse.json({
    message: "Owner login successful",
    role: "OWNER",
  });

  // ✅ 3. Set cookie
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: false,
    path: "/",
  });

  // ✅ 4. Return response
  return response;
}
    // 🟢 NORMAL USER LOGIN
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🔴 AUTHOR APPROVAL CHECK
    if (user.role === "AUTHOR") {
      if (user.status === "PENDING") {
        return NextResponse.json(
          { error: "Your account is pending approval" },
          { status: 403 }
        );
      }

      if (user.status === "REJECTED") {
        return NextResponse.json(
          { error: "Your request was rejected by admin" },
          { status: 403 }
        );
      }
    }

    // 🔵 GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      role: user.role,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error); // ✅ DEBUG
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}