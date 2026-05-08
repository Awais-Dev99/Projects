import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Check if the user is trying to access ANY admin route
    const isAdminPath = pathname.startsWith("/admin");

    // Protect Admin routes: If not an admin, send to homepage
    if (isAdminPath && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      // authorized returns true if there is a token (user is logged in)
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login", // Redirects here if authorized returns false
    },
  }
);

export const config = {
  /*
   * Matcher excludes:
   * 1. /api (auth routes)
   * 2. /_next (static files)
   * 3. / (homepage)
   * 4. /login and /signup (auth pages)
   * 5. favicon and public images
   */
  matcher: [
    "/admin/:path*", 
    "/my-orders/:path*", 
    "/cart", 
    "/checkout",
    "/account/:path*"
  ],
};