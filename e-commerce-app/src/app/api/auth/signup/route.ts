import { NextResponse } from "next/server";
import { connectToDatabase } from "./../../../../lib/db"; // Use the alias
import User from "./../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, email, password, cardNumber, expiryDate, cvc } = await req.json();

    if (!name || !email || !password || !cardNumber || !expiryDate || !cvc) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const sanitizedCardNumber = cardNumber.toString().replace(/\D/g, "");
    if (sanitizedCardNumber.length < 13 || sanitizedCardNumber.length > 19) {
      return NextResponse.json({ error: "Invalid credit card number" }, { status: 400 });
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryDate)) {
      return NextResponse.json({ error: "Expiry date must be in MM/YY format" }, { status: 400 });
    }

    const cvcRegex = /^\d{3,4}$/;
    if (!cvcRegex.test(cvc.toString())) {
      return NextResponse.json({ error: "CVC must be 3 or 4 digits" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      cardLast4: sanitizedCardNumber.slice(-4),
      cardExpiry: expiryDate,
    });

    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (error: any) {
    console.error("SIGNUP_API_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}