import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    // Admin Access
    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Author Access
    if (path.startsWith("/author") && role !== "author" && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Reader Access
    if (path.startsWith("/reader") && role !== "reader" && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      // ONLY require authorization if the user is hitting a matched route
      authorized: ({ token }) => !!token,
    },
    pages: {
        signIn: "/login"
    }
  }
);

export const config = { 
  matcher: [
    "/admin/:path*", 
    "/author/:path*",
    "/reader/:path*",
  ] 
};