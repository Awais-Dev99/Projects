import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

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
        // Ensure this matches the DB name used in your EmployeesPage
        const db = client.db("ems_database"); 
        
        // Remove '@' if the user typed it, and trim whitespace
        const cleanUsername = credentials.username.replace(/^@/, "").trim();

        // Search the "employees" collection (matching your getEmployees logic)
        const user = await db.collection("employees").findOne({
          username: { $regex: new RegExp(`^${cleanUsername}$`, "i") }
        });

        if (!user) {
          console.log(`❌ AUTH ERROR: No employee found with username "${cleanUsername}"`);
          return null;
        }

        // Validate the $2b$ hash from your database screenshot
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          console.log(`❌ AUTH ERROR: Password incorrect for ${cleanUsername}`);
          return null;
        }

        if (user.accountStatus !== 'active') {
          console.log(`❌ AUTH ERROR: Account ${cleanUsername} is ${user.accountStatus}`);
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.username, 
          role: user.role,
        };
      }
    }),
  ],
  callbacks: {
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