export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { signupSchema } from "@/lib/validator";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // force correct Prisma type
    const user = await prisma.user.create({
      data: {
        name: name as string,
        email: email as string,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const token = generateToken(user.id);

    return Response.json({
      message: "User created successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}