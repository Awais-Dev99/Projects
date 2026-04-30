import NextAuth, { NextAuthOptions } from "next-auth"; // Added NextAuthOptions for type safety
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// 1. Move the configuration into a named constant and EXPORT it
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your credentials.");
        }

        // STRICT ADMIN CHECK
        if (credentials.email === process.env.ADMIN_EMAIL) {
          const isAdminPass = await bcrypt.compare(
            credentials.password,
            process.env.ADMIN_PASSWORD_HASH!
          );

          if (isAdminPass) {
            return { 
              id: "admin-master", 
              name: process.env.ADMIN_NAME || "Admin", 
              email: process.env.ADMIN_EMAIL, 
              role: "admin" 
            };
          } else {
            throw new Error("Invalid Admin password.");
          }
        }

        // MONGODB CHECK
        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPassCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPassCorrect) {
          throw new Error("Incorrect password");
        }

        // AUTHOR APPROVAL CHECK
        if (user.role === "author" && user.status === "pending") {
          throw new Error("Your account is awaiting admin approval.");
        }

        return { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email, 
          role: user.role 
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id; // This is what the dashboard uses!
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

// 2. Pass the exported options into the handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };