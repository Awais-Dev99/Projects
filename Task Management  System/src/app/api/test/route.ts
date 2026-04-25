import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const users = await prisma.user.findMany();

    return Response.json({
      success: true,
      data: users,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: "Database connection failed",
    });
  }
}