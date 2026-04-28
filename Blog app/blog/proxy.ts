import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Protect OWNER routes
  if (pathname.startsWith("/owner") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect AUTHOR routes
  if (pathname.startsWith("/author") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/author/:path*"],
};