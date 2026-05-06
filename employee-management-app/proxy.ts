import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    // We no longer check for isAdminRoute or token.role here
    return NextResponse.next();
  },
  {
    callbacks: {
      // The middleware only runs if authorized() returns true (user is logged in)
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

/**
 * Configure which paths the middleware should run on.
 * Removed "/admin/:path*" so it is no longer protected by this script.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*"
  ],
};