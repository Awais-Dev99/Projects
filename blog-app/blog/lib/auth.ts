import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET!;

// 🔐 Generate JWT Token
export function generateToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

// 🔑 Compare Password
export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}

// 🔒 Hash Password
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}