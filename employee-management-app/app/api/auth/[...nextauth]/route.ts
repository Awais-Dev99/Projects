import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

/**
 * This handler initializes NextAuth using the configuration 
 * defined in your lib/auth.ts file.
 */
const handler = NextAuth(authOptions);

/**
 * In the Next.js App Router, we must explicitly export 
 * the handler for both GET and POST requests.
 */
export { handler as GET, handler as POST };