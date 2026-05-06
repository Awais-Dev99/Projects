// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const client = await clientPromise;
        const db = client.db();
        
        // Find the employee account created by the Admin
        const user = await db.collection("users").findOne({ 
          username: credentials.username 
        });

        // Verify credentials and check if the account is active
        if (user && user.password === credentials.password && user.accountStatus === 'active') {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role, // e.g., 'admin', 'employee'
          };
        }
        return null;
      }
    }),
  ],
  callbacks: {
    // Explicitly type parameters to resolve "implicit any" errors
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: "/" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };