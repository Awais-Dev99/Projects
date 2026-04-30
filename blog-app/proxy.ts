import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    // 1. Admin ONLY access
    // Only 'admin' can enter /admin routes
    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 2. Author access
    // Allows 'author' OR 'admin' to enter /author routes
    if (path.startsWith("/author") && role !== "author" && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      // This ensures the middleware only runs if the user is logged in
      authorized: ({ token }) => !!token,
    },
  }
);

// Define which paths are protected by this middleware
export const config = { 
  matcher: [
    "/admin/:path*", 
    "/author/:path*",
    // Add other protected routes here if needed
  ] 
};