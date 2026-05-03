import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

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
          }
          throw new Error("Invalid Admin password.");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("No user found with this email");
        
        const isPassCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPassCorrect) throw new Error("Incorrect password");

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
      token.id = user.id; // Map the DB id to the token
      token.role = (user as any).role;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      (session.user as any).id = token.id; // Map token id to the session
      (session.user as any).role = token.role;
    }
    return session;
  },
},
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};