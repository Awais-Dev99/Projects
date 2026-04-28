import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateUserFromToken(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);

    return decoded as {
      id?: string;
      email: string;
      role: string;
    };
  } catch (error) {
    return null;
  }
}