import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Please enter both username and password");
        }

        const client = await clientPromise;
        const db = client.db("ems_database");

        // Look for the user in the employees collection
        const user = await db.collection("employees").findOne({ 
          username: credentials.username 
        });

        if (!user) {
          throw new Error("No user found with that username");
        }

        // Security Check: Only allow 'active' accounts to log in
        if (user.accountStatus !== "active") {
          throw new Error("Your account is disabled. Please contact an admin.");
        }

        // Verify the hashed password
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        // Return user data for the session
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.username, // Using username as the unique identifier
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirects here if auth is required
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};